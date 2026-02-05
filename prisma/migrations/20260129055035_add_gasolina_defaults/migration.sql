-- AlterTable
ALTER TABLE "vehiculo" ADD COLUMN     "gasolinaFinal" DECIMAL(5,2) NOT NULL DEFAULT 50,
ADD COLUMN     "gasolinaInicial" DECIMAL(5,2) NOT NULL DEFAULT 100;
