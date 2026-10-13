---
phase: 01-base
plan: 04
subsystem: ui
tags: [vanilla-js, search, accordion, hebrew, rtl, leitner, dictionary]

requires:
  - phase: 01-base-plan-02
    provides: "App.state.vocab[] ~735 word objects normalizados con kind, cat, es, msg, fsg, mpl, fpl, group"
  - phase: 01-base-plan-03
    provides: "App.ui.renderDiccionario stub listo para sobreescribir, App.router en marcha"

provides:
  - "normalizeSearch(str): strips Hebrew niqqud (U+0591-U+05C7) + Spanish accents (NFD) + lowercase"
  - "App.ui.renderDiccionario(el): pantalla completa con 17 acordeones colapsados y búsqueda en tiempo real"
  - "App.ui._dictUpdate(query): función expuesta para el handler oninput del input de búsqueda"

affects:
  - "01-05 (Sesión — puede reutilizar normalizeSearch para filtros de sesión)"
  - "fases futuras con sync remoto (deben agregar escaping de vocab.json cuando los datos ya no sean locales)"

tech-stack:
  added: []
  patterns:
    - "normalizeSearch: NFD + combining-char strip para español; regex U+0591-U+05C7 para niqqud hebreo"
    - "Closure scope: renderWordTable y renderResults definidas dentro de renderDiccionario — no polutan el global"
    - "XSS mitigation T-04-01: query del usuario escapada via textContent antes de inyectar en innerHTML"
    - "Columnas dinámicas por kind: kindCols object map — verb/expr/country/gendered/noun con headers hebreos"
    - "HTML <details>/<summary> nativo para acordeones — cero JS para toggle, accesibilidad gratis"

key-files:
  created: []
  modified:
    - "index.html — secciones 8 (SEARCH NORMALIZATION) y 9 (DICCIONARIO SCREEN); reemplaza stub renderDiccionario; numera INICIO como 10, ARRANQUE como 11"

key-decisions:
  - "normalizeSearch global (no closure) — reutilizable en lógica de sesión y sync futuras"
  - "<details>/<summary> para acordeones en lugar de div+click JS — nativo, accesible, sin state"
  - "XSS T-04-01: span.textContent = query; safe.innerHTML insertado — evita que un query malicioso ejecute scripts"
  - "heFields Set(['msg','fsg','mpl','fpl','group']) determina dirección RTL — group es hebreo en categoría countries"
  - "kindCols object lookup en lugar de if/else chain — más fácil de extender con kinds nuevos"

requirements-completed: [DICT-01, DICT-02, DICT-03]

duration: 6min
completed: 2026-10-13
---

# Phase 1 Plan 04: Diccionario Screen Summary

**Pantalla Diccionario con 17 acordeones colapsados, búsqueda en tiempo real ignorando acentos/niqqud, celdas RTL por kind, chips Leitner y botones 🔊 stub**

## Performance

- **Duration:** ~6 min
- **Started:** 2026-10-13T14:05:00Z
- **Completed:** 2026-10-13T14:11:00Z
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments

- `normalizeSearch()`: función pura global que elimina niqqud hebreo (regex U+0591-U+05C7), acentos españoles (NFD + combining chars), lowercase y trim — búsqueda cross-script sin configuración externa
- `App.ui.renderDiccionario()`: reemplaza el stub del Plan 03 con implementación completa — 17 categorías como `<details>` colapsados, tabla por categoría con columnas adaptadas al `kind` de la palabra
- Búsqueda en tiempo real via `_dictUpdate()`: filtra los ~735 words en memoria sin debounce (< 1ms), hace match en todos los campos hebreos (msg, fsg, mpl, fpl)
- Estado "sin resultados" con mensaje escapado correctamente y botón para limpiar (T-04-01 mitigado)

## Task Commits

1. **Task 1: normalizeSearch + renderDiccionario** — `10ea949` (feat)

## Files Created/Modified

- `index.html` — +132 líneas netas: secciones 8 (normalizeSearch) y 9 (renderDiccionario completo); numeración de secciones JS ajustada a 8-11

## Decisions Made

- `<details>/<summary>` HTML nativo para acordeones — toggle gratis, accesible sin JS, compatible con todos los targets móviles
- `normalizeSearch` en scope global (no dentro del closure) — ya existe una función similar en Plan 02 (`normalize`/`slugify`); esta es la variante orientada a búsqueda de usuario, reutilizable en Plan 05
- XSS mitigation: `safe.textContent = query; … safe.innerHTML` — una línea, sin helper externo, correcto para todos los caracteres HTML especiales
- `heFields` Set determina si una columna es RTL — incluye `group` porque en la categoría Countries el campo es en hebreo (אזור/תחום)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Security] XSS mitigation para query de búsqueda (T-04-01)**
- **Found during:** Task 1 — el plan incluyó la amenaza T-04-01 en el threat_model como `mitigate`
- **Issue:** El template del plan inyectaba `${query}` directamente en innerHTML del mensaje "Sin resultados"
- **Fix:** `const safe = document.createElement('span'); safe.textContent = query;` — se usa `safe.innerHTML` (ya escapado) en el template string
- **Files modified:** index.html
- **Verification:** `grep -n "textContent\|safe\."` confirma el patrón en línea 967
- **Committed in:** 10ea949 (parte del commit de Task 1)

---

**Total deviations:** 1 auto-fixed (1 security/mitigate del threat model)
**Impact on plan:** Corrección de seguridad requerida por el threat model del plan. Sin scope creep.

## Known Stubs

- Botones 🔊 en celdas hebreas: `showToast('Audio disponible en fases futuras')` — se implementan con TTS/audio en fases futuras
- `App.ui.renderSesion` — sigue siendo stub, implementado en Plan 05

Ningún stub bloquea el objetivo del plan: el Diccionario muestra los ~735 words con búsqueda funcional.

## Vocab.json Edge Cases Encontrados

- **group field para countries**: el campo `group` (región) es texto hebreo (e.g. "אירופה") — se incluye en `heFields` para RTL correcto; confirmado por los datos de la categoría Países
- **null fields**: words con `fsg`/`mpl`/`fpl` = null renderizan "—" como texto, no `null` — el `|| '—'` en el template cubre esto
- **kind fallback**: si `kindCols[w.kind]` no existe (edge case de kind desconocido), cae a `kindCols.noun` — seguro por defecto

## Threat Surface Scan

| Flag | File | Description |
|------|------|-------------|
| T-04-01 mitigated | index.html | Query del usuario en mensaje "Sin resultados" — escapado via textContent/innerHTML |

T-04-02 (datos de vocab.json en tabla): aceptado — vocab.json es archivo local estático, no user-supplied en Phase 1. Phase 2 (sync remoto) debe agregar escaping.

## Issues Encountered

Ninguno.

## User Setup Required

Para verificar: `python3 -m http.server 8080` y abrir `http://localhost:8080/#/diccionario`. Se deben ver 17 acordeones colapsados.

## Next Phase Readiness

- **Plan 05 (Sesión):** `App.ui.renderSesion` sigue como stub; `normalizeSearch` disponible para filtrado de categorías; `App.state.vocab` con todos los campos para construir ejercicios
- `App.router.current.params` disponible para recibir `?cat=Verbos&mode=tarjetas` desde la pantalla Inicio

---
*Phase: 01-base*
*Completed: 2026-10-13*
