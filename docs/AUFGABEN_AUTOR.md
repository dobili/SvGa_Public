# Was noch zu tun ist (für den Autor)

Stand: 30.10.2026, Version 0.3.13 (Orden verstreut, Pfeile in den Werkzeugbildern, Tagesserie ohne Verfall; dein Prüfstand vom 30.10. ist eingearbeitet).
**Diese Datei ist die einzige, die du brauchst:** Hier steht
alles, was du testen oder entscheiden sollst, mit allen Informationen dazu, und nur, was noch
offen ist. Erledigtes wandert nach `docs/ENTSCHEIDUNGEN.md` (musst du nicht lesen).

**In der App (seit 0.2.75):** Halte „Profil“ unten rechts drei Sekunden gedrückt (am Rechner:
Adresse `/app/#aufgaben`). Dann öffnet sich diese Datei als Seite: Abbildungen, Trainer,
Spielen, Einstellungen und Nachschlagen im Text sind Links, jeder Punkt hat einen Haken und eine
Notiz. „Stand in die Zwischenablage“ legt alles Abgehakte und Notierte als Text ab („N306 ok“,
„N305: Pfeil fehlt“), den du in den Chat einfügst.

**So antwortest du:** im Chat mit den Kürzeln, etwa „N203 ok“, „N205 falscher Pfeil“, „X5: so
lassen“, „T1: Vorschläge übernehmen“. Claude trägt alles ein. Bei Fehlern in der App hilft
**Profil › Einstellungen › Fehler melden**: Den kopierten Text mitschicken (App-Version,
Datenstand, Gerät; mit dem Dashboard sendet das Formular die Meldung direkt), bei allem anderen kurz, **was** du getan hast und **was** passiert ist, gern
mit Bildschirmfoto.

Adresse: <https://schach-von-grund-auf.com/app/> (oder die installierte App). Vorher in den
Einstellungen (Profil › Einstellungen, ganz unten) prüfen, dass „App-Version 0.3.13“ dasteht; sonst die App neu laden.

Reihenfolge nach Wichtigkeit: Teil 1 testen (neueste Nummern zuerst), dann Teil 2: oben „Nur
bestätigen“ mit einem Satz („alle ok außer …“), darunter die Entscheidungen. Alle
Nummern gelten für die aktuelle Version; frühere Versionen musst du nicht mehr getrennt testen.

---

## Teil 1: Testen auf dem Handy

Alle Punkte bis 0.2.115 hast du am 19.10.2026 abgehakt; sie stehen jetzt in
`docs/ENTSCHEIDUNGEN.md`. Deine Notizen und Wünsche aus derselben Rückmeldung arbeitet Claude als
Arbeitsliste R1 bis R26 ab (`docs/FORTSCHRITT.md`). Neue Testpunkte kommen hier hinzu, sobald ein
Teil fertig ist.

### Einstellungen neu (31.10.2026)

Die Einstellungen sind nach deiner Wahl des Entwurfs K2 „Brettvorschau oben“ neu gebaut: oben ein
großes Brett in deinen Farben und Figuren, darunter Farbfelder und Figurenkacheln zum Antippen,
dann drei Reiter (Bedienung, Anzeige, Hilfe) mit je einer Zeile pro Einstellung, ganz unten genau
einmal die Zeilen „Bots und Wertung“, „Deine Daten“ und „Über die App“. Öffnen: unten „Profil“,
dann oben „Einstellungen“. Bitte im dunklen und im hellen Modus ansehen.

- [ ] N2300. **Brettvorschau:** Oben steht ein großes Brett mit einer Eröffnungsstellung, zwei
      goldenen Pfeilen (Läufer c4 nach f7, Springer f3 nach g5), einem rot umrandeten Feld f7 und
      dem letzten Zug g8–f6 leicht hervorgehoben. Darunter „Koordinaten“ mit Schalter. Wirkt das
      Brett groß und ruhig genug, und passt der Hintergrund dahinter (dunkel: Nachtblau, hell:
      Creme)?
- [ ] N2301. **Brettfarbe:** Unter „Brettfarbe“ stehen runde Farbfelder in einer Reihe, die du
      seitlich wischst: die acht Farben, Holz, die drei Materialbretter und am Ende „Nacht und
      Gold“ mit Schloss. Tippe „Grün“: Der goldene Ring springt dorthin, und das Brett oben ist
      sofort grün. Tippe „Nacht und Gold“ (gesperrt): Unter der Reihe steht, wie man es
      freischaltet; die Wahl bleibt. Öffne danach eine Abbildung: gleiche Farbe wie in der Vorschau?
- [ ] N2302. **Figuren:** Unter „Figuren“ zeigen Kacheln je einen weißen Springer des Satzes auf
      dem hellen Feld deines Brettes („wie im Buch“, Cburnett, Merida, Chessnut, Mpchess, Celtic,
      Spatial, die drei Holzsätze, „Gold“ mit Schloss). Tippe „Merida“: Die Figuren oben wechseln
      sofort. Beim nächsten Öffnen der Einstellungen ist die gewählte Kachel ins Bild gerückt.
- [ ] N2303. **Koordinaten:** Schalte „Koordinaten“ unter dem Brett aus: Die Buchstaben und
      Zahlen am Rand der Vorschau verschwinden sofort. Öffne eine Abbildung: auch dort keine
      Koordinaten. Danach wieder einschalten.
- [ ] N2304. **Reiter „Bedienung“:** Fünf Zeilen mit Symbol und Schalter: „Figuren per Wischen
      ziehen“, „Züge gleiten über das Brett“, „Ton bei Zug und Schlag“, „Feiereffekte“, „Startbild
      beim Öffnen der App“. Die Erklärung steht nur noch hinter dem Fragezeichen: Tippe es bei
      „Feiereffekte“, der Text erscheint unter der Zeile, ein zweiter Tipp blendet ihn aus. Lassen
      sich die Schalter gut treffen?
- [ ] N2305. **Reiter „Anzeige“:** „Nachtmodus“ mit den Chips „wie das Gerät“, „aus“, „an“ unter
      der Zeile; „Schriftgröße“ mit „A−“, Prozent und „A+“ rechts in der Zeile (bei Abweichung
      erscheint darunter „Standard“); „Sprache“ mit Deutsch und der englischen Vorschau. Probiere
      „A+“ und dann „Standard“.
- [ ] N2306. **Reiter „Hilfe“:** „Toursymbol oben rechts“ mit Schalter, „Rundgang durch die App“
      mit dem Knopf „Starten“, „Erklärkacheln von Zählen und Ziehen“ mit „Wieder anzeigen“.
      Schalte das Toursymbol aus: Der Kompass oben rechts verschwindet; „Starten“ beginnt den
      Rundgang trotzdem. Danach wieder einschalten.
- [ ] N2307. **Daten und Über nur einmal:** Wechsle zwischen den drei Reitern. Unter jedem steht
      dieselbe kurze Liste „Bots und Wertung“, „Deine Daten“, „Über die App“ genau einmal (früher
      standen die Karten „Daten“ und „Über die App“ lang unter jedem Reiter). Rechts steht der
      Stand: „ohne Maia · Lichess“ (oder „Maia an“), „noch nie gesichert“ oder „gesichert am …“
      (ein oranger Punkt, wenn eine Sicherung fällig ist), die Versionsnummer.
- [ ] N2308. **Unterseiten:** Tippe jede der drei Zeilen. „Bots und Wertung“: Maia laden,
      schalten, löschen und darunter der Maßstab der Wertung (Lichess, chess.com, FIDE; früher im
      Reiter „Anzeige“). „Deine Daten“: Sicherung anlegen und einspielen, alle Daten löschen,
      Anleitung zum Entfernen. „Über die App“: Version, Datenstand, Offline, Update suchen, Fehler
      melden, Lizenzen, Datenschutz, Impressum. Oben links führt „Einstellungen“ zurück. Fehlt dir
      etwas, das es vorher gab?
- [ ] N2309. **Tour der Einstellungen:** Tippe in den Einstellungen den Kompass oben rechts. Die
      Tour zeigt nacheinander die Brettvorschau, die Reiter Bedienung, Anzeige und Hilfe, dann die
      Zeilen „Bots und Wertung“, „Deine Daten“ und „Über die App“. Stimmen die Texte zu dem, was
      du siehst?

### Neu in 0.3.31: Profil neu – Orden, Wertung, Rekorde (Arbeitschat, 31.10.2026)

Drei Karten im Profil sind neu gebaut, nach deiner Wahl der Entwürfe: „Deine Erfolge“ (Orden und
Abzeichen mit Glanzstück und Regalen), „Deine Wertung“ (drei Kacheln) und „Deine Rekorde“
(Erreichtes und Herausforderung). Jede zeigt am Anfang nur, was schon etwas bedeutet; Leerstellen
werden zu einem nächsten Schritt. Profil: Tipp auf „Profil“ unten in der Leiste. Proben über die
Aufgabenseite (drei Sekunden auf das Zahnrad bzw. „Profil“): „Orden testen“ und „Abzeichen
testen“; „Probe beenden“ stellt alles zurück.

- [ ] N2240. **Erfolge, Glanzstück:** Unter „Dein Fortschritt“ steht die Karte „Deine Erfolge“
      mit Zähler oben rechts („27 von 39“). Oben ein flacher Streifen: links „Zuletzt verdient“
      mit Datum, in der Mitte das Stück mit seinem Namen darunter („Teil Endspiel“), rechts der
      kurze Satz zur Bedingung und „Teilen“. Er ist etwa halb so hoch wie im Entwurf. Passt die
      Höhe so?
- [ ] N2241. **Erfolge ohne verdientes Stück:** Auf einem frischen Gerät (oder nach „Daten
      löschen“) steht statt des Glanzstücks ein Hinweis wie „Dein erstes Stück wartet: Erste
      Partie. …“ mit dem Bild als Silhouette. Freundlich genug?
- [ ] N2242. **Als Nächstes:** Darunter „Als Nächstes“ mit zwei bis vier Stücken, denen am
      wenigsten fehlt, als Silhouette in einem goldenen Fortschrittsring mit „19 von 24“
      darunter. Abzeichen erscheinen hier nur, wenn sich ihr Fortschritt zählen lässt (etwa
      „Fünfzig Partien 41 von 50“, „Drei Rekorde 2 von 3“; nicht „Brillanter Zug“).
- [ ] N2243. **Regale:** Darunter je Bereich ein Regal zum Wischen mit Zähler („5 von 9“): Buch,
      Teile des Buches, Bots besiegt, Abzeichen. Verdiente Stücke farbig, offene als Silhouette.
      Ein Tipp auf ein Stück zeigt darunter Name und Bedingung (bei offenen mit Stand „(2 von
      78)“), bei verdienten dazu „Teilen“. Probe: Aufgabenseite › „Orden testen“ › einen Teil
      auf 100 % setzen, dann steht der Orden farbig im Regal. Lässt sich gut wischen?
- [ ] N2244. **Dein Fortschritt schlanker:** Die Karte „Dein Fortschritt“ zeigt jetzt nur Stufe
      und EP, die Ringe Abbildungen, Übungen, Lernziele, Trainer und „Je Kapitel“. Die
      aufklappbaren Ringe für Teile und Bots und das Abzeichengitter sind dort weg (sie stehen in
      „Deine Erfolge“). Die Erklärung zu Abzeichen und EP steht unten in „Deine Erfolge“ unter
      „So bekommst du Orden, Abzeichen und EP“.
- [ ] N2245. **Wertung, Kacheln:** Mit gewerteten Partien stehen oben drei Kacheln Blitz,
      Schnellschach, Klassisch mit Zahl und „3 Partien“; die Zeitklasse deiner letzten Partie ist
      gold umrandet, ein Tipp wählt eine andere. Ohne gewertete Partie steht statt der Kacheln
      eine Einladung mit Knopf „Partie spielen“, der zu „Spielen“ führt.
- [ ] N2246. **Wertung, Schätzung:** Eine Zeitklasse ohne eigene Partie zeigt „≈ 1460“ und
      „geschätzt“ in blasser Schrift. Ein Tipp darauf zeigt den Satz „Noch keine gewertete Partie
      in Klassisch. Die Zahl ist aus deiner Wertung in einer anderen Zeitklasse geschätzt …
      Deine erste gewertete Partie in Klassisch ersetzt die Schätzung.“ Verständlich?
- [ ] N2247. **Wertung, Kurve und Maßstab:** Unter den Kacheln die Kurve der gewählten Zeitklasse
      mit „vorläufig · 3 von 10“ in den ersten zehn Partien. Der Maßstab steht nicht mehr in der
      Karte, sondern in Einstellungen › Anzeige › „Maßstab der Wertung“. Probe: dort „chess.com“
      wählen, zurück ins Profil: Unter dem Titel steht „Zahlen wie bei chess.com · ändern in den
      Einstellungen“, Zahl UND Kurve stehen jetzt im Maßstab von chess.com, darunter „Bereich
      1190–1490 · chess.com Schnellschach“.
- [ ] N2248. **Wertung, Phasen und Mehr:** Unter der Kurve „Nach Phasen“ mit drei Balken
      (Eröffnung, Mittelspiel, Endspiel) und „etwa 1400“; bis zehn Partien blass mit „Ab 10
      Partien genau; bis dahin nur ein Eindruck.“ (erst nach einer ausgewerteten Partie). „Mehr“
      klappt Ausschnitt, kurze Erklärung und „Wertung zurücksetzen“ auf.
- [ ] N2249. **Rekorde:** „Deine Rekorde“ zeigt groß nur die aufgestellten Rekorde mit Zeichen,
      Wert, Datum und „Teilen“. Darunter „Stell deinen ersten Rekord auf“ (sobald einer steht:
      „Noch mehr Rekorde“) mit zwei Vorschlägen, je mit kurzem Satz und Knopf „Los“, und „Noch 7
      weitere Rekorde“ zum Aufklappen. „Höchste Wertung“ sagt dort „Zählt ab der zehnten
      gewerteten Partie in einer Zeitklasse: noch 7 Partien.“ statt „noch keiner“. Probe: einen
      Trainer eine Runde spielen, dann stehen „Richtige Trainerantworten an einem Tag“ und
      „Lerntage in einer Woche“ oben. Hinweis: „vorher“ (der alte Wert) fehlt noch, weil die App
      ihn nicht speichert.

### Neu in 0.3.29: Meisterschaft je Thema (Arbeitschat, 31.10.2026)

Jedes Thema, das du in einem Trainer übst (die zwölf Taktikmotive, Endspielthemen, Bauernstrukturen,
Falle oder Köder), bekommt eine Medaille: Bronze für 5 richtige Antworten, Silber für 15 richtige
mit mindestens 70 % der letzten 20 Antworten richtig, Gold für richtige Antworten an mindestens
3 verschiedenen Tagen, zwei davon mindestens 7 Tage auseinander. Einmal erreicht, bleibt die
Stufe. Zum Prüfen ohne echten Fortschritt: Aufgabenseite (drei Sekunden auf das Zahnrad) ›
„Themen testen (Meisterschaft)“ › etwa „Fesselung zur Probe auf Silber“; die Probe zählt nur für
die Karte „Deine Themen“ und die Titel, nicht für Erfahrung und Abzeichen. Danach „Probe beenden“.

- [ ] N2180. **Karte „Deine Themen“:** Profil, ganz oben unter „Dein Fortschritt“. Ohne geübte
      Themen steht eine Einladung zum Üben. Nach der Probe „Fesselung zur Probe auf Silber“ steht
      dort eine Sternmedaille mit Turm und Silberrand, darunter „Fesselung“ und der Weg zu Gold
      („0 von 3 Tagen bis Gold“). Verständlich?
- [ ] N2181. **Erste echte Medaille:** Training › Taktiktrainer, Motiv „Fesselung“ wählen und
      fünf Aufgaben richtig lösen. Am Rundenende steht unter dem Ergebnis eine kleine Medaille
      mit kurzem Glanz und „Fesselung: Bronze!“. Mit ausgeschalteten Feiereffekten
      (Einstellungen) ohne Glanz. Passt die Meldung?
- [ ] N2182. **Fortschritt und Bedingung:** Profil › Deine Themen: unter der Bronzemedaille steht
      „5 von 15 bis Silber“. Ein Tipp auf das Thema zeigt die Bedingung für Silber und die Knöpfe
      „Üben“ und „Teilen“. Noch nicht erreichte Themen stehen als graue Silhouette mit „… von 5
      bis Bronze“.
- [ ] N2183. **Üben:** Im aufgeklappten Thema „Üben“ tippen: Der passende Trainer öffnet sich.
      Bei einem Endspielthema (etwa Opposition) ist im Endspieltrainer gleich die Gruppe
      „Bauernendspiele“ gewählt. Den Taktiktrainer stellt ein anderer Arbeitschat auf das Motiv
      ein; bis dahin öffnet er mit der gewohnten Auswahl.
- [ ] N2184. **Teilen:** Im aufgeklappten Thema mit Medaille „Teilen“: Es entsteht ein Bild
      „Meisterschaft“ mit der Medaille groß, „Fesselung: Silber“ und (bei echter Stufe) „Verdient
      am …“. Gefällt dir das Bild?
- [ ] N2185. **Medaillenbilder:** Probe für mehrere Themen auf Gold: Jedes Taktikmotiv hat ein
      eigenes Motiv im Stern (Springer, Turm, Schwerter, Blitz, „+2“, Kreispfeil, fallender König,
      Hantel, Uhr, Dame, Krone, Haken), Endspielthemen eine Strahlenmedaille, Strukturen ein
      Sechseck, Falle oder Köder ein Dreieck. Bronze, Silber und Gold gut zu unterscheiden?
- [ ] N2186. **Abzeichen:** Profil › Abzeichen: drei neue Abzeichen „Erstes Gold“, „Fünf Themen
      in Silber“, „Alle Taktikmotive in Gold“ mit eigenen Bildern. Mit „Abzeichen testen“ auf der
      Aufgabenseite lassen sie sich auslösen. Passen Namen und Bilder?
- [ ] N2187. **Titel „Taktiker“:** Probe für fünf Taktikmotive auf Gold (etwa Fesselung, Spieß,
      Doppelschach, Hinlenkung, Zwischenzug). Profil › Deine Extras › „Titel unter deinem Namen“:
      „Titel ‚Taktiker‘“ ist wählbar; nach „Wählen“ steht oben unter deinem Namen in Gold
      „Taktiker“. „Titel ‚Endspielkenner‘“ bleibt gesperrt mit „3 Themen im Endspieltrainer in
      Gold“. Gefällt dir der Platz unter dem Namen?
- [ ] N2188. **Erfahrungspunkte:** Eine echte Bronze bringt 10 Punkte, Silber weitere 25, Gold
      weitere 50 (Profil › Erfahrung). Die Probe bringt keine Punkte. Passt die Gewichtung?
