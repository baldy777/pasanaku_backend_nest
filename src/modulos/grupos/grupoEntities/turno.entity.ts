import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Grupo } from './grupo.entity';
import { Miembro } from './miembro.entity';
import { Auditoria } from 'src/comun/auditoria.entity';

export enum EstadoTurno {
  PENDIENTE = 'pendiente',
  EN_PROCESO = 'en_proceso',
  COMPLETADO = 'completado',
}

@Entity('turnos')
export class Turno extends Auditoria {
  @ManyToOne(() => Grupo, (grupo) => grupo.turnos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'grupoId' })
  grupo: Grupo;

  @Column()
  grupoId: number;

  @ManyToOne(() => Miembro, (miembro) => miembro.turnos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'miembroId' })
  miembro: Miembro;

  @Column()
  miembroId: number;

  @Column({ type: 'int' })
  numeroTurno: number;

  @Column({ type: 'date', nullable: true })
  fechaPrevista: Date;

  @Column({ type: 'date', nullable: true })
  fechaEjecucion: Date;

  @Column({
    type: 'enum',
    enum: EstadoTurno,
    default: EstadoTurno.PENDIENTE,
  })
  estado: EstadoTurno;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  montoRecibido: number;

  @Column({ type: 'text', nullable: true })
  observaciones: string;
}
