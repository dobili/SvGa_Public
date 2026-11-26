// Ort: Ironwood außen (Akt 2): Werkstor, Brücke, Elm Street, Kantine, Güterbahnhof,
// Eisenwarenfenster, alter Bahnhof, Bushaltestelle an der Schnellstraße (Story-Bibel 10.4,
// Weltbeschreibung 5.5).
//
// Szenen der Bibel: 38 Nicht Ironwood (hier als Anruf von Mama bei der Ankunft, akt2.verbot),
// 39 Weg zu Oma Ruth (Haustür, wenn elmStreetBekannt), 42 Ednas Fenster (Laden ironwood.eisenwaren,
// hatFahrrad und hatLaterne leitet die Hülle aus dem Besitz ab), 45 Gus am Güterbahnhof (Begegnung ironwood.gus),
// 49 Der Kauf (akt2.ironwoodVerkauft, Quest ironwood.clubkampf), 50 Einladung nach Silicon Bay
// (akt2.einladung, Ende der Staffel).
// Einstiege wie in orte.json: Figuren gus, edna, victor, graham_hale; Übergänge ankunft_zu_fuss,
// kanalweg, haustuer_ruth; Dialoge bus_riverton, bus_silicon_bay; Gegenstände eisenwarenfenster,
// kreidebrett.
//
// Variablen: ausgangIronwoodGus und nadelIronwood setzt die Hülle (R42); elmStreetBekannt setzt
// ironwood-kantine.ink (Big Joe nennt die Straße), mamaSpielt setzt die Kantine nach Mamas
// Partie. kaufGesehen und einladungGesehen setzt diese Datei.

EXTERNAL beginnePartie(begegnung)
EXTERNAL setzeSzene(kennung)
EXTERNAL reise(karte, ausloeser)
EXTERNAL zahle(muenzen)
EXTERNAL oeffneLaden(laden)

VAR rivalin = false
VAR rivale = "Victor"
VAR rv_er = "er"
VAR rv_Er = "Er"
VAR rv_ihn = "ihn"
VAR rv_Ihn = "Ihn"
VAR rv_ihm = "ihm"
VAR rv_Ihm = "Ihm"
VAR rv_sein = "sein"
VAR rv_Sein = "Sein"
VAR abfahrtSiliconGesehen = false
VAR ankunftIronwoodGesehen = false
VAR elmStreetBekannt = false
VAR mamaSpielt = false
VAR gusGetroffen = false
VAR ausgangIronwoodGus = ""
VAR ednaGetroffen = false
VAR hatFahrrad = false
VAR hatLaterne = false
// Lastkahn (L3): lastkahnFrei setzt Lockport, wenn Ruben Big Joes Brief liest.
VAR lastkahnFrei = false
VAR muenzen = 0
VAR nadelIronwood = 0
VAR kaufGesehen = false
VAR einladungGesehen = false
VAR kreidebrettGesehen = false
// Roman, Kapitel 23: Das Verbot kommt zu Hause (maple-falls-wohnzimmer.nicht_ironwood) oder hier.
VAR verbotGesehen = false
VAR held = "Du"
// Gutachten L1.2: „Und er hat mir geschrieben“ nur mit dem Umschlag aus dem Museum.
VAR umschlagGeoeffnet = false
// Aus capital-arena-aussen.ink: Nach dem Abschied (Szene 109) spricht Ambrose nicht mehr
// (Story-Bibel Abschnitt 33, Frage 5; Entscheidung Q21-5). Hier nur gelesen.
VAR abschiedGesehen = false

// ---------------------------------------------------------------- Ankunft und Verbot

