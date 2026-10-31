"""I: Nachschlagen › Glossar (255 Begriffe aus dem Anhang des Buches)."""
import re
from bausteine3 import *

G = json.load(open(DATEN + "glossar.json"))["eintraege"]
E = {e["begriff"]: e for e in G}


def text(b, kurz=False):
    t = "".join(x["text"] for x in E[b]["text"]).replace("→ ", "")
    if kurz:
        t = re.sub(r"\s*\((Kapitel|Kap\.)[^)]*\)\.?$", "", t).rstrip(".") + "."
    return t


def kapitel(b):
    return sorted({s["kapitel"] for s in E[b]["stellen"]})


def kopf():
    return unterseitenkopf("Nachschlagen", "Glossar")


def suchfeld(platzhalter="Begriff suchen, z. B. Gabel"):
    return (f'<div style="margin:8px 16px 0;display:flex;align-items:center;gap:10px;height:50px;border-radius:14px;background:#16253d;border:1.5px solid #4b5d7c;padding:0 14px;color:#8e9ab0">'
            f'{ic("lupe", 20)}<span style="font-size:16px">{platzhalter}</span></div>')


def kaptags(b):
    return "".join(f'<span style="font-size:11.5px;border:1px solid #4b5d7c;border-radius:6px;padding:0 5px;color:var(--leise)">{k}</span>' for k in kapitel(b))


# ---------------- I1: Suche, Leiste, Vorschau ----------------
def i1():
    css = """
.rail{position:absolute;right:2px;top:150px;width:30px;display:flex;flex-direction:column;align-items:center;font-size:11.5px;font-weight:700;color:var(--gold);gap:1.5px;z-index:3}
.rail span{height:19px;display:flex;align-items:center}
.rail span.an{background:var(--gold);color:#16253d;border-radius:6px;width:22px;justify-content:center}
.buch{margin:16px 38px 6px 16px;font-family:'Source Serif 4',Georgia,serif;font-size:22px;color:var(--gold)}
.liste{background:var(--karte);border:1px solid var(--rand);border-radius:14px;margin:0 38px 0 16px;overflow:hidden}
.e{padding:10px 12px;border-top:1px solid #26385a;min-height:60px}
.e:first-child{border-top:none}
.e .k{display:flex;justify-content:space-between;align-items:center;gap:8px}
.e b{font-size:16px;font-weight:600}
.e p{margin:3px 0 0;font-size:13.5px;color:var(--leise);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;line-height:1.3}
.e.auf{background:#16253d}
.e.auf p{display:block;color:var(--text);font-size:15px;-webkit-line-clamp:unset}
"""
    rail = '<div class="rail">' + "".join(f'<span class="{"an" if l == "F" else ""}">{l}</span>' for l in "#ABCDEFGHIKLMNOPQRSTUVWZ") + '</div>'
    def eintrag(b, auf=False):
        if not auf:
            return f'<div class="e"><div class="k"><b>{b}</b><span style="display:flex;gap:3px">{kaptags(b)}</span></div><p>{text(b, True)}</p></div>'
        abb = [s["abbildung"] for s in E[b]["stellen"] if s["abbildung"]][0]
        stellen = "".join(f'<span class="chip" style="min-height:38px;font-size:13.5px;padding:0 10px">Abschnitt {s["abschnitt"]}</span>' for s in E[b]["stellen"])
        return (f'<div class="e auf"><div class="k"><b style="font-size:18px">{b}</b><span style="transform:rotate(180deg);display:inline-flex">{ic("runter", 18, "#c3c9d3")}</span></div>'
                f'<div style="display:flex;gap:12px;margin-top:8px">{abbbrett(abb, 104)}<p style="margin:0">{text(b, True)}</p></div>'
                f'<div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:10px">{stellen}</div></div>')
    f = ["Faktorenbilanz", "Falle", "Farbkomplex", "Fesselung", "Festung", "Fianchetto", "Figurenwerte", "Fixieren", "Freibauer"]
    g = ["Gabel", "Gambit", "Gefangene Figur"]
    liste_f = "".join(eintrag(b, b == "Fesselung") for b in f)
    liste_g = "".join(eintrag(b) for b in g)
    inhalt = (kopf() + suchfeld() + '<div class="leise klein" style="margin:8px 16px 0">255 Begriffe · die Kästchen nennen die Kapitel</div>' + rail
              + f'<div class="buch">F</div><div class="liste">{liste_f}</div><div class="buch">G</div><div class="liste">{liste_g}</div><div style="height:16px"></div>')
    schreibe("i1", seite("I1 Suche und Leiste", inhalt, css))


