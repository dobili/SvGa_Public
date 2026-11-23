# Heldin und Rivalin Victoria: Ersatz bis zu den Bildern des Autors; eiliger Durchlauf Akt 1 (23.11.2026, Nachtauftrag)

Auftrag des Hauptchats: prüfen, ob das Spiel ohne die noch fehlenden Bilder für Heldin und Victoria
sauber auf einen Ersatz fällt (Auswahl am Anfang, Porträts, Bögen, Sitz-, Lauf- und Rennreihen,
Editor), ohne Fehler und leere Bilder, mit klar benanntem Ersatz. Danach ein Spieler-Durchlauf
(`DURCHLAUF_SPIELER=eilig`, Akt 1, privates Paket) mit den neuen PixelLab-Figuren und Tieren.
Fotos und Protokolle liegen nur lokal (Paketbilder); dieser Bericht hat keine Bilder.

## 1. Heldin und Victoria

Bestand im privaten Paket (`spiel/figuren-neu`, `spiel/portraets`):

| Teil | Heldin (`heldin-0`) | Victoria (`victoria`, `victoria-pullover`) |
| --- | --- | --- |
| Weltbogen: Stand, Gehen, Rennen | da | da |
| Sitz auf dem Stuhl | da | fehlt (wie bei Victor) |
| Sitz am Boden, Liegen | Boden fehlt, Liegen da | fehlt (wie bei Victor) |
| Porträt | keines nötig: der Held spricht nicht mit Porträt | fehlt |

So fällt das Spiel jetzt auf den Ersatz:

- **Auswahl am Anfang:** Beide Karten zeigen das eigene Standbild (Foto der Probe); ohne Bogen
  steht ein Platzhalter mit dem Namen da (`Heldwahl.tsx`).
- **Bögen und Reihen:** `skripte/figurenbogen.mjs` füllt jede fehlende Zustandsreihe mit einem
  benannten Ersatz: Stuhl = Standbild um den Sitzhub angehoben, Boden = Standbild, Liegen = das
  gedrehte Südbild. Rennen ohne eigene Reihe läuft mit den Gehbildern. Es gibt also keine leeren
  Rahmen. Fehlt ein Bogen ganz, nimmt die Welt den des Helden bzw. Victors (`weltdaten.ts`,
  `rivalinbogen` in `rivalform.ts`).
- **Porträt (geändert):** Bisher zeigte der Dialog für Victoria ohne eigenes Porträt Victors
  Gesicht neben dem Namen „Victoria Hale“. Jetzt sucht er nur ihr Porträt. Fehlt es, steht wie bei
  den anderen Sprechern ohne Porträt (`NOCH_OHNE_PORTRAET`) nur der Name da (`Portraet.tsx`,
  Kommentar in `rivalform.ts`, Test in `rivalform.test.ts`). Sobald `portraets/victoria.png` im
  Paket liegt, erscheint es ohne weitere Änderung.
- **Editor:** Der Karteneditor zeigt Figuren nach `orte.json`, also Victor an Victors Plätzen. Das
  ist richtig, denn Victoria steht an denselben Plätzen. Den Helden stellt der Editor nicht auf.
  Keine Änderung.
- **Im Spiel geprüft:** Neue Probe `tests/durchlauf/figurenwahlprobe.spec.ts`. Sie prüft die Wahl
  am Anfang, dann Cedar Creek (Akt 1) und Riverton (Akt 2) mit der Heldin und der Rivalin-Fassung
  und spricht dort an. Sie meldet Konsolenfehler, Seitenfehler, fehlgeschlagene Anfragen und
  HTTP-Fehler. Ergebnis: 0 Fehler (nur Leistungshinweise von WebGL). Heldin und Victoria stehen in
  der Welt in passender Größe, der Erzähltext sagt „Victoria … ihrem Tablet“.

## 2. Eiliger Durchlauf Akt 1

Neu im Durchlauf: Konsolenfehler (`konsole`) und Dateien mit HTTP-Fehler (`datei`, etwa fehlende
Bilder) werden als Fund gemeldet (`durchlauf.spec.ts`).

**Befund 1: Treppe im Whitlock-Haus (Wohnzimmer) zu eng.** Der eilige Spieler blieb gleich am
Anfang vor der Treppe nach oben stehen („aufgehalten vor 2,4“) und gab auf („kein Ziel mehr“). Auch
der gewöhnliche Spieler brauchte vier bis fünf Anläufe.

- **Ursache:** Feine Sperren an beiden Seiten des Treppenfußes ließen nur einen Gang frei, der
  genau auf der Grenze zwischen zwei Kacheln lag. Der Körper des Helden ist 12 Pixel breit. Gerade
  von Kachel 1 oder Kachel 2 aus stieß er links bzw. rechts an.
- **Behoben:** Die Sperre an der Wandseite (Kachel 1, Spalte 0) ist entfernt, in allen drei
  Fassungen des Wohnzimmers. Dahinter ist ohnehin die Wand. Jetzt geht es gerade von Kachel 1
  hinauf, wie bei den Treppen im Obergeschoss und auf dem Dachboden. Alle drei Treppen haben jetzt
  denselben Gang von 28 Pixeln. Die 4 Pixel an der Ostseite sind das Geländer und bleiben gesperrt;
  wer von Kachel 2 kommt, rückt ein Stück nach links. Karten neu gebaut, `durchlass` 0 Befunde. Im
  zweiten Lauf ging der eilige Spieler nach einmaligem Umplanen hinauf. Gleich verhält es sich an
  den Treppen im Obergeschoss und auf dem Dachboden, auch beim gewöhnlichen Spieler.

**Befund 2: Doppelter Tipp gibt die erste Victor-Partie fast auf.** Vor der Partie im Clubraum
kommt die Meldung „Neu im Tagebuch“. Der eilige Spieler tippt dort doppelt auf „Weiter“. Der zweite
Tipp traf „Aufgeben“, das an derselben Stelle erscheint, und die Partie stand mit „Wirklich
aufgeben?“ da. Die Nachfrage verhinderte das Aufgeben, aber der Spieler wundert sich.

- **Behoben:** „Aufgeben“ ist in den ersten 600 ms nach dem Öffnen der Partie gesperrt
  (`PartieHuelle.tsx`, Knopf `disabled`). Tests, die gleich nach dem Öffnen aufgeben, warten
  dadurch von selbst, bis der Knopf bedienbar ist.
- **Im Durchlauf:** Er erkennt eine ungewollte Nachfrage, meldet sie als Fund und tippt
  „Weiterspielen“ (`partie.ts`). Vorher stand er dort bis zum Ende der Zeit.

ERGEBNIS_DRITTER_LAUF
