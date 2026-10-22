# Backend — El Roble

API REST del minimercado El Roble. Este repositorio se desarrolla por separado del frontend y organiza el código en las capas `domain`, `application`, `infrastructure` e `interface`.

## Estado

En esta primera etapa están preparados el servidor Express, TypeScript, la configuración inicial de Prisma para PostgreSQL, CORS y el endpoint de salud `GET /api/health`. Los modelos, casos de uso y endpoints del negocio se agregarán en entregas progresivas.

## Requisitos

- Node.js 22 o superior
- PostgreSQL

## Configuración local

1. Instala dependencias con `npm install`.
2. Copia `.env.example` a `.env` y ajusta `DATABASE_URL` y `JWT_SECRET`.
3. Inicia el servidor en desarrollo con `npm run dev`.
4. Comprueba `http://localhost:3001/api/health`.

La generación del cliente Prisma y las migraciones se habilitarán al agregar los modelos de la base de datos.

## Endpoints previstos

- Autenticación: registro e inicio de sesión.
- Productos: catálogo paginado y administración restringida a `admin`.
- Pedidos: creación autenticada, consulta propia y consulta administrativa.
