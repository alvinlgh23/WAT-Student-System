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
  integration: {
    requiresBackendProxy: true,
    requiredKeys: ["NUMBEO_API_KEY"],
    publicReferenceSources: ["MIT Living Wage Calculator"],
    plannedEndpoints: ["Numbeo cost of living", "Numbeo rent", "Numbeo traffic/safety"],
  },
  getCostEvidence() {
    return {
      status: "source-ready",
      basis: "MIT Living Wage and Numbeo-ready; current build prioritizes user-entered rent, groceries, transport, and misc spending.",
      confidence: "medium for user inputs, lower for city estimates until connected",
    };
  },
  getSourceBasis() {
    return "MIT Living Wage and Numbeo-ready architecture. Current build separates user inputs from heuristic cost pressure.";
  },
};
