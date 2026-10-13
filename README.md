# Ivrit

Web app PWA para estudiar vocabulario hebreo con repetición espaciada (sistema Leitner). Vanilla HTML+CSS+JS, sin frameworks, sin build. Funciona offline.

**Live:** https://manuejbe.github.io/hebreo/

## Modos de estudio

- **Tarjetas** — flashcards con flip y gestos de swipe
- **Opción múltiple** — 4 opciones, distraktores inteligentes
- **Unir con flechas** — empareja pares español-hebreo
- **Escribir** — escribe la traducción (con teclado hebreo virtual)
- **Completar la forma** — dado singular, elige el plural (y viceversa)
- **Concordancia** — elige la forma correcta según el pronombre (הוא/היא/הם/הן)
- **Clasificar** — agrupa palabras en sus categorías
- **Contrarreloj** — 60 segundos de opción múltiple
- **Repaso de errores** — repite hasta 2 correctas consecutivas
- **Repaso del día** — palabras vencidas por intervalos Leitner

## Progreso Leitner

| Caja | Intervalo |
|------|-----------|
| 1    | Hoy       |
| 2    | 1 día     |
| 3    | 3 días    |
| 4    | 7 días    |
| 5    | 16 días (correcto → 30 días) |

## Cómo sincronizar el vocabulario

El vocabulario viene de un Google Doc procesado por un Apps Script.

1. Abre la app → Config. → Sincronización
2. (Opcional) Introduce la URL de tu propio Apps Script
3. Pulsa **Sincronizar**

El código del Apps Script está en `apps-script/Code.gs`.

## Desarrollo local

```bash
python3 -m http.server 8080
# Abre http://localhost:8080
```

`fetch` de `vocab.json` no funciona con `file://` — necesita un servidor HTTP.

## Tests

Abre `tests.html` en el navegador (con el servidor corriendo) para verificar las funciones de normalización y corrección.

## Simplificaciones (ponytail)

- Repaso del día usa opción múltiple para todos los ejercicios (no mezcla modos)
- Clasificar solo implementa la variante "por categoría" (países por región muestra un toast)
- Contrarreloj guarda un récord global (no por conjunto de categorías)
- Audio depende de las voces he-IL disponibles en el sistema operativo
