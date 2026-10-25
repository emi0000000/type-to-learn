// lenguajes.js: líneas de código de muchos lenguajes para el modo «¿Qué lenguaje es?».
// Lista escrita para este proyecto (licencia MIT, como el código).
// Cada entrada es [número, lenguaje, código, pista en español, pista en inglés].
// La pista explica en qué se nota el lenguaje; se muestra al fallar.
// Los lenguajes están agrupados en familias (FAMILIAS_DE_LENGUAJES) para que las opciones equivocadas se parezcan.
window.LENGUAJES_CODIGO = [
  // --- Python ---
  [1, "Python", 'print(f"Hola {nombre}")', "print con f-string (f delante de las comillas) es de Python.", "print with an f-string (f before the quotes) is Python."],
  [2, "Python", "def suma(a, b): return a + b", "def y los dos puntos son de Python.", "def and the colon are Python."],
  [3, "Python", "lista = [x * 2 for x in datos]", "Una lista con for dentro de los corchetes (comprensión de listas) es de Python.", "A list with for inside the brackets (list comprehension) is Python."],
  // --- JavaScript ---
  [11, "JavaScript", 'console.log("Hola");', "console.log es de JavaScript.", "console.log is JavaScript."],
  [12, "JavaScript", "const doble = (x) => x * 2;", "La flecha => con const es típica de JavaScript.", "The => arrow with const is typical JavaScript."],
  [13, "JavaScript", 'document.querySelector("#menu").hidden = true;', "document y querySelector son de JavaScript en el navegador.", "document and querySelector are JavaScript in the browser."],
  // --- TypeScript ---
  [21, "TypeScript", "let edad: number = 18;", "El tipo después de dos puntos (: number) es de TypeScript.", "The type after a colon (: number) is TypeScript."],
  [22, "TypeScript", "function saludar(nombre: string): void {}", "Los tipos string y void en los parámetros son de TypeScript.", "The string and void types on parameters are TypeScript."],
  [23, "TypeScript", "interface Punto { x: number; y: number }", "interface con tipos number es de TypeScript.", "interface with number types is TypeScript."],
  // --- Java ---
  [31, "Java", 'System.out.println("Hola");', "System.out.println es de Java.", "System.out.println is Java."],
  [32, "Java", "public static void main(String[] args) {", "public static void main(String[] args) es el inicio de un programa en Java.", "public static void main(String[] args) starts a Java program."],
  [33, "Java", "int[] numeros = new int[5];", "int[] con new es típico de Java.", "int[] with new is typical Java."],
  // --- C ---
  [41, "C", '#include <stdio.h>', "stdio.h es la biblioteca básica de C.", "stdio.h is C's basic library."],
  [42, "C", 'printf("%d\\n", total);', "printf con %d es de C.", "printf with %d is C."],
  [43, "C", "int main(void) { return 0; }", "int main(void) es el inicio de un programa en C.", "int main(void) starts a C program."],
  // --- C++ ---
  [51, "C++", 'std::cout << "Hola" << std::endl;', "std::cout con << es de C++.", "std::cout with << is C++."],
  [52, "C++", "#include <iostream>", "iostream es la biblioteca de entrada y salida de C++.", "iostream is C++'s input/output library."],
  [53, "C++", "std::vector<int> v = {1, 2, 3};", "std::vector es de C++.", "std::vector is C++."],
  // --- C# ---
  [61, "C#", 'Console.WriteLine("Hola");', "Console.WriteLine es de C#.", "Console.WriteLine is C#."],
  [62, "C#", "var lista = new List<string>();", "var con new List<string>() es típico de C#.", "var with new List<string>() is typical C#."],
  [63, "C#", "public string Nombre { get; set; }", "{ get; set; } es una propiedad de C#.", "{ get; set; } is a C# property."],
  // --- PHP ---
  [71, "PHP", 'echo "Hola, $nombre";', "echo y las variables con $ son de PHP.", "echo and variables with $ are PHP."],
  [72, "PHP", '<?php echo date("Y"); ?>', "<?php ... ?> marca código PHP.", "<?php ... ?> marks PHP code."],
  [73, "PHP", "$total = count($productos);", "Las variables que empiezan por $ y terminan en ; son de PHP.", "Variables starting with $ and lines ending in ; are PHP."],
  // --- Ruby ---
  [81, "Ruby", 'puts "Hola"', "puts para escribir es de Ruby.", "puts for printing is Ruby."],
  [82, "Ruby", "5.times { |i| puts i }", "5.times con |i| es de Ruby.", "5.times with |i| is Ruby."],
  [83, "Ruby", 'nombres.each do |n| puts n end', "each do |n| ... end es de Ruby.", "each do |n| ... end is Ruby."],
  // --- Go ---
  [91, "Go", 'fmt.Println("Hola")', "fmt.Println es de Go.", "fmt.Println is Go."],
  [92, "Go", "func suma(a int, b int) int {", "func con el tipo detrás del nombre (a int) es de Go.", "func with the type after the name (a int) is Go."],
  [93, "Go", "x := 10", "El := para crear variables es de Go.", "The := to create variables is Go."],
  // --- Rust ---
  [101, "Rust", 'println!("Hola");', "println! con signo de exclamación es una macro de Rust.", "println! with an exclamation mark is a Rust macro."],
  [102, "Rust", "let mut contador = 0;", "let mut es de Rust.", "let mut is Rust."],
  [103, "Rust", "fn main() {", "fn main() es el inicio de un programa en Rust.", "fn main() starts a Rust program."],
  // --- Kotlin ---
  [111, "Kotlin", 'val nombre = "Ana"', "val sin punto y coma es típico de Kotlin.", "val with no semicolon is typical Kotlin."],
  [112, "Kotlin", "fun suma(a: Int, b: Int) = a + b", "fun con tipos Int es de Kotlin.", "fun with Int types is Kotlin."],
  [113, "Kotlin", "val lista = mutableListOf(1, 2, 3)", "mutableListOf es de Kotlin.", "mutableListOf is Kotlin."],
  // --- Swift ---
  [121, "Swift", "var nombres: [String] = []", "[String] como tipo de lista es de Swift.", "[String] as a list type is Swift."],
  [122, "Swift", "func saludar(_ nombre: String) -> String {", "func con _ y -> String es de Swift.", "func with _ and -> String is Swift."],
  [123, "Swift", "if let valor = opcional {", "if let para opcionales es de Swift.", "if let for optionals is Swift."],
  // --- SQL ---
  [131, "SQL", "SELECT nombre FROM clientes;", "SELECT ... FROM es de SQL.", "SELECT ... FROM is SQL."],
  [132, "SQL", "UPDATE productos SET precio = 10 WHERE id = 3;", "UPDATE ... SET ... WHERE es de SQL.", "UPDATE ... SET ... WHERE is SQL."],
  // --- HTML ---
  [141, "HTML", '<p class="aviso">Hola</p>', "Las etiquetas entre < > son de HTML.", "Tags between < > are HTML."],
  [142, "HTML", '<input type="text" placeholder="Nombre">', "<input> es una etiqueta de HTML.", "<input> is an HTML tag."],
  // --- CSS ---
  [151, "CSS", "body { margin: 0; }", "propiedad: valor; entre llaves es CSS.", "property: value; inside braces is CSS."],
  [152, "CSS", ".boton:hover { color: red; }", ":hover con propiedades entre llaves es CSS.", ":hover with properties inside braces is CSS."],
  // --- Bash ---
  [161, "Bash", 'echo "Hola $USER"', "echo con $USER es de la terminal (Bash).", "echo with $USER is the terminal (Bash)."],
  [162, "Bash", "for f in *.txt; do echo $f; done", "for ... do ... done es de Bash.", "for ... do ... done is Bash."],
  [163, "Bash", "cd ~/Documentos && ls -la", "cd, && y ls -la son comandos de la terminal.", "cd, && and ls -la are terminal commands."],
  // --- R ---
  [171, "R", "media <- mean(c(1, 2, 3))", "La flecha <- para guardar y c() para listas son de R.", "The <- arrow to assign and c() for vectors are R."],
  [172, "R", 'datos <- read.csv("ventas.csv")', "read.csv con <- es de R.", "read.csv with <- is R."],
  [173, "R", "library(ggplot2)", "library() para cargar paquetes es de R.", "library() to load packages is R."],
  // --- Excel ---
  [181, "Excel", "=SUM(A1:A10)", "Empieza por = y usa celdas como A1: es una fórmula de hoja de cálculo.", "It starts with = and uses cells like A1: it's a spreadsheet formula."],
  [182, "Excel", '=IF(B2>=5,"Pass","Fail")', "=IF con celdas es una fórmula de hoja de cálculo.", "=IF with cells is a spreadsheet formula."],
];

// Familias de lenguajes: las opciones equivocadas se eligen de la misma familia (así cuesta más acertar).
window.FAMILIAS_DE_LENGUAJES = [
  ["C", "C++", "C#", "Java", "Go", "Rust", "Kotlin", "Swift"], // con llaves y tipos
  ["JavaScript", "TypeScript", "PHP", "Java", "C#"], // web y parecidos
  ["Python", "Ruby", "R", "Bash"], // de guion (scripts)
  ["HTML", "CSS", "SQL", "Excel"], // marcado, consultas y hojas de cálculo
];
