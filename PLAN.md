# Plan de acción — Cartelera web 13° FICDEH

Documento de referencia para el desarrollo del aplicativo de programación (cartelera) del
Festival Internacional de Cine por los Derechos Humanos (FICDEH) en Bogotá.

## Objetivo

Construir un Web Component (embebible en el sitio del festival) que muestre la programación
de películas por ciudad, día y sede, a partir de los datos actualmente publicados en los
archivos Excel de `programacion xls/`.

## Estado actual de los datos

Los Excel en `programacion xls/` **no son tablas planas** — están diseñados para lectura
humana, no para consumo automático. Estructura observada:

- Cada archivo `.xlsx` corresponde a una **ciudad** (BOGOTÁ, ARMENIA, CALI, etc.). Bogotá
  además tiene un archivo separado por espacio/aliado (BIBLIORED, CASAS DE JUVENTUD,
  PAZOSFERA, Cinemateca de Bogotá).
- Cada **hoja** dentro de un archivo corresponde a un **día** del festival (ej. "4to Día
  SÁBADO- 15 AGO"). Algunas hojas no son programación: "ORGANIZA", "FORMACIÓN",
  "AGRADECIMIENTOS", "CLÚSTER MIA".
- Dentro de una hoja hay **bloques repetidos por sede**: nombre de la sede, dirección, fila
  de encabezado (`HORA`, `NOMBRE PELÍCULA`, `DIRECTOR/A`, `DURACIÓN`, `PAÍS`, `AÑO`,
  `CATEGORÍA`, `SALA`, `Q&A`, `ESTRENO NACIONAL`), y luego las filas de funciones.
- Una función puede agrupar **varias películas bajo la misma hora** (bloques de cortos): la
  celda de `HORA` solo aparece en la primera fila del grupo; las siguientes filas quedan con
  esa celda vacía pero pertenecen a la misma sesión.
- Algunas funciones incluyen un sub-bloque de **conversatorio** (moderación, protagonistas,
  link de fotos) debajo de la fila de la película.
- Hay **inconsistencias entre ciudades y hojas**: el orden/presencia de columnas varía (a
  veces `I` es `SALA`, a veces `Q&A`), y existen notas editoriales sueltas en la columna `A`
  (`CORRECCIÓN DE TÍTULO`, `SE AGREGO`) que indican que la programación se sigue editando
  activamente.

**Conclusión:** el primer trabajo real del proyecto es convertir este formato humano en datos
limpios y consistentes — no se puede consumir el Excel directamente desde el frontend.

**Actualización (Fase 1):** casi todas las ciudades, salvo Bogotá, además tienen un segundo
archivo `Programación _ <CIUDAD>.xlsx` que **sí es una tabla plana** (una fila por función) y
mucho más rico: trae sinopsis en español/inglés, perfil del director, redes y poster. Bogotá
es la excepción — su programación principal solo existe en el formato "cartelera" descrito
arriba. Se verificó cruzando nombres de sede que los archivos "Cinemateca de Bogotá",
"BIBLIORED" y "CASAS DE JUVENTUD" son extractos redundantes del archivo maestro de Bogotá
(duplicaban sesiones); "PAZOSFERA" en cambio es un programa nacional en centros de reclusión,
no una sede bogotana, así que se maneja como su propio "city slug". Detalle completo en
`data/README.md`.

## Decisión de arquitectura: Vue en vez de React

Se evaluó React vs Vue para el Web Component. Se recomienda **Vue 3** porque tiene soporte
nativo (`defineCustomElement`) para compilar un componente directo a Custom Element con Shadow
DOM, sin librería puente. React requiere un wrapper externo (`react-to-webcomponent` o
similar) con manejo de props/eventos más frágil. Si el objetivo es insertar
`<ficdeh-cartelera>` en el sitio del festival (probablemente WordPress u otro CMS), Vue da
menos fricción.

## Modelo de datos objetivo

```
City      { id, name, venues: Venue[] }
Venue     { name, address }
Day       { date, label }
Session   { time, venueId, dayId, films: Film[], conversatorio? }
Film      { title, director, durationMin, country, year, category, sala?, qa, premiere }
Conversatorio { moderacion?, protagonistas?: string[], fotosLink? }
```

## Flujo de trabajo

Cada fase se desarrolla en su propia rama (`fase-N-descripcion`) y se integra a `main` por
merge una vez revisada. Esto permite volver atrás sin afectar lo ya validado si algo sale mal
en una fase.

## Fases

- **Fase 0 — Modelo de datos**: cerrar el esquema anterior (tipos TypeScript).
- **Fase 1 — Script de conversión Excel → JSON**: `scripts/build_data.py`, con dos parsers
  (flat y cartelera) descritos en `data/README.md`. Genera `data/<ciudad>.json` +
  `data/index.json`. *(Hecho, ver rama `fase-1-parser-excel-json`.)*
- **Fase 2 — Fuente de datos "viva"**: decidir si el equipo sigue editando estos mismos Excel
  (y se regenera el JSON cada vez que cambien) o si se migra a una fuente más simple de
  mantener hacia adelante (Google Sheet con una fila por función, o el JSON directo). Afecta
  si el script de la Fase 1 es de una sola vez o un pipeline recurrente.
- **Fase 3 — Scaffold del proyecto**: Vite + Vue 3 + TypeScript en `app/`, con
  `customElement: true` en el plugin de Vue (afecta solo a futuros `*.ce.vue`, no al
  scaffold por defecto). Node local es v8 (incompatible con Vite) — se fijó `app/` para
  correr con Node 22 vía `.nvmrc` (`nvm use`). *(Hecho.)*
- **Fase 4 — Componentes de UI**: selector de ciudad/día, lista de sedes con horario, tarjeta
  de función (película o bloque de cortos), detalle de película/conversatorio, buscador y
  filtros (categoría, nacional/internacional, título).
  - **Índice derivado por película**: además de `data/<ciudad>.json` (sesiones con películas
    anidadas, útil para la vista "qué hay en tal sede a tal hora"), generar en
    `scripts/build_data.py` un `data/films.json` agrupado por título normalizado, cada uno
    con su lista de funciones (fecha, hora, sede, ciudad). Es lo que permite "buscar película
    → ver dónde y cuándo se proyecta" sin tocar el parser de Excel. Al construirlo hay que
    revisar a mano los títulos que no calcen exacto entre ciudades (mayúsculas, espacios,
    variantes de escritura) antes de agrupar, ya que ya se vieron inconsistencias de formato
    entre fuentes (ver `data/README.md`).
- **Fase 5 — Empaquetado como Web Component**: `defineCustomElement`, Shadow DOM para aislar
  estilos del sitio anfitrión, atributos (`city`, `day`) como props reactivas.
- **Fase 6 — Funcionalidades extra (opcional)**: botón "agregar al calendario" (.ics), link a
  mapa desde la dirección, filtro "hoy", favoritos en localStorage.
- **Fase 7 — Deploy**: bundle estático (JS + JSON) en hosting estático (Netlify/Vercel/GitHub
  Pages/S3); en el sitio del festival solo se agrega el `<script type="module">` y la etiqueta
  `<ficdeh-cartelera>`.
- **Fase 8 — Mantenimiento**: definir el proceso para regenerar el JSON cuando cambie la
  programación (ya se observan ediciones tipo "SE AGREGO" en los archivos actuales, así que
  esto va a pasar seguido durante el festival).

## Estado

- [x] Exploración inicial de los archivos Excel y su estructura.
- [x] Decisión de arquitectura (Vue + `defineCustomElement`).
- [x] Fase 1 — Script de conversión Excel → JSON (mergeado a `main`).
- [ ] Fase 2 — Fuente de datos "viva" (pendiente, se saltó por ahora a la Fase 3).
- [x] Fase 3 — Scaffold del proyecto (rama `fase-3-scaffold-proyecto`, pendiente de merge).
- [ ] Fase 4 en adelante.
