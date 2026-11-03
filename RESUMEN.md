# Frase Exacta — resumen del proyecto

## Para qué existe

**Frase Exacta** es un juego gratuito y de código abierto creado para **enseñar**. La idea es aprender practicando con
el teclado en vez de solo leer: lo que escribes tú, lo recuerdas mejor. Casi siempre hay que escribir la respuesta
exacta, letra a letra, y cada error cuesta una vida, así que te obliga a fijarte.

Empezó para aprender **inglés y español** y fue creciendo con todo lo que sirve para estudiar y para trabajar:
matemáticas, programación, análisis de datos, redes de Cisco, servidores Linux, ciberseguridad y también cómo usar
el teclado y el ratón.

- Funciona en cualquier navegador, en ordenador y en móvil. No hay que instalar nada.
- También se puede usar como **aplicación a pantalla completa** e instalarla para jugar sin conexión.
- La interfaz está en **español e inglés**.
- Todo el progreso se guarda solo en tu navegador: **no se envía nada a ningún servidor**.
- Todo el código está comentado línea por línea en español, para que también se aprenda leyéndolo.

## Las 8 secciones y sus modos

### 🌍 Idiomas
Arriba eliges qué quieres aprender: inglés, español, francés, portugués, italiano o alemán.

| Modo | Qué haces |
|---|---|
| Frases (inglés / español) | Copias una frase real de Tatoeba y eliges qué significa |
| Ortografía | Copias frases en español con tildes, ñ, ¿ y ¡ |
| Palabras | Vocabulario por temas (más de 450 en inglés y español; casi 200 en los otros cuatro idiomas) |
| Dictado | Oyes una frase o palabra sin verla y la escribes |
| Pronunciación | Dices la palabra al micrófono y el navegador comprueba si se entiende |
| Números con letras | Ves 47 y escribes *forty-seven* o *cuarenta y siete* |
| Verbos irregulares | Ves *to go* y escribes *went gone* (90 verbos) |
| Falsos amigos | *embarrassed* no es *embarazada*: eliges el significado real |
| Abecedario | Lees y oyes una palabra deletreada y la escribes |
| Textos largos | Copias párrafos enteros con su traducción debajo (9 textos en 6 idiomas) |
| Traduce textos | Escribes la traducción de una frase; unas rayas te dicen cuántas letras tiene cada palabra |

### ➗ Matemáticas
| Modo | Qué haces |
|---|---|
| Sumas y restas · Multiplica, divide y potencias · De todo un poco | Escribes solo el resultado |
| Fórmula general | Resuelves ecuaciones de segundo grado |
| Álgebra · Trigonometría · Cálculo | Eliges la fórmula correcta entre otras con errores típicos y la escribes |

### 💻 Código
Python, JavaScript, HTML y CSS, SQL, terminal y Git: **Escribe código**, **Detecta el error**, **Casos de uso**
y **¿Qué lenguaje es?** (adivinar entre 19 lenguajes).

### 📊 Datos
Fórmulas de **Excel / Google Sheets**, **pandas** y **NumPy**, con los mismos modos que Código.

