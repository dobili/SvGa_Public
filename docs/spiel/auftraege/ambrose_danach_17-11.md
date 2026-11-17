# Ambrose nach dem Abschied (Q21-5): Werkzeug, Behebung, Prüfung (17.11.2026)

Bericht des Helfers; Stand vor dem Einmischen von beta 96916836 (danach folgt der eilige Spieler auch der Heimfahrt zu Mamas Verbot: 36 Quests offen, 10 Orte unbesucht). Alle Ink-Änderungen mit dem Edit-Werkzeug, je Datei frisch gelesen.
Die Knoten der anderen Helfer (weg-maple-cedar `tafel`/`juno_weg`, clubraum Sam, wohnzimmer
`aufbruch`, cedar-creek-aussen `kettering`, „Zählen ist alles“) sind nicht angefasst.

## 1. Das Werkzeug

Dateien (alle unter 400 Zeilen, Kommentare nach Regel 3):

- `pipeline/abenteuer/ambrose-danach.cjs` (Aufruf, Abgehen der Welt, Bericht)
- `pipeline/abenteuer/ambrose-danach-beobachter.cjs` (hört über `st.leser`/`st.chaos` mit)
- `pipeline/abenteuer/ambrose-danach-eilig.cjs` (Spieler „eilig“)
- `pipeline/abenteuer/ambrose-danach-launisch.cjs` (Spieler „launisch“)
- `pipeline/tests/test_abenteuer_ambrose_danach.py` (5 Tests; 3 davon mit `ABENTEUER_SIMULATION=1`, etwa 2 Minuten)
- Gesamtsimulation, zwei kleine Eingriffe: Haken `st.auslassen?.(welt, st, karte, objekt)` in
  `gesamtsimulation.cjs` (`besucheKarte`, 2 Zeilen; Datei jetzt 397 Zeilen) und Export `nachbarorte` in
  `gesamtsimulation-rueckkehr.cjs`. Ohne Haken verhält sich die Simulation wie vorher (Startwert 1, 2, 3 geprüft).
- `CLAUDE.md`: eine Zeile im Abschnitt Befehle.

Aufruf: `node pipeline/abenteuer/ambrose-danach.cjs [--startwert 1] [--spieler gruendlich,eilig,launisch] [--sekunden 600] [--hinweise] [--abdeckung]`.
Ausgabe: je Fund eine Zeile (`Zeile|Wahl|Partie|Moment`, Datei.Knoten oder Begegnung, Text), letzter
Satz „N Funde“, Rückgabewert 1 bei Funden oder wenn ein Spieler den Abschied nicht erreicht.
Laufzeit: etwa 110 Sekunden für die Vorgabe (gründlich + eilig).

### Was der Lauf tut

1. **Bis zum Abschied** spielt die unveränderte Gesamtsimulation (`erkunde`), angehalten, sobald
   `abschiedGesehen` im Stand steht. Drei Spieler:
   - **gruendlich**: fasst alles an (wie die Gesamtsimulation). Beim Abschied 6 Quests offen, nur der Bayou unbesucht.
   - **eilig**: Übergänge in Abstecher und Nebenorte (Hochebene, Weg zum Pinewood Camp, Pinewood Camp,
     Weg nach Ghost Town, Kürbishof, Lockport, Steinbruch, Sternwarte, Pelikaninsel, Goldmine, Bayou)
     bleiben bis zum Abschied zu; in Orten ohne offene Hauptquest fasst er nichts an, sonst nur
     Figuren. Nach Ghost Town kommt er über Darlenes Schlüssel und die Alte Minenstraße. Beim Abschied
     47 bis 49 Quests offen, 11 Orte nie besucht. So laufen Pinewood-Ankunft, Lagerfeuer, Gretas
     erstes Treffen, Hochebene, alle Nebenorte, die Erinnerungen New York, London, Werkstatt,
     Hastings und fast alle Dinge zum Ansehen erst **nach** dem Abschied.
   - **launisch** (nur auf Wunsch, für die Suche mit vielen Startwerten): lässt je nach Startwert ein
     Drittel aller Figuren und Dinge liegen, außer was die Hauptgeschichte braucht (aus den
     Ink-Quelltexten geschätzt: 440 von rund 1100 Knoten gelten als gebraucht, 352 von 488
     Einstiegen sind frei). So bleiben Nebenquests mitten im Lauf stehen (Formular gefunden, nicht
     entziffert). Erreicht den Abschied bei etwa der Hälfte der Startwerte; sonst meldet das Werkzeug das.
