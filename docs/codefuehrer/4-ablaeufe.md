# Acht Wege durch den Code

Hier ist für die wichtigsten Abläufe beschrieben, welche Dateien nacheinander beteiligt sind. In
der [Konzeptkarte](7-konzeptkarte.md) kannst du jede Datei anklicken und den Weg verfolgen.

### 4.1 Die App startet

1. `main.tsx` lädt Schriften und Aussehen, meldet den Service Worker an (`app/offline.ts`),
   stellt die Sprache ein (`app/sprachwahl.ts`) und lädt deine gespeicherten Daten
   (`speicher/speicher.ts`).
2. `app/App.tsx` zeigt den Bildschirm oben auf dem Stapel (`app/stapel.ts`), beim Wiederkommen den
   zuletzt offenen (`app/stapelMerker.ts`). Ein Sprung in der Adresse wie „#abb-6.20“ oder ein
   geteilter Aufgabenlink „#aufgabe-…“ öffnet gleich die passende Seite (`app/spruenge.ts`).
3. Die Startanimation mit dem goldenen Springer (`ui/komponenten/rahmen/Startanimation.tsx`)
   zeigt, wenn seit dem letzten Start ein Orden oder Abzeichen dazukam, dieses Stück
   (`ui/komponenten/ordenkunst/useStartorden.tsx`).
4. Beim allerersten Start fragt die Startwahl „Wie möchtest du starten?“ (siehe 4.8).
5. Im Hintergrund prüft `app/offlineKern.ts`, ob eine neue Version da ist; dann erscheint
   `UpdateHinweis`.

### 4.2 Eine Abbildung öffnen und ein Werkzeug anwenden

1. `ui/bildschirme/Buch.tsx`: Du tippst eine Abbildungsnummer; `daten/finde.ts` versteht sie.
   Oder die Kachel „Weiterlesen“ der Karte „Heute“ führt zur nächsten Abbildung.
2. `ui/bildschirme/Abbildung.tsx` lädt das Kapitel (`ui/komponenten/bausteine/useDaten.ts` →
   `daten/laden.ts`) und zeigt das Brett mit den Markierungen des Buches
   (`ui/komponenten/abbildung/buchmarkierungen.ts` → `ui/brett/Brett.tsx`).
3. Du wählst ein Werkzeug in der Leiste oder am Brett (`Werkzeugleiste.tsx`, `Brettsymbole.tsx`,
   `useWerkzeugwahl.ts`).
4. `ui/komponenten/werkzeugwahl/werkzeugergebnis.ts` ruft das Werkzeug über das Verzeichnis
   `analyse/register.ts` auf, zum Beispiel `analyse/k1-zaehlen.ts`. Es nutzt das Stellungsprofil
   (`analyse/stellungsprofil.ts`) und darunter die Schachbausteine aus `schach/`
   (`angriffskarte.ts`, `abtausch.ts`).
5. Die Sätze zeigt `ui/komponenten/werkzeugkarten/Werkzeugkarte.tsx` unter dem Brett
   (`ui/bildschirme/AbbildungKarten.tsx`), die Marken erscheinen auf dem Brett.
6. Auf Wunsch bewertet die Engine die Stellung (`EngineKarte.tsx` → `engine/engineDienst.ts` →
   Stockfish).
7. Nach 30 Sekunden gilt die Abbildung als angesehen (`ui/komponenten/abbildung/useGesehen.ts`);
   das zählt für Fortschritt, Erfahrungspunkte und Lernpfad.

### 4.3 Eine Partie gegen einen Bot: Wie entsteht sein Zug?

1. `ui/bildschirme/Spielen.tsx`: Die Karte „Schnell eine Partie“ schlägt einen passenden Bot vor
   (`ui/komponenten/spielstart/vorschlag.ts`); andere Gegner gibt es auf den Unterseiten
   (`spielstart/seiten/GegnerAussuchen.tsx` und weitere). Farbe, Uhr, Wertung und Eröffnung
   stehen im Blatt „Partie einstellen“ (`spielstart/PartieEinstellen.tsx`).
2. „Spielen“ legt über `spielstart/useSpielwahl.ts` eine Partie an (`spiel/partie.ts`,
   gespeichert über `speicher/partien.ts`).
3. `ui/bildschirme/Partie.tsx` mit dem Hook `ui/komponenten/partie/usePartie.ts`: Du ziehst am
   Brett, `spiel/ablauf.ts` spielt den Zug und drückt die Uhr.
