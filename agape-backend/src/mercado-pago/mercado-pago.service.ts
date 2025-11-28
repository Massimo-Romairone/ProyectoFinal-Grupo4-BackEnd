import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';

@Injectable()
export class MercadoPagoService {
  constructor(private configService: ConfigService) {}

  async crearPreferencia(monto: number, idCampania: string, userId: number, tokenDelVendedor: string) {
    try {
      const client = new MercadoPagoConfig({
        accessToken: tokenDelVendedor,
      });

      const preference = new Preference(client);

      const result = await preference.create({
        body: {
          items: [
            {
              id: idCampania,
              title: `Donación Campaña ${idCampania}`,
              unit_price: Number(monto),
              quantity: 1,
              currency_id: 'ARS',
            },
          ],
          
          back_urls: {
            success: 'MP_SUCCESS_URL',
            failure: 'MP_FAILURE_URL',
            pending: 'MP_PENDING_URL',
          },

          metadata: {
            user_id: userId,
            campaign_id: idCampania,
          },
          
          auto_return: 'approved',
          notification_url: 'https://proyectofinal-grupo4-backend.onrender.com/mercadopago/webhook',
          external_reference: idCampania,
        },
      });

      return result; 

    } catch (error) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(
          error.message || 'Error al conectar con Mercado Pago',
        );
      }
      throw new InternalServerErrorException('Error al conectar con Mercado Pago');
    }
  }

  async checkPayment(paymentId: string) {
    try {
      const client = new MercadoPagoConfig({
        accessToken: this.configService.getOrThrow<string>('MERCADOPAGO_ACCESS_TOKEN'),
      });

      const payment = new Payment(client);
      const paymentData = await payment.get({ id: paymentId });

      return {
        status: paymentData.status,
        status_detail: paymentData.status_detail, 
        monto: paymentData.transaction_amount,
        userId: paymentData.metadata.user_id,
        campaniaId: paymentData.external_reference, 
        date: paymentData.date_created
      };

    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException("Error al consultar el pago");
    }
  }
}