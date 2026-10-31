"""E: Profilkarte „Deine Extras“ (Rahmen, Brett, Figuren, Konfetti, Titel)."""
from gemeinsam import *

EX = "file:///home/user/wt-k/app/dist/extras/"
GOLD = "file:///home/user/wt-k/app/dist/figuren/gold/"
STUFEN = ["Erster Zug", "Entwicklung", "Zentrum", "Rochade", "Offene Linie", "Vorposten", "Freibauer", "Kombination", "Zugzwang", "Meisterplan"]
STUFE = 6  # Beispielstand: Stufe 6 „Vorposten“
RAHMEN = {"bronze": ("#f3c79a", "#b8733a", "#6e3f17"), "silber": ("#f2f4f7", "#aeb6c1", "#6c7682"), "gold": ("#fff6c4", "#d4a92c", "#8f6a10")}
KONF = ["#e05a4f", "#4f9be0", "#5fbf6a", "#e3bf4a", "#e07fb5", "#f5f0e6"]

CSS_E = """
.extrakopf{padding:16px 16px 0}
.vorschau-av{position:relative;flex:none}
.titelband{display:inline-flex;align-items:center;gap:6px;border:1.5px solid #c9a227;color:#f2d27a;border-radius:6px;padding:2px 10px;font-size:13px;font-weight:700;letter-spacing:.04em;background:#1d2a48}
.haken-ecke{position:absolute;top:8px;right:8px;width:24px;height:24px;border-radius:50%;background:var(--gold);color:#16253d;display:flex;align-items:center;justify-content:center}
.schloss-ecke{position:absolute;top:8px;right:8px;width:24px;height:24px;border-radius:50%;background:#2c3d5a;color:#c3c9d3;display:flex;align-items:center;justify-content:center}
.gesperrt .bildchen{opacity:.38;filter:grayscale(.6)}
"""


def avatar(px, rahmen=None, ring_px=None):
    """Porträt des Lesers (gezeichnet), optional mit Rahmenring."""
    rp = ring_px or max(4, px * 0.07)
    inner = (f'<svg viewBox="0 0 64 64" width="{px}" height="{px}" style="display:block">'
             f'<circle cx="32" cy="32" r="32" fill="#2b4a73"/>'
             f'<path d="M12 64c2-12 10-18 20-18s18 6 20 18z" fill="#c9a227"/><path d="M26 46h12l-6 7z" fill="#f5f0e6"/>'
             f'<circle cx="32" cy="29" r="12" fill="#e2b48c"/><path d="M19 28c0-10 6-15 13-15s14 5 13 14c-3-4-8-6-13-6s-9 2-13 7z" fill="#5a3a22"/>'
             f'<circle cx="27.5" cy="30" r="1.6" fill="#2b1d12"/><circle cx="36.5" cy="30" r="1.6" fill="#2b1d12"/><path d="M28 35c2 2 6 2 8 0" stroke="#2b1d12" stroke-width="1.4" fill="none" stroke-linecap="round"/></svg>')
    if not rahmen:
        return f'<span class="vorschau-av" style="display:inline-block;width:{px}px;height:{px}px;border-radius:50%;overflow:hidden">{inner}</span>'
    a, b, c = RAHMEN[rahmen]
    return (f'<span class="vorschau-av" style="display:inline-block;padding:{rp:.0f}px;border-radius:50%;background:conic-gradient(from 210deg,{a},{b},{c},{b},{a});box-shadow:0 4px 14px rgba(0,0,0,.45)">'
            f'<span style="display:block;border-radius:50%;overflow:hidden;border:2px solid #0f1b2e">{inner}</span></span>')


def brett(px, n=4, hell="#c9a227", dunkel="#1b2b45", figuren=(), gold=True):
    f = px / n
    q = "".join(f'<rect x="{x*f:.1f}" y="{y*f:.1f}" width="{f+.3:.1f}" height="{f+.3:.1f}" fill="{hell if (x+y)%2==0 else dunkel}"/>' for y in range(n) for x in range(n))
    quelle = GOLD if gold else FIG
    q += "".join(f'<image href="{quelle}{c}.svg" x="{x*f:.1f}" y="{y*f:.1f}" width="{f:.1f}" height="{f:.1f}"/>' for c, x, y in figuren)
    return f'<svg width="{px}" height="{px}" style="display:block;border-radius:8px;overflow:hidden;box-shadow:0 0 0 2px #c9a227">{q}</svg>'


