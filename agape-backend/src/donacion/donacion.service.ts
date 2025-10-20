import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDonacionDto } from './dto/create-donacion.dto';
import { UpdateDonacionDto } from './dto/update-donacion.dto';
import { Donacion } from './entities/donacion.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DonacionService {
  constructor(
    @InjectRepository(Donacion)
    private donacionRepository: Repository<Donacion>
  ){}

  create(createDonacionDto: CreateDonacionDto) {
    return 'This action adds a new donacion';
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
