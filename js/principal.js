// principal.js: arranca el juego y maneja el menú principal.
// El menú está dividido en secciones (Idiomas, Matemáticas, Código, Datos, Teclado, Ratón y Redes); cada una tiene sus modos.
// Es el último archivo que se carga, así que todo lo demás ya está disponible.

// Idiomas que se pueden aprender en la sección Idiomas (el desplegable «Quiero aprender»).
const IDIOMAS_APRENDER = ["en", "es", "fr", "pt", "it", "de"];

// Las tres tarjetas de un idioma «de palabras» (francés, portugués, italiano y alemán).
function tarjetasDeOtroIdioma(idioma, insignia, color) {
  // Palabras, dictado y pronunciación.
  return [
    { modo: ModosVocabulario[idioma], insignia, color, archivo: "datos/vocabulario-idiomas.js", aprende: [idioma] }, // palabras
    { modo: ModosDictado[idioma], insignia: "♪", color: "cian", archivo: "datos/vocabulario-idiomas.js", aprende: [idioma] }, // dictado
    { modo: ModosPronunciacion[idioma], insignia: "/ə/", color: "violeta", archivo: "datos/vocabulario-idiomas.js", aprende: [idioma] }, // pronunciación
  ];
}

// Secciones del menú con sus modos.
// Cada modo: { modo, insignia (texto del cuadrado de color), color, archivo (de dónde salen sus frases),
//              aprende (en Idiomas: para qué idiomas que se aprenden sale la tarjeta),
//              nivel (en Redes: 1, 2 o 3, según el nivel elegido) }.
// Los botones de cada tarjeta y su línea de estado los crea pintarSeccion.
const SECCIONES = [
  // Idiomas: se elige qué idioma se quiere aprender y salen sus modos.
  {
    id: "idiomas", // nombre interno
    ajuste: "idiomaAprender", // desplegable «Quiero aprender» encima de las tarjetas
    modos: [
      // --- Para aprender inglés ---
      { modo: ModoIngles, insignia: "EN", color: "azul", archivo: "datos/frases-en.js", aprende: ["en"] }, // frases en inglés
      { modo: ModosVocabulario.ingles, insignia: "Aa", color: "azul", archivo: "datos/vocabulario.js", aprende: ["en"] }, // palabras en inglés
      { modo: ModosDictado.en, insignia: "♪", color: "cian", archivo: "datos/frases-en.js", aprende: ["en"] }, // dictado en inglés
      { modo: ModosPronunciacion.en, insignia: "/ə/", color: "violeta", archivo: "datos/vocabulario.js", aprende: ["en"] }, // pronunciación en inglés
      { modo: ModosNumeros.en, insignia: "47", color: "verde", archivo: "js/numerosEnPalabras.js", aprende: ["en"] }, // números con letras
      { modo: ModoVerbos, insignia: "go→", color: "ambar", archivo: "datos/verbos.js", aprende: ["en"] }, // verbos irregulares
      { modo: ModosFalsos.ingles, insignia: "≠", color: "coral", archivo: "datos/falsos-amigos.js", aprende: ["en"] }, // falsos amigos
      // --- Para aprender español ---
      { modo: ModoOrtografia, insignia: "Ñ", color: "ambar", archivo: "datos/frases-es.js", aprende: ["es"] }, // ortografía
      { modo: ModoEspanol, insignia: "ES", color: "coral", archivo: "datos/frases-en.js", aprende: ["es"] }, // frases en español
      { modo: ModosVocabulario.espanol, insignia: "Ññ", color: "coral", archivo: "datos/vocabulario.js", aprende: ["es"] }, // palabras en español
      { modo: ModosDictado.es, insignia: "♪", color: "cian", archivo: "datos/frases-es.js", aprende: ["es"] }, // dictado en español
      { modo: ModosPronunciacion.es, insignia: "/ə/", color: "violeta", archivo: "datos/vocabulario.js", aprende: ["es"] }, // pronunciación en español
      { modo: ModosNumeros.es, insignia: "47", color: "verde", archivo: "js/numerosEnPalabras.js", aprende: ["es"] }, // números con letras
      { modo: ModosFalsos.espanol, insignia: "≠", color: "azul", archivo: "datos/falsos-amigos.js", aprende: ["es"] }, // falsos amigos
      // --- Para los dos ---
      { modo: ModoAbecedario, insignia: "ABC", color: "verde", archivo: "datos/vocabulario.js", aprende: ["en", "es"], extra: { texto: "abc.verTabla", accion: () => TablaAbecedario.abrir() } }, // abecedario
      // --- Francés, portugués, italiano y alemán ---
      ...tarjetasDeOtroIdioma("fr", "Fr", "azul"), // francés
      ...tarjetasDeOtroIdioma("pt", "Pt", "verde"), // portugués
      ...tarjetasDeOtroIdioma("it", "It", "coral"), // italiano
      ...tarjetasDeOtroIdioma("de", "De", "ambar"), // alemán
    ],
  },
  // Matemáticas: primero los de dar el resultado y después los de elegir la fórmula.
  {
    id: "matematicas", // nombre interno
    modos: [
      { modo: ModosCalculo.sumas, insignia: "+−", color: "ambar", archivo: "js/aritmetica.js" }, // sumas y restas
      { modo: ModosCalculo.operaciones, insignia: "×÷", color: "ambar", archivo: "js/aritmetica.js" }, // multiplicar, dividir y potencias
      { modo: ModosCalculo.ecuaciones, insignia: "±√", color: "coral", archivo: "js/aritmetica.js" }, // fórmula general
      { modo: ModosCalculo.mezcla, insignia: "%", color: "verde", archivo: "js/aritmetica.js" }, // de todo un poco
      { modo: ModosMatematicas.algebra, insignia: "x²", color: "violeta", archivo: "datos/matematicas.js" }, // álgebra
      { modo: ModosMatematicas.trigonometria, insignia: "θ", color: "violeta", archivo: "datos/matematicas.js" }, // trigonometría
      { modo: ModosMatematicas.calculo, insignia: "∫", color: "violeta", archivo: "datos/matematicas.js" }, // cálculo
    ],
  },
  // Código: escribir, detectar errores, casos de uso y adivinar el lenguaje.
  {
    id: "codigo", // nombre interno
    ajuste: "lenguajeCodigo", // desplegable de lenguaje encima de las tarjetas
    modos: [
      { modo: ModosCodigo.escribir, insignia: "</>", color: "verde", archivo: "datos/codigo.js" }, // escribir código
      { modo: ModosCodigo.errores, insignia: "✓✗", color: "coral", archivo: "datos/codigo.js" }, // detectar el error
      { modo: ModosCodigo.usos, insignia: "$_", color: "azul", archivo: "datos/codigo.js" }, // casos de uso
      { modo: ModoLenguaje, insignia: "{?}", color: "violeta", archivo: "datos/lenguajes.js" }, // ¿qué lenguaje es?
    ],
  },
  // Datos: fórmulas de hoja de cálculo, pandas y NumPy.
  {
    id: "datos", // nombre interno
    ajuste: "herramientaDatos", // desplegable de herramienta encima de las tarjetas
    nota: "seccion.nota.datos", // aclaración bajo el desplegable
    modos: [
      { modo: ModosDatos.escribir, insignia: "fx", color: "verde", archivo: "datos/analisis.js" }, // escribir fórmulas
      { modo: ModosDatos.errores, insignia: "✓✗", color: "coral", archivo: "datos/analisis.js" }, // detectar el error
      { modo: ModosDatos.usos, insignia: "df", color: "azul", archivo: "datos/analisis.js" }, // casos de uso
    ],
  },
  // Teclado: dónde está cada tecla.
  {
    id: "teclado", // nombre interno
    ajuste: "teclado", // desplegable de tipo de teclado encima de las tarjetas
    buscador: true, // tarjeta del buscador «¿Dónde está?»
    // Una tarjeta por lección, con las teclas que enseña como insignia.
    modos: ModosTeclado.map((modo, posicion) => ({ modo, insignia: ["asdf", "qwer", "zxcv", "a–z", "Aa.", "123", "á ñ", "@#"][posicion], color: "cian", archivo: "datos/frases-es.js" })),
  },
  // Ratón: lecciones para aprender a usarlo.
  {
    id: "raton", // nombre interno
    nota: "seccion.nota.raton", // aclaración encima de las tarjetas
    // Una tarjeta por lección.
    modos: Raton.modos.map((modo, posicion) => ({ modo, insignia: ["↖", "1×", "2×", "◑", "⇢", "↕", "✱"][posicion], color: ["cian", "azul", "violeta", "coral", "verde", "ambar", "cian"][posicion] })),
  },
  // Redes: laboratorios como los de Packet Tracer (Cisco y Linux) y comandos sueltos.
  {
    id: "redes", // nombre interno
    ajuste: "nivelRedes", // desplegable de nivel encima de las tarjetas
    nota: "seccion.nota.redes", // aclaración bajo el desplegable
    modos: [
      // Un laboratorio por tarjeta (solo los del nivel elegido).
      ...Laboratorio.modos.map((modo) => ({ modo, insignia: modo.insignia, color: modo.color, nivel: modo.nivel })),
      // Comandos sueltos del nivel elegido.
      { modo: ModosRedes.escribir, insignia: ">_", color: "verde", archivo: "datos/redes.js" }, // escribir comandos
      { modo: ModosRedes.errores, insignia: "✓✗", color: "coral", archivo: "datos/redes.js" }, // detectar el error
      { modo: ModosRedes.usos, insignia: "?#", color: "azul", archivo: "datos/redes.js" }, // casos de uso
    ],
  },
];

