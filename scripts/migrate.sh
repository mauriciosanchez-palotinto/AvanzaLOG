#!/bin/bash

# Script para ejecutar migraciones de Prisma después del despliegue en Render

echo "🔄 Ejecutando migraciones de Prisma..."

npx prisma migrate deploy

echo "✅ Migraciones completadas"

# Opcional: ejecutar seed
# echo "🌱 Ejecutando seed..."
# npm run seed
# echo "✅ Seed completado"

exit 0
