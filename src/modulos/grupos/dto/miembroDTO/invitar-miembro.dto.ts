import { IsNumber, IsString, IsOptional } from 'class-validator';

export class InvitarMiembroDto {
  @IsNumber()
  usuarioId: number;

  @IsString()
  @IsOptional()
  mensaje?: string;
}
