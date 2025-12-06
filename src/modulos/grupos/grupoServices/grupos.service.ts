import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grupo, EstadoGrupo } from '../grupoEntities/grupo.entity';
import { Miembro, RolMiembro } from '../grupoEntities/miembro.entity';
import { Turno, EstadoTurno } from '../grupoEntities/turno.entity';
import { Aporte, EstadoAporte } from '../grupoEntities/aporte.entity';
import {
  Invitacion,
  EstadoInvitacion,
} from '../grupoEntities/invitacion.entity';
import { CreateGrupoDto } from '../dto/grupoDTO/create-grupo.dto';
import { UpdateGrupoDto } from '../dto/grupoDTO/update-grupo.dto';
import { InvitarMiembroDto } from '../dto/miembroDTO/invitar-miembro.dto';
import { RegistrarPagoDto } from '../dto/registrar-pago.dto';

@Injectable()
export class GruposService {
  constructor(
    @InjectRepository(Grupo)
    private grupoRepository: Repository<Grupo>,
    @InjectRepository(Miembro)
    private miembroRepository: Repository<Miembro>,
    @InjectRepository(Turno)
    private turnoRepository: Repository<Turno>,
    @InjectRepository(Aporte)
    private aporteRepository: Repository<Aporte>,
    @InjectRepository(Invitacion)
    private invitacionRepository: Repository<Invitacion>,
  ) {}

  // Crear un nuevo grupo
  async create(createGrupoDto: CreateGrupoDto, usuarioId: number) {
    const grupo = this.grupoRepository.create({
      ...createGrupoDto,
      turnoActual: 0,
    });

    const grupoGuardado = await this.grupoRepository.save(grupo);

    // Crear miembro (creador es Encargado)
    const miembro = this.miembroRepository.create({
      grupoId: grupoGuardado.id,
      usuarioId,
      rol: RolMiembro.ENCARGADO,
    });

    await this.miembroRepository.save(miembro);

    return this.findOne(grupoGuardado.id, usuarioId);
  }

  // Obtener todos los grupos de un usuario
  async findAllByUser(usuarioId: number) {
    const miembros = await this.miembroRepository.find({
      where: { usuarioId, activo: true },
      relations: ['grupo', 'grupo.miembros', 'grupo.miembros.usuario'],
    });

    return miembros.map((m) => ({
      ...m.grupo,
      rolUsuario: m.rol,
      cantidadMiembrosActuales: m.grupo.miembros.filter((mi) => mi.activo)
        .length,
    }));
  }

  // Obtener un grupo específico con detalles
  async findOne(id: number, usuarioId: number) {
    const miembro = await this.miembroRepository.findOne({
      where: { grupoId: id, usuarioId, activo: true },
      relations: [
        'grupo',
        'grupo.miembros',
        'grupo.miembros.usuario',
        'grupo.miembros.aportes', // ← Trae todos los aportes
        'grupo.turnos',
        'grupo.turnos.miembro',
        'grupo.turnos.miembro.usuario',
      ],
    });

    if (!miembro) {
      throw new NotFoundException('Grupo no encontrado o sin acceso');
    }

    const grupo = miembro.grupo;

    // Filtrar solo miembros activos y ordenar sus aportes
    const miembrosActivos = grupo.miembros
      .filter((m) => m.activo)
      .map((m) => ({
        ...m,
        aportes: m.aportes
          ? m.aportes.sort((a, b) => b.numeroPeriodo - a.numeroPeriodo)
          : [],
      }));

    return {
      ...grupo,
      rolUsuario: miembro.rol,
      miembros: miembrosActivos,
      turnos: grupo.turnos.sort((a, b) => a.numeroTurno - b.numeroTurno),
    };
  }

  // Actualizar grupo
  async update(id: number, updateGrupoDto: UpdateGrupoDto, usuarioId: number) {
    await this.verificarEncargado(id, usuarioId);

    await this.grupoRepository.update(id, updateGrupoDto);
    return this.findOne(id, usuarioId);
  }

  // Invitar miembro al grupo
  async invitarMiembro(
    grupoId: number,
    invitarDto: InvitarMiembroDto,
    usuarioInvitadorId: number,
  ) {
    await this.verificarEncargado(grupoId, usuarioInvitadorId);

    const grupo = await this.grupoRepository.findOne({
      where: { id: grupoId },
      relations: ['miembros'],
    });

    if (!grupo) {
      throw new NotFoundException('Grupo no encontrado');
    }

    // Verificar que el grupo no esté lleno
    const miembrosActivos = grupo.miembros.filter((m) => m.activo).length;
    if (miembrosActivos >= grupo.cantidadMiembros) {
      throw new BadRequestException('El grupo ya está completo');
    }

    // Verificar que el usuario no sea miembro ya
    const yaEsMiembro = grupo.miembros.some(
      (m) => m.usuarioId === invitarDto.usuarioId && m.activo,
    );

    if (yaEsMiembro) {
      throw new BadRequestException('El usuario ya es miembro del grupo');
    }

    // Verificar que no haya invitación pendiente
    const invitacionPendiente = await this.invitacionRepository.findOne({
      where: {
        grupoId,
        usuarioInvitadoId: invitarDto.usuarioId,
        estado: EstadoInvitacion.PENDIENTE,
      },
    });

    if (invitacionPendiente) {
      throw new BadRequestException('Ya existe una invitación pendiente');
    }

    // Crear invitación (expira en 7 días)
    const fechaExpiracion = new Date();
    fechaExpiracion.setDate(fechaExpiracion.getDate() + 7);

    const invitacion = this.invitacionRepository.create({
      grupoId,
      usuarioInvitadoId: invitarDto.usuarioId,
      usuarioInvitadorId,
      mensaje: invitarDto.mensaje,
      fechaExpiracion,
    });

    return this.invitacionRepository.save(invitacion);
  }

