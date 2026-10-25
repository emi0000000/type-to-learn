// modos/ortografia.js: el modo ortografía.
// Muestra frases en español; hay que copiarlas exactas y cada error resta una vida.
// Este modo es independiente de los demás: no comparte frases ni reglas con inglés o código.
// Usa funciones de memoria.js, comparar.js, seleccion.js y pantallas.js, que se cargan antes.

// Todo el modo va dentro de una función que se ejecuta al momento, para no llenar el espacio global.
const ModoOrtografia = (() => {
  // Vidas con las que empieza cada partida.
  const VIDAS_INICIALES = 5;
  // Clave para guardar en el navegador los números de las frases ya vistas.
  const CLAVE_USADAS = "frase-exacta:ortografia:usadas";
  // Clave para guardar el récord de frases completadas en una partida.
  const CLAVE_RECORD = "frase-exacta:ortografia:record";
  // Milisegundos de pausa entre una frase completada y la siguiente.
  const PAUSA_ENTRE_FRASES = 800;
  // Milisegundos de pausa entre perder la última vida y ver el resultado.
  const PAUSA_AL_PERDER = 1400;
  // Máximo de errores que se listan en el repaso final.
  const MAXIMO_EN_REPASO = 12;
  // Teclas que mueven el cursor: las bloqueamos para que siempre se escriba al final.
  const TECLAS_DE_CURSOR = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "PageUp", "PageDown"];
  // Atajos de teclado bloqueados (con Ctrl o Cmd): seleccionar todo, deshacer y rehacer.
  const ATAJOS_BLOQUEADOS = ["a", "z", "y"];

  // Atajo para no escribir document.getElementById cada vez.
  const $ = (id) => document.getElementById(id);
  // Elementos de la página que usa este modo.
  const el = {
    vidas: $("orto-vidas"), // corazones de vidas
    completadas: $("orto-completadas"), // contador de frases completadas
    errores: $("orto-errores"), // contador de errores
    fraseVisible: $("orto-frase"), // la frase, letra por letra
    fraseLectores: $("orto-frase-lectores"), // la frase entera para lectores de pantalla
    entrada: $("orto-entrada"), // caja donde se escribe
    mensaje: $("orto-mensaje"), // mensajes de error o de ánimo
    teclas: $("orto-teclas"), // botones de caracteres especiales
    mayus: $("orto-mayus"), // botón de mayúsculas en pantalla
    fuente: $("orto-fuente"), // de dónde viene la frase
    terminar: $("orto-terminar"), // botón para terminar la partida
    finTitulo: $("orto-fin-titulo"), // título de la pantalla final
    finCompletadas: $("orto-fin-completadas"), // número grande de frases completadas
    finUnidad: $("orto-fin-unidad"), // "frase" o "frases"
    finLetras: $("orto-fin-letras"), // letras correctas
    finErrores: $("orto-fin-errores"), // errores totales
    finPrecision: $("orto-fin-precision"), // porcentaje de acierto
    finRecord: $("orto-fin-record"), // mejor resultado
    finRepaso: $("orto-fin-repaso"), // lista de palabras para repasar
    otraVez: $("orto-otra-vez"), // botón "Jugar otra vez"
    volver: $("orto-volver"), // botón "Volver al menú"
  };

  // Estado de la partida en curso (null mientras no se ha jugado ninguna).
  let partida = null;
  // Números de las frases ya vistas; se cargan del navegador la primera vez que hacen falta.
  let usadas = null;

  // Crea el estado de una partida nueva.
  function estadoInicial() {
    // Devolvemos un objeto con todos los datos de la partida.
    return {
      vidas: VIDAS_INICIALES, // vidas que quedan
      completadas: 0, // frases terminadas
      letras: 0, // caracteres correctos de las frases terminadas
      errores: 0, // errores totales
      fallos: [], // detalle de cada error, para el repaso final
      frase: null, // frase actual: [número, texto, autor]
      progreso: 0, // caracteres correctos escritos de la frase actual
      erroresEnFrase: 0, // errores cometidos en la frase actual
      esperando: false, // true durante las pausas: no se acepta escritura
      terminada: false, // true cuando la partida ya acabó
      temporizador: null, // pausa pendiente, para poder cancelarla
      mayusculas: false, // si el botón "Mayús" de la pantalla está activado
    };
  }

  // Devuelve el conjunto de frases ya vistas, leyéndolo del navegador si hace falta.
  function cargarUsadas() {
    // Solo leemos del navegador la primera vez.
    if (usadas === null) {
      // Leemos la lista guardada (o una lista vacía si no hay nada).
      const guardadas = Memoria.leer(CLAVE_USADAS, []);
      // Si lo guardado no es una lista (dato roto), empezamos de cero.
      usadas = new Set(Array.isArray(guardadas) ? guardadas : []);
    }
    // Devolvemos el conjunto.
    return usadas;
  }

  // Devuelve el récord guardado (0 si no hay).
  function leerRecord() {
    // Leemos el valor guardado.
    const record = Memoria.leer(CLAVE_RECORD, 0);
    // Si no es un número válido, contamos como 0.
    return Number.isFinite(record) ? record : 0;
  }

  // Cuenta cuántas frases de la lista todavía no han salido.
  function frasesSinVer() {
    // Conjunto de frases ya vistas.
    const vistas = cargarUsadas();
    // Contamos las frases cuyo número no está entre las vistas.
    return FRASES_ES.filter((frase) => !vistas.has(frase[0])).length;
  }

  // Empieza una partida nueva.
  function iniciar() {
    // Si quedaba una pausa pendiente de otra partida, la cancelamos.
    cancelarPausa();
    // Creamos el estado de la nueva partida.
    partida = estadoInicial();
    // Dejamos el botón de mayúsculas apagado.
    ponerMayusculas(false);
    // Mostramos la pantalla de juego.
    mostrarPantalla("pantalla-ortografia");
    // Dibujamos las vidas llenas.
    pintarVidas(false);
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

  // Elige y muestra la siguiente frase.
  function siguienteFrase() {
    // La pausa que nos trajo aquí (si la hubo) ya terminó.
    partida.temporizador = null;
    // Conjunto de frases ya vistas.
    const vistas = cargarUsadas();
    // Elegimos una frase nueva del largo que toca.
    let frase = elegirFrase(FRASES_ES, vistas, partida.completadas);
    // Mensaje opcional para la persona (vacío normalmente).
    let aviso = "";
    // Si ya salieron todas las frases...
    if (frase === null) {
      // ...olvidamos las vistas para empezar la lista otra vez...
      vistas.clear();
      // ...elegimos de nuevo...
      frase = elegirFrase(FRASES_ES, vistas, partida.completadas);
      // ...y lo avisamos.
      aviso = "Ya te salieron todas las frases. La lista vuelve a empezar.";
    }
    // Marcamos esta frase como vista para que no se repita.
    vistas.add(frase[0]);
    // Guardamos la lista de vistas en el navegador.
    Memoria.guardar(CLAVE_USADAS, [...vistas]);
    // Guardamos la frase en la partida.
    partida.frase = frase;
    // Todavía no hay nada escrito de esta frase.
    partida.progreso = 0;
    // Ni errores en ella.
    partida.erroresEnFrase = 0;
    // Ya se puede escribir.
    partida.esperando = false;
    // Vaciamos la caja de texto.
    el.entrada.value = "";
    // Dejamos escribir en ella.
    el.entrada.readOnly = false;
    // Dibujamos la frase.
    pintarFrase();
    // Mostramos de dónde viene.
    pintarFuente();
    // Mostramos el aviso, si lo hay.
    mostrarMensaje(aviso, aviso ? "aviso" : "");
    // Ponemos el cursor en la caja de texto.
    el.entrada.focus();
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
    // Texto de la frase que hay que copiar.
    const texto = partida.frase[1];
    // Comparamos lo escrito con la frase.
    const resultado = revisarEscritura(texto, el.entrada.value);
    // Actualizamos cuántos caracteres van bien.
    partida.progreso = resultado.aciertos;
    // Si hay un error...
    if (resultado.estado === "error") {
      // ...dejamos en la caja solo la parte correcta, para seguir desde ahí...
      el.entrada.value = texto.slice(0, resultado.aciertos);
      // ...actualizamos los colores de la frase...
      marcarProgreso();
      // ...y quitamos una vida.
      perderVida(resultado);
      // No hay nada más que hacer con este cambio.
      return;
    }
    // Sin error: actualizamos los colores de la frase.
    marcarProgreso();
    // Si la frase está completa, pasamos a la siguiente.
    if (resultado.estado === "completa") {
      // Celebramos y preparamos la siguiente.
      completarFrase();
      // Terminamos aquí.
      return;
    }
    // Si quedaba un mensaje de error o aviso a la vista, lo borramos: ya va bien.
    if (el.mensaje.dataset.tipo === "error" || el.mensaje.dataset.tipo === "aviso") {
      // Vaciamos el mensaje.
      mostrarMensaje("", "");
    }
  }

  // Resta una vida y explica el error.
  function perderVida(resultado) {
    // Una vida menos.
    partida.vidas--;
    // Un error más en total.
    partida.errores++;
    // Y uno más en esta frase.
    partida.erroresEnFrase++;
    // Buscamos la palabra donde ocurrió el error, para el repaso final.
    const { palabra, inicio } = palabraEn(partida.frase[1], resultado.aciertos);
    // Guardamos el detalle del error.
    partida.fallos.push({
      palabra, // palabra correcta
      marca: resultado.aciertos - inicio, // posición del error dentro de la palabra
      esperado: resultado.esperado, // lo que tocaba escribir
      recibido: resultado.recibido, // lo que se escribió
    });
    // Redibujamos las vidas, animando el corazón que se pierde.
    pintarVidas(true);
    // Actualizamos el contador de errores.
    pintarMarcador();
    // Explicamos qué pasó.
    mostrarMensaje(explicarError(resultado.esperado, resultado.recibido), "error");
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
    // Si ya no quedan vidas, se acabó la partida.
    if (partida.vidas <= 0) {
      // Terminamos tras una pausa para que se vea el último error.
      terminarPartida(PAUSA_AL_PERDER);
    }
  }

  // Se ejecuta al escribir la frase entera sin fallos pendientes.
  function completarFrase() {
    // Bloqueamos la escritura durante la pausa.
    partida.esperando = true;
    // Una frase más completada.
    partida.completadas++;
    // Sumamos sus caracteres a las letras correctas.
    partida.letras += partida.frase[1].length;
    // Los caracteres de esta frase ya están contados.
    partida.progreso = 0;
    // La caja queda de solo lectura hasta la siguiente frase (sin perder el foco).
    el.entrada.readOnly = true;
    // Actualizamos el contador de frases.
    pintarMarcador();
    // Iluminamos la frase.
    reiniciarAnimacion(el.fraseVisible, "lograda");
    // Mensaje de ánimo: "¡Perfecta!" si no hubo errores en ella.
    mostrarMensaje(partida.erroresEnFrase === 0 ? "¡Perfecta!" : "Completada.", "bien");
    // Tras una pausa corta, sacamos la siguiente frase.
    partida.temporizador = setTimeout(siguienteFrase, PAUSA_ENTRE_FRASES);
  }

  // Termina la partida y prepara la pantalla de resultados.
  function terminarPartida(pausa) {
    // Si la partida ya había terminado, no hacemos nada.
    if (!partida || partida.terminada) {
      // Salimos.
      return;
    }
    // Cancelamos la pausa pendiente (por ejemplo, la de pasar a la siguiente frase).
    cancelarPausa();
    // Marcamos la partida como terminada.
    partida.terminada = true;
    // Bloqueamos la escritura.
    partida.esperando = true;
    // La caja queda de solo lectura.
    el.entrada.readOnly = true;
    // Letras correctas: las de frases completadas más las de la frase a medias.
    const letras = partida.letras + partida.progreso;
    // Total de pulsaciones revisadas: correctas más errores.
    const total = letras + partida.errores;
    // Porcentaje de acierto, redondeado (100 si no se escribió nada).
    const precision = total === 0 ? 100 : Math.round((letras / total) * 100);
    // Récord anterior.
    const recordAnterior = leerRecord();
    // ¿Esta partida supera el récord?
    const esRecord = partida.completadas > recordAnterior;
    // Si lo supera, lo guardamos.
    if (esRecord) {
      // Guardamos el nuevo récord.
      Memoria.guardar(CLAVE_RECORD, partida.completadas);
    }
    // Título de la pantalla final.
    el.finTitulo.textContent = esRecord ? "¡Nuevo récord!" : "Fin de la partida";
    // Número grande de frases completadas.
    el.finCompletadas.textContent = partida.completadas;
    // "frase" en singular o "frases" en plural.
    el.finUnidad.textContent = partida.completadas === 1 ? "frase completada" : "frases completadas";
    // Letras correctas.
    el.finLetras.textContent = letras;
    // Errores.
    el.finErrores.textContent = partida.errores;
    // Precisión, con espacio antes del signo de porcentaje, como recomienda la RAE.
    el.finPrecision.textContent = `${precision} %`;
    // Mejor resultado hasta ahora.
    el.finRecord.textContent = Math.max(recordAnterior, partida.completadas);
    // Lista de palabras para repasar.
    pintarRepaso();
    // Tras la pausa indicada, mostramos los resultados.
    partida.temporizador = setTimeout(() => {
      // La pausa terminó.
      partida.temporizador = null;
      // Mostramos la pantalla final.
      mostrarPantalla("pantalla-orto-fin");
      // Ponemos el foco en "Jugar otra vez" para poder seguir con Enter.
      el.otraVez.focus();
    }, pausa);
  }

  // Dibuja la frase actual, cada carácter en su propia caja.
  function pintarFrase() {
    // Texto de la frase.
    const texto = partida.frase[1];
    // Copia completa para lectores de pantalla (la versión letra a letra se lee mal).
    el.fraseLectores.textContent = texto;
    // Fragmento donde vamos montando las letras antes de ponerlas en la página.
    const fragmento = document.createDocumentFragment();
    // Recorremos la frase carácter por carácter.
    for (const caracter of texto) {
      // Creamos una caja para el carácter.
      const letra = document.createElement("span");
      // Le ponemos el carácter.
      letra.textContent = caracter;
      // Si es un espacio, lo marcamos para que el cursor se vea igual sobre él.
      if (caracter === " ") {
        // Clase especial para los espacios.
        letra.classList.add("espacio");
      }
      // Añadimos la caja al fragmento.
      fragmento.append(letra);
    }
    // Quitamos la frase anterior de la animación de "lograda".
    el.fraseVisible.classList.remove("lograda");
    // Cambiamos la frase anterior por la nueva.
    el.fraseVisible.replaceChildren(fragmento);
    // Marcamos el cursor al principio.
    marcarProgreso();
  }

  // Colorea las letras ya escritas y marca dónde va el cursor.
  function marcarProgreso() {
    // Lista de cajas de letras.
    const letras = el.fraseVisible.children;
    // Recorremos todas.
    for (let i = 0; i < letras.length; i++) {
      // Las anteriores al progreso están hechas.
      letras[i].classList.toggle("hecha", i < partida.progreso);
      // La del progreso es la que toca escribir ahora.
      letras[i].classList.toggle("actual", i === partida.progreso);
    }
  }

  // Dibuja los corazones de vidas.
  function pintarVidas(animarPerdida) {
    // Quitamos los corazones anteriores.
    el.vidas.replaceChildren();
    // Creamos uno por cada vida inicial.
    for (let i = 0; i < VIDAS_INICIALES; i++) {
      // Caja del corazón.
      const corazon = document.createElement("span");
      // Clase base.
      corazon.className = "vida";
      // Dibujo del corazón.
      corazon.textContent = "♥";
      // Los que pasan del número de vidas que quedan están perdidos.
      if (i >= partida.vidas) {
        // Corazón apagado.
        corazon.classList.add("perdida");
      }
      // El que se acaba de perder se anima.
      if (animarPerdida && i === partida.vidas) {
        // Animación de corazón roto.
        corazon.classList.add("rota");
      }
      // Lo añadimos a la fila.
      el.vidas.append(corazon);
    }
    // Texto para lectores de pantalla.
    el.vidas.setAttribute("aria-label", `Vidas: ${partida.vidas} de ${VIDAS_INICIALES}`);
  }

  // Actualiza los contadores de frases y errores.
  function pintarMarcador() {
    // Frases completadas.
    el.completadas.textContent = partida.completadas;
    // Errores.
    el.errores.textContent = partida.errores;
  }

  // Muestra el número y el autor de la frase, con enlace a Tatoeba (lo pide su licencia).
  function pintarFuente() {
    // Sacamos el número y el autor (el texto no hace falta aquí).
    const [numero, , autor] = partida.frase;
    // Creamos el enlace.
    const enlace = document.createElement("a");
    // Dirección de la frase en Tatoeba.
    enlace.href = `https://tatoeba.org/es/sentences/show/${numero}`;
    // Se abre en otra pestaña para no perder la partida.
    enlace.target = "_blank";
    // Por seguridad, la otra pestaña no puede controlar esta.
    enlace.rel = "noopener noreferrer";
    // Texto del enlace.
    enlace.textContent = `Frase n.º ${numero} de Tatoeba`;
    // Ponemos el enlace y, si hay autor, su nombre.
    el.fuente.replaceChildren(enlace, autor ? `, por ${autor}` : "");
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
  function reiniciarAnimacion(elemento, clase) {
    // Quitamos la clase.
    elemento.classList.remove(clase);
    // Pedimos el ancho para obligar al navegador a aplicar el cambio antes de seguir.
    void elemento.offsetWidth;
    // Volvemos a poner la clase: la animación empieza de nuevo.
    elemento.classList.add(clase);
  }

  // Dibuja la lista de palabras para repasar en la pantalla final.
  function pintarRepaso() {
    // Vaciamos la lista anterior.
    el.finRepaso.replaceChildren();
    // Claves de los errores ya listados, para no repetir el mismo dos veces.
    const vistos = new Set();
    // Errores sin repetir.
    const unicos = [];
    // Recorremos todos los errores de la partida.
    for (const fallo of partida.fallos) {
      // Clave que identifica el error: palabra, posición y lo escrito.
      const clave = `${fallo.palabra}|${fallo.marca}|${fallo.recibido}`;
      // Si es nuevo...
      if (!vistos.has(clave)) {
        // ...lo recordamos...
        vistos.add(clave);
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
      item.textContent = "Ningún error. ¡Muy bien!";
      // Lo añadimos.
      el.finRepaso.append(item);
      // No hay nada más que listar.
      return;
    }
    // Listamos los primeros errores (como mucho MAXIMO_EN_REPASO).
    for (const fallo of unicos.slice(0, MAXIMO_EN_REPASO)) {
      // Elemento de la lista.
      const item = document.createElement("li");
      // Caja para la palabra correcta.
      const palabra = document.createElement("span");
      // Clase para la letra de máquina.
      palabra.className = "repaso-palabra";
      // Parte de la palabra antes del error.
      palabra.append(fallo.palabra.slice(0, fallo.marca));
      // Si el error cae dentro de la palabra...
      if (fallo.marca < fallo.palabra.length) {
        // ...resaltamos el carácter correcto...
        const marca = document.createElement("mark");
        // ...que es el de esa posición...
        marca.textContent = fallo.palabra[fallo.marca];
        // ...y añadimos el resaltado y el resto de la palabra.
        palabra.append(marca, fallo.palabra.slice(fallo.marca + 1));
        // Si faltaba un espacio justo después de la palabra...
      } else if (fallo.esperado === " ") {
        // ...lo mostramos con un símbolo visible.
        const marca = document.createElement("mark");
        // Símbolo de espacio.
        marca.textContent = "␣";
        // Lo añadimos detrás de la palabra.
        palabra.append(marca);
      }
      // Caja para la explicación.
      const explicacion = document.createElement("span");
      // Clase para el texto secundario.
      explicacion.className = "repaso-explicacion";
      // Explicación del error.
      explicacion.textContent = explicarError(fallo.esperado, fallo.recibido);
      // Juntamos palabra y explicación.
      item.append(palabra, explicacion);
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
      item.textContent = `Y ${unicos.length - MAXIMO_EN_REPASO} errores más.`;
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
      mostrarMensaje("Aquí no se puede pegar texto: escríbelo a mano.", "aviso");
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
  // Botón "Terminar partida": acaba ya y muestra el resultado.
  el.terminar.addEventListener("click", () => terminarPartida(0));
  // Botón "Jugar otra vez".
  el.otraVez.addEventListener("click", iniciar);
  // Botón "Volver al menú" (mostrarMenu está en principal.js).
  el.volver.addEventListener("click", () => mostrarMenu());

  // Lo que este modo ofrece al resto del juego.
  return { iniciar, leerRecord, frasesSinVer };
})();
