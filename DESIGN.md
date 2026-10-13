# Ivrit — Style Guide v1
## Dirección visual: "Levant Light"

La paleta y la tipografía combinan la calidez de los manuscritos mediterráneos con la claridad de la señalética moderna israelí. El azul de la bandera israelí es el color dominante; el fondo es marfil cálido —no blanco puro— para reducir la fatiga en sesiones largas; los acentos son dorados como los techos de Jerusalén. Lo que hace la app inolvidable: las tarjetas de estudio llevan una **א fantasmal** como marca de agua (opacidad 4 %), recordando que cada pantalla es en el fondo un acceso al alef-bet.

---

## 1. Variables CSS

### 1.1 Tema claro

```css
:root {
  /* Fondos y superficies */
  --bg:              #F7F3EC;   /* marfil cálido, evoca papel */
  --surface:         #FFFFFF;
  --surface-raised:  #FFFEF9;
  --surface-hover:   #F0EBE0;

  /* Azul israelí — escala completa */
  --blue-900:  #002D6B;
  --blue-800:  #003F8F;
  --blue-700:  #0052B4;   /* color de la bandera — primario de la app */
  --blue-600:  #1467C8;
  --blue-500:  #3382D8;
  --blue-200:  #A8C8F0;
  --blue-100:  #D6E8FF;
  --blue-50:   #EEF5FF;

  /* Texto */
  --text-primary:    #1A1814;
  --text-secondary:  #5A5347;
  --text-muted:      #9E9489;
  --text-on-primary: #FFFFFF;

  /* Acento: oro mediterráneo */
  --gold:        #C87A0A;
  --gold-light:  #F5C842;

  /* Feedback */
  --green:        #1A7A42;
  --green-light:  #DCFCE7;
  --green-bg:     #F0FBF4;
  --red:          #C42B2B;
  --red-light:    #FFE4E4;
  --red-bg:       #FFF5F5;
  --amber:        #C25A00;
  --amber-light:  #FFECD4;
  --amber-bg:     #FFF8F0;

  /* Bordes y sombras */
  --border:        #E2D9CC;
  --border-focus:  var(--blue-700);
  --shadow-sm:     0 1px 3px rgba(26,24,20,.08), 0 1px 2px rgba(26,24,20,.04);
  --shadow-md:     0 4px 12px rgba(26,24,20,.10), 0 2px 6px rgba(26,24,20,.06);
  --shadow-lg:     0 8px 24px rgba(26,24,20,.12), 0 4px 12px rgba(26,24,20,.08);
  --shadow-flip:   0 16px 40px rgba(26,24,20,.18);

  /* Tipografía */
  --font-display: 'Cormorant Garamond', Georgia, serif;
  --font-body:    'Nunito', 'Helvetica Neue', sans-serif;
  --font-hebrew:  'Heebo', 'Arial Hebrew', sans-serif;

  /* Radio de borde */
  --radius-sm:   6px;
  --radius-md:   12px;
  --radius-lg:   18px;
  --radius-xl:   24px;
  --radius-pill: 999px;

  /* Espaciado (base 4px) */
  --sp-1: 4px;  --sp-2: 8px;  --sp-3: 12px; --sp-4: 16px;
  --sp-5: 20px; --sp-6: 24px; --sp-8: 32px; --sp-10: 40px;

  /* Animaciones */
  --dur-fast:  150ms;
  --dur-base:  250ms;
  --dur-slow:  400ms;
  --ease-out:  cubic-bezier(.22,.68,0,1.2);
  --ease-flip: cubic-bezier(.45,0,.55,1);
}
```

### 1.2 Tema oscuro

```css
[data-theme="dark"],
@media (prefers-color-scheme: dark) {
  :root {
    --bg:             #0D1520;   /* azul medianoche profundo */
    --surface:        #152030;
    --surface-raised: #1C2A3E;
    --surface-hover:  #1F3048;

    --text-primary:    #EDE6D8;
    --text-secondary:  #A09880;
    --text-muted:      #6A614F;

    --border:       #2A3D55;
    --shadow-sm:    0 1px 3px rgba(0,0,0,.30);
    --shadow-md:    0 4px 12px rgba(0,0,0,.40);
    --shadow-lg:    0 8px 24px rgba(0,0,0,.50);
    --shadow-flip:  0 16px 40px rgba(0,0,0,.60);

    --green-bg:   #0A2A18;
    --red-bg:     #2A0A0A;
    --amber-bg:   #2A1800;
    --blue-50:    #0A1828;
    --blue-100:   #102040;
  }
}
```

---

