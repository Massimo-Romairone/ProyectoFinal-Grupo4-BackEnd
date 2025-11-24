import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampañaModule } from './campaña/campaña.module';
import { UsuarioModule } from './usuario/usuario.module';
import { DonacionModule } from './donacion/donacion.module';
import { AuthModule } from './auth/auth.module';
import { MercadoPagoService } from './mercado-pago/mercado-pago.service';
import { MercadoPagoModule } from './mercado-pago/mercado-pago.module';
// import { MercadoPagoModule } from './mercado-pago/mercado-pago.module';
// import { MercadoPagoService } from './mercado-pago/mercado-pago.service';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: "postgresql://postgres.zbjnnacinotlinkdpybl:1234@aws-1-us-east-1.pooler.supabase.com:5432/postgres",
      ssl: {
        rejectUnauthorized: false,
      },
      autoLoadEntities: true,
      synchronize: true,
    }),
    CampañaModule, UsuarioModule, DonacionModule, AuthModule, MercadoPagoModule
  ],
  providers: [],
})
export class AppModule {}