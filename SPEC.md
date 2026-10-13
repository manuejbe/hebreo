# Ivrit — app para estudiar vocabulario hebreo

Especificación para construir una web app estática, en español, para estudiar el vocabulario hebreo de mi Google Doc "Vocabulario hebreo". Se hostea en GitHub Pages y se usa sobre todo desde el celular.

## Configuración

```
APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxmqmnYsJrX-ux2YE1TFzfwag76I1VDibe5hewXXa8O8sODnY6qjCdcYlg5dLgE7K2s/exec"
REPO_NAME       = "hebreo"
```

- `APPS_SCRIPT_URL` es la URL de la Aplicación web de Google Apps Script (código en `apps-script/Code.gs`, ya implementada por mí). Un GET devuelve el JSON del doc actualizado, con CORS habilitado.
- Si la URL no está configurada, la app funciona igual con `vocab.json` y el botón de sincronizar muestra cómo configurarla.

---

## 1. Principios técnicos

- **Sin frameworks ni build.** HTML + CSS + JavaScript vanilla (ES2020+). Nada de npm en la app final.
- **Archivos del sitio:**
  - `index.html`: toda la app, con CSS y JS adentro, en secciones bien comentadas.
  - `vocab.json`: datos de respaldo. Ya existe, no lo borres.
  - `manifest.webmanifest`, `sw.js` e `icon.svg`, para la PWA.
  - `README.md`.
- **Lo único externo es Google Fonts.** Heebo para hebreo, Inter o system-ui para español, siempre con fallback.
- **Rutas con hash** (`#/inicio`, `#/tarjetas`, `#/opcion-multiple`, etc.), para que funcione el botón "atrás" del celular.
- **Mobile-first.** Tiene que verse perfecto a 360px de ancho y escalar bien a desktop, con botones táctiles de 44px como mínimo.
- **Modo oscuro** automático (`prefers-color-scheme`) más un selector manual: auto, claro u oscuro.
- **Todo el estado vive en `localStorage`** (progreso, configuración, caché del vocabulario). Envolver lecturas y escrituras en try/catch.
- **Pruebas:** con un servidor local (`python3 -m http.server`), porque `fetch` de `vocab.json` no anda con `file://`.

## 2. Datos

### 2.1 Formato crudo (`vocab.json` y respuesta del Apps Script; es el mismo formato)

```json
{
  "source": "google-docs",
  "docId": "...",
  "updated": "ISO date",
  "categories": [
    { "name": "Verbos", "headers": ["תרגום","פועל"], "rows": [["ser, estar","להיות"], ...] }
  ]
}
```

Cada categoría es una pestaña del doc. La columna 0 siempre es el español. Puede haber dos entradas con el mismo `name`: en ese caso se unen.

### 2.2 Mapeo de encabezados → campos normalizados

El mapeo se hace **por el texto del encabezado, no por la posición**, porque las columnas pueden cambiar de orden.

| Encabezado | Campo | Significado |
|---|---|---|
| תרגום | `es` | traducción al español |
| יחיד | `msg` | singular (masculino si la palabra tiene género) |
| רבים | `mpl` | plural (masculino si tiene género) |
| יחידה | `fsg` | femenino singular |
| רבות | `fpl` | femenino plural |
| פועל | `msg` | verbo en infinitivo (forma principal) |
| ביטוי | `msg` | expresión o conector (forma principal) |
| מדינה | `msg` | nombre del país |
| אזור | `group` | región del país (en hebreo, ej. אירופה, המזרח התיכון) |
| תחום | `group` | área de la profesión (en hebreo, ej. הנדסה) |

Si aparece un encabezado desconocido, se guarda en `extra[encabezado]` y se muestra en la tarjeta. No tiene que romper nada.

### 2.3 Tipos de palabra (`kind`), según los campos presentes

| `kind` | Condición | Categorías |
|---|---|---|
| `verb` | tiene פועל | Verbos |
| `expr` | tiene ביטוי | Conectores y expresiones |
| `country` | tiene מדינה | Países |
| `gendered` | tiene יחידה o רבות | Adjetivos, Profesiones |
| `noun` | el resto (יחיד + רבים) | Transporte, cuerpo, frutas, formas, lugares, muebles, animales, clima, ropa, sustantivos, tecnología, direcciones |

### 2.4 Particularidades de los datos (importante)