## 2. Tipografía

### 2.1 Google Fonts a importar

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=Nunito:wght@400;600;700&family=Heebo:wght@400;700&display=swap" rel="stylesheet">
```

### 2.2 Escala en español

| Rol           | Fuente              | Tamaño     | Peso | Uso                                          |
|---------------|---------------------|------------|------|----------------------------------------------|
| Display       | Cormorant Garamond  | 2rem–3rem  | 600  | Títulos de pantalla, resultado final de sesión |
| Heading       | Cormorant Garamond  | 1.375rem   | 600  | Nombres de categoría, encabezados de sección |
| Body          | Nunito              | 1rem       | 400  | Instrucciones, texto general                 |
| Label         | Nunito              | 0.875rem   | 600  | Chips, etiquetas, contadores, botones        |
| Micro         | Nunito              | 0.75rem    | 400  | Timestamps, metadatos                        |
| Nav           | Nunito              | 0.6875rem  | 600  | Etiquetas de barra inferior                  |

### 2.3 Hebreo

Siempre **Heebo**. Reglas obligatorias:

```css
.he {
  font-family: var(--font-hebrew);
  font-size: 1.25em;          /* 1.25× el texto español equivalente */
  direction: rtl;
  unicode-bidi: isolate;
  text-align: right;
}

/* Tamaños configurables por el usuario */
:root[data-he-size="normal"]    { --he-scale: 1.25; }
:root[data-he-size="grande"]    { --he-scale: 1.50; }
:root[data-he-size="muy-grande"]{ --he-scale: 1.75; }
```

| Contexto                    | Tamaño                         | Peso |
|-----------------------------|--------------------------------|------|
| Cara de tarjeta             | `calc(var(--he-scale) * 2rem)` | 700  |
| Dorso de tarjeta (formas)   | `calc(var(--he-scale) * 1rem)` | 400  |
| Opción múltiple             | `calc(var(--he-scale) * 0.95rem)` | 400 |
| Teclado hebreo              | 1.125rem (fijo)                | 600  |
| Tabla del diccionario       | `calc(var(--he-scale) * 0.875rem)` | 400 |

### 2.4 Escala de tamaños

```css
--text-xs:      0.75rem;    /* 12px */
--text-sm:      0.875rem;   /* 14px */
--text-base:    1rem;       /* 16px */
--text-lg:      1.125rem;   /* 18px */
--text-xl:      1.25rem;    /* 20px */
--text-2xl:     1.5rem;     /* 24px */
--text-3xl:     1.875rem;   /* 30px */
--text-4xl:     2.25rem;    /* 36px */
--text-display: 3rem;       /* 48px — hebreo en cara de tarjeta */
```

---

## 3. Componentes

### 3.1 Tarjetas (flashcards)

La tarjeta es el corazón de la app. Tiene dos caras con flip 3D real.

**Estructura:**
```
┌─────────────────────────────────────────────┐
│ [chip: Verbos]                    [◉ Caja 3] │
│                                              │
│        ← fondo con א fantasmal →            │
│                                              │
│              להיות                           │  ← cara frontal (hebreo 3rem)
│                                              │
│           · toca para girar ·               │  ← hint, opacity 50%
└─────────────────────────────────────────────┘
```

**Cara frontal:**
- `background: var(--surface)`
- Marca de agua: `<span aria-hidden>א</span>` con `position: absolute; font-size: min(40vw,180px); opacity: .04; color: var(--blue-700); pointer-events: none; user-select: none`
- Borde: `1.5px solid var(--border)`
- Sombra: `var(--shadow-lg)`
- `border-radius: var(--radius-xl)`
- Altura mínima: `260px` en móvil, `300px` en desktop

**Cara trasera:**
- `background: var(--blue-900); color: var(--text-on-primary)`
- Marca de agua: misma א, `opacity: .06; color: #fff`
- Muestra la forma principal en grande, luego la tabla de formas (sustantivo/adjetivo/verbo) y el grupo (países/profesiones) si aplica

**Flip:**
```css
.card-scene { perspective: 900px; }
.card       { transform-style: preserve-3d; transition: transform var(--dur-slow) var(--ease-flip); }
.card.flipped { transform: rotateY(180deg); }
.card-front, .card-back { backface-visibility: hidden; }
.card-back  { transform: rotateY(180deg); }
```

**Indicadores de swipe (overlay):**
- Al deslizar →: `background: rgba(26,122,66,.18); label: "✓ La sé"` — texto verde, esquina derecha
- Al deslizar ←: `background: rgba(196,43,43,.18); label: "✗ No la sé"` — texto rojo, esquina izquierda
- La intensidad del overlay escala con la distancia del swipe

