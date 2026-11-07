# Schach-Abenteuerspiel – Prüfung, Vorschläge und Projektplan

Stand: 07.11.2026

Das Konzept trägt, aber in der heutigen Form ist es für einen Berufstätigen etwa doppelt so groß, wie es sein sollte. Empfehlung: in Staffeln bauen, die erste mit vier Clubs, und vor allem anderen eine spielbare erste Stadt. Grundlage ist die Konzeptsammlung (01_Konzeptsammlung.md).

## Durchsicht des Chats

Beim erneuten Durchgehen aller Überlegungen aus dem Sprachchat habe ich Folgendes gefunden und unten entsprechend korrigiert oder ergänzt.

**Verworfen oder relativiert**

- Die fiktionalisierte Carlsen-Biografie bleibt verworfen (Persönlichkeitsrecht). Der Geist-Mentor ist die bessere Lösung, weil er erklären darf, ohne Lehrer zu wirken.
- Der Doppelzug-Joker und die eigene Extra-Dame bleiben draußen. Beide sind kein Schach mehr; Vorgaben (Gegner spielt ohne Figur) sind dagegen eine echte Tradition.
- Die Vergleichsspiele (Chess Lore, Chessaria, Super Chesslike Adventure, RPG Chess) stammen aus Suchtreffern, nicht aus geöffneten Seiten. Die Einordnung ist deshalb ungefähr, die Lücke „echtes Schach, Kinder, Lernspiel“ ist aber plausibel.

**Widersprüche in meinen eigenen Entwürfen**

- Spielzeit: Im Chat sagte ich 8 bis 15 Stunden, im Entwurf 15 bis 20. Der Unterschied erklärt sich dadurch, dass die Schachpartien selbst die meiste Zeit füllen (siehe Prüfung). Unten eine saubere Rechnung.
- Club 5 ist die Akademie des Konzerns, also des Gegners. Dass der Held dort einen Orden gewinnt, muss erzählerisch begründet werden: Dr. Lin ist eine ehrliche Trainerin innerhalb des Konzerns, die später die Seite wechselt.
- Die Liga-Qualifikation (5 Silber, 6 Gold) war willkürlich; unten ein konsistentes Punktesystem.
- Nicht geregelt waren: Remis gegen einen Clubchef, erzwungene Niederlagen in der Story (Victor zu Beginn), Bedenkzeit, und was nach einer Niederlage passiert. Alles unten ergänzt.

**Neu bedacht**

- Testen mit eigenen Schülern: Als Lehrer darfst du im Dienst nicht für ein eigenes Produkt werben; auch ein kostenloses Spiel, das dein Buch bewirbt, kann darunter fallen (Niedersachsen: Dienstrecht, Nebentätigkeit, Werbung in der Schule). Das ist keine Rechtsberatung, aber vor dem Testen in der Klasse solltest du das mit der Schulleitung klären. Sicherer sind Tests mit Kindern aus Familie, Freundeskreis oder Schachverein.
- iOS löscht bei Web-Apps gespeicherte Daten, wenn eine Seite rund sieben Tage nicht genutzt wird; installierte PWAs sind davon ausgenommen. Spielstand-Export ist deshalb Pflicht, nicht Kür.
- Der Umfang ist der wichtigste Punkt des ganzen Dokuments: Pokémon Rubin/Saphir entstand mit einem Team über Jahre. Für einen Berufstätigen mit wenigen Stunden pro Woche braucht das Projekt eine Staffel-Struktur, sonst wird es nie fertig.

## 1. Zusammenfassung des Konzepts

Ein kostenloses Story-Schachspiel als optionaler Download in der bestehenden Schach-App (PWA, TypeScript, offline). Es dient als Werbung für das Schachbuch: Kinder ab etwa 10 Jahren und Jugendliche sollen es weitergeben, nebenbei echtes Schach lernen, die übrigen App-Funktionen entdecken und Interesse am Buch bekommen.