- **"—"** en una celda significa que no existe esa forma (ej. sin plural común): se guarda como `null`. Los ejercicios nunca preguntan una forma `null`.
- **Palabras que solo existen en plural** repiten la misma forma en יחיד y רבים. No hay que preguntar "¿cuál es el plural?" si es igual al singular.
- **El español puede traer varias traducciones o aclaraciones:** `"ser, estar"`, `"ingeniero/a"`, `"tiempo (meteorológico)"`. Para mostrar se usa el texto completo. Para corregir respuestas escritas:
  - se separa por `,` y `;`;
  - `x/a` expande a las dos formas (ingeniero, ingeniera);
  - lo que va entre paréntesis es opcional.
- **El hebreo puede tener:**
  - maqaf `־` (ej. `בנוגע ל־`);
  - geresh `׳` (ej. `צ׳ילה`), que puede venir escrito como `'` o `’`;
  - variantes separadas por `,` o `/`.
- **Id estable de cada palabra:** `slug(categoría) + "::" + es`. Si se repite dentro de la categoría, se agrega `"::" + msg`. Así, si corrijo un error de tipeo en el hebreo, no se pierde el progreso.
- **Tamaño hoy:** 17 categorías y unas 735 palabras. La app tiene que andar fluida con varios miles.

## 3. Sincronización con Google Docs

- **Botón "🔄 Sincronizar con Google Docs"** en Inicio y en Configuración.
- **Al tocarlo:**
  1. Hace `fetch(APPS_SCRIPT_URL)` como GET simple, sin headers personalizados (para evitar el preflight de CORS).
  2. Muestra un spinner y aplica un timeout de 20 s.
  3. Valida la estructura de la respuesta.
  4. Normaliza los datos y compara contra el vocabulario actual por id: **nuevas**, **modificadas** (mismo id, cambian formas o grupo) y **eliminadas**.
  5. Guarda el JSON crudo y la fecha en `localStorage` como caché del vocabulario.
  6. Muestra un resumen ("✅ 12 palabras nuevas · 3 modificadas · 1 eliminada"), con la lista desplegable de las nuevas y un botón "Estudiar las nuevas".
- **Las palabras nuevas** quedan marcadas como "nueva" (caja 0) y aparecen en el filtro "Nuevas".
- **Nunca se borra progreso.** Si una palabra se elimina del doc, deja de aparecer en los ejercicios, pero su progreso queda guardado por si vuelve.
- **Al iniciar la app:** usa la caché de `localStorage` si su `updated` es más reciente que el de `vocab.json`; si no, usa `vocab.json`.
- **Errores claros:** "sin conexión", "la URL no responde" y "el formato no es válido" se informan, y la app sigue funcionando con lo que tenía.
- **Inicio muestra** "Última sincronización: hace X" y el total de palabras.
- **La URL se puede pisar desde Configuración** (campo editable guardado en `localStorage`). Si no, se usa la constante de arriba.

## 4. Pantallas y modos

### 4.1 Inicio

- **Resumen:** total de palabras, dominadas (caja 5), para repasar hoy, nuevas y racha de días.
- **Botón grande "Repaso del día"** (repetición espaciada, ver §5).
- **Grilla de modos** con ícono, nombre y descripción corta.
- **Progreso por categoría:** una barra apilada por caja (0 a 5) en cada categoría.
- Sincronización y fecha de la última.

### 4.2 Selector de sesión (antes de cada modo)

- **Categorías:** chips con multi-selección y cantidad de palabras, más "Todas" y "Ninguna". La última selección se recuerda.
- **Filtro:** todas, nuevas, difíciles (caja ≤ 2, o con errores en los últimos 7 días) o para repasar hoy.
- **Dirección:** ES→HE, HE→ES o mezclada (en los modos donde aplica).
- **Cantidad de preguntas:** 10, 20, 30 o todas.
- **Botón "Empezar".** Si el filtro deja menos palabras de las necesarias, se avisa.

### 4.3 Tarjetas (flashcards)

- **Frente:** la palabra en la dirección elegida. **Dorso:** traducción más todas las formas, según el tipo:
  - sustantivos: singular y plural;
  - adjetivos y profesiones: tabla 2×2 con masc/fem por sing/plural;
  - países y profesiones: el grupo (región o área);
  - todos: botón 🔊 por cada forma hebrea.
- **Interacción:** se gira con tap o espacio, con animación 3D.
- **Calificación:**
  - en el celular, deslizar a la derecha es "La sé" y a la izquierda "No la sé";
  - en desktop, flechas → y ←;
  - además hay botones visibles.
- **Pantalla final:** resultado de la sesión y botón "Repetir las que no sabía".

### 4.4 Opción múltiple

