import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Usuario } from '../../usuarios/usuario-entities/usuario.entity';
import { BaseEntityAuditable } from 'src/modulos/BaseEntityAuditable';

@Entity('aporte')
export class Aporte extends BaseEntityAuditable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  monto: number;

  @Column({ type: 'date' })
  fecha: Date;

  @ManyToOne(() => Usuario, (usuario) => usuario.aportes)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;
}
