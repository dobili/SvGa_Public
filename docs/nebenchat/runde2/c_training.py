"""C: Trainingsübersicht („Training“-Reiter)."""
from gemeinsam import *

# (Name, Kapitel-Text, Icon, Buchteil, Zweck, fällig)
TRAINER = [
    ("Koordinaten und Notation", "0", "raster", "Grundlagen", "Felder und Züge sicher lesen", 0),
    ("Röntgen-Trainer", "1", "auge", "Grundlagen", "Schach, Schlag, Drohung sehen", 0),
    ("Zähltrainer", "1", "rechner", "Grundlagen", "Lohnt sich das Schlagen?", 0),
    ("Repertoire-Trainer", "2", "regal", "Eröffnung", "Deine Eröffnungen üben", 0),
    ("Zielbilanz-Übung", "2", "scheibe", "Eröffnung", "Die drei Eröffnungsziele prüfen", 0),
    ("Abweichungsmodus", "2–3", "gabel", "Eröffnung", "Wenn der Gegner abweicht", 0),
    ("Faktorenbilanz-Trainer", "3", "waage", "Eröffnung", "Lohnt sich das Opfer?", 0),
    ("Falle oder Köder", "4", "haken_angel", "Eröffnung", "Nehmen oder lieber nicht?", 3),
    ("Strukturerkenner", "5", "knochen", "Mittelspiel", "Das Bauernskelett lesen", 1),
    ("Planbilanz-Übung", "6", "plan", "Mittelspiel", "Den passenden Plan wählen", 0),
    ("Taktiktrainer", "7", "blitz", "Mittelspiel", "Motive finden, mit Hilfen", 0),
    ("Endspieltrainer", "8–9", "flagge", "Endspiel", "Gewinnen oder Remis halten", 0),
    ("Studien lösen", "10", "stern", "Endspiel", "Versteckte Motive finden", 0),
    ("Zug erraten", "11", "frage", "Praxis", "Züge der Meister vorhersagen", 0),
    ("30-Minuten-Plan", "12", "timer", "Praxis", "Eine Trainingseinheit am Stück", 0),
    ("Kurzpläne", "12", "liste", "Praxis", "Plan-Sätze je Eröffnung", 0),
    ("Fehlerdatenbank", "12", "warnung", "Praxis", "Aus eigenen Fehlern lernen", 0),
    ("Denkroutine-Trainer", "12", "route", "Praxis", "Vier Schritte vor jedem Zug", 0),
]
FAELLIG = [("Übungen aus dem Buch", 2, "#e3bf4a"), ("Falle oder Köder", 3, "#f5f0e6"), ("Strukturerkenner", 1, "#7fb5ae")]
TEIL_KAP = {"Grundlagen": "0–1", "Eröffnung": "2–4", "Mittelspiel": "5–7", "Endspiel": "8–10", "Praxis": "11–12"}


def kopf_training():
    return f'<div class="kopf"><h1 style="font-size:34px">Training</h1>{ic("kompass", 28, "#c3c9d3")}</div>'


def badge(n):
    return f'<span style="background:var(--gold);color:#16253d;font-size:12px;font-weight:700;border-radius:99px;padding:2px 8px;white-space:nowrap">{n} fällig</span>' if n else ""


