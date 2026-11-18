# WoW Criollo

MVP comunitario para encontrar compañeros hispanohablantes en WoW Forever. Next.js App Router, React, TypeScript estricto, Tailwind CSS, PostgreSQL y Prisma. Interfaz en español para toda la comunidad hispanohablante, sin cuentas obligatorias ni chat propio.

## Requisitos

- Node.js 22.12 o posterior (probado con Node 24).
- npm y PostgreSQL 14 o posterior, o Docker Compose.

## Instalación local

```sh
npm ci
npm run db:local
npm run db:generate
npm run db:migrate
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

`db:local` requiere `initdb`, `pg_ctl`, `createdb` y `psql` en PATH. Crea un clúster **aislado del proyecto** en `.local/postgres`, escucha solamente en `127.0.0.1:55432` y genera `.env` si falta. Usa autenticación local de confianza exclusivamente para desarrollo. No toca otros clústeres de PostgreSQL. Para detenerlo: `npm run db:stop`.

Si usás tu propio PostgreSQL, copiá `.env.example` a `.env`, configurá `DATABASE_URL` y omití `db:local`.

Alternativa Docker:

```sh
export POSTGRES_PASSWORD='elegi-una-clave-local'
docker compose up -d db
cp .env.example .env
```

En `.env`, agregá esa contraseña a la URL: `postgresql://wow_local:CLAVE@127.0.0.1:55432/wow_argentina`. Luego ejecutá generación, migraciones y desarrollo.

## Configuración

- `DATABASE_URL`: conexión PostgreSQL. En producción, usar credenciales propias, TLS y un pool adecuado al proveedor.
- `DISCORD_INVITE_URL`: opcional. Por defecto usa `https://discord.gg/wXUpdUgXGQ`. Podés reemplazarla por otra invitación HTTPS válida de Discord.
- `APP_URL`: origen público de la aplicación, usado por metadata, Open Graph, robots y sitemap. En producción, configurarlo como `https://wow-criollo.com.ar`.
- `RATE_LIMIT_SALT`: secreto aleatorio de al menos 32 caracteres, obligatorio en producción. Generar con `openssl rand -hex 32`. Cambiarlo invalida los permisos anónimos existentes y cambia las claves de limitación.
- `TRUST_PROXY`: `false` por defecto. Activar si el único proxy de entrada agrega la IP real al final de `X-Forwarded-For` o sobrescribe ese encabezado con la IP real. En acceso directo se comparte una cuota conservadora entre visitantes para impedir que borrar cookies permita evadirla.

Ningún secreto se expone mediante variables `NEXT_PUBLIC_*`. `.env`, el clúster y los archivos generados están ignorados.

## Datos y migraciones

```sh
npm run db:generate
npm run db:migrate
```

Las migraciones versionadas crean enums, publicaciones, reportes, límites persistentes, índices y restricciones SQL. Para cambiar el modelo durante desarrollo: `npx prisma migrate dev --name nombre-del-cambio`. En despliegues usar siempre `migrate deploy`.

La base empieza vacía. Para revisar la interfaz con ejemplos opcionales:

```sh
npm run db:seed
```

El seed reemplaza únicamente sus registros `isDemo=true`. Cada card y detalle muestran **DEMO**; los ejemplos quedan excluidos de estadísticas y sitemap, y sus detalles llevan `noindex`. Nunca se cargan automáticamente durante un despliegue. No son jugadores ni búsquedas reales. Para quitarlos, eliminar únicamente `GroupPost` con `isDemo=true`, por ejemplo desde Prisma Studio en un entorno privado.

## Funcionalidades

- `/`: tablón principal, búsqueda, filtros, estadísticas reales e invitación a la comunidad.
- `/grupos`: búsqueda textual por personaje, zona y descripción; actividad, niveles, clase, facción, zona, disponibilidad y estado; paginación de 12 resultados, recientes primero.
- `/publicar`: formulario con React Hook Form y Zod; validación independiente en el servidor.
- `/grupos/[id]`: detalle, salida a Discord, reportes y administración para el creador.
- `/comunidad`: participación, reglas, invitación al Discord y futuras guilds.
- `/ranking`: agregados de búsquedas reales abiertas y vigentes, sin posiciones ficticias.

