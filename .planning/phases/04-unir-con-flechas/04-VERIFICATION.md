---
phase: 04-unir-con-flechas
verified: 2026-10-13T12:00:00Z
status: passed
score: 13/13 must-haves verified
overrides_applied: 2
fixes_applied: 2
overrides:
  - must_have: "Se puede unir por drag (Pointer Events, mouse + touch) — ROADMAP SC-1 / MATC-02"
    reason: "User explicitly chose tap-tap-only in CONTEXT D-01 discussion; drag was considered and rejected as added complexity for little gain on mobile"
    accepted_by: "manuejbe"
    accepted_at: "2026-10-13"
  - must_have: "Las líneas SVG son curvas con punta de flecha — ROADMAP SC-2 / MATC-03"
    reason: "User explicitly chose straight lines in CONTEXT D-03; curved bezier + arrowhead deferred as unnecessary visual complexity"
    accepted_by: "manuejbe"
    accepted_at: "2026-10-13"
fixes:
  - id: WR-01
    description: "_matchVariant preserved in App.session replacement object (line 1003)"
    commit: "8a58768"
  - id: IN-02
    description: "null guard added to getRightText for w.mpl and w.fsg"
    commit: "8a58768"
---

# Phase 4: Unir con flechas Verification Report

**Phase Goal:** El modo de matching con líneas SVG funciona en móvil y desktop, con tap y variantes (ES↔HE, sg↔pl, masc↔fem).
**Verified:** 2026-10-13T12:00:00Z
**Status:** gaps_found
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

Plan must-haves are listed first (Plans 01+02), followed by ROADMAP success criteria that extend beyond the plans.

| # | Truth | Status | Evidence |
|---|-------|--------|---------|
| 1 | Usuario puede tocar un elemento de la columna izquierda y queda resaltado (borde azul) | VERIFIED | handleTap sets borderColor to var(--blue-700) and background to var(--blue-50) on left selection (line ~1934) |
| 2 | Usuario puede tocar un elemento de la columna derecha y se dibuja una línea SVG entre los dos | VERIFIED | drawLine() called from handleTap on right-side tap with left already selected (line ~1962) |
| 3 | Si el par es correcto: línea verde, ambos elementos se atenúan, no se pueden volver a seleccionar | VERIFIED | color='var(--green)', opacity=0.45, dataset.resolved='true', pointerEvents='none' (lines 1966-1981) |
| 4 | Si el par es incorrecto: línea roja + shake 400ms en ambos elementos, luego línea desaparece + deselección + error contado | VERIFIED | 'shake 400ms ease-out' applied, setTimeout 450ms clears line and resets styles, roundErrors++ (lines 1994-2022) |
| 5 | Tocar el elemento ya seleccionado lo deselecciona (D-02) | VERIFIED | `if (selectedLeft && selectedLeft.el === clickedEl)` guard at line ~1932, resets border/bg and sets selectedLeft=null |
| 6 | Tocar otro elemento de la misma columna cambia la selección (D-02) | VERIFIED | Previous selectedLeft.el styles reset before reassigning selectedLeft (line ~1938) |
| 7 | Las líneas SVG se redibujan correctamente tras resize/orientación (D-04) | VERIFIED | redrawLines() registered via window.addEventListener('resize', onResize) at line 1922; listener removed in showRoundSummary and cleanupObserver |
| 8 | Las 6 palabras de la ronda se muestran: español izquierda, hebreo derecha, ambas columnas mezcladas independientemente | VERIFIED (es-he only) | shuffleArr applied independently to leftPairs and rightPairs; es-he layout is correct. NOTE: column labels for sg-pl and masc-fem are broken by WR-01 |
| 9 | El selector de sesión muestra una sección 'Variante' cuando el modo pendiente es 'unir' | VERIFIED | Conditional template at line 2208: `${(App.session && App.session._pendingMode === 'unir') ? ...Variante... : ...Dirección...}` |
| 10 | Las tres variantes son seleccionables con chips | VERIFIED | Three chips rendered via map over [{val:'es-he',...},{val:'sg-pl',...},{val:'masc-fem',...}] at line 2211-2214 |
| 11 | La variante se persiste en localStorage y se restaura al volver al selector | VERIFIED | matchVariant added to settings.lastSession in saveState() at line 2115; validated against VALID_VARIANTS allowlist at line 2110 |
| 12 | App.session._matchVariant se setea en _sesionEmpezar antes de llamar start() | FAILED | See WR-01: set at line 2302 but lost when App.session is replaced at line 1003-1009 without carrying _matchVariant |
| 13 | Singular↔Plural solo incluye palabras con mpl distinto al msg | VERIFIED | `words.filter(w => w.mpl && w.mpl !== w.msg)` at line 990 — filtering in start() works correctly (reads _matchVariant before session replacement) |
| 14 | Masculino↔Femenino solo incluye palabras con kind === 'gendered' | VERIFIED | `words.filter(w => w.kind === 'gendered')` at line 992 |

