import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Miembro } from './miembro.entity';
import { Auditoria } from 'src/comun/auditoria.entity';

export enum EstadoAporte {
  PENDIENTE = 'pendiente',
  PAGADO = 'pagado',
  ATRASADO = 'atrasado',
}

@Entity('aportes')
export class Aporte extends Auditoria {
  @ManyToOne(() => Miembro, (miembro) => miembro.aportes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'miembroId' })
  miembro: Miembro;

  @Column()
  miembroId: number;

  @Column({ type: 'int' })
  numeroPeriodo: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monto: number;

  @Column({
    type: 'enum',
    enum: EstadoAporte,
    default: EstadoAporte.PENDIENTE,
  })
  estado: EstadoAporte;

  @Column({ type: 'date' })
  fechaLimite: Date;

  @Column({ type: 'date', nullable: true })
  fechaPago: Date;

  @Column({ type: 'text', nullable: true })
  comprobante: string | null;

  @Column({ type: 'text', nullable: true })
  observaciones: string | null;
}
