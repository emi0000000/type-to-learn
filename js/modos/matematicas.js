// modos/matematicas.js: los modos de matemáticas (álgebra, trigonometría y cálculo).
// Se ve el nombre de una fórmula y hay que elegir la correcta entre tres (las otras dos tienen
// errores típicos: olvidar el doble producto, cambiar un signo...). Después se escribe la correcta.
// Usan datos/matematicas.js y la parte común de eleccion.js.

// Todo va dentro de una función que se ejecuta al momento, para no llenar el espacio global.
const ModosMatematicas = (() => {
  // Botones de símbolos que no están en el teclado (y ^, que en los teclados españoles es una tecla muerta).
  const TECLAS = ["^", "√", "π", "±", "·", "≤", "≥", "≠", "→", "∞", "∫", "Δ", "θ", "°"];

  // Lista de fórmulas; vacía si el archivo no se pudo cargar.
  // Cada una es [número, tema, fórmula, nombre en español, nombre en inglés, [dos versiones con error]].
  function lista() {
    // FORMULAS la crea datos/matematicas.js.
    return typeof FORMULAS === "undefined" ? [] : FORMULAS;
  }

  // Adapta una fórmula al idioma de la interfaz: en español el seno se escribe "sen".
  function adaptar(formula) {
    // Solo en español, y solo la palabra sin completa (no dentro de otras palabras).
    return idiomaActual() === "es" ? formula.replace(/\bsin\b/g, "sen") : formula;
  }

  // Crea el modo de un tema ("algebra", "trigonometria" o "calculo").
  function crearModo(tema) {
    // Frases ya preparadas para cada idioma de la interfaz.
    const preparadas = {};

    // Lista de frases: [número, fórmula, "", 0, "", "", datos de la fórmula].
    function frases() {
      // Idioma de la interfaz (cambia sen/sin).
      const idioma = idiomaActual();
      // Si no están preparadas para este idioma, las preparamos.
      if (!preparadas[idioma]) {
        // Fórmulas del tema, adaptadas al idioma.
        preparadas[idioma] = lista()
          // Solo las del tema.
          .filter((formula) => formula[1] === tema)
          // Formato de frase.
          .map((formula) => [formula[0], adaptar(formula[2]), "", 0, "", "", formula]);
      }
      // Devolvemos la lista.
      return preparadas[idioma];
    }

    // Creamos el modo con la parte común de eleccion.js.
    return Eleccion.crear({
      id: `mates-${tema}`, // nombre interno
      idioma: "zxx", // las fórmulas no son de ningún idioma
      teclas: TECLAS, // botones de símbolos
      frases, // lista de fórmulas
      // Encima de la fórmula tapada, su nombre en el idioma de la interfaz.
      consigna: (frase) => (idiomaActual() === "en" ? frase[6][4] : frase[6][3]),
      // Etiqueta: el tema.
      etiqueta: () => t(`tema.${tema}`),
      // Título de la pregunta.
      tituloPregunta: "eleccion.pregunta.formula",
      // Opciones: la correcta y las dos con errores típicos.
      opciones: (frase) => [{ texto: frase[1], correcta: true }, ...frase[6][5].map((mal) => ({ texto: adaptar(mal), correcta: false }))],
    });
  }

  // Los tres modos.
  return { algebra: crearModo("algebra"), trigonometria: crearModo("trigonometria"), calculo: crearModo("calculo"), TECLAS };
})();
