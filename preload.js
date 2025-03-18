const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  convertPdf: (filePath) => ipcRenderer.invoke('convert-pdf', filePath),
});
