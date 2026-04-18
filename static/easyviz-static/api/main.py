"""
FastAPI proxy + catalog for easyviz-static.

We don't host any data ourselves — every /data and /compare call fans
out to the World Bank v2 API and reshapes the response into a shape
that Chart.js can consume without client-side gymnastics.

Design choices:
  * On-disk cache (parquet-less; just JSON) with a 24-hour TTL keyed by
    (indicator_code, iso3-list). The WB API is rate-limited and slow
    on cold calls; caching pays for itself after the second request.
  * rapidfuzz for indicator search — same library the Streamlit app
    uses, so ranking is consistent between the two surfaces.
  * Permissive CORS so the static site can be hosted anywhere (Pages,
    Netlify, a local `python -m http.server`) and still hit the API.
"""

from __future__ import annotations

import asyncio
import json
import os
import time
from pathlib import Path
from typing import Any

import httpx
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from rapidfuzz import fuzz, process

from .catalog import INDICATORS, by_id

# ── Config ────────────────────────────────────────────────────────────────────

WB_BASE = "https://api.worldbank.org/v2"
CACHE_DIR = Path(os.environ.get("EASYVIZ_STATIC_CACHE", Path.home() / ".cache" / "easyviz-static"))
CACHE_TTL_SECONDS = 24 * 60 * 60

CACHE_DIR.mkdir(parents=True, exist_ok=True)

app = FastAPI(
    title="easyviz-static API",
    version="0.1.0",
    description="Thin proxy in front of the World Bank WDI API, serving a curated catalog.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET"],
    allow_headers=["*"],
)

# ── Disk cache ────────────────────────────────────────────────────────────────

def _cache_path(key: str) -> Path:
    safe = key.replace("/", "_").replace(";", "_")
    return CACHE_DIR / f"{safe}.json"


def _cache_get(key: str) -> Any | None:
    p = _cache_path(key)
    if not p.exists():
        return None
    age = time.time() - p.stat().st_mtime
    if age > CACHE_TTL_SECONDS:
        return None
    try:
        return json.loads(p.read_text())
    except Exception:
        return None


def _cache_put(key: str, value: Any) -> None:
    try:
        _cache_path(key).write_text(json.dumps(value))
    except Exception:
        pass  # cache is best-effort

# ── World Bank fetch ──────────────────────────────────────────────────────────

async def _wb_fetch(code: str, iso3_list: list[str]) -> list[dict]:
    """Return a long-format list of {iso3, country, year, value} rows."""
    iso3_joined = ";".join(iso3_list) if iso3_list else "all"
    key = f"wdi__{code}__{iso3_joined}"

    cached = _cache_get(key)
    if cached is not None:
        return cached

    url = f"{WB_BASE}/country/{iso3_joined}/indicator/{code}"
    params = {"format": "json", "per_page": "20000", "date": "1960:2025"}
    async with httpx.AsyncClient(timeout=30.0) as client:
        r = await client.get(url, params=params)
    if r.status_code != 200:
        raise HTTPException(502, f"World Bank API returned {r.status_code}")

    payload = r.json()
    if not isinstance(payload, list) or len(payload) < 2 or payload[1] is None:
        return []

    rows: list[dict] = []
    for rec in payload[1]:
        v = rec.get("value")
        if v is None:
            continue
        try:
            year = int(rec["date"])
        except (KeyError, ValueError, TypeError):
            continue
        rows.append(
            {
                "iso3":    rec["countryiso3code"] or rec["country"]["id"],
                "country": rec["country"]["value"],
                "year":    year,
                "value":   float(v),
            }
        )

    _cache_put(key, rows)
    return rows

# ── Routes ────────────────────────────────────────────────────────────────────

@app.get("/health")
async def health() -> dict:
    return {"status": "ok", "catalog_size": len(INDICATORS)}


@app.get("/indicators")
async def indicators(q: str = Query("", description="Fuzzy search query")) -> dict:
    if not q:
        return {"results": INDICATORS}
    # Index rapidfuzz over a synthetic "name + tags + category" string so
    # typing "co2" or "emissions" or "climate" all converge on the same row.
    corpus = {
        r["id"]: f"{r['name']} {r['category']} {' '.join(r['tags'])}" for r in INDICATORS
    }
    matches = process.extract(
        q, corpus, scorer=fuzz.WRatio, limit=len(INDICATORS), score_cutoff=30
    )
    scored_ids = [(match_key, score) for (_text, score, match_key) in matches]
    by_key = {r["id"]: r for r in INDICATORS}
    return {"results": [{**by_key[k], "score": s} for (k, s) in scored_ids]}


@app.get("/indicators/{indicator_id}")
async def indicator_detail(indicator_id: str) -> dict:
    row = by_id(indicator_id)
    if row is None:
        raise HTTPException(404, f"Indicator '{indicator_id}' not in catalog")
    return row


@app.get("/data")
async def data(
    id: str = Query(..., description="Catalog indicator id"),
    countries: str = Query("", description="Comma-separated ISO3 list (empty = all)"),
) -> dict:
    row = by_id(id)
    if row is None:
        raise HTTPException(404, f"Indicator '{id}' not in catalog")
    iso3_list = [c.strip().upper() for c in countries.split(",") if c.strip()]
    rows = await _wb_fetch(row["code"], iso3_list)
    return {"indicator": row, "data": rows}


@app.get("/compare")
async def compare(
    a: str = Query(..., description="First indicator id"),
    b: str = Query(..., description="Second indicator id"),
    year: int = Query(..., description="Cross-section year"),
    countries: str = Query("", description="Comma-separated ISO3 list (empty = all)"),
) -> dict:
    row_a, row_b = by_id(a), by_id(b)
    if row_a is None or row_b is None:
        raise HTTPException(404, "One or both indicators not in catalog")

    iso3_list = [c.strip().upper() for c in countries.split(",") if c.strip()]
    # Fetch both series concurrently — halves the user-perceived latency.
    rows_a, rows_b = await asyncio.gather(
        _wb_fetch(row_a["code"], iso3_list),
        _wb_fetch(row_b["code"], iso3_list),
    )

    by_iso_a = {r["iso3"]: r for r in rows_a if r["year"] == year}
    by_iso_b = {r["iso3"]: r for r in rows_b if r["year"] == year}
    common = set(by_iso_a) & set(by_iso_b)

    points = [
        {
            "iso3":    iso3,
            "country": by_iso_a[iso3]["country"],
            "x":       by_iso_a[iso3]["value"],
            "y":       by_iso_b[iso3]["value"],
        }
        for iso3 in sorted(common)
    ]
    return {
        "indicator_a": row_a,
        "indicator_b": row_b,
        "year":        year,
        "points":      points,
    }
