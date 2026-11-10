# 18 Spielhülle: Funktionen der App nur aufs Nötigste gespiegelt

Stand: 10.11.2026 (mittel-1). Grundlage: Entscheidung „Spielhülle“ in `ENTSCHEIDUNGEN.md`
(Wunsch des Autors nach dem ersten Spielen). Dieses Dokument hält fest, wo das Spiel die Oberwelt
verlässt, was dort heute zu sehen ist, was die Geschichte braucht, und wie die Hülle gebaut wird.

## 1. Grundsatz

- Das Spiel erzählt eine Geschichte. Wo es Schach braucht, rechnet die App im Hintergrund
  (Engine, Uhr, Speichern der Partie in der Partienliste, Wiederholung, Tagesprotokoll).
- Zu sehen ist nur, was die Aufgabe im Spiel braucht, im Aussehen des Spiels: Pixelrahmen, Navy
  und Gold, Porträt der Figur, Name des Ortes.
- Es gibt genau einen Weg zurück, und er führt in die Oberwelt an die Stelle, an der der Held
  stand. Kein Knopf führt in die App.
- Wer mehr will (Auswertung, Varianten, Lernsammlung, Teilen), findet die Partien des Spiels
  später in der Partienliste der App.
- Geändert wird die Darstellung, nicht die Logik. Braucht eine Komponente der App einen Schalter,
  bekommt sie eine Eigenschaft mit Vorgabe „aus“; Leser der Buch-App merken nichts.

## 2. Bestandsaufnahme

Das Spiel verlässt die Oberwelt an zwei Stellen: `startePartie`/`zeigePartie` und
`starteAufgaben` in `anbindung/dienste.ts`. Alles andere (Deckwahl, Vorführung,
Gedächtnisstellung, Ergebniskarten, Tagebuch, Laden) sind Karten über der Welt in
`oberwelt/`.

### 2.1 Partie gegen einen Gegner

Betrifft alle Partieformen, denn alle laufen über denselben Auftrag: Begegnung, Übungspartie mit
dem Reisebrett, Stellungsduell, Wiedereinstieg am Kipppunkt, Simultanbretter, Schach960,
Blindschach, „Gehör“, Kandidatenwahl, Buch und Bruch, Lebendschach (Kulisse).

- **Heute:** `navigiere({ bildschirm: "partie" })`, also der Partie-Bildschirm der App
  (`ui/bildschirme/Partie.tsx`):
  - Kopfzeile der App mit Zurück-Pfeil und Titel;
  - Untertitel (Gegner, Stufe, Bedenkzeit);
  - Zugliste mit Navigation;
  - Uhren mit Bot-Bild und Stufenmarke;
  - Brett mit „Brett drehen“ und Schalter „ruhige Ansicht“;
  - Kartenleiste des Spiels;
  - Status, „Zurücknehmen“, „Aufgeben“.
- **Nach dem Ende heute:**
  - Ergebniskopf mit Genauigkeit;
  - Rückblick am Brett (Zeichen, bessere Züge, Bewertungsbalken);
  - Gabel-Schalter „Variante“;
  - die ganze Auswertung (Zeitleiste, „In Zahlen“);
  - „Zurück zur Stadt“, daneben „Neue Partie“ (führt auf die Spielen-Seite der App), „Teilen“ und
    „Noch einmal aus derselben Stellung“.
- **Die Geschichte braucht:** Wer sitzt mir gegenüber und wo; Brett; Uhren, wenn die Partie eine
  hat; ziehen; die Karten, wo sie erlaubt sind; aufgeben; zurücknehmen nur, wo die Begegnung es
  erlaubt.
- **Weg fällt:** Kopfzeile der App, Untertitel, Zugliste, ruhige Ansicht, Stufenmarke,
  Ergebniskopf, Rückblick, Gabel, Auswertung, „Neue Partie“, „Teilen“, „Noch einmal“.
- **Zurück:** Nach dem Ende ein Knopf „Weiter“ in die Oberwelt. Dort liest das Spiel wie bisher
  das Ergebnis und zeigt die Ergebniskarte (Abschnitt 4).

### 2.2 Aufgabenrunde

Buchübungen, Motivaufgaben (Taktik, Lichess-Zusatz), „Falle oder Köder“, Strukturen, Endspiel.

- **Heute:** eigene Zusatzansicht `anbindung/AufgabenAnsicht.tsx`, aber im Aussehen der App und
  mit dem Rundenrahmen des Trainers (`ui/trainer/Rundenrahmen.tsx`):
  - Stand „Aufgabe 2 von 4 · 1 richtig“, Kombo „3 in Folge“, Fortschrittsbalken;
  - nach jeder Antwort „In die Lernsammlung“ (mit Formular, Feld „Variante“ und Link „Zur
    Lernsammlung“) und **„Als Variante öffnen“** (führt in den Variationsbrowser der App; das ist
    der Knopf, den der Autor meint);
  - „Weiter“ und „Aufgabe wiederholen“.
