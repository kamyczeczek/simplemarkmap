// GUI test: right-click node -> "Link to file..." -> picker -> ONE relative
// link inserted. Mocks window.electronAPI.openLinkDialog() (the native dialog
// is Electron-only, so we stub the IPC in the renderer and drive the real flow).
const { chromium } = require("playwright");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const os = require("os");
const net = require("net");

function getFreePort() {
  return new Promise((resolve) => {
    const srv = net.createServer();
    srv.listen(0, () => { const port = srv.address().port; srv.close(() => resolve(port)); });
  });
}
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

(async () => {
  // Work on a throwaway copy so repeated runs never pollute tracked fixtures.
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "smm-"));
  fs.mkdirSync(tmpDir, { recursive: true });
  const file = path.join(tmpDir, "work.md");
  fs.writeFileSync(file, "## Playwright Child Node\n- gather sources\n");

  const port = await getFreePort();
  const server = spawn("node", [path.join(__dirname, "..", "src", "server.js"), tmpDir], {
    env: { ...process.env, PORT: String(port) }
  });
  server.stdout.on("data", d => console.log("[Server]", String(d).trim()));
  await sleep(1200);

  const targetFile = path.join(tmpDir, "target.md").replace(/\\/g, "\\\\");

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.on("pageerror", (e) => console.log("[PAGEERR]", e.message));
  await page.addInitScript((target) => {
    window.electronAPI = {
      openSystemDialog: async () => target,
      openLinkDialog: async () => {
        window.__dialogCalls = (window.__dialogCalls || 0) + 1;
        return target;
      },
    };
  }, targetFile);

  try {
    const url = `http://127.0.0.1:${port}/?file=work.md`;
    await page.goto(url);
    await page.waitForSelector("#canvas");
    await page.waitForFunction(() =>
      document.querySelector("#crumbs")?.textContent.includes("work.md"));

    const node = page.locator("#canvas .mnode:not(.root) .title").first();
    await node.click({ button: "right" });
    const ctxLink = page.locator("#ctxLink");
    await ctxLink.waitFor({ state: "visible" });
    await ctxLink.click();

    await page.waitForFunction((expected) => {
      const t = document.querySelector("#canvas .mnode:not(.root) .title");
      const a = t && t.querySelector(".md-link");
      return a && a.getAttribute("data-link").replace(/\\/g, "/").toLowerCase().endsWith(expected);
    }, "target.md", { timeout: 8000 });

    const result = await page.evaluate(() => {
      const t = document.querySelector("#canvas .mnode:not(.root) .title");
      const links = t ? t.querySelectorAll(".md-link") : [];
      return {
        dialogCalls: window.__dialogCalls,
        text: t ? t.textContent : null,
        linkCount: links.length,
        dataLinks: [...links].map(a => a.getAttribute("data-link")),
      };
    });

    console.log("dialogCalls:", result.dialogCalls);
    console.log("linkCount:", result.linkCount);
    console.log("text:", JSON.stringify(result.text));
    console.log("dataLinks:", JSON.stringify(result.dataLinks));

    if (result.dialogCalls !== 1) throw new Error("openLinkDialog invoked more than once");
    if (result.linkCount !== 1) throw new Error("expected exactly one link, got " + result.linkCount);
    const href = result.dataLinks[0].replace(/\\/g, "/");
    if (!href.toLowerCase().endsWith("target.md")) throw new Error("wrong target link: " + href);
    console.log("OK: exactly one relative link inserted via 'Link to file…'.");
  } catch (err) {
    console.error("Test failed:", err.stack || err);
    process.exitCode = 1;
  } finally {
    await browser.close();
    server.kill();
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
})();