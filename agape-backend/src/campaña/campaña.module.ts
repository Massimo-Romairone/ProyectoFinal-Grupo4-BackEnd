import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campaña } from './entities/campaña.entity';
import { CampañaService } from './campaña.service';
import { CampañaController } from './campaña.controller';
import { UsuarioModule } from '../usuario/usuario.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Campaña]),
    forwardRef(() => UsuarioModule),
  ],
  controllers: [CampañaController],
  providers: [CampañaService],
  exports: [CampañaService],
})
export class CampañaModule {}
