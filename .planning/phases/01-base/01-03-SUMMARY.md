---
phase: 01-base
plan: 03
subsystem: ui
tags: [router, hash-routing, inicio, mode-grid, leitner, vanilla-js, hebrew]

requires:
  - phase: 01-base-plan-02
    provides: "App.state.vocab[] poblado (~735 palabras), App.state.progress{}, App.state.stats{}, Store helpers"

provides:
  - "App.router: _parseHash, navigate, _renderScreen, init — hash routing completo con hashchange"
  - "App.ui.renderStub — stub screen genérico para rutas no implementadas"
  - "App.ui.renderInicio — pantalla Inicio con 5 stats, botón Repaso del día, grilla 10 modos, barras de progreso por categoría, sección sync"
  - "APPS_SCRIPT_URL constant en scope global del script"
  - "App.init ahora llama App.router.init() tras cargar datos"

affects:
  - "01-04 (Diccionario — el router ya espera App.ui.renderDiccionario)"
  - "01-05 (Sesión — el router ya espera App.ui.renderSesion)"
  - "todas las fases que agreguen rutas nuevas (usan App.router._renderScreen y renderers map)"

tech-stack:
  added: []
  patterns:
    - "Router allowlist: rutas desconocidas caen a renderInicio — nunca ejecuta código de hash arbitrario"
    - "Stub temporal: renderDiccionario y renderSesion definidos como stubs hasta que sus planes los implementen"
    - "Responsive grid inline: media query inyectada una sola vez con id guard (inicio-grid-style)"
    - "Transición page-leave con fallback setTimeout(250ms) para prefers-reduced-motion"

key-files:
  created: []
  modified:
    - "index.html — secciones 6 (ROUTER) y 7 (INICIO SCREEN) + APPS_SCRIPT_URL; App.init actualizado"

key-decisions:
  - "renderDiccionario y renderSesion definidos como stubs inline (no en el router) — el router los llama igual, los planes 04-05 los sobreescriben"
  - "Transición page-leave con fallback setTimeout(250ms): animationend puede no dispararse con prefers-reduced-motion:reduce"
  - "Grilla de modos: 2 cols mobile / 3 cols desktop via media query inyectada con id guard — evita duplicar el style en cada render"
  - "lastSync lee directamente localStorage en lugar de pasar por Store.get — evita double-parse del cache que ya tiene el campo updated"

requirements-completed: [ROUT-01, INIC-01, INIC-02, INIC-03, INIC-04, INIC-05]

duration: 8min
completed: 2026-10-13
---

# Phase 1 Plan 03: Router + Pantallas Base Summary

**Hash router con 13 rutas (allowlist + fallback), pantalla Inicio con 5 stats reales, grilla 10 modos (todos grises), barras de progreso Leitner por categoría y sección de sync**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-10-13T13:57:00Z
- **Completed:** 2026-10-13T14:00:37Z
- **Tasks:** 2 (implementados en un commit atómico — mismo archivo, cambios inseparables)
- **Files modified:** 1

## Accomplishments

- `App.router`: parseo de hash con query params (`#/ruta?clave=valor`), navigate con transición page-leave/page-enter, allowlist de rutas con fallback a Inicio, init() con hashchange + hash inicial
- Stub screens para 10 rutas no implementadas (`renderStub`) + stubs temporales para `renderDiccionario` y `renderSesion`
- `App.ui.renderInicio`: 5 stat cards con datos reales de `App.state` (total, dominadas, para hoy, nuevas, racha), botón prominente "Repaso del día", grilla 2→3 columnas con 10 modos (opacity:0.45 + pointer-events:none para los unavailable), barras de progreso Leitner por categoría (box 0–5 por color), sección sync con fecha y botón stub
- `APPS_SCRIPT_URL` en scope global del script (SPEC §Config)

## Task Commits

1. **Task 1 + Task 2: router + renderInicio** — `0f773b2` (feat)

Los dos tasks se implementaron en un único commit porque ambos modifican el mismo archivo `index.html` y el Task 2 depende estructuralmente del Task 1 (el router llama a `renderInicio`).

## Files Created/Modified

- `index.html` — +267 líneas: sección `=== 6. ROUTER ===` (App.router, renderStub, stubs diccionario/sesion), sección `=== 7. INICIO SCREEN ===` (renderInicio completo), `APPS_SCRIPT_URL` constant, App.init actualizado

## Decisions Made

- `renderDiccionario` y `renderSesion` definidos como stubs que llaman a `renderStub` — el router ya los invoca con la interfaz correcta; los Planes 04-05 los sobreescribirán con la implementación real
- Fallback `setTimeout(250ms)` en la transición page-leave: `animationend` no siempre se dispara con `prefers-reduced-motion: reduce` (las duraciones se reducen a 0.01ms y el evento puede no llegar)
- Media query del grid de modos inyectada con id guard (`inicio-grid-style`) en lugar de estar en el `<style>` global — mantiene el CSS del Inicio Screen junto a su lógica JS y no poluciona el CSS global con estilos de una pantalla específica

## Deviations from Plan

Ninguna — el plan se ejecutó exactamente como estaba escrito.

## Known Stubs

- `App.ui.renderDiccionario` — stub, implementado en Plan 04
- `App.ui.renderSesion` — stub, implementado en Plan 05
- Botón "Repaso del día" — muestra toast, implementado en Plan 05
- Botón "Sincronizar" — muestra toast, implementado en Plan 04 (sync con Apps Script)
- Todos los modos de la grilla — `available: false`, se activan en fases 3-7 según CONTEXT.md

Ningún stub bloquea el objetivo del plan: la pantalla Inicio muestra datos reales de `App.state.vocab` y el router navega correctamente entre todas las rutas definidas.

## Threat Surface Scan

| Flag | File | Description |
|------|------|-------------|
| No new surface | index.html | Router usa allowlist; hash no se evalúa ni ejecuta como código |

T-03-01 (hash manipulation) mitigado: la función `_renderScreen` solo acepta rutas conocidas del allowlist; hashes arbitrarios caen a `renderInicio`. No hay `eval()` ni `innerHTML` directo del hash.

T-03-02 (XSS via innerHTML): `cat.name` y `m.name` provienen de `vocab.json` local (archivo estático); no son input del usuario en Phase 1. Se aceptó como trusted input hasta Phase 2 (sync remoto).

## Issues Encountered

Ninguno.

## User Setup Required

Ninguno — para verificar: `python3 -m http.server 8080` y abrir `http://localhost:8080`. La pantalla Inicio debe mostrar el total de palabras (>700) y la grilla de 10 modos.

## Next Phase Readiness

- **Plan 04 (Diccionario):** `App.ui.renderDiccionario` declarado como stub listo para sobreescribir; `App.state.vocab` disponible con todos los campos necesarios para filtrar y buscar
- **Plan 05 (Sesión):** `App.ui.renderSesion` declarado como stub; `App.router.current.params` disponible para recibir `?cat=Verbos&mode=tarjetas`

---
*Phase: 01-base*
*Completed: 2026-10-13*
