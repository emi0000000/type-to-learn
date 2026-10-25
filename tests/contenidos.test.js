// Pruebas de los contenidos escritos para el proyecto: vocabulario, fórmulas, código y abecedario.
// Se ejecutan con: npm test

// Herramienta de pruebas que trae Node.
const { test } = require("node:test");
// Comprobaciones estrictas.
const assert = require("node:assert/strict");
// Para leer archivos.
const fs = require("node:fs");
// Para construir rutas.
const path = require("node:path");
// Para ejecutar los archivos de datos en un espacio aislado.
const vm = require("node:vm");
// Textos de la interfaz (para comprobar que existen los nombres de temas, lenguajes y modos).
const { TEXTOS } = require("../js/textos.js");
// Abecedario.
const { LETRAS_ES, LETRAS_EN, deletrear, deletreoHablado, nombreDeLetra } = require("../js/letras.js");

// Carga un archivo de datos tal como lo lee el navegador y devuelve la variable que crea.
function cargar(archivo, variable) {
  // Objeto que hace de "window" del navegador.
  const ventana = {};
  // Ejecutamos el archivo.
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, "..", "datos", archivo), "utf8"), { window: ventana });
  // Devolvemos la lista.
  return ventana[variable];
}

// Datos.
const VOCABULARIO = cargar("vocabulario.js", "VOCABULARIO");
// Fórmulas.
const FORMULAS = cargar("matematicas.js", "FORMULAS");
// Código.
const CODIGO = cargar("codigo.js", "CODIGO");

// Botones de símbolos del modo de matemáticas (copiados de js/modos/matematicas.js, que necesita el navegador).
const TECLAS_MATES = fs.readFileSync(path.join(__dirname, "..", "js", "modos", "matematicas.js"), "utf8").match(/const TECLAS = (\[[^\]]+\])/)[1];

// --- Vocabulario ---

// Cada palabra tiene su formato y su tema existe en los textos.
test("vocabulario: formato y temas", () => {
  // Hay bastantes palabras.
  assert.ok(VOCABULARIO.length >= 400);
  // Recorremos las palabras.
  for (const entrada of VOCABULARIO) {
    // Seis datos: número, inglés, español, tema, notas.
    assert.equal(entrada.length, 6, String(entrada));
    // El tema tiene nombre en los textos.
    assert.ok(`tema.${entrada[3]}` in TEXTOS.es, entrada[3]);
    // Sin espacios de más.
    assert.equal(entrada[1], entrada[1].trim().replace(/\s+/g, " "));
    // Lo mismo en español.
    assert.equal(entrada[2], entrada[2].trim().replace(/\s+/g, " "));
    // Las notas van en los dos idiomas o en ninguno.
    assert.equal(Boolean(entrada[4]), Boolean(entrada[5]), String(entrada));
  }
});

// Ninguna palabra se repite: así cada pregunta tiene una sola respuesta correcta.
test("vocabulario: sin palabras repetidas", () => {
  // Números distintos.
  assert.equal(new Set(VOCABULARIO.map((entrada) => entrada[0])).size, VOCABULARIO.length);
  // Inglés distinto.
  assert.equal(new Set(VOCABULARIO.map((entrada) => entrada[1].toLowerCase())).size, VOCABULARIO.length);
  // Español distinto.
  assert.equal(new Set(VOCABULARIO.map((entrada) => entrada[2].toLowerCase())).size, VOCABULARIO.length);
});

// --- Fórmulas ---

// Cada fórmula tiene dos versiones con error distintas de la correcta.
test("fórmulas: tres versiones distintas", () => {
  // Recorremos las fórmulas.
  for (const [numero, tema, formula, nombreEs, nombreEn, errores] of FORMULAS) {
    // El tema tiene nombre.
    assert.ok(`tema.${tema}` in TEXTOS.es, tema);
    // Nombres en los dos idiomas.
    assert.ok(nombreEs && nombreEn, String(numero));
    // Dos versiones con error.
    assert.equal(errores.length, 2, String(numero));
    // Las tres son distintas.
    assert.equal(new Set([formula, ...errores]).size, 3, String(numero));
  }
  // Números distintos.
  assert.equal(new Set(FORMULAS.map((formula) => formula[0])).size, FORMULAS.length);
});

