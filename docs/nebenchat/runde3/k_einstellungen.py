"""K: Einstellungen als Ganzes (Brett, Bedienung, Anzeige, Bots, Hilfe, Daten, Über die App)."""
from bausteine3 import *

FARBEN = [("wie im Buch", "#efe9da", "#8d98ab"), ("Grün", "#EEEED2", "#769656"), ("Braun", "#F0D9B5", "#B58863"), ("Blau", "#DEE3E6", "#8CA2AD"),
          ("Sand", "#EFE6D2", "#B9A27E"), ("Koralle", "#F2E6DC", "#C98B73"), ("Lavendel", "#ECE8F2", "#9D92B8"), ("Nacht", "#9AA5B1", "#56616E"),
          ("Ahorn & Nussbaum", "#E4C38E", "#8E5E36"), ("Intarsie", "#E0C59D", "#AC765C"), ("Holz klassisch", "#C3A36F", "#7E5532"), ("Marmor grün", "#829883", "#647A63")]
SAETZE = [("wie im Buch", "klassisch-cburnett"), ("Cburnett", "klassisch-cburnett"), ("Merida", "klassisch-merida"), ("Chessnut", "klassisch-chessnut"),
          ("Mpchess", "modern-mpchess"), ("Celtic", "modern-celtic"), ("Spatial", "modern-spatial"), ("Kiefer & Kirsche", "holz-kiefer-kirsche"),
          ("Eiche & Mahagoni", "holz-eiche-mahagoni"), ("Esche & Ebenholz", "holz-esche-ebenholz")]
STELLUNG = "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4"
GEWAEHLT_F, GEWAEHLT_S = "Blau", "klassisch-merida"


def kopf():
    return unterseitenkopf("Profil", "Einstellungen")


def gruppe(titel, zeilen):
    return (f'<div style="margin:20px 16px 6px" class="leise klein"><b style="letter-spacing:.1em;font-size:12px">{titel.upper()}</b></div>'
            f'<style>.gl>div:first-child{{border-top:none!important}}</style><div class="gl" style="background:var(--karte);border:1px solid var(--rand);border-radius:16px;margin:0 16px;overflow:hidden">{"".join(zeilen)}</div>')


def zeile(icon, titel, rechts="", unter="", rot=False, frage=False):
    farbe = "#e86a5c" if rot else "#e3bf4a"
    u = f'<div class="leise" style="font-size:13px;margin-top:1px">{unter}</div>' if unter else ""
    f = f'<span style="color:#7d8aa0;display:inline-flex">{ic("frage", 18)}</span>' if frage else ""
    return (f'<div style="display:flex;align-items:center;gap:12px;min-height:54px;padding:6px 14px;border-top:1px solid #26385a">'
            f'{ic(icon, 21, farbe)}<div style="flex:1;min-width:0"><span style="{"color:#f09080;" if rot else ""}font-size:15.5px">{titel}</span>{u}</div>{f}{rechts}</div>')


def wert(t):
    return f'<span class="leise" style="font-size:14.5px;white-space:nowrap">{t}</span>{ic("pfeil", 16, "#7d8aa0")}'


def mini(hell, dunkel, satz, px=36):
    return fenbrett("4k3/8/8/8/8/8/8/4K3", px, runden=6, schatten=False, hell=hell, dunkel=dunkel, satz=satz).replace("4k3/8", "")


def vorschau_klein(px=40):
    f = dict((n, (h, d)) for n, h, d in FARBEN)[GEWAEHLT_F]
    return fenbrett("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR", px, runden=6, schatten=False, hell=f[0], dunkel=f[1], satz=GEWAEHLT_S)


