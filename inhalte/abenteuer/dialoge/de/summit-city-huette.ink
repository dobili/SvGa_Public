// Ort: Hütte der Großmeisterin in Summit City (Akt 4, Club 8 „Endspielrunde in der Berghütte“):
// Kaminfeuer, Bücherregal, Endspieldiagramme an der Wand. Figuren: Ward (Clubchefin), Kit und
// Haraldsen (Story-Bibel 27.2, Weltbeschreibung 5.10).
//
// Szenen der Bibel (Abschnitt 29): 84 Lektion Opposition (Buch Kapitel 8, Opposition und
// Schlüsselfelder), 85 Wards Erinnerung Hastings 1895 (Runde summitCity.erinnerungHastings,
// Quest gleichen Namens, Fragment 8), 86 Aufgabenreihen (Runden summitCity.reiheKit und
// summitCity.reiheHaraldsen), 87 Victor verliert (Buch Kapitel 12, Abschnitt 12.6, Kopf und
// Konzentration), 91 Clubkampf (Begegnung summitCity.clubkampf, Karten erlaubt).
// Einstiege wie in orte.json: ward, kit, haraldsen, pokal, kaminfeuer.
//
// Reihenfolge der Hauptquest summitCity.endspiel: Lektion, Kit, Haraldsen, Victors Niederlage,
// Bergstation (summit-city-bergstation.ink), Clubkampf. Variablen: reiheKitBestanden,
// reiheHaraldsenBestanden, erinnerungHastingsBestanden, ausgangSummitCityClubkampf und
// nadelSummitCity setzt die Hülle (R42); victorSeiteGegeben setzt summit-city-bergstation.ink;
// die übrigen setzt diese Datei.

EXTERNAL beginnePartie(begegnung)
EXTERNAL beginneAufgaben(runde)

VAR held = "Du"
VAR wardLektionGesehen = false
VAR reiheKitBestanden = false
VAR reiheHaraldsenBestanden = false
VAR erinnerungHastingsBestanden = false
VAR erinnerungHastingsBesprochen = false
VAR victorKriseGesehen = false
VAR victorSeiteGegeben = false
VAR ausgangSummitCityClubkampf = ""
VAR nadelSummitCity = 0
VAR clubkampfSummitCityNadel = 0
VAR kitGetroffen = false
VAR haraldsenGetroffen = false

// ---------------------------------------------------------------- Ward

=== ward ===
{
- not wardLektionGesehen: -> ward_lektion
- nadelSummitCity > clubkampfSummitCityNadel: -> ward_nach_sieg
- erinnerungHastingsBestanden and not erinnerungHastingsBesprochen: -> ward_nach_erinnerung
- not (reiheKitBestanden and reiheHaraldsenBestanden): -> ward_reihe_offen
- not victorKriseGesehen: -> victor_krise
- not victorSeiteGegeben: -> ward_victor_fort
- nadelSummitCity == 0 and ausgangSummitCityClubkampf == "niederlage": -> ward_nach_niederlage
- nadelSummitCity == 0: -> ward_clubkampf
- else: -> ward_alltag
}

=== ward_lektion ===
~ wardLektionGesehen = true
In der Hütte knistert ein Kaminfeuer. Eine Frau mit grauem Zopf sitzt an einem alten Holzbrett und sieht nicht auf. #sprecher:erzaehler
Tür zu. Die Wärme ist teuer hier oben. #sprecher:ward
Eleanor Ward. Setz dich. Ich zeige dir etwas, bevor wir reden. #sprecher:ward
Sie stellt drei Figuren auf: zwei Könige und einen weißen Bauern. #sprecher:erzaehler
König und Bauer gegen König. Die Könige stehen sich gegenüber, ein Feld dazwischen. Wer zuerst zieht, verliert. Warum? #sprecher:ward
+ [„Weil der König ausweichen muss.“]
    Genau. Der andere König geht vor, auf das Feld, das frei wird. #sprecher:ward
+ [„Ich weiß es nicht.“]
    Ehrlich. Gut. Der König, der ziehen muss, muss ausweichen. Und der andere geht vor. #sprecher:ward
