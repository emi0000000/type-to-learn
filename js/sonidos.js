// sonidos.js: efectos de sonido del juego, creados al momento con el sintetizador del navegador (Web Audio).
// No usa archivos de audio: cada sonido son unas pocas notas o un golpe de ruido muy corto.
// Se pueden apagar en los ajustes ("Efectos de sonido" y "Sonido de máquina de escribir al teclear").

// Todo va dentro de una función que se ejecuta al momento, para no llenar el espacio global.
const Sonidos = (() => {
  // Volumen general de los efectos (de 0 a 1): bajo, para que no moleste.
  const VOLUMEN = 0.16;
  // Contexto de audio (se crea la primera vez que hace falta, porque el navegador lo pide tras un clic o una tecla).
  let contexto = null;
  // Golpe de ruido ya preparado para el sonido de las teclas.
  let ruido = null;

  // Devuelve el contexto de audio, creándolo si hace falta; null si el navegador no tiene audio.
  function preparar() {
    // Si aún no existe...
    if (!contexto) {
      // ...buscamos la clase de contexto (con prefijo en Safari antiguo).
      const Clase = window.AudioContext || window.webkitAudioContext;
      // Si no hay, no podemos sonar.
      if (!Clase) {
        // Sin audio.
        return null;
      }
      // Creamos el contexto.
      contexto = new Clase();
    }
    // Si está en pausa (el navegador lo pausa hasta que hay un clic), lo reanudamos.
    if (contexto.state === "suspended") {
      // Reanudamos sin esperar.
      contexto.resume().catch(() => {});
    }
    // Devolvemos el contexto.
    return contexto;
  }

  // Toca una nota.
  //   frecuencia: altura en hercios (440 es el la)
  //   inicio:     cuándo empieza, en segundos del contexto
  //   duracion:   cuánto dura, en segundos
  //   tipo:       forma de la onda ("sine" suave, "triangle", "square", "sawtooth" áspera)
  //   volumen:    fuerza de la nota (de 0 a 1)
  //   hasta:      frecuencia final, si la nota se desliza (opcional)
  function nota(c, frecuencia, inicio, duracion, { tipo = "sine", volumen = 1, hasta = null } = {}) {
    // Oscilador: genera la onda.
    const oscilador = c.createOscillator();
    // Ganancia: controla el volumen a lo largo de la nota.
    const ganancia = c.createGain();
    // Forma de la onda.
    oscilador.type = tipo;
    // Altura inicial.
    oscilador.frequency.setValueAtTime(frecuencia, inicio);
    // Si la nota se desliza, cambiamos la altura poco a poco hasta el final.
    if (hasta) {
      // Deslizamiento exponencial (suena natural).
      oscilador.frequency.exponentialRampToValueAtTime(hasta, inicio + duracion);
    }
    // Empieza en silencio...
    ganancia.gain.setValueAtTime(0.0001, inicio);
    // ...sube muy rápido al volumen de la nota...
    ganancia.gain.exponentialRampToValueAtTime(VOLUMEN * volumen, inicio + 0.012);
    // ...y se apaga suavemente al final.
    ganancia.gain.exponentialRampToValueAtTime(0.0001, inicio + duracion);
    // Conectamos: oscilador -> ganancia -> altavoces.
    oscilador.connect(ganancia).connect(c.destination);
    // Arrancamos la nota.
    oscilador.start(inicio);
    // Y la paramos un poco después de apagarse.
    oscilador.stop(inicio + duracion + 0.02);
  }

  // Golpe seco de ruido filtrado, como una tecla de máquina de escribir.
  function golpe(c, inicio) {
    // Preparamos el ruido una sola vez: 30 milisegundos de valores al azar.
    if (!ruido) {
      // Búfer de un canal.
      ruido = c.createBuffer(1, Math.floor(c.sampleRate * 0.03), c.sampleRate);
      // Datos del canal.
      const datos = ruido.getChannelData(0);
      // Rellenamos con ruido que se apaga rápido.
      for (let i = 0; i < datos.length; i++) {
        // Valor al azar entre -1 y 1, cada vez más flojo.
        datos[i] = (Math.random() * 2 - 1) * (1 - i / datos.length) ** 3;
      }
    }
    // Fuente que reproduce el ruido.
    const fuente = c.createBufferSource();
    // Le damos el ruido.
    fuente.buffer = ruido;
    // Filtro que deja pasar solo los agudos medios (suena a «clic»).
    const filtro = c.createBiquadFilter();
    // Filtro de banda.
    filtro.type = "bandpass";
    // Centro de la banda, con un poco de azar para que no todas suenen igual.
    filtro.frequency.value = 2200 + Math.random() * 900;
    // Volumen del golpe.
    const ganancia = c.createGain();
    // Más flojo que las notas.
    ganancia.gain.value = VOLUMEN * 0.9;
    // Conectamos: ruido -> filtro -> ganancia -> altavoces.
    fuente.connect(filtro).connect(ganancia).connect(c.destination);
    // Lo tocamos.
    fuente.start(inicio);
  }

  // Cada efecto: qué notas toca. "c" es el contexto y "t" el momento de empezar.
  const EFECTOS = {
    // Al teclear: un clic.
    tecla: (c, t) => golpe(c, t),
    // Al fallar: una nota áspera que cae.
    error: (c, t) => nota(c, 190, t, 0.2, { tipo: "sawtooth", volumen: 0.45, hasta: 95 }),
    // Al superar una frase: dos notas que suben.
    bien: (c, t) => {
      // Primera nota (mi).
      nota(c, 659, t, 0.12, { tipo: "triangle" });
      // Segunda nota, más aguda (si).
      nota(c, 988, t + 0.08, 0.18, { tipo: "triangle" });
    },
    // Al recuperar una vida: un arpegio alegre.
    vida: (c, t) => {
      // Do, mi, sol y do agudo, uno tras otro.
      [523, 659, 784, 1047].forEach((frecuencia, i) => nota(c, frecuencia, t + i * 0.07, 0.2, { tipo: "triangle" }));
    },
    // Al acabar la partida: tres notas que bajan.
    fin: (c, t) => {
      // La, fa y do, uno tras otro.
      [440, 349, 262].forEach((frecuencia, i) => nota(c, frecuencia, t + i * 0.16, 0.28, { tipo: "sine", volumen: 0.9 }));
    },
    // Al batir el récord: una pequeña fanfarria.
    record: (c, t) => {
      // Notas de la fanfarria y cuándo suena cada una.
      [[523, 0], [659, 0.1], [784, 0.2], [1047, 0.32], [784, 0.46], [1047, 0.56]].forEach(([frecuencia, retraso]) =>
        // Tocamos cada nota.
        nota(c, frecuencia, t + retraso, 0.22, { tipo: "triangle" }),
      );
    },
  };

  // Toca un efecto por su nombre, si los ajustes lo permiten.
  function reproducir(nombre) {
    // El clic de las teclas tiene su propio ajuste; el resto, el de efectos.
    const permitido = nombre === "tecla" ? Ajustes.valor("teclas") : Ajustes.valor("sonido");
    // Si está apagado, o el efecto no existe, no suena.
    if (!permitido || !EFECTOS[nombre]) {
      // Salimos.
      return;
    }
    // Contexto de audio.
    const c = preparar();
    // Sin audio en este navegador, no suena.
    if (!c) {
      // Salimos.
      return;
    }
    // Intentamos tocar (si algo falla, el juego sigue en silencio).
    try {
      // Empezamos un instante después, para que no se corte el principio.
      EFECTOS[nombre](c, c.currentTime + 0.01);
      // Si falla...
    } catch (error) {
      // ...seguimos sin sonido.
    }
  }

  // El navegador solo deja sonar después de un clic o una tecla: preparamos el audio en el primero.
  for (const tipo of ["pointerdown", "keydown"]) {
    // Con el primer evento de cada tipo, si hay algún sonido encendido, creamos el contexto.
    document.addEventListener(tipo, () => (Ajustes.valor("sonido") || Ajustes.valor("teclas")) && preparar(), { once: true, capture: true });
  }

  // Lo que este archivo ofrece al resto del juego.
  return { reproducir };
})();
