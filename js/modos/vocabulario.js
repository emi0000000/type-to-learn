// modos/vocabulario.js: los modos de vocabulario (palabras y expresiones por temas).
// «Palabras en inglés»: escribes la palabra en inglés viendo su traducción y luego eliges qué significa.
// «Palabras en español»: al revés, escribes la palabra en español y eliges su significado en inglés.
// Las opciones equivocadas son del mismo tema (animales con animales, colores con colores...),
// para que haya que conocer la palabra y no solo adivinar el tema.
// «Palabras en francés, portugués, italiano y alemán»: lo mismo con las palabras más comunes de esos idiomas.
// Usan datos/vocabulario.js, datos/vocabulario-idiomas.js y la parte común de traduccion.js.

// Botones de letras especiales de cada idioma, para teclados que no las tienen.
// ("es" son los del español: á, é, ñ, ¿...; el inglés no necesita ninguno).
const TECLAS_DE_IDIOMA = {
  en: null, // inglés: ninguno
  es: "es", // español
  fr: ["é", "è", "ê", "à", "â", "ç", "ù", "û", "î", "ô", "ï", "œ"], // francés
  pt: ["ã", "õ", "á", "â", "ê", "ô", "é", "í", "ó", "ú", "ç", "à"], // portugués
  it: ["à", "è", "é", "ì", "ò", "ù"], // italiano
  de: ["ä", "ö", "ü", "ß", "Ä", "Ö", "Ü"], // alemán
};

