---
phase: 03-tarjetas-mcq
plan: 02
subsystem: tarjetas-screen
tags: [flashcard, flip-3d, swipe, leitner, session]
dependency_graph:
  requires: [03-01]
  provides: [App.ui.renderTarjetas]
  affects: [index.html]
tech_stack:
  added: []
  patterns: [DOM imperative building, MutationObserver cleanup, touch swipe gesture, 3D CSS flip]
key_files:
  modified: [index.html]
decisions:
  - "renderTarjetas inserted as new section 7 in JS, before router — logical placement after session engine"
  - "Stub line for renderTarjetas removed; renderOpcionMultiple stub kept for Plan 03"
  - "qualify() double-fire prevented with boolean flag per T-03-06 threat model"
  - "MutationObserver on app-main childList removes keydown listener on unmount (T-03-05)"
  - "setTimeout(350ms) fallback for prefers-reduced-motion where animationend may not fire"
metrics:
  duration: "~10min"
  completed: "2026-10-13"
  tasks_completed: 1
  files_modified: 1
---

# Phase 03 Plan 02: Tarjetas Flashcard Screen Summary

Full renderTarjetas implementation: 3D card flip (perspective 900px, 400ms cubic-bezier), per-kind forms table on dark-blue back face, touch swipe with proportional overlay, ArrowRight/Left keyboard qualify, and session-end routing to renderResultado.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | renderTarjetas full implementation | 42151f6 | index.html |

## What Was Built

**App.ui.renderTarjetas(el)** — replaces the `|| renderStub` placeholder from Plan 01.

**Card structure:** `card-scene` (perspective 900px) > `.card` (transform-style preserve-3d) > `.card-front` + `.card-back`. CSS already existed from Plan 01-01; only JS wiring added.

**Front face:** Spanish or Hebrew word depending on `App.session.direction` (or random for 'mezclada'), alef watermark (opacity .04), category chip (top-left), Leitner box chip with `data-box` attribute (top-right, existing `.box-chip` CSS applies correct color per box).

**Back face:** dark blue-900 background, Hebrew main form large (2rem * he-scale), Spanish translation, forms table built per `word.kind`:
- `noun`: יחיד + רבים
- `gendered`: יחיד + יחידה + רבים + רבות (2x2)
- `verb`: פועל
- `country`: מדינה + אזור
- `expr` / fallback: ביטוי

All word data uses `textContent` — no `innerHTML` with user data (T-03-04 mitigated).

**Swipe:** `touchmove` computes dx/dy, ignores vertical scroll, scales overlay opacity 0→1 over 120px. `touchend` at 60px threshold calls `qualify(dx > 0)`.

**Keyboard:** `Space`/`Enter` = flip, `ArrowRight` = qualify correct (or flip if not yet flipped), `ArrowLeft` = qualify wrong (or flip). Listener attached to `document`, removed via `MutationObserver` when `el` is disconnected (T-03-05).

**qualify(correct):** boolean guard prevents double-fire (T-03-06), calls `App.ui.updateProgress`, pushes to `App.session.results`, increments `App.session.index`, triggers `flash-green`/`flash-red` animation on scene, then re-calls `renderTarjetas(el)` (or `renderResultado(el)` when index >= words.length).

**Buttons:** "← No la sé" / "La sé →" always visible; if card not yet flipped they flip first, otherwise qualify.

**Progress bar:** `session-progress-fill` width = `(idx / total) * 100%`, updated on each re-render.

## Deviations from Plan

None — plan executed as written. The provided implementation code was used directly with minor style consolidation (overlay font set in initial cssText rather than per-event).

## Known Stubs

None in this plan's scope. `renderOpcionMultiple` stub remains intentionally for Plan 03.

## Threat Flags

None. All threat model items addressed:
- T-03-04 (XSS): all word fields via `textContent`
- T-03-05 (keyboard leak): MutationObserver cleanup
- T-03-06 (double-qualify): `qualified` boolean flag

## Self-Check: PASSED
