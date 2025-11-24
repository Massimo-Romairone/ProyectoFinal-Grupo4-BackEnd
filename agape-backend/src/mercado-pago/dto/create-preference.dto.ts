import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreatePreferenceDto {
    @IsNotEmpty({ message: 'El monto es obligatorio' })
    @IsNumber({}, { message: 'El monto debe ser un número' })
    @Min(1, { message: 'El monto debe ser mayor a 0' })
    amount: number;

    @IsNotEmpty({ message: 'El ID de la campaña es obligatorio' })
    @IsString()
    campaignId: string;
}