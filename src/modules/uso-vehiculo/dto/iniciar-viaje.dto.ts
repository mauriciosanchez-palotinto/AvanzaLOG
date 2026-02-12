import { IsInt, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class IniciarViajeDto {
  @IsInt()
  vehiculoId: number;

  @IsNumber()
  @Min(0, {message: 'El kilometraje no debe ser negativo'})
  kmInicial: number;

  @IsNumber()
  @IsOptional()
  @Min(0, {message: "La gasolina no debe ser negativa"})
  @Max(100, {message: 'message: el porcentaje de gasolina no puede exceder del 100%'})
  gasolinaInicial?: number;
}
