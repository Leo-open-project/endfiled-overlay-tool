const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("overlayApi", {
    setLocked: (v) => ipcRenderer.send("set-locked", v),
    onLockState: (cb) => ipcRenderer.on("lock-state", (_, v) => cb(v)),
    quit: () => ipcRenderer.send("app-quit")
});