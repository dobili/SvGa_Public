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
EXTERNAL reise(karte, ausloeser)

VAR abeGetroffen = false
VAR ausgangGhostTownFernpartie = ""
VAR finaleBesprochen = false
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
{not abeGetroffen:
    Der Mann am Turm hat ein Brett. Lass uns einen Augenblick bleiben. #sprecher:ambrose
    -> END
}
~ ankunftCapitalArenaGesehen = true
Am Abend fahrt ihr in die Hauptstadt und schlaft in einem Hotel, von dessen Fenster aus man die Arena sieht. #sprecher:erzaehler #pause:2
Am Morgen steht ihr davor. #sprecher:erzaehler
// Roman Kapitel 60: die Arena als weiße Muschel, die Busse aller Städte, alle auf der Treppe.
* [Hinsehen]
- Die Arena ist rund und weiß, mit einem Dach wie eine Muschel. Über dem Eingang hängt das Band mit acht Gesichtern. #sprecher:erzaehler #musik:arena
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
    Ich bin so stolz auf dich. {ausgangCapitalArenaFinale == "sieg":Nicht wegen des Titels. }Wegen allem. #sprecher:mutter #stimmung:froh
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
- not finaleBesprochen:
    Drinnen ruft jemand deinen Namen. Victor. #sprecher:erzaehler
    -> END
- abschiedGesehen:
    Auf der Treppe vor der Arena ist es still geworden. Die Fahnen werfen lange Schatten. #sprecher:erzaehler
    -> END
}
-> abschied

=== abschied ===
// Roman Kapitel 66: Ambrose sitzt zum fünften Mal auf einer Treppe. Alle drei Wahlen der Bibel
// kommen nacheinander. Danach Abspann und Reise auf den Dachboden (Epilog in
// maple-falls-dachboden.epilog). Klang: abschied.treppe, abschied, ambrose.nichtSpaeter.
~ abschiedGesehen = true
Der Abend ist lang und golden. Kinder aus acht Städten rennen zwischen den Fahnenmasten herum. Du setzt dich auf die Treppe, ganz oben. #sprecher:erzaehler #musik:abschied.treppe
Du legst das alte Brett auf die Stufe und stellst die Figuren von Junos Reisebrett darauf. Zwei Könige. Ein Springer. Die Schlussstellung. #sprecher:erzaehler
Er sitzt neben dir, die Hände auf den Knien. Durch ihn hindurch siehst du die Fahnen. #sprecher:erzaehler
* [„Hast du es gesehen?“]
- Jeden Zug. Ich habe an der Wand gestanden und mir auf die Zunge gebissen. Die Großmeisterin hat mich angesehen, als wüsste sie es. #sprecher:ambrose
Ich habe mir gewünscht, dass du ihn merkst. Dass du danach so spielst, habe ich nicht zu wünschen gewagt. #sprecher:ambrose
* [„War es richtig?“]
- Ich weiß es nicht. Ich habe es nicht nachgerechnet. Ich wollte nicht. #sprecher:ambrose #stimmung:lacht
Unten gehen Victor und sein Vater, das Formular zwischen sich, jeder hält eine Ecke. Graham Hale hat keinen Stift in der Hand. #sprecher:erzaehler
-> abschied_rede

=== abschied_rede ===
Ich muss dir etwas sagen. Hör zu, ich sage es nur einmal. #sprecher:ambrose
Ich wollte eine Partie ohne Makel. Ich habe sie nicht bekommen. #sprecher:ambrose
{ausgangGhostTownFernpartie == "remis":Die Fernpartie ist remis, mit einem Fehler darin.|Die Fernpartie hatte einen Fehler darin.} Das Halbfinale war bis zum zwanzigsten Zug ein Untergang. #sprecher:ambrose
* [„Tut mir leid.“]
- Sei still. Ich bin noch nicht fertig. Ich habe etwas Besseres bekommen. #sprecher:ambrose #stimmung:froh #musik:abschied
* [Zuhören]
- Eine Lehrerin, die gekündigt hat. Ein Mädchen, das zwei Titel zurückgibt. {ausgangCapitalArenaFinale == "sieg":Einen Jungen, der vor Freude rennt, weil er verloren hat.|Einen Jungen, der mit einem Blatt Papier zu seinem Vater rennt.} #sprecher:ambrose
Menschen, die kämpfen. Die Fehler machen. Und wachsen. #sprecher:ambrose #pause:2
Das ist es, was schön ist an diesem Spiel. Nicht die Züge. Die waren nie das Schöne. #sprecher:ambrose
Du hast mir das gezeigt. Ein Kind, das einen König hält wie einen Suppenlöffel. #sprecher:ambrose #stimmung:lacht
* [„Danke.“]
- Wofür? #sprecher:ambrose
* [„Für Was hängt? Für den Turm heute.“]
- Das war das Geringste. Das weiß jeder. #sprecher:ambrose #stimmung:lacht
-> abschied_verbeugung

