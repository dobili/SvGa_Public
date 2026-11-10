// Nebenort N2 Schleusendorf Lockport, Außenkarte (Akt 2; 14_Akt2_Leben_teil1.md, Abschnitt 4).
//
// Sperre S3: Herbstwartung am Untertor, das Geländer des Stegs ist abgeschraubt. Imogen Rourke
// führt {held} erst hinüber, wenn die Rätseltafel am Nordufer gelöst ist (Runde
// lockport.tafelSchleuse, zwei Gabeln). Der Steg ist ein Übergang auf derselben Karte mit
// `wenn: lockportSteg`; diese Variable setzt der Knoten steg_s3 selbst, sobald die Tafel bestanden
// ist.
// Nebenaufgaben (alle klein): L1 Kahnrennen (Kapitän Ruben, Runde lockport.kahnrennen), L2 Taue
// (Henriks Boot, Runde lockport.taue, Gummistiefel über die Quest), L3 Post für den Kapitän
// (Brief von Big Joe aus Ironwood, Variable briefFuerRuben; danach lastkahnFrei).
// Lohn des ganzen Ortes: Imogen gibt die Karte „Auszeit“, wenn alle drei erledigt sind.
// Einstiege wie in orte.json: tafel_schleuse, steg_s3, kai, henriks_boot, lastkahn (Rückfahrt mit der
// Ashford Belle nach Riverton oder Ironwood, erst ab lastkahnFrei; Hinfahrt an den Anlegern dort).

EXTERNAL beginneAufgaben(runde)
EXTERNAL gibKarte(kennung)
EXTERNAL reise(karte, ausloeser)
EXTERNAL zahle(muenzen)

VAR held = "Du"
VAR lockportTafelSchleuseBestanden = false
VAR lockportKahnrennenBestanden = false
VAR lockportTaueBestanden = false
VAR lockportSteg = false
VAR imogenGetroffen = false
VAR rubenGetroffen = false
VAR kahnrennenErledigt = false
VAR taueAngenommen = false
VAR taueErledigt = false
VAR briefFuerRuben = false
VAR postErledigt = false
VAR lastkahnFrei = false
VAR muenzen = 0
VAR auszeitErhalten = false

// ---------------------------------------------------------------- Rätseltafel und Imogen (S3)

=== tafel_schleuse ===
{kahnrennenErledigt && taueErledigt && postErledigt && not auszeitErhalten: -> auszeit}
{lockportTafelSchleuseBestanden: -> tafel_geloest}
{imogenGetroffen: -> tafel_angebot}
~ imogenGetroffen = true
Neben der Tafel steht eine Frau in Ölzeug, einen Schlüsselbund am Gürtel. #sprecher:erzaehler
„Imogen Rourke, Schleusenwärterin. Erst das Wasser, dann das Boot.“ #sprecher:erzaehler
-> tafel_angebot

=== tafel_angebot ===
„Der Steg ist zu, Herbstwartung. Wer zwei Dinge zugleich im Blick hat, darf mit mir hinüber. Hier ist die Tafel.“ #sprecher:erzaehler
* [Die Tafel lösen]
    ~ beginneAufgaben("lockport.tafelSchleuse")
    -> END
* [Später]
    „Das Wasser wartet. Ich auch.“ #sprecher:erzaehler
    -> END

=== tafel_geloest ===
~ lockportSteg = true
„Zwei Ziele mit einem Zug. Du darfst über den Steg, ich halte dich am Arm.“ #sprecher:erzaehler
-> END

=== auszeit ===
~ auszeitErhalten = true
Imogen läutet die Glocke am Wärterhaus, einmal, für dich. #sprecher:erzaehler
„Erst das Wasser, dann das Boot. Manchmal muss man warten, bis die Kammer voll ist.“ #sprecher:erzaehler
~ gibKarte("auszeit")
-> END

// ---------------------------------------------------------------- Steg über das Untertor (S3)

=== steg_s3 ===
{lockportTafelSchleuseBestanden:
    ~ lockportSteg = true
    Imogen nimmt dich am Arm. Unter den Bohlen rauscht das Wasser durch das Tor. #sprecher:erzaehler
    -> END
}
Das Geländer des Stegs liegt abgeschraubt auf der Mauer. Ein Schild: „Herbstwartung. Übergang nur mit der Schleusenwärterin.“ #sprecher:erzaehler
-> END

// ---------------------------------------------------------------- Kapitän Ruben am Kai (L1, L3)

=== kai ===
{rubenGetroffen: -> kai_auswahl}
~ rubenGetroffen = true
Ein Mann mit Schiffermütze sitzt auf einem Poller und sieht auf den leeren Kahn. #sprecher:erzaehler
„Ruben Castellano. Kapitän der Ashford Belle. Ein Kahn ohne Fracht ist ein Haus ohne Leute.“ #sprecher:erzaehler
-> kai_auswahl

