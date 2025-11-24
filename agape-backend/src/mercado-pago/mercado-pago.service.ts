import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';

@Injectable()
export class MercadoPagoService {
  constructor(private configService: ConfigService) {}

  async crearPreferencia(monto: number, idCampania: string, userId: number) {
    try {
      const client = new MercadoPagoConfig({
        accessToken: this.configService.getOrThrow<string>('MERCADOPAGO_ACCESS_TOKEN'),
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
            success: 'https://kolten-ascogonial-rascally.ngrok-free.dev/pago-exitoso',
            failure: 'https://kolten-ascogonial-rascally.ngrok-free.dev/pago-fallido',
            pending: 'https://kolten-ascogonial-rascally.ngrok-free.dev/pago-pendiente',
          },

          metadata: {
            user_id: userId,
            campaign_id: idCampania,
          },
          
          auto_return: 'approved',
          notification_url: 'https://kolten-ascogonial-rascally.ngrok-free.dev/mercadopago/webhook',
          external_reference: idCampania,
        },
      });

      return result; 

    } catch (error) {
      console.error('Error al crear la preferencia de Mercado Pago:', error);
      throw new InternalServerErrorException(
        error.message || 'Error al conectar con Mercado Pago',
      );
    }
  }

  async checkPayment(paymentId: string) {
    try {
      const client = new MercadoPagoConfig({
        accessToken: this.configService.getOrThrow<string>('MERCADOPAGO_ACCESS_TOKEN'),
      });

      const payment = new Payment(client);

      // Consultamos a MP los detalles de ese ID
      const paymentData = await payment.get({ id: paymentId });

      // Aquí tienes TODA la info del pago
      return {
        status: paymentData.status,           // ej: 'approved'
        status_detail: paymentData.status_detail, 
        monto: paymentData.transaction_amount,
        userId: paymentData.metadata.user_id,
        // IMPORTANTE: Aquí recuperamos el ID de la campaña que guardamos antes
        campaniaId: paymentData.external_reference, 
        date: paymentData.date_created
      };

    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException("Error al consultar el pago");
    }
  }
}