2. **Nach dem Abschied** hängt der Beobachter am Stand und der Spieler geht reihum in jeden besuchten
   Ort (wie mit der Monatskarte), von dort zu Fuß in angrenzende, noch nie besuchte Orte und in
   Erinnerungen. Auf jeder Karte: jede Figur, jedes Ding, jeder Auslöser, mehrmals; bei jeder Auswahl
   der Reihe nach jede Antwort (auch „Nicht jetzt.“); jede Partie nacheinander mit Sieg, Niederlage,
   Remis, Abbruch und gleich danach das Nachgespräch; jede Runde nicht bestanden, dann bestanden;
   Dialoge der Übergänge, die aus dem Ort hinausführen (Kanalweg, Fähre, Bus), je fünfmal; nach jeder
   begonnenen Partie die Ink-Dialoge ihrer Partiemomente. Durchgänge durch alle Orte, bis einer nichts
   Neues bringt (immer 3 bis 4, Obergrenze 8). Ein Ding, das fünfmal nichts Neues sagt, bleibt
   liegen, bis der Spielstand einen noch nie gesehenen Fortschritt zeigt (ohne diese Geduld: 290 000
   Dialoge und zehn Minuten).
3. **Fund** ist: eine Zeile mit `#sprecher:ambrose`; eine Wahl „… gegen Ambrose“; eine begonnene
   Begegnung mit Gegner `mapleFalls.ambrose`; ein Partiemoment mit Sprecher Ambrose, außer die App
   lässt ihn weg (das Werkzeug sieht nach, ob `Momentzeile.tsx` die Regel `ambroseVerabschiedet` benutzt).
   `--hinweise` listet dazu Zeilen anderer Sprecher, die Ambrose nennen (zum Nachlesen, kein Fund).

### Grenzen

- **Stichprobe, kein Beweis.** Nach dem Abschied liest „gründlich“ 498, „eilig“ 594 von rund 1100
  Knoten; der Rest sind vor allem Hauptszenen, die nur vor dem Abschied laufen. Was erreichbar ist,
  hängt am Spielstand; drei Spieler mal Startwert decken nicht jede Kombination ab.
- Der eilige Spieler spricht in Orten mit offener Hauptquest jede Figur an (die Simulation weiß nicht,
  welche Gespräche die Hauptquest braucht). Nebenquests bei Figuren der Hauptorte sind bei ihm also
  erledigt; dafür ist der launische Spieler da.
- Partien werden nicht gespielt. Momente mit Ink-Dialog werden alle gespielt, gleich ob ihre
  Bedingung (Zug, Merkmal) einträte.
- Statisten und alles, was die Hülle ohne Ink sagt, sieht das Werkzeug nicht (siehe Abschnitt 6).
  Das Reisebrett meldet es nur als Hinweis, nicht als Fund.
- Reisen aus Dialogen (Fernbus) nimmt der Spieler nach dem Abschied nicht; er steht ohnehin in jedem Ort.

## 2. Funde vorher

- Erster Lauf, nur „gründlich“, Startwert 1, vor jeder Änderung: **66 Funde** (40 Zeilen, 3 Wahlen,
  4 Partien, 7 Momente und 12 Zeilen aus deren Dialogen).
- „gründlich“ + „eilig“, Startwert 1 (Momente schon von der App gefiltert): **96 Funde**.
- Nach der ersten Runde Behebungen brachten Startwerte 2 bis 5, der schärfere eilige Spieler
  (nur Figuren), der launische Spieler und die Übergangsdialoge noch einmal rund **105 verschiedene
  Funde** (95 + 3 + 5 + 2).
- Jetzt: **0 Funde**. Geprüft mit dem letzten Stand: Startwert 1 bis 8 mit allen drei Spielern
  (der launische erreichte den Abschied bei 3 von 8) und 16 weitere Startwerte mit eilig + launisch
  (launisch erreichte ihn bei 8 von 16). Davor, mit Zwischenständen, 44 weitere launische Läufe.

## 3. Behobene Stellen

43 Dateien, 143 Knoten, 165 Bedingungen. 22 Dateien bekamen `VAR abschiedGesehen = false` mit dem
Kommentar wie in `bayou.ink` neu. „hängen“ heißt: Zeile steht jetzt in `{not abschiedGesehen: …}`
(oder die vorhandene Bedingung bekam `and not abschiedGesehen`); Wortlaut unverändert.

### 3.1 Nur angehängt (keine Ersatzzeile)

