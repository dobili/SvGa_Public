"""F: Auswertung nach der Partie (Beispiel: du mit Weiß gegen Derya, Stufe 2, Matt im 29. Zug)."""
from bausteine3 import *

MOMENT_FEN = "r2q1rk1/pb3ppp/1p3n2/2pQ4/2Pn4/2NB1N2/PP3PPP/R4RK1 w - - 0 18"
# Gewinnchance von Weiß je Zug (1 bis 29)
KURVE = [52, 55, 57, 58, 56, 58, 60, 59, 61, 60, 62, 70, 78, 77, 74, 72, 72, 31, 34, 40, 52, 61, 66, 60, 74, 82, 90, 96, 100]
MARKEN = {13: "#5b8fc9", 18: "#d63a3a", 24: "#d65a4a", 15: "#d1a21a"}
ZUEGE = {"Brillant": 0, "Stark": 1, "Bester Zug": 9, "Sehr gut": 6, "Gut": 5, "Theoriezug": 4, "Ungenau": 2, "Fehler": 0, "Verpasst": 1, "Patzer": 1}
PHASEN = [("Eröffnung", 86, "Gut"), ("Mittelspiel", 71, "Ungenau"), ("Endspiel", 84, "Gut")]

CSS_F = """
.erg{display:flex;gap:14px;align-items:center}
.pill{display:inline-flex;align-items:center;gap:6px;border-radius:99px;padding:3px 10px 3px 4px;font-size:13.5px;font-weight:600;background:#22365a}
.sek{font-size:12px;letter-spacing:.1em;font-weight:700;color:var(--leise);text-transform:uppercase}
.knopfzeile{display:flex;gap:10px;margin:14px 16px 18px}
.icknopf{width:48px;height:48px;border-radius:12px;border:1.5px solid #4b5d7c;display:flex;align-items:center;justify-content:center;flex:none;color:var(--text)}
"""


def verlauf(w=326, h=96, marken=True, phasen=True):
    n = len(KURVE)
    xs = [i * (w - 4) / (n - 1) + 2 for i in range(n)]
    ys = [h - 6 - v / 100 * (h - 12) for v in KURVE]
    linie = " ".join(f"{'M' if i == 0 else 'L'}{x:.1f},{y:.1f}" for i, (x, y) in enumerate(zip(xs, ys)))
    flaeche = linie + f" L{xs[-1]:.1f},{h} L{xs[0]:.1f},{h} Z"
    s = [f'<defs><linearGradient id="vf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e3bf4a" stop-opacity=".28"/><stop offset="1" stop-color="#e3bf4a" stop-opacity="0"/></linearGradient></defs><rect width="{w}" height="{h}" fill="#13213a"/>',
         f'<line x1="0" y1="{h/2}" x2="{w}" y2="{h/2}" stroke="#3e5070" stroke-dasharray="3 4"/>']
    if phasen:
        for z in (10, 25):
            x = xs[z - 1]
            s.append(f'<line x1="{x:.1f}" y1="0" x2="{x:.1f}" y2="{h}" stroke="#2c3d5a"/>')
    s.append(f'<path d="{flaeche}" fill="url(#vf)"/>')
    s.append(f'<path d="{linie}" fill="none" stroke="#e3bf4a" stroke-width="2.5" stroke-linejoin="round"/>')
    if marken:
        for z, farbe in MARKEN.items():
            s.append(f'<circle cx="{xs[z-1]:.1f}" cy="{ys[z-1]:.1f}" r="5" fill="{farbe}" stroke="#13213a" stroke-width="2"/>')
    return f'<svg width="{w}" height="{h}" style="display:block;border-radius:10px">{"".join(s)}</svg>'


def phasenlabels(w=326):
    return (f'<div style="display:flex;width:{w}px;font-size:11.5px;color:var(--leise);margin-top:4px">'
            f'<span style="width:{9/28*100:.0f}%">Eröffnung</span><span style="width:{15/28*100:.0f}%">Mittelspiel</span><span>Endspiel</span></div>')


