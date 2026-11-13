// Ort: Riverton außen (Akt 2): Bahnhof, Brücke, Park mit Pavillon und Bildschirmtischen,
// Handyladen, geschlossene Fahrradwerkstatt (Story-Bibel, Abschnitt 10.2; Weltbeschreibung 5.4).
//
// Szenen der Bibel: 28 Ankunft (akt2.ankunftRiverton, Quest riverton.parkclub), 29 Die
// Bildschirmtische (Nova, Victor, Ambrose `fern`), 33 Der verrostete Schlüssel (Quest
// riverton.schuppen, Mrs. Albescu), Fund „Läufer aus Holz“ unter der Brücke.
// Einstiege wie in orte.json: Figuren albescu, nova, victor; Gegenstände bildschirmtische,
// handyladen, fund_laeufer; Übergänge ankunft_zu_fuss (vom Bahndamm, vor dem Wechsel), bahndamm
// (zurück), kanalweg (wenn nadelRiverton), wohnwagen_zu (wenn clubkampfRivertonBesprochen),
// schuppen_zu (wenn schuppenOffen).
// Die Ankunft läuft auch beim ersten Gespräch draußen, falls der Übergang sie nicht gezeigt hat.
//
// Runde 11 (13.11.2026): an den Roman zu Akt 2 angeglichen (roman/akt2_teil1.md und
// akt2_teil2.md, Kapitel 18 bis 22), Klang nach 21_Klangplan.md (Akt 2). Stufen der kleinen
// Geschichten in Riverton (Ortsblatt Riverton, Dokument 20): A bis zur Nadel von Riverton, B danach,
// C nach der Nadel von Ironwood, D nach dem Ende von Akt 3 (endeAkt3Gesehen).
//
// Variablen: nadelRiverton setzt die Hülle (Zahl, R42). schuppenOffen setzt albescu_schluessel,
// clubkampfRivertonBesprochen setzt riverton-pavillon.ink. gefundenSchluessel setzt die Hülle,
// sobald der Schlüssel am Steg in Cedar Creek gefunden ist (cedar-creek-aussen.fund_schluessel).

EXTERNAL gibFund(kennung)

EXTERNAL reise(karte, ausloeser)
EXTERNAL zahle(muenzen)
// Lastkahn (L3, 14_Akt2_Leben_teil1 4.3): lastkahnFrei setzt Lockport, wenn Ruben Big Joes Brief liest.
VAR lastkahnFrei = false
VAR muenzen = 0
VAR held = "Du"
VAR ankunftRivertonGesehen = false
VAR novaGesehen = false
VAR victorRivertonGesehen = false
VAR bildschirmtischeGesehen = false
VAR albescuGetroffen = false
VAR gefundenSchluessel = false
VAR schuppenOffen = false
VAR holzlaeuferGefunden = false
VAR nadelRiverton = 0
VAR clubkampfRivertonBesprochen = false
VAR nadelIronwood = 0
VAR endeAkt3Gesehen = false
VAR eliGesehen = false

// ---------------------------------------------------------------- Ankunft

=== ankunft_zu_fuss ===
{ankunftRivertonGesehen:
    Der Feldweg endet am Bahnhof von Riverton. #sprecher:erzaehler
    -> END
}
Der Feldweg neben den Gleisen endet an einem Bahnhof aus rotem Backstein. Es beginnt zu regnen. #sprecher:erzaehler
-> ankunft

=== ankunft ===
// Kapitel 18: laut, nass, lebendig. Musik und Regen kommen von der Karte (riverton, regen).
~ ankunftRivertonGesehen = true
Riverton riecht nach Regen auf Stein. Backstein, rot und rußig, Feuerleitern, Schornsteine, aus denen nichts mehr kommt. #sprecher:erzaehler
Ein Bus hupt. Jemand ruft über die Straße nach einem Earl. Aus zwei Fenstern kommen zwei Musiken und streiten sich. #sprecher:erzaehler
Hier bin ich geboren. Also fast. Meine Cousine. Die ist hier geboren. #sprecher:juno #stimmung:froh
An jeder Laterne ein Plakat, sauber und glänzend auf dem nassen Stein: „Perfect Move Park. Schach für alle. Ohne Wartezeit.“ #sprecher:erzaehler
Ohne Wartezeit. Als wäre das Warten nicht das Schönste daran. #sprecher:ambrose
-> END

// ---------------------------------------------------------------- Übergänge

=== bahndamm ===
Zurück auf den Feldweg am Bahndamm. Der Zug wäre schneller, aber der Weg ist schöner. #sprecher:erzaehler
-> END

