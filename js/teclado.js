// teclado.js: cómo son los teclados y qué teclas hay que pulsar para escribir cada carácter.
// Tres tipos de teclado: español de España, latinoamericano e inglés de Estados Unidos.
// También prepara los ejercicios de las lecciones de teclado.
// No toca la página, solo hace cálculos. Así se puede probar fácilmente con Node (mira tests/).
// El dibujo del teclado en pantalla está en tecladoVisual.js.

// --- Cómo se describe cada tecla ---
// Cada tecla es una lista: [código, carácter normal, con Mayús, con Alt Gr, ancho].
//   código:  el nombre que da el navegador a la tecla física (KeyboardEvent.code), igual en todos los países
//   ancho:   en "unidades" (una tecla de letra mide 1)
// Las teclas especiales (Tab, Mayús, Intro...) no escriben caracteres: su texto sale de textos.js.

// Crea las teclas de una fila de letras: cada letra en minúscula y, con Mayús, en mayúscula.
//   letras: por ejemplo "qwertyuiop"
//   altgr:  caracteres con Alt Gr en algunas letras, por ejemplo { e: "€" }
function teclasDeLetras(letras, altgr = {}) {
  // Una tecla por letra.
  return [...letras].map((letra) => [`Key${letra.toUpperCase()}`, letra, letra.toUpperCase(), altgr[letra] || null, 1]);
}

// Fila inferior de teclas especiales, igual en los tres teclados (suma 15 unidades).
const FILA_ESPACIO = [
  ["ControlLeft", null, null, null, 1.5], // Ctrl izquierda
  ["MetaLeft", null, null, null, 1.25], // tecla de Windows o Cmd
  ["AltLeft", null, null, null, 1.25], // Alt izquierda
  ["Space", " ", null, null, 6.5], // barra espaciadora
  ["AltRight", null, null, null, 1.25], // Alt Gr (en los teclados españoles) o Alt derecha
  ["MetaRight", null, null, null, 1.25], // tecla de Windows o Cmd derecha
  ["ControlRight", null, null, null, 2], // Ctrl derecha
];

