import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Unique,
} from 'typeorm';
import { Grupo } from './grupo.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Turno } from './turno.entity';
import { Aporte } from './aporte.entity';
import { Auditoria } from 'src/comun/auditoria.entity';

export enum RolMiembro {
  ENCARGADO = 'Encargado',
  PARTICIPANTE = 'Participante',
}

@Entity('miembros')
@Unique(['grupo', 'usuario'])
export class Miembro extends Auditoria {
  @ManyToOne(() => Grupo, (grupo) => grupo.miembros, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'grupoId' })
  grupo: Grupo;

  @Column()
  grupoId: number;

  @ManyToOne(() => Usuario, { eager: true })
  @JoinColumn({ name: 'usuarioId' })
  usuario: Usuario;

  @Column()
  usuarioId: number;

  @Column({
    type: 'enum',
    enum: RolMiembro,
    default: RolMiembro.PARTICIPANTE,
  })
  rol: RolMiembro;

  @CreateDateColumn()
  unidoEn: Date;

  @OneToMany(() => Turno, (turno) => turno.miembro)
  turnos: Turno[];

  @OneToMany(() => Aporte, (aporte) => aporte.miembro)
  aportes: Aporte[];
}