  // Obtener invitaciones de un usuario
  async misInvitaciones(usuarioId: number) {
    return this.invitacionRepository.find({
      where: {
        usuarioInvitadoId: usuarioId,
        estado: EstadoInvitacion.PENDIENTE,
      },
      relations: ['grupo', 'usuarioInvitador'],
      order: { fechaCreacion: 'DESC' },
    });
  }

  // Responder invitación
  async responderInvitacion(
    invitacionId: number,
    aceptar: boolean,
    usuarioId: number,
  ) {
    const invitacion = await this.invitacionRepository.findOne({
      where: { id: invitacionId, usuarioInvitadoId: usuarioId },
      relations: ['grupo'],
    });

    if (!invitacion) {
      throw new NotFoundException('Invitación no encontrada');
    }

    if (invitacion.estado !== EstadoInvitacion.PENDIENTE) {
      throw new BadRequestException('La invitación ya fue respondida');
    }

    // Verificar expiración
    if (new Date() > invitacion.fechaExpiracion) {
      invitacion.estado = EstadoInvitacion.EXPIRADA;
      await this.invitacionRepository.save(invitacion);
      throw new BadRequestException('La invitación ha expirado');
    }

    if (aceptar) {
      // Verificar que el grupo no esté lleno
      const grupo = await this.grupoRepository.findOne({
        where: { id: invitacion.grupoId },
        relations: ['miembros'],
      });

      if (!grupo) {
        throw new NotFoundException('Grupo no encontrado');
      }

      const miembrosActivos = grupo.miembros.filter((m) => m.activo).length;
      if (miembrosActivos >= grupo.cantidadMiembros) {
        throw new BadRequestException('El grupo ya está completo');
      }

      // Agregar como miembro
      const miembro = this.miembroRepository.create({
        grupoId: invitacion.grupoId,
        usuarioId,
        rol: RolMiembro.PARTICIPANTE,
      });

      await this.miembroRepository.save(miembro);

      invitacion.estado = EstadoInvitacion.ACEPTADA;
    } else {
      invitacion.estado = EstadoInvitacion.RECHAZADA;
    }

    await this.invitacionRepository.save(invitacion);

    return {
      mensaje: aceptar ? 'Invitación aceptada' : 'Invitación rechazada',
    };
  }

  // Sortear turnos
  async sortearTurnos(grupoId: number, usuarioId: number) {
    await this.verificarEncargado(grupoId, usuarioId);

    const grupo = await this.grupoRepository.findOne({
      where: { id: grupoId },
      relations: ['miembros', 'turnos'],
    });

    if (!grupo) {
      throw new NotFoundException('Grupo no encontrado');
    }

    if (grupo.turnosSorteados) {
      throw new BadRequestException('Los turnos ya fueron sorteados');
    }

    const miembrosActivos = grupo.miembros.filter((m) => m.activo);

    if (miembrosActivos.length < grupo.cantidadMiembros) {
      throw new BadRequestException(
        'El grupo debe estar completo para sortear turnos',
      );
    }

    // Mezclar miembros aleatoriamente
    const miembrosMezclados = this.shuffleArray([...miembrosActivos]);

    // Crear turnos
    const fechaInicio = new Date();
    const turnos = miembrosMezclados.map((miembro, index) => {
      const fechaPrevista = this.calcularFechaTurno(
        fechaInicio,
        grupo.frecuencia,
        index,
      );

      return this.turnoRepository.create({
        grupoId,
        miembroId: miembro.id,
        numeroTurno: index + 1,
        fechaPrevista,
        estado: index === 0 ? EstadoTurno.EN_PROCESO : EstadoTurno.PENDIENTE,
      });
    });

    await this.turnoRepository.save(turnos);

    // Actualizar grupo
    grupo.turnosSorteados = true;
    grupo.fechaInicio = fechaInicio;
    grupo.turnoActual = 1;
    await this.grupoRepository.save(grupo);

    // Crear aportes para el primer periodo
    await this.crearAportesPeriodo(grupo, miembrosActivos, 1);

    return this.findOne(grupoId, usuarioId);
  }