=== kanalweg ===
{nadelRiverton > 0:
    Der Treidelpfad am Kanal führt nach Ironwood. Zu Fuß ist es weit, mit dem Rad geht es schneller. #sprecher:erzaehler
    Ironwood. Dort riecht die Luft nach Eisen, sagt man. Gehen wir. #sprecher:ambrose
- else:
    Ein Treidelpfad führt am Kanal entlang Richtung Ironwood. #sprecher:erzaehler
    Erst der Pavillon, {held}. Wer eine Stadt verlässt, bevor er dort gespielt hat, war nie richtig da. #sprecher:ambrose
}
-> END

=== wohnwagen_zu ===
{clubkampfRivertonBesprochen:
    Aus Slicks Wohnwagen ruft es: „Tür ist offen, Kopf einziehen!“ #sprecher:erzaehler
- else:
    Ein Wohnwagen am Fluss, ein Kurierrad lehnt daneben. Die Tür ist zu, drinnen ist niemand. #sprecher:erzaehler
}
-> END

=== schuppen_zu ===
{schuppenOffen:
    Die Schuppentür quietscht in den Angeln. Drinnen riecht es nach Staub und Öl. #sprecher:erzaehler
- else:
    Ein Holzschuppen hinter der geschlossenen Werkstatt. Ein rostiges Vorhängeschloss hält die Tür zu. #sprecher:erzaehler
}
-> END

// ---------------------------------------------------------------- Mrs. Albescu

=== albescu ===
{
- not ankunftRivertonGesehen: -> ankunft
- not albescuGetroffen: -> albescu_erstes_treffen
- gefundenSchluessel and not schuppenOffen: -> albescu_schluessel
- schuppenOffen: -> albescu_alltag
- else: -> albescu_wartet
}

=== albescu_erstes_treffen ===
// Kapitel 20: Der Wandel trifft nicht nur das Schach (Räder kommen jetzt im Karton aus dem
// Handyladen); ihr Mann lebt nicht mehr. Juno fragt, weil sie mit jedem redet.
~ albescuGetroffen = true
Hinter dem Park eine Werkstatt mit heruntergelassenem Rollladen: „Albescu. Fahrräder. Reparatur am selben Tag.“ Die Buchstaben blättern ab. #sprecher:erzaehler
Davor fegt eine Frau Laub, das der Wind sofort wieder hinlegt. #sprecher:erzaehler #klang:besen_stein
Juno fragt nach dem Weg zu einem Laden, den sie gar nicht sucht. Die Frau stützt sich auf den Besen. #sprecher:erzaehler
Im Frühjahr hab ich zugemacht. Die Leute bestellen ihre Räder jetzt im Handyladen. #sprecher:albescu
Man tippt eine Zahl ein, und nach drei Tagen kommt ein Karton. #sprecher:albescu
Im Schuppen hinten steht noch alles, wie mein Mann es gelassen hat. Ich komm nicht hinein. #sprecher:albescu
* [„Warum nicht?“]
* [Zuhören]
- Der Schlüssel. Er hatte ihn immer an der Angelweste. Vor zwei Jahren kommt er vom Bach bei Cedar Creek, und der Schlüssel ist weg. #sprecher:albescu
Er hat den ganzen Sommer gesucht. Dann hat er gesagt, wir lassen ein neues Schloss machen. #sprecher:albescu
Sie fegt ein Blatt beiseite. #sprecher:erzaehler
Wir sind nicht mehr dazu gekommen. #sprecher:albescu #pause:2
{gefundenSchluessel: -> albescu_schluessel}
-> END

=== albescu_wartet ===
{~Der Schlüssel ist groß und rostig, mit einem runden Griff. Wenn du ihn siehst, erkennst du ihn.|Mein Mann angelte überall, am liebsten bei Cedar Creek. Er sagte, dort beißen die Fische freundlicher.} #sprecher:albescu
-> END

=== albescu_schluessel ===
~ schuppenOffen = true
Der Schlüssel aus dem Schilf. Du hast ihn vergessen, wie man Dinge vergisst, die nichts wiegen. #sprecher:erzaehler
Du hältst ihn ihr hin. Sie sieht ihn an. Sie nimmt ihn nicht gleich. #sprecher:erzaehler #pause:2
Den hat mein Mann verloren. Beim Angeln. Vor zwei Jahren! #sprecher:albescu #stimmung:froh
Sie lacht, und gleichzeitig wischt sie sich mit dem Handrücken über die Augen. #sprecher:erzaehler
Das Schloss klemmt. Es braucht euch beide und einen Tropfen Öl aus einem Kännchen in ihrer Schürze. Dann geht die Tür auf. #sprecher:erzaehler #klang:schloss
-> END

