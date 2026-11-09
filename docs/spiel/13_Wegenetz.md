# 13 Wegenetz: eine Welt statt eines Schlauchs

Stand: 9.11.2026 (mittel-2). Wunsch des Autors: keine schlauchartige Reise von Stadt zu Stadt,
sondern Freiheit wie in den Pokémon-Spielen, mit Sperren, die sich später öffnen, Abkürzungen von der
anderen Seite, Rückwegen, die sich lohnen, Wahl der Reihenfolge, wo es geht, und Nebenorten ohne
Schachclub. Grundlagen: `05_Story_Bibel.md` (Hauptszenen und Abhängigkeiten), `07_Aufgabenzuordnung.md`
und `orte.json` (Kapitel je Club), `08_Wege_und_Entdeckungen.md` (W1 bis W6), `09_Weltbeschreibung.md`
(Region, Orte), `KARTENREGELN.md` 7a.2 (Maßstab: Pokémon mal 1,5 bis 2, Entscheidung des Autors). Akt 1 ist mit `12_Akt1_Leben.md` (mittel-1)
abgeglichen (Abschnitte 5 und 7 dort, Entscheidungen des Haupt-Chats vom 9.11.2026: kleine Aufgaben
mit `klein: true`, Mrs. Whitlock heißt Margaret, der Busfahrer raucht nicht, die Kühe der Kuhweide
gehören zum Kürbishof). Sperren sind durchnummeriert; S5 ist der morsche Steg aus 12.

## 0. Grundsätze

1. **Die Hauptgeschichte bleibt.** Die Hauptszenen aus 05 laufen in derselben Reihenfolge; jede Sperre
   öffnet sich spätestens dann, wenn die Hauptgeschichte den Weg braucht. Neue Gründe für Sperren
   sind erlaubt, solange sie diesen Ablauf nicht ändern.
2. **Kapitelgrenze.** Wahl der Reihenfolge gibt es nur zwischen Orten, deren Aufgaben aus denselben
   Buchkapiteln kommen, oder zwischen Orten ohne Club (Nebenorte, Akt 4). Kapitel je Club laut
   `orte.json`: Maple Falls 0, 1; Cedar Creek 7, 8; Riverton 7, 4; Ironwood 7, 4; Silicon Bay 1, 2, 4;
   Port Delacroix 5, 6; Desert Springs 7, 1; Summit City 8, 9; ab Crossroads keine Clubs.
3. **Sperren haben einen Grund in der Welt** (Brücke im Bau, Hochwasser, Fähre nur an bestimmten Tagen,
   Gatter, Wachmann, Nebel, Dunkelheit, Steigung, Rätseltafel als Torwächter) und öffnen sich durch
   ein Ereignis der Geschichte, einen Gegenstand oder eine gelöste Aufgabe. Nie durch Zahlen allein
   („Stufe 20“).
4. **Schlüssel wie die Hilfsmaschinen in Pokémon**, aber aus dem Alltag: **Fahrrad** (Akt 2: Schuppen in Riverton oder Eisenwaren in Ironwood),
   **Laterne** (Gegenstand gibt es), **Gummistiefel** (neu, Akt 2), **Fährpass** (neu, Akt 3),
   **Monatskarte** (Gegenstand gibt es, Zug). Jeder Schlüssel öffnet in mindestens zwei Akten etwas.
5. **Rückwege lohnen sich:** Hinter jeder Sperre, die sich später öffnet, liegt etwas für früher
   besuchte Orte (Fund, Revanche, Album, Fragment, Nebenquest), und alte Gegner haben eine Revanche
   auf der neuen Stärke (R22).
6. **Nebenorte** (N1 bis N7) haben keinen Club, keine Nadel, keine Wertung, dafür eigene Nebenquests,
   Figuren und Belohnungen. Sie brauchen später ein eigenes Ortsdokument.

## 1. Weltkarte

Norden oben. `══` Hauptweg (W1 bis W11 aus 08 und `orte.json`), `┄┄` neue Querverbindung oder
Abkürzung, `[S1]` Sperre, `(N1)` Nebenort, `⇄` Schnellreise (Bus, Zug, Fähre nach W2).

```text
                         HÜGELLAND (Ahorn, Zedern)                              N
                                                                                ▲
   (N1 Kürbishof Miller)                         ┌┄┄ Zedernpfad [S2] ┄┄┐
         ┆ Gatter [S1]                           ┆                     ┆
   [1 Maple Falls]══W1 Landstraße/Flussweg══[2 Cedar Creek]══W2 Zedernwald/Bahndamm══[3 Riverton]
         ⇄ Bus ─────────────────────────────────⇄                       ⇄ Zug ──────────⇄  │
                                                                                            W3 Kanalweg [S3 Schleuse]
                         (N2 Schleusendorf Lockport) ┄┄┄ am Kanal ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┤
                                                                                            ▼
   [5 Silicon Bay]══W4 Raststätte/Glasbrücke══════════════════════════════════════[4 Ironwood]
     │  ┆                                                     (N3 Alter Steinbruch) ┄┄ [S4 Laterne] ┘
     │  ┆ Fähre sonntags [S6] ┄┄ (N4 Pelikaninsel)
     W5 Küstenfähre/Deich [S7 Fährpass ab Rückkehr]
     ▼
   [6 Port Delacroix]══W6 Wüstenzug/Canyonpfad══[7 Desert Springs]══W7 Diner/Bergstraße══[8 Summit City]
     │ Bayou (L5) [S8 Gummistiefel]      ┆                     ┆ Abzweig Hochebene (L9)        │
     │                                   ┆ (N5 Sternwarte am Canyon) [S9 Laterne, nachts]       W8 Geysire/Prärie [S10 Nadel]
     │                                                                                          ▼
     └┄┄┄┄┄┄┄ Fähre zurück ⇄ ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄ [9 Crossroads] (N6 Sommerjahrmarkt)
                                                                         ╱          ╲
                                                       W9 Fernwanderweg              Q4 Alte Minenstraße (neu)
                                                                      ╱                ╲
                                                       [10 Pinewood Camp]┄┄W10┄┄[11 Ghost Town]──(N7 Silbermine) [S11 Laterne]
                                                                                          │
                                                                                   W11 Seeufer/Leuchtturm [S12 Fernpartie]
                                                                                          ▼
                                                                                 [12 Capital Arena]
```