- [ ] N2189. **Zum Auffrischen:** Liegt die letzte richtige Antwort eines Themas mit Medaille mehr
      als 60 Tage zurück, steht leise „Zum Auffrischen“ unter der Medaille; die Stufe bleibt.
      Prüfbar erst später; ist der Hinweis so recht?

### Neu in 0.3.28: Wochenaufträge (Arbeitschat, 31.10.2026)

Neu in der Karte „Deine Woche“ oben im Buch (erscheint nach dem ersten Lerntag; erst ein
Wochenziel wählen): der Abschnitt „Aufträge dieser Woche“ mit drei Aufträgen, fest von Montag bis
Sonntag. Jeder zeigt „1 von 3“, hat einen Knopf, der direkt hinführt, und einmal „Tauschen“.
Erledigt: Haken und „+15 Erfahrung“. Nicht Erledigtes verschwindet am Sonntag ohne Hinweis.
Mögliche Aufträge: neue Abbildungen ansehen, Übungen lösen, eine Runde in einem Trainer, der lange
nicht dran war, einen Bot eine Stufe über deinem stärksten besiegten schlagen, Warum-Fragen, ein
Lernziel abhaken, fällige Karten wiederholen, einen Fehler eintragen, Partien spielen, die
Tagesaufgabe an mehreren Tagen. Noch nicht auf der Testseite: Zweig `gami-p6-wochenauftraege`.

- [ ] N2190. **Drei Aufträge:** Buch, Karte „Deine Woche“, Abschnitt „Aufträge dieser Woche“
      über „Wann übst du?“. Drei Zeilen mit Satz, Stand „0 von …“ und Knopf. Klingen die Sätze
      freundlich und freiwillig genug?
- [ ] N2191. **Fest für die Woche:** App schließen und wieder öffnen, auch nach einer gelösten
      Übung oder einer Partie: Es bleiben dieselben drei Aufträge. Erst am Montag kommen neue.
- [ ] N2192. **Knopf führt hin:** Bei jedem Auftrag auf den Knopf tippen („Zur Abbildung“,
      „Üben“, „Zum Trainer“, „Spielen“ usw.). Er öffnet genau die passende Stelle; beim Trainer
      den genannten Trainer.
- [ ] N2193. **Fortschritt zählt mit:** Einen Auftrag teilweise erledigen (etwa eine neue
      Abbildung 30 Sekunden ansehen), zurück ins Buch: Der Stand steigt („1 von 10“). Was du vor
      Montag getan hast, zählt nicht.
- [ ] N2194. **Erledigt:** Einen Auftrag ganz erledigen. Die Zeile wird grün mit Haken und
      „Erledigt · +15 Erfahrung“, die Knöpfe verschwinden. Im Profil steigen die
      Erfahrungspunkte um 15.
- [ ] N2195. **Tauschen:** Bei einem offenen Auftrag „Tauschen“. Es kommt ein anderer Auftrag,
      der noch nicht in der Liste steht; an dieser Stelle gibt es danach kein „Tauschen“ mehr, an
      den anderen schon. Erledigte lassen sich nicht tauschen. Genügt einmal je Auftrag?
- [ ] N2196. **Bot besiegen:** Wenn der Auftrag „Besiege einen Bot der Stufe N“ kommt (sonst
      tauschen, bis er kommt): „Bot wählen“ öffnet „Spielen“ mit einem Bot dieser Stufe, gewertet.
      Nach einem Sieg gegen ihn steht der Haken. Passt die Stufe (eine über deinem stärksten
      besiegten Bot)?
- [ ] N2197. **Trainer lange nicht dran:** Der Auftrag „Spiele eine Runde im Trainer …“ nennt
      einen Trainer, den du lange oder nie gespielt hast. Eine Runde dort zu Ende spielen, zurück
      ins Buch: Haken.
- [ ] N2198. **Abzeichen „Acht Aufträge“:** Profil › Abzeichen: neues Abzeichen (Raute mit 8)
      „In einem Kalendermonat acht Wochenaufträge erledigt.“, grau bis zum achten Auftrag in einem
      Monat. Gefällt Bild und Bedingung?
- [ ] N2199. **Englisch:** Einstellungen › Sprache Englisch: Abschnitt „This week’s tasks“ mit
      englischen Sätzen und Knöpfen, „Swap“ statt „Tauschen“. Alles verständlich?

### Neu in 0.3.27: Monatsrückblick (Arbeitschat, 31.10.2026)

Am Anfang jedes Monats schaut die App ruhig auf den Vormonat zurück: Kalender mit deinen
Lerntagen, was du gemacht hast, Wertung, neu verdiente Orden und Abzeichen, neue Rekorde, dein
sicherstes Thema und eins zum Üben, dazu ein nächster Schritt für den neuen Monat. Ab morgen
(1. November) siehst du den Oktober echt. Vorher als Probe: Aufgabenseite (drei Sekunden auf
„Profil“ bzw. das Zahnrad) › „Monatsrückblick testen“ › „Rückblick dieses Monats öffnen“ zeigt den
laufenden Monat; die Probe ändert nichts.

- [ ] N2210. **Startkarte:** Am 1. bis 7. November steht oben im Buch „Dein Oktober ist fertig“ mit
      Knopf „Ansehen“ (nur wenn du im Oktober mindestens einen Lerntag hattest). Sie steht direkt
      unter „Dein nächster Schritt“ und verdrängt solange die Wochenkarte. Ist das so recht?
- [ ] N2211. **Karte verschwindet:** Nach „Ansehen“ und Zurück ist die Karte weg, auch nach dem
      Neuladen. Am 8. November kommt sie ohnehin nicht mehr.
- [ ] N2212. **Kalender:** Oben „Dein Oktober“, darunter „Oktober 2026“, ein Satz wie „Im Oktober
      hattest du 12 Lerntage.“ und ein Kalender ab Montag; Lerntage gold gefüllt, die übrigen
      Tage als leiser Kreis. Stimmen die Tage mit deinem Gefühl überein?
- [ ] N2213. **Ton bei wenig Aktivität:** Bei 2 bis 5 Lerntagen steht „… Jeder zählt.“ dabei, bei
      einem Tag „Im Oktober hattest du einen Lerntag. Jeder zählt.“ Kein Rot, kein Vergleich mit
      dem Vormonat. Passt der Ton?
- [ ] N2214. **Zahlen und Wertung:** Abschnitt „Das hast du gemacht“ (Abbildungen, gelöste
      Übungen, Antworten in den Trainern, Wiederholungskarten, Partien, Siege; Nullen fehlen).
      Hast du gewertete Partien gespielt, steht unter „Deine Wertung“ je Zeitklasse der Wert am
      Monatsanfang und am Monatsende, ohne Farbe. Verständlich?
- [ ] N2215. **Neu verdient und Rekorde:** Im Oktober verdiente Orden und Abzeichen stehen mit Bild,
      Namen und Datum unter „Neu verdient“; Rekorde, die im Oktober aufgestellt wurden, unter
      „Neue Rekorde“. Hinweis: Wird ein Rekord im November verbessert, wandert er in den
      November (die App merkt sich nur die letzte Verbesserung).
- [ ] N2216. **Themen:** Unter „Deine Themen“ steht „Am sichersten: … (9 von 10 richtig)“ und, wenn
      ein anderes Thema unter 70 % liegt, „Zum Üben: …“ mit Knopf „Üben“, der den passenden
      Trainer öffnet. Erst ab 8 Antworten zu einem Thema erscheint etwas.
- [ ] N2217. **Nächster Schritt:** „Dein nächster Schritt für November“ zeigt denselben Vorschlag
      wie die Karte oben im Buch; der Knopf führt dorthin.
- [ ] N2218. **Teilen:** „Rückblick teilen“ öffnet am Handy das Teilen-Menü mit einem Bild: dunkler
      Grund, goldener Rahmen, „MONATSRÜCKBLICK“, der Kalender als Punkte (Lerntage gold),
      „Oktober 2026“, „12 Lerntage“, Name und Adresse der App. Gefällt dir das Bild?
- [ ] N2219. **Ältere Rückblicke im Profil:** Profil, unter „Dein Fortschritt“: Karte „Rückblicke“
      mit einem Knopf je abgeschlossenem Monat mit Lerntagen („Oktober 2026“, der jüngste
      zuerst); er öffnet den Rückblick des Monats. Vor dem 1. November gibt es die Karte noch
      nicht.

### Neu in 0.3.26: Rivalen unter den Bots (Arbeitschat, 31.10.2026)

Ein Bot als Rivale: etwas stärker als du (50 bis 150 Punkte über deiner Wertung in der Zeitart
deiner letzten gewerteten Partie) und noch nie gewertet von dir besiegt. Ohne Wertung ist es ein
Bot der niedrigsten Stufe, in der du noch nicht jeden besiegt hast. Das Duell ist gewonnen, wenn
du ihn zum ersten Mal in einer gewerteten Partie besiegst; dann gratuliert er, und ein neuer
Rivale stellt sich vor. Die Karte steht oben im Buch (höchstens zwei Karten zugleich: „Dein
nächster Schritt“ und „Deine Woche“ kommen vorher; „Nicht jetzt“ bzw. „Später“ dort machen Platz).
Im Bereich Spielen erscheint sie erst, wenn der Haupt-Chat sie dort einträgt.

- [ ] N2200. **Karte erscheint:** Beende eine Partie gegen einen beliebigen Bot (auch ungewertet,
      Aufgeben genügt). Im Buch steht danach die Karte „Dein Rivale: …“ mit Porträt, Spruch in
      Anführungszeichen, „Euer Duell: 0 : 0“ (bzw. mit deiner Partie, falls es derselbe Bot war)
      und Knopf „Herausfordern“. Vor der ersten Partie gegen einen Bot gibt es die Karte nicht.
- [ ] N2201. **Wahl passend zur Stärke:** Mit Wertung: Ist der Rivale etwas stärker als du (in
      der Gegnerwahl steht seine Zahl; etwa 50 bis 150 über deiner Wertung im Profil)? Ohne
      Wertung (frisches Gerät): ein Bot der Stufe 1.
- [ ] N2202. **Revanche:** Auf „Herausfordern“ bzw. „Revanche“ tippen. „Spielen“ öffnet sich mit
      dem Rivalen als Gegner, „Gewertete Partie“ angehakt und deiner zuletzt gewählten Bedenkzeit;
      die Partie beginnt erst mit „Beginnen“.
- [ ] N2203. **Bilanz und Spruch:** Partie gegen den Rivalen verlieren (Aufgeben) und zurück ins
      Buch. Die Bilanz zählt die Niederlage („Euer Duell: 0 : 1“), der Spruch passt zum Sieg des
      Bots (beim Angreifer etwa „Revanche? Ich greife wieder am Königsflügel an.“). Nach einem
      Remis kommt ein Remis-Spruch und „(1 Remis)“ hinter der Bilanz.
- [ ] N2204. **Duell gewonnen:** Rivalen in einer gewerteten Partie besiegen (Stufe 1 geht
      leicht). Im Buch zeigt die Karte „Duell gewonnen!“, „<Name> gratuliert: „…““, ein kleines
      Feuerwerk (nur mit Schalter „Feiereffekte“ an) und „Dein neuer Rivale: …“. „Weiter“
      schließt die Feier; sie kommt nicht wieder. Ungewertete Siege zählen nicht.
- [ ] N2205. **Anderer Rivale:** „Anderer Rivale“ tippen: ein anderer Bot wird Rivale, der Knopf
      verschwindet bis morgen (auch nach Neuladen). Am nächsten Tag ist er wieder da.
- [ ] N2206. **Erfahrungspunkte:** Profil › Erfahrung: Ein gewonnenes Duell bringt 40 Punkte
      (vorher und nachher vergleichen).
- [ ] N2207. **Abzeichen:** Profil › Abzeichen: „Drei Rivalen besiegt“ (Schild mit gekreuzten
      Schwertern und Springer) und „Zehn Rivalen besiegt“ (Rosette mit Schwertern und König) als
      Silhouetten mit Bedingung; nach drei gewonnenen Duellen leuchtet das erste. Gefallen die
      Bilder?
- [ ] N2208. **Sprüche lesen:** Es gibt je Charakter vier Sprüche (Begrüßung, nach Sieg des Bots,
      Remis, nach seiner Niederlage), zwölf Charaktere. Klingen sie freundlich und ohne Druck?
      Wünsche zu einzelnen Sätzen einfach als Text schicken („N2208: Materialist …“).
- [ ] N2209. **Datensicherung:** Bilanz und Rivale ziehen mit der Datensicherung um (Einstellungen
      › Sicherung anlegen, auf anderem Gerät einspielen): gleiche Karte, gleiche Bilanz.

### Neu in 0.3.26: Eigene Ziele (Arbeitschat, 31.10.2026)

Du heftest dir bis zu drei eigene Ziele an, etwa „Besiege Lotte in Schnellschach“ oder „Noch 2 Bots
für den Orden …“. Sie stehen in der Wochenkarte oben im Buch („Deine Woche“) als Abschnitt „Deine
Ziele“, unter Wochenziel und Übungsplan. Die Wochenkarte zeigt ihre Abschnitte erst, wenn ein
Wochenziel gewählt ist; wähle also zuerst in „Deine Woche“ ein Wochenziel (etwa „3 Tage“). Kein
Ablaufdatum, nicht erreichte Ziele zählt die App nirgends.

- [ ] N2230. **Vorschläge:** Buch öffnen, in „Deine Woche“ steht „Deine Ziele“. Ohne angeheftetes
      Ziel stehen dort bis zu fünf Vorschläge, das am wenigsten Fehlende zuerst (etwa „Besiege Tom
      (beliebige Zeitart).“, „Löse alle Übungen von Kapitel 1: noch 3.“, „Dir fehlen noch 24 Bots
      für den Orden …: Tom, Marie, …“). Jeder hat „Anheften“ und einen Knopf, der direkt hinführt.
      Verständlich, und klingt jeder Satz natürlich?
- [ ] N2231. **Anheften und Lösen:** Bei einem Vorschlag „Anheften“ tippen. Das Ziel steht oben mit
      Balken „x von y“ (bei Ringen) und den Knöpfen „Spielen“, „Üben“ oder „Weiterlesen“ sowie
      „Lösen“. Die Vorschläge klappen zu; „Ziel wählen“ öffnet sie wieder. „Lösen“ entfernt das Ziel
      sofort, ohne Nachfrage und ohne Spur.
- [ ] N2232. **Höchstens drei:** Drei Ziele anheften. Danach gibt es kein „Ziel wählen“ mehr, bis du
      eines löst.
- [ ] N2233. **Eigenes Ziel „Bot besiegen“:** „Ziel wählen“ › „Eigenes Ziel: Bot besiegen“. Es
      erscheint dieselbe Bot-Liste wie beim Spielen (Stufen zum Aufklappen, Sterne für schon
      besiegte Bots), darunter die Zeitart Blitz, Schnellschach, Klassisch oder egal. Bot und
      Zeitart wählen, „Anheften“. Einen Bot wählen, den du in dieser Zeitart schon gewertet besiegt
      hast: Statt „Anheften“ kommt der Satz „Das hast du schon geschafft …“.
- [ ] N2234. **Spielen:** Bei einem Bot-Ziel „Spielen“ tippen. Der Spielstart öffnet sich mit dem
      Bot gewählt, „Gewertete Partie“ an und einer Bedenkzeit der Zeitart (Schnellschach etwa
      10 + 0). Du tippst nur noch „Beginnen“.
- [ ] N2235. **Erreicht nach der Partie:** Ein leichtes Ziel anheften (eigenes Ziel: Tom, Zeitart
      egal), dann eine gewertete Partie gegen Tom gewinnen. Zurück im Buch: kleines Feuerwerk
      (wenn „Feiereffekte“ an) und „Ziel erreicht: Tom besiegt!“; das Ziel ist nicht mehr
      angeheftet. Die Feier kommt nur einmal (nach Neuladen nicht wieder).
- [ ] N2236. **Erreichte Ziele im Profil:** Profil öffnen. Unter „Dein Fortschritt“ steht die Karte
      „Erreichte Ziele“ mit „1 eigenes Ziel erreicht.“ und der Zeile „Tom besiegt · Datum“
      (neueste zuerst, höchstens zehn Zeilen). Vor dem ersten erreichten Ziel fehlt die Karte.
- [ ] N2237. **Erfahrungspunkte:** Vor und nach dem erreichten Ziel die Erfahrungspunkte im Profil
      ansehen: Jedes erreichte Ziel gibt 20 Punkte dazu.
- [ ] N2238. **Abzeichen „Zehn eigene Ziele“:** Profil › Abzeichen: Das neue Abzeichen steht im
      Gitter (Banner mit der Zahl 10, hellblau), Bedingung „Zehn selbst gewählte Ziele erreicht“.
      Zum Ansehen ohne zehn Ziele: Aufgabenseite (drei Sekunden auf das Zahnrad) › „Abzeichen
      testen“ › „Zehn eigene Ziele: verdienen“ (Meldung wie im echten Fall); danach „Probe
      beenden“.
- [ ] N2239. **Englisch:** Sprache auf Englisch: Abschnitt „Your goals“, Vorschläge wie „Beat Lotte
      in rapid.“, Profilkarte „Goals reached“. Alles übersetzt?

### Neu in 0.3.25: Serienmodus im Taktiktrainer (Arbeitschat, 31.10.2026)

Neu im Taktiktrainer neben „Runde starten“: der Knopf „Serie ohne Fehler“. Die Aufgaben werden
immer schwerer (je drei Aufgaben der Stufen 1 bis 5, danach die schwersten zuerst), es läuft keine
Uhr. Der erste Fehler beendet die Serie; auch eine Hilfe oder „Lösung zeigen“ zählt als Fehler.
Das Ergebnis heißt etwa „12 in Folge“ und steht als Rekord „Taktikserie ohne Fehler“ in Profil ›
Deine Rekorde. Außerdem wählt der Taktiktrainer jetzt das Motiv vor, wenn „Dein nächster Schritt“
ein unsicheres Taktikthema vorschlägt.

- [ ] N2220. **Start der Serie:** Training › Taktiktrainer, Quelle „Aus dem Buch“. Unter Thema und
      Stufe stehen „Runde starten“ und darunter „Serie ohne Fehler“, darunter ein kurzer Satz, wie
      die Serie funktioniert. Tippe „Serie ohne Fehler“: Oben steht „Serie: 0 in Folge“, die erste
      Aufgabe hat „Stufe 1“. Verständlich?
- [ ] N2221. **Weiter ohne Fehler:** Löse die Aufgabe ohne falschen Zug und ohne Hilfe. Der
      Stand oben springt auf „Serie: 1 in Folge“, darunter erscheint „Weiter“. Nach drei gelösten
      Aufgaben kommt Stufe 2 (unter dem Brett „· Stufe 2“). Steigt die Schwierigkeit spürbar?
