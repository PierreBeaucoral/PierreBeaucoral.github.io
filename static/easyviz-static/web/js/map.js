// D3 choropleth map. Data comes from the WDI client; country geometry
// comes from Natural Earth via the topojson world-atlas CDN bundle
// (https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json).
//
// The atlas keys countries by numeric ISO-3166 codes. WDI returns ISO3
// alpha codes. iso-3166-1 mapping is small and ships inline below.

const ATLAS_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

let _atlas = null;
let _tooltip = null;

export async function loadAtlas() {
  if (_atlas) return _atlas;
  const r = await fetch(ATLAS_URL);
  if (!r.ok) throw new Error(`Failed to load world atlas (${r.status})`);
  _atlas = await r.json();
  return _atlas;
}

function ensureTooltip(container) {
  if (_tooltip) return _tooltip;
  _tooltip = document.createElement("div");
  _tooltip.className = "map-tooltip";
  _tooltip.style.opacity = "0";
  container.appendChild(_tooltip);
  return _tooltip;
}

// Minimal ISO numeric → ISO3 alpha lookup covering every country in the
// natural-earth 110m atlas. Derived from iso-3166-1.
const NUM_TO_ISO3 = {
  "004":"AFG","008":"ALB","010":"ATA","012":"DZA","016":"ASM","020":"AND","024":"AGO",
  "028":"ATG","031":"AZE","032":"ARG","036":"AUS","040":"AUT","044":"BHS","048":"BHR",
  "050":"BGD","051":"ARM","052":"BRB","056":"BEL","060":"BMU","064":"BTN","068":"BOL",
  "070":"BIH","072":"BWA","074":"BVT","076":"BRA","084":"BLZ","086":"IOT","090":"SLB",
  "092":"VGB","096":"BRN","100":"BGR","104":"MMR","108":"BDI","112":"BLR","116":"KHM",
  "120":"CMR","124":"CAN","132":"CPV","136":"CYM","140":"CAF","144":"LKA","148":"TCD",
  "152":"CHL","156":"CHN","158":"TWN","162":"CXR","166":"CCK","170":"COL","174":"COM",
  "175":"MYT","178":"COG","180":"COD","184":"COK","188":"CRI","191":"HRV","192":"CUB",
  "196":"CYP","203":"CZE","204":"BEN","208":"DNK","212":"DMA","214":"DOM","218":"ECU",
  "222":"SLV","226":"GNQ","231":"ETH","232":"ERI","233":"EST","234":"FRO","238":"FLK",
  "239":"SGS","242":"FJI","246":"FIN","248":"ALA","250":"FRA","254":"GUF","258":"PYF",
  "260":"ATF","262":"DJI","266":"GAB","268":"GEO","270":"GMB","275":"PSE","276":"DEU",
  "288":"GHA","292":"GIB","296":"KIR","300":"GRC","304":"GRL","308":"GRD","312":"GLP",
  "316":"GUM","320":"GTM","324":"GIN","328":"GUY","332":"HTI","334":"HMD","336":"VAT",
  "340":"HND","344":"HKG","348":"HUN","352":"ISL","356":"IND","360":"IDN","364":"IRN",
  "368":"IRQ","372":"IRL","376":"ISR","380":"ITA","384":"CIV","388":"JAM","392":"JPN",
  "398":"KAZ","400":"JOR","404":"KEN","408":"PRK","410":"KOR","414":"KWT","417":"KGZ",
  "418":"LAO","422":"LBN","426":"LSO","428":"LVA","430":"LBR","434":"LBY","438":"LIE",
  "440":"LTU","442":"LUX","446":"MAC","450":"MDG","454":"MWI","458":"MYS","462":"MDV",
  "466":"MLI","470":"MLT","474":"MTQ","478":"MRT","480":"MUS","484":"MEX","492":"MCO",
  "496":"MNG","498":"MDA","499":"MNE","500":"MSR","504":"MAR","508":"MOZ","512":"OMN",
  "516":"NAM","520":"NRU","524":"NPL","528":"NLD","531":"CUW","533":"ABW","534":"SXM",
  "535":"BES","540":"NCL","548":"VUT","554":"NZL","558":"NIC","562":"NER","566":"NGA",
  "570":"NIU","574":"NFK","578":"NOR","580":"MNP","581":"UMI","583":"FSM","584":"MHL",
  "585":"PLW","586":"PAK","591":"PAN","598":"PNG","600":"PRY","604":"PER","608":"PHL",
  "612":"PCN","616":"POL","620":"PRT","624":"GNB","626":"TLS","630":"PRI","634":"QAT",
  "638":"REU","642":"ROU","643":"RUS","646":"RWA","652":"BLM","654":"SHN","659":"KNA",
  "660":"AIA","662":"LCA","663":"MAF","666":"SPM","670":"VCT","674":"SMR","678":"STP",
  "682":"SAU","686":"SEN","688":"SRB","690":"SYC","694":"SLE","702":"SGP","703":"SVK",
  "704":"VNM","705":"SVN","706":"SOM","710":"ZAF","716":"ZWE","724":"ESP","728":"SSD",
  "729":"SDN","732":"ESH","740":"SUR","744":"SJM","748":"SWZ","752":"SWE","756":"CHE",
  "760":"SYR","762":"TJK","764":"THA","768":"TGO","772":"TKL","776":"TON","780":"TTO",
  "784":"ARE","788":"TUN","792":"TUR","795":"TKM","796":"TCA","798":"TUV","800":"UGA",
  "804":"UKR","807":"MKD","818":"EGY","826":"GBR","831":"GGY","832":"JEY","833":"IMN",
  "834":"TZA","840":"USA","850":"VIR","854":"BFA","858":"URY","860":"UZB","862":"VEN",
  "876":"WLF","882":"WSM","887":"YEM","894":"ZMB",
  // Non-ISO (natural-earth quirks)
  "-99":"XXX", "0":"XXX",
};

