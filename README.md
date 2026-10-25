# type-to-learn
Typing game to practice Spanish spelling, English and programming syntax.

## Qué es

**Frase Exacta** es un juego de mecanografía para aprender ortografía en español e inglés. Aparece una frase,
la copias exactamente igual y cada error te cuesta una vida. Está inspirado en la mecánica de *Final Sentence*.

Funciona en el navegador, sin instalar nada: es HTML, CSS y JavaScript sin librerías.

> **Estado:** versión 1 en construcción. Los modos **ortografía** e **inglés** ya se pueden jugar.
> El modo código llegará en la versión 2. La ficha completa del proyecto está en [FICHA.md](FICHA.md).

### Cómo se juega

1. Abre el juego y elige un modo.
2. Aparece una frase. Escríbela tal cual: letras, tildes, mayúsculas, signos (¿ ¡ , . ') y espacios.
3. Empiezas con 5 vidas. Cada carácter equivocado resta una y el juego te explica qué esperaba.
4. Las frases empiezan cortas y se van alargando.
5. Cuando te quedas sin vidas ves tu resultado y la lista de errores para repasar.

**En el modo inglés** la frase aparece con su traducción al español. Cuando terminas de escribirla, la traducción
se oculta y eliges qué significa entre tres opciones (con el ratón o con las teclas 1, 2 y 3).
Si aciertas, la frase cuenta; si fallas, pierdes una vida y ves la respuesta correcta.

Si tu teclado no tiene ñ, tildes o ¿ ¡, en el modo ortografía puedes usar los botones que aparecen debajo de la caja de texto.

### Modos

Cada modo es independiente: tiene sus propias frases, su récord y su lista de frases vistas.

| Modo | Qué hace | Estado |
|---|---|---|
| Ortografía | Copias frases en español; cada error resta una vida | ✅ Jugable |
| Inglés | Copias una frase en inglés y confirmas que entiendes su significado | ✅ Jugable |
| Código | Escribes comandos y sintaxis de programación | Versión 2 |

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

El juego guarda en tu navegador las frases que ya te salieron y tu récord. Nada se envía a ningún servidor.

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

Las pruebas están en [`tests/`](tests/) y comprueban cuatro cosas:

- `comparar.test.js`: que el juego detecta bien cada error (tildes, mayúsculas, signos, apóstrofos, espacios, texto de más).
- `seleccion.test.js`: que las frases no se repiten y se alargan a medida que avanzas.
- `significado.test.js`: que la pregunta del modo inglés tiene tres opciones distintas, incluye la correcta
  y nunca ofrece como «equivocada» una frase que significa lo mismo.
- `frases.test.js`: que todas las frases de los dos modos cumplen las reglas descritas abajo y que los modos no se mezclan.

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

Durante la partida, debajo de cada frase aparece su número y su autor (en inglés, también los de la traducción),
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
index.html                  Página del juego (menú, partida y resultado)
css/estilos.css             Aspecto visual
js/memoria.js               Guarda datos en el navegador (frases vistas, récord)
js/comparar.js              Compara lo escrito con la frase y explica los errores
js/seleccion.js             Elige la siguiente frase sin repetir y según la dificultad
js/significado.js           Elige las opciones de la pregunta "¿Qué significa?" (modo inglés)
js/pantallas.js             Cambia entre pantallas
js/motor.js                 Motor común de las partidas: vidas, errores, resultado
js/modos/ortografia.js      Reglas del modo ortografía
js/modos/ingles.js          Reglas del modo inglés: traducción y pregunta de significado
js/principal.js             Arranque y menú principal
datos/frases-es.js          Frases en español (generado, no editar a mano)
datos/frases-en.js          Parejas inglés-español (generado, no editar a mano)
herramientas/preparar_frases.py   Descarga y filtra las frases de Tatoeba
tests/                      Pruebas automáticas
FICHA.md                    Ficha del proyecto
```

Todo el código está comentado línea por línea para que se pueda leer y aprender de él.

## Hoja de ruta

1. ✅ Ficha y README.
2. ✅ Modo ortografía, probado y funcionando.
3. ✅ Modo inglés: frase en inglés con su traducción al español, comprobando que entiendes el significado.
4. Más adelante: modo código, módulo de voz y lecturas.

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