def zugchips(nur_mehr_als_null=True):
    out = []
    for z, name, farbe in ZUGKLASSEN:
        n = ZUEGE[name]
        if nur_mehr_als_null and n == 0:
            continue
        out.append(f'<span class="pill">{zugzeichen(z, farbe, 22)}{n} {name}</span>')
    return '<div style="display:flex;flex-wrap:wrap;gap:6px">' + "".join(out) + '</div>'


def brettkopf():
    """Angedeutetes Brett oben (die Auswertung steht in der App unter dem Brett)."""
    return (f'<div style="height:64px;overflow:hidden;position:relative;opacity:.55">{fenbrett("6k1/5pQp/6p1/8/8/8/5PPP/6K1 w - - 0 29", 390, runden=0, schatten=False)}'
            f'<div style="position:absolute;inset:0;background:linear-gradient(transparent,#0f1b2e)"></div></div>')


# ---------------- F1: Ergebnis und ein Moment ----------------
def f1():
    erg = (f'<div class="karte" style="margin-top:4px;background:linear-gradient(150deg,#26395c,#1b2b45 65%)">'
           f'<div class="erg">{gegner("selin", 52)}<div style="flex:1"><div class="serif" style="font-size:28px;line-height:1">Gewonnen</div>'
           f'<div class="leise klein" style="margin-top:4px">Matt im 29. Zug · gegen Derya, Stufe 2</div></div>'
           f'{ring(.78, 70, 7, innen="<b style=font-size:19px>78</b><span style=font-size:11px> %</span>")}</div>'
           f'<div style="display:flex;justify-content:space-between;margin-top:14px;font-size:14px"><span class="leise">Genauigkeit</span><b>78 % · ordentlich gespielt</b></div>'
           f'<div style="display:flex;justify-content:space-between;margin-top:6px;font-size:14px"><span class="leise">Spielstärke in dieser Partie</span><b>etwa 650</b></div>'
           f'<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:12px">'
           + "".join(f'<div style="background:#16253d;border-radius:10px;padding:8px"><div class="leise" style="font-size:12px">{p}</div><b style="font-size:17px">{v} %</b>'
                     f'<div style="height:4px;border-radius:2px;background:#2c3d5a;margin-top:5px;overflow:hidden"><i style="display:block;height:100%;width:{(v-50)*2}%;background:{"#e3bf4a" if v>=80 else "#d1a21a"}"></i></div></div>' for p, v, _ in PHASEN)
           + '</div></div>')
    moment = (f'<div class="karte"><div class="sek">Der wichtigste Moment</div>'
              f'<div style="display:flex;gap:12px;margin-top:10px">{fenbrett(MOMENT_FEN, 140, pfeile=[("d5", "b7", "#d63a3a"), ("f3", "d4", "#e3bf4a")])}'
              f'<div style="flex:1;min-width:0"><div class="zeile" style="gap:8px">{zugzeichen("??", "#d63a3a", 24)}<b class="serif" style="font-size:22px">18. Dxb7</b></div>'
              f'<div style="font-size:14.5px;margin-top:8px">Deine Gewinnchance fällt von <b>72 %</b> auf <b>31 %</b>.</div>'
              f'<div style="font-size:14.5px;margin-top:6px">Besser war <b class="gold">18. Sxd4</b>.</div></div></div>'
              f'<div style="display:flex;gap:8px;margin-top:12px"><span class="knopf rahmen" style="flex:1;min-height:46px;font-size:15px">Zur Stellung</span>'
              f'<span class="knopf rahmen" style="flex:1;min-height:46px;font-size:15px">{ic("lesezeichen", 18)}Merken</span></div></div>')
    kurve = (f'<div class="karte"><div class="zeile" style="justify-content:space-between"><span class="sek">Verlauf</span><span class="leise klein">Tipp auf die Linie springt zum Zug</span></div>'
             f'<div style="margin-top:10px">{verlauf()}</div>{phasenlabels()}</div>')
    zuege = (f'<div class="karte"><div class="zeile" style="justify-content:space-between;margin-bottom:10px"><span class="sek">Deine Züge</span><span class="leise klein">alle 10 Arten ›</span></div>{zugchips()}'
             f'<div class="zeile" style="justify-content:space-between;margin-top:14px;min-height:44px;border-top:1px solid #2c3d5a;padding-top:6px"><span>Fehler der Engine <span class="leise">(2, absichtlich)</span></span>{ic("runter", 18, "#c3c9d3")}</div></div>')
    knoepfe = (f'<div class="knopfzeile"><span class="knopf" style="flex:1">{ic("plus", 20)}Neue Partie</span>'
               f'<span class="icknopf" aria-label="Teilen (PGN)"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M7 8l5-5 5 5M5 14v5h14v-5"/></svg></span></div>')
    inhalt = brettkopf() + erg + moment + kurve + zuege + knoepfe
    schreibe("f1", seite("F1 Ergebnis zuerst", inhalt, CSS_F))


