"""G: Startseite eines Trainers, gezeigt am Taktiktrainer (Form muss für alle Trainer passen)."""
from bausteine3 import *

ABB = "7.61"  # Weiß am Zug setzt matt (Aufgabe aus dem Buch, Stufe 1)
MOTIVE = [("Mattbilder", 211, "gold"), ("Doppelangriff", 43, "silber"), ("Fesselung", 41, "bronze"), ("Spieß", 42, None),
          ("Abzug", 43, "bronze"), ("Doppelschach", 42, None), ("Hinlenkung", 44, None), ("Beseitigung der Verteidigung", 42, None),
          ("Überlastung", 42, None), ("Zwischenzug", 42, None), ("Gefangene Figur", 40, None), ("Umwandlung", 43, "silber")]
R, G = "#e05a4f", "#e3bf4a"
BILD = {
    "Mattbilder": dict(figuren=[("bK", 2, 0), ("wQ", 2, 1), ("wK", 2, 3)], felder=[(2, 0, "#e05a4f99")]),
    "Doppelangriff": dict(figuren=[("wN", 2, 3), ("bK", 1, 1), ("bR", 3, 1)], pfeile=[(2, 3, 1, 1, G), (2, 3, 3, 1, G)]),
    "Fesselung": dict(figuren=[("wB", 0, 4), ("bN", 2, 2), ("bK", 4, 0)], pfeile=[(0, 4, 2, 2, G)]),
    "Spieß": dict(figuren=[("wR", 0, 2), ("bK", 2, 2), ("bQ", 4, 2)], pfeile=[(0, 2, 1, 2, G)]),
    "Abzug": dict(figuren=[("wR", 2, 4), ("wB", 2, 2), ("bK", 2, 0), ("bQ", 4, 0)], pfeile=[(2, 2, 3, 1, G)]),
    "Doppelschach": dict(figuren=[("wN", 3, 2), ("wR", 2, 4), ("bK", 2, 0)], pfeile=[(3, 2, 2, 0, G), (2, 4, 2, 1, G)]),
    "Hinlenkung": dict(figuren=[("bK", 4, 0), ("wR", 1, 1), ("bQ", 0, 3)], pfeile=[(1, 1, 3, 1, G)]),
    "Beseitigung der Verteidigung": dict(figuren=[("wB", 0, 4), ("bN", 3, 1), ("bQ", 2, 3)], pfeile=[(0, 4, 3, 1, G)]),
    "Überlastung": dict(figuren=[("bQ", 2, 2), ("wN", 0, 2), ("wB", 4, 2)], pfeile=[(2, 2, 0, 2, R), (2, 2, 4, 2, R)]),
    "Zwischenzug": dict(figuren=[("wQ", 1, 3), ("bK", 4, 0), ("bB", 1, 1)], pfeile=[(1, 3, 4, 0, G)]),
    "Gefangene Figur": dict(figuren=[("bB", 0, 1), ("wP", 1, 2), ("wP", 2, 3)], felder=[(0, 1, "#e05a4f77")]),
    "Umwandlung": dict(figuren=[("wP", 2, 1), ("bK", 4, 3)], pfeile=[(2, 1, 2, 0, G)]),
}
SILBEN = {"Doppelangriff": "Doppel&shy;angriff", "Doppelschach": "Doppel&shy;schach", "Überlastung": "Über&shy;lastung", "Zwischenzug": "Zwischen&shy;zug", "Umwandlung": "Um&shy;wandlung", "Hinlenkung": "Hin&shy;lenkung", "Beseitigung der Verteidigung": "Beseitigung der Ver&shy;teidigung", "Mattbilder": "Matt&shy;bilder"}
MED = {"gold": ("#fff6c4", "#d4a92c"), "silber": ("#f2f4f7", "#9aa3b0"), "bronze": ("#f3c79a", "#b8733a")}


