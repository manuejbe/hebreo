---
status: partial
phase: 02-sincronizacion
source: [02-VERIFICATION.md]
started: 2026-10-13T16:00:00Z
updated: 2026-10-13T16:00:00Z
---

## Current Test

[awaiting human testing]

## Tests

### 1. Sincronizar button — spinner + result panel (online)
expected: Tapping 🔄 Sincronizar shows a spinner + "Sincronizando…" on the button while fetching. On success, an overlay panel appears with "✅ X nuevas · Y modificadas · Z eliminadas". The "Última sincronización:" date in Inicio updates to the new timestamp without a page reload.
result: [pending]

### 2. Offline error toast
expected: With network off (or DevTools → Network → Offline), tapping Sincronizar shows a toast "⚠ Sin conexión — revisa tu internet". The app continues to work normally with the cached vocab.
result: [pending]

### 3. New-word list + "Estudiar las nuevas" button
expected: If vocab has new words after sync, the result panel shows a collapsible list of new words (español + hebreo side-by-side) and a "📚 Estudiar las nuevas" button. Tapping it navigates to #/sesion.
result: [pending]

## Summary

total: 3
passed: 0
issues: 0
pending: 3
skipped: 0
blocked: 0

## Gaps
