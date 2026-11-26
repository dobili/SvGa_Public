"""Bildaufträge der Mappe über die Gemini-Schnittstelle erzeugen (Schach-Abenteuer).

Zweck: Der Autor kam im Gemini-Chat ständig an das Tageslimit. Seit dem 26.11.2026 laufen die
Gemini-Aufträge der Mappe über die Schnittstelle von Google AI Studio, mit Ausgabengrenze im
Projekt. Der Stapelbetrieb (Batch API) kostet die Hälfte und liefert meist binnen Stunden.

Ablauf:
    python -m pipeline.abenteuer.geminibilder liste MAPPE VORLAGEN
    python -m pipeline.abenteuer.geminibilder probe MAPPE VORLAGEN B14 --ziel ORDNER
    python -m pipeline.abenteuer.geminibilder stapel MAPPE VORLAGEN --ziel ORDNER [--nur B14,K20]
    python -m pipeline.abenteuer.geminibilder abholen --ziel ORDNER
    python -m pipeline.abenteuer.geminibilder stapel MAPPE VORLAGEN --ziel ORDNER --schritt 2

Porträtblätter brauchen zwei Schritte wie im Chat: Schritt 1 malt das neutrale Porträt,
Schritt 2 bekommt es als Bild und malt das Blatt 3 × 2. Im Stapelbetrieb sind das zwei Stapel.
Ergebnisse: ORDNER/NR_schritt1.png, NR_schritt2.png; der Autor legt sie nach ki-roh/.

Schlüssel: Der Netzproxy der Cloud-Umgebung setzt den Kopf x-goog-api-key selbst (sichere
Eingabe, nie im Chat). Lokal liest das Werkzeug GEMINI_API_KEY. Ohne beides schickt es einen
Platzhalter, den der Proxy ersetzt.
"""

from __future__ import annotations

import argparse
import base64
import json
import os
import ssl
import sys
import urllib.request
from pathlib import Path

from pipeline.abenteuer.geminimappe import Auftrag, auftraege_lesen

BASIS = "https://generativelanguage.googleapis.com/v1beta"
# Wahl des Autors nach seinem Probebild in AI Studio (26.11.2026): Nano Banana 2.1, 1K
MODELL = "gemini-nano-banana-2.1"
AUFLOESUNG = "1K"
PLATZHALTER_SCHLUESSEL = "vom-proxy-gesetzt"
WARTEZEIT_SEKUNDEN = 300
# Inline-Stapel dürfen bis 20 MB groß sein; mit Abstand darunter bleiben
STAPEL_HOECHSTGROESSE = 15_000_000
SEITENVERHAELTNIS_PORTRAET = "1:1"
SEITENVERHAELTNIS_BLATT = "3:2"
SEITENVERHAELTNIS_GROSSBILD = "4:3"
STAPELDATEI = "stapel.json"


def _ssl_kontext() -> ssl.SSLContext:
    """Zertifikate der Umgebung (Proxy der Cloud-Umgebung) oder die des Systems."""
    datei = os.environ.get("SSL_CERT_FILE") or os.environ.get("REQUESTS_CA_BUNDLE")
    return ssl.create_default_context(cafile=datei) if datei else ssl.create_default_context()


def anfrage(methode: str, pfad: str, inhalt: dict | None = None) -> dict:
    """Eine Anfrage an die Schnittstelle; Fehler der Schnittstelle kommen mit Text zurück."""
    daten = json.dumps(inhalt).encode() if inhalt is not None else None
    kopf = {
        "Content-Type": "application/json",
        "x-goog-api-key": os.environ.get("GEMINI_API_KEY", PLATZHALTER_SCHLUESSEL),
    }
    req = urllib.request.Request(f"{BASIS}/{pfad}", data=daten, headers=kopf, method=methode)
    try:
        with urllib.request.urlopen(req, context=_ssl_kontext(), timeout=WARTEZEIT_SEKUNDEN) as a:
            return json.loads(a.read())
    except urllib.error.HTTPError as fehler:
        raise RuntimeError(f"Gemini {fehler.code}: {fehler.read().decode(errors='replace')}") from None


def _bildteil(png: bytes) -> dict:
    return {"inline_data": {"mime_type": "image/png", "data": base64.b64encode(png).decode()}}


