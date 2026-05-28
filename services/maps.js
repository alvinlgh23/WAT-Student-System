window.WAT_SERVICES = window.WAT_SERVICES || {};

window.WAT_SERVICES.maps = {
  status: "api-ready",
  providers: {
    places: "Google Places API",
    directions: "Google Directions API",
    distanceMatrix: "Google Distance Matrix API",
  },
  capabilities: [
    "state/city lookup",
    "nearest airport lookup",
    "route travel time",
    "route distance",
    "place metadata",
  ],
  integration: {
    requiresBackendProxy: true,
    requiredKeys: ["GOOGLE_MAPS_API_KEY"],
    plannedEndpoints: ["Places API", "Directions API", "Distance Matrix API"],
  },
  getRouteEvidence() {
    return {
      status: "future live integration",
      basis: "Google Maps Platform-ready; current frontend uses local route heuristics until a backend proxy is connected.",
      confidence: "low until connected",
    };
  },
  getSourceBasis() {
    return "Google Maps Platform-ready architecture. Current build uses local city coordinates until API keys and a backend proxy are connected.";
  },
};