# ---------------- C1: Heute zuerst, dann Raster ----------------
def c1():
    css = """
.fokus{background:linear-gradient(160deg,#22365a,#1b2b45 60%);border:1px solid #3a4f74;border-radius:18px;margin:8px 16px 12px;padding:16px}
.segm{display:flex;height:10px;border-radius:5px;overflow:hidden;gap:3px;margin:14px 0 10px}
.leg{display:flex;flex-wrap:wrap;gap:8px}
.leg .chip{font-size:14px;padding:0 12px;border-color:#3e5070}
.leg i{width:10px;height:10px;border-radius:50%;display:inline-block}
.paar{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:0 16px}
.kl{background:var(--karte);border:1px solid var(--rand);border-radius:14px;padding:12px;display:flex;gap:10px;align-items:center;min-height:64px}
.kl b{display:block;font-size:15px} .kl small{color:var(--leise);font-size:12.5px}
.filter{display:flex;gap:8px;margin:10px 16px 4px;overflow:hidden}
.filter .chip{font-size:14px;min-height:40px}
.gruppe{margin:16px 16px 8px;font-size:12px;letter-spacing:.12em;font-weight:700;color:var(--leise);text-transform:uppercase}
.raster{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:0 16px}
.tr{background:var(--karte);border:1px solid var(--rand);border-radius:14px;padding:10px;min-height:66px;position:relative;display:flex;align-items:center;gap:10px}
.tr .sym{width:38px;height:38px;border-radius:11px;background:rgba(227,191,74,.13);color:var(--gold);display:flex;align-items:center;justify-content:center}
.tr b{font-size:14.5px;overflow-wrap:break-word;font-weight:600;line-height:1.2}
.tr .kap{display:block;font-size:12.5px;color:var(--leise);margin-top:3px}
.tr.faellig{border-color:rgba(227,191,74,.6)}
"""
    gesamt = sum(n for _, n, _ in FAELLIG)
    segm = "".join(f'<span style="flex:{n};background:{f}"></span>' for _, n, f in FAELLIG)
    leg = "".join(f'<span class="chip"><i style="background:{f}"></i>{t} <b style="color:var(--gold)">{n}</b></span>' for t, n, f in FAELLIG)
    fokus = (f'<div class="fokus"><div class="zeile" style="justify-content:space-between"><span class="leise" style="font-size:12px;letter-spacing:.1em;font-weight:700">HEUTE FÄLLIG</span>'
             f'<span style="width:44px;height:44px;display:flex;align-items:center;justify-content:center;margin:-12px -10px -12px 0" aria-label="Wie funktioniert das?">{ic("frage", 22, "#c3c9d3")}</span></div>'
             f'<div style="display:flex;align-items:baseline;gap:10px;margin-top:4px"><span class="serif" style="font-size:52px;line-height:1">{gesamt}</span>'
             f'<span><b style="font-size:18px">Wiederholungen</b><div class="leise klein">etwa 4 Minuten</div></span></div>'
             f'<div class="segm">{segm}</div><div class="leg">{leg}</div>'
             f'<span class="knopf" style="width:100%;margin-top:14px">{ic("wiederholen", 20)}Alle {gesamt} wiederholen</span></div>')
    paar = (f'<div class="paar"><div class="kl">{ic("lesezeichen", 26, "#e3bf4a")}<span><b>Lernsammlung</b><small>noch leer</small></span></div>'
            f'<div class="kl">{ic("karte", 26, "#e3bf4a")}<span><b>Alle Kapitel</b><small>gemischt üben</small></span></div></div>')
    filt = ('<div class="filter">' + "".join(f'<span class="chip{" an" if i == 0 else ""}">{t}</span>' for i, t in enumerate(["Alle", "Grundlagen", "Eröffnung", "Mittelspiel", "Endspiel"])) + '</div>')
    gruppen = []
    for teil in TEIL_KAP:
        kacheln = "".join(
            f'<div class="tr{" faellig" if f else ""}"><span class="sym">{ic(i, 22)}</span><span style="min-width:0"><b>{n.replace("Abweichungsmodus", "Abweichungs&shy;modus").replace("Strukturerkenner", "Struktur&shy;erkenner")}</b>'
            + (f'<span class="kap">{badge(f)}</span>' if f else f'<span class="kap">Kap. {k}</span>') + '</span></div>'
            for n, k, i, t, z, f in TRAINER if t == teil)
        gruppen.append(f'<div class="gruppe">{teil} · Kapitel {TEIL_KAP[teil]}</div><div class="raster">{kacheln}</div>')
    inhalt = f'{kopf_training()}{fokus}{paar}<div style="margin:22px 16px 0"><h2>Trainer</h2></div>{filt}{"".join(gruppen)}<div style="height:16px"></div>'
    schreibe("c1", seite("C1 Heute zuerst", inhalt, css))