Neue Querverbindungen: **Q1** Zedernpfad (Maple Falls nördlich über den Hügel nach Cedar Creek, eine
eine Karte von etwa 100 Kacheln Länge, gut 30 Sekunden zu Fuß), **Q2** Kanal-Seitenarm zu Lockport (Abstecher von W3), **Q3** Rückfähre Crossroads ↔
Port Delacroix über den Busbahnhof (Schnellreise, Akt 4), **Q4** Alte Minenstraße Crossroads → Ghost
Town (eine Karte von etwa 150 Kacheln Länge, gut 40 Sekunden). Dazu die Abzweige zu den Nebenorten N1 bis N7.

## 2. Akt 1 (Maple Falls, Cedar Creek; Kapitel 0, 1, 7, 8)

Reihenfolge fest: erst Maple Falls (Regeln, Figurenwerte), dann Cedar Creek (Matt). Die Freiheit
liegt in den Wegen und im Nebenort. Figuren, kleine Aufgaben und Funde der Orte stehen in
`12_Akt1_Leben.md`; hier nur, was das Wegenetz betrifft. Grundsatz aus 12: Man **sieht**, was hinter
einer Sperre liegt, und eine Figur davor **nennt den Grund** in einem Satz; der Grund ist Alltag,
keine Fähigkeit. Das Fahrrad gibt es erst in Akt 2.

**Sperren**

| Nr. | Stelle                                                                 | Grund in der Welt                                                                                                                                                                                 | Öffnet sich                                                                                                | Lohn                                                                                                                                                       |
| --- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| S1  | Landstraße, Gatter zum Kürbishof Miller (N1), gegenüber dem Apfelstand | Walt Miller lässt niemanden aufs Feld, „die Kühe sind ausgebüxt“; Ada am Apfelstand: „Walt macht nur auf, wenn einer denken kann.“                                                                | nach der Rätseltafel am Ortsausgang (Torwächter: drei Mattaufgaben); Miller hat zugesehen                  | Nebenort N1                                                                                                                                                |
| S2  | Zedernpfad (Q1), Waldrand hinter dem Park ↔ Westrand von Cedar Creek   | Eine Zeder ist im Sturm quer über den Pfad gefallen; von Maple Falls sieht man Stamm und Kuppe. Mrs. Holm an der Zedernhecke in Cedar Creek erzählt vom Sturm („Die alte Zeder hat es erwischt.“) | **von der Cedar-Creek-Seite**: Dex baut nach der Clubnadel eine Seilwinde („fast funktioniert“)            | Abkürzung; Bank auf der Kuppe mit Aussicht auf beide Orte und die Brückenbaustelle nach Riverton (`aussichtKuppe`, Vorgeschmack auf Akt 2); Zedernzapfen   |
| S5  | Park von Maple Falls, Steg und Uferweg zum Wasserfall                  | Absperrband der Stadt: „Steg morsch – wird erneuert.“ Mr. Pratt: „Die Stadt hat kein Geld, ich hab keine Zeit.“                                                                                   | nach der ersten Clubnadel: Pratt hat den Steg am Wochenende selbst erneuert („Für Pokale baue ich alles.“) | Aussicht auf den Wasserfall (`aussichtWasserfall`), im Geländer „M. W. + E. C. 1952“ (`fundInitialen`, Album); Mrs. Calloway erzählt von Margaret Whitlock |
| –   | Zedernwald nach Riverton (Cedar Creek Ostrand)                         | Brücke über den Bach im Bau (Ortsdokument Cedar Creek)                                                                                                                                            | Ende von Akt 1 (`endeAkt1Gesehen`), wie heute                                                              | Akt 2; die Kuppe (S2) zeigt die Baustelle schon vorher                                                                                                     |

**Abkürzung:** Q1 Zedernpfad, von Cedar Creek aus geöffnet; danach in gut 30 Sekunden von Maple Falls
in Cedar Creek statt in 65 bis 80 Sekunden über Landstraße und Flussweg. Auf der Kuppe steht die Bank
mit Aussicht (S2). Eine zweite Abkürzung am Flussweg gibt es nicht; die alte Fährstelle bleibt
Rätselort (12, Vorschlag 4).

**Rückwege mit Lohn:** Nach der ersten Nadel der Steg im Park (S5). Nach der zweiten Nadel hat
Mr. Abernathy im Park eine neue Stellung auf seinem Reisebrett (Matt in zwei, Kapitel 7), und Juno
wartet am Zedernpfad mit dem Tagebuch (Album); über den Pfad ist man in gut 30 Sekunden dort. Lohn
des Pfades selbst: Fund „Zedernzapfen mit Initialen“ und die Revanche gegen Jo.

**Wahl:** Kürbishof (N1) vor oder nach Cedar Creek; seine Aufgaben nutzen Kapitel 0 und 1
(Figurenzüge, Figurenwerte), passen also in beide Reihenfolgen.

**Nebenort N1 Kürbishof Miller** (Abstecher von der Landstraße, hinter dem Gatter S1)

- Thema und Stimmung: Ein Familienhof mit Maisirrgarten, Kürbisfeld und Hofladen kurz vor dem
  Herbstfest. Es riecht nach Heu und Apfelkuchen, Kinder rennen durch die Maisgänge.
