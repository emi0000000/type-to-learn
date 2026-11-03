// teoria.js: la ventana «¿Cómo funciona?», con la explicación del tema de cada modo o laboratorio.
// Las explicaciones están en datos/teoria.js. Se abre desde las tarjetas del menú, desde la partida y desde los laboratorios.

// Todo va dentro de una función que se ejecuta al momento, para no llenar el espacio global.
const Teoria = (() => {
  // Atajo para no escribir document.getElementById cada vez.
  const $ = (id) => document.getElementById(id);
  // Ventana.
  const dialogo = $("teoria");
  // Título de la ventana.
  const titulo = $("teoria-titulo");
  // Contenido de la ventana.
  const contenido = $("teoria-contenido");
  // Tema abierto (para repintarlo si cambia el idioma).
  let abierto = null;

  // Explicaciones; vacías si el archivo no se pudo cargar.
  function lista() {
    // TEORIA la crea datos/teoria.js.
    return typeof TEORIA === "undefined" ? {} : TEORIA;
  }

  // Busca la explicación de un modo o laboratorio. Devuelve su clave o null.
  //   id: nombre interno del modo ("seguridad-cripto", "dictado-en", "lab-vlan", "redes-escribir"...)
  function clave(id) {
    // Claves posibles, de la más concreta a la más general.
    const posibles = [id, id.replace(/-(en|es|fr|pt|it|de)$/, "")];
    // Si es un laboratorio, también la de su sección.
    if (id.startsWith("lab-") && typeof LABORATORIOS !== "undefined") {
      // Laboratorio.
      const lab = LABORATORIOS.find((otro) => `lab-${otro.id}` === id);
      // Su sección.
      posibles.push(lab ? lab.seccion || "redes" : "");
    }
    // Los modos de comandos de redes usan la de redes.
    if (id.startsWith("redes-")) {
      // Redes.
      posibles.push("redes");
    }
    // La primera que exista.
    return posibles.find((posible) => posible && lista()[posible]) || null;
  }

  // ¿Tiene explicación este modo?
  function existe(id) {
    // Hay clave.
    return clave(id) !== null;
  }

  // Texto en el idioma de la interfaz.
  function bil(es, en) {
    // Inglés o español.
    return idiomaActual() === "en" && en !== undefined ? en : es;
  }

  // Pinta la explicación de una clave.
  function pintar(llave) {
    // Tema.
    const tema = lista()[llave];
    // Título.
    titulo.textContent = bil(tema.titulo[0], tema.titulo[1]);
    // Bloques.
    const elementos = tema.bloques.map(([tipo, es, en]) => {
      // Elemento según el tipo: subtítulo, ejemplo o párrafo.
      const elemento = document.createElement(tipo === "h" ? "h3" : tipo === "ej" ? "pre" : "p");
      // Clase para el estilo.
      elemento.className = `teoria-${tipo}`;
      // Texto (los ejemplos son iguales en los dos idiomas).
      elemento.textContent = tipo === "ej" ? es : bil(es, en);
      // Devolvemos.
      return elemento;
    });
    // Los ponemos.
    contenido.replaceChildren(...elementos);
  }

  // Abre la explicación de un modo o laboratorio.
  function abrir(id) {
    // Clave.
    const llave = clave(id);
    // Si no hay, nada.
    if (!llave) {
      // Salimos.
      return;
    }
    // Anotamos.
    abierto = llave;
    // Pintamos.
    pintar(llave);
    // Arriba del todo.
    contenido.scrollTop = 0;
    // Abrimos.
    dialogo.showModal();
  }

  // Al cambiar el idioma con la ventana abierta, se repinta.
  alCambiarIdioma(() => {
    // Solo si está abierta.
    if (dialogo.open && abierto) {
      // Repintar.
      pintar(abierto);
    }
  });

  // Lo que este archivo ofrece al resto del juego.
  return { existe, abrir };
})();
