// modos/numeros.js: los modos «Números con letras» (en inglés y en español).
// Se ve un número en cifras (por ejemplo 47) y hay que escribirlo con letras ("forty-seven" o "cuarenta y siete").
// En inglés da igual poner guion o no (forty-seven = forty seven) y poner "and" o no (one hundred and five).
// En español hay que poner bien las tildes (dieciséis, veintidós...).
// Usa numerosEnPalabras.js (para escribir los números) y aritmetica.js (para el azar con semilla).

// Todo va dentro de una función que se ejecuta al momento, para no llenar el espacio global.
const ModosNumeros = (() => {
  // Números del nivel 3 (de 101 a 9999): unos cuantos fijos que suelen costar y otros al azar.
  const FIJOS = [100, 101, 110, 115, 200, 300, 500, 700, 900, 999, 1000, 1001, 1100, 1500, 2000, 2026, 5000, 9999];
  // Cuántos números al azar se añaden al nivel 3.
  const AL_AZAR = 82;

  // Lista de números: [número, con letras, cifras, nivel].
  //   idioma: "en" o "es"
  function crearLista(idioma) {
    // Números elegidos.
    const numeros = new Set();
    // Nivel 1: del 0 al 20.
    for (let n = 0; n <= 20; n++) {
      // Lo añadimos.
      numeros.add(n);
    }
    // Nivel 2: del 21 al 99.
    for (let n = 21; n <= 99; n++) {
      // Lo añadimos.
      numeros.add(n);
    }
    // Nivel 3: los fijos...
    FIJOS.forEach((n) => numeros.add(n));
    // ...y otros al azar (siempre los mismos, gracias a la semilla).
    const azar = semillaAzar(4747);
    // Hasta tener los que tocan.
    while (numeros.size < 21 + 79 + FIJOS.length + AL_AZAR) {
      // Más a menudo números de tres cifras que de cuatro.
      numeros.add(azar() < 0.6 ? entre(azar, 101, 999) : entre(azar, 1000, 9999));
    }
    // Formato de frase.
    return [...numeros].map((n) => [n, numeroEnPalabras(n, idioma), String(n), n <= 20 ? 1 : n < 100 ? 2 : 3]);
  }

  // Crea uno de los dos modos.
  // (Los números se muestran sin separador de miles: en inglés es una coma y en español un punto).
  function crearModo(idioma) {
    // Lista preparada (la primera vez).
    let lista = null;
    // Descripción del modo para el motor.
    return {
      id: `numeros-${idioma}`, // nombre interno
      idioma, // idioma en que se escribe
      teclas: TECLAS_DE_IDIOMA[idioma], // botones de letras especiales (en español, tildes)
      respuesta: true, // se escribe una respuesta, no se copia
      sinVoz: true, // leerlo en voz alta daría la respuesta
      sinIdioma: true, // la etiqueta ya dice el idioma
      // Lista de números.
      frases() {
        // La primera vez, la preparamos.
        if (lista === null) {
          // Números del idioma.
          lista = crearLista(idioma);
        }
        // La devolvemos.
        return lista;
      },
      enunciado: (frase) => frase[2], // el número en cifras
      consigna: () => t("numeros.consigna"), // "Escríbelo con letras"
      etiqueta: () => t(`idioma.${idioma}`), // idioma
      // Correcta si coincide con letras (sin contar mayúsculas, guiones ni "and" en inglés).
      comprobar: (escrito, frase) => normalizarPalabras(escrito, idioma) === normalizarPalabras(frase[1], idioma),
      solucion: (frase) => frase[1], // la respuesta con letras
      largo: (frase) => [10, 30, 50][frase[3] - 1], // dificultad según el nivel
      creditos: () => [], // contenido propio del proyecto
    };
  }

  // Los dos modos.
  return { en: crearModo("en"), es: crearModo("es") };
})();
