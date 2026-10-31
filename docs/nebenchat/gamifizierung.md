# Gamifizierung: Vorrecherche, Umsetzungsvorschläge und Aufträge

Stand 31.10.2026 · Nebenchat (Zweig `neben-orden`) · Grundlage für den Haupt-Chat, der die
Umsetzung auf parallele Arbeitschats verteilt. Code-Stand: main 0.3.15 plus Zweig `neben-orden`
(Orden und Abzeichen mit eigenen Bildern).

Alle Pfade ohne Vorsilbe beziehen sich auf `app/src/`. Texte in Anführungszeichen sind Entwürfe
für die Oberfläche; sie gelten nach Regel 9 als vorläufig abgesegnet.

## Inhalt

1. Ziel und Leitlinien (Forschung, Grenzen des Autors)
2. Was es schon gibt
3. Gemeinsame Grundlagen G1 bis G5 (zuerst bauen)
4. Die dreizehn Pakete P1 bis P13
5. Wellenplan und Konfliktkarte
6. Entscheidungen des Autors (mit Empfehlung)
7. Vorlage für die Aufträge an die Arbeitschats
8. Quellen

---

## 1. Ziel und Leitlinien

**Ziel:** Leser, besonders Jugendliche und junge Erwachsene, üben häufiger und länger mit der
App, weil sie Fortschritt sehen, selbst Ziele setzen und kleine Erfolge feiern. Alles bleibt auf
dem Gerät, freiwillig und ohne Druck.

**Was die Forschung sagt (Kurzfassung):**

- Gamifizierung im Lernen wirkt messbar, aber klein bis mittel (Meta-Analysen: kognitiv
  g ≈ 0,49, motivational g ≈ 0,36, Verhalten g ≈ 0,25). Viele Studien sind kurz; ein Teil ist
  Neuheitseffekt. Folge für uns: Spielelemente müssen das Lernen am Buch stützen, nicht ersetzen,
  und dürfen nach Wochen nicht leer laufen.
- Nach der Selbstbestimmungstheorie tragen drei Bedürfnisse: **Kompetenz** (ich werde besser),
  **Autonomie** (ich entscheide), **Verbundenheit** (ich gehöre dazu). Belohnungen helfen, wenn sie
  Rückmeldung über Können geben (informierend), und schaden, wenn sie kontrollieren oder fest für
  Tätigkeiten versprochen werden, die man ohnehin gern tut (Deci, Koestner, Ryan 1999:
  untergrabende Wirkung erwarteter, greifbarer Belohnungen; unerwartete Belohnungen und
  Rückmeldung schaden nicht).
- **Ziel-Gradient und geschenkter Fortschritt:** Je näher ein Ziel, desto größer der Einsatz;
  wer sichtbar schon ein Stück geschafft hat, hält eher durch (Waschstraßen-Versuch: 34 % statt
  19 % bis zur Belohnung bei gleich vielen nötigen Schritten). Fortschritt muss sichtbar und
  ehrlich sein.
- **Serien** sind der stärkste Bindungsmechanismus von Duolingo, wirken aber über Verlustangst
  und kippen leicht in Druck. Die App hat das schon entschärft (Serie verfällt nicht, 0.3.13).

**Grenzen des Autors (fest):** keine Bestenliste und kein Vergleich mit Fremden, keine Daten an
Dritte, keine Werbung, nichts verfällt, kein Druck durch Verlustangst, Texte bleiben freiwillig im
Ton. Daraus folgen für alle Pakete:

- Belohnungen nur für Lernen und Spielen mit Inhalt, nie fürs bloße Antippen.
- Kein Element bestraft Pausen. Verpasstes wird nicht gezählt, aber auch nicht abgezogen.
- Feiern kurz und abschaltbar (Ton, „Bewegung reduzieren“, neuer Schalter „Feiereffekte“, G3).
- Alles, was heute frei wählbar ist, bleibt frei; freischaltbar ist nur Neues (P7).

---

## 2. Was es schon gibt

| Element | Ort | Daten |
| --- | --- | --- |
| Fortschrittsringe, Orden (18) | `ui/komponenten/fortschritt/fortschrittsringe.ts`, `ringrechnung.ts`, `ordenkunst/` | abgeleitet; Merker `ringeGefeiert` |
| Erfahrungspunkte, 10 Stufen | `fortschritt/erfahrung.ts` (`GEWICHTE`, `STUFEN`, `grundlageAus`) | abgeleitet, nicht gespeichert |
| Abzeichen (18) | `fortschritt/abzeichen.ts`, `abzeichenstand.ts`, `Abzeichenmeldung.tsx` | abgeleitet; Merker `abzeichenGefeiert`, `stufeGefeiert` |
| Gratulation mit Feuerwerk und Ton | `fortschritt/Ringfeier.tsx`, `bausteine/Feuerwerk.tsx`, `app/ton.ts` | – |
| Tagesaufgabe mit Serie ohne Verfall | `training/kurzplaene.ts`, `ui/trainer/ZeitrundeBereich.tsx` | Merker `tagesserie` |
| Taktik auf Zeit mit Bestwert | `ui/trainer/ZeitrundeBereich.tsx` | Merker `taktikzeitBeste` |
| Gruppenmodus der Bots freischalten | `engine/gruppe.ts`, `gegner/Gruppenmodus.tsx` | `spiel.besiegt` |
| Wiederholungskarten (5 Kästen) | `training/wiederholung.ts`, `training/FaelligeWiederholungen.tsx` | `karten` |
| Startanimation mit neuem Stück, Punkt an „Profil“ | `ordenkunst/useStartorden.tsx`, `rahmen/Leiste.tsx` | Merker `ordenBekannt`, `ordenUngesehen` |
| Vorschlag aus der Fehlerdatenbank | `training/fehlerdatenbank.ts` (`vorschlag`) | `fehler` |

**Lücken, die mehrere Pakete betreffen (Befund der Code-Durchsicht):**

- Richtige Antworten in Trainern werden **nirgends je Aufgabe oder Motiv** gespeichert:
  `notiereTrainerantwort` legt nur bei Fehlern eine Karte an; `fortschritt.trainer` zählt nur
  Summen je Trainer. Ein Stand je Buchthema (P1, P3, P12) ist heute nicht ableitbar.
- Es gibt **kein lückenloses Tagesprotokoll**: `trainer.zuletzt` und `uebungen.zuletzt` halten
  nur den letzten Zeitpunkt; `lernzeiten()` in `abzeichen.ts` sieht daher nicht jeden Lerntag
  (P4, P6, P12).
- `spiel.wertung` (Wertungspunkt) enthält **keine Bot-Kennung**; `spiel.partien` hält nur die
  letzten 50 Partien. Kopf-an-Kopf-Bilanzen je Bot (P8) brauchen ein eigenes Feld.
- Wann ein Orden oder Abzeichen verdient wurde, ist **nirgends mit Datum** gespeichert
  (Monatsrückblick P12, Teilen P9).
- Merker liegen im localStorage und gehen **nicht in die Datensicherung**. Alles, was Leser als
  Besitz empfinden (Rekorde, Duelle, Fundstücke), gehört in den Speicher (`speicher/format.ts`).

---

## 3. Gemeinsame Grundlagen (Welle 0, zuerst bauen)

Diese Grundlagen verhindern, dass mehrere Arbeitschats gleichzeitig dieselben Dateien umbauen.
Empfehlung: ein einziger Chat (oder der Haupt-Chat selbst) baut G1 bis G5 in einem Zug.

### G1 Antwortprotokoll je Aufgabe und Thema