=== kai_auswahl ===
{briefFuerRuben && not postErledigt: -> post_abgeben}
{lockportKahnrennenBestanden && not kahnrennenErledigt: -> kahnrennen_geloest}
{not kahnrennenErledigt: -> kahnrennen_angebot}
{lastkahnFrei:
    „Die Belle hat wieder zu tun. Riverton, Lockport, Ironwood, wie früher.“ #sprecher:erzaehler
  - else:
    „Zwei Ziele, ein Schuss. So legt man an. So gabelt man auch.“ #sprecher:erzaehler
}
-> END

=== kahnrennen_angebot ===
Am Kai schwimmen drei Spielzeugkähne aus Holz. Finn und zwei Kinder knien an der Kante. #sprecher:erzaehler
„Ich bin Schiedsrichter. Wer an der Tafel zwei Kähne mit einem Zug trifft, darf den Startschuss geben.“ #sprecher:erzaehler
* [An die Kreidetafel]
    ~ beginneAufgaben("lockport.kahnrennen")
    -> END
* [Später]
    „Die Kähne laufen nicht weg. Höchstens ab.“ #sprecher:erzaehler
    -> END

=== kahnrennen_geloest ===
~ kahnrennenErledigt = true
„Drei von drei. Dann los, du gibst das Zeichen.“ #sprecher:erzaehler
Du klatschst in die Hände. Die Kähne treiben los, Finns Kahn dreht sich einmal und gewinnt trotzdem. #sprecher:erzaehler
-> END

=== post_abgeben ===
„Ein Brief? Für mich?“ #sprecher:erzaehler
* [Den Brief von Big Joe geben]
    -> post_geloest

=== post_geloest ===
~ postErledigt = true
~ lastkahnFrei = true
Ruben liest, dann lacht er so laut, dass die Möwen auffliegen. #sprecher:erzaehler
„Eine Fuhre Stahlträger. Solange Joe das Sagen hat, fährt die Belle wieder.“ #sprecher:erzaehler
Ein Brief kann ein ganzes Schiff bewegen. #sprecher:ambrose
-> END

// ---------------------------------------------------------------- Henriks Boot (L2)

=== henriks_boot ===
{taueErledigt: -> boot_danach}
{lockportTaueBestanden: -> taue_geloest}
{taueAngenommen: -> boot_taue}
Ein Ruderboot, an vier Tauen festgemacht, kreuz und quer. Daran hat jemand mit viel Geduld geknotet. #sprecher:erzaehler
-> END

=== boot_taue ===
Henriks Ruderboot hängt an vier Tauen. Löst du das falsche, kippt alles. #sprecher:erzaehler
* [Die Taue ansehen]
    ~ beginneAufgaben("lockport.taue")
    -> END
* [Später]
    -> END

=== taue_geloest ===
~ taueErledigt = true
Ein Tau nach dem anderen, und das Boot gleitet die Slipanlage hinauf. #sprecher:erzaehler
Henrik kommt aus dem Gasthaus gelaufen. „Damit du beim nächsten Boot keine nassen Füße kriegst. Ich hab zwei Paar.“ #sprecher:erzaehler
Er drückt dir ein Paar Gummistiefel in die Hand. #sprecher:erzaehler
-> END

=== boot_danach ===
Henriks Boot liegt kieloben auf dem Kai, bereit für den Winter. #sprecher:erzaehler
-> END

// ---------------------------------------------------------------- Ansehen

=== pumpe ===
Der alte Dorfbrunnen mit Kurbel. Wer dreht, bekommt kaltes Wasser und quietschende Ohren. #sprecher:erzaehler
-> END

=== glocke ===
An einem Pfosten am Ufer hängt eine Messingglocke. Imogen läutet sie für jeden Kahn, der kommt. #sprecher:erzaehler
-> END

// ---------------------------------------------------------------- Lastkahn (nach L3)

=== lastkahn ===
{not lastkahnFrei:
    Die Ashford Belle liegt vertäut unter ihrer Plane. Ohne Fracht fährt sie nirgendwohin. #sprecher:erzaehler
    -> END
}
Ruben steht an der Gangway. „Die Belle legt gleich ab. 5 Münzen die Fahrt. Wohin?“ #sprecher:erzaehler
* {muenzen < 5} [Mitfahren (5 Münzen)]
    Du hast nicht genug Münzen. Ruben zuckt die Schultern: „Komm wieder, wenn die Kasse stimmt.“ #sprecher:erzaehler
    -> END
* {muenzen >= 5} [Nach Riverton (5 Münzen)]
    ~ zahle(5)
    Der Kahn gleitet aus der Schleuse in den Kanal. Die Pappeln ziehen langsam vorbei. #sprecher:erzaehler
    ~ reise("riverton.aussen", "anlegerSchild")
    -> END
* {muenzen >= 5} [Nach Ironwood (5 Münzen)]
    ~ zahle(5)
    Der Kahn folgt dem Kanal nach Osten, bis die Schlote des Werks auftauchen. #sprecher:erzaehler
    ~ reise("ironwood.aussen", "anleger")
    -> END
* [Hierbleiben]
    „Die Belle wartet nicht ewig. Aber heute schon.“ #sprecher:erzaehler
    -> END
