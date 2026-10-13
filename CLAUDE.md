# Ivrit — Project Instructions

## Project

Web app estática PWA para estudiar vocabulario hebreo con repetición espaciada Leitner. Vanilla HTML+CSS+JS ES2020+, sin frameworks, sin build, un solo `index.html`. Hosting en GitHub Pages. Mobile-first (360px mínimo).

**Spec:** `SPEC.md` — fuente de verdad para requisitos  
**Diseño:** `DESIGN.md` — sistema de diseño "Levant Light" (paleta, tipografías, componentes)  
**Datos:** `vocab.json` — vocabulario real (17 categorías, ~735 palabras)

## GSD Workflow

Este proyecto usa GSD para planificación y ejecución.

```
/gsd-plan-phase [N]    — planificar la siguiente fase
/gsd-execute-phase [N] — ejecutar la fase planificada
/gsd-progress          — ver estado actual del proyecto
```

**Fase activa:** Phase 1 — Base  
**Planning docs:** `.planning/`

## Reglas técnicas

- **Un solo archivo:** todo el código vive en `index.html` (CSS en `<style>`, JS en `<script>`)
- **Sin npm, sin build:** cero dependencias externas excepto Google Fonts
- **Fuentes:** solo `fonts.googleapis.com` — Cormorant Garamond + Nunito + Heebo
- **Rutas:** hash routing (`#/inicio`, `#/tarjetas`, etc.)
- **Estado:** todo en `localStorage` con prefijo `ivrit.v1.*`, wrapped en try/catch
- **RTL:** todo nodo con hebreo lleva `lang="he" dir="rtl"` y fuente Heebo
- **Fetch al Apps Script:** GET simple sin headers custom (para evitar preflight CORS)
- **Pruebas locales:** `python3 -m http.server` (fetch no anda con `file://`)

## Diseño

Seguir `DESIGN.md` fielmente:
- Paleta: variables CSS de `DESIGN.md §1` — no inventar colores nuevos
- Tipografía: Cormorant Garamond (displays) + Nunito (UI) + Heebo (hebreo)
- Hebreo: siempre `1.25em` (o el `--he-scale` configurado) respecto al español equivalente
- Componentes: tarjetas, teclado, chips, barra inferior — seguir las especificaciones de `DESIGN.md §3`
- Animaciones: respetar `prefers-reduced-motion`; duraciones 150–400ms

## Datos y normalización

El mapeo de encabezados hebreos → campos normalizados está en `SPEC.md §2.2`.  
El tipo de palabra (kind) se determina por los campos presentes (`SPEC.md §2.3`).  
Las celdas con "—" → `null`; nunca preguntar formas `null` en ejercicios.  
Id estable: `slug(categoría) + "::" + es` (+ "::" + msg si se repite).

## Archivos del sitio

- `index.html` — toda la app (CSS + JS inline, secciones comentadas)
- `vocab.json` — datos de respaldo (ya existe, no borrar)
- `manifest.webmanifest` — PWA manifest
- `sw.js` — service worker con caché versionada
- `icon.svg` — א blanca sobre fondo azul #0052B4
- `tests.html` — tests de normalización/corrección en el navegador
- `README.md` — documentación del proyecto
