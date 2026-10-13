# Requirements: Ivrit

**Defined:** 2026-10-12
**Core Value:** El progreso Leitner que hace que el usuario vuelva a estudiar todos los días

## v1 Requirements

### Datos y normalización

- [ ] **DATA-01**: La app carga vocab.json al iniciar y normaliza los datos según el mapeo de encabezados de SPEC §2.2 (תרגום→es, יחיד→msg, רבים→mpl, יחידה→fsg, רבות→fpl, פועל→msg, etc.)
- [ ] **DATA-02**: El sistema detecta el tipo de palabra (kind: verb/expr/country/gendered/noun) según los campos presentes (SPEC §2.3)
- [ ] **DATA-03**: Las celdas con "—" se mapean a null; los ejercicios nunca preguntan formas null
- [ ] **DATA-04**: El id de cada palabra es `slug(categoría) + "::" + es` (+ "::" + msg si hay duplicado en la categoría)
- [ ] **DATA-05**: La app usa la caché de localStorage si su `updated` es más reciente que vocab.json; si no, usa vocab.json
- [ ] **DATA-06**: Encabezados desconocidos se guardan en `extra[encabezado]` sin romper la app

### Routing y estado

- [ ] **ROUT-01**: La navegación usa hashes (#/inicio, #/tarjetas, #/opcion-multiple, etc.) compatible con el botón "atrás" del celular
- [ ] **STAT-01**: Todo el estado vive en localStorage con claves prefijadas y versionadas: `ivrit.v1.progress`, `ivrit.v1.settings`, `ivrit.v1.vocabCache`, `ivrit.v1.stats`
- [ ] **STAT-02**: Las lecturas/escrituras de localStorage están en try/catch

### Layout y tema

- [ ] **LAYO-01**: El layout es mobile-first: mínimo 360px, botones táctiles 44px mínimo
- [ ] **LAYO-02**: El modo oscuro es automático (`prefers-color-scheme`) más un selector manual (auto/claro/oscuro)
- [ ] **LAYO-03**: En móvil hay una barra inferior fija: Inicio · Estudiar · Diccionario · Estadísticas · Configuración
- [ ] **LAYO-04**: En desktop el layout está centrado a 720px máximo con top bar opcional
- [ ] **LAYO-05**: El diseño sigue DESIGN.md ("Levant Light"): Cormorant Garamond + Nunito + Heebo, paleta de azul israelí + marfil
- [ ] **LAYO-06**: Todo elemento con hebreo lleva `lang="he" dir="rtl"` y fuente Heebo; tamaño 1.25× el español

### Pantalla Inicio

- [ ] **INIC-01**: La pantalla Inicio muestra: total de palabras, dominadas (caja 5), para repasar hoy, nuevas, racha de días
- [ ] **INIC-02**: Hay un botón grande "Repaso del día" prominente
- [ ] **INIC-03**: Hay una grilla de modos con ícono, nombre y descripción corta
- [ ] **INIC-04**: Hay barras de progreso por categoría (apiladas por caja 0–5)
- [ ] **INIC-05**: Se muestra la fecha de última sincronización y el botón 🔄 Sincronizar

### Diccionario

- [ ] **DICT-01**: El buscador busca instantáneamente en español y hebreo (ignora acentos y niqqud)
- [ ] **DICT-02**: La vista por categoría muestra tabla con todas las formas, botón 🔊 y caja de progreso
- [ ] **DICT-03**: Las celdas hebreas tienen `dir="rtl"` alineadas a la derecha; español a la izquierda

### Selector de sesión

- [ ] **SESI-01**: El selector de sesión tiene chips de categoría con multi-selección y cantidad de palabras
- [ ] **SESI-02**: El filtro permite: todas, nuevas, difíciles (caja ≤2 o errores recientes) o para repasar hoy
- [ ] **SESI-03**: La dirección se elige: ES→HE, HE→ES o mezclada
- [ ] **SESI-04**: La cantidad de preguntas se elige: 10, 20, 30 o todas
- [ ] **SESI-05**: La última selección se recuerda; si el filtro deja menos palabras, se avisa

### Sincronización con Google Docs

- [ ] **SYNC-01**: El botón 🔄 Sincronizar hace GET simple a APPS_SCRIPT_URL con spinner y timeout de 20 s
- [ ] **SYNC-02**: La sincronización compara por id y muestra resumen: "✅ X nuevas · Y modificadas · Z eliminadas"
- [ ] **SYNC-03**: Las palabras nuevas quedan en caja 0 y aparecen en el filtro "Nuevas"; lista desplegable + botón "Estudiar las nuevas"
- [ ] **SYNC-04**: El progreso nunca se borra; las palabras eliminadas desaparecen de ejercicios pero su progreso queda
- [ ] **SYNC-05**: Los errores informan claramente: "sin conexión", "URL no responde", "formato no válido"; la app sigue funcionando

### Tarjetas (flashcards)

- [ ] **FLAS-01**: Las tarjetas tienen flip 3D (perspectiva 900px, 400ms) al tocar o presionar espacio
- [ ] **FLAS-02**: El frente muestra la palabra en la dirección elegida; el dorso muestra todas las formas según el tipo
- [ ] **FLAS-03**: El dorso tiene botón 🔊 por cada forma hebrea
- [ ] **FLAS-04**: El swipe a derecha = "La sé" (actualiza Leitner +1); a izquierda = "No la sé" (vuelve a caja 1)
- [ ] **FLAS-05**: En desktop: flechas → y ← más botones visibles
- [ ] **FLAS-06**: La pantalla final muestra resultado de sesión y botón "Repetir las que no sabía"

### Opción múltiple

- [ ] **MCQ-01**: Se muestran 4 opciones en la dirección elegida, siempre de la misma categoría y kind
- [ ] **MCQ-02**: En Países, los distractores son preferentemente de la misma región; nunca dos opciones con el mismo texto
- [ ] **MCQ-03**: Al responder: correcta en verde, incorrecta elegida en rojo; se muestran todas las formas
- [ ] **MCQ-04**: Atajos de teclado 1–4; "Siguiente" con Enter; barra de progreso de sesión; resultado final con errores

### Unir con flechas

- [ ] **MATC-01**: Rondas de 6 pares: español a la izquierda, hebreo a la derecha, cada columna mezclada
- [ ] **MATC-02**: Se une por tap secuencial O por drag (Pointer Events, mouse + touch)
- [ ] **MATC-03**: Las líneas son curvas SVG con punta de flecha; verde si correcta (fija), rojo si incorrecta (parpadea y desaparece)
- [ ] **MATC-04**: Las líneas se recalculan con resize, scroll y cambio de orientación
- [ ] **MATC-05**: Variantes disponibles: ES↔HE, singular↔plural, masculino↔femenino
- [ ] **MATC-06**: Al terminar cada ronda: tiempo, errores y botón "Siguiente ronda"

### Progreso Leitner

- [ ] **LEIT-01**: Datos por palabra: `{ box: 0-5, due: timestamp, seen, correct, wrong, lastWrong, streak }`
- [ ] **LEIT-02**: Al acertar sube una caja; al errar vuelve a caja 1. Intervalos: 1=mismo día, 2=1d, 3=3d, 4=7d, 5=16d (caja 5: 30d)
- [ ] **LEIT-03**: Todos los modos excepto Diccionario actualizan el progreso; en tarjetas "La sé" = acierto
- [ ] **LEIT-04**: El "Repaso del día" incluye palabras con `due <= ahora` más hasta 10 nuevas por día, mezclando tarjetas/MCQ/escribir
- [ ] **LEIT-05**: La racha registra días (fecha local) con al menos una sesión completada

### Repaso de errores

- [ ] **RERR-01**: El repaso de errores incluye palabras falladas en los últimos 7 días o en caja 1
- [ ] **RERR-02**: Mezcla opción múltiple y escribir; una palabra sale de la lista al acertarla 2 veces seguidas

### Estadísticas

- [ ] **ESTA-01**: Estadísticas generales: aciertos/errores totales, % de aciertos por modo y por categoría, palabras por caja
- [ ] **ESTA-02**: Racha de días y calendario de los últimos 30 días
- [ ] **ESTA-03**: Lista de las 15 palabras más falladas con botón para estudiarlas

### Teclado hebreo y modo Escribir

- [ ] **TECL-01**: Teclado hebreo en pantalla con layout SI-1452 (3 filas de letras + fila especial)
- [ ] **TECL-02**: En móvil el input usa `inputmode="none"` para suprimir el teclado del sistema (con toggle para activarlo)
- [ ] **TECL-03**: El mapeo de teclado físico QWERTY→hebreo se activa con toggle en Configuración (activo por defecto en desktop)
- [ ] **TECL-04**: Si el sistema ya escribe en hebreo, el mapeo no se aplica
- [ ] **WRIT-01**: La corrección normaliza niqqud (U+0591–U+05C7), trim, colapsa espacios, unifica ׳/'/'/– 
- [ ] **WRIT-02**: Letras finales mal usadas (ם/מ, ן/נ, etc.) cuentan como correctas con aviso "Ojo con la letra final"
- [ ] **WRIT-03**: Levenshtein 1 = "Casi", incorrecta, con la respuesta correcta y letras distintas resaltadas
- [ ] **WRIT-04**: Corrección en español: minúsculas, sin acentos, acepta variantes separadas, paréntesis opcionales, x/a expandido
- [ ] **WRIT-05**: Botones "No sé" (muestra respuesta, cuenta como error) y "Pista" (primera letra + cantidad)
- [ ] **COMP-01**: El modo "Completar la forma" pide una forma a partir de otra (solo pares válidos, nunca null ni igual al origen)
- [ ] **CONC-01**: El modo "Concordancia" presenta pronombre + palabra en español; hay que completar con la forma correcta
- [ ] **CONC-02**: Pronombres: הוא→msg, היא→fsg, הם→mpl, הן→fpl; si la forma pedida es null se usa otro pronombre

### Clasificar

- [ ] **CLAS-01**: El modo Clasificar muestra 8–12 palabras mezcladas para arrastrar/tocar-y-soltar a 3–4 grupos
- [ ] **CLAS-02**: Al soltar: correcto queda verde; incorrecto rebota con animación roja y cuenta el error
- [ ] **CLAS-03**: Variantes: por categoría, países por región, profesiones por área, tipo gramatical

### Contrarreloj

- [ ] **CONT-01**: 60 segundos de opción múltiple: +1 punto por acierto, −2 s por error
- [ ] **CONT-02**: El récord por combinación de categorías y dirección se guarda y se muestra "¡Nuevo récord!" al superarlo

### Audio

- [ ] **AUDI-01**: El botón 🔊 reproduce cada forma hebrea con `speechSynthesis` y voz he-IL
- [ ] **AUDI-02**: En iOS las voces cargan tarde: se escucha `voiceschanged`
- [ ] **AUDI-03**: Si no hay voz he-IL, los 🔊 se ocultan y se avisa una sola vez en Configuración
- [ ] **AUDI-04**: El audio solo se reproduce en respuesta a gestos del usuario, salvo auto-reproducir si ya hubo interacción

### Configuración completa

- [ ] **CONF-01**: Configuración cubre: URL del Apps Script, dirección por defecto, cantidad de preguntas por defecto
- [ ] **CONF-02**: Configuración de audio: activado/desactivado, auto-reproducir, selector de voz he-IL, velocidad 0.6–1.2
- [ ] **CONF-03**: Toggle de mapeo de teclado físico→hebreo
- [ ] **CONF-04**: Apariencia: tema (auto/claro/oscuro) y tamaño del texto hebreo (normal/grande/muy grande)
- [ ] **CONF-05**: Exportar progreso a JSON descargable; importar desde archivo con confirmación
- [ ] **CONF-06**: Borrar progreso con doble confirmación

### PWA y offline

- [ ] **PWA-01**: `manifest.webmanifest` con nombre "Ivrit", display standalone, colores del tema, icon.svg (א blanca sobre azul)
- [ ] **PWA-02**: `sw.js` con caché versionada: index.html y vocab.json network-first; fuentes y estáticos cache-first; la URL del Apps Script nunca se cachea
- [ ] **PWA-03**: Al actualizar el service worker se limpian las cachés viejas
- [ ] **PWA-04**: La app se puede instalar en el celular y funciona offline con lo último que tenía

### Calidad y tests

- [ ] **TEST-01**: `tests.html` con tests en el navegador que muestran ✓/✗ para: normalización de hebreo, corrección tolerante, mapeo de encabezados, generación de ids, Levenshtein
- [ ] **TEST-02**: La app no tiene errores en la consola en Chromium a 390×844 y desktop

## v2 Requirements

### Publicación

- **PUB-01**: GitHub Action (`.github/workflows/sync-vocab.yml`) que actualiza vocab.json automáticamente todos los lunes con `workflow_dispatch`
- **PUB-02**: Script de publicación en GitHub Pages con `gh` CLI

### Mejoras futuras

- **MEJ-01**: Estadísticas de sesión más detalladas (tiempo promedio por respuesta, curva de aprendizaje)
- **MEJ-02**: Modo de práctica de pronunciación con reconocimiento de voz
- **MEJ-03**: Exportar a Anki

## Out of Scope

| Feature | Reason |
|---------|--------|
| Backend propio | Todo el estado en localStorage; Apps Script ya existe |
| Framework JS (React/Vue/etc.) | Spec lo excluye explícitamente; vanilla es suficiente |
| Notificaciones push | Alta complejidad, no es core del valor |
| Cuenta de usuario / sync multi-dispositivo | Fuera del alcance; requeriría backend |
| Gamificación más allá de racha y récord | No está en el spec |
| Anki export en v1 | Complejidad adicional, no es bloqueante |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| DATA-01..06 | Phase 1 | Pending |
| ROUT-01 | Phase 1 | Pending |
| STAT-01..02 | Phase 1 | Pending |
| LAYO-01..06 | Phase 1 | Pending |
| INIC-01..05 | Phase 1 | Pending |
| DICT-01..03 | Phase 1 | Pending |
| SESI-01..05 | Phase 1 | Pending |
| SYNC-01..05 | Phase 2 | Pending |
| FLAS-01..06 | Phase 3 | Pending |
| MCQ-01..04 | Phase 3 | Pending |
| MATC-01..06 | Phase 4 | Pending |
| LEIT-01..05 | Phase 5 | Pending |
| RERR-01..02 | Phase 5 | Pending |
| ESTA-01..03 | Phase 5 | Pending |
| TECL-01..04 | Phase 6 | Pending |
| WRIT-01..05 | Phase 6 | Pending |
| COMP-01 | Phase 6 | Pending |
| CONC-01..02 | Phase 6 | Pending |
| CLAS-01..03 | Phase 7 | Pending |
| CONT-01..02 | Phase 7 | Pending |
| AUDI-01..04 | Phase 8 | Pending |
| CONF-01..06 | Phase 8 | Pending |
| PWA-01..04 | Phase 9 | Pending |
| TEST-01..02 | Phase 9 | Pending |

**Coverage:**
- v1 requirements: 74 total
- Mapped to phases: 74
- Unmapped: 0 ✓

---
*Requirements defined: 2026-10-12*
*Last updated: 2026-10-12 after initial definition*
