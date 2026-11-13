// Weg 11 von Ghost Town zur Capital Arena: Karten „Seeufer“ und „Leuchtturm“ (Akt 4, Szene 102 der
// Story-Bibel, Abschnitt 28 und 29; Landschaft L7 König der Hügel).
//
// Stationen (W4): Leuchtturmwärter Abe Lindgren mit „König der Hügel“ (Variante, noch ohne Technik:
// Abe erklärt sie nur), Rätseltafel am Seeufer (Runde wegGhostCapital.tafel, Königsaktivität im
// Endspiel), Fund Leuchtturmlinse. Einstiege wie in orte.json: abe, zurueck_ghost, tafel,
// fund_linse. Die Ankunft erzählt capital-arena-aussen.ankunft_zu_fuss.
// Seit Runde 6 (Dokument 15, 2.13, Weltschachtag; Endpunkte der Sammelstränge 1.1 und 1.2):
// ereignis_weltschachtag, odette, wanderer, plakat_weltschachtag, seite12, weiter_leuchtturm
// (Sperre S12: fernpartieGespielt und novaBitteGehoert).
//
// Variablen: wegGhostCapitalTafelBestanden setzt die Hülle (R42), die übrigen setzt diese Datei.
// Den Fund merkt sich Ink zusätzlich selbst.

EXTERNAL beginneAufgaben(runde)
EXTERNAL beginneSimultan(kennung)
EXTERNAL zeigeVorfuehrung(kennung)
EXTERNAL beginnePartie(begegnung)
EXTERNAL gibFund(kennung)

VAR wegGhostCapitalTafelBestanden = false
VAR wegGhostCapitalSimultanBestanden = false
VAR ausgangWegGhostCapitalSimultan5 = ""
VAR ausgangWegGhostCapitalMeisterproblem = ""
VAR weltschachtagBegonnen = false
VAR weltschachtagErledigt = false
VAR abeFunkpartie = false
VAR odetteGetroffen = false
VAR finchKoenigErhalten = false
VAR finchErledigt = false
VAR wandererGetroffen = false
VAR wandererSeitenZurueck = 0
VAR angesehenPlakatWeltschachtag = false
VAR seite12Gefunden = false
VAR fernpartieGespielt = false
VAR novaBitteGehoert = false
VAR capitalZugang = false
VAR buchseiten = 0
VAR finchFiguren = 0
VAR abeGetroffen = false
VAR linseGefunden = false
VAR angesehenFaehrterminal = false

// ---------------------------------------------------------------- Abe am Leuchtturm

=== abe ===
{abeGetroffen:
    {~Bei Sturm suchen die Kapitäne das Licht. Bei dir ist es die Mitte.|Der Turm ist hundert Jahre alt. Die Stufen auch. Ich zähle sie jeden Tag.|Viel Glück in der Arena. Bring den König in den Hafen.} #sprecher:abe
    -> END
}
~ abeGetroffen = true
// Roman Kapitel 60: König der Hügel; Ambrose: „Wie wir alle.“ Es klingt nicht traurig.
Die Farben kommen zurück, als ihr den See erreicht. #sprecher:erzaehler
Der See ist so groß, dass man das andere Ufer nicht sieht. Vor dem Leuchtturm, weiß mit rotem Band, flickt ein Mann ein Netz. #sprecher:erzaehler #musik:leuchtturm
König der Hügel. Kennst du das? Wer seinen König zuerst in die Mitte bringt, auf eines von den vier Feldern, hat gewonnen. #sprecher:abe
Die Kapitäne haben das hier gespielt, wenn sie auf besseres Wetter gewartet haben. Der König muss in den Hafen. #sprecher:abe
* [Eine Partie spielen]
- Dein König läuft los, sobald er kann. Das hast du inzwischen gelernt. #sprecher:erzaehler
Der König muss zum Leuchtturm. Wie wir alle. #sprecher:ambrose #stimmung:froh
Es klingt nicht traurig. Du tust, als hättest du es nicht gehört. #sprecher:erzaehler
-> END

// ---------------------------------------------------------------- Rätseltafel, Fund und Rückweg

