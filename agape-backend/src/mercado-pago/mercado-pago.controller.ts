import { Controller, Post, Body, UsePipes, ValidationPipe, Res, HttpStatus, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { MercadoPagoService } from './mercado-pago.service';
import { DonacionService } from 'src/donacion/donacion.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CampañaService } from 'src/campaña/campaña.service';

@Controller('mercadopago')
export class MercadoPagoController {
  constructor(
    private readonly mercadoPagoService: MercadoPagoService,
    private readonly donacionService: DonacionService,
    private readonly campañaService: CampañaService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('create_preference')
  @UsePipes(new ValidationPipe())
  async createPreference(@Body() body: any, @Req() req) {
    
    const userId = req.user.id_Usuario;

    const campaña = await this.campañaService.findOne(body.campaignId); 
    
    if (!campaña) {
        throw new Error("Campaña no encontrada");
    }

    const tokenDelVendedor = process.env.TOKEN_GENERAL_MUESTRA || '';

    if (!tokenDelVendedor) {
         throw new BadRequestException("No se pudo procesar el pago (Falta Token).");
    }

    const preference = await this.mercadoPagoService.crearPreferencia(
      body.amount,
      body.campaignId,
      userId,
      tokenDelVendedor
    );

    return {
      url: preference.init_point, 
    };
  }

  @Post('webhook')
  async handleWebhook(@Body() body: any, @Res() res) {
    const topic = body.topic || body.type;
    
    if (topic === 'payment') {
      const paymentId = body.data?.id || body.id;
      
      if (paymentId) {
        
        try {
          const infoPago = await this.mercadoPagoService.checkPayment(paymentId);
          
          if (infoPago.status === 'approved') {

            await this.donacionService.createDonacionMercadoPago(
              infoPago.monto || 0,
              Number(infoPago.campaniaId),
              paymentId,
              Number(infoPago.userId || 0)
            );
            
          }
        } catch (error) {
          console.error("Error procesando el pago:", error.message);
        }
      }
    }

    res.status(HttpStatus.OK).send('OK');
  }
}