# ---------------- C2: Stapel und Regale ----------------
BILDER = {  # kleine Brettbilder je Trainer (5x5-Ausschnitt), Pfeile rot = Gegner, gold = du
    "Koordinaten und Notation": dict(figuren=[("wN", 2, 2)], pfeile=[(2, 2, 3, 0, "#e3bf4a"), (2, 2, 0, 1, "#e3bf4a"), (2, 2, 4, 3, "#e3bf4a")]),
    "Röntgen-Trainer": dict(figuren=[("bQ", 0, 0), ("wK", 4, 4), ("wB", 2, 3)], pfeile=[(0, 0, 4, 4, "#e05a4f")], felder=[(4, 4, "#e05a4f88")]),
    "Zähltrainer": dict(figuren=[("bP", 2, 1), ("wN", 0, 2), ("wP", 1, 3), ("bN", 4, 0), ("bB", 4, 3)], pfeile=[(0, 2, 2, 1, "#e3bf4a"), (1, 3, 2, 2, "#e3bf4a"), (4, 0, 2, 1, "#e05a4f")], felder=[(2, 1, "#e3bf4a66")]),
    "Repertoire-Trainer": dict(figuren=[("wP", 2, 2), ("bP", 2, 1), ("wN", 3, 3), ("bN", 1, 0)], pfeile=[(1, 0, 2, 2, "#e05a4f")]),
    "Zielbilanz-Übung": dict(figuren=[("wP", 1, 2), ("wP", 2, 2), ("wN", 3, 3), ("wK", 4, 4)], felder=[(1, 1, "#e3bf4a55"), (2, 1, "#e3bf4a55")]),
    "Abweichungsmodus": dict(figuren=[("wP", 2, 3), ("bP", 2, 1)], pfeile=[(2, 3, 2, 2, "#e3bf4a"), (1, 0, 1, 2, "#e05a4f"), (3, 0, 3, 1, "#e05a4f")]),
    "Faktorenbilanz-Trainer": dict(figuren=[("wP", 1, 2), ("bP", 2, 2), ("wB", 3, 3), ("bK", 3, 0)], pfeile=[(3, 3, 1, 1, "#e3bf4a")]),
    "Falle oder Köder": dict(figuren=[("bB", 3, 1), ("wN", 1, 3), ("bQ", 4, 0)], pfeile=[(4, 1, 3, 1, "#e05a4f")], felder=[(3, 1, "#e05a4f55")]),
    "Strukturerkenner": dict(figuren=[("wP", 0, 3), ("wP", 1, 3), ("wP", 3, 2), ("bP", 3, 1), ("bP", 4, 2), ("bP", 1, 1)], felder=[(2, 1, "#e3bf4a77")]),
    "Planbilanz-Übung": dict(figuren=[("wR", 0, 4), ("wN", 2, 3), ("bP", 3, 1)], pfeile=[(2, 3, 3, 1, "#e3bf4a"), (0, 4, 0, 1, "#e3bf4a")]),
    "Taktiktrainer": dict(figuren=[("wN", 2, 3), ("bK", 1, 1), ("bR", 3, 1)], pfeile=[(2, 3, 1, 1, "#e3bf4a"), (2, 3, 3, 1, "#e3bf4a")]),
    "Endspieltrainer": dict(figuren=[("wK", 2, 2), ("wP", 2, 3), ("bK", 2, 0)], felder=[(1, 1, "#e3bf4a55"), (2, 1, "#e3bf4a55"), (3, 1, "#e3bf4a55")]),
    "Studien lösen": dict(figuren=[("wK", 0, 4), ("wP", 3, 1), ("bK", 4, 3), ("bR", 0, 0)], pfeile=[(3, 1, 3, 0, "#e3bf4a")]),
    "Zug erraten": dict(figuren=[("wQ", 1, 3), ("bK", 3, 0), ("wB", 4, 4)], pfeile=[(1, 3, 3, 1, "#e3bf4a")]),
    "30-Minuten-Plan": dict(figuren=[("wK", 1, 3), ("bK", 3, 1)]),
    "Kurzpläne": dict(figuren=[("wP", 1, 2), ("wP", 2, 3), ("bP", 2, 1)], pfeile=[(0, 4, 0, 1, "#e3bf4a")]),
    "Fehlerdatenbank": dict(figuren=[("wQ", 2, 2), ("bN", 3, 0)], pfeile=[(3, 0, 2, 2, "#e05a4f")], felder=[(2, 2, "#e05a4f66")]),
    "Denkroutine-Trainer": dict(figuren=[("wN", 1, 3), ("bP", 2, 1), ("wB", 4, 4)], pfeile=[(1, 3, 2, 1, "#e3bf4a"), (4, 4, 2, 2, "#e3bf4a")]),
}
STAND = {"Röntgen-Trainer": "Stufe 2 · Bestwert 14", "Zähltrainer": "Stufe 1 · Bestwert 8", "Falle oder Köder": "Stufe 2", "Taktiktrainer": "Stufe 3 · Serie 6",
         "Koordinaten und Notation": "Bestzeit 0:41", "Repertoire-Trainer": "Stufe 1"}


