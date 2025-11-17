import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntityAuditable } from '../../BaseEntityAuditable';
import { Usuario } from './usuario.entity';
import { Rol } from './rol.entity';

@Entity({ name: 'usuarios_roles' })
export class UsuarioRol extends BaseEntityAuditable {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_id' })
  usuario!: Usuario;

  @ManyToOne(() => Rol)
  @JoinColumn({ name: 'rol_id' })
  rol!: Rol;
}
