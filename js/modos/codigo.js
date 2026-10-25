// modos/codigo.js: los modos de programación y de análisis de datos.
// Para cada lista de líneas de código (o de fórmulas de hoja de cálculo) hay tres modos:
// - «Escribe»: copias una línea viendo qué hace y luego eliges qué hace.
// - «Detecta el error»: ves qué tiene que hacer una línea y eliges la versión bien escrita entre tres
//   (las otras tienen errores típicos); después la escribes.
// - «Casos de uso»: ves una tarea y eliges qué código la hace; después lo escribes.
// La sección Código usa datos/codigo.js (Python, JavaScript, HTML y CSS, SQL, terminal y Git) y
// la sección Datos usa datos/analisis.js (Excel / Google Sheets, pandas y NumPy).
// Además está «¿Qué lenguaje es?», con líneas de muchos lenguajes (datos/lenguajes.js).
// Usan las partes comunes de traduccion.js y eleccion.js.

// Elige el texto del idioma de la interfaz si viene en pareja [español, inglés]; si es un texto, tal cual.
function segunIdioma(valor) {
  // Pareja: el del idioma; texto: tal cual.
  return Array.isArray(valor) ? (idiomaActual() === "en" ? valor[1] : valor[0]) : valor;
}

// Crea los tres modos de una lista de código.
//   prefijo:      comienzo del nombre interno de los modos ("codigo" o "datos")
//   lista():      función que devuelve las líneas
//   ajuste:       ajuste que guarda el lenguaje (o herramienta) elegido
//   lenguajes:    lenguajes de la lista, en el orden del desplegable
function crearModosDeCodigo({ prefijo, lista, ajuste, lenguajes }) {
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
    const lenguaje = Ajustes.valor(ajuste);
    // Clave: lenguaje e idioma de la interfaz (el código de Excel cambia con el idioma).
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
        .map((entrada) => [entrada[0], segunIdioma(entrada[2]), "", entrada[0], queHace(entrada), "", entrada]);
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

  // «Escribe»: copiar y elegir qué hace.
  const escribir = Traduccion.crear({
    ...comunes, // propiedades comunes
    id: `${prefijo}-escribir`, // nombre interno
    idiomaTraduccion: () => idiomaActual(), // la explicación está en el idioma de la interfaz
    etiquetaTraduccion: "codigo.queHace", // etiqueta "Qué hace"
    tituloPregunta: "codigo.pregunta.queHace", // "¿Qué hace este código?"
    opciones: (frase) => otrasDelLenguaje(frase[6], 2).map(queHace), // explicaciones de otras líneas
  });

  // «Detecta el error»: elegir la versión bien escrita y escribirla.
  const errores = Eleccion.crear({
    ...comunes, // propiedades comunes
    id: `${prefijo}-errores`, // nombre interno
    consigna: (frase) => queHace(frase[6]), // qué tiene que hacer la línea
    tituloPregunta: "codigo.pregunta.correcta", // "¿Cuál está bien escrita?"
    // Opciones: la correcta y las dos versiones con error (con su explicación).
    opciones: (frase) => [{ texto: frase[1], correcta: true }, ...frase[6][5].map((error) => ({ texto: segunIdioma(error[0]), correcta: false, explicacion: porQue(error) }))],
  });

  // «Casos de uso»: elegir qué código hace una tarea y escribirlo.
  const usos = Eleccion.crear({
    ...comunes, // propiedades comunes
    id: `${prefijo}-usos`, // nombre interno
    consigna: (frase) => queHace(frase[6]), // la tarea
    tituloPregunta: "codigo.pregunta.cual", // "¿Qué código lo hace?"
    // Opciones: el código correcto y otros dos del mismo lenguaje (explicando qué hacen).
    opciones: (frase) => [
      // El correcto.
      { texto: frase[1], correcta: true },
      // Otros dos, con lo que hacen en realidad.
      ...otrasDelLenguaje(frase[6], 2).map((otra) => ({ texto: segunIdioma(otra[2]), correcta: false, explicacion: t("codigo.esoHace", { que: queHace(otra) }) })),
    ],
  });

  // Los tres modos y los lenguajes (para el desplegable del menú).
  return { escribir, errores, usos, LENGUAJES: lenguajes };
}

