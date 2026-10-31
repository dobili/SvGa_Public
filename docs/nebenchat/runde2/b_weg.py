"""B: Lernpfad „Dein Weg durchs Buch“ mit Hintergründen (alles selbst gezeichnet)."""
import random
from gemeinsam import *

# Stand des Lesers wie im Hinweis: Kapitel 0–4 fertig, 5 angefangen, 6 aktuell, ab 7 offen.
FERTIG = {0, 1, 2, 3, 4}
ANGEFANGEN = {5: .3}
AKTUELL = 6
TEIL_VERDIENT = {"teil-grundlagen", "teil-eroeffnung"}
HINWEIS = ('Noch <b class="gold">5 Übungen</b> bis zum Ende von Kapitel 6. Danach fehlen dir noch die Kapitel 5 und 7 '
           'bis zum Orden „Teil Mittelspiel“.')

CSS_B = """
.hinweis{display:flex;gap:12px;align-items:center;background:rgba(27,43,69,.92);border:1px solid var(--rand);border-radius:14px;margin:6px 16px 0;padding:12px 14px;font-size:15px;position:relative;z-index:3}
.karte-weg{position:relative;width:390px}
.st{position:absolute;transform:translate(-50%,-50%);border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;z-index:2}
.st.fertig{width:48px;height:48px;background:radial-gradient(circle at 35% 30%,#fff1b8,#e3bf4a 45%,#a8841c);color:#16253d;font-size:18px;box-shadow:0 2px 6px rgba(0,0,0,.4)}
.st.fertig:after{content:'';position:absolute;right:-3px;bottom:-3px;width:18px;height:18px;border-radius:50%;background:#16253d url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M6 12.5l4 4L18 8' fill='none' stroke='%23e3bf4a' stroke-width='3' stroke-linecap='round'/%3E%3C/svg%3E") center/14px no-repeat;border:1.5px solid #e3bf4a}
.st.offen{width:46px;height:46px;background:#1b2b45;border:2px solid #56688a;color:#b8c2d1;font-size:17px}
.st.aktuell{width:66px;height:66px;background:#1b2b45;font-size:24px;box-shadow:0 0 0 8px rgba(227,191,74,.16),0 0 28px rgba(227,191,74,.45)}
.lab{position:absolute;transform:translateY(-50%);font-size:15px;line-height:1.2;z-index:2;text-shadow:0 1px 3px rgba(0,0,0,.8)}
.lab b{font-weight:600} .lab small{display:block;color:var(--leise);font-size:12.5px;margin-top:2px}
.lab.offen{color:#c3c9d3}
.hier{display:inline-block;background:var(--gold);color:#16253d;font-size:12px;font-weight:700;border-radius:99px;padding:2px 9px;margin-bottom:4px;text-shadow:none}
.med{position:absolute;transform:translate(-50%,-50%);z-index:2}
.zone{position:absolute;left:16px;z-index:2}
.zone .t{font-size:11.5px;letter-spacing:.14em;font-weight:700;color:var(--gold);text-transform:uppercase}
.zone .n{font-family:'Source Serif 4',Georgia,serif;font-size:21px;font-weight:600;text-shadow:0 1px 4px rgba(0,0,0,.8)}
.zone .k{font-size:12.5px;color:var(--leise)}
"""


def kopf_weg():
    return (f'<div style="padding:16px 16px 8px;display:flex;align-items:center;gap:12px"><span class="zurueck">{ic("links", 20)}Buch</span>'
            f'<h1 style="font-size:23px">Dein Weg durchs Buch</h1></div>')


def hinweis():
    return (f'<div class="hinweis">{ring(.7, 48, 5, innen="<b style=font-size:17px>6</b>")}<span>{HINWEIS}</span></div>')


def kurve(punkte):
    """Weiche Linie (Catmull-Rom als Bezier) durch die Punkte."""
    d = f"M{punkte[0][0]:.1f},{punkte[0][1]:.1f}"
    for i in range(len(punkte) - 1):
        p0 = punkte[i - 1] if i else punkte[i]
        p1, p2 = punkte[i], punkte[i + 1]
        p3 = punkte[i + 2] if i + 2 < len(punkte) else p2
        c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
        d += f" C{c1[0]:.1f},{c1[1]:.1f} {c2[0]:.1f},{c2[1]:.1f} {p2[0]:.1f},{p2[1]:.1f}"
    return d