4. Ist der Bot am Zug, holt `ui/komponenten/partie/botzug.ts` seinen Zug:
   - In der Eröffnung spielt er oft einen Zug aus dem **Praxisbuch** (`engine/praxisbuch.ts`):
     so, wie echte Menschen seiner Stärke auf Lichess eröffnen.
   - Danach geht es über `spiel/enginezug.ts` zu `engine/zugwahl.ts`: Die Engine liefert
     Kandidatenzüge (`engine/grundschicht.ts`), `engine/menschenwahl.ts` wählt menschlich, und
     `engine/wahlmodell.ts` gibt jedem Kandidaten eine Wahrscheinlichkeit, wie ein Mensch dieser
     Wertung ihn wählen würde. Maia (`engine/maia.ts`) steuert ab dem zehnten Halbzug ihre
     Einschätzung bei, wenn sie geladen ist; sie rechnet in einem eigenen Hintergrund-Thread
     (`engine/maia-web.ts` → `engine/maiaWorker.ts`). Charakter und Stil des Bots verschieben die
     Gewichte (`engine/wahlschritt.ts`, `engine/stile.ts`), Fehlerarten und blinde Flecken kommen
     in der Häufigkeit dazu, die Menschen dieser Stärke zeigen (`engine/menschenprofil.ts`,
     `engine/fehlerart*.ts`).
   - `spiel/botzeit.ts` und `engine/bedenkzeit.ts` lassen ihn so lange „nachdenken“, wie ein
     Mensch es täte, und ziehen die Zeit von seiner Uhr ab; in größter Zeitnot zieht er vor
     (`spiel/notmodus.ts`).
   - Im Gruppenmodus wählt jeder Bot der Gruppe einen Zug, und die Gruppe stimmt ab
     (`engine/gruppenwahl.ts`).
5. `ui/brett/Zuganimation.tsx` lässt die Figur gleiten, `spiel/ergebnis.ts` prüft nach jedem Zug,
   ob die Partie zu Ende ist.
6. Ist sie zu Ende, ruft `botzug.ts` einmal die Liste `NACH_PARTIEENDE`
   (`speicher/partieprotokoll.ts`) auf: Eintrag ins Tagesprotokoll, Rekorde, Duellbilanz und
   Rivale, eigene Ziele.

### 4.4 Die Partie ist zu Ende: Auswertung und Spielstärke

1. `ui/komponenten/auswertung/useAuswertung.ts` lässt die Engine jede Stellung der Partie
   bewerten, schon während der Partie, wenn du am Zug bist. Dafür gibt es eine **eigene
   Engine** (`auswertungsEngine` in `engine/engineDienst.ts`) auf einem anderen Kern, damit die
   Auswertung nicht jedem Zug des Bots weichen muss.
2. `spiel/auswertung.ts` gibt jedem Zug eine Klasse und ein Zeichen (bester Zug, Theoriezug,
   Ungenauigkeit, Fehler …); `schach/theorie.ts` erkennt Theoriezüge, `spiel/phasen.ts` die
   Phasen.
3. `spiel/genauigkeit.ts` rechnet die Genauigkeit je Seite und je Phase; `spiel/elomodell.ts` macht
   daraus eine geschätzte Elo-Zahl (geeicht an 77 000 Lichess-Partien).
4. Bei einer gewerteten Partie rechnet `spiel/wertung.ts` deine Wertung weiter, mit der
   gemessenen Stärke des Bots (`engine/botstaerke.ts`) als Gegnerzahl.
5. Die Oberfläche zeigt das in `Auswertung.tsx`: zuerst die **Zeitleiste** der Partie mit ihren
   wichtigen Momenten (`momente.ts`, `Zeitleiste.tsx`; ein Tipp springt aufs Brett), darunter „In
   Zahlen“ (`Zahlen.tsx` mit `Spielstaerke.tsx`, `Zugklassen.tsx`, `Verlaufskurve.tsx`). Beim
   Nachspielen erklärt die Karte unter dem Brett jeden Zug (`rueckblick/Rueckblickkarte.tsx`).
6. Im Profil erscheint die Wertung in der Karte „Deine Wertung“
   (`ui/komponenten/wertung/Wertungskarte.tsx`).

### 4.5 Eine Trainingsrunde

1. `ui/bildschirme/Training.tsx` zeigt oben den Stapel fälliger Wiederholungen und je Teil des
   Buches eine Wischreihe mit Trainern (`training/trainer.ts`, `komponenten/training/trainerreihen.ts`).
2. `ui/bildschirme/Trainer.tsx` öffnet zuerst die **Startkarte** des Trainers
   (`ui/trainer/startkarte/Startkarte.tsx`, Inhalt aus `trainerstarts.ts`): Stufe, Thema und Modus
   wählen, die letzte Wahl merkt sich das Gerät (`useGemerkt.ts`). Dann folgt der Bereich, etwa
   `ui/trainer/TaktikBereich.tsx`.
