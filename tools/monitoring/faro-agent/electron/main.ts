import { app, BrowserWindow } from 'electron';
import { join } from 'path';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { registerRoutes } from './routes';

const SERVER_PORT = process.env.SERVER_PORT ? parseInt(process.env.SERVER_PORT) : 3010;
const VITE_PORT = process.env.VITE_PORT ? parseInt(process.env.VITE_PORT) : 5173;

let mainWindow: BrowserWindow | null = null;
let server: any = null;

async function startServer() {
  server = Fastify({ logger: false });
  await server.register(cors);
  await registerRoutes(server);
  await server.listen({ port: SERVER_PORT, host: '127.0.0.1' });
  console.log(`✓ Server running on http://localhost:${SERVER_PORT}`);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: join(__dirname, '../preload/preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 15, y: 15 }
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL(`http://localhost:${VITE_PORT}`);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  await startServer();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('before-quit', async () => {
  if (server) await server.close();
});
