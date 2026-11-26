"""Weiß der Spieler, wohin als Nächstes? Prüft, ob der Dialog vor einem Questschritt dessen Ziel nennt.

Warum: Wunsch des Autors (19.11.2026): „Der Spieler soll immer wissen, wo er als Nächstes hin soll –
nicht nur mit der Kartenmarkierung, sondern aus den Dialogen.“ Die Markierung bleibt; zusätzlich
soll der Dialog, der einen Schritt abschließt, das nächste Ziel beim Namen nennen (eine Person, einen
Ort, einen Raum). Dieses Werkzeug findet die Stellen, an denen das fehlt.

Vorgehen je Quest (quests.json) und je Paar aufeinanderfolgender Schritte i → i+1:

1. **Übergang:** Endet Schritt i mit einem Dialog (``ereignis.art == "dialog"``), ist dessen Knoten der
   Übergang. Endet er mit Aufgaben, gilt der Knoten ``danach`` der Runde (runden.json), sonst kein
   Dialog. Endet er mit einer Partie, liegt der Übergang im Ergebnisknoten der Partie; die prüft ein
   anderer Auftrag (mittel-3, Reaktionen nach Partien), hier steht nur ein Hinweis.
2. **Ziel von Schritt i+1:** Person (Figur aus orte.json, deren Dialog den Knoten erreicht, Steller
   einer Runde, Gegner einer Begegnung) und Ort (Karte, Ort) mit ihren Namen aus texte/de.json.
3. **Prüfung:** Der Text aller Zeilen, die vom Übergangsknoten aus in derselben Datei erreichbar
   sind, nennt einen dieser Namen; oder der Übergang startet den nächsten Schritt selbst
   (``beginnePartie``/``beginneAufgaben``/``reise`` mit passendem Ziel); oder das Ziel liegt auf
   derselben Karte wie der Übergang (der Spieler steht schon dort).

Der letzte Schritt einer Hauptquest geht in die Hauptquests über, die sie voraussetzen; ihr Start
(Dialog oder Ort) ist dann das nächste Ziel. Bewusst offene Stellen stehen in ``AUSNAHMEN`` mit Grund.

Aufruf: ``python -m pipeline.abenteuer.naechsterschritt [--alle]`` (``--alle`` zeigt auch, was
stimmt). Rückgabe 1, wenn ein Übergang ohne Ziel bleibt. Dauertest:
pipeline/tests/test_abenteuer_naechsterschritt.py. Abhängigkeiten: nur die Standardbibliothek.
"""

import json
import re
import sys
from dataclasses import dataclass, field
from pathlib import Path

from pipeline.abenteuer.inkfluss import Fluss, erreichbar, lies

DATEN = Path(__file__).resolve().parents[2] / "inhalte" / "abenteuer"
DIALOGE = DATEN / "dialoge" / "de"

# Bewusst offene Stellen: „quest:schritt“ (Schritt i, nach dem der Übergang kommt) → Grund.
AUSNAHMEN: dict[str, str] = {
    "siliconBay.fehlendeSeite:1": "Die Seite bringt Victor erst in Akt 4 selbst (Bergstation); "
    "der Questtext sagt es.",
    "ghostTown.fernpartie:2": "Die Erinnerung endet mit der erloschenen Kerze; Victor sagte vorher im "
    "Saloon, dass er auf Ambroses letzten Zug wartet (ghost-town-saloon.victor_wartet).",
    "wegCedarRiverton.testteam:1": "Die nächste Sperre steht auf dem Weg, den die Hauptquest ohnehin nimmt.",
    "wegCedarRiverton.testteam:2": "Die nächste Sperre steht auf dem Weg, den die Hauptquest ohnehin nimmt.",
    "wegCedarRiverton.testteam:3": "Das Wiedersehen vor der Arena kommt mit der Hauptquest von selbst.",
    "mapleFalls.ersterAbend:2": "Mama nennt Coach Delgado am Morgen unten im Wohnzimmer"
    " (maple-falls-wohnzimmer.morgen_mama, Eingang der Karte); oben klappern nur die Schlüssel.",
}

