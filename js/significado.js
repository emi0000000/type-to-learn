// significado.js: prepara la pregunta "¿Qué significa?" del modo inglés.
// Elige dos traducciones parecidas pero equivocadas para acompañar a la correcta.
// No toca la página, solo hace cálculos. Así se puede probar fácilmente con Node (mira tests/).

// Entre cuántas traducciones parecidas se eligen al azar las dos equivocadas.
const CERCANAS = 12;

// Devuelve las palabras de 4 letras o más de un texto en español, en minúscula.
// Las palabras cortas ("el", "de", "que", "Tom") se ignoran porque salen en casi todas las frases.
function palabrasLargas(texto) {
  // Sacamos las palabras (letras del español) en minúscula.
  const palabras = texto.toLowerCase().match(/[a-záéíóúñü]+/g) || [];
  // Nos quedamos con las de 4 letras o más, sin repetir.
  return new Set(palabras.filter((palabra) => palabra.length >= 4));
}

// Simplifica una frase en inglés para comparar si dos frases dicen lo mismo:
// deshace las contracciones ("I'm" -> "i am") y deja solo letras en minúscula.
function simplificarIngles(texto) {
  // Pasamos a minúscula.
  return texto
    .toLowerCase()
    // "can't" -> "cannot".
    .replace(/can't/g, "cannot")
    // "won't" -> "will not".
    .replace(/won't/g, "will not")
    // "n't" -> " not" (don't, isn't...).
    .replace(/n't/g, " not")
    // "'m" -> " am".
    .replace(/'m\b/g, " am")
    // "'re" -> " are".
    .replace(/'re\b/g, " are")
    // "'s" -> " is" (también convierte posesivos, pero solo lo usamos para comparar).
    .replace(/'s\b/g, " is")
    // "'ll" -> " will".
    .replace(/'ll\b/g, " will")
    // "'ve" -> " have".
    .replace(/'ve\b/g, " have")
    // "'d" -> " would".
    .replace(/'d\b/g, " would")
    // Quitamos todo lo que no sea una letra.
    .replace(/[^a-z]/g, "");
}

// Mezcla una lista al azar (algoritmo de Fisher-Yates) y devuelve una copia mezclada.
function mezclar(lista, azar = Math.random) {
  // Copiamos la lista para no cambiar la original.
  const copia = [...lista];
  // Recorremos la lista de atrás hacia delante.
  for (let i = copia.length - 1; i > 0; i--) {
    // Elegimos al azar una posición entre 0 e i.
    const j = Math.floor(azar() * (i + 1));
    // Intercambiamos los elementos de las posiciones i y j.
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  // Devolvemos la copia mezclada.
  return copia;
}

// Devuelve las traducciones que pueden servir de opción equivocada, de más a menos parecidas.
//   frases:   lista del modo inglés, cada una [número, inglés, autor, número, traducción, autor]
//   correcta: la frase de la pregunta
function traduccionesParecidas(frases, correcta) {
  // Traducción correcta.
  const traduccion = correcta[4];
  // Frase en inglés simplificada, para descartar frases que dicen lo mismo.
  const ingles = simplificarIngles(correcta[1]);
  // Palabras largas de la traducción correcta.
  const claves = palabrasLargas(traduccion);
  // Textos ya usados (empezando por la traducción correcta), para no repetir opciones.
  const usados = new Set([traduccion]);
  // Lista de candidatas con sus puntuaciones.
  const candidatas = [];
  // Recorremos todas las frases del modo.
  for (const frase of frases) {
    // Traducción de esta frase.
    const texto = frase[4];
    // Si repite un texto, o su inglés dice lo mismo que la correcta, no sirve.
    if (usados.has(texto) || simplificarIngles(frase[1]) === ingles) {
      // Pasamos a la siguiente.
      continue;
    }
    // Recordamos el texto.
    usados.add(texto);
    // Contamos cuántas palabras largas comparte con la traducción correcta.
    let compartidas = 0;
    // Recorremos sus palabras largas.
    for (const palabra of palabrasLargas(texto)) {
      // Si la correcta también la tiene, sumamos una.
      if (claves.has(palabra)) {
        // Una palabra compartida más.
        compartidas++;
      }
    }
    // Guardamos la candidata con su puntuación y su diferencia de largo.
    candidatas.push({ texto, compartidas, diferencia: Math.abs(texto.length - traduccion.length) });
  }
  // Ordenamos: primero las que comparten más palabras; a igualdad, las de largo más parecido.
  candidatas.sort((a, b) => b.compartidas - a.compartidas || a.diferencia - b.diferencia);
  // Devolvemos solo los textos.
  return candidatas.map((candidata) => candidata.texto);
}

// Elige las opciones de la pregunta: la traducción correcta y otras equivocadas, mezcladas.
//   cantidad: número total de opciones (3 por defecto)
//   azar:     función que da un número entre 0 y 1 (se puede cambiar en las pruebas)
function elegirOpciones(frases, correcta, cantidad = 3, azar = Math.random) {
  // Tomamos las traducciones más parecidas y las mezclamos.
  const cercanas = mezclar(traduccionesParecidas(frases, correcta).slice(0, CERCANAS), azar);
  // Nos quedamos con las que hacen falta para completar las opciones.
  const equivocadas = cercanas.slice(0, cantidad - 1);
  // Juntamos la correcta con las equivocadas y lo mezclamos todo.
  return mezclar([correcta[4], ...equivocadas], azar);
}

// Si este archivo se carga desde Node (en las pruebas), exportamos las funciones.
if (typeof module !== "undefined" && module.exports) {
  // Lista de funciones que pueden usar las pruebas.
  module.exports = { palabrasLargas, simplificarIngles, mezclar, traduccionesParecidas, elegirOpciones };
}