**ROADMAP Success Criteria (SC):**

| # | Success Criterion | Status | Evidence |
|---|------------------|--------|---------|
| SC-1 | Se pueden unir elementos por tap en dos pasos Y por drag (touch y mouse) | FAILED | Tap-tap implemented; drag not implemented. CONTEXT D-01 explicitly ruled out drag. |
| SC-2 | Las líneas SVG son curvas con punta de flecha; verde fija / rojo parpadea | FAILED | Straight <line> elements only; no bezier path, no arrowhead marker. CONTEXT D-03 explicitly chose straight lines. |
| SC-3 | Al rotar el dispositivo las líneas se redibujan en las posiciones correctas | VERIFIED | window resize listener + redrawLines() confirmed present |
| SC-4 | La variante singular↔plural solo aparece para palabras con plural distinto | VERIFIED | Filter confirmed at line 990 |
| SC-5 | Al terminar una ronda se muestran el tiempo y los errores | VERIFIED | showRoundSummary() shows `elapsed + 's · ' + roundErrors + ' errores'` |

**Score:** 8/13 plan must-haves verified (truths 1-11, 13, 14 pass; truth 12 fails). 3/5 ROADMAP SCs verified.

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `index.html` | App.ui.renderUnir(el) function | VERIFIED | Defined at line 1796, 3 occurrences (definition + router + recursive call in nextBtn) |
| `index.html` | SVG overlay with lines between pairs | VERIFIED | createElementNS('http://www.w3.org/2000/svg','svg') at line 1887; drawLine creates <line> elements |
| `index.html` | Tap-tap logic: selection, match, feedback, shake | VERIFIED | handleTap() fully implemented with all branches |
| `index.html` | Sección Variante condicional en renderSesion | VERIFIED | _sesionSetVariant defined at line 2295 |
| `index.html` | Filtro de variante en App.session.start | VERIFIED | mode==='unir' block at lines 987-995 |
| `index.html` | _matchVariant seteado en _sesionEmpezar | STUB | Set at line 2302 but NOT preserved in new session object at 1003-1009 |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| tap en columna izquierda | estado selectedLeft | click handler en elemento izquierdo | WIRED | btn.addEventListener('click', () => handleTap(btn)) at line 2027; handleTap sets selectedLeft |
| tap en columna derecha | evaluación de par | handleTap compara selectedLeft.wordId === rightEl.wordId | WIRED | `const isCorrect = selectedLeft.wordId === wordId` at line ~1962 |
| par correcto/incorrecto | línea SVG de color | drawLine(leftEl, rightEl, color) | WIRED | drawLine called with 'var(--green)' or 'var(--red)' |
| window resize | redibujado de líneas persistentes | redrawLines() desde resize listener | WIRED | Confirmed at lines 1922-1923 |
| renderSesion chip variante | App.ui._sesionSetVariant(v) | onclick en chip button | WIRED | "App.ui._sesionSetVariant('"+opt.val+"')" in chip at line 2213 |
| _sesionEmpezar | App.session._matchVariant | App.session._matchVariant = state.matchVariant | PARTIAL | Set at line 2302 but lost at line 1003-1009 when App.session is replaced |
| App.session.start('unir') | words filtradas por variante | if mode === 'unir' filter words before shuffle | WIRED | Lines 987-995; reads _matchVariant before session object replacement, so filter works |
| state.matchVariant | localStorage ivrit.v1.settings | saveState() → settings.lastSession.matchVariant | WIRED | Line 2115 confirmed |

---

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|--------------|--------|-------------------|--------|
| renderUnir columns | App.session.words (pairs) | App.session.start() filters vocab, shuffles | Yes — real vocab.json words | FLOWING |
| renderUnir variant layout | App.session._matchVariant | _sesionEmpezar → session object | No — lost on session replacement | HOLLOW: set before start(), lost after |
| renderSesion variant chips | state.matchVariant | localStorage ivrit.v1.settings (validated) | Yes | FLOWING |

---

### Behavioral Spot-Checks

Step 7b: SKIPPED — no runnable entry points without a browser (vanilla HTML app, no CLI or node entry point).

---

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|---------|
| MATC-01 | 04-01 | Rondas de 6 pares: español izquierda, hebreo derecha, columnas mezcladas | PARTIAL | ES↔HE layout correct; sg-pl/masc-fem layouts broken by WR-01 (_matchVariant lost) |
| MATC-02 | 04-01 | Unir por tap secuencial O por drag (Pointer Events, mouse + touch) | BLOCKED | Only tap-tap implemented. No drag. MATC-02 explicitly requires OR drag. CONTEXT D-01 ruled out drag. |
| MATC-03 | 04-01 | Líneas curvas SVG con punta de flecha; verde fija, rojo parpadea y desaparece | BLOCKED | Straight <line> elements only. No bezier curves, no arrowhead marker. CONTEXT D-03 chose straight lines. |
| MATC-04 | 04-01 | Líneas se recalculan con resize, scroll y cambio de orientación | SATISFIED | resize listener + redrawLines() confirmed. scroll not explicitly handled but not applicable to the two-column layout. |
| MATC-05 | 04-02 | Variantes disponibles: ES↔HE, singular↔plural, masculino↔femenino | PARTIAL | Selector UI and word filtering work; rendering in renderUnir uses wrong variant due to WR-01 |
| MATC-06 | 04-02 | Al terminar cada ronda: tiempo, errores y botón "Siguiente ronda" | SATISFIED | showRoundSummary() confirmed at lines 2032-2058 |

