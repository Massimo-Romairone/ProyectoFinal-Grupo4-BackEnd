import { IsNumber, IsOptional, IsPositive, IsISO8601 } from 'class-validator';

export class CreateDonacionDto {
  @IsNumber()
  @IsPositive()
  monto: number;

  @IsOptional()
  @IsISO8601()
  fecha?: string; // opcional, puede venir como ISO; si no viene, crear en el servicio

  @IsNumber()
  campaniaId: number;

  @IsOptional()
  @IsNumber()
  usuarioId?: number; // opcional: recomendado NO usar desde el cliente; mejor tomar del token en el controller
}