// Los tres teclados. Cada uno tiene sus filas de teclas y sus «teclas muertas»:
// caracteres que no aparecen al pulsarlos, sino que esperan a la siguiente tecla (´ + a = á).
const DISPOSICIONES = {
  // ===== Español (España) =====
  es: {
    filas: [
      // Fila de los números.
      [
        ["Backquote", "º", "ª", "\\", 1], ["Digit1", "1", "!", "|", 1], ["Digit2", "2", '"', "@", 1], ["Digit3", "3", "·", "#", 1],
        ["Digit4", "4", "$", "~", 1], ["Digit5", "5", "%", "€", 1], ["Digit6", "6", "&", "¬", 1], ["Digit7", "7", "/", null, 1],
        ["Digit8", "8", "(", null, 1], ["Digit9", "9", ")", null, 1], ["Digit0", "0", "=", null, 1], ["Minus", "'", "?", null, 1],
        ["Equal", "¡", "¿", null, 1], ["Backspace", null, null, null, 2],
      ],
      // Fila de arriba (QWERTY). Intro ocupa esta fila y la siguiente.
      [["Tab", null, null, null, 1.5], ...teclasDeLetras("qwertyuiop", { e: "€" }), ["BracketLeft", "`", "^", "[", 1], ["BracketRight", "+", "*", "]", 1], ["Enter", null, null, null, 1.5]],
      // Fila central.
      [["CapsLock", null, null, null, 1.75], ...teclasDeLetras("asdfghjkl"), ["Semicolon", "ñ", "Ñ", null, 1], ["Quote", "´", "¨", "{", 1], ["Backslash", "ç", "Ç", "}", 1], ["Enter", null, null, null, 1.25]],
      // Fila de abajo.
      [["ShiftLeft", null, null, null, 1.25], ["IntlBackslash", "<", ">", null, 1], ...teclasDeLetras("zxcvbnm"), ["Comma", ",", ";", null, 1], ["Period", ".", ":", null, 1], ["Slash", "-", "_", null, 1], ["ShiftRight", null, null, null, 2.75]],
      // Barra espaciadora.
      FILA_ESPACIO,
    ],
    muertas: "`^´¨~", // teclas muertas de este teclado
    altgr: true, // tiene tecla Alt Gr
  },
  // ===== Latinoamericano =====
  la: {
    filas: [
      // Fila de los números.
      [
        ["Backquote", "|", "°", "¬", 1], ["Digit1", "1", "!", null, 1], ["Digit2", "2", '"', null, 1], ["Digit3", "3", "#", null, 1],
        ["Digit4", "4", "$", null, 1], ["Digit5", "5", "%", null, 1], ["Digit6", "6", "&", null, 1], ["Digit7", "7", "/", null, 1],
        ["Digit8", "8", "(", null, 1], ["Digit9", "9", ")", null, 1], ["Digit0", "0", "=", null, 1], ["Minus", "'", "?", "\\", 1],
        ["Equal", "¿", "¡", null, 1], ["Backspace", null, null, null, 2],
      ],
      // Fila de arriba: la @ está en la Q con Alt Gr.
      [["Tab", null, null, null, 1.5], ...teclasDeLetras("qwertyuiop", { q: "@" }), ["BracketLeft", "´", "¨", null, 1], ["BracketRight", "+", "*", "~", 1], ["Enter", null, null, null, 1.5]],
      // Fila central: las llaves y corchetes van a la derecha de la ñ.
      [["CapsLock", null, null, null, 1.75], ...teclasDeLetras("asdfghjkl"), ["Semicolon", "ñ", "Ñ", null, 1], ["Quote", "{", "[", "^", 1], ["Backslash", "}", "]", "`", 1], ["Enter", null, null, null, 1.25]],
      // Fila de abajo.
      [["ShiftLeft", null, null, null, 1.25], ["IntlBackslash", "<", ">", null, 1], ...teclasDeLetras("zxcvbnm"), ["Comma", ",", ";", null, 1], ["Period", ".", ":", null, 1], ["Slash", "-", "_", null, 1], ["ShiftRight", null, null, null, 2.75]],
      // Barra espaciadora.
      FILA_ESPACIO,
    ],
    muertas: "´¨^`", // teclas muertas de este teclado
    altgr: true, // tiene tecla Alt Gr
  },
  // ===== Inglés (Estados Unidos) =====
  us: {
    filas: [
      // Fila de los números.
      [
        ["Backquote", "`", "~", null, 1], ["Digit1", "1", "!", null, 1], ["Digit2", "2", "@", null, 1], ["Digit3", "3", "#", null, 1],
        ["Digit4", "4", "$", null, 1], ["Digit5", "5", "%", null, 1], ["Digit6", "6", "^", null, 1], ["Digit7", "7", "&", null, 1],
        ["Digit8", "8", "*", null, 1], ["Digit9", "9", "(", null, 1], ["Digit0", "0", ")", null, 1], ["Minus", "-", "_", null, 1],
        ["Equal", "=", "+", null, 1], ["Backspace", null, null, null, 2],
      ],
      // Fila de arriba.
      [["Tab", null, null, null, 1.5], ...teclasDeLetras("qwertyuiop"), ["BracketLeft", "[", "{", null, 1], ["BracketRight", "]", "}", null, 1], ["Backslash", "\\", "|", null, 1.5]],
      // Fila central (sin ñ: ahí va el punto y coma).
      [["CapsLock", null, null, null, 1.75], ...teclasDeLetras("asdfghjkl"), ["Semicolon", ";", ":", null, 1], ["Quote", "'", '"', null, 1], ["Enter", null, null, null, 2.25]],
      // Fila de abajo.
      [["ShiftLeft", null, null, null, 2.25], ...teclasDeLetras("zxcvbnm"), ["Comma", ",", "<", null, 1], ["Period", ".", ">", null, 1], ["Slash", "/", "?", null, 1], ["ShiftRight", null, null, null, 2.75]],
      // Barra espaciadora.
      FILA_ESPACIO,
    ],
    muertas: "", // sin teclas muertas
    altgr: false, // sin Alt Gr
  },
};

