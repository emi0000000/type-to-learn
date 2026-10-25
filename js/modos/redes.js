// modos/redes.js: los modos de comandos de la sección Redes (Cisco IOS y Linux).
// Son los mismos tres modos que en Código («Escribe», «Detecta el error» y «Casos de uso»),
// con los comandos de datos/redes.js y solo los del nivel elegido en la sección (fácil, medio o difícil).
// Los laboratorios completos (de enable a la red funcionando) están en js/laboratorio.js.

// Modos de comandos de redes.
const ModosRedes = (() => {
  // Número de nivel de cada valor del desplegable.
  const NIVELES = { facil: 1, medio: 2, dificil: 3 };
  // Creamos los tres modos con la parte común de codigo.js.
  return crearModosDeCodigo({
    prefijo: "redes", // nombre interno: redes-escribir...
    lista: () => (typeof COMANDOS_RED === "undefined" ? [] : COMANDOS_RED), // datos/redes.js
    ajuste: "nivelRedes", // nivel elegido en la sección
    lenguajes: ["basico", "switching", "routing", "servicios", "seguridad", "linux"], // temas
    filtro: (entrada, nivel) => entrada[6] === NIVELES[nivel], // solo los del nivel elegido
    claveEtiqueta: "redes.tema", // etiqueta: el tema ("redes.tema.routing")
  });
})();
