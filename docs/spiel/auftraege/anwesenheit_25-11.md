# Anwesenheit in Dialogen (25.11.2026, mittel-4)

Befund des Autors nach einer halben Stunde Spiel auf dem iPhone: Dialoge passen „ganz häufig“ nicht
zu Ort und Anwesenden. Regel des Autors: Wer spricht oder im Text vorkommt, ist anwesend. Er steht
auf der Karte oder kommt sichtbar herein; erzählt der Text einen anderen Ort, geht die Szene dorthin
(Kartenwechsel mit `reise` und Eingang der Zielkarte), oder der Text wird umgeschrieben.

Werkzeug: `python -m pipeline.abenteuer.anwesenheit [--alle] [--bericht DATEI]`, Dauertest
`pipeline/tests/test_abenteuer_anwesenheit.py` (Obergrenze der offenen Funde, darf nur sinken; Akt 1
vollständig angesehen). Drei Prüfungen: Sprecher nicht auf der Karte, Erzählzeile beginnt mit dem
Namen einer abwesenden Figur, Schauplatz im Text passt nicht zur Karte.

## Stand

- Erster Lauf: 234 Funde. Nach Statisten, die eine Figur zeigen (Juno am Bahndamm, Mama im Clubraum,
  Silas als Angler, Odette am Flohmarkt), und Tessa als „Joggerin“: 199.
- Nach den Behebungen in Akt 1 und Juno als Begleiterin: 151 Funde, davon 3 geprüft (passt, mit
  Grund), 1 gemeldet (Juno auf dem Weg nach Riverton), 147 offen in Akt 2 bis 4.

## Behoben in Akt 1

- Diner-Abend: spielte im Wohnzimmer (Hector redete dort, „Gibt es hier Ketchup?“). Jetzt lädt
  Mama im Wohnzimmer ein, ihr geht ins Diner (Kartenwechsel), der Eingang des Diners spielt den
  Abend; Mama steht an der Theke (mapleFalls.mutterDiner), danach geht es nach Hause.
- Erste Nacht: Mama sprach am Morgen im Zimmer des Helden. Jetzt ruft sie von unten herauf, dann
  fällt die Haustür ins Schloss.
- Clubraum, Victor und Graham Hale: Sie kamen nur im Text mit dem Wagen, im Bild stand niemand, und
  dann spielte man gegen Victor oder Victoria. Jetzt stehen beide nach der ersten Nadel im Clubraum
  (mapleFalls.victorClub, haleClub) und gehen am Ende sichtbar zur Tür.
- Mr. Pratt stand im Clubraum nur im Text an der Tür: Jetzt hört man ihn draußen im Flur.
- Aufbruch nach Ironwood: Juno sprach im Wohnzimmer, stand aber vor der Tür. Jetzt klingelt sie,
  der Held geht hinaus, und das Gespräch mit dem Rad führt sie vor dem Haus.
- Ankunft in Cedar Creek: lief am Ende des Flusswegs und erzählte schon die Zwillinge. Jetzt spielt
  sie beim Betreten von Cedar Creek, wo die Zwillinge stehen.
- Sternennacht: Mae, Dex und Mrs. Okafor stehen am Steg, solange sie aussteht.
- Team kommt: Coach und Sam stehen an der Haltestelle und gehen am Ende zur Bibliothek; beim
  Clubkampf stehen sie im Lesesaal (zwei kurze Sätze, wenn man sie anspricht).
- Archiv: Mrs. Okafor wartet unten an der Treppe, bis es geordnet ist, und geht danach hinauf.
- Marian Shaw (Zugpartie am Bahndamm): sitzt jetzt als Statistin vor dem Stellwerk.
- Epilog: begann auch am Brett im Zimmer und erzählte dort Dachboden und Lily. Jetzt geht der Held
  hinauf; Lily steht an der Treppe des Dachbodens und geht zum Schaukelstuhl.

## Begleiter auf Wegen (Teil C, umgesetzt)

Befund des Autors: Laut Tagebuch geht der Held mit Juno zu Fuß nach Cedar Creek, aber Juno wartete
nur im Text am Ortsschild, und am Obststand legte sie einen Dollar in die Dose, ohne da zu sein.

- Mechanismus: Dialogvariable `begleiter` (Kurznamen wie in `#sprecher`, mehrere mit Komma), im
  Spielstand gemerkt (app/src/abenteuer/regeln/gefolge.ts). Wer begleitet, folgt dem Helden ein
  Feld hinter ihm auf seiner Spur, ohne Kollision (oberwelt/gefolgeschicht.ts), kommt beim
  Kartenwechsel mit und erscheint neben ihm. An seinem Platz auf der Karte steht er solange nicht
  (oberwelt/gefolgedaten.ts). Ändert ein Gespräch die Begleiter, stellt sich die Karte neu auf.
  Ohne eigenen Bogen im Paket zeigt er die Platzhalterfigur.
- Juno in Akt 1: Sie steht nach dem Aufbruch am Ortsschild im Park (mapleFalls.junoLandstrasse).
  Wer sie anspricht oder die Landstraße betritt, nimmt sie mit; sie geht über Landstraße und
  Flussweg bis Cedar Creek und bleibt dort beim Helden, bis der Bus nach Hause fährt.
- Prüfung: Begleiter zählen als anwesend (BEGLEITUNG in anwesenheit.py, mit Dauertest, dass Ink sie
  setzt). Neu ist die Prüfung „tagebuch“: Ein Questschritt erzählt „Mit Juno … gehen“, aber die
  Figur ist nirgends Begleiter. Einziger Treffer war „Mit Juno zu Fuß nach Cedar Creek gehen“, jetzt
  erfüllt.
- Offen (Vorschlag je Stelle unten): die übrigen Reiseabschnitte mit Juno (ab Akt 2 nach Riverton,
  Ironwood, Silicon Bay und weiter) und Mama auf der Reise in Akt 3 und 4. Dafür genügt jeweils
  `~ begleiter = "juno"` beim Aufbruch und `~ begleiter = ""` bei der Ankunft, dazu ein Eintrag in
  BEGLEITUNG.

## Offen in Akt 2 bis 4, mit Vorschlag je Stelle

Geordnet nach Akt, Hauptweg vor Nebenweg, dann nach Zahl der Zeilen. Häufig sind Ankünfte am
Übergang (wie Cedar Creek: beim Betreten der Zielkarte spielen) und Reiseabschnitte, auf denen Juno
oder Mama als Begleiter fehlen.


## Akt 2

- sprecher · juno · riverton-aussen.ankunft auf riverton.aussen (Hauptweg, 20×): „Hier bin ich geboren. Also fast.“
  Vorschlag: Begleiter für diesen Reiseabschnitt setzen (Ink: ~ begleiter = …; BEGLEITUNG ergänzen)
- sprecher · slick · riverton-wohnwagen.slick_abschied auf riverton.wohnwagen (Hauptweg, 7×): „Der Alte hat die gebaut. Jedes Jahr einen.“
  Vorschlag: Figur mit Bedingung auf die Karte setzen (Szene, orte.json) oder als gehörte Stimme erzählen
