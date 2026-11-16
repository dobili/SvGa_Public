"""Kollision eines einzelnen Objekts: Übersteuerung des Katalogs in der Szene (Karteneditor).

Warum: Der Autor will im Karteneditor festlegen, ob man durch ein Bild hindurchgehen kann oder ob
es wie eine Wand sperrt (Wunsch des Autors, 16.11.2026). Bisher stand das nur im Katalog
(``inhalte/abenteuer/moebel/<ort>.json``: ``kollision``, ``maske``, ``begehbar`` mit
``begehbar_grund``, Regel 10.69) und galt für jedes Vorkommen gleich. Drei optionale Felder am
Szeneneintrag übersteuern das nur an dieser Stelle:

- ``kollision`` (true/false): sperrt oder ist durchgehbar, statt der Angabe im Katalog.
- ``maske`` (Liste wie im Katalog, ``#`` sperrt, ``.`` frei): ersetzt die Katalogmaske. Sie gilt im
  Raster des (skalierten) ungedrehten Bildes; ``drehung`` und ``spiegeln`` wirken darauf wie auf
  die Katalogmaske (``objektform.geformt``).
- ``begehbar_grund`` (Text): Pflicht, wenn ein nicht flaches Möbel mit Kollision an dieser Stelle
  durchgehbar wird (Regel 10.69 sinngemäß: Der Autor lief durch einen Zeitungsstapel).

Ohne die Felder bleibt alles wie vorher; ``an_wand``, ``vorn`` und ``auf`` bleiben ohne Kollision.
Spiegel der Regel: App ``app/src/abenteuer/oberwelt/moebelform.ts`` (Eigenschaft ``maske`` der
Tiled-Karte), Editor ``werkzeuge/karteneditor/js/geometrie.js``.
"""

K = 16
FELDER = ("kollision", "maske", "begehbar_grund")
# Arten, über die man läuft (KARTENREGELN 10.69): Sie brauchen keine Kollision und keine Begründung.
FLACH = {
    "bordstein", "markierung", "teppich", "boden", "boden_teil", "schatten",
    "steg", "bruecke", "gleis", "treppe", "tuer",
}  # fmt: skip
# Trenner der Maskenreihen in der Tiled-Eigenschaft „maske“ (App, oberwelt/moebelform.ts).
REIHENTRENNER = "/"


def ist_flach(angabe: dict) -> bool:
    """Ob ein Möbel nach seiner Art flach ist (man läuft darüber). Beispiel: Teppich → True."""
    return angabe.get("art") in FLACH


def kollision_an(angabe: dict, eintrag: dict) -> bool:
    """Ob das Objekt sperrt: ``kollision`` am Eintrag, sonst die Angabe im Katalog.

    Beispiel: Sofa mit ``"kollision": true`` im Katalog und ``"kollision": false`` in der Szene →
    False. Lage ohne Kollision (an der Wand, vorn, auf) regelt der Kartenbau danach.
    """
    if isinstance(eintrag.get("kollision"), bool):
        return eintrag["kollision"]
    return bool(angabe.get("kollision"))


def durchgehbar(angabe: dict, eintrag: dict) -> bool:
    """Ob das Objekt an dieser Stelle ganz durchgehbar ist: ohne Kollision oder mit einer eigenen
    Maske ohne ``#``. Beispiel: ``"maske": ["..", ".."]`` → True."""
    if not kollision_an(angabe, eintrag):
        return True
    maske = eintrag.get("maske")
    return isinstance(maske, list) and not any("#" in str(z) for z in maske)


def maskeneigenschaft(geformte_maske: list[str]) -> str:
    """Die geformte Maske als Tiled-Eigenschaft. Beispiel: ["..", "#."] → „../#.“."""
    return REIHENTRENNER.join(geformte_maske)


