"""Kleiner Ink-Leser für die Prüfung der Besuchszähler: Zeilen, Namen und der Fluss zwischen ihnen.

Warum: Die Prüfung ``pipeline.abenteuer.inkbesuche`` muss wissen, welche Zeilen eines Dialogs von
einem Startknoten aus vor einer Bedingung durchlaufen sein können. Dafür genügt ein einfacher Leser,
kein voller Ink-Parser: Er kennt Knoten (``== name ==``), Stitches (``= name``), Labels
(``- (name)``, ``* (name)``), Wahlen, Sammler, mehrzeilige Blöcke in geschweiften Klammern,
Umleitungen (``-> ziel``), Tunnel (``-> ziel ->`` und ``->->``) und Aufrufe von Ink-Funktionen.

Der Fluss ist ein Graph über die Zeilen einer Datei (Nachfolger je Zeile). Er ist bewusst einfach:
ohne Aufrufstapel (zwei Tunnelaufrufe desselben Ziels teilen sich die Rückkehr) und ohne Werte von
Variablen (jede Bedingung kann wahr oder falsch sein). Was der Leser nicht versteht (INCLUDE,
Wahlen in Blöcken), meldet er in ``Fluss.luecken``; die Prüfung stuft solche Dateien als „unsicher“
ein.

Abhängigkeiten: nur die Standardbibliothek. Genutzt von pipeline/abenteuer/inkbesuche.py.
"""

import re
from dataclasses import dataclass, field

KNOTEN = re.compile(r"^\s*={2,}\s*(function\s+)?(\w+)\s*(?:\(([^)]*)\))?\s*=*\s*$")
STITCH = re.compile(r"^\s*=\s*(\w+)\s*(?:\(([^)]*)\))?\s*$")
DEKLARATION = re.compile(r"^\s*(VAR|CONST|LIST|EXTERNAL|INCLUDE)\b\s*(\w+)?")
WAHL = re.compile(r"^\s*((?:[*+]\s*)+)(?:\(\s*(\w+)\s*\))?")
SAMMLER = re.compile(r"^\s*((?:-(?!>)\s*)+)(?:\(\s*(\w+)\s*\))?")
TEMP = re.compile(r"^\s*~\s*temp\s+(\w+)")
ZEICHENKETTE = re.compile(r'"[^"]*"')
# Umleitungsziel als Wert (TURNS_SINCE(-> x), READ_COUNT(-> x)): keine Umleitung im Fluss.
ZIELWERT = re.compile(r"\b[A-Z_]+\(\s*->\s*[\w.]+\s*\)")
# Eine Kette von Umleitungen: „-> a“, „-> a ->“ (Tunnel), „->->“ (Rückkehr), „-> a -> b“.
KETTE = re.compile(r"(?:->\s*(?:[\w.]+(?:\([^()]*\))?)?\s*)+")
KETTENGLIED = re.compile(r"->\s*([\w.]+)?")
FADEN = re.compile(r"<-\s*([\w.]+)")
AUFRUF = re.compile(r"\b(\w+)\s*\(")
ENDEN = ("END", "DONE")


@dataclass
class Zeile:
    """Eine Inhaltszeile der Ink-Datei (ohne Kommentar), mit ihrer Rolle im Aufbau."""

    nummer: int
    text: str
    art: str = "sonst"  # knoten, stitch, wahl, sammler, deklaration, sonst
    name: str = ""  # Name des Knotens, des Stitches oder des Labels
    tiefe: int = 0  # Zahl der Zeichen * + - vor einer Wahl oder einem Sammler
    ebene: int = 0  # Tiefe der Wahl, in deren Inhalt die Zeile steht (0: keine)
    knoten: str = ""
    stitch: str = ""
    kopf: int | None = None  # Zeile, die den offenen mehrzeiligen Block begonnen hat


