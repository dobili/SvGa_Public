// Ort: Heimatmuseum im alten Bahnhof von Ironwood (Akt 2). Figur: Mr. Teague. Gegenstände:
// Postsack (Quest ironwood.postsack, Runde ironwood.siegelStellung, Fund umschlag), Vitrine mit
// der Zeitung von 1858 (Quest ironwood.erinnerungBird, Runde ironwood.erinnerungBird), Fund
// „Funke aus Glas“.
// Szenen der Story-Bibel: 41 Der leere Umschlag (E4.3, Auflösung erst in Akt 3), 47 Erinnerung:
// Die Zeitung von 1858 (Zugerraten Bird gegen Morphy, mit Schwarz).
// Einstiege wie in orte.json: teague, postsack, vitrine, fund_glasfunke.
// Variablen: siegelStellungBestanden und erinnerungBirdBestanden setzt die Hülle (R42).

EXTERNAL beginneAufgaben(runde)
EXTERNAL gibFund(kennung)

VAR teagueGetroffen = false
VAR siegelStellungBestanden = false
VAR umschlagGeoeffnet = false
VAR erinnerungBirdBestanden = false
VAR glasfunkeGefunden = false
// Kapitel 26 (Roman): das Gespräch über den Mut nach der Erinnerung, einmal.
VAR birdNachgesprochen = false
VAR held = "Du"
VAR hankGetroffen = false

=== teague ===
{teagueGetroffen:
    {~Die Standuhr stelle ich jeden Tag. Sie geht jeden Tag nach.|Joe spielt immer das Damengambit. Seit vierzig Jahren. Sag ihm nicht, dass ich das verraten habe.|Ein Siegel bricht man nicht. Man löst es.} #sprecher:teague
    -> END
}
~ teagueGetroffen = true
// Kapitel 26 (Roman): Mr. Teague führt durch den Schalterraum, als wäre es ein Schloss.
Über der Tür ein handgemaltes Schild: „Heimatmuseum. Geöffnet, wenn Mr. Teague da ist.“ #sprecher:erzaehler #geraeusch:standuhr
Mr. Teague ist da. Achtzig, so dünn, dass die Weste um ihn herum steht. #sprecher:erzaehler
Fahrpläne von 1890. Die Lampe eines Streckenwärters. Und eine Standuhr, die ich jeden Tag stelle. #sprecher:teague
Sie geht jeden Tag nach. #sprecher:teague
Und das dort in der Ecke ist mein Kummer. #sprecher:teague
-> END

=== postsack ===
{
- umschlagGeoeffnet:
    Die Postsäcke liegen in der Ecke. Einer ist offen, Mr. Teague hat ihn sorgfältig wieder zugebunden. #sprecher:erzaehler
    -> END
- siegelStellungBestanden: -> postsack_offen
}
Säcke aus grauem Segeltuch, steif vom Alter, jeder mit einem Klumpen Wachs versiegelt. #sprecher:erzaehler
Post von achtzehnhundertsechsundsechzig. Die Strecke war drei Monate zu, und der Postmeister hatte das Fieber. #sprecher:teague
Dann kam ein neuer Postmeister, dann eine neue Bahn, dann kam ich. Niemand hat sie je geöffnet. #sprecher:teague
* [„Warum nicht?“]
- Weil man ein Siegel nicht bricht, mein Kind. Man löst es. #sprecher:teague
Ins Wachs sind kleine Figuren in einem Gitter gedrückt. #sprecher:erzaehler #bild:siegel_stellung
Der alte Postmeister war ein Schachnarr. Wer die Aufgabe löst, darf den Sack öffnen. Ich bin zu alt für Rätsel. #sprecher:teague
{hankGetroffen:
    Eine Fesselung. Hank hat sie dir gezeigt: „Gefesselt. Nicht bewegen. Wie ich nach der Nachtschicht.“ #sprecher:erzaehler
- else:
    Eine Fesselung. Eine Figur, die nicht wegkann, weil hinter ihr etwas Wertvolleres steht. #sprecher:erzaehler
}
* [Die Stellung lösen]
    ~ beginneAufgaben("ironwood.siegelStellung")
    -> END
* [Nicht jetzt]
    -> END

