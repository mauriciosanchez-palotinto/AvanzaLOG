import { Module } from '@nestjs/common';
import { UsoVehiculoController } from './uso-vehiculo.controller';
import { UsoVehiculoService } from './uso-vehiculo.service';
import { EvidenciaService } from './evidencia.service';
import { PrismaModule } from '@common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UsoVehiculoController],
  providers: [UsoVehiculoService, EvidenciaService],
  exports: [UsoVehiculoService, EvidenciaService],
})
export class UsoVehiculoModule {}