# ---------------- I2: Stöbern nach Buchteil ----------------
def i2():
    css = """
.zuletzt{display:flex;gap:8px;margin:10px 16px 0;overflow:hidden}
.zuletzt span{white-space:nowrap;min-height:38px;display:inline-flex;align-items:center;padding:0 12px;border-radius:99px;background:#1b2b45;border:1px solid var(--rand);font-size:14px}
.tag{background:linear-gradient(150deg,#26395c,#1b2b45 70%);border:1px solid #3a4f74;border-radius:18px;margin:14px 16px 0;padding:14px;display:flex;gap:14px}
.teil{margin:20px 16px 0}
.teil .kz{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px}
.wolke{display:flex;flex-wrap:wrap;gap:6px}
.wolke span{min-height:38px;display:inline-flex;align-items:center;padding:0 12px;border-radius:10px;background:var(--karte);border:1px solid var(--rand);font-size:14.5px}
.wolke span.mehr{background:transparent;border-style:dashed;color:var(--gold)}
"""
    teile = []
    for name, key, kap in TEILE:
        begriffe = [e["begriff"] for e in G if e["stellen"] and e["stellen"][0]["kapitel"] in kap]
        teile.append((name, kap, begriffe))
    zuletzt = '<div class="leise klein" style="margin:14px 16px 0">Zuletzt nachgeschlagen</div><div class="zuletzt">' + "".join(f'<span>{b}</span>' for b in ["Opposition", "Fesselung", "Luftloch", "Vorposten", "Zugzwang"]) + '</div>'
    tag = (f'<div class="tag">{abbbrett("1.21", 112)}<div style="flex:1;min-width:0"><div class="leise" style="font-size:12px;letter-spacing:.1em;font-weight:700">BEGRIFF DES TAGES</div>'
           f'<div class="serif" style="font-size:24px;margin:2px 0 4px">Gabel</div><div style="font-size:14px">{text("Gabel", True)}</div>'
           f'<div class="leise klein" style="margin-top:6px">Abb. 1.21 · Kapitel 1 und 7</div></div></div>')
    blocks = []
    for name, kap, begriffe in teile:
        zeigen = begriffe[:9]
        wolke = "".join(f'<span>{b}</span>' for b in zeigen) + f'<span class="mehr">alle {len(begriffe)} ›</span>'
        blocks.append(f'<div class="teil"><div class="kz"><h3>{name}</h3><span class="leise klein">Kapitel {kap[0]}–{kap[-1]} · {len(begriffe)} Begriffe</span></div><div class="wolke">{wolke}</div></div>')
    abc = (f'<div class="zeile" style="margin:22px 16px 16px;min-height:52px;border:1.5px solid #3e5070;border-radius:14px;padding:0 14px;gap:10px">{ic("liste", 20, "#c3c9d3")}'
           f'<b style="flex:1">Alle 255 von A bis Z</b>{ic("pfeil", 18, "#7d8aa0")}</div>')
    schreibe("i2", seite("I2 Stöbern", kopf() + suchfeld() + zuletzt + tag + "".join(blocks) + abc, css))


# ---------------- I3: Lexikonseite ----------------
def i3():
    css = """
.reiter{display:flex;gap:2px;margin:10px 0 0;padding:0 12px;overflow:hidden;border-bottom:1px solid #2c3d5a}
.reiter span{min-width:30px;height:44px;display:flex;align-items:center;justify-content:center;font-family:'Source Serif 4',Georgia,serif;font-size:17px;color:var(--leise)}
.reiter span.an{color:var(--gold);border-bottom:3px solid var(--gold)}
.seite{margin:0 16px;padding:10px 0}
.leitw{display:flex;justify-content:space-between;font-family:'Source Serif 4',Georgia,serif;font-size:13px;color:var(--leise);letter-spacing:.04em;border-bottom:1px solid #2c3d5a;padding-bottom:6px}
.initiale{font-family:'Source Serif 4',Georgia,serif;font-size:64px;line-height:1;color:var(--gold);margin:10px 0 2px}
.eintrag{font-size:15.5px;line-height:1.45;padding:9px 0;border-bottom:1px solid #22344f}
.eintrag b{font-family:'Source Serif 4',Georgia,serif;font-size:17.5px;font-weight:600}
.eintrag .ref{font-size:12px;letter-spacing:.08em;color:var(--gold);font-weight:700;margin-left:4px;white-space:nowrap}
.figur{float:right;margin:4px 0 6px 12px;text-align:center}
.figur small{display:block;font-size:11.5px;color:var(--leise);margin-top:3px}
"""
    reiter = '<div class="reiter">' + "".join(f'<span class="{"an" if l == "F" else ""}">{l}</span>' for l in "ABCDEFGHIKLM") + '</div>'
    def eintrag(b, bild=None):
        refs = "KAP. " + ", ".join(str(k) for k in kapitel(b))
        fig = (f'<span class="figur">{abbbrett(bild, 118)}<small>Abb. {bild}</small></span>' if bild else "")
        return f'<div class="eintrag">{fig}<b>{b}.</b> {text(b, True)} <span class="ref">{refs}</span><div style="clear:both"></div></div>'
    seite_html = ('<div class="seite"><div class="leitw"><span>Falle</span><span>F · 18 Begriffe</span><span>Freibauer</span></div><div class="initiale">F</div>'
                  + eintrag("Falle") + eintrag("Farbkomplex") + eintrag("Fesselung", "1.12") + eintrag("Festung") + eintrag("Fianchetto")
                  + eintrag("Figurenwerte") + eintrag("Fixieren") + eintrag("Freibauer", "5.29") + '</div>')
    suche = (f'<div style="position:absolute;right:16px;top:14px;width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;color:var(--text)">{ic("lupe", 22)}</div>')
    schreibe("i3", seite("I3 Lexikonseite", kopf() + suche + reiter + seite_html, css))


if __name__ == "__main__":
    i1(); i2(); i3()
