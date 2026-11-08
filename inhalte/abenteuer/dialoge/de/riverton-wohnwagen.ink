// Ort: Slicks Wohnwagen am Fluss (Akt 2). Gegenstand: Dosentrophäen.
//
// Szene 37 der Story-Bibel, zweiter Teil (akt2.pavillonGeraeumt): Slick schenkt {held} den
// weißen Springer aus dem Pavillon (Fund pavillonspringer)
// und bringt ihm den ersten Spruch bei (Karte gruebelfalle, Schritt 13, docs/spiel/10, S1). Der Wohnwagen hat keinen eigenen
// Figurenauslöser; das Gespräch läuft deshalb über die Dosentrophäen: beim ersten Mal
// slick_abschied (auf diesen Knoten wartet Quest riverton.parkclub), danach die Trophäen.
// Die Tür öffnet sich erst, wenn clubkampfRivertonBesprochen wahr ist (orte.json, wenn).

EXTERNAL gibFund(kennung)
EXTERNAL gibKarte(kennung)

VAR held = "Du"
VAR slickAbschiedGesehen = false

=== dosentrophaeen ===
{slickAbschiedGesehen:
    {~Auf dem Regal stehen Trophäen aus Limodosen, jede beschriftet: „Turnier im Regen“, „Blitz gegen den Bürgermeister“.|Eine Dose ist leer und trägt die Aufschrift „Für {held}. Irgendwann.“} #sprecher:erzaehler
    -> END
}
-> slick_abschied

=== slick_abschied ===
~ slickAbschiedGesehen = true
Im Wohnwagen stehen Trophäen aus Limodosen, ein Kurierrad hängt an der Wand, auf dem Bett liegt ein Brett. #sprecher:erzaehler
Heute Morgen haben sie die Bildschirme in den Pavillon getragen. Ich hab zugeschaut. #sprecher:slick #stimmung:ernst
Dann bin ich gegangen. #sprecher:slick
Er greift in die Kuriertasche und holt einen weißen Springer heraus, die Mähne abgestoßen. #sprecher:erzaehler
Aus dem letzten Satz. Der war schon im Pavillon, bevor ich geboren wurde. #sprecher:slick
Nimm ihn mit. #sprecher:slick
~ gibFund("pavillonspringer")
Dann spielen wir eben auf der Treppe. Die Treppe kann man nicht verpachten. #sprecher:slick #stimmung:froh
Und noch was für die Treppe. Wenn dein Gegner zu sicher wirkt, frag ihn ganz ruhig, ob sein Turm da wirklich sicher steht. #sprecher:slick
Dann grübelt er. Und die Uhr läuft. #sprecher:slick #stimmung:froh
~ gibKarte("gruebelfalle")
Ein Spruch ist kein Zug. Aber im Park gehört er dazu. #sprecher:ambrose
Er hat recht. Und die Tische spielen trotzdem besser als er. Was heißt das? #sprecher:ambrose #stimmung:fern
* [„Dass besser nicht alles ist.“]
    Vielleicht. Ich werde darüber nachdenken müssen. Ich habe ja Zeit. #sprecher:ambrose
* [„Ich weiß es nicht.“]
    Ich auch nicht. Zum ersten Mal seit langer Zeit. #sprecher:ambrose
- -> END
