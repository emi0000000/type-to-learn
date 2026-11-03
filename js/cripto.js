// cripto.js: crea los retos del modo «Criptografía» (descifrar César, ROT13, Base64 y hexadecimal)
// y los problemas del modo «Puertos». No toca la página: se puede probar con Node (mira tests/).
// Los retos se crean siempre iguales, para que el juego recuerde cuáles ya salieron.

// Palabras y frases de seguridad que se esconden en los retos (en inglés: son las que se ven en el trabajo).
const PALABRAS_CRIPTO = ["PASSWORD", "FIREWALL", "NETWORK", "SECRET", "MALWARE", "PHISHING", "BACKUP", "ROUTER", "SWITCH", "SERVER", "ACCESS", "TOKEN", "CIPHER", "HACKER", "PATCH", "ALERT", "LOGIN", "ADMIN", "SHELL", "VIRUS", "PRIVATE", "PUBLIC", "SAFETY", "UPDATE"];
// Frases para Base64.
const FRASES_CRIPTO = ["Hello world", "Open the door", "The key is under the mat", "Meet me at noon", "Change your password", "Do not click the link", "Update your system", "Backup every day", "Trust but verify", "Lock your screen", "Use two factors", "Read the logs", "Patch on Tuesday", "Keep it secret", "Check the sender"];

// Desplaza cada letra de un texto n posiciones en el abecedario inglés (César).
function cesar(texto, n) {
  // Cada letra mayúscula o minúscula se mueve; lo demás se queda igual.
  return texto.replace(/[a-z]/gi, (letra) => {
    // Base: A o a.
    const base = letra <= "Z" ? 65 : 97;
    // Nueva letra.
    return String.fromCharCode(((letra.charCodeAt(0) - base + n + 26 * 10) % 26) + base);
  });
}

// Codifica un texto en Base64 (funciona en el navegador y en Node).
function base64(texto) {
  // btoa existe en los navegadores y en Node 16 o más.
  return btoa(texto);
}

// Escribe un texto en hexadecimal, un byte por pareja: "OK" -> "4f 4b".
function hexadecimal(texto) {
  // Cada carácter, en dos cifras hexadecimales.
  return [...texto].map((caracter) => caracter.charCodeAt(0).toString(16).padStart(2, "0")).join(" ");
}

// Retos de criptografía: [número, respuesta, enunciado, nivel, solución explicada].
// Nivel 1: César con desplazamiento 3 y hexadecimal; 2: ROT13 y Base64; 3: César con otro desplazamiento.
function retosCripto() {
  // Retos.
  const retos = [];
  // Añade un reto.
  const anadir = (respuesta, enunciado, nivel, solucion) => retos.push([retos.length + 1, respuesta, enunciado, nivel, solucion]);
  // Recorremos las palabras.
  PALABRAS_CRIPTO.forEach((palabra, i) => {
    // César +3 (el de Julio César).
    anadir(palabra, `César +3: ${cesar(palabra, 3)}`, 1, `${cesar(palabra, 3)} → −3 → ${palabra}`);
    // Hexadecimal (solo con algunas, para no repetir tanto).
    if (i % 2 === 0) {
      // Reto en hexadecimal.
      anadir(palabra, `Hex: ${hexadecimal(palabra)}`, 1, `${hexadecimal(palabra)} → ${palabra}`);
    }
    // ROT13.
    anadir(palabra, `ROT13: ${cesar(palabra, 13)}`, 2, `${cesar(palabra, 13)} → ROT13 → ${palabra}`);
    // César con otro desplazamiento (5 a 11), dicho en el enunciado.
    const n = 5 + (i % 7);
    // Reto.
    anadir(palabra, `César +${n}: ${cesar(palabra, n)}`, 3, `${cesar(palabra, n)} → −${n} → ${palabra}`);
  });
  // Frases en Base64.
  FRASES_CRIPTO.forEach((frase) => anadir(frase, `Base64: ${base64(frase)}`, 2, `${base64(frase)} → ${frase}`));
  // Devolvemos.
  return retos;
}

// Compara la respuesta de un reto: sin mirar mayúsculas ni espacios de más.
function comprobarCripto(escrito, respuesta) {
  // Limpia: minúsculas y espacios simples.
  const limpiar = (texto) => texto.toLowerCase().replace(/\s+/g, " ").trim();
  // Iguales.
  return limpiar(escrito) === limpiar(respuesta);
}

// Problemas de puertos: [número, respuesta, enunciado, nivel, solución, otras respuestas válidas, puerto].
//   lista: datos/puertos.js
// Cada puerto da dos: «¿Qué puerto usa SSH?» (se escribe 22) y «¿Qué protocolo usa el 22?» (se escribe SSH).
function problemasPuertos(lista) {
  // Problemas.
  const problemas = [];
  // Recorremos.
  for (const [puerto, protocolo, otras, , , nivel] of lista) {
    // Del protocolo al puerto.
    problemas.push([problemas.length + 1, String(puerto), `${protocolo} → ?`, nivel, `${protocolo} → ${puerto}`, [], puerto]);
    // Del puerto al protocolo.
    problemas.push([problemas.length + 1, protocolo, `${puerto} → ?`, nivel, `${puerto} → ${protocolo}`, otras, puerto]);
  }
  // Devolvemos.
  return problemas;
}

// Compara la respuesta de un puerto o protocolo (sin mirar mayúsculas, guiones ni espacios).
function comprobarPuerto(escrito, respuesta, otras = []) {
  // Limpia: minúsculas, sin espacios ni guiones.
  const limpiar = (texto) => texto.toLowerCase().replace(/[\s-]+/g, "");
  // La respuesta o alguna de las otras.
  return [respuesta, ...otras].some((valida) => limpiar(valida) === limpiar(escrito));
}

// Si este archivo se carga desde Node (en las pruebas), exportamos lo necesario.
if (typeof module !== "undefined" && module.exports) {
  // Lista de lo que pueden usar las pruebas.
  module.exports = { cesar, base64, hexadecimal, retosCripto, comprobarCripto, problemasPuertos, comprobarPuerto, PALABRAS_CRIPTO };
}
