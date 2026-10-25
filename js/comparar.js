// comparar.js: compara lo que escribe la persona con la frase que tiene que copiar.
// No toca la página, solo hace cálculos. Así se puede probar fácilmente con Node (mira tests/).

// Revisa lo escrito hasta ahora frente a la frase objetivo.
// Devuelve un objeto con:
//   estado:   "incompleta" (va bien, falta texto), "completa" (terminada) o "error"
//   aciertos: cuántos caracteres seguidos coinciden desde el principio
//   esperado: el carácter que tocaba escribir ("" si la frase ya terminó)
//   recibido: el carácter que se escribió en su lugar (solo si hay error)
function revisarEscritura(objetivo, escrito) {
  // Normalizamos la frase para que "á" sea siempre un único carácter.
  const meta = objetivo.normalize("NFC");
  // Hacemos lo mismo con lo escrito (algunos teclados escriben la tilde como un carácter aparte).
  // Además, los teclados de los móviles cambian solos las comillas rectas por curvas (' por ’, " por “):
  // las volvemos rectas, que son las que llevan las frases y el código.
  const texto = escrito.normalize("NFC").replace(/[‘’ʼ]/g, "'").replace(/[“”]/g, '"');
  // Contador de caracteres que coinciden desde el principio.
  let aciertos = 0;
  // Avanzamos mientras queden caracteres en los dos textos y sean iguales.
  while (aciertos < texto.length && aciertos < meta.length && texto[aciertos] === meta[aciertos]) {
    // Este carácter coincide: pasamos al siguiente.
    aciertos++;
  }
  // Si todo lo escrito coincide y tiene el largo exacto de la frase, está terminada.
  if (aciertos === texto.length && aciertos === meta.length) {
    // Devolvemos el resultado "completa".
    return { estado: "completa", aciertos, esperado: "", recibido: "" };
  }
  // Si todo lo escrito coincide pero aún falta texto, va bien.
  if (aciertos === texto.length) {
    // Devolvemos "incompleta" y el siguiente carácter que toca escribir.
    return { estado: "incompleta", aciertos, esperado: meta[aciertos], recibido: "" };
  }
  // En cualquier otro caso hay un error justo en la posición "aciertos".
  return {
    // El estado es "error".
    estado: "error",
    // Cuántos caracteres estaban bien antes del error.
    aciertos,
    // Lo que tocaba escribir; si la frase ya había terminado, no tocaba nada.
    esperado: aciertos < meta.length ? meta[aciertos] : "",
    // Lo que se escribió en su lugar.
    recibido: texto[aciertos],
  };
}

// Devuelve la palabra de la frase que contiene la posición indicada, y dónde empieza.
// Si la posición cae en un espacio, devuelve la palabra anterior (el espacio iba detrás de ella).
function palabraEn(texto, posicion) {
  // Limitamos la posición para que no se salga de la frase.
  let centro = Math.min(Math.max(posicion, 0), texto.length - 1);
  // Si estamos sobre un espacio, retrocedemos a la palabra anterior.
  if (texto[centro] === " " && centro > 0) {
    // Retrocedemos un carácter.
    centro--;
  }
  // Empezamos a buscar el inicio de la palabra desde el centro.
  let inicio = centro;
  // Retrocedemos hasta encontrar un espacio o el principio de la frase.
  while (inicio > 0 && texto[inicio - 1] !== " ") {
    // Un carácter más hacia atrás.
    inicio--;
  }
  // Empezamos a buscar el final de la palabra desde el centro.
  let fin = centro;
  // Avanzamos hasta encontrar un espacio o el final de la frase.
  while (fin < texto.length && texto[fin] !== " ") {
    // Un carácter más hacia delante.
    fin++;
  }
  // Devolvemos la palabra y la posición donde empieza.
  return { palabra: texto.slice(inicio, fin), inicio };
}

// Mensajes de error en cada idioma de la interfaz. {detalle} es "se esperaba «á» y escribiste «a»".
const MENSAJES_DE_ERROR = {
  // Español.
  es: {
    espacio: "un espacio", // cómo se nombra el espacio
    comillas: ["«", "»"], // comillas para citar un carácter
    detalle: "se esperaba {esperado} y escribiste {recibido}", // parte común de casi todos los mensajes
    sobra: "La frase ya terminó: sobra {recibido}.", // texto de más al final
    apertura: "Falta el signo de apertura: {detalle}.", // faltan ¿ o ¡
    apostrofo: "Falta el apóstrofo: {detalle}.", // falta el ' de don't, I'm...
    mayuscula: "Ojo con la mayúscula: {detalle}.", // tocaba mayúscula
    minuscula: "Ojo con la minúscula: {detalle}.", // tocaba minúscula
    faltaTilde: "Falta la tilde: {detalle}.", // tocaba tilde
    sobraTilde: "Sobra la tilde: {detalle}.", // no tocaba tilde
    letra: "Revisa la letra: {detalle}.", // ñ por n, ü por u...
    general: "Error: {detalle}.", // cualquier otro error
  },
  // Inglés (mismas claves que en español).
  en: {
    espacio: "a space", // cómo se nombra el espacio
    comillas: ["“", "”"], // comillas para citar un carácter
    detalle: "expected {esperado} but you typed {recibido}", // parte común
    sobra: "The sentence already ended: {recibido} is extra.", // texto de más al final
    apertura: "Missing the opening mark: {detalle}.", // faltan ¿ o ¡
    apostrofo: "Missing the apostrophe: {detalle}.", // falta el apóstrofo
    mayuscula: "Watch the capital letter: {detalle}.", // tocaba mayúscula
    minuscula: "Watch the lowercase letter: {detalle}.", // tocaba minúscula
    faltaTilde: "Missing the accent: {detalle}.", // tocaba tilde
    sobraTilde: "No accent here: {detalle}.", // no tocaba tilde
    letra: "Check the letter: {detalle}.", // ñ por n, ü por u...
    general: "Mistake: {detalle}.", // cualquier otro error
  },
};