// Todo va dentro de una función que se ejecuta al momento, para no llenar el espacio global.
const ModosVocabulario = (() => {
  // Lista de palabras; vacía si el archivo no se pudo cargar.
  // Cada una es [número, inglés, español, tema, nota en español, nota en inglés].
  function lista() {
    // VOCABULARIO la crea datos/vocabulario.js.
    return typeof VOCABULARIO === "undefined" ? [] : VOCABULARIO;
  }

  // Busca una palabra por su número.
  function buscar(numero) {
    // La primera con ese número.
    return lista().find((entrada) => entrada[0] === numero);
  }

  // Crea uno de los dos modos.
  //   id:               nombre interno
  //   idioma:           idioma de la palabra que se copia
  //   idiomaTraduccion: idioma de la traducción
  //   columna:          columna de la palabra que se copia (1 = inglés, 2 = español)
  //   teclas:           botones de caracteres especiales
  function crearModo({ id, idioma, idiomaTraduccion, columna, teclas }) {
    // Columna de la traducción (la otra).
    const otra = columna === 1 ? 2 : 1;
    // Frases del modo (se preparan la primera vez).
    let frases = null;

    // Lista de frases: [número, palabra, "", número, traducción, "", tema].
    function lasFrases() {
      // La primera vez, la preparamos.
      if (frases === null) {
        // Una frase por palabra.
        frases = lista().map((entrada) => [entrada[0], entrada[columna], "", entrada[0], entrada[otra], "", entrada[3]]);
      }
      // Devolvemos la lista.
      return frases;
    }

    // Elige dos traducciones equivocadas del mismo tema.
    function opciones(frase) {
      // Traducción correcta, en minúscula (para comparar).
      const correcta = frase[4].toLowerCase();
      // Traducciones del mismo tema, distintas de la correcta.
      const delTema = lasFrases().filter((otraFrase) => otraFrase[6] === frase[6] && otraFrase[4].toLowerCase() !== correcta);
      // Si el tema tiene pocas, completamos con cualquier otra palabra.
      const candidatas = delTema.length >= 2 ? delTema : lasFrases().filter((otraFrase) => otraFrase[4].toLowerCase() !== correcta);
      // Mezclamos y nos quedamos con dos textos.
      return mezclar(candidatas).slice(0, 2).map((otraFrase) => otraFrase[4]);
    }

    // Creamos el modo con la parte común de traduccion.js.
    return Traduccion.crear({
      id, // nombre interno
      idioma, // idioma de la palabra que se copia
      idiomaTraduccion, // idioma de la traducción
      teclas, // botones de caracteres especiales
      frases: lasFrases, // lista de palabras
      opciones, // opciones equivocadas del mismo tema
      // Etiqueta: el tema de la palabra.
      etiqueta: (frase) => t(`tema.${frase[6]}`),
      // Nota: otras formas de decirlo, en el idioma de la interfaz.
      nota: (frase) => {
        // Palabra original.
        const entrada = buscar(frase[0]);
        // Nota en el idioma de la interfaz (o nada).
        return entrada ? (idiomaActual() === "en" ? entrada[5] : entrada[4]) : "";
      },
      // Lista escrita para el proyecto: no hay que citar a nadie.
      creditos: () => [],
    });
  }

  // Lista de palabras en otros idiomas: [número, francés, portugués, italiano, alemán].
  function listaOtros() {
    // VOCABULARIO_IDIOMAS la crea datos/vocabulario-idiomas.js.
    return typeof VOCABULARIO_IDIOMAS === "undefined" ? [] : VOCABULARIO_IDIOMAS;
  }

  // Columna de cada idioma en datos/vocabulario-idiomas.js.
  const COLUMNAS_OTROS = { fr: 1, pt: 2, it: 3, de: 4 };

  // Palabras de otro idioma (francés, portugués, italiano o alemán) con su traducción
  // al idioma de la interfaz y su tema: [número, palabra, "", número, traducción, "", tema].
  function palabrasDe(idioma) {
    // Palabras de ese idioma, con los datos de la lista principal.
    return listaOtros()
      // Unimos cada palabra con su entrada en español e inglés.
      .map((fila) => [fila, buscar(fila[0])])
      // Solo las que existen en la lista principal.
      .filter(([, entrada]) => entrada)
      // Formato de frase (traducción al español o al inglés, según la interfaz).
      .map(([fila, entrada]) => [fila[0], fila[COLUMNAS_OTROS[idioma]], "", fila[0], idiomaActual() === "en" ? entrada[1] : entrada[2], "", entrada[3]]);
  }

  // Crea el modo de palabras de otro idioma.
  function crearModoOtro(idioma) {
    // Frases preparadas para cada idioma de la interfaz.
    const preparadas = {};
    // Lista de frases (cambia la traducción con el idioma de la interfaz).
    function frases() {
      // Idioma de la interfaz.
      const interfaz = idiomaActual();
      // Si no están preparadas, las preparamos.
      if (!preparadas[interfaz]) {
        // Palabras con su traducción.
        preparadas[interfaz] = palabrasDe(idioma);
      }
      // Las devolvemos.
      return preparadas[interfaz];
    }
    // Elige dos traducciones equivocadas del mismo tema.
    function opciones(frase) {
      // Traducción correcta, en minúscula.
      const correcta = frase[4].toLowerCase();
      // Del mismo tema y distintas.
      const delTema = frases().filter((otra) => otra[6] === frase[6] && otra[4].toLowerCase() !== correcta);
      // Si el tema tiene pocas, cualquier otra.
      const candidatas = delTema.length >= 2 ? delTema : frases().filter((otra) => otra[4].toLowerCase() !== correcta);
      // Dos al azar.
      return mezclar(candidatas).slice(0, 2).map((otra) => otra[4]);
    }
    // Creamos el modo.
    return Traduccion.crear({
      id: `palabras-${idioma}`, // nombre interno
      idioma, // idioma de la palabra que se copia
      idiomaTraduccion: () => idiomaActual(), // la traducción está en el idioma de la interfaz
      teclas: TECLAS_DE_IDIOMA[idioma], // botones de letras de ese idioma
      frases, // lista de palabras
      opciones, // opciones equivocadas del mismo tema
      etiqueta: (frase) => t(`tema.${frase[6]}`), // tema
      creditos: () => [], // lista propia del proyecto
    });
  }

  // Todos los modos.
  return {
    // Palabras en inglés: se copia el inglés, la traducción está en español.
    ingles: crearModo({ id: "palabras-ingles", idioma: "en", idiomaTraduccion: "es", columna: 1, teclas: null }),
    // Palabras en español: se copia el español (con botones de tildes), la traducción está en inglés.
    espanol: crearModo({ id: "palabras-espanol", idioma: "es", idiomaTraduccion: "en", columna: 2, teclas: "es" }),
    // Palabras en francés, portugués, italiano y alemán.
    fr: crearModoOtro("fr"),
    pt: crearModoOtro("pt"),
    it: crearModoOtro("it"),
    de: crearModoOtro("de"),
    // Para otros modos (dictado y pronunciación): las palabras de un idioma.
    palabrasDe,
    // Y la palabra original (con su traducción y su tema) por número.
    buscar,
  };
})();
