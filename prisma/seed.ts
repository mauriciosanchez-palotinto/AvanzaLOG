import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Clean up existing data
  await prisma.usuarioRol.deleteMany();
  await prisma.usuario.deleteMany();
  await prisma.rol.deleteMany();
  await prisma.vehiculo.deleteMany();

  // Create roles
  const adminRole = await prisma.rol.create({
    data: {
      nombre: 'Admin',
      descripcion: 'Administrador del sistema',
    },
  });

  const driverRole = await prisma.rol.create({
    data: {
      nombre: 'Conductor',
      descripcion: 'Conductor de vehículos',
    },
  });

  const managerRole = await prisma.rol.create({
    data: {
      nombre: 'Gerente',
      descripcion: 'Gerente de flota',
    },
  });

  // Create users
  await prisma.usuario.create({
    data: {
      nombre: 'Admin User',
      email: 'admin@camioneta.com',
      telefono: '+57 300 123 4567',
      passwordHash: await bcrypt.hash('admin123', 10),
      activo: true,
      esAdmin: true,
      rolesAsignados: {
        create: {
          rolId: adminRole.id,
        },
      },
    },
  });

  await prisma.usuario.create({
    data: {
      nombre: 'Juan Pérez',
      email: 'juan@camioneta.com',
      telefono: '+57 300 111 2222',
      passwordHash: await bcrypt.hash('driver123', 10),
      activo: true,
      esAdmin: false,
      rolesAsignados: {
        create: {
          rolId: driverRole.id,
        },
      },
    },
  });

  await prisma.usuario.create({
    data: {
      nombre: 'María García',
      email: 'maria@camioneta.com',
      telefono: '+57 300 222 3333',
      passwordHash: await bcrypt.hash('driver123', 10),
      activo: true,
      esAdmin: false,
      rolesAsignados: {
        create: {
          rolId: driverRole.id,
        },
      },
    },
  });

  await prisma.usuario.create({
    data: {
      nombre: 'Carlos López',
      email: 'carlos@camioneta.com',
      telefono: '+57 300 333 4444',
      passwordHash: await bcrypt.hash('manager123', 10),
      activo: true,
      esAdmin: false,
      rolesAsignados: {
        create: {
          rolId: managerRole.id,
        },
      },
    },
  });

  // Create vehicles
  await prisma.vehiculo.create({
    data: {
      placa: 'ABC-123',
      marca: 'Chevrolet',
      modelo: 'NHR',
      ano: 2020,
      color: 'Blanco',
      estado: 'disponible',
      kilometrajeActual: 45000,
      activo: true,
    },
  });

  await prisma.vehiculo.create({
    data: {
      placa: 'DEF-456',
      marca: 'Hino',
      modelo: '500',
      ano: 2021,
      color: 'Azul',
      estado: 'disponible',
      kilometrajeActual: 32000,
      activo: true,
    },
  });

  await prisma.vehiculo.create({
    data: {
      placa: 'GHI-789',
      marca: 'Ford',
      modelo: 'F-4000',
      ano: 2019,
      color: 'Rojo',
      estado: 'mantenimiento',
      kilometrajeActual: 78000,
      activo: true,
    },
  });

  console.log('✅ Seed data created successfully!');
  console.log('\n📋 Test Users:');
  console.log('1. Admin:');
  console.log('   Email: admin@camioneta.com');
  console.log('   Password: admin123\n');
  console.log('2. Driver 1:');
  console.log('   Email: juan@camioneta.com');
  console.log('   Password: driver123\n');
  console.log('3. Driver 2:');
  console.log('   Email: maria@camioneta.com');
  console.log('   Password: driver123\n');
  console.log('4. Manager:');
  console.log('   Email: carlos@camioneta.com');
  console.log('   Password: manager123\n');
  console.log('🚗 Vehicles created: 3');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
