// modos/dictado.js: los modos de dictado (escuchar y escribir).
// La frase (o la palabra) se oye pero no se ve: está oculta con rayas y se descubre al escribirla.
// Se puede volver a oír con el botón del altavoz (y más despacio, con el ajuste «Voz más lenta»).
// En inglés y en español se usan frases cortas de Tatoeba (sin comas, que no se oyen);
// en francés, portugués, italiano y alemán, las palabras del vocabulario.

// Todo va dentro de una función que se ejecuta al momento, para no llenar el espacio global.
const ModosDictado = (() => {
  // Largo máximo de las frases de dictado (las largas cuestan mucho de recordar al oírlas).
  const LARGO_MAXIMO = 45;

  // Frases de Tatoeba aptas para dictado: sin comas y no muy largas. Devuelve [número, texto, autor].
  function frasesDeTatoeba(lista, columnaTexto, columnaAutor) {
    // Recorremos la lista y nos quedamos con las que sirven.
    return lista
      // Sin comas ni punto y coma, y de largo razonable.
      .filter((frase) => !/[,;:]/.test(frase[columnaTexto]) && frase[columnaTexto].length <= LARGO_MAXIMO)
      // Formato de frase.
      .map((frase) => [frase[0], frase[columnaTexto], frase[columnaAutor]]);
  }

  // Crea un modo de dictado.
  //   idioma: idioma de lo que se oye
  //   lista:  función que devuelve las frases [número, texto, autor, traducción (opcional)]
  //   conCreditos: true si las frases son de Tatoeba (hay que citarlas)
  function crearModo(idioma, lista, conCreditos) {
    // Frases preparadas para cada idioma de la interfaz (la traducción de las palabras cambia con él).
    const preparadas = {};
    // Descripción del modo para el motor.
    return {
      id: `dictado-${idioma}`, // nombre interno
      idioma, // idioma de lo que se oye
      teclas: TECLAS_DE_IDIOMA[idioma], // botones de letras especiales
      ocultarFrase: true, // la frase no se ve hasta escribirla
      leerSiempre: true, // se lee siempre en voz alta
      sinIdioma: true, // la etiqueta ya dice el idioma
      // Lista de frases.
      frases() {
        // Idioma de la interfaz.
        const interfaz = idiomaActual();
        // Si no están preparadas, las preparamos.
        if (!preparadas[interfaz]) {
          // Frases del idioma.
          preparadas[interfaz] = lista();
        }
        // Las devolvemos.
        return preparadas[interfaz];
      },
      nota: (frase) => frase[3] || "", // traducción de la palabra (solo en las palabras sueltas)
      consigna: () => t("dictado.consigna"), // "Escucha y escribe lo que oyes"
      etiqueta: () => t(`idioma.${idioma}`), // idioma
      disponible: () => Voz.hayVozPara(idioma), // hace falta una voz de ese idioma
      noDisponible: () => t("dictado.sinVoz"), // aviso si no hay voz
      // Créditos para Tatoeba (si las frases son suyas).
      creditos: (frase) => (conCreditos ? [["fuente.frase", frase[0], frase[2]]] : []),
    };
  }

  // Palabras del vocabulario de otro idioma, como frases de dictado: [número, palabra, "", traducción].
  // (La traducción ayuda a saber qué palabra es cuando dos suenan igual).
  function palabras(idioma) {
    // Palabras con su traducción al idioma de la interfaz.
    return ModosVocabulario.palabrasDe(idioma).map((frase) => [frase[0], frase[1], "", frase[4]]);
  }

  // Los seis modos de dictado.
  return {
    // Inglés: frases en inglés de las parejas de Tatoeba.
    en: crearModo("en", () => frasesDeTatoeba(typeof FRASES_EN === "undefined" ? [] : FRASES_EN, 1, 2), true),
    // Español: frases del modo ortografía.
    es: crearModo("es", () => frasesDeTatoeba(typeof FRASES_ES === "undefined" ? [] : FRASES_ES, 1, 2), true),
    // Francés, portugués, italiano y alemán: palabras.
    fr: crearModo("fr", () => palabras("fr"), false),
    pt: crearModo("pt", () => palabras("pt"), false),
    it: crearModo("it", () => palabras("it"), false),
    de: crearModo("de", () => palabras("de"), false),
  };
})();