def c2():
    css = """
.stapel{display:flex;gap:16px;align-items:center;background:var(--karte);border:1px solid var(--rand);border-radius:18px;margin:8px 16px 6px;padding:16px}
.blatt{position:absolute;border-radius:10px;border:3px solid #f5f0e6;box-shadow:0 6px 14px rgba(0,0,0,.45);overflow:hidden;background:#f5f0e6}
.regal{margin:18px 0 0}
.regal .kopfz{display:flex;justify-content:space-between;align-items:baseline;margin:0 16px 8px}
.reihe{display:flex;gap:12px;padding:0 16px;overflow:hidden}
.tk{flex:none;width:150px;background:var(--karte);border:1px solid var(--rand);border-radius:16px;overflow:hidden;position:relative}
.tk .bild{height:104px;display:flex;align-items:center;justify-content:center;background:#22365a}
.tk .txt{padding:10px 12px 12px}
.tk b{font-size:14.5px;font-weight:600;line-height:1.2;display:block;min-height:36px}
.tk small{color:var(--leise);font-size:12.5px}
.tk .punkte{display:flex;gap:4px;margin-top:6px} .tk .punkte i{width:16px;height:5px;border-radius:3px;background:#2c3d5a}
.tk .punkte i.v{background:var(--gold)}
.tk .badge{position:absolute;top:8px;right:8px}
.unten{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:20px 16px 16px}
.unten div{border:1.5px dashed #3e5070;border-radius:14px;padding:12px;display:flex;gap:10px;align-items:center;min-height:60px}
.unten b{display:block;font-size:15px} .unten small{color:var(--leise);font-size:12.5px}
"""
    stapelbild = ('<div style="position:relative;width:118px;height:118px;flex:none">'
                  f'<div class="blatt" style="left:18px;top:4px;transform:rotate(10deg);opacity:.55">{miniboard(84, 5, **BILDER["Strukturerkenner"], rahmen=False)}</div>'
                  f'<div class="blatt" style="left:10px;top:8px;transform:rotate(4deg);opacity:.8">{miniboard(84, 5, **BILDER["Falle oder Köder"], rahmen=False)}</div>'
                  f'<div class="blatt" style="left:2px;top:14px;transform:rotate(-5deg)">{miniboard(84, 5, **BILDER["Zähltrainer"], rahmen=False)}</div>'
                  '<span style="position:absolute;right:-4px;top:-2px;background:var(--gold);color:#16253d;border-radius:99px;font-weight:700;font-size:15px;padding:3px 10px;box-shadow:0 2px 6px rgba(0,0,0,.4)">6</span></div>')
    stapel = (f'<div class="stapel">{stapelbild}<div style="flex:1"><div class="serif" style="font-size:22px;line-height:1.15">Dein Stapel für heute</div>'
              f'<div class="leise klein" style="margin:4px 0 12px">2 aus dem Buch · 3 Fallen · 1 Struktur</div>'
              f'<span class="knopf" style="width:100%;min-height:46px;font-size:16px">Durchgehen</span></div></div>'
              f'<div class="leise klein" style="margin:0 16px;display:flex;gap:6px;align-items:center">{ic("frage", 16)} Was du gelöst hast, kommt nach 1, 3, 7, 16 und 35 Tagen wieder.</div>')
    regale = []
    for teil in TEIL_KAP:
        liste = [t for t in TRAINER if t[3] == teil]
        karten = []
        for n, k, i, _, z, f in liste:
            stand = STAND.get(n, "neu")
            stufe = int(stand.split()[1]) if stand.startswith("Stufe") else 0
            punkte = '<div class="punkte">' + "".join(f'<i class="{"v" if j < stufe else ""}"></i>' for j in range(5)) + '</div>'
            karten.append(f'<div class="tk"><div class="bild">{miniboard(88, 5, **BILDER[n])}</div>{"<span class=badge>" + badge(f) + "</span>" if f else ""}'
                          f'<div class="txt"><b>{n}</b><small>{"<span class=gold>neu</span> · Kap. " + k if stand == "neu" else stand}</small>{punkte}</div></div>')
        regale.append(f'<div class="regal"><div class="kopfz"><h3>{teil}</h3><span class="leise klein">Kapitel {TEIL_KAP[teil]} · {len(liste)} Trainer ›</span></div><div class="reihe">{"".join(karten)}</div></div>')
    unten = (f'<div class="unten"><div>{ic("lesezeichen", 24, "#e3bf4a")}<span><b>Lernsammlung</b><small>noch leer</small></span></div>'
             f'<div>{ic("karte", 24, "#e3bf4a")}<span><b>Alle Kapitel</b><small>gemischt üben</small></span></div></div>')
    inhalt = f'{kopf_training()}{stapel}{"".join(regale)}{unten}'
    schreibe("c2", seite("C2 Stapel und Regale", inhalt, css))


