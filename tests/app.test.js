// Pruebas de la parte de aplicación: manifest.webmanifest, sw.js e index.html. Se ejecutan con: npm test
// Comprueban que la copia sin conexión incluye todos los archivos del juego y que todos existen.

// Herramienta de pruebas que trae Node.
const { test } = require("node:test");
// Comprobaciones estrictas.
const assert = require("node:assert/strict");
// Para leer archivos.
const fs = require("node:fs");
// Para construir rutas.
const path = require("node:path");
// Para ejecutar sw.js en un espacio aislado.
const vm = require("node:vm");

// Carpeta raíz del proyecto.
const RAIZ = path.join(__dirname, "..");
// Lee un archivo del proyecto.
const leer = (archivo) => fs.readFileSync(path.join(RAIZ, archivo), "utf8");

// Lista de archivos que guarda sw.js, sacada ejecutándolo con un "self" falso.
function archivosDelServiceWorker() {
  // Espacio aislado donde se ejecuta sw.js.
  const contexto = { self: { addEventListener() {} } };
  // Ejecutamos el archivo y devolvemos su lista ARCHIVOS.
  return vm.runInNewContext(`${leer("sw.js")}; ARCHIVOS`, contexto);
}

// Todo lo que carga index.html (scripts, estilos, iconos, ficha) está en la copia sin conexión.
test("sw.js guarda todo lo que carga index.html", () => {
  // Archivos de la copia.
  const guardados = new Set(archivosDelServiceWorker());
  // Página del juego.
  const html = leer("index.html");
  // Rutas locales que la página carga con src="..." o href="..." (sin enlaces externos ni #iconos).
  const usadas = [...html.matchAll(/(?:src|href)="([^"#:]+)"/g)].map((coincidencia) => coincidencia[1]);
  // Hay unas cuantas.
  assert.ok(usadas.length > 15);
  // Todas están en la copia.
  for (const ruta of usadas) {
    // Comprobamos esta.
    assert.ok(guardados.has(ruta), `sw.js no guarda ${ruta}`);
  }
});

// Todos los archivos de la copia existen (si falta uno, el navegador no instala la copia).
test("todos los archivos de sw.js existen", () => {
  // Recorremos la lista.
  for (const ruta of archivosDelServiceWorker()) {
    // "./" es la carpeta raíz: siempre existe.
    if (ruta === "./") {
      // Siguiente.
      continue;
    }
    // El archivo existe.
    assert.ok(fs.existsSync(path.join(RAIZ, ruta)), `no existe ${ruta}`);
  }
});

// Todos los scripts del juego están en la copia (por si se añade uno y se olvida).
test("sw.js guarda todos los archivos de js/", () => {
  // Archivos de la copia.
  const guardados = new Set(archivosDelServiceWorker());
  // Scripts de js/ y js/modos/.
  const scripts = [
    ...fs.readdirSync(path.join(RAIZ, "js")).filter((nombre) => nombre.endsWith(".js")).map((nombre) => `js/${nombre}`),
    ...fs.readdirSync(path.join(RAIZ, "js", "modos")).map((nombre) => `js/modos/${nombre}`),
  ];
  // Todos guardados.
  for (const script of scripts) {
    // Comprobamos este.
    assert.ok(guardados.has(script), `sw.js no guarda ${script}`);
  }
});

// La ficha de la aplicación es válida y sus iconos existen.
test("manifest.webmanifest es válido y sus iconos existen", () => {
  // Leemos y convertimos el JSON (si está roto, falla aquí).
  const ficha = JSON.parse(leer("manifest.webmanifest"));
  // Tiene nombre.
  assert.equal(ficha.name, "Frase Exacta");
  // Se abre a pantalla completa.
  assert.equal(ficha.display, "fullscreen");
  // Tamaños de los iconos.
  const tamanos = ficha.icons.map((icono) => icono.sizes);
  // Los que piden los navegadores para poder instalar: 192 y 512.
  assert.ok(tamanos.includes("192x192") && tamanos.includes("512x512"));
  // Cada icono existe.
  for (const icono of ficha.icons) {
    // Comprobamos este.
    assert.ok(fs.existsSync(path.join(RAIZ, icono.src)), `no existe ${icono.src}`);
  }
});
