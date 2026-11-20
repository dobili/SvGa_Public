"""Quests verfehlen: Kann ein Spieler den Auslöser einer Quest oder eines Schritts für immer verlieren?

Warum: Auftrag „Quests verfehlen“ (20.11.2026). Ein Spieler kann sich anders verhalten als die
Gesamtsimulation: erst reisen, dann reden; „Nicht jetzt“ sagen; eine Quest liegen lassen, bis eine
Figur nach einem Abschied fort ist oder eine Zustandskarte sie ersetzt. Dieses Werkzeug prüft für
jede Quest (quests.json) den Start und jeden Schritt, ob der Auslöser nach einem späteren Ereignis
noch erreichbar ist.

Vorgehen je Start und Schritt:

1. **Auslöser:** Der Knoten (Dialogschritt), die Knoten mit ``beginneAufgaben``/``beginnePartie``/
   ``beginneSimultan``/``beginneGedaechtnis`` für Runde oder Begegnung, Figuren mit dem Gegner der
   Begegnung, oder die Karte (Ortsschritt).
2. **Kandidaten:** Jede Figur, jeder Auslöser und jeder Eingangsdialog einer Karte (orte.json), dessen
   Einstieg in derselben Ink-Datei liegt und den Knoten im Fluss erreicht (inkfluss.py).
3. **Sperren je Kandidat:**
   - verneinte Variablen in ``wenn`` (``nicht abschiedGesehen``);
   - Zustandskarten, auf denen das Objekt fehlt (die Bedingung der Fassung);
   - einmalige Eingänge (``eingang`` mit verneinter Bedingung);
   - bei Ortsschritten Übergänge in die Karte, die alle verneint gesperrt sind.
4. **Bewertung:**
   - Hat ein Kandidat keine Sperre, ist der Schritt sicher.
   - Sonst prüft das Werkzeug, wer die sperrenden Variablen setzt (Ink ``~ x = …``, Wirkungen der
     Quests). Setzt nur der Auslöser selbst oder ein späterer Schritt derselben Quest die
     Variable, folgt die Sperre aus der Quest selbst („folgt“).
   - Alles andere ist ein Befund. Er wird behoben, in ``AUSNAHMEN`` begründet oder, wenn er eine
     Entscheidung zu Karten oder Dialogen braucht, in ``GEMELDET`` festgehalten (Stufe „gemeldet“).

Grenzen: Bedingungen innerhalb von Ink (``{nicht x: …}``) zählen nicht; ob ein Setzer zeitlich vor
dem offenen Schritt laufen kann, entscheidet die Prüfung nicht (darum der Befund mit Setzern zum
Nachlesen). Den Ablauf prüft ``questverfehlen-aufschieber.cjs`` (spielt jede Quest so spät wie
möglich).

Aufruf: ``python -m pipeline.abenteuer.questverfehlen [--alle] [--objekte DATEI]``; Rückgabe 1
bei Befunden ohne Ausnahme. ``--objekte`` schreibt je Start und Schritt die auslösenden Objekte für
den Aufschieber. Dauertest: pipeline/tests/test_abenteuer_questverfehlen.py. Abhängigkeiten: bedingung.py,
inkfluss.py, Standardbibliothek.
"""

import json
import re
import sys
from dataclasses import dataclass, field
from pathlib import Path

from pipeline.abenteuer.inkfluss import erreichbar, lies
from pipeline.abenteuer.questsperren import sperrmengen
from pipeline.abenteuer.questverfehlen_geprueft import AUSNAHMEN, GEMELDET

DATEN = Path(__file__).resolve().parents[2] / "inhalte" / "abenteuer"
DIALOGE = DATEN / "dialoge" / "de"
AUFRUF = re.compile(r'\b(beginneAufgaben|beginnePartie|beginneSimultan|beginneGedaechtnis)\("([^"]+)"')
SETZEN = re.compile(r"^\s*~\s*(\w+)\s*(=|\+=|-=|\+\+|--)")
VERNEINT = re.compile(r"\bnicht\s+(\w+)|\b(\w+)\s*==\s*(?:falsch|false|0)\b")


@dataclass
class Kandidat:
    """Ein Objekt, das den Auslöser öffnen kann, mit seinen Sperren (Sperrmenge „a+b“ → Herkunft).

    ``karte`` und ``objekt`` nennen das Objekt für den Aufschieber (leer bei Eingängen, Wegen, Reisen).
    """

    beschreibung: str
    sperren: dict[str, str] = field(default_factory=dict)
    karte: str = ""
    objekt: str = ""


