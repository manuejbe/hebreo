---
status: partial
phase: 01-base
source: [01-VERIFICATION.md]
started: 2026-10-13T00:00:00.000Z
updated: 2026-10-13T00:00:00.000Z
---

## Current Test

[awaiting human testing]

## Tests

### 1. Dictionary RTL visual rendering
expected: Expandir acordeones en Diccionario — celdas hebreas alineadas a la derecha, celdas en español alineadas a la izquierda; fuente Heebo visible en las celdas hebreas
result: [pending]

### 2. Real-time search with Hebrew and Spanish input
expected: Tipear "ser" filtra a palabras con "ser" en español; tipear "להיות" filtra a esa palabra; tipear "zzz" muestra "Sin resultados para 'zzz'" con botón para limpiar
result: [pending]

### 3. Dark mode auto + manual override
expected: DevTools Rendering → prefers-color-scheme: dark → fondo cambia a #0D1520; `App.ui.applyTheme('oscuro')` en consola → permanece oscuro; `App.ui.applyTheme('auto')` → vuelve a seguir la media query; recarga mantiene el tema elegido
result: [pending]

### 4. Session selector persistence
expected: Cambiar selección de categorías o filtro en #/sesion, recargar la página → la selección se restaura correctamente
result: [pending]

### 5. Zero console errors
expected: Navegar Inicio → Diccionario → Sesión en Chromium (servido con python3 -m http.server) sin errores en la consola DevTools
result: [pending]

## Summary

total: 5
passed: 0
issues: 0
pending: 5
skipped: 0
blocked: 0

## Gaps
