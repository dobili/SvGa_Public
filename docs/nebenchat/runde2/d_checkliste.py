"""D: Nachschlagen › Gesamt-Checkliste."""
import json
from gemeinsam import *

N = json.load(open("/home/user/wt-k/app/public/daten/de/a1/nachschlagen.json"))
FRAGEN = {z["kapitel"]: z["kernfrage"] for z in N["checkliste"]["zeilen"]}
WERKZEUG = {z["kapitel"]: z["werkzeug"] for z in N["checkliste"]["zeilen"]}
PUNKTE = {l["kapitel"]: l["punkte"] for l in N["lernziele"]}
GESAMT = sum(len(p) for p in PUNKTE.values())
ERLEDIGT = {0: 8, 1: 4, 2: 2}  # Beispielstand
HAKEN_K1 = {0, 2, 3, 5}
OFFEN_KAP = 1
SUMME = sum(ERLEDIGT.values())


def kopf_check():
    return (f'<div style="padding:16px 16px 4px;display:flex;align-items:center;gap:12px"><span class="zurueck">{ic("links", 20)}Nachschlagen</span></div>'
            f'<div style="padding:0 16px"><h1 style="font-size:28px">Gesamt-Checkliste</h1></div>')


def haken(an, px=26):
    if an:
        return f'<span style="width:{px}px;height:{px}px;border-radius:7px;background:var(--gold);color:#16253d;display:flex;align-items:center;justify-content:center;flex:none">{ic("haken", px-8, None, 3)}</span>'
    return f'<span style="width:{px}px;height:{px}px;border-radius:7px;border:2px solid #6e7f9c;flex:none"></span>'


def punktliste(k, rand=True):
    zeilen = "".join(
        f'<div style="display:flex;gap:12px;align-items:center;min-height:48px;padding:6px 0;{"border-top:1px solid #26385a;" if i else ""}">{haken(i in HAKEN_K1)}'
        f'<span style="font-size:15px;{"color:#c3c9d3;" if i in HAKEN_K1 else ""}">{p[0].upper() + p[1:]}</span></div>'
        for i, p in enumerate(PUNKTE[k]))
    return zeilen


# ---------------- D1: Ringe und Fortschrittsband ----------------
def d1():
    css = """
.sum{background:var(--karte);border:1px solid var(--rand);border-radius:16px;margin:12px 16px;padding:14px 16px}
.band{display:flex;gap:3px;height:12px;margin:12px 0 4px}
.band span{border-radius:3px;background:#2c3d5a;overflow:hidden;position:relative}
.band span i{position:absolute;left:0;top:0;bottom:0;background:var(--gold)}
.nr{display:flex;gap:3px;font-size:10.5px;color:#8e9ab0}
.nr span{text-align:center}
.liste{background:var(--karte);border:1px solid var(--rand);border-radius:16px;margin:0 16px 16px;overflow:hidden}
.z{display:flex;align-items:center;gap:12px;padding:10px 14px;min-height:64px;border-top:1px solid #26385a}
.z:first-child{border-top:none}
.z b{font-weight:600;font-size:15.5px;line-height:1.25;flex:1}
.z .zahl{font-size:14px;color:var(--leise);white-space:nowrap}
.z.fertig b{color:#c3c9d3;font-weight:400}
.auf{background:#16253d;padding:4px 16px 10px 70px;border-top:1px solid #26385a}
"""
    band = "".join(f'<span style="flex:{len(PUNKTE[k])}"><i style="width:{ERLEDIGT.get(k,0)/len(PUNKTE[k])*100:.0f}%"></i></span>' for k in range(13))
    nr = "".join(f'<span style="flex:{len(PUNKTE[k])}">{k}</span>' for k in range(13))
    summe = (f'<div class="sum"><div class="zeile" style="justify-content:space-between;align-items:flex-end">'
             f'<div><span class="serif" style="font-size:40px;line-height:1">{SUMME}</span> <span class="leise">von {GESAMT} Punkten</span></div>'
             f'<span class="gold" style="font-weight:700;font-size:14px;margin-bottom:6px">1 Kapitel fertig</span></div>'
             f'<div class="band">{band}</div><div class="nr">{nr}</div>'
             f'<div class="leise klein" style="margin-top:10px;display:flex;gap:6px;align-items:center">Hake ab, was du sicher kannst. {ic("frage", 16)}</div></div>')
    zeilen = []
    for k in range(13):
        n = len(PUNKTE[k]); e = ERLEDIGT.get(k, 0)
        if e == n:
            r = f'<span style="width:44px;height:44px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff1b8,#e3bf4a 45%,#a8841c);color:#16253d;display:flex;align-items:center;justify-content:center;flex:none">{ic("haken", 22, None, 3)}</span>'
            zahl = '<span class="zahl gold">fertig</span>'
        else:
            r = ring(e / n, 44, 4, grund="#3a4b68", innen=f'<b style="font-size:16px">{k}</b>')
            zahl = f'<span class="zahl">{e}/{n}</span>'
        pfeil = ic("runter" if k == OFFEN_KAP else "pfeil", 18, "#7d8aa0")
        if k == OFFEN_KAP:
            pfeil = f'<span style="transform:rotate(180deg);display:inline-flex">{ic("runter", 18, "#c3c9d3")}</span>'
        zeilen.append(f'<div class="z{" fertig" if e == n else ""}">{r}<b>{FRAGEN[k]}</b>{zahl}{pfeil}</div>')
        if k == OFFEN_KAP:
            zeilen.append(f'<div class="auf">{punktliste(k)}</div>')
    inhalt = f'{kopf_check()}{summe}<div class="liste">{"".join(zeilen)}</div>'
    schreibe("d1", seite("D1 Ringe und Band", inhalt, css))