// Convierte un carácter en un texto fácil de leer para los mensajes.
//   idioma: idioma de la interfaz ("es" o "en"); por defecto, español
function nombrarCaracter(caracter, idioma = "es") {
  // Mensajes del idioma pedido (o en español si no existe).
  const mensajes = MENSAJES_DE_ERROR[idioma] || MENSAJES_DE_ERROR.es;
  // Un espacio no se ve, así que lo nombramos con palabras.
  if (caracter === " ") {
    // Texto para el espacio.
    return mensajes.espacio;
  }
  // Cualquier otro carácter va entre comillas.
  return `${mensajes.comillas[0]}${caracter}${mensajes.comillas[1]}`;
}

// Quita tildes, diéresis y virgulillas: "á" -> "a", "ü" -> "u", "ñ" -> "n".
function quitarMarcas(caracter) {
  // Separamos la letra de sus marcas (NFD) y borramos las marcas (rango Unicode 0300-036F).
  return caracter.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Explica con palabras sencillas en qué consiste un error.
//   idioma: idioma de la interfaz ("es" o "en"); por defecto, español
function explicarError(esperado, recibido, idioma = "es") {
  // Mensajes del idioma pedido (o en español si no existe).
  const mensajes = MENSAJES_DE_ERROR[idioma] || MENSAJES_DE_ERROR.es;
  // Rellena los huecos de un mensaje con los caracteres nombrados.
  const rellenar = (plantilla, detalle = "") =>
    // Cambiamos cada hueco por su valor.
    plantilla
      // El detalle común (con una función, para que un "$" escrito no se tome como código especial).
      .replace("{detalle}", () => detalle)
      // El carácter esperado.
      .replace("{esperado}", () => nombrarCaracter(esperado, idioma))
      // El carácter escrito.
      .replace("{recibido}", () => nombrarCaracter(recibido, idioma));
  // Mensaje base que usan casi todos los casos.
  const detalle = rellenar(mensajes.detalle);
  // Caso 1: la frase ya había terminado y se escribió algo de más.
  if (esperado === "") {
    // Explicamos que sobra texto.
    return rellenar(mensajes.sobra);
  }
  // Caso 2: faltan los signos de apertura, que en inglés no existen y se olvidan mucho.
  if (esperado === "¿" || esperado === "¡") {
    // Recordamos que en español se abren las preguntas y exclamaciones.
    return rellenar(mensajes.apertura, detalle);
  }
  // Caso 2 bis: falta el apóstrofo de las contracciones inglesas (don't, I'm).
  if (esperado === "'") {
    // Recordamos el apóstrofo.
    return rellenar(mensajes.apostrofo, detalle);
  }
  // Caso 3: es la misma letra, pero cambia mayúscula por minúscula o al revés.
  if (esperado !== recibido && esperado.toLowerCase() === recibido.toLowerCase()) {
    // Indicamos si tocaba mayúscula o minúscula.
    return rellenar(esperado === esperado.toUpperCase() ? mensajes.mayuscula : mensajes.minuscula, detalle);
  }
  // Caso 4: es la misma letra, pero con o sin tilde, diéresis o virgulilla.
  if (quitarMarcas(esperado).toLowerCase() === quitarMarcas(recibido).toLowerCase()) {
    // ¿La letra esperada lleva tilde (el acento agudo, código 0301)?
    const esperadoConTilde = esperado.normalize("NFD").includes("\u0301");
    // ¿La letra escrita lleva tilde?
    const recibidoConTilde = recibido.normalize("NFD").includes("\u0301");
    // Si tocaba tilde y no se puso, falta.
    if (esperadoConTilde && !recibidoConTilde) {
      // Mensaje de tilde que falta.
      return rellenar(mensajes.faltaTilde, detalle);
    }
    // Si se puso tilde y no tocaba, sobra.
    if (!esperadoConTilde && recibidoConTilde) {
      // Mensaje de tilde que sobra.
      return rellenar(mensajes.sobraTilde, detalle);
    }
    // Otros casos (ñ por n, ü por u...): mensaje general sobre la letra.
    return rellenar(mensajes.letra, detalle);
  }
  // Caso general: cualquier otro carácter equivocado.
  return rellenar(mensajes.general, detalle);
}

// Si este archivo se carga desde Node (en las pruebas), exportamos las funciones.
if (typeof module !== "undefined" && module.exports) {
  // Lista de funciones que pueden usar las pruebas.
  module.exports = { revisarEscritura, palabraEn, nombrarCaracter, quitarMarcas, explicarError, MENSAJES_DE_ERROR };
}