La interfaz mantiene navegación lateral, superficies planas y un acento celeste. Bricolage Grotesque aporta personalidad a títulos y marca; DM Sans se utiliza en textos y controles. Ambas fuentes se alojan localmente mediante `next/font/local`, con sus licencias SIL OFL disponibles en `public/fonts/`. El buscador aparece directamente en el inicio, sin hero, slogans ni banners promocionales. Los colores se adaptan al tema del sistema. Los selectores conservan el control nativo y el soporte de teclado; `src/components/select.tsx` unifica su flecha, espaciado, foco e iconos opcionales.

La marca, el subtítulo y la descripción se centralizan en `src/lib/brand.ts`. La interfaz y los metadatos se dirigen a jugadores hispanohablantes, con idioma `es`. Los horarios usan UTC−3 como referencia explícita y el formulario permite indicar otra zona horaria en el texto.

### Imágenes e iconos de World of Warcraft

Los recursos se sirven desde `public/wow/`, sin hotlinking ni llamadas al CDN de Blizzard al visitar la web. Las nueve clases, las dos facciones y las ocho actividades tienen sus iconos del juego en fichas, detalles, filtros, selectores visuales del formulario y estadísticas. El logo oficial de WoW Forever enlaza al sitio de Blizzard; la página de comunidad incluye una imagen de la cinemática y la vista previa al compartir usa recursos oficiales. El favicon es un símbolo propio de WoW Criollo.

`src/lib/wow-assets.ts` centraliza actividades, facciones, logo e imagen; los iconos de clase están en el catálogo. `public/wow/sources.json` registra cada archivo y su fuente oficial. El logo se conserva sin alteraciones, con su proporción original. Los iconos pequeños se sirven directamente; la imagen de comunidad usa WebP y tamaños adaptados al dispositivo. Se conservó el JPEG oficial para Open Graph.

Los recursos pertenecen a Blizzard Entertainment, Inc.; no se distribuyen con una licencia libre. El pie y `/comunidad#creditos` incluyen la atribución, las fuentes, las políticas de Blizzard y la aclaración de que el sitio es independiente. Revisar las condiciones aplicables antes de monetizar el sitio o reutilizar estos archivos fuera del fansite.

## Publicaciones y permisos

La publicación vence 24 horas después de crearse o renovarse. Al leer el tablón se persisten los vencimientos; además, toda consulta activa filtra por fecha, por lo que una publicación vieja no aparece aunque no haya corrido un proceso programado.

El creador recibe un token aleatorio de 256 bits en una cookie `HttpOnly`, `SameSite=Lax`, `Secure` en producción, limitada a la ruta del detalle. La base guarda solo su hash HMAC. Desde ese navegador puede renovar búsquedas abiertas o vencidas, marcarlas completas o finalizarlas. Un grupo completo puede finalizarse; una búsqueda finalizada no se reabre. No existe recuperación del permiso al borrar cookies o cambiar de navegador. El token no aparece en la URL ni en las respuestas públicas.

El horario se expresa como texto, acompañado de una disponibilidad filtrable, siempre en UTC−3. El MVP usa niveles de 1 a 60 y las nueve clases del prompt. El nivel recomendado es un umbral; el filtro mínimo/máximo aplica al nivel del personaje.

## Seguridad y moderación

Validación server-side, longitud máxima, UUID, texto plano sin HTML ni caracteres de control, rechazo de enlaces en la descripción, honeypot, escape de texto con React y comprobaciones de origen de Server Actions de Next.js. El cliente no decide estado, vencimiento, permisos ni condición de demostración.

