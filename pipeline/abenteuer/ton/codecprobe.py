"""Befehl: Hörprobe AAC gegen Opus für das Handy des Autors (Auftrag „Größe und Startzeit“, 20.11.2026).

Warum: Ton ist 111 von 128 MB des Spielpakets. Opus spart bei gleicher hörbarer Qualität 20 bis
40 %, aber das iPhone dekodiert Opus über Web Audio (``decodeAudioData``, WebM) zuverlässig erst
ab iOS 17.4. Bevor Paketbau und Tonspieler umgebaut werden, hört der Autor am eigenen Handy:
Klingt Opus gleich gut, und spielt sein Gerät es überhaupt ab?

Die Probe ist streng gegen Opus: Die Opus-Fassungen entstehen aus den AAC-Dateien des Spiels, also
mit einem zweiten verlustbehafteten Schritt. Klingt Opus selbst so nicht schlechter, gilt das aus
den WAV-Dateien von ``musikbau`` erst recht. Opus läuft mit begrenzter variabler Bitrate (frei
überschoss es bei dieser Musik das Ziel um 35 %, Messung 20.11.2026), damit die Größen stimmen.
Die AAC-Fassung ist ein unveränderter Ausschnitt (``-c copy``), also genau das, was das Spiel heute
abspielt.

Die Seite spielt wie das Spiel über Web Audio; was das Gerät nicht dekodieren kann, meldet sie
beim Knopf. Ein Blindmodus mischt die Namen, damit man nicht nach dem Etikett urteilt.

Ins öffentliche Repository kommt nur dieses Werkzeug; Seite und Tonausschnitte entstehen aus dem
privaten Paket und gehören dorthin (``hoerprobe/``).

Aufruf (im Hauptordner; braucht ffmpeg mit libopus):
    python -m pipeline.abenteuer.ton.codecprobe PRIVAT ZIEL
    # PRIVAT: schach-abenteuer-inhalte, ZIEL: etwa PRIVAT/hoerprobe
"""

from __future__ import annotations

import argparse
import html
import json
import subprocess
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class Probe:
    """Ein Ausschnitt: Quelle unter ``spiel/``, Beginn und Länge in Sekunden, Opus-Bitraten."""

    kennung: str
    titel: str
    quelle: str
    beginn: float
    dauer: float
    opus: tuple[str, ...]


# Drei Stücke verschiedener Art und ein Geräusch in Stereo (AAC 80 kbit/s Musik, 64 kbit/s Geräusch).
PROBEN = (
    Probe("maple", "Maple Falls (Akt 1, Thema)", "musik/maple-falls.m4a", 10, 20, ("64k", "48k")),
    Probe("cello", "Ambrose, Cello (Akt 2, leise)", "musik/akt2/ambrose.cello.m4a", 5, 20, ("64k", "48k")),
    Probe("abspann", "Abspann (Akt 4, voll)", "musik/akt4/abspann.m4a", 30, 20, ("64k", "48k")),
    Probe("fluss", "Geräusch: Fluss (Stereo)", "klang/fluss.m4a", 5, 15, ("40k", "32k")),
)


def befehle(probe: Probe, spiel: Path, ziel: Path) -> list[list[str]]:
    """Die ffmpeg-Befehle einer Probe: AAC-Ausschnitt unverändert, dann je Bitrate Opus in WebM."""
    quelle = str(spiel / probe.quelle)
    zeit = ["-ss", str(probe.beginn), "-t", str(probe.dauer)]
    basis = ["ffmpeg", "-y", "-loglevel", "error", *zeit, "-i", quelle]
    liste = [[*basis, "-c", "copy", str(ziel / f"{probe.kennung}-aac.m4a")]]
    for rate in probe.opus:
        aus = ziel / f"{probe.kennung}-opus{rate}.webm"
        liste.append([*basis, "-c:a", "libopus", "-b:a", rate, "-vbr", "constrained", str(aus)])
    return liste


def fassungen(probe: Probe) -> list[tuple[str, str]]:
    """Name und Datei je Fassung. Beispiel: [("AAC 80k (heute)", "maple-aac.m4a"), …]."""
    heute = "AAC 64k (heute)" if probe.quelle.startswith("klang/") else "AAC 80k (heute)"
    return [(heute, f"{probe.kennung}-aac.m4a")] + [
        (f"Opus {rate}", f"{probe.kennung}-opus{rate}.webm") for rate in probe.opus
    ]


