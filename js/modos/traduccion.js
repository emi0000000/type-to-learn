// modos/traduccion.js: lo común a los modos con traducción (inglés y español).
// Mientras se escribe, la frase se ve con su traducción. Al terminar de escribirla,
// la traducción se oculta y hay que elegir su significado entre tres opciones
// (con el ratón o con las teclas 1, 2 y 3). Acertar cuenta la frase; fallar resta una vida.
// Cada modo (ingles.js, espanol.js) llama a Traduccion.crear con sus datos.

// Todo va dentro de una función que se ejecuta al momento, para no llenar el espacio global.
const Traduccion = (() => {
  // Milisegundos de pausa tras fallar el significado, para leer la respuesta correcta.
  const PAUSA_TRAS_FALLO = 2200;
  // Teclas para elegir opción con el teclado.
  const TECLAS_DE_OPCION = ["1", "2", "3"];

  // Atajo para no escribir document.getElementById cada vez.
  const $ = (id) => document.getElementById(id);
  // Elementos de la página que usan estos modos.
  const el = {
    traduccion: $("traduccion"), // bloque de la traducción
    traduccionTexto: $("traduccion-texto"), // texto de la traducción
    pregunta: $("pregunta"), // bloque de la pregunta "¿Qué significa?"
    opciones: $("opciones"), // botones de las opciones
  };

  // Pregunta en curso: { frase, api, textos, botones }, o null si no hay pregunta.
  // Solo puede haber una a la vez, aunque haya dos modos.
  let activa = null;

  // Pone una frase entre comillas para citarla dentro de un mensaje, según el idioma de la interfaz.
  // En español, comillas latinas y, según la RAE, el punto final fuera: «Tengo hambre». (no «Tengo hambre.».)
  // Los signos ? y ! se quedan dentro, y los puntos suspensivos también.
  // En inglés, comillas inglesas con todo dentro: “I'm hungry.”
  function citar(texto) {
    // En inglés, comillas inglesas.
    if (idiomaActual() === "en") {
      // Devolvemos la frase tal cual, entre comillas.
      return `“${texto}”`;
    }
    // Si termina en un punto que no es parte de unos puntos suspensivos, lo quitamos.
    const sinPunto = texto.endsWith(".") && !texto.endsWith("...") ? texto.slice(0, -1) : texto;
    // Devolvemos la frase entre comillas.
    return `«${sinPunto}»`;
  }

  // Responde la pregunta en curso con la opción de la posición indicada.
  function responder(posicion) {
    // Si no hay pregunta en curso, no hacemos nada.
    if (!activa) {
      // Salimos.
      return;
    }
    // Sacamos los datos de la pregunta.
    const { frase, api, textos, botones } = activa;
    // La pregunta ya está respondida.
    activa = null;
    // Traducción correcta.
    const correcta = frase[4];
    // Opción elegida.
    const elegida = textos[posicion];
    // Recorremos los botones.
    botones.forEach((boton, indice) => {
      // Ya no se pueden pulsar.
      boton.disabled = true;
      // La correcta se marca en verde.
      if (textos[indice] === correcta) {
        // Clase de opción correcta.
        boton.classList.add("correcta");
        // La elegida, si era equivocada, en rojo.
      } else if (indice === posicion) {
        // Clase de opción incorrecta.
        boton.classList.add("incorrecta");
      }
    });
    // Si acertó, la frase cuenta como superada.
    if (elegida === correcta) {
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
        explicacion: t("traduccion.explicacion", { correcta: citar(correcta), elegida: citar(elegida) }), // explicación para el repaso
      },
      // Mensaje bajo la caja de texto.
      t("traduccion.fallo", { correcta: citar(correcta) }),
    );
    // Si la partida sigue, pasamos a la siguiente frase (sin contar esta) tras leer la respuesta.
    if (sigue) {
      // Siguiente frase tras una pausa.
      api.siguiente(PAUSA_TRAS_FALLO);
    }
  }

  // Recoge la traducción y la pregunta (al terminar la partida).
  function recoger() {
    // No queda pregunta en curso.
    activa = null;
    // Ocultamos la pregunta.
    el.pregunta.hidden = true;
    // Quitamos las opciones.
    el.opciones.replaceChildren();
    // Ocultamos la traducción.
    el.traduccion.hidden = true;
  }

  // Crea un modo con traducción.
  //   id:               nombre interno del modo ("ingles", "espanol")
  //   idioma:           idioma de la frase que se copia
  //   idiomaTraduccion: idioma de la traducción y de las opciones
  //   teclasEspeciales: true si se muestran los botones á, é, ñ, ¿...
  //   frases:           función que devuelve [número, frase, autor, número, traducción, autor]
  //   direccion:        cómo comparar frases para elegir opciones equivocadas (mira significado.js)
  function crear({ id, idioma, idiomaTraduccion, teclasEspeciales, frases, direccion }) {
    // Se llama al mostrar cada frase nueva: enseña su traducción y oculta la pregunta.
    function alMostrarFrase(frase) {
      // Ya no hay pregunta en curso.
      activa = null;
      // Ocultamos la pregunta.
      el.pregunta.hidden = true;
      // Quitamos las opciones anteriores.
      el.opciones.replaceChildren();
      // Ponemos la traducción.
      el.traduccionTexto.textContent = frase[4];
      // Indicamos su idioma (para lectores de pantalla).
      el.traduccionTexto.lang = idiomaTraduccion;
      // Mostramos la traducción.
      el.traduccion.hidden = false;
    }

    // Se llama al copiar la frase entera: hace la pregunta de significado.
    function alTerminarDeEscribir(frase, api) {
      // Ocultamos la traducción: ahora hay que recordarla.
      el.traduccion.hidden = true;
      // Elegimos las tres opciones (la correcta y dos parecidas).
      const textos = elegirOpciones(frases(), frase, TECLAS_DE_OPCION.length, Math.random, direccion);
      // Creamos un botón por opción.
      const botones = textos.map((texto, posicion) => {
        // Botón de la opción.
        const boton = document.createElement("button");
        // Es un botón normal, no de formulario.
        boton.type = "button";
        // Clase para el estilo.
        boton.className = "opcion";
        // Idioma del texto de la opción.
        boton.lang = idiomaTraduccion;
        // Número de la opción (la tecla que la elige).
        const numero = document.createElement("span");
        // Clase para el estilo del número.
        numero.className = "opcion-numero";
        // El número que se ve.
        numero.textContent = TECLAS_DE_OPCION[posicion];
        // Texto de la opción.
        const textoOpcion = document.createElement("span");
        // Ponemos la traducción.
        textoOpcion.textContent = texto;
        // Juntamos número y texto dentro del botón.
        boton.append(numero, textoOpcion);
        // Al hacer clic, respondemos con esta opción.
        boton.addEventListener("click", () => responder(posicion));
        // Devolvemos el botón.
        return boton;
      });
      // Ponemos los botones en la página.
      el.opciones.replaceChildren(...botones);
      // Mostramos la pregunta.
      el.pregunta.hidden = false;
      // Guardamos la pregunta en curso.
      activa = { frase, api, textos, botones };
      // Mensaje de ánimo según cómo se escribió.
      api.mensaje(t(api.sinErrores ? "traduccion.bienEscrita" : "traduccion.escrita"), "bien");
      // Ponemos el foco en la primera opción, para poder responder con el teclado.
      botones[0].focus();
    }

    // Descripción del modo para el motor.
    return {
      id, // nombre interno
      idioma, // idioma de la frase que se copia
      teclasEspeciales, // botones de caracteres especiales
      frases, // lista de frases
      // Créditos para Tatoeba: la frase y su traducción, cada una con su autor.
      creditos: (frase) => [
        // Frase que se copia.
        ["fuente.frase", frase[0], frase[2]],
        // Traducción.
        ["fuente.traduccion", frase[3], frase[5]],
      ],
      alMostrarFrase, // enseñar la traducción
      alTerminarDeEscribir, // pregunta de significado
      alTerminarPartida: recoger, // limpieza al acabar
    };
  }

  // Con la pregunta a la vista, las teclas 1, 2 y 3 eligen opción.
  document.addEventListener("keydown", (evento) => {
    // Si no hay pregunta, o está abierto el panel de ajustes, la tecla no es para nosotros.
    if (!activa || document.querySelector("dialog[open]")) {
      // Salimos.
      return;
    }
    // Posición de la tecla pulsada entre las teclas de opción (-1 si no es ninguna).
    const posicion = TECLAS_DE_OPCION.indexOf(evento.key);
    // Si es una tecla de opción que existe...
    if (posicion >= 0 && posicion < activa.textos.length) {
      // ...evitamos que haga otra cosa...
      evento.preventDefault();
      // ...y respondemos.
      responder(posicion);
    }
  });

  // Lo que este archivo ofrece a los modos.
  return { crear };
})();