- **Vorbilder:** Struktur der Pokémon-Spiele (Game Boy Advance) und Erzählweise von Hikaru no Go.
- **Setting:** Gegenwart, fiktiver US-Bundesstaat, Highschool-Schachteams; Held/Heldin (14) zieht nach Maple Falls.
- **Figuren:** Geist Ambrose (Meister um 1860, wohnt in einem alten Brett, erklärt die Buchlektionen, hat eigenen Entwicklungsbogen: Wunsch nach der unsterblichen Partie, Versuchung durch die KI, Loslassen); Rivale Victor (Schachfamilie, Druck, zeitweise auf Konzernseite, Urenkel von Ambroses Rivalen); Konzern Perfect Move Inc. mit der KI ZERO, der Clubs aufkauft und schummelt.
- **Ablauf:** 8 Clubs in 12 Orten, je ein Buchthema pro Club, Aufgaben vor dem Clubkampf, Orden in Gold/Silber/Bronze je nach Hilfen, Landesmeisterschaft als Finale, Weltmeisterschaft in Ligen als Post-Game mit zweitem Durchlauf und neuen Dialogen.
- **Hilfskarten:** sammelbar und tauschbar (QR-Code, lokal), vom Geist als Lernbelohnung vergeben, in drei Stufen; Gegner werden nie heimlich geschwächt, nur sichtbar über Vorgaben oder Story-Ablenkung.
- **Vier Akte:** Ankunft, Aufstieg, Krise (Vorwurf „du schummelst selbst“, Held spielt ohne Geist), Finale (Held und Geist gemeinsam gegen ZERO, faires Duell mit Victor, Abschied des Geistes).
- **Technik:** vorhandene Bots und einstellbare Engine als Rückgrat; Phaser, LimeZu-Pixelgrafik, Tiled-Karten; Welt soll weitgehend von Claude gebaut werden; Größe eher 30 bis 100 MB.

## 2. Kritische Prüfung

### 2.1 Umfang: zu groß für den Alleingang, aber gut teilbar

Die Kernerkenntnis: In diesem Spiel kommt die Spielzeit nicht aus der Welt, sondern aus den Partien. Eine Clubpartie dauert bei Kindern 20 bis 40 Minuten, eine Straßenpartie 10 bis 20. Rechnung für 8 Clubs: 8 Clubpartien (ca. 4 Std.), 24 Straßen- und Nebenpartien (ca. 6 Std.), Aufgabenreihen (ca. 2 Std.), Story, Laufen, Dialoge (ca. 3 Std.), Landesmeisterschaft (ca. 3 Std.). Das sind rund 18 Stunden, wobei nur etwa 3 Stunden davon „Pokémon-Inhalt“ sind. Das ist der große Vorteil gegenüber einem echten Rollenspiel.

Trotzdem ist der Inhalt für einen Alleingang groß. Grobe Schätzung des Eigenaufwands (Stunden, in denen du selbst prüfen, entscheiden, testen und freigeben musst, auch wenn Claude das meiste schreibt und baut):

| Baustein                                                      | Deine Zeit       |
| ------------------------------------------------------------- | ---------------- |
| Story, Figuren, Drehbuch mit allen Dialogen (8 Städte)        | 60–100 Std.      |
| Prototyp, Schnittstelle zur Bot-Engine, Spielsystem           | 40–70 Std.       |
| Kachelsystem, Weltgenerator, 12 Karten prüfen und nachbessern | 50–90 Std.       |
| Quests, Aufgabenreihen, Gegnerprofile, Balance                | 40–60 Std.       |
| Porträts, Musik, Sound, Lizenzen                              | 20–40 Std.       |
| Tests mit Kindern, Fehlerbehebung, Veröffentlichung           | 40–60 Std.       |
| **Summe**                                                     | **250–420 Std.** |

Bei 4 bis 6 Stunden pro Woche sind das ein bis zwei Jahre. Das ist machbar, aber nur, wenn das Projekt in Etappen fertig wird, die jede für sich veröffentlicht werden können. Deshalb die Empfehlung in Abschnitt 3: Staffel 1 mit vier Clubs, erst danach entscheiden, ob Staffel 2 folgt.

Weitere Risiken beim Umfang:

- **Niederlagen kosten viel Zeit.** Wer eine 30-Minuten-Partie verliert, muss sie wiederholen. Bei Pokémon dauert ein verlorener Kampf fünf Minuten. Ohne Gegenmaßnahmen ist das der häufigste Grund, das Spiel abzubrechen.
- **Tempo.** Zwölf volle Partien hintereinander ermüden. Straßengegner sollten überwiegend Kurzformate sein (Mattaufgaben, „gewinne diese Stellung“, 10-Züge-Duelle).
- **Zwölf Karten mit Innenräumen** sind viel. Pro Stadt eine Außenkarte und zwei bis drei Innenräume reichen; Pokémon-Städte sind klein.

### 2.2 Lernverknüpfung: funktioniert nur, wenn das Spiel ohne Buch beendbar ist

