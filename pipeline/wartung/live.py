"""Prüfung der Live-Seite schach-von-grund-auf.com (R57, Punkte 3 und 8).

Was geprüft wird:
    - Version: /version.json zeigt die Version aus app/package.json (nach einem Push nach main
      wartet die Prüfung, bis Cloudflare den neuen Stand ausliefert).
    - Seiten und Dateien: Startseite, App, Service Worker, Manifest, robots.txt, sitemap.xml.
    - Sicherheits-Kopfzeilen aus app/public/_headers.
    - Dashboard gesperrt: /admin/ und /api/admin/ dürfen ohne Anmeldung nie 200 liefern.
    - Zertifikat und Domain: Ablaufdatum (TLS und RDAP).
"""

from __future__ import annotations

import json
import socket
import ssl
import time
from collections.abc import Callable
from datetime import UTC, datetime
from pathlib import Path

from .netz import Antwort, abrufen
from .punkte import Ampel, Pruefpunkt

SEITE = "https://schach-von-grund-auf.com"
DOMAIN = "schach-von-grund-auf.com"
PFADE = ["/", "/app/", "/sw.js", "/manifest.webmanifest", "/robots.txt", "/sitemap.xml", "/training/"]
KOPFZEILEN = ["x-content-type-options", "x-frame-options", "referrer-policy", "permissions-policy"]
GESPERRT = ["/admin/", "/api/admin/uebersicht"]
#: Ablauf: unter so vielen Tagen rot, unter dem zweiten Wert gelb. Cloudflare erneuert das
#: Zertifikat erst etwa 30 Tage vor Ablauf, deshalb beim Zertifikat engere Grenzen.
ZERTIFIKAT_TAGE = (7, 14)
DOMAIN_TAGE = (30, 60)
TLS_PORT = 443
#: Abstand zwischen zwei Abfragen der Version, während auf das Ausrollen gewartet wird.
WARTEN_TAKT_S = 30
ERFOLG = 200
SEKUNDEN_JE_TAG = 86400


def erwartete_version(hauptordner: Path) -> str:
    paket = json.loads((hauptordner / "app/package.json").read_text(encoding="utf-8"))
    return str(paket["version"])


def live_version(abruf: Callable[..., Antwort] = abrufen) -> str | None:
    antwort = abruf(f"{SEITE}/version.json?t={int(time.time())}")
    if antwort.status != ERFOLG:
        return None
    try:
        return str(antwort.json()["version"])  # type: ignore[index]
    except (ValueError, KeyError, TypeError):
        return None


def pruefe_version(erwartet: str, warten_s: int, abruf: Callable[..., Antwort] = abrufen) -> Pruefpunkt:
    """Wartet höchstens ``warten_s`` Sekunden, bis die Live-Seite die erwartete Version zeigt."""
    ende = time.monotonic() + warten_s
    gefunden = live_version(abruf)
    while gefunden != erwartet and time.monotonic() < ende:
        time.sleep(WARTEN_TAKT_S)
        gefunden = live_version(abruf)
    if gefunden == erwartet:
        return Pruefpunkt("live-version", "Live", "Version", Ampel.GRUEN, f"{gefunden} wie main")
    text = f"live {gefunden or 'unbekannt'}, main {erwartet}: Cloudflare-Build prüfen"
    return Pruefpunkt("live-version", "Live", "Version", Ampel.ROT, text)


