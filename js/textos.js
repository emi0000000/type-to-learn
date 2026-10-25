// textos.js: todos los textos de la interfaz, en español y en inglés.
// La interfaz puede verse en los dos idiomas, para que sirva a quien aprende inglés y a quien aprende español.
// Cada texto tiene una clave ("menu.jugar") y un valor por idioma.
// Un valor puede ser un texto con huecos ({n}, {modo}...) o una función, para los plurales.
// En el HTML, los elementos con data-t="clave" reciben el texto de esa clave al cambiar de idioma.

// Diccionario de textos: un objeto por idioma con las mismas claves.
const TEXTOS = {
  // ===== Español =====
  es: {
    // --- Barra superior ---
    "barra.idioma": "Cambiar el idioma de la interfaz", // botón ES/EN
    "barra.temaClaro": "Cambiar a tema claro", // botón de tema cuando está oscuro
    "barra.temaOscuro": "Cambiar a tema oscuro", // botón de tema cuando está claro
    "barra.instalar": "Instalar app", // botón de instalar
    "barra.pantalla": "Pantalla completa", // botón de pantalla completa
    "barra.salirPantalla": "Salir de pantalla completa", // botón cuando ya está en pantalla completa
    "barra.ajustes": "Ajustes", // botón de ajustes

    // --- Menú ---
    "menu.lema": "Aprende escribiendo: inglés y español, fórmulas de matemáticas, código y el teclado. Copia exacto: cada error te cuesta una vida.", // frase bajo el título
    "menu.diasSeguidos": (d) => (d.n === 1 ? "1 día seguido" : `${d.n} días seguidos`), // racha de días
    "menu.frasesEscritas": (d) => (d.n === 1 ? "1 frase escrita" : `${d.n} frases escritas`), // frases totales
    "menu.tiempo": "{t} practicando", // tiempo total
    "menu.jugar": "Jugar", // botón de cada modo
    "menu.repasar": (d) => `Repasar ${d.n}`, // botón de repaso de cada modo
    "menu.repasarTitulo": "Vuelve a jugar solo las frases en las que fallaste", // ayuda del botón de repaso
    "menu.estado": "{total} frases · {sinVer} sin ver · Récord: {record}", // línea de estado de cada modo
    "menu.estadoPpm": " · Mejor: {ppm} ppm", // añadido si hay mejor velocidad
    "menu.sinFrases": "No se pudieron cargar las frases ({archivo}).", // si falta el archivo de frases
    "menu.reglas": "Cómo se juega", // título de las reglas
    "menu.atajos": "Atajo: pulsa 1, 2, 3... para empezar un modo de la sección.", // pista de teclado
    "menu.secciones": "Secciones", // nombre de las pestañas para lectores de pantalla
    "reglas.1": "Escribe la frase exactamente igual: letras, tildes, mayúsculas, signos y espacios.", // regla 1
    "reglas.2": "Empiezas con 5 vidas (3 en difícil). Cada carácter equivocado resta una.", // regla 2
    "reglas.3": "En Inglés y Español, al terminar de escribir se oculta la traducción y eliges qué significa la frase (teclas 1, 2 o 3). Equivocarte también resta una vida.", // regla 3
    "reglas.4": "Encadena 5 frases perfectas seguidas y recuperas una vida.", // regla 4
    "reglas.5": "Las frases empiezan cortas y se van alargando.", // regla 5
    "reglas.6": "No se repiten frases. Las que fallas se guardan para que puedas repasarlas.", // regla 6
    "reglas.7": "Pulsa el altavoz para escuchar la frase. No se puede pegar texto; si te faltan teclas (ñ, tildes, ¿ ¡), usa los botones de la pantalla.", // regla 7
    "reglas.8": "En Matemáticas y Código, primero eliges la opción correcta (las otras tienen errores típicos) y después la escribes.", // regla 8

    // --- Modos ---
    "modo.ortografia.nombre": "Ortografía", // nombre del modo ortografía
    "modo.ortografia.direccion": "Español", // idioma del modo
    "modo.ortografia.detalle": "Frases en español. Escríbelas exactas: tildes, ñ, ¿ y ¡.", // descripción
    "modo.ingles.nombre": "Inglés", // nombre del modo inglés
    "modo.ingles.direccion": "Inglés → Español", // dirección del modo
    "modo.ingles.detalle": "Escribe la frase en inglés con su traducción a la vista y luego elige qué significa.", // descripción
    "modo.espanol.nombre": "Español", // nombre del modo español
    "modo.espanol.direccion": "Español → Inglés", // dirección del modo
    "modo.espanol.detalle": "Al revés: escribe la frase en español y elige su significado en inglés. Ideal si hablas inglés.", // descripción

    // --- Partida ---
    "juego.frases": "Frases", // contador de frases
    "juego.racha": "Racha", // contador de racha
    "juego.ppm": "PPM", // palabras por minuto (abreviado)
    "juego.ppmTitulo": "Palabras por minuto", // ayuda del contador
    "juego.errores": "Errores", // contador de errores
    "juego.nivel": "Nivel {n}", // nivel de dificultad
    "juego.nivel.1": "frases cortas", // tramo 1
    "juego.nivel.2": "frases medianas", // tramo 2
    "juego.nivel.3": "frases largas", // tramo 3
    "juego.repaso": "Repaso", // etiqueta de partida de repaso
    "juego.practica": "Práctica", // etiqueta de partida de práctica
    "juego.vidas": "Vidas: {n} de {total}", // vidas para lectores de pantalla
    "juego.vidasInfinitas": "Vidas ilimitadas (práctica)", // vidas en práctica
    "juego.escuchar": "Escuchar la frase", // botón de altavoz
    "juego.traduccion": "Traducción", // etiqueta de la traducción
    "juego.escribe": "Escribe la frase", // etiqueta de la caja
    "juego.placeholder": "Escribe aquí la frase…", // texto de ayuda de la caja
    "juego.pregunta": "¿Qué significa?", // título de la pregunta
    "juego.pista": "Pulsa 1, 2 o 3", // pista de teclas
    "juego.teclas": "Caracteres especiales", // fila de botones á, é...
    "juego.mayus": "⇧ Mayús", // botón de mayúsculas
    "juego.mayusTitulo": "La siguiente letra irá en mayúscula", // ayuda del botón de mayúsculas
    "juego.terminar": "Terminar partida", // botón para terminar
    "juego.perfecta": "¡Perfecta!", // frase sin errores
    "juego.completada": "Completada.", // frase con algún error
    "juego.noPegar": "Aquí no se puede pegar texto: escríbelo a mano.", // al intentar pegar
    "juego.listaReiniciada": "Ya te salieron todas las frases. La lista vuelve a empezar.", // al agotar las frases
    "juego.vidaExtra": "¡{n} perfectas seguidas! Recuperas una vida.", // al recuperar una vida
    "fuente.frase": "Frase", // etiqueta del crédito de la frase
    "fuente.traduccion": "Traducción", // etiqueta del crédito de la traducción
    "fuente.enlace": "{etiqueta} n.º {numero} de Tatoeba", // texto del enlace a Tatoeba
    "fuente.autor": ", por {autor}", // autor de la frase

    // --- Pregunta de significado ---
    "traduccion.bienEscrita": "¡Bien escrita! Ahora elige qué significa.", // tras escribir sin errores
    "traduccion.escrita": "Escrita. Ahora elige qué significa.", // tras escribir con errores
    "traduccion.correcto": "¡Correcto! Frase superada.", // al acertar
    "traduccion.fallo": "No es eso: significa {correcta}.", // al fallar
    "traduccion.explicacion": "Significa {correcta}. Elegiste {elegida}.", // explicación para el repaso

    // --- Resultado ---
    "fin.titulo": "Fin de la partida", // título normal
    "fin.record": "¡Nuevo récord!", // título con récord
    "fin.repasoTerminado": "¡Repaso terminado!", // título al acabar un repaso
    "fin.practica": "Práctica terminada", // título al acabar una práctica
    "fin.modo": "Modo {modo}", // nombre del modo jugado
    "fin.unidad": (d) => (d.n === 1 ? "frase superada" : "frases superadas"), // unidad del número grande
    "fin.precision": "Precisión", // cifra de precisión
    "fin.ppm": "Palabras por minuto", // cifra de velocidad
    "fin.mejorRacha": "Mejor racha", // cifra de racha
    "fin.tiempo": "Tiempo", // cifra de tiempo
    "fin.letras": "Letras correctas", // cifra de letras
    "fin.errores": "Errores", // cifra de errores
    "fin.recordEtiqueta": "Récord", // cifra de récord
    "fin.paraRepasar": "Para repasar", // título de la lista de errores
    "fin.sinErrores": "Ningún error. ¡Muy bien!", // si no hubo errores
    "fin.masErrores": "Y {n} errores más.", // si hubo más errores de los que se listan
    "fin.otraVez": "Jugar otra vez", // botón de jugar otra vez
    "fin.repasar": (d) => `Repasar errores (${d.n})`, // botón de repasar
    "fin.volver": "Volver al menú", // botón de volver
    "fin.escuchar": "Escuchar", // botón de altavoz en el repaso

    // --- Ajustes ---
    "ajustes.titulo": "Ajustes", // título del panel
    "ajustes.cerrar": "Cerrar", // botón de cerrar
    "ajustes.seccion.aspecto": "Aspecto", // sección de aspecto
    "ajustes.seccion.juego": "Partida", // sección de partida
    "ajustes.seccion.sonido": "Sonido y voz", // sección de sonido
    "ajustes.seccion.app": "Aplicación", // sección de aplicación
    "ajustes.seccion.datos": "Tus datos", // sección de datos
    "ajustes.idioma": "Idioma de la interfaz", // ajuste de idioma
    "ajustes.tema": "Tema", // ajuste de tema
    "ajustes.tema.oscuro": "Oscuro", // opción de tema
    "ajustes.tema.claro": "Claro", // opción de tema
    "ajustes.tema.auto": "Automático", // opción de tema
    "ajustes.tamano": "Tamaño de la frase", // ajuste de tamaño
    "ajustes.tamano.normal": "Normal", // opción de tamaño
    "ajustes.tamano.grande": "Grande", // opción de tamaño
    "ajustes.tamano.enorme": "Muy grande", // opción de tamaño
    "ajustes.dificultad": "Dificultad", // ajuste de dificultad
    "ajustes.dificultad.normal": "Normal · 5 vidas", // opción de dificultad
    "ajustes.dificultad.dificil": "Difícil · 3 vidas", // opción de dificultad
    "ajustes.dificultad.practica": "Práctica · vidas ilimitadas, sin récord", // opción de dificultad
    "ajustes.pantallaCompleta": "Pantalla completa al empezar a jugar", // ajuste de pantalla completa
    "ajustes.sonido": "Efectos de sonido", // ajuste de sonidos
    "ajustes.teclas": "Sonido de máquina de escribir al teclear", // ajuste de sonido de teclas
    "ajustes.voz": "Leer cada frase en voz alta", // ajuste de voz automática
    "ajustes.vozLenta": "Voz más lenta", // ajuste de velocidad de voz
    "ajustes.sinVoz": "Tu navegador no tiene voces para leer en voz alta.", // aviso sin voces
    "ajustes.borrar": "Borrar mi progreso", // botón de borrar progreso
    "ajustes.borrarConfirmar": "¿Seguro? Se borran tus récords, estadísticas, errores guardados y frases vistas. Los ajustes se mantienen.", // confirmación
    "ajustes.borrado": "Progreso borrado.", // aviso tras borrar
    "app.instalada": "Ya estás usando Frase Exacta como aplicación.", // si ya está instalada
    "app.disponible": "Instálala para abrirla como una aplicación: con su propia ventana, a pantalla completa y sin conexión.", // si se puede instalar
    "app.ios": "En iPhone o iPad: pulsa Compartir y luego «Añadir a pantalla de inicio».", // instrucciones para iOS
    "app.archivo": "Estás abriendo el archivo directamente. Para jugar como aplicación a pantalla completa sin instalar nada, usa abrir-app.bat (Windows) o abrir-app.sh (Mac y Linux). Para instalarla, ábrela desde internet.", // si se abre como archivo
    "app.otro": "Si tu navegador lo permite, busca «Instalar» o «Añadir a pantalla de inicio» en su menú. También puedes jugar a pantalla completa con el botón de la barra.", // otros navegadores

    // --- Secciones del menú ---
    "seccion.idiomas": "Idiomas", // pestaña de idiomas
    "seccion.matematicas": "Matemáticas", // pestaña de matemáticas
    "seccion.codigo": "Código", // pestaña de programación
    "seccion.teclado": "Teclado", // pestaña de teclado
    "seccion.ajuste.lenguajeCodigo": "Lenguaje:", // desplegable de lenguaje
    "seccion.ajuste.teclado": "Tu teclado:", // desplegable de teclado

    // --- Modos nuevos: idiomas ---
    "modo.palabras-ingles.nombre": "Palabras en inglés", // nombre
    "modo.palabras-ingles.direccion": "Vocabulario · EN → ES", // dirección
    "modo.palabras-ingles.detalle": "Más de 450 palabras y expresiones por temas. Escribe la palabra en inglés y elige qué significa.", // descripción
    "modo.palabras-espanol.nombre": "Palabras en español", // nombre
    "modo.palabras-espanol.direccion": "Vocabulario · ES → EN", // dirección
    "modo.palabras-espanol.detalle": "Las mismas palabras al revés, con su género (el, la). Escribe en español y elige el significado en inglés.", // descripción
    "modo.abecedario.nombre": "Abecedario", // nombre
    "modo.abecedario.direccion": "Deletreo · EN y ES", // dirección
    "modo.abecedario.detalle": "Oye y lee una palabra deletreada letra por letra, en inglés o en español, y escríbela.", // descripción

    // --- Modos nuevos: matemáticas ---
    "modo.mates-algebra.nombre": "Álgebra", // nombre
    "modo.mates-algebra.direccion": "Matemáticas", // tema
    "modo.mates-algebra.detalle": "Productos notables, potencias, raíces, fracciones, logaritmos, rectas y progresiones. Elige la fórmula correcta y escríbela.", // descripción
    "modo.mates-trigonometria.nombre": "Trigonometría", // nombre
    "modo.mates-trigonometria.direccion": "Matemáticas", // tema
    "modo.mates-trigonometria.detalle": "Identidades, ángulos notables, teoremas del seno y del coseno, círculos y esferas.", // descripción
    "modo.mates-calculo.nombre": "Cálculo", // nombre
    "modo.mates-calculo.direccion": "Matemáticas", // tema
    "modo.mates-calculo.detalle": "Límites, derivadas e integrales: regla del producto, de la cadena, integración por partes y más.", // descripción

    // --- Modos nuevos: código ---
    "modo.codigo-escribir.nombre": "Escribe código", // nombre
    "modo.codigo-escribir.direccion": "Programación", // tema
    "modo.codigo-escribir.detalle": "Copia líneas de código viendo qué hacen y luego elige qué hace cada una.", // descripción
    "modo.codigo-errores.nombre": "Detecta el error", // nombre
    "modo.codigo-errores.direccion": "Programación", // tema
    "modo.codigo-errores.detalle": "Tres versiones de la misma línea y solo una está bien. Encuéntrala y escríbela.", // descripción
    "modo.codigo-usos.nombre": "Casos de uso", // nombre
    "modo.codigo-usos.direccion": "Programación", // tema
    "modo.codigo-usos.detalle": "Te damos una tarea: elige qué código la hace y escríbelo.", // descripción

    // --- Modos nuevos: lecciones de teclado ---
    "modo.teclado-central.nombre": "Fila central", // nombre
    "modo.teclado-central.direccion": "Lección 1", // número de lección
    "modo.teclado-central.detalle": "Donde descansan los dedos: A S D F y J K L Ñ. Empieza aquí.", // descripción
    "modo.teclado-superior.nombre": "Fila de arriba", // nombre
    "modo.teclado-superior.direccion": "Lección 2", // número de lección
    "modo.teclado-superior.detalle": "Q W E R T Y U I O P, junto con la fila central.", // descripción
    "modo.teclado-inferior.nombre": "Fila de abajo", // nombre
    "modo.teclado-inferior.direccion": "Lección 3", // número de lección
    "modo.teclado-inferior.detalle": "Z X C V B N M, junto con la fila central.", // descripción
    "modo.teclado-letras.nombre": "Todas las letras", // nombre
    "modo.teclado-letras.direccion": "Lección 4", // número de lección
    "modo.teclado-letras.detalle": "Palabras con cualquier letra del teclado.", // descripción
    "modo.teclado-mayusculas.nombre": "Mayúsculas y puntos", // nombre
    "modo.teclado-mayusculas.direccion": "Lección 5", // número de lección
    "modo.teclado-mayusculas.detalle": "Frases cortas con Mayús, comas y puntos.", // descripción
    "modo.teclado-numeros.nombre": "Números", // nombre
    "modo.teclado-numeros.direccion": "Lección 6", // número de lección
    "modo.teclado-numeros.detalle": "La fila de los números, con todos los dedos.", // descripción
    "modo.teclado-tildes.nombre": "Tildes, ñ y ¿ ¡", // nombre
    "modo.teclado-tildes.direccion": "Lección 7", // número de lección
    "modo.teclado-tildes.detalle": "Las teclas muertas: primero ´ y después la vocal. Solo en teclados españoles.", // descripción
    "modo.teclado-simbolos.nombre": "Símbolos", // nombre
    "modo.teclado-simbolos.direccion": "Lección 8", // número de lección
    "modo.teclado-simbolos.detalle": "@ # ^ { } [ ] < > y más: lo que hace falta para fórmulas, correos y código.", // descripción

    // --- Temas del vocabulario y de las matemáticas ---
    "tema.saludos": "Saludos y frases útiles", // tema
    "tema.numeros": "Números", // tema
    "tema.colores": "Colores", // tema
    "tema.dias": "Días y meses", // tema
    "tema.tiempo": "El tiempo", // tema
    "tema.familia": "Familia y personas", // tema
    "tema.cuerpo": "El cuerpo", // tema
    "tema.comida": "Comida y bebida", // tema
    "tema.animales": "Animales", // tema
    "tema.casa": "La casa", // tema
    "tema.ropa": "La ropa", // tema
    "tema.escuela": "La escuela", // tema
    "tema.trabajo": "El trabajo", // tema
    "tema.ciudad": "La ciudad", // tema
    "tema.transporte": "Transporte y viajes", // tema
    "tema.naturaleza": "Clima y naturaleza", // tema
    "tema.verbos": "Verbos", // tema
    "tema.adjetivos": "Adjetivos", // tema
    "tema.preguntas": "Preguntas", // tema
    "tema.tecnologia": "Tecnología", // tema
    "tema.emociones": "Emociones y carácter", // tema
    "tema.algebra": "Álgebra", // tema de matemáticas
    "tema.trigonometria": "Trigonometría", // tema de matemáticas
    "tema.calculo": "Cálculo", // tema de matemáticas

    // --- Lenguajes de programación ---
    "lenguaje.todos": "Todos", // todos los lenguajes
    "lenguaje.python": "Python", // Python
    "lenguaje.javascript": "JavaScript", // JavaScript
    "lenguaje.web": "HTML y CSS", // HTML y CSS
    "lenguaje.sql": "SQL", // SQL
    "lenguaje.terminal": "Terminal y Git", // terminal y Git

    // --- Elegir y escribir (matemáticas y código) ---
    "eleccion.bien": "¡Correcto! Ahora escríbela.", // al acertar la opción
    "eleccion.fallo": "No es esa.{porque} La correcta está en verde: escríbela.", // al fallar la opción
    "eleccion.explicacion": "Elegiste {elegida}.", // explicación para el repaso
    "eleccion.noCuenta": "Escrita. Esta no cuenta porque fallaste la pregunta.", // tras escribir una fallada
    "eleccion.pregunta.formula": "¿Cuál es la fórmula correcta?", // pregunta de matemáticas
    "codigo.queHace": "Qué hace", // etiqueta de la explicación
    "codigo.pregunta.queHace": "¿Qué hace este código?", // pregunta de «Escribe código»
    "codigo.pregunta.correcta": "¿Cuál está bien escrita?", // pregunta de «Detecta el error»
    "codigo.pregunta.cual": "¿Qué código lo hace?", // pregunta de «Casos de uso»
    "codigo.esoHace": "Eso hace otra cosa: {que}", // por qué no era esa opción

    // --- Abecedario ---
    "abc.titulo": "El abecedario", // título de la tabla
    "abc.explicacion": "Cómo se llama cada letra en inglés y en español. Pulsa el altavoz para oírla.", // explicación de la tabla
    "abc.letra": "Letra", // columna
    "abc.ingles": "Inglés", // columna y etiqueta
    "abc.espanol": "Español", // columna y etiqueta
    "abc.suena": "suena", // "suena ei"
    "abc.tambien": "también", // otros nombres
    "abc.verTabla": "Ver letras", // botón de la tarjeta

    // --- Teclado ---
    "teclado.auto": "Automático", // tipo de teclado automático
    "teclado.nombre.es": "Español (España)", // teclado de España
    "teclado.nombre.la": "Latinoamericano", // teclado latinoamericano
    "teclado.nombre.us": "Inglés (EE. UU.)", // teclado de Estados Unidos
    "teclado.usando": "Usando: {teclado}. Si no es como el tuyo, cámbialo.", // nota de la sección
    "teclado.noEsta": "El teclado {teclado} no tiene «{c}». Usa los botones de la pantalla.", // carácter que no existe
    "teclado.muerta": "tecla muerta", // aviso de tecla muerta
    "teclado.conDedo": "con el {dedo}", // qué dedo usar
    "teclado.explicaMuerta": "Una tecla muerta no escribe nada hasta que pulsas la siguiente; para que salga sola, pulsa Espacio.", // qué es una tecla muerta
    "teclado.sinTildes": "El teclado inglés no tiene tildes: elige un teclado español o usa los botones de la sección Idiomas.", // lección no disponible
    "tecla.borrar": "⌫", // tecla de borrar
    "tecla.tab": "Tab ⇥", // tabulador
    "tecla.bloqMayus": "Bloq Mayús", // bloqueo de mayúsculas
    "tecla.intro": "Intro ↵", // intro
    "tecla.mayus": "⇧ Mayús", // mayúsculas
    "tecla.mayusCorta": "Mayús", // mayúsculas en las explicaciones
    "tecla.ctrl": "Ctrl", // control
    "tecla.win": "Win", // tecla de Windows
    "tecla.alt": "Alt", // Alt
    "tecla.altgr": "Alt Gr", // Alt Gr
    "tecla.espacio": "Espacio", // barra espaciadora
    "dedo.menique-izq": "meñique izquierdo", // dedo
    "dedo.anular-izq": "anular izquierdo", // dedo
    "dedo.medio-izq": "dedo medio izquierdo", // dedo
    "dedo.indice-izq": "índice izquierdo", // dedo
    "dedo.pulgar": "pulgar", // dedo
    "dedo.indice-der": "índice derecho", // dedo
    "dedo.medio-der": "dedo medio derecho", // dedo
    "dedo.anular-der": "anular derecho", // dedo
    "dedo.menique-der": "meñique derecho", // dedo
    "buscador.titulo": "¿Dónde está cada tecla?", // título del buscador
    "buscador.detalle": "Busca cualquier carácter (@, #, ñ, ¿, ^...) y mira qué teclas pulsar en tu tipo de teclado.", // descripción
    "buscador.abrir": "Buscar una tecla", // botón
    "buscador.escribe": "Escribe o pega un carácter", // caja del buscador
    "buscador.dificiles": "Los que más se buscan:", // botones del buscador
    "ajustes.teclado": "Tipo de teclado", // ajuste
    "ajustes.tecladoEnPantalla": "Mostrar el teclado en pantalla en todos los modos", // ajuste

    // --- Créditos ---
    "creditos.frasesDe": "Frases de", // inicio de los créditos
    "creditos.codigo": "Código abierto con licencia MIT", // licencia del código
  },

  // ===== English =====
  // Mismas claves y en el mismo orden que en español: el comentario de cada línea de arriba
  // explica también la línea equivalente de aquí (tests/textos.test.js comprueba que no falte ninguna).
  en: {
    // --- Top bar ---
    "barra.idioma": "Change the interface language",
    "barra.temaClaro": "Switch to light theme",
    "barra.temaOscuro": "Switch to dark theme",
    "barra.instalar": "Install app",
    "barra.pantalla": "Full screen",
    "barra.salirPantalla": "Exit full screen",
    "barra.ajustes": "Settings",

    // --- Menu ---
    "menu.lema": "Learn by typing: English and Spanish, math formulas, code and the keyboard. Copy it exactly: every mistake costs you a life.",
    "menu.diasSeguidos": (d) => `${d.n}-day streak`,
    "menu.frasesEscritas": (d) => (d.n === 1 ? "1 sentence typed" : `${d.n} sentences typed`),
    "menu.tiempo": "{t} of practice",
    "menu.jugar": "Play",
    "menu.repasar": (d) => `Review ${d.n}`,
    "menu.repasarTitulo": "Replay only the sentences you got wrong",
    "menu.estado": "{total} sentences · {sinVer} unseen · Best: {record}",
    "menu.estadoPpm": " · Top speed: {ppm} wpm",
    "menu.sinFrases": "Couldn't load the sentences ({archivo}).",
    "menu.reglas": "How to play",
    "menu.atajos": "Shortcut: press 1, 2, 3... to start a mode in this section.",
    "menu.secciones": "Sections",
    "reglas.1": "Type the sentence exactly: letters, accents, capitals, punctuation and spaces.",
    "reglas.2": "You start with 5 lives (3 on hard). Each wrong character costs one.",
    "reglas.3": "In English and Spanish, once you finish typing the translation is hidden and you pick what the sentence means (keys 1, 2 or 3). A wrong answer also costs a life.",
    "reglas.4": "Chain 5 perfect sentences in a row to win a life back.",
    "reglas.5": "Sentences start short and get longer.",
    "reglas.6": "Sentences don't repeat. The ones you miss are saved so you can review them.",
    "reglas.7": "Press the speaker to hear the sentence. Pasting is blocked; if your keyboard lacks keys (ñ, accents, ¿ ¡), use the on-screen buttons.",
    "reglas.8": "In Math and Code, you first pick the correct option (the others have typical mistakes) and then type it.",

    // --- Modes ---
    "modo.ortografia.nombre": "Spanish spelling",
    "modo.ortografia.direccion": "Spanish",
    "modo.ortografia.detalle": "Spanish sentences. Type them exactly: accents, ñ, ¿ and ¡.",
    "modo.ingles.nombre": "English",
    "modo.ingles.direccion": "English → Spanish",
    "modo.ingles.detalle": "Type the English sentence with its Spanish translation in view, then pick what it means.",
    "modo.espanol.nombre": "Spanish",
    "modo.espanol.direccion": "Spanish → English",
    "modo.espanol.detalle": "The other way round: type the Spanish sentence and pick its English meaning. Great if you speak English.",

    // --- Game ---
    "juego.frases": "Sentences",
    "juego.racha": "Streak",
    "juego.ppm": "WPM",
    "juego.ppmTitulo": "Words per minute",
    "juego.errores": "Mistakes",
    "juego.nivel": "Level {n}",
    "juego.nivel.1": "short sentences",
    "juego.nivel.2": "medium sentences",
    "juego.nivel.3": "long sentences",
    "juego.repaso": "Review",
    "juego.practica": "Practice",
    "juego.vidas": "Lives: {n} of {total}",
    "juego.vidasInfinitas": "Unlimited lives (practice)",
    "juego.escuchar": "Listen to the sentence",
    "juego.traduccion": "Translation",
    "juego.escribe": "Type the sentence",
    "juego.placeholder": "Type the sentence here…",
    "juego.pregunta": "What does it mean?",
    "juego.pista": "Press 1, 2 or 3",
    "juego.teclas": "Special characters",
    "juego.mayus": "⇧ Shift",
    "juego.mayusTitulo": "The next letter will be uppercase",
    "juego.terminar": "End game",
    "juego.perfecta": "Perfect!",
    "juego.completada": "Done.",
    "juego.noPegar": "You can't paste here: type it by hand.",
    "juego.listaReiniciada": "You've seen every sentence. The list starts over.",
    "juego.vidaExtra": "{n} perfect in a row! You get a life back.",
    "fuente.frase": "Sentence",
    "fuente.traduccion": "Translation",
    "fuente.enlace": "{etiqueta} #{numero} on Tatoeba",
    "fuente.autor": ", by {autor}",

    // --- Meaning question ---
    // (En inglés la frase citada ya lleva su punto dentro de las comillas: “I'm tired.”, por eso aquí no se añade otro).
    "traduccion.bienEscrita": "Well typed! Now pick what it means.",
    "traduccion.escrita": "Typed. Now pick what it means.",
    "traduccion.correcto": "Correct! Sentence cleared.",
    "traduccion.fallo": "Not quite. It means {correcta}",
    "traduccion.explicacion": "It means {correcta} You chose {elegida}",

    // --- Results ---
    "fin.titulo": "Game over",
    "fin.record": "New record!",
    "fin.repasoTerminado": "Review complete!",
    "fin.practica": "Practice finished",
    "fin.modo": "{modo} mode",
    "fin.unidad": (d) => (d.n === 1 ? "sentence cleared" : "sentences cleared"),
    "fin.precision": "Accuracy",
    "fin.ppm": "Words per minute",
    "fin.mejorRacha": "Best streak",
    "fin.tiempo": "Time",
    "fin.letras": "Correct characters",
    "fin.errores": "Mistakes",
    "fin.recordEtiqueta": "Best",
    "fin.paraRepasar": "To review",
    "fin.sinErrores": "No mistakes. Great job!",
    "fin.masErrores": "And {n} more mistakes.",
    "fin.otraVez": "Play again",
    "fin.repasar": (d) => `Review mistakes (${d.n})`,
    "fin.volver": "Back to menu",
    "fin.escuchar": "Listen",

    // --- Settings ---
    "ajustes.titulo": "Settings",
    "ajustes.cerrar": "Close",
    "ajustes.seccion.aspecto": "Appearance",
    "ajustes.seccion.juego": "Game",
    "ajustes.seccion.sonido": "Sound and voice",
    "ajustes.seccion.app": "App",
    "ajustes.seccion.datos": "Your data",
    "ajustes.idioma": "Interface language",
    "ajustes.tema": "Theme",
    "ajustes.tema.oscuro": "Dark",
    "ajustes.tema.claro": "Light",
    "ajustes.tema.auto": "Automatic",
    "ajustes.tamano": "Sentence size",
    "ajustes.tamano.normal": "Normal",
    "ajustes.tamano.grande": "Large",
    "ajustes.tamano.enorme": "Extra large",
    "ajustes.dificultad": "Difficulty",
    "ajustes.dificultad.normal": "Normal · 5 lives",
    "ajustes.dificultad.dificil": "Hard · 3 lives",
    "ajustes.dificultad.practica": "Practice · unlimited lives, no record",
    "ajustes.pantallaCompleta": "Go full screen when a game starts",
    "ajustes.sonido": "Sound effects",
    "ajustes.teclas": "Typewriter sound while typing",
    "ajustes.voz": "Read each sentence aloud",
    "ajustes.vozLenta": "Slower voice",
    "ajustes.sinVoz": "Your browser has no voices to read aloud.",
    "ajustes.borrar": "Reset my progress",
    "ajustes.borrarConfirmar": "Are you sure? This deletes your records, stats, saved mistakes and seen sentences. Settings are kept.",
    "ajustes.borrado": "Progress reset.",
    "app.instalada": "You're already using Frase Exacta as an app.",
    "app.disponible": "Install it to open it like an app: its own window, full screen and offline.",
    "app.ios": "On iPhone or iPad: tap Share, then “Add to Home Screen”.",
    "app.archivo": "You're opening the file directly. To play as a full-screen app without installing anything, use abrir-app.bat (Windows) or abrir-app.sh (Mac and Linux). To install it, open it from the web.",
    "app.otro": "If your browser supports it, look for “Install” or “Add to Home Screen” in its menu. You can also play full screen with the button in the top bar.",

    // --- Menu sections ---
    "seccion.idiomas": "Languages",
    "seccion.matematicas": "Math",
    "seccion.codigo": "Code",
    "seccion.teclado": "Keyboard",
    "seccion.ajuste.lenguajeCodigo": "Language:",
    "seccion.ajuste.teclado": "Your keyboard:",

    // --- New modes: languages ---
    "modo.palabras-ingles.nombre": "English words",
    "modo.palabras-ingles.direccion": "Vocabulary · EN → ES",
    "modo.palabras-ingles.detalle": "Over 450 words and phrases by topic. Type the English word and pick what it means.",
    "modo.palabras-espanol.nombre": "Spanish words",
    "modo.palabras-espanol.direccion": "Vocabulary · ES → EN",
    "modo.palabras-espanol.detalle": "The same words the other way round, with their gender (el, la). Type in Spanish and pick the English meaning.",
    "modo.abecedario.nombre": "Alphabet",
    "modo.abecedario.direccion": "Spelling · EN and ES",
    "modo.abecedario.detalle": "Hear and read a word spelled letter by letter, in English or Spanish, and type it.",

    // --- New modes: math ---
    "modo.mates-algebra.nombre": "Algebra",
    "modo.mates-algebra.direccion": "Math",
    "modo.mates-algebra.detalle": "Special products, powers, roots, fractions, logarithms, lines and sequences. Pick the correct formula and type it.",
    "modo.mates-trigonometria.nombre": "Trigonometry",
    "modo.mates-trigonometria.direccion": "Math",
    "modo.mates-trigonometria.detalle": "Identities, special angles, laws of sines and cosines, circles and spheres.",
    "modo.mates-calculo.nombre": "Calculus",
    "modo.mates-calculo.direccion": "Math",
    "modo.mates-calculo.detalle": "Limits, derivatives and integrals: product rule, chain rule, integration by parts and more.",

    // --- New modes: code ---
    "modo.codigo-escribir.nombre": "Write code",
    "modo.codigo-escribir.direccion": "Programming",
    "modo.codigo-escribir.detalle": "Copy lines of code while seeing what they do, then pick what each one does.",
    "modo.codigo-errores.nombre": "Spot the bug",
    "modo.codigo-errores.direccion": "Programming",
    "modo.codigo-errores.detalle": "Three versions of the same line and only one is right. Find it and type it.",
    "modo.codigo-usos.nombre": "Use cases",
    "modo.codigo-usos.direccion": "Programming",
    "modo.codigo-usos.detalle": "We give you a task: pick the code that does it and type it.",

    // --- New modes: keyboard lessons ---
    "modo.teclado-central.nombre": "Home row",
    "modo.teclado-central.direccion": "Lesson 1",
    "modo.teclado-central.detalle": "Where your fingers rest: A S D F and J K L. Start here.",
    "modo.teclado-superior.nombre": "Top row",
    "modo.teclado-superior.direccion": "Lesson 2",
    "modo.teclado-superior.detalle": "Q W E R T Y U I O P, together with the home row.",
    "modo.teclado-inferior.nombre": "Bottom row",
    "modo.teclado-inferior.direccion": "Lesson 3",
    "modo.teclado-inferior.detalle": "Z X C V B N M, together with the home row.",
    "modo.teclado-letras.nombre": "All letters",
    "modo.teclado-letras.direccion": "Lesson 4",
    "modo.teclado-letras.detalle": "Words with any letter on the keyboard.",
    "modo.teclado-mayusculas.nombre": "Capitals and periods",
    "modo.teclado-mayusculas.direccion": "Lesson 5",
    "modo.teclado-mayusculas.detalle": "Short sentences with Shift, commas and periods.",
    "modo.teclado-numeros.nombre": "Numbers",
    "modo.teclado-numeros.direccion": "Lesson 6",
    "modo.teclado-numeros.detalle": "The number row, using every finger.",
    "modo.teclado-tildes.nombre": "Accents, ñ and ¿ ¡",
    "modo.teclado-tildes.direccion": "Lesson 7",
    "modo.teclado-tildes.detalle": "Dead keys: first ´ and then the vowel. Spanish keyboards only.",
    "modo.teclado-simbolos.nombre": "Symbols",
    "modo.teclado-simbolos.direccion": "Lesson 8",
    "modo.teclado-simbolos.detalle": "@ # ^ { } [ ] < > and more: what you need for formulas, emails and code.",

    // --- Vocabulary and math topics ---
    "tema.saludos": "Greetings and useful phrases",
    "tema.numeros": "Numbers",
    "tema.colores": "Colors",
    "tema.dias": "Days and months",
    "tema.tiempo": "Time",
    "tema.familia": "Family and people",
    "tema.cuerpo": "The body",
    "tema.comida": "Food and drink",
    "tema.animales": "Animals",
    "tema.casa": "The house",
    "tema.ropa": "Clothes",
    "tema.escuela": "School",
    "tema.trabajo": "Work",
    "tema.ciudad": "The city",
    "tema.transporte": "Transport and travel",
    "tema.naturaleza": "Weather and nature",
    "tema.verbos": "Verbs",
    "tema.adjetivos": "Adjectives",
    "tema.preguntas": "Questions",
    "tema.tecnologia": "Technology",
    "tema.emociones": "Feelings and personality",
    "tema.algebra": "Algebra",
    "tema.trigonometria": "Trigonometry",
    "tema.calculo": "Calculus",

    // --- Programming languages ---
    "lenguaje.todos": "All",
    "lenguaje.python": "Python",
    "lenguaje.javascript": "JavaScript",
    "lenguaje.web": "HTML and CSS",
    "lenguaje.sql": "SQL",
    "lenguaje.terminal": "Terminal and Git",

    // --- Pick and type (math and code) ---
    "eleccion.bien": "Correct! Now type it.",
    "eleccion.fallo": "Not that one.{porque} The correct one is in green: type it.",
    "eleccion.explicacion": "You chose {elegida}.",
    "eleccion.noCuenta": "Typed. This one doesn't count because you missed the question.",
    "eleccion.pregunta.formula": "Which formula is correct?",
    "codigo.queHace": "What it does",
    "codigo.pregunta.queHace": "What does this code do?",
    "codigo.pregunta.correcta": "Which one is written correctly?",
    "codigo.pregunta.cual": "Which code does it?",
    "codigo.esoHace": "That does something else: {que}",

    // --- Alphabet ---
    "abc.titulo": "The alphabet",
    "abc.explicacion": "The name of each letter in English and Spanish. Press the speaker to hear it.",
    "abc.letra": "Letter",
    "abc.ingles": "English",
    "abc.espanol": "Spanish",
    "abc.suena": "sounds like",
    "abc.tambien": "also",
    "abc.verTabla": "See letters",

    // --- Keyboard ---
    "teclado.auto": "Automatic",
    "teclado.nombre.es": "Spanish (Spain)",
    "teclado.nombre.la": "Latin American",
    "teclado.nombre.us": "English (US)",
    "teclado.usando": "Using: {teclado}. If it doesn't match yours, change it.",
    "teclado.noEsta": "The {teclado} keyboard doesn't have “{c}”. Use the on-screen buttons.",
    "teclado.muerta": "dead key",
    "teclado.conDedo": "with your {dedo}",
    "teclado.explicaMuerta": "A dead key types nothing until you press the next key; to get it on its own, press Space.",
    "teclado.sinTildes": "The English keyboard has no accents: pick a Spanish keyboard or use the buttons in the Languages section.",
    "tecla.borrar": "⌫",
    "tecla.tab": "Tab ⇥",
    "tecla.bloqMayus": "Caps Lock",
    "tecla.intro": "Enter ↵",
    "tecla.mayus": "⇧ Shift",
    "tecla.mayusCorta": "Shift",
    "tecla.ctrl": "Ctrl",
    "tecla.win": "Win",
    "tecla.alt": "Alt",
    "tecla.altgr": "Alt Gr",
    "tecla.espacio": "Space",
    "dedo.menique-izq": "left pinky",
    "dedo.anular-izq": "left ring finger",
    "dedo.medio-izq": "left middle finger",
    "dedo.indice-izq": "left index finger",
    "dedo.pulgar": "thumb",
    "dedo.indice-der": "right index finger",
    "dedo.medio-der": "right middle finger",
    "dedo.anular-der": "right ring finger",
    "dedo.menique-der": "right pinky",
    "buscador.titulo": "Where is each key?",
    "buscador.detalle": "Look up any character (@, #, ñ, ¿, ^...) and see which keys to press on your keyboard type.",
    "buscador.abrir": "Find a key",
    "buscador.escribe": "Type or paste a character",
    "buscador.dificiles": "Most searched:",
    "ajustes.teclado": "Keyboard type",
    "ajustes.tecladoEnPantalla": "Show the on-screen keyboard in every mode",

    // --- Credits ---
    "creditos.frasesDe": "Sentences from",
    "creditos.codigo": "Open source, MIT license",
  },
};

