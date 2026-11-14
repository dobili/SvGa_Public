// Ort: Sommerjahrmarkt hinter der Raststätte in Crossroads (Nebenort N6, Akt 4; 13_Wegenetz,
// Abschnitt 5; Ortsdokument docs/spiel/orte/jahrmarkt.md).
//
// Runde 6: der Schachtürke von Schaustellerin Dolores (drin sitzt ihr Sohn Ike und freut sich über
// jeden, der das Geheimnis errät), Riesenrad und Losbude zum Ansehen, Darlenes Lieferung
// (Quest crossroads.lieferung, Schritt dolores_lieferung).
// Einstiege wie in orte.json: schachautomat, riesenrad, losbude; Figur Dolores: dolores.
// Schachgeschichte nur aus Dokument 16, Abschnitt 4 (Kempelens Türke, 1770).

EXTERNAL gibFund(kennung)

VAR held = "Du"
VAR doloresGetroffen = false
VAR tuerkeGeheimnisGeloest = false
VAR lieferungFuerDolores = false
VAR lieferungAbgegeben = false

// ---------------------------------------------------------------- Der Schachtürke

=== dolores ===
-> schachautomat

=== schachautomat ===
{lieferungFuerDolores and not lieferungAbgegeben: -> dolores_lieferung}
{tuerkeGeheimnisGeloest: -> schachautomat_danach}
{not doloresGetroffen: -> dolores_erstes_treffen}
-> schachautomat_raten

=== dolores_erstes_treffen ===
~ doloresGetroffen = true
Vor einem Holzkasten mit einem Brett darauf sitzt eine Puppe mit Turban. Daneben steht eine Frau in einem Mantel voller Sterne. #sprecher:erzaehler
Dolores, Schaustellerin. Das hier ist der Schachtürke. Er hat noch nie verloren. #sprecher:dolores #stimmung:froh
Den ersten hat Wolfgang von Kempelen gebaut, 1770. Er hat gegen Napoleon gespielt und gegen Benjamin Franklin. #sprecher:dolores #stimmung:laechelt
-> schachautomat_raten

=== schachautomat_raten ===
Wer errät, wie er funktioniert, bekommt eine Münze. Also? #sprecher:dolores #stimmung:laechelt
+ [„Da drin sitzt jemand.“]
    -> schachautomat_geloest
+ [„Ein Uhrwerk mit sehr vielen Zahnrädern.“]
    Das sagen alle. Die Zahnräder sind echt, das stimmt. #sprecher:dolores #stimmung:lacht
    -> END
+ [„Magnete unter dem Brett.“]
    Nicht schlecht. Aber wer bewegt dann die Magnete? #sprecher:dolores #stimmung:laechelt
    -> END

=== schachautomat_geloest ===
~ tuerkeGeheimnisGeloest = true
Aus dem Kasten klopft es dreimal. Eine Klappe geht auf, und ein Junge mit Taschenlampe grinst heraus. #sprecher:erzaehler
Erwischt! Ich bin Ike. Das hat diese Woche noch niemand erraten. Hier, deine Münze. #sprecher:ike #stimmung:froh
In Kempelens Kiste saß auch ein Mensch. Ein guter Spieler, der sich klein machen konnte. #sprecher:ambrose #stimmung:laechelt
~ gibFund("geheimnisTuerke")
-> END

=== schachautomat_danach ===
{~Ike winkt aus der Klappe und macht sie schnell wieder zu.|Dolores legt den Finger auf die Lippen: Das Geschäft lebt vom Rätsel.|Der Türke hat heute dreimal gewonnen. Ike ist müde.} #sprecher:erzaehler
-> END

=== dolores_lieferung ===
~ lieferungAbgegeben = true
Darlenes Kiste! Endlich Glühbirnen. Die halbe Lichterkette war dunkel. #sprecher:dolores #stimmung:froh
Sag Darlene, die Zuckerwatte geht aufs Haus. Und für dich ist auch was drin. #sprecher:dolores #stimmung:laechelt
-> END

// ---------------------------------------------------------------- Ansehen

=== riesenrad ===
{~Das Riesenrad dreht sich langsam. Von ganz oben sieht man die Kreuzung und die Prärie bis zum Horizont.|Eine Gondel schaukelt im Wind. Darin sitzt ein Paar und teilt sich eine Zuckerwatte.|Am Abend leuchten die Speichen des Riesenrads in allen Farben.} #sprecher:erzaehler
-> END

=== losbude ===
{~An der Losbude ruft Buster: „Jedes Los gewinnt! Fast jedes!“|Im Regal der Losbude sitzen Plüschbisons neben einem Schachbrett mit Glitzerfiguren.|Buster zählt Lose ab und verliert jedes Mal beim Zählen den Faden.} #sprecher:erzaehler
-> END
