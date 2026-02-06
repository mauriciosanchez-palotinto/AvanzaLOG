import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { PrismaModule } from '@common/prisma/prisma.module';
import { AuthModule } from '@modules/auth/auth.module';
import { UsuariosModule } from '@modules/usuarios/usuarios.module';
import { VehiculosModule } from '@modules/vehiculos/vehiculos.module';
import { UsoVehiculoModule } from '@modules/uso-vehiculo/uso-vehiculo.module';
import { VerificacionModule } from '@/modules/verificacion/module/verificacion.module';
import { CirculacionModule } from '@/modules/circulacion/module/circulacion.module';
import { NotificacionesModule } from '@modules/notificaciones/notificaciones.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your_secret_key',
      signOptions: { expiresIn: (process.env.JWT_EXPIRATION as any) || '24h' },
    }),
    AuthModule,
    UsuariosModule,
    VehiculosModule,
    UsoVehiculoModule,
    VerificacionModule,
    CirculacionModule,
    NotificacionesModule,
  ],
})
export class AppModule {}