- Das heißt Opposition. Wer sie hat, bestimmt, wohin der andere König darf. #sprecher:ward
Opposition. Der König, der zuerst zieht, verliert. Wie im Leben, manchmal. #sprecher:ward
Ambrose lehnt sich vor, so weit ein Geist sich vorlehnen kann. #sprecher:erzaehler
Sie spielt, wie ich mit fünfzig gespielt hätte. Wenn ich fünfzig geworden wäre. #sprecher:ambrose #stimmung:friedlich
Erst Kit, dann Haraldsen. Bauern, dann Türme. Dann sehen wir weiter. #sprecher:ward
-> END

=== ward_reihe_offen ===
{not reiheKitBestanden:
    Kit zuerst. Bauernendspiele. Wer die nicht kann, braucht keine Türme. #sprecher:ward
- else:
    Jetzt Haraldsen. Er erklärt Türme, als wären es Seilbahnen. Hör trotzdem zu. #sprecher:ward
}
+ {not erinnerungHastingsBestanden} [„Wie haben Sie Schach lieben gelernt?“]
    -> ward_erinnerung
+ [„Bis später.“]
    -> END

=== ward_victor_fort ===
Er ist zur Seilbahn. Ich laufe keinem nach, der wegläuft. Du vielleicht schon. #sprecher:ward
Ohne ihn spielen wir nicht. Ich will, dass er zusieht. #sprecher:ward
-> END

=== ward_clubkampf ===
Bauern, Türme, Opposition. Jetzt zeig mir, ob du sie auch in einer ganzen Partie findest. #sprecher:ward
In der Ecke sitzt Victor, die Hände in den Taschen. Kein Gerät. Er wartet. #sprecher:erzaehler
Sie tauscht gern und früh. Wer ins Endspiel will, kommt zu ihr nach Hause. Aber du entscheidest. #sprecher:ambrose
+ [„Spielen wir.“]
    ~ beginnePartie("summitCity.clubkampf")
    -> END
+ [„Noch nicht.“]
    Das Feuer brennt noch eine Weile. #sprecher:ward
    -> END

=== ward_nach_niederlage ===
Verloren. Und? Hast du gesehen, wo? #sprecher:ward
Noch einmal, wenn du es weißt. Nicht vorher. #sprecher:ward
+ [„Ich weiß es.“]
    ~ beginnePartie("summitCity.clubkampf")
    -> END
+ [„Später.“]
    -> END

=== ward_nach_sieg ===
~ clubkampfSummitCityNadel = nadelSummitCity
{ausgangSummitCityClubkampf == "remis":
    Remis. Ich habe bis zum letzten Bauern gespielt, und du auch. Das ist mehr wert, als du denkst. #sprecher:ward
- else:
    Du hast mich besiegt. Gut. #sprecher:ward #pause
    Jetzt zeig mir, wie. #sprecher:ward
}
Victor klatscht. Leise, aber er klatscht. #sprecher:erzaehler
Die achte Nadel. Juno wird ein neues Blatt brauchen. #sprecher:ambrose #stimmung:froh
Ward nickt Ambroses Brett zu, als könne sie ihn sehen. Vielleicht kann sie es. #sprecher:erzaehler
Für die Meisterschaft: Spiel jede Stellung zu Ende. Auch die, die du für verloren hältst. #sprecher:ward
-> END

=== ward_alltag ===
{~Ein Endspiel ist eine Wahrheit. Man kann sie nicht wegreden.|Tee? Die Kanne hat einen Sprung. Sie hält trotzdem seit vierzig Jahren.|Ich habe einmal sieben Stunden um einen halben Punkt gespielt. Es hat sich gelohnt.} #sprecher:ward
+ {not erinnerungHastingsBestanden} [„Wie haben Sie Schach lieben gelernt?“]
    -> ward_erinnerung
+ {nadelSummitCity > 0 and nadelSummitCity < 3} [„Revanche um eine bessere Nadel?“]
    Gern. Aber diesmal bis zum letzten Bauern. #sprecher:ward
    ~ beginnePartie("summitCity.clubkampf")
    -> END
