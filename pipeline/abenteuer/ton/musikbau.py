"""Befehl: baut die Musik des Spiels aus den Satzplänen in das private Repository.

Warum: Die Tondateien bleiben privat wie die Grafik (``docs/spiel/28_Tonquellen.md``, Abschnitt 1);
der Paketbau liest sie aus ``spiel/musik/`` (Akt 1) und ``spiel/musik/akt2`` … ``akt4``
(``app/skripte/baue-abenteuerpaket.mjs``, ``kopiereTon``). Der Dateiname folgt der Regel der App
(``app/src/abenteuer/ton/tonplan.ts``, ``dateienFuer``): „mapleFalls.club“ wird
„maple-falls.club.m4a“. Ins öffentliche Repository kommen nur die Noten (Satzpläne) und dieses
Werkzeug; die MIDI-Dateien landen zum Nachhören und Bearbeiten in ``buch/arbeit/ton/midi``.

Neben die Musik schreibt der Befehl ``spiel/musik/einmal.json``: die Dateinamen ohne Endung aller
Stücke, die nicht als Schleife laufen (Satzplan ``schleife=False``: Erinnerung, Walzer, Kurzmotive,
Abspann …). Der Paketbau übernimmt die Liste als ``musik/einmal.json``; der Tonspieler spielt diese
Stücke einmal und bleibt danach still (``app/src/abenteuer/ton/tonspieler.ts``).

Seit dem 22.11.2026 (Klangplan A0, A0.1, A0.6):
- Schleifen werden gleichmäßig laut gebaut (``gleichmaessig``: Verdichter, −18 LUFS, Begrenzer).
- Stücke mit ``Satz.spuren`` bekommen ihre Spuren daneben (``<stamm>.grund.m4a`` …, die Zusatzspur
  mono) und eine ``spiel/musik/spuren.json`` mit Spuren, Art der Zusatzspur und Länge in
  Abtastwerten; die volle Mischung bleibt ``<stamm>.m4a`` für Fälle ohne Spuren.

Aufruf (im Hauptordner; braucht ffmpeg, fluidsynth, numpy und scipy):
    python -m pipeline.abenteuer.ton.musikbau PRIVAT [--nur mapleFalls diner] [--laden]
    python -m pipeline.abenteuer.ton.musikbau PRIVAT --nur-liste   # nur einmal.json, ohne Rendern
"""

import argparse
import json
import re
import subprocess
from pathlib import Path

from pipeline.abenteuer.ton.satzplan import Satz, baue
from pipeline.abenteuer.ton.stuecke import alle

PROBEN = Path("buch/arbeit/ton/proben")
MIDI = Path("buch/arbeit/ton/midi")
# AAC mit 80 kbit/s: für zwei bis vier Instrumente klar genug, hält das Paket klein (Klangplan Ü3).
BITRATE = "80k"
# Ziel der mittleren Lautheit (RMS) in dBFS, damit alle Stücke gleich laut wirken.
ZIEL_RMS_DB = -20.0
SPITZE_DB = -1.0


def dateiname(kennung: str) -> str:
    """Name im Paket wie in der App. Beispiel: „mapleFalls.club“ → „maple-falls.club.m4a“."""
    return re.sub(r"[A-Z]", lambda b: f"-{b.group().lower()}", kennung) + ".m4a"


def stamm(kennung: str) -> str:
    """Dateiname ohne Endung, wie ``einmal.json`` ihn führt.

    Beispiel: „mapleFalls.club“ → „maple-falls.club“.
    """
    return dateiname(kennung).removesuffix(".m4a")


EINMALLISTE = "einmal.json"
SPURENLISTE = "spuren.json"
LUFS = "lufs"
# Abtastrate der gerenderten Musik (wie sampler.ABTASTRATE; ohne numpy lesbar, für spuren.json).
SPUREN_RATE = 44_100
# Die Spur, die mono geschrieben wird (Musiker, Jukebox, Steigerung; die App verortet sie).
ZUSATZ = "zusatz"


def einmalliste(plaene: list[Satz]) -> list[str]:
    """Die Stämme der Stücke ohne Schleife, sortiert. Beispiel: ``["abspann", "ambrose.walzer", …]``."""
    return sorted({stamm(s.kennung) for s in plaene if not s.schleife})


