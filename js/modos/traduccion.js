// modos/traduccion.js: los modos de «escribir y luego elegir el significado».
// Mientras se escribe, la frase se ve con su traducción (o su explicación). Al terminar de escribirla,
// la traducción se oculta y hay que elegir su significado entre tres opciones
// (con el ratón o con las teclas 1, 2 y 3). Acertar cuenta la frase; fallar resta una vida.
// Lo usan los modos inglés, español, vocabulario y «Escribe código». Cada uno llama a Traduccion.crear.

// Todo va dentro de una función que se ejecuta al momento, para no llenar el espacio global.
const Traduccion = (() => {
  // Milisegundos de pausa tras fallar el significado, para leer la respuesta correcta.
  const PAUSA_TRAS_FALLO = 2200;
  // Atajo para no escribir document.getElementById cada vez.
  const $ = (id) => document.getElementById(id);
  // Elementos de la página que usan estos modos.
  const el = {
    traduccion: $("traduccion"), // bloque de la traducción
    etiqueta: $("traduccion-etiqueta"), // etiqueta de la traducción ("Traducción", "Qué hace")
    traduccionTexto: $("traduccion-texto"), // texto de la traducción
  };

  // Pone un texto entre comillas para citarlo dentro de un mensaje, según el idioma de la interfaz.
  // En español, comillas latinas y, según la RAE, el punto final fuera: «Tengo hambre». (no «Tengo hambre.».)
  // Los signos ? y ! se quedan dentro, y los puntos suspensivos también.
  // En inglés, comillas inglesas con todo dentro: “I'm hungry.”
  function citar(texto) {
    // En inglés, comillas inglesas.
    if (idiomaActual() === "en") {
      // Devolvemos el texto tal cual, entre comillas.
      return `“${texto}”`;
    }
    // Si termina en un punto que no es parte de unos puntos suspensivos, lo quitamos.
    const sinPunto = texto.endsWith(".") && !texto.endsWith("...") ? texto.slice(0, -1) : texto;
    // Devolvemos el texto entre comillas.
    return `«${sinPunto}»`;
  }

  // Oculta la traducción (al terminar la partida).
  function ocultarTraduccion() {
    // Ocultamos el bloque.
    el.traduccion.hidden = true;
  }

  // Crea un modo de escribir y elegir el significado.
  //   id:                nombre interno del modo
  //   idioma:            idioma de la frase que se copia
  //   idiomaTraduccion:  idioma de la traducción y de las opciones (o una función que lo devuelve)
  //   frases:            función que devuelve [número, frase, autor, número, traducción, autor]
  //   direccion:         cómo comparar frases para elegir opciones equivocadas (mira significado.js)
  //   opciones(frase):   (opcional) otra forma de elegir las traducciones equivocadas; devuelve 2 textos
  //   etiquetaTraduccion: (opcional) clave del texto de la etiqueta; por defecto "juego.traduccion"
  //   tituloPregunta:    (opcional) clave del título de la pregunta; por defecto "juego.pregunta"
  //   creditos(frase):   (opcional) créditos; por defecto, la frase y su traducción en Tatoeba
  //   Y cualquier otra propiedad del modo (teclas, etiqueta, nota, sinVoz...) se pasa tal cual al motor.
  function crear(config) {
    // Sacamos los datos propios; el resto se pasa al motor.
    const { idiomaTraduccion, direccion, opciones, etiquetaTraduccion = "juego.traduccion", tituloPregunta = "juego.pregunta", ...resto } = config;

    // Idioma de la traducción (puede ser una función, si depende del idioma de la interfaz).
    const idiomaDeTraduccion = () => (typeof idiomaTraduccion === "function" ? idiomaTraduccion() : idiomaTraduccion);

    // Se llama al mostrar cada frase nueva: enseña su traducción y quita la pregunta anterior.
    function alMostrarFrase(frase) {
      // Quitamos la pregunta anterior.
      Pregunta.recoger();
      // Etiqueta de la traducción.
      el.etiqueta.textContent = t(etiquetaTraduccion);
      // Guardamos la clave para que se traduzca si cambia el idioma.
      el.etiqueta.dataset.t = etiquetaTraduccion;
      // Ponemos la traducción.
      el.traduccionTexto.textContent = frase[4];
      // Indicamos su idioma (para lectores de pantalla).
      el.traduccionTexto.lang = idiomaDeTraduccion();
      // Mostramos la traducción.
      el.traduccion.hidden = false;
    }

    // Se llama al copiar la frase entera: hace la pregunta de significado.
    function alTerminarDeEscribir(frase, api) {
      // Ocultamos la traducción: ahora hay que recordarla.
      el.traduccion.hidden = true;
      // Traducción correcta.
      const correcta = frase[4];
      // Textos de las opciones: la correcta y dos equivocadas.
      const textos = opciones
        // Si el modo elige las equivocadas, la correcta más las suyas, mezcladas.
        ? Pregunta.mezclarOpciones([correcta, ...opciones(frase)])
        // Si no, las elige significado.js (traducciones parecidas).
        : elegirOpciones(resto.frases(), frase, 3, Math.random, direccion);
      // Hacemos la pregunta.
      Pregunta.hacer({
        titulo: t(tituloPregunta), // título
        opciones: textos.map((texto) => ({ texto, correcta: texto === correcta })), // opciones
        idioma: idiomaDeTraduccion(), // idioma de las opciones
        alResponder: (elegida, acierto) => {
          // Si acertó, la frase cuenta como superada.
          if (acierto) {
            // Pasamos a la siguiente.
            api.superar(t("traduccion.correcto"));
            // Terminamos aquí.
            return;
          }
          // Si falló, pierde una vida y lo guardamos para el repaso.
          const sigue = api.fallar(
            {
              palabra: frase[1], // la frase que se copió
              marca: -1, // sin letra que resaltar
              espacio: false, // no es un error de espacio
              explicacion: t("traduccion.explicacion", { correcta: citar(correcta), elegida: citar(elegida.texto) }), // explicación para el repaso
            },
            // Mensaje bajo la caja de texto.
            t("traduccion.fallo", { correcta: citar(correcta) }),
          );
          // Si la partida sigue, pasamos a la siguiente frase (sin contar esta) tras leer la respuesta.
          if (sigue) {
            // Siguiente frase tras una pausa.
            api.siguiente(PAUSA_TRAS_FALLO);
          }
        },
      });
      // Mensaje de ánimo según cómo se escribió.
      api.mensaje(t(api.sinErrores ? "traduccion.bienEscrita" : "traduccion.escrita"), "bien");
    }

    // Descripción del modo para el motor.
    return {
      // Créditos para Tatoeba: la frase y su traducción, cada una con su autor (se puede cambiar).
      creditos: (frase) => [
        // Frase que se copia.
        ["fuente.frase", frase[0], frase[2]],
        // Traducción.
        ["fuente.traduccion", frase[3], frase[5]],
      ],
      // El resto de propiedades del modo (id, idioma, frases, teclas...).
      ...resto,
      // Enseñar la traducción.
      alMostrarFrase,
      // Pregunta de significado.
      alTerminarDeEscribir,
      // Limpieza al acabar.
      alTerminarPartida() {
        // Quitamos la pregunta.
        Pregunta.recoger();
        // Ocultamos la traducción.
        ocultarTraduccion();
      },
    };
  }

  // Lo que este archivo ofrece a los modos.
  return { crear, citar };
})();