def _maskenbefund(maske: object, angabe: dict, eintrag: dict) -> str | None:
    """Was an einer eigenen Maske nicht stimmt (Form, Zeichen, Größe); None, wenn sie passt."""
    if not isinstance(maske, list) or not all(isinstance(z, str) for z in maske):
        return "maske muss eine Liste von Zeichenketten sein"
    if any(set(z) - {"#", "."} for z in maske):
        return "maske kennt nur „#“ (sperrt) und „.“ (frei)"
    massstab = float(eintrag.get("massstab", 1))
    spalten = max(1, round(angabe["breite"] * massstab) // K)
    reihen = max(1, round(angabe["hoehe"] * massstab) // K)
    if len(maske) > reihen or any(len(z) > spalten for z in maske):
        return f"maske ist größer als das Bild ({spalten} × {reihen} Kacheln)"
    return None


def kollisionsbefunde(szene: dict, moebel: dict) -> list[str]:
    """Befunde zu den Übersteuerungen einer Szene.

    Regel: Kapitel „Kollision“ der Kartenregeln (10.69): Ein nicht flaches Möbel, das laut Katalog
    sperrt, wird an einer Stelle nur mit ``begehbar_grund`` durchgehbar.
    Beispiel: ``{"moebel": "mf4Sofa", "feld": [2, 3], "kollision": false}`` →
    „mf4Sofa (2, 3): durchgehbar ohne begehbar_grund (Regel 10.69)“.
    """
    befunde = []
    for eintrag in szene.get("objekte", []):
        angabe = moebel.get(eintrag.get("moebel", ""))
        if not angabe or not any(k in eintrag for k in FELDER):
            continue
        wo = f"{eintrag['moebel']} {tuple(eintrag.get('feld', ()))}"
        if "kollision" in eintrag and not isinstance(eintrag["kollision"], bool):
            befunde.append(f"{wo}: kollision muss true oder false sein")
        if "maske" in eintrag and (fehler := _maskenbefund(eintrag["maske"], angabe, eintrag)):
            befunde.append(f"{wo}: {fehler}")
        ohne_lage = not any(eintrag.get(k) for k in ("auf", "an_wand", "vorn"))
        sperrt_laut_katalog = bool(angabe.get("kollision")) and not ist_flach(angabe)
        grund = str(eintrag.get("begehbar_grund", "")).strip()
        if ohne_lage and sperrt_laut_katalog and durchgehbar(angabe, eintrag) and not grund:
            befunde.append(f"{wo}: durchgehbar ohne begehbar_grund (Regel 10.69)")
    return befunde


def _maskentext(eintrag: dict, angabe: dict | None) -> str:
    """Die eigene Maske so, wie sie auf der Karte liegt (gedreht und gespiegelt wie das Bild).

    Warum: Der Autor zeichnet die Maske im Editor auf dem gedrehten Bild; gespeichert wird sie im
    Raster des ungedrehten Bildes (``objektform.geformt``). Der Bericht zeigt sie wie auf der Karte.
    Beispiel: maske [„#.“, „..“] mit ``drehung`` 90 → „.#/.. (wie auf der Karte, gedreht 90°)“.
    """
    from pipeline.abenteuer.objektform import geformt, hat_form

    if angabe is None or not hat_form(eintrag) or "breite" not in angabe:
        return maskeneigenschaft(eintrag["maske"])
    karte = (geformt(angabe, eintrag) or {}).get("maske", eintrag["maske"])
    wie = [f"gedreht {eintrag['drehung'] % 360}°"] if eintrag.get("drehung", 0) % 360 else []
    wie += ["gespiegelt"] if eintrag.get("spiegeln") else []
    wie += [f"Maßstab {round(float(eintrag['massstab']) * 100)} %"] if "massstab" in eintrag else []
    wie += ["beschnitten"] if eintrag.get("zuschnitt") else []
    return f"{maskeneigenschaft(karte)} (wie auf der Karte, {', '.join(wie)})"


def _beschreibe(eintrag: dict, angabe: dict | None = None) -> str:
    """Kollisionsfelder eines Eintrags als Text. Beispiel: „kollision false, maske ../#.“."""
    teile = []
    if "kollision" in eintrag:
        teile.append(f"kollision {'true' if eintrag['kollision'] else 'false'}")
    if "maske" in eintrag:
        teile.append(f"maske {_maskentext(eintrag, angabe)}")
    return ", ".join(teile) or "wie im Katalog"


def kollisionszeile(vorher: dict, nachher: dict, angabe: dict | None, wo: str) -> str | None:
    """Eine Berichtszeile des Rücklaufs zur Kollision eines Objekts; None ohne Änderung.

    Warum: Aus dem Bericht lernt der Hauptchat, welche Katalogeinträge falsch sind (Wunsch des
    Autors, 16.11.2026). Die Zeile nennt Feld, Katalogwert und Grund.
    Beispiel: „Kollision: mf4Sofa (2, 3): kollision false (Katalog: sperrt), Grund: Polster“.
    """
    if all(vorher.get(k) == nachher.get(k) for k in FELDER):
        return None
    katalog = "fehlt"
    if angabe is not None:
        katalog = "sperrt" if angabe.get("kollision") else "durchgehbar"
        katalog += ", eigene Maske" if "maske" in angabe else ""
    zeile = f"Kollision: {nachher.get('moebel')} {wo}: {_beschreibe(nachher, angabe)} (Katalog: {katalog})"
    grund = str(nachher.get("begehbar_grund", "")).strip()
    if grund:
        return f"{zeile}, Grund: {grund}"
    if (
        angabe is not None
        and not ist_flach(angabe)
        and angabe.get("kollision")
        and durchgehbar(angabe, nachher)
    ):
        return f"{zeile}, OHNE GRUND (begehbar_grund fehlt)"
    return zeile
