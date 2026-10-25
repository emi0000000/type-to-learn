// modos/ingles.js: el modo inglés.
// Muestra una frase en inglés y su traducción al español. Hay que copiar la frase exacta
// (cada error resta una vida) y después confirmar que se entiende: la traducción se oculta
// y hay que elegir su significado entre tres opciones (equivocarse también resta una vida).
// Solo usa las frases de datos/frases-en.js: no se mezcla con los otros modos.
// Lo que comparten todos los modos (vidas, errores, resultado) está en js/motor.js.

// Todo el modo va dentro de una función que se ejecuta al momento, para no llenar el espacio global.
const ModoIngles = (() => {
  // Milisegundos de pausa tras fallar el significado, para leer la respuesta correcta.
  const PAUSA_TRAS_FALLO = 2200;
  // Teclas para elegir opción con el teclado.
  const TECLAS_DE_OPCION = ["1", "2", "3"];

  // Atajo para no escribir document.getElementById cada vez.
  const $ = (id) => document.getElementById(id);
  // Elementos de la página que usa este modo.
  const el = {
    traduccion: $("ingles-traduccion"), // bloque de la traducción
    traduccionTexto: $("ingles-traduccion-texto"), // texto de la traducción
    pregunta: $("ingles-pregunta"), // bloque de la pregunta "¿Qué significa?"
    opciones: $("ingles-opciones"), // botones de las opciones
  };

  // Pregunta en curso: { frase, api, textos, botones }, o null si no hay pregunta.
  let activa = null;

  // Pone una frase entre comillas latinas para citarla dentro de un mensaje.
  // Según la RAE, el punto final va fuera de las comillas: «Tengo hambre». (no «Tengo hambre.».)
  // Los signos ? y ! se quedan dentro, y los puntos suspensivos también.
  function citar(texto) {
    // Si termina en un punto que no es parte de unos puntos suspensivos, lo quitamos.
    const sinPunto = texto.endsWith(".") && !texto.endsWith("...") ? texto.slice(0, -1) : texto;
    // Devolvemos la frase entre comillas.
    return `«${sinPunto}»`;
  }

  // Lista de frases del modo; vacía si el archivo de frases no se pudo cargar.
  function frases() {
    // FRASES_EN la crea datos/frases-en.js.
    return typeof FRASES_EN === "undefined" ? [] : FRASES_EN;
  }

  // Se llama al mostrar cada frase nueva: enseña su traducción y oculta la pregunta.
  function alMostrarFrase(frase) {
    // Ya no hay pregunta en curso.
    activa = null;
    // Ocultamos la pregunta.
    el.pregunta.hidden = true;
    // Quitamos las opciones anteriores.
    el.opciones.replaceChildren();
    // Ponemos la traducción (cada frase es [número, inglés, autor, número, traducción, autor]).
    el.traduccionTexto.textContent = frase[4];
    // Mostramos la traducción.
    el.traduccion.hidden = false;
  }

  // Se llama al copiar la frase entera: hace la pregunta de significado.
  function alTerminarDeEscribir(frase, api) {
    // Ocultamos la traducción: ahora hay que recordarla.
    el.traduccion.hidden = true;
    // Elegimos las tres opciones (la correcta y dos parecidas).
    const textos = elegirOpciones(frases(), frase, TECLAS_DE_OPCION.length);
    // Creamos un botón por opción.
    const botones = textos.map((texto, posicion) => {
      // Botón de la opción.
      const boton = document.createElement("button");
      // Es un botón normal, no de formulario.
      boton.type = "button";
      // Clase para el estilo.
      boton.className = "opcion";
      // Idioma del texto de la opción.
      boton.lang = "es";
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
    api.mensaje(api.sinErrores ? "¡Bien escrita! Ahora elige qué significa." : "Escrita. Ahora elige qué significa.", "bien");
    // Ponemos el foco en la primera opción, para poder responder con el teclado.
    botones[0].focus();
  }

  // Responde la pregunta con la opción de la posición indicada.
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
      api.superar("¡Correcto! Frase superada.");
      // Terminamos aquí.
      return;
    }
    // Si falló, pierde una vida y lo guardamos para el repaso.
    const sigue = api.fallar(
      {
        palabra: frase[1], // la frase en inglés
        marca: -1, // sin letra que resaltar
        espacio: false, // no es un error de espacio
        explicacion: `Significa ${citar(correcta)}. Elegiste ${citar(elegida)}.`, // explicación para el repaso
      },
      // Mensaje bajo la caja de texto.
      `No es eso: significa ${citar(correcta)}.`,
    );
    // Si la partida sigue, pasamos a la siguiente frase (sin contar esta) tras leer la respuesta.
    if (sigue) {
      // Siguiente frase tras una pausa.
      api.siguiente(PAUSA_TRAS_FALLO);
    }
  }

  // Se llama al terminar la partida: recoge la traducción y la pregunta.
  function alTerminarPartida() {
    // No queda pregunta en curso.
    activa = null;
    // Ocultamos la pregunta.
    el.pregunta.hidden = true;
    // Quitamos las opciones.
    el.opciones.replaceChildren();
    // Ocultamos la traducción.
    el.traduccion.hidden = true;
  }

  // Con la pregunta a la vista, las teclas 1, 2 y 3 eligen opción.
  document.addEventListener("keydown", (evento) => {
    // Si no hay pregunta, la tecla no es para nosotros.
    if (!activa) {
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

  // Descripción del modo para el motor.
  return {
    // Nombre interno: se usa para guardar en el navegador las frases vistas y el récord.
    id: "ingles",
    // Nombre que se ve en pantalla.
    nombre: "Inglés",
    // Idioma de las frases que se copian.
    idioma: "en",
    // En inglés no hacen falta los botones de tildes ni de ¿ ¡.
    teclasEspeciales: false,
    // Lista de frases.
    frases,
    // Créditos para Tatoeba: la frase en inglés y su traducción, cada una con su autor.
    creditos: (frase) => [
      // Frase en inglés.
      ["Frase", frase[0], frase[2]],
      // Traducción al español.
      ["Traducción", frase[3], frase[5]],
    ],
    // Pasos propios del modo.
    alMostrarFrase,
    // Pregunta de significado.
    alTerminarDeEscribir,
    // Limpieza al acabar.
    alTerminarPartida,
  };
})();