=== ankunft_zu_fuss ===
{ankunftIronwoodGesehen:
    Der Abhang von der Brücke führt hinunter nach Ironwood. #sprecher:erzaehler
    -> END
}
~ ankunftIronwoodGesehen = true
// Roman, Kapitel 23 und 25: Wer vorher zu Hause war, kennt das Verbot schon
// (maple-falls-wohnzimmer.nicht_ironwood); sonst kommt es hier als Anruf, trocken und ohne Pause.
// Ironwood ist grau, wie Dinge grau sind, die gearbeitet haben. Klang: tiefes Thema mit Blech und
// einem langsamen Schlag, dazu das Fauchen des Hochofens in Abständen; Lichtwechsel orange.
Ironwood ist grau. Nicht hässlich. #sprecher:erzaehler #musik:ironwood
Grau, wie Dinge grau sind, die gearbeitet haben. #sprecher:erzaehler
Reihenhäuser, eins am anderen, alle gleich, mit schmalen Treppen und Eisengeländern. #sprecher:erzaehler #schwenk:iw5Reihenhaus
Über den Hallen leuchtet der Himmel orange auf. Einen Atemzug später kommt das Geräusch, ein tiefes Fauchen. #sprecher:erzaehler #klang:hochofen #licht:ironwood
{verbotGesehen:
    Auf den Gehwegen malen Kinder Schachbretter mit Kreide. Richtige, acht mal acht. #sprecher:erzaehler #schwenk:iw5Kreidebrett
    Die können hier zählen. #sprecher:juno #stimmung:laechelt
    Ich zähl die Kreidebretter. Elf! Ironwood ist ein Brett. #sprecher:juno #stimmung:laechelt
    -> END
}
~ verbotGesehen = true
~ setzeSzene("akt2.verbot")
Coach Delgado hat uns für ein Freundschaftsturnier hier angemeldet! Ich hab es deiner Mama gesagt. #sprecher:juno #stimmung:laechelt
Dein Handy klingelt. Mama. #sprecher:erzaehler #schwenk:held
Nein. #sprecher:mutter #stimmung:verschlossen
Nicht Ironwood. #sprecher:mutter #stimmung:verschlossen
* [„Warum?“]
* [Nichts sagen]
- Frag nicht. Bitte. #sprecher:mutter #stimmung:verschlossen
Nicht heute. #sprecher:mutter #stimmung:verschlossen
Sie hat schon aufgelegt. #sprecher:erzaehler
Deine Mutter hat Angst. Vor einer Stadt, das ist selten. #sprecher:ambrose #stimmung:nachdenklich
Wir gucken nur. Gucken ist kein Turnier. #sprecher:juno #stimmung:laechelt
Das ist eine Unterscheidung, die Advokaten machen. #sprecher:ambrose #stimmung:laechelt
-> END

// ---------------------------------------------------------------- Übergänge und Busse

=== kanalweg ===
Zurück zur Eisenbrücke und dem Kanalweg nach Riverton. #sprecher:erzaehler
-> END

// Sperre S4 (Runde 6, 13_Wegenetz §3): Zum Alten Steinbruch geht es nur mit Laterne; die Hülle
// prüft „wenn: hatLaterne“ am Übergang, dieser Knoten nennt den Grund in der Welt.
=== steinbruch_sperre ===
{hatLaterne:
    Der Weg zum Alten Steinbruch führt durch einen dunklen Hohlweg. Du hältst die Laterne hoch und gehst los. #sprecher:erzaehler
- else:
    Hinter dem Werk führt ein Hohlweg zum Alten Steinbruch, so dunkel, dass du die eigenen Füße nicht siehst. #sprecher:erzaehler
    Ohne Licht kommst du da nicht hinunter. Bei Edna gibt es Laternen. #sprecher:erzaehler
}
-> END

=== haustuer_ruth ===
{elmStreetBekannt:
    Elm Street, Nummer zehn. Das Eckhaus mit dem grünen Geländer. #sprecher:erzaehler #musik:aus #geraeusch:schritte_pflaster
    Du klingelst. Drinnen schlurfen Hausschuhe. #sprecher:erzaehler
- else:
    Reihenhäuser, eins am anderen, alle gleich. Nur das Eckhaus hat ein grünes Geländer. #sprecher:erzaehler
}
-> END

=== bus_riverton ===
Der Bus nach Riverton fährt am Bahnhof ab. Er braucht zwanzig Minuten. #sprecher:erzaehler
Zu Fuß ist es ein halber Tag. #sprecher:erzaehler
* [Einsteigen]
    Der Bus rumpelt über die Brücke. Unten glitzert der Kanal. #sprecher:erzaehler
    ~ reise("riverton.aussen", "bahnhof")
    -> END
* [Hierbleiben]
    -> END

=== bus_silicon_bay ===
{
- not einladungGesehen:
    An der Schnellstraße hält ein Fernbus: „Silicon Bay“. Was solltest du dort wollen? #sprecher:erzaehler
    -> END
- abfahrtSiliconGesehen:
    Der Fernbus nach Silicon Bay hält an der Schnellstraße. Er fährt bis zur Raststätte vor der Stadt. #sprecher:erzaehler
    -> bus_silicon_bay_einsteigen
}
-> bus_silicon_bay_abfahrt

