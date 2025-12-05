import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grupo } from './grupoEntities/grupo.entity';
import { Miembro } from './grupoEntities/miembro.entity';
import { Turno } from './grupoEntities/turno.entity';
import { Aporte } from './grupoEntities/aporte.entity';
import { Invitacion } from './grupoEntities/invitacion.entity';
import { GruposController } from './grupoControllers/grupos.controller';
import { GruposService } from './grupoServices/grupos.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Grupo, Miembro, Turno, Aporte, Invitacion]),
  ],
  controllers: [GruposController],
  providers: [GruposService],
  exports: [GruposService],
})
export class GruposModule {}