function numToIso3(n) {
  const key = String(n).padStart(3, "0");
  return NUM_TO_ISO3[key] || NUM_TO_ISO3[String(n)] || null;
}

// Quantile breaks (k classes) for a value array.
function quantileBreaks(values, k) {
  const sorted = [...values].filter(v => Number.isFinite(v)).sort((a, b) => a - b);
  if (!sorted.length) return [];
  const out = [];
  for (let i = 1; i < k; i++) {
    const idx = Math.floor((i / k) * sorted.length);
    out.push(sorted[Math.min(idx, sorted.length - 1)]);
  }
  return out;
}

function logSafe(v) { return Math.log10(Math.max(v, 1e-12)); }

import { SEQUENTIAL as PALETTES, continuousColor as colorRamp, seqKind } from "./palettes.js";
export { SEQUENTIAL as PALETTES } from "./palettes.js";

// Classic equirectangular projection (no D3 to keep bundle small).
// We compute a simple linear mapping: [-180,180] → [0,w], [90,-90] → [0,h].
function project([x, y], w, h) {
  return [ (x + 180) / 360 * w, (90 - y) / 180 * h ];
}

// Split a ring of [lon, lat] at antimeridian (±180°) crossings.
// Without this, countries like Russia or Fiji render as a horizontal
// band stretching across the whole map because consecutive vertices
// jump from ~179° to ~-179°, and a straight line in screen space cuts
// through every other country on that latitude.
//
// Strategy: at each crossing, insert interpolated vertices at ±180°
// with the latitude linearly interpolated at the crossing, and split
// the ring into two sub-rings each closed at the antimeridian.
function splitAntimeridian(points) {
  const out = [[]];
  for (let i = 0; i < points.length; i++) {
    const cur = points[i];
    out[out.length - 1].push(cur);
    if (i + 1 < points.length) {
      const nxt = points[i + 1];
      const dx = nxt[0] - cur[0];
      if (dx > 180) {
        // Crossing westward through the antimeridian.
        const t = (-180 - cur[0]) / (nxt[0] - 360 - cur[0]);
        const yAt = cur[1] + t * (nxt[1] - cur[1]);
        out[out.length - 1].push([-180, yAt]);
        out.push([[180, yAt]]);
      } else if (dx < -180) {
        // Crossing eastward through the antimeridian.
        const t = (180 - cur[0]) / (nxt[0] + 360 - cur[0]);
        const yAt = cur[1] + t * (nxt[1] - cur[1]);
        out[out.length - 1].push([180, yAt]);
        out.push([[-180, yAt]]);
      }
    }
  }
  // Topojson rings are closed (first == last). A ring that crosses the
  // antimeridian an even number of times produces an odd number of
  // sub-rings, the first and last of which are really the two halves
  // of a single piece lying on the *same* side of the antimeridian.
  // Without merging, each half gets an implicit "Z" that draws a
  // diagonal clear across the map (the Chukotka / eastern-Russia
  // artifact). Merge the head into the tail so the combined piece
  // closes cleanly along the antimeridian edge.
  if (out.length > 1) {
    const first = points[0], last = points[points.length - 1];
    const closed = first && last && first[0] === last[0] && first[1] === last[1];
    if (closed) {
      const head = out.shift();
      const tail = out[out.length - 1];
      const te = tail[tail.length - 1];
      const startIdx = (head.length && te && head[0][0] === te[0] && head[0][1] === te[1]) ? 1 : 0;
      for (let i = startIdx; i < head.length; i++) tail.push(head[i]);
    }
  }
  return out;
}

