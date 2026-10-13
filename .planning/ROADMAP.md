# Roadmap: Ivrit

**Project:** Ivrit — App para estudiar vocabulario hebreo
**Created:** 2026-10-12
**Phases:** 10 (9 obligatorias + 1 opcional)
**Source:** SPEC.md §10 (orden exacto)

---

## Overview

| # | Phase | Goal | Requirements | Status |
|---|-------|------|--------------|--------|
| 1 | Base | App cargando datos reales con Inicio, Diccionario y navegación completa | DATA-01..06, ROUT-01, STAT-01..02, LAYO-01..06, INIC-01..05, DICT-01..03, SESI-01..05 | Completed (5/5) |
| 2 | Sincronización | El botón Sincronizar actualiza el vocab desde Google Docs con diff | SYNC-01..05 | Pending |
| 3 | Tarjetas y MCQ | Dos modos de estudio funcionales actualizando progreso | FLAS-01..06, MCQ-01..04 | Pending |
| 4 | Unir con flechas | Modo de matching con líneas SVG y drag/touch | MATC-01..06 | Pending |
| 5 | Progreso Leitner | Repetición espaciada completa, Repaso del día, Estadísticas | LEIT-01..05, RERR-01..02, ESTA-01..03 | Pending |
| 6 | Teclado y Escribir | Teclado hebreo en pantalla + modos de escritura | TECL-01..04, WRIT-01..05, COMP-01, CONC-01..02 | Pending |
| 7 | Clasificar y Contrarreloj | Dos modos adicionales de ejercicio | CLAS-01..03, CONT-01..02 | Pending |
| 8 | Audio y Configuración | Síntesis de voz + configuración completa + exportar/importar | AUDI-01..04, CONF-01..06 | Pending |
| 9 | PWA y pulido | App instalable offline + tests + accesibilidad + README | PWA-01..04, TEST-01..02 | Pending |
| 10 | GitHub Action | Sync automático semanal de vocab.json (opcional) | PUB-01 | Pending |

---

## Phase 1: Base

**Goal:** La app carga y normaliza vocab.json, el router funciona, el layout mobile/dark es correcto, la pantalla Inicio muestra el resumen real, el Diccionario busca y el Selector de sesión configura una sesión (aunque los modos aún no existen).

**UI hint:** yes

**Requirements:** DATA-01, DATA-02, DATA-03, DATA-04, DATA-05, DATA-06, ROUT-01, STAT-01, STAT-02, LAYO-01, LAYO-02, LAYO-03, LAYO-04, LAYO-05, LAYO-06, INIC-01, INIC-02, INIC-03, INIC-04, INIC-05, DICT-01, DICT-02, DICT-03, SESI-01, SESI-02, SESI-03, SESI-04, SESI-05

**Plans:** 5 plans

Plans:
- [x] 01-01-PLAN.md — HTML shell + CSS design system (DESIGN.md variables, fonts, bottom nav, theme, App scaffold) — `13f76f8`
- [x] 01-02-PLAN.md — Data loading + normalization (vocab.json fetch, SPEC §2.2 header mapping, kind detection, localStorage cache) — `c84e27a`
- [x] 01-03-PLAN.md — Router + Inicio screen (hash routing, App.state, Inicio with real data, mode grid) — `0f773b2`
- [x] 01-04-PLAN.md — Diccionario screen (search with accent/niqqud normalization, accordion by category, RTL table) — `10ea949`
- [x] 01-05-PLAN.md — Selector de sesión screen (chips, filters, direction, quantity, remember last selection) — `1625162`

**Success criteria:**
1. `python3 -m http.server` + Chromium a 390×844: se ven todas las palabras de vocab.json en el Diccionario con su forma hebrea y español
2. El buscador del Diccionario filtra en tiempo real ignorando acentos y niqqud
3. El modo oscuro activa automáticamente y el toggle manual funciona
4. La barra inferior navegacion entre Inicio, Diccionario y las demás pantallas vacías
5. El Selector de sesión recuerda la última selección y valida que haya palabras suficientes
6. No hay errores en la consola