=== tafel ===
{wegGhostCapitalTafelBestanden:
    Auf der Tafel am Steg hat jemand mit Kreide einen Leuchtturm gemalt. Darunter: „Gelöst“. #sprecher:erzaehler
    -> END
}
Am Steg hängt eine Tafel mit drei Diagrammen: „Im Endspiel ist der König eine Figur. Bring ihn nach vorn!“ #sprecher:erzaehler
+ [Die Aufgaben lösen]
    ~ beginneAufgaben("wegGhostCapital.tafel")
    -> END
+ [Weitergehen]
    -> END

=== fund_linse ===
{linseGefunden:
    Im Wärterhaus liegt nur noch ein altes Logbuch. #sprecher:erzaehler
    -> END
}
~ linseGefunden = true
Im Wärterhaus liegt eine alte Linse aus dickem Glas, so groß wie ein Teller. #sprecher:erzaehler
Die hat hundert Schiffe heimgebracht. Nimm sie mit. Ich hab eine neue. #sprecher:abe
~ gibFund("leuchtturmlinse")
-> END

=== zurueck_ghost ===
Der Weg führt zurück nach Süden, nach Ghost Town. #sprecher:erzaehler
-> END

// ---------------------------------------------------------------- Sperre S12 am Seeufer (Runde 6)

=== weiter_leuchtturm ===
~ capitalZugang = fernpartieGespielt and novaBitteGehoert
{not capitalZugang:
    Der Wachmann schiebt einen Absperrbock vor den Uferweg. „Heute nur für Gemeldete. Morgen vielleicht.“ #sprecher:erzaehler
    Du denkst an Ghost Town. Und an Nova. #sprecher:erzaehler
}
-> END

// ---------------------------------------------------------------- Der Weltschachtag (Runde 6)
// Dokument 15, 2.13. Simultan gegen fünf Bekannte (partieformen.json, wegGhostCapital.simultan: fünf
// Stellungsduelle aus Kapitel 6, Abschnitt 6.8, „Den Vorteil verwerten“; drei Punkte bestehen),
// Abes Partie gegen das Publikum (erzählt).

=== ereignis_weltschachtag ===
{
- weltschachtagErledigt: -> weltschachtag_danach
- wegGhostCapitalSimultanBestanden: -> weltschachtag_abschluss
- ausgangWegGhostCapitalSimultan5 != "" and ausgangWegGhostCapitalSimultan5 != "abgebrochen": -> weltschachtag_nochmal
- weltschachtagBegonnen: -> weltschachtag_angebot
}
~ weltschachtagBegonnen = true
Am Ufer steht eine Bühne mit zwei Fahnen, schwarz und weiß. Davor eine lange Tafel mit fünf Brettern, und an jedem sitzt jemand, den du kennst. #sprecher:erzaehler
Weltschachtag! Der 20. Juli, seit 1924. Heute spielt das ganze Ufer. #sprecher:abe
Fünf Bretter, fünf Gegner, und du gehst von Brett zu Brett. Wie die großen Meister. #sprecher:abe
An jedem Brett steht schon eine Stellung, in der du besser stehst. Jetzt musst du es nur noch nach Hause bringen. #sprecher:abe
-> weltschachtag_angebot

=== weltschachtag_angebot ===
+ [Das Simultan beginnen]
    ~ beginneSimultan("wegGhostCapital.simultan")
    -> END
+ [„Gleich. Erst ein Eis.“]
    Das Eis schmilzt, die Bretter nicht. Wir warten. #sprecher:abe
    -> END

=== weltschachtag_nochmal ===
Nicht ganz. Ein Vorteil ist wie ein Fisch an der Angel: Man muss ihn noch an Land ziehen. Noch eine Runde? #sprecher:abe
-> weltschachtag_angebot

=== weltschachtag_abschluss ===
~ weltschachtagErledigt = true
Fünf Bretter, fünf Hände über dem Tisch. Alle klatschen, auch die, die verloren haben. #sprecher:erzaehler
Und jetzt die Partie gegen die Welt. Ich spiele gegen alle hier, jeder stimmt über den nächsten Zug ab. Du darfst einmal vorschlagen. #sprecher:abe
+ [Den Springer ins Zentrum vorschlagen]
    -> weltschachtag_funk
