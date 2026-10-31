"""Baut drei Entwürfe für die Darstellung von Orden und Abzeichen im Profil (Handybreite)."""
import json
S = json.load(open("../stuecke.json"))
de = json.load(open("/home/user/wt-k/app/src/i18n/de.json"))
NAMEN = {"abbildungen": "Abbildungen", "uebungen": "Übungen", "lernziele": "Lernziele", "trainer": "Trainer",
         "teil-grundlagen": "Grundlagen", "teil-eroeffnung": "Eröffnung", "teil-mittelspiel": "Mittelspiel",
         "teil-endspiel": "Endspiel", "teil-praxis": "Praxis", "engine": "Engine besiegt"}
def oname(k):
    if k in NAMEN: return NAMEN[k]
    _, a, b, art = k.split("-")
    return f"Stufe {a}–{b} " + ("einmal" if art == "einmal" else "alle")
def aname(k): return de.get(f"abzeichen.name.{k}", k)
def bild(art, k, still=False, px=72, glanz=False):
    svg = S[f"{art}{'-s' if still else ''}:{k}"]
    cls = "stueck" + (" still" if still else "") + (" glanz" if glanz else "")
    return f'<span class="{cls}" style="width:{px}px;height:{px}px">{svg}</span>'
# Ein angenommener Stand eines fortgeschrittenen Lesers (wie in den Bildschirmfotos des Autors).
ORDEN_VERDIENT = ["abbildungen", "uebungen", "lernziele", "trainer", "teil-grundlagen", "teil-eroeffnung",
                  "teil-mittelspiel", "teil-endspiel", "teil-praxis", "bots-1-3-einmal", "bots-1-3-alle",
                  "bots-4-5-einmal", "bots-4-5-alle", "bots-6-7-einmal"]
ORDEN_OFFEN = {"bots-6-7-alle": (19, 24), "bots-8-9-einmal": (5, 8), "bots-8-9-alle": (7, 24), "engine": (0, 1)}
AB_VERDIENT = ["erstePartie", "ersterSieg", "partien10", "erstesMatt", "siegOhneHilfe", "ersteUebung",
               "kapitelUebungen", "warum", "eingeschaetzt", "sammlung", "fehler", "trainer", "woche"]
AB_OFFEN = {"partien50": (41, 50), "wochenziel4": (3, 4), "brillant": (0, 1), "siegGegenStaerkeren": (0, 1),
            "remisGegenStaerkeren": (0, 1), "partien100": (41, 100), "wochenziel12": (3, 12), "dreiRekorde": (2, 3)}

CSS = """
*{box-sizing:border-box} body{margin:0;background:#0f1b2e;color:#f5f0e6;font-family:'Source Sans 3',system-ui,sans-serif;width:390px}
h1{font-family:'Source Serif 4',Georgia,serif;font-size:22px;margin:0 0 4px} h2{font-family:'Source Serif 4',Georgia,serif;font-size:19px;margin:0}
.kopf{padding:14px 16px 6px;display:flex;justify-content:space-between;align-items:baseline}
.leise{color:#c3c9d3;font-size:14px} .gold{color:#e3bf4a}
.karte{background:#1b2b45;border-radius:14px;margin:10px 12px;padding:14px;border:1px solid #2c3d5a}
.stueck{display:inline-block;flex:none} .stueck svg{width:100%;height:100%;display:block}
.stueck.still{opacity:.35;filter:grayscale(1)}
.glanz{filter:drop-shadow(0 0 14px rgba(227,191,74,.55))}
.chip{display:inline-block;font-size:12px;padding:2px 8px;border-radius:99px;background:#2c3d5a;color:#f5f0e6}
.leiste{position:sticky;bottom:0;height:56px;background:#0b1424;border-top:1px solid #2c3d5a;display:flex;justify-content:space-around;align-items:center;font-size:12px;color:#c3c9d3}
.leiste b{color:#f5f0e6}
.balken{height:6px;border-radius:3px;background:#2c3d5a;overflow:hidden;margin-top:6px}
.balken i{display:block;height:100%;background:linear-gradient(90deg,#c9a227,#f2d27a)}
"""
LEISTE = ""