# ---------------- D2: Siegel je Kapitel ----------------
def siegel(k, px=66):
    zacken = 28
    r1, r2 = px / 2 - 2, px / 2 - 6
    pts = []
    for i in range(zacken * 2):
        w = math.pi * i / zacken
        r = r1 if i % 2 == 0 else r2
        pts.append(f"{px/2 + r*math.cos(w):.1f},{px/2 + r*math.sin(w):.1f}")
    return (f'<svg width="{px}" height="{px}" viewBox="0 0 {px} {px}"><defs><radialGradient id="sg{k}" cx=".38" cy=".32" r=".8"><stop offset="0" stop-color="#fff1b8"/><stop offset=".45" stop-color="#e3bf4a"/><stop offset="1" stop-color="#9a7716"/></radialGradient></defs>'
            f'<polygon points="{" ".join(pts)}" fill="url(#sg{k})"/><circle cx="{px/2}" cy="{px/2}" r="{px/2-13}" fill="none" stroke="#7a5d10" stroke-width="1.5" stroke-dasharray="2 3"/>'
            f'<text x="{px/2}" y="{px/2+8}" text-anchor="middle" font-family="Source Serif 4" font-weight="600" font-size="23" fill="#3d2e06">{k}</text></svg>')


def d2():
    css = """
.teil{margin:20px 16px 8px;display:flex;justify-content:space-between;align-items:baseline}
.gitter{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:0 16px}
.sz{background:var(--karte);border:1px solid var(--rand);border-radius:16px;padding:12px 8px 10px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:5px;min-height:142px}
.sz .f{font-size:13px;line-height:1.25}
.sz .c{font-size:12.5px;color:var(--leise);margin-top:auto}
.sz.voll{border-color:rgba(227,191,74,.55);background:linear-gradient(180deg,rgba(227,191,74,.10),#1b2b45 60%)}
.leer{width:66px;height:66px;border-radius:50%;border:2px dashed #4b5d7c;display:flex;align-items:center;justify-content:center;font-family:'Source Serif 4',Georgia,serif;font-size:24px;color:#9aa6ba}
.vorhang{margin-top:18px;position:relative;background:rgba(5,10,20,.55);padding:26px 0 0}
.vorhang:before{content:'Tipp auf ein Siegel öffnet seine Punkte:';position:absolute;top:4px;left:16px;font-size:12.5px;color:#c3c9d3}
.blatt{background:#1d2f4d;border-radius:22px 22px 0 0;border-top:1px solid #3e5070;padding:10px 18px 18px;box-shadow:0 -10px 30px rgba(0,0,0,.45)}
"""
    zu = {}
    for name, key, kap in TEILE:
        zu[name] = kap
    kacheln = []
    for name, key, kap in TEILE:
        e_sum = sum(ERLEDIGT.get(k, 0) for k in kap); n_sum = sum(len(PUNKTE[k]) for k in kap)
        t = []
        for k in kap:
            n = len(PUNKTE[k]); e = ERLEDIGT.get(k, 0)
            if e == n:
                bild = siegel(k); cls = " voll"; c = '<span class="gold" style="font-weight:700">besiegelt</span>'
            elif e:
                bild = ring(e / n, 66, 6, grund="#33456a", innen=f'<span class="serif" style="font-size:24px">{k}</span>'); cls = ""; c = f'{e} von {n}'
            else:
                bild = f'<span class="leer">{k}</span>'; cls = ""; c = f'0 von {n}'
            t.append(f'<div class="sz{cls}">{bild}<span class="f">{FRAGEN[k]}</span><span class="c">{c}</span></div>')
        kacheln.append(f'<div class="teil"><h3>{name}</h3><span class="leise klein">{e_sum} von {n_sum}</span></div><div class="gitter">{"".join(t)}</div>')
    kopf = (kopf_check() + f'<div style="margin:6px 16px 0" class="leise">Für jedes Kapitel ein Siegel. Es glänzt, wenn alle Punkte sitzen.</div>'
            f'<div class="zeile" style="margin:12px 16px 0;gap:10px"><span class="serif" style="font-size:30px">{SUMME}</span><span class="leise">von {GESAMT} Punkten · 1 von 13 Siegeln</span></div>')
    blatt = (f'<div class="vorhang"><div class="blatt"><div style="width:44px;height:5px;border-radius:3px;background:#56688a;margin:0 auto 12px"></div>'
             f'<div class="zeile" style="gap:14px">{ring(4/6, 52, 5, grund="#33456a", innen="<span class=serif style=font-size:20px>1</span>")}<div><div class="leise klein">Kapitel 1 · 4 von 6</div><h2 style="font-size:20px">Was passiert jetzt?</h2></div></div>'
             f'<div style="margin-top:8px">{punktliste(1)}</div>'
             f'<div class="leise klein" style="margin-top:8px">Noch 2 Punkte bis zum Siegel.</div></div></div>')
    inhalt = f'{kopf}{"".join(kacheln)}' + blatt
    schreibe("d2", seite("D2 Siegel", inhalt, css))


