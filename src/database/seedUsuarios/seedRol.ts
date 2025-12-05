import { DataSource } from 'typeorm';
import { Rol } from '../../modulos/usuarios/entities/rol.entity';

export async function seedRoles(dataSource: DataSource) {
  const rolRepo = dataSource.getRepository(Rol);

  const roles = [
    { nombre: 'Administrador', descripcion: 'Administrador del sistema' },
    { nombre: 'Encargado', descripcion: 'Encargado de gestionar grupos' },
    { nombre: 'Participante', descripcion: 'Participa en un grupo' },
  ];

  for (const rolData of roles) {
    const rolExistente = await rolRepo.findOneBy({ nombre: rolData.nombre });
    if (rolExistente) {
      console.log(`Rol "${rolData.nombre}" ya existe, saltando seed.`);
      continue;
    }

    const rol = rolRepo.create(rolData);
    await rolRepo.save(rol);
    console.log(`Rol "${rol.nombre}" seed creado exitosamente!`);
  }
}