# Wörter, die in Namen stehen, aber allein nichts benennen.
FUELLWOERTER = {
    "mr.",
    "mrs.",
    "dr.",
    "miss",
    "coach",
    "der",
    "die",
    "das",
    "dein",
    "deine",
    "am",
    "an",
    "im",
    "in",
    "von",
    "zur",
    "zum",
    "und",
    "high",
    "alter",
    "alte",
    "altes",
    "hinter",
    "vor",
    "über",
    "perfect",
    "move",
}
# Wie Figuren im Text heißen, wenn der Anzeigename anders lautet.
RUFNAMEN = {"mutter": ["Mama"], "ambrose": ["Ambrose"]}
# Wie Karten im Text heißen, wenn der Kartenname ein zusammengesetztes Wort ist.
KARTENRUFNAMEN = {"mapleFalls.park": ["Park"], "siliconBay.akademie": ["Akademie"]}
TAG = re.compile(r"#\S+")
AUFRUF = re.compile(r"(beginnePartie|beginneAufgaben|beginneSimultan|reise)\(\"([^\"]+)\"")


@dataclass
class Ziel:
    """Wohin ein Schritt führt: Namen zum Suchen, Karten zum Vergleichen, Aufrufe, die ihn starten."""

    namen: set[str] = field(default_factory=set)
    karten: set[str] = field(default_factory=set)
    aufrufe: set[str] = field(default_factory=set)
    beschreibung: str = ""


@dataclass
class Befund:
    """Ein Übergang zwischen zwei Schritten und ob der Dialog das nächste Ziel nennt."""

    quest: str
    schritt: int  # Schritt i (ab 1), nach dem der Übergang kommt
    stufe: str  # ok, fehlt, partie, ausnahme, ohne
    uebergang: str
    ziel: str
    grund: str = ""

    def __str__(self) -> str:
        kopf = f"{self.stufe:8} {self.quest} {self.schritt}→: {self.uebergang}"
        return f"{kopf} ⇒ {self.ziel} {self.grund}".rstrip()


def kebab(kennung: str) -> str:
    """``mapleFalls.clubraum`` → ``maple-falls-clubraum`` (Name der Dialogdatei einer Karte)."""
    return re.sub(r"([A-Z])", r"-\1", kennung).lower().replace(".", "-")


def namenteile(name: str) -> set[str]:
    """Der Name und seine tragenden Wörter: „Coach Delgado“ → {„Coach Delgado“, „Delgado“}.

    Platzhalter zählen wie ein Name (Rivale oder Rivalin, 22.11.2026): „{rivale} Hale“ →
    {„{rivale} Hale“, „{rivale}“, „Hale“}.
    """
    teile = {name.strip()}
    for wort in re.split(r"[\s,–-]+", name):
        if re.fullmatch(r"\{\w+\}", wort):
            teile.add(wort)
        elif len(wort) >= 3 and wort.lower() not in FUELLWOERTER and wort[:1].isupper():
            teile.add(wort.strip(".,"))
    return {t for t in teile if t}


