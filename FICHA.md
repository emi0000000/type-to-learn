# Ficha 4: juego de aprendizaje

**Objetivo:** una primera versión jugable en 1 o 2 semanas, publicada en GitHub como proyecto abierto.
Inspirado en la mecánica de *Final Sentence*: copiar texto con precisión y perder vidas al fallar.

## Modos

Cada modo va separado: no se mezclan.

| Modo | Qué hace | Regla | Estado |
|---|---|---|---|
| Ortografía | Muestra una frase en español | La escribes exacta; cada error resta una vida | ✅ Versión 1 |
| Inglés | Muestra una frase y su traducción | La escribes bien y confirmas que entiendes el significado | ✅ Versión 1 |
| Código | Muestra comandos y sintaxis | Los escribes correctamente | Versión 2 |

## Lo que NO debe hacer

- Mezclar modos: ortografía no incluye nada de programación.
- Pedir escribir al revés o desordenar palabras.
- Repetir frases: se toman de [Tatoeba](https://tatoeba.org), una base gratuita con millones de frases revisadas.

## Orden de construcción

1. Ficha y README. ✅
2. Modo ortografía, probado y funcionando. ✅
3. Modo inglés. ✅
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
- **Etiquetas de Tatoeba:** se descartan las frases con avisos de revisión (*@check*, *@change*,
  *needs native check*…) o etiquetas de contenido inadecuado o anticuado (*vulgar*, *offensive*, *archaic*…).

## Decisiones tomadas para el modo inglés

- **Cómo se confirma que entiendes la frase:** mientras escribes ves la frase en inglés y su traducción.
  Al terminarla, la traducción se oculta y eliges qué significa entre tres opciones en español
  (ratón o teclas 1, 2 y 3). Acertar cuenta la frase; fallar resta una vida y muestra la respuesta correcta.
- **Opciones equivocadas parecidas:** se eligen traducciones que comparten palabras con la correcta
  (por ejemplo, otra frase con «fuerte» o «cansado»), para que haya que entender la frase y no solo
  reconocer una palabra. Nunca se ofrece como equivocada una frase que significa lo mismo
  («I'm tired» y «I am tired» cuentan como iguales).
- **Calidad:** la frase en inglés debe estar aprobada por otra persona y escrita o aprobada por un nativo
  de inglés; la traducción, escrita o aprobada por un nativo de español y con la misma ortografía
  exigida en el modo ortografía.
- **Tamaño:** de unas 40 000 parejas válidas se guardan 5000 (1500 cortas, 2000 medianas y 1500 largas),
  priorizando las que tienen las dos frases revisadas. Así el archivo pesa unos 600 KB.
- **Sin botones de tildes:** el inglés no los necesita; el apóstrofo (*don't*, *I'm*) está en cualquier teclado.
- **Código compartido:** lo común a todos los modos (vidas, errores, resultado) está en `js/motor.js`.
  Cada modo solo describe sus reglas en `js/modos/`, y tiene sus propias frases, récord y frases vistas.
