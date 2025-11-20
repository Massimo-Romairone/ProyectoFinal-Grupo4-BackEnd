import { PartialType } from '@nestjs/mapped-types';
import { CreateCampañaDto } from './create-campaña.dto';
import { IsOptional, IsString, IsBoolean, IsNumber, Min, IsNotEmpty, MaxLength } from 'class-validator';

export class UpdateCampañaDto extends PartialType(CreateCampañaDto) {

    @IsNotEmpty()
    @IsString()
    @MaxLength(45)
    nombre: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    descripcion: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(20)
    tipo: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    objetivo: number;
}
