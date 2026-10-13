---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: Executing
last_updated: "2026-10-13T14:20:00Z"
progress:
  total_phases: 10
  completed_phases: 1
  total_plans: 5
  completed_plans: 5
---

# State: Ivrit

## Project Reference

See: `.planning/PROJECT.md` (updated 2026-10-12)

**Core value:** El progreso Leitner que hace que el usuario vuelva a estudiar todos los días
**Current focus:** Phase 1 — Base COMPLETA. Próximo: Phase 2.

## Current Phase

**Phase 1: Base — COMPLETA**
Goal: La app carga y normaliza vocab.json, el router funciona, el layout mobile/dark es correcto, la pantalla Inicio muestra el resumen real, el Diccionario busca y el Selector de sesión configura una sesión.

Status: Completed — 5/5 planes completados (2026-10-13)

**Completed plans:**
- Plan 01: HTML Shell + CSS Design System — `13f76f8`
- Plan 02: Data loading y normalización de vocab.json — `c84e27a`
- Plan 03: Router + pantallas base — `0f773b2`
- Plan 04: Diccionario — `10ea949`
- Plan 05: Selector de Sesión — `1625162`

**Next:** Phase 2 — (por planificar)

## Phase History

| Phase | Status | Completed |
|-------|--------|-----------|
| Phase 1: Base | Completed | 2026-10-13 |

## Active Blockers

None.

## Key Decisions

- Tema auto usa `:root:not([data-theme="light"])` dentro de `@media prefers-color-scheme:dark` — permite que 'claro' anule el OS sin JS adicional
- `applyTheme('auto')` elimina el atributo `data-theme` (en lugar de setearlo a 'auto') — CSS media query toma el control directamente
- App object scaffold: `const App = {}` con sub-módulos `App.data`, `App.state`, `App.router`, `App.ui`
- Store wrapper con try/catch por operación + flag `App.state.storageOk` para modo in-memory silencioso
- HEADER_MAP, detectKind, slugify en scope global (no locales a normalize) — reutilizables en sync logic de Plan 04
- normalize() es función pura sin side-effects — testeable de forma aislada
- Caché: cache.updated >= raw.updated usa comparación lexicográfica de strings ISO 8601 UTC (correcta por definición)
- Router allowlist: rutas desconocidas caen a renderInicio — hash nunca se ejecuta como código
- renderDiccionario/renderSesion declarados como stubs — el router los llama con la interfaz correcta ya
- Fallback setTimeout(250ms) en page-leave: animationend no dispara con prefers-reduced-motion:reduce
- Media query del grid de modos inyectada con id guard (inicio-grid-style) — no poluciona el CSS global
- normalizeSearch global (no closure): reutilizable en sesión y sync futuros
- <details>/<summary> para acordeones Diccionario — nativo, accesible, sin JS de toggle
- XSS T-04-01: span.textContent = query; safe.innerHTML — una línea, correcto para todos los chars HTML
- heFields Set incluye 'group': en categoría Countries el campo región es texto hebreo
- Validación allowlist de lastSession al cargar (T-05-01) — campos inválidos caen a defaults silenciosamente
- Re-render completo en cada interacción de sesión (rerender()) — 735 palabras, <1ms, más simple que diff parcial
- state.cats = [] semántica 'todas seleccionadas' — evita sincronizar con catOrder al agregar categorías futuras

## Key Context for Next Phase

- `index.html` completo con todo el CSS base, App scaffold, data loading, router, Inicio, Diccionario y Sesión
- `App.state.vocab[]` poblado con ~735 word objects normalizados al arrancar
- `App.state.progress{}`, `App.state.stats{}` restaurados desde localStorage en `App.data.load()`
- `App.ui.renderSesion()` implementado: 17 chips de categoría, 4 filtros, 3 direcciones, 4 cantidades
- `App.ui._sesionState` expuesto: `{ cats, filter, direction, quantity }` — fases siguientes lo leen para configurar modos
- `ivrit.v1.settings.lastSession` en localStorage: persistencia cross-session desde Phase 1
- `getMatchingWords()` logic disponible en renderSesion: todas/nuevas/dificiles/hoy
- `normalizeSearch()` en scope global — strips niqqud hebreo + acentos españoles, lowercase/trim
- `Store` helper disponible con `get/set/remove` wrapeados en try/catch
- `APPS_SCRIPT_URL` disponible en scope global del script

## Performance Metrics

| Phase | Plan | Duration | Tasks | Files |
|-------|------|----------|-------|-------|
| 01-base | 01 | 3min | 1 | 1 |
| 01-base | 02 | 5min | 2 | 1 |
| 01-base | 03 | 8min | 2 | 1 |
| 01-base | 04 | 6min | 1 | 1 |
| 01-base | 05 | 4min | 1 | 1 |

---
*Last session: 2026-10-13T14:20:00Z — Completed 01-05-PLAN.md (Phase 1 Base COMPLETA)*
*Stopped at: Phase 2 (por planificar)*
