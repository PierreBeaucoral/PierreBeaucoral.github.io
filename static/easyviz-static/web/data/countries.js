// WDI country roster + preset groupings.
//
// The country list is the WDI's 217-economy universe (frozen snapshot);
// keeping it client-side means the country multi-select populates
// instantly instead of waiting on a WB /country round-trip.
//
// Presets: SSA, Low- & Middle-Income and LDCs follow the official
// World Bank / UN classifications (sources dated inline); the others are
// fixed memberships or editorial picks. "All countries" is a sentinel that expands to
// the full COUNTRIES list at resolve time.

export const COUNTRIES = [
  ["AFG", "Afghanistan"],          ["ALB", "Albania"],              ["DZA", "Algeria"],
  ["ASM", "American Samoa"],       ["AND", "Andorra"],              ["AGO", "Angola"],
  ["ATG", "Antigua and Barbuda"],  ["ARG", "Argentina"],            ["ARM", "Armenia"],
  ["ABW", "Aruba"],                ["AUS", "Australia"],            ["AUT", "Austria"],
  ["AZE", "Azerbaijan"],           ["BHS", "Bahamas, The"],         ["BHR", "Bahrain"],
  ["BGD", "Bangladesh"],           ["BRB", "Barbados"],             ["BLR", "Belarus"],
  ["BEL", "Belgium"],              ["BLZ", "Belize"],               ["BEN", "Benin"],
  ["BMU", "Bermuda"],              ["BTN", "Bhutan"],               ["BOL", "Bolivia"],
  ["BIH", "Bosnia and Herzegovina"], ["BWA", "Botswana"],             ["BRA", "Brazil"],
  ["VGB", "British Virgin Islands"], ["BRN", "Brunei Darussalam"],    ["BGR", "Bulgaria"],
  ["BFA", "Burkina Faso"],         ["BDI", "Burundi"],              ["CPV", "Cabo Verde"],
  ["KHM", "Cambodia"],             ["CMR", "Cameroon"],             ["CAN", "Canada"],
  ["CYM", "Cayman Islands"],       ["CAF", "Central African Republic"], ["TCD", "Chad"],
  ["CHI", "Channel Islands"],      ["CHL", "Chile"],                ["CHN", "China"],
  ["COL", "Colombia"],             ["COM", "Comoros"],              ["COD", "Congo, Dem. Rep."],
  ["COG", "Congo, Rep."],          ["CRI", "Costa Rica"],           ["CIV", "Cote d'Ivoire"],
  ["HRV", "Croatia"],              ["CUB", "Cuba"],                 ["CUW", "Curacao"],
  ["CYP", "Cyprus"],               ["CZE", "Czechia"],              ["DNK", "Denmark"],
  ["DJI", "Djibouti"],             ["DMA", "Dominica"],             ["DOM", "Dominican Republic"],
  ["ECU", "Ecuador"],              ["EGY", "Egypt, Arab Rep."],     ["SLV", "El Salvador"],
  ["GNQ", "Equatorial Guinea"],    ["ERI", "Eritrea"],              ["EST", "Estonia"],
  ["SWZ", "Eswatini"],             ["ETH", "Ethiopia"],             ["FRO", "Faroe Islands"],
  ["FJI", "Fiji"],                 ["FIN", "Finland"],              ["FRA", "France"],
  ["PYF", "French Polynesia"],     ["GAB", "Gabon"],                ["GMB", "Gambia, The"],
  ["GEO", "Georgia"],              ["DEU", "Germany"],              ["GHA", "Ghana"],
  ["GIB", "Gibraltar"],            ["GRC", "Greece"],               ["GRL", "Greenland"],
  ["GRD", "Grenada"],              ["GUM", "Guam"],                 ["GTM", "Guatemala"],
  ["GIN", "Guinea"],               ["GNB", "Guinea-Bissau"],        ["GUY", "Guyana"],
  ["HTI", "Haiti"],                ["HND", "Honduras"],             ["HKG", "Hong Kong SAR, China"],
  ["HUN", "Hungary"],              ["ISL", "Iceland"],              ["IND", "India"],
  ["IDN", "Indonesia"],            ["IRN", "Iran, Islamic Rep."],   ["IRQ", "Iraq"],
  ["IRL", "Ireland"],              ["IMN", "Isle of Man"],          ["ISR", "Israel"],
  ["ITA", "Italy"],                ["JAM", "Jamaica"],              ["JPN", "Japan"],
  ["JOR", "Jordan"],               ["KAZ", "Kazakhstan"],           ["KEN", "Kenya"],
  ["KIR", "Kiribati"],             ["PRK", "Korea, Dem. People's Rep."], ["KOR", "Korea, Rep."],
  ["XKX", "Kosovo"],               ["KWT", "Kuwait"],               ["KGZ", "Kyrgyz Republic"],
  ["LAO", "Lao PDR"],              ["LVA", "Latvia"],               ["LBN", "Lebanon"],
  ["LSO", "Lesotho"],              ["LBR", "Liberia"],              ["LBY", "Libya"],
  ["LIE", "Liechtenstein"],        ["LTU", "Lithuania"],            ["LUX", "Luxembourg"],
  ["MAC", "Macao SAR, China"],     ["MDG", "Madagascar"],           ["MWI", "Malawi"],
  ["MYS", "Malaysia"],             ["MDV", "Maldives"],             ["MLI", "Mali"],
  ["MLT", "Malta"],                ["MHL", "Marshall Islands"],     ["MRT", "Mauritania"],
  ["MUS", "Mauritius"],            ["MEX", "Mexico"],               ["FSM", "Micronesia, Fed. Sts."],
  ["MDA", "Moldova"],              ["MCO", "Monaco"],               ["MNG", "Mongolia"],
  ["MNE", "Montenegro"],           ["MAR", "Morocco"],              ["MOZ", "Mozambique"],
  ["MMR", "Myanmar"],              ["NAM", "Namibia"],              ["NRU", "Nauru"],
  ["NPL", "Nepal"],                ["NLD", "Netherlands"],          ["NCL", "New Caledonia"],
  ["NZL", "New Zealand"],          ["NIC", "Nicaragua"],            ["NER", "Niger"],
  ["NGA", "Nigeria"],              ["MKD", "North Macedonia"],      ["MNP", "Northern Mariana Islands"],
  ["NOR", "Norway"],               ["OMN", "Oman"],                 ["PAK", "Pakistan"],
  ["PLW", "Palau"],                ["PAN", "Panama"],               ["PNG", "Papua New Guinea"],
  ["PRY", "Paraguay"],             ["PER", "Peru"],                 ["PHL", "Philippines"],
  ["POL", "Poland"],               ["PRT", "Portugal"],             ["PRI", "Puerto Rico"],
  ["QAT", "Qatar"],                ["ROU", "Romania"],              ["RUS", "Russian Federation"],
  ["RWA", "Rwanda"],               ["WSM", "Samoa"],                ["SMR", "San Marino"],
  ["STP", "Sao Tome and Principe"], ["SAU", "Saudi Arabia"],         ["SEN", "Senegal"],
  ["SRB", "Serbia"],               ["SYC", "Seychelles"],           ["SLE", "Sierra Leone"],
  ["SGP", "Singapore"],            ["SXM", "Sint Maarten (Dutch part)"], ["SVK", "Slovak Republic"],
  ["SVN", "Slovenia"],             ["SLB", "Solomon Islands"],      ["SOM", "Somalia"],
  ["ZAF", "South Africa"],         ["SSD", "South Sudan"],          ["ESP", "Spain"],
  ["LKA", "Sri Lanka"],            ["KNA", "St. Kitts and Nevis"],  ["LCA", "St. Lucia"],
  ["MAF", "St. Martin (French part)"], ["VCT", "St. Vincent and the Grenadines"], ["SDN", "Sudan"],
  ["SUR", "Suriname"],             ["SWE", "Sweden"],               ["CHE", "Switzerland"],
  ["SYR", "Syrian Arab Republic"], ["TJK", "Tajikistan"],           ["TZA", "Tanzania"],
  ["THA", "Thailand"],             ["TLS", "Timor-Leste"],          ["TGO", "Togo"],
  ["TON", "Tonga"],                ["TTO", "Trinidad and Tobago"],  ["TUN", "Tunisia"],
  ["TUR", "Turkiye"],              ["TKM", "Turkmenistan"],         ["TCA", "Turks and Caicos Islands"],
  ["TUV", "Tuvalu"],               ["UGA", "Uganda"],               ["UKR", "Ukraine"],
  ["ARE", "United Arab Emirates"], ["GBR", "United Kingdom"],       ["USA", "United States"],
  ["URY", "Uruguay"],              ["UZB", "Uzbekistan"],           ["VUT", "Vanuatu"],
  ["VEN", "Venezuela, RB"],        ["VNM", "Vietnam"],              ["VIR", "Virgin Islands (U.S.)"],
  ["PSE", "West Bank and Gaza"],   ["YEM", "Yemen, Rep."],          ["ZMB", "Zambia"],
  ["ZWE", "Zimbabwe"],
];

