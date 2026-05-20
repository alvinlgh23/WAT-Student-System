window.WAT_SERVICES = window.WAT_SERVICES || {};

window.WAT_SERVICES.cost = {
  status: "source-ready",
  providers: {
    livingWage: "MIT Living Wage Calculator",
    rentGroceriesTransport: "Numbeo",
  },
  capabilities: [
    "living cost baseline",
    "rent pressure",
    "grocery pressure",
    "transport pressure",
    "quality-of-life context",
  ],
  getSourceBasis() {
    return "MIT Living Wage and Numbeo-ready architecture. Current build separates user inputs from heuristic cost pressure.";
  },
};
