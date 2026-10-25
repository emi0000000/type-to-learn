// aritmetica.js: crea los problemas de los modos de matemáticas «de resultado» y comprueba las respuestas.
// - Sumas y restas.
// - Operaciones: multiplicar, dividir y potencias (y alguna resta con resultado negativo).
// - Fórmula general: ecuaciones de segundo grado (ax² + bx + c = 0).
// - Mezcla: porcentajes, raíces, fracciones, ecuaciones de primer grado y orden de las operaciones.
// Cada problema es una lista: [número, respuesta, enunciado, nivel (1, 2 o 3), solución explicada].
// Los problemas se crean siempre iguales (con semilla), para que el juego pueda recordar cuáles ya salieron.
// No toca la página, solo hace cálculos. Así se puede probar fácilmente con Node (mira tests/).

// Cuántos problemas se crean de cada nivel.
const PROBLEMAS_POR_NIVEL = 50;
// Cifras pequeñas para escribir potencias: 2⁵.
const SUPERINDICES = { 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹", "-": "⁻" };

// Generador de números al azar con semilla (mulberry32): siempre da la misma serie para la misma semilla.
function semillaAzar(semilla) {
  // Estado interno (entero de 32 bits).
  let estado = semilla >>> 0;
  // Devolvemos una función que da números entre 0 y 1.
  return () => {
    // Avanzamos el estado.
    estado = (estado + 0x6d2b79f5) >>> 0;
    // Mezclamos los bits.
    let mezcla = Math.imul(estado ^ (estado >>> 15), 1 | estado);
    // Mezclamos otra vez.
    mezcla = (mezcla + Math.imul(mezcla ^ (mezcla >>> 7), 61 | mezcla)) ^ mezcla;
    // Pasamos a un número entre 0 y 1.
    return ((mezcla ^ (mezcla >>> 14)) >>> 0) / 4294967296;
  };
}

// Número entero al azar entre dos valores (los dos incluidos).
function entre(azar, minimo, maximo) {
  // Redondeamos hacia abajo un número al azar del tamaño del intervalo.
  return minimo + Math.floor(azar() * (maximo - minimo + 1));
}

// Elige un elemento al azar de una lista.
function uno(azar, lista) {
  // Posición al azar.
  return lista[Math.floor(azar() * lista.length)];
}

// Escribe un exponente con cifras pequeñas: 25 -> "²⁵".
function superindice(n) {
  // Cada carácter, cambiado por su versión pequeña.
  return [...String(n)].map((c) => SUPERINDICES[c]).join("");
}

// Escribe un número negativo con el signo menos tipográfico (−5), que se lee mejor.
function conSigno(n) {
  // Negativo: signo menos; positivo: tal cual.
  return n < 0 ? `−${-n}` : String(n);
}

// Máximo común divisor (para simplificar fracciones).
function mcd(a, b) {
  // Algoritmo de Euclides con valores positivos.
  a = Math.abs(a);
  // Lo mismo con b.
  b = Math.abs(b);
  // Mientras quede resto...
  while (b) {
    // ...cambiamos los números.
    [a, b] = [b, a % b];
  }
  // El último distinto de cero.
  return a;
}

// Escribe una fracción simplificada ("3/4", "-1/2" o un entero si se puede).
function fraccion(numerador, denominador) {
  // El signo va siempre en el numerador.
  if (denominador < 0) {
    // Cambiamos los dos de signo.
    numerador = -numerador;
    // El denominador queda positivo.
    denominador = -denominador;
  }
  // Divisor común.
  const divisor = mcd(numerador, denominador) || 1;
  // Simplificamos.
  const n = numerador / divisor;
  // Simplificamos.
  const d = denominador / divisor;
  // Si el denominador es 1, es un número entero.
  return d === 1 ? String(n) : `${n}/${d}`;
}

// Lee un número escrito por la persona: "12", "-3", "−3", "0,5", "0.5", "3/4". Devuelve NaN si no es un número.
function leerNumero(texto) {
  // Limpiamos: signo menos tipográfico, coma decimal y espacios.
  const limpio = texto.replace(/−/g, "-").replace(/\s+/g, "").replace(",", ".");
  // Número entero o decimal.
  if (/^-?\d+(\.\d+)?$/.test(limpio)) {
    // Lo convertimos.
    return Number(limpio);
  }
  // Fracción.
  const partes = limpio.match(/^(-?\d+)\/(-?\d+)$/);
  // Si es una fracción con denominador distinto de cero...
  if (partes && Number(partes[2]) !== 0) {
    // ...la dividimos.
    return Number(partes[1]) / Number(partes[2]);
  }
  // No es un número.
  return NaN;
}

// Lee una lista de números separados por punto y coma, por "y" o por coma seguida de espacio: "2; 3", "x1 = 2, x2 = 3".
function leerLista(texto) {
  // Quitamos "x =", "x1 =", "x₂ ="...
  let limpio = texto.toLowerCase().replace(/x\s*[12₁₂]?\s*=\s*/g, " ");
  // La coma entre cifras sin espacio es decimal (0,5): la cambiamos por punto.
  limpio = limpio.replace(/(\d),(\d)/g, "$1.$2");
  // Partimos por ; , y "y"/"and".
  return limpio
    // Separadores.
    .split(/;|,|\by\b|\band\b/)
    // Sin espacios.
    .map((parte) => parte.trim())
    // Sin trozos vacíos.
    .filter((parte) => parte !== "")
    // Cada trozo, como número.
    .map(leerNumero);
}

// ¿Dos números son iguales (con un margen muy pequeño, por los decimales)?
function iguales(a, b) {
  // Diferencia casi cero.
  return Math.abs(a - b) < 1e-9;
}

// Comprueba una respuesta numérica (o una lista de soluciones, si la correcta tiene ";").
function comprobarNumero(escrito, correcta) {
  // Si la correcta es una lista (ecuaciones de segundo grado)...
  if (correcta.includes(";")) {
    // ...comparamos las dos listas ordenadas.
    const esperadas = leerLista(correcta).sort((a, b) => a - b);
    // Lo escrito, sin repetidos y ordenado.
    const escritas = [...new Set(leerLista(escrito))].sort((a, b) => a - b);
    // Mismo número de soluciones y todas iguales.
    return escritas.length === esperadas.length && escritas.every((valor, i) => iguales(valor, esperadas[i]));
  }
  // Una sola solución: aceptamos también "x = 5" o "3; 3" (raíz doble).
  const escritas = [...new Set(leerLista(escrito).map((valor) => Math.round(valor * 1e9) / 1e9))];
  // Tiene que ser un solo número igual al correcto.
  return escritas.length === 1 && iguales(escritas[0], leerNumero(correcta));
}

// Crea una lista de problemas con un generador por nivel, sin repetir enunciados.
//   semilla:     número para el azar (cada modo la suya)
//   generadores: tres funciones (una por nivel) que devuelven [respuesta, enunciado, solución]
function crearProblemas(semilla, generadores) {
  // Azar con semilla.
  const azar = semillaAzar(semilla);
  // Problemas creados.
  const problemas = [];
  // Enunciados ya usados.
  const usados = new Set();
  // Recorremos los niveles.
  generadores.forEach((generar, posicion) => {
    // Nivel (1, 2 o 3).
    const nivel = posicion + 1;
    // Intentos, para no quedarnos atascados si se repiten mucho.
    let intentos = 0;
    // Problemas de este nivel.
    let creados = 0;
    // Creamos hasta tener los que tocan.
    while (creados < PROBLEMAS_POR_NIVEL && intentos < PROBLEMAS_POR_NIVEL * 20) {
      // Un intento más.
      intentos++;
      // Problema nuevo.
      const [respuesta, enunciado, solucion] = generar(azar);
      // Si el enunciado ya salió, probamos otro.
      if (usados.has(enunciado)) {
        // Siguiente intento.
        continue;
      }
      // Lo anotamos.
      usados.add(enunciado);
      // Lo guardamos con su número.
      problemas.push([problemas.length + 1, respuesta, enunciado, nivel, solucion]);
      // Uno más de este nivel.
      creados++;
    }
  });
  // Devolvemos la lista.
  return problemas;
}

// Una suma o una resta (sin resultados negativos).
function sumaOResta(azar, minimo, maximo) {
  // Dos números.
  let a = entre(azar, minimo, maximo);
  // Segundo número.
  let b = entre(azar, minimo, maximo);
  // Suma o resta.
  if (azar() < 0.5) {
    // Suma.
    return [String(a + b), `${a} + ${b} =`, `${a} + ${b} = ${a + b}`];
  }
  // En la resta, el mayor primero.
  if (b > a) {
    // Los cambiamos.
    [a, b] = [b, a];
  }
  // Resta.
  return [String(a - b), `${a} − ${b} =`, `${a} − ${b} = ${a - b}`];
}

// Problemas de sumas y restas.
function problemasSumasRestas() {
  // Tres niveles: una cifra, dos cifras y tres cifras (con alguna operación de tres números).
  return crearProblemas(11, [
    // Una cifra.
    (azar) => sumaOResta(azar, 1, 9),
    // Dos cifras.
    (azar) => sumaOResta(azar, 10, 99),
    // Tres cifras o tres números.
    (azar) => {
      // A veces, tres números.
      if (azar() < 0.4) {
        // Tres números.
        const a = entre(azar, 100, 500);
        // Segundo.
        const b = entre(azar, 10, 99);
        // Tercero (sin que quede negativo).
        const c = entre(azar, 10, a);
        // Resultado.
        const total = a + b - c;
        // Problema.
        return [String(total), `${a} + ${b} − ${c} =`, `${a} + ${b} = ${a + b}; ${a + b} − ${c} = ${total}`];
      }
      // Si no, una suma o resta grande.
      return sumaOResta(azar, 100, 999);
    },
  ]);
}

// Una multiplicación, una división exacta, una potencia o una resta negativa, según el nivel.
function operacion(azar, nivel) {
  // Tipo de operación.
  const tipo = uno(azar, nivel === 1 ? ["x", "x", "/", "/", "^"] : ["x", "/", "^", "-"]);
  // Multiplicación.
  if (tipo === "x") {
    // Tamaños según el nivel.
    const a = nivel === 1 ? entre(azar, 2, 10) : nivel === 2 ? entre(azar, 11, 25) : entre(azar, 12, 49);
    // Segundo factor.
    const b = nivel === 1 ? entre(azar, 2, 10) : nivel === 2 ? entre(azar, 2, 9) : entre(azar, 11, 29);
    // Problema.
    return [String(a * b), `${a} × ${b} =`, `${a} × ${b} = ${a * b}`];
  }
  // División exacta: se crea al revés (cociente × divisor).
  if (tipo === "/") {
    // Divisor.
    const divisor = nivel === 1 ? entre(azar, 2, 10) : nivel === 2 ? entre(azar, 2, 12) : entre(azar, 11, 25);
    // Cociente.
    const cociente = nivel === 1 ? entre(azar, 2, 10) : nivel === 2 ? entre(azar, 11, 30) : entre(azar, 12, 40);
    // Dividendo.
    const dividendo = divisor * cociente;
    // Problema.
    return [String(cociente), `${dividendo} ÷ ${divisor} =`, `${dividendo} ÷ ${divisor} = ${cociente} (${cociente} × ${divisor} = ${dividendo})`];
  }
  // Potencia.
  if (tipo === "^") {
    // Base y exponente según el nivel.
    const [base, exponente] = nivel === 1 ? uno(azar, [[entre(azar, 2, 10), 2], [2, entre(azar, 2, 5)], [10, entre(azar, 2, 3)]]) : nivel === 2 ? uno(azar, [[entre(azar, 11, 20), 2], [entre(azar, 2, 5), 3], [2, entre(azar, 6, 10)], [10, entre(azar, 4, 6)]]) : uno(azar, [[entre(azar, -5, -2), 3], [entre(azar, -9, -2), 2], [3, entre(azar, 3, 5)], [entre(azar, 21, 30), 2]]);
    // Resultado.
    const resultado = base ** exponente;
    // Base entre paréntesis si es negativa.
    const textoBase = base < 0 ? `(${conSigno(base)})` : String(base);
    // Multiplicación repetida, para la explicación (solo si es corta).
    const repetida = exponente <= 5 ? ` (${Array(exponente).fill(textoBase).join(" × ")})` : "";
    // Problema.
    return [String(resultado), `${textoBase}${superindice(exponente)} =`, `${textoBase}${superindice(exponente)} = ${conSigno(resultado)}${repetida}`];
  }
  // Resta con resultado negativo.
  const a = entre(azar, 2, nivel === 2 ? 30 : 200);
  // Mayor que a.
  const b = a + entre(azar, 1, nivel === 2 ? 30 : 200);
  // Problema.
  return [String(a - b), `${a} − ${b} =`, `${a} − ${b} = ${conSigno(a - b)}`];
}

// Problemas de operaciones (multiplicar, dividir, potencias).
function problemasOperaciones() {
  // Tres niveles de tamaño.
  return crearProblemas(22, [(azar) => operacion(azar, 1), (azar) => operacion(azar, 2), (azar) => operacion(azar, 3)]);
}

// Escribe un polinomio de segundo grado: ax² + bx + c = 0, sin coeficientes 1 ni términos con 0.
function escribirEcuacion(a, b, c) {
  // Término en x².
  let texto = a === 1 ? "x²" : a === -1 ? "−x²" : `${conSigno(a)}x²`;
  // Término en x.
  if (b !== 0) {
    // Signo y coeficiente (sin el 1).
    texto += `${b > 0 ? " + " : " − "}${Math.abs(b) === 1 ? "" : Math.abs(b)}x`;
  }
  // Término independiente.
  if (c !== 0) {
    // Signo y número.
    texto += `${c > 0 ? " + " : " − "}${Math.abs(c)}`;
  }
  // Igualado a cero.
  return `${texto} = 0`;
}

// Crea una ecuación de segundo grado a partir de sus soluciones: a(x − r1)(x − r2) con r = p/q.
//   a:          coeficiente principal
//   [p1, q1]:   primera solución p1/q1
//   [p2, q2]:   segunda solución p2/q2
function ecuacionDesdeSoluciones(a, [p1, q1], [p2, q2]) {
  // a(q1·x − p1)(q2·x − p2) = a·q1·q2·x² − a(q1·p2 + q2·p1)x + a·p1·p2.
  const A = a * q1 * q2;
  // Coeficiente de x.
  const B = -a * (q1 * p2 + q2 * p1);
  // Término independiente.
  const C = a * p1 * p2;
  // Simplificamos los tres por su divisor común (y dejamos A positivo si se puede).
  let divisor = mcd(mcd(A, B), C) || 1;
  // Si A sale negativo y no queremos, no lo cambiamos: se respeta el signo de a.
  divisor = Math.abs(divisor);
  // Coeficientes finales.
  const [fa, fb, fc] = [A / divisor, B / divisor, C / divisor];
  // Soluciones como texto, de menor a mayor y sin repetir.
  const valores = [[p1, q1], [p2, q2]].sort((x, y) => x[0] / x[1] - y[0] / y[1]);
  // Texto de cada solución.
  const textos = [...new Set(valores.map(([p, q]) => fraccion(p, q)))];
  // Respuesta: una sola si es doble; dos separadas por "; " si no.
  const respuesta = textos.join("; ");
  // Discriminante.
  const discriminante = fb * fb - 4 * fa * fc;
  // Explicación con la fórmula general (con el signo menos de verdad, −, en las soluciones).
  const solucion = `Δ = ${fb < 0 ? `(${conSigno(fb)})` : fb}² − 4·${fa < 0 ? `(${conSigno(fa)})` : fa}·${fc < 0 ? `(${conSigno(fc)})` : fc} = ${discriminante}; x = (${conSigno(-fb)} ± √${discriminante}) / ${conSigno(2 * fa)} → ${respuesta.replace(/-/g, "−")}`;
  // Devolvemos respuesta, enunciado y explicación.
  return [respuesta, escribirEcuacion(fa, fb, fc), solucion];
}

// Problemas de ecuaciones de segundo grado (fórmula general).
function problemasFormulaGeneral() {
  // Tres niveles.
  return crearProblemas(33, [
    // Nivel 1: a = 1, soluciones enteras.
    (azar) => ecuacionDesdeSoluciones(1, [entre(azar, -9, 9), 1], [entre(azar, -9, 9), 1]),
    // Nivel 2: a = 2, 3, −1 o −2, soluciones enteras.
    (azar) => ecuacionDesdeSoluciones(uno(azar, [2, 3, -1, -2]), [entre(azar, -6, 6), 1], [entre(azar, -6, 6), 1]),
    // Nivel 3: una solución fraccionaria (como 1/2 o −2/3).
    (azar) => ecuacionDesdeSoluciones(1, [entre(azar, -5, 5) || 1, uno(azar, [2, 3, 4])], [entre(azar, -6, 6), 1]),
  ]);
}

// Añade "= resultado" a una explicación solo si el resultado simplificado es distinto de la fracción sin simplificar.
function conResultado(explicacion, sinSimplificar, resultado) {
  // Si coinciden, la explicación ya termina en el resultado.
  return sinSimplificar === resultado ? explicacion : `${explicacion} = ${resultado}`;
}

// Un problema variado del nivel indicado.
function problemaVariado(azar, nivel) {
  // Tipo de problema.
  const tipo = uno(azar, ["porcentaje", "raiz", "fraccion", "ecuacion", "orden"]);
  // Porcentaje.
  if (tipo === "porcentaje") {
    // Porcentaje según el nivel.
    const por = uno(azar, nivel === 1 ? [10, 50, 25] : nivel === 2 ? [20, 75, 5, 30] : [12, 15, 35, 40]);
    // Cantidad que da un resultado entero.
    const total = entre(azar, 1, nivel === 3 ? 40 : 20) * (100 / mcd(por, 100));
    // Resultado.
    const resultado = (por * total) / 100;
    // Problema.
    return [String(resultado), `${por} % · ${total} =`, `${por} % · ${total} = ${por}/100 · ${total} = ${resultado}`];
  }
  // Raíz.
  if (tipo === "raiz") {
    // Nivel 3: raíz cúbica.
    if (nivel === 3) {
      // Raíz.
      const r = entre(azar, 2, 10);
      // Problema.
      return [String(r), `∛${r ** 3} =`, `∛${r ** 3} = ${r} (${r}³ = ${r ** 3})`];
    }
    // Raíz cuadrada exacta.
    const r = nivel === 1 ? entre(azar, 2, 10) : entre(azar, 11, 20);
    // Problema.
    return [String(r), `√${r * r} =`, `√${r * r} = ${r} (${r}² = ${r * r})`];
  }
  // Fracciones.
  if (tipo === "fraccion") {
    // Nivel 1: mismo denominador.
    if (nivel === 1) {
      // Denominador.
      const d = entre(azar, 3, 9);
      // Numeradores.
      const a = entre(azar, 1, d - 1);
      // Segundo numerador.
      const b = entre(azar, 1, d - 1);
      // Resultado.
      const resultado = fraccion(a + b, d);
      // Problema.
      return [resultado, `${a}/${d} + ${b}/${d} =`, conResultado(`${a}/${d} + ${b}/${d} = ${a + b}/${d}`, `${a + b}/${d}`, resultado)];
    }
    // Fracciones con denominadores distintos.
    const [a, b, c, d] = [entre(azar, 1, 5), entre(azar, 2, 6), entre(azar, 1, 5), entre(azar, 2, 6)];
    // Nivel 2: suma; nivel 3: multiplicación.
    if (nivel === 2) {
      // Resultado.
      const resultado = fraccion(a * d + c * b, b * d);
      // Problema.
      return [resultado, `${a}/${b} + ${c}/${d} =`, `${a}/${b} + ${c}/${d} = (${a}·${d} + ${c}·${b})/(${b}·${d}) = ${resultado}`];
    }
    // Resultado del producto.
    const resultado = fraccion(a * c, b * d);
    // Problema.
    return [resultado, `${a}/${b} × ${c}/${d} =`, conResultado(`${a}/${b} × ${c}/${d} = ${a * c}/${b * d}`, `${a * c}/${b * d}`, resultado)];
  }
  // Ecuación de primer grado (se crea a partir de la solución).
  if (tipo === "ecuacion") {
    // Solución.
    const x = entre(azar, nivel === 1 ? 1 : -9, nivel === 1 ? 20 : 12);
    // Nivel 1: x + a = b.
    if (nivel === 1) {
      // Sumando.
      const a = entre(azar, 1, 20);
      // Problema.
      return [String(x), `x + ${a} = ${x + a} → x =`, `x = ${x + a} − ${a} = ${x}`];
    }
    // Coeficiente.
    const a = entre(azar, 2, 9);
    // Término.
    const b = entre(azar, -20, 20) || 5;
    // Nivel 2: ax + b = c.
    if (nivel === 2) {
      // Lado derecho.
      const c = a * x + b;
      // Problema.
      return [String(x), `${a}x ${b < 0 ? "−" : "+"} ${Math.abs(b)} = ${conSigno(c)} → x =`, `${a}x = ${conSigno(c)} ${b < 0 ? "+" : "−"} ${Math.abs(b)} = ${conSigno(c - b)}; x = ${conSigno(c - b)} / ${a} = ${conSigno(x)}`];
    }
    // Nivel 3: a(x + b) = c.
    const c = a * (x + b);
    // Problema.
    return [String(x), `${a}(x ${b < 0 ? "−" : "+"} ${Math.abs(b)}) = ${conSigno(c)} → x =`, `x ${b < 0 ? "−" : "+"} ${Math.abs(b)} = ${conSigno(c)} / ${a} = ${conSigno(x + b)}; x = ${conSigno(x)}`];
  }
  // Orden de las operaciones.
  const [a, b, c] = [entre(azar, 2, 9), entre(azar, 2, 9), entre(azar, 2, 9)];
  // Nivel 1: a + b × c.
  if (nivel === 1) {
    // Problema.
    return [String(a + b * c), `${a} + ${b} × ${c} =`, `${b} × ${c} = ${b * c}; ${a} + ${b * c} = ${a + b * c}`];
  }
  // Nivel 2: (a + b) × c.
  if (nivel === 2) {
    // Problema.
    return [String((a + b) * c), `(${a} + ${b}) × ${c} =`, `${a} + ${b} = ${a + b}; ${a + b} × ${c} = ${(a + b) * c}`];
  }
  // Nivel 3: a² − b × c.
  return [String(a * a - b * c), `${a}² − ${b} × ${c} =`, `${a}² = ${a * a}; ${b} × ${c} = ${b * c}; ${a * a} − ${b * c} = ${conSigno(a * a - b * c)}`];
}

// Problemas variados.
function problemasMezcla() {
  // Tres niveles.
  return crearProblemas(44, [(azar) => problemaVariado(azar, 1), (azar) => problemaVariado(azar, 2), (azar) => problemaVariado(azar, 3)]);
}

// Si este archivo se carga desde Node (en las pruebas), exportamos lo necesario.
if (typeof module !== "undefined" && module.exports) {
  // Lista de lo que pueden usar las pruebas.
  module.exports = { leerNumero, leerLista, comprobarNumero, fraccion, escribirEcuacion, problemasSumasRestas, problemasOperaciones, problemasFormulaGeneral, problemasMezcla };
}
