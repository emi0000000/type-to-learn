// analisis.js: fórmulas y código para la sección de análisis de datos (Excel / Google Sheets, pandas y NumPy).
// Lista escrita para este proyecto (licencia MIT, como el código).
// Mismo formato que datos/codigo.js:
//   [número, herramienta, código correcto, qué hace (español), qué hace (inglés),
//    [[versión con error, por qué está mal (español), por qué está mal (inglés)], [otra versión con error, ...]]]
// En Excel los nombres de las funciones cambian con el idioma: el código puede ser una pareja [español, inglés]
// (por ejemplo ["=SUMA(A1:A10)", "=SUM(A1:A10)"]) y el juego muestra la del idioma de la interfaz.
// En Excel en español los argumentos se separan con punto y coma (en algunos países, con coma).
window.ANALISIS = [
  // ===== Excel y Google Sheets =====
  [1, "excel", ["=SUMA(A1:A10)", "=SUM(A1:A10)"], "Suma los valores de A1 a A10.", "Adds up the values from A1 to A10.", [
    [["=SUMA(A1-A10)", "=SUM(A1-A10)"], "Un rango se escribe con dos puntos (A1:A10), no con guion.", "A range is written with a colon (A1:A10), not a hyphen."],
    [["SUMA(A1:A10)", "SUM(A1:A10)"], "Falta el = del principio: sin él no es una fórmula.", "The leading = is missing: without it, it isn't a formula."]]],
  [2, "excel", ["=PROMEDIO(B2:B20)", "=AVERAGE(B2:B20)"], "Media de los valores de B2 a B20.", "Average of the values from B2 to B20.", [
    [["=MEDIA(B2:B20)", "=MEAN(B2:B20)"], "La función se llama PROMEDIO.", "The function is called AVERAGE."],
    [["=PROMEDIO(B2;B20)", "=AVERAGE(B2,B20)"], "Así solo promedia esas dos celdas; para un rango se usan dos puntos.", "This only averages those two cells; a range uses a colon."]]],
  [3, "excel", "=MAX(C2:C50)", "El valor más alto de C2 a C50.", "The highest value from C2 to C50.", [
    [["=MAYOR(C2:C50)", "=BIGGEST(C2:C50)"], "La función se llama MAX.", "The function is called MAX."],
    ["=MAX C2:C50", "Faltan los paréntesis.", "The parentheses are missing."]]],
  [4, "excel", "=MIN(C2:C50)", "El valor más bajo de C2 a C50.", "The lowest value from C2 to C50.", [
    [["=MENOR(C2:C50)", "=SMALLEST(C2:C50)"], "La función se llama MIN.", "The function is called MIN."],
    ["=MIN(C2:C50", "Falta cerrar el paréntesis.", "The closing parenthesis is missing."]]],
  [5, "excel", ["=CONTAR(A:A)", "=COUNT(A:A)"], "Cuenta las celdas con números de la columna A.", "Counts the cells with numbers in column A.", [
    [["=CUENTA(A:A)", "=COUNTS(A:A)"], "La función se llama CONTAR.", "The function is called COUNT."],
    [["=CONTAR(A)", "=COUNT(A)"], "Para toda la columna se escribe A:A.", "A whole column is written A:A."]]],
  [6, "excel", ['=SI(B2>=5;"Aprobado";"Pendiente")', '=IF(B2>=5,"Pass","Fail")'], "Escribe un texto u otro según si B2 es 5 o más.", "Writes one text or another depending on whether B2 is 5 or more.", [
    [['=SI(B2=>5;"Aprobado";"Pendiente")', '=IF(B2=>5,"Pass","Fail")'], "El operador es >=, no =>.", "The operator is >=, not =>."],
    [["=SI(B2>=5;Aprobado;Pendiente)", "=IF(B2>=5,Pass,Fail)"], "Los textos van entre comillas.", "Text values go in quotes."]]],
  [7, "excel", ['=CONTAR.SI(A:A;"Madrid")', '=COUNTIF(A:A,"Madrid")'], "Cuántas veces aparece Madrid en la columna A.", "How many times Madrid appears in column A.", [
    [["=CONTAR.SI(A:A;Madrid)", "=COUNTIF(A:A,Madrid)"], "El texto que se busca va entre comillas.", "The text you look for goes in quotes."],
    [['=CONTAR(A:A;"Madrid")', '=COUNT(A:A,"Madrid")'], "Para contar con una condición se usa CONTAR.SI.", "To count with a condition, use COUNTIF."]]],
  [8, "excel", ['=SUMAR.SI(A:A;"Norte";B:B)', '=SUMIF(A:A,"North",B:B)'], "Suma la columna B solo en las filas donde A dice Norte.", "Adds up column B only in the rows where A says North.", [
    [['=SUMA.SI(A:A;"Norte";B:B)', '=SUMSIF(A:A,"North",B:B)'], "La función se llama SUMAR.SI.", "The function is called SUMIF."],
    [['=SUMAR.SI(A:A;B:B;"Norte")', '=SUMIF(A:A,B:B,"North")'], "El orden es: rango, condición y rango que se suma.", "The order is: range, criteria and the range to add."]]],
  [9, "excel", ["=BUSCARV(E2;A2:C100;3;FALSO)", "=VLOOKUP(E2,A2:C100,3,FALSE)"], "Busca E2 en la primera columna de A2:C100 y devuelve el dato de la tercera columna.", "Looks up E2 in the first column of A2:C100 and returns the value in the third column.", [
    [["=BUSCARV(E2;A2:C100;3)", "=VLOOKUP(E2,A2:C100,3)"], "Sin FALSO puede devolver un valor aproximado en vez del exacto.", "Without FALSE it may return an approximate match instead of the exact one."],
    [["=BUSCARV(E2;A2:C100;4;FALSO)", "=VLOOKUP(E2,A2:C100,4,FALSE)"], "El rango solo tiene tres columnas: pedir la cuarta da error.", "The range only has three columns: asking for the fourth gives an error."]]],
  [10, "excel", ["=BUSCARX(E2;A:A;C:C)", "=XLOOKUP(E2,A:A,C:C)"], "Busca E2 en la columna A y devuelve lo que hay en la columna C.", "Looks up E2 in column A and returns what is in column C.", [
    [["=BUSCARX(A:A;E2;C:C)", "=XLOOKUP(A:A,E2,C:C)"], "Primero va el valor que se busca.", "The value you look for goes first."],
    [["=BUSCARX(E2;A:A)", "=XLOOKUP(E2,A:A)"], "Falta la columna de la que se devuelve el resultado.", "The column to return the result from is missing."]]],
  [11, "excel", '=A2&" "&B2', "Une el texto de A2 y B2 con un espacio en medio.", "Joins the text in A2 and B2 with a space in between.", [
    ['=A2&" "B2', "Falta un & antes de B2.", "An & is missing before B2."],
    ['=A2+" "+B2', "El + suma números; para unir textos se usa &.", "+ adds numbers; to join text use &."]]],
  [12, "excel", ["=REDONDEAR(A2;2)", "=ROUND(A2,2)"], "Redondea A2 a dos decimales.", "Rounds A2 to two decimal places.", [
    [["=REDONDEO(A2;2)", "=ROUNDED(A2,2)"], "La función se llama REDONDEAR.", "The function is called ROUND."],
    [["=REDONDEAR(A2)", "=ROUND(A2)"], "Falta el número de decimales.", "The number of decimal places is missing."]]],
  [13, "excel", ["=HOY()", "=TODAY()"], "Pone la fecha de hoy.", "Shows today's date.", [
    [["=HOY", "=TODAY"], "Faltan los paréntesis, aunque vayan vacíos.", "The parentheses are missing, even though they're empty."],
    [["=FECHA()", "=DATE()"], "FECHA necesita año, mes y día; la de hoy es HOY().", "DATE needs year, month and day; today's date is TODAY()."]]],
  [14, "excel", "=$A$1*B2", "Multiplica B2 por A1, que se queda fija al copiar la fórmula hacia abajo.", "Multiplies B2 by A1, which stays fixed when you copy the formula down.", [
    ["=A1*B2", "Sin $, la referencia a A1 se mueve al copiar la fórmula.", "Without $, the reference to A1 moves when you copy the formula."],
    ["=$A$1xB2", "Para multiplicar se usa *.", "Multiplication uses *."]]],
  [15, "excel", ["=SI.ERROR(A2/B2;0)", "=IFERROR(A2/B2,0)"], "Divide A2 entre B2 y, si da error (por ejemplo, entre 0), pone 0.", "Divides A2 by B2 and, if it gives an error (for example, by 0), shows 0.", [
    [["=SI.ERROR(A2/B2)", "=IFERROR(A2/B2)"], "Falta lo que se pone si hay error.", "The value to show on error is missing."],
    [["=SIERROR(A2/B2;0)", "=IF.ERROR(A2/B2,0)"], "Se escribe SI.ERROR, con punto.", "It's written IFERROR, without a dot."]]],
  [16, "excel", ["=MAYUSC(A2)", "=UPPER(A2)"], "Pasa el texto de A2 a mayúsculas.", "Converts the text in A2 to uppercase.", [
    [["=MAYUSCULAS(A2)", "=UPPERCASE(A2)"], "La función se llama MAYUSC.", "The function is called UPPER."],
    [["=MAYUSC A2", "=UPPER A2"], "Faltan los paréntesis.", "The parentheses are missing."]]],
  [17, "excel", ["=LARGO(A2)", "=LEN(A2)"], "Cuenta los caracteres del texto de A2.", "Counts the characters in the text in A2.", [
    [["=LONGITUD(A2)", "=LENGTH(A2)"], "La función se llama LARGO.", "The function is called LEN."],
    [["=LARGO(A2;B2)", "=LEN(A2,B2)"], "Solo recibe un texto.", "It only takes one text."]]],
  [18, "excel", "=B2/C2", "Divide B2 entre C2.", "Divides B2 by C2.", [
    ["=B2÷C2", "En las hojas de cálculo se divide con /.", "Spreadsheets divide with /."],
    ["=B2/C2)", "Sobra un paréntesis.", "There's an extra parenthesis."]]],

  // ===== pandas (Python) =====
  [101, "pandas", "import pandas as pd", "Carga pandas con su nombre corto, pd.", "Loads pandas with its short name, pd.", [
    ["import pd", "pd es el nombre corto; el módulo se llama pandas.", "pd is the short name; the module is called pandas."],
    ["from pandas import pd", "pandas no tiene nada llamado pd.", "pandas has nothing called pd."]]],
  [102, "pandas", 'df = pd.read_csv("ventas.csv")', "Lee un archivo CSV y lo guarda como tabla (DataFrame).", "Reads a CSV file and stores it as a table (DataFrame).", [
    ["df = pd.read_csv(ventas.csv)", "El nombre del archivo va entre comillas.", "The file name goes in quotes."],
    ['df = pd.readcsv("ventas.csv")', "Se llama read_csv, con guion bajo.", "It's called read_csv, with an underscore."]]],
  [103, "pandas", "df.head()", "Muestra las cinco primeras filas.", "Shows the first five rows.", [
    ["df.head", "Faltan los paréntesis: así no se ejecuta.", "The parentheses are missing: it doesn't run like this."],
    ["df.top()", "El método se llama head.", "The method is called head."]]],
  [104, "pandas", "df.describe()", "Resumen estadístico: media, mínimo, máximo, cuartiles...", "Statistical summary: mean, min, max, quartiles...", [
    ["df.summary()", "En pandas se llama describe.", "In pandas it's called describe."],
    ["df.describe", "Faltan los paréntesis.", "The parentheses are missing."]]],
  [105, "pandas", 'df["edad"].mean()', "Media de la columna edad.", "Mean of the edad column.", [
    ["df[edad].mean()", "El nombre de la columna va entre comillas.", "The column name goes in quotes."],
    ['df["edad"].average()', "El método se llama mean.", "The method is called mean."]]],
  [106, "pandas", 'df[df["edad"] > 18]', "Filas en las que la edad es mayor que 18.", "Rows where the age is greater than 18.", [
    ["df[edad > 18]", 'La condición tiene que usar la columna: df["edad"].', 'The condition has to use the column: df["edad"].'],
    ['df["edad" > 18]', "El > va fuera de las comillas y de los corchetes de la columna.", "The > goes outside the quotes and the column brackets."]]],
  [107, "pandas", 'df.groupby("ciudad")["ventas"].sum()', "Total de ventas de cada ciudad.", "Total sales for each city.", [
    ['df.group_by("ciudad")["ventas"].sum()', "Se escribe groupby, todo junto.", "It's written groupby, as one word."],
    ['df.groupby("ciudad").sum("ventas")', "Primero se elige la columna y después se suma.", "First select the column, then add it up."]]],
  [108, "pandas", 'df.sort_values("precio", ascending=False)', "Ordena las filas por precio, de mayor a menor.", "Sorts the rows by price, highest first.", [
    ['df.sort("precio")', "El método se llama sort_values.", "The method is called sort_values."],
    ['df.sort_values("precio", ascending="no")', "ascending es True o False.", "ascending is True or False."]]],
  [109, "pandas", 'df["total"] = df["precio"] * df["cantidad"]', "Crea la columna total multiplicando precio por cantidad.", "Creates the total column by multiplying price by quantity.", [
    ['df.total = df["precio"] * df["cantidad"]', 'Para crear una columna nueva se usa df["total"].', 'To create a new column, use df["total"].'],
    ['df["total"] = df["precio"] x df["cantidad"]', "Para multiplicar se usa *.", "Multiplication uses *."]]],
  [110, "pandas", "df.dropna()", "Quita las filas que tienen datos vacíos.", "Removes the rows with missing data.", [
    ["df.dropnan()", "Se llama dropna.", "It's called dropna."],
    ["df.remove_na()", "Se llama dropna.", "It's called dropna."]]],
  [111, "pandas", "df.fillna(0)", "Rellena los datos vacíos con 0.", "Fills missing data with 0.", [
    ["df.fillna()", "Falta con qué rellenar.", "It's missing what to fill with."],
    ["df.fill(0)", "Se llama fillna.", "It's called fillna."]]],
  [112, "pandas", 'df["ciudad"].value_counts()', "Cuántas veces aparece cada ciudad.", "How many times each city appears.", [
    ['df["ciudad"].count_values()', "Se llama value_counts.", "It's called value_counts."],
    ['df["ciudad"].value_counts', "Faltan los paréntesis.", "The parentheses are missing."]]],
  [113, "pandas", "df.shape", "Número de filas y de columnas de la tabla.", "Number of rows and columns in the table.", [
    ["df.shape()", "shape no lleva paréntesis: es un dato, no un método.", "shape takes no parentheses: it's an attribute, not a method."],
    ["df.dimensions", "No existe: se llama shape.", "It doesn't exist: it's called shape."]]],
  [114, "pandas", 'df.merge(clientes, on="id")', "Une dos tablas por la columna id.", "Joins two tables on the id column.", [
    ["df.merge(clientes, on=id)", "El nombre de la columna va entre comillas.", "The column name goes in quotes."],
    ['df.merge(clientes, by="id")', "En pandas se usa on (by es de otros lenguajes, como R).", "pandas uses on (by is from other languages, like R)."]]],
  [115, "pandas", 'df.to_csv("resultado.csv", index=False)', "Guarda la tabla en un CSV sin la columna de índice.", "Saves the table to a CSV without the index column.", [
    ["df.to_csv(resultado.csv, index=False)", "El nombre del archivo va entre comillas.", "The file name goes in quotes."],
    ['df.save_csv("resultado.csv")', "Se llama to_csv.", "It's called to_csv."]]],
  [116, "pandas", 'df.loc[0, "nombre"]', "El dato de la fila 0 en la columna nombre.", "The value in row 0 of the nombre column.", [
    ['df.loc(0, "nombre")', "loc usa corchetes, no paréntesis.", "loc uses brackets, not parentheses."],
    ['df.iloc[0, "nombre"]', "iloc usa posiciones (números), no nombres de columna.", "iloc uses positions (numbers), not column names."]]],

  // ===== NumPy (Python) =====
  [201, "numpy", "import numpy as np", "Carga NumPy con su nombre corto, np.", "Loads NumPy with its short name, np.", [
    ["import np", "np es el nombre corto; el módulo se llama numpy.", "np is the short name; the module is called numpy."],
    ["from numpy import np", "numpy no tiene nada llamado np.", "numpy has nothing called np."]]],
  [202, "numpy", "a = np.array([1, 2, 3])", "Crea un array con 1, 2 y 3.", "Creates an array with 1, 2 and 3.", [
    ["a = np.array(1, 2, 3)", "Los números van dentro de una lista: [1, 2, 3].", "The numbers go inside a list: [1, 2, 3]."],
    ["a = np.Array([1, 2, 3])", "Se escribe array, en minúscula.", "It's written array, in lowercase."]]],
  [203, "numpy", "np.mean(a)", "Media de los valores.", "Mean of the values.", [
    ["np.media(a)", "Se llama mean.", "It's called mean."],
    ["np.mean[a]", "Las funciones se llaman con paréntesis.", "Functions are called with parentheses."]]],
  [204, "numpy", "np.zeros(5)", "Un array de cinco ceros.", "An array of five zeros.", [
    ["np.zero(5)", "Se llama zeros, en plural.", "It's called zeros, plural."],
    ["np.zeros[5]", "Las funciones se llaman con paréntesis.", "Functions are called with parentheses."]]],
  [205, "numpy", "np.arange(0, 10, 2)", "Números del 0 al 8, de dos en dos.", "Numbers from 0 to 8, in steps of two.", [
    ["np.arrange(0, 10, 2)", "Se escribe arange, con una sola r.", "It's spelled arange, with one r."],
    ["np.range(0, 10, 2)", "En NumPy se llama arange.", "In NumPy it's called arange."]]],
  [206, "numpy", "a.reshape(2, 3)", "Cambia la forma a 2 filas y 3 columnas.", "Changes the shape to 2 rows and 3 columns.", [
    ["a.reshape(2 3)", "Falta la coma.", "The comma is missing."],
    ["a.shape(2, 3)", "shape solo dice la forma; para cambiarla se usa reshape.", "shape only tells the shape; to change it use reshape."]]],
  [207, "numpy", "np.sum(a)", "Suma de todos los valores.", "Sum of all the values.", [
    ["np.total(a)", "Se llama sum.", "It's called sum."],
    ["np.add(a)", "add suma dos arrays entre sí; el total es sum.", "add adds two arrays together; the total is sum."]]],
  [208, "numpy", "a[a > 2]", "Los valores mayores que 2.", "The values greater than 2.", [
    ["a[> 2]", "Falta el array en la condición: a > 2.", "The array is missing from the condition: a > 2."],
    ["a(a > 2)", "Se filtra con corchetes.", "Filtering uses brackets."]]],
  [209, "numpy", "np.sqrt(a)", "Raíz cuadrada de cada valor.", "Square root of each value.", [
    ["np.root(a)", "Se llama sqrt.", "It's called sqrt."],
    ["math.sqrt(a)", "math.sqrt no acepta arrays: hay que usar np.sqrt.", "math.sqrt doesn't accept arrays: use np.sqrt."]]],
  [210, "numpy", "np.std(a)", "Desviación típica (estándar) de los valores.", "Standard deviation of the values.", [
    ["np.desv(a)", "Se llama std.", "It's called std."],
    ["np.std[a]", "Las funciones se llaman con paréntesis.", "Functions are called with parentheses."]]],
];
