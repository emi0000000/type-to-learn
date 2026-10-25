# Ficha 4: juego de aprendizaje

**Objetivo:** una primera versión jugable en 1 o 2 semanas, publicada en GitHub como proyecto abierto.
Inspirado en la mecánica de *Final Sentence*: copiar texto con precisión y perder vidas al fallar.

## Modos

Cada modo va separado: no se mezclan.

| Modo | Qué hace | Regla | Estado |
|---|---|---|---|
| Ortografía | Muestra una frase en español | La escribes exacta; cada error resta una vida | ✅ Versión 1 |
| Inglés | Muestra una frase y su traducción | La escribes bien y confirmas que entiendes el significado | Siguiente paso |
| Código | Muestra comandos y sintaxis | Los escribes correctamente | Versión 2 |

## Lo que NO debe hacer

- Mezclar modos: ortografía no incluye nada de programación.
- Pedir escribir al revés o desordenar palabras.
- Repetir frases: se toman de [Tatoeba](https://tatoeba.org), una base gratuita con millones de frases revisadas.

## Orden de construcción

1. Ficha y README. ✅
2. Modo ortografía, probado y funcionando. ✅
3. Modo inglés.
4. Más adelante: modo código, módulo de voz y lecturas.

## Norma del código

- Código comentado línea por línea.

## Decisiones tomadas en la versión 1

- **Tecnología:** HTML, CSS y JavaScript sin librerías ni instalación. Se juega abriendo `index.html`
  y se puede publicar gratis con GitHub Pages.
- **Vidas:** 5 por partida. Cada carácter equivocado (letra, tilde, mayúscula, signo o espacio) resta una.
  Sin vidas, termina la partida.
- **Dificultad:** las frases se alargan a medida que avanzas (primero cortas, luego medianas, luego largas).
- **Sin repeticiones:** el navegador recuerda qué frases ya salieron. Solo cuando se acaban todas
  vuelve a empezar la lista, y lo avisa.
- **Sin trampas:** no se puede pegar texto en la caja.
- **Aprender del error:** el juego explica cada fallo (por ejemplo: *Falta la tilde: se esperaba «á»
  y escribiste «a»*) y al final muestra las palabras para repasar.
- **Calidad de las frases:** solo entran frases de Tatoeba que:
  - otra persona distinta del autor marcó como correctas, sin ninguna marca de «incorrecta» o «dudosa»;
  - fueron escritas o revisadas por alguien que tiene el español como lengua nativa;
  - abren y cierran bien los signos (¿?, ¡!) y no tienen espacios mal puestos;
  - no usan tildes que la RAE ya no recomienda desde 2010 (*sólo*, *éste*, *guión*…);
  - no tienen números, comillas, paréntesis ni palabras de programación.
- **Teclados sin ñ o tildes:** hay botones en pantalla para á, é, í, ó, ú, ü, ñ, ¿ y ¡.
