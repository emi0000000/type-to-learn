// laboratorio.js: la pantalla de los laboratorios de la sección Redes (como las prácticas de Packet Tracer).
// A la izquierda, la tarea y una consola que imita la de cada equipo (Cisco, Linux o el PC);
// a la derecha, el objetivo, el esquema de la red, la tabla de direcciones y la «plantilla» con todos los pasos,
// que se va llenando con lo que escribes. Hay tres formas de hacerlo:
//   guiado:    se ve el comando entero y lo copias
//   plantilla: se ve el comando con huecos (las palabras clave tapadas)
//   examen:    solo se ve la tarea; con los fallos aparecen pistas
// Entre los comandos hay preguntas (cuestionario) de tres opciones.
// Al terminar se ve el resultado y la configuración de cada equipo, para copiarla y pegarla en Packet Tracer.
// Usa consola.js (la lógica, en el objeto Consola), datos/laboratorios.js, textos.js, memoria.js, ajustes.js, estadisticas.js,
// pantallas.js y sonidos.js, que se cargan antes.

// Todo va dentro de una función que se ejecuta al momento, para no llenar el espacio global.
const Laboratorio = (() => {
  // Formas de hacer un laboratorio, de más ayuda a menos.
  const AYUDAS = ["guiado", "plantilla", "examen"];
  // Líneas que se guardan como mucho en la consola de cada equipo.
  const MAXIMO_LINEAS = 500;
  // Espacio de nombres de los dibujos SVG.
  const SVG = "http://www.w3.org/2000/svg";

  // Atajo para no escribir document.getElementById cada vez.
  const $ = (id) => document.getElementById(id);
  // Elementos de la página.
  const el = {
    nivel: $("lab-nivel"), // nivel y tipo
    titulo: $("lab-titulo"), // título del laboratorio
    ayudas: $("lab-ayudas"), // botones guiado / plantilla / examen
    paso: $("lab-paso"), // paso actual de cuántos
    errores: $("lab-errores"), // errores
    tiempo: $("lab-tiempo"), // tiempo
    cuerpo: $("lab-cuerpo"), // la parte de trabajo (se oculta al terminar)
    parte: $("lab-parte"), // parte del laboratorio
    tarea: $("lab-tarea-texto"), // lo que hay que hacer
    guia: $("lab-guia"), // el comando, la plantilla o la pista
    mensaje: $("lab-mensaje"), // aciertos, errores y explicaciones
    pregunta: $("lab-pregunta"), // bloque de pregunta
    opciones: $("lab-opciones"), // opciones de la pregunta
    continuar: $("lab-continuar"), // botón de seguir tras una pregunta
    equipos: $("lab-equipos"), // pestañas de los equipos
    consola: $("lab-consola"), // la consola entera
    salida: $("lab-salida"), // las líneas de la consola
    linea: $("lab-linea"), // la línea donde se escribe
    prompt: $("lab-prompt"), // el prompt (S1#...)
    entrada: $("lab-entrada"), // la caja donde se escribe
    otroEquipo: $("lab-otro-equipo"), // aviso al mirar otro equipo
    objetivo: $("lab-objetivo"), // texto del objetivo
    esquema: $("lab-esquema"), // dibujo de la red
    direcciones: $("lab-direcciones"), // tabla de direcciones
    direccionesCaja: $("lab-direcciones-caja"), // su desplegable (se oculta si no hay)
    pasos: $("lab-pasos"), // la plantilla de pasos
    fin: $("lab-fin"), // resultado
    finTitulo: $("lab-fin-titulo"), // título del resultado
    finTexto: $("lab-fin-texto"), // resumen
    finConfig: $("lab-fin-config"), // configuración de cada equipo
    repetir: $("lab-repetir"), // botón repetir
    siguiente: $("lab-siguiente"), // botón siguiente laboratorio
    volver: $("lab-volver"), // botón volver al menú
    terminar: $("lab-terminar"), // botón terminar
    pie: $("lab-terminar").closest(".pie-juego"), // pie con el botón terminar
  };

  // Partida en curso (o la última), o null.
  let partida = null;

  // Lista de laboratorios; vacía si el archivo no se pudo cargar.
  function lista() {
    // LABORATORIOS la crea datos/laboratorios.js.
    return typeof LABORATORIOS === "undefined" ? [] : LABORATORIOS;
  }

  // Texto en el idioma de la interfaz si viene en pareja [español, inglés]; si es un texto, tal cual.
  function bil(valor) {
    // Pareja o texto.
    return Array.isArray(valor) ? (idiomaActual() === "en" ? valor[1] : valor[0]) : valor;
  }

  // Crea un elemento con clase y texto.
  function crear(etiqueta, clase, texto) {
    // Elemento nuevo.
    const elemento = document.createElement(etiqueta);
    // Clase.
    if (clase) {
      // La ponemos.
      elemento.className = clase;
    }
    // Texto.
    if (texto !== undefined) {
      // Lo ponemos.
      elemento.textContent = texto;
    }
    // Lo devolvemos.
    return elemento;
  }

  // Pasos del laboratorio listos para usar: cada comando con su equipo (el del anterior si no lo dice).
  function prepararPasos(lab) {
    // Equipo del paso anterior.
    let equipo = Object.keys(lab.equipos)[0];
    // Copia de cada paso.
    return lab.pasos.map((paso) => {
      // Si el paso dice el equipo, cambia.
      if (paso.e) {
        // Nuevo equipo.
        equipo = paso.e;
      }
      // Los comandos llevan su equipo; títulos y preguntas, tal cual.
      return paso.c !== undefined ? { ...paso, e: equipo } : { ...paso };
    });
  }

  // Tipo de consola de un equipo ("cisco", "linux" o "pc").
  function tipoDe(equipo) {
    // Del laboratorio.
    return partida.lab.equipos[equipo].tipo;
  }

  // Paso actual.
  function pasoActual() {
    // El de la posición actual.
    return partida.pasos[partida.indice];
  }

  // Lista de preguntas del equipo tras un comando (conf puede ser una o varias).
  function preguntasDe(paso) {
    // Sin preguntas, lista vacía.
    if (!paso.conf) {
      // Vacía.
      return [];
    }
    // Una o varias.
    return Array.isArray(paso.conf) ? paso.conf : [paso.conf];
  }

  // Prompt que se ve ahora en la consola del equipo del paso.
  function promptActual() {
    // Paso actual.
    const paso = pasoActual();
    // Si el equipo está preguntando algo, su pregunta.
    if (paso && partida.sub >= 0) {
      // La pregunta (con un espacio detrás).
      return `${preguntasDe(paso)[partida.sub].p} `;
    }
    // Si no, el prompt del estado del equipo.
    return Consola.prompt(partida.estados[paso ? paso.e : partida.viendo]);
  }

  // --- Consola ---

  // Añade líneas a la consola de un equipo.
  //   clase: "eco" (lo escrito), "sal" (respuesta), "err" (error del equipo) o "sis" (aviso de la consola)
  function escribir(equipo, lineas, clase = "sal") {
    // Consola del equipo.
    const salida = partida.salidas[equipo];
    // Añadimos cada línea.
    for (const texto of lineas) {
      // Línea.
      salida.push({ texto, clase });
    }
    // Si hay demasiadas, quitamos las más viejas.
    if (salida.length > MAXIMO_LINEAS) {
      // Quitamos el sobrante.
      salida.splice(0, salida.length - MAXIMO_LINEAS);
    }
    // Si se está viendo este equipo, las pintamos.
    if (partida.viendo === equipo) {
      // Fragmento para pintar de una vez.
      const fragmento = document.createDocumentFragment();
      // Cada línea.
      for (const texto of lineas) {
        // Línea nueva.
        fragmento.append(crear("div", `lab-l lab-${clase}`, texto || " "));
      }
      // A la consola.
      el.salida.append(fragmento);
      // Si sobran líneas en pantalla, quitamos las primeras.
      while (el.salida.childElementCount > MAXIMO_LINEAS) {
        // La primera.
        el.salida.firstElementChild.remove();
      }
      // Bajamos hasta el final.
      el.salida.scrollTop = el.salida.scrollHeight;
    }
  }

  // Pinta entera la consola del equipo que se está viendo.
  function pintarConsola() {
    // Fragmento.
    const fragmento = document.createDocumentFragment();
    // Cada línea guardada.
    for (const { texto, clase } of partida.salidas[partida.viendo]) {
      // Línea.
      fragmento.append(crear("div", `lab-l lab-${clase}`, texto || " "));
    }
    // Cambiamos el contenido.
    el.salida.replaceChildren(fragmento);
    // Bajamos hasta el final.
    el.salida.scrollTop = el.salida.scrollHeight;
  }

  // Mensaje de bienvenida de la consola de cada tipo de equipo (la primera vez que se usa).
  function bienvenida(equipo) {
    // Tipo.
    const tipo = tipoDe(equipo);
    // Cisco: como al conectar el cable de consola.
    if (tipo === "cisco") {
      // Mensaje del IOS.
      return ["", "Press RETURN to get started!", ""];
    }
    // Linux: como al entrar por SSH.
    if (tipo === "linux") {
      // Mensaje de Ubuntu.
      return ["Welcome to Ubuntu 24.04.1 LTS (GNU/Linux 6.8.0-45-generic x86_64)", "", "Last login: Sat Oct 24 09:58:12 2026 from 192.168.1.10"];
    }
    // PC de Packet Tracer.
    return ["", "Cisco Packet Tracer PC Command Line 1.0"];
  }

  // Pinta las pestañas de los equipos.
  function pintarEquipos() {
    // Equipo del paso actual.
    const paso = pasoActual();
    // Una pestaña por equipo.
    const pestanas = Object.keys(partida.lab.equipos).map((equipo) => {
      // Botón.
      const boton = crear("button", "lab-equipo", equipo);
      // Tipo de botón.
      boton.type = "button";
      // Tipo de equipo, para el icono.
      boton.dataset.tipo = tipoDe(equipo);
      // Es una pestaña.
      boton.setAttribute("role", "tab");
      // ¿Se está viendo?
      boton.setAttribute("aria-selected", String(equipo === partida.viendo));
      // ¿Es el de la tarea?
      boton.classList.toggle("lab-equipo-tarea", Boolean(paso && paso.e === equipo));
      // Al pulsar, se ve su consola.
      boton.addEventListener("click", () => ver(equipo));
      // Devolvemos.
      return boton;
    });
    // Las ponemos.
    el.equipos.replaceChildren(...pestanas);
  }

  // Muestra la consola de un equipo (para mirar la de otro sin perder el paso).
  function ver(equipo) {
    // Equipo que se ve.
    partida.viendo = equipo;
    // Pestañas.
    pintarEquipos();
    // Consola.
    pintarConsola();
    // Línea de escribir.
    pintarLinea();
  }

  // Pinta la línea de escribir: prompt, tipo de caja y si se puede escribir.
  function pintarLinea() {
    // Paso actual.
    const paso = pasoActual();
    // ¿Se puede escribir? (Hay un comando y se está viendo su equipo).
    const escribible = Boolean(paso && paso.c !== undefined && !partida.terminada && partida.viendo === paso.e);
    // La línea solo se ve si se puede escribir.
    el.linea.hidden = !escribible;
    // Aviso si se mira otro equipo.
    el.otroEquipo.hidden = !(paso && paso.c !== undefined && partida.viendo !== paso.e && !partida.terminada);
    // Texto del aviso.
    if (!el.otroEquipo.hidden) {
      // "Estás viendo R1; la tarea es en S1".
      el.otroEquipo.textContent = t("lab.verEquipo", { equipo: partida.viendo, actual: paso.e });
    }
    // Si no se puede escribir, ya está.
    if (!escribible) {
      // Salimos.
      return;
    }
    // Prompt.
    el.prompt.textContent = promptActual();
    // ¿Es una contraseña?
    const oculto = partida.sub >= 0 && Boolean(preguntasDe(paso)[partida.sub].oculto);
    // Caja de contraseña o de texto.
    el.entrada.type = oculto ? "password" : "text";
    // Idioma de lo que se escribe (comandos en inglés).
    el.entrada.lang = "en";
  }

  // --- Tarea, guía y mensajes ---

  // Muestra un mensaje bajo la tarea.
  //   tipo: "bien", "error", "aviso" o ""
  function mensaje(texto, tipo = "") {
    // Texto.
    el.mensaje.textContent = texto;
    // Estilo.
    el.mensaje.dataset.tipo = tipo;
  }

  // Pinta la guía del paso actual según la ayuda elegida y los fallos.
  function pintarGuia() {
    // Paso actual.
    const paso = pasoActual();
    // Sin comando (pregunta o fin), sin guía.
    if (!paso || paso.c === undefined) {
      // Vacía.
      el.guia.hidden = true;
      // Salimos.
      return;
    }
    // Lo que se muestra y su etiqueta.
    let texto = "";
    // Etiqueta.
    let etiqueta = "";
    // Si el equipo está preguntando algo...
    if (partida.sub >= 0) {
      // ...la respuesta esperada (en guiado, o tras fallar dos veces).
      const respuesta = preguntasDe(paso)[partida.sub].c;
      // Se ve en guiado o tras dos fallos.
      if (partida.ayuda === "guiado" || partida.fallos >= 2) {
        // Intro se muestra como ↵.
        texto = respuesta === "" ? "↵ Intro" : respuesta;
        // Etiqueta.
        etiqueta = t("lab.escribe");
      }
    } else if (partida.ayuda === "guiado" || partida.fallos >= 2) {
      // El comando entero.
      texto = paso.c;
      // Etiqueta: escribe o (tras fallar) la respuesta.
      etiqueta = partida.ayuda === "guiado" ? t("lab.escribe") : t("lab.respuesta");
    } else if (partida.ayuda === "plantilla" || partida.fallos >= 1) {
      // La plantilla con huecos.
      texto = Consola.plantilla(paso.c, tipoDe(paso.e));
      // Etiqueta.
      etiqueta = partida.ayuda === "plantilla" ? t("lab.completa") : t("lab.pista");
    }
    // Sin nada que mostrar, se oculta.
    el.guia.hidden = !texto;
    // Etiqueta y comando.
    el.guia.replaceChildren(crear("span", "lab-guia-etiqueta", etiqueta), crear("code", "lab-guia-comando", texto));
  }

  // Pinta la tarea del paso actual.
  function pintarTarea() {
    // Paso actual.
    const paso = pasoActual();
    // Parte actual.
    el.parte.textContent = partida.parte ? bil(partida.parte) : "";
    // Se oculta si no hay.
    el.parte.hidden = !partida.parte;
    // Sin paso (fin), nada.
    if (!paso) {
      // Salimos.
      return;
    }
    // Pregunta del cuestionario.
    if (paso.q) {
      // El texto va en la pregunta.
      el.tarea.textContent = "";
      // Salimos.
      return;
    }
    // Si el equipo pregunta algo, su tarea (o una genérica).
    if (partida.sub >= 0) {
      // Pregunta del equipo.
      const pregunta = preguntasDe(paso)[partida.sub];
      // Su tarea.
      el.tarea.textContent = pregunta.t ? bil(pregunta.t) : t("lab.responde");
    } else {
      // La tarea del paso, con el equipo delante.
      el.tarea.textContent = bil(paso.t);
    }
  }

  // --- Plantilla de pasos (panel lateral) ---

  // Crea el elemento de un paso en la plantilla.
  function elementoPaso(paso, indice) {
    // Título de una parte.
    if (paso.parte) {
      // Elemento de título.
      return crear("li", "lab-p-parte", bil(paso.parte));
    }
    // Elemento.
    const li = crear("li", "lab-p");
    // Posición.
    li.dataset.indice = String(indice);
    // Estado: hecho, actual o futuro.
    const estado = indice < partida.indice ? "hecho" : indice === partida.indice ? "actual" : "futuro";
    // Clase de estado.
    li.classList.add(`lab-p-${estado}`);
    // Pregunta.
    if (paso.q) {
      // Signo y texto.
      li.append(crear("span", "lab-p-marca", estado === "hecho" ? "✓" : "?"), crear("span", "lab-p-texto", bil(paso.q)));
      // Devolvemos.
      return li;
    }
    // Marca.
    li.append(crear("span", "lab-p-marca", estado === "hecho" ? "✓" : estado === "actual" ? "▶" : "·"));
    // Equipo, si cambia respecto al comando anterior.
    const anterior = partida.pasos.slice(0, indice).reverse().find((otro) => otro.c !== undefined);
    // Si es el primero o cambia, lo mostramos.
    if (!anterior || anterior.e !== paso.e) {
      // Etiqueta de equipo.
      li.append(crear("span", "lab-p-equipo", paso.e));
    }
    // Hecho: lo que se escribió.
    if (estado === "hecho") {
      // Lo escrito.
      li.append(crear("code", "lab-p-comando", partida.hechos[indice] ?? paso.c));
    } else if (partida.ayuda === "guiado") {
      // Guiado: el comando.
      li.append(crear("code", "lab-p-comando", paso.c));
    } else if (partida.ayuda === "plantilla") {
      // Plantilla: con huecos.
      li.append(crear("code", "lab-p-comando", Consola.plantilla(paso.c, tipoDe(paso.e))));
    } else {
      // Examen: solo la tarea.
      li.append(crear("span", "lab-p-texto", bil(paso.t)));
    }
    // Devolvemos.
    return li;
  }

  // Pinta toda la plantilla de pasos.
  function pintarPasos() {
    // Elementos de todos los pasos.
    el.pasos.replaceChildren(...partida.pasos.map(elementoPaso));
    // Centramos el actual.
    centrarPaso();
  }

  // Repinta un paso de la plantilla.
  function repintarPaso(indice) {
    // Elemento actual.
    const viejo = el.pasos.querySelector(`[data-indice="${indice}"]`);
    // Si existe, lo cambiamos.
    if (viejo) {
      // Por uno nuevo.
      viejo.replaceWith(elementoPaso(partida.pasos[indice], indice));
    }
  }

  // Desplaza la plantilla para que se vea el paso actual.
  function centrarPaso() {
    // Elemento actual.
    const actual = el.pasos.querySelector(".lab-p-actual");
    // Si existe, lo centramos dentro de la lista.
    if (actual) {
      // Centrado.
      el.pasos.scrollTop = actual.offsetTop - el.pasos.clientHeight / 2 + actual.offsetHeight / 2;
    }
  }

  // --- Esquema y tabla de direcciones ---

  // Escapa un texto para meterlo en el SVG.
  function escapar(texto) {
    // Cambiamos los caracteres especiales.
    return String(texto).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  }

  // Dibujo de cada tipo de equipo (centrado en 0,0).
  const ICONOS = {
    router: '<circle r="21" class="esq-cuerpo esq-router"/><path d="M-12 -5h20m-4 -4l4 4l-4 4M12 5h-20m4 -4l-4 4l4 4" class="esq-flecha"/>',
    switch: '<rect x="-25" y="-15" width="50" height="30" rx="6" class="esq-cuerpo esq-switch"/><path d="M-15 -5h26m-4 -4l4 4l-4 4M15 5h-26m4 -4l-4 4l4 4" class="esq-flecha"/>',
    mls: '<rect x="-25" y="-17" width="50" height="34" rx="6" class="esq-cuerpo esq-mls"/><path d="M-15 -5h26m-4 -4l4 4l-4 4M15 5h-26m4 -4l-4 4l4 4" class="esq-flecha"/>',
    pc: '<rect x="-18" y="-17" width="36" height="25" rx="3" class="esq-cuerpo esq-pc"/><rect x="-14" y="-13" width="28" height="17" class="esq-pantalla"/><path d="M-9 15h18M0 8v7" class="esq-linea"/>',
    servidor: '<rect x="-14" y="-21" width="28" height="42" rx="3" class="esq-cuerpo esq-servidor"/><path d="M-8 -12h16M-8 -6h16M-8 0h16" class="esq-linea"/><circle cy="12" r="2.5" class="esq-led"/>',
    nube: '<path d="M-24 11a10 10 0 0 1 1-20a14 14 0 0 1 26-5a11 11 0 0 1 18 9a8 8 0 0 1-2 16z" class="esq-cuerpo esq-nube"/>',
  };

  // Dibuja el esquema de la red como SVG.
  function dibujarEsquema(esquema) {
    // Separación entre columnas y filas.
    const [ANCHO, ALTO] = [150, 140];
    // Columnas y filas usadas.
    const columnas = Math.max(...esquema.equipos.map((equipo) => equipo[2])) + 1;
    // Filas.
    const filas = Math.max(...esquema.equipos.map((equipo) => equipo[3])) + 1;
    // Posición de cada equipo.
    const posicion = {};
    // Calculamos las posiciones.
    for (const [nombre, , columna, fila] of esquema.equipos) {
      // Centro del equipo.
      posicion[nombre] = { x: 75 + columna * ANCHO, y: 42 + fila * ALTO };
    }
    // Partes del dibujo.
    const partes = [];
    // Enlaces (debajo de los equipos).
    for (const [a, puertoA, b, puertoB, tipo] of esquema.enlaces) {
      // Extremos.
      const [p, q] = [posicion[a], posicion[b]];
      // Si falta alguno, se salta.
      if (!p || !q) {
        // Siguiente.
        continue;
      }
      // Línea del enlace.
      partes.push(`<line x1="${p.x}" y1="${p.y}" x2="${q.x}" y2="${q.y}" class="esq-enlace${tipo ? ` esq-${tipo}` : ""}"/>`);
      // Etiquetas de los puertos, cerca de cada extremo.
      for (const [desde, hacia, puerto] of [[p, q, puertoA], [q, p, puertoB]]) {
        // Sin puerto, nada.
        if (!puerto) {
          // Siguiente.
          continue;
        }
        // Largo del enlace.
        const largo = Math.hypot(hacia.x - desde.x, hacia.y - desde.y) || 1;
        // Dirección del enlace (de largo 1).
        const [dx, dy] = [(hacia.x - desde.x) / largo, (hacia.y - desde.y) / largo];
        // ¿El enlace baja desde este equipo? (Entonces la etiqueta va por debajo de su nombre y su nota).
        const baja = dy > 0.3;
        // ¿Es casi vertical? (Entonces la etiqueta va al lado de la línea, no encima).
        const vertical = Math.abs(dx) < 0.3;
        // ¿Es casi horizontal? (Entonces la etiqueta empieza al salir del icono, sin pisarlo).
        const horizontal = Math.abs(dy) < 0.3;
        // Distancia al centro del equipo: más lejos si baja, para no pisar el nombre.
        const distancia = horizontal ? 30 : Math.min(baja ? 68 : 36, largo * 0.45);
        // Coordenadas (al lado de la línea si es vertical).
        const x = desde.x + dx * distancia + (vertical ? 6 : 0);
        // Vertical.
        const y = desde.y + dy * distancia + (vertical ? 4 : -5);
        // Alineación del texto: desde la línea si es vertical; alejándose del icono si es horizontal.
        const ancla = vertical ? "start" : horizontal ? (dx > 0 ? "start" : "end") : "middle";
        // Etiqueta (con fondo para que se lea encima de la línea).
        partes.push(`<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" class="esq-puerto" text-anchor="${ancla}">${escapar(puerto)}</text>`);
      }
    }
    // Equipos.
    for (const [nombre, icono, , , nota] of esquema.equipos) {
      // Centro.
      const { x, y } = posicion[nombre];
      // Icono, nombre y nota.
      partes.push(`<g transform="translate(${x} ${y})">${ICONOS[icono] || ICONOS.pc}<text y="36" class="esq-nombre" text-anchor="middle">${escapar(nombre)}</text>${nota ? `<text y="50" class="esq-nota" text-anchor="middle">${escapar(nota)}</text>` : ""}</g>`);
    }
    // Lienzo.
    const svg = document.createElementNS(SVG, "svg");
    // Tamaño del dibujo.
    svg.setAttribute("viewBox", `0 0 ${columnas * ANCHO} ${filas * ALTO - 12}`);
    // Nunca más grande que su tamaño real (los esquemas pequeños no se agrandan).
    svg.style.maxWidth = `${columnas * ANCHO}px`;
    // Clase.
    svg.setAttribute("class", "esquema");
    // Accesible: es una imagen con su descripción (el objetivo ya la explica).
    svg.setAttribute("role", "img");
    // Descripción.
    svg.setAttribute("aria-label", t("lab.esquema"));
    // Contenido.
    svg.innerHTML = partes.join("");
    // Devolvemos.
    return svg;
  }

  // Pinta la tabla de direcciones.
  function pintarDirecciones(direcciones) {
    // Sin direcciones, se oculta.
    el.direccionesCaja.hidden = direcciones.length === 0;
    // Tabla.
    const tabla = crear("table", "lab-tabla");
    // Cabecera.
    const cabecera = crear("tr");
    // Columnas.
    for (const clave of ["lab.equipo", "lab.interfaz", "lab.ip", "lab.mascara", "lab.puerta"]) {
      // Celda.
      cabecera.append(crear("th", "", t(clave)));
    }
    // Cuerpo.
    const cuerpo = crear("tbody");
    // Filas.
    for (const fila of direcciones) {
      // Fila.
      const tr = crear("tr");
      // Celdas.
      fila.forEach((dato) => tr.append(crear("td", "", dato)));
      // A la tabla.
      cuerpo.append(tr);
    }
    // Juntamos.
    tabla.append(crear("thead"), cuerpo);
    // Cabecera en su sitio.
    tabla.tHead.append(cabecera);
    // A la página.
    el.direcciones.replaceChildren(tabla);
  }

  // --- Marcador ---

  // Pinta el marcador: paso, errores y tiempo.
  function pintarMarcador() {
    // Comandos y preguntas en total (sin títulos).
    const total = partida.pasos.filter((paso) => !paso.parte).length;
    // Hechos.
    const hechos = partida.pasos.slice(0, partida.indice).filter((paso) => !paso.parte).length;
    // Paso actual de cuántos.
    el.paso.textContent = `${Math.min(hechos + 1, total)}/${total}`;
    // Errores.
    el.errores.textContent = String(partida.errores);
    // Tiempo.
    el.tiempo.textContent = formatearReloj((Date.now() - partida.inicio) / 1000);
  }

  // Pinta los botones de ayuda.
  function pintarAyudas() {
    // Cada botón.
    for (const boton of el.ayudas.querySelectorAll("button")) {
      // Marcado si es la ayuda actual.
      boton.setAttribute("aria-checked", String(boton.dataset.ayuda === partida.ayuda));
    }
  }

  // Cambia la forma de hacer el laboratorio.
  function cambiarAyuda(ayuda) {
    // Guardamos el ajuste.
    Ajustes.cambiar("ayudaLab", ayuda);
    // Si no hay partida, ya está.
    if (!partida || partida.terminada) {
      // Salimos.
      return;
    }
    // Ayuda nueva.
    partida.ayuda = ayuda;
    // La que más ayudó durante la partida (para el récord).
    partida.ayudaMinima = AYUDAS[Math.min(AYUDAS.indexOf(partida.ayudaMinima), AYUDAS.indexOf(ayuda))];
    // Repintamos botones, guía y plantilla.
    pintarAyudas();
    // Guía.
    pintarGuia();
    // Plantilla.
    pintarPasos();
    // El foco vuelve a la consola.
    enfocar();
  }

  // Pone el foco en la caja de la consola (si se ve).
  function enfocar() {
    // Solo si se puede escribir.
    if (!el.linea.hidden) {
      // Foco.
      el.entrada.focus({ preventScroll: true });
    }
  }

  // --- Avanzar por los pasos ---

  // Muestra el paso actual (saltando los títulos de parte).
  function mostrarPaso() {
    // Saltamos los títulos, anotando la parte.
    while (partida.indice < partida.pasos.length && partida.pasos[partida.indice].parte) {
      // Parte actual.
      partida.parte = partida.pasos[partida.indice].parte;
      // Siguiente.
      partida.indice++;
    }
    // Si no quedan pasos, se terminó.
    if (partida.indice >= partida.pasos.length) {
      // Fin.
      terminar(true);
      // Salimos.
      return;
    }
    // Paso actual.
    const paso = pasoActual();
    // Sin fallos en este paso.
    partida.fallos = 0;
    // Sin pregunta del equipo.
    partida.sub = -1;
    // Pregunta del cuestionario.
    if (paso.q) {
      // La mostramos.
      mostrarPregunta(paso);
    } else {
      // Sin pregunta a la vista.
      el.pregunta.hidden = true;
      // Si el equipo se usa por primera vez, su bienvenida.
      if (!partida.usados.has(paso.e)) {
        // Anotado.
        partida.usados.add(paso.e);
        // Bienvenida.
        escribir(paso.e, bienvenida(paso.e), "sis");
      }
      // Se ve la consola del equipo de la tarea.
      if (partida.viendo !== paso.e) {
        // Cambiamos.
        ver(paso.e);
      } else {
        // Pestañas (para marcar el de la tarea) y línea.
        pintarEquipos();
        // Línea.
        pintarLinea();
      }
    }
    // Tarea, guía, marcador y plantilla.
    pintarTarea();
    // Guía.
    pintarGuia();
    // Marcador.
    pintarMarcador();
    // Plantilla.
    pintarPasos();
    // Foco.
    enfocar();
  }

  // Da por hecho el paso actual y pasa al siguiente.
  function completarPaso() {
    // Paso actual.
    const paso = pasoActual();
    // Mensaje: bien, con la explicación si la hay.
    mensaje(paso.x ? `${t("lab.bien")} ${bil(paso.x)}` : t("lab.bien"), "bien");
    // Siguiente paso.
    partida.indice++;
    // Lo mostramos.
    mostrarPaso();
  }

  // Comandos que no cambian la configuración (no se exportan).
  function esDeConsulta(comando) {
    // show, ping, traceroute, disable...
    return /^(do\s+)?(show|sh)\b|^(ping|traceroute|tracert|disable)\b/i.test(comando.trim());
  }

  // Anota un comando en la configuración final del equipo (para copiarla al terminar).
  function exportar(paso, comando) {
    // Tipo de equipo.
    const tipo = tipoDe(paso.e);
    // De los PC no se exporta nada.
    if (tipo === "pc") {
      // Salimos.
      return;
    }
    // Comando que se exporta.
    const texto = paso.exp || comando;
    // En Cisco, sin consultas ni enable repetidos.
    if (tipo === "cisco" && (esDeConsulta(texto) || (texto === "enable" && partida.exportado[paso.e].includes("enable")))) {
      // Salimos.
      return;
    }
    // Lo anotamos.
    partida.exportado[paso.e].push(texto);
  }

  // Procesa lo que se escribió en la consola al pulsar Intro.
  function procesar() {
    // Paso actual.
    const paso = pasoActual();
    // Solo si hay un comando pendiente en el equipo que se ve.
    if (!partida || partida.terminada || !paso || paso.c === undefined || partida.viendo !== paso.e) {
      // Salimos.
      return;
    }
    // Lo escrito.
    const escrito = el.entrada.value;
    // Vaciamos la caja.
    el.entrada.value = "";
    // Si el equipo está preguntando algo, es la respuesta.
    if (partida.sub >= 0) {
      // Respondemos.
      responderEquipo(paso, escrito);
      // Salimos.
      return;
    }
    // Prompt antes del comando.
    const antes = promptActual();
    // Copia de lo escrito en la consola.
    escribir(paso.e, [antes + escrito], "eco");
    // Sin nada escrito: nueva línea, sin error (como en un equipo de verdad).
    if (!escrito.trim()) {
      // Salimos.
      return;
    }
    // Historial del equipo.
    partida.historial[paso.e].push(escrito);
    // Posición en el historial.
    partida.posHistorial = partida.historial[paso.e].length;
    // Tipo de consola.
    const tipo = tipoDe(paso.e);
    // Comparamos con el comando y sus alternativas.
    const resultado = Consola.comparar(escrito, paso.c, paso.alt || [], tipo);
    // Si no coincide, fallo.
    if (!resultado.ok) {
      // Fallo.
      fallar(paso, escrito, resultado, antes);
      // Salimos.
      return;
    }
    // Sonido de tecla bien.
    Sonidos.reproducir("bien");
    // Anotamos lo escrito para la plantilla.
    partida.hechos[partida.indice] = escrito.trim();
    // Letras acertadas.
    partida.letras += escrito.trim().length;
    // Comandos acertados.
    partida.comandos++;
    // El equipo cambia de modo, de nombre o de carpeta.
    const { estado, mensajes } = Consola.avanzar(partida.estados[paso.e], paso.c);
    // Guardamos el estado.
    partida.estados[paso.e] = estado;
    // Lo anotamos para la configuración final.
    exportar(paso, resultado.comando);
    // Preguntas del equipo tras el comando.
    const preguntas = preguntasDe(paso);
    // Si se usó la forma completa y el equipo pregunta algo...
    if (preguntas.length > 0 && resultado.comando === paso.c) {
      // ...pasamos a la primera pregunta.
      partida.sub = 0;
      // Lo que escribe antes de preguntar.
      escribir(paso.e, preguntas[0].antes || [], "sal");
      // Línea, tarea y guía.
      pintarLinea();
      // Tarea.
      pintarTarea();
      // Guía.
      pintarGuia();
      // Salimos.
      return;
    }
    // Lo que responde el equipo: lo del paso, el ping automático o los mensajes del IOS.
    escribir(paso.e, salidaDe(paso, resultado.comando, mensajes, preguntas), "sal");
    // Paso hecho.
    completarPaso();
  }

  // Lo que responde el equipo a un comando acertado.
  function salidaDe(paso, comando, mensajes, preguntas) {
    // Si se usó una forma corta que no pregunta (write), la salida final de las preguntas.
    if (preguntas.length > 0) {
      // Salida de la última pregunta.
      return preguntas[preguntas.length - 1].s || [];
    }
    // La del paso, si la tiene.
    if (paso.s) {
      // Tal cual.
      return paso.s;
    }
    // Ping desde un PC: salida automática.
    const ping = comando.trim().match(/^ping\s+(\S+)$/i);
    // Si es un ping de un PC...
    if (ping && tipoDe(paso.e) === "pc") {
      // Salida de ping.
      return Consola.salidaPing(ping[1], paso.ttl ?? 128, paso.perdidos ?? 0);
    }
    // Si no, los mensajes del IOS.
    return mensajes;
  }

  // Responde a una pregunta del equipo (Password:, Destination filename...).
  function responderEquipo(paso, escrito) {
    // Pregunta.
    const pregunta = preguntasDe(paso)[partida.sub];
    // Copia en la consola: la pregunta y lo escrito (las contraseñas no se ven).
    escribir(paso.e, [`${pregunta.p} ${pregunta.oculto ? "" : escrito}`], "eco");
    // ¿Es correcta? (Las respuestas de sí o no dan igual en mayúscula).
    const correcta = /^[yn]$/i.test(pregunta.c) ? escrito.trim().toLowerCase() === pregunta.c.toLowerCase() : escrito.trim() === pregunta.c;
    // Si no...
    if (!correcta) {
      // Un error más.
      partida.errores++;
      // Un fallo más en este paso.
      partida.fallos++;
      // Sonido de error.
      Sonidos.reproducir("error");
      // Mensaje del equipo, si tiene.
      if (pregunta.error) {
        // Error del equipo.
        escribir(paso.e, [pregunta.error], "err");
      }
      // Explicación.
      mensaje(t("lab.error.respuesta"), "error");
      // Guía (tras dos fallos se ve la respuesta).
      pintarGuia();
      // Marcador.
      pintarMarcador();
      // Salimos.
      return;
    }
    // Salida tras la respuesta.
    escribir(paso.e, pregunta.s || [], "sal");
    // Siguiente pregunta del equipo.
    partida.sub++;
    // Sin fallos en la nueva.
    partida.fallos = 0;
    // Si quedan, la siguiente.
    if (partida.sub < preguntasDe(paso).length) {
      // Lo que escribe antes.
      escribir(paso.e, preguntasDe(paso)[partida.sub].antes || [], "sal");
      // Línea, tarea y guía.
      pintarLinea();
      // Tarea.
      pintarTarea();
      // Guía.
      pintarGuia();
      // Salimos.
      return;
    }
    // Sin más preguntas: paso hecho.
    partida.sub = -1;
    // Siguiente.
    completarPaso();
  }

  // Trata un comando equivocado: el error del equipo y la explicación.
  function fallar(paso, escrito, resultado, antes) {
    // Un error más.
    partida.errores++;
    // Un fallo más en este paso.
    partida.fallos++;
    // Sonido de error.
    Sonidos.reproducir("error");
    // Tipo de consola.
    const tipo = tipoDe(paso.e);
    // Lo que responde el equipo.
    const lineas = [];
    // Cisco: los mensajes de error del IOS.
    if (tipo === "cisco") {
      // Inválido: marca ^ bajo la palabra.
      if (resultado.error === "invalido") {
        // Marca y mensaje.
        lineas.push(`${" ".repeat(antes.length + resultado.posicion)}^`, "% Invalid input detected at '^' marker.", "");
      } else if (resultado.error === "incompleto") {
        // Incompleto.
        lineas.push("% Incomplete command.", "");
      } else if (resultado.error === "ambiguo") {
        // Ambiguo.
        lineas.push(`% Ambiguous command: "${escrito.trim()}"`, "");
      }
    } else if (resultado.error === "desconocido") {
      // Linux o PC: orden que no existe.
      lineas.push(tipo === "pc" ? "Invalid Command." : `${resultado.palabra}: command not found`);
    }
    // Lo escribimos.
    escribir(paso.e, lineas, "err");
    // Explicación del error (fuera de Cisco no hay marca ^).
    const explicacion = t(tipo !== "cisco" && resultado.error === "invalido" ? "lab.error.revisa" : `lab.error.${resultado.error}`, { palabra: resultado.palabra });
    // En guiado, además, qué hay que escribir.
    const ayuda = partida.ayuda === "guiado" ? ` ${t("lab.error.copia")}` : partida.fallos >= 2 ? ` ${t("lab.error.mira")}` : partida.fallos === 1 && partida.ayuda === "examen" ? ` ${t("lab.error.pista")}` : "";
    // Mensaje.
    mensaje(explicacion + ayuda, "error");
    // Guía (con pistas según los fallos).
    pintarGuia();
    // Marcador.
    pintarMarcador();
  }

  // --- Cuestionario ---

  // Mezcla una lista (copia).
  function mezclarLista(lista) {
    // Copia.
    const copia = [...lista];
    // Fisher-Yates.
    for (let i = copia.length - 1; i > 0; i--) {
      // Posición al azar.
      const j = Math.floor(Math.random() * (i + 1));
      // Intercambio.
      [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    // Devolvemos.
    return copia;
  }

  // Muestra una pregunta del cuestionario.
  function mostrarPregunta(paso) {
    // Sin consola para escribir.
    el.linea.hidden = true;
    // Ni aviso de otro equipo.
    el.otroEquipo.hidden = true;
    // Se ve la pregunta.
    el.pregunta.hidden = false;
    // Texto de la pregunta.
    el.pregunta.querySelector(".lab-pregunta-texto").textContent = bil(paso.q);
    // Aún sin responder.
    partida.respondida = false;
    // Sin botón de seguir.
    el.continuar.hidden = true;
    // Opciones mezcladas, recordando cuál es la correcta.
    const opciones = mezclarLista(paso.o.map((texto, posicion) => ({ texto: bil(texto), correcta: posicion === paso.ok })));
    // Botones.
    const botones = opciones.map((opcion, posicion) => {
      // Botón.
      const boton = crear("button", "lab-opcion");
      // Tipo de botón.
      boton.type = "button";
      // Número y texto.
      boton.append(crear("span", "lab-opcion-numero", String(posicion + 1)), crear("span", "", opcion.texto));
      // ¿Es la correcta?
      boton.dataset.correcta = String(opcion.correcta);
      // Al pulsar, se responde.
      boton.addEventListener("click", () => responderPregunta(boton));
      // Devolvemos.
      return boton;
    });
    // Los ponemos.
    el.opciones.replaceChildren(...botones);
    // Foco en la primera.
    botones[0].focus({ preventScroll: true });
  }

  // Responde una pregunta del cuestionario.
  function responderPregunta(boton) {
    // Solo una vez.
    if (partida.respondida) {
      // Salimos.
      return;
    }
    // Respondida.
    partida.respondida = true;
    // Paso actual.
    const paso = pasoActual();
    // ¿Acertó?
    const acierto = boton.dataset.correcta === "true";
    // Marcamos la elegida y la correcta.
    for (const opcion of el.opciones.querySelectorAll("button")) {
      // No se puede volver a pulsar.
      opcion.disabled = true;
      // La correcta en verde.
      opcion.classList.toggle("lab-opcion-bien", opcion.dataset.correcta === "true");
    }
    // La elegida, si está mal, en rojo.
    boton.classList.toggle("lab-opcion-mal", !acierto);
    // Si falló, un error.
    if (!acierto) {
      // Un error más.
      partida.errores++;
    }
    // Sonido.
    Sonidos.reproducir(acierto ? "bien" : "error");
    // Mensaje con la explicación.
    mensaje(`${t(acierto ? "lab.pregunta.bien" : "lab.pregunta.mal")}${paso.x ? ` ${bil(paso.x)}` : ""}`, acierto ? "bien" : "error");
    // Botón de seguir.
    el.continuar.hidden = false;
    // Foco en él.
    el.continuar.focus({ preventScroll: true });
    // Marcador.
    pintarMarcador();
  }

  // Sigue tras una pregunta respondida.
  function seguirTrasPregunta() {
    // Solo si se respondió.
    if (!partida || !partida.respondida) {
      // Salimos.
      return;
    }
    // Ya no hay pregunta.
    partida.respondida = false;
    // Oculta.
    el.pregunta.hidden = true;
    // Mensaje vacío.
    mensaje("");
    // Siguiente paso.
    partida.indice++;
    // Lo mostramos.
    mostrarPaso();
  }

  // --- Empezar y terminar ---

  // Pinta lo que no cambia durante el laboratorio: títulos, objetivo, esquema y tabla.
  function pintarFijo() {
    // Laboratorio.
    const lab = partida.lab;
    // Nivel y tipo.
    el.nivel.textContent = `${t(`redes.nivel.${["facil", "medio", "dificil"][lab.nivel - 1]}`)} · ${t(`lab.tipo.${lab.tipo}`)}`;
    // Título.
    el.titulo.textContent = bil(lab.titulo);
    // Objetivo.
    el.objetivo.textContent = bil(lab.objetivo);
    // Esquema.
    el.esquema.replaceChildren(dibujarEsquema(lab.esquema));
    // Tabla de direcciones.
    pintarDirecciones(lab.direcciones || []);
  }

  // Empieza un laboratorio.
  function empezar(id) {
    // Laboratorio pedido.
    const lab = lista().find((candidato) => candidato.id === id);
    // Si no existe, nada.
    if (!lab) {
      // Salimos.
      return;
    }
    // Si había otro, paramos su reloj.
    if (partida) {
      // Reloj.
      clearInterval(partida.reloj);
    }
    // Equipos del laboratorio.
    const nombres = Object.keys(lab.equipos);
    // Partida nueva.
    partida = {
      lab, // laboratorio
      pasos: prepararPasos(lab), // pasos con su equipo
      indice: 0, // paso actual
      sub: -1, // pregunta del equipo en curso (-1: ninguna)
      fallos: 0, // fallos en el paso actual
      errores: 0, // errores en total
      letras: 0, // letras de los comandos acertados
      comandos: 0, // comandos acertados
      parte: null, // parte actual
      ayuda: Ajustes.valor("ayudaLab"), // forma de hacerlo
      ayudaMinima: Ajustes.valor("ayudaLab"), // la que más ayudó durante la partida
      inicio: Date.now(), // momento de empezar
      reloj: null, // temporizador del reloj
      terminada: false, // true al terminar
      respondida: false, // pregunta del cuestionario respondida
      viendo: nombres[0], // equipo cuya consola se ve
      usados: new Set(), // equipos que ya se han usado
      hechos: {}, // lo escrito en cada paso
      estados: Object.fromEntries(nombres.map((nombre) => [nombre, Consola.estadoInicial(lab.equipos[nombre])])), // estado de cada equipo
      salidas: Object.fromEntries(nombres.map((nombre) => [nombre, []])), // líneas de cada consola
      historial: Object.fromEntries(nombres.map((nombre) => [nombre, []])), // comandos escritos en cada equipo
      posHistorial: 0, // posición al recorrer el historial con las flechas
      exportado: Object.fromEntries(nombres.map((nombre) => [nombre, []])), // configuración final de cada equipo
    };
    // Se ve la parte de trabajo, no el resultado.
    el.cuerpo.hidden = false;
    // Sin resultado.
    el.fin.hidden = true;
    // Pie con el botón de terminar.
    el.pie.hidden = false;
    // Sin mensaje.
    mensaje("");
    // Lo fijo.
    pintarFijo();
    // Botones de ayuda.
    pintarAyudas();
    // Consola vacía.
    el.salida.replaceChildren();
    // Mostramos la pantalla.
    mostrarPantalla("pantalla-lab");
    // Reloj.
    partida.reloj = setInterval(() => partida && !partida.terminada && pintarMarcador(), 500);
    // Primer paso.
    mostrarPaso();
  }

  // Clave del mejor resultado de un laboratorio.
  function claveMejor(id) {
    // Por ejemplo "frase-exacta:lab-vlan:mejor".
    return `frase-exacta:lab-${id}:mejor`;
  }

  // Mejor resultado de un laboratorio: { guiado: errores, plantilla: errores, examen: errores }.
  function mejor(id) {
    // Lo guardado.
    const guardado = typeof Memoria === "undefined" ? null : Memoria.leer(claveMejor(id), null);
    // Solo las formas válidas con un número.
    return Object.fromEntries(AYUDAS.filter((ayuda) => Number.isFinite(guardado?.[ayuda])).map((ayuda) => [ayuda, guardado[ayuda]]));
  }

  // Termina el laboratorio.
  //   completo: true si se hicieron todos los pasos
  function terminar(completo) {
    // Solo si hay partida sin terminar.
    if (!partida || partida.terminada) {
      // Salimos.
      return;
    }
    // Terminada.
    partida.terminada = true;
    // Paramos el reloj.
    clearInterval(partida.reloj);
    // Duración.
    const segundos = (Date.now() - partida.inicio) / 1000;
    // Último marcador.
    pintarMarcador();
    // Si se hizo algo, cuenta en las estadísticas.
    if (partida.comandos > 0) {
      // Anotamos.
      Estadisticas.registrar({ id: `lab-${partida.lab.id}`, frases: partida.comandos, letras: partida.letras, segundos, ppm: 0, racha: 0, actividad: true });
    }
    // Si no se completó, volvemos al menú.
    if (!completo) {
      // Menú (mostrarMenu está en principal.js).
      mostrarMenu();
      // Salimos.
      return;
    }
    // Mejor resultado hasta ahora.
    const anterior = mejor(partida.lab.id);
    // Forma con la que cuenta (la que más ayudó).
    const forma = partida.ayudaMinima;
    // ¿Récord? (Menos errores que antes con esa forma).
    const record = anterior[forma] === undefined || partida.errores < anterior[forma];
    // Si lo es, lo guardamos.
    if (record) {
      // Guardamos.
      Memoria.guardar(claveMejor(partida.lab.id), { ...anterior, [forma]: partida.errores });
    }
    // Ocultamos el trabajo y el pie.
    el.cuerpo.hidden = true;
    // Pie.
    el.pie.hidden = true;
    // Título.
    el.finTitulo.textContent = t("lab.fin.titulo");
    // Resumen.
    el.finTexto.textContent = t("lab.fin.resumen", { comandos: partida.comandos, errores: partida.errores, tiempo: formatearReloj(segundos), ayuda: t(`lab.ayuda.${forma}`) });
    // Configuración de cada equipo.
    pintarConfiguracion();
    // ¿Hay siguiente laboratorio?
    el.siguiente.hidden = !siguienteLab();
    // Se ve el resultado.
    el.fin.hidden = false;
    // Sonido.
    Sonidos.reproducir(record ? "record" : "fin");
    // Arriba.
    window.scrollTo(0, 0);
    // Foco en repetir.
    el.repetir.focus({ preventScroll: true });
  }

  // Pinta la configuración final de cada equipo, con un botón para copiarla.
  function pintarConfiguracion() {
    // Bloques.
    const bloques = [];
    // Cada equipo con algo exportado.
    for (const [equipo, lineas] of Object.entries(partida.exportado)) {
      // Sin líneas de configuración de verdad (solo enable, end...), se salta.
      if (lineas.every((linea) => /^(enable|configure terminal|end|exit)$/.test(linea))) {
        // Siguiente.
        continue;
      }
      // Bloque.
      const bloque = crear("div", "lab-config");
      // Cabecera: nombre y botón de copiar.
      const cabecera = crear("div", "lab-config-cabecera");
      // Texto a copiar.
      const texto = lineas.join("\n");
      // Botón.
      const copiar = crear("button", "boton-secundario boton-pequeno-texto", t("lab.copiar"));
      // Tipo de botón.
      copiar.type = "button";
      // Al pulsar, copia.
      copiar.addEventListener("click", () => copiarTexto(texto, copiar));
      // Cabecera.
      cabecera.append(crear("h3", "lab-config-equipo", `${equipo} · ${t(`lab.tipo.${tipoDe(equipo)}`)}`), copiar);
      // Bloque con el texto.
      bloque.append(cabecera, crear("pre", "lab-config-texto", texto));
      // A la lista.
      bloques.push(bloque);
    }
    // Sin bloques, nada (por ejemplo, en un laboratorio solo de consultas).
    if (bloques.length === 0) {
      // Vacío.
      el.finConfig.replaceChildren();
      // Salimos.
      return;
    }
    // Título, explicación y bloques.
    el.finConfig.replaceChildren(crear("h3", "subtitulo", t("lab.fin.config")), crear("p", "nota", t("lab.fin.configNota")), ...bloques);
  }

  // Copia un texto al portapapeles y lo avisa en el botón.
  async function copiarTexto(texto, boton) {
    // Intentamos copiar.
    try {
      // Portapapeles.
      await navigator.clipboard.writeText(texto);
      // Aviso.
      boton.textContent = t("lab.copiado");
      // Si falla (sin permiso)...
    } catch (error) {
      // ...seleccionamos el texto para que se copie a mano.
      const pre = boton.closest(".lab-config").querySelector("pre");
      // Selección.
      const rango = document.createRange();
      // Todo el texto.
      rango.selectNodeContents(pre);
      // Lo seleccionamos.
      window.getSelection().removeAllRanges();
      // Añadimos.
      window.getSelection().addRange(rango);
      // Aviso.
      boton.textContent = t("lab.seleccionado");
    }
  }

  // Laboratorio siguiente al actual (del mismo nivel, o el primero del siguiente), o null.
  function siguienteLab() {
    // Posición del actual.
    const posicion = lista().findIndex((lab) => lab.id === partida.lab.id);
    // El siguiente de la lista.
    return lista()[posicion + 1] || null;
  }

  // --- Teclado y botones ---

  // Teclas en la caja de la consola.
  el.entrada.addEventListener("keydown", (evento) => {
    // Sin partida, nada.
    if (!partida || partida.terminada) {
      // Salimos.
      return;
    }
    // Paso actual.
    const paso = pasoActual();
    // Intro: enviar.
    if (evento.key === "Enter") {
      // Sin salto de línea.
      evento.preventDefault();
      // Procesamos.
      procesar();
      // Salimos.
      return;
    }
    // Tab: completar la palabra (como el IOS).
    if (evento.key === "Tab" && paso && partida.sub < 0) {
      // Sin cambiar de foco.
      evento.preventDefault();
      // Completamos.
      el.entrada.value = Consola.completar(el.entrada.value, paso.c, tipoDe(paso.e));
      // Salimos.
      return;
    }
    // Flechas: recorrer los comandos ya escritos en este equipo.
    if ((evento.key === "ArrowUp" || evento.key === "ArrowDown") && paso && partida.sub < 0) {
      // Historial del equipo.
      const historial = partida.historial[paso.e];
      // Sin historial, nada.
      if (historial.length === 0) {
        // Salimos.
        return;
      }
      // Sin mover el cursor.
      evento.preventDefault();
      // Nueva posición.
      partida.posHistorial = Math.max(0, Math.min(historial.length, partida.posHistorial + (evento.key === "ArrowUp" ? -1 : 1)));
      // Comando de esa posición (o vacío al final).
      el.entrada.value = historial[partida.posHistorial] ?? "";
      // Salimos.
      return;
    }
    // ?: ayuda del IOS (solo en Cisco y sin pregunta del equipo).
    if (evento.key === "?" && paso && partida.sub < 0 && tipoDe(paso.e) === "cisco") {
      // No se escribe el ?.
      evento.preventDefault();
      // Copia de la línea con el ?.
      escribir(paso.e, [promptActual() + el.entrada.value + "?"], "eco");
      // Ayuda.
      escribir(paso.e, Consola.ayudaIOS(el.entrada.value, paso.c, partida.estados[paso.e].modo), "sal");
    }
  });

  // Al hacer clic en la consola, el foco va a la caja.
  el.consola.addEventListener("click", () => {
    // Si no se está seleccionando texto...
    if (!window.getSelection().toString()) {
      // ...foco.
      enfocar();
    }
  });

  // Botones de ayuda.
  for (const boton of el.ayudas.querySelectorAll("button")) {
    // Al pulsar, cambia.
    boton.addEventListener("click", () => cambiarAyuda(boton.dataset.ayuda));
  }

  // Botón de seguir tras una pregunta.
  el.continuar.addEventListener("click", seguirTrasPregunta);

  // Teclas 1, 2 y 3 en las preguntas, e Intro para seguir.
  document.addEventListener("keydown", (evento) => {
    // Solo en esta pantalla, con una pregunta a la vista y sin ventanas abiertas.
    if (document.body.dataset.pantalla !== "pantalla-lab" || !partida || el.pregunta.hidden || document.querySelector("dialog[open]")) {
      // Salimos.
      return;
    }
    // 1, 2 o 3: elegir.
    if (["1", "2", "3"].includes(evento.key) && !partida.respondida) {
      // Botón de esa opción.
      const boton = el.opciones.querySelectorAll("button")[Number(evento.key) - 1];
      // Si existe, se responde.
      if (boton) {
        // Sin escribir el número.
        evento.preventDefault();
        // Respuesta.
        responderPregunta(boton);
      }
    }
  });

  // Botón terminar: se deja el laboratorio a medias.
  el.terminar.addEventListener("click", () => terminar(false));
  // Botón repetir.
  el.repetir.addEventListener("click", () => partida && empezar(partida.lab.id));
  // Botón siguiente.
  el.siguiente.addEventListener("click", () => {
    // Siguiente laboratorio.
    const siguiente = partida && siguienteLab();
    // Si existe, a por él.
    if (siguiente) {
      // Empezamos.
      empezar(siguiente.id);
    }
  });
  // Botón volver.
  el.volver.addEventListener("click", () => mostrarMenu());

  // Al cambiar el idioma con un laboratorio a la vista, repintamos sus textos.
  alCambiarIdioma(() => {
    // Solo si se ve esta pantalla.
    if (!partida || document.body.dataset.pantalla !== "pantalla-lab") {
      // Salimos.
      return;
    }
    // Lo fijo.
    pintarFijo();
    // Si terminó, el resultado.
    if (partida.terminada) {
      // Configuración (sus botones).
      pintarConfiguracion();
      // Salimos.
      return;
    }
    // Tarea, guía y plantilla.
    pintarTarea();
    // Guía.
    pintarGuia();
    // Plantilla.
    pintarPasos();
    // Pregunta del cuestionario (sin volver a mezclarla si ya se respondió).
    const paso = pasoActual();
    // Si hay pregunta sin responder, se vuelve a pintar.
    if (paso && paso.q && !partida.respondida) {
      // Pregunta.
      mostrarPregunta(paso);
    }
  });

  // Laboratorios como «modos» para las tarjetas del menú.
  const modos = lista().map((lab) => ({
    id: `lab-${lab.id}`, // nombre interno
    nivel: lab.nivel, // nivel (para el desplegable de la sección)
    insignia: lab.insignia, // texto del cuadrado de color
    color: lab.color, // color de la tarjeta
    empezar: () => empezar(lab.id), // empieza el laboratorio
    nombre: () => bil(lab.titulo), // nombre de la tarjeta
    direccion: () => `${t(`lab.tipo.${lab.tipo}`)} · ${t("lab.laboratorio")}`, // tema de la tarjeta
    detalle: () => bil(lab.resumen), // descripción de la tarjeta
    // Línea de estado: comandos y lo que ya se ha completado.
    estado: () => {
      // Comandos del laboratorio.
      const comandos = lab.pasos.filter((paso) => paso.c !== undefined).length;
      // Preguntas.
      const preguntas = lab.pasos.filter((paso) => paso.q).length;
      // Mejor resultado.
      const hecho = mejor(lab.id);
      // Formas completadas.
      const completadas = AYUDAS.filter((ayuda) => hecho[ayuda] !== undefined).map((ayuda) => t("lab.estado.hecho", { ayuda: t(`lab.ayuda.${ayuda}`), errores: hecho[ayuda] }));
      // Comandos, preguntas y progreso.
      return `${t("lab.estado.pasos", { comandos, preguntas })} · ${completadas.length > 0 ? completadas.join(" · ") : t("lab.estado.nuevo")}`;
    },
  }));

  // Lo que este archivo ofrece al resto del juego.
  return { modos, empezar, terminar };
})();
