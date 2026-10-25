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

  // Borra todos los datos cuya clave empieza por un prefijo, salvo los que se indiquen.
  //   prefijo: por ejemplo "frase-exacta:"
  //   excepto: lista de claves que no se borran (por ejemplo, los ajustes)
  borrarConPrefijo(prefijo, excepto = []) {
    // Intentamos borrar del almacenamiento del navegador.
    try {
      // Primero apuntamos las claves (borrar mientras se recorre cambia las posiciones).
      const claves = [];
      // Recorremos todas las claves guardadas.
      for (let i = 0; i < localStorage.length; i++) {
        // Clave de esta posición.
        const clave = localStorage.key(i);
        // Si empieza por el prefijo y no es una excepción, la apuntamos.
        if (clave && clave.startsWith(prefijo) && !excepto.includes(clave)) {
          // La añadimos a la lista.
          claves.push(clave);
        }
      }
      // Borramos las claves apuntadas.
      for (const clave of claves) {
        // Borramos esta.
        localStorage.removeItem(clave);
      }
      // Si falla (almacenamiento bloqueado)...
    } catch (error) {
      // ...no hay nada que borrar.
    }
  },
};
