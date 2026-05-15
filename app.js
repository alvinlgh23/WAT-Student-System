const stateData = {
  WA: ["Washington", 16.66, "$25 - $33/hr", "No state income tax", "6.50%", "High", "$950 - $1,650/mo", "$500 - $950", 76, "Strong hourly wages and no income tax, but Seattle-area rent can bite."],
  OR: ["Oregon", 15.05, "$22 - $29/hr", "4.75% - 9.90%", "0.00%", "High", "$850 - $1,450/mo", "$420 - $800", 70, "No sales tax helps daily spending, while rent and income tax need planning."],
  CA: ["California", 16.50, "$24 - $34/hr", "1.00% - 12.30%", "7.25%", "Very high", "$1,100 - $2,000/mo", "$250 - $700", 61, "Excellent wages and travel options, but housing pressure is serious."],
  ID: ["Idaho", 7.25, "$18 - $24/hr", "5.80%", "6.00%", "Medium", "$650 - $1,050/mo", "$350 - $700", 58, "Lower costs help, but the wage floor is low outside stronger employers."],
  NV: ["Nevada", 12.00, "$20 - $28/hr", "No state income tax", "6.85%", "Medium", "$750 - $1,250/mo", "$500 - $900", 78, "Good hospitality market, no state income tax, and solid savings potential."],
  AZ: ["Arizona", 14.70, "$19 - $27/hr", "2.50%", "5.60%", "Medium", "$750 - $1,250/mo", "$450 - $850", 75, "Balanced taxes, warm-weather tourism jobs, and manageable costs in many cities."],
  UT: ["Utah", 7.25, "$19 - $27/hr", "4.55%", "6.10%", "Medium", "$750 - $1,250/mo", "$350 - $720", 60, "Outdoor access is excellent, but entry wages vary heavily by employer."],
  MT: ["Montana", 10.55, "$18 - $25/hr", "4.70% - 5.90%", "0.00%", "Medium", "$650 - $1,150/mo", "$360 - $760", 66, "No sales tax and seasonal tourism help, though housing near parks can spike."],
  WY: ["Wyoming", 7.25, "$18 - $25/hr", "No state income tax", "4.00%", "Medium", "$600 - $1,000/mo", "$430 - $780", 64, "Low taxes support savings, but job density is thinner."],
  CO: ["Colorado", 14.81, "$22 - $31/hr", "4.40%", "2.90%", "High", "$900 - $1,600/mo", "$420 - $850", 72, "Strong wages and lifestyle, with rent as the main tradeoff."],
  NM: ["New Mexico", 12.00, "$17 - $24/hr", "1.70% - 5.90%", "5.13%", "Low", "$550 - $950/mo", "$420 - $760", 67, "Affordable living can offset moderate wages."],
  ND: ["North Dakota", 7.25, "$18 - $26/hr", "1.95% - 2.50%", "5.00%", "Medium", "$600 - $1,000/mo", "$380 - $760", 57, "Taxes are light, but WAT job choice may be narrower."],
  SD: ["South Dakota", 7.25, "$17 - $24/hr", "No state income tax", "4.20%", "Low", "$550 - $900/mo", "$430 - $780", 63, "Low taxes and costs are friendly if you land a reliable role."],
  NE: ["Nebraska", 13.50, "$18 - $25/hr", "2.46% - 5.20%", "5.50%", "Low", "$550 - $950/mo", "$450 - $800", 73, "Decent wage floor and affordable rent make the math work."],
  KS: ["Kansas", 7.25, "$17 - $24/hr", "5.20% - 5.58%", "6.50%", "Low", "$550 - $900/mo", "$300 - $650", 54, "Cheap rent helps, but low wage floors and tax drag reduce upside."],
  OK: ["Oklahoma", 7.25, "$16 - $23/hr", "0.25% - 4.75%", "4.50%", "Low", "$500 - $850/mo", "$330 - $680", 56, "Affordable, but students should prioritize employers paying above minimum."],
  TX: ["Texas", 7.25, "$18 - $27/hr", "No state income tax", "6.25%", "Medium", "$700 - $1,250/mo", "$420 - $850", 68, "No income tax and many jobs, but wage quality varies by city."],
  MN: ["Minnesota", 11.13, "$21 - $29/hr", "5.35% - 9.85%", "6.88%", "Medium", "$750 - $1,250/mo", "$360 - $760", 64, "Healthy job market, but income tax trims savings."],
  IA: ["Iowa", 7.25, "$17 - $24/hr", "3.80%", "6.00%", "Low", "$550 - $900/mo", "$350 - $700", 58, "Costs are friendly; wage offers need close checking."],
  MO: ["Missouri", 15.00, "$18 - $25/hr", "0.00% - 4.70%", "4.23%", "Low", "$550 - $950/mo", "$520 - $900", 82, "A strong wage floor plus lower rent makes Missouri attractive for saving."],
  AR: ["Arkansas", 11.00, "$16 - $23/hr", "2.00% - 3.90%", "6.50%", "Low", "$500 - $850/mo", "$380 - $720", 65, "Low rent supports savings, though sales tax is noticeable."],
  LA: ["Louisiana", 7.25, "$16 - $23/hr", "1.85% - 4.25%", "5.00%", "Low", "$550 - $950/mo", "$290 - $620", 51, "Culture and food are a plus, but wage upside can be limited."],
  WI: ["Wisconsin", 7.25, "$18 - $25/hr", "3.50% - 7.65%", "5.00%", "Medium", "$650 - $1,050/mo", "$320 - $680", 55, "Moderate costs, but low wage floor and income tax require employer screening."],
  IL: ["Illinois", 15.00, "$21 - $30/hr", "4.95%", "6.25%", "High", "$800 - $1,500/mo", "$430 - $850", 71, "Chicago-area jobs can pay well, but rent and sales tax climb quickly."],
  MI: ["Michigan", 12.48, "$19 - $27/hr", "4.25%", "6.00%", "Medium", "$650 - $1,100/mo", "$420 - $800", 69, "Decent wages and manageable rent in many student-friendly cities."],
  IN: ["Indiana", 7.25, "$17 - $24/hr", "3.00%", "7.00%", "Low", "$550 - $950/mo", "$330 - $680", 56, "Low rent helps, but sales tax and low wage floor hold it back."],
  OH: ["Ohio", 10.70, "$18 - $25/hr", "0.00% - 3.50%", "5.75%", "Low", "$550 - $950/mo", "$420 - $760", 68, "Affordable cities and moderate taxes can work well for careful planners."],
  KY: ["Kentucky", 7.25, "$16 - $23/hr", "4.00%", "6.00%", "Low", "$500 - $850/mo", "$300 - $650", 53, "Cheap living, but students should avoid minimum-wage placements."],
  TN: ["Tennessee", 7.25, "$17 - $25/hr", "No state income tax", "7.00%", "Low", "$650 - $1,100/mo", "$390 - $760", 64, "No income tax helps, while the sales tax and wage floor need attention."],
  MS: ["Mississippi", 7.25, "$15 - $22/hr", "4.40%", "7.00%", "Low", "$450 - $800/mo", "$260 - $580", 48, "Low rent is useful, but earnings potential is usually more limited."],
  AL: ["Alabama", 7.25, "$16 - $23/hr", "2.00% - 5.00%", "4.00%", "Low", "$500 - $850/mo", "$300 - $630", 52, "Affordable, but the MVP math depends on finding above-minimum employers."],
  ME: ["Maine", 15.10, "$20 - $28/hr", "5.80% - 7.15%", "5.50%", "High", "$750 - $1,350/mo", "$420 - $820", 73, "Seasonal tourism jobs and a strong wage floor are helpful; housing is the swing factor."],
  VT: ["Vermont", 14.01, "$20 - $27/hr", "3.35% - 8.75%", "6.00%", "High", "$750 - $1,300/mo", "$350 - $750", 65, "Beautiful and seasonal, but taxes and rural housing can complicate plans."],
  NH: ["New Hampshire", 7.25, "$20 - $28/hr", "No wage income tax", "0.00%", "High", "$800 - $1,350/mo", "$430 - $820", 67, "No sales tax is great, but the low wage floor makes employer choice critical."],
  MA: ["Massachusetts", 15.00, "$25 - $35/hr", "5.00% - 9.00%", "6.25%", "Very high", "$1,050 - $2,000/mo", "$350 - $850", 68, "High wages and strong jobs, with housing as the major obstacle."],
  RI: ["Rhode Island", 16.00, "$21 - $29/hr", "3.75% - 5.99%", "7.00%", "High", "$850 - $1,450/mo", "$420 - $830", 72, "Good wage floor and compact travel, but rent needs a plan."],
  CT: ["Connecticut", 16.35, "$23 - $32/hr", "2.00% - 6.99%", "6.35%", "High", "$850 - $1,550/mo", "$430 - $850", 72, "Strong wages help offset a pricier Northeast cost base."],
  NY: ["New York", 15.50, "$23 - $34/hr", "4.00% - 10.90%", "4.00%", "Very high", "$950 - $2,100/mo", "$300 - $850", 63, "Big earning potential, but city choice decides whether savings survive."],
  PA: ["Pennsylvania", 7.25, "$19 - $27/hr", "3.07%", "6.00%", "Medium", "$650 - $1,150/mo", "$360 - $750", 59, "Moderate taxes and costs, but the state wage floor is still low."],
  NJ: ["New Jersey", 15.49, "$23 - $32/hr", "1.40% - 10.75%", "6.63%", "High", "$900 - $1,600/mo", "$450 - $850", 72, "Good earning potential, but rent is painful."],
  DE: ["Delaware", 15.00, "$20 - $28/hr", "2.20% - 6.60%", "0.00%", "Medium", "$700 - $1,150/mo", "$520 - $900", 80, "No sales tax and a strong wage floor make Delaware quietly attractive."],
  MD: ["Maryland", 15.00, "$22 - $31/hr", "2.00% - 5.75%", "6.00%", "High", "$850 - $1,500/mo", "$420 - $820", 70, "Good wages near major metros, with rent and local taxes to watch."],
  VA: ["Virginia", 12.41, "$20 - $29/hr", "2.00% - 5.75%", "5.30%", "Medium", "$750 - $1,300/mo", "$430 - $820", 70, "Solid wages and moderate taxes make Virginia a balanced option."],
  WV: ["West Virginia", 8.75, "$16 - $23/hr", "2.22% - 4.82%", "6.00%", "Low", "$450 - $800/mo", "$310 - $650", 55, "Low living costs help, but job variety is more limited."],
  NC: ["North Carolina", 7.25, "$18 - $26/hr", "4.25%", "4.75%", "Medium", "$650 - $1,100/mo", "$360 - $760", 60, "Growing job markets, though the low wage floor rewards careful employer choice."],
  SC: ["South Carolina", 7.25, "$16 - $24/hr", "0.00% - 6.20%", "6.00%", "Low", "$600 - $1,000/mo", "$300 - $680", 54, "Beach tourism can help, but baseline wages remain low."],
  GA: ["Georgia", 7.25, "$18 - $26/hr", "5.39%", "4.00%", "Medium", "$700 - $1,250/mo", "$350 - $760", 58, "Many jobs around Atlanta and tourism areas, but wage floor is weak."],
  FL: ["Florida", 14.00, "$18 - $27/hr", "No state income tax", "6.00%", "High", "$800 - $1,550/mo", "$460 - $900", 77, "Tourism jobs and no income tax are strong; rent is the main fight."],
  AK: ["Alaska", 11.91, "$21 - $31/hr", "No state income tax", "0.00%", "High", "$850 - $1,500/mo", "$420 - $860", 68, "High wages and no state tax, but logistics and prices can surprise students."],
  HI: ["Hawaii", 14.00, "$20 - $30/hr", "1.40% - 11.00%", "4.00%", "Very high", "$1,000 - $1,900/mo", "$180 - $650", 50, "Dream location, difficult savings math unless housing is secured early."],
};

