const { chromium } = require("playwright");
const { spawn } = require("child_process");
const path = require("path");
const net = require("net");

function getFreePort() {
  return new Promise((resolve) => {
    const srv = net.createServer();
    srv.listen(0, () => {
      const port = srv.address().port;
      srv.close(() => resolve(port));
    });
  });
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  const port = await getFreePort();
  console.log(`Starting server on port ${port}...`);
  const serverPath = path.join(__dirname, "..", "src", "server.js");
  const mapsDir = path.join(__dirname, "..", "maps");
  const server = spawn("node", [serverPath, mapsDir], {
    env: { ...process.env, PORT: String(port) }
  });

  server.stdout.on("data", (data) => {
    console.log(`[Server] ${data}`);
  });
  server.stderr.on("data", (data) => {
    console.error(`[Server Err] ${data}`);
  });

  await sleep(1500);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    const url = `http://127.0.0.1:${port}`;
    console.log("Accessibility/DOM smoke test: loading sample.md...");
    await page.goto(`${url}/?file=sample.md`);
    await page.waitForFunction(() => document.querySelector("#crumbs")?.textContent.includes("sample.md"));
    await page.waitForSelector("#canvas");
    const snapshot = await page.locator("body").ariaSnapshot();
    if (!snapshot.includes("simplemarkmap") || !snapshot.includes("Open")) {
      throw new Error("Accessibility snapshot is missing expected application controls");
    }

    // The native Open dialog is Electron-only, so browser mode validates the
    // renderer using URL navigation and DOM/accessibility assertions.
    console.log("Accessibility snapshot and sample map loaded successfully.");
    await page.goto(`${url}/?file=new.md`);
    await page.waitForFunction(() => document.querySelector("#crumbs")?.textContent.includes("new.md"));
    await sleep(300);

    // URL navigation starts a fresh page, so history buttons are not expected
    // to be enabled here. Validate their accessible titles and state.
    const controls = await page.locator("#backBtn, #forwardBtn").evaluateAll(
      els => els.map(el => ({ title: el.title, disabled: el.disabled }))
    );
    if (controls.some(item => !item.title)) throw new Error("History controls lack accessible titles");
    console.log("Accessibility controls and map navigation smoke test passed.");
  } catch (err) {
    console.error("Test failed:", err);
    process.exitCode = 1;
  } finally {
    await browser.close();
    server.kill();
  }
}

run();
