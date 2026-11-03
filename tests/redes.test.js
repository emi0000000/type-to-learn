// Pruebas de la sección Redes: la consola (js/consola.js), los laboratorios (datos/laboratorios.js)
// y los comandos sueltos (datos/redes.js). Se ejecutan con: npm test

// Herramienta de pruebas que trae Node.
const { test } = require("node:test");
// Comprobaciones estrictas.
const assert = require("node:assert/strict");
// Para leer archivos.
const fs = require("node:fs");
// Para construir rutas.
const path = require("node:path");
// Para ejecutar los archivos de datos en un espacio aislado.
const vm = require("node:vm");
// La consola.
const Consola = require("../js/consola.js");
// Textos de la interfaz.
const { TEXTOS } = require("../js/textos.js");

// Carga un archivo de datos tal como lo lee el navegador y devuelve la variable que crea.
function cargar(archivo, variable) {
  // Objeto que hace de "window" del navegador.
  const ventana = {};
  // Ejecutamos el archivo.
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, "..", "datos", archivo), "utf8"), { window: ventana });
  // Devolvemos la lista.
  return ventana[variable];
}

// Laboratorios.
const LABORATORIOS = (() => {
  // Ventana compartida: los de seguridad se añaden a la misma lista.
  const ventana = {};
  // Los dos archivos, en orden.
  for (const archivo of ["laboratorios.js", "laboratorios-seguridad.js"]) {
    // Ejecutamos.
    vm.runInNewContext(fs.readFileSync(path.join(__dirname, "..", "datos", archivo), "utf8"), { window: ventana });
  }
  // La lista entera.
  return ventana.LABORATORIOS;
})();
// Comandos sueltos.
const COMANDOS_RED = cargar("redes.js", "COMANDOS_RED");

// ¿Es una pareja [español, inglés] de textos?
const esPareja = (valor) => Array.isArray(valor) && valor.length === 2 && valor.every((texto) => typeof texto === "string" && texto.length > 0);

// --- La consola ---

// Las abreviaturas típicas del IOS se aceptan.
test("consola: acepta las abreviaturas del IOS", () => {
  // Parejas [escrito, esperado].
  const casos = [
    ["en", "enable"],
    ["conf t", "configure terminal"],
    ["int g0/0", "interface GigabitEthernet0/0"],
    ["int fa 0/1", "interface fa0/1"],
    ["int ran f0/1-10", "interface range fa0/1 - 10"],
    ["sw mo acc", "switchport mode access"],
    ["sw acc vl 10", "switchport access vlan 10"],
    ["no sh", "no shutdown"],
    ["ip add 10.0.0.1 255.255.255.252", "ip address 10.0.0.1 255.255.255.252"],
    ["sh ip int br", "show ip interface brief"],
    ["copy run start", "copy running-config startup-config"],
    ["ENABLE", "enable"],
    ["int po1", "interface port-channel 1"],
  ];
  // Cada uno vale.
  for (const [escrito, esperado] of casos) {
    // Coincide.
    assert.ok(Consola.compararIOS(escrito, esperado).ok, `${escrito} = ${esperado}`);
  }
});

