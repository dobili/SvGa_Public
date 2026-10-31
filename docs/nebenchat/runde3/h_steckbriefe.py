"""H: Nachschlagen › Steckbriefe (13 Eröffnungen aus Kapitel 2, 14 Fallenchecks aus Kapitel 4)."""
from bausteine3 import *

K2 = json.load(open(DATEN + "kap02.json"))
K4 = json.load(open(DATEN + "kap04.json"))
SB = {s["name"]: (s["abschnitt"], {z["frage"]: "".join(a["text"] for a in z["antwort"]) for z in s["zeilen"]}) for s in K2["steckbriefe"]}
FALLEN = [f["name"] for f in K4["fallenchecks"]]
FEN = {
    "Spanische Partie": "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R",
    "Italienische Partie": "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R",
    "Schottische Partie": "r1bqkbnr/pppp1ppp/2n5/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R",
    "Russische Verteidigung (Petroff)": "rnbqkb1r/pppp1ppp/5n2/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R",
    "Sizilianische Verteidigung": "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR",
    "Damengambit": "rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR",
    "London-System": "rnbqkbnr/ppp1pppp/8/3p4/3P1B2/8/PPP1PPPP/RN1QKBNR",
    "Trompowsky-Eröffnung": "rnbqkb1r/pppppppp/5n2/6B1/3P4/8/PPP1PPPP/RN1QKBNR",
    "Französische Verteidigung": "rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR",
    "Caro-Kann-Verteidigung": "rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR",
    "Königsindische Verteidigung": "rnbqkb1r/pppppp1p/5np1/8/2PP4/8/PP2PPPP/RNBQKBNR",
    "Zweispringerspiel und Läuferspiel": "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R",
    "Nimzo-Indische Verteidigung": "rnbqk2r/pppp1ppp/4pn2/8/1bPP4/2N5/PP2PPPP/R1BQKBNR",
}
ZUEGE = {
    "Spanische Partie": "1. e4 e5 2. Sf3 Sc6 3. Lb5", "Italienische Partie": "1. e4 e5 2. Sf3 Sc6 3. Lc4",
    "Schottische Partie": "1. e4 e5 2. Sf3 Sc6 3. d4", "Russische Verteidigung (Petroff)": "1. e4 e5 2. Sf3 Sf6",
    "Sizilianische Verteidigung": "1. e4 c5", "Damengambit": "1. d4 d5 2. c4", "London-System": "1. d4 d5 2. Lf4",
    "Trompowsky-Eröffnung": "1. d4 Sf6 2. Lg5", "Französische Verteidigung": "1. e4 e6", "Caro-Kann-Verteidigung": "1. e4 c6",
    "Königsindische Verteidigung": "1. d4 Sf6 2. c4 g6", "Zweispringerspiel und Läuferspiel": "1. e4 e5 2. Sf3 Sc6 3. Lc4 Sf6",
    "Nimzo-Indische Verteidigung": "1. d4 Sf6 2. c4 e6 3. Sc3 Lb4"}
CHARAKTER = {
    "Spanische Partie": "strategisch", "Italienische Partie": "offen, direkt", "Schottische Partie": "offenes Zentrum",
    "Russische Verteidigung (Petroff)": "sehr solide", "Sizilianische Verteidigung": "kampfbetont", "Damengambit": "strategisch",
    "London-System": "ruhig", "Trompowsky-Eröffnung": "aktiv", "Französische Verteidigung": "geschlossen",
    "Caro-Kann-Verteidigung": "solide", "Königsindische Verteidigung": "scharf", "Zweispringerspiel und Läuferspiel": "taktisch",
    "Nimzo-Indische Verteidigung": "strategisch"}
WEISS = ["Spanische Partie", "Italienische Partie", "Schottische Partie", "Damengambit", "London-System", "Trompowsky-Eröffnung"]
SCHWARZ = ["Russische Verteidigung (Petroff)", "Sizilianische Verteidigung", "Französische Verteidigung", "Caro-Kann-Verteidigung",
           "Königsindische Verteidigung", "Nimzo-Indische Verteidigung", "Zweispringerspiel und Läuferspiel"]


def theorie(name):
    t = SB[name][1]["Theorieaufwand"].lower()
    if t.startswith("hoch"):
        return 3
    if t.startswith("mittel bis hoch"):
        return 2.5
    if t.startswith("mittel"):
        return 2
    if t.startswith("niedrig bis mittel"):
        return 1.5
    return 1


