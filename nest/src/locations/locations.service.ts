import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LocationsGateway } from './locations.gateway';
import { CreateLocationDto } from './dto/create-location.dto';
import { GenerateLocationsDto } from './dto/generate-locations.dto';
import type { Location } from '../../../shared/interfaces';

@Injectable()
export class LocationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: LocationsGateway,
  ) {}

  findAll(): Promise<Location[]> {
    return this.prisma.location.findMany({ orderBy: { id: 'asc' } });
  }

  async findOne(id: number): Promise<Location> {
    const location = await this.prisma.location.findUnique({ where: { id } });
    if (!location) throw new NotFoundException('Location not found');
    return location;
  }

  async create(dto: CreateLocationDto): Promise<Location[]> {
    const location = await this.prisma.location.create({ data: dto });
    this.gateway.emitLocationsCreated([location]);
    return [location];
  }

  async generate(dto: GenerateLocationsDto): Promise<Location[]> {
    const startTime = Date.now();

    const data = Array.from({ length: dto.n }, () => {
      const lat = Math.random() * 180 - 90;
      const lon = Math.random() * 360 - 180;
      return {
        name: `Random Location ${lat.toFixed(0)} ${lon.toFixed(0)}`,
        lat,
        lon,
      };
    });

    const locations = await this.prisma.location.createManyAndReturn({ data });

    const duration = Date.now() - startTime;
    console.log(
      `✨ Generated ${dto.n} locations in ${duration}ms (${(duration / 1000).toFixed(2)}s)`,
    );

    this.gateway.emitLocationsCreated(locations);
    return locations;
  }

  async deleteAll(): Promise<{ message: string; count: number }> {
    const result = await this.prisma.location.deleteMany();
    this.gateway.emitLocationDeleted({});
    return { message: 'All locations deleted', count: result.count };
  }

  async deleteOne(
    id: number,
  ): Promise<{ message: string; location: Location }> {
    try {
      const location = await this.prisma.location.delete({ where: { id } });
      this.gateway.emitLocationDeleted({ id });
      return { message: 'Location deleted', location };
    } catch (err: any) {
      if (err?.code === 'P2025') {
        throw new NotFoundException('Location not found');
      }
      throw err;
    }
  }
}
