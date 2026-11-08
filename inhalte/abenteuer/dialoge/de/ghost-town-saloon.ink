// Ort: Saloon in Ghost Town (Akt 4): Schwingtür, staubiger Tisch mit dem Brett, das versteckte
// Postreiterabzeichen hinter dem Tresen (Story-Bibel 28 und 30).
//
// Szenen der Bibel (Abschnitt 29): der Auslöser des Flashbacks „Die letzte Kerze“ (Szene 99, das
// Abzeichen führt in erinnerung-siedlung.ink) und 100 Die Fernpartie (Hauptquest
// ghostTown.fernpartie, Begegnung ghostTown.fernpartie aus der Duell-Stellung von Abschnitt 35,
// Karten gesperrt). Einstiege wie in orte.json: victor, brett, fund_abzeichen.
//
// Variablen: ausgangGhostTownFernpartie und hatLaterne setzt die Hülle (R42); briefGelesen setzt
// desert-springs-antiquariat.ink, gefundenHalesSeite die Hülle beim Fund von Hales Seite (Szene 88,
// mittel-2), grabGesehen ghost-town-aussen.ink, kerzeGesehen erinnerung-siedlung.ink; die übrigen
// setzt diese Datei. Funde merkt sich Ink zusätzlich selbst.

EXTERNAL beginnePartie(begegnung)
EXTERNAL gibFund(kennung)

VAR grabGesehen = false
VAR kerzeGesehen = false
VAR briefGelesen = false
VAR gefundenHalesSeite = false
VAR hatLaterne = false
VAR abzeichenGefunden = false
VAR ausgangGhostTownFernpartie = ""
VAR fernpartieGespielt = false
VAR victorSaloonGetroffen = false

// ---------------------------------------------------------------- Victor und die Fernpartie

=== victor ===
{
- not grabGesehen:
    Victor sitzt am staubigen Tisch und wischt mit dem Ärmel über ein altes Brett. #sprecher:erzaehler
    Ich bin gerade angekommen. Mr. Pruitt sagt, am Friedhof liegt einer mit einem Schachbrett. #sprecher:victor
    -> END
- not kerzeGesehen: -> victor_wartet
- ausgangGhostTownFernpartie == "" or ausgangGhostTownFernpartie == "abgebrochen": -> victor_aufstellen
- not fernpartieGespielt: -> victor_nach_fernpartie
- else: -> victor_alltag
}

=== victor_wartet ===
~ victorSaloonGetroffen = true
Victor stellt Figuren auf, nimmt sie wieder weg, stellt sie neu auf. #sprecher:erzaehler
Mir fehlt noch etwas. Ambrose muss doch seinen letzten Zug irgendwo aufgeschrieben haben. #sprecher:victor
Hinter dem Tresen. Ich erinnere mich an einen Reiter mit einem Abzeichen. #sprecher:ambrose #stimmung:fern
-> END

=== victor_aufstellen ===
~ victorSaloonGetroffen = true
Ihr legt alles auf den Tisch: das Brett und die Fragmente aus allen Städten. #sprecher:erzaehler
{briefGelesen:
    Dazu Hales Brief aus dem Antiquariat: „Ich warte.“ #sprecher:erzaehler
}
{gefundenHalesSeite:
    Victor legt die Seite aus dem Notizbuch daneben. Darauf steht Hales Antwort: 40… b5. #sprecher:erzaehler
- else:
    Victor kennt Hales Antwort auswendig: 40… b5. Sein Großvater hat sie ihm oft vorgelesen. #sprecher:erzaehler
}
Zug um Zug entsteht die Stellung von 1866. Turm gegen zwei Springer, Weiß am Zug. #sprecher:erzaehler
Du spielst Ambroses Seite. Ich die meines Ur-ur-ur … von Josiah. #sprecher:victor
Diese Partie gehört den beiden. Keine Karten, keine Uhr. #sprecher:victor
Spiel du. Ich schaue zu. Das ist schöner, als ich dachte. #sprecher:ambrose #stimmung:friedlich
* [„Spielen wir sie zu Ende.“]
    ~ beginnePartie("ghostTown.fernpartie")
    -> END
* [„Gleich.“]
    Hundertsechzig Jahre. Ein paar Minuten mehr schaden nicht. #sprecher:victor
    -> END

=== victor_nach_fernpartie ===
~ fernpartieGespielt = true
{
- ausgangGhostTownFernpartie == "sieg":
    Victor legt seinen König um, ganz langsam. Dann lacht er. #sprecher:erzaehler
- ausgangGhostTownFernpartie == "remis":
    Remis. Ihr reicht euch über das alte Brett die Hand. #sprecher:erzaehler
- else:
    Victor hält deinen König fest. Dann stellt er ihn behutsam wieder auf. #sprecher:erzaehler
}
Hundertsechzig Jahre. Und sie ist schön. Nicht makellos. Schön. #sprecher:ambrose #stimmung:friedlich #pause
Victor legt die Seite zurück in sein Buch. „Für den Tag, an dem wieder jemand weiterspielt.“ #sprecher:erzaehler
Du lässt die Figuren stehen, wie sie jetzt stehen. #sprecher:erzaehler
~ gibFund("schlussstellungFernpartie")
-> END

=== victor_alltag ===
{~Mein Vater hat angerufen. Ich bin nicht rangegangen. Morgen vielleicht.|Ein Hale und ein Whitlock an einem Brett. Mein Großvater hätte das gern gesehen.|Bei der Meisterschaft spiele ich gegen dich. Ich freu mich. Ehrlich.} #sprecher:victor
-> END

// ---------------------------------------------------------------- Brett und Abzeichen

=== brett ===
{fernpartieGespielt:
    Auf dem Brett steht noch die Schlussstellung der Fernpartie. Niemand räumt sie weg. #sprecher:erzaehler
- else:
    Ein altes Brett auf einem staubigen Tisch. Eine Figur fehlt, ein Springer. #sprecher:erzaehler
}
-> END

=== fund_abzeichen ===
{
- abzeichenGefunden:
    Das Abzeichen glänzt in deiner Hand. Die Farben werden wieder braun. #sprecher:erzaehler
    -> END
- not grabGesehen:
    Hinter dem Tresen ist es dunkel und staubig. Hier liegt nur Gerümpel. #sprecher:erzaehler
    -> END
}
~ abzeichenGefunden = true
{hatLaterne:
    Du leuchtest mit der Laterne hinter den Tresen. Zwischen Flaschen liegt ein Abzeichen aus Messing. #sprecher:erzaehler
- else:
    Du tastest hinter dem Tresen im Halbdunkel. Zwischen Flaschen liegt ein Abzeichen aus Messing. #sprecher:erzaehler
}
Darauf ein Pferd und die Zahl 1866. #sprecher:erzaehler
~ gibFund("postreiterabzeichen")
Er hat meinen Brief getragen. #sprecher:ambrose #stimmung:fern #pause
Die Farben werden braun wie ein altes Foto. #sprecher:erzaehler
-> END
