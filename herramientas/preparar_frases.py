"""
Prepara las frases del modo ortografía a partir de Tatoeba (https://tatoeba.org).

Uso:
    python herramientas/preparar_frases.py              (usa las descargas guardadas si existen)
    python herramientas/preparar_frases.py --refrescar  (vuelve a descargarlo todo)

Resultado: datos/frases-es.js, que el juego carga al abrirse.
Solo usa la biblioteca estándar de Python: no hace falta instalar nada.
"""

# Importamos argparse para leer las opciones que se escriben al ejecutar el script.
import argparse
# Importamos bz2 para leer el archivo comprimido de frases sin descomprimirlo en el disco.
import bz2
# Importamos json para escribir cada frase con las comillas y los caracteres bien escapados.
import json
# Importamos re para las expresiones regulares que revisan cada frase.
import re
# Importamos sys para configurar la salida de mensajes y terminar con error si algo falla.
import sys
# Importamos unicodedata para que cada letra con tilde quede guardada como un único carácter.
import unicodedata
# Importamos urllib.request para descargar los archivos de Tatoeba.
import urllib.request
# Importamos date para anotar en el archivo final la fecha en que se generó.
from datetime import date
# Importamos Path para manejar rutas de archivos igual en Windows, macOS y Linux.
from pathlib import Path

# Carpeta raíz del proyecto: la carpeta que contiene a "herramientas".
RAIZ = Path(__file__).resolve().parent.parent
# Carpeta donde guardamos las descargas para no repetirlas (está en .gitignore).
CACHE = RAIZ / "herramientas" / ".cache"
# Archivo que genera este script y que lee el juego.
SALIDA = RAIZ / "datos" / "frases-es.js"

# Dirección base de las exportaciones públicas de Tatoeba.
BASE = "https://downloads.tatoeba.org/exports/"
# Archivos que necesitamos: nombre con el que lo guardamos -> ruta dentro de la web de Tatoeba.
ARCHIVOS = {
    # Todas las frases en español con su autor (unos 10 MB comprimidos).
    "spa_sentences_detailed.tsv.bz2": "per_language/spa/spa_sentences_detailed.tsv.bz2",
    # Idiomas que habla cada usuario y con qué nivel (5 significa lengua nativa).
    "user_languages.csv": "user_languages.csv",
    # Revisiones que los usuarios hacen de las frases (unos 100 MB).
    "users_sentences.csv": "users_sentences.csv",
}

# Longitud mínima de una frase, en caracteres.
LARGO_MINIMO = 10
# Longitud máxima de una frase, en caracteres (más larga sería pesada de copiar).
LARGO_MAXIMO = 90

# Forma válida: empieza con mayúscula (puede ir antes ¿ o ¡), usa solo letras del español,
# espacios y signos básicos, y termina en punto, cierre de interrogación o cierre de exclamación.
FORMA_VALIDA = re.compile(r"^[¿¡]?[A-ZÁÉÍÓÚÑÜ][A-Za-zÁÉÍÓÚÑÜáéíóúñü ,;:¿?¡!.]*[.?!]$")
# Un espacio delante de un signo (por ejemplo "hola ,") es un error de escritura.
ESPACIO_ANTES_DE_SIGNO = re.compile(r" [,.;:?!]")
# Una coma, punto y coma o dos puntos sin espacio detrás (por ejemplo "hola,adiós") también.
SIGNO_SIN_ESPACIO = re.compile(r"[,;:][^ ]")
# Expresión para sacar las palabras sueltas de una frase.
PALABRA = re.compile(r"[a-záéíóúñü]+")

# Tildes que la RAE ya no recomienda (Ortografía de 2010) o que nunca fueron correctas.
TILDES_NO_VALIDAS = {
    # "Solo" y los demostrativos ya no llevan tilde.
    "sólo", "éste", "ésta", "éstos", "éstas", "ése", "ésa", "ésos", "ésas",
    # Lo mismo con "aquel" y sus formas.
    "aquél", "aquélla", "aquéllos", "aquéllas",
    # Palabras que ahora se consideran de una sola sílaba y por eso no llevan tilde.
    "guión", "truhán", "rió", "lió", "frió", "guió", "crió", "fió", "fié", "lié", "huí", "huís",
    # La conjunción "o" ya no lleva tilde, ni siquiera entre números.
    "ó",
    # Monosílabos que nunca debieron llevar tilde.
    "fué", "fuí", "dió", "vió", "ví", "tí", "pié", "dí",
}

