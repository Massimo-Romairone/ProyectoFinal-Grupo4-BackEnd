import { Controller, Post, Body, UsePipes, ValidationPipe, Res, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { MercadoPagoService } from './mercado-pago.service';
import { CreatePreferenceDto } from './dto/create-preference.dto';
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

    const tokenDelVendedor = "APP_USR-2860217832775391-112615-37fbc7dd695661cd2a4109a23662e6b9-3007735118";

    console.log("Usando token hardcodeado");

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