// Opciones de los desplegables de las secciones: ajuste -> [valor, clave del texto].
const OPCIONES_DE_SECCION = {
  // Idioma que se quiere aprender.
  idiomaAprender: IDIOMAS_APRENDER.map((valor) => [valor, `idioma.${valor}`]),
  // Lenguajes de programación.
  lenguajeCodigo: ["todos", ...ModosCodigo.LENGUAJES].map((valor) => [valor, `lenguaje.${valor}`]),
  // Herramientas de análisis de datos.
  herramientaDatos: ["todos", ...ModosDatos.LENGUAJES].map((valor) => [valor, `lenguaje.${valor}`]),
  // Nivel de la sección Redes.
  nivelRedes: ["facil", "medio", "dificil"].map((valor) => [valor, `redes.nivel.${valor}`]),
  // Tipos de teclado.
  teclado: ["auto", "es", "la", "us"].map((valor) => [valor, valor === "auto" ? "teclado.auto" : `teclado.nombre.${valor}`]),
};

// Atajo para no escribir document.getElementById cada vez.
const $menu = (id) => document.getElementById(id);

// Sección que se está viendo.
function seccionActual() {
  // La guardada en los ajustes (o la primera si no existe).
  return SECCIONES.find((seccion) => seccion.id === Ajustes.valor("seccion")) || SECCIONES[0];
}

