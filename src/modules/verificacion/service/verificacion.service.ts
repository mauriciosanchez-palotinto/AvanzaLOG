import {Injectable, NotFoundException} from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { CreateVerificacionDto } from '../dto/create-verificacion.dto';

@Injectable()
export class VerificacionService{
    constructor(private prisma: PrismaService) {}

    async create(data: CreateVerificacionDto, usuarioId: number){
        //verificamos si el vehiculo existe 
        const vehiculo = await this.prisma.vehiculo.findUnique({
           where: {id: data.vehiculoId}, 
        });

        if(!vehiculo){
            throw new NotFoundException(`Vehículo con ID ${data.vehiculoId} no encontrado`); 
        }

        return this.prisma.verificacion.create({
            data: {
                vehiculoId: data.vehiculoId,
                usuarioRegistroId: usuarioId,
                fechaVerificacion: new Date(data.fechaVerificacion),
                fechaVencimiento: new Date(data.fechaVencimiento),
                tipo: data.tipo || 'normal',
                resultado: data.resultado,
                folioVerificacion: data.folioVerificacion,
                centroVerificacion: data.centroVerificacion,
                comprobanteUrl: data.comprobanteUrl,
                observaciones: data.observaciones,
                vigente: true //al crearla estara vigente 
            },
        });
    }

    async findByVehiculo(vehiculoId: number){
        return this.prisma.verificacion.findMany({
            where: { vehiculoId },
            orderBy: {fechaVerificacion: 'desc'},
        });
    }
}