def theoriepunkte(name, px=9):
    w = theorie(name)
    out = []
    for i in range(3):
        if w >= i + 1:
            f = "#e3bf4a"
        elif w > i:
            f = "linear-gradient(90deg,#e3bf4a 50%,#33456a 50%)"
        else:
            f = "#33456a"
        out.append(f'<i style="display:inline-block;width:{px}px;height:{px}px;border-radius:50%;background:{f}"></i>')
    return f'<span style="display:inline-flex;gap:3px;align-items:center">{"".join(out)}</span>'


def seitenpunkt(weiss):
    return (f'<span style="width:14px;height:14px;border-radius:50%;background:{"#f5f0e6" if weiss else "#16253d"};border:1.5px solid #c3c9d3;display:inline-block;flex:none"></span>')


def kurzname(n):
    return {"Russische Verteidigung (Petroff)": "Russisch (Petroff)", "Sizilianische Verteidigung": "Sizilianisch",
            "Französische Verteidigung": "Französisch", "Caro-Kann-Verteidigung": "Caro-Kann",
            "Königsindische Verteidigung": "Königsindisch", "Nimzo-Indische Verteidigung": "Nimzo-Indisch",
            "Zweispringerspiel und Läuferspiel": "Zweispringerspiel"}.get(n, n)


def kopf():
    return unterseitenkopf("Nachschlagen", "Steckbriefe")


def umschalter(links, rechts):
    return ('<div style="display:flex;margin:8px 16px 0;background:#16253d;border:1px solid var(--rand);border-radius:12px;padding:3px">'
            f'<span style="flex:1;min-height:42px;display:flex;align-items:center;justify-content:center;border-radius:9px;background:var(--karte);font-weight:600;box-shadow:0 0 0 1px #3e5070">{links}</span>'
            f'<span style="flex:1;min-height:42px;display:flex;align-items:center;justify-content:center;color:var(--leise);font-weight:600">{rechts}</span></div>')


# ---------------- H1: Liste mit Brett ----------------
def h1():
    css = """
.gr{margin:18px 16px 8px;display:flex;align-items:center;gap:8px}
.liste{background:var(--karte);border:1px solid var(--rand);border-radius:16px;margin:0 16px;overflow:hidden}
.zl{display:flex;gap:12px;align-items:center;padding:10px 12px;border-top:1px solid #26385a;min-height:76px}
.zl:first-child{border-top:none}
.zl b{font-size:16px;font-weight:600;display:block}
.zl .z{font-size:13px;color:var(--gold);margin-top:2px}
.zl .m{font-size:12.5px;color:var(--leise);margin-top:3px;display:flex;gap:8px;align-items:center}
.auf{padding:4px 14px 14px 14px;background:#16253d;border-top:1px solid #26385a}
.auf dt{font-size:12px;letter-spacing:.06em;color:var(--leise);font-weight:700;margin-top:10px;text-transform:uppercase}
.auf dd{margin:2px 0 0;font-size:15px}
"""
    def zeile(n, offen=False):
        pf = ic("runter", 18, "#c3c9d3") if not offen else f'<span style="transform:rotate(180deg);display:inline-flex">{ic("runter", 18, "#c3c9d3")}</span>'
        z = (f'<div class="zl">{fenbrett(FEN[n], 60, runden=6, schatten=False)}<div style="flex:1;min-width:0"><b>{kurzname(n)}</b><div class="z">{ZUEGE[n]}</div>'
             f'<div class="m"><span>{CHARAKTER[n]}</span><span>·</span><span>Theorie</span>{theoriepunkte(n, 8)}</div></div>{pf}</div>')
        if offen:
            ab, zz = SB[n]
            z += ('<div class="auf"><dl style="margin:0">' + "".join(f'<dt>{k}</dt><dd>{v}</dd>' for k, v in zz.items() if k != "Wer wählt sie?") + '</dl>'
                  f'<span class="knopf rahmen" style="width:100%;margin-top:14px;min-height:46px;font-size:15px">{ic("buch", 18)}Im Buch lesen · Abschnitt {ab}</span></div>')
        return z
    weiss = "".join(zeile(n, n == "Italienische Partie") for n in WEISS)
    schwarz = "".join(zeile(n) for n in SCHWARZ)
    inhalt = (kopf() + umschalter("Eröffnungen · 13", "Fallenchecks · 14")
              + f'<div class="gr">{seitenpunkt(True)}<h3>Mit Weiß</h3></div><div class="liste">{weiss}</div>'
              + f'<div class="gr">{seitenpunkt(False)}<h3>Mit Schwarz</h3></div><div class="liste">{schwarz}</div><div style="height:16px"></div>')
    schreibe("h1", seite("H1 Liste mit Brett", inhalt, css))


