import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Miembro } from './miembro.entity';
import { Turno } from './turno.entity';
import { Invitacion } from './invitacion.entity';
import { Auditoria } from 'src/comun/auditoria.entity';

export enum EstadoGrupo {
  ACTIVO = 'activo',
  FINALIZADO = 'finalizado',
}

export enum FrecuenciaGrupo {
  SEMANAL = 'semanal',
  QUINCENAL = 'quincenal',
  MENSUAL = 'mensual',
}

@Entity('grupos')
export class Grupo extends Auditoria {
  @Column({ length: 100 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  montoAporte: number;

  @Column({
    type: 'enum',
    enum: FrecuenciaGrupo,
    default: FrecuenciaGrupo.MENSUAL,
  })
  frecuencia: FrecuenciaGrupo;

  @Column({ type: 'int' })
  cantidadMiembros: number;

  @Column({
    type: 'enum',
    enum: EstadoGrupo,
    default: EstadoGrupo.ACTIVO,
  })
  estado: EstadoGrupo;

  @Column({ type: 'date', nullable: true })
  fechaInicio: Date;

  @Column({ type: 'date', nullable: true })
  fechaFinalizacion: Date;

  @Column({ type: 'int', default: 0 })
  turnoActual: number;

  @Column({ type: 'boolean', default: false })
  turnosSorteados: boolean;

  @OneToMany(() => Miembro, (miembro) => miembro.grupo, { cascade: true })
  miembros: Miembro[];

  @OneToMany(() => Turno, (turno) => turno.grupo, { cascade: true })
  turnos: Turno[];

  @OneToMany(() => Invitacion, (invitacion) => invitacion.grupo, {
    cascade: true,
  })
  invitaciones: Invitacion[];
}