=== abschied_verbeugung ===
Die Sonne steht tief. Er ist jetzt so durchsichtig, dass du nicht mehr sicher bist, ob du ihn siehst. #sprecher:erzaehler
* [„Ich werde dich vermissen.“]
- Das hoffe ich doch. Ich war hundertsechzig Jahre lang eine Fußnote. Ich möchte wenigstens einem Menschen fehlen. #sprecher:ambrose
Und ich dich. Wo immer man das tut, wohin ich gehe. #sprecher:ambrose
Er steht auf und macht eine kleine, steife Verbeugung. Wie am ersten Tag. #sprecher:erzaehler
Ambrose Whitlock, zu Diensten. Es war mir eine Ehre, {held}. #sprecher:ambrose
* [„Später?“]
- Er sieht dich an. #sprecher:erzaehler #musik:aus #pause:2
Dann lacht er, laut, von ganz unten. Das Lachen vom Steg und aus der Garage. #sprecher:erzaehler
Nein. Dieses eine Mal nicht später. #sprecher:ambrose #stimmung:lacht #musik:ambrose.nichtSpaeter
-> abschied_ende

=== abschied_ende ===
Das Licht verändert sich, wie wenn eine Wolke weiterzieht. Du stehst allein auf der Treppe. #sprecher:erzaehler #pause:3
Auf der Stufe liegt ein Brett aus altem Holz. Zwei Könige. Ein Springer. Am Rand eingebrannte Buchstaben. Das Holz ist warm von der Sonne. #sprecher:erzaehler
Jemand setzt sich neben dich. Juno, mit zwei Tagebüchern auf dem Schoß. Das obere ist aufgeschlagen, bei der Seite mit dem Glitzerrahmen. #sprecher:erzaehler
Sie hält dir den Stift hin. Du überlegst lange. Dann schreibst du, in deiner eigenen Schrift: Er ist angekommen. #sprecher:erzaehler #pause:2
~ zeigeAbspann()
~ reise("mapleFalls.dachboden", "treppe")
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
// Nach dem Finale schenkt er {held} die gebundene Sammlung alter Schachblätter („Sammlung des
// Wanderers“, Dokument 15, Teil J), wenn alle dreizehn Blätter zurück sind
// (wandererSeitenZurueck setzt weg-ghost-capital.ink).

=== wanderer ===
{
- buchGeschenkt:
    {~Ich sammle weiter. Der Wind hilft mir dabei, ob ich will oder nicht.|Wenn du nicht weiterweißt: Geh ein Stück. Unterwegs fällt einem das meiste ein.|Ich laufe jetzt nach Hause. Ohne Wind, hoffe ich.} #sprecher:wanderer
- finaleGespielt() and wandererSeitenZurueck >= 13:
    -> wanderer_buch
- wandererSeitenZurueck >= 13:
    Alle dreizehn Blätter sind beim Buchbinder. Spiel dein Finale, dann sehen wir uns hier. #sprecher:wanderer
- else:
    ~ wandererCapitalGetroffen = true
    Der Buchbinder ist gleich um die Ecke. Aber ohne die fehlenden Blätter will ich da nicht hinein. #sprecher:wanderer
}
-> END

=== wanderer_buch ===
~ buchGeschenkt = true
Der Mann mit dem gelben Rucksack hält einen Packen alter Blätter in den Händen, frisch gebunden, in einem Leinendeckel. #sprecher:erzaehler
Für dich. Dreizehn Blätter haben gefehlt, und jedes hast du einmal in der Hand gehabt. #sprecher:wanderer
~ gibFund("buchVonGrundAuf")
Stellungen, die jemand aufgehoben hat. Das kenne ich. #sprecher:ambrose #stimmung:froh
-> END

