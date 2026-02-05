import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';

@Injectable()
export class VehiculosService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.vehiculo.findMany({
      include: {
        verificaciones: {
          where: { vigente: true },
          take: 1,
          orderBy: { fechaVencimiento: 'desc' },
        },
      },
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
    return this.prisma.vehiculo.update({
      where: { id },
      data: { activo: !vehiculo?.activo },
      select: {
        id: true,
        placa: true,
        activo: true,
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
