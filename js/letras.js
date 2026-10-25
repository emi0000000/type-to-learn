// letras.js: el abecedario en inglés y en español, y cómo se deletrea una palabra.
// Sirve para el modo abecedario (deletreo) y para la tabla «Ver el abecedario».
// No toca la página, solo hace cálculos. Así se puede probar fácilmente con Node (mira tests/).

// Nombres de las letras en español, según la RAE (2010).
const LETRAS_ES = [
  ["a", "a"], ["b", "be"], ["c", "ce"], ["d", "de"], ["e", "e"], ["f", "efe"], ["g", "ge"],
  ["h", "hache"], ["i", "i"], ["j", "jota"], ["k", "ka"], ["l", "ele"], ["m", "eme"], ["n", "ene"],
  ["ñ", "eñe"], ["o", "o"], ["p", "pe"], ["q", "cu"], ["r", "erre"], ["s", "ese"], ["t", "te"],
  ["u", "u"], ["v", "uve"], ["w", "uve doble"], ["x", "equis"], ["y", "ye"], ["z", "zeta"],
];

// Otros nombres que se usan en América para algunas letras (se muestran en la tabla).
const VARIANTES_ES = {
  v: "ve, ve corta", // uve
  w: "doble ve, doble u", // uve doble
  y: "i griega", // ye
};

// Letras con tilde o diéresis: cómo se dicen al deletrear en español.
const MARCADAS_ES = {
  á: "a con tilde", // a con tilde
  é: "e con tilde", // e con tilde
  í: "i con tilde", // i con tilde
  ó: "o con tilde", // o con tilde
  ú: "u con tilde", // u con tilde
  ü: "u con diéresis", // u con diéresis
};

// Nombres de las letras en inglés: [letra, nombre en inglés, cómo suena (escrito a la española)].
// Lo de «cómo suena» ayuda a quien habla español a reconocerlas al oírlas.
const LETRAS_EN = [
  ["a", "a", "ei"], ["b", "bee", "bi"], ["c", "cee", "si"], ["d", "dee", "di"], ["e", "e", "i"],
  ["f", "ef", "ef"], ["g", "gee", "yi"], ["h", "aitch", "eich"], ["i", "i", "ai"], ["j", "jay", "yei"],
  ["k", "kay", "kei"], ["l", "el", "el"], ["m", "em", "em"], ["n", "en", "en"], ["o", "o", "ou"],
  ["p", "pee", "pi"], ["q", "cue", "kiu"], ["r", "ar", "ar"], ["s", "ess", "es"], ["t", "tee", "ti"],
  ["u", "u", "iu"], ["v", "vee", "vi"], ["w", "double-u", "dabliu"], ["x", "ex", "ex"], ["y", "wye", "uai"],
  ["z", "zee", "zi"],
];

// Devuelve el nombre de una letra para deletrear.
//   letra:    una letra en minúscula ("h", "ñ", "á")
//   idioma:   idioma del abecedario ("es" o "en")
//   interfaz: idioma de la interfaz; con la interfaz en español, las letras inglesas se escriben como suenan
function nombreDeLetra(letra, idioma, interfaz = "es") {
  // En español...
  if (idioma === "es") {
    // ...las letras con tilde o diéresis tienen su forma de decirse...
    if (MARCADAS_ES[letra]) {
      // Por ejemplo "a con tilde".
      return MARCADAS_ES[letra];
    }
    // ...y el resto, su nombre.
    const fila = LETRAS_ES.find(([candidata]) => candidata === letra);
    // Si no es una letra conocida, la dejamos tal cual.
    return fila ? fila[1] : letra;
  }
  // En inglés, buscamos la letra.
  const fila = LETRAS_EN.find(([candidata]) => candidata === letra);
  // Si no es una letra conocida, la dejamos tal cual.
  if (!fila) {
    // Tal cual.
    return letra;
  }
  // Con la interfaz en español, cómo suena; si no, su nombre en inglés.
  return interfaz === "es" ? fila[2] : fila[1];
}

// Deletrea una palabra para leerla en pantalla: "gato" -> "ge · a · te · o".
function deletrear(palabra, idioma, interfaz = "es") {
  // Nombre de cada letra, separados por un punto medio.
  return [...palabra.toLowerCase()].map((letra) => nombreDeLetra(letra, idioma, interfaz)).join(" · ");
}

// Deletrea una palabra para leerla en voz alta.
// En inglés se leen las letras (la voz dice su nombre); en español, sus nombres.
function deletreoHablado(palabra, idioma) {
  // Letras de la palabra.
  const letras = [...palabra.toLowerCase()];
  // En inglés, cada letra en mayúscula (así la voz dice "dee", no "d" pegada a la siguiente).
  if (idioma === "en") {
    // Letras separadas por comas para que haya una pausa.
    return letras.map((letra) => letra.toUpperCase()).join(", ");
  }
  // En español, los nombres separados por comas.
  return letras.map((letra) => nombreDeLetra(letra, "es")).join(", ");
}

// Si este archivo se carga desde Node (en las pruebas), exportamos lo necesario.
if (typeof module !== "undefined" && module.exports) {
  // Lista de lo que pueden usar las pruebas.
  module.exports = { LETRAS_ES, LETRAS_EN, VARIANTES_ES, MARCADAS_ES, nombreDeLetra, deletrear, deletreoHablado };
}
