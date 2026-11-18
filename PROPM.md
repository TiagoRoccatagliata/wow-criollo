# SUPER PROMPT — WOW ARGENTINA

## Plataforma comunitaria para encontrar jugadores de WoW Forever

Actuá como un equipo senior de desarrollo de software compuesto por:

- Senior Product Designer especializado en productos gaming y comunidades.
- Senior Full Stack Developer especializado en Next.js y TypeScript.
- Software Architect especializado en aplicaciones escalables.
- UX/UI Designer especializado en interfaces modernas de gaming.

Tu objetivo es diseñar y desarrollar una aplicación web funcional llamada **WoW Criollo**, una plataforma comunitaria para que jugadores hispanohablantes de World of Warcraft Forever puedan encontrar compañeros para jugar.

No quiero solamente una landing page ni un prototipo visual. Quiero un MVP funcional, bien diseñado, con persistencia de datos y una arquitectura preparada para crecer.

---

# 1. VISIÓN DEL PRODUCTO

WoW Criollo es una plataforma independiente de la comunidad de World of Warcraft orientada inicialmente a jugadores hispanohablantes de WoW Forever.

Su principal objetivo es solucionar un problema concreto:

Muchos jugadores quieren hacer misiones, subir de nivel, completar dungeons, participar en PvP o simplemente encontrar gente con quien jugar, pero no tienen una forma sencilla de encontrar compañeros.

La plataforma debe permitir que cualquier jugador pueda:

1. Publicar que está buscando compañeros.
2. Encontrar publicaciones de otros jugadores.
3. Filtrar jugadores por nivel, clase, facción y actividad.
4. Consultar los detalles de cada búsqueda.
5. Unirse a la comunidad mediante una invitación directa a Discord.

**Discord es el centro de comunicación de la comunidad.**

No desarrollar un sistema de chat propio. La web funciona como punto de encuentro y descubrimiento de jugadores.

---

# 2. IDENTIDAD VISUAL Y DISEÑO

Quiero una estética inspirada en World of Warcraft Classic, pero con estándares de diseño de productos web modernos.

Referencias visuales:

- Battle.net.
- Warcraft Logs.
- Raider.IO.
- Warcraft Tavern.
- Interfaces de juegos MMORPG.

### Dirección visual

- Dark fantasy.
- Fondo oscuro.
- Tonalidades carbón y gris azulado.
- Dorado como color de acento.
- Bordes sutiles.
- Tipografía moderna y legible.
- Iconografía inspirada en clases y elementos de WoW.
- Componentes visuales compactos.
- Excelente experiencia en desktop y mobile.

Evitar:

- Diseños genéricos de dashboards SaaS.
- Gradientes excesivos.
- Efectos visuales innecesarios.
- Demasiadas animaciones.
- Apariencia de plantilla generada automáticamente.
- Elementos decorativos que dificulten la navegación.

La experiencia debe sentirse como una comunidad gaming real.

### Branding

Nombre: WoW Criollo.

Claim principal:
"Nunca más aventures solo."

Descripción:
"Encontrá compañeros hispanohablantes para levear, hacer dungeons, misiones y PvP en WoW Forever."

Idioma: español para toda la comunidad hispanohablante.

Usar expresiones naturales de la comunidad gamer hispanohablante.

---

# 3. STACK TECNOLÓGICO

Utilizar:

- Next.js con App Router.
- React.
- TypeScript en modo estricto.
- Tailwind CSS.
- shadcn/ui cuando aporte valor.
- PostgreSQL.
- Prisma ORM.
- Zod para validaciones.
- React Hook Form para formularios.

Arquitectura inicial: monolito modular dentro de Next.js.

No incorporar NestJS, microservicios ni infraestructura innecesaria.

Utilizar versiones estables y compatibles de las dependencias al momento de desarrollar.

El proyecto debe ser fácil de ejecutar localmente y desplegar posteriormente.

---

# 4. ESTRUCTURA DE LA APLICACIÓN

Crear las siguientes páginas:

## A. Home `/`

La página principal debe funcionar como buscador de grupos.

Elementos:

- Navbar con logo WoW Criollo.
- Botón destacado "Unirme a Discord".
- Hero principal.
- Texto explicativo.
- Botón "Buscar grupo".
- Botón "Publicar búsqueda".
- Buscador de publicaciones.
- Filtros.
- Listado de publicaciones recientes.
- Estadísticas de la comunidad.
- Sección de invitación a Discord.
- Footer.

La home debe priorizar la búsqueda de jugadores. No quiero una landing comercial tradicional.

## B. Buscar grupos `/grupos`

Esta es la página principal de uso cotidiano.

Mostrar publicaciones en cards.

Cada card debe incluir:

- Nombre del personaje.
- Clase.
- Nivel.
- Facción.
- Actividad.
- Zona o dungeon.
- Descripción.
- Horario.
- Fecha de publicación.
- Estado de la búsqueda.