### ⌨️ Teclado
El teclado dibujado en la pantalla (de España, Latinoamérica o EE. UU.) con la siguiente tecla señalada y el dedo
que hay que usar, 8 lecciones por filas y un buscador para saber dónde está cualquier carácter (@, #, ñ, ¿…).

### 🖱️ Ratón
Lecciones para quien empieza: mover, clic, doble clic, clic derecho, arrastrar y soltar, la rueda y un repaso.

### 🌐 Redes
**21 laboratorios** como los de Cisco Packet Tracer, en tres niveles. Se configura cada equipo paso a paso,
siempre desde `enable`, en una consola que se comporta como la de verdad:
- **Fácil:** modos del IOS, contraseñas, IP del switch, interfaces de un router, comandos `show`, primeros pasos en Linux.
- **Medio:** VLAN, troncales, router-on-a-stick, rutas estáticas, DHCP, SSH, servidor web Nginx.
- **Difícil:** OSPF, ACL, NAT, seguridad de puertos y STP, switch de capa 3, EtherChannel, un proyecto de oficina
  completo de 77 comandos y un servidor Linux seguro.

Además hay modos de comandos sueltos: escribirlos, detectar el error y ¿qué comando es?

### 🛡️ Ciberseguridad
Siempre desde el lado de quien defiende. **9 laboratorios**: permisos en Linux, cerrar servicios, endurecer un router,
detener un ataque de fuerza bruta, SSH con claves, auditar tu propio servidor, AAA y SSH en Cisco, proteger un switch
de ataques y responder a un incidente real paso a paso. Y modos rápidos: **¿Es phishing?**, **Código inseguro**,
**Lee el registro**, **Criptografía** (César, ROT13, hexadecimal, Base64) y **Puertos**.

## Cómo son los laboratorios

- Consola realista: el prompt cambia con cada modo (`Switch>`, `S1#`, `S1(config-if)#`…), acepta abreviaturas
  (`conf t`, `int g0/0`), da los mismos errores que Cisco, **Tab** completa y **?** da ayuda. También hay consolas de
  PC y de servidores Linux.
- Al lado ves la **configuración del equipo cambiando en vivo**, el **esquema de la red**, la **tabla de direcciones**
  y la **plantilla de pasos**, que se va llenando con lo que escribes.
- Tres formas de hacerlos: **Guiado** (ves el comando), **Plantilla** (con huecos) y **Examen** (solo la tarea).
- Entre los comandos hay **preguntas** con su explicación.
- Al terminar puedes **copiar la configuración** y pegarla en Packet Tracer.

## Lo que ayuda a aprender en todo el juego

- **«¿Cómo funciona?»**: en las tarjetas y durante la partida, la explicación del tema con ejemplos.
- El juego **explica cada error** (qué esperaba y por qué).
- **Repaso de errores**: lo que fallas se guarda para volver a practicarlo.
- **Racha** (con 5 aciertos perfectos seguidos recuperas una vida), **velocidad**, **días seguidos** y récords.
- **Voz**: escucha las frases en voz alta, también más despacio.
- **Dificultad**: normal, difícil o práctica (vidas ilimitadas).
- Tema oscuro o claro, tres tamaños de letra y botones para los caracteres que falten en tu teclado.

## Cómo se ejecuta

1. Descarga el proyecto (en GitHub: *Code → Download ZIP*) y descomprímelo.
2. Haz doble clic en `index.html`. Ya está.

Para jugar como aplicación a pantalla completa: `abrir-app.bat` en Windows o `bash abrir-app.sh` en Mac y Linux.
Publicado en GitHub Pages, además se puede instalar y funciona sin conexión.

## Cómo está hecho

- HTML, CSS y JavaScript, **sin librerías**.
- `datos/`: los contenidos (frases, palabras, fórmulas, comandos, laboratorios, explicaciones…).
- `js/motor.js`: lo que comparten todos los modos (comprobar lo escrito, vidas, racha, resultado).
- `js/modos/`: cada modo, por separado.
- `js/laboratorio.js` y `js/consola.js`: la pantalla de los laboratorios y la consola que imita a Cisco, Linux y el PC.
- `tests/`: 97 pruebas automáticas (se ejecutan con `npm test`).

## Créditos y licencias

- **Código y contenidos propios:** licencia MIT.
- **Frases de idiomas:** [Tatoeba](https://tatoeba.org), con licencia CC BY 2.0 FR; cada frase muestra su autor.
- Todos los nombres, empresas, dominios e IP de los ejercicios son **inventados** o de los rangos reservados para
  ejemplos: ninguno es real.
- La mecánica de copiar exacto y perder vidas se inspira en el juego *Final Sentence*.
