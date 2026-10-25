// estadisticas.js: cuenta el progreso de la persona entre partidas.
// Guarda en el navegador los días practicados (para la racha de días), las frases y el tiempo totales,
// y lo mejor de cada modo (velocidad y racha de frases perfectas).
// Las funciones de cálculo no tocan la página, así que se pueden probar con Node (mira tests/).

// Cuántos días practicados se recuerdan como máximo (más de un año).
const MAXIMO_DIAS_GUARDADOS = 400;
// Frases mínimas de una partida para que su velocidad cuente como «mejor velocidad».
// (Con una sola frase corta la velocidad sale exagerada).
const FRASES_PARA_VELOCIDAD = 3;

// Convierte una fecha en un texto "AAAA-MM-DD" con la hora local de la persona.
function fechaLocal(fecha = new Date()) {
  // Año con cuatro cifras.
  const anio = fecha.getFullYear();
  // Mes con dos cifras (getMonth empieza en 0).
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  // Día con dos cifras.
  const dia = String(fecha.getDate()).padStart(2, "0");
  // Lo juntamos.
  return `${anio}-${mes}-${dia}`;
}

// Devuelve el día anterior a uno dado, los dos como texto "AAAA-MM-DD".
function diaAnterior(texto) {
  // Separamos año, mes y día.
  const [anio, mes, dia] = texto.split("-").map(Number);
  // Creamos la fecha a mediodía (así los cambios de hora no la mueven de día).
  const fecha = new Date(anio, mes - 1, dia, 12);
  // Restamos un día.
  fecha.setDate(fecha.getDate() - 1);
  // Devolvemos el texto.
  return fechaLocal(fecha);
}

// Cuenta cuántos días seguidos se ha practicado hasta hoy.
// Si hoy aún no se ha practicado pero ayer sí, la racha sigue viva y cuenta desde ayer.
//   dias: lista de textos "AAAA-MM-DD" de los días practicados
//   hoy:  texto "AAAA-MM-DD" de hoy
function diasSeguidos(dias, hoy = fechaLocal()) {
  // Conjunto de días practicados, para buscar rápido.
  const practicados = new Set(dias);
  // Día desde el que se empieza a contar: hoy si se practicó, si no ayer.
  let dia = practicados.has(hoy) ? hoy : diaAnterior(hoy);
  // Días contados.
  let cuenta = 0;
  // Mientras el día esté entre los practicados...
  while (practicados.has(dia)) {
    // ...lo contamos...
    cuenta++;
    // ...y pasamos al anterior.
    dia = diaAnterior(dia);
  }
  // Devolvemos la racha.
  return cuenta;
}

// Calcula las palabras por minuto: por convenio, una «palabra» son 5 caracteres.
//   letras: caracteres escritos bien
//   ms:     milisegundos que se tardó en escribirlos
function palabrasPorMinuto(letras, ms) {
  // Sin tiempo no hay velocidad.
  if (!(ms > 0)) {
    // Devolvemos 0.
    return 0;
  }
  // Palabras escritas divididas por los minutos, redondeado.
  return Math.round(letras / 5 / (ms / 60000));
}

// Escribe una duración larga de forma corta: "45 s", "12 min" o "1 h 05 min".
function formatearDuracion(segundos) {
  // Redondeamos a segundos enteros (nunca negativos).
  const total = Math.max(0, Math.round(segundos));
  // Menos de un minuto: en segundos.
  if (total < 60) {
    // Por ejemplo "45 s".
    return `${total} s`;
  }
  // Minutos totales.
  const minutos = Math.floor(total / 60);
  // Menos de una hora: en minutos.
  if (minutos < 60) {
    // Por ejemplo "12 min".
    return `${minutos} min`;
  }
  // Horas y minutos sobrantes, con dos cifras.
  return `${Math.floor(minutos / 60)} h ${String(minutos % 60).padStart(2, "0")} min`;
}

