// Pruebas de lo añadido en la tercera ronda: números con letras, problemas de cálculo, verbos irregulares,
// falsos amigos, palabras en otros idiomas, fórmulas de análisis de datos y «¿Qué lenguaje es?».
// Se ejecutan con: npm test

// Herramienta de pruebas que trae Node.
const { test } = require("node:test");
// Comprobaciones estrictas.
const assert = require("node:assert/strict");
// Para leer archivos.
const fs = require("node:fs");
// Para construir rutas.
const path = require("node:path");
// Para ejecutar archivos del navegador en un espacio aislado.
const vm = require("node:vm");
// Lo que vamos a probar.
const { numeroEnPalabras, normalizarPalabras } = require("../js/numerosEnPalabras.js");
// Problemas de cálculo.
const A = require("../js/aritmetica.js");
// Textos de la interfaz.
const { TEXTOS } = require("../js/textos.js");

// Lee un archivo del proyecto.
function leer(...partes) {
  // Lo leemos como texto.
  return fs.readFileSync(path.join(__dirname, "..", ...partes), "utf8");
}

// Carga un archivo de datos tal como lo lee el navegador y devuelve la variable que crea.
function cargar(archivo, variable) {
  // Objeto que hace de "window" del navegador.
  const ventana = {};
  // Ejecutamos el archivo.
  vm.runInNewContext(leer("datos", archivo), { window: ventana });
  // Devolvemos la lista.
  return ventana[variable];
}

// --- Números con letras ---

// Los números se escriben bien en inglés y en español (con sus tildes y apócopes).
test("números con letras en inglés y en español", () => {
  // Parejas [número, inglés, español].
  const casos = [
    [0, "zero", "cero"],
    [15, "fifteen", "quince"],
    [16, "sixteen", "dieciséis"],
    [21, "twenty-one", "veintiuno"],
    [22, "twenty-two", "veintidós"],
    [47, "forty-seven", "cuarenta y siete"],
    [100, "one hundred", "cien"],
    [101, "one hundred one", "ciento uno"],
    [115, "one hundred fifteen", "ciento quince"],
    [500, "five hundred", "quinientos"],
    [1000, "one thousand", "mil"],
    [1001, "one thousand one", "mil uno"],
    [2026, "two thousand twenty-six", "dos mil veintiséis"],
    [21000, "twenty-one thousand", "veintiún mil"],
    [9999, "nine thousand nine hundred ninety-nine", "nueve mil novecientos noventa y nueve"],
  ];
  // Recorremos los casos.
  for (const [n, en, es] of casos) {
    // Inglés.
    assert.equal(numeroEnPalabras(n, "en"), en, `${n} en inglés`);
    // Español.
    assert.equal(numeroEnPalabras(n, "es"), es, `${n} en español`);
  }
});

// En inglés da igual el guion y la palabra "and"; en español cuentan las tildes.
test("las respuestas con letras se comparan con flexibilidad", () => {
  // Sin guion.
  assert.equal(normalizarPalabras("Forty seven", "en"), normalizarPalabras("forty-seven", "en"));
  // Con "and".
  assert.equal(normalizarPalabras("one hundred and five", "en"), normalizarPalabras("one hundred five", "en"));
  // En español, sin tilde no vale.
  assert.notEqual(normalizarPalabras("dieciseis", "es"), normalizarPalabras("dieciséis", "es"));
  // Mayúsculas y espacios de más dan igual.
  assert.equal(normalizarPalabras("  Cuarenta  Y siete ", "es"), "cuarenta y siete");
});

// --- Problemas de cálculo ---

