import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Aporte, EstadoAporte } from './grupoEntities/aporte.entity';
import {
  Invitacion,
  EstadoInvitacion,
} from './grupoEntities/invitacion.entity';

@Injectable()
export class AportesCronService {
  private readonly logger = new Logger(AportesCronService.name);

  constructor(
    @InjectRepository(Aporte)
    private aporteRepository: Repository<Aporte>,
    @InjectRepository(Invitacion)
    private invitacionRepository: Repository<Invitacion>,
  ) {}

  // Ejecutar diariamente a las 00:00
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async actualizarAportesAtrasados() {
    this.logger.log('Iniciando actualización de aportes atrasados...');

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const result = await this.aporteRepository
      .createQueryBuilder()
      .update(Aporte)
      .set({ estado: EstadoAporte.ATRASADO })
      .where('estado = :estado', { estado: EstadoAporte.PENDIENTE })
      .andWhere('fechaLimite < :hoy', { hoy })
      .execute();

    this.logger.log(
      `Aportes actualizados a "atrasado": ${result.affected || 0}`,
    );
  }

  // Ejecutar diariamente a las 01:00
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async expirarInvitaciones() {
    this.logger.log('Iniciando expiración de invitaciones...');

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const result = await this.invitacionRepository
      .createQueryBuilder()
      .update(Invitacion)
      .set({ estado: EstadoInvitacion.EXPIRADA })
      .where('estado = :estado', { estado: EstadoInvitacion.PENDIENTE })
      .andWhere('fechaExpiracion < :hoy', { hoy })
      .execute();

    this.logger.log(`Invitaciones expiradas: ${result.affected || 0}`);
  }
}

// Actualizar grupos.module.ts para incluir el CRON:
/*
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { GruposService } from './grupos.service';
import { GruposController } from './grupos.controller';
import { AportesCronService } from './aportes.cron';
import { Grupo } from './entities/grupo.entity';
import { Miembro } from './entities/miembro.entity';
import { Turno } from './entities/turno.entity';
import { Aporte } from './entities/aporte.entity';
import { Invitacion } from './entities/invitacion.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Grupo, Miembro, Turno, Aporte, Invitacion]),
    ScheduleModule.forRoot(),
  ],
  controllers: [GruposController],
  providers: [GruposService, AportesCronService],
  exports: [GruposService],
})
export class GruposModule {}
*/