class Welt:
    """Die Spieldaten, die das Werkzeug braucht, mit kleinen Nachschlagehilfen."""

    def __init__(self, daten: Path = DATEN, dialoge: Path = DIALOGE) -> None:
        lade = lambda name: json.loads((daten / name).read_text(encoding="utf-8"))  # noqa: E731
        self.quests: list[dict] = lade("quests.json")["quests"]
        self.texte: dict[str, str] = lade("texte/de.json")
        self.runden = {r["kennung"]: r for r in lade("runden.json")["runden"]}
        self.begegnungen = {b["kennung"]: b for b in lade("begegnungen.json")["begegnungen"]}
        self.orte: list[dict] = lade("orte.json")["orte"]
        self.dialoge = dialoge
        self.fluesse: dict[str, Fluss] = {}
        self.figuren = {f["kennung"]: (o, f) for o in self.orte for f in o["figuren"]}
        self.figurkarten = self._figurkarten(daten)

    def _figurkarten(self, daten: Path) -> dict[str, set[str]]:
        """Figur (Kennung) → Karten, auf denen sie in einer Szene steht."""
        karten: dict[str, set[str]] = {}
        for pfad in sorted((daten / "szenen").glob("*.json")):
            szene = json.loads(pfad.read_text(encoding="utf-8"))
            ort = szene.get("karte", "").split(".")[0]
            for figur in szene.get("figuren", []):
                karten.setdefault(f"{ort}.{figur['name']}", set()).add(szene["karte"])
        return karten

    def fluss(self, datei: str) -> Fluss | None:
        """Der gelesene Fluss einer Dialogdatei (zwischengespeichert); None, wenn es sie nicht gibt."""
        if datei not in self.fluesse:
            pfad = self.dialoge / f"{datei}.ink"
            if not pfad.exists():
                return None
            self.fluesse[datei] = lies(pfad.read_text(encoding="utf-8"))
        return self.fluesse[datei]

    def zeilen_ab(self, verweis: str) -> set[int]:
        """Zeilen, die vom Knoten ``datei.knoten`` aus in seiner Datei erreichbar sind."""
        datei, _, knoten = verweis.partition(".")
        fluss = self.fluss(datei)
        start = fluss.namen.get(tuple(knoten.split("."))) if fluss else None
        return erreichbar(fluss, start) if fluss and start is not None else set()

    def text_ab(self, verweis: str) -> str:
        """Der Text (ohne Tags) aller Zeilen ab dem Knoten, für die Suche nach Namen."""
        datei = verweis.partition(".")[0]
        fluss = self.fluss(datei)
        if not fluss:
            return ""
        return "\n".join(TAG.sub("", fluss.zeilen[i].text) for i in sorted(self.zeilen_ab(verweis)))

    def name(self, schluessel: str) -> str:
        """Ein Text aus texte/de.json; leer, wenn es ihn nicht gibt."""
        return self.texte.get(schluessel, "")

    def kartennamen(self, karte: str) -> set[str]:
        """Namen einer Karte und ihres Ortes: „Clubraum der Maple Falls High“ → Clubraum, Maple Falls."""
        ort = karte.split(".")[0]
        namen = namenteile(self.name(f"ort.{karte}")) | {self.name(f"ort.{ort}.name")}
        return {n for n in namen | set(KARTENRUFNAMEN.get(karte, [])) if n}

    def raumnamen(self, karte: str) -> set[str]:
        """Nur die Namen der Karte selbst, ohne die Wörter des Ortes: „Turnierhalle“, nicht „Capital“."""
        ortwoerter = set(self.name(f"ort.{karte.split('.')[0]}.name").split())
        namen = namenteile(self.name(f"ort.{karte}")) | set(KARTENRUFNAMEN.get(karte, []))
        return {n for n in namen if n and not set(n.split()) & ortwoerter}

    def figurziel(self, kennung: str) -> Ziel:
        """Ziel „zu dieser Figur“: ihr Name, Rufnamen und die Karten, auf denen sie steht."""
        _, figur = self.figuren.get(kennung, ({}, {}))
        ziel = Ziel(beschreibung=kennung)
        if figur:
            ziel.namen |= namenteile(self.name(figur["name"]))
        ziel.namen |= set(RUFNAMEN.get(kennung.split(".")[-1], []))
        ziel.karten |= self.figurkarten.get(kennung, set())
        for karte in ziel.karten:
            ziel.namen |= self.raumnamen(karte)
        return ziel

    def eigner(self, verweis: str) -> list[str]:
        """Figuren und Auslöser-Karten, deren Dialog den Knoten ``verweis`` erreicht."""
        datei, _, knoten = verweis.partition(".")
        fluss = self.fluss(datei)
        if not fluss or tuple(knoten.split(".")) not in fluss.namen:
            return []
        start = fluss.namen[tuple(knoten.split("."))]
        gefunden = []
        for kennung, (_, figur) in self.figuren.items():
            if figur["dialog"].partition(".")[0] == datei and start in self.zeilen_ab(figur["dialog"]):
                gefunden.append(kennung)
        return gefunden

    def dateikarten(self, datei: str) -> set[str]:
        """Karten, deren Dialoge in dieser Datei stehen (Datei der Karte oder eines Weges)."""
        karten = {k["kennung"] for o in self.orte for k in o["karten"]}
        return {k for k in karten if kebab(k) == datei or kebab(k).startswith(datei + "-")}


