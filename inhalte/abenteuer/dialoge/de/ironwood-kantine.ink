// Ort: Werkskantine von Ironwood, Stahlwerker-Club von Big Joe (Akt 2). Figuren: Big Joe, Hank,
// Priya, Mama. Gegenstände: Pokalregal, Stahlbrett.
//
// Szenen der Story-Bibel (Abschnitt 11): 39 erster Teil (Big Joe erkennt Lauries Kind, nennt die
// Elm Street: Start der Quest ironwood.mamasFinale), 43 Mamas Partie (Begegnung ironwood.mama;
// Mama kommt nach Ironwood, weil Oma Ruth sie angerufen hat), 44 Die Feier (Quest ironwood.feier,
// Big Joe abgelenkt), 46 Aufgabenreihe (Runden ironwood.reiheHank, ironwood.reihePriya),
// 48 Clubkampf (Begegnung ironwood.clubkampf).
// Einstiege wie in orte.json: big_joe, hank, priya, mama, pokalregal, stahlbrett. Die Quest
// ironwood.clubkampf wartet auf „big_joe“; dort steht deshalb vor dem Verzweigen eine Zeile.
//
// Variablen: reiheHankBestanden, reihePriyaBestanden, ausgangIronwoodMama,
// ausgangIronwoodClubkampf und nadelIronwood setzt die Hülle (R42); fotoGefunden setzt
// ironwood-mamas-zimmer.ink; elmStreetBekannt, mamaSpielt (Bibel, Szene 43) und die übrigen setzt
// diese Datei.

EXTERNAL beginnePartie(begegnung)
EXTERNAL beginneAufgaben(runde)
EXTERNAL setzeZustand(gegner, faktor, grund)

VAR held = "Du"
VAR bigJoeGetroffen = false
// L3 „Post für den Kapitän“ (14_Akt2_Leben_teil1, 4.3): Big Joe gibt nach Szene 39 einmal den
// Brief für Ruben in Lockport mit; lastkahnFrei setzt Lockport (niedrig-1), wenn Ruben ihn liest.
VAR briefFuerRuben = false
VAR lastkahnFrei = false
VAR elmStreetBekannt = false
VAR fotoGefunden = false
VAR mamaFotoGesehen = false
VAR mamaSpielt = false
VAR feierGesehen = false
VAR hankGetroffen = false
VAR priyaGetroffen = false
VAR reiheHankBestanden = false
VAR reihePriyaBestanden = false
VAR ausgangIronwoodMama = ""
VAR ausgangIronwoodClubkampf = ""
VAR nadelIronwood = 0
VAR clubkampfIronwoodNadel = 0
VAR pokalregalGesehen = false

// ---------------------------------------------------------------- Big Joe

=== big_joe ===
{~Der Ofen in der Ecke knackt, an den langen Tischen klappern Figuren.|Big Joe stellt Figuren auf sein Stahlbrett, so behutsam, als wären sie aus Glas.|Es riecht nach Kaffee, Eisen und nassen Jacken.} #sprecher:erzaehler
{
- not bigJoeGetroffen: -> big_joe_erkennt
- not briefFuerRuben and not lastkahnFrei: -> big_joe_brief
- nadelIronwood > clubkampfIronwoodNadel: -> big_joe_nach_sieg
- mamaSpielt and not feierGesehen and nadelIronwood == 0: -> feier_einladung
- not (reiheHankBestanden and reihePriyaBestanden): -> big_joe_reihe_offen
- nadelIronwood == 0 and ausgangIronwoodClubkampf == "niederlage": -> big_joe_nach_niederlage
- nadelIronwood == 0: -> big_joe_clubkampf
- else: -> big_joe_alltag
}

