# `inhalte/de/` – vom Autor freigegebene Ergänzungen

Hier liegt, was nicht im Buch steht, aber in die App gehört (Konzept Abschnitt 3): Zugfolgen als
PGN, später vorbereitete Texte und Kalibrierungswerte. Alles hier ist versioniert und wird nur mit
Freigabe des Autors in die App übernommen.

## `zugfolgen/kapNN/*.pgn` – die Beispiele des Buches

Je Beispiel (Eröffnung, Partie, Übung, Studie) eine PGN-Datei. Die Pipeline schreibt sie als
**Entwurf** aus den Zugfolgen des Buchtexts (AP 3):

```
[Event "Kapitel 1: Die drei Ziele in der Praxis: das London-System"]
[Beispiel "k01-a2"]
[Kapitel "1"]
[Abschnitt "1.1"]
[Status "entwurf"]
[Abbildungen "1.2 1.3 1.4 1.5 1.6 1.7"]

1. d4 d5 2. Bf4 { Abb. 1.2 } 2... Nf6 3. e3 e6 4. Nf3 { Abb. 1.3 } ... *
```

- Züge stehen in englischer Kurznotation (PGN-Norm); die App zeigt sie deutsch.
- `{ Abb. 1.2 }` markiert den Zug, nach dem die Abbildung steht. Abzweigungen stehen in Klammern,
  Zugzeichen als `$1` (!), `$2` (?), `$3` (!!), `$4` (??), `$5` (!?), `$6` (?!).
- Beginnt ein Beispiel nicht in der Grundstellung, steht die Startstellung in `[FEN "…"]`.

**Prüfhilfe:** `buch/arbeit/freigabe/kapNN.md` zeigt jedes Beispiel eines Kapitels in deutscher Notation:
Hauptlinie, Abzweigungen mit Zeilennummer im LaTeX, die Abbildungen an ihrem Zug und die Befunde
der Pipeline, dazu geprüfte Einschätzungen mit Korrekturvorschlag. `buch/arbeit/freigabe/README.md`
zählt je Kapitel die Beispiele und die noch nicht eingeschätzten Warnungen. Beides schreibt jeder
Datenlauf neu.

**Freigabe (AP 4):** Der Autor prüft eine Datei, korrigiert bei Bedarf Züge, Abzweigungen oder
Abbildungen und setzt `[Status "freigegeben"]`. Ab dann gilt:

- Die Pipeline überschreibt die Datei **nie** mehr; neue Entwürfe für dasselbe Beispiel entstehen
  nicht.
- Beim Datenlauf wird sie nachgespielt und abgeglichen: Illegale Züge sind Fehler, eine Abbildung
  an einem Zug, der ihre Stellung nicht erreicht, ist eine Warnung (Bericht in `buch/arbeit/berichte/`).
- Das Beispiel erscheint in `app/public/daten/de/a1/kapNN.json` unter `beispiele`, und jede seiner
  Abbildungen bekommt den Pfad dorthin (`abbildung.beispiel`). Nur freigegebene Beispiele sind in
  der App sichtbar.

Entwürfe (`[Status "entwurf"]`) werden bei jedem Datenlauf neu erzeugt; Änderungen daran gehen
verloren. Wer etwas ändern will, gibt frei. Ein Entwurf, der gar nicht in die App soll (etwa weil
seine Züge in einem anderen Beispiel aufgehen), bekommt `[Status "verworfen"]`: Er bleibt liegen,
wird nie überschrieben und nie übernommen. Entwürfe, die ein Datenlauf nicht mehr erzeugt,
löscht die Pipeline.

**Konstruierte Partien** (`[Status "konstruiert"]`, seit 0.2.90, Entscheidung des Autors vom
18.10.2026): Zu Abbildungen ohne Zugfolge im Buch, deren Stellung aus einer realistischen Partie
erwachsen kann (Einordnung mit Grund in `konstruktion.json`), baut
`python -m pipeline.zugfolgen.konstruieren` eine Partie ab der Grundstellung, die genau die
Abbildung erreicht (Stellung, Zugrecht, Rochaderechte, en passant). Datei `kNN-aMM-k.pgn`, die
Abbildung steht am letzten Zug. Sie wird nie überschrieben, kommt immer in die App und zeigt dort
den Hinweis „Zugfolge von Claude konstruiert, nicht aus dem Buch“ (Regel 1). Trainer und
Eröffnungsindex nehmen sie nicht. Erreicht sie die Abbildung nicht exakt, meldet der Datenlauf
einen Fehler. Die Kopfzeile `[Genauigkeit "…"]` schreibt der Messlauf der App
(`app/src/spiel/konstruiert.messung.ts`, Tiefe 18).

