// Curated indicator catalog — ~100 high-signal WDI series covering the
// themes the Streamlit EasyViz exposes. Each row:
//   id       — stable slug used in URLs
//   name     — display name
//   category — top-level facet
//   source   — "wdi" for World Bank, "owid" for Our World in Data
//   code     — underlying WB/OWID code
//   unit     — y-axis label
//   tags     — extra search tokens (Fuse.js indexes these)
//
// "Load full WDI" in the UI extends the search space to the live WB
// /indicator endpoint (~20k entries), which is cached to localStorage.

export const INDICATORS = [
  // ── Economy ──────────────────────────────────────────────────────────────
  { id: "gdp_current",       name: "GDP (current US$)",                        category: "Economy", source: "wdi", code: "NY.GDP.MKTP.CD",      unit: "current US$",              tags: ["gdp", "output", "economy"] },
  { id: "gdp_growth",        name: "GDP growth (annual %)",                    category: "Economy", source: "wdi", code: "NY.GDP.MKTP.KD.ZG",   unit: "% annual",                 tags: ["gdp", "growth"] },
  { id: "gdp_pc_current",    name: "GDP per capita (current US$)",             category: "Economy", source: "wdi", code: "NY.GDP.PCAP.CD",      unit: "current US$",              tags: ["gdp", "income", "per capita"] },
  { id: "gdp_pc_ppp",        name: "GDP per capita, PPP (constant 2017 US$)",  category: "Economy", source: "wdi", code: "NY.GDP.PCAP.PP.KD",   unit: "int $ (2017)",             tags: ["gdp", "ppp", "income"] },
  { id: "gdp_pc_growth",     name: "GDP per capita growth (annual %)",         category: "Economy", source: "wdi", code: "NY.GDP.PCAP.KD.ZG",   unit: "% annual",                 tags: ["gdp", "growth", "per capita"] },
  { id: "gni_pc",            name: "GNI per capita, Atlas method (US$)",       category: "Economy", source: "wdi", code: "NY.GNP.PCAP.CD",      unit: "current US$",              tags: ["gni", "income"] },
  { id: "gni_pc_ppp",        name: "GNI per capita, PPP (current int $)",      category: "Economy", source: "wdi", code: "NY.GNP.PCAP.PP.CD",   unit: "int $",                    tags: ["gni", "ppp"] },
  { id: "inflation_cpi",     name: "Inflation, consumer prices (annual %)",    category: "Economy", source: "wdi", code: "FP.CPI.TOTL.ZG",      unit: "% annual",                 tags: ["inflation", "prices", "cpi"] },
  { id: "lending_rate",      name: "Lending interest rate (%)",                category: "Economy", source: "wdi", code: "FR.INR.LEND",         unit: "%",                        tags: ["interest", "rate", "lending"] },
  { id: "deposit_rate",      name: "Deposit interest rate (%)",                category: "Economy", source: "wdi", code: "FR.INR.DPST",         unit: "%",                        tags: ["interest", "rate", "deposit"] },
  { id: "exchange_rate",     name: "Official exchange rate (LCU per US$)",     category: "Economy", source: "wdi", code: "PA.NUS.FCRF",         unit: "LCU/US$",                  tags: ["exchange", "currency"] },
  { id: "exports_gdp",       name: "Exports of goods and services (% of GDP)", category: "Economy", source: "wdi", code: "NE.EXP.GNFS.ZS",      unit: "% of GDP",                 tags: ["trade", "exports"] },
  { id: "imports_gdp",       name: "Imports of goods and services (% of GDP)", category: "Economy", source: "wdi", code: "NE.IMP.GNFS.ZS",      unit: "% of GDP",                 tags: ["trade", "imports"] },
  { id: "fdi_inflows",       name: "FDI net inflows (% of GDP)",               category: "Economy", source: "wdi", code: "BX.KLT.DINV.WD.GD.ZS", unit: "% of GDP",                tags: ["fdi", "investment"] },
  { id: "current_account",   name: "Current account balance (% of GDP)",       category: "Economy", source: "wdi", code: "BN.CAB.XOKA.GD.ZS",   unit: "% of GDP",                 tags: ["current account", "trade"] },
  { id: "debt_central_gov",  name: "Central government debt, total (% of GDP)", category: "Economy", source: "wdi", code: "GC.DOD.TOTL.GD.ZS",  unit: "% of GDP",                 tags: ["debt", "government"] },
  { id: "unemployment",      name: "Unemployment, total (% of labor force)",    category: "Economy", source: "wdi", code: "SL.UEM.TOTL.ZS",     unit: "% of labor force",         tags: ["unemployment", "labor"] },
  { id: "lfp",               name: "Labor force participation rate (%)",       category: "Economy", source: "wdi", code: "SL.TLF.CACT.ZS",      unit: "% of population 15+",      tags: ["labor", "participation"] },
  { id: "employment_ratio",  name: "Employment to population ratio (%)",       category: "Economy", source: "wdi", code: "SL.EMP.TOTL.SP.ZS",   unit: "% of population 15+",      tags: ["labor", "employment"] },
  { id: "industry_va",       name: "Industry value added (% of GDP)",          category: "Economy", source: "wdi", code: "NV.IND.TOTL.ZS",      unit: "% of GDP",                 tags: ["industry", "sector"] },
  { id: "agriculture_va",    name: "Agriculture value added (% of GDP)",       category: "Economy", source: "wdi", code: "NV.AGR.TOTL.ZS",      unit: "% of GDP",                 tags: ["agriculture", "sector"] },
  { id: "services_va",       name: "Services value added (% of GDP)",          category: "Economy", source: "wdi", code: "NV.SRV.TOTL.ZS",      unit: "% of GDP",                 tags: ["services", "sector"] },
  { id: "capital_formation", name: "Gross capital formation (% of GDP)",       category: "Economy", source: "wdi", code: "NE.GDI.TOTL.ZS",      unit: "% of GDP",                 tags: ["investment", "capital"] },
  { id: "domestic_credit",   name: "Domestic credit to private sector (% GDP)", category: "Economy", source: "wdi", code: "FS.AST.PRVT.GD.ZS",  unit: "% of GDP",                 tags: ["finance", "credit"] },
  { id: "tax_revenue",       name: "Tax revenue (% of GDP)",                   category: "Economy", source: "wdi", code: "GC.TAX.TOTL.GD.ZS",   unit: "% of GDP",                 tags: ["tax", "government"] },

  // ── Poverty & Inequality ────────────────────────────────────────────────
  { id: "poverty_215",       name: "Poverty headcount at $2.15/day (%)",       category: "Poverty", source: "wdi", code: "SI.POV.DDAY",         unit: "% of population",          tags: ["poverty", "extreme"] },
  { id: "poverty_365",       name: "Poverty headcount at $3.65/day (%)",       category: "Poverty", source: "wdi", code: "SI.POV.LMIC",         unit: "% of population",          tags: ["poverty"] },
  { id: "poverty_685",       name: "Poverty headcount at $6.85/day (%)",       category: "Poverty", source: "wdi", code: "SI.POV.UMIC",         unit: "% of population",          tags: ["poverty"] },
  { id: "gini",              name: "Gini index",                               category: "Poverty", source: "wdi", code: "SI.POV.GINI",         unit: "index",                    tags: ["inequality", "gini"] },
  { id: "income_top10",      name: "Income share held by highest 10%",         category: "Poverty", source: "wdi", code: "SI.DST.10TH.10",      unit: "% of income",              tags: ["inequality", "top decile"] },
  { id: "income_bottom20",   name: "Income share held by lowest 20%",          category: "Poverty", source: "wdi", code: "SI.DST.FRST.20",      unit: "% of income",              tags: ["inequality"] },

  // ── Health ───────────────────────────────────────────────────────────────
  { id: "life_expectancy",   name: "Life expectancy at birth (years)",         category: "Health",  source: "wdi", code: "SP.DYN.LE00.IN",      unit: "years",                    tags: ["life", "longevity"] },
  { id: "life_exp_male",     name: "Life expectancy, male (years)",            category: "Health",  source: "wdi", code: "SP.DYN.LE00.MA.IN",   unit: "years",                    tags: ["life", "male"] },
  { id: "life_exp_female",   name: "Life expectancy, female (years)",          category: "Health",  source: "wdi", code: "SP.DYN.LE00.FE.IN",   unit: "years",                    tags: ["life", "female"] },
  { id: "u5_mortality",      name: "Mortality rate, under-5 (per 1,000)",      category: "Health",  source: "wdi", code: "SH.DYN.MORT",         unit: "per 1,000 live births",    tags: ["mortality", "child"] },
  { id: "infant_mortality",  name: "Mortality rate, infant (per 1,000)",       category: "Health",  source: "wdi", code: "SP.DYN.IMRT.IN",      unit: "per 1,000 live births",    tags: ["mortality", "infant"] },
  { id: "maternal_mortality", name: "Maternal mortality ratio",                category: "Health",  source: "wdi", code: "SH.STA.MMRT",         unit: "per 100,000 live births",  tags: ["mortality", "maternal"] },
  { id: "adolescent_fertility", name: "Adolescent fertility rate",             category: "Health",  source: "wdi", code: "SP.ADO.TFRT",         unit: "per 1,000 women 15-19",    tags: ["fertility", "adolescent"] },
  { id: "health_spend_gdp",  name: "Current health expenditure (% of GDP)",     category: "Health",  source: "wdi", code: "SH.XPD.CHEX.GD.ZS",  unit: "% of GDP",                 tags: ["health", "spending"] },
  { id: "health_spend_pc",   name: "Current health expenditure per capita",    category: "Health",  source: "wdi", code: "SH.XPD.CHEX.PC.CD",   unit: "current US$",              tags: ["health", "spending"] },
  { id: "physicians",        name: "Physicians (per 1,000 people)",            category: "Health",  source: "wdi", code: "SH.MED.PHYS.ZS",      unit: "per 1,000",                tags: ["health", "doctors"] },
  { id: "hospital_beds",     name: "Hospital beds (per 1,000 people)",         category: "Health",  source: "wdi", code: "SH.MED.BEDS.ZS",      unit: "per 1,000",                tags: ["health"] },
  { id: "measles_imm",       name: "Immunization, measles (% of 12-23 months)", category: "Health", source: "wdi", code: "SH.IMM.MEAS",         unit: "% of children",            tags: ["health", "vaccine"] },
  { id: "dpt_imm",           name: "Immunization, DPT (% of 12-23 months)",    category: "Health",  source: "wdi", code: "SH.IMM.IDPT",         unit: "% of children",            tags: ["health", "vaccine"] },
  { id: "skilled_births",    name: "Births attended by skilled health staff",  category: "Health",  source: "wdi", code: "SH.STA.BRTC.ZS",      unit: "% of total",               tags: ["health", "births"] },
  { id: "hiv_incidence",     name: "Incidence of HIV (per 1,000 uninfected)",  category: "Health",  source: "wdi", code: "SH.HIV.INCD.ZS",      unit: "per 1,000",                tags: ["hiv", "health"] },
  { id: "tb_incidence",      name: "Incidence of tuberculosis",                category: "Health",  source: "wdi", code: "SH.TBS.INCD",         unit: "per 100,000",              tags: ["tb", "health"] },
  { id: "water_basic",       name: "People using at least basic drinking water", category: "Health", source: "wdi", code: "SH.H2O.BASW.ZS",     unit: "% of population",          tags: ["water", "health"] },
  { id: "sanitation_basic",  name: "People using at least basic sanitation",   category: "Health",  source: "wdi", code: "SH.STA.BASS.ZS",      unit: "% of population",          tags: ["sanitation", "health"] },

  // ── Education ───────────────────────────────────────────────────────────
  { id: "literacy_adult",    name: "Literacy rate, adult total (%)",           category: "Education", source: "wdi", code: "SE.ADT.LITR.ZS",    unit: "% of adults",              tags: ["literacy", "education"] },
  { id: "literacy_youth",    name: "Literacy rate, youth 15-24 (%)",           category: "Education", source: "wdi", code: "SE.ADT.1524.LT.ZS", unit: "% of youth",               tags: ["literacy", "youth"] },
  { id: "enroll_primary",    name: "Primary school enrollment (% gross)",      category: "Education", source: "wdi", code: "SE.PRM.ENRR",       unit: "% gross",                  tags: ["enrollment", "primary"] },
  { id: "enroll_secondary",  name: "Secondary school enrollment (% gross)",    category: "Education", source: "wdi", code: "SE.SEC.ENRR",       unit: "% gross",                  tags: ["enrollment", "secondary"] },
  { id: "enroll_tertiary",   name: "Tertiary school enrollment (% gross)",     category: "Education", source: "wdi", code: "SE.TER.ENRR",       unit: "% gross",                  tags: ["enrollment", "tertiary"] },
  { id: "primary_completion", name: "Primary completion rate (%)",             category: "Education", source: "wdi", code: "SE.PRM.CMPT.ZS",    unit: "% of age group",           tags: ["education", "completion"] },
  { id: "edu_spend_gdp",     name: "Government expenditure on education (% GDP)", category: "Education", source: "wdi", code: "SE.XPD.TOTL.GD.ZS", unit: "% of GDP",             tags: ["education", "spending"] },
  { id: "edu_spend_gov",     name: "Education expenditure (% of govt spending)", category: "Education", source: "wdi", code: "SE.XPD.TOTL.GB.ZS", unit: "% of government",       tags: ["education", "spending"] },
  { id: "pupil_teacher_primary", name: "Pupil-teacher ratio, primary",         category: "Education", source: "wdi", code: "SE.PRM.ENRL.TC.ZS", unit: "ratio",                    tags: ["education", "teachers"] },
  { id: "oos_primary",       name: "Children out of school (% primary)",       category: "Education", source: "wdi", code: "SE.PRM.UNER.ZS",    unit: "% of primary age",         tags: ["education", "out of school"] },
  { id: "bachelors_plus",    name: "Population with bachelor's or higher (%)", category: "Education", source: "wdi", code: "SE.TER.CUAT.BA.ZS", unit: "% of population 25+",      tags: ["education", "tertiary"] },

  // ── Environment & Energy ────────────────────────────────────────────────
  { id: "co2_pc",            name: "CO₂ emissions per capita",                 category: "Environment", source: "wdi", code: "EN.GHG.CO2.PC.CE.AR5", unit: "metric tons CO2e/capita", tags: ["co2", "climate"] },
  { id: "co2_total",         name: "CO₂ emissions, total (kt)",                category: "Environment", source: "wdi", code: "EN.GHG.CO2.MT.CE.AR5", unit: "Mt CO2e",                tags: ["co2", "climate"] },
  { id: "ghg_total",         name: "Total greenhouse gas emissions",           category: "Environment", source: "wdi", code: "EN.GHG.ALL.MT.CE.AR5", unit: "Mt CO2e",                tags: ["ghg", "climate"] },
  { id: "methane",           name: "Methane emissions",                        category: "Environment", source: "wdi", code: "EN.GHG.CH4.MT.CE.AR5", unit: "Mt CO2e",                tags: ["methane", "climate"] },
  { id: "fossil_energy",     name: "Fossil fuel energy consumption (%)",       category: "Environment", source: "wdi", code: "EG.USE.COMM.FO.ZS", unit: "% of total energy",         tags: ["energy", "fossil"] },
  { id: "energy_pc",         name: "Energy use per capita",                    category: "Environment", source: "wdi", code: "EG.USE.PCAP.KG.OE", unit: "kg oil equivalent",         tags: ["energy"] },
  { id: "renew_elec",        name: "Renewable electricity output (%)",         category: "Environment", source: "wdi", code: "EG.ELC.RNEW.ZS",    unit: "% of electricity",         tags: ["renewables", "electricity"] },
  { id: "renew_energy",      name: "Renewable energy consumption (%)",         category: "Environment", source: "wdi", code: "EG.FEC.RNEW.ZS",    unit: "% of total energy",        tags: ["renewables"] },
  { id: "access_electricity", name: "Access to electricity (%)",               category: "Environment", source: "wdi", code: "EG.ELC.ACCS.ZS",    unit: "% of population",          tags: ["electricity", "energy", "access"] },
  { id: "forest_area",       name: "Forest area (% of land area)",             category: "Environment", source: "wdi", code: "AG.LND.FRST.ZS",    unit: "% of land",                tags: ["forest", "land"] },
  { id: "arable_land",       name: "Arable land (% of land area)",             category: "Environment", source: "wdi", code: "AG.LND.ARBL.ZS",    unit: "% of land",                tags: ["agriculture", "land"] },
  { id: "freshwater_w",      name: "Annual freshwater withdrawals",            category: "Environment", source: "wdi", code: "ER.H2O.FWTL.ZS",    unit: "% of resources",           tags: ["water"] },
  { id: "pm25",              name: "PM2.5 air pollution, mean annual exposure", category: "Environment", source: "wdi", code: "EN.ATM.PM25.MC.M3", unit: "µg/m³",                   tags: ["pollution", "air"] },

  // ── Demographics ────────────────────────────────────────────────────────
  { id: "population",        name: "Population, total",                        category: "Demographics", source: "wdi", code: "SP.POP.TOTL",      unit: "persons",                  tags: ["population"] },
  { id: "pop_growth",        name: "Population growth (annual %)",             category: "Demographics", source: "wdi", code: "SP.POP.GROW",      unit: "% annual",                 tags: ["population", "growth"] },
  { id: "fertility_rate",    name: "Fertility rate, total (births/woman)",     category: "Demographics", source: "wdi", code: "SP.DYN.TFRT.IN",   unit: "births per woman",         tags: ["fertility"] },
  { id: "birth_rate",        name: "Birth rate, crude (per 1,000 people)",     category: "Demographics", source: "wdi", code: "SP.DYN.CBRT.IN",   unit: "per 1,000",                tags: ["births"] },
  { id: "death_rate",        name: "Death rate, crude (per 1,000 people)",     category: "Demographics", source: "wdi", code: "SP.DYN.CDRT.IN",   unit: "per 1,000",                tags: ["deaths"] },
  { id: "pop_0_14",          name: "Population ages 0-14 (%)",                 category: "Demographics", source: "wdi", code: "SP.POP.0014.TO.ZS", unit: "% of total",              tags: ["age", "children"] },
  { id: "pop_65_plus",       name: "Population ages 65+ (%)",                  category: "Demographics", source: "wdi", code: "SP.POP.65UP.TO.ZS", unit: "% of total",              tags: ["age", "elderly"] },
  { id: "dep_ratio",         name: "Age dependency ratio (%)",                 category: "Demographics", source: "wdi", code: "SP.POP.DPND",      unit: "% of working-age",         tags: ["dependency"] },
  { id: "net_migration",     name: "Net migration",                            category: "Demographics", source: "wdi", code: "SM.POP.NETM",      unit: "persons (5-yr)",           tags: ["migration"] },
  { id: "migrant_stock",     name: "International migrant stock (% of pop)",   category: "Demographics", source: "wdi", code: "SM.POP.TOTL.ZS",   unit: "% of population",          tags: ["migration"] },
  { id: "pop_density",       name: "Population density",                       category: "Demographics", source: "wdi", code: "EN.POP.DNST",      unit: "people per km²",           tags: ["density"] },
  { id: "urban_pop",         name: "Urban population (% of total)",            category: "Demographics", source: "wdi", code: "SP.URB.TOTL.IN.ZS", unit: "% of total",              tags: ["urban"] },
  { id: "rural_pop",         name: "Rural population (% of total)",            category: "Demographics", source: "wdi", code: "SP.RUR.TOTL.ZS",   unit: "% of total",               tags: ["rural"] },

  // ── ICT / Governance ────────────────────────────────────────────────────
  { id: "internet_users",    name: "Individuals using the Internet (%)",       category: "Governance", source: "wdi", code: "IT.NET.USER.ZS",    unit: "% of population",          tags: ["internet", "ict"] },
  { id: "mobile_subs",       name: "Mobile cellular subscriptions (per 100)",  category: "Governance", source: "wdi", code: "IT.CEL.SETS.P2",    unit: "per 100 people",           tags: ["mobile", "ict"] },
  { id: "fixed_broadband",   name: "Fixed broadband subscriptions (per 100)",  category: "Governance", source: "wdi", code: "IT.NET.BBND.P2",    unit: "per 100 people",           tags: ["broadband", "ict"] },
  { id: "homicide",          name: "Intentional homicides (per 100,000)",      category: "Governance", source: "wdi", code: "VC.IHR.PSRC.P5",    unit: "per 100,000",              tags: ["homicide", "crime"] },
  { id: "military_gdp",      name: "Military expenditure (% of GDP)",          category: "Governance", source: "wdi", code: "MS.MIL.XPND.GD.ZS", unit: "% of GDP",                 tags: ["military"] },
  { id: "military_gov",      name: "Military expenditure (% of gov spending)", category: "Governance", source: "wdi", code: "MS.MIL.XPND.ZS",    unit: "% of government",          tags: ["military"] },
  { id: "rd_spend",          name: "R&D expenditure (% of GDP)",               category: "Governance", source: "wdi", code: "GB.XPD.RSDV.GD.ZS", unit: "% of GDP",                 tags: ["research", "innovation"] },
  { id: "researchers",       name: "Researchers in R&D (per million)",         category: "Governance", source: "wdi", code: "SP.POP.SCIE.RD.P6", unit: "per million",              tags: ["research"] },

  // ── Agriculture & Food ──────────────────────────────────────────────────
  { id: "cereal_production", name: "Cereal production (metric tons)",          category: "Agriculture", source: "wdi", code: "AG.PRD.CREL.MT",   unit: "metric tons",              tags: ["cereal", "food"] },
  { id: "cereal_yield",      name: "Cereal yield (kg per hectare)",            category: "Agriculture", source: "wdi", code: "AG.YLD.CREL.KG",   unit: "kg/ha",                    tags: ["yield", "agriculture"] },
  { id: "livestock_idx",     name: "Livestock production index (2014-16=100)", category: "Agriculture", source: "wdi", code: "AG.PRD.LVSK.XD",   unit: "index",                    tags: ["livestock"] },
  { id: "food_idx",          name: "Food production index (2014-16=100)",      category: "Agriculture", source: "wdi", code: "AG.PRD.FOOD.XD",   unit: "index",                    tags: ["food"] },
  { id: "undernourishment",  name: "Prevalence of undernourishment (%)",       category: "Agriculture", source: "wdi", code: "SN.ITK.DEFC.ZS",   unit: "% of population",          tags: ["food", "hunger"] },
  { id: "stunting",          name: "Prevalence of stunting, children <5 (%)",  category: "Agriculture", source: "wdi", code: "SH.STA.STNT.ZS",   unit: "% of children under 5",    tags: ["nutrition", "child"] },
];

export const CATEGORIES = [...new Set(INDICATORS.map(r => r.category))].sort();

export function byId(id) {
  return INDICATORS.find(r => r.id === id) ?? null;
}

export function byCategory(category) {
  return INDICATORS.filter(r => r.category === category);
}