@dataclass
class Fluss:
    """Die gelesene Datei: Zeilen, Namen, Variablen und die Nachfolger je Zeile."""

    zeilen: list[Zeile] = field(default_factory=list)
    nachfolger: dict[int, set[int]] = field(default_factory=dict)
    globale: set[str] = field(default_factory=set)  # VAR, CONST, LIST
    lokale: dict[str, set[str]] = field(default_factory=dict)  # je Knoten: temp und Parameter
    funktionen: set[str] = field(default_factory=set)  # Ink-Funktionen und EXTERNAL
    namen: dict[tuple[str, ...], int] = field(default_factory=dict)  # (knoten[, stitch][, label])
    luecken: list[str] = field(default_factory=list)  # was der Leser nicht versteht


def ohne_kommentar(text: str) -> str:
    """Schneidet den Zeilenkommentar ab (``// …``); Text in Ink enthält sonst kein ``//``."""
    return text.split("//", 1)[0].rstrip()


def lies(quelle: str) -> Fluss:
    """Liest eine Ink-Datei und baut den Fluss zwischen ihren Zeilen.

    Zweck und Warum: Grundlage der Prüfung der Besuchszähler (Dateikopf).
    Eingabe: der Text der Ink-Datei. Ausgabe: ``Fluss`` mit Zeilen, Namen und Nachfolgern.
    Beispiel: In desert-springs-garage.ink führt ``mira_erinnerung`` über die letzte Zeile
    ``-> mira_erinnerung_wahl`` zum Kopf dieses Knotens; umgekehrt gibt es keinen Weg.
    Sonderfälle: Leere Zeilen und Kommentare fallen weg; Inhalt vor dem ersten Knoten zählt zum
    Knoten mit leerem Namen und ist von keinem Startknoten aus erreichbar.
    """
    fluss = Fluss()
    _lies_zeilen(quelle, fluss)
    for index in range(len(fluss.zeilen)):
        fluss.nachfolger[index] = _nachfolger(fluss, index)
    _verbinde_bloecke(fluss)
    _verbinde_tunnel(fluss)
    return fluss


def _lies_zeilen(quelle: str, fluss: Fluss) -> None:
    """Ordnet jede Zeile ein (Knoten, Stitch, Wahl, Sammler, Block) und sammelt die Namen."""
    offen: list[int] = []  # Köpfe der offenen mehrzeiligen Blöcke
    knoten, stitch, ebene = "", "", 0
    for nummer, roh in enumerate(quelle.split("\n"), start=1):
        text = ohne_kommentar(roh)
        if not text.strip():
            continue
        zeile = Zeile(nummer, text, knoten=knoten, stitch=stitch, kopf=offen[-1] if offen else None)
        if not offen:
            _ordne_ein(zeile, fluss)
        if zeile.art == "knoten":
            knoten, stitch, ebene = zeile.name, "", 0
        elif zeile.art == "stitch":
            stitch, ebene = zeile.name, 0
        elif zeile.art == "wahl":
            ebene = zeile.tiefe
        elif zeile.art == "sammler":
            ebene = zeile.tiefe - 1
        elif offen and re.match(r"^\s*[*+]", text):
            fluss.luecken.append(f"Zeile {nummer}: Wahl in einem mehrzeiligen Block")
        zeile.knoten, zeile.stitch, zeile.ebene = knoten, stitch, ebene
        _merke_namen(zeile, fluss)
        fluss.zeilen.append(zeile)
        _zaehle_klammern(text, len(fluss.zeilen) - 1, offen)


