import {  IsInt,IsOptional, IsString, MaxLength, IsIn, IsDateString } from 'class-validator'

export class CreateVerificacionDto{
   @IsInt()
   vehiculoId: number;

   @IsDateString()
   fechaVerificacion: string;

   @IsDateString()
   fechaVencimiento: string;

   @IsString()
   @IsOptional()
   @IsIn(['normal', 'doble', 'exenta'])
   tipo?: string;

   @IsString()
   @MaxLength(2)
   @IsIn(['00', '01', '02'])
   resultado: string; //donde 00 = aprobado, 01= rechazado y 02 condicionado

   @IsString()
   @IsOptional()
   @MaxLength(50)
   folioVerificacion?: string;

   @IsString()
   @IsOptional()
   @MaxLength(100)
   centroVerificacion?: string;

   @IsString()
   @IsOptional()
   @MaxLength(100)
   comprobanteUrl?: string;

   @IsString()
   @IsOptional()
   observaciones?: string;
}