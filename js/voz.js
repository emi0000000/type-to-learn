// voz.js: lee frases en voz alta con las voces que trae el sistema (síntesis de voz del navegador).
// Sirve para oír cómo se pronuncia cada frase en inglés o en español.
// No descarga nada: si el navegador no tiene voces, el botón de escuchar se oculta.

// Todo va dentro de una función que se ejecuta al momento, para no llenar el espacio global.
const Voz = (() => {
  // Sintetizador del navegador (null si no tiene).
  const sintesis = "speechSynthesis" in window ? window.speechSynthesis : null;
  // Variantes preferidas de cada idioma, en orden.
  const PREFERIDAS = {
    en: ["en-us", "en-gb", "en-ca", "en-au"], // inglés de Estados Unidos, Reino Unido...
    es: ["es-es", "es-mx", "es-us", "es-419"], // español de España, México...
  };
  // Palabras que suelen tener las voces de mejor calidad.
  const CALIDAD = /natural|neural|premium|enhanced|google|siri/i;
  // Voces disponibles (el navegador las da poco a poco, por eso se vuelven a leer).
  let voces = [];

  // Lee la lista de voces del sistema.
  function cargarVoces() {
    // Solo si hay sintetizador.
    if (sintesis) {
      // Pedimos las voces.
      voces = sintesis.getVoices();
    }
  }

  // Elige la mejor voz para un idioma ("en" o "es"); null si no hay ninguna.
  function elegirVoz(idioma) {
    // Variantes preferidas de ese idioma.
    const preferidas = PREFERIDAS[idioma] || [];
    // Puntuación de una voz: más baja es mejor.
    const puntuar = (voz) => {
      // Código de idioma de la voz, en minúscula y con guion ("en-US" -> "en-us").
      const codigo = voz.lang.toLowerCase().replace("_", "-");
      // Posición de su variante entre las preferidas (si no está, va detrás).
      const posicion = preferidas.indexOf(codigo);
      // Variante + bonificación si parece de buena calidad.
      return (posicion < 0 ? preferidas.length : posicion) - (CALIDAD.test(voz.name) ? 0.5 : 0);
    };
    // Voces de ese idioma, de mejor a peor.
    const delIdioma = voces
      // Solo las de ese idioma.
      .filter((voz) => voz.lang.toLowerCase().startsWith(idioma))
      // Ordenadas por puntuación.
      .sort((a, b) => puntuar(a) - puntuar(b));
    // La primera, o ninguna.
    return delIdioma[0] || null;
  }

  // ¿Se puede leer en voz alta en este navegador?
  function disponible() {
    // Hace falta el sintetizador.
    return sintesis !== null;
  }

  // Lee un texto en voz alta.
  //   idioma: "en" o "es"
  function decir(texto, idioma) {
    // Sin sintetizador, no hay nada que hacer.
    if (!sintesis) {
      // Salimos.
      return;
    }
    // Si estaba leyendo otra cosa, la cortamos.
    sintesis.cancel();
    // Si aún no teníamos las voces, las pedimos ahora.
    if (voces.length === 0) {
      // Leemos la lista.
      cargarVoces();
    }
    // Frase que se va a leer.
    const lectura = new SpeechSynthesisUtterance(texto);
    // Voz elegida.
    const voz = elegirVoz(idioma);
    // Si hay una voz de ese idioma, la usamos.
    if (voz) {
      // Voz.
      lectura.voice = voz;
    }
    // Idioma de la lectura (aunque no haya voz exacta, el sistema elige una).
    lectura.lang = voz ? voz.lang : idioma === "en" ? "en-US" : "es-ES";
    // Velocidad: algo más lenta que la normal, o bastante más lenta si se pidió.
    lectura.rate = Ajustes.valor("vozLenta") ? 0.7 : 0.95;
    // Leemos.
    sintesis.speak(lectura);
  }

  // Corta la lectura en curso.
  function callar() {
    // Solo si hay sintetizador.
    if (sintesis) {
      // Cortamos.
      sintesis.cancel();
    }
  }

  // Si hay sintetizador...
  if (sintesis) {
    // ...leemos las voces ya disponibles...
    cargarVoces();
    // ...y volvemos a leerlas cuando el navegador avise de que hay más.
    sintesis.onvoiceschanged = cargarVoces;
  }

  // Lo que este archivo ofrece al resto del juego.
  return { disponible, decir, callar };
})();