# ---------------- C3: Nach Thema geordnet ----------------
THEMEN = [
    ("Rechnen und Taktik", "Sehen, was auf dem Brett passiert", ["Taktiktrainer", "Zähltrainer", "Röntgen-Trainer", "Studien lösen"]),
    ("Eröffnung", "Gut aus der Eröffnung kommen", ["Repertoire-Trainer", "Zielbilanz-Übung", "Abweichungsmodus", "Falle oder Köder", "Faktorenbilanz-Trainer"]),
    ("Stellung verstehen", "Einen Plan finden", ["Strukturerkenner", "Planbilanz-Übung", "Kurzpläne"]),
    ("Endspiel", "Vorteile sicher verwerten", ["Endspieltrainer"]),
    ("Ganze Partien", "Denken wie im Turnier", ["Zug erraten", "Denkroutine-Trainer", "Fehlerdatenbank", "30-Minuten-Plan", "Koordinaten und Notation"]),
]


def c3():
    css = """
.faellig{background:var(--karte);border:1px solid var(--rand);border-radius:16px;margin:8px 16px 0;padding:12px 14px}
.faellig .reihe{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}
.faellig .chip{font-size:14px;padding:0 12px}
.faellig .chip b{background:var(--gold);color:#16253d;border-radius:99px;padding:0 7px;font-size:13px}
.umschalter{display:flex;margin:16px 16px 6px;background:#16253d;border:1px solid var(--rand);border-radius:12px;padding:3px}
.umschalter span{flex:1;min-height:42px;display:flex;align-items:center;justify-content:center;border-radius:9px;font-weight:600;color:var(--leise)}
.umschalter span.an{background:var(--karte);color:var(--text);box-shadow:0 0 0 1px #3e5070}
.thema{margin:16px 16px 0}
.thema .tk{display:flex;align-items:baseline;gap:8px;margin-bottom:6px}
.liste{background:var(--karte);border:1px solid var(--rand);border-radius:14px;overflow:hidden}
.zeile2{display:flex;align-items:center;gap:12px;padding:8px 12px;min-height:56px;border-top:1px solid #26385a}
.zeile2:first-child{border-top:none}
.zeile2 .sym{width:36px;height:36px;border-radius:10px;background:rgba(227,191,74,.12);color:var(--gold);display:flex;align-items:center;justify-content:center;flex:none}
.zeile2 b{font-weight:600;font-size:15.5px;display:block;line-height:1.2} .zeile2 small{color:var(--leise);font-size:13px}
.zeile2 .k{font-size:12px;color:var(--leise);border:1px solid #3e5070;border-radius:6px;padding:1px 6px;white-space:nowrap}
"""
    d = {t[0]: t for t in TRAINER}
    gesamt = sum(n for _, n, _ in FAELLIG)
    faellig = (f'<div class="faellig"><div class="zeile" style="justify-content:space-between"><span><b style="font-size:17px">{gesamt} Wiederholungen fällig</b></span>'
               f'<span style="width:44px;height:44px;display:flex;align-items:center;justify-content:center;margin:-10px -10px -10px 0">{ic("frage", 22, "#c3c9d3")}</span></div>'
               f'<div class="reihe">' + "".join(f'<span class="chip">{t} <b>{n}</b></span>' for t, n, _ in FAELLIG) + '</div></div>')
    umsch = '<div class="umschalter"><span class="an">Nach Thema</span><span>Nach Kapitel</span></div>'
    eigen = (f'<div class="thema"><div class="tk"><h3>Gemischt</h3><span class="leise klein">quer durchs Buch</span></div><div class="liste">'
             f'<div class="zeile2"><span class="sym">{ic("karte", 20)}</span><span style="flex:1"><b>Alle Kapitel</b><small>Übungen aus jedem Kapitel</small></span>{ic("pfeil", 18, "#7d8aa0")}</div>'
             f'<div class="zeile2"><span class="sym">{ic("lesezeichen", 20)}</span><span style="flex:1"><b>Lernsammlung</b><small>noch leer</small></span>{ic("pfeil", 18, "#7d8aa0")}</div></div></div>')
    themen = []
    for titel, satz, namen in THEMEN:
        zeilen = []
        for n in namen:
            _, k, i, _, z, f = d[n]
            rechts = badge(f) if f else f'<span class="k">Kap. {k}</span>'
            zeilen.append(f'<div class="zeile2"><span class="sym">{ic(i, 20)}</span><span style="flex:1;min-width:0"><b>{n}</b><small>{z}</small></span>{rechts}</div>')
        themen.append(f'<div class="thema"><div class="tk"><h3>{titel}</h3><span class="leise klein">{satz}</span></div><div class="liste">{"".join(zeilen)}</div></div>')
    inhalt = f'{kopf_training()}{faellig}{umsch}{eigen}{"".join(themen)}<div style="height:16px"></div>'
    schreibe("c3", seite("C3 Nach Thema", inhalt, css))


if __name__ == "__main__":
    c1(); c2(); c3()
