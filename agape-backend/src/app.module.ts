import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CampañaModule } from './campaña/campaña.module';
import { UsuarioModule } from './usuario/usuario.module';
import { DonacionModule } from './donacion/donacion.module';

@Module({
  imports: [CampañaModule, UsuarioModule, DonacionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
