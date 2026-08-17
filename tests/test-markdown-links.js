const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const net = require('net');
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const port = await new Promise(resolve => { const s = net.createServer(); s.listen(0, () => { const p = s.address().port; s.close(() => resolve(p)); }); });
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'smm-links-'));
  fs.writeFileSync(path.join(dir, 'work.md'), '# Root\n- [Raport (final)](../docs/Raport%20(final).md)\n');
  fs.writeFileSync(path.join(dir, 'work.md'), '# Root\n## [Raport (final)](../docs/Raport%20(final).md)\n');
  const server = spawn(process.execPath, [path.join(__dirname, '..', 'src', 'server.js'), dir], { env: { ...process.env, PORT: String(port) } });
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    page.on('pageerror', error => console.error('[PAGEERR]', error.message));
    await page.goto(`http://127.0.0.1:${port}/?file=work.md`);
    await page.waitForSelector('#canvas');
    await sleep(1000);
    const result = await page.locator('.md-link').first().evaluate(a => ({ text: a.textContent, link: a.dataset.link }));
    if (result.text !== 'Raport (final)' || result.link !== '../docs/Raport%20(final).md') throw new Error(JSON.stringify(result));
    console.log('OK: Markdown links preserve parentheses, spaces and encoded URLs');
  } finally {
    await browser.close(); server.kill(); fs.rmSync(dir, { recursive: true, force: true });
  }
})().catch(err => { console.error(err.stack || err); process.exitCode = 1; });
