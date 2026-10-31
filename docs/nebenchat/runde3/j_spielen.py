"""J: Spielen, Gegnerwahl und Partie-Einstellungen."""
from bausteine3 import *

BOTS = ("Tom|max Marie|paula Oma Erna|oma-gerda Luis|finn Clara|frieda Onkel Bernd|onkel-rudi Frau Schulz|frau-schulz Lotte|lotte "
        "Henry|leon Moritz|emil Derya|selin Herr Krause|herr-lehmann Lina|mia Jakob|pit Rolf|karl Herr Wolff|herr-nowak "
        "Pia|ida Felix|jonas Yusuf|omar Ronja|greta Svenja|nina Philipp|lukas Frau Albrecht|frau-berger Ella|lotta "
        "Erik|jan Dennis|timo Leyla|ayse Mara|zoe Simon|paul Opa Heinz|opa-hans Holger|benno Lars|nils "
        "Katrin|hanna Marco|tobias Frau Romero|frau-ortega Nele|lea Johanna|sophie Frau Demir|frau-kaya Jana|lena Luca|matteo "
        "Günter|kurt Herr Kühn|herr-schmitt Igor|viktor Miriam|sara Samira|amira Herr Vogel|herr-weber Herr Hartmann|herr-fischer David|ben "
        "Frau Sommer|frau-lind Herr Lorenz|herr-brandt Defne|elif Amaya|yara Elias|noah Frau Wagner|frau-stein Fiona|fiona Juna|juna "
        "GM Novak|gm-gruen Trainer Maier|trainer-koch IM Becker|im-vogt WGM Tanaka|wgm-sato GM Okoro|gm-okoro IM Lindgren|im-lindgren Ole|ole Mats|mats "
        "Arjun|ravi Nora|nora Melek|melek Tarik|tarik Bastian|bastian Oma Ilse|oma-ilse FM Duarte|fm-ortiz IM Kraft|im-haas "
        "Opa Walter|opa-walter WIM Okafor|wim-nkemelu GM Ivanova|gm-petrova GM Berglund|gm-lindqvist Herr Yılmaz|herr-yilmaz")
BOTLISTE = []
for teil in BOTS.split("|"):
    pass
_roh = BOTS.split(" ")
# Paare „Name|bild“ wieder zusammensetzen (Namen dürfen Leerzeichen enthalten)
_paare, _puffer = [], []
for w in _roh:
    _puffer.append(w)
    if "|" in w:
        name, bild = " ".join(_puffer).split("|")
        _paare.append((name, bild)); _puffer = []
STUFEN = [("Neuling", "unter 400 bis etwa 400", "#f5f0e6"), ("Einsteiger", "etwa 400 bis 550", "#e3bf4a"), ("Anfänger", "etwa 550 bis 700", "#e58a3a"),
          ("Gelegenheitsspieler", "etwa 800 bis 1000", "#5fa64a"), ("Vereinsspieler", "etwa 1000 bis 1250", "#4f8fd6"), ("Starker Vereinsspieler", "etwa 1350 bis 1450", "#8a6fd0"),
          ("Experte", "etwa 1450 bis 1800", "#8a5a3a"), ("Meister", "etwa 1850 bis 2150", "#2b2f3a"), ("Großmeister", "etwa 2200 bis 2350", "#c9a227"), ("Engine", "etwa 2350 bis 2600", "#e3bf4a")]
STIL3 = ["Angreifer", "Positionsspieler", "Taktiker", "Verteidiger", "Draufgänger", "Vereinfacher", "Universell", "Universell"]
YUSUF = "Felix kennt ein paar Eröffnungen auswendig und kommt gut aus den ersten zehn Zügen. Danach wird er unsicher und zieht lieber ruhig."
BESIEGT = {"max", "paula", "oma-gerda", "finn", "frieda", "frau-schulz", "leon", "emil", "selin", "karl", "ida"}


def stufe_bots(s):
    return _paare[(s - 1) * 8: s * 8]


def stufenmarke(s, px=26):
    farbe = STUFEN[s - 1][2]
    text = "#16253d" if s in (1, 2, 3, 9, 10) else "#fff"
    return f'<span style="width:{px}px;height:{px}px;border-radius:50%;background:{farbe};color:{text};font-weight:700;font-size:{px*.5:.0f}px;display:inline-flex;align-items:center;justify-content:center;flex:none;box-shadow:0 0 0 2px #0f1b2e">{s}</span>'