# Palabras de programación: el modo ortografía no debe incluir nada de eso.
PALABRAS_DE_PROGRAMACION = re.compile(
    # Lista de palabras prohibidas, separadas por barras verticales.
    r"\b(python|java|javascript|html|css|linux|windows|programar|programación|programador|"
    # Continuación de la lista.
    r"programadora|programadores|código|software|servidor|algoritmo|compilador)\b",
    # Da igual si están en mayúsculas o minúsculas.
    re.IGNORECASE,
)


def descargar(nombre, ruta_remota, refrescar):
    """Descarga un archivo de Tatoeba a la caché, salvo que ya esté guardado."""
    # Ruta local donde guardamos el archivo.
    destino = CACHE / nombre
    # Si ya lo tenemos y no se pidió refrescar, no lo descargamos otra vez.
    if destino.exists() and not refrescar:
        # Avisamos de que usamos la copia guardada.
        print(f"    Usando la copia guardada de {nombre}")
        # Devolvemos la ruta del archivo que ya existe.
        return destino
    # Creamos la carpeta de caché si todavía no existe.
    CACHE.mkdir(parents=True, exist_ok=True)
    # Avisamos de qué archivo estamos descargando.
    print(f"    Descargando {nombre}...")
    # Descargamos primero a un archivo provisional para no dejar uno a medias si se corta.
    provisional = destino.with_name(destino.name + ".parcial")
    # Hacemos la descarga completa.
    urllib.request.urlretrieve(BASE + ruta_remota, provisional)
    # Si terminó bien, le ponemos su nombre definitivo.
    provisional.replace(destino)
    # Devolvemos la ruta del archivo descargado.
    return destino


def leer_nativos(ruta):
    """Devuelve los usuarios que declaran el español como lengua nativa (nivel 5)."""
    # Conjunto vacío donde iremos guardando los nombres de usuario.
    nativos = set()
    # Abrimos el archivo como texto en UTF-8.
    with open(ruta, encoding="utf-8") as archivo:
        # Recorremos el archivo línea por línea.
        for linea in archivo:
            # Cada línea tiene: idioma, nivel, usuario y detalles, separados por tabuladores.
            partes = linea.rstrip("\n").split("\t")
            # Nos quedamos solo con quienes tienen el español ("spa") con nivel 5.
            if len(partes) >= 3 and partes[0] == "spa" and partes[1] == "5":
                # Guardamos su nombre de usuario.
                nativos.add(partes[2])
    # Devolvemos el conjunto completo.
    return nativos


def leer_frases(ruta):
    """Devuelve un diccionario {número de frase: (texto, autor)} con las frases en español."""
    # Diccionario vacío donde guardaremos las frases.
    frases = {}
    # Abrimos el archivo comprimido directamente como texto en UTF-8.
    with bz2.open(ruta, "rt", encoding="utf-8") as archivo:
        # Recorremos el archivo línea por línea.
        for linea in archivo:
            # Cada línea tiene: número, idioma, texto, autor, fecha de alta y fecha de cambio.
            partes = linea.rstrip("\n").split("\t")
            # Saltamos las líneas incompletas o que no empiezan con un número.
            if len(partes) < 4 or not partes[0].isdigit():
                # Pasamos a la siguiente línea.
                continue
            # Normalizamos el texto para que "á" sea siempre un único carácter.
            texto = unicodedata.normalize("NFC", partes[2])
            # Tatoeba escribe "\N" cuando una frase no tiene autor; lo dejamos vacío.
            autor = "" if partes[3] == "\\N" else partes[3]
            # Guardamos el texto y el autor bajo el número de la frase.
            frases[int(partes[0])] = (texto, autor)
    # Devolvemos todas las frases leídas.
    return frases


