"""Entwürfe: drei für „Deine Wertung“, drei für „Deine Rekorde“ (Handybreite, dunkles Thema)."""
CSS = """
*{box-sizing:border-box} body{margin:0;background:#0f1b2e;color:#f5f0e6;font-family:'Source Sans 3',system-ui,sans-serif;width:390px;padding-bottom:12px}
h1{font-family:'Source Serif 4',Georgia,serif;font-size:22px;margin:0} h2{font-family:'Source Serif 4',Georgia,serif;font-size:19px;margin:0}
.kopf{padding:14px 16px 4px} .leise{color:#c3c9d3;font-size:14px} .klein{font-size:13px;color:#c3c9d3} .gold{color:#e3bf4a}
.karte{background:#1b2b45;border-radius:14px;margin:10px 12px;padding:14px;border:1px solid #2c3d5a}
.chip{display:inline-block;font-size:12px;padding:3px 9px;border-radius:99px;background:#2c3d5a;color:#f5f0e6}
.chip.an{background:#e3bf4a;color:#16253d;font-weight:600}
.chip.aus{background:transparent;border:1px dashed #4a5b78;color:#8a96a8}
.zahl{font-family:'Source Serif 4',Georgia,serif;font-size:46px;line-height:1;font-weight:700}
.balken{height:8px;border-radius:4px;background:#2c3d5a;overflow:hidden} .balken i{display:block;height:100%;background:linear-gradient(90deg,#c9a227,#f2d27a)}
.punkte{display:flex;gap:5px} .punkte i{width:12px;height:12px;border-radius:50%;background:#2c3d5a;display:block} .punkte i.v{background:#e3bf4a}
.knopf{display:inline-block;font-size:14px;padding:7px 14px;border-radius:99px;border:1px solid #e3bf4a;color:#e3bf4a}
.knopf.voll{background:#e3bf4a;color:#16253d;font-weight:600}
.icon{width:40px;height:40px;border-radius:12px;background:#2c3d5a;display:flex;align-items:center;justify-content:center;flex:none}
.icon svg{width:22px;height:22px;stroke:#e3bf4a;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.zeile{display:flex;gap:12px;align-items:center}
.schloss{opacity:.55}
"""
I = {  # schlichte Linienzeichen wie lucide
 "uhr": '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 "flamme": '<path d="M12 3c2 4 6 5 6 10a6 6 0 0 1-12 0c0-3 2-4 3-6 1 2 2 2 3 3 0-3 0-5 0-7z"/>',
 "ziel": '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1"/>',
 "kalender": '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
 "auge": '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
 "pokal": '<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 20h8"/>',
 "bot": '<rect x="5" y="8" width="14" height="11" rx="3"/><path d="M12 4v4M9 13h.01M15 13h.01"/>',
 "schild": '<path d="M12 3l7 3v6c0 5-3 8-7 9-4-1-7-4-7-9V6z"/>',
 "schloss": '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
}
def ic(n): return f'<span class="icon"><svg viewBox="0 0 24 24">{I[n]}</svg></span>'
def seite(t, inh, css=""): return f'<!doctype html><html lang="de"><head><meta charset="utf-8"><title>{t}</title><style>{CSS}{css}</style></head><body>{inh}</body></html>'
def kurve(w=330, h=70, pts=(0.2,0.35,0.55)):
    n=len(pts); xs=[10+i*(w-20)/(n-1) for i in range(n)]; ys=[h-10-p*(h-20) for p in pts]
    d=" ".join(f"{'M' if i==0 else 'L'}{x:.0f},{y:.0f}" for i,(x,y) in enumerate(zip(xs,ys)))
    dots="".join(f'<circle cx="{x:.0f}" cy="{y:.0f}" r="4" fill="#e3bf4a"/>' for x,y in zip(xs,ys))
    return f'<svg width="{w}" height="{h}"><path d="{d}" stroke="#e3bf4a" stroke-width="2.5" fill="none"/>{dots}</svg>'