def kopf():
    return f'<div class="kopf"><h1 style="font-size:34px">Spielen</h1>{ic("kompass", 28, "#c3c9d3")}</div>'


def rivalenband():
    return (f'<div class="karte" style="display:flex;gap:12px;align-items:center;padding:10px 12px;margin-top:4px">{gegner("max", 44)}'
            f'<div style="flex:1;min-width:0"><b>Rivale Tom</b><div class="leise klein">Euer Duell 0 : 0 · „Ich greife an, du verteidigst.“</div></div>'
            f'<span class="knopf rahmen" style="min-height:44px;padding:0 12px;font-size:14.5px">Fordern</span></div>')


def zusammenfassung():
    return (f'<div class="zeile" style="margin:12px 16px 0;min-height:52px;border-radius:14px;background:#16253d;border:1px solid var(--rand);padding:0 14px;gap:10px">'
            f'<span style="width:16px;height:16px;border-radius:50%;background:#f5f0e6;border:1.5px solid #c3c9d3"></span>'
            f'<span style="flex:1">Weiß · <b>10 + 0</b> · gewertet</span><span class="leise klein">Ändern</span>{ic("pfeil", 18, "#7d8aa0")}</div>')


# ---------------- J1: Der Gegner im Mittelpunkt ----------------
def j1():
    css = """
.held{margin:12px 16px 0;border-radius:20px;background:radial-gradient(120% 80% at 50% 0%,#2f4a74,#1b2b45 70%);border:1px solid #3a4f74;padding:18px 16px 16px;text-align:center}
.reihe{display:flex;gap:10px;margin:12px 16px 0;overflow:hidden}
.reihe div{display:flex;flex-direction:column;align-items:center;gap:4px;font-size:12px;color:var(--leise);width:56px;flex:none}
.reihe div.an{color:var(--text);font-weight:700}
.stufenwahl{display:flex;align-items:center;justify-content:space-between;margin:14px 16px 0}
.pfeilk{width:44px;height:44px;border-radius:12px;border:1.5px solid #3e5070;display:flex;align-items:center;justify-content:center}
.mehr{background:var(--karte);border:1px solid var(--rand);border-radius:14px;margin:16px 16px 16px;overflow:hidden}
.mehr div{display:flex;align-items:center;gap:12px;min-height:52px;padding:0 14px;border-top:1px solid #26385a;font-size:15px}
.mehr div:first-child{border-top:none}
"""
    held = (f'<div class="held"><div style="display:flex;justify-content:center">{gegner("jonas", 116, rand="4px #e58a3a")}</div>'
            f'<div class="serif" style="font-size:30px;margin-top:10px">Felix</div>'
            f'<div class="zeile" style="justify-content:center;gap:8px;margin-top:4px">{stufenmarke(3, 22)}<span class="leise">Anfänger · etwa 550 bis 700</span></div>'
            f'<div style="margin-top:8px"><span class="chip" style="min-height:32px;font-size:13.5px">{ic("plan", 15, "#e3bf4a")}Positionsspieler</span></div>'
            f'<div style="font-size:15px;margin-top:10px;line-height:1.4;color:#e6e1d6">{YUSUF}</div>'
            f'<div class="gold klein" style="margin-top:8px;font-weight:700">Passt zu dir: du spielst etwa 600</div></div>')
    stufenwahl = (f'<div class="stufenwahl"><span class="pfeilk">{ic("links", 20)}</span><span style="text-align:center"><b>Stufe 3 · Anfänger</b>'
                  f'<div class="leise klein">8 Gegner · 1 besiegt</div></span><span class="pfeilk">{ic("pfeil", 20)}</span></div>')
    reihe = '<div class="reihe">' + "".join(
        f'<div class="{"an" if b == "jonas" else ""}">{gegner(b, 52, rand="3px #e3bf4a" if b == "jonas" else ("2px #5fa64a" if b in BESIEGT else None))}{n}</div>' for n, b in stufe_bots(3)) + '</div>'
    start = f'<div style="margin:12px 16px 0"><span class="knopf" style="width:100%;min-height:56px;font-size:18px">{ic("play", 20)}Gegen Felix beginnen</span></div>'
    mehr = ('<div class="mehr">' + "".join(f'<div>{ic(i, 20, "#e3bf4a")}<span style="flex:1">{t}</span>{ic("pfeil", 18, "#7d8aa0")}</div>' for i, t in
            [("raster", "Eigene Stufe einstellen (Stärke, Stil, Fehler)"), ("person", "Eigene Bots"), ("schwerter", "Mensch gegen Mensch"), ("plus", "Stellung aufbauen")]) + '</div>')
    schreibe("j1", seite("J1 Gegner im Mittelpunkt", kopf() + rivalenband() + held + stufenwahl + reihe + zusammenfassung() + start + mehr, css))


