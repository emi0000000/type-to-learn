// Pruebas de la sección Ciberseguridad (phishing, código inseguro, registros, puertos y criptografía)
// y de los textos largos de Idiomas. Se ejecutan con: npm test

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
// Retos de criptografía y puertos.
const C = require("../js/cripto.js");
// Textos de la interfaz.
const { TEXTOS } = require("../js/textos.js");

// Carga un archivo de datos y devuelve la variable que crea.
function cargar(archivo, variable) {
  // Objeto que hace de "window".
  const ventana = {};
  // Ejecutamos el archivo.
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, "..", "datos", archivo), "utf8"), { window: ventana });
  // Devolvemos la lista.
  return ventana[variable];
}

// ¿Es una pareja [español, inglés] de textos?
const esPareja = (valor) => Array.isArray(valor) && valor.length === 2 && valor.every((texto) => typeof texto === "string" && texto.length > 0);

// Phishing: formato, los tres tipos y nada que no se pueda escribir en una línea.
test("phishing: formato", () => {
  // Lista.
  const lista = cargar("phishing.js", "PHISHING");
  // Números distintos.
  assert.equal(new Set(lista.map((e) => e[0])).size, lista.length);
  // Cada entrada.
  for (const [n, canal, remitente, mensaje, tipo, pistas] of lista) {
    // Todo bien.
    assert.ok(["correo", "sms", "web"].includes(canal) && remitente && !/\s{2}|\n/.test(remitente) && esPareja(mensaje) && esPareja(pistas), `número ${n}`);
    // Tipo conocido.
    assert.ok(["phishing", "legitimo", "spam"].includes(tipo), `número ${n}`);
  }
  // Hay de los tres tipos.
  for (const tipo of ["phishing", "legitimo", "spam"]) {
    // Al menos dos.
    assert.ok(lista.filter((e) => e[4] === tipo).length >= 2, tipo);
  }
});

// Código inseguro: dos versiones inseguras distintas, en una sola línea, y lenguajes con nombre.
test("código inseguro: formato", () => {
  // Lista.
  const lista = cargar("codigo-inseguro.js", "CODIGO_INSEGURO");
  // Números distintos.
  assert.equal(new Set(lista.map((e) => e[0])).size, lista.length);
  // Cada entrada.
  for (const [n, lenguaje, seguro, es, en, malos, nivel] of lista) {
    // Lenguaje con texto, nivel y explicaciones.
    assert.ok(`lenguaje.${lenguaje}` in TEXTOS.es && [1, 2, 3].includes(nivel) && es && en, `número ${n}`);
    // Una sola línea (se escribe en una caja de una línea).
    assert.ok(!seguro.includes("\n"), `número ${n}`);
    // Dos inseguras, distintas de la segura y explicadas.
    assert.equal(malos.length, 2, `número ${n}`);
    // Cada una.
    for (const [malo, porqueEs, porqueEn] of malos) {
      // Bien.
      assert.ok(malo !== seguro && porqueEs && porqueEn, `número ${n}`);
    }
  }
});

// Registros: respuesta, pregunta y explicación.
test("registros: formato", () => {
  // Lista.
  const lista = cargar("registros.js", "REGISTROS");
  // Cada entrada.
  for (const [n, nivel, lineas, pregunta, respuesta, otras, explicacion] of lista) {
    // Bien.
    assert.ok([1, 2, 3].includes(nivel) && lineas.length > 0 && esPareja(pregunta) && respuesta && Array.isArray(otras) && esPareja(explicacion), `número ${n}`);
  }
});

// Criptografía: cada reto se descifra de verdad a su respuesta.
test("criptografía: los retos tienen la respuesta correcta", () => {
  // Retos.
  const retos = C.retosCripto();
  // Unos cuantos de cada nivel.
  for (const nivel of [1, 2, 3]) {
    // Al menos 20.
    assert.ok(retos.filter((r) => r[3] === nivel).length >= 20, `nivel ${nivel}`);
  }
  // Cada reto.
  for (const [, respuesta, enunciado] of retos) {
    // Tipo y texto cifrado.
    const [, tipo, n, cifrado] = enunciado.match(/^(César \+(\d+)|ROT13|Hex|Base64): (.*)$/) ? enunciado.match(/^(César \+(\d+)|ROT13|Hex|Base64): (.*)$/) : [];
    // Lo desciframos.
    const claro = tipo.startsWith("César") ? C.cesar(cifrado, -Number(n)) : tipo === "ROT13" ? C.cesar(cifrado, 13) : tipo === "Hex" ? cifrado.split(" ").map((h) => String.fromCharCode(parseInt(h, 16))).join("") : atob(cifrado);
    // Coincide.
    assert.equal(claro, respuesta, enunciado);
    // La propia respuesta se acepta, también en minúscula.
    assert.ok(C.comprobarCripto(respuesta.toLowerCase(), respuesta));
  }
});

// Puertos: sin repetir y en las dos direcciones.
test("puertos: formato y respuestas", () => {
  // Lista.
  const lista = cargar("puertos.js", "PUERTOS");
  // Puertos distintos.
  assert.equal(new Set(lista.map((e) => e[0])).size, lista.length);
  // Dos problemas por puerto.
  const problemas = C.problemasPuertos(lista);
  // Doble.
  assert.equal(problemas.length, lista.length * 2);
  // Se aceptan formas equivalentes.
  assert.ok(C.comprobarPuerto("ssh", "SSH") && C.comprobarPuerto("http alt", "HTTP-Alt") && !C.comprobarPuerto("23", "22"));
});

// Textos largos: los seis idiomas con las mismas frases, en orden.
test("textos largos: seis idiomas alineados", () => {
  // Lista.
  const lista = cargar("textos-largos.js", "TEXTOS_LARGOS");
  // Unos cuantos.
  assert.ok(lista.length >= 6);
  // Cada texto.
  for (const texto of lista) {
    // Título y nivel.
    assert.ok(esPareja(texto.titulo) && [1, 2, 3].includes(texto.nivel), `texto ${texto.id}`);
    // Mismo número de frases en los seis idiomas.
    for (const idioma of ["es", "en", "fr", "pt", "it", "de"]) {
      // Igual que en español, sin frases vacías ni espacios de más.
      assert.ok(texto[idioma].length === texto.es.length && texto[idioma].every((frase) => frase && frase.trim() === frase && !/\s{2}/.test(frase)), `texto ${texto.id} ${idioma}`);
    }
  }
});

// Los modos nuevos tienen sus textos.
test("ciberseguridad y textos: textos de los modos", () => {
  // Modos.
  const ids = ["seguridad-phishing", "seguridad-errores", "seguridad-registros", "seguridad-cripto", "seguridad-puertos"];
  // Textos y traducción de cada idioma.
  for (const idioma of ["en", "es", "fr", "pt", "it", "de"]) {
    // Los dos.
    ids.push(`textos-${idioma}`, `traducir-${idioma}`);
  }
  // Cada uno con sus tres textos.
  for (const id of ids) {
    // Cada parte.
    for (const parte of ["nombre", "direccion", "detalle"]) {
      // Existe.
      assert.ok(`modo.${id}.${parte}` in TEXTOS.es, `modo.${id}.${parte}`);
    }
  }
  // La sección y sus textos.
  for (const clave of ["seccion.seguridad", "seccion.nota.seguridad", "phishing.tipo.phishing", "phishing.tipo.legitimo", "phishing.tipo.spam", "phishing.canal.correo", "phishing.canal.sms", "phishing.canal.web"]) {
    // Existe.
    assert.ok(clave in TEXTOS.es, clave);
  }
});
