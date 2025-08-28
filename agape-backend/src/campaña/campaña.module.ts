import { Module } from '@nestjs/common';
import { CampañaService } from './campaña.service';
import { CampañaController } from './campaña.controller';

@Module({
  controllers: [CampañaController],
  providers: [CampañaService],
})
export class CampañaModule {}