- [ ] N2222. **Ein Fehler beendet die Serie:** Ziehe in einer Aufgabe einen falschen Zug (roter
      Pfeil) und löse sie dann zu Ende, oder tippe „Lösung zeigen“. Unter dem Brett steht „Serie
      vorbei: Diese Aufgabe ging daneben.“ und „N in Folge“ (bei null „Diesmal keine in Folge.
      Gleich noch einmal?“). Die Lösung bleibt auf dem Brett sichtbar. Passt der Ton?
- [ ] N2223. **Neuer Rekord:** Schaffe mindestens eine Aufgabe und beende die Serie. Beim ersten
      Mal steht „Neuer Rekord: N in Folge.“, später nur, wenn du mehr schaffst als bisher, dann mit
      „(vorher …)“. Darunter „Deine beste Serie: … in Folge“. Gleich viele sind kein Rekord.
- [ ] N2224. **Serie beenden:** Ab der ersten gelösten Aufgabe steht unter der Aufgabe „Serie
      beenden“. Tippen beendet die Serie mit „Serie beendet.“ und zählt die bisher gelösten
      Aufgaben als Ergebnis (und als Rekord). Brauchst du den Knopf, oder lieber weglassen?
- [ ] N2225. **Neue Serie und andere Übung:** Nach dem Ende startet „Neue Serie“ eine frisch
      gemischte Serie bei 0; „Andere Übung“ führt zurück zur Auswahl. Mit einem gewählten Motiv
      (etwa Fesselung) kommen nur Aufgaben dieses Motivs. Richtig?
- [ ] N2226. **Rekordtafel:** Profil › Deine Rekorde hat jetzt neun Zeilen; neu ist
      „Taktikserie ohne Fehler“ (vor der ersten Serie „noch keiner“). „Versuchen“ öffnet den
      Taktiktrainer. Stimmt das?
- [ ] N2227. **Zählt wie eine Runde:** Nach einer Serie zählt sie in Profil wie eine Runde des
      Taktiktrainers (Erfahrungspunkte, Abzeichen für Trainer, Lerntag im Wochenziel); die falsch
      gelöste Aufgabe kommt als Wiederholungskarte in „Fällige Wiederholungen“. Passt das?
- [ ] N2228. **Motiv vorgewählt aus „Dein nächster Schritt“:** Taktiktrainer, Thema „Fesselung“,
      Runde starten und bei acht Aufgaben einfach „Lösung zeigen“ und „Weiter“ tippen. Zurück im
      Buch steht in „Dein nächster Schritt“ (eventuell unter „Lieber etwas anderes?“) „Fesselung
      klappt noch nicht so sicher (0 von 8 richtig). Eine kurze Runde?“. „Üben“ öffnet den
      Taktiktrainer mit „Fesselung“ schon im Feld Thema. Aus „Training“ geöffnet steht dort wie
      bisher „Gemischt“. Stimmt das?
- [ ] N2229. **Englisch:** Sprache auf Englisch: Knopf „Streak without a mistake“, Stand
      „Streak: 3 in a row“, Rekord „Tactics streak without a mistake“. Stimmt das?

### Neu in 0.3.24: Trainer-Feinschliff 2 (Nebenchat, 31.10.2026)

- [ ] N2015. **Eignungsprüfung je Trainer (zur Durchsicht):** Jeder Trainer schließt eigene Arten
      von Stellungen aus. Bitte prüfe die Regeln:
      Zielbilanz: kein Schach, kein Matt oder Patt, kein laufender Abtausch (die Seite am Zug
      kann sofort Material gewinnen); hängende eigene Figuren und Fesselungen bleiben erlaubt.
      Faktorenbilanz: kein Schach, kein Ende, kein sofort gewinnbarer Figurenwert; ein
      hängender Bauer bleibt erlaubt (Gambits). Planfragen und LAP: kein Schach, kein Ende, kein
      sofortiger Materialgewinn, keine hängende oder gefesselte eigene Figur (die Warum-Fragen des
      Buches bleiben unberührt). Wettrennen: nur kein Schach und kein Ende. Denkroutine: Schach
      ist jetzt erlaubt (wie Abb. 12.3), nur Ende und weniger als zwei Züge fallen weg.
      Gangarten und Zug aufschreiben: Schach und Fesselung erlaubt, nur Ende fällt weg. Röntgen:
      kein Schach, kein Ende. Zählen: kein Schach, kein Ende, Lehrbilder ohne König bleiben.
      Falle oder Köder: kein Schach, kein Ende. Endspiel: nur Ende fällt weg. Gefunden und jetzt
      ausgeschlossen: 5 Zielbilanz-Aufgaben im Schach, 2 mit Matt oder Patt, 8 Röntgen- und 6
      Zählstellungen mit Patt. Eine Runde Planfragen enthält jede Stellung nur einmal.
- [ ] N2016. **Gangarten, Begründung:** Koordinaten-Trainer › Gangarten. Nach dem Prüfen steht zu
      jedem Feld der Grund: erlaubt oder Schlag, falsche Gangart (mit der Gangart der Figur), Weg
      versperrt, eigene Figur, Bauer schlägt nicht ins Leere, Fesselung an den König, König
      würde ins Schach ziehen, Schach bleibt bestehen.
- [ ] N2017. **Engine bei den Bilanzen:** Nach der Antwort in Zielbilanz, Faktorenbilanz,
      Planfragen und LAP steht „Was sagt die Engine?“ mit Bewertungsbalken und der besten
      Fortsetzung zum Durchspielen. Bei Ziel- und Faktorenbilanz sagt ein Satz, ob Bilanz und
      Engine dieselbe Seite vorn sehen (unter einem halben Bauern gilt „ausgeglichen“). Die
      Zielbilanz sieht die Seite vorn, die mehr Zielpunkte hat; die Faktorenbilanz die Seite mit
      mehr Faktoren für sich. Passt diese Lesart?
- [ ] N2018. **Stufen (zur Durchsicht):** Über der Runde von Zielbilanz, LAP, Denkroutine und
      Feld finden steht „gemischt, leicht, mittel, schwer“, mit einem Satz, was gemessen wird.
      Zielbilanz: Zahl der „teils“ (0 leicht, 1–2 mittel, ab 3 schwer). LAP: Abstand zur nächsten
      Leichtfigur in freien Feldern (zu Hause oder ab 3 leicht, Gleichstand schwer). Denkroutine:
      legale Züge (bis 25 leicht, bis 40 mittel). Feld finden: leicht nur Weiß, mittel wie bisher,
      schwer zufällig wechselnd. „Falle oder Köder“ erklärt seine Stufen jetzt mit den
      Lichess-Wertungen (Stufe 1 unter 1000 bis Stufe 5 über 1900).
- [ ] N2019. **Wiederholung:** Falsch gelöste Aufgaben aus Zähltrainer, Röntgen-Trainer und
      LAP-Übung kommen jetzt auch wieder („Wiederholen“ im Trainer, „Fällige Wiederholungen“ im
      Bereich Training). Der Abweichungsmodus bleibt draußen, weil die Engine die Abweichung jedes
      Mal neu wählt (zur Durchsicht).
- [ ] N2020. **Zähltrainer, Abzug:** Steht eine Langschrittfigur hinter einer eigenen Figur, die
      das Feld selbst nicht angreift, zählt sie nicht mit (Abb. 1.6); nach der Antwort steht
      „Achtung Abzug: … Zieht … weg, greift … das Feld an“. Solche Aufgaben sind „schwer“.
- [ ] N2021. **Einheitliche Auflösung:** In allen Trainern erst das Urteil mit Grund, dann die
      Begründung, zuletzt das Durchspielen mit Balken. Die Denkroutine nennt jetzt, wie weit dein
      besserer Kandidat hinter dem Zug der Engine liegt.
- [ ] N2022. **Abbildung öffnen ohne Handytastatur:** Buch › „Abbildung öffnen“ antippen: Statt der
      Handytastatur erscheint eine Zahlenleiste (Ziffern, Punkt, Löschen). Auf der Seite einer
      Abbildung ebenso, wenn du auf den Titel tippst.
- [ ] N2023. **Sprache beim ersten Start:** Auf einem Gerät, das nicht auf Deutsch eingestellt ist
      (etwa Englisch), fragt die App beim ersten Start auf Englisch und Deutsch, ob sie auf
      Englisch umstellen soll, mit dem Hinweis auf die Beta-Phase und dass das englische Buch noch
      nicht erschienen ist. Zum Testen: in einem privaten Fenster mit englischer Browsersprache
      öffnen. Die Frage kommt nur einmal.

### Neu in 0.3.23: Freischaltbare Extras (Arbeitschat, 31.10.2026)

Neu und nur durch Lernen zu bekommen; alles, was es schon gab, bleibt frei. Porträtrahmen in
Bronze, Silber und Gold (ab Stufe 3, 6, 9), Brett „Nacht und Gold“ (mit allen Orden der
Buchteile), Figurensatz „Gold“ (ab Stufe 5, umgefärbter Cburnett) und bunte Konfettifarben für das
Feuerwerk (ab Stufe 2). Gesperrte Extras stehen als graue Silhouette mit Schloss und Bedingung da.
Zum Prüfen ohne echten Fortschritt: Aufgabenseite (drei Sekunden auf das Zahnrad) › „Abzeichen
testen“ › „Nächste Stufe erreichen“ (mehrmals) bzw. „Orden testen“ für die Buchteile; danach
„Probe beenden“.

- [ ] N2170. **Karte „Deine Extras“:** Profil, unter „Dein Fortschritt“. Vier Reihen
      (Porträtrahmen, Brett, Figurensatz, Konfettifarben); gesperrte als graue Silhouette mit
      Schloss und „Ab Stufe …“ bzw. „Mit allen Orden der Buchteile“. Verständlich?
- [ ] N2171. **Konfettifarben ab Stufe 2:** Probe „Nächste Stufe erreichen“, dann im Profil bei
      „Bunte Konfettifarben“ auf „Wählen“. Danach eine Partie gewinnen (kleines Feuerwerk über
      dem Brett): Die Funken sind bunt. „Ablegen“ bringt die Farben der App zurück.
- [ ] N2172. **Porträtrahmen:** Probe bis Stufe 3, „Rahmen Bronze“ wählen. Dein Porträt oben im
      Profil, in der Partie und in der Partienliste hat einen Bronzering. Silber (Stufe 6) und
      Gold (Stufe 9) ebenso. Wirken die Farben edel genug?
- [ ] N2173. **Figurensatz „Gold“:** Einstellungen › Brett › Figurensatz, Gruppe „Verdient“.
      Vor Stufe 5 grau mit „Ab Stufe 5“ und nicht wählbar; danach wählbar. Weiße Figuren golden,
      schwarze im Navy mit goldener Kontur. Gut zu unterscheiden, auf jedem Brett?
- [ ] N2174. **Brett „Nacht und Gold“:** Einstellungen › Brett › Brettfarben, Gruppe „Verdient“.
      Gesperrt mit „Mit allen Orden der Buchteile“; nach der Orden-Probe aller fünf Buchteile
      wählbar. Navy und mattes Gold; Figuren, letzter Zug und Pfeile gut sichtbar?
- [ ] N2175. **Nie wegnehmen:** Ein gewähltes Extra bleibt gewählt, auch wenn du die Probe
      beendest (es steht dann als „Gewählt“ da). Erst nach dem Ablegen oder einer anderen Wahl
      ist es wieder gesperrt. Ist das so richtig?
- [ ] N2176. **Lizenzen:** Profil › Einstellungen › Lizenzen: Eintrag „Figurensatz Gold
      (Bearbeitung von Cburnett …)“ mit Lizenztext. Passt der Eintrag?

### Neu in 0.3.22: Dein nächster Schritt (Arbeitschat, 31.10.2026)

Oben im Buch steht jetzt eine Karte „Dein nächster Schritt“ mit einem Vorschlag und einem Knopf.
Die Reihenfolge: fällige Wiederholungen (ab 3 Karten), Tagesaufgabe, Weiterlesen, offene Übungen
eines Kapitels (sobald du 80 % seiner Abbildungen gesehen hast), ein unsicheres Thema aus den
Trainern (mindestens 8 Antworten, unter 70 % richtig), zuletzt die Fehlerdatenbank.

- [ ] N2110. **Karte erscheint:** Öffne die App. Oben im Buch, über dem Nummernfeld, steht „Dein
      nächster Schritt“ mit einem Satz und einem Knopf. Hast du die Tagesaufgabe heute noch nicht
      gelöst, heißt es „Die Tagesaufgabe wartet.“ Passt Platz und Ton?
- [ ] N2111. **Tagesaufgabe:** Tippe „Lösen“. Die Tagesaufgabe öffnet sich direkt (ohne Umweg über
      Training › Kurzpläne). Löse sie und tippe unten „Zurück zum Buch“. Die Karte schlägt jetzt
      etwas anderes vor. Stimmt das?
- [ ] N2112. **Weiterlesen:** Öffne eine Abbildung mitten in einem Kapitel und geh zurück ins
      Buch. Die Karte sagt „Weiter in Kapitel … : Abb. …“ mit der nächsten Abbildung, die du noch
      nicht gesehen hast; „Weiterlesen“ öffnet genau sie. Richtig?
- [ ] N2113. **Lieber etwas anderes?:** Tippe auf „Lieber etwas anderes?“. Es klappen bis zu zwei
      weitere Vorschläge mit eigenem Knopf auf. Führt jeder Knopf an die richtige Stelle?
- [ ] N2114. **Nicht jetzt:** Tippe „Nicht jetzt“. Die Karte verschwindet, auch nach einem
      Neustart der App. Am nächsten Tag ist sie wieder da. Stimmt das?
- [ ] N2115. **Wiederholungen:** Wenn mindestens 3 Wiederholungen fällig sind (siehe Training ›
      Fällige Wiederholungen), steht ganz oben „N Wiederholungen sind fällig. Etwa M Minuten.“
      (etwa 40 Sekunden je Karte). „Wiederholen“ öffnet eine Seite mit den fälligen Karten. Passt
      die Schätzung?
- [ ] N2116. **Übungen und Themen:** Hast du in einem Kapitel fast alle Abbildungen gesehen, aber
      nicht alle Übungen gelöst, kommt „Zu Kapitel N sind noch K Übungen offen.“; „Üben“ startet
      die erste offene Übung, „Nächste Übung“ führt durch die übrigen. Nach einigen falschen
      Antworten in einem Taktikmotiv (mindestens 8 Antworten, unter 70 % richtig) kommt etwa
      „Fesselung klappt noch nicht so sicher (5 von 9 richtig). Eine kurze Runde?“; „Üben“ öffnet
      den Taktiktrainer (das Motiv wählst du dort selbst). Passt das?
- [ ] N2117. **Englisch:** Stelle die Sprache auf Englisch: Die Karte heißt „Your next step“, alle
      Sätze und Knöpfe sind englisch. Stimmt das?

### Neu in 0.3.21: Rekordtafel (Arbeitschat, 31.10.2026)

Wettbewerb mit dir selbst statt Bestenliste: Im Profil steht die Karte „Deine Rekorde“ mit acht
Rekorden (Taktik auf Zeit, beste Tagesserie, richtige Trainerantworten an einem Tag, Lerntage in
einer Woche, Trefferquote „Zug erraten“, höchste Wertung, stärkster besiegter Bot, längste Partie
ohne Patzer), je mit Wert, Datum und Knopf „Versuchen“. Ein neuer Rekord erscheint als Meldung.

- [ ] N2140. **Rekordtafel im Profil:** Profil öffnen. Unter „Dein Fortschritt“ steht „Deine
      Rekorde“ mit acht Zeilen; was du noch nicht hast, steht als „noch keiner“. Hattest du schon
      eine beste Zeitrunde, steht sie dort mit Datum. Passt das?
- [ ] N2141. **Neuer Rekord am Rundenende:** Training › Koordinaten › „Feld finden“ eine Runde
      spielen. Am Ende steht unter dem Ergebnis etwa „Neuer Rekord: 16 richtige Antworten.“
      (beim ersten Mal ohne „vorher“). Eine zweite Runde am selben Tag bringt den Rekord wieder,
      dann mit „(vorher 16)“. Zu oft oder genau richtig?
- [ ] N2142. **Taktik auf Zeit:** Training › Kurzpläne › „Taktik auf Zeit“. Schaffst du mehr
      richtige als bisher, steht nach der Runde „Neuer Rekord: … richtig in 3 Minuten (vorher …).“
      Gleich viele sind kein Rekord. Die Zeile „Deine beste Zeitrunde“ zeigt den neuen Wert.
- [ ] N2143. **Tagesserie:** Kurzpläne › „Tagesaufgabe mit Serie“ an einem neuen Tag bearbeiten.
      Wird die Serie länger als deine bisher beste, erscheint „Neuer Rekord: … Tage in Folge“.
- [ ] N2144. **Versuchen:** In der Tafel bei „Taktik auf Zeit“ auf „Versuchen“ tippen: Die
      Kurzpläne öffnen sich. Bei „Höchste Wertung“ führt der Knopf zu „Spielen“, bei
      „Richtige Trainerantworten“ zu „Training“. Führen alle Knöpfe an die richtige Stelle?
- [ ] N2145. **Partie-Rekorde:** Eine gewertete Partie gegen einen Bot gewinnen und auswerten
      lassen, dann das Profil öffnen. „Stärkster besiegter Bot“ zeigt die Zahl des Bots; hattest
      du keinen Patzer (??), zählt die Partie für „Längste Partie ohne Patzer“ (in Halbzügen).
      Die Wertung zählt erst ab der zehnten gewerteten Partie einer Zeitklasse. Stimmen die Werte?
- [ ] N2146. **Datensicherung:** Nach einer Sicherung und dem Einspielen sind die Rekorde mit
      ihren Daten noch da (sie stehen jetzt in den Nutzerdaten, nicht mehr nur auf dem Gerät).
- [ ] N2147. **Abzeichen „Drei Rekorde“:** Sobald in Profil › Deine Rekorde drei verschiedene
      Rekorde stehen, kommt das Abzeichen „Drei Rekorde“ mit eigenem Bild (goldener Stern mit
      der 3). Passt das?

### Neu in 0.3.21: Kombo und Fundstücke (Arbeitschat, 31.10.2026)

Kleine Momente beim Üben, in jedem Trainer mit Runde (Feld finden, Taktik, Endspiel, Struktur und
alle übrigen mit „Aufgabe 1 von …“). Die Kurzpläne (Taktik auf Zeit, Tagesaufgabe) zeigen die
Kombo nicht, weil sie ohne diesen Rundenrahmen laufen.

