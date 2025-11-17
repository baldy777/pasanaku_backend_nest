import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosService } from './usuarios-services/usuarios.service';
import { UsuariosController } from './usuarios-controllers/usuarios.controller';
import { Usuario } from './usuario-entities/usuario.entity';
import { Persona } from './usuario-entities/persona.entity';
import { Rol } from './usuario-entities/rol.entity';
import { UsuarioRol } from './usuario-entities/usuario-rol.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, Persona, Rol, UsuarioRol])],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService],
})
export class UsuariosModule {}
