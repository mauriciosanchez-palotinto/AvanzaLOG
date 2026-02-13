import { Controller, Get, Post, Put, Param, Body, UseGuards, UseInterceptors, UploadedFile, BadRequestException, Request } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsoVehiculoService } from './uso-vehiculo.service';
import { EvidenciaService } from './evidencia.service';
import { JwtGuard } from '@common/guards/jwt.guard';
import { IniciarViajeDto } from './dto/iniciar-viaje.dto';

@Controller('viajes')
@UseGuards(JwtGuard)
export class UsoVehiculoController {
  constructor(
    private readonly usoVehiculoService: UsoVehiculoService,
    private readonly evidenciaService: EvidenciaService,
  ) {}

  @Get('activos')
  findActivos() {
    return this.usoVehiculoService.findActivos();
  }

  @Get('mis-viajes/activos')
  findMisViajesActivos(@Request() req) {
    const usuarioId = req.user.userId || req.user.id;
    return this.usoVehiculoService.findActivosPorUsuario(usuarioId);
  }

  @Get('mis-viajes')
  findMisViajes(@Request() req) {
    const usuarioId = req.user.userId || req.user.id;
    return this.usoVehiculoService.findAllPorUsuario(usuarioId);
  }

  @Get('notificaciones/:usuarioId')
  getNotificaciones(@Param('usuarioId') usuarioId: string) {
    return this.usoVehiculoService.getNotificacionesUsuario(+usuarioId);
  }

  @Get()
  findAll() {
    return this.usoVehiculoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usoVehiculoService.findOne(+id);
  }

  @Post('iniciar')
  iniciar(@Body() body: IniciarViajeDto, @Request() req) {
    const usuarioId = req.user.userId || req.user.id;
    return this.usoVehiculoService.iniciarViaje(usuarioId, body);
  }

  @Put(':id/finalizar')
  finalizar(@Param('id') id: string, @Body() body: { kmFinal: number; gasolinaFinal?: number; observaciones?: string }) {
    return this.usoVehiculoService.finalizarViaje(+id, body.kmFinal, body.gasolinaFinal, body.observaciones);
  }

  @Put(':id/marcar-lavado')
  marcarLavado(@Param('id') id: string) {
    return this.usoVehiculoService.marcarLavado(+id);
  }

  @Post(':id/evidencia')
  @UseInterceptors(FileInterceptor('file'))
  async uploadEvidencia(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('tipo') tipo: string = 'general'
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    return this.evidenciaService.uploadEvidencia(+id, file, tipo as any);
  }

  @Get(':id/evidencias')
  getEvidencias(@Param('id') id: string) {
    return this.evidenciaService.getEvidencias(+id);
  }

  @Post('evidencia/:evidenciaId/eliminar')
  deleteEvidencia(@Param('evidenciaId') evidenciaId: string) {
    return this.evidenciaService.deleteEvidencia(+evidenciaId);
  }

  @Put('notificacion/:notificacionId/leer')
  marcarNotificacionLeida(@Param('notificacionId') notificacionId: string) {
    return this.usoVehiculoService.marcarNotificacionLeida(+notificacionId);
  }
}
