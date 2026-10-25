# Ficha 4: juego de aprendizaje

**Objetivo:** una primera versión jugable en 1 o 2 semanas, publicada en GitHub como proyecto abierto.
Inspirado en la mecánica de *Final Sentence*: copiar texto con precisión y perder vidas al fallar.

## Modos

Cada modo va separado: no se mezclan.

| Modo | Qué hace | Regla | Estado |
|---|---|---|---|
| Ortografía | Muestra una frase en español | La escribes exacta; cada error resta una vida | ✅ Versión 1 |
| Inglés | Muestra una frase en inglés y su traducción al español | La escribes bien y confirmas que entiendes el significado | ✅ Versión 1 |
| Español | Al revés: una frase en español y su traducción al inglés | La escribes bien y confirmas que entiendes el significado | ✅ Versión 1 |
| Vocabulario | Palabras por temas en inglés o en español | Escribes la palabra y eliges su significado | ✅ |
| Abecedario | Una palabra deletreada (se ve y se oye) | Escribes la palabra | ✅ |
| Matemáticas | El nombre de una fórmula | Eliges la correcta entre tres y la escribes | ✅ |
| Código | Comandos y sintaxis (Python, JavaScript, HTML/CSS, SQL, terminal y Git) | Escribes, detectas el error o eliges el código para una tarea | ✅ |
| Teclado | El teclado en pantalla con la siguiente tecla señalada | Aprendes dónde está cada tecla según tu tipo de teclado | ✅ |

## Lo que NO debe hacer

- Mezclar modos: ortografía no incluye nada de programación.
- Pedir escribir al revés o desordenar palabras.
- Repetir frases: se toman de [Tatoeba](https://tatoeba.org), una base gratuita con millones de frases revisadas.

## Orden de construcción

1. Ficha y README. ✅
2. Modo ortografía, probado y funcionando. ✅
3. Modo inglés. ✅
4. Modo español, interfaz en dos idiomas, voz, repaso y versión como aplicación. ✅
5. Vocabulario, abecedario, matemáticas, código y teclado. ✅
6. Más adelante: lecturas.

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

## Decisiones tomadas para la versión «aplicación» y el modo español

- **Aprender en las dos direcciones:** el modo español usa las mismas parejas de Tatoeba que el inglés, dadas la vuelta.
  Se copia la frase en español (con los botones de tildes, ñ, ¿ y ¡) y se elige su significado en inglés.
  Tiene sus propias frases vistas, récord y errores. Las opciones equivocadas nunca son una traducción equivalente
  (ni con contracciones, ni la misma frase en masculino o femenino).
- **Interfaz en dos idiomas:** todos los textos están en `js/textos.js`, en español e inglés. Al abrir el juego
  se elige el idioma del navegador; se cambia con el botón ES/EN. Las explicaciones de los errores también se traducen.
- **Web y aplicación con el mismo código:** sigue sin librerías ni instalación. Para ser una aplicación usa lo que
  ya traen los navegadores: una ficha (`manifest.webmanifest`) para poder instalarla con su icono y abrirla a
  pantalla completa, y un *service worker* (`sw.js`) para jugar sin conexión. Desde la carpeta descargada,
  `abrir-app.bat` y `abrir-app.sh` la abren como app a pantalla completa con Edge o Chrome.
  Se descartó empaquetarla con Electron porque obligaría a instalar dependencias de cientos de megas.
- **Voz:** usa la síntesis de voz del sistema (sin descargas). Se oye con el botón del altavoz o en cada frase si se activa.
- **Recuperar vidas:** cada 5 frases perfectas seguidas se recupera una vida (sin pasar del máximo), para premiar la precisión.
- **Repaso:** las frases con algún error se guardan (hasta 300 por modo). El repaso solo usa esas frases y no
  cuenta para el récord. Escribir una perfecta la quita de la lista.
- **Dificultad:** normal (5 vidas), difícil (3) y práctica (ilimitadas, sin récord).
- **Velocidad:** palabras por minuto con el convenio habitual de 5 caracteres por palabra, contando solo el tiempo
  desde la primera tecla de cada frase hasta terminarla.

## Decisiones tomadas para las secciones nuevas

- **Menú por secciones:** Idiomas, Matemáticas, Código y Teclado. Cada modo sigue separado, con sus frases, récord y repaso.
- **Contenidos propios:** el vocabulario, las fórmulas y el código están escritos para el proyecto (MIT), porque
  Tatoeba solo tiene frases. Cada palabra es única en los dos idiomas, para que cada pregunta tenga una sola respuesta;
  las variantes de otros países van en una nota.
- **Vocabulario:** las opciones equivocadas son del mismo tema, para que haya que conocer la palabra.
  Los sustantivos en español llevan artículo para aprender el género.
- **Abecedario:** se practica entender un deletreo (lo que pasa al dictar un nombre o un correo). La palabra se oculta
  con rayas y se descubre al escribirla. Con la interfaz en español, las letras inglesas se escriben como suenan (*di, ou, yi*).
- **Matemáticas y código, «elegir y luego escribir»:** primero se elige la versión correcta entre tres (las otras tienen
  un error típico: olvidar el doble producto, un signo cambiado, falta un paréntesis...) y después se escribe la correcta.
  Así se aprende a reconocer qué fórmula «va» y cuál no, y a escribirla con el teclado.
- **Cómo se escriben las fórmulas:** con lo que hay en el teclado (^ para potencias, / para fracciones) y botones para
  √ π ± ≤ ≥ ≠ → ∞ ∫ Δ θ °. En español, el seno se escribe *sen*.
- **Teclado:** tres tipos (España, Latinoamérica, EE. UU.), dedos con colores, Mayús y Alt Gr señalados y teclas muertas
  explicadas. El tipo se adivina por el idioma del navegador y, en Chrome y Edge, por el propio teclado.
- **Móviles:** se aceptan las comillas curvas que ponen solos los teclados de los móviles (’ “ ”).