def station_html(n, x, y, groesse_aktuell=66):
    if n in FERTIG:
        return f'<div class="st fertig" style="left:{x}px;top:{y}px">{n}</div>'
    if n == AKTUELL:
        return (f'<div class="st aktuell" style="left:{x}px;top:{y}px">{ring(.7, groesse_aktuell, 6, innen=f"<span>{n}</span>")}</div>'
                f'<div style="position:absolute;left:{x+38 if x >= 195 else x-78}px;top:{y-24}px;z-index:3;filter:drop-shadow(0 3px 4px rgba(0,0,0,.6))">{figur("wP", 40)}</div>')
    if n in ANGEFANGEN:
        return f'<div class="st offen" style="left:{x}px;top:{y}px;border:none;background:#1b2b45">{ring(ANGEFANGEN[n], 48, 4, grund="#56688a", innen=str(n))}</div>'
    return f'<div class="st offen" style="left:{x}px;top:{y}px">{n}</div>'


def label_html(n, titel, x, y, abstand=38, info=None):
    cls = "" if (n in FERTIG or n == AKTUELL) else "offen"
    if info is None:
        info = "fertig" if n in FERTIG else ("5 Übungen offen" if n == AKTUELL else ("angefangen" if n in ANGEFANGEN else ""))
    innen = (f'<span class="hier">Du bist hier</span><br>' if n == AKTUELL else "") + f'<b>{titel}</b>' + (f'<small>{info}</small>' if info else "")
    if x < 195:
        return f'<div class="lab {cls}" style="left:{x+abstand}px;top:{y}px;width:{390-x-abstand-12}px">{innen}</div>'
    return f'<div class="lab {cls}" style="right:{390-x+abstand}px;top:{y}px;width:{x-abstand-14}px;text-align:right">{innen}</div>'


