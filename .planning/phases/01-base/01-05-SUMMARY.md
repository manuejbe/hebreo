---
phase: 01-base
plan: 05
subsystem: ui
tags: [vanilla-js, session-selector, chips, leitner, multi-select, localStorage]

requires:
  - phase: 01-base-plan-02
    provides: "App.state.vocab[] ~735 word objects con campo cat para agrupar por categoría"
  - phase: 01-base-plan-03
    provides: "App.ui.renderSesion stub en el router, Store helper con try/catch"
  - phase: 01-base-plan-04
    provides: "normalizeSearch global disponible para filtrado"

provides:
  - "App.ui.renderSesion(el): pantalla completa con 17 chips de categoría, 4 filtros, 3 direcciones, 4 cantidades"
  - "App.ui._sesionState: objeto state compartido — { cats, filter, direction, quantity }"
  - "lastSession shape persistida en ivrit.v1.settings.lastSession via Store"
  - "getMatchingWords(): filtrado de palabras por categoría + filtro (todas/nuevas/dificiles/hoy)"

affects:
  - "fases futuras (tarjetas, opción múltiple, etc.) — leerán App.ui._sesionState para configurar la sesión"
  - "02+ (sync remoto) — deben escapar category names si ya no vienen de vocab.json local"

tech-stack:
  added: []
  patterns:
    - "Re-render pattern: rerender() = saveState() + renderSesion(el) recursivo — sencillo, sin VDOM"
    - "T-05-01: allowlist validation en carga de lastSession — VALID_FILTERS/DIRECTIONS/QUANTITIES arrays"
    - "T-05-02: cat.replace(/'/g, \"\\\\'\") para nombres de categoría en onclick attribute"
    - "chips como <button> inline con aria-pressed — semántica y accesibilidad sin CSS classes globales"

key-files:
  created: []
  modified:
    - "index.html — +201 líneas netas: sección 7b (renderSesion completo); reemplaza stub de 1 línea"

key-decisions:
  - "Validación allowlist de lastSession al cargar (T-05-01) — campos inválidos caen a defaults, sin excepciones"
  - "Re-render completo en cada interacción (rerender()) — 735 palabras, <1ms, más simple que diff parcial"
  - "state.cats = [] semántica 'todas seleccionadas' → evita sincronizar con catOrder al agregar categorías futuras"
  - "getMatchingWords local a renderSesion (no global) — solo se usa aquí; reutilización es YAGNI"

requirements-completed: [SESI-01, SESI-02, SESI-03, SESI-04, SESI-05]

duration: 4min
completed: 2026-10-13
---

# Phase 1 Plan 05: Selector de Sesión Summary

**Pantalla Selector de Sesión con 17 chips de categoría multi-select, 4 filtros (todas/nuevas/difíciles/hoy), 3 direcciones, 4 cantidades, persistencia en localStorage y validación de seguridad en carga**

## Performance

- **Duration:** ~4 min
- **Completed:** 2026-10-13
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments

- `App.ui.renderSesion()`: reemplaza el stub del Plan 03. Construye 17 chips de categoría con multi-select (fondo azul = seleccionada, outline = deseleccionada), botones Todas/Ninguna, grupo de filtros, grupo de dirección, grupo de cantidad.
- `getMatchingWords()`: filtra `App.state.vocab` por categorías seleccionadas, luego aplica el filtro activo. Filter 'nuevas' excluye palabras con progress.box > 0; 'dificiles' incluye box ≤ 2 o lastWrong en los últimos 7 días; 'hoy' incluye palabras con due ≤ now y box > 0.
- **Persistencia**: cada interacción llama a `saveState()` que escribe `ivrit.v1.settings.lastSession` vía `Store.set()`. Al cargar, se leen los valores guardados con validación de allowlists.
- **Botón Empezar**: muestra el count de palabras coincidentes. Deshabilitado si count = 0. Muestra aviso amber si count < quantity solicitada. En Phase 1 muestra toast stub.
- **T-05-01 mitigado**: campos de lastSession validados contra `VALID_FILTERS`, `VALID_DIRECTIONS`, `VALID_QUANTITIES` y `Array.isArray` para cats — valores inválidos caen a defaults.
- **T-05-02 documentado**: nombres de categoría provienen de vocab.json (archivo local estático, trusted). Apostrofes escapados con `replace(/'/g, "\\'")`.

