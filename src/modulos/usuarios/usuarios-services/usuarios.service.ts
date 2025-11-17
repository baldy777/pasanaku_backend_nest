import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from '../usuario-entities/usuario.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsuariosService {

  constructor(@InjectRepository(Usuario) private usuarioRepository: Repository<Usuario>){}

  createUsuario(usuario: CreateUsuarioDto) {
    const nuevoUsuario = this.usuarioRepository.create(usuario);
    this.usuarioRepository.save(nuevoUsuario);
    return 'This action adds a new usuario';
  }

  getAllUsuarios() {
    return this.usuarioRepository.find(); 
  }
}
