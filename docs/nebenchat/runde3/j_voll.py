"""J voll: die drei Entwürfe für „Spielen“ in ganzer Länge, mit allen Blättern."""
from voll import *
from j_spielen import stufe_bots, stufenmarke, STUFEN, STIL3, BESIEGT, kopf as spielkopf

FELIX = "Felix kennt ein paar Eröffnungen auswendig und kommt gut aus den ersten zehn Zügen. Danach wird er unsicher und zieht lieber ruhig."
CSS_J = CSS_VOLL + """
.botreihe{display:flex;gap:10px;margin:10px 16px 0;overflow:hidden}
.botreihe div{display:flex;flex-direction:column;align-items:center;gap:3px;font-size:12px;color:var(--leise);width:58px;flex:none;text-align:center}
.botreihe div.an{color:var(--text);font-weight:700}
.gitter{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}
.gitter div{display:flex;flex-direction:column;align-items:center;gap:2px;font-size:12px;text-align:center;line-height:1.15}
.gitter small{color:var(--leise);font-size:11px}
.festleiste{margin:16px 16px 0;display:flex;gap:10px;align-items:center;background:#16253d;border:1px solid #3e5070;border-radius:16px;padding:10px 10px 10px 12px;box-shadow:0 -6px 18px rgba(0,0,0,.4)}
"""


def gruppenzeile(s=3):
    return (f'<div class="zeile" style="margin:10px 16px 0;min-height:48px;border:1.5px dashed #4b5d7c;border-radius:12px;padding:0 12px;gap:10px;font-size:14px">{ic("schloss", 18, "#c3c9d3")}'
            f'<span style="flex:1">Gruppenmodus Stufe {s}: alle 8 zugleich <span class="leise">· frei, wenn jeder besiegt ist (1/8)</span></span>{ic("frage", 16, "#7d8aa0")}</div>')


def botgitter(s, gewaehlt="jonas"):
    return '<div class="gitter">' + "".join(
        f'<div>{gegner(b, 52, rand="3px #e3bf4a" if b == gewaehlt else ("2px #5fa64a" if b in BESIEGT else None))}<b style="font-size:12.5px">{n}</b><small>{STIL3[i]}</small><small>etwa {560 + 20*i}</small></div>'
        for i, (n, b) in enumerate(stufe_bots(s))) + '</div>'


def startleiste(text="Weiß · 10 + 0 · gewertet ›"):
    return (f'<div class="festleiste">{stufenmarke(3, 26)}{gegner("jonas", 40)}<div style="flex:1;min-width:0"><b>Felix</b> <span class="leise" style="font-size:12.5px">etwa 640</span>'
            f'<div class="leise" style="font-size:12.5px">{text}</div></div><span class="knopf" style="min-height:48px;padding:0 14px">{ic("play", 18)}Beginnen</span></div>'
            f'<div class="leise" style="font-size:12px;margin:4px 16px 0;text-align:center">fest am unteren Rand · Tipp auf den Namen springt zur Auswahl</div>')


def mensch_blatt():
    return blatt("Freie Partie", "„Mensch gegen Mensch“ oder „Stellung aufbauen“",
                 '<div class="feld"><div class="zeilenkarte"><div class="zk">' + ic("schwerter", 20, "#e3bf4a") + '<span style="flex:1">Mensch (beide Seiten selbst)</span>' + schalter(False) + '</div></div></div>' + stellung_inhalt())


