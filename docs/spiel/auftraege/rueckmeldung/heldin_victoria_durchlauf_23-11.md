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
- **Behoben:** Der Treppenfuß ist über beide Kacheln frei (32 Pixel), in allen drei Fassungen
  des Wohnzimmers; oben bleibt die Sperre der Treppe. Ein erster Schritt (nur die Wandseite frei,
  28 Pixel wie bei den Treppen im Obergeschoss und auf dem Dachboden) reichte nicht: Im dritten Lauf
  blieb der eilige Spieler wieder hängen, weil er von Kachel 2 kommt. Karten neu gebaut,
  `durchlass` 0 Befunde. Seitdem geht er hinauf, höchstens nach einmaligem Umplanen. Die Treppen
  im Obergeschoss und auf dem Dachboden (28 Pixel, Geländer an der Ostseite) sind unverändert; dort
  plant er ebenfalls einmal um und kommt durch.

**Befund 2: Doppelter Tipp gibt die erste Victor-Partie fast auf.** Vor der Partie im Clubraum
kommt die Meldung „Neu im Tagebuch“. Der eilige Spieler tippt dort doppelt auf „Weiter“. Der zweite
Tipp traf „Aufgeben“, das an derselben Stelle erscheint, und die Partie stand mit „Wirklich
aufgeben?“ da. Die Nachfrage verhinderte das Aufgeben, aber der Spieler wundert sich.

- **Behoben:** „Aufgeben“ ist in den ersten 600 ms nach dem Öffnen der Partie gesperrt
  (`PartieHuelle.tsx`, Knopf `disabled`). Tests, die gleich nach dem Öffnen aufgeben, warten
  dadurch von selbst, bis der Knopf bedienbar ist.
- **Im Durchlauf:** Er erkennt eine ungewollte Nachfrage, meldet sie als Fund und tippt
  „Weiterspielen“ (`partie.ts`). Vorher stand er dort bis zum Ende der Zeit.

**Lücken im Durchlauf selbst (behoben, keine Spielfehler):**

- „steht davor, kein Aktionsknopf“ bei Coach Delgado, Sam, Ada, der Gegnerin an der Landstraße,
  Jonah und den Zwillingen: Der Durchlauf kannte nur die Plätze der Karte. Im Spiel schliefen
  sie nach den Tagesabläufen oder waren woanders. Das Kartenwissen stellt die Figuren jetzt mit
  derselben Regel auf wie das Spiel (`uhrwelt.ts`, `nachUhr` mit Regel 1; Tests in
  `uhrwelt.test.ts`). Dafür importiert `regeln/tagesablauf.ts` sein JSON mit Importattribut,
  sonst lädt Node das Modul nicht.
- „Steuerkreuz verdeckt von der Warteblende“: Beim Warten auf eine Uhrzeit deckt die Blende mit
  Absicht alles ab. Der Durchlauf wartet sie jetzt ab (`eingabe.ts`).

**Ergebnis:** Der letzte Lauf spielte Akt 1 vom Einzug bis zum Bahndamm (Akt 2 erreicht) in 36
Minuten: 66 Kartenwechsel, 11 Partien, 10 Aufgabenrunden, 0 Funde. Dazu gehören keine
Konsolenfehler, keine fehlenden Bilder und kein Hängen. Wie in Lauf 4 stand niemand im Weg.
Figuren und Tiere erscheinen auf den Zwischenfotos in stimmiger Größe: Erwachsene, Kinder und Tiere
im Verhältnis zueinander, innen größer wie vorgesehen.

## 3. Prüfungen

- pytest 1873 bestanden; ruff 0.14.0 ohne Befund; Stil, Typen; Vitest 3365 bestanden.
- E2E (Chromium): `abenteuer-kartenwechsel`, `abenteuer-randfaelle`, `abenteuer-leserfassung`
  mit dem neuen Aufgeben-Knopf: 12 bestanden, 4 übersprungen.
- `kartenbau` und `durchlass` für die drei Wohnzimmer: in Ordnung, 0 Befunde.

## Offen für den Autor

- Bilder für Victoria (Porträt; Sitz- und Liegebilder wie bei Victor ebenfalls nicht vorhanden)
  und für die Heldin (Sitz am Boden). Bis dahin gilt der Ersatz oben.
