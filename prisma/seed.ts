import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/infrastructure/database/generated/client.js";
import { hash } from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("Falta configurar DATABASE_URL.");

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

const products = [
  [1, "Arroz Diana 500g", 2500, "abarrotes", "arroz-diana.jpg"],
  [2, "Arroz Roa 1kg", 5200, "abarrotes", "arroz-roa.jpg"],
  [3, "Lentejas 500g", 4500, "abarrotes", "lentejas.jpg"],
  [4, "Frijoles 500g", 4800, "abarrotes", "frijoles.jpg"],
  [5, "Aceite vegetal 1L", 8500, "abarrotes", "aceite.jpg"],
  [6, "Azucar 1kg", 4200, "abarrotes", "azucar.jpg"],
  [7, "Coca-Cola 1.5L", 6500, "bebidas", "coca-cola.jpg"],
  [8, "Postobon Manzana 1.5L", 5500, "bebidas", "postobon-manzana.jpg"],
  [9, "Agua Cristal 600ml", 2500, "bebidas", "agua-cristal.jpg"],
  [10, "Jugo Hit Mora 500ml", 3000, "bebidas", "jugo-hit.jpg"],
  [11, "Gatorade 500ml", 4500, "bebidas", "gatorade.jpg"],
  [12, "Pony Malta 330ml", 3000, "bebidas", "pony-malta.jpg"],
  [13, "Jabon de baño", 3500, "aseo", "jabon-bano.jpg"],
  [14, "Jabon liquido para manos", 6500, "aseo", "jabon-liquido.jpg"],
  [15, "Detergente 1kg", 9000, "aseo", "detergente.jpg"],
  [16, "Suavizante 1L", 8500, "aseo", "suavizante.jpg"],
  [17, "Papel higienico x4", 7500, "aseo", "papel-higienico.jpg"],
  [18, "Lavaloza 500ml", 5500, "aseo", "lavaloza.jpg"],
  [19, "Leche Colanta 1L", 4500, "lacteos", "leche-colanta.jpg"],
  [20, "Leche Alpina 1L", 4800, "lacteos", "leche-alpina.jpg"],
  [21, "Yogurt de fresa", 4500, "lacteos", "yogurt-fresa.jpg"],
  [22, "Yogurt natural", 4200, "lacteos", "yogurt-natural.jpg"],
  [23, "Quesito 250g", 8500, "lacteos", "quesito.jpg"],
  [24, "Mantequilla 250g", 7000, "lacteos", "mantequilla.jpg"],
  [25, "Galletas Festival", 3000, "snacks", "galletas-festival.jpg"],
  [26, "Papas Margarita", 3500, "snacks", "papas-margarita.jpg"],
  [27, "Chocolatina Jet", 2500, "snacks", "chocolatina-jet.jpg"],
  [28, "Chitos", 3000, "snacks", "chitos.jpg"],
  [29, "Mani salado", 3500, "snacks", "mani.jpg"],
  [30, "Chococrispis", 4500, "snacks", "chococrispis.jpg"],
] as const;

async function main() {
  for (const [id, nombre, precio, categoria, image] of products) {
    await prisma.product.upsert({
      where: { id },
      update: { nombre, precio, categoria, imagen: `/img/${image}` },
      create: { id, nombre, precio, categoria, imagen: `/img/${image}` },
    });
  }

  const adminPassword = await hash("Admin1234!", 10);
  const userPassword = await hash("Cliente1234!", 10);
  await prisma.user.upsert({
    where: { email: "admin@elroble.local" },
    update: { nombre: "Administrador de prueba", role: "admin", passwordHash: adminPassword },
    create: { nombre: "Administrador de prueba", email: "admin@elroble.local", role: "admin", passwordHash: adminPassword },
  });
  await prisma.user.upsert({
    where: { email: "cliente@elroble.local" },
    update: { nombre: "Cliente de prueba", role: "user", passwordHash: userPassword },
    create: { nombre: "Cliente de prueba", email: "cliente@elroble.local", role: "user", passwordHash: userPassword },
  });

  console.info(`Seed completado: ${products.length} productos y 2 usuarios de prueba.`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
}).finally(async () => prisma.$disconnect());
