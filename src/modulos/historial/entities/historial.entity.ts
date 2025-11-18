import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Usuario } from '../../usuarios/usuario-entities/usuario.entity';

@Entity('historial')
export class Historial {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha: Date;

  // Relación 1:1 con Usuario
  @OneToOne(() => Usuario, (usuario) => usuario.historial)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;
}
