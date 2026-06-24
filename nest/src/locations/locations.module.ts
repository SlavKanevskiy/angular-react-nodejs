import { Module } from '@nestjs/common';
import { LocationsController } from './locations.controller';
import { LocationsService } from './locations.service';
import { LocationsGateway } from './locations.gateway';

@Module({
  controllers: [LocationsController],
  providers: [LocationsService, LocationsGateway],
})
export class LocationsModule {}
