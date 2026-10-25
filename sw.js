// sw.js: "service worker" del juego. El navegador lo ejecuta aparte de la página.
// Guarda una copia de todos los archivos del juego para que se pueda jugar sin conexión
// y para que la aplicación instalada abra al momento.
// Estrategia: primero la red (así siempre se juega la última versión) y, si no hay conexión, la copia guardada.
// Solo funciona cuando el juego se abre desde internet o desde un servidor local, no como archivo.

// Nombre de la copia guardada. Cambia el número al cambiar la lista de archivos, para empezar una copia nueva.
const VERSION = "frase-exacta-v2";

// Archivos que forman el juego (tests/app.test.js comprueba que la lista está completa).
const ARCHIVOS = [
  "./", // la página principal
  "index.html", // la página principal por su nombre
  "manifest.webmanifest", // ficha de la aplicación
  "css/estilos.css", // estilos
  "datos/frases-es.js", // frases en español
  "datos/frases-en.js", // parejas inglés-español
  "js/textos.js", // textos en español e inglés
  "js/memoria.js", // guardar datos
  "js/comparar.js", // comparar lo escrito
  "js/seleccion.js", // elegir frases
  "js/significado.js", // pregunta de significado
  "js/estadisticas.js", // estadísticas
  "js/pantallas.js", // cambiar de pantalla
  "js/ajustes.js", // ajustes
  "js/sonidos.js", // efectos de sonido
  "js/voz.js", // leer en voz alta
  "js/app.js", // aplicación y pantalla completa
  "js/motor.js", // motor de las partidas
  "js/modos/ortografia.js", // modo ortografía
  "js/modos/traduccion.js", // parte común de inglés y español
  "js/modos/ingles.js", // modo inglés
  "js/modos/espanol.js", // modo español
  "js/principal.js", // arranque y menú
  "iconos/icono.svg", // icono
  "iconos/icono-192.png", // icono pequeño
  "iconos/icono-512.png", // icono grande
  "iconos/icono-maskable-512.png", // icono para Android
  "iconos/apple-touch-icon.png", // icono para iPhone y iPad
];

// Al instalarse: guardamos todos los archivos.
self.addEventListener("install", (evento) => {
  // El navegador espera a que termine de guardar.
  evento.waitUntil(
    // Abrimos (o creamos) la copia de esta versión...
    caches
      .open(VERSION)
      // ...y descargamos todos los archivos en ella.
      .then((copia) => copia.addAll(ARCHIVOS))
      // En cuanto termine, esta versión pasa a mandar sin esperar a cerrar las pestañas.
      .then(() => self.skipWaiting()),
  );
});

// Al activarse: borramos las copias de versiones anteriores.
self.addEventListener("activate", (evento) => {
  // El navegador espera a que termine de borrar.
  evento.waitUntil(
    // Pedimos los nombres de todas las copias...
    caches
      .keys()
      // ...y borramos las que no son de esta versión.
      .then((nombres) => Promise.all(nombres.filter((nombre) => nombre !== VERSION).map((nombre) => caches.delete(nombre))))
      // Esta versión empieza a atender ya las pestañas abiertas.
      .then(() => self.clients.claim()),
  );
});

// Cada vez que la página pide un archivo.
self.addEventListener("fetch", (evento) => {
  // Petición.
  const peticion = evento.request;
  // Solo nos ocupamos de las lecturas (GET) de nuestro propio sitio; el resto sigue su camino normal.
  if (peticion.method !== "GET" || new URL(peticion.url).origin !== self.location.origin) {
    // No hacemos nada.
    return;
  }
  // Respondemos nosotros.
  evento.respondWith(
    // Primero intentamos la red.
    fetch(peticion)
      .then((respuesta) => {
        // Si la respuesta es buena, actualizamos la copia guardada.
        if (respuesta.ok) {
          // Copia de la respuesta (una respuesta solo se puede leer una vez).
          const copiaRespuesta = respuesta.clone();
          // La guardamos sin hacer esperar a la página.
          caches.open(VERSION).then((copia) => copia.put(peticion, copiaRespuesta));
        }
        // Devolvemos la respuesta de la red.
        return respuesta;
      })
      // Si no hay red, buscamos en la copia guardada.
      .catch(() =>
        // Buscamos el archivo (sin tener en cuenta lo que va tras "?").
        caches.match(peticion, { ignoreSearch: true }).then(
          // Si no está y era una página, devolvemos la página principal.
          (guardada) => guardada || (peticion.mode === "navigate" ? caches.match("index.html") : Response.error()),
        ),
      ),
  );
});
