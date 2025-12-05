import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsPositive,
  Min,
  Max,
  Length,
} from 'class-validator';
import { FrecuenciaGrupo } from '../../grupoEntities/grupo.entity';

export class CreateGrupoDto {
  @IsString()
  @Length(3, 100)
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsNumber()
  @IsPositive()
  montoAporte: number;

  @IsEnum(FrecuenciaGrupo)
  frecuencia: FrecuenciaGrupo;

  @IsNumber()
  @Min(2)
  @Max(50)
  cantidadMiembros: number;
}
