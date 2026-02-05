import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsoVehiculoService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.usoVehiculo.findMany({
      include: {
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

  findActivos() {
    return this.prisma.usoVehiculo.findMany({
      where: { fechaFin: null },
      include: {
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

  async iniciarViaje(usuarioId: number, vehiculoId: number, kmInicial: number, gasolinaInicial?: number) {
    // Cambiar estado del vehículo a en_uso
    await this.prisma.vehiculo.update({
      where: { id: vehiculoId },
      data: { estado: 'en_uso' },
    });

    // Crear registro de uso
    return this.prisma.usoVehiculo.create({
      data: {
        usuarioId,
        vehiculoId,
        kmInicial: kmInicial,
        gasolinaInicial: gasolinaInicial ?? 0,
      },
      include: {
        usuario: {
          select: {
            nombre: true,
            email: true,
          },
        },
        vehiculo: {
          select: {
            placa: true,
            marca: true,
            modelo: true,
          },
        },
      },
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
          mensaje: `⚠️ El próximo usuario debe lavar el vehículo ${usuarioViaje.vehiculo.placa}`,
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