// Szene 51 „Abfahrt im Schnee“ und 51a „Das Reisebrett“ (Akt 3).
=== bus_silicon_bay_abfahrt ===
// Roman, Kapitel 30 (Außenstelle), erster Teil: Juno weiß seit Dezember von Ambrose; Mama an der
// Haltestelle; das Reisebrett (Gegenstand gibt die Quest siliconBay, Szene akt3.abfahrt). Der Weg
// danach (Schnellstraße, Raststätte, Glasbrücke) steht in weg-ironwood-silicon.ink.
// Klang: Mamas Thema warm mit Schnee (mama.schnee).
~ abfahrtSiliconGesehen = true
Im Dezember, auf der Treppe vor der Schule, fragt Juno zum dritten Mal, was auf der Brücke noch war. #sprecher:erzaehler #musik:mama.schnee
Und warum du danach so lange auf ein Geländer gestarrt hast. #sprecher:erzaehler
* [„In dem Brett wohnt jemand.“]
- Sie lacht nicht. Sie blättert im Tagebuch weit zurück, bis in den September, und dreht es zu dir um. #sprecher:erzaehler
In rosa Tinte, zwischen einer verlorenen Partie und einem Sticker: „{held} redet mit dem Brett. Nicht fragen. Noch nicht.“ #sprecher:erzaehler #bild:tagebuch_september
Ich hab gewartet. Wie heißt er? #sprecher:juno #stimmung:froh #bild:aus
Ist er nett? Kann er mich sehen? #sprecher:juno #stimmung:froh
Findet er meine Züge schlimm? #sprecher:juno #stimmung:froh
Sag ihr, dass ihr Turm in Cedar Creek einen ehrenvollen Tod gestorben ist. #sprecher:ambrose #stimmung:lachtOhneSpott
Sie strahlt eine Woche lang. #sprecher:erzaehler
Jetzt ist Januar. An der Haltestelle an der Schnellstraße liegt der Schnee fest. #sprecher:erzaehler #geraeusch:schnee_schritte
Der Bus nach Silicon Bay hat den Motor an. #sprecher:erzaehler
Ich hab Nachtschicht. Die ganze Woche. #sprecher:mutter #stimmung:nachdenklich
Sonst käme ich mit. Juno, du passt auf. #sprecher:mutter #stimmung:nachdenklich
Ich passe immer auf. #sprecher:juno #stimmung:laechelt
Du verlierst deine Mütze, wenn du sie aufhast. #sprecher:mutter #stimmung:lacht
Aber ich merke es. #sprecher:juno #stimmung:laechelt
Mama zieht dich an sich, kurz und fest. Seit Ironwood tut sie das öfter. #sprecher:erzaehler
Guck dir alles an. Und glaub nicht alles, was glänzt. #sprecher:mutter #stimmung:nachdenklich
Ich hab mal ein Turnier in so einem Glaskasten gespielt. Man friert darin, und man weiß nicht, warum. #sprecher:mutter #stimmung:denktNach
Juno drückt dir eine kleine Holzkiste mit Stickern in die Hand. Auf dem Deckel in rosa Buchstaben: „Clubtagebuch, Außenstelle.“ #sprecher:erzaehler #bild:reisebrett
Darin ein Brett zum Aufklappen, mit Magnetfiguren. #sprecher:erzaehler #bild:aus
Ich kann nur bis Mittwoch mit. Dann ist Schule. #sprecher:juno #stimmung:nachdenklich
Damit du nicht vergisst, wie man verliert. Spiel mit Ambrose. #sprecher:juno #stimmung:froh
Oder mit mir, wenn ich anrufe. #sprecher:juno #stimmung:froh
Ein Brett für die Tasche. Meines ist schwerer, und gesprächiger. #sprecher:ambrose #stimmung:laechelt
Eine Stadt aus Glas. Wie man wohl darin Schach spielt? #sprecher:ambrose #stimmung:froh
-> bus_silicon_bay_einsteigen

=== bus_silicon_bay_einsteigen ===
* [Einsteigen]
    Der Bus fährt los, die Schnellstraße entlang, bis zu einer Raststätte vor der Stadt aus Glas. #sprecher:erzaehler
    ~ reise("wegIronwoodSilicon.raststaette", "start")
    -> END
* [Noch nicht]
    {not abschiedGesehen:
        Silicon Bay. Wir fahren, wenn du bereit bist, nicht früher. #sprecher:ambrose #stimmung:laechelt
    }
    -> END

// ---------------------------------------------------------------- Gus