// Tarjetas que se ven en una sección (en Idiomas, solo las del idioma que se aprende; en Redes, las del nivel).
function modosVisibles(seccion) {
  // Idioma que se aprende.
  const aprende = Ajustes.valor("idiomaAprender");
  // Nivel de Redes (1, 2 o 3).
  const nivel = ["facil", "medio", "dificil"].indexOf(Ajustes.valor("nivelRedes")) + 1;
  // Las que no dicen idioma ni nivel, o las que coinciden.
  return seccion.modos.filter((tarjeta) => (!tarjeta.aprende || tarjeta.aprende.includes(aprende)) && (!tarjeta.nivel || tarjeta.nivel === nivel));
}

// ¿Se puede jugar un modo? Hace falta que tenga frases y, si lo pide, que el navegador sepa hacerlo (voz, micrófono).
function sePuedeJugar(modo) {
  // Las lecciones del ratón y los laboratorios siempre se pueden.
  if (modo.empezar) {
    // Sí.
    return true;
  }
  // Con frases y disponible.
  return modo.frases().length > 0 && (!modo.disponible || modo.disponible());
}

// Empieza una partida (y, si se pidió en los ajustes, pasa a pantalla completa).
//   opciones.repaso: true para jugar solo las frases falladas
function empezar(modo, opciones = {}) {
  // La pantalla completa solo se puede pedir justo tras un clic o una tecla, así que va primero.
  if (Ajustes.valor("pantallaCompleta")) {
    // Pasamos a pantalla completa.
    App.entrarPantallaCompleta();
  }
  // Las lecciones del ratón y los laboratorios tienen su propia pantalla.
  if (modo.empezar) {
    // Empezamos la lección.
    modo.empezar();
    // Terminamos aquí.
    return;
  }
  // Empezamos la partida.
  Motor.jugar(modo, opciones);
}

// Muestra el menú y actualiza los datos que aparecen en él.
function mostrarMenu() {
  // Mostramos la pantalla del menú.
  mostrarPantalla("pantalla-menu");
  // Actualizamos todo.
  actualizarMenu();
}