- **Pregunta y opciones:** 4 opciones en la dirección elegida.
- **Distractores:** siempre de la misma categoría y el mismo `kind`. En Países, preferir la misma región para que sea más difícil. Nunca puede haber dos opciones con el mismo texto.
- **Al responder:**
  - se marca en verde la correcta y en rojo la elegida si estaba mal;
  - se muestran todas las formas de la palabra;
  - el botón "Siguiente" se activa con Enter.
- **Atajos de teclado:** 1–4.
- **Barra de progreso** de la sesión y resultado final, con lista de errores.

### 4.5 Unir con flechas

- **Rondas de 6 pares:** español a la izquierda y hebreo a la derecha, cada columna mezclada.
- **Cómo se une:**
  - tocás un elemento y después uno de la otra columna, o
  - arrastrás desde uno hasta otro (Pointer Events, que anda con mouse y touch).
- **Línea:** se dibuja en un `<svg>` superpuesto, como curva con punta de flecha.
- **Al soltar:**
  - si es correcta, la línea queda fija en verde y los dos elementos se atenúan;
  - si es incorrecta, la línea parpadea en rojo, desaparece y cuenta el error.
- **Las líneas se recalculan** con resize, scroll y cambio de orientación.
- **Variantes** en el selector de sesión:
  - ES ↔ HE;
  - singular ↔ plural (solo palabras con plural distinto);
  - masculino ↔ femenino (adjetivos y profesiones).
- **Al terminar cada ronda:** tiempo y errores, y botón "Siguiente ronda".

### 4.6 Completar la forma

- **Pregunta:** se da una forma y se pide otra. Ejemplos:
  - "יחיד: כיסא → רבים: ?";
  - "יחיד: גדול → יחידה: ?";
  - "יחידה: מהנדסת → רבות: ?".
- **Solo pares válidos:** no se pregunta un destino `null` ni un destino igual al origen.
- **Dos sub-modos:**
  - con opciones: los distractores son las otras formas de la misma palabra más formas parecidas de otras palabras;
  - escribiendo con el teclado hebreo (§4.8).

### 4.7 Concordancia (adjetivos y profesiones)

- **Formato:** frase corta con pronombre y la palabra en español entre paréntesis, a completar con la forma correcta. Ejemplos:
  - "הן ___ (grande)" → `גדולות`;
  - "היא ___ (ingeniero/a)" → `מהנדסת`.
- **Pronombres:** הוא → msg · היא → fsg · הם → mpl · הן → fpl. Si la forma pedida es `null`, se usa otro pronombre.
- **Opciones:** las 4 formas de la palabra (o escribir).
- **Al responder:** se muestra la tabla 2×2 con la correcta resaltada.

### 4.8 Escribir la respuesta + teclado hebreo en pantalla

- **Pregunta:** se muestra el español (o el hebreo, en dirección HE→ES) y hay que escribir la traducción.
- **Teclado hebreo en pantalla** con el layout estándar israelí (SI-1452):
  - fila 1: ק ר א ט ו ן ם פ
  - fila 2: ש ד ג כ ע י ח ל ך ף
  - fila 3: ז ס ב ה נ מ צ ת ץ
  - fila 4: ׳ · ־ · espacio grande · ⌫ borrar · ✓ comprobar
- **Detalles del teclado:**
  - en el celular, el input usa `inputmode="none"` para que no aparezca el teclado del sistema (con un botón para alternar si quiero usar el teclado hebreo del sistema);
  - las teclas son grandes y dan feedback visual al tocarlas;
  - tiene un botón para mostrarlo u ocultarlo.
- **Teclado físico → hebreo** (toggle en Configuración, activado por defecto en desktop): si escribo en un teclado QWERTY en inglés o español, las teclas se traducen a hebreo con el mapeo SI-1452:
  - fila superior: e→ק r→ר t→א y→ט u→ו i→ן o→ם p→פ;
  - fila media: a→ש s→ד d→ג f→כ g→ע h→י j→ח k→ל l→ך ;→ף (y ñ→ף);
  - fila inferior: z→ז x→ס c→ב v→ה b→נ n→מ m→צ ,→ת .→ץ;
  - w→׳.
  - Si el sistema ya escribe en hebreo, no se toca nada.
- **Corrección tolerante (hebreo).** Se normalizan la respuesta y cada variante válida:
  - sacar niqqud y te'amim (U+0591–U+05C7);
  - trim y colapsar espacios;
  - unificar ׳ ' ’ y unificar ־ y -.
  - Se acepta cualquier variante de la celda.