// Calcula el valor de un enunciado de sumas, restas, multiplicaciones, divisiones y potencias ("2⁵ =").
function calcular(enunciado) {
  // Cifras pequeñas a normales.
  const sub = { "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4", "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9", "⁻": "-" };
  // Pasamos a una expresión de JavaScript.
  const expresion = enunciado
    // Sin el igual final.
    .replace(/=\s*$/, "")
    // Potencias: 2⁵ -> 2**(5); (−4)² -> (−4)**(2).
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+/g, (cifras) => `**(${[...cifras].map((c) => sub[c]).join("")})`)
    // Signos.
    .replace(/−/g, "-")
    // Por.
    .replace(/×/g, "*")
    // Entre.
    .replace(/÷/g, "/");
  // Lo calculamos.
  return Function(`return (${expresion});`)();
}

// Cada modo tiene 150 problemas, 50 por nivel, sin enunciados repetidos y con su solución explicada.
test("problemas de cálculo: formato", () => {
  // Los cuatro generadores.
  for (const crear of [A.problemasSumasRestas, A.problemasOperaciones, A.problemasFormulaGeneral, A.problemasMezcla]) {
    // Problemas.
    const problemas = crear();
    // 150 en total.
    assert.equal(problemas.length, 150, crear.name);
    // 50 de cada nivel.
    for (const nivel of [1, 2, 3]) {
      // Cuenta.
      assert.equal(problemas.filter((p) => p[3] === nivel).length, 50, `${crear.name} nivel ${nivel}`);
    }
    // Números distintos.
    assert.equal(new Set(problemas.map((p) => p[0])).size, 150);
    // Enunciados distintos.
    assert.equal(new Set(problemas.map((p) => p[2])).size, 150);
    // Cada uno con respuesta, enunciado y solución.
    for (const [, respuesta, enunciado, , solucion] of problemas) {
      // Todo con texto.
      assert.ok(respuesta && enunciado && solucion, `${crear.name}: ${enunciado}`);
      // La propia respuesta se da por buena.
      assert.ok(A.comprobarNumero(respuesta, respuesta), `${enunciado} -> ${respuesta}`);
    }
    // Siempre se crean iguales (para recordar cuáles ya salieron).
    assert.deepEqual(crear(), problemas);
  }
});

// Las sumas, restas, multiplicaciones, divisiones y potencias tienen la respuesta correcta.
test("problemas de cálculo: respuestas correctas", () => {
  // Sumas y restas y operaciones.
  for (const problema of [...A.problemasSumasRestas(), ...A.problemasOperaciones()]) {
    // Valor del enunciado.
    const valor = calcular(problema[2]);
    // Igual a la respuesta.
    assert.equal(Number(problema[1]), valor, problema[2]);
  }
});

// Las soluciones de las ecuaciones de segundo grado cumplen la ecuación.
test("fórmula general: las soluciones cumplen la ecuación", () => {
  // Recorremos los problemas.
  for (const [, respuesta, enunciado] of A.problemasFormulaGeneral()) {
    // Coeficientes: "2x² − 3x + 1 = 0".
    const partes = enunciado.replace(/−/g, "-").replace(/\s+/g, "").match(/^(-?\d*)x²(?:([+-]\d*)x)?([+-]\d+)?=0$/);
    // El enunciado tiene la forma esperada.
    assert.ok(partes, enunciado);
    // Coeficiente: "" = 1, "-" = −1.
    const coeficiente = (texto, defecto) => (texto === undefined ? defecto : texto === "" || texto === "+" ? 1 : texto === "-" ? -1 : Number(texto));
    // a, b y c.
    const [a, b, c] = [coeficiente(partes[1], 1), coeficiente(partes[2], 0), partes[3] === undefined ? 0 : Number(partes[3])];
    // Soluciones.
    const raices = A.leerLista(respuesta);
    // Una o dos.
    assert.ok(raices.length === 1 || raices.length === 2, respuesta);
    // Cada una cumple la ecuación.
    for (const x of raices) {
      // a·x² + b·x + c = 0.
      assert.ok(Math.abs(a * x * x + b * x + c) < 1e-9, `${enunciado}: ${x}`);
    }
    // Si hay una sola, es raíz doble (discriminante cero).
    if (raices.length === 1) {
      // Δ = 0.
      assert.equal(b * b - 4 * a * c, 0, enunciado);
    }
  }
});