- Das Spiel muss **ohne das Buch** vollständig spielbar sein. Sonst ist es kein Werbemittel, sondern eine Paywall, und Kinder ohne Buch geben es nicht weiter. Das Buch wird zur Vertiefung („Im Buch steht dazu Abschnitt 4.3“), nicht zur Voraussetzung.
- Die Lektionen muss Ambrose **im Spiel** halten, in kleinen Häppchen (zwei bis drei Bildschirme), direkt vor der Stellung, in der sie gebraucht werden. Reines Vorlesen des Kapitels wird weggeklickt.
- Die Aufgabenreihen vor dem Clubkampf sind richtig, sollten aber kurz sein (5 bis 8 Aufgaben) und in der Welt verankert (die Clubmitglieder stellen sie dir, nicht ein Menü).
- Sinnvoller Lerneffekt entsteht vor allem durch die **Partieanalyse danach**: zwei Schlüsselmomente mit Ambrose-Kommentar. Das hat die App vermutlich schon in Grundzügen.
- Risiko Reihenfolge: Bauernstruktur und Pläne (Club 6) vor Angriff und Opfern (Club 7) vor Endspielen (Club 8) ist didaktisch vertretbar, aber Endspiele sind für Zehnjährige trocken. Vorschlag: Club 8 als „Endspiele mit Ambrose-Geschichte“ erzählen (die Partie, die er nie zu Ende spielen konnte, endete im Endspiel).

### 2.3 Zielgruppe und Eltern

- Die Themen Leistungsdruck, Betrug, ein Geist und sein Abschied, ein Vater, der zu viel verlangt: Das ist Kinderbuchniveau und für 10+ unproblematisch, wenn es ohne Gewalt und ohne Erwachsene erzählt wird, die Kinder demütigen. Victors Vater sollte überfordert sein, nicht böse.
- Die Länge der Partien ist für Zehnjährige die größere Hürde als die Story. Einstellbare Bedenkzeit und kurze Formate sind Pflicht.
- Für Eltern braucht es eine sichtbare Lernübersicht („Dein Kind kann jetzt: Gabel, Fesselung, Matt mit Turm“) und eine Startseite, die in einem Satz sagt: kein Konto, keine Werbung, keine Käufe, keine Chats mit Fremden.
- Mundpropaganda unter Kindern braucht etwas Zeigbares: die Kartensammlung, die Orden, ein Profilbild. Ohne das gibt es nichts zu erzählen.

### 2.4 Datenschutz und Jugendschutz

- Keine Konten, keine Server, keine Analytik: damit fallen DSGVO-Einwilligungen für Kinder weg. Sobald Telemetrie oder Online-Tausch eingebaut wird, braucht es Einwilligung der Eltern (unter 16 in Deutschland). Also: nicht einbauen.
- Tausch per QR-Code und Freundschaftsduell am selben Gerät sind unkritisch, weil keine Daten das Gerät verlassen außer der Karte selbst.
- Trotzdem braucht die Website ein Impressum und eine Datenschutzerklärung, auch wenn sie nur sagt, dass nichts gespeichert wird. Cloudflare verarbeitet IP-Adressen beim Ausliefern; das gehört in die Erklärung.
- Ein Freitext-Feld für den Spielernamen ist der einzige Ort, an dem Kinder etwas Persönliches eingeben. Es bleibt lokal; ein Hinweis „nur Vorname oder Spitzname“ genügt.

### 2.5 Lizenzen

| Material                                                   | Stand                                                                                              | Was zu tun ist                                                                                                                                                                               |
| ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| LimeZu Modern Interiors / Exteriors (Vollversion, itch.io) | Nutzung in kommerziellen Projekten laut Seite erlaubt, Namensnennung nötig, Weiterverkauf verboten | Vollversion kaufen, Lizenztext beim Kauf speichern, Credits im Abspann                                                                                                                       |
| Phaser                                                     | MIT                                                                                                | Lizenzhinweis im Abspann                                                                                                                                                                     |
| inkjs oder Yarn Spinner (Dialoge)                          | MIT                                                                                                | Lizenzhinweis                                                                                                                                                                                |
| Pixel-Schriften                                            | je nach Schrift                                                                                    | nur SIL-OFL- oder CC0-Schriften verwenden                                                                                                                                                    |
| Musik und Sounds                                           | offen                                                                                              | CC0/CC-BY von OpenGameArt oder Kevin MacLeod (CC-BY) oder selbst erzeugt; KI-Musikdienste nur, wenn der Tarif kommerzielle Nutzung erlaubt                                                   |
| KI-Porträts                                                | offen                                                                                              | Nutzungsbedingungen des Dienstes prüfen; KI-Bilder genießen in Deutschland und den USA voraussichtlich keinen Urheberschutz, andere dürfen sie also kopieren; für dich ist das Risiko gering |
| Namen                                                      | offen                                                                                              | „Perfect Move“ und „ZERO“ auf bestehende Marken prüfen; Pokémon, Hikaru no Go, reale Großmeister nirgends nennen                                                                             |

