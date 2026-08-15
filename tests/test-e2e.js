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
    console.log(`Navigating to ${url}...`);
    await page.goto(url);

    await page.waitForSelector("#picker:not(.hidden)");
    console.log("Opening sample.md...");
    await page.click("text=sample.md");
    await page.waitForFunction(() => document.querySelector('#picker').classList.contains('hidden'));
    await sleep(300);

    // Open picker again and open new.md
    console.log("Opening new.md...");
    await page.click("#openBtn");
    await page.waitForSelector("#picker:not(.hidden)");
    await page.click("text=new.md");
    await page.waitForFunction(() => document.querySelector('#picker').classList.contains('hidden'));
    await sleep(300);

    // Check back button is enabled and click it
    console.log("Clicking Back button...");
    const backDisabledBefore = await page.$eval("#backBtn", el => el.disabled);
    if (backDisabledBefore) throw new Error("Back button should be enabled");
    await page.click("#backBtn");
    await sleep(300);

    const crumbs1 = await page.$eval("#crumbs", el => el.textContent);
    console.log("Crumbs after back:", crumbs1);
    if (!crumbs1.includes("sample.md")) {
      throw new Error(`Expected crumbs to contain sample.md, got ${crumbs1}`);
    }

    // Check forward button is enabled and click it
    console.log("Clicking Forward button...");
    const forwardDisabledBefore = await page.$eval("#forwardBtn", el => el.disabled);
    if (forwardDisabledBefore) throw new Error("Forward button should be enabled");
    await page.click("#forwardBtn");
    await sleep(300);

    const crumbs2 = await page.$eval("#crumbs", el => el.textContent);
    console.log("Crumbs after forward:", crumbs2);
    if (!crumbs2.includes("new.md")) {
      throw new Error(`Expected crumbs to contain new.md, got ${crumbs2}`);
    }

    console.log("Navigation history (Back/Forward) tests passed successfully!");
  } catch (err) {
    console.error("Test failed:", err);
    process.exitCode = 1;
  } finally {
    await browser.close();
    server.kill();
  }
}

run();