// Idiomas de interfaz disponibles.
const IDIOMAS_INTERFAZ = Object.keys(TEXTOS);

// Idioma de la interfaz en uso (empieza en español; ajustes.js lo cambia al cargar).
let idiomaInterfaz = "es";
// Funciones que quieren enterarse cuando cambia el idioma (para repintar textos dinámicos).
const avisosDeIdioma = [];

// Devuelve el texto de una clave en el idioma actual, con los huecos rellenados.
//   clave: por ejemplo "menu.jugar"
//   datos: valores para los huecos, por ejemplo { n: 3 }
function t(clave, datos = {}) {
  // Buscamos el valor en el idioma actual; si falta, en español; si tampoco, usamos la clave.
  const valor = TEXTOS[idiomaInterfaz][clave] ?? TEXTOS.es[clave] ?? clave;
  // Si el valor es una función (plurales), la llamamos con los datos.
  if (typeof valor === "function") {
    // Devolvemos lo que calcula la función.
    return valor(datos);
  }
  // Si es un texto, cambiamos cada {nombre} por su dato (o lo dejamos vacío si no hay).
  return valor.replace(/\{(\w+)\}/g, (hueco, nombre) => (nombre in datos ? String(datos[nombre]) : ""));
}

// Elige el idioma de la interfaz que conviene según el navegador: español si lo usa, inglés si no.
function idiomaDelNavegador(lista) {
  // Recorremos los idiomas preferidos del navegador, en orden.
  for (const idioma of lista || []) {
    // Si empieza por "es" (es, es-ES, es-MX...), español.
    if (/^es\b/i.test(idioma)) {
      // Devolvemos español.
      return "es";
    }
    // Si empieza por "en", inglés.
    if (/^en\b/i.test(idioma)) {
      // Devolvemos inglés.
      return "en";
    }
  }
  // Si no reconocemos ninguno, usamos español (el idioma del proyecto).
  return "es";
}