# ======================= B1: Fünf Landschaften =======================
def hintergrund_b1(zonen, breite=390):
    """zonen: Liste (name, y0, y1). Jede Zone bekommt ihr eigenes Motiv."""
    rnd = random.Random(7)
    s = ['<defs>'
         '<pattern id="brett" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="20" height="20" fill="#e3bf4a" opacity=".06"/><rect x="20" y="20" width="20" height="20" fill="#e3bf4a" opacity=".06"/></pattern>'
         '<linearGradient id="morgen" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#14233c"/><stop offset=".55" stop-color="#1f2b44"/><stop offset=".85" stop-color="#3a3530"/><stop offset="1" stop-color="#4a3c27"/></linearGradient>'
         '<radialGradient id="sonne" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffd877" stop-opacity=".75"/><stop offset=".45" stop-color="#e3a84a" stop-opacity=".35"/><stop offset="1" stop-color="#e3a84a" stop-opacity="0"/></radialGradient>'
         '<linearGradient id="huegel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#22343e"/><stop offset="1" stop-color="#172833"/></linearGradient>'
         '<linearGradient id="nacht" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0c1526"/><stop offset="1" stop-color="#0a1120"/></linearGradient>'
         '<radialGradient id="lampe" cx=".5" cy="0" r=".9"><stop offset="0" stop-color="#ffd98a" stop-opacity=".30"/><stop offset="1" stop-color="#ffd98a" stop-opacity="0"/></radialGradient>'
         '<linearGradient id="saal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2234"/><stop offset="1" stop-color="#231f22"/></linearGradient>'
         '<linearGradient id="weich" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".15" stop-color="#fff" stop-opacity="1"/><stop offset=".85" stop-color="#fff" stop-opacity="1"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>'
         '</defs>']
    for zi, (name, y0, y1) in enumerate(zonen):
        h = y1 - y0
        s.append(f'<clipPath id="z{zi}"><rect x="0" y="{y0}" width="{breite}" height="{h}"/></clipPath><g clip-path="url(#z{zi})">')
        if name == "Grundlagen":
            s.append(f'<rect x="0" y="{y0}" width="{breite}" height="{h}" fill="#142540"/>')
            s.append(f'<rect x="0" y="{y0}" width="{breite}" height="{h}" fill="url(#brett)"/>')
            # Brettrand-Buchstaben dezent
            for i, b in enumerate("abcdefgh"):
                s.append(f'<text x="{i*40+30}" y="{y1-10}" font-size="11" fill="#e3bf4a" opacity=".22" font-family="Source Sans 3">{b}</text>')
        elif name == "Eröffnung":
            s.append(f'<rect x="0" y="{y0}" width="{breite}" height="{h}" fill="url(#morgen)"/>')
            cx, cy = 300, y1 - 18
            s.append(f'<circle cx="{cx}" cy="{cy}" r="150" fill="url(#sonne)"/>')
            for a in range(-80, 81, 16):
                rad = math.radians(a - 90)
                s.append(f'<line x1="{cx+math.cos(rad)*48:.0f}" y1="{cy+math.sin(rad)*48:.0f}" x2="{cx+math.cos(rad)*120:.0f}" y2="{cy+math.sin(rad)*120:.0f}" stroke="#ffd877" stroke-opacity=".16" stroke-width="3" stroke-linecap="round"/>')
            s.append(f'<circle cx="{cx}" cy="{cy}" r="36" fill="#f2c860" opacity=".55"/>')
            s.append(f'<path d="M0 {y1-30} Q 90 {y1-60} 180 {y1-34} T 390 {y1-40} V {y1} H 0 Z" fill="#1d2738"/>')
        elif name == "Mittelspiel":
            s.append(f'<rect x="0" y="{y0}" width="{breite}" height="{h}" fill="#1d2738"/>')
            schichten = [(0.12, "#22353f", .9), (0.42, "#1d3039", 1), (0.72, "#182a33", 1)]
            for t, farbe, op in schichten:
                yb = y0 + h * t
                pts = [(x, yb + 40 * math.sin(x / 70 + t * 9) + 18 * math.sin(x / 23 + t * 4)) for x in range(0, 391, 10)]
                d = "M0 " + f"{y1}" + " " + " ".join(f"L{x} {y:.0f}" for x, y in pts) + f" L390 {y1} Z"
                s.append(f'<path d="{d}" fill="{farbe}" opacity="{op}"/>')
                # Turm (Burg) auf dem höchsten Punkt der Schicht
                xt, yt = min(pts, key=lambda p: p[1])
                xt = max(40, min(350, xt))
                yt = yb + 40 * math.sin(xt / 70 + t * 9) + 18 * math.sin(xt / 23 + t * 4)
                s.append(f'<g transform="translate({xt-11:.0f},{yt-30:.0f})" fill="#2c4250" opacity=".95"><path d="M0 0h5v4h4V0h4v4h4V0h5v8l-3 3v15h3v4H-0v-4h3V11L0 8z"/></g>'
                         f'<path d="M{xt:.0f} {yt-30:.0f} v-14 l12 4 -12 4" fill="#c9a227" stroke="#c9a227" stroke-width="1.2" opacity=".55"/>')
        elif name == "Endspiel":
            s.append(f'<rect x="0" y="{y0}" width="{breite}" height="{h}" fill="url(#nacht)"/>')
            for _ in range(16):
                x, y = rnd.uniform(10, 380), rnd.uniform(y0 + 10, y1 - 10)
                r = rnd.choice([1, 1, 1.4, 1.8])
                s.append(f'<circle cx="{x:.0f}" cy="{y:.0f}" r="{r}" fill="#f5f0e6" opacity="{rnd.uniform(.35,.8):.2f}"/>')
            for x, y in [(330, y0 + 70), (365, y0 + 245)]:
                s.append(f'<path d="M{x} {y-9} L{x+2} {y-2} L{x+9} {y} L{x+2} {y+2} L{x} {y+9} L{x-2} {y+2} L{x-9} {y} L{x-2} {y-2} Z" fill="#f5f0e6" opacity=".7"/>')
            mx, my = 330, y0 + 150
            s.append(f'<circle cx="{mx}" cy="{my}" r="22" fill="#e9e1c8" opacity=".55"/><circle cx="{mx+9}" cy="{my-6}" r="20" fill="#0b1323"/>')
        elif name == "Praxis":
            s.append(f'<rect x="0" y="{y0}" width="{breite}" height="{h}" fill="url(#saal)"/>')
            for lx in (70, 195, 320):
                s.append(f'<line x1="{lx}" y1="{y0}" x2="{lx}" y2="{y0+26}" stroke="#4a4a50" stroke-width="1.5"/>'
                         f'<path d="M{lx-12} {y0+36} Q {lx} {y0+20} {lx+12} {y0+36} Z" fill="#6b5b3a"/>'
                         f'<ellipse cx="{lx}" cy="{y0+40}" rx="110" ry="{h*0.75:.0f}" fill="url(#lampe)" transform="translate(0,{0})"/>')
            # Reihen von Turniertischen mit Brett und Uhr
            for reihe, (yy, sk) in enumerate([(y0 + h * .42, .8), (y0 + h * .72, 1.0)]):
                for i in range(4):
                    x = 25 + i * 95 + (reihe * 30)
                    w = 72 * sk
                    s.append(f'<g opacity=".55"><rect x="{x}" y="{yy:.0f}" width="{w:.0f}" height="{10*sk:.0f}" rx="2" fill="#4a3b2a"/>'
                             f'<rect x="{x+w*.2:.0f}" y="{yy-8*sk:.0f}" width="{16*sk:.0f}" height="{8*sk:.0f}" fill="#d8cdb0"/><rect x="{x+w*.2:.0f}" y="{yy-8*sk:.0f}" width="{8*sk:.0f}" height="{4*sk:.0f}" fill="#6b6f78"/><rect x="{x+w*.2+8*sk:.0f}" y="{yy-4*sk:.0f}" width="{8*sk:.0f}" height="{4*sk:.0f}" fill="#6b6f78"/>'
                             f'<rect x="{x+w*.62:.0f}" y="{yy-9*sk:.0f}" width="{14*sk:.0f}" height="{9*sk:.0f}" rx="1.5" fill="#2b2b30"/><rect x="{x+w*.62+2*sk:.0f}" y="{yy-12*sk:.0f}" width="{4*sk:.0f}" height="{3*sk:.0f}" fill="#c9a227"/>'
                             f'<rect x="{x+4}" y="{yy+10*sk:.0f}" width="3" height="{20*sk:.0f}" fill="#3a2f22"/><rect x="{x+w-7:.0f}" y="{yy+10*sk:.0f}" width="3" height="{20*sk:.0f}" fill="#3a2f22"/></g>')
        s.append('</g>')
    # weiche Übergänge zwischen den Zonen
    for (_, _, y1), _ in zip(zonen[:-1], zonen[1:]):
        s.append(f'<rect x="0" y="{y1-14}" width="{breite}" height="28" fill="#0f1b2e" opacity=".35" filter="blur(6px)"/>')
    return s


