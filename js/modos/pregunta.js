// modos/pregunta.js: las preguntas de opción múltiple que usan varios modos.
// Muestra un título y tres opciones (se eligen con el ratón o con las teclas 1, 2 y 3),
// marca la correcta en verde y la elegida, si está mal, en rojo.
// La usan traduccion.js («¿Qué significa?») y eleccion.js («¿Cuál es la correcta?»).

// Todo va dentro de una función que se ejecuta al momento, para no llenar el espacio global.
const Pregunta = (() => {
  // Teclas para elegir opción con el teclado.
  const TECLAS = ["1", "2", "3", "4"];
  // Atajo para no escribir document.getElementById cada vez.
  const $ = (id) => document.getElementById(id);
  // Elementos de la página.
  const el = {
    bloque: $("pregunta"), // bloque de la pregunta
    titulo: $("pregunta-texto"), // título de la pregunta
    opciones: $("opciones"), // botones de las opciones
  };
  // Pregunta en curso: { opciones, botones, alResponder }, o null si no hay.
  let activa = null;

  // Hace una pregunta.
  //   titulo:      texto de la pregunta
  //   opciones:    lista de { texto, correcta, explicacion } (la explicación es opcional)
  //   idioma:      idioma del texto de las opciones (para lectores de pantalla)
  //   codigo:      true si las opciones son fórmulas o código (letra de máquina)
  //   alResponder: función (opción elegida, acierto) que se llama al responder
  function hacer({ titulo, opciones, idioma = "", codigo = false, alResponder }) {
    // Ponemos el título.
    el.titulo.textContent = titulo;
    // Creamos un botón por opción.
    const botones = opciones.map((opcion, posicion) => {
      // Botón de la opción.
      const boton = document.createElement("button");
      // Es un botón normal, no de formulario.
      boton.type = "button";
      // Clases para el estilo (con letra de máquina si es código).
      boton.className = codigo ? "opcion opcion-codigo" : "opcion";
      // Idioma del texto de la opción.
      if (idioma) {
        // Lo indicamos.
        boton.lang = idioma;
      }
      // Número de la opción (la tecla que la elige).
      const numero = document.createElement("span");
      // Clase para el estilo del número.
      numero.className = "opcion-numero";
      // El número que se ve.
      numero.textContent = TECLAS[posicion];
      // Texto de la opción.
      const texto = document.createElement("span");
      // Clase para el estilo del texto.
      texto.className = "opcion-texto";
      // Ponemos el texto.
      texto.textContent = opcion.texto;
      // Juntamos número y texto dentro del botón.
      boton.append(numero, texto);
      // Al hacer clic, respondemos con esta opción.
      boton.addEventListener("click", () => responder(posicion));
      // Devolvemos el botón.
      return boton;
    });
    // Ponemos los botones en la página.
    el.opciones.replaceChildren(...botones);
    // Mostramos la pregunta.
    el.bloque.hidden = false;
    // Guardamos la pregunta en curso.
    activa = { opciones, botones, alResponder };
    // Ponemos el foco en la primera opción, para poder responder con el teclado.
    botones[0].focus();
  }

  // Responde la pregunta en curso con la opción de la posición indicada.
  function responder(posicion) {
    // Si no hay pregunta en curso, no hacemos nada.
    if (!activa) {
      // Salimos.
      return;
    }
    // Sacamos los datos de la pregunta.
    const { opciones, botones, alResponder } = activa;
    // La pregunta ya está respondida.
    activa = null;
    // Opción elegida.
    const elegida = opciones[posicion];
    // Recorremos los botones.
    botones.forEach((boton, indice) => {
      // Ya no se pueden pulsar.
      boton.disabled = true;
      // La correcta se marca en verde.
      if (opciones[indice].correcta) {
        // Clase de opción correcta.
        boton.classList.add("correcta");
        // La elegida, si era equivocada, en rojo.
      } else if (indice === posicion) {
        // Clase de opción incorrecta.
        boton.classList.add("incorrecta");
      }
    });
    // Avisamos al modo.
    alResponder(elegida, Boolean(elegida.correcta));
  }

  // Quita la pregunta de la pantalla.
  function recoger() {
    // No queda pregunta en curso.
    activa = null;
    // Ocultamos el bloque.
    el.bloque.hidden = true;
    // Quitamos las opciones.
    el.opciones.replaceChildren();
  }

  // Mezcla una lista al azar y devuelve una copia (para colocar la correcta en cualquier posición).
  function mezclarOpciones(lista) {
    // Usamos la función de significado.js.
    return mezclar(lista);
  }

  // Con la pregunta a la vista, las teclas 1, 2 y 3 eligen opción.
  document.addEventListener("keydown", (evento) => {
    // Si no hay pregunta, o hay una ventana abierta, la tecla no es para nosotros.
    if (!activa || document.querySelector("dialog[open]")) {
      // Salimos.
      return;
    }
    // Posición de la tecla pulsada entre las teclas de opción (-1 si no es ninguna).
    const posicion = TECLAS.indexOf(evento.key);
    // Si es una tecla de opción que existe...
    if (posicion >= 0 && posicion < activa.opciones.length) {
      // ...evitamos que haga otra cosa...
      evento.preventDefault();
      // ...y respondemos.
      responder(posicion);
    }
  });

  // Lo que este archivo ofrece a los modos.
  return { hacer, recoger, mezclarOpciones };
})();