=== big_joe_erkennt ===
// Kapitel 25 (Roman): Big Joe erkennt Lauries Kind an der Art, wie es auf das Brett sieht. Bei
// der Frage setzt alles aus (Klangplan S35), danach kommt die Musik der Karte zurück.
~ bigJoeGetroffen = true
~ elmStreetBekannt = true
Am Ende des Raums, unter dem Pokalregal, sitzt ein Mann wie aus demselben Stück wie der Ofen. Vor ihm ein Schachbrett aus Stahl. #sprecher:erzaehler
Er setzt eine Figur hin, als wäre sie aus Glas. #sprecher:erzaehler
Eine Fesselung ist wie ein Kranhaken, Priya. Was dranhängt, kann nicht weg. #sprecher:bigJoe
Ein Spieß ist eine Fesselung von hinten. Statik. #sprecher:priya
Statik! #sprecher:bigJoe #stimmung:lacht
Er lacht, dass die Tassen klirren. Dann sieht er dich und hört auf. #sprecher:erzaehler
Er steht auf. Es dauert, bis er oben ist. #sprecher:erzaehler
Kumpel. Du hast ein Gesicht, das ich kenne. #sprecher:bigJoe
Die Augen. Wie du auf das Brett guckst, bevor du auf mich guckst. #sprecher:bigJoe
Bist du Lauries Kind? #sprecher:bigJoe #musik:aus #pause:3
* [„Laura. Sie heißt Laura.“]
- Laura. #sprecher:bigJoe
Sein großes Gesicht wird froh und traurig zugleich. #sprecher:erzaehler
Ja. Hier hieß sie Laurie. #sprecher:bigJoe #musik:karte
Er heißt Big Joe. Er sagt es wie einen Dienstgrad. Kranführer, dreißig Jahre, und ebenso lange der Club. #sprecher:erzaehler
Steckt sie noch die Hände in die Ärmel? Wenn sie nachdenkt? #sprecher:bigJoe
* [„Ja.“]
- Du hast nie darüber nachgedacht. #sprecher:erzaehler
Im Pokalregal hinter ihm stehen die Pokale dicht an dicht. Nur an einer Stelle nicht. #sprecher:erzaehler
Elm Street. Nummer zehn, das Eckhaus mit dem grünen Geländer. #sprecher:bigJoe
Geh hin. Sie wartet seit fünfundzwanzig Jahren, dass jemand klingelt. #sprecher:bigJoe
Und wenn du deine Mutter siehst: Big Joe lässt grüßen. #sprecher:bigJoe
Und dass es ihm leidtut. #sprecher:bigJoe #stimmung:ernst
Um die Nadel spielen? Erst Hank, dann Priya, dann ich. #sprecher:bigJoe
Was tut ihm leid? #sprecher:juno
Du weißt es nicht. #sprecher:erzaehler
-> END

=== big_joe_reihe_offen ===
{not reiheHankBestanden:
    Erst Hank, Kumpel. Er redet wenig, aber seine Fesselungen reden für ihn. #sprecher:bigJoe
- else:
    Hank hast du geschafft. Jetzt Priya. Sie rechnet Spieße wie Brücken. #sprecher:bigJoe
}
-> END

=== big_joe_clubkampf ===
{feierGesehen:
    Big Joe gähnt so laut, dass die Tassen klirren. „Die Feier war lang, Kumpel.“ #sprecher:erzaehler
}
{mamaSpielt:
    Mama sitzt am Rand und sagt nur einen Satz: „Grundreihe. Immer die Grundreihe.“ #sprecher:erzaehler
}
Um die Nadel, Kumpel? Auf meinem Stahlbrett. Das hält. #sprecher:bigJoe
* [„Ich bin bereit.“]
    Er nagelt Figuren fest wie ein Kranhaken. Aber hinter seinem König sieht er nicht gut. #sprecher:ambrose
    ~ beginnePartie("ironwood.clubkampf")
    -> END
* [„Noch nicht.“]
    Das Stahlbrett wartet. Es rostet nicht. #sprecher:bigJoe
    -> END

=== big_joe_nach_niederlage ===
Gut gekämpft, Kumpel. Aber die Kantine bleibt meine. Noch eine? #sprecher:bigJoe
* [„Noch eine.“]
    ~ beginnePartie("ironwood.clubkampf")
    -> END
* [„Später.“]
    -> END

=== big_joe_nach_sieg ===
~ clubkampfIronwoodNadel = nadelIronwood
{ausgangIronwoodClubkampf == "remis":
    Remis. Ehrlich verdient. #sprecher:bigJoe
    Die Bronzenadel gehört dir. Noch eine Runde, wenn du willst. #sprecher:bigJoe
- else:
    Kumpel, du hast mich auf meiner eigenen Grundreihe erwischt. Wie jemand, den ich mal kannte. #sprecher:bigJoe #stimmung:froh
}
{feierGesehen:
    Revanche, wenn ich ausgeschlafen bin! #sprecher:bigJoe #stimmung:froh
}
Die vierte Nadel. Und wieder ein Mentor-Zug. #sprecher:ambrose
Ich habe dir das Wertvollste gegeben, das ich habe. #sprecher:ambrose
Draußen am Werkstor stehen Männer in Anzügen. Big Joe sieht hinaus und wird still. #sprecher:erzaehler
-> END

