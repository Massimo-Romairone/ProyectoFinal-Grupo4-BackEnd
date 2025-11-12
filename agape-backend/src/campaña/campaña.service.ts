import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateCampañaDto } from './dto/create-campaña.dto';
import { UpdateCampañaDto } from './dto/update-campaña.dto';
import { Campaña } from './entities/campaña.entity';
import { UsuarioService } from '../usuario/usuario.service';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class CampañaService {
  private readonly logger = new Logger(CampañaService.name);

  constructor(
    @InjectRepository(Campaña)
    private campaniaRepository: Repository<Campaña>,
    private usuarioService: UsuarioService
  ){}

  async create(createDto: CreateCampañaDto, userId: number) {
    try {
      const usuario = await this.usuarioService.findOne(userId);
      if (!usuario) throw new Error('Usuario no encontrado');

      const nueva = this.campaniaRepository.create({
        ...createDto,
        usuario, // asigna la relación OneToOne
      });
      return this.campaniaRepository.save(nueva);
      
    } catch (error) {
      throw new InternalServerErrorException('Error al crear la campaña');
    } 
  }

  async findAll(): Promise<Campaña[]> {
    return this.campaniaRepository.find();
  }

  async findOne(id: number): Promise<Campaña> {
    const campania = await this.campaniaRepository.findOne({
      where: {id_campania: id},
      relations: [],
    });

    if (!campania) {
      throw new NotFoundException(`No se encontró la campaña con el ID ${id}`);
    }

    return campania;
  }

  async findOneBy(id: number): Promise<Campaña> {
    const campania = await this.campaniaRepository.findOne({
      where: {id_campania: id},
      relations: [],
    });

    if (!campania) {
      throw new NotFoundException(`No se encontró la campaña con el ID ${id}`);
    }

    return campania;
  }

  async findOneByOwner(id: number): Promise<Campaña> {
    const campania = await this.campaniaRepository.findOne({
      where: { usuario: { id_Usuario: id } },
      relations: ['usuario'],
    });

    if (!campania) {
      throw new NotFoundException(`No se encontró la campaña con el ID ${id}`);
    }

    return campania;
  }

  async update(id: number, updateCampañaDto: UpdateCampañaDto): Promise<Campaña> {
    try {
      const campania = await this.campaniaRepository.preload({
        id_campania: id,
        ...updateCampañaDto,
      });

      if (!campania) {
        this.logger.warn(`Intentando actualizar una campania que no existe: id=${id}`);
        throw new NotFoundException(`No se encontro la campaña con el ID ${id}`);
      }

      const campaniaGuardada = await this.campaniaRepository.save(campania);

      this.logger.log(`Campania actualizada: id=${id}`);

      return campaniaGuardada;
    } catch (error) {
      this.logger.error(`Error actualizando la campania: id=${id}`, error);
      throw new InternalServerErrorException('Error al actualizar la campaña');
    }
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    try {
      const resultado: DeleteResult = await this.campaniaRepository.delete({ id_campania: id });

      if (resultado.affected === 0) {
        this.logger.warn(`Intentando eliminar una campania que no existe: id=${id}`);
        throw new NotFoundException(`No se encontro la campaña con el ID ${id}`);
      }

      this.logger.log(`Campaña eliminada: id=${id}`);

      return { deleted: true };
    } catch (error) {
      this.logger.error(`Error eliminando la campania id=${id}`, error);
      throw new InternalServerErrorException('Error al eliminar la campaña');
    }
  }
}