- **Zweck:** Grundlage für „nächster Schritt“ (P1), Meisterschaft (P3), Monatsrückblick (P12).
- **Speicher (neu):** `themen: Record<Themenkennung, Themenstand>` mit
  ```ts
  interface Themenstand {
    richtig: number;            // Summe
    falsch: number;             // Summe
    letzte: string;             // die letzten 20 Antworten als "rrfr…" (r = richtig, f = falsch)
    tage: string[];             // bis 12 verschiedene Tagesschlüssel mit mindestens einer richtigen Antwort
    zuletzt: string;            // ISO-Zeitpunkt
  }
  ```
  `Themenkennung` = `"taktik:<motiv>"` (die 12 `MOTIVE` aus `training/taktiktrainer.ts`),
  `"endspiel:<thema>"` (`trainer-endspiel.ts`, Feld `thema`), `"struktur:<struktur>"`
  (`trainer-struktur.ts`), `"falle"`. Übungen des Buches tragen nur ein Freitext-Motiv; sie
  zählen vorerst nur über ihr Kapitel (`kapitel:<n>`).
- **Schreiben:** an einer Stelle, in `speicher/fortschritt.ts` als neue Funktion
  `notiereThemenantwort(daten, thema, richtig, jetzt)`, aufgerufen aus
  `ui/trainer/kartenantwort.ts` (`antworteMitKarte`), das jede Trainerantwort schon kennt. Die
  Aufgabe liefert ihr Thema (Taktik `motiv`, Endspiel `thema`, Struktur `struktur`).
- **Lesen:** reine Funktionen in neuem `training/themenstand.ts`:
  `themenquote(stand)`, `staerkstesThema`, `schwaechstesThema` (nur Themen mit mindestens
  8 Antworten), `meisterschaft(stand)` (siehe P3).
- **Tests:** Zählung, Abschneiden auf 20 und 12, Tage ohne Doppel, Daten ohne Feld laden.

### G2 Aktivitätsprotokoll je Tag

- **Zweck:** Wochenziel (P4), Wochenaufträge (P6), Rekorde (P5), Monatsrückblick (P12),
  „nichts verfällt“-Darstellungen.
- **Speicher (neu):** `aktivitaet: Record<Tagesschluessel, Partial<Record<Aktivitaetsart, number>>>`,
  höchstens 400 Tage (ältere werden beim Schreiben entfernt).
  `Aktivitaetsart` = `abbildung`, `uebung`, `uebungGeloest`, `warum`, `eingeschaetzt`,
  `lernziel`, `trainerAntwort`, `trainerRichtig`, `trainerRunde`, `karte`, `partie`, `sieg`,
  `sammlung`, `fehler`, `tagesaufgabe`.
- **Schreiben:** in den vorhandenen `notiere…`-Funktionen von `speicher/fortschritt.ts`
  (`markiereGesehen`, `notiereUebung`, `notiereTrainerantwort`, `notiereDurchgang`,
  `notiereWarumfrage`, `notiereEinschaetzung`), in `app/lernstand.ts` (`schalteLernziel`), beim
  Partieende (Spiel speichern, `speicher/partien.ts`) und beim Anlegen von Sammlung und Fehler.
  Hilfsfunktion `zaehleAktivitaet(daten, art, jetzt)` in neuem `speicher/aktivitaet.ts`;
  `tagesschluessel` aus `training/kurzplaene.ts` wiederverwenden (Ortszeit des Geräts).
- **Lesen:** `lerntage(aktivitaet, von, bis)`, `summeIn(aktivitaet, art, von, bis)`,
  `wochenbeginn(datum)` (Montag, ISO-Woche).
- **Hinweis:** Bestehende Daten haben kein Protokoll; Auswertungen beginnen mit dem Update. Für
  die Vergangenheit kann `lernzeiten()` einmalig ein grobes Protokoll nachtragen (nur „irgendwas
  gelernt“ je Tag), damit Monatsrückblick und Wochenziel nicht leer starten.

### G3 Belohnungen an einer Stelle

- **Abzeichen als Liste aus Teillisten:** `ABZEICHEN` in `fortschritt/abzeichen.ts` wird aus
  Teillisten zusammengesetzt (`abzeichen-grund.ts` mit den heutigen 18, je Paket eine eigene
  Datei, etwa `abzeichen-wochen.ts`). So fügen parallele Chats Abzeichen hinzu, ohne dieselbe
  Datei zu ändern. Ebenso die Bildangaben in `ordenkunst/entwuerfe.ts` (`NACHTABZEICHEN` aus
  Teillisten). Jedes neue Abzeichen bekommt ein eigenes Bild im Nachtstil (Form, Motiv, Akzent).
- **Erfahrungspunkte erweitern:** `Erfahrungsgrundlage` und `GEWICHTE` bekommen die neuen
  Quellen der Pakete vorab mit Gewicht 0 (Felder `wochenErreicht`, `auftraege`, `meisterschaften`,
  `rekorde`, `duelleGewonnen`); die Pakete setzen nur noch ihr Gewicht und ihre Zählung.
- **Verdient am:** neues Speicherfeld `verdient: Record<"orden:<k>" | "abzeichen:<k>" | "rekord:<k>", string>`
  (ISO-Datum der ersten Feier). Geschrieben in `merkeGefeiert` (Ringe und Abzeichen). Für
  Monatsrückblick und Teilen.
- **Schalter „Feiereffekte“:** Merker `feiereffekte` (an/aus) in den Einstellungen neben
  „Startanimation“; `Feuerwerk.tsx`, Kombo (P10) und Startstück richten sich danach.

### G4 Plätze für Karten auf Startseiten und im Profil

- **Startkarten:** neue Komponente `ui/komponenten/start/Startkarten.tsx` mit einer Liste von
  Karten (`STARTKARTEN: { kennung, Komponente, sichtbar(daten) }[]`), eingebaut oben in
  `ui/bildschirme/Buch.tsx` (Empfehlung, siehe Entscheidung E2). Jede Karte ist eine eigene Datei;
  die Pakete tragen nur eine Zeile in die Liste ein. Höchstens zwei Karten gleichzeitig sichtbar,
  Reihenfolge fest: Nächster Schritt (P1), Wochenziel und Aufträge (P4/P6), Rivale (P8),
  Monatsrückblick (P12, nur in den ersten Tagen eines Monats).
- **Profilkarten:** ebenso eine Liste in `ui/bildschirme/Ich.tsx` für „Deine Themen“ (P3),
  „Deine Rekorde“ (P5), „Rückblicke“ (P12), „Fundstücke“ (P10).
- **Rundenende:** eine Stelle in `ui/trainer/useRunde.ts` bzw. `Rundenrahmen.tsx`, an der
  Pakete eine Meldung nach einer Runde anhängen können (`NACH_DER_RUNDE`-Liste: neuer Rekord P5,
  Fundstück P10, Teilen P9).

### G5 Speicherformat in einem Zug

- Alle neuen Felder auf einmal anlegen, mit leeren Vorgaben in den `…Aus`-Lesern von
  `speicher/format.ts`, Tests für das Laden alter Daten und alter Sicherungen:
  `themen` (G1), `aktivitaet` (G2), `verdient` (G3), `rekorde` (P5), `duelle` und `rivale`
  (P8), `wochen` (P4/P6: Ziel, Plan, angenommene Aufträge), `fundstuecke` (P10),
  `uebungsplan` (P11), `ziele` (P13).
- Empfehlung: **ohne neue Formatversion**, wie bisher bei `warum`, `eingeschaetzt`, `zugErraten`,
  `planstand`, `profil`: Ältere Leser füllen fehlende Felder leer auf; eine Sicherung aus der
  neuen Version in einer alten App verliert nur die neuen Felder. Entscheidung E1.
