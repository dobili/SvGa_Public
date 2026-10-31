"""A: Startkarten im Buch-Bereich („Dein nächster Schritt“ und „Deine Woche“)."""
from gemeinsam import *

CSS_A = """
.handy{position:relative;height:844px;overflow:hidden;border-bottom:1px dashed #3e5070}
.abb{display:flex;gap:10px;align-items:center}
.feld{flex:1;height:48px;border:1.5px solid #4b5d7c;border-radius:10px;padding:0 14px;display:flex;align-items:center;color:#7d8aa0}
.kap{display:flex;align-items:center;gap:14px;background:var(--karte);border:1px solid var(--rand);border-radius:14px;margin:8px 16px;padding:12px 14px;min-height:60px}
.kap .nr{width:36px;height:36px;border-radius:50%;border:2px solid #6e7f9c;display:flex;align-items:center;justify-content:center;font-weight:700;flex:none;font-size:15px}
.kap b{font-weight:600;font-size:16px;display:block} .kap small{color:var(--leise);font-size:13px}
.zustand{margin:4px 16px 0;color:var(--leise);font-size:13px;letter-spacing:.06em;text-transform:uppercase;font-weight:700}
"""


def kopf():
    return f'<div class="kopf"><div><div class="marke">Schach von Grund auf</div><h1 style="font-size:34px">Buch</h1></div>{ic("kompass", 28, "#c3c9d3")}</div>'


def buchinhalt():
    k = "".join(f'<div class="kap"><span class="nr">{n}</span><span style="flex:1"><b>{t}</b><small>Kapitel {n} · {a} Abbildungen</small></span>{ic("pfeil", 20, "#c3c9d3")}</div>'
                for n, t, a in KAPITEL[:8])
    return (f'<div class="karte" style="padding:14px 16px"><div style="font-weight:700;margin-bottom:10px">Abbildung öffnen</div>'
            f'<div class="abb"><span class="feld">z. B. 1.26</span><span class="knopf" style="min-width:96px">Öffnen</span></div></div>'
            f'<div style="margin:0 16px 4px;display:flex;align-items:center;gap:8px;color:var(--leise);font-size:15px;min-height:44px">{ic("route", 20)} Als Weg anzeigen</div>{k}')


def wochenring(anteil, text, px=60):
    innen = f'<span class="serif" style="font-size:{px*0.3:.0f}px">{text}</span>'
    return ring(anteil, px, 6, innen=innen)


# ---------------- A1: Eine schmale Leiste ----------------
def a1():
    css = CSS_A + """
.leiste1{display:flex;align-items:center;gap:12px;background:var(--karte);border:1px solid var(--rand);border-radius:16px;margin:12px 16px 0;padding:12px 12px 12px 14px}
.los{width:56px;height:56px;border-radius:50%;background:var(--creme);color:#13203a;display:flex;align-items:center;justify-content:center;flex:none}
.oder{display:flex;gap:8px;margin:10px 16px 6px;overflow:hidden}
.oder .chip{font-size:14px;padding:0 12px;border-color:#33456a;color:var(--leise)}
"""
    def streifen(ring_html, unter="etwa 6 Minuten"):
        return (f'<div class="leiste1">{ring_html}'
                f'<div style="flex:1;min-width:0"><div class="leise" style="font-size:12px;letter-spacing:.08em;font-weight:700;text-transform:uppercase">Dein nächster Schritt</div>'
                f'<div style="font-size:19px;font-weight:700;margin-top:2px">9 Wiederholungen</div>'
                f'<div class="leise klein">{unter}</div></div>'
                f'<span class="los" aria-label="Wiederholen">{ic("play", 24)}</span></div>')
    oder = (f'<div class="oder"><span class="chip">{ic("puzzle", 18)}Tagesaufgabe</span>'
            f'<span class="chip">{ic("hantel", 18)}Übung Kap. 0</span><span class="chip" style="padding:0;width:44px;justify-content:center" aria-label="Nicht jetzt">{ic("kreuz", 18)}</span></div>')
    handy = (f'<div class="handy">{kopf()}{streifen(wochenring(.75, "3/4", 58))}{oder}{buchinhalt()}{leiste("Buch")}</div>')
    ohne_ring = ring(0, 58, 2.5, grund="#6e7f9c", strich=True, innen=f'{ic("plus", 22, "#e3bf4a")}')
    ohne = (f'<div class="notiz">Ein Tipp auf den Ring öffnet die Woche (Aufträge, Plan, Ziele) als eigene Seite. '
            f'So sieht die Leiste <b>ohne Wochenziel</b> aus:</div>'
            f'{streifen(ohne_ring, "etwa 6 Min · Ziel festlegen")}'
            f'<div class="karte" style="margin-top:10px"><div style="font-weight:700;margin-bottom:10px">Wie oft pro Woche üben?</div>'
            f'<div style="display:flex;gap:8px">' + "".join(f'<span class="chip" style="width:52px;justify-content:center;padding:0">{d}</span>' for d in [2, 3, 4, 5, 7]) +
            f'</div><div class="leise klein" style="margin-top:8px">Tage. Jederzeit änderbar.</div></div><div style="height:12px"></div>')
    schreibe("a1", seite("A1 Schmale Leiste", handy + ohne, css))