def _ordne_ein(zeile: Zeile, fluss: Fluss) -> None:
    """Bestimmt Art, Name und Tiefe einer Zeile außerhalb mehrzeiliger Blöcke."""
    text = zeile.text
    if treffer := KNOTEN.match(text):
        zeile.art, zeile.name = "knoten", treffer.group(2)
        if treffer.group(1):
            fluss.funktionen.add(zeile.name)
        fluss.lokale.setdefault(zeile.name, set()).update(_parameter(treffer.group(3)))
    elif treffer := STITCH.match(text):
        zeile.art, zeile.name = "stitch", treffer.group(1)
        fluss.lokale.setdefault(zeile.knoten, set()).update(_parameter(treffer.group(2)))
    elif treffer := DEKLARATION.match(text):
        zeile.art = "deklaration"
        _merke_deklaration(treffer.group(1), treffer.group(2) or "", text, fluss)
    elif treffer := WAHL.match(text):
        zeile.art, zeile.name = "wahl", treffer.group(2) or ""
        zeile.tiefe = len(re.findall(r"[*+]", treffer.group(1)))
    elif treffer := SAMMLER.match(text):
        zeile.art, zeile.name = "sammler", treffer.group(2) or ""
        zeile.tiefe = treffer.group(1).count("-")


def _parameter(liste: str | None) -> set[str]:
    """Die Namen der Parameter eines Knotens („ref x, -> ziel“ → x, ziel)."""
    return {teil.split()[-1].lstrip("->").strip() for teil in (liste or "").split(",") if teil.strip()}


def _merke_deklaration(art: str, name: str, text: str, fluss: Fluss) -> None:
    """Trägt VAR, CONST und LIST als Variablen ein, EXTERNAL als Funktion; INCLUDE ist eine Lücke."""
    if art == "INCLUDE":
        fluss.luecken.append(f"INCLUDE wird nicht gelesen: {text.strip()}")
    elif art == "EXTERNAL":
        fluss.funktionen.add(name)
    else:
        fluss.globale.add(name)
        if art == "LIST":
            fluss.globale.update(re.findall(r"\w+", text.split("=", 1)[-1]))


def _merke_namen(zeile: Zeile, fluss: Fluss) -> None:
    """Trägt Knoten, Stitches und Labels mit ihrer Zeile ein; temp-Variablen je Knoten."""
    index = len(fluss.zeilen)
    if zeile.art == "knoten":
        fluss.namen[(zeile.name,)] = index
    elif zeile.art == "stitch":
        fluss.namen[(zeile.knoten, zeile.name)] = index
    elif zeile.name:
        pfad = (zeile.knoten, zeile.stitch, zeile.name) if zeile.stitch else (zeile.knoten, zeile.name)
        fluss.namen[pfad] = index
        fluss.namen.setdefault((zeile.knoten, zeile.name), index)
    if treffer := TEMP.match(zeile.text):
        fluss.lokale.setdefault(zeile.knoten, set()).add(treffer.group(1))


def _zaehle_klammern(text: str, index: int, offen: list[int]) -> None:
    """Führt Buch über mehrzeilige Blöcke: jede offene ``{`` merkt sich ihre Zeile."""
    for zeichen in ZEICHENKETTE.sub("", text):
        if zeichen == "{":
            offen.append(index)
        elif zeichen == "}" and offen:
            offen.pop()


def ziel(fluss: Fluss, name: str, zeile: Zeile) -> int | None:
    """Löst einen Namen wie in Ink auf: Label, dann Stitch im selben Knoten, dann Knoten.

    Eingaben: der Name (auch mit Pfad ``knoten.stitch``) und die Zeile, in der er steht.
    Ausgabe: die Zeile des Kopfes oder Labels; None, wenn es den Namen in der Datei nicht gibt.
    Beispiel: ``warum_atme`` in ``mira_nach_sieg`` meint den Stitch ``mira_nach_sieg.warum_atme``.
    """
    teile = tuple(name.split("."))
    versuche = [
        (zeile.knoten, zeile.stitch, *teile),
        (zeile.knoten, *teile),
        teile,
    ]
    for pfad in versuche:
        if pfad in fluss.namen:
            return fluss.namen[pfad]
    return None


@dataclass
class Umleitung:
    """Was die Umleitungen einer Zeile bewirken."""

    tunnel: list[int] = field(default_factory=list)  # Ziele von „-> ziel ->“
    spruenge: list[int] = field(default_factory=list)  # Ziele von „-> ziel“
    rueckkehr: bool = False  # „->->“
    endet: bool = False  # die Zeile läuft nicht in die nächste weiter


