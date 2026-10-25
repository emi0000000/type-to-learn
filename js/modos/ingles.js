// modos/ingles.js: el modo inglés (para aprender inglés).
// Muestra una frase en inglés y su traducción al español. Hay que copiar la frase exacta
// (cada error resta una vida) y después confirmar que se entiende: la traducción se oculta
// y hay que elegir su significado en español entre tres opciones (equivocarse también resta una vida).
// Solo usa las frases de datos/frases-en.js. La parte común con el modo español está en traduccion.js.

// Descripción del modo para el motor.
const ModoIngles = Traduccion.crear({
  // Nombre interno: se usa para guardar en el navegador las frases vistas y el récord.
  id: "ingles",
  // Se copia en inglés.
  idioma: "en",
  // Las opciones de la pregunta están en español.
  idiomaTraduccion: "es",
  // En inglés no hacen falta los botones de tildes ni de ¿ ¡ (sin la propiedad teclas, no hay botones).
  // Frases: [número, inglés, autor, número, español, autor]. FRASES_EN la crea datos/frases-en.js.
  frases: () => (typeof FRASES_EN === "undefined" ? [] : FRASES_EN),
  // Cómo se comparan las frases para elegir opciones equivocadas (en significado.js).
  direccion: INGLES_A_ESPANOL,
});