**Deliverables:**
- `index.html` (con CSS y JS inline, secciones comentadas)
- Estructura de datos normalizada en memoria
- Router hash funcional
- Pantallas: Inicio (con datos reales), Diccionario, Selector de sesión, stubs para el resto

---

## Phase 2: Sincronización

**Goal:** El botón Sincronizar descarga el vocab desde Google Docs, compara con el actual, muestra el diff y actualiza la caché sin perder progreso.

**UI hint:** yes

**Requirements:** SYNC-01, SYNC-02, SYNC-03, SYNC-04, SYNC-05

**Success criteria:**
1. Al tocar Sincronizar aparece un spinner; a los pocos segundos aparece el resumen "X nuevas · Y modificadas · Z eliminadas"
2. Si se agrega manualmente una fila al JSON y se recarga, aparece como "nueva" en caja 0 y en el filtro "Nuevas"
3. Sin conexión, la app muestra "sin conexión" y sigue funcionando con lo que tenía
4. El progreso de una palabra existente no se pierde al sincronizar
5. La fecha de última sincronización se actualiza en Inicio

**Deliverables:**
- Lógica de fetch + timeout + validación de estructura
- Motor de diff por id de palabra
- UI de resumen con lista desplegable de nuevas

**Plans:** 2 plans

Plans:
- [ ] 02-01-PLAN.md — App.sync module: fetchWithTimeout (20s), validateRaw, diffVocab, applyDiff, run
- [ ] 02-02-PLAN.md — Sync UI: spinner button, result panel with new-word list, error toasts, wire renderInicio

---

## Phase 3: Tarjetas y Opción múltiple

**Goal:** Dos modos de estudio completos que el usuario puede jugar de principio a fin y que actualizan el progreso en localStorage.

**UI hint:** yes

**Requirements:** FLAS-01, FLAS-02, FLAS-03, FLAS-04, FLAS-05, FLAS-06, MCQ-01, MCQ-02, MCQ-03, MCQ-04

**Success criteria:**
1. Las tarjetas hacen flip 3D real al tocar; el swipe izquierda/derecha registra la calificación
2. El dorso muestra la tabla correcta según el tipo (noun: sg+pl; gendered: tabla 2×2; verb: infinitivo)
3. El modo MCQ muestra 4 opciones del mismo kind; la correcta queda verde y la errónea roja con animación
4. Las teclas 1–4 y Enter funcionan en desktop
5. Al terminar una sesión de tarjetas aparece el resultado con botón "Repetir las que no sabía"
6. El progreso Leitner básico (caja sube/baja) se refleja en localStorage después de una sesión

**Deliverables:**
- Pantalla de tarjetas con flip CSS 3D y swipe
- Indicadores de swipe (overlay verde/rojo)
- Pantalla de opción múltiple con grid 2×2
- Lógica de distractores por kind y categoría
- Pantalla de resultado de sesión
- Actualización básica de progreso (pre-Leitner completo)

---

## Phase 4: Unir con flechas

**Goal:** El modo de matching con líneas SVG funciona en móvil y desktop, con drag y tap, y las variantes (ES↔HE, sg↔pl, masc↔fem) están disponibles.

**UI hint:** yes

**Requirements:** MATC-01, MATC-02, MATC-03, MATC-04, MATC-05, MATC-06

**Success criteria:**
1. Se pueden unir elementos por tap en dos pasos Y por drag (en touch y mouse)
2. Las líneas SVG son curvas con punta de flecha; la correcta queda verde y la incorrecta parpadea en rojo y desaparece
3. Al rotar el dispositivo las líneas se redibujan en las posiciones correctas
4. La variante singular↔plural solo aparece para palabras con plural distinto al singular
5. Al terminar una ronda se muestran el tiempo y los errores

**Deliverables:**
- SVG overlay con líneas curvas dinámicas
- Pointer Events para drag unificado mouse/touch
- Cálculo de posiciones con ResizeObserver + scroll listener
- Tres variantes en el selector de sesión

---

## Phase 5: Progreso Leitner completo

