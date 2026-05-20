window.WAT_SERVICES = window.WAT_SERVICES || {};

window.WAT_SERVICES.travel = {
  status: "api-ready",
  providers: {
    maps: "Google Maps Platform",
    lodging: "future lodging/hostel API",
    places: "Google Places API",
  },
  paceLabels: ["Fast pace", "Balanced pace", "Deep explore"],
  capabilities: [
    "transport burden",
    "budget survivability",
    "route pressure",
    "pace difficulty",
    "nearest departure airport",
  ],
  getSourceBasis() {
    return "Travel evidence is API-ready, not live pricing. Current route output is a strategy estimate based on budget, distance heuristics, and selected destinations.";
  },
};