// Qué dedo pulsa cada tecla (mecanografía con los diez dedos).
const DEDOS = {
  "menique-izq": ["Backquote", "Digit1", "Tab", "KeyQ", "CapsLock", "KeyA", "ShiftLeft", "IntlBackslash", "KeyZ", "ControlLeft"], // meñique izquierdo
  "anular-izq": ["Digit2", "KeyW", "KeyS", "KeyX"], // anular izquierdo
  "medio-izq": ["Digit3", "KeyE", "KeyD", "KeyC"], // corazón izquierdo
  "indice-izq": ["Digit4", "Digit5", "KeyR", "KeyT", "KeyF", "KeyG", "KeyV", "KeyB"], // índice izquierdo
  pulgar: ["Space", "AltLeft", "AltRight", "MetaLeft", "MetaRight"], // pulgares
  "indice-der": ["Digit6", "Digit7", "KeyY", "KeyU", "KeyH", "KeyJ", "KeyN", "KeyM"], // índice derecho
  "medio-der": ["Digit8", "KeyI", "KeyK", "Comma"], // corazón derecho
  "anular-der": ["Digit9", "KeyO", "KeyL", "Period"], // anular derecho
  "menique-der": ["Digit0", "Minus", "Equal", "Backspace", "KeyP", "BracketLeft", "BracketRight", "Backslash", "Semicolon", "Quote", "Enter", "Slash", "ShiftRight", "ControlRight"], // meñique derecho
};

// Devuelve el dedo que pulsa una tecla (por su código).
function dedoDe(codigo) {
  // Buscamos el dedo cuya lista incluye la tecla.
  for (const [dedo, teclas] of Object.entries(DEDOS)) {
    // Si está en la lista, es ese dedo.
    if (teclas.includes(codigo)) {
      // Lo devolvemos.
      return dedo;
    }
  }
  // Si no está en ninguna (no debería pasar), el pulgar.
  return "pulgar";
}

// ¿La tecla se pulsa con la mano izquierda?
function esManoIzquierda(codigo) {
  // Los dedos de la mano izquierda terminan en "-izq".
  return dedoDe(codigo).endsWith("-izq");
}

// Marcas que ponen las teclas muertas sobre una letra (al separar "á" en "a" + marca).
const MARCAS = {
  "\u0301": "´", // tilde (acento agudo): á
  "\u0308": "¨", // diéresis: ü
  "\u0300": "`", // acento grave: à
  "\u0302": "^", // acento circunflejo: â
  "\u0303": "~", // virgulilla: ã (la ñ ya tiene su propia tecla)
};

// Busca la tecla que escribe un carácter directamente (sin teclas muertas).
// Devuelve { codigo, mayus, altgr } o null si no hay ninguna.
function teclaDirecta(caracter, disposicion) {
  // Recorremos las filas del teclado.
  for (const fila of disposicion.filas) {
    // Recorremos sus teclas.
    for (const [codigo, normal, mayus, altgr] of fila) {
      // Sin pulsar nada más.
      if (normal === caracter) {
        // Solo la tecla.
        return { codigo, mayus: false, altgr: false };
      }
      // Con Mayús.
      if (mayus === caracter) {
        // Mayús + tecla.
        return { codigo, mayus: true, altgr: false };
      }
      // Con Alt Gr.
      if (altgr === caracter) {
        // Alt Gr + tecla.
        return { codigo, mayus: false, altgr: true };
      }
    }
  }
  // No está en el teclado.
  return null;
}

