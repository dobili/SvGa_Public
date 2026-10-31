"""F voll: die drei Entwürfe für die Auswertung als ganze Partieseite nach dem Ende, mit allen Blättern."""
from voll import *
from f_auswertung import verlauf, phasenlabels, zugchips, MOMENT_FEN, ZUEGE

CSS_F = CSS_VOLL + """
.sek{font-size:12px;letter-spacing:.1em;font-weight:700;color:var(--leise);text-transform:uppercase}
.pill{display:inline-flex;align-items:center;gap:6px;border-radius:99px;padding:3px 10px 3px 4px;font-size:13.5px;font-weight:600;background:#22365a}
.uhr{display:flex;align-items:center;gap:10px;margin:6px 16px 0;min-height:44px;padding:0 12px;border-radius:12px;background:var(--karte);border:1px solid var(--rand)}
.zugleiste{margin:8px 16px 0;background:var(--karte);border:1px solid var(--rand);border-radius:14px;padding:8px 10px}
.nav{display:flex;justify-content:space-between;margin-top:6px}
.nav span{width:56px;height:44px;border-radius:10px;border:1.5px solid #3e5070;display:flex;align-items:center;justify-content:center}
.schalt{display:flex;gap:16px;justify-content:flex-end;margin:6px 16px 0;font-size:12.5px;color:var(--leise)}
.schalt span{display:flex;flex-direction:column;align-items:center;gap:2px;min-width:44px}
.rb{margin:10px 16px 0;background:var(--karte);border:1px solid var(--rand);border-radius:14px;padding:12px;font-size:14.5px}
"""
FINAL_FEN = "r2q1rk1/pb3ppp/1p3n2/2pQ4/2Pn4/2NB1N2/PP3PPP/R4RK1 b - - 0 18"


def kopf():
    return (f'<div style="padding:14px 16px 4px;display:flex;align-items:center;gap:10px"><span class="zurueck">{ic("links", 20)}Spielen</span>'
            f'<h1 style="font-size:21px;flex:1">Partie gegen Derya</h1>{ic("kompass", 24, "#c3c9d3")}</div>'
            f'<div class="leise" style="margin:0 16px;font-size:13px">Stufe 2 · du spielst Weiß · Eröffnung wie Menschen dieser Stärke</div>')


def zugleiste():
    zuege = [("16. Tad1", None), ("Sd4", None), ("17. Sxd4?", "#e38a2c"), ("cxd4", None), ("18. Dxb7??", "#d63a3a")]
    z = "".join(f'<span style="white-space:nowrap;padding:3px 6px;border-radius:6px;{"background:#e3bf4a;color:#16253d;font-weight:700" if i == 4 else ""}">{t}'
                + (f'<i style="display:inline-block;width:8px;height:8px;border-radius:50%;background:{c};margin-left:3px"></i>' if c else "") + '</span>' for i, (t, c) in enumerate(zuege))
    return (f'<div class="zugleiste"><div style="display:flex;gap:4px;align-items:center;overflow:hidden;font-size:14px">{z}<span style="margin-left:auto">{ic("runter", 18, "#c3c9d3")}</span></div>'
            f'<div class="nav"><span>|{ic("links", 18)}</span><span>{ic("links", 18)}</span><span>{ic("pfeil", 18)}</span><span>{ic("pfeil", 18)}|</span></div></div>'
            f'<div class="leise" style="font-size:11.5px;margin:3px 16px 0">Pfeil rechts oben: alle Züge zeigen · Zugzeichen und Phasen in der Liste</div>')


def uhr(name, zeit, weiss):
    return (f'<div class="uhr"><i style="width:14px;height:14px;border-radius:50%;background:{"#fff" if weiss else "#000"};border:1.5px solid #c3c9d3"></i>'
            f'<b style="flex:1">{name}</b><b style="font-size:19px">{zeit}</b></div>')


