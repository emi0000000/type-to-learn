// redes.js: comandos de redes (Cisco IOS y Linux) para los modos «Escribe», «Detecta el error» y «Casos de uso»
// de la sección Redes. Lista escrita para este proyecto (licencia MIT, como el código).
// Cada entrada es [número, tema, comando, qué hace en español, qué hace en inglés,
//                  [[versión con error, por qué está mal en español, en inglés], [otra versión con error...]], nivel].
// Temas: basico, switching, routing, servicios, seguridad, linux. Nivel: 1 fácil, 2 medio, 3 difícil.
window.COMANDOS_RED = [
  // --- Básico ---
  [1, "basico", "enable", "Pasa del modo usuario (>) al modo privilegiado (#).", "Goes from user mode (>) to privileged mode (#).", [
    ["enabled", "El comando es enable, sin d.", "The command is enable, without a d."],
    ["configure terminal", "Eso entra a configuración global; desde > ni siquiera funciona.", "That enters global configuration; from > it doesn't even work."],
  ], 1],
  [2, "basico", "configure terminal", "Entra al modo de configuración global.", "Enters global configuration mode.", [
    ["configuration terminal", "Es configure, no configuration.", "It's configure, not configuration."],
    ["terminal configure", "Las palabras van al revés.", "The words are backwards."],
  ], 1],
  [3, "basico", "hostname S1", "Cambia el nombre del equipo a S1.", "Renames the device to S1.", [
    ["host-name S1", "Es hostname, todo junto y sin guion.", "It's hostname, one word, no hyphen."],
    ["name S1", "name pone el nombre de una VLAN, no del equipo.", "name names a VLAN, not the device."],
  ], 1],
  [4, "basico", "show running-config", "Muestra la configuración que está funcionando (en la RAM).", "Shows the running configuration (in RAM).", [
    ["show running-configuration", "Es running-config.", "It's running-config."],
    ["show startup-config", "Esa es la guardada en la NVRAM, no la que funciona ahora.", "That's the one saved in NVRAM, not the running one."],
  ], 1],
  [5, "basico", "copy running-config startup-config", "Guarda la configuración actual para que no se pierda al reiniciar.", "Saves the current configuration so it survives a reboot.", [
    ["copy startup-config running-config", "Al revés: eso carga la guardada encima de la actual.", "Backwards: that loads the saved one over the current one."],
    ["save running-config", "En Cisco no existe save; es copy (o write memory).", "Cisco has no save; it's copy (or write memory)."],
  ], 1],
  [6, "basico", "show ip interface brief", "Lista las interfaces con su IP y su estado, una por línea.", "Lists the interfaces with their IP and status, one per line.", [
    ["show interface ip brief", "El orden es show ip interface brief.", "The order is show ip interface brief."],
    ["show ip interfaces brief", "Aquí es interface, en singular.", "Here it's interface, singular."],
  ], 1],
  [7, "basico", "enable secret class", "Pone la contraseña cifrada class al modo privilegiado.", "Sets the encrypted password class for privileged mode.", [
    ["enable password class", "Funciona, pero guarda la contraseña sin cifrar.", "It works, but stores the password unencrypted."],
    ["secret enable class", "Las palabras van al revés.", "The words are backwards."],
  ], 1],
  [8, "basico", "service password-encryption", "Cifra todas las contraseñas que están en texto claro.", "Encrypts all clear-text passwords.", [
    ["service password encryption", "password-encryption va con guion.", "password-encryption has a hyphen."],
    ["password-encryption service", "Empieza por service.", "It starts with service."],
  ], 1],
  [9, "basico", "banner motd #Authorized access only#", "Pone un aviso que se ve al conectarse.", "Sets a banner shown when connecting.", [
    ["banner motd Authorized access only", "Falta el carácter que marca el principio y el final (#).", "The delimiter character (#) at the start and end is missing."],
    ["motd banner #Authorized access only#", "Es banner motd, en ese orden.", "It's banner motd, in that order."],
  ], 1],
  [10, "basico", "line vty 0 15", "Entra a la configuración de las 16 líneas remotas (Telnet/SSH).", "Enters the configuration of the 16 remote lines (Telnet/SSH).", [
    ["line vty 1 16", "Las líneas se numeran desde 0: de la 0 a la 15.", "Lines are numbered from 0: 0 to 15."],
    ["line console 0 15", "La consola es solo la 0; las remotas son vty.", "The console is just line 0; remote lines are vty."],
  ], 1],
  [11, "basico", "no ip domain-lookup", "Evita que el router busque en DNS las palabras mal escritas.", "Stops the router looking up mistyped words in DNS.", [
    ["no ip domain lookup", "domain-lookup va con guion.", "domain-lookup has a hyphen."],
    ["ip domain-lookup", "Sin el no, lo activa en vez de desactivarlo.", "Without no, it turns it on instead of off."],
  ], 2],
  // --- Switching ---
  [21, "switching", "vlan 10", "Crea la VLAN 10 (y entra a configurarla).", "Creates VLAN 10 (and enters its configuration).", [
    ["create vlan 10", "En Cisco no existe create: basta con vlan 10.", "Cisco has no create: just vlan 10."],
    ["vlan10 create", "Es vlan, un espacio y el número.", "It's vlan, a space and the number."],
  ], 1],
  [22, "switching", "switchport mode access", "Pone el puerto en modo acceso (una sola VLAN).", "Puts the port in access mode (a single VLAN).", [
    ["switchport access mode", "Las palabras van al revés: switchport mode access.", "The words are backwards: switchport mode access."],
    ["switchport mode trunk", "Eso lo convierte en troncal (varias VLAN).", "That makes it a trunk (many VLANs)."],
  ], 1],
  [23, "switching", "switchport access vlan 10", "Mete el puerto en la VLAN 10.", "Puts the port in VLAN 10.", [
    ["switchport vlan 10", "Falta access.", "access is missing."],
    ["switchport access vlan10", "Falta el espacio entre vlan y 10.", "The space between vlan and 10 is missing."],
  ], 1],
  [24, "switching", "interface range fa0/1 - 10", "Selecciona los puertos Fa0/1 a Fa0/10 a la vez.", "Selects ports Fa0/1 to Fa0/10 at once.", [
    ["interface fa0/1 - 10", "Para varios puertos hace falta range.", "Several ports need range."],
    ["interface range fa0/1 - fa0/10 - 24", "El rango tiene principio y final, nada más.", "A range has a start and an end, nothing else."],
  ], 2],
  [25, "switching", "switchport mode trunk", "Convierte el puerto en troncal (lleva varias VLAN).", "Makes the port a trunk (carries many VLANs).", [
    ["switchport trunk mode", "Al revés: switchport mode trunk.", "Backwards: switchport mode trunk."],
    ["switchport mode access", "Eso lo deja en una sola VLAN.", "That leaves it on a single VLAN."],
  ], 2],
  [26, "switching", "switchport trunk native vlan 99", "Pone la VLAN 99 como nativa (sin etiqueta) del troncal.", "Sets VLAN 99 as the trunk's native (untagged) VLAN.", [
    ["switchport native vlan 99", "Falta trunk.", "trunk is missing."],
    ["switchport trunk native 99", "Falta vlan antes del número.", "vlan is missing before the number."],
  ], 2],
  [27, "switching", "switchport trunk allowed vlan 10,20,99", "Deja pasar solo las VLAN 10, 20 y 99 por el troncal.", "Lets only VLANs 10, 20 and 99 through the trunk.", [
    ["switchport trunk allowed vlan 10 20 99", "Las VLAN van separadas por comas.", "VLANs are separated by commas."],
    ["switchport allowed vlan 10,20,99", "Falta trunk.", "trunk is missing."],
  ], 2],
  [28, "switching", "show vlan brief", "Muestra las VLAN y los puertos de cada una.", "Shows the VLANs and each one's ports.", [
    ["show vlans brief", "Es vlan, en singular.", "It's vlan, singular."],
    ["show brief vlan", "El orden es show vlan brief.", "The order is show vlan brief."],
  ], 1],
  [29, "switching", "channel-group 1 mode active", "Mete los puertos en el EtherChannel 1 con LACP.", "Adds the ports to EtherChannel 1 with LACP.", [
    ["channel-group 1 mode passive", "Funciona, pero passive solo espera: con dos passive no se forma.", "It works, but passive just waits: two passives never form it."],
    ["channel group 1 mode active", "channel-group va con guion.", "channel-group has a hyphen."],
  ], 3],
  [30, "switching", "spanning-tree portfast", "El puerto empieza a funcionar al momento (solo para PC).", "The port starts forwarding right away (PCs only).", [
    ["spanning-tree port-fast", "Es portfast, todo junto.", "It's portfast, one word."],
    ["portfast spanning-tree", "Empieza por spanning-tree.", "It starts with spanning-tree."],
  ], 3],
  [31, "switching", "spanning-tree vlan 10 root primary", "Hace que este switch sea el puente raíz de la VLAN 10.", "Makes this switch the root bridge for VLAN 10.", [
    ["spanning-tree vlan 10 root secondary", "secondary lo deja de reserva, no como raíz.", "secondary makes it the backup, not the root."],
    ["spanning-tree root primary vlan 10", "La VLAN va antes de root.", "The VLAN goes before root."],
  ], 3],
  // --- Routing ---
  [41, "routing", "ip address 192.168.1.1 255.255.255.0", "Pone la IP 192.168.1.1/24 en la interfaz.", "Sets IP 192.168.1.1/24 on the interface.", [
    ["ip address 192.168.1.1/24", "El IOS no acepta /24: hay que escribir la máscara.", "IOS doesn't take /24: you must write the mask."],
    ["ip address 255.255.255.0 192.168.1.1", "Primero la IP y después la máscara.", "First the IP, then the mask."],
  ], 1],
  [42, "routing", "no shutdown", "Enciende la interfaz.", "Turns the interface on.", [
    ["shutdown", "Eso la apaga.", "That turns it off."],
    ["no shut down", "shutdown va todo junto.", "shutdown is one word."],
  ], 1],
  [43, "routing", "ip default-gateway 192.168.1.1", "Pone la puerta de enlace de un switch de capa 2.", "Sets a layer 2 switch's default gateway.", [
    ["ip gateway 192.168.1.1", "Es default-gateway.", "It's default-gateway."],
    ["default-gateway 192.168.1.1", "Empieza por ip.", "It starts with ip."],
  ], 1],
  [44, "routing", "ip route 192.168.30.0 255.255.255.0 10.0.0.2", "Ruta estática: la red 192.168.30.0/24 se alcanza por 10.0.0.2.", "Static route: network 192.168.30.0/24 is reached via 10.0.0.2.", [
    ["ip route 10.0.0.2 192.168.30.0 255.255.255.0", "Primero la red y la máscara, y al final el siguiente salto.", "First the network and mask, then the next hop at the end."],
    ["ip route 192.168.30.0 0.0.0.255 10.0.0.2", "En ip route va la máscara, no la wildcard.", "ip route takes the mask, not the wildcard."],
  ], 2],
  [45, "routing", "ip route 0.0.0.0 0.0.0.0 203.0.113.1", "Ruta por defecto: lo que no se conozca, a 203.0.113.1.", "Default route: anything unknown goes to 203.0.113.1.", [
    ["ip route default 203.0.113.1", "En el IOS la ruta por defecto se escribe 0.0.0.0 0.0.0.0.", "In IOS the default route is written 0.0.0.0 0.0.0.0."],
    ["ip default-route 203.0.113.1", "Ese comando no existe.", "That command doesn't exist."],
  ], 2],
  [46, "routing", "encapsulation dot1Q 10", "Asocia la subinterfaz a la VLAN 10 (802.1Q).", "Ties the subinterface to VLAN 10 (802.1Q).", [
    ["encapsulation dot1Q", "Falta el número de VLAN.", "The VLAN number is missing."],
    ["encapsulation vlan 10", "La encapsulación es dot1Q.", "The encapsulation is dot1Q."],
  ], 2],
  [47, "routing", "clock rate 64000", "Marca la velocidad del enlace serie en el extremo DCE.", "Sets the serial link speed on the DCE end.", [
    ["clockrate 64000", "Son dos palabras: clock rate.", "It's two words: clock rate."],
    ["clock rate 64k", "Se escribe el número entero: 64000.", "Write the full number: 64000."],
  ], 2],
  [48, "routing", "router ospf 1", "Arranca el proceso OSPF número 1.", "Starts OSPF process number 1.", [
    ["router ospf", "Falta el número de proceso.", "The process number is missing."],
    ["ospf router 1", "Empieza por router.", "It starts with router."],
  ], 3],
  [49, "routing", "network 192.168.10.0 0.0.0.255 area 0", "Anuncia la red 192.168.10.0/24 en el área 0 de OSPF.", "Advertises network 192.168.10.0/24 in OSPF area 0.", [
    ["network 192.168.10.0 255.255.255.0 area 0", "OSPF usa wildcard (0.0.0.255), no máscara.", "OSPF uses a wildcard (0.0.0.255), not a mask."],
    ["network 192.168.10.0 0.0.0.255", "Falta el área.", "The area is missing."],
  ], 3],
  [50, "routing", "passive-interface g0/0", "Deja de enviar mensajes OSPF por G0/0 (la LAN de los PC).", "Stops sending OSPF messages out G0/0 (the PCs' LAN).", [
    ["passive interface g0/0", "passive-interface va con guion.", "passive-interface has a hyphen."],
    ["no passive-interface g0/0", "Con no la vuelves activa.", "With no you make it active again."],
  ], 3],
  [51, "routing", "ip routing", "Activa el enrutamiento en un switch de capa 3.", "Turns on routing on a layer 3 switch.", [
    ["routing ip", "Al revés: ip routing.", "Backwards: ip routing."],
    ["ip route", "ip route es para escribir una ruta, no para activar el enrutamiento.", "ip route writes a route; it doesn't turn routing on."],
  ], 3],
  // --- Servicios ---
  [61, "servicios", "ip dhcp excluded-address 192.168.10.1 192.168.10.10", "Reserva de la .1 a la .10 para que DHCP no las reparta.", "Reserves .1 to .10 so DHCP doesn't hand them out.", [
    ["ip dhcp exclude-address 192.168.10.1 192.168.10.10", "Es excluded-address.", "It's excluded-address."],
    ["ip dhcp excluded-address 192.168.10.1-192.168.10.10", "Las dos IP van separadas por un espacio.", "The two IPs are separated by a space."],
  ], 2],
  [62, "servicios", "ip dhcp pool VENTAS", "Crea el conjunto de direcciones DHCP VENTAS.", "Creates the DHCP address pool VENTAS.", [
    ["dhcp pool VENTAS", "Empieza por ip.", "It starts with ip."],
    ["ip dhcp VENTAS", "Falta pool.", "pool is missing."],
  ], 2],
  [63, "servicios", "default-router 192.168.10.1", "Dentro del pool: la puerta de enlace que recibirán los PC.", "Inside the pool: the gateway PCs will get.", [
    ["default-gateway 192.168.10.1", "En un pool DHCP se llama default-router.", "In a DHCP pool it's called default-router."],
    ["gateway 192.168.10.1", "Es default-router.", "It's default-router."],
  ], 2],
  [64, "servicios", "ip helper-address 192.168.30.5", "Reenvía las peticiones DHCP de esta interfaz al servidor 192.168.30.5.", "Forwards DHCP requests on this interface to server 192.168.30.5.", [
    ["ip dhcp helper 192.168.30.5", "Es ip helper-address.", "It's ip helper-address."],
    ["helper-address 192.168.30.5", "Empieza por ip.", "It starts with ip."],
  ], 3],
  [65, "servicios", "ip nat inside source list 1 interface g0/1 overload", "PAT: la red de la lista 1 sale a internet con la IP de G0/1.", "PAT: list 1's network reaches the internet with G0/1's IP.", [
    ["ip nat inside source list 1 interface g0/1", "Sin overload, solo un equipo a la vez podría usar esa IP.", "Without overload, only one device at a time could use that IP."],
    ["ip nat outside source list 1 interface g0/1 overload", "La red privada es inside.", "The private network is inside."],
  ], 3],
  [66, "servicios", "ip nat inside", "Marca la interfaz como interior (la red privada).", "Marks the interface as inside (the private network).", [
    ["ip nat outside", "outside es la que da a internet.", "outside is the internet-facing one."],
    ["nat inside", "Empieza por ip.", "It starts with ip."],
  ], 3],
  [67, "servicios", "show ip dhcp binding", "Muestra qué IP ha dado DHCP a cada equipo.", "Shows which IP DHCP gave each device.", [
    ["show dhcp binding", "Falta ip.", "ip is missing."],
    ["show ip dhcp bindings", "Es binding, en singular.", "It's binding, singular."],
  ], 2],
  [68, "servicios", "show ip nat translations", "Muestra las traducciones NAT activas.", "Shows the active NAT translations.", [
    ["show nat translations", "Falta ip.", "ip is missing."],
    ["show ip nat translation", "Es translations, en plural.", "It's translations, plural."],
  ], 3],
  // --- Seguridad ---
  [81, "seguridad", "username admin secret Cisco123", "Crea el usuario admin con contraseña cifrada.", "Creates user admin with an encrypted password.", [
    ["user admin secret Cisco123", "Es username.", "It's username."],
    ["username admin Cisco123", "Falta secret (o password) antes de la contraseña.", "secret (or password) is missing before the password."],
  ], 2],
  [82, "seguridad", "crypto key generate rsa general-keys modulus 1024", "Genera las claves RSA de 1024 bits para SSH.", "Generates 1024-bit RSA keys for SSH.", [
    ["crypto key generate rsa modulus 512", "Con 512 bits no funciona SSH versión 2.", "512 bits isn't enough for SSH version 2."],
    ["crypto generate key rsa", "El orden es crypto key generate.", "The order is crypto key generate."],
  ], 2],
  [83, "seguridad", "transport input ssh", "En las líneas vty: permite solo SSH.", "On vty lines: allow only SSH.", [
    ["transport input telnet", "Telnet envía todo sin cifrar.", "Telnet sends everything unencrypted."],
    ["transport ssh", "Falta input.", "input is missing."],
  ], 2],
  [84, "seguridad", "login local", "En una línea: pide usuario y contraseña de la base local.", "On a line: ask for a user and password from the local database.", [
    ["login", "login solo pide la contraseña de la línea.", "login only asks for the line password."],
    ["local login", "Al revés: login local.", "Backwards: login local."],
  ], 2],
  [85, "seguridad", "switchport port-security maximum 2", "Permite como mucho 2 direcciones MAC en el puerto.", "Allows at most 2 MAC addresses on the port.", [
    ["switchport port-security max-mac 2", "Es maximum.", "It's maximum."],
    ["port-security maximum 2", "Empieza por switchport.", "It starts with switchport."],
  ], 3],
  [86, "seguridad", "switchport port-security mac-address sticky", "Aprende solo las MAC y las guarda en la configuración.", "Learns MACs by itself and keeps them in the config.", [
    ["switchport port-security sticky", "Falta mac-address.", "mac-address is missing."],
    ["switchport port-security mac-address dynamic", "La opción que las guarda es sticky.", "The option that keeps them is sticky."],
  ], 3],
  [87, "seguridad", "access-list 10 permit host 192.168.10.5", "ACL estándar 10: permite solo al equipo 192.168.10.5.", "Standard ACL 10: permits only host 192.168.10.5.", [
    ["access-list 10 permit 192.168.10.5 255.255.255.255", "Las ACL usan wildcard: host o 0.0.0.0, no 255.255.255.255.", "ACLs use wildcards: host or 0.0.0.0, not 255.255.255.255."],
    ["access-list 150 permit host 192.168.10.5", "150 es de las extendidas; las estándar van del 1 al 99.", "150 is an extended number; standard ones are 1 to 99."],
  ], 3],
  [88, "seguridad", "deny tcp 192.168.20.0 0.0.0.255 host 192.168.30.10 eq 80", "Bloquea el HTTP de la red 192.168.20.0/24 al servidor 192.168.30.10.", "Blocks HTTP from network 192.168.20.0/24 to server 192.168.30.10.", [
    ["deny ip 192.168.20.0 0.0.0.255 host 192.168.30.10 eq 80", "Para indicar un puerto (eq 80) hay que poner tcp o udp, no ip.", "To match a port (eq 80) you need tcp or udp, not ip."],
    ["deny tcp host 192.168.30.10 192.168.20.0 0.0.0.255 eq 80", "Primero va el origen y después el destino.", "Source goes first, then destination."],
  ], 3],
  [89, "seguridad", "ip access-group INVITADOS in", "Aplica la ACL INVITADOS al tráfico que entra por la interfaz.", "Applies ACL INVITADOS to traffic entering the interface.", [
    ["access-class INVITADOS in", "access-class es para las líneas vty; en interfaces es ip access-group.", "access-class is for vty lines; on interfaces it's ip access-group."],
    ["ip access-group in INVITADOS", "Primero el nombre y después la dirección.", "First the name, then the direction."],
  ], 3],
  // --- Linux ---
  [101, "linux", "sudo apt update", "Actualiza la lista de paquetes disponibles.", "Updates the list of available packages.", [
    ["sudo apt upgrade", "upgrade instala las actualizaciones; update solo baja la lista.", "upgrade installs updates; update only downloads the list."],
    ["apt update", "Sin sudo no tienes permiso.", "Without sudo you don't have permission."],
  ], 1],
  [102, "linux", "sudo apt install nginx -y", "Instala nginx sin preguntar.", "Installs nginx without asking.", [
    ["sudo apt get nginx -y", "Es install (o el antiguo apt-get install).", "It's install (or the old apt-get install)."],
    ["sudo install nginx -y", "Falta apt.", "apt is missing."],
  ], 1],
  [103, "linux", "sudo systemctl restart nginx", "Reinicia el servicio nginx.", "Restarts the nginx service.", [
    ["sudo systemctl nginx restart", "Primero la acción y después el servicio.", "Action first, then the service."],
    ["sudo systemctl reboot nginx", "reboot reinicia el servidor entero.", "reboot restarts the whole server."],
  ], 2],
  [104, "linux", "systemctl status ssh", "Muestra si el servicio ssh está funcionando.", "Shows whether the ssh service is running.", [
    ["systemctl ssh status", "Primero la acción: status ssh.", "Action first: status ssh."],
    ["systemctl state ssh", "Es status.", "It's status."],
  ], 1],
  [105, "linux", "ip -br addr", "Muestra las IP del servidor en formato breve.", "Shows the server's IPs in brief form.", [
    ["ipconfig", "ipconfig es de Windows.", "ipconfig is a Windows command."],
    ["ip -br address show all", "show all no es una opción válida aquí.", "show all isn't a valid option here."],
  ], 1],
  [106, "linux", "sudo ufw allow 22/tcp", "Permite SSH en el cortafuegos.", "Allows SSH in the firewall.", [
    ["sudo ufw open 22/tcp", "La palabra es allow.", "The word is allow."],
    ["sudo ufw allow 22/udp", "SSH va por TCP, no por UDP.", "SSH uses TCP, not UDP."],
  ], 2],
  [107, "linux", "sudo usermod -aG sudo ana", "Añade a ana al grupo sudo sin quitarla de sus grupos.", "Adds ana to the sudo group without removing her from her groups.", [
    ["sudo usermod -G sudo ana", "Sin -a, la sacas de todos sus otros grupos.", "Without -a, you remove her from all her other groups."],
    ["sudo usermod ana -aG sudo", "El usuario va al final.", "The user goes at the end."],
  ], 3],
  [108, "linux", "sudo ss -tlnp", "Lista los puertos TCP que escuchan y su programa.", "Lists listening TCP ports and their program.", [
    ["sudo ss -ulnp", "-u es UDP; para TCP es -t.", "-u is UDP; TCP is -t."],
    ["sudo ports -tlnp", "El comando es ss (o el antiguo netstat).", "The command is ss (or the old netstat)."],
  ], 3],
  [109, "linux", "tail -n 20 /var/log/syslog", "Muestra las 20 últimas líneas del registro del sistema.", "Shows the last 20 lines of the system log.", [
    ["head -n 20 /var/log/syslog", "head muestra las primeras, no las últimas.", "head shows the first lines, not the last ones."],
    ["tail 20 /var/log/syslog", "Falta -n delante del número.", "-n is missing before the number."],
  ], 2],
];