def leer_revisiones(ruta, frases):
    """Devuelve (aprobadas, dudosas) según las revisiones de los usuarios.

    aprobadas: {número de frase: usuarios que la marcaron como correcta}, sin contar al autor.
    dudosas: números de las frases que alguien marcó como incorrectas o dudosas.
    """
    # Diccionario de frases aprobadas, vacío al principio.
    aprobadas = {}
    # Conjunto de frases dudosas, vacío al principio.
    dudosas = set()
    # Abrimos el archivo de revisiones como texto en UTF-8.
    with open(ruta, encoding="utf-8") as archivo:
        # Recorremos el archivo línea por línea (es grande, así no lo cargamos entero).
        for linea in archivo:
            # Cada línea tiene: usuario, número de frase, revisión (1, 0 o -1) y fechas.
            partes = linea.rstrip("\n").split("\t")
            # Saltamos las líneas incompletas o con un número de frase raro.
            if len(partes) < 3 or not partes[1].isdigit():
                # Pasamos a la siguiente línea.
                continue
            # Convertimos el número de frase de texto a número.
            numero = int(partes[1])
            # Si la frase no está en español, esta revisión no nos interesa.
            if numero not in frases:
                # Pasamos a la siguiente línea.
                continue
            # Separamos quién revisó y qué opinó.
            usuario, revision = partes[0], partes[2]
            # -1 significa "incorrecta" y 0 significa "no estoy seguro": la descartamos.
            if revision in ("-1", "0"):
                # La anotamos como dudosa.
                dudosas.add(numero)
            # 1 significa "correcta"; solo cuenta si quien la revisa no es el propio autor.
            elif revision == "1" and usuario != frases[numero][1]:
                # Añadimos a esta persona a la lista de quienes aprobaron la frase.
                aprobadas.setdefault(numero, set()).add(usuario)
    # Devolvemos los dos resultados.
    return aprobadas, dudosas


def motivo_de_rechazo(texto):
    """Devuelve por qué una frase no sirve para el modo ortografía, o None si sirve."""
    # Comprobamos que la frase no sea ni demasiado corta ni demasiado larga.
    if not LARGO_MINIMO <= len(texto) <= LARGO_MAXIMO:
        # Explicamos el motivo.
        return "largo"
    # Comprobamos que solo use caracteres permitidos y empiece y termine bien.
    if not FORMA_VALIDA.match(texto):
        # Explicamos el motivo.
        return "caracteres"
    # Comprobamos que no haya espacios dobles ni espacios mal puestos junto a los signos.
    if "  " in texto or ESPACIO_ANTES_DE_SIGNO.search(texto) or SIGNO_SIN_ESPACIO.search(texto):
        # Explicamos el motivo.
        return "espacios"
    # Comprobamos que cada ¿ tenga su ? y cada ¡ tenga su !, como pide la ortografía española.
    if texto.count("¿") != texto.count("?") or texto.count("¡") != texto.count("!"):
        # Explicamos el motivo.
        return "signos"
    # Comprobamos que no tenga tildes que la RAE ya no recomienda.
    if set(PALABRA.findall(texto.lower())) & TILDES_NO_VALIDAS:
        # Explicamos el motivo.
        return "tildes"
    # Comprobamos que no hable de programación.
    if PALABRAS_DE_PROGRAMACION.search(texto):
        # Explicamos el motivo.
        return "programacion"
    # Si pasó todas las pruebas, la frase sirve.
    return None


def escribir_salida(elegidas):
    """Escribe datos/frases-es.js con las frases elegidas."""
    # Creamos la carpeta "datos" si todavía no existe.
    SALIDA.parent.mkdir(parents=True, exist_ok=True)
    # Primeras líneas del archivo: explicación, fecha, licencia y formato.
    lineas = [
        # Aviso de que el archivo se genera solo.
        "// Archivo generado por herramientas/preparar_frases.py. No lo edites a mano: vuelve a ejecutar el script.",
        # Fecha de generación y cantidad de frases.
        f"// Generado el {date.today().isoformat()} con {len(elegidas)} frases.",
        # Origen y licencia de las frases.
        "// Frases de Tatoeba (https://tatoeba.org), con licencia CC BY 2.0 FR (https://creativecommons.org/licenses/by/2.0/fr/).",
        # Formato de cada entrada.
        "// Cada frase es una lista: [número de la frase en Tatoeba, texto, autor].",
        # Comienzo de la lista, guardada como variable global para que el juego la encuentre.
        "window.FRASES_ES = [",
    ]
    # Recorremos las frases elegidas una por una.
    for numero, texto, autor in elegidas:
        # Cada frase va en su propia línea, con las tildes tal cual (ensure_ascii=False).
        lineas.append("  " + json.dumps([numero, texto, autor], ensure_ascii=False) + ",")
    # Cerramos la lista.
    lineas.append("];")
    # Guardamos el archivo en UTF-8, con un salto de línea al final.
    SALIDA.write_text("\n".join(lineas) + "\n", encoding="utf-8")


