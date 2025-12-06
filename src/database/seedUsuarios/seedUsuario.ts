import { DataSource } from 'typeorm';
import { Usuario } from '../../modulos/usuarios/entities/usuario.entity';
import { Rol } from '../../modulos/usuarios/entities/rol.entity';
import { RolUsuario } from '../../modulos/usuarios/entities/rolUsuario.entity';

export async function seedUsuarios(dataSource: DataSource) {
  const usuarioRepo = dataSource.getRepository(Usuario);
  const rolRepo = dataSource.getRepository(Rol);
  const rolUsuarioRepo = dataSource.getRepository(RolUsuario);

  const usuarioExistente = await usuarioRepo.findOneBy({
    correo: 'somartorrencial@gmail.com',
  });

  if (usuarioExistente) {
    console.log('Usuario ya existe, saltando seed.');
    return;
  }

  // Crear usuario
  const usuario = usuarioRepo.create({
    nombre: 'Joel',
    apellidoPaterno: 'Quispe',
    apellidoMaterno: 'tapia',
    correo: 'somartorrencial@gmail.com',
    contrasena: 'unicornio3000',
    ci: '13312948',
    telefono: '65560127',
    verificado: true,
  });

  await usuarioRepo.save(usuario);

  // Asignar rol de Administrador
  const rolAdministrador = await rolRepo.findOne({
    where: { nombre: 'Administrador' },
  });

  if (rolAdministrador) {
    const rolUsuario = rolUsuarioRepo.create({
      usuario: usuario,
      rol: rolAdministrador,
      activo: true,
    });
    await rolUsuarioRepo.save(rolUsuario);
    console.log('Rol Administrador asignado al usuario seed.');
  }

  console.log('Usuario seed creado exitosamente!');
}
