---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: in_progress
last_updated: "2026-10-13T19:00:00.000Z"
progress:
  total_phases: 10
  completed_phases: 4
  total_plans: 15
  completed_plans: 11
  percent: 73
---

# State: Ivrit

## Project Reference

See: `.planning/PROJECT.md` (updated 2026-10-13)

**Core value:** El progreso Leitner que hace que el usuario vuelva a estudiar todos los días
**Current focus:** Phase 4 — Unir con flechas (próxima fase).

## Current Phase

**Phase 4: Unir con flechas — COMPLETED (2/2 plans complete)**
Goal: El modo de matching con líneas SVG funciona en móvil y desktop, con tap y variantes (ES↔HE, sg↔pl, masc↔fem).

Status: Completed — 2 plans, 2 waves (2026-10-13)

**Plans:**

- [x] Plan 01 (Wave 1): renderUnir — layout 2 cols, tap-tap logic, SVG lines, feedback, round summary (MATC-01,02,03,04,06) — `b7876de`
- [x] Plan 02 (Wave 2): Variant selector in renderSesion + session.start filtering (MATC-05,06) — `edf8c6b`

**Next:** `/gsd-plan-phase 5`

## Phase History

| Phase | Status | Completed |
|-------|--------|-----------|
| Phase 1: Base | Completed | 2026-10-13 |
| Phase 2: Sincronización | Completed | 2026-10-13 |
| Phase 3: Tarjetas y MCQ | Completed | 2026-10-13 |
| Phase 4: Unir con flechas | Completed | 2026-10-13 |

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
- Sección Dirección/Variante condicional en renderSesion — una expresión ternaria reemplaza toda la section según _pendingMode
- App.session._matchVariant seteado en _sesionEmpezar antes de start() — sigue patrón closure existente sin parámetros extra
- Filtro variante en session.start lee _matchVariant pre-reemplazo del objeto session; fallback 'es-he' cubre primer arranque

## Key Context for Next Phase

- `App.session` objeto completo: `{ mode, words[], index, direction, results[], _pendingMode, _cardDir }`
- `App.session.start(mode)` — filtra vocab, Fisher-Yates shuffle, slices a quantity; re-attachea `start` fn
- `App.ui.updateProgress(wordId, correct)` — Leitner: correct→box min+1,5; wrong→box=1; persiste via Store
- `App.ui.renderResultado(el)` — pantalla de resultado con pct, lista de errores, botón "Repetir"
- `App.ui.renderTarjetas(el)` — tarjetas completas: flip 3D, swipe, keyboard, buildBack() por kind
- `App.ui.renderOpcionMultiple(el)` — MCQ completo: getDistractors, grid 2×2, handleAnswer, onKey
- `getDistractors(correct, dir)` — función global: usedTexts Set, pickN shuffle, prioridad kind+cat+region
- Botón "Mostrar respuesta" pre-flip; "✗ No la sabía / ✓ La sabía" post-flip (fix UAT 2026-10-13)
- Router renderers map cubre: tarjetas, opcion-multiple, resultado, unir (no stubs)
- `App.state.progress{}` en localStorage `ivrit.v1.progress`: box 0-5, lastWrong timestamp
- `App.ui.renderUnir(el)` — tap-tap matching: 6 pares/ronda, SVG overlay, shake 400ms, resumen inline, Leitner solo ES↔HE
- `App.session._matchVariant` — variant field ('es-he'|'sg-pl'|'masc-fem'); seteado en _sesionEmpezar, leído en session.start y renderUnir
- `renderSesion` muestra "Variante" (3 chips) cuando `_pendingMode === 'unir'`, "Dirección" para todos los otros modos
- `App.session.start('unir')` filtra: sg-pl → `mpl && mpl !== msg`; masc-fem → `kind === 'gendered'`; antes del shuffle

## Performance Metrics

| Phase | Plan | Duration | Tasks | Files |
|-------|------|----------|-------|-------|
| 01-base | 01 | 3min | 1 | 1 |
| 01-base | 02 | 5min | 2 | 1 |
| 01-base | 03 | 8min | 2 | 1 |
| 01-base | 04 | 6min | 1 | 1 |
| 01-base | 05 | 4min | 1 | 1 |
| 04-unir-con-flechas | 01 | 8min | 1 | 1 |
| 04-unir-con-flechas | 02 | 5min | 2 | 1 |

---
*Last session: 2026-10-13T21:00:00Z — Phase 4 Plan 02 ejecutado: variant selector en renderSesion + filtro por variante en session.start*
*Stopped at: Phase 4 completed — 2/2 plans done*
*Next: /gsd-plan-phase 5*