# ---------------- J2: Die Gegnerleiter ----------------
def j2():
    css = """
.leiter{margin:14px 16px 0;background:var(--karte);border:1px solid var(--rand);border-radius:16px;overflow:hidden}
.st{display:flex;align-items:center;gap:12px;min-height:58px;padding:0 12px;border-top:1px solid #26385a}
.st:first-child{border-top:none}
.st b{font-size:15.5px;font-weight:600;display:block} .st small{font-size:12.5px;color:var(--leise)}
.stapel{display:flex;margin-left:auto} .stapel img{margin-left:-10px;box-shadow:0 0 0 2px #1b2b45}
.du{display:flex;align-items:center;gap:8px;padding:0 12px;height:30px;background:rgba(227,191,74,.12);border-top:1px solid #e3bf4a;border-bottom:1px solid #e3bf4a;font-size:13px;font-weight:700;color:var(--gold)}
.offen{background:#16253d;padding:12px;border-top:1px solid #26385a}
.gitter{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}
.gitter div{display:flex;flex-direction:column;align-items:center;gap:3px;font-size:12px;text-align:center;line-height:1.15}
.gitter small{color:var(--leise);font-size:11px}
.leiste2{position:relative;margin:16px 16px 16px;display:flex;gap:10px;align-items:center;background:#16253d;border:1px solid #3e5070;border-radius:16px;padding:10px 10px 10px 12px}
"""
    zeilen = []
    for s in range(1, 8):
        name, spanne, _ = STUFEN[s - 1]
        bots = stufe_bots(s)
        bes = sum(1 for _, b in bots if b in BESIEGT)
        stapel = '<span class="stapel">' + "".join(gegner(b, 30) for _, b in bots[:4]) + '</span>'
        haken = f'<span class="gold klein" style="font-weight:700">{bes}/8</span>' if bes else ""
        if s == 3:
            zeilen.append(f'<div class="st" style="background:#22365a">{stufenmarke(s)}<span><b>{name}</b><small>{spanne}</small></span><span style="margin-left:auto;display:flex;gap:8px;align-items:center">{haken}<span style="transform:rotate(180deg);display:inline-flex">{ic("runter", 18, "#c3c9d3")}</span></span></div>')
            gitter = '<div class="gitter">' + "".join(
                f'<div>{gegner(b, 54, rand="3px #e3bf4a" if b == "jonas" else ("2px #5fa64a" if b in BESIEGT else None))}<b style="font-size:12.5px">{n}</b><small>{STIL3[i]}</small></div>'
                for i, (n, b) in enumerate(bots)) + '</div>'
            zeilen.append(f'<div class="offen">{gitter}<div class="leise klein" style="margin-top:10px">Grüner Ring: schon besiegt</div></div>')
            zeilen.append(f'<div class="du">{ic("person", 16)}Du · etwa 600</div>')
        else:
            zeilen.append(f'<div class="st">{stufenmarke(s)}<span><b>{name}</b><small>{spanne}</small></span><span style="margin-left:auto;display:flex;gap:8px;align-items:center">{haken}{stapel}</span></div>')
    zeilen.append(f'<div class="st"><span class="leise" style="margin:0 auto;font-size:14px">Stufe 8 bis 10 · Meister bis Engine</span></div>')
    spass = (f'<div class="st" style="border-top:none">{ic("stern", 24, "#e3bf4a")}<span><b>Zum Spaß</b><small>etwa 400 bis 1100</small></span>'
             f'<span class="stapel">{"".join(gegner(b, 30) for b in ["bastian", "oma-ilse", "tarik", "melek"])}</span></div>')
    leiter = f'<div class="leise klein" style="margin:16px 16px 0">Wähle eine Sprosse, dann einen Gegner.</div><div class="leiter">{spass}{"".join(zeilen)}</div>'
    leiste2 = (f'<div class="leiste2">{gegner("jonas", 44)}<div style="flex:1;min-width:0"><b>Felix</b><div class="leise" style="font-size:12.5px">Weiß · 10 + 0 · gewertet ›</div></div>'
               f'<span class="knopf" style="min-height:48px;padding:0 16px">{ic("play", 18)}Beginnen</span></div>')
    schreibe("j2", seite("J2 Gegnerleiter", kopf() + rivalenband() + leiter + leiste2, css))


