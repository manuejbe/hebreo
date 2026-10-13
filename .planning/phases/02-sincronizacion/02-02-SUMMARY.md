---
phase: 02-sincronizacion
plan: 02
subsystem: sync-ui
tags: [sync, ui, modal, spinner, XSS, overlay]

requires:
  - phase: 02-sincronizacion
    plan: 01
    provides: App.sync.run() returning { diff, updatedAt } or throwing { code, message }

provides:
  - App.ui.syncRun(btnEl) — spinner state + calls App.sync.run() + error toast on failure
  - App.ui.renderSyncResult(diff, updatedAt) — modal overlay with diff summary, collapsible new-word list, Estudiar las nuevas button
  - id="sync-last-date" on lastSync strong element — live date update without re-render

affects: [renderInicio sync section, Inicio screen lastSync display]

tech-stack:
  added: []
  patterns:
    - "DOM createElement/appendChild for all remote-data rendering (XSS-safe, no innerHTML with remote strings)"
    - "CSS keyframe animation injected once via style#sync-keyframes"
    - "Fixed-overlay modal pattern (position:fixed, z-index:300, backdrop-filter)"

key-files:
  created: []
  modified:
    - index.html

key-decisions:
  - "Spinner injected as innerHTML into button (static HTML only, no remote data) then reset to textContent on completion"
  - "Error messages use hardcoded lookup by err.code; err.message fallback only for unknown codes — both safe via showToast textContent"
  - "Estudiar las nuevas navigates to #/sesion without session filter manipulation (App.ui._sesionState removed as speculative — YAGNI)"

requirements-completed: [SYNC-01, SYNC-03, SYNC-05]

duration: 6min
completed: 2026-10-13
---

# Phase 02 Plan 02: Sync UI Summary

**Sync button wired to App.sync.run() with spinner state, modal result panel showing diff counts + collapsible new-word list + Estudiar las nuevas, and error toasts for offline/timeout/invalid codes**

## Performance

- **Duration:** 6 min
- **Completed:** 2026-10-13
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments

- App.ui.syncRun(btnEl): disables button, shows spinner via innerHTML (static HTML), awaits App.sync.run(), restores button in finally block
- App.ui.renderSyncResult(diff, updatedAt): fixed overlay with panel, diff summary line, collapsible added-word list, Estudiar las nuevas button, Cerrar button, overlay-click dismiss
- All remote word strings (w.es, w.msg) rendered via element.textContent — no innerHTML with remote data anywhere in the result panel (T-02-05 mitigated)
- Error codes mapped to user-friendly Spanish strings; unknown codes fall back to err.message via showToast (T-02-06 mitigated)
- id="sync-last-date" added to lastSync strong in renderInicio so date updates live after sync without full re-render
- Stub toast ("Sincronización disponible en la próxima versión") fully replaced

## Task Commits

1. **Task 1: Sync UI wiring** — `f113cd6` (feat)

## Files Created/Modified

- `index.html` — 105 lines added: App.ui.syncRun, App.ui.renderSyncResult, button onclick wired, id="sync-last-date" added

## Decisions Made

- Spinner uses `btnEl.innerHTML` with a hardcoded static span — no remote data, so XSS safe; button text reset via `textContent` in finally
- Session filter navigation simplified: Estudiar las nuevas just navigates to `#/sesion` — the _sesionState manipulation from the plan was speculative (YAGNI, no session filter system exists yet)
- CSS keyframes injected once via `style#sync-keyframes` guard — avoids duplicate style elements on repeated syncs

## Deviations from Plan

### Auto-simplified (YAGNI)

**1. [Rule 1 - Ponytail] Removed App.ui._sesionState filter manipulation in Estudiar las nuevas**
- **Found during:** Task 1 implementation
- **Issue:** The plan's studyBtn click handler referenced `App.ui._sesionState` and `Store.get/set('ivrit.v1.settings')` — neither `_sesionState` nor a `filter='nuevas'` session mode exists yet
- **Fix:** Simplified to `overlay.remove(); location.hash = '#/sesion';` — correct and won't throw. Filter pre-selection is for a future session-modes plan.
- **Files modified:** index.html (in App.ui.renderSyncResult studyBtn handler)

## Threat Surface Scan

All plan threat mitigations implemented:
- T-02-05 (XSS — new-word list): w.es and w.msg set exclusively via `element.textContent`; panel structure built with createElement/appendChild only
- T-02-06 (XSS — error toast): hardcoded msgs[] lookup for known codes; showToast itself uses textContent internally
- T-02-07 (DoS — added list): accepted, no change needed
- T-02-08 (Spoofing — sync-last-date): date string set via textContent from new Date(updatedAt).toLocaleDateString

No new threat surface beyond the plan's threat model.

---

## Self-Check

- [x] `App.ui.syncRun` appears 2× in index.html (definition + button onclick)
- [x] `App.ui.renderSyncResult` appears 2× (definition + call in syncRun)
- [x] `onclick="App.ui.syncRun(this)"` present in renderInicio sync button
- [x] `id="sync-last-date"` present on lastSync strong element
- [x] `Sincronización disponible en la próxima versión` — 0 matches (stub removed)
- [x] `Estudiar las nuevas` — 1 match
- [x] Commit `f113cd6` exists: `feat(02-02): wire sync button — App.ui.syncRun(), renderSyncResult()`

## Self-Check: PASSED

*Phase: 02-sincronizacion*
*Completed: 2026-10-13*