// Los errores se clasifican como en el IOS.
test("consola: tipos de error del IOS", () => {
  // Palabra mal escrita: inválido, señalando dónde.
  assert.deepEqual(Consola.compararIOS("swichport mode access", "switchport mode access"), { ok: false, error: "invalido", posicion: 0, palabra: "swichport", acertadas: 0 });
  // Falta algo.
  assert.equal(Consola.compararIOS("switchport mode", "switchport mode access").error, "incompleto");
  // Una sola letra.
  assert.equal(Consola.compararIOS("c t", "configure terminal").error, "ambiguo");
  // Otro comando que existe.
  assert.equal(Consola.compararIOS("shutdown", "no shutdown").error, "otro");
  // Sobra algo: inválido en la palabra de más.
  assert.equal(Consola.compararIOS("switchport mode access vlan", "switchport mode access").posicion, 23);
  // Los nombres y contraseñas distinguen mayúsculas.
  assert.equal(Consola.compararIOS("hostname s1", "hostname S1").ok, false);
  // En Linux, una orden que no existe.
  assert.equal(Consola.compararExacto("apt-get install nginx", "sudo apt install nginx", "linux").error, "desconocido");
  // En el PC da igual la mayúscula.
  assert.ok(Consola.compararExacto("PING 10.0.0.1", "ping 10.0.0.1", "pc").ok);
  // Con alternativas, dice cuál coincidió.
  assert.deepEqual(Consola.comparar("wr", "copy running-config startup-config", ["write memory", "write"]), { ok: true, comando: "write" });
});

// El prompt cambia con cada modo, como en un equipo de verdad.
test("consola: el prompt sigue los modos del IOS", () => {
  // Estado inicial de un switch.
  let estado = Consola.estadoInicial({ tipo: "cisco" });
  // Comandos y prompt esperado después de cada uno.
  const pasos = [
    ["enable", "Switch#"],
    ["configure terminal", "Switch(config)#"],
    ["hostname S1", "S1(config)#"],
    ["interface g0/1", "S1(config-if)#"],
    ["interface range fa0/1 - 10", "S1(config-if-range)#"],
    ["vlan 10", "S1(config-vlan)#"],
    ["line vty 0 15", "S1(config-line)#"],
    ["router ospf 1", "S1(config-router)#"],
    ["ip dhcp pool VENTAS", "S1(dhcp-config)#"],
    ["ip access-list extended INVITADOS", "S1(config-ext-nacl)#"],
    ["interface g0/0.10", "S1(config-subif)#"],
    ["exit", "S1(config)#"],
    ["exit", "S1#"],
    ["disable", "S1>"],
  ];
  // Recorremos.
  for (const [comando, esperado] of pasos) {
    // Aplicamos.
    estado = Consola.avanzar(estado, comando).estado;
    // Prompt.
    assert.equal(Consola.prompt(estado), esperado, comando);
  }
  // no shutdown avisa del cambio de estado de la interfaz.
  const { mensajes } = Consola.avanzar({ tipo: "cisco", nombre: "R1", modo: "config-if", interfaz: "GigabitEthernet0/0" }, "no shutdown");
  // Mensaje del IOS.
  assert.ok(mensajes.includes("%LINK-5-CHANGED: Interface GigabitEthernet0/0, changed state to up"));
  // En Linux, cd cambia la carpeta del prompt.
  let linux = Consola.estadoInicial({ tipo: "linux", usuario: "admin", host: "web01" });
  // A /var/log.
  linux = Consola.avanzar(linux, "cd /var/log").estado;
  // Prompt.
  assert.equal(Consola.prompt(linux), "admin@web01:/var/log$");
  // Subir un nivel.
  linux = Consola.avanzar(linux, "cd ..").estado;
  // Prompt.
  assert.equal(Consola.prompt(linux), "admin@web01:/var$");
});

// La plantilla tapa las palabras clave y deja los datos.
test("consola: plantilla, Tab, ayuda y ping", () => {
  // Plantillas.
  assert.equal(Consola.plantilla("switchport mode access"), "switchport ____ ______");
  // Con datos.
  assert.equal(Consola.plantilla("ip address 10.0.0.1 255.0.0.0"), "ip _______ 10.0.0.1 255.0.0.0");
  // Sin palabras clave detrás: se tapa la primera.
  assert.equal(Consola.plantilla("hostname S1"), "ho______ S1");
  // Linux.
  assert.equal(Consola.plantilla("sudo apt install nginx -y", "linux"), "sudo ___ _______ nginx __");
  // Tab completa la palabra.
  assert.equal(Consola.completar("sw mo", "switchport mode access"), "sw mode ");
  // ? sugiere la siguiente palabra.
  assert.deepEqual(Consola.ayudaIOS("switchport ", "switchport mode access", "config-if"), ["  mode"]);
  // Ping con un paquete perdido.
  const ping = Consola.salidaPing("10.0.0.1", 255, 1);
  // El primero se pierde.
  assert.ok(ping.includes("Request timed out."));
  // El resumen.
  assert.ok(ping.includes("    Packets: Sent = 4, Received = 3, Lost = 1 (25% loss),"));
});

