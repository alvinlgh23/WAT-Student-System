const dataSet = window.WAT_STATE_DATA;
const stateData = dataSet.states;
const fipsToCode = dataSet.fipsToCode;
const stateEntries = Object.entries(stateData).sort(([, a], [, b]) => a.name.localeCompare(b.name));

const REALITY_SOURCE_BASIS = {
  minimumWage: "Public reference data: state minimum wage law, checked against U.S. Department of Labor-style wage tables.",
  federalTax: "Public reference data: IRS federal tax bracket assumptions used by the simulator.",
  stateTax: "Public reference data: state income-tax range estimate.",
  wageEstimate: "Estimated WAT assumption: common hourly job offers, tips, overtime, and employer quality can move this materially.",
  livingCost: "Estimated benchmark: living-cost pressure calibrated from public cost benchmarks such as MIT Living Wage style data.",
  rentRange: "Estimated WAT assumption: rent is a placeholder range until city, employer, housing deposit, and roommate data are added.",
  score: "Heuristic interpretation: combines wage, rent, tax, costs, job density, travel access, volatility, and selected student strategy.",
};

const VERIFY_BEFORE_ACCEPTING = [
  "housing cost and deposit",
  "guaranteed weekly hours",
  "commute method",
  "overtime policy",
  "whether meals are provided",
  "whether a second job is realistic",
  "local transport access",
];

const REALITY_TIER_DEFINITIONS = [
  { min: 85, label: "Safe saver", meaning: "Strong chance of returning with cash if spending is controlled." },
  { min: 70, label: "Balanced", meaning: "Can save and travel if rent stays reasonable." },
  { min: 55, label: "High-variance", meaning: "Outcome depends heavily on employer, city, and housing." },
  { min: 40, label: "Experience-heavy", meaning: "Good memories possible, but savings may be weak." },
  { min: 25, label: "Fragile setup", meaning: "Small changes in rent, hours, or travel can break the plan." },
  { min: 0, label: "Trap setup", meaning: "High risk of returning with little or negative savings unless conditions improve." },
];

// Placeholder demo data: replace with city-level research, sponsor/employer inputs, and student reviews later.
const LOCAL_RECOMMENDATION_TEMPLATES = {
  cheapGroceries: ["Walmart, Aldi, Trader Joe's, and local Asian groceries are usually the first price checks.", "Use weekly flyers before buying bulk. Small resort towns often charge more."],
  transport: ["Check if employer housing includes shuttle service before paying for a carpool.", "In spread-out states, budget extra for rideshares or shared rentals."],
  phonePlans: ["Mint Mobile, Visible, T-Mobile prepaid, and AT&T prepaid are common student picks.", "Confirm coverage around housing and work location, not only the nearest city."],
  safety: ["Avoid isolated late-night walks after shifts. Share housing and commute details with friends.", "Keep passport, DS-2019, and emergency contacts backed up digitally."],
  jobTypes: ["Hospitality, food service, lifeguard, amusement park, retail, resort, and housekeeping roles are common.", "Ask about overtime rules, uniform cost, tips, and average weekly hours."],
  housing: ["Prioritize employer-arranged housing or verified student groups before private listings.", "Calculate rent weekly and monthly; some offers look cheaper until deposits and utilities appear."],
  nearbyTravel: ["Build short weekend trips first, then save the big route for after the work period.", "Use buses and trains when possible; flights can erase savings quickly."],
  survivalTips: ["Track spending weekly, keep one emergency fund, and avoid buying travel tickets before your hours stabilize.", "If hours drop for two weeks, cut travel budget before touching food or rent money."],
};

// Placeholder route ideas for demo use. A production version should use real city, transport, and accommodation data.
const TRAVEL_ROUTE_SETS = {
  Northeast: ["New York City", "Boston", "Washington, DC", "Philadelphia"],
  Southeast: ["Orlando", "Miami", "Savannah", "New Orleans"],
  Midwest: ["Chicago", "St. Louis", "Nashville", "Minneapolis"],
  West: ["Los Angeles", "San Francisco", "Las Vegas", "Seattle"],
  Mountain: ["Denver", "Salt Lake City", "Grand Canyon", "Yellowstone"],
  Pacific: ["Honolulu", "Maui", "Los Angeles", "San Francisco"],
};

// Placeholder city graph for frontend demo routing. Replace with real distance, fare, and airport data later.
const CITY_GRAPH = {
  "alabama": { name: "Alabama", region: "Southeast", x: 56, y: 68, airport: "BHM" },
  "alaska": { name: "Alaska", region: "West", x: 3, y: 12, airport: "ANC" },
  "arizona": { name: "Arizona", region: "Mountain", x: 18, y: 65, airport: "PHX" },
  "arkansas": { name: "Arkansas", region: "Southeast", x: 48, y: 62, airport: "LIT" },
  "california": { name: "California", region: "West", x: 8, y: 58, airport: "LAX" },
  "colorado": { name: "Colorado", region: "Mountain", x: 28, y: 50, airport: "DEN" },
  "connecticut": { name: "Connecticut", region: "Northeast", x: 80, y: 30, airport: "BDL" },
  "delaware": { name: "Delaware", region: "Northeast", x: 71, y: 38, airport: "PHL" },
  "florida": { name: "Florida", region: "Southeast", x: 70, y: 82, airport: "MCO" },
  "georgia": { name: "Georgia", region: "Southeast", x: 61, y: 69, airport: "ATL" },
  "hawaii": { name: "Hawaii", region: "Pacific", x: 2, y: 92, airport: "HNL" },
  "idaho": { name: "Idaho", region: "Mountain", x: 20, y: 30, airport: "BOI" },
  "illinois": { name: "Illinois", region: "Midwest", x: 49, y: 45, airport: "ORD" },
  "indiana": { name: "Indiana", region: "Midwest", x: 55, y: 43, airport: "IND" },
  "iowa": { name: "Iowa", region: "Midwest", x: 45, y: 39, airport: "DSM" },
  "kansas": { name: "Kansas", region: "Midwest", x: 38, y: 51, airport: "MCI" },
  "kentucky": { name: "Kentucky", region: "Southeast", x: 56, y: 54, airport: "SDF" },
  "louisiana": { name: "Louisiana", region: "Southeast", x: 49, y: 74, airport: "MSY" },
  "maine": { name: "Maine", region: "Northeast", x: 86, y: 18, airport: "PWM" },
  "maryland": { name: "Maryland", region: "Northeast", x: 69, y: 39, airport: "BWI" },
  "massachusetts": { name: "Massachusetts", region: "Northeast", x: 82, y: 27, airport: "BOS" },
  "michigan": { name: "Michigan", region: "Midwest", x: 56, y: 31, airport: "DTW" },
  "minnesota": { name: "Minnesota", region: "Midwest", x: 42, y: 24, airport: "MSP" },
  "mississippi": { name: "Mississippi", region: "Southeast", x: 53, y: 70, airport: "JAN" },
  "missouri": { name: "Missouri", region: "Midwest", x: 44, y: 52, airport: "STL" },
  "montana": { name: "Montana", region: "Mountain", x: 25, y: 22, airport: "BZN" },
  "nebraska": { name: "Nebraska", region: "Midwest", x: 38, y: 42, airport: "OMA" },
  "nevada": { name: "Nevada", region: "West", x: 13, y: 51, airport: "LAS" },
  "new hampshire": { name: "New Hampshire", region: "Northeast", x: 82, y: 23, airport: "MHT" },
  "new jersey": { name: "New Jersey", region: "Northeast", x: 75, y: 32, airport: "EWR" },
  "new mexico": { name: "New Mexico", region: "Mountain", x: 28, y: 64, airport: "ABQ" },
  "new york state": { name: "New York State", region: "Northeast", x: 72, y: 27, airport: "JFK" },
  "north carolina": { name: "North Carolina", region: "Southeast", x: 66, y: 57, airport: "CLT" },
  "north dakota": { name: "North Dakota", region: "Midwest", x: 38, y: 20, airport: "FAR" },
  "ohio": { name: "Ohio", region: "Midwest", x: 60, y: 43, airport: "CLE" },
  "oklahoma": { name: "Oklahoma", region: "Midwest", x: 40, y: 60, airport: "OKC" },
  "oregon": { name: "Oregon", region: "West", x: 8, y: 35, airport: "PDX" },
  "pennsylvania": { name: "Pennsylvania", region: "Northeast", x: 68, y: 35, airport: "PHL" },
  "rhode island": { name: "Rhode Island", region: "Northeast", x: 82, y: 30, airport: "PVD" },
  "south carolina": { name: "South Carolina", region: "Southeast", x: 64, y: 64, airport: "CHS" },
  "south dakota": { name: "South Dakota", region: "Midwest", x: 37, y: 31, airport: "FSD" },
  "tennessee": { name: "Tennessee", region: "Southeast", x: 55, y: 60, airport: "BNA" },
  "texas": { name: "Texas", region: "West", x: 39, y: 75, airport: "DFW" },
  "utah": { name: "Utah", region: "Mountain", x: 20, y: 50, airport: "SLC" },
  "vermont": { name: "Vermont", region: "Northeast", x: 80, y: 22, airport: "BTV" },
  "virginia": { name: "Virginia", region: "Southeast", x: 66, y: 48, airport: "IAD" },
  "washington state": { name: "Washington State", region: "West", x: 8, y: 19, airport: "SEA" },
  "west virginia": { name: "West Virginia", region: "Southeast", x: 62, y: 48, airport: "CRW" },
  "wisconsin": { name: "Wisconsin", region: "Midwest", x: 49, y: 30, airport: "MKE" },
  "wyoming": { name: "Wyoming", region: "Mountain", x: 28, y: 35, airport: "JAC" },
  "anchorage": { name: "Anchorage", region: "West", x: 3, y: 12, airport: "ANC" },
  "atlanta": { name: "Atlanta", region: "Southeast", x: 60, y: 66, airport: "ATL" },
  "austin": { name: "Austin", region: "West", x: 40, y: 75, airport: "AUS" },
  "charleston": { name: "Charleston", region: "Southeast", x: 66, y: 66, airport: "CHS" },
  "charlotte": { name: "Charlotte", region: "Southeast", x: 65, y: 58, airport: "CLT" },
  "cleveland": { name: "Cleveland", region: "Midwest", x: 61, y: 39, airport: "CLE" },
  "dallas": { name: "Dallas", region: "West", x: 39, y: 69, airport: "DFW" },
  "honolulu": { name: "Honolulu", region: "Pacific", x: 2, y: 92, airport: "HNL" },
  "houston": { name: "Houston", region: "West", x: 43, y: 78, airport: "IAH" },
  "indianapolis": { name: "Indianapolis", region: "Midwest", x: 55, y: 46, airport: "IND" },
  "kansas city": { name: "Kansas City", region: "Midwest", x: 42, y: 50, airport: "MCI" },
  "memphis": { name: "Memphis", region: "Southeast", x: 51, y: 63, airport: "MEM" },
  "minneapolis": { name: "Minneapolis", region: "Midwest", x: 43, y: 26, airport: "MSP" },
  "phoenix": { name: "Phoenix", region: "Mountain", x: 19, y: 66, airport: "PHX" },
  "portland": { name: "Portland", region: "West", x: 8, y: 34, airport: "PDX" },
  "salt lake city": { name: "Salt Lake City", region: "Mountain", x: 21, y: 47, airport: "SLC" },
  "san diego": { name: "San Diego", region: "West", x: 10, y: 70, airport: "SAN" },
  "yellowstone": { name: "Yellowstone", region: "Mountain", x: 27, y: 32, airport: "JAC" },
  "grand canyon": { name: "Grand Canyon", region: "Mountain", x: 20, y: 61, airport: "PHX" },
  "yosemite": { name: "Yosemite", region: "West", x: 10, y: 52, airport: "SFO" },
  "newark": { name: "Newark", region: "Northeast", x: 75, y: 32, airport: "EWR" },
  "newark airport": { name: "Newark Airport (EWR)", region: "Northeast", x: 75, y: 32, airport: "EWR" },
  "new york": { name: "New York City", region: "Northeast", x: 76, y: 31, airport: "JFK" },
  "new york city": { name: "New York City", region: "Northeast", x: 76, y: 31, airport: "JFK" },
  "boston": { name: "Boston", region: "Northeast", x: 82, y: 24, airport: "BOS" },
  "washington dc": { name: "Washington, DC", region: "Northeast", x: 68, y: 39, airport: "DCA" },
  "washington, dc": { name: "Washington, DC", region: "Northeast", x: 68, y: 39, airport: "DCA" },
  "philadelphia": { name: "Philadelphia", region: "Northeast", x: 72, y: 35, airport: "PHL" },
  "miami": { name: "Miami", region: "Southeast", x: 72, y: 88, airport: "MIA" },
  "orlando": { name: "Orlando", region: "Southeast", x: 69, y: 78, airport: "MCO" },
  "savannah": { name: "Savannah", region: "Southeast", x: 64, y: 68, airport: "SAV" },
  "new orleans": { name: "New Orleans", region: "Southeast", x: 49, y: 75, airport: "MSY" },
  "chicago": { name: "Chicago", region: "Midwest", x: 48, y: 34, airport: "ORD" },
  "st. louis": { name: "St. Louis", region: "Midwest", x: 45, y: 50, airport: "STL" },
  "nashville": { name: "Nashville", region: "Southeast", x: 54, y: 58, airport: "BNA" },
  "denver": { name: "Denver", region: "Mountain", x: 27, y: 48, airport: "DEN" },
  "las vegas": { name: "Las Vegas", region: "West", x: 16, y: 58, airport: "LAS" },
  "los angeles": { name: "Los Angeles", region: "West", x: 9, y: 67, airport: "LAX" },
  "san francisco": { name: "San Francisco", region: "West", x: 6, y: 49, airport: "SFO" },
  "seattle": { name: "Seattle", region: "West", x: 8, y: 16, airport: "SEA" },
  "niagara falls": { name: "Niagara Falls", region: "Northeast", x: 63, y: 25, airport: "BUF" },
};

const REGION_BY_STATE = {
  CT: "Northeast", DE: "Northeast", MA: "Northeast", MD: "Northeast", ME: "Northeast", NH: "Northeast", NJ: "Northeast", NY: "Northeast", PA: "Northeast", RI: "Northeast", VT: "Northeast",
  AL: "Southeast", AR: "Southeast", FL: "Southeast", GA: "Southeast", KY: "Southeast", LA: "Southeast", MS: "Southeast", NC: "Southeast", SC: "Southeast", TN: "Southeast", VA: "Southeast", WV: "Southeast",
  IA: "Midwest", IL: "Midwest", IN: "Midwest", KS: "Midwest", MI: "Midwest", MN: "Midwest", MO: "Midwest", ND: "Midwest", NE: "Midwest", OH: "Midwest", OK: "Midwest", SD: "Midwest", WI: "Midwest",
  AZ: "Mountain", CO: "Mountain", ID: "Mountain", MT: "Mountain", NM: "Mountain", NV: "Mountain", UT: "Mountain", WY: "Mountain",
  AK: "West", CA: "West", OR: "West", TX: "West", WA: "West",
  HI: "Pacific",
};

enrichStateData();

const SCENARIOS = {
  conservative: { label: "Conservative", hours: 30, rentFactor: 1.05, spendFactor: 1.08, travelBudget: 900, secondJob: false },
  normal: { label: "Normal", hours: 38, rentFactor: 1, spendFactor: 1, travelBudget: 1200, secondJob: false },
  hustle: { label: "Hustle", hours: 48, rentFactor: 0.95, spendFactor: 0.9, travelBudget: 1500, secondJob: false },
  secondJob: { label: "Second job", hours: 40, rentFactor: 0.95, spendFactor: 0.88, travelBudget: 1700, secondJob: true, secondJobHours: 12 },
};

// Placeholder personality copy for demo positioning. Replace with student interview data later.
const STATE_PERSONALITIES = {
  FL: "Tourism money printer, but rent fights back.",
  HI: "Dream destination. Nightmare savings math.",
  MO: "Quiet sleeper pick for serious savers.",
  NJ: "Strong wage zone, painful housing zone.",
  TX: "No income tax, but city choice decides the game.",
  CA: "Big earnings, bigger rent pressure.",
  NY: "Iconic summer, brutal city math.",
  NV: "Hospitality upside with no income-tax drag.",
  DE: "Tiny state, surprisingly clean savings math.",
  WA: "High wages, high rent, serious planning required.",
};

function getRealityTier(score) {
  return REALITY_TIER_DEFINITIONS.find((tier) => score >= tier.min) || REALITY_TIER_DEFINITIONS.at(-1);
}

function getCostPressureScore(costLevel) {
  if (costLevel === "Very high") return 22;
  if (costLevel === "High") return 16;
  if (costLevel === "Medium") return 9;
  return 4;
}

function getJobMarketScore(state) {
  const wage = averageFromRange(state.averageWage);
  let score = 52;
  if (state.minimumWage >= 15) score += 16;
  else if (state.minimumWage >= 12) score += 9;
  else if (state.minimumWage <= 8) score -= 10;
  if (wage >= 28) score += 18;
  else if (wage >= 24) score += 10;
  else if (wage < 20) score -= 8;
  if (/tourism|hospitality|seasonal|metro|many jobs|large job/i.test(`${state.verdict} ${state.scoreFactors.join(" ")}`)) score += 8;
  return clamp(score, 20, 95);
}

function getTravelAccessScore(code) {
  const region = REGION_BY_STATE[code];
  let score = { Northeast: 82, Southeast: 72, Midwest: 58, Mountain: 64, West: 76, Pacific: 70 }[region] || 58;
  if (["CA", "FL", "NY", "NJ", "NV", "IL", "MA", "WA", "CO", "HI"].includes(code)) score += 10;
  if (["ND", "SD", "WY", "WV", "MS", "AR"].includes(code)) score -= 8;
  return clamp(score, 25, 96);
}

function getHousingVolatilityScore(state) {
  const rent = averageFromRange(state.rentRange);
  let score = 20;
  if (rent >= 1500) score += 42;
  else if (rent >= 1200) score += 30;
  else if (rent >= 950) score += 18;
  else if (rent <= 700) score -= 6;
  if (state.costLevel === "Very high") score += 18;
  else if (state.costLevel === "High") score += 10;
  if (/housing|rent|city choice|logistics|park/i.test(`${state.verdict} ${state.scoreFactors.join(" ")}`)) score += 8;
  return clamp(score, 10, 95);
}

function calculateRealityScore(code, studentType = activeStudentType || "saver") {
  const state = stateData[code];
  const wage = averageFromRange(state.averageWage);
  const rent = averageFromRange(state.rentRange);
  const savings = averageFromRange(state.savingsRange);
  const taxRate = estimateStateIncomeTaxRate(code);
  const wageStrength = clamp((wage - 15) * 5.2 + (state.minimumWage - 7.25) * 2.3, 10, 100);
  const rentScore = clamp(100 - (rent - 500) / 12, 5, 100);
  const taxScore = clamp(100 - taxRate * 900, 20, 100);
  const costScore = clamp(100 - getCostPressureScore(state.costLevel) * 3.1, 10, 96);
  const jobScore = getJobMarketScore(state);
  const travelScore = getTravelAccessScore(code);
  const volatilityScore = clamp(100 - getHousingVolatilityScore(state), 5, 95);
  const savingsScore = clamp((savings - 250) / 7, 10, 100);
  const weightsByType = {
    saver: { wageStrength: 0.2, rentScore: 0.25, taxScore: 0.12, costScore: 0.15, jobScore: 0.08, travelScore: 0.06, volatilityScore: 0.08, savingsScore: 0.06 },
    traveler: { wageStrength: 0.14, rentScore: 0.16, taxScore: 0.07, costScore: 0.1, jobScore: 0.1, travelScore: 0.24, volatilityScore: 0.08, savingsScore: 0.11 },
    survivor: { wageStrength: 0.14, rentScore: 0.28, taxScore: 0.09, costScore: 0.18, jobScore: 0.09, travelScore: 0.05, volatilityScore: 0.13, savingsScore: 0.04 },
    grinder: { wageStrength: 0.25, rentScore: 0.16, taxScore: 0.08, costScore: 0.09, jobScore: 0.18, travelScore: 0.06, volatilityScore: 0.05, savingsScore: 0.13 },
  };
  const weights = weightsByType[studentType] || weightsByType.saver;
  const raw = Object.entries(weights).reduce((total, [key, weight]) => total + ({
    wageStrength, rentScore, taxScore, costScore, jobScore, travelScore, volatilityScore, savingsScore,
  })[key] * weight, 0);
  const grinderPenalty = studentType === "grinder" && getHousingVolatilityScore(state) > 70 ? 4 : 0;
  return Math.round(clamp(raw - grinderPenalty, 12, 96));
}

function getDataConfidence(code, score) {
  const state = stateData[code];
  const rent = averageFromRange(state.rentRange);
  const volatility = getHousingVolatilityScore(state);
  const taxKnown = !/range|-/i.test(state.incomeTax) || estimateStateIncomeTaxRate(code) <= 0.03;
  if (rent >= 1350 || volatility >= 72 || state.costLevel === "Very high") {
    return {
      level: "Low",
      reason: "Public wage and tax data are usable, but rent, city choice, and employer housing can swing the result hard.",
    };
  }
  if (score >= 76 && volatility < 45 && taxKnown) {
    return {
      level: "High",
      reason: "Wage law, tax assumptions, and cost pressure are comparatively clear. Still verify the employer offer.",
    };
  }
  return {
    level: "Medium",
    reason: "Public wage/tax references are stable enough for planning, but housing and actual hours still depend on employer and city.",
  };
}

function buildRealityProfile(code, studentType = activeStudentType || "saver") {
  const state = stateData[code];
  const score = calculateRealityScore(code, studentType);
  const tier = getRealityTier(score);
  const rent = averageFromRange(state.rentRange);
  const wage = averageFromRange(state.averageWage);
  const confidence = getDataConfidence(code, score);
  const highRent = rent >= 1150;
  const lowWage = wage < 21 || state.minimumWage <= 8;
  const noTax = state.incomeTax.includes("No");
  const strongTravel = getTravelAccessScore(code) >= 78;
  const bestFor = [];
  if (score >= 70 || noTax) bestFor.push("students trying to protect bring-home cash");
  if (strongTravel) bestFor.push("travelers who can control early spending");
  if (getJobMarketScore(state) >= 72) bestFor.push("students chasing stronger hours or tips");
  if (!bestFor.length) bestFor.push("students with confirmed housing and reliable hours");
  const dangerousFor = [];
  if (highRent) dangerousFor.push("no housing support");
  if (lowWage) dangerousFor.push("low-hour or minimum-wage placements");
  if (strongTravel) dangerousFor.push("students who book travel before hours stabilize");
  if (!dangerousFor.length) dangerousFor.push("students who accept without checking commute and scheduled hours");
  const biggestRisk = highRent
    ? "Rent can erase the wage advantage before the summer stabilizes."
    : lowWage
      ? "Low hourly offers can keep savings thin even when rent looks friendly."
      : strongTravel
        ? "Easy travel access can tempt early overspending."
        : "Employer quality matters more than the state average.";
  const verifyFirst = highRent ? "Employer housing cost and deposit." : lowWage ? "Minimum scheduled hours and overtime availability." : "Commute method and realistic weekly hours.";
  const realityCheck = highRent
    ? "High rent can erase wage advantage fast."
    : noTax && lowWage
      ? "No income tax helps, but low wages can still limit savings."
      : strongTravel
        ? "Travel access is a gift, but it can pull money out of the plan early."
        : "This setup can work, but only if the employer offer is stronger than the state baseline.";
  const warning = highRent
    ? "This state looks strong on wages, but rent volatility can erase the advantage."
    : noTax && lowWage
      ? "No income tax helps, but low wages can still limit savings."
      : strongTravel
        ? "High travel access can tempt students into overspending early."
        : "Low rent helps, but fewer city attractions may reduce experience value.";
  const why = [
    highRent ? "Rent burden is the main swing factor, so housing support changes the whole outcome." : "Rent burden is manageable enough that hours and spending discipline matter more.",
    wage >= 24 ? "Wage upside exists, but the offer still needs guaranteed hours." : "Wage upside is limited, so minimum scheduled hours matter more than the headline state facts.",
    strongTravel ? "Travel access is strong, which improves the experience but can weaken savings discipline." : "Travel access is more limited, which may protect money but reduce post-work flexibility.",
    confidence.level === "Low" ? "Savings confidence is lower because city and housing variance are large." : "Savings confidence is usable for planning, not precise enough for blind acceptance.",
  ];
  return {
    score,
    tier: tier.label,
    meaning: tier.meaning,
    confidence,
    bestFor,
    dangerousFor,
    biggestRisk,
    verifyFirst,
    realityCheck,
    warning,
    why,
    verifyChecklist: VERIFY_BEFORE_ACCEPTING,
    sourceBasis: REALITY_SOURCE_BASIS,
    futureUserData: "Future version: student-submitted wage, rent, employer, and city data will improve this estimate.",
  };
}