def medaillenpunkt(stufe, px=18):
    if not stufe:
        return ""
    a, b = MED[stufe]
    return f'<span title="{stufe}" style="width:{px}px;height:{px}px;border-radius:50%;background:radial-gradient(circle at 35% 30%,{a},{b});box-shadow:0 0 0 2px #16253d;flex:none;display:inline-block"></span>'


def kopf():
    return unterseitenkopf("Training", "Taktiktrainer")


# ---------------- G1: Startkarte mit Vorschau ----------------
def g1():
    css = """
.held{display:flex;gap:14px;align-items:center;margin:8px 16px 0}
.runde{background:var(--karte);border:1px solid var(--rand);border-radius:16px;margin:16px 16px 0;overflow:hidden}
.runde .z{display:flex;align-items:center;gap:12px;min-height:56px;padding:0 14px;border-top:1px solid #26385a}
.runde .z:first-of-type{border-top:none}
.runde .z span.l{color:var(--leise);width:84px;font-size:14.5px}
.runde .z b{flex:1;font-weight:600}
.modus{display:flex;gap:12px;align-items:center;border:1.5px solid #3e5070;border-radius:16px;margin:12px 16px 0;padding:12px 14px}
"""
    held = (f'<div class="held">{abbbrett(ABB, 156)}<div><div class="serif" style="font-size:22px;line-height:1.15">Finde den Zug, der gewinnt</div>'
            f'<div class="leise" style="font-size:14.5px;margin-top:6px">Matt, Gabel, Fesselung und mehr. Bei Bedarf gibt es Hilfen in vier Stufen.</div></div></div>')
    zeilen = [("Aufgaben", "Aus dem Buch", "buch"), ("Motiv", "Gemischt · 674", "blitz"), ("Stufe", "alle Stufen", "ziel")]
    runde = ('<div class="runde"><div style="padding:12px 14px 4px" class="leise klein">DEINE RUNDE · zum Ändern antippen</div>'
             + "".join(f'<div class="z">{ic(i, 20, "#e3bf4a")}<span class="l">{l}</span><b>{w}</b>{ic("pfeil", 18, "#7d8aa0")}</div>' for l, w, i in zeilen) + '</div>')
    start = f'<div style="margin:14px 16px 0"><span class="knopf" style="width:100%;min-height:56px;font-size:18px">{ic("play", 20)}Runde starten · 8 Aufgaben</span></div>'
    modus = (f'<div class="modus">{ic("flamme", 28, "#e3bf4a")}<div style="flex:1"><b>Serie ohne Fehler</b><div class="leise klein">Immer schwerer, bis zum ersten Fehler. Rekord: 6</div></div>'
             f'<span style="width:44px;height:44px;border-radius:50%;border:1.5px solid #4b5d7c;display:flex;align-items:center;justify-content:center">{ic("play", 18)}</span></div>')
    hilfe = (f'<div class="zeile" style="margin:14px 16px 0;min-height:44px;gap:8px;color:var(--leise);font-size:14.5px">{ic("frage", 18)}So funktioniert der Taktiktrainer {ic("runter", 16)}</div>')
    andere = ('<div class="notiz" style="margin-top:22px">Dieselbe Form für jeden Trainer: Bild und ein Satz, „Deine Runde“ mit zwei oder drei Zeilen, ein Startknopf, '
              'ein zweiter Modus. Beispiele:</div>'
              '<div style="margin:6px 16px 16px;display:grid;gap:8px;font-size:14px">'
              '<div class="karte" style="margin:0;padding:10px 12px"><b>Zähltrainer</b><span class="leise"> · Runde: Schwierigkeit gemischt · zweiter Modus: Hängende Figuren auf Zeit</span></div>'
              '<div class="karte" style="margin:0;padding:10px 12px"><b>Falle oder Köder</b><span class="leise"> · Runde: Stufe alle · kein zweiter Modus</span></div>'
              '<div class="karte" style="margin:0;padding:10px 12px"><b>Endspieltrainer</b><span class="leise"> · Runde: Was üben? Turmendspiele, Stufe 2</span></div></div>')
    schreibe("g1", seite("G1 Startkarte", kopf() + held + runde + start + modus + hilfe + andere, css))


