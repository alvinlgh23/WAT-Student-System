window.WAT_SERVICES = window.WAT_SERVICES || {};

window.WAT_SERVICES.economy = {
  status: "source-ready",
  providers: {
    fred: "FRED API",
    blsCpi: "BLS CPI",
  },
  capabilities: [
    "inflation pressure",
    "CPI trend",
    "gas price pressure",
    "macro stress context",
  ],
  integration: {
    requiresBackendProxy: false,
    optionalKeys: ["FRED_API_KEY", "BLS_API_KEY"],
    plannedEndpoints: ["FRED CPI/gas series", "BLS CPI regional data"],
  },
  getMacroEvidence() {
    return {
      status: "source-ready",
      basis: "FRED and BLS CPI-ready; current macro stress is a heuristic overlay until live series are connected.",
      confidence: "medium once connected, low as a standalone heuristic",
    };
  },
  getSourceBasis() {
    return "FRED and BLS CPI-ready architecture. Current macro pressure is a heuristic layer until external data is connected.";
  },
};
