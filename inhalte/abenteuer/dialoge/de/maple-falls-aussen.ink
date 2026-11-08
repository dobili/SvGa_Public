// Ort: Hauptstraße von Maple Falls (Akt 1). Figuren: Juno, Lily.
//
// Szenen der Story-Bibel (docs/spiel/05_Story_Bibel.md, Abschnitt 4): 5 Erster Schultag, erster
// Teil (Juno an der Bushaltestelle, akt1.ersterSchultag), 8 Lilys Springer (Hilfe-Quest
// mapleFalls.lilysSpringer). Einstiege: „juno“ und „lily“; beide verzweigen nach dem Spielstand.
// springerLilyBestanden setzt die Hülle nach der Aufgabenrunde mapleFalls.springerLily (Vorschlag
// im Bericht mittel-1). Belohnungen stehen in quests.json.

EXTERNAL beginneAufgaben(runde)

VAR held = "Du"
VAR ausgangErsteLektion = ""
VAR junoGetroffen = false
VAR clubBeigetreten = false
VAR lilyGetroffen = false
VAR lilyGeholfen = false
VAR springerLilyBestanden = false
VAR nadelMapleFalls = 0

=== juno ===
{
- not junoGetroffen and ausgangErsteLektion != "": -> juno_trifft
- not junoGetroffen: -> juno_frueh
- not clubBeigetreten: -> juno_zum_club
- else: -> juno_alltag
}

=== juno_frueh ===
Ein Mädchen mit einem Heft voller Sticker winkt dir zu, aber ihr Bus kommt gerade. #sprecher:erzaehler
Morgen! Ich erklär dir morgen alles! #sprecher:juno #stimmung:froh
-> END

=== juno_trifft ===
~ junoGetroffen = true
Du bist das Kind aus dem Whitlock-Haus! Ich bin Juno. Ich wohne zwei Häuser weiter. #sprecher:juno #stimmung:froh
Alle reden über euch. #sprecher:juno
Mrs. Whitlock hatte siebzehn Katzen, sagt man. Es waren drei. #sprecher:juno
Sie sieht das Brett unter deinem Arm. #sprecher:erzaehler
* [„Ich hab es auf dem Dachboden gefunden.“]
    Ein echtes altes Schachbrett? Das ist ja wie im Film! #sprecher:juno
* [„Das ist nur ein altes Brett.“]
    Nur? Das ist ein Zeichen! #sprecher:juno
- Wir haben ein Schachteam. Coach Delgado sucht dringend ein viertes Brett für die Kreisliga. #sprecher:juno
Ich spiele auch. Schlecht. Aber mit Herz. #sprecher:juno
* [„Ich komme mit.“]
    Perfekt! Nach der Schule, Clubraum im ersten Stock. #sprecher:juno #stimmung:froh
* [„Ich kann kaum Schach.“]
    Ich auch nicht. Deshalb brauche ich jemanden zum Reden. #sprecher:juno
    Nach der Schule, Clubraum im ersten Stock. Keine Ausrede. #sprecher:juno
- Eine junge Dame mit Tagebuch und Glitzer. Sie wird dich überallhin schleppen. Gut so. #sprecher:ambrose
-> END

=== juno_zum_club ===
Clubraum, erster Stock! Coach Delgado beißt nicht. Meistens. #sprecher:juno
-> END

=== juno_alltag ===
{nadelMapleFalls > 0:
    {~Die Clubnadel steht schon im Tagebuch. Mit Glitzer, wie versprochen.|Samstag Cedar Creek! Ich packe Kekse ein. Für die Nerven.}  #sprecher:juno #stimmung:froh
- else:
    {~Ich hab meinen Turm verloren. Schon wieder. Er war so jung.|Das Clubtagebuch hat jetzt eine Seite für dich. Noch leer. Noch!|Sam gibt an, aber er meint es nicht so. Meistens.} #sprecher:juno
}
-> END

=== lily ===
{
- not lilyGetroffen: -> lily_fragt
- springerLilyBestanden and not lilyGeholfen: -> lily_danke
- lilyGeholfen: -> lily_alltag
- else: -> lily_wartet
}

=== lily_fragt ===
~ lilyGetroffen = true
Ein kleines Mädchen sitzt vor dem Nachbarhaus und starrt auf einen Springer aus Plastik. #sprecher:erzaehler
Du kannst Schach, oder? Mein Cousin sagt, ich bin zu doof für das Pferd. #sprecher:lily
Der Pferd hüpft doch einfach irgendwohin, oder? #sprecher:lily
* [„Ich zeig es dir.“]
    -> lily_lektion
* [„Gleich, ich hab noch was vor.“]
    Okay. Aber nicht vergessen! #sprecher:lily
    -> END

=== lily_wartet ===
Zeigst du mir jetzt das Pferd? Den Springer, meine ich. #sprecher:lily
* [„Los geht's.“]
    -> lily_lektion
* [„Noch nicht.“]
    Ich warte hier. Ich warte gut. #sprecher:lily
    -> END

=== lily_lektion ===
Lehre es ihr. Dann weißt du, ob du es kannst. Ich sage nichts. #sprecher:ambrose
Der Springer zieht zwei Felder geradeaus und eins zur Seite. Wie ein L. #sprecher:erzaehler
Und er darf über andere Figuren springen. Als Einziger. #sprecher:erzaehler
Zeig es mir an meinem Brett! #sprecher:lily #stimmung:froh
~ beginneAufgaben("mapleFalls.springerLily")
-> END

=== lily_danke ===
~ lilyGeholfen = true
Ein L! Immer ein L! Mein Cousin wird staunen. #sprecher:lily #stimmung:froh
Du hast es erklärt, ohne mich. Ich bin, nun ja, ein wenig stolz. Sag es niemandem. #sprecher:ambrose #stimmung:stolz
-> END

=== lily_alltag ===
{~Ich hab meinem Cousin eine Gabel gezeigt. Mit dem Springer! Er war sauer.|Der Springer ist mein Lieblingstier. Das ist er wirklich.} #sprecher:lily #stimmung:froh
-> END