**Botones de calificación bajo la tarjeta:**
```
┌────────────────┐    ┌────────────────┐
│  ← No la sé   │    │   La sé →      │
└────────────────┘    └────────────────┘
```
- Altura: `48px`, `border-radius: var(--radius-pill)`
- "No la sé": `border: 1.5px solid var(--red); color: var(--red); background: transparent` → hover `background: var(--red-bg)`
- "La sé": `background: var(--blue-700); color: #fff` → hover `background: var(--blue-800)`

---

### 3.2 Opciones múltiples

Grid `2×2` en móvil, `1×4` en pantallas muy angostas (<320px):

```
┌──────────────────┐  ┌──────────────────┐
│  ❶  להיות        │  │  ❷  ללכת         │
└──────────────────┘  └──────────────────┘
┌──────────────────┐  ┌──────────────────┐
│  ❸  לדבר         │  │  ❹  לאכול        │
└──────────────────┘  └──────────────────┘
```

**Opción base:**
- `background: var(--surface); border: 1.5px solid var(--border); border-radius: var(--radius-md)`
- `min-height: 64px; padding: var(--sp-4)`
- Número de atajo: chip `12×18px`, fondo `var(--blue-100)`, texto `var(--blue-700)`, `font: var(--text-xs) var(--font-body)`, en la esquina superior izquierda
- Hover/focus: `border-color: var(--blue-600); background: var(--blue-50)`
- Transition: `var(--dur-fast)`

**Post-respuesta:**
- Correcto: `background: var(--green-bg); border-color: var(--green); color: var(--green)` + flash + ✓
- Incorrecto (elegido): `background: var(--red-bg); border-color: var(--red); color: var(--red)` + shake
- Resto de opciones: `opacity: .45; pointer-events: none`

---

### 3.3 Chips de categoría (selector de sesión)

```
[✓ Verbos 87]   [Adjetivos 34]   [× Países 45]
```

- `border-radius: var(--radius-pill); padding: 6px 14px`
- `font: 600 var(--text-sm) var(--font-body)`
- No seleccionado: `border: 1.5px solid var(--border); background: transparent; color: var(--text-secondary)` → hover `background: var(--blue-50)`
- Seleccionado: `background: var(--blue-700); color: #fff; border-color: transparent`
- Cantidad: `opacity: .7` (misma fuente, mismo peso)
- Transición: `var(--dur-fast)` en background y border-color

---

### 3.4 Barra inferior (navegación móvil)

5 ítems: Inicio · Estudiar · Diccionario · Estadísticas · Configuración

```
┌────────────────────────────────────────────────┐
│                                                │  ← border-top 1px --border
│  🏠      📚      🔍      📊      ⚙️          │
│ Inicio Estudiar  Dicc.  Estad.  Config.        │
└────────────────────────────────────────────────┘
```

- `background: rgba(255,255,255,.92); backdrop-filter: blur(12px)` (glassmorphism sutil)
- En tema oscuro: `background: rgba(21,32,48,.92)`
- Altura: `56px + env(safe-area-inset-bottom)` (soporte notch)
- `border-top: 1px solid var(--border)`

**Ítem activo:**
- Ícono y texto: `var(--blue-700)`
- Punto indicador: círculo de `4px` debajo del ícono, `background: var(--blue-700)`
- Transición del punto: `width 200ms ease`, parte de `0px` a `4px`

**Ítem inactivo:** `color: var(--text-muted)` → hover `var(--text-secondary)`

**Íconos:** SVG inline, `24×24px`, `stroke-width: 1.75`  
Touch target: cada ítem `min-width: 44px; min-height: 44px`

---

### 3.5 Teclado hebreo en pantalla

Layout estándar israelí SI-1452, lectura de izquierda a derecha visualmente pero el hebreo está escrito normalmente.

```
┌───┬───┬───┬───┬───┬───┬───┬───┐
│ ק │ ר │ א │ ט │ ו │ ן │ ם │ פ │     fila 1 (8 teclas)
├───┬───┬───┬───┬───┬───┬───┬───┬───┬───┤
│ ש │ ד │ ג │ כ │ ע │ י │ ח │ ל │ ך │ ף │  fila 2 (10 teclas)
├───┬───┬───┬───┬───┬───┬───┬───┬───┤
│ ז │ ס │ ב │ ה │ נ │ מ │ צ │ ת │ ץ │    fila 3 (9 teclas)
├────┬───────────────────────┬────┬────┤
│ ׳·─ │       espacio         │ ⌫  │ ✓  │  fila 4
└────┴───────────────────────┴────┴────┘
```