Filtros:

- Actividad.
- Nivel mínimo y máximo.
- Clase.
- Facción.
- Zona.
- Disponibilidad.

Agregar búsqueda textual.

Ordenar por publicaciones más recientes.

Incluir estados vacíos, skeletons y mensajes de error.

## C. Publicar búsqueda `/publicar`

Formulario para crear una publicación.

Campos:

**Información del personaje**

- Nombre del personaje.
- Nivel actual.
- Clase.
- Facción.

**Información de la búsqueda**

- Actividad.
- Zona, dungeon o campo de batalla.
- Nivel recomendado.
- Horario.
- Descripción.
- Cantidad de jugadores que busca.

Actividades disponibles:

1. Leveo.
2. Dungeons.
3. Misiones.
4. World PvP.
5. Battlegrounds.
6. Duelos.
7. Raids.
8. Otros.

Clases disponibles:

- Warrior.
- Paladin.
- Hunter.
- Rogue.
- Priest.
- Shaman.
- Mage.
- Warlock.
- Druid.

Facciones:

- Horda.
- Alianza.

El formulario debe validar los campos obligatorios y mostrar mensajes claros.

Una vez publicado, redirigir al usuario a la publicación creada.

## D. Detalle de grupo `/grupos/[id]`

Mostrar:

- Información completa del grupo.
- Personaje que publicó.
- Actividad.
- Nivel.
- Clase.
- Facción.
- Descripción.
- Fecha.
- Estado.

Agregar un CTA destacado:

"QUIERO UNIRME"

Al presionarlo, dirigir al Discord comunitario.

La invitación debe estar centralizada en una variable de entorno o configuración de aplicación.

No inventar una URL de Discord. Dejar un placeholder configurable hasta que se proporcione la invitación real.

## E. Comunidad `/comunidad`

Página con información sobre la comunidad.

Mostrar:

- Descripción.
- Cómo participar.
- Reglas básicas.
- Invitación a Discord.
- Próximamente: hermandades en español.

## F. Ranking `/ranking`

Preparar una página inicial para mostrar estadísticas comunitarias.

No inventar datos ni rankings de jugadores.

Dejar preparado el espacio para futuras estadísticas:

- Clases más utilizadas.
- Distribución por facción.
- Jugadores activos.
- Publicaciones por actividad.

---

# 5. SISTEMA DE PUBLICACIONES

Las publicaciones son el núcleo del producto.

Cada publicación debe tener:

- ID.
- Nombre del personaje.
- Nivel.
- Clase.
- Facción.
- Tipo de actividad.
- Zona o dungeon.
- Descripción.
- Horario.
- Cantidad de jugadores buscados.
- Fecha de creación.
- Fecha de expiración.
- Estado.

Estados:

- Buscando jugadores.
- Grupo completo.
- Finalizado.

Las publicaciones deben expirar automáticamente después de 24 horas, salvo que el usuario las renueve.

Implementar un mecanismo sencillo para marcar publicaciones vencidas como expiradas.

Evitar que las búsquedas antiguas contaminen el listado.

Permitir filtrar publicaciones activas.

---

# 6. DISCORD INTEGRATION

Discord es fundamental.

Crear una configuración centralizada:

`DISCORD_INVITE_URL`

Debe utilizarse en todos los botones y enlaces relacionados con la comunidad.

Ubicaciones:

- Navbar.
- Hero.
- Footer.
- Página Comunidad.
- Detalle de grupos.
- Después de publicar una búsqueda.

Todos los enlaces deben abrir Discord en una nueva pestaña.

Implementar correctamente los atributos de seguridad para enlaces externos.

No integrar bots ni APIs de Discord en esta primera versión.

No desarrollar chat propio.

---

# 7. BASE DE DATOS

Diseñar un esquema Prisma normalizado y preparado para crecer.

Entidades iniciales:

### GroupPost

Representa una búsqueda de jugadores.

### Enums

- CharacterClass.
- Faction.
- ActivityType.
- PostStatus.

Agregar timestamps y los índices necesarios para los filtros principales.

Permitir publicaciones sin autenticación en el MVP.

Implementar identificadores seguros y validación de datos.

Evitar duplicación innecesaria de información.

---

# 8. SEGURIDAD Y MODERACIÓN

Como las publicaciones inicialmente serán abiertas y sin registro, implementar medidas básicas de protección:

- Validación server-side con Zod.
- Límites de longitud.
- Sanitización y tratamiento seguro de texto.
- Rate limiting en creación de publicaciones.
- Protección contra spam.
- Validación de identificadores.
- No confiar en datos enviados desde el cliente.
- Evitar exponer información sensible.

Agregar un mecanismo sencillo para reportar publicaciones.

Preparar una estructura para moderación futura.

No implementar autenticación obligatoria en el MVP.

---

# 9. SEO Y RENDIMIENTO

Implementar:

