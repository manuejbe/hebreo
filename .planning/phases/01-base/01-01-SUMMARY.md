---
phase: 01-base
plan: 01
subsystem: ui
tags: [html, css-variables, design-system, theme, localstorage, routing, vanilla-js]

requires: []
provides:
  - "index.html con sistema CSS completo 'Levant Light' (variables de DESIGN.md §1)"
  - "Sistema de tema auto/claro/oscuro wired a localStorage ivrit.v1.settings"
  - "Barra de navegación inferior (5 items, dot-indicator, glassmorphism)"
  - "Layout mobile-first: 360px mínimo, 720px máximo centrado en desktop"
  - "Google Fonts: Cormorant Garamond + Nunito + Heebo cargadas"
  - "App object scaffold con Store helpers, showToast, sub-módulos declarados"
  - "Clase .he con RTL, Heebo y --he-scale configurable"
  - "Chips Leitner, transiciones de pantalla, animaciones shake/flash"
affects:
  - "01-02 (data loading usa App.data y Store helpers)"
  - "01-03 (router usa App.router y las pantallas .screen/.screen.active)"
  - "01-04 (Inicio screen usa layout, nav activa, chips Leitner)"
  - "01-05 (Diccionario usa .he, box-chip, layout)"
  - "todas las fases posteriores consumen estas variables CSS"

tech-stack:
  added: ["HTML5 vanilla", "CSS custom properties", "ES2020+"]
  patterns:
    - "App global object con sub-módulos (App.data, App.state, App.router, App.ui)"
    - "Store wrapper para localStorage con try/catch y flag storageOk"
    - "data-theme attribute en <html> para tema; media query :root:not([data-theme=light]) para auto-dark"
    - "Hash routing via href='#/route' (router en Plan 03)"
    - "data-he-size en <html> para escala de hebreo configurable"

key-files:
  created:
    - "index.html — shell completo de la app (CSS + JS inline)"
  modified: []

key-decisions:
  - "Tema auto usa :root:not([data-theme='light']) dentro de @media prefers-color-scheme:dark — permite que 'claro' anule el OS sin JS"
  - "applyTheme('auto') elimina el atributo data-theme (en lugar de setearlo a 'auto') — CSS media query toma el control directamente"
  - "initTheme restaura heSize además de theme en el arranque — ambas configuraciones necesarias antes de primer render"
  - "Store.set persiste settings completo en cada llamada a applyTheme — evita lecturas parciales"

patterns-established:
  - "Hebreo: todo nodo usa lang='he' dir='rtl' + clase .he + Heebo"
  - "Espaciado: usar variables --sp-* en lugar de px literales"
  - "Animaciones: siempre con variante prefers-reduced-motion"
  - "Touch targets: min-width/height 44px en elementos interactivos"
  - "Focus: :focus-visible con outline 2px solid var(--blue-600)"

requirements-completed: [LAYO-01, LAYO-02, LAYO-03, LAYO-04, LAYO-05, LAYO-06, STAT-01, STAT-02]

duration: 3min
completed: 2026-10-13
---

# Phase 1 Plan 01: HTML Shell + CSS Design System Summary

**index.html greenfield con las 94 variables CSS de DESIGN.md 'Levant Light', barra de nav glassmorphism, sistema de tema auto/claro/oscuro persistido en localStorage, y App object scaffold listo para extender**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-10-13T13:51:00Z
- **Completed:** 2026-10-13T13:53:18Z
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments

- CSS completo con todas las variables de DESIGN.md §1 en `:root` (light) y overrides dark
- Sistema de tema triple: `auto` (sigue OS via media query), `claro` (fuerza light via `[data-theme="light"]`), `oscuro` (fuerza dark via `[data-theme="dark"]`)
- Barra inferior fija con 5 ítems, glassmorphism, dot-indicator activo, SVGs inline 24×24 stroke-width 1.75
- Layout max-width 720px centrado, padding responsive, padding-bottom con env(safe-area-inset-bottom)
- App object con Store (localStorage wrapper con try/catch), showToast, initTheme, applyTheme

## Task Commits

1. **Task 1: HTML shell + full CSS design system** — `13f76f8` (feat)

## Files Created/Modified

- `index.html` — 630 líneas: `<style>` con 11 secciones CSS + `<script>` con App scaffold, Store, tema, toast

## Decisions Made

- La estrategia CSS para el tema evita el FOUC: `data-theme` se aplica antes de que el parser llegue al body porque `initTheme()` corre en DOMContentLoaded, que es la primera oportunidad disponible en un single-file sin build. Aceptable para Phase 1.
- Se incluyó `[data-theme="light"]` con los valores explícitos del tema claro para que `claro` manual funcione correctamente incluso cuando el OS está en dark.
- `prefers-reduced-motion: reduce` aplica `animation-duration: .01ms` globalmente además de las variantes específicas de page-out/in — cobertura total de animaciones.

## Deviations from Plan

Ninguna — el plan se ejecutó exactamente como estaba escrito.

## Issues Encountered

Ninguno.

## User Setup Required

Ninguno — no se requiere configuración externa.

## Next Phase Readiness

- **Plan 02 (Data):** App.data y Store ya declarados; solo falta implementar `App.data.load()` y la normalización de vocab.json
- **Plan 03 (Router + Pantallas):** App.router declarado; `.screen` / `.screen.active` CSS ya presentes; `#/inicio` etc. en nav
- **Plan 04+ (Pantallas):** Todas las variables CSS, componentes base (chips Leitner, toast, transiciones) listos para usar

---
*Phase: 01-base*
*Completed: 2026-10-13*
