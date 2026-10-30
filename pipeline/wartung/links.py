"""Prüfung der Links in Buchdaten, Trainingsseiten, Website und App-Texten (R57, Punkt 1).

Warum: Das Buch und die App verweisen auf Literatur, Lichess, Trainingsseiten und Lizenzen.
Verschwindet eine Seite, merkt es sonst niemand. Ampel: 404 oder 410 → rot (Seite weg),
andere Fehler (403, 429, 5xx, Zeitüberschreitung) → gelb, weil viele Seiten automatische
Abrufe ablehnen oder kurz ausfallen. Eine Weiterleitung auf eine andere Domain ist gelb: So
sieht eine abgelaufene Domain aus, die auf eine Parkseite zeigt und trotzdem 200 liefert
(Paket Webverweise, 30.10.2026).
"""

from __future__ import annotations

import re
from collections.abc import Callable, Iterable
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from urllib.parse import urljoin, urlsplit

from .netz import Antwort, abrufen
from .punkte import Ampel, Pruefpunkt

#: Wo Links stehen, je Gruppe (Pfade relativ zum Hauptordner, Muster für glob).
QUELLEN: dict[str, tuple[str, list[str]]] = {
    "links-buch": ("Buchdaten", ["app/public/daten/**/*.json"]),
    "links-training": ("Trainingsseiten", ["inhalte/de/training/*.json", "inhalte/de/werkzeuglinks.json"]),
    "links-website": (
        "Website",
        [
            "app/index.html",
            "app/impressum/index.html",
            "app/datenschutz/index.html",
            "app/installieren/index.html",
            "app/src/startseite/teile/*.html",
        ],
    ),
    "links-app": ("App-Texte und Lizenzen", ["app/src/i18n/*.json", "app/public/lizenzen/*"]),
}

URL_MUSTER = re.compile(r"https?://[^\s\"'<>)\]\\]+")
#: Adressen ohne „https://“, wie sie die Lizenzseite der App nennt („github.com/niklasf/chessops“).
NACKTE_ADRESSE = re.compile(r"(?<![\w./-])github\.com/[\w.-]+(?:/[\w.-]+)?")
#: Eigene Domain prüft die Live-Prüfung; Beispieladressen sind keine echten Ziele.
AUSGENOMMEN = re.compile(r"^https?://([a-z0-9-]+\.)*(schach-von-grund-auf\.com|example\.(org|com))(/|$)")
#: Parallele Abrufe; höflich gegenüber den fremden Seiten.
GLEICHZEITIG = 8
TOT = {404, 410}
#: Ab diesem Statuscode gilt ein Abruf als Fehler.
ERSTER_FEHLERSTATUS = 400
#: Ab diesem Statuscode ist eine Antwort eine Weiterleitung (3xx).
ERSTER_UMLEITUNGSSTATUS = 300


def urls_in(text: str) -> set[str]:
    """Alle Adressen in einem Text, ohne Satzzeichen am Ende und ohne eigene Domain.

    Beispiel: ``"siehe https://lichess.org/learn."`` → ``{"https://lichess.org/learn"}``;
    ``"Quellcode: github.com/niklasf/chessops"`` → ``{"https://github.com/niklasf/chessops"}``.
    """
    funde = {m.group(0).rstrip(".,;:") for m in URL_MUSTER.finditer(text)}
    funde |= {"https://" + m.group(0).rstrip(".,;:") for m in NACKTE_ADRESSE.finditer(text)}
    return {u for u in funde if not AUSGENOMMEN.match(u)}


def sammle(hauptordner: Path, muster: Iterable[str]) -> dict[str, list[str]]:
    """Adresse → Dateien, in denen sie steht."""
    fundorte: dict[str, list[str]] = {}
    for m in muster:
        for datei in sorted(hauptordner.glob(m)):
            if not datei.is_file():
                continue
            for url in urls_in(datei.read_text(encoding="utf-8", errors="replace")):
                fundorte.setdefault(url, []).append(str(datei.relative_to(hauptordner)))
    return fundorte


def bewerte(antwort: Antwort) -> Ampel:
    """Ampel eines Abrufs: 2xx/3xx grün, 404/410 rot, sonst gelb."""
    if antwort.status is not None and antwort.status < ERSTER_FEHLERSTATUS:
        return Ampel.GRUEN
    if antwort.status in TOT:
        return Ampel.ROT
    return Ampel.GELB


def pruefe_url(url: str, abruf: Callable[..., Antwort] = abrufen) -> Antwort:
    """HEAD, bei Ablehnung von HEAD (405, 403, 501) noch einmal mit GET."""
    antwort = abruf(url, "HEAD")
    if antwort.status in {403, 405, 501} or antwort.status is None:
        antwort = abruf(url, "GET")
    return antwort


def _domain(url: str) -> str:
    """Rechnername ohne „www.“ und ohne Port: ``https://www.chessgames.com:443/`` → ``chessgames.com``."""
    name = urlsplit(url).hostname or ""
    return name.removeprefix("www.")


def fremde_weiterleitung(url: str, abruf: Callable[..., Antwort] = abrufen) -> str | None:
    """Ziel, wenn die Adresse auf eine andere Domain weiterleitet, sonst ``None``.

    Beispiel: ``https://365chess.com`` → ``https://www.365chess.com/`` ist dieselbe Domain (None);
    eine abgelaufene Domain, die zu einer Parkseite springt, liefert deren Adresse.
    """
    erste = abruf(url, "HEAD", weiterleiten=False)
    umleitung = erste.status is not None and ERSTER_UMLEITUNGSSTATUS <= erste.status < ERSTER_FEHLERSTATUS
    if not umleitung or not erste.ziel:
        return None
    ziel = urljoin(url, erste.ziel)
    return ziel if _domain(ziel) != _domain(url) else None


def pruefe_links(hauptordner: Path, abruf: Callable[..., Antwort] = abrufen) -> list[Pruefpunkt]:
    """Ein Punkt je Quelle; der Text nennt jede auffällige Adresse mit Grund und Fundort."""
    punkte = []
    for kennung, (titel, muster) in QUELLEN.items():
        fundorte = sammle(hauptordner, muster)
        with ThreadPoolExecutor(GLEICHZEITIG) as pool:
            antworten = dict(zip(fundorte, pool.map(lambda u: pruefe_url(u, abruf), fundorte), strict=True))
            umleitungen = dict(
                zip(fundorte, pool.map(lambda u: fremde_weiterleitung(u, abruf), fundorte), strict=True)
            )
        auffaellig = []
        ampeln = []
        for url, antwort in sorted(antworten.items()):
            ampel = bewerte(antwort)
            grund: object = antwort.status or antwort.fehler
            if ampel == Ampel.GRUEN and umleitungen[url]:
                ampel, grund = Ampel.GELB, f"umgeleitet nach {umleitungen[url]}"
            ampeln.append(ampel)
            if ampel != Ampel.GRUEN:
                auffaellig.append(f"{grund}: {url} ({', '.join(fundorte[url][:2])})")
        gesamt = Ampel.ROT if Ampel.ROT in ampeln else Ampel.GELB if auffaellig else Ampel.GRUEN
        text = "\n".join(auffaellig) or f"{len(fundorte)} Adressen erreichbar"
        punkte.append(Pruefpunkt(kennung, "Links", titel, gesamt, text))
    return punkte
