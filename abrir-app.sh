#!/usr/bin/env bash
# abrir-app.sh: abre Frase Exacta como aplicación a pantalla completa (sin barras del navegador),
# directamente desde la carpeta descargada, sin instalar nada. Para Mac y Linux.
# Uso: bash abrir-app.sh   (o doble clic si tu sistema lo permite)
# Necesita Google Chrome, Chromium, Microsoft Edge o Brave. Si no hay ninguno, abre el juego en el navegador normal.

# Carpeta donde está este archivo (la del juego), aunque se ejecute desde otro sitio.
CARPETA="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# Dirección del juego como archivo local.
PAGINA="file://$CARPETA/index.html"
# Opciones del navegador: ventana de aplicación (sin barras) y a pantalla completa.
OPCIONES=(--app="$PAGINA" --start-fullscreen)

# En Mac, los navegadores están dentro de /Applications.
if [ "$(uname)" = "Darwin" ]; then
  # Recorremos los navegadores posibles, en orden de preferencia.
  for NAVEGADOR in "Google Chrome" "Microsoft Edge" "Chromium" "Brave Browser"; do
    # Ruta del programa dentro de la aplicación.
    PROGRAMA="/Applications/$NAVEGADOR.app/Contents/MacOS/$NAVEGADOR"
    # Si existe...
    if [ -x "$PROGRAMA" ]; then
      # ...lo abrimos en segundo plano y terminamos.
      "$PROGRAMA" "${OPCIONES[@]}" >/dev/null 2>&1 &
      # Salimos sin error.
      exit 0
    fi
  done
  # Sin ninguno de ellos, abrimos el juego con el navegador por defecto.
  open "$CARPETA/index.html"
  # Salimos sin error.
  exit 0
fi

# En Linux, buscamos los navegadores por su nombre de programa, en orden de preferencia.
for PROGRAMA in google-chrome google-chrome-stable chromium chromium-browser microsoft-edge microsoft-edge-stable brave-browser; do
  # Si el programa existe...
  if command -v "$PROGRAMA" >/dev/null 2>&1; then
    # ...lo abrimos en segundo plano y terminamos.
    "$PROGRAMA" "${OPCIONES[@]}" >/dev/null 2>&1 &
    # Salimos sin error.
    exit 0
  fi
done

# Sin ninguno de ellos, abrimos el juego con el navegador por defecto (pulsa F11 para pantalla completa).
xdg-open "$CARPETA/index.html" >/dev/null 2>&1 &