**Goal:** El sistema Leitner con intervalos completos, el Repaso del día, el Repaso de errores y las Estadísticas están funcionando.

**UI hint:** yes

**Requirements:** LEIT-01, LEIT-02, LEIT-03, LEIT-04, LEIT-05, RERR-01, RERR-02, ESTA-01, ESTA-02, ESTA-03

**Success criteria:**
1. Después de acertar una palabra, su `box` sube y `due` se actualiza con el intervalo correcto (caja 2 = mañana, caja 3 = en 3 días, etc.)
2. El "Repaso del día" incluye las palabras vencidas + hasta 10 nuevas, mezclando modos
3. La pantalla de Estadísticas muestra el calendario de los últimos 30 días con días con sesión marcados
4. Las 15 palabras más falladas aparecen en la lista con botón para estudiarlas
5. La racha de días se incrementa correctamente y se resetea si se salta un día
6. El Repaso de errores saca una palabra de la lista después de 2 aciertos seguidos

**Deliverables:**
- Motor Leitner completo con timestamps y `due`
- Pantalla "Repaso del día" con mix de modos
- Pantalla "Repaso de errores"
- Pantalla de Estadísticas con calendario y charts simples (barras CSS)

---

## Phase 6: Teclado hebreo y modos de escritura

**Goal:** El teclado hebreo en pantalla funciona en móvil sin conflicto con el teclado del sistema; el mapeo físico QWERTY→hebreo funciona en desktop; los tres modos de escritura (Escribir, Completar la forma, Concordancia) corrigen con tolerancia.

**UI hint:** yes

**Requirements:** TECL-01, TECL-02, TECL-03, TECL-04, WRIT-01, WRIT-02, WRIT-03, WRIT-04, WRIT-05, COMP-01, CONC-01, CONC-02

**Success criteria:**
1. En móvil, el teclado del sistema no aparece al enfocar el campo de respuesta (inputmode="none")
2. Escribir "lhyut" en teclado QWERTY en desktop produce "להיות" en el campo
3. La respuesta "להיות" con niqqud se acepta igual que "להיות" sin niqqud
4. Respuesta "להיותם" (Levenshtein 1 de "להיות") muestra "Casi" con la letra extra resaltada
5. El modo Concordancia con "היא ___ (grande)" acepta "גדולה" como correcta
6. El modo Completar la forma no pregunta destinos null ni destinos iguales al origen

**Deliverables:**
- Componente teclado hebreo (HTML+CSS+JS, reutilizable)
- Mapeo físico QWERTY→hebreo con detección de idioma del sistema
- Funciones puras: `normalizeHe()`, `checkAnswerHe()`, `levenshtein()`, `checkAnswerEs()`
- Pantalla "Escribir" (ES→HE y HE→ES)
- Pantalla "Completar la forma" (con opciones y modo escritura)
- Pantalla "Concordancia" (adjetivos y profesiones)

---

## Phase 7: Clasificar y Contrarreloj

**Goal:** Los dos últimos modos de ejercicio están completos con drag-and-drop y timer.

**UI hint:** yes

**Requirements:** CLAS-01, CLAS-02, CLAS-03, CONT-01, CONT-02

**Success criteria:**
1. El modo Clasificar muestra 8–12 palabras y 3–4 grupos; arrastrar a un grupo correcto lo deja en verde
2. Arrastrar a un grupo incorrecto rebota con animación roja y cuenta el error
3. En el Contrarreloj el timer descuenta visualmente; un error resta 2 segundos con animación
4. Al superar el récord personal se muestra "¡Nuevo récord!"
5. La variante "Profesiones por área" solo aparece si hay palabras con תחום

**Deliverables:**
- Pantalla Clasificar con Pointer Events para drag y tap-en-dos-pasos
- Pantalla Contrarreloj con timer circular o barra animada
- Lógica de récords en localStorage

---

## Phase 8: Audio y Configuración completa

**Goal:** Los botones 🔊 reproducen hebreo correctamente; la pantalla de Configuración cubre todos los ajustes del SPEC; el exportar/importar progreso funciona.

**UI hint:** yes

