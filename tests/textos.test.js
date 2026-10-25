// Pruebas de js/textos.js (textos de la interfaz en español e inglés). Se ejecutan con: npm test

// Herramienta de pruebas que trae Node.
const { test } = require("node:test");
// Comprobaciones estrictas.
const assert = require("node:assert/strict");
// Para leer archivos.
const fs = require("node:fs");
// Para construir rutas.
const path = require("node:path");
// Lo que vamos a probar.
const { TEXTOS, t, idiomaDelNavegador, ponerIdiomaInterfaz, idiomaActual } = require("../js/textos.js");

// Lee un archivo del proyecto.
function leer(...partes) {
  // Lo leemos como texto.
  return fs.readFileSync(path.join(__dirname, "..", ...partes), "utf8");
}

// Los dos idiomas tienen exactamente las mismas claves: no falta ningún texto por traducir.
test("español e inglés tienen las mismas claves", () => {
  // Claves en español, ordenadas.
  const es = Object.keys(TEXTOS.es).sort();
  // Claves en inglés, ordenadas.
  const en = Object.keys(TEXTOS.en).sort();
  // Deben coincidir.
  assert.deepEqual(en, es);
});

// Cada texto que pide el HTML (data-t, data-t-title...) existe en el diccionario.
test("todas las claves del HTML existen", () => {
  // Página del juego.
  const html = leer("index.html");
  // Claves usadas en atributos data-t, data-t-title, data-t-placeholder y data-t-aria-label.
  const claves = [...html.matchAll(/data-t(?:-title|-placeholder|-aria-label)?="([^"]+)"/g)].map((coincidencia) => coincidencia[1]);
  // Hay unas cuantas.
  assert.ok(claves.length > 50);
  // Todas existen en español.
  for (const clave of claves) {
    // Comprobamos esta.
    assert.ok(clave in TEXTOS.es, `falta la clave ${clave}`);
  }
});

// Cada t("...") de los archivos de JavaScript usa una clave que existe.
test("todas las claves del JavaScript existen", () => {
  // Carpeta de los scripts.
  const carpeta = path.join(__dirname, "..", "js");
  // Archivos .js de js/ y js/modos/.
  const archivos = [...fs.readdirSync(carpeta).map((nombre) => path.join(carpeta, nombre)), ...fs.readdirSync(path.join(carpeta, "modos")).map((nombre) => path.join(carpeta, "modos", nombre))].filter((archivo) => archivo.endsWith(".js"));
  // Recorremos los archivos.
  for (const archivo of archivos) {
    // Código del archivo.
    const codigo = fs.readFileSync(archivo, "utf8");
    // Llamadas t("clave") con la clave escrita tal cual.
    for (const [, clave] of codigo.matchAll(/\bt\("([a-z][\w.]*)"/g)) {
      // La clave existe.
      assert.ok(clave in TEXTOS.es, `falta la clave ${clave} (usada en ${path.basename(archivo)})`);
    }
  }
});

// t() rellena los huecos y los plurales.
test("t rellena huecos y plurales en los dos idiomas", () => {
  // En español.
  ponerIdiomaInterfaz("es");
  // Idioma en uso.
  assert.equal(idiomaActual(), "es");
  // Hueco.
  assert.equal(t("juego.nivel", { n: 2 }), "Nivel 2");
  // Plural.
  assert.equal(t("fin.unidad", { n: 1 }), "frase superada");
  // Plural con varias.
  assert.equal(t("fin.unidad", { n: 3 }), "frases superadas");
  // En inglés.
  ponerIdiomaInterfaz("en");
  // Hueco.
  assert.equal(t("juego.nivel", { n: 2 }), "Level 2");
  // Un idioma que no existe vuelve al español.
  ponerIdiomaInterfaz("fr");
  // Idioma en uso.
  assert.equal(idiomaActual(), "es");
  // Una clave que no existe se devuelve tal cual (así se nota el fallo).
  assert.equal(t("no.existe"), "no.existe");
});

// El idioma por defecto sigue al del navegador.
test("idiomaDelNavegador elige español o inglés", () => {
  // Español de México.
  assert.equal(idiomaDelNavegador(["es-MX", "en"]), "es");
  // Inglés.
  assert.equal(idiomaDelNavegador(["en-US"]), "en");
  // Francés y luego inglés: inglés.
  assert.equal(idiomaDelNavegador(["fr-FR", "en-GB"]), "en");
  // Nada reconocible: español.
  assert.equal(idiomaDelNavegador(["de-DE"]), "es");
});
