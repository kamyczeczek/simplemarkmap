const http = require("http");
const fs = require("fs").promises;
const fssync = require("fs");
const path = require("path");

// ----------------------------------------------------------------------
// Configuration
// ----------------------------------------------------------------------
// When run directly (node server.js <root>), argv[2] is the root.
// When required by the Electron main process, the caller passes the root.
function resolveArgvRoot() {
  // argv[1] is this script's path when executed directly; inside Electron it
  // is the Electron main script, so only trust argv[2] for the standalone run.
  const arg = process.argv[2];
  if (typeof arg !== "string") return arg;
  // A quoted drive root passed by Windows batch files can arrive as C:\\".
  // Strip accidental quote characters before resolving the configured root.
  let cleaned = arg.replace(/[\"]+$/g, "");
  if (/^[a-zA-Z]:$/.test(cleaned)) {
    cleaned += "\\";
  }
  return cleaned;
}

function defaultRoot() {
  // Root defaults to the directory where server.js lives, not the system root.
  // This keeps the picker scoped to a sensible location while still allowing
  // an explicit override via argv or SIMPLEMARKMAP_ROOT.
  return path.resolve(__dirname);
}

const ROOT = path.resolve(resolveArgvRoot() || process.env.SIMPLEMARKMAP_ROOT || defaultRoot());
const HOST = process.env.HOST || "127.0.0.1";                 // default loopback only
const PORT = Number(process.env.PORT || 8765);
const PUBLIC = path.join(__dirname, "public");
const PID_FILE = path.join(__dirname, ".simplemarkmap-server.pid");

// Safely create a directory: if a non-directory already occupies the path,
// remove it first. This avoids ENOTDIR when server.js is required from inside
// an asar archive (where __dirname points at app.asar, a file).
function ensureDir(dirPath) {
  try {
    const st = fssync.statSync(dirPath);
    if (st.isDirectory()) return;
    fssync.unlinkSync(dirPath);
  } catch (err) {
    if (err.code !== "ENOENT") throw err;
  }
  fssync.mkdirSync(dirPath, { recursive: true });
}

// Ensure the application directory exists. The workspace root may be an
// existing system directory such as C:\\ and must never be mkdir'ed/removed.
if (ROOT !== path.parse(ROOT).root) ensureDir(ROOT);
ensureDir(PUBLIC);

// Keep the launcher from accidentally reusing a server started for another
// folder. The markdown root is process-local; no files are copied into maps.
try { fssync.writeFileSync(PID_FILE, String(process.pid), "utf8"); } catch (_) {}
process.on("exit", () => {
  try {
    if (fssync.readFileSync(PID_FILE, "utf8") === String(process.pid)) fssync.unlinkSync(PID_FILE);
  } catch (_) {}
});

const MAX_BODY_SIZE = 1 * 1024 * 1024; // 1 MB

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
};

// ----------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------

/**
 * Custom error with HTTP status code.
 */
class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

/**
 * Lexically resolve a path inside a base directory and reject traversal.
 * Returns the absolute path.
 */
function resolveInside(base, relative) {
  const abs = path.resolve(base, relative);
  const rel = path.relative(base, abs);
  if (rel.startsWith("..") || path.isAbsolute(rel)) {
    throw new HttpError(400, "Path escapes base directory");
  }
  return abs;
}

/**
 * Ensure that the real (symlink‑resolved) path of an existing file
 * or its nearest existing ancestor stays within the real base directory.
 */
async function assertNoSymlinkEscape(base, absPath) {
  const realBase = await fs.realpath(base);

  let current = absPath;
  while (true) {
    try {
      const realCurrent = await fs.realpath(current);
      const rel = path.relative(realBase, realCurrent);
      if (rel.startsWith("..") || path.isAbsolute(rel)) {
        throw new HttpError(400, "Path escapes base directory via symlink");
      }
      return;
    } catch (err) {
      if (err.code === "ENOENT") {
        const parent = path.dirname(current);
        if (parent === current) break;
        current = parent;
        continue;
      }
      throw err; // other errors (EACCES, etc.)
    }
  }
  // This should never happen if base exists.
  throw new HttpError(500, "Could not resolve real path");
}

/**
 * Combined helper: lexical containment + symlink check.
 */
async function safeResolvePath(base, relative) {
  const abs = resolveInside(base, relative);
  await assertNoSymlinkEscape(base, abs);
  return abs;
}

// Electron and the Explorer launcher may provide an absolute path selected by
// the user. Such paths are intentionally allowed: the app is a local desktop
// editor, not a public file server. Relative paths remain sandboxed to ROOT.
async function resolveUserPath(file) {
  const value = String(file || "").replace(/^\/+/, "");
  if (path.isAbsolute(value)) return path.resolve(value);
  return safeResolvePath(ROOT, value);
}

/**
 * Read and parse JSON body with a size limit.
 */
function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    let size = 0;

    req.setEncoding("utf8");
    req.on("data", (chunk) => {
      size += Buffer.byteLength(chunk);
      if (size > MAX_BODY_SIZE) {
        reject(new HttpError(413, "Request body too large"));
        req.destroy();
        return;
      }
      data += chunk;
    });

    req.on("end", () => {
      try {
        const parsed = data ? JSON.parse(data) : {};
        if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
          reject(new HttpError(400, "JSON body must be an object"));
          return;
        }
        resolve(parsed);
      } catch (err) {
        reject(new HttpError(400, "Invalid JSON body"));
      }
    });

    req.on("error", (err) => reject(err));
  });
}

