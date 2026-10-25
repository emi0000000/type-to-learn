// tecladoVisual.js: dibuja el teclado en la pantalla y señala qué teclas hay que pulsar.
// - En las lecciones de teclado (y en todos los modos, si se activa en los ajustes) muestra la siguiente tecla.
// - El buscador «¿Dónde está?» enseña dónde está cualquier carácter en tu tipo de teclado.
// Usa teclado.js (cómo es cada teclado), textos.js y ajustes.js, que se cargan antes.

// Todo va dentro de una función que se ejecuta al momento, para no llenar el espacio global.
const TecladoVisual = (() => {
  // Atajo para no escribir document.getElementById cada vez.
  const $ = (id) => document.getElementById(id);
  // Teclado que se supone según el idioma del navegador (se mejora con detectar()).
  let detectado = disposicionPorIdioma(navigator.languages || [navigator.language]);
  // Teclados dibujados en la página, para repintarlos si cambia el tipo o el idioma.
  const dibujados = [];
  // Funciones que quieren enterarse cuando cambia el tipo de teclado.
  const avisos = [];

  // Teclas especiales: clave de su texto en textos.js.
  const ESPECIALES = {
    Backspace: "tecla.borrar", // borrar
    Tab: "tecla.tab", // tabulador
    CapsLock: "tecla.bloqMayus", // bloqueo de mayúsculas
    Enter: "tecla.intro", // intro
    ShiftLeft: "tecla.mayus", // mayúsculas izquierda
    ShiftRight: "tecla.mayus", // mayúsculas derecha
    ControlLeft: "tecla.ctrl", // control izquierda
    ControlRight: "tecla.ctrl", // control derecha
    MetaLeft: "tecla.win", // Windows o Cmd
    MetaRight: "tecla.win", // Windows o Cmd
    AltLeft: "tecla.alt", // Alt
    Space: "tecla.espacio", // barra espaciadora
  };

  // Caracteres que se ofrecen en el buscador, los que más cuesta encontrar.
  const DIFICILES = ["@", "#", "€", "$", "%", "&", "/", "\\", "|", "^", "~", "{", "}", "[", "]", "<", ">", "¿", "¡", "á", "ñ", "ü", "´", "`", "°", "*", "_", '"', "'", "="];

  // Tipo de teclado en uso: el elegido en los ajustes o, si es automático, el detectado.
  function disposicionActual() {
    // Valor del ajuste.
    const elegido = Ajustes.valor("teclado");
    // Si es automático, el detectado.
    return elegido === "auto" ? detectado : elegido;
  }

  // Intenta saber el teclado real con el navegador (solo Chrome y Edge de ordenador lo permiten).
  function detectar() {
    // Si el navegador no lo permite, nos quedamos con la suposición por idioma.
    if (!navigator.keyboard || typeof navigator.keyboard.getLayoutMap !== "function") {
      // Salimos.
      return;
    }
    // Pedimos el mapa de teclas.
    navigator.keyboard
      .getLayoutMap()
      .then((mapa) => {
        // Teclado reconocido (o null).
        const reconocido = disposicionPorMapa(mapa);
        // Si lo reconocimos y es distinto del supuesto...
        if (reconocido && reconocido !== detectado) {
          // ...lo guardamos...
          detectado = reconocido;
          // ...y avisamos para repintar.
          avisarCambio();
        }
      })
      // Si falla, seguimos con la suposición.
      .catch(() => {});
  }

  // Avisa de que cambió el teclado: repinta los dibujos y llama a quien lo pidió.
  function avisarCambio() {
    // Repintamos cada teclado dibujado.
    for (const dibujo of dibujados) {
      // Lo volvemos a pintar.
      dibujo.pintar();
    }
    // Avisamos a los demás.
    for (const aviso of avisos) {
      // Llamamos a la función.
      aviso();
    }
  }

  // Registra una función que se llamará cuando cambie el tipo de teclado.
  function alCambiar(funcion) {
    // La añadimos a la lista.
    avisos.push(funcion);
  }

  // Nombre de un tipo de teclado en el idioma de la interfaz.
  function nombreDisposicion(id = disposicionActual()) {
    // Por ejemplo "teclado.nombre.la" -> "Latinoamericano".
    return t(`teclado.nombre.${id}`);
  }

  // ¿La tecla escribe una letra? (también ñ y ç: su carácter con Mayús es la misma letra en mayúscula)
  function esTeclaDeLetra(normal, mayus) {
    // Un solo carácter que cambia al pasarlo a mayúscula, y con Mayús da esa mayúscula.
    return Boolean(normal) && normal.length === 1 && normal.toUpperCase() !== normal && mayus === normal.toUpperCase();
  }

  // Texto que se ve en una tecla (en las letras, la mayúscula; en las especiales, su nombre).
  //   ancho: ancho de la tecla (la Mayús izquierda estrecha solo muestra la flecha)
  function etiquetaDe(codigo, normal, mayus, ancho = 1) {
    // Mayús izquierda estrecha (teclados españoles): solo la flecha, que el nombre no cabe.
    if (codigo === "ShiftLeft" && ancho < 2) {
      // Flecha de mayúsculas.
      return "⇧";
    }
    // Teclas especiales.
    if (ESPECIALES[codigo]) {
      // Su nombre.
      return t(ESPECIALES[codigo]);
    }
    // Alt Gr: en el teclado inglés es una Alt normal.
    if (codigo === "AltRight") {
      // Alt Gr o Alt.
      return disposicionActual() === "us" ? t("tecla.alt") : t("tecla.altgr");
    }
    // Letras: en mayúscula, como en el teclado de verdad.
    if (/^Key/.test(codigo) || esTeclaDeLetra(normal, mayus)) {
      // La letra en mayúscula.
      return normal.toUpperCase();
    }
    // Otras teclas: su carácter normal.
    return normal || "";
  }

  // Describe con palabras un paso, por ejemplo "Mayús + 2" o "Alt Gr + Q".
  function describirPaso(paso) {
    // Fila y tecla del paso en el teclado actual.
    const tecla = buscarTecla(paso.codigo);
    // Texto de la tecla (con la Mayús izquierda nunca se pasa por aquí: los pasos no la usan).
    const nombre = etiquetaDe(paso.codigo, tecla ? tecla[1] : "", tecla ? tecla[2] : null);
    // Con Mayús.
    if (paso.mayus) {
      // "Mayús + tecla".
      return `${t("tecla.mayusCorta")} + ${nombre}`;
    }
    // Con Alt Gr.
    if (paso.altgr) {
      // "Alt Gr + tecla".
      return `${t("tecla.altgr")} + ${nombre}`;
    }
    // Sola.
    return nombre;
  }

  // Busca una tecla por su código en el teclado actual.
  function buscarTecla(codigo) {
    // Recorremos las filas.
    for (const fila of DISPOSICIONES[disposicionActual()].filas) {
      // Buscamos la tecla en la fila.
      const tecla = fila.find((candidata) => candidata[0] === codigo);
      // Si está, la devolvemos.
      if (tecla) {
        // Tecla encontrada.
        return tecla;
      }
    }
    // No está.
    return null;
  }

  // Explica cómo se escribe un carácter en el teclado actual.
  // Devuelve { pasos, texto }: pasos es null si el teclado no lo tiene.
  function describir(caracter) {
    // Pasos para escribirlo.
    const pasos = pasosPara(caracter, disposicionActual());
    // Si no se puede, lo decimos.
    if (!pasos) {
      // Texto de aviso.
      return { pasos: null, texto: t("teclado.noEsta", { c: caracter, teclado: nombreDisposicion() }) };
    }
    // Pasos con palabras, unidos con una flecha.
    const partes = pasos.map((paso) => describirPaso(paso) + (paso.muerta ? ` (${t("teclado.muerta")})` : ""));
    // Dedo del primer paso.
    const dedo = t(`dedo.${dedoDe(pasos[0].codigo)}`);
    // Texto completo.
    let texto = `${partes.join(" → ")} · ${t("teclado.conDedo", { dedo })}`;
    // Si hay una tecla muerta, explicamos qué es.
    if (pasos.some((paso) => paso.muerta)) {
      // Explicación.
      texto += ` ${t("teclado.explicaMuerta")}`;
    }
    // Devolvemos los pasos y el texto.
    return { pasos, texto };
  }

  // Dibuja un teclado dentro de un contenedor y devuelve sus herramientas.
  //   contenedor: elemento de la página donde se dibuja
  function crear(contenedor) {
    // Caja de las teclas.
    const teclas = document.createElement("div");
    // Clase para el estilo.
    teclas.className = "teclado-visual";
    // Los lectores de pantalla no leen el dibujo (el texto de ayuda dice lo mismo).
    teclas.setAttribute("aria-hidden", "true");
    // Texto de ayuda debajo del dibujo.
    const ayuda = document.createElement("p");
    // Clase para el estilo.
    ayuda.className = "teclado-ayuda";
    // Los lectores de pantalla leen sus cambios.
    ayuda.setAttribute("aria-live", "polite");
    // Ponemos las dos cosas en el contenedor.
    contenedor.replaceChildren(teclas, ayuda);
    // Último carácter señalado (para repintar).
    let ultimo = null;

    // Pinta todas las teclas del teclado actual.
    function pintar() {
      // Teclado actual.
      const disposicion = DISPOSICIONES[disposicionActual()];
      // Fragmento donde montamos las filas.
      const fragmento = document.createDocumentFragment();
      // Recorremos las filas.
      for (const fila of disposicion.filas) {
        // Caja de la fila.
        const caja = document.createElement("div");
        // Clase para el estilo.
        caja.className = "teclado-fila";
        // Recorremos las teclas de la fila.
        for (const [codigo, normal, mayus, altgr, ancho] of fila) {
          // Caja de la tecla.
          const tecla = document.createElement("div");
          // Clases: tecla y su dedo (para el color).
          tecla.className = `tecla-visual dedo-${dedoDe(codigo)}`;
          // Código, para encontrarla al señalar.
          tecla.dataset.codigo = codigo;
          // Ancho de la tecla.
          tecla.style.setProperty("--ancho", ancho);
          // F y J llevan una marca, como los bultitos del teclado de verdad.
          if (codigo === "KeyF" || codigo === "KeyJ") {
            // Marca.
            tecla.classList.add("guia");
          }
          // Texto principal.
          const principal = document.createElement("span");
          // Clase para el estilo.
          principal.className = "tv-principal";
          // Texto de la tecla.
          principal.textContent = etiquetaDe(codigo, normal, mayus, ancho);
          // Lo añadimos.
          tecla.append(principal);
          // En las teclas que no son letras, el carácter con Mayús va arriba a la izquierda.
          if (mayus && !/^Key/.test(codigo) && !esTeclaDeLetra(normal, mayus)) {
            // Texto de Mayús.
            const arriba = document.createElement("span");
            // Clase para el estilo.
            arriba.className = "tv-mayus";
            // Carácter.
            arriba.textContent = mayus;
            // Lo añadimos.
            tecla.append(arriba);
          }
          // El carácter con Alt Gr va abajo a la derecha.
          if (altgr) {
            // Texto de Alt Gr.
            const abajo = document.createElement("span");
            // Clase para el estilo.
            abajo.className = "tv-altgr";
            // Carácter.
            abajo.textContent = altgr;
            // Lo añadimos.
            tecla.append(abajo);
          }
          // Añadimos la tecla a la fila.
          caja.append(tecla);
        }
        // Añadimos la fila.
        fragmento.append(caja);
      }
      // Cambiamos el dibujo anterior por el nuevo.
      teclas.replaceChildren(fragmento);
      // Volvemos a señalar lo que estaba señalado.
      resaltar(ultimo);
    }

    // Quita todas las señales.
    function limpiar() {
      // Recorremos las teclas señaladas.
      for (const tecla of teclas.querySelectorAll(".objetivo, .modificador, .paso2")) {
        // Quitamos las clases de señal.
        tecla.classList.remove("objetivo", "modificador", "paso2");
        // Y el número de paso.
        delete tecla.dataset.paso;
      }
    }

    // Señala una tecla por su código con una clase.
    function marcar(codigo, clase, numero) {
      // Puede haber dos (por ejemplo, Intro ocupa dos filas).
      for (const tecla of teclas.querySelectorAll(`[data-codigo="${codigo}"]`)) {
        // Ponemos la clase.
        tecla.classList.add(clase);
        // Y el número de paso, si lo hay.
        if (numero) {
          // Número que se ve en la esquina.
          tecla.dataset.paso = numero;
        }
      }
    }

    // Señala las teclas para escribir un carácter (o nada, con null) y escribe la ayuda.
    function resaltar(caracter) {
      // Guardamos el carácter para repintar.
      ultimo = caracter;
      // Quitamos las señales anteriores.
      limpiar();
      // Sin carácter, sin ayuda.
      if (caracter === null || caracter === undefined || caracter === "") {
        // Ayuda vacía.
        ayuda.textContent = "";
        // Salimos.
        return;
      }
      // Pasos y explicación.
      const { pasos, texto } = describir(caracter);
      // Escribimos la explicación.
      ayuda.textContent = texto;
      // Si el teclado no lo tiene, no hay nada que señalar.
      if (!pasos) {
        // Salimos.
        return;
      }
      // Recorremos los pasos.
      pasos.forEach((paso, posicion) => {
        // Número del paso (solo si hay más de uno).
        const numero = pasos.length > 1 ? String(posicion + 1) : "";
        // La primera tecla es el objetivo; las demás, el paso siguiente.
        marcar(paso.codigo, posicion === 0 ? "objetivo" : "paso2", numero);
        // Si hay que mantener Mayús, señalamos la de la otra mano.
        if (paso.mayus) {
          // Mayús de la mano contraria a la de la tecla.
          marcar(esManoIzquierda(paso.codigo) ? "ShiftRight" : "ShiftLeft", "modificador", numero);
        }
        // Si hay que mantener Alt Gr, la señalamos.
        if (paso.altgr) {
          // Alt Gr.
          marcar("AltRight", "modificador", numero);
        }
      });
    }

    // Pintamos por primera vez.
    pintar();
    // Herramientas de este teclado.
    const dibujo = { pintar, resaltar, limpiar };
    // Lo apuntamos para repintarlo si cambia el teclado o el idioma.
    dibujados.push(dibujo);
    // Lo devolvemos.
    return dibujo;
  }

  // --- Buscador «¿Dónde está?» ---

  // Elementos del buscador.
  const buscador = {
    dialogo: $("buscador"), // ventana del buscador
    teclado: $("buscador-teclado"), // donde se dibuja el teclado
    botones: $("buscador-botones"), // botones de caracteres difíciles
    entrada: $("buscador-entrada"), // caja para escribir un carácter
    tipo: $("buscador-tipo"), // desplegable del tipo de teclado
  };
  // Teclado del buscador (se crea al abrirlo por primera vez).
  let tecladoBuscador = null;

  // Abre el buscador.
  function abrirBuscador() {
    // La primera vez, dibujamos su teclado y sus botones.
    if (!tecladoBuscador) {
      // Teclado.
      tecladoBuscador = crear(buscador.teclado);
      // Un botón por carácter difícil.
      for (const caracter of DIFICILES) {
        // Botón.
        const boton = document.createElement("button");
        // Botón normal, no de formulario.
        boton.type = "button";
        // Carácter que muestra.
        boton.textContent = caracter;
        // Al pulsarlo, señalamos ese carácter.
        boton.addEventListener("click", () => {
          // Lo ponemos en la caja.
          buscador.entrada.value = caracter;
          // Lo señalamos.
          tecladoBuscador.resaltar(caracter);
        });
        // Lo añadimos.
        buscador.botones.append(boton);
      }
    }
    // Ponemos el tipo de teclado en el desplegable.
    buscador.tipo.value = Ajustes.valor("teclado");
    // Empezamos señalando la @, que es lo que más se busca.
    buscador.entrada.value = "@";
    // La señalamos.
    tecladoBuscador.resaltar("@");
    // Abrimos la ventana.
    buscador.dialogo.showModal();
  }

  // Al escribir en la caja del buscador, señalamos el último carácter.
  buscador.entrada.addEventListener("input", () => {
    // Último carácter escrito (puede ser una letra con tilde de dos partes, por eso normalizamos).
    const caracteres = [...buscador.entrada.value.normalize("NFC")];
    // Lo señalamos (o nada si la caja está vacía).
    tecladoBuscador.resaltar(caracteres.length > 0 ? caracteres[caracteres.length - 1] : null);
  });
  // Al cambiar el tipo de teclado en el buscador, cambia el ajuste.
  buscador.tipo.addEventListener("change", () => Ajustes.cambiar("teclado", buscador.tipo.value));
  // Al hacer clic fuera del buscador, se cierra.
  buscador.dialogo.addEventListener("click", (evento) => {
    // Si el clic fue en el fondo (el propio diálogo)...
    if (evento.target === buscador.dialogo) {
      // ...lo cerramos.
      buscador.dialogo.close();
    }
  });

  // Si cambia el ajuste del tipo de teclado o el idioma, repintamos.
  document.addEventListener("frase-exacta:ajuste", (evento) => {
    // Solo nos interesa el teclado.
    if (evento.detail.nombre === "teclado") {
      // Repintamos y avisamos.
      avisarCambio();
    }
  });
  // Al cambiar de idioma, los nombres de las teclas cambian.
  alCambiarIdioma(() => {
    // Repintamos cada teclado dibujado.
    for (const dibujo of dibujados) {
      // Lo volvemos a pintar.
      dibujo.pintar();
    }
  });

  // Intentamos detectar el teclado real.
  detectar();

  // Lo que este archivo ofrece al resto del juego.
  return { disposicionActual, nombreDisposicion, describir, crear, abrirBuscador, alCambiar };
})();
