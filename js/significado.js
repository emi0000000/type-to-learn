// significado.js: prepara la pregunta "¿Qué significa?" de los modos inglés y español.
// Elige dos traducciones parecidas pero equivocadas para acompañar a la correcta.
// Funciona en las dos direcciones: inglés -> español (modo inglés) y español -> inglés (modo español).
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

// Simplifica una frase en español para comparar si dos frases dicen lo mismo:
// minúsculas y solo letras (se quitan espacios, signos y mayúsculas).
function simplificarEspanol(texto) {
  // Pasamos a minúscula y quitamos todo lo que no sea una letra del español.
  return texto.normalize("NFC").toLowerCase().replace(/[^a-záéíóúñü]/g, "");
}

// Artículos y pronombres que solo cambian por género o número ("el" y "la" dicen lo mismo en inglés).
const ARTICULOS = { el: "el", la: "el", los: "el", las: "el", lo: "el", un: "un", una: "un", unos: "un", unas: "un" };

// Firma de una frase en español que ignora el género: "Estoy cansada." y "Estoy cansado." dan lo mismo.
// Sirve para no ofrecer como «equivocada» una traducción que solo cambia de masculino a femenino,
// porque en inglés las dos se dicen igual ("I'm tired.").
function firmaEspanol(texto) {
  // Sacamos las palabras en minúscula.
  const palabras = texto.normalize("NFC").toLowerCase().match(/[a-záéíóúñü]+/g) || [];
  // Cambiamos cada palabra por su forma neutra y las unimos.
  return palabras
    // Artículos: todos iguales; el resto: quitamos la terminación -o, -a, -os, -as.
    .map((palabra) => ARTICULOS[palabra] || palabra.replace(/(os|as|o|a)$/, ""))
    // Unimos con espacios.
    .join(" ");
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

// Envuelve una función de un texto para que recuerde sus resultados y no los repita.
// Así, preparar cada pregunta (que repasa miles de frases) es casi instantáneo a partir de la segunda.
function memorizar(funcion) {
  // Resultados ya calculados: texto -> resultado.
  const guardados = new Map();
  // Devolvemos la función que mira primero en lo guardado.
  return (texto) => {
    // Si no lo teníamos, lo calculamos y lo guardamos.
    if (!guardados.has(texto)) {
      // Guardamos el resultado.
      guardados.set(texto, funcion(texto));
    }
    // Devolvemos el resultado guardado.
    return guardados.get(texto);
  };
}

// Versión que recuerda resultados de palabrasLargas, para usarla al recorrer todas las frases.
const palabrasLargasRapido = memorizar(palabrasLargas);

// Cómo se comparan las frases en cada dirección:
//   simplificarPregunta: deja igual dos frases de la pregunta que dicen lo mismo
//   simplificarRespuesta: deja igual dos traducciones que dicen lo mismo
// Por defecto, la del modo inglés: la pregunta está en inglés y las respuestas en español.
const INGLES_A_ESPANOL = { simplificarPregunta: memorizar(simplificarIngles), simplificarRespuesta: memorizar(firmaEspanol) };
// La del modo español: la pregunta está en español y las respuestas en inglés.
const ESPANOL_A_INGLES = { simplificarPregunta: memorizar(firmaEspanol), simplificarRespuesta: memorizar(simplificarIngles) };

// Devuelve las traducciones que pueden servir de opción equivocada, de más a menos parecidas.
//   frases:    lista del modo, cada una [número, frase, autor, número, traducción, autor]
//   correcta:  la frase de la pregunta
//   direccion: INGLES_A_ESPANOL (por defecto) o ESPANOL_A_INGLES
function traduccionesParecidas(frases, correcta, direccion = INGLES_A_ESPANOL) {
  // Traducción correcta.
  const traduccion = correcta[4];
  // Frase de la pregunta simplificada, para descartar frases que dicen lo mismo.
  const pregunta = direccion.simplificarPregunta(correcta[1]);
  // Traducción correcta simplificada, para descartar traducciones equivalentes.
  const respuesta = direccion.simplificarRespuesta(traduccion);
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
    // Si repite un texto, si su frase dice lo mismo que la de la pregunta
    // o si su traducción equivale a la correcta, no sirve.
    if (usados.has(texto) || direccion.simplificarPregunta(frase[1]) === pregunta || direccion.simplificarRespuesta(texto) === respuesta) {
      // Pasamos a la siguiente.
      continue;
    }
    // Recordamos el texto.
    usados.add(texto);
    // Contamos cuántas palabras largas comparte con la traducción correcta.
    let compartidas = 0;
    // Recorremos sus palabras largas.
    for (const palabra of palabrasLargasRapido(texto)) {
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
//   cantidad:  número total de opciones (3 por defecto)
//   azar:      función que da un número entre 0 y 1 (se puede cambiar en las pruebas)
//   direccion: INGLES_A_ESPANOL (por defecto) o ESPANOL_A_INGLES
function elegirOpciones(frases, correcta, cantidad = 3, azar = Math.random, direccion = INGLES_A_ESPANOL) {
  // Tomamos las traducciones más parecidas y las mezclamos.
  const cercanas = mezclar(traduccionesParecidas(frases, correcta, direccion).slice(0, CERCANAS), azar);
  // Nos quedamos con las que hacen falta para completar las opciones.
  const equivocadas = cercanas.slice(0, cantidad - 1);
  // Juntamos la correcta con las equivocadas y lo mezclamos todo.
  return mezclar([correcta[4], ...equivocadas], azar);
}

// Da la vuelta a las parejas inglés-español para el modo español: la frase que se copia pasa a ser la española.
//   parejas: [número, inglés, autor, número, español, autor]
// Devuelve [número, español, autor, número, inglés, autor], sin repetir frases en español
// (en Tatoeba una frase en español puede tener varias traducciones al inglés: nos quedamos con la primera).
function invertirParejas(parejas) {
  // Números de las frases en español ya incluidas.
  const numeros = new Set();
  // Textos en español ya incluidos.
  const textos = new Set();
  // Lista final.
  const invertidas = [];
  // Recorremos las parejas.
  for (const [numeroEn, ingles, autorEn, numeroEs, espanol, autorEs] of parejas) {
    // Si esta frase en español ya está, la saltamos.
    if (numeros.has(numeroEs) || textos.has(espanol)) {
      // Siguiente pareja.
      continue;
    }
    // La anotamos por su número...
    numeros.add(numeroEs);
    // ...y por su texto.
    textos.add(espanol);
    // Añadimos la pareja al revés.
    invertidas.push([numeroEs, espanol, autorEs, numeroEn, ingles, autorEn]);
  }
  // Devolvemos la lista.
  return invertidas;
}

// Si este archivo se carga desde Node (en las pruebas), exportamos las funciones.
if (typeof module !== "undefined" && module.exports) {
  // Lista de funciones que pueden usar las pruebas.
  module.exports = {
    palabrasLargas, // palabras de 4 letras o más
    simplificarIngles, // comparar frases en inglés
    simplificarEspanol, // comparar frases en español
    firmaEspanol, // comparar frases en español sin tener en cuenta el género
    mezclar, // mezclar listas
    traduccionesParecidas, // candidatas a opción equivocada
    elegirOpciones, // opciones de la pregunta
    invertirParejas, // parejas para el modo español
    INGLES_A_ESPANOL, // dirección del modo inglés
    ESPANOL_A_INGLES, // dirección del modo español
  };
}