// Crea un elemento con una clase y, si se indica, un texto.
function crearElemento(etiqueta, clase, texto) {
  // Elemento nuevo.
  const elemento = document.createElement(etiqueta);
  // Clase para el estilo.
  if (clase) {
    // La ponemos.
    elemento.className = clase;
  }
  // Texto.
  if (texto !== undefined) {
    // Lo ponemos.
    elemento.textContent = texto;
  }
  // Devolvemos el elemento.
  return elemento;
}

// Crea un botón.
function crearBoton(clase, texto, alPulsar) {
  // Botón normal, no de formulario.
  const boton = crearElemento("button", clase, texto);
  // Tipo de botón.
  boton.type = "button";
  // Lo que hace al pulsarlo.
  boton.addEventListener("click", alPulsar);
  // Devolvemos el botón.
  return boton;
}

// Crea la tarjeta de un modo.
//   posicion: número de la tarjeta en la sección (para la tecla de atajo)
function crearTarjeta({ modo, insignia, color, archivo, extra }, posicion) {
  // Tarjeta.
  const tarjeta = crearElemento("article", "modo");
  // Modo y color, para el estilo.
  tarjeta.dataset.modo = modo.id;
  // Color de la tarjeta.
  tarjeta.dataset.color = color;
  // Cabecera: insignia, tema y tecla de atajo.
  const cabecera = crearElemento("div", "modo-cabecera");
  // Insignia (decorativa).
  const cuadro = crearElemento("span", "modo-insignia", insignia);
  // Los lectores de pantalla no la leen.
  cuadro.setAttribute("aria-hidden", "true");
  // Tema o dirección del modo (los laboratorios traen sus propios textos).
  const direccion = crearElemento("span", "modo-direccion", modo.direccion ? modo.direccion() : t(`modo.${modo.id}.direccion`));
  // Juntamos la cabecera.
  cabecera.append(cuadro, direccion);
  // Las nueve primeras tarjetas tienen tecla de atajo.
  if (posicion < 9) {
    // Tecla.
    const tecla = crearElemento("kbd", "modo-tecla", String(posicion + 1));
    // Los lectores de pantalla no la leen.
    tecla.setAttribute("aria-hidden", "true");
    // La añadimos.
    cabecera.append(tecla);
  }
  // Nombre del modo.
  const nombre = crearElemento("h2", "modo-nombre", modo.nombre ? modo.nombre() : t(`modo.${modo.id}.nombre`));
  // Qué se hace en él.
  const detalle = crearElemento("p", "modo-detalle", modo.detalle ? modo.detalle() : t(`modo.${modo.id}.detalle`));
  // Línea de estado: frases, sin ver, récord.
  const estado = crearElemento("p", "modo-estado");
  // Botones.
  const acciones = crearElemento("div", "modo-acciones");
  // Botón de jugar (en el ratón y los laboratorios, «Empezar»).
  const jugar = crearBoton("boton-principal", t(modo.empezar ? "menu.empezar" : "menu.jugar"), () => empezar(modo));
  // Lo añadimos.
  acciones.append(jugar);
  // Las lecciones del ratón y los laboratorios tienen su propia línea de estado.
  if (modo.empezar) {
    // Estado.
    estado.textContent = modo.estado();
    // Juntamos la tarjeta.
    tarjeta.append(cabecera, nombre, detalle, estado, acciones);
    // La devolvemos.
    return tarjeta;
  }
  // Total de frases del modo.
  const total = modo.frases().length;
  // Si no hay frases, o el navegador no sabe hacer lo que pide el modo (voz, micrófono), no puede funcionar.
  if (!sePuedeJugar(modo)) {
    // Motivo que da el modo: lección que no sirve para este teclado, o falta de voz o de micrófono.
    // (Si un modo de voz no tiene frases, el problema es el archivo, no la voz).
    const motivo = total > 0 || !modo.disponible ? modo.noDisponible : null;
    // Explicamos por qué (o que el archivo de frases no cargó).
    estado.textContent = motivo ? motivo() : t("menu.sinFrases", { archivo });
    // Desactivamos el botón.
    jugar.disabled = true;
    // Marcamos la tarjeta como apagada.
    tarjeta.classList.add("modo-pronto");
  } else {
    // Lo mejor del modo (velocidad).
    const mejores = Estadisticas.delModo(modo.id);
    // Frases, sin ver, récord y, si la hay, la mejor velocidad.
    estado.textContent =
      // Frases, sin ver y récord.
      t("menu.estado", { total, sinVer: Motor.frasesSinVer(modo), record: Motor.leerRecord(modo) }) +
      // Mejor velocidad.
      (mejores.ppm > 0 ? t("menu.estadoPpm", { ppm: mejores.ppm }) : "");
    // Frases falladas pendientes de repaso.
    const pendientes = Motor.frasesFallidas(modo).length;
    // Si hay alguna, botón de repasar.
    if (pendientes > 0) {
      // Botón.
      const repasar = crearBoton("boton-secundario", t("menu.repasar", { n: pendientes }), () => empezar(modo, { repaso: true }));
      // Ayuda.
      repasar.title = t("menu.repasarTitulo");
      // Lo añadimos.
      acciones.append(repasar);
    }
  }
  // Botón extra (por ejemplo, «Ver letras» en el abecedario).
  if (extra) {
    // Lo añadimos.
    acciones.append(crearBoton("boton-secundario", t(extra.texto), extra.accion));
  }
  // Juntamos la tarjeta.
  tarjeta.append(cabecera, nombre, detalle, estado, acciones);
  // Devolvemos la tarjeta.
  return tarjeta;
}

