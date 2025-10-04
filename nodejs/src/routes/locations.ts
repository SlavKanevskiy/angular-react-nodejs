import express from 'express';
import type { Request, Response } from 'express';
import prisma from '../../database/prisma.ts';
import type { Location } from '../../../shared/interfaces.ts';

const router = express.Router();

type CreateLocation = Omit<Location, 'id'>;

// GET all locations
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const locations: Location[] = await prisma.location.findMany({
      orderBy: { id: 'asc' }
    });
    res.json(locations);
  } catch (err: unknown) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET single location by ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const location: Location | null = await prisma.location.findUnique({
      where: { id: parseInt(id, 10) }
    });

    if (!location) {
      res.status(404).json({ error: 'Location not found' });
      return;
    }

    res.json(location);
  } catch (err: unknown) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST create new location
router.post('/', async (req: Request<{}, {}, CreateLocation>, res: Response): Promise<void> => {
  try {
    const { name, lat, lon } = req.body;

    if (!name || lat === undefined || lon === undefined) {
      res.status(400).json({ error: 'Name, lat and lon are required' });
      return;
    }

    // Validate coordinates
    if (lat < -90 || lat > 90) {
      res.status(400).json({ error: 'Lat must be between -90 and 90' });
      return;
    }
    if (lon < -180 || lon > 180) {
      res.status(400).json({ error: 'Lon must be between -180 and 180' });
      return;
    }

    const location: Location = await prisma.location.create({
      data: { name, lat, lon }
    });

    res.status(201).json(location);
  } catch (err: unknown) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST generate n random locations
router.post('/generate', async (req: Request<{}, {}, { n: number }>, res: Response): Promise<void> => {
  try {
    const { n } = req.body;

    if (!n || n <= 0 || n > 10000) {
      res.status(400).json({ error: 'n must be between 1 and 10000' });
      return;
    }

    const startTime = Date.now();

    // Generate random location data
    const data: CreateLocation[] = [];
    for (let i = 0; i < n; i++) {
      const lat = Math.random() * 180 - 90;
      const lon = Math.random() * 360 - 180;
      const name = `Random Location ${Math.round(lat)} ${Math.round(lon)}`;
      data.push({ name, lat, lon });
    }

    // Bulk insert
    await prisma.location.createMany({ data });

    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`✨ Generated ${n} locations in ${duration}ms (${(duration / 1000).toFixed(2)}s)`);

    res.status(201).json({ created: n });
  } catch (err: unknown) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// DELETE all locations
router.delete('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await prisma.location.deleteMany();
    res.json({ message: 'All locations deleted', count: result.count });
  } catch (err: unknown) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// DELETE single location by ID
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const location: Location = await prisma.location.delete({
      where: { id: parseInt(id, 10) }
    });

    res.json({ message: 'Location deleted', location });
  } catch (err: unknown) {
    if (err instanceof Error && 'code' in err && err.code === 'P2025') {
      res.status(404).json({ error: 'Location not found' });
      return;
    }
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;