# ---------------- D3: Nach Buchteil, mit Punktreihe ----------------
def d3():
    css = """
.umschalter{display:flex;margin:12px 16px 4px;background:#16253d;border:1px solid var(--rand);border-radius:12px;padding:3px}
.umschalter span{flex:1;min-height:42px;display:flex;align-items:center;justify-content:center;border-radius:9px;font-weight:600;color:var(--leise)}
.umschalter span.an{background:var(--karte);color:var(--text);box-shadow:0 0 0 1px #3e5070}
.tk{margin:18px 16px 8px}
.tk .o{display:flex;justify-content:space-between;align-items:baseline}
.tk .b{height:4px;border-radius:2px;background:#2c3d5a;margin-top:6px;overflow:hidden} .tk .b i{display:block;height:100%;background:var(--gold)}
.kk{background:var(--karte);border:1px solid var(--rand);border-radius:14px;margin:0 16px 8px;padding:10px 12px;display:flex;gap:12px;align-items:flex-start}
.kk .nr{font-family:'Source Serif 4',Georgia,serif;font-size:26px;width:32px;text-align:center;line-height:1.1;color:#9aa6ba;flex:none}
.kk.fertig .nr{color:var(--gold)}
.kk .q{font-family:'Source Serif 4',Georgia,serif;font-size:16.5px;line-height:1.25}
.kk .w{font-size:12.5px;color:var(--leise);margin-top:3px}
.dots{display:flex;gap:4px;margin-top:7px} .dots i{width:9px;height:9px;border-radius:50%;background:#2c3d5a} .dots i.v{background:var(--gold)}
"""
    def kurz(w):
        w = w.split(";")[0].split(" (")[0]
        return w if len(w) < 44 else w[:42].rsplit(" ", 1)[0] + " …"
    teile = []
    for nr, (name, key, kap) in enumerate(TEILE, 1):
        e_sum = sum(ERLEDIGT.get(k, 0) for k in kap); n_sum = sum(len(PUNKTE[k]) for k in kap)
        if nr >= 4:
            teile.append(f'<div class="kk" style="align-items:center;min-height:56px;margin-top:10px"><span style="flex:1"><span class="gold" style="font-size:11.5px;letter-spacing:.14em;font-weight:700">TEIL {nr}</span> '
                         f'<h3 style="display:inline;margin-left:4px">{name}</h3><div class="leise klein">Kapitel {kap[0]}–{kap[-1]} · {e_sum} von {n_sum}</div></span>{ic("runter", 20, "#c3c9d3")}</div>')
            continue
        t = [f'<div class="tk"><div class="o"><span><span class="gold" style="font-size:11.5px;letter-spacing:.14em;font-weight:700">TEIL {nr}</span> <h3 style="display:inline;margin-left:4px">{name}</h3></span>'
             f'<span class="leise klein">{e_sum} von {n_sum}</span></div><div class="b"><i style="width:{e_sum/n_sum*100:.0f}%"></i></div></div>']
        for k in kap:
            n = len(PUNKTE[k]); e = ERLEDIGT.get(k, 0)
            dots = '<div class="dots">' + "".join(f'<i class="{"v" if j < e else ""}"></i>' for j in range(n)) + '</div>'
            auf = k == OFFEN_KAP
            pf = f'<span style="{"transform:rotate(180deg);" if auf else ""}display:inline-flex;margin-top:4px">{ic("runter", 20, "#c3c9d3")}</span>'
            extra = f'<div style="margin-top:6px;border-top:1px solid #2c3d5a;padding-top:2px">{punktliste(k)}</div>' if auf else ""
            t.append(f'<div class="kk{" fertig" if e == n else ""}"><span class="nr">{k}</span><div style="flex:1;min-width:0"><div class="q">„{FRAGEN[k]}“</div>'
                     f'<div class="w">Werkzeug: {kurz(WERKZEUG[k])}</div>{dots}{extra}</div>{pf}</div>')
        teile.append("".join(t))
    kopf = (kopf_check() + '<div class="umschalter"><span class="an">Alle</span><span>Offen</span><span>Fertig</span></div>'
            f'<div class="leise klein" style="margin:8px 16px 0">{SUMME} von {GESAMT} Punkten abgehakt. Die Haken bleiben auf diesem Gerät.</div>')
    inhalt = kopf + "".join(teile) + '<div style="height:12px"></div>'
    schreibe("d3", seite("D3 Nach Buchteil", inhalt, css))


if __name__ == "__main__":
    d1(); d2(); d3()
