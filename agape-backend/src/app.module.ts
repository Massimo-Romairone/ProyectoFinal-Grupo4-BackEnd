import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampañaModule } from './campaña/campaña.module';
import { UsuarioModule } from './usuario/usuario.module';
import { DonacionModule } from './donacion/donacion.module';
import { AuthModule } from './auth/auth.module';
import { MercadoPagoModule } from './mercado-pago/mercado-pago.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
      autoLoadEntities: true,
      synchronize: false,
    }),
    CampañaModule, UsuarioModule, DonacionModule, AuthModule, MercadoPagoModule
  ],
  providers: [],
})
export class AppModule {}