def seite(titel, inhalt, extra_css=""):
    return f'<!doctype html><html lang="de"><head><meta charset="utf-8"><title>{titel}</title><style>{CSS}{extra_css}</style></head><body>{inhalt}{LEISTE}</body></html>'

# ---------- Variante A: Vitrine ----------
def vitrine():
    css = """
    .regal{background:linear-gradient(180deg,#22365a 0%,#1b2b45 70%);border-radius:14px;margin:10px 12px;padding:16px 12px 6px;border:1px solid #3a4f73;box-shadow:inset 0 1px 0 rgba(255,255,255,.08)}
    .boden{display:flex;justify-content:space-around;align-items:flex-end;padding:0 4px 10px;position:relative}
    .boden:after{content:'';position:absolute;left:-4px;right:-4px;bottom:0;height:9px;border-radius:3px;background:linear-gradient(180deg,#c9a227,#7d6007);box-shadow:0 6px 12px rgba(0,0,0,.45)}
    .platz{display:flex;flex-direction:column;align-items:center;width:110px}
    .platz small{font-size:12px;color:#c3c9d3;margin:4px 0 8px;text-align:center;line-height:1.2;height:2.4em}
    .spiegel{transform:scaleY(-1);opacity:.12;height:16px;overflow:hidden;margin-top:-2px;-webkit-mask-image:linear-gradient(transparent,#000)}
    .gitter{display:grid;grid-template-columns:repeat(6,1fr);gap:8px;justify-items:center;margin-top:10px}
    .sheet{margin:10px 12px;background:#f5f0e6;color:#16253d;border-radius:18px 18px 0 0;padding:14px 16px;display:flex;gap:14px;align-items:center;box-shadow:0 -8px 24px rgba(0,0,0,.4)}
    .sheet b{font-family:'Source Serif 4',Georgia,serif;font-size:18px}
    .knopf{display:inline-block;margin-top:6px;font-size:13px;padding:4px 10px;border-radius:99px;border:1px solid #16253d}
    """
    reihe1 = [("orden", "teil-endspiel", "Teil Endspiel"), ("abzeichen", "erstesMatt", "Erstes Matt"), ("orden", "bots-4-5-alle", "Stufe 4–5 alle")]
    reihe2 = [("orden", "trainer", "Trainer"), ("abzeichen", "woche", "Eine Woche dabei"), ("orden", "uebungen", "Übungen")]
    def boden(r):
        return '<div class="boden">' + "".join(f'<div class="platz">{bild(a,k,px=84,glanz=True)}<small>{n}</small></div>' for a, k, n in r) + "</div>"
    alle = [("orden", k, False) for k in ORDEN_VERDIENT] + [("abzeichen", k, False) for k in AB_VERDIENT] + \
           [("orden", k, True) for k in ORDEN_OFFEN] + [("abzeichen", k, True) for k in AB_OFFEN]
    gitter = "".join(bild(a, k, still, px=46) for a, k, still in alle)
    inhalt = f"""
    <div class="kopf"><h1>Deine Vitrine</h1><span class="leise gold">Auswählen</span></div>
    <div class="leise" style="padding:0 16px">Sechs Lieblingsstücke, die du selbst aussuchst.</div>
    <div class="regal">{boden(reihe1)}<div style="height:14px"></div>{boden(reihe2)}</div>
    <div class="karte"><div style="display:flex;justify-content:space-between"><h2>Sammlung</h2><span class="chip">27 von 39</span></div>
      <div class="leise" style="margin-top:2px">Grau: noch offen. Tippen zeigt die Bedingung.</div>
      <div class="gitter">{gitter}</div></div>
    <div class="sheet">{bild('orden','teil-endspiel',px=76,glanz=True)}<div><b>Teil Endspiel</b><div style="font-size:13px">Alle 178 Inhalte des Buchteils · verdient am 30.10.2026</div><span class="knopf">In die Vitrine</span> <span class="knopf">Teilen</span></div></div>
    """
    return seite("Variante A: Vitrine", inhalt, css)