# ---------- Wertung 1: Eine Zahl, Rest auf Wunsch ----------
def w1():
    inh=f"""<div class="kopf"><h1>Deine Spielstärke</h1></div>
    <div class="karte">
      <div style="display:flex;gap:6px;margin-bottom:14px"><span class="chip">Blitz</span><span class="chip an">Schnellschach</span><span class="chip aus">Klassisch</span></div>
      <div class="leise">So stark spielst du etwa</div>
      <div style="display:flex;align-items:baseline;gap:8px;margin:6px 0 2px"><span class="zahl">1310</span><span class="leise">wie bei chess.com</span></div>
      <div class="klein">Spanne 1170–1460 · noch ungenau</div>
      <div style="margin:14px 0 6px" class="leise">Noch <b class="gold">7 Partien</b>, dann wird die Zahl genauer</div>
      <div class="punkte">{'<i class="v"></i>'*3}{'<i></i>'*7}</div>
      <div style="margin-top:14px">{kurve()}</div>
      <div class="klein">+20 seit dem 26.10.</div>
      <div style="margin-top:12px;display:flex;gap:8px"><span class="knopf voll">Gewertet spielen</span><span class="knopf">Mehr Details</span></div>
    </div>
    <div class="karte schloss"><div class="zeile">{ic('schloss')}<div><b>Stärke je Phase</b><div class="klein">Ab 10 Partien siehst du, ob du in Eröffnung, Mittelspiel oder Endspiel stärker bist.</div></div></div></div>
    <div class="karte" style="font-size:13px;color:#c3c9d3">Klassisch: noch keine Partie mit langer Bedenkzeit (ab 30 Minuten). Aus deinem Schnellschach geschätzt: etwa 1460.</div>"""
    return seite("Wertung 1", inh)

# ---------- Wertung 2: Stufenleiter ----------
def w2():
    css=""".leiter{position:relative;margin:8px 0 0 8px;padding-left:22px;border-left:3px solid #2c3d5a}
    .sprosse{position:relative;padding:9px 0}
    .sprosse:before{content:'';position:absolute;left:-29px;top:14px;width:11px;height:11px;border-radius:50%;background:#2c3d5a}
    .sprosse.geschafft:before{background:#e3bf4a}
    .sprosse.hier{background:linear-gradient(90deg,rgba(227,191,74,.18),transparent);border-radius:10px;padding:10px;margin-left:-10px}
    .sprosse.hier:before{left:-19px;width:15px;height:15px;top:16px;background:#f2d27a;box-shadow:0 0 0 5px rgba(227,191,74,.25)}"""
    st=[("Stufe 6","um 1650","Pia, Jonas …",""),("Stufe 5","um 1500","Nächstes Ziel · noch etwa 140 Punkte","naechst"),
        ("Du","1310","Schnellschach · noch ungenau","hier"),("Stufe 4","um 1250","geschafft: Lotte, Ben","geschafft"),("Stufe 3","um 1050","geschafft","geschafft")]
    sp="".join(f'<div class="sprosse {c}"><b>{a}</b> <span class="gold">{b}</span><div class="klein">{d}</div></div>' for a,b,d,c in st)
    inh=f"""<div class="kopf"><h1>Deine Leiter</h1><div class="leise">Wo du stehst, gemessen an den Bots</div></div>
    <div class="karte"><div style="display:flex;gap:6px"><span class="chip">Blitz</span><span class="chip an">Schnellschach</span><span class="chip aus">Klassisch</span></div>
    <div class="leiter">{sp}</div>
    <div style="margin-top:12px;display:flex;gap:8px"><span class="knopf voll">Gegen Stufe 5 spielen</span></div></div>
    <div class="karte"><div class="zeile">{ic('ziel')}<div><b>Vergleich</b><div class="klein">etwa 1170–1460 bei chess.com · etwa 1660 bei Lichess</div></div></div></div>"""
    return seite("Wertung 2", inh, css)