Grundregel: Ein kostenloses Spiel, das ein Buch bewirbt, zählt mit hoher Wahrscheinlichkeit als kommerzielle Nutzung. Also nur Material verwenden, das kommerziell erlaubt ist. Das ist keine Rechtsberatung.

### 2.6 Technik

- **Phaser ist richtig, aber nicht alternativlos.** Das Spiel braucht nur: Kacheln zeichnen, eine Figur laufen lassen, Kollision, Dialogfenster, Übergang zur Schachansicht. Das könnte ein eigener Canvas-Renderer in 500 Zeilen auch. Phaser bringt Tiled-Import, Kamera und Animationen fertig mit, kostet rund 1 MB. Empfehlung: Phaser, weil es Zeit spart; die Schachpartie selbst läuft in der vorhandenen Brettansicht der App, nicht in Phaser.
- **Schnittstelle zur Bot-Engine fehlt im Konzept.** Das Spiel muss eine Partie mit einem Gegnerprofil (Stärke, Fehlerrate, Eröffnungen, Motive, Stil, Zustand „abgelenkt“) starten und am Ende Ergebnis, eingesetzte Karten und Schlüsselmomente zurückbekommen. Das ist der wichtigste Architekturbaustein und gehört vor den Prototyp.
- **Optionaler Download in einer PWA:** machbar über ein getrennt gebündeltes Modul (dynamischer Import) und einen eigenen Cache im Service Worker. Die Größe liegt bei 30 bis 100 MB, davon Musik der größte Teil. Speicherkontingente auf iOS sind knapp; Musik komprimiert (Ogg/AAC, kurze Loops) halten.
- **Weltgenerator durch Claude:** Das klappt nur mit einem Katalog, der jede verwendete Kachel benennt, und mit vorgefertigten Bausteinen (Klassenzimmer, Straßenecke, Park). Rechne damit, dass jede Karte zwei bis drei Korrekturrunden braucht. Screenshot-Prüfung in Claude Code ist mit Playwright möglich.
- **Spielstand:** IndexedDB plus Export als Datei oder QR. Ohne Export gehen bei Gerätewechsel oder Browser-Bereinigung Stunden verloren.

### 2.7 Story- und Regel-Logik

- **Erzwungene Niederlage gegen Victor** zu Beginn: Der Spieler darf das nicht als unfair erleben. Lösung: Die Partie beginnt in einer bereits schlechten Stellung („du hast schon zwei Figuren verloren, Ambrose übernimmt die Erzählung“), oder Victor spielt sehr stark und die Story geht in beiden Fällen weiter, mit zwei Dialogvarianten.
- **Remis** gegen Clubchefs: zählt als Bronze mit der Aufforderung, es erneut zu versuchen. Gegen Straßengegner zählt Remis als Sieg.
- **Niederlage**: Ambrose zeigt den entscheidenden Fehler, der Gegner bekommt beim nächsten Versuch eine leicht höhere Fehlerrate (sichtbar: „Er ist überheblich geworden“). So bleibt es ehrlich und trotzdem schaffbar.
- **Liga-Qualifikation** als Punkte: Gold 3, Silber 2, Bronze 1. Bronze-Liga ab 8 Punkten, Silber-Liga ab 16, Gold-Liga ab 22 (von 24).
- **Mentor-Zug** als Karte widerspricht leicht der Story-Linie „Held schummelt mit dem Geist“. Das ist kein Fehler, sondern der Stoff für Akt 3: Die Karte wird erst nach der Versöhnung wieder freigegeben, und wer sie im Finale nicht benutzt, bekommt einen Extra-Abspann.
- **Club 5 beim Konzern:** Dr. Lin muss als ehrliche Trainerin eingeführt werden, die später beim Aufdecken hilft. Sonst ist ein Orden vom Gegner unglaubwürdig.
- **Bedenkzeit:** im Hauptspiel keine Uhr; nur der „Zeitdruck-Spezialist“ in der Landesmeisterschaft spielt mit Uhr, und die Karte „Zeitbonus“ gibt es nur für ihn.

## 3. Ergänzungen und Vorschläge

Kennzeichnung: **[Dein Konzept]** = aus dem Chat, **[Mein Vorschlag]** = neu von mir.

### 3.1 Struktur: Staffeln statt eines großen Wurfs [Mein Vorschlag]

- Staffel 1 = Akt 1 und 2: Maple Falls, Cedar Creek, Riverton, Ironwood (4 Clubs, 5 Orte, ca. 8 Std.). Endet mit einem Cliffhanger: Perfect Move kauft Ironwood, Victor lädt zum Turnier in Silicon Bay.
- Staffel 2 = Akt 3 und 4 mit Landesmeisterschaft. Post-Game erst mit Staffel 2.
- Vorteile: Jede Staffel ist ein Anlass für Mundpropaganda („Staffel 2 ist da“), der optionale Download passt natürlich dazu, und man kann nach Staffel 1 abbrechen, ohne dass das Spiel unfertig wirkt.
- Die Story-Tabelle aus der Konzeptsammlung bleibt gültig, nur der Schnitt kommt dazu.