- Die Merker `taktikzeitBeste` und `tagesserie` wandern beim ersten Start in `rekorde` bzw.
  bleiben (Tagesserie) und werden zusätzlich in `rekorde` gespiegelt, damit sie in die
  Datensicherung kommen.
- Neue Ansichten für den Router vorab anlegen (Platzhalter in `app/stapel.ts` und `app/App.tsx`):
  `lernpfad`, `themen`, `rekorde`, `rueckblick`, `fundstuecke`. So muss in Welle 1 niemand den
  Router ändern.

**Aufwand G1 bis G5:** groß (ein Chat, etwa ein Arbeitstag). Alles in gesperrten oder gemeinsamen
Dateien; daher Haupt-Chat oder ausdrücklich freigegebener Chat.

---

## 4. Die dreizehn Pakete

Gliederung je Paket: Ziel · Ablauf mit Texten · Daten · Speicher · Dateien · Abnahme ·
Aufwand · Abhängigkeiten · offene Entscheidung.

### P1 „Dein nächster Schritt“

- **Ziel:** Beim Öffnen eine klare, kleine Handlung statt einer leeren Auswahl. Senkt die Hürde
  zum Anfangen (Autonomie bleibt durch Alternativen).
- **Ablauf:** Oben auf der Buch-Startseite eine Karte:
  - Titel „Dein nächster Schritt“, darunter ein Satz und ein Knopf, z. B.
    - „4 Wiederholungen sind fällig. Etwa 3 Minuten.“ → „Wiederholen“
    - „Die Tagesaufgabe wartet.“ → „Lösen“
    - „Weiter in Kapitel 6: Abb. 6.21, Abschnitt ‚Die Gabel‘.“ → „Weiterlesen“
    - „Zu Kapitel 6 sind noch 3 Übungen offen.“ → „Üben“
    - „Fesselungen klappen noch nicht so sicher (5 von 9 richtig). Eine kurze Runde?“ → „Üben“
    - „In deiner Fehlerdatenbank häufen sich Fehler aus Kapitel 5.“ → „Trainer öffnen“
  - Darunter klein „Lieber etwas anderes?“ klappt zwei weitere Vorschläge auf.
  - „Nicht jetzt“ blendet die Karte bis zum nächsten Tag aus.
- **Logik (rein, testbar):** neues `training/naechsterSchritt.ts`,
  `vorschlaege(daten, index, jetzt): Vorschlag[]` nach fester Rangfolge:
  1. fällige Karten ≥ 3 (`faellige` aus `training/wiederholung.ts`; Minuten ≈ Karten × 40 s),
  2. Tagesaufgabe heute offen (`tagesserie.letzterTag !== heute`),
  3. nächste ungesehene Abbildung im Kapitel von `zuletzt` (Merker `zuletzt`, Abbildungsliste aus
     `index.json`), sonst erstes Kapitel mit ungesehenen Abbildungen,
  4. offene Übungen eines Kapitels, dessen Abbildungen zu mindestens 80 % gesehen sind
     (`kapitelfortschritt`),
  5. schwächstes Thema aus G1 (mindestens 8 Antworten, Quote unter 70 %) → Trainer mit diesem
     Thema (`taktikrunde` kennt Themen),
  6. `vorschlag()` der Fehlerdatenbank.
  Ziel als `Ansicht` (`{bildschirm:"abbildung", nummer}`, `{bildschirm:"uebung", …}`,
  `{bildschirm:"trainer", kennung}`), Navigation über `useNavigation().navigiere`.
- **Speicher:** keiner; Merker `naechsterSchrittAus` (Tagesschlüssel) für „Nicht jetzt“.
- **Dateien:** neu `training/naechsterSchritt.ts` (+ Test), `ui/komponenten/start/NaechsterSchritt.tsx`,
  Eintrag in `STARTKARTEN` (G4), Texte `naechster.*`.
- **Abnahme:** Unit-Tests der Rangfolge (je Fall eine erzeugte Datenlage); Oberflächentest:
  Karte erscheint, Knopf öffnet die richtige Abbildung, „Nicht jetzt“ wirkt bis morgen.
  Testpunkt: „Öffne die App: Oben im Buch steht ‚Dein nächster Schritt‘ …“
- **Aufwand:** mittel. **Abhängig von:** G4; Fall 5 von G1 (ohne G1 entfällt er).
- **Entscheidung:** E2 (Startseite).

### P2 Lernpfad durchs Buch

- **Ziel:** Fortschritt als Weg sichtbar machen (Ziel-Gradient), die Orden der Buchteile als
  Etappenziele.
- **Ablauf:** Neuer Bildschirm „Dein Weg durchs Buch“ (Ansicht `lernpfad`), erreichbar über einen
  Knopf über der Kapitelliste der Buch-Startseite („Als Weg anzeigen“) und aus dem Profil.
  - Ein senkrechter, geschwungener Weg (SVG) mit 13 Stationen (Kapitel 0 bis 12), in fünf
    Etappen nach `BUCHTEILE` (Grundlagen 0–1, Eröffnung 2–4, Mittelspiel 5–7, Endspiel 8–10,
    Praxis 11–12). Am Ende jeder Etappe der Orden des Buchteils (Ordenkunst, als Silhouette, bis
    verdient).
  - Station: Kreis mit Kapitelnummer und Ring für den Anteil aus `kapitelfortschritt`
    (Abbildungen und Übungen gemittelt, wie `teilanteil`); fertig mit goldenem Haken.
  - Die eigene Figur steht an der aktuellen Station: das Porträt des Lesers, wenn gesetzt
    (`useSpielerprofil`), sonst der goldene Springer. Kleine Bewegung beim Öffnen von der letzten
    gemerkten Station zur aktuellen (Merker `lernpfadStation`), bei „Bewegung reduzieren“ ohne.
  - Unter der aktuellen Station: „Noch 12 Abbildungen und 4 Übungen bis zum Ende von Kapitel 6.
    Danach fehlt dir nur noch Kapitel 7 bis zum Orden ‚Teil Mittelspiel‘.“
  - Tipp auf eine Station öffnet das Kapitel.
- **Daten:** `index.json` (Kapitel, Abbildungen), `fortschritt`, `UEBUNGEN_JE_KAPITEL`,
  `ringrechnung.ts`. Ehrlich: nichts wird geschenkt; geschenkter Fortschritt entsteht nur durch
  echte Zählung (Kapitel 0 ist schnell geschafft und füllt die erste Station).
- **Speicher:** keiner (Merker `lernpfadStation`).
- **Dateien:** neu `ui/bildschirme/Lernpfad.tsx`, `ui/komponenten/lernpfad/` (Wegzeichnung,
  Station, Figur), `ui/stil/lernpfad.css`; Knopf in `Buch.tsx`; Router-Platzhalter aus G5.
- **Abnahme:** Unit-Test der Stationszustände; Oberflächentest: Station 0 nach Ansehen aller
  Abbildungen von Kapitel 0 fertig, Tipp öffnet Kapitel. Bildschirmfoto in Handygröße.
- **Aufwand:** mittel bis groß (Grafik). **Abhängig von:** G5 (Router).
- **Entscheidung:** E3 (eigener Bildschirm oder Ersatz der Kapitelliste).

### P3 Meisterschaft je Thema (Bronze, Silber, Gold)

- **Ziel:** Kompetenz sichtbar machen, ehrlich und informierend: belohnt wird Können über
  mehrere Tage, nicht Fleiß.