// --- Los laboratorios ---

// Cada laboratorio tiene todos sus datos bien.
test("laboratorios: formato", () => {
  // Unos cuantos de cada nivel en cada sección.
  for (const [seccion, minimo] of [["redes", 5], ["seguridad", 2]]) {
    // Cada nivel.
    for (const nivel of [1, 2, 3]) {
      // Al menos el mínimo.
      assert.ok(LABORATORIOS.filter((lab) => (lab.seccion || "redes") === seccion && lab.nivel === nivel).length >= minimo, `${seccion} nivel ${nivel}`);
    }
  }
  // Nombres distintos.
  assert.equal(new Set(LABORATORIOS.map((lab) => lab.id)).size, LABORATORIOS.length);
  // Recorremos los laboratorios.
  for (const lab of LABORATORIOS) {
    // Textos en los dos idiomas.
    assert.ok(esPareja(lab.titulo) && esPareja(lab.resumen) && esPareja(lab.objetivo), lab.id);
    // Tipo, insignia y color.
    assert.ok(["cisco", "linux"].includes(lab.tipo) && lab.insignia && lab.color, lab.id);
    // Equipos del esquema.
    const delEsquema = new Set(lab.esquema.equipos.map((equipo) => equipo[0]));
    // Sin repetidos.
    assert.equal(delEsquema.size, lab.esquema.equipos.length, lab.id);
    // Iconos conocidos.
    for (const equipo of lab.esquema.equipos) {
      // Icono.
      assert.ok(["router", "switch", "mls", "pc", "servidor", "nube"].includes(equipo[1]), `${lab.id}: ${equipo[0]}`);
    }
    // Los enlaces unen equipos del esquema.
    for (const enlace of lab.esquema.enlaces) {
      // Los dos extremos existen.
      assert.ok(delEsquema.has(enlace[0]) && delEsquema.has(enlace[2]), `${lab.id}: ${enlace.join(" ")}`);
    }
    // Los equipos con consola salen en el esquema.
    for (const equipo of Object.keys(lab.equipos)) {
      // Existe.
      assert.ok(delEsquema.has(equipo), `${lab.id}: ${equipo}`);
    }
    // Filas de la tabla de direcciones con 5 datos.
    for (const fila of lab.direcciones) {
      // Cinco.
      assert.equal(fila.length, 5, lab.id);
    }
    // El primer comando dice en qué equipo se hace.
    assert.ok(lab.pasos.find((paso) => paso.c !== undefined).e, lab.id);
  }
});

