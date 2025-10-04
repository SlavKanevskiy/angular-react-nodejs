import express from 'express';
import type { Request, Response } from 'express';
import pool from '../../database/db.ts';

const router = express.Router();

interface Location {
  id: number;
  name: string;
  lat: number;
  lon: number;
}

interface CreateLocationBody {
  name: string;
  lat: number;
  lon: number;
}

// GET все геоточки
router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await pool.query<Location>('SELECT * FROM locations ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET одну точку по ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query<Location>('SELECT * FROM locations WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST создать точку
router.post('/', async (req: Request<{}, {}, CreateLocationBody>, res: Response) => {
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

    const result = await pool.query<Location>(
      'INSERT INTO locations (name, lat, lon) VALUES ($1, $2, $3) RETURNING *',
      [name, lat, lon]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST генерировать n случайных точек
router.post('/generate', async (req: Request<{}, {}, { n: number }>, res: Response) => {
  try {
    const { n } = req.body;

    if (!n || n <= 0 || n > 1000) {
      return res.status(400).json({ error: 'n must be between 1 and 1000' });
    }

    const startTime = Date.now();

    // Генерируем данные
    const values: any[] = [];
    const placeholders: string[] = [];

    for (let i = 0; i < n; i++) {
      const lat = Math.random() * 180 - 90;
      const lon = Math.random() * 360 - 180;
      const name = `Random Location ${Math.round(lat)}-${Math.round(lon)}`;

      values.push(name, lat, lon);
      placeholders.push(`($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3})`);
    }

    // Один массовый INSERT
    const query = `INSERT INTO locations (name, lat, lon) VALUES ${placeholders.join(', ')} RETURNING *`;
    const result = await pool.query<Location>(query, values);

    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`✨ Сгенерировано ${n} точек за ${duration}ms (${(duration / 1000).toFixed(2)}s)`);

    res.status(201).json({ created: n, locations: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// DELETE удалить все точки
router.delete('/', async (req: Request, res: Response) => {
  try {
    const result = await pool.query<Location>('DELETE FROM locations RETURNING *');
    res.json({ message: 'All locations deleted', count: result.rows.length, deleted: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// DELETE удалить точку
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query<Location>('DELETE FROM locations WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }

    res.json({ message: 'Location deleted', location: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;