// Escribe una duración como un reloj: "2:05" o "1:02:05".
function formatearReloj(segundos) {
  // Redondeamos a segundos enteros (nunca negativos).
  const total = Math.max(0, Math.round(segundos));
  // Horas.
  const horas = Math.floor(total / 3600);
  // Minutos sobrantes.
  const minutos = Math.floor((total % 3600) / 60);
  // Segundos sobrantes, con dos cifras.
  const resto = String(total % 60).padStart(2, "0");
  // Con horas: h:mm:ss; sin horas: m:ss.
  return horas > 0 ? `${horas}:${String(minutos).padStart(2, "0")}:${resto}` : `${minutos}:${resto}`;
}

// Objeto con lo que guarda y lee del navegador (usa Memoria, de memoria.js).
const Estadisticas = {
  // Clave de las estadísticas generales.
  CLAVE: "frase-exacta:estadisticas",

  // Lee las estadísticas generales, con valores por defecto si no hay o están rotas.
  generales() {
    // Leemos lo guardado.
    const datos = typeof Memoria === "undefined" ? null : Memoria.leer(this.CLAVE, null);
    // Devolvemos un objeto completo.
    return {
      frases: Number.isFinite(datos?.frases) ? datos.frases : 0, // frases superadas en total
      segundos: Number.isFinite(datos?.segundos) ? datos.segundos : 0, // tiempo jugado en total
      partidas: Number.isFinite(datos?.partidas) ? datos.partidas : 0, // partidas jugadas
      dias: Array.isArray(datos?.dias) ? datos.dias.filter((dia) => typeof dia === "string") : [], // días practicados
    };
  },

  // Lee lo mejor de un modo: velocidad y racha.
  delModo(id) {
    // Leemos lo guardado.
    const datos = typeof Memoria === "undefined" ? null : Memoria.leer(`frase-exacta:${id}:mejores`, null);
    // Devolvemos un objeto completo.
    return {
      ppm: Number.isFinite(datos?.ppm) ? datos.ppm : 0, // mejor velocidad
      racha: Number.isFinite(datos?.racha) ? datos.racha : 0, // mejor racha de frases perfectas
    };
  },

  // Anota una partida terminada.
  //   id:       modo jugado
  //   frases:   frases superadas
  //   letras:   caracteres escritos bien
  //   segundos: duración de la partida
  //   ppm:      velocidad media
  //   racha:    mejor racha de la partida
  registrar({ id, frases, letras, segundos, ppm, racha }) {
    // Si no se escribió nada, no cuenta como práctica.
    if (frases === 0 && letras === 0) {
      // Salimos sin guardar.
      return;
    }
    // Estadísticas generales actuales.
    const generales = this.generales();
    // Sumamos las frases.
    generales.frases += frases;
    // Sumamos el tiempo.
    generales.segundos += Math.round(segundos);
    // Una partida más.
    generales.partidas++;
    // Día de hoy.
    const hoy = fechaLocal();
    // Si hoy no estaba anotado...
    if (!generales.dias.includes(hoy)) {
      // ...lo añadimos.
      generales.dias.push(hoy);
    }
    // Nos quedamos con los últimos días, para que no crezca sin fin.
    generales.dias = generales.dias.slice(-MAXIMO_DIAS_GUARDADOS);
    // Guardamos.
    Memoria.guardar(this.CLAVE, generales);
    // Lo mejor del modo hasta ahora.
    const mejores = this.delModo(id);
    // La velocidad solo cuenta con suficientes frases.
    if (frases >= FRASES_PARA_VELOCIDAD) {
      // Nos quedamos con la mayor.
      mejores.ppm = Math.max(mejores.ppm, ppm);
    }
    // La mejor racha.
    mejores.racha = Math.max(mejores.racha, racha);
    // Guardamos.
    Memoria.guardar(`frase-exacta:${id}:mejores`, mejores);
  },
};

// Si este archivo se carga desde Node (en las pruebas), exportamos las funciones de cálculo.
if (typeof module !== "undefined" && module.exports) {
  // Lista de lo que pueden usar las pruebas.
  module.exports = { fechaLocal, diaAnterior, diasSeguidos, palabrasPorMinuto, formatearDuracion, formatearReloj };
}
