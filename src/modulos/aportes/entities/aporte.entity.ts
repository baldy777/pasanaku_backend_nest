import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Auditoria } from 'src/comun/auditoria.entity';
import { Turno } from 'src/modulos/turnos/entities/turno.entity';

@Entity('aporte')
export class Aporte extends Auditoria {
  @Column('decimal', { precision: 10, scale: 2 })
  monto: number;

  @Column({ type: 'date' })
  fecha: Date;

  @ManyToOne(() => Usuario, (usuario) => usuario.aportes)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @OneToOne(() => Turno, (turno) => turno.aporte)
  turno: Turno;
}