- Nebenquests (alle `klein: true`, sie zählen nicht für R27): **Der Springer im Mais** (Ausgang des
  Irrgartens nur mit Springerzügen erreichbar, Kapitel 0); **Kürbiswaage** (Kürbisse mit
  Figurenwerten 1, 3, 3, 5, 9 auf zwei Wagen gleich schwer verteilen, Kapitel 1); **Die ausgebüxten
  Kühe** (ohne Schach): Die drei Kühe stehen auf der Kuhweide der Landstraße und am Fährstein des
  Flusswegs; Otis hat sie „gestern schon gesehen“, Tessa beim Laufen auch. So führt die Suche über
  beide Karten des Wegs, an Apfelstand und Fährstelle vorbei.
- Figuren: **Bauer Walt Miller** („Schach ist wie Ernte: erst säen, dann warten.“); **Tochter Wren**,
  12, baut den Irrgarten jedes Jahr neu; **Oma Miller** im Hofladen, verkauft Kuchen und erzählt
  vom Herbstfest von früher; **Vogelscheuche** mit Namensschild „Morphy“ (Ada spottet am Apfelstand:
  „Walt gibt seinen Vogelscheuchen Namen. Meine heißen Vogelscheuche.“).
- Gewinn: Münzen, Fund „Maiskolben-Turm“ (Album), Karte **Abzählen** (dauerhaft) für die Kürbiswaage.

## 3. Akt 2 (Riverton, Ironwood; Kapitel 4 und 7)

Reihenfolge der Clubs fest: Die Hauptgeschichte braucht erst den Pavillon in Riverton, dann Mamas
Verbot und Ironwood (05, Kern Akt 2). Beide Clubs lehren Taktik aus Kapitel 4 und 7; deshalb dürfen
**Nebenquests und Wege von Ironwood schon vorher** betreten werden (Kanalweg, Museum, Bahnhof), nur
der Club öffnet nach Mamas Szene.

**Sperren**

| Nr. | Stelle                             | Grund in der Welt                                                     | Öffnet sich                                                                                                            |
| --- | ---------------------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| S3  | Schleuse auf dem Kanalweg (W3)     | Schleusentor geschlossen, „Herbstwartung“; der Weg führt über das Tor | Fahrrad (Schuppen in Riverton) und die Tafel des Schleusenwärters (Torwächter: zwei Gabeln, Kapitel 4); alternativ Zug |
| S4  | Alter Steinbruch bei Ironwood (N3) | Stollen dunkel                                                        | **Laterne** (Ironwood, Eisenwaren Edna)                                                                                |
| –   | Club Ironwood                      | Mama verbietet Ironwood                                               | Hauptszene (Mama erzählt), wie heute                                                                                   |

**Abkürzung:** Der Güterzug-Bahndamm (W2) und der Kanal (W3) treffen sich bei Lockport (N2): Von dort
fährt nach der Nadel von Riverton ein Lastkahn bis Ironwood (Schnellreise auf dem Wasser, Fahrkarte
5 Münzen). Geöffnet wird er von der Ironwood-Seite: Big Joe kennt den Kapitän.

**Rückwege mit Lohn:** Mit der **Laterne** zurück in den Keller des Archivs von Cedar Creek: ein
dunkles Regal mit dem Fragment-Hinweis zu 1858 (Album); mit dem **Fahrrad** über den Zedernpfad (Q1)
zu Mae: Sternennacht im Herbst mit neuem Sternbild (Szene wie 22, andere Belohnung). Mit dem
**Fahrrad** zurück in den Park von Maple Falls: Jo fordert ein Rennen auf dem Uferweg
(Zeitkarte als Belohnung).

**Wahl:** Lockport (N2) und der Steinbruch (N3) in beliebiger Reihenfolge, auch vor dem Club in
Ironwood; ihre Aufgaben nutzen Kapitel 4 (Gabel, Fesselung, Spieß), dieselben wie die Clubs.

**Nebenort N2 Schleusendorf Lockport** (Seitenarm des Kanals, Abstecher von W3)

- Thema und Stimmung: Zehn Häuser um eine Schleuse, Lastkähne, Wäsche an der Leine, ein Gasthaus mit
  Kegelbahn. Herbstlicher Nebel über dem Wasser, Möwen, die vom Fluss heraufkommen.
- Nebenquests: **Kahnrennen** (zwei Kähne gleichzeitig angreifen: Gabel-Aufgaben am Kai, Kapitel 4);
  **Der festgebundene Kahn** (welches Tau hält was: Fesselungen als Bilderrätsel, Kapitel 4);
  **Post für den Kapitän** (Brief von Big Joe überbringen, ohne Schach).
- Figuren: **Schleusenwärterin Imogen** (stellt die Tafel S3; „Erst das Wasser, dann das Boot.“);
  **Kapitän Ruben** vom Lastkahn „Ashford Belle“; **Wirt Otto** mit Kegelbahn; **Junge Finn**, angelt
  Flaschen aus dem Kanal.
- Gewinn: Lastkahn-Schnellreise, **Gummistiefel** (Wirt Otto, für das Bayou in Akt 3), Fund
  „Kegel mit Kerbe“ (Album), Karte **Gefahrenradar**, Münzen.

**Nebenort N3 Alter Steinbruch** (hinter dem Bahnhof von Ironwood, Sperre S4)

- Thema und Stimmung: Ein stillgelegter Steinbruch mit Stollen, Loren und einem Wasserloch, in dem
  sich der Himmel spiegelt. Kühl, hallend, mit Graffiti der Stahlwerkerkinder von 1980.
- Nebenquests: **Die Lorenbahn** (Weichen stellen, damit keine Lore „hängt“: hängende Figuren und
  Spieße, Kapitel 4 und 7); **Mamas Versteck** (Mama hat hier als Jugendliche trainiert; ihr altes
  Brett im Stollen finden, ohne Schach); **Das Echo** (Hallraum: ein Zug, der zurückkommt, Ansehen).
- Figuren: **Vorarbeiter a. D. Mr. Brennan** („Stein bricht da, wo er schwach ist. Bretter auch.“);
  **Fotografin Lena**, macht Bilder für ein Buch über Ironwood; **zwei Stahlwerkerkinder** mit
  Taschenlampen.
