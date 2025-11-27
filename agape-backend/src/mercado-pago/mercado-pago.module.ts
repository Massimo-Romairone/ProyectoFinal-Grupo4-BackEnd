import { Module } from '@nestjs/common';
import { MercadoPagoService } from './mercado-pago.service';
import { MercadoPagoController } from './mercado-pago.controller';
import { DonacionModule } from 'src/donacion/donacion.module';
import { CampañaModule } from 'src/campaña/campaña.module';

@Module({
  imports: [
    DonacionModule,
    CampañaModule
  ],
  controllers: [MercadoPagoController],
  providers: [MercadoPagoService],
  exports: [MercadoPagoService],
})
export class MercadoPagoModule {}
