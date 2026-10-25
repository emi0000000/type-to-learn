// principal.js: arranca el juego y maneja el menú principal.
// Es el último archivo que se carga, así que todo lo demás ya está disponible.

// Muestra el menú y actualiza los datos que aparecen en él.
function mostrarMenu() {
  // Mostramos la pantalla del menú.
  mostrarPantalla("pantalla-menu");
  // Actualizamos frases disponibles y récord.
  actualizarMenu();
}

// Escribe en el menú cuántas frases hay, cuántas faltan por ver y el récord.
function actualizarMenu() {
  // Párrafo donde va la información.
  const estado = document.getElementById("menu-estado");
  // Botón del modo ortografía.
  const boton = document.getElementById("boton-ortografia");
  // Si no se cargó el archivo de frases, el modo no puede funcionar.
  if (typeof FRASES_ES === "undefined" || !Array.isArray(FRASES_ES) || FRASES_ES.length === 0) {
    // Explicamos el problema.
    estado.textContent = "No se pudieron cargar las frases (datos/frases-es.js). Comprueba que el archivo existe.";
    // Desactivamos el botón para que no dé errores.
    boton.disabled = true;
    // No hay nada más que mostrar.
    return;
  }
  // Récord guardado.
  const record = ModoOrtografia.leerRecord();
  // Frases que todavía no han salido.
  const sinVer = ModoOrtografia.frasesSinVer();
  // "frase" o "frases", según el número.
  const unidad = record === 1 ? "frase" : "frases";
  // Escribimos el resumen.
  estado.textContent = `${FRASES_ES.length} frases revisadas · ${sinVer} sin ver · Récord: ${record} ${unidad}`;
}

// Al pulsar "Ortografía", empieza una partida de ese modo.
document.getElementById("boton-ortografia").addEventListener("click", () => ModoOrtografia.iniciar());

// Al abrir la página, mostramos el menú.
mostrarMenu();