@dataclass
class Befund:
    """Ergebnis für Start oder Schritt einer Quest."""

    quest: str
    stelle: str  # „start“ oder „schritt n“
    stufe: str  # sicher, folgt, befund, ausnahme, ohne
    text: str

    @property
    def schluessel(self) -> str:
        """Schlüssel in AUSNAHMEN: „quest:start“ oder „quest:n“."""
        return f"{self.quest}:{self.stelle.replace('schritt ', '')}"

    def __str__(self) -> str:
        return f"{self.stufe:8} {self.quest} {self.stelle}: {self.text}"


def verneinte(wenn: str | None) -> set[str]:
    """Variablen, die eine Bedingung verneint verlangt. Beispiel: „a und nicht b“ → {"b"}."""
    return {a or b for a, b in VERNEINT.findall(wenn or "")}


def sperren_von(wenn: str | None, herkunft: str) -> dict[str, str]:
    """Sperrmengen einer Bedingung (questsperren.py) als „a+b“ → Herkunft."""
    return {"+".join(sorted(m)): herkunft for m in sperrmengen(wenn)}


class Welt:
    """Orte, Karten, Quests und Ink-Flüsse, einmal gelesen."""

    def __init__(self, daten: Path = DATEN) -> None:
        lade = lambda n: json.loads((daten / n).read_text(encoding="utf-8"))  # noqa: E731
        self.orte = lade("orte.json")["orte"]
        self.quests = lade("quests.json")["quests"]
        self.simultan = {s["kennung"]: s["begegnungen"] for s in lade("partieformen.json")["simultan"]}
        self.fluesse = {
            p.stem: lies(p.read_text(encoding="utf-8"))
            for p in sorted((daten / "dialoge" / "de").glob("*.ink"))
        }
        self.daten = daten
        self.objekte = self._objekte()
        self.setzer = self._setzer()

    def _objekte_der_datei(self, datei: str) -> set[str]:
        karte = json.loads((self.daten / datei).read_text(encoding="utf-8"))
        return {
            o["name"]
            for ebene in karte["layers"]
            if ebene.get("type") == "objectgroup"
            for o in ebene["objects"]
            if (o.get("type") or o.get("class")) not in ("statist", "tier")
        }

    def _objekte(self) -> dict[str, tuple[set[str], list[tuple[str, set[str]]]]]:
        """Je Karte: Objekte der Grundkarte und je Zustandskarte (Bedingung, Objekte)."""
        return {
            k["kennung"]: (
                self._objekte_der_datei(k["datei"]),
                [(w, self._objekte_der_datei(d)) for w, d in (k.get("zustaende") or {}).items()],
            )
            for o in self.orte
            for k in o["karten"]
        }

    def _setzer(self) -> dict[str, set[str]]:
        """Je Variable die Stellen, die sie setzen: „datei.knoten“ (Ink) oder „quest:n“ (Wirkung)."""
        setzer: dict[str, set[str]] = {}
        for name, fluss in self.fluesse.items():
            for z in fluss.zeilen:
                t = SETZEN.match(z.text)
                if t:
                    setzer.setdefault(t.group(1), set()).add(f"{name}.{z.knoten}")
        for q in self.quests:
            for i, s in enumerate(q["schritte"], 1):
                for w in s.get("wirkungen", []):
                    if w.get("variable"):
                        setzer.setdefault(w["variable"], set()).add(f"{q['kennung']}:{i}")
        return setzer

    def erreicht(self, einstieg: str, ziel: str) -> bool:
        """Erreicht der Einstieg „datei.knoten“ den Knoten „datei.knoten“ im Fluss derselben Datei?"""
        d1, k1 = einstieg.split(".", 1)
        d2, k2 = ziel.split(".", 1)
        fluss = self.fluesse.get(d1)
        if d1 != d2 or not fluss or (k1,) not in fluss.namen or (k2,) not in fluss.namen:
            return einstieg == ziel
        return fluss.namen[(k2,)] in erreichbar(fluss, fluss.namen[(k1,)])

    def knoten_mit(self, kennung: str) -> set[str]:
        """Knoten „datei.knoten“, die Runde, Begegnung oder Simultan ``kennung`` starten."""
        gesucht = {kennung} | {s for s, bretter in self.simultan.items() if kennung in bretter}
        return {
            f"{name}.{z.knoten}"
            for name, fluss in self.fluesse.items()
            for z in fluss.zeilen
            for _, k in AUFRUF.findall(z.text)
            if k in gesucht
        }


