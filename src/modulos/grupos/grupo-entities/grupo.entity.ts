import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Auditoria } from 'src/comun/auditoria.entity';

@Entity('grupo')
export class Grupo extends Auditoria {
  @Column()
  nombre: string;

  @Column({ nullable: true })
  descripcion: string;

  @ManyToMany(() => Usuario, (usuario) => usuario.grupos)
  usuarios: Usuario[];
}
