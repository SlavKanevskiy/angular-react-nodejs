import { Test, TestingModule } from '@nestjs/testing';
import { LocationsController } from './locations.controller';
import { LocationsService } from './locations.service';

const mockLocation = { id: 1, name: 'Test', lat: 48.85, lon: 2.29 };

const mockService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  generate: jest.fn(),
  deleteAll: jest.fn(),
  deleteOne: jest.fn(),
};

describe('LocationsController', () => {
  let controller: LocationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocationsController],
      providers: [{ provide: LocationsService, useValue: mockService }],
    }).compile();

    controller = module.get<LocationsController>(LocationsController);
    jest.clearAllMocks();
  });

  it('findAll delegates to service', async () => {
    mockService.findAll.mockResolvedValue([mockLocation]);
    const result = await controller.findAll();
    expect(result).toEqual([mockLocation]);
    expect(mockService.findAll).toHaveBeenCalledTimes(1);
  });

  it('findOne delegates to service with parsed id', async () => {
    mockService.findOne.mockResolvedValue(mockLocation);
    const result = await controller.findOne(1);
    expect(result).toEqual(mockLocation);
    expect(mockService.findOne).toHaveBeenCalledWith(1);
  });

  it('create delegates to service with dto', async () => {
    const dto = { name: 'Test', lat: 48.85, lon: 2.29 };
    mockService.create.mockResolvedValue([mockLocation]);
    const result = await controller.create(dto);
    expect(result).toEqual([mockLocation]);
    expect(mockService.create).toHaveBeenCalledWith(dto);
  });

  it('generate delegates to service with dto', async () => {
    mockService.generate.mockResolvedValue([mockLocation]);
    const result = await controller.generate({ n: 1 });
    expect(result).toEqual([mockLocation]);
    expect(mockService.generate).toHaveBeenCalledWith({ n: 1 });
  });

  it('deleteAll delegates to service', async () => {
    mockService.deleteAll.mockResolvedValue({
      message: 'All locations deleted',
      count: 3,
    });
    const result = await controller.deleteAll();
    expect(result).toEqual({ message: 'All locations deleted', count: 3 });
    expect(mockService.deleteAll).toHaveBeenCalledTimes(1);
  });

  it('deleteOne delegates to service with parsed id', async () => {
    mockService.deleteOne.mockResolvedValue({
      message: 'Location deleted',
      location: mockLocation,
    });
    const result = await controller.deleteOne(1);
    expect(result).toEqual({
      message: 'Location deleted',
      location: mockLocation,
    });
    expect(mockService.deleteOne).toHaveBeenCalledWith(1);
  });
});
