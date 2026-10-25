// modos/ortografia.js: el modo ortografía.
// Muestra frases en español; hay que copiarlas exactas y cada error resta una vida.
// Solo usa las frases en español de datos/frases-es.js: no se mezcla con los otros modos.
// Lo que comparten todos los modos (vidas, errores, resultado) está en js/motor.js.

// Descripción del modo para el motor.
const ModoOrtografia = {
  // Nombre interno: se usa para guardar en el navegador las frases vistas y el récord.
  id: "ortografia",
  // Nombre que se ve en pantalla.
  nombre: "Ortografía",
  // Idioma de las frases que se copian.
  idioma: "es",
  // Se muestran los botones á, é, í, ó, ú, ü, ñ, ¿ y ¡ para teclados que no los tienen.
  teclasEspeciales: true,

  // Lista de frases del modo; vacía si el archivo de frases no se pudo cargar.
  frases() {
    // FRASES_ES la crea datos/frases-es.js.
    return typeof FRASES_ES === "undefined" ? [] : FRASES_ES;
  },

  // Créditos de la frase para Tatoeba: [etiqueta, número, autor].
  creditos(frase) {
    // Cada frase es [número, texto, autor].
    return [["Frase", frase[0], frase[2]]];
  },
};