Die Kennung richtet sich nach der Abbildung, an der das Beispiel beginnt, sonst nach seiner
kleinsten Abbildungsnummer: `k02-a55` beginnt bei Abb. 2.55. Beispiele ohne Abbildung heißen nach
ihren ersten Zügen (`k03-z-d4-d5-c4`). So verschiebt sich keine Kennung, wenn ein anderes Beispiel
dazukommt oder wegfällt. Ein freigegebenes Beispiel darf umbenannt werden (Datei und
`[Beispiel "…"]` gemeinsam). Erzeugt die Pipeline zu einer freigegebenen oder verworfenen Datei
einen Entwurf mit anderen Abbildungen, meldet die Prüfhilfe das als Befund `entwurf-abweichend`.

## `einschaetzungen.json` – geprüfte Befunde

Von Hand gepflegte Einschätzungen zu Befunden der Pipeline: Datei, Prüfung, ein Textstück des
Befunds, Urteil („Buchfehler“, „kein Buchfehler“, „Ermessen des Autors“), Begründung und Vorschlag.
Die Prüfhilfe zeigt sie beim passenden Befund. Zeilennummern fehlen absichtlich, weil sie sich bei
jeder Buchänderung verschieben. Eine Einschätzung ohne passenden Befund listet
`buch/arbeit/freigabe/README.md` als erledigt.

## `empfehlungen.json` – Vorschläge zur Freigabe

Von Hand gepflegt (Claude), die Prüfhilfe zeigt sie an. Zwei Listen:

- `beispiele`: je Beispiel eine Empfehlung („zusammenführen“ mit `mit`, „getrennt lassen“,
  „Vorlauf übernehmen“, „aufteilen“, „verwerfen“) und die Begründung. Erscheint in
  `buch/arbeit/freigabe/kapNN.md` direkt unter dem Beispiel.
- `abbildungen`: für jede Abbildung ohne Zugfolge die Einordnung (Lehrbild, Skelett, Mattbild,
  Endspiel-Lehrstellung, Übungsstellung, gedachte Stellung …) mit Begründung und Vorschlag. Die
  Art „Zugfolge möglich“ nennt einen Zug, den Claude gegen beide Stellungen geprüft hat.
  Erscheint als Tabelle am Ende jeder Prüfhilfe.

Es sind Vorschläge: Erst die Antwort des Autors setzt sie in den PGN-Dateien um.

## `texte/loesungen-kapNN.json` – knappe Lösungserklärungen (AP 6)

Je Übung zwei bis drei Sätze: Lösungszug, Motiv, Kern der Idee (Konzept 4.3). Felder: `uebung`
(Label), `nummer`, `status` (`entwurf` oder `freigegeben`), `loesung` (Züge in deutscher Notation
wie im Buch, `null` bei Übungen ohne Zug), `akzeptiert` (weitere Züge, die das Buch gelten lässt),
`motiv`, `text`. Schema: `schemas/loesungstexte.schema.json`.

Die Entwürfe hat Claude aus den Lösungen des Buches verdichtet. Lesen geht bequemer in
`buch/arbeit/freigabe/erklaerungen.md`; ändern und freigeben direkt in der JSON-Datei. Jeder Datenlauf
prüft: Übung vorhanden, Nummer stimmt, Züge ab der Übungsstellung spielbar, erster Lösungszug
steht in der Buchlösung; mit `--zugzeichen` auch, ob die Engine den ersten Zug bestätigt. Nur
freigegebene Erklärungen kommen als `uebung.erklaerung` in die App. Diese Dateien schreibt die
Pipeline nie.

## `texte/vorbereitet-kapNN.json` – vorbereitete Texte (AP 14)

Je Abbildung (Art V, Pflichtenheft 3 und 6.1): `einschaetzungen` – je Werkzeug (`werkzeug`,
etwa `k1-zaehlen`) ein kurzer `text` und drei `hinweise` (Stufe 1: worauf achten, Stufe 2: wo auf
dem Brett, Stufe 3: fast die Lösung); `fragen` – Warum-Fragen zum nächsten Buchzug (`zug` in
deutscher Notation mit Zugnummer wie im Buch, `frage`, zwei bis vier `antworten`, `richtig` als
Position ab 0, `erklaerung`). Dazu `status` (`entwurf` oder `freigegeben`) und optional
`engineGeprueft` (Datum). Schema: `schemas/vorbereitet.schema.json`.

Claude schreibt die Entwürfe; lesen geht bequemer in `buch/arbeit/freigabe/vorbereitet.md`. Jeder
Datenlauf prüft: Abbildung vorhanden, Werkzeug bekannt und bis zum Kapitel der Abbildung
freigeschaltet, Zug spielbar, richtige Antwort vorhanden; mit `--zugzeichen` auch, ob die Engine
den erfragten Zug für höchstens 0,3 schlechter als den besten hält. Nur freigegebene Texte kommen
als `abbildung.vorbereitet` in die App, mit `--mit-entwuerfen` auch Entwürfe (gekennzeichnet).
Diese Dateien schreibt die Pipeline nie.
