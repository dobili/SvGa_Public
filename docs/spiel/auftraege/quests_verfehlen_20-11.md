# Quests verfehlen (Auftrag 20.11.2026)

Frage: Kann ein Spieler eine Haupt- oder Nebenquest dauerhaft verpassen oder blockieren? Mögliche
Wege dorthin:

- erst reisen, dann reden;
- „Nicht jetzt“ an einer Stelle, die nie wiederkommt;
- einen Gegenstand nicht kaufen;
- ein Laden schließt;
- eine Figur geht nach einem Abschied, obwohl ihre Quest offen ist.

## Werkzeuge

- **Statische Prüfung** `python -m pipeline.abenteuer.questverfehlen [--alle]`. Sie läuft als
  Dauertest in `pipeline/tests/test_abenteuer_questverfehlen.py` und geht für jede Quest den
  Start und jeden Schritt durch:
  - **Auslöser:** Knoten, Runde oder Begegnung mit den Knoten, die sie starten, oder bei einem
    Ortsschritt die Wege in die Karte.
  - **Kandidaten:** jede Figur, jeder Auslöser und jeder Eingang, dessen Dialog den Knoten im
    Ink-Fluss erreicht (`inkfluss.py`).
  - **Sperren je Kandidat:** die kleinsten Mengen von Variablen, mit denen `wenn` nie mehr gilt
    (`questsperren.py`; „oder“ zählt richtig, Vorübergehendes sperrt nicht). Dazu Zustandskarten,
    auf denen das Objekt fehlt.
  - **Bewertung:**
    - „sicher“: ein Kandidat ohne Sperre.
    - „folgt“: Eine Variable der Sperre setzt nur die Quest selbst.
    - Sonst ein Befund. Er wird behoben, als Ausnahme mit Grund eingetragen oder als
      „gemeldet“ festgehalten (`questverfehlen_geprueft.py`).
- **Aufschieber** `node pipeline/abenteuer/questverfehlen-aufschieber.cjs --objekte DATEI`. Die
  Objekte schreibt `python -m pipeline.abenteuer.questverfehlen --objekte DATEI`.
  - Er spielt die Gesamtsimulation und fasst die Auslöser einer Quest erst an, wenn sonst nichts
    mehr geht (kurz vor dem Ende des Laufs). Nach dem Ende holt er die Quest gezielt nach.
  - Ergebnis je Quest:
    - „ok (von der Geschichte gebraucht)“;
    - „ok (aufgeschoben und nachgeholt)“;
    - „VERFEHLT“.
  - Ein Lauf dauert 2 bis 8 Minuten je Quest. Deshalb ist er kein Dauertest; er dient zum
    Bestätigen.

## Ergebnis der statischen Prüfung

Geprüft wurden 291 Starts und Schritte aus 91 Quests:

| Stufe | Anzahl |
| --- | --- |
| sicher | 268 |
| folgt aus der Quest | 11 |
| Ausnahme mit Grund | 8 |
| gemeldet | 4 |

Die Ausnahmen sind Sperren, die die Reihenfolge der Geschichte ausschließt; die Gründe stehen in
`questverfehlen_geprueft.py`:

- **Brett auf dem Dachboden:** Es fehlt erst nach dem ersten Abend, und der kommt erst nach der
  ersten Lektion.
- **Big Joe in Ironwood:** Er ist bis zum Ende von Akt 3 da. Big Joe bietet den Clubkampf erst an,
  wenn Mama gespielt hat; Mama geht erst nach dem Kauf, und der Kauf kommt erst nach dem Clubkampf.
- **Victor in Ghost Town:** Er bleibt, bis man Capital Arena erreicht. Der Weg dorthin öffnet erst
  nach seinem Gespräch nach der Fernpartie.
- **Victor an der Bergstation:** Er bleibt bis zum Grab. Summit City verlässt man erst mit der
  Nadel, also nach Schritt 7.

### Behoben

- **Reihenfolgefalle in der Hauptquest von Riverton** (`riverton.parkclub`, Schritt 4):
  - Gefunden mit dem Aufschieber. Quests laufen streng der Reihe nach. Wer in Riverton zuerst
    Tamsins Aufgabenreihe löste und erst danach Slick ansprach (Schritt 3), blieb für immer bei
    Schritt 4 hängen, denn Tamsin bietet die Reihe danach nicht mehr an.
  - Behebung (`app/src/abenteuer/regeln/quests.ts`, `schonEingetreten`): Kommt eine Quest bei
    einem Schritt an, dessen Runde schon bestanden oder dessen Partie schon mit passendem Ausgang
    gespielt ist, zählt der Schritt sofort, mit seinen Wirkungen.
  - Das gilt für alle Quests, ebenso in der Gesamtsimulation (`melde`).
  - Gegenprobe: Aufschieber „ok (aufgeschoben und nachgeholt)“. Tests in
    `questsnachholen.test.ts`.
- **Feier in Ironwood** (`ironwood.feier`):
  - Fehler: Wer Big Joes Einladung ablehnte und Akt 3 beendete, fand Big Joe nicht mehr. Die
    Nebenquest blieb für immer offen.
  - Behebung: Big Joe bleibt in der Kantine, solange Mama gespielt hat und die Feier fehlt. Seine
    Bedingung in `orte.json` lautet jetzt `nicht endeAkt3Gesehen oder (mamaSpielt und nicht
    feierGesehen)`.
  - Seine Dialoge bieten die Feier in jedem späteren Zustand an („Wird noch gefeiert?“).
  - Big Joe steht in Akt 4 ohnehin auch in Crossroads; `figurenort` meldet nichts.

### Gemeldet (Entscheidung zu Karten oder Dialogen nötig)

