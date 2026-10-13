# Phase 4: Unir con flechas - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-10-13
**Phase:** 04-unir-con-flechas
**Areas discussed:** Live drag feedback, Variant placement, Multi-round flow, Leitner update scope

---

## Live drag feedback

| Option | Description | Selected |
|--------|-------------|----------|
| Live drag line | SVG line follows cursor/finger during drag via pointermove | |
| Tap-tap only | Tap source, tap target → line draws only on connection | ✓ |

**User's choice:** Tap-tap only — no drag, no pointermove. Full mechanics specified:
- Tap element → highlight (selected state)
- Tap element in other column → draw straight line immediately
- Correct → line green + both elements dim
- Incorrect → line + elements red + shake ~400ms → line disappears + deselect + error++
- Tap selected element → deselects
- Tap same-column element → changes selection

---

## Variant placement

| Option | Description | Selected |
|--------|-------------|----------|
| In session selector | Variants appear in renderSesion before game starts | ✓ |
| Inside unir screen | Variant chosen at game-start within the mode itself | |

**User's choice:** Session selector, like other modes.

---

## Multi-round flow

| Option | Description | Selected |
|--------|-------------|----------|
| Inline round summary | Lightweight inline score + "Siguiente ronda" between rounds | ✓ |
| Full renderResultado each round | Use existing result screen after every round | |
| Custom per-round + final renderResultado | Inline between rounds, renderResultado only at session end | ✓ |

**User's choice:** Inline summary (time + errors) between rounds; existing `renderResultado` when all session words exhausted.

---

## Leitner update scope

| Option | Description | Selected |
|--------|-------------|----------|
| All variants update Leitner | Every correct/incorrect match updates the box | |
| Only ES↔HE updates Leitner | Morphology variants don't change boxes, just stats | ✓ |
| No Leitner for matching | Matching is a game; Leitner reserved for recall modes | |

**User's choice:** Only ES↔HE updates Leitner boxes. sg↔pl and masc↔fem register stats only.

---

## Claude's Discretion

- SVG overlay positioning (fixed vs. absolute)
- Shake animation implementation
- Round timer implementation
- Column layout (flex vs. grid)

## Deferred Ideas

- Drag with live line (Pointer Events) — explicitly rejected by user