| Datei                                | Knoten                                                                                                                                                                                                                             |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ansehen-cedar-creek                  | globus, schild_fluestern, boxerfoto, wasserfleck, automat                                                                                                                                                                          |
| ansehen-maple-falls                  | pizzakarton, tisch_pizzakarton, kreidebrett, hutschachtel, zeitungen1961, kiste_whitlock, brett_ohne_dame, plakat_zaehlen, bildschirm_pult                                                                                         |
| cedar-creek-aussen                   | rosa_nach_sieg, kettering_d                                                                                                                                                                                                        |
| cedar-creek-bibliothek               | mae_reihe, zwillinge_c                                                                                                                                                                                                             |
| cedar-creek-drechslerei              | dunmore_a, dunmore_c                                                                                                                                                                                                               |
| crossroads-raststaette               | kaffeehaus                                                                                                                                                                                                                         |
| desert-springs-aussen                | buck_angebot, buck_nach_sieg                                                                                                                                                                                                       |
| desert-springs-garage                | dot_okoro, dot_fernpartie, dot_nach_fernpartie                                                                                                                                                                                     |
| ironwood-aussen                      | bus_silicon_bay_einsteigen, gus_angebot, kreidebrett                                                                                                                                                                               |
| ironwood-kantine                     | big_joe_nach_sieg (beide Zweige, im Siegzweig samt „… sagt Ambrose etwas“), stahlbrett                                                                                                                                             |
| ironwood-mamas-zimmer                | medaille                                                                                                                                                                                                                           |
| ironwood-museum                      | fund_glasfunke                                                                                                                                                                                                                     |
| lockport-aussen, lockport-gasthaus   | post_geloest; kegelkoenig                                                                                                                                                                                                          |
| maple-falls-aussen                   | juno_trifft, calloway_a (samt „Ambrose schweigt, bis …“), calloway_d, carla_d                                                                                                                                                      |
| maple-falls-diner                    | hector_b, hector_c                                                                                                                                                                                                                 |
| maple-falls-park                     | bibliothekar_sucht, parkbank_fund, jo_nach_niederlage, jo_limo_gebracht                                                                                                                                                            |
| port-delacroix-turnhalle             | notenheft                                                                                                                                                                                                                          |
| riverton-aussen                      | kanalweg (nach der Nadel), handyladen, fund_laeufer                                                                                                                                                                                |
| riverton-bahnhofshalle               | harlan_lupe, harlan_angebot, fund_taubenfeder                                                                                                                                                                                      |
| riverton-pavillon, riverton-schuppen | gedenktafel; fahrrad                                                                                                                                                                                                               |
| silicon-bay-aussen                   | dash_nach_niederlage, faehre (nach der Nadel), netze, eisenwaren_batterie                                                                                                                                                          |
| silicon-bay-lobby                    | empfangsroboter, vitrine_foto (samt „Ambrose steht vor dem Glas …“)                                                                                                                                                                |
| sternwarte                           | teleskop                                                                                                                                                                                                                           |
| weg-cedar-riverton                   | tafel, quinn_angebot, quinn_nach_niederlage, fund_pfeilspitze, fund_holzspringer, fund_fahrkarte, zugpartie_geloest                                                                                                                |
| weg-delacroix-desert                 | fund_eidechsenhaut, seilschaft_ende                                                                                                                                                                                                |
| weg-desert-summit                    | earl_regel, earl_k, tafel, kreide3                                                                                                                                                                                                 |
| weg-ironwood-silicon                 | joggerin_angebot, joggerin_nach_niederlage, stream_angebot, stream_partie, stream_ende, kreide2, seite04, schild_smart_city, werbetafel_zero                                                                                       |
| weg-maple-cedar                      | nia_duell, nia_nach_sieg, nia_nach_niederlage, flohmarkt_angebot, flohmarkt_karte, apfelstand_b, apfelstand_c, tessa_c; fund_formular, fund_muenzen, seite00 (dort gilt danach der vorhandene Satz „Im Rucksack bleibt es still.“) |
| weg-riverton-ironwood                | tafel, fund_zahnrad                                                                                                                                                                                                                |

### 3.2 Mit Eingriff in den Ablauf