# ---------------- H2: Eröffnungsbaum ----------------
def h2():
    css = """
.baum{margin:12px 16px 0}
.zug{display:inline-flex;align-items:center;min-height:28px;padding:0 10px;border-radius:8px;background:#22365a;font-weight:700;font-size:14px;color:var(--gold);font-family:'Source Serif 4',Georgia,serif}
.ast{position:relative;padding-left:22px;margin-top:6px}
.ast:before{content:'';position:absolute;left:9px;top:-2px;bottom:16px;width:2px;background:#3e5070}
.knoten{position:relative;margin-top:6px}
.knoten:before{content:'';position:absolute;left:-13px;top:16px;width:12px;height:2px;background:#3e5070}
.blatt{display:flex;gap:10px;align-items:center;background:var(--karte);border:1px solid var(--rand);border-radius:12px;padding:5px 10px 5px 5px;min-height:48px}
.blatt b{font-size:15px;font-weight:600;display:block;line-height:1.15} .blatt small{font-size:12px;color:var(--leise)}
.blatt.an{border-color:var(--gold);box-shadow:0 0 0 1px var(--gold) inset}
.start{display:flex;align-items:center;gap:10px;margin-top:14px}
"""
    def blatt(n, extra="", an=False, zug=""):
        w = n in WEISS
        return (f'<div class="knoten" style="display:flex;gap:8px;align-items:center">{f"<span class=zug style=flex:none>{zug}</span>" if zug else ""}<div style="flex:1;min-width:0" class="blatt{" an" if an else ""}">{fenbrett(FEN[n], 40, runden=5, schatten=False)}'
                f'<div style="flex:1;min-width:0"><b>{kurzname(n)}</b><small>{CHARAKTER[n]} · Abschnitt {SB[n][0]}</small>{extra}</div></div></div>')
    def zug(t, inhalt):
        return f'<div class="knoten"><span class="zug">{t}</span><div class="ast">{inhalt}</div></div>'
    ital_extra = ""
    e4 = ('<div class="start"><span class="zug" style="font-size:17px;min-height:38px">1. e4</span><span class="leise klein">Königsbauer</span></div><div class="ast">'
          + zug("1… e5 2. Sf3", zug("2… Sc6", blatt("Spanische Partie", zug="3. Lb5") + blatt("Italienische Partie", ital_extra, True, "3. Lc4")
                                    + '<div class="ast" style="margin-top:0">' + blatt("Zweispringerspiel und Läuferspiel", zug="3… Sf6") + '</div>'
                                    + blatt("Schottische Partie", zug="3. d4"))
                + blatt("Russische Verteidigung (Petroff)", zug="2… Sf6"))
          + blatt("Sizilianische Verteidigung", zug="1… c5") + blatt("Französische Verteidigung", zug="1… e6") + blatt("Caro-Kann-Verteidigung", zug="1… c6") + '</div>')
    d4 = ('<div class="start" style="margin-top:22px"><span class="zug" style="font-size:17px;min-height:38px">1. d4</span><span class="leise klein">Damenbauer</span></div><div class="ast">'
          + zug("1… d5", blatt("Damengambit", zug="2. c4") + blatt("London-System", zug="2. Lf4"))
          + zug("1… Sf6", blatt("Trompowsky-Eröffnung", zug="2. Lg5") + zug("2. c4", blatt("Königsindische Verteidigung", zug="2… g6") + zug("2… e6 3. Sc3", blatt("Nimzo-Indische Verteidigung", zug="3… Lb4"))))
          + '</div>')
    fallen = (f'<div class="karte" style="display:flex;gap:12px;align-items:center;margin-top:20px">{ic("warnung", 26, "#e3bf4a")}<div style="flex:1"><b>Fallenchecks</b>'
              f'<div class="leise klein">14 Fallen aus Kapitel 4, jede mit Stopp-Moment</div></div>{ic("pfeil", 18, "#7d8aa0")}</div>')
    einl = '<div class="leise" style="margin:4px 16px 0;font-size:14.5px">Alle 13 Eröffnungen des Buches, nach ihren ersten Zügen geordnet.</div>'
    schreibe("h2", seite("H2 Eröffnungsbaum", kopf() + einl + f'<div class="baum">{e4}{d4}</div>' + fallen, css))


