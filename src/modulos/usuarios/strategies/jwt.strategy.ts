import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { DataSource } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private dataSource: DataSource) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'JWT_SECRETO',
    });
  }

  async validate(payload: any) {
    const usuarioRepo = this.dataSource.getRepository(Usuario);

    const usuario = await usuarioRepo.findOne({
      where: { id: payload.id, activo: true },
      relations: ['roles', 'roles.rol'],
    });

    if (!usuario) {
      throw new UnauthorizedException('Usuario no válido');
    }

    if (!usuario.verificado) {
      throw new UnauthorizedException('Usuario no verificado');
    }

    return {
      id: usuario.id,
      correo: usuario.correo,
      nombre: usuario.nombre,
      roles: usuario.roles?.map((r) => r.rol.nombre) || [],
    };
  }
}