| Datei                    | Knoten                                                  | was geändert                                                                                                                                                                                             | Ersatzzeile (neu)                                                                                                                     |
| ------------------------ | ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| maple-falls-dachboden    | ambrose                                                 | Das Brett auf dem Schreibtisch führte nach dem Epilog in `ambrose_rat` („Erzähl mir von früher.“). Neuer Zweig `abschiedGesehen` nach dem Epilog-Zweig.                                                  | Es ist still im Zimmer. Draußen rauscht der Wasserfall.                                                                               |
| cedar-creek-archiv       | karton_alltag                                           | Zwei Ambrose-Sätze waren der ganze Knoten.                                                                                                                                                               | Die Zeitung von 1858 liegt obenauf. Du weißt, was darin steht.                                                                        |
| cedar-creek-archiv       | erinnerung                                              | Erinnerung New York: danach neuer Abschnitt `= allein` ohne Ambroses Erzählung, Wahlen „Die Partie nachspielen“ / „Das Heft zurücklegen“.                                                                | Darin steht eine Partie, Zug für Zug: Paulsen gegen Morphy.                                                                           |
| cedar-creek-archiv       | programmheft_danach                                     | Danach endet der Knoten nach einer Zeile (kein Streit ums Zählen, kein `name_im_archiv`).                                                                                                                | Morphy opfert die Dame, und du vergisst zu atmen. Du legst das Heft zurück in den Karton.                                             |
| cedar-creek-aussen       | plakat                                                  | Nach den zwei Erzählzeilen `-> END`; die beiden Wahlen richteten sich an ihn.                                                                                                                            | keine                                                                                                                                 |
| cedar-creek-aussen       | sterne                                                  | Wahl „Die Hand auf das Brett legen“ (führt in `sterne_ambrose`) nur vor dem Abschied.                                                                                                                    | keine                                                                                                                                 |
| cedar-creek-waschsalon   | boateng_formular_entziffert                             | Zwei Ambrose-Sätze durch eine Erzählzeile ersetzt.                                                                                                                                                       | Es sind seine Züge. In seiner eigenen Hand.                                                                                           |
| desert-springs-garage    | dot_margaret                                            | Ambroses Schlusssatz trug den Musikwechsel zurück.                                                                                                                                                       | Vierzig Jahre, Zug um Zug, mit der Post.                                                                                              |
| ironwood-mamas-zimmer    | oma_ruth_heft                                           | Danach gleich zur Heimfahrt-Wahl; Ambroses drei Sätze und „Was macht man damit?“ entfallen.                                                                                                              | keine                                                                                                                                 |
| ironwood-museum          | postsack_offen                                          | Danach von Mr. Teagues „bei Fieber …“ gleich zu `= umschlag_leer` („Mr. Teague sieht dich über die Brille an.“, bekam `#bild:aus`).                                                                      | keine                                                                                                                                 |
| ironwood-museum          | vitrine                                                 | Erinnerung Bird: danach `= allein` mit „Die Partie nachspielen“ / „Weitergehen“; im Zweitzustand „Ambrose sieht sie nicht mehr an.“ nur vor dem Abschied.                                                | Unter dem Brett stehen die Züge: Morphy gegen Bird, London 1858.                                                                      |
| ironwood-museum          | vitrine_mut                                             | Danach Ende nach der Erzählzeile zur Partie.                                                                                                                                                             | keine                                                                                                                                 |
| ironwood-umkleide        | schliessfach                                            | Beide Fundsätze und der Laternensatz entfallen danach.                                                                                                                                                   | keine                                                                                                                                 |
| maple-falls-aussen       | lily_lektion                                            | Danach gleich zu `= erklaeren` („Du setzt den Springer auf ihr Brett …“); „Erklär es ihr.“ und die Wahl „Du kannst das besser.“ entfallen.                                                               | keine                                                                                                                                 |
| maple-falls-aussen       | lily_danke                                              | „Ambrose sagt nichts. Aber er sieht ihr nach.“ nur vor dem Abschied.                                                                                                                                     | keine                                                                                                                                 |
| maple-falls-park         | bibliothekar_brief                                      | Danach Ende nach Abernathys Zeilen mit einem Satz.                                                                                                                                                       | A. W. Du erkennst die Züge. So beginnt seine Partie gegen Hale.                                                                       |
| pinewood-camp-aussen     | es_ist_still                                            | Danach bleibt nur die Zeile mit den Bärenspuren (`->->`).                                                                                                                                                | keine                                                                                                                                 |
| pinewood-camp-aussen     | lagerfeuer_abend                                        | Neue Abschnitte `= raeuberschach` und `= stern`; danach ohne „Das ist kein Schach.“ samt Wahl, ohne die Sätze zum Räuberschach und ohne das Gespräch am Steg samt „Sechs Wörter.“. Quest-Schritt bleibt. | Sie stehen noch wie früher. Das hat er einmal gesagt, an einem anderen Steg. (nur wenn die Sternennacht in Cedar Creek gesehen wurde) |
| port-delacroix-werkstatt | henri_foto                                              | Danach erkennt {held} das Foto selbst; neuer Abschnitt `= tuer`, Ende nach Célestes Satz.                                                                                                                | Du kennst das Gesicht.                                                                                                                |
| port-delacroix-werkstatt | celeste_nach_partie                                     | Danach Ende nach Célestes Abgang; das Gespräch mit Ambrose entfällt.                                                                                                                                     | Draußen rattert das Skateboard über das Pflaster, kleiner werdend. (gekürzter vorhandener Satz)                                       |
| port-delacroix-werkstatt | werkbank_flashback                                      | Neuer Abschnitt `= golden`; danach ohne „Du hörst ihn“ und „Hier. Hier war es.“                                                                                                                          | Die Werkstatt wird golden. (gekürzt)                                                                                                  |
| port-delacroix-werkstatt | werkbank_nach_flashback                                 | Danach Ende mit einem Satz statt Ambroses Erklärung zu Claire.                                                                                                                                           | Claire hat aufgepasst. Das Brett steht heute im Norden, in einer Stadt mit einem Wasserfall.                                          |
| riverton-bahnhofshalle   | uhr                                                     | Neuer Abschnitt `= schlag`; danach ohne Ambroses Erzählung gleich die neun Schläge und „Mitgehen“ / „Nicht jetzt.“; im Zweitzustand „Ambrose sieht zu den hohen Fenstern …“ nur vor dem Abschied.        | keine                                                                                                                                 |
| riverton-bahnhofshalle   | london_nachgespraech                                    | Danach Ende nach der ersten Erzählzeile.                                                                                                                                                                 | keine                                                                                                                                 |
| erinnerung-london        | zeitungsjunge, droschke, kaffeehaus_betreten, rueckkehr | Die Sätze des jungen Ambrose angehängt (samt „Die Stimme kommt aus dir.“).                                                                                                                               | keine                                                                                                                                 |
| erinnerung-london        | schachtisch                                             | Vorstellung der Spieler angehängt; die Aufforderung ersetzt.                                                                                                                                             | Weiß hat einen Turm weniger, und der zweite Turm hängt auch.                                                                          |
| erinnerung-london        | rueckkehr_telegraf                                      | „Ambroses Stimme ist wieder die alte“ und drei Sätze ersetzt.                                                                                                                                            | Er läuft zum Telegrafenamt, um seine eigene Niederlage nach Paris zu melden. Weil sie so schön war.                                   |
| riverton-aussen          | bildschirmtische_wieder                                 | „Ambrose sieht hin. Lange.“ nur vor dem Abschied.                                                                                                                                                        | keine                                                                                                                                 |
| silicon-bay-aussen       | werbetafel                                              | Danach Ende nach der Tafel („Ambrose sieht lange hin“ und sein Satz entfallen).                                                                                                                          | keine                                                                                                                                 |
| silicon-bay-lobby        | vitrine                                                 | Neuer Abschnitt `= seite_fehlt`; danach ohne „Warten“ und Ambroses drei Sätze; „Victor hat Ambrose nicht gehört.“ nur vor dem Abschied.                                                                  | keine                                                                                                                                 |
| summit-city-huette       | ward_nadel                                              | Danach Ende nach Junos „Acht! Acht!“ (die Wahl „Es war keine schöne Partie.“ beantwortete Ambrose).                                                                                                      | keine                                                                                                                                 |
| summit-city-huette       | ward_nach_erinnerung                                    | Neuer Abschnitt `= zettel`; danach ohne Ambroses Sätze, ohne „Macht dich das traurig?“ und ohne Wards „Du hörst dabei zu“; der Drachensatz entfällt.                                                     | Du kennst die Züge. Es ist seine Partie gegen Hale.                                                                                   |
| weg-cedar-riverton       | gueterzug                                               | Danach nur der Zug (`->->`).                                                                                                                                                                             | keine                                                                                                                                 |
| weg-crossroads-pinewood  | greta_erstes_treffen                                    | Neuer Abschnitt `= ansage`; danach findet {held} den Läufer selbst; die Wahl „Ich hab einen Freund. Der sieht für mich.“ entfällt.                                                                       | Du schließt die Augen. c4. Dort steht er, seit dem dritten Zug.                                                                       |
| weg-crossroads-pinewood  | greta_angebot, greta_nach_partie                        | siehe Abschnitt 5.                                                                                                                                                                                       | Greta schenkt Kaffee ein. Die Wanderer sagen ihre Züge an, und du hörst mit geschlossenen Augen zu.                                   |
| crossroads-raststaette   | varianten_tisch                                         | siehe Abschnitt 5.                                                                                                                                                                                       | keine                                                                                                                                 |
| weg-delacroix-desert     | fund_nieten                                             | Danach kein `nieten_ambrose`; beim Fund eine Zeile mit `#bild:aus`, beim Wiederkommen der vorhandene Satz.                                                                                               | Die Nieten glänzen, Reihe um Reihe. (gekürzt)                                                                                         |
| weg-riverton-ironwood    | zeitnot_trick                                           | Danach nach der Brückenbeschreibung nur noch der Fund an den Nieten; Kaffeehaus-Trick und Kartengeschenk entfallen.                                                                                      | keine                                                                                                                                 |
| weg-riverton-ironwood    | jh                                                      | Danach statt „Ambrose sieht auf die Buchstaben …“ und der beiden Wahlen ein Satz.                                                                                                                        | J. H. Du weißt inzwischen, wessen Brücke das ist.                                                                                     |
| ghost-town-aussen        | ankunft_zu_fuss                                         | Danach Ende vor „Hier.“ (wer über die Minenstraße kam, erlebt die Ankunft zu Fuß womöglich erst danach).                                                                                                 | keine                                                                                                                                 |
| ansehen-maple-falls      | spiegel                                                 | Zweitzustand „Ambrose schweigt diesmal höflich.“ nur vor dem Abschied.                                                                                                                                   | keine                                                                                                                                 |
| weg-pinewood-ghost       | juniper                                                 | „Aber Ambrose ist still geworden …“ nur vor dem Abschied.                                                                                                                                                | keine                                                                                                                                 |
| weg-silicon-delacroix    | delfin                                                  | Beide Sätze mit Ambrose am Bug nur vor dem Abschied.                                                                                                                                                     | keine                                                                                                                                 |

