import express from 'express';
import { createServer } from 'http';
import locationsRouter from './routes/locations.ts';
import { setupWebSocket } from './websocket.ts';
import { config } from '../../shared/config.ts';

const expressApp = express();
const httpServer = createServer(expressApp);
const PORT: number = config.ports.backend;

// Enable CORS for dev mode (Angular/React on different ports)
expressApp.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

expressApp.use(express.json());

expressApp.use('/api/locations', locationsRouter);

setupWebSocket(httpServer);

httpServer.listen(PORT, '0.0.0.0', (): void => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log(`WebSocket server ready`);
});

