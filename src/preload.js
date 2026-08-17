const { contextBridge, ipcRenderer } = require("electron");

// Expose a minimal, safe API to the renderer (contextIsolation is enabled).
contextBridge.exposeInMainWorld("electronAPI", {
  // Opens the native OS file picker for opening a file. Resolves with a path
  // relative to the markdown root (the root is repointed to the file's folder),
  // or null if the user cancelled.
  openSystemDialog: () => ipcRenderer.invoke("select-file"),

  // Opens the native OS file picker for linking. Resolves with the chosen file's
  // path relative to the current markdown root (root is NOT changed), or null.
  openLinkDialog: () => ipcRenderer.invoke("select-link-target"),

  // Creates a new .md file via the native "Save" dialog. Resolves with the
  // created file's absolute path, null if cancelled, or { error } on failure.
  createFile: () => ipcRenderer.invoke("create-file"),

  // Dodaj tę linię:
  openInDefaultEditor: (path) => ipcRenderer.invoke("open-in-default-editor", path)
});