## 4. Neue Erzählsätze (für den Autor zum Nachlesen)

1. maple-falls-dachboden.ambrose: „Es ist still im Zimmer. Draußen rauscht der Wasserfall.“
2. cedar-creek-archiv.karton_alltag: „Die Zeitung von 1858 liegt obenauf. Du weißt, was darin steht.“
3. cedar-creek-archiv.erinnerung: „Darin steht eine Partie, Zug für Zug: Paulsen gegen Morphy.“ Wahlen: „Die Partie nachspielen“, „Das Heft zurücklegen“.
4. cedar-creek-archiv.programmheft_danach: „Morphy opfert die Dame, und du vergisst zu atmen. Du legst das Heft zurück in den Karton.“
5. cedar-creek-waschsalon.boateng_formular_entziffert: „Es sind seine Züge. In seiner eigenen Hand.“
6. desert-springs-garage.dot_margaret: „Vierzig Jahre, Zug um Zug, mit der Post.“
7. ironwood-museum.vitrine: „Unter dem Brett stehen die Züge: Morphy gegen Bird, London 1858.“ Wahlen: „Die Partie nachspielen“, „Weitergehen“.
8. maple-falls-park.bibliothekar_brief: „A. W. Du erkennst die Züge. So beginnt seine Partie gegen Hale.“
9. pinewood-camp-aussen.lagerfeuer_abend: „Sie stehen noch wie früher. Das hat er einmal gesagt, an einem anderen Steg.“
10. port-delacroix-werkstatt.henri_foto: „Du kennst das Gesicht.“
11. port-delacroix-werkstatt.werkbank_nach_flashback: „Claire hat aufgepasst. Das Brett steht heute im Norden, in einer Stadt mit einem Wasserfall.“
12. erinnerung-london.schachtisch: „Weiß hat einen Turm weniger, und der zweite Turm hängt auch.“
13. erinnerung-london.rueckkehr_telegraf: „Er läuft zum Telegrafenamt, um seine eigene Niederlage nach Paris zu melden. Weil sie so schön war.“
14. summit-city-huette.ward_nach_erinnerung: „Du kennst die Züge. Es ist seine Partie gegen Hale.“
15. weg-crossroads-pinewood.greta_erstes_treffen: „Du schließt die Augen. c4. Dort steht er, seit dem dritten Zug.“
16. weg-crossroads-pinewood.greta_angebot: „Greta schenkt Kaffee ein. Die Wanderer sagen ihre Züge an, und du hörst mit geschlossenen Augen zu.“
17. weg-riverton-ironwood.jh: „J. H. Du weißt inzwischen, wessen Brücke das ist.“

