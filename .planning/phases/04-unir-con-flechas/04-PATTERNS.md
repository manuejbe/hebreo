# Phase 4: Unir con flechas - Pattern Map

**Mapped:** 2026-10-13
**Files analyzed:** 1 (index.html — all CSS+JS inline)
**Analogs found:** 5/5 pattern areas covered within index.html

---

## File Classification

| Target area | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `App.ui.renderUnir(el)` | game-screen renderer | event-driven, batch (rounds) | `App.ui.renderOpcionMultiple` (line 1581) | exact role, different data-flow |
| SVG overlay for lines | dynamic DOM element | event-driven | Nav `<svg>` icons (lines 464–489) — static; no game-screen analog | no analog — new pattern |
| `renderSesion` variant section | session config UI | request-response | `renderSesion` Direction section (lines 1917–1928) | exact |
| `App.session.start` filter extension | data transform | batch | `App.session.start` body (lines 970–1001) | exact |
| Round summary inline panel | transient UI | event-driven | MCQ `formsPanel` (lines 1730–1757) | role-match |

---

## Pattern Assignments

### 1. `App.ui.renderUnir(el)` — function signature and guard

**Analog:** `App.ui.renderOpcionMultiple` (line 1581)

**Guard pattern** (lines 1581–1587):
```javascript
App.ui.renderOpcionMultiple = function(el) {
  if (!App.session || !App.session.words || App.session.words.length === 0) {
    location.hash = '#/sesion'; return;
  }
  if (App.session.index >= App.session.words.length) {
    App.ui.renderResultado(el); return;
  }
```

`renderUnir` replaces the `App.session.index` guard with a round-based check:
- If `App.session.words` is exhausted (all rounds done) → `App.ui.renderResultado(el)`.
- Never navigate away mid-session; handle empty state by redirecting to `#/sesion`.

---

### 2. Progress bar + counter pattern

**Analog:** `renderOpcionMultiple` (lines 1614–1629) and `renderTarjetas` (lines 1206–1222)

**Exact pattern to copy** (both renderers are identical here):
```javascript
el.innerHTML = '';

// Progress bar (DESIGN.md §3.7)
const progBar = document.createElement('div');
progBar.className = 'session-progress';
const progFill = document.createElement('div');
progFill.className = 'session-progress-fill';
progFill.style.width = pct + '%';
progBar.appendChild(progFill);
el.appendChild(progBar);

// Counter
const counter = document.createElement('p');
counter.style.cssText = 'text-align:center;font:600 var(--text-sm) var(--font-body);color:var(--text-muted);padding:var(--sp-6) var(--sp-4) var(--sp-3);';
counter.textContent = (idx + 1) + ' / ' + total;
el.appendChild(counter);
```

For `renderUnir`, `pct` should reflect words consumed across all rounds (not just the current round index).
`counter` should show round number, e.g. `'Ronda ' + roundNum + ' · ' + pairsInRound + ' pares'`.

CSS classes `session-progress` / `session-progress-fill` are defined at lines 418–430 — use them as-is:
```css
.session-progress      { position:fixed; top:0; left:0; right:0; height:3px; background:var(--border); z-index:100; }
.session-progress-fill { height:100%; background:var(--blue-700); border-radius:0 2px 2px 0; transition:width 300ms var(--ease-out); }
```

---

### 3. DOM-building style — createElement + style.cssText

**Analog:** `renderOpcionMultiple` throughout (lines 1614–1780)

The entire codebase builds game-screen DOM imperatively with `createElement` and inline `style.cssText`. No `innerHTML` is used once word data is involved (XSS rule T-03-04). The only exception is `renderSesion` which uses template literals because it only renders trusted static/local data (category names from `vocab.json`).

**Rule:** `renderUnir` must use `createElement` + `textContent` for all word data. Template literals are acceptable only for structural scaffolding that contains no word text.

