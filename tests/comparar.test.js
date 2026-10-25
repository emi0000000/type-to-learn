// Pruebas de js/comparar.js. Se ejecutan con: npm test

// Herramienta de pruebas que trae Node.
const { test } = require("node:test");
// Comprobaciones estrictas (=== en lugar de ==).
const assert = require("node:assert/strict");
// Funciones que vamos a probar.
const { revisarEscritura, palabraEn, explicarError } = require("../js/comparar.js");

// Caja vacía: todavía no hay nada escrito.
test("sin escribir nada, la frase está incompleta", () => {
  // Revisamos una caja vacía.
  const resultado = revisarEscritura("Hola.", "");
  // Debe estar incompleta, sin aciertos, esperando la "H".
  assert.deepEqual(resultado, { estado: "incompleta", aciertos: 0, esperado: "H", recibido: "" });
});

// Lo escrito es el comienzo correcto de la frase.
test("un comienzo correcto está incompleto y cuenta los aciertos", () => {
  // Revisamos "Ho" frente a "Hola.".
  const resultado = revisarEscritura("Hola.", "Ho");
  // Debe estar incompleta.
  assert.equal(resultado.estado, "incompleta");
  // Con dos aciertos.
  assert.equal(resultado.aciertos, 2);
});

// La frase entera, exacta.
test("la frase exacta está completa", () => {
  // Revisamos la frase completa.
  assert.equal(revisarEscritura("¿Qué tal?", "¿Qué tal?").estado, "completa");
});

// Falta una tilde.
test("una tilde que falta es un error en su posición", () => {
  // Revisamos "Esta" frente a "Está bien.".
  const resultado = revisarEscritura("Está bien.", "Esta");
  // Debe ser un error en la cuarta letra.
  assert.deepEqual(resultado, { estado: "error", aciertos: 3, esperado: "á", recibido: "a" });
});

// Las mayúsculas cuentan.
test("una minúscula en lugar de mayúscula es un error", () => {
  // Revisamos "h" frente a "Hola.".
  const resultado = revisarEscritura("Hola.", "h");
  // Debe ser un error en la primera letra.
  assert.equal(resultado.estado, "error");
  // Sin aciertos.
  assert.equal(resultado.aciertos, 0);
});

// Escribir de más al final también es un error.
test("escribir más allá del final es un error", () => {
  // Revisamos "Hola.x" frente a "Hola.".
  const resultado = revisarEscritura("Hola.", "Hola.x");
  // Debe ser un error al final, sin carácter esperado.
  assert.deepEqual(resultado, { estado: "error", aciertos: 5, esperado: "", recibido: "x" });
});

// Algunos teclados escriben la tilde como un carácter aparte (a + ´).
test("una tilde escrita en dos caracteres cuenta como correcta", () => {
  // "Esta" + acento combinable equivale a "Está".
  const resultado = revisarEscritura("Está.", "Está");
  // Debe estar incompleta, con cuatro aciertos.
  assert.deepEqual(resultado, { estado: "incompleta", aciertos: 4, esperado: ".", recibido: "" });
});

// Si se escriben varios caracteres de golpe, solo cuentan los correctos del principio.
test("varios caracteres a la vez: el error se detecta donde empieza", () => {
  // Revisamos "Hloa" frente a "Hola.".
  const resultado = revisarEscritura("Hola.", "Hloa");
  // Debe ser un error en la segunda letra.
  assert.deepEqual(resultado, { estado: "error", aciertos: 1, esperado: "o", recibido: "l" });
});

// palabraEn encuentra la palabra donde ocurre el error.
test("palabraEn devuelve la palabra y su inicio", () => {
  // La letra 6 de "Hola mundo." es la "u" de "mundo.".
  assert.deepEqual(palabraEn("Hola mundo.", 6), { palabra: "mundo.", inicio: 5 });
  // Sobre un espacio, devuelve la palabra anterior.
  assert.deepEqual(palabraEn("Hola mundo.", 4), { palabra: "Hola", inicio: 0 });
  // Más allá del final, devuelve la última palabra.
  assert.deepEqual(palabraEn("Hola mundo.", 11), { palabra: "mundo.", inicio: 5 });
});

// explicarError da mensajes distintos según el tipo de fallo.
test("explicarError reconoce los errores típicos", () => {
  // Falta la tilde.
  assert.equal(explicarError("á", "a"), "Falta la tilde: se esperaba «á» y escribiste «a».");
  // Sobra la tilde.
  assert.equal(explicarError("e", "é"), "Sobra la tilde: se esperaba «e» y escribiste «é».");
  // Mayúscula.
  assert.equal(explicarError("Q", "q"), "Ojo con la mayúscula: se esperaba «Q» y escribiste «q».");
  // Minúscula.
  assert.equal(explicarError("q", "Q"), "Ojo con la minúscula: se esperaba «q» y escribiste «Q».");
  // Signo de apertura.
  assert.equal(explicarError("¿", "Q"), "Falta el signo de apertura: se esperaba «¿» y escribiste «Q».");
  // Apóstrofo de las contracciones inglesas.
  assert.equal(explicarError("'", "t"), "Falta el apóstrofo: se esperaba «'» y escribiste «t».");
  // Eñe por ene.
  assert.equal(explicarError("ñ", "n"), "Revisa la letra: se esperaba «ñ» y escribiste «n».");
  // Espacio.
  assert.equal(explicarError(" ", "m"), "Error: se esperaba un espacio y escribiste «m».");
  // Texto de más.
  assert.equal(explicarError("", "x"), "La frase ya terminó: sobra «x».");
});

// Con la interfaz en inglés, las explicaciones salen en inglés.
test("explicarError también explica en inglés", () => {
  // Falta la tilde.
  assert.equal(explicarError("á", "a", "en"), "Missing the accent: expected “á” but you typed “a”.");
  // Mayúscula.
  assert.equal(explicarError("Q", "q", "en"), "Watch the capital letter: expected “Q” but you typed “q”.");
  // Signo de apertura.
  assert.equal(explicarError("¿", "Q", "en"), "Missing the opening mark: expected “¿” but you typed “Q”.");
  // Espacio.
  assert.equal(explicarError(" ", "m", "en"), "Mistake: expected a space but you typed “m”.");
  // Texto de más.
  assert.equal(explicarError("", "x", "en"), "The sentence already ended: “x” is extra.");
});

// Un "$" escrito no se toma como código especial al rellenar el mensaje.
test("explicarError muestra bien el signo $", () => {
  // El dólar aparece tal cual.
  assert.equal(explicarError("a", "$"), "Error: se esperaba «a» y escribiste «$».");
});

// Los teclados de los móviles cambian las comillas rectas por curvas: se aceptan igual.
test("las comillas curvas de los móviles cuentan como rectas", () => {
  // Apóstrofo curvo en "don’t".
  assert.equal(revisarEscritura("I don't know.", "I don’t").estado, "incompleta");
  // Comillas curvas en código.
  assert.equal(revisarEscritura('print("Hola")', "print(“Hola”)").estado, "completa");
});
