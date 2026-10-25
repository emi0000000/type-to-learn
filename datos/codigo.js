// codigo.js: líneas de código para los modos de programación (escribir, detectar el error y casos de uso).
// Lista escrita para este proyecto (licencia MIT, como el código).
// Cada entrada es una lista:
//   [número, lenguaje, código correcto, qué hace (español), qué hace (inglés),
//    [[versión con error, por qué está mal (español), por qué está mal (inglés)], [otra versión con error, ...]]]
// Lenguajes: "python", "javascript", "web" (HTML y CSS), "sql" y "terminal" (comandos y Git).
// El código solo usa caracteres que hay en cualquier teclado (sin tildes), para poder escribirlo tal cual.
window.CODIGO = [
  // ===== Python =====
  [1, "python", 'print("Hola")', "Muestra el texto Hola en la pantalla.", "Prints the text Hola on the screen.", [
    ['print("Hola"', "Falta cerrar el paréntesis.", "The closing parenthesis is missing."],
    ["print(Hola)", "Sin comillas, Python busca una variable llamada Hola.", "Without quotes, Python looks for a variable called Hola."]]],
  [2, "python", 'nombre = input("Nombre: ")', "Pide un texto a la persona y lo guarda en nombre.", "Asks the user for some text and stores it in nombre.", [
    ['nombre == input("Nombre: ")', "Con == se compara; para guardar un valor se usa un solo =.", "== compares; a single = stores a value."],
    ['input("Nombre: ") = nombre', "La variable va a la izquierda del =.", "The variable goes on the left of =."]]],
  [3, "python", "for i in range(5):", "Repite el bloque 5 veces, con i de 0 a 4.", "Repeats the block 5 times, with i from 0 to 4.", [
    ["for i in range(5)", "Faltan los dos puntos al final.", "The colon at the end is missing."],
    ["for i in range 5:", "range necesita paréntesis: range(5).", "range needs parentheses: range(5)."]]],
  [4, "python", "if edad >= 18:", "Comprueba si edad es mayor o igual que 18.", "Checks whether edad is greater than or equal to 18.", [
    ["if edad => 18:", "El operador es >=, no =>.", "The operator is >=, not =>."],
    ["if edad >= 18", "Faltan los dos puntos al final.", "The colon at the end is missing."]]],
  [5, "python", "numeros = [1, 2, 3]", "Crea una lista con los números 1, 2 y 3.", "Creates a list with the numbers 1, 2 and 3.", [
    ["numeros = [1 2 3]", "Faltan las comas entre los elementos.", "The commas between the items are missing."],
    ["numeros = (1, 2, 3]", "Abre con paréntesis y cierra con corchete.", "It opens with a parenthesis and closes with a bracket."]]],
  [6, "python", "numeros.append(4)", "Añade el 4 al final de la lista.", "Adds 4 to the end of the list.", [
    ["numeros.add(4)", "Las listas no tienen add: se usa append.", "Lists don't have add: use append."],
    ["numeros.append[4]", "Para llamar a un método se usan paréntesis, no corchetes.", "Methods are called with parentheses, not brackets."]]],
  [7, "python", "def saludar(nombre):", "Define una función llamada saludar que recibe nombre.", "Defines a function called saludar that takes nombre.", [
    ["def saludar(nombre)", "Faltan los dos puntos al final.", "The colon at the end is missing."],
    ["function saludar(nombre):", "En Python las funciones se crean con def.", "In Python functions are created with def."]]],
  [8, "python", "return a + b", "Devuelve la suma de a y b como resultado de la función.", "Returns the sum of a and b from the function.", [
    ["retun a + b", "Está mal escrito: la palabra es return.", "It's misspelled: the keyword is return."],
    ["return (a + b", "Falta cerrar el paréntesis.", "The closing parenthesis is missing."]]],
  [9, "python", "while x < 10:", "Repite mientras x sea menor que 10.", "Repeats while x is less than 10.", [
    ["while x < 10", "Faltan los dos puntos al final.", "The colon at the end is missing."],
    ["while x < 10 do:", "En Python no existe do: basta con los dos puntos.", "Python has no do: the colon is enough."]]],
  [10, "python", 'len("hola")', "Cuenta los caracteres del texto: da 4.", "Counts the characters in the text: gives 4.", [
    ['"hola".len()', "En Python se escribe len(texto).", "In Python you write len(text)."],
    ['length("hola")', "La función se llama len.", "The function is called len."]]],
  [11, "python", "import math", "Carga el módulo de matemáticas (sqrt, pi...).", "Loads the math module (sqrt, pi...).", [
    ["include math", "En Python los módulos se cargan con import.", "Python loads modules with import."],
    ["import Math", "Python distingue mayúsculas: el módulo es math.", "Python is case-sensitive: the module is math."]]],
  [12, "python", 'edad = int("25")', "Convierte el texto 25 en el número 25.", "Converts the text 25 into the number 25.", [
    ['edad = integer("25")', "La función se llama int.", "The function is called int."],
    ['edad = int(25")', "Falta la comilla de apertura.", "The opening quote is missing."]]],
  [13, "python", 'persona = {"nombre": "Ana"}', "Crea un diccionario con la clave nombre.", "Creates a dictionary with the key nombre.", [
    ['persona = {"nombre" = "Ana"}', "En un diccionario, clave y valor se separan con dos puntos.", "In a dictionary, key and value are separated by a colon."],
    ['persona = {"nombre": "Ana"', "Falta cerrar la llave.", "The closing brace is missing."]]],
  [14, "python", 'print(f"Hola, {nombre}")', "Muestra Hola seguido del valor de nombre.", "Prints Hola followed by the value of nombre.", [
    ['print("Hola, {nombre}")', "Sin la f delante se imprime {nombre} tal cual.", "Without the f in front, {nombre} is printed literally."],
    ['print(f"Hola, (nombre)")', "Las variables van entre llaves, no entre paréntesis.", "Variables go inside braces, not parentheses."]]],
  [15, "python", "# Esto es un comentario", "Escribe un comentario: Python lo ignora.", "Writes a comment: Python ignores it.", [
    ["// Esto es un comentario", "En Python los comentarios empiezan con #.", "In Python comments start with #."],
    ["<!-- Esto es un comentario -->", "Eso es un comentario de HTML.", "That's an HTML comment."]]],
  [16, "python", "except ValueError:", "Atrapa el error cuando un valor no es válido.", "Catches the error when a value isn't valid.", [
    ["catch ValueError:", "En Python se usa except.", "Python uses except."],
    ["except ValueError", "Faltan los dos puntos al final.", "The colon at the end is missing."]]],
  [17, "python", "x += 1", "Suma 1 a x.", "Adds 1 to x.", [
    ["x =+ 1", "=+ guarda +1 en x en lugar de sumarle 1.", "=+ stores +1 in x instead of adding 1."],
    ["x++", "Python no tiene el operador ++.", "Python has no ++ operator."]]],

  // ===== JavaScript =====
  [101, "javascript", 'console.log("Hola");', "Muestra Hola en la consola.", "Prints Hola to the console.", [
    ['console.log("Hola";', "Falta cerrar el paréntesis.", "The closing parenthesis is missing."],
    ['Console.log("Hola");', "JavaScript distingue mayúsculas: es console.", "JavaScript is case-sensitive: it's console."]]],
  [102, "javascript", "let edad = 18;", "Crea la variable edad con el valor 18.", "Creates the variable edad with the value 18.", [
    ["let edad == 18;", "Para asignar se usa un solo =.", "A single = assigns."],
    ["let 18 = edad;", "El nombre de la variable va a la izquierda.", "The variable name goes on the left."]]],
  [103, "javascript", "const PI = 3.14;", "Crea una constante que no se puede volver a asignar.", "Creates a constant that can't be reassigned.", [
    ["const PI = 3,14;", "Los decimales se escriben con punto.", "Decimals are written with a dot."],
    ["constant PI = 3.14;", "La palabra es const.", "The keyword is const."]]],
  [104, "javascript", "if (edad >= 18) {", "Comprueba si edad es mayor o igual que 18.", "Checks whether edad is greater than or equal to 18.", [
    ["if edad >= 18 {", "La condición va entre paréntesis.", "The condition goes in parentheses."],
    ["if (edad => 18) {", "=> crea una función flecha; el operador es >=.", "=> creates an arrow function; the operator is >=."]]],
  [105, "javascript", "for (let i = 0; i < 5; i++) {", "Repite el bloque 5 veces, con i de 0 a 4.", "Repeats the block 5 times, with i from 0 to 4.", [
    ["for (let i = 0, i < 5, i++) {", "Las tres partes se separan con punto y coma.", "The three parts are separated by semicolons."],
    ["for (let i = 0; i < 5; i++ {", "Falta cerrar el paréntesis.", "The closing parenthesis is missing."]]],
  [106, "javascript", "function sumar(a, b) {", "Define una función sumar que recibe a y b.", "Defines a function sumar that takes a and b.", [
    ["function sumar(a b) {", "Falta la coma entre los parámetros.", "The comma between the parameters is missing."],
    ["def sumar(a, b) {", "def es de Python; en JavaScript es function.", "def is Python; JavaScript uses function."]]],
  [107, "javascript", "const lista = [1, 2, 3];", "Crea un array con 1, 2 y 3.", "Creates an array with 1, 2 and 3.", [
    ["const lista = [1; 2; 3];", "Los elementos se separan con comas.", "Items are separated by commas."],
    ["const lista = {1, 2, 3};", "Las llaves son para objetos; los arrays usan corchetes.", "Braces are for objects; arrays use brackets."]]],
  [108, "javascript", "lista.push(4);", "Añade el 4 al final del array.", "Adds 4 to the end of the array.", [
    ["lista.append(4);", "append es de Python; en JavaScript es push.", "append is Python; JavaScript uses push."],
    ["lista.push[4];", "Para llamar a un método se usan paréntesis.", "Methods are called with parentheses."]]],
  [109, "javascript", "if (a === b) {", "Comprueba si a y b son iguales en valor y en tipo.", "Checks whether a and b are equal in value and type.", [
    ["if (a = b) {", "Un solo = asigna en lugar de comparar.", "A single = assigns instead of comparing."],
    ["if (a ==== b) {", "El operador es ===, con tres signos.", "The operator is ===, with three signs."]]],
  [110, "javascript", 'document.getElementById("titulo");', "Busca en la página el elemento con id titulo.", "Finds the element with id titulo on the page.", [
    ['document.getElementById("#titulo");', "getElementById recibe el id sin #.", "getElementById takes the id without #."],
    ['document.getElementByID("titulo");', "Es Id, no ID: JavaScript distingue mayúsculas.", "It's Id, not ID: JavaScript is case-sensitive."]]],
  [111, "javascript", 'boton.addEventListener("click", saludar);', "Ejecuta saludar cuando se hace clic en el botón.", "Runs saludar when the button is clicked.", [
    ['boton.addEventListener("click", saludar());', "Con () la función se ejecuta ya, no al hacer clic.", "With () the function runs now, not on click."],
    ['boton.addEventListener("onclick", saludar);', "El evento se llama click, sin on.", "The event is called click, without on."]]],
  [112, "javascript", "const texto = `Hola, ${nombre}`;", "Crea un texto que incluye el valor de nombre.", "Creates a text that includes the value of nombre.", [
    ['const texto = "Hola, ${nombre}";', "Con comillas normales ${} no se sustituye: hacen falta comillas invertidas (`).", "With normal quotes ${} isn't replaced: you need backticks (`)."],
    ["const texto = `Hola, {nombre}`;", "Falta el $ antes de la llave.", "The $ before the brace is missing."]]],
  [113, "javascript", 'const persona = { nombre: "Ana" };', "Crea un objeto con la propiedad nombre.", "Creates an object with the property nombre.", [
    ['const persona = { nombre = "Ana" };', "Propiedad y valor se separan con dos puntos.", "Property and value are separated by a colon."],
    ["const persona = { nombre: Ana };", "Sin comillas, Ana sería una variable.", "Without quotes, Ana would be a variable."]]],
  [114, "javascript", "const doble = (x) => x * 2;", "Función flecha que devuelve el doble de x.", "Arrow function that returns twice x.", [
    ["const doble = (x) -> x * 2;", "La flecha se escribe =>.", "The arrow is written =>."],
    ["const doble = (x) => { x * 2 };", "Con llaves hace falta return; así devuelve undefined.", "With braces you need return; this returns undefined."]]],
  [115, "javascript", "Math.round(2.6);", "Redondea al entero más cercano: da 3.", "Rounds to the nearest integer: gives 3.", [
    ["math.round(2.6);", "Es Math, con mayúscula.", "It's Math, capitalized."],
    ["Math.round(2,6);", "Los decimales se escriben con punto.", "Decimals are written with a dot."]]],
  [116, "javascript", "// Esto es un comentario", "Comentario de una línea: se ignora.", "A one-line comment: it's ignored.", [
    ["# Esto es un comentario", "# es para comentarios de Python.", "# is for Python comments."],
    ["/ Esto es un comentario", "Hacen falta dos barras.", "You need two slashes."]]],

  // ===== HTML y CSS =====
  [201, "web", "<h1>Bienvenido</h1>", "Título principal de la página.", "Main heading of the page.", [
    ["<h1>Bienvenido<h1>", "La etiqueta de cierre lleva barra: </h1>.", "The closing tag needs a slash: </h1>."],
    ["<h1>Bienvenido</h2>", "Abre h1 y cierra h2.", "It opens h1 and closes h2."]]],
  [202, "web", "<p>Hola</p>", "Un párrafo de texto.", "A paragraph of text.", [
    ["<p>Hola</p", "Falta el > final.", "The final > is missing."],
    ["<parrafo>Hola</parrafo>", "La etiqueta de párrafo es p.", "The paragraph tag is p."]]],
  [203, "web", '<a href="https://ejemplo.com">Ir</a>', "Un enlace a otra página.", "A link to another page.", [
    ['<a link="https://ejemplo.com">Ir</a>', "La dirección va en el atributo href.", "The address goes in the href attribute."],
    ['<a href="https://ejemplo.com">Ir<a>', "Falta la barra al cerrar: </a>.", "The closing tag is missing its slash: </a>."]]],
  [204, "web", '<img src="foto.jpg" alt="Foto">', "Muestra una imagen con un texto alternativo.", "Shows an image with alternative text.", [
    ['<img href="foto.jpg" alt="Foto">', "Las imágenes usan src, no href.", "Images use src, not href."],
    ['<image src="foto.jpg" alt="Foto">', "La etiqueta es img.", "The tag is img."]]],
  [205, "web", "<ol><li>Uno</li></ol>", "Una lista numerada con un elemento.", "A numbered list with one item.", [
    ["<ol><il>Uno</il></ol>", "La etiqueta de cada elemento es li.", "The item tag is li."],
    ["<ol><li>Uno</li></ul>", "Abre ol y cierra ul.", "It opens ol and closes ul."]]],
  [206, "web", '<button type="button">Enviar</button>', "Un botón con el texto Enviar.", "A button with the text Enviar.", [
    ['<button type="button">Enviar</buton>', "La etiqueta de cierre está mal escrita.", "The closing tag is misspelled."],
    ['<button type=button">Enviar</button>', "Falta la comilla de apertura del valor.", "The opening quote of the value is missing."]]],
  [207, "web", '<input type="email" name="correo">', "Una caja para escribir un correo electrónico.", "A box for typing an email address.", [
    ['<input type="correo" name="correo">', "El tipo para correos es email.", "The type for emails is email."],
    ['<imput type="email" name="correo">', "La etiqueta es input.", "The tag is input."]]],
  [208, "web", '<div class="tarjeta"></div>', "Un bloque con la clase tarjeta.", "A block with the class tarjeta.", [
    ['<div clase="tarjeta"></div>', "El atributo se llama class.", "The attribute is called class."],
    ['<div class="tarjeta"><div>', "Para cerrar se escribe </div>.", "To close it you write </div>."]]],
  [209, "web", "color: red;", "Pone el texto en rojo (CSS).", "Makes the text red (CSS).", [
    ["color = red;", "En CSS se usan dos puntos, no igual.", "CSS uses a colon, not an equals sign."],
    ["colour: red;", "En CSS se escribe color, sin u.", "CSS spells it color, without u."]]],
  [210, "web", ".tarjeta { padding: 16px; }", "Da 16 píxeles de relleno a los elementos con la clase tarjeta.", "Gives 16 pixels of padding to elements with the class tarjeta.", [
    ["tarjeta { padding: 16px; }", "Sin el punto busca etiquetas <tarjeta>, no la clase.", "Without the dot it targets <tarjeta> tags, not the class."],
    [".tarjeta { padding: 16 px; }", "Entre el número y la unidad no va espacio.", "No space between the number and the unit."]]],
  [211, "web", "#menu { display: flex; }", "Pone en fila los hijos del elemento con id menu.", "Lays out the children of the element with id menu in a row.", [
    ["#menu { display: flexbox; }", "El valor es flex.", "The value is flex."],
    ["#menu ( display: flex; )", "Las reglas van entre llaves.", "Rules go inside braces."]]],
  [212, "web", "font-size: 2rem;", "Hace la letra el doble del tamaño base.", "Makes the text twice the base size.", [
    ["font size: 2rem;", "Falta el guion: font-size.", "The hyphen is missing: font-size."],
    ["font-size: 2 rem;", "Entre el número y la unidad no va espacio.", "No space between the number and the unit."]]],
  [213, "web", "margin: 0 auto;", "Centra en horizontal un bloque con ancho fijo.", "Centers a fixed-width block horizontally.", [
    ["margin: 0, auto;", "Los valores se separan con espacios, no con comas.", "Values are separated by spaces, not commas."],
    ["margin: auto 0;", "Así el auto va arriba y abajo, y no centra en horizontal.", "Here auto goes to top and bottom, so it doesn't center horizontally."]]],
  [214, "web", '<link rel="stylesheet" href="estilos.css">', "Enlaza la hoja de estilos de la página.", "Links the page's stylesheet.", [
    ['<link rel="stylesheet" src="estilos.css">', "link usa href, no src.", "link uses href, not src."],
    ['<style href="estilos.css">', "Para un archivo externo se usa link.", "An external file needs link."]]],
  [215, "web", '<script src="app.js"></script>', "Carga un archivo de JavaScript.", "Loads a JavaScript file.", [
    ['<script href="app.js"></script>', "script usa src, no href.", "script uses src, not href."],
    ['<script src="app.js">', "Falta la etiqueta de cierre </script>.", "The closing </script> tag is missing."]]],

  // ===== SQL =====
  [301, "sql", "SELECT * FROM clientes;", "Muestra todas las columnas de la tabla clientes.", "Shows every column of the clientes table.", [
    ["SELECT * clientes;", "Falta FROM antes de la tabla.", "FROM is missing before the table."],
    ["SELECT FROM clientes *;", "Las columnas van entre SELECT y FROM.", "Columns go between SELECT and FROM."]]],
  [302, "sql", "SELECT nombre FROM clientes WHERE edad > 18;", "Nombres de los clientes mayores de 18.", "Names of customers older than 18.", [
    ["SELECT nombre WHERE edad > 18 FROM clientes;", "FROM va antes de WHERE.", "FROM goes before WHERE."],
    ["SELECT nombre FROM clientes IF edad > 18;", "Para filtrar se usa WHERE.", "Use WHERE to filter."]]],
  [303, "sql", "SELECT nombre FROM clientes ORDER BY nombre;", "Nombres ordenados alfabéticamente.", "Names sorted alphabetically.", [
    ["SELECT nombre FROM clientes SORT BY nombre;", "Para ordenar se escribe ORDER BY.", "Sorting is written ORDER BY."],
    ["SELECT nombre FROM clientes ORDER nombre;", "Falta BY.", "BY is missing."]]],
  [304, "sql", "INSERT INTO clientes (nombre) VALUES ('Ana');", "Añade un cliente llamado Ana.", "Adds a customer named Ana.", [
    ["INSERT INTO clientes (nombre) VALUES (Ana);", "Los textos van entre comillas simples.", "Text values need single quotes."],
    ["ADD INTO clientes (nombre) VALUES ('Ana');", "Para añadir filas se usa INSERT.", "Use INSERT to add rows."]]],
  [305, "sql", "UPDATE clientes SET edad = 30 WHERE id = 1;", "Cambia a 30 la edad del cliente 1.", "Changes customer 1's age to 30.", [
    ["UPDATE clientes edad = 30 WHERE id = 1;", "Falta SET.", "SET is missing."],
    ["UPDATE clientes SET edad = 30;", "Sin WHERE cambia la edad de todos los clientes.", "Without WHERE it changes every customer's age."]]],
  [306, "sql", "DELETE FROM clientes WHERE id = 1;", "Borra el cliente con id 1.", "Deletes the customer with id 1.", [
    ["DELETE FROM clientes;", "Sin WHERE borra todos los clientes.", "Without WHERE it deletes every customer."],
    ["REMOVE FROM clientes WHERE id = 1;", "Para borrar filas se usa DELETE.", "Use DELETE to remove rows."]]],
  [307, "sql", "SELECT COUNT(*) FROM pedidos;", "Cuenta cuántas filas tiene la tabla pedidos.", "Counts the rows in the pedidos table.", [
    ["SELECT COUNT * FROM pedidos;", "COUNT necesita paréntesis: COUNT(*).", "COUNT needs parentheses: COUNT(*)."],
    ["SELECT SUM(*) FROM pedidos;", "SUM suma los valores de una columna; para contar filas es COUNT.", "SUM adds up a column; COUNT counts rows."]]],
  [308, "sql", "SELECT * FROM clientes WHERE nombre LIKE 'A%';", "Clientes cuyo nombre empieza por A.", "Customers whose name starts with A.", [
    ["SELECT * FROM clientes WHERE nombre = 'A%';", "Con = no funcionan los comodines: hace falta LIKE.", "= doesn't use wildcards: you need LIKE."],
    ["SELECT * FROM clientes WHERE nombre LIKE 'A*';", "En SQL el comodín es %, no *.", "In SQL the wildcard is %, not *."]]],
  [309, "sql", "CREATE TABLE notas (id INT, valor INT);", "Crea la tabla notas con dos columnas.", "Creates the notas table with two columns.", [
    ["CREATE notas (id INT, valor INT);", "Falta TABLE.", "TABLE is missing."],
    ["CREATE TABLE notas (id INT valor INT);", "Falta la coma entre las columnas.", "The comma between the columns is missing."]]],
  [310, "sql", "SELECT ciudad, COUNT(*) FROM clientes GROUP BY ciudad;", "Cuántos clientes hay en cada ciudad.", "How many customers there are in each city.", [
    ["SELECT ciudad, COUNT(*) FROM clientes;", "Para contar por ciudad falta GROUP BY ciudad.", "GROUP BY ciudad is needed to count per city."],
    ["SELECT ciudad, COUNT(*) FROM clientes GROUP ciudad;", "Falta BY.", "BY is missing."]]],
  [311, "sql", "SELECT * FROM clientes LIMIT 10;", "Muestra solo las 10 primeras filas.", "Shows only the first 10 rows.", [
    ["SELECT * FROM clientes LIMIT = 10;", "LIMIT no lleva =.", "LIMIT takes no =."],
    ["SELECT * FROM clientes MAX 10;", "Para limitar las filas se usa LIMIT.", "Use LIMIT to limit the rows."]]],
  [312, "sql", "SELECT * FROM clientes WHERE edad BETWEEN 18 AND 30;", "Clientes con una edad entre 18 y 30.", "Customers aged between 18 and 30.", [
    ["SELECT * FROM clientes WHERE edad BETWEEN 18, 30;", "Los dos límites se unen con AND.", "The two limits are joined with AND."],
    ["SELECT * FROM clientes WHERE edad BETWEEN 18 TO 30;", "Se escribe AND, no TO.", "It's AND, not TO."]]],
  [313, "sql", "SELECT DISTINCT ciudad FROM clientes;", "Lista de ciudades sin repetir.", "List of cities without duplicates.", [
    ["SELECT ciudad DISTINCT FROM clientes;", "DISTINCT va justo después de SELECT.", "DISTINCT goes right after SELECT."],
    ["SELECT DIFFERENT ciudad FROM clientes;", "La palabra es DISTINCT.", "The keyword is DISTINCT."]]],
  [314, "sql", "SELECT AVG(precio) FROM productos;", "Precio medio de los productos.", "Average price of the products.", [
    ["SELECT AVERAGE(precio) FROM productos;", "La función se llama AVG.", "The function is called AVG."],
    ["SELECT AVG precio FROM productos;", "AVG necesita paréntesis.", "AVG needs parentheses."]]],

  // ===== Terminal y Git =====
  [401, "terminal", "git init", "Crea un repositorio de Git nuevo en la carpeta.", "Creates a new Git repository in the folder.", [
    ["git start", "El comando es git init.", "The command is git init."],
    ["git -init", "init es un comando, no una opción: va sin guion.", "init is a command, not an option: no hyphen."]]],
  [402, "terminal", "git status", "Muestra qué archivos cambiaron y cuáles están preparados.", "Shows which files changed and which are staged.", [
    ["git state", "El comando es git status.", "The command is git status."],
    ["gti status", "Está mal escrito: es git.", "It's misspelled: it's git."]]],
  [403, "terminal", "git add .", "Prepara todos los cambios de la carpeta para el próximo commit.", "Stages every change in the folder for the next commit.", [
    ["git add", "Sin nada después no añade nada: hace falta un archivo o un punto.", "With nothing after it adds nothing: you need a file or a dot."],
    ["git add all", "Buscaría un archivo llamado all; para todo se usa el punto.", "It would look for a file called all; use a dot for everything."]]],
  [404, "terminal", 'git commit -m "Primer cambio"', "Guarda los cambios preparados con un mensaje.", "Saves the staged changes with a message.", [
    ['git commit "Primer cambio"', "Falta -m antes del mensaje.", "-m is missing before the message."],
    ["git commit -m Primer cambio", "Sin comillas el mensaje se corta en el espacio.", "Without quotes the message is cut at the space."]]],
  [405, "terminal", "git push origin main", "Sube tus commits a la rama main del repositorio remoto.", "Uploads your commits to the main branch of the remote.", [
    ["git push main origin", "Primero va el remoto y después la rama.", "The remote goes first, then the branch."],
    ["git upload origin main", "El comando para subir es push.", "The command to upload is push."]]],
  [406, "terminal", "git pull", "Trae los cambios del repositorio remoto y los une con los tuyos.", "Gets the changes from the remote and merges them with yours.", [
    ["git pul", "Está mal escrito: es pull.", "It's misspelled: it's pull."],
    ["git download", "Para traer cambios se usa pull.", "Use pull to get changes."]]],
  [407, "terminal", "git checkout -b nueva-rama", "Crea una rama nueva y te cambia a ella.", "Creates a new branch and switches to it.", [
    ["git checkout nueva-rama", "Sin -b no la crea: solo cambia a una rama que ya existe.", "Without -b it doesn't create it: it only switches to an existing branch."],
    ["git branch -b nueva-rama", "git branch no tiene -b: es git checkout -b.", "git branch has no -b: it's git checkout -b."]]],
  [408, "terminal", "git log --oneline", "Muestra el historial de commits, uno por línea.", "Shows the commit history, one per line.", [
    ["git log -oneline", "Las opciones largas llevan dos guiones.", "Long options use two hyphens."],
    ["git history --oneline", "El historial se ve con git log.", "The history is shown with git log."]]],
  [409, "terminal", "git clone https://github.com/usuario/repo.git", "Descarga una copia completa de un repositorio.", "Downloads a full copy of a repository.", [
    ["git copy https://github.com/usuario/repo.git", "Para copiar un repositorio se usa clone.", "Use clone to copy a repository."],
    ["git clone github.com/usuario/repo.git", "Falta https:// al principio de la dirección.", "https:// is missing at the start of the address."]]],
  [410, "terminal", "git diff", "Muestra las líneas que cambiaste y aún no preparaste.", "Shows the lines you changed and haven't staged yet.", [
    ["git changes", "Los cambios línea a línea se ven con git diff.", "Line-by-line changes are shown with git diff."],
    ["git dif", "Está mal escrito: es diff, con dos f.", "It's misspelled: it's diff, with two f's."]]],
  [411, "terminal", "cd proyectos", "Entra en la carpeta proyectos.", "Goes into the proyectos folder.", [
    ["cdproyectos", "Falta el espacio entre cd y la carpeta.", "The space between cd and the folder is missing."],
    ["open proyectos", "Para entrar en una carpeta se usa cd.", "Use cd to go into a folder."]]],
  [412, "terminal", "cd ..", "Sube a la carpeta de arriba.", "Goes up to the parent folder.", [
    ["cd .", "Un solo punto es la carpeta actual: no te mueves.", "A single dot is the current folder: you don't move."],
    ["cd ...", "Son dos puntos, no tres.", "It's two dots, not three."]]],
  [413, "terminal", "mkdir fotos", "Crea una carpeta llamada fotos.", "Creates a folder called fotos.", [
    ["makedir fotos", "El comando es mkdir.", "The command is mkdir."],
    ["mkdir", "Falta el nombre de la carpeta.", "The folder name is missing."]]],
  [414, "terminal", "ls -l", "Lista los archivos con detalles (tamaño, fecha...).", "Lists files with details (size, date...).", [
    ["ls l", "Sin guion, l sería el nombre de un archivo.", "Without a hyphen, l would be a file name."],
    ["ls - l", "No va espacio entre el guion y la letra.", "No space between the hyphen and the letter."]]],
  [415, "terminal", "pwd", "Muestra en qué carpeta estás.", "Shows which folder you're in.", [
    ["pdw", "Está mal escrito: es pwd (print working directory).", "It's misspelled: it's pwd (print working directory)."],
    ["dir", "dir lista los archivos; la carpeta en la que estás se ve con pwd.", "dir lists files; the folder you're in is shown with pwd."]]],
  [416, "terminal", "rm archivo.txt", "Borra el archivo archivo.txt.", "Deletes the file archivo.txt.", [
    ["rm archivo .txt", "El espacio lo convierte en dos nombres distintos.", "The space turns it into two different names."],
    ["remove archivo.txt", "El comando para borrar es rm.", "The command to delete is rm."]]],
  [417, "terminal", "mv viejo.txt nuevo.txt", "Cambia el nombre de viejo.txt a nuevo.txt.", "Renames viejo.txt to nuevo.txt.", [
    ["mv viejo.txt", "Falta el nombre nuevo.", "The new name is missing."],
    ["mv nuevo.txt viejo.txt", "Está al revés: primero el nombre actual y después el nuevo.", "It's backwards: the current name goes first, then the new one."]]],
];