**Color variables to use** (lines 41–46):
```css
--green:    #1A7A42;
--green-bg: #F0FBF4;   /* correct state background */
--red:      #C42B2B;
--red-bg:   #FFF5F5;   /* error state background */
--border:   #E2D9CC;
--blue-700: #0052B4;   /* primary action */
```

---

### 4. Feedback animations — shake and flash

**Source:** CSS `@keyframes` at lines 389–405 (already in `<style>`, available globally)

```css
@keyframes shake {
  0%,100% { transform: translateX(0); }
  15%     { transform: translateX(-7px); }
  30%     { transform: translateX(6px); }
  45%     { transform: translateX(-5px); }
  60%     { transform: translateX(4px); }
  75%     { transform: translateX(-2px); }
  90%     { transform: translateX(2px); }
}
@keyframes flash-green {
  0%,100% { background: transparent; }
  40%     { background: rgba(26,122,66,.12); }
}
@keyframes flash-red {
  0%,100% { background: transparent; }
  40%     { background: rgba(196,43,43,.10); }
}
```

**How MCQ applies them** (lines 1726–1727):
```javascript
qSection.style.animation = isCorrect ? 'flash-green 350ms ease-out' : 'shake 300ms ease-out';
qSection.addEventListener('animationend', () => { qSection.style.animation = ''; }, { once: true });
```

For `renderUnir`: apply `shake 400ms ease-out` to the pair's two column items on wrong match (D-01 specifies ~400ms). Apply `flash-green` to the pair container on correct. No new keyframes needed.

---

### 5. Result recording + Leitner update pattern

**Analog:** `renderOpcionMultiple` lines 1700–1705 and `renderTarjetas` lines 1349–1354

```javascript
// In renderOpcionMultiple:
App.ui.updateProgress(word.id, isCorrect);
App.session.results.push({ wordId: word.id, correct: isCorrect });

// In renderTarjetas:
App.ui.updateProgress(word.id, correct);
App.session.results.push({ wordId: word.id, correct });
App.session.index++;
```

**For `renderUnir` (D-10/D-11):**
```javascript
// Only for ES↔HE variant:
if (App.session._matchVariant === 'es-he') {
  App.ui.updateProgress(word.id, isCorrect);
}
App.session.results.push({ wordId: word.id, correct: isCorrect });
```

`updateProgress` signature (line 1003): `App.ui.updateProgress(wordId: string, correct: boolean)` — no return value, handles its own try/catch via `Store.set`.

---

### 6. `App.session` object structure

**Source:** `App.session.start` (lines 992–1000)

```javascript
App.session = {
  mode,                        // string: 'unir'
  words: words.slice(0, qty),  // array of word objects
  index: 0,                    // consumed word pointer
  direction: st.direction,     // kept for compatibility; not used by unir
  results: []                  // { wordId, correct: bool }
};
```

**New field to add for unir:** `App.session._matchVariant` — set by `renderSesion` before `session.start('unir')` is called. Possible values: `'es-he'` | `'sg-pl'` | `'masc-fem'`. Default: `'es-he'`.

`session.start` must filter words for the variant before shuffling:
- `'sg-pl'`: `words.filter(w => w.mpl && w.mpl !== w.msg)` — words with distinct plural
- `'masc-fem'`: `words.filter(w => w.kind === 'gendered')` — adjetivos/profesiones

The modification point is inside `App.session.start` (after the filter/before shuffle, around line 985).

---

### 7. Router wiring — moving stub to renderer

**Source:** `App.router._renderScreen` (lines 1480–1505)

Current state (line 1494):
```javascript
const stubs = ['unir','completar','concordancia',
               'escribir','clasificar','contrarreloj','estadisticas','configuracion'];
```

**Change required:** Move `'unir'` from `stubs` array into `renderers` object:
```javascript
const renderers = {
  inicio:           () => App.ui.renderInicio(screenEl),
  diccionario:      () => App.ui.renderDiccionario(screenEl),
  sesion:           () => App.ui.renderSesion(screenEl),
  tarjetas:         () => App.ui.renderTarjetas(screenEl),
  'opcion-multiple':() => App.ui.renderOpcionMultiple(screenEl),
  resultado:        () => App.ui.renderResultado(screenEl),
  'unir':           () => App.ui.renderUnir(screenEl),   // ← add this line
};
```