def brettblock(px=330):
    balken = ('<div style="width:14px;height:%dpx;border-radius:4px;overflow:hidden;background:#f5f0e6;display:flex;flex-direction:column;flex:none">'
              '<i style="height:58%%;background:#2b2f3a"></i><span style="font-size:9px;writing-mode:vertical-rl;color:#16253d;margin:4px auto 0;font-weight:700">−1,8</span></div>') % px
    f = (px - 20) / 8
    marke = f'<span style="position:absolute;left:{2*f-12:.0f}px;top:{f-10:.0f}px">{zugzeichen("??", "#d63a3a", 22)}</span>'
    brett = (f'<div style="display:flex;gap:6px;margin:8px 16px 0;align-items:stretch">{balken}<div style="position:relative">'
             f'{fenbrett(FINAL_FEN, px - 20, pfeile=[("f3", "d4", "#e3bf4a")], felder=[("d5", "#e3bf4a55"), ("b7", "#e3bf4a55")])}{marke}</div></div>')
    schalt = (f'<div class="schalt"><span>{ic("wiederholen", 20)}Drehen</span><span>{ic("lesezeichen", 20)}Merken</span><span>{ic("auge", 20)}Ruhig</span></div>')
    varianten = (f'<div style="display:flex;gap:8px;margin:8px 16px 0"><span class="knopf rahmen" style="flex:1;min-height:46px;font-size:15px">{ic("play", 16)}Besserer Zug</span>'
                 f'<span class="knopf rahmen" style="flex:1;min-height:46px;font-size:15px">{ic("play", 16)}Bestrafung</span></div>'
                 f'<div class="leise" style="font-size:11.5px;margin:3px 16px 0">spielt die Variante langsam ab · Anhalten · Zurück zur Ausgangsstellung · Zug vor/zurück in der Variante</div>')
    return brett + schalt + varianten


def rueckblickkarte():
    return (f'<div class="rb"><div class="zeile" style="justify-content:space-between;align-items:flex-start"><b>18. Dxb7??: Deine Gewinnchance fällt von 72 % auf 31 %.</b>{ic("frage", 18, "#7d8aa0")}</div>'
            f'<div class="leise" style="margin-top:2px">Bewertung +1,2 → −1,8.</div>'
            f'<div style="margin-top:8px;color:#f09080">Der Zug lässt den Springer d4 stehen: Er hängt danach mit Schach (Kapitel 1, Zählen).</div>'
            f'<div style="margin-top:8px">So wird der Fehler bestraft: <b>18… Sxf3+ 19. gxf3 Dg5+</b></div>'
            f'<div style="margin-top:4px">Besser war <b class="gold">18. Sxd4</b> danach etwa 18… cxd4 19. Dxd4</div>'
            f'<div class="leise" style="font-size:12.5px;margin-top:6px">Bei Theoriezügen: zutreffende Eröffnungen und Gambits · bei Phasenwechsel: „Neue Phase ab hier“</div></div>')


def ende_knoepfe(revanche=False):
    rv = f'<span class="knopf rahmen" style="flex:1">Revanche {neu()}</span>' if revanche else ""
    return (f'<div style="display:flex;gap:8px;margin:10px 16px 0"><span class="knopf" style="flex:1">{ic("plus", 18)}Neue Partie</span>{rv}</div>'
            f'<div class="leise" style="font-size:12.5px;margin:6px 16px 0">Aus einer eigenen Stellung zusätzlich: „Noch einmal aus derselben Stellung“.</div>')


def gruppenhinweis():
    return (f'<div class="karte" style="padding:10px 12px;border-style:dashed">{ic("stern", 18, "#e3bf4a")} <b>Gruppenmodus frei</b> {tipp("nur wenn gerade freigeschaltet")}'
            f'<div class="leise" style="font-size:13px">Glückwunsch-Meldung, wenn du mit diesem Sieg jeden Bot der Stufe besiegt hast.</div></div>')