+ [Die Rochade vorschlagen]
    -> weltschachtag_funk

=== weltschachtag_funk ===
~ abeFunkpartie = true
Das Publikum hebt die Hände. Dein Zug gewinnt die Abstimmung. Abe kratzt sich am Kopf und lächelt. #sprecher:erzaehler
Gut gestimmt. Das geht ins Logbuch. Und ein Foto für dich, damit du den Tag nicht vergisst. #sprecher:abe
~ gibFund("fotoWeltschachtag")
So viele Menschen an einem Brett. So war es früher in den Cafés. #sprecher:ambrose #stimmung:friedlich
-> END

=== weltschachtag_danach ===
{~Die Bühne wird abgebaut, die Bretter bleiben bis zum Abend.|Am Eiswagen gibt es heute Sorte „Rochade“: Vanille mit Schokoladenkern.|Abe funkt die Partie gegen die Welt noch über das ganze Land.} #sprecher:erzaehler
-> END

=== plakat_weltschachtag ===
{angesehenPlakatWeltschachtag:
    „20. Juli. Weltschachtag am Leuchtturm.“ #sprecher:erzaehler
    -> END
}
~ angesehenPlakatWeltschachtag = true
Am Fuß des Leuchtturms steht ein Aufsteller: „20. Juli. Weltschachtag am Leuchtturm. Alle Bretter willkommen.“ #sprecher:erzaehler
-> END

// ---------------------------------------------------------------- Odette Finch (Ende der Finch-Jagd, 15, 1.1)
// Vierzehn Figuren liegen an den Wegen, eine im Steinbruch, eine in der Sternwarte, eine auf der
// Pelikaninsel; den König gibt Odette selbst. Ab 15 Figuren stellt sie Schwarz auf: das Meisterproblem
// ist die Falle von Légal mit allen 16 weißen Figuren (Vorführung finchFalle, Lösung 5.Sxe5!), hier als
// Stellungsduell wegGhostCapital.meisterproblem, bis die Form „Weiß zieht und gewinnt“ fertig ist.

=== odette ===
{
- finchErledigt: -> odette_danach
- ausgangWegGhostCapitalMeisterproblem == "sieg": -> odette_geloest
- finchKoenigErhalten: -> odette_nochmal
- finchFiguren >= 15: -> odette_koenig
- not odetteGetroffen: -> odette_erstes
- else: -> odette_hinweis
}

=== odette_erstes ===
~ odetteGetroffen = true
Vor dem Wohnmobil sitzt eine alte Dame in einem Klappstuhl und lacht, als sie dich sieht. #sprecher:erzaehler
Odette Finch. Mein Wohnmobil heißt Gambit, und ich warte hier auf jemanden, der meine Figuren findet. #sprecher:odette
-> odette_hinweis

=== odette_hinweis ===
{finchFiguren == 0:
    Sechzehn weiße Figuren aus Buchsbaum, entlang der Wege. Wo ein kleiner Fink sitzt, lohnt sich ein Blick. #sprecher:odette
- else:
    {finchFiguren} von fünfzehn hast du. Die anderen warten noch an den Wegen, im Steinbruch, in der Sternwarte und auf der Pelikaninsel. #sprecher:odette
}
-> END

=== odette_koenig ===
~ finchKoenigErhalten = true
Alle fünfzehn! Du bist schneller als die letzten drei zusammen. #sprecher:odette
Hier ist der weiße König. Den hatte ich die ganze Zeit in der Tasche. Jetzt stelle ich Schwarz auf. #sprecher:odette
~ gibFund("finchKoenig")
Weiß zieht und gewinnt. Finchs letzte Falle, und die älteste. #sprecher:odette
+ [Das Meisterproblem lösen]
    ~ beginnePartie("wegGhostCapital.meisterproblem")
    -> END
+ [„Ich komme wieder.“]
    Ich laufe nicht weg. Mein Wohnmobil auch nicht, es springt schlecht an. #sprecher:odette
    -> END

