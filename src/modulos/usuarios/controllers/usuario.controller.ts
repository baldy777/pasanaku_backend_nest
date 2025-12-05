import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Body,
  Param,
  NotFoundException,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { UsuarioService } from '../services/usuario.service';
import { CreateUsuarioDto } from '../dto/usuarios/crearUsuario.dto';
import { ActualizarUsuarioDto } from '../dto/usuarios/actualizarUsuario.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';

@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  create(@Body() crearUsuarioDto: CreateUsuarioDto) {
    return this.usuarioService.create(crearUsuarioDto);
  }

  @Post('verificar-codigo')
  async verificarCodigo(@Body() body: { correo: string; codigo: string }) {
    const usuario = await this.usuarioService.findByCorreo(body.correo);

    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    if (usuario.verificacionToken !== body.codigo) {
      throw new BadRequestException('Código incorrecto');
    }

    if (
      usuario.verificacionExpirada &&
      usuario.verificacionExpirada < new Date()
    ) {
      throw new BadRequestException('Código expirado');
    }

    await this.usuarioService.verifyUsuario(usuario);

    return { message: 'Cuenta verificada correctamente' };
  }

  @Get('verify/:token')
  async verifyEmail(@Param('token') token: string) {
    const usuario = await this.usuarioService.findByToken(token);

    if (!usuario) {
      throw new NotFoundException('Token inválido');
    }

    if (
      usuario.verificacionExpirada &&
      usuario.verificacionExpirada < new Date()
    ) {
      throw new BadRequestException('Token expirado');
    }

    await this.usuarioService.verifyUsuario(usuario);

    return { message: 'Correo verificado correctamente' };
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador')
  findAll() {
    return this.usuarioService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: number) {
    return this.usuarioService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador')
  update(
    @Param('id') id: number,
    @Body() actualizarUsuarioAllDto: ActualizarUsuarioDto,
  ) {
    return this.usuarioService.update(id, actualizarUsuarioAllDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador')
  partialUpdate(
    @Param('id') id: number,
    @Body() actualizarUsuarioOneDto: ActualizarUsuarioDto,
  ) {
    return this.usuarioService.partialUpdate(id, actualizarUsuarioOneDto);
  }

  @Post(':id/roles/:rolId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador')
  asignarRol(@Param('id') usuarioId: number, @Param('rolId') rolId: number) {
    return this.usuarioService.asignarRol(usuarioId, rolId);
  }

  @Patch(':id/roles/:rolId/quitar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador')
  quitarRol(@Param('id') usuarioId: number, @Param('rolId') rolId: number) {
    return this.usuarioService.quitarRol(usuarioId, rolId);
  }
}
