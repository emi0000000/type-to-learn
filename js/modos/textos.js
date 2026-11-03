// modos/textos.js: los modos «Textos largos» y «Traduce textos» de la sección Idiomas.
// - «Textos largos»: se copia un párrafo entero en el idioma que se aprende, viendo su traducción debajo.
//   Sirve para practicar la escritura (ortografía, acentos, signos) con textos de verdad, no solo frases.
// - «Traduce textos»: se ve una frase en tu idioma y se escribe en el que aprendes. La traducción está oculta
//   con rayas (se ve cuántas letras tiene cada palabra) y se va descubriendo al acertar; un error resta una vida.
// Usan datos/textos-largos.js. El idioma de partida es el español si se aprende inglés, el inglés si se aprende
// español, y el de la interfaz para los demás idiomas.

// Todo va dentro de una función que se ejecuta al momento, para no llenar el espacio global.
const ModosTextos = (() => {
  // Lista de textos; vacía si el archivo no se pudo cargar.
  function lista() {
    // TEXTOS_LARGOS la crea datos/textos-largos.js.
    return typeof TEXTOS_LARGOS === "undefined" ? [] : TEXTOS_LARGOS;
  }

  // Idioma desde el que se traduce al aprender uno.
  function idiomaOrigen(idioma) {
    // Inglés <-> español; los demás, desde el de la interfaz.
    return idioma === "en" ? "es" : idioma === "es" ? "en" : idiomaActual();
  }

  // Crea el modo «Textos largos» de un idioma.
  function crearLargos(idioma) {
    // Frases preparadas para cada idioma de la interfaz.
    const preparadas = {};
    // Descripción del modo para el motor.
    return {
      id: `textos-${idioma}`, // nombre interno
      idioma, // se copia en este idioma
      teclas: TECLAS_DE_IDIOMA[idioma], // botones de letras especiales
      // Lista: [número, párrafo, "", traducción, título, nivel].
      frases() {
        // Idioma de la interfaz.
        const interfaz = idiomaActual();
        // Si no están, se preparan.
        if (!preparadas[interfaz]) {
          // Un párrafo por texto.
          preparadas[interfaz] = lista().map((texto) => [texto.id, texto[idioma].join(" "), "", texto[idiomaOrigen(idioma)].join(" "), texto.titulo, texto.nivel]);
        }
        // Devolvemos.
        return preparadas[interfaz];
      },
      consigna: (frase) => (idiomaActual() === "en" ? frase[4][1] : frase[4][0]), // el título
      etiqueta: () => t(`idioma.${idioma}`), // el idioma
      sinIdioma: true, // la etiqueta ya lo dice
      nota: (frase) => frase[3], // la traducción
      largo: (frase) => [10, 30, 50][frase[5] - 1], // dificultad según el nivel
      creditos: () => [], // contenido propio
    };
  }

  // Crea el modo «Traduce textos» de un idioma.
  function crearTraducir(idioma) {
    // Frases preparadas para cada idioma de la interfaz.
    const preparadas = {};
    // Descripción del modo para el motor.
    return {
      id: `traducir-${idioma}`, // nombre interno
      idioma, // se escribe en este idioma
      teclas: TECLAS_DE_IDIOMA[idioma], // botones de letras especiales
      ocultarFrase: true, // la traducción está oculta con rayas
      sinVoz: true, // leerla en voz alta daría la respuesta
      sinIdioma: true, // la etiqueta ya lo dice
      // Lista: [número, frase en el idioma que se aprende, "", frase de partida, título, nivel].
      frases() {
        // Idioma de la interfaz.
        const interfaz = idiomaActual();
        // Si no están, se preparan.
        if (!preparadas[interfaz]) {
          // Una por frase de cada texto (número: texto × 10 + posición).
          preparadas[interfaz] = lista().flatMap((texto) => texto[idioma].map((frase, i) => [texto.id * 10 + i, frase, "", texto[idiomaOrigen(idioma)][i], texto.titulo, texto.nivel]));
        }
        // Devolvemos.
        return preparadas[interfaz];
      },
      consigna: (frase) => frase[3], // la frase que hay que traducir
      etiqueta: () => `${t(`idioma.${idiomaOrigen(idioma)}`)} → ${t(`idioma.${idioma}`)}`, // de qué idioma a cuál
      nota: () => t("traducir.nota"), // "Las rayas te dicen cuántas letras tiene cada palabra"
      creditos: () => [], // contenido propio
    };
  }

  // Idiomas.
  const IDIOMAS = ["en", "es", "fr", "pt", "it", "de"];
  // Los dos modos de cada idioma.
  return {
    largos: Object.fromEntries(IDIOMAS.map((idioma) => [idioma, crearLargos(idioma)])), // textos largos
    traducir: Object.fromEntries(IDIOMAS.map((idioma) => [idioma, crearTraducir(idioma)])), // traduce textos
  };
})();