def fortschritt():
    return (f'<div class="karte" style="padding:10px 12px">{tipp("nur während der Auswertung")}<div style="margin-top:6px;font-size:14px">Die Engine wertet die Partie aus …</div>'
            f'<div style="height:6px;border-radius:3px;background:#2c3d5a;margin-top:6px;overflow:hidden"><i style="display:block;height:100%;width:60%;background:#e3bf4a"></i></div></div>')


def seitenwahl():
    return ('<div style="display:flex;margin:12px 16px 0;background:#16253d;border:1px solid var(--rand);border-radius:12px;padding:3px">'
            '<span style="flex:1;min-height:42px;display:flex;align-items:center;justify-content:center;border-radius:9px;background:var(--karte);font-weight:600;box-shadow:0 0 0 1px #3e5070">Weiß (du)</span>'
            '<span style="flex:1;min-height:42px;display:flex;align-items:center;justify-content:center;color:var(--leise);font-weight:600">Schwarz (Derya)</span></div>')


def kurve_karte(titel="Verlauf"):
    return (f'<div class="karte"><div class="zeile" style="justify-content:space-between"><span class="sek">{titel}</span><span class="leise klein">Ganze Partie | Ausschnitt</span></div>'
            f'<div style="margin-top:10px">{verlauf()}</div>{phasenlabels()}<div class="leise" style="font-size:12px;margin-top:4px">Punkte: Fehler · Tipp auf die Linie springt zum Zug</div></div>')


def abweichung():
    return (f'<div class="karte"><div class="sek">Erste klare Abweichung</div><div style="font-size:15px;margin-top:6px">17. Sxd4? – die Gewinnchance von Weiß fällt von 74 % auf 72 %. Besser war 17. Lxf6.</div>'
            f'<span class="knopf rahmen" style="min-height:44px;margin-top:10px;font-size:15px">Zur Stellung</span>'
            f'<div class="leise" style="font-size:12px;margin-top:6px">Ohne Abweichung: „Keine klare Abweichung von der besten Fortsetzung. Gut gespielt!“</div></div>')


def fehlerliste(offen=True):
    z = [("?", "#e38a2c", "17. Sxd4?"), ("??", "#d63a3a", "18. Dxb7??"), ("ic:kreuz", "#d65a4a", "24. Te1")]
    inhalt = "".join(f'<div class="zk">{zugzeichen(a, c, 22)}<span style="flex:1">{t}</span><span class="leise klein">Zeigen</span></div>' for a, c, t in z) if offen else ""
    return f'<div class="feld"><div class="zeilenkarte"><div class="zk"><b style="flex:1">Fehler und Patzer</b><span class="pill" style="padding:2px 8px">3</span>{ic("runter", 18, "#c3c9d3")}</div>{inhalt}</div></div>'


def enginefehler():
    return (f'<div class="feld"><div class="zeilenkarte"><div class="zk"><b style="flex:1">Absichtliche Fehler der Engine</b><span class="pill" style="padding:2px 8px">2</span>{ic("runter", 18, "#c3c9d3")}</div>'
            f'<div class="zk"><span style="flex:1">Mit 12… Sd7 hat die Engine eine Figur ungedeckt gelassen.</span><span class="leise klein">Zeigen</span></div>'
            f'<div class="zk"><span style="flex:1">Mit 23… h6 hat sie einen Bauernzug ohne Not gemacht.</span><span class="leise klein">Zeigen</span></div></div></div>')


