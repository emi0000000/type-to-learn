// numerosEnPalabras.js: escribe números con letras en inglés y en español (47 -> forty-seven, cuarenta y siete).
// Sirve para el modo «Números en palabras» y para entender a la voz cuando dice un número.
// No toca la página, solo hace cálculos. Así se puede probar fácilmente con Node (mira tests/).

// --- Inglés (de Estados Unidos) ---

// Del 0 al 19.
const UNIDADES_EN = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
// Las decenas (20, 30... 90).
const DECENAS_EN = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

// Un número de 0 a 99 en inglés.
function menosDeCienEn(n) {
  // Del 0 al 19, directo.
  if (n < 20) {
    // Su nombre.
    return UNIDADES_EN[n];
  }
  // Decena y unidad.
  const unidad = n % 10;
  // Por ejemplo "forty-seven" (con guion) o "forty".
  return DECENAS_EN[Math.floor(n / 10)] + (unidad ? `-${UNIDADES_EN[unidad]}` : "");
}

// Un número de 0 a 999 en inglés.
function menosDeMilEn(n) {
  // Menos de 100.
  if (n < 100) {
    // Directo.
    return menosDeCienEn(n);
  }
  // Lo que sobra después de las centenas.
  const resto = n % 100;
  // Por ejemplo "three hundred twelve".
  return `${UNIDADES_EN[Math.floor(n / 100)]} hundred` + (resto ? ` ${menosDeCienEn(resto)}` : "");
}

// Un número de 0 a 999 999 en inglés.
function numeroEnIngles(n) {
  // Menos de mil.
  if (n < 1000) {
    // Directo.
    return menosDeMilEn(n);
  }
  // Lo que sobra después de los miles.
  const resto = n % 1000;
  // Por ejemplo "two thousand five".
  return `${menosDeMilEn(Math.floor(n / 1000))} thousand` + (resto ? ` ${menosDeMilEn(resto)}` : "");
}

// --- Español ---

// Del 0 al 29 (en español del 16 al 29 se escriben en una sola palabra).
const UNIDADES_ES = [
  "cero", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve",
  "diez", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve",
  "veinte", "veintiuno", "veintidós", "veintitrés", "veinticuatro", "veinticinco", "veintiséis", "veintisiete", "veintiocho", "veintinueve",
];
// Las decenas desde el 30.
const DECENAS_ES = ["", "", "", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"];
// Las centenas (100 sola es "cien"; 101-199 empieza por "ciento").
const CENTENAS_ES = ["", "ciento", "doscientos", "trescientos", "cuatrocientos", "quinientos", "seiscientos", "setecientos", "ochocientos", "novecientos"];

// Un número de 0 a 99 en español.
function menosDeCienEs(n) {
  // Del 0 al 29, directo.
  if (n < 30) {
    // Su nombre.
    return UNIDADES_ES[n];
  }
  // Decena y unidad.
  const unidad = n % 10;
  // Por ejemplo "cuarenta y siete" o "cuarenta".
  return DECENAS_ES[Math.floor(n / 10)] + (unidad ? ` y ${UNIDADES_ES[unidad]}` : "");
}

// Un número de 0 a 999 en español.
function menosDeMilEs(n) {
  // Exactamente 100.
  if (n === 100) {
    // "cien".
    return "cien";
  }
  // Menos de 100.
  if (n < 100) {
    // Directo.
    return menosDeCienEs(n);
  }
  // Lo que sobra después de las centenas.
  const resto = n % 100;
  // Por ejemplo "trescientos doce".
  return CENTENAS_ES[Math.floor(n / 100)] + (resto ? ` ${menosDeCienEs(resto)}` : "");
}

// Delante de "mil", "uno" se acorta: "veintiún mil", "treinta y un mil", "ciento un mil".
function acortarUno(texto) {
  // "veintiuno" -> "veintiún"; "uno" al final -> "un".
  return texto.replace(/veintiuno$/, "veintiún").replace(/(^| )uno$/, "$1un");
}

// Un número de 0 a 999 999 en español.
function numeroEnEspanol(n) {
  // Menos de mil.
  if (n < 1000) {
    // Directo.
    return menosDeMilEs(n);
  }
  // Miles y resto.
  const miles = Math.floor(n / 1000);
  // Lo que sobra.
  const resto = n % 1000;
  // 1000 es "mil" (no "un mil"); si no, "dos mil", "veintiún mil"...
  const parteMiles = miles === 1 ? "mil" : `${acortarUno(menosDeMilEs(miles))} mil`;
  // Juntamos con el resto.
  return parteMiles + (resto ? ` ${menosDeMilEs(resto)}` : "");
}

// Escribe un número con letras en el idioma indicado ("en" o "es").
function numeroEnPalabras(n, idioma) {
  // Inglés o español.
  return idioma === "en" ? numeroEnIngles(n) : numeroEnEspanol(n);
}

// Prepara una respuesta escrita con letras para compararla con la correcta.
// En inglés da igual el guion (forty-seven = forty seven) y la palabra "and" (one hundred and five).
function normalizarPalabras(texto, idioma) {
  // Minúsculas y espacios simples.
  let limpio = texto.normalize("NFC").toLowerCase().replace(/\s+/g, " ").trim();
  // En inglés...
  if (idioma === "en") {
    // ...los guiones cuentan como espacios y "and" se quita.
    limpio = limpio.replace(/-/g, " ").replace(/\band\b/g, " ").replace(/\s+/g, " ").trim();
  }
  // Devolvemos el texto limpio.
  return limpio;
}

// Si este archivo se carga desde Node (en las pruebas), exportamos lo necesario.
if (typeof module !== "undefined" && module.exports) {
  // Lista de lo que pueden usar las pruebas.
  module.exports = { numeroEnIngles, numeroEnEspanol, numeroEnPalabras, normalizarPalabras };
}
