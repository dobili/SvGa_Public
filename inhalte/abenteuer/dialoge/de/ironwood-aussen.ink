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
Von der Brücke führt ein Abhang hinunter in eine Stadt aus Backstein und Stahl. Reihenhäuser, eins am anderen, alle gleich. #sprecher:erzaehler #musik:ironwood
Über den Hallen leuchtet der Himmel orange auf. Einen Atemzug später kommt das Geräusch, ein tiefes Fauchen. #sprecher:erzaehler #klang:hochofen #licht:ironwood
{verbotGesehen:
    Auf den Gehwegen malen Kinder Schachbretter mit Kreide. Richtige, acht mal acht. #sprecher:erzaehler
    Die können hier zählen. #sprecher:juno
    Mama hat Nein gesagt. Nicht zum Turnier. Gucken ist kein Turnier. #sprecher:juno
    -> END
}
~ verbotGesehen = true
~ setzeSzene("akt2.verbot")
Coach Delgado hat uns für ein Freundschaftsturnier hier angemeldet! Ich hab es deiner Mama gesagt. #sprecher:juno
Dein Handy klingelt. Mama. #sprecher:erzaehler
Nein. #sprecher:mutter #stimmung:verschlossen
Nicht Ironwood. #sprecher:mutter #stimmung:verschlossen
* [„Warum?“]
    Frag nicht. Bitte. Nicht heute. #sprecher:mutter #stimmung:verschlossen
    Sie hat schon aufgelegt. #sprecher:erzaehler
* [„Okay, Mama.“]
    Danke. Frag nicht. Bitte. #sprecher:mutter
- Deine Mutter hat Angst. Vor einer Stadt. Das ist selten. #sprecher:ambrose
Wir sind ja schon da. Wir gucken uns nur um. Gucken ist kein Turnier. #sprecher:juno
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
    Elm Street, Nummer zehn. Das Eckhaus mit dem grünen Geländer. #sprecher:erzaehler #musik:aus #geraeusch:schnee_schritte
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
~ abfahrtSiliconGesehen = true
Schnee liegt auf dem Wartehäuschen. Mama hat dich hergefahren, Juno hüpft von einem Fuß auf den anderen. #sprecher:erzaehler
Ich hab Nachtschicht. Juno, du passt auf. Und du rufst an, jeden Abend. #sprecher:mutter
Juno drückt dir eine kleine Holzkiste in die Hand: ihr Reisebrett, auf dem Deckel „Clubtagebuch, Außenstelle“. #sprecher:erzaehler
Damit du nicht vergisst, wie man verliert. Spiel mit Ambrose. Oder mit mir. #sprecher:juno #stimmung:froh
Eine Stadt aus Glas. Wie man wohl darin Schach spielt? #sprecher:ambrose
-> bus_silicon_bay_einsteigen

=== bus_silicon_bay_einsteigen ===
* [Einsteigen]
    Der Bus fährt los, die Schnellstraße entlang, bis zu einer Raststätte vor der Stadt aus Glas. #sprecher:erzaehler
    ~ reise("wegIronwoodSilicon.raststaette", "start")
    -> END
* [Noch nicht]
    Silicon Bay. Wir fahren, wenn du bereit bist. Nicht früher. #sprecher:ambrose
    -> END

// ---------------------------------------------------------------- Gus

=== gus ===
{
- not gusGetroffen: -> gus_erstes_treffen
- ausgangIronwoodGus == "" or ausgangIronwoodGus == "abgebrochen": -> gus_angebot
- ausgangIronwoodGus == "niederlage": -> gus_nach_niederlage
- else: -> gus_nach_sieg
}

=== gus_erstes_treffen ===
~ gusGetroffen = true
Am Güterbahnhof sitzt ein Rangierer auf einer umgedrehten Kabeltrommel, vor sich ein Brett und eine Uhr. #sprecher:erzaehler
Gus. Fünfzehn Minuten Pause. Zehn für dich, fünf für mein Sandwich. #sprecher:gus
-> gus_angebot

=== gus_angebot ===
Zehn Minuten und fünf Sekunden je Zug, eine Stellung mit Vorteil für Weiß. Zehn Züge. #sprecher:gus
Fertig? #sprecher:gus
* [„Fertig.“]
    Er spielt wie ein Fahrplan mit Verspätung: zuverlässig, aber nicht immer pünktlich. #sprecher:ambrose
    ~ beginnePartie("ironwood.gus")
    -> END