=== postsack_offen ===
// Klangplan S37: Beim Absender fällt auch das Ticken weg; mindestens fünf Sekunden Stille,
// nicht füllen. Danach Ambroses Thema auf dem Cello (`ambrose.cello`).
~ umschlagGeoeffnet = true
Mr. Teague bricht das Wachs mit dem Daumennagel. Es zerfällt zu Krümeln. #sprecher:erzaehler #klang:wachs
Briefe, gebündelt mit Schnur. Rechnungen. Eine Postkarte mit einem Dampfschiff. #sprecher:erzaehler
Zuunterst ein Umschlag aus dickem, gelblichem Papier. Die Schrift ist klein und senkrecht, wie mit dem Lineal gezogen. #sprecher:erzaehler #bild:umschlag_hale
„An Mr. A. Whitlock, Esq., New Orleans, Louisiana.“ #sprecher:erzaehler
In der Ecke, noch kleiner: „J. Hale.“ #sprecher:erzaehler #geraeusch:aus #musik:aus
Die Klappe ist offen. Der Umschlag ist leer. #sprecher:erzaehler
Sonderbar. Der Brief muss herausgefallen sein. Es gab damals eine Verordnung, bei Fieber … #sprecher:teague
Ambrose steht so still, wie du ihn noch nie gesehen hast. #sprecher:erzaehler #pause:5
Er hat mir geschrieben. #sprecher:ambrose #stimmung:still #musik:ambrose.cello
Nachdem ich … Achtzehnhundertsechsundsechzig. Im Winter. Da war ich schon unterwegs. #sprecher:ambrose #pause
Er hat geschrieben, und ich war schon unterwegs. #sprecher:ambrose
* [„Was stand drin?“]
- Ich weiß es nicht. #sprecher:ambrose
Er streckt die Hand nach dem Umschlag aus. Sie geht hindurch. #sprecher:erzaehler #bild:aus
Ich weiß es nicht, {held}. Ich habe hundertsechzig Jahre lang geglaubt, er habe geschwiegen. #sprecher:ambrose #stimmung:traurig
Mr. Teague sieht dich über die Brille an. #sprecher:erzaehler
Du kennst den Namen. #sprecher:teague
* [„Ein bisschen.“]
- Er nickt langsam. #sprecher:erzaehler
Nimm ihn mit. Ein leerer Umschlag gehört niemandem. Vielleicht findest du, was hineingehört. #sprecher:teague
~ gibFund("umschlag")
-> END

=== vitrine ===
{erinnerungBirdBestanden and not birdNachgesprochen: -> vitrine_mut}
// Die Hülle öffnet vitrine_mut nach der Runde von selbst (runden.json, danach), auch ohne Bestehen.
{erinnerungBirdBestanden:
    In der Vitrine liegt die Zeitung von 1858. Ambrose sieht sie nicht mehr an. #sprecher:erzaehler
    -> END
}
In der Vitrine liegt eine vergilbte Zeitung, aufgeschlagen bei einem kleinen gedruckten Schachbrett. #sprecher:erzaehler
Die habe ich gelesen. In der Nacht nach dem Match. Vier zu drei. #sprecher:ambrose #stimmung:alt
Ich wollte nie wieder eine Figur anrühren. Auf dem Tisch lag diese Zeitung, sechs Wochen alt, aus London. #sprecher:ambrose
Der junge Morphy gegen einen Mann namens Bird. Ich habe sie nachgespielt. Zwanzigmal. Bis es hell wurde. #sprecher:ambrose
* [„Zeig sie mir.“]
    ~ beginneAufgaben("ironwood.erinnerungBird")
    -> END
* [„Nicht jetzt.“]
    -> END

// Kapitel 26, Schluss: was Ambrose in dieser Nacht gelernt hat.
// Kapitel 26, Schluss: was Ambrose in dieser Nacht gelernt hat (Gutachten L1.10).
=== vitrine_mut ===
{birdNachgesprochen: -> END}
~ birdNachgesprochen = true
Ein Turm, zum Schlagen hingestellt, mitten ins Nichts. Dann die Dame, quer über das ganze Brett, in eine Ecke. Es dauert drei Züge, bis du siehst, warum. #sprecher:erzaehler
Er verlor nie den Mut. Das habe ich in dieser Nacht gelernt. Nicht, wie man opfert. Wie man am nächsten Morgen aufsteht. #sprecher:ambrose
{umschlagGeoeffnet: Er sieht auf den Umschlag in deiner Hand. #sprecher:erzaehler}
Ich schon. Ich habe den Mut verloren. Einen Abend lang. #sprecher:ambrose
* [„Nur einen?“]
- Er antwortet nicht gleich. #sprecher:erzaehler #pause
Nein. Wenn ich ehrlich bin. Länger. #sprecher:ambrose #stimmung:still
-> END

=== fund_glasfunke ===
{glasfunkeGefunden:
    Im Schaukasten liegen nur noch alte Fahrkarten. #sprecher:erzaehler
    -> END
}
~ glasfunkeGefunden = true
In einem Schaukasten funkelt ein kleiner Glassplitter, geschliffen wie ein Edelstein. #sprecher:erzaehler
Mr. Teague nickt: „Nimm ihn, er gehört niemandem.“ #sprecher:erzaehler
~ gibFund("glasfunke")
Hübsch. Aber in meinem Kaffeehaus hätte er nicht gebrannt. #sprecher:ambrose
-> END
