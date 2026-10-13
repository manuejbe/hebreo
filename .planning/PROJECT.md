# Ivrit

## What This Is

Web app estática y PWA (HTML + CSS + JS vanilla, sin frameworks ni build) para estudiar vocabulario hebreo con sistema de repetición espaciada Leitner. El vocabulario se sincroniza desde un Google Doc del usuario y la app funciona completamente offline. Está en español, es mobile-first y ofrece diez modos de ejercicio: tarjetas, opción múltiple, unir con flechas, escribir con teclado hebreo en pantalla, clasificar, contrarreloj y más.

## Core Value

El progreso Leitner que hace que el usuario vuelva a estudiar todos los días, apoyado por el repaso del día y la racha.

## Requirements

### Validated

- [x] La app carga y normaliza vocab.json al iniciar (Phase 1)
- [x] El estado vive en localStorage (Phase 1)
- [x] El router usa hashes para que funcione el botón "atrás" del celular (Phase 1)
- [x] El layout es mobile-first, modo oscuro automático y manual (Phase 1)
- [x] La pantalla Inicio muestra resumen real, grilla de modos (Phase 1)
- [x] El Diccionario con buscador instantáneo y vista por categoría (Phase 1)
- [x] El selector de sesión con chips, filtros, cantidad (Phase 1)
- [x] La sincronización con Google Docs muestra diff sin borrar progreso (Phase 2)
- [x] El modo Tarjetas flip 3D con swipe y calificación (Phase 3)
- [x] El modo Opción múltiple con 4 distractores del mismo kind (Phase 3)
- [x] El modo Unir con flechas (6 pares/ronda, SVG lines, tap-tap, variantes ES↔HE/sg-pl/masc-fem) (Phase 4)

### Active

- [ ] La app carga y normaliza vocab.json al iniciar, mapeando encabezados hebreos a campos normalizados
- [ ] El estado vive en localStorage (progreso, configuración, caché)
- [ ] El router usa hashes (#/inicio, etc.) para que funcione el botón "atrás" del celular
- [ ] El layout es mobile-first (360px mínimo), modo oscuro automático y manual
- [ ] La pantalla Inicio muestra resumen, botón Repaso del día, grilla de modos y barras de progreso
- [ ] El Diccionario tiene buscador instantáneo (ignora acentos/niqqud) y vista por categoría
- [ ] El selector de sesión permite elegir categorías, filtro, dirección y cantidad de preguntas
- [ ] La sincronización con Google Docs muestra diff (nuevas/modificadas/eliminadas) sin borrar progreso
- [ ] El modo Tarjetas flip 3D con swipe y botones de calificación
- [ ] El modo Opción múltiple con 4 distractores del mismo kind y feedback animado
- [ ] El modo Unir con flechas (6 pares, líneas SVG, drag + tap, variantes)
- [ ] El progreso Leitner (cajas 0–5, intervalos definidos en SPEC §5) actualiza en todos los modos
- [ ] El Repaso del día y el Repaso de errores combinan múltiples modos
- [ ] Las Estadísticas muestran racha, calendario 30 días, % por modo/categoría, 15 palabras más falladas
- [ ] Teclado hebreo en pantalla (layout SI-1452) y mapeo de teclado físico QWERTY→hebreo
- [ ] Los modos Escribir, Completar la forma y Concordancia usan el teclado hebreo
- [ ] Corrección tolerante de hebreo: normaliza niqqud, letras finales, Levenshtein 1 = "Casi"
- [ ] Los modos Clasificar y Contrarreloj con drag y timer de 60 s
- [ ] Audio con speechSynthesis (voz he-IL), configurable, ocultado si no hay voz disponible
- [ ] Configuración completa: sync URL, estudio, audio, teclado, apariencia, exportar/importar progreso
- [ ] PWA: manifest, sw.js con caché versionada, funciona offline
- [ ] tests.html con tests en el navegador para funciones de normalización y corrección

### Out of Scope

- Backend propio — todo el estado vive en localStorage; Google Apps Script ya existe
- Framework frontend (React/Vue/etc.) — vanilla per spec
- Notificaciones push — complejidad alta, no es core
- Cuenta de usuario / sync multi-dispositivo — fuera del alcance de esta versión
- Gamificación más allá de racha y récord — no está en el spec

## Context

- **Vocabulario real:** vocab.json tiene 17 categorías, ~735 palabras. El formato tiene columnas variables según el tipo (verbos, sustantivos, adjetivos, países, profesiones).
- **Apps Script ya implementado:** el endpoint GET en APPS_SCRIPT_URL devuelve el mismo JSON que vocab.json con CORS habilitado.
- **DESIGN.md define el sistema de diseño completo:** paleta "Levant Light" (azul israelí + marfil), Cormorant Garamond + Nunito + Heebo, todos los componentes especificados.
- **Plataforma objetivo principal:** móvil (Android/iOS), probado a 390×844 y 360×640.
- **Hosting:** GitHub Pages desde la rama main, carpeta raíz.
- **Tipos de palabras:** verb (פועל), expr (ביטוי), country (מדינה), gendered (יחידה/רבות), noun (el resto).

## Constraints

- **Tech stack:** HTML + CSS + JS vanilla ES2020+. Cero npm. Un solo index.html con todo adentro.
- **Fuentes externas:** solo Google Fonts (Cormorant Garamond, Nunito, Heebo) — sin otras CDN.
- **Compatibilidad:** iOS Safari 15+, Chrome Android 100+, Desktop Chrome/Firefox/Safari modernos.
- **Performance:** fluido con varios miles de palabras; la normalización debe ser función pura.
- **Sin preflight CORS:** el fetch al Apps Script debe ser GET simple sin headers custom.
- **Pruebas locales:** `python3 -m http.server` (fetch de vocab.json no anda con file://).

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Vanilla JS sin frameworks | Spec lo requiere explícitamente; facilita hosting estático | — Pending |
| Un solo index.html | Máxima simplicidad de deploy; rutas con hash | — Pending |
| Leitner clásico (5 cajas) | Sistema probado, simple de implementar y entender | — Pending |
| Heebo para hebreo | Diseñada específicamente para texto hebreo moderno; disponible en Google Fonts | — Pending |
| localStorage para todo el estado | Sin backend; cero configuración de servidor | — Pending |
| DESIGN.md como sistema de diseño | Dirección visual "Levant Light" definida antes de codear | ✓ Good |

---

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition:**
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone:**
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-10-13 — Phase 4 complete (Unir con flechas)*
