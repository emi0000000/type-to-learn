// motor.js: el motor común de las partidas.
// Hace lo que comparten todos los modos: mostrar la frase, revisar lo que se escribe,
// quitar (y devolver) vidas, contar frases, racha y velocidad, guardar los errores y mostrar el resultado final.
// Cada modo se describe en js/modos/ con un objeto que tiene:
//   id                    nombre interno ("ortografia", "ingles"...); sus textos son "modo.<id>.nombre"...
//   idioma                idioma de la frase que se copia ("es", "en")
//   frases()              lista de frases; cada una empieza por [número, texto que se copia, ...]
//   creditos(frase)       lista de [clave de la etiqueta, número, autor] para citar a Tatoeba ([] si no hace falta)
// Y, si los necesita (todo opcional):
//   idiomaDe(frase)       idioma de una frase concreta, si cambia de una a otra (abecedario)
//   teclas                botones de caracteres especiales: "es" (á, é, ñ, ¿...), una lista de caracteres,
//                         o una función (frase) que devuelve una de las dos cosas
//   consigna(frase)       texto que se muestra encima de la frase (el nombre de una fórmula, una tarea...)
//   etiqueta(frase)       texto corto en la cabecera de la frase (el tema, el lenguaje de programación...)
//   nota(frase)           aclaración pequeña debajo de la frase
//   sinIdioma             true si no se muestra el idioma de la frase (fórmulas, código, teclado)
//   ocultarFrase          true si la frase se oculta (con _) y se descubre al escribirla (deletreo)
//   leerSiempre           true si cada frase se lee en voz alta aunque esté apagado en los ajustes
//   textoParaLeer(frase)  lo que se lee en voz alta, si no es la frase
//   sinVoz                true si no tiene sentido leer en voz alta (fórmulas, código)
//   mostrarTeclado        true si se dibuja siempre el teclado en pantalla (lecciones de teclado)
//   alMostrarFrase(frase, api)        se llama al mostrar cada frase nueva
//   alTerminarDeEscribir(frase, api)  se llama al copiar la frase entera;
//                                     si no existe, la frase cuenta como superada sin más
//   alTerminarPartida()               se llama al mostrar el resultado final
// Usa funciones de textos.js, memoria.js, comparar.js, seleccion.js, estadisticas.js, pantallas.js,
// ajustes.js, sonidos.js, voz.js y tecladoVisual.js, que se cargan antes.

