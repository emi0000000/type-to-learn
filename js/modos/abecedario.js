// modos/abecedario.js: el modo abecedario (deletreo) y la tabla de letras.
// Se ve (y se oye) una palabra deletreada, letra por letra, en inglés o en español:
// por ejemplo «di · ou · yi». Hay que escribir la palabra (dog). La palabra está oculta con rayas
// y se va descubriendo al escribirla. Sirve para entender cuando alguien deletrea un nombre o un correo.
// Usa letras.js (nombres de las letras) y datos/vocabulario.js (palabras).

// Descripción del modo para el motor.
const ModoAbecedario = (() => {
  // Lista de frases (se prepara la primera vez).
  let frases = null;

  // Lista de frases: [número, letra o palabra, idioma]. Primero las letras sueltas y luego palabras.
  function lasFrases() {
    // La primera vez, la preparamos.
    if (frases === null) {
      // Lista nueva.
      frases = [];
      // Letras del inglés (números 1 a 26).
      LETRAS_EN.forEach(([letra], posicion) => frases.push([1 + posicion, letra, "en"]));
      // Letras del español (números 101 a 127).
      LETRAS_ES.forEach(([letra], posicion) => frases.push([101 + posicion, letra, "es"]));
      // Palabras del vocabulario (si se cargó).
      for (const entrada of typeof VOCABULARIO === "undefined" ? [] : VOCABULARIO) {
        // Palabras inglesas de 3 a 7 letras, sin espacios ni signos.
        if (/^[a-z]{3,7}$/.test(entrada[1])) {
          // Número propio para no chocar con las letras.
          frases.push([1000 + entrada[0], entrada[1], "en"]);
        }
        // Palabra española sin el artículo.
        const espanol = entrada[2].replace(/^(el|la|los|las) /, "");
        // Palabras españolas de 3 a 7 letras, sin espacios ni signos.
        if (/^[a-záéíóúüñ]{3,7}$/.test(espanol)) {
          // Número propio para no chocar con las inglesas.
          frases.push([5000 + entrada[0], espanol, "es"]);
        }
      }
    }
    // Devolvemos la lista.
    return frases;
  }

  // Descripción del modo para el motor.
  return {
    id: "abecedario", // nombre interno
    idioma: "es", // idioma por defecto (cada frase dice el suyo)
    idiomaDe: (frase) => frase[2], // idioma de cada frase
    teclas: (frase) => (frase[2] === "es" ? "es" : null), // botones de tildes y ñ en las palabras españolas
    ocultarFrase: true, // la palabra se descubre al escribirla
    leerSiempre: true, // el deletreo se oye siempre
    textoParaLeer: (frase) => deletreoHablado(frase[1], frase[2]), // lo que se lee: las letras
    consigna: (frase) => deletrear(frase[1], frase[2], idiomaActual()), // lo que se ve: los nombres de las letras
    etiqueta: (frase) => t(frase[2] === "en" ? "abc.ingles" : "abc.espanol"), // idioma del abecedario
    sinIdioma: true, // la etiqueta ya dice el idioma
    frases: lasFrases, // lista de letras y palabras
    creditos: () => [], // contenido propio del proyecto
  };
})();

// Tabla «Ver el abecedario»: todas las letras con su nombre en inglés y en español, y un botón para oírlas.
const TablaAbecedario = (() => {
  // Atajo para no escribir document.getElementById cada vez.
  const $ = (id) => document.getElementById(id);
  // Ventana de la tabla.
  const dialogo = $("abecedario");
  // Cuerpo de la tabla.
  const cuerpo = $("abecedario-filas");

  // Crea un botón pequeño de altavoz que lee un texto.
  function botonOir(texto, idioma, etiqueta) {
    // Botón.
    const boton = document.createElement("button");
    // Botón normal, no de formulario.
    boton.type = "button";
    // Clases para el estilo.
    boton.className = "boton-icono boton-pequeno";
    // Ayuda.
    boton.title = etiqueta;
    // Texto para lectores de pantalla.
    boton.setAttribute("aria-label", etiqueta);
    // Dibujo del altavoz.
    boton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-altavoz"/></svg>';
    // Al pulsarlo, se lee el texto.
    boton.addEventListener("click", () => Voz.decir(texto, idioma));
    // Si no hay voz, no se muestra.
    boton.hidden = !Voz.disponible();
    // Devolvemos el botón.
    return boton;
  }

  // Crea una celda con un texto (y, si se indica, un botón de oír).
  function celda(texto, oir) {
    // Celda.
    const td = document.createElement("td");
    // Texto.
    const span = document.createElement("span");
    // Ponemos el texto.
    span.textContent = texto;
    // Lo añadimos.
    td.append(span);
    // Si hay botón, lo añadimos.
    if (oir) {
      // Botón de oír.
      td.append(oir);
    }
    // Devolvemos la celda.
    return td;
  }

  // Rellena la tabla.
  function pintar() {
    // Filas nuevas.
    const filas = [];
    // Letras de las dos listas, sin repetir (el español tiene además la ñ).
    const letras = [...new Set([...LETRAS_EN.map(([letra]) => letra), ...LETRAS_ES.map(([letra]) => letra)])].sort((a, b) => a.localeCompare(b, "es"));
    // Una fila por letra.
    for (const letra of letras) {
      // Fila.
      const fila = document.createElement("tr");
      // Datos en inglés (puede no existir: ñ).
      const ingles = LETRAS_EN.find(([candidata]) => candidata === letra);
      // Datos en español.
      const espanol = LETRAS_ES.find(([candidata]) => candidata === letra);
      // Celda de la letra (mayúscula y minúscula).
      const letraCelda = celda(`${letra.toUpperCase()} ${letra}`);
      // Clase para la letra grande.
      letraCelda.className = "abc-letra";
      // Celda del inglés: nombre y, con la interfaz en español, cómo suena.
      const inglesCelda = ingles ? celda(ingles[1] + (idiomaActual() === "es" ? ` (${t("abc.suena")} ${ingles[2]})` : ""), botonOir(letra.toUpperCase(), "en", t("fin.escuchar"))) : celda("—");
      // Celda del español: nombre y, si los hay, otros nombres.
      const espanolCelda = espanol ? celda(espanol[1] + (VARIANTES_ES[letra] ? ` (${t("abc.tambien")} ${VARIANTES_ES[letra]})` : ""), botonOir(espanol[1], "es", t("fin.escuchar"))) : celda("—");
      // Juntamos las celdas.
      fila.append(letraCelda, inglesCelda, espanolCelda);
      // Guardamos la fila.
      filas.push(fila);
    }
    // Ponemos las filas en la tabla.
    cuerpo.replaceChildren(...filas);
  }

  // Abre la tabla.
  function abrir() {
    // La rellenamos (en el idioma actual).
    pintar();
    // Abrimos la ventana.
    dialogo.showModal();
  }

  // Al hacer clic fuera de la tabla, se cierra.
  dialogo.addEventListener("click", (evento) => {
    // Si el clic fue en el fondo (el propio diálogo)...
    if (evento.target === dialogo) {
      // ...la cerramos.
      dialogo.close();
    }
  });

  // Lo que este archivo ofrece al menú.
  return { abrir };
})();