- **Themen:** 12 Taktikmotive (Kap. 7), Endspielthemen, Bauernstrukturen, Fallen (G1).
- **Regeln (Vorschlag):**
  - Bronze: 5 richtige Antworten im Thema.
  - Silber: 15 richtige und mindestens 70 % der letzten 20 Antworten richtig.
  - Gold: Silber und richtige Antworten an mindestens 3 verschiedenen Tagen, davon zwei mindestens
    7 Tage auseinander (verteiltes Wiederholen, Kapitel „Training“ des Buches).
  - Einmal erreicht, bleibt die Stufe (keine Verlustangst). Liegt die letzte richtige Antwort mehr
    als 60 Tage zurück, steht leise „Zum Auffrischen“ daneben (Entscheidung E4).
- **Ablauf:**
  - Profilkarte „Deine Themen“: Raster wie die Abzeichen, je Thema eine kleine Medaille
    (Ordenkunst: Form und Motiv je Thema, Rand in Bronze, Silber, Gold; offen als Silhouette),
    darunter Name und „7 von 15“ bis zur nächsten Stufe. Tipp: Bedingung und Knopf „Üben“ (öffnet
    den Trainer mit diesem Thema).
  - Nach einer Runde, wenn eine Stufe erreicht wurde: Meldung „Fesselung: Silber!“ (G4,
    Rundenende), mit kurzem Glanz.
  - Neue Abzeichen (eigene Teilliste, G3): „Erstes Gold“, „Fünf Themen in Silber“,
    „Alle Taktikmotive in Gold“.
  - Erfahrungspunkte: Bronze 10, Silber 25, Gold 50.
- **Daten/Speicher:** nur G1; Stufen werden abgeleitet. „Gefeiert“ über G3 (`verdient`).
- **Dateien:** neu `training/meisterschaft.ts` (+ Test), `ui/komponenten/themen/Themenkarte.tsx`,
  `ordenkunst/themenbilder.ts`, Abzeichen-Teilliste, Texte `themen.*`; Profilkarte (G4).
  Gesperrt berührt: Taktiktrainer nur zum Öffnen mit Thema (vorhanden, `taktikrunde`).
- **Abnahme:** Unit-Tests der Stufenregeln (Tage, Abstand, Quote); Oberflächentest mit
  vorbereiteten Daten. Testpunkt mit Probe über die Aufgabenseite („Thema zur Probe auf Silber“).
- **Aufwand:** groß. **Abhängig von:** G1, G3, G4.

### P4 Wochenziel, selbst gewählt

- **Ziel:** Autonomie und Gewohnheit ohne Druck. Ersetzt die Rolle der täglichen Serie als
  Hauptmotor (Q5-2 des Autors).
- **Ablauf:**
  - Startkarte, solange kein Ziel gesetzt ist: „Wie oft willst du pro Woche üben?“ mit Knöpfen
    2, 3, 4, 5, 7 Tage und „Später“.
  - Mit Ziel: Karte „Deine Woche“ mit sieben Punkten (Mo bis So), gefüllte Punkte für Lerntage
    (G2), Ring „2 von 3 Tagen“. Text erreicht: „Wochenziel geschafft. Schön!“ (kleines Feuerwerk,
    einmal je Woche). Text offen am Sonntag: „Noch ein Tag für dein Ziel, wenn du magst.“
  - Kein Zurücksetzen: gezeigt wird „Wochen mit erreichtem Ziel: 7“ und „Beste Folge: 4 Wochen“.
    Eine verpasste Woche wird nicht erwähnt.
  - Ziel jederzeit änderbar (Einstellungen › Training und Tipp auf die Karte).
  - Als Lerntag zählt ein Tag mit mindestens einer Aktivität aus G2 außer bloßem Öffnen; Vorschlag:
    mindestens eine Abbildung, eine Übung, eine Trainerantwort, eine Karte oder eine Partie.
  - Erfahrungspunkte: erreichte Woche 30. Abzeichen: „Vier Wochen Ziel erreicht“,
    „Zwölf Wochen Ziel erreicht“ (nicht hintereinander nötig).
- **Speicher:** `wochen.ziel: number | null`; erreichte Wochen werden aus G2 abgeleitet.
- **Dateien:** neu `training/wochenziel.ts` (+ Test), `ui/komponenten/start/Wochenkarte.tsx`,
  Abzeichen-Teilliste `abzeichen-wochen.ts`, Texte `woche.*`.
- **Abnahme:** Unit-Tests (Wochengrenze Montag, Zeitzone, Ziel geändert mitten in der Woche
  gilt ab sofort); Oberflächentest mit gesetztem Protokoll.
- **Aufwand:** mittel. **Abhängig von:** G2, G3, G4.
- **Entscheidung:** E5 (Vorgabe, Verhältnis zur Tagesserie).

### P5 Rekordtafel

- **Ziel:** Wettbewerb mit sich selbst statt Bestenliste.
- **Rekorde (Quelle):**
  | Rekord | Quelle |
  | --- | --- |
  | Taktik auf Zeit (richtige in 3 min) | heute Merker `taktikzeitBeste` → `rekorde` |
  | Aufgabenserie ohne Fehler (Q5-1 b) | neu, siehe unten |
  | Beste Tagesserie | Merker `tagesserie.beste` (gespiegelt) |
  | Höchste Wertung | Maximum `spiel.wertung[].wertung` beim Speichern einer Partie |
  | Stärkster besiegter Bot | `besiegt` + `engine/botstaerke.ts` (`gegnerstaerke`) |
  | Längste Partie ohne Patzer (Halbzüge) | beim Auswerten einer Partie (`spiel/auswertung.ts`, Zugklassen) |
  | Meiste Lerntage in einer Woche | G2 |
  | Beste Trefferquote „Zug erraten“ (eine Partie) | `zugErraten` |
  Jeder Rekord mit Datum.
- **Aufgabenserie ohne Fehler:** neuer Modus im Taktiktrainer „Serie“: Aufgaben steigender
  Schwierigkeit ohne Uhr, ein Fehler beendet die Serie, Ergebnis „12 in Folge“. Gehört in den
  Taktiktrainer (gesperrt) → eigener kleiner Auftrag an den Haupt-Chat oder Freigabe.
- **Ablauf:** Profilkarte „Deine Rekorde“ (Liste mit Wert, Datum, Knopf „Versuchen“ zum
  passenden Trainer). Neuer Rekord am Rundenende: „Neuer Rekord: 14 richtig in 3 Minuten (vorher
  11).“ Abzeichen „Drei Rekorde verbessert“.
- **Speicher:** `rekorde: Record<Rekordkennung, { wert: number; datum: string }>`.
- **Dateien:** neu `training/rekorde.ts` (+ Test), `ui/komponenten/rekorde/Rekordtafel.tsx`,
  Meldung am Rundenende (G4); Schreiben an den Quellen (Zeitrunde, Partieende, Auswertung) —
  Partie und Auswertung sind gesperrt: dort nur ein Aufruf `pruefeRekorde(daten, ereignis)`.
- **Abnahme:** Unit-Tests (nur echte Verbesserung zählt, Übernahme der Merker); Oberflächentest
  Zeitrunde → Meldung „Neuer Rekord“.
- **Aufwand:** mittel (ohne Serienmodus), plus klein für den Serienmodus.
- **Abhängig von:** G3, G4, G5.

### P6 Wochenaufträge

