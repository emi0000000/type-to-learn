// modos/calculos.js: los modos de matemáticas «de resultado».
// Se ve una operación (37 + 48, 2⁵, x² − 5x + 6 = 0...) y hay que escribir solo el resultado y pulsar Intro.
// Si se falla, se ve la solución explicada y se pierde una vida.
// - Sumas y restas.
// - Operaciones: multiplicar, dividir y potencias.
// - Fórmula general: ecuaciones de segundo grado (las dos soluciones separadas por punto y coma).
// - Mezcla: porcentajes, raíces, fracciones, ecuaciones de primer grado y orden de las operaciones.
// Los problemas los crea aritmetica.js.

// Todo va dentro de una función que se ejecuta al momento, para no llenar el espacio global.
const ModosCalculo = (() => {
  // Botones de símbolos útiles al escribir resultados.
  const TECLAS = ["−", "/", ";", ",", "√"];

  // Adapta un texto al idioma de la interfaz: "5 % · 260" se lee "5 % de 260" o "5% of 260".
  function adaptar(texto) {
    // Solo cambia el porcentaje.
    return texto.replace(/(\d+) % · /g, idiomaActual() === "en" ? "$1% of " : "$1 % de ");
  }

  // Crea un modo.
  //   id:      nombre interno ("calculo-sumas"...)
  //   crear(): función que crea la lista de problemas
  //   consigna: clave del texto de encima
  function crearModo(id, crear, consigna) {
    // Problemas creados (la primera vez).
    let problemas = null;
    // Descripción del modo para el motor.
    return {
      id, // nombre interno
      idioma: "zxx", // los números no son de ningún idioma
      teclas: TECLAS, // botones de símbolos
      respuesta: true, // se escribe el resultado
      sinVoz: true, // no se lee en voz alta
      sinIdioma: true, // no se muestra el idioma
      // Lista de problemas: [número, respuesta, enunciado, nivel, solución explicada].
      frases() {
        // La primera vez, los creamos.
        if (problemas === null) {
          // Problemas del modo.
          problemas = crear();
        }
        // Los devolvemos.
        return problemas;
      },
      enunciado: (frase) => adaptar(frase[2]), // la operación
      consigna: () => t(consigna), // qué hay que escribir
      comprobar: (escrito, frase) => comprobarNumero(escrito, frase[1]), // compara números (2,5 = 5/2...)
      solucion: (frase) => adaptar(frase[4]), // la solución explicada
      largo: (frase) => [10, 30, 50][frase[3] - 1], // dificultad según el nivel
      creditos: () => [], // problemas creados por el juego
    };
  }

  // Los cuatro modos.
  return {
    sumas: crearModo("calculo-sumas", problemasSumasRestas, "calculo.consigna"), // sumas y restas
    operaciones: crearModo("calculo-operaciones", problemasOperaciones, "calculo.consigna"), // × ÷ y potencias
    ecuaciones: crearModo("calculo-ecuaciones", problemasFormulaGeneral, "calculo.consigna.ecuacion"), // fórmula general
    mezcla: crearModo("calculo-mezcla", problemasMezcla, "calculo.consigna.mezcla"), // de todo
  };
})();