def konfetti(w, h, bunt=True, n=26, seed=3):
    import random
    r = random.Random(seed)
    farben = KONF if bunt else ["#e3bf4a", "#f2d27a", "#c9a227"]
    s = "".join(f'<rect x="{r.uniform(0,w):.0f}" y="{r.uniform(0,h):.0f}" width="{r.choice([4,5,6])}" height="{r.choice([8,10,12])}" rx="1.5" fill="{r.choice(farben)}" transform="rotate({r.uniform(-60,60):.0f} {r.uniform(0,w):.0f} {r.uniform(0,h):.0f})"/>' for _ in range(n))
    return f'<svg width="{w}" height="{h}" style="display:block">{s}</svg>'


def titelband(name, gesperrt=False):
    ic_name = "blitz" if name == "Taktiker" else "flagge"
    stil = ' style="opacity:.45;filter:grayscale(1)"' if gesperrt else ""
    return f'<span class="titelband"{stil}>{ic(ic_name, 14)}{name}</span>'


# Beispielstand
ITEMS = [  # (art, name, bild-html-funktion, frei, angelegt, bedingung, fortschritt)
    ("Rahmen", "Bronze", lambda px: avatar(px, "bronze"), True, False, "Ab Stufe 3", None),
    ("Rahmen", "Silber", lambda px: avatar(px, "silber"), True, True, "Ab Stufe 6", None),
    ("Rahmen", "Gold", lambda px: avatar(px, "gold"), False, False, "Ab Stufe 9", (6, 9)),
    ("Brett", "Nacht und Gold", lambda px: brett(px, 4, figuren=[("bK", 1, 0), ("wQ", 2, 3)]), True, True, "Alle Orden der Buchteile", None),
    ("Figuren", "Gold", lambda px: f'<img src="{GOLD}wK.svg" width="{px}" height="{px}">', True, True, "Ab Stufe 5", None),
    ("Konfetti", "Bunt", lambda px: f'<span style="display:block;border-radius:10px;background:#16253d">{konfetti(px, px)}</span>', True, False, "Ab Stufe 2", None),
    ("Titel", "Taktiker", lambda px: f'<span style="display:flex;align-items:center;justify-content:center;height:{px}px">{titelband("Taktiker")}</span>', True, True, "5 Taktikmotive in Gold", None),
    ("Titel", "Endspielkenner", lambda px: f'<span style="display:flex;align-items:center;justify-content:center;height:{px}px">{titelband("Endspielkenner")}</span>', False, False, "3 Endspielthemen in Gold", (1, 3)),
]


def karten_kopf(untertitel):
    return (f'<div class="extrakopf"><div class="zeile" style="justify-content:space-between"><h2 style="font-size:22px">Deine Extras</h2>'
            f'<span class="leise klein">6 von 8</span></div><div class="leise klein" style="margin-top:4px">{untertitel}</div></div>')


