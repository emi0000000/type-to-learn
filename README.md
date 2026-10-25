# type-to-learn
Typing game to learn English and Spanish (both ways), practice Spanish spelling and, later, programming syntax.

## Qué es

**Frase Exacta** es un juego de mecanografía para aprender inglés y español, en las dos direcciones. Aparece una frase,
la copias exactamente igual y cada error te cuesta una vida. Está inspirado en la mecánica de *Final Sentence*.

Funciona de dos formas, con el mismo código:

- **Como página web**, en cualquier navegador, sin instalar nada.
- **Como aplicación a pantalla completa**: se puede instalar (con su icono, su propia ventana y sin conexión)
  o abrir como app desde la carpeta descargada. Mira [Jugar como aplicación](#jugar-como-aplicación-a-pantalla-completa).

Es HTML, CSS y JavaScript sin librerías. La interfaz está en **español y en inglés** (botón ES/EN arriba a la derecha),
para que sirva tanto a quien aprende inglés como a quien aprende español.

> **Estado:** versión 1. Los modos **ortografía**, **inglés** y **español** ya se pueden jugar.
> El modo código llegará en la versión 2. La ficha completa del proyecto está en [FICHA.md](FICHA.md).

### Cómo se juega

1. Abre el juego y elige un modo.
2. Aparece una frase. Escríbela tal cual: letras, tildes, mayúsculas, signos (¿ ¡ , . ') y espacios.
3. Empiezas con 5 vidas. Cada carácter equivocado resta una y el juego te explica qué esperaba.
4. Las frases empiezan cortas y se van alargando.
5. Cuando te quedas sin vidas ves tu resultado y la lista de errores para repasar.

**En los modos inglés y español** la frase aparece con su traducción. Cuando terminas de escribirla, la traducción
se oculta y eliges qué significa entre tres opciones (con el ratón o con las teclas 1, 2 y 3).
Si aciertas, la frase cuenta; si fallas, pierdes una vida y ves la respuesta correcta.

Si tu teclado no tiene ñ, tildes o ¿ ¡, en los modos que se escriben en español puedes usar los botones que aparecen
debajo de la caja de texto.

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

Cada modo es independiente: tiene sus propias frases, su récord y su lista de frases vistas.

| Modo | Qué hace | Estado |
|---|---|---|
| Ortografía | Copias frases en español; cada error resta una vida | ✅ Jugable |
| Inglés (inglés → español) | Copias una frase en inglés y eliges su significado en español. Para aprender inglés | ✅ Jugable |
| Español (español → inglés) | Al revés: copias una frase en español y eliges su significado en inglés. Para aprender español | ✅ Jugable |
| Código | Escribes comandos y sintaxis de programación | Versión 2 |

En el menú, las teclas **1**, **2** y **3** empiezan cada modo.

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
- `textos.test.js`: que la interfaz tiene todos sus textos en español y en inglés.
- `estadisticas.test.js`: la racha de días seguidos, las palabras por minuto y cómo se escriben los tiempos.
- `app.test.js`: que la copia sin conexión (`sw.js`) incluye todos los archivos del juego y que la ficha de la app es válida.

Si todo va bien, al final verás `pass` con el total de pruebas y `fail 0`.

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
index.html                  Página del juego (menú, partida, resultado y panel de ajustes)
manifest.webmanifest        Ficha de la aplicación instalable (nombre, iconos, pantalla completa)
sw.js                       Copia sin conexión del juego (service worker)
abrir-app.bat               Abre el juego como app a pantalla completa en Windows
abrir-app.sh                Lo mismo en Mac y Linux
iconos/                     Iconos de la aplicación
css/estilos.css             Aspecto visual (tema oscuro y claro, modo pantalla completa)
js/textos.js                Todos los textos de la interfaz, en español e inglés
js/memoria.js               Guarda datos en el navegador (frases vistas, récord, ajustes)
js/comparar.js              Compara lo escrito con la frase y explica los errores
js/seleccion.js             Elige la siguiente frase sin repetir y según la dificultad
js/significado.js           Elige las opciones de la pregunta "¿Qué significa?" (en las dos direcciones)
js/estadisticas.js          Días seguidos, palabras por minuto, tiempo jugado y mejores marcas
js/pantallas.js             Cambia entre pantallas
js/ajustes.js               Ajustes: idioma, tema, tamaño, dificultad, sonido y voz
js/sonidos.js               Efectos de sonido (creados al momento, sin archivos de audio)
js/voz.js                   Lee las frases en voz alta
js/app.js                   Pantalla completa, botón de instalar y copia sin conexión
js/motor.js                 Motor común de las partidas: vidas, racha, errores, repaso, resultado
js/modos/ortografia.js      Reglas del modo ortografía
js/modos/traduccion.js      Lo común de los modos con traducción: mostrarla y preguntar el significado
js/modos/ingles.js          Modo inglés (inglés -> español)
js/modos/espanol.js         Modo español (español -> inglés)
js/principal.js             Arranque y menú principal
datos/frases-es.js          Frases en español (generado, no editar a mano)
datos/frases-en.js          Parejas inglés-español (generado, no editar a mano)
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
5. Más adelante: modo código y lecturas.

## Cómo colaborar

1. Haz un *fork* del repositorio y crea una rama para tu cambio.
2. Mantén la norma del proyecto: código comentado línea por línea y modos separados.
3. Ejecuta `npm test` antes de enviar tu cambio.
4. Abre un *pull request* explicando qué cambia y por qué.

## Créditos

- **Frases:** todas las frases del juego y sus traducciones vienen de [Tatoeba](https://tatoeba.org) (tatoeba.org) y se
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
