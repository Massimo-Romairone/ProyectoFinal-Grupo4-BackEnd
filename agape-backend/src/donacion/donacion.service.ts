import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDonacionDto } from './dto/create-donacion.dto';
import { UpdateDonacionDto } from './dto/update-donacion.dto';
import { Donacion } from './entities/donacion.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuarioService } from 'src/usuario/usuario.service';
import { CampañaService } from 'src/campaña/campaña.service';

@Injectable()
export class DonacionService {
  constructor(
    @InjectRepository(Donacion)
    private donacionRepository: Repository<Donacion>,
    private usuarioService: UsuarioService,
    private campañaService: CampañaService
  ){}

  async create(createDonacionDto: CreateDonacionDto, id_usuario: number, id_campania: number): Promise<Donacion> {
    try{
      const usuario = await this.usuarioService.findOne(id_usuario);
      if (!usuario) throw new Error('Usuario no encontrado');

      const campaña = await this.campañaService.findOne(id_campania);
      if (!campaña) throw new Error('Campaña no encontrada');

      createDonacionDto.fecha = createDonacionDto.fecha ? createDonacionDto.fecha : new Date().toISOString();

      const nueva = this.donacionRepository.create({
        ...createDonacionDto,
        usuario,
        campania: campaña
      });

      return this.donacionRepository.save(nueva);
      
    }catch(error){
      throw new Error('Error al crear la donacion');
    }
  }

  // Nuevo método específico para el Webhook
  async createDonacionMercadoPago(monto: number, id_campania: number, paymentId: string, idUsuario: number): Promise<Donacion> {
    try {
      console.log(`💾 Procesando donación de MP: $${monto} para campaña ${id_campania}`);

      // 1. Buscamos la campaña
      const campaña = await this.campañaService.findOne(id_campania);
      if (!campaña) throw new Error('Campaña no encontrada para la donación');

      const usuario = await this.usuarioService.findOne(idUsuario); 
      // Opcional: validar si existe usuario

      // 2. Creamos la entidad
      const nuevaDonacion = this.donacionRepository.create({
        monto: Number(monto),
        fecha: new Date().toISOString(),
        usuario: usuario,
        campania: campaña,
        // paymentId: paymentId 
      });

      // 🚨 AQUÍ ESTABA EL ERROR: Faltaba guardar y asignar a la variable
      const donacionGuardada = await this.donacionRepository.save(nuevaDonacion);

      // 3. Actualizamos el recaudado de la campaña
      const montoActual = Number(campaña.recaudado) || 0;
      const montoNuevo = Number(monto);

      campaña.recaudado = montoActual + montoNuevo;

      // Guardamos la campaña actualizada
      // Asegúrate de tener este método en tu CampañaService (ver abajo)
      await this.campañaService.updateRecaudado(campaña); 

      console.log(`📈 Campaña actualizada. Nuevo total: $${campaña.recaudado}`);

      return donacionGuardada;

    } catch (error) {
      console.error("Error al procesar donación:", error);
      // Es buena idea relanzar el error o manejarlo según tu lógica
      throw error; 
    }
  }

  async findAll(): Promise<Donacion[]> {
    return this.donacionRepository.find();
  }

  async findOne(id: number): Promise<Donacion> {
    const donacion = await this.donacionRepository.findOne({
      where: {id_donacion: id},
      relations: [],
    })

    if(!donacion) {
      throw new NotFoundException(`No se encontró la donacion con el ID ${id}`);
    }

    return donacion;
  }

  update(id: number, updateDonacionDto: UpdateDonacionDto) {
    return `This action updates a #${id} donacion`;
  }

  remove(id: number) {
    return `This action removes a #${id} donacion`;
  }
}
