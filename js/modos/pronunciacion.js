// modos/pronunciacion.js: los modos de pronunciación (hablar al micrófono).
// Se ve una palabra o una frase corta. Primero se puede oír cómo se dice (normal o despacio) y después
// se pulsa «Hablar» y se dice en voz alta. El navegador reconoce lo que oye y el juego dice si se entendió.
// Hay tres intentos por palabra; si ninguno sale, se pierde una vida y se pasa a la siguiente.
// Funciona en los navegadores que reconocen la voz (Chrome, Edge y Safari). En el resto, el modo se desactiva.
// Nota: en Chrome el reconocimiento de voz lo hace un servicio de Google, así que hace falta conexión.

// Todo va dentro de una función que se ejecuta al momento, para no llenar el espacio global.
const ModosPronunciacion = (() => {
  // Reconocimiento de voz del navegador (con prefijo en Chrome y Safari).
  const Reconocimiento = window.SpeechRecognition || window.webkitSpeechRecognition || null;
  // Intentos por palabra.
  const INTENTOS = 3;
  // Parecido mínimo (de 0 a 1) para dar por buena una pronunciación.
  const PARECIDO_MINIMO = 0.8;
  // Artículos (y el "to" de los verbos ingleses) que se pueden decir o no.
  const ARTICULOS = /^(el|la|los|las|un|una|the|a|an|to|le|les|l|o|os|as|il|lo|i|gli|der|die|das) /;
  // Atajo para no escribir document.getElementById cada vez.
  const $ = (id) => document.getElementById(id);
  // Elementos de la página.
  const el = {
    caja: $("hablar"), // bloque de pronunciación
    escuchar: $("hablar-escuchar"), // botón de oír
    despacio: $("hablar-despacio"), // botón de oír despacio
    microfono: $("hablar-microfono"), // botón de hablar
    saltar: $("hablar-saltar"), // botón de saltar
    estado: $("hablar-estado"), // texto de lo que pasa
    intentos: $("hablar-intentos"), // intentos que quedan
  };
  // Palabra en curso: { frase, api, idioma, fallos, escuchando, reconocimiento }, o null.
  let actual = null;

  // ¿Puede el navegador reconocer la voz?
  function disponible() {
    // Hace falta el reconocimiento.
    return Reconocimiento !== null;
  }

  // Deja un texto solo con letras, números y espacios, en minúscula y sin tildes (para comparar lo que se oyó).
  function normalizar(texto) {
    // Sin tildes ni signos, en minúscula.
    return texto
      // Separamos las tildes de las letras...
      .normalize("NFD")
      // ...y las quitamos.
      .replace(/[̀-ͯ]/g, "")
      // Minúsculas.
      .toLowerCase()
      // El apóstrofo francés e italiano (l'eau) cuenta como espacio.
      .replace(/['’]/g, " ")
      // Todo lo que no sea letra o número, fuera.
      .replace(/[^\p{L}\p{N} ]/gu, " ")
      // Espacios simples.
      .replace(/\s+/g, " ")
      // Sin espacios en los extremos.
      .trim();
  }

  // Distancia de edición entre dos textos (cuántas letras hay que cambiar, quitar o poner).
  function distancia(a, b) {
    // Fila anterior de la tabla.
    let anterior = Array.from({ length: b.length + 1 }, (_, j) => j);
    // Recorremos las letras de a.
    for (let i = 1; i <= a.length; i++) {
      // Fila actual.
      const fila = [i];
      // Recorremos las letras de b.
      for (let j = 1; j <= b.length; j++) {
        // El mínimo entre quitar, poner o cambiar una letra.
        fila[j] = Math.min(anterior[j] + 1, fila[j - 1] + 1, anterior[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
      // La fila actual pasa a ser la anterior.
      anterior = fila;
    }
    // Resultado en la última casilla.
    return anterior[b.length];
  }

  // Parecido entre dos textos, de 0 (nada) a 1 (iguales), sin contar los espacios.
  function parecido(a, b) {
    // Sin espacios.
    const x = a.replace(/ /g, "");
    // Sin espacios.
    const y = b.replace(/ /g, "");
    // Largo mayor.
    const largo = Math.max(x.length, y.length) || 1;
    // Uno menos la proporción de letras distintas.
    return 1 - distancia(x, y) / largo;
  }

  // ¿Alguna de las cosas que oyó el navegador se parece bastante a lo que había que decir?
  //   oidas:   lo que entendió el navegador (varias posibilidades)
  //   objetivo: lo que había que decir
  //   idioma:  idioma ("en", "es"...)
  function acierta(oidas, objetivo, idioma) {
    // Lo que había que decir, normalizado, con y sin artículo.
    const correcto = normalizar(objetivo);
    // Sin el artículo del principio.
    const sinArticulo = correcto.replace(ARTICULOS, "");
    // Formas que valen.
    const validas = [correcto, sinArticulo];
    // Si lo que había que decir es un número con letras (en inglés o español), también vale en cifras.
    for (let n = 0; n <= 1000; n++) {
      // Solo en inglés y español sabemos escribir números con letras.
      if ((idioma === "en" || idioma === "es") && normalizar(numeroEnPalabras(n, idioma)) === sinArticulo) {
        // La cifra también vale.
        validas.push(String(n));
        // Ya está.
        break;
      }
    }
    // Basta con que una de las oídas se parezca bastante a una de las válidas.
    return oidas.some((oida) => {
      // Lo oído, normalizado.
      const limpio = normalizar(oida);
      // Sin artículo.
      const limpioSinArticulo = limpio.replace(ARTICULOS, "");
      // Comparamos con cada forma válida.
      return validas.some((valida) => [limpio, limpioSinArticulo].some((forma) => forma === valida || parecido(forma, valida) >= PARECIDO_MINIMO));
    });
  }

  // Escribe el estado (lo que pasa) y los intentos que quedan.
  function pintar(texto) {
    // Estado.
    el.estado.textContent = texto;
    // Intentos.
    el.intentos.textContent = actual ? t("hablar.intentos", { n: INTENTOS - actual.fallos }) : "";
    // El botón de hablar cambia mientras se escucha.
    el.microfono.classList.toggle("escuchando", Boolean(actual && actual.escuchando));
    // Su texto.
    el.microfono.textContent = actual && actual.escuchando ? t("hablar.escuchando") : t("hablar.hablar");
  }

  // Lee la palabra en voz alta (despacio, si se pide).
  function oir(despacio) {
    // Solo si hay palabra.
    if (actual) {
      // La leemos en su idioma.
      Voz.decir(actual.frase[1], actual.idioma, despacio ? 0.6 : undefined);
    }
  }

  // Empieza a escuchar por el micrófono.
  function hablar() {
    // Solo si hay palabra y no se está escuchando ya.
    if (!actual || actual.escuchando) {
      // Salimos.
      return;
    }
    // Cortamos la voz del juego, si estaba hablando (si no, el micrófono la oiría).
    Voz.callar();
    // Palabra a la que pertenece esta escucha.
    const esta = actual;
    // Reconocimiento nuevo.
    const reconocimiento = new Reconocimiento();
    // Idioma con país ("en-US"...).
    reconocimiento.lang = Voz.codigoRegional(esta.idioma);
    // Varias posibilidades, por si la primera no es la buena.
    reconocimiento.maxAlternatives = 5;
    // Solo el resultado final.
    reconocimiento.interimResults = false;
    // Cuando hay resultado...
    reconocimiento.onresult = (evento) => {
      // ...si la palabra sigue siendo la misma...
      if (actual === esta) {
        // ...lo evaluamos con todas las posibilidades.
        evaluar([...evento.results[0]].map((alternativa) => alternativa.transcript));
      }
    };
    // Si hay un error...
    reconocimiento.onerror = (evento) => {
      // ...y la palabra sigue siendo la misma...
      if (actual === esta) {
        // ...ya no se escucha...
        esta.escuchando = false;
        // ...y explicamos qué pasó (sin permiso, sin voz o cualquier otro problema).
        pintar(t(evento.error === "not-allowed" || evento.error === "service-not-allowed" ? "hablar.sinPermiso" : evento.error === "no-speech" ? "hablar.nadaOido" : "hablar.error"));
      }
    };
    // Al terminar de escuchar...
    reconocimiento.onend = () => {
      // ...si la palabra sigue siendo la misma y aún constaba que se escuchaba...
      if (actual === esta && esta.escuchando) {
        // ...dejamos de escuchar.
        esta.escuchando = false;
        // Repintamos el botón (el estado lo deja onresult u onerror).
        pintar(el.estado.textContent);
      }
    };
    // Guardamos el reconocimiento para poder cortarlo.
    esta.reconocimiento = reconocimiento;
    // Anotamos que se escucha.
    esta.escuchando = true;
    // Lo decimos.
    pintar(t("hablar.diloAhora"));
    // Empezamos (puede fallar si el navegador lo impide).
    try {
      // A escuchar.
      reconocimiento.start();
      // Si falla...
    } catch (error) {
      // ...no se escucha...
      esta.escuchando = false;
      // ...y lo decimos.
      pintar(t("hablar.error"));
    }
  }

  // Evalúa lo que se oyó.
  function evaluar(oidas) {
    // Datos de la palabra.
    const { frase, api, idioma } = actual;
    // Ya no se escucha.
    actual.escuchando = false;
    // Si se parece bastante, ¡bien dicho!
    if (acierta(oidas, frase[1], idioma)) {
      // Lo decimos.
      pintar(t("hablar.entendido", { oido: oidas[0] }));
      // Ya no hay palabra en curso.
      actual = null;
      // La palabra cuenta.
      api.superar(t("hablar.bien"));
      // Terminamos aquí.
      return;
    }
    // Un fallo más.
    actual.fallos++;
    // Si quedan intentos, decimos qué se entendió.
    if (actual.fallos < INTENTOS) {
      // Lo que se oyó (o que no se oyó nada).
      pintar(t("hablar.otraVez", { oido: oidas[0] || "…" }));
      // Terminamos aquí.
      return;
    }
    // Sin intentos: ya no hay palabra en curso.
    actual = null;
    // Lo que se oyó la última vez.
    pintar(t("hablar.otraVez", { oido: oidas[0] || "…" }));
    // La leemos otra vez en voz alta, para oír cómo se dice.
    Voz.decir(frase[1], idioma);
    // Se pierde una vida.
    const sigue = api.fallar(
      {
        palabra: frase[1], // lo que había que decir
        marca: -1, // sin letra que resaltar
        espacio: false, // no es un error de espacio
        explicacion: t("hablar.explicacion", { oido: oidas[0] || "…" }), // explicación para el repaso
      },
      // Mensaje bajo la palabra.
      t("hablar.fallo"),
    );
    // Si la partida sigue, a la siguiente.
    if (sigue) {
      // Siguiente tras una pausa (para oírla).
      api.siguiente(2600);
    }
  }

  // Pasa a la siguiente palabra sin perder una vida (y sin contar esta).
  function saltar() {
    // Solo si hay palabra.
    if (!actual) {
      // Salimos.
      return;
    }
    // Herramientas de la partida.
    const { api } = actual;
    // Cortamos la escucha.
    recoger();
    // Avisamos.
    api.mensaje(t("hablar.saltada"), "aviso");
    // Siguiente.
    api.siguiente(500);
  }

  // Quita la palabra en curso y corta la escucha.
  function recoger() {
    // Si se estaba escuchando, lo cortamos.
    if (actual && actual.reconocimiento) {
      // Cortamos sin esperar resultado.
      try {
        // Abortar.
        actual.reconocimiento.abort();
        // Si falla...
      } catch (error) {
        // ...no pasa nada.
      }
    }
    // Ya no hay palabra.
    actual = null;
    // Ocultamos el bloque.
    el.caja.hidden = true;
  }

  // Crea un modo de pronunciación.
  //   idioma: idioma de lo que se dice
  //   lista:  función que devuelve [número, texto, autor, traducción]
  function crearModo(idioma, lista) {
    // Frases preparadas para cada idioma de la interfaz.
    const preparadas = {};
    // Descripción del modo para el motor.
    return {
      id: `pronunciacion-${idioma}`, // nombre interno
      idioma, // idioma de lo que se dice
      sinEscribir: true, // no se escribe: se habla
      sinIdioma: true, // la etiqueta ya dice el idioma
      // Lista de frases (la traducción depende del idioma de la interfaz).
      frases() {
        // Idioma de la interfaz.
        const interfaz = idiomaActual();
        // Si no están preparadas, las preparamos.
        if (!preparadas[interfaz]) {
          // Frases.
          preparadas[interfaz] = lista();
        }
        // Las devolvemos.
        return preparadas[interfaz];
      },
      etiqueta: () => t(`idioma.${idioma}`), // idioma
      nota: (frase) => frase[3] || "", // traducción
      consigna: () => t("hablar.consigna"), // "Escúchala y dila en voz alta"
      disponible, // hace falta reconocimiento de voz
      noDisponible: () => t("hablar.noDisponible"), // aviso si no lo hay
      creditos: () => [], // sin créditos (palabras propias o frases citadas en otros modos)
      // Al mostrar la palabra: bloqueamos la caja y preparamos los botones.
      alMostrarFrase(frase, api) {
        // Cortamos la anterior, si quedaba.
        recoger();
        // Bloqueamos sin tapar la palabra.
        api.tapar(false);
        // Palabra en curso.
        actual = { frase, api, idioma, fallos: 0, escuchando: false, reconocimiento: null };
        // Mostramos el bloque.
        el.caja.hidden = false;
        // Instrucciones.
        pintar(t("hablar.instrucciones"));
        // El foco en el botón de hablar.
        el.microfono.focus();
      },
      // Al terminar la partida, recogemos.
      alTerminarPartida: recoger,
    };
  }

  // Palabras del vocabulario en inglés o español: [número, palabra, "", traducción].
  function palabrasEnEs(idioma) {
    // Lista principal.
    const lista = typeof VOCABULARIO === "undefined" ? [] : VOCABULARIO;
    // Palabra en el idioma y traducción al otro.
    return lista.map((entrada) => [entrada[0], idioma === "en" ? entrada[1] : entrada[2], "", idioma === "en" ? entrada[2] : entrada[1]]);
  }

  // Palabras de otro idioma: [número, palabra, "", traducción al idioma de la interfaz].
  function palabrasOtro(idioma) {
    // Del vocabulario de otros idiomas.
    return ModosVocabulario.palabrasDe(idioma).map((frase) => [frase[0], frase[1], "", frase[4]]);
  }

  // Botones.
  el.escuchar.addEventListener("click", () => oir(false));
  // Oír despacio.
  el.despacio.addEventListener("click", () => oir(true));
  // Hablar.
  el.microfono.addEventListener("click", hablar);
  // Saltar.
  el.saltar.addEventListener("click", saltar);
  // Con una palabra a la vista, Intro o Espacio empiezan a escuchar.
  document.addEventListener("keydown", (evento) => {
    // Solo si hay palabra, no hay ventanas abiertas y no se está en otro botón.
    if (!actual || document.querySelector("dialog[open]") || (evento.target.tagName === "BUTTON" && evento.target !== el.microfono)) {
      // Salimos.
      return;
    }
    // Intro o Espacio.
    if (evento.key === "Enter" || evento.key === " ") {
      // Evitamos que haga otra cosa.
      evento.preventDefault();
      // A escuchar.
      hablar();
    }
  });

  // Los seis modos, y lo que pueden usar las pruebas.
  return {
    en: crearModo("en", () => palabrasEnEs("en")), // inglés
    es: crearModo("es", () => palabrasEnEs("es")), // español
    fr: crearModo("fr", () => palabrasOtro("fr")), // francés
    pt: crearModo("pt", () => palabrasOtro("pt")), // portugués
    it: crearModo("it", () => palabrasOtro("it")), // italiano
    de: crearModo("de", () => palabrasOtro("de")), // alemán
    acierta, // para probar la comparación
  };
})();