=== albescu_alltag ===
// Kleine Geschichte Mrs. Albescu (Ortsblatt Riverton): B Schuppen offen, C sie repariert wieder
// Räder vor der Tür, D ein handgemaltes Schild.
{
- endeAkt3Gesehen:
    Über der Werkstatt hängt ein neues Schild, mit der Hand gemalt: „Reparatur am selben Tag“. #sprecher:erzaehler
    Mrs. Albescu winkt mit einem Schraubenschlüssel. Die Kette springt? Komm her. #sprecher:albescu #stimmung:froh
- nadelIronwood > 0:
    Vor der Werkstatt steht ein Rad auf dem Kopf. Mrs. Albescu sitzt auf einem Hocker davor und dreht an der Kette. #sprecher:erzaehler
    Dafür brauche ich keine Knie. Nur Zeit. #sprecher:albescu
- else:
    {~Fährt es gut? Die Bremsen hab ich frisch eingestellt. Im Kopf.|Wenn die Kette springt, kommst du her, und ich zeige dir, wie man das macht.} #sprecher:albescu
}
-> END

// ---------------------------------------------------------------- Nova und Victor

=== nova ===
// Kapitel 18: zwei Gesichter, Kamera an und aus; sie setzt sich in den Regen (Porträtfassung
// „Kamera aus“ gibt es noch nicht).
{
- not ankunftRivertonGesehen: -> ankunft
- novaGesehen:
    Nova sitzt auf der Kante des Podiums. Die Kameras sind weg. Sie sieht nicht auf. #sprecher:erzaehler
    -> END
}
~ novaGesehen = true
Auf dem Podium steht ein Mädchen in einer weißen Jacke mit dem Zeichen des Konzerns und lächelt in die Kameras. #sprecher:erzaehler
Mit Perfect Move trainiert jeder wie ein Champion! Kein Warten auf einen Gegner. Keine schlechten Tage. #sprecher:nova #stimmung:froh
Der Tisch ist immer bereit, immer geduldig, immer genau so stark, wie du ihn brauchst. #sprecher:nova #stimmung:froh
Dann gehen die roten Lichter an den Kameras aus. Ihr Lächeln fällt herunter wie etwas, das man loslässt. #sprecher:erzaehler #pause:2
Kann ich jetzt kurz sitzen? #sprecher:nova
* [Juno ansehen]
* [Weiter zusehen]
- Sie fragt niemanden. Sie setzt sich auf die Kante des Podiums, in den Regen. #sprecher:erzaehler
Nova Sinclair. Landesmeisterin. Der Highschools. Die hat noch nie verloren. #sprecher:juno
-> END

=== victor ===
// Kapitel 18: Victor spricht die Sätze des Vaters; kein freundlicher Satz vor Akt 3.
{
- not ankunftRivertonGesehen: -> ankunft
- victorRivertonGesehen: -> victor_alltag
}
~ victorRivertonGesehen = true
Neben dem Podium steht Victor, im selben Weiß, die Hände auf dem Rücken. Auf seiner Jacke steht sein Name. #sprecher:erzaehler
Ins Mikrofon sagt er drei Sätze. Trainingspläne, die sich anpassen. Auswertung in Echtzeit. Es sind die Sätze seines Vaters. #sprecher:erzaehler
Dann kommt er herüber, nicht schnell. Du. #sprecher:victor #stimmung:kalt
Er sieht auf deine Jacke. Zwei. #sprecher:victor
* [„Zwei.“]
* [Nichts sagen]
- Er nickt, als trüge er eine Zahl in eine Liste ein. Dann sieht er zu den Tischen. #sprecher:erzaehler
Sie machen keine Fehler. Das ist der Punkt. #sprecher:victor
* [„Und das ist gut?“]
    Er antwortet nicht gleich. Wieder diese Sekunden. #sprecher:erzaehler #pause:2
    Mein Vater sagt ja. #sprecher:victor
* [Gehen]
- -> END

=== victor_alltag ===
Victor steht unter dem Banner und tippt auf ein Tablet. Einmal sieht er zum Pavillon hinüber, dann schnell wieder weg. #sprecher:erzaehler
-> END

// ---------------------------------------------------------------- Gegenstände