def umleitungen(fluss: Fluss, index: int) -> Umleitung:
    """Liest die Umleitungen einer Zeile; in ``{…}`` auf derselben Zeile gelten sie als bedingt."""
    zeile = fluss.zeilen[index]
    text = ZIELWERT.sub("", ZEICHENKETTE.sub('""', zeile.text))
    ergebnis = Umleitung()
    for kette in KETTE.finditer(text):
        glieder = KETTENGLIED.findall(kette.group(0))
        bedingt = text[: kette.start()].count("{") > text[: kette.start()].count("}")
        letztes = glieder[-1]
        if glieder[:2] == ["", ""]:
            ergebnis.rueckkehr = True
        ergebnis.tunnel += _zeilen_zu(fluss, glieder[:-1], zeile)
        ergebnis.spruenge += _zeilen_zu(fluss, [letztes], zeile)
        if (letztes or ergebnis.rueckkehr) and not bedingt:
            ergebnis.endet = True
    return ergebnis


def _zeilen_zu(fluss: Fluss, namen: list[str], zeile: Zeile) -> list[int]:
    """Die Zeilen zu Umleitungszielen; END, DONE und Unbekanntes (Variablen) fallen weg."""
    gefunden = [ziel(fluss, name, zeile) for name in namen if name and name not in ENDEN]
    return [index for index in gefunden if index is not None]


def _nachfolger(fluss: Fluss, index: int) -> set[int]:
    """Die Zeilen, die direkt nach dieser Zeile folgen können (ohne Rückkehr aus Tunneln)."""
    zeile = fluss.zeilen[index]
    if zeile.art == "deklaration":
        return set()
    folgen: set[int] = set()
    umleitung = umleitungen(fluss, index)
    folgen.update(umleitung.spruenge)
    folgen.update(_zeilen_zu(fluss, FADEN.findall(zeile.text), zeile))
    for name in AUFRUF.findall(zeile.text):
        if (name,) in fluss.namen and name in fluss.funktionen and zeile.art != "knoten":
            folgen.add(fluss.namen[(name,)])
    if zeile.art == "wahl" and (geschwister := _naechste_wahl(fluss, index)) is not None:
        folgen.add(geschwister)
    # Ein Tunnel läuft erst nach seiner Rückkehr weiter (_verbinde_tunnel), außer er ist bedingt.
    if not umleitung.endet and not (umleitung.tunnel and _unbedingt(zeile)):
        folgen.update(weiter(fluss, index))
    folgen.update(umleitung.tunnel)
    return folgen


def _unbedingt(zeile: Zeile) -> bool:
    """Wahr, wenn die Zeile keine Bedingung in ``{…}`` trägt (der Tunnel also immer läuft)."""
    return "{" not in zeile.text


def _im_selben_abschnitt(a: Zeile, b: Zeile) -> bool:
    """Wahr, wenn beide Zeilen im selben Knoten und Stitch stehen."""
    return a.knoten == b.knoten and a.stitch == b.stitch


def weiter(fluss: Fluss, index: int) -> set[int]:
    """Wohin der Fluss läuft, wenn der Inhalt der Zeile zu Ende ist.

    Ausgabe: höchstens eine Zeile. Am Ende eines Wahlinhalts ist das der nächste Sammler, sonst
    die nächste Zeile. Sonderfälle: Nur ein leerer Knotenkopf läuft in seinen ersten Stitch; am
    Ende eines Stitches oder Knotens endet der Fluss.
    """
    zeilen = fluss.zeilen
    if index + 1 >= len(zeilen):
        return set()
    zeile, naechste = zeilen[index], zeilen[index + 1]
    if naechste.art == "knoten" or (naechste.art == "stitch" and zeile.art != "knoten"):
        return set()
    if naechste.art == "wahl" and zeile.ebene >= naechste.tiefe:
        return _naechster_sammler(fluss, index + 1)
    return {index + 1}