# ---------------- H3: Quartettkarten ----------------
def h3():
    css = """
.filter{display:flex;gap:8px;margin:8px 16px 0;overflow:hidden}
.filter .chip{font-size:14px;min-height:40px}
.buehne{position:relative;margin:14px 0 0;height:560px;overflow:hidden}
.qk{position:absolute;top:0;width:318px;border-radius:20px;background:linear-gradient(180deg,#22365a,#1b2b45 55%);border:1.5px solid #c9a227;box-shadow:0 10px 30px rgba(0,0,0,.45);padding:14px}
.qk .kopfz{display:flex;justify-content:space-between;align-items:center}
.attr{display:flex;justify-content:space-between;align-items:center;min-height:38px;border-top:1px solid #2c3d5a;font-size:14.5px}
.tag{display:inline-block;border:1px solid #4b5d7c;border-radius:99px;padding:1px 9px;font-size:13px;margin:0 4px 4px 0}
.punkte{display:flex;gap:6px;justify-content:center;margin-top:10px} .punkte i{width:7px;height:7px;border-radius:50%;background:#3e5070} .punkte i.an{background:var(--gold);width:18px;border-radius:4px}
.alle{display:flex;flex-wrap:wrap;gap:6px;margin:10px 16px 0}
.alle span{font-size:13.5px;border-radius:99px;background:#1b2b45;border:1px solid var(--rand);padding:0 11px;min-height:36px;display:inline-flex;align-items:center}
"""
    n = "Italienische Partie"
    ab, zz = SB[n]
    karte = (f'<div class="qk" style="left:36px"><div class="kopfz"><span class="zeile" style="gap:6px;font-size:13px;color:var(--leise)">{seitenpunkt(True)}Weiß wählt</span>'
             f'<span class="leise klein">Abschnitt {ab}</span></div>'
             f'<div class="serif" style="font-size:26px;margin:4px 0 2px">{n}</div><div class="gold" style="font-size:14px;margin-bottom:10px">{ZUEGE[n]}</div>'
             f'<div style="display:flex;justify-content:center">{fenbrett(FEN[n], 230, runden=8)}</div>'
             f'<div style="margin-top:12px"><div class="attr"><span class="leise">Theorieaufwand</span>{theoriepunkte(n, 12)}</div>'
             f'<div class="attr"><span class="leise">Charakter</span><span><span class="tag">offen</span><span class="tag">direkt</span><span class="tag">Druck auf f7</span></span></div></div>'
             f'<div style="margin-top:8px;font-size:15px;line-height:1.35"><span class="leise">Passt zu dir, wenn </span>{zz["Passt zu dir, wenn …"]}</div>'
             f'<span class="knopf rahmen" style="width:100%;margin-top:12px;min-height:46px;font-size:15px">{ic("buch", 18)}Im Buch lesen</span></div>')
    neben_l = (f'<div class="qk" style="left:-302px;top:24px;opacity:.5;transform:scale(.94)"><div class="serif" style="font-size:22px;margin-top:22px">Spanische Partie</div>'
               f'<div style="display:flex;justify-content:flex-end;margin-top:30px">{fenbrett(FEN["Spanische Partie"], 210)}</div><div style="height:220px"></div></div>')
    neben_r = (f'<div class="qk" style="left:374px;top:24px;opacity:.5;transform:scale(.94)"><div class="serif" style="font-size:22px;margin-top:22px">Schottische Partie</div>'
               f'<div style="margin-top:30px">{fenbrett(FEN["Schottische Partie"], 210)}</div><div style="height:220px"></div></div>')
    filt = '<div class="filter">' + "".join(f'<span class="chip{" an" if i == 0 else ""}">{t}</span>' for i, t in enumerate(["Alle 13", "Mit Weiß", "Mit Schwarz", "Wenig Theorie"])) + '</div>'
    punkte = '<div class="punkte">' + "".join(f'<i class="{"an" if i == 1 else ""}"></i>' for i in range(13)) + '</div>'
    alle = '<div style="margin:18px 16px 0" class="leise klein">Springen zu</div><div class="alle">' + "".join(f'<span style="{"border-color:#c9a227;color:#f2d27a" if x == n else ""}">{kurzname(x)}</span>' for x in WEISS + SCHWARZ) + '</div>'
    fallen = (f'<div class="karte" style="display:flex;gap:12px;align-items:center;margin-top:18px">{ic("warnung", 26, "#e3bf4a")}<div style="flex:1"><b>Fallenchecks</b>'
              f'<div class="leise klein">14 Karten aus Kapitel 4</div></div>{ic("pfeil", 18, "#7d8aa0")}</div>')
    inhalt = kopf() + filt + f'<div class="buehne">{neben_l}{karte}{neben_r}</div>' + punkte + alle + fallen
    schreibe("h3", seite("H3 Quartett", inhalt, css))


if __name__ == "__main__":
    h1(); h2(); h3()
