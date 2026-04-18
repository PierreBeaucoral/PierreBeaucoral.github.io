"""
Curated indicator catalog for easyviz-static.

Kept small on purpose — the Streamlit EasyViz has 80+ entries, but for
a static demo a dozen is plenty and keeps the dropdowns fast.
"""

INDICATORS: list[dict] = [
    {
        "id":        "gdp_per_capita_ppp",
        "name":      "GDP per Capita, PPP (constant 2017 USD)",
        "category":  "Economy",
        "source":    "wdi",
        "code":      "NY.GDP.PCAP.PP.KD",
        "unit":      "int $ (2017)",
        "tags":      ["gdp", "income", "ppp", "economy"],
    },
    {
        "id":        "life_expectancy",
        "name":      "Life Expectancy at Birth",
        "category":  "Health",
        "source":    "wdi",
        "code":      "SP.DYN.LE00.IN",
        "unit":      "years",
        "tags":      ["health", "life", "expectancy", "longevity"],
    },
    {
        "id":        "under5_mortality",
        "name":      "Under-5 Mortality Rate",
        "category":  "Health",
        "source":    "wdi",
        "code":      "SH.DYN.MORT",
        "unit":      "per 1,000 live births",
        "tags":      ["health", "mortality", "child"],
    },
    {
        "id":        "co2_per_capita",
        "name":      "CO₂ Emissions per Capita",
        "category":  "Environment",
        "source":    "wdi",
        "code":      "EN.ATM.CO2E.PC",
        "unit":      "metric tons",
        "tags":      ["climate", "co2", "emissions", "environment"],
    },
    {
        "id":        "access_electricity",
        "name":      "Access to Electricity",
        "category":  "Environment",
        "source":    "wdi",
        "code":      "EG.ELC.ACCS.ZS",
        "unit":      "% of population",
        "tags":      ["electricity", "energy", "access"],
    },
    {
        "id":        "literacy_rate",
        "name":      "Adult Literacy Rate",
        "category":  "Education",
        "source":    "wdi",
        "code":      "SE.ADT.LITR.ZS",
        "unit":      "% of adults",
        "tags":      ["education", "literacy"],
    },
    {
        "id":        "fertility_rate",
        "name":      "Fertility Rate",
        "category":  "Demographics",
        "source":    "wdi",
        "code":      "SP.DYN.TFRT.IN",
        "unit":      "births per woman",
        "tags":      ["demographics", "fertility"],
    },
    {
        "id":        "urban_pop",
        "name":      "Urban Population",
        "category":  "Demographics",
        "source":    "wdi",
        "code":      "SP.URB.TOTL.IN.ZS",
        "unit":      "% of total",
        "tags":      ["demographics", "urban"],
    },
    {
        "id":        "gov_health_spend",
        "name":      "Government Health Expenditure",
        "category":  "Health",
        "source":    "wdi",
        "code":      "SH.XPD.CHEX.GD.ZS",
        "unit":      "% of GDP",
        "tags":      ["health", "spending", "government"],
    },
    {
        "id":        "poverty_headcount_215",
        "name":      "Poverty Headcount Ratio at $2.15/day",
        "category":  "Economy",
        "source":    "wdi",
        "code":      "SI.POV.DDAY",
        "unit":      "% of population",
        "tags":      ["poverty", "inequality"],
    },
    {
        "id":        "unemployment",
        "name":      "Unemployment Rate",
        "category":  "Economy",
        "source":    "wdi",
        "code":      "SL.UEM.TOTL.ZS",
        "unit":      "% of labor force",
        "tags":      ["unemployment", "labor"],
    },
    {
        "id":        "internet_users",
        "name":      "Internet Users",
        "category":  "Governance",
        "source":    "wdi",
        "code":      "IT.NET.USER.ZS",
        "unit":      "% of population",
        "tags":      ["internet", "ict"],
    },
]


def by_id(indicator_id: str) -> dict | None:
    return next((r for r in INDICATORS if r["id"] == indicator_id), None)