### 3.2 Story und Figuren

- **[Dein Konzept]** Geist mit eigenem Bogen, Rivale aus Schachfamilie, Konzern mit KI, Hikaru-no-Go-Emotionen.
- **[Mein Vorschlag]** Ambrose als fiktiver Zeitgenosse von Paul Morphy (New Orleans, 1850er). Das verankert ihn in der echten amerikanischen Schachromantik, ohne eine reale Person zu verwenden; Morphy darf als historische Figur erwähnt werden.
- **[Mein Vorschlag]** Ambroses Rivale hieß „der Ingenieur“, ein nüchterner Positionsspieler. Victors Familie trägt denselben Namen; der Vater ist ebenfalls Ingenieur bei Perfect Move. Der Konflikt Romantik gegen Berechnung zieht sich so durch beide Generationen und wird am Ende aufgelöst: Beides gehört zusammen.
- **[Mein Vorschlag]** Die Mutter als heimliche Schachspielerin, die aufgehört hat. Nebenstory in Ironwood: Sie spielt eine Partie gegen den Helden, danach fährt sie zu den Turnieren mit. Gibt der Familie Gewicht und Eltern eine Identifikationsfigur.
- **[Mein Vorschlag]** Die beste Freundin bzw. der beste Freund führt das „Clubtagebuch“, in dem Orden, Karten und Gegnerprofile stehen. So hat das Menü einen Erzähler.
- **[Mein Vorschlag]** Der Konzern bekommt ein Gesicht: die jugendliche Werbefigur „Nova“, Highschool-Champion mit Vertrag bei Perfect Move, die zuerst glänzt und sich später als Opfer des Systems herausstellt (sie wurde gezwungen zu schummeln). Das ist die Gegenfigur zu Victor.

### 3.3 Nebenaufgaben

- **[Dein Konzept]** Alltagsprobleme mit Schachbezug, Ablenkungs-Nebenstories, Buchaufgaben als Quests.
- **[Mein Vorschlag]** Drei feste Quest-Typen, damit die Produktion planbar bleibt: (a) Stellungsrätsel aus der Welt („Der Bibliothekar hat eine Partie liegen lassen: Weiß am Zug gewinnt“), (b) Hilfe-Quests mit Dialog und Belohnung, (c) Begegnungs-Quests, die Gegner verändern (analysiert oder abgelenkt). Pro Stadt eine von jedem Typ reicht.
- **[Mein Vorschlag]** Sammelbare „Partiefragmente“ von Ambroses alter Partie: In jeder Stadt findet man einen Teil; in Ghost Town setzt man sie zusammen und spielt sie nach. Das ist das Hikaru-no-Go-Gefühl und gleichzeitig eine Lektion.

### 3.4 Hilfskarten und Belohnung

- **[Dein Konzept]** Karten als Sammelobjekt, drei Stufen, Orden je nach Karteneinsatz, Vorgaben statt heimlicher Schwächung.
- **[Mein Vorschlag]** Jede Karte hat ein Pixel-Bild und einen Ambrose-Spruch; die Sammlung ist als „Album“ zeigbar. Das ist das Element, über das Kinder reden.
- **[Mein Vorschlag]** Zwei Kartensorten statt Verbrauch: dauerhafte Karten (einmal pro Partie, unbegrenzt oft) und Verbrauchskarten (selten, stark). Dauerhafte Karten verhindern, dass Anfänger ohne Hilfe dastehen.
- **[Mein Vorschlag]** „Ambroses Notiz“ als Belohnung nach jeder Clubpartie: eine Karte, die die Stellung des Schlüsselmoments zeigt. Keine Spielwirkung, nur Sammeln und Lernen.
- **[Mein Vorschlag]** Karten nur mit eigenem Pixel-Stil, keine Anleihen bei Pokémon- oder Yu-Gi-Oh!-Layouts.

### 3.5 Wiederspielwert

- **[Dein Konzept]** Ligen, zweiter Durchlauf mit stärkeren Clubchefs und neuen Dialogen.
- **[Mein Vorschlag]** Tägliche Aufgabe von Ambrose (eine Stellung, lokal erzeugt) mit Serie; das bringt Kinder täglich zurück, ohne Server.
- **[Mein Vorschlag]** „Revanche-Modus“ für jeden besiegten Clubchef mit frei wählbarer Stärke; das ist der sanfte Übergang in die Trainings-Funktionen der App.

### 3.6 Verbreitung unter Kindern