- **Letras finales:** si la única diferencia es una letra final mal usada (ם/מ, ן/נ, ץ/צ, ף/פ, ך/כ), cuenta como correcta con el aviso "Ojo con la letra final".
- **Casi:** si hay distancia de Levenshtein 1, es incorrecta pero se muestra "Casi", con la respuesta correcta y las letras distintas resaltadas.
- **Corrección en español (HE→ES):**
  - minúsculas y sin acentos ni diéresis;
  - acepta cualquiera de las traducciones separadas;
  - paréntesis opcionales;
  - x/a expandido.
- **Botones:** "No sé" (muestra la respuesta y cuenta como error) y "Pista" (muestra la primera letra y la cantidad de letras).

### 4.9 Clasificar

- **Mecánica:** aparecen de 8 a 12 palabras mezcladas y hay que llevarlas al grupo correcto (de 3 a 4 grupos visibles).
- **Interacción:** arrastrar, o en el celular tocar la palabra y después el grupo.
- **Variantes:**
  - por categoría (se mezclan 3–4 categorías elegidas);
  - Países por región (אזור);
  - Profesiones por área (תחום);
  - sustantivo/verbo/adjetivo.
- **Al soltar:** si es correcta queda en el grupo en verde; si no, rebota con animación roja y cuenta el error.

### 4.10 Contrarreloj

- **60 segundos de opción múltiple:** +1 por acierto y −2 s por error. Los distractores son los mismos de §4.4.
- **Récord** por combinación de categorías y dirección, guardado en `localStorage`. Se muestra "¡Nuevo récord!".

### 4.11 Repaso de errores

- **Palabras incluidas:** las que fallé en los últimos 7 días o que están en caja 1.
- **Formato:** mezcla opción múltiple y escribir.
- **Salida de la lista:** una palabra sale cuando la acierto 2 veces seguidas.

### 4.12 Diccionario / Explorar

- **Buscador instantáneo** en español o hebreo. Ignora acentos y niqqud, y busca en todas las formas.
- **Vista por categoría:** tabla con todas las formas, 🔊 y la caja de progreso de cada palabra.
- **Hebreo en celdas** con `dir="rtl"` y alineado a la derecha; español a la izquierda.

### 4.13 Estadísticas

- **Generales:** aciertos/errores totales, % de aciertos por modo y por categoría, y palabras por caja.
- **Racha:** días seguidos con al menos una sesión, y un calendario de los últimos 30 días.
- **Las 15 palabras más falladas,** con un botón para estudiarlas.

### 4.14 Configuración

- **Sincronización:** URL del Apps Script y botón de sincronizar.
- **Estudio:** dirección por defecto y cantidad de preguntas por defecto.
- **Audio:**
  - activado/desactivado, y auto-reproducir al mostrar una palabra hebrea;
  - selector de voz entre las disponibles en he-IL;
  - velocidad de 0.6 a 1.2.
- **Teclado:** teclado físico → hebreo.
- **Apariencia:** tema (auto/claro/oscuro) y tamaño del texto hebreo (normal/grande/muy grande).
- **Progreso:**
  - exportar a un archivo `.json` descargable e importar desde un archivo (con confirmación);
  - borrar el progreso con doble confirmación.

## 5. Progreso y repetición espaciada (Leitner)

- **Datos por palabra:** `{ box: 0-5, due: timestamp, seen, correct, wrong, lastWrong: timestamp, streak }`.
- **Cajas:**
  - caja 0 = nueva;
  - al acertar, sube una caja; al errar, vuelve a la caja 1.
- **Intervalos hasta el próximo repaso:** caja 1 = mismo día · 2 = 1 día · 3 = 3 días · 4 = 7 días · 5 = 16 días. Acertar en la caja 5 la reprograma a 30 días.
- **Todos los modos actualizan el progreso,** salvo el Diccionario. En las tarjetas, "La sé" cuenta como acierto.
- **"Repaso del día":** palabras con `due <= ahora` más hasta 10 nuevas por día (configurable), mezclando tarjetas, opción múltiple y escribir.
- **Racha:** se registra el día (fecha local) de cada sesión completada.
- **Claves de `localStorage`** con prefijo y versión: `ivrit.v1.progress`, `ivrit.v1.settings`, `ivrit.v1.vocabCache`, `ivrit.v1.stats`.

## 6. Hebreo, RTL y audio

