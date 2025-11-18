import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Usuario } from '../../usuarios/usuario-entities/usuario.entity';
import { BaseEntityAuditable } from 'src/modulos/BaseEntityAuditable';

@Entity('grupo')
export class Grupo extends BaseEntityAuditable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  descripcion: string;

  @ManyToMany(() => Usuario, (usuario) => usuario.grupos)
  usuarios: Usuario[];
}
