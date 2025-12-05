import { IsNumber, IsString, IsOptional, IsDateString } from 'class-validator';

export class RegistrarPagoDto {
  @IsNumber()
  aporteId: number;

  @IsDateString()
  @IsOptional()
  fechaPago?: string;

  @IsString()
  @IsOptional()
  comprobante?: string;

  @IsString()
  @IsOptional()
  observaciones?: string;
}
