# Phase 4: Unir con flechas - Context

**Gathered:** 2026-10-13
**Status:** Ready for planning

<domain>
## Phase Boundary

Nuevo modo de estudio: matching de 6 pares por ronda con líneas SVG, interacción por tap-en-dos-pasos (sin drag), tres variantes de vocabulario, avance en rondas con resumen liviano entre ellas y `renderResultado` al terminar la sesión. Actualización Leitner solo para la variante ES↔HE.

</domain>

<decisions>
## Implementation Decisions

### Modelo de interacción
- **D-01:** **Tap-tap únicamente — sin drag.** Toco un elemento (queda resaltado), toco uno de la otra columna → se dibuja una línea recta entre los dos. No hay Pointer Events de drag ni `pointermove`. Correcto → línea verde + ambos elementos se atenúan. Incorrecto → línea + elementos en rojo + shake ~400ms → línea desaparece + deselección + error contado.
- **D-02:** Tocar el elemento ya seleccionado lo deselecciona. Tocar otro elemento de la misma columna cambia la selección (cancela el anterior, resalta el nuevo). No hay estado "confirmado" intermedio.

### SVG / líneas
- **D-03:** Línea recta entre los centros de los dos elementos (no curva bezier). Simple y suficiente dado el modelo tap-tap.
- **D-04:** El SVG overlay debe recalcularse en resize y cambio de orientación (ResizeObserver o `window.addEventListener('resize')`). No hay scroll lateral en el layout de dos columnas, pero si el viewport cambia las posiciones cambian.

### Variantes en el selector de sesión
- **D-05:** Las tres variantes se eligen en `renderSesion`, igual que otros modos:
  - **ES↔HE** — vocabulary translation (dirección estándar)
  - **singular↔plural** — solo palabras con plural distinto al singular
  - **masculino↔femenino** — solo adjetivos y profesiones
- **D-06:** El selector de sesión debe mostrar las variantes solo cuando el modo activo es "unir". Las otras opciones de sesión (categorías, cantidad) siguen aplicando; la opción "dirección" existente no aplica a unir (se reemplaza con el selector de variante).

### Flujo multi-ronda
- **D-07:** Cada ronda = 6 pares tomados del `App.session.words[]` actual (batch de 6, sin repetición).
- **D-08:** Al terminar cada ronda: resumen liviano **inline** dentro de la pantalla (tiempo + errores) con botón "Siguiente ronda". No navegar a otra pantalla entre rondas.
- **D-09:** Cuando se agotan todas las palabras de la sesión → usar el `renderResultado` existente (igual que tarjetas/MCQ). El botón "Repetir las que no sabía" funciona igual.

### Progreso Leitner
- **D-10:** **Solo la variante ES↔HE actualiza las cajas Leitner** con `App.ui.updateProgress(wordId, correct)`.
- **D-11:** Las variantes singular↔plural y masculino↔femenino **no tocan las cajas**. Solo registran la estadística de error/acierto para uso futuro (Phase 5 estadísticas). No bloquear ni lanzar error si `wordId` no tiene caja definida.

### Claude's Discretion
- Posicionamiento exacto del SVG overlay (fixed vs. absolute — lo que mejor funcione con el layout de columnas)
- Animación del shake (CSS `@keyframes` inline o clase toggle)
- Cómo mostrar el contador de tiempo por ronda (simple `Date.now()` delta)
- Distribución de columnas (flexbox o grid)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Especificación del modo
- `SPEC.md §4.5` — descripción completa de Unir con flechas (rondas, interacción, variantes, resumen)
- `SPEC.md §10` — orden de trabajo; confirma que esta fase es la #4

### Sistema de diseño
- `DESIGN.md` — paleta, variables CSS, componentes — respetar al diseñar el layout de columnas y estados visuales
- `DESIGN.md §1` — variables CSS (colores de estado: verde para correcto, rojo para error ya definidos)

### Código existente crítico
- `index.html` — toda la app; ver `App.session`, `App.ui.updateProgress`, `App.ui.renderResultado`, y el stub `'unir'` en el router (línea ~1494)

### Datos
- `vocab.json` — para entender qué palabras tienen plural distinto (campo `pl`) y qué palabras son adjetivos/profesiones (kind `gendered`)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `App.session.start(mode)` — filtra vocab, shuffles, slices a quantity; listo para usar; produce `App.session.words[]`
- `App.ui.updateProgress(wordId, correct)` — actualización Leitner; llamar solo para variante ES↔HE
- `App.ui.renderResultado(el)` — pantalla de resultado de sesión con lista de errores y botón "Repetir"; reutilizar al agotar palabras
- `App.session.results[]` — array de `{wordId, correct}` que renderResultado consume; poblar igual que tarjetas/MCQ

### Established Patterns
- El router llama a `App.ui.renderXxx(screenEl)` — la función nueva debe seguir esa firma: `App.ui.renderUnir(el)`
- Los resultados de sesión se acumulan en `App.session.results[]`; `renderResultado` lo lee directamente
- CSS inline via `element.style.cssText` para componentes dinámicos (patrón establecido en tarjetas y MCQ)
- `App.state.progress` en localStorage `ivrit.v1.progress`; `updateProgress` ya maneja el try/catch

### Integration Points
- Router: cambiar el stub `'unir': () => App.ui.renderUnir(screenEl)` por la función real
- Session selector (`renderSesion`): agregar selector de variante para el modo unir; la propiedad puede ser `App.session._matchVariant`
- `App.session.start('unir')` debe inicializar con la variante correcta filtrando palabras válidas (sg↔pl: solo con `pl` distinto; masc↔fem: solo `gendered`)

</code_context>

<specifics>
## Specific Ideas

- El shake de error puede ser `animation: shake 0.4s` con `@keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }` — simple, no necesita JS
- El timer de ronda: `const t0 = Date.now()` al arrancar la ronda, `((Date.now()-t0)/1000).toFixed(1) + 's'` al mostrar el resumen inline

</specifics>

<deferred>
## Deferred Ideas

- Drag con línea en tiempo real (Pointer Events drag) — el usuario lo descartó explícitamente; no reimplementar en fases futuras a menos que sea pedido
- Cursor/touch feedback animado durante drag — no aplica sin drag

</deferred>

---

*Phase: 04-unir-con-flechas*
*Context gathered: 2026-10-13*
