# Backend — El Roble

API REST del minimercado El Roble. Este repositorio se desarrolla por separado del frontend y organiza el código en las capas `domain`, `application`, `infrastructure` e `interface`.

## Requisitos

- Node.js 22 o superior
- PostgreSQL

## Configuración local

1. Instala dependencias con `npm install`.
2. Copia `.env.example` a `.env` y configura `DATABASE_URL` con los datos reales de PostgreSQL. Cambia también `JWT_SECRET` por una clave local segura.
3. Crea las tablas con `npm run prisma:migrate`.
4. Genera el cliente de Prisma con `npm run prisma:generate`.
5. Carga el catálogo y los usuarios de demostración con `npm run prisma:seed`.
6. Inicia el servidor con `npm run dev` y comprueba `http://localhost:3001/api/health`.

El seed es para el ambiente local/de entrega. Crea estos usuarios de prueba:

| Rol | Correo | Contraseña |
|---|---|---|
| admin | `admin@elroble.local` | `Admin1234!` |
| user | `cliente@elroble.local` | `Cliente1234!` |

No uses esas credenciales en un despliegue público. El seed agrega 30 productos del catálogo original y es repetible: actualiza los registros por ID/correo en vez de duplicarlos.

## Variables de entorno

Consulta `.env.example`: `PORT`, `FRONTEND_URL`, `DATABASE_URL`, `JWT_SECRET` y `JWT_EXPIRES_IN`. El frontend local se ejecuta en `http://localhost:3000` y la API en `http://localhost:3001`.

## Rutas disponibles

- `GET /api/health`: verifica que la API esté activa.
- `GET /api/productos`: catálogo paginado y filtros por categoría y nombre.
- `GET /api/productos/:id`: detalle de un producto.
- `POST /api/auth/register`: registro de cuenta con rol `user`.
- `POST /api/auth/login`: inicio de sesión; devuelve token JWT y datos del usuario.
- `POST /api/productos`, `PUT /api/productos/:id`, `DELETE /api/productos/:id`: administración de productos, solo para `admin` autenticado.

Las rutas administrativas reciben `Authorization: Bearer <token>`. Una solicitud sin autenticación válida responde `401`; un usuario autenticado sin rol admin recibe `403`.

## Estado

El catálogo, autenticación y CRUD administrativo están implementados. La migración inicial y el seed están preparados; para recibir productos, configura PostgreSQL, aplica la migración y ejecuta el seed.
