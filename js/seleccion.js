// seleccion.js: elige la siguiente frase sin repetir y con la dificultad que toca.
// No toca la página, solo hace cálculos. Así se puede probar fácilmente con Node (mira tests/).

// Tramos de dificultad: cuantas más frases completas en la partida, más largas son.
const TRAMOS = [
  // Frases 1 a 5: cortas (hasta 25 caracteres).
  { desde: 0, largoMinimo: 0, largoMaximo: 25 },
  // Frases 6 a 15: medianas (de 26 a 40 caracteres).
  { desde: 5, largoMinimo: 26, largoMaximo: 40 },
  // De la 16 en adelante: largas (41 caracteres o más).
  { desde: 15, largoMinimo: 41, largoMaximo: Infinity },
];

// Devuelve el tramo que corresponde según las frases completadas en la partida.
function tramoSegunProgreso(completadas) {
  // Empezamos suponiendo el primer tramo.
  let elegido = TRAMOS[0];
  // Recorremos los tramos en orden.
  for (const tramo of TRAMOS) {
    // Si ya llegamos al punto donde empieza este tramo...
    if (completadas >= tramo.desde) {
      // ...este pasa a ser el tramo elegido.
      elegido = tramo;
    }
  }
  // Devolvemos el último tramo alcanzado.
  return elegido;
}

// Devuelve el nivel de dificultad (1, 2 o 3) según las frases completadas, para mostrarlo en pantalla.
function nivelSegunProgreso(completadas) {
  // El nivel es la posición del tramo en la lista, empezando en 1.
  return TRAMOS.indexOf(tramoSegunProgreso(completadas)) + 1;
}

// Elige al azar una frase que todavía no se haya usado, del largo que toca.
//   frases:      lista de frases, cada una [número, texto, autor]
//   usadas:      conjunto (Set) con los números de las frases ya vistas
//   completadas: frases completadas en la partida actual
//   azar:        función que da un número entre 0 y 1 (se puede cambiar en las pruebas)
// Devuelve la frase elegida, o null si ya se usaron todas.
function elegirFrase(frases, usadas, completadas, azar = Math.random) {
  // Nos quedamos con las frases que todavía no se han visto.
  const libres = frases.filter((frase) => !usadas.has(frase[0]));
  // Si no queda ninguna, avisamos devolviendo null.
  if (libres.length === 0) {
    // No hay frase que elegir.
    return null;
  }
  // Calculamos qué tramo de dificultad toca.
  const tramo = tramoSegunProgreso(completadas);
  // Entre las libres, buscamos las que tienen el largo de ese tramo.
  const delTramo = libres.filter((frase) => frase[1].length >= tramo.largoMinimo && frase[1].length <= tramo.largoMaximo);
  // Si quedan frases de ese largo las usamos; si no, aceptamos cualquiera de las libres.
  const opciones = delTramo.length > 0 ? delTramo : libres;
  // Elegimos una posición al azar dentro de las opciones.
  const posicion = Math.floor(azar() * opciones.length);
  // Devolvemos la frase de esa posición.
  return opciones[posicion];
}

// Si este archivo se carga desde Node (en las pruebas), exportamos lo necesario.
if (typeof module !== "undefined" && module.exports) {
  // Lista de lo que pueden usar las pruebas.
  module.exports = { TRAMOS, tramoSegunProgreso, nivelSegunProgreso, elegirFrase };
}
