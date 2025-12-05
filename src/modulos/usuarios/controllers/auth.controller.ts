import {
  Controller,
  Post,
  Get,
  Body,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/usuarios/login.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const usuario = await this.authService.validateUser(
      loginDto.correo,
      loginDto.contrasena,
    );

    if (!usuario) {
      throw new UnauthorizedException('Correo o contraseña incorrectos');
    }

    return this.authService.login(usuario);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: any) {
    return {
      id: user.id,
      correo: user.correo,
      nombre: user.nombre,
      roles: user.roles,
    };
  }
}
