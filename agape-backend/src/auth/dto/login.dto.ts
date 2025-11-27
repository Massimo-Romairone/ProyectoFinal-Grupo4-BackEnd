import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
    @IsEmail()
    email: string;

    @Transform(({ value }) => value?.trim())
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    contraseña: string;
}