---
phase: 01-base
plan: 02
subsystem: data
tags: [vocab, normalization, localstorage, leitner, vanilla-js, hebrew]

requires:
  - phase: 01-base-plan-01
    provides: "App scaffold con Store helpers, App.state.vocab[], App.data {}, App.ui.showToast"

provides:
  - "App.data.normalize(rawData) — función pura que convierte vocab.json crudo en word objects tipados"
  - "App.data.load() — carga vocab.json o caché localStorage (la más nueva), normaliza y puebla App.state.vocab[]"
  - "HEADER_MAP, detectKind(), slugify() — helpers de normalización disponibles en scope global del script"
  - "App.state.vocab[] poblado con ~735 palabras normalizadas al arrancar"
  - "App.state.progress, App.state.stats restaurados desde localStorage al arrancar"

affects:
  - "01-03 (router y pantallas consumen App.state.vocab)"
  - "01-04 (Inicio usa App.state.vocab.length y distribución de kinds)"
  - "01-05 (Diccionario filtra App.state.vocab)"
  - "todas las fases que implementen ejercicios (usan word.kind, word.msg, word.fsg, etc.)"

tech-stack:
  added: []
  patterns:
    - "Normalización pura: App.data.normalize() no tiene side-effects, fácil de testear"
    - "Caché localStorage con comparación de campo 'updated' (ISO string) para invalidación"
    - "HEADER_MAP por texto, no por posición — robusto ante reordenamiento de columnas"
    - "Kind detectado desde los headers de la categoría, no fila por fila"
    - "ID estable: slug(cat)::slug(es) [+::slug(msg) si hay duplicado de es en la categoría]"

key-files:
  created: []
  modified:
    - "index.html — sección 5 DATA: App.data.normalize, App.data.load, HEADER_MAP, detectKind, slugify; App.init actualizado con await App.data.load()"

key-decisions:
  - "HEADER_MAP es una const en scope global del script (no dentro de normalize) — permite reutilización en Plan 04+ sync logic sin duplicar la tabla"
  - "detectKind y slugify también globales por la misma razón"
  - "normalize() pura sin side-effects — testeable de forma aislada en tests.html (Plan 03+)"
  - "App.state.progress/stats restaurados en App.data.load() (no en App.init) — lógica de datos cohesionada en un lugar"
  - "Caché: cache.updated >= raw.updated usa comparación de strings ISO 8601 (lexicográfica = cronológica para UTC)"

requirements-completed: [DATA-01, DATA-02, DATA-03, DATA-04, DATA-05, DATA-06]

duration: 5min
completed: 2026-10-13
---

# Phase 1 Plan 02: Data Loading y Normalización Summary

**Pipeline de datos completo: fetch de vocab.json con fallback a caché localStorage, normalización a word objects tipados con IDs estables, detectando verb/expr/country/gendered/noun por headers de categoría**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-10-13T13:54:00Z
- **Completed:** 2026-10-13T13:57:00Z
- **Tasks:** 2 (implementados en un commit atómico por ser una sola función + su wiring)
- **Files modified:** 1

## Accomplishments

- `App.data.normalize(rawData)` — función pura SPEC §2.2–2.4: mapeo de headers hebreos por texto, detección de kind por categoría, IDs estables con slug, `null` para celdas "—", campo `extra{}` para headers desconocidos, fusión de categorías duplicadas
- `App.data.load()` — carga vocab.json o caché localStorage (la más nueva por campo `updated`), normaliza, puebla `App.state.vocab[]` y restaura progress/stats/settings
- `App.init` actualizado con `await App.data.load()` — la app arranca con el vocabulario completo antes del routing (Plan 03)

## Task Commits

1. **Task 1 + Task 2: normalize + load + App.init wiring** — `c84e27a` (feat)

## Files Created/Modified

- `index.html` — +144 líneas: sección `=== 5. DATOS ===` con `HEADER_MAP`, `detectKind()`, `slugify()`, `App.data.normalize()`, `App.data.load()`; `App.init` actualizado

## Decisions Made

- `HEADER_MAP`, `detectKind`, `slugify` son `const`/`function` en scope global del script en lugar de locales a `normalize()` — la lógica de sync (Plan 04) necesitará normalizar también y evita duplicar la tabla de mapeo
- `normalize()` es pura (sin side-effects) para ser testeable en `tests.html`
- La comparación `cache.updated >= raw.updated` usa strings ISO 8601 UTC — comparación lexicográfica es correcta para fechas UTC

## Deviations from Plan

Ninguna — el plan se ejecutó exactamente como estaba escrito.

## Known Stubs

Ninguno — `App.state.vocab` se puebla con datos reales de vocab.json (~735 palabras). No hay placeholders ni datos hardcodeados.

## Issues Encountered

Ninguno.

## User Setup Required

Ninguno — la app usa `vocab.json` local como fuente de datos. Para testing: `python3 -m http.server 8080` y verificar en consola `App.state.vocab.length` (~735).

## Next Phase Readiness

- **Plan 03 (Router + Pantallas):** `App.state.vocab[]` poblado y disponible; `App.router` declarado listo para implementar; `.screen`/`.screen.active` CSS ya presentes
- **Plan 04 (Inicio):** `App.state.vocab.length`, `App.state.progress`, `App.state.stats` disponibles para mostrar resumen
- **Plan 05 (Diccionario):** `App.state.vocab` con `kind`, `es`, `msg`, `fsg`, `fpl`, `mpl`, `group`, `cat` — todo lo necesario para filtrar y buscar

---
*Phase: 01-base*
*Completed: 2026-10-13*
