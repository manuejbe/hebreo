---
phase: 03-tarjetas-mcq
plan: 03
subsystem: mcq-screen
tags: [mcq, distractors, leitner, keyboard, animation]
dependency_graph:
  requires: [03-01, 03-02]
  provides: [App.ui.renderOpcionMultiple, getDistractors]
  affects: [index.html]
tech_stack:
  added: []
  patterns: [Fisher-Yates shuffle, MutationObserver cleanup, DOM imperative building]
key_files:
  modified: [index.html]
decisions:
  - "getDistractors is a module-level function (not on App) — same scope as other helpers like normalizeSearch"
  - "usedTexts Set prevents duplicate visible text across all 4 options regardless of pool overlap"
  - "Countries: same-region pool checked before same-kind+cat, per MCQ-02"
  - "Keyboard cleanup uses MutationObserver on app-main childList (same pattern as renderTarjetas)"
  - "mcq-grid-style guard prevents duplicate <style> injection on re-renders"
  - "answered boolean prevents double-fire via keyboard race (T-03-08)"
metrics:
  duration: "~2min"
  completed: "2026-10-13"
  tasks_completed: 1
  files_modified: 1
---

# Phase 03 Plan 03: Opcion Multiple (MCQ) Screen Summary

Full MCQ screen: getDistractors with same-kind+cat/region priority + usedTexts dedup, 2x2 option grid with numeric shortcut chips, correct=green/wrong=red/rest=.45 feedback, flash-green/shake animations, keyboard 1-4+Enter, forms panel post-answer, session-end routing to renderResultado.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | getDistractors + renderOpcionMultiple | 32b61bc | index.html |

## What Was Built

**getDistractors(correct, dir)** — module-level helper. Builds a `usedTexts` Set from the correct word's visible text. `pickN(pool, n)` Fisher-Yates shuffles pool then picks valid (non-duplicate, non-self) words. Priority order: countries → same region (`word.group`); then same `kind`+`cat`; then same `kind` any cat; then any word. Returns exactly 3 distractors.

**App.ui.renderOpcionMultiple(el)** — replaces the `|| renderStub` placeholder from Plan 01.

**Screen layout:** progress bar (`session-progress-fill` width = `idx/total * 100%`) → counter `N / total` → question `<p>` (Hebrew with lang/dir/font-family if `he-es`) → 2x2 option grid (`.mcq-grid`, responsive to 1-col at `≤320px` via injected `#mcq-grid-style`) → Siguiente button (hidden until answered).

**Option buttons:** each has a `position:absolute` shortcut chip (1-4, `blue-100`/`blue-700`) and a text span (Hebrew `lang`/`dir`/`font-hebrew` for `es-he` direction, plain Nunito for `he-es`). All text via `textContent` (T-03-07 mitigated).

**handleAnswer(chosenIdx, isCorrect):**
- Guarded by `answered` boolean (T-03-08: double-answer prevention)
- Calls `App.ui.updateProgress(word.id, isCorrect)` — Leitner box update + localStorage persist
- Pushes to `App.session.results`
- Correct option: `green-bg`/`green` border/color
- Chosen wrong option: `red-bg`/`red` border/color
- All other options: `opacity .45`, `pointerEvents none`
- Question animation: `flash-green 350ms` if correct, `shake 300ms` if wrong (DESIGN.md §3.6)
- Injects forms panel (per `word.kind`: noun יחיד/רבים, gendered 4 forms, verb פועל, country מדינה+אזור, expr ביטוי) via `el.insertBefore(formsPanel, nextBtn)`
- Reveals Siguiente button

**advance():** increments `App.session.index`, recurses `renderOpcionMultiple(el)`. Session end detected at entry: routes to `App.ui.renderResultado(el)`.

**Keyboard:** `onKey` handles `'1'-'4'` (calls `handleAnswer` if not yet answered) and `Enter` (calls `advance` if already answered). Listener removed via `MutationObserver` on `app-main` `childList` when `el` disconnects (T-03-10 mitigated).

## Deviations from Plan

None — plan executed exactly as written. The draft `pick()` function with a logic bug was noted in the plan itself; only `pickN()` was used as instructed.

## Known Stubs

None. All MCQ-01..04 requirements fully implemented.

## Threat Flags

None. All threat model items addressed per plan:
- T-03-07 (XSS): question and all option text via `textContent`
- T-03-08 (double-answer): `answered` boolean guard
- T-03-09 (info disclosure): accepted — study app
- T-03-10 (keyboard leak): MutationObserver cleanup on `el` disconnect

## Self-Check: PASSED
