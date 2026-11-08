// Ort: Stadtpark von Maple Falls, Stadtrand mit Weg nach Cedar Creek (Akt 1).
// Figuren: Mr. Abernathy, Jo. Auslöser: parkbank (orte.json), bushaltestelle (neu, Bericht).
//
// Szenen der Story-Bibel (docs/spiel/05_Story_Bibel.md, Abschnitt 4): 7 Das vergessene Brett im
// Park (Rätsel-Quest mapleFalls.verlorenesBrett, Partiefragment 0), 10 Jo auf der Halfpipe
// (Straßengegnerin, Stellungsduell), 13 Aufbruch, zweiter Teil (Bus nach Cedar Creek).
// Einstiege: „bibliothekar“, „parkbank“, „skater_jo“, „bushaltestelle“.
// parkbankRaetselBestanden und ausgangSkaterJo setzt die Hülle (Vorschlag im Bericht mittel-1).
// Jos Stellungsduell braucht die Begegnung mapleFalls.skaterJo in begegnungen.json (gesperrt);
// bis dahin endet jo_duell ohne Partie.

EXTERNAL beginneAufgaben(runde)
EXTERNAL beginnePartie(begegnung)

VAR held = "Du"
VAR abernathyGetroffen = false
VAR parkbankBrettGefunden = false
VAR parkbankRaetselBestanden = false
VAR abernathyBrief = false
VAR joGetroffen = false
VAR ausgangSkaterJo = ""
VAR aufbruchGesehen = false

// ---------------------------------------------------------------- Mr. Abernathy

=== bibliothekar ===
{
- not abernathyGetroffen: -> bibliothekar_sucht
- parkbankRaetselBestanden and not abernathyBrief: -> bibliothekar_brief
- abernathyBrief: -> bibliothekar_alltag
- else: -> bibliothekar_wartet
}

=== bibliothekar_sucht ===
~ abernathyGetroffen = true
Ein alter Herr mit Thermoskanne sucht unter einer Bank, dann in seiner Jackentasche. #sprecher:erzaehler
Ich hatte doch … nein, das ist meine Brille. Das Brett, das Brett! #sprecher:abernathy
Abernathy, sehr erfreut. Früher Bibliothekar, heute Sucher von Dingen. #sprecher:abernathy
Mein Reisebrett. Ich habe es auf einer Bank vergessen. Aber auf welcher? #sprecher:abernathy
* [„Ich suche es für Sie.“]
    Wie freundlich. Es steht eine Stellung darauf. Bitte nichts verschieben. #sprecher:abernathy
* [„Wie sieht es aus?“]
    Klein, grün, mit Magnetfiguren. Und mit einer Stellung, die ich nicht lösen kann. #sprecher:abernathy
- Ein Mann, der Stellungen aufhebt. Das gefällt mir. #sprecher:ambrose
-> END

=== bibliothekar_wartet ===
{parkbankBrettGefunden:
    Ah, Sie haben es gesehen? Und die Stellung? Weiß am Zug, so heißt es, gewinnt eine Figur. #sprecher:abernathy
- else:
    Eine Bank, ein grünes Brett. Weiter weiß ich leider auch nicht. #sprecher:abernathy
}
-> END

=== bibliothekar_brief ===
~ abernathyBrief = true
Mein Brett! Und Sie haben die Stellung gelöst? Wunderbar. #sprecher:abernathy #stimmung:froh
Wissen Sie, woher sie stammt? #sprecher:abernathy
Aus einem Brief der alten Mrs. Whitlock. Ich habe beim Ausräumen geholfen. #sprecher:abernathy
Der Brief war sehr alt, nur Züge darin. #sprecher:abernathy
Und eine Unterschrift: A. W. Ich habe alles abgeschrieben. #sprecher:abernathy
Das ist meine Partie. Die letzte. Ein Stück davon. #sprecher:ambrose #stimmung:traurig #pause
* [„Ambrose? Was für eine Partie?“]
    Später. Nein. Nicht später. Irgendwann erzähle ich es dir. Versprochen. #sprecher:ambrose
* [„Danke, Mr. Abernathy.“]
    Ich danke Ihnen. Behalten Sie die Abschrift. #sprecher:abernathy
    Sie gehört eher ins Whitlock-Haus als zu mir. #sprecher:abernathy
- Er hat das abgeschrieben? Mit Bleistift? #sprecher:ambrose #stimmung:lacht
Ich bin gerührt. Und beleidigt, es fehlt ein Bauer. #sprecher:ambrose
-> END