=== gus ===
{
- not gusGetroffen: -> gus_erstes_treffen
- ausgangIronwoodGus == "" or ausgangIronwoodGus == "abgebrochen": -> gus_angebot
- ausgangIronwoodGus == "remis": -> gus_nach_remis
- ausgangIronwoodGus == "niederlage": -> gus_nach_niederlage
- else: -> gus_nach_sieg
}

=== gus_erstes_treffen ===
~ gusGetroffen = true
Am Güterbahnhof sitzt ein Rangierer auf einer umgedrehten Kabeltrommel, vor sich ein Brett und eine Uhr. #sprecher:erzaehler
Gus. Fünfzehn Minuten Pause. #sprecher:gus #stimmung:laechelt
Zehn für dich, fünf für mein Sandwich. #sprecher:gus #stimmung:laechelt
-> gus_angebot

=== gus_angebot ===
Zehn Minuten und fünf Sekunden je Zug, eine Stellung mit Vorteil für Weiß. Sieben Züge. #sprecher:gus #stimmung:neutral
Fertig? #sprecher:gus #stimmung:laechelt
+ [„Fertig.“]
    {not abschiedGesehen:
        Er spielt wie ein Fahrplan mit Verspätung: zuverlässig, aber nicht immer pünktlich. #sprecher:ambrose #stimmung:lacht
    }
    ~ beginnePartie("ironwood.gus")
    -> END
+ [„Nach Ihrem Sandwich.“]
    Kluger Mensch. #sprecher:gus #stimmung:laechelt
    -> END

=== gus_nach_sieg ===
Pause vorbei, Partie verloren. Guter Tag für dich. #sprecher:gus #stimmung:laechelt
Noch eine? Ich nehm mir fünf Minuten von morgen. #sprecher:gus #stimmung:laechelt
+ [„Noch eine, jetzt.“]
    ~ beginnePartie("ironwood.gus")
    -> END
+ [„Guten Appetit.“]
    -> END

=== gus_nach_niederlage ===
Pause vorbei, Partie gewonnen. Für mich. #sprecher:gus #stimmung:laechelt
Revanche? Die Pause kann ich strecken. #sprecher:gus #stimmung:laechelt
+ [„Revanche.“]
    ~ beginnePartie("ironwood.gus")
    -> END
+ [„Morgen.“]
    -> END

// Remis im Stellungsduell oder Endspiel (Regelwerk R13, R13a): Vorteil unter dem Mindest-
// vorteil. Vorher ging es in gus_nach_sieg mit „gewonnen“ und Karte (schwacher Spieler im
// Spieler-Durchlauf, 19.11.2026).
=== gus_nach_remis ===
Remis. Für einen Sieg hat die Pause keinem von uns gereicht. #sprecher:gus #stimmung:laechelt
+ [„Revanche.“]
    ~ beginnePartie("ironwood.gus")
    -> END
+ [„Morgen.“]
    -> END

// ---------------------------------------------------------------- Edna

=== edna ===
{ednaGetroffen:
    {~Kauf das Gute. Das Billige kaufst du zweimal.|Laternen, Schrauben, Fahrradteile. Das hält.|Joe kauft seit dreißig Jahren seine Schrauben bei mir. Für das Stahlbrett, sagt er.} #sprecher:edna #stimmung:laechelt
    -> edna_laden
}
~ ednaGetroffen = true
Hinter einem Verkaufsfenster voller Schrauben, Laternen und Fahrradketten steht eine alte Dame mit Lesebrille. #sprecher:erzaehler
Edna. Eisenwaren. #sprecher:edna #stimmung:stolz
Was du hier kaufst, hält. #sprecher:edna #stimmung:stolz
{
- hatFahrrad and hatLaterne:
    Rad und Laterne hast du schon, sehe ich. Gute Wahl. #sprecher:edna #stimmung:laechelt
    Schrauben brauchst du immer. #sprecher:edna #stimmung:laechelt
- hatFahrrad:
    Ein Rad hast du schon. Aber eine Laterne für dunkle Ecken? #sprecher:edna #stimmung:neutral
    Die Umkleide im Werk ist finster. #sprecher:edna #stimmung:neutral
- else:
    Im Fenster steht ein Rad für alle, die keins haben. Und Laternen für dunkle Ecken. #sprecher:edna #stimmung:neutral
}
-> edna_laden

=== edna_laden ===
~ oeffneLaden("ironwood.eisenwaren")
-> END