1. **Zuschauen bei Tamsin** (`riverton.zuschauen`, Start):
   - Fehler: Der geräumte Pavillon (Zustandskarte bei `slickAbschiedGesehen`) hat keine Tamsin.
     Wer bis zu Slicks Abschied nicht dreimal mit ihr gesprochen hat, bekommt das Zuschauen nie
     angeboten. Das Nachholen im Pinewood Camp setzt voraus, dass es angeboten war.
   - Vorschlag: Tamsin in die Zustandskarte des Pavillons setzen, solange
     `nicht slickBeobachtenBestanden` gilt. Das ist eine Szenenänderung.
   - Andere Möglichkeit: Im Pinewood Camp auch ohne `zuschauenAngeboten` anbieten. Dafür
     bräuchte die Quest einen zweiten Startknoten, und das kann das Datenformat bisher nicht.
2. **Victors Spielberichte** (`siliconBay.spielberichte`, Start und Schritt 1):
   - Fehler: Victor verlässt Silicon Bay mit dem Ende von Akt 3. Wer die Auswertung abgelehnt
     hat, kann sie danach nicht mehr spielen, und die Quest bleibt offen.
   - Vorschlag: Victor an der Bergstation bietet die Auswertung an, solange die Quest läuft
     (`beginneAufgaben("siliconBay.auswertung")`). Schritt 1 wartet nur auf die Runde, das
     genügt.
   - Den Start (nie gefragt) kann man so lassen. Es ist ein Angebot, das man verpasst; im
     Tagebuch bleibt dann nichts hängen.
3. **Fehlende Seite** (`siliconBay.fehlendeSeite`, Schritt 2):
   - Fehler: Victor gibt die Seite nur an der Bergstation, bis zum Grab. Wer das Foto in der
     Vitrine (Schritt 1) erst danach ansieht, bleibt bei Schritt 2 hängen.
   - Vorschlag: Schritt 2 auf eine Wirkung umstellen, die die Hülle setzt, sobald beide Teile da
     sind. Oder die Seite gibt auch Victor in Ghost Town und Capital Arena; dafür wäre der Schritt
     ein Ort- oder Fundereignis statt des Knotens. Das ist eine Dialog- und Datenänderung im
     Bereich von mittel-1.

4. **Archiv ordnen** (`cedarCreek.archivOrdnen`, Start; gefunden mit dem Aufschieber):
   - Fehler: Okafor bietet das Ordnen nur an, solange die Clubnadel von Cedar Creek fehlt
     (cedar-creek-archiv: `nadelCedarCreek == 0 oder ordnenAngeboten`). Wer zuerst den Clubkampf
     gewinnt, bekommt die Nebenquest nie. Es ist ein verpasstes Angebot; im Tagebuch hängt nichts.
   - Vorschlag: Okafor bietet das Ordnen nach der Nadel einmal in der Bibliothek an. Die
     Bedingung im Karton zu lockern hieße, dass das Ordnen jedes Mal die Erzählung von 1858
     verdrängt.

## Weitere Fallgruppen

- **Gegenstände und Läden:**
  - Verkaufen gibt es nicht.
  - Gegenstände, die Bedingungen verlangen: Laterne (Steinbruch), Limo, Fahrrad. Ihre Läden
    hängen an Figuren ohne `wenn` (Edna in Ironwood, die Kioske) und bleiben offen.
- **„Nicht jetzt“:** Einmalige Eingänge mit verneinter Bedingung prüft die statische Prüfung mit.
  Bedingungen innerhalb von Ink (`{nicht x: …}`) sieht sie nicht; die deckt der Aufschieber ab.

## Läufe

**Aufschieber** (Stand 20.11.2026, 20:15; 46 von 91 Quests, der Rest läuft weiter):

| Ergebnis | Anzahl |
| --- | --- |
| ok, von der Geschichte gebraucht | 26 |
| ok, aufgeschoben und nachgeholt | 18 |
| verfehlt | 2 |

- **Die zwei Verfehlten:**
  - `riverton.parkclub` ist behoben, siehe oben.
  - `cedarCreek.archivOrdnen` ist gemeldet, siehe Befund 4.
- **Gezielt geprüft:** Mamas Finale, der Clubkampf und die Feier in Ironwood, die Fernpartie und
  das Endspiel in Summit City sind alle ok. `siliconBay.spielberichte` wurde nie begonnen; das
  bestätigt die statische Prüfung.
- **Grenze:**
  - Für Tamsins Zuschauen und die fehlende Seite zeigt der Aufschieber „ok“. Er fasst Victor an,
    sobald die Hauptquest ihn braucht, und spielt den späten Fall deshalb nicht nach. Die
    statischen Befunde bleiben gemeldet.
  - Innerhalb von Ink geschlossene Angebote wie bei Befund 4 findet nur der Aufschieber.

**Eiliger Spieler** (`DURCHLAUF_SPIELER=eilig`, Stand zu Beginn von Akt 2 aus `aktstand.cjs`, 45
Minuten):

- Er spielte bis zur Raststätte vor Silicon Bay, also durch ganz Akt 2. Dabei:
  - 9 Partien und 8 Runden;
  - Einkäufe im Laden;
  - doppeltes Tippen, die jeweils erste Antwort und Umdrehen nach Kartenwechseln.
- Offen blieben danach nur die Sammelstränge, die bis Akt 4 laufen, die nächsten Schritte der
  Hauptgeschichte und der Schuppen in Riverton. Der Schuppen bleibt erreichbar: Die Sperre am
  Fahrrad setzt nur die Quest selbst, und Riverton erreicht man mit der Monatskarte.
- Kein Fund der Wache in Akt 2.
