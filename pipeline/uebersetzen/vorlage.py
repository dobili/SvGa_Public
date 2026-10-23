"""Textteile des Buches als übersetzbare Vorlage und zurück (englische Fassung, Paket P6).

Wozu diese Datei da ist:
    Eine Bildunterschrift besteht aus Teilen (Text, Zug, Verweis, Glossarbegriff …,
    ``lesen/text.py``). Übersetzt man jeden Teil für sich, kann der englische Satz die Züge nicht
    umstellen („Weiß hat mit 5. Sf3 entwickelt“ → „With 5. Nf3 White has developed“). Deshalb wird
    eine ganze Teilliste zu einem Satz mit Platzhaltern, der als Ganzes übersetzt wird:

        „Nach “, zug „2. Lf4“, „ – “, fett „Ziel 1“   →   „Nach {z1} – <b>Ziel 1</b>“
        englische Vorlage „After {z1} – <b>Goal 1</b>“   →   „After “, zug „2. Bf4“, „ – “, fett „Goal 1“

    Platzhalter, deren Inhalt die Schicht selbst überträgt: ``{zN}`` Zug (deutsche Figurenbuchstaben
    werden englisch), ``{vN}`` Verweis („Abb. 1.8“ → „Fig. 1.8“), ``{sN}`` Stelle im Buch
    („Abschnitt 7.2“ → „Section 7.2“), ``{cN}`` Zeichen der Bilanzen (✓ ◐ ✗), ``{p}`` Absatz.
    Vom Übersetzer geschrieben: ``<b>…</b>`` fett, ``<i>…</i>`` kursiv, ``<gN>…</gN>``
    Glossarbegriff (Ziel des Verweises aus der Glossartabelle).

Regeln, damit nichts verloren geht: Jeder Platzhalter der deutschen Vorlage steht genau einmal in
der englischen, kein anderer kommt dazu, Tags werden nicht verschachtelt. Sonst ``VorlagenFehler``.

Rolle im Gesamtbild: Kern der Übersetzungsschicht ``pipeline/uebersetzen``; ``felder.py`` findet
die Teillisten, ``__main__.py`` baut daraus die englischen App-Daten.
"""

from __future__ import annotations

import re
from collections.abc import Callable
from typing import Any

from pipeline.lesen.zugfolgen import FIGURENBUCHSTABEN

Textteil = dict[str, Any]

# Textarten mit eigenem Platzhalter (Kennbuchstabe in der Vorlage).
_PLATZHALTER = {"zug": "z", "verweis": "v", "stelle": "s", "zeichen": "c"}
_STILTAGS = {"fett": "b", "kursiv": "i"}
_TAGSTILE = {tag: stil for stil, tag in _STILTAGS.items()}
_TOKEN = re.compile(r"<([bi])>(.*?)</\1>|<g(\d+)>(.*?)</g\3>|\{([zvsc])(\d+)\}|\{p\}", re.DOTALL)
# Zeichen, die in der Vorlage eine Bedeutung haben und im Fließtext nicht vorkommen dürfen.
_STEUERZEICHEN = re.compile(r"[<>{}]")
# Deutscher Figurenbuchstabe am Zuganfang (wie buchzugInSprache in app/src/schach/notation.ts).
_FIGUR_AM_ZUG = re.compile(r"\b([KDTLS])(?=[a-h1-8x])")
_FIGUR_UMWANDLUNG = re.compile(r"=([DTLS])")
_VERWEIS = re.compile(r"^Abb\.(\s|\xa0)(\d+\.\d+)$")
_STELLE = re.compile(r"^(Kapitel|Abschnitt) (\d+(?:\.\d+)?)$")
_STELLENWORT = {"Kapitel": "Chapter", "Abschnitt": "Section"}


class VorlagenFehler(ValueError):
    """Englische Vorlage passt nicht zur deutschen (Platzhalter fehlt, doppelt, unbekannt)."""


