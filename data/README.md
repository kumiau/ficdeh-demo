# Datos generados (Fase 1)

Este directorio se genera con `python3 scripts/build_data.py` a partir de los Excel en
`programacion xls/`. No se edita a mano — para corregir un dato hay que corregirlo en el
Excel fuente (o en el script, si es un problema de parseo) y volver a correr el script.

## Archivos

- `data/<city-slug>.json` — una ciudad/track: `{ citySlug, cityName, sourceFiles, sessions[] }`.
- `data/index.json` — resumen de todas las ciudades (conteos) y advertencias del último build.

## Esquema de `Session`

```
{
  date: "2026-08-15",        // ISO
  time: "6:00 p.m",          // etiqueta original, tal cual aparece en el Excel
  timeSortKey: 1080,         // minutos desde medianoche, solo para ordenar
  venueName: "CINEMATECA DE BOGOTÁ - BOLETERÍA EN TAQUILLA",
  venueAddress: "Carrera 3 # 19 - 10 - Santa Fe" | null,
  films: Film[],
  notes: string[]            // texto suelto que no se pudo estructurar (ver limitaciones)
}
```

## Esquema de `Film`

Todos los campos son opcionales (`null` si el Excel no lo traía). El formato "cartelera"
(Bogotá) solo llena `title, director, durationMin, country, year, category, sala, qa,
premiere`. El formato "flat" (el resto de ciudades) además trae `synopsisEs, synopsisEn,
directorProfile, filmSocial, directorSocial, posterUrl, trailerUrl, themePrimary,
themeSecondary, pressKitUrl, ageRating`.

`LINK` y `CONTRASEÑA` (credenciales de proyecciones en línea para jurados/prensa) se excluyen
siempre — nunca deben llegar a un dato público.

## Ciudades y fuentes usadas

Ver el diccionario `CITY_CONFIG` en `scripts/build_data.py` para el detalle exacto y el
comentario sobre qué archivos se excluyeron y por qué (duplicados verificados cruzando
nombres de sede). En resumen:

- **Bogotá**: solo `Bogotá_Programación 13° FICDEH.xlsx` (formato cartelera). Se comprobó que
  las sedes de `Cinemateca de Bogotá_Programación...`, `Programación _ BIBLIORED.xlsx` y
  `Programación _ CASAS DE JUVENTUD.xlsx` ya están todas dentro de este archivo maestro —
  incluirlas duplicaba sesiones.
- **Pazósfera**: separada de Bogotá como su propio "city slug" (`pazosfera`) porque es un
  programa nacional en centros de reclusión (Armenia, Barranquilla, Cartagena, Cali,
  Manizales, Pereira, Tunja, Quibdó...), no una sede bogotana.
- **Resto de ciudades**: el archivo plano `Programación _ <CIUDAD>.xlsx` (una fila por
  función), que es más rico que el cartelera y ya cubre toda la ciudad.

## Limitaciones conocidas

- **Ibagué** (`Programación _ IBAGUE.xlsx`) solo trae `Fecha, Hora, Lugar, Nombre` — no hay
  director/duración/país/categoría en el Excel fuente, así que esos campos quedan `null`
  para toda esa ciudad.
- **Un caso puntual en Bogotá** (sede BP CEFE Fontanar del Río, 13 AGO 11:00 a.m.): la
  primera película del bloque quedó con el título `"Cortometrajes"` en vez de `"Sukua"`
  porque en el Excel origen el título de esa fila específica se escribió en la columna
  "NOMBRE PELÍCULA" en vez de la columna vecina (a diferencia de las demás filas del mismo
  bloque). Se puede corregir a mano en `data/bogota.json` o arreglando la celda en el Excel y
  regenerando.
- El parser de "cartelera" separa notas de conversatorio/eventos especiales (moderación,
  protagonistas, reseñas de charlas) en `session.notes` como texto libre en vez de
  estructurarlas — son 16 sesiones en Bogotá con este tipo de nota.
- No se auditaron exhaustivamente las 12 ciudades fila por fila — se revisó a fondo Bogotá
  (la prioritaria) y se hicieron verificaciones puntuales en el resto. Si al usar los datos
  aparecen sesiones raras, lo más probable es una variación de formato no vista en esta
  revisión; el script está escrito para que ese tipo de ajuste sea local (un campo en
  `FLAT_FIELD_MAP` o `CARTELERA_FIELD_MAP`), no un rediseño.