- **In den Aufgaben selbst:**
  - Taktik: „Brett drehen“, Herkunft („Aus Abb. …“, Lichess-Wertung, Stufe), „Hinweis“, „Lösung
    zeigen“, bei Lichess-Aufgaben „Freunde herausfordern“.
  - Falle: „Warnsignale zeigen“, „Nehmen“/„Nicht nehmen“, danach der Folgespieler mit
    Bewertungsbalken und Zugknöpfen.
  - Struktur: „Nur das Skelett zeigen“, „Prüfen“, Feldart- und Plan-Knöpfe.
  - Endspiel: „Hinweis“, „Aufgabe abbrechen“, Status „Engine denkt“.
- **Die Geschichte braucht:** Wer stellt die Aufgabe; die Aufgabe; das Brett; die Antwort (Zug,
  Wahl, Feld); die Rückmeldung richtig oder falsch mit der Lösung; die Hinweise, weil Ambrose
  hilft (sie kosten wie bisher nichts außer dem halben Punkt, wo die App ihn kennt); „Weiter“.
- **Weg fällt:** Lernsammlung, „Als Variante öffnen“, „Aufgabe wiederholen“ (die Runde zählt die
  erste Antwort), Kombo, „Freunde herausfordern“, Herkunftszeile, externe Links.
- **Zurück:** Am Ende ein Knopf „Weiter“ in die Oberwelt; die Rundenergebniskarte dort bleibt.

### 2.3 Erinnerung (Zugerraten einer Klassikerpartie)

- **Heute:** `ErinnerungsRunde.tsx` mit Rundenrahmen und `Zugerratenaufgabe`: alles aus 2.2,
  dazu Zusatzkarte mit Quellenlinks, Zugliste mit Navigation, „Analysieren“, am Ende „Noch eine
  Runde“ (ohne Wirkung).
- **Die Geschichte braucht:** Ambroses Erinnerung, Brett, den Zug raten, „Hinweis: Figur zeigen“,
  die Auflösung je Zug, „Weiter“.
- **Weg fällt:** Lernsammlung, Variante, Wiederholen, „Analysieren“, „Noch eine Runde“. Die
  Quellenangabe bleibt als eine Zeile Text (Lizenz CC BY-SA verlangt sie), ohne Link nach draußen.

### 2.4 Karten über der Welt (bleiben im Spiel)

| Stelle             | Heute                                                             | Änderung                                                  |
| ------------------ | ----------------------------------------------------------------- | --------------------------------------------------------- |
| Deckwahl           | Karte des Spiels                                                  | keine                                                     |
| Vorführung         | Brett mit „Brett drehen“, ◀ ▶, „Weiter“                           | „Brett drehen“ aus                                        |
| Gedächtnisstellung | Brett, dann der Stellungseditor der App mit Moduswahl, „am Zug“ … | Editor auf Figurenwahl, „Feld räumen“ und „Fertig“ kürzen |
| Ergebniskarten     | Karte des Spiels                                                  | Auswertung nach Abschnitt 4                               |

## 3. Entwurf: die Spielhülle

Ein Rahmen für alles, was außerhalb der Oberwelt spielt (`anbindung/Huelle.tsx`):

```
┌──────────────────────────────────────┐
│ [Porträt]  Skater Jo                 │  Kopf: Figur und Ort, Navy mit Goldschrift
│            Maple Falls, Hauptstraße  │
├──────────────────────────────────────┤
│  Jo                          04:12   │  Uhr des Gegners (nur mit Uhr)
│  ┌────────────────────────────────┐  │
│  │            Brett               │  │
│  └────────────────────────────────┘  │
│  Du                          05:00   │  eigene Uhr
│  [Karte] [Karte] [Karte]             │  Kartenleiste, wo Karten erlaubt sind
│  Du bist am Zug.        [Aufgeben]   │  eine Zeile Status, ein Weg hinaus
└──────────────────────────────────────┘
```

- **Kopf:** Porträt der Figur (dieselben Bilder wie im Dialog), ihr Name, darunter der Ort aus
  der Position des Helden. Bei Aufgaben steht dort, wer sie stellt.
- **Inhalt:** die Bausteine der App, die die Aufgabe braucht, eingehängt statt der ganzen
  Ansicht: Brett (`Brettbereich`), Uhr (Rechnung aus `spiel/uhr.ts`), Zugeingabe
  (`useLeserzug`), Partielogik (`usePartie`: Engine, Uhr, Speichern), Kartenleiste
  (Erweiterungspunkt wie bisher), Aufgabenkomponenten der Trainer.
- **Fuß:** eine Zeile Status in der Sprache der Geschichte („Jo überlegt …“ statt „Die Engine
  denkt …“) und der eine Weg hinaus: „Aufgeben“ während der Partie, „Weiter“ am Ende.
