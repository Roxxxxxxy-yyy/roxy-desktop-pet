const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('petApp', {
  startDrag: () => ipcRenderer.send('pet:drag-start'),
  endDrag: () => ipcRenderer.send('pet:drag-end'),
  setScale: (scale) => ipcRenderer.send('pet:set-scale', scale),
  setLanguage: (language) => ipcRenderer.send('pet:set-language', language),
  hide: () => ipcRenderer.send('pet:hide'),
  quit: () => ipcRenderer.send('pet:quit')
});
