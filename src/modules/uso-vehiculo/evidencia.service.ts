import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EvidenciaService {
  private readonly uploadDir = path.join(process.cwd(), 'uploads');

  constructor(private prisma: PrismaService) {
    // Crear directorio de uploads si no existe
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadEvidencia(
    usoId: number,
    file: Express.Multer.File,
    tipo: 'inicio' | 'fin' | 'lavado' | 'daño' | 'general' = 'general'
  ) {
    if (!file) {
      throw new Error('No file uploaded');
    }

    // Generar nombre único para el archivo
    const timestamp = Date.now();
    const nombreArchivo = `${usoId}_${tipo}_${timestamp}_${file.originalname}`;
    const rutaArchivo = path.join(this.uploadDir, nombreArchivo);

    // Guardar archivo en el servidor
    fs.writeFileSync(rutaArchivo, file.buffer);

    // Guardar referencia en BD
    const evidencia = await this.prisma.evidencia.create({
      data: {
        usoId,
        tipo,
        urlArchivo: `/uploads/${nombreArchivo}`,
        nombreArchivo: file.originalname,
      },
    });

    return evidencia;
  }

  async getEvidencias(usoId: number) {
    return this.prisma.evidencia.findMany({
      where: { usoId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteEvidencia(evidenciaId: number) {
    const evidencia = await this.prisma.evidencia.findUnique({
      where: { id: evidenciaId },
    });

    if (!evidencia) {
      throw new Error('Evidencia no encontrada');
    }

    // Eliminar archivo del servidor
    const rutaArchivo = path.join(process.cwd(), evidencia.urlArchivo);
    if (fs.existsSync(rutaArchivo)) {
      fs.unlinkSync(rutaArchivo);
    }

    // Eliminar referencia de BD
    return this.prisma.evidencia.delete({
      where: { id: evidenciaId },
    });
  }
}