def fassungssperren(welt: Welt, karte: str, name: str) -> dict[str, str]:
    """Variablen, mit denen eine Zustandskarte ohne dieses Objekt gilt (das Objekt verschwindet)."""
    grund, fassungen = welt.objekte.get(karte, (set(), []))
    if name not in grund:
        return {}
    sperren: dict[str, str] = {}
    for wenn, objekte in fassungen:
        if name not in objekte:
            # Das Objekt fehlt, solange die Fassung gilt: Es steht nur da, wenn „nicht (wenn)“ gilt.
            sperren |= sperren_von(f"nicht ({wenn})", f"Zustandskarte „{wenn}“ von {karte} ohne {name}")
    return sperren


def _karten_mit(welt: Welt, ort: dict, name: str, karte: str | None) -> list[str]:
    """Karten des Ortes, auf denen das Objekt in einer Fassung steht (oder die genannte Karte)."""
    if karte:
        return [karte]
    return [
        k["kennung"]
        for k in ort["karten"]
        if name in welt.objekte[k["kennung"]][0] or any(name in o for _, o in welt.objekte[k["kennung"]][1])
    ]


def kandidaten(welt: Welt, ziele: set[str], gegner: str | None = None) -> list[Kandidat]:
    """Figuren, Auslöser und Eingänge, deren Dialog einen der Zielknoten erreicht."""
    trifft = lambda einstieg: any(welt.erreicht(einstieg, z) for z in ziele)  # noqa: E731
    liste: list[Kandidat] = []
    for ort in welt.orte:
        for f in ort["figuren"]:
            if not (trifft(f["dialog"]) or (gegner and f.get("gegner") == gegner)):
                continue
            name = f["kennung"].split(".", 1)[1]
            for karte in _karten_mit(welt, ort, name, None) or [ort["karten"][0]["kennung"]]:
                sperren = sperren_von(f.get("wenn"), f"wenn der Figur „{f.get('wenn')}“")
                sperren |= fassungssperren(welt, karte, name)
                liste.append(Kandidat(f"Figur {f['kennung']} auf {karte}", sperren, karte, name))
        for a in ort["ausloeser"]:
            if a.get("dialog") and trifft(a["dialog"]):
                for karte in _karten_mit(welt, ort, a["name"], a.get("karte")):
                    # Ein Übergang mit Dialog prüft `wenn` erst nach dem Dialog (der Dialog läuft immer).
                    wenn = None if a["art"] == "uebergang" else a.get("wenn")
                    sperren = sperren_von(wenn, f"wenn des Auslösers „{wenn}“")
                    sperren |= fassungssperren(welt, karte, a["name"])
                    liste.append(Kandidat(f"Auslöser {a['name']} auf {karte}", sperren, karte, a["name"]))
        for k in ort["karten"]:
            e = k.get("eingang")
            if e and trifft(e["dialog"]):
                sperren = sperren_von(e.get("wenn"), f"Eingang „{e.get('wenn')}“ (einmalig)")
                liste.append(Kandidat(f"Eingang von {k['kennung']}", sperren))
    return liste


def zugaenge(welt: Welt, karte: str) -> list[Kandidat]:
    """Wege in eine Karte: Übergänge (mit ihren Sperren) und Reisen aus Ink (ohne Sperre)."""
    liste = [
        Kandidat(
            f"Übergang {a['name']} in {ort['kennung']}",
            sperren_von(a.get("wenn"), f"wenn des Übergangs „{a.get('wenn')}“"),
        )
        for ort in welt.orte
        for a in ort["ausloeser"]
        if a["art"] == "uebergang" and (a.get("ziel") or {}).get("karte") == karte
    ]
    if any(f'reise("{karte}"' in z.text for f in welt.fluesse.values() for z in f.zeilen):
        liste.append(Kandidat(f"Reise nach {karte}"))
    return liste


def ziele_von(welt: Welt, ereignis: dict) -> tuple[set[str], str | None]:
    """Zielknoten und Gegner eines Ereignisses (Dialog, Aufgaben, Partie); Ort: keine Knoten."""
    if ereignis["art"] == "dialog":
        return {ereignis["knoten"]}, None
    if ereignis["art"] == "aufgaben":
        return welt.knoten_mit(ereignis["runde"]), None
    if ereignis["art"] == "partie":
        return welt.knoten_mit(ereignis["begegnung"]), ereignis["begegnung"]
    return set(), None


