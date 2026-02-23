import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';
import { Prisma } from '@prisma/client';
// import { CirculacionService } from '../circulacion/services/circulacion.service';
import { IniciarViajeDto } from './dto/iniciar-viaje.dto';

@Injectable()
export class UsoVehiculoService {
  constructor(private prisma: PrismaService,
    // private circulacionService: CirculacionService
  ) {}

  findAll() {
    return this.prisma.usoVehiculo.findMany({
      select: {
        id: true,
        usuarioId: true,
        vehiculoId: true,
        fechaInicio: true,
        fechaFin: true,
        kmInicial: true,
        kmFinal: true,
        gasolinaInicial: true,
        gasolinaFinal: true,
        estadoDevolucion: true,
        observaciones: true,
        debeLavar: true,
        lavo: true,
        createdAt: true,
        updatedAt: true,
        usuario: {
          select: {
            id: true,
            nombre: true,
            email: true,
          },
        },
        vehiculo: {
          select: {
            id: true,
            placa: true,
            marca: true,
            modelo: true,
          },
        },
      },
      orderBy: { fechaInicio: 'desc' },
    });
  }

  async findActivos() {
    const viajes = await this.prisma.usoVehiculo.findMany({
      where: { fechaFin: null },
      select: {
        id: true,
        usuarioId: true,
        vehiculoId: true,
        fechaInicio: true,
        fechaFin: true,
        kmInicial: true,
        kmFinal: true,
        gasolinaInicial: true,
        gasolinaFinal: true,
        estadoDevolucion: true,
        observaciones: true,
        debeLavar: true,
        lavo: true,
        createdAt: true,
        updatedAt: true,
        usuario: {
          select: {
            id: true,
            nombre: true,
            email: true,
          },
        },
        vehiculo: {
          select: {
            id: true,
            placa: true,
            marca: true,
            modelo: true,
          },
        },
      },
      orderBy: { fechaInicio: 'desc' },
    });

    // Calcular debeLavar dinámicamente para viajes activos
    return Promise.all(viajes.map(async (viaje) => {
      const viajesCompletados = await this.prisma.usoVehiculo.count({
        where: {
          vehiculoId: viaje.vehiculoId,
          fechaFin: { not: null },
        },
      });
      const nuevoContador = viajesCompletados + 1;
      const debeLavar = nuevoContador % 4 === 0;
      return { ...viaje, debeLavar };
    }));
  }

  // Obtener viajes activos del usuario actual
  async findActivosPorUsuario(usuarioId: number) {
    const viajes = await this.prisma.usoVehiculo.findMany({
      where: { 
        fechaFin: null,
        usuarioId: usuarioId,
      },
      select: {
        id: true,
        usuarioId: true,
        vehiculoId: true,
        fechaInicio: true,
        fechaFin: true,
        kmInicial: true,
        kmFinal: true,
        gasolinaInicial: true,
        gasolinaFinal: true,
        estadoDevolucion: true,
        observaciones: true,
        debeLavar: true,
        lavo: true,
        createdAt: true,
        updatedAt: true,
        usuario: {
          select: {
            id: true,
            nombre: true,
            email: true,
          },
        },
        vehiculo: {
          select: {
            id: true,
            placa: true,
            marca: true,
            modelo: true,
          },
        },
      },
      orderBy: { fechaInicio: 'desc' },
    });

    // Calcular debeLavar dinámicamente para viajes activos
    return Promise.all(viajes.map(async (viaje) => {
      const viajesCompletados = await this.prisma.usoVehiculo.count({
        where: {
          vehiculoId: viaje.vehiculoId,
          fechaFin: { not: null },
        },
      });
      const nuevoContador = viajesCompletados + 1;
      const debeLavar = nuevoContador % 4 === 0;
      return { ...viaje, debeLavar };
    }));
  }

  // Obtener todos los viajes del usuario actual
  findAllPorUsuario(usuarioId: number) {
    return this.prisma.usoVehiculo.findMany({
      where: { 
        usuarioId: usuarioId,
      },
      select: {
        id: true,
        usuarioId: true,
        vehiculoId: true,
        fechaInicio: true,
        fechaFin: true,
        kmInicial: true,
        kmFinal: true,
        gasolinaInicial: true,
        gasolinaFinal: true,
        estadoDevolucion: true,
        observaciones: true,
        debeLavar: true,
        lavo: true,
        createdAt: true,
        updatedAt: true,
        usuario: {
          select: {
            id: true,
            nombre: true,
            email: true,
          },
        },
        vehiculo: {
          select: {
            id: true,
            placa: true,
            marca: true,
            modelo: true,
          },
        },
      },
      orderBy: { fechaInicio: 'desc' },
    });
  }

  findOne(id: number) {
    return this.prisma.usoVehiculo.findUnique({
      where: { id },
      include: {
        usuario: true,
        vehiculo: true,
        evidencias: true,
      },
    });
  }