- [ ] N2160. **Kombo ab drei:** Training › Koordinaten › Feld finden, drei Felder richtig
      antippen. Neben „Aufgabe 4 von 16“ erscheint ein kleines goldenes Schild „3 in Folge“, bei
      jeder weiteren richtigen Antwort zählt es weiter und springt kurz auf. Gut sichtbar, aber
      nicht störend?
- [ ] N2161. **Fehler beendet leise:** Danach ein falsches Feld antippen. Das Schild verschwindet
      ohne Meldung, nach drei weiteren richtigen kommt es wieder. Auch „Aufgabe wiederholen“
      ändert die Folge nicht mehr (die erste Antwort zählt). Passt das?
- [ ] N2162. **Funkeln bei 5 und 10:** Bei 5 und bei 10 in Folge funkeln acht kleine goldene
      Punkte um das Schild. Mit Profil › Einstellungen › Bedienung › Feiereffekte „aus“ bleibt
      nur das Schild, ohne Funkeln. Stimmt das?
- [ ] N2163. **Ton:** Mit Ton an (Einstellungen) klingt ab der dritten richtigen Antwort in Folge
      ein kurzer heller Ton, jedes Mal einen Halbton höher (höchstens eine Oktave). Ein Fehler
      bleibt still. Angenehm oder zu viel?
- [ ] N2164. **Erstes Fundstück:** Nach dem Update kommt das erste Fundstück am Ende einer
      Trainerrunde sicher, sobald du schon zwei Runden fertig hast (sonst in der dritten). Unter
      dem Ergebnis steht „Fundstück!“ mit einer kleinen Karte: eine Geschichte, etwas Kurioses
      oder ein Merksatz mit Kapitel, darunter „Liegt jetzt in deinem Album (1 von 83)“ und „Zum
      Album“. Erscheint es so?
- [ ] N2165. **Selten und höchstens eins am Tag:** Danach kommt ein Fundstück nur noch etwa jede
      zwölfte Runde, nie zweimal am selben Tag und nie nach einer Runde ganz ohne richtige
      Antwort; keins kommt doppelt. Fühlt sich das selten genug, aber nicht zu selten an?
      (Empfehlung, schon umgesetzt: das erste sicher, damit jeder das Album kennenlernt, ohne
      dass es angekündigt wird; Widerspruch genügt.)
- [ ] N2166. **Album im Profil:** Nach dem ersten Fund steht im Profil unter „Dein Fortschritt“
      die Karte „Fundstücke“ mit „1 von 83 gefunden“ und „Album öffnen“. Das Album zeigt alle 83
      Plätze in fester Reihenfolge: gefundene als Karte, die übrigen gestrichelt als „Nr. 12 ·
      Noch nicht gefunden“. Vor dem ersten Fund gibt es die Karte nicht (Überraschung statt
      Versprechen). Passt das?
- [ ] N2167. **Texte lesen:** 83 eigene Texte, 30 aus der Geschichte, 22 Kuriositäten,
      31 Merksätze. Die Merksätze geben den Gedanken eines Kapitels sinngemäß wieder (etwa
      „Merksatz · Kapitel 7: Wo zwei Figuren ungedeckt stehen, lohnt sich der Blick nach einer
      Gabel.“), keine wörtlichen Buchsätze. Sie gelten nach Regel 9 vorerst als abgesegnet; bitte
      beim Lesen melden, wenn ein Kapitel nicht passt oder ein Satz anders klingen soll
      (Kennung steht im Katalog inhalte/de/fundstuecke.json, Text in den Sprachdateien unter
      fundstueck.text.…).
- [ ] N2168. **Englisch:** Profil › Einstellungen › Sprache Englisch. Schild „3 in a row“,
      Fundstück „A find!“, Album „Finds“, alle Texte auf Englisch. Stimmt das?
- [ ] N2169. **Datensicherung:** Nach einem Fund eine Sicherung erstellen und wieder einspielen:
      Das Fundstück liegt weiter im Album, und am selben Tag kommt kein zweites. Stimmt das?

### Neu in 0.3.20: Teilen ohne Server (Arbeitschat, 31.10.2026)

- [ ] N2150. **Abzeichen teilen aus der Meldung:** Aufgabenseite (Profil drei Sekunden halten) ›
      „Abzeichen testen“ › „Erster Sieg: verdienen“. In der Meldung steht über „Weiter“ der Knopf
      „Teilen“. Am Handy öffnet er das Teilen-Menü (Nachrichten, Mail …) mit einem Bild im
      Hochformat: dunkler Grund, goldener Rahmen, oben „ABZEICHEN“, das Abzeichen groß, darunter
      „Erster Sieg“, „Verdient am …“, „Schach von Grund auf“ und die Adresse der Seite. Am Rechner
      lädt er das Bild herunter und schreibt „Bild gespeichert (Downloads).“ Gefällt dir das Bild?
- [ ] N2151. **Abzeichen teilen im Profil:** Profil › Dein Fortschritt › Abzeichen aufklappen,
      ein verdientes Abzeichen antippen. Unter der Bedingung steht ein kleiner Knopf „Teilen“; er
      teilt dasselbe Bild. Bei grauen (offenen) Abzeichen gibt es keinen Knopf.
- [ ] N2152. **Orden teilen:** Aufgabenseite › „Orden testen“ › einen Ring auf 100 % setzen. In
      der Gratulation steht „Teilen“ über „Weiter“; im Profil steht unter jedem Orden (voller
      Ring) ein kleiner Knopf „Teilen“. Das Bild zeigt oben „ORDEN“ und das Bild des Ordens.
      Danach beide Proben beenden.
- [ ] N2153. **Herausforderung öffnen:** Im Browser des Handys
      schach-von-grund-auf.com/app/#aufgabe-taktik-l-1Vybh öffnen. Die App zeigt „Herausforderung“
      mit dem Satz „Jemand hat dir diese Aufgabe geschickt. Finde den besten Zug!“ und eine
      Taktikaufgabe aus der freien Lichess-Datenbank. Lösen oder „Lösung zeigen“; danach stehen
      „Freunde herausfordern“ und „Mehr Aufgaben im Trainer …“ da. „Zurück“ führt ins Training.
- [ ] N2154. **Herausforderung weitergeben:** In der geöffneten Herausforderung nach dem Lösen
      „Freunde herausfordern“ antippen. Das Teilen-Menü bietet den Satz „Schaffst du das? Weiß
      zieht und gewinnt.“ (bei Matt-Aufgaben „… setzt matt“) mit dem Link an. Ohne Teilen-Menü
      (Rechner) kommt der Link in die Zwischenablage und die App schreibt „Link kopiert“.
- [ ] N2155. **Nur freie Aufgaben:** Aufgaben aus dem Buch (Abbildungen in Kapitel 7) lassen sich
      nicht teilen, und ein Link auf eine von ihnen öffnet keine Aufgabe. Den Knopf „Freunde
      herausfordern“ im Taktiktrainer selbst baut der Koordinierungs-Chat ein; er erscheint dann
      nach jeder Lichess-Aufgabe, nicht nach Buchaufgaben.
- [ ] N2156. **Datenschutz:** schach-von-grund-auf.com/datenschutz/ › „Speicher auf deinem
      Gerät“: Ein neuer Absatz erklärt das Teilen (Bild entsteht auf dem Gerät, Link enthält nur
      die Kennung der Aufgabe, sonst verschickt die App nichts). Stand: 31. Oktober 2026. Passt
      der Text für dich?

### Neu in 0.3.20: Wochenziel und Übungsplan (Arbeitschat, 31.10.2026)

Neu oben im Buch: die Karte „Deine Woche“. Du wählst selbst, an wie vielen Tagen pro Woche du
üben willst; die Karte zeigt deine Lerntage von Montag bis Sonntag, einen Ring „2 von 3 Tagen“ und
wie viele Wochen du dein Ziel schon erreicht hast. Darunter planst du, wann du übst, und trägst den
Plan in deinen Kalender ein. Als Lerntag zählt ein Tag mit einer Abbildung, einer Übung, einer
Trainerfrage, einer Karte oder einer Partie (bloßes Öffnen nicht).

- [ ] N2130. **Frage nach dem Ziel:** Nach dem ersten Lerntag steht oben im Buch „Wie oft willst
      du pro Woche üben?“ mit 2, 3, 4, 5, 7 Tagen (3 hervorgehoben) und „Später“. Beim allerersten
      Start ohne Lerntag fragt die App noch nicht. Passt das so?
- [ ] N2131. **„Später“:** Tippe „Später“. Die Frage verschwindet und kommt erst nächste Woche
      (ab Montag) wieder. Ist das angenehm, oder soll sie ganz wegbleiben?
- [ ] N2132. **Deine Woche:** Wähle ein Ziel. Die Karte zeigt sieben Punkte Mo bis So, gefüllt an
      Tagen mit Lernen, heute mit Rand, und den Ring „x von y Tagen“. Stimmen die Punkte mit deinen
      Tagen überein? Sieht die Karte auf dem Handy hell und dunkel gut aus?
- [ ] N2133. **Ziel erreicht:** Erreichst du dein Ziel, steht dort „Wochenziel geschafft. Schön!“,
      einmal je Woche mit einem kleinen Feuerwerk (aus, wenn „Feiereffekte“ aus sind). Kommt das
      Feuerwerk genau einmal? Zum Ausprobieren: „Ziel ändern“ und ein Ziel wählen, das du diese
      Woche schon geschafft hast.
- [ ] N2134. **Nichts verfällt:** Unter dem Ring stehen „Wochen mit erreichtem Ziel: n“ und ab zwei
      Wochen hintereinander „Beste Folge: n Wochen“. Eine verpasste Woche wird nicht erwähnt. Wer
      das Ziel später erhöht, behält die schon erreichten Wochen. Wer es senkt, bekommt frühere
      Wochen dazu, die das neue Ziel erreicht hätten (schon umgesetzt, Widerspruch genügt).
- [ ] N2135. **Ziel ändern:** „Ziel ändern“ zeigt die Wahl wieder, mit „Abbrechen“ und „Kein
      Wochenziel“. Das neue Ziel gilt sofort, auch mitten in der Woche. Die Einstellungen haben
      seit 0.3.2 keinen Reiter „Training“ mehr; deshalb geht das nur über die Karte. Reicht das?
- [ ] N2136. **Erfahrung und Abzeichen:** Jede Woche mit erreichtem Ziel bringt 30 EP. Zwei neue
      Abzeichen im Profil: „Vier gute Wochen“ und „Zwölf gute Wochen“ (Wochen müssen nicht
      hintereinander liegen), je mit eigenem Bild (Sechseck mit 4, Strahlenkranz mit 12). Gefallen
      dir Namen und Bilder?
- [ ] N2137. **Übungsplan:** In der Karte „Übungszeit planen“: Tage antippen, Uhrzeit, freiwillig
      ein Satz „Wo oder nach was?“, „Plan speichern“. Danach steht „Dein Plan: Mo, Do um 07:30“ und
      an geplanten Tagen „Heute ist dein Übungstag.“ Klappt Ändern und „Plan entfernen“?
- [ ] N2138. **Kalender auf dem iPhone:** „In meinen Kalender“ (und, wo es angeboten wird,
      „Teilen“) gibt die Datei „schach-ueben.ics“ weiter. Lässt sich der Termin übernehmen, mit
      Wiederholung an deinen Tagen, 20 Minuten lang, Erinnerung zur Startzeit, Titel „Schach üben“
      und deinem Satz in der Beschreibung? Bitte in der installierten App und in Safari.
- [ ] N2139. **Kalender auf Android:** Dasselbe auf einem Android-Handy (Google Kalender oder der
      Kalender des Herstellers). Wird der Termin übernommen und erinnert er dich?

### Neu in 0.3.19: Lernpfad durchs Buch (Arbeitschat, 31.10.2026)

- [ ] N2120. **Knöpfe:** Im Buch steht über der Kapitelliste der Knopf „Als Weg anzeigen“, im
      Profil unter „Dein Fortschritt“ der Knopf „Dein Weg durchs Buch“. Beide öffnen den neuen
      Bildschirm „Dein Weg durchs Buch“; „Zurück“ führt zurück.
- [ ] N2121. **Der Weg:** Ein geschwungener Weg von oben nach unten mit 13 Stationen (Kapitel 0
      bis 12, Nummer im Kreis, daneben der Titel). Nach Kapitel 1, 4, 7, 10 und 12 steht der
      Orden des Buchteils (Grundlagen, Eröffnung, Mittelspiel, Endspiel, Praxis), grau als
      Silhouette, bis er verdient ist. Bis zur aktuellen Station ist der Weg gold, danach
      gepunktet.
- [ ] N2122. **Stationen füllen sich:** Der Ring um eine Kapitelnummer füllt sich gold mit
      angesehenen Abbildungen und gelösten Übungen des Kapitels (wie die Orden im Profil). Erst
      wenn beides vollständig ist, wird der Kreis gold mit Haken. Probe: Kapitel 0 öffnen, „Alle
      abhaken“, zurück zum Weg: Station 0 ist fast voll, oben steht „Noch 3 Übungen bis zum Ende
      von Kapitel 0. Danach fehlt dir nur noch Kapitel 1 bis zum Orden „Teil Grundlagen“.“
- [ ] N2123. **Deine Figur:** An der aktuellen Station steht dein Porträt (falls im Profil
      gewählt), sonst ein goldener Springer. Aktuell ist das Kapitel der zuletzt geöffneten
      Abbildung, solange es nicht fertig ist, sonst das nächste unfertige. Öffne eine Abbildung
      aus Kapitel 6 und dann den Weg: Die Figur geht in einer kleinen Bewegung von der vorigen
      Station zu Kapitel 6 (bei „Bewegung reduzieren“ des Handys ohne Bewegung), und der Weg
      rollt zur Station.
- [ ] N2124. **Tipp auf eine Station** öffnet das Kapitel. Bitte auch im dunklen Modus und auf
      Englisch ansehen (Titel „Your path through the book“).

### Neu in 0.3.18: Gamifizierung, Grundlage (Welle 0, Opus, 31.10.2026)

Unsichtbar für dich, aber die Grundlage aller folgenden Spielelemente: Die App merkt sich jetzt je
Tag, was du getan hast, und je Thema, wie viele Trainerantworten richtig waren. Beim ersten Start
werden deine bisherigen Daten in das neue Format 7 umgewandelt; aus dem, was schon ein Datum hat
(angesehene Abbildungen, Übungen, Partien), wird das Tagesprotokoll nachgetragen.

- [ ] N2100. **Update ohne Verlust:** Nach dem Aktualisieren ist alles wie vorher: Fortschritt im
      Buch, Ringe und Orden, Abzeichen, Partien, Wertung, eigene Bots, Lernsammlung,
      Fehlerdatenbank. Stimmt alles?
- [ ] N2101. **Schalter „Feiereffekte“:** Profil › Einstellungen › Bedienung, unter „Startbild“.
      Auf „aus“: Aufgabenseite › „Orden testen“ › einen Ring auf 100 % › „Profil“ öffnen. Die
      Gratulation kommt, aber ohne Feuerwerk. Wieder „an“: mit Feuerwerk. Passt das?
- [ ] N2102. **Datensicherung:** Profil › Einstellungen › Daten › Sicherung erstellen, danach
      wieder einspielen. Alles ist noch da. (Eine Sicherung aus 0.3.18 lässt sich in einer
      älteren App nicht mehr einspielen; die meldet dann „neuere Version“, statt etwas zu
      verlieren.)

### Neu in 0.3.17: Orden und Abzeichen mit eigenen Bildern (Nebenchat, 30.10.2026)

Gebaut nach deiner Wahl auf der Entwurfsseite: alle Abzeichen und die Orden für Buch und
Buchteile im Stil „Nacht und Gold“ (C), die Bot-Orden und die Engine klassisch (A),
Startanimation nach Entwurf 3 (neues Stück fliegt ins Profil) und 4 (Stück des Tages).

- [ ] N2015. **Abzeichen im Profil:** Profil › Dein Fortschritt › „Abzeichen: x von 18“
      aufklappen. Die Abzeichen stehen zu viert in Reihen, der Name darunter, nicht mehr
      einzeln untereinander. Jedes hat seine eigene Form (Banner, Schild, Kreis, Raute, Tropfen
      …). Noch nicht verdiente sind grau, aber mit ihrer echten Form. Tippe auf ein Abzeichen:
      darunter erscheint die Bedingung, ein zweiter Tipp blendet sie wieder aus.
- [ ] N2016. **Die drei korrigierten Abzeichen:** Bei „Erst selbst denken“ sitzt das Auge
      tiefer im Tropfen, bei „Nachgefragt“ ist das Fragezeichen größer und mittig, bei „Eine
      Woche dabei“ berühren die Flammen den Kalenderrand nicht mehr. Am einfachsten zu sehen
      über die Aufgabenseite (drei Sekunden auf „Profil“ in der Leiste halten) › „Abzeichen testen“: dort ein
      Abzeichen zur Probe verdienen, dann erscheint es groß in der Meldung.
- [ ] N2017. **Orden in den Ringen:** Profil › Dein Fortschritt, die Gruppen „Teile des
      Buches“ und „Vorgefertigte Bots besiegt“ aufklappen. Die Ringe stehen zu dritt
      nebeneinander. Über die Aufgabenseite › „Orden testen“ einen Ring auf 100 % setzen: Die
      Gratulation zeigt jetzt das eigene Bild des Ordens (etwa „Übungen gelöst“: rotes Brett
      im Lorbeerkranz; Bots: Medaille mit Band und Roboterkopf), und im Profil steht es statt
      des Rings.
- [ ] N2018. **Startanimation mit neuem Orden:** Einen Orden oder ein Abzeichen zur Probe
      verdienen, dann die App ganz schließen und neu öffnen. Springer und Titel laufen genau wie
      bisher. Danach erscheint das neue Stück unter dem Titel mit Strahlen, darüber „Neuer
      Orden“ oder „Neues Abzeichen“, darunter sein Name. Dann fliegt es klein zum Reiter
      „Profil“ unten. Dort bleibt ein goldener Punkt, bis du das Profil öffnest. Ein Tipp
      überspringt alles wie bisher; der Punkt erscheint dann trotzdem. Hinweis: Beim allerersten
      Start nach dem Update gilt nichts als neu, damit nicht alle schon gesammelten Stücke auf
      einmal kommen.
- [ ] N2019. **Stück des Tages:** Die App noch einmal schließen und öffnen, ohne dass etwas Neues
      dazugekommen ist. Unter dem Titel erscheint leise eines deiner verdienten Stücke, darunter
      „Aus deiner Sammlung · x von 36“. Ohne ein einziges verdientes Stück bleibt die
      Startanimation genau wie bisher.

### Neu in 0.3.16: Trainer-Feinschliff (Nebenchat, 30.10.2026)