=== bildschirmtische ===
// Kapitel 18: sechs weiße Tische in einer Reihe, das einzige Gerade im Park. Ambrose sieht hin
// (Stimmung fern), nennt sie einen Rechenschieber mit Beleuchtung und sieht weiter hin.
{
- not ankunftRivertonGesehen: -> ankunft
- bildschirmtischeGesehen: -> bildschirmtische_wieder
}
~ bildschirmtischeGesehen = true
Auf der Wiese stehen sechs Tische in einer Reihe, weiß, mit Bildschirmen, die im Regen leuchten. Über jedem ein kleines Dach aus Glas. #sprecher:erzaehler #musik:konzern.flaeche
Auf einem läuft eine Partie. Niemand sitzt davor. Die Figuren ziehen von selbst, wie Wasser einen Hang hinunter. #sprecher:erzaehler
* [„Ambrose?“]
    Er dreht sich nicht um. #sprecher:erzaehler
* [Hinsehen]
- Sie hat nicht gezögert. Kein einziges Mal. Achtundzwanzig Züge. Und in keinem … #sprecher:ambrose #stimmung:fern #pause:2
Eine Rechenmaschine, die nie zweifelt, ist kein Spieler. Das ist ein Rechenschieber mit Beleuchtung. #sprecher:ambrose
Er sagt es laut, mit seiner alten Stimme. Aber er sieht weiter hin. #sprecher:erzaehler
-> END

=== bildschirmtische_wieder ===
{
- not eliGesehen: -> eli
- else:
    Auf allen Bildschirmen laufen Partien, Zug um Zug, ohne Pause. Ambrose sieht hin. Lange. #sprecher:erzaehler #musik:konzern.flaeche
    -> END
}

// ---------------------------------------------------------------- Eli (kleine Geschichte)
// Neu im Roman (Kapitel 19, Dokument 19, Abschnitt 3): Der Tisch ist geduldig mit einem, der nicht
// reden mag. Eli spricht nicht; Stufen nach dem Ortsblatt Riverton. Auslöser „eli“ fehlt noch auf
// der Karte; bis dahin erreicht man ihn über die Bildschirmtische.
=== eli ===
~ eliGesehen = true
{
- endeAkt3Gesehen:
    Eli spielt heute unter der Brücke, an einem Klappbrett. Gestern saß er am Tisch. Beides ist recht. #sprecher:erzaehler
- nadelIronwood > 0:
    Eli sitzt am Rand unter der Brücke und schaut den anderen zu. Er sagt nichts. Er geht auch nicht. #sprecher:erzaehler
- nadelRiverton > 0:
    Eli sitzt wieder am leuchtenden Tisch. Neben dem Bildschirm steht eine Dose Limonade. Tamsin hat sie hingestellt. #sprecher:erzaehler
- else:
    An einem Tisch sitzt jetzt ein Junge, kleiner als Tamsin, allein. Der Bildschirm wirft Licht auf sein Gesicht. #sprecher:erzaehler
    Er sieht nicht auf. Der Tisch wartet geduldig, bis er zieht. #sprecher:erzaehler
    Geduldig ist er, das muss man ihm lassen. Geduldiger als ich. #sprecher:ambrose
}
-> END

=== handyladen ===
Ein Laden voller Tablets mit dem Logo von Perfect Move. Im Schaufenster: „Dein persönlicher Trainer, schon ab heute.“ #sprecher:erzaehler
Ein Trainer in einem Glaskasten. Hoffentlich bekommt er genug Luft. #sprecher:ambrose
-> END

=== fund_laeufer ===
{holzlaeuferGefunden:
    Unter der Brücke spielt der Straßenmusiker dasselbe Lied wie vorhin. #sprecher:erzaehler
    -> END
}
~ holzlaeuferGefunden = true
Unter der Brücke spielt ein Straßenmusiker Gitarre. Neben seinem Hut liegt ein Läufer aus hellem Holz. #sprecher:erzaehler
„Den hab ich hier gefunden“, sagt er. „Behalt ihn, ich spiele nur Gitarre.“ #sprecher:erzaehler
~ gibFund("holzlaeufer")
Noch ein Holzstück. Jemand hat einen ganzen Satz verloren. #sprecher:ambrose
-> END

// ---------------------------------------------------------------- Anleger am Kanalbecken (Runde 6)

=== anleger_schild ===
Am Anleger hängt ein Blechschild: „Lastkahn Ashford Belle: Riverton – Lockport – Ironwood. Fahrten nach Ansage.“ #sprecher:erzaehler
{lastkahnFrei:
    Die Belle liegt am Anleger, Kapitän Ruben winkt vom Deck. #sprecher:erzaehler
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
    Der Anleger ist leer. Niemand hat eine Ansage gemacht. #sprecher:erzaehler
}
-> END