# ---------- Wertung 3: Drei Kacheln ----------
def w3():
    css=""".kacheln{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin:10px 12px}
    .kachel{background:#1b2b45;border:1px solid #2c3d5a;border-radius:14px;padding:12px 8px;text-align:center}
    .kachel.an{border-color:#e3bf4a;box-shadow:0 0 0 1px #e3bf4a inset}
    .kachel .z{font-family:'Source Serif 4',Georgia,serif;font-size:26px;font-weight:700;margin:6px 0 2px}
    .ph{display:grid;grid-template-columns:90px 1fr 40px;gap:8px;align-items:center;margin-top:8px;font-size:14px}"""
    def ph(n,p,w,lock=False): return f'<div class="ph{" schloss" if lock else ""}"><span>{n}</span><div class="balken"><i style="width:{p}%"></i></div><span class="klein">{w}</span></div>'
    inh=f"""<div class="kopf"><h1>Deine Wertung</h1><div class="leise">Zahlen wie bei chess.com · ändern in den Einstellungen</div></div>
    <div class="kacheln">
      <div class="kachel"><div class="klein">Blitz</div><div class="z">1180</div><div class="klein">1 Partie</div></div>
      <div class="kachel an"><div class="klein">Schnell</div><div class="z">1310</div><div class="klein">3 Partien</div></div>
      <div class="kachel"><div class="klein">Klassisch</div><div class="z" style="color:#8a96a8">≈1460</div><div class="klein">geschätzt</div></div>
    </div>
    <div class="karte"><div style="display:flex;justify-content:space-between"><b>Schnellschach</b><span class="chip">vorläufig · 3 von 10</span></div>
      <div style="margin-top:8px">{kurve()}</div><div class="klein">26.10. bis 30.10. · +20</div></div>
    <div class="karte"><b>Nach Phasen</b><div class="klein">Ab 10 Partien genau; bis dahin nur ein Eindruck.</div>
      {ph('Eröffnung',55,'')}{ph('Mittelspiel',40,'')}{ph('Endspiel',30,'',True)}</div>"""
    return seite("Wertung 3", inh, css)

# ---------- Rekorde 1: Nur Erreichtes + Herausforderung ----------
def r1():
    css=""".trophae{display:flex;gap:12px;align-items:center;padding:12px 0;border-top:1px solid #2c3d5a}.trophae:first-of-type{border-top:0}
    .gross{font-family:'Source Serif 4',Georgia,serif;font-size:24px;font-weight:700}"""
    inh=f"""<div class="kopf"><h1>Deine Rekorde</h1><div class="leise">Hier zählst nur du gegen dich selbst.</div></div>
    <div class="karte">
      <div class="trophae">{ic('bot')}<div style="flex:1"><div class="klein">Stärkster besiegter Bot</div><div class="gross">1474</div><div class="klein">am 31.10. · Ben, Schnellschach</div></div><span class="chip">Teilen</span></div>
      <div class="trophae">{ic('kalender')}<div style="flex:1"><div class="klein">Lerntage in einer Woche</div><div class="gross">4 Tage</div><div class="klein">diese Woche · Rekord kann noch wachsen</div></div></div>
    </div>
    <div class="karte"><h2 style="font-size:17px">Stell deinen ersten Rekord auf</h2>
      <div class="zeile" style="margin-top:12px">{ic('uhr')}<div style="flex:1"><b>Taktik auf Zeit</b><div class="klein">Wie viele Aufgaben schaffst du in 3 Minuten?</div></div><span class="knopf">Los</span></div>
      <div class="zeile" style="margin-top:12px">{ic('auge')}<div style="flex:1"><b>Zug erraten</b><div class="klein">Triff die Züge einer Meisterpartie.</div></div><span class="knopf">Los</span></div>
      <div class="klein" style="margin-top:12px">Noch 4 weitere Rekorde warten · alle zeigen</div></div>"""
    return seite("Rekorde 1", inh, css)

