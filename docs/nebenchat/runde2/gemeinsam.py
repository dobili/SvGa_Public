"""Gemeinsame Bausteine für die Entwürfe der zweiten Runde (Handybreite 390 px, dunkles Thema)."""
import json, math, os

HIER = os.path.dirname(os.path.abspath(__file__))
STUECKE = json.load(open(os.path.join(HIER, "..", "stuecke.json")))
ASSETS = "file:///home/user/wt-k/app/dist/assets/"
FIG = "file:///home/user/wt-k/app/dist/figuren/klassisch-cburnett/"

FONTS = f"""
@font-face{{font-family:'Source Sans 3';font-weight:400;src:url({ASSETS}source-sans-3-latin-400-normal-DQi5PRDE.woff2)}}
@font-face{{font-family:'Source Sans 3';font-weight:600;src:url({ASSETS}source-sans-3-latin-600-normal-DeckBYAU.woff2)}}
@font-face{{font-family:'Source Sans 3';font-weight:700;src:url({ASSETS}source-sans-3-latin-700-normal-CkzU-mV9.woff2)}}
@font-face{{font-family:'Source Serif 4';font-weight:600;src:url({ASSETS}source-serif-4-latin-600-normal-DouSKlru.woff2)}}
"""

CSS = FONTS + """
:root{--grund:#0f1b2e;--karte:#1b2b45;--rand:#2c3d5a;--text:#f5f0e6;--leise:#c3c9d3;--gold:#e3bf4a;--gold2:#c9a227;--creme:#f5f0e6;--tief:#16253d}
*{box-sizing:border-box} html,body{margin:0}
body{background:var(--grund);color:var(--text);font-family:'Source Sans 3',system-ui,sans-serif;width:390px;font-size:16px;line-height:1.35;position:relative}
h1,h2,h3,.serif{font-family:'Source Serif 4',Georgia,serif;font-weight:600}
h1{font-size:30px;margin:0;line-height:1.1} h2{font-size:20px;margin:0} h3{font-size:17px;margin:0}
.kopf{padding:20px 16px 8px;display:flex;justify-content:space-between;align-items:flex-end}
.marke{color:var(--gold);font-size:12px;letter-spacing:.12em;font-weight:700;text-transform:uppercase;margin-bottom:4px}
.zurueck{display:flex;align-items:center;gap:4px;color:var(--leise);font-size:15px}
.leise{color:var(--leise)} .klein{font-size:13px} .gold{color:var(--gold)}
.karte{background:var(--karte);border:1px solid var(--rand);border-radius:16px;padding:16px;margin:12px 16px}
.knopf{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:48px;padding:0 20px;border-radius:12px;background:var(--creme);color:#13203a;font-weight:700;font-size:17px}
.knopf.rund{border-radius:99px}
.knopf.rahmen{background:transparent;border:1.5px solid #4b5d7c;color:var(--text);font-weight:600}
.chip{display:inline-flex;align-items:center;gap:6px;min-height:44px;padding:0 14px;border-radius:99px;border:1.5px solid #3e5070;color:var(--text);font-size:15px;font-weight:600;white-space:nowrap}
.chip.an{background:var(--creme);color:#13203a;border-color:var(--creme)}
.ic{display:inline-flex;flex:none} .ic svg{width:100%;height:100%;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.zeile{display:flex;align-items:center;gap:12px}
.stueck{display:inline-block;flex:none} .stueck svg{width:100%;height:100%;display:block}
.leiste{position:absolute;left:0;right:0;bottom:0;height:66px;background:#15233a;border-top:1px solid var(--rand);display:flex;justify-content:space-around;align-items:center}
.leiste div{display:flex;flex-direction:column;align-items:center;gap:3px;font-size:12px;color:var(--leise);width:72px}
.leiste div.an{color:var(--text);font-weight:700}
.leiste div.an:before{content:'';position:absolute;top:-1px;width:36px;height:3px;border-radius:2px;background:var(--gold)}
.notiz{margin:18px 16px 6px;padding:8px 12px;border-left:3px solid var(--gold);color:var(--leise);font-size:13px;background:rgba(227,191,74,.06);border-radius:0 8px 8px 0}
.notiz b{color:var(--gold)}
"""

