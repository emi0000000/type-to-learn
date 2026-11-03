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
    "menu.lema": "Aprende escribiendo: idiomas, matemáticas, código, datos, redes, ciberseguridad, el teclado y el ratón. Copia exacto: cada error te cuesta una vida.", // frase bajo el título
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

    // --- Ronda 3: secciones nuevas, idiomas, modos de respuesta, pronunciación, falsos amigos, datos y ratón ---
    "seccion.datos": "Datos", // pestaña de análisis de datos
    "seccion.raton": "Ratón", // pestaña del ratón
    "seccion.ajuste.herramientaDatos": "Herramienta:", // desplegable de herramienta de datos
    "seccion.ajuste.idiomaAprender": "Quiero aprender:", // desplegable de idioma que se aprende
    "seccion.nota.idiomas": "En francés, portugués, italiano y alemán practicas las palabras más comunes: escribirlas, oírlas y decirlas.", // nota de la sección Idiomas (otros idiomas)
    "seccion.nota.datos": "Las fórmulas de Excel y Google Sheets salen en el idioma de la interfaz: en español =SUMA y =SI; en inglés =SUM e =IF.", // nota de la sección Datos
    "seccion.nota.raton": "Usa el ratón o el panel táctil. Cada lección tiene 10 objetivos: ¡intenta bajar tu mejor tiempo!", // nota de la sección Ratón
    "idioma.en": "Inglés", // idioma
    "idioma.es": "Español", // idioma
    "idioma.fr": "Francés", // idioma
    "idioma.pt": "Portugués", // idioma
    "idioma.it": "Italiano", // idioma
    "idioma.de": "Alemán", // idioma
    "respuesta.placeholder": "Tu respuesta…", // texto de ayuda de la caja en los modos de respuesta
    "respuesta.comprobar": "Comprobar", // botón de comprobar la respuesta
    "respuesta.bien": "¡Correcto!", // al acertar
    "respuesta.fallo": "No. Respuesta: {correcta}", // al fallar
    "respuesta.explicacion": "Escribiste «{escrito}». Respuesta: {correcta}", // explicación para el repaso
    "respuesta.vacia": "Escribe una respuesta y pulsa Intro.", // si se pulsa Intro sin escribir
    "numeros.consigna": "Escríbelo con letras", // consigna de los números
    "verbos.consigna": "Escribe el pasado y el participio", // consigna de los verbos
    "calculo.consigna": "Escribe solo el resultado", // consigna del cálculo
    "calculo.consigna.ecuacion": "Escribe las soluciones separadas por ; (por ejemplo: 2; −3)", // consigna de la fórmula general
    "calculo.consigna.mezcla": "Escribe el resultado (puede ser una fracción, como 3/4)", // consigna de la mezcla
    "dictado.consigna": "Escucha y escribe lo que oyes", // consigna del dictado
    "dictado.sinVoz": "Tu navegador no tiene una voz para leer en este idioma, así que el dictado no funciona aquí.", // si no hay voz
    "hablar.consigna": "Escúchala y dila en voz alta", // consigna de la pronunciación
    "hablar.escuchar": "Escuchar", // botón de oír la palabra
    "hablar.despacio": "Despacio", // botón de oírla despacio
    "hablar.hablar": "Hablar", // botón de hablar
    "hablar.escuchando": "Escuchando…", // botón mientras escucha
    "hablar.saltar": "Saltar", // botón de saltar
    "hablar.instrucciones": "Pulsa «Hablar» (o Intro) y di la palabra.", // instrucciones
    "hablar.diloAhora": "Dilo ahora…", // mientras escucha
    "hablar.intentos": (d) => (d.n === 1 ? "Queda 1 intento" : `Quedan ${d.n} intentos`), // intentos que quedan
    "hablar.entendido": "Se entendió: «{oido}»", // lo que se oyó al acertar
    "hablar.bien": "¡Bien dicho!", // al acertar
    "hablar.otraVez": "Se oyó «{oido}». Prueba otra vez.", // lo que se oyó al fallar
    "hablar.fallo": "Sin intentos. Escúchala otra vez y sigue con la siguiente.", // al gastar los intentos
    "hablar.explicacion": "Se oyó «{oido}».", // explicación para el repaso
    "hablar.saltada": "Saltada: esta no cuenta.", // al saltar
    "hablar.sinPermiso": "No hay permiso para usar el micrófono. Actívalo desde el candado de la barra de direcciones.", // sin permiso del micrófono
    "hablar.nadaOido": "No se oyó nada. Acércate al micrófono y pulsa «Hablar» otra vez.", // si no se oye nada
    "hablar.error": "No se pudo usar el reconocimiento de voz. En Chrome hace falta conexión a internet.", // otro error
    "hablar.noDisponible": "Tu navegador no reconoce la voz. Prueba con Chrome, Edge o Safari.", // si no hay reconocimiento de voz
    "hablar.grupo": "Pronunciación", // nombre del bloque para lectores de pantalla
    "falsos.consigna.en": "¿Qué significa en español?", // consigna (palabra inglesa)
    "falsos.consigna.es": "¿Qué significa en inglés?", // consigna (palabra española)
    "falsos.pregunta.en": "Elige su significado", // pregunta (palabra inglesa)
    "falsos.pregunta.es": "Elige su significado", // pregunta (palabra española)
    "falsos.trampa": "Ojo: «{trampa}» significa «{significa}».", // explicación de la trampa
    "falsos.esOtra": "«{significa}» se dice «{palabra}».", // explicación de la otra opción
    "lenguaje.consigna": "¿En qué lenguaje está escrito?", // consigna de «¿Qué lenguaje es?»
    "lenguaje.pregunta": "Elige el lenguaje", // pregunta de «¿Qué lenguaje es?»
    "lenguaje.excel": "Excel / Sheets", // hojas de cálculo
    "lenguaje.pandas": "pandas", // pandas
    "lenguaje.numpy": "NumPy", // NumPy
    "raton.objetivos": "Objetivos", // contador de objetivos
    "raton.fallos": "Fallos", // contador de fallos
    "raton.zona": "Zona de práctica del ratón", // nombre de la zona para lectores de pantalla
    "raton.haz.mover": "Pasa el puntero por encima del círculo y déjalo un momento (sin hacer clic).", // instrucción
    "raton.haz.clic": "Haz clic en el círculo.", // instrucción
    "raton.haz.dobleclic": "Haz doble clic en el círculo: dos clics rápidos.", // instrucción
    "raton.haz.derecho": "Haz clic con el botón derecho en el círculo.", // instrucción
    "raton.haz.arrastrar": "Arrastra el cuadrado hasta la caja y suéltalo dentro.", // instrucción
    "raton.haz.rueda": "Usa la rueda para encontrar la estrella.", // instrucción
    "raton.haz.ruedaAbajo": "Gira la rueda hacia abajo ↓ hasta ver la estrella y haz clic en ella.", // instrucción
    "raton.haz.ruedaArriba": "Ahora gira la rueda hacia arriba ↑ hasta ver la estrella y haz clic en ella.", // instrucción
    "raton.icono.clic": "Clic", // texto del objetivo en la mezcla
    "raton.icono.dobleclic": "2 clics", // texto del objetivo en la mezcla
    "raton.icono.derecho": "Derecho", // texto del objetivo en la mezcla
    "raton.icono.arrastrar": "Arrastra", // texto del cuadrado en la mezcla
    "raton.icono.caja": "Aquí", // texto de la caja
    "raton.pista.dobleclic": "Casi: haz los dos clics más rápido y sin mover el ratón.", // pista
    "raton.pista.derecho": "Ese es el botón izquierdo. Usa el derecho (en un panel táctil, toca con dos dedos).", // pista
    "raton.pista.arrastrar": "No sueltes el botón hasta que el cuadrado esté dentro de la caja.", // pista
    "raton.pista.fuera": "¡Fuera! Apunta al centro del objetivo.", // pista
    "raton.record": "¡Nuevo récord!", // título del resultado
    "raton.hecho": "¡Lección completada!", // título del resultado
    "raton.terminada": "Lección terminada", // título del resultado
    "raton.resumen": (d) => `${d.hechos} de ${d.total} objetivos en ${d.tiempo} · ${d.fallos === 1 ? "1 fallo" : `${d.fallos} fallos`} · Mejor tiempo: ${d.mejor}`, // resumen del resultado
    "raton.estado": "{n} objetivos · Mejor tiempo: {mejor}", // estado de la tarjeta
    "raton.estadoNuevo": "{n} objetivos · Aún sin récord", // estado de la tarjeta sin récord
    "menu.empezar": "Empezar", // botón de las tarjetas del ratón
    "reglas.9": "En los modos de resultado (cálculo, números con letras, verbos) escribes la respuesta y pulsas Intro.", // regla 9
    "reglas.10": "En Dictado la frase no se ve: escúchala y escríbela. En Pronunciación la dices al micrófono (en Chrome y Edge, el navegador usa su servicio en internet para reconocer la voz).", // regla 10
    "modo.dictado-en.nombre": "Dictado en inglés", // nombre
    "modo.dictado-en.direccion": "Escucha · EN", // tema
    "modo.dictado-en.detalle": "Oye una frase corta en inglés y escríbela sin verla. Pulsa el altavoz para volver a oírla.", // descripción
    "modo.dictado-es.nombre": "Dictado en español", // nombre
    "modo.dictado-es.direccion": "Escucha · ES", // tema
    "modo.dictado-es.detalle": "Oye una frase en español y escríbela sin verla, con sus tildes y sus signos.", // descripción
    "modo.dictado-fr.nombre": "Dictado en francés", // nombre
    "modo.dictado-fr.direccion": "Escucha · FR", // tema
    "modo.dictado-fr.detalle": "Oye una palabra en francés y escríbela. Ves su traducción como pista.", // descripción
    "modo.dictado-pt.nombre": "Dictado en portugués", // nombre
    "modo.dictado-pt.direccion": "Escucha · PT", // tema
    "modo.dictado-pt.detalle": "Oye una palabra en portugués y escríbela. Ves su traducción como pista.", // descripción
    "modo.dictado-it.nombre": "Dictado en italiano", // nombre
    "modo.dictado-it.direccion": "Escucha · IT", // tema
    "modo.dictado-it.detalle": "Oye una palabra en italiano y escríbela. Ves su traducción como pista.", // descripción
    "modo.dictado-de.nombre": "Dictado en alemán", // nombre
    "modo.dictado-de.direccion": "Escucha · DE", // tema
    "modo.dictado-de.detalle": "Oye una palabra en alemán y escríbela. Ves su traducción como pista.", // descripción
    "modo.pronunciacion-en.nombre": "Pronunciación en inglés", // nombre
    "modo.pronunciacion-en.direccion": "Habla · EN", // tema
    "modo.pronunciacion-en.detalle": "Escucha la palabra, pulsa «Hablar» y dila en voz alta. El navegador te dice si se te entendió.", // descripción
    "modo.pronunciacion-es.nombre": "Pronunciación en español", // nombre
    "modo.pronunciacion-es.direccion": "Habla · ES", // tema
    "modo.pronunciacion-es.detalle": "Escucha la palabra, pulsa «Hablar» y dila en voz alta en español.", // descripción
    "modo.pronunciacion-fr.nombre": "Pronunciación en francés", // nombre
    "modo.pronunciacion-fr.direccion": "Habla · FR", // tema
    "modo.pronunciacion-fr.detalle": "Escucha la palabra en francés, pulsa «Hablar» y dila en voz alta.", // descripción
    "modo.palabras-fr.nombre": "Palabras en francés", // nombre
    "modo.palabras-fr.direccion": "Vocabulario · FR", // tema
    "modo.palabras-fr.detalle": "Casi 200 palabras comunes por temas. Escríbela en francés y elige qué significa.", // descripción
    "modo.pronunciacion-pt.nombre": "Pronunciación en portugués", // nombre
    "modo.pronunciacion-pt.direccion": "Habla · PT", // tema
    "modo.pronunciacion-pt.detalle": "Escucha la palabra en portugués, pulsa «Hablar» y dila en voz alta.", // descripción
    "modo.palabras-pt.nombre": "Palabras en portugués", // nombre
    "modo.palabras-pt.direccion": "Vocabulario · PT", // tema
    "modo.palabras-pt.detalle": "Casi 200 palabras comunes por temas. Escríbela en portugués y elige qué significa.", // descripción
    "modo.pronunciacion-it.nombre": "Pronunciación en italiano", // nombre
    "modo.pronunciacion-it.direccion": "Habla · IT", // tema
    "modo.pronunciacion-it.detalle": "Escucha la palabra en italiano, pulsa «Hablar» y dila en voz alta.", // descripción
    "modo.palabras-it.nombre": "Palabras en italiano", // nombre
    "modo.palabras-it.direccion": "Vocabulario · IT", // tema
    "modo.palabras-it.detalle": "Casi 200 palabras comunes por temas. Escríbela en italiano y elige qué significa.", // descripción
    "modo.pronunciacion-de.nombre": "Pronunciación en alemán", // nombre
    "modo.pronunciacion-de.direccion": "Habla · DE", // tema
    "modo.pronunciacion-de.detalle": "Escucha la palabra en alemán, pulsa «Hablar» y dila en voz alta.", // descripción
    "modo.palabras-de.nombre": "Palabras en alemán", // nombre
    "modo.palabras-de.direccion": "Vocabulario · DE", // tema
    "modo.palabras-de.detalle": "Casi 200 palabras comunes por temas. Escríbela en alemán y elige qué significa.", // descripción
    "modo.numeros-en.nombre": "Números en inglés", // nombre
    "modo.numeros-en.direccion": "Números · EN", // tema
    "modo.numeros-en.detalle": "Ves un número (47) y lo escribes con letras: forty-seven. Del 0 al 9999.", // descripción
    "modo.numeros-es.nombre": "Números en español", // nombre
    "modo.numeros-es.direccion": "Números · ES", // tema
    "modo.numeros-es.detalle": "Ves un número (47) y lo escribes con letras: cuarenta y siete. Con sus tildes (dieciséis, veintidós).", // descripción
    "modo.verbos-en.nombre": "Verbos irregulares", // nombre
    "modo.verbos-en.direccion": "Gramática · EN", // tema
    "modo.verbos-en.detalle": "90 verbos: ves «to go» y escribes el pasado y el participio: went gone.", // descripción
    "modo.falsos-en.nombre": "Falsos amigos (inglés)", // nombre
    "modo.falsos-en.direccion": "Trampas · EN → ES", // tema
    "modo.falsos-en.detalle": "Palabras que engañan: «embarrassed» no es «embarazada». Elige lo que significa y escríbela.", // descripción
    "modo.falsos-es.nombre": "Falsos amigos (español)", // nombre
    "modo.falsos-es.direccion": "Trampas · ES → EN", // tema
    "modo.falsos-es.detalle": "Al revés: «embarazada» es «pregnant», no «embarrassed». Elige el significado en inglés y escríbela.", // descripción
    "modo.calculo-sumas.nombre": "Sumas y restas", // nombre
    "modo.calculo-sumas.direccion": "Cálculo mental", // tema
    "modo.calculo-sumas.detalle": "Escribe solo el resultado y pulsa Intro. Empieza fácil y llega a números de tres cifras.", // descripción
    "modo.calculo-operaciones.nombre": "Multiplica, divide y potencias", // nombre
    "modo.calculo-operaciones.direccion": "Cálculo mental", // tema
    "modo.calculo-operaciones.detalle": "Tablas de multiplicar, divisiones exactas, potencias como 2⁵ y algún resultado negativo.", // descripción
    "modo.calculo-ecuaciones.nombre": "Fórmula general", // nombre
    "modo.calculo-ecuaciones.direccion": "Ecuaciones de 2.º grado", // tema
    "modo.calculo-ecuaciones.detalle": "Resuelve ax² + bx + c = 0 con x = (−b ± √Δ) / 2a y escribe las dos soluciones: 2; 3.", // descripción
    "modo.calculo-mezcla.nombre": "De todo un poco", // nombre
    "modo.calculo-mezcla.direccion": "Cálculo mental", // tema
    "modo.calculo-mezcla.detalle": "Porcentajes, raíces, fracciones, ecuaciones sencillas y el orden de las operaciones.", // descripción
    "modo.codigo-lenguaje.nombre": "¿Qué lenguaje es?", // nombre
    "modo.codigo-lenguaje.direccion": "Programación", // tema
    "modo.codigo-lenguaje.detalle": "Ves una línea de código y eliges en qué lenguaje está: Python, Java, C, Go, Rust, PHP, SQL y muchos más.", // descripción
    "modo.datos-escribir.nombre": "Escribe fórmulas", // nombre
    "modo.datos-escribir.direccion": "Análisis de datos", // tema
    "modo.datos-escribir.detalle": "Copia fórmulas de Excel y código de pandas y NumPy viendo qué hacen, y luego elige qué hace cada uno.", // descripción
    "modo.datos-errores.nombre": "Detecta el error", // nombre
    "modo.datos-errores.direccion": "Análisis de datos", // tema
    "modo.datos-errores.detalle": "Tres versiones y solo una está bien: un paréntesis, una coma, un nombre… Encuéntrala y escríbela.", // descripción
    "modo.datos-usos.nombre": "Casos de uso", // nombre
    "modo.datos-usos.direccion": "Análisis de datos", // tema
    "modo.datos-usos.detalle": "Te damos una tarea (sumar una columna, filtrar filas, agrupar…) y eliges la fórmula o el código que la hace.", // descripción
    "modo.raton-mover.nombre": "Mover el ratón", // nombre
    "modo.raton-mover.direccion": "Lección 1", // tema
    "modo.raton-mover.detalle": "Lleva el puntero hasta el círculo y déjalo encima un momento. Sin hacer clic.", // descripción
    "modo.raton-clic.nombre": "Clic", // nombre
    "modo.raton-clic.direccion": "Lección 2", // tema
    "modo.raton-clic.detalle": "Haz clic con el botón izquierdo en cada círculo. Cada vez son más pequeños.", // descripción
    "modo.raton-dobleclic.nombre": "Doble clic", // nombre
    "modo.raton-dobleclic.direccion": "Lección 3", // tema
    "modo.raton-dobleclic.detalle": "Dos clics rápidos seguidos, sin mover el ratón. Así se abren archivos y carpetas.", // descripción
    "modo.raton-derecho.nombre": "Clic derecho", // nombre
    "modo.raton-derecho.direccion": "Lección 4", // tema
    "modo.raton-derecho.detalle": "El botón derecho abre menús con más opciones. Haz clic derecho en cada círculo.", // descripción
    "modo.raton-arrastrar.nombre": "Arrastrar y soltar", // nombre
    "modo.raton-arrastrar.direccion": "Lección 5", // tema
    "modo.raton-arrastrar.detalle": "Mantén pulsado el botón sobre el cuadrado, llévalo hasta la caja y suéltalo.", // descripción
    "modo.raton-rueda.nombre": "La rueda", // nombre
    "modo.raton-rueda.direccion": "Lección 6", // tema
    "modo.raton-rueda.detalle": "Gira la rueda (o desliza dos dedos en el panel táctil) para bajar y subir hasta la estrella.", // descripción
    "modo.raton-mezcla.nombre": "De todo", // nombre
    "modo.raton-mezcla.direccion": "Repaso", // tema
    "modo.raton-mezcla.detalle": "Clic, doble clic, botón derecho y arrastrar, mezclados. Cada objetivo dice qué hacer.", // descripción

    // --- Ronda 4: sección Redes (laboratorios de Cisco y Linux) ---
    "seccion.redes": "Redes", // pestaña de redes
    "seccion.ajuste.nivelRedes": "Nivel:", // desplegable de nivel de redes
    "seccion.nota.redes": "Laboratorios como los de Cisco Packet Tracer: configuras cada equipo paso a paso, desde enable hasta dejar la red funcionando. Al terminar puedes copiar la configuración y pegarla en Packet Tracer.", // nota de la sección Redes
    "redes.nivel.facil": "Fácil", // nivel
    "redes.nivel.medio": "Medio", // nivel
    "redes.nivel.dificil": "Difícil", // nivel
    "redes.tema.basico": "Básico", // tema de los comandos
    "redes.tema.switching": "Switching", // tema de los comandos
    "redes.tema.routing": "Routing", // tema de los comandos
    "redes.tema.servicios": "Servicios", // tema de los comandos
    "redes.tema.seguridad": "Seguridad", // tema de los comandos
    "redes.tema.linux": "Linux", // tema de los comandos
    "reglas.11": "En Redes, los laboratorios se hacen en una consola como la de Cisco: acepta abreviaturas (conf t, int g0/0), Tab completa y ? da ayuda. Elige Guiado, Plantilla o Examen según cuánta ayuda quieras.", // regla 11
    "lab.laboratorio": "Laboratorio", // tema de la tarjeta de un laboratorio
    "lab.tipo.cisco": "Cisco IOS", // tipo de equipo
    "lab.tipo.linux": "Linux", // tipo de equipo
    "lab.tipo.pc": "PC", // tipo de equipo
    "lab.ayuda": "Forma de hacerlo", // nombre de los botones de ayuda
    "lab.ayuda.guiado": "Guiado", // ayuda: se ve el comando
    "lab.ayuda.plantilla": "Plantilla", // ayuda: comando con huecos
    "lab.ayuda.examen": "Examen", // ayuda: solo la tarea
    "lab.ayuda.guiadoTitulo": "Se ve el comando entero: lo copias", // ayuda del botón
    "lab.ayuda.plantillaTitulo": "Se ve el comando con huecos: completa las palabras que faltan", // ayuda del botón
    "lab.ayuda.examenTitulo": "Solo se ve la tarea: escribe el comando de memoria", // ayuda del botón
    "lab.paso": "Paso", // contador de pasos
    "lab.equipos": "Equipos", // pestañas de equipos para lectores de pantalla
    "lab.atajos": "Intro: enviar · Tab: completar la palabra · ↑ ↓: comandos anteriores · ?: ayuda (en Cisco)", // atajos de la consola
    "lab.objetivo": "Caso y objetivo", // título del objetivo
    "lab.esquema": "Esquema de la red", // título del esquema
    "lab.direcciones": "Tabla de direcciones", // título de la tabla
    "lab.pasos": "Plantilla de pasos", // título de la lista de pasos
    "lab.equipo": "Equipo", // columna
    "lab.interfaz": "Interfaz", // columna
    "lab.ip": "Dirección IP", // columna
    "lab.mascara": "Máscara", // columna
    "lab.puerta": "Puerta de enlace", // columna
    "lab.escribe": "Escribe:", // etiqueta de la guía en modo guiado
    "lab.completa": "Completa:", // etiqueta de la plantilla
    "lab.pista": "Pista:", // etiqueta de la pista
    "lab.respuesta": "Respuesta:", // etiqueta de la respuesta
    "lab.responde": "Responde a lo que pregunta el equipo.", // tarea genérica de una pregunta del equipo
    "lab.verEquipo": "Estás viendo la consola de {equipo}; la tarea es en {actual}.", // aviso al mirar otro equipo
    "lab.bien": "¡Bien!", // al acertar un comando
    "lab.continuar": "Continuar", // botón tras una pregunta
    "lab.pregunta.bien": "¡Correcto!", // pregunta acertada
    "lab.pregunta.mal": "No es esa: la correcta está en verde.", // pregunta fallada
    "lab.error.vacio": "Escribe el comando y pulsa Intro.", // sin nada escrito
    "lab.error.otro": "Ese comando existe, pero no es el que pide la tarea.", // otro comando
    "lab.error.invalido": "Hay un error en «{palabra}» (el ^ lo señala).", // error en una palabra
    "lab.error.revisa": "Hay un error en «{palabra}».", // error en una palabra (Linux y PC, sin marca ^)
    "lab.error.incompleto": "Al comando le falta algo.", // comando incompleto
    "lab.error.ambiguo": "«{palabra}» es demasiado corto: puede ser varios comandos. Escribe más letras.", // abreviatura ambigua
    "lab.error.desconocido": "«{palabra}» no es un comando de este equipo.", // orden que no existe
    "lab.error.respuesta": "No es la respuesta que espera el equipo.", // respuesta equivocada a una pregunta del equipo
    "lab.error.copia": "Escribe el comando que ves arriba.", // ayuda en modo guiado
    "lab.error.mira": "Mira la respuesta arriba y escríbela.", // ayuda tras dos fallos
    "lab.error.pista": "Tienes una pista arriba.", // ayuda tras un fallo en examen
    "lab.fin.titulo": "¡Laboratorio completado!", // título del resultado
    "lab.fin.resumen": (d) => `${d.comandos} comandos · ${d.errores === 1 ? "1 error" : `${d.errores} errores`} · ${d.tiempo} · ${d.ayuda}`, // resumen del resultado
    "lab.fin.config": "Tu configuración", // título de la configuración final
    "lab.fin.configNota": "Es lo que has configurado en cada equipo. Puedes copiarlo y pegarlo en la consola (CLI) de Packet Tracer o de un equipo de verdad.", // explicación de la configuración final
    "lab.copiar": "Copiar", // botón de copiar
    "lab.copiado": "¡Copiado!", // tras copiar
    "lab.seleccionado": "Seleccionado: pulsa Ctrl+C", // si no se puede copiar solo
    "lab.repetir": "Repetir", // botón de repetir
    "lab.siguiente": "Siguiente laboratorio", // botón de siguiente
    "lab.estado.pasos": (d) => `${d.comandos} comandos y ${d.preguntas === 1 ? "1 pregunta" : `${d.preguntas} preguntas`}`, // estado de la tarjeta
    "lab.estado.nuevo": "Sin hacer", // estado sin completar
    "lab.estado.hecho": (d) => `✓ ${d.ayuda} (${d.errores === 1 ? "1 error" : `${d.errores} errores`})`, // forma completada
    "modo.redes-escribir.nombre": "Escribe comandos", // nombre
    "modo.redes-escribir.direccion": "Comandos", // tema
    "modo.redes-escribir.detalle": "Copia comandos de Cisco y de Linux viendo qué hacen, y luego elige qué hace cada uno.", // descripción
    "modo.redes-errores.nombre": "Detecta el error", // nombre
    "modo.redes-errores.direccion": "Comandos", // tema
    "modo.redes-errores.detalle": "Tres versiones del comando y solo una está bien: el orden, un guion, máscara o wildcard… Encuéntrala y escríbela.", // descripción
    "modo.redes-usos.nombre": "¿Qué comando es?", // nombre
    "modo.redes-usos.direccion": "Comandos", // tema
    "modo.redes-usos.detalle": "Te damos una tarea (crear una VLAN, una ruta, una ACL…) y eliges el comando que la hace.", // descripción

    // --- Ronda 5: Ciberseguridad, textos largos y traducción ---
    "seccion.seguridad": "Ciberseguridad", // pestaña de ciberseguridad
    "seccion.ajuste.nivelSeguridad": "Nivel:", // desplegable de nivel
    "seccion.nota.seguridad": "Todo desde el lado de quien defiende: proteger equipos, detectar ataques y reaccionar. En los laboratorios ves a un lado cómo cambia la configuración del equipo con cada comando.", // nota de la sección
    "reglas.12": "En Ciberseguridad, además de laboratorios, hay mensajes para detectar phishing, código inseguro, registros para leer, retos de cifrado y puertos.", // regla 12
    "phishing.canal.correo": "Correo", // canal
    "phishing.canal.sms": "SMS", // canal
    "phishing.canal.web": "Web", // canal
    "phishing.pregunta": "¿Qué es este mensaje?", // pregunta
    "phishing.tipo.phishing": "Phishing: una estafa para robar datos o dinero", // opción
    "phishing.tipo.legitimo": "Legítimo: es de verdad", // opción
    "phishing.tipo.spam": "Spam: publicidad, pero no roba nada", // opción
    "seguridad.registro": "Registro", // etiqueta
    "cripto.cesar": "César", // nombre del cifrado
    "cripto.consigna": "Descifra el mensaje y escríbelo", // consigna
    "puertos.consigna.puerto": "Escribe el número de puerto", // consigna
    "puertos.consigna.protocolo": "Escribe el protocolo (el servicio)", // consigna
    "traducir.nota": "Las rayas te dicen cuántas letras tiene cada palabra.", // nota de la traducción
    "lab.cambios": (d) => `Cambios en ${d.equipo}`, // título del panel de cambios
    "lab.cambios.vacio": "Todavía no has cambiado nada en este equipo.", // panel vacío
    "lab.cambios.pc": "Un PC no guarda configuración: aquí solo se comprueba.", // panel de un PC
    "modo.seguridad-phishing.nombre": "¿Es phishing?", // nombre
    "modo.seguridad-phishing.direccion": "Detectar estafas", // tema
    "modo.seguridad-phishing.detalle": "Lee un correo, un SMS o una web y decide si es una estafa, de verdad o solo publicidad. Después te explica las pistas.", // descripción
    "modo.seguridad-errores.nombre": "Código inseguro", // nombre
    "modo.seguridad-errores.direccion": "Programar seguro", // tema
    "modo.seguridad-errores.detalle": "Tres versiones de la misma línea y solo una es segura: inyección SQL, XSS, contraseñas, secretos… Encuéntrala y escríbela.", // descripción
    "modo.seguridad-registros.nombre": "Lee el registro", // nombre
    "modo.seguridad-registros.direccion": "Detectar ataques", // tema
    "modo.seguridad-registros.detalle": "Ves trozos de registros reales y respondes: qué IP atacó, qué usuario probó, qué tipo de ataque es…", // descripción
    "modo.seguridad-cripto.nombre": "Criptografía", // nombre
    "modo.seguridad-cripto.direccion": "Retos", // tema
    "modo.seguridad-cripto.detalle": "Descifra mensajes en César, ROT13, hexadecimal y Base64, y aprende la diferencia entre codificar y cifrar.", // descripción
    "modo.seguridad-puertos.nombre": "Puertos", // nombre
    "modo.seguridad-puertos.direccion": "Lo básico", // tema
    "modo.seguridad-puertos.detalle": "¿Qué puerto usa SSH? ¿Qué servicio va por el 3389? Los puertos que hay que saber de memoria.", // descripción
    "modo.textos-en.nombre": "Textos largos en inglés", // nombre
    "modo.textos-en.direccion": "Escritura · EN", // tema
    "modo.textos-en.detalle": "Copia párrafos enteros en inglés, con sus acentos y signos, viendo la traducción debajo.", // descripción
    "modo.traducir-en.nombre": "Traduce textos al inglés", // nombre
    "modo.traducir-en.direccion": "Traducción · EN", // tema
    "modo.traducir-en.detalle": "Ves una frase y la escribes en inglés. Las rayas te dicen cuántas letras tiene cada palabra.", // descripción
    "modo.textos-es.nombre": "Textos largos en español", // nombre
    "modo.textos-es.direccion": "Escritura · ES", // tema
    "modo.textos-es.detalle": "Copia párrafos enteros en español, con sus acentos y signos, viendo la traducción debajo.", // descripción
    "modo.traducir-es.nombre": "Traduce textos al español", // nombre
    "modo.traducir-es.direccion": "Traducción · ES", // tema
    "modo.traducir-es.detalle": "Ves una frase y la escribes en español. Las rayas te dicen cuántas letras tiene cada palabra.", // descripción
    "modo.textos-fr.nombre": "Textos largos en francés", // nombre
    "modo.textos-fr.direccion": "Escritura · FR", // tema
    "modo.textos-fr.detalle": "Copia párrafos enteros en francés, con sus acentos y signos, viendo la traducción debajo.", // descripción
    "modo.traducir-fr.nombre": "Traduce textos al francés", // nombre
    "modo.traducir-fr.direccion": "Traducción · FR", // tema
    "modo.traducir-fr.detalle": "Ves una frase y la escribes en francés. Las rayas te dicen cuántas letras tiene cada palabra.", // descripción
    "modo.textos-pt.nombre": "Textos largos en portugués", // nombre
    "modo.textos-pt.direccion": "Escritura · PT", // tema
    "modo.textos-pt.detalle": "Copia párrafos enteros en portugués, con sus acentos y signos, viendo la traducción debajo.", // descripción
    "modo.traducir-pt.nombre": "Traduce textos al portugués", // nombre
    "modo.traducir-pt.direccion": "Traducción · PT", // tema
    "modo.traducir-pt.detalle": "Ves una frase y la escribes en portugués. Las rayas te dicen cuántas letras tiene cada palabra.", // descripción
    "modo.textos-it.nombre": "Textos largos en italiano", // nombre
    "modo.textos-it.direccion": "Escritura · IT", // tema
    "modo.textos-it.detalle": "Copia párrafos enteros en italiano, con sus acentos y signos, viendo la traducción debajo.", // descripción
    "modo.traducir-it.nombre": "Traduce textos al italiano", // nombre
    "modo.traducir-it.direccion": "Traducción · IT", // tema
    "modo.traducir-it.detalle": "Ves una frase y la escribes en italiano. Las rayas te dicen cuántas letras tiene cada palabra.", // descripción
    "modo.textos-de.nombre": "Textos largos en alemán", // nombre
    "modo.textos-de.direccion": "Escritura · DE", // tema
    "modo.textos-de.detalle": "Copia párrafos enteros en alemán, con sus acentos y signos, viendo la traducción debajo.", // descripción
    "modo.traducir-de.nombre": "Traduce textos al alemán", // nombre
    "modo.traducir-de.direccion": "Traducción · DE", // tema
    "modo.traducir-de.detalle": "Ves una frase y la escribes en alemán. Las rayas te dicen cuántas letras tiene cada palabra.", // descripción

    // --- Ronda 6: explicaciones ---
    "teoria.boton": "¿Cómo funciona?", // botón de la explicación
    "teoria.abrir": "Explicación del tema, con ejemplos", // ayuda del botón
    "teoria.entendido": "Entendido", // botón de cerrar la explicación
    "cripto.pista.cesar": "Pista: cada letra se movió {n} posiciones en el abecedario. Para descifrar, muévela {n} hacia atrás: {ej} → A, {ej2} → B.", // pista del César
    "cripto.pista.rot13": "Pista: ROT13 cambia cada letra por la que está 13 más allá: A↔N, B↔O, C↔P, D↔Q, E↔R, F↔S, G↔T, H↔U, I↔V, J↔W, K↔X, L↔Y, M↔Z.", // pista de ROT13
    "cripto.pista.hex": "Pista: cada pareja es una letra en hexadecimal: 41 = A, 42 = B, 43 = C… 49 = I, 4a = J… 4f = O, 50 = P… 5a = Z.", // pista del hexadecimal
    "cripto.pista.base64": "Pista: Base64 no esconde nada, solo cambia la forma de escribir. Empieza por «SGVsbG8» = «Hello», «T3Bl» = «Ope», «VXBk» = «Upd»… Si te atascas, pulsa «¿Cómo funciona?».", // pista del Base64

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
    "menu.lema": "Learn by typing: languages, math, code, data, networking, cybersecurity, the keyboard and the mouse. Copy it exactly: every mistake costs you a life.",
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

    // --- Round 3: new sections, languages, answer modes, pronunciation, false friends, data and mouse ---
    "seccion.datos": "Data",
    "seccion.raton": "Mouse",
    "seccion.ajuste.herramientaDatos": "Tool:",
    "seccion.ajuste.idiomaAprender": "I want to learn:",
    "seccion.nota.idiomas": "In French, Portuguese, Italian and German you practice the most common words: type them, hear them and say them.",
    "seccion.nota.datos": "Excel and Google Sheets formulas follow the interface language: in English =SUM and =IF; in Spanish =SUMA and =SI.",
    "seccion.nota.raton": "Use your mouse or touchpad. Each lesson has 10 targets: try to beat your best time!",
    "idioma.en": "English",
    "idioma.es": "Spanish",
    "idioma.fr": "French",
    "idioma.pt": "Portuguese",
    "idioma.it": "Italian",
    "idioma.de": "German",
    "respuesta.placeholder": "Your answer…",
    "respuesta.comprobar": "Check",
    "respuesta.bien": "Correct!",
    "respuesta.fallo": "No. Answer: {correcta}",
    "respuesta.explicacion": "You typed “{escrito}”. Answer: {correcta}",
    "respuesta.vacia": "Type an answer and press Enter.",
    "numeros.consigna": "Write it in words",
    "verbos.consigna": "Type the past simple and the past participle",
    "calculo.consigna": "Type just the result",
    "calculo.consigna.ecuacion": "Type the solutions separated by ; (for example: 2; −3)",
    "calculo.consigna.mezcla": "Type the result (it can be a fraction, like 3/4)",
    "dictado.consigna": "Listen and type what you hear",
    "dictado.sinVoz": "Your browser has no voice to read this language aloud, so dictation doesn't work here.",
    "hablar.consigna": "Listen to it and say it out loud",
    "hablar.escuchar": "Listen",
    "hablar.despacio": "Slowly",
    "hablar.hablar": "Speak",
    "hablar.escuchando": "Listening…",
    "hablar.saltar": "Skip",
    "hablar.instrucciones": "Press “Speak” (or Enter) and say the word.",
    "hablar.diloAhora": "Say it now…",
    "hablar.intentos": (d) => (d.n === 1 ? "1 try left" : `${d.n} tries left`),
    "hablar.entendido": "Heard: “{oido}”",
    "hablar.bien": "Well said!",
    "hablar.otraVez": "Heard “{oido}”. Try again.",
    "hablar.fallo": "Out of tries. Listen to it again and move on.",
    "hablar.explicacion": "Heard “{oido}”.",
    "hablar.saltada": "Skipped: this one doesn't count.",
    "hablar.sinPermiso": "No permission to use the microphone. Allow it from the lock icon in the address bar.",
    "hablar.nadaOido": "Nothing was heard. Get closer to the microphone and press “Speak” again.",
    "hablar.error": "Speech recognition failed. In Chrome it needs an internet connection.",
    "hablar.noDisponible": "Your browser can't recognize speech. Try Chrome, Edge or Safari.",
    "hablar.grupo": "Pronunciation",
    "falsos.consigna.en": "What does it mean in Spanish?",
    "falsos.consigna.es": "What does it mean in English?",
    "falsos.pregunta.en": "Pick its meaning",
    "falsos.pregunta.es": "Pick its meaning",
    "falsos.trampa": "Careful: “{trampa}” means “{significa}”.",
    "falsos.esOtra": "“{significa}” is “{palabra}”.",
    "lenguaje.consigna": "Which language is this written in?",
    "lenguaje.pregunta": "Pick the language",
    "lenguaje.excel": "Excel / Sheets",
    "lenguaje.pandas": "pandas",
    "lenguaje.numpy": "NumPy",
    "raton.objetivos": "Targets",
    "raton.fallos": "Misses",
    "raton.zona": "Mouse practice area",
    "raton.haz.mover": "Move the pointer over the circle and hold it there a moment (no clicking).",
    "raton.haz.clic": "Click the circle.",
    "raton.haz.dobleclic": "Double-click the circle: two quick clicks.",
    "raton.haz.derecho": "Right-click the circle.",
    "raton.haz.arrastrar": "Drag the square into the box and drop it there.",
    "raton.haz.rueda": "Use the wheel to find the star.",
    "raton.haz.ruedaAbajo": "Scroll down ↓ until you see the star, then click it.",
    "raton.haz.ruedaArriba": "Now scroll up ↑ until you see the star, then click it.",
    "raton.icono.clic": "Click",
    "raton.icono.dobleclic": "2 clicks",
    "raton.icono.derecho": "Right",
    "raton.icono.arrastrar": "Drag",
    "raton.icono.caja": "Here",
    "raton.pista.dobleclic": "Almost: click twice faster, without moving the mouse.",
    "raton.pista.derecho": "That's the left button. Use the right one (on a touchpad, tap with two fingers).",
    "raton.pista.arrastrar": "Keep the button pressed until the square is inside the box.",
    "raton.pista.fuera": "Missed! Aim for the center of the target.",
    "raton.record": "New record!",
    "raton.hecho": "Lesson complete!",
    "raton.terminada": "Lesson ended",
    "raton.resumen": (d) => `${d.hechos} of ${d.total} targets in ${d.tiempo} · ${d.fallos === 1 ? "1 miss" : `${d.fallos} misses`} · Best time: ${d.mejor}`,
    "raton.estado": "{n} targets · Best time: {mejor}",
    "raton.estadoNuevo": "{n} targets · No record yet",
    "menu.empezar": "Start",
    "reglas.9": "In the answer modes (mental math, numbers in words, verbs) you type the answer and press Enter.",
    "reglas.10": "In Dictation the sentence is hidden: listen and type it. In Pronunciation you say it into the microphone (in Chrome and Edge, the browser uses its online service to recognize speech).",
    "modo.dictado-en.nombre": "Dictation in English",
    "modo.dictado-en.direccion": "Listening · EN",
    "modo.dictado-en.detalle": "Hear a short English sentence and type it without seeing it. Press the speaker to hear it again.",
    "modo.dictado-es.nombre": "Dictation in Spanish",
    "modo.dictado-es.direccion": "Listening · ES",
    "modo.dictado-es.detalle": "Hear a Spanish sentence and type it without seeing it, with its accents and punctuation.",
    "modo.dictado-fr.nombre": "Dictation in French",
    "modo.dictado-fr.direccion": "Listening · FR",
    "modo.dictado-fr.detalle": "Hear a word in French and type it. You see its translation as a hint.",
    "modo.dictado-pt.nombre": "Dictation in Portuguese",
    "modo.dictado-pt.direccion": "Listening · PT",
    "modo.dictado-pt.detalle": "Hear a word in Portuguese and type it. You see its translation as a hint.",
    "modo.dictado-it.nombre": "Dictation in Italian",
    "modo.dictado-it.direccion": "Listening · IT",
    "modo.dictado-it.detalle": "Hear a word in Italian and type it. You see its translation as a hint.",
    "modo.dictado-de.nombre": "Dictation in German",
    "modo.dictado-de.direccion": "Listening · DE",
    "modo.dictado-de.detalle": "Hear a word in German and type it. You see its translation as a hint.",
    "modo.pronunciacion-en.nombre": "Pronunciation in English",
    "modo.pronunciacion-en.direccion": "Speaking · EN",
    "modo.pronunciacion-en.detalle": "Hear the word, press “Speak” and say it out loud. The browser tells you if it understood you.",
    "modo.pronunciacion-es.nombre": "Pronunciation in Spanish",
    "modo.pronunciacion-es.direccion": "Speaking · ES",
    "modo.pronunciacion-es.detalle": "Hear the word, press “Speak” and say it out loud in Spanish.",
    "modo.pronunciacion-fr.nombre": "Pronunciation in French",
    "modo.pronunciacion-fr.direccion": "Speaking · FR",
    "modo.pronunciacion-fr.detalle": "Hear the word in French, press “Speak” and say it out loud.",
    "modo.palabras-fr.nombre": "Words in French",
    "modo.palabras-fr.direccion": "Vocabulary · FR",
    "modo.palabras-fr.detalle": "Nearly 200 common words by topic. Type it in French and pick what it means.",
    "modo.pronunciacion-pt.nombre": "Pronunciation in Portuguese",
    "modo.pronunciacion-pt.direccion": "Speaking · PT",
    "modo.pronunciacion-pt.detalle": "Hear the word in Portuguese, press “Speak” and say it out loud.",
    "modo.palabras-pt.nombre": "Words in Portuguese",
    "modo.palabras-pt.direccion": "Vocabulary · PT",
    "modo.palabras-pt.detalle": "Nearly 200 common words by topic. Type it in Portuguese and pick what it means.",
    "modo.pronunciacion-it.nombre": "Pronunciation in Italian",
    "modo.pronunciacion-it.direccion": "Speaking · IT",
    "modo.pronunciacion-it.detalle": "Hear the word in Italian, press “Speak” and say it out loud.",
    "modo.palabras-it.nombre": "Words in Italian",
    "modo.palabras-it.direccion": "Vocabulary · IT",
    "modo.palabras-it.detalle": "Nearly 200 common words by topic. Type it in Italian and pick what it means.",
    "modo.pronunciacion-de.nombre": "Pronunciation in German",
    "modo.pronunciacion-de.direccion": "Speaking · DE",
    "modo.pronunciacion-de.detalle": "Hear the word in German, press “Speak” and say it out loud.",
    "modo.palabras-de.nombre": "Words in German",
    "modo.palabras-de.direccion": "Vocabulary · DE",
    "modo.palabras-de.detalle": "Nearly 200 common words by topic. Type it in German and pick what it means.",
    "modo.numeros-en.nombre": "Numbers in English",
    "modo.numeros-en.direccion": "Numbers · EN",
    "modo.numeros-en.detalle": "You see a number (47) and write it in words: forty-seven. From 0 to 9999.",
    "modo.numeros-es.nombre": "Numbers in Spanish",
    "modo.numeros-es.direccion": "Numbers · ES",
    "modo.numeros-es.detalle": "You see a number (47) and write it in words: cuarenta y siete. With accents (dieciséis, veintidós).",
    "modo.verbos-en.nombre": "Irregular verbs",
    "modo.verbos-en.direccion": "Grammar · EN",
    "modo.verbos-en.detalle": "90 verbs: you see “to go” and type the past and the participle: went gone.",
    "modo.falsos-en.nombre": "False friends (English)",
    "modo.falsos-en.direccion": "Traps · EN → ES",
    "modo.falsos-en.detalle": "Tricky words: “embarrassed” isn't “embarazada”. Pick its Spanish meaning and type it.",
    "modo.falsos-es.nombre": "False friends (Spanish)",
    "modo.falsos-es.direccion": "Traps · ES → EN",
    "modo.falsos-es.detalle": "The other way: “embarazada” means “pregnant”, not “embarrassed”. Pick the English meaning and type it.",
    "modo.calculo-sumas.nombre": "Addition and subtraction",
    "modo.calculo-sumas.direccion": "Mental math",
    "modo.calculo-sumas.detalle": "Type just the result and press Enter. It starts easy and goes up to three-digit numbers.",
    "modo.calculo-operaciones.nombre": "Multiply, divide and powers",
    "modo.calculo-operaciones.direccion": "Mental math",
    "modo.calculo-operaciones.detalle": "Times tables, exact divisions, powers like 2⁵ and some negative results.",
    "modo.calculo-ecuaciones.nombre": "Quadratic formula",
    "modo.calculo-ecuaciones.direccion": "Quadratic equations",
    "modo.calculo-ecuaciones.detalle": "Solve ax² + bx + c = 0 with x = (−b ± √Δ) / 2a and type both solutions: 2; 3.",
    "modo.calculo-mezcla.nombre": "A bit of everything",
    "modo.calculo-mezcla.direccion": "Mental math",
    "modo.calculo-mezcla.detalle": "Percentages, roots, fractions, simple equations and order of operations.",
    "modo.codigo-lenguaje.nombre": "Which language is it?",
    "modo.codigo-lenguaje.direccion": "Programming",
    "modo.codigo-lenguaje.detalle": "You see a line of code and pick its language: Python, Java, C, Go, Rust, PHP, SQL and many more.",
    "modo.datos-escribir.nombre": "Type formulas",
    "modo.datos-escribir.direccion": "Data analysis",
    "modo.datos-escribir.detalle": "Copy Excel formulas and pandas and NumPy code while seeing what they do, then pick what each one does.",
    "modo.datos-errores.nombre": "Spot the error",
    "modo.datos-errores.direccion": "Data analysis",
    "modo.datos-errores.detalle": "Three versions and only one is right: a parenthesis, a comma, a name… Find it and type it.",
    "modo.datos-usos.nombre": "Use cases",
    "modo.datos-usos.direccion": "Data analysis",
    "modo.datos-usos.detalle": "We give you a task (sum a column, filter rows, group…) and you pick the formula or code that does it.",
    "modo.raton-mover.nombre": "Move the mouse",
    "modo.raton-mover.direccion": "Lesson 1",
    "modo.raton-mover.detalle": "Bring the pointer to the circle and hold it there a moment. No clicking.",
    "modo.raton-clic.nombre": "Click",
    "modo.raton-clic.direccion": "Lesson 2",
    "modo.raton-clic.detalle": "Click each circle with the left button. They get smaller each time.",
    "modo.raton-dobleclic.nombre": "Double-click",
    "modo.raton-dobleclic.direccion": "Lesson 3",
    "modo.raton-dobleclic.detalle": "Two quick clicks in a row, without moving the mouse. That's how you open files and folders.",
    "modo.raton-derecho.nombre": "Right-click",
    "modo.raton-derecho.direccion": "Lesson 4",
    "modo.raton-derecho.detalle": "The right button opens menus with more options. Right-click each circle.",
    "modo.raton-arrastrar.nombre": "Drag and drop",
    "modo.raton-arrastrar.direccion": "Lesson 5",
    "modo.raton-arrastrar.detalle": "Hold the button down on the square, move it into the box and let go.",
    "modo.raton-rueda.nombre": "The wheel",
    "modo.raton-rueda.direccion": "Lesson 6",
    "modo.raton-rueda.detalle": "Turn the wheel (or slide two fingers on the touchpad) to scroll down and up to the star.",
    "modo.raton-mezcla.nombre": "Everything",
    "modo.raton-mezcla.direccion": "Review",
    "modo.raton-mezcla.detalle": "Click, double-click, right-click and drag, mixed. Each target tells you what to do.",

    // --- Round 4: Networking section (Cisco and Linux labs) ---
    "seccion.redes": "Networking",
    "seccion.ajuste.nivelRedes": "Level:",
    "seccion.nota.redes": "Labs like Cisco Packet Tracer's: you configure each device step by step, from enable to a working network. At the end you can copy the configuration and paste it into Packet Tracer.",
    "redes.nivel.facil": "Easy",
    "redes.nivel.medio": "Intermediate",
    "redes.nivel.dificil": "Advanced",
    "redes.tema.basico": "Basics",
    "redes.tema.switching": "Switching",
    "redes.tema.routing": "Routing",
    "redes.tema.servicios": "Services",
    "redes.tema.seguridad": "Security",
    "redes.tema.linux": "Linux",
    "reglas.11": "In Networking, labs run in a Cisco-like console: it accepts abbreviations (conf t, int g0/0), Tab completes and ? gives help. Choose Guided, Template or Exam depending on how much help you want.",
    "lab.laboratorio": "Lab",
    "lab.tipo.cisco": "Cisco IOS",
    "lab.tipo.linux": "Linux",
    "lab.tipo.pc": "PC",
    "lab.ayuda": "How to do it",
    "lab.ayuda.guiado": "Guided",
    "lab.ayuda.plantilla": "Template",
    "lab.ayuda.examen": "Exam",
    "lab.ayuda.guiadoTitulo": "You see the whole command: copy it",
    "lab.ayuda.plantillaTitulo": "You see the command with blanks: fill in the missing words",
    "lab.ayuda.examenTitulo": "You only see the task: type the command from memory",
    "lab.paso": "Step",
    "lab.equipos": "Devices",
    "lab.atajos": "Enter: send · Tab: complete the word · ↑ ↓: previous commands · ?: help (on Cisco)",
    "lab.objetivo": "Scenario and goal",
    "lab.esquema": "Network diagram",
    "lab.direcciones": "Addressing table",
    "lab.pasos": "Step template",
    "lab.equipo": "Device",
    "lab.interfaz": "Interface",
    "lab.ip": "IP address",
    "lab.mascara": "Subnet mask",
    "lab.puerta": "Default gateway",
    "lab.escribe": "Type:",
    "lab.completa": "Complete:",
    "lab.pista": "Hint:",
    "lab.respuesta": "Answer:",
    "lab.responde": "Answer what the device is asking.",
    "lab.verEquipo": "You're looking at {equipo}'s console; the task is on {actual}.",
    "lab.bien": "Good!",
    "lab.continuar": "Continue",
    "lab.pregunta.bien": "Correct!",
    "lab.pregunta.mal": "Not that one: the right one is in green.",
    "lab.error.vacio": "Type the command and press Enter.",
    "lab.error.otro": "That command exists, but it's not the one the task asks for.",
    "lab.error.invalido": "There's a mistake in “{palabra}” (the ^ marks it).",
    "lab.error.revisa": "There's a mistake in “{palabra}”.",
    "lab.error.incompleto": "The command is missing something.",
    "lab.error.ambiguo": "“{palabra}” is too short: it could be several commands. Type more letters.",
    "lab.error.desconocido": "“{palabra}” isn't a command on this device.",
    "lab.error.respuesta": "That's not the answer the device expects.",
    "lab.error.copia": "Type the command shown above.",
    "lab.error.mira": "Look at the answer above and type it.",
    "lab.error.pista": "There's a hint above.",
    "lab.fin.titulo": "Lab complete!",
    "lab.fin.resumen": (d) => `${d.comandos} commands · ${d.errores === 1 ? "1 mistake" : `${d.errores} mistakes`} · ${d.tiempo} · ${d.ayuda}`,
    "lab.fin.config": "Your configuration",
    "lab.fin.configNota": "This is what you configured on each device. You can copy it and paste it into the CLI of Packet Tracer or a real device.",
    "lab.copiar": "Copy",
    "lab.copiado": "Copied!",
    "lab.seleccionado": "Selected: press Ctrl+C",
    "lab.repetir": "Repeat",
    "lab.siguiente": "Next lab",
    "lab.estado.pasos": (d) => `${d.comandos} commands and ${d.preguntas === 1 ? "1 question" : `${d.preguntas} questions`}`,
    "lab.estado.nuevo": "Not done yet",
    "lab.estado.hecho": (d) => `✓ ${d.ayuda} (${d.errores === 1 ? "1 mistake" : `${d.errores} mistakes`})`,
    "modo.redes-escribir.nombre": "Type commands",
    "modo.redes-escribir.direccion": "Commands",
    "modo.redes-escribir.detalle": "Copy Cisco and Linux commands while seeing what they do, then pick what each one does.",
    "modo.redes-errores.nombre": "Spot the error",
    "modo.redes-errores.direccion": "Commands",
    "modo.redes-errores.detalle": "Three versions of the command and only one is right: the order, a hyphen, mask or wildcard… Find it and type it.",
    "modo.redes-usos.nombre": "Which command?",
    "modo.redes-usos.direccion": "Commands",
    "modo.redes-usos.detalle": "We give you a task (create a VLAN, a route, an ACL…) and you pick the command that does it.",

    // --- Round 5: Cybersecurity, long texts and translation ---
    "seccion.seguridad": "Cybersecurity",
    "seccion.ajuste.nivelSeguridad": "Level:",
    "seccion.nota.seguridad": "Everything from the defender's side: protecting machines, detecting attacks and responding. In the labs you see on the side how the device's configuration changes with each command.",
    "reglas.12": "In Cybersecurity, besides labs, there are messages to spot phishing, insecure code, logs to read, cipher challenges and ports.",
    "phishing.canal.correo": "Email",
    "phishing.canal.sms": "SMS",
    "phishing.canal.web": "Web",
    "phishing.pregunta": "What is this message?",
    "phishing.tipo.phishing": "Phishing: a scam to steal data or money",
    "phishing.tipo.legitimo": "Legitimate: it's real",
    "phishing.tipo.spam": "Spam: advertising, but it steals nothing",
    "seguridad.registro": "Log",
    "cripto.cesar": "Caesar",
    "cripto.consigna": "Decode the message and type it",
    "puertos.consigna.puerto": "Type the port number",
    "puertos.consigna.protocolo": "Type the protocol (the service)",
    "traducir.nota": "The dashes show how many letters each word has.",
    "lab.cambios": (d) => `Changes on ${d.equipo}`,
    "lab.cambios.vacio": "You haven't changed anything on this device yet.",
    "lab.cambios.pc": "A PC keeps no configuration: here you only check things.",
    "modo.seguridad-phishing.nombre": "Is it phishing?",
    "modo.seguridad-phishing.direccion": "Spotting scams",
    "modo.seguridad-phishing.detalle": "Read an email, SMS or website and decide whether it's a scam, real or just advertising. Then it explains the clues.",
    "modo.seguridad-errores.nombre": "Insecure code",
    "modo.seguridad-errores.direccion": "Secure coding",
    "modo.seguridad-errores.detalle": "Three versions of the same line and only one is safe: SQL injection, XSS, passwords, secrets… Find it and type it.",
    "modo.seguridad-registros.nombre": "Read the log",
    "modo.seguridad-registros.direccion": "Detecting attacks",
    "modo.seguridad-registros.detalle": "You see pieces of real logs and answer: which IP attacked, which user was tried, what kind of attack it is…",
    "modo.seguridad-cripto.nombre": "Cryptography",
    "modo.seguridad-cripto.direccion": "Challenges",
    "modo.seguridad-cripto.detalle": "Decode messages in Caesar, ROT13, hexadecimal and Base64, and learn the difference between encoding and encrypting.",
    "modo.seguridad-puertos.nombre": "Ports",
    "modo.seguridad-puertos.direccion": "The basics",
    "modo.seguridad-puertos.detalle": "Which port does SSH use? Which service runs on 3389? The ports you need to know by heart.",
    "modo.textos-en.nombre": "Long texts in English",
    "modo.textos-en.direccion": "Writing · EN",
    "modo.textos-en.detalle": "Copy whole paragraphs in English, with their accents and punctuation, with the translation below.",
    "modo.traducir-en.nombre": "Translate texts into English",
    "modo.traducir-en.direccion": "Translation · EN",
    "modo.traducir-en.detalle": "You see a sentence and write it in English. The dashes show how many letters each word has.",
    "modo.textos-es.nombre": "Long texts in Spanish",
    "modo.textos-es.direccion": "Writing · ES",
    "modo.textos-es.detalle": "Copy whole paragraphs in Spanish, with their accents and punctuation, with the translation below.",
    "modo.traducir-es.nombre": "Translate texts into Spanish",
    "modo.traducir-es.direccion": "Translation · ES",
    "modo.traducir-es.detalle": "You see a sentence and write it in Spanish. The dashes show how many letters each word has.",
    "modo.textos-fr.nombre": "Long texts in French",
    "modo.textos-fr.direccion": "Writing · FR",
    "modo.textos-fr.detalle": "Copy whole paragraphs in French, with their accents and punctuation, with the translation below.",
    "modo.traducir-fr.nombre": "Translate texts into French",
    "modo.traducir-fr.direccion": "Translation · FR",
    "modo.traducir-fr.detalle": "You see a sentence and write it in French. The dashes show how many letters each word has.",
    "modo.textos-pt.nombre": "Long texts in Portuguese",
    "modo.textos-pt.direccion": "Writing · PT",
    "modo.textos-pt.detalle": "Copy whole paragraphs in Portuguese, with their accents and punctuation, with the translation below.",
    "modo.traducir-pt.nombre": "Translate texts into Portuguese",
    "modo.traducir-pt.direccion": "Translation · PT",
    "modo.traducir-pt.detalle": "You see a sentence and write it in Portuguese. The dashes show how many letters each word has.",
    "modo.textos-it.nombre": "Long texts in Italian",
    "modo.textos-it.direccion": "Writing · IT",
    "modo.textos-it.detalle": "Copy whole paragraphs in Italian, with their accents and punctuation, with the translation below.",
    "modo.traducir-it.nombre": "Translate texts into Italian",
    "modo.traducir-it.direccion": "Translation · IT",
    "modo.traducir-it.detalle": "You see a sentence and write it in Italian. The dashes show how many letters each word has.",
    "modo.textos-de.nombre": "Long texts in German",
    "modo.textos-de.direccion": "Writing · DE",
    "modo.textos-de.detalle": "Copy whole paragraphs in German, with their accents and punctuation, with the translation below.",
    "modo.traducir-de.nombre": "Translate texts into German",
    "modo.traducir-de.direccion": "Translation · DE",
    "modo.traducir-de.detalle": "You see a sentence and write it in German. The dashes show how many letters each word has.",

    // --- Round 6: explanations ---
    "teoria.boton": "How does it work?",
    "teoria.abrir": "Explanation of the topic, with examples",
    "teoria.entendido": "Got it",
    "cripto.pista.cesar": "Hint: each letter moved {n} places in the alphabet. To decode, move it back {n}: {ej} → A, {ej2} → B.",
    "cripto.pista.rot13": "Hint: ROT13 swaps each letter for the one 13 further on: A↔N, B↔O, C↔P, D↔Q, E↔R, F↔S, G↔T, H↔U, I↔V, J↔W, K↔X, L↔Y, M↔Z.",
    "cripto.pista.hex": "Hint: each pair is a letter in hexadecimal: 41 = A, 42 = B, 43 = C… 49 = I, 4a = J… 4f = O, 50 = P… 5a = Z.",
    "cripto.pista.base64": "Hint: Base64 hides nothing, it just changes how it's written. «SGVsbG8» = «Hello», «T3Bl» = «Ope», «VXBk» = «Upd»… If you get stuck, press «How does it work?».",

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
