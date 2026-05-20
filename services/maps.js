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
  getSourceBasis() {
    return "Google Maps Platform-ready architecture. Current build uses local city coordinates until API keys and a backend proxy are connected.";
  },
};