// Walk geometry rings and emit SVG path data. Supports Polygon and
// MultiPolygon (the only geometry types present in world-atlas 110m).
function pathFor(geom, w, h, arcs) {
  const pieces = [];
  function arc(idx) {
    // topojson arcs are delta-encoded.
    const reverse = idx < 0;
    const i = reverse ? ~idx : idx;
    const pts = arcs[i];
    const out = [];
    let x = 0, y = 0;
    for (const [dx, dy] of pts) {
      x += dx; y += dy;
      out.push([x, y]);
    }
    return reverse ? out.reverse() : out;
  }
  function ring(rgArcs) {
    const points = [];
    for (const arcIdx of rgArcs) {
      const pts = arc(arcIdx);
      for (const p of pts) points.push(p);
    }
    return points;
  }
  function toPath(rings) {
    let d = "";
    for (const r of rings) {
      if (!r.length) continue;
      // Decode to lon/lat first, then split at the antimeridian before
      // projecting to screen coords.
      const lonlat = r.map(transformPoint);
      const subs = splitAntimeridian(lonlat);
      for (const sub of subs) {
        if (sub.length < 2) continue;
        for (let i = 0; i < sub.length; i++) {
          const [sx, sy] = project(sub[i], w, h);
          d += (i === 0 ? "M" : "L") + sx.toFixed(1) + "," + sy.toFixed(1);
        }
        d += "Z";
      }
    }
    return d;
  }
  if (geom.type === "Polygon") {
    const rings = geom.arcs.map(ring);
    pieces.push(toPath(rings));
  } else if (geom.type === "MultiPolygon") {
    for (const poly of geom.arcs) {
      pieces.push(toPath(poly.map(ring)));
    }
  }
  return pieces.join("");
}

// topojson transforms (scale + translate applied to delta-encoded arcs).
let _transform = null;
function setTransform(t) { _transform = t; }
function transformPoint([x, y]) {
  if (!_transform) return [x, y];
  const s = _transform.scale, tr = _transform.translate;
  return [x * s[0] + tr[0], y * s[1] + tr[1]];
}

