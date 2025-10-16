import { Module } from '@nestjs/common';
import { CampañaService } from './campaña.service';
import { CampañaController } from './campaña.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campaña } from './entities/campaña.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Campaña])],
  controllers: [CampañaController],
  providers: [CampañaService],
})
export class CampañaModule {}