- sprecher · juno · riverton-wohnwagen.turnier_nachricht auf riverton.wohnwagen (Hauptweg, 3×): „Coach Delgado hat geschrieben. Freundschaftsturnier in Ironwood, beim Stahlwerker-Club.“
  Vorschlag: Begleiter für diesen Reiseabschnitt setzen (Ink: ~ begleiter = …; BEGLEITUNG ergänzen)
- sprecher · victor · silicon-bay-aussen.ankunft_zu_fuss auf wegIronwoodSilicon.glasbruecke (Hauptweg, 3×): „Die stören die Sensoren.“
  Vorschlag: Ankunft beim Betreten der Zielkarte spielen (Eingang der Karte), nicht am Übergang
- genannt · bigJoe · ironwood-aussen.kauf auf ironwood.aussen (Hauptweg, 2×): „Big Joe kommt heraus. Er trägt einen Karton vor dem Bauch, oben schauen die Pokale heraus “
  Vorschlag: Figur mit Bedingung auf die Karte setzen oder den Satz so fassen, dass sie woanders ist
- genannt · mutter · ironwood-aussen.kauf auf ironwood.aussen (Hauptweg, 2×): „Mama geht über den Platz, an dem schwarzen Wagen vorbei, und nimmt Big Joe den Karton ab. “
  Vorschlag: Begleiter für diesen Reiseabschnitt setzen (Ink: ~ begleiter = …; BEGLEITUNG ergänzen)
- genannt · juno · ironwood-aussen.einladung auf ironwood.aussen (Hauptweg, 1×): „Juno kommt die Brücke herauf, das Tagebuch unter der Jacke.“
  Vorschlag: Begleiter für diesen Reiseabschnitt setzen (Ink: ~ begleiter = …; BEGLEITUNG ergänzen)
- genannt · juno · riverton-wohnwagen.turnier_nachricht auf riverton.wohnwagen (Hauptweg, 1×): „Juno sieht auf ihr Telefon. Das Licht vom Bildschirm macht ihr Gesicht blau.“
  Vorschlag: Begleiter für diesen Reiseabschnitt setzen (Ink: ~ begleiter = …; BEGLEITUNG ergänzen)
- ort · Wohnwagen · riverton-pavillon.slick_alltag auf riverton.pavillon (Hauptweg, 1×): „Der Wohnwagen ist offen. Komm rein, wenn du magst.“
  Vorschlag: Szene ins Wohnwagen verlegen (reise und Eingang dort) oder die Ortsangabe anpassen
- sprecher · juno · ironwood-aussen.einladung auf ironwood.aussen (Hauptweg, 1×): „Was hat {rv_er} gewollt?“
  Vorschlag: Begleiter für diesen Reiseabschnitt setzen (Ink: ~ begleiter = …; BEGLEITUNG ergänzen)
- sprecher · juno · ironwood-kantine.big_joe_erkennt auf ironwood.kantine (Hauptweg, 1×): „Was tut ihm leid?“
  Vorschlag: Begleiter für diesen Reiseabschnitt setzen (Ink: ~ begleiter = …; BEGLEITUNG ergänzen)
- sprecher · juno · silicon-bay-aussen.ankunft_zu_fuss auf wegIronwoodSilicon.glasbruecke (Hauptweg, 1×): „Ein Lieferroboter. Der bringt Essen.“
  Vorschlag: Begleiter für diesen Reiseabschnitt setzen (Ink: ~ begleiter = …; BEGLEITUNG ergänzen)
- sprecher · albescu · riverton-schuppen.fahrrad auf riverton.schuppen (Nebenweg, 8×): „Meins. Er hat es mir zur Hochzeit gebaut.“
  Vorschlag: Figur mit Bedingung auf die Karte setzen (Szene, orte.json) oder als gehörte Stimme erzählen
- sprecher · juno · ironwood-aussen.bus_silicon_bay_abfahrt auf ironwood.aussen (Nebenweg, 8×): „Ich hab gewartet. Wie heißt er?“
  Vorschlag: Begleiter für diesen Reiseabschnitt setzen (Ink: ~ begleiter = …; BEGLEITUNG ergänzen)
- sprecher · mutter · ironwood-aussen.bus_silicon_bay_abfahrt auf ironwood.aussen (Nebenweg, 5×): „Ich hab Nachtschicht. Die ganze Woche.“
  Vorschlag: Begleiter für diesen Reiseabschnitt setzen (Ink: ~ begleiter = …; BEGLEITUNG ergänzen)
- sprecher · juno · ironwood-aussen.ankunft_zu_fuss auf wegRivertonIronwood.bruecke (Nebenweg, 4×): „Die können hier zählen.“
  Vorschlag: Begleiter für diesen Reiseabschnitt setzen (Ink: ~ begleiter = …; BEGLEITUNG ergänzen)
- sprecher · juno · weg-riverton-ironwood.jh auf wegRivertonIronwood.bruecke (Nebenweg, 4×): „Hier ist was eingeschlagen! In die Dinger, die runden.“
  Vorschlag: Begleiter für diesen Reiseabschnitt setzen (Ink: ~ begleiter = …; BEGLEITUNG ergänzen)
- genannt · juno · ironwood-kantine.mama_nach_partie auf ironwood.kantine (Nebenweg, 3×): „Juno klebt das Foto ins Tagebuch.“
  Vorschlag: Begleiter für diesen Reiseabschnitt setzen (Ink: ~ begleiter = …; BEGLEITUNG ergänzen)
- sprecher · juno · ironwood-kantine.mama_nach_partie auf ironwood.kantine (Nebenweg, 3×): „Mit Glitzer. Diesmal ja.“
  Vorschlag: Begleiter für diesen Reiseabschnitt setzen (Ink: ~ begleiter = …; BEGLEITUNG ergänzen)
- sprecher · mutter · ironwood-aussen.ankunft_zu_fuss auf wegRivertonIronwood.bruecke (Nebenweg, 3×): „Nein.“
  Vorschlag: Begleiter für diesen Reiseabschnitt setzen (Ink: ~ begleiter = …; BEGLEITUNG ergänzen)
- sprecher · victor · silicon-bay-aussen.ankunft_rundgang auf wegIronwoodSilicon.glasbruecke (Nebenweg, 3×): „Gekühlt mit Meerwasser.“
  Vorschlag: Ankunft beim Betreten der Zielkarte spielen (Eingang der Karte), nicht am Übergang
- genannt · omaRuth · ironwood-kantine.mama auf ironwood.kantine (Nebenweg, 2×): „Oma Ruth in der Elm Street weiß, wann der nächste Bus nach Hause fährt.“
  Vorschlag: Figur mit Bedingung auf die Karte setzen oder den Satz so fassen, dass sie woanders ist
- sprecher · joggerin · weg-ironwood-silicon.joggerin_angebot auf wegIronwoodSilicon.glasbruecke (Nebenweg, 2×): „Eine Stellung, sieben Züge, die Uhr läuft. Bereit?“
  Vorschlag: Figur mit Bedingung auf die Karte setzen (Szene, orte.json) oder als gehörte Stimme erzählen
- sprecher · joggerin · weg-ironwood-silicon.joggerin_erstes_treffen auf wegIronwoodSilicon.glasbruecke (Nebenweg, 2×): „Schach? Klar.“
  Vorschlag: Figur mit Bedingung auf die Karte setzen (Szene, orte.json) oder als gehörte Stimme erzählen