// Todo el motor va dentro de una función que se ejecuta al momento, para no llenar el espacio global.
const Motor = (() => {
  // Milisegundos de pausa entre una frase superada y la siguiente.
  const PAUSA_ENTRE_FRASES = 800;
  // Milisegundos de pausa entre perder la última vida y ver el resultado.
  const PAUSA_AL_PERDER = 1400;
  // Máximo de errores que se listan en el repaso final.
  const MAXIMO_EN_REPASO = 12;
  // Máximo de frases falladas que se guardan por modo para repasar.
  const MAXIMO_FALLIDAS = 300;
  // Frases perfectas seguidas que hacen falta para recuperar una vida.
  const RACHA_PARA_VIDA = 5;
  // Teclas que mueven el cursor: las bloqueamos para que siempre se escriba al final.
  const TECLAS_DE_CURSOR = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "PageUp", "PageDown"];
  // Atajos de teclado bloqueados (con Ctrl o Cmd): seleccionar todo, deshacer y rehacer.
  const ATAJOS_BLOQUEADOS = ["a", "z", "y"];
  // Espacio de nombres de los dibujos SVG (para crear los corazones).
  const SVG = "http://www.w3.org/2000/svg";
  // Botones de caracteres para escribir en español con cualquier teclado.
  const TECLAS_ESPANOL = ["á", "é", "í", "ó", "ú", "ü", "ñ", "¿", "¡"];

  // Atajo para no escribir document.getElementById cada vez.
  const $ = (id) => document.getElementById(id);
  // Elementos de la página que usa el motor.
  const el = {
    modo: $("juego-modo"), // nombre del modo que se está jugando
    nivel: $("juego-nivel"), // nivel de dificultad
    vidas: $("juego-vidas"), // corazones de vidas
    completadas: $("juego-completadas"), // contador de frases superadas
    racha: $("juego-racha"), // contador de racha
    rachaCaja: $("juego-racha").closest(".cifra-racha"), // caja de la racha (para encender la llama)
    ppm: $("juego-ppm"), // palabras por minuto
    errores: $("juego-errores"), // contador de errores
    idioma: $("juego-idioma"), // idioma de la frase
    etiqueta: $("juego-etiqueta"), // tema o lenguaje de la frase
    consigna: $("juego-consigna"), // texto encima de la frase (nombre de la fórmula, tarea...)
    nota: $("juego-nota"), // aclaración debajo de la frase
    teclado: $("juego-teclado"), // teclado dibujado en pantalla
    escuchar: $("juego-escuchar"), // botón de escuchar
    fraseVisible: $("juego-frase"), // la frase, letra por letra
    fraseLectores: $("juego-frase-lectores"), // la frase entera para lectores de pantalla
    avance: $("juego-avance"), // barra de avance dentro de la frase
    entrada: $("juego-entrada"), // caja donde se escribe
    mensaje: $("juego-mensaje"), // mensajes de error o de ánimo
    teclas: $("juego-teclas"), // botones de caracteres especiales
    mayus: $("juego-mayus"), // botón de mayúsculas en pantalla
    fuente: $("juego-fuente"), // de dónde viene la frase
    terminar: $("juego-terminar"), // botón para terminar la partida
    finModo: $("fin-modo"), // nombre del modo en la pantalla final
    finTitulo: $("fin-titulo"), // título de la pantalla final
    finCompletadas: $("fin-completadas"), // número grande de frases superadas
    finUnidad: $("fin-unidad"), // "frase" o "frases"
    finPrecision: $("fin-precision"), // porcentaje de acierto al escribir
    finPpm: $("fin-ppm"), // velocidad media
    finRacha: $("fin-racha"), // mejor racha
    finTiempo: $("fin-tiempo"), // duración de la partida
    finLetras: $("fin-letras"), // letras correctas
    finErrores: $("fin-errores"), // errores totales
    finRecord: $("fin-record"), // mejor resultado
    finRepaso: $("fin-repaso"), // lista de errores para repasar
    otraVez: $("fin-otra-vez"), // botón "Jugar otra vez"
    repasar: $("fin-repasar"), // botón "Repasar errores"
    volver: $("fin-volver"), // botón "Volver al menú"
  };

  // Modo que se está jugando (o el último que se jugó).
  let modo = null;
  // Estado de la partida en curso (null mientras no se ha jugado ninguna).
  let partida = null;
  // Frases ya vistas de cada modo: {id del modo: conjunto de números}.
  const usadasPorModo = {};
  // Frases falladas de cada modo, para repasar: {id del modo: conjunto de números}.
  const fallidasPorModo = {};
  // Teclado dibujado en la pantalla de juego.
  const tecladoJuego = TecladoVisual.crear(el.teclado);

  // Crea el estado de una partida nueva.
  //   repaso: true si la partida es solo de frases falladas
  function estadoInicial(repaso) {
    // Vidas según la dificultad (Infinity en práctica).
    const vidas = Ajustes.vidas();
    // Devolvemos un objeto con todos los datos de la partida.
    return {
      vidas, // vidas que quedan
      vidasMaximas: vidas, // vidas con las que se empieza (y máximo al recuperar)
      practica: !Number.isFinite(vidas), // true si las vidas son ilimitadas
      repaso, // true si es una partida de repaso
      completadas: 0, // frases superadas
      letras: 0, // caracteres correctos de las frases copiadas enteras
      errores: 0, // errores totales (al escribir y al elegir el significado)
      erroresEscritura: 0, // errores solo al escribir, para calcular la precisión
      fallos: [], // detalle de cada error, para el repaso final
      frase: null, // frase actual: [número, texto, ...]
      progreso: 0, // caracteres correctos escritos de la frase actual
      erroresEnFrase: 0, // errores en la frase actual
      racha: 0, // frases perfectas seguidas
      mejorRacha: 0, // la racha más larga de la partida
      msEscribiendo: 0, // milisegundos escribiendo (para las palabras por minuto)
      inicioFrase: null, // momento de la primera tecla de la frase actual
      inicio: Date.now(), // momento en que empezó la partida
      vistasRepaso: new Set(), // frases ya repasadas en esta partida de repaso
      repasoCompleto: false, // true si se repasaron todas las frases falladas
      resultado: null, // datos del resultado final (para repintarlo si cambia el idioma)
      esperando: false, // true durante las pausas y preguntas: no se acepta escritura
      terminada: false, // true cuando la partida ya acabó
      temporizador: null, // pausa pendiente, para poder cancelarla
      mayusculas: false, // si el botón "Mayús" de la pantalla está activado
    };
  }

  // Clave con la que se guarda un dato de un modo en el navegador.
  function clave(modoElegido, dato) {
    // Por ejemplo: "frase-exacta:ortografia:usadas".
    return `frase-exacta:${modoElegido.id}:${dato}`;
  }

  // Lee del navegador un conjunto de números de frase de un modo (usadas o fallidas), una sola vez.
  function cargarConjunto(cache, modoElegido, dato) {
    // Solo leemos del navegador la primera vez.
    if (!cache[modoElegido.id]) {
      // Leemos la lista guardada (o una lista vacía si no hay nada).
      const guardadas = Memoria.leer(clave(modoElegido, dato), []);
      // Si lo guardado no es una lista (dato roto), empezamos de cero.
      cache[modoElegido.id] = new Set(Array.isArray(guardadas) ? guardadas : []);
    }
    // Devolvemos el conjunto.
    return cache[modoElegido.id];
  }

  // Conjunto de frases ya vistas de un modo.
  function cargarUsadas(modoElegido) {
    // Lo leemos (o lo tomamos de lo ya leído).
    return cargarConjunto(usadasPorModo, modoElegido, "usadas");
  }

  // Conjunto de frases falladas de un modo.
  function cargarFallidas(modoElegido) {
    // Lo leemos (o lo tomamos de lo ya leído).
    return cargarConjunto(fallidasPorModo, modoElegido, "fallidas");
  }

  // Anota la frase actual como fallada, para poder repasarla después.
  function anotarFallida() {
    // Conjunto de falladas del modo.
    const fallidas = cargarFallidas(modo);
    // La quitamos y la volvemos a poner, para que quede como la más reciente.
    fallidas.delete(partida.frase[0]);
    // La añadimos.
    fallidas.add(partida.frase[0]);
    // Si hay demasiadas, olvidamos las más antiguas (las primeras del conjunto).
    while (fallidas.size > MAXIMO_FALLIDAS) {
      // Borramos la primera.
      fallidas.delete(fallidas.values().next().value);
    }
    // Guardamos en el navegador.
    Memoria.guardar(clave(modo, "fallidas"), [...fallidas]);
  }

  // Quita la frase actual de las falladas (se escribió perfecta).
  function quitarFallida() {
    // Conjunto de falladas del modo.
    const fallidas = cargarFallidas(modo);
    // Si estaba...
    if (fallidas.delete(partida.frase[0])) {
      // ...guardamos el cambio.
      Memoria.guardar(clave(modo, "fallidas"), [...fallidas]);
    }
  }

  // Devuelve las frases falladas de un modo que todavía existen en su lista.
  function frasesFallidas(modoElegido) {
    // Conjunto de números fallados.
    const fallidas = cargarFallidas(modoElegido);
    // Si no hay, la lista está vacía (sin recorrer todas las frases).
    if (fallidas.size === 0) {
      // Lista vacía.
      return [];
    }
    // Frases del modo cuyo número está entre los fallados.
    return modoElegido.frases().filter((frase) => fallidas.has(frase[0]));
  }

  // Devuelve el récord guardado de un modo (0 si no hay).
  function leerRecord(modoElegido) {
    // Leemos el valor guardado.
    const record = Memoria.leer(clave(modoElegido, "record"), 0);
    // Si no es un número válido, contamos como 0.
    return Number.isFinite(record) ? record : 0;
  }

  // Cuenta cuántas frases de un modo todavía no han salido.
  function frasesSinVer(modoElegido) {
    // Conjunto de frases ya vistas.
    const vistas = cargarUsadas(modoElegido);
    // Contamos las frases cuyo número no está entre las vistas.
    return modoElegido.frases().filter((frase) => !vistas.has(frase[0])).length;
  }

  // Empieza una partida nueva del modo indicado.
  //   opciones.repaso: true para jugar solo las frases falladas
  function jugar(modoElegido, opciones = {}) {
    // Si quedaba una pausa pendiente de otra partida, la cancelamos.
    cancelarPausa();
    // Si se estaba leyendo una frase en voz alta, la cortamos.
    Voz.callar();
    // Guardamos el modo elegido.
    modo = modoElegido;
    // Creamos el estado de la nueva partida.
    partida = estadoInicial(Boolean(opciones.repaso));
    // El botón de escuchar solo aparece si el navegador sabe leer en voz alta y el modo lo usa.
    el.escuchar.hidden = !Voz.disponible() || Boolean(modo.sinVoz);
    // El idioma de la frase solo se muestra en los modos de idiomas.
    el.idioma.hidden = Boolean(modo.sinIdioma);
    // Mostramos u ocultamos el teclado en pantalla.
    el.teclado.hidden = !tecladoVisible();
    // Quitamos las animaciones de error de la partida anterior (si no, se repetirían al volver a mostrarse).
    el.entrada.classList.remove("con-error");
    // Lo mismo con la sacudida de la frase.
    el.fraseVisible.classList.remove("sacudida");
    // Dejamos el botón de mayúsculas apagado.
    ponerMayusculas(false);
    // Nombre del modo en el marcador.
    pintarEtiquetaModo();
    // Mostramos la pantalla de juego.
    mostrarPantalla("pantalla-juego");
    // Dibujamos las vidas llenas.
    pintarVidas(null);
    // Ponemos los contadores a cero.
    pintarMarcador();
    // Sacamos la primera frase.
    siguienteFrase();
  }

  // Cancela la pausa pendiente, si la hay.
  function cancelarPausa() {
    // Solo si hay partida y tiene una pausa programada.
    if (partida && partida.temporizador !== null) {
      // Cancelamos la pausa.
      clearTimeout(partida.temporizador);
      // Anotamos que ya no hay pausa pendiente.
      partida.temporizador = null;
    }
  }

  // Programa la siguiente frase tras una pausa.
  function programarSiguiente(pausa) {
    // Guardamos el temporizador para poder cancelarlo si la partida termina antes.
    partida.temporizador = setTimeout(siguienteFrase, pausa);
  }

  // Elige la siguiente frase: de las falladas en un repaso, o una nueva sin repetir.
  // Devuelve { frase, aviso }, o null si un repaso ya no tiene más frases.
  function elegirSiguiente() {
    // En un repaso...
    if (partida.repaso) {
      // ...elegimos entre las falladas que no hayan salido en esta partida.
      const frase = elegirFrase(frasesFallidas(modo), partida.vistasRepaso, partida.completadas);
      // Si no queda ninguna, el repaso terminó.
      if (frase === null) {
        // Avisamos con null.
        return null;
      }
      // La anotamos para no repetirla en este repaso.
      partida.vistasRepaso.add(frase[0]);
      // Devolvemos la frase.
      return { frase, aviso: "" };
    }
    // Lista de frases del modo.
    const lista = modo.frases();
    // Conjunto de frases ya vistas de este modo.
    const vistas = cargarUsadas(modo);
    // Elegimos una frase nueva del largo que toca.
    let frase = elegirFrase(lista, vistas, partida.completadas);
    // Mensaje opcional para la persona (vacío normalmente).
    let aviso = "";
    // Si ya salieron todas las frases...
    if (frase === null) {
      // ...olvidamos las vistas para empezar la lista otra vez...
      vistas.clear();
      // ...elegimos de nuevo...
      frase = elegirFrase(lista, vistas, partida.completadas);
      // ...y lo avisamos.
      aviso = t("juego.listaReiniciada");
    }
    // Marcamos esta frase como vista para que no se repita.
    vistas.add(frase[0]);
    // Guardamos la lista de vistas en el navegador.
    Memoria.guardar(clave(modo, "usadas"), [...vistas]);
    // Devolvemos la frase y el aviso.
    return { frase, aviso };
  }

  // Elige y muestra la siguiente frase.
  function siguienteFrase() {
    // La pausa que nos trajo aquí (si la hubo) ya terminó.
    partida.temporizador = null;
    // Elegimos la frase.
    const eleccion = elegirSiguiente();
    // Si un repaso ya no tiene frases...
    if (eleccion === null) {
      // ...lo anotamos...
      partida.repasoCompleto = true;
      // ...y terminamos la partida.
      terminarPartida(0);
      // No hay más que hacer.
      return;
    }
    // Guardamos la frase en la partida.
    partida.frase = eleccion.frase;
    // Todavía no hay nada escrito de esta frase.
    partida.progreso = 0;
    // Ni errores en ella.
    partida.erroresEnFrase = 0;
    // Ni se ha empezado a escribir.
    partida.inicioFrase = null;
    // Ya se puede escribir.
    partida.esperando = false;
    // Vaciamos la caja de texto.
    el.entrada.value = "";
    // Dejamos escribir en ella.
    el.entrada.readOnly = false;
    // Idioma de esta frase.
    aplicarIdioma();
    // Texto de encima, etiqueta y nota.
    pintarConsigna();
    // Botones de caracteres especiales que necesita esta frase.
    pintarTeclas();
    // Dibujamos la frase.
    pintarFrase();
    // Mostramos de dónde viene.
    pintarFuente();
    // Mostramos el nivel de dificultad.
    pintarNivel();
    // Mostramos el aviso, si lo hay.
    mostrarMensaje(eleccion.aviso, eleccion.aviso ? "aviso" : "");
    // Ponemos el cursor en la caja de texto.
    el.entrada.focus();
    // Si está activado (o el modo lo pide siempre), leemos la frase en voz alta.
    if ((Ajustes.valor("voz") || modo.leerSiempre) && !modo.sinVoz) {
      // La leemos en su idioma.
      leerFrase();
    }
    // Si el modo quiere hacer algo más (mostrar la traducción, hacer una pregunta...), se lo pedimos.
    if (modo.alMostrarFrase) {
      // Llamamos al modo con la frase nueva y las herramientas para seguir la partida.
      modo.alMostrarFrase(partida.frase, crearApi());
    }
  }

  // Idioma de la frase actual (algunos modos cambian de idioma en cada frase).
  function idiomaFrase() {
    // Si el modo lo da por frase, ese; si no, el del modo.
    return modo.idiomaDe ? modo.idiomaDe(partida.frase) : modo.idioma;
  }

  // Indica el idioma de la frase (ayuda a los lectores de pantalla, a la voz y a los teclados del móvil).
  function aplicarIdioma() {
    // Idioma de la frase.
    const idioma = idiomaFrase();
    // En la frase visible.
    el.fraseVisible.lang = idioma;
    // En la copia para lectores de pantalla.
    el.fraseLectores.lang = idioma;
    // En la caja de texto.
    el.entrada.lang = idioma;
    // Etiqueta del idioma (ES o EN).
    el.idioma.textContent = idioma.toUpperCase();
  }

  // Lee en voz alta la frase actual (o lo que el modo diga que hay que leer).
  function leerFrase() {
    // Texto que se lee.
    const texto = modo.textoParaLeer ? modo.textoParaLeer(partida.frase) : partida.frase[1];
    // Lo leemos en el idioma de la frase.
    Voz.decir(texto, idiomaFrase());
  }

  // Escribe el texto de encima de la frase, la etiqueta y la nota (si el modo los tiene).
  function pintarConsigna() {
    // Texto de encima (por ejemplo, el nombre de una fórmula).
    const consigna = modo.consigna ? modo.consigna(partida.frase) : "";
    // Lo ponemos.
    el.consigna.textContent = consigna;
    // Solo se ve si hay texto.
    el.consigna.hidden = !consigna;
    // Etiqueta (por ejemplo, el tema o el lenguaje).
    const etiqueta = modo.etiqueta ? modo.etiqueta(partida.frase) : "";
    // La ponemos.
    el.etiqueta.textContent = etiqueta;
    // Solo se ve si hay texto.
    el.etiqueta.hidden = !etiqueta;
    // Nota (por ejemplo, cómo se dice en otros países).
    const nota = modo.nota ? modo.nota(partida.frase) : "";
    // La ponemos.
    el.nota.textContent = nota;
    // Solo se ve si hay texto.
    el.nota.hidden = !nota;
  }

  // Crea los botones de caracteres especiales que necesita la frase actual.
  function pintarTeclas() {
    // Lo que pide el modo (puede depender de la frase).
    const pedidas = typeof modo.teclas === "function" ? modo.teclas(partida.frase) : modo.teclas;
    // "es" son los caracteres del español; una lista, esos caracteres; nada, ningún botón.
    const caracteres = pedidas === "es" ? TECLAS_ESPANOL : Array.isArray(pedidas) ? pedidas : [];
    // Botones nuevos.
    const botones = caracteres.map((caracter) => {
      // Botón.
      const boton = document.createElement("button");
      // Botón normal, no de formulario.
      boton.type = "button";
      // Carácter que escribe.
      boton.dataset.caracter = caracter;
      // Lo que se ve.
      boton.textContent = caracter;
      // Devolvemos el botón.
      return boton;
    });
    // Con las letras del español (que pueden ir en mayúscula), añadimos el botón de mayúsculas.
    if (pedidas === "es") {
      // El botón de mayúsculas va al final.
      botones.push(el.mayus);
    }
    // Ponemos los botones en la fila.
    el.teclas.replaceChildren(...botones);
    // La fila se oculta si no hay botones.
    el.teclas.hidden = botones.length === 0;
    // Mayúsculas apagadas.
    ponerMayusculas(false);
  }

  // ¿Se dibuja el teclado en pantalla? (Siempre en las lecciones; en el resto, si se pide en los ajustes).
  function tecladoVisible() {
    // Lo pide el modo o los ajustes.
    return Boolean(modo && modo.mostrarTeclado) || Ajustes.valor("tecladoEnPantalla");
  }

  // Se ejecuta cada vez que cambia el texto de la caja.
  function alEscribir(evento) {
    // Mientras el teclado está componiendo un carácter (por ejemplo ´ + a), esperamos a que termine.
    if (evento && evento.isComposing) {
      // No revisamos todavía.
      return;
    }
    // Si no hay partida o estamos en una pausa, no hacemos nada.
    if (!partida || partida.esperando) {
      // Salimos sin revisar.
      return;
    }
    // Si es la primera tecla de la frase, empezamos a contar el tiempo.
    if (partida.inicioFrase === null && el.entrada.value.length > 0) {
      // Momento actual, en milisegundos.
      partida.inicioFrase = performance.now();
    }
    // Texto de la frase que hay que copiar.
    const texto = partida.frase[1];
    // Comparamos lo escrito con la frase.
    const resultado = revisarEscritura(texto, el.entrada.value);
    // ¿Se avanzó algo desde la última vez? (para el sonido de tecla)
    const avanzo = resultado.aciertos > partida.progreso;
    // Actualizamos cuántos caracteres van bien.
    partida.progreso = resultado.aciertos;
    // Si hay un error...
    if (resultado.estado === "error") {
      // ...dejamos en la caja solo la parte correcta, para seguir desde ahí...
      el.entrada.value = texto.slice(0, resultado.aciertos);
      // ...actualizamos los colores de la frase...
      marcarProgreso();
      // ...y lo tratamos como error de escritura.
      errorDeEscritura(resultado);
      // No hay nada más que hacer con este cambio.
      return;
    }
    // Sin error: actualizamos los colores de la frase.
    marcarProgreso();
    // Si se avanzó, suena la tecla (si está activado).
    if (avanzo) {
      // Clic de máquina de escribir.
      Sonidos.reproducir("tecla");
    }
    // Si la frase está completa, la damos por escrita.
    if (resultado.estado === "completa") {
      // Celebramos y seguimos.
      fraseEscrita();
      // Terminamos aquí.
      return;
    }
    // Si quedaba un mensaje de error o aviso a la vista, lo borramos: ya va bien.
    if (el.mensaje.dataset.tipo === "error" || el.mensaje.dataset.tipo === "aviso") {
      // Vaciamos el mensaje.
      mostrarMensaje("", "");
    }
  }

  // Trata un carácter equivocado: explica el error, anima la frase y quita una vida.
  function errorDeEscritura(resultado) {
    // Un error de escritura más en total.
    partida.erroresEscritura++;
    // Buscamos la palabra donde ocurrió el error, para el repaso final.
    const { palabra, inicio } = palabraEn(partida.frase[1], resultado.aciertos);
    // Explicación del error con palabras sencillas, en el idioma de la interfaz.
    const explicacion = explicarError(resultado.esperado, resultado.recibido, idiomaActual());
    // Sacudimos la frase.
    reiniciarAnimacion(el.fraseVisible, "sacudida");
    // Ponemos el borde de la caja en rojo un momento.
    reiniciarAnimacion(el.entrada, "con-error");
    // Buscamos la letra de la frase donde se falló.
    const letra = el.fraseVisible.children[resultado.aciertos];
    // Si existe (no existe si se escribió de más al final)...
    if (letra) {
      // ...la hacemos parpadear en rojo.
      reiniciarAnimacion(letra, "fallo");
    }
    // Quitamos la vida y guardamos el detalle para el repaso.
    quitarVida(
      {
        palabra, // palabra correcta
        marca: resultado.aciertos - inicio, // posición del error dentro de la palabra
        espacio: resultado.esperado === " ", // si lo que faltaba era un espacio
        explicacion, // explicación del error
      },
      // El mensaje que se ve bajo la caja es la misma explicación.
      explicacion,
    );
  }

  // Quita una vida (salvo en práctica), guarda el error para el repaso y lo explica.
  // Devuelve true si la partida sigue y false si se acabaron las vidas.
  function quitarVida(fallo, mensaje) {
    // Un error más en total.
    partida.errores++;
    // Uno más en esta frase.
    partida.erroresEnFrase++;
    // La racha de frases perfectas se rompe.
    partida.racha = 0;
    // Guardamos el detalle del error, con la frase entera y su idioma (para escucharla en el repaso).
    partida.fallos.push({ ...fallo, frase: partida.frase[1], idioma: idiomaFrase(), voz: !modo.sinVoz });
    // Anotamos la frase para repasarla otro día.
    anotarFallida();
    // Suena el error.
    Sonidos.reproducir("error");
    // En práctica no se pierden vidas.
    if (!partida.practica) {
      // Una vida menos.
      partida.vidas--;
    }
    // Redibujamos las vidas, animando el corazón que se pierde.
    pintarVidas("rota");
    // Actualizamos los contadores.
    pintarMarcador();
    // Explicamos qué pasó.
    mostrarMensaje(mensaje, "error");
    // Si ya no quedan vidas...
    if (partida.vidas <= 0) {
      // ...terminamos tras una pausa para que se vea el último error...
      terminarPartida(PAUSA_AL_PERDER);
      // ...y avisamos de que la partida no sigue.
      return false;
    }
    // Quedan vidas: la partida sigue.
    return true;
  }

  // Se ejecuta al copiar la frase entera.
  function fraseEscrita() {
    // Bloqueamos la escritura mientras tanto.
    partida.esperando = true;
    // Sumamos el tiempo que se tardó en escribirla.
    sumarTiempo();
    // Sumamos sus caracteres a las letras correctas.
    partida.letras += partida.frase[1].length;
    // Los caracteres de esta frase ya están contados.
    partida.progreso = 0;
    // La caja queda de solo lectura (sin perder el foco).
    el.entrada.readOnly = true;
    // Iluminamos la frase.
    reiniciarAnimacion(el.fraseVisible, "lograda");
    // Actualizamos la velocidad en el marcador.
    pintarMarcador();
    // ¿Se escribió sin ningún error?
    const sinErrores = partida.erroresEnFrase === 0;
    // Si el modo tiene un paso más (por ejemplo, la pregunta de significado)...
    if (modo.alTerminarDeEscribir) {
      // ...se lo pasamos, con las herramientas para seguir la partida.
      modo.alTerminarDeEscribir(partida.frase, crearApi());
      // Si no...
    } else {
      // ...la frase cuenta como superada.
      superarFrase(t(sinErrores ? "juego.perfecta" : "juego.completada"));
    }
  }

  // Suma al tiempo de escritura lo que se tardó desde la primera tecla de la frase.
  function sumarTiempo() {
    // Solo si se llegó a escribir algo.
    if (partida.inicioFrase !== null) {
      // Sumamos los milisegundos.
      partida.msEscribiendo += performance.now() - partida.inicioFrase;
      // Ya está contado.
      partida.inicioFrase = null;
    }
  }

  // Cuenta la frase como superada, actualiza la racha y prepara la siguiente.
  function superarFrase(mensaje) {
    // Una frase más superada.
    partida.completadas++;
    // Mensaje que se mostrará (puede cambiar si se recupera una vida).
    let texto = mensaje;
    // Efecto de sonido que toca.
    let efecto = "bien";
    // Si no hubo ningún error en la frase...
    if (partida.erroresEnFrase === 0) {
      // ...la racha crece...
      partida.racha++;
      // ...guardamos la mejor...
      partida.mejorRacha = Math.max(partida.mejorRacha, partida.racha);
      // ...y la frase ya no está pendiente de repaso.
      quitarFallida();
      // Cada RACHA_PARA_VIDA perfectas seguidas, si falta alguna vida, se recupera una.
      if (partida.racha % RACHA_PARA_VIDA === 0 && partida.vidas < partida.vidasMaximas) {
        // Una vida más.
        partida.vidas++;
        // Dibujamos el corazón que vuelve.
        pintarVidas("ganada");
        // Lo celebramos.
        texto = t("juego.vidaExtra", { n: RACHA_PARA_VIDA });
        // Con su sonido.
        efecto = "vida";
      }
    }
    // Suena el efecto.
    Sonidos.reproducir(efecto);
    // Actualizamos los contadores.
    pintarMarcador();
    // Mensaje de ánimo.
    mostrarMensaje(texto, "bien");
    // Tras una pausa corta, sacamos la siguiente frase.
    programarSiguiente(PAUSA_ENTRE_FRASES);
  }

  // Herramientas que reciben los modos (en alMostrarFrase y alTerminarDeEscribir) para seguir la partida.
  // Solo funcionan mientras siga la misma partida (si ya terminó, no hacen nada).
  function crearApi() {
    // Partida a la que pertenecen estas herramientas.
    const estaPartida = partida;
    // Frase a la que pertenecen.
    const estaFrase = partida.frase;
    // Comprueba que la partida y la frase siguen siendo estas y la partida no ha terminado.
    const vigente = () => partida === estaPartida && partida.frase === estaFrase && !estaPartida.terminada;
    // Devolvemos las herramientas.
    return {
      // Si la frase va sin ningún error (se mira en el momento de preguntarlo).
      get sinErrores() {
        // Sin errores en la frase.
        return estaPartida.erroresEnFrase === 0;
      },
      // Tapa la frase y bloquea la escritura (para preguntar antes de escribir).
      tapar() {
        // Solo si la partida sigue.
        if (vigente()) {
          // No se puede escribir.
          partida.esperando = true;
          // La caja queda de solo lectura.
          el.entrada.readOnly = true;
          // La frase se ve borrosa.
          el.fraseVisible.classList.add("tapada");
          // Los lectores de pantalla leen el texto de encima, no la respuesta.
          el.fraseLectores.textContent = el.consigna.textContent;
          // Quitamos el cursor y la señal del teclado.
          marcarProgreso();
        }
      },
      // Destapa la frase y deja escribir.
      destapar() {
        // Solo si la partida sigue.
        if (vigente()) {
          // Ya se puede escribir.
          partida.esperando = false;
          // La caja deja de ser de solo lectura.
          el.entrada.readOnly = false;
          // La frase se ve nítida.
          el.fraseVisible.classList.remove("tapada");
          // Los lectores de pantalla leen la frase.
          el.fraseLectores.textContent = partida.frase[1];
          // Cursor al principio y señal del teclado.
          marcarProgreso();
          // El cursor vuelve a la caja.
          el.entrada.focus();
        }
      },
      // Cuenta la frase como superada y pasa a la siguiente.
      superar(mensaje) {
        // Solo si la partida sigue.
        if (vigente()) {
          // La damos por superada.
          superarFrase(mensaje);
        }
      },
      // Quita una vida; devuelve true si la partida sigue.
      fallar(fallo, mensaje) {
        // Si la partida ya no sigue, no hacemos nada.
        return vigente() ? quitarVida(fallo, mensaje) : false;
      },
      // Pasa a la siguiente frase sin contar esta, tras una pausa.
      siguiente(pausa = PAUSA_ENTRE_FRASES) {
        // Solo si la partida sigue.
        if (vigente()) {
          // Programamos la siguiente frase.
          programarSiguiente(pausa);
        }
      },
      // Muestra un mensaje bajo la caja de texto.
      mensaje(texto, tipo) {
        // Solo si la partida sigue.
        if (vigente()) {
          // Mostramos el mensaje.
          mostrarMensaje(texto, tipo);
        }
      },
    };
  }

  // Termina la partida y prepara la pantalla de resultados.
  function terminarPartida(pausa) {
    // Si no hay partida o ya había terminado, no hacemos nada.
    if (!partida || partida.terminada) {
      // Salimos.
      return;
    }
    // Cancelamos la pausa pendiente (por ejemplo, la de pasar a la siguiente frase).
    cancelarPausa();
    // Cortamos la voz, si estaba leyendo.
    Voz.callar();
    // Marcamos la partida como terminada.
    partida.terminada = true;
    // Bloqueamos la escritura.
    partida.esperando = true;
    // La caja queda de solo lectura.
    el.entrada.readOnly = true;
    // Contamos también el tiempo de la frase a medias.
    sumarTiempo();
    // Letras correctas: las de frases copiadas enteras más las de la frase a medias.
    const letras = partida.letras + partida.progreso;
    // Total de pulsaciones revisadas: correctas más errores de escritura.
    const total = letras + partida.erroresEscritura;
    // Porcentaje de acierto al escribir, redondeado (100 si no se escribió nada).
    const precision = total === 0 ? 100 : Math.round((letras / total) * 100);
    // Velocidad media.
    const ppm = palabrasPorMinuto(letras, partida.msEscribiendo);
    // Duración de la partida, en segundos.
    const segundos = (Date.now() - partida.inicio) / 1000;
    // El récord solo cuenta en partidas normales (ni práctica ni repaso).
    const cuentaRecord = !partida.practica && !partida.repaso;
    // Récord anterior de este modo.
    const recordAnterior = leerRecord(modo);
    // ¿Esta partida supera el récord?
    const esRecord = cuentaRecord && partida.completadas > recordAnterior;
    // Si lo supera, lo guardamos.
    if (esRecord) {
      // Guardamos el nuevo récord.
      Memoria.guardar(clave(modo, "record"), partida.completadas);
    }
    // Anotamos la partida en las estadísticas (días seguidos, totales, mejores marcas).
    Estadisticas.registrar({ id: modo.id, frases: partida.completadas, letras, segundos, ppm, racha: partida.mejorRacha });
    // Guardamos el resultado para pintarlo (y repintarlo si cambia el idioma).
    partida.resultado = { letras, precision, ppm, segundos, esRecord, record: cuentaRecord ? Math.max(recordAnterior, partida.completadas) : recordAnterior };
    // Pintamos la pantalla final.
    pintarResultado();
    // Modo que se estaba jugando (por si cambia antes de que acabe la pausa).
    const modoTerminado = modo;
    // Partida que termina (por si empieza otra antes de que acabe la pausa).
    const partidaTerminada = partida;
    // Tras la pausa indicada, mostramos los resultados.
    partida.temporizador = setTimeout(() => {
      // La pausa terminó.
      partidaTerminada.temporizador = null;
      // Si el modo tiene algo que recoger (por ejemplo, la pregunta), se lo pedimos.
      if (modoTerminado.alTerminarPartida) {
        // Llamamos al modo.
        modoTerminado.alTerminarPartida();
      }
      // Mostramos la pantalla final.
      mostrarPantalla("pantalla-fin");
      // Suena la fanfarria del récord o el final.
      Sonidos.reproducir(esRecord ? "record" : "fin");
      // Ponemos el foco en "Jugar otra vez" para poder seguir con Enter.
      el.otraVez.focus();
    }, pausa);
  }

  // Escribe en la pantalla final los datos del resultado (en el idioma actual).
  function pintarResultado() {
    // Datos del resultado.
    const r = partida.resultado;
    // Nombre del modo en la pantalla final.
    el.finModo.textContent = t("fin.modo", { modo: nombreModo() });
    // Título de la pantalla final según cómo terminó.
    el.finTitulo.textContent = t(
      // Repaso de todas las falladas.
      partida.repasoCompleto ? "fin.repasoTerminado"
        // Récord batido.
        : r.esRecord ? "fin.record"
        // Práctica.
        : partida.practica ? "fin.practica"
        // Cualquier otro caso.
        : "fin.titulo",
    );
    // Si es récord, el título da un salto.
    el.finTitulo.classList.toggle("es-record", r.esRecord);
    // Número grande de frases superadas.
    el.finCompletadas.textContent = partida.completadas;
    // "frase" en singular o "frases" en plural.
    el.finUnidad.textContent = t("fin.unidad", { n: partida.completadas });
    // Precisión, con espacio antes del signo de porcentaje, como recomienda la RAE.
    el.finPrecision.textContent = `${r.precision} %`;
    // Velocidad media.
    el.finPpm.textContent = r.ppm;
    // Mejor racha.
    el.finRacha.textContent = partida.mejorRacha;
    // Duración, como un reloj.
    el.finTiempo.textContent = formatearReloj(r.segundos);
    // Letras correctas.
    el.finLetras.textContent = r.letras;
    // Errores.
    el.finErrores.textContent = partida.errores;
    // Mejor resultado hasta ahora.
    el.finRecord.textContent = r.record;
    // Frases falladas que quedan por repasar en este modo.
    const pendientes = frasesFallidas(modo).length;
    // El botón de repasar solo aparece si hay alguna.
    el.repasar.hidden = pendientes === 0;
    // Texto del botón, con cuántas hay.
    el.repasar.textContent = t("fin.repasar", { n: pendientes });
    // Lista de errores para repasar.
    pintarRepaso();
  }

  // Nombre del modo en el idioma de la interfaz.
  function nombreModo() {
    // Por ejemplo "modo.ingles.nombre" -> "Inglés" o "English".
    return t(`modo.${modo.id}.nombre`);
  }

  // Escribe en el marcador el nombre del modo (y si es repaso o práctica).
  function pintarEtiquetaModo() {
    // Partes de la etiqueta.
    const partes = [nombreModo()];
    // Si es un repaso, lo indicamos.
    if (partida.repaso) {
      // "Repaso".
      partes.push(t("juego.repaso"));
    }
    // Si es práctica, también.
    if (partida.practica) {
      // "Práctica".
      partes.push(t("juego.practica"));
    }
    // Las unimos con un punto medio.
    el.modo.textContent = partes.join(" · ");
  }

  // Escribe el nivel de dificultad que toca (frases cortas, medianas o largas).
  function pintarNivel() {
    // Nivel 1, 2 o 3.
    const nivel = nivelSegunProgreso(partida.completadas);
    // Por ejemplo "Nivel 2 · frases medianas".
    el.nivel.textContent = `${t("juego.nivel", { n: nivel })} · ${t(`juego.nivel.${nivel}`)}`;
  }

  // Dibuja la frase actual, cada carácter en su propia caja.
  function pintarFrase() {
    // Texto de la frase.
    const texto = partida.frase[1];
    // ¿La frase se oculta hasta escribirla? (deletreo)
    const oculta = Boolean(modo.ocultarFrase);
    // Copia completa para lectores de pantalla (si está oculta, la pista de encima).
    el.fraseLectores.textContent = oculta ? el.consigna.textContent : texto;
    // Fragmento donde vamos montando las letras antes de ponerlas en la página.
    const fragmento = document.createDocumentFragment();
    // Recorremos la frase carácter por carácter.
    for (const caracter of texto) {
      // Creamos una caja para el carácter.
      const letra = document.createElement("span");
      // Guardamos el carácter de verdad (para descubrirlo si está oculto).
      letra.dataset.c = caracter;
      // Si está oculta, se ve una raya baja (los espacios se ven como espacios).
      letra.textContent = oculta && caracter !== " " ? "_" : caracter;
      // Marcamos las ocultas para el estilo.
      letra.classList.toggle("oculta", oculta && caracter !== " ");
      // Añadimos la caja al fragmento.
      fragmento.append(letra);
    }
    // Quitamos de la frase anterior las animaciones y el tapado.
    el.fraseVisible.classList.remove("lograda", "tapada");
    // Marcamos si la frase está oculta (para separar las rayas).
    el.fraseVisible.classList.toggle("frase-oculta", oculta);
    // Cambiamos la frase anterior por la nueva.
    el.fraseVisible.replaceChildren(fragmento);
    // Marcamos el cursor al principio.
    marcarProgreso();
  }

  // Colorea las letras ya escritas, marca dónde va el cursor y mueve la barra de avance.
  function marcarProgreso() {
    // Lista de cajas de letras.
    const letras = el.fraseVisible.children;
    // Recorremos todas.
    for (let i = 0; i < letras.length; i++) {
      // Las anteriores al progreso están hechas.
      letras[i].classList.toggle("hecha", i < partida.progreso);
      // La del progreso es la que toca escribir ahora (si la frase ya está entera, ninguna).
      letras[i].classList.toggle("actual", i === partida.progreso && !partida.esperando);
      // Las letras ocultas ya escritas se descubren.
      if (i < partida.progreso && letras[i].classList.contains("oculta")) {
        // Ponemos el carácter de verdad.
        letras[i].textContent = letras[i].dataset.c;
        // Ya no está oculta.
        letras[i].classList.remove("oculta");
      }
    }
    // Ancho de la barra: lo escrito entre el largo de la frase.
    el.avance.style.width = `${(partida.progreso / Math.max(1, letras.length)) * 100}%`;
    // Si se ve el teclado, señalamos la siguiente tecla (nada si no se puede escribir ahora).
    if (!el.teclado.hidden) {
      // Siguiente carácter de la frase.
      tecladoJuego.resaltar(partida.esperando ? null : [...partida.frase[1]][partida.progreso] || null);
    }
  }

  // Crea el dibujo de un corazón.
  function crearCorazon() {
    // Dibujo SVG.
    const dibujo = document.createElementNS(SVG, "svg");
    // Zona de dibujo de 24 × 24.
    dibujo.setAttribute("viewBox", "0 0 24 24");
    // Reutiliza el corazón definido en index.html.
    const uso = document.createElementNS(SVG, "use");
    // Enlace al dibujo.
    uso.setAttribute("href", "#i-corazon");
    // Lo metemos en el dibujo.
    dibujo.append(uso);
    // Devolvemos el dibujo.
    return dibujo;
  }

  // Dibuja los corazones de vidas.
  //   animacion: "rota" (se pierde una), "ganada" (se recupera una) o null
  function pintarVidas(animacion) {
    // Quitamos los corazones anteriores.
    el.vidas.replaceChildren();
    // En práctica no hay corazones: mostramos el símbolo de infinito.
    if (partida.practica) {
      // Caja del símbolo.
      const infinito = document.createElement("span");
      // Clase para el estilo.
      infinito.className = "vidas-infinitas";
      // Símbolo.
      infinito.textContent = "∞";
      // Lo ponemos.
      el.vidas.append(infinito);
      // Texto para lectores de pantalla.
      el.vidas.setAttribute("aria-label", t("juego.vidasInfinitas"));
      // No hay más que dibujar.
      return;
    }
    // Creamos uno por cada vida máxima.
    for (let i = 0; i < partida.vidasMaximas; i++) {
      // Dibujo del corazón.
      const corazon = crearCorazon();
      // Clase base.
      corazon.classList.add("vida");
      // Los que pasan del número de vidas que quedan están perdidos.
      if (i >= partida.vidas) {
        // Corazón apagado.
        corazon.classList.add("perdida");
      }
      // El que se acaba de perder se anima.
      if (animacion === "rota" && i === partida.vidas) {
        // Animación de corazón roto.
        corazon.classList.add("rota");
      }
      // El que se acaba de recuperar, también.
      if (animacion === "ganada" && i === partida.vidas - 1) {
        // Animación de corazón que vuelve.
        corazon.classList.add("ganada");
      }
      // Lo añadimos a la fila.
      el.vidas.append(corazon);
    }
    // Texto para lectores de pantalla.
    el.vidas.setAttribute("aria-label", t("juego.vidas", { n: partida.vidas, total: partida.vidasMaximas }));
  }

  // Actualiza los contadores de frases, racha, velocidad y errores.
  function pintarMarcador() {
    // Frases superadas.
    el.completadas.textContent = partida.completadas;
    // Racha.
    el.racha.textContent = partida.racha;
    // La llama se enciende con dos o más frases perfectas seguidas.
    el.rachaCaja.classList.toggle("encendida", partida.racha >= 2);
    // Velocidad (una raya hasta terminar la primera frase).
    el.ppm.textContent = partida.msEscribiendo > 0 ? palabrasPorMinuto(partida.letras, partida.msEscribiendo) : "–";
    // Errores.
    el.errores.textContent = partida.errores;
  }

  // Muestra el número y el autor de cada frase usada, con enlace a Tatoeba (lo pide su licencia).
  function pintarFuente() {
    // Vaciamos el párrafo.
    el.fuente.replaceChildren();
    // Recorremos los créditos que da el modo (en inglés y español son dos: la frase y su traducción;
    // en los contenidos propios del proyecto, ninguno).
    modo.creditos(partida.frase).forEach(([etiqueta, numero, autor], posicion) => {
      // A partir del segundo, los separamos con un punto medio.
      if (posicion > 0) {
        // Separador.
        el.fuente.append(" · ");
      }
      // Creamos el enlace.
      const enlace = document.createElement("a");
      // Dirección de la frase en Tatoeba, en el idioma de la interfaz.
      enlace.href = `https://tatoeba.org/${idiomaActual()}/sentences/show/${numero}`;
      // Se abre en otra pestaña para no perder la partida.
      enlace.target = "_blank";
      // Por seguridad, la otra pestaña no puede controlar esta.
      enlace.rel = "noopener noreferrer";
      // Texto del enlace.
      enlace.textContent = t("fuente.enlace", { etiqueta: t(etiqueta), numero });
      // Ponemos el enlace y, si hay autor, su nombre.
      el.fuente.append(enlace, autor ? t("fuente.autor", { autor }) : "");
    });
  }

  // Escribe un mensaje bajo la caja de texto.
  // tipo puede ser "error", "bien", "aviso" o "" (sin color).
  function mostrarMensaje(texto, tipo) {
    // Ponemos el texto.
    el.mensaje.textContent = texto;
    // Guardamos el tipo para que el CSS le dé color.
    el.mensaje.dataset.tipo = tipo;
  }

  // Vuelve a lanzar una animación CSS aunque ya se hubiera usado.
  function reiniciarAnimacion(elemento, claseAnimacion) {
    // Quitamos la clase.
    elemento.classList.remove(claseAnimacion);
    // Pedimos el tamaño para obligar al navegador a aplicar el cambio antes de seguir.
    void elemento.getBoundingClientRect();
    // Volvemos a poner la clase: la animación empieza de nuevo.
    elemento.classList.add(claseAnimacion);
  }

  // Crea un botón pequeño para escuchar una frase del repaso.
  function botonEscuchar(texto, idioma) {
    // Botón.
    const boton = document.createElement("button");
    // Botón normal, no de formulario.
    boton.type = "button";
    // Clases para el estilo.
    boton.className = "boton-icono boton-pequeno";
    // Ayuda al pasar el ratón.
    boton.title = t("fin.escuchar");
    // Texto para lectores de pantalla.
    boton.setAttribute("aria-label", t("fin.escuchar"));
    // Dibujo del altavoz.
    const dibujo = document.createElementNS(SVG, "svg");
    // Zona de dibujo.
    dibujo.setAttribute("viewBox", "0 0 24 24");
    // Los lectores de pantalla lo ignoran.
    dibujo.setAttribute("aria-hidden", "true");
    // Reutiliza el altavoz de index.html.
    const uso = document.createElementNS(SVG, "use");
    // Enlace al dibujo.
    uso.setAttribute("href", "#i-altavoz");
    // Lo metemos en el dibujo.
    dibujo.append(uso);
    // Y el dibujo en el botón.
    boton.append(dibujo);
    // Al pulsarlo, leemos la frase.
    boton.addEventListener("click", () => Voz.decir(texto, idioma));
    // Devolvemos el botón.
    return boton;
  }

  // Dibuja la lista de errores para repasar en la pantalla final.
  function pintarRepaso() {
    // Vaciamos la lista anterior.
    el.finRepaso.replaceChildren();
    // Claves de los errores ya listados, para no repetir el mismo dos veces.
    const vistos = new Set();
    // Errores sin repetir.
    const unicos = [];
    // Recorremos todos los errores de la partida.
    for (const fallo of partida.fallos) {
      // Clave que identifica el error: palabra, posición y explicación.
      const claveFallo = `${fallo.palabra}|${fallo.marca}|${fallo.explicacion}`;
      // Si es nuevo...
      if (!vistos.has(claveFallo)) {
        // ...lo recordamos...
        vistos.add(claveFallo);
        // ...y lo añadimos a la lista.
        unicos.push(fallo);
      }
    }
    // Si no hubo errores, lo celebramos.
    if (unicos.length === 0) {
      // Elemento de la lista.
      const item = document.createElement("li");
      // Clase para darle color verde.
      item.className = "repaso-vacio";
      // Texto de felicitación.
      item.textContent = t("fin.sinErrores");
      // Lo añadimos.
      el.finRepaso.append(item);
      // No hay nada más que listar.
      return;
    }
    // Listamos los primeros errores (como mucho MAXIMO_EN_REPASO).
    for (const fallo of unicos.slice(0, MAXIMO_EN_REPASO)) {
      // Elemento de la lista.
      const item = document.createElement("li");
      // Caja para la palabra (o la frase) correcta.
      const palabra = document.createElement("span");
      // Clase para la letra de máquina.
      palabra.className = "repaso-palabra";
      // Idioma de la palabra.
      palabra.lang = fallo.idioma;
      // Si el error no tiene posición (por ejemplo, un error de significado)...
      if (fallo.marca < 0) {
        // ...mostramos el texto tal cual.
        palabra.append(fallo.palabra);
        // Si el error cae dentro de la palabra...
      } else if (fallo.marca < fallo.palabra.length) {
        // ...ponemos la parte anterior al error...
        palabra.append(fallo.palabra.slice(0, fallo.marca));
        // ...resaltamos el carácter correcto...
        const marca = document.createElement("mark");
        // ...que es el de esa posición...
        marca.textContent = fallo.palabra[fallo.marca];
        // ...y añadimos el resaltado y el resto de la palabra.
        palabra.append(marca, fallo.palabra.slice(fallo.marca + 1));
        // Si faltaba un espacio justo después de la palabra...
      } else if (fallo.espacio) {
        // ...ponemos la palabra...
        palabra.append(fallo.palabra);
        // ...y un símbolo visible para el espacio.
        const marca = document.createElement("mark");
        // Símbolo de espacio.
        marca.textContent = "␣";
        // Lo añadimos detrás de la palabra.
        palabra.append(marca);
        // En cualquier otro caso (por ejemplo, texto de más al final)...
      } else {
        // ...mostramos la palabra sin resaltar nada.
        palabra.append(fallo.palabra);
      }
      // Caja para la explicación.
      const explicacion = document.createElement("span");
      // Clase para el texto secundario.
      explicacion.className = "repaso-explicacion";
      // Explicación del error.
      explicacion.textContent = fallo.explicacion;
      // Juntamos palabra y explicación.
      item.append(palabra, explicacion);
      // Si se puede leer en voz alta (y tiene sentido), añadimos el botón para escuchar la frase entera.
      if (Voz.disponible() && fallo.voz) {
        // Botón de escuchar.
        item.append(botonEscuchar(fallo.frase, fallo.idioma));
      }
      // Añadimos el elemento a la lista.
      el.finRepaso.append(item);
    }
    // Si hubo más errores de los que mostramos, lo indicamos.
    if (unicos.length > MAXIMO_EN_REPASO) {
      // Elemento de la lista.
      const item = document.createElement("li");
      // Clase para un estilo más discreto.
      item.className = "repaso-mas";
      // Cuántos quedan sin mostrar.
      item.textContent = t("fin.masErrores", { n: unicos.length - MAXIMO_EN_REPASO });
      // Lo añadimos.
      el.finRepaso.append(item);
    }
  }

  // Enciende o apaga el botón de mayúsculas de la pantalla.
  function ponerMayusculas(activadas) {
    // Si hay partida, guardamos el estado en ella.
    if (partida) {
      // Estado del botón.
      partida.mayusculas = activadas;
    }
    // Indicamos el estado al botón (lo usan el CSS y los lectores de pantalla).
    el.mayus.setAttribute("aria-pressed", String(activadas));
    // Indicamos el estado a la fila de teclas, para mostrar las letras en mayúscula.
    el.teclas.dataset.mayus = String(activadas);
  }

  // Lleva el cursor de la caja al final del texto.
  function cursorAlFinal() {
    // Largo del texto escrito.
    const fin = el.entrada.value.length;
    // Ponemos el cursor ahí, sin nada seleccionado.
    el.entrada.setSelectionRange(fin, fin);
  }

  // ¿Hay una partida en marcha en la que se puede escribir?
  function sePuedeEscribir() {
    // Hace falta partida, que no haya terminado, que no estemos en pausa y que se vea la pantalla de juego.
    return Boolean(partida) && !partida.terminada && !partida.esperando && document.body.dataset.pantalla === "pantalla-juego";
  }

  // --- Eventos: se conectan una sola vez al cargar la página ---

  // Cada cambio en la caja de texto se revisa.
  el.entrada.addEventListener("input", alEscribir);
  // Cuando el teclado termina de componer un carácter (tildes en algunos sistemas), también.
  el.entrada.addEventListener("compositionend", () => alEscribir());
  // Bloqueamos las teclas de mover el cursor y algunos atajos.
  el.entrada.addEventListener("keydown", (evento) => {
    // ¿Es un atajo con Ctrl o Cmd? (Sin Alt, para no bloquear AltGr en teclados españoles).
    const conControl = (evento.ctrlKey || evento.metaKey) && !evento.altKey;
    // ¿Es una tecla de cursor o un atajo bloqueado?
    if (TECLAS_DE_CURSOR.includes(evento.key) || (conControl && ATAJOS_BLOQUEADOS.includes(evento.key.toLowerCase()))) {
      // Anulamos la tecla.
      evento.preventDefault();
    }
  });
  // Al hacer clic en la caja, el cursor vuelve al final.
  el.entrada.addEventListener("mouseup", cursorAlFinal);
  // Al tocar la caja en una pantalla táctil, también.
  el.entrada.addEventListener("touchend", cursorAlFinal);
  // Al entrar en la caja, también.
  el.entrada.addEventListener("focus", cursorAlFinal);
  // No se puede pegar ni arrastrar texto: hay que escribirlo.
  for (const tipo of ["paste", "drop"]) {
    // Conectamos el evento.
    el.entrada.addEventListener(tipo, (evento) => {
      // Anulamos el pegado.
      evento.preventDefault();
      // Explicamos por qué.
      mostrarMensaje(t("juego.noPegar"), "aviso");
    });
  }
  // Al pulsar un botón de la fila de teclas, no queremos que la caja pierda el foco.
  el.teclas.addEventListener("mousedown", (evento) => evento.preventDefault());
  // Al hacer clic en un botón de la fila de teclas...
  el.teclas.addEventListener("click", (evento) => {
    // Buscamos el botón pulsado.
    const boton = evento.target.closest("button");
    // Si no se pulsó un botón, o no se puede escribir ahora, no hacemos nada.
    if (!boton || !partida || partida.esperando) {
      // Salimos.
      return;
    }
    // Si es el botón de mayúsculas...
    if (boton === el.mayus) {
      // ...cambiamos su estado.
      ponerMayusculas(!partida.mayusculas);
      // Si es una letra o signo...
    } else {
      // ...tomamos su carácter...
      let caracter = boton.dataset.caracter;
      // ...en mayúscula si el botón de mayúsculas estaba activado...
      if (partida.mayusculas) {
        // Convertimos a mayúscula (los signos ¿ ¡ no cambian).
        caracter = caracter.toUpperCase();
        // Las mayúsculas solo sirven para un carácter, como en el móvil.
        ponerMayusculas(false);
      }
      // ...lo añadimos al final de lo escrito...
      el.entrada.value += caracter;
      // ...y lo revisamos como si se hubiera tecleado.
      alEscribir();
    }
    // Devolvemos el foco a la caja para seguir escribiendo.
    el.entrada.focus();
  });
  // El botón de escuchar no debe quitar el foco a la caja de texto.
  el.escuchar.addEventListener("mousedown", (evento) => evento.preventDefault());
  // Botón de escuchar: lee la frase actual en voz alta.
  el.escuchar.addEventListener("click", () => {
    // Solo si hay una frase a la vista.
    if (partida && partida.frase) {
      // La leemos en su idioma.
      leerFrase();
    }
  });
  // Si se activa o desactiva el teclado en pantalla en mitad de una partida, lo mostramos u ocultamos.
  document.addEventListener("frase-exacta:ajuste", (evento) => {
    // Solo nos interesa ese ajuste, y solo si hay partida.
    if (evento.detail.nombre === "tecladoEnPantalla" && partida && modo) {
      // Lo mostramos u ocultamos.
      el.teclado.hidden = !tecladoVisible();
      // Señalamos la tecla que toca.
      marcarProgreso();
    }
  });
  // Botón "Terminar partida": acaba ya y muestra el resultado.
  el.terminar.addEventListener("click", () => terminarPartida(0));
  // Botón "Jugar otra vez": nueva partida normal del mismo modo.
  el.otraVez.addEventListener("click", () => jugar(modo));
  // Botón "Repasar errores": partida solo con las frases falladas.
  el.repasar.addEventListener("click", () => jugar(modo, { repaso: true }));
  // Botón "Volver al menú" (mostrarMenu está en principal.js).
  el.volver.addEventListener("click", () => mostrarMenu());
  // Al cerrar el panel de ajustes en mitad de una partida, el cursor vuelve a la caja de texto.
  document.addEventListener("frase-exacta:ajustes-cerrados", () => {
    // Solo si se puede escribir.
    if (sePuedeEscribir()) {
      // Foco en la caja.
      el.entrada.focus();
    }
  });
  // Si se borra el progreso, olvidamos lo que teníamos leído del navegador.
  document.addEventListener("frase-exacta:progreso-borrado", () => {
    // Recorremos los dos almacenes.
    for (const cache of [usadasPorModo, fallidasPorModo]) {
      // Borramos cada modo.
      for (const id of Object.keys(cache)) {
        // Lo olvidamos: se volverá a leer (vacío) la próxima vez.
        delete cache[id];
      }
    }
  });
  // Al cambiar de idioma, repintamos los textos de la partida o del resultado.
  alCambiarIdioma(() => {
    // Si no hay partida, no hay nada que repintar.
    if (!partida) {
      // Salimos.
      return;
    }
    // Nombre del modo.
    pintarEtiquetaModo();
    // Vidas (texto para lectores de pantalla).
    pintarVidas(null);
    // Si hay frase, su nivel, su origen y los textos de encima y debajo.
    if (partida.frase) {
      // Nivel.
      pintarNivel();
      // Origen.
      pintarFuente();
      // Texto de encima, etiqueta y nota (sin tocar la frase, que puede estar tapada).
      pintarConsigna();
    }
    // Si la partida ya tiene resultado, la pantalla final.
    if (partida.resultado) {
      // Resultado.
      pintarResultado();
    }
  });

  // Lo que el motor ofrece al resto del juego.
  return { jugar, leerRecord, frasesSinVer, frasesFallidas };
})();