=== big_joe_brief ===
Big Joe zieht einen zerknitterten Umschlag aus der Brusttasche. #sprecher:erzaehler
Kumpel, fährst du am Kanal entlang? Bring das Ruben in Lockport. Der Mann hat seit dem Sommer keine Fracht. #sprecher:bigJoe
~ briefFuerRuben = true
-> END

=== big_joe_alltag ===
{~Kumpel, die Kantine war dreißig Jahre unser Wohnzimmer.|Laurie spielt wieder. Ich hätte nicht gedacht, dass ich das noch erlebe.|Eine Fesselung ist wie ein Kranhaken: Was dranhängt, kann nicht weg.} #sprecher:bigJoe
+ {nadelIronwood > 0 and nadelIronwood < 3} [„Revanche um eine bessere Nadel?“]
    Immer, Kumpel. #sprecher:bigJoe
    ~ beginnePartie("ironwood.clubkampf")
    -> END
+ [„Bis später, Big Joe.“]
    -> END

// ---------------------------------------------------------------- Die Feier

=== feier_einladung ===
Heute wird gefeiert, Kumpel! Laurie ist zurück. #sprecher:bigJoe #stimmung:froh
Bleibst du? Wird spät. #sprecher:bigJoe
* [„Ich bleibe.“]
    -> feier
* [„Ich gehe lieber früh.“]
    Kluger Mensch. Morgen ist auch noch ein Tag. #sprecher:bigJoe
    -> END

=== feier ===
~ feierGesehen = true
Hank holt eine Gitarre, Priya erklärt Juno die Statik einer Brücke mit Zuckerstücken. Mama lacht. #sprecher:erzaehler
Um Mitternacht erzählt Big Joe noch Geschichten vom Werk, vom Club und von Laurie mit siebzehn. #sprecher:erzaehler
~ setzeZustand("ironwood.bigJoe", 1.4, "zustand.schlechtGeschlafen")
Du hast das nicht geplant, {held}. Aber morgen wird er müde sein. #sprecher:ambrose
Das ist kein Trick. Das ist ein Fest. #sprecher:ambrose
-> END

// ---------------------------------------------------------------- Mama

=== mama ===
{
- not fotoGefunden:
    Am Tisch am Fenster ist ein Platz frei. Big Joe stellt dort nie jemanden hin. #sprecher:erzaehler
    -> END
- not mamaFotoGesehen: -> mama_foto
- ausgangIronwoodMama == "" or ausgangIronwoodMama == "abgebrochen": -> mama_partie_angebot
- not mamaSpielt: -> mama_nach_partie
- else: -> mama_alltag
}

=== mama_foto ===
~ mamaFotoGesehen = true
Die Tür geht auf. Mama steht im Mantel da, noch im Schwesternkittel darunter. #sprecher:erzaehler
„Oma Ruth hat angerufen.“ #sprecher:erzaehler
Du zeigst ihr das Foto aus der Elm Street. #sprecher:erzaehler
* [„Ich hab das gefunden.“]
    Sie nimmt das Foto. Lange sagt sie nichts. #sprecher:erzaehler #pause
* [„Big Joe lässt grüßen. Und es tut ihm leid.“]
    Sie sieht zu Big Joe hinüber. Er sieht auf den Boden. #sprecher:erzaehler #pause
- Ich hab den Läufer nicht gesehen. Im Finale, Zug dreiunddreißig. Ein Spieß. Fünfundzwanzig Jahre, und ich sehe ihn jede Nacht. #sprecher:mutter #stimmung:ernst
Danach hab ich nie wieder eine Figur angefasst. Ich wollte nicht, dass dir das auch passiert. #sprecher:mutter
Big Joe kommt herüber. Die beiden umarmen sich, ohne ein Wort. #sprecher:erzaehler
-> mama_partie_angebot

=== mama_partie_angebot ===
Gut. Eine Partie. #sprecher:mutter
Hier, in diesem Raum. Aber wenn ich gewinne, räumst du die Spülmaschine aus. #sprecher:mutter
* [„Abgemacht.“]
    Deine Mutter, wenn ich das sagen darf, setzt sich wie jemand, der nie aufgehört hat. #sprecher:ambrose
    ~ beginnePartie("ironwood.mama")
    -> END
* [„Gleich, Mama.“]
    Ich laufe nicht weg. Nicht mehr. #sprecher:mutter
    -> END

