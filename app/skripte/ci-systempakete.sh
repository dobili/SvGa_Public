#!/usr/bin/env bash
# Systempakete für einen Playwright-Browser in GitHub Actions, mit Ablage der Pakete.
#
# Rolle im Gesamtbild: Wird nur von .github/workflows/pruefen.yml (Job „Oberfläche“) aufgerufen.
# Warum: „playwright install --with-deps“ lud die Systempakete jedes Mal über den Ubuntu-Spiegel;
# der lieferte einzelne Pakete erst nach 30 Sekunden, der Schritt brauchte bis 6 Minuten und lief
# im Lauf 44382063747 einmal in die Grenze von 12 Minuten (18.11.2026). Deshalb liegen die
# geladenen .deb-Dateien im Actions-Cache (Schlüssel aus Runner-Abbild, Browser und
# Playwright-Version); ist die Ablage gefüllt, installiert dpkg sie ohne Netz in Sekunden.
# Eingaben: $1 Browser (chromium, webkit), $2 Ordner der Ablage (wird gefüllt, wenn leer).
# Ausgabe: Systempakete installiert; in der Ablage die .deb-Dateien und „fertig“ als Marke.
# Sonderfälle: Scheitert die Installation aus der Ablage (anderes Abbild), läuft der Weg übers
# Netz. Jeder Versuch übers Netz hat eine eigene Zeitgrenze und wird bis zu dreimal wiederholt.
set -euo pipefail

BROWSER="$1"
ABLAGE="$2"
VERSUCHE=3
ZEITGRENZE_SEKUNDEN=240
PAKETE=/var/cache/apt/archives

# Aus der Ablage installieren; gelingt das, ist nichts weiter zu tun.
if [ -f "$ABLAGE/fertig" ]; then
  if ! ls "$ABLAGE"/*.deb >/dev/null 2>&1; then
    echo "Ablage: keine Pakete nötig (alle schon im Abbild)."
    exit 0
  fi
  if sudo dpkg -i "$ABLAGE"/*.deb >/dev/null; then
    echo "Ablage: $(ls "$ABLAGE"/*.deb | wc -l) Pakete installiert."
    exit 0
  fi
  echo "::warning::Pakete aus der Ablage passten nicht, Weg übers Netz."
  sudo apt-get install -f -y >/dev/null || true
fi

# Übers Netz: apt soll hängende Downloads abbrechen und wiederholen statt zu warten, nach einem
# abgebrochenen Versuch auf die Sperre warten und die geladenen Pakete für die Ablage behalten.
sudo tee /etc/apt/apt.conf.d/80-wiederholen >/dev/null <<'APT'
Acquire::Retries "5";
Acquire::http::Timeout "30";
Acquire::https::Timeout "30";
DPkg::Lock::Timeout "120";
APT::Keep-Downloaded-Packages "true";
Binary::apt-get::APT::Keep-Downloaded-Packages "true";
APT
sudo rm -f "$PAKETE"/*.deb
for versuch in $(seq 1 "$VERSUCHE"); do
  echo "Systempakete übers Netz, Versuch $versuch von $VERSUCHE"
  # Ohne sudo: Playwright ruft apt selbst mit sudo auf (unter sudo fände es npx nicht).
  if timeout -k 10 "$ZEITGRENZE_SEKUNDEN" npx playwright install-deps "$BROWSER"; then
    mkdir -p "$ABLAGE"
    cp "$PAKETE"/*.deb "$ABLAGE"/ 2>/dev/null || true
    touch "$ABLAGE/fertig"
    echo "Ablage gefüllt: $(ls "$ABLAGE" | grep -c '\.deb$' || true) Pakete."
    exit 0
  fi
done
echo "::error::Systempakete nach $VERSUCHE Versuchen nicht installiert."
exit 1
