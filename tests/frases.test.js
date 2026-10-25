// Pruebas de los archivos de frases: que todas cumplen las reglas de su modo.
// Se ejecutan con: npm test

// Herramienta de pruebas que trae Node.
const { test } = require("node:test");
// Comprobaciones estrictas.
const assert = require("node:assert/strict");
// Para leer archivos.
const fs = require("node:fs");
// Para construir rutas.
const path = require("node:path");
// Para ejecutar los archivos de frases en un espacio aislado.
const vm = require("node:vm");

// Carga un archivo de datos tal como lo lee el navegador y devuelve la variable que crea.
function cargar(archivo, variable) {
  // Leemos el archivo.
  const codigo = fs.readFileSync(path.join(__dirname, "..", "datos", archivo), "utf8");
  // Objeto que hace de "window" del navegador.
  const ventana = {};
  // Ejecutamos el archivo: deja las frases en ventana[variable].
  vm.runInNewContext(codigo, { window: ventana });
  // Devolvemos la lista.
  return ventana[variable];
}

// Frases del modo ortografía: [número, texto, autor].
const FRASES_ES = cargar("frases-es.js", "FRASES_ES");
// Parejas del modo inglés: [número, inglés, autor, número, traducción, autor].
const FRASES_EN = cargar("frases-en.js", "FRASES_EN");

// Caracteres permitidos en español: letras del español, espacio y signos básicos.
const FORMA_ESPANOL = /^[¿¡]?[A-ZÁÉÍÓÚÑÜ][A-Za-zÁÉÍÓÚÑÜáéíóúñü ,;:¿?¡!.]*[.?!]$/;
// Caracteres permitidos en inglés: letras sin tilde, espacio, signos básicos, apóstrofo y guion.
const FORMA_INGLES = /^[A-Z][A-Za-z ,;:?!.'-]*[.?!]$/;
// Tildes que ya no se recomiendan o que nunca fueron correctas.
const TILDES_NO_VALIDAS = ["sólo", "éste", "ésta", "éstos", "éstas", "ése", "ésa", "ésos", "ésas", "aquél", "guión", "rió", "fué", "dió", "vió"];
// Palabras de programación (ningún modo de la versión 1 debe tener ninguna).
const PROGRAMACION = ["python", "javascript", "html", "programación", "programar", "código", "software", "programming", "code", "coding"];

// Comprueba que un texto en español cumple las reglas del modo ortografía.
function comprobarEspanol(texto, donde) {
  // Tildes guardadas como un solo carácter.
  assert.equal(texto, texto.normalize("NFC"), donde);
  // Largo entre 10 y 90.
  assert.ok(texto.length >= 10 && texto.length <= 90, donde);
  // Solo caracteres permitidos, empieza con mayúscula y termina con signo.
  assert.match(texto, FORMA_ESPANOL, donde);
  // Sin espacios dobles.
  assert.ok(!texto.includes("  "), donde);
  // Cada ¿ con su ? y cada ¡ con su !.
  assert.equal(texto.split("¿").length, texto.split("?").length, donde);
  // Igual con las exclamaciones.
  assert.equal(texto.split("¡").length, texto.split("!").length, donde);
  // Palabras de la frase en minúscula.
  const palabras = texto.toLowerCase().match(/[a-záéíóúñü]+/g) || [];
  // Ninguna con tilde no válida.
  assert.ok(!palabras.some((palabra) => TILDES_NO_VALIDAS.includes(palabra)), donde);
  // Ninguna de programación.
  assert.ok(!palabras.some((palabra) => PROGRAMACION.includes(palabra)), donde);
}

// Hay suficientes frases para jugar mucho sin repetir.
test("hay al menos 1000 frases en cada modo", () => {
  // Ortografía.
  assert.ok(FRASES_ES.length >= 1000, `ortografía solo tiene ${FRASES_ES.length}`);
  // Inglés.
  assert.ok(FRASES_EN.length >= 1000, `inglés solo tiene ${FRASES_EN.length}`);
});

// Cada frase tiene el formato esperado.
test("cada frase tiene número, texto y autor", () => {
  // Ortografía: [número, texto, autor].
  for (const frase of FRASES_ES) {
    // Tres elementos: número entero, texto y autor.
    assert.ok(frase.length === 3 && Number.isInteger(frase[0]) && typeof frase[1] === "string" && typeof frase[2] === "string", `${frase}`);
  }
  // Inglés: [número, inglés, autor, número, traducción, autor].
  for (const frase of FRASES_EN) {
    // Seis elementos con los tipos correctos.
    assert.ok(frase.length === 6 && Number.isInteger(frase[0]) && Number.isInteger(frase[3]) && frase.every((dato, i) => (i === 0 || i === 3) || typeof dato === "string"), `${frase}`);
  }
});

// No hay números ni textos repetidos dentro de cada modo.
test("no hay frases repetidas", () => {
  // Ortografía: números distintos.
  assert.equal(new Set(FRASES_ES.map((frase) => frase[0])).size, FRASES_ES.length);
  // Ortografía: textos distintos.
  assert.equal(new Set(FRASES_ES.map((frase) => frase[1])).size, FRASES_ES.length);
  // Inglés: números distintos.
  assert.equal(new Set(FRASES_EN.map((frase) => frase[0])).size, FRASES_EN.length);
  // Inglés: textos distintos.
  assert.equal(new Set(FRASES_EN.map((frase) => frase[1])).size, FRASES_EN.length);
});

// Todas las frases en español cumplen las reglas de ortografía.
test("ortografía: todas las frases cumplen las reglas", () => {
  // Recorremos las frases.
  for (const [numero, texto] of FRASES_ES) {
    // Comprobamos el texto.
    comprobarEspanol(texto, `frase ${numero}: "${texto}"`);
  }
});

// Todas las parejas del modo inglés cumplen sus reglas.
test("inglés: todas las frases y traducciones cumplen las reglas", () => {
  // Recorremos las parejas.
  for (const [numero, ingles, , numeroEs, traduccion] of FRASES_EN) {
    // Mensaje que se muestra si alguna falla.
    const donde = `frase ${numero}: "${ingles}"`;
    // Largo entre 10 y 90.
    assert.ok(ingles.length >= 10 && ingles.length <= 90, donde);
    // Solo caracteres permitidos, empieza con mayúscula y termina con signo.
    assert.match(ingles, FORMA_INGLES, donde);
    // Sin espacios dobles.
    assert.ok(!ingles.includes("  "), donde);
    // El apóstrofo no se usa como comilla de apertura.
    assert.ok(!/(^|\s)'/.test(ingles), donde);
    // Ninguna palabra de programación.
    assert.ok(!(ingles.toLowerCase().match(/[a-z]+/g) || []).some((palabra) => PROGRAMACION.includes(palabra)), donde);
    // La traducción cumple las reglas de ortografía del español.
    comprobarEspanol(traduccion, `traducción ${numeroEs} de la ${donde}`);
  }
});

// Los modos no se mezclan: ninguna frase en español del modo ortografía aparece como frase a copiar en inglés.
test("los modos no se mezclan", () => {
  // Textos del modo ortografía.
  const espanol = new Set(FRASES_ES.map((frase) => frase[1]));
  // Ninguna frase en inglés coincide con una del modo ortografía.
  assert.ok(!FRASES_EN.some((frase) => espanol.has(frase[1])));
});