# ---------------- G2: Motiv-Kacheln ----------------
def g2():
    css = """
.stufen{display:flex;gap:6px;margin:8px 16px 0}
.stufen span{flex:1;min-height:44px;border-radius:10px;border:1.5px solid #3e5070;display:flex;flex-direction:column;align-items:center;justify-content:center;font-weight:700;font-size:15px}
.stufen span small{font-weight:400;font-size:10.5px;color:var(--leise)}
.stufen span.an{background:var(--creme);color:#13203a;border-color:var(--creme)} .stufen span.an small{color:#13203a}
.gem{display:flex;gap:14px;align-items:center;background:linear-gradient(150deg,#2a4268,#1b2b45 70%);border:1px solid #3a4f74;border-radius:16px;margin:14px 16px 0;padding:12px}
.raster{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:12px 16px 0}
.mk{background:var(--karte);border:1px solid var(--rand);border-radius:14px;padding:10px;display:flex;gap:10px;align-items:center;min-height:72px;position:relative}
.mk b{font-size:14.5px;font-weight:600;line-height:1.2;display:block;hyphens:manual}
.mk small{font-size:12.5px;color:var(--leise)}
.mk .m{position:absolute;top:8px;right:8px}
"""
    quelle = ('<div style="display:flex;margin:6px 16px 0;background:#16253d;border:1px solid var(--rand);border-radius:12px;padding:3px">'
              '<span style="flex:1;min-height:40px;display:flex;align-items:center;justify-content:center;border-radius:9px;background:var(--karte);font-weight:600;box-shadow:0 0 0 1px #3e5070">Aus dem Buch</span>'
              '<span style="flex:1;min-height:40px;display:flex;align-items:center;justify-content:center;color:var(--leise);font-weight:600">Zusätzlich Lichess</span></div>')
    stufen = ('<div class="stufen">' + "".join(f'<span class="{"an" if s == "alle" else ""}">{s}<small>{u}</small></span>'
                                               for s, u in [("alle", "mischen"), ("1", "<1000"), ("2", "–1300"), ("3", "–1600"), ("4", "–1900"), ("5", ">1900")]) + '</div>')
    gem = (f'<div class="gem">{abbbrett(ABB, 76)}<div style="flex:1"><b style="font-size:17px">Gemischt</b><div class="leise klein">674 Aufgaben, alle Motive</div></div>'
           f'<span style="width:48px;height:48px;border-radius:50%;background:var(--creme);color:#13203a;display:flex;align-items:center;justify-content:center">{ic("play", 22)}</span></div>')
    kacheln = "".join(
        f'<div class="mk">{miniboard(48, 5, **BILD[n], rahmen=True)}<span style="min-width:0;padding-right:16px"><b>{SILBEN.get(n, n)}</b><small>{c} Aufgaben</small></span>'
        f'<span class="m">{medaillenpunkt(m, 14)}</span></div>' for n, c, m in MOTIVE)
    legende = (f'<div class="zeile leise klein" style="margin:12px 16px 0;gap:10px">{medaillenpunkt("bronze", 14)}{medaillenpunkt("silber", 14)}{medaillenpunkt("gold", 14)}'
               f'<span>Deine Meisterschaft je Motiv (Profil › Deine Themen)</span></div>')
    serie = (f'<div class="zeile" style="margin:14px 16px 16px;min-height:52px;border:1.5px solid #3e5070;border-radius:14px;padding:0 14px;gap:10px">{ic("flamme", 22, "#e3bf4a")}'
             f'<b style="flex:1">Serie ohne Fehler</b><span class="leise klein">Rekord 6</span>{ic("pfeil", 18, "#7d8aa0")}</div>')
    einl = '<div class="leise" style="margin:2px 16px 0;font-size:14.5px">Tippe ein Motiv an, die Runde startet sofort.</div>'
    schreibe("g2", seite("G2 Motiv-Kacheln", kopf() + einl + quelle + stufen + gem + '<div style="margin:18px 16px 0"><h3>Nach Motiv</h3></div>' + f'<div class="raster">{kacheln}</div>' + legende + serie, css))