* [„Nach deinem Sandwich.“]
    Kluger Mensch. #sprecher:gus
    -> END

=== gus_nach_sieg ===
Pause vorbei, Partie verloren. Guter Tag für dich. Noch eine, morgen um zwölf? #sprecher:gus
+ [„Noch eine, jetzt.“]
    ~ beginnePartie("ironwood.gus")
    -> END
+ [„Guten Appetit.“]
    -> END

=== gus_nach_niederlage ===
Pause vorbei, Partie gewonnen. Für mich. Morgen wieder? #sprecher:gus
+ [„Revanche.“]
    ~ beginnePartie("ironwood.gus")
    -> END
+ [„Morgen.“]
    -> END

// ---------------------------------------------------------------- Edna

=== edna ===
{ednaGetroffen:
    {~Kauf das Gute. Das Billige kaufst du zweimal.|Laternen, Schrauben, Fahrradteile. Das hält.|Joe kauft seit dreißig Jahren seine Schrauben bei mir. Für das Stahlbrett, sagt er.} #sprecher:edna
    -> edna_laden
}
~ ednaGetroffen = true
Hinter einem Verkaufsfenster voller Schrauben, Laternen und Fahrradketten sitzt eine alte Dame mit Lesebrille. #sprecher:erzaehler
Edna. Eisenwaren. Was du hier kaufst, hält. #sprecher:edna
{
- hatFahrrad and hatLaterne:
    Rad und Laterne hast du schon, sehe ich. Gute Wahl. Schrauben brauchst du immer. #sprecher:edna
- hatFahrrad:
    Ein Rad hast du schon. Aber eine Laterne für dunkle Ecken? Die Umkleide im Werk ist finster. #sprecher:edna
- else:
    Im Fenster steht ein Rad für alle, die keins haben. Und Laternen für dunkle Ecken. #sprecher:edna
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
    An der Bushaltestelle liegen ein paar Schneeflocken auf der Bank, wo Victor saß. #sprecher:erzaehler
    -> END
- else:
    Victor steht mit einem Tablet am Werkstor und tippt. Er nickt dir zu, mehr nicht. #sprecher:erzaehler
    -> END
}

=== graham_hale ===
{
- nadelIronwood > 0 and not kaufGesehen: -> kauf
- kaufGesehen:
    Graham Hale telefoniert am Werkstor. „Ja, unterschrieben. Ja, ab Montag.“ #sprecher:erzaehler
    -> END
- else:
    Ein Mann im Anzug spricht am Werkstor mit dem Pförtner. Auf seiner Mappe steht „Perfect Move“. #sprecher:erzaehler
    -> END
}

=== kauf ===
// Kapitel 29 (Roman): kein Thema, nur Wind und fernes Werk; unter Graham Hales Rede der glatte
// Konzernton. Big Joe kommt heraus: Stille, nur das Klirren der Pokale.
~ kaufGesehen = true
Am Werkstor hängt ein neues Schild, weiß und glänzend: „Perfect Move Trainingszentrum Ironwood. Eröffnung im Januar.“ #sprecher:erzaehler #musik:aus #bild:schild_werkstor
Darunter, kleiner: „In den Räumen der ehemaligen Werkskantine.“ #sprecher:erzaehler #bild:aus
Der Club bleibt selbstverständlich. An den neuen Tischen, zu denselben Zeiten, kostenlos. #sprecher:grahamHale #klang:konzern
Mit einem Trainer, der nie müde wird. #sprecher:grahamHale
Er glaubt es. Das ist das Schlimme. Er hält es wirklich für ein Geschenk. #sprecher:erzaehler
Big Joe kommt heraus. Er trägt einen Karton vor dem Bauch, oben schauen die Pokale heraus und klirren bei jedem Schritt. #sprecher:erzaehler #geraeusch:pokale
Er sieht Graham Hale nicht an. Hinter ihm tragen Hank und Priya das Stahlbrett, zu zweit. #sprecher:erzaehler
Vater. Vielleicht … #sprecher:victor #pause
Graham Hale dreht sich zu ihm um. Freundlich. Fragend. #sprecher:erzaehler
Nichts. #sprecher:victor
{mamaSpielt:
    Mama geht über den Platz, an dem schwarzen Wagen vorbei, und nimmt Big Joe den Karton ab. Zusammen heben sie ihn in den Lieferwagen. #sprecher:erzaehler
}
Es beginnt zu schneien. Die ersten Flocken des Jahres bleiben auf dem Schild liegen und auf dem Dach des schwarzen Wagens. #sprecher:erzaehler #musik:mama.schnee
-> END

