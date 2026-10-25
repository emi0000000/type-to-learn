// modos/codigo.js: los modos de programación.
// - «Escribe código»: copias una línea de código viendo qué hace y luego eliges qué hace.
// - «Detecta el error»: ves qué tiene que hacer una línea y eliges la versión bien escrita entre tres
//   (las otras tienen errores típicos); después la escribes.
// - «Casos de uso»: ves una tarea y eliges qué código la hace; después lo escribes.
// Se puede elegir el lenguaje (Python, JavaScript, HTML y CSS, SQL, terminal y Git) o todos.
// Usan datos/codigo.js y las partes comunes de traduccion.js y eleccion.js.

// Todo va dentro de una función que se ejecuta al momento, para no llenar el espacio global.
const ModosCodigo = (() => {
  // Lenguajes, en el orden en que se muestran.
  const LENGUAJES = ["python", "javascript", "web", "sql", "terminal"];

  // Lista de líneas de código; vacía si el archivo no se pudo cargar.
  // Cada una es [número, lenguaje, código, qué hace (es), qué hace (en), [[error, por qué (es), por qué (en)], ...]].
  function lista() {
    // CODIGO la crea datos/codigo.js.
    return typeof CODIGO === "undefined" ? [] : CODIGO;
  }

  // Qué hace una línea, en el idioma de la interfaz.
  function queHace(entrada) {
    // Inglés o español.
    return idiomaActual() === "en" ? entrada[4] : entrada[3];
  }

  // Por qué está mal una versión con error, en el idioma de la interfaz.
  function porQue(error) {
    // Inglés o español.
    return idiomaActual() === "en" ? error[2] : error[1];
  }

  // Frases ya preparadas, y para qué lenguaje e idioma se prepararon.
  let preparadas = null;
  // Clave de lo preparado ("python|es"...).
  let clavePreparada = "";

  // Lista de frases: [número, código, "", número, qué hace, "", datos de la línea].
  // Solo las del lenguaje elegido en los ajustes (o todas).
  function frases() {
    // Lenguaje elegido.
    const lenguaje = Ajustes.valor("lenguajeCodigo");
    // Clave: lenguaje e idioma de la interfaz.
    const clave = `${lenguaje}|${idiomaActual()}`;
    // Si cambió algo, las volvemos a preparar.
    if (clave !== clavePreparada) {
      // Anotamos la clave.
      clavePreparada = clave;
      // Líneas del lenguaje (o todas), en formato de frase.
      preparadas = lista()
        // Filtramos por lenguaje.
        .filter((entrada) => lenguaje === "todos" || entrada[1] === lenguaje)
        // Formato de frase.
        .map((entrada) => [entrada[0], entrada[2], "", entrada[0], queHace(entrada), "", entrada]);
    }
    // Devolvemos la lista.
    return preparadas;
  }

  // Elige al azar otras líneas del mismo lenguaje que una dada.
  function otrasDelLenguaje(entrada, cantidad) {
    // Líneas del mismo lenguaje, menos ella.
    const candidatas = lista().filter((otra) => otra[1] === entrada[1] && otra[0] !== entrada[0]);
    // Mezclamos y nos quedamos con las que hacen falta.
    return mezclar(candidatas).slice(0, cantidad);
  }

  // Propiedades comunes a los tres modos.
  const comunes = {
    idioma: "zxx", // el código no es de ningún idioma
    sinIdioma: true, // no se muestra el idioma
    sinVoz: true, // no tiene sentido leer código en voz alta
    frases, // lista de líneas
    etiqueta: (frase) => t(`lenguaje.${frase[6][1]}`), // el lenguaje de la línea
    creditos: () => [], // contenido propio del proyecto
  };

  // «Escribe código»: copiar y elegir qué hace.
  const escribir = Traduccion.crear({
    ...comunes, // propiedades comunes
    id: "codigo-escribir", // nombre interno
    idiomaTraduccion: () => idiomaActual(), // la explicación está en el idioma de la interfaz
    etiquetaTraduccion: "codigo.queHace", // etiqueta "Qué hace"
    tituloPregunta: "codigo.pregunta.queHace", // "¿Qué hace este código?"
    opciones: (frase) => otrasDelLenguaje(frase[6], 2).map(queHace), // explicaciones de otras líneas
  });

  // «Detecta el error»: elegir la versión bien escrita y escribirla.
  const errores = Eleccion.crear({
    ...comunes, // propiedades comunes
    id: "codigo-errores", // nombre interno
    consigna: (frase) => queHace(frase[6]), // qué tiene que hacer la línea
    tituloPregunta: "codigo.pregunta.correcta", // "¿Cuál está bien escrita?"
    // Opciones: la correcta y las dos versiones con error (con su explicación).
    opciones: (frase) => [{ texto: frase[1], correcta: true }, ...frase[6][5].map((error) => ({ texto: error[0], correcta: false, explicacion: porQue(error) }))],
  });

  // «Casos de uso»: elegir qué código hace una tarea y escribirlo.
  const usos = Eleccion.crear({
    ...comunes, // propiedades comunes
    id: "codigo-usos", // nombre interno
    consigna: (frase) => queHace(frase[6]), // la tarea
    tituloPregunta: "codigo.pregunta.cual", // "¿Qué código lo hace?"
    // Opciones: el código correcto y otros dos del mismo lenguaje (explicando qué hacen).
    opciones: (frase) => [
      // El correcto.
      { texto: frase[1], correcta: true },
      // Otros dos, con lo que hacen en realidad.
      ...otrasDelLenguaje(frase[6], 2).map((otra) => ({ texto: otra[2], correcta: false, explicacion: t("codigo.esoHace", { que: queHace(otra) }) })),
    ],
  });

  // Lo que este archivo ofrece al menú.
  return { escribir, errores, usos, LENGUAJES };
})();