---

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| index.html | 1003-1009 | `App.session = { ... }` without `_matchVariant` | BLOCKER | WR-01: sg-pl and masc-fem variants silently fall back to es-he in renderUnir; variant filtering in start() worked but display is wrong |
| index.html | 1994-2022 | setTimeout modifies detached DOM after showRoundSummary/navigation | WARNING | WR-02 from code review: stale timeout can fire on detached nodes; no visible crash but missed cleanup of pendingLine |
| index.html | 1831-1832 | `getRightText` returns `w.mpl` / `w.fsg` without null guard | INFO | WR-02 from review (IN-02): gendered words with fsg=null will render "null" as button text for masc-fem variant |

---

### Human Verification Required

#### 1. ES↔HE tap-tap interaction on mobile

**Test:** Open app on a 360px-wide phone (or dev tools mobile emulation). Navigate to Unir con flechas. Start a session with default ES↔HE variant. Tap a word on the left column; verify blue highlight. Tap a matching word on the right; verify green line and dimming. Tap a non-matching word; verify red shake and line disappearing.
**Expected:** Visual feedback as described above, lines visually connecting button centers.
**Why human:** Tap event, CSS animation (shake, flash-green), and SVG coordinate math require a real browser + DOM.

#### 2. sg-pl and masc-fem variant display after WR-01 fix

**Test:** After WR-01 is fixed (add `_matchVariant: variant` to session object), start a Singular↔Plural session. Verify left column shows singular forms (msg) in Hebrew, right column shows plural forms (mpl) in Hebrew.
**Expected:** Both columns in Hebrew RTL; left = msg, right = mpl.
**Why human:** Column content and RTL rendering require browser visual check.

#### 3. Round summary inline display

**Test:** Complete all 6 pairs in a round. Verify the screen transitions to an inline summary showing elapsed seconds and error count, plus the "Siguiente ronda" / "Ver resultado" button.
**Expected:** e.g. "Ronda 1 completada / 12.3s · 2 errores / [Siguiente ronda]"
**Why human:** Timer value and button rendering require runtime execution.

---

### Gaps Summary

Three gaps block full goal achievement:

**Gap 1 — WR-01: _matchVariant lost after session.start (BLOCKER)**

Root cause: `_sesionEmpezar` sets `App.session._matchVariant` at line 2302, then calls `App.session.start(mode)`. Inside `start()`, the variant is read correctly for word filtering at line 988. But then at line 1003, `App.session` is completely replaced with a new `{ mode, words, index, direction, results }` object — `_matchVariant` is not carried over. When the router navigates to `#/unir` and `renderUnir` executes, `App.session._matchVariant` is `undefined`, so `variant` falls back to `'es-he'`.

Effect: Variant filtering (which words appear) works correctly. But column layout and button text (left/right text, Hebrew RTL attributes) always use ES↔HE logic regardless of user selection.

Fix (1 line): Add `_matchVariant: variant` to the object at line 1003. The `variant` constant is already in scope (computed at line 988).

**Gap 2 — MATC-02: No drag support**

REQUIREMENTS MATC-02 explicitly requires "tap secuencial O por drag (Pointer Events, mouse + touch)." The CONTEXT D-01 discussion log shows the user chose tap-tap only and explicitly ruled out drag. This is a conflict between the ROADMAP contract and the implementation decision.

The fix options are: (a) implement Pointer Events drag, or (b) accept the deviation with an override noting that the user explicitly chose tap-tap-only in the CONTEXT discussion.

**Gap 3 — MATC-03: Straight lines instead of curved SVG with arrowhead**

REQUIREMENTS MATC-03 requires "líneas curvas SVG con punta de flecha." CONTEXT D-03 chose straight `<line>` elements. Same conflict as Gap 2 — ROADMAP contract vs deliberate implementation decision.

The fix options are: (a) replace `<line>` with `<path>` bezier + `<defs><marker>` arrowhead, or (b) accept with an override.

**Gaps 2 and 3 appear intentional** — the DISCUSSION-LOG.md and CONTEXT.md confirm the user explicitly chose simpler implementations. To resolve without re-implementing, add overrides to this VERIFICATION.md's frontmatter. To fully satisfy the ROADMAP, implement drag and curved lines.

---

_Verified: 2026-10-13_
_Verifier: Claude (gsd-verifier)_
