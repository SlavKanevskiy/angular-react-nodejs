import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import locationsRouter from './routes/locations-prisma.ts';
import pool from '../database/db.ts';
import { renderLocationsPage } from './views/renderLocations.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/locations', locationsRouter);

app.get('/', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM locations');
    const html = renderLocationsPage(result.rows);
    res.send(html);
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