+ [„Bis später.“]
    -> END

// ---------------------------------------------------------------- Erinnerung Hastings 1895 (Szene 85)

=== ward_erinnerung ===
Ward nimmt ein zerlesenes Heft aus dem Regal. Die Seiten sind braun. #sprecher:erzaehler
Mein Vater hat mir diese Partie gezeigt, da war ich neun. Hastings, 1895. Steinitz gegen von Bardeleben. #sprecher:ward
Von Bardeleben stand am Ende auf und ging. Er hat nicht aufgegeben. Er ist einfach gegangen. #sprecher:ward
Spiel du die weißen Züge ab dem siebzehnten. Rate, was Steinitz gezogen hat. #sprecher:ward
Neunundzwanzig Jahre nach mir. #sprecher:ambrose #pause
+ [Die Partie spielen]
    ~ beginneAufgaben("summitCity.erinnerungHastings")
    -> END
+ [„Ein andermal.“]
    Das Heft wartet seit fünfzig Jahren. Es wartet auch noch eine Woche. #sprecher:ward
    -> END

=== ward_nach_erinnerung ===
~ erinnerungHastingsBesprochen = true
Ward klappt das Heft zu. #sprecher:erzaehler
Du hast es gesehen, oder? Wie alles plötzlich aufgeht. Deshalb spiele ich noch. #sprecher:ward
Neunundzwanzig Jahre nach mir. Und sie spielen noch schöner. Das tröstet mich. #sprecher:ambrose #stimmung:friedlich
Zwischen den Seiten steckt ein Zettel in fremder Schrift. Züge aus einer alten Fernpartie, vier Paare. Ward weiß nicht, woher er kommt. #sprecher:erzaehler
Das ist meine Partie gegen Hale. #sprecher:ambrose #pause
-> END

// ---------------------------------------------------------------- Victor verliert (Szene 87)

=== victor_krise ===
~ victorKriseGesehen = true
Die Tür geht auf. Victor kommt herein, ohne zu klopfen, und setzt sich Ward gegenüber. #sprecher:erzaehler
Ich soll gegen Sie spielen. Zur Vorbereitung. Mein Vater hat angerufen. #sprecher:victor
Ward stellt die Figuren auf, ohne ein Wort. Sie spielen. #sprecher:erzaehler
Nach jedem Zug brummt etwas in Victors Tasche. Er sieht nicht aufs Brett, er wartet auf das Brummen. #sprecher:erzaehler
Nach zwei Stunden steht ein Turmendspiel auf dem Brett. Victor hat einen Bauern mehr. Dann brummt es zweimal, und er zieht den König in die falsche Richtung. #sprecher:erzaehler
Drei Züge später gibt er auf. #sprecher:erzaehler
Sein Telefon klingelt. Er nimmt ab, ohne etwas zu sagen. #sprecher:erzaehler
Victor? Was sagt die Bewertung? Bist du dem Coach gefolgt? #sprecher:grahamHale
Victor legt auf. Er zieht ein kleines schwarzes Gerät aus der Tasche, wirft es auf den Tisch und läuft hinaus. #sprecher:erzaehler
Er spielt, als wäre er nicht da. #sprecher:ward
Kopf und Ruhe, {held}. Wer einer Maschine in der Tasche glaubt, sieht das Brett nicht mehr. #sprecher:ambrose #stimmung:still
Geh ihm nach. Ich glaube, er braucht jetzt keinen Erwachsenen. #sprecher:ambrose
-> END

// ---------------------------------------------------------------- Kit

=== kit ===
{
- not wardLektionGesehen:
    Erst zu Ward. Sie mag es nicht, wenn man an ihr vorbeiläuft. #sprecher:kit
    -> END
- not reiheKitBestanden: -> kit_reihe
- else: -> kit_alltag
}