**Requirements:** AUDI-01, AUDI-02, AUDI-03, AUDI-04, CONF-01, CONF-02, CONF-03, CONF-04, CONF-05, CONF-06

**Success criteria:**
1. En un dispositivo con voz he-IL, tocar 🔊 reproduce la palabra con la velocidad configurada
2. En un dispositivo sin voz he-IL, los 🔊 están ocultos y Configuración muestra un aviso una sola vez
3. El selector de voz en Configuración muestra solo las voces he-IL disponibles
4. Exportar descarga un JSON con todo el progreso; importar lo restaura con confirmación
5. Borrar progreso requiere dos confirmaciones; después el Inicio vuelve a mostrar todo en caja 0
6. El tamaño del texto hebreo "muy grande" es claramente mayor que "normal" en las tarjetas

**Deliverables:**
- Módulo de audio con speechSynthesis + fallback + voiceschanged handler
- Pantalla Configuración completa (todas las secciones de SPEC §4.14)
- Exportar/importar progreso como JSON

---

## Phase 9: PWA, pulido visual y calidad

**Goal:** La app es instalable en el celular, funciona offline, pasa los tests de normalización, y no tiene errores de accesibilidad ni en la consola.

**UI hint:** yes

**Requirements:** PWA-01, PWA-02, PWA-03, PWA-04, TEST-01, TEST-02

**Success criteria:**
1. Chrome en Android muestra el prompt "Instalar Ivrit"; la app instalada abre en standalone sin barra del browser
2. Desconectado del wifi, la app abre con el vocabulario en caché y permite estudiar
3. `tests.html` muestra 100% ✓ en Chromium para todas las funciones de normalización
4. Lighthouse PWA score ≥ 90 en desktop Chromium
5. No hay errores de consola en móvil (390×844) ni desktop después de una sesión completa
6. Todos los botones de ícono tienen `aria-label`; el contraste pasa AA en ambos temas

**Deliverables:**
- `icon.svg` (א blanca sobre azul)
- `manifest.webmanifest`
- `sw.js` con caché versionada (network-first / cache-first según tipo)
- `tests.html` con suite de tests del navegador
- `README.md`
- Pulido visual final según DESIGN.md

---

## Phase 10: GitHub Action (opcional)

**Goal:** vocab.json se actualiza automáticamente en el repo todos los lunes sin intervención manual.

**UI hint:** no

**Requirements:** PUB-01

**Success criteria:**
1. `.github/workflows/sync-vocab.yml` corre todos los lunes a las 9:00 UTC
2. Si el JSON cambió, hace commit con mensaje descriptivo; si no cambió, no hace nada
3. `workflow_dispatch` permite correrlo manualmente desde la UI de GitHub Actions
4. Si el Apps Script falla o devuelve un formato inválido, el workflow falla con mensaje claro (no hace commit)

**Deliverables:**
- `.github/workflows/sync-vocab.yml`

---

## Dependencies

```
Phase 1 ──► Phase 2 ──► Phase 3 ──► Phase 4
                                        │
                                        ▼
                         Phase 5 ◄──────┘
                            │
                            ▼
                         Phase 6 ──► Phase 7
                                        │
                                        ▼
                                     Phase 8 ──► Phase 9 ──► Phase 10
```

- Phase 2 requiere Phase 1 (caché, diff)
- Phase 3 requiere Phase 1 (datos, routing)
- Phase 4 requiere Phase 3 (selector de sesión completo)
- Phase 5 requiere Phase 3+4 (actualización de progreso en múltiples modos)
- Phase 6 requiere Phase 5 (Leitner completo, modos de escritura actualizan progreso)
- Phase 7 requiere Phase 5 (Leitner + distractores)
- Phase 8 requiere Phase 6+7 (todos los modos deben existir; teclado se usa en fases anteriores)
- Phase 9 requiere Phase 8 (pulido sobre la app completa)
- Phase 10 es independiente de 9 (solo toca infra de GitHub)

---
*Roadmap created: 2026-10-12*
*Source: SPEC.md §10 (phases follow exact order specified)*