/**
 * Send a JSON response.
 */
function sendJson(res, status, obj) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(obj));
}

/**
 * Send an error response (generic message, hides internal details).
 */
function sendError(res, err) {
  const status = err instanceof HttpError ? err.status : 500;
  const message = status >= 500 ? "Internal server error" : err.message;
  if (status >= 500) console.error(err); // log full error server‑side
  sendJson(res, status, { error: message });
}

/**
 * Check if an Origin header is allowed for state‑changing requests.
 * If no Origin is present (e.g. curl), allow it because curl cannot be
 * used for CSRF from a browser.
 */
function isAllowedOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true; // non‑browser client
  const allowed = new Set([
    `http://localhost:${PORT}`,
    `http://127.0.0.1:${PORT}`,
    `http://${HOST}:${PORT}`,
  ]);
  return allowed.has(origin);
}

// ----------------------------------------------------------------------
// API route handlers (async)
// ----------------------------------------------------------------------
async function apiList(req, res, url) {
  if (req.method !== "GET") throw new HttpError(405, "Method not allowed");

  const dir = url.searchParams.get("dir") || ".";
  const abs = await safeResolvePath(ROOT, dir);

  let stat;
  try {
    stat = await fs.stat(abs);
  } catch (err) {
    if (err.code === "ENOENT") throw new HttpError(404, "Directory not found");
    throw err;
  }

  if (!stat.isDirectory()) throw new HttpError(400, "Not a directory");

  const items = await fs.readdir(abs, { withFileTypes: true });
  items.sort((a, b) => a.name.localeCompare(b.name));

  const result = items
    .filter((it) => it.name.endsWith(".md") || it.isDirectory())
    .map((it) => ({
      name: it.name,
      type: it.isDirectory() ? "dir" : "file",
      dir: path.relative(ROOT, abs).replace(/\\/g, "/") || ".",
    }));

  sendJson(res, 200, result);
}

async function apiRead(req, res, url) {
  if (req.method !== "GET") throw new HttpError(405, "Method not allowed");

  const file = url.searchParams.get("file") || "";
  if (!file.toLowerCase().endsWith(".md")) {
    throw new HttpError(400, "Only .md files can be read");
  }

  const abs = await resolveUserPath(file);

  try {
    const content = await fs.readFile(abs, "utf8");
    sendJson(res, 200, { path: path.normalize(abs), content });
  } catch (err) {
    if (err.code === "ENOENT") throw new HttpError(404, "File not found");
    throw err;
  }
}

async function apiWrite(req, res) {
  if (req.method !== "POST") throw new HttpError(405, "Method not allowed");
  if (!isAllowedOrigin(req)) throw new HttpError(403, "Forbidden origin");

  const body = await readBody(req);
  const file = String(body.file || "").replace(/^\//, "");
  if (!file.toLowerCase().endsWith(".md")) {
    throw new HttpError(400, "Only .md files can be written");
  }
  if (typeof body.content !== "string") {
    throw new HttpError(400, "content must be a string");
  }

  const abs = await resolveUserPath(file);

  // Ensure parent directory exists
  await fs.mkdir(path.dirname(abs), { recursive: true });

  await fs.writeFile(abs, body.content, "utf8");
  sendJson(res, 200, { ok: true, path: file });
}

// ----------------------------------------------------------------------
// Static file serving
// ----------------------------------------------------------------------
async function serveStatic(req, res, url) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    throw new HttpError(405, "Method not allowed");
  }

  const relPath = url.pathname === "/" ? "index.html" : url.pathname.replace(/^\/+/, "");
  const filePath = await safeResolvePath(PUBLIC, relPath);

  let stat;
  try {
    stat = await fs.stat(filePath);
  } catch (err) {
    if (err.code === "ENOENT") throw new HttpError(404, "Not found");
    throw err;
  }

  if (stat.isDirectory()) {
    // Attempt to serve index.html inside the directory
    const indexPath = path.join(filePath, "index.html");
    try {
      const indexStat = await fs.stat(indexPath);
      if (!indexStat.isFile()) throw new HttpError(404, "Not found");
      return serveFile(res, indexPath, indexStat);
    } catch (err) {
      throw new HttpError(404, "Not found");
    }
  }

  return serveFile(res, filePath, stat);
}

async function serveFile(res, filePath, stat) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME[ext] || "application/octet-stream";
  res.writeHead(200, {
    "Content-Type": contentType,
    "Content-Length": stat.size,
  });

  const stream = fssync.createReadStream(filePath);
  stream.on("error", (err) => {
    console.error(err);
    res.destroy(); // or end if headers not sent
  });
  stream.pipe(res);
}

// ----------------------------------------------------------------------
// Main server
// ----------------------------------------------------------------------
function createServer() {
  return http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${HOST}:${PORT}`);
    const p = url.pathname;

    try {
      if (p === "/api/list") return await apiList(req, res, url);
      if (p === "/api/read") return await apiRead(req, res, url);
      if (p === "/api/write") return await apiWrite(req, res);
      return await serveStatic(req, res, url);
    } catch (err) {
      sendError(res, err);
    }
  });
}

// Self-start only when executed directly (node server.js), not when required
// by the Electron main process (which reuses the bundled Node environment).
if (require.main === module) {
  const server = createServer();
  server.listen(PORT, HOST, () => {
    console.log(`simplemarkmap → http://${HOST}:${PORT}`);
    console.log(`markdown root  → ${ROOT}`);
  });
}

module.exports = { createServer, PORT, HOST, getRoot: () => ROOT };