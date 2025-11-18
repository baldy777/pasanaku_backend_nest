import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { BaseEntityAuditable } from '../../BaseEntityAuditable';
import { Persona } from './persona.entity';
import { Grupo } from 'src/modulos/grupos/grupo-entities/grupo.entity';
import { Aporte } from 'src/modulos/aportes/entities/aporte.entity';
import { Historial } from 'src/modulos/historial/entities/historial.entity';

@Entity({ name: 'usuarios' })
export class Usuario extends BaseEntityAuditable {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  nombreUsuario!: string;

  @Column({ unique: true, length: 100 })
  email!: string;

  @Column({ type: 'varchar', length: 200 })
  password!: string;

  @OneToOne(() => Persona, { eager: true })
  @JoinColumn({ name: 'persona_id' })
  persona!: Persona;

  @ManyToMany(() => Grupo, (grupo) => grupo.usuarios)
  @JoinTable({
    name: 'usuario_grupo',
    joinColumn: { name: 'usuario_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'grupo_id', referencedColumnName: 'id' },
  })
  grupos: Grupo[];

  @OneToMany(() => Aporte, (aporte) => aporte.usuario)
  aportes: Aporte[];

  @OneToOne(() => Historial, (historial) => historial.usuario)
  historial: Historial;
}