# ---------------- F2: Die Partie als Geschichte ----------------
def f2():
    css = CSS_F + """
.zeit{position:relative;margin:6px 16px 0;padding-left:30px}
.zeit:before{content:'';position:absolute;left:10px;top:8px;bottom:30px;width:3px;border-radius:2px;background:linear-gradient(#7fb5ae 0,#7fb5ae 22%,#e3bf4a 22%,#e3bf4a 55%,#d63a3a 55%,#d63a3a 62%,#e3bf4a 62%)}
.ereignis{position:relative;background:var(--karte);border:1px solid var(--rand);border-radius:14px;padding:12px;margin-bottom:12px}
.ereignis .punkt{position:absolute;left:-28px;top:16px}
.ereignis .zug{font-family:'Source Serif 4',Georgia,serif;font-size:19px}
.phase{font-size:11.5px;letter-spacing:.12em;font-weight:700;color:var(--gold);margin:14px 0 8px -30px;padding-left:30px;text-transform:uppercase}
"""
    kopf = (f'<div class="karte" style="margin-top:4px;display:flex;gap:12px;align-items:center;padding:12px 14px">{gegner("selin", 44)}'
            f'<div style="flex:1"><b class="serif" style="font-size:21px">Gewonnen</b><div class="leise klein">gegen Derya · Matt im 29. Zug</div></div>'
            f'<div style="text-align:right"><b style="font-size:20px">78 %</b><div class="leise" style="font-size:12px">genau</div></div></div>'
            f'<div style="margin:2px 16px 6px">{verlauf(358, 64, True, True)}</div>')
    def ereignis(zeichen, farbe, zug, text, brett=None, extra=""):
        b = f'<div style="margin-left:auto">{brett}</div>' if brett else ""
        return (f'<div class="ereignis"><span class="punkt">{zugzeichen(zeichen, farbe, 22)}</span><div style="display:flex;gap:10px">'
                f'<div style="flex:1;min-width:0"><div class="zug">{zug}</div><div style="font-size:14.5px;margin-top:4px">{text}</div>{extra}</div>{b}</div></div>')
    zeit = ('<div class="zeit">'
            '<div class="phase">Eröffnung · Zug 1 bis 9</div>'
            + ereignis("ic:buch", "#a5835a", "Italienische Partie", "4 Theoriezüge, dann eigene. Zentrum, Entwicklung und Rochade: alle drei Ziele erreicht.")
            + '<div class="phase">Mittelspiel · Zug 10 bis 24</div>'
            + ereignis("!", "#5b8fc9", "13. Lxf7+", "Derya ließ f7 ungedeckt (ein absichtlicher Fehler der Engine), und du hast es gesehen.",
                       fenbrett("r2q1rk1/pb3Bpp/1p3n2/2p5/2Pn4/2N2N2/PP1Q1PPP/R4RK1 b - - 0 13", 84, pfeile=[("c4", "f7", "#5b8fc9")]))
            + ereignis("??", "#d63a3a", "18. Dxb7", "Gewinnchance 72 % → 31 %. Besser war <b class=gold>18. Sxd4</b>.",
                       fenbrett(MOMENT_FEN, 84, pfeile=[("d5", "b7", "#d63a3a"), ("f3", "d4", "#e3bf4a")]),
                       '<div style="display:flex;gap:6px;margin-top:8px"><span class="chip" style="min-height:40px;font-size:13.5px">Zur Stellung</span></div>')
            + ereignis("ic:kreuz", "#d65a4a", "24. Te1", "Verpasst: 24. Dh5 hätte sofort gewonnen.")
            + '<div class="phase">Endspiel · Zug 25 bis 29</div>'
            + ereignis("ic:stern", "#5fa64a", "29. Dg7#", "Matt. Die letzten fünf Züge waren alle die besten.",
                       fenbrett("6k1/5pQp/6p1/8/8/8/5PPP/6K1 w - - 0 29", 84, felder=[("g8", "#d63a3a88")]))
            + '</div>')
    unten = (f'<div class="karte"><div class="sek" style="margin-bottom:10px">In Zahlen</div>{zugchips()}</div>'
             f'<div class="knopfzeile"><span class="knopf" style="flex:1">Neue Partie</span><span class="knopf rahmen" style="flex:1">Teilen</span></div>')
    schreibe("f2", seite("F2 Geschichte", kopf + zeit + unten, css))


