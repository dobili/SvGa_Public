// Ort: Capital Arena außen (Akt 4): Vorplatz mit Treppe und Fahnen, langer Sommerabend (Story-Bibel
// 27.4 und 28).
//
// Szenen der Bibel (Abschnitt 29): Ankunft vom Leuchtturm (Ende von Szene 102), 103 Die Capital
// Arena (beim ersten Betreten der Halle: Juno liest die Liga vor, Dr. Lin und Nova gehen zur
// Turnierleitung), 109 Abschied (nach dem Finale auf der Treppe, danach zeigeAbspann()).
// Einstiege wie in orte.json: ankunft_zu_fuss, mama, juno, weg_ghost, halle_betreten, treppe.
//
// Die Liga zählt Ink aus den Nadeln der acht Clubs (R22: Gold 3, Silber 2, Bronze 1; Bronze-Liga ab
// 8, Silber ab 16, Gold ab 22 Punkten). Variablen: nadel<Ort> und ausgangCapitalArenaFinale setzt
// die Hülle (R42), novaHilfeZugesagt crossroads-raststaette.ink; die übrigen setzt diese Datei.

EXTERNAL gibFund(kennung)
EXTERNAL zeigeAbspann()

VAR held = "Du"
VAR nadelMapleFalls = 0
VAR nadelCedarCreek = 0
VAR nadelRiverton = 0
VAR nadelIronwood = 0
VAR nadelSiliconBay = 0
VAR nadelPortDelacroix = 0
VAR nadelDesertSprings = 0
VAR nadelSummitCity = 0
VAR ankunftCapitalArenaGesehen = false
VAR arenaGesehen = false
VAR ausgangCapitalArenaFinale = ""
VAR abschiedGesehen = false
VAR novaHilfeZugesagt = false
VAR angesehenFahnen = false
VAR wandererSeitenZurueck = 0
VAR buchGeschenkt = false
VAR wandererCapitalGetroffen = false

=== function ligapunkte() ===
~ return nadelMapleFalls + nadelCedarCreek + nadelRiverton + nadelIronwood + nadelSiliconBay + nadelPortDelacroix + nadelDesertSprings + nadelSummitCity

=== function finaleGespielt() ===
~ return ausgangCapitalArenaFinale != "" and ausgangCapitalArenaFinale != "abgebrochen"

// ---------------------------------------------------------------- Ankunft und Wege

=== ankunft_zu_fuss ===
{ankunftCapitalArenaGesehen:
    Der Weg vom See endet am Vorplatz der Capital Arena. #sprecher:erzaehler
    -> END
}
~ ankunftCapitalArenaGesehen = true
// Roman Kapitel 60: die Arena als weiße Muschel, die Busse aller Städte, alle auf der Treppe.
Die Arena ist rund und weiß, mit einem Dach wie eine Muschel. Über dem Eingang hängt das Band mit acht Gesichtern. #sprecher:erzaehler #musik:arena
Deines hat noch immer Ketchup am Kinn. #sprecher:erzaehler
Auf dem Platz stehen Busse. Der graue mit den Rostflecken. Ein Kleinbus mit „RIVETON“ aus Klebeband. #sprecher:erzaehler
Ein türkisfarbener Lastwagen, aus dem es dampft. Ein Pick-up mit einem Zahnstocher am Rückspiegel. #sprecher:erzaehler
Sie sind alle gekommen. #sprecher:mutter
* [Zur Treppe sehen]
- Coach Delgado zählt Köpfe. Mrs. Okafor sehr aufrecht neben Mr. Boateng mit seinem besten Hut. Slick auf dem Geländer, mit drei Kindern. #sprecher:erzaehler
Big Joe braucht allein zwei Stufen. Dr. Lin ohne Kittel. Miss Odile, Remy, Lou. Mira auf Tomás’ Schultern. Dot mit Lockenwicklern. #sprecher:erzaehler
Ward steht ein wenig abseits und betrachtet alles, als wäre es eine Stellung. #sprecher:erzaehler
Acht Clubs. Acht Nadeln an deiner Jacke, und zu jeder gehört ein Gesicht. #sprecher:erzaehler #pause
Das kommt ins Tagebuch. Ich hab zwei dabei. Das kommt alles ins Tagebuch. #sprecher:juno #stimmung:froh
-> END

=== weg_ghost ===
Der Weg führt zurück zum Leuchtturm und weiter nach Ghost Town. #sprecher:erzaehler
-> END

// ---------------------------------------------------------------- Die Capital Arena (Szene 103)

=== halle_betreten ===
{arenaGesehen:
    Du gehst durch die Glastür in die Halle. #sprecher:erzaehler
    -> END
}
-> arena_ankunft

=== arena_ankunft ===
~ arenaGesehen = true
Drinnen ist es kühl und hallt. Tribünen im Kreis, Scheinwerfer, Tische in langen Reihen. An den Wänden laufen Partien, die niemand spielt. #sprecher:erzaehler #musik:aus
Sechzehn Punkte für Silber, zweiundzwanzig für Gold. Du hast … {ligapunkte()}. #sprecher:juno
{
- ligapunkte() >= 22:
    Gold-Liga. Und es ist mir vollkommen egal. #sprecher:juno #stimmung:froh
- ligapunkte() >= 16:
    Du spielst in der Silberliga. Und es ist mir vollkommen egal. #sprecher:juno #stimmung:froh
- else:
    Bronze-Liga. Du bist dabei, und alles andere ist mir vollkommen egal. #sprecher:juno #stimmung:froh
}
Am Tisch der Turnierleitung stehen Dr. Lin mit einer Mappe und ein Mädchen in einem zu großen Pullover. #sprecher:erzaehler
Nova dreht sich um. Sie sieht dich über die ganze Halle hinweg und nickt. Einmal. #sprecher:erzaehler #pause
~ gibFund("teilnehmerausweis")
* [Den Teilnehmerausweis anstecken]
- Heute ist Ruhe am Brett. Und heute spielt man ehrlich. Es ist lange her, dass ich das von einem Turnier sagen konnte. #sprecher:ambrose #stimmung:froh
* [„Warst du je auf so einem?“]
- Dreihundert Leute in einem Saal in New York. Ich fand es gewaltig. #sprecher:ambrose
Das hier sind dreitausend. Und kein Einziger raucht. #sprecher:ambrose #stimmung:lacht
-> END