// Cada paso está completo y cada comando se acepta a sí mismo (y sus alternativas) en su tipo de consola.
test("laboratorios: pasos, preguntas y comandos", () => {
  // Recorremos los laboratorios.
  for (const lab of LABORATORIOS) {
    // Equipo actual.
    let equipo = null;
    // Recorremos los pasos.
    for (const paso of lab.pasos) {
      // Título de parte.
      if (paso.parte) {
        // En los dos idiomas.
        assert.ok(esPareja(paso.parte), lab.id);
        // Siguiente.
        continue;
      }
      // Pregunta.
      if (paso.q) {
        // Texto, tres opciones y la correcta dentro.
        assert.ok(esPareja(paso.q) && paso.o.length === 3 && paso.ok >= 0 && paso.ok < 3, `${lab.id}: ${paso.q[0]}`);
        // Cada opción es un texto o una pareja.
        assert.ok(paso.o.every((opcion) => typeof opcion === "string" || esPareja(opcion)), `${lab.id}: ${paso.q[0]}`);
        // Explicación en los dos idiomas (si la hay).
        assert.ok(!paso.x || esPareja(paso.x), `${lab.id}: ${paso.q[0]}`);
        // Siguiente.
        continue;
      }
      // Equipo del paso.
      equipo = paso.e || equipo;
      // Existe en el laboratorio.
      assert.ok(lab.equipos[equipo], `${lab.id}: equipo ${equipo}`);
      // Tipo de consola.
      const tipo = lab.equipos[equipo].tipo;
      // Tarea en los dos idiomas.
      assert.ok(esPareja(paso.t), `${lab.id}: ${paso.c}`);
      // Explicación en los dos idiomas (si la hay).
      assert.ok(!paso.x || esPareja(paso.x), `${lab.id}: ${paso.c}`);
      // El comando y sus alternativas se aceptan.
      for (const comando of [paso.c, ...(paso.alt || [])]) {
        // Se acepta.
        assert.ok(Consola.comparar(comando, paso.c, paso.alt || [], tipo).ok, `${lab.id}: ${comando}`);
      }
      // Las preguntas del equipo tienen texto y respuesta.
      for (const pregunta of paso.conf ? [].concat(paso.conf) : []) {
        // Texto y respuesta (la respuesta puede ser "" para Intro).
        assert.ok(pregunta.p && typeof pregunta.c === "string", `${lab.id}: ${paso.c}`);
      }
    }
  }
});

// Cada comando de Cisco se escribe en el modo del IOS que le corresponde.
test("laboratorios: cada comando de Cisco va en su modo", () => {
  // Comandos que abren un submodo: se pueden escribir desde cualquier modo de configuración.
  const ABREN = /^(interface|vlan \d|line |router |ip dhcp pool |ip access-list )/;
  // Comandos válidos en cada modo.
  const VALIDOS = {
    user: /^(enable|show |ping |traceroute |ssh |telnet )/,
    priv: /^(show |copy |write|disable|configure terminal|ping |traceroute |reload|clock )/,
    config: /^(hostname |enable secret |no ip (domain-lookup|http server|dhcp snooping information option)$|no cdp run$|service |banner |ip (route|default-gateway|domain-name|nat inside source|routing|ssh|dhcp excluded-address|dhcp snooping|arp inspection vlan)\b|username |crypto key |access-list |spanning-tree vlan |security passwords |login block-for |aaa |end$|exit$|do )/,
    "config-if": /^(description |ip (address|nat (inside|outside)$|access-group|helper-address|dhcp snooping (trust|limit rate)|arp inspection trust)|no (shutdown|switchport)$|shutdown$|switchport |encapsulation |clock rate |channel-group |spanning-tree (portfast|bpduguard)|end$|exit$|do )/,
    "config-vlan": /^(name |end$|exit$)/,
    "config-line": /^(password |login|transport input |access-class |exec-timeout |logging synchronous|end$|exit$)/,
    "config-router": /^(router-id |network |passive-interface |default-information |end$|exit$)/,
    "dhcp-config": /^(network |default-router |dns-server |domain-name |end$|exit$)/,
    "config-ext-nacl": /^(permit |deny |remark |end$|exit$)/,
  };
  // Los de subinterfaz y rango, como los de interfaz.
  VALIDOS["config-subif"] = VALIDOS["config-if"];
  // Rango.
  VALIDOS["config-if-range"] = VALIDOS["config-if"];
  // Problemas encontrados.
  const problemas = [];
  // Recorremos los laboratorios.
  for (const lab of LABORATORIOS) {
    // Estado de cada equipo.
    const estados = Object.fromEntries(Object.entries(lab.equipos).map(([nombre, equipo]) => [nombre, Consola.estadoInicial(equipo)]));
    // Equipo actual.
    let equipo = null;
    // Recorremos los comandos.
    for (const paso of lab.pasos.filter((otro) => otro.c !== undefined)) {
      // Equipo del paso.
      equipo = paso.e || equipo;
      // Estado.
      const estado = estados[equipo];
      // Solo los de Cisco.
      if (estado.tipo !== "cisco") {
        // Siguiente.
        continue;
      }
      // ¿Vale en este modo? (Los que abren submodo valen en cualquier modo de configuración).
      const vale = VALIDOS[estado.modo].test(paso.c) || (estado.modo.startsWith("config") || estado.modo === "dhcp-config" ? ABREN.test(paso.c) : false);
      // Si no, se anota.
      if (!vale) {
        // Problema.
        problemas.push(`${lab.id}: «${paso.c}» en ${Consola.prompt(estado)}`);
      }
      // Aplicamos el comando.
      estados[equipo] = Consola.avanzar(estado, paso.c).estado;
    }
  }
  // Ninguno.
  assert.deepEqual(problemas, []);
});

