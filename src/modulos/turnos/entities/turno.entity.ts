import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Aporte } from '../../aportes/entities/aporte.entity';
import { Auditoria } from 'src/comun/auditoria.entity';

@Entity('turno')
export class Turno extends Auditoria {
  @Column()
  numeroTurno: number;

  @Column({ type: 'date' })
  fechaAsignada: Date;

  @OneToOne(() => Aporte, (aporte) => aporte.turno)
  @JoinColumn({ name: 'aporte_id' })
  aporte: Aporte;
}