def ziel_des_schritts(welt: Welt, schritt: dict) -> Ziel:
    """Wohin Schritt ``schritt`` führt: Figur, Ort und die Aufrufe, die ihn direkt starten.

    Beispiel: Schritt „Partie gegen Victor“ (begegnung mapleFalls.victor) → Gegner
    mapleFalls.victor, Namen {„Victor Hale“, „Victor“, „Hale“}, Karte mapleFalls.clubraum.
    Sonderfall: Ein Ziel aus ``ziel`` (Karte und Objekt) zählt zusätzlich.
    """
    ereignis = schritt.get("ereignis", {})
    art = ereignis.get("art")
    ziel = Ziel()
    if art == "dialog":
        ziel.beschreibung = ereignis["knoten"]
        for kennung in welt.eigner(ereignis["knoten"]):
            ziel = _vereint(ziel, welt.figurziel(kennung))
        if not ziel.namen:
            for karte in welt.dateikarten(ereignis["knoten"].partition(".")[0]):
                ziel.namen |= welt.kartennamen(karte)
                ziel.karten.add(karte)
    elif art == "partie":
        begegnung = welt.begegnungen.get(ereignis["begegnung"], {})
        ziel = _vereint(ziel, welt.figurziel(begegnung.get("gegner", "")))
        ziel.aufrufe.add(ereignis["begegnung"])
        ziel.beschreibung = f"Partie {ereignis['begegnung']}"
    elif art == "aufgaben":
        runde = welt.runden.get(ereignis["runde"], {})
        ziel = _vereint(ziel, welt.figurziel(runde.get("steller", "")))
        ziel.aufrufe.add(ereignis["runde"])
        ziel.beschreibung = f"Aufgaben {ereignis['runde']}"
    elif art == "ort":
        ziel.karten.add(ereignis["karte"])
        ziel.namen |= welt.kartennamen(ereignis["karte"])
        ziel.aufrufe.add(ereignis["karte"])
        ziel.beschreibung = f"Ort {ereignis['karte']}"
    if "ziel" in schritt:
        karte = schritt["ziel"]["karte"]
        ziel.karten.add(karte)
        ziel = _vereint(ziel, welt.figurziel(f"{karte.split('.')[0]}.{schritt['ziel']['objekt']}"))
    return ziel


def _vereint(a: Ziel, b: Ziel) -> Ziel:
    """Zwei Ziele zusammen (Namen, Karten, Aufrufe); die Beschreibung von ``a`` gewinnt."""
    return Ziel(
        a.namen | b.namen, a.karten | b.karten, a.aufrufe | b.aufrufe, a.beschreibung or b.beschreibung
    )


def ziel_des_starts(welt: Welt, quest: dict) -> Ziel:
    """Wohin eine Quest am Anfang führt: ihr Startdialog oder Startort, sonst ihr erster Schritt."""
    start = quest.get("start", {})
    if start.get("art") == "dialog":
        return ziel_des_schritts(welt, {"ereignis": {"art": "dialog", "knoten": start["knoten"]}})
    if start.get("art") == "ort":
        return ziel_des_schritts(welt, {"ereignis": {"art": "ort", "karte": start["karte"]}})
    return ziel_des_schritts(welt, quest["schritte"][0])


def uebergang(welt: Welt, schritt: dict) -> tuple[str, str]:
    """Der Dialogknoten, mit dem ein Schritt endet, und die Art des Übergangs.

    Ausgabe: (``datei.knoten``, ``dialog``) oder (``…``, ``aufgaben``) für den Knoten ``danach``
    einer Runde, ohne ihn für den Dialog des Stellers (was er beim nächsten Ansprechen sagt);
    (Begegnung, ``partie``) nach einer Partie; ("", ``ohne``) ohne Dialog.
    """
    ereignis = schritt.get("ereignis", {})
    if ereignis.get("art") == "dialog":
        return ereignis["knoten"], "dialog"
    if ereignis.get("art") == "aufgaben":
        runde = welt.runden.get(ereignis["runde"], {})
        if runde.get("danach"):
            return runde["danach"], "aufgaben"
        # Ohne Knoten „danach“ sagt der Steller beim nächsten Ansprechen, wie es weitergeht.
        _, steller = welt.figuren.get(runde.get("steller", ""), ({}, {}))
        return (steller["dialog"], "aufgaben") if steller else ("", "ohne")
    if ereignis.get("art") == "partie":
        return ereignis["begegnung"], "partie"
    return "", "ohne"


