"""Die Lesefassung des Schach-Abenteuers muss wiederholbar sein und die ganze Geschichte zeigen.

Warum: ``pipeline/abenteuer/lesefassung.cjs`` schreibt das Protokoll eines vollständigen
Spielverlaufs für das Lektorat. Es taugt nur, wenn derselbe Aufruf dieselbe Datei liefert, wenn es
am Dachboden beginnt, alle Akte bis zum Abspann enthält und keine Steuerzeichen der Dialoge (Tags)
mehr im Text stehen.

Der Durchlauf dauert etwa eine Minute; deshalb laufen diese Tests wie die der Gesamtsimulation nur
mit ``ABENTEUER_SIMULATION=1``. Die Regel für Antworten (``schiebtAuf``) wird immer geprüft.
"""

import os
import re
import shutil
import subprocess
from pathlib import Path

import pytest

HAUPTORDNER = Path(__file__).resolve().parents[2]
SKRIPT = HAUPTORDNER / "pipeline" / "abenteuer" / "lesefassung.cjs"
SPIELER = HAUPTORDNER / "pipeline" / "abenteuer" / "lesefassung-spieler.cjs"
INKJS = HAUPTORDNER / "app" / "node_modules" / "inkjs"
ZEITBUDGET_SEKUNDEN = 300
LAEUFE = 2
AKTE = (1, 2, 3, 4)
# Seit der Einleitung (19.11.2026): vor dem Haus, dann die Ankunft im Wohnzimmer, dann das Brett.
# Die Ankunft läuft seit der Erzählzeit-Prüfung (19.11.2026) als Eingang des Wohnzimmers, der zu
# „ankunft“ verzweigt; die Lesefassung nennt den Eingangsknoten.
ERSTE_DIALOGE = (
    "maple-falls-aussen.einleitung",
    "maple-falls-wohnzimmer.eingang",
)
BRETT = "maple-falls-dachboden.dachboden_brett"
TAGS = re.compile(r"#\s*(sprecher|stimmung|musik|klang|bild|pause|geraeusch|licht|teilchen|erinnerung)\b")

ohne_node = pytest.mark.skipif(
    shutil.which("node") is None or not INKJS.exists(),
    reason="Node oder app/node_modules/inkjs fehlt (vorher im Ordner app/ npm ci)",
)


@pytest.fixture(scope="module")
def laeufe(tmp_path_factory: pytest.TempPathFactory) -> list[Path]:
    """Zwei Durchläufe mit demselben Aufruf, nebeneinander gestartet; gibt die beiden Ordner zurück."""
    if os.environ.get("ABENTEUER_SIMULATION") != "1":
        pytest.skip("Lesefassung dauert etwa eine Minute; mit ABENTEUER_SIMULATION=1 starten")
    if shutil.which("node") is None or not INKJS.exists():
        pytest.skip("Node oder app/node_modules/inkjs fehlt (vorher im Ordner app/ npm ci)")
    ordner = [tmp_path_factory.mktemp(f"lesefassung{nummer}") for nummer in range(LAEUFE)]
    befehl = ["node", str(SKRIPT), "--akte", "--sekunden", str(ZEITBUDGET_SEKUNDEN), "--ziel"]
    prozesse = [
        subprocess.Popen(
            [*befehl, str(o / "lesefassung.md")],
            cwd=HAUPTORDNER,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )
        for o in ordner
    ]
    for prozess in prozesse:
        ausgabe, fehler = prozess.communicate(timeout=ZEITBUDGET_SEKUNDEN + 120)
        assert prozess.returncode == 0, f"Der Durchlauf endet mit Fehler:\n{ausgabe}\n{fehler}"
    return ordner


@pytest.fixture(scope="module")
def text(laeufe: list[Path]) -> str:
    return (laeufe[0] / "lesefassung.md").read_text(encoding="utf-8")


def test_gleicher_aufruf_gleiche_datei(laeufe: list[Path]):
    for name in ["lesefassung.md", *[f"akt{akt}.md" for akt in AKTE]]:
        erste, zweite = (o / name for o in laeufe)
        assert erste.read_bytes() == zweite.read_bytes(), f"{name} ist nicht wiederholbar"


def test_beginnt_vor_dem_haus_mit_der_einleitung(text: str):
    """Die erste Karte ist die Hauptstraße vor dem Haus: erst die Einleitung, dann die Ankunft im
    Wohnzimmer; danach kommt (nach Dingen zum Ansehen) der Fund des Bretts auf dem Dachboden."""
    koepfe = re.findall(r"^#### (\d+) · (.+)\n\n`([\w-]+\.\w+)`", text, re.M)
    assert koepfe, "Die Lesefassung enthält keine Kopfzeilen von Dialogen"
    assert koepfe[0][:2] == ("1", "Maple Falls, Hauptstraße")
    ortsdialoge = [knoten for _, _, knoten in koepfe if not knoten.startswith("ansehen-")]
    assert tuple(ortsdialoge[:2]) == ERSTE_DIALOGE
    assert BRETT in ortsdialoge


def test_enthaelt_jeden_akt_bis_zum_abspann(text: str, laeufe: list[Path]):
    ueberschriften = re.findall(r"^## (.+)$", text, re.M)
    assert ueberschriften[: len(AKTE)] == [f"Akt {akt}" for akt in AKTE]
    assert "[Abspann]" in text
    assert text.index("[Abspann]") < text.index("## Nach dem Abspann")
    for akt in AKTE:
        teil = (laeufe[0] / f"akt{akt}.md").read_text(encoding="utf-8")
        assert f"## Akt {akt}" in teil
        assert teil.split(f"## Akt {akt}", 1)[1].strip() in text


def test_keine_tags_und_keine_kennungen_statt_namen(text: str):
    assert not TAGS.search(text), f"Tag im Text: {TAGS.search(text)}"
    assert "{held}" not in text
    assert not re.search(r"\*\*(figur|ort)\.[\w.]+", text), "Sprecher ohne lesbaren Namen"
    assert "Achtung, unvollständig" not in text


def test_kopf_nennt_regeln_umfang_und_luecken(text: str):
    kopf = text.split("## Akt 1", 1)[0]
    stichworte = (
        "--startwert 1",
        "**Wahlen.**",
        "**Partien und Aufgaben.**",
        "**Umfang.**",
        "**Was fehlt.**",
    )
    for stichwort in stichworte:
        assert stichwort in kopf
    assert "mapleFalls.victor" in kopf, "Die vorgesehene Niederlage gegen Victor steht nicht im Kopf"
    assert "[Partie gegen Victor Hale – Ausgang: verloren]" in text


@ohne_node
def test_aufschieben_gilt_nicht_als_inhaltliche_antwort():
    """„Nicht jetzt.“ und „Später“ schieben auf; „Ich bin bereit.“ und „Nichts sagen“ nicht."""
    skript = (
        f"const {{ schiebtAuf }} = require({str(SPIELER)!r});"
        "const a = ['„Nicht jetzt.“', 'Später', '„Gleich, Mama.“', '„Ich bin bereit.“', 'Nichts sagen'];"
        "console.log(a.map(schiebtAuf).join(','));"
    )
    lauf = subprocess.run(["node", "-e", skript], cwd=HAUPTORDNER, capture_output=True, text=True, check=True)
    assert lauf.stdout.strip() == "true,true,true,false,false"