Aus vorhandenen Sätzen gekürzt (kein neuer Inhalt): „Die Werkstatt wird golden.“, „Draußen rattert das
Skateboard über das Pflaster, kleiner werdend.“, „Die Nieten glänzen, Reihe um Reihe.“

Offen für den Autor: Ob Ambroses Erinnerungen (London 1851, Werkstatt 1840/1852) nach dem Abschied
überhaupt betretbar sein sollen. Ich habe sie betretbar gelassen (die Uhr und die Werkstatt
erinnern sich allein), weil ihre Quests schon beim Antippen des Auslösers beginnen und sonst für
immer offen blieben. Rückbau wäre je ein Zweig.

## 5. Partien gegen Ambrose

| Stelle                                                                                                                | Entscheidung                                                                                                                                                                                                                                                                                                                                             |
| --------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Blindschach bei Greta (`weg-crossroads-pinewood.greta_angebot`, Begegnung `wegCrossroadsPinewood.blindschach`)        | Nach dem Abschied kein Angebot mehr, stattdessen ein Erzählsatz (Nr. 16). In `greta_nach_partie` ist „Noch eine Partie blind“ nur vor dem Abschied wählbar. Greta als Gegnerin hätte einen neuen Gegner (gegner.json mit Stärke, Porträt, Steckbrief), eine neue Begegnung und neue Ausgangsvariablen gebraucht; zu viel für diesen Auftrag.             |
| Varianten-Tisch, „Blindschach gegen Ambrose“ und „Schach960 gegen Ambrose“ (`crossroads-raststaette.varianten_tisch`) | Beide Wahlen nur vor dem Abschied; danach bleibt „Nur schauen“.                                                                                                                                                                                                                                                                                          |
| Reisebrett, Übungspartie `reisebrett.ambrose`                                                                         | **Nicht geändert, offen.** Die Hülle bietet sie über den Gegenstand an (`Oberwelt.tsx`, `usePartiestart.ts`), Ink steuert sie nicht. Ausblenden wäre eine Zeile, nähme aber die einzige freie Übungspartie nach dem Finale. Vorschlag: nach dem Abschied gegen Juno (es ist ihr Brett; Gegner `mapleFalls.juno` gibt es), braucht eine zweite Begegnung. |
| `mapleFalls.ersteLektion`                                                                                             | Nur vor dem Abschied erreichbar; nichts zu tun.                                                                                                                                                                                                                                                                                                          |

**Nach dem Finale nicht mehr spielbar:** Blindschach ganz (Greta und Varianten-Tisch); Schach960 am
Varianten-Tisch (bleibt bei Mabel im Musikhaus, Quest `portDelacroix.schach960`). Wer Greta erst
danach trifft, lernt die Variante noch kennen (`varianteBlindschachGelernt`), kann sie aber nicht spielen.
Außerdem entfallen danach Ambroses Kaffeehaus-Trick mit dem Kartengeschenk an der Brücke (die Karte
„Großes Maul“ gibt auch Buck) und `es_ist_still`.