# ---------------- K1: Eine Seite, jede Einstellung eine Zeile ----------------
def k1():
    css = ".erste{border-top:none!important}"
    stepper = ('<span style="display:flex;align-items:center;gap:6px"><span style="width:40px;height:40px;border-radius:10px;border:1.5px solid #4b5d7c;display:flex;align-items:center;justify-content:center;font-weight:700">A−</span>'
               '<b style="width:44px;text-align:center">100 %</b><span style="width:40px;height:40px;border-radius:10px;border:1.5px solid #4b5d7c;display:flex;align-items:center;justify-content:center;font-weight:700">A+</span></span>')
    brettzeile = (f'<div style="display:flex;align-items:center;gap:12px;min-height:64px;padding:8px 14px">{vorschau_klein(48)}'
                  f'<div style="flex:1"><span style="font-size:15.5px">Brett und Figuren</span><div class="leise" style="font-size:13px">Blau · Merida · Koordinaten an</div></div>{ic("pfeil", 16, "#7d8aa0")}</div>')
    aussehen = gruppe("Aussehen", [brettzeile, zeile("auge", "Nachtmodus", wert("wie das Gerät")),
                                  zeile("liste", "Schriftgröße", stepper), zeile("karte", "Sprache", wert("Deutsch"))])
    bedienung = gruppe("Bedienung", [zeile("hantel", "Figuren per Wischen ziehen", schalter(True), "Antippen geht immer", frage=True),
                                    zeile("route", "Züge gleiten über das Brett", schalter(True)),
                                    zeile("blitz", "Ton bei Zug und Schlag", schalter(False)),
                                    zeile("stern", "Feiereffekte", schalter(True), "Feuerwerk bei Orden und Rekorden"),
                                    zeile("play", "Startbild beim Öffnen", schalter(True))])
    gegner = gruppe("Gegner und Wertung", [zeile("person", "Menschlichere Bots (Maia)", '<span class="knopf rahmen" style="min-height:40px;padding:0 12px;font-size:14px">Laden</span>', "einmal etwa 96 MB, dann offline", frage=True),
                                          zeile("scheibe", "Maßstab der Wertung", wert("Lichess"))])
    hilfe = gruppe("Hilfe", [zeile("kompass", "Toursymbol oben rechts", schalter(True)), zeile("route", "Rundgang durch die App", wert("")),
                             zeile("frage", "Erklärkacheln wieder zeigen", wert(""))])
    daten = gruppe("Deine Daten", [
        f'<div style="display:flex;gap:12px;align-items:center;padding:12px 14px;background:rgba(227,148,58,.10)">{ic("warnung", 22, "#e3943a")}'
        f'<div style="flex:1"><b style="font-size:15px">Noch keine Sicherung</b><div class="leise" style="font-size:13px">Deine Daten liegen nur auf diesem Gerät.</div></div>'
        f'<span class="knopf" style="min-height:42px;padding:0 14px;font-size:14.5px">Sichern</span></div>',
        zeile("plus", "Sicherung einspielen", wert("")),
        zeile("kreuz", "Alle Daten dieser App löschen", "", rot=True), zeile("kreuz", "App ganz vom Gerät entfernen", "", rot=True)])
    ueber = gruppe("Über die App", [
        zeile("haken", "Version 0.3.31 (Beta)", '<span style="font-size:13px;color:#7fc27a;font-weight:700">offline bereit</span>', "Datenstand: Auflage 1, 25.10.2026"),
        zeile("wiederholen", "Nach Update suchen", wert("")), zeile("warnung", "Fehler melden", wert("")),
        '<div style="display:flex;gap:18px;justify-content:center;min-height:50px;align-items:center;border-top:1px solid #26385a;font-size:14px;color:var(--leise)"><u>Lizenzen</u><u>Datenschutz</u><u>Impressum</u></div>'])
    inhalt = kopf() + aussehen.replace('border-top:1px solid #26385a">', 'border-top:1px solid #26385a">', 1) + bedienung + gegner + hilfe + daten + ueber + '<div style="height:16px"></div>'
    schreibe("k1", seite("K1 Eine Seite", inhalt, css))


