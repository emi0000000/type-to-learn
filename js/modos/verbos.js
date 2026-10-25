// modos/verbos.js: el modo «Verbos irregulares» del inglés.
// Se ve un verbo en infinitivo (por ejemplo "to go", con su significado) y hay que escribir
// su pasado y su participio separados por un espacio, una coma o un guion: "went gone".
// Si un verbo tiene dos formas correctas (learned/learnt), vale cualquiera de las dos.
// Usa datos/verbos.js.

// Todo va dentro de una función que se ejecuta al momento, para no llenar el espacio global.
const ModoVerbos = (() => {
  // Lista de verbos; vacía si el archivo no se pudo cargar.
  // Cada uno es [número, infinitivo, pasado, participio, significado en español, nivel].
  function lista() {
    // VERBOS_IRREGULARES la crea datos/verbos.js.
    return typeof VERBOS_IRREGULARES === "undefined" ? [] : VERBOS_IRREGULARES;
  }

  // Formas válidas de una columna ("was/were" -> ["was", "were"]).
  function formas(texto) {
    // Separamos por la barra y pasamos a minúscula.
    return texto.toLowerCase().split("/");
  }

  // ¿Es correcta la respuesta escrita?
  //   escrito: lo que escribió la persona ("went gone", "went, gone", "went - gone"...)
  //   verbo:   la entrada del verbo
  function comprobar(escrito, verbo) {
    // Partes escritas: separadas por espacios, comas, punto y coma o guiones.
    const partes = escrito.toLowerCase().split(/[\s,;–—-]+/).filter(Boolean);
    // Tienen que ser dos: pasado y participio.
    if (partes.length !== 2) {
      // No vale.
      return false;
    }
    // Cada parte puede traer varias formas con barra ("was/were"); todas tienen que valer.
    const vale = (parte, columna) => parte.split("/").filter(Boolean).every((forma) => formas(verbo[columna]).includes(forma));
    // Pasado y participio correctos.
    return vale(partes[0], 2) && vale(partes[1], 3);
  }

  // Descripción del modo para el motor.
  return {
    id: "verbos-en", // nombre interno
    idioma: "en", // se escribe en inglés
    respuesta: true, // se escribe una respuesta, no se copia
    sinVoz: true, // leerlo daría la respuesta
    sinIdioma: true, // la etiqueta ya lo dice
    // Lista de frases: [número, "pasado – participio", infinitivo, nivel, significado].
    frases: () => lista().map((verbo) => [verbo[0], `${verbo[2]} – ${verbo[3]}`, verbo[1], verbo[5], verbo[4], verbo]),
    enunciado: (frase) => `to ${frase[2]}`, // el infinitivo
    consigna: () => t("verbos.consigna"), // "Escribe el pasado y el participio"
    nota: (frase) => frase[4], // el significado en español
    etiqueta: () => t("idioma.en"), // inglés
    comprobar: (escrito, frase) => comprobar(escrito, frase[5]), // pasado y participio
    solucion: (frase) => frase[1], // "went – gone"
    largo: (frase) => [10, 30, 50][frase[3] - 1], // dificultad según el nivel
    creditos: () => [], // contenido propio del proyecto
    comprobarVerbo: comprobar, // para las pruebas
  };
})();
