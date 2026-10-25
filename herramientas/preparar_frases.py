"""
Prepara las frases de los modos ortografía e inglés a partir de Tatoeba (https://tatoeba.org).

Uso:
    python herramientas/preparar_frases.py              (usa las descargas guardadas si existen)
    python herramientas/preparar_frases.py --refrescar  (vuelve a descargarlo todo)

Resultado:
    datos/frases-es.js   frases en español para el modo ortografía
    datos/frases-en.js   frases en inglés con su traducción al español, para el modo inglés
Solo usa la biblioteca estándar de Python: no hace falta instalar nada.
"""

# Importamos argparse para leer las opciones que se escriben al ejecutar el script.
import argparse
# Importamos bz2 para leer los archivos comprimidos sin descomprimirlos en el disco.
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
# Importamos date para anotar en los archivos finales la fecha en que se generaron.
from datetime import date
# Importamos Path para manejar rutas de archivos igual en Windows, macOS y Linux.
from pathlib import Path

# Carpeta raíz del proyecto: la carpeta que contiene a "herramientas".
RAIZ = Path(__file__).resolve().parent.parent
# Carpeta donde guardamos las descargas para no repetirlas (está en .gitignore).
CACHE = RAIZ / "herramientas" / ".cache"
# Archivo de frases del modo ortografía.
SALIDA_ES = RAIZ / "datos" / "frases-es.js"
# Archivo de frases del modo inglés.
SALIDA_EN = RAIZ / "datos" / "frases-en.js"

# Dirección base de las exportaciones públicas de Tatoeba.
BASE = "https://downloads.tatoeba.org/exports/"
# Archivos que necesitamos: nombre con el que lo guardamos -> ruta dentro de la web de Tatoeba.
ARCHIVOS = {
    # Frases en español con su autor (unos 10 MB comprimidos).
    "spa_sentences_detailed.tsv.bz2": "per_language/spa/spa_sentences_detailed.tsv.bz2",
    # Frases en inglés con su autor (unos 35 MB comprimidos).
    "eng_sentences_detailed.tsv.bz2": "per_language/eng/eng_sentences_detailed.tsv.bz2",
    # Qué frase en inglés es traducción de qué frase en español (unos 2 MB).
    "eng-spa_links.tsv.bz2": "per_language/eng/eng-spa_links.tsv.bz2",
    # Etiquetas de las frases en español (por ejemplo "vulgar" o "@check").
    "spa_tags.tsv.bz2": "per_language/spa/spa_tags.tsv.bz2",
    # Etiquetas de las frases en inglés.
    "eng_tags.tsv.bz2": "per_language/eng/eng_tags.tsv.bz2",
    # Idiomas que habla cada usuario y con qué nivel (5 significa lengua nativa).
    "user_languages.csv": "user_languages.csv",
    # Revisiones que los usuarios hacen de las frases (unos 100 MB).
    "users_sentences.csv": "users_sentences.csv",
}

# Longitud mínima de una frase, en caracteres.
LARGO_MINIMO = 10
# Longitud máxima de una frase, en caracteres (más larga sería pesada de copiar).
LARGO_MAXIMO = 90
# Cuántas frases en inglés guardamos de cada largo, para que el archivo no pese demasiado.
# Cada tramo es (largo mínimo, largo máximo, cantidad). Coinciden con los tramos de js/seleccion.js.
CUPOS_INGLES = (
    # Frases cortas.
    (0, 25, 1500),
    # Frases medianas.
    (26, 40, 2000),
    # Frases largas.
    (41, LARGO_MAXIMO, 1500),
)

# --- Reglas para las frases en español ---

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

# Palabras de programación en español: ningún modo de la versión 1 debe incluir nada de eso.
PROGRAMACION_ES = re.compile(
    # Lista de palabras prohibidas, separadas por barras verticales.
    r"\b(python|java|javascript|html|css|linux|windows|programar|programación|programador|"
    # Continuación de la lista.
    r"programadora|programadores|código|software|servidor|algoritmo|compilador)\b",
    # Da igual si están en mayúsculas o minúsculas.
    re.IGNORECASE,
)

