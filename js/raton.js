// raton.js: la sección Ratón, para aprender a usar el ratón (o el panel táctil).
// Cada lección pone 10 objetivos en la pantalla, uno tras otro, y cuenta el tiempo y los fallos:
//   mover:     pasar el puntero por encima del círculo (sin hacer clic)
//   clic:      hacer clic en el círculo (cada vez más pequeño)
//   dobleclic: hacer doble clic (dos clics seguidos y rápidos)
//   derecho:   hacer clic con el botón derecho
//   arrastrar: mantener pulsado el cuadrado y soltarlo dentro de la caja
//   rueda:     bajar (o subir) con la rueda hasta encontrar la estrella y hacer clic en ella
//   mezcla:    un poco de todo; cada objetivo dice qué hay que hacer
// Guarda el mejor tiempo de cada lección y cuenta el día y el tiempo en las estadísticas.
// Usa textos.js, memoria.js, estadisticas.js, pantallas.js y sonidos.js, que se cargan antes.

// Todo va dentro de una función que se ejecuta al momento, para no llenar el espacio global.
const Raton = (() => {
  // Objetivos por lección.
  const OBJETIVOS = 10;
  // Lecciones, en el orden del menú.
  const LECCIONES = ["mover", "clic", "dobleclic", "derecho", "arrastrar", "rueda", "mezcla"];
  // Acciones que pueden salir en la lección de mezcla.
  const DE_MEZCLA = ["clic", "dobleclic", "derecho", "arrastrar"];
  // Tamaño (en píxeles) del primer objetivo y del último: van encogiendo.
  const TAMANO_INICIAL = 96;
  // Tamaño del último.
  const TAMANO_FINAL = 40;
  // Milisegundos que hay que dejar el puntero encima en la lección de mover.
  const TIEMPO_ENCIMA = 350;
  // Milisegundos que se esperan tras un clic suelto en el doble clic antes de dar una pista.
  const ESPERA_DOBLE = 600;
  // Alto (en píxeles) del contenido que se desplaza con la rueda.
  const ALTO_RUEDA = 2400;

  // Atajo para no escribir document.getElementById cada vez.
  const $ = (id) => document.getElementById(id);
  // Elementos de la página.
  const el = {
    modo: $("raton-modo"), // nombre de la lección
    cuenta: $("raton-cuenta"), // objetivos conseguidos
    fallos: $("raton-fallos"), // fallos
    tiempo: $("raton-tiempo"), // tiempo
    instrucciones: $("raton-instrucciones"), // qué hay que hacer ahora
    zona: $("raton-zona"), // zona donde salen los objetivos
    fin: $("raton-fin"), // resultado
    finTitulo: $("raton-fin-titulo"), // título del resultado
    finTexto: $("raton-fin-texto"), // texto del resultado
    otra: $("raton-otra"), // botón de otra vez
    volver: $("raton-volver"), // botón de volver al menú
    terminar: $("raton-terminar"), // botón de terminar
    pie: $("raton-terminar").closest(".pie-juego"), // pie con el botón de terminar
  };

  // Partida en curso, o null.
  let partida = null;

  // Clave del mejor tiempo de una lección.
  function claveMejor(leccion) {
    // Por ejemplo "frase-exacta:raton-clic:mejor".
    return `frase-exacta:raton-${leccion}:mejor`;
  }

  // Mejor tiempo de una lección en segundos (0 si no hay).
  function mejorTiempo(leccion) {
    // Lo guardado.
    const guardado = typeof Memoria === "undefined" ? null : Memoria.leer(claveMejor(leccion), null);
    // Solo si es un número válido.
    return Number.isFinite(guardado) && guardado > 0 ? guardado : 0;
  }

  // Número al azar entre dos valores.
  function azarEntre(minimo, maximo) {
    // Valor entre mínimo y máximo.
    return minimo + Math.random() * (maximo - minimo);
  }

  // Segundos desde que empezó la partida.
  function segundos() {
    // Si no hay partida, cero.
    return partida ? (Date.now() - partida.inicio) / 1000 : 0;
  }

  // Escribe un tiempo corto con décimas ("12,3 s" o "12.3 s"); si pasa del minuto, como un reloj ("1:05").
  function formatearTiempo(total) {
    // Un minuto o más: como un reloj.
    if (total >= 60) {
      // Por ejemplo "1:05".
      return formatearReloj(total);
    }
    // Menos de un minuto: segundos con una décima, con la coma o el punto del idioma.
    return `${(Math.round(total * 10) / 10).toLocaleString(idiomaActual(), { minimumFractionDigits: 1, maximumFractionDigits: 1 })} s`;
  }

  // Pinta el marcador.
  function pintarMarcador() {
    // Conseguidos de los que hay.
    el.cuenta.textContent = `${partida.hechos}/${OBJETIVOS}`;
    // Fallos.
    el.fallos.textContent = String(partida.fallos);
    // Tiempo.
    el.tiempo.textContent = formatearTiempo(segundos());
  }

  // Muestra lo que hay que hacer (o una pista).
  //   tipo: "" normal, "aviso" para pistas
  function decir(texto, tipo = "") {
    // Texto.
    el.instrucciones.textContent = texto;
    // Estilo.
    el.instrucciones.dataset.tipo = tipo;
  }

  // Tamaño del objetivo actual: empieza grande y va encogiendo.
  function tamanoActual() {
    // Proporción hecha (de 0 a 1).
    const avance = partida.hechos / (OBJETIVOS - 1);
    // Del inicial al final.
    return Math.round(TAMANO_INICIAL - (TAMANO_INICIAL - TAMANO_FINAL) * avance);
  }

  // Elige un sitio al azar (en %) para algo de un tamaño dado, lejos del anterior si se puede.
  //   tamano: tamaño en píxeles
  //   lejosDe: posición { x, y } en % de la que alejarse (opcional)
  function sitioAlAzar(tamano, lejosDe) {
    // Medidas de la zona.
    const ancho = el.zona.clientWidth || 600;
    // Alto.
    const alto = el.zona.clientHeight || 400;
    // Margen en % para que no se salga.
    const margenX = ((tamano / 2 + 12) / ancho) * 100;
    // Margen vertical en %.
    const margenY = ((tamano / 2 + 12) / alto) * 100;
    // Mejor sitio encontrado.
    let mejor = null;
    // Probamos unos cuantos y nos quedamos con el más lejano.
    for (let intento = 0; intento < 8; intento++) {
      // Sitio de prueba.
      const sitio = { x: azarEntre(margenX, 100 - margenX), y: azarEntre(margenY, 100 - margenY) };
      // Distancia al anterior (en píxeles aproximados).
      const distancia = lejosDe ? Math.hypot(((sitio.x - lejosDe.x) * ancho) / 100, ((sitio.y - lejosDe.y) * alto) / 100) : Infinity;
      // Nos quedamos con el más lejano.
      if (!mejor || distancia > mejor.distancia) {
        // Nuevo mejor.
        mejor = { ...sitio, distancia };
      }
      // Si ya está bastante lejos, nos vale.
      if (distancia > tamano * 2.5) {
        // Salimos.
        break;
      }
    }
    // Devolvemos el sitio.
    return { x: mejor.x, y: mejor.y };
  }

  // Crea un elemento dentro de la zona.
  function crearEn(contenedor, clase, texto) {
    // Elemento.
    const elemento = document.createElement("div");
    // Clase para el estilo.
    elemento.className = clase;
    // Texto (si lo hay).
    if (texto) {
      // Lo ponemos.
      elemento.textContent = texto;
    }
    // Lo añadimos.
    contenedor.append(elemento);
    // Lo devolvemos.
    return elemento;
  }

  // Coloca un elemento en un sitio (en %) de la zona, centrado.
  function colocar(elemento, sitio, tamano) {
    // Izquierda.
    elemento.style.left = `${sitio.x}%`;
    // Arriba.
    elemento.style.top = `${sitio.y}%`;
    // Tamaño.
    if (tamano) {
      // Ancho.
      elemento.style.width = `${tamano}px`;
      // Alto.
      elemento.style.height = `${tamano}px`;
    }
  }

  // Marca un fallo (y dibuja un aviso donde fue, si se indica).
  //   punto: posición del puntero { clientX, clientY } (opcional)
  //   pista: texto de ayuda (opcional)
  function fallo(punto, pista) {
    // Un fallo más.
    partida.fallos++;
    // Repintamos.
    pintarMarcador();
    // Sonido de error.
    Sonidos.reproducir("error");
    // Si hay pista, la decimos.
    if (pista) {
      // Pista.
      decir(pista, "aviso");
    }
    // Si sabemos dónde fue, dibujamos una onda roja.
    if (punto) {
      // Medidas de la zona.
      const caja = el.zona.getBoundingClientRect();
      // Onda.
      const onda = crearEn(el.zona, "raton-onda");
      // En el punto.
      onda.style.left = `${punto.clientX - caja.left}px`;
      // Arriba.
      onda.style.top = `${punto.clientY - caja.top + el.zona.scrollTop}px`;
      // Se quita sola al terminar la animación.
      setTimeout(() => onda.remove(), 600);
    }
  }

  // Cuenta un objetivo como conseguido y pasa al siguiente (o termina).
  function conseguido() {
    // Uno más.
    partida.hechos++;
    // Sonido de acierto.
    Sonidos.reproducir("bien");
    // Repintamos.
    pintarMarcador();
    // Si ya están todos, terminamos.
    if (partida.hechos >= OBJETIVOS) {
      // Fin de la lección.
      terminar(true);
      // Salimos.
      return;
    }
    // Siguiente objetivo.
    siguiente();
  }

  // Quita los objetivos de la zona y sus temporizadores.
  function limpiarZona() {
    // Temporizador pendiente (mover, doble clic).
    clearTimeout(partida && partida.espera);
    // Vaciamos la zona.
    el.zona.replaceChildren();
    // Volvemos arriba.
    el.zona.scrollTop = 0;
    // Quitamos la clase de la rueda.
    el.zona.classList.remove("raton-zona-rueda");
  }

  // Acción de este objetivo (en la mezcla, una al azar distinta de la anterior si se puede).
  function accionActual() {
    // En la mezcla...
    if (partida.leccion === "mezcla") {
      // ...una al azar, sin repetir la anterior.
      const posibles = DE_MEZCLA.filter((accion) => accion !== partida.accion);
      // Elegimos.
      return posibles[Math.floor(Math.random() * posibles.length)];
    }
    // Si no, la de la lección.
    return partida.leccion;
  }

  // Pone el siguiente objetivo.
  function siguiente() {
    // Quitamos el anterior.
    limpiarZona();
    // Acción que toca.
    partida.accion = accionActual();
    // Instrucción (en la mezcla, la de la acción).
    decir(t(`raton.haz.${partida.accion}`));
    // Según la acción...
    if (partida.accion === "arrastrar") {
      // ...cuadrado y caja...
      ponerArrastre();
      // ...o la estrella de la rueda...
    } else if (partida.accion === "rueda") {
      // ...en una zona que se desplaza...
      ponerRueda();
      // ...o un círculo.
    } else {
      // Círculo.
      ponerCirculo();
    }
  }

  // Pone un círculo (mover, clic, doble clic y botón derecho).
  function ponerCirculo() {
    // Tamaño.
    const tamano = tamanoActual();
    // Sitio, lejos del anterior.
    const sitio = sitioAlAzar(tamano, partida.ultimo);
    // Lo recordamos.
    partida.ultimo = sitio;
    // Círculo con el texto de la acción (en la mezcla, para saber qué hacer).
    const circulo = crearEn(el.zona, `raton-objetivo raton-${partida.accion}`, partida.leccion === "mezcla" ? t(`raton.icono.${partida.accion}`) : "");
    // Lo colocamos.
    colocar(circulo, sitio, tamano);
    // Según la acción, qué lo consigue.
    if (partida.accion === "mover") {
      // Al entrar el puntero, empieza a contar...
      circulo.addEventListener("pointerenter", () => {
        // ...se ilumina...
        circulo.classList.add("encima");
        // ...y, si se queda encima un momento, cuenta.
        partida.espera = setTimeout(conseguido, TIEMPO_ENCIMA);
      });
      // Si sale antes de tiempo, se apaga.
      circulo.addEventListener("pointerleave", () => {
        // Apagamos.
        circulo.classList.remove("encima");
        // Cancelamos.
        clearTimeout(partida.espera);
      });
    } else if (partida.accion === "clic") {
      // Un clic con el botón principal.
      circulo.addEventListener("click", (evento) => {
        // Que no llegue a la zona (contaría como fallo).
        evento.stopPropagation();
        // Conseguido.
        conseguido();
      });
    } else if (partida.accion === "dobleclic") {
      // El primer clic solo enciende el círculo; si no llega el segundo, damos una pista.
      circulo.addEventListener("click", (evento) => {
        // Que no llegue a la zona.
        evento.stopPropagation();
        // Si es el primer clic de una serie...
        if (evento.detail === 1) {
          // ...se ve que ha notado un clic...
          circulo.classList.add("encima");
          // ...y si no llega el segundo a tiempo, damos una pista.
          clearTimeout(partida.espera);
          // Pista tras esperar.
          partida.espera = setTimeout(() => {
            // Apagamos.
            circulo.classList.remove("encima");
            // Pista.
            decir(t("raton.pista.dobleclic"), "aviso");
          }, ESPERA_DOBLE);
        }
      });
      // El doble clic lo consigue.
      circulo.addEventListener("dblclick", (evento) => {
        // Que no llegue a la zona.
        evento.stopPropagation();
        // Cancelamos la pista.
        clearTimeout(partida.espera);
        // Conseguido.
        conseguido();
      });
    } else if (partida.accion === "derecho") {
      // El botón derecho (abre el menú contextual: lo evitamos).
      circulo.addEventListener("contextmenu", (evento) => {
        // Sin menú.
        evento.preventDefault();
        // Que no llegue a la zona.
        evento.stopPropagation();
        // Conseguido.
        conseguido();
      });
      // Con el botón izquierdo, pista (y fallo).
      circulo.addEventListener("click", (evento) => {
        // Que no llegue a la zona (sería otro fallo).
        evento.stopPropagation();
        // Fallo con pista.
        fallo(evento, t("raton.pista.derecho"));
      });
    }
  }

  // Pone el cuadrado que se arrastra y la caja donde se suelta.
  function ponerArrastre() {
    // Tamaño del cuadrado (encoge con el avance).
    const tamano = Math.max(48, tamanoActual() - 16);
    // Tamaño de la caja (algo mayor que el cuadrado).
    const tamanoCaja = tamano + 40;
    // Sitio de la caja.
    const sitioCaja = sitioAlAzar(tamanoCaja, partida.ultimo);
    // Sitio del cuadrado, lejos de la caja.
    const sitioFicha = sitioAlAzar(tamano, sitioCaja);
    // Lo recordamos.
    partida.ultimo = sitioFicha;
    // Caja.
    const caja = crearEn(el.zona, "raton-caja", t("raton.icono.caja"));
    // La colocamos.
    colocar(caja, sitioCaja, tamanoCaja);
    // Cuadrado (en la mezcla, con su icono).
    const ficha = crearEn(el.zona, "raton-ficha", partida.leccion === "mezcla" ? t("raton.icono.arrastrar") : "");
    // Lo colocamos.
    colocar(ficha, sitioFicha, tamano);
    // Desplazamiento entre el puntero y el centro del cuadrado al agarrarlo.
    let agarre = null;
    // Al pulsar sobre el cuadrado, se agarra.
    ficha.addEventListener("pointerdown", (evento) => {
      // Solo con el botón principal.
      if (evento.button !== 0) {
        // Salimos.
        return;
      }
      // Que no llegue a la zona.
      evento.stopPropagation();
      // Evitamos que se seleccione texto.
      evento.preventDefault();
      // Medidas del cuadrado.
      const medidas = ficha.getBoundingClientRect();
      // Desplazamiento desde el centro.
      agarre = { x: evento.clientX - (medidas.left + medidas.width / 2), y: evento.clientY - (medidas.top + medidas.height / 2) };
      // Seguimos al puntero aunque salga del cuadrado.
      ficha.setPointerCapture(evento.pointerId);
      // Se ve agarrado.
      ficha.classList.add("agarrada");
    });
    // Al mover, el cuadrado sigue al puntero.
    ficha.addEventListener("pointermove", (evento) => {
      // Solo si está agarrado.
      if (!agarre) {
        // Salimos.
        return;
      }
      // Medidas de la zona.
      const zona = el.zona.getBoundingClientRect();
      // Nuevo centro, en %.
      const sitio = {
        x: ((evento.clientX - agarre.x - zona.left) / zona.width) * 100, // horizontal
        y: ((evento.clientY - agarre.y - zona.top) / zona.height) * 100, // vertical
      };
      // Lo movemos (sin salirse).
      colocar(ficha, { x: Math.min(100, Math.max(0, sitio.x)), y: Math.min(100, Math.max(0, sitio.y)) });
      // La caja se ilumina si el cuadrado está encima.
      caja.classList.toggle("encima", dentro(ficha, caja));
    });
    // Al soltar...
    const soltar = () => {
      // ...si no estaba agarrado, nada.
      if (!agarre) {
        // Salimos.
        return;
      }
      // Ya no está agarrado.
      agarre = null;
      // Se ve suelto.
      ficha.classList.remove("agarrada");
      // Si cayó dentro de la caja, conseguido.
      if (dentro(ficha, caja)) {
        // Conseguido.
        conseguido();
        // Si no...
      } else {
        // ...vuelve a su sitio y es un fallo, con pista.
        colocar(ficha, sitioFicha);
        // Fallo.
        fallo(null, t("raton.pista.arrastrar"));
      }
    };
    // Soltar el botón.
    ficha.addEventListener("pointerup", soltar);
    // Si el navegador cancela el gesto, también se suelta.
    ficha.addEventListener("pointercancel", soltar);
  }

  // ¿Está el centro de un elemento dentro de otro?
  function dentro(elemento, caja) {
    // Medidas del elemento.
    const a = elemento.getBoundingClientRect();
    // Medidas de la caja.
    const b = caja.getBoundingClientRect();
    // Centro del elemento.
    const x = a.left + a.width / 2;
    // Centro vertical.
    const y = a.top + a.height / 2;
    // Dentro si el centro cae en la caja.
    return x >= b.left && x <= b.right && y >= b.top && y <= b.bottom;
  }

  // Pone una estrella fuera de la vista, en una zona alta que se desplaza con la rueda.
  function ponerRueda() {
    // La zona se puede desplazar.
    el.zona.classList.add("raton-zona-rueda");
    // Contenido alto con rayas (para que se note que se mueve).
    const pista = crearEn(el.zona, "raton-pista");
    // Alto del contenido.
    pista.style.height = `${ALTO_RUEDA}px`;
    // Alto visible.
    const visible = el.zona.clientHeight || 400;
    // Posición actual (alternamos: una vez abajo, otra vez arriba).
    const abajo = partida.hechos % 2 === 0;
    // Si toca subir, empezamos abajo del todo.
    el.zona.scrollTop = abajo ? 0 : ALTO_RUEDA;
    // Tamaño de la estrella.
    const tamano = Math.max(48, tamanoActual());
    // Altura de la estrella: lejos de lo que se ve ahora.
    const altura = abajo ? azarEntre(visible * 1.5, ALTO_RUEDA - tamano) : azarEntre(tamano, ALTO_RUEDA - visible * 2.5);
    // Estrella.
    const estrella = crearEn(el.zona, "raton-estrella", "★");
    // Posición: en píxeles dentro del contenido.
    estrella.style.top = `${altura}px`;
    // Horizontal, al azar (en %).
    estrella.style.left = `${azarEntre(15, 85)}%`;
    // Tamaño.
    estrella.style.width = `${tamano}px`;
    // Alto.
    estrella.style.height = `${tamano}px`;
    // Instrucción con la dirección.
    decir(t(abajo ? "raton.haz.ruedaAbajo" : "raton.haz.ruedaArriba"));
    // Al hacer clic en la estrella, conseguido.
    estrella.addEventListener("click", (evento) => {
      // Que no llegue a la zona.
      evento.stopPropagation();
      // Conseguido.
      conseguido();
    });
  }

  // Empieza una lección.
  function empezar(leccion) {
    // Si había una partida, la cerramos sin guardar.
    if (partida) {
      // Paramos el reloj.
      clearInterval(partida.reloj);
      // Temporizador pendiente.
      clearTimeout(partida.espera);
    }
    // Partida nueva.
    partida = {
      leccion, // lección
      accion: null, // acción del objetivo actual
      hechos: 0, // objetivos conseguidos
      fallos: 0, // fallos
      inicio: Date.now(), // momento de empezar
      ultimo: null, // sitio del objetivo anterior
      espera: null, // temporizador pendiente
      reloj: null, // temporizador del reloj
      terminada: false, // true al terminar
    };
    // Nombre de la lección.
    el.modo.textContent = t(`modo.raton-${leccion}.nombre`);
    // Se ve la zona y no el resultado.
    el.zona.hidden = false;
    // Sin resultado.
    el.fin.hidden = true;
    // Se ve el pie con el botón de terminar.
    el.pie.hidden = false;
    // Mostramos la pantalla.
    mostrarPantalla("pantalla-raton");
    // Marcador a cero.
    pintarMarcador();
    // El reloj se actualiza cuatro veces por segundo.
    partida.reloj = setInterval(pintarMarcador, 250);
    // Primer objetivo (cuando la pantalla ya tiene medidas).
    requestAnimationFrame(siguiente);
  }

  // Termina la lección.
  //   completa: true si se consiguieron todos los objetivos
  function terminar(completa) {
    // Solo si hay partida sin terminar.
    if (!partida || partida.terminada) {
      // Salimos.
      return;
    }
    // Terminada.
    partida.terminada = true;
    // Paramos el reloj.
    clearInterval(partida.reloj);
    // Tiempo total.
    const tiempo = segundos();
    // Último marcador.
    pintarMarcador();
    // Quitamos los objetivos.
    limpiarZona();
    // Ocultamos la zona y el pie con el botón de terminar.
    el.zona.hidden = true;
    // Pie.
    el.pie.hidden = true;
    // Mejor tiempo hasta ahora.
    const mejor = mejorTiempo(partida.leccion);
    // ¿Récord? Solo si se completó.
    const record = completa && (mejor === 0 || tiempo < mejor);
    // Si es récord, lo guardamos.
    if (record) {
      // Guardamos el tiempo.
      Memoria.guardar(claveMejor(partida.leccion), Math.round(tiempo * 10) / 10);
    }
    // Si se hizo algo, cuenta en las estadísticas (el día y el tiempo).
    if (partida.hechos > 0) {
      // Anotamos la práctica.
      Estadisticas.registrar({ id: `raton-${partida.leccion}`, frases: 0, letras: 0, segundos: tiempo, ppm: 0, racha: 0, actividad: true });
    }
    // Título.
    el.finTitulo.textContent = record ? t("raton.record") : completa ? t("raton.hecho") : t("raton.terminada");
    // Resumen: objetivos, tiempo, fallos y mejor tiempo.
    el.finTexto.textContent = t("raton.resumen", {
      hechos: partida.hechos, // conseguidos
      total: OBJETIVOS, // de cuántos
      tiempo: formatearTiempo(tiempo), // tiempo
      fallos: partida.fallos, // fallos
      mejor: formatearTiempo(record ? tiempo : mejor || tiempo), // mejor tiempo
    });
    // Instrucciones vacías.
    decir("");
    // Mostramos el resultado.
    el.fin.hidden = false;
    // Sonido de fin (más alegre si es récord).
    if (completa) {
      // Fanfarria.
      Sonidos.reproducir(record ? "record" : "fin");
    }
    // Foco en «Otra vez».
    el.otra.focus();
  }

  // Vuelve al menú.
  function volver() {
    // Cerramos la partida, si quedaba.
    terminar(false);
    // Al menú (mostrarMenu está en principal.js).
    mostrarMenu();
  }

  // Un clic (o botón derecho) en la zona fuera del objetivo es un fallo.
  el.zona.addEventListener("pointerdown", (evento) => {
    // Solo durante una partida, y no en las lecciones de mover ni de rueda (ahí se puede tocar la zona).
    if (!partida || partida.terminada || partida.accion === "mover" || partida.accion === "rueda") {
      // Salimos.
      return;
    }
    // Solo si se pulsó en la zona misma (no en un objetivo).
    if (evento.target === el.zona) {
      // Fallo donde se pulsó.
      fallo(evento, t("raton.pista.fuera"));
    }
  });
  // En la zona nunca sale el menú contextual (si no, el botón derecho lo abriría).
  el.zona.addEventListener("contextmenu", (evento) => evento.preventDefault());
  // Botón de otra vez.
  el.otra.addEventListener("click", () => empezar(partida ? partida.leccion : "clic"));
  // Botón de volver.
  el.volver.addEventListener("click", volver);
  // Botón de terminar.
  el.terminar.addEventListener("click", () => terminar(false));
  // Escape termina la lección (y, si ya terminó, vuelve al menú).
  document.addEventListener("keydown", (evento) => {
    // Solo en la pantalla del ratón y sin ventanas abiertas.
    if (document.body.dataset.pantalla !== "pantalla-raton" || document.querySelector("dialog[open]") || evento.key !== "Escape") {
      // Salimos.
      return;
    }
    // Si sigue, la terminamos; si no, volvemos.
    if (partida && !partida.terminada) {
      // Terminar.
      terminar(false);
      // Si no...
    } else {
      // ...volvemos al menú.
      volver();
    }
  });

  // Lecciones como «modos» para las tarjetas del menú.
  const modos = LECCIONES.map((leccion) => ({
    id: `raton-${leccion}`, // nombre interno (sus textos son "modo.raton-clic.nombre"...)
    empezar: () => empezar(leccion), // empieza la lección
    // Línea de estado de la tarjeta.
    estado: () => {
      // Mejor tiempo.
      const mejor = mejorTiempo(leccion);
      // Con o sin mejor tiempo.
      return mejor > 0 ? t("raton.estado", { n: OBJETIVOS, mejor: formatearTiempo(mejor) }) : t("raton.estadoNuevo", { n: OBJETIVOS });
    },
  }));

  // Lo que este archivo ofrece al resto del juego.
  return { modos, LECCIONES, empezar, terminar };
})();
