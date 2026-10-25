// modos/teclado.js: las lecciones de teclado, para aprender dónde está cada tecla.
// En cada lección se ve el teclado en la pantalla con la siguiente tecla señalada (y el dedo que la pulsa).
// Hay lecciones para cada fila, todas las letras, mayúsculas, números, tildes y símbolos.
// Los ejercicios se adaptan al tipo de teclado elegido (España, Latinoamérica o Estados Unidos).
// Usan teclado.js (lecciones y ejercicios) y tecladoVisual.js (tipo de teclado y dibujo).

// Lista de modos, uno por lección.
const ModosTeclado = (() => {
  // Textos de donde se sacan palabras y frases (se preparan la primera vez que hacen falta).
  let fuentes = null;

  // Prepara (una sola vez) las frases en español y en inglés de los archivos de datos.
  function lasFuentes() {
    // La primera vez, las preparamos.
    if (fuentes === null) {
      // Frases de cada idioma (solo el texto).
      fuentes = {
        frasesEs: (typeof FRASES_ES === "undefined" ? [] : FRASES_ES).map((frase) => frase[1]), // español
        frasesEn: (typeof FRASES_EN === "undefined" ? [] : FRASES_EN).map((frase) => frase[1]), // inglés
      };
    }
    // Devolvemos los textos.
    return fuentes;
  }

  // Crea el modo de una lección.
  function crearModo(leccion) {
    // Ejercicios ya preparados para cada tipo de teclado.
    const preparados = {};
    // Descripción del modo para el motor.
    return {
      id: `teclado-${leccion.id}`, // nombre interno
      leccion, // datos de la lección (para el menú)
      // Idioma de los ejercicios: inglés con el teclado inglés, español con los otros.
      get idioma() {
        // Según el teclado.
        return TecladoVisual.disposicionActual() === "us" ? "en" : "es";
      },
      sinIdioma: true, // no se muestra el idioma
      sinVoz: true, // no se leen los ejercicios
      mostrarTeclado: true, // el teclado siempre a la vista
      // Ejercicios para el teclado actual.
      frases() {
        // Tipo de teclado.
        const disposicion = TecladoVisual.disposicionActual();
        // Si no están preparados, los preparamos.
        if (!preparados[disposicion]) {
          // Ejercicios de la lección.
          preparados[disposicion] = ejerciciosDeLeccion(leccion, disposicion, lasFuentes());
        }
        // Los devolvemos.
        return preparados[disposicion];
      },
      // Si la lección no sirve para este teclado (tildes en el inglés), lo explicamos.
      noDisponible: () => t("teclado.sinTildes"),
      // Etiqueta: el tipo de teclado.
      etiqueta: () => TecladoVisual.nombreDisposicion(),
      // Contenido propio del proyecto.
      creditos: () => [],
    };
  }

  // Un modo por lección.
  return LECCIONES.map(crearModo);
})();
