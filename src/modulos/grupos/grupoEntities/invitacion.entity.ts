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
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Auditoria } from 'src/comun/auditoria.entity';

export enum EstadoInvitacion {
  PENDIENTE = 'pendiente',
  ACEPTADA = 'aceptada',
  RECHAZADA = 'rechazada',
  EXPIRADA = 'expirada',
}

@Entity('invitaciones')
export class Invitacion extends Auditoria {
  @ManyToOne(() => Grupo, (grupo) => grupo.invitaciones, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'grupoId' })
  grupo: Grupo;

  @Column()
  grupoId: number;

  @ManyToOne(() => Usuario, { eager: true })
  @JoinColumn({ name: 'usuarioInvitadoId' })
  usuarioInvitado: Usuario;

  @Column()
  usuarioInvitadoId: number;

  @ManyToOne(() => Usuario, { eager: true })
  @JoinColumn({ name: 'usuarioInvitadorId' })
  usuarioInvitador: Usuario;

  @Column()
  usuarioInvitadorId: number;

  @Column({
    type: 'enum',
    enum: EstadoInvitacion,
    default: EstadoInvitacion.PENDIENTE,
  })
  estado: EstadoInvitacion;

  @Column({ type: 'date' })
  fechaExpiracion: Date;

  @Column({ type: 'text', nullable: true })
  mensaje: string;
}
