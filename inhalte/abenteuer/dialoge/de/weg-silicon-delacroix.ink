// Weg 5 von Silicon Bay nach Port Delacroix: Karten „Fähre“ und „Deich“ (Akt 3, Szene 62 der
// Story-Bibel, Abschnitt 19.3).
//
// Stationen (W4): Rätseltafel im Salon (Runde wegSiliconDelacroix.tafel), Schiffskoch Mr. Ruiz als
// Straßengegner mit Uhr (Begegnung wegSiliconDelacroix.schiffskoch, Schnellschach 10 + 5, Sprüche
// erlaubt), Mr. Guidry am Deich mit einer Weisheit (Kapitel 5), Funde Flaschenpost und Muschel.
// Mama fährt mit (Helferin im Notzelt). Ambrose wird unruhig, je näher die Küste kommt.
// Einstiege wie in orte.json: schiffskoch, guidry, zurueck_silicon, tafel, fund_flaschenpost,
// fund_muschel; seit Runde 6 auch kapitaen, ereignis_kapitaen, ladung, delfin, pumpenhaus, seite02,
// finch_turm_a und spur_pm3 (Dokument 15, 2.5: das Kapitänsproblem).
//
// Funde gibt gibFund; Ink merkt sie sich zusätzlich selbst.
// Runde 11 (13.11.2026): nach dem Roman (roman/akt3_teil2.md, Kapitel 35): Ambrose am Bug sagt nur
// noch die Zugnummer („Den, den sie gespielt hätte“), der Delfin, den er nicht sieht (Knoten
// delfin), am Deich die Kette und „Ich bin hier weggegangen“. Ambrose kommentiert die Funde nicht
// mehr (die Muschel nur vor dem Vorwurf, als Vorbereitung auf Claire). Klang: ambrose.verzerrt,
// delfin; „Nicht jetzt.“ statt „Später.“.
//
// Variablen: ausgangWegSiliconDelacroixSchiffskoch und wegSiliconDelacroixTafelBestanden setzt die
// Hülle (R42); „abgebrochen“ zählt wie nicht gespielt (R35).

EXTERNAL beginnePartie(begegnung)
EXTERNAL beginneAufgaben(runde)
EXTERNAL gibFund(kennung)

VAR bugGesehen = false
VAR tiefpunktGesehen = false
VAR ausgangWegSiliconDelacroixSchiffskoch = ""
VAR wegSiliconDelacroixTafelBestanden = false
VAR ruizGetroffen = false
VAR guidryGetroffen = false
VAR flaschenpostGefunden = false
VAR muschelGefunden = false
VAR kapitaenGetroffen = false
VAR kapitaensproblemBestanden = false
VAR kapitaensproblemGeloest = false
VAR angesehenLadung = false
VAR angesehenDelfin = false
VAR angesehenPumpenhaus = false
VAR seite02Gefunden = false
VAR finchTurmAGefunden = false
VAR spurPM3Gefunden = false
// Zähler der Sammelstränge (Dokument 15, Abschnitt 1), gemeinsam über alle Orte
VAR buchseiten = 0
VAR finchFiguren = 0
VAR spurenPM = 0

// ---------------------------------------------------------------- Mr. Ruiz, der Schiffskoch

=== schiffskoch ===
{
- not ruizGetroffen: -> ruiz_erstes_treffen
- ausgangWegSiliconDelacroixSchiffskoch == "" or ausgangWegSiliconDelacroixSchiffskoch == "abgebrochen": -> ruiz_angebot
- ausgangWegSiliconDelacroixSchiffskoch == "niederlage": -> ruiz_nach_niederlage
- else: -> ruiz_nach_sieg
}

