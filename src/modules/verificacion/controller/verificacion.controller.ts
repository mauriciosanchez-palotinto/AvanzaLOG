import { Controller, Get, Post, Body, Param, UseGuards, ParseIntPipe, Request } from "@nestjs/common";
import { VerificacionService } from "../service/verificacion.service";
import { CreateVerificacionDto } from "../dto/create-verificacion.dto";
import { JwtGuard } from "@/common/guards/jwt.guard";

@Controller('verificaciones')
@UseGuards(JwtGuard)
export class VerificacionController{
    constructor(private readonly verificacionService: VerificacionService) {}

    @Post()
    create(@Body() createDto: CreateVerificacionDto, @Request() req) {
        //console.log('usuario en request: ',req.user)
        const usuarioId = req.user.userId;
        if(!usuarioId){
            throw new Error("No se puede obtener el id del usaurio del token");
        }
        //se obtiene el id del usuario logeado usando el token
        return this.verificacionService.create(createDto, usuarioId)
    }

    @Get('vehiculo/:vehiculoId')
    findByVehiculo(@Param('vehiculoId', ParseIntPipe) vehiculoId: number){
        return this.verificacionService.findByVehiculo(vehiculoId);
    }
}