- Metadata por página.
- Open Graph.
- Sitemap.
- Robots.txt.
- URLs amigables.
- Renderizado adecuado para SEO.
- Optimización de imágenes.
- Buenas prácticas de accesibilidad.
- Responsive design.
- Core Web Vitals.

La web debe poder posicionarse para búsquedas como:

- WoW Forever en español.
- WoW Criollo.
- Buscar grupo WoW Forever.
- Argentinos WoW Forever.
- Grupos para levear WoW.

---

# 10. EXPERIENCIA DE USUARIO

La regla principal:

**Un jugador debe poder encontrar un grupo y llegar al Discord en menos de un minuto.**

Priorizar:

- Pocos clics.
- Filtros intuitivos.
- Información fácil de leer.
- Formularios cortos.
- Navegación rápida.
- Excelente experiencia mobile.

Agregar feedback visual para todas las acciones.

No utilizar botones que no tengan funcionalidad real.

No generar información ficticia presentada como datos reales.

Si se necesitan datos para visualizar el diseño, utilizar fixtures claramente identificados como datos de demostración.

---

# 11. ARQUITECTURA Y ORGANIZACIÓN

Organizar el proyecto con separación clara de responsabilidades.

Ejemplo:

- `app/`: rutas y páginas.
- `components/`: componentes reutilizables.
- `components/ui/`: componentes de interfaz.
- `features/groups/`: lógica de publicaciones.
- `lib/`: utilidades y configuración.
- `server/`: servicios y operaciones server-side.
- `prisma/`: esquema y migraciones.
- `types/`: tipos compartidos.

No colocar toda la lógica de negocio dentro de componentes React.

Evitar componentes excesivamente grandes.

Utilizar Server Components por defecto y Client Components solamente cuando sean necesarios.

---

# 12. VARIABLES DE ENTORNO

Preparar un `.env.example` con:

- DATABASE_URL.
- DISCORD_INVITE_URL.

No hardcodear secretos.

Documentar cómo configurar las variables.

---

# 13. TESTING

Implementar pruebas para:

- Validación de publicaciones.
- Creación de publicaciones.
- Obtención de publicaciones.
- Filtrado.
- Expiración.
- Estados.
- Validaciones de seguridad.

Agregar al menos pruebas unitarias para la lógica de negocio más importante.

---

# 14. METODOLOGÍA DE DESARROLLO

No intentes desarrollar todo de manera desordenada.

Trabajá por etapas:

### Etapa 1: Análisis

- Revisar el repositorio.
- Identificar el estado actual.
- Definir arquitectura.
- Diseñar el modelo de datos.
- Identificar dependencias.

### Etapa 2: Diseño

- Definir sistema visual.
- Crear componentes principales.
- Diseñar responsive.
- Construir la home.

### Etapa 3: Backend y persistencia

- Configurar PostgreSQL.
- Configurar Prisma.
- Crear migraciones.
- Implementar servicios.
- Implementar validaciones.

### Etapa 4: Funcionalidades

- Listado de grupos.
- Filtros.
- Publicaciones.
- Detalle.
- Discord.
- Expiración.

### Etapa 5: Calidad

- Testing.
- Seguridad.
- SEO.
- Accesibilidad.
- Performance.
- Responsive.

### Etapa 6: Documentación

Crear README con:

- Requisitos.
- Instalación.
- Configuración.
- Variables de entorno.
- Migraciones.
- Seed.
- Ejecución local.
- Deploy.

---

# 15. REGLAS IMPORTANTES PARA EL AGENTE

1. No te limites a generar una propuesta o un plan: implementá el producto.
2. Antes de modificar archivos, inspeccioná el repositorio.
3. Si el proyecto está vacío, inicializalo correctamente.
4. No sobrescribas configuraciones existentes sin revisarlas.
5. No agregues dependencias sin justificación.
6. No inventes integraciones ni endpoints.
7. No uses datos mock como si fueran reales.
8. No sacrifiques calidad visual por velocidad.
9. No agregues funcionalidades fuera del alcance del MVP.
10. Priorizá código mantenible, tipado y organizado.
11. Ejecutá lint, typecheck y tests al terminar.
12. Corregí los errores encontrados.
13. Si falta una decisión no bloqueante, elegí una solución razonable y documentala.
14. Si falta información imprescindible, preguntá antes de inventarla.

## RESULTADO ESPERADO

Quiero terminar con una aplicación web funcional, moderna y desplegable.

La experiencia debe ser la de una comunidad hispanohablante real de WoW Forever, no la de un template genérico.

El MVP debe permitir que un jugador:

1. Entre a la web.
2. Encuentre grupos disponibles.
3. Filtre por actividad, clase y nivel.
4. Publique su propia búsqueda.
5. Consulte los detalles de otros grupos.
6. Se una a la comunidad mediante Discord.

**Construí primero un producto pequeño, excelente y funcional. La escalabilidad futura no debe complicar innecesariamente el MVP.**
