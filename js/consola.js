// consola.js: la lógica de la consola de los laboratorios de redes.
// Imita tres tipos de consola:
//   cisco: la línea de comandos de un router o switch Cisco (IOS), como en Packet Tracer
//   linux: la terminal de un servidor Linux
//   pc:    el símbolo del sistema de un PC de Packet Tracer (C:\>)
// Aquí está lo que no toca la página: comparar lo escrito con el comando esperado (aceptando las
// abreviaturas de Cisco, como "conf t" o "int g0/0"), calcular el prompt según el modo (S1>, S1#,
// S1(config-if)#...), los mensajes que el equipo escribe solo, la salida del ping y la «plantilla»
// con huecos de cada comando. Así se puede probar con Node (mira tests/).
// Todo queda dentro del objeto Consola, para no llenar el espacio global (y no tapar window.prompt).

// Todo va dentro de una función que se ejecuta al momento; lo que se usa fuera se devuelve en Consola.
const Consola = (() => {
  // Tipos de interfaz de Cisco, con su nombre completo en minúscula.
  const TIPOS_DE_INTERFAZ = ["fastethernet", "gigabitethernet", "serial", "vlan", "loopback", "port-channel", "ethernet", "tunnel"];
  // Cómo escribe Cisco cada tipo en sus mensajes.
  const NOMBRE_DE_INTERFAZ = {
    fastethernet: "FastEthernet", // puertos de 100 Mb/s
    gigabitethernet: "GigabitEthernet", // puertos de 1 Gb/s
    serial: "Serial", // puertos serie (enlaces entre routers)
    vlan: "Vlan", // interfaces virtuales de VLAN
    loopback: "Loopback", // interfaces virtuales internas
    "port-channel": "Port-channel", // EtherChannel
    ethernet: "Ethernet", // Ethernet antiguo
    tunnel: "Tunnel", // túneles
  };

  // Palabras clave del IOS: se pueden abreviar (con al menos dos letras) y da igual escribirlas en mayúscula.
  // Lo que no está aquí (nombres, contraseñas, direcciones, números) se tiene que escribir exacto.
  const PALABRAS_IOS = new Set(
    [
      // Modos y básicos.
      "enable", "disable", "configure", "terminal", "exit", "end", "do", "no", "hostname", "banner", "motd", "login",
      "line", "console", "vty", "password", "secret", "service", "password-encryption", "username", "privilege",
      "exec-timeout", "logging", "synchronous", "description", "clock", "rate", "set", "reload", "erase",
      // Ver y guardar.
      "show", "running-config", "startup-config", "copy", "write", "memory", "version", "brief", "history",
      "interfaces", "interface", "status", "mac", "address-table", "cdp", "neighbors", "detail", "flash:", "protocols",
      "vlan", "trunk", "summary", "etherchannel", "spanning-tree", "port-security", "access-lists", "route", "binding",
      "translations", "statistics", "neighbor", "database", "ssh", "users", "arp", "ospf", "nat", "dhcp", "ip",
      // Interfaces y VLAN.
      "range", "name", "switchport", "mode", "access", "native", "allowed", "add", "remove", "shutdown", "address",
      "default-gateway", "encapsulation", "dot1q", "nonegotiate", "voice", "routing", "unicast-routing", "ipv6",
      "link-local", "speed", "duplex", "auto", "full", "half",
      // Enrutamiento.
      "router", "router-id", "network", "area", "passive-interface", "default-information", "originate", "rip",
      "eigrp", "auto-summary", "default-router", "dns-server", "domain-name", "domain-lookup", "excluded-address",
      "pool", "helper-address", "lease",
      // Seguridad y servicios.
      "access-list", "access-group", "access-class", "permit", "deny", "any", "host", "eq", "tcp", "udp", "icmp",
      "extended", "standard", "in", "out", "inside", "outside", "source", "list", "overload", "static", "transport",
      "input", "telnet", "crypto", "key", "generate", "rsa", "general-keys", "modulus", "maximum", "mac-address",
      "sticky", "violation", "restrict", "protect", "portfast", "bpduguard", "root", "primary", "secondary",
      "channel-group", "active", "passive", "desirable", "port-channel", "standby", "priority", "preempt", "ntp",
      "server", "www", "local", "all",
    ],
  );
  // Palabras que en el IOS se pueden abreviar con una sola letra (como "conf t").
  const SE_ABREVIA_CON_UNA = new Set(["terminal"]);
  // Palabras tras las que viene un nombre que se escribe tal cual (no se confunde con una interfaz).
  const TOMAN_NOMBRE = ["hostname", "name", "secret", "password", "username", "description", "domain-name", "pool", "extended", "standard", "motd"];

  // Palabras que se reconocen como órdenes de Linux (para no decir «command not found» si se equivoca de orden).
  const ORDENES_LINUX = new Set([
    "sudo", "apt", "systemctl", "ls", "cd", "pwd", "cat", "echo", "tee", "curl", "ip", "df", "ss", "free", "whoami",
    "hostname", "hostnamectl", "tail", "head", "grep", "sed", "nano", "vim", "mkdir", "rm", "cp", "mv", "chmod",
    "chown", "useradd", "usermod", "userdel", "adduser", "passwd", "groups", "id", "ufw", "nginx", "ping", "exit",
    "su", "journalctl", "uptime", "top", "ps", "kill", "man", "less", "touch", "find", "wget", "tar", "date",
  ]);
  // Palabras de Linux que van detrás de una orden y forman parte del comando (el resto son argumentos: nombres, rutas, IP...).
  const PALABRAS_LINUX = new Set([
    "update", "upgrade", "install", "remove", "enable", "disable", "start", "stop", "restart", "reload", "status",
    "allow", "deny", "default", "incoming", "outgoing", "addr", "route", "link", "show", "verbose", "numbered",
  ]);
  // Órdenes que entiende el símbolo del sistema de un PC de Packet Tracer.
  const ORDENES_PC = new Set(["ping", "ipconfig", "tracert", "arp", "ssh", "telnet", "netstat", "nslookup", "exit"]);

  // Ayuda del IOS al escribir "?": lo que se puede escribir en cada modo (resumida, como la de Packet Tracer).
  const AYUDA_IOS = {
    user: [["enable", "Turn on privileged commands"], ["exit", "Exit from the EXEC"], ["ping", "Send echo messages"], ["show", "Show running system information"], ["ssh", "Open a secure shell client connection"], ["telnet", "Open a telnet connection"], ["traceroute", "Trace route to destination"]],
    priv: [["clock", "Manage the system clock"], ["configure", "Enter configuration mode"], ["copy", "Copy from one file to another"], ["disable", "Turn off privileged commands"], ["erase", "Erase a filesystem"], ["exit", "Exit from the EXEC"], ["ping", "Send echo messages"], ["reload", "Halt and perform a cold restart"], ["show", "Show running system information"], ["ssh", "Open a secure shell client connection"], ["traceroute", "Trace route to destination"], ["write", "Write running configuration to memory"]],
    config: [["access-list", "Add an access list entry"], ["banner", "Define a login banner"], ["do", "To run exec commands in config mode"], ["enable", "Modify enable password parameters"], ["end", "Exit from configure mode"], ["exit", "Exit from configure mode"], ["hostname", "Set system's network name"], ["interface", "Select an interface to configure"], ["ip", "Global IP configuration subcommands"], ["line", "Configure a terminal line"], ["no", "Negate a command or set its defaults"], ["router", "Enable a routing process"], ["service", "Modify use of network based services"], ["spanning-tree", "Spanning Tree Subsystem"], ["username", "Establish User Name Authentication"], ["vlan", "Vlan commands"]],
    "config-if": [["channel-group", "Etherchannel/port bundling configuration"], ["description", "Interface specific description"], ["do", "To run exec commands in config mode"], ["duplex", "Configure duplex operation"], ["encapsulation", "Set encapsulation type for an interface"], ["exit", "Exit from interface configuration mode"], ["ip", "Interface Internet Protocol config commands"], ["no", "Negate a command or set its defaults"], ["shutdown", "Shutdown the selected interface"], ["spanning-tree", "Spanning Tree Subsystem"], ["switchport", "Set switching mode characteristics"]],
    "config-vlan": [["exit", "Apply changes, bump revision number, and exit mode"], ["name", "Ascii name of the VLAN"], ["no", "Negate a command or set its defaults"]],
    "config-line": [["access-class", "Filter connections based on an IP access list"], ["exec-timeout", "Set the EXEC timeout"], ["exit", "Exit from line configuration mode"], ["logging", "Modify message logging facilities"], ["login", "Enable password checking"], ["password", "Set a password"], ["transport", "Define transport protocols for line"]],
    "config-router": [["default-information", "Control distribution of default information"], ["exit", "Exit from routing protocol configuration mode"], ["network", "Enable routing on an IP network"], ["passive-interface", "Suppress routing updates on an interface"], ["router-id", "router-id for this OSPF process"]],
    "dhcp-config": [["default-router", "Default routers"], ["dns-server", "Set name server"], ["domain-name", "Domain name"], ["exit", "Exit from DHCP pool configuration mode"], ["network", "Network number and mask"]],
    "config-ext-nacl": [["deny", "Specify packets to reject"], ["exit", "Exit from access-list configuration mode"], ["permit", "Specify packets to forward"], ["remark", "Access list entry comment"]],
  };
  // Los modos de subinterfaz y de rango de interfaces usan la ayuda de interfaz; el de ACL estándar, la de ACL.
  AYUDA_IOS["config-subif"] = AYUDA_IOS["config-if"];
  // Rango de interfaces.
  AYUDA_IOS["config-if-range"] = AYUDA_IOS["config-if"];
  // ACL estándar.
  AYUDA_IOS["config-std-nacl"] = AYUDA_IOS["config-ext-nacl"];

  // Parte un texto en palabras y recuerda dónde empieza cada una (para señalar errores con ^).
  function trocear(texto) {
    // Palabras encontradas.
    const palabras = [];
    // Busca grupos de caracteres que no son espacios.
    const patron = /\S+/g;
    // Coincidencia actual.
    let encontrada;
    // Recorremos el texto.
    while ((encontrada = patron.exec(texto)) !== null) {
      // Guardamos la palabra y su posición.
      palabras.push({ texto: encontrada[0], inicio: encontrada.index });
    }
    // Devolvemos la lista.
    return palabras;
  }

  // Tipo de interfaz que empieza por unas letras ("fa" -> "fastethernet"); null si no hay o hay varios.
  function tipoDeInterfaz(letras) {
    // Minúsculas.
    const minusculas = letras.toLowerCase();
    // Tipos que empiezan así.
    const posibles = TIPOS_DE_INTERFAZ.filter((tipo) => tipo.startsWith(minusculas));
    // Solo si hay uno.
    return posibles.length === 1 ? posibles[0] : null;
  }

  // ¿Una palabra escrita es el principio de alguna de una lista? (Con al menos dos letras).
  function abreviaDe(palabra, lista) {
    // Minúsculas.
    const minusculas = palabra.toLowerCase();
    // Basta con una.
    return minusculas.length >= 2 && lista.some((completa) => completa.startsWith(minusculas));
  }

  // Prepara un comando de Cisco para compararlo: junta y escribe igual los nombres de interfaz
  // ("fa0/1", "f 0/1" y "FastEthernet0/1" pasan a ser "fastethernet0/1") y los rangos ("fa0/1 - 10").
  // Devuelve la lista de palabras con su posición en el texto original.
  function normalizarIOS(texto) {
    // Palabras del texto.
    const palabras = trocear(texto);
    // Palabras ya preparadas.
    const resultado = [];
    // Recorremos las palabras.
    for (let i = 0; i < palabras.length; i++) {
      // Palabra actual.
      const palabra = palabras[i];
      // Palabra anterior (ya preparada).
      const anterior = resultado.length > 0 ? resultado[resultado.length - 1].texto : "";
      // Si la anterior pide un nombre (hostname S1), la palabra va tal cual.
      if (anterior && abreviaDe(anterior, TOMAN_NOMBRE)) {
        // Tal cual.
        resultado.push(palabra);
        // Siguiente.
        continue;
      }
      // ¿Letras seguidas de números? ("fa0/1", "g0/0.10", "vlan10").
      const pegada = palabra.texto.match(/^([a-z][a-z-]*)(\d[\d/.]*)$/i);
      // Tipo de interfaz de esas letras.
      const tipoPegada = pegada ? tipoDeInterfaz(pegada[1]) : null;
      // Si es una interfaz escrita junta...
      if (tipoPegada) {
        // ...la escribimos completa y en minúscula.
        resultado.push({ texto: tipoPegada + pegada[2], inicio: palabra.inicio });
        // Siguiente.
        continue;
      }
      // ¿Letras solas seguidas de una palabra que es un número? ("fastethernet 0/1", "vlan 10").
      const siguiente = palabras[i + 1];
      // Tipo de interfaz de esas letras.
      const tipoSuelta = /^[a-z][a-z-]*$/i.test(palabra.texto) && siguiente && /^\d[\d/.]*$/.test(siguiente.texto) ? tipoDeInterfaz(palabra.texto) : null;
      // Si es una interfaz escrita separada...
      if (tipoSuelta) {
        // ...la juntamos.
        resultado.push({ texto: tipoSuelta + siguiente.texto, inicio: palabra.inicio });
        // Nos saltamos el número, que ya va dentro.
        i++;
        // Siguiente.
        continue;
      }
      // Cualquier otra palabra, tal cual.
      resultado.push(palabra);
    }
    // En "interface range", lo que va detrás se junta sin espacios ("fastethernet0/1 - 10" -> "fastethernet0/1-10").
    if (resultado.length > 2 && abreviaDe(resultado[0].texto, ["interface"]) && abreviaDe(resultado[1].texto, ["range"])) {
      // Juntamos el rango en una sola palabra, con los tipos de interfaz completos ("f0/1-10" -> "fastethernet0/1-10").
      const texto = resultado
        // Las palabras del rango...
        .slice(2)
        // ...sin espacios...
        .map((palabra) => palabra.texto)
        // ...juntas...
        .join("")
        // ...y con cada tipo de interfaz escrito entero.
        .replace(/[a-z][a-z-]*(?=\d)/gi, (letras) => tipoDeInterfaz(letras) || letras.toLowerCase());
      // El rango como una palabra.
      const rango = { texto, inicio: resultado[2].inicio };
      // Las dos primeras y el rango.
      return [resultado[0], resultado[1], rango];
    }
    // Devolvemos las palabras.
    return resultado;
  }

  // ¿Es una palabra escrita (quizá abreviada) una palabra clave del IOS?
  function esPalabraIOS(palabra) {
    // Minúsculas.
    const minusculas = palabra.toLowerCase();
    // Exacta, o el principio (con dos letras o más) de alguna.
    return PALABRAS_IOS.has(minusculas) || (minusculas.length >= 2 && [...PALABRAS_IOS].some((clave) => clave.startsWith(minusculas)));
  }

  // ¿Coincide una palabra escrita con la esperada? Las palabras clave se pueden abreviar; el resto, exacto.
  function coincidePalabraIOS(escrita, esperada) {
    // Esperada en minúscula.
    const clave = esperada.toLowerCase();
    // Escrita en minúscula.
    const minusculas = escrita.toLowerCase();
    // Si la esperada es palabra clave...
    if (PALABRAS_IOS.has(clave)) {
      // ...vale entera o abreviada (dos letras como mínimo, salvo "t" de terminal).
      return minusculas === clave || (clave.startsWith(minusculas) && (minusculas.length >= 2 || SE_ABREVIA_CON_UNA.has(clave)));
    }
    // Si no, tiene que ser exacta (los nombres de interfaz ya vienen en minúscula de normalizarIOS).
    return escrita === esperada;
  }

  // Compara un comando de Cisco escrito con el esperado.
  // Devuelve { ok: true } o { ok: false, error, posicion, palabra, acertadas }:
  //   error:     "vacio", "otro" (es un comando, pero no el pedido), "invalido", "incompleto" o "ambiguo"
  //   posicion:  dónde está el fallo en lo escrito (para la marca ^)
  //   palabra:   la palabra escrita que falla
  //   acertadas: cuántas palabras estaban bien antes del fallo
  function compararIOS(escrito, esperado) {
    // Palabras escritas.
    const escritas = normalizarIOS(escrito);
    // Palabras esperadas.
    const esperadas = normalizarIOS(esperado);
    // Sin nada escrito.
    if (escritas.length === 0) {
      // Vacío (o correcto si se esperaba solo Intro).
      return esperadas.length === 0 ? { ok: true } : { ok: false, error: "vacio", posicion: 0, palabra: "", acertadas: 0 };
    }
    // Recorremos las palabras.
    for (let i = 0; i < Math.max(escritas.length, esperadas.length); i++) {
      // Si se acabó lo escrito antes que lo esperado, falta algo.
      if (i >= escritas.length) {
        // Comando incompleto.
        return { ok: false, error: "incompleto", posicion: escrito.length, palabra: "", acertadas: i };
      }
      // Si sobra algo, es inválido desde ahí.
      if (i >= esperadas.length) {
        // Inválido.
        return { ok: false, error: "invalido", posicion: escritas[i].inicio, palabra: escritas[i].texto, acertadas: i };
      }
      // Si esta palabra no coincide...
      if (!coincidePalabraIOS(escritas[i].texto, esperadas[i].texto)) {
        // Palabra escrita.
        const palabra = escritas[i].texto;
        // Una sola letra que es el principio de la esperada: ambiguo (como en el IOS).
        if (palabra.length === 1 && esperadas[i].texto.toLowerCase().startsWith(palabra.toLowerCase())) {
          // Ambiguo.
          return { ok: false, error: "ambiguo", posicion: escritas[i].inicio, palabra, acertadas: i };
        }
        // La primera palabra es un comando que existe: es otro comando, no el pedido.
        if (i === 0 && esPalabraIOS(palabra)) {
          // Otro comando.
          return { ok: false, error: "otro", posicion: 0, palabra, acertadas: 0 };
        }
        // Si no, inválido en esa palabra.
        return { ok: false, error: "invalido", posicion: escritas[i].inicio, palabra, acertadas: i };
      }
    }
    // Todas coinciden.
    return { ok: true };
  }

  // Compara un comando de Linux (o del PC): palabra por palabra, exacto (en el PC da igual la mayúscula).
  //   tipo: "linux" o "pc"
  function compararExacto(escrito, esperado, tipo) {
    // En el PC da igual la mayúscula.
    const preparar = (texto) => (tipo === "pc" ? texto.toLowerCase() : texto);
    // Palabras escritas.
    const escritas = trocear(escrito);
    // Palabras esperadas.
    const esperadas = trocear(esperado);
    // Sin nada escrito.
    if (escritas.length === 0) {
      // Vacío (o correcto si se esperaba solo Intro).
      return esperadas.length === 0 ? { ok: true } : { ok: false, error: "vacio", posicion: 0, palabra: "", acertadas: 0 };
    }
    // Órdenes conocidas de este tipo.
    const ordenes = tipo === "pc" ? ORDENES_PC : ORDENES_LINUX;
    // Recorremos las palabras.
    for (let i = 0; i < Math.max(escritas.length, esperadas.length); i++) {
      // Falta algo.
      if (i >= escritas.length) {
        // Incompleto.
        return { ok: false, error: "incompleto", posicion: escrito.length, palabra: "", acertadas: i };
      }
      // Sobra algo.
      if (i >= esperadas.length) {
        // Inválido.
        return { ok: false, error: "invalido", posicion: escritas[i].inicio, palabra: escritas[i].texto, acertadas: i };
      }
      // Si esta palabra no coincide...
      if (preparar(escritas[i].texto) !== preparar(esperadas[i].texto)) {
        // Palabra escrita.
        const palabra = escritas[i].texto;
        // Primera palabra: orden desconocida u otra orden.
        if (i === 0) {
          // Si se conoce, es otro comando; si no, no existe.
          return { ok: false, error: ordenes.has(preparar(palabra)) ? "otro" : "desconocido", posicion: 0, palabra, acertadas: 0 };
        }
        // Si no, inválido en esa palabra.
        return { ok: false, error: "invalido", posicion: escritas[i].inicio, palabra, acertadas: i };
      }
    }
    // Todas coinciden.
    return { ok: true };
  }

  // Compara lo escrito con un comando y sus alternativas. Devuelve el resultado de la mejor:
  // { ok: true, comando } con el comando que coincidió, o el error del intento que más se acercó.
  //   tipo: "cisco", "linux" o "pc"
  function comparar(escrito, comando, alternativas = [], tipo = "cisco") {
    // Mejor error encontrado.
    let mejor = null;
    // Probamos el comando y cada alternativa.
    for (const candidato of [comando, ...alternativas]) {
      // Resultado de este.
      const resultado = tipo === "cisco" ? compararIOS(escrito, candidato) : compararExacto(escrito, candidato, tipo);
      // Si coincide, listo.
      if (resultado.ok) {
        // Devolvemos cuál coincidió.
        return { ok: true, comando: candidato };
      }
      // Nos quedamos con el error que llegó más lejos.
      if (!mejor || resultado.acertadas > mejor.acertadas) {
        // Mejor error.
        mejor = resultado;
      }
    }
    // Devolvemos el mejor error.
    return mejor;
  }

  // Escribe el nombre de una interfaz como lo hace Cisco en sus mensajes: "g0/0.10" -> "GigabitEthernet0/0.10".
  function nombreDeInterfaz(texto) {
    // Preparamos el nombre (junto y completo).
    const palabras = normalizarIOS(texto);
    // Primera palabra.
    const palabra = palabras.length > 0 ? palabras[0].texto : texto;
    // Tipo y número.
    const partes = palabra.match(/^([a-z-]+)(.*)$/i);
    // Si no se reconoce, tal cual.
    if (!partes || !NOMBRE_DE_INTERFAZ[partes[1].toLowerCase()]) {
      // Tal cual.
      return texto;
    }
    // Nombre bonito y número.
    return NOMBRE_DE_INTERFAZ[partes[1].toLowerCase()] + partes[2];
  }

  // Estado inicial de la consola de un equipo.
  //   equipo: { tipo: "cisco" | "linux" | "pc", nombre (cisco), modo (cisco, por defecto "user"), usuario y host (linux) }
  function estadoInicial(equipo) {
    // Según el tipo.
    if (equipo.tipo === "cisco") {
      // Nombre y modo.
      return { tipo: "cisco", nombre: equipo.nombre || "Switch", modo: equipo.modo || "user", interfaz: null };
    }
    // Linux: usuario, nombre del servidor y carpeta.
    if (equipo.tipo === "linux") {
      // Empieza en la carpeta personal.
      return { tipo: "linux", usuario: equipo.usuario || "admin", host: equipo.host || "servidor", dir: "~", root: false };
    }
    // PC de Packet Tracer.
    return { tipo: "pc" };
  }

  // Prompt de un estado: "S1>", "S1#", "S1(config-if)#", "admin@web01:~$" o "C:\>".
  function prompt(estado) {
    // Cisco.
    if (estado.tipo === "cisco") {
      // Modo usuario, privilegiado o de configuración.
      return estado.modo === "user" ? `${estado.nombre}>` : estado.modo === "priv" ? `${estado.nombre}#` : `${estado.nombre}(${estado.modo})#`;
    }
    // Linux.
    if (estado.tipo === "linux") {
      // root termina en # y el resto en $.
      return `${estado.root ? "root" : estado.usuario}@${estado.host}:${estado.dir}${estado.root ? "#" : "$"}`;
    }
    // PC.
    return "C:\\>";
  }

  // Mensaje del IOS al salir del modo de configuración.
  const MENSAJE_CONFIGURADO = "%SYS-5-CONFIG_I: Configured from console by console";

  // Aplica un comando (ya aceptado) a un estado de Cisco: cambia el modo, el nombre o la interfaz.
  // Devuelve { estado, mensajes } con el estado nuevo y lo que el equipo escribe solo.
  function avanzarIOS(anterior, comando) {
    // Copia del estado.
    const estado = { ...anterior };
    // Mensajes del equipo.
    const mensajes = [];
    // Comando en minúscula y sin espacios de más.
    const texto = comando.trim().replace(/\s+/g, " ");
    // Minúsculas.
    const minusculas = texto.toLowerCase();
    // Palabras.
    const palabras = texto.split(" ");
    // Modo EXEC de usuario.
    if (estado.modo === "user") {
      // enable pasa al privilegiado.
      if (minusculas === "enable") {
        // Privilegiado.
        estado.modo = "priv";
      }
      // Devolvemos.
      return { estado, mensajes };
    }
    // Modo EXEC privilegiado.
    if (estado.modo === "priv") {
      // configure terminal pasa a configuración global.
      if (minusculas === "configure terminal") {
        // Configuración global.
        estado.modo = "config";
        // Mensaje del IOS.
        mensajes.push("Enter configuration commands, one per line.  End with CNTL/Z.");
        // disable vuelve al modo de usuario.
      } else if (minusculas === "disable") {
        // Usuario.
        estado.modo = "user";
      }
      // Devolvemos.
      return { estado, mensajes };
    }
    // Modos de configuración: "do" ejecuta un comando de EXEC sin moverse.
    if (minusculas.startsWith("do ")) {
      // Sin cambios.
      return { estado, mensajes };
    }
    // end: directo al privilegiado.
    if (minusculas === "end") {
      // Privilegiado.
      estado.modo = "priv";
      // Sin interfaz.
      estado.interfaz = null;
      // Mensaje del IOS.
      mensajes.push(MENSAJE_CONFIGURADO);
      // Devolvemos.
      return { estado, mensajes };
    }
    // exit: sube un nivel.
    if (minusculas === "exit") {
      // Desde la configuración global, al privilegiado.
      if (estado.modo === "config") {
        // Privilegiado.
        estado.modo = "priv";
        // Mensaje del IOS.
        mensajes.push(MENSAJE_CONFIGURADO);
        // Desde un submodo, a la configuración global.
      } else {
        // Configuración global.
        estado.modo = "config";
      }
      // Sin interfaz.
      estado.interfaz = null;
      // Devolvemos.
      return { estado, mensajes };
    }
    // hostname: cambia el nombre (y el prompt al momento).
    if (palabras[0].toLowerCase() === "hostname" && palabras[1]) {
      // Nombre nuevo.
      estado.nombre = palabras[1];
      // Devolvemos.
      return { estado, mensajes };
    }
    // interface range: varias interfaces a la vez.
    if (minusculas.startsWith("interface range ")) {
      // Modo de rango.
      estado.modo = "config-if-range";
      // Sin una interfaz concreta.
      estado.interfaz = null;
      // Devolvemos.
      return { estado, mensajes };
    }
    // interface: una interfaz (o subinterfaz, si lleva punto).
    if (minusculas.startsWith("interface ")) {
      // Nombre de la interfaz.
      estado.interfaz = nombreDeInterfaz(texto.slice("interface ".length));
      // Subinterfaz (g0/0.10) o interfaz.
      estado.modo = /\.\d+$/.test(estado.interfaz) ? "config-subif" : "config-if";
      // Devolvemos.
      return { estado, mensajes };
    }
    // Submodos que se abren desde la configuración: VLAN, líneas, routers, DHCP y ACL con nombre.
    const submodos = [
      [/^vlan [\d,-]+$/, "config-vlan"], // vlan 10
      [/^line /, "config-line"], // line console 0, line vty 0 15
      [/^router /, "config-router"], // router ospf 1
      [/^ip dhcp pool /, "dhcp-config"], // ip dhcp pool VENTAS
      [/^ip access-list extended /, "config-ext-nacl"], // ip access-list extended NOMBRE
      [/^ip access-list standard /, "config-std-nacl"], // ip access-list standard NOMBRE
    ];
    // Buscamos si el comando abre un submodo.
    for (const [patron, modo] of submodos) {
      // Si coincide...
      if (patron.test(minusculas)) {
        // ...entramos en él.
        estado.modo = modo;
        // Sin interfaz.
        estado.interfaz = null;
        // Devolvemos.
        return { estado, mensajes };
      }
    }
    // no shutdown en una interfaz: se enciende (el IOS lo avisa).
    if (minusculas === "no shutdown" && estado.interfaz) {
      // Aviso de que el enlace se enciende.
      mensajes.push("", `%LINK-5-CHANGED: Interface ${estado.interfaz}, changed state to up`);
      // En las interfaces físicas y de VLAN, también el protocolo de línea.
      mensajes.push("", `%LINEPROTO-5-UPDOWN: Line protocol on Interface ${estado.interfaz}, changed state to up`);
    }
    // shutdown en una interfaz: se apaga.
    if (minusculas === "shutdown" && estado.interfaz) {
      // Aviso de que el enlace se apaga.
      mensajes.push("", `%LINK-5-CHANGED: Interface ${estado.interfaz}, changed state to administratively down`);
    }
    // Devolvemos.
    return { estado, mensajes };
  }

  // Aplica un comando (ya aceptado) a un estado de Linux: cd cambia la carpeta y sudo -i pasa a root.
  function avanzarLinux(anterior, comando) {
    // Copia del estado.
    const estado = { ...anterior };
    // Palabras.
    const palabras = comando.trim().split(/\s+/);
    // cd: cambia de carpeta.
    if (palabras[0] === "cd") {
      // Destino (sin destino, la carpeta personal).
      const destino = palabras[1] || "~";
      // A la carpeta personal.
      if (destino === "~" || destino === `/home/${estado.usuario}`) {
        // ~.
        estado.dir = "~";
        // Ruta absoluta.
      } else if (destino.startsWith("/")) {
        // Tal cual (sin barra final).
        estado.dir = destino.length > 1 ? destino.replace(/\/$/, "") : "/";
        // Subir un nivel.
      } else if (destino === "..") {
        // Carpeta padre.
        estado.dir = estado.dir === "~" ? "/home" : estado.dir.replace(/\/[^/]+$/, "") || "/";
        // Ruta relativa.
      } else {
        // Se añade a la actual.
        estado.dir = `${estado.dir === "/" ? "" : estado.dir}/${destino.replace(/\/$/, "")}`;
      }
    }
    // sudo -i o sudo su: pasa a root (en su carpeta).
    if (comando.trim() === "sudo -i" || comando.trim() === "sudo su") {
      // root.
      estado.root = true;
      // Carpeta de root.
      estado.dir = "~";
    }
    // exit siendo root: vuelve al usuario.
    if (comando.trim() === "exit" && estado.root) {
      // Usuario normal.
      estado.root = false;
      // Su carpeta.
      estado.dir = "~";
    }
    // Devolvemos (Linux no escribe nada solo).
    return { estado, mensajes: [] };
  }

  // Aplica un comando aceptado a cualquier estado.
  function avanzar(estado, comando) {
    // Según el tipo de consola.
    if (estado.tipo === "cisco") {
      // Cisco.
      return avanzarIOS(estado, comando);
    }
    // Linux.
    if (estado.tipo === "linux") {
      // Linux.
      return avanzarLinux(estado, comando);
    }
    // El PC no cambia.
    return { estado: { ...estado }, mensajes: [] };
  }

  // Salida de un ping desde un PC de Packet Tracer.
  //   ip:       destino
  //   ttl:      TTL de las respuestas (128 un PC, 255 un switch o router; baja 1 por cada router)
  //   perdidos: paquetes perdidos al principio (el primero se pierde a veces mientras se resuelve ARP)
  function salidaPing(ip, ttl = 128, perdidos = 0) {
    // Cabecera.
    const lineas = ["", `Pinging ${ip} with 32 bytes of data:`, ""];
    // Cuatro paquetes.
    for (let i = 0; i < 4; i++) {
      // Perdido o respondido.
      lineas.push(i < perdidos ? "Request timed out." : `Reply from ${ip}: bytes=32 time<1ms TTL=${ttl}`);
    }
    // Recibidos.
    const recibidos = 4 - perdidos;
    // Resumen.
    lineas.push("", `Ping statistics for ${ip}:`, `    Packets: Sent = 4, Received = ${recibidos}, Lost = ${perdidos} (${perdidos * 25}% loss),`);
    // Tiempos (solo si llegó alguno).
    if (recibidos > 0) {
      // Tiempos.
      lineas.push("Approximate round trip times in milli-seconds:", "    Minimum = 0ms, Maximum = 0ms, Average = 0ms");
    }
    // Devolvemos.
    return lineas;
  }

  // ¿Es una palabra de un comando una palabra clave (que se aprende) y no un dato (nombre, IP, número)?
  //   anterior: la palabra de delante (en Linux, una orden solo es orden al principio o detrás de sudo)
  function esPalabraClave(palabra, tipo, anterior) {
    // Cisco.
    if (tipo === "cisco") {
      // Palabras clave del IOS.
      return PALABRAS_IOS.has(palabra.toLowerCase());
    }
    // Linux: la orden (al principio o tras sudo), sus subórdenes y las opciones (-y, --now).
    if (tipo === "linux") {
      // Opción.
      if (/^-/.test(palabra)) {
        // Clave.
        return true;
      }
      // Al principio o tras sudo, una orden; si no, una subórden (install, status...).
      return anterior === undefined || anterior === "sudo" ? ORDENES_LINUX.has(palabra) : PALABRAS_LINUX.has(palabra);
    }
    // PC: órdenes y opciones (/all).
    return ORDENES_PC.has(palabra.toLowerCase()) || /^[/-]/.test(palabra);
  }

  // Plantilla con huecos de un comando: se ve la primera palabra y los datos (nombres, IP, números);
  // las demás palabras clave se tapan con rayas. Si no queda ningún hueco, se tapa la primera palabra
  // dejando ver su principio. Ejemplos:
  //   "switchport mode access"          -> "switchport ____ ______"
  //   "ip address 10.0.0.1 255.0.0.0"   -> "ip _______ 10.0.0.1 255.0.0.0"
  //   "hostname S1"                     -> "ho______ S1"
  function plantilla(comando, tipo = "cisco") {
    // Palabras del comando.
    const palabras = comando.trim().split(/\s+/).filter(Boolean);
    // Sin palabras (solo Intro): nada.
    if (palabras.length === 0) {
      // Vacío.
      return "";
    }
    // Rayas del largo de una palabra.
    const rayas = (palabra) => "_".repeat(palabra.length);
    // ¿Se tapó alguna?
    let tapada = false;
    // Primera palabra tal cual; las claves siguientes, tapadas; los datos, tal cual.
    const resultado = palabras.map((palabra, posicion) => {
      // La primera se ve.
      if (posicion === 0) {
        // Tal cual.
        return palabra;
      }
      // Las claves se tapan.
      if (esPalabraClave(palabra, tipo, palabras[posicion - 1])) {
        // Anotamos.
        tapada = true;
        // Rayas.
        return rayas(palabra);
      }
      // Los datos se ven.
      return palabra;
    });
    // Si no se tapó nada, tapamos la primera menos su principio (dos letras, o una si es corta: "cd" -> "c_").
    if (!tapada) {
      // Letras que se ven.
      const visibles = palabras[0].length > 3 ? 2 : 1;
      // Principio y rayas.
      resultado[0] = palabras[0].slice(0, visibles) + "_".repeat(Math.max(1, palabras[0].length - visibles));
    }
    // Devolvemos la plantilla.
    return resultado.join(" ");
  }

  // Completa con Tab la última palabra escrita si es el principio de la palabra esperada en esa posición
  // (como el IOS). Devuelve el texto completado, o el mismo si no se puede completar.
  function completar(escrito, comando, tipo = "cisco") {
    // Palabras escritas (sin juntar interfaces: se completa lo que se ve).
    const escritas = escrito.split(" ");
    // Última palabra (la que se está escribiendo).
    const ultima = escritas[escritas.length - 1];
    // Sin nada que completar.
    if (!ultima) {
      // Igual.
      return escrito;
    }
    // Palabras del comando esperado.
    const esperadas = comando.trim().split(/\s+/);
    // Palabra esperada en esa posición.
    const esperada = esperadas[escritas.length - 1];
    // Si no hay, o no empieza igual, no se completa.
    if (!esperada || !(tipo === "linux" ? esperada.startsWith(ultima) : esperada.toLowerCase().startsWith(ultima.toLowerCase()))) {
      // Igual.
      return escrito;
    }
    // Cambiamos la última por la completa y añadimos un espacio.
    return [...escritas.slice(0, -1), esperada].join(" ") + " ";
  }

  // Líneas de ayuda del IOS para "?": si se ha empezado un comando correcto, la siguiente palabra;
  // si no, lo que se puede escribir en el modo actual.
  //   antes:   lo escrito antes del "?"
  //   comando: el comando esperado (para sugerir la siguiente palabra)
  //   modo:    modo actual del IOS
  function ayudaIOS(antes, comando, modo) {
    // Lo escrito, sin espacios en los extremos.
    const escrito = antes.trim();
    // Si hay algo escrito y es el principio correcto del comando esperado...
    if (escrito) {
      // Palabras escritas.
      const escritas = escrito.split(/\s+/);
      // Palabras esperadas.
      const esperadas = comando.trim().split(/\s+/);
      // ¿Coinciden todas las escritas?
      const coinciden = escritas.length < esperadas.length && escritas.every((palabra, i) => coincidePalabraIOS(palabra, esperadas[i]) || normalizarIOS(palabra)[0]?.texto === normalizarIOS(esperadas[i])[0]?.texto);
      // Si coinciden, sugerimos la siguiente palabra.
      if (coinciden) {
        // Siguiente palabra.
        const siguiente = esperadas[escritas.length];
        // Una línea con la palabra (si es un dato, entre < >).
        return [`  ${esPalabraClave(siguiente, "cisco") ? siguiente : `<${siguiente}>`}`];
      }
      // Si se escribió el principio de una palabra sin espacio ("sw?"), las del modo que empiezan así.
      const ultima = escritas[escritas.length - 1].toLowerCase();
      // Del modo actual.
      const delModo = (AYUDA_IOS[modo] || []).filter(([palabra]) => palabra.startsWith(ultima));
      // Si hay alguna, las listamos.
      if (escritas.length === 1 && delModo.length > 0) {
        // Solo las palabras.
        return [delModo.map(([palabra]) => palabra).join("  ")];
      }
      // Si no, el IOS no reconoce lo escrito.
      return ["% Unrecognized command"];
    }
    // Sin nada escrito: lo que se puede escribir en el modo, con su explicación.
    return (AYUDA_IOS[modo] || []).map(([palabra, explicacion]) => `  ${palabra.padEnd(18)}${explicacion}`);
  }

  // Lo que este archivo ofrece al resto del juego.
  return {
    PALABRAS_IOS, // palabras clave del IOS
    normalizarIOS, // prepara un comando de Cisco para compararlo
    compararIOS, // compara un comando de Cisco
    compararExacto, // compara un comando de Linux o del PC
    comparar, // compara con un comando y sus alternativas
    nombreDeInterfaz, // "g0/0" -> "GigabitEthernet0/0"
    estadoInicial, // estado inicial de la consola de un equipo
    prompt, // prompt de un estado
    avanzar, // aplica un comando aceptado
    salidaPing, // salida de un ping
    plantilla, // plantilla con huecos
    completar, // completa con Tab
    ayudaIOS, // ayuda con ?
    esPalabraClave, // ¿palabra clave o dato?
  };
})();

// Si este archivo se carga desde Node (en las pruebas), exportamos lo mismo.
if (typeof module !== "undefined" && module.exports) {
  // El objeto entero.
  module.exports = Consola;
}
