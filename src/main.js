const path = require('node:path');
const { app, BrowserWindow, ipcMain, Menu, nativeImage, screen, Tray } = require('electron');

let petWindow;
let tray;
let dragOrigin;
let dragTimer;
let currentScale = 1;
let currentLanguage = 'zh';

const trayCopy = {
  zh: { name: '洛琪希桌宠', toggle: '显示 / 隐藏', reset: '回到右下角', quit: '退出' },
  ja: { name: 'ロキシー・デスクトップペット', toggle: '表示 / 非表示', reset: '右下に戻す', quit: '終了' },
  en: { name: 'Roxy Desktop Pet', toggle: 'Show / Hide', reset: 'Move to bottom right', quit: 'Quit' }
};

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
}

function createWindow() {
  const display = screen.getPrimaryDisplay();
  const { width, height } = windowSizeForScale(currentScale);

  petWindow = new BrowserWindow({
    width,
    height,
    x: display.workArea.x + display.workArea.width - width - 28,
    y: display.workArea.y + display.workArea.height - height - 18,
    transparent: true,
    frame: false,
    resizable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    hasShadow: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  petWindow.setAlwaysOnTop(true, 'floating');
  petWindow.loadFile(path.join(__dirname, 'index.html'));
  petWindow.on('closed', () => {
    stopWindowDrag();
    petWindow = undefined;
  });
}

function stopWindowDrag() {
  if (dragTimer) clearInterval(dragTimer);
  dragTimer = undefined;
  dragOrigin = undefined;
}

function windowSizeForScale(scale) {
  const characterSize = Math.round(320 * scale);
  return {
    width: characterSize + 70,
    height: characterSize + 125
  };
}

function resizeWindow(scale) {
  if (!petWindow) return;
  currentScale = Math.min(1.4, Math.max(0.7, Number(scale) || 1));

  const oldBounds = petWindow.getBounds();
  const nextSize = windowSizeForScale(currentScale);
  const anchorX = oldBounds.x + oldBounds.width / 2;
  const anchorBottom = oldBounds.y + oldBounds.height;
  const workArea = screen.getDisplayMatching(oldBounds).workArea;

  const x = Math.max(
    workArea.x,
    Math.min(Math.round(anchorX - nextSize.width / 2), workArea.x + workArea.width - nextSize.width)
  );
  const y = Math.max(
    workArea.y,
    Math.min(Math.round(anchorBottom - nextSize.height), workArea.y + workArea.height - nextSize.height)
  );

  petWindow.setBounds({ x, y, ...nextSize }, true);
}

function createTray() {
  const icon = nativeImage.createFromDataURL(
    'data:image/svg+xml;base64,' +
      Buffer.from(`
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64">
          <circle cx="32" cy="32" r="29" fill="#77bfe8"/>
          <path d="M16 29 Q32 10 48 29 L44 48 Q32 56 20 48Z" fill="#d9f3ff"/>
          <circle cx="25" cy="34" r="3" fill="#31556c"/>
          <circle cx="39" cy="34" r="3" fill="#31556c"/>
          <path d="M28 42 Q32 45 36 42" fill="none" stroke="#31556c" stroke-width="2"/>
        </svg>`
      ).toString('base64')
  );

  tray = new Tray(icon.resize({ width: 32, height: 32 }));
  updateTrayMenu();
  tray.on('double-click', () => petWindow?.show());
}

function updateTrayMenu() {
  if (!tray) return;
  const copy = trayCopy[currentLanguage];
  tray.setToolTip(copy.name);
  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: copy.toggle,
        click: () => {
          if (!petWindow) createWindow();
          else petWindow.isVisible() ? petWindow.hide() : petWindow.show();
        }
      },
      { label: copy.reset, click: moveToBottomRight },
      { type: 'separator' },
      { label: copy.quit, click: () => app.quit() }
    ])
  );
}

function moveToBottomRight() {
  if (!petWindow) return;
  const display = screen.getDisplayMatching(petWindow.getBounds());
  const { width, height } = petWindow.getBounds();
  petWindow.setPosition(
    display.workArea.x + display.workArea.width - width - 28,
    display.workArea.y + display.workArea.height - height - 18
  );
  petWindow.show();
}

ipcMain.on('pet:drag-start', () => {
  if (!petWindow) return;
  stopWindowDrag();
  dragOrigin = {
    point: screen.getCursorScreenPoint(),
    bounds: petWindow.getBounds()
  };
  dragTimer = setInterval(() => {
    if (!petWindow || !dragOrigin) return;
    const point = screen.getCursorScreenPoint();
    const x = dragOrigin.bounds.x + point.x - dragOrigin.point.x;
    const y = dragOrigin.bounds.y + point.y - dragOrigin.point.y;
    petWindow.setPosition(x, y);
  }, 16);
});

ipcMain.on('pet:drag-end', stopWindowDrag);

ipcMain.on('pet:hide', () => {
  stopWindowDrag();
  petWindow?.hide();
});
ipcMain.on('pet:quit', () => app.quit());
ipcMain.on('pet:set-scale', (_event, scale) => resizeWindow(scale));
ipcMain.on('pet:set-language', (_event, language) => {
  if (!Object.hasOwn(trayCopy, language)) return;
  currentLanguage = language;
  updateTrayMenu();
});

if (gotTheLock) {
  app.on('second-instance', () => {
    if (!petWindow) createWindow();
    petWindow.show();
    petWindow.focus();
  });

  app.whenReady().then(() => {
    createWindow();
    createTray();
  });
}

app.on('window-all-closed', (event) => event.preventDefault());
