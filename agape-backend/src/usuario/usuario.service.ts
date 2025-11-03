import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class UsuarioService {
  private readonly logger = new Logger(UsuarioService.name);

  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ){}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    try {
      const nuevoUsuario = this.usuarioRepository.create(createUsuarioDto);
      const guardarUsuario = await this.usuarioRepository.save(nuevoUsuario);

      this.logger.log(`Usuario creado: id=${guardarUsuario.id_Usuario}, nombre=${guardarUsuario.nombre ?? 'sin-nombre'}`);
      return guardarUsuario;

    } catch (error) {
      this.logger.error('Error al crear el usuario', error);
      throw new InternalServerErrorException('Error al crear el usuario');
    }
  }

  async findAll(): Promise<Usuario[]> {
    return this.usuarioRepository.find();
  }

  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: {id_Usuario: id},
      relations: [],
    });

    if(!usuario) {
      this.logger.warn(`Usuario no encontrado: id=${id}`);
      throw new NotFoundException(`No se encontró el usuario con el ID ${id}`);
    }

    return usuario;
  }

  async findOneEmail(email: string): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { email: email },
      relations: [],
    });

    if(!usuario) {
      throw new NotFoundException(`No se encontró el usuario con el email ${email}`);
    }

    return usuario;
  }

  async findOneByEmail(email: string): Promise<Usuario | null> {
    return this.usuarioRepository
      .createQueryBuilder('usuario')
      .addSelect('usuario.contraseña')
      .where('usuario.email = :email', { email })
      .getOne();
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario> {
    try {
      const usuario = await this.usuarioRepository.preload({
        id_Usuario: id,
        ...updateUsuarioDto,
      });

      if (!usuario) {
        this.logger.warn(`Intentando actualizar un usuario que no existe: id=${id}`);
        throw new NotFoundException(`No se encontro el usuario con el ID ${id}`);
      }

      const usuarioGuardado = await this.usuarioRepository.save(usuario);

      this.logger.log(`Usuario actualizado: id=${id}`);

      return usuarioGuardado;
    } catch (error) {
      this.logger.error(`Error actualizando el usuario: id=${id}`, error);
      throw new InternalServerErrorException('Error al actualizar el usuario');
    }
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    try {
      const resultado: DeleteResult = await this.usuarioRepository.delete({ id_Usuario: id });

      if (resultado.affected === 0) {
        this.logger.warn(`Intentando eliminar un usuario que no existe: id=${id}`);
        throw new NotFoundException(`No se encontro el usuario con el ID ${id}`);
      }

      this.logger.log(`Usuario eliminado: id=${id}`);

      return { deleted: true };
    } catch (error) {
      this.logger.error(`Error eliminando el usuario id=${id}`, error);
      throw new InternalServerErrorException('Error al eliminar el usuario');
    }
  }
}
