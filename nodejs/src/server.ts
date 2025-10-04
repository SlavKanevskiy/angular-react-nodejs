import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import locationsRouter from './routes/locations.ts';
import prisma from '../database/prisma.ts';
import { renderLocationsPage } from './views/renderLocations.ts';
import type { Location } from '../../shared/interfaces.ts';

dotenv.config();

const expressApp = express();
const PORT: number = Number(process.env.PORT) || 3000;

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

expressApp.listen(PORT, (): void => {
  console.log(`Server running on http://localhost:${PORT}`);
});