// Devuelve los pasos para escribir un carácter con un teclado, o null si ese teclado no lo tiene.
// Cada paso es { codigo, mayus, altgr, muerta }:
//   mayus / altgr: hay que mantener esa tecla mientras se pulsa la del código
//   muerta:        es una tecla muerta (no se ve nada hasta pulsar la siguiente)
// Ejemplos con el teclado de España: "a" -> [a]; "@" -> [Alt Gr + 2]; "á" -> [´, a]; "^" -> [Mayús + `, Espacio].
function pasosPara(caracter, idDisposicion) {
  // Teclado elegido (si no existe, el de España).
  const disposicion = DISPOSICIONES[idDisposicion] || DISPOSICIONES.es;
  // Caracteres que son teclas muertas en este teclado.
  const muertas = disposicion.muertas;
  // ¿Hay una tecla que lo escriba directamente?
  const directa = teclaDirecta(caracter, disposicion);
  // Si la hay...
  if (directa) {
    // ...¿es una tecla muerta? Entonces, para que aparezca sola, después se pulsa Espacio.
    if (muertas.includes(caracter)) {
      // Dos pasos: la tecla muerta y el espacio.
      return [{ ...directa, muerta: true }, { codigo: "Space", mayus: false, altgr: false, muerta: false }];
    }
    // Un solo paso.
    return [{ ...directa, muerta: false }];
  }
  // Si no, probamos a separarlo en letra + marca (á = a + ´).
  const separado = caracter.normalize("NFD");
  // Tiene que ser exactamente una letra y una marca.
  if (separado.length === 2) {
    // La marca y su tecla muerta.
    const muerta = MARCAS[separado[1]];
    // Tecla de la marca.
    const teclaMarca = muerta && muertas.includes(muerta) ? teclaDirecta(muerta, disposicion) : null;
    // Tecla de la letra.
    const teclaLetra = teclaDirecta(separado[0], disposicion);
    // Si existen las dos...
    if (teclaMarca && teclaLetra) {
      // ...primero la tecla muerta y después la letra.
      return [{ ...teclaMarca, muerta: true }, { ...teclaLetra, muerta: false }];
    }
  }
  // Este teclado no tiene forma de escribirlo.
  return null;
}

// Elige el teclado que conviene si no se sabe cuál tiene la persona, según el idioma del navegador.
//   España -> es; otros países de habla hispana -> la; el resto -> us.
function disposicionPorIdioma(idiomas) {
  // Primer idioma de la lista (o ninguno).
  const primero = (idiomas && idiomas[0]) || "";
  // Español de España.
  if (/^es-ES$/i.test(primero) || /^es$/i.test(primero)) {
    // Teclado de España.
    return "es";
  }
  // Español de otro país.
  if (/^es-/i.test(primero)) {
    // Teclado latinoamericano.
    return "la";
  }
  // Cualquier otro: inglés.
  return "us";
}

// Averigua el teclado a partir del mapa de teclas que da el navegador (navigator.keyboard.getLayoutMap).
//   mapa: objeto con get(código) -> carácter (o null si no se sabe)
// Devuelve "es", "la", "us" o null si no se reconoce.
function disposicionPorMapa(mapa) {
  // Sin mapa, no se sabe.
  if (!mapa) {
    // Desconocido.
    return null;
  }
  // Tecla a la derecha de la L.
  const derechaDeL = mapa.get("Semicolon");
  // Tecla a la izquierda del 1.
  const izquierdaDe1 = mapa.get("Backquote");
  // Con ñ: es español; la tecla de la izquierda del 1 dice cuál.
  if (derechaDeL === "ñ") {
    // "º" en España, "|" en Latinoamérica.
    return izquierdaDe1 === "º" ? "es" : izquierdaDe1 === "|" ? "la" : null;
  }
  // Con punto y coma y la tecla ` a la izquierda del 1: inglés.
  if (derechaDeL === ";" && izquierdaDe1 === "`") {
    // Teclado de Estados Unidos.
    return "us";
  }
  // Otro teclado: no lo reconocemos.
  return null;
}

// ===== Lecciones de teclado =====

