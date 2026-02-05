# NestJS Backend

## Instalación de dependencias:
```bash
cd backend
npm install
```

## Configuración:

1. Copiar `.env.example` a `.env`:
```bash
cp .env.example .env
```

2. Ajustar variables de entorno según tu setup local

## Desarrollo:

```bash
# Iniciar en modo watch
npm run start:dev

# Build
npm run build

# Tests
npm test
```

## Database (Prisma):

```bash
# Crear/ejecutar migraciones
npx prisma migrate dev

# Ver studio (GUI)
npx prisma studio

# Resetear BD (cuidado!)
npx prisma migrate reset
```

## Estructura:

```
src/
├── main.ts           # Entry point
├── app.module.ts     # Root module
├── modules/          # Módulos de negocio
├── common/           # Código compartido
└── prisma/           # Configuración BD
```

---

### Ports:
- Backend: 3000
- PostgreSQL: 5432