- [ ] N2001. **Zähltrainer, Ergebnis mit einem Tipp:** Training › Zähltrainer › „Bilanz zählen“.
      Unter dem Brett stehen Knöpfe „lohnt nicht“, „+1“ bis „+9“. Ein Tipp prüft sofort. Wer
      lieber genau zählt, tippt „Genauer üben: auch Angreifer und Verteidiger zählen“ und prüft
      dann wie früher. Ist das schnell und klar genug?
- [ ] N2002. **Zähltrainer, Stufen und Fesselung:** Vor der Übung „leicht“, „mittel“ oder
      „schwer“ wählen. Leicht hat höchstens drei beteiligte Figuren, schwer viele Figuren, eine
      Batterie oder eine Fesselung. Eine an den König gefesselte Figur zählt nicht mit (wie
      Kapitel 1 bei Abb. 1.12 sagt); nach der Antwort steht dann „Achtung Fesselung: …“.
      Stellungen, in denen die Seite am Zug im Schach steht oder matt ist, kommen nicht mehr vor.
      Passen die Stufen?
- [ ] N2003. **Hängende Figuren:** Der Auftrag sagt jetzt, dass auch unterdeckte Figuren und
      Bauern hängen und der ganze Abtausch zählt. Nach dem Prüfen steht zu jedem übersehenen und
      jedem falsch getippten Feld der Grund, etwa „e4: 2 gegen 1: Schwarz gewinnt mit dxe4
      Material“.
- [ ] N2004. **Notationstastatur:** Koordinaten-Trainer › „Zug aufschreiben“. Statt der
      Handytastatur setzt du den Zug aus Bausteinen zusammen: Figur (K D T L S, für einen
      Bauernzug keine), Linie a bis h, Reihe 1 bis 8, dazu x, +, #, =, 0-0, 0-0-0 und Löschen.
      Der Zug baut sich oben auf. „Lieber mit der Tastatur tippen“ schaltet zurück. Fehlt ein
      Fall?
- [ ] N2005. **Feld finden, Sicht:** Unter dem Brett steht deutlich „Weiß spielt von unten“ mit
      weißem Kreis, nach dem Drehen „Achtung, das Brett ist jetzt gedreht!“ mit schwarzem Kreis,
      golden aufleuchtend. Fällt der Wechsel jetzt auf?
- [ ] N2006. **Röntgen-Trainer, Stufen und Texte:** Vor der Runde „leicht“ (2 bis 3 Pfeile),
      „mittel“ (4 bis 6) oder „schwer“ (7 bis 10, auf mehrere Schritte verteilt) wählen. Dafür
      kommen auch Stellungen aus den Zugfolgen des Buches dazu („Stellung aus der Zugfolge … nach
      dem 12. Zug“). Schritt 2 und 3 sagen jetzt klar, dass der ganze Abtausch auf dem Feld zählt.
      Nach dem Prüfen steht zu jedem übersehenen oder zu viel gesetzten Pfeil die Abtauschfolge
      mit Ergebnis, etwa „Txe7+ Sxe7 fxe7: +1 Bauerneinheit“, nach Schritt 3 die Drohungen der
      Gegenseite. Sind schwere Aufgaben schwer genug?
- [ ] N2007. **Strukturerkenner:** Es gibt keine reinen Bauernstellungen mehr und keine Stellung
      im Schach. Abb. 5.28 (Spannung d4/e5, laut Buch noch keine Kette), 5.7 (das Gegenbeispiel:
      e5 ist kein Vorposten), 5.12 (Matt), 5.19, 5.31 und 5.37 sind keine Aufgaben mehr. Eine
      Kette zählt nur noch, wenn sie verkeilt ist und nirgends Spannung herrscht; ein Doppelbauer
      nur, wenn sein vorderer Bauer ungedeckt ist. Pläne, die in der Stellung ebenfalls passen,
      stehen nie als falsche Antwort da. Insgesamt 107 statt 162 Aufgaben. Tippst du einen Bauern
      als schwach an, der es nicht ist, nennt die App die Bedingung, an der „rückständig“
      scheitert (etwa „Ein eigener Bauer kann ihn noch decken“). Passen die Pläne jetzt?
- [ ] N2008. **LAP-Übung:** Planbilanz-Übung › LAP. Es kommen nur ruhige Stellungen ohne
      hängende oder gefesselte eigene Figur. Nach der Antwort stehen die freien Felder jeder
      Figur da und der Grund für die Lösung, etwa „Läufer c1 steht noch auf seinem Startfeld“
      oder „Springer d2 hat nur 2 freie Felder, Läufer b7 hat 3“.
- [ ] N2009. **Falle oder Köder:** Vor der Entscheidung zeigt „Hinweis: Warnsignale zeigen“ die
      Warnsignale aus Kapitel 4, nur wenn du willst. Nach der Entscheidung steht nur die Lösung am
      Brett, darunter die Fortsetzung mit Bewertungsbalken links (◀ ▶ blättern oder
      „Vorspielen“), und ein Satz, ob ein rotes Warnsignal die Widerlegung vorhergesagt hätte.
- [ ] N2010. **Denkroutine-Trainer:** Nach dem Vergleich mit der Engine stehen Knöpfe „Engine: …“
      und „Dein Kandidat …“; jeder zeigt den Zug (und die Antwort) mit Bewertungsbalken zum
      Durchspielen.
- [ ] N2011. **Abweichungsmodus, Kapitel 2 und 3:** Oben wählst du „Eröffnungen (Kapitel 2)“ oder
      „Gambits (Kapitel 3)“. Die Gambits sind die aus Kapitel 3 (Königsgambit bis Lettisches
      Gambit) und das Damengambit.
- [ ] N2012. **Abweichungsmodus, Reagieren statt Planzug:** Die Engine wählt jetzt bevorzugt
      Abweichungen, nach denen dein nächster Buchzug mindestens einen halben Bauern verliert. Vor
      deinem Zug zeigt „Hinweis: Was will … mit …?“, was der neue Zug angreift oder droht. Nach
      deinem Zug sagt die App, ob du stur den Buchzug gespielt hast und ob das hier geht.
- [ ] N2013. **Abweichungsmodus, drei Züge im Vergleich:** Nach deinem Zug stehen der beste Zug
      der Stellung, der beste Zug für die Eröffnungsziele (so schlecht er sein mag) und dein Zug
      mit Werten da. Weichen die ersten beiden ab, fragt die App zuerst „Überlege kurz: Warum ist
      … hier stärker als …?“; „Auflösung zeigen“ bringt die Begründung und die drei Fortsetzungen
      mit Bewertungsbalken. Die Einschätzung nennt die drei Ziele deiner Seite einzeln statt nur
      „1 von 3“.
- [ ] N2014. **Kleinigkeiten:** (1) Werkzeug Denkroutine an einer Abbildung, etwa 12.6: Der
      Reiter „Sicherheitsblick“ bricht schmal und links um, nicht mehr bildschirmbreit.
      (2) Repertoire-Trainer: keine Warum-Fragen mehr. (3) Training › „Fällige Wiederholungen“:
      oben die Gesamtzahl, darunter je Quelle ein Knopf (Übungen aus dem Buch, Falle oder Köder,
      Strukturerkenner …), dazu „Wie funktioniert das?“ mit dem Prinzip der Lernkartei.

### Neu in 0.3.15: Phasen in eigenen Partien wie bei Schachexperten (Opus, 30.10.2026)

- [ ] N1044. **Mittelspiel beginnt später:** Spiele eine Partie gegen einen Bot und öffne danach
      den Rückblick. Der Hinweis „Mittelspiel“ kommt jetzt erst, wenn beide Seiten entwickelt sind
      und rochiert haben (Glossar), oder vorher, wenn schon viel passiert ist: vier Figuren
      getauscht, eine Grundreihe fast leer, oder die Figuren beider Seiten stehen eng
      ineinander. Bei Lichess-Partien liegt der Wechsel jetzt im Mittel um Zug 10 (vorher um
      Zug 5 bis 6). Wirkt der Wechsel in deinen Partien richtig?
- [ ] N1045. **Grund des Wechsels:** Im Rückblick steht beim Wechsel ins Mittelspiel der Grund:
      „beide fertig“, „Abtausch“, „Grundreihe“ oder „Kontakt“, jeweils mit einem Satz. Sind die
      Sätze verständlich?
- [ ] N1046. **Endspiel nur mit wenig Material:** Tauscht in einer Partie früh die Damen, bleiben
      aber Türme und Leichtfiguren am Brett, nennt der Rückblick das jetzt „damenloses
      Mittelspiel“. Endspiel ist es in eigenen Partien erst, wenn jede Seite höchstens 13 Punkte
      Figuren hat (etwa Turm, Turm und Läufer) oder nur noch sechs Figuren am Brett stehen, wie bei
      Speelman und Lichess. Passt das zu deinem Gefühl?
- [ ] N1047. **Abbildungen des Buches unverändert:** An den Abbildungen gilt weiter die Regel des
      Buches (Kapitel 8, vier Fragen), etwa Abb. 4.21 als Eröffnung. Siehe auch Rückfrage Q7.
- [ ] N1048. **Bots neu geeicht:** Die Fehlerraten der Bots je Phase, das Elo-Modell der
      Partiebewertung und die Zugwahl sind mit der neuen Phasenregel neu gerechnet (dieselben
      Partien, nur die Phase je Stellung neu). Weil die Eröffnung jetzt länger dauert, verteilen
      sich die Fehlerarten etwas anders auf die Phasen (die meisten kommen in der Eröffnung jetzt
      etwas öfter vor, weil die späteren Eröffnungszüge schwerer sind). Die Spielstärke bleibt
      gleich: 78 Paarungen mit je 24 Partien, alt gegen neu mit denselben Zufallszahlen, ergaben +0,2 Prozentpunkte (Messgenauigkeit ±1,1). Fällt dir beim Spielen
      etwas auf?

### Neu in 0.3.14: Erfahrungspunkte und Abzeichen (Opus-Arbeitschat, 30.10.2026)

- [ ] N1090. **Stufe im Profil:** Profil › Dein Fortschritt. Ganz oben steht jetzt deine Stufe,
      etwa „Stufe 3 von 10: Zentrum“, rechts die Erfahrungspunkte (EP), darunter ein goldener
      Balken und „Noch … EP bis zur Stufe …“. Die zehn Stufen heißen nach Begriffen des Buches:
      Erster Zug, Entwicklung, Zentrum, Rochade, Offene Linie, Vorposten, Freibauer,
      Kombination, Zugzwang, Meisterplan. Passen Namen und Reihenfolge? Bitte sagen, wenn dir
      andere Namen lieber sind (etwa die Figuren vom Bauern bis zum König).
- [ ] N1091. **Woher die EP kommen:** Darunter „Abzeichen: x von 18“ aufklappen. Der zweite
      Absatz erklärt die Punkte: gelöste Übung 20, beantwortete Warum-Frage 5, vor den
      Werkzeugen richtig eingeschätzte Abbildung 4, angesehene Abbildung 2, abgehaktes Lernziel
      5, Trainerrunde 5, jede richtige Trainerantwort 1, Partie ab zehn Zügen 10, Sieg 10 mehr,
      Bot zum ersten Mal besiegt 25, Eintrag mit Text in Lernsammlung oder Fehlerdatenbank 8,
      jeder Tag der besten Serie der Tagesaufgabe 5. Die Punkte werden aus deinen vorhandenen
      Daten gerechnet; wer schon viel gemacht hat, steht gleich auf einer höheren Stufe. Passen
      die Gewichte und die Schwellen (100, 250, 500, 900, 1400, 2000, 2800, 3800, 5000)?
- [ ] N1092. **Abzeichengitter:** Im aufgeklappten Teil stehen alle 18 Abzeichen als
      Sechsecke mit Name und Bedingung; noch nicht verdiente sind grau. Die 18: Erste Partie,
      Erster Sieg, Zehn, Fünfzig und Hundert Partien, Erstes Matt, Aus eigener Kraft (Sieg ohne
      Rücknahme und ohne Werkzeuge), Über dich hinaus (Sieg gegen einen mindestens 100 Punkte
      stärkeren Gegner), Gehalten (Remis gegen einen solchen), Brillanter Zug, Erste Übung,
      Kapitel gemeistert (alle Übungen eines Kapitels), Nachgefragt (zehn Warum-Fragen), Erst
      selbst denken (zehn Einschätzungen), Eigene Stellung (Lernsammlung), Aus Fehlern lernen
      (fünf Fehler mit Satz), Fleißig trainiert (100 richtige Trainerantworten), Eine Woche
      dabei (sieben Tage hintereinander gelernt oder gespielt). Fehlt dir eines, ist eines zu
      leicht oder zu schwer?
- [ ] N1093. **Meldung bei einem neuen Abzeichen:** Spiele eine Partie gegen einen Bot zu Ende
      (wenn du noch keine hast). Danach erscheint eine schlichte goldene Karte „Neues
      Abzeichen“ mit dem Sechseck „Erste Partie“ und „Weiter“, ohne Feuerwerk und ohne Ton. Sie
      kommt nur einmal. Hast du beim ersten Öffnen nach dem Update schon vieles erreicht,
      stehen alle Abzeichen auf einer einzigen Karte statt vieler Meldungen nacheinander.
- [ ] N1094. **Abzeichen testen:** Aufgabenseite (Profil drei Sekunden halten) › Karte
      „Abzeichen testen (nur für dich)“ aufklappen. Ein Tipp auf „Erste Partie: verdienen“
      zeigt sofort die Meldung; „Nächste Stufe erreichen“ zeigt „Neue Stufe erreicht“. Im Profil
      stehen dann Abzeichen und Stufe. „Probe beenden“ stellt alles zurück; deine echten Daten
      ändern sich dabei nicht.
- [ ] N1095. **Nichts verfällt:** Eine Pause nimmt dir kein Abzeichen und keine Stufe. Ein
      einmal gemeldetes Abzeichen bleibt, auch wenn die Partie dazu später aus der Liste der
      letzten 50 Partien fällt. Es gibt keine Bestenliste, nichts verlässt das Gerät. Passt
      dir der ruhige Ton, oder wünschst du dir bei Abzeichen doch Feuerwerk und Ton wie bei den
      Orden?

### Neu in 0.3.14: Feste Eröffnungen für eigene Bots (Opus-Arbeitschat, 30.10.2026)

- [ ] N1080. **Klappe „Eröffnungen“ im Gegnereditor:** Spielen › Eigene Bots › „Neuen Gegner
      anlegen“ (oder einen bestehenden bearbeiten). Unter den vier Reitern steht die Klappe
      „Eröffnungen (0)“. Aufklappen: „Noch keine feste Eröffnung.“, darunter „Eröffnungen aus dem
      Buch“ (Haken je Eröffnung aus Kapitel 2 und 3) und „Eröffnungen nach Spielstärke“ (dieselbe
      Liste wie im Spielfenster). Ein Tipp auf eine Eröffnung setzt den Haken (goldener Rahmen),
      ein zweiter Tipp nimmt ihn weg. Die Zahl in der Überschrift zählt mit. Passt das so?
- [ ] N1081. **Mehrfachauswahl:** Wähle zwei oder drei Eröffnungen (etwa Italienische Partie und
      London-System, dazu eine aus dem Buch). Oben unter „Gewählt“ stehen sie als kleine Marken
      mit ✕; ein Tipp auf eine Marke entfernt sie, „Alle entfernen“ leert die Liste.
- [ ] N1082. **Schnellwahl im Variantenbaum:** In „Eröffnungen nach Spielstärke“ unter einer
      Eröffnung „Varianten (n)“ aufklappen. Darüber stehen jetzt die Knöpfe „Die häufigsten 3“,
      „Die häufigsten 5“ und „Alle Varianten“. Sie ersetzen die gewählten Varianten dieser einen
      Eröffnung durch die häufigsten (andere Eröffnungen bleiben). Einzelne Varianten lassen sich
      auch einzeln an- und abhaken. Höchstens 40 Eröffnungen je Bot.
- [ ] N1083. **Regler „Abweichung“:** Sobald mindestens eine Eröffnung gewählt ist, erscheint
      „Abweichung: 0 %“ mit Regler in Zehnerschritten. 0 % heißt: Der Bot folgt seiner Eröffnung
      immer, solange du ihre Züge spielst. 100 % heißt: wie ohne Festlegung (er eröffnet wie
      Menschen seiner Stärke). Dazwischen verlässt er die Eröffnung bei jedem Buchzug mit dieser
      Wahrscheinlichkeit. Ist die Vorgabe 0 % richtig, oder lieber etwa 20 %?
- [ ] N1084. **Beschreibung:** Unter dem Editor steht „So stellt er sich vor:“. Mit festen
      Eröffnungen endet sie mit „Eröffnet gern: Italienische Partie oder London-System.“; ab drei
      Eröffnungen „Eröffnet gern: A, B (und 2 weitere).“ Gefällt dir der Satz? (Der Doppelpunkt
      erspart die Beugung der Namen, „Eröffnet gern Italienisch“ ginge nicht für jeden Namen.)
- [ ] N1085. **Vorrang im Spielfenster:** Den Bot speichern und in „Eigene Bots“ wählen. Unten
      in der Karte „Partie“ die Klappe „Eröffnung festlegen“ öffnen. Oben steht „<Name> hat feste
      Eröffnungen: …. Je Partie wählt er eine davon.“, darunter der Haken „Eröffnung des Bots
      überschreiben“. Die gewohnte Eröffnungswahl darunter ist ausgegraut und nicht bedienbar.
      Setzt du den Haken, wird sie bedienbar und gilt für die nächste Partie (auch „wie Menschen
      dieser Stärke“). Der Haken gilt nur, solange du auf dem Bildschirm bist.
- [ ] N1086. **Partie mit fester Eröffnung:** Einem Bot nur das London-System geben, Abweichung
      0 %, mit Schwarz eine Partie beginnen. Der Bot spielt 1. d4 und nach 1… d5 2. Lf4. Mit zwei
      Eröffnungen (etwa Italienische Partie und London-System) wählt er je Partie zufällig eine;
      bitte drei oder vier Partien beginnen und aufgeben.
- [ ] N1087. **Abweichung im Spiel:** Denselben Bot auf 100 % stellen: Er eröffnet dann wie ohne
      Festlegung (meist 1. e4). Bei 50 % verlässt er die Linie im Mittel nach ein bis zwei
      Buchzügen. Fühlt sich das richtig an?
- [ ] N1088. **Bestehende Bots und Sicherung:** Deine schon angelegten eigenen Bots sehen aus wie
      vorher und spielen wie vorher („Eröffnungen (0)“). Nach Einstellungen › Datensicherung
      exportieren und wieder einlesen sind die festen Eröffnungen und die Abweichung noch da.
      Hinweis: Eine ältere App-Version (vor diesem Stand) liest solche Bots ohne Absturz, kennt
      die Eröffnungen aber nicht; speichert man den Bot dort neu, sind sie weg.
