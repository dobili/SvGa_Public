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
VAR fernpartieEndspielGesagt = false
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
Die Hütte ist aus dunklem Holz. Im Kamin brennt auch im Juli Feuer. An den Wänden hängt nichts außer einem Thermometer. #sprecher:erzaehler
Eleanor Ward sitzt im Sessel am Feuer und liest den Absatz zu Ende. Dann legt sie ein Lesezeichen ein. #sprecher:erzaehler
Sie betrachtet dich, wie man eine Stellung betrachtet. Sieben. Wie hast du Big Joe geschlagen? #sprecher:ward
* [„Grundreihe. Ein Springeropfer, damit der Turm hinunterkommt.“]
- Und die kleine Castillo? #sprecher:ward
* [„Ein Läufer, der nicht ging. Dann vierzig Züge Endspiel.“]
- Vierzig Züge. Dann hast du schon einmal gesehen, wie es aussieht. Setz dich. #sprecher:ward
Auf dem Brett stehen drei Figuren. Ein weißer König, ein weißer Bauer, ein schwarzer König. Sonst nichts. #sprecher:erzaehler #musik:aus #geraeusch:aus
* [„Das ist alles?“]
- Das ist alles, was übrig bleibt, wenn man lange genug spielt. #sprecher:ward
Die Könige stehen sich gegenüber, ein Feld dazwischen. Wer am Zug ist, verliert. Warum? #sprecher:ward
* [„Weil er weichen muss. Dann kommt der andere vorbei.“]
* [„Ich weiß es nicht.“]
    Ehrlich. Gut. Wer ziehen muss, muss zur Seite. Und dann kommt der andere vorbei. #sprecher:ward
- Opposition. Der zuerst zieht, gibt nach. Wie im Leben, manchmal. #sprecher:ward
Ein Endspiel ist eine Wahrheit. In der Eröffnung kann man schwindeln, im Mittelspiel blenden. Hier nicht. #sprecher:ward
Sie spielt, wie ich mit fünfzig gespielt hätte. Wenn ich fünfzig geworden wäre. #sprecher:ambrose #stimmung:still
Erst Kit, dann Haraldsen. Bauern, dann Türme. Dann sehen wir weiter. #sprecher:ward #musik:karte
-> END

=== ward_reihe_offen ===
{reiheKitBestanden and not fernpartieEndspielGesagt: -> abend_fernpartie}
{not reiheKitBestanden:
    Kit zuerst. Bauernendspiele. Wer die nicht kann, braucht keine Türme. #sprecher:ward
- else:
    Jetzt Haraldsen. Er erklärt Türme, als wären es Seilbahnen. Hör trotzdem zu. #sprecher:ward
}
+ {not erinnerungHastingsBestanden} [„Wie haben Sie Schach lieben gelernt?“]
    -> ward_erinnerung
+ [„Bis morgen.“]
    -> END

// Kapitel 48, dritter Abend auf dem Weg hinunter: Die Fernpartie ist auch ein Endspiel.
=== abend_fernpartie ===
~ fernpartieEndspielGesagt = true
Auf dem Weg hinunter gehen in der Stadt die Lichter an. #sprecher:erzaehler
* [„Die Fernpartie. Das ist auch ein Endspiel.“]
- Ein Turm gegen zwei Springer. Und Bauern. Ich habe hundertsechzig Jahre darauf gestarrt. #sprecher:ambrose
* [„Kannst du es gewinnen?“]
- Er antwortet nicht gleich. #sprecher:erzaehler #pause:2
Ich weiß es nicht. Ich konnte Angriffe. Ich konnte Opfer. Das hier konnte ich nie. #sprecher:ambrose
Deshalb lernst du es. Nicht ich. #sprecher:ambrose #stimmung:still
-> END