=== bibliothekar_alltag ===
{~Heute habe ich nur die Thermoskanne vergessen. Ein guter Tag.|Mrs. Whitlock spielte gern. Nie gegen mich. Gegen ihr altes Brett, sagte sie.|Ein Bibliothekar hört nie auf zu sortieren. Jetzt sortiere ich Enten.} #sprecher:abernathy
-> END

// ---------------------------------------------------------------- Die Parkbank

=== parkbank ===
{
- not abernathyGetroffen:
    Auf der Bank liegt ein kleines grünes Brett. Es gehört sicher jemandem. #sprecher:erzaehler
    -> END
- not parkbankBrettGefunden: -> parkbank_fund
- not parkbankRaetselBestanden: -> parkbank_raetsel
- else:
    Die Bank ist leer. Mr. Abernathy hat sein Brett wieder. #sprecher:erzaehler
    -> END
}

=== parkbank_fund ===
~ parkbankBrettGefunden = true
Auf der Bank liegt ein kleines grünes Brett mit Magnetfiguren. Daneben ein Zettel. #sprecher:erzaehler
„Weiß am Zug gewinnt eine Figur.“ #sprecher:erzaehler
Zähl, {held}. Wer greift an, wer verteidigt? #sprecher:ambrose
-> parkbank_raetsel

=== parkbank_raetsel ===
* [Die Stellung lösen]
    ~ beginneAufgaben("mapleFalls.parkbankRaetsel")
    -> END
* [Später wiederkommen]
    -> END

// ---------------------------------------------------------------- Jo

=== skater_jo ===
{
- not joGetroffen: -> jo_erstes_treffen
- ausgangSkaterJo == "": -> jo_angebot
- ausgangSkaterJo == "niederlage": -> jo_nach_niederlage
- else: -> jo_nach_sieg
}

=== jo_erstes_treffen ===
~ joGetroffen = true
Auf der Kante der Halfpipe liegt ein zerkratztes Brett. Eine Skaterin sitzt davor. #sprecher:erzaehler
Jo. Ich spiele um Limo. #sprecher:skaterJo
-> jo_angebot

=== jo_angebot ===
Ich stelle eine Stellung auf, du hast ein bisschen Vorteil. Zehn, fünfzehn Züge. #sprecher:skaterJo
Hältst du ihn, gewinnst du. #sprecher:skaterJo
Wer verliert, holt Limo. #sprecher:skaterJo
* [„Abgemacht.“]
    -> jo_duell
* [„Ein andermal.“]
    Ich bin hier. Immer. #sprecher:skaterJo
    -> END

=== jo_duell ===
// Stellungsduell aus Abbildung 1.21 (Regelwerk C1, R13), Begegnung in begegnungen.json.
~ beginnePartie("mapleFalls.skaterJo")
Jo stellt die Figuren auf. Schnell, ohne hinzusehen. #sprecher:erzaehler
-> END

=== jo_nach_sieg ===
Okay, okay. Limo geht auf mich. Noch eine? #sprecher:skaterJo
Wer im Park gewinnt, gewinnt bald auch im Club. #sprecher:ambrose
+ [„Noch eine.“]
    -> jo_duell
+ [„Später.“]
    -> END

=== jo_nach_niederlage ===
Limo, bitte. Mit Eis. #sprecher:skaterJo
Du hast deinen Vorteil verschenkt. Nicht schlimm. Dafür ist der Park da. #sprecher:ambrose
+ [„Revanche.“]
    -> jo_duell
+ [„Später.“]
    -> END

// ---------------------------------------------------------------- Bushaltestelle

=== bushaltestelle ===
{aufbruchGesehen:
    Der gelbe Schulbus wartet. Coach Delgado winkt mit der Trillerpfeife. #sprecher:erzaehler #klang:bus
    Juno sitzt schon hinten und hält dir einen Platz frei. #sprecher:erzaehler
    Ein Wagen ohne Pferde. Ich werde mich nie daran gewöhnen. #sprecher:ambrose
    * [Einsteigen]
        Der Bus fährt los, die Landstraße entlang nach Cedar Creek. #sprecher:erzaehler
        -> END
    * [Noch nicht]
        -> END
- else:
    Hier hält der Bus nach Cedar Creek. Heute fährt er ohne dich. #sprecher:erzaehler
    -> END
}
