import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Aporte } from '../../aportes/entities/aporte.entity';
import { BaseEntityAuditable } from 'src/modulos/BaseEntityAuditable';

@Entity('turno')
export class Turno extends BaseEntityAuditable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  numeroTurno: number;

  @Column({ type: 'date' })
  fechaAsignada: Date;

  @OneToOne(() => Aporte, (aporte) => aporte.turno)
  @JoinColumn({ name: 'aporte_id' })
  aporte: Aporte;
}
