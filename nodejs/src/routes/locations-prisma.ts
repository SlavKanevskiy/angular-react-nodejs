import express from 'express';
import type { Request, Response } from 'express';
import prisma from '../../database/prisma.ts';

const router = express.Router();

interface Location {
  name: string;
  lat: number;
  lon: number;
}

// GET все геоточки
router.get('/', async (req: Request, res: Response) => {
  try {
    const locations = await prisma.location.findMany({
      orderBy: { id: 'asc' }
    });
    res.json(locations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET одну точку по ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const location = await prisma.location.findUnique({
      where: { id: parseInt(id) }
    });

    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }

    res.json(location);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST создать точку
router.post('/', async (req: Request<{}, {}, Location>, res: Response) => {
  try {
    const { name, lat, lon } = req.body;

    if (!name || lat === undefined || lon === undefined) {
      return res.status(400).json({ error: 'Name, lat and lon are required' });
    }

    // Валидация координат
    if (lat < -90 || lat > 90) {
      return res.status(400).json({ error: 'Lat must be between -90 and 90' });
    }
    if (lon < -180 || lon > 180) {
      return res.status(400).json({ error: 'Lon must be between -180 and 180' });
    }

    const location = await prisma.location.create({
      data: { name, lat, lon }
    });

    res.status(201).json(location);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST генерировать n случайных точек
router.post('/generate', async (req: Request<{}, {}, { n: number }>, res: Response) => {
  try {
    const { n } = req.body;

    if (!n || n <= 0 || n > 10000) {
      return res.status(400).json({ error: 'n must be between 1 and 10000' });
    }

    const startTime = Date.now();

    // Генерируем данные
    const data: Location[] = [];
    for (let i = 0; i < n; i++) {
      const lat = Math.random() * 180 - 90;
      const lon = Math.random() * 360 - 180;
      const name = `Random Location ${Math.round(lat)} ${Math.round(lon)}`;
      data.push({ name, lat, lon });
    }

    // Массовая вставка через Prisma
    await prisma.location.createMany({ data });

    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`✨ Prisma: Сгенерировано ${n} точек за ${duration}ms (${(duration / 1000).toFixed(2)}s)`);

    res.status(201).json({ created: n });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// DELETE удалить все точки
router.delete('/', async (req: Request, res: Response) => {
  try {
    const result = await prisma.location.deleteMany();
    res.json({ message: 'All locations deleted', count: result.count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// DELETE удалить точку
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const location = await prisma.location.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Location deleted', location });
  } catch (err: unknown) {
    if (err instanceof Error && 'code' in err && err.code === 'P2025') {
      return res.status(404).json({ error: 'Location not found' });
    }
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;

