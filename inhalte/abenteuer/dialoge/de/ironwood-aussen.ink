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
EXTERNAL oeffneLaden(laden)

VAR ankunftIronwoodGesehen = false
VAR elmStreetBekannt = false
VAR mamaSpielt = false
VAR gusGetroffen = false
VAR ausgangIronwoodGus = ""
VAR ednaGetroffen = false
VAR hatFahrrad = false
VAR hatLaterne = false
VAR nadelIronwood = 0
VAR kaufGesehen = false
VAR einladungGesehen = false
VAR kreidebrettGesehen = false

// ---------------------------------------------------------------- Ankunft und Verbot

=== ankunft_zu_fuss ===
{ankunftIronwoodGesehen:
    Der Abhang von der Brücke führt hinunter nach Ironwood. #sprecher:erzaehler
    -> END
}
~ ankunftIronwoodGesehen = true
~ setzeSzene("akt2.verbot")
Von der Brücke führt ein Abhang hinunter in eine Stadt aus Backstein und Stahl. Aus den Schornsteinen steigt Rauch. #sprecher:erzaehler
Coach Delgado hat uns für ein Freundschaftsturnier hier angemeldet! Ich hab es deiner Mama gesagt. #sprecher:juno
Dein Handy klingelt. Mama. #sprecher:erzaehler #pause
Nein. Nicht Ironwood. #sprecher:mutter #stimmung:ernst
Frag nicht, bitte. Nicht heute. #sprecher:mutter
Und heute Abend bist du zu Hause, ja? Ich hab Nachtschicht, aber ich ruf an. #sprecher:mutter
* [„Warum nicht Ironwood?“]
    Sie hat schon aufgelegt. #sprecher:erzaehler
* [„Okay, Mama.“]
    Danke. Hab dich lieb. #sprecher:mutter
- Ihre Mutter hat Angst. Vor einer Stadt. Das ist selten. #sprecher:ambrose
Wir sind ja schon da. Wir gucken uns nur um. Gucken ist kein Turnier. #sprecher:juno
-> END

// ---------------------------------------------------------------- Übergänge und Busse

=== kanalweg ===
Zurück zur Eisenbrücke und dem Kanalweg nach Riverton. #sprecher:erzaehler
-> END

=== haustuer_ruth ===
{elmStreetBekannt:
    Elm Street, ein Reihenhaus mit grüner Tür. Du klingelst. #sprecher:erzaehler
    Drinnen schlurfen Hausschuhe. #sprecher:erzaehler
- else:
    Eine Reihe gleicher Häuser in der Elm Street. Hinter dieser grünen Tür wohnt jemand, den du nicht kennst. #sprecher:erzaehler
    Noch nicht. #sprecher:erzaehler
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
{einladungGesehen:
    Der Bus nach Silicon Bay steht an der Schnellstraße. Auf der Einladung in deiner Tasche steht ein Datum. #sprecher:erzaehler
    Noch nicht heute. #sprecher:erzaehler
    Silicon Bay. Wir fahren, wenn du bereit bist. Nicht früher. #sprecher:ambrose
- else:
    An der Schnellstraße hält ein Fernbus: „Silicon Bay“. Was solltest du dort wollen? #sprecher:erzaehler
}
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
~ kaufGesehen = true
Am Werkstor hängt ein neues Schild: „Kantine ab Montag Trainingszentrum von Perfect Move“. #sprecher:erzaehler
Das Werk hat die Kantine vermietet. Euer Club kann gern an unseren Tischen weiterspielen, kostenlos. #sprecher:grahamHale
Big Joe sagt nichts. Er trägt die Pokale in einem Karton aus der Tür. #sprecher:erzaehler
Victor steht neben seinem Vater und sieht Big Joe an. „Vater, vielleicht …“ Er bricht ab. #sprecher:erzaehler #pause
{mamaSpielt:
    Mama stellt sich neben Big Joe, ohne ein Wort. Ihre Hand liegt auf seinem Arm. #sprecher:erzaehler
}
Zum dritten Mal ein Raum, in dem Menschen gespielt haben, und zum dritten Mal Bildschirme. Ich zähle mit. #sprecher:ambrose #stimmung:streng
-> END

=== einladung ===
~ einladungGesehen = true
Es wird Abend. Der erste Schnee fällt auf die Brücke. #sprecher:erzaehler
Victor kommt allein vom Werkstor herüber, ohne Tablet. #sprecher:erzaehler
Hier. Eine Einladung zum Jugendturnier der Akademie in Silicon Bay. #sprecher:victor
Komm. Dann siehst du, wogegen du spielst. #sprecher:victor #stimmung:muede
Und vielleicht sagst du mir dann, ob ich auf der richtigen Seite stehe. #sprecher:victor #pause
Er steigt in den Bus nach Silicon Bay, bevor du antworten kannst. #sprecher:erzaehler
Ambrose sieht dem Bus nach, dann auf die Nieten der Brücke mit „J. H.“. #sprecher:erzaehler
Ein Hale, der fragt. Das ist neu. #sprecher:ambrose
Im Tagebuch steht jetzt „Silicon Bay“. Juno malt ein Fragezeichen dahinter, mit Glitzer. #sprecher:erzaehler
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
Auf dem Gehweg haben Kinder ein Schachbrett mit Kreide gemalt, die Figuren sind Steine und Kronkorken. #sprecher:erzaehler
Ein Brett aus Kreide, Figuren aus Steinen. Wir hatten nicht mehr, und wir hatten genug. #sprecher:ambrose
-> END
