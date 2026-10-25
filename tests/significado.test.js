// Pruebas de js/significado.js (pregunta "¿Qué significa?" del modo inglés). Se ejecutan con: npm test

// Herramienta de pruebas que trae Node.
const { test } = require("node:test");
// Comprobaciones estrictas.
const assert = require("node:assert/strict");
// Funciones que vamos a probar.
const {
  palabrasLargas, // palabras de 4 letras o más
  simplificarIngles, // comparar frases en inglés
  simplificarEspanol, // comparar frases en español
  firmaEspanol, // comparar frases en español sin género
  mezclar, // mezclar listas
  traduccionesParecidas, // candidatas a opción equivocada
  elegirOpciones, // opciones de la pregunta
  invertirParejas, // parejas para el modo español
  ESPANOL_A_INGLES, // dirección del modo español
} = require("../js/significado.js");

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

// Dos frases en español que solo cambian de género dicen lo mismo en inglés.
test("firmaEspanol ignora el género", () => {
  // Cansado y cansada.
  assert.equal(firmaEspanol("Estoy cansada."), firmaEspanol("Estoy cansado."));
  // Artículos y adjetivos.
  assert.equal(firmaEspanol("La niña es alta."), firmaEspanol("El niño es alto."));
  // Pero frases distintas siguen siendo distintas.
  assert.notEqual(firmaEspanol("Estoy cansado."), firmaEspanol("Estoy contento."));
});

// simplificarEspanol solo deja letras en minúscula.
test("simplificarEspanol quita signos y mayúsculas", () => {
  // Signos de apertura, cierre y espacios fuera.
  assert.equal(simplificarEspanol("¿Está bien?"), "estábien");
});

// En el modo inglés, una traducción que solo cambia de género no sale como «equivocada».
test("no se ofrece como equivocada una traducción que solo cambia de género", () => {
  // Pregunta: "I'm tired." con traducción en masculino.
  const correcta = [1, "I'm tired.", "a", 2, "Estoy cansado.", "b"];
  // Lista: la misma idea en femenino (otra frase en inglés), y relleno.
  const frases = [correcta, [3, "I am so tired.", "a", 4, "Estoy cansada.", "b"]];
  // Relleno sin nada en común.
  for (let i = 0; i < 10; i++) {
    // Frase de relleno.
    frases.push([100 + i * 2, `Filler number ${i}.`, "a", 101 + i * 2, `Relleno ${i}.`, "b"]);
  }
  // La femenina no aparece entre las candidatas.
  assert.ok(!traduccionesParecidas(frases, correcta).includes("Estoy cansada."));
});

// invertirParejas da la vuelta a las parejas y no repite frases en español.
test("invertirParejas pone el español primero y sin repetir", () => {
  // Dos frases en inglés con la misma traducción, y otra distinta.
  const parejas = [
    [1, "I'll be back soon.", "a", 10, "Volveré pronto.", "b"],
    [2, "I will be back soon.", "c", 10, "Volveré pronto.", "b"],
    [3, "The bill, please.", "d", 11, "La cuenta, por favor.", "e"],
  ];
  // Las damos la vuelta.
  const invertidas = invertirParejas(parejas);
  // Solo dos: la repetida se queda una vez.
  assert.equal(invertidas.length, 2);
  // Formato [número, español, autor, número, inglés, autor].
  assert.deepEqual(invertidas[0], [10, "Volveré pronto.", "b", 1, "I'll be back soon.", "a"]);
});

// En el modo español, las opciones son en inglés y nunca una equivalente con contracción.
test("modo español: opciones en inglés sin equivalentes", () => {
  // Pregunta en español.
  const correcta = [1, "Tom está muy cansado.", "a", 2, "Tom is very tired.", "b"];
  // Lista del modo español.
  const frases = [
    correcta, // la propia pregunta
    [3, "Tom está cansadísimo.", "a", 4, "Tom's very tired.", "b"], // dice lo mismo en inglés
    [5, "Mary está cansada.", "a", 6, "Mary is tired.", "b"], // parecida
    [7, "Tom estaba cansado ayer.", "a", 8, "Tom was tired yesterday.", "b"], // parecida
  ];
  // Relleno sin nada en común.
  for (let i = 0; i < 10; i++) {
    // Frase de relleno.
    frases.push([100 + i * 2, `Relleno ${i}.`, "a", 101 + i * 2, `Filler number ${i}.`, "b"]);
  }
  // Probamos con varias semillas.
  for (let semilla = 1; semilla <= 30; semilla++) {
    // Elegimos opciones en la dirección del modo español.
    const opciones = elegirOpciones(frases, correcta, 3, azarFijo(semilla), ESPANOL_A_INGLES);
    // Tres, distintas y con la correcta.
    assert.equal(new Set(opciones).size, 3);
    // Incluye la correcta.
    assert.ok(opciones.includes("Tom is very tired."));
    // Nunca la equivalente con contracción.
    assert.ok(!opciones.includes("Tom's very tired."));
  }
});
