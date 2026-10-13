---
phase: 04-unir-con-flechas
reviewed: 2026-10-13T00:00:00Z
depth: standard
files_reviewed: 1
files_reviewed_list:
  - index.html
findings:
  critical: 0
  warning: 3
  info: 2
  total: 5
status: issues_found
---

# Phase 4: Code Review Report

**Reviewed:** 2026-10-13
**Depth:** standard
**Files Reviewed:** 1
**Status:** issues_found

## Summary

Reviewed `renderUnir` (tap-tap matching, SVG lines, round summary), the `renderSesion` variant selector, and `App.session.start` variant filtering. The overall structure is sound: `textContent` is used throughout for word data, the resize listener is cleaned up in `showRoundSummary` and via `cleanupObserver`, and the SVG coordinate math is correct.

Three bugs worth fixing before shipping: one causes the wrong variant to be used during a round (silent wrong behaviour), one allows a stale timeout to mutate detached DOM nodes, and one is an XSS-adjacent code pattern in the dictionary that is technically safe today but fragile.

---

## Warnings

### WR-01: `_matchVariant` not preserved in new session object — wrong variant used in `renderUnir`

**File:** `index.html:1002-1010` (session.start) and `index.html:1829` (renderUnir)

**Issue:** `App.session._matchVariant` is set by `_sesionEmpezar` (line 2302) and read inside `session.start` (line 988) before the session object is replaced — that part is fine. But `session.start` creates a brand-new `App.session` object (line 1003) and only re-attaches `start`; `_matchVariant` is not carried over. When `renderUnir` later reads `App.session._matchVariant` (line 1829), it gets `undefined` and defaults to `'es-he'` regardless of what the user selected. A user who chose `sg-pl` or `masc-fem` will see the Spanish↔Hebrew layout and labels instead.

**Fix:** Carry `_matchVariant` into the new session object in `session.start`:

```js
// line 1003 — add _matchVariant to the new object
App.session = {
  mode,
  words: words.slice(0, qty),
  index: 0,
  direction: st.direction,
  results: [],
  _matchVariant: variant   // variant is already computed above at line 988
};
App.session.start = startFn;
```

---

### WR-02: Stale `setTimeout` can mutate detached DOM nodes after navigation

**File:** `index.html:2014-2022`

**Issue:** On an incorrect tap, a 450ms `setTimeout` resets border/background styles and removes the red line. If the user navigates away (or the round summary fires) within those 450ms, `el.innerHTML = ''` detaches the button elements. The timeout still fires and calls `.style.borderColor = ...` and `lineEl.parentNode.removeChild(lineEl)` on those now-detached nodes. The `lineEl.parentNode` guard prevents a throw, but the style mutations are silent no-ops that produce no visible harm today — except that if `renderUnir` is called again quickly (e.g. "Siguiente ronda" clicked immediately), the new round's elements could conceivably share state. More critically, if `showRoundSummary` is triggered while the timeout is in flight, the `el.innerHTML = ''` at line 2036 wipes the column DOM while the timeout still holds references — the cleanup is then a no-op instead of actually resetting `pendingLine`.

**Fix:** Track a cancelled flag and bail early in the timeout:

```js
let cancelled = false;

function showRoundSummary() {
  cancelled = true;
  window.removeEventListener('resize', onResize);
  // ...rest unchanged
}

// inside the incorrect-pair setTimeout:
setTimeout(() => {
  if (cancelled) return;
  [capturedLeft.el, capturedRight.el].forEach(e => {
    e.style.borderColor = 'var(--border)';
    e.style.background  = 'var(--surface)';
    e.style.animation   = '';
  });
  if (lineEl.parentNode) lineEl.parentNode.removeChild(lineEl);
  pendingLine = null;
}, 450);
```

Also set `cancelled = true` inside the `cleanupObserver` callback (line 2062) for the navigation-away case.

---

### WR-03: `safe.innerHTML` used after `textContent` escape — fragile XSS pattern in dictionary

**File:** `index.html:2395-2399`

**Issue:** The search query is escaped via `safe.textContent = query` and then re-read as `safe.innerHTML` to insert into a template string. This is safe today because setting `textContent` causes the browser to HTML-encode the value, so `safe.innerHTML` yields the encoded string. However, the pattern looks like XSS to any reader (and linters/SAST tools will flag it). It also couples the escape to a live DOM node allocation for a string operation.

```js
// current — safe but misleading
const safe = document.createElement('span');
safe.textContent = query;
return `... Sin resultados para "<strong>${safe.innerHTML}</strong>" ...`;
```

**Fix:** Replace with a one-liner escape function, consistent with how word data is handled everywhere else in the file:

```js
function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
// then:
return `... Sin resultados para "<strong>${escHtml(query)}</strong>" ...`;
```

---

## Info

### IN-01: `leftIsHebrew()` is a zero-argument function but could be a constant

**File:** `index.html:1837`

**Issue:** `leftIsHebrew()` is declared as a function (`function leftIsHebrew() { return variant !== 'es-he'; }`) but `variant` is captured from the outer scope and never changes within the render call. Same for `rightIsHebrew()` at line 1838. Not a bug, but calling them as functions is slightly misleading.

**Fix:** `const leftIsHebrew = variant !== 'es-he';` and `const rightIsHebrew = true;` — matches how `variant` itself is used.

---

### IN-02: `getRightText` returns `undefined` for `masc-fem` words without `fsg`

**File:** `index.html:1831-1835`

**Issue:** For the `masc-fem` variant, `getRightText` returns `w.fsg`. `session.start` filters to `w.kind === 'gendered'`, but `gendered` words still might have `fsg === null` per the data rules ("celdas con '—' → null"). If such a word slips through, the button renders with the text `"null"` (since `btn.textContent = textContent` at line 1874 where `textContent` is the parameter name shadowing the DOM property).

**Fix:** Add a fallback in `getRightText`:

```js
function getRightText(w) {
  if (variant === 'sg-pl')    return w.mpl || '';
  if (variant === 'masc-fem') return w.fsg || '';
  return w.msg || '';
}
```

And add the same null guard to `getLeftText` and the `sg-pl` branch in `session.start` (line 990 already guards `w.mpl !== w.msg` which short-circuits on null, so the filter is safe there — the display path needs the guard).

---

_Reviewed: 2026-10-13_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
