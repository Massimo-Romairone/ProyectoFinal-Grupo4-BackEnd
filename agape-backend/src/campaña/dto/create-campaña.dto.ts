import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength, IsInt, Min, IsBoolean, IsDate } from 'class-validator';

export class CreateCampañaDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    nombre: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    descripcion: string;

    @IsString()
    @MaxLength(45)
    tipo: string;

    @IsInt()
    @Min(0)
    @Type(()=>Number)
    objetivo: number;

    @IsInt()
    @Min(0)
    @Type(()=>Number)
    recaudado: number;

    @IsNotEmpty()
    @Type(()=>Date)
    @IsDate()
    fecha_inicio: Date;

    @IsNotEmpty()
    @IsBoolean()
    activo: boolean;
}