def spielstaerke(kompakt=False):
    phasen = [("buch", "Eröffnung", 86, "1350"), ("schwerter", "Mittelspiel", 71, "620"), ("flagge", "Endspiel", 84, "–"), ("plan", "Strategie", 79, ""), ("blitz", "Taktik", 68, "")]
    zeilen = "".join(f'<div style="margin-top:8px"><div class="zeile" style="gap:8px;font-size:14px">{ic(i, 16, "#c3c9d3")}<span style="flex:1">{n}</span><b>{v} %{" · " + s if s and s != "–" else ""}</b></div>'
                     f'<div style="height:6px;border-radius:3px;background:#2c3d5a;margin-top:4px;overflow:hidden"><i style="display:block;height:100%;width:{(v-50)*2}%;background:#e3bf4a"></i></div></div>' for i, n, v, s in phasen)
    return (f'<div class="karte"><div class="zeile" style="justify-content:space-between"><span class="sek">Spielstärke</span>{ic("frage", 18, "#7d8aa0")}</div>'
            f'<div class="zeile" style="gap:14px;margin-top:10px">{ring(.78, 76, 7, innen="<b style=font-size:19px>78 %</b>")}'
            f'<div><b style="font-size:16px">Ordentlich gespielt</b><div style="font-size:14px">Genauigkeit 78 %</div><div style="font-size:14px">Geschätzte Spielstärke etwa 650 <span class="leise">(Spanne 520 bis 780)</span></div>'
            f'<div class="leise" style="font-size:13px">Derya steht sonst bei etwa 480.</div></div></div>{zeilen}'
            f'<div class="leise" style="display:flex;justify-content:space-between;font-size:11.5px;margin-top:4px"><span>50 %</span><span>75 %</span><span>100 %</span></div></div>')


def zugarten_voll():
    zeilen = "".join(f'<div class="zk" style="min-height:40px">{zugzeichen(z, f, 22)}<span style="flex:1">{n}</span><b>{ZUEGE[n]}</b><span class="leise" style="font-size:12.5px;width:96px;text-align:right">{"üblich 2" if n in ("Fehler","Patzer","Ungenau") else ""}</span></div>' for z, n, f in ZUGKLASSEN)
    return (f'<div class="feld"><div class="zeilenkarte"><div class="zk"><b style="flex:1">Deine Züge, alle 10 Arten</b>{ic("frage", 18, "#7d8aa0")}</div>{zeilen}</div>'
            f'<div class="leise" style="font-size:12px;margin-top:6px">Vergleich mit dem Üblichen ab 15 eigenen Zügen.</div></div>')


def merken_blatt(wo="„Merken“ neben dem Brett"):
    return blatt("Merken", wo,
                 f'<div class="feld"><div class="t">Wohin?</div><div class="chipreihe"><span class="chip an">Fehlerdatenbank</span><span class="chip">Lernsammlung</span></div></div>'
                 f'<div class="feld"><div style="background:#16253d;border-radius:12px;padding:10px;font-size:14px">Aus meiner Partie, Stellung nach 18. Dxb7. Besser war 18. Sxd4.</div>'
                 f'<span class="knopf" style="width:100%;margin-top:10px">Merken</span></div>')


def teilen_blatt(wo):
    return blatt("Teilen", wo, f'<div class="feld"><div class="zeilenkarte"><div class="zk">{ic("liste", 20, "#e3bf4a")}PGN kopieren</div><div class="zk">{ic("plus", 20, "#e3bf4a")}PGN als Datei sichern</div></div></div>')


def teilknopf():
    return ('<span style="width:52px;height:52px;border-radius:12px;border:1.5px solid #4b5d7c;display:flex;align-items:center;justify-content:center;flex:none" aria-label="Teilen (PGN)">'
            '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M7 8l5-5 5 5M5 14v5h14v-5"/></svg></span>')


def brettteil():
    return zugleiste() + uhr("Derya", "4:12", False) + brettblock() + uhr("Du", "6:40", True) + rueckblickkarte()