- sprecher · juno · riverton-aussen.nova auf riverton.aussen (Nebenweg, 2×): „Nova Sinclair. Landesmeisterin.“
  Vorschlag: Begleiter für diesen Reiseabschnitt setzen (Ink: ~ begleiter = …; BEGLEITUNG ergänzen)
- sprecher · juno · riverton-bahnhofshalle.harlan_erstes_treffen auf riverton.bahnhofshalle (Nebenweg, 2×): „Gegen den hab ich mal gespielt, bei meiner Cousine. Eine Stunde für zwölf Züge.“
  Vorschlag: Begleiter für diesen Reiseabschnitt setzen (Ink: ~ begleiter = …; BEGLEITUNG ergänzen)
- sprecher · juno · silicon-bay-aussen.ankunft_rundgang auf wegIronwoodSilicon.glasbruecke (Nebenweg, 2×): „Wohnst du hier?“
  Vorschlag: Begleiter für diesen Reiseabschnitt setzen (Ink: ~ begleiter = …; BEGLEITUNG ergänzen)
- genannt · juno · ironwood-aussen.bus_silicon_bay_abfahrt auf ironwood.aussen (Nebenweg, 1×): „Juno drückt dir eine kleine Holzkiste mit Stickern in die Hand. Auf dem Deckel in rosa Buc“
  Vorschlag: Begleiter für diesen Reiseabschnitt setzen (Ink: ~ begleiter = …; BEGLEITUNG ergänzen)
- genannt · juno · riverton-aussen.albescu_erstes_treffen auf riverton.aussen (Nebenweg, 1×): „Juno fragt nach dem Weg zu einem Laden, den sie gar nicht sucht. Die Frau stützt sich auf “
  Vorschlag: Begleiter für diesen Reiseabschnitt setzen (Ink: ~ begleiter = …; BEGLEITUNG ergänzen)
- genannt · juno · riverton-bahnhofshalle.uhr auf riverton.bahnhofshalle (Nebenweg, 1×): „Juno schläft auf der Bank ein, den Kopf auf dem Tagebuch.“
  Vorschlag: Begleiter für diesen Reiseabschnitt setzen (Ink: ~ begleiter = …; BEGLEITUNG ergänzen)
- genannt · juno · riverton-bahnhofshalle.uhr_wieder auf riverton.bahnhofshalle (Nebenweg, 1×): „Juno schläft noch auf der Bank. Die Uhr tickt laut in der leeren Halle.“
  Vorschlag: Begleiter für diesen Reiseabschnitt setzen (Ink: ~ begleiter = …; BEGLEITUNG ergänzen)
- genannt · juno · riverton-schuppen.fahrrad auf riverton.schuppen (Nebenweg, 1×): „Juno schreibt ins Tagebuch: „Fahrrad. Grün. Mit Schmetterling.““
  Vorschlag: Begleiter für diesen Reiseabschnitt setzen (Ink: ~ begleiter = …; BEGLEITUNG ergänzen)
- genannt · juno · weg-ironwood-silicon.glasbruecke auf wegIronwoodSilicon.raststaette (Nebenweg, 1×): „Juno geht auf Zehenspitzen und hält sich an dir fest.“
  Vorschlag: Begleiter für diesen Reiseabschnitt setzen (Ink: ~ begleiter = …; BEGLEITUNG ergänzen)
- genannt · mutter · ironwood-aussen.bus_silicon_bay_abfahrt auf ironwood.aussen (Nebenweg, 1×): „Mama zieht dich an sich, kurz und fest. Seit Ironwood tut sie das öfter.“
  Vorschlag: Begleiter für diesen Reiseabschnitt setzen (Ink: ~ begleiter = …; BEGLEITUNG ergänzen)
- genannt · slick · riverton-aussen.wohnwagen_zu auf riverton.aussen (Nebenweg, 1×): „Slick ist noch drüben im Pavillon. Dort triffst du ihn eher als hier.“
  Vorschlag: Figur mit Bedingung auf die Karte setzen oder den Satz so fassen, dass sie woanders ist
- genannt · tamsin · riverton-aussen.eli auf riverton.aussen (Nebenweg, 1×): „Tamsin hat sie hingestellt.“
  Vorschlag: Figur mit Bedingung auf die Karte setzen oder den Satz so fassen, dass sie woanders ist
- ort · Garage · ironwood-kantine.big_joe_nach_kauf auf ironwood.kantine (Nebenweg, 1×): „In der Garage, Kumpel. Schinken haben wir noch.“
  Vorschlag: Szene ins Garage verlegen (reise und Eingang dort) oder die Ortsangabe anpassen
