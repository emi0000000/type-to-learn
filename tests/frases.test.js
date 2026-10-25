// Pruebas de datos/frases-es.js: que todas las frases cumplen las reglas del modo ortografía.
// Se ejecutan con: npm test

// Herramienta de pruebas que trae Node.
const { test } = require("node:test");
// Comprobaciones estrictas.
const assert = require("node:assert/strict");
// Para leer archivos.
const fs = require("node:fs");
// Para construir rutas.
const path = require("node:path");
// Para ejecutar el archivo de frases en un espacio aislado.
const vm = require("node:vm");

// Leemos el archivo de frases tal como lo lee el navegador.
const codigo = fs.readFileSync(path.join(__dirname, "..", "datos", "frases-es.js"), "utf8");
// Objeto que hace de "window" del navegador.
const ventana = {};
// Ejecutamos el archivo: deja las frases en ventana.FRASES_ES.
vm.runInNewContext(codigo, { window: ventana });
// Lista de frases.
const FRASES = ventana.FRASES_ES;

// Caracteres permitidos: letras del español, espacio y signos básicos.
const FORMA_VALIDA = /^[¿¡]?[A-ZÁÉÍÓÚÑÜ][A-Za-zÁÉÍÓÚÑÜáéíóúñü ,;:¿?¡!.]*[.?!]$/;
// Tildes que ya no se recomiendan o que nunca fueron correctas.
const TILDES_NO_VALIDAS = ["sólo", "éste", "ésta", "éstos", "éstas", "ése", "ésa", "ésos", "ésas", "aquél", "guión", "rió", "fué", "dió", "vió"];
// Palabras de programación (el modo ortografía no debe tener ninguna).
const PROGRAMACION = ["python", "javascript", "html", "programación", "programar", "código", "software"];

// Hay suficientes frases para jugar mucho sin repetir.
test("hay al menos 1000 frases", () => {
  // Comprobamos el total.
  assert.ok(FRASES.length >= 1000, `solo hay ${FRASES.length}`);
});

// Cada frase tiene el formato [número, texto, autor].
test("cada frase tiene número, texto y autor", () => {
  // Recorremos las frases.
  for (const frase of FRASES) {
    // Número entero positivo.
    assert.ok(Number.isInteger(frase[0]) && frase[0] > 0, `número raro: ${frase[0]}`);
    // Texto.
    assert.equal(typeof frase[1], "string");
    // Autor.
    assert.equal(typeof frase[2], "string");
  }
});

// No hay números ni textos repetidos.
test("no hay frases repetidas", () => {
  // Números distintos.
  assert.equal(new Set(FRASES.map((frase) => frase[0])).size, FRASES.length);
  // Textos distintos.
  assert.equal(new Set(FRASES.map((frase) => frase[1])).size, FRASES.length);
});

// Todas cumplen las reglas de ortografía y forma.
test("todas las frases cumplen las reglas", () => {
  // Recorremos las frases.
  for (const [numero, texto] of FRASES) {
    // Mensaje que se muestra si alguna falla.
    const donde = `frase ${numero}: "${texto}"`;
    // Tildes guardadas como un solo carácter.
    assert.equal(texto, texto.normalize("NFC"), donde);
    // Largo entre 10 y 90.
    assert.ok(texto.length >= 10 && texto.length <= 90, donde);
    // Solo caracteres permitidos, empieza con mayúscula y termina con signo.
    assert.match(texto, FORMA_VALIDA, donde);
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
});
