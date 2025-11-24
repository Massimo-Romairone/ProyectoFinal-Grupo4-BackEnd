import { Controller, Post, Body, UsePipes, ValidationPipe, Res, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { MercadoPagoService } from './mercado-pago.service';
import { CreatePreferenceDto } from './dto/create-preference.dto';
import { DonacionService } from 'src/donacion/donacion.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('mercadopago')
export class MercadoPagoController {
  constructor(
    private readonly mercadoPagoService: MercadoPagoService,
    private readonly donacionService: DonacionService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('create_preference')
  @UsePipes(new ValidationPipe())
  async createPreference(@Body() createPreferenceDto: CreatePreferenceDto, @Req() req) {
    
    const userId = req.user.id_Usuario;
    console.log("Usuario solicitando pago:", userId);

    const preference = await this.mercadoPagoService.crearPreferencia(
      createPreferenceDto.amount,
      createPreferenceDto.campaignId,
      userId,
    );

    return {
      url: preference.init_point, 
    };
  }

  @Post('webhook')
  async handleWebhook(@Body() body: any, @Res() res) {
    const topic = body.topic || body.type;
    
    if (topic === 'payment') {
      const paymentId = body.data.id;
      
      // 1. Consultamos a Mercado Pago
      const infoPago = await this.mercadoPagoService.checkPayment(paymentId);
      
      if (infoPago.status === 'approved') {
        console.log(`✅ PAGO APROBADO! Guardando en BD...`);

        const idUsuarioReal = infoPago.userId;
        
        try {
          // LLAMAMOS AL NUEVO MÉTODO
          await this.donacionService.createDonacionMercadoPago(
            infoPago.monto || 0,
            Number(infoPago.campaniaId),
            paymentId,
            Number(infoPago.userId || 0)
          );
          
          console.log("💾 Donación guardada exitosamente.");
        } catch (error) {
          console.error("Error guardando en BD:", error);
        }
      }
    }
    res.status(HttpStatus.OK).send('OK');
  }
}