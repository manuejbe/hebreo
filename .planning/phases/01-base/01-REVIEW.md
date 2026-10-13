---
phase: 01-base
reviewed: 2026-10-13T00:00:00Z
depth: standard
files_reviewed: 1
files_reviewed_list:
  - index.html
findings:
  critical: 0
  warning: 3
  info: 4
  total: 7
status: issues_found
---

# Phase 1: Code Review Report

**Reviewed:** 2026-10-13
**Depth:** standard
**Files Reviewed:** 1 (`index.html`)
**Status:** issues_found

## Summary

The base scaffold is well-structured: clean CSS variable system, safe `localStorage` wrappers, functional hash router, and working data normalization pipeline. No critical security vulnerabilities were found. The three warnings are correctness bugs that will surface with real data — a duplicate-ID gap in the normalizer, value-truncating URL parameter parsing, and a missing `<link rel="manifest">` that silently breaks PWA installation. The info items are code-quality concerns that won't cause failures in Phase 1 but will accumulate as complexity grows.

---

## Warnings

### WR-01: Duplicate word IDs when three+ rows share the same `es` value

**File:** `index.html:709-714`
**Issue:** `seenBase[baseId]` is only set on the *first* encounter of a `baseId`. If a second row with the same `es` value arrives, it gets `baseId + '::' + slugify(msg)`. If a *third* row with the same `es` **and** the same `msg` also arrives, `seenBase[baseId]` is already `true`, so it also gets `baseId + '::' + slugify(msg)` — identical to the second row. Two words end up with the same stable ID, so Leitner progress written for one overwrites the other.

**Fix:**
```js
// Replace lines 708–714 with:
const baseId = catSlug + '::' + slugify(word.es || '');
if (seenBase[baseId] !== undefined) {
  seenBase[baseId]++;
  word.id = baseId + '::' + slugify(word.msg || '') + (seenBase[baseId] > 1 ? '-' + seenBase[baseId] : '');
} else {
  seenBase[baseId] = 0;
  word.id = baseId;
}
```
A simpler minimal fix is: track a counter instead of a boolean, and append the counter to the collision branch when > 1.

---

### WR-02: URL query-string values containing `=` are silently truncated

**File:** `index.html:782`
**Issue:** `pair.split('=')` splits on the *first* `=` only because destructuring takes `[k, v]`. Actually `String.split('=')` without a limit returns all parts, so `v` gets only the first segment after `k`, and any `=` in the value is silently dropped. For example `?word=a=b` decodes as `{ word: 'a' }`. This will corrupt navigation when future screens pass base64-encoded params (which contain `=` padding) via the hash.

**Fix:**
```js
// Replace line 782–783 with:
queryPart.split('&').forEach(pair => {
  const eq = pair.indexOf('=');
  if (eq < 0) return;
  const k = pair.slice(0, eq);
  const v = pair.slice(eq + 1);
  if (k) params[decodeURIComponent(k)] = decodeURIComponent(v);
});
```

---

### WR-03: PWA manifest not linked — `<link rel="manifest">` missing from `<head>`

**File:** `index.html:3-9`
**Issue:** `CLAUDE.md` lists `manifest.webmanifest` as a required site file and the project targets PWA (installable, GitHub Pages). The `<head>` has no `<link rel="manifest">`. Without this tag, browsers never discover the manifest, so "Add to Home Screen" / install prompts never fire and the PWA is effectively non-functional regardless of whether `manifest.webmanifest` exists on disk.

**Fix:**
```html
<!-- Add inside <head>, after the viewport meta -->
<link rel="manifest" href="manifest.webmanifest">
```

---

## Info

### IN-01: `seenBase` tracks only the first duplicate — first occurrence ID not re-stamped

**File:** `index.html:709-714`
**Issue:** When `seenBase[baseId]` is already `true` (second duplicate), `seenBase[baseId]` is never updated to record a third collision. This is the root of WR-01 above, but also means the sentinel never accounts for the *first* word being reassigned if desired. Minor design note beyond WR-01.

---

### IN-02: Category names injected into `onclick` attribute without HTML-entity escaping

**File:** `index.html:969-972`
**Issue:** `safecat` escapes backslashes and single quotes before embedding in `onclick="App.ui._sesionToggleCat('${safecat}')"`, but does not escape `<`, `>`, or `"`. A category name containing `"` would break the HTML attribute boundary. `vocab.json` is trusted and currently has no such characters, but the pattern is fragile if data sources change.

**Fix:** Attach click handlers imperatively after `innerHTML` is set (assign `onclick` via JS, not attribute string), or HTML-encode the attribute value. The imperative approach avoids the issue entirely and removes the escaping complexity.

---

### IN-03: `safe.innerHTML` used as HTML-escape idiom — non-obvious and fragile

**File:** `index.html:1166-1170`
**Issue:** The "no results" message escapes `query` by setting `safe.textContent = query` then reading `safe.innerHTML`. This correctly produces HTML-escaped text, but the idiom is easily broken: changing `.textContent` to `.innerText` or `.textContent = ...` on a detached node in some edge cases gives unexpected results. It also surprises future readers.

**Fix:**
```js
function escapeHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
// Then:
`Sin resultados para "<strong>${escapeHtml(query)}</strong>"`
```
One small utility function removes the magic.

---

### IN-04: `reduce-motion` blanket `transition-duration: .01ms !important` overrides focus ring transitions

**File:** `index.html:379-384`
**Issue:** The `prefers-reduced-motion` block sets `transition-duration: .01ms !important` on `*, *::before, *::after`. This is a common pattern, but it also kills the `:focus-visible` outline transition (line 443–447), which has no `animation` — only `transition`. More importantly, it kills the `toast` `animation-duration` before the `toast-out` animation plays (the toast `out` class uses an animation), which means the `animationend` event on the toast (line 622) may fire extremely quickly, calling `t.remove()` before the user has read the toast content.

**Fix:** Keep the blanket `animation-duration: .01ms !important` for motion reduction but allow transitions on opacity/color for accessibility (focus ring). Alternatively, only override `transform`-based transitions, not `opacity`. At minimum, the toast `showToast` function should guard: if `prefers-reduced-motion` is active, skip the `out` animation and call `t.remove()` directly after `duration` ms.

---

_Reviewed: 2026-10-13_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