const fipsToCode = {
  "01": "AL",
  "02": "AK",
  "04": "AZ",
  "05": "AR",
  "06": "CA",
  "08": "CO",
  "09": "CT",
  10: "DE",
  12: "FL",
  13: "GA",
  15: "HI",
  16: "ID",
  17: "IL",
  18: "IN",
  19: "IA",
  20: "KS",
  21: "KY",
  22: "LA",
  23: "ME",
  24: "MD",
  25: "MA",
  26: "MI",
  27: "MN",
  28: "MS",
  29: "MO",
  30: "MT",
  31: "NE",
  32: "NV",
  33: "NH",
  34: "NJ",
  35: "NM",
  36: "NY",
  37: "NC",
  38: "ND",
  39: "OH",
  40: "OK",
  41: "OR",
  42: "PA",
  44: "RI",
  45: "SC",
  46: "SD",
  47: "TN",
  48: "TX",
  49: "UT",
  50: "VT",
  51: "VA",
  53: "WA",
  54: "WV",
  55: "WI",
  56: "WY",
};

const elements = {
  stateLayer: document.querySelector("#stateLayer"),
  mapLoading: document.querySelector("#mapLoading"),
  mapTip: document.querySelector("#mapTip"),
  stateName: document.querySelector("#stateName"),
  stateVerdict: document.querySelector("#stateVerdict"),
  survivalScore: document.querySelector("#survivalScore"),
  scoreFill: document.querySelector("#scoreFill"),
  minWage: document.querySelector("#minWage"),
  avgWage: document.querySelector("#avgWage"),
  incomeTax: document.querySelector("#incomeTax"),
  salesTax: document.querySelector("#salesTax"),
  costLevel: document.querySelector("#costLevel"),
  rentRange: document.querySelector("#rentRange"),
  savings: document.querySelector("#savings"),
  quickWage: document.querySelector("#quickWage"),
  quickTax: document.querySelector("#quickTax"),
  quickScore: document.querySelector("#quickScore"),
};

