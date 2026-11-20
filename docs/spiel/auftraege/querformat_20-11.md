# Texte und Bretter im Querformat (20.11.2026)

Wunsch des Autors: Im Querformat sieht man Textfenster manchmal nicht ganz, und man kann darin nicht
rollen. Texte sollen quer in allen Lagen bequem lesbar sein, das Schachbrett immer ganz zu sehen.
Gemessen auf drei Größen:

- iPhone 15 quer (734 × 343)
- Pixel 7 quer (863 × 360)
- großes iPhone als Web-App (932 × 430)

## 1. Entwurf: Dialog als Seitenspalte

Quer steht das Dialogfenster rechts als Spalte in voller Höhe, gegenüber dem Steuerkreuz
(`app/src/abenteuer/querformat.css`). Dort stehen sonst nur Aktionsknopf und Knopfspalte, und die
sind während eines Gesprächs nicht da. Hochformat bleibt unverändert.

- **Aufbau:** Porträt und Name oben, darunter der Text, die Antworten und „Weiter“ unten in der
  Spalte über die ganze Breite.
- **Breite:** gut 40 % des Bildes (mindestens 15rem, höchstens 24rem). Das sind 293 px auf dem
  iPhone 15, 345 px auf dem Pixel 7 und 373 px auf dem großen iPhone.
- **Rollen:** Wird es länger als die Höhe, rollt die Spalte. Mit dem Finger geht das auch auf iOS
  (`touch-action: pan-y`, `overscroll-behavior: contain`). Jede neue Zeile beginnt wieder oben.
- **Großbild (#bild):** steht groß in der freien Fläche links neben der Spalte, der Text in der
  Spalte. Über dem Text war es quer zu klein, und der Text rutschte unter den Rand.
- **Menü und Münzen** rücken im Gespräch links neben die Spalte. Der Ladestand („Geräusche werden
  geladen … 76 %“) lag dann unter dem Menü und steht jetzt unten in der Mitte der freien Fläche.
- **Momente in der Partie** (Momentdialog) nutzen dieselbe Spalte. Das Brett liegt quer links und
  bleibt frei.

## 2. Kamera und Zoom

| Lage                           | Entscheidung                                                                                                                                                                                | Begründung                                                                                                                                                                                                                                           |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Welt neben der Spalte          | Die Kamera zählt die Spalte als verdeckten rechten Rand (`oberwelt/textspalte.ts`, `kameraregie.ts`). Der Held steht damit in der Mitte der freien Fläche, sein Gesprächspartner neben ihm. | Ohne Versatz stand der Held in der Bildmitte und damit oft unter der Spalte.                                                                                                                                                                         |
| Welt neben der Spalte, Zoom    | Kein anderer Zoom.                                                                                                                                                                          | Neben der Spalte bleiben 9 × 7 Kacheln (iPhone 15), 10½ × 7½ (Pixel 7) und 11½ × 9 (großes iPhone). Das reicht für Held und Gesprächspartner. Ein Zoomsprung bei jedem Gespräch wäre unruhig, und ein kleinerer Zoom machte die Pixelfiguren winzig. |
| Partie, Übungspartie           | unverändert                                                                                                                                                                                 | Das Brett ist ganz im Bild (Test).                                                                                                                                                                                                                   |
| Aufgabenrunde                  | unverändert                                                                                                                                                                                 | ganz im Bild (Test)                                                                                                                                                                                                                                  |
| Vorführung, Gedächtnisstellung | Brett unverändert, aber kein Steuerkreuz mehr über dem Fenster (`Oberwelt.tsx`)                                                                                                             | Das Kreuz ragte quer über den linken Fensterrand. Laufen kann der Held dort ohnehin nicht.                                                                                                                                                           |
| Simultan, Partien aus Dialogen | unverändert                                                                                                                                                                                 | Die Wache des Durchlaufs meldet jedes angeschnittene Brett (`brettAngeschnitten`). Im Querformat-Durchlauf über Akt 1 kam keine Meldung.                                                                                                             |
| Großbilder                     | in der freien Fläche, so groß wie diese                                                                                                                                                     | siehe Abschnitt 1                                                                                                                                                                                                                                    |
| Enge Räume                     | unverändert                                                                                                                                                                                 | Kleine Karten stehen mittig, die Kameragrenzen rechnen die Spalte mit ein.                                                                                                                                                                           |

## 3. Alle Lagen mit Text quer

| Lage                   | Ergebnis                                                                                    | Test                                                        |
| ---------------------- | ------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Dialog mit Porträt     | Spalte, ganz im Bild                                                                        | `abenteuer-quertext.spec.ts`                                |
| Erzählfenster          | Spalte, ganz im Bild                                                                        | Erkundung; dieselben Regeln wie Dialog                      |
| Großbild (#bild)       | groß neben der Spalte                                                                       | `abenteuer-quertext.spec.ts`                                |
| viele und lange Wahlen | Spalte rollt, auch mit dem Finger, letzte Antwort erreichbar                                | `abenteuer-quertext.spec.ts` (Wisch per Touch)              |
| Meldungen, Fundmeldung | Leiste oben in der Mitte, im Bild; im Gespräch wartet sie (seit 20.11.2026)                 | Durchlauf quer, Randprüfung                                 |
| Tagebuch               | vorher: von gut 800 px Inhalt waren 170 px zu sehen; jetzt volle Höhe, rollt mit dem Finger | `abenteuer-quertext.spec.ts`                                |
| Laden                  | bearbeitet mittel-4 (abgestimmt)                                                            | –                                                           |
| Ergebniskarte          | im Bild                                                                                     | Durchlauf quer                                              |
| Rückmeldung            | ist ein Dialog: Spalte                                                                      | wie Dialog                                                  |
| Momente in der Partie  | Spalte neben dem Brett, Brett frei                                                          | `abenteuer-querbretter.spec.ts` (nachgebauter Momentdialog) |
| Zeithinweise           | Sprechblase unten in der Seitenleiste neben dem Brett, ganz im Bild, nicht auf dem Brett    | `abenteuer-zeithinweis.spec.ts` mit `ZEITHINWEIS_QUER=1`    |

Die Fensterbank (Dachboden, Drechslerei, Ghost Town) ist ein gewöhnlicher Dialog und steht damit in
der Spalte.

## 4. Fotos

Ordner `querformat_20-11/`, 640 Pixel breit:

- vorher: Dialog unten über die ganze Breite
- nachher: Dialog, lange Antworten gerollt, Großbild, Tagebuch, Moment, Vorführung,
  Gedächtnisstellung, Zeithinweis

## 5. Grenzen

- Das Rollen mit dem Finger ist in Chromium mit Touch-Ereignissen geprüft. Unter WebKit (iOS, nur
  in CI) gibt es dafür kein CDP. Dort rollt der Test das Fenster per Skript und prüft die Stilwerte,
  die das Rollen mit dem Finger erlauben (`touch-action: pan-y`, `overflow-y: auto`). Auf dem
  iPhone selbst gehört der Test in Teil 1 der Aufgaben des Autors (vorgeschlagen an den Hauptchat).
- Einen echten Momentdialog erreicht ein Test erst nach 18 Zügen gegen Mrs. Okafor. Geprüft ist der
  nachgebaute Aufbau aus `Momentdialog.tsx` und `Dialog.tsx`.
