// motor.js: el motor común de las partidas.
// Hace lo que comparten todos los modos: mostrar la frase, revisar lo que se escribe,
// quitar vidas, contar frases y mostrar el resultado final.
// Cada modo se describe en js/modos/ con un objeto que tiene:
//   id                    nombre interno para guardar datos ("ortografia", "ingles")
//   nombre                nombre que se ve en pantalla ("Ortografía", "Inglés")
//   idioma                idioma de la frase que se copia ("es", "en")
//   teclasEspeciales      true si se muestran los botones á, é, ñ, ¿...
//   frases()              lista de frases; cada una empieza por [número, texto que se copia, ...]
//   creditos(frase)       lista de [etiqueta, número, autor] para citar a Tatoeba
//   alMostrarFrase(frase)             (opcional) se llama al mostrar cada frase nueva
//   alTerminarDeEscribir(frase, api)  (opcional) se llama al copiar la frase entera;
//                                     si no existe, la frase cuenta como superada sin más
//   alTerminarPartida()               (opcional) se llama al mostrar el resultado final
// Usa funciones de memoria.js, comparar.js, seleccion.js y pantallas.js, que se cargan antes.

// Todo el motor va dentro de una función que se ejecuta al momento, para no llenar el espacio global.
const Motor = (() => {
  // Vidas con las que empieza cada partida.
  const VIDAS_INICIALES = 5;
  // Milisegundos de pausa entre una frase superada y la siguiente.
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
  // Elementos de la página que usa el motor.
  const el = {
    modo: $("juego-modo"), // nombre del modo que se está jugando
    vidas: $("juego-vidas"), // corazones de vidas
    completadas: $("juego-completadas"), // contador de frases superadas
    errores: $("juego-errores"), // contador de errores
    fraseVisible: $("juego-frase"), // la frase, letra por letra
    fraseLectores: $("juego-frase-lectores"), // la frase entera para lectores de pantalla
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
    finLetras: $("fin-letras"), // letras correctas
    finErrores: $("fin-errores"), // errores totales
    finPrecision: $("fin-precision"), // porcentaje de acierto al escribir
    finRecord: $("fin-record"), // mejor resultado
    finRepaso: $("fin-repaso"), // lista de errores para repasar
    otraVez: $("fin-otra-vez"), // botón "Jugar otra vez"
    volver: $("fin-volver"), // botón "Volver al menú"
  };

  // Modo que se está jugando (o el último que se jugó).
  let modo = null;
  // Estado de la partida en curso (null mientras no se ha jugado ninguna).
  let partida = null;
  // Frases ya vistas de cada modo: {id del modo: conjunto de números}.
  const usadasPorModo = {};

  // Crea el estado de una partida nueva.
  function estadoInicial() {
    // Devolvemos un objeto con todos los datos de la partida.
    return {
      vidas: VIDAS_INICIALES, // vidas que quedan
      completadas: 0, // frases superadas
      letras: 0, // caracteres correctos de las frases copiadas enteras
      errores: 0, // errores totales (al escribir y, en inglés, al elegir el significado)
      erroresEscritura: 0, // errores solo al escribir, para calcular la precisión
      fallos: [], // detalle de cada error, para el repaso final
      frase: null, // frase actual: [número, texto, ...]
      progreso: 0, // caracteres correctos escritos de la frase actual
      erroresEnFrase: 0, // errores de escritura en la frase actual
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

  // Devuelve el conjunto de frases ya vistas de un modo, leyéndolo del navegador si hace falta.
  function cargarUsadas(modoElegido) {
    // Solo leemos del navegador la primera vez.
    if (!usadasPorModo[modoElegido.id]) {
      // Leemos la lista guardada (o una lista vacía si no hay nada).
      const guardadas = Memoria.leer(clave(modoElegido, "usadas"), []);
      // Si lo guardado no es una lista (dato roto), empezamos de cero.
      usadasPorModo[modoElegido.id] = new Set(Array.isArray(guardadas) ? guardadas : []);
    }
    // Devolvemos el conjunto.
    return usadasPorModo[modoElegido.id];
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
  function jugar(modoElegido) {
    // Si quedaba una pausa pendiente de otra partida, la cancelamos.
    cancelarPausa();
    // Guardamos el modo elegido.
    modo = modoElegido;
    // Creamos el estado de la nueva partida.
    partida = estadoInicial();
    // Mostramos el nombre del modo.
    el.modo.textContent = modo.nombre;
    // Indicamos el idioma de la frase (ayuda a los lectores de pantalla y a los teclados del móvil).
    el.fraseVisible.lang = modo.idioma;
    // Lo mismo para la copia para lectores de pantalla.
    el.fraseLectores.lang = modo.idioma;
    // Y para la caja de texto.
    el.entrada.lang = modo.idioma;
    // Mostramos u ocultamos la fila de caracteres especiales.
    el.teclas.hidden = !modo.teclasEspeciales;
    // Dejamos el botón de mayúsculas apagado.
    ponerMayusculas(false);
    // Mostramos la pantalla de juego.
    mostrarPantalla("pantalla-juego");
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

  // Programa la siguiente frase tras una pausa.
  function programarSiguiente(pausa) {
    // Guardamos el temporizador para poder cancelarlo si la partida termina antes.
    partida.temporizador = setTimeout(siguienteFrase, pausa);
  }

  // Elige y muestra la siguiente frase.
  function siguienteFrase() {
    // La pausa que nos trajo aquí (si la hubo) ya terminó.
    partida.temporizador = null;
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
      aviso = "Ya te salieron todas las frases. La lista vuelve a empezar.";
    }
    // Marcamos esta frase como vista para que no se repita.
    vistas.add(frase[0]);
    // Guardamos la lista de vistas en el navegador.
    Memoria.guardar(clave(modo, "usadas"), [...vistas]);
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
    // Si el modo quiere mostrar algo más (por ejemplo, la traducción), se lo pedimos.
    if (modo.alMostrarFrase) {
      // Llamamos al modo con la frase nueva.
      modo.alMostrarFrase(frase);
    }
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
      // ...y lo tratamos como error de escritura.
      errorDeEscritura(resultado);
      // No hay nada más que hacer con este cambio.
      return;
    }
    // Sin error: actualizamos los colores de la frase.
    marcarProgreso();
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
    // Y uno más en esta frase.
    partida.erroresEnFrase++;
    // Buscamos la palabra donde ocurrió el error, para el repaso final.
    const { palabra, inicio } = palabraEn(partida.frase[1], resultado.aciertos);
    // Explicación del error con palabras sencillas.
    const explicacion = explicarError(resultado.esperado, resultado.recibido);
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

  // Quita una vida, guarda el error para el repaso y lo explica.
  // Devuelve true si la partida sigue y false si se acabaron las vidas.
  function quitarVida(fallo, mensaje) {
    // Una vida menos.
    partida.vidas--;
    // Un error más en total.
    partida.errores++;
    // Guardamos el detalle del error.
    partida.fallos.push(fallo);
    // Redibujamos las vidas, animando el corazón que se pierde.
    pintarVidas(true);
    // Actualizamos el contador de errores.
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
    // Sumamos sus caracteres a las letras correctas.
    partida.letras += partida.frase[1].length;
    // Los caracteres de esta frase ya están contados.
    partida.progreso = 0;
    // La caja queda de solo lectura (sin perder el foco).
    el.entrada.readOnly = true;
    // Iluminamos la frase.
    reiniciarAnimacion(el.fraseVisible, "lograda");
    // ¿Se escribió sin ningún error?
    const sinErrores = partida.erroresEnFrase === 0;
    // Si el modo tiene un paso más (por ejemplo, la pregunta de significado)...
    if (modo.alTerminarDeEscribir) {
      // ...se lo pasamos, con las herramientas para seguir la partida.
      modo.alTerminarDeEscribir(partida.frase, crearApi(sinErrores));
      // Si no...
    } else {
      // ...la frase cuenta como superada.
      superarFrase(sinErrores ? "¡Perfecta!" : "Completada.");
    }
  }

  // Cuenta la frase como superada y prepara la siguiente.
  function superarFrase(mensaje) {
    // Una frase más superada.
    partida.completadas++;
    // Actualizamos el contador.
    pintarMarcador();
    // Mensaje de ánimo.
    mostrarMensaje(mensaje, "bien");
    // Tras una pausa corta, sacamos la siguiente frase.
    programarSiguiente(PAUSA_ENTRE_FRASES);
  }

  // Herramientas que reciben los modos en alTerminarDeEscribir para seguir la partida.
  // Solo funcionan mientras siga la misma partida (si ya terminó, no hacen nada).
  function crearApi(sinErrores) {
    // Partida a la que pertenecen estas herramientas.
    const estaPartida = partida;
    // Comprueba que la partida sigue siendo esta y no ha terminado.
    const vigente = () => partida === estaPartida && !estaPartida.terminada;
    // Devolvemos las herramientas.
    return {
      // Si la frase se escribió sin errores.
      sinErrores,
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
    // Marcamos la partida como terminada.
    partida.terminada = true;
    // Bloqueamos la escritura.
    partida.esperando = true;
    // La caja queda de solo lectura.
    el.entrada.readOnly = true;
    // Letras correctas: las de frases copiadas enteras más las de la frase a medias.
    const letras = partida.letras + partida.progreso;
    // Total de pulsaciones revisadas: correctas más errores de escritura.
    const total = letras + partida.erroresEscritura;
    // Porcentaje de acierto al escribir, redondeado (100 si no se escribió nada).
    const precision = total === 0 ? 100 : Math.round((letras / total) * 100);
    // Récord anterior de este modo.
    const recordAnterior = leerRecord(modo);
    // ¿Esta partida supera el récord?
    const esRecord = partida.completadas > recordAnterior;
    // Si lo supera, lo guardamos.
    if (esRecord) {
      // Guardamos el nuevo récord.
      Memoria.guardar(clave(modo, "record"), partida.completadas);
    }
    // Nombre del modo en la pantalla final.
    el.finModo.textContent = `Modo ${modo.nombre.toLowerCase()}`;
    // Título de la pantalla final.
    el.finTitulo.textContent = esRecord ? "¡Nuevo récord!" : "Fin de la partida";
    // Número grande de frases superadas.
    el.finCompletadas.textContent = partida.completadas;
    // "frase" en singular o "frases" en plural.
    el.finUnidad.textContent = partida.completadas === 1 ? "frase superada" : "frases superadas";
    // Letras correctas.
    el.finLetras.textContent = letras;
    // Errores.
    el.finErrores.textContent = partida.errores;
    // Precisión, con espacio antes del signo de porcentaje, como recomienda la RAE.
    el.finPrecision.textContent = `${precision} %`;
    // Mejor resultado hasta ahora.
    el.finRecord.textContent = Math.max(recordAnterior, partida.completadas);
    // Lista de errores para repasar.
    pintarRepaso();
    // Modo que se estaba jugando (por si cambia antes de que acabe la pausa).
    const modoTerminado = modo;
    // Tras la pausa indicada, mostramos los resultados.
    partida.temporizador = setTimeout(() => {
      // La pausa terminó.
      partida.temporizador = null;
      // Si el modo tiene algo que recoger (por ejemplo, la pregunta), se lo pedimos.
      if (modoTerminado.alTerminarPartida) {
        // Llamamos al modo.
        modoTerminado.alTerminarPartida();
      }
      // Mostramos la pantalla final.
      mostrarPantalla("pantalla-fin");
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
      // Añadimos la caja al fragmento.
      fragmento.append(letra);
    }
    // Quitamos de la frase anterior la animación de "lograda".
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
      // La del progreso es la que toca escribir ahora (si la frase ya está entera, ninguna).
      letras[i].classList.toggle("actual", i === partida.progreso && !partida.esperando);
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
    // Frases superadas.
    el.completadas.textContent = partida.completadas;
    // Errores.
    el.errores.textContent = partida.errores;
  }

  // Muestra el número y el autor de cada frase usada, con enlace a Tatoeba (lo pide su licencia).
  function pintarFuente() {
    // Vaciamos el párrafo.
    el.fuente.replaceChildren();
    // Recorremos los créditos que da el modo (en inglés son dos: la frase y su traducción).
    modo.creditos(partida.frase).forEach(([etiqueta, numero, autor], posicion) => {
      // A partir del segundo, los separamos con un punto medio.
      if (posicion > 0) {
        // Separador.
        el.fuente.append(" · ");
      }
      // Creamos el enlace.
      const enlace = document.createElement("a");
      // Dirección de la frase en Tatoeba.
      enlace.href = `https://tatoeba.org/es/sentences/show/${numero}`;
      // Se abre en otra pestaña para no perder la partida.
      enlace.target = "_blank";
      // Por seguridad, la otra pestaña no puede controlar esta.
      enlace.rel = "noopener noreferrer";
      // Texto del enlace.
      enlace.textContent = `${etiqueta} n.º ${numero} de Tatoeba`;
      // Ponemos el enlace y, si hay autor, su nombre.
      el.fuente.append(enlace, autor ? `, por ${autor}` : "");
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
  function reiniciarAnimacion(elemento, clase) {
    // Quitamos la clase.
    elemento.classList.remove(clase);
    // Pedimos el ancho para obligar al navegador a aplicar el cambio antes de seguir.
    void elemento.offsetWidth;
    // Volvemos a poner la clase: la animación empieza de nuevo.
    elemento.classList.add(clase);
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
      // Caja para la palabra (o la frase) correcta.
      const palabra = document.createElement("span");
      // Clase para la letra de máquina.
      palabra.className = "repaso-palabra";
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
  // Botón "Jugar otra vez": nueva partida del mismo modo.
  el.otraVez.addEventListener("click", () => jugar(modo));
  // Botón "Volver al menú" (mostrarMenu está en principal.js).
  el.volver.addEventListener("click", () => mostrarMenu());

  // Lo que el motor ofrece al resto del juego.
  return { jugar, leerRecord, frasesSinVer };
})();