# ---------------- A2: Tagesplan mit Wochenkette ----------------
def a2():
    css = CSS_A + """
.kette{display:flex;justify-content:space-between;align-items:center;position:relative;margin:12px 2px 4px}
.kette:before{content:'';position:absolute;left:18px;right:18px;top:17px;height:2px;background:#33456a}
.tag{position:relative;display:flex;flex-direction:column;align-items:center;gap:4px;font-size:12px;color:var(--leise);width:38px}
.tag i{width:36px;height:36px;border-radius:50%;background:#22365a;border:2px solid #33456a;display:flex;align-items:center;justify-content:center;font-style:normal}
.tag.ja i{background:var(--gold);border-color:var(--gold);color:#13203a}
.tag.heute i{border-color:var(--gold);box-shadow:0 0 0 4px rgba(227,191,74,.22);background:#1b2b45}
.tag.heute{color:var(--text);font-weight:700}
.haupt{display:flex;align-items:center;gap:14px;background:var(--creme);color:#13203a;border-radius:14px;padding:14px;margin-top:14px;min-height:72px}
.haupt .ikon{width:44px;height:44px;border-radius:12px;background:#13203a;color:var(--gold);display:flex;align-items:center;justify-content:center;flex:none}
.zwei{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px}
.neben{border:1.5px solid #3e5070;border-radius:14px;padding:12px;min-height:64px;display:flex;gap:10px;align-items:center}
.neben b{display:block;font-size:15px} .neben small{color:var(--leise);font-size:13px}
.auftrag{display:flex;align-items:center;gap:10px;font-size:14px;color:var(--leise);margin-top:6px}
.auftrag .b{flex:1;height:6px;border-radius:3px;background:#2c3d5a;overflow:hidden} .auftrag .b i{display:block;height:100%;background:var(--gold)}
"""
    tage = [("Mo", "ja"), ("Di", "ja"), ("Mi", ""), ("Do", "ja"), ("Fr", "heute"), ("Sa", ""), ("So", "")]
    kette = '<div class="kette">' + "".join(
        f'<div class="tag {c}"><i>{ic("haken", 18, None, 3) if c == "ja" else ""}</i>{t}</div>' for t, c in tage) + '</div>'
    def karte(kopfzeile, kette_html):
        return (f'<div class="karte" style="padding:16px 16px 14px">{kopfzeile}{kette_html}'
                f'<div class="haupt"><span class="ikon">{ic("wiederholen", 24)}</span><span style="flex:1"><b style="font-size:18px">Wiederholen</b>'
                f'<div style="font-size:14px;opacity:.8">9 Stellungen · etwa 6 Min</div></span>{ic("play", 22)}</div>'
                f'<div class="zwei"><div class="neben">{ic("puzzle", 24, "#e3bf4a")}<span><b>Tagesaufgabe</b><small>1 Stellung</small></span></div>'
                f'<div class="neben">{ic("hantel", 24, "#e3bf4a")}<span><b>Übung</b><small>Kapitel 0</small></span></div></div></div>')
    kz = (f'<div style="display:flex;justify-content:space-between;align-items:baseline"><h2>Heute</h2>'
          f'<span class="zeile" style="gap:6px;font-size:14px;color:var(--leise)">{ic("flamme", 18, "#e3bf4a")}3 von 4 Tagen</span></div>')
    auftraege = (f'<div class="karte" style="padding:12px 16px"><div class="zeile" style="justify-content:space-between"><b style="font-size:15px">Aufträge dieser Woche</b><span class="leise klein">alle ›</span></div>'
                 f'<div class="auftrag">3 Partien<span class="b"><i style="width:33%"></i></span>1/3</div>'
                 f'<div class="auftrag">20 Abbildungen<span class="b"><i style="width:60%"></i></span>12/20</div></div>')
    handy = f'<div class="handy">{kopf()}{karte(kz, kette)}{auftraege}{buchinhalt()}{leiste("Buch")}</div>'
    kz2 = (f'<div style="display:flex;justify-content:space-between;align-items:baseline"><h2>Heute</h2><span class="leise klein">Wochenziel?</span></div>'
           f'<div style="display:flex;gap:8px;margin-top:10px;align-items:center"><span class="leise" style="font-size:14px;flex:1">Tage pro<br>Woche</span>'
           + "".join(f'<span class="chip" style="width:44px;justify-content:center;padding:0">{d}</span>' for d in [2, 3, 4, 5, 7]) + '</div>')
    ohne = (f'<div class="notiz">Die Wochenkette ersetzt den Ring. Gelernt ist ein Tag, sobald du etwas geübt hast. '
            f'<b>Ohne Wochenziel</b> steht oben nur eine Zeile mit den Tagen:</div>{karte(kz2, "")}<div style="height:12px"></div>')
    schreibe("a2", seite("A2 Tagesplan", handy + ohne, css))