// Crea la tarjeta del buscador de teclas «¿Dónde está?».
function crearTarjetaBuscador() {
  // Tarjeta.
  const tarjeta = crearElemento("article", "modo modo-destacado");
  // Color.
  tarjeta.dataset.color = "ambar";
  // Cabecera con insignia.
  const cabecera = crearElemento("div", "modo-cabecera");
  // Insignia.
  const cuadro = crearElemento("span", "modo-insignia", "@?");
  // Decorativa.
  cuadro.setAttribute("aria-hidden", "true");
  // Juntamos la cabecera.
  cabecera.append(cuadro, crearElemento("span", "modo-direccion", TecladoVisual.nombreDisposicion()));
  // Nombre.
  const nombre = crearElemento("h2", "modo-nombre", t("buscador.titulo"));
  // Explicación.
  const detalle = crearElemento("p", "modo-detalle", t("buscador.detalle"));
  // Botones.
  const acciones = crearElemento("div", "modo-acciones");
  // Botón de abrir el buscador.
  acciones.append(crearBoton("boton-principal", t("buscador.abrir"), () => TecladoVisual.abrirBuscador()));
  // Juntamos la tarjeta.
  tarjeta.append(cabecera, nombre, detalle, acciones);
  // Devolvemos la tarjeta.
  return tarjeta;
}

// Pinta las pestañas de las secciones.
function pintarPestanas() {
  // Sección que se ve.
  const actual = seccionActual();
  // Botones de las pestañas.
  const pestanas = SECCIONES.map((seccion) => {
    // Botón.
    const boton = crearBoton("pestana", t(`seccion.${seccion.id}`), () => {
      // Cambiamos de sección.
      Ajustes.cambiar("seccion", seccion.id);
      // Repintamos el menú.
      actualizarMenu();
    });
    // Es una pestaña.
    boton.setAttribute("role", "tab");
    // ¿Está elegida?
    boton.setAttribute("aria-selected", String(seccion === actual));
    // Sección, para el estilo.
    boton.dataset.seccion = seccion.id;
    // Devolvemos el botón.
    return boton;
  });
  // Las ponemos en la página.
  $menu("menu-secciones").replaceChildren(...pestanas);
}

