// modos/seguridad.js: los modos rápidos de la sección Ciberseguridad (los laboratorios están en js/laboratorio.js).
// - «¿Es phishing?»: un correo, SMS o web; eliges si es una estafa, de verdad o solo publicidad, y escribes el remitente.
// - «Código inseguro»: tres versiones de una línea; eliges la segura (las otras tienen fallos típicos) y la escribes.
// - «Lee el registro»: un trozo de registro (log) y una pregunta; escribes la respuesta.
// - «Criptografía»: descifras César, ROT13, hexadecimal o Base64 y escribes el mensaje.
// - «Puertos»: escribes el puerto de un protocolo o el protocolo de un puerto.
// Usan eleccion.js, codigo.js (crearModosDeCodigo) y cripto.js.

// Todo va dentro de una función que se ejecuta al momento, para no llenar el espacio global.
const ModosSeguridad = (() => {
  // Número de nivel de cada valor del desplegable.
  const NIVELES = { facil: 1, medio: 2, dificil: 3 };
  // Texto en el idioma de la interfaz si viene en pareja [español, inglés].
  const bil = (valor) => (Array.isArray(valor) ? (idiomaActual() === "en" ? valor[1] : valor[0]) : valor);
  // Una lista de datos (vacía si el archivo no cargó).
  const datos = (nombre) => (typeof window[nombre] === "undefined" ? [] : window[nombre]);

  // --- ¿Es phishing? ---
  const phishing = Eleccion.crear({
    id: "seguridad-phishing", // nombre interno
    idioma: "zxx", // remitentes y enlaces no son de un idioma
    sinIdioma: true, // no se muestra el idioma
    sinVoz: true, // no se lee
    tapar: false, // el remitente se ve: es parte de la pista
    codigo: false, // opciones en letra normal
    // Frases: [número, remitente o enlace, "", 0, "", "", datos].
    frases: () => datos("PHISHING").map((entrada) => [entrada[0], entrada[2], "", 0, "", "", entrada]),
    etiqueta: (frase) => t(`phishing.canal.${frase[6][1]}`), // correo, SMS o web
    consigna: (frase) => bil(frase[6][3]), // el mensaje
    tituloPregunta: "phishing.pregunta", // "¿Qué es?"
    // Opciones: las tres clases, con la correcta marcada y las pistas como explicación.
    opciones: (frase) => ["phishing", "legitimo", "spam"].map((tipo) => ({ texto: t(`phishing.tipo.${tipo}`), correcta: tipo === frase[6][4], explicacion: bil(frase[6][5]) })),
    alAcertar: (frase) => bil(frase[6][5]), // al acertar, también las pistas
    creditos: () => [], // contenido propio
  });

  // --- Código inseguro (solo el modo de elegir la versión segura) ---
  const inseguro = crearModosDeCodigo({
    prefijo: "seguridad", // nombre interno: seguridad-errores
    lista: () => datos("CODIGO_INSEGURO"), // datos/codigo-inseguro.js
    ajuste: "nivelSeguridad", // nivel elegido en la sección
    lenguajes: ["python", "javascript", "web", "sql", "terminal"], // lenguajes
    filtro: (entrada, nivel) => entrada[6] <= NIVELES[nivel], // los del nivel elegido y los anteriores
  }).errores;

  // Crea un modo de «escribe la respuesta».
  //   id, frases(), enunciado(frase), consigna(frase), comprobar(escrito, frase), solucion(frase), y más opciones
  function modoRespuesta(config) {
    // Lista preparada para cada idioma de la interfaz.
    const preparadas = {};
    // Descripción del modo para el motor.
    return {
      idioma: "zxx", // no es de ningún idioma
      respuesta: true, // se escribe una respuesta
      sinVoz: true, // no se lee
      sinIdioma: true, // no se muestra el idioma
      creditos: () => [], // contenido propio
      largo: (frase) => [10, 30, 50][frase[3] - 1], // dificultad según el nivel
      ...config, // lo propio del modo
      // Lista (preparada una vez por idioma).
      frases() {
        // Idioma de la interfaz.
        const idioma = idiomaActual();
        // Si no está, la preparamos.
        if (!preparadas[idioma]) {
          // Lista.
          preparadas[idioma] = config.frases();
        }
        // Devolvemos.
        return preparadas[idioma];
      },
    };
  }

  // --- Lee el registro ---
  const registros = modoRespuesta({
    id: "seguridad-registros", // nombre interno
    enunciadoBloque: true, // el registro va en bloque, letra pequeña
    // Frases: [número, respuesta, líneas, nivel, datos].
    frases: () => datos("REGISTROS").map((entrada) => [entrada[0], entrada[4], entrada[2].join("\n"), entrada[1], entrada]),
    enunciado: (frase) => frase[2], // el registro
    consigna: (frase) => bil(frase[4][3]), // la pregunta
    // Correcta si coincide con la respuesta o alguna otra válida (sin mayúsculas ni punto final).
    comprobar: (escrito, frase) => {
      // Limpia.
      const limpiar = (texto) => texto.toLowerCase().replace(/\s+/g, " ").replace(/\.$/, "").trim();
      // Alguna coincide.
      return [frase[1], ...frase[4][5]].some((valida) => limpiar(valida) === limpiar(escrito));
    },
    solucion: (frase) => `${frase[1]}. ${bil(frase[4][6])}`, // respuesta y explicación
    etiqueta: () => t("seguridad.registro"), // "Registro"
  });

  // --- Criptografía ---
  const cripto = modoRespuesta({
    id: "seguridad-cripto", // nombre interno
    frases: retosCripto, // retos de cripto.js
    // El enunciado, con «César» en el idioma de la interfaz.
    enunciado: (frase) => frase[2].replace("César", t("cripto.cesar")),
    consigna: () => t("cripto.consigna"), // "Descifra el mensaje"
    comprobar: (escrito, frase) => comprobarCripto(escrito, frase[1]), // sin mayúsculas
    solucion: (frase) => frase[4].replace("César", t("cripto.cesar")), // cómo se descifra
  });

  // --- Puertos ---
  const puertos = modoRespuesta({
    id: "seguridad-puertos", // nombre interno
    frases: () => problemasPuertos(datos("PUERTOS")), // problemas de cripto.js
    enunciado: (frase) => frase[2], // "SSH → ?" o "22 → ?"
    // Consigna: qué hay que escribir (el puerto o el protocolo).
    consigna: (frase) => t(/^\d/.test(frase[2]) ? "puertos.consigna.protocolo" : "puertos.consigna.puerto"),
    comprobar: (escrito, frase) => comprobarPuerto(escrito, frase[1], frase[5]), // sin mayúsculas ni guiones
    solucion: (frase) => frase[4], // "SSH → 22"
    // Nota: para qué sirve.
    nota: (frase) => {
      // Entrada del puerto.
      const entrada = datos("PUERTOS").find((otra) => otra[0] === frase[6]);
      // Para qué sirve (es una pista, no la respuesta).
      return entrada ? (idiomaActual() === "en" ? entrada[4] : entrada[3]) : "";
    },
  });

  // Los cinco modos.
  return { phishing, inseguro, registros, cripto, puertos };
})();
