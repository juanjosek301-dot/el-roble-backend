-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('efectivo', 'nequi');

-- CreateTable
CREATE TABLE "pedidos" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "clienteNombre" VARCHAR(100) NOT NULL,
    "clienteEmail" VARCHAR(254) NOT NULL,
    "telefono" VARCHAR(30) NOT NULL,
    "direccion" VARCHAR(250) NOT NULL,
    "metodoPago" "PaymentMethod" NOT NULL,
    "observaciones" VARCHAR(1000),
    "estado" VARCHAR(30) NOT NULL DEFAULT 'pendiente',
    "total" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pedidos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedido_productos" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "productoId" INTEGER NOT NULL,
    "nombre" VARCHAR(120) NOT NULL,
    "precio" DECIMAL(10,2) NOT NULL,
    "cantidad" INTEGER NOT NULL,

    CONSTRAINT "pedido_productos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "pedidos_userId_createdAt_idx" ON "pedidos"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "pedidos_createdAt_idx" ON "pedidos"("createdAt");

-- CreateIndex
CREATE INDEX "pedido_productos_productoId_idx" ON "pedido_productos"("productoId");

-- CreateIndex
CREATE UNIQUE INDEX "pedido_productos_orderId_productoId_key" ON "pedido_productos"("orderId", "productoId");

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido_productos" ADD CONSTRAINT "pedido_productos_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "pedidos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido_productos" ADD CONSTRAINT "pedido_productos_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
