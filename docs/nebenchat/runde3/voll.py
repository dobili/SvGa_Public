"""Gemeinsame Teile der vollständigen Seiten (Runde 3, Nachtrag): Blätter, Netze, Regler, Brettblock."""
from bausteine3 import *

CSS_VOLL = """
.blatt-trenner{margin:34px 0 0;padding:14px 16px 10px;background:repeating-linear-gradient(135deg,#0b1424 0 10px,#0e192c 10px 20px);border-top:2px dashed #4b5d7c}
.blatt-trenner b{display:block;color:#e3bf4a;font-size:12px;letter-spacing:.12em}
.blatt-trenner span{font-size:13.5px;color:#c3c9d3}
.blatt{background:#1d2f4d;border-radius:22px 22px 0 0;border-top:1px solid #3e5070;padding:10px 0 18px;box-shadow:0 -10px 30px rgba(0,0,0,.45)}
.blatt .griff{width:44px;height:5px;border-radius:3px;background:#56688a;margin:0 auto 10px}
.blatt h2{margin:0 16px 4px}
.tipp{display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:700;letter-spacing:.06em;color:#16253d;background:#7fb5ae;border-radius:6px;padding:1px 6px;vertical-align:middle;margin-left:6px}
.neu{display:inline-flex;font-size:11px;font-weight:700;letter-spacing:.06em;color:#16253d;background:#e3bf4a;border-radius:6px;padding:1px 6px;vertical-align:middle;margin-left:6px}
.feld{margin:12px 16px 0}
.feld>.t{font-size:12px;letter-spacing:.1em;font-weight:700;color:var(--leise);text-transform:uppercase;margin-bottom:6px;display:flex;align-items:center;gap:6px}
.chipreihe{display:flex;flex-wrap:wrap;gap:6px}
.chipreihe .chip{min-height:40px;font-size:14px;padding:0 12px}
.zeilenkarte{background:var(--karte);border:1px solid var(--rand);border-radius:14px;overflow:hidden}
.zk{display:flex;align-items:center;gap:12px;min-height:52px;padding:6px 14px;border-top:1px solid #26385a;font-size:15px}
.zk:first-child{border-top:none}
.regler{margin:8px 0 12px}
.regler .l{display:flex;justify-content:space-between;font-size:14.5px;margin-bottom:8px}
.regler .bahn{position:relative;height:6px;border-radius:3px;background:#33456a}
.regler .bahn i{position:absolute;left:0;top:0;bottom:0;border-radius:3px;background:#e3bf4a}
.regler .bahn b{position:absolute;top:50%;width:24px;height:24px;margin:-12px 0 0 -12px;border-radius:50%;background:#e3bf4a;box-shadow:0 0 0 4px #1b2b45}
.reiterleiste{display:flex;border-bottom:1px solid #2c3d5a;margin:10px 16px 0}
.reiterleiste span{flex:1;text-align:center;min-height:44px;display:flex;align-items:center;justify-content:center;font-size:14px;color:var(--leise);font-weight:600}
.reiterleiste span.an{color:var(--text);border-bottom:3px solid #e3bf4a}
"""


def blatt(titel, wo, inhalt, art="Blatt"):
    """Ein Blatt (von unten), darüber ein Trenner, der sagt, wie man hinkommt."""
    return (f'<div class="blatt-trenner"><b>{art.upper()}</b><span>öffnet über: {wo}</span></div>'
            f'<div class="blatt"><div class="griff"></div><h2>{titel}</h2>{inhalt}</div>')


def tipp(t="hinter Tipp"):
    return f'<span class="tipp">{t}</span>'


def neu(t="NEU"):
    return f'<span class="neu">{t}</span>'


