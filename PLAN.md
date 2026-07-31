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
- **Fase 1 — Script de conversión Excel → JSON**: script en Python (`openpyxl`, ya disponible
  en el entorno) que recorra cada archivo/hoja, detecte bloques de sede, agrupe filas por
  `HORA` y genere un JSON limpio por ciudad. Debe tolerar las variaciones de columnas
  encontradas entre ciudades. *(Próximo paso a ejecutar.)*
- **Fase 2 — Fuente de datos "viva"**: decidir si el equipo sigue editando estos mismos Excel
  (y se regenera el JSON cada vez que cambien) o si se migra a una fuente más simple de
  mantener hacia adelante (Google Sheet con una fila por función, o el JSON directo). Afecta
  si el script de la Fase 1 es de una sola vez o un pipeline recurrente.
- **Fase 3 — Scaffold del proyecto**: Vite + Vue 3 + TypeScript, configurado en modo "custom
  element" (`customElement: true` en el plugin de Vue).
- **Fase 4 — Componentes de UI**: selector de ciudad/día, lista de sedes con horario, tarjeta
  de función (película o bloque de cortos), detalle de película/conversatorio, buscador y
  filtros (categoría, nacional/internacional, título).
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
- [ ] Fase 1 — Script de conversión Excel → JSON.
- [ ] Fase 2 en adelante.
