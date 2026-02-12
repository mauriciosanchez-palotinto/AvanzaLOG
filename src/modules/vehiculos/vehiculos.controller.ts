import { Controller, Get, Post, Param, Put, Delete, Body, UseGuards, Query } from '@nestjs/common';
import { VehiculosService } from './vehiculos.service';
import { JwtGuard } from '@common/guards/jwt.guard';

@Controller('vehiculos')
export class VehiculosController {
  constructor(private readonly vehiculosService: VehiculosService) {}

  @Get()
  findAll(@Query('filtro') filtro?: 'activos' | 'inactivos' | 'todos') {
    return this.vehiculosService.findAll(filtro);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vehiculosService.findOne(+id);
  }

  @Get(':id/estado')
  estadoVehiculo(@Param('id') id: string) {
    return this.vehiculosService.estadoActual(+id);
  }

  @Get(':id/historial')
  historialUsos(@Param('id') id: string) {
    return this.vehiculosService.historialUsos(+id);
  }

  @UseGuards(JwtGuard)
  @Post()
  create(@Body() body: any) {
    return this.vehiculosService.create(body);
  }

  @UseGuards(JwtGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.vehiculosService.update(+id, body);
  }

  @UseGuards(JwtGuard)
  @Put(':id/estado')
  actualizarEstado(@Param('id') id: string, @Body() body: { estado: string }) {
    return this.vehiculosService.actualizarEstado(+id, body.estado);
  }

  @UseGuards(JwtGuard)
  @Put(':id/toggle-activo')
  toggleActivo(@Param('id') id: string) {
    return this.vehiculosService.toggleActivo(+id);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vehiculosService.remove(+id);
  }
}