let activeState = "NJ";

function scoreClass(score) {
  if (score >= 72) return "high";
  if (score >= 60) return "mid";
  return "low";
}

function money(value) {
  return `$${value.toFixed(2)}/hr`;
}

function showTip(event, code) {
  const [name, minimumWage, , , , , , , score] = stateData[code];
  const bounds = event.currentTarget.ownerSVGElement.getBoundingClientRect();

  elements.mapTip.innerHTML = `${name}<br><span>${money(minimumWage)} minimum wage | ${score}/100</span>`;
  elements.mapTip.classList.add("visible");
  elements.mapTip.style.left = `${event.clientX - bounds.left + 14}px`;
  elements.mapTip.style.top = `${event.clientY - bounds.top + 14}px`;
}

function hideTip() {
  elements.mapTip.classList.remove("visible");
}

function selectState(code) {
  activeState = code;
  const [name, minimumWage, averageWage, incomeTax, salesTax, cost, rent, savings, score, verdict] = stateData[code];

  elements.stateName.textContent = name;
  elements.stateVerdict.textContent = verdict;
  elements.survivalScore.textContent = score;
  elements.scoreFill.style.width = `${score}%`;
  elements.minWage.textContent = money(minimumWage);
  elements.avgWage.textContent = averageWage;
  elements.incomeTax.textContent = incomeTax;
  elements.salesTax.textContent = salesTax;
  elements.costLevel.textContent = cost;
  elements.rentRange.textContent = rent;
  elements.savings.textContent = savings;
  elements.quickWage.textContent = money(minimumWage);
  elements.quickTax.textContent = incomeTax.includes("No") ? "No income tax" : `${incomeTax} tax`;
  elements.quickScore.textContent = `${score}/100`;

  document.querySelectorAll(".state-shape").forEach((state) => {
    const isActive = state.dataset.state === code;
    state.classList.toggle("active", isActive);
    state.setAttribute("aria-pressed", String(isActive));
  });
}