- [ ] N1089. **Englisch:** Sprache auf Englisch stellen: Klappe „Openings (n)“, „Deviation“,
      „Override the bot's opening“, Beschreibung „Likes to open with: …“. Die Namen der
      Eröffnungen nach Spielstärke stehen dann englisch (wie auf Lichess).

### Neu in 0.3.14: Zusatzaufgaben von Lichess im Taktiktrainer (Opus-Arbeitschat, 30.10.2026)

- [ ] N1070. **Wahl der Quelle:** Training › Taktiktrainer öffnen. Oben steht „Aufgaben“ mit zwei
      Knöpfen, „Aus dem Buch“ (vorgewählt, alles wie bisher) und „Zusatzaufgaben (Lichess)“.
      Darunter ein Satz, was gewählt ist. Prüfen: Ist „Aus dem Buch“ vorgewählt und läuft die
      Runde dort genau wie früher?
- [ ] N1071. **Kennzeichnung:** „Zusatzaufgaben (Lichess)“ tippen. Darunter steht
      „Zusatzinhalt (nicht aus dem Buch), Quelle: Lichess-Puzzle-Datenbank (CC0) …“. In jeder
      Aufgabe steht unter dem Brett „Zusatzaufgabe (nicht aus dem Buch) · Lichess (CC0),
      Wertung …“. Reicht dir die Kennzeichnung?
- [ ] N1072. **Themen:** Die Liste „Thema“ hat 20 Themen mit je 50 Aufgaben: Hängende Figur,
      Gabel und Doppelangriff, Fesselung, Spieß, Abzug und Abzugsschach, Doppelschach,
      Hinlenkung, Räumung, Beseitigung der Verteidigung, Ablenkung, Zwischenzug, Gefangene
      Figur, Umwandlung, Wegversperrung, Stiller Zug, Zugzwang, Grundreihenmatt, Mattbilder,
      Matt in einem Zug, Matt in zwei Zügen (dazu „Alle Themen gemischt“). Passen die Namen zu
      deinen Begriffen? „Röntgenangriff“ von Lichess ist bewusst nicht dabei, weil „Röntgen“ im
      Buch die Schach-Röntgen-Regel meint.
- [ ] N1073. **Stufen:** Stufe 1 bis 5 wählen (Stufe 1: Lichess-Wertung unter 1000, Stufe 5:
      1900 bis 2200). Je Thema und Stufe gibt es zehn Aufgaben. Fühlen sich Stufe 1 leicht und
      Stufe 5 schwer an?
- [ ] N1074. **Gegnerzug vorgespielt:** Eine Runde starten. Das Brett zeigt kurz (0,7 Sekunden)
      die Stellung vor dem Zug des Gegners, dann gleitet sein Zug über das Brett und bleibt
      markiert; erst dann kannst du ziehen. Ist die Pause angenehm?
- [ ] N1075. **Lösen und falscher Zug:** Eine Aufgabe richtig lösen (die App antwortet mit dem
      Gegenzug), bei einer anderen einen falschen Zug ziehen: roter Pfeil und Verlust laut
      Engine wie bei den Buchaufgaben. Hinweis 2 nennt das Thema, Hinweis 3 die Figur.
- [ ] N1076. **Motivfrage:** Bei „Alle Themen gemischt“ kommt nach dem Lösen „Welches Motiv war
      es?“, aber nur bei Themen, die zu einem der zwölf Grundmotive aus Kapitel 7 gehören
      (Räumung zählt zur Hinlenkung, Ablenkung zur Überlastung). Bei einem einzelnen Thema
      entfällt die Frage. Einverstanden mit der Zuordnung?
- [ ] N1077. **Wiederholung:** Bei einer Zusatzaufgabe „Lösung zeigen“ tippen. Nach zwei Tagen
      bietet der Taktiktrainer oben „Wiederholen: 1 Aufgabe ist fällig“ an, auch wenn
      „Aus dem Buch“ gewählt ist; die Aufgabe kommt mit der Kennzeichnung als Zusatzaufgabe.
- [ ] N1078. **Offline:** Die App einmal online öffnen, dann im Flugmodus den Taktiktrainer und
      „Zusatzaufgaben (Lichess)“ öffnen. Die Themen erscheinen und die Runde läuft.
- [ ] N1079. **Englisch:** Sprache auf Englisch stellen. Die Wahl heißt „From the book“ |
      „Extra puzzles (Lichess)“, die Themen sind englisch benannt.

### Neu in 0.3.14: Mehr Meisterpartien für „Zug erraten“ (Opus-Arbeitschat, 30.10.2026)

- [ ] N1060. **Quellenwahl:** Trainer › „Zug erraten“ öffnen. Oben steht „Quelle“ mit drei
      Knöpfen: „Aus dem Buch“ (gewählt, wie bisher die Meisterpartien aus Kapitel 11),
      „Berühmte Partien“ und „Aktuelle Turniere“. Bei „Aus dem Buch“ sieht alles aus wie bisher.
- [ ] N1061. **Berühmte Partien:** „Berühmte Partien“ tippen. Die Liste „Partie“ zeigt etwa 50
      Klassiker von Anderssen bis Carlsen (Titel „Weiß – Schwarz, Ort Jahr“). Unter der Liste
      steht eine Karte „Zusatzinhalt (nicht aus dem Buch)“ mit Spielern, Ergebnis, Eröffnung,
      einem kurzen Text (wer, wann, warum berühmt) und zwei Quellen als Links. Bitte ein paar
      Kurztexte lesen: Stimmen sie, klingen sie gut? Partien aus dem Buch (Opernpartie,
      Immergrüne, Lasker–Thomas usw.) kommen hier nicht noch einmal vor.
- [ ] N1062. **Aktuelle Turniere:** „Aktuelle Turniere“ tippen. Etwa 60 Partien aus August und
      September 2026 (Olympiade Samarkand, Sinquefield Cup, türkische Liga u. a.), klassische
      Bedenkzeit, beide Spieler ab 2500, alle entschieden. Die Karte nennt Turnier, Runde, Datum,
      Wertungen und als Quelle die Lichess-Übertragung mit „CC BY-SA 4.0“ (die Lizenz verlangt
      diese Namensnennung).
- [ ] N1063. **Raten wie gewohnt:** Eine berühmte Partie wählen, Seite des Siegers, „Runde
      starten“. Über dem Brett steht zugeklappt „Zusatzinhalt (nicht aus dem Buch)“ (aufklappen
      zeigt die Karte). Raten, Hinweis, Pfeile, Engine-Vergleich, Blättern und Analyse
      funktionieren wie bei den Buchpartien; beim nächsten Mal nennt die App den letzten
      Durchgang dieser Partie.
- [ ] N1064. **Offline und Lizenzen:** Nach dem Aktualisieren der App einmal ohne Netz „Berühmte
      Partien“ und „Aktuelle Turniere“ öffnen: Die Listen kommen trotzdem. Unter Einstellungen ›
      Lizenzen steht der neue Eintrag „Zusatzpartien für „Zug erraten“ (aktuelle Turniere)“ mit
      CC BY-SA 4.0.

### Neu in 0.3.14: Webverweise, Trainer der App neben Lichess (Opus-Arbeitschat, 30.10.2026)

- [ ] N1050. **Koordinaten in der App:** schach-von-grund-auf.com/training/kap00/ öffnen. Unter
      der Übung zum Koordinatentraining steht wie bisher „Direkt öffnen: Koordinatentraining ↗“
      (Lichess, neuer Tab) und dahinter neu „In der App: Koordinaten, Notation, Gangarten“. Ein
      Tipp darauf öffnet die App gleich im Koordinatentrainer (Knöpfe „Feld finden“ usw.).
      „Zurück“ führt zur Übersicht der Trainer im Bereich Training. Passt das?
- [ ] N1051. **Taktik und Endspiel in der App:** Auf schach-von-grund-auf.com/training/kap01/
      steht bei Übungen mit „Aufgabenthemen“ zusätzlich „In der App: Taktiktrainer“, auf
      /training/kap08/ und /training/kap09/ bei den Lichess-Übungen zu Mattvarianten und
      Turmendspielen „In der App: Endspieltrainer“. Je einmal antippen: Öffnet sich der richtige
      Trainer? Die Lichess-Links bleiben daneben, weil das Buch sie nennt.
- [ ] N1052. **Linkprüfung im Dashboard:** Nach dem nächsten Wartungslauf (schach-von-grund-auf.com/admin/,
      Übersicht, Gruppe „Links“) prüft „App-Texte und Lizenzen“ jetzt auch die Quellen der
      Lizenzseite, die ohne „https://“ dastehen (etwa github.com/niklasf/chessops). Neu ist
      außerdem: Leitet eine Adresse auf eine andere Domain weiter (so sieht eine abgelaufene,
      geparkte Domain aus), wird der Punkt gelb mit „umgeleitet nach …“. Heute sollte alles grün
      sein. Ist es das?

### Neu in 0.3.13: Orden verstreut, Pfeile, Serie ohne Verfall (Opus, 30.10.2026)

- [ ] N1042. **Pfeile in den Werkzeugbildern:** Nachschlagen › Werkzeuge des Buches, ein Werkzeug
      aufklappen. Neben den goldenen Nummern zeigt jetzt ein goldener Pfeil schräg von unten auf
      jeden Knopf, den du antippst. Auf dem Brett selbst (bei „Zählen“ das Feld d4) steht nur die
      Nummer, weil ein Pfeil dort wie ein Pfeil des Werkzeugs aussähe. Passt das?
- [ ] N1043. **Tagesserie ohne Verfall:** Training › Kurzpläne › Tagesaufgabe. Die Zeile heißt
      jetzt „Serie: 3 Tage mit Tagesaufgabe. Die Serie verfällt nicht.“ Lässt du einen Tag aus,
      steht dort „… gerade pausiert. Löse heute die Tagesaufgabe, dann geht sie weiter“; die Zahl
      bleibt und wächst mit der nächsten gelösten Aufgabe weiter (deine Wahl vom 30.10.). Ist der
      Text so gut?

### Neu in 0.3.12: Wiki im Dashboard (Opus, 30.10.2026)

- [ ] N1040. **Wiki:** schach-von-grund-auf.com/admin/ öffnen (wie immer mit dem Einmalcode).
      Oben stehen jetzt zwei Knöpfe, „Übersicht“ (alles wie bisher) und „Wiki“. Im Wiki:
      „Projekt“ mit Arbeitsregeln, Architektur, Fortschritt (die 40 neuesten Stände), Lizenzen
      und je Entscheidung eine Seite; „Code“ mit dem Codeführer, den Begriffen und je Ordner
      der App einer Seite mit allen Dateien (Zweck, Rolle, was sie anbietet). Oben sucht „Im Wiki
      suchen“ im ganzen Text und zeigt die Fundstelle; „Titel filtern“ kürzt die Liste. Ein Tipp
      öffnet die Seite. Die Seiten kommen nach jedem Push nach main mit dem Lauf „Wartung“ neu
      (etwa 15 bis 20 Minuten nach dem Push); Buchbefunde sind ausgenommen, Buchtexte stehen
      ohnehin nicht in diesen Unterlagen. Gespeichert wird nur in der Datenbank des Dashboards
      hinter Cloudflare Access, nie als Datei im Repository. Steht dort „Noch keine Seiten“, ist
      der Lauf noch nicht durch. Ist das Wiki so brauchbar?

### Neu in 0.3.11: Variantenbaum und Gambits (Opus, 30.10.2026)

- [ ] N1038. **Variantenbaum:** In „Eröffnungen nach Spielstärke“ (Spielen › Eröffnung
      festlegen) steht unter jeder Eröffnung „Varianten (20)“. Aufgeklappt: die 20 häufigsten
      Varianten nach Lichess als Baum, verzweigt ab dem ersten abweichenden Zug, Geschwister nach
      Häufigkeit. Jede Zeile nennt den Namen (ohne das, was darüber schon steht), die Züge ab der
      Verzweigung in deiner Notation und den Anteil an der Eröffnung, etwa unter Italienisch
      „Two Knights Defense · 3... Sf6 · 34 % dieser Eröffnung“, darunter „Knight Attack · 4. Sg5“.
      Ein Tipp legt die Variante für den Bot fest. Die Variantennamen bleiben englisch wie in der
      Lichess-Liste. Ist der Baum so lesbar?
- [ ] N1039. **Gambits:** Unter „Weiß wählt“ und „Schwarz wählt“ steht „Gambits“: je Band die
      drei häufigsten, die noch nicht dastehen, beide Seiten zusammen, mit „Weiß spielt es“ oder
      „Schwarz spielt es“ und der Häufigkeit; der Name nennt die Eröffnung, aus der das Gambit
      stammt („Sizilianische Verteidigung: Smith-Morra Gambit“). Um 800 sind es Englund-Gambit,
      Busch-Gass-Gambit und Königsgambit. Das Damengambit zählt nicht als Gambit (wie im Buch).
      Passt das?

### Neu in 0.3.10: Eröffnungen nach Spielstärke (Opus, 30.10.2026)

- [ ] N1037. **Eröffnungen nach Spielstärke:** Spielen › „Eröffnung festlegen“ aufklappen, darin
      die neue Klappe „Eröffnungen nach Spielstärke“. Oben „von“ und „bis“ (Bänder 400 bis
      2800+, Vorgabe 1000 bis 1400). Darunter „Weiß wählt“ und „Schwarz wählt“: Jedes Band
      bringt die drei häufigsten Eröffnungen, die noch nicht dastehen, also bei drei Bändern neun
      je Seite. Jede Zeile zeigt den Namen, „Buch 2.3“ bei Eröffnungen aus deinem Buch, „Gambit“
      bei Gambits und „2,9 % der Partien um 1200“. Ein Tipp legt die Eröffnung fest: Sie steht
      dann oben in der Auswahl, mit der Hauptvariante darunter, und der Bot folgt ihr, solange du
      ihre Züge spielst. Gezählt in einem Monat Lichess (September 2026). Passen Aufbau und
      Vorgabe?

### Neu in 0.3.9: Bilder im Nachschlagen (Opus, 30.10.2026)

- [ ] N1035. **Steckbriefe mit Diagramm:** Nachschlagen › Steckbriefe, eine Eröffnung aufklappen
      (etwa Caro-Kann). Unter den vier Zeilen steht jetzt die Schlussstellung der Hauptvariante
      aus deinem Buch als kleines Brett mit deinen Pfeilen und Feldern, darunter
      „Schlussstellung der Hauptvariante (Abb. 2.109)“; ein Tipp öffnet die Abbildung. Die App
      nimmt in jedem Abschnitt die Abbildung, deren Unterschrift mit „Schlussstellung der
      Hauptvariante“ beginnt; im Sammelabschnitt 2.10 die im Unterabschnitt mit dem Namen der
      Eröffnung (beim Zweispringerspiel und Läuferspiel die erste der zwei, Abb. 2.128). Bei
      den Fallenchecks steht der Stopp-Moment ebenso als Brett statt nur als Knopf. Passt das?
- [ ] N1036. **Werkzeuge mit Bildschirmfoto:** Nachschlagen › Werkzeuge des Buches, ein
      Werkzeug aufklappen (etwa LAP). Unter Erklärung und Regel steht ein Foto aus der App an
      einer Abbildung deines Buches: Gold mit Nummer ist, was du antippst, in dieser
      Reihenfolge (Bündel in der Leiste, dann der Reiter; bei „Zählen“ der Knopf am Brett und
      das Feld), gold ohne Nummer sind Brett und Karte mit dem Ergebnis. Lange Karten blenden
      unten weich aus. Der Knopf „An Abb. 6.20 ausprobieren“ öffnet dieselbe Abbildung. Die
      Fotos macht der Browser-Test automatisch (34 Werkzeuge, zusammen 1,7 MB, auch offline);
      ändert sich die Oberfläche, werden sie mit einem Befehl neu gemacht. Auf Englisch zeigen
      die Fotos vorerst die deutsche Oberfläche. Sind die Fotos verständlich?

### Neu in 0.3.8: eigene Bots stellen sich vor (Opus, 30.10.2026)

- [ ] N1034. **Beschreibung eigener Bots:** Spielen › Eigene Bots › „Neuer Gegner“ (oder einen
      vorhandenen bearbeiten). Unter den vier Reitern steht „So stellt er sich vor:“ mit zwei
      bis vier kurzen Sätzen aus deinen Einstellungen, etwa „Ein Gegner für Einsteiger. Spielt
      im Stil Angreifer. Typisch: lässt Figuren hängen und übersieht Drohungen. Übersieht gern
      Rückzüge.“ Die Stärke kommt aus dem Mittel der drei Stufen (bis 3 Einsteiger, bis 6
      Vereinsniveau, bis 8 Fortgeschrittene, darüber starke Spieler), Fehler und blinde Flecken
      aus den drei höchsten Reglern. Ändere einen Regler oder den Stil: Der Text ändert sich
      sofort. Derselbe Text steht in der Gegnerwahl in der Sprechblase deines Bots. Klingen die
      Sätze gut?

### Neu in 0.3.7: Orden für volle Ringe (Opus, 30.10.2026)

- [ ] N1032. **Neue Ringe im Profil:** Profil › Dein Fortschritt. Oben wie bisher Abbildungen,
      Lernziele und Trainer, neu ein Ring „Übungen gelöst“ (alle 86 Übungen des Buches).
      Darunter zwei aufklappbare Zeilen, damit es nicht zu viele werden: „Teile des Buches“ mit
      fünf Ringen nach den Teilen deines Buches (Grundlagen = Kapitel 0 und 1, Eröffnung 2–4,
      Mittelspiel 5–7, Endspiel 8–10, Praxis 11–12; voll, wenn alle Abbildungen angesehen und
      alle Übungen gelöst sind) und „Vorgefertigte Bots besiegt“ mit neun Ringen nach deinen
      Bündeln: Stufe 1–3, 4–5, 6–7 und 8–9 je „jeden Bot einmal“ (gewertet, beliebige Zeitart)
      und „in allen Zeitarten“, dazu die Engine (Stufe 10) mit dem Superorden für jeden Bot
      einmal. Die drei alten Ringe je Zeitart sind dafür weg. Die Zeile nennt, wie viele Ringe
      schon voll sind. Passen Einteilung und Texte?
- [ ] N1033. **Orden testen:** Aufgabenseite (Profil drei Sekunden halten) › ganz oben „Orden
      testen (nur für dich)“. Je Ring ein Knopf „… auf 100 % setzen“: Sofort kommen Feuerwerk,
      Ton und die Gratulation mit dem neuen Orden (Medaille mit Band und dem Zeichen des Rings).
      Im Profil steht danach statt des Rings der Orden. „Neu starten“ zeigt die Startanimation:
      Alle 18 Orden stehen im Kranz um den Springer, deine verdienten golden, die übrigen als
      graue Silhouette. „Probe beenden“ stellt alles zurück; deine echten Fortschritte ändert
      die Probe nie. Wie gefallen dir Orden und Kranz?