- **Ziel:** Abwechslung und Lenkung zu Bereichen, die man sonst auslässt; Wahl statt Pflicht.
- **Ablauf:**
  - Montags erscheinen drei Aufträge in der Wochenkarte (P4), fest für die Woche (Zufall mit
    Saat aus Wochennummer, `training/zufall.ts`, `festerZufall`), passend zum Stand:
    - „Sieh dir 10 Abbildungen aus Kapitel 7 an.“ (nächstes Kapitel mit Lücken)
    - „Löse 3 Übungen.“
    - „Spiele eine Runde im Endspieltrainer.“ (ein Trainer, der lange nicht dran war,
      `trainer[k].zuletzt`)
    - „Besiege einen Bot der Stufe 4.“ (eine Stufe über der höchsten besiegten)
    - „Beantworte 3 Warum-Fragen.“ / „Hake ein Lernziel ab.“ / „Arbeite deine fälligen Karten ab.“
    - „Trage einen Fehler aus einer Partie in die Fehlerdatenbank ein.“
  - Jeder Auftrag mit Fortschritt „1 von 3“ aus G2 (Summe seit Wochenbeginn) und Knopf, der
    direkt hinführt. Erledigt: Haken und 15 Erfahrungspunkte. Nicht erledigt: verschwindet am
    Sonntag ohne Hinweis.
  - „Tauschen“ (einmal je Woche je Auftrag) gibt einen anderen Auftrag: Autonomie.
  - Monatsabzeichen „Acht Aufträge in einem Monat“ (je Monat neu verdienbar, bleibt).
- **Speicher:** `wochen.auftraege: { woche: string; liste: Auftrag[]; getauscht: number[] }`
  (die Liste wird festgehalten, damit sie sich nicht durch neue Daten ändert).
- **Dateien:** neu `training/wochenauftraege.ts` (+ Test), Teil der Wochenkarte (P4),
  Abzeichen-Teilliste, Texte `auftrag.*`.
- **Abnahme:** Unit-Tests (gleiche Woche → gleiche Aufträge; Fortschritt nur seit Montag;
  Tauschen); Oberflächentest: Auftrag „3 Abbildungen ansehen“ wird nach drei Abbildungen
  erledigt.
- **Aufwand:** mittel. **Abhängig von:** G2, G3, P4 (Karte).

### P7 Freischaltbare Extras

- **Ziel:** Etwas zum Vorzeigen, das man nur durch Lernen bekommt; für Jugendliche stark.
- **Grundsatz:** Alles Bestehende bleibt frei. Neu und nur verdienbar:
  | Extra | Bedingung (Vorschlag) |
  | --- | --- |
  | Rahmen ums Porträt in Bronze, Silber, Gold | Stufe 3, 6, 9 |
  | Brettfarbe „Nacht und Gold“ (passend zu den Orden) | alle Orden der Buchteile |
  | Figurensatz „Gold“ (umgefärbter freier Satz, GPLv2+) | Stufe 5 |
  | Porträt-Zubehör: Krone, Lorbeer, Medaille am Kragen, Schachbrett-Schal | je ein Gold-Thema (P3) / Orden |
  | Titel unter dem Namen („Fesselungsprofi“, „Endspielkenner“) | Gold in einem Thema |
  | Konfettifarben der Feiern | Stufe 2 |
  In der Auswahl stehen gesperrte Extras als Silhouette mit Bedingung („Ab Stufe 5“).
- **Daten:** Freischaltung abgeleitet (Stufe, Orden, Meisterschaft); Wahl in vorhandenen Feldern
  (`einstellungen.brettfarben`, `figurensatz`, `profil.bild.merkmale`).
- **Speicher:** keiner neu; `BRETTARTEN` und `BILDSAETZE` in `speicher/format.ts` erweitern
  (gesperrt, G5 oder Haupt-Chat). Wird eine Sicherung mit freigeschaltetem Extra in eine App ohne
  Freischaltung geladen, bleibt die Wahl gültig (nie wegnehmen).
- **Dateien:** `ui/brett/masse.ts` (Farbe), `public/figuren/gold/` (SVG, Lizenz in
  `Lizenzen.tsx`, `public/lizenzen`, `pipeline/figuren/saetze/LIZENZEN.md`),
  `einstellungen/EinstellungenKarte.tsx` (Sperre und Hinweis), `ui/profil/merkmale.ts` und
  `eigeneTeile.ts` (Zubehör; gesperrt), neu `training/extras.ts` (Freischaltregeln + Test).
- **Abnahme:** Unit-Test der Regeln; Oberflächentest: gesperrtes Extra zeigt Bedingung, nach
  Probe-Stufe wählbar.
- **Aufwand:** mittel (Grafik). **Abhängig von:** G3; Teile von P3.
- **Entscheidung:** E8 (welche Extras).

### P8 Rivalen unter den Bots

- **Ziel:** Eine kleine Geschichte und ein Gegenüber; Verbundenheit ohne andere Menschen.
- **Ablauf:**
  - Startkarte im Bereich Spielen (oben in `Spielen.tsx`) und als Startkarte (G4): Porträt,
    „Dein Rivale: Lotte“, „Euer Duell: 1 : 2“, Spruch des Bots, Knopf „Revanche“ (startet die
    gewohnte Partie gegen diesen Bot, gewertet, letzte Zeitart).
  - Wahl des Rivalen: ein Bot mit Stärke 50 bis 150 Punkte über der eigenen Wertung
    (`gegnerstaerke`), den man noch nicht gewertet besiegt hat; bei Gleichstand der mit den meisten
    Partien gegen den Leser. Ohne Wertung: ein Bot der niedrigsten nicht besiegten Stufe.
  - Duell gewonnen beim ersten gewerteten Sieg: kurze Feier „Lotte gratuliert: ‚Gut gespielt!‘“,
    neuer Rivale wird vorgestellt. Erfahrungspunkte 40, Abzeichen „Drei Rivalen besiegt“,
    „Zehn Rivalen besiegt“.
  - Sprüche nach Charakter (`CHARAKTERE` in `engine/gegnerbau.ts`), je Charakter vier: Begrüßung,
    nach Sieg des Bots, nach Remis, nach Niederlage. Beispiel „Angreifer“: „Revanche? Ich greife
    wieder am Königsflügel an.“
  - Wechseln möglich („Anderen Rivalen“), höchstens einmal am Tag.
- **Speicher:** `duelle: Record<botKennung, { siege; remis; niederlagen; zuletzt }>`,
  `rivale: { kennung; seit } | null`. Geschrieben beim Speichern jeder Partie gegen einen Bot.
- **Dateien:** neu `spiel/duelle.ts` (+ Test), `ui/komponenten/rivale/Rivalenkarte.tsx`, Texte
  `rivale.*` (Sprüche je Charakter); Aufruf beim Partieende (gesperrt: Partie) und Start der
  Revanche (gesperrt: Spielstart).
- **Abnahme:** Unit-Tests (Wahl des Rivalen, Bilanz, Wechsel); Oberflächentest mit einer
  gewonnenen Partie aus Testdaten.
- **Aufwand:** mittel bis groß. **Abhängig von:** G3, G4, G5; gesperrte Bereiche Partie und
  Spielstart (Haupt-Chat oder Freigabe).
- **Entscheidung:** E6.

### P9 Teilen und Herausforderung, ohne Server

- **Ziel:** Stolz zeigen und Freunde einbeziehen; nur was der Leser selbst teilt, verlässt das
  Gerät.
- **a) Bild teilen:** Bei verdienten Orden, Abzeichen, Rekorden und Meisterschaften Knopf
  „Teilen“. Erzeugt ein Bild 1080 × 1350: dunkler Grund, das Stück groß (Ordenkunst-SVG),
  Name, Datum (`verdient`, G3), „Schach von Grund auf“ und die Adresse der Seite. Technik: SVG in
  ein `Image` (blob:), auf Canvas zeichnen, `toBlob("image/png")`, dann vorhandenes
  `teileDatei()` aus `bausteine/dateiAnbieten.ts`, sonst `bieteDateiAn()` (Herunterladen). CSP
  erlaubt `img-src blob: data:`.
