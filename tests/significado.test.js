// Pruebas de js/significado.js (pregunta "¿Qué significa?" del modo inglés). Se ejecutan con: npm test

// Herramienta de pruebas que trae Node.
const { test } = require("node:test");
// Comprobaciones estrictas.
const assert = require("node:assert/strict");
// Funciones que vamos a probar.
const { palabrasLargas, simplificarIngles, mezclar, traduccionesParecidas, elegirOpciones } = require("../js/significado.js");

// Frase de la pregunta: [número, inglés, autor, número, traducción, autor].
const CORRECTA = [1, "Tom is very tired.", "a", 2, "Tom está muy cansado.", "b"];
// Lista de frases del modo, con la correcta incluida.
const FRASES = [
  // La propia frase de la pregunta.
  CORRECTA,
  // Dice lo mismo con contracción: nunca debe salir como opción equivocada.
  [3, "Tom's very tired.", "a", 4, "Tom está cansadísimo.", "b"],
  // Misma traducción que la correcta: tampoco debe salir.
  [5, "Tom is really tired.", "a", 6, "Tom está muy cansado.", "b"],
  // Parecidas: comparten palabras largas ("está", "cansado").
  [7, "Mary is tired.", "a", 8, "Mary está cansada.", "b"],
  [9, "Tom was tired yesterday.", "a", 10, "Tom estaba cansado ayer.", "b"],
  [11, "I'm not tired.", "a", 12, "No estoy cansado.", "b"],
  [13, "Are you tired?", "a", 14, "¿Está cansado?", "b"],
];
// Añadimos 20 frases sin ninguna palabra en común, para comprobar que las parecidas van primero.
for (let i = 0; i < 20; i++) {
  // Frase de relleno.
  FRASES.push([100 + i * 2, `Filler sentence number ${i}.`, "a", 101 + i * 2, `Relleno ${i}.`, "b"]);
}

// Azar fijo que va dando valores distintos, para pruebas repetibles.
function azarFijo(semilla) {
  // Valor interno.
  let valor = semilla;
  // Devolvemos una función que da un número entre 0 y 1.
  return () => {
    // Generador lineal congruente sencillo.
    valor = (valor * 16807) % 2147483647;
    // Lo pasamos al intervalo [0, 1).
    return valor / 2147483647;
  };
}

// Palabras largas: solo las de 4 letras o más, en minúscula.
test("palabrasLargas ignora las palabras cortas", () => {
  // "Tom", "muy" y "es" son cortas.
  assert.deepEqual([...palabrasLargas("Tom está muy cansado.")], ["está", "cansado"]);
});

// Contracciones: "Tom's" y "Tom is" se consideran lo mismo.
test("simplificarIngles deshace las contracciones", () => {
  // Con y sin contracción dan lo mismo.
  assert.equal(simplificarIngles("Tom's very tired."), simplificarIngles("Tom is very tired."));
  // Igual con "I'm" y "don't".
  assert.equal(simplificarIngles("I'm sure I don't know."), simplificarIngles("I am sure I do not know."));
  // Frases distintas siguen siendo distintas.
  assert.notEqual(simplificarIngles("I'm tired."), simplificarIngles("I'm hungry."));
});

// Mezclar no pierde ni inventa elementos.
test("mezclar conserva los mismos elementos", () => {
  // Mezclamos una lista.
  const mezclada = mezclar([1, 2, 3, 4, 5], azarFijo(3));
  // Ordenada, es igual a la original.
  assert.deepEqual([...mezclada].sort(), [1, 2, 3, 4, 5]);
});

// Las parecidas van primero y nunca aparecen la correcta ni sus equivalentes.
test("traduccionesParecidas ordena por parecido y descarta equivalentes", () => {
  // Calculamos la lista.
  const lista = traduccionesParecidas(FRASES, CORRECTA);
  // No incluye la traducción correcta.
  assert.ok(!lista.includes("Tom está muy cansado."));
  // No incluye la frase que dice lo mismo con contracción.
  assert.ok(!lista.includes("Tom está cansadísimo."));
  // Las cuatro primeras son las que comparten palabras.
  assert.deepEqual(new Set(lista.slice(0, 4)), new Set(["Mary está cansada.", "Tom estaba cansado ayer.", "No estoy cansado.", "¿Está cansado?"]));
});

// Las opciones: tres, distintas, con la correcta, y nunca un equivalente.
test("elegirOpciones da tres opciones distintas con la correcta", () => {
  // Probamos con varias semillas de azar.
  for (let semilla = 1; semilla <= 50; semilla++) {
    // Elegimos opciones.
    const opciones = elegirOpciones(FRASES, CORRECTA, 3, azarFijo(semilla));
    // Son tres.
    assert.equal(opciones.length, 3);
    // Sin repetir.
    assert.equal(new Set(opciones).size, 3);
    // Incluyen la correcta.
    assert.ok(opciones.includes("Tom está muy cansado."));
    // Nunca la equivalente con contracción.
    assert.ok(!opciones.includes("Tom está cansadísimo."));
  }
});

// La correcta no siempre sale en la misma posición.
test("la opción correcta cambia de posición", () => {
  // Posiciones donde ha salido la correcta.
  const posiciones = new Set();
  // Probamos con varias semillas.
  for (let semilla = 1; semilla <= 30; semilla++) {
    // Guardamos la posición de la correcta.
    posiciones.add(elegirOpciones(FRASES, CORRECTA, 3, azarFijo(semilla)).indexOf("Tom está muy cansado."));
  }
  // Ha salido en las tres posiciones.
  assert.equal(posiciones.size, 3);
});