Las cuotas son atómicas en PostgreSQL y funcionan entre procesos: creación 5 intentos por 15 minutos por origen y 100 por minuto globales; administración 20 por 15 minutos; reportes 5 por hora. Los intentos fallidos de escritura también consumen cuota después de validar. Un bloqueo transaccional impide búsquedas activas duplicadas del mismo personaje, facción y actividad, incluso con solicitudes concurrentes. En un despliegue público abierto puede añadirse un desafío antispam según el tráfico real.

Los reportes se guardan en `PostReport`, con estado `PENDING` y clave única por publicación/origen. Están preparados para revisión futura. **No hay panel público de moderación**: un administrador de base puede revisar los reportes en Prisma Studio privado y actualizar su estado o retirar la publicación. No se recopilan IPs en texto plano.

## Vencimiento programado

```sh
npm run db:expire
```

También limpia cuotas vencidas. Programar este comando cada 5–15 minutos desde el scheduler del hosting. En plataformas serverless, ejecutarlo como un job externo con acceso privado a la base; no se expone un endpoint público de mantenimiento. La corrección del listado no depende del job.

## Verificación

```sh
npm run lint
npm run typecheck
npm test
npm run test:integration
npm run build
```

Las pruebas unitarias cubren validación, seguridad, filtros y transiciones. Las de integración son opt-in, necesitan la base migrada y verifican escrituras reales, lectura, filtros, duplicados, permisos, renovación, reportes, expiración y cuotas concurrentes. Crean registros con identificadores propios y los limpian al terminar; conviene ejecutarlas en una base dedicada antes de producción. `TEST_DATABASE_URL` permite seleccionar esa base.

La compilación genera las rutas y metadata; las páginas que usan la base se renderizan dinámicamente. Si la conexión falla, el tablón muestra un estado de error; la aplicación no sustituye datos reales por mocks.

Se usa Webpack, soportado por Next.js, para que desarrollo y build funcionen también en entornos donde los procesos internos de Turbopack no pueden abrir sus puertos. Auditoría inicial: `npm audit --omit=dev` sin vulnerabilidades. El árbol de desarrollo tiene un aviso transitivo de ReDoS en `picomatch` (sin versión estable corregida al instalar); afecta las herramientas de lint/tests y no está en el árbol de producción. No se aceptan patrones glob de visitantes. Revisar el lockfile y repetir la auditoría al actualizar dependencias.

## Despliegue en Contabo con Dokploy

El archivo `compose.production.yml` levanta Next.js y PostgreSQL 16 en el mismo VPS. Solo Traefik recibe tráfico público. La web corre como usuario sin privilegios, aplica las migraciones al arrancar y deja los datos en el volumen persistente `postgres_data`. La base arranca vacía.

### 1. Subí el código y apuntá el dominio

Desde la carpeta del proyecto, publicá el código en un repositorio Git que Dokploy pueda leer. Si todavía no existe, creá un repositorio remoto vacío (por ejemplo, privado en GitHub) y ejecutá:

```sh
git init -b main
git add .
git status --short
git commit -m "Preparar WoW Criollo para producción"
git remote add origin URL_DEL_REPO
git push -u origin main
```

Si ya trabajás desde un clon con remoto, usá ese repositorio y la rama que vayas a desplegar. Confirmá en `git status` que se incluyan el lockfile, Dockerfile, Compose y las migraciones, y que queden fuera `.env`, `.local` y `node_modules`.

Creá un registro DNS **A** para tu dominio o subdominio apuntando a la IPv4 pública de Contabo. Si usás Cloudflare, elegí **DNS only** para esta configuración con Traefik como proxy directo. Permití el ingreso por TCP 80 y 443 al VPS.

### 2. Creá el servicio en Dokploy

1. En tu proyecto de Dokploy, creá un servicio **Docker Compose** y elegí **Docker Compose** como tipo.
2. Conectá el repositorio y seleccioná la rama que subiste. En **Compose Path** poné `./compose.production.yml`.
3. En **Environment**, cargá estas variables. Generá cada secreto por separado con `openssl rand -hex 32`. Usá el valor hexadecimal directamente para que la contraseña pueda formar parte de la URL de PostgreSQL.