- **b) Aufgabe als Herausforderung:** Am Ende einer gelösten Taktikaufgabe „Freunde
  herausfordern“: Text „Schaffst du das? Weiß zieht und gewinnt.“ und Link
  `https://schach-von-grund-auf.com/app/#aufgabe-taktik-<id>`. Die App öffnet die Aufgabe direkt
  (neuer Sprung in `ansichtZumSprung`, `app/App.tsx`, wie `#abb-` und `#trainer-`). Nur Aufgaben
  aus freien Quellen (Lichess CC0, eigene Aufgaben), keine Buchabbildungen mit Text (E7).
- **Datenschutz:** Text ergänzen: „Wenn du teilst, gibt die App ein Bild oder einen Link an die
  App deiner Wahl weiter. Sonst verschickt die App nichts.“ (`app/datenschutz/index.html`).
- **Dateien:** neu `ui/komponenten/teilen/teileBild.ts` (+ Test der Bildgröße mit Attrappe),
  `Teilenknopf.tsx`, Sprung in `App.tsx` (gemeinsam, G5-Platzhalter `#aufgabe-`), Texte
  `teilen.*`.
- **Abnahme:** Oberflächentest: Knopf erzeugt ein PNG (abgefangener Download); Sprung
  `#aufgabe-taktik-…` öffnet die Aufgabe.
- **Aufwand:** mittel. **Abhängig von:** G3 (Datum); Ordenkunst.

### P10 Kleine Momente beim Üben

- **a) Kombo:** In allen Trainern ab 3 richtigen Antworten in Folge ein kleines Abzeichen am
  Brettrand „3 in Folge“, bei 5 und 10 ein kurzes Funkeln, Ton (wenn an) jeweils einen Halbton
  höher. Ein Fehler beendet die Kombo leise. Ort: einmal in `ui/trainer/Rundenrahmen.tsx` bzw.
  `useRunde.ts` (zählt schon richtig/falsch), Komponente `bausteine/Kombo.tsx`, Ton über
  `app/ton.ts` (`spieleKlang` mit Tonhöhe).
- **b) Fundstücke:** Selten (Zufall, etwa jede 12. abgeschlossene Runde, höchstens eines am Tag)
  erscheint am Rundenende „Fundstück!“: eine kleine Karte mit einer Schachgeschichte, einer
  Kuriosität oder einem Merksatz mit Buchbezug („Wusstest du? Die längste mögliche Partie …“,
  „Merksatz aus Kapitel 7: Wo zwei Figuren ungedeckt stehen, sucht der Springer die Gabel.“).
  Gesammelt im Album „Fundstücke“ (Profil), 60 bis 100 Stück, mit Lücken als Platzhalter.
  Unerwartet und selten, daher ohne den untergrabenden Effekt fest versprochener Belohnungen.
- **Inhalte:** eigene Texte (keine fremden Zitate mit unklaren Rechten; Buchtexte nur als kurze
  Merksätze mit Fundstelle, Regel 3). Entwürfe schreibt ein Chat, der Autor liest später (Regel 9).
- **Speicher:** `fundstuecke: string[]` (Kennungen).
- **Dateien:** neu `training/fundstuecke.ts` (Auswahl, + Test), `inhalte/de/fundstuecke.json`,
  `ui/komponenten/fundstuecke/`, Rundenende (G4); Kombo in `Rundenrahmen.tsx`/`useRunde.ts`
  (gemeinsam; Taktik-Teile gesperrt → Haupt-Chat prüft).
- **Abnahme:** Unit-Tests (höchstens eins am Tag, keine Doppel); Oberflächentest Kombo bei drei
  richtigen Antworten.
- **Aufwand:** klein (Kombo), mittel (Fundstücke mit Inhalten).
- **Abhängig von:** G3 (Schalter Feiereffekte), G4.

### P11 Übungsplan mit Kalender-Erinnerung

- **Befund:** Zeitgesteuerte Benachrichtigungen ohne Server gibt es in Web-Apps nicht verlässlich:
  die „Notification Triggers“ von Chrome wurden nie ausgeliefert, Safari kennt sie nicht; Web Push
  bräuchte einen Server und Daten außer Haus. Daher kein Push.
- **Lösung:** Der Leser plant selbst (Wenn-dann-Plan, nachweislich hilfreich beim Dranbleiben)
  und trägt den Plan in seinen eigenen Kalender ein.
- **Ablauf:**
  - In der Wochenkarte (P4) und unter Einstellungen › Training: „Wann übst du?“ Tage wählen
    (Mo bis So), Uhrzeit, optional ein Satz „Wo oder nach was?“ („nach dem Abendessen am
    Schreibtisch“).
  - Knopf „In meinen Kalender“: erzeugt eine `.ics`-Datei mit wöchentlich wiederholtem Termin
    (RRULE, 20 Minuten) und Erinnerung zur Startzeit (VALARM), Titel „Schach üben“, Beschreibung
    mit dem Satz und dem Link zur App. Weitergabe über `teileDatei()` oder Herunterladen. Nichts
    geht an einen Server.
  - In der App: Ist heute ein geplanter Tag, steht in der Wochenkarte „Heute ist dein
    Übungstag.“
- **Speicher:** `uebungsplan: { tage: number[]; uhrzeit: string; satz: string } | null`.
- **Dateien:** neu `training/uebungsplan.ts` (ICS-Erzeugung + Test gegen RFC 5545: Zeilenlänge,
  CRLF, Zeitzone als lokale Zeit mit TZID oder „floating“), `ui/komponenten/start/Planwahl.tsx`,
  Texte `plan.*`.
- **Abnahme:** Unit-Test der ICS-Datei; Oberflächentest: Datei wird angeboten. Testpunkt auf dem
  Handy: Termin lässt sich in den Kalender übernehmen (iPhone und Android).
- **Aufwand:** klein. **Abhängig von:** G5, P4 (Karte).

### P12 Monatsrückblick

- **Ziel:** Ruhige Rückschau, Kompetenz sichtbar, ein konkreter nächster Schritt.
- **Ablauf:**
  - In den ersten sieben Tagen eines Monats Startkarte „Dein Oktober ist fertig“ → Bildschirm
    „Dein Oktober“ (Ansicht `rueckblick`); ältere Rückblicke im Profil unter „Rückblicke“.
  - Inhalt: Kalender des Monats mit Lerntagen (G2, gefüllte Felder), Zahlen (Abbildungen, Übungen,
    Trainerantworten, Partien, Siege), Wertung am Monatsanfang und -ende, neu verdiente Orden und
    Abzeichen (G3 `verdient`), neue Rekorde (P5), stärkstes Thema und Thema „zum Üben“ (G1),
    „Dein nächster Schritt für November“ (Logik aus P1). Knopf „Teilen“ (P9, Bild).
  - Ton: keine Vergleiche mit Vormonaten in Rot, keine Ausrufe bei wenig Aktivität („Im Oktober
    hattest du 3 Lerntage. Jeder zählt.“).
- **Speicher:** keiner neu (alles aus G1 bis G3, P5); Merker `rueckblickGesehen` (Monat).
- **Dateien:** neu `training/rueckblick.ts` (+ Test), `ui/bildschirme/Rueckblick.tsx`,
  Startkarte (G4), Texte `rueckblick.*`.
- **Abnahme:** Unit-Tests (Monatsgrenzen, leere Monate); Oberflächentest mit Daten eines Monats.
- **Aufwand:** mittel. **Abhängig von:** G1, G2, G3, G4; P1 (Logik), P5, P9 (optional).

### P13 Eigene Ziele mit Vorschlägen (Orden in Reichweite)