// Modos de la sección Código.
const ModosCodigo = crearModosDeCodigo({
  prefijo: "codigo", // nombre interno: codigo-escribir...
  lista: () => (typeof CODIGO === "undefined" ? [] : CODIGO), // datos/codigo.js
  ajuste: "lenguajeCodigo", // lenguaje elegido
  lenguajes: ["python", "javascript", "web", "sql", "terminal"], // lenguajes
});

// Modos de la sección Datos.
const ModosDatos = crearModosDeCodigo({
  prefijo: "datos", // nombre interno: datos-escribir...
  lista: () => (typeof ANALISIS === "undefined" ? [] : ANALISIS), // datos/analisis.js
  ajuste: "herramientaDatos", // herramienta elegida
  lenguajes: ["excel", "pandas", "numpy"], // herramientas
});

// «¿Qué lenguaje es?»: se ve una línea de código y hay que elegir en qué lenguaje está escrita.
const ModoLenguaje = (() => {
  // Lista de líneas; vacía si el archivo no se pudo cargar.
  // Cada una es [número, lenguaje, código, pista en español, pista en inglés].
  function lista() {
    // LENGUAJES_CODIGO la crea datos/lenguajes.js.
    return typeof LENGUAJES_CODIGO === "undefined" ? [] : LENGUAJES_CODIGO;
  }

  // Lenguajes parecidos a uno (de su misma familia), para las opciones equivocadas.
  function parecidos(lenguaje) {
    // Familias (de datos/lenguajes.js).
    const familias = typeof FAMILIAS_DE_LENGUAJES === "undefined" ? [] : FAMILIAS_DE_LENGUAJES;
    // Lenguajes de las familias que lo incluyen.
    const cercanos = new Set(familias.filter((familia) => familia.includes(lenguaje)).flat());
    // Sin el propio lenguaje.
    cercanos.delete(lenguaje);
    // Si hay pocos, cualquier otro lenguaje de la lista.
    const todos = [...new Set(lista().map((entrada) => entrada[1]))].filter((otro) => otro !== lenguaje);
    // Preferimos los cercanos.
    return cercanos.size >= 2 ? [...cercanos] : todos;
  }

  // Pista de una línea en el idioma de la interfaz.
  function pista(entrada) {
    // Inglés o español.
    return idiomaActual() === "en" ? entrada[4] : entrada[3];
  }

  // Creamos el modo con la parte común de eleccion.js.
  return Eleccion.crear({
    id: "codigo-lenguaje", // nombre interno
    idioma: "zxx", // el código no es de ningún idioma
    sinIdioma: true, // no se muestra el idioma
    sinVoz: true, // no se lee en voz alta
    tapar: false, // el código se ve: es la pista
    codigo: false, // las opciones son nombres de lenguajes (letra normal)
    // Lista de frases: [número, código, "", 0, "", "", datos].
    frases: () => lista().map((entrada) => [entrada[0], entrada[2], "", 0, "", "", entrada]),
    consigna: () => t("lenguaje.consigna"), // "¿En qué lenguaje está escrito este código?"
    tituloPregunta: "lenguaje.pregunta", // "Elige el lenguaje"
    // Opciones: el lenguaje correcto y dos parecidos (con la pista como explicación).
    opciones: (frase) => [
      // El correcto.
      { texto: frase[6][1], correcta: true },
      // Dos parecidos.
      ...mezclar(parecidos(frase[6][1])).slice(0, 2).map((otro) => ({ texto: otro, correcta: false, explicacion: pista(frase[6]) })),
    ],
    // Al acertar, también se enseña la pista (para aprender en qué se nota).
    alAcertar: (frase) => pista(frase[6]),
    creditos: () => [], // contenido propio del proyecto
  });
})();
