import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseEntityAuditable } from '../../BaseEntityAuditable';

@Entity({ name: 'roles' })
export class Rol extends BaseEntityAuditable {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  nombre!: string;

  @Column({ length: 200, nullable: true })
  descripcion!: string;
}