def b1():
    oben = 0
    nodes = []  # (art, wert, y)
    zonen = []
    y = 20
    for name, key, kap in TEILE:
        y0 = y
        y += 84  # Zonenkopf
        for i, n in enumerate(kap):
            nodes.append(("st", n, y)); y += 72 if i < len(kap) - 1 else 76
        nodes.append(("med", key, y)); y += 46
        zonen.append((name, y0, y))
    hoehe = y + 10
    xs = [195 + 105 * math.sin(j * 0.95 + 0.4) for j in range(len(nodes))]
    pts = [(xs[j], nodes[j][2]) for j in range(len(nodes))]
    idx_akt = next(j for j, nd in enumerate(nodes) if nd[0] == "st" and nd[1] == AKTUELL)
    svg = hintergrund_b1(zonen)
    d_fertig = kurve(pts[:idx_akt + 1])
    d_rest = kurve(pts[idx_akt:])
    svg.append(f'<path d="{d_rest}" fill="none" stroke="#7c8cab" stroke-width="5" stroke-dasharray="1 13" stroke-linecap="round" opacity=".85"/>')
    svg.append(f'<path d="{d_fertig}" fill="none" stroke="#e3bf4a" stroke-width="12" opacity=".18" stroke-linecap="round"/>')
    svg.append(f'<path d="{d_fertig}" fill="none" stroke="#e3bf4a" stroke-width="5" stroke-linecap="round"/>')
    teile = []
    for (name, y0, y1), (_, key, kap) in zip(zonen, TEILE):
        nr = [t[0] for t in TEILE].index(name) + 1
        teile.append(f'<div class="zone" style="top:{y0+12}px"><div class="t">Teil {nr}</div><div class="n">{name}</div></div>')
    elemente = []
    titel = {n: t for n, t, _ in KAPITEL}
    for j, (art, wert, yy) in enumerate(nodes):
        x = round(xs[j])
        if art == "st":
            elemente.append(station_html(wert, x, yy) + label_html(wert, titel[wert], x, yy, 44 if wert == AKTUELL else 36))
        else:
            verdient = wert in TEIL_VERDIENT
            glanz = "filter:drop-shadow(0 0 12px rgba(227,191,74,.55))" if verdient else ""
            elemente.append(f'<div class="med" style="left:{x}px;top:{yy}px">{medaille(wert, verdient, 70, glanz)}</div>')
            name = [t[0] for t in TEILE if t[1] == wert][0]
            info = "verdient" if verdient else ("noch 2 Kapitel" if name == "Mittelspiel" else "noch nicht")
            txt = f'<b style="color:{"#e3bf4a" if verdient else "#c3c9d3"}">Orden „Teil {name}“</b><small>{info}</small>'
            if x < 195:
                elemente.append(f'<div class="lab" style="left:{x+44}px;top:{yy}px">{txt}</div>')
            else:
                elemente.append(f'<div class="lab" style="right:{390-x+44}px;top:{yy}px;text-align:right">{txt}</div>')
    karte = (f'<div class="karte-weg" style="height:{hoehe}px"><svg width="390" height="{hoehe}" style="position:absolute;inset:0">{"".join(svg)}</svg>'
             f'{"".join(teile)}{"".join(elemente)}</div>')
    inhalt = f'{kopf_weg()}{hinweis()}<div style="height:10px"></div>{karte}'
    schreibe("b1", seite("B1 Fünf Landschaften", inhalt, CSS_B))


