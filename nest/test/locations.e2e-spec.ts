import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

const mockLocation = { id: 1, name: 'Eiffel Tower', lat: 48.85, lon: 2.29 };

const mockPrisma = {
  location: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    createManyAndReturn: jest.fn(),
    deleteMany: jest.fn(),
    delete: jest.fn(),
  },
  $connect: jest.fn(),
  $disconnect: jest.fn(),
};

describe('Locations API (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => jest.clearAllMocks());

  describe('GET /api/locations', () => {
    it('returns all locations', async () => {
      mockPrisma.location.findMany.mockResolvedValue([mockLocation]);
      const res = await request(app.getHttpServer()).get('/api/locations');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([mockLocation]);
    });

    it('returns empty array when no locations', async () => {
      mockPrisma.location.findMany.mockResolvedValue([]);
      const res = await request(app.getHttpServer()).get('/api/locations');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  describe('GET /api/locations/:id', () => {
    it('returns a single location', async () => {
      mockPrisma.location.findUnique.mockResolvedValue(mockLocation);
      const res = await request(app.getHttpServer()).get('/api/locations/1');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockLocation);
    });

    it('returns 404 when not found', async () => {
      mockPrisma.location.findUnique.mockResolvedValue(null);
      const res = await request(app.getHttpServer()).get('/api/locations/99');
      expect(res.status).toBe(404);
    });

    it('returns 400 for non-numeric id', async () => {
      const res = await request(app.getHttpServer()).get('/api/locations/abc');
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/locations', () => {
    it('creates a location and returns 201', async () => {
      mockPrisma.location.create.mockResolvedValue(mockLocation);
      const res = await request(app.getHttpServer())
        .post('/api/locations')
        .send({ name: 'Eiffel Tower', lat: 48.85, lon: 2.29 });
      expect(res.status).toBe(201);
      expect(res.body).toEqual([mockLocation]);
    });

    it('returns 400 when name is missing', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/locations')
        .send({ lat: 48.85, lon: 2.29 });
      expect(res.status).toBe(400);
    });

    it('returns 400 when lat is out of range', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/locations')
        .send({ name: 'Test', lat: 91, lon: 0 });
      expect(res.status).toBe(400);
    });

    it('returns 400 when lon is out of range', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/locations')
        .send({ name: 'Test', lat: 0, lon: 181 });
      expect(res.status).toBe(400);
    });

    it('returns 400 when body is empty', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/locations')
        .send({});
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/locations/generate', () => {
    it('generates locations and returns 201', async () => {
      const generated = [mockLocation, { ...mockLocation, id: 2 }];
      mockPrisma.location.createManyAndReturn.mockResolvedValue(generated);
      const res = await request(app.getHttpServer())
        .post('/api/locations/generate')
        .send({ n: 2 });
      expect(res.status).toBe(201);
      expect(res.body).toHaveLength(2);
    });

    it('returns 400 when n is 0', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/locations/generate')
        .send({ n: 0 });
      expect(res.status).toBe(400);
    });

    it('returns 400 when n exceeds 10000', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/locations/generate')
        .send({ n: 10001 });
      expect(res.status).toBe(400);
    });

    it('returns 400 when n is not an integer', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/locations/generate')
        .send({ n: 1.5 });
      expect(res.status).toBe(400);
    });
  });

  describe('DELETE /api/locations', () => {
    it('deletes all locations and returns count', async () => {
      mockPrisma.location.deleteMany.mockResolvedValue({ count: 3 });
      const res = await request(app.getHttpServer()).delete('/api/locations');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'All locations deleted', count: 3 });
    });
  });

  describe('DELETE /api/locations/:id', () => {
    it('deletes a location by id', async () => {
      mockPrisma.location.delete.mockResolvedValue(mockLocation);
      const res = await request(app.getHttpServer()).delete('/api/locations/1');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        message: 'Location deleted',
        location: mockLocation,
      });
    });

    it('returns 404 when location not found', async () => {
      const err = Object.assign(new Error(), { code: 'P2025' });
      mockPrisma.location.delete.mockRejectedValue(err);
      const res = await request(app.getHttpServer()).delete(
        '/api/locations/99',
      );
      expect(res.status).toBe(404);
    });

    it('returns 400 for non-numeric id', async () => {
      const res = await request(app.getHttpServer()).delete(
        '/api/locations/abc',
      );
      expect(res.status).toBe(400);
    });
  });
});