def schreibe_einmalliste(privat: Path, plaene: list[Satz]) -> Path:
    """Schreibt ``spiel/musik/einmal.json`` (immer aus allen Plänen, auch bei ``--nur``).

    Warum eine Datei für alle Akte: Der Paketbau legt die Musik aller Akte flach in ``musik/``;
    die Namen sind eindeutig (``test_kennungen_sind_eindeutig``).
    """
    ziel = privat / "spiel" / "musik" / EINMALLISTE
    ziel.parent.mkdir(parents=True, exist_ok=True)
    ziel.write_text(json.dumps(einmalliste(plaene), ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    return ziel


def spurenliste(plaene: list[Satz]) -> dict[str, dict[str, object]]:
    """Stücke mit Spuren für die App: Stamm → Spuren, Art der Zusatzspur, Länge in Abtastwerten.

    Beispiel: {"maple-falls": {"spuren": ["grund", "melodie", "zusatz"], "zusatz": "farbe",
    "proben": 2205000, "rate": 44100}}. Die Länge gilt für loopStart/loopEnd (AAC-Vorlauf).
    """
    liste = {}
    for satz in plaene:
        if satz.spuren:
            stueck = baue(satz)
            proben = int(stueck.sekunden(stueck.ende()) * SPUREN_RATE)
            liste[stamm(satz.kennung)] = {
                "spuren": list(satz.spuren),
                "zusatz": satz.zusatz,
                "proben": proben,
                "rate": SPUREN_RATE,
            }
    return dict(sorted(liste.items()))


def schreibe_spurenliste(privat: Path, plaene: list[Satz]) -> Path:
    """Schreibt ``spiel/musik/spuren.json`` (immer aus allen Plänen, wie einmal.json)."""
    ziel = privat / "spiel" / "musik" / SPURENLISTE
    ziel.parent.mkdir(parents=True, exist_ok=True)
    liste = spurenliste(plaene)
    # Gemessene Lautheit früherer Läufe bleibt (trage_lautheit_ein), solange das Stück Spuren hat.
    alt = json.loads(ziel.read_text(encoding="utf-8")) if ziel.exists() else {}
    for name, eintrag in liste.items():
        if LUFS in alt.get(name, {}):
            eintrag[LUFS] = alt[name][LUFS]
    ziel.write_text(json.dumps(liste, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    return ziel


def trage_lautheit_ein(privat: Path, name: str, lufs: dict[str, float]) -> None:
    """Trägt die gemessene Lautheit je Mischung in spuren.json ein (für die Anhebung in der App).

    Schlüssel wie mit mittel-3 abgestimmt (22.11.2026): „grund“, „grund+melodie“,
    „grund+melodie+zusatz“. Beispiel: {"grund": -29.0, "grund+melodie": -18.3, …}.
    """
    ziel = privat / "spiel" / "musik" / SPURENLISTE
    liste = json.loads(ziel.read_text(encoding="utf-8")) if ziel.exists() else {}
    if name in liste:
        liste[name][LUFS] = lufs
        ziel.write_text(json.dumps(liste, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")


def zielordner(privat: Path, satz: Satz) -> Path:
    """Akt 1 direkt in spiel/musik/, spätere Akte in spiel/musik/aktN (werden nachgeladen).

    Der Paketbau liest private Dateien aus dem Unterordner ``spiel/`` des privaten Repositorys
    (``app/skripte/baue-abenteuerpaket.mjs``, ``PRIVAT``).
    """
    musik = privat / "spiel" / "musik"
    return musik if satz.akt == 1 else musik / f"akt{satz.akt}"


def angleichen(ton, pegel_db: float):  # noqa: ANN001, ANN201 (numpy nur zur Laufzeit)
    """Gleiche Lautheit für alle Stücke, Spitzen weich begrenzt. ``pegel_db`` hebt oder senkt bewusst."""
    import numpy as np

    rms = float(np.sqrt(np.mean(ton**2))) or 1e-9
    ton = ton * (10 ** ((ZIEL_RMS_DB + pegel_db) / 20) / rms)
    grenze = 10 ** (SPITZE_DB / 20)
    return np.tanh(ton / grenze) * grenze


# Kleiner Lautsprecher: Tiefen unter 250 Hz und Höhen über 3,5 kHz fallen weg (Klangplan A2, Diner).
LAUTSPRECHER_HZ = (250.0, 3500.0)
FILTER_ORDNUNG = 4


def klangbild(ton, art: str):  # noqa: ANN001, ANN201 (numpy nur zur Laufzeit)
    """Färbt den Klang nach ``Satz.klangbild``; ohne Angabe bleibt er unverändert."""
    if art != "lautsprecher":
        return ton
    from scipy.signal import butter, sosfilt

    from pipeline.abenteuer.ton.sampler import ABTASTRATE

    filter_ = butter(FILTER_ORDNUNG, LAUTSPRECHER_HZ, btype="bandpass", fs=ABTASTRATE, output="sos")
    return sosfilt(filter_, ton, axis=0)


# Am Ende eines Kurzmotivs gilt als Stille, was leiser als −60 dB ist; 0,1 s bleiben als Rest.
STILLE_DB = -60
REST_SEKUNDEN = 0.1


def ohne_stille_am_ende(ton):  # noqa: ANN001, ANN201 (numpy nur zur Laufzeit)
    """Schneidet die Stille nach dem Ausklang ab (Kurzmotive sollen nicht nachhängen)."""
    import numpy as np

    from pipeline.abenteuer.ton.sampler import ABTASTRATE

    laut = np.where(np.abs(ton).max(axis=1) > 10 ** (STILLE_DB / 20))[0]
    ende = int(laut[-1]) + int(REST_SEKUNDEN * ABTASTRATE) if len(laut) else len(ton)
    return ton[:ende]


def kodiere(ton, ziel: Path, mono: bool = False) -> None:  # noqa: ANN001 (numpy)
    """Schreibt Ton als m4a (AAC, BITRATE) über eine WAV im Arbeitsordner; ``mono`` mischt herunter."""
    from pipeline.abenteuer.ton.sampler import schreibe_wav

    MIDI.mkdir(parents=True, exist_ok=True)
    wav = MIDI / f"{ziel.name}.wav"
    schreibe_wav(ton, wav)
    befehl = ["ffmpeg", "-y", "-loglevel", "error", "-i", str(wav), "-c:a", "aac", "-b:a", BITRATE]
    subprocess.run([*befehl, *(["-ac", "1"] if mono else []), str(ziel)], check=True)
    wav.unlink()


def gleichmaessig(ton, pegel_db: float = 0.0):  # noqa: ANN001, ANN201 (numpy)
    """Gleichmäßige Lautheit einer Schleife (Klangplan A0.6, lautheit.py): sanft verdichtet
    (ringförmig), Anfang und Ende gleich laut (``nahtkurve``), −18 LUFS plus ``pegel_db``,
    weicher Begrenzer mit Reserve für den Kodierer."""
    from pipeline.abenteuer.ton.lautheit import begrenze, nahtkurve, verdichtungskurve, zielfaktor
    from pipeline.abenteuer.ton.sampler import ABTASTRATE

    ton = ton * verdichtungskurve(ton, ABTASTRATE, True)
    ton = ton * nahtkurve(ton, ABTASTRATE)
    return begrenze(ton * zielfaktor(ton, ABTASTRATE, mit_begrenzer=True) * 10 ** (pegel_db / 20))


def _mit_spuren(satz: Satz, ordner: Path):  # noqa: ANN202 (numpy)
    """Rendert die Spuren (spuren.py), schreibt sie neben das Stück und gibt die volle Mischung zurück.

    Name: ``<stamm>.<spur>.m4a`` (maple-falls.grund.m4a); die Zusatzspur in Mono, die App verortet sie.
    Die volle Mischung ist die Summe der Spuren (gleiche Verstärkung, −18 LUFS).
    """
    from pipeline.abenteuer.ton.lautheit import miss_ton
    from pipeline.abenteuer.ton.sampler import ABTASTRATE
    from pipeline.abenteuer.ton.spuren import rendere_spuren

    pegel = 10 ** (satz.pegel_db / 20)
    spuren = {name: ton * pegel for name, ton in rendere_spuren(satz).items()}
    for name, ton in spuren.items():
        kodiere(ton, ordner / f"{stamm(satz.kennung)}.{name}.m4a", name == ZUSATZ)
    # Lautheit je Mischung (grund, grund+melodie, alle) für spuren.json; die App hebt dünne an.
    lufs = {}
    for anzahl in range(1, len(spuren) + 1):
        namen = list(spuren)[:anzahl]
        lufs["+".join(namen)] = round(miss_ton(sum(spuren[n] for n in namen), ABTASTRATE, "").lufs, 1)
    trage_lautheit_ein(ordner_privat(ordner), stamm(satz.kennung), lufs)
    return sum(spuren.values())


def ordner_privat(ordner: Path) -> Path:
    """Das private Repository zu einem Musikordner (spiel/musik oder spiel/musik/aktN)."""
    return next(p.parent for p in [ordner, *ordner.parents] if p.name == "spiel")


def baue_satz(satz: Satz, privat: Path) -> dict[str, object]:
    """Rendert einen Plan, kodiert ihn als m4a und gibt die Angaben für die Übersicht zurück."""
    from pipeline.abenteuer.ton.midi import schreibe_midi
    from pipeline.abenteuer.ton.sampler import rendere

    stueck = baue(satz)
    MIDI.mkdir(parents=True, exist_ok=True)
    schreibe_midi(stueck, MIDI / f"{satz.kennung}.mid")
    ordner = zielordner(privat, satz)
    ordner.mkdir(parents=True, exist_ok=True)
    ziel = ordner / dateiname(satz.kennung)
    if satz.spuren:
        ton = _mit_spuren(satz, ordner)
    elif satz.schleife:
        ton = gleichmaessig(klangbild(rendere(stueck, PROBEN), satz.klangbild), satz.pegel_db)
    else:
        ton = ohne_stille_am_ende(
            angleichen(klangbild(rendere(stueck, PROBEN), satz.klangbild), satz.pegel_db)
        )
    kodiere(ton, ziel)
    sekunden = stueck.sekunden(stueck.ende())
    print(f"{ziel}  ({sekunden:.0f} s, {ziel.stat().st_size / 1e6:.2f} MB)")
    return {
        "kennung": satz.kennung,
        "titel": satz.titel,
        "akt": satz.akt,
        "datei": str(ziel.relative_to(privat)),
        "sekunden": round(sekunden),
        "schleife": satz.schleife,
        "beschreibung": satz.beschreibung,
        "instrumente": sorted({s.instrument for s in satz.stimmen}),
    }


def main() -> None:
    """Liest die Argumente, holt bei Bedarf Proben und Klangfonts und baut die Stücke."""
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("privat", type=Path, help="privates Repository (schach-abenteuer-inhalte)")
    parser.add_argument("--nur", nargs="*", help="nur diese Kennungen")
    parser.add_argument("--laden", action="store_true", help="Proben und Klangfonts vorher holen")
    parser.add_argument("--nur-liste", action="store_true", help="nur einmal.json schreiben")
    argumente = parser.parse_args()
    print(schreibe_einmalliste(argumente.privat, alle()))
    print(schreibe_spurenliste(argumente.privat, alle()))
    if argumente.nur_liste:
        return
    if argumente.laden:
        from pipeline.abenteuer.ton import instrumente, klangfonts

        instrumente.laden(PROBEN)
        klangfonts.laden()
    plaene = [s for s in alle() if not argumente.nur or s.kennung in argumente.nur]
    # Je Stück eine Angabe in buch/arbeit/ton/midi/uebersicht/, damit parallele Läufe sich nicht stören.
    ordner = MIDI / "uebersicht"
    ordner.mkdir(parents=True, exist_ok=True)
    for satz in plaene:
        angaben = baue_satz(satz, argumente.privat)
        datei = ordner / f"{satz.kennung}.json"
        datei.write_text(json.dumps(angaben, ensure_ascii=False, indent=1), encoding="utf-8")


if __name__ == "__main__":
    main()