function enrichStateData() {
  stateEntries.forEach(([code, state]) => {
    const profile = buildRealityProfile(code, "saver");
    state.publicData = {
      minimumWage: state.minimumWage,
      incomeTaxRange: state.incomeTax,
      salesTax: state.salesTax,
      sourceNotes: {
        minimumWage: REALITY_SOURCE_BASIS.minimumWage,
        incomeTax: REALITY_SOURCE_BASIS.stateTax,
        salesTax: "Public reference data: state sales-tax baseline estimate; city/local add-ons can apply.",
      },
    };
    state.estimatedWatData = {
      expectedWatWageRange: state.averageWage,
      rentRange: state.rentRange,
      jobMarket: getJobMarketScore(state),
      housingVolatility: getHousingVolatilityScore(state),
      travelAccess: getTravelAccessScore(code),
      typicalSavingsRange: state.savingsRange,
      commonJobs: LOCAL_RECOMMENDATION_TEMPLATES.jobTypes[0],
      estimatedMonthlyCost: state.costLevel,
    };
    state.heuristicProfile = {
      ...profile,
      realityTier: profile.tier,
      sourceBasis: REALITY_SOURCE_BASIS,
    };
    state.userSignalPlaceholders = {
      submittedWages: null,
      submittedRent: null,
      employerReviews: null,
      cityTips: null,
    };
    state.score = profile.score;
  });
}

const RANKINGS = {
  savings: { label: "Best states for saving", metric: (code) => averageFromRange(stateData[code].savingsRange), suffix: "avg savings" },
  rent: { label: "Best states for low rent", metric: (code) => -averageFromRange(stateData[code].rentRange), display: (code) => moneyWhole(averageFromRange(stateData[code].rentRange)), suffix: "avg rent" },
  tax: { label: "Best states for no/low income tax", metric: (code) => -estimateStateIncomeTaxRate(code), display: (code) => percent(estimateStateIncomeTaxRate(code)), suffix: "estimated state tax" },
  score: { label: "Best overall WAT reality fit", metric: (code) => calculateRealityScore(code, activeStudentType), suffix: "reality score" },
  type: { label: "Best for selected student type", metric: (code) => getStudentTypeMapScore(code), suffix: "type fit" },
};

const MAP_LAYERS = {
  savings: { label: "Best savings", ranking: "savings", value: (code) => averageFromRange(stateData[code].savingsRange), high: 700, mid: 520 },
  rent: { label: "Lowest rent", ranking: "rent", value: (code) => -averageFromRange(stateData[code].rentRange), high: -700, mid: -1050 },
  tax: { label: "Lowest tax", ranking: "tax", value: (code) => -estimateStateIncomeTaxRate(code), high: -0.01, mid: -0.045 },
  score: { label: "Best WAT reality fit", ranking: "score", value: (code) => calculateRealityScore(code, activeStudentType), high: 72, mid: 60 },
  type: { label: "Best for selected student type", ranking: "type", value: (code) => getStudentTypeMapScore(code), high: 94, mid: 70 },
};

const STUDENT_TYPES = {
  saver: {
    title: "The Saver",
    copy: "Comes home with money.",
    ranking: "savings",
    mapLayer: "savings",
    scenario: "conservative",
    match: (code) => averageFromRange(stateData[code].savingsRange) >= 650 || (averageFromRange(stateData[code].rentRange) <= 900 && estimateStateIncomeTaxRate(code) <= 0.03),
  },
  traveler: {
    title: "The Traveler",
    copy: "Turns the summer into memories.",
    ranking: "score",
    mapLayer: "score",
    scenario: "normal",
    match: (code) => ["CA", "FL", "NY", "NV", "WA", "CO", "MA", "IL"].includes(code),
  },
  survivor: {
    title: "The Survivor",
    copy: "Keeps risk low and avoids budget disasters.",
    ranking: "rent",
    mapLayer: "rent",
    scenario: "conservative",
    match: (code) => ["Low", "Medium"].includes(stateData[code].costLevel) && averageFromRange(stateData[code].rentRange) <= 1050,
  },
  grinder: {
    title: "The Grinder",
    copy: "Works more, sleeps less, leaves with cash.",
    ranking: "savings",
    mapLayer: "savings",
    scenario: "secondJob",
    match: (code) => averageFromRange(stateData[code].averageWage) >= 24 || stateData[code].minimumWage >= 15,
  },
};

const APP_STORAGE_KEY = "wat-app-state-v1";
const LIVE_STORAGE_KEY = "wat-live-summer-v1";
const MOOD_STRESS = {
  Chilling: -8,
  Tired: 12,
  Homesick: 16,
  Grinding: 10,
  Broke: 24,
  Winning: -12,
};
const MS_PER_DAY = 86400000;

const elements = {
  stateLayer: document.querySelector("#stateLayer"),
  mapLoading: document.querySelector("#mapLoading"),
  mapTip: document.querySelector("#mapTip"),
  stateSelect: document.querySelector("#stateSelect"),
  dataUpdated: document.querySelector("#dataUpdated"),
  mapLayerTabs: document.querySelector("#mapLayerTabs"),
  mapLegendLabel: document.querySelector("#mapLegendLabel"),
  stateName: document.querySelector("#stateName"),
  statePersonality: document.querySelector("#statePersonality"),
  stateVerdict: document.querySelector("#stateVerdict"),
  survivalScore: document.querySelector("#survivalScore"),
  realityMeaning: document.querySelector("#realityMeaning"),
  realityScore: document.querySelector("#realityScore"),
  realityDecisionCard: document.querySelector("#realityDecisionCard"),
  scoreFill: document.querySelector("#scoreFill"),
  minWage: document.querySelector("#minWage"),
  avgWage: document.querySelector("#avgWage"),
  incomeTax: document.querySelector("#incomeTax"),
  salesTax: document.querySelector("#salesTax"),
  costLevel: document.querySelector("#costLevel"),
  rentRange: document.querySelector("#rentRange"),
  savings: document.querySelector("#savings"),
  scoreFactors: document.querySelector("#scoreFactors"),
  sourceBasis: document.querySelector("#sourceBasis"),
  quickWage: document.querySelector("#quickWage"),
  quickTax: document.querySelector("#quickTax"),
  quickScore: document.querySelector("#quickScore"),
  comparePicker: document.querySelector("#comparePicker"),
  comparisonNotice: document.querySelector("#comparisonNotice"),
  comparisonBody: document.querySelector("#comparisonBody"),
  rankingTabs: document.querySelector("#rankingTabs"),
  rankingGrid: document.querySelector("#rankingGrid"),
  calcState: document.querySelector("#calcState"),
  scenarioButtons: document.querySelector("#scenarioButtons"),
  studentTypeGrid: document.querySelector("#studentTypeGrid"),
  studentTypeAdvice: document.querySelector("#studentTypeAdvice"),
  summerSettingsForm: document.querySelector("#summerSettingsForm"),
  dailyLogForm: document.querySelector("#dailyLogForm"),
  memoryMemoForm: document.querySelector("#memoryMemoForm"),
  memoryMemoText: document.querySelector("#memoryMemoText"),
  summerDayCount: document.querySelector("#summerDayCount"),
  summerStatusLine: document.querySelector("#summerStatusLine"),
  summerProgressFill: document.querySelector("#summerProgressFill"),
  daysCompleted: document.querySelector("#daysCompleted"),
  summerCompletion: document.querySelector("#summerCompletion"),
  liveProjectedSavings: document.querySelector("#liveProjectedSavings"),
  liveInsight: document.querySelector("#liveInsight"),
  liveTrackedEarnings: document.querySelector("#liveTrackedEarnings"),
  liveTrackedSpending: document.querySelector("#liveTrackedSpending"),
  liveAfterTravel: document.querySelector("#liveAfterTravel"),
  liveWeeklyHours: document.querySelector("#liveWeeklyHours"),
  liveWorkIntensity: document.querySelector("#liveWorkIntensity"),
  liveSavingsTrend: document.querySelector("#liveSavingsTrend"),
  liveTravelFund: document.querySelector("#liveTravelFund"),
  livePaycheckCountdown: document.querySelector("#livePaycheckCountdown"),
  stickySummerStatus: document.querySelector("#stickySummerStatus"),
  stickySummerText: document.querySelector("#stickySummerText"),
  journeyNav: document.querySelector("#journeyNav"),
  watStartDate: document.querySelector("#watStartDate"),
  watEndDate: document.querySelector("#watEndDate"),
  weeklyWorkTarget: document.querySelector("#weeklyWorkTarget"),
  savingsTarget: document.querySelector("#savingsTarget"),
  payFrequency: document.querySelector("#payFrequency"),
  nextPayday: document.querySelector("#nextPayday"),
  logHours: document.querySelector("#logHours"),
  logTips: document.querySelector("#logTips"),
  logSpending: document.querySelector("#logSpending"),
  logMood: document.querySelector("#logMood"),
  logCity: document.querySelector("#logCity"),
  logBestMoment: document.querySelector("#logBestMoment"),
  logNote: document.querySelector("#logNote"),
  liveTimelineSummary: document.querySelector("#liveTimelineSummary"),
  liveSavingsTimeline: document.querySelector("#liveSavingsTimeline"),
  liveStressLevel: document.querySelector("#liveStressLevel"),
  liveStressFill: document.querySelector("#liveStressFill"),
  liveStressCopy: document.querySelector("#liveStressCopy"),
  summerMilestones: document.querySelector("#summerMilestones"),
  memoryTitle: document.querySelector("#memoryTitle"),
  memoryTimeline: document.querySelector("#memoryTimeline"),
  clearLogsButton: document.querySelector("#clearLogsButton"),
  resetDemoButton: document.querySelector("#resetDemoButton"),
  hourlyWage: document.querySelector("#hourlyWage"),
  hoursPerWeek: document.querySelector("#hoursPerWeek"),
  workingWeeks: document.querySelector("#workingWeeks"),
  monthlyRent: document.querySelector("#monthlyRent"),
  foodSpend: document.querySelector("#foodSpend"),
  transportSpend: document.querySelector("#transportSpend"),
  otherSpend: document.querySelector("#otherSpend"),
  travelBudgetAfterWork: document.querySelector("#travelBudgetAfterWork"),
  secondJobToggle: document.querySelector("#secondJobToggle"),
  secondJobFields: document.querySelector("#secondJobFields"),
  secondJobWage: document.querySelector("#secondJobWage"),
  secondJobHours: document.querySelector("#secondJobHours"),
  simulatorNotice: document.querySelector("#simulatorNotice"),
  finalSavings: document.querySelector("#finalSavings"),
  savingsVerdict: document.querySelector("#savingsVerdict"),
  decisionSummary: document.querySelector("#decisionSummary"),
  fixFirst: document.querySelector("#fixFirst"),
  worstCaseSavings: document.querySelector("#worstCaseSavings"),
  likelyCaseSavings: document.querySelector("#likelyCaseSavings"),
  bestCaseSavings: document.querySelector("#bestCaseSavings"),
  savingsRangeInsight: document.querySelector("#savingsRangeInsight"),
  stressLevel: document.querySelector("#stressLevel"),
  stressFill: document.querySelector("#stressFill"),
  stressWhy: document.querySelector("#stressWhy"),
  timelineSummary: document.querySelector("#timelineSummary"),
  savingsTimeline: document.querySelector("#savingsTimeline"),
  moneyUseCards: document.querySelector("#moneyUseCards"),
  grossMonthly: document.querySelector("#grossMonthly"),
  taxDeduction: document.querySelector("#taxDeduction"),
  livingCost: document.querySelector("#livingCost"),
  monthlySavings: document.querySelector("#monthlySavings"),
  totalBeforeTravel: document.querySelector("#totalBeforeTravel"),
  travelDeduction: document.querySelector("#travelDeduction"),
  travelState: document.querySelector("#travelState"),
  startCity: document.querySelector("#startCity"),
  travelDays: document.querySelector("#travelDays"),
  tripBudget: document.querySelector("#tripBudget"),
  travelStyle: document.querySelector("#travelStyle"),
  suggestedRoute: document.querySelector("#suggestedRoute"),
  tripWarning: document.querySelector("#tripWarning"),
  transportCost: document.querySelector("#transportCost"),
  accommodationCost: document.querySelector("#accommodationCost"),
  tripFoodCost: document.querySelector("#tripFoodCost"),
  totalTripCost: document.querySelector("#totalTripCost"),
  recommendedStops: document.querySelector("#recommendedStops"),
  routePlannerNotice: document.querySelector("#routePlannerNotice"),
  optimizerStart: document.querySelector("#optimizerStart"),
  optimizerEnd: document.querySelector("#optimizerEnd"),
  optimizerDays: document.querySelector("#optimizerDays"),
  optimizerBudget: document.querySelector("#optimizerBudget"),
  optimizerStyle: document.querySelector("#optimizerStyle"),
  optimizerTransport: document.querySelector("#optimizerTransport"),
  preferredPicker: document.querySelector("#preferredPicker"),
  mustPicker: document.querySelector("#mustPicker"),
  optionalPicker: document.querySelector("#optionalPicker"),
  preferredDestinations: document.querySelector("#preferredDestinations"),
  mustVisitPlaces: document.querySelector("#mustVisitPlaces"),
  optionalPlaces: document.querySelector("#optionalPlaces"),
  preferredChips: document.querySelector("#preferredChips"),
  mustChips: document.querySelector("#mustChips"),
  optionalChips: document.querySelector("#optionalChips"),
  optimizedRoute: document.querySelector("#optimizedRoute"),
  optimizerWarnings: document.querySelector("#optimizerWarnings"),
  optimizedStops: document.querySelector("#optimizedStops"),
  optimizerTransportCost: document.querySelector("#optimizerTransportCost"),
  optimizerAccommodationCost: document.querySelector("#optimizerAccommodationCost"),
  optimizerFoodCost: document.querySelector("#optimizerFoodCost"),
  optimizerTotalCost: document.querySelector("#optimizerTotalCost"),
  routeIntensity: document.querySelector("#routeIntensity"),
  routeType: document.querySelector("#routeType"),
  routeTimeline: document.querySelector("#routeTimeline"),
  cheaperRoute: document.querySelector("#cheaperRoute"),
  fasterRoute: document.querySelector("#fasterRoute"),
  routeOptimizerNotice: document.querySelector("#routeOptimizerNotice"),
  summaryType: document.querySelector("#summaryType"),
  summaryHeadline: document.querySelector("#summaryHeadline"),
  summaryState: document.querySelector("#summaryState"),
  summaryWeeks: document.querySelector("#summaryWeeks"),
  summaryStress: document.querySelector("#summaryStress"),
  summaryRoute: document.querySelector("#summaryRoute"),
  summaryVerdict: document.querySelector("#summaryVerdict"),
  generateShareCard: document.querySelector("#generateShareCard"),
  sharePoster: document.querySelector("#sharePoster"),
  posterType: document.querySelector("#posterType"),
  posterSavings: document.querySelector("#posterSavings"),
  posterWeeks: document.querySelector("#posterWeeks"),
  posterState: document.querySelector("#posterState"),
  posterCities: document.querySelector("#posterCities"),
  posterStress: document.querySelector("#posterStress"),
  posterRoute: document.querySelector("#posterRoute"),
  posterVerdict: document.querySelector("#posterVerdict"),
  localStateName: document.querySelector("#localStateName"),
  localMainInsight: document.querySelector("#localMainInsight"),
  localMainInsightCopy: document.querySelector("#localMainInsightCopy"),
  localRecommendations: document.querySelector("#localRecommendations"),
  communityInsights: document.querySelector("#communityInsights"),
};

let appState;
let activeState = "NJ";
let activeRanking = "savings";
let activeScenario = "normal";
let activeMapLayer = "score";
let activeStudentType = "saver";
let selectedCompareStates = ["NJ", "MO", "FL"];
let liveSummerState;
let derivedState = {};

function money(value) {
  return `$${Number(value).toFixed(2)}/hr`;
}

function moneyWhole(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(Math.round(value || 0));
}

function numberWhole(value) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Math.round(value || 0));
}

