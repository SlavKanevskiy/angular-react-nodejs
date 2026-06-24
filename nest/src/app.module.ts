import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { LocationsModule } from './locations/locations.module';

@Module({
  imports: [PrismaModule, LocationsModule],
})
export class AppModule {}