def netz(achsen, werte, px=170, normal=None, farbe="#e3bf4a", schrift=11):
    """Spinnennetz: achsen = Namen, werte 0..1 je Achse, normal = gestrichelter Ring."""
    n = len(achsen)
    m = px / 2
    r = px * 0.32
    def pt(i, v):
        w = -math.pi / 2 + 2 * math.pi * i / n
        return m + math.cos(w) * r * v, m + math.sin(w) * r * v
    s = []
    for ring_ in (0.25, 0.5, 0.75, 1):
        s.append('<polygon points="' + " ".join(f"{x:.1f},{y:.1f}" for x, y in (pt(i, ring_) for i in range(n))) + '" fill="none" stroke="#33456a"/>')
    for i in range(n):
        x, y = pt(i, 1)
        s.append(f'<line x1="{m}" y1="{m}" x2="{x:.1f}" y2="{y:.1f}" stroke="#33456a"/>')
        lx, ly = pt(i, 1.32)
        s.append(f'<text x="{lx:.1f}" y="{ly+4:.1f}" text-anchor="middle" font-size="{schrift}" fill="#c3c9d3" font-family="Source Sans 3">{achsen[i]}</text>')
    if normal:
        s.append('<polygon points="' + " ".join(f"{x:.1f},{y:.1f}" for x, y in (pt(i, normal) for i in range(n))) + '" fill="none" stroke="#c3c9d3" stroke-dasharray="3 3"/>')
    s.append('<polygon points="' + " ".join(f"{x:.1f},{y:.1f}" for x, y in (pt(i, max(.04, v)) for i, v in enumerate(werte))) + f'" fill="{farbe}" fill-opacity=".25" stroke="{farbe}" stroke-width="2"/>')
    for i, v in enumerate(werte):
        x, y = pt(i, max(.04, v))
        s.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="4" fill="{farbe}"/>')
    return f'<svg width="{px}" height="{px}" viewBox="0 0 {px} {px}" style="display:block;overflow:visible">{"".join(s)}</svg>'


def regler(label, wert, name, anteil):
    return (f'<div class="regler"><div class="l"><span>{label}</span><b>{wert} · {name}</b></div>'
            f'<div class="bahn"><i style="width:{anteil*100:.0f}%"></i><b style="left:{anteil*100:.0f}%"></b></div></div>')


# ---------- Bausteine der Seite „Spielen“ ----------
STUFENNAMEN = ["Neuling", "Einsteiger", "Anfänger", "Gelegenheitsspieler", "Vereinsspieler", "Starker Vereinsspieler", "Experte", "Meister", "Großmeister", "Engine"]