def eigene_stellen(welt: Welt, quest: dict, ab: int) -> set[str]:
    """Knoten und Wirkungen der Quest ab Schritt ``ab`` (0 = Start): Wer dort setzt, folgt der Quest."""
    ereignisse = ([quest["start"]] if ab == 0 else []) + [
        s["ereignis"] for s in quest["schritte"][max(ab - 1, 0) :]
    ]
    stellen = {f"{quest['kennung']}:{i}" for i in range(max(ab, 1), len(quest["schritte"]) + 1)}
    for e in ereignisse:
        stellen |= ziele_von(welt, e)[0]
    return stellen


def bewerte(welt: Welt, quest: dict, ab: int, ereignis: dict) -> Befund:
    """Start (ab=0) oder Schritt ``ab`` einer Quest bewerten."""
    stelle = "start" if ab == 0 else f"schritt {ab}"
    if ereignis["art"] == "ort":
        liste = zugaenge(welt, ereignis["karte"])
    else:
        liste = kandidaten(welt, *ziele_von(welt, ereignis))
    if not liste:
        stufe = "sicher" if ereignis["art"] == "ort" else "ohne"
        return Befund(quest["kennung"], stelle, stufe, "kein Auslöser in orte.json gefunden")
    frei = [k for k in liste if not k.sperren]
    if frei:
        return Befund(quest["kennung"], stelle, "sicher", frei[0].beschreibung)
    eigene = eigene_stellen(welt, quest, ab)
    # Eine Sperrmenge folgt aus der Quest, wenn eine ihrer Variablen nur von der Quest gesetzt wird.
    eigen = lambda menge: any(welt.setzer.get(v) and welt.setzer[v] <= eigene for v in menge.split("+"))  # noqa: E731
    folgt = [k for k in liste if all(eigen(m) for m in k.sperren)]
    if folgt:
        return Befund(quest["kennung"], stelle, "folgt", folgt[0].beschreibung)
    teile = [
        f"{k.beschreibung}: "
        + "; ".join(
            f"{m} ({herkunft}; gesetzt in "
            + "; ".join(f"{v}: {', '.join(sorted(welt.setzer.get(v, {'—'}))[:3])}" for v in m.split("+"))
            + ")"
            for m, herkunft in k.sperren.items()
        )
        for k in liste[:3]
    ]
    befund = Befund(quest["kennung"], stelle, "befund", " | ".join(teile))
    if befund.schluessel in AUSNAHMEN:
        befund.stufe, befund.text = "ausnahme", AUSNAHMEN[befund.schluessel]
    elif befund.schluessel in GEMELDET:
        befund.stufe, befund.text = "gemeldet", GEMELDET[befund.schluessel]
    return befund


def pruefe(welt: Welt | None = None) -> list[Befund]:
    """Alle Starts und Schritte aller Quests."""
    welt = welt or Welt()
    return [
        bewerte(welt, q, i, e)
        for q in welt.quests
        for i, e in enumerate([q["start"]] + [s["ereignis"] for s in q["schritte"]])
    ]


def objekte_je_stelle(welt: Welt | None = None) -> dict[str, list[list[str]]]:
    """Je „quest:stelle“ (0 = Start) die Objekte [Karte, Name], die sie auslösen (für den Aufschieber)."""
    welt = welt or Welt()
    ausgabe: dict[str, list[list[str]]] = {}
    for q in welt.quests:
        for i, e in enumerate([q["start"]] + [s["ereignis"] for s in q["schritte"]]):
            if e["art"] != "ort":
                liste = kandidaten(welt, *ziele_von(welt, e))
                ausgabe[f"{q['kennung']}:{i}"] = sorted({(k.karte, k.objekt) for k in liste if k.objekt})
    return {k: [list(x) for x in v] for k, v in ausgabe.items()}


def main() -> int:
    """Befehlszeile; Aufruf im Dateikopf. ``--objekte DATEI`` schreibt die Objekte je Stelle als JSON."""
    if "--objekte" in sys.argv:
        ziel = Path(sys.argv[sys.argv.index("--objekte") + 1])
        ziel.write_text(json.dumps(objekte_je_stelle(), ensure_ascii=False, indent=1), encoding="utf-8")
        return 0
    befunde = pruefe()
    alle = "--alle" in sys.argv
    for b in befunde:
        if alle or b.stufe in ("befund", "ohne", "gemeldet"):
            print(b)
    offen = [b for b in befunde if b.stufe in ("befund", "ohne")]
    zaehlung = {
        s: sum(b.stufe == s for b in befunde)
        for s in ("sicher", "folgt", "ausnahme", "gemeldet", "befund", "ohne")
    }
    print(f"{len(offen)} Befunde; " + ", ".join(f"{s} {n}" for s, n in zaehlung.items()))
    return 1 if offen else 0


if __name__ == "__main__":
    sys.exit(main())