=== ward_victor_fort ===
Er ist den Pfad hinauf. Ich bin vierundsechzig. Ich renne keinem mehr nach. Du vielleicht schon. #sprecher:ward
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
+ [„Nicht jetzt.“]
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
// Kapitel 49: Am vierten Abend lässt Ward den Helden nicht gehen. Erst Laurie, dann Hastings.
Bleib. Unten ist heute das Drachenfest. Die halbe Stadt spielt mit einer Figur, die es nicht gibt. #sprecher:ward
Big Joe hat mich angerufen. Da komme ein Kind, das zählt, bevor es schlägt, und trotzdem opfert. Das Kind sei von Laurie. #sprecher:ward
Ich habe sie in neunzehn Zügen geschlagen. Sie war die Beste, die ich in dem Jahr gesehen hatte. Ich habe es ihr nicht gesagt. #sprecher:ward
* [„Sie ist unten. In der Stadt.“]
- Ich weiß. Sie steckt die Hände noch immer in die Ärmel. Ich werde es ihr sagen, bevor ihr fahrt. #sprecher:ward
Es ist dreißig Jahre zu spät. Aber man macht manche Züge trotzdem noch. #sprecher:ward
Sie holt ein dünnes Heft aus dem Regal, mit einem Umschlag aus Packpapier. #sprecher:erzaehler #musik:hastings
Hastings, 1895. Ein alter Mann namens Steinitz. Er war Weltmeister gewesen, und alle sagten, er sei fertig. Rate. Du hast Weiß. #sprecher:ward
+ [Die Partie spielen]
    ~ beginneAufgaben("summitCity.erinnerungHastings")
    -> END
+ [„Ein andermal.“]
    Das Heft wartet seit fünfzig Jahren. Es wartet auch noch eine Woche. #sprecher:ward
    -> END

=== ward_nach_erinnerung ===
~ erinnerungHastingsBesprochen = true
Ein Turm, der hängt und hängt und nicht geschlagen werden darf, weil dahinter jedes Mal etwas Schlimmeres wartet. #sprecher:erzaehler
* [„Das ist kein Endspiel.“]
- Nein. Das ist ein Angriff, wie ihn sich ein Endspieler ausdenkt. Er war neunundfünfzig. #sprecher:ward
Zum ersten Mal lächelt sie. Es macht sie zwanzig Jahre jünger. #sprecher:erzaehler
Achtzehnhundertfünfundneunzig. Neunundzwanzig Jahre nach mir. #sprecher:ambrose
Ich dachte, danach hätten sie nur noch gerechnet. Brückenbauer, überall. Und sie spielen noch schöner. Schöner als wir. #sprecher:ambrose
* [„Macht dich das traurig?“]
- Es tröstet mich. Ich habe geglaubt, ich hätte etwas verpasst. Dabei habe ich nur den Anfang gesehen. #sprecher:ambrose #stimmung:froh
Die meisten Leute reden mit sich selbst, wenn sie Schach lernen. Du hörst dabei zu. Das ist ungewöhnlich. Ich frage nicht. #sprecher:ward
Zwischen den Seiten steckt ein Zettel in fremder Schrift. Züge aus einer alten Fernpartie, vier Paare. Ward weiß nicht, woher er kommt. #sprecher:erzaehler
Das ist meine Partie gegen Hale. #sprecher:ambrose #pause
* [Hinaussehen]
- Unten im Tal steigt ein Feuerwerk auf, grün, in der Form von etwas mit Flügeln. #sprecher:erzaehler
Ein Drache auf dem Brett. Dame und Springer in einer Figur. Zu meiner Zeit hätte man mich dafür aus dem Kaffeehaus geworfen. Herrlich. #sprecher:ambrose #stimmung:lacht
-> END

// ---------------------------------------------------------------- Victor verliert (Szene 87)