// Las respuestas se comparan como números: 2,5 = 5/2, −8 = -8, el orden de las soluciones da igual.
test("comprobarNumero acepta formas equivalentes", () => {
  // Casos que valen.
  for (const [escrito, correcta] of [["2,5", "5/2"], ["−8", "-8"], ["x = 5", "5"], ["3; 2", "2; 3"], ["x1 = 2; x2 = 3", "2; 3"], ["3; 3", "3"], ["0.75", "3/4"]]) {
    // Vale.
    assert.ok(A.comprobarNumero(escrito, correcta), `${escrito} = ${correcta}`);
  }
  // Casos que no valen.
  for (const [escrito, correcta] of [["2", "2; 3"], ["5", "-5"], ["2; 4", "2; 3"], ["hola", "1"]]) {
    // No vale.
    assert.ok(!A.comprobarNumero(escrito, correcta), `${escrito} ≠ ${correcta}`);
  }
});

// --- Verbos irregulares ---

// Carga el modo de verbos con lo mínimo que necesita del navegador.
function cargarModoVerbos() {
  // Espacio aislado con la lista de verbos y una t() falsa.
  const contexto = { VERBOS_IRREGULARES: cargar("verbos.js", "VERBOS_IRREGULARES"), t: (clave) => clave };
  // Ejecutamos el archivo y sacamos el modo.
  vm.runInNewContext(`${leer("js", "modos", "verbos.js")}\nthis.ModoVerbos = ModoVerbos;`, contexto);
  // Devolvemos el modo.
  return contexto.ModoVerbos;
}

// La lista de verbos está completa y sin repetir.
test("verbos: formato", () => {
  // Lista.
  const verbos = cargar("verbos.js", "VERBOS_IRREGULARES");
  // 90 verbos.
  assert.equal(verbos.length, 90);
  // Números e infinitivos distintos.
  assert.equal(new Set(verbos.map((v) => v[0])).size, 90);
  // Infinitivos distintos.
  assert.equal(new Set(verbos.map((v) => v[1])).size, 90);
  // Cada uno con sus formas, su significado y su nivel.
  for (const [, base, pasado, participio, significado, nivel] of verbos) {
    // Solo letras y barras.
    assert.ok(/^[a-z]+$/.test(base) && /^[a-z/]+$/.test(pasado) && /^[a-z/]+$/.test(participio), base);
    // Significado.
    assert.ok(significado.length > 0, base);
    // Nivel 1, 2 o 3.
    assert.ok([1, 2, 3].includes(nivel), base);
  }
});

// La respuesta de los verbos acepta separadores y formas alternativas.
test("verbos: comprobar la respuesta", () => {
  // Modo.
  const modo = cargarModoVerbos();
  // Verbo por infinitivo.
  const verbo = (base) => cargar("verbos.js", "VERBOS_IRREGULARES").find((v) => v[1] === base);
  // Separadores.
  assert.ok(modo.comprobarVerbo("went gone", verbo("go")));
  // Coma.
  assert.ok(modo.comprobarVerbo("Went, gone", verbo("go")));
  // Guion.
  assert.ok(modo.comprobarVerbo("went - gone", verbo("go")));
  // Una de las dos formas del pasado.
  assert.ok(modo.comprobarVerbo("were been", verbo("be")));
  // Las dos formas.
  assert.ok(modo.comprobarVerbo("was/were been", verbo("be")));
  // Al revés no vale.
  assert.ok(!modo.comprobarVerbo("gone went", verbo("go")));
  // Solo una forma no vale.
  assert.ok(!modo.comprobarVerbo("went", verbo("go")));
  // La forma regular de un irregular no vale.
  assert.ok(!modo.comprobarVerbo("goed goed", verbo("go")));
  // La solución que se enseña también vale.
  for (const frase of modo.frases()) {
    // "went – gone".
    assert.ok(modo.comprobar(frase[1], frase), frase[1]);
  }
});

