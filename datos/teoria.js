// teoria.js: las explicaciones «¿Cómo funciona?» de los modos y laboratorios.
// Escritas para este proyecto (licencia MIT, como el código).
// Cada tema es { titulo: [es, en], bloques: [...] } y cada bloque es uno de estos:
//   ["h", es, en]   subtítulo
//   ["p", es, en]   párrafo
//   ["ej", texto]   ejemplo (código o un caso), igual en los dos idiomas
// La clave es el nombre interno del modo («seguridad-cripto»), sin el idioma final («dictado-en» usa «dictado»),
// o el del laboratorio («lab-vlan»). Si un laboratorio no tiene la suya, usa la de su sección («redes» o «seguridad»).
window.TEORIA = {
  // ===================== CIBERSEGURIDAD =====================
  "seguridad-cripto": {
    titulo: ["Codificar, cifrar y hacer un hash", "Encoding, encrypting and hashing"],
    bloques: [
      ["p", "En este modo ves un mensaje escondido y tienes que descubrir qué dice. Arriba se indica el método (César, ROT13, Hex o Base64) y, debajo, una pista de cómo deshacerlo.", "In this mode you see a hidden message and have to find out what it says. The method (Caesar, ROT13, Hex or Base64) is shown above, and below there's a hint on how to undo it."],
      ["h", "Tres cosas que se confunden mucho", "Three things people often mix up"],
      ["p", "Codificar es escribir lo mismo de otra forma, sin secreto: cualquiera puede deshacerlo (Base64, hexadecimal). Cifrar es esconderlo con una clave: sin la clave no se puede leer (AES, y el César en versión de juguete). Un hash es una huella de un solo sentido: no se puede «descifrar», solo comparar (SHA-256, bcrypt para contraseñas).", "Encoding is writing the same thing another way, with no secret: anyone can undo it (Base64, hexadecimal). Encrypting hides it with a key: without the key you can't read it (AES, and Caesar as a toy version). A hash is a one-way fingerprint: it can't be «decrypted», only compared (SHA-256, bcrypt for passwords)."],
      ["h", "Cifrado César", "Caesar cipher"],
      ["p", "Cada letra se mueve un número fijo de posiciones en el abecedario. Con +3, la A pasa a ser D, la B pasa a ser E… y al final se da la vuelta (X → A). Para descifrar, mueve cada letra hacia atrás el mismo número. La clave es ese número.", "Each letter moves a fixed number of places in the alphabet. With +3, A becomes D, B becomes E… and it wraps around at the end (X → A). To decrypt, move each letter back by the same number. That number is the key."],
      ["ej", "Clave +3:  H O L A  →  K R O D\nDescifrar: K R O D  →  H O L A  (cada letra −3)"],
      ["p", "Solo hay 25 claves posibles, así que se rompe probándolas todas en segundos. Por eso solo sirve para aprender.", "There are only 25 possible keys, so it's broken by trying them all in seconds. That's why it's only for learning."],
      ["h", "ROT13", "ROT13"],
      ["p", "Es un César de 13. Como el abecedario inglés tiene 26 letras, aplicarlo dos veces devuelve el original: la misma operación cifra y descifra (A ↔ N, B ↔ O, C ↔ P…).", "It's a Caesar of 13. Since the English alphabet has 26 letters, applying it twice gives back the original: the same operation encrypts and decrypts (A ↔ N, B ↔ O, C ↔ P…)."],
      ["ej", "N ↔ A   O ↔ B   P ↔ C   Q ↔ D   R ↔ E   S ↔ F   T ↔ G\nU ↔ H   V ↔ I   W ↔ J   X ↔ K   Y ↔ L   Z ↔ M"],
      ["h", "Hexadecimal", "Hexadecimal"],
      ["p", "Los ordenadores guardan cada letra como un número (código ASCII). En hexadecimal (base 16) se usan las cifras 0-9 y las letras a-f. Cada pareja es una letra: 41 es la A, 42 la B… 4f la O, 50 la P… 5a la Z.", "Computers store each letter as a number (ASCII code). Hexadecimal (base 16) uses digits 0-9 and letters a-f. Each pair is one letter: 41 is A, 42 is B… 4f is O, 50 is P… 5a is Z."],
      ["ej", "41 A  42 B  43 C  44 D  45 E  46 F  47 G  48 H  49 I  4a J  4b K  4c L  4d M\n4e N  4f O  50 P  51 Q  52 R  53 S  54 T  55 U  56 V  57 W  58 X  59 Y  5a Z"],
      ["h", "Base64", "Base64"],
      ["p", "Escribe cualquier dato con 64 caracteres seguros (A-Z, a-z, 0-9, + y /). Se usa para mandar archivos por correo o meter datos en una web. Se reconoce porque suele acabar en = o ==. No esconde nada: en una terminal se deshace con base64 -d.", "It writes any data with 64 safe characters (A-Z, a-z, 0-9, + and /). It's used to send files by email or embed data in web pages. You can spot it because it often ends in = or ==. It hides nothing: in a terminal it's undone with base64 -d."],
      ["ej", "$ echo 'SGVsbG8gd29ybGQ=' | base64 -d\nHello world"],
      ["h", "En la vida real", "In real life"],
      ["p", "Si ves «Base64» o «hex» en un ataque, no es cifrado: es solo un disfraz para que los filtros no lo detecten. Las contraseñas nunca se guardan cifradas ni codificadas, sino con un hash lento (bcrypt, Argon2).", "If you see «Base64» or «hex» in an attack, it isn't encryption: it's just a disguise so filters don't catch it. Passwords are never stored encrypted or encoded, but with a slow hash (bcrypt, Argon2)."],
    ],
  },
  "seguridad-phishing": {
    titulo: ["Cómo reconocer el phishing", "How to recognize phishing"],
    bloques: [
      ["p", "El phishing es un engaño para que des tus datos, tu dinero o abras un archivo con virus. Llega por correo, SMS, WhatsApp, llamadas o páginas falsas. En este modo lees un mensaje y decides qué es: estafa, de verdad o solo publicidad.", "Phishing is a trick to get your details or money, or to make you open a file with a virus. It arrives by email, SMS, WhatsApp, calls or fake pages. In this mode you read a message and decide what it is: a scam, real, or just advertising."],
      ["h", "Las pistas más típicas", "The most common clues"],
      ["p", "Prisa o amenaza («tu cuenta se cierra hoy»). Premios que no pediste. El remitente o el enlace no son exactamente los de siempre (paypa1 con un 1, micr0soft con un 0, .co en vez de .com). Te piden contraseñas, códigos o la tarjeta. Adjuntos raros (.exe, .zip, documentos que piden «habilitar macros»). Enlaces acortados (bit.ly) que esconden adónde vas.", "Urgency or threats («your account closes today»). Prizes you never asked for. The sender or the link isn't exactly the usual one (paypa1 with a 1, micr0soft with a 0, .co instead of .com). They ask for passwords, codes or your card. Odd attachments (.exe, .zip, documents asking you to «enable macros»). Shortened links (bit.ly) that hide where you're going."],
      ["h", "Leer bien un enlace", "Reading a link properly"],
      ["p", "Lo que manda es lo que va justo antes de la primera barra /. Todo lo de delante puede ser un disfraz.", "What matters is what comes right before the first slash /. Everything in front of it can be a disguise."],
      ["ej", "http://nube-ejemplo.example.login-seguro.ru/entrar\n                               └──────────────┘\n                     el dominio de verdad: login-seguro.ru"],
      ["h", "Qué hacer", "What to do"],
      ["p", "No pulses el enlace: entra tú escribiendo la dirección o con la app de siempre. Si es alguien conocido pidiendo dinero, llámale al número de siempre. Si ya diste la contraseña, cámbiala enseguida y activa la verificación en dos pasos.", "Don't click the link: go there yourself by typing the address or using the usual app. If someone you know asks for money, call them on the usual number. If you already gave your password, change it right away and turn on two-step verification."],
    ],
  },
  "seguridad-errores": {
    titulo: ["Programar de forma segura", "Coding securely"],
    bloques: [
      ["p", "La mayoría de los ataques a webs aprovechan los mismos pocos errores. En este modo ves tres versiones de una línea y eliges la segura; al fallar, se explica qué ataque permitía la otra.", "Most attacks on websites exploit the same few mistakes. In this mode you see three versions of a line and pick the safe one; if you get it wrong, it explains which attack the other one allowed."],
      ["h", "La regla de oro: no mezclar datos con código", "The golden rule: don't mix data with code"],
      ["p", "Lo que escribe el usuario nunca se pega dentro de una consulta SQL, de un comando o de HTML. Se pasa aparte, como parámetro, para que el programa lo trate solo como texto.", "What the user types is never glued into an SQL query, a command or HTML. It's passed separately, as a parameter, so the program treats it as plain text."],
      ["ej", "MAL:  \"SELECT * FROM usuarios WHERE email = '\" + email + \"'\"\n      con email = x' OR '1'='1  →  devuelve todos los usuarios\nBIEN: execute(\"SELECT * FROM usuarios WHERE email = %s\", (email,))"],
      ["h", "Los errores que salen en el modo", "The mistakes in this mode"],
      ["p", "Inyección SQL y de comandos (pegar texto del usuario). XSS (meter HTML del usuario con innerHTML). Contraseñas guardadas tal cual o con MD5. Secretos escritos en el código. Leer archivos con rutas que manda el usuario (../../). Aceptar certificados falsos (verify=False). Cookies de sesión sin proteger.", "SQL and command injection (gluing user text). XSS (inserting user HTML with innerHTML). Passwords stored as is or with MD5. Secrets written in the code. Reading files with paths sent by the user (../../). Accepting fake certificates (verify=False). Unprotected session cookies."],
      ["p", "Si quieres saber más, busca «OWASP Top 10»: la lista de los fallos web más comunes.", "If you want to learn more, look up «OWASP Top 10»: the list of the most common web flaws."],
    ],
  },
  "seguridad-registros": {
    titulo: ["Leer registros (logs)", "Reading logs"],
    bloques: [
      ["p", "Los registros son el diario de un equipo: quién entró, qué falló, qué se pidió a la web. Saber leerlos es lo primero para detectar un ataque.", "Logs are a machine's diary: who logged in, what failed, what was requested from the website. Knowing how to read them is the first step to detecting an attack."],
      ["h", "Un registro de SSH (auth.log)", "An SSH log (auth.log)"],
      ["ej", "Nov  2 03:14:07  web01  sshd[2211]:  Failed password for root  from 203.0.113.66  port 51022\n└─ fecha y hora  └ equipo └ programa     └ qué pasó + usuario      └ IP de origen"],
      ["p", "«Failed password» es un intento fallido; «Accepted password», uno que entró; «Invalid user», un usuario que ni existe. Muchos fallos seguidos desde la misma IP son fuerza bruta.", "«Failed password» is a failed attempt; «Accepted password», one that got in; «Invalid user», a user that doesn't even exist. Many failures in a row from the same IP mean brute force."],
      ["h", "Un registro de una web (access.log)", "A web log (access.log)"],
      ["ej", "203.0.113.9 - - [02/Nov/2026:11:00:04] \"GET /productos?id=1' OR '1'='1\" 500\n└ IP           └ fecha                 └ lo que pidió                     └ código"],
      ["p", "El código de respuesta dice qué pasó: 200 bien, 301/302 redirección, 403 prohibido, 404 no existe, 500 error del servidor. Cosas raras en la petición (' OR, UNION SELECT, <script>, ../) son intentos de ataque.", "The response code says what happened: 200 OK, 301/302 redirect, 403 forbidden, 404 not found, 500 server error. Odd things in the request (' OR, UNION SELECT, <script>, ../) are attack attempts."],
    ],
  },
  "seguridad-puertos": {
    titulo: ["Puertos y protocolos", "Ports and protocols"],
    bloques: [
      ["p", "Una IP es la dirección de un equipo; el puerto es la «puerta» de cada servicio dentro de ese equipo. La web va por el 443, SSH por el 22… Conocerlos ayuda a leer registros, cortafuegos y escaneos.", "An IP is a machine's address; the port is each service's «door» inside that machine. The web uses 443, SSH 22… Knowing them helps you read logs, firewalls and scans."],
      ["ej", "192.168.1.20:443  →  equipo 192.168.1.20, servicio HTTPS"],
      ["h", "Cifrados y sin cifrar", "Encrypted and unencrypted"],
      ["p", "Muchos protocolos viejos tienen una versión cifrada en otro puerto: HTTP 80 → HTTPS 443, Telnet 23 → SSH 22, FTP 21 → SFTP (por el 22), IMAP 143 → IMAPS 993, POP3 110 → POP3S 995. Si ves abiertos los de la izquierda, es una alerta.", "Many old protocols have an encrypted version on another port: HTTP 80 → HTTPS 443, Telnet 23 → SSH 22, FTP 21 → SFTP (over 22), IMAP 143 → IMAPS 993, POP3 110 → POP3S 995. If you see the ones on the left open, that's a warning."],
      ["h", "Los que hay que saberse", "The ones to know by heart"],
      ["ej", "21 FTP   22 SSH   23 Telnet   25 SMTP   53 DNS   80 HTTP   443 HTTPS\n445 SMB   3306 MySQL   3389 RDP (escritorio remoto de Windows)"],
    ],
  },
  seguridad: {
    titulo: ["Cómo piensa quien defiende", "How a defender thinks"],
    bloques: [
      ["p", "Estos laboratorios siguen el trabajo de un administrador de sistemas o de un analista de seguridad: dejar los equipos bien protegidos y saber reaccionar cuando algo pasa.", "These labs follow the work of a system administrator or a security analyst: keeping machines well protected and knowing how to react when something happens."],
      ["h", "Las ideas que se repiten", "The ideas that keep coming back"],
      ["p", "Mínimo privilegio: cada usuario y programa con los permisos justos. Superficie mínima: apagar lo que no se usa. Defensa en capas: contraseñas fuertes + claves SSH + cortafuegos + fail2ban, por si falla una. Registrar y vigilar: si no lo miras, no te enteras.", "Least privilege: every user and program with just the permissions needed. Minimal surface: turn off what isn't used. Defense in depth: strong passwords + SSH keys + firewall + fail2ban, in case one fails. Log and watch: if you don't look, you won't find out."],
      ["h", "Si hay un incidente", "If there's an incident"],
      ["p", "El orden es siempre el mismo: detectar (qué pasa), contener (cortar el acceso), guardar pruebas, erradicar (limpiar), recuperar (dejarlo funcionando y actualizado) y aprender (qué cambiar para que no vuelva a pasar).", "The order is always the same: detect (what's happening), contain (cut off access), keep evidence, eradicate (clean up), recover (leave it working and updated) and learn (what to change so it doesn't happen again)."],
      ["h", "Lo que verás en la consola", "What you'll see in the console"],
      ["p", "En los laboratorios de Linux, sudo ejecuta un comando como administrador; la tubería | pasa la salida de un comando al siguiente; && ejecuta el segundo solo si el primero salió bien. A la derecha, «Cambios» muestra lo que vas cambiando en el equipo.", "In Linux labs, sudo runs a command as administrator; the pipe | passes one command's output to the next; && runs the second only if the first succeeded. On the right, «Changes» shows what you're changing on the machine."],
    ],
  },
  "lab-permisos": {
    titulo: ["Permisos en Linux", "Linux permissions"],
    bloques: [
      ["p", "Cada archivo tiene un dueño, un grupo y permisos para tres tipos de persona: el dueño (u), el grupo (g) y los demás (o). Cada uno puede leer (r), escribir (w) y ejecutar o entrar (x).", "Every file has an owner, a group and permissions for three kinds of people: the owner (u), the group (g) and others (o). Each can read (r), write (w) and execute or enter (x)."],
      ["ej", "-rw-r----- 1 admin rrhh  nominas.xlsx\n │└┬┘└┬┘└┬┘\n │ │  │  └ otros: nada\n │ │  └ grupo rrhh: leer\n │ └ dueño admin: leer y escribir\n └ - archivo   (d = carpeta)"],
      ["h", "Los números", "The numbers"],
      ["p", "Cada permiso vale un número: r = 4, w = 2, x = 1. Se suman para cada tipo de persona. Así 640 es rw- r-- ---, y 755 es rwx r-x r-x.", "Each permission is worth a number: r = 4, w = 2, x = 1. They're added up for each kind of person. So 640 is rw- r-- ---, and 755 is rwx r-x r-x."],
      ["ej", "chmod 640 nominas.xlsx      # con números\nchmod o-w config.php        # a otros (o), quitar (-) escritura (w)\nchown root:rrhh archivo     # cambiar dueño y grupo"],
    ],
  },
  "lab-switch-ataques": {
    titulo: ["Ataques de capa 2 y sus defensas", "Layer 2 attacks and their defenses"],
    bloques: [
      ["p", "Dentro de la oficina, un equipo conectado a un puerto del switch puede engañar a los demás. Estos son los ataques y lo que los frena:", "Inside the office, a device plugged into a switch port can fool the others. These are the attacks and what stops them:"],
      ["p", "DHCP falso: alguien reparte IP con su equipo como puerta de enlace y ve todo el tráfico. → DHCP snooping: solo el puerto de confianza puede dar IP.", "Rogue DHCP: someone hands out IPs with their machine as the gateway and sees all the traffic. → DHCP snooping: only the trusted port can hand out IPs."],
      ["p", "ARP spoofing: un equipo dice «yo soy la puerta de enlace» para ponerse en medio. → Inspección ARP (DAI): se comprueba cada ARP con lo que vio DHCP snooping.", "ARP spoofing: a machine says «I'm the gateway» to get in the middle. → ARP inspection (DAI): each ARP is checked against what DHCP snooping saw."],
      ["p", "Salto de VLAN: un PC se hace pasar por switch y pide un troncal para ver todas las VLAN. → switchport mode access + nonegotiate, y una VLAN nativa que no se use.", "VLAN hopping: a PC poses as a switch and asks for a trunk to see every VLAN. → switchport mode access + nonegotiate, and an unused native VLAN."],
      ["p", "Bucles o switches piratas. → BPDU Guard apaga el puerto si llega un mensaje de switch.", "Loops or rogue switches. → BPDU Guard shuts the port if a switch message arrives."],
    ],
  },

  // ===================== REDES =====================
  redes: {
    titulo: ["Cómo se configura un equipo Cisco", "How a Cisco device is configured"],
    bloques: [
      ["p", "Los routers y switches Cisco se configuran escribiendo comandos en su consola (el IOS). Es como un edificio con habitaciones: cada modo deja hacer unas cosas, y el prompt te dice en cuál estás.", "Cisco routers and switches are configured by typing commands in their console (IOS). It's like a building with rooms: each mode lets you do certain things, and the prompt tells you which one you're in."],
      ["ej", "S1>              EXEC de usuario: solo mirar un poco\nS1#              EXEC privilegiado: ver todo, guardar   (enable)\nS1(config)#      configuración global                    (configure terminal)\nS1(config-if)#   una interfaz                            (interface g0/1)\nS1(config-vlan)# una VLAN                                (vlan 10)\nexit = subir un nivel     end = volver directo a #"],
      ["h", "Los trucos del IOS", "IOS tricks"],
      ["p", "Puedes abreviar: conf t = configure terminal, int g0/0 = interface GigabitEthernet0/0, no sh = no shutdown. Tab completa la palabra y ? te dice qué puedes escribir. Si te equivocas, el IOS marca con ^ dónde está el error.", "You can abbreviate: conf t = configure terminal, int g0/0 = interface GigabitEthernet0/0, no sh = no shutdown. Tab completes the word and ? tells you what you can type. If you make a mistake, IOS marks where with ^."],
      ["h", "RAM y NVRAM", "RAM and NVRAM"],
      ["p", "Lo que configuras se guarda en running-config (la RAM) y funciona al momento, pero se pierde al apagar. Para que dure hay que copiarlo a startup-config (la NVRAM): copy running-config startup-config, o write memory.", "What you configure goes into running-config (RAM) and works right away, but is lost when powered off. To keep it, copy it to startup-config (NVRAM): copy running-config startup-config, or write memory."],
      ["h", "Las tres formas de hacer un laboratorio", "The three ways to do a lab"],
      ["p", "Guiado: ves el comando y lo copias. Plantilla: ves el comando con huecos. Examen: solo la tarea. Empieza en Guiado y repite el mismo laboratorio en Plantilla y Examen: así se aprende de verdad.", "Guided: you see the command and copy it. Template: you see it with blanks. Exam: only the task. Start in Guided and repeat the same lab in Template and Exam: that's how you really learn it."],
    ],
  },
  "lab-vlan": {
    titulo: ["Qué es una VLAN", "What a VLAN is"],
    bloques: [
      ["p", "Una VLAN divide un switch en varios switches «virtuales». Los equipos de la VLAN 10 solo se ven entre ellos, aunque estén en el mismo aparato que los de la VLAN 20. Así se separan departamentos, se reduce el tráfico de difusión y se gana seguridad.", "A VLAN splits one switch into several «virtual» switches. Devices on VLAN 10 only see each other, even if they're on the same box as VLAN 20. That separates departments, reduces broadcast traffic and improves security."],
      ["ej", "vlan 10                        ← crear la VLAN\n name VENTAS                   ← ponerle nombre\ninterface range fa0/1 - 10     ← elegir puertos\n switchport mode access        ← puerto de una sola VLAN\n switchport access vlan 10     ← meterlo en la VLAN 10"],
      ["p", "Para que dos VLAN se comuniquen hace falta un router (o un switch de capa 3). Para llevar varias VLAN por un mismo cable entre switches, un troncal (802.1Q).", "For two VLANs to talk you need a router (or a layer 3 switch). To carry several VLANs over one cable between switches, a trunk (802.1Q)."],
    ],
  },
  "lab-estaticas": {
    titulo: ["Rutas: cómo decide un router", "Routes: how a router decides"],
    bloques: [
      ["p", "Un router solo conoce las redes que tiene conectadas. Para llegar a las demás necesita rutas: una estática la escribes tú; una dinámica la aprende con un protocolo como OSPF.", "A router only knows the networks connected to it. To reach others it needs routes: you write a static one; a dynamic one is learned with a protocol like OSPF."],
      ["ej", "ip route 192.168.30.0 255.255.255.0 10.0.0.2\n         └ red destino  └ máscara      └ siguiente salto (el router de al lado)\nip route 0.0.0.0 0.0.0.0 203.0.113.1     ← ruta por defecto: «todo lo demás, por aquí»"],
      ["p", "Cada paquete se compara con la tabla de rutas (show ip route) y sale por la ruta más concreta que coincida. C = conectada, S = estática, O = OSPF, * = por defecto.", "Each packet is checked against the routing table (show ip route) and goes out the most specific matching route. C = connected, S = static, O = OSPF, * = default."],
    ],
  },
  "lab-ospf": {
    titulo: ["OSPF: rutas que se aprenden solas", "OSPF: routes learned automatically"],
    bloques: [
      ["p", "Con OSPF, los routers se presentan a sus vecinos, se cuentan qué redes tienen y cada uno calcula el mejor camino (el de menor coste). Si se cae un enlace, recalculan solos.", "With OSPF, routers introduce themselves to neighbors, tell each other which networks they have, and each computes the best path (the lowest cost). If a link goes down, they recalculate on their own."],
      ["h", "La wildcard", "The wildcard"],
      ["p", "OSPF y las ACL usan wildcard en vez de máscara: es la máscara al revés. Se calcula restando cada número de 255.", "OSPF and ACLs use a wildcard instead of a mask: it's the mask inverted. Subtract each number from 255."],
      ["ej", "máscara  255.255.255.0    →  wildcard 0.0.0.255\nmáscara  255.255.255.252  →  wildcard 0.0.0.3\nnetwork 192.168.10.0 0.0.0.255 area 0"],
      ["p", "En la tabla, [110/65] significa: 110 es la distancia administrativa (cuánto se fía el router de OSPF) y 65 el coste del camino.", "In the table, [110/65] means: 110 is the administrative distance (how much the router trusts OSPF) and 65 is the path cost."],
    ],
  },
  "lab-acl": {
    titulo: ["Listas de control de acceso", "Access control lists"],
    bloques: [
      ["p", "Una ACL es una lista de reglas que el router lee de arriba abajo; la primera que coincide decide (permit o deny). Al final hay siempre un «deny any» invisible: lo que no se permite, se bloquea.", "An ACL is a list of rules the router reads top to bottom; the first one that matches decides (permit or deny). There's always an invisible «deny any» at the end: whatever isn't permitted is blocked."],
      ["ej", "deny tcp 192.168.20.0 0.0.0.255 host 192.168.30.10 eq 80\n└acción└protocolo └origen + wildcard   └destino           └puerto"],
      ["p", "Estándar (1-99): solo miran el origen; van cerca del destino. Extendidas (100-199 o con nombre): miran origen, destino, protocolo y puerto; van cerca del origen. Se aplican con ip access-group en una interfaz (in = lo que entra, out = lo que sale).", "Standard (1-99): only check the source; place them near the destination. Extended (100-199 or named): check source, destination, protocol and port; place them near the source. They're applied with ip access-group on an interface (in = incoming, out = outgoing)."],
    ],
  },
  "lab-nat": {
    titulo: ["NAT y PAT", "NAT and PAT"],
    bloques: [
      ["p", "Las IP privadas (192.168.x.x, 10.x.x.x, 172.16-31.x.x) no sirven en internet. NAT cambia la IP privada por una pública al salir y la devuelve al volver.", "Private IPs (192.168.x.x, 10.x.x.x, 172.16-31.x.x) don't work on the internet. NAT swaps the private IP for a public one on the way out and back on the way in."],
      ["p", "Con overload (PAT), muchos equipos comparten una sola IP pública: el router los distingue por el número de puerto. Es lo que hace el router de tu casa.", "With overload (PAT), many devices share a single public IP: the router tells them apart by port number. It's what your home router does."],
      ["ej", "Inside local    192.168.10.11:5   (el PC, por dentro)\nInside global   203.0.113.2:5     (cómo se ve en internet)"],
    ],
  },
  "lab-dhcp": {
    titulo: ["Cómo funciona DHCP", "How DHCP works"],
    bloques: [
      ["p", "DHCP reparte automáticamente la IP, la máscara, la puerta de enlace y el DNS a los equipos que se conectan. Son cuatro mensajes (DORA):", "DHCP automatically hands out the IP, mask, gateway and DNS to devices that connect. It takes four messages (DORA):"],
      ["ej", "PC  → todos   Discover   «¿hay algún servidor DHCP?»\nSrv → PC      Offer      «te ofrezco la 192.168.10.11»\nPC  → todos   Request    «me quedo con la .11»\nSrv → PC      Ack        «confirmado, es tuya»"],
      ["p", "Las direcciones fijas (router, impresoras, servidores) se excluyen para que DHCP no las dé. Si un PC recibe 169.254.x.x es que nadie le respondió.", "Fixed addresses (router, printers, servers) are excluded so DHCP doesn't hand them out. If a PC gets 169.254.x.x, nobody answered it."],
    ],
  },

  // ===================== MATEMÁTICAS =====================
  "calculo-ecuaciones": {
    titulo: ["La fórmula general", "The quadratic formula"],
    bloques: [
      ["p", "Una ecuación de segundo grado tiene la forma ax² + bx + c = 0 y puede tener dos soluciones, una (doble) o ninguna real. Se resuelve con la fórmula general:", "A quadratic equation has the form ax² + bx + c = 0 and can have two solutions, one (double) or no real one. It's solved with the quadratic formula:"],
      ["ej", "x = (−b ± √(b² − 4ac)) / 2a\nΔ = b² − 4ac  (discriminante)   Δ > 0 dos soluciones · Δ = 0 una · Δ < 0 ninguna real"],
      ["h", "Ejemplo", "Example"],
      ["ej", "x² − 5x + 6 = 0      a = 1, b = −5, c = 6\nΔ = 25 − 24 = 1\nx = (5 ± 1) / 2   →   x = 3  y  x = 2\nRespuesta: 2; 3"],
      ["p", "Escribe las soluciones separadas por punto y coma, en cualquier orden. Las fracciones valen (1/2) y también los decimales (0,5).", "Type the solutions separated by a semicolon, in any order. Fractions work (1/2) and so do decimals (0.5)."],
    ],
  },
  "calculo-mezcla": {
    titulo: ["Trucos de cálculo", "Calculation tricks"],
    bloques: [
      ["h", "Orden de las operaciones", "Order of operations"],
      ["p", "Primero paréntesis, luego potencias y raíces, luego multiplicar y dividir, y al final sumar y restar.", "First parentheses, then powers and roots, then multiply and divide, and finally add and subtract."],
      ["ej", "3 + 2 × 8 = 3 + 16 = 19     (no 40)"],
      ["h", "Porcentajes", "Percentages"],
      ["p", "El 15 % de algo es multiplicarlo por 15 y dividir entre 100. Truco: el 10 % es quitar un cero; el 5 % es la mitad del 10 %.", "15% of something is multiplying by 15 and dividing by 100. Trick: 10% is dropping a zero; 5% is half of 10%."],
      ["ej", "15 % de 80 = 10 % (8) + 5 % (4) = 12"],
      ["h", "Fracciones", "Fractions"],
      ["ej", "1/2 + 1/3 = 3/6 + 2/6 = 5/6      (mismo denominador)\n1/2 × 1/3 = 1/6                  (arriba por arriba, abajo por abajo)"],
    ],
  },

  // ===================== IDIOMAS =====================
  numeros: {
    titulo: ["Cómo se escriben los números", "How numbers are written"],
    bloques: [
      ["h", "En inglés", "In English"],
      ["p", "Del 21 al 99 con guion (forty-seven). Las centenas con hundred (three hundred), los miles con thousand. El «and» es opcional (one hundred and five): aquí vale con y sin él.", "From 21 to 99 with a hyphen (forty-seven). Hundreds with hundred (three hundred), thousands with thousand. The «and» is optional (one hundred and five): both are accepted here."],
      ["ej", "13 thirteen   30 thirty   40 forty (¡sin u!)   15 fifteen   50 fifty"],
      ["h", "En español", "In Spanish"],
      ["p", "Del 16 al 29 en una palabra y con tilde en algunas (dieciséis, veintidós, veintitrés, veintiséis). Desde el 31, con «y» (treinta y uno). 100 es cien, pero 101 es ciento uno. Ojo: quinientos, setecientos, novecientos.", "From 16 to 29 as one word, some with an accent (dieciséis, veintidós, veintitrés, veintiséis). From 31, with «y» (treinta y uno). 100 is cien, but 101 is ciento uno. Watch out: quinientos, setecientos, novecientos."],
    ],
  },
  "verbos-en": {
    titulo: ["Verbos irregulares", "Irregular verbs"],
    bloques: [
      ["p", "Los verbos regulares forman el pasado y el participio con -ed (work → worked → worked). Los irregulares no siguen la regla y hay que aprenderlos de memoria.", "Regular verbs form the past and the participle with -ed (work → worked → worked). Irregular ones don't follow the rule and have to be memorized."],
      ["ej", "go → went → gone        (I went yesterday / I have gone)\npasado: lo que pasó    participio: con have (perfecto) o en pasiva"],
      ["p", "Truco: apréndelos por grupos que suenan igual: sing-sang-sung, ring-rang-rung, drink-drank-drunk; o los que no cambian: cut-cut-cut, put-put-put.", "Trick: learn them in groups that sound alike: sing-sang-sung, ring-rang-rung, drink-drank-drunk; or the ones that don't change: cut-cut-cut, put-put-put."],
    ],
  },
  falsos: {
    titulo: ["Falsos amigos", "False friends"],
    bloques: [
      ["p", "Son palabras que se parecen en inglés y en español pero significan otra cosa. Son las que más vergüenza dan al equivocarse.", "They're words that look alike in English and Spanish but mean something else. They're the most embarrassing ones to get wrong."],
      ["ej", "embarrassed = avergonzado      (embarazada = pregnant)\nactually    = en realidad      (actualmente = currently)\nexit        = salida           (éxito = success)"],
    ],
  },
  dictado: {
    titulo: ["Cómo aprovechar el dictado", "Getting the most out of dictation"],
    bloques: [
      ["p", "Oyes la frase sin verla y la escribes; las letras se descubren al acertar. Entrena el oído y la ortografía a la vez. Puedes repetirla con el altavoz y ponerla más lenta en los ajustes.", "You hear the sentence without seeing it and type it; letters are revealed as you get them right. It trains your ear and spelling at the same time. You can replay it with the speaker and slow it down in the settings."],
      ["p", "Truco: escucha la frase entera antes de empezar a escribir, y fíjate en las palabras pequeñas (a, the, de, que), que son las que más se escapan.", "Tip: listen to the whole sentence before you start typing, and pay attention to small words (a, the, de, que), which are the easiest to miss."],
    ],
  },
  pronunciacion: {
    titulo: ["Cómo funciona la pronunciación", "How pronunciation works"],
    bloques: [
      ["p", "Oyes la palabra, pulsas «Hablar» y la dices. El navegador convierte tu voz en texto y el juego lo compara con la palabra: si se parece lo suficiente, cuenta. Tienes tres intentos.", "You hear the word, press «Speak» and say it. The browser turns your voice into text and the game compares it with the word: if it's close enough, it counts. You get three tries."],
      ["p", "Habla claro y a un ritmo normal, sin gritar y cerca del micrófono. Funciona en Chrome, Edge y Safari; en Chrome y Edge el audio lo procesa un servicio del navegador en internet.", "Speak clearly at a normal pace, without shouting, close to the microphone. It works in Chrome, Edge and Safari; in Chrome and Edge the audio is processed by an online browser service."],
    ],
  },
  textos: {
    titulo: ["Para qué sirven los textos largos", "What long texts are for"],
    bloques: [
      ["p", "Copiar párrafos enteros obliga a escribir bien los acentos, las mayúsculas y los signos durante más tiempo, como en la vida real. Debajo tienes la traducción, así entiendes lo que escribes.", "Copying whole paragraphs makes you write accents, capitals and punctuation correctly for longer, like in real life. The translation is below, so you understand what you type."],
      ["p", "Si te faltan teclas (ñ, é, ç, ß…), usa los botones de debajo de la caja. Si se te hace largo, juega en dificultad «práctica» (vidas ilimitadas).", "If you're missing keys (ñ, é, ç, ß…), use the buttons below the box. If it feels long, play on «practice» difficulty (unlimited lives)."],
    ],
  },
  traducir: {
    titulo: ["Cómo traducir aquí", "How translating works here"],
    bloques: [
      ["p", "Ves una frase en tu idioma y la escribes en el que aprendes. La traducción está escondida con rayas: cada raya es una letra, así sabes cuántas palabras hay y lo larga que es cada una. Al acertar una letra, aparece.", "You see a sentence in your language and type it in the one you're learning. The translation is hidden with dashes: each dash is a letter, so you know how many words there are and how long each is. When you get a letter right, it appears."],
      ["p", "Hay muchas formas de traducir una frase; aquí se pide una concreta. Si fallas, el juego te dice qué letra esperaba: es una pista, no un castigo.", "There are many ways to translate a sentence; here one specific one is expected. If you get it wrong, the game tells you which letter it expected: it's a hint, not a punishment."],
    ],
  },
  "codigo-lenguaje": {
    titulo: ["Reconocer un lenguaje", "Recognizing a language"],
    bloques: [
      ["p", "Cada lenguaje tiene detalles que lo delatan. Fíjate en cómo muestra texto, cómo crea variables y cómo acaba las líneas.", "Each language has telltale details. Look at how it prints text, how it creates variables and how lines end."],
      ["ej", "print(\"Hola\")                Python (sin ; ni llaves)\nconsole.log(\"Hola\");         JavaScript\nSystem.out.println(\"Hola\");  Java\necho \"Hola\";  $variable      PHP\nfmt.Println(\"Hola\")   x := 1  Go\nlet mut x = 1;  println!()    Rust"],
    ],
  },
};