# ---------------- K2: Brett-Studio oben ----------------
def k2():
    css = """
.studio{margin:8px 16px 0;border-radius:20px;background:radial-gradient(110% 80% at 50% 0%,#2a4268,#16253d 75%);border:1px solid #3a4f74;padding:16px;text-align:center}
.reihe{display:flex;gap:10px;overflow:hidden;margin-top:10px;padding:2px}
.sw{flex:none;display:flex;flex-direction:column;align-items:center;gap:4px;width:58px;font-size:11.5px;color:var(--leise);text-align:center;line-height:1.15}
.sw .k{width:48px;height:48px;border-radius:50%;overflow:hidden;box-shadow:0 0 0 2px #3e5070}
.sw.an{color:var(--text);font-weight:700} .sw.an .k{box-shadow:0 0 0 3px #e3bf4a}
.fs{flex:none;display:flex;flex-direction:column;align-items:center;gap:4px;width:62px;font-size:11.5px;color:var(--leise);text-align:center;line-height:1.15}
.fs .k{width:52px;height:52px;border-radius:12px;background:#2c3d5a;display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 1.5px #3e5070}
.fs.an{color:var(--text);font-weight:700} .fs.an .k{box-shadow:0 0 0 3px #e3bf4a}
.reiter{display:flex;margin:22px 16px 0;background:#16253d;border:1px solid var(--rand);border-radius:12px;padding:3px}
.reiter span{flex:1;min-height:42px;display:flex;align-items:center;justify-content:center;border-radius:9px;font-weight:600;color:var(--leise);font-size:14.5px}
.reiter span.an{background:var(--karte);color:var(--text);box-shadow:0 0 0 1px #3e5070}
.liste{background:var(--karte);border:1px solid var(--rand);border-radius:16px;margin:10px 16px 0;overflow:hidden}
"""
    f = dict((n, (h, d)) for n, h, d in FARBEN)[GEWAEHLT_F]
    brett = fenbrett(STELLUNG, 236, runden=10, hell=f[0], dunkel=f[1], satz=GEWAEHLT_S)
    swatches = "".join(
        f'<div class="sw{" an" if n == GEWAEHLT_F else ""}"><span class="k"><svg width="48" height="48"><rect width="48" height="48" fill="{h}"/><polygon points="48,0 48,48 0,48" fill="{d}"/></svg></span>{n}</div>'
        for n, h, d in FARBEN[:8]) + '<div class="sw"><span class="k" style="background:#22365a;display:flex;align-items:center;justify-content:center;color:#e3bf4a">' + ic("plus", 20) + '</span>Holz und mehr</div>'
    saetze = "".join(
        f'<div class="fs{" an" if p == GEWAEHLT_S and n != "wie im Buch" else ""}"><span class="k"><img src="{DIST}figuren/{p}/wN.svg" width="40" height="40"></span>{n}</div>' for n, p in SAETZE[1:8])
    studio = (f'<div class="studio"><div style="display:flex;justify-content:center">{brett}</div>'
              f'<div class="zeile" style="justify-content:center;gap:10px;margin-top:10px;font-size:14px"><span class="leise">Koordinaten</span>{schalter(True)}</div></div>'
              f'<div style="margin:14px 16px 0"><b>Brettfarbe</b><div class="reihe">{swatches}</div></div>'
              f'<div style="margin:14px 16px 0"><b>Figuren</b><div class="reihe">{saetze}</div></div>')
    reiter = '<div class="reiter"><span class="an">Bedienung</span><span>Anzeige</span><span>Hilfe</span></div>'
    liste = ('<div class="liste">' + zeile("hantel", "Figuren per Wischen ziehen", schalter(True)).replace("border-top:1px solid #26385a", "border-top:none", 1)
             + zeile("route", "Züge gleiten", schalter(True)) + zeile("blitz", "Ton", schalter(False)) + zeile("stern", "Feiereffekte", schalter(True))
             + zeile("play", "Startbild", schalter(True)) + '</div>')
    unten = ('<div class="liste" style="margin-top:16px">' + zeile("person", "Bots und Wertung", wert("Maia, Lichess")).replace("border-top:1px solid #26385a", "border-top:none", 1)
             + zeile("warnung", "Daten sichern", '<span style="width:10px;height:10px;border-radius:50%;background:#e3943a"></span>' + wert("noch nie"))
             + zeile("haken", "Über die App", wert("0.3.31")) + '</div><div style="height:16px"></div>')
    schreibe("k2", seite("K2 Brett-Studio", kopf() + studio + reiter + liste + unten, css))