def bewerte(welt: Welt, verweis: str, ziel: Ziel) -> tuple[bool, str]:
    """Nennt der Text ab ``verweis`` das Ziel, startet er es, oder steht man schon dort?"""
    text = welt.text_ab(verweis)
    for aufruf, wert in AUFRUF.findall(text):
        if (
            wert in ziel.aufrufe
            or wert.split(".")[0] in {k.split(".")[0] for k in ziel.karten}
            and aufruf == "reise"
        ):
            return True, f"startet {wert}"
    vorort = welt.dateikarten(verweis.partition(".")[0]) & ziel.karten
    if vorort:
        return True, f"vor Ort ({sorted(vorort)[0]})"
    for name in sorted(ziel.namen, key=len, reverse=True):
        if re.search(rf"(?<!\w){re.escape(name)}(?!\w)", text):
            return True, f"nennt „{name}“"
    return False, "nennt " + ", ".join(sorted(ziel.namen)[:6]) + " nicht"


def nachfolger(welt: Welt, quest: dict) -> list[dict]:
    """Hauptquests, die diese Hauptquest voraussetzen (der Weg nach ihrem letzten Schritt)."""
    if not quest.get("haupt"):
        return []
    return [q for q in welt.quests if q.get("haupt") and quest["kennung"] in (q.get("voraussetzung") or [])]


def pruefe_quest(welt: Welt, quest: dict) -> list[Befund]:
    """Alle Übergänge einer Quest: zwischen ihren Schritten und (Hauptquest) in die nächste."""
    befunde = []
    schritte = quest["schritte"]
    for i, schritt in enumerate(schritte):
        if i + 1 < len(schritte):
            ziele = [(ziel_des_schritts(welt, schritte[i + 1]), f"Schritt {i + 2}")]
        else:
            ziele = [(ziel_des_starts(welt, q), q["kennung"]) for q in nachfolger(welt, quest)]
        for ziel, wohin in ziele:
            befunde.append(_befund(welt, quest, i, schritt, ziel, wohin))
    return befunde


def _befund(welt: Welt, quest: dict, i: int, schritt: dict, ziel: Ziel, wohin: str) -> Befund:
    """Ein Übergang Schritt i → ``wohin`` eingestuft (ok, fehlt, partie, ausnahme, ohne)."""
    verweis, art = uebergang(welt, schritt)
    beschreibung = f"{wohin}: {ziel.beschreibung}"
    schluessel = f"{quest['kennung']}:{i + 1}"
    if schluessel in AUSNAHMEN:
        return Befund(quest["kennung"], i + 1, "ausnahme", verweis, beschreibung, AUSNAHMEN[schluessel])
    if art == "partie":
        return Befund(quest["kennung"], i + 1, "partie", verweis, beschreibung, "Ergebnisknoten (mittel-3)")
    if art == "ohne":
        return Befund(quest["kennung"], i + 1, "ohne", "", beschreibung, "kein Dialog nach dem Schritt")
    gut, grund = bewerte(welt, verweis, ziel)
    return Befund(quest["kennung"], i + 1, "ok" if gut else "fehlt", verweis, beschreibung, grund)


def pruefe(welt: Welt | None = None) -> list[Befund]:
    """Alle Übergänge aller Quests (Hauptquests und Nebenquests mit mehreren Schritten)."""
    welt = welt or Welt()
    return [b for q in welt.quests for b in pruefe_quest(welt, q)]


def main(argumente: list[str] | None = None) -> int:
    """Druckt die Übergänge ohne Ziel (mit ``--alle`` auch die übrigen); Rückgabe 1 bei Lücken."""
    argumente = sys.argv[1:] if argumente is None else argumente
    befunde = pruefe()
    for befund in befunde:
        if "--alle" in argumente or befund.stufe == "fehlt":
            print(befund)
    zahl = {s: sum(b.stufe == s for b in befunde) for s in ("ok", "fehlt", "partie", "ohne", "ausnahme")}
    print(" · ".join(f"{s}: {n}" for s, n in zahl.items()))
    return 1 if zahl["fehlt"] else 0


if __name__ == "__main__":
    sys.exit(main())
