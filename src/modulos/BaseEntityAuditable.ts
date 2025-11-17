import { CreateDateColumn, UpdateDateColumn, Column } from 'typeorm';

export abstract class BaseEntityAuditable {
  @Column({
    name: 'usuario_creacion',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  usuarioCreacion!: string;

  @CreateDateColumn({
    name: 'fecha_creacion',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaCreacion!: Date;

  @Column({
    name: 'usuario_modificacion',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  usuarioModificacion!: string;

  @UpdateDateColumn({
    name: 'fecha_modificacion',
    type: 'timestamp',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaModificacion!: Date;

  @Column({ name: 'estado', type: 'tinyint', default: 1 })
  estado!: number;
}