# ---------------- F3: Was du mitnimmst ----------------
def f3():
    css = CSS_F + """
.lern{border-radius:16px;margin:12px 16px;padding:14px;border:1px solid var(--rand);background:var(--karte)}
.lern .kz{display:flex;gap:10px;align-items:center;margin-bottom:8px}
.lern.gut{border-left:5px solid #5fa64a}
.lern.schlecht{border-left:5px solid #d63a3a}
.lern.ueben{border-left:5px solid #e3bf4a}
"""
    kopf = (f'<div style="padding:4px 16px 0"><div class="zeile" style="gap:12px">{gegner("selin", 48)}<div><div class="serif" style="font-size:26px;line-height:1.05">Gewonnen!</div>'
            f'<div class="leise klein">gegen Derya · Matt im 29. Zug · 78 % genau</div></div></div>'
            f'<h2 style="margin-top:18px;font-size:19px">Drei Dinge aus dieser Partie</h2></div>')
    gut = (f'<div class="lern gut"><div class="kz">{zugzeichen("!", "#5b8fc9", 26)}<b style="font-size:16px">Das war stark</b></div>'
           f'<div style="font-size:15px"><b>13. Lxf7+</b> – du hast gesehen, dass f7 nur vom König gedeckt war (Kapitel 1, Angriffsregel).</div></div>')
    schlecht = (f'<div class="lern schlecht"><div class="kz">{zugzeichen("??", "#d63a3a", 26)}<b style="font-size:16px">Hier ging es schief</b></div>'
                f'<div style="display:flex;gap:12px">{fenbrett(MOMENT_FEN, 132)}<div style="font-size:15px"><b>18. Dxb7??</b> holte einen Bauern, aber dein Springer f3 hätte den Springer d4 schlagen können.'
                f'<div class="leise klein" style="margin-top:6px">Gewinnchance 72 % → 31 %</div></div></div>'
                f'<span class="knopf" style="width:100%;margin-top:12px">{ic("puzzle", 20)}Finde den besseren Zug</span>'
                f'<div class="zeile" style="justify-content:center;gap:8px;margin-top:8px;min-height:44px;color:var(--leise);font-size:14.5px">{ic("plus", 16)}In die Fehlerdatenbank (Kapitel 12)</div></div>')
    ueben = (f'<div class="lern ueben"><div class="kz">{ic("ziel", 26, "#e3bf4a")}<b style="font-size:16px">Übe das als Nächstes</b></div>'
             f'<div style="font-size:15px">Zweimal hast du eine hängende Figur übersehen. Der Zähltrainer übt genau das.</div>'
             f'<span class="knopf rahmen" style="width:100%;margin-top:12px">Zähltrainer: 8 Aufgaben</span></div>')
    zahlen = (f'<div class="karte" style="padding:6px 16px"><div class="zeile" style="justify-content:space-between;min-height:48px"><b>Alle Zahlen</b><span class="leise klein">Genauigkeit, Verlauf, Zugarten {ic("runter", 16)}</span></div></div>')
    knoepfe = (f'<div class="knopfzeile"><span class="knopf" style="flex:1">Revanche</span><span class="knopf rahmen" style="flex:1">Neue Partie</span></div>')
    schreibe("f3", seite("F3 Mitnehmen", brettkopf() + kopf + gut + schlecht + ueben + zahlen + knoepfe, css))


if __name__ == "__main__":
    f1(); f2(); f3()
