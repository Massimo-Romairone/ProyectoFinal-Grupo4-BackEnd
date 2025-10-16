import { Module } from '@nestjs/common';
import { DonacionService } from './donacion.service';
import { DonacionController } from './donacion.controller';
import { Donacion } from './entities/donacion.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Donacion])],
  controllers: [DonacionController],
  providers: [DonacionService],
})
export class DonacionModule {}