// ---------------------------------------------------------------- Mama und Juno

=== mama ===
{
- finaleGespielt():
    Ich bin so stolz auf dich. Nicht wegen des Titels. Wegen allem. #sprecher:mutter #stimmung:froh
- arenaGesehen:
    Ich hab Kaffee für alle. Und Brötchen. Und ein Pflaster, falls du dich am Brett stößt. #sprecher:mutter
- else:
    Geh ruhig rein. Ich warte hier mit Juno auf die anderen. #sprecher:mutter
}
-> END

=== juno ===
{
- finaleGespielt():
    Ich hab alles ins Tagebuch geschrieben. Mit Glitzer. Diesmal ganz viel. #sprecher:juno #stimmung:froh
- else:
    {~Ich zähle deine Punkte. Laut. Damit es alle hören.|Slick hat mir ein Autogramm gegeben. Auf die Hand.|Wenn du gewinnst, hüpfe ich. Wenn nicht, hüpfe ich auch.} #sprecher:juno #stimmung:froh
}
-> END

// ---------------------------------------------------------------- Abschied (Szene 109)

=== treppe ===
{
- not finaleGespielt():
    Die breite Treppe vor der Arena. Am Abend wird hier gefeiert, sagt man. #sprecher:erzaehler
    -> END
- abschiedGesehen:
    Auf der Treppe vor der Arena ist es still geworden. Das Brett in deinem Rucksack ist warm. #sprecher:erzaehler
    -> END
}
-> abschied

=== abschied ===
~ abschiedGesehen = true
Nach der Siegerehrung sitzt du allein auf der Treppe. Das Sommerlicht ist lang und golden. #sprecher:erzaehler
Ich wollte eine Partie ohne Makel. Ich habe etwas Besseres bekommen. #sprecher:ambrose #stimmung:friedlich
Menschen, die kämpfen, Fehler machen und wachsen. Du hast mir das gezeigt. #sprecher:ambrose #stimmung:friedlich
* [„Danke.“]
    Nein. Ich danke dir, {held}. #sprecher:ambrose #stimmung:friedlich
* [„Ich werde dich vermissen.“]
    Und ich dich. Aber du wirst nicht allein spielen. Schau dich um. #sprecher:ambrose #stimmung:friedlich
* [„Später?“]
    Nein. Dieses eine Mal nicht später. #sprecher:ambrose #stimmung:lacht
- Das Brett wird still. Die Figuren stehen in der Schlussstellung der Fernpartie. #sprecher:erzaehler #pause
~ zeigeAbspann()
-> END

// ---------------------------------------------------------------- Ansehen (Runde 6)

=== fahnen ===
{angesehenFahnen:
    Die Fahnen knattern im Wind. Auf jeder ein König, schwarz auf weiß. #sprecher:erzaehler
    -> END
}
~ angesehenFahnen = true
Zwei Fahnen vor der Freitreppe, darauf ein König und die Jahreszahl der ersten Landesmeisterschaft. Der Mast ist frisch gestrichen. #sprecher:erzaehler
-> END

// ---------------------------------------------------------------- Der Wanderer (Buchseiten, 15, 1.2)
// Nach dem Finale schenkt er {held} das gedruckte Buch, wenn alle dreizehn Seiten zurück sind
// (wandererSeitenZurueck setzt weg-ghost-capital.ink).

=== wanderer ===
{
- buchGeschenkt:
    {~Der Verlag druckt eine zweite Auflage. Mit einem Dank an dich im Vorwort.|Wenn du nicht weiterweißt: Geh ein Stück. Unterwegs fällt einem das meiste ein.|Ich laufe jetzt nach Hause. Ohne Wind, hoffe ich.} #sprecher:wanderer
- finaleGespielt() and wandererSeitenZurueck >= 13:
    -> wanderer_buch
- wandererSeitenZurueck >= 13:
    Alle dreizehn Seiten sind beim Verlag. Spiel dein Finale, dann sehen wir uns hier. #sprecher:wanderer
- else:
    ~ wandererCapitalGetroffen = true
    Mein Verlag ist gleich um die Ecke. Aber ohne die fehlenden Seiten will ich da nicht hinein. #sprecher:wanderer
}
-> END

=== wanderer_buch ===
~ buchGeschenkt = true
Der Mann mit dem gelben Rucksack hält ein Buch in den Händen, noch nach Druckerschwärze riechend. #sprecher:erzaehler
Für dich. Dreizehn Seiten haben gefehlt, und jede hast du einmal in der Hand gehabt. #sprecher:wanderer
~ gibFund("buchVonGrundAuf")
Ein Buch für Anfänger. Die besten Bücher sind die, die man immer wieder aufschlägt. #sprecher:ambrose #stimmung:friedlich
-> END

