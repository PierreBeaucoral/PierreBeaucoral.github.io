// WDI country roster + preset groupings.
//
// The country list is the WDI's 217-economy universe (frozen snapshot);
// keeping it client-side means the country multi-select populates
// instantly instead of waiting on a WB /country round-trip.
//
// Presets are the same editorial groups as the Streamlit EasyViz
// `src/regions.py`. "All countries" is a sentinel that expands to
// the full COUNTRIES list at resolve time.

export const COUNTRIES = [
  ["AFG", "Afghanistan"],         ["ALB", "Albania"],             ["DZA", "Algeria"],
  ["AND", "Andorra"],             ["AGO", "Angola"],              ["ATG", "Antigua and Barbuda"],
  ["ARG", "Argentina"],           ["ARM", "Armenia"],             ["ABW", "Aruba"],
  ["AUS", "Australia"],           ["AUT", "Austria"],             ["AZE", "Azerbaijan"],
  ["BHS", "Bahamas, The"],        ["BHR", "Bahrain"],             ["BGD", "Bangladesh"],
  ["BRB", "Barbados"],            ["BLR", "Belarus"],             ["BEL", "Belgium"],
  ["BLZ", "Belize"],              ["BEN", "Benin"],               ["BMU", "Bermuda"],
  ["BTN", "Bhutan"],              ["BOL", "Bolivia"],             ["BIH", "Bosnia and Herzegovina"],
  ["BWA", "Botswana"],            ["BRA", "Brazil"],              ["BRN", "Brunei Darussalam"],
  ["BGR", "Bulgaria"],            ["BFA", "Burkina Faso"],        ["BDI", "Burundi"],
  ["CPV", "Cabo Verde"],          ["KHM", "Cambodia"],            ["CMR", "Cameroon"],
  ["CAN", "Canada"],              ["CYM", "Cayman Islands"],      ["CAF", "Central African Republic"],
  ["TCD", "Chad"],                ["CHL", "Chile"],               ["CHN", "China"],
  ["COL", "Colombia"],            ["COM", "Comoros"],             ["COD", "Congo, Dem. Rep."],
  ["COG", "Congo, Rep."],         ["CRI", "Costa Rica"],          ["CIV", "Cote d'Ivoire"],
  ["HRV", "Croatia"],             ["CUB", "Cuba"],                ["CYP", "Cyprus"],
  ["CZE", "Czechia"],             ["DNK", "Denmark"],             ["DJI", "Djibouti"],
  ["DMA", "Dominica"],            ["DOM", "Dominican Republic"],  ["ECU", "Ecuador"],
  ["EGY", "Egypt, Arab Rep."],    ["SLV", "El Salvador"],         ["GNQ", "Equatorial Guinea"],
  ["ERI", "Eritrea"],             ["EST", "Estonia"],             ["SWZ", "Eswatini"],
  ["ETH", "Ethiopia"],            ["FRO", "Faroe Islands"],       ["FJI", "Fiji"],
  ["FIN", "Finland"],             ["FRA", "France"],              ["PYF", "French Polynesia"],
  ["GAB", "Gabon"],               ["GMB", "Gambia, The"],         ["GEO", "Georgia"],
  ["DEU", "Germany"],              ["GHA", "Ghana"],              ["GRC", "Greece"],
  ["GRL", "Greenland"],           ["GRD", "Grenada"],             ["GUM", "Guam"],
  ["GTM", "Guatemala"],           ["GIN", "Guinea"],              ["GNB", "Guinea-Bissau"],
  ["GUY", "Guyana"],              ["HTI", "Haiti"],               ["HND", "Honduras"],
  ["HKG", "Hong Kong SAR, China"], ["HUN", "Hungary"],            ["ISL", "Iceland"],
  ["IND", "India"],               ["IDN", "Indonesia"],           ["IRN", "Iran, Islamic Rep."],
  ["IRQ", "Iraq"],                ["IRL", "Ireland"],             ["IMN", "Isle of Man"],
  ["ISR", "Israel"],              ["ITA", "Italy"],               ["JAM", "Jamaica"],
  ["JPN", "Japan"],               ["JOR", "Jordan"],              ["KAZ", "Kazakhstan"],
  ["KEN", "Kenya"],               ["KIR", "Kiribati"],            ["PRK", "Korea, Dem. People's Rep."],
  ["KOR", "Korea, Rep."],         ["XKX", "Kosovo"],              ["KWT", "Kuwait"],
  ["KGZ", "Kyrgyz Republic"],     ["LAO", "Lao PDR"],             ["LVA", "Latvia"],
  ["LBN", "Lebanon"],             ["LSO", "Lesotho"],             ["LBR", "Liberia"],
  ["LBY", "Libya"],               ["LIE", "Liechtenstein"],       ["LTU", "Lithuania"],
  ["LUX", "Luxembourg"],          ["MAC", "Macao SAR, China"],    ["MDG", "Madagascar"],
  ["MWI", "Malawi"],              ["MYS", "Malaysia"],            ["MDV", "Maldives"],
  ["MLI", "Mali"],                ["MLT", "Malta"],               ["MHL", "Marshall Islands"],
  ["MRT", "Mauritania"],          ["MUS", "Mauritius"],           ["MEX", "Mexico"],
  ["FSM", "Micronesia, Fed. Sts."], ["MDA", "Moldova"],           ["MCO", "Monaco"],
  ["MNG", "Mongolia"],            ["MNE", "Montenegro"],          ["MAR", "Morocco"],
  ["MOZ", "Mozambique"],          ["MMR", "Myanmar"],             ["NAM", "Namibia"],
  ["NRU", "Nauru"],               ["NPL", "Nepal"],               ["NLD", "Netherlands"],
  ["NCL", "New Caledonia"],       ["NZL", "New Zealand"],         ["NIC", "Nicaragua"],
  ["NER", "Niger"],               ["NGA", "Nigeria"],             ["MKD", "North Macedonia"],
  ["NOR", "Norway"],              ["OMN", "Oman"],                ["PAK", "Pakistan"],
  ["PLW", "Palau"],               ["PAN", "Panama"],              ["PNG", "Papua New Guinea"],
  ["PRY", "Paraguay"],            ["PER", "Peru"],                ["PHL", "Philippines"],
  ["POL", "Poland"],              ["PRT", "Portugal"],            ["PRI", "Puerto Rico"],
  ["QAT", "Qatar"],               ["ROU", "Romania"],             ["RUS", "Russian Federation"],
  ["RWA", "Rwanda"],              ["WSM", "Samoa"],               ["SMR", "San Marino"],
  ["STP", "Sao Tome and Principe"], ["SAU", "Saudi Arabia"],      ["SEN", "Senegal"],
  ["SRB", "Serbia"],              ["SYC", "Seychelles"],          ["SLE", "Sierra Leone"],
  ["SGP", "Singapore"],           ["SVK", "Slovak Republic"],     ["SVN", "Slovenia"],
  ["SLB", "Solomon Islands"],     ["SOM", "Somalia"],             ["ZAF", "South Africa"],
  ["SSD", "South Sudan"],         ["ESP", "Spain"],               ["LKA", "Sri Lanka"],
  ["KNA", "St. Kitts and Nevis"], ["LCA", "St. Lucia"],           ["VCT", "St. Vincent and the Grenadines"],
  ["SDN", "Sudan"],               ["SUR", "Suriname"],            ["SWE", "Sweden"],
  ["CHE", "Switzerland"],         ["SYR", "Syrian Arab Republic"], ["TJK", "Tajikistan"],
  ["TZA", "Tanzania"],            ["THA", "Thailand"],            ["TLS", "Timor-Leste"],
  ["TGO", "Togo"],                ["TON", "Tonga"],               ["TTO", "Trinidad and Tobago"],
  ["TUN", "Tunisia"],             ["TUR", "Turkiye"],             ["TKM", "Turkmenistan"],
  ["TUV", "Tuvalu"],              ["UGA", "Uganda"],              ["UKR", "Ukraine"],
  ["ARE", "United Arab Emirates"], ["GBR", "United Kingdom"],     ["USA", "United States"],
  ["URY", "Uruguay"],             ["UZB", "Uzbekistan"],          ["VUT", "Vanuatu"],
  ["VEN", "Venezuela, RB"],       ["VNM", "Vietnam"],             ["YEM", "Yemen, Rep."],
  ["ZMB", "Zambia"],              ["ZWE", "Zimbabwe"],
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
  "Sub-Saharan Africa": [
    "AGO", "BEN", "BWA", "BFA", "BDI", "CPV", "CMR", "CAF", "TCD", "COM",
    "COD", "COG", "CIV", "GNQ", "ERI", "SWZ", "ETH", "GAB", "GMB", "GHA",
    "GIN", "GNB", "KEN", "LSO", "LBR", "MDG", "MWI", "MLI", "MRT", "MUS",
    "MOZ", "NAM", "NER", "NGA", "RWA", "STP", "SEN", "SYC", "SLE", "SOM",
    "ZAF", "SSD", "SDN", "TZA", "TGO", "UGA", "ZMB", "ZWE",
  ],
  "Low- & Middle-Income": [
    "AGO", "BGD", "BEN", "BOL", "BFA", "KHM", "CMR", "COL", "CIV", "EGY",
    "ETH", "GHA", "GTM", "HND", "IND", "IDN", "KEN", "KGZ", "LAO", "MDG",
    "MWI", "MLI", "MRT", "MDA", "MNG", "MAR", "MMR", "NPL", "NIC", "NGA",
    "PAK", "PHL", "RWA", "SEN", "LKA", "TZA", "TGO", "TUN", "UGA", "UZB",
    "VNM", "ZMB", "ZWE",
  ],
  "LDCs (UN)": [
    "AFG", "AGO", "BGD", "BEN", "BFA", "BDI", "KHM", "CAF", "TCD", "COM",
    "COD", "DJI", "ERI", "ETH", "GMB", "GIN", "GNB", "HTI", "KIR", "LAO",
    "LSO", "LBR", "MDG", "MWI", "MLI", "MRT", "MOZ", "MMR", "NPL", "NER",
    "RWA", "STP", "SEN", "SLE", "SLB", "SOM", "SSD", "SDN", "TZA", "TLS",
    "TGO", "TUV", "UGA", "YEM", "ZMB",
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