# ---------- Rekorde 2: Kacheln ----------
def r2():
    css=""".raster{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:10px 12px}
    .rk{background:#1b2b45;border:1px solid #2c3d5a;border-radius:14px;padding:12px;min-height:118px}
    .rk .w{font-family:'Source Serif 4',Georgia,serif;font-size:26px;font-weight:700;margin-top:8px}
    .rk.offen{border-style:dashed;background:transparent} .rk.offen .w{color:#8a96a8;font-size:18px}"""
    k=[("bot","Stärkster Bot","1474","31.10.",False),("kalender","Lerntage pro Woche","4","31.10.",False),
       ("uhr","Taktik auf Zeit","?","3 Minuten, so viele du schaffst",True),("flamme","Tagesserie","?","Tage hintereinander",True),
       ("ziel","Richtig an einem Tag","?","Trainerantworten",True),("auge","Zug erraten","?","Trefferquote",True),
       ("pokal","Höchste Wertung","ab 10 Partien","noch 7 Partien",True),("schild","Ohne Patzer","?","Halbzüge in einer Partie",True)]
    kach="".join(f'<div class="rk{" offen" if o else ""}">{ic(i)}<div class="w">{w}</div><div class="klein"><b style="color:#f5f0e6">{n}</b><br>{d}</div></div>' for i,n,w,d,o in k)
    inh=f"""<div class="kopf"><h1>Deine Rekorde</h1><div class="leise">2 von 8 aufgestellt · Tipp auf eine Kachel</div></div><div class="raster">{kach}</div>"""
    return seite("Rekorde 2", inh, css)

# ---------- Rekorde 3: Bestwerte oben, Zeitstrahl darunter ----------
def r3():
    css=""".strahl{border-left:2px solid #2c3d5a;margin-left:10px;padding-left:16px}
    .ereignis{position:relative;padding:8px 0}
    .ereignis:before{content:'';position:absolute;left:-23px;top:13px;width:12px;height:12px;border-radius:50%;background:#e3bf4a}
    .band{display:flex;gap:8px;overflow:hidden}
    .bw{flex:none;width:112px;background:#22365a;border-radius:12px;padding:10px}
    .bw .w{font-family:'Source Serif 4',Georgia,serif;font-size:22px;font-weight:700}"""
    inh=f"""<div class="kopf"><h1>Deine Rekorde</h1></div>
    <div class="karte"><div class="band">
      <div class="bw"><div class="klein">Stärkster Bot</div><div class="w">1474</div></div>
      <div class="bw"><div class="klein">Lerntage/Woche</div><div class="w">4</div></div>
      <div class="bw" style="opacity:.5"><div class="klein">Taktik auf Zeit</div><div class="w">–</div></div>
    </div></div>
    <div class="karte"><h2 style="font-size:17px">Deine Bestmarken der Reihe nach</h2>
      <div class="strahl" style="margin-top:10px">
        <div class="ereignis"><b>31.10.</b> · Bot mit 1474 besiegt<div class="klein">vorher 1310</div></div>
        <div class="ereignis"><b>31.10.</b> · 4 Lerntage in dieser Woche<div class="klein">vorher 3</div></div>
        <div class="ereignis"><b>29.10.</b> · erster Sieg gegen einen Bot (1310)</div>
      </div></div>
    <div class="karte"><div class="zeile">{ic('uhr')}<div style="flex:1"><b>Nächster Versuch</b><div class="klein">Taktik auf Zeit hast du noch nie gespielt.</div></div><span class="knopf">Los</span></div></div>"""
    return seite("Rekorde 3", inh, css)

for n,f in [("wertung-1-eine-zahl",w1),("wertung-2-leiter",w2),("wertung-3-kacheln",w3),("rekorde-1-erreichtes",r1),("rekorde-2-kacheln",r2),("rekorde-3-zeitstrahl",r3)]:
    open(n+".html","w").write(f())
print("ok")
