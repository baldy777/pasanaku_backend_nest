import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { GruposService } from '../grupoServices/grupos.service';
import { CreateGrupoDto } from '../dto/grupoDTO/create-grupo.dto';
import { UpdateGrupoDto } from '../dto/grupoDTO/update-grupo.dto';
import { InvitarMiembroDto } from '../dto/miembroDTO/invitar-miembro.dto';
import { ResponderInvitacionDto } from '../dto/miembroDTO/responder-invitacion.dto';
import { RegistrarPagoDto } from '../dto/registrar-pago.dto';
import { JwtAuthGuard } from 'src/modulos/usuarios/guards/jwt-auth.guard';

@Controller('grupos')
@UseGuards(JwtAuthGuard)
export class GruposController {
  constructor(private readonly gruposService: GruposService) {}

  @Post()
  create(@Body() createGrupoDto: CreateGrupoDto, @Request() req) {
    return this.gruposService.create(createGrupoDto, req.user.id);
  }

  @Get()
  findAll(@Request() req) {
    return this.gruposService.findAllByUser(req.user.id);
  }

  @Get('invitaciones')
  misInvitaciones(@Request() req) {
    return this.gruposService.misInvitaciones(req.user.id);
  }

  @Get('aportes')
  misAportes(@Request() req) {
    return this.gruposService.misAportes(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.gruposService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGrupoDto: UpdateGrupoDto,
    @Request() req,
  ) {
    return this.gruposService.update(id, updateGrupoDto, req.user.id);
  }

  @Post(':id/invitar')
  invitarMiembro(
    @Param('id', ParseIntPipe) id: number,
    @Body() invitarDto: InvitarMiembroDto,
    @Request() req,
  ) {
    return this.gruposService.invitarMiembro(id, invitarDto, req.user.id);
  }

  @Post('invitaciones/:id/responder')
  responderInvitacion(
    @Param('id', ParseIntPipe) id: number,
    @Body() responderDto: ResponderInvitacionDto,
    @Request() req,
  ) {
    return this.gruposService.responderInvitacion(
      id,
      responderDto.aceptar,
      req.user.id,
    );
  }

  @Post(':id/sortear-turnos')
  sortearTurnos(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.gruposService.sortearTurnos(id, req.user.id);
  }

  @Post('aportes/registrar-pago')
  registrarPago(@Body() registrarPagoDto: RegistrarPagoDto, @Request() req) {
    return this.gruposService.registrarPago(registrarPagoDto, req.user.id);
  }
}
