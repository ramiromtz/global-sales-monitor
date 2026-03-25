import * as dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

import { storesData } from './data/stores.js';

if (!process.env.DATABASE_URL) {
  throw new Error("No se encontró DATABASE_URL en el archivo .env");
}

const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Conectando a la base de datos...");

  // Limpiar datos previos
  await prisma.order.deleteMany();
  await prisma.store.deleteMany();

  await prisma.$executeRaw`ALTER TABLE Store AUTO_INCREMENT = 1;`;
  await prisma.$executeRaw`ALTER TABLE orders AUTO_INCREMENT = 1;`;

  // Insertar tiendas
  await prisma.store.createMany({
    data: storesData,
  });

  console.log("Tiendas iniciales creadas con éxito.");
}

main()
  .catch((e) => {
    console.error("Error en el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });