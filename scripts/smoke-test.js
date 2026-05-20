const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1365, height: 900 } });
  const errors = [];

  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("http://127.0.0.1:8000/?v=functionality-pass", {
    waitUntil: "domcontentloaded",
    timeout: 45000,
  });
  await page.waitForTimeout(2500);

  const initial = await page.evaluate(() => ({
    state: document.querySelector("#stateName")?.textContent,
    compareRows: document.querySelectorAll("#comparisonBody tr").length,
    rankingCards: document.querySelectorAll(".ranking-card").length,
    routeStops: document.querySelectorAll(".route-timeline-stop").length,
    final: document.querySelector("#summaryHeadline")?.textContent,
  }));

  await page.selectOption("#stateSelect", "TX");
  await page.click(".student-type-card:nth-child(4)");
  await page.fill("#hoursPerWeek", "52");
  await page.fill("#logHours", "8");
  await page.fill("#logTips", "35");
  await page.fill("#logSpending", "22");
  await page.fill("#logCity", "Austin");
  await page.fill("#logBestMoment", "First real test log");
  await page.click("button.log-submit");
  await page.click("[data-add-location=\"optional\"]");
  await page.click("#generateShareCard");
  await page.waitForTimeout(800);

  const after = await page.evaluate(() => ({
    state: document.querySelector("#stateName")?.textContent,
    calcState: document.querySelector("#calcState")?.value,
    selectedType: [...document.querySelectorAll(".student-type-card")]
      .find((button) => button.classList.contains("active"))?.textContent,
    memoryItems: document.querySelectorAll(".memory-item").length,
    liveProjected: document.querySelector("#liveProjectedSavings")?.textContent,
    route: document.querySelector("#optimizedRoute")?.textContent,
    posterGenerated: document.querySelector("#sharePoster")?.classList.contains("is-generated"),
    stored: Boolean(localStorage.getItem("wat-app-state-v1")),
  }));

  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);

  const persisted = await page.evaluate(() => {
    const stored = JSON.parse(localStorage.getItem("wat-app-state-v1") || "{}");
    return {
      state: document.querySelector("#stateName")?.textContent,
      calcState: document.querySelector("#calcState")?.value,
      memoryItems: document.querySelectorAll(".memory-item").length,
      storedState: stored.selectedState,
      logs: stored.dailyLogs?.length || 0,
      posterGenerated: document.querySelector("#sharePoster")?.classList.contains("is-generated"),
    };
  });

  await browser.close();

  console.log(JSON.stringify({ initial, after, persisted, errors }, null, 2));
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
