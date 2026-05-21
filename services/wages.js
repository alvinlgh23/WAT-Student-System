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
  getSourceBasis() {
    return "DOL/state wage references and BLS API-ready architecture. Current WAT wage ranges are transparent estimates, not guaranteed offers.";
  },
};