- Gewinn: Fund „Mamas altes Steckschach“ (Album, Gespräch mit Mama), Fragment-Hinweis, Münzen.

## 4. Akt 3 (Silicon Bay, Port Delacroix, Desert Springs; Kapitel 1, 2, 4, 5, 6, 7)

Reihenfolge fest: Die Hauptgeschichte braucht Silicon Bay (ZERO), dann den Tiefpunkt in Port
Delacroix, dann die Versöhnung im Canyon (05, Kern Akt 3); auch die Kapitel unterscheiden sich
(Eröffnung, Struktur, Königsangriff). Freiheit gibt es bei den Nebenorten und Rückwegen.

**Sperren**

| Nr. | Stelle                                                | Grund in der Welt                                                        | Öffnet sich                                                                                  |
| --- | ----------------------------------------------------- | ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| S6  | Fähre zur Pelikaninsel (N4)                           | fährt nur sonntags (im Spiel: nach jeder Clubnadel einen „Sonntag“ lang) | nach der Nadel von Silicon Bay, danach nach jeder Nadel wieder                               |
| S7  | Küstenfähre zurück (W5, Port Delacroix → Silicon Bay) | Rückfahrt erst mit Fährpass                                              | **Fährpass** von Miss Odile nach dem Wiederaufbau; dann Fähre in beide Richtungen            |
| S8  | Bayou (L5) hinter Port Delacroix                      | Hochwasser im Winter                                                     | **Gummistiefel** (Akt 2, Lockport-Gasthaus) und `musikhausOffen`; heute nur `musikhausOffen` |
| S9  | Sternwarte am Canyon (N5)                             | Pfad nur nachts zu sehen, ohne Licht gefährlich                          | **Laterne** und die Nacht nach der Versöhnung (Szene im Canyon)                              |
| –   | Clubkampf ohne Ambrose, Mentor-Zug                    | Tiefpunkt (R29)                                                          | Versöhnung, wie heute                                                                        |

**Abkürzung:** Die Fähre (S7) von der Seite Port Delacroix: Wer zurück nach Silicon Bay will
(Spielberichte, Theo, Revanche bei Dr. Lin), muss nicht zu Fuß über Ironwood.

**Rückwege mit Lohn:** Zurück nach Ironwood mit dem Brief aus Desert Springs: Big Joe liest den
Umschlag noch einmal, und im Postamt liegt ein zweiter Brief (Fragment-Hinweis). Zurück nach Riverton
mit der Laterne: Harlans Uhrmacherkeller (Revanche, drei Siege für die Lupe nach Q20-3).

**Wahl:** Pelikaninsel (N4) und Sternwarte (N5) in beliebiger Reihenfolge und zu jeder Zeit nach ihrer
Öffnung; die Aufgaben nutzen Kapitel 1, 2 und 7, die in Akt 3 schon dran waren.

**Nebenort N4 Pelikaninsel** (vor Silicon Bay, Fähre sonntags, S6)

- Thema und Stimmung: Ein Fischerdorf auf einer flachen Insel, bunte Holzhäuser auf Stelzen, ein
  Leuchtfeuer ohne Wärter, Pelikane auf jedem Pfahl. Winterwind, Salz, keine Bildschirme, weil das
  Netz hier nicht hinkommt.
- Nebenquests: **Netze flicken** (Löcher in der Bauernkette finden, Kapitel 5 als Vorgeschmack, oder
  ohne Schach als Suchbild); **Das Leuchtfeuer** (Batterie aus Silicon Bay holen, ohne Schach);
  **Partie gegen die Gezeiten** (Stellungsduell mit Uhr, Eröffnungsgrundsätze, Kapitel 1 und 2: wer
  zu spät entwickelt, verliert, bevor die Flut kommt).
- Figuren: **Fischerin Marisol** (gegen „Großes Maul“ immun, eigene Sprüche); **Netzmacher Old
  Pete** („Eine Masche reißt, und das ganze Netz ist offen.“); **Kind Coral**, sammelt Muscheln;
  **Pelikan „Bishop“**, der die Fähre begleitet.
- Gewinn: Fund „Treibholz-Turm“ (Album), Karte **Ablenkung**, Münzen.

**Nebenort N5 Sternwarte am Canyon** (Abzweig vom Canyonpfad W6, nachts, S9)

- Thema und Stimmung: Eine alte Universitätssternwarte auf einer Felsnase, Kuppel mit rostigem
  Spalt, Kakteen im Mondlicht. Still, kalt, der Himmel so voll, dass man die Milchstraße hört.
- Nebenquests: **Maes Brief** (Mae aus Cedar Creek bittet per Brief um ein Foto eines Sternbilds,
  ohne Schach); **Königsangriff unter Sternen** (Stellungsduell, Kapitel 7, gegen den
  Astronomen); **Das Sternbild „Springer“** (sieben Sterne, die einen Springerweg bilden, Rätsel,
  Kapitel 0).
- Figuren: **Astronom Dr. Ngata** (spielt nachts per Funk gegen Kollegen); **Studentin Lucía**
  mit Thermoskanne; **Mira** kommt nach der Versöhnung zu Besuch.
- Gewinn: Fund „Sternkarte mit Bleistiftzügen“ (Album), Brief an Mae (Nebenquest in Akt 4 bei
  Pinewood, Mae zeigt Sterne), Münzen.

## 5. Akt 4 (Summit City, Crossroads, Pinewood Camp, Ghost Town, Capital Arena; Kapitel 8, 9)

Hier ist die größte Freiheit möglich: Nach Summit City gibt es keine Clubs mehr, also keine
Kapitelreihenfolge. Fest bleibt: Summit City zuerst (Hales Seite für Ghost Town), Novas Bitte in
Crossroads und die Fernpartie in Ghost Town vor der Landesmeisterschaft.

**Sperren**