// ---------------------------------------------------------------- Victor und Graham Hale

=== victor ===
{
- nadelIronwood > 0 and not kaufGesehen: -> kauf
- kaufGesehen and not einladungGesehen: -> einladung
- einladungGesehen:
    An der Bushaltestelle liegen ein paar Schneeflocken auf der Bank, wo {rivale} saß. #sprecher:erzaehler
    -> END
- else:
    // Steht erst nach der Nadel am Werkstor (orte.json, wenn; Gutachten L1.3).
    -> END
}

=== graham_hale ===
{
- nadelIronwood > 0 and not kaufGesehen: -> kauf
- kaufGesehen:
    Graham Hale telefoniert am Werkstor. #sprecher:erzaehler
    „Ja, unterschrieben. Ja, ab Montag.“ #sprecher:erzaehler
    -> END
- else:
    // Steht erst nach der Nadel am Werkstor (orte.json, wenn; Gutachten L1.3).
    -> END
}

=== kauf ===
// Kapitel 29 (Roman): kein Thema, nur Wind und fernes Werk; unter Graham Hales Rede der glatte
// Konzernton. Big Joe kommt heraus: Stille, nur das Klirren der Pokale.
~ kaufGesehen = true
Es dauert neun Tage. Dann ruft Big Joe an. #sprecher:erzaehler #musik:aus
Nicht dich. Mama. #sprecher:erzaehler
Sie hört nur zu und nimmt den Mantel. #sprecher:erzaehler
Am Werkstor hängt ein neues Schild, weiß und glänzend: „Perfect Move Trainingszentrum Ironwood. Eröffnung im Januar.“ #sprecher:erzaehler #musik:aus #bild:schild_werkstor
Darunter, kleiner: „In den Räumen der ehemaligen Werkskantine.“ #sprecher:erzaehler #bild:aus
Der Club bleibt selbstverständlich. An den neuen Tischen, zu denselben Zeiten, kostenlos. #sprecher:grahamHale #stimmung:laechelt #klang:konzern
Mit einem Trainer, der nie müde wird. #sprecher:grahamHale #stimmung:laechelt
Er glaubt es. Das ist das Schlimme. #sprecher:erzaehler
Er hält es wirklich für ein Geschenk. #sprecher:erzaehler
Big Joe kommt heraus. Er trägt einen Karton vor dem Bauch, oben schauen die Pokale heraus und klirren bei jedem Schritt. #sprecher:erzaehler #geraeusch:pokale
Er sieht Graham Hale nicht an. Hinter ihm tragen Hank und Priya das Stahlbrett, zu zweit. #sprecher:erzaehler
Neben {rv_sein}em Vater steht {rivale}, in Weiß, das Tablet unter dem Arm. {rv_Er} sieht Big Joe nach, den großen Händen, die den Karton halten, als wäre er aus Glas. #sprecher:erzaehler
Vater. Vielleicht … #sprecher:victor #stimmung:nachdenklich #pause
Graham Hale dreht sich zu {rv_ihm} um. Freundlich – fragend. #sprecher:erzaehler
Nichts. #sprecher:victor #stimmung:bitter
{mamaSpielt:
    Mama geht über den Platz, an dem schwarzen Wagen vorbei, und nimmt Big Joe den Karton ab. Zusammen heben sie ihn in den Lieferwagen. #sprecher:erzaehler
}
Es beginnt zu schneien. Die ersten Flocken des Jahres bleiben auf dem Schild liegen und auf dem Dach des schwarzen Wagens. #sprecher:erzaehler #musik:mama.schnee
-> END

