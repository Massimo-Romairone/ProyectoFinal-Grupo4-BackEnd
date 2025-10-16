import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCampañaDto } from './dto/create-campaña.dto';
import { UpdateCampañaDto } from './dto/update-campaña.dto';
import { Campaña } from './entities/campaña.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class CampañaService {
  constructor(
    @InjectRepository(Campaña)
    private campaniaRepository: Repository<Campaña>,
  ){}

  async create(createCampañaDto: CreateCampañaDto): Promise<Campaña> {
    try {
      const nuevaCampania = this.campaniaRepository.create(createCampañaDto);
      return await this.campaniaRepository.save(nuevaCampania);
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

    if(!campania) {
      throw new NotFoundException(`No se encontró la campaña con el ID ${id}`);
    }

    return campania;
  }

  async update(id: number, updateCampañaDto: UpdateCampañaDto): Promise<Campaña> {
    const editarCampania = await this.campaniaRepository.findOneBy({id_campania: id});

    if(!editarCampania) {
      throw new NotFoundException(`No se encontró la campaña con el ID ${id}`);
    }

    const campaniaEditada = this.campaniaRepository.merge(editarCampania, updateCampañaDto);
    return this.campaniaRepository.save(campaniaEditada);
  }

  async remove(id: number): Promise<void> {
    const campaniaResult: DeleteResult = await this.campaniaRepository.delete({ id_campania: id }); 
    
    if(campaniaResult.affected === 0) {
      throw new NotFoundException(`No se encontró la campaña con el ID ${id}`);
    }
  }
}
