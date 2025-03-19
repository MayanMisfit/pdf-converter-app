const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const pdf = require('pdf-parse');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
  });

  mainWindow.loadFile('index.html');

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.handle('convert-pdf', async (event, filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('Error converting PDF:', error);
    throw error;
  }
});

ipcMain.handle('save-txt', async (event, content) => {
  const { canceled, filePath } = await dialog.showSaveDialog({
    title: 'Save Converted Text as TXT',
    defaultPath: 'converted.txt',
    filters: [
      { name: 'Text Files', extensions: ['txt'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });

  if (canceled || !filePath) {
    return { success: false };
  }

  try {
    fs.writeFileSync(filePath, content, 'utf8');
    return { success: true };
  } catch (error) {
    console.error('Error writing TXT file:', error);
    return { success: false };
  }
});

ipcMain.handle('save-md', async (event, content) => {
  const { canceled, filePath } = await dialog.showSaveDialog({
    title: 'Save Converted Text as Markdown',
    defaultPath: 'converted.md',
    filters: [
      { name: 'Markdown Files', extensions: ['md'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });

  if (canceled || !filePath) {
    return { success: false };
  }

  try {
    fs.writeFileSync(filePath, content, 'utf8');
    return { success: true };
  } catch (error) {
    console.error('Error writing Markdown file:', error);
    return { success: false };
  }
});