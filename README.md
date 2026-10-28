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
- `POST /api/pedidos`: crea un pedido para el usuario autenticado; el total se calcula en el servidor con los precios vigentes.
- `GET /api/pedidos/mias`: consulta únicamente los pedidos del usuario autenticado.
- `GET /api/pedidos`: consulta todos los pedidos, solo para `admin` autenticado.

Las rutas protegidas reciben `Authorization: Bearer <token>`. Una solicitud sin autenticación válida responde `401`; un usuario autenticado sin rol admin recibe `403`.

## Estado

El catálogo, la autenticación, el CRUD administrativo de productos y la creación/consulta de pedidos están implementados. La migración inicial, la migración de pedidos y el seed están preparados; configura PostgreSQL, aplica las migraciones y ejecuta el seed.