=== odette_nochmal ===
Noch einmal? Weiß zieht und gewinnt. Sieh dir den Springer an, und dann sieh dir meine Dame an. #sprecher:odette
+ [Das Meisterproblem noch einmal versuchen]
    ~ beginnePartie("wegGhostCapital.meisterproblem")
    -> END
+ [„Später.“]
    -> END

=== odette_geloest ===
~ finchErledigt = true
Gelöst! Dann gehört der Satz dir. Finchs Buchsbaum, sechzehn Weiße, sechzehn Schwarze. #sprecher:odette
~ gibFund("finchsBuchsbaum")
Und jetzt zeige ich dir, woher die Falle kommt. Légal hat sie um 1750 in Paris gestellt. #sprecher:odette
~ zeigeVorfuehrung("finchFalle")
Ein Problem will gelöst werden. Dieses hat lange gewartet. #sprecher:ambrose #stimmung:friedlich
-> END

=== odette_danach ===
{~Ich komponiere schon das nächste. Diesmal verstecke ich es auf dem Mond.|Gambit springt wieder an. Vielleicht fahre ich ans Meer.|Wer eine Falle baut, freut sich am meisten, wenn jemand herausfindet.} #sprecher:odette
-> END

// ---------------------------------------------------------------- Der Wanderer (Buchseiten, 15, 1.2)
// Er sitzt am Weg neben der Tafel. Für jede Seite fünf Münzen (über den Fund); hier dankt er nur.
// Das gedruckte Buch schenkt er nach dem Finale in Capital (capital-arena-aussen.wanderer_buch).

=== wanderer ===
{
- buchseiten == 0 and not wandererGetroffen: -> wanderer_erstes
- buchseiten > wandererSeitenZurueck: -> wanderer_seiten
- else: -> wanderer_danach
}

=== wanderer_erstes ===
~ wandererGetroffen = true
Auf der Bank am Weg sitzt ein Mann mit gelbem Rucksack und zählt Papier. #sprecher:erzaehler
Meine Sammlung. Alte Blätter mit Stellungen, auf jedem Weg hat der Wind mir eines genommen. Dreizehn fehlen mir. #sprecher:wanderer
-> END

=== wanderer_seiten ===
~ wandererGetroffen = true
~ wandererSeitenZurueck = buchseiten
Du hast meine Seiten! Warte, ich streiche sie glatt. Jede einzelne. #sprecher:wanderer
{buchseiten >= 13:
    Alle dreizehn. Nach deinem Finale lasse ich sie binden. Komm mich in Capital besuchen. #sprecher:wanderer
- else:
    {buchseiten} von dreizehn. Der Rest liegt noch irgendwo zwischen hier und Maple Falls. #sprecher:wanderer
}
-> END

=== wanderer_danach ===
{~Jede Seite hat ihren eigenen Weg genommen. Ich hätte sie festbinden sollen.|Ich sammle Stellungen, die jemand irgendwo aufgezeichnet hat. Jede hat jemandem etwas bedeutet.|Der Wind hier ist freundlicher. Er nimmt nur Hüte.} #sprecher:wanderer
-> END

=== seite12 ===
{seite12Gefunden:
    Am Anleger schaukelt nur noch das Wasser. #sprecher:erzaehler
    -> END
}
~ seite12Gefunden = true
~ buchseiten = buchseiten + 1
Am Anleger klebt ein Blatt an einem Pfosten. Eine lose Seite voller Schachdiagramme. #sprecher:erzaehler
~ gibFund("seite12")
-> END

// ---------------------------------------------------------------- Ansehen am Seeufer (Runde 6)

=== faehrterminal ===
{angesehenFaehrterminal:
    Am Fahrplan hängt ein Zettel: „Sonderfahrt am 20. Juli, Weltschachtag.“ #sprecher:erzaehler
    -> END
}
~ angesehenFaehrterminal = true
Ein kleines Fährterminal mit einem Fahrplan unter Glas. Die Fähre fährt zweimal am Tag über den See, sonntags dreimal. #sprecher:erzaehler
-> END
