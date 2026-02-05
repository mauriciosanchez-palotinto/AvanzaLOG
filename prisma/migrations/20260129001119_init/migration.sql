-- CreateTable
CREATE TABLE "usuario" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "telefono" VARCHAR(20),
    "passwordHash" VARCHAR(255) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "esAdmin" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rol" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "descripcion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario_rol" (
    "usuarioId" INTEGER NOT NULL,
    "rolId" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuario_rol_pkey" PRIMARY KEY ("usuarioId","rolId")
);

-- CreateTable
CREATE TABLE "permiso" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "permiso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rol_permiso" (
    "rolId" INTEGER NOT NULL,
    "permisoId" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rol_permiso_pkey" PRIMARY KEY ("rolId","permisoId")
);

-- CreateTable
CREATE TABLE "vehiculo" (
    "id" SERIAL NOT NULL,
    "marca" VARCHAR(50) NOT NULL,
    "modelo" VARCHAR(50) NOT NULL,
    "placa" VARCHAR(20) NOT NULL,
    "ano" INTEGER NOT NULL,
    "color" VARCHAR(30),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "estado" VARCHAR(20) NOT NULL DEFAULT 'disponible',
    "kilometrajeActual" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehiculo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "uso_vehiculo" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "vehiculoId" INTEGER NOT NULL,
    "cicloLavadoId" INTEGER,
    "fechaInicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaFin" TIMESTAMP(3),
    "kmInicial" DECIMAL(10,2) NOT NULL,
    "kmFinal" DECIMAL(10,2),
    "gasolinaInicial" DECIMAL(5,2) NOT NULL,
    "gasolinaFinal" DECIMAL(5,2),
    "estadoDevolucion" VARCHAR(20) NOT NULL DEFAULT 'bueno',
    "observaciones" TEXT,
    "debeLavar" BOOLEAN NOT NULL DEFAULT false,
    "lavo" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "uso_vehiculo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ciclo_lavado" (
    "id" SERIAL NOT NULL,
    "vehiculoId" INTEGER NOT NULL,
    "numeroCiclo" INTEGER NOT NULL DEFAULT 1,
    "fechaInicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaLavado" TIMESTAMP(3),
    "usuarioLavadoId" INTEGER,
    "completado" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ciclo_lavado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evidencia" (
    "id" SERIAL NOT NULL,
    "usoId" INTEGER NOT NULL,
    "tipo" VARCHAR(20) NOT NULL,
    "urlArchivo" VARCHAR(500) NOT NULL,
    "nombreArchivo" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "evidencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verificacion" (
    "id" SERIAL NOT NULL,
    "vehiculoId" INTEGER NOT NULL,
    "usuarioRegistroId" INTEGER NOT NULL,
    "fechaVerificacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaVencimiento" TIMESTAMP(3) NOT NULL,
    "tipo" VARCHAR(20) NOT NULL DEFAULT 'normal',
    "resultado" VARCHAR(2) NOT NULL,
    "comprobanteUrl" VARCHAR(500),
    "folioVerificacion" VARCHAR(50),
    "centroVerificacion" VARCHAR(100),
    "vigente" BOOLEAN NOT NULL DEFAULT false,
    "observaciones" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verificacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "regla_circulacion" (
    "id" SERIAL NOT NULL,
    "ciudad" VARCHAR(50) NOT NULL DEFAULT 'CDMX',
    "tipoVehiculo" VARCHAR(30) NOT NULL DEFAULT 'particulares',
    "digitoProhibido" VARCHAR(10) NOT NULL,
    "descripcionDias" VARCHAR(100),
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3),
    "horarioInicio" VARCHAR(5) NOT NULL DEFAULT '05:00',
    "horarioFin" VARCHAR(5) NOT NULL DEFAULT '22:00',
    "excepciones" TEXT NOT NULL DEFAULT '[]',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "regla_circulacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calendario_circulacion" (
    "id" SERIAL NOT NULL,
    "vehiculoId" INTEGER NOT NULL,
    "fecha" DATE NOT NULL,
    "puedeCircular" BOOLEAN NOT NULL,
    "razon" VARCHAR(100),
    "reglaAplicadaId" INTEGER,
    "calculadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "calendario_circulacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bloqueo_vehiculo" (
    "id" SERIAL NOT NULL,
    "vehiculoId" INTEGER NOT NULL,
    "tipo" VARCHAR(30) NOT NULL,
    "fechaBloqueo" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaDesbloqueo" TIMESTAMP(3),
    "motivo" TEXT NOT NULL,
    "usuarioBloqueoId" INTEGER NOT NULL,
    "usuarioDesbloqueId" INTEGER,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bloqueo_vehiculo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notificacion" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "tipo" VARCHAR(30) NOT NULL,
    "mensaje" TEXT NOT NULL,
    "leida" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notificacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auditoria" (
    "id" SERIAL NOT NULL,
    "tablaAfectada" VARCHAR(50) NOT NULL,
    "registroId" INTEGER NOT NULL,
    "accion" VARCHAR(10) NOT NULL,
    "datosAnteriores" TEXT,
    "datosNuevos" TEXT,
    "usuarioId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auditoria_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- CreateIndex
CREATE INDEX "usuario_email_idx" ON "usuario"("email");

-- CreateIndex
CREATE INDEX "usuario_activo_idx" ON "usuario"("activo");

-- CreateIndex
CREATE UNIQUE INDEX "rol_nombre_key" ON "rol"("nombre");

-- CreateIndex
CREATE INDEX "usuario_rol_usuarioId_idx" ON "usuario_rol"("usuarioId");

-- CreateIndex
CREATE INDEX "usuario_rol_rolId_idx" ON "usuario_rol"("rolId");

-- CreateIndex
CREATE UNIQUE INDEX "permiso_nombre_key" ON "permiso"("nombre");

-- CreateIndex
CREATE INDEX "rol_permiso_rolId_idx" ON "rol_permiso"("rolId");

-- CreateIndex
CREATE UNIQUE INDEX "vehiculo_placa_key" ON "vehiculo"("placa");

-- CreateIndex
CREATE INDEX "vehiculo_placa_idx" ON "vehiculo"("placa");

-- CreateIndex
CREATE INDEX "vehiculo_estado_idx" ON "vehiculo"("estado");

-- CreateIndex
CREATE INDEX "vehiculo_activo_idx" ON "vehiculo"("activo");

-- CreateIndex
CREATE INDEX "uso_vehiculo_usuarioId_idx" ON "uso_vehiculo"("usuarioId");

-- CreateIndex
CREATE INDEX "uso_vehiculo_vehiculoId_idx" ON "uso_vehiculo"("vehiculoId");

-- CreateIndex
CREATE INDEX "uso_vehiculo_fechaInicio_idx" ON "uso_vehiculo"("fechaInicio");

-- CreateIndex
CREATE INDEX "uso_vehiculo_debeLavar_idx" ON "uso_vehiculo"("debeLavar");

-- CreateIndex
CREATE INDEX "uso_vehiculo_cicloLavadoId_idx" ON "uso_vehiculo"("cicloLavadoId");

-- CreateIndex
CREATE INDEX "ciclo_lavado_vehiculoId_idx" ON "ciclo_lavado"("vehiculoId");

-- CreateIndex
CREATE INDEX "ciclo_lavado_completado_idx" ON "ciclo_lavado"("completado");

-- CreateIndex
CREATE UNIQUE INDEX "ciclo_lavado_vehiculoId_completado_key" ON "ciclo_lavado"("vehiculoId", "completado");

-- CreateIndex
CREATE INDEX "evidencia_usoId_idx" ON "evidencia"("usoId");

-- CreateIndex
CREATE INDEX "evidencia_tipo_idx" ON "evidencia"("tipo");

-- CreateIndex
CREATE INDEX "verificacion_vehiculoId_idx" ON "verificacion"("vehiculoId");

-- CreateIndex
CREATE INDEX "verificacion_fechaVencimiento_idx" ON "verificacion"("fechaVencimiento");

-- CreateIndex
CREATE INDEX "verificacion_vigente_idx" ON "verificacion"("vigente");

-- CreateIndex
CREATE INDEX "regla_circulacion_activo_idx" ON "regla_circulacion"("activo");

-- CreateIndex
CREATE INDEX "regla_circulacion_ciudad_idx" ON "regla_circulacion"("ciudad");

-- CreateIndex
CREATE INDEX "calendario_circulacion_vehiculoId_idx" ON "calendario_circulacion"("vehiculoId");

-- CreateIndex
CREATE INDEX "calendario_circulacion_fecha_idx" ON "calendario_circulacion"("fecha");

-- CreateIndex
CREATE UNIQUE INDEX "calendario_circulacion_vehiculoId_fecha_key" ON "calendario_circulacion"("vehiculoId", "fecha");

-- CreateIndex
CREATE INDEX "bloqueo_vehiculo_vehiculoId_idx" ON "bloqueo_vehiculo"("vehiculoId");

-- CreateIndex
CREATE INDEX "bloqueo_vehiculo_activo_idx" ON "bloqueo_vehiculo"("activo");

-- CreateIndex
CREATE INDEX "bloqueo_vehiculo_tipo_idx" ON "bloqueo_vehiculo"("tipo");

-- CreateIndex
CREATE INDEX "notificacion_usuarioId_idx" ON "notificacion"("usuarioId");

-- CreateIndex
CREATE INDEX "notificacion_leida_idx" ON "notificacion"("leida");

-- CreateIndex
CREATE INDEX "auditoria_tablaAfectada_idx" ON "auditoria"("tablaAfectada");

-- CreateIndex
CREATE INDEX "auditoria_usuarioId_idx" ON "auditoria"("usuarioId");

-- CreateIndex
CREATE INDEX "auditoria_createdAt_idx" ON "auditoria"("createdAt");

-- AddForeignKey
ALTER TABLE "usuario_rol" ADD CONSTRAINT "usuario_rol_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_rol" ADD CONSTRAINT "usuario_rol_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "rol"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rol_permiso" ADD CONSTRAINT "rol_permiso_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "rol"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rol_permiso" ADD CONSTRAINT "rol_permiso_permisoId_fkey" FOREIGN KEY ("permisoId") REFERENCES "permiso"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "uso_vehiculo" ADD CONSTRAINT "uso_vehiculo_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "uso_vehiculo" ADD CONSTRAINT "uso_vehiculo_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "vehiculo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "uso_vehiculo" ADD CONSTRAINT "uso_vehiculo_cicloLavadoId_fkey" FOREIGN KEY ("cicloLavadoId") REFERENCES "ciclo_lavado"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ciclo_lavado" ADD CONSTRAINT "ciclo_lavado_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "vehiculo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ciclo_lavado" ADD CONSTRAINT "ciclo_lavado_usuarioLavadoId_fkey" FOREIGN KEY ("usuarioLavadoId") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evidencia" ADD CONSTRAINT "evidencia_usoId_fkey" FOREIGN KEY ("usoId") REFERENCES "uso_vehiculo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verificacion" ADD CONSTRAINT "verificacion_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "vehiculo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verificacion" ADD CONSTRAINT "verificacion_usuarioRegistroId_fkey" FOREIGN KEY ("usuarioRegistroId") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calendario_circulacion" ADD CONSTRAINT "calendario_circulacion_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "vehiculo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calendario_circulacion" ADD CONSTRAINT "calendario_circulacion_reglaAplicadaId_fkey" FOREIGN KEY ("reglaAplicadaId") REFERENCES "regla_circulacion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bloqueo_vehiculo" ADD CONSTRAINT "bloqueo_vehiculo_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "vehiculo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bloqueo_vehiculo" ADD CONSTRAINT "bloqueo_vehiculo_usuarioBloqueoId_fkey" FOREIGN KEY ("usuarioBloqueoId") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bloqueo_vehiculo" ADD CONSTRAINT "bloqueo_vehiculo_usuarioDesbloqueId_fkey" FOREIGN KEY ("usuarioDesbloqueId") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificacion" ADD CONSTRAINT "notificacion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auditoria" ADD CONSTRAINT "auditoria_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