| Nr. | Stelle                                        | Grund in der Welt                                                                                           | Öffnet sich                                                                                               |
| --- | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| S10 | Weg 8 nach Crossroads                         | Bergstraße über den Pass erst nach der Nadel (Ward lässt keinen ohne Endspiel weg; heute `nadelSummitCity`) | Nadel von Summit City, wie heute                                                                          |
| S11 | Silbermine bei Ghost Town (N7)                | Stollen dunkel und abgesperrt von Mr. Pruitt                                                                | **Laterne** und Pruitts Geschichte (Gespräch nach dem Grab)                                               |
| S12 | Weg 11 zur Capital Arena                      | Wachmann von Perfect Move am Seeufer: „Nur für Gemeldete“                                                   | Fernpartie gespielt (`fernpartieGespielt`) und Novas Bitte gehört (`novaBitteGehoert`)                    |
| S13 | Alte Minenstraße Q4 (Crossroads → Ghost Town) | Viehgatter, Rinder auf der Straße                                                                           | Hilfe bei Darlene (Ladenquest: Lieferung ins Camp) **oder** von Ghost Town aus (Pruitt öffnet das Gatter) |

**Abkürzung:** Q4 Alte Minenstraße, geöffnet von Crossroads (Darlene) oder von Ghost Town (Pruitt).
Damit ist **Pinewood Camp ein Abstecher**, keine Pflichtstation: Crossroads → Ghost Town direkt, oder
Crossroads → Pinewood → Ghost Town (Weg 9 und 10). Q3 Rückfähre und Bus ab Crossroads machen die
Rückkehr zu allen alten Orten schnell (Schach960 im Musikhaus, Bayou, Revanchen).

**Rückwege mit Lohn:** Alle Clubchefs geben eine Revanche auf der Stärke von Akt 4 und erscheinen
danach als Publikum der Meisterschaft (05, 27.1); jede besuchte Stadt hat eine Variante oder einen
Nebenort, der erst jetzt ganz offen ist (Bayou mit Gummistiefeln, Pelikaninsel, Sternwarte).

**Wahl:** nach Summit City frei zwischen Hochebene (L9), Crossroads, Pinewood Camp (Abstecher),
Ghost Town, Bayou (Rückkehr) und den Nebenorten N6 und N7. Kapitelgrenze unberührt, weil es hier keine
Clubs gibt; die Tafeln und Stellungsduelle nutzen Kapitel 8 und 9 (Endspiel) und passen sich der
Stufe des Lesers an.

**Nebenort N6 Sommerjahrmarkt** (auf dem Feld hinter der Raststätte in Crossroads)

- Thema und Stimmung: Ein reisender Jahrmarkt mit Riesenrad, Zuckerwatte, Schießbude und einer
  Bühne für Country-Bands. Laut, bunt, abends mit Lichterketten bis zum Horizont.
- Nebenquests: **Der Schachautomat** (eine Jahrmarktsattraktion „Der Schachtürke“: Im Kasten sitzt
  ein Kind, das um Hilfe bittet; Endspiele gegen den Automaten, Kapitel 8); **Riesenrad-Rätsel**
  (von oben Stellungen auf dem Parkplatz erkennen: Opposition mit Autos, Kapitel 8); **Losbude**
  (Album-Sammelbilder aller Städte, ohne Schach).
- Figuren: **Schaustellerin Dolores** („Jeder Kasten hat ein Geheimnis. Meiner hat zwei.“); **Kind
  Ike** im Automaten; **Losverkäufer Buster**; **Juno**, die alles fotografiert.
- Gewinn: Album-Sammelbilder, Karte **Endspielkompass** (falls nicht gekauft) oder Münzen, Extra
  „Brett Jahrmarkt“ (Bretthintergrund).

**Nebenort N7 Silbermine** (am Rand von Ghost Town, Sperre S11)

- Thema und Stimmung: Die Mine, um die herum Ghost Town einst entstand: Stollen mit Holzstützen,
  Loren, Spuren der Bergleute von 1866. Kühl, dunkel, die Laterne zeichnet einen Kreis auf den Fels.
- Nebenquests: **Die letzte Schicht** (Pruitts Geschichte: das Logbuch der Mine von 1866 finden, in
  dem steht, dass ein Fremder bei Kerzenlicht einen Brief schrieb; Fragment-Hinweis, ohne Schach);
  **Lorenendspiel** (Turmendspiele mit Loren auf Gleisen: Turm hinter dem Freibauern, Kapitel 9);
  **Silberader** (Erkunden, versteckte Funde).
- Figuren: **Mr. Pruitt** mit Metalldetektor (öffnet die Mine); **Kletterin Juniper** (vom Weg 10)
  als Begleitung; **Fledermauskolonie** als Belebung.
- Gewinn: Fund „Grubenlampe von 1866“ (Album, in der Erinnerung 1866 sichtbar), Fragment-Hinweis,
  Münzen.

## 6. Was sich in anderen Dokumenten ändern müsste

Die Dateien sind nicht geändert; das ist die Liste für den Haupt-Chat.

**05 Story-Bibel**

1. Akt 1: Szene „Der umgestürzte Baum“ (Dex öffnet den Zedernpfad nach der Nadel von Cedar Creek);
   Kürbishof N1 als Nebenort mit Bauer Miller und Wren; Rätseltafel am Ortsausgang zugleich
   Torwächter für das Gatter S1.
2. Akt 2: Ironwood vor Mamas Szene betretbar, Club gesperrt (Satz in der Szenenliste); Lockport (N2)
   und Steinbruch (N3) mit Figuren; Lastkahn als Schnellreise; Rückweg-Szene „Mamas Versteck“.
3. Akt 3: Fährpass von Miss Odile nach dem Wiederaufbau; Pelikaninsel (N4) und Sternwarte (N5); Brief
   an Mae als Verbindung zu Akt 4.
