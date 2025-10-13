import express from 'express';
import type { Request, Response } from 'express';
import { createServer } from 'http';
import locationsRouter from './routes/locations.ts';
import prisma from '../database/prisma.ts';
import { renderLocationsPage } from './views/renderLocations.ts';
import { setupWebSocket } from './websocket.ts';
import type { Location } from '../../shared/interfaces.ts';
import { config } from '../../shared/config.ts';

const expressApp = express();
const httpServer = createServer(expressApp);
const PORT: number = config.ports.backend;

// Enable CORS for Angular
expressApp.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', `http://localhost:${config.ports.frontend}`);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

expressApp.use(express.json());

expressApp.use('/api/locations', locationsRouter);

expressApp.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const locations: Location[] = await prisma.location.findMany();
    const html: string = renderLocationsPage(locations);
    res.send(html);
  } catch (err: unknown) {
    console.error(err);
    res.status(500).send('Database error');
  }
});

setupWebSocket(httpServer);

httpServer.listen(PORT, (): void => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`WebSocket server ready`);
});