- **Anlass:** Idee des Autors (31.10.2026): Ziele wie „diesen Bot bald besiegen“, auch in einer
  bestimmten Zeitart. P8 (ein Rivale) und P6 (ein Wochenauftrag „Bot der Stufe 4“) decken das nur
  teilweise ab: Es fehlen selbst gewählte Ziele und Vorschläge aus den fast vollen Ringen.
- **Ziel:** Der Ziel-Gradient wirkt am stärksten kurz vor dem Ziel. Die App zeigt, welcher Orden
  in Reichweite ist und was genau fehlt; der Leser heftet sich bis zu drei Ziele an.
- **Ablauf:**
  - Startkarte „Deine Ziele“ (zusammen mit der Wochenkarte, G4) mit bis zu drei angehefteten
    Zielen, je mit Fortschritt und Knopf, der direkt hinführt.
  - Ohne angeheftete Ziele, und auf Tipp „Ziel wählen“: bis zu fünf Vorschläge, sortiert nach
    Nähe zum Ziel. Beispiele:
    - „Besiege Lotte in Schnellschach.“ → Knopf „Spielen“ (startet die Partie gegen Lotte,
      gewertet, Zeitart Schnellschach)
    - „Dir fehlen noch 2 Bots der Stufe 4–5 für den Orden ‚jeden Bot einmal besiegt‘: Lotte und
      Paul.“
    - „Für den Orden ‚Stufe 1–3 in allen Zeitarten‘ fehlen noch 3 Siege in Blitz: Kiki, Ben,
      Mira.“
    - „Noch 4 Übungen bis zum Orden ‚Teil Grundlagen‘.“
    - „Fesselung auf Gold bringen.“ (wenn P3 gebaut ist)
    - „Deinen Rivalen Paul besiegen.“ (wenn P8 gebaut ist)
  - Eigenes Ziel ohne Vorschlag: „Bot besiegen“ mit Auswahl aus der Bot-Liste (Porträts nach
    Stufe, `gegnerSortiert`) und Zeitart Blitz, Schnellschach, Klassisch oder „egal“.
  - Erreicht: kurze Feier „Ziel erreicht: Lotte in Schnellschach besiegt!“, 20 Erfahrungspunkte,
    das Ziel wandert in „Erreichte Ziele“ (Profil). Abzeichen „Zehn eigene Ziele erreicht“.
  - Kein Ablaufdatum, kein Zähler für nicht erreichte Ziele; Lösen eines Ziels mit einem Tipp.
- **Daten:**
  - Fehlende Bots je Bündel und Zeitart aus `spiel.besiegt` (`Record<"blitz"|"rapid"|"classical", string[]>`,
    `speicher/besiegt.ts`, `besiegtIn`, `irgendwoBesiegt`) und `botsDesBuendels`
    (`fortschritt/ringrechnung.ts`); Ringe und Anteile aus `useFortschrittsringe`.
  - „Bot X in Zeitart Z besiegt“ ist direkt aus `besiegt[Z]` lesbar, auch rückwirkend.
  - Übungen und Buchteile aus `teilanteil`, `uebungsanteil`; Themen aus G1/P3.
- **Speicher:** `ziele: { angeheftet: Ziel[]; erreicht: { ziel: Ziel; datum: string }[] }` mit
  `Ziel = { art: "bot"; bot: string; zeitart: "blitz" | "rapid" | "classical" | "egal" }
  | { art: "ring"; ring: string } | { art: "thema"; thema: string; stufe: "gold" }
  | { art: "kapitel"; kapitel: number }`. In G5 mit anlegen.
- **Dateien:** neu `training/ziele.ts` (Vorschläge und Prüfung, rein, + Test),
  `ui/komponenten/start/Zielkarte.tsx`, `Zielwahl.tsx`, Abzeichen-Teilliste, Texte `ziel.*`;
  Start der Partie mit Bot und Zeitart über den vorhandenen Spielstart (gesperrt: Spielstart;
  dort nur ein Einstieg mit Vorbelegung, Beschreibung im Bericht).
- **Abnahme:** Unit-Tests (Vorschläge sortiert nach Nähe; Bot-Ziel erreicht bei Sieg in der
  Zeitart, bei „egal“ in jeder; Ringziel bei vollem Ring); Oberflächentest mit vorbereitetem
  `besiegt`.
- **Aufwand:** mittel. **Abhängig von:** G3, G4, G5; P4 (gemeinsame Karte); P3 und P8 nur für
  ihre Vorschlagsarten.
- **Entscheidung:** E11.

---

## 5. Wellenplan und Konfliktkarte

**Welle 0 (ein Chat, Haupt-Chat oder freigegeben):** G1 bis G5. Ergebnis: Speicherfelder,
Protokolle, Kartenplätze, Teillisten für Abzeichen und Bilder, Router-Platzhalter, Schalter
„Feiereffekte“. Danach main aktualisieren; alle Arbeitschats zweigen davon ab.

**Welle 1 (bis zu sieben Chats parallel):**

| Chat | Pakete | Hauptdateien (neu, außer markiert) |
| --- | --- | --- |
| A | P1 Nächster Schritt | `training/naechsterSchritt.ts`, `start/NaechsterSchritt.tsx` |
| B | P2 Lernpfad | `bildschirme/Lernpfad.tsx`, `komponenten/lernpfad/`, Knopf in `Buch.tsx` |
| C | P4 Wochenziel + P11 Übungsplan | `training/wochenziel.ts`, `training/uebungsplan.ts`, `start/Wochenkarte.tsx` |
| D | P5 Rekordtafel (ohne Serienmodus) | `training/rekorde.ts`, `komponenten/rekorde/` |
| E | P9 Teilen | `komponenten/teilen/`, Sprung in `App.tsx` (Platzhalter aus G5) |
| F | P10 a Kombo + P10 b Fundstücke | `bausteine/Kombo.tsx`, `training/fundstuecke.ts`, Inhalte |
| G | P7 Extras (ohne Meisterschaftsbedingungen) | `training/extras.ts`, Figuren, Farben |

**Welle 2 (bis zu fünf Chats parallel):**

| Chat | Pakete | voraus |
| --- | --- | --- |
| H | P3 Meisterschaft | G1, Welle 1 G (Titel, Zubehör) |
| I | P6 Wochenaufträge | P4 |
| J | P8 Rivalen | gesperrte Partie und Spielstart: mit Freigabe |
| K | P12 Monatsrückblick | P1, P5, P9 |
| L | P5 Serienmodus im Taktiktrainer | gesperrt: Taktiktrainer |
| M | P13 Eigene Ziele | P4 (Karte); gesperrt: Spielstart (Vorbelegung) |

**Dateien, die mehrere Pakete berühren (nach G1 bis G5 nur noch ergänzen):**

| Datei | Pakete | Regel |
| --- | --- | --- |
| `i18n/de.json`, `en.json` | alle | nur neue Schlüssel, je Paket eigene Vorsilbe |
| `start/Startkarten.tsx` (Liste) | P1, P4, P6, P8, P12, P13 | je Paket eine Zeile |
| Profilkarten-Liste in `Ich.tsx` | P3, P5, P10, P12 | je Paket eine Zeile |
| Rundenende (`NACH_DER_RUNDE`) | P3, P5, P9, P10 | je Paket eine Zeile |
| Abzeichen-Teillisten, Bild-Teillisten | P3, P4, P5, P6, P8 | je Paket eigene Datei |
| `GEWICHTE` in `erfahrung.ts` | P3, P4, P5, P6, P8 | Feld vorhanden (G3), Paket setzt Gewicht |
| `speicher/format.ts` | alle mit Speicher | nur Welle 0 |
| `app/App.tsx`, `app/stapel.ts` | P2, P9, P12 | nur Welle 0 (Platzhalter), Pakete füllen Bildschirm |
| `docs/AUFGABEN_AUTOR.md` | alle | je Chat eigener Abschnitt und Nummernbereich |