// --- Falsos amigos ---

// Cada falso amigo tiene sus cuatro textos y no se repiten.
test("falsos amigos: formato", () => {
  // Lista.
  const lista = cargar("falsos-amigos.js", "FALSOS_AMIGOS");
  // 40.
  assert.equal(lista.length, 40);
  // Números distintos.
  assert.equal(new Set(lista.map((f) => f[0])).size, lista.length);
  // Palabras inglesas distintas.
  assert.equal(new Set(lista.map((f) => f[1])).size, lista.length);
  // Trampas españolas distintas.
  assert.equal(new Set(lista.map((f) => f[3])).size, lista.length);
  // Todos los textos.
  for (const entrada of lista) {
    // Cinco campos con texto.
    assert.ok(entrada.length === 5 && entrada.slice(1).every((texto) => typeof texto === "string" && texto.length > 0), entrada[1]);
    // El significado y la trampa son distintos (si no, no hay trampa).
    assert.notEqual(entrada[2], entrada[3], entrada[1]);
  }
});

// --- Otros idiomas ---

// Las palabras en francés, portugués, italiano y alemán existen en el vocabulario principal y no se repiten.
test("vocabulario en otros idiomas: formato", () => {
  // Lista.
  const lista = cargar("vocabulario-idiomas.js", "VOCABULARIO_IDIOMAS");
  // Vocabulario principal.
  const principal = new Set(cargar("vocabulario.js", "VOCABULARIO").map((entrada) => entrada[0]));
  // Unas cuantas.
  assert.ok(lista.length >= 150);
  // Cada fila.
  for (const fila of lista) {
    // Su número existe en el vocabulario principal.
    assert.ok(principal.has(fila[0]), `número ${fila[0]}`);
    // Cuatro palabras con texto.
    assert.ok(fila.length === 5 && fila.slice(1).every((palabra) => typeof palabra === "string" && palabra.trim() === palabra && palabra.length > 0), `número ${fila[0]}`);
  }
  // Números distintos.
  assert.equal(new Set(lista.map((fila) => fila[0])).size, lista.length);
  // Sin palabras repetidas en cada idioma.
  for (const columna of [1, 2, 3, 4]) {
    // Palabras de ese idioma.
    assert.equal(new Set(lista.map((fila) => fila[columna])).size, lista.length, `columna ${columna}`);
  }
});

// --- Análisis de datos y lenguajes ---

// Cada fórmula o línea de datos tiene su herramienta, sus explicaciones y dos versiones con error.
test("análisis de datos: formato", () => {
  // Lista.
  const lista = cargar("analisis.js", "ANALISIS");
  // Texto (o pareja de textos [español, inglés]).
  const esTexto = (valor) => (Array.isArray(valor) ? valor.length === 2 && valor.every((v) => typeof v === "string" && v.length > 0) : typeof valor === "string" && valor.length > 0);
  // Números distintos.
  assert.equal(new Set(lista.map((entrada) => entrada[0])).size, lista.length);
  // Cada entrada.
  for (const [numero, herramienta, codigo, es, en, errores] of lista) {
    // Herramienta conocida.
    assert.ok(["excel", "pandas", "numpy"].includes(herramienta), `número ${numero}`);
    // Código y explicaciones.
    assert.ok(esTexto(codigo) && es.length > 0 && en.length > 0, `número ${numero}`);
    // Dos versiones con error, con su explicación en los dos idiomas.
    assert.equal(errores.length, 2, `número ${numero}`);
    // Cada error.
    for (const error of errores) {
      // Código con error y explicación.
      assert.ok(esTexto(error[0]) && error[1].length > 0 && error[2].length > 0, `número ${numero}`);
      // Distinta de la correcta.
      assert.notDeepEqual(error[0], codigo, `número ${numero}`);
    }
  }
  // Cada herramienta tiene unas cuantas (para que haya opciones equivocadas del mismo tipo).
  for (const herramienta of ["excel", "pandas", "numpy"]) {
    // Al menos 8.
    assert.ok(lista.filter((entrada) => entrada[1] === herramienta).length >= 8, herramienta);
  }
});

