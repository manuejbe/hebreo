---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: Executing
last_updated: "2026-10-13T13:57:00Z"
progress:
  total_phases: 10
  completed_phases: 0
  total_plans: 5
  completed_plans: 2
---

# State: Ivrit

## Project Reference

See: `.planning/PROJECT.md` (updated 2026-10-12)

**Core value:** El progreso Leitner que hace que el usuario vuelva a estudiar todos los días
**Current focus:** Phase 1 — Base (Plan 01 completo, Plan 02 siguiente)

## Current Phase

**Phase 1: Base**
Goal: La app carga y normaliza vocab.json, el router funciona, el layout mobile/dark es correcto, la pantalla Inicio muestra el resumen real, el Diccionario busca y el Selector de sesión configura una sesión.

Status: Executing — 2/5 planes completados (2026-10-13)

**Completed plans:**
- Plan 01: HTML Shell + CSS Design System — `13f76f8`
- Plan 02: Data loading y normalización de vocab.json — `c84e27a`

**Next:** Plan 03 — Router + pantallas base

## Phase History

| Phase | Status | Completed |
|-------|--------|-----------|
| — | — | — |

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

## Key Context for Next Phase

- `index.html` creado con todo el CSS base y App scaffold — todos los planes siguientes lo extienden
- `App.state.vocab[]` poblado con ~735 word objects normalizados al arrancar — Plan 03+ puede consumirlos directamente
- `App.state.progress{}`, `App.state.stats{}` restaurados desde localStorage en `App.data.load()`
- `App.data.normalize(rawData)` — función pura disponible para re-normalizar datos sync (Plan 04)
- `HEADER_MAP`, `detectKind()`, `slugify()` en scope global del script — reutilizables en sync logic
- `Store` helper disponible con `get/set/remove` wrapeados en try/catch
- Caché de vocab en `ivrit.v1.vocabCache` con campo `updated` para invalidación por fecha ISO
- `.screen` / `.screen.active` CSS ya presentes — Plan 03 solo necesita implementar el router

## Performance Metrics

| Phase | Plan | Duration | Tasks | Files |
|-------|------|----------|-------|-------|
| 01-base | 01 | 3min | 1 | 1 |
| 01-base | 02 | 5min | 2 | 1 |

---
*Last session: 2026-10-13T13:57:00Z — Completed 01-02-PLAN.md*
*Stopped at: Plan 03 (router + pantallas base)*
