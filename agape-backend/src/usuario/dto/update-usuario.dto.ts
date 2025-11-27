import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-usuario.dto';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
    
    @IsNotEmpty()
    @IsString()
    @MaxLength(20)
    nombreUsuario: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(20)
    nombre:string;
    
    @IsNotEmpty()
    @IsString()
    @MaxLength(30)
    apellido:string;

    @IsEmail()
    email:string;
}