**Tecla regular:**
```css
.kbd-key {
  background: var(--surface);
  border: 1px solid var(--border);
  border-bottom: 2px solid var(--border);  /* efecto físico */
  border-radius: var(--radius-sm);
  font: 600 1.125rem var(--font-hebrew);
  min-width: 30px; min-height: 40px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  user-select: none;
  transition: background var(--dur-fast);
}
.kbd-key:active {
  transform: translateY(1px);
  border-bottom-width: 1px;
}
```

**Tecla ⌫ (borrar):** fondo `var(--blue-50)`, ícono de barra con flecha
**Tecla ✓ (confirmar):** fondo `var(--blue-700)`, ícono ✓ blanco, `font-weight: 700`
**Tecla Espacio:** `flex: 1` ocupa ~40% del ancho de la fila
**Teclas especiales ׳ · ─:** compactas, `font-size: 0.875rem`

**Fondo del teclado:**
- `background: var(--surface-raised); border-top: 1px solid var(--border); padding: var(--sp-2) var(--sp-3) calc(var(--sp-3) + env(safe-area-inset-bottom))`

---

### 3.6 Feedback de acierto / error / casi

**✓ Acierto:**
- Flash verde sobre el contenedor: `animation: flash-green 350ms ease-out`
- Ícono ✓ grande: `scale(0)→scale(1.15)→scale(1)` en 280ms, color `var(--green)`
- Chip: fondo `var(--green-bg)`, texto `var(--green)`, border `var(--green)`
- Texto: "¡Correcto!" (Nunito 600)
- Toast de progreso Leitner si la palabra sube de caja: "Caja 3 →" aparece 400ms después

**✗ Error:**
- Shake: `animation: shake 300ms ease-out` en el contenedor de pregunta
- Flash rojo leve: `animation: flash-red 300ms ease-out`
- Chip: fondo `var(--red-bg)`, texto `var(--red)`, muestra la respuesta correcta

**~ Casi (Levenshtein 1):**
- Chip: fondo `var(--amber-bg)`, texto `var(--amber)`, borde `var(--amber-light)`
- Texto: "Casi — " + respuesta correcta con las letras distintas en `<mark style="background: var(--amber-light); border-bottom: 2px dashed var(--amber)">`
- No cuenta como acierto, pero muestra aviso: "Ojo con la letra final" si es el caso

```css
@keyframes shake {
  0%,100% { transform: translateX(0); }
  15%     { transform: translateX(-7px); }
  30%     { transform: translateX(6px); }
  45%     { transform: translateX(-5px); }
  60%     { transform: translateX(4px); }
  75%     { transform: translateX(-2px); }
  90%     { transform: translateX(2px); }
}
@keyframes flash-green {
  0%,100% { background: transparent; }
  40%     { background: rgba(26,122,66,.12); }
}
@keyframes flash-red {
  0%,100% { background: transparent; }
  40%     { background: rgba(196,43,43,.10); }
}
```

---

### 3.7 Barra de progreso de sesión

Thin bar fija en el tope de la pantalla de ejercicio:

```css
.session-progress {
  position: fixed; top: 0; left: 0; right: 0;
  height: 3px;
  background: var(--border);
  z-index: 100;
}
.session-progress-fill {
  height: 100%;
  background: var(--blue-700);
  border-radius: 0 2px 2px 0;
  transition: width 300ms var(--ease-out);
}
```

---

### 3.8 Chips de caja Leitner (indicador de progreso)

Pequeños badges junto a cada palabra en el Diccionario y en las tarjetas:

| Caja | Color bg        | Color texto     | Significado    |
|------|-----------------|-----------------|----------------|
| 0    | `--border`      | `--text-muted`  | Nueva          |
| 1    | `#FFE4E4`       | `--red`         | Difícil        |
| 2    | `--amber-light` | `--amber`       | Aprendiendo    |
| 3    | `--blue-100`    | `--blue-700`    | Progresando    |
| 4    | `--green-light` | `--green`       | Bien           |
| 5    | `--gold-light`  | `--gold`        | Dominada ★     |

CSS: `border-radius: var(--radius-sm); padding: 2px 7px; font: 600 var(--text-xs) var(--font-body)`

---

### 3.9 Modales y toasts

**Modal:**
- Overlay: `background: rgba(26,24,20,.45); backdrop-filter: blur(2px)`
- Panel: `background: var(--surface); border-radius: var(--radius-lg); box-shadow: var(--shadow-lg); max-width: 400px; width: calc(100% - 32px); padding: var(--sp-6)`
- Entrada: `scale(.96)→scale(1) + opacity 0→1`, 250ms