- ort · Garage · ironwood-kantine.big_joe_nach_sieg auf ironwood.kantine (Nebenweg, 1×): „Eine bessere Nadel, Kumpel. {kaufGesehen:In der Garage zählt sie genauso.|Auf meinem Stahl“
  Vorschlag: Szene ins Garage verlegen (reise und Eingang dort) oder die Ortsangabe anpassen
- ort · Schuppen · riverton-aussen.albescu_alltag auf riverton.aussen (Nebenweg, 1×): „Der Schuppen ist offen. Geh nur hinein, hinten unter der Plane steht etwas für dich.“
  Vorschlag: Szene ins Schuppen verlegen (reise und Eingang dort) oder die Ortsangabe anpassen
- ort · Schuppen · riverton-aussen.albescu_erstes_treffen auf riverton.aussen (Nebenweg, 1×): „Im Schuppen hinten steht noch alles, wie mein Mann es gelassen hat. Ich komm nicht hinein.“
  Vorschlag: Szene ins Schuppen verlegen (reise und Eingang dort) oder die Ortsangabe anpassen
- ort · Steg · lockport-aussen.tafel_angebot auf lockport.aussen (Nebenweg, 1×): „Der Steg ist zu, Herbstwartung. Wer zwei Dinge zugleich im Blick hat, darf mit mir hinüber“
  Vorschlag: Szene ins Steg verlegen (reise und Eingang dort) oder die Ortsangabe anpassen
- ort · Umkleide · ironwood-aussen.edna auf ironwood.aussen (Nebenweg, 1×): „Die Umkleide im Werk ist finster.“
  Vorschlag: Szene ins Umkleide verlegen (reise und Eingang dort) oder die Ortsangabe anpassen
- sprecher · henrik · lockport-aussen.taue_geloest auf lockport.aussen (Nebenweg, 1×): „Damit du beim nächsten Boot keine nassen Füße kriegst. Ich hab zwei Paar.“
  Vorschlag: Figur mit Bedingung auf die Karte setzen (Szene, orte.json) oder als gehörte Stimme erzählen
- sprecher · joggerin · weg-ironwood-silicon.joggerin_nach_niederlage auf wegIronwoodSilicon.glasbruecke (Nebenweg, 1×): „Puls bei hundertsechzig, Partie gewonnen. Guter Tag.“
  Vorschlag: Figur mit Bedingung auf die Karte setzen (Szene, orte.json) oder als gehörte Stimme erzählen
- sprecher · joggerin · weg-ironwood-silicon.joggerin_nach_remis auf wegIronwoodSilicon.glasbruecke (Nebenweg, 1×): „Remis. Gleicher Puls, gleiche Zeit, noch eine Runde?“
  Vorschlag: Figur mit Bedingung auf die Karte setzen (Szene, orte.json) oder als gehörte Stimme erzählen
- sprecher · juno · ironwood-aussen.kreidebrett auf ironwood.aussen (Nebenweg, 1×): „Die h-Linie ist breiter als die a-Linie. Aber es sind acht.“
  Vorschlag: Begleiter für diesen Reiseabschnitt setzen (Ink: ~ begleiter = …; BEGLEITUNG ergänzen)
- sprecher · juno · riverton-aussen.kanalweg auf riverton.aussen (Nebenweg, 1×): „Erst nach Hause. Der Zettel vom Coach wartet auf deine Mama.“
  Vorschlag: Begleiter für diesen Reiseabschnitt setzen (Ink: ~ begleiter = …; BEGLEITUNG ergänzen)
- sprecher · juno · riverton-bahnhofshalle.london_nachgespraech auf riverton.bahnhofshalle (Nebenweg, 1×): „Du bist so still. Ist was?“
  Vorschlag: Begleiter für diesen Reiseabschnitt setzen (Ink: ~ begleiter = …; BEGLEITUNG ergänzen)
- sprecher · juno · weg-ironwood-silicon.fund_anstecker auf wegIronwoodSilicon.raststaette (Nebenweg, 1×): „Gratis. Natürlich.“
  Vorschlag: Begleiter für diesen Reiseabschnitt setzen (Ink: ~ begleiter = …; BEGLEITUNG ergänzen)
- sprecher · juno · weg-ironwood-silicon.fund_ohrstoepsel auf wegIronwoodSilicon.glasbruecke (Nebenweg, 1×): „Hat jemand verloren.“
  Vorschlag: Begleiter für diesen Reiseabschnitt setzen (Ink: ~ begleiter = …; BEGLEITUNG ergänzen)
- sprecher · juno · weg-ironwood-silicon.glasbruecke auf wegIronwoodSilicon.raststaette (Nebenweg, 1×): „Woher weißt du, dass das trägt?“
  Vorschlag: Begleiter für diesen Reiseabschnitt setzen (Ink: ~ begleiter = …; BEGLEITUNG ergänzen)
- sprecher · juno · weg-riverton-ironwood.zeitnot_trick auf wegRivertonIronwood.bruecke (Nebenweg, 1×): „Wer baut so etwas?“
  Vorschlag: Begleiter für diesen Reiseabschnitt setzen (Ink: ~ begleiter = …; BEGLEITUNG ergänzen)
- sprecher · ruben · ironwood-aussen.anleger auf ironwood.aussen (Nebenweg, 1×): „Die Fahrt kostet 5 Münzen.“
  Vorschlag: Figur mit Bedingung auf die Karte setzen (Szene, orte.json) oder als gehörte Stimme erzählen
- sprecher · ruben · riverton-aussen.anleger_schild auf riverton.aussen (Nebenweg, 1×): „Die Fahrt kostet 5 Münzen.“
  Vorschlag: Figur mit Bedingung auf die Karte setzen (Szene, orte.json) oder als gehörte Stimme erzählen

## Akt 3

- sprecher · mira · weg-delacroix-desert.mira_stein auf wegDelacroixDesert.canyonpfad (Hauptweg, 5×): „Wer bist du?“
  Vorschlag: Figur mit Bedingung auf die Karte setzen (Szene, orte.json) oder als gehörte Stimme erzählen
- sprecher · juno · desert-springs-aussen.abend_motel auf desertSprings.aussen (Hauptweg, 4×): „Sieben! Ich hab's nachgezählt.“
  Vorschlag: Begleiter für diesen Reiseabschnitt setzen (Ink: ~ begleiter = …; BEGLEITUNG ergänzen)
- sprecher · mutter · desert-springs-aussen.bahnhof_ende auf desertSprings.aussen (Hauptweg, 4×): „Port Delacroix lässt grüßen. Am Musikhaus decken sie das Dach, und Miss Odile sagt, das Sc“
  Vorschlag: Begleiter für diesen Reiseabschnitt setzen (Ink: ~ begleiter = …; BEGLEITUNG ergänzen)
- sprecher · mutter · summit-city-aussen.ankunft_summit auf wegDesertSummit.bergstrasse (Hauptweg, 2×): „Murmeltiere. Die warnen sich.“
  Vorschlag: Begleiter für diesen Reiseabschnitt setzen (Ink: ~ begleiter = …; BEGLEITUNG ergänzen)
- genannt · mutter · desert-springs-aussen.bahnhof_ende auf desertSprings.aussen (Hauptweg, 1×): „Mama ist da. Sonnenbrand auf der Nase, das blaue Heft unter dem Arm.“
  Vorschlag: Begleiter für diesen Reiseabschnitt setzen (Ink: ~ begleiter = …; BEGLEITUNG ergänzen)
- ort · Musikhaus · desert-springs-aussen.bahnhof_ende auf desertSprings.aussen (Hauptweg, 1×): „Port Delacroix lässt grüßen. Am Musikhaus decken sie das Dach, und Miss Odile sagt, das Sc“
  Vorschlag: Szene ins Musikhaus verlegen (reise und Eingang dort) oder die Ortsangabe anpassen
- sprecher · juno · summit-city-aussen.ankunft_summit auf wegDesertSummit.bergstrasse (Hauptweg, 1×): „Das ist von meinem Foto! Da hast du Ketchup am Kinn!“
  Vorschlag: Begleiter für diesen Reiseabschnitt setzen (Ink: ~ begleiter = …; BEGLEITUNG ergänzen)
- sprecher · nova · silicon-bay-serverraum.schummelgeraete_nova auf siliconBay.serverraum (Nebenweg, 11×): „Es steht in meinem Vertrag. Nicht so.“
  Vorschlag: Figur mit Bedingung auf die Karte setzen (Szene, orte.json) oder als gehörte Stimme erzählen
- sprecher · mutter · port-delacroix-turnhalle.vorwurf_ende auf portDelacroix.musikhaus (Nebenweg, 6×): „Ich weiß, wie sich das anfühlt. Wenn eine ganze Halle dich ansieht.“
  Vorschlag: Begleiter für diesen Reiseabschnitt setzen (Ink: ~ begleiter = …; BEGLEITUNG ergänzen)
- sprecher · mutter · port-delacroix-turnhalle.vorwurf_ende auf portDelacroix.turnhalle (Nebenweg, 6×): „Ich weiß, wie sich das anfühlt. Wenn eine ganze Halle dich ansieht.“
  Vorschlag: Begleiter für diesen Reiseabschnitt setzen (Ink: ~ begleiter = …; BEGLEITUNG ergänzen)
- genannt · remy · port-delacroix-aussen.bretter_vollstaendig auf portDelacroix.aussen (Nebenweg, 4×): „Remy stimmt am anderen Ende seine Trompete. Er sieht auf den Karren.“
  Vorschlag: Figur mit Bedingung auf die Karte setzen oder den Satz so fassen, dass sie woanders ist
- ort · Turnhalle · port-delacroix-aussen.bretter_vollstaendig auf portDelacroix.aussen (Nebenweg, 4×): „In der Turnhalle sortiert Miss Odile, was du gebracht hast. Was nicht zusammenpasst, legt “
  Vorschlag: Szene ins Turnhalle verlegen (reise und Eingang dort) oder die Ortsangabe anpassen
- sprecher · juno · silicon-bay-aussen.hotel_morgen auf siliconBay.aussen (Nebenweg, 4×): „Pass auf ihn auf.“
  Vorschlag: Begleiter für diesen Reiseabschnitt setzen (Ink: ~ begleiter = …; BEGLEITUNG ergänzen)
- sprecher · mamaBear · weg-desert-summit.funkschach_ende auf wegDesertSummit.diner (Nebenweg, 4×): „Gut gespielt, {held} Junior. Ab heute ist das dein Funkname.“
  Vorschlag: Figur mit Bedingung auf die Karte setzen (Szene, orte.json) oder als gehörte Stimme erzählen
- sprecher · victor · silicon-bay-lobby.vitrine_victor auf siliconBay.lobby (Nebenweg, 3×): „Mein … der Vater vom Vater vom Großvater meines Vaters. Er hat Brücken gebaut.“
  Vorschlag: Figur mit Bedingung auf die Karte setzen (Szene, orte.json) oder als gehörte Stimme erzählen
- genannt · nova · silicon-bay-serverraum.schummelgeraete_nova auf siliconBay.serverraum (Nebenweg, 2×): „Nova zieht die Ärmel über die Hände.“
  Vorschlag: Figur mit Bedingung auf die Karte setzen oder den Satz so fassen, dass sie woanders ist
- sprecher · celeste · port-delacroix-werkstatt.henri_foto auf portDelacroix.musikhaus (Nebenweg, 2×): „Papa, wo ist mein Ladekabel … Schach?“
  Vorschlag: Figur mit Bedingung auf die Karte setzen (Szene, orte.json) oder als gehörte Stimme erzählen
- sprecher · faehrmann · silicon-bay-aussen.inselfaehre auf siliconBay.hafen (Nebenweg, 2×): „Heute ist nicht Sonntag. Unter der Woche fahr ich nur Leute, die man hier kennt.“
  Vorschlag: Figur mit Bedingung auf die Karte setzen (Szene, orte.json) oder als gehörte Stimme erzählen
- sprecher · ferris · weg-delacroix-desert.seilschaft_nochmal auf wegDelacroixDesert.felsbogen (Nebenweg, 2×): „Noch einmal? Schau oben genau hin, dann ruf sie ihr zu.“
  Vorschlag: Figur mit Bedingung auf die Karte setzen (Szene, orte.json) oder als gehörte Stimme erzählen
- sprecher · mutter · desert-springs-aussen.highway auf desertSprings.aussen (Nebenweg, 2×): „Dot leiht uns ihr Auto. Drei Wochen Urlaub, und wir sehen mehr als vom Zug aus.“
  Vorschlag: Begleiter für diesen Reiseabschnitt setzen (Ink: ~ begleiter = …; BEGLEITUNG ergänzen)
- sprecher · mutter · port-delacroix-aussen.ankunft_zu_fuss auf wegSiliconDelacroix.deich (Nebenweg, 2×): „Ich geh zum Notzelt, da brauchen sie Hände. Das Turnier ist in der Turnhalle.“
  Vorschlag: Begleiter für diesen Reiseabschnitt setzen (Ink: ~ begleiter = …; BEGLEITUNG ergänzen)
- sprecher · nova · silicon-bay-serverraum.schummelgeraete auf siliconBay.serverraum (Nebenweg, 2×): „Bitte.“
  Vorschlag: Figur mit Bedingung auf die Karte setzen (Szene, orte.json) oder als gehörte Stimme erzählen
- sprecher · victor · silicon-bay-lobby.vitrine_erstmals auf siliconBay.lobby (Nebenweg, 2×): „Hale. Ingenieure seit 1850. Von der Brücke zum Algorithmus.“
  Vorschlag: Figur mit Bedingung auf die Karte setzen (Szene, orte.json) oder als gehörte Stimme erzählen
- sprecher · wren · weg-delacroix-desert.seilschaft_ende auf wegDelacroixDesert.felsbogen (Nebenweg, 2×): „Du hast die Stellung im Kopf behalten. Hier, der Karabiner gehört dir.“
  Vorschlag: Figur mit Bedingung auf die Karte setzen (Szene, orte.json) oder als gehörte Stimme erzählen
- genannt · juno · desert-springs-aussen.highway auf desertSprings.aussen (Nebenweg, 1×): „Juno hat dir eine Seite im Tagebuch geschenkt, leer, mit einem Rahmen aus Glitzer: Für das“
  Vorschlag: Begleiter für diesen Reiseabschnitt setzen (Ink: ~ begleiter = …; BEGLEITUNG ergänzen)
- genannt · mutter · weg-silicon-delacroix.bug auf wegSiliconDelacroix.faehre (Nebenweg, 1×): „Mama steht viel an der Reling. Ihr beide spielt auf Junos Reisebrett, das bei jedem Wellen“
  Vorschlag: Begleiter für diesen Reiseabschnitt setzen (Ink: ~ begleiter = …; BEGLEITUNG ergänzen)
- genannt · nova · silicon-bay-serverraum.schummelgeraete auf siliconBay.serverraum (Nebenweg, 1×): „Nova steht in der Tür, ohne Kamera, in einem Pullover, der ihr zu groß ist.“
  Vorschlag: Figur mit Bedingung auf die Karte setzen oder den Satz so fassen, dass sie woanders ist
- genannt · tobias · weg-delacroix-desert.ereignis_seilschaft auf wegDelacroixDesert.felsbogen (Nebenweg, 1×): „Wren winkt von unten, Tess von weit oben. Das Seil ist straff.“
  Vorschlag: Figur mit Bedingung auf die Karte setzen oder den Satz so fassen, dass sie woanders ist
- genannt · tobias · weg-delacroix-desert.seilschaft_nochmal auf wegDelacroixDesert.felsbogen (Nebenweg, 1×): „Wren greift ins Leere. Die Stellung ist unten nicht ganz angekommen.“
  Vorschlag: Figur mit Bedingung auf die Karte setzen oder den Satz so fassen, dass sie woanders ist
- ort · Halle · desert-springs-aussen.bahnhof auf desertSprings.aussen (Nebenweg, 1×): „Am alten Bahnhof hält einmal am Tag ein Zug. In der Halle ist ein Antiquariat.“
  Vorschlag: Szene ins Halle verlegen (reise und Eingang dort) oder die Ortsangabe anpassen
- ort · Musikhaus · port-delacroix-aussen.ankunft_zu_fuss auf wegSiliconDelacroix.deich (Nebenweg, 1×): „Das Musikhaus. Mein Vater hat die Orgel darin gestimmt.“
  Vorschlag: Ankunft beim Betreten der Zielkarte spielen (Eingang der Karte), nicht am Übergang
- ort · Musikhaus · port-delacroix-aussen.bauzaun auf portDelacroix.aussen (Nebenweg, 1×): „Der Bauzaun ist weg. Am Musikhaus hängt ein neues Schild, und drinnen spielt jemand.“
  Vorschlag: Szene ins Musikhaus verlegen (reise und Eingang dort) oder die Ortsangabe anpassen
- ort · Turnhalle · port-delacroix-turnhalle.odile_clubkampf auf portDelacroix.musikhaus (Nebenweg, 1×): „Die Turnhalle ist voll. Sie sind alle gekommen, um zu sehen, wer da in einen Rucksack flüs“
  Vorschlag: Szene ins Turnhalle verlegen (reise und Eingang dort) oder die Ortsangabe anpassen
- sprecher · ferris · weg-delacroix-desert.seilschaft_runde auf wegDelacroixDesert.felsbogen (Nebenweg, 1×): „Schau genau hin. Unten sieht Wren das Brett nicht.“
  Vorschlag: Figur mit Bedingung auf die Karte setzen (Szene, orte.json) oder als gehörte Stimme erzählen
- sprecher · ferris · weg-delacroix-desert.seilschaft_start auf wegDelacroixDesert.felsbogen (Nebenweg, 1×): „Ich zeige dir oben die Stellung. Merk sie dir und ruf sie Wren zu!“
  Vorschlag: Figur mit Bedingung auf die Karte setzen (Szene, orte.json) oder als gehörte Stimme erzählen
- sprecher · juno · silicon-bay-lobby.victor_falsch auf siliconBay.aussen (Nebenweg, 1×): „Vielleicht ist sie im Turnier besser. Manche sind das.“
  Vorschlag: Begleiter für diesen Reiseabschnitt setzen (Ink: ~ begleiter = …; BEGLEITUNG ergänzen)
- sprecher · kira · hochebene.diplom_ende auf hochebene.schule (Nebenweg, 1×): „Eins hab ich extra gemalt. Für den Prüfer.“
  Vorschlag: Figur mit Bedingung auf die Karte setzen (Szene, orte.json) oder als gehörte Stimme erzählen
- sprecher · kira · hochebene.diplom_nochmal auf hochebene.schule (Nebenweg, 1×): „Die Kinder warten. Sie spielen so lange Falke und Bison.“
  Vorschlag: Figur mit Bedingung auf die Karte setzen (Szene, orte.json) oder als gehörte Stimme erzählen
- sprecher · kira · hochebene.diplom_start auf hochebene.schule (Nebenweg, 1×): „Die Diplome hab ich gemalt! Mit Falke und Bison.“
  Vorschlag: Figur mit Bedingung auf die Karte setzen (Szene, orte.json) oder als gehörte Stimme erzählen
- sprecher · mamaBear · weg-desert-summit.funkschach_partie auf wegDesertSummit.diner (Nebenweg, 1×): „Hier Mama Bear, Pause oben in der Haltebucht. Ich sag dir meine Züge an, du hörst gut hin.“
  Vorschlag: Figur mit Bedingung auf die Karte setzen (Szene, orte.json) oder als gehörte Stimme erzählen
- sprecher · wren · weg-delacroix-desert.seilschaft_start auf wegDelacroixDesert.felsbogen (Nebenweg, 1×): „Wir spielen eine Partie, ein Zug pro Seillänge. Aber ich höre Tess nicht mehr!“
  Vorschlag: Figur mit Bedingung auf die Karte setzen (Szene, orte.json) oder als gehörte Stimme erzählen

## Akt 4

- sprecher · pruitt · ghost-town-aussen.grab_erstes auf ghostTown.aussen (Hauptweg, 5×): „Pruitt. Ich bin die Einwohnerzahl.“
  Vorschlag: Figur mit Bedingung auf die Karte setzen (Szene, orte.json) oder als gehörte Stimme erzählen
- sprecher · sam · pinewood-camp-aussen.lagerfeuer_abend auf pinewoodCamp.aussen (Hauptweg, 5×): „Die Chefin ist zurück!“
  Vorschlag: Figur mit Bedingung auf die Karte setzen (Szene, orte.json) oder als gehörte Stimme erzählen
- sprecher · juno · capital-arena-aussen.arena_ankunft auf capitalArena.aussen (Hauptweg, 4×): „Sechzehn Punkte für Silber, zweiundzwanzig für Gold. Du hast … {ligapunkte()}.“
  Vorschlag: Begleiter für diesen Reiseabschnitt setzen (Ink: ~ begleiter = …; BEGLEITUNG ergänzen)
- sprecher · juno · ghost-town-aussen.nacht_ambrose auf ghostTown.aussen (Hauptweg, 4×): „Glitzer ist für alles, was man nicht vergessen will. Das ist die Regel.“
  Vorschlag: Begleiter für diesen Reiseabschnitt setzen (Ink: ~ begleiter = …; BEGLEITUNG ergänzen)
- genannt · sam · pinewood-camp-aussen.lagerfeuer_abend auf pinewoodCamp.aussen (Hauptweg, 2×): „Sam stellt eine Dame mitten in die feindliche Stellung, aus der Hand.“
  Vorschlag: Figur mit Bedingung auf die Karte setzen oder den Satz so fassen, dass sie woanders ist
- ort · Saloon · ghost-town-aussen.nacht_ambrose auf ghostTown.aussen (Hauptweg, 2×): „Im Saloon kocht Mr. Pruitt Bohnen. Juno und {rivale} streiten, ob man eine ganze Partie in“
  Vorschlag: Szene ins Saloon verlegen (reise und Eingang dort) oder die Ortsangabe anpassen
- sprecher · juno · pinewood-camp-aussen.ankunft_camp auf wegCrossroadsPinewood.riesenbaeume (Hauptweg, 2×): „Die kennen sich alle seit einer Woche. Mae hat allen die Sterne erklärt.“
  Vorschlag: Begleiter für diesen Reiseabschnitt setzen (Ink: ~ begleiter = …; BEGLEITUNG ergänzen)
- sprecher · victor · summit-city-huette.victor_krise auf summitCity.huette (Hauptweg, 2×): „Es hat gesagt, plus zwei Komma eins. Die ganze Zeit.“
  Vorschlag: Figur mit Bedingung auf die Karte setzen (Szene, orte.json) oder als gehörte Stimme erzählen
- genannt · dex · pinewood-camp-aussen.ankunft_camp auf wegCrossroadsPinewood.riesenbaeume (Hauptweg, 1×): „Dex hat etwas gebaut, das Marshmallows von selbst dreht. Es funktioniert fast.“
  Vorschlag: Ankunft beim Betreten der Zielkarte spielen (Eingang der Karte), nicht am Übergang
- genannt · mae · pinewood-camp-aussen.ankunft_camp auf wegCrossroadsPinewood.riesenbaeume (Hauptweg, 1×): „Mae hat ihr Teleskop dabei. Lou hat Muscheln im Haar und einen Plan.“
  Vorschlag: Ankunft beim Betreten der Zielkarte spielen (Eingang der Karte), nicht am Übergang
- genannt · nova · capital-arena-aussen.arena_ankunft auf capitalArena.aussen (Hauptweg, 1×): „Nova dreht sich um. Sie sieht dich über die ganze Halle hinweg und nickt – einmal.“
  Vorschlag: Ankunft beim Betreten der Zielkarte spielen (Eingang der Karte), nicht am Übergang
- genannt · pruitt · ghost-town-aussen.grab_erstes auf ghostTown.aussen (Hauptweg, 1×): „Mr. Pruitt nimmt den Hut ab.“
  Vorschlag: Figur mit Bedingung auf die Karte setzen oder den Satz so fassen, dass sie woanders ist
- ort · Clubraum · pinewood-camp-aussen.lagerfeuer_abend auf pinewoodCamp.aussen (Hauptweg, 1×): „Die erste. Im Clubraum.“
  Vorschlag: Szene ins Clubraum verlegen (reise und Eingang dort) oder die Ortsangabe anpassen
- sprecher · juno · crossroads-aussen.ankunft_crossroads auf wegSummitCrossroads.praerie (Hauptweg, 1×): „Mae hat geschrieben: Sie und Dex sind im Pinewood Camp, den Fernwanderweg hoch in den Wald“
  Vorschlag: Begleiter für diesen Reiseabschnitt setzen (Ink: ~ begleiter = …; BEGLEITUNG ergänzen)
- sprecher · juno · ghost-town-aussen.grab_erstes auf ghostTown.aussen (Hauptweg, 1×): „Ist er hier? Ist das seiner?“
  Vorschlag: Begleiter für diesen Reiseabschnitt setzen (Ink: ~ begleiter = …; BEGLEITUNG ergänzen)
- sprecher · mutter · crossroads-aussen.ankunft_crossroads auf wegSummitCrossroads.praerie (Hauptweg, 1×): „Alle Wege führen zur Capital Arena. Und alle machen hier Pause.“
  Vorschlag: Begleiter für diesen Reiseabschnitt setzen (Ink: ~ begleiter = …; BEGLEITUNG ergänzen)
- sprecher · pruitt · ghost-town-saloon.victor_nach_fernpartie auf ghostTown.aussen (Hauptweg, 1×): „Bleibt über Nacht. Wenn es dunkel ist, stehen über Ghost Town mehr Sterne als Häuser.“
  Vorschlag: Figur mit Bedingung auf die Karte setzen (Szene, orte.json) oder als gehörte Stimme erzählen
- sprecher · victor · capital-arena-ubahnhof.mo_victor auf capitalArena.ubahnhof (Nebenweg, 6×): „Sag es keinem. Hier unten weiß niemand, wer mein Vater ist.“
  Vorschlag: Figur mit Bedingung auf die Karte setzen (Szene, orte.json) oder als gehörte Stimme erzählen
- sprecher · abe · weg-ghost-capital.ereignis_weltschachtag auf wegGhostCapital.seeufer (Nebenweg, 4×): „Abe Lindgren, Leuchtturmwärter. Heute bin ich auch Schiedsrichter.“
  Vorschlag: Figur mit Bedingung auf die Karte setzen (Szene, orte.json) oder als gehörte Stimme erzählen
- sprecher · ike · jahrmarkt.schachautomat_geloest auf jahrmarkt.festplatz (Nebenweg, 4×): „Erwischt! Ich bin Ike.“
  Vorschlag: Figur mit Bedingung auf die Karte setzen (Szene, orte.json) oder als gehörte Stimme erzählen
- sprecher · sam · pinewood-camp-aussen.tandem_angebot auf pinewoodCamp.aussen (Nebenweg, 4×): „Noch eine Runde Tandem? Ich nehm das Brett neben dir.“
  Vorschlag: Figur mit Bedingung auf die Karte setzen (Szene, orte.json) oder als gehörte Stimme erzählen
- genannt · sam · pinewood-camp-aussen.tandem_angebot auf pinewoodCamp.aussen (Nebenweg, 2×): „Sam winkt mit einem Springer. Dex und Mae sitzen schon am zweiten Brett.“
  Vorschlag: Figur mit Bedingung auf die Karte setzen oder den Satz so fassen, dass sie woanders ist
- sprecher · abe · weg-ghost-capital.weltschachtag_abschluss auf wegGhostCapital.seeufer (Nebenweg, 2×): „Und jetzt die Partie gegen die Welt. Ich spiele gegen alle hier, jeder stimmt über den näc“
  Vorschlag: Figur mit Bedingung auf die Karte setzen (Szene, orte.json) oder als gehörte Stimme erzählen
- sprecher · abe · weg-ghost-capital.weltschachtag_funk auf wegGhostCapital.seeufer (Nebenweg, 2×): „Gut gestimmt. Das geht ins Logbuch.“
  Vorschlag: Figur mit Bedingung auf die Karte setzen (Szene, orte.json) oder als gehörte Stimme erzählen
- sprecher · ezra · weg-crossroads-pinewood.ereignis_lebendschach auf wegCrossroadsPinewood.riesenbaeume (Nebenweg, 2×): „Ezra, Betreuer im Camp. Unser Feldherr der Weißen liegt mit Fieber im Zelt.“
  Vorschlag: Figur mit Bedingung auf die Karte setzen (Szene, orte.json) oder als gehörte Stimme erzählen
- sprecher · ezra · weg-crossroads-pinewood.lebendschach_angebot auf wegCrossroadsPinewood.riesenbaeume (Nebenweg, 2×): „Die Kinder ziehen erst, wenn sie den Zug laut hören. Und wer geschlagen werden soll, prote“
  Vorschlag: Figur mit Bedingung auf die Karte setzen (Szene, orte.json) oder als gehörte Stimme erzählen
- sprecher · juno · capital-arena-aussen.ankunft_zu_fuss auf wegGhostCapital.leuchtturm (Nebenweg, 2×): „Das kommt ins Tagebuch. Ich hab zwei dabei.“
  Vorschlag: Begleiter für diesen Reiseabschnitt setzen (Ink: ~ begleiter = …; BEGLEITUNG ergänzen)
- sprecher · juno · crossroads-aussen.coach auf crossroads.aussen (Nebenweg, 2×): „Carla spielt Brett drei. Sie hat gesagt, nur dieses eine Mal.“
  Vorschlag: Begleiter für diesen Reiseabschnitt setzen (Ink: ~ begleiter = …; BEGLEITUNG ergänzen)
- sprecher · juno · crossroads-raststaette.fund_postkarte auf crossroads.raststaette (Nebenweg, 2×): „Wir waren überall! Die kommt ins Tagebuch.“
  Vorschlag: Begleiter für diesen Reiseabschnitt setzen (Ink: ~ begleiter = …; BEGLEITUNG ergänzen)
- sprecher · juno · summit-city-huette.ward_nadel auf summitCity.huette (Nebenweg, 2×): „Acht! Acht!“
  Vorschlag: Begleiter für diesen Reiseabschnitt setzen (Ink: ~ begleiter = …; BEGLEITUNG ergänzen)
- sprecher · tamsin · crossroads-aussen.slick auf crossroads.aussen (Nebenweg, 2×): „Hast du den Springer?“
  Vorschlag: Figur mit Bedingung auf die Karte setzen (Szene, orte.json) oder als gehörte Stimme erzählen
- genannt · bigJoe · capital-arena-aussen.ankunft_zu_fuss auf wegGhostCapital.leuchtturm (Nebenweg, 1×): „Big Joe braucht allein zwei Stufen. Dr. Lin ohne Kittel.“
  Vorschlag: Ankunft beim Betreten der Zielkarte spielen (Eingang der Karte), nicht am Übergang
- genannt · juno · weg-summit-crossroads.bisons auf wegSummitCrossroads.geysirbecken (Nebenweg, 1×): „Juno malt einen Bison ins Tagebuch, mit Glitzer.“
  Vorschlag: Begleiter für diesen Reiseabschnitt setzen (Ink: ~ begleiter = …; BEGLEITUNG ergänzen)
- genannt · mutter · pinewood-camp-aussen.es_ist_still auf wegCrossroadsPinewood.riesenbaeume (Nebenweg, 1×): „Mama geht ein wenig schneller.“
  Vorschlag: Begleiter für diesen Reiseabschnitt setzen (Ink: ~ begleiter = …; BEGLEITUNG ergänzen)
- genannt · mutter · summit-city-huette.ward_laurie auf summitCity.huette (Nebenweg, 1×): „Mama sagt nichts. Sie setzt sich und steckt die Hände in die Ärmel, und ihre Augen glänzen“
  Vorschlag: Begleiter für diesen Reiseabschnitt setzen (Ink: ~ begleiter = …; BEGLEITUNG ergänzen)
- genannt · pruitt · goldmine.eingang auf ghostTown.aussen (Nebenweg, 1×): „Mr. Pruitt hat die Bretter vom Stolleneingang genommen. Die Laterne wirft einen Kreis auf “
  Vorschlag: Figur mit Bedingung auf die Karte setzen oder den Satz so fassen, dass sie woanders ist
- genannt · slick · capital-arena-aussen.ankunft_zu_fuss auf wegGhostCapital.leuchtturm (Nebenweg, 1×): „Slick auf dem Geländer, mit drei Kindern.“
  Vorschlag: Ankunft beim Betreten der Zielkarte spielen (Eingang der Karte), nicht am Übergang
- genannt · ward · capital-arena-aussen.ankunft_zu_fuss auf wegGhostCapital.leuchtturm (Nebenweg, 1×): „Ward steht ein wenig abseits und betrachtet alles, als wäre es eine Stellung.“
  Vorschlag: Ankunft beim Betreten der Zielkarte spielen (Eingang der Karte), nicht am Übergang
- ort · Steg · pinewood-camp-aussen.steg auf pinewoodCamp.aussen (Nebenweg, 1×): „Der Steg ragt in den See. Das Wasser ist so klar, dass man die Fische zählen könnte.“
  Vorschlag: Szene ins Steg verlegen (reise und Eingang dort) oder die Ortsangabe anpassen
- ort · Steg · weg-ghost-capital.tafel auf wegGhostCapital.seeufer (Nebenweg, 1×): „Am Steg hängt eine Tafel mit drei Diagrammen: „Im Endspiel ist der König eine Figur. Bring“
  Vorschlag: Szene ins Steg verlegen (reise und Eingang dort) oder die Ortsangabe anpassen
- ort · Steg · weg-summit-crossroads.zurueck_summit auf wegSummitCrossroads.geysirbecken (Nebenweg, 1×): „Der Steg führt zurück, bergauf nach Summit City.“
  Vorschlag: Szene ins Steg verlegen (reise und Eingang dort) oder die Ortsangabe anpassen
- sprecher · abe · weg-ghost-capital.weltschachtag_angebot auf wegGhostCapital.seeufer (Nebenweg, 1×): „Das Eis schmilzt, die Bretter nicht. Wir warten.“
  Vorschlag: Figur mit Bedingung auf die Karte setzen (Szene, orte.json) oder als gehörte Stimme erzählen
- sprecher · abe · weg-ghost-capital.weltschachtag_nochmal auf wegGhostCapital.seeufer (Nebenweg, 1×): „Nicht ganz. Ein Vorteil ist wie ein Fisch an der Angel: Man muss ihn noch an Land ziehen, “
  Vorschlag: Figur mit Bedingung auf die Karte setzen (Szene, orte.json) oder als gehörte Stimme erzählen
- sprecher · ezra · weg-crossroads-pinewood.lebendschach_ende auf wegCrossroadsPinewood.riesenbaeume (Nebenweg, 1×): „Gut kommandiert. Die Kinder wollen ein Foto mit dir.“
  Vorschlag: Figur mit Bedingung auf die Karte setzen (Szene, orte.json) oder als gehörte Stimme erzählen
- sprecher · greifarm · weg-pinewood-ghost.greifarm_ende auf wegPinewoodGhost.tankstelle (Nebenweg, 1×): „„Danke für die Partie.““
  Vorschlag: Figur mit Bedingung auf die Karte setzen (Szene, orte.json) oder als gehörte Stimme erzählen
- sprecher · juno · ghost-town-aussen.ankunft_zu_fuss auf wegPinewoodGhost.staubstrasse (Nebenweg, 1×): „Guck mal. Es sieht aus wie ein altes Foto.“
  Vorschlag: Begleiter für diesen Reiseabschnitt setzen (Ink: ~ begleiter = …; BEGLEITUNG ergänzen)
- sprecher · juno · summit-city-aussen.weg_crossroads auf summitCity.aussen (Nebenweg, 1×): „Die Seite für die achte Nadel ist voll. Jetzt fehlt nur noch die Meisterschaft.“
  Vorschlag: Begleiter für diesen Reiseabschnitt setzen (Ink: ~ begleiter = …; BEGLEITUNG ergänzen)
- sprecher · juno · weg-crossroads-pinewood.greta_erstes_treffen auf wegCrossroadsPinewood.huetten (Nebenweg, 1×): „Wo ist das Brett?“
  Vorschlag: Begleiter für diesen Reiseabschnitt setzen (Ink: ~ begleiter = …; BEGLEITUNG ergänzen)
- sprecher · mutter · capital-arena-aussen.ankunft_zu_fuss auf wegGhostCapital.leuchtturm (Nebenweg, 1×): „Sie sind alle gekommen.“
  Vorschlag: Begleiter für diesen Reiseabschnitt setzen (Ink: ~ begleiter = …; BEGLEITUNG ergänzen)
- sprecher · mutter · summit-city-aussen.weg_crossroads auf summitCity.aussen (Nebenweg, 1×): „Bis zur Capital Arena sind es noch ein paar Tage. Über die Geysire, dann nach Crossroads.“
  Vorschlag: Begleiter für diesen Reiseabschnitt setzen (Ink: ~ begleiter = …; BEGLEITUNG ergänzen)
- sprecher · mutter · summit-city-huette.ward_laurie auf summitCity.huette (Nebenweg, 1×): „Mrs. Ward.“
  Vorschlag: Begleiter für diesen Reiseabschnitt setzen (Ink: ~ begleiter = …; BEGLEITUNG ergänzen)
- sprecher · pruitt · ghost-town-saloon.victor_aufstellen auf ghostTown.aussen (Nebenweg, 1×): „Ich hab hier dreißig Jahre nach Gold gesucht. Ich glaub, ich hab die ganze Zeit auf was an“
  Vorschlag: Figur mit Bedingung auf die Karte setzen (Szene, orte.json) oder als gehörte Stimme erzählen
