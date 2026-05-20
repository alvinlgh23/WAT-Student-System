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
  getSourceBasis() {
    return "FRED and BLS CPI-ready architecture. Current macro pressure is a heuristic layer until external data is connected.";
  },
};
