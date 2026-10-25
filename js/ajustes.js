// ajustes.js: los ajustes de la persona (idioma, tema, tamaño, dificultad, sonido, voz...).
// Los guarda en el navegador, los aplica a la página y maneja el panel de ajustes y los botones de la barra.
// Usa textos.js y memoria.js, que se cargan antes.

// Todo va dentro de una función que se ejecuta al momento, para no llenar el espacio global.
const Ajustes = (() => {
  // Clave con la que se guardan los ajustes en el navegador.
  const CLAVE = "frase-exacta:ajustes";
  // Valores posibles de los ajustes que se eligen de una lista.
  const OPCIONES = {
    idioma: IDIOMAS_INTERFAZ, // "es" o "en"
    tema: ["oscuro", "claro", "auto"], // tema de colores
    tamano: ["normal", "grande", "enorme"], // tamaño de la frase
    dificultad: ["normal", "dificil", "practica"], // vidas por partida
    teclado: ["auto", "es", "la", "us"], // tipo de teclado (automático, España, Latinoamérica, EE. UU.)
    lenguajeCodigo: ["todos", "python", "javascript", "web", "sql", "terminal"], // lenguaje de los modos de código
    seccion: ["idiomas", "matematicas", "codigo", "teclado"], // sección del menú que se ve
  };
  // Vidas de cada dificultad (Infinity: no se pierden nunca).
  const VIDAS = { normal: 5, dificil: 3, practica: Infinity };
  // Valores por defecto de todos los ajustes.
  const POR_DEFECTO = {
    idioma: idiomaDelNavegador(navigator.languages || [navigator.language]), // según el navegador
    tema: "oscuro", // el tema de siempre
    tamano: "normal", // tamaño normal
    dificultad: "normal", // 5 vidas
    pantallaCompleta: false, // no pasa a pantalla completa por su cuenta
    sonido: true, // efectos de sonido encendidos
    teclas: false, // sin sonido al teclear (puede cansar)
    voz: false, // no lee cada frase por su cuenta
    vozLenta: false, // voz a velocidad normal
    teclado: "auto", // tipo de teclado: se intenta adivinar
    tecladoEnPantalla: false, // el teclado en pantalla solo sale en las lecciones de teclado
    lenguajeCodigo: "todos", // todos los lenguajes de programación
    seccion: "idiomas", // el menú empieza en los idiomas
  };

  // Atajo para no escribir document.getElementById cada vez.
  const $ = (id) => document.getElementById(id);
  // Elementos de la página que usa este archivo.
  const el = {
    dialogo: $("ajustes"), // panel de ajustes
    formulario: $("ajustes-formulario"), // formulario del panel
    abrir: $("boton-ajustes"), // botón de la barra que abre el panel
    idioma: $("boton-idioma"), // botón de la barra que cambia el idioma
    tema: $("boton-tema"), // botón de la barra que cambia el tema
    borrar: $("ajustes-borrar"), // botón de borrar el progreso
    borrado: $("ajustes-borrado"), // aviso tras borrar
    sinVoz: $("ajustes-sin-voz"), // aviso si no hay voces
  };

  // Ajustes en uso.
  const valores = cargar();

  // Lee los ajustes guardados y descarta los que no son válidos.
  function cargar() {
    // Lo guardado (o un objeto vacío).
    const guardados = Memoria.leer(CLAVE, {}) || {};
    // Empezamos con los valores por defecto.
    const resultado = { ...POR_DEFECTO };
    // Recorremos cada ajuste.
    for (const [nombre, defecto] of Object.entries(POR_DEFECTO)) {
      // Valor guardado de este ajuste.
      const guardado = guardados[nombre];
      // Es válido si es un sí/no donde toca un sí/no, o una de las opciones de su lista.
      const valido = typeof defecto === "boolean" ? typeof guardado === "boolean" : (OPCIONES[nombre] || []).includes(guardado);
      // Si es válido, lo usamos.
      if (valido) {
        // Valor guardado.
        resultado[nombre] = guardado;
      }
    }
    // Devolvemos los ajustes.
    return resultado;
  }

  // Devuelve el valor de un ajuste.
  function valor(nombre) {
    // Lo leemos de los ajustes en uso.
    return valores[nombre];
  }

  // Cambia un ajuste, lo guarda y lo aplica.
  function cambiar(nombre, nuevo) {
    // Si el ajuste no existe, no hacemos nada.
    if (!(nombre in POR_DEFECTO)) {
      // Salimos.
      return;
    }
    // Guardamos el valor nuevo.
    valores[nombre] = nuevo;
    // Lo guardamos en el navegador.
    Memoria.guardar(CLAVE, valores);
    // Lo aplicamos a la página.
    aplicar(nombre);
    // Avisamos al resto del juego (el menú, el teclado en pantalla...).
    document.dispatchEvent(new CustomEvent("frase-exacta:ajuste", { detail: { nombre, valor: nuevo } }));
  }

  // Vidas por partida según la dificultad elegida.
  function vidas() {
    // Buscamos las vidas de la dificultad.
    return VIDAS[valores.dificultad];
  }

  // Tema que se ve de verdad: si es automático, el del sistema.
  function temaVisible() {
    // Si no es automático, es el elegido.
    if (valores.tema !== "auto") {
      // Devolvemos el tema elegido.
      return valores.tema;
    }
    // Si es automático, miramos si el sistema está en modo claro.
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "claro" : "oscuro";
  }

  // Aplica a la página un ajuste (o todos, si no se indica cuál).
  function aplicar(nombre) {
    // Raíz de la página.
    const raiz = document.documentElement;
    // Idioma de la interfaz.
    if (!nombre || nombre === "idioma") {
      // Cambiamos todos los textos.
      ponerIdiomaInterfaz(valores.idioma);
      // El botón de la barra muestra el idioma en uso.
      el.idioma.textContent = valores.idioma.toUpperCase();
    }
    // Tema.
    if (!nombre || nombre === "tema") {
      // El CSS cambia los colores según este atributo.
      raiz.dataset.tema = valores.tema;
      // Repintamos el botón del tema.
      pintarBotonTema();
    }
    // Tamaño de la frase.
    if (!nombre || nombre === "tamano") {
      // El CSS cambia el tamaño según este atributo.
      raiz.dataset.tamano = valores.tamano;
    }
  }

  // Pone el icono y la ayuda del botón de tema, y el color de la barra del navegador.
  function pintarBotonTema() {
    // Tema que se ve ahora.
    const visible = temaVisible();
    // Icono: un sol si está oscuro (pasar a claro), una luna si está claro.
    el.tema.querySelector("use").setAttribute("href", visible === "oscuro" ? "#i-sol" : "#i-luna");
    // Clave del texto de ayuda.
    const clave = visible === "oscuro" ? "barra.temaClaro" : "barra.temaOscuro";
    // Ayuda al pasar el ratón.
    el.tema.title = t(clave);
    // Texto para lectores de pantalla.
    el.tema.setAttribute("aria-label", t(clave));
    // Color de la barra del navegador en el móvil, igual que el fondo del tema.
    for (const meta of document.querySelectorAll('meta[name="theme-color"]')) {
      // Fondo oscuro o claro.
      meta.content = visible === "oscuro" ? "#101117" : "#f6f3ec";
    }
  }

  // Rellena el formulario del panel con los ajustes en uso.
  function rellenarFormulario() {
    // Recorremos los ajustes.
    for (const [nombre, actual] of Object.entries(valores)) {
      // Control del formulario con ese nombre.
      const control = el.formulario.elements[nombre];
      // Si no existe, seguimos.
      if (!control) {
        // Siguiente ajuste.
        continue;
      }
      // Casillas: marcada o no; listas: opción elegida.
      if (control.type === "checkbox") {
        // Marcamos la casilla.
        control.checked = actual;
        // Si es una lista...
      } else {
        // ...elegimos la opción.
        control.value = actual;
      }
    }
    // ¿Puede el navegador leer en voz alta? (voz.js se carga después, por eso lo miramos ahora).
    const hayVoz = typeof Voz !== "undefined" && Voz.disponible();
    // Si no, avisamos...
    el.sinVoz.hidden = hayVoz;
    // ...y desactivamos los ajustes de voz.
    for (const fila of el.formulario.querySelectorAll(".ajuste-voz input")) {
      // Desactivado si no hay voz.
      fila.disabled = !hayVoz;
    }
  }

  // Abre el panel de ajustes.
  function abrir() {
    // Rellenamos el formulario.
    rellenarFormulario();
    // Borramos el aviso de borrado de la vez anterior.
    el.borrado.textContent = "";
    // Si el navegador sabe abrir ventanas de diálogo...
    if (typeof el.dialogo.showModal === "function") {
      // ...lo abrimos encima de todo.
      el.dialogo.showModal();
      // Si no (navegadores muy antiguos)...
    } else {
      // ...lo mostramos sin más.
      el.dialogo.setAttribute("open", "");
    }
  }

  // --- Eventos ---

  // Botón de ajustes de la barra.
  el.abrir.addEventListener("click", abrir);
  // Cada cambio en el formulario se guarda al momento.
  el.formulario.addEventListener("change", (evento) => {
    // Control que cambió.
    const control = evento.target;
    // Guardamos su valor (casilla: marcada o no; lista: opción elegida).
    cambiar(control.name, control.type === "checkbox" ? control.checked : control.value);
  });
  // Al hacer clic fuera del panel (en el fondo oscurecido), se cierra.
  el.dialogo.addEventListener("click", (evento) => {
    // Si el clic fue en el propio diálogo (el fondo) y no en su contenido...
    if (evento.target === el.dialogo) {
      // ...lo cerramos.
      el.dialogo.close();
    }
  });
  // Al cerrar el panel avisamos al resto del juego (el motor devuelve el foco a la caja de texto).
  el.dialogo.addEventListener("close", () => document.dispatchEvent(new CustomEvent("frase-exacta:ajustes-cerrados")));
  // Botón de idioma de la barra: alterna entre español e inglés.
  el.idioma.addEventListener("click", () => cambiar("idioma", valores.idioma === "es" ? "en" : "es"));
  // Botón de tema de la barra: alterna entre claro y oscuro.
  el.tema.addEventListener("click", () => cambiar("tema", temaVisible() === "oscuro" ? "claro" : "oscuro"));
  // Si el tema es automático y el sistema cambia de modo, repintamos el botón.
  window.matchMedia("(prefers-color-scheme: light)").addEventListener?.("change", pintarBotonTema);
  // Al cambiar de idioma, el texto de ayuda del botón de tema también cambia.
  alCambiarIdioma(pintarBotonTema);
  // Botón de borrar el progreso.
  el.borrar.addEventListener("click", () => {
    // Pedimos confirmación: no se puede deshacer.
    if (!window.confirm(t("ajustes.borrarConfirmar"))) {
      // Si dice que no, salimos.
      return;
    }
    // Borramos todo lo del juego menos los ajustes.
    Memoria.borrarConPrefijo("frase-exacta:", [CLAVE]);
    // Avisamos al resto del juego para que olvide lo que tenía en memoria.
    document.dispatchEvent(new CustomEvent("frase-exacta:progreso-borrado"));
    // Confirmamos en el panel.
    el.borrado.textContent = t("ajustes.borrado");
  });

  // Al cargar la página aplicamos todos los ajustes.
  aplicar();

  // Lo que este archivo ofrece al resto del juego.
  return { valor, cambiar, vidas, abrir };
})();