# ======================= B2: Springerwege über das Brett =======================
def b2():
    q = 390 / 8
    # von unten nach oben: Start, Kapitel 0..12, Krone
    spalten = {"start": 3, 0: 4, 1: 3, 2: 4, 3: 5, 4: 4, 5: 3, 6: 2, 7: 3, 8: 4, 9: 5, 10: 4, 11: 3, 12: 4, "krone": 3}
    folge = ["start"] + list(range(13)) + ["krone"]
    reihen_gesamt = 2 * (len(folge) - 1) + 3
    hoehe = reihen_gesamt * q
    def mitte(i):  # i: Index in folge, von unten
        reihe = reihen_gesamt - 2 - 2 * i  # Reihe von oben
        return (spalten[folge[i]] + .5) * q, (reihe + .5) * q, reihe
    tönung = {"Grundlagen": "#3fa7a0", "Eröffnung": "#e3a84a", "Mittelspiel": "#6fae6a", "Endspiel": "#5b7fd6", "Praxis": "#d06a5a"}
    s = []
    for r in range(reihen_gesamt):
        for c in range(8):
            s.append(f'<rect x="{c*q:.2f}" y="{r*q:.2f}" width="{q+.3:.2f}" height="{q+.3:.2f}" fill="{"#1d2e4a" if (r+c)%2==0 else "#15243c"}"/>')
    # Bänder der Buchteile: Grenze (Ausgang) liegt an der Oberkante der Reihe der letzten Station
    def reihe_von(k):
        return mitte(folge.index(k))[2]
    grenzen = []
    unten = hoehe
    for name, key, kap in TEILE:
        oben_linie = reihe_von(kap[-1]) * q
        s.append(f'<rect x="0" y="{oben_linie:.1f}" width="390" height="{unten-oben_linie:.1f}" fill="{tönung[name]}" opacity=".10"/>')
        grenzen.append((name, key, oben_linie, unten))
        unten = oben_linie
    for name, key, oben_linie, _ in grenzen:
        s.append(f'<line x1="0" y1="{oben_linie:.1f}" x2="390" y2="{oben_linie:.1f}" stroke="#e3bf4a" stroke-width="1.5" stroke-dasharray="6 6" opacity=".45"/>')
    # Wege
    pts = [mitte(i)[:2] for i in range(len(folge))]
    i_akt = folge.index(AKTUELL)
    for i in range(len(pts) - 1):
        (x1, y1), (x2, y2) = pts[i], pts[i + 1]
        fertig = i < i_akt
        if fertig:
            s.append(f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="#e3bf4a" stroke-width="5" stroke-linecap="round"/>')
        else:
            s.append(f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="#8796b3" stroke-width="4" stroke-dasharray="1 11" stroke-linecap="round"/>')
    el = []
    titel = {n: t for n, t, _ in KAPITEL}
    for i, k in enumerate(folge):
        x, y, r = mitte(i)
        c = spalten[k]
        x0, y0 = c * q, r * q
        if k == "start":
            el.append(f'<div style="position:absolute;left:{x0+3:.0f}px;top:{y0+3:.0f}px;width:{q-6:.0f}px;height:{q-6:.0f}px;border-radius:8px;border:2px solid #e3bf4a;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#e3bf4a">START</div>')
            continue
        if k == "krone":
            el.append(f'<div style="position:absolute;left:{x0:.0f}px;top:{y0:.0f}px;width:{q:.0f}px;height:{q:.0f}px;background:rgba(227,191,74,.18);border:2px dashed #e3bf4a;border-radius:6px;display:flex;align-items:center;justify-content:center;opacity:.9">{figur("wQ", 40)}</div>')
            el.append(f'<div class="lab" style="right:{390-x0+10:.0f}px;top:{y:.0f}px;text-align:right"><b class="gold">Umwandlung</b><small>das ganze Buch geschafft</small></div>')
            continue
        if k in FERTIG:
            box = f'background:linear-gradient(135deg,#f2d27a,#c9a227);color:#16253d'
            inhalt = f'<span style="font-size:19px">{k}</span>'
        elif k == AKTUELL:
            box = 'background:#26395c;box-shadow:0 0 0 3px #e3bf4a,0 0 24px rgba(227,191,74,.6)'
            inhalt = figur("wP", 40)
        elif k in ANGEFANGEN:
            box = 'background:#22365a;border:2px solid #e3bf4a;color:#f5f0e6'
            inhalt = f'<span style="font-size:18px">{k}</span>'
        else:
            box = 'background:#1b2b45;border:2px solid #56688a;color:#b8c2d1'
            inhalt = f'<span style="font-size:18px">{k}</span>'
        el.append(f'<div style="position:absolute;left:{x0+2:.0f}px;top:{y0+2:.0f}px;width:{q-4:.0f}px;height:{q-4:.0f}px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-weight:700;z-index:2;{box}">{inhalt}</div>')
        info = ("" if k in FERTIG else "5 Übungen offen" if k == AKTUELL else "angefangen" if k in ANGEFANGEN else "")
        kopfzeile = '<span class="hier">Du bist hier</span><br>' if k == AKTUELL else ""
        txt = f'{kopfzeile}<b>{titel[k]}</b>' + (f'<small>{info}</small>' if info else "")
        pill = "background:rgba(15,27,46,.85);padding:4px 9px;border-radius:9px;font-size:14px"
        cls = "" if (k in FERTIG or k == AKTUELL) else "offen"
        if c <= 3:
            el.append(f'<div class="lab {cls}" style="left:{x0+q+8:.0f}px;top:{y:.0f}px;max-width:{7*q-(x0+q+8)-4:.0f}px;{pill}">{txt}</div>')
        else:
            el.append(f'<div class="lab {cls}" style="right:{390-x0+8:.0f}px;top:{y:.0f}px;max-width:{x0-18:.0f}px;text-align:right;{pill}">{txt}</div>')
    for nr, (name, key, oben_linie, unten) in enumerate(grenzen, 1):
        verdient = key in TEIL_VERDIENT
        glanz = "filter:drop-shadow(0 0 10px rgba(227,191,74,.6))" if verdient else ""
        el.append(f'<div class="med" style="left:{7.5*q-2:.0f}px;top:{oben_linie:.0f}px">{medaille(key, verdient, 56, glanz)}</div>')
        el.append(f'<div style="position:absolute;left:10px;top:{unten-q+3:.0f}px;z-index:2;line-height:1.05"><span style="font-size:11px;letter-spacing:.14em;color:{tönung[name]};font-weight:700;text-transform:uppercase;filter:brightness(1.3)">Teil {nr}</span>'
                  f'<div class="serif" style="font-size:18px;text-shadow:0 1px 3px #000">{name}</div></div>')
    karte = (f'<div class="karte-weg" style="height:{hoehe:.0f}px;margin-top:10px"><svg width="390" height="{hoehe:.0f}" style="position:absolute;inset:0">{"".join(s)}</svg>{"".join(el)}</div>')
    kopf = (f'{kopf_weg()}{hinweis()}'
            f'<div class="leise klein" style="margin:10px 16px 0">Von unten nach oben: jeder Schritt ein Springerzug, oben wartet die Umwandlung.</div>')
    schreibe("b2", seite("B2 Springerweg", kopf + karte, CSS_B + ".lab.offen b{color:#d3d9e2}"))


# ======================= B3: Gebundenes Buch =======================
def b3():
    css = CSS_B + """
.band{position:relative;margin:14px 14px;border-radius:14px;padding:16px 14px 8px;overflow:hidden;background:#17263f}
.band .rahmen{position:absolute;inset:5px;border:1px solid rgba(227,191,74,.35);border-radius:10px;pointer-events:none}
.band .rahmen2{position:absolute;inset:0;border:1.5px solid rgba(227,191,74,.55);border-radius:14px;pointer-events:none}
.ecke{position:absolute;width:14px;height:14px;pointer-events:none}
.bkopf{display:flex;align-items:center;gap:12px;position:relative;padding:0 4px 10px;border-bottom:1px solid rgba(227,191,74,.25);margin-bottom:6px}
.bkopf .t{font-size:11.5px;letter-spacing:.18em;color:var(--gold);font-weight:700}
.bkopf .n{font-family:'Source Serif 4',Georgia,serif;font-size:22px;letter-spacing:.04em}
.reihe{position:relative;display:flex;align-items:center;gap:14px;min-height:58px;padding-left:2px}
.reihe .knoten{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;flex:none;position:relative;z-index:2}
.reihe b{font-weight:600;font-size:16px;display:block;line-height:1.2} .reihe small{color:var(--leise);font-size:13px}
.faden{position:absolute;left:21px;width:3px;z-index:1;margin-left:-1px}
.balken{height:6px;border-radius:3px;background:#2c3d5a;overflow:hidden;margin-top:5px;width:150px} .balken i{display:block;height:100%;background:var(--gold)}
"""
    korn = ('<svg style="position:absolute;inset:0;width:100%;height:100%;opacity:.22;mix-blend-mode:overlay" aria-hidden="true">'
            '<filter id="leder"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .9 0"/></filter>'
            '<rect width="100%" height="100%" filter="url(#leder)"/></svg>')
    ecke = '<svg class="ecke" style="{pos}" viewBox="0 0 14 14"><path d="M1 7 L7 1 L13 7 L7 13 Z" fill="none" stroke="#e3bf4a" stroke-width="1.2" opacity=".7"/><circle cx="7" cy="7" r="1.6" fill="#e3bf4a" opacity=".8"/></svg>'
    ecken = "".join(ecke.format(pos=p) for p in ["top:-1px;left:-1px", "top:-1px;right:-1px", "bottom:-1px;left:-1px", "bottom:-1px;right:-1px"])
    titel = {n: (t, a) for n, t, a in KAPITEL}
    baender = []
    for nr, (name, key, kap) in enumerate(TEILE, 1):
        verdient = key in TEIL_VERDIENT
        anzahl = sum(1 for k in kap if k in FERTIG)
        glanz = "filter:drop-shadow(0 0 10px rgba(227,191,74,.5))" if verdient else ""
        status = "Orden verdient" if verdient else f"{anzahl} von {len(kap)} Kapiteln"
        kopf = (f'<div class="bkopf"><div style="flex:1"><div class="t">TEIL {nr} · KAPITEL {kap[0]}–{kap[-1]}</div><div class="n">{name}</div>'
                f'<div class="klein" style="color:{"#e3bf4a" if verdient else "#c3c9d3"}">{status}</div></div>{medaille(key, verdient, 62, glanz)}</div>')
        reihen = []
        for i, k in enumerate(kap):
            t, a = titel[k]
            if k in FERTIG:
                knoten = f'<span class="knoten" style="background:radial-gradient(circle at 35% 30%,#fff1b8,#e3bf4a 45%,#a8841c);color:#16253d">{ic("haken", 20, None, 3)}</span>'
                text = f'<b>{k} · {t}</b><small>fertig</small>'
            elif k == AKTUELL:
                knoten = f'<span class="knoten" style="box-shadow:0 0 0 6px rgba(227,191,74,.18),0 0 18px rgba(227,191,74,.5)">{ring(.7, 44, 4, innen=str(k))}</span>'
                text = f'<span class="hier">Du bist hier</span><b>{k} · {t}</b><small>noch 5 Übungen</small><div class="balken"><i style="width:70%"></i></div>'
            elif k in ANGEFANGEN:
                knoten = f'<span class="knoten" style="background:#1b2b45">{ring(ANGEFANGEN[k], 40, 3.5, grund="#56688a", innen=str(k))}</span>'
                text = f'<b>{k} · {t}</b><small>angefangen · {a} Abbildungen</small>'
            else:
                knoten = f'<span class="knoten" style="background:#1b2b45;border:2px solid #56688a;color:#b8c2d1">{k}</span>'
                text = f'<b style="color:#d3d9e2">{k} · {t}</b><small>{a} Abbildungen</small>'
            farbe = "#e3bf4a" if k in FERTIG else "#3e5070"
            oben = "50%" if i == 0 else "0"
            unten = "50%" if i == len(kap) - 1 else "0"
            linie = f'<span class="faden" style="top:{oben};bottom:{unten};background:{farbe}"></span>' if len(kap) > 1 else ""
            reihen.append(f'<div class="reihe">{linie}{knoten}<span style="flex:1">{text}</span>{ic("pfeil", 18, "#7d8aa0")}</div>')
        # Faden (Lesebändchen) hinter den Knoten
        alle_fertig = all(k in FERTIG for k in kap)
        faden_farbe = "#e3bf4a" if alle_fertig else "linear-gradient(#e3bf4a 0,#e3bf4a 30%,#56688a 30%)"
        if name in ("Endspiel", "Praxis"):
            faden_farbe = "#3e5070"
        faden = f'<span class="faden" style="top:{108}px;bottom:30px;left:37px;background:{faden_farbe}"></span>'
        stueck = {"Grundlagen": "wP", "Eröffnung": "wN", "Mittelspiel": "wR", "Endspiel": "wK", "Praxis": "wQ"}[name]
        praegung = f'<img src="{FIG}{stueck}.svg" style="position:absolute;right:-26px;bottom:-22px;width:170px;opacity:.07;transform:rotate(-8deg)" alt="">'
        baender.append(f'<div class="band">{korn}{praegung}<span class="rahmen2"></span><span class="rahmen"></span>{ecken}{kopf}<div style="position:relative">{"".join(reihen)}</div></div>')
    inhalt = f'{kopf_weg()}{hinweis()}{"".join(baender)}<div style="height:6px"></div>'
    schreibe("b3", seite("B3 Gebundenes Buch", inhalt, css))


if __name__ == "__main__":
    b1(); b2(); b3()
