// modos/vocabulario.js: los modos de vocabulario (palabras y expresiones por temas).
// «Palabras en inglés»: escribes la palabra en inglés viendo su traducción y luego eliges qué significa.
// «Palabras en español»: al revés, escribes la palabra en español y eliges su significado en inglés.
// Las opciones equivocadas son del mismo tema (animales con animales, colores con colores...),
// para que haya que conocer la palabra y no solo adivinar el tema.
// Usan datos/vocabulario.js y la parte común de traduccion.js.

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

  // Los dos modos.
  return {
    // Palabras en inglés: se copia el inglés, la traducción está en español.
    ingles: crearModo({ id: "palabras-ingles", idioma: "en", idiomaTraduccion: "es", columna: 1, teclas: null }),
    // Palabras en español: se copia el español (con botones de tildes), la traducción está en inglés.
    espanol: crearModo({ id: "palabras-espanol", idioma: "es", idiomaTraduccion: "en", columna: 2, teclas: "es" }),
  };
})();