# ---------------- J1 ----------------
def j1():
    held = (f'<div class="karte" style="text-align:center;padding:16px;background:radial-gradient(120% 80% at 50% 0%,#2f4a74,#1b2b45 70%)">'
            f'<div style="display:flex;justify-content:center">{gegner("jonas", 104, rand="4px #e58a3a")}</div>'
            f'<div class="serif" style="font-size:28px;margin-top:8px">Felix</div>'
            f'<div class="zeile" style="justify-content:center;gap:8px">{stufenmarke(3, 22)}<span class="leise">Anfänger · etwa 640 bei 10 + 0 {ic("frage", 15)}</span></div>'
            f'<div style="margin-top:6px"><span class="chip" style="min-height:32px;font-size:13.5px">{ic("plan", 15, "#e3bf4a")}Positionsspieler</span></div>'
            f'<div class="leise" style="font-size:12px;margin-top:8px;letter-spacing:.06em">SO STELLT ER SICH VOR</div><div style="font-size:15px;margin-top:2px">{FELIX}</div>'
            f'<div class="gold klein" style="margin-top:8px;font-weight:700">1 von 8 dieser Stufe besiegt (10 + 0)</div></div>')
    stufen = (f'<div class="zeile" style="justify-content:space-between;margin:12px 16px 0"><span style="width:44px;height:44px;border-radius:12px;border:1.5px solid #3e5070;display:flex;align-items:center;justify-content:center">{ic("links", 20)}</span>'
              f'<span style="text-align:center"><b>Stufe 3 · Anfänger</b><div class="leise klein">Stufe 1–10 und „Zum Spaß“</div></span>'
              f'<span style="width:44px;height:44px;border-radius:12px;border:1.5px solid #3e5070;display:flex;align-items:center;justify-content:center">{ic("pfeil", 20)}</span></div>')
    reihe = '<div class="botreihe">' + "".join(f'<div class="{"an" if b == "jonas" else ""}">{gegner(b, 50, rand="3px #e3bf4a" if b == "jonas" else ("2px #5fa64a" if b in BESIEGT else None))}{n}</div>' for n, b in stufe_bots(3)) + '</div>'
    zus = (f'<div class="zeile" style="margin:12px 16px 0;min-height:52px;border-radius:14px;background:#16253d;border:1px solid var(--rand);padding:0 14px;gap:10px">'
           f'<span style="flex:1">Weiß · <b>10 + 0</b> · gewertet · Eröffnung wie Menschen</span>{ic("pfeil", 18, "#7d8aa0")}</div>')
    start = f'<div style="margin:12px 16px 0"><span class="knopf" style="width:100%;min-height:56px;font-size:18px">{ic("play", 20)}Gegen Felix beginnen</span></div>'
    mehr = ('<div class="feld"><div class="t">Andere Gegner</div><div class="zeilenkarte">' + "".join(f'<div class="zk">{ic(i, 20, "#e3bf4a")}<span style="flex:1">{t}</span>{ic("pfeil", 16, "#7d8aa0")}</div>' for i, t in
            [("raster", "Eigene Stufe (Stärke, Stil, Fehler, Flecken)"), ("person", "Eigene Bots"), ("schwerter", "Mensch gegen Mensch"), ("plus", "Stellung aufbauen oder FEN")]) + '</div></div>')
    seite_ = (spielkopf() + laufend_banner() + rivale() + spielstaerke_kacheln() + held + stufen + reihe + gruppenzeile() + zus + start + mehr)
    blaetter = (blatt("Partie einstellen", "die Zeile „Weiß · 10 + 0 · gewertet …“", partie_inhalt())
                + blatt("Eröffnung", "„Eröffnung“ im Blatt „Partie einstellen“", eroeffnung_inhalt())
                + blatt("Eigene Stufe", "„Eigene Stufe“ unter „Andere Gegner“", eigene_stufe_inhalt() + '<div style="margin:12px 16px 0"><span class="knopf" style="width:100%">Mit dieser Stufe beginnen</span></div>')
                + blatt("Eigene Bots", "„Eigene Bots“ unter „Andere Gegner“", eigene_bots_inhalt())
                + mensch_blatt())
    schreibe("j1-voll", seite("J1 voll", seite_ + blaetter + '<div style="height:20px"></div>', CSS_J))