4. Akt 4: Pinewood Camp als Abstecher (Szene 95 nicht mehr Pflicht vor Ghost Town); Alte Minenstraße
   Q4 mit Darlenes Lieferquest; Wachmann am Seeufer (S12) als Grund für die Sperre von Weg 11;
   Sommerjahrmarkt (N6) und Silbermine (N7); Revanchen aller Clubchefs vor der Meisterschaft.

**07 Aufgabenzuordnung**

1. Aufgaben der Nebenorte je Kapitel: N1 Kapitel 0 und 1; N2, N3 Kapitel 4 (und 7); N4 Kapitel 1, 2
   (5 als Vorgeschmack); N5 Kapitel 0 und 7; N6 Kapitel 8; N7 Kapitel 9.
2. Rätseltafeln als Torwächter (S1, S3) mit Kapitel und Zahl der Aufgaben.
3. Akt 4: Tafeln und Stellungsduelle passen sich der Stufe an, weil die Reihenfolge frei ist.

**08 Wege und Entdeckungen**

1. W1 ergänzen: Querverbindungen Q1 bis Q4 und Abzweige zu Nebenorten sind eigene Wege-Karten nach
   7a.2 (eine Karte, 100 bis 150 Kacheln lang; Abstecher zu Nebenorten wie ein halber Weg).
2. Neuer Abschnitt „Sperren und Schlüssel“ (S1 bis S13; Fahrrad, Laterne, Gummistiefel, Fährpass,
   Monatskarte) mit der Regel „jeder Schlüssel öffnet in zwei Akten etwas“.
3. W2 Schnellreise: Lastkahn (Akt 2), Fähre in beide Richtungen nach Fährpass (Akt 3), Bus ab
   Crossroads zu allen Orten (Akt 4).
4. E4 übergreifende Quests: Brief an Mae (N5 → Pinewood), Grubenlampe (N7 → Erinnerung 1866).
5. Neue Gegenstände: Gummistiefel (Lockport, Akt 2), Fährpass (Port Delacroix, Akt 3).

**09 Weltbeschreibung**

1. Karte in Abschnitt 1 durch die Weltkarte oben ersetzen oder ergänzen (Querverbindungen,
   Nebenorte).
2. Neue Abschnitte für N1 bis N7 (Lage, Bild, Innen- und Außenkarten) und für Q1 und Q4.
3. Abschnitt 3.6 „Größen“ an `KARTENREGELN.md` 7a angleichen (7a.2: Wege zwei Karten, zusammen 220 bis 400 Kacheln; heute: Routen zweimal 28 × 20).
4. Jahreszeiten: Kürbishof im Frühherbst (Akt 1), Lockport im Herbstnebel (Akt 2), Pelikaninsel im
   Winterwind (Akt 3), Jahrmarkt im Sommer (Akt 4).

**Technik (für den Haupt-Chat, keine Datei der Liste)**

1. Auslöser mit `wenn` für Gegenstände (`hatLaterne`, `hatFahrrad`) gibt es schon; Sperren mit Dialog
   davor („Hier ist es zu dunkel.“) brauchen nur Ink.
2. Abkürzungen, die sich von einer Seite öffnen: eine Dialogvariable (`zedernpfadOffen`), die beide
   Seiten als `wenn` nutzen.
3. Freie Reihenfolge in Akt 4: Szenen dürfen nicht mehr an „Ankunft in Pinewood“ hängen; Abhängigkeiten
   prüfen (`akt4.camp` ist dann keine Voraussetzung für Ghost Town).

## 7. Rückkehr

Wunsch des Autors (9.11.2026): Zurückkehren soll sich lohnen, nicht erst nach dem Spiel. Manchmal
schickt die Geschichte {held} bewusst zurück, manchmal findet man freiwillig etwas Neues. Akt 1 ist
mit `12_Akt1_Leben.md` (mittel-1) abgeglichen; dessen kleine Aufgaben und Funde ergänzen 7.3. Technik: Veränderungen sind
Objektebenen mit Bedingung aus dem Spielstand (09, Abschnitt 3.4) und Dialogvarianten; neue Karten
braucht es dafür nicht.

### 7.1 Rückkehr durch die Geschichte

**Schon in der Story-Bibel (05)**

| Szene      | Ort                               | Akt | Anlass                                                         | Was man dort erlebt                                                       |
| ---------- | --------------------------------- | --- | -------------------------------------------------------------- | ------------------------------------------------------------------------- |
| 25         | Bus nach Maple Falls              | 1   | Rückfahrt am Ende von Akt 1                                    | Juno liest aus dem Tagebuch vor, Nachricht über den Parkclub von Riverton |
| 26         | Cedar Creek (Steg)                | 2   | Aufbruch nach Riverton                                         | Juno zeigt die Nachricht, der Weg durch den Zedernwald öffnet sich        |
| 38         | Maple Falls (Wohnzimmer)          | 2   | Mama verbietet Ironwood                                        | „Nein. Nicht Ironwood.“; Mama geht zur Nachtschicht                       |
| 64, 69, 70 | Port Delacroix                    | 3   | Wiederaufbau über drei Besuche, der dritte nach Desert Springs | Bretter sammeln, Benefiz-Simultan, das Schild über der Tür                |
| 80         | Port Delacroix oder Maple Falls   | 3   | Rückweg am Ende von Akt 3                                      | Mama plant Summit City                                                    |
| 109        | Maple Falls (Dachboden)           | 4   | Abschied                                                       | Das Brett wird still, Schlussstellung der Fernpartie                      |
| 110        | alle Städte                       | 5   | Post-Game                                                      | Revanchen, Weltmeisterschaft, das Echo des Ingenieurs                     |
| L1, L5     | Port Delacroix (Musikhaus, Bayou) | 4   | Varianten (freiwillig, Schnellreise)                           | Schach960 bei Mabel, Nebelschach im Bayou                                 |

