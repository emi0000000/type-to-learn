// pantallas.js: muestra una pantalla del juego y oculta las demás.

// Muestra la pantalla cuyo id se indica y oculta el resto.
function mostrarPantalla(id) {
  // Recorremos todas las secciones marcadas con la clase "pantalla".
  for (const pantalla of document.querySelectorAll(".pantalla")) {
    // Solo queda visible la que tiene el id pedido.
    pantalla.hidden = pantalla.id !== id;
  }
  // Anotamos en el body qué pantalla se ve, para que el CSS ajuste la barra y los créditos.
  document.body.dataset.pantalla = id;
  // Volvemos arriba del todo, por si la pantalla anterior estaba desplazada.
  window.scrollTo(0, 0);
}