### Neu in 0.3.6: ein Knopf „Merken“ für Lernsammlung und Fehlerdatenbank (Opus, 30.10.2026)

- [ ] N1029. **Ein Knopf statt zwei Zeilen:** Spiele eine Partie und spiele sie nach. Am Brett
      steht jetzt das Lesezeichen „Merken“ (wie bei den Abbildungen); die zwei Zeilen „In die
      Fehlerdatenbank“ und „In die Lernsammlung“ unter der Karte sind weg (dein Beschluss: ein
      Knopf). Ein Tipp öffnet unter der Karte die Wahl „Lernen | Fehler“. Bei Zügen mit ?, ??
      oder „verpasst“ ist „Fehler“ vorgewählt, sonst „Lernen“. Ein zweiter Tipp schließt es,
      ein anderer Zug ebenso.
- [ ] N1030. **Vorschläge:** Unter „Fehler“ ist die Fehlerart schon gewählt, wenn die
      Auswertung den Fehler erkennt (etwa hängende Figur oder stehengelassene Drohung →
      „Kapitel 1: Schach oder Schlag übersehen“, übersehene Taktik → Kapitel 7, Schlagreflex
      oder vergifteter Bauer → Kapitel 4, Bauernzüge ohne Not → Kapitel 5), und der Satz
      steht vor: „12... Sxe4: lässt … zu. Besser war 12... h6.“ Unter „Lernen“ steht die
      Eröffnung wie bisher und als Notiz „Aus meiner Partie, Stellung nach 12... Sxe4.“ Alles
      lässt sich ändern. Passt die Zuordnung der Fehlerarten zu den Kapiteln?
- [ ] N1031. **Goldenes Aufleuchten:** Bei einem eigenen Patzer (??) oder verpassten Gewinn
      leuchtet „Merken“ zweimal kurz golden auf (bei „Bewegung reduzieren“ nur ein goldener
      Rand). Nur dort, damit es nicht nervt (deine Vorgabe „lieber zu selten als zu oft“).
      Passt das, oder auch bei einem Fehler (?)?

### Neu in 0.3.5: Pfeile und Verlust nach einem falschen Zug (Opus, 30.10.2026)

- [ ] N1027. **Taktiktrainer, falscher Zug:** Spiele in einer Taktikaufgabe absichtlich einen
      falschen Zug. Unter dem Brett steht kurz „Die Engine vergleicht beide Züge …“, dann etwa
      „Dein Zug Dh5 ist laut Engine um etwa 2,1 Bauerneinheiten schwächer als die Lösung (roter
      Pfeil). Versuch es noch einmal.“ Auf dem Brett zeigt ein roter Pfeil deinen Zug. Die Lösung
      bleibt verdeckt, damit du es noch einmal versuchen kannst (meine Empfehlung, Widerspruch
      genügt: dann zeige ich den goldenen Pfeil sofort). Nach dem Lösen oder „Lösung zeigen“ steht
      der volle Vergleich mit dem Zug der Lösung und beiden Bewertungen. Den goldenen Pfeil siehst
      du, solange das Brett die Stellung vor deinem falschen Zug zeigt.
- [ ] N1028. **Buchübungen, falscher Zug:** Dasselbe in den Übungen eines Kapitels (etwa Übung
      zu Abb. 1.40: statt Sc7+ den Springer nach a7). Erst roter Pfeil und Verlust, nach dem
      Lösen der Vergleich „dein Zug Sa7 …, Lösung Sc7+ …“. „Zug erraten“ und „Studien“ zeigen
      Pfeile und Vergleich schon wie bisher; der Abweichungstrainer nennt Verlust und besseren
      Zug weiter in Worten (dort zeigt das Brett schon die Stellung nach deinem Zug).

### Neu in 0.3.4: Wertung auf chess.com und FIDE als Bereich (Opus, 30.10.2026)

- [ ] N1026. **Drei Schalter statt zwei:** Profil › Deine Wertung (und unter Spielen „Deine
      Spielstärke“) hat jetzt „Lichess | chess.com | FIDE“, und beide Umrechnungen gibt es für
      jede Zeitart (dein Wunsch). Statt „≈ 1340“ steht ein Bereich, etwa „1190–1490 chess.com
      Schnellschach“: In ihm liegt die Hälfte der Spieler, die bei uns dieselbe Zahl hätten.
      Blitz wird mit chess.com Blitz verglichen, Schnellschach und Klassisch mit chess.com
      Schnellschach, weil chess.com keine klassische Wertung führt; der Name der Liste steht
      jeweils dabei. Bei FIDE fehlen Werte unter etwa 1650 (dann ein Strich mit der Grenze, etwa
      „FIDE erst ab etwa 1730 (Lichess Klassisch)“). Die Kurve bleibt im Maßstab von Lichess, die
      Wahl bleibt auf dem Gerät. Schon umgesetzt, Widerspruch genügt. Sind die Bereiche zu breit
      oder gerade richtig?

### Neu in 0.3.3: Kurzpläne und „Keine Fehlerneigung“ (Sonnet, 26.10.2026)

Nach deinen Beschlüssen im Chat umgesetzt; Widerspruch genügt.

- [ ] N1021. **Keine Fehlerneigung:** Eigener Bot, Vorlage „keine Fehler“ (keine Fehlerart und kein
      blinder Fleck an): Über den Reitern steht nicht mehr „Menschlich.“, sondern „Keine
      Fehlerneigung.“ in Gold, hinter dem Fragezeichen die Erklärung. Sobald eine Fehlerart oder
      ein Fleck angehakt ist, kommen die alten Urteile wieder.
- [ ] N1022. **Neuer Trainer „Kurzpläne“** (Training › Kapitel 12, Stundenglas-Symbol): Vier
      Angebote. „5 Minuten: nur Wiederholungen“ zeigt Uhr und die fälligen Wiederholungen;
      „Einheit abschließen“ meldet „Geschafft“. „15 Minuten: Kurzplan“ hat zwei Schritte
      (5 Minuten Wiederholungen, 10 Minuten Taktik-Themenblock mit Knopf zum Taktiktrainer). Die
      Einheit bleibt beim Wechsel in einen anderen Bildschirm erhalten (nach drei Stunden verfällt
      sie). Der Stand liegt nur auf dem Gerät, nicht in der Datensicherung.
- [ ] N1023. **Taktik auf Zeit:** „Zeitrunde starten“: drei Minuten leichte Taktikaufgaben, Ende
      nach drei Fehlern oder wenn die Zeit um ist; am Ende „X richtig, Y falsch“ und deine beste
      Runde. Prüfe, ob sich die Aufgaben auf dem Handy flott bedienen lassen und ob das Ende
      auch mitten in einer Aufgabe sauber kommt.
- [ ] N1024. **Tagesaufgabe mit Serie:** Eine leichte Taktikaufgabe pro Tag (am nächsten Tag eine
      andere). Oben steht „Serie: n Tage in Folge (beste: m)“; sie wächst, wenn du an
      aufeinanderfolgenden Tagen eine Aufgabe bearbeitest (richtig oder falsch), und fällt nach einem
      ausgelassenen Tag auf 0. Auch Änderung der Systemzeit zum Testen möglich.
- [ ] N1025. **Fortschritt:** Der Ring „Trainer ausprobiert“ hat jetzt 18 statt 17 Trainer
      (Kurzpläne zählt, sobald du eine Einheit abgeschlossen oder eine Runde gespielt hast).

### Neu in 0.3.2: kleine Korrekturen aus der Ideensammlung (Sonnet, 26.10.2026)

Alles nach deinem Wunsch umgesetzt; Widerspruch genügt, dann baue ich es zurück.

- [ ] N1011. **Eröffnung festlegen:** Spielen › Zahnrad „Eröffnung festlegen“ aufklappen. Unter
      der Überschrift steht jetzt nur noch die Auswahlliste, ohne das zweite Wort „Eröffnung“.
- [ ] N1012. **Varianten abspielen:** In der Auswertung einer Partie bei einem Zug mit Fehler:
      „Besserer Zug“ und „Bestrafung“ stehen nebeneinander in einer Zeile (kürzere Beschriftung).
      Läuft oder lief eine Variante, erscheint rechts daneben ein Pfeil zurück
      („Zurück zur Ausgangsstellung“); er führt auch nach dem Ende der Variante zur Stellung der
      Partie zurück.
- [ ] N1013. **Zügeraten, Pfeile:** Trainer „Zug erraten“: Hast du den Partiezug selbst
      gefunden (auch mit Hinweis), erscheint kein Pfeil. Bei einem falschen Zug bleiben der
      goldene (Partiezug) und der rote Pfeil (dein Zug).
- [ ] N1014. **Reiter „Blinde Flecken“:** Eigener Bot oder eigene Stufe: Der Reiter heißt jetzt
      „Blinde Flecken (n)“. Prüfe, dass alle vier Reiter auf dem Handy in die Zeile passen.
- [ ] N1015. **Profil:** Sind Name oder Porträt gesetzt, steht oben statt des Knopfes „Name und
      Porträt“ ein kleiner Stift rechts auf der Karte; er öffnet dieselbe Auswahl. Solange beides
      leer ist, steht der Textknopf weiter da.
- [ ] N1016. **Einstellungen ohne „Training“:** Der Reiter „Training“ ist weg, „Brett“ steht
      jetzt vorn. „Erst selbst denken“ gilt fest in der lockeren Form (Übungen: Hinweise erst nach
      „Ich habe nachgedacht“), und vor den Werkzeugen an den Abbildungen wird nicht mehr nach einer
      Einschätzung gefragt. Bitte eine Übung und eine Abbildung mit Werkzeug öffnen; beides soll wie
      früher mit den Standardwerten laufen. Alte gespeicherte Werte werden ignoriert und bleiben
      nur im Datenformat (Sicherungen), weil das Entfernen aus dem Format eine eigene Entscheidung
      ist (Rückwärtsverträglichkeit).
- [ ] N1017. **Sicherheitsblick ohne Zug:** Denkroutine, Werkzeug „Sicherheitsblick“ an einer
      Stellung ohne Zugfolge und ohne Buchzug: Es prüft jetzt den besten Kandidaten der
      Denkroutine (mit dem Satz „Kein Zug ist geplant: Geprüft wird der beste Kandidat …“).
      Mit geplantem Zug oder Buchzug ändert sich nichts.

- [ ] N1018. **Gegner und Farbe mit Zeichen:** Spielen: „Engine“ trägt ein Chip-Symbol und
      „Mensch“ ein Personensymbol; „Weiß“ und „Schwarz“ tragen eine weiße und eine schwarze
      Scheibe. Alles andere ist wie vorher.
- [ ] N1019. **Bedenkzeit nach Zeitart:** Spielen › „Bedenkzeit“: statt vieler Kacheln steht je
      Zeitart eine Zeile mit dem Zeichen einmal groß (Blitz, Stoppuhr, Kaffeetasse) und dem Namen
      links, rechts daneben die Zeiten dieser Art (zum Beispiel Blitz: 3 + 0, 3 + 2, 5 + 3).
      Außerhalb der Grundstellung kommt eine Zeile „ohne Uhr“ dazu. Prüfe, ob es auf dem Handy
      ruhiger wirkt und ob die Zeiten in die Zeile passen.
- [ ] N1020. **Motiv benennen als Liste:** Taktiktrainer, nach einer gelösten Aufgabe mit
      Grundmotiv: Die zwölf Motive stehen jetzt in einer Auswahlliste („Motiv wählen …“) statt als
      Knöpfe untereinander. Die erste Wahl zählt, danach steht die Antwort da. Befund der Durchsicht
      aller Trainer: Die übrigen Chip-Gruppen haben höchstens vier Einträge (Seite, Stufe, Bereich,
      Waage) und bleiben; alle längeren Wahlen waren schon Listen.

### Neu in 0.2.144: Feiern, Gruppenkreis, Maia-Hinweis, einfachere Texte (Opus, Nacht 25./26.10.2026)

- [ ] N990. **Gruppenbild als Kreis:** Spielen › Vorgefertigte Bots, eine Stufe aufklappen. Unter
      den Porträts steht der Knopf „Gruppenmodus“; rechts daneben sitzen die acht Gesichter der
      Gruppe klein auf einem Kreis, zusammen so groß wie ein Porträt. Dasselbe in der
      Sprechblase, wenn du den Gruppenmodus wählst, und im Glückwunschfenster. Gut erkennbar?
- [ ] N993. **Nach der Partie:** Gewinnst du eine Partie, leuchtet das Brett golden auf, über dem
      Schild „Gewonnen!“ sprühen ein paar Funken, dazu ein kurzer Dreiklang (bei Ton an). Bei
      Remis kommt nur das Schild, bei einer Niederlage wird das Brett kurz grau und das Schild
      sinkt etwas ab, ohne Ton. Passt das Maß?
- [ ] N996. **Rundgang:** Starte den Rundgang (Zahnrad › Hilfe › „Rundgang durch die App“) und auf
      einigen Seiten über das Toursymbol. Jeder Schritt zeigt auf das Richtige, auch die neuen
      Schritte zur Profilkarte, zum Reiter „Bots“, zur Wahl Engine oder Mensch und zu den
      Werkzeugen am Brett der Partie.
- [ ] N998. **Planbilanz-Übung:** Training › Planbilanz › Drei Planfragen, einige Runden. Bei „Wo
      spiele ich?“ ist keine Antwort mehr ein Satz über den Gegner. Fragen aus dem Buch (etwa
      „Warum spielt Weiß 9. Lc4 noch vor der langen Rochade?“) stehen unter der Überschrift
      „Eine Frage aus dem Buch zu Abb. …“ statt „Beantworte die Planfragen“.

### Neu in 0.2.143: Maia, Plan C, zwei Zahlensätze, acht Neulinge (Opus, 25.10.2026)

Deine Freigaben vom 25.10.2026: Maia als Komplettpaket, in den Einstellungen ausschaltbar; Plan C;
eine Neumessung mit und ohne Maia; die Gruppe Neuling auf acht Bots.

- [ ] N987. **Löschen:** Einstellungen › Bots › „Maia vom Gerät löschen“. Danach steht wieder
      „Laden“, und die Bots spielen ohne Maia (Zahlen wie ohne Maia).

### Neu in 0.2.131 und 0.2.132: Nutzungsprüfung (DS46 bis DS57, V1 bis V9, T1 bis T4) und deine Ergänzungen (Opus, 25.10.2026)

Deine Freigabe vom 25.10.2026 („Ja“ zu allem außer T5) und deine drei Ergänzungen dazu. Die
Vorschaubilder stehen im Artifact „Nutzungsprüfung“.

- [ ] N924. **Querformat in der installierten App (Android):** Die installierte App dreht sich mit
      dem Handy; quer erscheint das Querformat mit dem Brett links. (Wirkt erst nach dem
      nächsten Update der Installation; notfalls die App neu installieren.)
- [ ] N925. **Fehler melden:** Im Formular steht unter dem Häkchen „Angaben zum Gerät
      mitschicken“ eine Klappe „Was wird gesendet?“ mit den echten Werten (App-Version,
      Browser und Gerät, Bildschirm, Sprache; an einer Abbildung auch Nummer und Stellung). Der
      Satz darunter endet mit dem Link „Mehr in der Datenschutzerklärung“. Oben steht „Fehler im
      Buch“ jetzt ganz (darf zweizeilig sein), nicht mehr „Fehler im B…“.
- [ ] N935. **„Spielen“ schneller:** Unten auf „Spielen“ tippen: Der goldene Strich springt sofort
      dorthin, der Bildschirm folgt gleich. Zurück zu „Buch“ und wieder „Spielen“: spürbar
      schneller als vorher. „Beginnen“ wirkt sofort gedrückt, die Partie ist schneller da.

### Neu in 0.2.129: Spielen neu geordnet (DS38 bis DS45; Opus, 25.10.2026)

Deine Freigabe „Alles ja“ zu den Vorschlägen DS38 bis DS45, angepasst an den Stand 0.2.128
(Spinnennetz mit Stil-Mischung, Rücknahme bei den Spielhilfen).

- [ ] N906. **Bedenkzeit als Kacheln:** vier gleich große Kacheln je Zeile, groß die Zeit
      („3 + 2“), klein die Zeitklasse mit Zeichen (Blitz, Schnellschach, Klassisch). Aus einer
      eigenen Stellung kommt „∞ ohne Uhr“ dazu.

### Neu in 0.2.124: Admin-Dashboard, Fehler melden, Lichess-Links (R57; Opus, 24.10.2026)

- [ ] N744. **Aufgabe für Claude:** Der Knopf fasst rote und gelbe Prüfungen und alle offenen
      Meldungen als Auftrag zusammen und kopiert ihn. In einen neuen Chat einfügen genügt.

## Teil 2: Entscheiden

Bei den Wünschen der Arbeitsliste nimmt Claude zunächst die eigene Empfehlung und stellt sie dir
hier zur Prüfung („Schon umgesetzt, Widerspruch genügt“). Buchbefunde bleiben Rückfragen, weil
nur du das Buch änderst.

### Q8 Gamifizierung: Entscheidungen E2 bis E11 (31.10.2026)

Die Vorrecherche schlägt zu jeder offenen Frage eine Lösung vor. E1 (Speicherformat) hast du
entschieden: neue Felder mit neuer Formatversion. Die übrigen setze ich nach der Empfehlung um,
Widerspruch genügt:

- [ ] Q8-1. **Startseite (E2):** Die neuen Karten (nächster Schritt, Wochenziel, Rivale,
      Monatsrückblick, eigene Ziele) stehen oben auf der Buch-Startseite, höchstens zwei
      zugleich, statt auf einer eigenen sechsten Seite „Heute“. Schon vorbereitet in 0.3.18.
- [ ] Q8-2. **Lernpfad (E3):** eigener Bildschirm „Dein Weg durchs Buch“ mit einem Knopf über
      der Kapitelliste; die Kapitelliste bleibt.
- [ ] Q8-3. **Meisterschaft (E4):** Bronze, Silber, Gold je Thema bleiben, einmal erreicht, für
      immer; nach 60 Tagen ohne richtige Antwort steht leise „Zum Auffrischen“ daneben.
- [ ] Q8-4. **Wochenziel (E5):** Du wählst selbst 2 bis 7 Tage je Woche (vorgeschlagen 3); die
      Tagesserie bleibt im Trainer „Kurzpläne“. Verpasste Wochen werden nicht erwähnt.
- [ ] Q8-5. **Rivalen (E6):** Duell gewonnen beim ersten gewerteten Sieg; die Sprüche gibt es je
      Charakter der Bots, nicht je Bot (84 Bots wären zu viele Texte).