- **[Dein Konzept]** Mundpropaganda, kostenlos, Tausch per QR.
- **[Mein Vorschlag]** „Freundeskarte“: ein QR-Code im Spiel, der direkt zur Installation führt und dem Freund eine Starterkarte schenkt. Das ist das wichtigste Verbreitungswerkzeug und kostet fast nichts.
- **[Mein Vorschlag]** Teilen von Orden und Album als Bild (Screenshot-Funktion), damit es in Klassenchats landet.
- **[Mein Vorschlag]** Schach-AGs und Vereine als Multiplikatoren ansprechen; dort darf ein Vereinstrainer empfehlen, was ein Lehrer in der eigenen Schule nicht darf.
- **[Mein Vorschlag]** PWA-Installation auf iOS ist für Kinder umständlich (Teilen-Menü, „Zum Home-Bildschirm“). Eine bebilderte Anleitung im Spiel und auf der Website ist nötig; langfristig wäre ein App-Store-Eintrag (Capacitor) zu prüfen, mit Blick auf Altersfreigaben.

### 3.7 Alternativen, die ich nicht empfehle

- Eigene Engine-Figuren oder veränderte Schachregeln: verfehlen das Lernziel.
- Online-Tausch oder Ranglisten: Datenschutz und Aufwand.
- Erst die ganze Welt bauen, dann die Partien: Die Partien sind das Spiel; sie müssen zuerst Spaß machen.

## 4. Projektplan

Aufwand = Zeit des Autors (Prüfen, Entscheiden, Testen); Claude macht die Schreib- und Bauarbeit. Modell: **Fable** für Fundament und Architektur, **Opus** für Inhalte in Menge, **Claude Code** für alles, was Code und Repository berührt (dort mit Opus; Fable nur für Schritt 3 und 5).