=== ruiz_erstes_treffen ===
~ ruizGetroffen = true
In der Kombüse rührt ein Mann mit Kochmütze in einem Topf. Auf der Arbeitsplatte steht ein Brett zwischen Zwiebeln. #sprecher:erzaehler
Ruiz, Schiffskoch. Zwei Tage bis Port Delacroix, und keiner an Bord spielt mit mir. #sprecher:schiffskoch #stimmung:laechelt
Mama lehnt in der Tür. „Spiel ruhig. Ich hol uns Kaffee.“ #sprecher:erzaehler
-> ruiz_angebot

=== ruiz_angebot ===
Zehn Minuten und fünf Sekunden je Zug, solange die Suppe zieht. Eine Stellung, du hast Weiß. #sprecher:schiffskoch #stimmung:laechelt
+ [„Abgemacht.“]
    ~ beginnePartie("wegSiliconDelacroix.schiffskoch")
    -> END
+ [„Nach dem Essen.“]
    Gute Antwort. Die Suppe ist wichtiger. #sprecher:schiffskoch #stimmung:laechelt
    -> END

=== ruiz_nach_sieg ===
Du spielst, wie ich koche: nicht zu schnell, nicht zu langsam. Noch eine? #sprecher:schiffskoch #stimmung:laechelt
+ [„Noch eine.“]
    ~ beginnePartie("wegSiliconDelacroix.schiffskoch")
    -> END
+ [„Nicht jetzt.“]
    -> END

=== ruiz_nach_niederlage ===
Angebrannt. Passiert. Noch einmal, solange das Meer ruhig ist? #sprecher:schiffskoch #stimmung:lacht
+ [„Revanche.“]
    ~ beginnePartie("wegSiliconDelacroix.schiffskoch")
    -> END
+ [„Nicht jetzt.“]
    -> END

// ---------------------------------------------------------------- Mr. Guidry am Deich

=== guidry ===
{guidryGetroffen:
    {~Jeder Sandsack zählt. Jeder Bauer auch.|Die Stadt steht wieder auf. Langsam. Aber sie steht.} #sprecher:guidry #stimmung:nachdenklich
    -> END
}
~ guidryGetroffen = true
Am Deich stapeln Männer und Frauen in Gummistiefeln Sandsäcke. Einer richtet sich auf, die Hand im Kreuz. #sprecher:erzaehler
Ein Loch im Deich ist wie ein Loch in einer Kette. Man stopft es, bevor es größer wird. Hinterher ist man immer klüger. #sprecher:guidry #stimmung:nachdenklich
-> END

// ---------------------------------------------------------------- Rätseltafel und Rückweg

=== tafel ===
{wegSiliconDelacroixTafelBestanden:
    Auf der Tafel im Salon hat jemand mit Kreide eine Möwe gemalt. Darunter: „Gelöst“. #sprecher:erzaehler
    -> END
}
Im Salon der Fähre hängt eine Tafel mit drei Diagrammen: „Wer die Bauern versteht, versteht das Spiel.“ #sprecher:erzaehler
+ [Die Aufgaben lösen]
    ~ beginneAufgaben("wegSiliconDelacroix.tafel")
    -> END
+ [Weiter an Deck]
    -> END

=== zurueck_silicon ===
Die Fähre legt bald wieder ab, zurück nach Silicon Bay. #sprecher:erzaehler
-> END

// ---------------------------------------------------------------- Funde

=== fund_flaschenpost ===
{flaschenpostGefunden:
    An der Reling glitzert nur noch Gischt. #sprecher:erzaehler
    -> END
}
~ flaschenpostGefunden = true
Zwischen zwei Rettungsringen klemmt eine Flasche mit einem gerollten Zettel darin. Darauf ein Schachdiagramm und „Wer findet den Zug?“. #sprecher:erzaehler
~ gibFund("flaschenpost")
-> END