def zug_auf_englisch(zug: str) -> str:
    """Ein Zug oder eine Zugfolge des Buches mit englischen Figurenbuchstaben.

    Warum: Englische Leser kennen Bf4, nicht Lf4 (ENGLISCH_BEGRIFFE.md, Notation).
    Beispiel: „4. Sc3! Lc5 5. Sd5!“ → „4. Nc3! Bc5 5. Nd5!“; „e8=D+“ → „e8=Q+“.
    Sonderfall: schon englische Züge bleiben unverändert („Nf3“), weil N, B, R, Q keine deutschen
    Buchstaben sind; K bleibt K.
    """
    zug = _FIGUR_AM_ZUG.sub(lambda m: FIGURENBUCHSTABEN[m.group(1)], zug)
    return _FIGUR_UMWANDLUNG.sub(lambda m: "=" + FIGURENBUCHSTABEN[m.group(1)], zug)


def _automatischer_text(teil: Textteil) -> str:
    """Englischer Text der Teile, die die Schicht selbst überträgt (Zug, Verweis, Stelle)."""
    art, text = teil["art"], teil["text"]
    if art == "zug":
        return zug_auf_englisch(text)
    if art == "verweis":
        treffer = _VERWEIS.match(text)
        if not treffer:
            raise VorlagenFehler(f"unbekannter Verweis „{text}“")
        return f"Fig.{treffer.group(1)}{treffer.group(2)}"
    if art == "stelle":
        treffer = _STELLE.match(text)
        if not treffer:
            raise VorlagenFehler(f"unbekannte Stelle „{text}“")
        return f"{_STELLENWORT[treffer.group(1)]} {treffer.group(2)}"
    return text


def _pruefe_fliesstext(text: str) -> str:
    if _STEUERZEICHEN.search(text):
        raise VorlagenFehler(f"Steuerzeichen < > {{ }} im Buchtext: „{text}“")
    return text


def vorlage_aus_teilen(teile: list[Textteil]) -> str:
    """Schreibt eine Teilliste als Vorlage mit Platzhaltern.

    Beispiel (Abb. 1.2): [„Nach “, zug „2. Lf4“, „ – “, fett „Ziel 1“] → „Nach {z1} – <b>Ziel 1</b>“.
    Sonderfall: Zeichen < > { } im Text gibt es im Buch nicht; kämen sie vor, bricht die Schicht ab.
    """
    zaehler = {kenn: 0 for kenn in (*_PLATZHALTER.values(), "g")}
    stuecke: list[str] = []
    for teil in teile:
        art = teil["art"]
        if art in _PLATZHALTER:
            kenn = _PLATZHALTER[art]
            zaehler[kenn] += 1
            stuecke.append(f"{{{kenn}{zaehler[kenn]}}}")
        elif art == "absatz":
            stuecke.append("{p}")
        elif art == "begriff":
            zaehler["g"] += 1
            stuecke.append(f"<g{zaehler['g']}>{_pruefe_fliesstext(teil['text'])}</g{zaehler['g']}>")
        else:
            text = _pruefe_fliesstext(teil["text"])
            tag = _STILTAGS.get(teil.get("stil", "normal"))
            stuecke.append(f"<{tag}>{text}</{tag}>" if tag else text)
    return "".join(stuecke)


def platzhalter(vorlage: str) -> list[str]:
    """Alle Platzhalter und Begriffstags einer Vorlage, sortiert („{z1}“, „<g1>“, „{p}“ …)."""
    gefunden = re.findall(r"\{[zvsc]\d+\}|\{p\}|<g\d+>", vorlage)
    return sorted(gefunden)


def _platzhalter_der_teile(teile: list[Textteil]) -> dict[str, Textteil]:
    """Ordnet jedem Platzhalter („z1“, „g2“, „p1“) seinen deutschen Teil zu."""
    zuordnung: dict[str, Textteil] = {}
    zaehler: dict[str, int] = {}
    for teil in teile:
        art = teil["art"]
        kenn = _PLATZHALTER.get(art) or {"begriff": "g", "absatz": "p"}.get(art)
        if kenn:
            zaehler[kenn] = zaehler.get(kenn, 0) + 1
            zuordnung[f"{kenn}{zaehler[kenn]}"] = teil
    return zuordnung