export const ISO3_TO_NAME = Object.fromEntries(COUNTRIES);
export const NAME_TO_ISO3 = Object.fromEntries(COUNTRIES.map(([i, n]) => [n, i]));

// ── Presets (names match Streamlit EasyViz regions.py) ──────────────────

export const PRESETS = {
  "Default (20 diverse)": [
    "USA", "CHN", "DEU", "BRA", "IND", "NGA", "FRA", "GBR", "ZAF", "IDN",
    "MEX", "BGD", "ETH", "KEN", "COL", "VNM", "EGY", "PAK", "TZA", "GHA",
  ],
  "OECD (38)": [
    "AUS", "AUT", "BEL", "CAN", "CHL", "COL", "CRI", "CZE", "DNK", "EST",
    "FIN", "FRA", "DEU", "GRC", "HUN", "ISL", "IRL", "ISR", "ITA", "JPN",
    "KOR", "LVA", "LTU", "LUX", "MEX", "NLD", "NZL", "NOR", "POL", "PRT",
    "SVK", "SVN", "ESP", "SWE", "CHE", "TUR", "GBR", "USA",
  ],
  "EU27": [
    "AUT", "BEL", "BGR", "HRV", "CYP", "CZE", "DNK", "EST", "FIN", "FRA",
    "DEU", "GRC", "HUN", "IRL", "ITA", "LVA", "LTU", "LUX", "MLT", "NLD",
    "POL", "PRT", "ROU", "SVK", "SVN", "ESP", "SWE",
  ],
  // World Bank region SSF (all 48 economies), live /v2/country, Oct 2026.
  "Sub-Saharan Africa": [
    "AGO", "BDI", "BEN", "BFA", "BWA", "CAF", "CIV", "CMR", "COD", "COG",
    "COM", "CPV", "ERI", "ETH", "GAB", "GHA", "GIN", "GMB", "GNB", "GNQ",
    "KEN", "LBR", "LSO", "MDG", "MLI", "MOZ", "MRT", "MUS", "MWI", "NAM",
    "NER", "NGA", "RWA", "SDN", "SEN", "SLE", "SOM", "SSD", "STP", "SWZ",
    "SYC", "TCD", "TGO", "TZA", "UGA", "ZAF", "ZMB", "ZWE",
  ],
  // World Bank income groups LIC + LMC + UMC, FY27 classification
  // (live /v2/country, Oct 2026). Reclassified every 1 July.
  "Low- & Middle-Income": [
    "AFG", "AGO", "ALB", "ARG", "ARM", "AZE", "BDI", "BEN", "BFA", "BGD",
    "BIH", "BLR", "BLZ", "BOL", "BRA", "BTN", "BWA", "CAF", "CHN", "CIV",
    "CMR", "COD", "COG", "COL", "COM", "CPV", "CUB", "DJI", "DMA", "DOM",
    "DZA", "ECU", "EGY", "ERI", "ETH", "FJI", "FSM", "GAB", "GEO", "GHA",
    "GIN", "GMB", "GNB", "GNQ", "GRD", "GTM", "HND", "HTI", "IDN", "IND",
    "IRN", "IRQ", "JAM", "JOR", "KAZ", "KEN", "KGZ", "KHM", "KIR", "LAO",
    "LBN", "LBR", "LBY", "LCA", "LKA", "LSO", "MAR", "MDA", "MDG", "MDV",
    "MEX", "MHL", "MKD", "MLI", "MMR", "MNE", "MNG", "MOZ", "MRT", "MUS",
    "MWI", "MYS", "NAM", "NER", "NGA", "NIC", "NPL", "PAK", "PER", "PHL",
    "PNG", "PRK", "PRY", "PSE", "RWA", "SDN", "SEN", "SLB", "SLE", "SLV",
    "SOM", "SRB", "SSD", "STP", "SUR", "SWZ", "SYR", "TCD", "TGO", "THA",
    "TJK", "TKM", "TLS", "TON", "TUN", "TUR", "TUV", "TZA", "UGA", "UKR",
    "UZB", "VCT", "VEN", "VNM", "VUT", "WSM", "XKX", "YEM", "ZAF", "ZMB",
    "ZWE",
  ],
  // UN list of LDCs as of 19 Dec 2024 (44; Sao Tome and Principe graduated
  // 13 Dec 2024). Bangladesh, Lao PDR and Nepal graduate 24 Nov 2026
  // (A/RES/76/8) — drop BGD, LAO, NPL after that date.
  "LDCs (UN)": [
    "AFG", "AGO", "BDI", "BEN", "BFA", "BGD", "CAF", "COD", "COM", "DJI",
    "ERI", "ETH", "GIN", "GMB", "GNB", "HTI", "KHM", "KIR", "LAO", "LBR",
    "LSO", "MDG", "MLI", "MMR", "MOZ", "MRT", "MWI", "NER", "NPL", "RWA",
    "SDN", "SEN", "SLB", "SLE", "SOM", "SSD", "TCD", "TGO", "TLS", "TUV",
    "TZA", "UGA", "YEM", "ZMB",
  ],
  "BRICS": ["BRA", "RUS", "IND", "CHN", "ZAF"],
  "G7":    ["CAN", "FRA", "DEU", "ITA", "JPN", "GBR", "USA"],
  "G20":   [
    "ARG", "AUS", "BRA", "CAN", "CHN", "FRA", "DEU", "IND", "IDN", "ITA",
    "JPN", "MEX", "RUS", "SAU", "ZAF", "KOR", "TUR", "GBR", "USA",
  ],
};

export const ALL_COUNTRIES_KEY = "All countries";

export function resolvePreset(name) {
  if (name === ALL_COUNTRIES_KEY) return COUNTRIES.map(([i]) => i);
  return PRESETS[name] ?? [];
}
