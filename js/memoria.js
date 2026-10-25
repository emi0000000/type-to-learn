// memoria.js: guarda y lee datos en el navegador (frases ya vistas, récord).
// Usa localStorage, que puede fallar (modo privado, almacenamiento bloqueado).
// Por eso todo va dentro de try/catch: si falla, el juego sigue funcionando sin recordar nada.

// Objeto con las dos operaciones que necesita el juego.
const Memoria = {
  // Lee un valor guardado; si no existe o hay un problema, devuelve el valor por defecto.
  leer(clave, valorPorDefecto) {
    // Intentamos leer del almacenamiento del navegador.
    try {
      // Pedimos el texto guardado con esa clave.
      const guardado = localStorage.getItem(clave);
      // Si no había nada, devolvemos el valor por defecto; si había, lo convertimos de JSON a dato.
      return guardado === null ? valorPorDefecto : JSON.parse(guardado);
      // Si algo falla (almacenamiento bloqueado o dato roto)...
    } catch (error) {
      // ...devolvemos el valor por defecto.
      return valorPorDefecto;
    }
  },

  // Guarda un valor; si no se puede, no hace nada.
  guardar(clave, valor) {
    // Intentamos escribir en el almacenamiento del navegador.
    try {
      // Convertimos el valor a texto JSON y lo guardamos.
      localStorage.setItem(clave, JSON.stringify(valor));
      // Si falla (por ejemplo, almacenamiento lleno o bloqueado)...
    } catch (error) {
      // ...lo ignoramos: el juego sigue, solo que sin recordar este dato.
    }
  },
};