// --- Comandos sueltos ---

// Cada comando tiene su tema, su nivel, sus explicaciones y dos versiones con error.
test("comandos de redes: formato", () => {
  // Temas.
  const temas = ["basico", "switching", "routing", "servicios", "seguridad", "linux"];
  // Números distintos.
  assert.equal(new Set(COMANDOS_RED.map((entrada) => entrada[0])).size, COMANDOS_RED.length);
  // Comandos distintos.
  assert.equal(new Set(COMANDOS_RED.map((entrada) => entrada[2])).size, COMANDOS_RED.length);
  // Cada entrada.
  for (const [numero, tema, comando, es, en, errores, nivel] of COMANDOS_RED) {
    // Tema, nivel y textos.
    assert.ok(temas.includes(tema) && [1, 2, 3].includes(nivel) && comando && es && en, `número ${numero}`);
    // El tema tiene nombre.
    assert.ok(`redes.tema.${tema}` in TEXTOS.es, tema);
    // Dos errores distintos de la correcta, con su explicación.
    assert.equal(errores.length, 2, `número ${numero}`);
    // Cada error.
    for (const [mal, porqueEs, porqueEn] of errores) {
      // Distinto y explicado.
      assert.ok(mal !== comando && porqueEs && porqueEn, `número ${numero}`);
    }
  }
  // Cada nivel tiene unos cuantos.
  for (const nivel of [1, 2, 3]) {
    // Al menos 12.
    assert.ok(COMANDOS_RED.filter((entrada) => entrada[6] === nivel).length >= 12, `nivel ${nivel}`);
  }
});

// Los modos y la sección tienen sus textos.
test("redes: textos de la sección y de los modos", () => {
  // Modos de comandos.
  for (const id of ["redes-escribir", "redes-errores", "redes-usos"]) {
    // Los tres textos.
    for (const parte of ["nombre", "direccion", "detalle"]) {
      // Existe.
      assert.ok(`modo.${id}.${parte}` in TEXTOS.es, `modo.${id}.${parte}`);
    }
  }
  // Sección, niveles, tipos de equipo y formas de hacerlo.
  for (const clave of ["seccion.redes", "redes.nivel.facil", "redes.nivel.medio", "redes.nivel.dificil", "lab.tipo.cisco", "lab.tipo.linux", "lab.tipo.pc", "lab.ayuda.guiado", "lab.ayuda.plantilla", "lab.ayuda.examen"]) {
    // Existe.
    assert.ok(clave in TEXTOS.es, clave);
  }
  // Cada tipo de error de la consola tiene su explicación.
  for (const error of ["vacio", "otro", "invalido", "incompleto", "ambiguo", "desconocido"]) {
    // Existe.
    assert.ok(`lab.error.${error}` in TEXTOS.es, error);
  }
});
