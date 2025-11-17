import { IsString, IsNotEmpty, MinLength, IsEmail } from 'class-validator';

export class CreateUsuarioDto {

  @IsString()
  @IsNotEmpty()
  nombreUsuario: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