=== kit_reihe ===
{not kitGetroffen:
    ~ kitGetroffen = true
    Am Fenster sitzt ein Mädchen in Wanderschuhen und zählt Felder mit dem Finger. #sprecher:erzaehler
    Kit. Mein Vater ist Bergführer, ich bin Wards Schülerin. #sprecher:kit
}
Der Bauer läuft, der König rennt. Wer ist schneller? Zähl die Felder. #sprecher:kit
Quadrat, Opposition, ein Tempo in Reserve. Meine Aufgaben sind klein. Aber gemein. #sprecher:kit
+ [„Zeig her.“]
    ~ beginneAufgaben("summitCity.reiheKit")
    -> END
+ [„Später.“]
    Der Bauer wartet. Er ist geduldig. Ich nicht. #sprecher:kit
    -> END

=== kit_alltag ===
{~Im Winter zählen wir Felder, im Sommer Höhenmeter. Ist dasselbe.|Ward sagt, ich soll weniger rennen. Am Brett und am Berg.|Hast du die Murmeltiere an der Bergstation gesehen? Die pfeifen, wenn du pfeifst.} #sprecher:kit
-> END

// ---------------------------------------------------------------- Haraldsen

=== haraldsen ===
{
- not wardLektionGesehen:
    Erst zu Ward, junger Mensch. Dann zu mir. #sprecher:haraldsen
    -> END
- not reiheKitBestanden:
    Erst Kit. Bauern vor Türmen, das ist die Reihenfolge. Auch am Berg. #sprecher:haraldsen
    -> END
- not reiheHaraldsenBestanden: -> haraldsen_reihe
- else: -> haraldsen_alltag
}

=== haraldsen_reihe ===
{not haraldsenGetroffen:
    ~ haraldsenGetroffen = true
    Ein alter Mann in Seilbahnuniform sitzt am Kamin und poliert eine Turmfigur. #sprecher:erzaehler
    Haraldsen. Ich fahre die Seilbahn, seit sie gebaut wurde. Und ich spiele Turmendspiele, seit ich denken kann. #sprecher:haraldsen
}
Ein Turm hinter dem Freibauern. Wie ein Seil hinter der Gondel. #sprecher:haraldsen
Philidor, Lucena. Klingen wie Gipfel. Sind auch welche. #sprecher:haraldsen
+ [„Ich bin bereit.“]
    ~ beginneAufgaben("summitCity.reiheHaraldsen")
    -> END
+ [„Später.“]
    Die nächste Gondel kommt in zehn Minuten. Ich auch. #sprecher:haraldsen
    -> END

=== haraldsen_alltag ===
{~Turmendspiele sind immer remis, sagt man. Man sagt viel.|Im Bergladen habe ich Seilbahnkarten. Und Karten für das Brett.|Die Gondel ist einmal stehen geblieben, eine Nacht lang. Wir haben Blindschach gespielt.} #sprecher:haraldsen
-> END

// ---------------------------------------------------------------- Gegenstände

=== pokal ===
Auf dem Regal steht ein Pokal: „Landesmeisterin 1985 – E. Ward“. Daneben ein Foto vom Gipfel. #sprecher:erzaehler
{wardLektionGesehen:
    Damals hatte ich noch keine grauen Haare. Nur einen Turm mehr. #sprecher:ward
}
-> END

=== kaminfeuer ===
{~Das Feuer knackt. Daneben stapelt sich Holz bis unter die Decke.|Über dem Kamin hängt ein Diagramm: König und Bauer gegen König. Darunter steht „Opposition!“.|Eine Teekanne mit Sprung steht warm auf dem Kaminsims.} #sprecher:erzaehler
-> END

// >>> Runde 6 (mittel-4)
=== foto ===
In der Vitrine steht ein altes Foto: eine Mannschaft vor dieser Hütte, die Spieler mit Wollmützen und einem Pokal in der Mitte. #sprecher:erzaehler
-> END

=== teekanne ===
Auf dem runden Tisch steht eine Teekanne, noch warm. Daneben ein Brett, auf dem eine Partie wartet. #sprecher:erzaehler
-> END
// <<< Runde 6 (mittel-4)