# ---------------- E1: Ankleide mit Vorschau ----------------
def e1():
    css = CSS_E + """
.buehne{position:relative;margin:12px 16px 0;border-radius:18px;overflow:hidden;background:radial-gradient(120% 90% at 30% 20%,#2a4268,#16253d 70%);border:1px solid #3a4f74;padding:18px 16px 16px}
.reiter{display:flex;gap:6px;margin:14px 16px 0;overflow:hidden}
.reiter span{min-height:44px;padding:0 11px;border-radius:99px;display:flex;align-items:center;font-weight:600;font-size:14px;color:var(--leise);border:1.5px solid transparent;white-space:nowrap}
.reiter span.an{background:var(--karte);color:var(--text);border-color:#3e5070}
.wahl{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:12px 16px 0}
.w{position:relative;background:var(--karte);border:1.5px solid var(--rand);border-radius:16px;padding:14px 6px 10px;display:flex;flex-direction:column;align-items:center;gap:8px;min-height:150px}
.w.an{border-color:var(--gold);box-shadow:0 0 0 1px var(--gold) inset,0 0 18px rgba(227,191,74,.25)}
.w b{font-size:14.5px;font-weight:600} .w small{font-size:12px;color:var(--leise);text-align:center;line-height:1.2}
"""
    buehne = (f'<div class="buehne"><div style="position:absolute;inset:0;opacity:.55">{konfetti(358, 220, True, 22, 9)}</div>'
              f'<div class="leise" style="position:relative;font-size:12px;letter-spacing:.1em;font-weight:700">SO SIEHT MAN DICH</div>'
              f'<div class="zeile" style="position:relative;gap:16px;margin-top:12px;align-items:center">{avatar(92, "silber", 7)}'
              f'<div><div class="serif" style="font-size:24px">Mia</div><div style="margin:6px 0 8px">{titelband("Taktiker")}</div>'
              f'<div class="leise klein">Stufe 6 · Vorposten</div></div></div>'
              f'<div class="zeile" style="position:relative;margin-top:16px;gap:14px;align-items:center;background:rgba(15,27,46,.6);border-radius:12px;padding:10px">'
              f'{brett(84, 4, figuren=[("bK", 1, 0), ("bP", 2, 1), ("wN", 1, 2), ("wK", 3, 3)])}'
              f'<div class="klein"><div><span class="leise">Brett</span> Nacht und Gold</div><div style="margin-top:4px"><span class="leise">Figuren</span> Gold</div>'
              f'<div style="margin-top:4px"><span class="leise">Konfetti</span> Gold (Standard)</div></div></div></div>')
    reiter = '<div class="reiter">' + "".join(f'<span class="{"an" if t == "Rahmen" else ""}">{t}</span>' for t in ["Rahmen", "Brett", "Figuren", "Titel", "Konfetti"]) + '</div>'
    kacheln = []
    for art, name, bild, frei, an, bed, fort in ITEMS:
        if art != "Rahmen":
            continue
        if frei:
            ecke = f'<span class="haken-ecke">{ic("haken", 15, None, 3)}</span>' if an else ""
            unten = '<small class="gold" style="font-weight:700">Angelegt</small>' if an else '<small>Antippen zum Anlegen</small>'
            kacheln.append(f'<div class="w{" an" if an else ""}">{ecke}{bild(62)}<b>{name}</b>{unten}</div>')
        else:
            e, n = fort
            kacheln.append(f'<div class="w gesperrt"><span class="schloss-ecke">{ic("schloss", 14)}</span><span class="bildchen">{bild(62)}</span><b style="color:#c3c9d3">{name}</b>'
                           f'<small>{bed}</small><span style="width:70%;height:5px;border-radius:3px;background:#2c3d5a;overflow:hidden"><i style="display:block;height:100%;width:{e/n*100:.0f}%;background:var(--gold)"></i></span></div>')
    ohne = f'<div class="w"><span style="width:62px;height:62px;display:flex;align-items:center;justify-content:center">{avatar(54)}</span><b>Ohne</b><small>schlicht</small></div>'
    wahl = (f'<div class="wahl">{"".join(kacheln)}</div>'
            f'<div style="margin:6px 16px 0;min-height:44px;display:flex;align-items:center;gap:8px;color:var(--leise);font-size:14.5px">{ic("kreuz", 16)}Rahmen ablegen</div>')
    hinweis = (f'<div class="leise klein" style="margin:12px 16px 16px;display:flex;gap:8px;align-items:center">{ic("frage", 16)}'
               f'Extras gibt es nur fürs Lernen. Gewähltes bleibt dir.</div>')
    inhalt = karten_kopf("Tippe auf ein Extra, die Vorschau oben zeigt es sofort.") + buehne + reiter + wahl + hinweis
    schreibe("e1", seite("E1 Ankleide", inhalt, css))


