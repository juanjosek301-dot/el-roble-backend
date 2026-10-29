# Backend — El Roble

API REST del minimercado El Roble, mantenida en un repositorio independiente del frontend. Está construida con Node.js, Express, TypeScript, Prisma y PostgreSQL, organizada en las capas `domain`, `application`, `infrastructure` e `interface`.

## Despliegues

- **Frontend:** pendiente de publicar esta versión en Vercel.
- **API:** pendiente de publicar en Render o Railway.
- El frontend se ejecuta localmente en `http://localhost:3000`; la API local, en `http://localhost:3001`.

## Ejecutar en local

Requisitos: Node.js 22 o superior y PostgreSQL.

1. Instala dependencias con `npm install`.
2. Copia `.env.example` a `.env` y configura las variables indicadas abajo.
3. Crea o actualiza las tablas con `npm run prisma:migrate`.
4. Genera el cliente de Prisma con `npm run prisma:generate`.
5. Carga los datos de demostración con `npm run prisma:seed`.
6. Inicia la API con `npm run dev` y comprueba `http://localhost:3001/api/health`.

La migración inicial y la migración de pedidos se aplicaron a la base de datos PostgreSQL de Neon usada para el desarrollo. Para otro entorno, ejecuta las migraciones antes del seed.

## Variables de entorno

Configura las variables en `.env` a partir de `.env.example`:

- `PORT`: puerto de la API; por defecto, `3001`.
- `FRONTEND_URL`: origen permitido por CORS; en desarrollo, `http://localhost:3000`.
- `DATABASE_URL`: URL de conexión PostgreSQL. En producción, se configura como variable privada del servicio.
- `JWT_SECRET`: clave secreta para firmar tokens; usa una clave segura propia para cada entorno.
- `JWT_EXPIRES_IN`: duración del token.

No subas `.env` ni pegues contraseñas o tokens en el README.

## Cuentas de prueba

El seed crea estas cuentas para el ambiente local/de entrega:

| Rol | Correo | Contraseña |
|---|---|---|
| `admin` | `admin@elroble.local` | `Admin1234!` |
| `user` | `cliente@elroble.local` | `Cliente1234!` |

Son credenciales de demostración y no deben usarse en producción.

## Rutas disponibles

- `GET /api/health`: comprueba que la API está activa.
- `GET /api/productos`: catálogo paginado y filtros por categoría y nombre.
- `GET /api/productos/:id`: detalle de un producto.
- `POST /api/auth/register`: registra una cuenta con rol `user`.
- `POST /api/auth/login`: valida las credenciales y devuelve un JWT y los datos del usuario.
- `POST /api/productos`, `PUT /api/productos/:id`, `DELETE /api/productos/:id`: operaciones administrativas sobre productos; requieren rol `admin`.
- `POST /api/pedidos`: crea un pedido para el usuario autenticado. El servidor obtiene los precios vigentes y calcula el total.
- `GET /api/pedidos/mias`: devuelve solo los pedidos del usuario autenticado.
- `GET /api/pedidos`: devuelve todos los pedidos y requiere rol `admin`.

Las rutas protegidas reciben `Authorization: Bearer <token>`. La API responde `401` cuando no recibe un token válido y `403` cuando la cuenta está autenticada pero no tiene el rol necesario.

## Decisiones técnicas

### Flujo de login y autorización

El frontend envía correo y contraseña a `POST /api/auth/login`. La API busca el usuario y compara la contraseña con su hash. Si coincide, firma un JWT con la identidad y el rol. El frontend conserva ese token y lo adjunta como `Authorization: Bearer <token>` al llamar rutas protegidas. El middleware de autenticación valida la firma y vigencia del JWT; después, el middleware de autorización comprueba el rol cuando el endpoint es administrativo. Por ejemplo, `GET /api/pedidos/mias` filtra usando la identidad del token, mientras que `GET /api/pedidos` exige rol `admin`.

### Ejemplos de `401` y `403`

- `401 Unauthorized`: `GET /api/pedidos/mias` sin token o con uno vencido. No hay una identidad válida para autorizar la consulta.
- `403 Forbidden`: `GET /api/pedidos` con un JWT válido de una cuenta `user`. La identidad sí existe, pero ese endpoint es exclusivo de `admin`.

### Uso de IA y correcciones

Usamos IA como apoyo para revisar la arquitectura por capas, identificar errores de integración y redactar documentación. Contrastamos cada propuesta con el código y la ejecución: ajustamos las rutas y tipos a la estructura real, separamos el backend en su propio repositorio y corregimos la documentación para reflejar que la API ya está implementada. El equipo debe revisar esta descripción y personalizarla con sus propias palabras antes de la entrega.

## Evidencia de Network

**Pendiente de agregar:** captura de DevTools → Network mostrando una petición protegida desde el frontend, la respuesta de la API y el encabezado `Authorization: Bearer …`. Oculta el token completo antes de guardar la captura. Debe corresponder al ambiente de entrega y enlazarse desde este README.

## Estado del proyecto

Están implementados el catálogo, registro e inicio de sesión, CRUD administrativo de productos y creación/consulta de pedidos. Hay migraciones y seed para PostgreSQL; el despliegue de ambos servicios y la captura de Network siguen pendientes.
