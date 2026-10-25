// modos/falsos.js: los modos de «falsos amigos» (palabras que se parecen pero no significan lo mismo).
// «Falsos amigos (inglés)»: se ve una palabra en inglés (embarrassed) y hay que elegir qué significa
// en español entre tres opciones; una es la trampa (embarazada). Después se escribe la palabra.
// «Falsos amigos (español)»: al revés, se ve la palabra en español (embarazada) y se elige
// qué significa en inglés (pregnant); la trampa es la palabra inglesa que se le parece (embarrassed).
// Usan datos/falsos-amigos.js y la parte común de eleccion.js.

// Todo va dentro de una función que se ejecuta al momento, para no llenar el espacio global.
const ModosFalsos = (() => {
  // Lista de falsos amigos; vacía si el archivo no se pudo cargar.
  // Cada uno es [número, palabra en inglés, su significado en español, palabra española parecida, su significado en inglés].
  function lista() {
    // FALSOS_AMIGOS la crea datos/falsos-amigos.js.
    return typeof FALSOS_AMIGOS === "undefined" ? [] : FALSOS_AMIGOS;
  }

  // Otra entrada al azar distinta de una dada (para la tercera opción).
  function otra(entrada, columna) {
    // Entradas con un significado distinto.
    const candidatas = lista().filter((candidata) => candidata[0] !== entrada[0] && candidata[columna] !== entrada[columna]);
    // Una al azar.
    return candidatas[Math.floor(Math.random() * candidatas.length)];
  }

  // Modo para aprender inglés: palabra inglesa, significado en español.
  const ingles = Eleccion.crear({
    id: "falsos-en", // nombre interno
    idioma: "en", // la palabra está en inglés
    sinIdioma: true, // la etiqueta ya lo dice
    tapar: false, // la palabra se ve: es la pregunta
    codigo: false, // opciones en letra normal
    // Lista de frases: [número, palabra en inglés, "", 0, "", "", datos].
    frases: () => lista().map((entrada) => [entrada[0], entrada[1], "", 0, "", "", entrada]),
    etiqueta: () => t("idioma.en"), // inglés
    consigna: () => t("falsos.consigna.en"), // "¿Qué significa en español?"
    tituloPregunta: "falsos.pregunta.en", // "Significa…"
    // Opciones: el significado, la trampa y otro significado cualquiera.
    opciones: (frase) => {
      // Datos de la palabra.
      const entrada = frase[6];
      // Tercera opción.
      const tercera = otra(entrada, 2);
      // Las tres.
      return [
        { texto: entrada[2], correcta: true }, // el significado de verdad
        { texto: entrada[3], correcta: false, explicacion: t("falsos.trampa", { trampa: entrada[3], significa: entrada[4] }) }, // la trampa
        { texto: tercera[2], correcta: false, explicacion: t("falsos.esOtra", { palabra: tercera[1], significa: tercera[2] }) }, // otro significado
      ];
    },
    // Al acertar, se recuerda la trampa.
    alAcertar: (frase) => t("falsos.trampa", { trampa: frase[6][3], significa: frase[6][4] }),
    creditos: () => [], // contenido propio del proyecto
  });

  // Modo para aprender español: palabra española, significado en inglés.
  const espanol = Eleccion.crear({
    id: "falsos-es", // nombre interno
    idioma: "es", // la palabra está en español
    teclas: "es", // botones de tildes y ñ
    sinIdioma: true, // la etiqueta ya lo dice
    tapar: false, // la palabra se ve: es la pregunta
    codigo: false, // opciones en letra normal
    // Lista de frases: [número, palabra en español, "", 0, "", "", datos].
    frases: () => lista().map((entrada) => [entrada[0], entrada[3], "", 0, "", "", entrada]),
    etiqueta: () => t("idioma.es"), // español
    consigna: () => t("falsos.consigna.es"), // "What does it mean in English?"
    tituloPregunta: "falsos.pregunta.es", // "It means…"
    // Opciones: el significado, la trampa y otro significado cualquiera.
    opciones: (frase) => {
      // Datos de la palabra.
      const entrada = frase[6];
      // Tercera opción.
      const tercera = otra(entrada, 4);
      // Las tres.
      return [
        { texto: entrada[4], correcta: true }, // el significado de verdad
        { texto: entrada[1], correcta: false, explicacion: t("falsos.trampa", { trampa: entrada[1], significa: entrada[2] }) }, // la trampa
        { texto: tercera[4], correcta: false, explicacion: t("falsos.esOtra", { palabra: tercera[3], significa: tercera[4] }) }, // otro significado
      ];
    },
    // Al acertar, se recuerda la trampa.
    alAcertar: (frase) => t("falsos.trampa", { trampa: frase[6][1], significa: frase[6][2] }),
    creditos: () => [], // contenido propio del proyecto
  });

  // Los dos modos.
  return { ingles, espanol };
})();