=== fund_muschel ===
{muschelGefunden:
    Am Deich liegen nur noch Kiesel. #sprecher:erzaehler
    -> END
}
~ muschelGefunden = true
Im Sand am Deich liegt eine Muschel mit einem kleinen, runden Loch, wie für eine Kette gemacht. #sprecher:erzaehler
~ gibFund("muschelMitLoch")
{not tiefpunktGesehen: Meine Schwester sammelte solche. Sie fädelte sie auf und trug sie sonntags. #sprecher:ambrose #stimmung:fern}
-> END

// ---------------------------------------------------------------- Das Kapitänsproblem (Runde 6)
// Dokument 15, 2.5. Kapitän Amadou Fall hat das Brett von seinem Vorgänger geerbt. Die Runde
// wegSiliconDelacroix.kapitaensproblem setzt kapitaensproblemBestanden (Hülle, R42).

=== kapitaen ===
{
- kapitaensproblemGeloest: -> kapitaen_danach
- kapitaensproblemBestanden: -> kapitaen_horn
- not kapitaenGetroffen: -> kapitaen_erstes
- else: -> kapitaen_angebot
}

=== kapitaen_erstes ===
~ kapitaenGetroffen = true
Am Steuer steht ein Mann mit weißem Bart und blauer Mütze. Er nickt zur Wand der Kajüte. #sprecher:erzaehler
Fall, Amadou Fall. Du willst das Brett sehen. Alle wollen das Brett sehen. #sprecher:kapitaen #stimmung:laechelt
Mein Vorgänger hat es mir vererbt, mit drei Wörtern: Weiß zieht und gewinnt. Seit dreißig Jahren hat es keiner gelöst. #sprecher:kapitaen #stimmung:nachdenklich
Drei Fahrgäste haben ihre Lösung auf Zettel geschrieben und an den Rahmen gesteckt. Alle drei falsch. Wer es löst, darf einmal das Horn blasen. #sprecher:kapitaen #stimmung:lacht
-> kapitaen_angebot

=== kapitaen_angebot ===
+ [Die Zettel prüfen und das Brett lösen]
    ~ beginneAufgaben("wegSiliconDelacroix.kapitaensproblem")
    -> END
+ [„Nicht jetzt.“]
    Das Brett läuft nicht weg. Es hängt fest. #sprecher:kapitaen #stimmung:lacht
    -> END

=== kapitaen_horn ===
~ kapitaensproblemGeloest = true
Der Kapitän nimmt die drei Zettel vom Rahmen, faltet sie und steckt sie in die Brusttasche. „Dreißig Jahre.“ #sprecher:erzaehler
Er zeigt auf die Kordel über dem Steuer. Zieh. Kräftig. #sprecher:kapitaen #stimmung:laechelt
Ein tiefer Ton rollt über das Wasser. Auf dem Deich drehen sich Leute um und winken. #sprecher:erzaehler
~ gibFund("kapitaensmuetze")
Die gehört jetzt dir. Ich hab noch zwei, und keine passt mir so gut wie diese. #sprecher:kapitaen #stimmung:laechelt
-> END

=== kapitaen_danach ===
{~Das Horn hört man bis Port Delacroix. Jetzt wissen alle, dass jemand das Brett gelöst hat.|Mein Vorgänger hätte gelacht. Er hat immer gesagt, die Lösung sitzt irgendwann an Bord.|Neue Zettel? Nein. Ich hänge nur noch das Brett auf. Und deinen Namen daneben.} #sprecher:kapitaen #stimmung:laechelt
-> END

=== ereignis_kapitaen ===
{kapitaensproblemGeloest:
    An der Wand der Kajüte hängt das Brett. Unter dem Rahmen steht mit Kreide: „Gelöst.“ #sprecher:erzaehler
    -> END
}
An der Wand der Kajüte hängt ein gerahmtes Brett. Drei Zettel stecken im Rahmen, jeder mit einem anderen ersten Zug. #sprecher:erzaehler
-> kapitaen

// ---------------------------------------------------------------- Ansehen auf Fähre und Deich

=== ladung ===
{angesehenLadung:
    Die Container stehen gut verzurrt. Hochwasserhilfe für Port Delacroix. #sprecher:erzaehler
    -> END
}
~ angesehenLadung = true
Auf dem Achterdeck stehen Container mit der Aufschrift „Hochwasserhilfe“. Einer ist offen: Sandsäcke, Decken, Konserven. #sprecher:erzaehler
-> END

=== delfin ===
{angesehenDelfin:
    Das Wasser ist ruhig. Am Bug steht Ambrose und sieht nach vorn. #sprecher:erzaehler
    -> END
}
~ angesehenDelfin = true
Neben dem Schiff springt ein Delfin, grau und glänzend, und ist wieder weg. Mama schreit auf wie ein Kind. #sprecher:erzaehler #klang:delfin
{bugGesehen: Du drehst dich nach Ambrose um. Er hat es nicht gesehen. Er sieht nach vorn, auf die Küste. #sprecher:erzaehler}
-> END

// Gutachten L3.5: Ambrose am Bug als Pflichtereignis beim Übergang auf den Deich (orte.json,
// weiterDeich); einmal.
=== bug ===
{bugGesehen: -> END}
~ bugGesehen = true
Mama steht viel an der Reling. Ihr spielt auf Junos Reisebrett, das bei jedem Wellenschlag verrutscht. Sie gewinnt öfter. #sprecher:erzaehler
Ambrose steht am Bug. Früher bedachte er deine Fehler mit einem Seufzen. Jetzt sagt er die Zugnummer. #sprecher:erzaehler #musik:ambrose.verzerrt
Zug vierzehn. #sprecher:ambrose #stimmung:nachdenklich
* [„Was war da?“]
- Der Läufer. Es gab einen besseren. #sprecher:ambrose #stimmung:nachdenklich
* [„Welchen?“]
- Den, den sie gespielt hätte. #sprecher:ambrose #stimmung:fern
Er sagt „sie“. Wie bei einem Menschen. #sprecher:erzaehler #pause
Vorn kommt die Küste als brauner Strich aus dem Dunst. #sprecher:erzaehler
-> END

=== pumpenhaus ===
{angesehenPumpenhaus:
    Die Pumpe brummt. Das Wasser fließt dahin, wo es hingehört. #sprecher:erzaehler
    -> END
}
~ angesehenPumpenhaus = true
Im Pumpenhaus brummt eine alte Pumpe. An der Tür hängt ein Zettel: „Läuft. Bitte nicht treten.“ #sprecher:erzaehler
-> END

// ---------------------------------------------------------------- Sammelstränge (Dokument 15, Abschnitt 1)

=== seite02 ===
{seite02Gefunden:
    An der Reling flattert nichts mehr. #sprecher:erzaehler
    -> END
}
~ seite02Gefunden = true
~ buchseiten = buchseiten + 1
An der Reling hat sich ein Blatt Papier verfangen, nass vom Gischt. Darauf eine gezeichnete Stellung. #sprecher:erzaehler
~ gibFund("seite02")
-> END

=== finch_turm_a ===
{finchTurmAGefunden:
    Im Kasten liegen nur noch die Rettungsringe. #sprecher:erzaehler
    -> END
}
~ finchTurmAGefunden = true
~ finchFiguren = finchFiguren + 1
Am Kasten der Rettungsringe klebt ein kleiner Fink aus Blech. Hinter dem Deckel liegt ein weißer Turm aus hellem Holz. #sprecher:erzaehler
Unter dem Turm ist ein Feld eingebrannt. #sprecher:erzaehler
~ gibFund("finchTurmA")
-> END

=== spur_pm3 ===
{spurPM3Gefunden:
    Der Messwagen steht verschlossen in der Marsch. #sprecher:erzaehler
    -> END
}
~ spurPM3Gefunden = true
~ spurenPM = spurenPM + 1
Neben dem weißen Messwagen liegt eine Mappe im Gras. Auf dem Deckel: „Hochwasserhilfe: 40 Bildschirmtische, Nutzerdaten Port Delacroix“. #sprecher:erzaehler
~ gibFund("spurPM3")
-> END