// «¿Qué lenguaje es?»: cada línea tiene su lenguaje, su pista y su familia.
test("lenguajes: formato", () => {
  // Líneas.
  const lista = cargar("lenguajes.js", "LENGUAJES_CODIGO");
  // Familias.
  const familias = cargar("lenguajes.js", "FAMILIAS_DE_LENGUAJES");
  // Lenguajes de las familias.
  const conFamilia = new Set(familias.flat());
  // Números y códigos distintos.
  assert.equal(new Set(lista.map((entrada) => entrada[0])).size, lista.length);
  // Códigos distintos.
  assert.equal(new Set(lista.map((entrada) => entrada[2])).size, lista.length);
  // Cada línea.
  for (const [numero, lenguaje, codigo, es, en] of lista) {
    // Todo con texto y el lenguaje en alguna familia.
    assert.ok(codigo && es && en && conFamilia.has(lenguaje), `número ${numero}`);
  }
  // Cada lenguaje tiene al menos dos líneas.
  for (const lenguaje of new Set(lista.map((entrada) => entrada[1]))) {
    // Cuenta.
    assert.ok(lista.filter((entrada) => entrada[1] === lenguaje).length >= 2, lenguaje);
  }
});

// --- Textos de los modos nuevos ---

// Cada modo nuevo tiene nombre, tema y descripción, y el menú tiene las secciones nuevas.
test("los modos nuevos tienen sus textos", () => {
  // Modos nuevos.
  const ids = ["numeros-en", "numeros-es", "verbos-en", "falsos-en", "falsos-es", "calculo-sumas", "calculo-operaciones", "calculo-ecuaciones", "calculo-mezcla", "codigo-lenguaje", "datos-escribir", "datos-errores", "datos-usos"];
  // Dictado y pronunciación en seis idiomas.
  for (const idioma of ["en", "es", "fr", "pt", "it", "de"]) {
    // Los dos modos.
    ids.push(`dictado-${idioma}`, `pronunciacion-${idioma}`);
  }
  // Palabras en cuatro idiomas más.
  for (const idioma of ["fr", "pt", "it", "de"]) {
    // Modo de palabras.
    ids.push(`palabras-${idioma}`);
  }
  // Lecciones del ratón.
  for (const leccion of ["mover", "clic", "dobleclic", "derecho", "arrastrar", "rueda", "mezcla"]) {
    // Modo de la lección.
    ids.push(`raton-${leccion}`);
  }
  // Recorremos los modos.
  for (const id of ids) {
    // Los tres textos.
    for (const parte of ["nombre", "direccion", "detalle"]) {
      // Existe.
      assert.ok(`modo.${id}.${parte}` in TEXTOS.es, `modo.${id}.${parte}`);
    }
  }
  // Código del menú.
  const principal = leer("js", "principal.js");
  // Las secciones nuevas están en el menú y tienen nombre.
  for (const seccion of ["datos", "raton"]) {
    // Sección.
    assert.ok(principal.includes(`id: "${seccion}"`) && `seccion.${seccion}` in TEXTOS.es, seccion);
  }
  // Los idiomas que se pueden aprender tienen nombre.
  for (const idioma of ["en", "es", "fr", "pt", "it", "de"]) {
    // Nombre del idioma.
    assert.ok(`idioma.${idioma}` in TEXTOS.es, idioma);
  }
  // Las lecciones del ratón coinciden con las de raton.js.
  assert.ok(leer("js", "raton.js").includes('const LECCIONES = ["mover", "clic", "dobleclic", "derecho", "arrastrar", "rueda", "mezcla"];'));
});
