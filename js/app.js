// app.js: hace que el juego funcione también como aplicación.
// - Pantalla completa: botón en la barra (y ajuste para entrar al empezar a jugar).
// - Instalar: en los navegadores que lo permiten aparece «Instalar app»; la app se abre en su propia
//   ventana o a pantalla completa, con su icono, como cualquier otra aplicación.
// - Sin conexión: registra sw.js, que guarda una copia del juego para poder jugar sin internet.
// Cuando el juego está a pantalla completa o instalado, la página lleva la clase "inmersivo" (el CSS la usa).

// Todo va dentro de una función que se ejecuta al momento, para no llenar el espacio global.
const App = (() => {
  // Atajo para no escribir document.getElementById cada vez.
  const $ = (id) => document.getElementById(id);
  // Elementos de la página que usa este archivo.
  const el = {
    instalar: $("boton-instalar"), // botón de instalar de la barra
    instalarAjustes: $("ajustes-instalar"), // botón de instalar del panel de ajustes
    pantalla: $("boton-pantalla"), // botón de pantalla completa de la barra
    pantallaAjustes: $("ajustes-pantalla"), // botón de pantalla completa del panel de ajustes
    nota: $("ajustes-app-nota"), // explicación en el panel de ajustes
  };
  // Consulta que dice si el juego se abrió como aplicación instalada.
  const comoApp = window.matchMedia("(display-mode: standalone), (display-mode: fullscreen), (display-mode: minimal-ui)");
  // Aviso de instalación que da el navegador (lo guardamos para usarlo al pulsar el botón).
  let avisoInstalacion = null;

  // ¿Está abierto como aplicación instalada?
  function esApp() {
    // En Safari de iPhone se mira con navigator.standalone.
    return comoApp.matches || navigator.standalone === true;
  }

  // ¿Está ahora a pantalla completa?
  function enPantallaCompleta() {
    // Con o sin prefijo (Safari antiguo).
    return Boolean(document.fullscreenElement || document.webkitFullscreenElement);
  }

  // ¿Permite el navegador poner la página a pantalla completa? (En iPhone no).
  function puedePantallaCompleta() {
    // Con o sin prefijo.
    return Boolean(document.fullscreenEnabled || document.webkitFullscreenEnabled);
  }

  // Pone el juego a pantalla completa (solo funciona como respuesta a un clic o una tecla).
  function entrarPantallaCompleta() {
    // Raíz de la página: es lo que se amplía.
    const raiz = document.documentElement;
    // Función de pantalla completa, con o sin prefijo.
    const pedir = raiz.requestFullscreen || raiz.webkitRequestFullscreen;
    // Si no hay, o ya estamos a pantalla completa, no hacemos nada.
    if (!pedir || enPantallaCompleta()) {
      // Salimos.
      return;
    }
    // Lo intentamos (en el móvil, ocultando también la barra del navegador).
    try {
      // Pedimos la pantalla completa.
      const promesa = pedir.call(raiz, { navigationUI: "hide" });
      // Si el navegador dice que no, lo ignoramos.
      if (promesa && promesa.catch) {
        // Sin errores en la consola.
        promesa.catch(() => {});
      }
      // Si falla...
    } catch (error) {
      // ...seguimos en la ventana normal.
    }
  }

  // Sale de la pantalla completa.
  function salirPantallaCompleta() {
    // Función de salir, con o sin prefijo.
    const salir = document.exitFullscreen || document.webkitExitFullscreen;
    // Si estamos a pantalla completa y se puede salir...
    if (salir && enPantallaCompleta()) {
      // ...salimos (ignorando errores).
      Promise.resolve(salir.call(document)).catch(() => {});
    }
  }

  // Entra o sale de la pantalla completa.
  function alternarPantallaCompleta() {
    // Si estamos dentro, salimos; si no, entramos.
    if (enPantallaCompleta()) {
      // Salimos.
      salirPantallaCompleta();
      // Si no...
    } else {
      // ...entramos.
      entrarPantallaCompleta();
    }
  }

  // Muestra u oculta los botones de instalar.
  function mostrarInstalar(visible) {
    // Botón de la barra.
    el.instalar.hidden = !visible;
    // Botón del panel de ajustes.
    el.instalarAjustes.hidden = !visible;
  }

  // ¿Es un iPhone o un iPad? (Allí se instala desde el botón Compartir de Safari).
  function esIOS() {
    // iPhone e iPod, o un iPad que se presenta como Mac con pantalla táctil.
    return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  }

  // Actualiza la clase "inmersivo", los botones de pantalla completa y la explicación del panel.
  function actualizar() {
    // ¿Pantalla completa ahora?
    const completa = enPantallaCompleta();
    // Modo inmersivo: a pantalla completa o como aplicación.
    document.documentElement.classList.toggle("inmersivo", completa || esApp());
    // Clave del texto del botón de la barra.
    const clave = completa ? "barra.salirPantalla" : "barra.pantalla";
    // Icono del botón: ampliar o reducir.
    el.pantalla.querySelector("use").setAttribute("href", completa ? "#i-reducir" : "#i-ampliar");
    // Guardamos la clave para que se traduzca al cambiar de idioma...
    el.pantalla.dataset.tTitle = clave;
    // ...también para lectores de pantalla...
    el.pantalla.dataset.tAriaLabel = clave;
    // ...y la aplicamos ya.
    el.pantalla.title = t(clave);
    // Texto para lectores de pantalla.
    el.pantalla.setAttribute("aria-label", t(clave));
    // Texto del botón del panel.
    el.pantallaAjustes.textContent = t(clave);
    // Sin pantalla completa en este navegador, ocultamos los botones.
    el.pantalla.hidden = !puedePantallaCompleta();
    // Lo mismo en el panel.
    el.pantallaAjustes.hidden = !puedePantallaCompleta();
    // Explicación del panel según el caso.
    el.nota.textContent = t(
      // Ya instalada.
      esApp() ? "app.instalada"
        // Se puede instalar ahora.
        : avisoInstalacion ? "app.disponible"
        // Abierto como archivo (doble clic en index.html).
        : location.protocol === "file:" ? "app.archivo"
        // iPhone o iPad.
        : esIOS() ? "app.ios"
        // Cualquier otro navegador.
        : "app.otro",
    );
  }

  // Abre el aviso de instalación del navegador.
  async function instalar() {
    // Si el navegador no nos dio el aviso, no se puede.
    if (!avisoInstalacion) {
      // Salimos.
      return;
    }
    // Mostramos el aviso.
    avisoInstalacion.prompt();
    // Esperamos la respuesta (instalar o no).
    try {
      // Respuesta de la persona.
      await avisoInstalacion.userChoice;
      // Si falla...
    } catch (error) {
      // ...no pasa nada.
    }
    // El aviso solo se puede usar una vez.
    avisoInstalacion = null;
    // Ocultamos los botones.
    mostrarInstalar(false);
    // Actualizamos la explicación.
    actualizar();
  }

  // --- Eventos ---

  // El navegador avisa de que el juego se puede instalar.
  window.addEventListener("beforeinstallprompt", (evento) => {
    // Evitamos su aviso automático: usaremos nuestro botón.
    evento.preventDefault();
    // Guardamos el aviso.
    avisoInstalacion = evento;
    // Mostramos los botones de instalar.
    mostrarInstalar(true);
    // Actualizamos la explicación.
    actualizar();
  });
  // Cuando el juego ya se instaló...
  window.addEventListener("appinstalled", () => {
    // ...el aviso ya no sirve...
    avisoInstalacion = null;
    // ...ocultamos los botones...
    mostrarInstalar(false);
    // ...y actualizamos la explicación.
    actualizar();
  });
  // Botón de instalar de la barra.
  el.instalar.addEventListener("click", instalar);
  // Botón de instalar del panel.
  el.instalarAjustes.addEventListener("click", instalar);
  // Botón de pantalla completa de la barra.
  el.pantalla.addEventListener("click", alternarPantallaCompleta);
  // Botón de pantalla completa del panel.
  el.pantallaAjustes.addEventListener("click", alternarPantallaCompleta);
  // Al entrar o salir de pantalla completa (también con F11 o Esc), actualizamos.
  document.addEventListener("fullscreenchange", actualizar);
  // Lo mismo en Safari antiguo.
  document.addEventListener("webkitfullscreenchange", actualizar);
  // Si cambia el modo de ventana de la app, actualizamos.
  comoApp.addEventListener?.("change", actualizar);
  // Al cambiar de idioma, actualizamos los textos de este archivo.
  alCambiarIdioma(actualizar);

  // Registramos sw.js para jugar sin conexión (solo funciona desde internet o un servidor local, no como archivo).
  if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
    // Cuando la página termine de cargar, para no retrasarla...
    window.addEventListener("load", () => {
      // ...lo registramos (si falla, el juego funciona igual, solo que necesita conexión).
      navigator.serviceWorker.register("sw.js").catch(() => {});
    });
  }

  // Estado inicial.
  actualizar();

  // Lo que este archivo ofrece al resto del juego.
  return { entrarPantallaCompleta, enPantallaCompleta };
})();
