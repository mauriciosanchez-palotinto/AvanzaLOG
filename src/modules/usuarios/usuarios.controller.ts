import { Controller, Get, Post, Param, Put, Delete, Body, UseGuards, Req } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { JwtGuard } from '@common/guards/jwt.guard';

@Controller('usuarios')
@UseGuards(JwtGuard)
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get('mi-perfil')
  miPerfil(@Req() req: any) {
    return this.usuariosService.miPerfil(req.user.userId);
  }

  @Put('cambiar-contrasena')
  async cambiarContrasena(@Req() req: any, @Body() body: { passwordActual: string; passwordNueva: string }) {
    return this.usuariosService.cambiarContrasena(req.user.userId, body.passwordActual, body.passwordNueva);
  }

  @Get()
  findAll() {
    return this.usuariosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(+id);
  }

  @Get(':id/historial')
  historialUsos(@Param('id') id: string) {
    return this.usuariosService.historialUsos(+id);
  }

  @Post()
  create(@Body() body: any) {
    return this.usuariosService.create(body);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.usuariosService.update(+id, body);
  }

  @Put(':id/toggle-activo')
  toggleActivo(@Param('id') id: string) {
    return this.usuariosService.toggleActivo(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuariosService.remove(+id);
  }
}