def main():
    """Descarga, filtra y guarda las frases."""
    # Nos aseguramos de que los mensajes con tildes se vean bien en cualquier consola.
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    # Preparamos el lector de opciones de la línea de comandos.
    lector = argparse.ArgumentParser(description="Prepara las frases del modo ortografía a partir de Tatoeba.")
    # Añadimos la opción --refrescar.
    lector.add_argument("--refrescar", action="store_true", help="vuelve a descargar los archivos aunque ya estén guardados")
    # Leemos las opciones escritas por la persona.
    opciones = lector.parse_args()

    # Paso 1: descargar lo que haga falta.
    print("1/4 Descargando datos de Tatoeba (la primera vez son unos 110 MB)...")
    # Descargamos cada archivo y guardamos su ruta local.
    rutas = {nombre: descargar(nombre, remota, opciones.refrescar) for nombre, remota in ARCHIVOS.items()}

    # Paso 2: leer frases y usuarios.
    print("2/4 Leyendo frases y usuarios...")
    # Leemos quién es hablante nativo de español.
    nativos = leer_nativos(rutas["user_languages.csv"])
    # Leemos todas las frases en español.
    frases = leer_frases(rutas["spa_sentences_detailed.tsv.bz2"])
    # Mostramos cuántas hay.
    print(f"    {len(frases)} frases en español y {len(nativos)} hablantes nativos.")

    # Paso 3: leer las revisiones.
    print("3/4 Leyendo revisiones...")
    # Separamos las frases aprobadas de las dudosas.
    aprobadas, dudosas = leer_revisiones(rutas["users_sentences.csv"], frases)
    # Mostramos cuántas frases tienen al menos una aprobación de otra persona.
    print(f"    {len(aprobadas)} frases aprobadas por alguien distinto del autor.")

    # Paso 4: filtrar.
    print("4/4 Filtrando...")
    # Lista de frases que pasan todos los filtros.
    elegidas = []
    # Contador de motivos de rechazo, para mostrarlo al final.
    rechazos = {}
    # Textos ya elegidos, para no meter dos veces la misma frase.
    textos_vistos = set()
    # Recorremos las frases aprobadas en orden de número.
    for numero in sorted(aprobadas):
        # Sacamos el texto y el autor de la frase.
        texto, autor = frases[numero]
        # Si alguien la marcó como incorrecta o dudosa, la descartamos.
        if numero in dudosas:
            # Contamos el motivo.
            rechazos["dudosa"] = rechazos.get("dudosa", 0) + 1
            # Pasamos a la siguiente frase.
            continue
        # Exigimos que la escribiera o la aprobara al menos un hablante nativo.
        if autor not in nativos and not (aprobadas[numero] & nativos):
            # Contamos el motivo.
            rechazos["sin nativo"] = rechazos.get("sin nativo", 0) + 1
            # Pasamos a la siguiente frase.
            continue
        # Revisamos la forma de la frase.
        motivo = motivo_de_rechazo(texto)
        # Si hay un motivo de rechazo, la descartamos.
        if motivo:
            # Contamos el motivo.
            rechazos[motivo] = rechazos.get(motivo, 0) + 1
            # Pasamos a la siguiente frase.
            continue
        # Si ya tenemos una frase con el mismo texto, no la repetimos.
        if texto in textos_vistos:
            # Contamos el motivo.
            rechazos["repetida"] = rechazos.get("repetida", 0) + 1
            # Pasamos a la siguiente frase.
            continue
        # Recordamos este texto.
        textos_vistos.add(texto)
        # La frase pasó todos los filtros: la guardamos.
        elegidas.append((numero, texto, autor))

    # Si no quedó ninguna frase, algo va mal: terminamos con un error.
    if not elegidas:
        # Mensaje de error y salida.
        sys.exit("No quedó ninguna frase. Revisa los filtros o vuelve a descargar con --refrescar.")
    # Escribimos el archivo final.
    escribir_salida(elegidas)
    # Mostramos los motivos de rechazo.
    print(f"    Descartadas: {rechazos}")
    # Mostramos el resultado.
    print(f"Listo: {len(elegidas)} frases guardadas en {SALIDA.relative_to(RAIZ)}")


# Solo ejecutamos main() si el script se lanza directamente (no si se importa desde otro).
if __name__ == "__main__":
    # Arrancamos el programa.
    main()