# ---------------- A3: Zwei Kacheln nebeneinander ----------------
def a3():
    css = CSS_A + """
.paar{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:12px 16px 4px}
.kachel{background:var(--karte);border:1px solid var(--rand);border-radius:16px;padding:14px;display:flex;flex-direction:column;min-height:186px;position:relative}
.kachel .titel{font-size:12px;letter-spacing:.08em;text-transform:uppercase;font-weight:700;color:var(--leise)}
.kachel .mehr{position:absolute;top:6px;right:6px;width:44px;height:44px;display:flex;align-items:center;justify-content:center;color:var(--leise)}
.gross{font-family:'Source Serif 4',Georgia,serif;font-size:44px;line-height:1;font-weight:600}
.tage{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:8px}
.tage span{height:44px;border-radius:10px;border:1.5px solid #3e5070;display:flex;align-items:center;justify-content:center;font-weight:700}
"""
    links = (f'<div class="kachel"><span class="titel">Als Nächstes</span><span class="mehr">{ic("mehr", 22)}</span>'
             f'<div style="display:flex;align-items:baseline;gap:6px;margin-top:12px"><span class="gross">9</span><span style="font-weight:600">fällig</span></div>'
             f'<div class="leise klein" style="margin-top:2px">Wiederholungen · 6 Min</div>'
             f'<span class="knopf" style="margin-top:auto;min-height:44px;font-size:16px;padding:0 10px">{ic("wiederholen", 18)}Wiederholen</span></div>')
    rechts = (f'<div class="kachel" style="align-items:center"><span class="titel" style="align-self:flex-start">Deine Woche</span>'
              f'<div style="margin-top:10px">{ring(.75, 96, 8, innen='<span class="serif" style="font-size:28px">3/4</span><br><span class="leise" style="font-size:12px">Tage</span>')}</div>'
              f'<div class="leise klein" style="margin-top:auto;text-align:center">noch 1 Tag · <span class="gold">2 Aufträge</span></div></div>')
    handy = f'<div class="handy">{kopf()}<div class="paar">{links}{rechts}</div>{buchinhalt()}{leiste("Buch")}</div>'
    rechts2 = (f'<div class="kachel"><span class="titel">Deine Woche</span>'
               f'<div style="font-weight:700;margin-top:10px;font-size:15px">Wie oft üben?</div>'
               f'<div class="tage">' + "".join(f'<span>{d}</span>' for d in [2, 3, 4, 5, 7]) + '<span class="leise" style="font-weight:400;font-size:13px;border-style:dashed">Tage</span></div></div>')
    ohne = (f'<div class="notiz">Beide Kacheln öffnen ihre Einzelheiten: links die anderen Vorschläge (Tagesaufgabe, Übung, Nicht jetzt), '
            f'rechts Aufträge, Plan und Ziele. <b>Ohne Wochenziel</b> fragt die rechte Kachel nur nach den Tagen:</div>'
            f'<div class="paar">{links}{rechts2}</div><div style="height:12px"></div>')
    schreibe("a3", seite("A3 Zwei Kacheln", handy + ohne, css))


if __name__ == "__main__":
    a1(); a2(); a3()