| Nr. | Schritt                       | Ziel und Ergebnis                                                                                                                                                                                                                                                                                                      | Hängt ab von                    | Aufwand     | Modell                                            |
| --- | ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- | ----------- | ------------------------------------------------- |
| 0   | Rahmen festlegen              | Entscheidungen aus Abschnitt 5 treffen; Staffel-Schnitt, Zielalter, Scope. Ergebnis: eine Seite „Projektvertrag“                                                                                                                                                                                                       | –                               | 2–3 Std.    | Chat (Fable)                                      |
| 1   | Story-Bibel                   | Figuren mit Hintergrund und Sprechweise, Welt, Zeitlinie, die vier Akte Szene für Szene, Dialog-Stilregeln. Ergebnis: Dokument Story-Bibel                                                                                                                                                                             | 0                               | 15–25 Std.  | Fable (Struktur), Opus (Ausarbeitung)             |
| 2   | Regelwerk final               | Karten, Orden, Ligen, Remis, Niederlage, Bedenkzeit, Zustände „abgelenkt/analysiert“, Punktesystem. Ergebnis: Dokument Regelwerk mit Tabellen, später direkt in JSON übernehmbar                                                                                                                                       | 0                               | 6–10 Std.   | Fable                                             |
| 3   | Architektur und Schnittstelle | Vertrag zwischen Spiel und App: Gegnerprofil (Stärke, Fehlerrate, Eröffnungen, Motive, Stil, Zustand), Partie-Ergebnis (Resultat, Karten, Schlüsselmomente, PGN), Modulgrenze, Cache-Strategie, Spielstand-Schema, Export. Ergebnis: Architekturdokument im Repository plus TypeScript-Interfaces ohne Implementierung | 2, Einblick in bestehenden Code | 8–12 Std.   | Claude Code mit Fable                             |
| 4   | Datenformate                  | Dialoge in Ink (inkjs) oder Yarn Spinner, Quests als JSON-Schema, Gegnerprofile als JSON, Karten als JSON, Karten in Tiled-JSON, Lokalisierungsdateien (de, später en). Ergebnis: Schemata plus ein Beispiel pro Format                                                                                                | 3                               | 4–6 Std.    | Claude Code (Opus)                                |
| 5   | Technischer Prototyp          | Phaser als lazy geladenes Modul in der PWA, ein Raum, eine laufende Figur, ein Dialog, Übergang in die vorhandene Brettansicht, Partie gegen Bot mit Profil, Rückweg mit Ergebnis. Ergebnis: lauffähiger Prototyp auf dem Handy                                                                                        | 3, 4                            | 15–25 Std.  | Claude Code (Fable für die Verbindung, dann Opus) |
| 6   | Asset-Grundstock              | LimeZu-Vollversion kaufen, Lizenzen ablegen, Kachelkatalog erstellen (jede genutzte Kachel benannt), 10–15 Bausteine (Klassenzimmer, Flur, Straße, Park, Wohnzimmer, Dachboden, Bibliothek), eine Pixel-Schrift, Platzhalter-Porträts. Ergebnis: Asset-Ordner mit Katalog                                              | 5                               | 10–15 Std.  | Claude Code (Opus) mit Screenshot-Schleife        |
| 7   | Weltgenerator                 | Werkzeug, das aus einer Ortsbeschreibung (Text/JSON) eine Tiled-Karte aus Bausteinen baut, Kollision und Übergänge setzt, Screenshot erzeugt. Ergebnis: Generator plus erste Karte Maple Falls außen und innen                                                                                                         | 6                               | 15–25 Std.  | Claude Code (Fable)                               |
| 8   | Spielsysteme                  | Dialogsystem, Questsystem, Kartenverwaltung, Orden, Spielstand, Menü/Clubtagebuch, Einstufung, Lernübersicht für Eltern. Ergebnis: alle Systeme in Maple Falls nutzbar                                                                                                                                                 | 5, 7                            | 25–40 Std.  | Claude Code (Opus)                                |
| 9   | Vertikaler Schnitt            | Maple Falls komplett: Intro, Fund des Bretts, 3 Nebenquests, Aufgabenreihe, Straßengegner, Clubkampf, Orden, erste Karte, Victor-Szene. Ergebnis: 60–90 Minuten spielbar                                                                                                                                               | 1, 2, 8                         | 20–30 Std.  | Claude Code (Opus); Dialoge aus Schritt 1         |
| 10  | Test mit Kindern              | 5–8 Kinder (Familie, Freunde, Verein, nicht eigene Schüler ohne Klärung) spielen den Schnitt; Beobachtungsbogen: Wo abgebrochen, was unverstanden, was gefiel. Ergebnis: Liste von Änderungen; Go/No-Go für Staffel 1                                                                                                  | 9                               | 10–15 Std.  | – (Autor), Auswertung mit Opus                    |
| 11  | Ausbau Staffel 1              | Cedar Creek, Riverton, Ironwood plus Cliffhanger; Drehbuch, Karten, Quests, Gegnerprofile, Balance                                                                                                                                                                                                                     | 10                              | 50–80 Std.  | Opus (Drehbuch), Claude Code (Opus)               |
| 12  | Audio und Porträts            | Musik-Loops (3–5 Stücke), Sounds, 8–10 Porträts mit einheitlichem Stil, Karten-Bilder                                                                                                                                                                                                                                  | 11                              | 15–25 Std.  | Bild-/Musikdienst (Autor), Einbau Claude Code     |
| 13  | Download und Update           | Optionales Laden in der App, Fortschrittsanzeige, Versionierung, Spielstand-Migration, Speicherwarnung auf iOS                                                                                                                                                                                                         | 5, 11                           | 8–12 Std.   | Claude Code (Opus)                                |
| 14  | Qualität und Recht            | Testplan (Gerätematrix: iOS Safari, Android Chrome, Desktop; Offline-Test; Speicherlöschung), Abspann mit Credits, Impressum und Datenschutzerklärung aktualisieren, Markencheck der Namen                                                                                                                             | 13                              | 10–15 Std.  | Opus (Checklisten), Autor                         |
| 15  | Veröffentlichung Staffel 1    | Zweiter Kindertest, Website-Seite zum Spiel, Freundeskarte, Installationsanleitung, Hinweis im Buch (Kasten)                                                                                                                                                                                                           | 14                              | 10–15 Std.  | Opus, Autor                                       |
| 16  | Staffel 2                     | Akte 3–4, Landesmeisterschaft, Ligen, Post-Game, Ghost Town, Abschied                                                                                                                                                                                                                                                  | 15                              | 80–130 Std. | wie 11–15                                         |

### Reihenfolge und Meilensteine

1. **M1 Fundament** (Schritte 0–4): nur Dokumente und Interfaces, kein Spielcode. Etwa 35–55 Std.
2. **M2 Es läuft** (Schritte 5–8): Prototyp, Assets, Generator, Systeme. Etwa 65–105 Std.
3. **M3 Es macht Spaß** (Schritte 9–10): vertikaler Schnitt und Kindertest. Etwa 30–45 Std. Hier fällt die Entscheidung, ob Staffel 1 gebaut wird.
4. **M4 Staffel 1 draußen** (Schritte 11–15): etwa 95–150 Std.
5. **M5 Staffel 2**: etwa 80–130 Std.

Bis M4 sind das rund 225–355 Stunden Autorenzeit; bei 5 Std. pro Woche etwa ein Jahr. Stufe 1 der App (Buchbegleitung) behält Vorrang; das Spiel darf das Erscheinen des Buches nicht verzögern.

