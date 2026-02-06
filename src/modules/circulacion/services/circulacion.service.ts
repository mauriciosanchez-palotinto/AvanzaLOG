import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@/common/prisma/prisma.service";

@Injectable()
export class CirculacionService{
    constructor(private prisma: PrismaService){}
    //Reglas del hoy no circula... Son estaticas asi que la podemos cambiar
    private reglas ={
        1: ['5', '6'], // lunes
        2: ['7', '8'], //martes
        3: ['3', '4'], //miercoles
        4: ['1', '2'], //jueves
        5: ['9', '0'], //viernes
        //los sabados y domingos los dejare libres ya que suele ser complejo, por el momento 
        //los dejo libres
        6: [],
        0: [],
    };

    async verificarVehiculo(vehiculoId: number){
        const vehiculo = await this.prisma.vehiculo.findUnique({
            where: {id: vehiculoId},
        });

        if(!vehiculo){
            throw new NotFoundException(`Vehiculo con ID ${vehiculoId} no encontrado`);
        }
        return this.calcularCirculacion(vehiculo.placa, vehiculo);
    }

    private calcularCirculacion(placa: string, vehiculoDatos: any){
        const ultimoDigito = placa.slice(-1);
        const diaSemana = new Date().getDay();

        //obtener digitios restringidos para hoy 
        const digitosNoCirculan = this.reglas[diaSemana];

        const restringidoHoy = digitosNoCirculan.includes(ultimoDigito);

        return{
            vehiculo: `${vehiculoDatos.marca} ${vehiculoDatos.modelo}`,
            placa: placa,
            fecha: new Date(),
            diaSemana: diaSemana,
            puedeCircular: !restringidoHoy,
            razon: restringidoHoy ? `Hoy no circulan placas terminadas en ${ultimoDigito}` : 'Sin restricciones activas',
            digitosNoCirculan: digitosNoCirculan,
        };
    }

    obtenerReglasSemanales(){
        return{
            mensaje: "Reglas de circulacion estandar",
            reglas: {
                lunes: "Terminación 5 y 6",
                martes: "Terminación 7 y 8",
                miercoles: "Terminación 3 y 4",
                jueves: "Terminación 1 y 2",
                viernes: "Terminación 9 y 0, permisos y letras",                
            }
        };
    }
}