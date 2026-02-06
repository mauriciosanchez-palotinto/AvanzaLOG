import { Module } from '@nestjs/common';
import { CirculacionService } from '../services/circulacion.service';
import { CirculacionController } from '../controller/circulacion.controller';
import { PrismaModule } from '../../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CirculacionController],
  providers: [CirculacionService],
  exports: [CirculacionService] 
})
export class CirculacionModule {}