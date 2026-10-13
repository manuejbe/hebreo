---
phase: 02-sincronizacion
plan: 01
subsystem: sync
tags: [fetch, AbortController, diff, localStorage, vocab]

requires:
  - phase: 01-base
    provides: App.data.normalize(), App.state.vocab[], Store helper, APPS_SCRIPT_URL

provides:
  - App.sync module with five functions: fetchWithTimeout, validateRaw, diffVocab, applyDiff, run
  - Structural validation of remote Apps Script response
  - Diff engine classifying added/modified/deleted words by stable id
  - In-place vocab mutation preserving progress for deleted words (SYNC-04)
  - ivrit.v1.vocabCache updated on each successful sync

affects: [02-02-sincronizacion, ui-sync-button, session-modes]

tech-stack:
  added: []
  patterns:
    - "AbortController pattern for fetch timeout (20s hard limit)"
    - "Map-based O(n) diff by word id"
    - "In-place array mutation with splice/findIndex to preserve object references"

key-files:
  created: []
  modified:
    - index.html

key-decisions:
  - "fetchWithTimeout checks navigator.onLine before fetching to give immediate 'offline' error without waiting for network timeout"
  - "diffVocab compares only the 6 mutable fields (es, msg, mpl, fsg, fpl, group), never id/cat/kind which are structural"
  - "applyDiff takes rawData as second param so it can persist the cache with rawData.updated timestamp"
  - "run() wraps fetch errors into plain objects { code, message } — callers get consistent shape whether offline/timeout/invalid"

patterns-established:
  - "Error shape: { code: 'offline'|'timeout'|'invalid', message: string } — used by Plan 02 UI for toast messages"
  - "App.sync.* module pattern: pure logic object with no UI side-effects"

requirements-completed: [SYNC-01, SYNC-02, SYNC-04, SYNC-05]

duration: 8min
completed: 2026-10-13
---

# Phase 02 Plan 01: App.sync Module Summary

**Pure sync data pipeline — fetchWithTimeout (AbortController 20s), validateRaw, Map-based diffVocab, applyDiff preserving Leitner progress for deleted words, and run() orchestrator returning { diff, updatedAt }**

## Performance

- **Duration:** 8 min
- **Started:** 2026-10-13T15:00:00Z
- **Completed:** 2026-10-13T15:08:00Z
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments

- App.sync module injected into index.html under `=== 5b. SINCRONIZACION ===` section, before the router
- fetchWithTimeout with AbortController gives hard 20s timeout plus immediate 'offline' detection via navigator.onLine
- diffVocab uses Map for O(n) comparison across 6 mutable fields — correctly classifies added/modified/deleted
- applyDiff mutates App.state.vocab in place and preserves App.state.progress[id] for deleted words (SYNC-04)
- ivrit.v1.vocabCache updated via Store.set on every successful sync
- Three error codes (offline/timeout/invalid) ready for Plan 02 UI toast messages

## Task Commits

1. **Task 1: App.sync module** - `3dfcaf6` (feat)

## Files Created/Modified

- `index.html` — Added 95 lines: `App.sync = {}` plus five function definitions in new `=== 5b. SINCRONIZACION ===` section

## Decisions Made

- fetchWithTimeout checks `navigator.onLine` before issuing the fetch for a faster offline error path
- diffVocab compares only the 6 user-visible mutable fields; structural fields (id, cat, kind) are excluded as per spec
- applyDiff takes `rawData` as a second parameter so `rawData.updated` can be stored in the cache timestamp
- run() re-throws fetch errors as plain `{ code, message }` objects (not Error instances) — Plan 02 UI gets a consistent shape

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- App.sync.run() callable from browser console: `App.sync.run().then(console.log, console.error)`
- Plan 02 can wire the sync button directly to App.sync.run() and read { diff, updatedAt } or catch { code, message }
- All three error codes ready for toast message mapping in Plan 02

## Threat Surface Scan

All threat mitigations from the plan's threat model are implemented:
- T-02-01 (Tampering): validateRaw() enforces source==='google-docs', categories array, structural fields
- T-02-02 (DoS): AbortController with 20s timeout in fetchWithTimeout
- T-02-03 (Info Disclosure): error messages expose only user-friendly strings, no stack traces
- T-02-04 (Spoofing): APPS_SCRIPT_URL is hardcoded constant — no new surface introduced

No new threat surface beyond what the plan's threat model covers.

---

## Self-Check

- [x] `index.html` modified: confirmed (grep returns 9 App.sync. matches)
- [x] Commit `3dfcaf6` exists: `feat(02-01): add App.sync module — fetch, validate, diff, apply`
- [x] Section comment `=== 5b. SINCRONIZACION ===` present at line 769
- [x] `=== 6. ROUTER ===` follows at line 864
- [x] All 9 acceptance criteria grep patterns match

## Self-Check: PASSED

*Phase: 02-sincronizacion*
*Completed: 2026-10-13*