// Pinta las opciones de la sección (desplegable de lenguaje o de teclado) y sus tarjetas.
function pintarSeccion() {
  // Sección que se ve.
  const seccion = seccionActual();
  // Caja de opciones.
  const caja = $menu("menu-opciones");
  // Si la sección tiene un desplegable...
  if (seccion.ajuste) {
    // ...lo creamos con su etiqueta.
    const etiqueta = crearElemento("label", "seccion-ajuste");
    // Texto de la etiqueta.
    const texto = crearElemento("span", "", t(`seccion.ajuste.${seccion.ajuste}`));
    // Desplegable.
    const lista = document.createElement("select");
    // Una opción por valor.
    for (const [valor, clave] of OPCIONES_DE_SECCION[seccion.ajuste]) {
      // Opción.
      const opcion = crearElemento("option", "", t(clave));
      // Su valor.
      opcion.value = valor;
      // La añadimos.
      lista.append(opcion);
    }
    // Valor actual.
    lista.value = Ajustes.valor(seccion.ajuste);
    // Al cambiarlo, guardamos el ajuste y repintamos.
    lista.addEventListener("change", () => {
      // Guardamos.
      Ajustes.cambiar(seccion.ajuste, lista.value);
      // Repintamos las tarjetas.
      actualizarMenu();
    });
    // Juntamos.
    etiqueta.append(texto, lista);
    // Lo ponemos.
    caja.replaceChildren(etiqueta);
    // Si no...
  } else {
    // ...la caja queda vacía.
    caja.replaceChildren();
  }
  // Si la sección es la de teclado, explicamos qué tipo de teclado se usa.
  if (seccion.id === "teclado") {
    // Nota con el teclado que se usa.
    caja.append(crearElemento("p", "nota", t("teclado.usando", { teclado: TecladoVisual.nombreDisposicion() })));
  }
  // Si la sección tiene una nota, la ponemos.
  if (seccion.nota) {
    // Nota.
    caja.append(crearElemento("p", "nota", t(seccion.nota)));
  }
  // En Idiomas, si se aprende francés, portugués, italiano o alemán, explicamos qué hay.
  if (seccion.id === "idiomas" && !["en", "es"].includes(Ajustes.valor("idiomaAprender"))) {
    // Nota.
    caja.append(crearElemento("p", "nota", t("seccion.nota.idiomas")));
  }
  // Tarjetas: primero el buscador (si lo hay) y después los modos que se ven.
  const tarjetas = modosVisibles(seccion).map(crearTarjeta);
  // El buscador va delante.
  if (seccion.buscador) {
    // Lo añadimos al principio.
    tarjetas.unshift(crearTarjetaBuscador());
  }
  // Las ponemos en la página.
  $menu("menu-modos").replaceChildren(...tarjetas);
}

// Actualiza todo el menú: resumen del progreso, pestañas y tarjetas.
function actualizarMenu() {
  // Estadísticas generales.
  const generales = Estadisticas.generales();
  // El resumen solo se ve si ya se jugó alguna partida.
  $menu("menu-resumen").hidden = generales.partidas === 0;
  // Días seguidos practicando.
  $menu("resumen-dias").textContent = t("menu.diasSeguidos", { n: diasSeguidos(generales.dias) });
  // Frases escritas en total.
  $menu("resumen-frases").textContent = t("menu.frasesEscritas", { n: generales.frases });
  // Tiempo practicando.
  $menu("resumen-tiempo").textContent = t("menu.tiempo", { t: formatearDuracion(generales.segundos) });
  // Pestañas.
  pintarPestanas();
  // Tarjetas de la sección.
  pintarSeccion();
}

// En el menú, las teclas 1 a 9 empiezan los modos de la sección que se ve.
document.addEventListener("keydown", (evento) => {
  // Solo en el menú, sin ventanas abiertas, sin teclas de control y sin escribir en un desplegable.
  if (document.body.dataset.pantalla !== "pantalla-menu" || document.querySelector("dialog[open]") || evento.ctrlKey || evento.metaKey || evento.altKey || evento.target.tagName === "SELECT") {
    // Salimos.
    return;
  }
  // Posición del modo según la tecla (1 -> 0).
  const posicion = Number(evento.key) - 1;
  // Modo de esa posición entre las tarjetas que se ven.
  const elegido = Number.isInteger(posicion) && posicion >= 0 ? modosVisibles(seccionActual())[posicion] : null;
  // Si existe y se puede jugar...
  if (elegido && sePuedeJugar(elegido.modo)) {
    // ...evitamos que la tecla haga otra cosa...
    evento.preventDefault();
    // ...y empezamos.
    empezar(elegido.modo);
  }
});

// Al cambiar de idioma, reescribimos el menú.
alCambiarIdioma(() => {
  // Si ahora se aprende el mismo idioma de la interfaz (inglés con la interfaz en inglés), cambiamos al otro.
  if (Ajustes.valor("idiomaAprender") === idiomaActual()) {
    // Inglés <-> español.
    Ajustes.cambiar("idiomaAprender", idiomaActual() === "en" ? "es" : "en");
  }
  // Repintamos.
  actualizarMenu();
});
// Al borrar el progreso, el menú se queda a cero.
document.addEventListener("frase-exacta:progreso-borrado", actualizarMenu);
// Si cambia el tipo de teclado (por ejemplo, al detectarlo), repintamos el menú si está a la vista.
TecladoVisual.alCambiar(() => {
  // Solo si se ve el menú.
  if (document.body.dataset.pantalla === "pantalla-menu") {
    // Repintamos.
    actualizarMenu();
  }
});

// Al abrir la página, mostramos el menú.
mostrarMenu();
