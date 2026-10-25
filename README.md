# type-to-learn
Typing game to learn English and Spanish (both ways), vocabulary, the alphabet, math formulas, programming and the keyboard itself.

## Qué es

**Frase Exacta** es un juego de mecanografía para aprender escribiendo. Aparece una frase (o una palabra, una fórmula,
una línea de código), la copias exactamente igual y cada error te cuesta una vida. Está inspirado en la mecánica de *Final Sentence*.

Tiene cuatro secciones, cada una con sus modos:

- **Idiomas:** inglés y español en las dos direcciones, ortografía, vocabulario por temas y abecedario (deletreo).
- **Matemáticas:** álgebra, trigonometría y cálculo. Eliges la fórmula correcta entre otras con errores típicos y la escribes.
- **Código:** Python, JavaScript, HTML y CSS, SQL, terminal y Git. Escribir código, detectar el error y casos de uso.
- **Teclado:** el teclado dibujado en la pantalla (de España, latinoamericano o de EE. UU.) con la siguiente tecla
  señalada, lecciones por filas y un buscador para saber dónde está cualquier carácter (@, #, ñ, ¿, ^...).

Funciona de dos formas, con el mismo código:

- **Como página web**, en cualquier navegador, sin instalar nada.
- **Como aplicación a pantalla completa**: se puede instalar (con su icono, su propia ventana y sin conexión)
  o abrir como app desde la carpeta descargada. Mira [Jugar como aplicación](#jugar-como-aplicación-a-pantalla-completa).

Es HTML, CSS y JavaScript sin librerías. La interfaz está en **español y en inglés** (botón ES/EN arriba a la derecha),
para que sirva tanto a quien aprende inglés como a quien aprende español.

> **Estado:** todas las secciones se pueden jugar. La ficha completa del proyecto está en [FICHA.md](FICHA.md).

### Cómo se juega

1. Abre el juego, elige una sección (Idiomas, Matemáticas, Código o Teclado) y un modo.
2. Aparece una frase. Escríbela tal cual: letras, tildes, mayúsculas, signos (¿ ¡ , . ') y espacios.
3. Empiezas con 5 vidas. Cada carácter equivocado resta una y el juego te explica qué esperaba.
4. Las frases empiezan cortas y se van alargando.
5. Cuando te quedas sin vidas ves tu resultado y la lista de errores para repasar.

**En los modos inglés y español** la frase aparece con su traducción. Cuando terminas de escribirla, la traducción
se oculta y eliges qué significa entre tres opciones (con el ratón o con las teclas 1, 2 y 3).
Si aciertas, la frase cuenta; si fallas, pierdes una vida y ves la respuesta correcta.

**En Matemáticas y en dos modos de Código** es al revés: primero ves el nombre de la fórmula (o qué tiene que hacer
el código) y eliges la versión correcta entre tres; las otras tienen errores típicos. Después se destapa la correcta
y la escribes para fijarla en la memoria. Si elegiste mal, pierdes una vida y esa no cuenta.

Si tu teclado no tiene ñ, tildes o ¿ ¡, en los modos que se escriben en español puedes usar los botones que aparecen
debajo de la caja de texto. En Matemáticas hay botones para √ π ± ≤ ≥ ∫ → y otros símbolos.

### Lo que te ayuda a aprender

- **Escuchar la frase:** el botón del altavoz lee la frase en voz alta con las voces de tu sistema
  (en inglés o en español). En los ajustes puedes hacer que lea cada frase sola y que hable más despacio.
- **Racha:** encadena frases perfectas (sin ningún error). Con 5 seguidas recuperas una vida.
- **Velocidad:** el marcador muestra tus palabras por minuto (PPM) y el resultado final tu precisión, tu mejor racha y el tiempo.
- **Repaso de errores:** las frases en las que fallas se guardan. Con el botón **Repasar** juegas solo esas;
  cuando escribes una perfecta, sale de la lista.
- **Progreso:** el menú muestra cuántos días seguidos llevas practicando, cuántas frases has escrito y cuánto tiempo.
- **Dificultad:** normal (5 vidas), difícil (3 vidas) o práctica (vidas ilimitadas, no guarda récord).
- **Ajustes de aspecto:** tema oscuro, claro o automático, y tres tamaños de letra para la frase.
- **Sonidos:** efectos al acertar, fallar o recuperar una vida, y (opcional) sonido de máquina de escribir al teclear.

### Modos

Cada modo es independiente: tiene sus propias frases, su récord, su lista de frases vistas y sus errores para repasar.

| Sección | Modo | Qué haces |
|---|---|---|
| Idiomas | Ortografía | Copias frases en español con tildes, ñ, ¿ y ¡ |
| Idiomas | Inglés (EN → ES) | Copias una frase en inglés y eliges su significado en español |
| Idiomas | Español (ES → EN) | Al revés: copias una frase en español y eliges su significado en inglés |
| Idiomas | Palabras en inglés | Más de 450 palabras y expresiones por temas (animales, comida, verbos...); eliges qué significan |
| Idiomas | Palabras en español | Las mismas palabras al revés, con su artículo (el, la) para aprender el género |
| Idiomas | Abecedario | Lees y oyes una palabra deletreada («di · ou · yi») en inglés o en español y la escribes |
| Matemáticas | Álgebra | Productos notables, potencias, raíces, fracciones, logaritmos, rectas, progresiones |
| Matemáticas | Trigonometría | Identidades, ángulos notables, teoremas del seno y del coseno, áreas y volúmenes |
| Matemáticas | Cálculo | Límites, derivadas e integrales |
| Código | Escribe código | Copias una línea viendo qué hace y luego eliges qué hace |
| Código | Detecta el error | Tres versiones de la misma línea: eliges la bien escrita y la escribes |
| Código | Casos de uso | Te dan una tarea, eliges qué código la hace y lo escribes |
| Teclado | 8 lecciones | Fila central, de arriba y de abajo, todas las letras, mayúsculas, números, tildes y símbolos |

En el menú, las teclas **1**, **2**, **3**... empiezan cada modo de la sección que estás viendo.

### Sección Teclado: para quien no sabe dónde están las teclas

- Elige tu tipo de teclado: **España**, **Latinoamérica** o **Estados Unidos** (en Chrome y Edge se detecta solo).
- En las lecciones ves el teclado dibujado con la **siguiente tecla señalada**, si hay que mantener **Mayús** o **Alt Gr**,
  y con qué **dedo** se pulsa. Cada dedo tiene su color.
- El buscador **¿Dónde está cada tecla?** te dice cómo escribir cualquier carácter en tu teclado. Por ejemplo,
  la @ es Alt Gr + 2 en España, Alt Gr + Q en Latinoamérica y Mayús + 2 en EE. UU. También explica las
  **teclas muertas** (´ y después a = á; ^ y después Espacio = ^).
- En *Ajustes* puedes mostrar el teclado en pantalla en **todos** los modos (por ejemplo, mientras escribes fórmulas).

## Probarlo en local

### 1. Descargar el proyecto

Con Git:

```bash
git clone https://github.com/emi0000000/type-to-learn.git
```

O sin Git: en GitHub pulsa **Code → Download ZIP** y descomprímelo.

### 2. Abrir el juego

- **Lo más fácil:** haz doble clic en `index.html`. Se abre en tu navegador y ya se puede jugar.
- **Con un servidor local (opcional):** desde la carpeta del proyecto ejecuta este comando y abre
  <http://localhost:8000> en el navegador. Para pararlo, pulsa `Ctrl + C`.

  ```bash
  python -m http.server 8000
  ```

El juego guarda en tu navegador las frases que ya te salieron, tus récords, tus errores para repasar y tus ajustes.
Nada se envía a ningún servidor. Puedes borrarlo todo en *Ajustes → Borrar mi progreso*.

### 3. Ejecutar los tests

Necesitas [Node.js](https://nodejs.org) 18 o más reciente. No hay que instalar dependencias.
Desde la carpeta del proyecto:

```bash
npm test
```

Si no tienes npm, este comando hace lo mismo:

```bash
node --test
```

Las pruebas están en [`tests/`](tests/) y comprueban:

- `comparar.test.js`: que el juego detecta bien cada error (tildes, mayúsculas, signos, apóstrofos, espacios, texto de más)
  y lo explica en español y en inglés.
- `seleccion.test.js`: que las frases no se repiten y se alargan a medida que avanzas.
- `significado.test.js`: que la pregunta de los modos inglés y español tiene tres opciones distintas, incluye la correcta
  y nunca ofrece como «equivocada» una frase que significa lo mismo (tampoco la misma frase en femenino o masculino).
- `frases.test.js`: que todas las frases cumplen las reglas descritas abajo y que los modos no se mezclan.
- `contenidos.test.js`: que el vocabulario no repite palabras, que cada fórmula y cada línea de código tiene dos
  versiones con error distintas, que todo se puede escribir y que el abecedario deletrea bien.
- `teclado.test.js`: dónde está cada carácter en los tres teclados (la @, las tildes, las teclas muertas, ¿ ¡...)
  y que todos los ejercicios de las lecciones se pueden escribir con su teclado.
- `textos.test.js`: que la interfaz tiene todos sus textos en español y en inglés.
- `estadisticas.test.js`: la racha de días seguidos, las palabras por minuto y cómo se escriben los tiempos.
- `app.test.js`: que la copia sin conexión (`sw.js`) incluye todos los archivos del juego y que la ficha de la app es válida.

Si todo va bien, al final verás `pass` con el total de pruebas y `fail 0`.

## Jugar como aplicación (a pantalla completa)

Hay tres formas, de la más sencilla a la más completa:

1. **Botón de pantalla completa:** en cualquier navegador de ordenador, pulsa el botón de las cuatro esquinas
   (arriba a la derecha) o la tecla `F11`. En *Ajustes* puedes hacer que entre a pantalla completa al empezar cada partida.
2. **Abrirlo como app desde la carpeta descargada**, sin instalar nada:
   - **Windows:** haz doble clic en `abrir-app.bat`. Usa Microsoft Edge (viene con Windows) o Google Chrome.
   - **Mac y Linux:** ejecuta `bash abrir-app.sh`. Usa Chrome, Chromium, Edge o Brave.

   Se abre en una ventana sin barras del navegador y a pantalla completa (sal con `F11` o `Esc`).
3. **Instalarlo** desde la versión publicada en internet (o desde un servidor local):
   - **Chrome o Edge (ordenador y Android):** aparece el botón **Instalar app** en la barra del juego
     (o en el menú del navegador, *Instalar Frase Exacta*). Se queda con su icono en el menú de inicio o en la pantalla del móvil.
   - **iPhone o iPad (Safari):** botón *Compartir* → *Añadir a pantalla de inicio*.

   La app instalada se abre a pantalla completa y **funciona sin conexión**: guarda una copia del juego
   (lo hace [`sw.js`](sw.js)). Cuando hay internet, siempre carga la última versión.

Al jugar a pantalla completa o como app, el juego usa un diseño más amplio, con la frase más grande y centrada.

## Publicarlo en internet

En GitHub, ve a *Settings → Pages*, elige la rama `main` y la carpeta raíz (`/ (root)`).
En unos minutos el juego queda publicado en <https://emi0000000.github.io/type-to-learn/>.

## De dónde salen las frases

Todas las frases vienen de [Tatoeba](https://tatoeba.org), una base de datos libre de frases escritas y
revisadas por voluntarios. En los dos modos solo se usan frases que:

- otra persona distinta del autor marcó como correctas, y nadie marcó como incorrectas o dudosas;
- fueron escritas o revisadas por alguien que tiene ese idioma como lengua nativa;
- no tienen etiquetas de aviso en Tatoeba (por ejemplo *@check*, *needs native check*, *vulgar*, *offensive* o *archaic*);
- no tienen números, comillas, paréntesis, espacios mal puestos ni palabras de programación;
- miden entre 10 y 90 caracteres.

Además, las frases en español (las del modo ortografía y las traducciones del modo inglés):

- abren y cierran bien los signos (¿?, ¡!);
- no usan tildes que la RAE ya no recomienda desde 2010 (*sólo*, *éste*, *guión*…).

**Modo ortografía:** 3467 frases en [`datos/frases-es.js`](datos/frases-es.js).

**Modo inglés:** 5000 parejas inglés-español en [`datos/frases-en.js`](datos/frases-en.js)
(1500 cortas, 2000 medianas y 1500 largas). Tatoeba tiene unas 40 000 parejas que cumplen las reglas;
se guarda una selección, priorizando las que tienen las dos frases revisadas, para que la página cargue rápido.

**Modo español:** usa las mismas parejas dadas la vuelta (4950: cuando una frase en español tiene dos traducciones
al inglés, se queda una). Tiene sus propias frases vistas, su récord y sus errores para repasar.

Durante la partida, debajo de cada frase aparece su número y su autor (en inglés y español, también los de la traducción),
con un enlace a su página en Tatoeba.

El juego recuerda (en tu navegador) qué frases ya te salieron en cada modo para no repetirlas.
Cuando las has visto todas, la lista vuelve a empezar.

### Contenidos escritos para el proyecto

El vocabulario ([`datos/vocabulario.js`](datos/vocabulario.js), 452 palabras en 21 temas), las fórmulas
([`datos/matematicas.js`](datos/matematicas.js), 90) y las líneas de código ([`datos/codigo.js`](datos/codigo.js), 79)
están escritos para este proyecto y tienen la misma licencia que el código (MIT). Cada palabra del vocabulario avisa
si se dice distinto en otros países (por ejemplo, *el ordenador* en España y *la computadora* en América).
Las lecciones de teclado usan palabras sacadas de las frases de Tatoeba.

### Actualizar la lista de frases

Necesitas Python 3.8 o más reciente; no hace falta instalar paquetes.

```bash
python herramientas/preparar_frases.py
```

Genera los dos archivos de frases a la vez. La primera vez descarga unos 150 MB de Tatoeba (sobre todo el
archivo de revisiones y las frases en inglés) y los guarda en `herramientas/.cache/`, que no se sube al
repositorio. Para forzar una descarga nueva, añade `--refrescar`.

## Estructura del proyecto

```text
index.html                  Página del juego (menú, partida, resultado, ajustes, buscador de teclas y abecedario)
manifest.webmanifest        Ficha de la aplicación instalable (nombre, iconos, pantalla completa)
sw.js                       Copia sin conexión del juego (service worker)
abrir-app.bat               Abre el juego como app a pantalla completa en Windows
abrir-app.sh                Lo mismo en Mac y Linux
iconos/                     Iconos de la aplicación
css/estilos.css             Aspecto visual (tema oscuro y claro, modo pantalla completa, teclado en pantalla)
js/textos.js                Todos los textos de la interfaz, en español e inglés
js/memoria.js               Guarda datos en el navegador (frases vistas, récord, ajustes)
js/comparar.js              Compara lo escrito con la frase y explica los errores
js/seleccion.js             Elige la siguiente frase sin repetir y según la dificultad
js/significado.js           Elige las opciones de la pregunta "¿Qué significa?" (en las dos direcciones)
js/estadisticas.js          Días seguidos, palabras por minuto, tiempo jugado y mejores marcas
js/teclado.js               Los tres tipos de teclado, qué teclas pulsar para cada carácter y las lecciones
js/letras.js                El abecedario en inglés y en español, y cómo se deletrea
js/pantallas.js             Cambia entre pantallas
js/ajustes.js               Ajustes: idioma, tema, tamaño, dificultad, teclado, sonido y voz
js/sonidos.js               Efectos de sonido (creados al momento, sin archivos de audio)
js/voz.js                   Lee las frases en voz alta
js/app.js                   Pantalla completa, botón de instalar y copia sin conexión
js/tecladoVisual.js         Dibuja el teclado en pantalla y el buscador «¿Dónde está?»
js/motor.js                 Motor común de las partidas: vidas, racha, errores, repaso, resultado
js/modos/pregunta.js        Preguntas de opción múltiple (teclas 1, 2 y 3)
js/modos/traduccion.js      Modos de «escribir y elegir el significado»
js/modos/eleccion.js        Modos de «elegir la correcta y escribirla»
js/modos/ortografia.js      Modo ortografía
js/modos/ingles.js          Modo inglés (inglés -> español)
js/modos/espanol.js         Modo español (español -> inglés)
js/modos/vocabulario.js     Modos de vocabulario (palabras en inglés y en español)
js/modos/abecedario.js      Modo abecedario (deletreo) y tabla de letras
js/modos/matematicas.js     Modos de álgebra, trigonometría y cálculo
js/modos/codigo.js          Modos de código (escribir, detectar el error, casos de uso)
js/modos/teclado.js         Lecciones de teclado
js/principal.js             Arranque y menú principal por secciones
datos/frases-es.js          Frases en español (generado, no editar a mano)
datos/frases-en.js          Parejas inglés-español (generado, no editar a mano)
datos/vocabulario.js        Vocabulario por temas (escrito para el proyecto)
datos/matematicas.js        Fórmulas con sus errores típicos (escrito para el proyecto)
datos/codigo.js             Líneas de código con sus errores típicos (escrito para el proyecto)
herramientas/preparar_frases.py   Descarga y filtra las frases de Tatoeba
tests/                      Pruebas automáticas
FICHA.md                    Ficha del proyecto
```

Todo el código está comentado línea por línea para que se pueda leer y aprender de él
(salvo `manifest.webmanifest`, que es JSON y no admite comentarios).

## Hoja de ruta

1. ✅ Ficha y README.
2. ✅ Modo ortografía, probado y funcionando.
3. ✅ Modo inglés: frase en inglés con su traducción al español, comprobando que entiendes el significado.
4. ✅ Modo español (al revés), interfaz en dos idiomas, voz, repaso de errores, estadísticas y versión como aplicación.
5. ✅ Secciones de vocabulario, abecedario, matemáticas, código y teclado.
6. Más adelante: lecturas, más lenguajes de programación y más temas de matemáticas (estadística, geometría).

## Cómo colaborar

1. Haz un *fork* del repositorio y crea una rama para tu cambio.
2. Mantén la norma del proyecto: código comentado línea por línea y modos separados.
3. Ejecuta `npm test` antes de enviar tu cambio.
4. Abre un *pull request* explicando qué cambia y por qué.

## Créditos

- **Frases:** todas las frases de los modos ortografía, inglés y español, y sus traducciones, vienen de [Tatoeba](https://tatoeba.org) (tatoeba.org) y se
  usan bajo la licencia [Creative Commons Attribution 2.0 France (CC BY 2.0 FR)](https://creativecommons.org/licenses/by/2.0/fr/).
  Cada frase conserva su número de Tatoeba y el nombre de usuario de su autor, que el juego muestra con un
  enlace a la frase original. Las listas completas están en [`datos/frases-es.js`](datos/frases-es.js)
  y [`datos/frases-en.js`](datos/frases-en.js).
  Gracias a todas las personas voluntarias que escriben y revisan frases en Tatoeba.
  Tatoeba no patrocina ni respalda este proyecto.
- **Inspiración:** la mecánica de copiar con precisión y perder vidas al fallar viene del juego *Final Sentence*.

## Licencia

- **Código:** licencia MIT (mira [LICENSE](LICENSE)).
- **Frases:** [Tatoeba](https://tatoeba.org), con licencia
  [CC BY 2.0 FR](https://creativecommons.org/licenses/by/2.0/fr/). Cada frase indica su número y su autor.
