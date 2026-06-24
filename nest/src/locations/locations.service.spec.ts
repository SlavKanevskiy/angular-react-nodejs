import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { LocationsService } from './locations.service';
import { PrismaService } from '../prisma/prisma.service';
import { LocationsGateway } from './locations.gateway';

const mockLocation = { id: 1, name: 'Test', lat: 48.85, lon: 2.29 };

const mockPrisma = {
  location: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    createManyAndReturn: jest.fn(),
    deleteMany: jest.fn(),
    delete: jest.fn(),
  },
};

const mockGateway = {
  emitLocationsCreated: jest.fn(),
  emitLocationDeleted: jest.fn(),
};

describe('LocationsService', () => {
  let service: LocationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: LocationsGateway, useValue: mockGateway },
      ],
    }).compile();

    service = module.get<LocationsService>(LocationsService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('returns all locations ordered by id', async () => {
      mockPrisma.location.findMany.mockResolvedValue([mockLocation]);
      const result = await service.findAll();
      expect(result).toEqual([mockLocation]);
      expect(mockPrisma.location.findMany).toHaveBeenCalledWith({
        orderBy: { id: 'asc' },
      });
    });
  });

  describe('findOne', () => {
    it('returns a location when found', async () => {
      mockPrisma.location.findUnique.mockResolvedValue(mockLocation);
      const result = await service.findOne(1);
      expect(result).toEqual(mockLocation);
      expect(mockPrisma.location.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('throws NotFoundException when not found', async () => {
      mockPrisma.location.findUnique.mockResolvedValue(null);
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('creates a location, emits WS event, and returns array', async () => {
      const dto = { name: 'Test', lat: 48.85, lon: 2.29 };
      mockPrisma.location.create.mockResolvedValue(mockLocation);

      const result = await service.create(dto);

      expect(result).toEqual([mockLocation]);
      expect(mockPrisma.location.create).toHaveBeenCalledWith({ data: dto });
      expect(mockGateway.emitLocationsCreated).toHaveBeenCalledWith([
        mockLocation,
      ]);
    });
  });

  describe('generate', () => {
    it('generates n random locations, emits WS event, and returns them', async () => {
      const generated = Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        name: `Random Location 0 0`,
        lat: 0,
        lon: 0,
      }));
      mockPrisma.location.createManyAndReturn.mockResolvedValue(generated);

      const result = await service.generate({ n: 5 });

      expect(result).toHaveLength(5);
      const firstCall = mockPrisma.location.createManyAndReturn.mock
        .calls[0][0] as { data: { name: string; lat: number; lon: number }[] };
      expect(firstCall.data).toHaveLength(5);
      expect(firstCall.data[0]).toMatchObject({
        name: expect.stringContaining('Random Location') as string,
        lat: expect.any(Number) as number,
        lon: expect.any(Number) as number,
      });
      expect(mockGateway.emitLocationsCreated).toHaveBeenCalledWith(generated);
    });

    it('generates correct number of data items', async () => {
      mockPrisma.location.createManyAndReturn.mockResolvedValue([]);
      await service.generate({ n: 100 });
      const passedData = (
        mockPrisma.location.createManyAndReturn.mock.calls[0][0] as {
          data: unknown[];
        }
      ).data;
      expect(passedData).toHaveLength(100);
    });

    it('generates lat in [-90, 90] and lon in [-180, 180]', async () => {
      mockPrisma.location.createManyAndReturn.mockResolvedValue([]);
      await service.generate({ n: 50 });
      const passedData = (
        mockPrisma.location.createManyAndReturn.mock.calls[0][0] as {
          data: { lat: number; lon: number }[];
        }
      ).data;
      for (const item of passedData) {
        expect(item.lat).toBeGreaterThanOrEqual(-90);
        expect(item.lat).toBeLessThanOrEqual(90);
        expect(item.lon).toBeGreaterThanOrEqual(-180);
        expect(item.lon).toBeLessThanOrEqual(180);
      }
    });
  });

  describe('deleteAll', () => {
    it('deletes all locations, emits WS event, returns count', async () => {
      mockPrisma.location.deleteMany.mockResolvedValue({ count: 3 });

      const result = await service.deleteAll();

      expect(result).toEqual({ message: 'All locations deleted', count: 3 });
      expect(mockGateway.emitLocationDeleted).toHaveBeenCalledWith({});
    });
  });

  describe('deleteOne', () => {
    it('deletes a location, emits WS event with id, returns location', async () => {
      mockPrisma.location.delete.mockResolvedValue(mockLocation);

      const result = await service.deleteOne(1);

      expect(result).toEqual({
        message: 'Location deleted',
        location: mockLocation,
      });
      expect(mockPrisma.location.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockGateway.emitLocationDeleted).toHaveBeenCalledWith({ id: 1 });
    });

    it('throws NotFoundException on Prisma P2025 error', async () => {
      const prismaNotFound = Object.assign(new Error('Not found'), {
        code: 'P2025',
      });
      mockPrisma.location.delete.mockRejectedValue(prismaNotFound);

      await expect(service.deleteOne(99)).rejects.toThrow(NotFoundException);
      expect(mockGateway.emitLocationDeleted).not.toHaveBeenCalled();
    });

    it('rethrows unknown errors', async () => {
      const unknownError = new Error('DB connection error');
      mockPrisma.location.delete.mockRejectedValue(unknownError);

      await expect(service.deleteOne(1)).rejects.toThrow('DB connection error');
    });
  });
});