def eigene_stufe_inhalt():
    """Alle vier Reiter der eigenen Stufe untereinander (in der App: Reiter)."""
    staerke = (f'<div class="feld"><div class="t">Reiter Stärke {tipp("Hilfe ?")}</div>'
               + regler("Eröffnung", 1, "Neuling", 0) + regler("Mittelspiel", 3, "Anfänger", .22) + regler("Endspiel", 2, "Einsteiger", .11) + '</div>')
    stil = (f'<div class="feld"><div class="t">Reiter Stil · Spinnennetz</div><div style="display:flex;gap:12px;align-items:center">'
            f'{netz(["Angreifer", "Taktiker", "Draufgänger", "Positionsspieler", "Verteidiger", "Vereinfacher"], [.75, .5, .25, .25, .5, .25], 170)}'
            f'<div style="font-size:13.5px;flex:1">Drei Achsen: Königsangriff, Aktivität, Bauernsturm oder Vereinfachen; je 50 bis 125 %. Ohne Wahl: Universell.</div></div></div>')
    fehler = (f'<div class="feld"><div class="t">Reiter Fehler (9)</div><div style="display:flex;gap:12px;align-items:center">'
              f'{netz(["Figuren", "Taktik", "König", "Bauernzüge", "Eröffnung"], [.5, .7, .4, .5, .6], 160, normal=.5)}'
              f'<div style="flex:1"><div class="chipreihe">' + "".join(f'<span class="chip{" an" if v == "Wie Menschen" else ""}" style="min-height:34px;font-size:12.5px;padding:0 9px">{v}</span>' for v in ["Wie Menschen", "Solide", "Leichtsinnig", "Königsunsicher", "Taktisch blind", "Eröffnungssünder", "Keine Fehler"]) + '</div></div></div>'
              f'<div class="zeilenkarte" style="margin-top:10px"><div class="zk">Höchstverlust je Fehler<span class="leise" style="margin-left:auto">unbegrenzt ›</span></div>'
              f'<div class="zk">Feinregler für jede Fehlerart{schalter(False)}</div><div class="zk">Auch unmenschliche Werte{schalter(False)}</div><div class="zk">Setzt nie Patt{schalter(False)}</div></div></div>')
    flecken = (f'<div class="feld"><div class="t">Reiter Blinde Flecken (0)</div><div style="display:flex;gap:12px;align-items:center">'
               f'{netz(["Ruhige Züge", "Bauernzüge", "Rückzüge", "Fernwirkung", "Wendungen"], [0, 0, 0, 0, 0], 160)}'
               f'<div style="flex:1"><div class="chipreihe">' + "".join(f'<span class="chip{" an" if v == "Keine" else ""}" style="min-height:34px;font-size:12.5px;padding:0 9px">{v}</span>' for v in ["Wie Menschen", "Keine", "Kurzsichtig", "Überrumpelbar"]) + '</div>'
               f'<div class="leise" style="font-size:12.5px;margin-top:6px">Keine blinden Flecken: Er sieht alles, was seine Stufe sieht.</div></div></div></div>')
    kopf = (f'<div class="feld" style="display:flex;gap:12px;align-items:center;background:#16253d;border-radius:14px;padding:12px">'
            f'<span class="serif" style="font-size:26px">etwa 620</span><span class="leise">geschätzt</span>'
            f'<span style="margin-left:auto;border:1px solid #5fa64a;color:#8fd08a;border-radius:99px;padding:1px 9px;font-size:13px;font-weight:700">Menschlich</span>{ic("frage", 18, "#c3c9d3")}</div>')
    reiter = '<div class="reiterleiste"><span class="an">Stärke</span><span>Stil</span><span>Fehler (9)</span><span>Flecken (0)</span></div>'
    return kopf + reiter + staerke + stil + fehler + flecken


def eigene_bots_inhalt():
    liste = (f'<div class="feld"><div class="zeilenkarte">'
             f'<div class="zk">{gegner("karl", 40)}<span style="flex:1"><b>Onkel Paul</b><div class="leise" style="font-size:12.5px">Stufen 2 · 3 · 2 · Angreifer · etwa 650</div></div>'
             f'</div><div class="zk" style="justify-content:flex-end;gap:22px;min-height:44px"><span class="leise">Bearbeiten</span><span style="color:#f09080">Löschen</span></div>'
             f'<div class="zk" style="color:#e3bf4a">{ic("plus", 20)}Neuen Gegner anlegen</div></div></div>')
    editor = (f'<div class="feld"><div class="t">Gegner-Editor (nach „Neuen Gegner anlegen“)</div><div class="zeilenkarte">'
              f'<div class="zk"><span class="leise" style="width:76px">Name</span><span style="flex:1;border-bottom:1px solid #4b5d7c">Onkel Paul</span></div>'
              f'<div class="zk"><span class="leise" style="width:76px">Porträt</span>{gegner("karl", 36)}<span class="leise klein" style="margin-left:auto">Bild wählen oder gestalten ›</span></div>'
              f'<div class="zk"><span class="leise" style="width:76px">Stärke</span><span style="flex:1">Stärke, Stil, Fehler, blinde Flecken wie bei „Eigene Stufe“</span>{ic("pfeil", 16, "#7d8aa0")}</div>'
              f'<div class="zk"><span class="leise" style="width:76px">Eröffnung</span><span style="flex:1">Eröffnungen (2): Italienisch, London · Abweichung 20 %</span>{ic("pfeil", 16, "#7d8aa0")}</div></div>'
              f'<span class="knopf" style="width:100%;margin-top:10px">Gegner speichern</span></div>')
    return liste + editor