// ── Public: render a choropleth into a container ────────────────────────
//
// container: an HTMLElement (we inject SVG + legend + tooltip).
// rowsByIso3: Map<iso3, value>
// opts: { title, unit, log }
export async function renderChoropleth(container, rowsByIso3, opts = {}) {
  const atlas = await loadAtlas();
  container.innerHTML = "";
  const tooltip = ensureTooltip(container);

  const W = 980, H = 500;
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
  svg.classList.add("choropleth");
  container.appendChild(svg);

  setTransform(atlas.transform);

  const countries = atlas.objects.countries.geometries;
  const values = [...rowsByIso3.values()].filter(v => Number.isFinite(v));
  if (!values.length) {
    container.innerHTML = `<p style="padding:1rem; color: var(--fg-muted);">No data for the chosen year.</p>`;
    return;
  }

  const palette = opts.palette && PALETTES[opts.palette] ? opts.palette : "viridis";
  const reverse = Boolean(opts.reverse);
  const diverging = opts.diverging ?? (seqKind(palette) === "diverging");
  const center = Number.isFinite(opts.center) ? opts.center : 0;

  const lo = Math.min(...values), hi = Math.max(...values);
  // For diverging palettes, re-centre 0→0.5 so the mid-hue marks the
  // reference value. Extend the symmetric range to the wider tail so
  // neither side saturates prematurely.
  const half = diverging ? Math.max(Math.abs(hi - center), Math.abs(center - lo)) : 0;
  const norm = (v) => {
    if (!Number.isFinite(v)) return NaN;
    if (diverging) {
      if (half === 0) return 0.5;
      return 0.5 + (v - center) / (2 * half);
    }
    if (opts.log && lo > 0) {
      const lloN = logSafe(lo), lhiN = logSafe(hi);
      if (lhiN === lloN) return 0.5;
      return (logSafe(v) - lloN) / (lhiN - lloN);
    }
    if (hi === lo) return 0.5;
    return (v - lo) / (hi - lo);
  };

  for (const geo of countries) {
    const iso3 = numToIso3(geo.id);
    const val = iso3 ? rowsByIso3.get(iso3) : undefined;
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathFor(geo, W, H, atlas.arcs));
    path.classList.add("country");
    if (val === undefined || !Number.isFinite(val)) {
      path.classList.add("missing");
      path.setAttribute("fill", "#e1e1e1");
    } else {
      path.setAttribute("fill", colorRamp(norm(val), palette, reverse));
    }
    const name = geo.properties?.name || iso3 || "—";
    path.addEventListener("mousemove", (e) => {
      const rect = container.getBoundingClientRect();
      tooltip.style.opacity = "1";
      tooltip.style.left = `${e.clientX - rect.left + 12}px`;
      tooltip.style.top  = `${e.clientY - rect.top + 12}px`;
      tooltip.innerHTML = `<strong>${name}</strong>${iso3 ? ` (${iso3})` : ""}<br>
        ${val === undefined || !Number.isFinite(val) ? "— no data —"
          : `${val.toLocaleString(undefined, { maximumFractionDigits: 2 })}${opts.unit ? " " + opts.unit : ""}`}`;
    });
    path.addEventListener("mouseleave", () => { tooltip.style.opacity = "0"; });
    svg.appendChild(path);
  }

  // Legend.
  const legend = document.createElement("div");
  legend.className = "legend";
  const stops = 8;
  const swatches = [];
  for (let i = 0; i < stops; i++) {
    const t = i / (stops - 1);
    swatches.push(`<span class="swatch" style="background:${colorRamp(t, palette, reverse)}"></span>`);
  }
  const fmt = (v) => {
    if (!Number.isFinite(v)) return "—";
    return Math.abs(v) >= 1000 ? v.toFixed(0) : v.toFixed(2);
  };
  legend.innerHTML = `
    <span>${fmt(lo)}</span>
    <span class="swatches">${swatches.join("")}</span>
    <span>${fmt(hi)}</span>
    ${opts.unit ? `<span style="margin-left:0.5rem;">${opts.unit}</span>` : ""}
    ${opts.log ? `<span style="margin-left:0.5rem;">· log scale</span>` : ""}
  `;
  container.appendChild(legend);
}
