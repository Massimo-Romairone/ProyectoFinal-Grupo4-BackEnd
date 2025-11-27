import { IsNumber, IsOptional, IsPositive, IsISO8601, IsNotEmpty } from 'class-validator';

export class CreateDonacionDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  monto: number;

  @IsNotEmpty()
  @IsISO8601()
  fecha: Date;

  @IsNotEmpty()
  @IsNumber()
  campaniaId: number;
}