async function drawMap() {
  const map = await d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json");
  const states = topojson
    .feature(map, map.objects.states)
    .features
    .map((feature) => ({
      ...feature,
      code: fipsToCode[String(feature.id).padStart(2, "0")],
    }))
    .filter((feature) => stateData[feature.code]);

  const projection = d3.geoAlbersUsa().fitSize([975, 610], {
    type: "FeatureCollection",
    features: states,
  });
  const path = d3.geoPath(projection);
  const layer = d3.select(elements.stateLayer);

  layer
    .selectAll("path")
    .data(states)
    .join("path")
    .attr("class", (feature) => `state-shape ${scoreClass(stateData[feature.code][8])}`)
    .attr("d", path)
    .attr("data-state", (feature) => feature.code)
    .attr("tabindex", "0")
    .attr("role", "button")
    .attr("aria-pressed", "false")
    .attr("aria-label", (feature) => {
      const data = stateData[feature.code];
      return `${data[0]}: WAT score ${data[8]} out of 100`;
    })
    .on("mouseenter", (event, feature) => {
      selectState(feature.code);
      showTip(event, feature.code);
    })
    .on("mousemove", (event, feature) => showTip(event, feature.code))
    .on("mouseleave", hideTip)
    .on("focus", (event, feature) => selectState(feature.code))
    .on("click", (event, feature) => selectState(feature.code));

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
  selectState(activeState);
}

drawMap().catch(() => {
  elements.mapLoading.textContent = "Map could not load. Check your internet connection and refresh.";
});

selectState(activeState);
