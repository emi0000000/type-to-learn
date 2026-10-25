// modos/espanol.js: el modo español (para aprender español; el modo inglés al revés).
// Muestra una frase en español y su traducción al inglés. Hay que copiar la frase exacta
// (con tildes, ñ, ¿ y ¡; cada error resta una vida) y después elegir su significado en inglés
// entre tres opciones (equivocarse también resta una vida).
// Usa las mismas parejas de Tatoeba que el modo inglés (datos/frases-en.js), pero dadas la vuelta,
// y tiene sus propias frases vistas, récord y errores para repasar. La parte común está en traduccion.js.

// Todo el modo va dentro de una función que se ejecuta al momento, para no llenar el espacio global.
const ModoEspanol = (() => {
  // Parejas dadas la vuelta (se preparan la primera vez que hacen falta).
  let invertidas = null;

  // Lista de frases del modo: [número, español, autor, número, inglés, autor].
  function frases() {
    // Si aún no están preparadas...
    if (invertidas === null) {
      // ...les damos la vuelta (invertirParejas está en significado.js); vacía si no se cargó el archivo.
      invertidas = typeof FRASES_EN === "undefined" ? [] : invertirParejas(FRASES_EN);
    }
    // Devolvemos la lista.
    return invertidas;
  }

  // Descripción del modo para el motor.
  return Traduccion.crear({
    // Nombre interno: se usa para guardar en el navegador las frases vistas y el récord.
    id: "espanol",
    // Se copia en español.
    idioma: "es",
    // Las opciones de la pregunta están en inglés.
    idiomaTraduccion: "en",
    // Se muestran los botones á, é, ñ, ¿, ¡... para teclados en inglés que no los tienen.
    teclas: "es",
    // Lista de frases.
    frases,
    // Cómo se comparan las frases para elegir opciones equivocadas (en significado.js).
    direccion: ESPANOL_A_INGLES,
  });
})();
