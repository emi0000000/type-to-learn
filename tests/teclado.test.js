// Pruebas de js/teclado.js (tipos de teclado, teclas para cada carácter y lecciones). Se ejecutan con: npm test

// Herramienta de pruebas que trae Node.
const { test } = require("node:test");
// Comprobaciones estrictas.
const assert = require("node:assert/strict");
// Para leer archivos.
const fs = require("node:fs");
// Para construir rutas.
const path = require("node:path");
// Para ejecutar los archivos de frases en un espacio aislado.
const vm = require("node:vm");
// Lo que vamos a probar.
const { DISPOSICIONES, LECCIONES, dedoDe, pasosPara, disposicionPorIdioma, disposicionPorMapa, ejerciciosDeLeccion } = require("../js/teclado.js");

// Carga un archivo de datos tal como lo lee el navegador y devuelve la variable que crea.
function cargar(archivo, variable) {
  // Objeto que hace de "window" del navegador.
  const ventana = {};
  // Ejecutamos el archivo: deja los datos en ventana[variable].
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, "..", "datos", archivo), "utf8"), { window: ventana });
  // Devolvemos la lista.
  return ventana[variable];
}

// Frases de donde salen las palabras de las lecciones.
const FUENTES = {
  frasesEs: cargar("frases-es.js", "FRASES_ES").map((frase) => frase[1]), // español
  frasesEn: cargar("frases-en.js", "FRASES_EN").map((frase) => frase[1]), // inglés
};

// Resume los pasos como texto corto, para comparar fácilmente: "Mayús+Digit2", "AltGr+KeyQ"...
function resumen(pasos) {
  // Sin pasos, null.
  if (!pasos) {
    // Nada.
    return null;
  }
  // Cada paso con sus modificadores.
  return pasos.map((paso) => `${paso.mayus ? "Mayús+" : ""}${paso.altgr ? "AltGr+" : ""}${paso.codigo}${paso.muerta ? "(muerta)" : ""}`).join(" ");
}

// Todas las filas de los tres teclados miden lo mismo (15 unidades), para que el dibujo quede recto.
test("las filas de cada teclado miden 15 unidades", () => {
  // Recorremos los teclados.
  for (const [id, disposicion] of Object.entries(DISPOSICIONES)) {
    // Recorremos sus filas.
    for (const fila of disposicion.filas) {
      // Suma de anchos.
      assert.equal(fila.reduce((suma, tecla) => suma + tecla[4], 0), 15, id);
    }
  }
});

// La arroba está en un sitio distinto en cada teclado.
test("la @ en cada teclado", () => {
  // España: Alt Gr + 2.
  assert.equal(resumen(pasosPara("@", "es")), "AltGr+Digit2");
  // Latinoamérica: Alt Gr + Q.
  assert.equal(resumen(pasosPara("@", "la")), "AltGr+KeyQ");
  // Estados Unidos: Mayús + 2.
  assert.equal(resumen(pasosPara("@", "us")), "Mayús+Digit2");
});

// Las letras con tilde se escriben con una tecla muerta y la letra.
test("las tildes usan una tecla muerta", () => {
  // España: ´ (a la derecha de la ñ) y luego a.
  assert.equal(resumen(pasosPara("á", "es")), "Quote(muerta) KeyA");
  // Latinoamérica: ´ (a la derecha de la p) y luego a.
  assert.equal(resumen(pasosPara("á", "la")), "BracketLeft(muerta) KeyA");
  // Mayúscula con tilde: la letra con Mayús.
  assert.equal(resumen(pasosPara("É", "es")), "Quote(muerta) Mayús+KeyE");
  // Diéresis: Mayús + ´ y luego u.
  assert.equal(resumen(pasosPara("ü", "es")), "Mayús+Quote(muerta) KeyU");
  // El teclado inglés no tiene tildes.
  assert.equal(pasosPara("á", "us"), null);
});