**Toast:**
- `position: fixed; bottom: calc(64px + var(--sp-3)); left: 50%; transform: translateX(-50%)`
- `background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg)`
- `box-shadow: var(--shadow-lg); padding: var(--sp-3) var(--sp-5); max-width: 360px`
- Entrada: `translateY(12px)→0 + opacity 0→1`, 250ms
- Salida automática: 3 s → `translateY(8px) + opacity 1→0`, 200ms
- Dismiss con swipe hacia abajo

---

## 4. Transiciones de pantalla (hash routing)

```css
/* pantalla saliente */
.page-leave {
  animation: page-out 200ms ease-in forwards;
}
/* pantalla entrante */
.page-enter {
  animation: page-in 250ms var(--ease-out) 80ms both;
}

@keyframes page-out {
  to { opacity: 0; transform: translateY(-6px); }
}
@keyframes page-in {
  from { opacity: 0; transform: translateY(10px); }
}
```

`prefers-reduced-motion`: reemplazar con `opacity`-only (sin transform).

---

## 5. Layout

### Estructura global

```
┌──────────────────────────────────────┐
│ [fixed top bar — solo en desktop]    │  48px, solo en ≥600px
├──────────────────────────────────────┤
│                                      │
│   [contenido de pantalla]            │  scroll, padding-bottom: 70px (móvil)
│   max-width: 720px; margin: 0 auto   │
│                                      │
└──────────────────────────────────────┘
│ [fixed bottom nav — solo móvil]      │  56px + safe-area
```

- Padding lateral base: `var(--sp-4)` (16px) en móvil, `var(--sp-6)` (24px) en desktop
- Gap entre cards del grid de modos: `var(--sp-3)` (12px)
- Sección Inicio — grid de modos: 2 columnas en móvil, 3 en desktop

### Grid de modos (pantalla Inicio)

Cada modo: tarjeta compacta con ícono SVG grande, nombre (Cormorant 600), descripción corta (Nunito 0.875rem, `--text-secondary`).

---

## 6. Accesibilidad

- Contraste mínimo AA: texto regular ≥ 4.5:1, texto grande ≥ 3:1  
- Foco visible: `outline: 2px solid var(--blue-600); outline-offset: 2px; border-radius: inherit`  
- Todos los botones de ícono: `aria-label` en español  
- Todo nodo con hebreo: `lang="he" dir="rtl"`  
- Touch targets: `min-width: 44px; min-height: 44px`  
- `prefers-reduced-motion`: todas las animaciones a solo `opacity`, sin `transform`

---

## 7. Assets

### icon.svg

Letra **א** blanca sobre fondo `#0052B4`, formato cuadrado 512×512, esquinas redondeadas 20 % del lado.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="102" fill="#0052B4"/>
  <text x="256" y="360" font-family="Heebo,sans-serif" font-size="320"
        font-weight="700" fill="white" text-anchor="middle">א</text>
</svg>
```

### manifest.webmanifest

```json
{
  "name": "Ivrit",
  "short_name": "Ivrit",
  "description": "Estudia vocabulario hebreo",
  "start_url": "./",
  "display": "standalone",
  "background_color": "#F7F3EC",
  "theme_color": "#0052B4",
  "icons": [
    { "src": "icon.svg", "sizes": "any", "type": "image/svg+xml", "purpose": "any maskable" }
  ]
}
```

---

## 8. Decisiones de diseño y razones

| Decisión | Razón |
|---|---|
| Fondo marfil `#F7F3EC` en lugar de blanco puro | Reduce fatiga en sesiones largas; da calidez coherente con el tema mediterráneo |
| Cormorant Garamond solo en displays, Nunito en UI | Cormorant da carácter pero es poco legible en small; Nunito es excepcional en pantallas táctiles |
| Marca de agua א al 4 % de opacidad | Inmediatamente identifica el contexto sin distraer; no hay otra app que lo haga |
| Cara posterior de tarjeta en azul `--blue-900` | Contraste visual claro entre "pregunta" y "respuesta"; el flip se siente como revelar algo |
| Chip de caja Leitner con gold para caja 5 | Recompensa visual clara; el dorado connota logro sin ser estridente |
| Teclado con sombra inferior en teclas (border-bottom: 2px) | Feedback físico sin JavaScript; se siente como un teclado real |
| Glassmorphism solo en barra inferior | Dosis única de modernidad; el resto de la UI es plana y legible |
