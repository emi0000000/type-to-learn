// principal.js: arranca el juego y maneja el menú principal.
// Es el último archivo que se carga, así que todo lo demás ya está disponible.

// Modos que se pueden jugar, con su botón del menú, su línea de estado y su archivo de frases.
const MODOS = [
  // Modo ortografía.
  { modo: ModoOrtografia, boton: "boton-ortografia", estado: "estado-ortografia", archivo: "datos/frases-es.js" },
  // Modo inglés.
  { modo: ModoIngles, boton: "boton-ingles", estado: "estado-ingles", archivo: "datos/frases-en.js" },
];

// Muestra el menú y actualiza los datos que aparecen en él.
function mostrarMenu() {
  // Mostramos la pantalla del menú.
  mostrarPantalla("pantalla-menu");
  // Actualizamos frases disponibles y récords.
  actualizarMenu();
}

// Escribe bajo cada modo cuántas frases tiene, cuántas faltan por ver y su récord.
function actualizarMenu() {
  // Recorremos los modos.
  for (const { modo, boton, estado, archivo } of MODOS) {
    // Línea de estado de este modo.
    const linea = document.getElementById(estado);
    // Total de frases del modo.
    const total = modo.frases().length;
    // Si no se cargó el archivo de frases, el modo no puede funcionar.
    if (total === 0) {
      // Explicamos el problema.
      linea.textContent = `No se pudieron cargar las frases (${archivo}).`;
      // Desactivamos el botón para que no dé errores.
      document.getElementById(boton).disabled = true;
      // Pasamos al siguiente modo.
      continue;
    }
    // Récord guardado.
    const record = Motor.leerRecord(modo);
    // Frases que todavía no han salido.
    const sinVer = Motor.frasesSinVer(modo);
    // Escribimos el resumen.
    linea.textContent = `${total} frases · ${sinVer} sin ver · Récord: ${record}`;
  }
}

// Al pulsar el botón de un modo, empieza una partida de ese modo.
for (const { modo, boton } of MODOS) {
  // Conectamos el botón.
  document.getElementById(boton).addEventListener("click", () => Motor.jugar(modo));
}

// Al abrir la página, mostramos el menú.
mostrarMenu();
