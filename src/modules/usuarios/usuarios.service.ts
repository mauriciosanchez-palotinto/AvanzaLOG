import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.usuario.findMany({
      select: {
        id: true,
        nombre: true,
        email: true,
        telefono: true,
        esAdmin: true,
        activo: true,
        createdAt: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true,
        nombre: true,
        email: true,
        telefono: true,
        esAdmin: true,
        activo: true,
        createdAt: true,
      },
    });
  }

  historialUsos(id: number) {
    return this.prisma.usoVehiculo.findMany({
      where: { usuarioId: id },
      include: {
        vehiculo: true,
        evidencias: true,
      },
      orderBy: { fechaInicio: 'desc' },
    });
  }

  async update(id: number, data: any) {
    const updateData: any = {
      nombre: data.nombre,
      email: data.email,
      telefono: data.telefono,
    };

    if (data.password) {
      updateData.passwordHash = await bcrypt.hash(data.password, 10);
    }

    return this.prisma.usuario.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        nombre: true,
        email: true,
        telefono: true,
        activo: true,
      },
    });
  }

  async create(data: any) {
    return this.prisma.usuario.create({
      data: {
        nombre: data.nombre,
        email: data.email,
        telefono: data.telefono,
        passwordHash: await bcrypt.hash(data.password, 10),
        activo: true,
        esAdmin: false,
      },
      select: {
        id: true,
        nombre: true,
        email: true,
        telefono: true,
        activo: true,
      },
    });
  }

  async toggleActivo(id: number) {
    const usuario = await this.prisma.usuario.findUnique({ where: { id } });
    return this.prisma.usuario.update({
      where: { id },
      data: { activo: !usuario?.activo },
      select: {
        id: true,
        nombre: true,
        email: true,
        activo: true,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.usuario.delete({
      where: { id },
      select: { id: true, nombre: true },
    });
  }

  async miPerfil(usuarioId: number) {
    return this.prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: {
        id: true,
        nombre: true,
        email: true,
        telefono: true,
        esAdmin: true,
        activo: true,
        createdAt: true,
      },
    });
  }

  async cambiarContrasena(usuarioId: number, passwordActual: string, passwordNueva: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
    });

    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    const passwordValida = await bcrypt.compare(passwordActual, usuario.passwordHash);
    if (!passwordValida) {
      throw new Error('Contraseña actual incorrecta');
    }

    const passwordHashNueva = await bcrypt.hash(passwordNueva, 10);

    return this.prisma.usuario.update({
      where: { id: usuarioId },
      data: { passwordHash: passwordHashNueva },
      select: {
        id: true,
        nombre: true,
        email: true,
        activo: true,
      },
    });
  }
}
