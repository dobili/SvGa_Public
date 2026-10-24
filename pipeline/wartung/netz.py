"""Abrufe im Netz für die Wartungsprüfungen, nur mit der Standardbibliothek.

Warum ohne weitere Pakete: Der Lauf in GitHub Actions soll schnell starten und nichts
installieren müssen. ``abrufen`` gibt nie eine Ausnahme weiter; ein Netzfehler steht in
``Antwort.fehler``, damit eine einzelne Prüfung ihn als Ampel bewerten kann.
"""

from __future__ import annotations

import json
import urllib.error
import urllib.request
from dataclasses import dataclass, field

#: Wie lange ein Abruf höchstens dauern darf (Sekunden).
ZEITLIMIT_S = 25
#: Größte gelesene Antwort (Bytes); Seiten und Listen sind kleiner.
HOECHSTENS_BYTES = 8 * 1024 * 1024
#: Manche Seiten lehnen Abrufe ohne Browser-Kennung ab; diese nennt den Zweck.
KENNUNG = "Mozilla/5.0 (compatible; SvGa-Wartung/1.0; +https://schach-von-grund-auf.com)"


@dataclass
class Antwort:
    status: int | None
    kopf: dict[str, str] = field(default_factory=dict)
    text: str = ""
    fehler: str | None = None
    ziel: str | None = None  # Ziel einer Weiterleitung, wenn nicht gefolgt wurde

    def json(self) -> object:
        return json.loads(self.text)


class _OhneWeiterleitung(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):  # noqa: ANN001
        return None


def abrufen(
    url: str,
    methode: str = "GET",
    kopf: dict[str, str] | None = None,
    daten: bytes | None = None,
    weiterleiten: bool = True,
) -> Antwort:
    """Ruft eine Adresse ab; Statuscode, Kopfzeilen (klein geschrieben) und Text.

    Beispiel: ``abrufen("https://schach-von-grund-auf.com/version.json").json()`` →
    ``{"version": "0.2.124"}``.
    Sonderfälle: HTTP-Fehler (404 usw.) liefern ihren Status ohne ``fehler``; Netzfehler
    (Zeitüberschreitung, DNS, TLS) liefern ``status=None`` und den Grund in ``fehler``.
    Ohne ``weiterleiten`` steht eine Weiterleitung als 3xx mit ``ziel`` in der Antwort.
    """
    anfrage = urllib.request.Request(url, method=methode, data=daten)
    anfrage.add_header("User-Agent", KENNUNG)
    for name, wert in (kopf or {}).items():
        anfrage.add_header(name, wert)
    oeffner = (
        urllib.request.build_opener() if weiterleiten else urllib.request.build_opener(_OhneWeiterleitung)
    )
    try:
        with oeffner.open(anfrage, timeout=ZEITLIMIT_S) as antwort:
            inhalt = antwort.read(HOECHSTENS_BYTES)
            return Antwort(antwort.status, _kopf(antwort.headers), inhalt.decode("utf-8", "replace"))
    except urllib.error.HTTPError as fehler:
        return Antwort(fehler.code, _kopf(fehler.headers), "", None, fehler.headers.get("Location"))
    except (urllib.error.URLError, TimeoutError, OSError, ValueError) as fehler:
        grund = getattr(fehler, "reason", fehler)
        return Antwort(None, {}, "", str(grund))


def _kopf(kopfzeilen: object) -> dict[str, str]:
    if kopfzeilen is None:
        return {}
    return {name.lower(): wert for name, wert in kopfzeilen.items()}  # type: ignore[attr-defined]