=== einladung ===
// Kapitel 29, Ende von Akt 2: Victors Thema zum ersten Mal unsicher; bei „J. H.“ Ambroses und
// Victors Thema gleichzeitig. Ambrose legt diesmal die Hand auf die Niete (Kapitel 24 nur darüber).
~ einladungGesehen = true
An der alten Stahlbrücke hinter dem Werkstor. {rivale} kommt allein, ohne Tablet. #sprecher:erzaehler #musik:victor.unsicher
{rv_Er} weiß nicht, wohin mit den Händen. #sprecher:erzaehler
{held}. #sprecher:victor #stimmung:nachdenklich
Du hast vier. #sprecher:victor #stimmung:nachdenklich
* [„Ja.“]
- Gegen Big Joe habe ich einmal gespielt. Bei einem Schaukampf. #sprecher:victor #stimmung:nachdenklich
Er hat mir danach einen Kakao ausgegeben. Ich wusste nicht, was ich damit machen soll. #sprecher:victor #stimmung:nachdenklich
Ich trinke keinen Kakao. #sprecher:victor #stimmung:nachdenklich
{rv_Er} hält dir eine Karte hin, weiß, mit silberner Schrift: „Jugendturnier der Perfect Move Akademie. Silicon Bay.“ #sprecher:erzaehler #bild:einladung_silber
Komm. Dann siehst du, wogegen du spielst. #sprecher:victor #stimmung:nachdenklich
{rv_Er} geht nicht. {rv_Er} sieht auf das Geländer zwischen euch. #sprecher:erzaehler #bild:aus
Mehr als drei Sekunden. #sprecher:erzaehler #pause:3
Und vielleicht sagst du mir dann, ob ich auf der richtigen Seite stehe. #sprecher:victor #stimmung:muede
{rv_Er} steigt in den Bus an der Schnellstraße, ohne sich umzusehen. Die Rücklichter werden kleiner im Schneetreiben. #sprecher:erzaehler
{rivalin:Eine Hale, die|Ein Hale, der} fragt. Das ist neu. #sprecher:ambrose #stimmung:ueberrascht
Auf dem ersten Pfosten des Geländers, klein und sauber: J. H. #sprecher:erzaehler
Ambrose legt die Hand darauf. Diesmal lässt er sie dort. #sprecher:erzaehler #musik:ambrose.victor
Er hat überall unterschrieben. Auf jeder Niete. #sprecher:ambrose #stimmung:riss
Was für ein unerträglicher, gewissenhafter Mensch. #sprecher:ambrose #stimmung:riss
{umschlagGeoeffnet:
    Seine Stimme bricht. #sprecher:erzaehler #pause:2
    Und er hat mir geschrieben. #sprecher:ambrose #stimmung:riss
}
Juno kommt die Brücke herauf, das Tagebuch unter der Jacke. #sprecher:erzaehler
Was hat {rv_er} gewollt? #sprecher:juno #stimmung:nachdenklich
* [Ihr die Karte zeigen]
- Sie liest. Sie schlägt das Tagebuch auf und schreibt quer über die Seite: „Silicon Bay“. #sprecher:erzaehler
Nach kurzem Überlegen ein Fragezeichen dahinter. Mit Glitzer. #sprecher:erzaehler #bild:tagebuch_silicon_bay
-> END

// ---------------------------------------------------------------- Gegenstände

=== eisenwarenfenster ===
Im Fenster von Ednas Laden: Schrauben in Gläsern, drei Laternen, eine Fahrradkette und ein handgeschriebenes Schild „Das hält“. #sprecher:erzaehler
-> END

=== kreidebrett ===
{kreidebrettGesehen:
    Das Kreidebrett ist halb verwischt. Jemand hat einen neuen Turm danebengemalt. #sprecher:erzaehler
    -> END
}
~ kreidebrettGesehen = true
Eins der Kreidebretter ist frisch gemalt, die Figuren sind Kieselsteine. #sprecher:erzaehler
Die h-Linie ist breiter als die a-Linie. Aber es sind acht. #sprecher:juno #stimmung:laechelt
{not abschiedGesehen:
    Ein Brett aus Kreide, Figuren aus Steinen. Wir hatten nicht mehr, und wir hatten genug. #sprecher:ambrose #stimmung:laechelt
}
-> END

// ---------------------------------------------------------------- Anleger am Kanal (Runde 6)

=== anleger ===
{lastkahnFrei:
    Am Anleger liegt die Ashford Belle, der Kahn aus Lockport. Kapitän Ruben rollt ein Seil auf. #sprecher:erzaehler
    Die Fahrt kostet 5 Münzen. #sprecher:ruben #stimmung:laechelt
    * {muenzen >= 5} [Mit der Ashford Belle nach Lockport (5 Münzen)]
        ~ zahle(5)
        ~ reise("lockport.aussen", "kai")
        -> END
    * {muenzen < 5} [Mitfahren (5 Münzen)]
        Du hast nicht genug Münzen. Ruben zuckt die Schultern. #sprecher:erzaehler
        Komm wieder, wenn die Kasse stimmt. #sprecher:ruben #stimmung:laechelt
        -> END
    * [Hierbleiben]
        -> END
- else:
    Ein leerer Anleger am schwarzen Kanal. Hier hat lange kein Kahn mehr festgemacht. #sprecher:erzaehler
}
-> END