## Task Commits

1. **Task 1: renderSesion + getMatchingWords + localStorage persistence** — `1625162` (feat)

## Files Created/Modified

- `index.html` — +201 líneas netas: sección 7b (renderSesion completo + handlers); stub de 1 línea reemplazado

## Session State Shape Confirmed

```js
// Guardado en ivrit.v1.settings.lastSession
{
  cats:      ['Verbos', 'Adjetivos', ...],  // [] = todas seleccionadas
  filter:    'todas',     // 'todas' | 'nuevas' | 'dificiles' | 'hoy'
  direction: 'es-he',    // 'es-he' | 'he-es' | 'mezclada'
  quantity:  10          // 10 | 20 | 30 | 0 (0 = todas)
}
```

## Decisions Made

- Validación allowlist en carga de lastSession (T-05-01) — un campo con valor inesperado (e.g. `filter: "hack"`) cae silenciosamente a default sin tirar error ni romper la UI.
- Re-render completo en cada interacción (`renderSesion(el)` recursivo) — con 735 palabras el render tarda <1ms; evita la complejidad de DOM diff manual.
- `state.cats = []` significa "todas seleccionadas" en `getMatchingWords()` — esto evita tener que sincronizar el array con catOrder si en el futuro se agregan categorías.
- `getMatchingWords` como función local (closure) en lugar de método global — solo se necesita aquí, exportarla sería YAGNI.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Security] Validación de fields de lastSession al cargar (T-05-01)**
- **Found during:** Task 1 — el plan incluyó T-05-01 en el threat_model con disposición `mitigate`
- **Issue:** El template del plan no incluía la validación explícita de fields; sin ella un `lastSession` manipulado podría inyectar valores inválidos en el estado de la app
- **Fix:** Allowlists `VALID_FILTERS`, `VALID_DIRECTIONS`, `VALID_QUANTITIES` + `Array.isArray` check para cats; cada field con valor fuera de la allowlist cae al default correspondiente
- **Files modified:** index.html
- **Committed in:** 1625162

---

**Total deviations:** 1 auto-fixed (1 security/mitigate del threat model)
**Impact on plan:** Corrección de seguridad requerida por el threat model. Sin scope creep.

## Known Stubs

- `_sesionEmpezar()`: muestra toast "Modos de estudio disponibles próximamente" — los modos de estudio se implementan en fases posteriores. No bloquea el objetivo de este plan (configurar y persistir la sesión).

## Threat Surface Scan

| Flag | File | Description |
|------|------|-------------|
| T-05-01 mitigated | index.html | lastSession de localStorage — allowlist validation en carga |
| T-05-02 documented | index.html | Category names en onclick — apostrofes escapados; trusted source (vocab.json local) |

Ninguna superficie nueva fuera del threat model del plan.

## Self-Check: PASSED

- `index.html` existe y contiene `App.ui.renderSesion = function`: FOUND
- `index.html` contiene `lastSession`: FOUND (x2)
- `index.html` contiene `getMatchingWords`: FOUND (x2)
- `index.html` contiene `_sesionToggleCat`: FOUND (x2)
- `index.html` contiene `isInsufficient`: FOUND (x2)
- Commit `1625162` existe: FOUND

## Next Phase Readiness

- `App.ui._sesionState` expuesto — fases posteriores leen `{ cats, filter, direction, quantity }` para configurar cada modo de estudio
- `getMatchingWords` lógica validada — fases posteriores pueden copiar o adaptar el filtrado
- `ivrit.v1.settings.lastSession` en localStorage — persistencia cross-session lista desde Phase 1

---
*Phase: 01-base — Plan 05 completo. Phase 1 Base COMPLETA.*
*Completed: 2026-10-13*