# ---------------- K3: Übersicht in Kacheln ----------------
def k3():
    css = """
.hinweis{display:flex;gap:12px;align-items:center;margin:8px 16px 0;padding:12px 14px;border-radius:16px;background:rgba(227,148,58,.12);border:1px solid rgba(227,148,58,.5)}
.kacheln{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:14px 16px 0}
.ka{background:var(--karte);border:1px solid var(--rand);border-radius:16px;padding:14px;min-height:118px;display:flex;flex-direction:column;gap:6px;position:relative}
.ka b{font-size:16px;font-weight:600;margin-top:auto} .ka small{font-size:12.5px;color:var(--leise);line-height:1.25}
.ka .punkt{position:absolute;top:12px;right:12px;width:10px;height:10px;border-radius:50%;background:#e3943a}
.unter{margin:0 16px;background:var(--karte);border:1px solid var(--rand);border-radius:16px;overflow:hidden}
"""
    hinweis = (f'<div class="hinweis">{ic("warnung", 24, "#e3943a")}<div style="flex:1"><b>Noch keine Sicherung</b><div class="leise" style="font-size:13px">Deine Daten liegen nur auf diesem Gerät.</div></div>'
               f'<span class="knopf" style="min-height:42px;padding:0 14px;font-size:14.5px">Sichern</span></div>')
    def ka(bild, titel, text, punkt=False):
        return f'<div class="ka">{"<span class=punkt></span>" if punkt else ""}{bild}<b>{titel}</b><small>{text}</small></div>'
    kacheln = ('<div class="kacheln">'
               + ka(vorschau_klein(44), "Brett", "Blau · Merida")
               + ka(ic("hantel", 30, "#e3bf4a"), "Bedienung", "Wischen an · Ton aus")
               + ka(ic("auge", 30, "#e3bf4a"), "Anzeige", "wie das Gerät · 100 % · Deutsch")
               + ka(ic("person", 30, "#e3bf4a"), "Bots", "Maia noch nicht geladen")
               + ka(ic("frage", 30, "#e3bf4a"), "Hilfe", "Tour an · Rundgang")
               + ka(ic("lesezeichen", 30, "#e3bf4a"), "Deine Daten", "noch nie gesichert", True)
               + '</div>'
               + f'<div class="zeile" style="margin:10px 16px 0;min-height:52px;background:var(--karte);border:1px solid var(--rand);border-radius:14px;padding:0 14px;gap:10px">{ic("haken", 20, "#7fc27a")}'
               f'<span style="flex:1">Über die App <span class="leise klein">· 0.3.31 · offline bereit</span></span>{ic("pfeil", 16, "#7d8aa0")}</div>')
    unter = ('<div class="notiz" style="margin-top:22px">Ein Tipp auf eine Kachel öffnet ihre Seite, hier „Bedienung“. Jede Einstellung hat eine Zeile; '
             'die Erklärung steht nur noch hinter dem Fragezeichen.</div>'
             + unterseitenkopf("Einstellungen", "Bedienung")
             + '<div class="unter">' + zeile("hantel", "Figuren per Wischen ziehen", schalter(True), frage=True).replace("border-top:1px solid #26385a", "border-top:none", 1)
             + zeile("route", "Züge gleiten über das Brett", schalter(True), frage=True) + zeile("blitz", "Ton bei Zug und Schlag", schalter(False), frage=True)
             + zeile("stern", "Feiereffekte", schalter(True), frage=True) + zeile("play", "Startbild beim Öffnen", schalter(True), frage=True) + '</div><div style="height:16px"></div>')
    schreibe("k3", seite("K3 Kacheln", kopf() + hinweis + kacheln + unter, css))


if __name__ == "__main__":
    k1(); k2(); k3()