# ---------------- J2 ----------------
def j2():
    css = CSS_J + """
.leiter{margin:12px 16px 0;background:var(--karte);border:1px solid var(--rand);border-radius:16px;overflow:hidden}
.st{display:flex;align-items:center;gap:12px;min-height:56px;padding:0 12px;border-top:1px solid #26385a}
.st b{font-size:15px;font-weight:600;display:block} .st small{font-size:12.5px;color:var(--leise)}
.stapel{display:flex;margin-left:12px} .stapel img{margin-left:-10px;box-shadow:0 0 0 2px #1b2b45}
.du{display:flex;align-items:center;gap:8px;padding:0 12px;height:30px;background:rgba(227,191,74,.12);border-top:1px solid #e3bf4a;border-bottom:1px solid #e3bf4a;font-size:13px;font-weight:700;color:var(--gold)}
"""
    art = ('<div style="display:flex;margin:14px 16px 0;background:#16253d;border:1px solid var(--rand);border-radius:12px;padding:3px">'
           + "".join(f'<span style="flex:1;min-height:42px;display:flex;align-items:center;justify-content:center;border-radius:9px;font-weight:600;font-size:14px;{"background:var(--karte);box-shadow:0 0 0 1px #3e5070" if i == 0 else "color:var(--leise)"}">{t}</span>'
                     for i, t in enumerate(["Bots", "Eigene Stufe", "Eigene Bots", "Mensch"])) + '</div>')
    zeilen = [f'<div class="st" style="border-top:none">{ic("stern", 24, "#e3bf4a")}<span><b>Zum Spaß</b><small>etwa 400 bis 1100</small></span><span class="stapel">{"".join(gegner(b, 30) for b in ["bastian", "oma-ilse", "tarik", "melek"])}</span></div>']
    for s in range(1, 11):
        name, spanne, _ = STUFEN[s - 1]
        bots = stufe_bots(s)
        bes = sum(1 for _, b in bots if b in BESIEGT)
        haken = f'<span class="gold klein" style="font-weight:700">{bes}/8</span>' if bes else ""
        if s == 3:
            zeilen.append(f'<div class="st" style="background:#22365a">{stufenmarke(s)}<span><b>{name}</b><small>{spanne}</small></span><span style="margin-left:auto;display:flex;gap:8px;align-items:center">{haken}<span style="transform:rotate(180deg);display:inline-flex">{ic("runter", 18, "#c3c9d3")}</span></span></div>')
            zeilen.append(f'<div style="background:#16253d;padding:12px;border-top:1px solid #26385a">{botgitter(3)}'
                          f'<div style="display:flex;gap:10px;margin-top:12px;background:var(--karte);border-radius:12px;padding:10px">{gegner("jonas", 44)}<div style="font-size:13.5px"><b>Felix · Positionsspieler</b><div class="leise" style="font-size:11.5px;letter-spacing:.06em">SO STELLT ER SICH VOR</div>{FELIX}</div></div>'
                          f'<div class="zeile" style="margin-top:10px;min-height:46px;border:1.5px dashed #4b5d7c;border-radius:12px;padding:0 10px;gap:8px;font-size:13.5px">{ic("schloss", 16, "#c3c9d3")}<span style="flex:1">Gruppenmodus: frei, wenn alle 8 besiegt sind</span>{ic("frage", 16, "#7d8aa0")}</div>'
                          f'<div class="leise" style="font-size:12px;margin-top:8px">Grüner Ring: in dieser Zeitklasse gewertet besiegt · Stärke der Bots {ic("frage", 13)}</div></div>')
            zeilen.append(f'<div class="du">{ic("person", 16)}Du · etwa 640</div>')
        else:
            stapel = '<span class="stapel">' + "".join(gegner(b, 30) for _, b in bots[:4]) + '</span>'
            zeilen.append(f'<div class="st">{stufenmarke(s)}<span><b>{name}</b><small>{spanne}</small></span><span style="margin-left:auto;display:flex;gap:8px;align-items:center">{haken}{stapel}</span></div>')
    leiter = f'<div class="leiter">{"".join(zeilen)}</div>'
    stellung = (f'<div class="feld"><div class="t">Startstellung</div><div class="zeilenkarte"><div class="zk">{ic("haken", 18, "#e3bf4a")}<span style="flex:1">Aus der Grundstellung</span></div>'
                f'<div class="zk">{ic("plus", 18, "#e3bf4a")}<span style="flex:1">Stellung aufbauen oder FEN</span>{ic("pfeil", 16, "#7d8aa0")}</div></div></div>')
    seite_ = spielkopf() + laufend_banner() + rivale() + spielstaerke_kacheln() + art + leiter + stellung + startleiste()
    blaetter = (blatt("Partie einstellen", "Tipp auf „Weiß · 10 + 0 · gewertet ›“ in der Startleiste", partie_inhalt())
                + blatt("Eröffnung", "„Eröffnung“ im Blatt „Partie einstellen“", eroeffnung_inhalt())
                + blatt("Eigene Stufe", "Reiter „Eigene Stufe“ (ersetzt dann die Leiter)", eigene_stufe_inhalt(), art="Reiter")
                + blatt("Eigene Bots", "Reiter „Eigene Bots“", eigene_bots_inhalt(), art="Reiter")
                + blatt("Mensch gegen Mensch", "Reiter „Mensch“", '<div class="feld leise" style="font-size:14px">Beide Seiten am selben Gerät; Farbe, Bedenkzeit und Startstellung wie oben.</div>', art="Reiter")
                + blatt("Stellung", "„Stellung aufbauen oder FEN“", stellung_inhalt()))
    schreibe("j2-voll", seite("J2 voll", seite_ + blaetter + '<div style="height:20px"></div>', css))


