---
phase: 04-unir-con-flechas
plan: "01"
subsystem: ui
tags: [matching, svg, tap-tap, leitner, round-summary]
dependency_graph:
  requires: [App.session, App.ui.updateProgress, App.ui.renderResultado]
  provides: [App.ui.renderUnir]
  affects: [index.html router, renderInicio mode card]
tech_stack:
  added: []
  patterns: [SVG overlay with dynamic line drawing, tap-tap two-step interaction, MutationObserver cleanup, inline round summary]
key_files:
  created: []
  modified: [index.html]
decisions:
  - "SVG overlay positioned absolute inside columnsWrap (position:relative) so getBoundingClientRect offsets stay correct"
  - "variant==='es-he' guard for Leitner (D-10): undefined variant defaults to es-he path"
  - "pendingLine tracked to support redrawLines during 450ms error-reset window"
  - "Right-only selection state retained (selectedRight) so user can pre-select right then left"
metrics:
  duration: "~8min"
  completed: "2026-10-13"
  tasks_completed: 1
  tasks_total: 1
  files_modified: 1
---

# Phase 4 Plan 01: renderUnir — Layout, Tap-Tap, SVG Lines Summary

**One-liner:** Tap-tap matching renderer with SVG line overlay, per-round inline summary, and Leitner update only for ES↔HE variant.

## What Was Built

`App.ui.renderUnir(el)` — the full matching screen renderer inserted in `index.html` after `renderOpcionMultiple`. Key parts:

- **Guard:** redirects to `#/sesion` if no session; calls `renderResultado` when all rounds exhausted.
- **Layout:** `position:relative` columns wrapper with two `flex` columns; SVG overlay appended last so `pointer-events:none` lets taps reach buttons.
- **Shuffle:** `shuffleArr` applied independently to `leftPairs` and `rightPairs` (same 6 words, different order per column).
- **Variant text:** `getLeftText`/`getRightText` helpers resolve display text for `es-he`, `sg-pl`, `masc-fem`. Hebrew RTL attributes set via `lang/dir/fontFamily/fontSize` on buttons.
- **Tap-tap:** `handleTap(btn)` handles left selection, right-only pre-selection, and pair evaluation. `dataset.resolved='true'` + `pointerEvents='none'` blocks re-selection of matched items.
- **SVG lines:** `drawLine` computes center coordinates relative to `columnsWrap`; `redrawLines` clears SVG and redraws all resolved + pending lines on `resize`.
- **Feedback:** correct → `flash-green 350ms` + opacity 0.45 + green border; incorrect → `shake 400ms ease-out` + red border, line and styles cleared after 450ms via `setTimeout`.
- **Round summary:** inline panel shows elapsed time + error count; "Siguiente ronda" / "Ver resultado" button calls `App.ui.renderUnir(el)` recursively (re-enters at guard which calls `renderResultado` when exhausted).
- **Cleanup:** MutationObserver on `#app-main` removes `resize` listener when `el` leaves DOM.
- **Router:** `'unir'` moved from `stubs` array to `renderers` map. Mode card in `renderInicio` set to `available: true`.
- **Leitner:** `App.ui.updateProgress` called only when `variant === 'es-he'` (D-10). All variants push to `App.session.results[]`.

## Deviations from Plan

None — plan executed exactly as written. The `selectedRight` state (for right-only pre-selection) was retained as specified in the plan's tap-tap logic, despite being edge-case behavior.

## Threat Surface Scan

| Flag | File | Description |
|------|------|-------------|
| — | — | No new network endpoints or auth paths introduced. All word text set via `textContent` (T-04-01 mitigated). |

## Known Stubs

None — `App.session._matchVariant` defaults to `'es-he'` within `renderUnir`. The variant selector in `renderSesion` (setting `_matchVariant` before session start) is Plan 02 scope; the mode is fully functional for the default variant now.

## Self-Check: PASSED