def partie_inhalt(mit_eroeffnung_zeile=True):
    farbe = ('<div class="feld"><div class="t">Du spielst</div><div class="chipreihe">'
             '<span class="chip an"><i style="width:14px;height:14px;border-radius:50%;background:#fff;border:1.5px solid #13203a;display:inline-block"></i>Weiß</span>'
             '<span class="chip"><i style="width:14px;height:14px;border-radius:50%;background:#000;border:1.5px solid #c3c9d3;display:inline-block"></i>Schwarz</span>'
             '</div></div>')
    zeit = ('<div class="feld"><div class="t">Bedenkzeit</div>'
            + "".join(f'<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px"><span class="leise" style="width:96px;font-size:13.5px">{k}</span><div class="chipreihe">'
                      + "".join(f'<span class="chip{" an" if z == "10 + 0" else ""}">{z}</span>' for z in zs) + '</div></div>'
                      for k, zs in [("Blitz", ["3 + 0", "3 + 2", "5 + 3"]), ("Schnellschach", ["10 + 0", "15 + 10"]), ("Klassisch", ["30 + 20", "60 + 0"])])
            + '<div class="leise" style="font-size:12.5px">Aus einer eigenen Stellung zusätzlich „Ohne Uhr“.</div></div>')
    wertung = (f'<div class="feld"><div class="zeilenkarte"><div class="zk"><span style="flex:1">Gewertete Partie<div class="leise" style="font-size:12.5px">zählt für deine Spielstärke · ohne Zugrücknahme und Hilfen</div></span>{ic("frage", 18, "#7d8aa0")}{schalter(True)}</div>'
               f'<div class="zk" style="opacity:.55"><span style="flex:1">Symbole am Brett<div class="leise" style="font-size:12.5px">Zählen, Röntgen, Warnsignale</div></span>{schalter(False)}</div>'
               f'<div class="zk" style="opacity:.55"><span style="flex:1">Werkzeuge und Engine unter dem Brett</span>{schalter(False)}</div>'
               + (f'<div class="zk"><span style="flex:1">Eröffnung<div class="leise" style="font-size:12.5px">wie Menschen dieser Stärke</div></span>{ic("pfeil", 16, "#7d8aa0")}</div>' if mit_eroeffnung_zeile else "")
               + '</div><div class="leise" style="font-size:12.5px;margin-top:6px">Spielhilfen gehen nur in ungewerteten Partien.</div></div>')
    return farbe + zeit + wertung


def eroeffnung_inhalt():
    arten = ('<div class="feld"><div class="t">Woher kommt die Eröffnung?</div><div class="chipreihe">'
             '<span class="chip an">wie Menschen dieser Stärke</span><span class="chip">aus dem Buch</span><span class="chip">ohne Buch</span></div></div>')
    baum = ('<div class="feld"><div class="t">Aus dem Buch · Variantenbaum</div><div class="zeilenkarte">'
            '<div class="zk"><b class="gold" style="width:44px">1. e4</b><span>e5 · c5 · e6 · c6</span><span class="leise klein" style="margin-left:auto">›</span></div>'
            '<div class="zk"><b class="gold" style="width:44px">1. d4</b><span>d5 · Sf6</span><span class="leise klein" style="margin-left:auto">›</span></div>'
            '<div class="zk" style="background:#16253d"><span style="flex:1">Italienische Partie<div class="leise" style="font-size:12.5px">Hauptvariante: 1. e4 e5 2. Sf3 Sc6 3. Lc4</div></span>' + ic("haken", 18, "#e3bf4a") + '</div></div></div>')
    praxis = ('<div class="feld"><div class="t">Eröffnungen nach Spielstärke (Lichess)</div><div class="zeilenkarte">'
              '<div class="zk"><span class="leise" style="font-size:13px">von</span><b>600</b><span class="leise" style="font-size:13px">bis</span><b>800</b></div>'
              '<div class="zk"><span style="flex:1">Italienische Partie <span class="leise">· 14 %</span></span><span class="leise klein">Varianten (6) ›</span></div>'
              '<div class="zk"><span style="flex:1">Sizilianisch <span class="leise">· 9 %</span></span><span class="leise klein">Buch 2.6 ›</span></div>'
              '<div class="zk"><span style="flex:1">Gambits <span class="leise">· Königsgambit, Evans …</span></span><span class="leise klein">›</span></div></div>'
              '<div class="leise" style="font-size:12px;margin-top:6px">Quelle: Lichess-Datenbank, September 2026 (CC0).</div></div>')
    bot = (f'<div class="feld"><div class="zeilenkarte"><div class="zk"><span style="flex:1">Bot mit festen Eröffnungen: Hinweis und „Eröffnung des Bots überschreiben“</span>{schalter(False)}</div></div></div>')
    return arten + baum + praxis + bot