### Arbeitsweise mit Claude

- Jede Claude-Code-Sitzung startet mit dem Lesen von Story-Bibel, Regelwerk, Architekturdokument und Kachelkatalog aus dem Repository. Diese vier Dateien sind die „Wahrheit“; Chat-Erinnerungen reichen nicht.
- Inhalte (Dialoge, Quests, Gegnerprofile) entstehen als Dateien im Repository, nicht im Chat, damit Code-Sitzungen sie direkt verwenden.
- Für Karten gilt: Generator baut, Screenshot wird geprüft, Fehler werden als Regel in den Katalog zurückgeschrieben, damit sie nicht wiederkommen.
- Ein Testprotokoll pro Stadt (Checkliste) verhindert, dass Regressionen unbemerkt bleiben.

## 5. Offene Entscheidungen

| Frage                                                    | Empfehlung                                                                                                                                                       |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Staffeln oder ein großer Wurf?                           | Staffeln. Staffel 1 mit vier Clubs, Entscheidung über Staffel 2 nach dem Kindertest.                                                                             |
| Muss Staffel 1 zum Bucherscheinen fertig sein?           | Nein. Die Buchbegleitung (Stufe 1 der App) hat Vorrang; das Spiel kommt als Update, das ist sogar ein zweiter Marketing-Anlass.                                  |
| Zielalter                                                | 10 bis 15, Lesbarkeit und Partielänge auf Zehnjährige ausrichten; Jugendliche kommen mit.                                                                        |
| Geist: historisch angelehnt oder erfunden?               | Erfunden, als Zeitgenosse von Paul Morphy; Morphy als reale Figur im Hintergrund erwähnen.                                                                       |
| Held/Heldin wählbar?                                     | Ja, Name und Figur (zwei bis vier Varianten); Dialoge geschlechtsneutral schreiben, um Doppelarbeit zu vermeiden.                                                |
| Sprache                                                  | Deutsch zuerst, alle Texte von Anfang an in Lokalisierungsdateien; Englisch mit der englischen Buchausgabe.                                                      |
| Namen (Perfect Move, ZERO, Maple Falls, Ambrose, Victor) | Vorläufig behalten, vor Veröffentlichung Markencheck; „ZERO“ wegen der Nähe zu AlphaZero eher umbenennen.                                                        |
| Dialogsystem                                             | Ink (inkjs, MIT): bewährt, verzweigt gut, von Claude in Menge gut schreibbar. Yarn Spinner als Alternative.                                                      |
| Phaser oder eigener Renderer?                            | Phaser. Spart Zeit, Tiled-Import fertig; Partien laufen in der vorhandenen Brettansicht.                                                                         |
| Karten: Verbrauch oder dauerhaft?                        | Beides: dauerhafte Grundkarten plus seltene Verbrauchskarten.                                                                                                    |
| Mentor-Zug behalten?                                     | Ja, aber in Akt 3 gesperrt und im Finale freiwillig; das trägt die Story.                                                                                        |
| Bedenkzeit                                               | Keine Uhr im Hauptspiel; nur ein Spezialgegner mit Uhr.                                                                                                          |
| Remis gegen Clubchefs                                    | Bronze mit Aufforderung zur Revanche.                                                                                                                            |
| Niederlage                                               | Analyse durch Ambrose, Gegner wird beim nächsten Versuch sichtbar überheblich (höhere Fehlerrate).                                                               |
| Tausch per QR                                            | Ja, nur Karte gegen Karte, ohne Server; Freundeskarte zur Installation dazu.                                                                                     |
| Telemetrie                                               | Nein. Rückmeldung nur über Kindertests und eine Feedback-Mailadresse für Eltern.                                                                                 |
| Musik: lizenzfrei, gekauft oder KI?                      | CC0/CC-BY-Loops für Staffel 1; KI-Musik nur mit Tarif, der kommerzielle Nutzung erlaubt.                                                                         |
| Porträts                                                 | Bild-KI mit kommerziellem Tarif, ein fester Stilprompt und Referenzbild je Figur; alternativ ein Pixel-Artist für die sechs Hauptfiguren (Budget ca. 200–500 €). |
| App-Store-Eintrag später?                                | Erst nach Staffel 1 prüfen; bringt Reichweite bei Kindern, kostet Altersfreigabe, Entwicklerkonten und Pflege.                                                   |
| Tests mit eigenen Schülern                               | Vorher mit Schulleitung klären; bis dahin Familie, Freunde, Verein.                                                                                              |
| Kostenpflichtig oder kostenlos?                          | Kostenlos bleiben. Ein Preis zerstört die Mundpropaganda und schafft Jugendschutz- und Zahlungsfragen.                                                           |