// Lecciones, de la más fácil a la más difícil.
//   letras: letras permitidas en cada familia de teclado (es: con ñ; us: sin ñ)
//   intro:  primeros ejercicios, solo con las teclas nuevas
//   tipo:   "letras", "frases", "numeros", "tildes" o "simbolos"
const LECCIONES = [
  // Fila central: donde descansan los dedos.
  { id: "central", tipo: "letras", letras: { es: "asdfghjklñ", us: "asdfghjkl" }, intro: { es: ["fff jjj fff jjj", "fjf jfj fjf jfj", "ddd kkk dkd kdk", "sss lll sls lsl", "aaa ñññ aña ñañ", "ggg hhh ghg hgh", "asdf ñlkj asdf ñlkj"], us: ["fff jjj fff jjj", "fjf jfj fjf jfj", "ddd kkk dkd kdk", "sss lll sls lsl", "aaa lll ala lal", "ggg hhh ghg hgh", "asdf lkj asdf lkj"] } },
  // Fila de arriba.
  { id: "superior", tipo: "letras", letras: { es: "qwertyuiopasdfghjklñ", us: "qwertyuiopasdfghjkl" }, intro: { es: ["rrr uuu rur uru", "eee iii eie iei", "ttt yyy tyt yty", "www ooo wow owo", "qqq ppp qpq pqp"], us: ["rrr uuu rur uru", "eee iii eie iei", "ttt yyy tyt yty", "www ooo wow owo", "qqq ppp qpq pqp"] } },
  // Fila de abajo.
  { id: "inferior", tipo: "letras", letras: { es: "zxcvbnmasdfghjklñ", us: "zxcvbnmasdfghjkl" }, intro: { es: ["vvv mmm vmv mvm", "ccc nnn cnc ncn", "bbb nnn bnb nbn", "xxx zzz xzx zxz"], us: ["vvv mmm vmv mvm", "ccc nnn cnc ncn", "bbb nnn bnb nbn", "xxx zzz xzx zxz"] } },
  // Todas las letras.
  { id: "letras", tipo: "letras", letras: { es: "abcdefghijklmnñopqrstuvwxyz", us: "abcdefghijklmnopqrstuvwxyz" }, intro: { es: [], us: [] } },
  // Mayúsculas, comas y puntos.
  { id: "mayusculas", tipo: "frases" },
  // Números.
  { id: "numeros", tipo: "numeros" },
  // Tildes, ñ y signos de apertura (solo en los teclados españoles).
  { id: "tildes", tipo: "tildes", soloEspanol: true },
  // Símbolos para fórmulas y código.
  { id: "simbolos", tipo: "simbolos" },
];

// Ejercicios de la lección de números: primero las filas de cada dedo.
const INTRO_NUMEROS = ["111 222 333", "444 555 666", "777 888 999", "000 123 456", "789 012 345"];
// Ejercicios fijos de la lección de tildes: preguntas y exclamaciones.
const SIGNOS_ESPANOL = ["¿Qué tal?", "¡Hola!", "¿Cómo estás?", "¡Qué bien!", "¿Dónde está?", "¡Feliz día!", "¿Por qué?", "¡Ánimo!", "¿Cuánto cuesta?", "¡Muchas gracias!"];
// Ejercicios de la lección de símbolos: lo que más se usa en fórmulas, correos y código.
const SIMBOLOS = [
  "(a + b) * c", "x^2 + y^2", "a = b / 2", "x < y", "a >= b", "[1, 2, 3]", "{ }", "nombre@correo.com",
  "#etiqueta", "50% de 80", "a_b", "x != y", '"texto"', "'a'", "a | b", "a & b", "~/docs", "$100",
  "3 + 4 = 7", "10 - 2 * 3", "f(x) = 2x + 1", "(x + 1)^2", "x = -b / 2a", "a; b; c", "a: 1, b: 2", "2 > 1",
  "1 + 1 == 2", "[a, b]", "{a: 1}", "?!", "C:\\Usuarios", "a/b/c", "i++", "x += 5", "#1", "100%",
];