=== einladung ===
// Kapitel 29, Ende von Akt 2: Victors Thema zum ersten Mal unsicher; bei „J. H.“ Ambroses und
// Victors Thema gleichzeitig. Ambrose legt diesmal die Hand auf die Niete (Kapitel 24 nur darüber).
~ einladungGesehen = true
An der alten Stahlbrücke hinter dem Werkstor. Victor kommt allein, ohne Tablet. Er weiß nicht, wohin mit den Händen. #sprecher:erzaehler #musik:victor.unsicher
{held}. #sprecher:victor
Du hast vier. #sprecher:victor
* [„Ja.“]
- Gegen den habe ich einmal gespielt. Kowalski. Bei einem Schaukampf. #sprecher:victor
Er hat mir danach einen Kakao ausgegeben. Ich wusste nicht, was ich damit machen soll. Ich trinke keinen Kakao. #sprecher:victor
Er hält dir eine Karte hin, weiß, mit silberner Schrift: „Jugendturnier der Perfect Move Akademie. Silicon Bay.“ #sprecher:erzaehler #bild:einladung_silber
Komm. Dann siehst du, wogegen du spielst. #sprecher:victor
Er geht nicht. Er sieht auf das Geländer zwischen euch. Mehr als drei Sekunden. #sprecher:erzaehler #bild:aus #pause:3
Und vielleicht sagst du mir dann, ob ich auf der richtigen Seite stehe. #sprecher:victor #stimmung:muede
Er steigt in den Bus an der Schnellstraße, ohne sich umzusehen. Die Rücklichter werden kleiner im Schneetreiben. #sprecher:erzaehler
Ein Hale, der fragt. Das ist neu. #sprecher:ambrose
Auf dem ersten Pfosten des Geländers, klein und sauber: J. H. #sprecher:erzaehler
Ambrose legt die Hand darauf. Diesmal lässt er sie dort. #sprecher:erzaehler #musik:ambrose.victor
Er hat überall unterschrieben. Auf jeder Niete. Was für ein unerträglicher, gewissenhafter Mensch. #sprecher:ambrose #stimmung:riss
Und er hat mir geschrieben. #sprecher:ambrose #stimmung:riss
Juno kommt die Brücke herauf, das Tagebuch unter der Jacke. #sprecher:erzaehler
Was hat er gewollt? #sprecher:juno
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
Auf dem Gehweg haben Kinder ein Schachbrett mit Kreide gemalt. Ein richtiges, acht mal acht. #sprecher:erzaehler
Die können hier zählen. #sprecher:juno
Ein Brett aus Kreide, Figuren aus Steinen. Wir hatten nicht mehr, und wir hatten genug. #sprecher:ambrose
-> END

// ---------------------------------------------------------------- Anleger am Kanal (Runde 6)

=== anleger ===
{lastkahnFrei:
    Am Anleger liegt die Ashford Belle, der Kahn aus Lockport. Kapitän Ruben rollt ein Seil auf. #sprecher:erzaehler
    „Die Fahrt kostet 5 Münzen“, sagt Ruben. #sprecher:erzaehler
    * {muenzen >= 5} [Mit der Ashford Belle nach Lockport (5 Münzen)]
        ~ zahle(5)
        ~ reise("lockport.aussen", "kai")
        -> END
    * {muenzen < 5} [Mitfahren (5 Münzen)]
        Du hast nicht genug Münzen. Ruben zuckt die Schultern: „Komm wieder, wenn die Kasse stimmt.“ #sprecher:erzaehler
        -> END
    * [Hierbleiben]
        -> END
- else:
    Ein leerer Anleger am schwarzen Kanal. Hier hat lange kein Kahn mehr festgemacht. #sprecher:erzaehler
}
-> END
