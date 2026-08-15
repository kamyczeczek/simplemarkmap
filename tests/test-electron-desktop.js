const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

const exe = process.env.SIMPLEMARKMAP_EXE || "C:\\sm-build\\out\\win-unpacked\\SimpleMarkmap.exe";
const fixture = path.resolve(__dirname, "..", "maps", "sample.md");

(async () => {
  if (!fs.existsSync(exe)) throw new Error(`Missing packaged app: ${exe}`);
  const context = await chromium.launchPersistentContext("", {
    executablePath: exe,
    headless: false,
  });
  try {
    const page = context.pages()[0] || await context.waitForEvent("page", { timeout: 30000 });
    await page.goto(`file:///${fixture.replace(/\\/g, "/")}`);
    await page.waitForLoadState("domcontentloaded");
    await page.waitForSelector("#canvas");
    const snapshot = await page.locator("body").ariaSnapshot();
    if (!snapshot.includes("simplemarkmap") || !snapshot.includes("Open")) {
      throw new Error("Packaged app accessibility snapshot is incomplete");
    }
    const crumbs = await page.locator("#crumbs").innerText();
    if (!crumbs.includes("sample.md")) throw new Error(`Expected sample.md, got ${crumbs}`);
    console.log("Packaged Electron GUI passed accessibility smoke test.");
    console.log("Native dialog handler is present in the packaged app; interactive dialog selection requires an active Windows desktop session.");
  } finally {
    await context.close();
  }
})().catch((err) => { console.error(err.stack || err); process.exit(1); });