# ---------------- F1 ----------------
def f1():
    erg = (f'<div class="karte" style="background:linear-gradient(150deg,#26395c,#1b2b45 65%)"><div class="zeile" style="gap:12px">{gegner("selin", 48)}'
           f'<div style="flex:1"><div class="serif" style="font-size:26px;line-height:1">Gewonnen</div><div class="leise klein" style="margin-top:4px">Matt im 29. Zug · gegen Derya</div></div>'
           f'{ring(.78, 62, 6, innen="<b style=font-size:16px>78</b><span style=font-size:10px> %</span>")}</div>'
           f'<div style="display:flex;gap:8px;margin-top:12px"><span class="knopf" style="flex:1">{ic("plus", 18)}Neue Partie</span>{teilknopf()}</div>'
           f'<div class="leise" style="font-size:12px;margin-top:6px">Aus eigener Stellung zusätzlich „Noch einmal aus derselben Stellung“.</div></div>')
    moment = (f'<div class="karte"><div class="sek">Der wichtigste Moment</div><div style="display:flex;gap:12px;margin-top:10px">{fenbrett(MOMENT_FEN, 128)}'
              f'<div style="font-size:14.5px"><div class="zeile" style="gap:6px">{zugzeichen("??", "#d63a3a", 22)}<b class="serif" style="font-size:19px">18. Dxb7</b></div>'
              f'<div style="margin-top:6px">72 % → 31 %. Besser war <b class="gold">18. Sxd4</b>.</div></div></div>'
              f'<span class="knopf rahmen" style="width:100%;min-height:44px;margin-top:10px;font-size:15px">Zur Stellung</span>'
              f'<div class="zeile" style="gap:8px;margin-top:12px;border-top:1px solid #2c3d5a;padding-top:10px;font-size:14px">{zugzeichen("?", "#e38a2c", 20)}<span style="flex:1">Erste klare Abweichung: <b>17. Sxd4?</b> (74 % → 72 %), besser 17. Lxf6</span><span class="leise klein">Zur Stellung</span></div>'
              f'<div class="leise" style="font-size:12px;margin-top:6px">Ohne Abweichung: „Keine klare Abweichung … Gut gespielt!“</div></div>')
    zuege = (f'<div class="karte"><div class="zeile" style="justify-content:space-between;margin-bottom:10px"><span class="sek">Deine Züge</span><span class="leise klein">alle 10 Arten ›</span></div>{zugchips()}</div>')
    seite_ = (kopf() + erg + brettteil() + gruppenhinweis() + fortschritt()
              + '<div style="margin:22px 16px 0"><h2>Auswertung</h2></div>' + seitenwahl() + moment + spielstaerke() + kurve_karte() + fehlerliste() + enginefehler() + zuege)
    blaetter = (blatt("Deine Züge", "„alle 10 Arten ›“ in „Deine Züge“", zugarten_voll(), art="Aufgeklappt")
                + teilen_blatt("Teilen-Knopf neben „Neue Partie“") + merken_blatt())
    schreibe("f1-voll", seite("F1 voll", seite_ + blaetter + '<div style="height:20px"></div>', CSS_F))


