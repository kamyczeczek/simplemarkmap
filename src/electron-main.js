const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const path = require("path");
const crypto = require("crypto");
const http = require("http");
const APP_DIR = path.resolve(__dirname, "..");

let mainWindow = null;
let pendingFile = null;

// ---------- SHA-256 Change Detection ----------
function getDocumentHash(markdownContent) {
  return crypto.createHash('sha256').update(markdownContent).digest('hex');
}
// ------------------------------------------------

function findFileArg(argv) {
  return argv.slice(1).find((arg) => arg && !arg.startsWith("--") && arg.toLowerCase().endsWith(".md"));
}

// Set the markdown root (used by server.js when it is required) to the folder
// of the launched .md file, or the default maps/ folder.
pendingFile = findFileArg(process.argv);
if (pendingFile) {
  // Keep the server root stable; selected files are passed as absolute paths.
  path.resolve(pendingFile);
}

// ---------- SHA-256 State Initialisation ----------
let initialHash = null;
if (pendingFile) {
  initialHash = getDocumentHash(""); // placeholder; real hash set after first load
}
// ------------------------------------------------

// IPC handler for system file dialog. Returns a path relative to the markdown
// root (which is updated to the chosen file's directory so the HTTP server can
// serve it), or null if the user cancelled.
ipcMain.handle("select-file", async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openFile"],
    filters: [
      { name: "Markdown documents", extensions: ["md"] },
      { name: "All files", extensions: ["*"] }
    ]
  });

  if (result.canceled || !result.filePaths.length) {
    return null;
  }

  const absoluteFile = path.resolve(result.filePaths[0]);
  // Keep the server root stable. The API accepts this explicit absolute path,
  // allowing files from any location without disrupting another open document.
  return absoluteFile;
});

// IPC handler for the "Link to file…" feature. Returns the chosen file's path
// relative to the CURRENT markdown root WITHOUT changing the root, so it can be
// inserted as a relative link from the currently open file.
ipcMain.handle("select-link-target", async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openFile"],
    filters: [
      { name: "Markdown documents", extensions: ["md"] },
      { name: "All files", extensions: ["*"] }
    ]
  });

  if (result.canceled || !result.filePaths.length) {
    return null;
  }

  const absoluteFile = path.resolve(result.filePaths[0]);
  // Return an absolute path so links may target any local folder. The renderer
  // computes a relative Markdown link where possible.
  return absoluteFile;
});

// IPC handler: pick a directory where the user wants to create a new .md file.
ipcMain.handle("select-directory", async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory", "createDirectory"],
    buttonLabel: "Choose folder"
  });
  if (result.canceled || !result.filePaths.length) {
    return null;
  }
  return path.resolve(result.filePaths[0]);
});

// IPC handler: create a new .md file. Opens the native "Save" dialog so the
// user picks the folder and file name, then writes an empty map. Returns the
// created file's absolute path or null if the user cancelled.
ipcMain.handle("create-file", async () => {
  const result = await dialog.showSaveDialog(mainWindow, {
    title: "Create a new markdown map",
    buttonLabel: "Create",
    defaultPath: "new.md",
    filters: [
      { name: "Markdown documents", extensions: ["md"] }
    ]
  });
  if (result.canceled || !result.filePath) {
    return null;
  }
  const absoluteFile = path.resolve(result.filePath);
  const name = path.basename(absoluteFile).replace(/\.md$/i, "") || "new";
  const fs = require("fs");
  try {
    fs.writeFileSync(absoluteFile, "# " + name + "\n", "utf8");
  } catch (err) {
    return { error: err.message };
  }
  return absoluteFile;
});

// Start the existing HTTP server in this process (Electron's bundled Node),
// so we never need a standalone node.exe on the user's machine.
const serverModule = require(path.join(__dirname, "server"));

const server = serverModule.createServer();
server.on("error", (err) => {
  if (err && err.code === "EADDRINUSE") {
    console.warn("Port " + serverModule.PORT + " already in use - reusing existing SimpleMarkmap server.");
  } else {
    dialog.showErrorBox("SimpleMarkmap", (err && err.message) || String(err));
  }
});
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
  // Keep the selected file absolute so the server can read any local path.
  const absoluteFile = path.resolve(filePath);
  return `http://127.0.0.1:${serverModule.PORT}/?file=${encodeURIComponent(absoluteFile)}`;
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
      preload: path.join(__dirname, "preload.js")
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