// Un carácter que es tecla muerta se escribe solo pulsando después Espacio.
test("una tecla muerta sola lleva Espacio después", () => {
  // El ^ en España: Mayús + ` y Espacio.
  assert.equal(resumen(pasosPara("^", "es")), "Mayús+BracketLeft(muerta) Space");
  // En inglés es Mayús + 6, sin tecla muerta.
  assert.equal(resumen(pasosPara("^", "us")), "Mayús+Digit6");
});

// Los signos de apertura del español.
test("¿ y ¡ en los teclados españoles", () => {
  // España: ¿ es Mayús + ¡.
  assert.equal(resumen(pasosPara("¿", "es")), "Mayús+Equal");
  // Latinoamérica: ¿ va sin Mayús.
  assert.equal(resumen(pasosPara("¿", "la")), "Equal");
  // Y la ñ en su tecla.
  assert.equal(resumen(pasosPara("ñ", "la")), "Semicolon");
});

// Cada tecla tiene su dedo.
test("dedoDe asigna los dedos de la fila central", () => {
  // A: meñique izquierdo.
  assert.equal(dedoDe("KeyA"), "menique-izq");
  // F: índice izquierdo.
  assert.equal(dedoDe("KeyF"), "indice-izq");
  // J: índice derecho.
  assert.equal(dedoDe("KeyJ"), "indice-der");
  // Espacio: pulgar.
  assert.equal(dedoDe("Space"), "pulgar");
});

// El teclado se adivina por el idioma o por el mapa de teclas del navegador.
test("se reconoce el tipo de teclado", () => {
  // Español de España.
  assert.equal(disposicionPorIdioma(["es-ES"]), "es");
  // Español de México.
  assert.equal(disposicionPorIdioma(["es-MX"]), "la");
  // Inglés.
  assert.equal(disposicionPorIdioma(["en-US"]), "us");
  // Mapa de un teclado latinoamericano.
  assert.equal(disposicionPorMapa(new Map([["Semicolon", "ñ"], ["Backquote", "|"]])), "la");
  // Mapa de un teclado de España.
  assert.equal(disposicionPorMapa(new Map([["Semicolon", "ñ"], ["Backquote", "º"]])), "es");
  // Mapa de un teclado inglés.
  assert.equal(disposicionPorMapa(new Map([["Semicolon", ";"], ["Backquote", "`"]])), "us");
});

// Todos los ejercicios de todas las lecciones se pueden escribir con su teclado.
test("los ejercicios de las lecciones se pueden escribir", () => {
  // Recorremos los teclados.
  for (const disposicion of Object.keys(DISPOSICIONES)) {
    // Recorremos las lecciones.
    for (const leccion of LECCIONES) {
      // Ejercicios.
      const ejercicios = ejerciciosDeLeccion(leccion, disposicion, FUENTES);
      // La lección de tildes no existe en el teclado inglés; el resto tiene bastantes ejercicios.
      if (leccion.soloEspanol && disposicion === "us") {
        // Vacía.
        assert.equal(ejercicios.length, 0);
      } else {
        // Al menos 30.
        assert.ok(ejercicios.length >= 30, `${disposicion} ${leccion.id}: ${ejercicios.length}`);
      }
      // Recorremos los ejercicios.
      for (const [, texto] of ejercicios) {
        // Cada carácter tiene forma de escribirse.
        for (const caracter of texto) {
          // Pasos para el carácter.
          assert.ok(pasosPara(caracter, disposicion), `${disposicion} ${leccion.id}: «${caracter}» en «${texto}»`);
        }
      }
    }
  }
});

// Las lecciones de letras solo usan sus letras.
test("la lección de la fila central solo usa esas letras", () => {
  // Ejercicios con el teclado de España.
  for (const [, texto] of ejerciciosDeLeccion(LECCIONES[0], "es", FUENTES)) {
    // Solo letras de la fila central y espacios.
    assert.match(texto, /^[asdfghjklñ ]+$/);
  }
});
