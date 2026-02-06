import { Controller, Get, Param, UseGuards, ParseIntPipe } from "@nestjs/common";
import { CirculacionService } from "../services/circulacion.service";
import { JwtGuard } from "@/common/guards/jwt.guard";

@Controller('circulacion')
@UseGuards(JwtGuard)
export class CirculacionController{
    constructor(private readonly circulacionService: CirculacionService){}

    @Get('reglas')
    getReglas(){
        return this.circulacionService.obtenerReglasSemanales();
    }

    @Get('verificar/:vehiculoId')
    verificarVehiculo(@Param('vehiculoId', ParseIntPipe) vehiculoId: number){
        return this.circulacionService.verificarVehiculo(vehiculoId);
    }
}