  async iniciarViaje(usuarioId: number, data: IniciarViajeDto) {
    console.log('📌 INTENTO DE INICIO DE VIAJE');
    console.log('Usuario ID:', usuarioId);
    console.log('Datos recibidos:', data);
    
    // 1. Validar si circula hoy
    // const estadoCirculacion = await this.circulacionService.verificarVehiculo(data.vehiculoId);
    
    // (Opcional: descomentar restricción)
    /* 
    if (!estadoCirculacion.puedeCircular) {
       throw new BadRequestException(`El vehículo no puede circular hoy. Razón: ${estadoCirculacion.razon}`);
    } 
    */

    // 2. Validar vehículo (una sola consulta)
    const vehiculo = await this.prisma.vehiculo.findUnique({ 
        where: { id: data.vehiculoId } 
    });
    
    console.log('🔍 Vehículo encontrado:', vehiculo);

    if (!vehiculo) {
        console.error('❌ Error: Vehículo no encontrado en BD');
        throw new BadRequestException('Vehículo no encontrado');
    }
    
    if (vehiculo.estado === 'en_uso') {
        console.error('❌ Error: El vehículo ya figura como EN USO en la BD');
        throw new BadRequestException('El vehículo ya está en uso');
    }

    // 3. Validación Odómetro (Corrección de tipos)
    const kmActual = Number(vehiculo.kilometrajeActual) || 0;
    
     
    if (kmActual > data.kmInicial){
      throw new BadRequestException(
        `Error de odómetro: El vehículo tiene ${kmActual} km registrados, no puedes iniciar con ${data.kmInicial} km.`
      );
    }
    

    // 4. Actualizar estado y crear viaje en una transacción
    return this.prisma.$transaction(async (tx) => {
        await tx.vehiculo.update({
            where: { id: data.vehiculoId },
            data: { estado: 'en_uso' },
        });

        return tx.usoVehiculo.create({
            data: {
                usuarioId,
                vehiculoId: data.vehiculoId,
                kmInicial: data.kmInicial,
                gasolinaInicial: data.gasolinaInicial ?? 0,
            },
            include: {
                usuario: { select: { nombre: true, email: true } },
                vehiculo: { select: { placa: true, marca: true, modelo: true } },
            },
        });
    });
  }

  async finalizarViaje(id: number, kmFinal: number, gasolinaFinal?: number, observaciones?: string) {
    // Obtener el uso del vehículo
    const uso = await this.prisma.usoVehiculo.findUnique({
      where: { id },
      include: { vehiculo: true },
    });

    if (!uso) {
      throw new BadRequestException('Viaje no encontrado');
    }

    // Contar viajes completados para este vehículo (todos, no solo sin lavar)
    const viajesCompletados = await this.prisma.usoVehiculo.count({
      where: {
        vehiculoId: uso.vehiculoId,
        fechaFin: { not: null },
      },
    });

    // Nuevo contador: viajes completados + 1 (este viaje que se está completando)
    const nuevoContador = viajesCompletados + 1;

    // Marcar lavado en el 4to, 8vo, 12vo... viaje
    const debeLavar = nuevoContador % 4 === 0;

    // Verificar si el viaje requiere lavado y si aún no está lavado
    if (debeLavar && !uso.lavo) {
      throw new BadRequestException('No se puede finalizar el viaje. Primero debe marcar el vehículo como lavado con evidencia fotográfica.');
    }

    // Actualizar registro de uso
    const updatedUso = await this.prisma.usoVehiculo.update({
      where: { id },
      data: {
        fechaFin: new Date(),
        kmFinal: new Prisma.Decimal(kmFinal.toString()),
        gasolinaFinal: gasolinaFinal ? new Prisma.Decimal(gasolinaFinal.toString()) : null,
        observaciones: observaciones || null,
        debeLavar: debeLavar,
      },
    });

    // Obtener usuario del viaje para notificaciones
    const usuarioViaje = await this.prisma.usoVehiculo.findUnique({
      where: { id },
      select: { usuarioId: true, vehiculo: { select: { placa: true } } },
    });

    // Notificación de aviso en viaje 4, 8, 12... (el próximo usuario debe lavar)
    if (usuarioViaje && nuevoContador % 4 === 0) {
      await this.prisma.notificacion.create({
        data: {
          usuarioId: usuarioViaje.usuarioId,
          tipo: 'lavado_proximo',
          mensaje: ` El próximo usuario debe lavar el vehículo ${usuarioViaje.vehiculo.placa}`,
        },
      });
    }

    // Si debe lavar, crear notificación para el usuario que completó el viaje
    if (debeLavar) {
      if (usuarioViaje) {
        await this.prisma.notificacion.create({
          data: {
            usuarioId: usuarioViaje.usuarioId,
            tipo: 'lavado_pendiente',
            mensaje: `El vehículo ${usuarioViaje.vehiculo.placa} ha completado 4 viajes. ¡Es hora de lavarlo!`,
          },
        });
      }
    }

    // Actualizar kilometraje del vehículo
    await this.prisma.vehiculo.update({
      where: { id: uso.vehiculoId },
      data: {
        kilometrajeActual: kmFinal,
        estado: 'disponible',
      },
    });

    return updatedUso;
  }

  async marcarLavado(id: number) {
    // Obtener el uso del vehículo
    const uso = await this.prisma.usoVehiculo.findUnique({
      where: { id },
      include: { vehiculo: true },
    });

    if (!uso) {
      throw new BadRequestException('Viaje no encontrado');
    }

    // Marcar como lavado
    const updated = await this.prisma.usoVehiculo.update({
      where: { id },
      data: {
        lavo: true,
        debeLavar: false,
      },
    });

    // Actualizar estado del vehículo
    await this.prisma.vehiculo.update({
      where: { id: uso.vehiculoId },
      data: {
        estado: 'disponible',
      },
    });

    return updated;
  }

  async getNotificacionesUsuario(usuarioId: number) {
    return this.prisma.notificacion.findMany({
      where: { usuarioId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async marcarNotificacionLeida(notificacionId: number) {
    return this.prisma.notificacion.update({
      where: { id: notificacionId },
      data: { leida: true },
    });
  }
}