## 6. App

Geändert:

- `app/src/abenteuer/regeln/abwesenheit.ts`: neue Funktion `ambroseVerabschiedet(variablen)`
  (`abschiedGesehen === true`); `ambroseSprichtJetzt` gibt danach `false` (Statistenzusätze `.ambrose`).
- `app/src/abenteuer/anbindung/Momentzeile.tsx`: Partiemomente mit Sprecher Ambrose fallen auch nach
  dem Abschied weg (`ambroseFehlt(v) || ambroseVerabschiedet(v)`; eine Zeile über dieselbe Regel).
  Betrifft die Revanchen: Clubkämpfe Maple Falls, Cedar Creek, Ironwood (2), Silicon Bay, Desert
  Springs, Summit City (7 Momente, 4 davon mit Ink-Dialog).
- `abwesenheit.test.ts`: ein Test dazu.

Was nach dem Abschied sonst noch von Ambrose kommt (nur gemeldet, nichts umgebaut). Alles hängt an
`ambroseFehlt` (Tiefpunkt) und kennt den Abschied nicht:

1. **Tischgespräch in Partien** (`Tischgespraech.tsx`, `regeln/tischgespraech.ts`): Ambrose spricht
   unten zu „hinten“, „zeitnot“, „hinweis“ (21 Texte `tisch.ambrose.*`); `ambroseDa` kommt aus
   `schutzengelGesperrt`.
2. **Rätselrunden** (`useRaetselanzeige.tsx`, `useRaetselgespraech.ts`): Rückmeldung mit Ambroses
   Porträt und Namen („Richtig! …“), Hinweis und Zuspruch nach zwei Fehlern; auch in den
   Erinnerungsrunden, die jetzt allein spielbar sind.
3. **Seine Karten** (Mentor-Zug, Schutzengel, Fingerzeig, Flüstern): spielbar, mit seiner Zeile
   (`tischsprecher.ts`, `kartenstimme.ts`); in der Deckwahl nicht grau; `Schutzengelzeile.tsx` hält
   Züge auf; `Kartenblick.tsx` zeigt „Ambrose:“ vor der Erklärung jeder Karte (`faecher.ambrose`).
4. **Knopf „Ambrose fragen“** (`i18n/de.json`, `imSpiel.hinweis`).
5. **Nach der Partie**: Kipppunkt („noch einmal von hier“, `kipppunkt.ts`, `Ergebniskarten.tsx`) und
   der Rückblick im Notizbuch als Ambroses Sätze (`partieergebnis.ts`, `notizbuch.ts`).
6. **Reisebrett**: Gegner Ambrose mit Namen und Porträt (siehe Abschnitt 5).
7. `spruch.ambrose.ersterSpruch`: nur beim allerersten Spruch, praktisch immer vor dem Abschied.
8. Einleitungstexte der Startseite („Lerne Schach mit Ambrose“) sind Beschreibung, kein Sprechen.

Vorschlag: `ambroseFehlt` an diesen Stellen durch eine gemeinsame Regel „Ambrose ist nicht da“
(Tiefpunkt oder Abschied) ersetzen und entscheiden, was aus seinen vier Karten nach dem Finale wird.
Die Figur auf der Karte ist schon geregelt (`mapleFalls.ambrose`, `wenn: nicht abschiedGesehen`).

## 7. Nebenbefunde

- **Juno an der Haltestelle ist überspringbar.** Der launische Spieler erreichte den Abschied, ohne
  je `maple-falls-aussen.juno_trifft` gesehen zu haben; die Szene („Du bist das Kind aus dem
  Whitlock-Haus!“) lief dann nach dem Finale. Ambroses Sätze dort hängen jetzt an der Bedingung; ob
  die Hauptgeschichte das Treffen erzwingen soll, ist eine Frage an den Hauptchat.
- **Nachholbare Szenen mit Akt-2-Zeit**: `riverton-bahnhofshalle.uhr` („Am Abend ist euer Zug weg … Juno
  schläft“) läuft auch nach dem Finale so.
- `maple-falls-dachboden.epilog` stellt das Brett auf den Dachboden; der Auslöser `brettSchreibtisch`
  im Zimmer bleibt danach ansprechbar (jetzt mit dem stillen Satz Nr. 1).
- `pipeline/abenteuer/gesamtsimulation-bericht.cjs` ist nicht prettier-formatiert (nicht von mir, nicht angefasst).

## 8. Prüfergebnisse

- `node pipeline/abenteuer/ambrose-danach.cjs` (Startwert 1): 0 Funde, Rückgabewert 0. Dazu
  Startwerte 2 bis 8 mit allen drei Spielern und 16 weitere mit eilig + launisch: 0 Funde
  (Einzelheiten in Abschnitt 2).