// Pone los textos del idioma actual en todos los elementos marcados del HTML.
function aplicarTextos(raiz = document) {
  // Elementos cuyo contenido es un texto: data-t="clave".
  for (const elemento of raiz.querySelectorAll("[data-t]")) {
    // Ponemos el texto.
    elemento.textContent = t(elemento.dataset.t);
  }
  // Atributos que también se traducen: data-t-title, data-t-placeholder, data-t-aria-label.
  for (const atributo of ["title", "placeholder", "aria-label"]) {
    // Nombre del atributo de datos que guarda la clave.
    const marca = `data-t-${atributo}`;
    // Recorremos los elementos que lo tienen.
    for (const elemento of raiz.querySelectorAll(`[${marca}]`)) {
      // Ponemos el atributo traducido.
      elemento.setAttribute(atributo, t(elemento.getAttribute(marca)));
    }
  }
}

// Cambia el idioma de la interfaz y repinta todo.
function ponerIdiomaInterfaz(idioma) {
  // Solo aceptamos idiomas que existen; si no, español.
  idiomaInterfaz = IDIOMAS_INTERFAZ.includes(idioma) ? idioma : "es";
  // Si estamos en el navegador...
  if (typeof document !== "undefined") {
    // ...indicamos el idioma de la página (lo usan los lectores de pantalla)...
    document.documentElement.lang = idiomaInterfaz;
    // ...y ponemos los textos fijos del HTML.
    aplicarTextos();
  }
  // Avisamos a quien lo pidió, para que repinte sus textos.
  for (const aviso of avisosDeIdioma) {
    // Llamamos a la función.
    aviso(idiomaInterfaz);
  }
}

// Registra una función que se llamará cada vez que cambie el idioma.
function alCambiarIdioma(funcion) {
  // La añadimos a la lista.
  avisosDeIdioma.push(funcion);
}

// Devuelve el idioma de la interfaz en uso.
function idiomaActual() {
  // Lo devolvemos tal cual.
  return idiomaInterfaz;
}

// Si este archivo se carga desde Node (en las pruebas), exportamos lo necesario.
if (typeof module !== "undefined" && module.exports) {
  // Lista de lo que pueden usar las pruebas.
  module.exports = { TEXTOS, IDIOMAS_INTERFAZ, t, idiomaDelNavegador, ponerIdiomaInterfaz, idiomaActual };
}