# ---------------- F2 ----------------
def f2():
    css = CSS_F + """
.zeit{position:relative;margin:6px 16px 0;padding-left:30px}
.zeit:before{content:'';position:absolute;left:10px;top:8px;bottom:30px;width:3px;border-radius:2px;background:linear-gradient(#7fb5ae 0,#7fb5ae 18%,#e3bf4a 18%,#e3bf4a 50%,#d63a3a 50%,#d63a3a 60%,#e3bf4a 60%)}
.ereignis{position:relative;background:var(--karte);border:1px solid var(--rand);border-radius:14px;padding:12px;margin-bottom:12px}
.ereignis .punkt{position:absolute;left:-28px;top:16px}
.ereignis .zug{font-family:'Source Serif 4',Georgia,serif;font-size:19px}
.phase{font-size:11.5px;letter-spacing:.12em;font-weight:700;color:var(--gold);margin:14px 0 8px -30px;padding-left:30px;text-transform:uppercase}
"""
    kopfzeile = (f'<div class="karte" style="display:flex;gap:12px;align-items:center;padding:12px 14px">{gegner("selin", 44)}'
                 f'<div style="flex:1"><b class="serif" style="font-size:21px">Gewonnen</b><div class="leise klein">gegen Derya · Matt im 29. Zug</div></div>'
                 f'<div style="text-align:right"><b style="font-size:20px">78 %</b><div class="leise" style="font-size:12px">genau</div></div></div>')
    def ereignis(zeichen, farbe, zug, text, brett=None, extra=""):
        b = f'<div>{brett}</div>' if brett else ""
        return (f'<div class="ereignis"><span class="punkt">{zugzeichen(zeichen, farbe, 22)}</span><div style="display:flex;gap:10px">'
                f'<div style="flex:1;min-width:0"><div class="zug">{zug}</div><div style="font-size:14.5px;margin-top:4px">{text}</div>{extra}</div>{b}</div></div>')

    zeige = '<div style="display:flex;gap:6px;margin-top:8px"><span class="chip" style="min-height:40px;font-size:13.5px">Zur Stellung</span></div>'
    zeit = ('<div class="zeit"><div class="phase">Eröffnung · Zug 1 bis 9 · 86 %</div>'
            + ereignis("ic:buch", "#a5835a", "Italienische Partie", "4 Theoriezüge, dann eigene. Alle drei Eröffnungsziele erreicht.")
            + '<div class="phase">Mittelspiel · Zug 10 bis 24 · 71 %</div>'
            + ereignis("!", "#5b8fc9", "13. Lxf7+", "Derya ließ f7 ungedeckt, und du hast es gesehen. <span class='leise'>(Absichtlicher Fehler der Engine: 12… Sd7)</span>",
                       fenbrett("r2q1rk1/pb3Bpp/1p3n2/2p5/2Pn4/2N2N2/PP1Q1PPP/R4RK1 b - - 0 13", 84, pfeile=[("c4", "f7", "#5b8fc9")]), zeige)
            + ereignis("?", "#e38a2c", "17. Sxd4?", "<b>Erste klare Abweichung</b>: 74 % → 72 %. Besser war 17. Lxf6.", None, zeige)
            + ereignis("??", "#d63a3a", "18. Dxb7", "72 % → 31 %. Besser war <b class=gold>18. Sxd4</b>.", fenbrett(MOMENT_FEN, 84, pfeile=[("d5", "b7", "#d63a3a"), ("f3", "d4", "#e3bf4a")]), zeige)
            + ereignis("ic:kreuz", "#d65a4a", "24. Te1", "Verpasst: 24. Dh5 hätte sofort gewonnen. <span class='leise'>(Absichtlicher Fehler der Engine: 23… h6)</span>", None, zeige)
            + '<div class="phase">Endspiel · Zug 25 bis 29 · 84 %</div>'
            + ereignis("ic:stern", "#5fa64a", "29. Dg7#", "Matt. Die letzten fünf Züge waren alle die besten.")
            + '</div>')
    unten = (f'<div style="margin:18px 16px 0"><h2>In Zahlen</h2></div>' + seitenwahl() + spielstaerke() + zugarten_voll()
             + f'<div style="display:flex;gap:8px;margin:14px 16px 0"><span class="knopf" style="flex:1">Neue Partie</span><span class="knopf rahmen" style="flex:1">Teilen</span></div>'
             f'<div class="leise" style="font-size:12.5px;margin:6px 16px 0">Aus eigener Stellung zusätzlich „Noch einmal aus derselben Stellung“.</div>')
    seite_ = (kopf() + kopfzeile + brettteil() + gruppenhinweis() + fortschritt()
              + '<div style="margin:22px 16px 6px"><h2>Die Partie in Momenten</h2><div class="leise klein">Jeder Moment springt aufs Brett oben. Seite: deine Züge | Deryas Züge.</div></div>'
              + f'<div style="margin:2px 16px 6px">{verlauf(358, 70, True, True)}<div class="leise" style="font-size:12px;margin-top:4px">Ganze Partie | Ausschnitt · Tipp auf die Linie springt</div></div>'
              + zeit + unten)
    blaetter = teilen_blatt("„Teilen“ unten") + merken_blatt()
    schreibe("f2-voll", seite("F2 voll", seite_ + blaetter + '<div style="height:20px"></div>', css))


