# Versionsnotizen: Schach-Abenteuer (Entwurf, 20.11.2026)

Entwurf für den Schritt nach main. Er umfasst alles am Spiel seit Beta 0.3.56 (8.11.2026), Stand
20.11.2026. Er ist für Leser geschrieben, also für Kinder, Jugendliche und Eltern, und verrät
nichts von der Geschichte. Die Versionsnummer setzt der Hauptchat beim Schritt (Empfehlung 0.4.0,
`vor_main_checkliste.md`).

Quellen: `docs/FORTSCHRITT.md` (Stände 8. bis 20.11.), Testpunkte in `docs/AUFGABEN_AUTOR.md` und
die Berichte in diesem Ordner vom 17. bis 20.11. Am 8.11. war das Spiel ein technischer Prototyp;
deshalb ist fast alles neu.

---

## Neu: das Schach-Abenteuer

Das Spiel zum Buch: Du ziehst mit deiner Mutter in eine neue Stadt, findest eine geheimnisvolle
Kiste und reist mit Schach quer durchs Land. Du spielst Partien, löst Rätsel und triffst Menschen,
die Schach lieben.

- **Vier Akte mit Ende:** Akt 1 Maple Falls und Cedar Creek, Akt 2 Riverton, Lockport und Ironwood,
  Akt 3 Silicon Bay, Port Delacroix und Desert Springs, Akt 4 Summit City bis zur Capital Arena.
  Dazu kommen Wege und Ausflugsorte, Abspann und Epilog. Spielzeit grob 12 bis 18 Stunden.
- **Gegner, die wie Menschen spielen:** Die Engine Maia spielt wie Menschen deiner Stärke, mit
  eigenen Stärken und Schwächen je Figur.
- **Mehr als Partien:** kurze Begegnungen auf der Straße, Endspiele, Zufallsschach (Schach960),
  Zugerraten in Erinnerungen, Gedächtnisstellungen, Aufgabenrunden aus dem Buch.
- **Antworten auf dein Spiel:** Nach jeder Partie und jedem Rätsel sagt die Figur etwas zu deinem
  Ergebnis.
- **Bedenkzeit nach Wahl:** Du wählst die Uhr. Spielst du viel zu schnell oder zu langsam, gibt
  dein Mentor dir höchstens zweimal pro Partie einen Hinweis.
- **Zielpfeil:** Im Tagebuch schaltest du einen goldenen Pfeil ein. Er zeigt den Weg zur
  laufenden Aufgabe, auch über mehrere Orte.
- **Tagebuch:** mit Aufgaben, Funden, Sammelkarten, deinen Münzen und „Meine Partien“ zum
  Nachspielen.
- **Musik und Geräusche:** über 150 eigene Musikstücke und Geräusche an jedem Ort, auf Wunsch als
  Untertitel.
- **Bilder:** gezeichnete Porträts mit Stimmungen und große Bilder an wichtigen Stellen.
- **Fürs Handy gebaut:**
  - Steuerkreuz links oder rechts, Hoch- und Querformat;
  - zwölf Brettstile mit Pixelfiguren;
  - kurze Hinweise beim ersten Spielen;
  - „Willkommen zurück!“ mit deiner Aufgabe, wenn du länger weg warst.
- **Reisen:** Mit Monatskarte und Fernbus kommst du schnell in Orte, die du schon kennst.
- **Offline:** Einmal geladen, läuft das Spiel ohne Netz. Der Spielstand liegt in deinen
  Nutzerdaten und ist in der Sicherung der App enthalten.

## Besser

- **Schneller Start:** Über Mobilfunk erscheint die Welt nach etwa 11 statt 95 Sekunden.
  Geräusche und Maia laden danach im Hintergrund.
- **Gleichmäßige Schwierigkeit:** Die Gegner werden bis zum Finale stetig stärker. Wer an einer
  Wegsperre dreimal scheitert, darf trotzdem weiter.
- **Klare Wege:** Nach jedem Schritt der Geschichte sagt dir jemand, wohin es als Nächstes geht.
- **Ruhigere Gespräche:** Sprechblasen liegen nie auf dem Brett. Meldungen wie „Neu im Tagebuch“
  kommen erst nach dem Gespräch, eine nach der anderen.
- **Die Welt fühlt sich echter an:**
  - Innenräume sind so groß wie das Haus von außen;
  - Leute und Tiere stehen im Weg, wer sitzt, sitzt auf Stuhl oder Bank;
  - der Bildausschnitt folgt ohne Ruckeln.
- **Münzen:** Die Anzeige erscheint nur, wenn sich etwas ändert, zählt hoch oder herunter und
  blendet dann aus. Im Laden bleibt sie stehen.
- **Am iPhone:**
  - Ton nach dem ersten Tippen;
  - kein Zoom beim Doppeltippen;
  - Abstand zur Kamera-Aussparung;
  - langes Drücken markiert keinen Text mehr.
- **Dunkelmodus:** Die Fenster des Spiels bleiben hell und gut lesbar.
- **Tastatur:** Die Leertaste bestätigt in allen Fenstern.

## Behoben

- Wer kurz vor dem Ende neu lud, verpasste den Abspann.
- Neuladen mitten im Gespräch konnte Fortschritt kosten.
- Lange Spielzeiten konnten am Handy den Browser-Tab beenden; der Ton braucht jetzt viel weniger
  Speicher.
- Ein Remis in kurzen Partien zählte als Sieg.
- Nach einer verlorenen Revanche fehlte die Antwort der Figur.
- Doppeltippen auf „Weiter“ konnte eine Antwort wählen, die du nicht gelesen hattest.
- An einigen Stellen kam man nicht mehr weiter; diese Sackgassen sind beseitigt.
- Im Querformat waren Umwandlung und Kartenwahl verdeckt.
- In Partien aus Stellungen des Buches spielte der Gegner die ersten Züge ohne Maia.

## Gut zu wissen

- **Größe:** Zum Start lädt das Spiel etwa 13 MB. Ganz offline sind es mit Maia und aller Musik
  gut 200 MB, deshalb am besten im WLAN laden.
- **Maia kommt kurz nach dem Start:** Beginnst du eine Partie, bevor Maia ganz geladen ist,
  spielt dein Gegner diese eine Partie ohne Maia.
- **Speicher am iPhone:** Safari kann Daten von Seiten löschen, die du lange nicht besucht hast.
  Füge die App zum Home-Bildschirm hinzu und mach ab und zu eine Sicherung (Profil ›
  Einstellungen › Deine Daten).

---

## Notizen für den Hauptchat (nicht für Leser)

- Weggelassen sind Wendungen der Geschichte, Personen außer Mutter und Mentor, Namen der Wegsperren
  und alles, was Spieler nicht bemerken (Tests, Werkzeuge, Codepflege).
- **Stand der Behebungen:** Der Dunkelmodus (3eb61dda), die Münzanzeige (7748b010) und die
  WebKit-Meldung „Context is stopped“ (f30b9bfa) sind auf `uebergabe/innenraeume` behoben.
  FORTSCHRITT führt sie noch als offen.
- **Noch offen:**
  - Textfenster und Zoom im Querformat (mittel-3). Wird das fertig, gehört es unter „Besser“.
  - Ein Gerätetest am echten iPhone (`ios_20-11.md`).
- Die Einleitung ist laut AUFGABEN_AUTOR vorerst nur Text; kommen die Bilder vor dem Schritt,
  gehört ein Satz dazu.
- **Spielzeit:** FORTSCHRITT nennt 12 bis 17 Stunden, `ausdauer_19-11.md` 13 bis 18. Hier steht
  „grob 12 bis 18“.