def stellung_inhalt():
    editor = (f'<div class="feld"><div class="t">Stellung aufbauen</div><div style="display:flex;gap:12px">'
              f'{fenbrett("4k3/8/8/8/8/8/8/4K3 w - - 0 1", 150)}<div style="flex:1;display:flex;flex-direction:column;gap:6px">'
              f'<div class="chipreihe">' + "".join(f'<span class="chip" style="min-height:34px;padding:0 6px">{figur(c, 22)}</span>' for c in ["wK", "wQ", "wR", "wB", "wN", "wP", "bK", "bQ"]) + '</div>'
              f'<div class="leise" style="font-size:12.5px">Am Zug: Weiß · Grundstellung · Brett leeren · Feld räumen</div></div></div></div>')
    fen = ('<div class="feld"><div class="t">Eigene Stellung (FEN)</div><div style="height:46px;border-radius:10px;border:1.5px solid #4b5d7c;display:flex;align-items:center;padding:0 12px;color:#7d8aa0;font-size:14px">rnbqkbnr/pppp1ppp/8/4p3/…</div>'
           '<span class="knopf rahmen" style="width:100%;margin-top:8px;min-height:44px">Stellung übernehmen</span>'
           '<div class="leise" style="font-size:12.5px;margin-top:6px">Aus einer Abbildung steht die Stellung oben: „Aus der Stellung von Abb. 1.26“.</div></div>')
    return editor + fen


def spielstaerke_kacheln():
    k = "".join(f'<div style="flex:1;background:#16253d;border-radius:12px;padding:8px;text-align:center">{ic(i, 18, "#e3bf4a")}<div class="serif" style="font-size:22px">{z}</div>'
                f'<div class="leise" style="font-size:11.5px">{s}</div></div>' for i, z, s in [("blitz", "–", "Blitz"), ("uhr", "640", "Schnell · 560–720"), ("timer", "–", "Klassisch")])
    return (f'<div class="karte" style="padding:12px"><div class="zeile" style="justify-content:space-between"><b>Deine Spielstärke</b>'
            f'<span class="leise klein">Lichess | chess.com | FIDE {ic("frage", 15)}</span></div><div style="display:flex;gap:8px;margin-top:8px">{k}</div></div>')


def laufend_banner():
    return (f'<div class="karte" style="display:flex;gap:12px;align-items:center;padding:10px 12px;border-color:#e3bf4a">{fenbrett("r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R", 44, schatten=False)}'
            f'<div style="flex:1"><b>Partie läuft</b> {tipp("nur wenn eine läuft")}<div class="leise klein">gegen Derya · 10 + 0</div></div><span class="knopf" style="min-height:44px;padding:0 14px;font-size:15px">Fortsetzen</span></div>')


def rivale(kompakt=True):
    return (f'<div class="karte" style="display:flex;gap:12px;align-items:center;padding:10px 12px">{gegner("max", 46)}'
            f'<div style="flex:1;min-width:0"><b>Rivale Tom</b><div class="leise" style="font-size:13px">„Ich greife an, du verteidigst. Bereit?“ · Duell 0 : 0</div>'
            f'<div class="leise" style="font-size:13px;margin-top:2px;text-decoration:underline">Anderer Rivale</div></div>'
            f'<span class="knopf rahmen" style="min-height:44px;padding:0 12px;font-size:14.5px">Fordern</span></div>')