```dotenv
APP_URL=https://wow-criollo.com.ar
POSTGRES_PASSWORD=REEMPLAZAR_CON_EL_PRIMER_SECRETO_HEX
RATE_LIMIT_SALT=REEMPLAZAR_CON_EL_SEGUNDO_SECRETO_HEX
DISCORD_INVITE_URL=https://discord.gg/wXUpdUgXGQ
TRUST_PROXY=true
```

Usá un `APP_URL` sin barra final. Guardá la contraseña y la sal en un gestor de secretos. PostgreSQL usa `POSTGRES_PASSWORD` al inicializar el volumen. Para rotarla con datos existentes, cambiá también la contraseña del rol en PostgreSQL. Cambiar `RATE_LIMIT_SALT` invalida los permisos de edición guardados en los navegadores.

Usá `TRUST_PROXY=true` si Traefik recibe tráfico directamente y agrega la IP del cliente a `X-Forwarded-For`. Mantené el puerto de la web sin publicar. Si colocás otro proxy por delante, verificá qué IP llega como último valor del encabezado antes de activar esta opción. Con `false` las cuotas por visitante se aplican de forma compartida.

4. En **Domains → Add Domain**, elegí el servicio `web`, host `wow-criollo.com.ar`, path `/`, **Container Port** `3000`, HTTPS activo y certificado **Let's Encrypt**. Usá el mismo host que en `APP_URL`.
5. Hacé **Deploy**. Revisá que `db` quede saludable, que `web` aplique la migración y que figure como saludable. Para nuevas versiones, hacé push y volvé a usar **Deploy**.

### 3. Verificá el sitio y configurá el mantenimiento

```sh
curl -fsS https://wow-criollo.com.ar/api/health
curl -fsS https://wow-criollo.com.ar/robots.txt
```

El primer comando debe devolver `{"status":"ok"}`. El segundo debe mostrar el sitemap con tu dominio. Abrí la web, publicá un grupo de prueba, comprobá que podés administrarlo desde el mismo navegador y finalizalo. Probá también el enlace a Discord.

En **Schedule Jobs**, creá un job de tipo **Compose** para el servicio `web`, con cron `*/10 * * * *` y comando `npm run db:expire`. Confirmá que aparezca una ejecución exitosa en el historial.

Programá un `pg_dump` diario y guardalo fuera del VPS. Para una copia manual, identificá el contenedor del servicio `db` en Dokploy y ejecutá lo siguiente desde el VPS, reemplazando `NOMBRE_CONTENEDOR_DB` por el nombre exacto:

```sh
umask 077
docker exec NOMBRE_CONTENEDOR_DB pg_dump -U wow_app -d wow_argentina -Fc > "wow-argentina-$(date +%F).dump"
pg_restore --list "wow-argentina-$(date +%F).dump"
```

`pg_restore --list` requiere el cliente de PostgreSQL en el entorno donde lo ejecutes. Probá la restauración en una base separada antes de depender de esa copia. Conservá el volumen en los redeploys. Antes de desplegar una migración nueva, tomá una copia y comprobá si la versión anterior de la app es compatible con el esquema actualizado.

- [Docker Compose en Dokploy](https://docs.dokploy.com/docs/core/docker-compose)
- [Dominios y HTTPS para Compose](https://docs.dokploy.com/docs/core/docker-compose/domains)
- [Tareas programadas](https://docs.dokploy.com/docs/core/schedule-jobs)

## Organización

- `src/app`: rutas, metadata, Open Graph, sitemap, carga y errores.
- `src/components`: navegación, sistema visual y componentes del tablón.
- `src/features/groups`: catálogo, esquemas, lógica pura y acciones.
- `src/server`: persistencia, permisos, cuotas y contexto del visitante.
- `src/lib`: configuración y formatos.
- `prisma`: esquema, migraciones y fixtures opcionales.
- `scripts`: clúster local y mantenimiento.
- `tests`: validación, negocio e integración.
# wow-criollo