SKRIPT = """
const ctx = new (window.AudioContext || window.webkitAudioContext)();
let laeuft = null;
document.getElementById("geraet").textContent = navigator.userAgent;
async function spiele(knopf) {
  if (laeuft) { laeuft.stop(); laeuft = null; }
  await ctx.resume();
  const melde = knopf.closest(".probe").querySelector(".meldung");
  try {
    const roh = await (await fetch(knopf.dataset.datei)).arrayBuffer();
    const puffer = await ctx.decodeAudioData(roh);
    const quelle = ctx.createBufferSource();
    quelle.buffer = puffer; quelle.connect(ctx.destination); quelle.start(); laeuft = quelle;
    melde.textContent = "";
  } catch (fehler) {
    melde.textContent = "Kann dieses Gerät nicht abspielen (" + fehler.name + ")";
  }
}
function halt() { if (laeuft) { laeuft.stop(); laeuft = null; } }
function blind() {
  for (const zeile of document.querySelectorAll(".probe")) {
    const teile = [...zeile.querySelectorAll(".fassung")];
    teile.sort(() => Math.random() - 0.5).forEach((t, i) => {
      t.querySelector("button").textContent = "Fassung " + "XYZW"[i];
      zeile.querySelector(".knoepfe").append(t);
    });
  }
  document.body.classList.add("blind");
  document.getElementById("aufloesen").hidden = false;
}
function aufloesen() {
  for (const k of document.querySelectorAll("button.spiel")) k.textContent = k.dataset.name;
  document.body.classList.remove("blind");
}
"""


def seite(proben: tuple[Probe, ...], groessen: dict[str, int]) -> str:
    """Die HTML-Seite mit Knöpfen je Fassung und der Größe der Dateien (KB)."""
    zeilen = []
    for probe in proben:
        knoepfe = "".join(
            f'<span class="fassung"><button class="spiel" data-datei="{datei}" '
            f'data-name="{html.escape(name)}" onclick="spiele(this)">{html.escape(name)}</button>'
            f"<small>{round(groessen.get(datei, 0) / 1024)} KB</small></span>"
            for name, datei in fassungen(probe)
        )
        zeilen.append(
            f'<section class="probe"><h2>{html.escape(probe.titel)}</h2>'
            f'<div class="knoepfe">{knoepfe}</div><p class="meldung"></p></section>'
        )
    return (
        '<!doctype html><html lang="de"><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width, initial-scale=1">'
        "<title>Hörprobe AAC und Opus</title><style>"
        "body{font:17px system-ui;margin:16px;max-width:40em}"
        "button{font:inherit;margin:4px;padding:10px 14px}"
        "small{color:#666;margin-right:12px}.blind small{visibility:hidden}.meldung{color:#b00}"
        ".fassung{display:inline-block}</style></head><body>"
        "<h1>Hörprobe: heutiges Format gegen Opus</h1>"
        "<p>Bitte mit Kopfhörern hören. Je Ausschnitt die Fassungen vergleichen: Klingt Opus hörbar "
        "schlechter (dumpfer, zischelnd, verwaschen)? Meldet ein Knopf „Kann dieses Gerät nicht "
        "abspielen“, kann das Handy Opus im Spiel nicht nutzen; das ist die wichtigste Antwort.</p>"
        '<p><button onclick="blind()">Blind hören (Namen mischen)</button>'
        '<button id="aufloesen" hidden onclick="aufloesen()">Auflösen</button>'
        '<button onclick="halt()">Stopp</button></p>'
        + "".join(zeilen)
        + '<p><small>Gerät: <span id="geraet"></span></small></p>'
        + f"<script>{SKRIPT}</script></body></html>\n"
    )


def baue(privat: Path, ziel: Path) -> dict[str, int]:
    """Schreibt Ausschnitte und Seite nach ``ziel``; Ausgabe: Dateiname → Bytes."""
    spiel = privat / "spiel" if (privat / "spiel").is_dir() else privat
    ziel.mkdir(parents=True, exist_ok=True)
    for probe in PROBEN:
        for befehl in befehle(probe, spiel, ziel):
            subprocess.run(befehl, check=True)
    groessen = {d.name: d.stat().st_size for d in sorted(ziel.iterdir()) if d.suffix in (".m4a", ".webm")}
    (ziel / "index.html").write_text(seite(PROBEN, groessen), encoding="utf-8")
    return groessen


def main() -> None:
    """Befehlszeile; Aufruf und Zweck im Dateikopf."""
    teile = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    teile.add_argument("privat", type=Path, help="Pfad zu schach-abenteuer-inhalte")
    teile.add_argument("ziel", type=Path, help="Ordner für Seite und Ausschnitte")
    args = teile.parse_args()
    groessen = baue(args.privat, args.ziel)
    print(json.dumps(groessen, indent=1))
    print(f"Summe {sum(groessen.values()) / 1e6:.2f} MB, Seite: {args.ziel / 'index.html'}")


if __name__ == "__main__":
    main()
