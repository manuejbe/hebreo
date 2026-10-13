---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: Executing
last_updated: "2026-10-13T13:53:00Z"
progress:
  total_phases: 10
  completed_phases: 0
  total_plans: 5
  completed_plans: 1
---

# State: Ivrit

## Project Reference

See: `.planning/PROJECT.md` (updated 2026-10-12)

**Core value:** El progreso Leitner que hace que el usuario vuelva a estudiar todos los días
**Current focus:** Phase 1 — Base (Plan 01 completo, Plan 02 siguiente)

## Current Phase

**Phase 1: Base**
Goal: La app carga y normaliza vocab.json, el router funciona, el layout mobile/dark es correcto, la pantalla Inicio muestra el resumen real, el Diccionario busca y el Selector de sesión configura una sesión.

Status: Executing — 1/5 planes completados (2026-10-13)

**Completed plans:**
- Plan 01: HTML Shell + CSS Design System — `13f76f8`

**Next:** Plan 02 — Data loading y normalización de vocab.json

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

## Key Context for Next Phase

- `index.html` creado con todo el CSS base y App scaffold — todos los planes siguientes lo extienden
- `App.state.vocab[]`, `App.state.progress{}`, `App.state.settings{}` declarados pero vacíos — Plan 02 los llena
- `Store` helper disponible con `get/set/remove` wrapeados en try/catch
- variables `ivrit.v1.progress`, `ivrit.v1.settings`, `ivrit.v1.vocabCache`, `ivrit.v1.stats` definidas
- vocab.json ya tiene datos reales (17 categorías, ~735 palabras) — usar como fuente de verdad
- DESIGN.md define el sistema de diseño completo — ya implementado en index.html
- SPEC.md §2 define el mapeo de encabezados y la normalización — fuente de verdad para Plan 02

## Performance Metrics

| Phase | Plan | Duration | Tasks | Files |
|-------|------|----------|-------|-------|
| 01-base | 01 | 3min | 1 | 1 |

---
*Last session: 2026-10-13T13:53:00Z — Completed 01-01-PLAN.md*
*Stopped at: Plan 02 (data loading)*
