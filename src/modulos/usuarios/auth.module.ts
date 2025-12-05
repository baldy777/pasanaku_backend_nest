import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from '../usuarios/services/auth.service';
import { AuthController } from '../usuarios/controllers/auth.controller';

import { Usuario } from '../usuarios/entities/usuario.entity';
import { RolUsuario } from '../usuarios/entities/rolUsuario.entity';
import { Rol } from '../usuarios/entities/rol.entity';

import { JwtStrategy } from '../usuarios/strategies/jwt.strategy';
import { JwtAuthGuard } from '../usuarios/guards/jwt-auth.guard';
import { RolesGuard } from '../usuarios/guards/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario, RolUsuario, Rol]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'JWT_SECRETO',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, RolesGuard],
  exports: [AuthService, JwtStrategy, JwtAuthGuard, RolesGuard],
})
export class AuthModule {}