**Neu: kurze Rückkehr-Szenen und Bitten** (je Akt mindestens eine; keine ist Voraussetzung für eine
Hauptszene, aber jede bringt etwas mit)

| Nr. | Ort                                | Akt | Anlass                                                                                                                   | Was man dort erlebt                                                                                                                                     |
| --- | ---------------------------------- | --- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R1  | Maple Falls (Park)                 | 1   | Nach Szene 15: Mr. Abernathy hat seine Thermoskanne im Bus nach Cedar Creek vergessen; der Busfahrer gibt sie {held} mit | Abernathy erzählt, dass er Mrs. Okafor vor vierzig Jahren beim Turnier traf; neue Stellung auf seinem Reisebrett (Matt in zwei)                         |
| R2  | Maple Falls (Clubraum)             | 2   | Nach der Nadel von Riverton: Coach Delgado bittet um einen Bericht fürs Team                                             | Sam fordert eine Revanche auf der Stärke von Akt 2; an der Wand hängt jetzt ein Plakat mit den Nadeln                                                   |
| R3  | Cedar Creek (Archiv)               | 2   | Nach Szene 41 (leerer Umschlag): Mrs. Okafor ruft an, sie habe im Postbuch von 1866 den Namen Whitlock gefunden          | Eintrag „Brief an A. Whitlock, nicht zustellbar“; mit Laterne das dunkle Regal (Fragment-Hinweis)                                                       |
| R4  | Silicon Bay (Akademie)             | 3   | Nach Szene 79: „Gib es Theo zurück, wenn du ihn siehst“ (Theos Tablet); mit dem Fährpass                                 | Theo freut sich und zeigt, was er ohne Tablet gelernt hat; Dr. Lin deutet an, dass sie bei der Meisterschaft aussagen will (Vorbereitung von Szene 105) |
| R5  | Ironwood (Postamt der Bahnstation) | 3   | Nach Szene 76: Den Brief von Hale dorthin bringen, wo er 1866 liegen blieb                                               | Die Postbeamtin stempelt den Umschlag „Zugestellt“ mit heutigem Datum; Big Joe liest mit und schweigt; Ambrose: „Spät. Aber angekommen.“ (Album)        |
| R6  | Maple Falls (Clubraum und Park)    | 4   | Vor der Meisterschaft: Coach Delgado lädt zu einem letzten Training mit dem alten Team ein                               | Juno, Sam und Lily spielen eine Simultan gegen {held}; Abernathy und Jo begleiten den Bus zur Capital Arena (sie sitzen im Publikum)                    |
| R7  | Cedar Creek (Bibliothek)           | 4   | Nach Szene 88 (Hales Seite): Mrs. Okafor möchte die Seite mit dem Postbuch vergleichen                                   | Beide Handschriften nebeneinander; Mrs. Okafor kopiert die Seite fürs Archiv; Mae ist im Camp, ihr Zettel liegt da (Verbindung nach Pinewood)           |

### 7.2 Weltzustand je Stadt und Akt

Jahreszeiten nach 09, Abschnitt 2: Akt 1 Spätsommer bis Frühherbst, Akt 2 Herbst mit erstem Schnee
am Ende, Akt 3 Winter bis Frühjahr, Akt 4 Sommer.

| Stadt          | Akt 1                                                             | Akt 2                                                                                                                                           | Akt 3                                                                                                                        | Akt 4                                                                                                 | Post-Game                                           |
| -------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| Maple Falls    | Umzug, Haus Hayes „Zu verkaufen“, Ahorn mit ersten roten Rändern  | Herbstlaub, Kürbisse auf den Veranden; Haus Hayes verkauft, Umzugswagen der neuen Familie; Nadel-Plakat im Clubraum                             | Schnee, Lichterketten; die neue Familie Hayes hat ein Kind, das nach Schach fragt; am Diner eine Werbetafel von Perfect Move | Sommerferien; Plakat „Daumen drücken!“ an der Schule; Abernathy hat einen jungen Schüler auf der Bank | Ein Brett im Park, an dem jeder spielen darf        |
| Cedar Creek    | Brücke über den Bach im Bau; Plakat von Perfect Move an der Tafel | Brücke fertig (Zedernwald offen); im Schaukasten der Bibliothek die Zeitung von 1858; das Plakat ist überklebt: „Schachabend in der Bibliothek“ | Eis am Bachrand, Rosa angelt mit Mütze; Boateng hat eine neue Stellung auf dem Trockner                                      | Sommer, Mae und Dex im Camp (Zettel an der Tür); Lesesommer der Bibliothek mit Kindern                | Kopie von Hales Seite im Archiv ausgestellt         |
| Riverton       | –                                                                 | Regen; Pavillon geräumt, Bildschirmtische auf der Wiese                                                                                         | Schnee auf den Bildschirmtischen, zwei sind kaputt; Slick spielt in der Bahnhofshalle weiter                                 | Bildschirme abgedeckt; Slick sammelt Unterschriften für den Pavillon und fährt zur Meisterschaft      | Pavillon gehört wieder dem Club                     |
| Ironwood       | –                                                                 | Rauch, erste Kälte; der Club wird verkauft                                                                                                      | Schnee; die Kantine trägt das Logo von Perfect Move, Big Joe fährt den Werksbus; Postamt mit dem gestempelten Brief (R5)     | Werksbus fährt zur Meisterschaft (Crossroads); Hank trainiert Kinder in der Umkleide                  | Die Belegschaft kauft den Club zurück               |
| Silicon Bay    | –                                                                 | –                                                                                                                                               | Akademie, Glas und Kunstlicht                                                                                                | Plakate der Meisterschaft; Nova ist fort; Theo ohne Tablet am Food-Truck                              | Dr. Lins Club ohne Bildschirme in einem alten Laden |
| Port Delacroix | –                                                                 | –                                                                                                                                               | Hurrikan-Spuren, Club in der Turnhalle; Wiederaufbau in drei Stufen                                                          | Musikhaus offen, Schach960 am Abend, Bayou nach dem Hochwasser begehbar                               | Konzert im Musikhaus                                |
| Desert Springs | –                                                                 | –                                                                                                                                               | Erste Wärme, blühende Kakteen; Club in der Garage                                                                            | Mira und Tomás sind unterwegs (Crossroads); Dot vermietet Zimmer an Meisterschaftsfahrer              | Hales Brief als Leihgabe im Antiquariat             |
| Summit City    | –                                                                 | –                                                                                                                                               | –                                                                                                                            | Sommer, Drachenfest am Abend                                                                          | Ward gibt einen Endspielkurs für alle Clubchefs     |

