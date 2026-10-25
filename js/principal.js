// principal.js: arranca el juego y maneja el menú principal.
// Es el último archivo que se carga, así que todo lo demás ya está disponible.

// Modos que se pueden jugar, con su archivo de frases y su tecla de atajo.
// Los botones del menú se llaman "jugar-<id>" y "repasar-<id>", y la línea de estado "estado-<id>".
const MODOS = [
  // Modo ortografía.
  { modo: ModoOrtografia, archivo: "datos/frases-es.js", tecla: "1" },
  // Modo inglés.
  { modo: ModoIngles, archivo: "datos/frases-en.js", tecla: "2" },
  // Modo español.
  { modo: ModoEspanol, archivo: "datos/frases-en.js", tecla: "3" },
];

// Empieza una partida (y, si se pidió en los ajustes, pasa a pantalla completa).
//   opciones.repaso: true para jugar solo las frases falladas
function empezar(modo, opciones = {}) {
  // La pantalla completa solo se puede pedir justo tras un clic o una tecla, así que va primero.
  if (Ajustes.valor("pantallaCompleta")) {
    // Pasamos a pantalla completa.
    App.entrarPantallaCompleta();
  }
  // Empezamos la partida.
  Motor.jugar(modo, opciones);
}

// Muestra el menú y actualiza los datos que aparecen en él.
function mostrarMenu() {
  // Mostramos la pantalla del menú.
  mostrarPantalla("pantalla-menu");
  // Actualizamos frases disponibles, récords y progreso.
  actualizarMenu();
}

// Escribe bajo cada modo cuántas frases tiene, cuántas faltan por ver, su récord y su repaso,
// y arriba el resumen del progreso (días seguidos, frases y tiempo).
function actualizarMenu() {
  // Recorremos los modos.
  for (const { modo, archivo } of MODOS) {
    // Línea de estado de este modo.
    const linea = document.getElementById(`estado-${modo.id}`);
    // Botón de jugar.
    const jugar = document.getElementById(`jugar-${modo.id}`);
    // Botón de repasar.
    const repasar = document.getElementById(`repasar-${modo.id}`);
    // Total de frases del modo.
    const total = modo.frases().length;
    // Si no se cargó el archivo de frases, el modo no puede funcionar.
    if (total === 0) {
      // Explicamos el problema.
      linea.textContent = t("menu.sinFrases", { archivo });
      // Desactivamos el botón para que no dé errores.
      jugar.disabled = true;
      // Sin repaso.
      repasar.hidden = true;
      // Pasamos al siguiente modo.
      continue;
    }
    // Lo mejor del modo (velocidad).
    const mejores = Estadisticas.delModo(modo.id);
    // Escribimos el resumen: frases, sin ver, récord y, si la hay, la mejor velocidad.
    linea.textContent =
      // Frases, sin ver y récord.
      t("menu.estado", { total, sinVer: Motor.frasesSinVer(modo), record: Motor.leerRecord(modo) }) +
      // Mejor velocidad.
      (mejores.ppm > 0 ? t("menu.estadoPpm", { ppm: mejores.ppm }) : "");
    // Frases falladas pendientes de repaso.
    const pendientes = Motor.frasesFallidas(modo).length;
    // El botón de repasar solo aparece si hay alguna.
    repasar.hidden = pendientes === 0;
    // Texto del botón, con cuántas hay.
    repasar.textContent = t("menu.repasar", { n: pendientes });
  }
  // Estadísticas generales.
  const generales = Estadisticas.generales();
  // El resumen solo se ve si ya se jugó alguna partida.
  document.getElementById("menu-resumen").hidden = generales.partidas === 0;
  // Días seguidos practicando.
  document.getElementById("resumen-dias").textContent = t("menu.diasSeguidos", { n: diasSeguidos(generales.dias) });
  // Frases escritas en total.
  document.getElementById("resumen-frases").textContent = t("menu.frasesEscritas", { n: generales.frases });
  // Tiempo practicando.
  document.getElementById("resumen-tiempo").textContent = t("menu.tiempo", { t: formatearDuracion(generales.segundos) });
}

// Conectamos los botones de cada modo.
for (const { modo } of MODOS) {
  // "Jugar": partida normal.
  document.getElementById(`jugar-${modo.id}`).addEventListener("click", () => empezar(modo));
  // "Repasar": partida solo con las frases falladas.
  document.getElementById(`repasar-${modo.id}`).addEventListener("click", () => empezar(modo, { repaso: true }));
}

// En el menú, las teclas 1, 2 y 3 empiezan cada modo.
document.addEventListener("keydown", (evento) => {
  // Solo en el menú, sin el panel de ajustes abierto y sin teclas de control.
  if (document.body.dataset.pantalla !== "pantalla-menu" || document.querySelector("dialog[open]") || evento.ctrlKey || evento.metaKey || evento.altKey) {
    // Salimos.
    return;
  }
  // Modo cuya tecla se pulsó.
  const elegido = MODOS.find(({ tecla }) => tecla === evento.key);
  // Si hay uno y se puede jugar...
  if (elegido && elegido.modo.frases().length > 0) {
    // ...evitamos que la tecla haga otra cosa...
    evento.preventDefault();
    // ...y empezamos.
    empezar(elegido.modo);
  }
});

// Al cambiar de idioma, reescribimos los textos del menú.
alCambiarIdioma(actualizarMenu);
// Al borrar el progreso, el menú se queda a cero.
document.addEventListener("frase-exacta:progreso-borrado", actualizarMenu);

// Al abrir la página, mostramos el menú.
mostrarMenu();