  // Registrar pago de aporte
  async registrarPago(registrarPagoDto: RegistrarPagoDto, usuarioId: number) {
    const aporte = await this.aporteRepository.findOne({
      where: { id: registrarPagoDto.aporteId },
      relations: ['miembro'],
    });

    if (!aporte) {
      throw new NotFoundException('Aporte no encontrado');
    }

    // Verificar que el usuario sea el dueño del aporte
    if (aporte.miembro.usuarioId !== usuarioId) {
      throw new ForbiddenException('No puedes registrar este pago');
    }

    if (aporte.estado === EstadoAporte.PAGADO) {
      throw new BadRequestException('Este aporte ya fue pagado');
    }

    aporte.estado = EstadoAporte.PAGADO;
    aporte.fechaPago = registrarPagoDto.fechaPago
      ? new Date(registrarPagoDto.fechaPago)
      : new Date();
    aporte.comprobante = registrarPagoDto.comprobante ?? null;
    aporte.observaciones = registrarPagoDto.observaciones ?? null;

    await this.aporteRepository.save(aporte);

    // Verificar si todos pagaron para avanzar turno
    await this.verificarAvanceTurno(aporte.miembro.grupoId);

    return aporte;
  }

  // Obtener mis aportes
  async misAportes(usuarioId: number, grupoId?: number) {
    const where: any = { miembro: { usuarioId } };
    if (grupoId) {
      where.miembro = { ...where.miembro, grupoId };
    }

    return this.aporteRepository.find({
      where,
      relations: ['miembro', 'miembro.grupo'],
      order: { numeroPeriodo: 'DESC', fechaCreacion: 'DESC' },
    });
  }

  private async verificarEncargado(grupoId: number, usuarioId: number) {
    const miembro = await this.miembroRepository.findOne({
      where: { grupoId, usuarioId, activo: true },
    });

    if (!miembro || miembro.rol !== RolMiembro.ENCARGADO) {
      throw new ForbiddenException(
        'Solo el encargado puede realizar esta acción',
      );
    }
  }

  private shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  private calcularFechaTurno(
    fechaInicio: Date,
    frecuencia: string,
    indice: number,
  ): Date {
    const fecha = new Date(fechaInicio);
    switch (frecuencia) {
      case 'semanal':
        fecha.setDate(fecha.getDate() + indice * 7);
        break;
      case 'quincenal':
        fecha.setDate(fecha.getDate() + indice * 14);
        break;
      case 'mensual':
        fecha.setMonth(fecha.getMonth() + indice);
        break;
    }
    return fecha;
  }

  private async crearAportesPeriodo(
    grupo: Grupo,
    miembros: Miembro[],
    numeroPeriodo: number,
  ) {
    const fechaLimite = this.calcularFechaTurno(
      new Date(),
      grupo.frecuencia,
      numeroPeriodo - 1,
    );

    const aportes = miembros.map((miembro) =>
      this.aporteRepository.create({
        miembroId: miembro.id,
        numeroPeriodo,
        monto: grupo.montoAporte,
        fechaLimite,
        estado: EstadoAporte.PENDIENTE,
      }),
    );

    await this.aporteRepository.save(aportes);
  }

  private async verificarAvanceTurno(grupoId: number) {
    const grupo = await this.grupoRepository.findOne({
      where: { id: grupoId },
      relations: ['miembros', 'turnos'],
    });

    if (!grupo) {
      throw new NotFoundException('Grupo no encontrado');
    }

    const turnoActual = grupo.turnos.find(
      (t) => t.numeroTurno === grupo.turnoActual,
    );

    if (!turnoActual) return;

    // Obtener aportes del periodo actual
    const miembrosActivos = grupo.miembros.filter((m) => m.activo);
    const aportesPeriodo = await this.aporteRepository.find({
      where: {
        miembroId: miembrosActivos.map((m) => m.id) as any,
        numeroPeriodo: grupo.turnoActual,
      },
    });

    // Verificar si todos pagaron
    const todosPagaron = aportesPeriodo.every(
      (a) => a.estado === EstadoAporte.PAGADO,
    );

    if (todosPagaron) {
      // Completar turno actual
      turnoActual.estado = EstadoTurno.COMPLETADO;
      turnoActual.fechaEjecucion = new Date();
      turnoActual.montoRecibido = grupo.montoAporte * miembrosActivos.length;
      await this.turnoRepository.save(turnoActual);

      // Avanzar al siguiente turno
      if (grupo.turnoActual < grupo.cantidadMiembros) {
        grupo.turnoActual += 1;

        const siguienteTurno = grupo.turnos.find(
          (t) => t.numeroTurno === grupo.turnoActual,
        );

        if (siguienteTurno) {
          siguienteTurno.estado = EstadoTurno.EN_PROCESO;
          await this.turnoRepository.save(siguienteTurno);

          // Crear aportes para el nuevo periodo
          await this.crearAportesPeriodo(
            grupo,
            miembrosActivos,
            grupo.turnoActual,
          );
        }
      } else {
        // Finalizar grupo
        grupo.estado = EstadoGrupo.FINALIZADO;
        grupo.fechaFinalizacion = new Date();
      }

      await this.grupoRepository.save(grupo);
    }
  }
}
