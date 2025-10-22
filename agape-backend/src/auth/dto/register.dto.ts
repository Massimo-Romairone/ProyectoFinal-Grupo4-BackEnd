import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class RegisterDto {
    @Transform(({ value }) => value.trim())
    @IsNotEmpty()
    nombre: string;

    @Transform(({ value }) => value.trim())
    @IsNotEmpty()
    apellido: string;

    @IsEmail()
    email: string;
    
    @Transform(({ value }) => value.trim())
    @MinLength(6)
    contraseña: string;
}
