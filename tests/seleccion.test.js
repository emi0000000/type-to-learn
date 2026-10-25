// Pruebas de js/seleccion.js. Se ejecutan con: npm test

// Herramienta de pruebas que trae Node.
const { test } = require("node:test");
// Comprobaciones estrictas.
const assert = require("node:assert/strict");
// Funciones que vamos a probar.
const { tramoSegunProgreso, nivelSegunProgreso, elegirFrase } = require("../js/seleccion.js");

// Lista pequeña de frases de ejemplo, con distintos largos.
const FRASES = [
  [1, "Hola."], // corta (5 caracteres)
  [2, "Buenos días."], // corta (12)
  [3, "Mañana iremos al mercado."], // corta (25)
  [4, "No sé dónde dejé las llaves de casa."], // mediana (36)
  [5, "Si hubiera sabido que venías, habría preparado la cena."], // larga (55)
];

// La dificultad sube con las frases completadas.
test("el tramo depende de las frases completadas", () => {
  // Al empezar, frases cortas.
  assert.equal(tramoSegunProgreso(0).largoMaximo, 25);
  // Tras 4, todavía cortas.
  assert.equal(tramoSegunProgreso(4).largoMaximo, 25);
  // Tras 5, medianas.
  assert.equal(tramoSegunProgreso(5).largoMinimo, 26);
  // Tras 15, largas.
  assert.equal(tramoSegunProgreso(15).largoMinimo, 41);
  // Y siguen largas.
  assert.equal(tramoSegunProgreso(200).largoMinimo, 41);
});

// Al empezar se elige una frase corta.
test("al empezar elige una frase corta", () => {
  // Elegimos varias veces con valores de azar distintos.
  for (const valor of [0, 0.5, 0.99]) {
    // Elegimos con ese valor.
    const frase = elegirFrase(FRASES, new Set(), 0, () => valor);
    // Debe tener 25 caracteres o menos.
    assert.ok(frase[1].length <= 25, `"${frase[1]}" no es corta`);
  }
});

// Nunca elige una frase ya usada.
test("no repite frases usadas", () => {
  // Marcamos como usadas las frases 1 y 2.
  const usadas = new Set([1, 2]);
  // Elegimos con el primer valor de azar posible.
  const frase = elegirFrase(FRASES, usadas, 0, () => 0);
  // Solo queda la frase corta 3.
  assert.equal(frase[0], 3);
});

// Recorriendo toda la lista, cada frase sale una sola vez.
test("recorriendo la lista sale cada frase una vez", () => {
  // Frases usadas en este recorrido.
  const usadas = new Set();
  // Pedimos tantas frases como hay.
  for (let i = 0; i < FRASES.length; i++) {
    // Elegimos una frase.
    const frase = elegirFrase(FRASES, usadas, i);
    // No debe haber salido antes.
    assert.ok(!usadas.has(frase[0]), `la frase ${frase[0]} se repitió`);
    // La marcamos como usada.
    usadas.add(frase[0]);
  }
  // Al final, ya no queda ninguna.
  assert.equal(elegirFrase(FRASES, usadas, 0), null);
});

// Si se acaban las frases del tramo, usa cualquier otra libre.
test("sin frases del tramo, elige otra libre", () => {
  // Usamos todas las cortas.
  const usadas = new Set([1, 2, 3]);
  // Pedimos una corta (progreso 0): no queda ninguna, así que debe dar otra.
  const frase = elegirFrase(FRASES, usadas, 0, () => 0);
  // Debe ser una de las que quedan.
  assert.ok([4, 5].includes(frase[0]));
});

// El nivel que se ve en pantalla va de 1 a 3, igual que los tramos.
test("el nivel sube con las frases completadas", () => {
  // Al empezar, nivel 1.
  assert.equal(nivelSegunProgreso(0), 1);
  // Tras 5, nivel 2.
  assert.equal(nivelSegunProgreso(5), 2);
  // Tras 15, nivel 3.
  assert.equal(nivelSegunProgreso(15), 3);
  // Y se queda en 3.
  assert.equal(nivelSegunProgreso(500), 3);
});