def pruefe_seiten(abruf: Callable[..., Antwort] = abrufen) -> list[Pruefpunkt]:
    """Seiten erreichbar, Kopfzeilen gesetzt, Dashboard gesperrt."""
    fehlen = [f"{p}: {a.status or a.fehler}" for p in PFADE if (a := abruf(SEITE + p)).status != ERFOLG]
    startseite = abruf(SEITE + "/")
    ohne_kopf = [k for k in KOPFZEILEN if k not in startseite.kopf]
    offen = [p for p in GESPERRT if abruf(SEITE + p, weiterleiten=False).status == ERFOLG]
    return [
        Pruefpunkt(
            "live-seiten",
            "Live",
            "Seiten und Dateien",
            Ampel.ROT if fehlen else Ampel.GRUEN,
            "\n".join(fehlen) or f"{len(PFADE)} Adressen mit 200",
        ),
        Pruefpunkt(
            "live-kopfzeilen",
            "Live",
            "Sicherheits-Kopfzeilen",
            Ampel.GELB if ohne_kopf else Ampel.GRUEN,
            f"fehlen: {', '.join(ohne_kopf)}" if ohne_kopf else "",
        ),
        Pruefpunkt(
            "live-dashboard",
            "Live",
            "Dashboard gesperrt",
            Ampel.ROT if offen else Ampel.GRUEN,
            f"ohne Anmeldung offen: {', '.join(offen)}" if offen else "nur mit Cloudflare Access",
        ),
    ]


def ampel_nach_tagen(tage: float, grenzen: tuple[int, int]) -> Ampel:
    """Rot unter der ersten, gelb unter der zweiten Grenze, sonst grün."""
    if tage < grenzen[0]:
        return Ampel.ROT
    return Ampel.GELB if tage < grenzen[1] else Ampel.GRUEN


def zertifikat_ablauf(domain: str = DOMAIN) -> datetime:
    kontext = ssl.create_default_context()
    with socket.create_connection((domain, TLS_PORT), timeout=20) as roh:
        with kontext.wrap_socket(roh, server_hostname=domain) as tls:
            zertifikat = tls.getpeercert()
    ablauf = str(zertifikat["notAfter"]) if zertifikat else ""
    return datetime.fromtimestamp(ssl.cert_time_to_seconds(ablauf), UTC)


def domain_ablauf(abruf: Callable[..., Antwort] = abrufen) -> datetime | None:
    """Ablaufdatum der Domain aus RDAP (rdap.org leitet an die Registry weiter)."""
    antwort = abruf(f"https://rdap.org/domain/{DOMAIN}")
    if antwort.status != ERFOLG:
        return None
    for ereignis in antwort.json().get("events", []):  # type: ignore[union-attr]
        if ereignis.get("eventAction") == "expiration":
            return datetime.fromisoformat(ereignis["eventDate"].replace("Z", "+00:00"))
    return None


def pruefe_ablauf(jetzt: datetime, abruf: Callable[..., Antwort] = abrufen) -> list[Pruefpunkt]:
    punkte = []
    try:
        ablauf = zertifikat_ablauf()
        tage = (ablauf - jetzt).total_seconds() / SEKUNDEN_JE_TAG
        text = f"gültig bis {ablauf:%d.%m.%Y} (noch {int(tage)} Tage)"
        punkte.append(
            Pruefpunkt("zertifikat", "Domain", "Zertifikat", ampel_nach_tagen(tage, ZERTIFIKAT_TAGE), text)
        )
    except (OSError, ssl.SSLError, ValueError) as fehler:
        punkte.append(Pruefpunkt("zertifikat", "Domain", "Zertifikat", Ampel.ROT, f"nicht prüfbar: {fehler}"))
    ablauf_domain = domain_ablauf(abruf)
    if ablauf_domain is None:
        punkte.append(Pruefpunkt("domain", "Domain", "Registrierung", Ampel.GELB, "Ablaufdatum nicht lesbar"))
    else:
        tage = (ablauf_domain - jetzt).total_seconds() / SEKUNDEN_JE_TAG
        ampel = ampel_nach_tagen(tage, DOMAIN_TAGE)
        text = f"registriert bis {ablauf_domain:%d.%m.%Y} (noch {int(tage)} Tage)"
        punkte.append(Pruefpunkt("domain", "Domain", "Registrierung", ampel, text))
    return punkte