def _naechster_sammler(fluss: Fluss, ab: int) -> set[int]:
    """Der Sammler, der die Wahl in Zeile ``ab`` schließt (Tiefe höchstens die der Wahl)."""
    wahl = fluss.zeilen[ab]
    for index in range(ab + 1, len(fluss.zeilen)):
        zeile = fluss.zeilen[index]
        if not _im_selben_abschnitt(wahl, zeile):
            break
        if zeile.art == "sammler" and zeile.tiefe <= wahl.tiefe:
            return {index}
    return set()


def _naechste_wahl(fluss: Fluss, index: int) -> int | None:
    """Die nächste Wahl derselben Auswahl (gleiche Tiefe, vor dem schließenden Sammler)."""
    wahl = fluss.zeilen[index]
    for folgend in range(index + 1, len(fluss.zeilen)):
        zeile = fluss.zeilen[folgend]
        if not _im_selben_abschnitt(wahl, zeile):
            return None
        if zeile.art == "sammler" and zeile.tiefe <= wahl.tiefe:
            return None
        if zeile.art == "wahl" and zeile.tiefe < wahl.tiefe:
            return None
        if zeile.art == "wahl" and zeile.tiefe == wahl.tiefe:
            return folgend
    return None


def _verbinde_bloecke(fluss: Fluss) -> None:
    """Der Kopf eines mehrzeiligen Blocks führt zu jedem Fall (``- bedingung:``) und zum Ende."""
    for index, zeile in enumerate(fluss.zeilen):
        if zeile.kopf is None:
            continue
        ist_fall = re.match(r"^\s*-(?!>)", zeile.text) is not None
        ist_ende = index + 1 >= len(fluss.zeilen) or fluss.zeilen[index + 1].kopf != zeile.kopf
        if ist_fall or ist_ende:
            fluss.nachfolger[zeile.kopf].add(index)


def erreichbar(fluss: Fluss, start: int, ohne: int | None = None) -> set[int]:
    """Alle Zeilen, die von ``start`` aus erreichbar sind, ``start`` eingeschlossen.

    Eingaben: die Startzeile; ``ohne`` sperrt eine Zeile (Wege durch sie zählen nicht).
    Ausgabe: die Menge der Zeilen. Sonderfall: Ist ``start`` selbst gesperrt, ist sie leer.
    """
    if start == ohne:
        return set()
    gesehen, offen = {start}, [start]
    while offen:
        for folge in fluss.nachfolger[offen.pop()]:
            if folge not in gesehen and folge != ohne:
                gesehen.add(folge)
                offen.append(folge)
    return gesehen


def _verbinde_tunnel(fluss: Fluss) -> None:
    """Verbindet jede Rückkehr ``->->`` mit den Zeilen nach den Tunnelaufrufen, die sie erreichen.

    Warum: Nach ``-> ziel ->`` läuft der Aufrufer erst weiter, wenn das Ziel zurückkehrt; so liegt
    das Ziel auf jedem Weg hinter dem Aufruf. Wiederholt, bis sich nichts mehr ändert (Tunnel in
    Tunneln). Sonderfall: Findet sich keine Rückkehr, läuft der Aufrufer vorsichtshalber direkt
    weiter.
    """
    aufrufe = [(i, umleitungen(fluss, i)) for i in range(len(fluss.zeilen))]
    aufrufe = [(i, u) for i, u in aufrufe if u.tunnel]
    geaendert = True
    while geaendert:
        geaendert = False
        for index, umleitung in aufrufe:
            danach = set(umleitung.spruenge) or weiter(fluss, index)
            for tunnelziel in umleitung.tunnel:
                rueck = [z for z in erreichbar(fluss, tunnelziel) if umleitungen(fluss, z).rueckkehr]
                for quelle in rueck or [index]:
                    if not danach <= fluss.nachfolger[quelle]:
                        fluss.nachfolger[quelle] |= danach
                        geaendert = True