# ---------------- G3: Vorschläge statt Formular ----------------
def g3():
    css = """
.letzt{background:linear-gradient(150deg,#26395c,#1b2b45 70%);border:1px solid #3a4f74;border-radius:16px;margin:8px 16px 0;padding:14px}
.punkte{display:flex;gap:5px;margin:10px 0 4px} .punkte i{flex:1;height:8px;border-radius:4px;background:#5fa64a} .punkte i.f{background:#d63a3a}
.vor{display:flex;gap:12px;align-items:center;background:var(--karte);border:1px solid var(--rand);border-radius:16px;margin:10px 16px 0;padding:12px}
.vor b{display:block;font-size:16px} .vor small{display:block;color:var(--leise);font-size:13.5px;margin-top:2px}
"""
    letzt = (f'<div class="letzt"><div class="leise" style="font-size:12px;letter-spacing:.1em;font-weight:700">LETZTE RUNDE · GESTERN</div>'
             f'<div class="zeile" style="justify-content:space-between;margin-top:6px"><span class="serif" style="font-size:26px">6 von 8 richtig</span><span class="leise klein">Gemischt · alle</span></div>'
             f'<div class="punkte">' + "".join(f'<i class="{"f" if j in (2, 6) else ""}"></i>' for j in range(8)) + '</div>'
             f'<div class="leise klein">Daneben: Fesselung, Zwischenzug</div>'
             f'<span class="knopf" style="width:100%;margin-top:12px">{ic("play", 20)}Neue Runde, gleiche Einstellung</span></div>')
    def vor(bild, titel, text):
        return f'<div class="vor">{bild}<div style="flex:1;min-width:0"><b>{titel}</b><small>{text}</small></div>{ic("pfeil", 20, "#7d8aa0")}</div>'
    vorschlaege = ('<div style="margin:20px 16px 0"><h3>Für dich vorgeschlagen</h3></div>'
                   + vor(miniboard(60, 5, **BILD["Fesselung"]), "Fesselung üben", "Dein schwächstes Motiv: 1 von 3 richtig. 41 Aufgaben.")
                   + vor(f'<span style="width:60px;height:60px;border-radius:12px;background:#22365a;display:flex;align-items:center;justify-content:center;font-family:Source Serif 4;font-size:26px;color:#e3bf4a">3</span>',
                         "Eine Stufe höher", "Stufe 2 löst du sicher. Stufe 3 entspricht etwa 1300 bis 1600.")
                   + vor(f'<span style="width:60px;height:60px;border-radius:12px;background:#22365a;display:flex;align-items:center;justify-content:center">{ic("flamme", 30, "#e3bf4a")}</span>',
                         "Serie ohne Fehler", "Dein Rekord: 6 in Folge. Schaffst du 7?"))
    selbst = (f'<div class="zeile" style="margin:18px 16px 0;min-height:56px;border:1.5px dashed #3e5070;border-radius:14px;padding:0 14px;gap:10px">{ic("liste", 20, "#c3c9d3")}'
              f'<span style="flex:1"><b>Selbst zusammenstellen</b><div class="leise klein">Aufgaben, Motiv, Stufe</div></span>{ic("pfeil", 18, "#7d8aa0")}</div>')
    erst = ('<div class="notiz" style="margin-top:22px">Beim allerersten Öffnen steht statt „Letzte Runde“ ein Beispielbrett mit einem Satz und „Erste Runde starten“. '
            'Jeder Trainer kennt eine letzte Runde und ein schwächstes Gebiet (Thema, Stufe oder Fehlerart).</div><div style="height:12px"></div>')
    schreibe("g3", seite("G3 Vorschläge", kopf() + letzt + vorschlaege + selbst + erst, css))


if __name__ == "__main__":
    g1(); g2(); g3()
