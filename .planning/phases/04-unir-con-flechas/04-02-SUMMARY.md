---
phase: 04-unir-con-flechas
plan: "02"
subsystem: session-selector
tags: [variant-selector, session-filtering, renderSesion, unir]
dependency_graph:
  requires: [04-01]
  provides: [variant-selector-ui, variant-based-filtering]
  affects: [App.session.start, App.ui.renderSesion, App.ui._sesionEmpezar]
tech_stack:
  added: []
  patterns: [conditional-template-section, localStorage-allowlist-validation]
key_files:
  created: []
  modified: [index.html]
key_decisions:
  - "Sección Dirección/Variante condicional en el mismo bloque de template — una expresión ternaria reemplaza toda la section, no duplicación de lógica"
  - "App.session._matchVariant se setea en _sesionEmpezar antes de llamar start() — sigue el patrón del closure existente sin necesidad de parámetros extra"
  - "Filtro de variante en session.start lee _matchVariant antes de que App.session sea reemplazado por el objeto nuevo — el fallback 'es-he' cubre primer arranque"
metrics:
  duration: "5min"
  completed: "2026-10-13"
  tasks: 2
  files: 1
---

# Phase 4 Plan 02: Variant Selector + Session Filtering Summary

**One-liner:** Selector condicional de variante ES↔HE/sg↔pl/masc↔fem en renderSesion con filtrado de palabras en App.session.start según variante activa.

## What Was Built

Task 1 — Selector de variante en renderSesion:
- `VALID_VARIANTS` allowlist para validar valor desde localStorage (T-04-04)
- Campo `matchVariant` en el state object de renderSesion con validación allowlist
- `matchVariant` persiste en `ivrit.v1.settings.lastSession` via `saveState()`
- Sección Dirección/Variante condicional: cuando `_pendingMode === 'unir'` muestra tres chips (ES↔HE, Singular↔Plural, Masc.↔Fem.); en cualquier otro modo muestra Dirección (comportamiento anterior intacto)
- Handler `App.ui._sesionSetVariant(v)` que actualiza state y re-renderiza
- `_sesionEmpezar` ahora pasa `state.matchVariant` a `App.session._matchVariant` antes de llamar `start()`

Task 2 — Filtro de variante en App.session.start:
- Bloque `if (mode === 'unir')` insertado justo antes del Fisher-Yates shuffle
- `sg-pl`: `words.filter(w => w.mpl && w.mpl !== w.msg)` — solo sustantivos con plural distinto
- `masc-fem`: `words.filter(w => w.kind === 'gendered')` — solo adjetivos y profesiones
- `es-he`: sin filtro adicional, todo el vocabulario es válido
- Lee `App.session._matchVariant` (seteado antes por `_sesionEmpezar`) con fallback `'es-he'`

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| 1 | `286ac5c` | feat(04-02): variant selector in renderSesion + localStorage persistence |
| 2 | `edf8c6b` | feat(04-02): filter words by variant in App.session.start |

## Deviations from Plan

None — plan ejecutado exactamente como estaba escrito.

## Threat Model Coverage

| Threat | Mitigation | Status |
|--------|-----------|--------|
| T-04-04: matchVariant desde localStorage | `VALID_VARIANTS.includes(raw.matchVariant)` antes de asignar; fallback `'es-he'` | Mitigado |
| T-04-05: _matchVariant en session.start | Accept — solo afecta lista de palabras, sin ejecución de código | Aceptado |

## Known Stubs

None — el flujo completo Selector → Variante → Session start → renderUnir está operativo.

## Self-Check: PASSED

- `index.html` existe y contiene todos los cambios
- Commit `286ac5c` existe: `git log --oneline | grep 286ac5c` ✓
- Commit `edf8c6b` existe: `git log --oneline | grep edf8c6b` ✓
- `VALID_VARIANTS` declarado con los tres valores ✓
- `matchVariant` en state con validación allowlist ✓
- `matchVariant` en saveState() ✓
- Sección condicional `_pendingMode === 'unir'` en template ✓
- Handler `_sesionSetVariant` definido ✓
- `_matchVariant = state.matchVariant` en `_sesionEmpezar` ✓
- Filtro `mode === 'unir'` con sg-pl y masc-fem en `session.start` ✓
