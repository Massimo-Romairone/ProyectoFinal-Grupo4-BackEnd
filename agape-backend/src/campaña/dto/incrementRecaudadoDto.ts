import { IsNumber, Min } from 'class-validator';

export class IncrementRecaudadoDto {
    @IsNumber()
    @Min(0.01)
    monto: number;
}