3. Die Logik im Ordner `training/` wählt die Aufgaben (`training/taktiktrainer.ts`), oft aus den
   Abbildungen des Buches (`training/buchstellungen.ts`).
4. `ui/trainer/useRunde.ts` und `Rundenrahmen.tsx` führen durch die Runde; je Aufgabe eine
   Aufgabendatei (`Taktikaufgabe.tsx`). Jede Antwort geht ins Antwortprotokoll je Thema
   (`speicher/themenprotokoll.ts`), am Ende speichert `speicher/fortschritt.ts` die Runde und
   trägt sie ins Tagesprotokoll ein. Falsch gelöste Aufgaben aus Taktik, „Falle oder Köder“,
   Strukturerkenner und Endspieltrainer kommen als Karte in die Wiederholung
   (`ui/trainer/kartenantwort.ts` → `training/wiederholung.ts`).
5. Am Rundenende zeigt `Rundenrahmen.tsx` die Meldungen der Liste `NACH_DER_RUNDE`
   (`ui/trainer/nachDerRunde.ts`): neuer Rekord, Fundstück, neue Medaille der Meisterschaft.

### 4.6 Speichern, Sichern, Offline

- Jede Änderung (Zug, Haken, Einstellung) geht über `speicher/speicher.ts` sofort in die
  Datenbank des Geräts. Der Aufbau der Daten hat eine Versionsnummer (`speicher/format.ts`,
  heute 7); alte Stände werden beim Laden umgewandelt.
- `speicher/sicherung.ts` packt alles in eine Datei zum Sichern und spielt sie wieder ein.
- `sw.ts` hält alle Dateien der App bereit, damit sie ohne Netz startet; Englisch lädt erst, wenn
  man es wählt (`sw/sprachpakete.ts`), das Maia-Paket nur auf Wunsch (`app/maiapaket.ts`).

### 4.7 Belohnungen: Erfahrung, Orden, Abzeichen, Woche

- **Nichts davon wird extra gespeichert, wo es sich rechnen lässt.** Erfahrungspunkte und Stufe
  (`ui/komponenten/fortschritt/erfahrung.ts`), Orden (volle Ringe,
  `fortschritt/ringrechnung.ts`) und die meisten Abzeichen (`fortschritt/abzeichen.ts`) folgen aus
  dem, was schon im Speicher steht: angesehene Abbildungen, gelöste Übungen, Trainerrunden,
  Partien, besiegte Bots.
- Neu gespeichert werden nur wenige Felder (`speicher/gamifizierung.ts`): das Tagesprotokoll
  (`speicher/aktivitaet.ts`, je Tag was du getan hast), das Antwortprotokoll je Thema, Rekorde,
  Duelle, Wochenziel und Aufträge, Übungsplan, eigene Ziele, Fundstücke und das Datum, an dem ein
  Stück zuerst gefeiert wurde (`speicher/verdient.ts`). Seitdem hat das Datenformat die Version 7.
- Aus dem Tagesprotokoll rechnen Wochenziel (`training/wochenziel.ts`), Wochenaufträge
  (`training/wochenauftraege.ts`) und Monatsrückblick (`training/rueckblickinhalt.ts`); aus dem
  Antwortprotokoll die Meisterschaft (`training/meisterschaft.ts`).
- Angezeigt wird das in der Karte „Heute“ oben im Buch (`ui/komponenten/start/Heutekarte.tsx`),
  auf dem Lernpfad (`ui/bildschirme/Lernpfad.tsx`), in „Deine Erfolge“ im Profil
  (`ui/komponenten/erfolge/Erfolge.tsx`) mit dem Infofenster je Stück und in den Profilkarten
  (`ui/komponenten/profilkarten/`).

### 4.8 Der erste Start: Startwahl und Touren

1. `tour/TourAngebot.tsx` fragt einmal „Wie möchtest du starten?“: „Ich lese das Buch“, „Ich will
   spielen und auswerten“, „Erst umsehen“ oder „Später“. Mit `?start=buch` in der Adresse
   (QR-Code im Buch) beginnt der Buch-Weg ohne Frage.
2. Die ersten beiden Wege sind eigene Touren (`tour/starttouren.ts`), „Erst umsehen“ ist die kurze
   Haupttour (`tour/touren.ts`). `tour/TourEbene.tsx` dunkelt den Bildschirm ab und rahmt das Ziel
   jedes Schritts golden ein; `tour/tourlogik.ts` weiß, welcher Schritt als Nächstes kommt.
3. Später startet das Toursymbol oben rechts (`tour/TourKnopf.tsx`) die Tour der gezeigten Seite;
   Einstellungen › Hilfe öffnet die Startwahl wieder.

---

Zurück zur [Übersicht](README.md) · Diese Seite bearbeiten: auf GitHub oben rechts das Stift-Symbol.
