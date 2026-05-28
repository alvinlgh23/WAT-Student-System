window.WAT_SERVICES = window.WAT_SERVICES || {};

window.WAT_SERVICES.wages = {
  status: "source-ready",
  providers: {
    bls: "BLS API",
    laborDepartments: "U.S. Department of Labor / state labor departments",
  },
  capabilities: [
    "state minimum wage",
    "hospitality wage benchmarks",
    "retail wage benchmarks",
    "seasonal work wage estimates",
  ],
  integration: {
    requiresBackendProxy: false,
    optionalKeys: ["BLS_API_KEY"],
    publicReferenceSources: ["U.S. Department of Labor", "state labor departments"],
    plannedEndpoints: ["BLS OEWS hospitality wages", "BLS OEWS retail wages"],
  },
  getWageEvidence() {
    return {
      status: "source-ready",
      basis: "Minimum wage is public reference data; WAT wage estimates remain offer-dependent until employer or student reports are added.",
      confidence: "high for wage floor, medium-low for WAT offer estimates",
    };
  },
  getSourceBasis() {
    return "DOL/state wage references and BLS API-ready architecture. Current WAT wage ranges are transparent estimates, not guaranteed offers.";
  },
};
