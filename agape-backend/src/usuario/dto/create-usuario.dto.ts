import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUsuarioDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(20)
    nombreUsuario: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    nombre:string;
    
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    apellido:string;

    @IsEmail()
    email:string;

    @Transform(({ value }) => value.trim())
    @MinLength(6)
    contraseña:string;
}
