"""Zusätzliche Bausteine für Runde 3: echtes Brett aus FEN, Abbildungen, Gegnerbilder."""
import json, os
from gemeinsam import *

DIST = "file://" + os.path.join(HIER, "dist-kopie") + "/"
DATEN = "/home/user/wt-k/app/public/daten/de/a1/"
GEGNERBILD = DIST + "gegner/"
HELL, DUNKEL = "#efe9da", "#8d98ab"

_abb = {}


def abbildung(nr):
    """FEN, Pfeile und Felder einer Abbildung aus den App-Daten."""
    kap = int(nr.split(".")[0])
    if kap not in _abb:
        d = json.load(open(f"{DATEN}kap{kap:02d}.json"))
        _abb[kap] = {a["id"]: a for a in d["abbildungen"]}
    return _abb[kap][nr]


def fenbrett(fen, px, felder=(), pfeile=(), runden=6, schatten=True, rand=None, schwarz_unten=False, hell=None, dunkel=None, satz=None):
    """Ganzes Brett aus FEN (nur der Stellungsteil wird gelesen). felder: [(feld, farbe)], pfeile: [(von, nach, farbe)]."""
    f = px / 8
    teile = []
    zeilen = fen.split()[0].split("/")
    def xy(feld):
        x = "abcdefgh".index(feld[0]); y = 8 - int(feld[1])
        if schwarz_unten:
            x, y = 7 - x, 7 - y
        return x, y
    for y in range(8):
        for x in range(8):
            teile.append(f'<rect x="{x*f:.2f}" y="{y*f:.2f}" width="{f+.3:.2f}" height="{f+.3:.2f}" fill="{(hell or HELL) if (x+y)%2==0 else (dunkel or DUNKEL)}"/>')
    figpfad = (DIST + "figuren/" + satz + "/") if satz else FIG
    for feld, farbe in felder:
        x, y = xy(feld)
        teile.append(f'<rect x="{x*f:.2f}" y="{y*f:.2f}" width="{f:.2f}" height="{f:.2f}" fill="{farbe}"/>')
    for y, z in enumerate(zeilen):
        x = 0
        for ch in z:
            if ch.isdigit():
                x += int(ch); continue
            code = ("w" if ch.isupper() else "b") + ch.upper()
            xx, yy = (7 - x, 7 - y) if schwarz_unten else (x, y)
            teile.append(f'<image href="{figpfad}{code}.svg" x="{xx*f:.2f}" y="{yy*f:.2f}" width="{f:.2f}" height="{f:.2f}"/>')
            x += 1
    for von, nach, farbe in pfeile:
        (x1, y1), (x2, y2) = xy(von), xy(nach)
        ax, ay, bx, by = (x1+.5)*f, (y1+.5)*f, (x2+.5)*f, (y2+.5)*f
        d = math.hypot(bx-ax, by-ay); ux, uy = (bx-ax)/d, (by-ay)/d
        sx, sy = bx-ux*f*.38, by-uy*f*.38
        k = f*.3
        teile.append(f'<line x1="{ax:.1f}" y1="{ay:.1f}" x2="{sx:.1f}" y2="{sy:.1f}" stroke="{farbe}" stroke-width="{f*.17:.1f}" stroke-linecap="round" opacity=".9"/>'
                     f'<polygon points="{bx-ux*f*.1:.1f},{by-uy*f*.1:.1f} {sx-uy*k:.1f},{sy+ux*k:.1f} {sx+uy*k:.1f},{sy-ux*k:.1f}" fill="{farbe}" opacity=".9"/>')
    sch = "box-shadow:0 4px 14px rgba(0,0,0,.35);" if schatten else ""
    rd = f"outline:{rand};" if rand else ""
    return (f'<span style="display:inline-block;width:{px}px;height:{px}px;border-radius:{runden}px;overflow:hidden;flex:none;{sch}{rd}">'
            f'<svg width="{px}" height="{px}" viewBox="0 0 {px} {px}" style="display:block">{"".join(teile)}</svg></span>')


def abbbrett(nr, px, **kw):
    a = abbildung(nr)
    felder = kw.pop("felder", ())
    pfeile = kw.pop("pfeile", ())
    return fenbrett(a["fen"], px, felder=felder, pfeile=pfeile, **kw)


def gegner(portrait, px, rund=True, rand=None):
    r = "50%" if rund else "14px"
    b = f"box-shadow:0 0 0 {rand};" if rand else ""
    return f'<img src="{GEGNERBILD}{portrait}.svg" width="{px}" height="{px}" style="display:block;border-radius:{r};background:#2c3d5a;flex:none;{b}" alt="">'


def unterseitenkopf(zurueck, titel):
    return (f'<div style="padding:14px 16px 6px;display:flex;align-items:center;gap:10px"><span class="zurueck">{ic("links", 20)}{zurueck}</span>'
            f'<h1 style="font-size:22px;flex:1;text-align:center;margin-right:56px">{titel}</h1></div>')


def schalter(an):
    if an:
        return '<span style="width:50px;height:30px;border-radius:15px;background:#e3bf4a;position:relative;flex:none;display:inline-block"><i style="position:absolute;right:3px;top:3px;width:24px;height:24px;border-radius:50%;background:#16253d"></i></span>'
    return '<span style="width:50px;height:30px;border-radius:15px;background:#33456a;position:relative;flex:none;display:inline-block"><i style="position:absolute;left:3px;top:3px;width:24px;height:24px;border-radius:50%;background:#c3c9d3"></i></span>'


# Zugklassen wie in der App (Farben aus der Auswertung)
ZUGKLASSEN = [("!!", "Brillant", "#1fb5a8"), ("!", "Stark", "#5b8fc9"), ("ic:stern", "Bester Zug", "#5fa64a"), ("ic:haken", "Sehr gut", "#6aa84f"),
              ("ic:haken", "Gut", "#7a9f6a"), ("ic:buch", "Theoriezug", "#a5835a"), ("?!", "Ungenau", "#d1a21a"), ("?", "Fehler", "#e38a2c"),
              ("ic:kreuz", "Verpasst", "#d65a4a"), ("??", "Patzer", "#d63a3a")]


def zugzeichen(zeichen, farbe, px=22):
    innen = ic(zeichen[3:], px * .62, "#fff", 3) if zeichen.startswith("ic:") else f'<b style="font-size:{px*.5:.0f}px;color:#fff;letter-spacing:-.5px">{zeichen}</b>'
    return f'<span style="width:{px}px;height:{px}px;border-radius:50%;background:{farbe};display:inline-flex;align-items:center;justify-content:center;flex:none">{innen}</span>'
