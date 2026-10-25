// modos/eleccion.js: los modos de «elegir la correcta y luego escribirla».
// Al empezar cada frase, la respuesta está tapada y se ve una consigna (el nombre de una fórmula,
// una tarea...). Hay que elegir la opción correcta entre tres (las otras tienen errores típicos).
// Después se destapa la respuesta correcta y hay que escribirla, para fijarla en la memoria.
// La frase cuenta como superada si se eligió bien; si no, se pierde una vida y se escribe igual, sin contar.
// Lo usan los modos de matemáticas y los de código «Detecta el error» y «Casos de uso».

// Todo va dentro de una función que se ejecuta al momento, para no llenar el espacio global.
const Eleccion = (() => {
  // Milisegundos de pausa tras escribir una frase que no cuenta.
  const PAUSA_SIN_CONTAR = 1200;

  // Crea un modo de elegir y escribir.
  //   tituloPregunta:   clave del título de la pregunta
  //   opciones(frase):  devuelve la lista de { texto, correcta, explicacion } (sin mezclar)
  //   codigo:           true si las opciones son fórmulas o código (letra de máquina)
  //   tapar:            false si la frase se ve mientras se pregunta (cuando la frase es la pista)
  //   alAcertar(frase): (opcional) texto extra que se muestra al acertar (por ejemplo, la pista)
  //   Y cualquier otra propiedad del modo (id, frases, consigna, teclas...) se pasa tal cual al motor.
  function crear(config) {
    // Sacamos los datos propios; el resto se pasa al motor.
    const { tituloPregunta, opciones, codigo = true, tapar = true, alAcertar, ...resto } = config;
    // ¿Se eligió bien la opción de la frase actual?
    let acerto = false;

    // Se llama al mostrar cada frase nueva: tapa la respuesta y hace la pregunta.
    function alMostrarFrase(frase, api) {
      // Todavía no se ha respondido.
      acerto = false;
      // Bloqueamos la escritura y, si toca, tapamos la frase.
      api.tapar(tapar);
      // Hacemos la pregunta con las opciones mezcladas.
      Pregunta.hacer({
        titulo: t(tituloPregunta), // título
        opciones: Pregunta.mezclarOpciones(opciones(frase)), // opciones mezcladas
        codigo, // letra de máquina
        alResponder: (elegida, acierto_) => {
          // Si acertó...
          if (acierto_) {
            // ...lo anotamos...
            acerto = true;
            // ...y le pedimos que la escriba (con la pista, si el modo la da).
            api.mensaje(t("eleccion.bien") + (alAcertar ? ` ${alAcertar(frase)}` : ""), "bien");
            // Si no...
          } else {
            // Explicación: por qué está mal la elegida (si la hay).
            const porque = elegida.explicacion ? ` ${elegida.explicacion}` : "";
            // Pierde una vida; guardamos el error para el repaso.
            const sigue = api.fallar(
              {
                palabra: frase[1], // la respuesta correcta
                marca: -1, // sin letra que resaltar
                espacio: false, // no es un error de espacio
                explicacion: t("eleccion.explicacion", { elegida: elegida.texto }) + porque, // explicación para el repaso
              },
              // Mensaje bajo la caja de texto.
              t("eleccion.fallo", { porque }),
            );
            // Si se acabaron las vidas, no hay nada más que hacer.
            if (!sigue) {
              // Salimos.
              return;
            }
          }
          // Destapamos la respuesta para escribirla.
          api.destapar();
        },
      });
    }

    // Se llama al terminar de escribir la respuesta.
    function alTerminarDeEscribir(frase, api) {
      // Si se eligió bien, la frase cuenta.
      if (acerto) {
        // Superada (perfecta si no hubo errores al escribir).
        api.superar(t(api.sinErrores ? "juego.perfecta" : "juego.completada"));
        // Terminamos aquí.
        return;
      }
      // Si no, pasamos a la siguiente sin contarla.
      api.mensaje(t("eleccion.noCuenta"), "aviso");
      // Siguiente tras una pausa.
      api.siguiente(PAUSA_SIN_CONTAR);
    }

    // Descripción del modo para el motor.
    return {
      // Contenido propio del proyecto: no hay que citar a nadie.
      creditos: () => [],
      // No tiene sentido leer fórmulas o código en voz alta.
      sinVoz: true,
      // No se muestra el idioma de la frase.
      sinIdioma: true,
      // El resto de propiedades del modo.
      ...resto,
      // Pregunta al mostrar la frase.
      alMostrarFrase,
      // Contar (o no) al terminar de escribir.
      alTerminarDeEscribir,
      // Limpieza al acabar.
      alTerminarPartida: () => Pregunta.recoger(),
    };
  }

  // Lo que este archivo ofrece a los modos.
  return { crear };
})();
