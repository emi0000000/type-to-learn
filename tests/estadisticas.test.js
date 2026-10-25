// Pruebas de js/estadisticas.js (racha de días, velocidad, tiempos). Se ejecutan con: npm test

// Herramienta de pruebas que trae Node.
const { test } = require("node:test");
// Comprobaciones estrictas.
const assert = require("node:assert/strict");
// Funciones que vamos a probar.
const { fechaLocal, diaAnterior, diasSeguidos, palabrasPorMinuto, formatearDuracion, formatearReloj } = require("../js/estadisticas.js");

// Las fechas se escriben "AAAA-MM-DD".
test("fechaLocal escribe la fecha con dos cifras", () => {
  // 5 de marzo de 2026 (los meses de Date empiezan en 0).
  assert.equal(fechaLocal(new Date(2026, 2, 5, 10)), "2026-03-05");
});

// El día anterior cruza meses y años.
test("diaAnterior cruza meses y años", () => {
  // Del 1 de marzo al 28 de febrero (2026 no es bisiesto).
  assert.equal(diaAnterior("2026-03-01"), "2026-02-28");
  // Del 1 de enero al 31 de diciembre.
  assert.equal(diaAnterior("2026-01-01"), "2025-12-31");
});

// La racha cuenta los días seguidos hasta hoy (o hasta ayer, si hoy aún no se jugó).
test("diasSeguidos cuenta la racha", () => {
  // Tres días seguidos terminando hoy.
  assert.equal(diasSeguidos(["2026-10-23", "2026-10-24", "2026-10-25"], "2026-10-25"), 3);
  // Hasta ayer: la racha sigue viva.
  assert.equal(diasSeguidos(["2026-10-23", "2026-10-24"], "2026-10-25"), 2);
  // Hace dos días: la racha se perdió.
  assert.equal(diasSeguidos(["2026-10-22", "2026-10-23"], "2026-10-25"), 0);
  // Un hueco corta la racha.
  assert.equal(diasSeguidos(["2026-10-20", "2026-10-24", "2026-10-25"], "2026-10-25"), 2);
  // Sin días, cero.
  assert.equal(diasSeguidos([], "2026-10-25"), 0);
});

// Palabras por minuto: 5 caracteres son una palabra.
test("palabrasPorMinuto usa palabras de 5 caracteres", () => {
  // 250 caracteres en un minuto son 50 palabras por minuto.
  assert.equal(palabrasPorMinuto(250, 60000), 50);
  // Sin tiempo, cero.
  assert.equal(palabrasPorMinuto(100, 0), 0);
});

// Las duraciones se escriben cortas.
test("formatearDuracion y formatearReloj", () => {
  // Segundos.
  assert.equal(formatearDuracion(45), "45 s");
  // Minutos.
  assert.equal(formatearDuracion(125), "2 min");
  // Horas y minutos.
  assert.equal(formatearDuracion(3900), "1 h 05 min");
  // Reloj corto.
  assert.equal(formatearReloj(65), "1:05");
  // Reloj con horas.
  assert.equal(formatearReloj(3725), "1:02:05");
});
