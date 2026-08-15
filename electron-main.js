const { app, BrowserWindow, dialog } = require("electron");
const path = require("path");
const http = require("http");

let mainWindow = null;
let pendingFile = null;

function findFileArg(argv) {
  return argv.slice(1).find((arg) => arg && !arg.startsWith("--") && arg.toLowerCase().endsWith(".md"));
}

// Set the markdown root (used by server.js when it is required) to the folder
// of the launched .md file, or the default maps/ folder.
pendingFile = findFileArg(process.argv);
if (pendingFile) {
  // Use the user's Documents folder as the workspace root when possible.
  // This lets the picker browse from the file's folder to its parent folders.
  const absoluteFile = path.resolve(pendingFile);
  const documentsRoot = path.resolve(app.getPath("documents"));
  const relativeToDocuments = path.relative(documentsRoot, absoluteFile);
  process.env.SIMPLEMARKMAP_ROOT = relativeToDocuments && !relativeToDocuments.startsWith("..")
    ? documentsRoot
    : path.dirname(absoluteFile);
}

const serverModule = require("./server");

// Start the existing HTTP server in this process (Electron's bundled Node),
// so we never need a standalone node.exe on the user's machine.
const server = serverModule.createServer();
server.listen(serverModule.PORT, serverModule.HOST, () => {
  console.log(`simplemarkmap → http://${serverModule.HOST}:${serverModule.PORT}`);
});

function waitForServer() {
  return new Promise((resolve, reject) => {
    const started = Date.now();
    const check = () => {
      const req = http.get(`http://127.0.0.1:${serverModule.PORT}/`, (res) => {
        res.resume();
        resolve();
      });
      req.on("error", () => {
        if (Date.now() - started > 10000) reject(new Error("simplemarkmap server did not start"));
        else setTimeout(check, 100);
      });
    };
    check();
  });
}

function fileUrl(filePath) {
  if (!filePath) return `http://127.0.0.1:${serverModule.PORT}/`;
  return `http://127.0.0.1:${serverModule.PORT}/?file=${encodeURIComponent(path.basename(filePath))}`;
}

async function openFile(filePath) {
  if (!mainWindow) return;
  try {
    await waitForServer();
    await mainWindow.loadURL(fileUrl(filePath));
  } catch (err) {
    dialog.showErrorBox("SimpleMarkmap", err.message);
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    title: "SimpleMarkmap",
    backgroundColor: "#10141b",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  openFile(pendingFile);
  mainWindow.on("closed", () => { mainWindow = null; });
}

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on("second-instance", (_event, argv) => {
    const filePath = findFileArg(argv);
    if (filePath) {
      process.env.SIMPLEMARKMAP_ROOT = path.dirname(path.resolve(filePath));
      openFile(path.resolve(filePath));
    }
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(() => {
    createWindow();
  });

  app.on("window-all-closed", () => app.quit());
  app.on("before-quit", () => {
    server.close();
  });
}