- `python -m pipeline.abenteuer.sprache`: 0 Funde. `python -m pipeline.abenteuer.inkbesuche`: 0 Befunde.
- `node pipeline/abenteuer/inkuebersetzung.cjs`: 71 Dateien, 0 Warnungen, 0 Fehler.
- `ruff check pipeline`: bestanden; `ruff format --check pipeline`: 368 Dateien formatiert.
- `python -m pytest -q -k "not chaos" pipeline/tests`: 1611 bestanden, 15 übersprungen, 1 abgewählt.
  `ABENTEUER_SIMULATION=1 python -m pytest pipeline/tests/test_abenteuer_ambrose_danach.py`: 5 bestanden (123 s).
- `cd app && npm run pruefen`: bestanden (Typen, Stil, vitest 454 Dateien, 2933 Tests). Der Lauf baut
  über `vorbereiten` die übersetzten Dialoge unter `app/public` neu (nicht in git).
- Gesamtsimulation Startwert 1, 2, 3 (`--sekunden 300`): jeweils „Meldungen: keine“, Rückgabewert 0,
  keine nie besuchten Orte, Sammelstränge vollständig.
- `node pipeline/abenteuer/lesefassung.cjs --ziel DATEI.md`: läuft durch
  (Akt 1 248, Akt 2 254, Akt 3 282, Akt 4 374 Dialoge, danach 35). Vergleich mit
  `docs/spiel/auftraege/lesefassung_17-11.md` bis zum Abspann (Kursivzeichen angeglichen, die
  abgelegte Datei ist prettier-formatiert): 633 Ambrose-Zeilen alt und neu, eine weicht ab: „Das habe
  ich gesagt.“ → „Das hast du von mir.“ (cedar-creek-archiv.programmheft_danach, vom anderen Helfer
  zusammen mit der Wahl „Dieses Zählen habe ich von dir. Was hängt?“). Übrige Unterschiede, alle von
  den anderen Helfern: Sam „Eine Partie? Jetzt?“ statt „Revanche?“; ein neuer Erzählsatz zum Freitag
  („Du sagst alles in einem Atemzug …“); Junos Erzählung auf der Landstraße (11 Zeilen); zweimal „Mr.
  Kettering wohnt hier …“. Nach dem Abspann: kein Unterschied, 0 Ambrose-Zeilen.
- Zeitweilige Fehler durch andere Helfer: keine beobachtet.

## 9. Ungeprüft, nicht getan

- Nichts im laufenden Spiel nachgespielt; die neuen Zweige sind nur in der Simulation gelaufen.
  In acht Stichproben-Läufen nach der letzten Änderung (gründlich 1, eilig 1 und 3, launisch 4, 5, 8,
  13, 20) kamen diese neuen Sätze nach dem Abschied wirklich vor: Nr. 1, 2, 3, 4, 5, 7, 8, 11, 12, 13,
  14, 15, 16, 17 und „Die Werkstatt wird golden.“ **Nicht** vorgekommen, also nur übersetzt und
  gelesen, nicht gelaufen: `desert-springs-garage.dot_*` (Nr. 6), `port-delacroix-werkstatt.henri_foto`
  (Nr. 10), das neue Ende von `celeste_nach_partie` (der Knoten selbst lief in früheren launischen
  Läufen nach dem Abschied), `pinewood-camp-aussen.lagerfeuer_abend` mit Satz Nr. 9 (die Sternennacht
  in Cedar Creek erreicht die Simulation nie; das Lagerfeuer ohne den Satz lief),
  `weg-delacroix-desert.fund_nieten`, `ironwood-museum.postsack_offen`,
  `ironwood-mamas-zimmer.oma_ruth_heft`, `cedar-creek-aussen.sterne`.
- Nicht angefasst, weil kein Lauf sie fand und die Bedingungen sie an die Hauptgeschichte binden:
  alle Hauptszenen (Dachboden, Archiv 1858, Steg, Vorwurf, Versöhnung, Ghost Town, Arena), dazu
  `desert-springs-antiquariat.okoro_*` und `desert-springs-garage.mira_erinnerung*` (Brief und
  Erinnerung 1858 sind Voraussetzung für Miras Clubkampf), `ironwood-kantine.mama_nach_partie`,
  `riverton-wohnwagen.slick_fluss`, `silicon-bay-akademie.theo_tablet`, `riverton-aussen.eli` und
  `kanalweg` (Zweig vor der Nadel), `silicon-bay-aussen.faehre` (Zweig vor der Nadel),
  `ironwood-aussen.bus_silicon_bay_abfahrt`, `ghost-town-laden.treppe`, `weg-silicon-delacroix.bug`,
  `weg-maple-cedar.faehrstein`. Sollte eine davon doch überspringbar sein, meldet es das Werkzeug erst,
  wenn ein Spieler sie auslässt.
- Erzählzeilen, die Ambrose als anwesend beschreiben, habe ich nur dort geändert, wo `--hinweise` sie
  nach dem Abschied zeigte oder sie neben einer geänderten Zeile standen; in nie erreichten Knoten
  können weitere stehen.
- Playwright nicht gelaufen. `docs/` nicht geändert (ENTSCHEIDUNGEN, FORTSCHRITT, AUFGABEN_AUTOR
  bleiben beim Hauptchat).
