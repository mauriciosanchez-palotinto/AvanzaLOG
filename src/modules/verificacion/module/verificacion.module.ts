import { Module } from '@nestjs/common';
import { VerificacionService } from '../service/verificacion.service';
import { VerificacionController } from '../controller/verificacion.controller';
import { PrismaModule } from '@/common/prisma/prisma.module';

@Module({
  imports:[PrismaModule],
  controllers: [VerificacionController],
  providers: [VerificacionService],
})
export class VerificacionModule {}