- **`<html lang="es" dir="ltr">`.** Cada elemento con hebreo lleva `lang="he" dir="rtl"`, con la fuente Heebo y un tamaño 1.25× el del español.
- **Texto mezclado:** nunca concatenar hebreo y español en el mismo nodo sin aislar. Usar `<bdi>` o `unicode-bidi: isolate`.
- **Audio:**
  - usar `speechSynthesis` con una voz `he-IL`;
  - en iOS, las voces cargan tarde: escuchar `voiceschanged`;
  - si no hay voz hebrea, ocultar los 🔊 y avisar una sola vez en Configuración;
  - hablar solo en respuesta a gestos del usuario, salvo auto-reproducir cuando ya hubo interacción.

## 7. Diseño

- **Estilo limpio y moderno.** Paleta con azul como color principal (guiño a la bandera), fondos suaves y tarjetas con bordes redondeados y sombras sutiles.
- **Colores definidos como variables CSS** en `:root`, redefinidas en el tema oscuro.
- **Feedback claro:** verde para acierto, rojo para error y ámbar para "casi" y advertencias. Animaciones cortas (150–300 ms) que respetan `prefers-reduced-motion`.
- **Navegación:**
  - en el celular, una barra inferior fija con Inicio · Estudiar · Diccionario · Estadísticas · Configuración;
  - en desktop, un layout centrado de 720px como máximo.
- **Accesibilidad:** contraste AA, foco visible y `aria-label` en los botones de ícono.

## 8. PWA / offline

- **`manifest.webmanifest`:** nombre "Ivrit", `display: standalone`, colores del tema e ícono `icon.svg` (una א blanca sobre fondo azul).
- **`sw.js` con caché versionada:**
  - `index.html`: network-first;
  - `vocab.json`: network-first;
  - fuentes y estáticos: cache-first;
  - **nunca** cachear la URL del Apps Script.
- **Al cambiar la versión del service worker** se limpian las cachés viejas.
- **Instalación:** la app se puede instalar en el celular y funciona sin conexión con lo último que tenía.

## 9. Calidad

- **Probar cada etapa** con el servidor local en Chromium (Playwright está bien), en viewport de celular (390×844) y de desktop. Revisar que no haya errores en la consola.
- **Casos borde a probar:**
  - categoría con menos de 4 palabras (Tecnología tiene 5, Direcciones 8): los distractores salen de categorías del mismo `kind`;
  - celdas con "—";
  - plural igual al singular;
  - sincronización sin URL o sin conexión;
  - `localStorage` vacío o bloqueado.
- **Normalización testeable:** las funciones de normalización y corrección tienen que ser puras. Agregar tests simples en `tests.html`, que corren en el navegador y muestran ✓/✗.

## 10. Plan de trabajo (en este orden; commit al final de cada etapa)

1. **Base:** carga y normalización de datos, mapeo de encabezados, estado y `localStorage`, router, layout, tema, Inicio, selector de sesión y Diccionario.
2. **Sincronización** con Google Docs (§3).
3. **Tarjetas y opción múltiple.**
4. **Unir con flechas.**
5. **Progreso Leitner,** Repaso del día, Repaso de errores y Estadísticas.
6. **Teclado hebreo,** modo Escribir, Completar la forma y Concordancia.
7. **Clasificar y Contrarreloj.**
8. **Audio, Configuración completa** y exportar/importar progreso.
9. **PWA,** pulido visual, accesibilidad, `tests.html` y `README.md` (qué hace la app, cómo sincronizar, cómo actualizar el Apps Script).
10. **(Opcional) GitHub Action** `.github/workflows/sync-vocab.yml`. Corre todos los lunes y también a mano (`workflow_dispatch`): descarga el JSON del Apps Script con curl, valida que tenga `categories` y, si cambió, actualiza `vocab.json` con un commit. Así el respaldo del repo queda al día.

## 11. Publicación en GitHub Pages

Requiere el GitHub CLI (`gh`) autenticado.

1. `git init`, `.gitignore` y commit inicial (si no se hizo antes).
2. `gh repo create REPO_NAME --public --source=. --push`
3. Activar Pages desde la rama `main`, carpeta raíz:
   `gh api -X POST repos/{owner}/REPO_NAME/pages -f "source[branch]=main" -f "source[path]=/"`
   (si ya existe, usar `PUT` en vez de `POST`).
4. Esperar el deploy (`gh api repos/{owner}/REPO_NAME/pages/builds/latest`) y pasarme el link final: `https://{owner}.github.io/REPO_NAME/`.
5. Comprobar que el link abre y que la sincronización funciona desde ahí.