def inhalt_fuer(auftrag: Auftrag, schritt: int, vorbild: bytes | None = None) -> dict:
    """Anfrage für einen Schritt eines Auftrags (generateContent).

    Schritt 1: Prompt mit den Vorlagen (Bild 1 Stilvorlage, Bild 2 Standbild).
    Schritt 2 (nur Porträts): Prompt mit dem fertigen Porträt aus Schritt 1.
    Beispiel: B14 Wren, Schritt 2: das Blatt 3 × 2 im Seitenverhältnis 3:2.
    """
    if schritt == 1:
        bilder = auftrag.vorlagen
    elif vorbild is None:
        raise ValueError(f"{auftrag.nr}: Schritt 2 braucht das Bild aus Schritt 1")
    else:
        bilder = [vorbild]
    teile = [_bildteil(b) for b in bilder] + [{"text": auftrag.schritte[schritt - 1]}]
    erzeugung: dict = {"responseModalities": ["TEXT", "IMAGE"], "imageConfig": {"imageSize": AUFLOESUNG}}
    if auftrag.ist_portraet:
        verhaeltnis = SEITENVERHAELTNIS_PORTRAET if schritt == 1 else SEITENVERHAELTNIS_BLATT
        erzeugung["imageConfig"]["aspectRatio"] = verhaeltnis
    elif "landscape 4:3" in auftrag.schritte[0]:
        # Großbilder im Dialog (Mappe: „FORMAT: one single image in landscape 4:3“)
        erzeugung["imageConfig"]["aspectRatio"] = SEITENVERHAELTNIS_GROSSBILD
    return {"contents": [{"role": "user", "parts": teile}], "generationConfig": erzeugung}


def bilder_aus_antwort(antwort: dict) -> list[bytes]:
    """Alle Bilder einer Antwort (REST schreibt inlineData, manche Wege inline_data)."""
    bilder = []
    for kandidat in antwort.get("candidates", []):
        for teil in kandidat.get("content", {}).get("parts", []):
            daten = teil.get("inlineData") or teil.get("inline_data")
            if daten:
                bilder.append(base64.b64decode(daten["data"]))
    return bilder


def _speichern(ziel: Path, nr: str, schritt: int, antwort: dict) -> bool:
    """Erstes Bild speichern; ohne Bild den Text der Antwort melden (etwa eine Ablehnung)."""
    bilder = bilder_aus_antwort(antwort)
    if not bilder:
        print(f"{nr} Schritt {schritt}: kein Bild. Antwort: {json.dumps(antwort)[:400]}")
        return False
    datei = ziel / f"{nr}_schritt{schritt}.png"
    datei.write_bytes(bilder[0])
    print(f"{nr} Schritt {schritt}: {datei}")
    return True


def probe(auftrag: Auftrag, ziel: Path, modell: str) -> None:
    """Ein Auftrag sofort (zum vollen Preis), alle Schritte hintereinander: der Probelauf."""
    vorbild = None
    for schritt in range(1, len(auftrag.schritte) + 1):
        inhalt = inhalt_fuer(auftrag, schritt, vorbild)
        antwort = anfrage("POST", f"models/{modell}:generateContent", inhalt)
        if not _speichern(ziel, auftrag.nr, schritt, antwort):
            return
        vorbild = (ziel / f"{auftrag.nr}_schritt{schritt}.png").read_bytes()


def _stapel_teilen(eintraege: list[dict]) -> list[list[dict]]:
    """Inline-Stapel unter der Größengrenze halten."""
    teile: list[list[dict]] = [[]]
    groesse = 0
    for eintrag in eintraege:
        laenge = len(json.dumps(eintrag))
        if teile[-1] and groesse + laenge > STAPEL_HOECHSTGROESSE:
            teile.append([])
            groesse = 0
        teile[-1].append(eintrag)
        groesse += laenge
    return [t for t in teile if t]


def stapel_eintraege(auftraege: list[Auftrag], ziel: Path, schritt: int) -> list[dict]:
    """Einträge eines Stapels; Schritt 2 nur für Porträts, deren Schritt 1 schon da ist."""
    eintraege = []
    for a in auftraege:
        if schritt > len(a.schritte) or (ziel / f"{a.nr}_schritt{schritt}.png").exists():
            continue
        vorbild = None
        if schritt == 2:
            datei = ziel / f"{a.nr}_schritt1.png"
            if not datei.exists():
                print(f"{a.nr}: Schritt 1 fehlt noch, Schritt 2 wartet")
                continue
            vorbild = datei.read_bytes()
        eintraege.append({"request": inhalt_fuer(a, schritt, vorbild), "metadata": {"key": a.nr}})
    return eintraege


