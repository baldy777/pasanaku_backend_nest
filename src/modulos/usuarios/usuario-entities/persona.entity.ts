import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseEntityAuditable } from '../../BaseEntityAuditable';

@Entity({ name: 'personas' })
export class Persona extends BaseEntityAuditable {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  nombres!: string;

  @Column({ length: 100 })
  apellido_paterno!: string;

  @Column({ length: 100 })
  apellido_materno!: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  ci!: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono!: string;
}