- **Nicht da:** Navigation und untere Leiste der App, Kopfzeile der App, Einstellungen, „Spielen“,
  „Variante“, Lernsammlung, Teilen.
- **Zurück-Taste des Geräts:** führt wie bisher in die Oberwelt; dort fragt die Karte „Deine
  Partie läuft noch“ nach Weiterspielen oder Aufgeben. Die Uhr hält dabei an (Logik der App).

Technik:

- Neue Zusatzansicht `abenteuer-partie` (Vollbild) mit `anbindung/PartieHuelle.tsx`; die Dienste
  navigieren dorthin statt auf den Partie-Bildschirm. Der Partie-Bildschirm der App bleibt
  unverändert und zeigt Partien des Spiels weiter, wenn man sie aus der Partienliste öffnet.
- `AufgabenAnsicht.tsx` bekommt denselben Rahmen. `Rundenrahmen` und die Aufgabenkomponenten
  bekommen eine Eigenschaft `imSpiel` (Vorgabe aus), die die genannten Knöpfe ausblendet.
- Texte der Hülle in `inhalte/abenteuer/texte/de.json` (`huelle.*`), Stil in
  `abenteuer/huelle.css`.

## 4. Auswertung nach der Partie

**Entscheidung (Regel 9, schon umgesetzt, Widerspruch genügt):** Im Spiel gibt es nach der Partie
keine Auswertung der App. Die Hülle zeigt das Ergebnis groß auf dem Brett und einen Knopf
„Weiter“. In der Oberwelt folgt wie bisher die Ergebniskarte des Spiels: gewonnen, verloren oder
Remis, Zahl der Züge, gespielte Karten, die Nadel, Ambroses Satz zum Kipppunkt mit dem Angebot
„Noch einmal von Zug …“.

Gründe:

- Die Auswertung der App ist für Leser des Buches gebaut (Zeitleiste, Genauigkeit, Zugklassen,
  Phasen). Ein Kind, das gerade Jo besiegt hat, will wissen, wie es weitergeht.
- Der eine Moment, der zählt, ist im Spiel schon da: Ambrose nennt nach einer Niederlage den
  Kipppunkt und bietet den Wiedereinstieg an (Regelwerk R14). Das ist die Auswertung in der
  Sprache der Geschichte.
- Nichts geht verloren: Die Partie liegt in der Partienliste der App und wird dort beim Öffnen
  ausgewertet wie jede andere. Später in der Geschichte kann Mamas Turnierheft auf die
  Partienliste verweisen.
- Technisch spart das Rechenzeit: Die Hintergrund-Auswertung läuft während einer Partie des
  Spiels nicht mehr mit.

Offen für später: ein Eintrag „Meine Partien“ im Tagebuch, der die Partienliste der App öffnet.

## 5. Bau in Schritten

1. **Partie** (`PartieHuelle.tsx`, Kopf, Uhren, Status, Ergebnis, Rückweg); Dienste umstellen;
   Tests (vitest, e2e Abenteuer).
2. **Aufgabenrunden** im Rahmen der Hülle; Schalter `imSpiel` in Rundenrahmen und Taktikaufgabe.
3. **Erinnerung, Falle, Struktur, Endspiel**; danach Vorführung und Gedächtnisstellung.

Jeder Schritt ist lauffähig und geprüft; jeder Rückweg führt in die Oberwelt.

## 6. Stand des Baus (10.11.2026)

- **Schritt 1, Partie:** fertig. `anbindung/PartieHuelle.tsx`, `Huelle.tsx`, `huellentexte.ts`,
  `huelle.css`; die Dienste öffnen die Zusatzansicht `abenteuer-partie`.
- **Schritt 2, Aufgabenrunden:** fertig. `AufgabenAnsicht.tsx` im Rahmen der Hülle;
  `ui/trainer/imSpiel.ts` als Schalter, `Rundenrahmen` mit der Eigenschaft `imSpiel`.
- **Schritt 3, Rest:** fertig.
  - Erinnerung: ohne „Analysieren“ und früheren Durchgang, Quellen ohne Link, eigene Endkarte
    statt „Noch eine Runde“.
  - Endspiel und Struktur: ohne Herkunftszeile, Endspiel ohne „Die Engine denkt …“.
  - Vorführung und Gedächtnisstellung: ohne „Brett drehen“; der Stellungseditor hat die
    Eigenschaft `nurSetzen` (nur Figurenwahl, „Brett leeren“, „Fertig“, „Abbrechen“).
- **Noch offen:**
  - Die Kartenleiste trägt das Wort „Schach-Abenteuer“; in der Hülle ist es überflüssig.
  - Falle oder Köder: Der Folgespieler nach der Antwort hat noch Zugknöpfe und Bewertungsbalken.
  - Texte der Trainer („Lösung zeigen“, „Hinweis 1“) kommen aus der App, nicht aus dem Mund
    einer Figur.
  - Eintrag „Meine Partien“ im Tagebuch als Weg zur Partienliste der App.