Also update `renderInicio` at line 2167 to set `available: true` for the `'unir'` mode card.

---

### 8. `renderSesion` variant selector — new section for unir mode

**Analog:** Direction section in `renderSesion` (lines 1917–1928)

```javascript
<!-- Direction — existing pattern -->
<section style="margin-bottom:var(--sp-5);">
  <h2 style="font:600 1.125rem var(--font-display);color:var(--text-primary);margin-bottom:var(--sp-3);">Dirección</h2>
  <div style="display:flex;flex-wrap:wrap;gap:var(--sp-2);">
    ${[{val:'es-he',label:'ES → HE'},{val:'he-es',label:'HE → ES'},{val:'mezclada',label:'Mezclada'}].map(opt => {
      const sel = state.direction === opt.val;
      return `<button onclick="App.ui._sesionSetDirection('${opt.val}')"
        style="...${sel?'background:var(--blue-700);color:#fff;border:1.5px solid transparent;':'...'}"
        aria-pressed="${sel}">${opt.label}</button>`;
    }).join('')}
  </div>
</section>
```

**For unir variant selector:** Conditionally render a "Variante" section in place of "Dirección" when `App.session._pendingMode === 'unir'`. Use identical chip/button markup and the same `chip()` helper already defined at line 1862:
```javascript
function chip(label, selected, onclick, extraStyle) {
  const base = `border-radius:var(--radius-pill);padding:6px 14px;font:600 var(--text-sm) var(--font-body);cursor:pointer;min-height:36px;transition:background var(--dur-fast),border-color var(--dur-fast);`;
  const style = selected
    ? base + 'background:var(--blue-700);color:#fff;border:1.5px solid transparent;'
    : base + 'background:transparent;color:var(--text-secondary);border:1.5px solid var(--border);' + (extraStyle || '');
  return `<button onclick="${onclick}" style="${style}" aria-pressed="${selected}">${label}</button>`;
}
```

Add `matchVariant` to the `state` object:
```javascript
const VALID_VARIANTS = ['es-he', 'sg-pl', 'masc-fem'];
const state = {
  // ... existing fields ...
  matchVariant: VALID_VARIANTS.includes(raw.matchVariant) ? raw.matchVariant : 'es-he'
};
```

Add to `saveState()`:
```javascript
settings.lastSession = { ..., matchVariant: state.matchVariant };
```

Add handler:
```javascript
App.ui._sesionSetVariant = function(v) { state.matchVariant = v; rerender(); };
```

Expose to `App.session` in `_sesionEmpezar`:
```javascript
App.ui._sesionEmpezar = function() {
  const mode = (App.session && App.session._pendingMode) || 'tarjetas';
  App.session._matchVariant = state.matchVariant;  // ← new line
  App.session.start(mode);
  location.hash = '#/' + mode;
};
```

---

### 9. Keyboard listener cleanup — MutationObserver pattern

**Analog:** `renderOpcionMultiple` (lines 1775–1780) and `renderTarjetas` (lines 1413–1416)

```javascript
// Cleanup keyboard listener when screen leaves DOM
const observer = new MutationObserver(() => {
  if (!el.isConnected) { document.removeEventListener('keydown', onKey); observer.disconnect(); }
});
observer.observe(document.getElementById('app-main'), { childList: true });
```

`renderUnir` does not use keyboard shortcuts per the decisions (tap-tap only), but if any `document` event listeners are attached (e.g., for resize), use the same MutationObserver pattern for cleanup.

---

### 10. SVG overlay — no analog, new pattern

**No existing analog in the codebase.** The nav uses `<svg>` as static icons; no game screen creates a dynamic SVG overlay.