# ---------------- F3 ----------------
def f3():
    css = CSS_F + """
.lern{border-radius:16px;margin:12px 16px;padding:14px;border:1px solid var(--rand);background:var(--karte)}
.lern .kz{display:flex;gap:10px;align-items:center;margin-bottom:8px}
"""
    kopfzeile = (f'<div style="padding:8px 16px 0"><div class="zeile" style="gap:12px">{gegner("selin", 48)}<div><div class="serif" style="font-size:26px;line-height:1.05">Gewonnen!</div>'
                 f'<div class="leise klein">gegen Derya · Matt im 29. Zug · 78 % genau</div></div></div></div>')
    gut = (f'<div class="lern" style="border-left:5px solid #5fa64a"><div class="kz">{zugzeichen("!", "#5b8fc9", 26)}<b>Das war stark</b></div>'
           f'<div style="font-size:15px"><b>13. Lxf7+</b> – f7 war nur vom König gedeckt (Kapitel 1, Angriffsregel).</div><span class="chip" style="min-height:40px;font-size:13.5px;margin-top:8px">Zur Stellung</span></div>')
    schlecht = (f'<div class="lern" style="border-left:5px solid #d63a3a"><div class="kz">{zugzeichen("??", "#d63a3a", 26)}<b>Hier ging es schief</b></div>'
                f'<div style="display:flex;gap:12px">{fenbrett(MOMENT_FEN, 124)}<div style="font-size:15px"><b>18. Dxb7??</b> holte einen Bauern, aber Sxd4 war nötig.<div class="leise klein" style="margin-top:6px">72 % → 31 %</div></div></div>'
                f'<span class="knopf" style="width:100%;margin-top:12px">{ic("puzzle", 20)}Finde den besseren Zug {neu()}</span>'
                f'<div class="zeile" style="justify-content:center;gap:8px;margin-top:6px;min-height:44px;color:var(--leise);font-size:14.5px">{ic("lesezeichen", 16)}Merken (Fehlerdatenbank oder Lernsammlung)</div></div>')
    ueben = (f'<div class="lern" style="border-left:5px solid #e3bf4a"><div class="kz">{ic("ziel", 26, "#e3bf4a")}<b>Übe das als Nächstes {neu()}</b></div>'
             f'<div style="font-size:15px">Zweimal hast du eine hängende Figur übersehen. Der Zähltrainer übt genau das.</div>'
             f'<span class="knopf rahmen" style="width:100%;margin-top:12px">Zähltrainer: 8 Aufgaben</span></div>')
    zahlen = (f'<div class="karte" style="padding:6px 16px"><div class="zeile" style="justify-content:space-between;min-height:48px"><b>Alle Zahlen</b>'
              f'<span class="leise klein">aufgeklappt unten {ic("runter", 16)}</span></div></div>')
    knoepfe = (f'<div style="display:flex;gap:8px;margin:10px 16px 0"><span class="knopf" style="flex:1">Revanche {neu()}</span><span class="knopf rahmen" style="flex:1">Neue Partie</span>{teilknopf()}</div>'
               f'<div class="leise" style="font-size:12.5px;margin:6px 16px 0">Aus eigener Stellung zusätzlich „Noch einmal aus derselben Stellung“.</div>')
    seite_ = (kopf() + kopfzeile + '<div style="margin:16px 16px 0"><h2>Drei Dinge aus dieser Partie</h2></div>' + gut + schlecht + ueben + zahlen + knoepfe
              + '<div style="margin:22px 16px 0"><h2>Nachspielen</h2></div>' + brettteil() + gruppenhinweis() + fortschritt())
    alle = (seitenwahl() + spielstaerke() + kurve_karte() + abweichung() + fehlerliste() + enginefehler() + zugarten_voll())
    blaetter = (blatt("Alle Zahlen", "„Alle Zahlen“ (klappt auf der Seite auf)", alle, art="Aufgeklappt")
                + teilen_blatt("Teilen-Knopf neben „Neue Partie“") + merken_blatt("„Merken“ neben dem Brett oder in „Hier ging es schief“"))
    schreibe("f3-voll", seite("F3 voll", seite_ + blaetter + '<div style="height:20px"></div>', css))


if __name__ == "__main__":
    f1(); f2(); f3()