function animateNumber(element, value, formatter = moneyWhole) {
  const start = Number(element.dataset.value || 0);
  const end = Number.isFinite(value) ? value : 0;
  const startTime = performance.now();
  const duration = 520;
  element.dataset.value = String(end);
  function tick(now) {
    const progress = Math.min(1, (now - startTime) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = formatter(start + (end - start) * eased);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function todayISO() {
  return formatLocalISO(new Date());
}

function formatLocalISO(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDaysISO(dateISO, days) {
  const date = parseLocalDate(dateISO || todayISO());
  date.setDate(date.getDate() + days);
  return formatLocalISO(date);
}

function parseLocalDate(value) {
  const [year, month, day] = String(value || todayISO()).split("-").map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
}

function daysBetween(startISO, endISO) {
  return Math.round((parseLocalDate(endISO) - parseLocalDate(startISO)) / MS_PER_DAY);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function formatMemoryDate(dateISO) {
  return parseLocalDate(dateISO).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function getSummerDatePosition(dateISO, progress = calculateSummerProgress(liveSummerState)) {
  const rawDay = daysBetween(liveSummerState.startDate, dateISO) + 1;
  if (rawDay < 1) {
    return {
      day: rawDay,
      week: 0,
      inWindow: false,
      label: `${formatMemoryDate(dateISO)} · Before WAT`,
      weekLabel: "Before WAT",
      sortDay: rawDay,
    };
  }
  if (rawDay > progress.totalDays) {
    const afterDays = rawDay - progress.totalDays;
    return {
      day: rawDay,
      week: progress.totalWeeks + Math.ceil(afterDays / 7),
      inWindow: false,
      label: `${formatMemoryDate(dateISO)} · After WAT`,
      weekLabel: "After WAT",
      sortDay: rawDay,
    };
  }
  return {
    day: rawDay,
    week: Math.max(1, Math.ceil(rawDay / 7)),
    inWindow: true,
    label: `Day ${rawDay}`,
    weekLabel: `Week ${Math.max(1, Math.ceil(rawDay / 7))}`,
    sortDay: rawDay,
  };
}

function createDefaultLiveSummerState() {
  const start = todayISO();
  return {
    startDate: start,
    endDate: addDaysISO(start, 120),
    weeklyWorkTarget: 40,
    savingsTarget: 5200,
    payFrequency: "biweekly",
    nextPayday: addDaysISO(start, 5),
    logs: [],
  };
}

function loadLiveSummerState() {
  try {
    const stored = JSON.parse(localStorage.getItem(LIVE_STORAGE_KEY));
    return { ...createDefaultLiveSummerState(), ...stored, logs: Array.isArray(stored?.logs) ? stored.logs : [] };
  } catch {
    return createDefaultLiveSummerState();
  }
}

function saveLiveSummerState() {
  localStorage.setItem(LIVE_STORAGE_KEY, JSON.stringify(liveSummerState));
  if (appState) {
    appState.summerSettings = getLiveSettingsSnapshot();
    appState.dailyLogs = Array.isArray(liveSummerState.logs) ? liveSummerState.logs : [];
    localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(appState));
  }
}

function getLiveSettingsSnapshot() {
  const { logs, ...settings } = liveSummerState || createDefaultLiveSummerState();
  return settings;
}

function createDefaultAppState() {
  const liveDefaults = createDefaultLiveSummerState();
  const normalScenario = generateScenario("normal", "NJ");
  return {
    selectedState: "NJ",
    selectedStudentType: "saver",
    activeMapLayer: "score",
    selectedComparisonStates: ["NJ", "MO", "FL"],
    activeRankingMode: "savings",
    activeScenario: "normal",
    simulatorInputs: normalScenario,
    summerSettings: {
      startDate: liveDefaults.startDate,
      endDate: liveDefaults.endDate,
      weeklyWorkTarget: normalScenario.hoursPerWeek,
      savingsTarget: 5200,
      payFrequency: liveDefaults.payFrequency,
      nextPayday: liveDefaults.nextPayday,
    },
    dailyLogs: [],
    routePlannerInputs: {
      currentState: "NJ",
      startCity: "New York City",
      days: 7,
      budget: 1400,
      style: "balanced",
      interests: ["big cities", "nature", "food"],
    },
    customRouteInputs: {
      start: "New Jersey",
      end: "Newark Airport (EWR)",
      days: 10,
      budget: 1500,
      style: "budget",
      transport: "cheapest",
      preferred: "Philadelphia",
      must: "New York, Boston, Washington DC, Miami",
      optional: "Philadelphia, Niagara Falls",
    },
    selectedMustVisitPlaces: ["New York", "Boston", "Washington DC", "Miami"],
    selectedOptionalPlaces: ["Philadelphia", "Niagara Falls"],
    routePlannerResult: {},
    customRouteResult: {},
    finalOutcome: {},
    generatedShareCards: [],
    activeShareCard: null,
    shareCardVisible: false,
  };
}

function getDefaultState() {
  return createDefaultAppState();
}

function normalizeLoadedState(stored) {
  const defaults = createDefaultAppState();
  const merged = { ...defaults, ...(stored || {}) };
  merged.selectedState = stateData[merged.selectedState] ? merged.selectedState : defaults.selectedState;
  merged.selectedStudentType = STUDENT_TYPES[merged.selectedStudentType] ? merged.selectedStudentType : defaults.selectedStudentType;
  merged.activeMapLayer = MAP_LAYERS[merged.activeMapLayer] ? merged.activeMapLayer : defaults.activeMapLayer;
  merged.activeRankingMode = RANKINGS[merged.activeRankingMode] ? merged.activeRankingMode : defaults.activeRankingMode;
  merged.activeScenario = SCENARIOS[merged.activeScenario] ? merged.activeScenario : defaults.activeScenario;
  merged.selectedComparisonStates = (Array.isArray(merged.selectedComparisonStates) ? merged.selectedComparisonStates : defaults.selectedComparisonStates)
    .filter((code) => stateData[code])
    .slice(0, 3);
  if (merged.selectedComparisonStates.length < 2) merged.selectedComparisonStates = defaults.selectedComparisonStates;
  merged.simulatorInputs = { ...defaults.simulatorInputs, ...(merged.simulatorInputs || {}) };
  merged.summerSettings = { ...defaults.summerSettings, ...(merged.summerSettings || {}) };
  merged.dailyLogs = Array.isArray(merged.dailyLogs) ? merged.dailyLogs.slice(-120) : [];
  merged.routePlannerInputs = { ...defaults.routePlannerInputs, ...(merged.routePlannerInputs || {}) };
  merged.customRouteInputs = { ...defaults.customRouteInputs, ...(merged.customRouteInputs || {}) };
  merged.routePlannerResult = { ...defaults.routePlannerResult, ...(merged.routePlannerResult || {}) };
  merged.customRouteResult = { ...defaults.customRouteResult, ...(merged.customRouteResult || {}) };
  merged.generatedShareCards = Array.isArray(merged.generatedShareCards) ? merged.generatedShareCards.slice(-12) : [];
  merged.activeShareCard = merged.activeShareCard && typeof merged.activeShareCard === "object" ? merged.activeShareCard : null;
  merged.selectedMustVisitPlaces = Array.isArray(merged.selectedMustVisitPlaces) ? merged.selectedMustVisitPlaces : splitPlaces(merged.customRouteInputs.must);
  merged.selectedOptionalPlaces = Array.isArray(merged.selectedOptionalPlaces) ? merged.selectedOptionalPlaces : splitPlaces(merged.customRouteInputs.optional);
  return merged;
}

function loadStateFromStorage() {
  try {
    const stored = JSON.parse(localStorage.getItem(APP_STORAGE_KEY));
    if (stored) return normalizeLoadedState(stored);
  } catch {
    // Fall through to default state.
  }

  const defaults = createDefaultAppState();
  try {
    const oldLive = JSON.parse(localStorage.getItem(LIVE_STORAGE_KEY));
    if (oldLive) {
      defaults.summerSettings = { ...defaults.summerSettings, ...oldLive };
      delete defaults.summerSettings.logs;
      defaults.dailyLogs = Array.isArray(oldLive.logs) ? oldLive.logs : [];
    }
  } catch {
    // Ignore legacy live storage if it is malformed.
  }
  return defaults;
}

function saveStateToStorage() {
  if (!appState) return;
  localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(appState));
  localStorage.setItem(LIVE_STORAGE_KEY, JSON.stringify({ ...appState.summerSettings, logs: appState.dailyLogs }));
}

function saveAppState() {
  saveStateToStorage();
}

function loadAppState() {
  return loadStateFromStorage();
}

function syncStateToGlobals() {
  activeState = appState.selectedState;
  activeStudentType = appState.selectedStudentType;
  activeMapLayer = appState.activeMapLayer;
  activeRanking = appState.activeRankingMode;
  activeScenario = appState.activeScenario;
  selectedCompareStates = [...appState.selectedComparisonStates];
}

function syncLiveFromAppState() {
  liveSummerState = { ...appState.summerSettings, logs: [...appState.dailyLogs] };
}

function syncAppStateFromLive() {
  appState.summerSettings = getLiveSettingsSnapshot();
  appState.dailyLogs = [...(liveSummerState.logs || [])];
}

function resetState() {
  if (!window.confirm("Reset all local WAT demo data in this browser?")) return;
  localStorage.removeItem(APP_STORAGE_KEY);
  localStorage.removeItem(LIVE_STORAGE_KEY);
  appState = createDefaultAppState();
  syncStateToGlobals();
  syncLiveFromAppState();
  applyAppStateToForms();
  updateApp({ persist: true });
}

function resetAppState() {
  resetState();
}

function deepMerge(target, patch) {
  const result = { ...target };
  Object.entries(patch || {}).forEach(([key, value]) => {
    if (value && typeof value === "object" && !Array.isArray(value) && typeof result[key] === "object" && !Array.isArray(result[key])) {
      result[key] = deepMerge(result[key], value);
    } else {
      result[key] = value;
    }
  });
  return result;
}

function updateState(patch, options = {}) {
  appState = deepMerge(appState, patch);
  syncStateToGlobals();
  syncLiveFromAppState();
  recalculateDerivedState();
  if (options.render !== false) renderApp({ persist: options.persist !== false, skipForms: options.skipForms });
  else if (options.persist !== false) saveStateToStorage();
}

appState = loadStateFromStorage();
syncStateToGlobals();
syncLiveFromAppState();

function percent(value) {
  return `${(value * 100).toFixed(1)}%`;
}

function averageFromRange(text) {
  const values = String(text).match(/\d[\d,]*(?:\.\d+)?/g)?.map((value) => Number(value.replace(/,/g, ""))) || [0];
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function getLocationOptions() {
  return Object.values(CITY_GRAPH)
    .filter((location, index, all) => all.findIndex((item) => item.name === location.name) === index)
    .sort((a, b) => a.name.localeCompare(b.name));
}

function scoreClass(score) {
  if (score >= 72) return "high";
  if (score >= 60) return "mid";
  return "low";
}

function getStatePersonality(code) {
  if (STATE_PERSONALITIES[code]) return STATE_PERSONALITIES[code];
  const state = stateData[code];
  if (state.incomeTax.toLowerCase().includes("no")) return "Tax-light setup, but the city still decides the savings game.";
  if (state.costLevel === "Very high") return "Big experience state with dangerous rent math.";
  if (averageFromRange(state.savingsRange) >= 700) return "Practical saver pick if the job hours hold.";
  if (state.minimumWage <= 8) return "Cheap living helps, but weak wage offers can trap you.";
  return "Balanced option with employer choice doing most of the work.";
}

function getLayerClass(code, layerKey = activeMapLayer) {
  const layer = MAP_LAYERS[layerKey];
  const value = getMapLayerScore(code, layerKey);
  if (value >= layer.high) return "high";
  if (value >= layer.mid) return "mid";
  return "low";
}

function getMapLayerScore(code, layerKey = activeMapLayer) {
  return MAP_LAYERS[layerKey].value(code);
}

function getRecommendedStatesForStudentType(typeKey = activeStudentType) {
  const type = STUDENT_TYPES[typeKey];
  return Object.keys(stateData).filter((code) => type.match(code));
}

function getStudentTypeRecommendationText(typeKey = activeStudentType) {
  const type = STUDENT_TYPES[typeKey];
  return `${type.title} mode is active: map colors, ranking focus, and simulator assumptions now favor ${type.copy.toLowerCase()}`;
}

function getStudentTypeProfile(typeKey = activeStudentType) {
  return STUDENT_TYPES[typeKey] || STUDENT_TYPES.saver;
}

function getStudentTypeMapScore(code) {
  const state = stateData[code];
  const savings = averageFromRange(state.savingsRange);
  const rent = averageFromRange(state.rentRange);
  const tax = estimateStateIncomeTaxRate(code);
  const wage = averageFromRange(state.averageWage);
  if (activeStudentType === "saver") return savings / 10 + (tax === 0 ? 18 : 0) + Math.max(0, 18 - rent / 80);
  if (activeStudentType === "traveler") return calculateRealityScore(code, activeStudentType) + (["CA", "FL", "NY", "NV", "WA", "CO", "MA", "IL"].includes(code) ? 16 : 0);
  if (activeStudentType === "survivor") return 95 - rent / 22 - tax * 160 + (["Low", "Medium"].includes(state.costLevel) ? 18 : 0);
  return wage * 2.2 + (state.minimumWage >= 15 ? 18 : 0) + savings / 18;
}

function estimateStateIncomeTaxRate(code) {
  const tax = stateData[code].incomeTax.toLowerCase();
  if (tax.includes("no")) return 0;
  const rates = tax.match(/\d+(?:\.\d+)?/g)?.map(Number) || [3.5];
  return Math.max(0, rates.reduce((sum, rate) => sum + rate, 0) / rates.length / 100);
}

function estimateTotalTaxRate(code) {
  // Important approximation: combines state income tax with a light federal/FICA placeholder.
  // This is demo guidance, not payroll, treaty, or tax filing advice.
  return Math.min(0.28, 0.12 + estimateStateIncomeTaxRate(code));
}

function calculateTaxEstimate(code, grossIncome) {
  return Math.max(0, Number(grossIncome || 0) * estimateTotalTaxRate(code));
}

function calculateMonthlyIncome(hourlyWage, hoursPerWeek, secondJobWage = 0, secondJobHours = 0) {
  const weeklyIncome = hourlyWage * hoursPerWeek + secondJobWage * secondJobHours;
  return weeklyIncome * 52 / 12;
}

function calculateLivingCost(rent, food, transport, other) {
  return rent + food + transport + other;
}

function calculateSavings(input) {
  const grossMonthly = calculateMonthlyIncome(input.hourlyWage, input.hoursPerWeek, input.secondJobWage, input.secondJobHours);
  const taxDeduction = calculateTaxEstimate(input.stateCode, grossMonthly);
  const livingCost = calculateLivingCost(input.monthlyRent, input.foodSpend, input.transportSpend, input.otherSpend);
  const monthlySavings = grossMonthly - taxDeduction - livingCost;
  const workingMonths = input.workingWeeks / 4.33;
  const totalBeforeTravel = monthlySavings * workingMonths;
  const finalSavings = totalBeforeTravel - input.travelBudgetAfterWork;
  return { grossMonthly, taxDeduction, livingCost, monthlySavings, totalBeforeTravel, finalSavings };
}

function buildSavingsRange(input) {
  const worst = calculateSavings({
    ...input,
    hoursPerWeek: input.hoursPerWeek * 0.78,
    monthlyRent: input.monthlyRent * 1.12,
    foodSpend: input.foodSpend * 1.14,
    transportSpend: input.transportSpend * 1.12,
    otherSpend: input.otherSpend * 1.18,
    travelBudgetAfterWork: input.travelBudgetAfterWork * 1.12,
    secondJobHours: input.secondJobHours * 0.65,
  });
  const likely = calculateSavings(input);
  const best = calculateSavings({
    ...input,
    hoursPerWeek: input.hoursPerWeek * 1.14,
    monthlyRent: input.monthlyRent * 0.95,
    foodSpend: input.foodSpend * 0.9,
    transportSpend: input.transportSpend * 0.9,
    otherSpend: input.otherSpend * 0.86,
    travelBudgetAfterWork: input.travelBudgetAfterWork * 0.9,
    secondJobHours: input.secondJobHours * 1.15,
  });
  const rentBurden = input.monthlyRent / Math.max(likely.grossMonthly, 1);
  const travelShare = input.travelBudgetAfterWork / Math.max(likely.totalBeforeTravel, 1);
  const confidence = likely.finalSavings < 0 || rentBurden > 0.38 || travelShare > 0.42 || input.hoursPerWeek < 28
    ? "Low"
    : rentBurden > 0.28 || travelShare > 0.28 || input.hoursPerWeek > 52
      ? "Medium"
      : "High";
  return { worst: worst.finalSavings, likely: likely.finalSavings, best: best.finalSavings, confidence };
}

function calculateUncertaintyRange(input) {
  return buildSavingsRange(input);
}

function getHumanInsight(type, value, context = {}) {
  if (type === "stress") {
    if (value === "Burnout risk" || value === "Overworked" || value === "High") return "Your schedule is getting heavy.";
    if (value === "Heavy" || value === "Fragile") return "Pressure is accumulating.";
    if (value === "Tight") return "You are still in the game, but the margin is thin.";
    if (value === "Stable" || value === "Balanced") return "You are holding the line.";
    return "You have breathing room right now.";
  }
  if (type === "savings") {
    if (value >= 6000) return "At this pace, the summer can actually move your finances.";
    if (value >= 3000) return "At this pace, you can still travel and bring cash home.";
    if (value >= 1000) return "This works, but the trip needs discipline.";
    return "The plan is fragile. Rent, hours, or travel cost needs fixing.";
  }
  if (type === "travelFund") {
    if (value >= 100) return "Your after-WAT trip is becoming realistic.";
    if (value >= 70) return "The trip is close, but one expensive week can move it back.";
    if (value >= 35) return "Travel is still possible, but the fund needs protection.";
    return "The route is still a dream until the money catches up.";
  }
  if (type === "paycheck") {
    if (context.countdown === 0) return "Payday can reset the whole week if spending stays calm.";
    if (context.countdown <= 2) return "Hold the line. Payday is close.";
    return "This is the stretch where small spending leaks matter.";
  }
  if (type === "route") {
    if (context.overBudget) return "This route may hurt your wallet.";
    if (context.rushed) return "This route is rushed. Add more days or remove one city.";
    if (context.longJump) return "One long-distance jump is dragging the budget up.";
    return "This route reads like a reward, not a budget accident.";
  }
  if (type === "milestone") {
    if (context.currentWeek >= context.week) return "Unlocked. This part of the summer is now part of the story.";
    return "Not yet. Keep the money pace alive until this opens up.";
  }
  return "The system is reading your current summer pace.";
}

function calculateSummerOutcome() {
  const input = sanitizeSimulatorInput(getCalculatorInput());
  const savings = calculateSavings(input);
  const stress = calculateStressState(input, savings);
  return { input, savings, stress };
}

function calculateSimulatorOutcome(input = getCalculatorInput()) {
  const safeInput = sanitizeSimulatorInput(input);
  const savings = calculateSavings(safeInput);
  const stress = calculateStressState(safeInput, savings);
  return { input: safeInput, savings, stress };
}

function calculateSavingsTimeline(input, result) {
  const weekSavings = result.monthlySavings / 4.33;
  const finalWeek = Math.max(1, input.workingWeeks);
  const progress = calculateSummerProgress(liveSummerState);
  const temporalDrag = getTemporalStage(progress).pressure / 100;
  const fluctuation = input.hoursPerWeek > 50 ? 0.91 : input.monthlyRent / Math.max(result.grossMonthly, 1) > 0.34 ? 0.88 : 0.96;
  return [
    { label: "Week 1", value: weekSavings * (1 - temporalDrag * 0.08) },
    { label: "Week 4", value: weekSavings * Math.min(4, finalWeek) * fluctuation },
    { label: "Week 8", value: weekSavings * Math.min(8, finalWeek) * (fluctuation - temporalDrag * 0.05) },
    { label: `Week ${finalWeek}`, value: result.totalBeforeTravel * (1 - temporalDrag * 0.04), afterTravel: result.finalSavings },
  ];
}

function buildSavingsTimeline(input, result) {
  return calculateSavingsTimeline(input, result);
}

function getSavingsQuality(result) {
  if (result.finalSavings >= 4500 && result.monthlySavings >= 900) return "High upside: This setup can bring strong savings if hours stay consistent.";
  if (result.finalSavings >= 2500 && result.monthlySavings >= 550) return "Comfortable: You can save well if rent stays controlled.";
  if (result.finalSavings >= 700) return "Tight: One unexpected cost can hurt your savings.";
  return "Danger zone: Your rent/spending is eating most of your income.";
}

function getStressLevel(result) {
  const costPressure = result.livingCost / Math.max(result.grossMonthly, 1);
  if (result.finalSavings < 700 || costPressure > 0.68) return { label: "High", value: 88 };
  if (result.finalSavings < 2500 || costPressure > 0.52) return { label: "Tight", value: 62 };
  if (result.finalSavings > 4500) return { label: "Low", value: 24 };
  return { label: "Balanced", value: 42 };
}

function calculateStressState(input, result) {
  const base = getStressLevel(result);
  let value = base.value;
  const type = activeStudentType;
  const rentBurden = input.monthlyRent / Math.max(result.grossMonthly, 1);
  const travelShare = input.travelBudgetAfterWork / Math.max(result.totalBeforeTravel, 1);

  if (input.hoursPerWeek > 50) value += type === "grinder" ? 18 : 12;
  if (input.hoursPerWeek > 62) value += 12;
  if (rentBurden > 0.35) value += 16;
  if (travelShare > 0.35) value += 12;
  if (result.finalSavings < 0) value += 20;
  const progress = calculateSummerProgress(liveSummerState);
  const temporal = getTemporalStage(progress);
  value += temporal.pressure * 0.25;
  const momentum = calculateMomentumState(liveSummerState.logs);
  if (momentum.label === "Slipping" || momentum.label === "Recovering") value += 10;
  if (momentum.label === "Accelerating") value -= 8;
  if (type === "survivor" && (rentBurden > 0.28 || result.finalSavings < 2500)) value += 12;
  if (type === "traveler" && travelShare > 0.32) value += 10;
  if (type === "saver" && result.finalSavings < 3000) value += 10;

  value = clamp(value, 8, 98);
  if (value >= 82) return { label: "Burnout risk", value };
  if (value >= 66) return { label: "Overworked", value };
  if (value >= 48) return { label: "Tight", value };
  if (value >= 28) return { label: "Stable", value };
  return { label: "Chilling", value };
}

function calculateSummerProgress(settings, date = new Date()) {
  const start = parseLocalDate(settings.startDate);
  const end = parseLocalDate(settings.endDate);
  const totalDays = Math.max(1, Math.round((end - start) / MS_PER_DAY) + 1);
  const elapsedDays = clamp(Math.round((date - start) / MS_PER_DAY) + 1, 1, totalDays);
  const completedDays = clamp(elapsedDays - 1, 0, totalDays);
  const percentComplete = clamp((completedDays / totalDays) * 100, 0, 100);
  const currentWeek = Math.max(1, Math.ceil(elapsedDays / 7));
  const totalWeeks = Math.max(1, Math.ceil(totalDays / 7));
  return { elapsedDays, completedDays, totalDays, percentComplete, currentWeek, totalWeeks };
}

function getLogTotals(logs = liveSummerState.logs) {
  return logs.reduce((totals, log) => {
    const hours = Number(log.hours || 0);
    const tips = Number(log.tips || 0);
    const spending = Number(log.spending || 0);
    const hourlyWage = Number(log.hourlyWage || elements.hourlyWage?.value || 0);
    totals.hours += hours;
    totals.tips += tips;
    totals.spending += spending;
    totals.earnings += hours * hourlyWage + tips;
    return totals;
  }, { hours: 0, tips: 0, spending: 0, earnings: 0 });
}

function buildWeeklySummary(logs = liveSummerState.logs) {
  const weekStart = addDaysISO(todayISO(), -6);
  const weekLogs = logs.filter((log) => log.date >= weekStart);
  const totals = getLogTotals(weekLogs);
  const saved = totals.earnings - totals.spending;
  const dominantMood = weekLogs.at(-1)?.mood || "Chilling";
  return { logs: weekLogs, hours: totals.hours, earnings: totals.earnings, spending: totals.spending, saved, dominantMood };
}

function calculateTravelAffordability(projectedSavings, travelBudget = Number(appState?.customRouteResult?.total || elements.travelBudgetAfterWork?.value || 0)) {
  const ratio = travelBudget / Math.max(projectedSavings + travelBudget, 1);
  const afterTravel = projectedSavings - travelBudget;
  if (afterTravel < 0) return { label: "Route is eating savings", progress: 100, afterTravel, warning: "This travel plan may hurt your wallet." };
  if (ratio > 0.45) return { label: "Travel pressure high", progress: 72, afterTravel, warning: "Travel spending may drag down final savings." };
  if (ratio > 0.25) return { label: "Travel fund building", progress: 54, afterTravel, warning: "Travel looks possible if spending stays controlled." };
  return { label: "Travel fund healthy", progress: 86, afterTravel, warning: "Your travel plan fits the current money pace." };
}

function calculateStressLevel(context) {
  let score = 26;
  const weeklyTarget = Math.max(1, Number(liveSummerState.weeklyWorkTarget || 40));
  const workRatio = context.weekly.hours / weeklyTarget;
  const targetGap = context.projectedSavings - Number(liveSummerState.savingsTarget || 0);
  const recentMood = liveSummerState.logs.at(-1)?.mood || "Chilling";

  if (workRatio > 1.25) score += 24;
  else if (workRatio > 1.05) score += 12;
  else if (workRatio < 0.65) score += 10;

  if (context.travel.afterTravel < 0) score += 26;
  else if (context.travel.progress > 70) score += 12;

  if (targetGap < -1200) score += 22;
  else if (targetGap < -400) score += 12;
  else if (targetGap > 600) score -= 10;

  score += MOOD_STRESS[recentMood] || 0;
  score = clamp(score, 8, 96);
  if (score >= 82) return { label: "Burnout risk", value: score, copy: "Your schedule is getting heavy. Cut one pressure point before it cuts you." };
  if (score >= 66) return { label: "Overworked", value: score, copy: "You are pushing hard. The money can work, but recovery needs a slot too." };
  if (score >= 48) return { label: "Tight", value: score, copy: "Your pace is workable, but one surprise cost can bite." };
  if (score >= 28) return { label: "Stable", value: score, copy: "You are holding the line. Keep logging so the projection stays honest." };
  return { label: "Chilling", value: score, copy: "You are ahead of pressure right now. Protect that cushion." };
}

function estimateNextPaycheck() {
  let payday = liveSummerState.nextPayday || addDaysISO(todayISO(), 5);
  const frequencyDays = liveSummerState.payFrequency === "weekly" ? 7 : liveSummerState.payFrequency === "monthly" ? 30 : 14;
  while (daysBetween(todayISO(), payday) < 0) {
    payday = addDaysISO(payday, frequencyDays);
  }
  if (payday !== liveSummerState.nextPayday) {
    liveSummerState.nextPayday = payday;
    if (elements.nextPayday) elements.nextPayday.value = payday;
    syncAppStateFromLive();
    saveStateToStorage();
  }
  const countdown = Math.max(0, daysBetween(todayISO(), payday));
  const frequencyWeeks = liveSummerState.payFrequency === "weekly" ? 1 : liveSummerState.payFrequency === "monthly" ? 4.33 : 2;
  const gross = Number(elements.hourlyWage.value || 0) * Number(liveSummerState.weeklyWorkTarget || 0) * frequencyWeeks;
  const postTax = gross * (1 - estimateTotalTaxRate(elements.calcState.value || activeState));
  return { countdown, gross, postTax, payday };
}

function estimatePaycheck() {
  return estimateNextPaycheck();
}

function buildSavingsProjection() {
  const progress = calculateSummerProgress(liveSummerState);
  const totals = getLogTotals();
  const calculator = calculateSummerOutcome();
  const weeklyNet = Number.isFinite(calculator.savings.monthlySavings) ? calculator.savings.monthlySavings / 4.33 : 0;
  const loggedNet = totals.earnings * (1 - estimateTotalTaxRate(elements.calcState.value || activeState)) - totals.spending;
  const remainingWeeks = Math.max(0, progress.totalWeeks - progress.currentWeek);
  const temporal = getTemporalStage(progress);
  const worldEvents = buildSimulationEvents({
    input: calculator.input,
    result: calculator.savings,
    progress,
    dashboard: { weekly: buildWeeklySummary() },
    rentBurden: calculator.input.monthlyRent / Math.max(calculator.savings.grossMonthly, 1),
    travelShare: calculator.input.travelBudgetAfterWork / Math.max(calculator.savings.totalBeforeTravel, 1),
    repeatedOverspending: liveSummerState.logs.slice(-5).filter((log) => Number(log.spending || 0) > Number(log.estimatedEarnings || 0) * 0.35 && Number(log.spending || 0) > 25).length,
    burnoutRisk: 0,
    routeFragility: 0,
  });
  const eventImpact = worldEvents.reduce((sum, event) => sum + Number(event.impact || 0), 0);
  const stageDrag = Math.max(0, temporal.pressure - 22) * 4;
  const projectedBeforeTravel = loggedNet + weeklyNet * remainingWeeks + eventImpact - stageDrag;
  const travelBudget = Number(appState?.customRouteResult?.total || elements.travelBudgetAfterWork.value || 0);
  const finalSavings = projectedBeforeTravel - travelBudget;
  const target = Number(liveSummerState.savingsTarget || 0);
  const timeline = [
    { label: "Week 1", value: loggedNet || weeklyNet },
    { label: "Week 4", value: loggedNet + weeklyNet * Math.max(0, Math.min(4, progress.totalWeeks) - progress.currentWeek) },
    { label: "Week 8", value: loggedNet + weeklyNet * Math.max(0, Math.min(8, progress.totalWeeks) - progress.currentWeek) },
    { label: "Final", value: projectedBeforeTravel, afterTravel: finalSavings },
  ];
  return { progress, totals, weeklyNet, loggedNet, projectedBeforeTravel, finalSavings, target, timeline };
}

function calculateDashboardMetrics() {
  const projection = buildSavingsProjection();
  const weekly = buildWeeklySummary();
  const travel = calculateTravelAffordability(projection.projectedBeforeTravel);
  const paycheck = estimatePaycheck();
  const stress = calculateStressLevel({ projection, weekly, travel, projectedSavings: projection.projectedBeforeTravel });
  return { projection, weekly, travel, paycheck, stress };
}

function getTemporalStage(progress) {
  const week = progress.currentWeek;
  if (week <= 1) return { label: "Arrival optimism", pressure: 8, tone: "excited", narrative: "Week 1 is optimistic, but the numbers are still unproven." };
  if (week <= 4) return { label: "Reality check", pressure: 18, tone: "watchful", narrative: "Rent and grocery costs start becoming visible now." };
  if (week <= 7) return { label: "Fatigue test", pressure: 30, tone: "strained", narrative: "This is where heavy hours begin showing up in the body." };
  if (week <= 9) return { label: "Travel temptation", pressure: 38, tone: "restless", narrative: "Travel plans start competing with savings discipline." };
  if (week <= 12) return { label: "Finish-line math", pressure: 44, tone: "focused", narrative: "The system is now judging whether the final route is earned or forced." };
  return { label: "Departure gravity", pressure: 50, tone: "final", narrative: "Every late decision now hits the final outcome quickly." };
}

function calculateMomentumState(logs = liveSummerState.logs) {
  if (!logs.length) return { label: "Unstarted", score: 0, copy: "The system is waiting for real behavior." };
  const recent = logs.slice(-5);
  const earlier = logs.slice(-10, -5);
  const recentNet = getLogTotals(recent).earnings - getLogTotals(recent).spending;
  const earlierNet = earlier.length ? getLogTotals(earlier).earnings - getLogTotals(earlier).spending : 0;
  const recentSpending = getLogTotals(recent).spending;
  const recentHours = getLogTotals(recent).hours;
  const score = recentNet - earlierNet * 0.5 - recentSpending * 0.18 + recentHours * 4;
  if (score > 900) return { label: "Accelerating", score, copy: "Habits are turning into freedom." };
  if (score > 180) return { label: "Stable", score, copy: "The summer is holding its shape." };
  if (score > -180) return { label: "Drifting", score, copy: "Nothing is broken yet, but the system wants cleaner logs." };
  if (score > -650) return { label: "Slipping", score, copy: "Spending or low hours are starting to bend the route." };
  return { label: "Recovering", score, copy: "The next few logs need to repair the pace." };
}

function calculateSimulationWorld({ input, result, progress, dashboard, routeCost = 0 }) {
  const rentBurden = input.monthlyRent / Math.max(result.grossMonthly, 1);
  const totalSpending = input.monthlyRent + input.foodSpend + input.transportSpend + input.otherSpend;
  const spendingBurden = totalSpending / Math.max(result.grossMonthly, 1);
  const travelSpend = routeCost || input.travelBudgetAfterWork;
  const travelShare = travelSpend / Math.max(result.totalBeforeTravel, 1);
  const weekly = dashboard.weekly;
  const targetHours = Math.max(1, Number(liveSummerState.weeklyWorkTarget || input.hoursPerWeek || 40));
  const workRatio = Math.max(input.hoursPerWeek, weekly.hours) / targetHours;
  const temporal = getTemporalStage(progress);
  const momentum = calculateMomentumState(liveSummerState.logs);
  const repeatedOverspending = liveSummerState.logs.slice(-5).filter((log) => Number(log.spending || 0) > Number(log.estimatedEarnings || 0) * 0.35 && Number(log.spending || 0) > 25).length;
  const housingPressure = clamp(rentBurden * 100, 0, 100);
  const schedulePressure = clamp((workRatio - 0.75) * 70 + (input.hoursPerWeek > 50 ? 20 : 0), 0, 100);
  const overspendingRisk = clamp(spendingBurden * 78 + repeatedOverspending * 10, 0, 100);
  const routeFragility = clamp(travelShare * 120 + (result.finalSavings < 0 ? 30 : 0), 0, 100);
  const burnoutRisk = clamp(schedulePressure * 0.52 + temporal.pressure * 0.7 + (repeatedOverspending > 1 ? 8 : 0) + (activeStudentType === "grinder" ? 8 : 0), 0, 100);
  const travelFreedom = clamp(100 - routeFragility - burnoutRisk * 0.18 + Math.max(0, result.finalSavings / 90), 0, 100);
  const survivalStability = clamp(100 - housingPressure * 0.35 - overspendingRisk * 0.28 - routeFragility * 0.22 - burnoutRisk * 0.15, 0, 100);
  const fatigueState = burnoutRisk > 78 ? "Burnout risk" : burnoutRisk > 62 ? "Overworked" : burnoutRisk > 44 ? "Heavy" : burnoutRisk > 26 ? "Tired" : "Fresh";
  const confidenceLevel = survivalStability > 72 && travelFreedom > 55 ? "High" : survivalStability > 46 ? "Medium" : "Low";
  const optimismLevel = clamp(survivalStability * 0.5 + travelFreedom * 0.35 + (momentum.label === "Accelerating" ? 15 : momentum.label === "Slipping" ? -12 : 0), 0, 100);
  const emotionalTone = optimismLevel > 72 ? "hopeful" : optimismLevel > 50 ? "steady" : optimismLevel > 32 ? "tense" : "fragile";
  const events = buildSimulationEvents({ input, result, progress, dashboard, rentBurden, travelShare, repeatedOverspending, burnoutRisk, routeFragility });
  const explainability = buildExplainability({ input, result, progress, dashboard, temporal, momentum, events, housingPressure, schedulePressure, overspendingRisk, routeFragility, burnoutRisk, travelFreedom, survivalStability });
  const simulationNarrative = buildSimulationNarrative({ temporal, momentum, emotionalTone, fatigueState, events, result });

  return {
    financialState: result.finalSavings >= 6000 ? "Expanding" : result.finalSavings >= 3000 ? "Workable" : result.finalSavings >= 1000 ? "Thin" : result.finalSavings >= 0 ? "Fragile" : "Negative",
    emotionalState: emotionalTone,
    burnoutRisk,
    travelFreedom,
    survivalStability,
    confidenceLevel,
    housingPressure,
    schedulePressure,
    overspendingRisk,
    routeFragility,
    fatigueState,
    momentumState: momentum.label,
    momentumCopy: momentum.copy,
    optimismLevel,
    emotionalTone,
    milestoneProgress: temporal.label,
    savingsConfidence: confidenceLevel,
    temporalStage: temporal,
    events,
    explainability,
    simulationNarrative,
  };
}

function buildSimulationEvents({ input, result, progress, dashboard, rentBurden, travelShare, repeatedOverspending, burnoutRisk, routeFragility }) {
  const events = [];
  if (progress.currentWeek >= 4 && rentBurden > 0.32) events.push({ type: "housing", label: "Housing pressure", impact: -120, copy: "Rent is quietly killing the savings pace." });
  if (progress.currentWeek >= 7 && input.hoursPerWeek > 50) events.push({ type: "fatigue", label: "Burnout week", impact: -80, copy: "Heavy hours are making the trip less forgiving." });
  if (progress.currentWeek >= 9 && travelShare > 0.35) events.push({ type: "travel", label: "Flight surge", impact: -160, copy: "The route is getting expensive at exactly the wrong time." });
  if (dashboard.weekly.hours < Number(liveSummerState.weeklyWorkTarget || 40) * 0.65 && liveSummerState.logs.length) events.push({ type: "work", label: "Reduced shifts", impact: -140, copy: "Lower hours this week weaken the final projection." });
  if (repeatedOverspending >= 2) events.push({ type: "spending", label: "Expensive week", impact: -110, copy: "Repeated spending logs are dragging down momentum." });
  if (routeFragility > 75) events.push({ type: "route", label: "Route fragility", impact: -180, copy: "One city may need to be cut unless money improves." });
  if (burnoutRisk < 35 && result.finalSavings > 3500) events.push({ type: "upside", label: "Stable rhythm", impact: 120, copy: "The summer is starting to buy you options." });
  return events.slice(0, 3);
}

function buildSimulationNarrative({ temporal, momentum, emotionalTone, fatigueState, events, result }) {
  const eventCopy = events[0]?.copy || "No major shock is currently bending the plan.";
  if (result.finalSavings < 0) return `${temporal.narrative} ${eventCopy} The system mood is ${emotionalTone}, and the route needs repair.`;
  if (fatigueState === "Burnout risk" || fatigueState === "Overworked") return `${temporal.narrative} ${eventCopy} Momentum is ${momentum.label.toLowerCase()}, but fatigue is now part of the math.`;
  if (momentum.label === "Accelerating") return `${temporal.narrative} ${momentum.copy} ${eventCopy}`;
  return `${temporal.narrative} Momentum is ${momentum.label.toLowerCase()}. ${eventCopy}`;
}

function buildExplainability({ input, result, temporal, momentum, events, housingPressure, schedulePressure, overspendingRisk, routeFragility, burnoutRisk, travelFreedom, survivalStability }) {
  const reasons = [];
  if (input.hoursPerWeek > 50) reasons.push(`${Math.round(input.hoursPerWeek)}hr/week workload`);
  if (housingPressure > 35) reasons.push(`housing pressure ${Math.round(housingPressure)}/100`);
  if (overspendingRisk > 58) reasons.push(`spending pressure ${Math.round(overspendingRisk)}/100`);
  if (routeFragility > 58) reasons.push(`route fragility ${Math.round(routeFragility)}/100`);
  if (burnoutRisk > 55) reasons.push(`burnout pressure ${Math.round(burnoutRisk)}/100`);
  if (travelFreedom < 42) reasons.push(`travel freedom down to ${Math.round(travelFreedom)}/100`);
  if (survivalStability < 45) reasons.push(`survival stability ${Math.round(survivalStability)}/100`);
  if (result.finalSavings < 0) reasons.push("after-travel savings below zero");
  if (events.length) reasons.push(`${events[0].label.toLowerCase()} event active`);
  if (momentum.label !== "Unstarted") reasons.push(`momentum is ${momentum.label.toLowerCase()}`);
  reasons.push(temporal.label.toLowerCase());
  return [...new Set(reasons)].slice(0, 5);
}

function buildHumanInsights(input, result, routeCost = 0) {
  const insights = [];
  const rentBurden = input.monthlyRent / Math.max(result.grossMonthly, 1);
  const travelShare = (routeCost || input.travelBudgetAfterWork) / Math.max(result.totalBeforeTravel, 1);
  if (input.hoursPerWeek > 50) insights.push("Your schedule is getting heavy. If hours drop by 5/week, this route becomes fragile.");
  if (input.hoursPerWeek > 50) insights.push("You are making money, but the schedule is starting to damage the trip.");
  if (input.hoursPerWeek > 62) insights.push("Burnout risk is real here. The money may work, but recovery needs a slot.");
  if (rentBurden > 0.35) insights.push("Rent is the biggest threat in this setup.");
  if (rentBurden > 0.35) insights.push("Housing pressure is quietly killing your savings.");
  if (travelShare > 0.35) insights.push("Travel budget is eating more than 35% of projected savings.");
  if (travelShare > 0.35) insights.push("This route only works if overtime remains stable.");
  if (result.finalSavings < 0) insights.push("After-travel savings are negative. The route outgrew the money.");
  if (!insights.length) insights.push("The plan is workable as long as hours and rent stay close to this setup.");
  return insights;
}

function buildStickyStatus(projection = buildSavingsProjection(), stress = calculateDashboardMetrics().stress) {
  const stateName = stateData[elements.calcState?.value || activeState]?.name || stateData[activeState].name;
  const risk = projection.finalSavings < 0 || derivedState.routeFragility > 72 ? " · Fragile" : "";
  return `Day ${projection.progress.elapsedDays}/${projection.progress.totalDays} · ${moneyWhole(projection.projectedBeforeTravel)} projected · ${stress.label}${risk} · ${stateName}`;
}

function recalculateDerivedState() {
  const simulatorOutcome = calculateSimulatorOutcome(appState.simulatorInputs);
  const uncertaintyRange = calculateUncertaintyRange(simulatorOutcome.input);
  const summerProgress = calculateSummerProgress(liveSummerState);
  const dashboardMetrics = calculateDashboardMetrics();
  const routePlan = appState.routePlannerResult || {};
  const optimizedRoute = appState.customRouteResult || {};
  const simulationWorld = calculateSimulationWorld({
    input: simulatorOutcome.input,
    result: simulatorOutcome.savings,
    progress: summerProgress,
    dashboard: dashboardMetrics,
    routeCost: optimizedRoute.total || routePlan.total || simulatorOutcome.input.travelBudgetAfterWork,
  });
  const humanInsights = buildHumanInsights(simulatorOutcome.input, simulatorOutcome.savings, optimizedRoute.total);
  const finalOutcome = buildFinalOutcomeSummary();
  derivedState = {
    selectedStateData: stateData[appState.selectedState],
    simulatorOutcome,
    uncertaintyRange,
    stressState: simulatorOutcome.stress,
    summerProgress,
    dashboardMetrics,
    routePlan,
    optimizedRoute,
    localRecommendations: buildLocalRecommendations(appState.selectedState),
    humanInsights,
    financialState: simulationWorld.financialState,
    emotionalState: simulationWorld.emotionalState,
    burnoutRisk: simulationWorld.burnoutRisk,
    travelFreedom: simulationWorld.travelFreedom,
    survivalStability: simulationWorld.survivalStability,
    confidenceLevel: simulationWorld.confidenceLevel,
    housingPressure: simulationWorld.housingPressure,
    schedulePressure: simulationWorld.schedulePressure,
    overspendingRisk: simulationWorld.overspendingRisk,
    routeFragility: simulationWorld.routeFragility,
    fatigueState: simulationWorld.fatigueState,
    momentumState: simulationWorld.momentumState,
    optimismLevel: simulationWorld.optimismLevel,
    emotionalTone: simulationWorld.emotionalTone,
    milestoneProgress: simulationWorld.milestoneProgress,
    savingsConfidence: simulationWorld.savingsConfidence,
    simulationNarrative: simulationWorld.simulationNarrative,
    simulationEvents: simulationWorld.events,
    explainability: simulationWorld.explainability,
    simulationWorld,
    finalOutcome,
    stickyStatus: buildStickyStatus(dashboardMetrics.projection, dashboardMetrics.stress),
  };
  return derivedState;
}

function logDailyEntry(entry) {
  const hours = sanitizeNumber(entry.hours, 0, 0, 24);
  const tips = sanitizeNumber(entry.tips, 0, 0, 5000);
  const spending = sanitizeNumber(entry.spending, 0, 0, 10000);
  const city = String(entry.city || "").trim();
  const bestMoment = String(entry.bestMoment || "").trim();
  const note = String(entry.note || "").trim();
  if (!hours && !tips && !spending && !city && !bestMoment && !note) {
    elements.logHours?.focus();
    return;
  }
  const hourlyWage = Number(elements.hourlyWage.value || appState.simulatorInputs.hourlyWage || 0);
  const estimatedEarnings = hours * hourlyWage + tips;
  const normalized = {
    id: globalThis.crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}`,
    date: todayISO(),
    timestamp: new Date().toISOString(),
    hours,
    tips,
    spending,
    mood: entry.mood || "Chilling",
    city,
    bestMoment,
    note,
    hourlyWage,
    estimatedEarnings,
    net: estimatedEarnings - spending,
  };
  liveSummerState.logs = [...liveSummerState.logs.filter((log) => log.id !== normalized.id), normalized].slice(-120);
  syncAppStateFromLive();
  updateApp({ persist: true, skipForms: true });
}

function deleteDailyLog(id) {
  liveSummerState.logs = liveSummerState.logs.filter((log) => log.id !== id);
  syncAppStateFromLive();
  updateApp({ persist: true, skipForms: true });
}

function clearDailyLogs() {
  if (!window.confirm("Clear all daily logs saved in this browser?")) return;
  liveSummerState.logs = [];
  syncAppStateFromLive();
  updateApp({ persist: true, skipForms: true });
}

function generateScenario(scenarioKey, code) {
  const state = stateData[code];
  const scenario = SCENARIOS[scenarioKey];
  const baseRent = averageFromRange(state.rentRange);
  return {
    state: code,
    stateCode: code,
    hourlyWage: Math.max(state.minimumWage, averageFromRange(state.averageWage) - 2),
    hoursPerWeek: scenario.hours,
    workingWeeks: 13,
    monthlyRent: Math.round((baseRent * scenario.rentFactor) / 25) * 25,
    foodSpend: Math.round((360 * scenario.spendFactor) / 25) * 25,
    transportSpend: Math.round((170 * scenario.spendFactor) / 25) * 25,
    otherSpend: Math.round((240 * scenario.spendFactor) / 25) * 25,
    travelBudgetAfterWork: scenario.travelBudget,
    secondJobEnabled: scenario.secondJob,
    secondJobWage: scenario.secondJob ? Math.max(state.minimumWage, averageFromRange(state.averageWage) - 4) : 0,
    secondJobHours: scenario.secondJob ? scenario.secondJobHours : 0,
    scenarioMode: scenarioKey,
  };
}

function rankStates(category) {
  const ranking = RANKINGS[category];
  return Object.keys(stateData)
    .sort((a, b) => ranking.metric(b) - ranking.metric(a) || stateData[a].name.localeCompare(stateData[b].name))
    .slice(0, 8);
}

const INTEREST_ROUTE_STOPS = {
  "big cities": ["New York City", "Los Angeles", "Chicago", "Boston", "Washington, DC"],
  nature: ["Grand Canyon", "Yellowstone", "Yosemite", "Denver", "Seattle"],
  "theme parks": ["Orlando", "Los Angeles", "San Diego"],
  beaches: ["Miami", "San Diego", "Honolulu", "Charleston"],
  shopping: ["New York City", "Los Angeles", "Las Vegas", "Chicago"],
  food: ["New York City", "Chicago", "New Orleans", "San Francisco"],
  museums: ["Washington, DC", "New York City", "Boston", "Chicago"],
  nightlife: ["New York City", "Miami", "Las Vegas", "New Orleans"],
};

function estimateTravelCost({ days, budget, style, currentState, startCity, interests }) {
  const multipliers = { budget: 0.82, balanced: 1, comfortable: 1.32 };
  const multiplier = multipliers[style] || 1;
  const region = REGION_BY_STATE[currentState] || "Northeast";
  const routePool = TRAVEL_ROUTE_SETS[region];
  const stopCount = Math.min(4, Math.max(2, Math.ceil(days / 3)));
  const interestStops = dedupeByName((interests || []).flatMap((interest) => INTEREST_ROUTE_STOPS[interest] || []));
  const pool = dedupeByName([...interestStops, ...routePool]);
  const start = startCity || routePool[0];
  const route = dedupeByName([start, ...pool.filter((city) => city !== start)]).slice(0, stopCount);
  const routeLocations = route.map(normalizePlace);
  const legDistance = routeLocations.slice(1).reduce((sum, stop, index) => sum + distanceBetween(routeLocations[index], stop), 0);
  const transport = (110 + route.length * 64 + days * 8 + legDistance * 3.1) * multiplier;
  const accommodation = days * 46 * multiplier;
  const food = days * 31 * multiplier;
  const total = transport + accommodation + food;
  const warning = total > budget
    ? "Budget warning: this trip is likely over budget. Reduce stops, switch to hostels, or add savings."
    : "Budget looks workable for a short, careful trip.";
  const stops = route.map((city, index) => ({
    city,
    note: getStopExplanation(city, interests, index),
  }));
  return { route, transport, accommodation, food, total, warning, stops };
}

function buildRoutePlan(input) {
  const result = estimateTravelCost(input);
  const world = derivedState.simulationWorld;
  if (!world) return result;
  const shouldShrink = world.routeFragility > 66 || world.burnoutRisk > 72 || world.travelFreedom < 34;
  if (!shouldShrink || result.route.length <= 2) return result;
  const route = result.route.slice(0, Math.max(2, result.route.length - 1));
  const reduction = 0.78;
  return {
    ...result,
    route,
    transport: result.transport * reduction,
    accommodation: result.accommodation * reduction,
    food: result.food * reduction,
    total: result.total * reduction,
    warning: `${result.warning} Simulation trimmed one stop because stress or budget pressure is high.`,
    stops: route.map((city, index) => ({ city, note: getStopExplanation(city, input.interests || [], index) })),
  };
}

function dedupeByName(items) {
  return [...new Set(items.filter(Boolean))];
}

function getStopExplanation(city, interests, index) {
  const interestText = interests.length ? interests.slice(0, 2).join(" and ") : "classic sightseeing";
  if (index === 0) return `${city} is a practical starting point with easy first-night planning.`;
  return `${city} fits ${interestText} and keeps the route compact enough for student travel.`;
}

function splitPlaces(text) {
  return String(text || "")
    .split(/[\n,;]+/)
    .map((place) => place.trim())
    .filter(Boolean);
}

function normalizePlace(place) {
  const key = place.toLowerCase().replace(/\./g, "").replace(/\s+/g, " ").trim();
  return CITY_GRAPH[key] || { name: place, region: "Custom", x: 50, y: 50, airport: "nearest major airport" };
}

function distanceBetween(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function dedupeStops(stops) {
  const seen = new Set();
  return stops.filter((stop) => {
    const key = stop.name.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function optimizeStopOrder(start, stops, end) {
  const remaining = [...stops].sort((a, b) => a.region.localeCompare(b.region));
  const route = [start];
  let current = start;
  while (remaining.length) {
    remaining.sort((a, b) => distanceBetween(current, a) - distanceBetween(current, b));
    current = remaining.shift();
    route.push(current);
  }
  if (end.name && end.name.toLowerCase() !== route.at(-1).name.toLowerCase()) route.push(end);
  return dedupeStops(route);
}

function estimateLegCost(from, to, preference) {
  const distance = distanceBetween(from, to);
  const longLeg = distance > 34 || from.region !== to.region;
  const mode = preference === "fastest" ? (longLeg ? "flight" : "train") : preference === "cheapest" ? (longLeg ? "flight" : "bus") : preference;
  const multipliers = { bus: 4.2, train: 5.4, flight: 8.8 };
  const base = mode === "flight" ? 130 : 28;
  return { mode, cost: base + distance * (multipliers[mode] || 5.2), longLeg };
}

function estimateOptimizedRoute(input) {
  const styleMultipliers = { budget: 0.82, balanced: 1, comfortable: 1.32 };
  const start = normalizePlace(input.start);
  const end = normalizePlace(input.end || `${start.airport} airport`);
  const preferred = splitPlaces(input.preferred).map(normalizePlace);
  const must = splitPlaces(input.must).map(normalizePlace);
  const optional = splitPlaces(input.optional).map(normalizePlace);
  let candidateStops = dedupeStops([...must, ...preferred, ...optional]);
  let route = optimizeStopOrder(start, candidateStops, end);
  let cost = estimateRouteCost(route, input.days, input.style, input.transport);

  while ((cost.total > input.budget || route.length - 1 > input.days) && optional.length && route.length > 3) {
    const optionalNames = new Set(optional.map((stop) => stop.name));
    const stopToRemove = [...candidateStops].reverse().find((stop) => optionalNames.has(stop.name));
    if (!stopToRemove) break;
    candidateStops = candidateStops.filter((stop) => stop.name !== stopToRemove.name);
    route = optimizeStopOrder(start, candidateStops, end);
    cost = estimateRouteCost(route, input.days, input.style, input.transport);
  }

  const stopNights = allocateStopDays(route, input.days);
  const warnings = buildOptimizerWarnings(route, cost, input);
  const cheaperRoute = buildAlternativeRoute(start, must, preferred, optional, end, input, "cheapest");
  const fasterRoute = buildAlternativeRoute(start, must, preferred, optional, end, input, "fastest");
  return { route, cost, warnings, stopNights, cheaperRoute, fasterRoute, nearestAirport: route.at(-1).airport };
}

function buildRoute(input) {
  return estimateOptimizedRoute(input);
}

function buildOptimizedRoute(input) {
  return estimateOptimizedRoute(input);
}

function buildCheaperRoute(input) {
  return estimateOptimizedRoute(input).cheaperRoute;
}

function buildFasterRoute(input) {
  return estimateOptimizedRoute(input).fasterRoute;
}

function estimateRouteCost(route, days, style, transportPreference) {
  const styleMultipliers = { budget: 0.82, balanced: 1, comfortable: 1.32 };
  const styleMultiplier = styleMultipliers[style] || 1;
  const legs = route.slice(1).map((stop, index) => estimateLegCost(route[index], stop, transportPreference));
  const transport = legs.reduce((sum, leg) => sum + leg.cost, 0) * styleMultiplier;
  const accommodation = days * 48 * styleMultiplier;
  const food = days * 32 * styleMultiplier;
  return { transport, accommodation, food, total: transport + accommodation + food, legs };
}

function allocateStopDays(route, days) {
  const visitStops = Math.max(1, route.filter((stop, index) => index > 0 && !stop.name.toLowerCase().includes("airport")).length);
  const base = Math.floor(days / visitStops);
  let extra = days % visitStops;
  return route.map((stop, index) => ({
    name: stop.name,
    days: index === 0 || stop.name.toLowerCase().includes("airport") ? 0 : base + (extra-- > 0 ? 1 : 0),
    airport: stop.airport,
  }));
}

function buildOptimizerWarnings(route, cost, input) {
  const warnings = [];
  if (cost.total > input.budget) warnings.push("This route may hurt your wallet. Cut optional stops, switch to cheapest transport, or reduce long-distance jumps.");
  if (route.length - 1 > input.days / 2) warnings.push("This route is rushed. Add more days or remove one city.");
  if (cost.legs.some((leg) => leg.longLeg)) warnings.push("Long-distance warning: one stop adds flight-level distance and may drag the budget up.");
  if (!warnings.length) warnings.push(`Route looks workable. Final departure can use ${route.at(-1).airport} if useful.`);
  return warnings;
}

function getRouteIntensity(route, days) {
  const stops = route.filter((stop) => !stop.name.toLowerCase().includes("airport")).length - 1;
  const pace = stops / Math.max(days, 1);
  if (pace <= 0.25) return "Chill";
  if (pace <= 0.42) return "Balanced";
  if (pace <= 0.62) return "Rushed";
  return "Chaotic";
}

function getRouteType(route, cost) {
  const hasLongFlight = cost.legs.some((leg) => leg.mode === "flight" && leg.longLeg);
  const names = route.map((stop) => stop.name.toLowerCase());
  const eastCoastCount = names.filter((name) => ["new jersey", "new york city", "boston", "washington, dc", "philadelphia", "niagara falls"].includes(name)).length;
  if (hasLongFlight) return "Flight-heavy route";
  if (eastCoastCount >= 3) return "East Coast sprint";
  if (names.some((name) => ["new york city", "boston", "chicago", "los angeles", "miami"].includes(name))) return "Big city run";
  if (cost.total < 1200) return "Budget loop";
  return "Low-backtracking route";
}

function getRouteStrategyMetrics(result, input) {
  const overBudgetAmount = Math.max(0, result.cost.total - input.budget);
  const longJumps = result.cost.legs.filter((leg) => leg.longLeg).length;
  const rushed = result.route.length - 1 > input.days / 2;
  const recoveryScore = Math.round(clamp(100 - (derivedState.burnoutRisk || 0) * 0.55 - longJumps * 12 - (rushed ? 18 : 0), 0, 100));
  const flexibilityScore = Math.round(clamp((input.budget - result.cost.total) / Math.max(input.budget, 1) * 100 + (derivedState.travelFreedom || 0) * 0.45, 0, 100));
  const travelStrainValue = clamp((result.cost.total / Math.max(input.budget, 1)) * 55 + longJumps * 14 + (rushed ? 20 : 0) + (derivedState.routeFragility || 0) * 0.25, 0, 100);
  const collapseProbability = Math.round(clamp(travelStrainValue * 0.62 + (derivedState.burnoutRisk || 0) * 0.18 + (overBudgetAmount > 0 ? 18 : 0), 3, 96));
  const freedomLevel = (derivedState.travelFreedom || 0) > 68 ? "Wide" : (derivedState.travelFreedom || 0) > 42 ? "Negotiable" : "Narrow";
  const travelStrain = travelStrainValue > 72 ? "High" : travelStrainValue > 46 ? "Medium" : "Low";
  const interpretation = travelStrain === "High"
    ? "Strategic read: ambitious route with low recovery margin."
    : freedomLevel === "Wide"
      ? "Strategic read: savings can support a bigger story if spending stays controlled."
      : "Strategic read: balanced route, but optional cities should remain negotiable.";
  return { recoveryScore, flexibilityScore, collapseProbability, freedomLevel, travelStrain, interpretation };
}

function buildAlternativeRoute(start, must, preferred, optional, end, input, transportPreference) {
  const pool = transportPreference === "cheapest"
    ? dedupeStops([...must, ...preferred, ...optional]).sort((a, b) => distanceBetween(start, a) - distanceBetween(start, b))
    : dedupeStops([...must, ...preferred]);
  const compactStops = pool.slice(0, Math.max(2, Math.min(4, input.days - 1)));
  const route = optimizeStopOrder(start, compactStops, end);
  const cost = estimateRouteCost(route, input.days, input.style, transportPreference);
  return { route, cost };
}

function getCalculatorInput() {
  return {
    state: elements.calcState.value,
    stateCode: elements.calcState.value,
    hourlyWage: Number(elements.hourlyWage.value || 0),
    hoursPerWeek: Number(elements.hoursPerWeek.value || 0),
    workingWeeks: Number(elements.workingWeeks.value || 1),
    monthlyRent: Number(elements.monthlyRent.value || 0),
    foodSpend: Number(elements.foodSpend.value || 0),
    transportSpend: Number(elements.transportSpend.value || 0),
    otherSpend: Number(elements.otherSpend.value || 0),
    travelBudgetAfterWork: Number(elements.travelBudgetAfterWork.value || 0),
    secondJobEnabled: elements.secondJobToggle.checked,
    secondJobWage: elements.secondJobToggle.checked ? Number(elements.secondJobWage.value || 0) : 0,
    secondJobHours: elements.secondJobToggle.checked ? Number(elements.secondJobHours.value || 0) : 0,
    scenarioMode: activeScenario,
  };
}

function sanitizeNumber(value, fallback = 0, min = 0, max = Infinity) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return clamp(number, min, max);
}

function sanitizeSimulatorInput(input) {
  const requestedState = input?.stateCode || input?.state;
  const safeState = stateData[requestedState] ? requestedState : activeState;
  const fallback = generateScenario(activeScenario || "normal", safeState);
  return {
    state: safeState,
    stateCode: safeState,
    hourlyWage: sanitizeNumber(input?.hourlyWage, fallback.hourlyWage, 0, 100),
    hoursPerWeek: sanitizeNumber(input?.hoursPerWeek, fallback.hoursPerWeek, 0, 112),
    workingWeeks: sanitizeNumber(input?.workingWeeks, fallback.workingWeeks, 1, 52),
    monthlyRent: sanitizeNumber(input?.monthlyRent, fallback.monthlyRent, 0, 10000),
    foodSpend: sanitizeNumber(input?.foodSpend, fallback.foodSpend, 0, 6000),
    transportSpend: sanitizeNumber(input?.transportSpend, fallback.transportSpend, 0, 6000),
    otherSpend: sanitizeNumber(input?.otherSpend, fallback.otherSpend, 0, 6000),
    travelBudgetAfterWork: sanitizeNumber(input?.travelBudgetAfterWork, fallback.travelBudgetAfterWork, 0, 30000),
    secondJobEnabled: Boolean(input?.secondJobEnabled || input?.secondJobHours || input?.secondJobWage),
    secondJobWage: sanitizeNumber(input?.secondJobWage, 0, 0, 100),
    secondJobHours: sanitizeNumber(input?.secondJobHours, 0, 0, 80),
    scenarioMode: input?.scenarioMode || activeScenario || "normal",
  };
}

function getSimulatorInputWarnings(input) {
  const warnings = [];
  if (input.hoursPerWeek > 80) warnings.push("Hours look extremely high. Projection capped to keep the demo sane.");
  if (input.workingWeeks > 32) warnings.push("Working weeks look long for a WAT season. Verify your actual program dates.");
  return warnings;
}

function applySimulatorInputs(input) {
  const safeInput = sanitizeSimulatorInput(input);
  elements.calcState.value = safeInput.stateCode;
  elements.hourlyWage.value = safeInput.hourlyWage.toFixed(2);
  elements.hoursPerWeek.value = safeInput.hoursPerWeek;
  elements.workingWeeks.value = safeInput.workingWeeks;
  elements.monthlyRent.value = safeInput.monthlyRent;
  elements.foodSpend.value = safeInput.foodSpend;
  elements.transportSpend.value = safeInput.transportSpend;
  elements.otherSpend.value = safeInput.otherSpend;
  elements.travelBudgetAfterWork.value = safeInput.travelBudgetAfterWork;
  elements.secondJobToggle.checked = Boolean(safeInput.secondJobHours || safeInput.secondJobWage);
  elements.secondJobWage.value = safeInput.secondJobWage.toFixed(2);
  elements.secondJobHours.value = safeInput.secondJobHours;
  updateSecondJobVisibility();
}

function getRoutePlannerInputFromForm() {
  return {
    currentState: elements.travelState.value || activeState,
    startCity: elements.startCity.value,
    days: sanitizeNumber(elements.travelDays.value, 1, 1, 60),
    budget: sanitizeNumber(elements.tripBudget.value, 0, 0, 50000),
    style: elements.travelStyle.value,
    interests: getSelectedInterests(),
  };
}

function applyRoutePlannerInputs(input) {
  elements.travelState.value = stateData[input.currentState] ? input.currentState : activeState;
  elements.startCity.value = input.startCity || "";
  elements.travelDays.value = sanitizeNumber(input.days, 7, 1, 60);
  elements.tripBudget.value = sanitizeNumber(input.budget, 1400, 0, 50000);
  elements.travelStyle.value = input.style || "balanced";
  const interests = new Set(input.interests || []);
  document.querySelectorAll(".interest-grid input").forEach((checkbox) => {
    checkbox.checked = interests.has(checkbox.value);
  });
}

function applyCustomRouteInputs(input) {
  elements.optimizerStart.value = input.start || "New Jersey";
  elements.optimizerEnd.value = input.end || "Newark Airport (EWR)";
  elements.optimizerDays.value = sanitizeNumber(input.days, 10, 1, 60);
  elements.optimizerBudget.value = sanitizeNumber(input.budget, 1500, 0, 50000);
  elements.optimizerStyle.value = input.style || "budget";
  elements.optimizerTransport.value = input.transport || "cheapest";
  elements.preferredDestinations.value = input.preferred || "";
  elements.mustVisitPlaces.value = input.must || "";
  elements.optionalPlaces.value = input.optional || "";
  renderDestinationChips();
}

function applyAppStateToForms() {
  elements.stateSelect.value = activeState;
  applySimulatorInputs(appState.simulatorInputs);
  applyRoutePlannerInputs(appState.routePlannerInputs);
  applyCustomRouteInputs(appState.customRouteInputs);
  syncLiveSettingsForm();
}

function setLoadingMessage(message) {
  elements.mapLoading.textContent = message;
  elements.mapLoading.classList.remove("hidden");
}

function showTip(event, code) {
  const state = stateData[code];
  const profile = buildRealityProfile(code, activeStudentType);
  const bounds = event.currentTarget.ownerSVGElement.getBoundingClientRect();
  elements.mapTip.textContent = "";
  const title = document.createElement("strong");
  const meta = document.createElement("span");
  title.textContent = state.name;
  meta.textContent = `${money(state.minimumWage)} minimum wage | ${profile.tier} · ${profile.score}/100`;
  elements.mapTip.append(title, document.createElement("br"), meta);
  elements.mapTip.classList.add("visible");
  elements.mapTip.style.left = `${event.clientX - bounds.left + 14}px`;
  elements.mapTip.style.top = `${event.clientY - bounds.top + 14}px`;
}

function hideTip() {
  elements.mapTip.classList.remove("visible");
}

function renderOptions(select) {
  select.replaceChildren(
    ...stateEntries.map(([code, state]) => {
      const option = document.createElement("option");
      option.value = code;
      option.textContent = `${state.name} (${code})`;
      return option;
    }),
  );
}

function renderLocationOptions(select) {
  select.replaceChildren(
    ...getLocationOptions().map((location) => {
      const option = document.createElement("option");
      option.value = location.name;
      option.textContent = `${location.name} · ${location.airport}`;
      return option;
    }),
  );
}

function addLocationToList(target) {
  const fieldByTarget = {
    preferred: elements.preferredDestinations,
    must: elements.mustVisitPlaces,
    optional: elements.optionalPlaces,
  };
  const pickerByTarget = {
    preferred: elements.preferredPicker,
    must: elements.mustPicker,
    optional: elements.optionalPicker,
  };
  const field = fieldByTarget[target];
  const location = pickerByTarget[target].value;
  const existing = splitPlaces(field.value);
  if (!location || existing.includes(location)) return;
  field.value = [...existing, location].join(", ");
  renderDestinationChips();
  updateRouteOptimizer();
}

function removeLocationFromList(target, location) {
  const fieldByTarget = {
    preferred: elements.preferredDestinations,
    must: elements.mustVisitPlaces,
    optional: elements.optionalPlaces,
  };
  const field = fieldByTarget[target];
  field.value = splitPlaces(field.value).filter((place) => place !== location).join(", ");
  renderDestinationChips();
  updateRouteOptimizer();
}

function renderDestinationChips() {
  const configs = [
    ["preferred", elements.preferredDestinations, elements.preferredChips],
    ["must", elements.mustVisitPlaces, elements.mustChips],
    ["optional", elements.optionalPlaces, elements.optionalChips],
  ];
  configs.forEach(([target, field, container]) => {
    const places = splitPlaces(field.value);
    if (!places.length) {
      const empty = document.createElement("span");
      empty.className = "empty-chip";
      empty.textContent = "No places selected yet";
      container.replaceChildren(empty);
      return;
    }
    container.replaceChildren(
      ...places.map((place) => {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = `${place} ×`;
        button.title = `Remove ${place}`;
        button.addEventListener("click", () => removeLocationFromList(target, place));
        return button;
      }),
    );
  });
}

function renderScoreFactors(factors) {
  elements.scoreFactors.replaceChildren(
    ...factors.map((factor) => {
      const item = document.createElement("li");
      item.textContent = factor;
      return item;
    }),
  );
}

function renderRealityDecision(profile) {
  if (!elements.realityDecisionCard) return;
  const block = document.createElement("div");
  block.className = "reality-decision-grid";
  const groups = [
    ["Reality check", profile.realityCheck],
    ["Best for", profile.bestFor.join(", ")],
    ["Dangerous for", profile.dangerousFor.join(", ")],
    ["Biggest risk", profile.biggestRisk],
    ["First thing to verify", profile.verifyFirst],
  ];
  block.replaceChildren(
    ...groups.map(([label, value]) => {
      const item = document.createElement("article");
      item.innerHTML = `<span></span><strong></strong>`;
      item.querySelector("span").textContent = label;
      item.querySelector("strong").textContent = value;
      return item;
    }),
  );

  const checklist = document.createElement("details");
  checklist.className = "verify-checklist";
  checklist.open = true;
  const summary = document.createElement("summary");
  summary.textContent = "Verify before accepting";
  const list = document.createElement("ul");
  list.replaceChildren(
    ...profile.verifyChecklist.map((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      return li;
    }),
  );
  checklist.append(summary, list);
  elements.realityDecisionCard.replaceChildren(block, checklist);
}

function renderSourceBasis(state, profile) {
  if (!elements.sourceBasis) return;
  const confidence = document.createElement("p");
  confidence.className = "confidence-line";
  confidence.innerHTML = `<strong></strong><span></span>`;
  confidence.querySelector("strong").textContent = `Confidence: ${profile.confidence.level}`;
  confidence.querySelector("span").textContent = profile.confidence.reason;

  const sourceList = document.createElement("ul");
  const items = [
    `Minimum wage: ${state.publicData.sourceNotes.minimumWage}`,
    `Tax: ${state.publicData.sourceNotes.incomeTax}`,
    `WAT wage estimate: ${profile.sourceBasis.wageEstimate}`,
    `Rent: ${profile.sourceBasis.rentRange}`,
    `Reality tier: ${profile.sourceBasis.score}`,
  ];
  sourceList.replaceChildren(...items.map((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    return li;
  }));

  const future = document.createElement("p");
  future.className = "future-data-note";
  future.textContent = profile.futureUserData;

  elements.sourceBasis.replaceChildren(confidence, sourceList, future);
}

function renderRealityFactors(profile) {
  const whyTitle = document.createElement("p");
  whyTitle.textContent = `Why this is ${profile.tier}:`;
  const whyList = document.createElement("ul");
  whyList.replaceChildren(
    ...profile.why.map((reason) => {
      const item = document.createElement("li");
      item.textContent = reason;
      return item;
    }),
  );
  const warning = document.createElement("p");
  warning.className = "state-warning";
  warning.textContent = profile.warning;
  elements.scoreFactors.replaceChildren(whyTitle, whyList, warning);
}

function buildLocalRecommendations(code) {
  const state = stateData[code];
  const rent = averageFromRange(state.rentRange);
  const savings = averageFromRange(state.savingsRange);
  const profile = buildRealityProfile(code, activeStudentType);
  const mainInsight = profile.biggestRisk;
  const mainInsightCopy = `${profile.realityCheck} ${profile.confidence.reason}`;
  const entries = [
    ["Money", averageFromRange(state.averageWage) < 21 ? "Low wage pressure means overtime or a second job matters more than normal." : `${state.savingsRange} likely monthly range if housing and hours behave.`],
    ["Housing", state.estimatedWatData.housingVolatility >= 60 ? "Employer housing is the first decision. Private rent can turn this state fragile fast." : LOCAL_RECOMMENDATION_TEMPLATES.housing[0]],
    ["Transport", state.estimatedWatData.travelAccess < 55 ? "Confirm shuttle, carpool, or bus access before accepting. A cheap room far from work is not cheap." : "Travel access is useful, but do not book weekend trips before hours stabilize."],
    ["Safety", LOCAL_RECOMMENDATION_TEMPLATES.safety[0]],
    ["Food", state.costLevel.includes("High") ? "Groceries and eating out need a weekly cap here. Resort pricing can quietly drain the margin." : LOCAL_RECOMMENDATION_TEMPLATES.cheapGroceries[0]],
    ["Work", averageFromRange(state.averageWage) < 21 ? "Screen for guaranteed hours, tips, overtime, and whether second-job scheduling is realistic." : LOCAL_RECOMMENDATION_TEMPLATES.jobTypes[0]],
  ];
  return { state, mainInsight, mainInsightCopy, entries };
}

function renderLocalRecommendations(code) {
  const { state, mainInsight, mainInsightCopy, entries } = buildLocalRecommendations(code);
  elements.localMainInsight.textContent = mainInsight;
  elements.localMainInsightCopy.textContent = mainInsightCopy;
  elements.localStateName.textContent = state.name;
  elements.localRecommendations.replaceChildren(
    ...entries.map(([title, body]) => {
      const card = document.createElement("article");
      card.className = "local-card";
      card.innerHTML = `<small>Demo guidance</small><strong>${title}</strong><span>${body}</span>`;
      return card;
    }),
  );
}

function updateActiveControls(code) {
  const recommended = new Set(getRecommendedStatesForStudentType());
  document.querySelectorAll(".state-shape").forEach((state) => {
    const isActive = state.dataset.state === code;
    state.classList.toggle("active", isActive);
    state.classList.toggle("dimmed", !isActive);
    state.classList.toggle("student-match", recommended.has(state.dataset.state));
    state.setAttribute("aria-pressed", String(isActive));
  });
  document.querySelectorAll(".compare-picker button").forEach((button) => {
    button.classList.toggle("active", selectedCompareStates.includes(button.dataset.state));
  });
  elements.stateSelect.value = code;
}

function selectState(code, options = {}) {
  if (!stateData[code]) return;
  activeState = code;
  appState.selectedState = code;
  appState.simulatorInputs = { ...appState.simulatorInputs, stateCode: code };
  appState.routePlannerInputs = { ...appState.routePlannerInputs, currentState: code };
  const state = stateData[code];
  const realityProfile = buildRealityProfile(code, activeStudentType);
  state.score = realityProfile.score;
  state.heuristicProfile = { ...state.heuristicProfile, ...realityProfile, realityTier: realityProfile.tier };
  document.querySelector(".state-panel")?.classList.remove("panel-pulse");
  requestAnimationFrame(() => document.querySelector(".state-panel")?.classList.add("panel-pulse"));
  elements.stateName.textContent = state.name;
  elements.statePersonality.textContent = getStatePersonality(code);
  const currentInput = appState.simulatorInputs || {};
  const estimatedGross = calculateMonthlyIncome(currentInput.hourlyWage || state.minimumWage, currentInput.hoursPerWeek || 38, currentInput.secondJobWage || 0, currentInput.secondJobHours || 0);
  const rentPressure = Number(currentInput.monthlyRent || averageFromRange(state.rentRange)) / Math.max(estimatedGross, 1);
  elements.stateVerdict.textContent = rentPressure > 0.35
    ? `${realityProfile.meaning} Housing pressure is high in your current setup.`
    : realityProfile.meaning;
  elements.survivalScore.textContent = realityProfile.tier;
  if (elements.realityMeaning) elements.realityMeaning.textContent = realityProfile.meaning;
  if (elements.realityScore) elements.realityScore.textContent = `Score: ${realityProfile.score}/100`;
  elements.scoreFill.style.width = `${realityProfile.score}%`;
  elements.minWage.textContent = money(state.minimumWage);
  elements.avgWage.textContent = state.averageWage;
  elements.incomeTax.textContent = state.incomeTax;
  elements.salesTax.textContent = state.salesTax;
  elements.costLevel.textContent = state.costLevel;
  elements.rentRange.textContent = state.rentRange;
  elements.savings.textContent = state.savingsRange;
  elements.quickWage.textContent = money(state.minimumWage);
  elements.quickTax.textContent = state.incomeTax.includes("No") ? "No income tax" : `${state.incomeTax} tax`;
  elements.quickScore.textContent = realityProfile.tier;
  renderRealityDecision(realityProfile);
  renderRealityFactors(realityProfile);
  renderSourceBasis(state, realityProfile);
  renderLocalRecommendations(code);
  updateActiveControls(code);
  if (elements.calcState.value !== code) elements.calcState.value = code;
  if (elements.travelState.value !== code) elements.travelState.value = code;
  if (!options.skipRecalculate) {
    updateCalculator();
    updateTravelPlanner();
  }
  if (options.persist !== false) saveStateToStorage();
}

function renderComparePicker() {
  elements.comparePicker.replaceChildren(
    ...stateEntries.map(([code, state]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.state = code;
      button.textContent = code;
      button.title = state.name;
      button.addEventListener("click", () => {
        selectState(code, { persist: false });
        toggleCompareState(code);
      });
      return button;
    }),
  );
}

function renderMapLayerTabs() {
  elements.mapLegendLabel.textContent = `Map layer: ${MAP_LAYERS[activeMapLayer].label}`;
  elements.mapLayerTabs.replaceChildren(
    ...Object.entries(MAP_LAYERS).map(([key, layer]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = layer.label;
      button.classList.toggle("active", key === activeMapLayer);
      button.setAttribute("aria-pressed", String(key === activeMapLayer));
      button.addEventListener("click", () => {
        activeMapLayer = key;
        activeRanking = layer.ranking;
        appState.activeMapLayer = activeMapLayer;
        appState.activeRankingMode = activeRanking;
        updateApp({ persist: true, skipForms: true, skipCalculator: true, skipTravel: true });
      });
      return button;
    }),
  );
}

function recolorMap() {
  document.querySelectorAll(".state-shape").forEach((shape) => {
    shape.classList.remove("high", "mid", "low");
    shape.classList.add(getLayerClass(shape.dataset.state));
  });
  updateActiveControls(activeState);
}

function renderStudentTypes() {
  elements.studentTypeAdvice.textContent = getStudentTypeRecommendationText();
  elements.studentTypeGrid.replaceChildren(
    ...Object.entries(STUDENT_TYPES).map(([key, type]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "student-type-card";
      button.classList.toggle("active", key === activeStudentType);
      button.setAttribute("aria-pressed", String(key === activeStudentType));
      button.innerHTML = `<strong>${type.title}</strong><span>${type.copy}</span>`;
      button.addEventListener("click", () => applyStudentType(key));
      return button;
    }),
  );
}

function applyStudentType(typeKey) {
  const type = getStudentTypeProfile(typeKey);
  activeStudentType = typeKey;
  activeRanking = type.ranking;
  activeMapLayer = "type";
  appState.selectedStudentType = typeKey;
  appState.activeRankingMode = activeRanking;
  appState.activeMapLayer = activeMapLayer;
  applyStudentTypeDefaults(typeKey);
  updateApp({ persist: true, skipForms: true });
}

function applyStudentTypeDefaults(typeKey) {
  const type = getStudentTypeProfile(typeKey);
  applyScenario(type.scenario, elements.calcState.value || activeState);
}

function toggleCompareState(code) {
  if (elements.comparisonNotice) {
    elements.comparisonNotice.textContent = "";
    elements.comparisonNotice.classList.remove("is-warning");
  }
  if (selectedCompareStates.includes(code)) {
    if (selectedCompareStates.length > 2) {
      selectedCompareStates = selectedCompareStates.filter((state) => state !== code);
    } else if (elements.comparisonNotice) {
      elements.comparisonNotice.textContent = "Comparison needs at least 2 states.";
      elements.comparisonNotice.classList.add("is-warning");
    }
  } else {
    if (selectedCompareStates.length >= 3) {
      if (elements.comparisonNotice) {
        elements.comparisonNotice.textContent = "You can compare up to 3 states. Remove one first.";
        elements.comparisonNotice.classList.add("is-warning");
      }
      return;
    }
    selectedCompareStates = [...selectedCompareStates, code];
  }
  appState.selectedComparisonStates = [...selectedCompareStates];
  updateApp({ persist: true, skipForms: true, skipCalculator: true, skipTravel: true });
}

function renderComparison() {
  if (selectedCompareStates.length < 2) {
    elements.comparisonBody.replaceChildren();
    if (elements.comparisonNotice) {
      elements.comparisonNotice.textContent = "Comparison needs at least 2 states.";
      elements.comparisonNotice.classList.add("is-warning");
    }
    return;
  }
  const bestSavings = selectedCompareStates.reduce((best, code) => (
    averageFromRange(stateData[code].savingsRange) > averageFromRange(stateData[best].savingsRange) ? code : best
  ), selectedCompareStates[0]);
  const bestScore = selectedCompareStates.reduce((best, code) => calculateRealityScore(code, activeStudentType) > calculateRealityScore(best, activeStudentType) ? code : best, selectedCompareStates[0]);
  const lowestRent = selectedCompareStates.reduce((best, code) => (
    averageFromRange(stateData[code].rentRange) < averageFromRange(stateData[best].rentRange) ? code : best
  ), selectedCompareStates[0]);
  const lowestTax = selectedCompareStates.reduce((best, code) => (
    estimateStateIncomeTaxRate(code) < estimateStateIncomeTaxRate(best) ? code : best
  ), selectedCompareStates[0]);

  if (elements.comparisonNotice && !elements.comparisonNotice.classList.contains("is-warning")) {
    elements.comparisonNotice.textContent = `Best monthly money-left: ${stateData[bestSavings].name}.`;
  }

  elements.comparisonBody.replaceChildren(
    ...selectedCompareStates.map((code) => {
      const state = stateData[code];
      const profile = buildRealityProfile(code, activeStudentType);
      const row = document.createElement("tr");
      row.className = code === bestSavings ? "best-savings" : "";
      row.innerHTML = `
        <td><strong>${state.name}</strong></td>
        <td>${state.averageWage}</td>
        <td class="${code === lowestTax ? "best-cell" : ""}">${state.incomeTax}</td>
        <td class="${code === lowestRent ? "best-cell" : ""}">${state.rentRange}</td>
        <td>${state.savingsRange}${code === bestSavings ? " · best" : ""}</td>
        <td class="${code === bestScore ? "best-cell" : ""}">${profile.tier} · ${profile.score}/100</td>
      `;
      return row;
    }),
  );
}

function renderRankingTabs() {
  elements.rankingTabs.replaceChildren(
    ...Object.entries(RANKINGS).map(([key, ranking]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = ranking.label;
      button.classList.toggle("active", key === activeRanking);
      button.setAttribute("aria-pressed", String(key === activeRanking));
      button.addEventListener("click", () => {
        activeRanking = key;
        appState.activeRankingMode = key;
        updateApp({ persist: true, skipForms: true, skipCalculator: true, skipTravel: true });
      });
      return button;
    }),
  );
}

function renderRankings() {
  const ranking = RANKINGS[activeRanking];
  const recommended = new Set(getRecommendedStatesForStudentType());
  elements.rankingGrid.replaceChildren(
    ...rankStates(activeRanking).map((code, index) => {
      const state = stateData[code];
      const profile = buildRealityProfile(code, activeStudentType);
      const value = ranking.display ? ranking.display(code) : activeRanking === "score" ? profile.tier : activeRanking === "type" ? Math.round(ranking.metric(code)) : moneyWhole(ranking.metric(code));
      const card = document.createElement("article");
      card.className = "ranking-card";
      card.classList.toggle("student-match", recommended.has(code));
      card.innerHTML = `
        <span>${String(index + 1).padStart(2, "0")}</span>
        <button type="button">${state.name}</button>
        <strong>${value}</strong>
        <span>${activeRanking === "score" ? `${profile.score}/100 · ${ranking.suffix}` : ranking.suffix}</span>
      `;
      card.querySelector("button").addEventListener("click", () => selectState(code));
      return card;
    }),
  );
}

function applyScenario(scenarioKey, code = elements.calcState.value || activeState) {
  activeScenario = scenarioKey;
  appState.activeScenario = scenarioKey;
  const scenario = generateScenario(scenarioKey, code);
  elements.calcState.value = code;
  elements.hourlyWage.value = scenario.hourlyWage.toFixed(2);
  elements.hoursPerWeek.value = scenario.hoursPerWeek;
  elements.workingWeeks.value = scenario.workingWeeks;
  elements.monthlyRent.value = scenario.monthlyRent;
  elements.foodSpend.value = scenario.foodSpend;
  elements.transportSpend.value = scenario.transportSpend;
  elements.otherSpend.value = scenario.otherSpend;
  elements.travelBudgetAfterWork.value = scenario.travelBudgetAfterWork;
  elements.secondJobToggle.checked = Boolean(scenario.secondJobHours);
  elements.secondJobWage.value = scenario.secondJobWage.toFixed(2);
  elements.secondJobHours.value = scenario.secondJobHours;
  appState.simulatorInputs = sanitizeSimulatorInput(scenario);
  renderScenarioButtons();
  updateSecondJobVisibility();
  updateCalculator();
}

function renderScenarioButtons() {
  elements.scenarioButtons.replaceChildren(
    ...Object.entries(SCENARIOS).map(([key, scenario]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = `${scenario.label} mode`;
      button.classList.toggle("active", key === activeScenario);
      button.setAttribute("aria-pressed", String(key === activeScenario));
      button.addEventListener("click", () => applyScenario(key));
      return button;
    }),
  );
}

function updateSecondJobVisibility() {
  elements.secondJobFields.classList.toggle("is-hidden", !elements.secondJobToggle.checked);
}

function updateCalculator() {
  const outcome = calculateSimulatorOutcome(getCalculatorInput());
  const input = outcome.input;
  const result = outcome.savings;
  const stress = outcome.stress;
  appState.simulatorInputs = input;
  appState.selectedState = input.stateCode;
  activeState = input.stateCode;
  recalculateDerivedState();
  const warnings = [];
  if (input.hoursPerWeek >= 112) warnings.push("Hours are capped at 112/week.");
  if (input.workingWeeks >= 52) warnings.push("Working weeks are capped at 52.");
  if (input.monthlyRent > result.grossMonthly) warnings.push("Rent is higher than gross monthly income. This plan is likely not workable.");
  warnings.push(...buildHumanInsights(input, result, Number(appState.customRouteResult?.total || 0)).filter((message) => !message.startsWith("The plan is workable")));
  if (elements.simulatorNotice) {
    elements.simulatorNotice.textContent = warnings.join(" ");
    elements.simulatorNotice.classList.toggle("is-warning", warnings.length > 0);
  }
  animateNumber(elements.finalSavings, result.finalSavings);
  elements.savingsVerdict.textContent = getHumanOutcomeVerdict(result.finalSavings);
  elements.decisionSummary.textContent = `What this means: ${getDecisionSummary(input, result)}`;
  elements.fixFirst.textContent = getFixFirstRecommendation(input, result);
  elements.stressLevel.textContent = stress.label;
  elements.stressFill.style.width = `${stress.value}%`;
  elements.stressWhy.textContent = getStressExplanation(input, result, stress);
  animateNumber(elements.grossMonthly, result.grossMonthly);
  animateNumber(elements.taxDeduction, result.taxDeduction);
  animateNumber(elements.livingCost, result.livingCost);
  animateNumber(elements.monthlySavings, result.monthlySavings);
  animateNumber(elements.totalBeforeTravel, result.totalBeforeTravel);
  animateNumber(elements.travelDeduction, Number(elements.travelBudgetAfterWork.value || 0));
  renderSavingsRange(input);
  renderSavingsTimeline(input, result);
  renderMoneyUseCards(result.finalSavings);
  selectState(input.stateCode, { persist: false, skipRecalculate: true });
  updateSummerDashboard();
  renderFinalOutcomeSummary();
  saveStateToStorage();
}

function getHumanOutcomeVerdict(finalSavings) {
  if (finalSavings < 0) return "This plan is underwater. Fix the route before trusting this setup.";
  if (finalSavings > 6000) return "Strong outcome. This summer can actually move your finances.";
  if (finalSavings >= 3000) return "Comfortable. You bring money home, but rent still matters.";
  if (finalSavings >= 1000) return "Tight but survivable. Watch spending and travel budget.";
  return "Danger zone. The trip may eat your savings.";
}

function getTopProjectionPressure(input, result) {
  const rentBurden = input.monthlyRent / Math.max(result.grossMonthly, 1);
  const livingSpend = input.foodSpend + input.transportSpend + input.otherSpend;
  const travelShare = input.travelBudgetAfterWork / Math.max(result.totalBeforeTravel, 1);
  const routeTotal = Number(appState.customRouteResult?.total || 0);
  const routePressure = routeTotal / Math.max(Number(appState.customRouteInputs?.budget || input.travelBudgetAfterWork || 1), 1);
  const pressures = [
    { key: "rent", value: rentBurden, label: "rent" },
    { key: "hours", value: input.hoursPerWeek < 35 ? (35 - input.hoursPerWeek) / 35 : 0, label: "low hours" },
    { key: "travel", value: travelShare, label: "travel budget" },
    { key: "spending", value: livingSpend / Math.max(result.grossMonthly, 1), label: "daily spending" },
    { key: "route", value: routePressure > 1 ? routePressure : 0, label: "route cost" },
  ];
  return pressures.sort((a, b) => b.value - a.value)[0];
}

function getFixFirstRecommendation(input, result) {
  if (result.finalSavings < 0) return "Fix first: cut travel budget or add hours before keeping this route.";
  const top = getTopProjectionPressure(input, result);
  if (top.key === "rent" && top.value > 0.32) return "Fix first: lower rent by about $150/month or find employer housing.";
  if (top.key === "hours" && top.value > 0) return "Fix first: add 5 work hours/week before expanding the route.";
  if (top.key === "route") return "Fix first: remove one long-distance city from the route.";
  if (top.key === "travel" && top.value > 0.34) return "Fix first: cut travel budget by $300 or switch to cheaper transport.";
  if (top.key === "spending" && top.value > 0.22) return "Fix first: tighten food, transport, and weekend spending.";
  return "Fix first: protect hours and keep rent close to this number.";
}

function getDecisionSummary(input, result) {
  const top = getTopProjectionPressure(input, result);
  if (result.finalSavings < 0) return `This plan is not safe yet. ${top.label.charAt(0).toUpperCase() + top.label.slice(1)} is doing the most damage.`;
  if (result.finalSavings < 1000) return `Possible, but not comfortable. ${top.label.charAt(0).toUpperCase() + top.label.slice(1)} is the first thing to control.`;
  if (result.finalSavings < 3000) return `Your plan can survive, but the margin is thin. Watch ${top.label} before adding more travel.`;
  return `This setup gives you breathing room. Keep ${top.label} from drifting and the route stays realistic.`;
}

function getPlainSavingsExplanation(input, result, range) {
  const top = getTopProjectionPressure(input, result);
  if (result.finalSavings < 0) return `Low confidence. ${top.label.charAt(0).toUpperCase() + top.label.slice(1)} is pulling the plan underwater.`;
  if (top.key === "rent") return `${range.confidence} confidence. Rent is doing most of the damage here.`;
  if (top.key === "travel" || top.key === "route") return `${range.confidence} confidence. The route survives only if travel stays disciplined.`;
  if (top.key === "hours") return `${range.confidence} confidence. The plan needs steadier hours before the route feels safe.`;
  if (top.key === "spending") return `${range.confidence} confidence. Small spending leaks are the main threat to the travel margin.`;
  return `${range.confidence} confidence. The plan works if hours, rent, and travel stay close to this setup.`;
}

function getStressReasons(input, result, stress) {
  const reasons = [];
  if (input.hoursPerWeek >= 50) reasons.push(`${Math.round(input.hoursPerWeek)} hours/week`);
  if (result.finalSavings < 0) reasons.push("negative after-travel buffer");
  if (input.monthlyRent / Math.max(result.grossMonthly, 1) > 0.32) reasons.push("rent pressure");
  if (input.travelBudgetAfterWork / Math.max(result.totalBeforeTravel, 1) > 0.35) reasons.push("travel budget is heavy");
  if (Number(appState.customRouteResult?.total || 0) > Number(appState.customRouteInputs?.budget || Infinity)) reasons.push("route is over budget");
  if (!reasons.length) reasons.push(stress.value > 55 ? "thin savings margin" : "pressure is currently manageable");
  return reasons.slice(0, 3);
}

function getStressExplanation(input, result, stress) {
  const reasons = getStressReasons(input, result, stress);
  const sentence = stress.value >= 76
    ? "You are making the money, but the schedule is starting to tax the person earning it."
    : stress.value >= 55
      ? "The plan still works, but one bad week can bend the route."
      : "Pressure is present, but the setup still has room to breathe.";
  return `Why: ${reasons.join(" · ")}. ${sentence}`;
}

function renderMoneyUseCards(finalSavings) {
  const ideas = finalSavings < 0
    ? [
      ["Emergency buffer", 900],
      ["Post-WAT travel", 1400],
    ]
    : [
      ["Emergency buffer", 900],
      ["Post-WAT travel", 1400],
      ["University support", 2600],
      ["Optional goals", 1600],
    ];
  elements.moneyUseCards.replaceChildren(
    ...(finalSavings < 0 ? [(() => {
      const notice = document.createElement("p");
      notice.className = "money-use-note";
      notice.textContent = "You do not have enough buffer yet.";
      return notice;
    })()] : []),
    ...ideas.map(([label, amount]) => {
      const card = document.createElement("article");
      card.className = finalSavings >= amount ? "money-use unlocked" : "money-use";
      card.innerHTML = `<strong>${label}</strong><span>${finalSavings >= amount ? "Unlocked" : `${moneyWhole(amount - finalSavings)} short`}</span>`;
      return card;
    }),
  );
}

function renderSavingsRange(input) {
  const range = calculateUncertaintyRange(input);
  animateNumber(elements.worstCaseSavings, range.worst);
  animateNumber(elements.likelyCaseSavings, range.likely);
  animateNumber(elements.bestCaseSavings, range.best);
  elements.savingsRangeInsight.textContent = getPlainSavingsExplanation(input, calculateSavings(input), range);
}

function renderSavingsTimeline(input, result) {
  const timeline = buildSavingsTimeline(input, result);
  const maxValue = Math.max(result.totalBeforeTravel, ...timeline.map((item) => item.value), 1);
  elements.timelineSummary.textContent = result.finalSavings < 0
    ? "Route collapses without a fix"
    : result.finalSavings < 1200
      ? "Route fragile"
      : "Route survives";
  elements.savingsTimeline.replaceChildren(
    ...timeline.map((item, index) => {
      const card = document.createElement("article");
      card.className = "timeline-card";
      const width = Math.max(6, Math.min(100, (Math.max(item.value, 0) / maxValue) * 100));
      const afterTravel = item.afterTravel === undefined ? "" : `<small>After travel: ${moneyWhole(item.afterTravel)}</small>`;
      const stageLabels = ["Unstable landing", "Pressure building", "Momentum check", result.finalSavings < 0 ? "Route collapses" : result.finalSavings < 1200 ? "Route fragile" : "Route survives"];
      card.innerHTML = `
        <span>${item.label}</span>
        <em>${stageLabels[index] || "Money check"}</em>
        <strong>${moneyWhole(item.value)}</strong>
        <div class="timeline-bar"><div style="width: ${width}%"></div></div>
        ${afterTravel}
      `;
      return card;
    }),
  );
}

function syncLiveSettingsForm() {
  if (!elements.summerSettingsForm) return;
  elements.watStartDate.value = liveSummerState.startDate;
  elements.watEndDate.value = liveSummerState.endDate;
  elements.weeklyWorkTarget.value = liveSummerState.weeklyWorkTarget;
  elements.savingsTarget.value = liveSummerState.savingsTarget;
  elements.payFrequency.value = liveSummerState.payFrequency;
  elements.nextPayday.value = liveSummerState.nextPayday;
}

function renderLiveSavingsTimeline(projection) {
  const maxValue = Math.max(projection.target, projection.projectedBeforeTravel, ...projection.timeline.map((item) => item.value), 1);
  elements.liveTimelineSummary.textContent = `Final projection: ${moneyWhole(projection.projectedBeforeTravel)} before travel`;
  elements.liveSavingsTimeline.replaceChildren(
    ...projection.timeline.map((item) => {
      const card = document.createElement("article");
      card.className = "timeline-card live-timeline-card";
      const width = Math.max(6, Math.min(100, (Math.max(item.value, 0) / maxValue) * 100));
      const afterTravel = item.afterTravel === undefined ? "" : `<small>After travel: ${moneyWhole(item.afterTravel)}</small>`;
      card.innerHTML = `
        <span>${item.label}</span>
        <strong>${moneyWhole(item.value)}</strong>
        <div class="timeline-bar"><div style="width: ${width}%"></div></div>
        ${afterTravel}
      `;
      return card;
    }),
  );
}

function buildWeeklyBehaviorWindows(progress) {
  const groups = new Map();
  liveSummerState.logs.forEach((log) => {
    const position = getSummerDatePosition(log.date, progress);
    const day = position.day;
    const week = position.week;
    const key = position.inWindow ? `week-${week}` : `${position.weekLabel}-${log.date}`;
    const group = groups.get(key) || [];
    group.push({ ...log, day, week, dateLabel: position.label, weekLabel: position.weekLabel, sortDay: position.sortDay });
    groups.set(key, group);
  });
  return [...groups.values()].map((logs) => {
    const week = logs.at(-1)?.week || 0;
    const totals = getLogTotals(logs);
    const net = totals.earnings - totals.spending;
    const moods = logs.map((log) => String(log.mood || "").toLowerCase());
    return {
      week,
      logs,
      hours: totals.hours,
      earnings: totals.earnings,
      spending: totals.spending,
      net,
      spendingRatio: totals.spending / Math.max(totals.earnings, 1),
      heavyMood: moods.some((mood) => ["tired", "homesick", "broke", "grinding"].includes(mood)),
      city: logs.find((log) => log.city)?.city,
      bestMoment: logs.find((log) => log.bestMoment)?.bestMoment,
      periodLabel: logs.at(-1)?.weekLabel || `Week ${week}`,
      sortDay: logs.at(-1)?.sortDay || week * 7,
    };
  }).sort((a, b) => a.sortDay - b.sortDay);
}

function milestoneCopy(options, seed) {
  return options[Math.abs(seed) % options.length];
}

function milestoneSeed(label, week) {
  return [...`${label}-${week}-${activeState}-${activeStudentType}`].reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function createMilestone({ week, category, priority, title, copy, reason, tone = "observed", periodLabel }) {
  return {
    id: `${category}-${week}-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    week,
    category,
    priority,
    title,
    copy,
    reason,
    tone,
    periodLabel,
  };
}

function buildDynamicMilestones(progress) {
  const world = derivedState.simulationWorld || {};
  const outcome = derivedState.simulatorOutcome?.savings || calculateSummerOutcome().savings;
  const input = derivedState.simulatorOutcome?.input || getCalculatorInput();
  const weeks = buildWeeklyBehaviorWindows(progress);
  const weeklyTarget = Math.max(1, Number(liveSummerState.weeklyWorkTarget || input.hoursPerWeek || 40));
  const milestones = [];

  const firstPaycheck = weeks.find((week) => week.earnings >= Math.max(280, input.hourlyWage * 24) || week.net >= 220);
  if (firstPaycheck) {
    milestones.push(createMilestone({
      week: firstPaycheck.week,
      category: "financial",
      priority: 72,
      title: milestoneCopy(["The first paycheck changed confidence.", "The summer finally started feeling real."], milestoneSeed("paycheck", firstPaycheck.week)),
      copy: `${moneyWhole(firstPaycheck.earnings)} came in during ${firstPaycheck.periodLabel}. The projection stopped being theory.`,
      reason: `${numberWhole(firstPaycheck.hours)}h logged · ${moneyWhole(firstPaycheck.net)} net after spending.`,
      tone: "hopeful",
      periodLabel: firstPaycheck.periodLabel,
    }));
  }

  weeks.forEach((week, index) => {
    const previous = weeks[index - 1];
    const previousTwo = weeks.slice(Math.max(0, index - 2), index);
    const stablePair = previous && previous.spendingRatio < 0.28 && week.spendingRatio < 0.28 && week.earnings > 0 && previous.earnings > 0;
    const heavyPair = previous && previous.hours > weeklyTarget * 1.15 && week.hours > weeklyTarget * 1.15;
    const spendingImproved = previous && previous.spendingRatio > 0.42 && week.spendingRatio < 0.32;
    const momentumReturned = previous && previous.net < 80 && week.net > 260;
    const overspendingStretch = week.spendingRatio > 0.45 || (previousTwo.length && previousTwo.every((item) => item.spendingRatio > 0.36));

    if (stablePair) {
      milestones.push(createMilestone({
        week: week.week,
        category: "discipline",
        priority: 66,
        title: milestoneCopy([
          "You stabilized spending after early pressure.",
          "The system finally trusts your pacing.",
          "You protected the travel fund long enough for the route to survive.",
        ], milestoneSeed("discipline", week.week)),
        copy: `${previous.periodLabel} to ${week.periodLabel} stayed under the spending danger line.`,
        reason: `Recent spending held near ${Math.round(((previous.spendingRatio + week.spendingRatio) / 2) * 100)}% of tracked earnings.`,
        tone: "disciplined",
        periodLabel: week.periodLabel,
      }));
    }

    if (heavyPair || (week.hours > weeklyTarget * 1.35 && week.heavyMood)) {
      milestones.push(createMilestone({
        week: week.week,
        category: "burnout",
        priority: 88,
        title: milestoneCopy([
          "The schedule started outrunning recovery.",
          "You kept the money alive, but the pace became dangerous.",
          "Work intensity is slowly replacing the summer itself.",
        ], milestoneSeed("burnout", week.week)),
        copy: `${week.periodLabel} crossed ${numberWhole(week.hours)} tracked hours while the system was already watching fatigue.`,
        reason: `${heavyPair ? `Two heavy weeks in a row.` : "Heavy hours paired with a hard mood log."} Recovery margin narrowed.`,
        tone: "burnout",
        periodLabel: week.periodLabel,
      }));
    }

    if (spendingImproved || momentumReturned) {
      milestones.push(createMilestone({
        week: week.week,
        category: "recovery",
        priority: 78,
        title: milestoneCopy([
          "You adapted before the route collapsed.",
          "The summer regained structure after unstable early weeks.",
          "You recovered momentum after drifting.",
        ], milestoneSeed("recovery", week.week)),
        copy: `After ${previous.periodLabel} looked unstable, ${week.periodLabel} repaired part of the money rhythm.`,
        reason: spendingImproved
          ? `Spending ratio improved from ${Math.round(previous.spendingRatio * 100)}% to ${Math.round(week.spendingRatio * 100)}%.`
          : `Net movement jumped from ${moneyWhole(previous.net)} to ${moneyWhole(week.net)}.`,
        tone: "recovering",
        periodLabel: week.periodLabel,
      }));
    }

    if (overspendingStretch) {
      milestones.push(createMilestone({
        week: week.week,
        category: "collapse",
        priority: 82,
        title: milestoneCopy([
          "Small spending leaks started becoming structural.",
          "Flexibility disappeared after repeated overspending.",
          "Those early leaks eventually weakened the route.",
        ], milestoneSeed("overspending", week.week)),
        copy: `${week.periodLabel} made spending visible as a route problem, not just a daily mistake.`,
        reason: `${Math.round(week.spendingRatio * 100)}% of tracked earnings went back out.`,
        tone: "fragile",
        periodLabel: week.periodLabel,
      }));
    }

    if (week.city || week.bestMoment) {
      milestones.push(createMilestone({
        week: week.week,
        category: "emotional",
        priority: 52,
        title: week.bestMoment || `${week.city} entered the summer story.`,
        copy: week.city ? `This was not just money tracking. ${week.city} became part of the archive.` : "A logged moment made the summer feel less like a spreadsheet.",
        reason: "Memory logged by the student, stored locally in this browser.",
        tone: "documentary",
        periodLabel: week.periodLabel,
      }));
    }
  });

  const rentBurden = input.monthlyRent / Math.max(outcome.grossMonthly, 1);
  if (progress.currentWeek >= 3 && rentBurden > 0.34) {
    milestones.push(createMilestone({
      week: Math.min(progress.currentWeek, 5),
      category: "housing",
      priority: 86,
      title: "Housing pressure became the main threat.",
      copy: "The system sees rent taking too much of the paycheck before travel even enters the story.",
      reason: `Rent is about ${Math.round(rentBurden * 100)}% of gross monthly income.`,
      tone: "tense",
    }));
  }

  if (world.routeFragility > 66 || (appState.customRouteResult?.total || 0) > Number(appState.customRouteInputs?.budget || 0)) {
    milestones.push(createMilestone({
      week: Math.max(1, progress.currentWeek),
      category: "travel",
      priority: 90,
      title: milestoneCopy([
        "Travel ambition started pressuring survival math.",
        "The route became emotionally exciting, financially fragile.",
        "You started chasing cities before stabilizing the foundation.",
      ], milestoneSeed("travel-pressure", progress.currentWeek)),
      copy: "The route is no longer just a reward. It is now competing with the return-home number.",
      reason: `Route fragility ${Math.round(world.routeFragility || 0)}/100 · travel freedom ${Math.round(world.travelFreedom || 0)}/100.`,
      tone: "fragile",
    }));
  }

  if (world.travelFreedom < 30 && appState.selectedOptionalPlaces?.length) {
    milestones.push(createMilestone({
      week: Math.max(1, progress.currentWeek),
      category: "route",
      priority: 92,
      title: "The original route stopped being sustainable.",
      copy: "Optional stops became the first thing the system stopped trusting.",
      reason: "Travel freedom dropped below the safe band while optional destinations were still in play.",
      tone: "collapse",
    }));
  }

  if (outcome.finalSavings < 1200 && world.routeFragility < 78 && progress.currentWeek >= 5) {
    milestones.push(createMilestone({
      week: progress.currentWeek,
      category: "survival",
      priority: 80,
      title: milestoneCopy([
        "You survived the stretch where most students lose control.",
        "The summer entered survival mode, but the route stayed alive.",
      ], milestoneSeed("survival", progress.currentWeek)),
      copy: "The margin is thin, but the plan has not fully collapsed.",
      reason: `${moneyWhole(outcome.finalSavings)} projected after travel with ${world.confidenceLevel || "medium"} confidence.`,
      tone: "survival",
    }));
  }

  if (weeks.length >= 2) {
    const latest = weeks.at(-1);
    const previous = weeks.at(-2);
    const event = buildMilestoneWorldEvent(latest, previous, world);
    if (event) milestones.push(event);
  }

  if (!milestones.length) {
    milestones.push(createMilestone({
      week: progress.currentWeek,
      category: "observing",
      priority: 30,
      title: "The system is waiting for real summer evidence.",
      copy: "Log shifts, spending, moods, or route changes and this becomes a memory architecture instead of a preset checklist.",
      reason: "No behavioral pattern has repeated long enough to become a milestone yet.",
      tone: "quiet",
    }));
  }

  return prioritizeMilestones(milestones);
}

function buildMilestoneWorldEvent(latest, previous, world) {
  const seed = milestoneSeed("world-event", latest.week);
  const options = [];
  if (latest.spending > previous.spending * 1.45 && latest.spending > 80) {
    options.push(createMilestone({
      week: latest.week,
      category: "financial",
      priority: 60,
      title: "An expensive week bent the projection.",
      copy: "The system logged a spending spike large enough to change the feel of the route.",
      reason: `Spending rose from ${moneyWhole(previous.spending)} to ${moneyWhole(latest.spending)}.`,
      tone: "tense",
      periodLabel: latest.periodLabel,
    }));
  }
  if (latest.hours > previous.hours + 10 && latest.hours > 35) {
    options.push(createMilestone({
      week: latest.week,
      category: "momentum",
      priority: 62,
      title: "An overtime week pushed momentum forward.",
      copy: "The money improved, but the system will watch whether recovery follows.",
      reason: `Hours climbed from ${numberWhole(previous.hours)} to ${numberWhole(latest.hours)}.`,
      tone: "observed",
      periodLabel: latest.periodLabel,
    }));
  }
  if ((world.burnoutRisk || 0) > 70) {
    options.push(createMilestone({
      week: latest.week,
      category: "burnout",
      priority: 75,
      title: "Fatigue started competing with ambition.",
      copy: "The system is treating the next route decision as a recovery decision too.",
      reason: `Burnout pressure ${Math.round(world.burnoutRisk)}/100.`,
      tone: "burnout",
      periodLabel: latest.periodLabel,
    }));
  }
  return options.length ? options[seed % options.length] : null;
}

function prioritizeMilestones(milestones) {
  const byId = new Map();
  milestones.forEach((milestone) => {
    const existing = byId.get(milestone.id);
    if (!existing || milestone.priority > existing.priority) byId.set(milestone.id, milestone);
  });
  const categoryCounts = new Map();
  return [...byId.values()]
    .sort((a, b) => b.priority - a.priority || b.week - a.week)
    .filter((milestone) => {
      const count = categoryCounts.get(milestone.category) || 0;
      const allowed = milestone.priority >= 84 ? 2 : 1;
      if (count >= allowed) return false;
      categoryCounts.set(milestone.category, count + 1);
      return true;
    })
    .slice(0, 7)
    .sort((a, b) => a.week - b.week || b.priority - a.priority);
}

function renderSummerMilestones(progress) {
  const milestones = buildDynamicMilestones(progress);
  const currentPosition = getSummerDatePosition(todayISO(), progress);
  elements.summerMilestones.replaceChildren(
    ...milestones.map((milestone, index) => {
      const card = document.createElement("article");
      const old = index < Math.max(0, milestones.length - 4);
      card.className = `milestone milestone-${milestone.category} ${milestone.priority >= 82 ? "is-major" : ""} ${old ? "is-faded" : ""}`;
      card.style.animationDelay = `${index * 45}ms`;
      const label = milestone.periodLabel || (!currentPosition.inWindow ? currentPosition.weekLabel : `Week ${milestone.week}`);
      card.innerHTML = `
        <span>${label} · ${milestone.category}</span>
        <strong>${milestone.title}</strong>
        <p>${milestone.copy}</p>
        <small>${milestone.reason}</small>
      `;
      return card;
    }),
  );
}

function buildMemoryTrail(progress) {
  return [...liveSummerState.logs].slice(-8).reverse().map((log, index) => {
    const position = getSummerDatePosition(log.date, progress);
    const day = position.day;
    const headline = log.bestMoment || log.city || log.note || (index === 0 ? "Logged another WAT day." : "Kept the summer moving.");
    const earnings = Number(log.estimatedEarnings ?? (Number(log.hours || 0) * Number(log.hourlyWage || 0) + Number(log.tips || 0)));
    const detailParts = [
      log.date ? log.date : "",
      Number(log.hours || 0) ? `${Number(log.hours || 0)}h worked` : "",
      earnings ? `${moneyWhole(earnings)} earned` : "",
      Number(log.spending || 0) ? `${moneyWhole(log.spending)} spent` : "",
      log.city ? `City: ${log.city}` : "",
    ].filter(Boolean);
    return { ...log, day, relativeLabel: position.label, headline, detail: detailParts.join(" · ") || "Memory saved locally in this browser." };
  });
}

function buildWeeklyMemorySummaries(progress) {
  const groups = new Map();
  liveSummerState.logs.forEach((log) => {
    const position = getSummerDatePosition(log.date, progress);
    const key = position.inWindow ? `week-${position.week}` : `${position.weekLabel}-${log.date}`;
    const group = groups.get(key) || [];
    group.push({ ...log, day: position.day, week: position.week, relativeLabel: position.label, periodLabel: position.weekLabel, sortDay: position.sortDay });
    groups.set(key, group);
  });
  return [...groups.values()].sort((a, b) => (a.at(-1)?.sortDay || 0) - (b.at(-1)?.sortDay || 0)).slice(-3).reverse().map((logs) => {
    const week = logs.at(-1)?.week || 0;
    const periodLabel = logs.at(-1)?.periodLabel || `Week ${week}`;
    const totals = getLogTotals(logs);
    const net = totals.earnings - totals.spending;
    const heavy = totals.hours > Number(liveSummerState.weeklyWorkTarget || 40) * 1.15;
    const spendingHeavy = totals.spending > totals.earnings * 0.38;
    const city = logs.find((log) => log.city)?.city;
    const headline = spendingHeavy
      ? "Spending started pushing back."
      : heavy
        ? "Work intensity shaped the week."
        : net > 300
          ? "This week bought breathing room."
          : "The week stayed messy but alive.";
    const interpretation = spendingHeavy
      ? "Documentary read: travel pressure may be replacing savings discipline."
      : heavy
        ? "Documentary read: the money improved, but recovery margin narrowed."
        : net > 300
          ? "Documentary read: consistent work protected the route."
          : "Documentary read: the system still needs a clearer pattern.";
    return {
      id: `week-${week}`,
      isSummary: true,
      day: logs.at(-1)?.day || week * 7,
      relativeLabel: periodLabel,
      mood: periodLabel,
      headline,
      detail: `${numberWhole(totals.hours)}h worked · ${moneyWhole(totals.earnings)} earned · ${moneyWhole(totals.spending)} spent${city ? ` · ${city} entered the story` : ""}`,
      note: interpretation,
    };
  });
}

function renderMemoryTimeline(progress) {
  const logs = [...buildWeeklyMemorySummaries(progress), ...buildMemoryTrail(progress)].slice(0, 11);
  const currentPosition = getSummerDatePosition(todayISO(), progress);
  elements.memoryTitle.textContent = currentPosition.inWindow ? `Day ${progress.elapsedDays} in America` : currentPosition.weekLabel;
  if (!logs.length) {
    const empty = document.createElement("p");
    empty.className = "memory-empty";
    empty.textContent = "No memories logged yet. Add a shift above, or save a quick memo below.";
    elements.memoryTimeline.replaceChildren(empty);
    return;
  }
  elements.memoryTimeline.replaceChildren(
    ...logs.map((log) => {
      const saved = Number(log.net ?? (Number(log.hours || 0) * Number(log.hourlyWage || 0) + Number(log.tips || 0) - Number(log.spending || 0)));
      const item = document.createElement("article");
      item.className = "memory-item";
      const header = log.isSummary ? (log.relativeLabel || log.mood) : `${log.relativeLabel || `Day ${log.day}`} · ${log.mood}`;
      item.innerHTML = `
        <span>${header}</span>
        <strong>${log.headline}</strong>
        <p>${log.detail}${saved ? ` · ${moneyWhole(saved)} net day` : ""}</p>
        <small>${interpretMemory(log, saved)}</small>
        ${!log.isSummary && log.note && log.note !== log.headline ? `<small>${log.note}</small>` : ""}
        ${log.isSummary ? "" : `<footer><button class="log-delete" type="button" data-delete-log="${log.id}">Delete log</button></footer>`}
      `;
      return item;
    }),
  );
  elements.memoryTimeline.querySelectorAll("[data-delete-log]").forEach((button) => {
    button.addEventListener("click", () => deleteDailyLog(button.dataset.deleteLog));
  });
}

function interpretMemory(log, saved) {
  if (log.isSummary) return log.note || "The system is turning repeated logs into a weekly chapter.";
  if (log.mood === "Broke" || saved < -40) return "This memory weakened the travel fund a little.";
  if (log.mood === "Grinding" && Number(log.hours || 0) >= 8) return "This was a work-heavy chapter. Useful money, real fatigue.";
  if (log.city) return "This is where the summer becomes a story, not just a spreadsheet.";
  if (saved > 120) return "A small win. This kind of day buys future freedom.";
  return "Memory saved. The system will read the pattern over time.";
}

function getLiveInsight(projection, weekly, travel, stress) {
  const world = derivedState.simulationWorld;
  if (!liveSummerState.logs.length) return "Log your first shift to wake the system up.";
  if (world?.simulationNarrative) return world.simulationNarrative;
  if (stress.label === "Burnout risk" || stress.label === "Overworked") return "Your stress level is climbing. More money is not useful if the season breaks you.";
  if (travel.afterTravel < 0) return "You are currently overspending for your travel goals. Trim route cost or add work weeks.";
  if (weekly.spending > weekly.earnings * 0.45 && weekly.spending > 100) return "Your spending is starting to eat the route.";
  if (projection.projectedBeforeTravel >= projection.target) return "You are currently ahead of your savings target. Protect the cushion.";
  if (weekly.hours < Number(liveSummerState.weeklyWorkTarget || 0) * 0.7) return "Hours are below target this week. Your final number may slide if this continues.";
  return "At this pace, your travel plan is still alive.";
}

function getWorkIntensity(weeklyHours) {
  const target = Math.max(1, Number(liveSummerState.weeklyWorkTarget || 40));
  if (weeklyHours >= target * 1.25) return "Heavy";
  if (weeklyHours >= target * 0.95) return "On pace";
  if (weeklyHours >= target * 0.65) return "Light";
  return "Low hours";
}

function getSavingsTrend(projection) {
  if (!liveSummerState.logs.length) return "Watching";
  const gap = projection.projectedBeforeTravel - projection.target;
  if (gap >= 800) return "Ahead";
  if (gap >= -400) return "On track";
  if (gap >= -1200) return "Behind";
  return "At risk";
}

function updateSummerDashboard() {
  if (!elements.summerDayCount) return;
  const dashboardMetrics = calculateDashboardMetrics();
  const { projection, weekly, travel, paycheck } = dashboardMetrics;
  const worldStressLabel = derivedState.fatigueState === "Fresh"
    ? "Stable"
    : derivedState.fatigueState === "Tired"
      ? "Tight"
      : derivedState.fatigueState === "Heavy"
        ? "Heavy"
        : derivedState.fatigueState;
  const stress = derivedState.simulationWorld
    ? {
      label: worldStressLabel,
      value: Math.max(dashboardMetrics.stress.value, derivedState.burnoutRisk || 0),
      copy: derivedState.simulationNarrative || dashboardMetrics.stress.copy,
    }
    : dashboardMetrics.stress;

  elements.summerDayCount.textContent = `Day ${projection.progress.elapsedDays} / ${projection.progress.totalDays}`;
  elements.summerStatusLine.textContent = `${projection.progress.completedDays} days down. Week ${projection.progress.currentWeek} of ${projection.progress.totalWeeks}.`;
  elements.summerProgressFill.style.width = `${projection.progress.percentComplete}%`;
  elements.daysCompleted.textContent = `${projection.progress.completedDays} days completed`;
  elements.summerCompletion.textContent = `${Math.round(projection.progress.percentComplete)}% complete`;
  animateNumber(elements.liveProjectedSavings, projection.projectedBeforeTravel);
  animateNumber(elements.liveTrackedEarnings, projection.totals.earnings);
  animateNumber(elements.liveTrackedSpending, projection.totals.spending);
  animateNumber(elements.liveAfterTravel, projection.finalSavings);
  animateNumber(elements.liveWeeklyHours, weekly.hours, (value) => numberWhole(value));
  elements.liveWorkIntensity.textContent = getWorkIntensity(weekly.hours);
  elements.liveSavingsTrend.textContent = getSavingsTrend(projection);
  const travelFundPercent = Math.round(clamp((projection.projectedBeforeTravel / Math.max(projection.target, 1)) * 100, 0, 140));
  elements.liveTravelFund.textContent = `${travelFundPercent}%`;
  elements.livePaycheckCountdown.textContent = paycheck.countdown === 0 ? `${moneyWhole(paycheck.postTax)} today` : `${paycheck.countdown} day${paycheck.countdown === 1 ? "" : "s"}`;
  elements.liveInsight.textContent = `${getLiveInsight(projection, weekly, travel, stress)} ${getHumanInsight("travelFund", travelFundPercent)}`;
  elements.liveStressLevel.textContent = stress.label;
  elements.liveStressFill.style.width = `${stress.value}%`;
  const eventCopy = derivedState.simulationEvents?.length ? ` Current event: ${derivedState.simulationEvents[0].label}. ${derivedState.simulationEvents[0].copy}` : "";
  const whyCopy = derivedState.explainability?.length ? ` Why: ${derivedState.explainability.slice(0, 3).join("; ")}.` : "";
  elements.liveStressCopy.textContent = `${getHumanInsight("stress", stress.label)} ${stress.copy} Momentum: ${derivedState.momentumState || "Unstarted"}.${eventCopy}${whyCopy} ${getHumanInsight("paycheck", paycheck.postTax, paycheck)} Estimated next deposit: ${moneyWhole(paycheck.postTax)}.`;
  renderLiveSavingsTimeline(projection);
  renderSummerMilestones(projection.progress);
  renderMemoryTimeline(projection.progress);
  updateStickySummerStatus(projection, stress);
}

function updateStickySummerStatus(projection = buildSavingsProjection(), stress = calculateStressLevel({
  projection,
  weekly: buildWeeklySummary(),
  travel: calculateTravelAffordability(projection.projectedBeforeTravel),
  projectedSavings: projection.projectedBeforeTravel,
})) {
  if (!elements.stickySummerText) return;
  elements.stickySummerText.textContent = buildStickyStatus(projection, stress);
}

function getCommunityStyleInsights() {
  return [
    "Most students overspend during the first two weeks.",
    "High-rent states punish weak budgeting fast.",
    "Students who track spending weekly usually protect their travel fund better.",
    "Housing is the real boss fight.",
  ];
}

function renderCommunityStyleInsights() {
  elements.communityInsights?.replaceChildren(
    ...getCommunityStyleInsights().map((insight) => {
      const card = document.createElement("article");
      card.className = "community-insight";
      card.innerHTML = `<span>Curated WAT insight · demo data</span><strong>${insight}</strong>`;
      return card;
    }),
  );
}

function getSelectedInterests() {
  return [...document.querySelectorAll(".interest-grid input:checked")].map((input) => input.value);
}

function updateTravelPlanner() {
  const plannerInput = getRoutePlannerInputFromForm();
  appState.routePlannerInputs = plannerInput;
  if (plannerInput.currentState !== activeState) {
    appState.selectedState = plannerInput.currentState;
    appState.simulatorInputs = { ...appState.simulatorInputs, state: plannerInput.currentState, stateCode: plannerInput.currentState };
    activeState = plannerInput.currentState;
    selectState(plannerInput.currentState, { persist: false, skipRecalculate: true });
  }
  const result = buildRoutePlan(plannerInput);
  appState.routePlannerResult = {
    route: result.route,
    total: result.total,
    transport: result.transport,
    accommodation: result.accommodation,
    food: result.food,
  };
  elements.suggestedRoute.textContent = result.route.join(" to ");
  const overBudget = result.total > plannerInput.budget;
  const tooFewDays = plannerInput.days < Math.max(2, result.route.length - 1);
  elements.tripWarning.textContent = `${result.warning} ${overBudget ? "This route may hurt your wallet." : "This route still leaves room for the story."}`;
  if (elements.routePlannerNotice) {
    const notices = [];
    if (plannerInput.budget < 300) notices.push("Travel budget is very low. Keep the route short.");
    if (tooFewDays) notices.push("Travel days are tight for the selected route.");
    if (!plannerInput.interests.length) notices.push("Choose at least one interest to shape the route.");
    if (Number(appState.simulatorInputs.hoursPerWeek || 0) > 50 && result.route.length > 3) notices.push("High work hours detected. Consider a shorter recovery-friendly route.");
    if (derivedState.travelFreedom < 35) notices.push("Travel freedom is low right now. The simulator is narrowing the route.");
    if (derivedState.routeFragility > 70) notices.push("Your current pace may force you to cut one city.");
    elements.routePlannerNotice.textContent = notices.join(" ");
    elements.routePlannerNotice.classList.toggle("is-warning", notices.length > 0);
  }
  elements.transportCost.textContent = moneyWhole(result.transport);
  elements.accommodationCost.textContent = moneyWhole(result.accommodation);
  elements.tripFoodCost.textContent = moneyWhole(result.food);
  elements.totalTripCost.textContent = moneyWhole(result.total);
  elements.recommendedStops.replaceChildren(
    ...result.stops.map((stop) => {
      const card = document.createElement("article");
      card.className = "stop-card";
      card.innerHTML = `<strong>${stop.city}</strong><span>${stop.note}</span>`;
      return card;
    }),
  );
  renderFinalOutcomeSummary();
  saveStateToStorage();
}

function getOptimizerInput() {
  return {
    start: elements.optimizerStart.value.trim(),
    end: elements.optimizerEnd.value.trim(),
    days: Math.max(1, Number(elements.optimizerDays.value || 1)),
    budget: Number(elements.optimizerBudget.value || 0),
    style: elements.optimizerStyle.value,
    transport: elements.optimizerTransport.value,
    preferred: elements.preferredDestinations.value,
    must: elements.mustVisitPlaces.value,
    optional: elements.optionalPlaces.value,
  };
}

function buildRouteTimeline(result, days) {
  const intensity = getRouteIntensity(result.route, days);
  return result.stopNights.map((stop, index) => {
    const leg = index === 0 ? null : result.cost.legs[index - 1];
    const impact = leg ? moneyWhole(leg.cost) : "Start";
    const note = index === 0
      ? `Starting point · nearest airport ${stop.airport}`
      : `${leg?.mode || "transport"} leg · ${impact} budget impact`;
    return { ...stop, index, intensity, impact, note };
  });
}

function renderRouteTimeline(result, days) {
  const timeline = buildRouteTimeline(result, days);
  elements.routeTimeline.replaceChildren(
    ...timeline.map((stop) => {
      const card = document.createElement("article");
      card.className = "route-timeline-stop";
      const daysLabel = stop.index === 0 ? "Start" : `${stop.days} day${stop.days === 1 ? "" : "s"}`;
      card.innerHTML = `
        <span>${daysLabel} · ${stop.intensity}</span>
        <strong>${stop.name}</strong>
        <p>${stop.note}</p>
        <small>${stop.index === 0 ? "Route begins here" : `Departure airport: ${stop.airport}`}</small>
      `;
      return card;
    }),
  );
}

function updateRouteOptimizer() {
  renderDestinationChips();
  const optimizerInput = getOptimizerInput();
  appState.customRouteInputs = optimizerInput;
  appState.selectedMustVisitPlaces = splitPlaces(optimizerInput.must);
  appState.selectedOptionalPlaces = splitPlaces(optimizerInput.optional);
  const hasDestinations = Boolean(splitPlaces(optimizerInput.must).length || splitPlaces(optimizerInput.preferred).length || splitPlaces(optimizerInput.optional).length);
  if (!hasDestinations) {
    appState.customRouteResult = { route: [], total: 0, transport: 0, accommodation: 0, food: 0, intensity: "Chill", type: "Waiting for cities" };
    elements.optimizedRoute.textContent = "Add at least one must-visit or preferred city to build a route.";
    elements.optimizerWarnings.textContent = "No route yet. Pick a city above and the optimizer will build the story.";
    elements.routeIntensity.textContent = "Waiting";
    elements.routeType.textContent = "No route";
    elements.optimizerTransportCost.textContent = moneyWhole(0);
    elements.optimizerAccommodationCost.textContent = moneyWhole(0);
    elements.optimizerFoodCost.textContent = moneyWhole(0);
    elements.optimizerTotalCost.textContent = moneyWhole(0);
    elements.routeTimeline.replaceChildren();
    elements.optimizedStops.replaceChildren();
    elements.cheaperRoute.textContent = "Add destinations first";
    elements.fasterRoute.textContent = "Add destinations first";
    elements.routeOptimizerNotice.textContent = "Add at least one must-visit or preferred city to build a route.";
    elements.routeOptimizerNotice.classList.add("is-warning");
    renderFinalOutcomeSummary();
    saveStateToStorage();
    return;
  }
  if (derivedState.travelFreedom < 30 && splitPlaces(optimizerInput.optional).length) {
    elements.optionalPlaces.value = "";
    optimizerInput.optional = "";
    appState.customRouteInputs.optional = "";
  }
  const result = buildRoute(optimizerInput);
  const strategy = getRouteStrategyMetrics(result, optimizerInput);
  appState.customRouteResult = {
    route: result.route.map((stop) => stop.name),
    total: result.cost.total,
    transport: result.cost.transport,
    accommodation: result.cost.accommodation,
    food: result.cost.food,
    intensity: getRouteIntensity(result.route, optimizerInput.days),
    type: getRouteType(result.route, result.cost),
    strategy,
  };
  const days = optimizerInput.days;
  const longJump = result.cost.legs.some((leg) => leg.longLeg);
  const overBudget = result.cost.total > optimizerInput.budget;
  const rushed = result.route.length - 1 > days / 2;
  if (elements.routeOptimizerNotice) {
    const notices = [];
    if (overBudget) notices.push("Route is over budget. Cut optional stops or switch to cheapest transport.");
    if (rushed) notices.push("Route is too rushed. Add more days or remove one city.");
    if (derivedState.travelFreedom < 30) notices.push("Travel freedom is low. Optional stops were cut first.");
    if (derivedState.burnoutRisk > 72) notices.push("Burnout risk is high. This route needs recovery time, not more jumps.");
    elements.routeOptimizerNotice.textContent = notices.join(" ");
    elements.routeOptimizerNotice.classList.toggle("is-warning", notices.length > 0);
  }
  elements.optimizedRoute.textContent = result.route.map((stop) => stop.name).join(" to ");
  elements.optimizedRoute.classList.remove("route-pop");
  requestAnimationFrame(() => elements.optimizedRoute.classList.add("route-pop"));
  elements.optimizerWarnings.textContent = `Summer route unlocked: ${result.route.map((stop) => stop.name).join(" to ")}. ${getHumanInsight("route", result.cost.total, { overBudget, rushed, longJump })} Recovery ${strategy.recoveryScore}/100. Freedom ${strategy.freedomLevel}. Flexibility ${strategy.flexibilityScore}/100. Collapse probability ${strategy.collapseProbability}%. ${strategy.interpretation} ${result.warnings.join(" ")}`;
  elements.routeIntensity.textContent = getRouteIntensity(result.route, days);
  elements.routeType.textContent = getRouteType(result.route, result.cost);
  elements.optimizerTransportCost.textContent = moneyWhole(result.cost.transport);
  elements.optimizerAccommodationCost.textContent = moneyWhole(result.cost.accommodation);
  elements.optimizerFoodCost.textContent = moneyWhole(result.cost.food);
  elements.optimizerTotalCost.textContent = moneyWhole(result.cost.total);
  renderRouteTimeline(result, days);
  elements.cheaperRoute.textContent = `${result.cheaperRoute.route.map((stop) => stop.name).join(" to ")} (${moneyWhole(result.cheaperRoute.cost.total)})`;
  elements.fasterRoute.textContent = `${result.fasterRoute.route.map((stop) => stop.name).join(" to ")} (${moneyWhole(result.fasterRoute.cost.total)})`;
  elements.optimizedStops.replaceChildren(
    ...result.stopNights.map((stop, index) => {
      const card = document.createElement("article");
      card.className = "optimized-stop";
      const days = index === 0 ? "Start" : `${stop.days} day${stop.days === 1 ? "" : "s"}`;
      card.innerHTML = `<small>${days}</small><strong>${stop.name}</strong><span>Nearest departure airport: ${stop.airport}</span>`;
      return card;
    }),
  );
  renderFinalOutcomeSummary();
  saveStateToStorage();
}

function buildFinalOutcomeSummary() {
  const outcome = calculateSummerOutcome();
  const route = elements.optimizedRoute.textContent || "your route";
  const routeStops = route.split(" to ").filter(Boolean);
  const state = stateData[outcome.input.stateCode]?.name || stateData[activeState].name;
  const type = getStudentTypeProfile().title;
  const weekly = buildWeeklySummary();
  const latestMood = liveSummerState.logs.at(-1)?.mood;
  const routeCost = Number(appState.customRouteResult?.total || 0);
  const finalSavings = routeCost > 0 ? outcome.savings.totalBeforeTravel - routeCost : outcome.savings.finalSavings;
  const headline = getFinalOutcomeHeadline({ finalSavings, stress: outcome.stress.label, weeks: outcome.input.workingWeeks, state, routeCount: Math.max(0, routeStops.length - 2) });
  const verdict = getFinalOutcomeVerdict({ finalSavings, stress: outcome.stress.label, latestMood, hoursPerWeek: outcome.input.hoursPerWeek });
  return {
    type,
    state,
    weeks: outcome.input.workingWeeks,
    stress: outcome.stress.label,
    route,
    routeCount: Math.max(0, routeStops.length - 2),
    finalSavings,
    liveHours: weekly.hours,
    latestMood,
    headline,
    verdict,
  };
}

function getFinalOutcomeHeadline({ finalSavings, stress, weeks, state, routeCount }) {
  if (finalSavings < 0) return "The route outgrew the budget. Something has to give.";
  if (stress === "Burnout risk" || stress === "Overworked") return "You made the money, but the schedule almost ate the summer.";
  if (finalSavings > 4200) return `You worked ${weeks} weeks, kept travel under control, and returned with ${moneyWhole(finalSavings)}.`;
  if (routeCount >= 3 && finalSavings < 1500) return "You chased the route before stabilizing the money.";
  return `You worked ${weeks} weeks, survived ${state} rent, visited ${routeCount} cities, and returned with ${moneyWhole(finalSavings)}.`;
}

function getFinalOutcomeVerdict({ finalSavings, stress, latestMood, hoursPerWeek }) {
  let verdict = getHumanOutcomeVerdict(finalSavings);
  if (finalSavings < 0) verdict = "The travel plan is financially fragile. Cut a stop, add hours, or reduce the route budget.";
  else if (stress === "Burnout risk" || hoursPerWeek > 58) verdict = "You protected the number, but the schedule is asking for too much.";
  else if (finalSavings >= 3000) verdict = "You protected both the trip and the person surviving it.";
  if (derivedState.momentumState === "Accelerating") verdict = "Disciplined. You gave yourself options by staying consistent.";
  if (derivedState.momentumState === "Slipping") verdict = "Travel pressure slowly replaced savings discipline. The summer needs a cleaner finish.";
  if (derivedState.momentumState === "Recovering") verdict = "The summer started unstable. You adapted before it collapsed.";
  if (latestMood) verdict += ` Latest logged mood: ${latestMood.toLowerCase()}.`;
  return verdict;
}

function buildFinalOutcome() {
  return buildFinalOutcomeSummary();
}

function buildShareCard(summary = buildFinalOutcomeSummary()) {
  return {
    type: summary.type.toUpperCase(),
    savings: moneyWhole(summary.finalSavings),
    weeks: `${summary.weeks} weeks`,
    survived: `${summary.state} rent`,
    cities: `${summary.routeCount} cit${summary.routeCount === 1 ? "y" : "ies"}`,
    stress: summary.stress,
    route: summary.route,
    verdict: summary.verdict,
  };
}

function saveGeneratedShareCard() {
  const summary = buildFinalOutcomeSummary();
  const poster = buildShareCard(summary);
  const savedCard = {
    id: globalThis.crypto?.randomUUID ? crypto.randomUUID() : `share-${Date.now()}`,
    createdAt: new Date().toISOString(),
    summary,
    poster,
  };
  appState.finalOutcome = summary;
  appState.activeShareCard = savedCard;
  appState.generatedShareCards = [...(appState.generatedShareCards || []), savedCard].slice(-12);
  appState.shareCardVisible = true;
  saveStateToStorage();
  return savedCard;
}

function renderFinalOutcomeSummary() {
  if (!elements.summaryHeadline) return;
  const summary = buildFinalOutcomeSummary();
  appState.finalOutcome = summary;
  const poster = appState.shareCardVisible && appState.activeShareCard?.poster
    ? appState.activeShareCard.poster
    : buildShareCard(summary);
  elements.summaryType.textContent = summary.type;
  elements.summaryState.textContent = summary.state;
  elements.summaryWeeks.textContent = summary.weeks;
  elements.summaryStress.textContent = summary.stress;
  elements.summaryRoute.textContent = summary.route;
  elements.summaryHeadline.textContent = summary.headline;
  elements.summaryVerdict.textContent = summary.verdict;
  elements.posterType.textContent = poster.type;
  elements.posterSavings.textContent = poster.savings;
  elements.posterWeeks.textContent = poster.weeks;
  elements.posterState.textContent = poster.survived;
  elements.posterCities.textContent = poster.cities;
  elements.posterStress.textContent = poster.stress;
  elements.posterRoute.textContent = `Route: ${poster.route}`;
  elements.posterVerdict.textContent = poster.verdict;
  elements.sharePoster?.classList.toggle("is-generated", Boolean(appState.shareCardVisible));
}

function bindStateKeyboard(selection, code) {
  selection.on("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    selectState(code);
  });
}

function updateJourneyNav() {
  if (!elements.journeyNav) return;
  const stages = [
    ["choose", "#identityStage"],
    ["simulate", "#simulatorStage"],
    ["track", "#liveSummer"],
    ["travel", "#travelStage"],
    ["recap", "#finalStage"],
  ];
  const activationLine = Math.min(160, window.innerHeight * 0.28);
  const active = stages.reduce((current, [stage, selector]) => {
    const rect = document.querySelector(selector)?.getBoundingClientRect();
    return rect && rect.top <= activationLine ? stage : current;
  }, "choose");
  elements.journeyNav.querySelectorAll("a").forEach((link) => {
    link.classList.toggle("active", link.dataset.stage === active);
    link.setAttribute("aria-current", link.dataset.stage === active ? "step" : "false");
  });
}

function updateApp(options = {}) {
  syncStateToGlobals();
  syncLiveFromAppState();
  if (!options.skipForms) applyAppStateToForms();
  recalculateDerivedState();
  document.body.dataset.systemMood = derivedState.emotionalTone || "steady";
  renderStudentTypes();
  renderMapLayerTabs();
  recolorMap();
  renderComparePicker();
  renderComparison();
  renderRankingTabs();
  renderRankings();
  renderCommunityStyleInsights();
  renderScenarioButtons();
  selectState(activeState, { persist: false, skipRecalculate: true });
  if (!options.skipCalculator) updateCalculator();
  if (!options.skipTravel) {
    updateTravelPlanner();
    updateRouteOptimizer();
  }
  updateSummerDashboard();
  renderFinalOutcomeSummary();
  updateJourneyNav();
  if (options.persist !== false) saveStateToStorage();
}

function renderApp(options = {}) {
  updateApp(options);
}

async function drawMap() {
  if (!window.d3 || !window.topojson) throw new Error("Map libraries unavailable");

  const map = await d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json");
  const states = topojson
    .feature(map, map.objects.states)
    .features
    .map((feature) => ({ ...feature, code: fipsToCode[String(feature.id).padStart(2, "0")] }))
    .filter((feature) => stateData[feature.code]);

  const projection = d3.geoAlbersUsa().fitSize([975, 610], { type: "FeatureCollection", features: states });
  const path = d3.geoPath(projection);
  const layer = d3.select(elements.stateLayer);

  const paths = layer
    .selectAll("path")
    .data(states)
    .join("path")
    .attr("class", (feature) => `state-shape ${getLayerClass(feature.code)}`)
    .attr("d", path)
    .attr("data-state", (feature) => feature.code)
    .attr("tabindex", "0")
    .attr("role", "button")
    .attr("aria-pressed", "false")
    .attr("aria-label", (feature) => {
      const state = stateData[feature.code];
      const profile = buildRealityProfile(feature.code, activeStudentType);
      return `${state.name}: ${profile.tier} reality tier, ${profile.score} out of 100`;
    })
    .on("mouseenter", (event, feature) => {
      selectState(feature.code);
      showTip(event, feature.code);
    })
    .on("mousemove", (event, feature) => showTip(event, feature.code))
    .on("mouseleave", hideTip)
    .on("focus", (event, feature) => selectState(feature.code))
    .on("click", (event, feature) => selectState(feature.code));

  paths.each(function bindPathKey(feature) {
    bindStateKeyboard(d3.select(this), feature.code);
  });

  layer
    .selectAll("text")
    .data(states)
    .join("text")
    .attr("class", "state-label")
    .attr("x", (feature) => path.centroid(feature)[0])
    .attr("y", (feature) => path.centroid(feature)[1])
    .attr("dy", "0.35em")
    .text((feature) => feature.code);

  elements.mapLoading.classList.add("hidden");
  recolorMap();
  selectState(activeState);
}

function bindEvents() {
  elements.stateSelect.addEventListener("change", (event) => selectState(event.target.value));
  elements.calcState.addEventListener("change", (event) => {
    appState.selectedState = event.target.value;
    appState.simulatorInputs = { ...appState.simulatorInputs, stateCode: event.target.value };
    updateCalculator();
  });
  elements.secondJobToggle.addEventListener("change", () => {
    updateSecondJobVisibility();
    updateCalculator();
  });
  document.querySelector("#simulatorForm").addEventListener("input", updateCalculator);
  document.querySelector("#travelForm").addEventListener("input", updateTravelPlanner);
  document.querySelector("#routeOptimizerForm").addEventListener("input", updateRouteOptimizer);
  document.querySelectorAll("[data-add-location]").forEach((button) => {
    button.addEventListener("click", () => addLocationToList(button.dataset.addLocation));
  });
  elements.summerSettingsForm?.addEventListener("input", () => {
    liveSummerState = {
      ...liveSummerState,
      startDate: elements.watStartDate.value || todayISO(),
      endDate: elements.watEndDate.value || addDaysISO(todayISO(), 120),
      weeklyWorkTarget: sanitizeNumber(elements.weeklyWorkTarget.value, 40, 1, 112),
      savingsTarget: sanitizeNumber(elements.savingsTarget.value, 5200, 0, 50000),
      payFrequency: elements.payFrequency.value,
      nextPayday: elements.nextPayday.value || addDaysISO(todayISO(), 5),
    };
    syncAppStateFromLive();
    updateApp({ persist: true, skipForms: true, skipCalculator: true, skipTravel: true });
  });
  elements.dailyLogForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    logDailyEntry({
      hours: elements.logHours.value,
      tips: elements.logTips.value,
      spending: elements.logSpending.value,
      mood: elements.logMood.value,
      city: elements.logCity.value,
      bestMoment: elements.logBestMoment.value,
      note: elements.logNote.value,
    });
    elements.logHours.value = "";
    elements.logTips.value = "";
    elements.logSpending.value = "";
    elements.logCity.value = "";
    elements.logBestMoment.value = "";
    elements.logNote.value = "";
  });
  elements.memoryMemoForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const memo = elements.memoryMemoText.value.trim();
    if (!memo) {
      elements.memoryMemoText.focus();
      return;
    }
    logDailyEntry({
      hours: 0,
      tips: 0,
      spending: 0,
      mood: elements.logMood?.value || "Chilling",
      bestMoment: memo,
      note: memo,
    });
    elements.memoryMemoText.value = "";
  });
  document.querySelectorAll("[data-quick-log]").forEach((button) => {
    button.addEventListener("click", () => {
      const type = button.dataset.quickLog;
      if (type === "shift") {
        elements.logHours.value = elements.logHours.value || 8;
        elements.logMood.value = "Grinding";
        elements.logNote.value = elements.logNote.value || "Shift completed.";
        elements.logHours.focus();
      }
      if (type === "spending") {
        elements.logSpending.value = elements.logSpending.value || 25;
        elements.logMood.value = "Broke";
        elements.logSpending.focus();
      }
      if (type === "tips") {
        elements.logTips.value = elements.logTips.value || 40;
        elements.logMood.value = "Winning";
        elements.logTips.focus();
      }
    });
  });
  elements.clearLogsButton?.addEventListener("click", clearDailyLogs);
  elements.resetDemoButton?.addEventListener("click", resetState);
  elements.generateShareCard?.addEventListener("click", () => {
    saveGeneratedShareCard();
    renderFinalOutcomeSummary();
    elements.generateShareCard.textContent = "Share card saved locally";
    elements.sharePoster?.classList.add("poster-card-pulse");
    elements.sharePoster?.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => {
      elements.sharePoster?.classList.remove("poster-card-pulse");
      elements.generateShareCard.textContent = "Generate share card";
    }, 1200);
  });
  window.addEventListener("scroll", () => {
    const liveBottom = document.querySelector("#liveSummer")?.getBoundingClientRect().bottom || 0;
    elements.stickySummerStatus?.classList.toggle("is-visible", liveBottom < 0);
    updateJourneyNav();
  }, { passive: true });
}

function boot() {
  [elements.stateSelect, elements.calcState, elements.travelState].forEach(renderOptions);
  [
    elements.startCity,
    elements.optimizerStart,
    elements.optimizerEnd,
    elements.preferredPicker,
    elements.mustPicker,
    elements.optionalPicker,
  ].forEach(renderLocationOptions);
  elements.dataUpdated.textContent = `Updated ${dataSet.lastUpdated}`;
  bindEvents();
  applyAppStateToForms();
  updateApp({ persist: false });

  drawMap().catch(() => {
    setLoadingMessage("Map could not load. Use the selector, comparison, rankings, and simulators below.");
  });
}

boot();
