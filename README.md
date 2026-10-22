# Backend — El Roble

API REST del minimercado El Roble. Este repositorio se desarrolla por separado del frontend y organiza el código en las capas `domain`, `application`, `infrastructure` e `interface`.

## Estado

Está disponible el catálogo público con `GET /api/productos` (paginación y filtros por categoría y nombre) y `GET /api/productos/:id`, además del endpoint de salud `GET /api/health`.

## Requisitos

- Node.js 22 o superior
- PostgreSQL

## Configuración local

1. Instala dependencias con `npm install`.
2. Copia `.env.example` a `.env` y ajusta `DATABASE_URL` y `JWT_SECRET`.
3. Inicia el servidor en desarrollo con `npm run dev`.
4. Comprueba `http://localhost:3001/api/health`.

Genera el cliente con `npm run prisma:generate` y aplica el esquema con `npm run prisma:migrate` después de configurar PostgreSQL.

## Endpoints previstos

- Autenticación: registro e inicio de sesión.
- Productos: catálogo paginado y administración restringida a `admin`.
- Pedidos: creación autenticada, consulta propia y consulta administrativa.