// Todo lo que hay en las fórmulas se puede escribir: con el teclado (ASCII) o con los botones de símbolos.
test("fórmulas: todos los caracteres se pueden escribir", () => {
  // Botones de símbolos.
  const botones = JSON.parse(TECLAS_MATES);
  // Recorremos las fórmulas y sus versiones con error.
  for (const formula of FORMULAS) {
    // Las tres versiones.
    for (const texto of [formula[2], ...formula[5]]) {
      // Cada carácter.
      for (const caracter of texto) {
        // ASCII imprimible o un botón.
        assert.ok(/[\x20-\x7e]/.test(caracter) || botones.includes(caracter), `«${caracter}» en ${texto}`);
      }
    }
  }
});

// --- Código ---

// Cada línea de código tiene su lenguaje, sus explicaciones y dos versiones con error explicadas.
test("código: formato, lenguajes y errores", () => {
  // Recorremos las líneas.
  for (const [numero, lenguaje, codigo, queEs, queEn, errores] of CODIGO) {
    // El lenguaje tiene nombre.
    assert.ok(`lenguaje.${lenguaje}` in TEXTOS.es, lenguaje);
    // Explicaciones en los dos idiomas.
    assert.ok(queEs && queEn, String(numero));
    // Solo caracteres que hay en cualquier teclado (ASCII).
    assert.match(codigo, /^[\x20-\x7e]+$/, String(numero));
    // Dos versiones con error.
    assert.equal(errores.length, 2, String(numero));
    // Cada una con su explicación en los dos idiomas.
    for (const [mal, porQueEs, porQueEn] of errores) {
      // Distinta de la correcta.
      assert.notEqual(mal, codigo, String(numero));
      // Explicada.
      assert.ok(porQueEs && porQueEn, String(numero));
    }
  }
  // Números distintos.
  assert.equal(new Set(CODIGO.map((linea) => linea[0])).size, CODIGO.length);
});

// --- Abecedario ---

// El abecedario español tiene 27 letras (con la ñ) y el inglés 26.
test("abecedario: número de letras", () => {
  // Español.
  assert.equal(LETRAS_ES.length, 27);
  // Inglés.
  assert.equal(LETRAS_EN.length, 26);
});

// Deletreo en los dos idiomas.
test("deletrear da los nombres de las letras", () => {
  // En español.
  assert.equal(deletrear("gato", "es"), "ge · a · te · o");
  // Con tilde y eñe.
  assert.equal(deletrear("niño", "es"), "ene · i · eñe · o");
  // En inglés, con la interfaz en español: como suena.
  assert.equal(deletrear("dog", "en", "es"), "di · ou · yi");
  // En inglés, con la interfaz en inglés: el nombre de la letra.
  assert.equal(deletrear("dog", "en", "en"), "dee · o · gee");
  // La h en español.
  assert.equal(nombreDeLetra("h", "es"), "hache");
  // Para leer en voz alta en inglés, las letras en mayúscula.
  assert.equal(deletreoHablado("dog", "en"), "D, O, G");
});

// --- Modos ---

// Cada modo del menú tiene sus tres textos (nombre, dirección y descripción) en los dos idiomas.
test("todos los modos tienen sus textos", () => {
  // Código del menú.
  const principal = fs.readFileSync(path.join(__dirname, "..", "js", "principal.js"), "utf8");
  // Modos que se crean en js/modos/ (busca los id: "..." y los id: `teclado-...`).
  const ids = ["ortografia", "ingles", "espanol", "palabras-ingles", "palabras-espanol", "abecedario", "mates-algebra", "mates-trigonometria", "mates-calculo", "codigo-escribir", "codigo-errores", "codigo-usos"];
  // Más las lecciones de teclado.
  for (const leccion of require("../js/teclado.js").LECCIONES) {
    // Id del modo de la lección.
    ids.push(`teclado-${leccion.id}`);
  }
  // Recorremos los modos.
  for (const id of ids) {
    // Los tres textos.
    for (const parte of ["nombre", "direccion", "detalle"]) {
      // Existe en español (y, por textos.test.js, también en inglés).
      assert.ok(`modo.${id}.${parte}` in TEXTOS.es, `modo.${id}.${parte}`);
    }
  }
  // Y el menú incluye las cuatro secciones.
  for (const seccion of ["idiomas", "matematicas", "codigo", "teclado"]) {
    // La sección está en el menú y tiene nombre.
    assert.ok(principal.includes(`id: "${seccion}"`) && `seccion.${seccion}` in TEXTOS.es, seccion);
  }
});