def platzhaltertexte(teile: list[Textteil]) -> dict[str, str]:
    """Was die Platzhalter auf Englisch zeigen, als Hilfe für den Übersetzer.

    Beispiel (Abb. 1.2): {„z1“: „2. Bf4“}; Begriffe zeigen ihren deutschen Text („g1“: „Zugzwang“).
    """
    return {
        kenn: teil["text"] if kenn.startswith("g") else _automatischer_text(teil)
        for kenn, teil in _platzhalter_der_teile(teile).items()
        if not kenn.startswith("p")
    }


def _neuer_text(text: str, stil: str) -> Textteil:
    return {"art": "text", "text": _pruefe_fliesstext(text), "stil": stil}


def _teil_zum_token(
    treffer: re.Match[str],
    deutsch: dict[str, Textteil],
    benutzt: list[str],
    begriff_auf_englisch: Callable[[str], str],
) -> Textteil:
    """Der englische Teil zu einem Tag oder Platzhalter der Vorlage."""
    if treffer.group(1):
        return _neuer_text(treffer.group(2), _TAGSTILE[treffer.group(1)])
    if treffer.group(3):
        kenn = f"g{treffer.group(3)}"
    elif treffer.group(5):
        kenn = f"{treffer.group(5)}{treffer.group(6)}"
    else:
        # Absätze sind nicht nummeriert: der nächste noch nicht benutzte.
        kenn = f"p{sum(1 for b in benutzt if b.startswith('p')) + 1}"
    if kenn not in deutsch:
        raise VorlagenFehler(f"Platzhalter {kenn} gibt es im Deutschen nicht")
    if kenn in benutzt:
        raise VorlagenFehler(f"Platzhalter {kenn} doppelt")
    benutzt.append(kenn)
    original = deutsch[kenn]
    if kenn.startswith("g"):
        inhalt = _pruefe_fliesstext(treffer.group(4))
        return {**original, "text": inhalt, "begriff": begriff_auf_englisch(original["begriff"])}
    return {**original, "text": _automatischer_text(original)}


def teile_aus_vorlage(
    vorlage: str,
    deutsche_teile: list[Textteil],
    begriff_auf_englisch: Callable[[str], str] = lambda begriff: begriff,
) -> list[Textteil]:
    """Baut aus einer englischen Vorlage die englische Teilliste.

    Eingaben: englische Vorlage, die deutschen Teile (für Züge, Verweise, Anker, Zeichen),
    Umrechnung eines deutschen Glossarbegriffs in den englischen (Ziel der Glossarverweise).
    Ausgabe: Teile wie im Schema ``text.schema.json``; benachbarte Texte gleichen Stils verbunden.
    Beispiel (Abb. 1.2): „After {z1} – <b>Goal 1</b>“ → [„After “, zug „2. Bf4“, „ – “, fett „Goal 1“].
    Sonderfälle: fehlender, doppelter oder unbekannter Platzhalter → VorlagenFehler.
    """
    deutsch = _platzhalter_der_teile(deutsche_teile)
    benutzt: list[str] = []
    teile: list[Textteil] = []
    rest = 0
    for treffer in _TOKEN.finditer(vorlage):
        if treffer.start() > rest:
            teile.append(_neuer_text(vorlage[rest : treffer.start()], "normal"))
        teile.append(_teil_zum_token(treffer, deutsch, benutzt, begriff_auf_englisch))
        rest = treffer.end()
    if rest < len(vorlage):
        teile.append(_neuer_text(vorlage[rest:], "normal"))
    fehlend = sorted(set(deutsch) - set(benutzt))
    if fehlend:
        raise VorlagenFehler(f"Platzhalter fehlen: {', '.join(fehlend)}")
    return _verbinde(teile)


def _verbinde(teile: list[Textteil]) -> list[Textteil]:
    """Verbindet benachbarte Texte gleichen Stils und lässt leere Texte weg (Schema: minLength 1)."""
    ergebnis: list[Textteil] = []
    for teil in teile:
        if teil["art"] == "text" and teil["text"] == "":
            continue
        vorher = ergebnis[-1] if ergebnis else None
        if vorher and vorher["art"] == "text" == teil["art"] and vorher["stil"] == teil["stil"]:
            vorher["text"] += teil["text"]
        else:
            ergebnis.append(dict(teil))
    return ergebnis
