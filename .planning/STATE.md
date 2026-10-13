---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: Not started
last_updated: "2026-10-13T02:04:15.070Z"
progress:
  total_phases: 10
  completed_phases: 0
  total_plans: 0
  completed_plans: 0
---

# State: Ivrit

## Project Reference

See: `.planning/PROJECT.md` (updated 2026-10-12)

**Core value:** El progreso Leitner que hace que el usuario vuelva a estudiar todos los días
**Current focus:** Phase 1 — Base

## Current Phase

**Phase 1: Base**
Goal: La app carga y normaliza vocab.json, el router funciona, el layout mobile/dark es correcto, la pantalla Inicio muestra el resumen real, el Diccionario busca y el Selector de sesión configura una sesión.

Status: Not started

## Phase History

| Phase | Status | Completed |
|-------|--------|-----------|
| — | — | — |

## Active Blockers

None.

## Key Context for Next Phase

- vocab.json ya tiene datos reales (17 categorías, ~735 palabras) — usar como fuente de verdad
- DESIGN.md define el sistema de diseño completo — seguirlo en toda la UI
- SPEC.md §2 define el mapeo de encabezados y la normalización — es la fuente de verdad para los datos
- El Apps Script ya está implementado — no hay que tocarlo en Phase 1
- Todo va en un solo index.html con CSS y JS inline (sin módulos ES, sin build)

---
*State initialized: 2026-10-12*
