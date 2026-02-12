const { app, BrowserWindow, globalShortcut, ipcMain } = require("electron");
const path = require("path");

let win;
let visible = true;
let locked = false;

function applyLockState() {
  if (locked) {
    win.setIgnoreMouseEvents(true, { forward: true });
  } else {
    win.setIgnoreMouseEvents(false);
  }
  win.webContents.send("lock-state", locked);
}

app.whenReady().then(() => {
  win = new BrowserWindow({
    width: 1920,
    height: 1080,
    x: 0,
    y: 0,
    frame: false,
    transparent: true,
    resizable: true,
    alwaysOnTop: true,
    hasShadow: false,
    skipTaskbar: true,
    focusable: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true
    }
  });

  
  win.setAlwaysOnTop(true, "scree-saver");
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  win.loadFile("index.html");

  // 최초 로딩시 창 잠금 상태 (클릭 허용)
  win.once("ready-to-show", () => {
    applyLockState();
  });

  // Ctrl+F11: 표시/숨김
  globalShortcut.register("Ctrl+F11", () => {
    visible = !visible;
    if (visible) win.showInactive();
    else win.hide();
  });

  // Ctrl+F12: 창 잠금/해제
  globalShortcut.register("Ctrl+F12", () => {
    locked = !locked;
    // 창 잠금 해제시 화면 포커스 받도록 처리 (슬라이더/드래그 조작)
    win.setFocusable(!locked);
    if(!locked) win.show();
    applyLockState();
  });

  ipcMain.on("app-quit", () => {
    app.quit();
  });

  // renderer 에서 "잠금 켜줘" 같은 요청을 받을 수 있게
  ipcMain.on("set-locked", (_, v) => {
    locked = !!v;
    win.setFocusable(!locked);
    applyLockState();
  });
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});