ICONS = {
    "kompass": '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
    "buch": '<path d="M3 5c3-1 6-1 9 1 3-2 6-2 9-1v14c-3-1-6-1-9 1-3-2-6-2-9-1z"/><path d="M12 6v14"/>',
    "ziel": '<circle cx="12" cy="12" r="8"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>',
    "schwerter": '<path d="M4 4l10 10M14 14l-2 3 5 5 1-1-1-4 4 1 1-1-5-5-3 2M20 4L10 14M10 14l2 3-5 5-1-1 1-4-4 1-1-1 5-5 3 2"/>',
    "lupe": '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
    "person": '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="10" r="3"/><path d="M6.5 18c1.5-2 3.3-3 5.5-3s4 1 5.5 3"/>',
    "wiederholen": '<path d="M4 9a8 8 0 0 1 14-3l2 2M20 4v4h-4M20 15a8 8 0 0 1-14 3l-2-2M4 20v-4h4"/>',
    "puzzle": '<path d="M9 4h6v3a2 2 0 1 0 4 0h1v5h-3a2 2 0 1 0 0 4h3v4h-6v-3a2 2 0 1 0-4 0v3H4v-6h3a2 2 0 1 0 0-4H4V4z"/>',
    "hantel": '<path d="M6 7v10M3 9v6M18 7v10M21 9v6M6 12h12"/>',
    "uhr": '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    "flamme": '<path d="M12 3c2 4 6 5 6 10a6 6 0 0 1-12 0c0-3 2-4 3-6 1 2 2 2 3 3 0-3 0-5 0-7z"/>',
    "haken": '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    "kreuz": '<path d="M6 6l12 12M18 6L6 18"/>',
    "pfeil": '<path d="M9 5l7 7-7 7"/>',
    "runter": '<path d="M6 9l6 6 6-6"/>',
    "links": '<path d="M15 5l-7 7 7 7"/>',
    "play": '<path d="M7 4.5v15l12-7.5z"/>',
    "frage": '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5v.7M12 17h.01"/>',
    "lesezeichen": '<path d="M6 3h12v18l-6-4-6 4z"/><path d="M12 7v6M9 10h6"/>',
    "karte": '<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v14M15 6v14"/>',
    "raster": '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 9.3h16M4 14.6h16M9.3 4v16M14.6 4v16"/>',
    "auge": '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    "rechner": '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 18h.01M12 18h.01M16 18h.01"/>',
    "regal": '<path d="M5 4v16M9 4v16M13 5l4 15M19 4v16"/>',
    "scheibe": '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
    "gabel": '<circle cx="6" cy="19" r="2"/><circle cx="18" cy="6" r="2"/><path d="M6 17V5M6 13c0-4 4-7 10-7"/>',
    "waage": '<path d="M12 4v16M7 20h10M5 7h14M5 7l-3 6a3 3 0 0 0 6 0zM19 7l-3 6a3 3 0 0 0 6 0z"/>',
    "haken_angel": '<path d="M12 3v10a4 4 0 1 1-8 0v-1M12 3l3 3"/><circle cx="17" cy="15" r="3"/>',
    "knochen": '<path d="M8 6a2.5 2.5 0 1 0-3 3l9 9a2.5 2.5 0 1 0 3 3 2.5 2.5 0 1 0 3-3 2.5 2.5 0 1 0-3-3L8 6z"/>',
    "plan": '<path d="M4 18c3 0 3-6 6-6s3 6 6 6 3-12 4-12"/><circle cx="20" cy="6" r="1.5"/>',
    "blitz": '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
    "flagge": '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
    "stern": '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
    "vorhang": '<path d="M5 4h14M7 4c0 6 2 10 5 16M17 4c0 6-2 10-5 16"/>',
    "timer": '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M10 2h4"/>',
    "liste": '<path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"/>',
    "warnung": '<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18h.01"/>',
    "route": '<circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="6" r="2.5"/><path d="M8.5 18H16a3 3 0 0 0 0-6H8a3 3 0 0 1 0-6h7.5"/>',
    "mehr": '<circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/>',
    "plus": '<path d="M12 5v14M5 12h14"/>',
    "schloss": '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
}


def ic(name, px=22, farbe=None, breite=None):
    stil = f"width:{px}px;height:{px}px" + (f";color:{farbe}" if farbe else "")
    sw = f' style="stroke-width:{breite}"' if breite else ""
    return f'<span class="ic" style="{stil}"><svg viewBox="0 0 24 24"{sw}>{ICONS[name]}</svg></span>'


def medaille(k, verdient=True, px=64, extra=""):
    svg = STUECKE[f"orden{'' if verdient else '-s'}:{k}"]
    stil = f"width:{px}px;height:{px}px;{extra}" + ("" if verdient else "opacity:.45;filter:grayscale(1)")
    return f'<span class="stueck" style="{stil}">{svg}</span>'


def ring(anteil, px=56, dicke=5, farbe="#e3bf4a", grund="#2c3d5a", innen="", strich=False):
    """Kreisring mit Fortschritt; innen ist HTML in der Mitte."""
    r = (px - dicke) / 2
    u = 2 * math.pi * r
    dash = ' stroke-dasharray="4 4"' if strich else ""
    bogen = "" if anteil <= 0 else (
        f'<circle cx="{px/2}" cy="{px/2}" r="{r}" fill="none" stroke="{farbe}" stroke-width="{dicke}" '
        f'stroke-linecap="round" stroke-dasharray="{u*anteil:.1f} {u:.1f}" transform="rotate(-90 {px/2} {px/2})"/>')
    return (f'<span style="position:relative;display:inline-flex;width:{px}px;height:{px}px;flex:none;align-items:center;justify-content:center">'
            f'<svg width="{px}" height="{px}" style="position:absolute;inset:0"><circle cx="{px/2}" cy="{px/2}" r="{r}" fill="none" stroke="{grund}" stroke-width="{dicke}"{dash}/>{bogen}</svg>'
            f'<span style="position:relative;text-align:center;line-height:1">{innen}</span></span>')