**Pattern to follow from CONTEXT.md D-03/D-04:**
```javascript
// Create once per round, position absolute/fixed over the columns container
const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
svg.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;overflow:visible;';

// Draw a line between two elements:
function drawLine(el1, el2, color) {
  const r1 = el1.getBoundingClientRect();
  const r2 = el2.getBoundingClientRect();
  const containerRect = svg.parentElement.getBoundingClientRect();
  const x1 = r1.left + r1.width/2  - containerRect.left;
  const y1 = r1.top  + r1.height/2 - containerRect.top;
  const x2 = r2.left + r2.width/2  - containerRect.left;
  const y2 = r2.top  + r2.height/2 - containerRect.top;
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('x1', x1); line.setAttribute('y1', y1);
  line.setAttribute('x2', x2); line.setAttribute('y2', y2);
  line.setAttribute('stroke', color);
  line.setAttribute('stroke-width', '2.5');
  line.setAttribute('stroke-linecap', 'round');
  svg.appendChild(line);
  return line;
}

// Recalculate on resize (D-04):
window.addEventListener('resize', redrawLines);
// Cleanup when screen leaves:
// (use MutationObserver pattern from §9)
```

The columns container (`position:relative`) is the SVG's parent so `getBoundingClientRect` offsets work correctly. `pointer-events:none` on SVG ensures taps fall through to the column items.

---

### 11. `renderResultado` — consumed unchanged

**Source:** Lines 1026–1112.

`renderUnir` calls it exactly as `renderTarjetas` and `renderOpcionMultiple` do:
```javascript
if (/* all rounds done */) {
  App.ui.renderResultado(el); return;
}
```

`renderResultado` reads `App.session.results[]`, `App.session.words`, and `App.session.mode` directly — no arguments beyond `el`. Ensure `App.session.results` is fully populated before calling.

---

## Shared Patterns

### A. textContent-only rule for word data
**Source:** T-03-04 comment at line 1206, applied throughout `renderTarjetas` and `renderOpcionMultiple`.
**Apply to:** All `renderUnir` DOM nodes that display `word.es`, `word.msg`, `word.mpl`, `word.fsg`, `word.fpl`.
```javascript
// CORRECT:
el.textContent = word.es;
// WRONG:
el.innerHTML = word.es;
```

### B. Hebrew node attributes
**Source:** Pattern used everywhere Hebrew text appears (e.g., line 1069–1070):
```javascript
span.lang = 'he';
span.dir = 'rtl';
span.style.fontFamily = 'var(--font-hebrew)';
span.style.fontSize = 'calc(var(--he-scale)*1rem)';
```
**Apply to:** Any column item showing Hebrew text in the unir grid.

### C. Button hover states via addEventListener
**Source:** Lines 1090–1091, 1106–1107, 1695–1696 — consistent pattern:
```javascript
btn.addEventListener('mouseenter', () => { btn.style.background = 'var(--blue-800)'; });
btn.addEventListener('mouseleave', () => { btn.style.background = 'var(--blue-700)'; });
```
**Apply to:** "Siguiente ronda" and any action buttons in round summary.

### D. prefers-reduced-motion
**Source:** CSS block at lines 372–383. All `animation:` and `transition:` assignments are automatically overridden to `.01ms` by the global rule — no per-feature guard needed. The `animationend` fallback `setTimeout` pattern (line 1361) handles the case where the animation fires instantly:
```javascript
scene.style.animation = 'flash-red 300ms ease-out';
scene.addEventListener('animationend', () => { scene.style.animation = ''; }, { once: true });
setTimeout(() => { /* proceed anyway */ }, 350);  // fallback for reduced-motion
```

---

## No Analog Found

| Area | Reason |
|---|---|
| SVG overlay (dynamic lines) | No game screen creates a dynamic SVG overlay; pattern described in §10 above is derived from first principles |
| Round summary inline panel | MCQ's `formsPanel` is the closest shape (temporary DOM injected before nextBtn) but the content and trigger differ enough that the planner should treat it as new |

---

## Metadata

**Analog search scope:** index.html (all 2288 lines — the single source file)
**Pattern extraction date:** 2026-10-13