# ---------------- E2: Stufenpfad ----------------
def e2():
    css = CSS_E + """
.pfad{position:relative;margin:14px 16px 0;padding-left:46px}
.pfad:before{content:'';position:absolute;left:21px;top:20px;bottom:24px;width:4px;border-radius:2px;background:linear-gradient(#e3bf4a 0,#e3bf4a 54%,#33456a 54%)}
.st{position:relative;margin-bottom:10px}
.st .k{position:absolute;left:-46px;top:12px;width:46px;display:flex;justify-content:center}
.st .k span{width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px}
.st .k .ja{background:var(--gold);color:#16253d}
.st .k .hier{background:#1b2b45;border:3px solid var(--gold);box-shadow:0 0 0 6px rgba(227,191,74,.18);width:36px;height:36px}
.st .k .nein{background:#1b2b45;border:2px solid #4b5d7c;color:#b8c2d1}
.gew{background:var(--karte);border:1px solid var(--rand);border-radius:14px;padding:10px 12px;display:flex;gap:12px;align-items:center;min-height:72px}
.gew.an{border-color:var(--gold)}
.gew b{font-size:15.5px;font-weight:600;display:block} .gew small{font-size:13px;color:var(--leise)}
.schalter{margin-left:auto;min-width:44px;min-height:44px;display:flex;align-items:center;justify-content:center}
.leer{color:var(--leise);font-size:13.5px;padding:16px 0 8px}
.orden{background:linear-gradient(160deg,#22365a,#1b2b45);border:1px solid #3a4f74;border-radius:16px;margin:16px 16px 16px;padding:14px}
"""
    def schalter(an, frei=True):
        if not frei:
            return f'<span class="schalter">{ic("schloss", 20, "#7d8aa0")}</span>'
        if an:
            return f'<span class="schalter"><span style="width:30px;height:30px;border-radius:50%;background:var(--gold);color:#16253d;display:flex;align-items:center;justify-content:center">{ic("haken", 18, None, 3)}</span></span>'
        return f'<span class="schalter"><span style="width:30px;height:30px;border-radius:50%;border:2px solid #6e7f9c"></span></span>'
    stufen_extra = {2: ("Konfetti", "Bunt"), 3: ("Rahmen", "Bronze"), 5: ("Figuren", "Gold"), 6: ("Rahmen", "Silber"), 9: ("Rahmen", "Gold")}
    it = {(a, n): (b, f, an, bed, fo) for a, n, b, f, an, bed, fo in ITEMS}
    zeilen = []
    for s in range(1, 11):
        if s < STUFE:
            k = f'<span class="ja">{s}</span>'
        elif s == STUFE:
            k = f'<span class="hier">{s}</span>'
        else:
            k = f'<span class="nein">{s}</span>'
        if s in stufen_extra:
            art, name = stufen_extra[s]
            b, f, an, bed, fo = it[(art, name)]
            gesperrt = not f
            art_txt = {"Konfetti": "Konfettifarben", "Rahmen": "Porträtrahmen", "Figuren": "Figurensatz"}[art]
            info = (f'<small>Stufe {s} · {STUFEN[s-1]}</small>' if not gesperrt else f'<small>Stufe {s} · noch 3 Stufen</small>')
            zeilen.append(f'<div class="st"><div class="k">{k}</div><div class="gew{" an" if an else ""}{" gesperrt" if gesperrt else ""}">'
                          f'<span class="bildchen" style="width:52px;display:flex;justify-content:center">{b(48)}</span><span><b>{art_txt} {name}</b>{info}</span>{schalter(an, f)}</div></div>')
        elif s == STUFE + 1:
            zeilen.append(f'<div class="st"><div class="k">{k}</div><div class="leer">Stufe 7 · {STUFEN[6]}: noch 340 EP</div></div>')
        elif s in (1, 4, 8, 10):
            zeilen.append(f'<div class="st"><div class="k">{k}</div><div class="leer" style="padding:14px 0 6px">{STUFEN[s-1]}</div></div>')
    orden = []
    for art, name in [("Brett", "Nacht und Gold"), ("Titel", "Taktiker"), ("Titel", "Endspielkenner")]:
        b, f, an, bed, fo = it[(art, name)]
        zus = f" · {fo[0]}/{fo[1]}" if fo else ""
        if art == "Titel":
            sym = "blitz" if name == "Taktiker" else "flagge"
            bildteil = f'<span style="width:48px;height:48px;border-radius:50%;background:#1d2a48;border:2px solid #c9a227;color:#f2d27a;display:flex;align-items:center;justify-content:center">{ic(sym, 22)}</span>'
            textteil = f'<span><span style="display:block;margin-bottom:4px">{titelband(name, not f)}</span><small>{bed}{zus}</small></span>'
        else:
            bildteil = b(48)
            textteil = f'<span><b>Brett {name}</b><small>{bed}{zus}</small></span>'
        orden.append(f'<div class="gew{" an" if an else ""}{" gesperrt" if not f else ""}" style="margin-top:8px"><span class="bildchen" style="flex:none;width:52px;display:flex;justify-content:center">{bildteil}</span>'
                     f'{textteil}{schalter(an, f)}</div>')
    orden_html = (f'<div class="orden"><div class="zeile" style="gap:8px">{ic("stern", 20, "#e3bf4a")}<h3>Für Orden und Meisterschaft</h3></div>'
                  f'<div class="leise klein" style="margin-top:2px">Nicht an Stufen gebunden.</div>{"".join(orden)}</div>')
    kopf = karten_kopf("Jede Stufe bringt etwas mit. Antippen legt es an.")
    stand = (f'<div class="zeile" style="margin:12px 16px 0;gap:12px">{avatar(56, "silber", 4)}<div style="flex:1"><b>Stufe 6 · Vorposten</b>'
             f'<div style="height:6px;border-radius:3px;background:#2c3d5a;margin-top:6px;overflow:hidden"><i style="display:block;height:100%;width:62%;background:var(--gold)"></i></div>'
             f'<div class="leise klein" style="margin-top:4px">Nächstes Extra: Rahmen Gold ab Stufe 9</div></div></div>')
    inhalt = kopf + stand + f'<div class="pfad">{"".join(zeilen)}</div>' + orden_html
    schreibe("e2", seite("E2 Stufenpfad", inhalt, css))


