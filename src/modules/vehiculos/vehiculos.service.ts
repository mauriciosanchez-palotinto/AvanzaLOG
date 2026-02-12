import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';

@Injectable()
export class VehiculosService {
  constructor(private prisma: PrismaService) {}

  async findAll(filtro: 'activos' | 'inactivos' | 'todos' = 'activos') {
    let whereCondition = {};

    switch (filtro) {
      case 'activos':
        whereCondition = { activo: true };
        break;
      case 'inactivos':
        whereCondition = { activo: false };
        break;
      case 'todos':
        whereCondition = {};
        break;
      default:
        whereCondition = { activo: true };
        break;
    }

    return this.prisma.vehiculo.findMany({
      where: whereCondition,
      orderBy: { id: 'asc' },
    });
  }

  findOne(id: number) {
    return this.prisma.vehiculo.findUnique({
      where: { id },
      include: {
        verificaciones: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        usos: {
          orderBy: { fechaInicio: 'desc' },
          take: 10,
        },
      },
    });
  }

  estadoActual(id: number) {
    return this.prisma.vehiculo.findUnique({
      where: { id },
      select: {
        id: true,
        placa: true,
        estado: true,
        kilometrajeActual: true,
        updatedAt: true,
      },
    });
  }

  historialUsos(id: number) {
    return this.prisma.usoVehiculo.findMany({
      where: { vehiculoId: id },
      include: {
        usuario: true,
        evidencias: true,
      },
      orderBy: { fechaInicio: 'desc' },
    });
  }

  actualizarEstado(id: number, estado: string) {
    return this.prisma.vehiculo.update({
      where: { id },
      data: { estado },
    });
  }

  update(id: number, data: any) {
    return this.prisma.vehiculo.update({
      where: { id },
      data: {
        marca: data.marca,
        modelo: data.modelo,
        color: data.color,
        ano: data.ano,
        kilometrajeActual: data.kilometrajeActual,
      },
    });
  }

  create(data: any) {
    return this.prisma.vehiculo.create({
      data: {
        placa: data.placa,
        marca: data.marca,
        modelo: data.modelo,
        ano: data.ano,
        color: data.color,
        estado: 'disponible',
        activo: true,
      },
    });
  }

  async toggleActivo(id: number) {
    const vehiculo = await this.prisma.vehiculo.findUnique({ where: { id } });
    if (!vehiculo) return null;

    const nuevoEstadoActivo = !vehiculo.activo;

    return this.prisma.vehiculo.update({
      where: { id },
      data: { 
        activo: nuevoEstadoActivo,
        // Si se desactiva, cambiar estado a 'mantenimiento'. Si se activa, a 'disponible'
        estado: nuevoEstadoActivo ? 'disponible' : 'mantenimiento'
      },
      select: {
        id: true,
        placa: true,
        activo: true,
        estado: true,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.vehiculo.delete({
      where: { id },
      select: { id: true, placa: true },
    });
  }
}
