import { DataSource } from 'typeorm';
import { seedUsuarios } from './seedUsuarios/seedUsuario';
import { seedRoles } from './seedUsuarios/seedRol';
import { seedRolUsuario } from './seedUsuarios/seedRolUsuario';

export async function runSeeds(dataSource: DataSource) {
  console.log('Ejecutando seeds...');

  await seedRoles(dataSource);
  await seedUsuarios(dataSource);
  await seedRolUsuario(dataSource);

  console.log('Todas las seeds ejecutadas!');
}
