// Ort: Drechslerei von Mr. Dunmore in Cedar Creek (Akt 1, Karte cedarCreek.drechslerei).
//
// Runde 11 (Roman zu Akt 1, Dokument 20, Ortsblatt Cedar Creek): kleine Geschichte von Mr. Dunmore,
// der für den Club einen Figurensatz dreht und am Springer scheitert. Sie hat mit dem Ort zu tun,
// nicht mit {held}; der Spieler muss sie nicht sehen, um weiterzukommen (Dokument 19, Abschnitt 6).
// Stufen wie auf dem Weg: A bis zur Nadel von Cedar Creek, B danach bis zur Nadel von Riverton,
// C in Akt 2 (nadelRiverton > 0), D nach Akt 2 (nadelIronwood > 0). In Stufe D dreht er einen
// zweiten Satz „für jemanden weiter flussab“ (Slick, Dokument 19, 5.4).
//
// Mr. Dunmore spricht mit der Kennung „dunmore“ (Name in texte/de.json, noch ohne Porträt und
// ohne Figur in orte.json). Auslöser für die Karte (fehlt noch): dunmore (Figur an der
// Drechselbank) → cedar-creek-drechslerei.dunmore. Für jede Stufe braucht die Karte ein Ding
// (Satz ohne Springer, drei missratene Springer auf der Fensterbank, zweiter Satz).

VAR nadelCedarCreek = 0
VAR nadelRiverton = 0
VAR nadelIronwood = 0

=== dunmore ===
{
- nadelIronwood > 0: -> dunmore_d
- nadelRiverton > 0: -> dunmore_c
- nadelCedarCreek > 0: -> dunmore_b
- else: -> dunmore_a
}

=== dunmore_a ===
Späne auf dem Boden, Harz in der Luft. Ein Mann mit Schürze dreht ein Stück Ahorn auf der Drechselbank. #sprecher:erzaehler
Auf dem Regal steht ein Figurensatz aus hellem und dunklem Holz. Ein Springer fehlt. #sprecher:erzaehler
Für den Club. Alles fertig bis auf das Pferd. Die Mähne will nicht. #sprecher:dunmore #stimmung:nachdenklich
* [„Darf ich zusehen?“]
    Zusehen ist frei. Reden kostet einen Span. #sprecher:dunmore #stimmung:laechelt
* [„Warum ist der Springer so schwer?“]
    Alles andere ist rund. Das Pferd hat einen Kopf. Köpfe sind schwer. #sprecher:dunmore #stimmung:laechelt
- Ein Handwerker, der an einem Springer verzweifelt. Willkommen im Schach, Sir. #sprecher:ambrose #stimmung:lacht
-> END

=== dunmore_b ===
Auf der Fensterbank liegen drei Springer. Einer hat zu kurze Ohren, einer schielt, einer sieht aus wie ein Hund. #sprecher:erzaehler
Er legt einen vierten Holzklotz auf die Bank. #sprecher:erzaehler
Das Pferd will nicht. Noch nicht. #sprecher:dunmore #stimmung:nachdenklich
-> END

=== dunmore_c ===
Der Springer ist fertig. Er ist ein wenig schief und sieht sehr stolz aus. #sprecher:erzaehler
Steht drüben im Club, auf dem langen Tisch. Mrs. Okafor sagt, er schaut immer zur falschen Seite. #sprecher:dunmore #stimmung:laechelt
Ich sage: Er schaut dahin, wo er hinwill. #sprecher:dunmore #stimmung:laechelt
Ein Springer mit eigenem Kopf. Das sind die besten. #sprecher:ambrose #stimmung:laechelt
-> END

=== dunmore_d ===
Auf der Werkbank steht ein zweiter Satz, halb fertig. Die Springer sind diesmal zuerst gemacht. #sprecher:erzaehler
Für jemanden weiter flussab. Einer, dem sie den Pavillon genommen haben. Er spielt jetzt unter einer Brücke. #sprecher:dunmore #stimmung:nachdenklich
Dach hat er, sagt er. Wände nicht. Figuren braucht er trotzdem. #sprecher:dunmore #stimmung:nachdenklich
-> END