# ---------- Variante B: Album mit Fortschritt ----------
def album():
    css = """
    .zeile{display:flex;gap:12px;align-items:center;padding:10px 0;border-top:1px solid #2c3d5a}
    .zeile:first-of-type{border-top:0}
    .zeile .text{flex:1;min-width:0} .zeile b{font-size:16px} .zeile .klein{font-size:13px;color:#c3c9d3}
    .haken{color:#e3bf4a;font-size:13px}
    .reiter{display:flex;gap:6px;padding:4px 12px 0}
    .reiter span{font-size:13px;padding:5px 10px;border-radius:99px;background:#1b2b45;border:1px solid #2c3d5a}
    .reiter .an{background:#e3bf4a;color:#16253d;border-color:#e3bf4a;font-weight:600}
    """
    def zeile(art, k, name, text, stand=None, datum=None):
        still = stand is not None
        rechts = ""
        if stand:
            a, b = stand
            rechts = f'<div class="balken"><i style="width:{100*a/b:.0f}%"></i></div><div class="klein" style="margin-top:3px">{a} von {b}</div>'
        else:
            rechts = f'<div class="haken">✓ verdient am {datum}</div>'
        return f'<div class="zeile">{bild(art,k,still,px=58)}<div class="text"><b>{name}</b><div class="klein">{text}</div>{rechts}</div></div>'
    fast = "".join([
        zeile("orden", "bots-6-7-alle", "Stufe 6–7 alle", "Jeden Bot der Stufe 6–7 in jeder Zeitart besiegt", (19, 24)),
        zeile("abzeichen", "partien50", aname("partien50"), de["abzeichen.bedingung.partien50"], (41, 50)),
        zeile("abzeichen", "wochenziel4", aname("wochenziel4"), "In vier Wochen dein Wochenziel erreicht", (3, 4)),
    ])
    verdient = "".join([
        zeile("orden", "teil-endspiel", "Teil Endspiel", "Alle Inhalte des Buchteils Endspiel", None, "30.10."),
        zeile("abzeichen", "erstesMatt", aname("erstesMatt"), de["abzeichen.bedingung.erstesMatt"], None, "29.10."),
        zeile("abzeichen", "woche", aname("woche"), "Sieben Tage hintereinander gelernt", None, "28.10."),
        zeile("orden", "bots-4-5-alle", "Stufe 4–5 alle", "Jeden Bot der Stufe 4–5 in jeder Zeitart", None, "27.10."),
    ])
    inhalt = f"""
    <div class="kopf"><h1>Orden und Abzeichen</h1><span class="chip">27 von 39</span></div>
    <div class="reiter"><span class="an">Alle</span><span>Buch</span><span>Training</span><span>Spielen</span><span>Dabei</span></div>
    <div class="karte"><h2>Fast geschafft</h2><div class="leise">Sortiert nach dem, was am wenigsten fehlt.</div>{fast}</div>
    <div class="karte"><h2>Zuletzt verdient</h2>{verdient}</div>
    """
    return seite("Variante B: Album", inhalt, css)

