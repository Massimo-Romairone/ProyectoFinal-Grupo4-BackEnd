import { forwardRef, Module } from '@nestjs/common';
import { DonacionService } from './donacion.service';
import { DonacionController } from './donacion.controller';
import { Donacion } from './entities/donacion.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { CampañaModule } from 'src/campaña/campaña.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Donacion]), 
    forwardRef(() => UsuarioModule),
    forwardRef(() => CampañaModule),
  ],
  controllers: [DonacionController],
  providers: [DonacionService],
  exports: [DonacionService]
})
export class DonacionModule {}