def leiste(aktiv):
    namen = [("Buch", "buch"), ("Training", "ziel"), ("Spielen", "schwerter"), ("Nachschlagen", "lupe"), ("Profil", "person")]
    return '<div class="leiste">' + "".join(
        f'<div class="{"an" if n == aktiv else ""}" style="position:relative">{ic(i, 26)}{n}</div>' for n, i in namen) + "</div>"


def figur(code, px):
    return f'<img src="{FIG}{code}.svg" width="{px}" height="{px}" style="display:block">'


def miniboard(px, n, figuren=(), pfeile=(), felder=(), hell="#e8dcc0", dunkel="#8a9bb5", rahmen=True):
    """Kleines Brett n x n (Ausschnitt). figuren: (code, spalte, reihe) mit 0,0 oben links.
    pfeile: (x1,y1,x2,y2,farbe) in Feldern; felder: (spalte,reihe,farbe)."""
    f = px / n
    q = []
    for y in range(n):
        for x in range(n):
            q.append(f'<rect x="{x*f:.2f}" y="{y*f:.2f}" width="{f+.3:.2f}" height="{f+.3:.2f}" fill="{hell if (x+y)%2==0 else dunkel}"/>')
    for x, y, c in felder:
        q.append(f'<rect x="{x*f:.2f}" y="{y*f:.2f}" width="{f:.2f}" height="{f:.2f}" fill="{c}"/>')
    for code, x, y in figuren:
        q.append(f'<image href="{FIG}{code}.svg" x="{x*f:.2f}" y="{y*f:.2f}" width="{f:.2f}" height="{f:.2f}"/>')
    for i, (x1, y1, x2, y2, c) in enumerate(pfeile):
        ax, ay, bx, by = (x1+.5)*f, (y1+.5)*f, (x2+.5)*f, (y2+.5)*f
        d = math.hypot(bx-ax, by-ay); ux, uy = (bx-ax)/d, (by-ay)/d
        sx, sy = bx-ux*f*.32, by-uy*f*.32
        k = f*.28
        p1 = (sx - uy*k, sy + ux*k); p2 = (sx + uy*k, sy - ux*k)
        q.append(f'<line x1="{ax:.1f}" y1="{ay:.1f}" x2="{sx:.1f}" y2="{sy:.1f}" stroke="{c}" stroke-width="{f*.16:.1f}" stroke-linecap="round" opacity=".92"/>'
                 f'<polygon points="{bx-ux*f*.08:.1f},{by-uy*f*.08:.1f} {p1[0]:.1f},{p1[1]:.1f} {p2[0]:.1f},{p2[1]:.1f}" fill="{c}" opacity=".92"/>')
    rand = 'border-radius:8px;overflow:hidden;' if rahmen else ""
    return f'<span style="display:inline-block;{rand}width:{px}px;height:{px}px;flex:none"><svg width="{px}" height="{px}" viewBox="0 0 {px} {px}">{"".join(q)}</svg></span>'


def seite(titel, inhalt, css="", hoehe=None):
    h = f'<style>body{{height:{hoehe}px;overflow:hidden}}</style>' if hoehe else ""
    return f'<!doctype html><html lang="de"><head><meta charset="utf-8"><title>{titel}</title><style>{CSS}{css}</style>{h}</head><body>{inhalt}</body></html>'


def schreibe(name, html):
    open(os.path.join(HIER, name + ".html"), "w").write(html)


# Kapitel des Buches (Titel aus index.json, lange Titel bis zum Doppelpunkt gekürzt)
KAPITEL = [
    (0, "Dein Einstieg ins Schachbuch", 28), (1, "Grundprinzipien des Schachs", 43), (2, "Klassische Eröffnungssysteme", 153),
    (3, "Gambits: Zeit und Aktivität gegen Material", 83), (4, "Das Fallenkabinett", 55), (5, "Bauernstrukturen", 48),
    (6, "Mittelspielstrategie", 38), (7, "Taktik", 61), (8, "Endspiel-Fundament", 68), (9, "Endspiel-Vertiefung", 53),
    (10, "Studien und Kuriositäten", 28), (11, "Beispielpartien", 101), (12, "Trainingsmethodik und Checklisten", 6)]
TEILE = [("Grundlagen", "teil-grundlagen", [0, 1]), ("Eröffnung", "teil-eroeffnung", [2, 3, 4]),
         ("Mittelspiel", "teil-mittelspiel", [5, 6, 7]), ("Endspiel", "teil-endspiel", [8, 9, 10]),
         ("Praxis", "teil-praxis", [11, 12])]