# --- Reglas para las frases en inglés ---

# Forma válida: empieza con mayúscula, usa letras sin tilde, espacios, signos básicos,
# apóstrofo (don't, Tom's) y guion, y termina en punto, interrogación o exclamación.
FORMA_INGLES = re.compile(r"^[A-Z][A-Za-z ,;:?!.'-]*[.?!]$")
# Un apóstrofo al principio de una palabra hace de comilla ('hello'): lo descartamos.
COMILLA_DE_APERTURA = re.compile(r"(^|\s)'")
# Un guion que no está entre dos letras hace de raya o de signo suelto: lo descartamos.
GUION_SUELTO = re.compile(r"(?<![A-Za-z])-|-(?![A-Za-z])")
# Palabras de programación en inglés (sin "windows", que también significa "ventanas").
PROGRAMACION_EN = re.compile(
    # Lista de palabras prohibidas, separadas por barras verticales.
    r"\b(python|java|javascript|html|css|linux|programming|programmer|programmers|program|programs|"
    # Continuación de la lista.
    r"code|codes|coding|software|server|servers|algorithm|algorithms|compiler)\b",
    # Da igual si están en mayúsculas o minúsculas.
    re.IGNORECASE,
)

# Etiquetas de Tatoeba que indican un problema: las que empiezan por "@" (avisos de revisión,
# como "@check" o "@needs native check") y las de contenido inadecuado o poco fiable.
ETIQUETA_PROBLEMATICA = re.compile(
    # Avisos de revisión y contenido inadecuado.
    r"^@|vulgar|sex|offens|rude|insult|obscen|profan|swear|racis|drug|violen|terror|"
    # Frases antiguas, poco naturales o marcadas como incorrectas.
    r"archaic|unnatural|incorrect|wrong|dubious|check|change|delete",
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
    """Devuelve {idioma: usuarios nativos} para el español ("spa") y el inglés ("eng")."""
    # Un conjunto vacío por idioma.
    nativos = {"spa": set(), "eng": set()}
    # Abrimos el archivo como texto en UTF-8.
    with open(ruta, encoding="utf-8") as archivo:
        # Recorremos el archivo línea por línea.
        for linea in archivo:
            # Cada línea tiene: idioma, nivel, usuario y detalles, separados por tabuladores.
            partes = linea.rstrip("\n").split("\t")
            # Nos quedamos con los usuarios de nivel 5 en español o inglés.
            if len(partes) >= 3 and partes[0] in nativos and partes[1] == "5":
                # Guardamos su nombre de usuario en el idioma correspondiente.
                nativos[partes[0]].add(partes[2])
    # Devolvemos los dos conjuntos.
    return nativos


def leer_frases(ruta, solo=None):
    """Devuelve {número de frase: (texto, autor)}. Si se indica "solo", lee únicamente esos números."""
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
            # Convertimos el número de frase de texto a número.
            numero = int(partes[0])
            # Si solo queremos algunas frases y esta no está entre ellas, la saltamos.
            if solo is not None and numero not in solo:
                # Pasamos a la siguiente línea.
                continue
            # Normalizamos el texto para que "á" sea siempre un único carácter.
            texto = unicodedata.normalize("NFC", partes[2])
            # Tatoeba escribe "\N" cuando una frase no tiene autor; lo dejamos vacío.
            autor = "" if partes[3] == "\\N" else partes[3]
            # Guardamos el texto y el autor bajo el número de la frase.
            frases[numero] = (texto, autor)
    # Devolvemos todas las frases leídas.
    return frases


def leer_enlaces(ruta):
    """Devuelve {número de frase en inglés: [números de sus traducciones al español]}."""
    # Diccionario vacío de enlaces.
    enlaces = {}
    # Abrimos el archivo comprimido como texto.
    with bz2.open(ruta, "rt", encoding="utf-8") as archivo:
        # Recorremos el archivo línea por línea.
        for linea in archivo:
            # Cada línea tiene: número en inglés y número en español.
            partes = linea.split()
            # Saltamos líneas raras.
            if len(partes) != 2 or not partes[0].isdigit() or not partes[1].isdigit():
                # Pasamos a la siguiente línea.
                continue
            # Añadimos la traducción a la lista de esa frase en inglés.
            enlaces.setdefault(int(partes[0]), []).append(int(partes[1]))
    # Devolvemos los enlaces.
    return enlaces


def leer_etiquetadas(rutas):
    """Devuelve los números de las frases que tienen alguna etiqueta problemática."""
    # Conjunto vacío de frases descartadas por etiqueta.
    etiquetadas = set()
    # Recorremos cada archivo de etiquetas (uno por idioma).
    for ruta in rutas:
        # Abrimos el archivo comprimido como texto.
        with bz2.open(ruta, "rt", encoding="utf-8") as archivo:
            # Recorremos el archivo línea por línea.
            for linea in archivo:
                # Cada línea tiene: número de frase y nombre de la etiqueta.
                partes = linea.rstrip("\n").split("\t")
                # Si la etiqueta es problemática, apuntamos la frase.
                if len(partes) >= 2 and partes[0].isdigit() and ETIQUETA_PROBLEMATICA.search(partes[1]):
                    # Guardamos su número.
                    etiquetadas.add(int(partes[0]))
    # Devolvemos el conjunto.
    return etiquetadas


def leer_revisiones(ruta, autores):
    """Devuelve (aprobadas, dudosas) según las revisiones de los usuarios.

    autores: {número de frase: autor} de las frases que nos interesan.
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
            # Si la frase no nos interesa, saltamos esta revisión.
            if numero not in autores:
                # Pasamos a la siguiente línea.
                continue
            # Separamos quién revisó y qué opinó.
            usuario, revision = partes[0], partes[2]
            # -1 significa "incorrecta" y 0 significa "no estoy seguro": la descartamos.
            if revision in ("-1", "0"):
                # La anotamos como dudosa.
                dudosas.add(numero)
            # 1 significa "correcta"; solo cuenta si quien la revisa no es el propio autor.
            elif revision == "1" and usuario != autores[numero]:
                # Añadimos a esta persona a la lista de quienes aprobaron la frase.
                aprobadas.setdefault(numero, set()).add(usuario)
    # Devolvemos los dos resultados.
    return aprobadas, dudosas


def motivo_de_rechazo(texto):
    """Devuelve por qué una frase en español no sirve para el juego, o None si sirve."""
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
    if PROGRAMACION_ES.search(texto):
        # Explicamos el motivo.
        return "programacion"
    # Si pasó todas las pruebas, la frase sirve.
    return None


def motivo_de_rechazo_ingles(texto):
    """Devuelve por qué una frase en inglés no sirve para el juego, o None si sirve."""
    # Comprobamos que la frase no sea ni demasiado corta ni demasiado larga.
    if not LARGO_MINIMO <= len(texto) <= LARGO_MAXIMO:
        # Explicamos el motivo.
        return "largo"
    # Comprobamos que solo use caracteres permitidos y empiece y termine bien.
    if not FORMA_INGLES.match(texto):
        # Explicamos el motivo.
        return "caracteres"
    # Comprobamos que no haya espacios dobles ni espacios mal puestos junto a los signos.
    if "  " in texto or ESPACIO_ANTES_DE_SIGNO.search(texto) or SIGNO_SIN_ESPACIO.search(texto):
        # Explicamos el motivo.
        return "espacios"
    # Comprobamos que el apóstrofo no se use como comilla.
    if COMILLA_DE_APERTURA.search(texto):
        # Explicamos el motivo.
        return "comillas"
    # Comprobamos que los guiones estén entre letras (well-known), no sueltos.
    if GUION_SUELTO.search(texto):
        # Explicamos el motivo.
        return "guiones"
    # Comprobamos que no hable de programación.
    if PROGRAMACION_EN.search(texto):
        # Explicamos el motivo.
        return "programacion"
    # Si pasó todas las pruebas, la frase sirve.
    return None


def es_fiable(numero, autor, nativos, aprobadas, dudosas, etiquetadas):
    """Dice si una frase es fiable: sin marcas negativas ni etiquetas problemáticas,
    y escrita o aprobada por al menos un hablante nativo de su idioma."""
    # Si alguien la marcó como incorrecta o dudosa, no es fiable.
    if numero in dudosas:
        # No sirve.
        return False
    # Si tiene una etiqueta problemática, tampoco.
    if numero in etiquetadas:
        # No sirve.
        return False
    # Sirve si la escribió un nativo o si la aprobó al menos un nativo.
    return autor in nativos or bool(aprobadas.get(numero, set()) & nativos)


def contar(contador, motivo):
    """Suma uno al contador de un motivo de rechazo."""
    # Si el motivo no estaba, empieza en 0; luego sumamos 1.
    contador[motivo] = contador.get(motivo, 0) + 1


def elegir_espanol(espanol, nativos, aprobadas, dudosas, etiquetadas):
    """Elige las frases del modo ortografía. Devuelve (elegidas, motivos de rechazo)."""
    # Lista de frases elegidas.
    elegidas = []
    # Contador de motivos de rechazo.
    rechazos = {}
    # Textos ya elegidos, para no meter dos veces la misma frase.
    vistos = set()
    # Solo valen las frases que otra persona aprobó, en orden de número.
    for numero in sorted(n for n in aprobadas if n in espanol):
        # Sacamos el texto y el autor de la frase.
        texto, autor = espanol[numero]
        # Tiene que ser fiable en español.
        if not es_fiable(numero, autor, nativos["spa"], aprobadas, dudosas, etiquetadas):
            # Contamos el motivo y pasamos a la siguiente.
            contar(rechazos, "poco fiable")
            continue
        # Revisamos la forma de la frase.
        motivo = motivo_de_rechazo(texto)
        # Si hay un motivo de rechazo, la descartamos.
        if motivo:
            # Contamos el motivo y pasamos a la siguiente.
            contar(rechazos, motivo)
            continue
        # Si ya tenemos una frase con el mismo texto, no la repetimos.
        if texto in vistos:
            # Contamos el motivo y pasamos a la siguiente.
            contar(rechazos, "repetida")
            continue
        # Recordamos este texto.
        vistos.add(texto)
        # La frase pasó todos los filtros: la guardamos.
        elegidas.append((numero, texto, autor))
    # Devolvemos el resultado.
    return elegidas, rechazos


def elegir_ingles(ingles, espanol, enlaces, nativos, aprobadas, dudosas, etiquetadas):
    """Elige las parejas del modo inglés. Devuelve (elegidas, motivos de rechazo)."""
    # Parejas candidatas, con su prioridad.
    candidatas = []
    # Contador de motivos de rechazo.
    rechazos = {}
    # Textos en inglés ya elegidos.
    vistos = set()
    # Recorremos las frases en inglés que tienen traducción, en orden de número.
    for numero in sorted(n for n in enlaces if n in ingles):
        # Sacamos el texto y el autor.
        texto, autor = ingles[numero]
        # La frase en inglés tiene que estar aprobada por otra persona.
        if numero not in aprobadas:
            # Contamos el motivo y pasamos a la siguiente.
            contar(rechazos, "sin revisar")
            continue
        # Y ser fiable en inglés.
        if not es_fiable(numero, autor, nativos["eng"], aprobadas, dudosas, etiquetadas):
            # Contamos el motivo y pasamos a la siguiente.
            contar(rechazos, "poco fiable")
            continue
        # Revisamos su forma.
        motivo = motivo_de_rechazo_ingles(texto)
        # Si hay un motivo de rechazo, la descartamos.
        if motivo:
            # Contamos el motivo y pasamos a la siguiente.
            contar(rechazos, motivo)
            continue
        # No repetimos textos.
        if texto in vistos:
            # Contamos el motivo y pasamos a la siguiente.
            contar(rechazos, "repetida")
            continue
        # Buscamos sus traducciones al español que sean fiables y estén bien escritas.
        traducciones = [
            # Número de la traducción.
            otro
            # Recorriendo todas las traducciones enlazadas.
            for otro in enlaces[numero]
            # Que exista en español, sea fiable y cumpla las reglas de ortografía.
            if otro in espanol
            and es_fiable(otro, espanol[otro][1], nativos["spa"], aprobadas, dudosas, etiquetadas)
            and motivo_de_rechazo(espanol[otro][0]) is None
        ]
        # Si no queda ninguna traducción buena, descartamos la pareja.
        if not traducciones:
            # Contamos el motivo y pasamos a la siguiente.
            contar(rechazos, "sin traducción buena")
            continue
        # Preferimos la traducción aprobada por otra persona y, después, la más antigua.
        mejor = min(traducciones, key=lambda otro: (otro not in aprobadas, otro))
        # Recordamos este texto en inglés.
        vistos.add(texto)
        # Prioridad: primero las parejas con las dos frases revisadas, luego las más revisadas.
        prioridad = (mejor in aprobadas, len(aprobadas[numero]))
        # Guardamos la candidata.
        candidatas.append((prioridad, numero, texto, autor, mejor, *espanol[mejor]))
    # Lista final de parejas.
    elegidas = []
    # Llenamos cada tramo de largo con su cupo.
    for minimo, maximo, cupo in CUPOS_INGLES:
        # Candidatas de este largo.
        del_tramo = [c for c in candidatas if minimo <= len(c[2]) <= maximo]
        # Las ordenamos: más prioridad primero y, a igual prioridad, número más bajo.
        del_tramo.sort(key=lambda c: (not c[0][0], -c[0][1], c[1]))
        # Nos quedamos con las primeras, sin la prioridad.
        elegidas.extend(c[1:] for c in del_tramo[:cupo])
    # Las ordenamos por número de frase en inglés.
    elegidas.sort()
    # Devolvemos el resultado.
    return elegidas, rechazos


def escribir_salida(ruta, variable, filas, formato):
    """Escribe un archivo .js con una lista de frases guardada en window.<variable>."""
    # Creamos la carpeta "datos" si todavía no existe.
    ruta.parent.mkdir(parents=True, exist_ok=True)
    # Primeras líneas del archivo: explicación, fecha, licencia y formato.
    lineas = [
        # Aviso de que el archivo se genera solo.
        "// Archivo generado por herramientas/preparar_frases.py. No lo edites a mano: vuelve a ejecutar el script.",
        # Fecha de generación y cantidad de frases.
        f"// Generado el {date.today().isoformat()} con {len(filas)} frases.",
        # Origen y licencia de las frases.
        "// Frases de Tatoeba (https://tatoeba.org), con licencia CC BY 2.0 FR (https://creativecommons.org/licenses/by/2.0/fr/).",
        # Formato de cada entrada.
        f"// Cada frase es una lista: {formato}.",
        # Comienzo de la lista, guardada como variable global para que el juego la encuentre.
        f"window.{variable} = [",
    ]
    # Recorremos las filas una por una.
    for fila in filas:
        # Cada frase va en su propia línea, con las tildes tal cual (ensure_ascii=False).
        lineas.append("  " + json.dumps(list(fila), ensure_ascii=False) + ",")
    # Cerramos la lista.
    lineas.append("];")
    # Guardamos el archivo en UTF-8, con un salto de línea al final.
    ruta.write_text("\n".join(lineas) + "\n", encoding="utf-8")
    # Avisamos del resultado.
    print(f"    {len(filas)} frases guardadas en {ruta.relative_to(RAIZ)}")


def main():
    """Descarga, filtra y guarda las frases de los dos modos."""
    # Nos aseguramos de que los mensajes con tildes se vean bien en cualquier consola.
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    # Preparamos el lector de opciones de la línea de comandos.
    lector = argparse.ArgumentParser(description="Prepara las frases de los modos ortografía e inglés a partir de Tatoeba.")
    # Añadimos la opción --refrescar.
    lector.add_argument("--refrescar", action="store_true", help="vuelve a descargar los archivos aunque ya estén guardados")
    # Leemos las opciones escritas por la persona.
    opciones = lector.parse_args()

    # Paso 1: descargar lo que haga falta.
    print("1/5 Descargando datos de Tatoeba (la primera vez son unos 150 MB)...")
    # Descargamos cada archivo y guardamos su ruta local.
    rutas = {nombre: descargar(nombre, remota, opciones.refrescar) for nombre, remota in ARCHIVOS.items()}

    # Paso 2: leer frases, enlaces, usuarios y etiquetas.
    print("2/5 Leyendo frases, traducciones, usuarios y etiquetas...")
    # Leemos quién es hablante nativo de español y de inglés.
    nativos = leer_nativos(rutas["user_languages.csv"])
    # Leemos las traducciones inglés -> español.
    enlaces = leer_enlaces(rutas["eng-spa_links.tsv.bz2"])
    # Leemos todas las frases en español.
    espanol = leer_frases(rutas["spa_sentences_detailed.tsv.bz2"])
    # Leemos solo las frases en inglés que tienen traducción al español (así ocupa menos memoria).
    ingles = leer_frases(rutas["eng_sentences_detailed.tsv.bz2"], solo=set(enlaces))
    # Leemos las frases con etiquetas problemáticas en los dos idiomas.
    etiquetadas = leer_etiquetadas([rutas["spa_tags.tsv.bz2"], rutas["eng_tags.tsv.bz2"]])
    # Mostramos un resumen.
    print(f"    {len(espanol)} frases en español, {len(ingles)} en inglés con traducción, {len(etiquetadas)} etiquetadas como problemáticas.")

    # Paso 3: leer las revisiones de las frases de los dos idiomas.
    print("3/5 Leyendo revisiones...")
    # Autor de cada frase que nos interesa, en los dos idiomas.
    autores = {numero: autor for frases in (espanol, ingles) for numero, (_, autor) in frases.items()}
    # Separamos las frases aprobadas de las dudosas.
    aprobadas, dudosas = leer_revisiones(rutas["users_sentences.csv"], autores)

    # Paso 4: modo ortografía.
    print("4/5 Eligiendo frases en español (modo ortografía)...")
    # Filtramos.
    elegidas_es, rechazos_es = elegir_espanol(espanol, nativos, aprobadas, dudosas, etiquetadas)
    # Mostramos los motivos de rechazo.
    print(f"    Descartadas: {rechazos_es}")

    # Paso 5: modo inglés.
    print("5/5 Eligiendo parejas inglés-español (modo inglés)...")
    # Filtramos.
    elegidas_en, rechazos_en = elegir_ingles(ingles, espanol, enlaces, nativos, aprobadas, dudosas, etiquetadas)
    # Mostramos los motivos de rechazo.
    print(f"    Descartadas: {rechazos_en}")

    # Si algún modo se quedó sin frases, algo va mal: terminamos con un error sin escribir nada.
    if not elegidas_es or not elegidas_en:
        # Mensaje de error y salida.
        sys.exit("Algún modo se quedó sin frases. Revisa los filtros o vuelve a descargar con --refrescar.")
    # Escribimos el archivo del modo ortografía.
    escribir_salida(SALIDA_ES, "FRASES_ES", elegidas_es, "[número de la frase en Tatoeba, texto, autor]")
    # Escribimos el archivo del modo inglés.
    escribir_salida(
        # Ruta del archivo.
        SALIDA_EN,
        # Nombre de la variable global.
        "FRASES_EN",
        # Parejas elegidas.
        elegidas_en,
        # Formato de cada pareja.
        "[número en inglés, frase en inglés, autor, número en español, traducción, autor de la traducción]",
    )
    # Mensaje final.
    print("Listo.")


# Solo ejecutamos main() si el script se lanza directamente (no si se importa desde otro).
if __name__ == "__main__":
    # Arrancamos el programa.
    main()
