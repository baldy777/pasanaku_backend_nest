import { IsBoolean } from 'class-validator';

export class ResponderInvitacionDto {
  @IsBoolean()
  aceptar: boolean;
}
