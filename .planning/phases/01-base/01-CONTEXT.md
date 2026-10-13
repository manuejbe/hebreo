# Phase 1: Base - Context

**Gathered:** 2026-10-12
**Status:** Ready for planning

<domain>
## Phase Boundary

Infraestructura base de la app: carga y normalización de vocab.json, hash router, layout visual completo (DESIGN.md "Levant Light"), pantalla Inicio con resumen y grilla de modos, Diccionario con búsqueda instantánea, y Selector de sesión. Todo en un único index.html con CSS y JS inline. Sin código previo — greenfield.

</domain>

<decisions>
## Implementation Decisions

### Arquitectura JS
- **App object**: `const App = {}` con sub-módulos: `App.data`, `App.state`, `App.router`, `App.ui`
- **Ciclo de vida**: `App.init()` orquesta en orden: load → normalize → router → render
- **Event listeners**: delegación en `document` para listas dinámicas; listeners directos para elementos estáticos (nav, toggles)
- **Errores de localStorage**: try/catch por operación + flag `App.state.storageOk`; si falla, modo in-memory silencioso sin interrumpir la app

### Carga y normalización de datos
- **Normalización**: eager al cargar (una vez al inicio); resultado en `App.state.vocab[]` en memoria — nunca re-normalizar
- **localStorage**: solo guarda el JSON crudo (`ivrit.v1.vocabCache`); el vocab normalizado vive solo en memoria
- **Error al cargar vocab.json**: toast "No se pudo cargar el vocabulario" + intentar caché de localStorage → si tampoco hay nada, pantalla de error mínima
- **Estado de carga**: sin spinner para vocab.json local (<50ms); spinner solo para fetches externos (Apps Script en Phase 2)

### Grilla de modos (Inicio)
- **Visibilidad**: mostrar los 10 modos desde Phase 1 — grilla completa da sensación de app terminada
- **Modos no disponibles**: `opacity: 0.45; pointer-events: none` — griseados sin texto extra; se "encienden" solos al implementarse en fases posteriores
- **Grid layout**: 2 columnas en móvil, 3 columnas en desktop (≥600px)
- **Click en modo no disponible**: silencioso — no registra el tap ni muestra mensaje

### Diccionario UX
- **Estado inicial**: categorías colapsadas (accordion) — con 17 categorías es lo correcto
- **Búsqueda**: filter-as-you-type sin debounce (vocab en memoria, instantáneo)
- **Resultados de búsqueda**: lista flat agrupada por encabezado de categoría (no tabla completa)
- **Sin resultados**: mensaje `Sin resultados para "{query}"` con botón/link para limpiar búsqueda

### Claude's Discretion
- Estructura interna del HTML (orden de secciones `<style>` y `<script>`)
- Nombres exactos de funciones y variables dentro de los módulos `App.*`
- Animaciones de transición de pantalla (dentro de los parámetros de DESIGN.md)
- Implementación del Selector de sesión (siguiendo SPEC §4.2 y REQUIREMENTS SESI-01..05)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Especificación completa
- `SPEC.md` — fuente de verdad para todos los requisitos; §2 mapeo de datos, §4.1–4.2 Inicio y Selector, §7 diseño
- `SPEC.md §2.2` — mapeo de encabezados hebreos → campos normalizados (OBLIGATORIO para DATA-01..06)
- `SPEC.md §2.3` — determinación del tipo `kind` por campos presentes
- `SPEC.md §2.4` — particularidades: "—" → null, plural=singular, variantes por `,`/`/`

### Sistema de diseño
- `DESIGN.md` — sistema de diseño completo "Levant Light": paleta CSS, tipografías, todos los componentes
- `DESIGN.md §1` — variables CSS (copiar tal cual al `:root` de index.html)
- `DESIGN.md §3.4` — barra inferior (nav móvil)
- `DESIGN.md §3.3` — chips de categoría (selector de sesión)

### Datos reales
- `vocab.json` — 17 categorías, ~735 palabras — leer para entender la estructura real de los datos

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `vocab.json`: datos reales listos para usar como fuente de verdad al implementar la normalización
- `apps-script/Code.gs`: referencia del formato exacto de la respuesta del endpoint (mismo formato que vocab.json)

### Established Patterns
- Greenfield — no hay patrones establecidos; esta fase los define todos
- La normalización de encabezados debe ser por texto (no por posición) — ver SPEC §2.2

### Integration Points
- Phase 2 (Sync) se conecta a `App.data` y `App.state.vocabCache`
- Phases 3+ consumen `App.state.vocab[]` y el sistema de routing con `#/[pantalla]`
- El módulo `App.state.progress` se expande en Phase 5 (Leitner) — diseñarlo extensible

</code_context>

<specifics>
## Specific Ideas

- El hash routing debe soportar parámetros opcionales para el modo de sesión, ej. `#/tarjetas?cat=Verbos`
- La marca de agua א en las tarjetas (DESIGN.md) también puede usarse como fondo decorativo sutil en la pantalla Inicio
- Las barras de progreso por categoría en Inicio usan datos reales de `App.state.progress` — en Phase 1 todas las palabras estarán en caja 0, lo cual está bien (se verá la barra vacía)

</specifics>

<deferred>
## Deferred Ideas

- Animaciones de transición entre pantallas más elaboradas — Phase 9 (pulido visual)
- Soporte para múltiples idiomas de interfaz — fuera del scope del proyecto
- Vista "tabla completa" expandida en el Diccionario con todas las columnas — Claude puede agregar si el espacio lo permite

</deferred>

---
*Phase: 01-base*
*Context gathered: 2026-10-12*
*Mode: Smart discuss (autonomous)*