**Nummernbereiche für Testpunkte (Vorschlag):** Welle 0 N2100–2109, A N2110–2119, B N2120–2129,
C N2130–2139, D N2140–2149, E N2150–2159, F N2160–2169, G N2170–2179, H N2180–2189,
I N2190–2199, J N2200–2209, K N2210–2219, L N2220–2229, M N2230–2239.

---

## 6. Entscheidungen des Autors (mit Empfehlung)

Nach Regel 9 kann der Haupt-Chat mit den Empfehlungen sofort beginnen; nur E1 betrifft das
Speicherformat und braucht ein ausdrückliches Ja.

- **E1 Speicherformat:** neue Felder (G5) ohne neue Formatversion, alle mit leerer Vorgabe,
  Sicherungen bleiben in beide Richtungen ladbar (neue Felder gehen in alten Apps verloren).
  Empfehlung: so. **Braucht Ja.**
- **E2 Startseite für die Karten:** oben auf der Buch-Startseite, höchstens zwei Karten.
  Alternative: eigene Startseite „Heute“ als sechster Bereich (mehr Umbau). Empfehlung: Buch.
- **E3 Lernpfad:** eigener Bildschirm mit Knopf über der Kapitelliste; die Liste bleibt.
- **E4 Meisterschaft:** einmal erreicht, bleibt sie; nach 60 Tagen ohne richtige Antwort leiser
  Hinweis „Zum Auffrischen“.
- **E5 Wochenziel und Tagesserie:** beide bleiben; das Wochenziel steht vorn, die Tagesserie
  bleibt im Trainer Kurzpläne. Kein Vorgabeziel; vorgeschlagen werden 3 Tage.
- **E6 Rivalen:** Duell gewonnen beim ersten gewerteten Sieg; Sprüche je Charakter, nicht je Bot
  (84 Bots wären zu viele Texte).
- **E7 Teilen:** nur Bilder der eigenen Stücke und Aufgaben aus freien Quellen; keine
  Buchabbildungen mit Text.
- **E8 Extras:** Porträtrahmen, Brettfarbe „Nacht und Gold“, Figurensatz „Gold“, Zubehör, Titel,
  Konfettifarben; nichts Bestehendes wird gesperrt.
- **E9 Fundstücke:** eigene Texte, etwa 80, Entwurf durch Claude, der Autor liest später.
- **E10 Feiereffekte:** neuer Schalter in den Einstellungen, Vorgabe an.
- **E11 Eigene Ziele:** höchstens drei angeheftet, ohne Ablaufdatum; Vorschläge nur aus echten
  Lücken (fehlende Bots, Übungen, Themen), sortiert nach Nähe zum Orden.

---

## 7. Vorlage für die Aufträge an die Arbeitschats

```
Du arbeitest an der Schach-App „Schach von Grund auf“ (dobili/SvGa_Public). Lies zuerst
CLAUDE.md und halte dich an alle Regeln dort. Lies dann docs/nebenchat/gamifizierung.md,
Abschnitte 1 bis 3 ganz und aus Abschnitt 4 dein Paket <Pn>.

Auftrag: Baue Paket <Pn> „<Name>“ wie dort beschrieben. Grundlage G1 bis G5 ist auf main
vorhanden; ändere keine Datei aus der Liste „nur Welle 0“ in Abschnitt 5, nutze die
Teillisten und Kartenplätze.

Zweig: <praefix>-<pn>-<kurzname>. Keine Versionsnummer erhöhen, nicht nach main pushen, keine
Pull Requests. Texte nur als neue Schlüssel mit der Vorsilbe <vorsilbe>. in de.json und en.json.
Testpunkte in docs/AUFGABEN_AUTOR.md in einem eigenen Abschnitt „### <Pn>: <Name> (Datum)“ direkt
über dem ersten „### Neu in …“, Nummern <bereich>. Gesperrte Bereiche laut Haupt-Chat: <liste>;
nötige Änderungen dort als Beschreibung oder Patch im Bericht.

Vor jedem Commit: npm run pruefen, npm run build, Oberflächentests mit Chromium (eigener
PLAYWRIGHT_PORT <port>). Nach jedem Teilschritt pushen und die CI abwarten.
Am Ende: Bericht mit Zweig, letztem Commit, Gebautem, Testpunkten, offenen Fragen.
```

**Kurzbeschreibung je Chat (zum Einsetzen):**

- A P1: Karte „Dein nächster Schritt“ mit Rangfolge (fällig, Tagesaufgabe, Weiterlesen, offene
  Übungen, schwaches Thema, Fehlerdatenbank), Alternativen, „Nicht jetzt“.
- B P2: Bildschirm „Dein Weg durchs Buch“ mit 13 Stationen, 5 Etappen, Orden als Etappenziel,
  eigene Figur.
- C P4 + P11: Wochenziel mit Wochenkarte, erreichte Wochen ohne Zurücksetzen; Übungsplan mit
  ICS-Datei.
- D P5: Rekordtafel, Übernahme der Merker, Meldung „Neuer Rekord“ am Rundenende.
- E P9: Bild teilen (Canvas, PNG, Web Share), Herausforderung per Link `#aufgabe-…`,
  Datenschutztext.
- F P10: Kombo in allen Trainern; Fundstücke mit 80 eigenen Texten und Album.
- G P7: Freischaltbare Extras, Sperre mit Bedingung in Einstellungen und Baukasten.
- H P3: Meisterschaft je Thema mit Medaillen, Profilkarte, Abzeichen.
- I P6: Wochenaufträge mit fester Wochenliste, Fortschritt aus dem Protokoll, Tauschen.
- J P8: Rivalen mit Duellbilanz, Sprüchen je Charakter, Revanche.
- K P12: Monatsrückblick mit Kalender, Zahlen, Stücken, Rekorden, nächstem Schritt, Teilen.
- L P5: Serienmodus „ohne Fehler“ im Taktiktrainer.
- M P13: Eigene Ziele mit Vorschlägen aus fast vollen Ringen (Bot in Zeitart, fehlende Bots eines
  Bündels, Übungen eines Buchteils), bis zu drei angeheftet.

---

## 8. Quellen

- Sailer & Homner u. a., Meta-Analysen zu Gamifizierung im Lernen (Überblick):
  https://link.springer.com/article/10.1007/s10648-025-10108-1
- Gamifizierung und Selbstbestimmungstheorie: https://pmc.ncbi.nlm.nih.gov/articles/PMC8037535
- Deci, Koestner & Ryan (1999), Belohnungen und innere Motivation:
  https://depts.washington.edu/techdocs/papers/deciExtrinsicRewardsAndIntrinsicMotivation99.pdf
  und Zusammenfassung 2001: https://www.selfdeterminationtheory.org/SDT/documents/2001_DeciKoestnerRyan.pdf
- Nunes & Drèze (2006), geschenkter Fortschritt: https://knowledge.wharton.upenn.edu/?p=5630
- Duolingo, Bindungsmechanismen (Analyse, keine Primärquelle):
  https://uxdesign.cc/duolingo-analyzing-all-engagement-and-retention-techniques-3e73b79120cf
- Serien und Verlustangst: https://shop.smashingmagazine.com/2026/02/designing-streak-system-ux-psychology/
- Notification Triggers (nicht ausgeliefert): https://developer.chrome.com/docs/web-platform/notification-triggers
- Dateien teilen mit Web Share: https://web.dev/articles/files/share-files