# ---------------- E3: Sammelkarten je Art ----------------
def e3():
    css = CSS_E + """
.sammlung{display:flex;gap:4px;margin:12px 16px 0}
.sammlung i{flex:1;height:8px;border-radius:4px;background:#2c3d5a} .sammlung i.v{background:var(--gold)}
.art{margin:18px 0 0}
.art .kz{display:flex;justify-content:space-between;align-items:baseline;margin:0 16px 8px}
.reihe{display:flex;gap:12px;padding:0 16px;overflow:hidden}
.sk{flex:none;width:132px;border-radius:16px;background:linear-gradient(180deg,#22365a,#1b2b45);border:1.5px solid var(--rand);position:relative;overflow:hidden}
.sk .bild{height:112px;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle at 50% 40%,#2c4468,#18263f 75%)}
.sk .t{padding:8px 10px 10px} .sk b{font-size:14.5px;font-weight:600;display:block} .sk small{font-size:12px;color:var(--leise);display:block;line-height:1.25;margin-top:2px}
.sk .titelband{font-size:11.5px;padding:2px 7px;letter-spacing:0}
.sk.an{border-color:var(--gold);box-shadow:0 0 16px rgba(227,191,74,.3)}
.sk.an .band{position:absolute;left:0;right:0;top:0;background:var(--gold);color:#16253d;font-size:11.5px;font-weight:700;text-align:center;padding:2px 0;letter-spacing:.06em}
.sk.gesperrt .bild>*{opacity:.35;filter:grayscale(.7)}
.sk .zu{position:absolute;top:8px;right:8px;width:34px;height:34px;border-radius:50%;background:rgba(15,27,46,.85);border:1.5px solid #6e7f9c;display:flex;align-items:center;justify-content:center;color:#f5f0e6}
"""
    gruppen = [("Porträtrahmen", "Rahmen"), ("Titel unter deinem Namen", "Titel"), ("Brett und Figuren", "BrettFiguren"), ("Konfettifarben", "Konfetti")]
    reihen = []
    for titel, art in gruppen:
        arten = ("Brett", "Figuren") if art == "BrettFiguren" else (art,)
        karten = []
        liste = [x for x in ITEMS if x[0] in arten]
        if art == "Konfetti":
            karten.append(f'<div class="sk"><div class="bild"><span style="display:block;border-radius:10px">{konfetti(90, 90, False)}</span></div><div class="t"><b>Gold</b><small>Standard · antippen</small></div></div>')
        for a, name, b, f, an, bed, fo in liste:
            if not f:
                zus = f" · {fo[0]}/{fo[1]}" if fo else ""
                karten.append(f'<div class="sk gesperrt"><div class="bild">{b(76)}</div><span class="zu">{ic("schloss", 16)}</span><div class="t"><b style="color:#c3c9d3">{name}</b><small>{bed}{zus}</small></div></div>')
            elif an:
                karten.append(f'<div class="sk an"><span class="band">ANGELEGT</span><div class="bild" style="padding-top:12px">{b(76)}</div><div class="t"><b>{name}</b><small>{bed}</small></div></div>')
            else:
                karten.append(f'<div class="sk"><div class="bild">{b(76)}</div><div class="t"><b>{name}</b><small>antippen zum Anlegen</small></div></div>')
        frei = sum(1 for x in liste if x[3])
        reihen.append(f'<div class="art"><div class="kz"><h3>{titel}</h3><span class="leise klein">{frei} von {len(liste)}</span></div><div class="reihe">{"".join(karten)}</div></div>')
    sammlung = '<div class="sammlung">' + "".join(f'<i class="{"v" if i < 6 else ""}"></i>' for i in range(8)) + '</div>'
    kopf = karten_kopf("Deine Sammlung. Tippe eine Karte an, um sie anzulegen.") + sammlung
    inhalt = kopf + "".join(reihen) + '<div style="height:16px"></div>'
    schreibe("e3", seite("E3 Sammelkarten", inhalt, css))


if __name__ == "__main__":
    e1(); e2(); e3()