def stapel_schicken(eintraege: list[dict], ziel: Path, schritt: int, modell: str) -> None:
    """Stapel anlegen und ihre Namen in ZIEL/stapel.json merken (für »abholen«)."""
    merker = _merker_lesen(ziel)
    for nummer, teil in enumerate(_stapel_teilen(eintraege), 1):
        inhalt = {
            "batch": {
                "display_name": f"mappe-schritt{schritt}-{nummer}",
                "input_config": {"requests": {"requests": teil}},
            }
        }
        antwort = anfrage("POST", f"models/{modell}:batchGenerateContent", inhalt)
        name = antwort["name"]
        merker.append(
            {
                "name": name,
                "schritt": schritt,
                "fertig": False,
                "nummern": [e["metadata"]["key"] for e in teil],
            }
        )
        print(f"Stapel {name}: {len(teil)} Aufträge (Schritt {schritt})")
    (ziel / STAPELDATEI).write_text(json.dumps(merker, indent=2), encoding="utf-8")


def _merker_lesen(ziel: Path) -> list[dict]:
    datei = ziel / STAPELDATEI
    return json.loads(datei.read_text(encoding="utf-8")) if datei.exists() else []


def _suche(daten: object, schluessel: str) -> object:
    """Ersten Wert zu einem Schlüssel in verschachtelten Antworten (Lage je Version anders)."""
    if isinstance(daten, dict):
        if schluessel in daten:
            return daten[schluessel]
        for wert in daten.values():
            fund = _suche(wert, schluessel)
            if fund is not None:
                return fund
    if isinstance(daten, list):
        for wert in daten:
            fund = _suche(wert, schluessel)
            if fund is not None:
                return fund
    return None


def abholen(ziel: Path) -> None:
    """Stand aller gemerkten Stapel; fertige Ergebnisse als Bilder speichern."""
    merker = _merker_lesen(ziel)
    for stapel in (s for s in merker if not s["fertig"]):
        antwort = anfrage("GET", stapel["name"])
        zustand = _suche(antwort, "state")
        print(f"{stapel['name']}: {zustand}")
        if zustand not in ("BATCH_STATE_SUCCEEDED", "JOB_STATE_SUCCEEDED"):
            continue
        ergebnisse = _suche(antwort, "inlinedResponses")
        if isinstance(ergebnisse, dict):
            ergebnisse = ergebnisse.get("inlinedResponses", [])
        for eintrag in ergebnisse or []:
            nr = eintrag.get("metadata", {}).get("key", "ohne-nummer")
            if "response" in eintrag:
                _speichern(ziel, nr, stapel["schritt"], eintrag["response"])
            else:
                print(f"{nr}: Fehler {json.dumps(eintrag.get('error'))[:300]}")
        stapel["fertig"] = True
    (ziel / STAPELDATEI).write_text(json.dumps(merker, indent=2), encoding="utf-8")


def _auswahl(auftraege: list[Auftrag], nur: str | None) -> list[Auftrag]:
    if not nur:
        return auftraege
    gewuenscht = set(nur.split(","))
    fehlend = gewuenscht - {a.nr for a in auftraege}
    if fehlend:
        raise SystemExit(f"Nicht in der Mappe: {', '.join(sorted(fehlend))}")
    return [a for a in auftraege if a.nr in gewuenscht]


def main(argumente: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    parser.add_argument("befehl", choices=["liste", "probe", "stapel", "abholen"])
    parser.add_argument("mappe", nargs="?", type=Path)
    parser.add_argument("vorlagen", nargs="?", type=Path)
    parser.add_argument("nummer", nargs="?")
    parser.add_argument("--ziel", type=Path, default=Path("buch/arbeit/gemini"))
    parser.add_argument("--nur")
    parser.add_argument("--schritt", type=int, default=1, choices=[1, 2])
    parser.add_argument("--modell", default=MODELL)
    a = parser.parse_args(argumente)
    a.ziel.mkdir(parents=True, exist_ok=True)
    if a.befehl == "abholen":
        abholen(a.ziel)
        return 0
    if not (a.mappe and a.vorlagen):
        parser.error("liste, probe und stapel brauchen MAPPE und VORLAGEN")
    auftraege = auftraege_lesen(a.mappe, a.vorlagen)
    if a.befehl == "liste":
        bilder = sum(len(x.schritte) for x in auftraege)
        for x in auftraege:
            print(f"{x.nr:8} {len(x.schritte)} Schritt(e), {len(x.vorlagen)} Vorlage(n)  {x.titel}")
        print(f"{len(auftraege)} Aufträge, {bilder} Bilder")
    elif a.befehl == "probe":
        if not a.nummer:
            parser.error("probe braucht eine Nummer, etwa B14")
        probe(_auswahl(auftraege, a.nummer)[0], a.ziel, a.modell)
    else:
        eintraege = stapel_eintraege(_auswahl(auftraege, a.nur), a.ziel, a.schritt)
        if eintraege:
            stapel_schicken(eintraege, a.ziel, a.schritt, a.modell)
        else:
            print("Nichts zu schicken")
    return 0


if __name__ == "__main__":
    sys.exit(main())