# ---------- Variante C: Glanzstück und Regale ----------
def regale():
    css = """
    .held{margin:10px 12px;border-radius:18px;padding:18px 14px;text-align:center;background:radial-gradient(circle at 50% 38%,rgba(227,191,74,.35),rgba(27,43,69,0) 55%),linear-gradient(180deg,#22365a,#1b2b45);border:1px solid #3a4f73}
    .held .stueck{margin:4px auto 6px}
    .strahlen{position:relative}
    .reihe{display:flex;gap:14px;overflow:hidden;margin-top:10px;padding-bottom:4px}
    .reihe .eintrag{display:flex;flex-direction:column;align-items:center;width:78px;flex:none}
    .reihe small{font-size:12px;color:#c3c9d3;text-align:center;margin-top:4px;line-height:1.2}
    .ring{position:relative;width:70px;height:70px;flex:none}
    .ring svg.r{position:absolute;inset:0}
    .ring .stueck{position:absolute;left:9px;top:9px}
    .titelzeile{display:flex;justify-content:space-between;align-items:baseline}
    """
    def ringstueck(art, k, a, b):
        u = 2 * 3.14159 * 32
        anteil = a / b
        r = f'<svg class="r" viewBox="0 0 70 70"><circle cx="35" cy="35" r="32" fill="none" stroke="#2c3d5a" stroke-width="4"/><circle cx="35" cy="35" r="32" fill="none" stroke="#e3bf4a" stroke-width="4" stroke-linecap="round" stroke-dasharray="{u*anteil:.1f} {u:.1f}" transform="rotate(-90 35 35)"/></svg>'
        return f'<div class="ring">{r}{bild(art,k,True,px=52)}</div>'
    naechste = [("orden", "bots-6-7-alle", 19, 24, "Stufe 6–7 alle"), ("abzeichen", "partien50", 41, 50, "Fünfzig Partien"),
                ("abzeichen", "wochenziel4", 3, 4, "Vier gute Wochen"), ("abzeichen", "dreiRekorde", 2, 3, "Drei Rekorde")]
    nae = "".join(f'<div class="eintrag">{ringstueck(a,k,x,y)}<small>{n}<br>{x} von {y}</small></div>' for a, k, x, y, n in naechste)
    def regal(titel, zahl, stuecke):
        eintr = "".join(f'<div class="eintrag">{bild(a,k,s,px=64)}<small>{n}</small></div>' for a, k, s, n in stuecke)
        return f'<div class="karte"><div class="titelzeile"><h2>{titel}</h2><span class="chip">{zahl}</span></div><div class="reihe">{eintr}</div></div>'
    teile = [("orden", k, False, NAMEN[k]) for k in ["teil-grundlagen", "teil-eroeffnung", "teil-mittelspiel", "teil-endspiel", "teil-praxis"]]
    bots = [("orden", k, k in ORDEN_OFFEN, oname(k)) for k in ["bots-1-3-einmal", "bots-1-3-alle", "bots-4-5-einmal", "bots-4-5-alle", "bots-6-7-alle"]]
    abz = [("abzeichen", k, False, aname(k)) for k in ["erstesMatt", "woche", "trainer", "siegOhneHilfe", "fehler"]]
    inhalt = f"""
    <div class="kopf"><h1>Deine Erfolge</h1><span class="chip">27 von 39</span></div>
    <div class="held"><div class="leise">Zuletzt verdient · 30.10.2026</div>{bild('orden','teil-endspiel',px=128,glanz=True)}
      <h2>Teil Endspiel</h2><div class="leise">Alle 178 Inhalte des Buchteils</div><div style="margin-top:8px"><span class="chip">Teilen</span></div></div>
    <div class="karte"><div class="titelzeile"><h2>Als Nächstes</h2><span class="leise">Fast geschafft</span></div><div class="reihe">{nae}</div></div>
    {regal("Teile des Buches", "5 von 5", teile)}
    {regal("Bots besiegt", "5 von 9", bots)}
    {regal("Abzeichen", "13 von 21", abz)}
    """
    return seite("Variante C: Glanzstück", inhalt, css)

for name, f in [("a-vitrine", vitrine), ("b-album", album), ("c-glanzstueck", regale)]:
    open(f"{name}.html", "w").write(f())
print("ok")