Läden mit neuem Angebot: Mit jedem Akt nehmen die Läden der früheren Städte eine Karte des neuen
Akts auf (zum Preis des neuen Akts), damit sich auch ein Einkauf auf dem Rückweg lohnt; die Liste
gehört in 11 (Karten und Gegenstände).

### 7.3 Freiwillige Entdeckungen für Rückkehrer

- **Funde, die erst später erscheinen:** im Park von Maple Falls ein Ahornblatt mit eingeritzten Zügen
  (ab Akt 2), am Steg von Cedar Creek eine zweite Angel mit Rosas Magnetfigur (ab Akt 3), am Kanal
  von Riverton ein Eiszapfen-Fund nur im Winter (Akt 3), am Diner von Weg 7 das reparierte Neonschild
  (Akt 4, wenn man das „K“ zurückbringt).
- **Revanchen:** Jeder Straßengegner und jedes Clubmitglied spielt nach jeder neuen Nadel eine
  Revanche auf der aktuellen Stärke (R22); der erste Sieg je Akt gibt 10 Münzen.
- **Album:** Je Stadt und Akt ein Foto für Junos Tagebuch, das man nur dort im passenden Akt machen
  kann (Kürbisse in Maple Falls, Schnee auf den Bildschirmtischen in Riverton, Musikhaus mit
  Lichterkette in Port Delacroix).
- **Nebenquests, die sich erst später zeigen:** die neue Familie Hayes in Maple Falls (Akt 3: ihr
  Kind will Schach lernen, Aufgaben aus Kapitel 0 und 1 als Lehrer stellen); Slicks Unterschriften
  in Riverton (Akt 4: zehn Bekannte aus allen Städten unterschreiben); Hank in Ironwood (Akt 4:
  Kindertraining mit Fesselungen); Boatengs neue Trockner-Stellung (jeder Akt eine).
- **Nebenorte:** Kürbishof, Lockport, Steinbruch, Pelikaninsel und Sternwarte haben in jedem späteren
  Akt eine neue Kleinigkeit (Abschnitte 2 bis 5).

### 7.4 Was die Karten schon jetzt vorsehen müssen

Damit die Bühnenbilder die Rückkehr tragen, ohne später neu gezeichnet zu werden:

- `mapleFalls.aussen`: Einfahrt am Haus Hayes frei für den Umzugswagen; Schild „Zu verkaufen“ als
  eigenes Objekt; an jeder Veranda ein Feld für Kürbisse oder Lichterketten (Objektebene); an der
  Schule Platz für eine Plakatwand; am Diner eine leere Werbetafel.
- `mapleFalls.park`: Beginn des Zedernpfads am Nordrand mit umgestürztem Baum (Objekt, das
  verschwindet); Absperrband am Steg (S5, Objekt `absperrungSteg`, nach der ersten Nadel neuer Steg); eine zweite Bank neben Abernathys Bank für seinen Schüler; Startlinie für Jos Rennen
  am Uferweg; ein freier Platz für das öffentliche Brett (Post-Game).
- `mapleFalls.clubraum`: freie Wandfläche für das Nadel-Plakat.
- `mapleFalls.wohnzimmer`: Platz auf der Anrichte für Mamas altes Turnierfoto (ab Akt 2).
- `cedarCreek.aussen`: Brücke mit Schild „Brückenarbeiten“ als Objekt; Anschlagtafel mit wechselnden
  Zetteln (Objekt je Akt); am Bach Platz für eine zweite Angel und Eis am Ufer (Akt 3); Schaukasten
  an der Bibliothek.
- `cedarCreek.archiv`: ein dunkles Regal in einer Ecke, das erst mit Laterne etwas zeigt.
- `cedarCreek.bibliothek`: Wand oder Vitrine für die Kopie von Hales Seite (Post-Game).
- `riverton.aussen` und `riverton.pavillon`: Bildschirmtische als Objektebene mit Bedingung (aufgebaut,
  verschneit, abgedeckt, weg); Pavillontür verschließbar; Tisch für Slicks Unterschriftenliste.
- `ironwood.aussen`: Postamt an der Bahnstation mit Schalter (begehbar oder als Dialog am Fenster);
  Haltebucht für den Werksbus; Tor zum Steinbruch hinter dem Bahnhof.
- `ironwood.kantine`: Wandfläche für das Logo von Perfect Move (Objekt, später entfernt).
- `siliconBay.aussen`: Anleger für die Fähre zur Pelikaninsel; ein leerer Laden mit Schild „Bald
  geöffnet“ (Dr. Lins Club im Post-Game).
- `portDelacroix.aussen`: Fähranleger in beide Richtungen; Steg zum Bayou mit Hochwassermarke.
- `wegDelacroixDesert.canyonpfad`: Abzweig zur Sternwarte, nachts sichtbar (Objekt mit Bedingung).
- `desertSprings.antiquariat`: Vitrine für Hales Brief (Post-Game).
- `wegMapleCedar.landstrasse`: Gatter mit Abzweig zum Kürbishof (siehe Ortsdokument Cedar Creek).
- `crossroads.aussen`: freies Feld hinter der Raststätte für den Jahrmarkt; Viehgatter am Beginn der
  Alten Minenstraße.
- `ghostTown.aussen`: Minentor mit Kette (öffnet mit Pruitt und Laterne).