// Generador de números al azar con semilla: siempre da la misma serie para la misma semilla.
// Así las lecciones son siempre iguales y sus ejercicios se pueden recordar como «vistos».
function azarConSemilla(semilla) {
  // Estado interno (entero de 32 bits).
  let estado = semilla >>> 0;
  // Devolvemos una función que da números entre 0 y 1 (algoritmo mulberry32).
  return () => {
    // Avanzamos el estado.
    estado = (estado + 0x6d2b79f5) >>> 0;
    // Mezclamos los bits.
    let mezcla = Math.imul(estado ^ (estado >>> 15), 1 | estado);
    // Mezclamos otra vez.
    mezcla = (mezcla + Math.imul(mezcla ^ (mezcla >>> 7), 61 | mezcla)) ^ mezcla;
    // Pasamos a un número entre 0 y 1.
    return ((mezcla ^ (mezcla >>> 14)) >>> 0) / 4294967296;
  };
}

// Palabras ya sacadas de cada lista de frases (para no repetir el trabajo con cada lección).
const PALABRAS_GUARDADAS = new WeakMap();

// Saca las palabras distintas (en minúscula) de una lista de frases.
function palabrasDe(frases) {
  // Si ya las sacamos de esta misma lista, las devolvemos.
  if (PALABRAS_GUARDADAS.has(frases)) {
    // Lista guardada.
    return PALABRAS_GUARDADAS.get(frases);
  }
  // Conjunto de palabras, para no repetir.
  const palabras = new Set();
  // Recorremos las frases.
  for (const frase of frases) {
    // Palabras de la frase (letras del español y del inglés).
    for (const palabra of frase.toLowerCase().match(/[a-záéíóúüñ]+/g) || []) {
      // La añadimos.
      palabras.add(palabra);
    }
  }
  // Lista ordenada (para que el resultado no dependa del orden de las frases).
  const lista = [...palabras].sort();
  // La guardamos para la próxima vez.
  PALABRAS_GUARDADAS.set(frases, lista);
  // La devolvemos.
  return lista;
}

// Junta palabras al azar en líneas de ejercicio.
//   palabras: lista de palabras posibles
//   cantidad: cuántas líneas
//   largo:    largo máximo de cada línea
//   azar:     generador de números al azar
function lineasDePalabras(palabras, cantidad, largo, azar) {
  // Líneas creadas.
  const lineas = [];
  // Si no hay palabras, no hay líneas.
  if (palabras.length === 0) {
    // Lista vacía.
    return lineas;
  }
  // Creamos las líneas.
  for (let i = 0; i < cantidad; i++) {
    // Palabras de esta línea.
    const linea = [];
    // Añadimos palabras mientras quepan (al menos dos por línea).
    while (true) {
      // Palabra al azar.
      const palabra = palabras[Math.floor(azar() * palabras.length)];
      // Largo de la línea si la añadimos.
      const nuevoLargo = linea.join(" ").length + (linea.length > 0 ? 1 : 0) + palabra.length;
      // Si ya hay dos y no cabe, terminamos la línea.
      if (linea.length >= 2 && nuevoLargo > largo) {
        // Fin de la línea.
        break;
      }
      // La añadimos.
      linea.push(palabra);
      // Con cinco palabras ya es suficiente.
      if (linea.length >= 5) {
        // Fin de la línea.
        break;
      }
    }
    // Guardamos la línea.
    lineas.push(linea.join(" "));
  }
  // Devolvemos las líneas, sin repetir.
  return [...new Set(lineas)];
}

