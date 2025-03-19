const { contextBridge, ipcRenderer } = require('electron');

// Expose a safe API for the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  convertPDF: (filePath) => ipcRenderer.invoke('convert-pdf', filePath),
  saveTxt: (content) => ipcRenderer.invoke('save-txt', content),
  saveMd: (content) => ipcRenderer.invoke('save-md', content)
});