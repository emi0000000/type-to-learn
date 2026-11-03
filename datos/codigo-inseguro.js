// codigo-inseguro.js: líneas de código para el modo «Código inseguro» de la sección Ciberseguridad.
// Lista escrita para este proyecto (licencia MIT, como el código).
// Cada entrada es [número, lenguaje, versión segura, qué hace en español, qué hace en inglés,
//                  [[versión insegura, por qué es peligrosa en español, en inglés], [otra insegura...]], nivel].
// Se elige la versión segura entre tres y después se escribe.
window.CODIGO_INSEGURO = [
  // --- SQL e inyección ---
  [1, "python", 'cursor.execute("SELECT * FROM usuarios WHERE email = %s", (email,))', "Busca un usuario por su email sin riesgo de inyección SQL.", "Looks up a user by email with no SQL injection risk.", [
    ['cursor.execute("SELECT * FROM usuarios WHERE email = \'" + email + "\'")', "Pega lo que escribe el usuario dentro de la consulta: con ' OR '1'='1 vería todos los usuarios (inyección SQL).", "It glues user input into the query: with ' OR '1'='1 they'd see every user (SQL injection)."],
    ['cursor.execute(f"SELECT * FROM usuarios WHERE email = \'{email}\'")', "Una f-string también mete el texto tal cual: misma inyección SQL.", "An f-string also inserts the text as is: same SQL injection."],
  ], 1],
  [2, "javascript", 'db.query("SELECT * FROM pedidos WHERE id = ?", [id]);', "Pide un pedido por su número con un parámetro.", "Fetches an order by its number using a parameter.", [
    ['db.query("SELECT * FROM pedidos WHERE id = " + id);', "Concatenar el id permite inyección SQL: 1; DROP TABLE pedidos.", "Concatenating the id allows SQL injection: 1; DROP TABLE pedidos."],
    ["db.query(`SELECT * FROM pedidos WHERE id = ${id}`);", "La plantilla ${} pega el texto igual que el +: inyección SQL.", "The ${} template glues the text just like +: SQL injection."],
  ], 1],
  [3, "sql", "GRANT SELECT ON tienda.productos TO 'web'@'localhost';", "Da a la web solo permiso de lectura sobre la tabla de productos.", "Gives the website read-only permission on the products table.", [
    ["GRANT ALL PRIVILEGES ON *.* TO 'web'@'%';", "Todos los permisos sobre todas las bases y desde cualquier sitio: si roban la web, roban todo.", "Every permission on every database from anywhere: if the site is breached, everything is."],
    ["GRANT SELECT ON tienda.productos TO 'web'@'%';", "El % deja conectarse desde cualquier equipo; mejor solo desde el servidor (localhost).", "% lets it connect from any machine; better only from the server (localhost)."],
  ], 2],
  // --- XSS ---
  [11, "javascript", "comentario.textContent = texto;", "Muestra en la página un comentario escrito por un usuario.", "Shows a user-written comment on the page.", [
    ["comentario.innerHTML = texto;", "innerHTML ejecuta el HTML que mande el usuario: con <img onerror=...> roba sesiones (XSS).", "innerHTML runs the HTML the user sends: with <img onerror=...> it steals sessions (XSS)."],
    ["document.write(texto);", "document.write también interpreta el HTML: XSS.", "document.write also interprets HTML: XSS."],
  ], 1],
  [12, "web", '<a href="https://ejemplo.com" target="_blank" rel="noopener noreferrer">Enlace</a>', "Enlace que se abre en otra pestaña sin dar acceso a tu página.", "A link that opens in another tab without access to your page.", [
    ['<a href="https://ejemplo.com" target="_blank">Enlace</a>', "Sin rel=\"noopener\", la página abierta puede controlar la tuya con window.opener (en navegadores antiguos).", "Without rel=\"noopener\", the opened page can control yours via window.opener (in older browsers)."],
    ['<a href="javascript:abrir(\'https://ejemplo.com\')">Enlace</a>', "Los enlaces javascript: son un camino típico de XSS.", "javascript: links are a typical XSS path."],
  ], 2],
  [13, "python", "return render_template('perfil.html', nombre=nombre)", "Muestra la página de perfil con el nombre escapado por la plantilla.", "Shows the profile page with the name escaped by the template.", [
    ["return render_template_string('<h1>' + nombre + '</h1>')", "Construir la plantilla con lo que escribe el usuario permite inyectar código en la plantilla.", "Building the template from user input allows template injection."],
    ["return '<h1>' + nombre + '</h1>'", "Devuelve HTML sin escapar: XSS.", "It returns unescaped HTML: XSS."],
  ], 2],
  // --- Contraseñas ---
  [21, "python", "hash = bcrypt.hashpw(clave.encode(), bcrypt.gensalt())", "Guarda una contraseña con un hash lento y con sal.", "Stores a password with a slow, salted hash.", [
    ["hash = hashlib.md5(clave.encode()).hexdigest()", "MD5 es rapidísimo: se prueban miles de millones de contraseñas por segundo.", "MD5 is extremely fast: billions of passwords per second can be tried."],
    ["guardar(usuario, clave)", "Guardar la contraseña tal cual: si roban la base, tienen todas.", "Storing the password as is: if the database is stolen, they have them all."],
  ], 1],
  [22, "python", "if hmac.compare_digest(token, esperado):", "Compara un código secreto sin dar pistas por el tiempo que tarda.", "Compares a secret token without leaking hints through timing.", [
    ["if token == esperado:", "== se para en la primera letra distinta: midiendo el tiempo se puede adivinar el secreto.", "== stops at the first different letter: timing it can reveal the secret."],
    ["if token in esperado:", "in acepta cualquier trozo del secreto: «a» valdría.", "in accepts any piece of the secret: «a» would pass."],
  ], 3],
  [23, "javascript", 'const clave = process.env.API_KEY;', "Lee la clave de una API desde una variable de entorno.", "Reads an API key from an environment variable.", [
    ['const clave = "sk_live_51Hc8XyZ";', "Una clave escrita en el código acaba en el repositorio y la ve cualquiera.", "A key written in the code ends up in the repository for anyone to see."],
    ['console.log("Clave:", process.env.API_KEY);', "Escribirla en el registro la deja a la vista de quien lea los registros.", "Printing it to the log exposes it to whoever reads the logs."],
  ], 1],
  // --- Comandos y archivos ---
  [31, "python", 'subprocess.run(["ping", "-c", "1", ip])', "Hace ping a una IP que escribe el usuario, sin pasar por la shell.", "Pings an IP the user typed, without going through the shell.", [
    ['os.system("ping -c 1 " + ip)', "Con ip = «8.8.8.8; rm -rf /» se ejecuta lo que quiera el atacante (inyección de comandos).", "With ip = «8.8.8.8; rm -rf /» the attacker's command runs (command injection)."],
    ['subprocess.run("ping -c 1 " + ip, shell=True)', "shell=True con texto del usuario: inyección de comandos.", "shell=True with user text: command injection."],
  ], 2],
  [32, "python", "if not (BASE / nombre).resolve().is_relative_to(BASE): abort(403)", "Abre un archivo pedido por el usuario comprobando que no se sale de su carpeta.", "Opens a file requested by the user, checking it doesn't escape its folder.", [
    ["ruta = open(BASE / nombre)", "Con nombre = «../../etc/passwd» se lee cualquier archivo del servidor (path traversal).", "With name = «../../etc/passwd» any server file can be read (path traversal)."],
    ['ruta = open(BASE / nombre.replace("../", ""))', "Quitar «../» una vez no basta: «....//» vuelve a dar «../».", "Removing «../» once isn't enough: «....//» becomes «../» again."],
  ], 3],
  [33, "terminal", "chmod 600 ~/.ssh/id_ed25519", "Deja la clave privada de SSH solo para su dueño.", "Makes the SSH private key readable only by its owner.", [
    ["chmod 777 ~/.ssh/id_ed25519", "777 deja que cualquiera la lea y la cambie (y SSH se niega a usarla).", "777 lets anyone read and change it (and SSH refuses to use it)."],
    ["chmod 644 ~/.ssh/id_ed25519", "644 deja que todos la lean: es tu llave.", "644 lets everyone read it: it's your key."],
  ], 1],
  [34, "terminal", "curl -fsSLO https://ejemplo.com/instalar.sh && less instalar.sh", "Descarga un script de instalación para leerlo antes de ejecutarlo.", "Downloads an install script to read it before running it.", [
    ["curl -s http://ejemplo.com/instalar.sh | sudo bash", "Ejecuta como root algo que no has leído, y por http (lo pueden cambiar por el camino).", "It runs unread code as root, over http (it can be changed in transit)."],
    ["wget ejemplo.com/instalar.sh -O- | sh", "Lo mismo: ejecutar sin mirar lo que llega.", "Same thing: running whatever arrives without looking."],
  ], 2],
  // --- Web y cabeceras ---
  [41, "javascript", 'res.cookie("sesion", id, { httpOnly: true, secure: true, sameSite: "strict" });', "Crea la cookie de sesión protegida.", "Creates a protected session cookie.", [
    ['res.cookie("sesion", id);', "Sin httpOnly, un XSS puede leerla; sin secure, viaja sin cifrar.", "Without httpOnly, an XSS can read it; without secure, it travels unencrypted."],
    ['res.cookie("sesion", id, { httpOnly: false });', "httpOnly: false deja que cualquier script la robe.", "httpOnly: false lets any script steal it."],
  ], 2],
  [42, "web", '<input type="hidden" name="csrf" value="{{ token }}">', "Campo oculto con el token contra CSRF en un formulario de transferencia (method=\"post\").", "Hidden anti-CSRF token field in a transfer form (method=\"post\").", [
    ['<input type="hidden" name="usuario" value="{{ usuario }}">', "Mandar quién es el usuario en un campo oculto no protege: se puede cambiar, y sin token una web ajena puede hacer la transferencia en tu nombre (CSRF).", "Sending who the user is in a hidden field protects nothing: it can be changed, and without a token another site can make the transfer on your behalf (CSRF)."],
    ['<input type="text" name="csrf" value="12345">', "Un token fijo, igual para todos, se adivina: no sirve contra CSRF.", "A fixed token, the same for everyone, can be guessed: useless against CSRF."],
  ], 3],
  [43, "javascript", 'app.use(cors({ origin: "https://mi-web.example" }));', "Solo deja que tu propia web llame a la API desde el navegador.", "Lets only your own website call the API from the browser.", [
    ['app.use(cors({ origin: "*", credentials: true }));', "Cualquier web podría usar la API con las credenciales del visitante.", "Any website could use the API with the visitor's credentials."],
    ["app.use(cors());", "Sin opciones, cualquier origen puede llamar a la API.", "With no options, any origin can call the API."],
  ], 3],
  [44, "python", "app.run(debug=False)", "Arranca la aplicación web en producción.", "Starts the web app in production.", [
    ["app.run(debug=True)", "El modo depuración enseña el código y deja ejecutar órdenes desde el navegador.", "Debug mode shows the code and lets commands run from the browser."],
    ['app.run(debug=True, host="0.0.0.0")', "Y además abierta a toda la red: peor todavía.", "And open to the whole network: even worse."],
  ], 1],
  // --- Criptografía y datos ---
  [51, "python", "token = secrets.token_urlsafe(32)", "Crea un código secreto imposible de adivinar (para restablecer contraseñas).", "Creates an unguessable secret token (for password resets).", [
    ["token = str(random.randint(1000, 9999))", "random no es seguro y 4 cifras se adivinan en segundos.", "random isn't secure and 4 digits are guessed in seconds."],
    ["token = str(time.time())", "La hora se puede adivinar casi exacta.", "The time can be guessed almost exactly."],
  ], 2],
  [52, "python", "requests.get(url, timeout=10)", "Descarga una página comprobando el certificado HTTPS.", "Downloads a page checking the HTTPS certificate.", [
    ["requests.get(url, verify=False)", "verify=False acepta cualquier certificado: alguien en medio puede leer y cambiar todo.", "verify=False accepts any certificate: someone in the middle can read and change everything."],
    ['requests.get(url.replace("https", "http"))', "Pasar a http quita el cifrado.", "Switching to http removes the encryption."],
  ], 2],
  [53, "python", "datos = json.loads(texto)", "Lee datos que llegan de fuera en formato JSON.", "Reads data coming from outside as JSON.", [
    ["datos = pickle.loads(texto)", "pickle puede ejecutar código al leer: nunca con datos de fuera.", "pickle can run code while loading: never with outside data."],
    ["datos = eval(texto)", "eval ejecuta lo que llegue como código Python.", "eval runs whatever arrives as Python code."],
  ], 2],
  [54, "sql", "SELECT id, nombre FROM clientes WHERE id = 7;", "Consulta solo los datos que hacen falta de un cliente.", "Queries only the needed data for one customer.", [
    ["SELECT * FROM clientes;", "Traer todos los datos de todos los clientes expone más de lo necesario.", "Fetching all data for every customer exposes more than needed."],
    ["SELECT nombre, tarjeta, cvv FROM clientes WHERE id = 7;", "Nunca se debe guardar (ni pedir) el CVV de una tarjeta.", "A card's CVV must never be stored (or fetched)."],
  ], 3],
  [55, "terminal", "ssh-keygen -t ed25519", "Crea un par de claves SSH modernas.", "Creates a modern SSH key pair.", [
    ["ssh-keygen -t rsa -b 1024", "RSA de 1024 bits ya se considera débil.", "1024-bit RSA is considered weak now."],
    ["ssh-keygen -t dsa", "DSA está desactivado en OpenSSH por inseguro.", "DSA is disabled in OpenSSH as insecure."],
  ], 1],
  [56, "terminal", "sudo ufw default deny incoming", "Bloquea por defecto todo lo que entra al servidor.", "Blocks all incoming traffic by default.", [
    ["sudo ufw default allow incoming", "Deja entrar todo por defecto: el cortafuegos no protege nada.", "Lets everything in by default: the firewall protects nothing."],
    ["sudo ufw disable", "Apaga el cortafuegos.", "Turns the firewall off."],
  ], 1],
];