=== victor_krise ===
// Kapitel 50: Victor spielt mit dem Gerät in der Tasche; das Summen ersetzt sein Thema (Musik geraet).
~ victorKriseGesehen = true
Am fünften Tag ist Victor an der Reihe. Der Mann im grauen Anzug wartet draußen. In die Hütte lässt Ward ihn nicht. #sprecher:erzaehler #musik:geraet
Hier drin sind Spieler und ein Feuer. Sie sind keines von beiden. #sprecher:ward
Du sitzt am Fenster. Victor legt nichts auf den Tisch. Seine rechte Hand hat er in der Jackentasche. #sprecher:erzaehler
Nach dreißig Zügen hat er einen Bauern mehr und ein Turmendspiel, das du kennst. Haraldsen hat es dir gezeigt. Die Brücke. #sprecher:erzaehler
* [Zusehen]
- Er zieht nicht. Er hält die Schulter schief, als horche er auf etwas. Es summt. Kurz. Dann zwei lange. #sprecher:erzaehler #klang:geraet_summen
Victor zieht den Turm. Nicht auf die vierte Reihe. Ward zieht ihren König ein Feld. Die Brücke ist nicht mehr zu bauen. #sprecher:erzaehler
Zug um Zug rinnt es ihm durch die Finger. Ward stellt sich nur immer dorthin, wo er vorbeiwill. Opposition. #sprecher:erzaehler
Nach siebzig Zügen hat er verloren. Ein gewonnenes Endspiel, mit einem Bauern mehr. #sprecher:erzaehler
Sein Telefon klingelt. Auf dem Bildschirm steht „Vater“. Er sieht darauf, drei Sekunden, vier. Er drückt es weg. #sprecher:erzaehler #klang:telefon
* [Victor ansehen]
- Er wirft etwas Graues, Flaches auf den Tisch. Es schlittert über das Brett und stößt die Könige um. #sprecher:erzaehler #klang:figuren_kippen #musik:aus
Es hat gesagt, plus zwei Komma eins. Die ganze Zeit. Ich hab doch gemacht, was es gesagt hat. #sprecher:victor #stimmung:muede
Er steht auf. Der Stuhl bleibt stehen. Er ist zu gut erzogen, um einen Stuhl umzuwerfen. #sprecher:erzaehler
Draußen ruft der Mann im grauen Anzug, dann rennende Schritte auf dem Pfad. Aufwärts. Nicht hinunter. #sprecher:erzaehler #pause:2
Ward stellt den schwarzen König zurück. Er spielt, als wäre er nicht da. #sprecher:ward
* [„Er hat die Brücke gesehen. Er wusste es.“]
- Natürlich wusste er es. Er ist der Begabteste, den ich in zwanzig Jahren hier oben hatte. #sprecher:ward
Er hat sich selbst nicht geglaubt. Jemand hat ihm sehr gründlich beigebracht, sich nicht zu glauben. #sprecher:ward
Worauf wartest du? Ich bin vierundsechzig. Ich renne keinem mehr nach. #sprecher:ward
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
    Kit. Fünfzehn. Mein Vater ist Bergführer, ich bin Wards Schülerin. #sprecher:kit
}
Der Bauer läuft, der König rennt. Wer ist schneller? Zähl. Wenn der König in das Quadrat kommt, hat er ihn. #sprecher:kit
Quadrat, Opposition, ein Tempo in Reserve. Meine Aufgaben sind klein. Aber gemein. #sprecher:kit
+ [„Zeig her.“]
    ~ beginneAufgaben("summitCity.reiheKit")
    -> END
+ [„Nicht jetzt.“]
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
Ein Turm hinter dem Freibauern. Wie ein Seil hinter der Gondel. Er schiebt, und er hält, beides zugleich. #sprecher:haraldsen
Philidor, Lucena. Klingen wie Gipfel. Sind auch welche. #sprecher:haraldsen
+ [„Ich bin bereit.“]
    ~ beginneAufgaben("summitCity.reiheHaraldsen")
    -> END
+ [„Nicht jetzt.“]
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