=== mama_nach_partie ===
~ mamaSpielt = true
{ausgangIronwoodMama == "sieg":
    Mama lacht und weint gleichzeitig. #sprecher:erzaehler
    Du hast mich mit einem Spieß erwischt. Natürlich. #sprecher:mutter
    Kumpel, das war ihr Fehler von damals. Jetzt ist er erledigt. #sprecher:bigJoe
- else:
    Ich hab ihn gesehen. Den Läufer. Diesmal hab ich ihn gesehen. #sprecher:mutter
    Sie muss sich setzen. Big Joe bringt ihr einen Kaffee. #sprecher:erzaehler
}
Ab jetzt fahre ich mit zu den Turnieren. Jemand muss ja auf die Zeit achten. #sprecher:mutter #stimmung:froh
Du spielst zu langsam. #sprecher:mutter
Deine Mutter, wenn ich das sagen darf, spielt besser, als sie lügt. #sprecher:ambrose #stimmung:lacht
Juno klebt das Foto ins Tagebuch. Mit Glitzer. Diesmal ja. #sprecher:juno #stimmung:froh
-> END

=== mama_alltag ===
{~Grundreihe. Immer die Grundreihe. Sag das Joe nicht.|Ich hab mir ein Taschenschach gekauft. Für die Nachtschicht.|Fünfundzwanzig Jahre. Und die Figuren fühlen sich an wie gestern.} #sprecher:mutter
-> END

// ---------------------------------------------------------------- Hank und Priya

=== hank ===
{
- not hankGetroffen:
    ~ hankGetroffen = true
    Ein Mann im Blaumann sitzt allein am Ende des Tischs und schiebt eine Figur hin und her. #sprecher:erzaehler
    Hank. Gefesselt. #sprecher:hank
    Nicht bewegen. Wie ich nach der Nachtschicht. #sprecher:hank
    -> hank_reihe
- not reiheHankBestanden: -> hank_reihe
- else:
    {~Gut gemacht. Mehr sag ich nicht.|Nachtschicht. Danach Schach. Danach schlafen. Meistens.} #sprecher:hank
    -> END
}

=== hank_reihe ===
Fesselungen. Willst du? #sprecher:hank
* [„Ja.“]
    ~ beginneAufgaben("ironwood.reiheHank")
    -> END
* [„Gleich.“]
    -> END

=== priya ===
{
- not priyaGetroffen:
    ~ priyaGetroffen = true
    Eine junge Frau mit Bauhelm und Notizbuch winkt dir zu. Im Notizbuch: Brücken und Schachdiagramme. #sprecher:erzaehler
    Priya. Werkstudentin. #sprecher:priya #stimmung:froh
    Ich will mal Brücken bauen. Und Spieße sind wie eine Statik-Rechnung! #sprecher:priya
    {reiheHankBestanden: -> priya_reihe}
    Aber erst Hank. Big Joe will das so. Ingenieurwesen: erst das Fundament. #sprecher:priya
    -> END
- not reiheHankBestanden:
    Erst Hank, dann ich. Fundament zuerst! #sprecher:priya
    -> END
- not reihePriyaBestanden: -> priya_reihe
- else:
    {~Ein Spieß ist eine Fesselung von hinten. Statik!|Erst das Wertvolle angreifen, dann das dahinter nehmen. Ingenieurwesen.|Die Brücke über den Kanal ist alt, aber gut gerechnet. Wer die wohl gebaut hat?} #sprecher:priya
    -> END
}

=== priya_reihe ===
Spieße und scheinbarer Schutz. Bereit für ein bisschen Statik? #sprecher:priya
* [„Bereit.“]
    ~ beginneAufgaben("ironwood.reihePriya")
    -> END
* [„Gleich.“]
    -> END

// ---------------------------------------------------------------- Gegenstände

=== pokalregal ===
{pokalregalGesehen:
    Die Lücke im Regal ist noch da, so breit wie eine Hand. Darunter das Messingschild: 2001. #sprecher:erzaehler
    -> END
}
~ pokalregalGesehen = true
Im Pokalregal stehen dreißig Jahre Werksclub, dicht an dicht. #sprecher:erzaehler
Nur an einer Stelle nicht. Eine Lücke, so breit wie eine Hand. Darunter ein Schildchen aus Messing: 2001. #sprecher:erzaehler #bild:pokalluecke_2001
-> END

=== stahlbrett ===
Ein Schachbrett aus Stahl. Die Felder hell geschliffen und dunkel angelassen, die Schweißnähte am Rand dick wie Finger. #sprecher:erzaehler #bild:stahlbrett
Stahl für das Brett, Holz für die Figuren. Ein Mann, der weiß, was hart sein muss und was nicht. #sprecher:ambrose
-> END
