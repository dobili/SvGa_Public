// Ort: Slicks Wohnwagen am Fluss (Akt 2). Gegenstand: Dosentrophäen.
//
// Szene 37 der Story-Bibel, zweiter Teil (akt2.pavillonGeraeumt): Slick schenkt {held} den
// weißen Springer aus dem Pavillon (Fund pavillonspringer)
// und bringt ihm den ersten Spruch bei (Karte gruebelfalle, Schritt 13, docs/spiel/10, S1). Der Wohnwagen hat keinen eigenen
// Figurenauslöser; das Gespräch läuft deshalb über die Dosentrophäen: beim ersten Mal
// slick_abschied (auf diesen Knoten wartet Quest riverton.parkclub), danach die Trophäen.
// Die Tür öffnet sich erst, wenn clubkampfRivertonBesprochen wahr ist (orte.json, wenn).
// Runde 11 (13.11.2026): nach dem Roman (akt2_teil2.md, Kapitel 22): Dosenpokale von Mr. Odum,
// „Ich bin ein Großmaul“, der Springer, und am Fluss Ambroses Frage mit der Antwort des Helden
// („Ich weiß, mit wem ich lieber spiele“). Musik riverton.wohnwagen, am Schluss ambrose.zweifel.

EXTERNAL gibFund(kennung)
EXTERNAL gibKarte(kennung)

VAR held = "Du"
VAR slickAbschiedGesehen = false

=== dosentrophaeen ===
{slickAbschiedGesehen:
    {~Auf dem Brett über dem Bett: „Parkmeister 2019“, „Parkmeister 2020“, „Bester Verlierer 2017“. Alles Limonadendosen.|Die Steinplatte mit der Mulde liegt auf dem Bett, in ein Handtuch gewickelt.} #sprecher:erzaehler
    -> END
}
-> slick_abschied

=== slick_abschied ===
~ slickAbschiedGesehen = true
Drinnen ist es eng und warm. An der Wand hängt ein Kurierrad. Auf einem Brett über dem Bett stehen Pokale. #sprecher:erzaehler #musik:riverton.wohnwagen
Sie sind aus Limonadendosen, aufgeschnitten, gebogen, mit Draht. „Parkmeister 2019.“ „Bester Verlierer 2017.“ #sprecher:erzaehler
Der Alte hat die gebaut. Jedes Jahr einen. Richtige Pokale kosten Geld, hat er gesagt, und Dosen hab ich genug getrunken. #sprecher:slick
Er setzt sich aufs Bett. Ohne das Reden sieht er jünger aus. #sprecher:erzaehler
Ich hab seit März keinen neuen. #sprecher:slick #pause:2
* [Nichts sagen]
* [Juno ansehen]
- Ich bin ein Großmaul. Weiß ich. Ich dachte, wenn ich laut genug bin, hören die im Rathaus, dass da noch jemand ist. #sprecher:slick
Er reibt sich das Gesicht. #sprecher:erzaehler
Haben sie nicht. #sprecher:slick
Er hält dir einen weißen Springer aus Stein hin. Die Mähne ist an einer Stelle abgestoßen. #sprecher:erzaehler
Aus dem letzten Satz. Nimm ihn mit. Stell ihn irgendwo hin, wo gespielt wird. #sprecher:slick
* [Den Springer nehmen]
- ~ gibFund("pavillonspringer")
// Gutachten K2.3: kein Spruch-Tutorial an der stillsten Stelle. Die Grübelfalle gibt nach dem Roman
// erst Rosie in Silicon Bay (Mr. Odums Karte, Kapitel 31).
Er ist kalt und schwer. #sprecher:erzaehler #pause:2
* [Hinausgehen]
- -> slick_fluss

// Kapitel 22, Schluss: draußen am Fluss. Ambrose will zum ersten Mal wirklich eine Antwort.
=== slick_fluss ===
// Gutachten K2.4 und K2.5: drei Schläge mit Stille; Ambrose antwortet in keinem Zweig.
Draußen läuft der Fluss schwarz unter der Brücke. Oben im Park leuchtet es, jetzt an zehn Stellen. #sprecher:erzaehler #musik:aus #geraeusch:fluss
Er hat recht. #sprecher:ambrose #pause:2
Er hat recht, und es ist ein Unrecht, und ich würde dem Stadtrat gern etwas sagen, das man vor Kindern nicht sagt. #sprecher:ambrose
Und die Tische spielen trotzdem besser als er. #sprecher:ambrose
* [„Ja.“]
* [Schweigen]
- Besser als ich. #sprecher:ambrose #stimmung:fern #musik:ambrose.zweifel #pause:2
Du hast ihn noch nie so gehört. #sprecher:erzaehler
Was heißt das, {held}? Wenn das Schöne und das Richtige dasselbe sind, und eine Maschine kann beides? #sprecher:ambrose
Und ein Mann mit Dosenpokalen kann keines von beiden ganz. Was heißt das? #sprecher:ambrose
* [„Ich weiß es nicht. Aber ich weiß, mit wem ich lieber spiele.“]
    Er antwortet nicht. #sprecher:erzaehler #pause:2
    Es ist nicht die Antwort, die er gesucht hat. #sprecher:erzaehler
* [„Ich weiß es nicht.“]
    Er nickt nicht. Er sieht wieder hinauf zum Park, wo es leuchtet. #sprecher:erzaehler
* [Den Springer in der Hand drehen]
    Du siehst auf die Stelle, wo die Mähne fehlt. Er wartet. Dann sieht er wieder zum Park. #sprecher:erzaehler
- -> END