# ---------------- J3: Schnellstart ----------------
def j3():
    css = """
.gross{margin:8px 16px 0;border-radius:20px;background:linear-gradient(150deg,#2f4a74,#1b2b45 70%);border:1px solid #3a4f74;padding:16px}
.zwei{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:10px 16px 0}
.kach{background:var(--karte);border:1px solid var(--rand);border-radius:16px;padding:14px;min-height:112px;display:flex;flex-direction:column;gap:8px}
.kach b{font-size:15.5px;font-weight:600} .kach small{font-size:12.5px;color:var(--leise);line-height:1.25}
.letzte{background:var(--karte);border:1px solid var(--rand);border-radius:16px;margin:8px 16px 16px;overflow:hidden}
.letzte div.z{display:flex;align-items:center;gap:12px;min-height:60px;padding:0 12px;border-top:1px solid #26385a}
.letzte div.z:first-child{border-top:none}
.erg{font-size:12.5px;font-weight:700;border-radius:6px;padding:2px 7px}
"""
    gross = (f'<div class="gross"><div class="leise" style="font-size:12px;letter-spacing:.1em;font-weight:700">SCHNELL EINE PARTIE</div>'
             f'<div class="zeile" style="gap:14px;margin-top:10px">{gegner("jonas", 72, rand="3px #e58a3a")}<div style="flex:1"><div class="serif" style="font-size:24px">Felix</div>'
             f'<div class="leise klein">Stufe 3 · Positionsspieler · etwa so stark wie du</div></div></div>'
             f'<div class="zeile" style="gap:8px;margin-top:12px">'
             + "".join(f'<span class="chip{" an" if t == "10 + 0" else ""}" style="min-height:40px;font-size:14px">{t}</span>' for t in ["3 + 2", "10 + 0", "30 + 20"])
             + f'<span class="leise klein" style="margin-left:auto">gewertet</span></div>'
             f'<span class="knopf" style="width:100%;margin-top:12px;min-height:54px;font-size:18px">{ic("play", 20)}Spielen</span>'
             f'<div class="leise klein" style="display:flex;justify-content:center;align-items:center;gap:6px;min-height:40px;margin-top:4px">{ic("wiederholen", 16)}Anderer Vorschlag</div></div>')
    rival = (f'<div class="karte" style="display:flex;gap:12px;align-items:center;margin-top:10px">{gegner("max", 52)}<div style="flex:1"><b>Dein Rivale Tom</b>'
             f'<div class="leise klein">„Ich greife an, du verteidigst. Bereit?“ · 0 : 0</div></div><span class="knopf rahmen" style="min-height:44px;padding:0 12px;font-size:14.5px">Fordern</span></div>')
    def kach(icon, titel, text, extra=""):
        return f'<div class="kach">{extra or ic(icon, 26, "#e3bf4a")}<b>{titel}</b><small>{text}</small></div>'
    collage = '<span style="display:flex">' + "".join(f'<span style="margin-left:{-8 if i else 0}px">{gegner(b, 30)}</span>' for i, b in enumerate(["paula", "leon", "ida", "jan"])) + '</span>'
    zwei = ('<div class="zwei">' + kach("", "Gegner aussuchen", "80 Bots in 10 Stufen, dazu Bots zum Spaß", collage)
            + kach("raster", "Eigene Stufe", "Stärke je Phase, Stil und Fehler selbst einstellen")
            + kach("person", "Eigene Bots", "Mit Namen anlegen und wiederfinden")
            + kach("schwerter", "Freie Partie", "Beide Seiten selbst ziehen oder eine Stellung aufbauen") + '</div>')
    def z(b, n, erg, farbe):
        return (f'<div class="z">{gegner(b, 40)}<div style="flex:1"><b>{n}</b><div class="leise" style="font-size:12.5px">gestern · 10 + 0</div></div>'
                f'<span class="erg" style="background:{farbe}22;color:{farbe}">{erg}</span><span class="leise klein" style="min-width:64px;text-align:right">Revanche</span></div>')
    letzte = ('<div style="margin:18px 16px 0"><h3>Zuletzt gespielt</h3></div><div class="letzte">' + z("selin", "Derya", "Sieg", "#5fa64a")
              + z("ida", "Pia", "Niederlage", "#e05a4f") + z("max", "Tom", "Remis", "#c3c9d3") + '</div>')
    schreibe("j3", seite("J3 Schnellstart", kopf() + gross + rival + zwei + letzte, css))


if __name__ == "__main__":
    j1(); j2(); j3()