# ---------------- J3 ----------------
def j3():
    css = CSS_J + """
.zwei{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:10px 16px 0}
.kach{background:var(--karte);border:1px solid var(--rand);border-radius:16px;padding:14px;min-height:104px;display:flex;flex-direction:column;gap:6px}
.kach b{font-size:15.5px;font-weight:600} .kach small{font-size:12.5px;color:var(--leise);line-height:1.25}
"""
    gross = (f'<div class="karte" style="background:linear-gradient(150deg,#2f4a74,#1b2b45 70%);margin-top:4px"><div class="zeile" style="justify-content:space-between"><span class="leise" style="font-size:12px;letter-spacing:.1em;font-weight:700">SCHNELL EINE PARTIE</span>'
             f'<span class="leise klein" style="display:flex;gap:4px;align-items:center">Einstellen {ic("pfeil", 14)}</span></div>'
             f'<div class="zeile" style="gap:14px;margin-top:10px">{gegner("jonas", 70, rand="3px #e58a3a")}<div style="flex:1"><div class="serif" style="font-size:24px">Felix</div>'
             f'<div class="leise klein">Stufe 3 · Positionsspieler · etwa so stark wie du</div></div></div>'
             f'<div class="zeile" style="gap:8px;margin-top:12px">' + "".join(f'<span class="chip{" an" if t == "10 + 0" else ""}" style="min-height:40px;font-size:14px">{t}</span>' for t in ["3 + 2", "10 + 0", "30 + 20"])
             + f'<span class="leise klein" style="margin-left:auto">Weiß · gewertet</span></div>'
             f'<span class="knopf" style="width:100%;margin-top:12px;min-height:54px;font-size:18px">{ic("play", 20)}Spielen</span>'
             f'<div class="leise klein" style="display:flex;justify-content:center;align-items:center;gap:6px;min-height:40px;margin-top:4px">{ic("wiederholen", 16)}Anderer Vorschlag</div></div>')
    collage = '<span style="display:flex">' + "".join(f'<span style="margin-left:{-8 if i else 0}px">{gegner(b, 30)}</span>' for i, b in enumerate(["paula", "leon", "ida", "jan"])) + '</span>'
    def kach(icon, titel, text, extra=""):
        return f'<div class="kach">{extra or ic(icon, 26, "#e3bf4a")}<b>{titel}</b><small>{text}</small></div>'
    zwei = ('<div class="zwei">' + kach("", "Gegner aussuchen", "80 Bots in 10 Stufen, dazu zum Spaß", collage) + kach("raster", "Eigene Stufe", "Stärke, Stil, Fehler, Flecken")
            + kach("person", "Eigene Bots", "anlegen und wiederfinden") + kach("schwerter", "Freie Partie", "Mensch gegen Mensch, Stellung aufbauen, FEN") + '</div>')
    def z(b, n, erg, farbe):
        return (f'<div class="zk">{gegner(b, 38)}<div style="flex:1"><b>{n}</b><div class="leise" style="font-size:12.5px">gestern · 10 + 0</div></div>'
                f'<span style="font-size:12.5px;font-weight:700;border-radius:6px;padding:2px 7px;background:{farbe}22;color:{farbe}">{erg}</span><span class="leise klein">Revanche</span></div>')
    letzte = (f'<div class="feld"><div class="t">Zuletzt gespielt {neu()}</div><div class="zeilenkarte">' + z("selin", "Derya", "Sieg", "#5fa64a") + z("ida", "Pia", "Niederlage", "#e05a4f") + '</div></div>')
    seite_ = spielkopf() + laufend_banner() + gross + rivale() + spielstaerke_kacheln() + zwei + letzte
    stufenliste = ""
    for s in (1, 2, 3, 4):
        name, spanne, _ = STUFEN[s - 1]
        stufenliste += (f'<div class="feld"><div class="t">{stufenmarke(s, 22)} Stufe {s} · {name} <span style="font-weight:400;letter-spacing:0;text-transform:none">· {spanne}</span></div>'
                        + (botgitter(s) + gruppenzeile(s).replace("margin:10px 16px 0", "margin:10px 0 0") if s == 3 else
                           '<div class="botreihe" style="margin:0">' + "".join(f'<div>{gegner(b, 46, rand="2px #5fa64a" if b in BESIEGT else None)}{n}</div>' for n, b in stufe_bots(s)[:5]) + '</div>') + '</div>')
    stufenliste += '<div class="feld leise" style="font-size:13.5px">… Stufe 5 bis 10 und „Zum Spaß“ genauso. Tipp auf einen Bot zeigt „So stellt er sich vor“, Stil und Stärke ' + ic("frage", 13) + '.</div>'
    blaetter = (blatt("Gegner aussuchen", "Kachel „Gegner aussuchen“ (eigene Seite)", stufenliste, art="Seite")
                + blatt("Partie einstellen", "„Einstellen ›“ auf der Vorschlagskarte (alle Bedenkzeiten, Farbe, Hilfen)", partie_inhalt())
                + blatt("Eröffnung", "„Eröffnung“ im Blatt „Partie einstellen“", eroeffnung_inhalt())
                + blatt("Eigene Stufe", "Kachel „Eigene Stufe“ (eigene Seite)", eigene_stufe_inhalt(), art="Seite")
                + blatt("Eigene Bots", "Kachel „Eigene Bots“ (eigene Seite)", eigene_bots_inhalt(), art="Seite")
                + mensch_blatt().replace("„Mensch gegen Mensch“ oder „Stellung aufbauen“", "Kachel „Freie Partie“"))
    schreibe("j3-voll", seite("J3 voll", seite_ + blaetter + '<div style="height:20px"></div>', css))


if __name__ == "__main__":
    j1(); j2(); j3()
