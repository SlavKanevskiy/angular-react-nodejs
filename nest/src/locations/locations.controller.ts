import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { GenerateLocationsDto } from './dto/generate-locations.dto';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get()
  findAll() {
    return this.locationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.locationsService.findOne(id);
  }

  @Post()
  @HttpCode(201)
  create(@Body() dto: CreateLocationDto) {
    return this.locationsService.create(dto);
  }

  @Post('generate')
  @HttpCode(201)
  generate(@Body() dto: GenerateLocationsDto) {
    return this.locationsService.generate(dto);
  }

  @Delete()
  deleteAll() {
    return this.locationsService.deleteAll();
  }

  @Delete(':id')
  deleteOne(@Param('id', ParseIntPipe) id: number) {
    return this.locationsService.deleteOne(id);
  }
}