- [ ] Q8-6. **Teilen (E7):** nur Bilder deiner Orden, Abzeichen, Rekorde und Aufgaben aus freien
      Quellen, keine Abbildungen des Buches.
- [ ] Q8-7. **Extras (E8):** freischaltbar sind nur neue Dinge (Porträtrahmen, Brett „Nacht und
      Gold“, Figurensatz „Gold“, Zubehör, Titel, Konfettifarben); nichts, was heute frei ist,
      wird gesperrt.
- [ ] Q8-8. **Fundstücke (E9):** etwa 80 eigene kurze Texte (Schachgeschichte, Kuriositäten,
      Merksätze mit Fundstelle im Buch), Entwurf durch Claude; du liest sie später.
- [ ] Q8-9. **Feiereffekte (E10):** Schalter in den Einstellungen, Vorgabe an. Schon umgesetzt in
      0.3.18.
- [ ] Q8-10. **Eigene Ziele (E11):** höchstens drei angeheftet, ohne Ablaufdatum; Vorschläge nur
      aus echten Lücken (fehlende Bots, Übungen, Themen), sortiert nach Nähe zum Orden.

### Q7 Buchbefund Kapitel 8: Wann beginnt das Endspiel? (30.10.2026)

- [ ] Q7-1. **Endspiel ohne Materialgrenze:** Das Buch erkennt das Endspiel an vier Fragen
      (Damen vom Brett, Könige vor Mattangriff sicher, König kann ins Zentrum, Bauern entscheiden);
      überwiegt das Ja, ist es Endspiel. Danach wäre eine Stellung mit je zwei Türmen und zwei
      Leichtfiguren ohne Damen schon Endspiel. Schachexperten nennen das ein „damenloses
      Mittelspiel“: Speelman zählt erst ab höchstens 13 Punkten Figuren je Seite (ohne Bauern,
      etwa Turm, Turm und Läufer) zum Endspiel, Lichess ab höchstens sechs Figuren am Brett. In
      deinen eigenen Partien rechnet die App schon so (Entscheidung 12). An den Abbildungen gilt
      weiter das Buch. **Empfehlung:** In Kapitel 8 nach den vier Fragen einen Satz ergänzen, etwa:
      „Ohne Damen, aber mit vielen Figuren ist es noch ein damenloses Mittelspiel; zum Endspiel
      wird es, wenn je Seite höchstens etwa Turm, Turm und Leichtfigur übrig sind.“ Sag „Q7-1 ja“
      (dann gilt die Grenze auch an den Abbildungen) oder „Q7-1 nein“ (alles bleibt, wie es ist).

### Q6 Webverweise der App (30.10.2026)

Dein Wunsch vom 26.10.: prüfen, auf welche Webinhalte die App und die Trainingsseiten verweisen,
und ob sich davon etwas direkt in die App holen lässt. Ergebnis:

- **925 verschiedene Webadressen** stehen in den Daten und Texten der App. 876 davon sind Links
  auf die Lichess-Partien, aus denen die Aufgaben im Taktiktrainer, in „Falle oder Köder“ und im
  Endspieltrainer stammen. Die App speichert sie nur als Herkunft und zeigt sie nicht an. Eine
  Stichprobe von 25 war vollständig erreichbar.
- **Trainingsseiten** (13 Kapitel und der Werkzeugkasten): 32 Links auf 28 Ziele, davon 20 auf
  lichess.org. Dazu kommen syzygy-tables.info, schachbund.de, chessgames.com, 365chess.com,
  stockfishchess.org, encroissant.org, Lucas Chess, listudy.org, schach-tipps.de und
  schachtraining.de.
- **Texte der App:** Hier steht keine Adresse mit „https://“, nur Quellenangaben auf der
  Lizenzseite (13 GitHub-Projekte, dazu Lichess, chess.com, chessgoals.com, DiceBear, Draftbit,
  itch.io und ambientCG).
- **Buchdaten** (Abbildungen, Glossar, Kapiteltexte): keine einzige Webadresse.
- **Tot ist kein Verweis.** Alle 12 GitHub-Projekte gibt es noch. Harmlos umgeleitet werden
  365chess.com, chessgames.com und schachbund.de (jeweils auf „www.“), listudy.org (auf die
  englische Seite) und die Lichess-Aufgabenübersicht (ohne Anmeldung auf die Aufgabenseite).
  Auf eine fremde Domain wird nichts umgeleitet.
- **Doppelt:** syzygy-tables.info steht auf vier Seiten (Kapitel 8, 9, 10 und im
  Werkzeugkasten). Das ist gewollt, weil jedes Kapitel für sich steht.

Was frei ist und was sich einbauen lässt:

- Lichess-**Puzzles** und -**Partiedatenbank**: CC0 (database.lichess.org: „Database exports are
  released under the Creative Commons CC0 license.“). Ist schon eingebaut: Taktiktrainer,
  „Falle oder Köder“, Endspieltrainer, Eröffnungen nach Spielstärke.
- Lichess-**Eröffnungsnamen**: CC0, auch schon eingebaut.
- Lichess-**Übertragungen**: CC BY-SA 4.0 (database.lichess.org, Abschnitt Broadcasts:
  „Broadcast games are released under the Creative Commons Attribution-ShareAlike 4.0
  license.“). Von dir am 30.10. angenommen (Entscheidung 7), kommt mit „Zug erraten“.
- **Lernen, Koordinatentraining, Analysebrett, Stellung aufbauen, Puzzle Storm, Streak und
  Racer** sind Programmteile von Lichess unter AGPL-3.0 (github.com/lichess-org/lila: „Lila is
  licensed under the GNU Affero General Public License 3 or any later version“). Abschreiben
  wäre rechtlich möglich, lohnt sich aber nicht: Die App hat für das Wichtigste eigene Trainer.
- **Lichess Practice und Studien:** Dafür gibt es keine ausdrückliche Lizenz, die Studien gehören
  ihren Autoren. Also nur verlinken.
- **Tablebase** (syzygy-tables.info): Die Tafeln bis fünf Steine sind zusammen knapp 1 GB groß,
  offline passt das nicht in die App.
- **Andere Seiten** (Partiedatenbanken, Programme, Schachbund, Trainingsseiten): nur verlinken.

- [ ] Q6-1. **„In der App“ neben Lichess.** Wo eine Übung ein Lichess-Werkzeug nennt, für das
      die App einen eigenen Trainer hat, steht hinter dem Lichess-Link jetzt „In der App: …“ mit
      einem direkten Sprung in diesen Trainer. Das betrifft drei Fälle: Koordinatentraining →
      Koordinatentrainer, Aufgabenthemen → Taktiktrainer, Lichess Practice (Mattvarianten,
      Turmendspiele) → Endspieltrainer. Der Text der Übungen bleibt, wie er im Buch steht.
      Schon umgesetzt, Widerspruch genügt.
- [ ] Q6-2. **Linkprüfung schärfer.** Die wöchentliche Prüfung im Dashboard prüft jetzt auch die
      Quellen auf der Lizenzseite und meldet gelb, wenn eine Adresse auf eine fremde Domain
      umleitet (etwa eine abgelaufene Domain mit Parkseite, die sonst als „erreichbar“ durchgeht).
      Die 876 Partielinks prüft sie absichtlich nicht jede Woche, das wären zu viele Abrufe bei
      Lichess. Schon umgesetzt, Widerspruch genügt.
- [ ] Q6-3. **Keine Änderung an den Adressen.** Die Umleitungen auf „www.“ und die englische
      Seite von listudy.org schaden nicht, deshalb lasse ich die Adressen, wie sie im Buch stehen.
      Schon so entschieden, Widerspruch genügt.
- [ ] Q6-4. **Buchbefund, klein:** Der Trainingskasten in Kapitel 0 schreibt
      „www.schachbund.de“, der Werkzeugkasten in Kapitel 12 „schachbund.de“. Beide Adressen
      funktionieren. Willst du die Schreibweise im Buch vereinheitlichen? Kein toter Link im Buch.
- [ ] Q6-5. **Später, nur Empfehlung: Tablebase online im Endspieltrainer.** Ein Knopf
      „Tablebase“, der eine Endspielstellung mit bis zu sieben Steinen bei der freien
      Lichess-Tablebase nachschlägt (nur mit Netz). Das ändert die Datenschutzerklärung, weil die
      Stellung an Lichess geht. Deshalb baue ich es erst nach deinem Ja. Möchtest du das?

### Q5 Weitere Ideen aus der Recherche (30.10.2026, noch nicht beschlossen)

Beschlossen und in Arbeit sind schon: Lichess-Aufgaben als Zusatzaufgaben, berühmte Partien und
Turnierpartien für „Zug erraten“, Erfahrungspunkte und Abzeichen, die Tagesserie, die nicht mehr
verfällt. Übrig aus der Recherche bei Lichess, chess.com und Chessly:

- [ ] Q5-1. **Weitere Trainingsformen (Empfehlung, noch nicht gebaut):** (a) „Nochmal versuchen“
      an den Schlüsselzügen der Partieauswertung, mit einem Hinweis aus der Denkroutine statt einer
      KI (wie bei chess.com). (b) Aufgabenserie ohne Uhr: Ein Fehler beendet die Serie, dein
      Bestwert bleibt nur auf deinem Gerät (wie „Puzzle Streak“ bei Lichess). (c) Eine Abbildung
      mit Ziel gegen die Engine ausspielen („halte Remis“, „setze matt“). (d) Ein ruhiger
      Monatsrückblick nur auf deinem Gerät (Gelerntes, stärkstes und schwächstes Thema, ein
      nächster Schritt mit Kapitel) und Stärken und Schwächen nach Buchthema mit Sprung in die
      passende Übung. Sag, welche davon du willst („Q5-1 a, c“), dann baue ich sie.

### Q3 Eröffnungspaket, Stufe 1: die Datenfrage (30.10.2026)

Ergebnis: Wir brauchen keine neue Quelle. Die App hat seit dem Praxisbuch (0.2.128) einen ganzen
Monat der Lichess-Datenbank ausgezählt (September 2026, rund 37 Millionen gewertete Partien in
Blitz, Schnellschach und Klassisch). Lizenz CC0, also frei ohne Bedingungen; die Namen der
Eröffnungen kommen aus der freien Lichess-Liste (ebenfalls CC0). Gezählt sind die ersten 20
Halbzüge je Zeitklasse und je 200er-Band von 400 bis 2800. Daraus ist jetzt eine Liste mit 46
Eröffnungen entstanden: je Band die häufigsten zwölf für Weiß und für Schwarz, jede mit Anteil
je Band, den 20 häufigsten Varianten und den Marken „Gambit“ und „im Buch (Abschnitt …)“, dazu
die 40 häufigsten Gambits. Ein paar Zahlen (Anteil an allen Partien des Bandes):

- Weiß um 600: Läuferspiel 3,1 %, Wayward Queen (frühes Dh5) 2,3 %, Italienisch 1,7 %. Um 1200:
  Italienisch 2,9 %, Läuferspiel 2,0 %, London 2,0 %. Um 1800: Damengambit 2,3 %, Englisch
  2,0 %, London 1,7 %. Um 2400: Englisch 2,9 %, Damengambit 2,7 %, Spanisch 1,4 %.
- Schwarz um 600: Skandinavisch 3,4 %, Russisch (Petroff) 2,1 %, Französisch 1,7 %. Um 1200:
  Skandinavisch 3,4 %, Sizilianisch 3,2 %, Französisch 2,7 %. Ab 1800 führt Sizilianisch klar
  (6,8 %, um 2400 8,6 %), dann Französisch und Caro-Kann.
- Gambits um 800: Englund-Gambit, Busch-Gass-Gambit, Königsgambit; um 1800: Königsgambit,
  Englund-Gambit, Smith-Morra-Gambit.

- [ ] Q3-1. **Festlegungen (schon umgesetzt, Widerspruch genügt):** Eine „Eröffnung“ ist die
      Familie nach Lichess (Name vor dem Doppelpunkt, etwa „Sizilianische Verteidigung“). Bei
      Sammelnamen, die nur den ersten Zug beschreiben („Damenbauernspiel“, „Königsbauernspiel“),
      zählt der Teil danach, also „London-System“ oder „Wayward Queen“; bloße „Normal
      Variation“ zählt nicht. London mit 2. Lf4 („Accelerated London“) ist London (Buch 2.8).
      Verteidigungen (auch „abgelehnt“, „angenommen“, „Gegengambit“) wählt Schwarz, sonst die
      Seite des letzten Zuges. Das Damengambit gilt nicht als Gambit, wie im Buch. Gezählt wird
      im Band dessen, der zieht; beide Spieler einer Partie liegen meist im selben Band.
- [ ] Q3-2. **Rest des Eröffnungspakets:** Eröffnungen nach Spielstärke, Variantenbaum und
      Gambits sind gebaut (0.3.10, 0.3.11), feste Eröffnungen für eigene Bots mit Regler
      „Abweichung“ sind in Arbeit. Offen bleiben die Schnellwahl im Variantenbaum (alle, die
      häufigsten 3 …) für den Repertoire-Trainer und weitere Fallen für „Falle oder Köder“. Die
      Fallen brauchen zuerst eine Definition, die du freigibst. Empfehlung: Eine Falle ist ein
      Köderzug, der nicht der beste ist und die Stellung deutlich verschlechtert, es sei denn,
      der Gegner antwortet mit dem naheliegenden falschen Zug (Schlagreflex, übersehene Gabel);
      „naheliegend“ heißt: Menschen seiner Stärke spielen ihn laut Lichess häufig. Einverstanden?

### Q2 Eigene Bots: freie Beschreibung? (30.10.2026)

- [ ] Q2-1. **Eigener Text statt Vorschlag:** Die Beschreibung eigener Bots entsteht jetzt bei
      jedem Zeigen aus den Einstellungen und wird nicht gespeichert. Ein Feld, in dem du den
      Vorschlag selbst umschreibst, bräuchte ein neues Feld im Speicher deiner Leser; deshalb
      warte ich damit auf dich. Empfehlung: erst einmal ohne freies Feld, weil der Text sich
      sonst nicht mehr mit den Reglern ändert. Möchtest du das Feld trotzdem?

### Q1 Befunde der Nachsicht im Code (26.10.2026, nur gelesen, nichts geändert)

Antworten auf deine Fragen aus der Ideensammlung. Wo ein Vorschlag steht, ist er noch nicht
umgesetzt; Widerspruch genügt.

- [ ] Q1-1. **Plus-Symbol in der Partieauswertung:** Es gibt es, aber es sieht nicht wie ein
      Plus aus. Beim Nachspielen einer Partie (Rückblick) stehen unter der Karte zum gezeigten
      Zug zwei aufklappbare Zeilen: „In die Fehlerdatenbank“ und „In die Lernsammlung“. Das
      Lesezeichen mit Plus (wie an den Abbildungen im Buch) gibt es dort nicht, deshalb hast du
      es vermisst. Die Eröffnung füllt die App in der Lernsammlung schon vor. Vorschlag: Beide
      Zeilen durch ein Lesezeichen-Symbol neben der Karte ersetzen, das ein gemeinsames Fenster
      öffnet (beschlossen, siehe Entscheidungen).
- [ ] Q1-6. **Kürzere Trainingspläne:** Im Buch gibt es nur den 30-Minuten-Plan (Tag A
      Partietag 5 + 20 + 5 Minuten, Tag B Studientag 5 + 15 + 10 Minuten, Kapitel 12). Der
      Satz zu wenig Zeit lautet: „Hast du weniger Zeit, kürze zunächst das Themenstudium, nie
      die Analyse.“ Weitere Pläne stehen nicht im Buch. Die App setzt den 30-Minuten-Plan in
      `training/dreissigminuten.ts` um (zwei Tagesarten, je drei Schritte mit fester Dauer,
      Stand auf dem Gerät). Ein Kurzplan müsste von der App stammen und nicht vom Buch; er
      wäre ein neuer Entwurf und gehört zu dir als Autor, weil das Buch die Quelle ist.
- [ ] Q1-7. **Wertungsumrechnung:** Die eigene Wertung der App liegt auf dem Maßstab von
      Lichess, je Zeitklasse (Blitz, Schnellschach, Klassisch). Daneben zeigt die App
      „entspricht etwa“: Blitz und Schnellschach auf chess.com, Klassisch auf FIDE. chess.com
      hat keine Wertung für Klassisch, deshalb nimmt Klassisch die FIDE-Liste; sie gilt erst ab
      etwa 1730 Lichess Klassisch. Die Zahlen stammen aus dem Wertungsvergleich von
      chessgoals.com (Juli 2026, Selbstangaben, spiel/umrechnung-daten.ts). Eine Umrechnung
      von Klassisch auf chess.com gäbe es nur über den gemeinsamen Blitzwert; die Streuung wäre
      groß, ein Bereich statt einer Zahl wäre dann ehrlicher. Der Punkt E4 weiter unten betrifft
      dasselbe.

### R57 Dashboard: Einrichtung und Empfehlungen (24.10.2026)

- [ ] DB2. **Turnstile vorerst nicht eintragen:** Empfehlung: Den Turnstile-Secret-Key noch nicht
      in Cloudflare eintragen. Gegen Massenmeldungen genügt vorerst die Drossel (höchstens fünf
      Meldungen je Verbindung und Stunde). Turnstile würde ein Skript von Cloudflare in die App
      laden; die Datenschutzerklärung sagt bisher ausdrücklich, dass keine Inhalte anderer Anbieter
      geladen werden. Kommt Spam, baue ich Turnstile ein (Formular, Datenschutzerklärung) und du
      trägst dann den Secret-Key als `TURNSTILE_SECRET` ein. Schon so umgesetzt, Widerspruch genügt.
- [ ] DB3. **Aufbewahrung:** Meldungen löscht der Worker spätestens zwölf Monate nach Eingang
      (täglich um 6:17 UTC), die Zähler der Drossel (nur ein Prüfwert aus IP-Adresse und Datum)
      nach einem Tag. So steht es auch im neuen Abschnitt „Meldungen aus der App“ der
      Datenschutzerklärung. Schon umgesetzt, Widerspruch genügt.
- [ ] DB4. **Mailversand (optional, jederzeit):** Für eine Mail bei jeder neuen Meldung und die
      Wochenübersicht montags: Konto bei resend.com, Domain hinzufügen, die angezeigten
      DNS-Einträge in Cloudflare › DNS eintragen, einen API-Schlüssel erzeugen und in Cloudflare
      (wie bei DB1) drei Secrets anlegen: `RESEND_KEY` (der Schlüssel), `MAIL_AN` (deine Adresse),
      `MAIL_VON` (etwa `Dashboard <dashboard@schach-von-grund-auf.com>`). Ohne Mailversand meldet
      GitHub rote Prüfungen trotzdem per Mail.