// Prepara los ejercicios de una lección para un teclado.
//   leccion:      una de LECCIONES
//   disposicion:  "es", "la" o "us"
//   fuentes:      { frasesEs, frasesEn } textos de donde sacar palabras y frases
// Devuelve una lista de [número, texto] (vacía si la lección no sirve para ese teclado).
function ejerciciosDeLeccion(leccion, disposicion, fuentes) {
  // Familia del teclado: española (es y la, con ñ y tildes) o inglesa (us).
  const familia = disposicion === "us" ? "us" : "es";
  // La lección de tildes no existe en el teclado inglés (no tiene tildes).
  if (leccion.soloEspanol && familia === "us") {
    // Sin ejercicios.
    return [];
  }
  // Generador al azar con una semilla propia de la lección.
  const azar = azarConSemilla(LECCIONES.indexOf(leccion) + 1);
  // Frases del idioma del teclado.
  const frases = familia === "us" ? fuentes.frasesEn : fuentes.frasesEs;
  // Textos de los ejercicios.
  let textos = [];
  // Lecciones de letras: palabras que solo usan las letras permitidas.
  if (leccion.tipo === "letras") {
    // Letras permitidas.
    const letras = leccion.letras[familia];
    // Palabras de 2 a 8 letras hechas solo con esas letras.
    const validas = palabrasDe(frases).filter((palabra) => palabra.length >= 2 && palabra.length <= 8 && [...palabra].every((letra) => letras.includes(letra)));
    // Primero los ejercicios de introducción y después las líneas de palabras.
    textos = [...leccion.intro[familia], ...lineasDePalabras(validas, 50, 30, azar)];
  }
  // Mayúsculas: frases cortas con mayúscula, comas y puntos (sin tildes).
  if (leccion.tipo === "frases") {
    // Frases que solo tienen letras sin tilde, ñ, espacios, comas y puntos.
    const validas = frases.filter((frase) => frase.length <= 40 && /^[A-ZÑ][A-Za-zÑñ ,.]*\.$/.test(frase));
    // Elegimos 50 al azar (sin repetir).
    textos = mezclarConAzar(validas, azar).slice(0, 50);
  }
  // Números: grupos de cifras.
  if (leccion.tipo === "numeros") {
    // Líneas generadas.
    const lineas = [];
    // Creamos 45 líneas.
    for (let i = 0; i < 45; i++) {
      // Cuántos grupos (3 o 4).
      const grupos = 3 + Math.floor(azar() * 2);
      // Grupos de 2 a 4 cifras.
      const partes = [];
      // Creamos cada grupo.
      for (let g = 0; g < grupos; g++) {
        // Largo del grupo.
        const largo = 2 + Math.floor(azar() * 3);
        // Cifras al azar.
        let grupo = "";
        // Añadimos las cifras.
        for (let c = 0; c < largo; c++) {
          // Una cifra.
          grupo += Math.floor(azar() * 10);
        }
        // Guardamos el grupo.
        partes.push(grupo);
      }
      // Guardamos la línea.
      lineas.push(partes.join(" "));
    }
    // Primero la introducción y después las líneas.
    textos = [...INTRO_NUMEROS, ...lineas];
  }
  // Tildes: palabras con tilde, ñ o diéresis, y frases con ¿? ¡!.
  if (leccion.tipo === "tildes") {
    // Palabras de 3 a 9 letras con alguna de esas letras.
    const validas = palabrasDe(frases).filter((palabra) => palabra.length >= 3 && palabra.length <= 9 && /[áéíóúüñ]/.test(palabra));
    // Signos y después líneas de palabras.
    textos = [...SIGNOS_ESPANOL, ...lineasDePalabras(validas, 40, 30, azar)];
  }
  // Símbolos: la lista fija.
  if (leccion.tipo === "simbolos") {
    // Todos los ejercicios de símbolos.
    textos = [...SIMBOLOS];
  }
  // Numeramos los ejercicios (sin repetir textos).
  return [...new Set(textos)].map((texto, posicion) => [posicion + 1, texto]);
}

// Mezcla una lista con un generador de azar dado (Fisher-Yates) y devuelve una copia.
function mezclarConAzar(lista, azar) {
  // Copia de la lista.
  const copia = [...lista];
  // Recorremos de atrás hacia delante.
  for (let i = copia.length - 1; i > 0; i--) {
    // Posición al azar entre 0 e i.
    const j = Math.floor(azar() * (i + 1));
    // Intercambiamos.
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  // Devolvemos la copia.
  return copia;
}

// Si este archivo se carga desde Node (en las pruebas), exportamos lo necesario.
if (typeof module !== "undefined" && module.exports) {
  // Lista de lo que pueden usar las pruebas.
  module.exports = { DISPOSICIONES, LECCIONES, dedoDe, esManoIzquierda, pasosPara, disposicionPorIdioma, disposicionPorMapa, palabrasDe, ejerciciosDeLeccion };
}
