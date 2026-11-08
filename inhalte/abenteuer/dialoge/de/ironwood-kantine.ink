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
- nadelIronwood > clubkampfIronwoodNadel: -> big_joe_nach_sieg
- mamaSpielt and not feierGesehen and nadelIronwood == 0: -> feier_einladung
- not (reiheHankBestanden and reihePriyaBestanden): -> big_joe_reihe_offen
- nadelIronwood == 0 and ausgangIronwoodClubkampf == "niederlage": -> big_joe_nach_niederlage
- nadelIronwood == 0: -> big_joe_clubkampf
- else: -> big_joe_alltag
}

=== big_joe_erkennt ===
~ bigJoeGetroffen = true
~ elmStreetBekannt = true
Ein riesiger Mann in Arbeitsjacke kommt auf dich zu, bleibt stehen und sieht dich lange an. #sprecher:erzaehler
Kumpel, du hast ein Gesicht, das ich kenne. #sprecher:bigJoe #pause
Bist du Lauries Kind? #sprecher:bigJoe #stimmung:ernst
* [„Laurie? Meine Mama heißt Laura.“]
    Laura. Für mich war sie immer Laurie. #sprecher:bigJoe
    Die beste Spielerin, die dieser Club je hatte. #sprecher:bigJoe
* [„Woher kennen Sie meine Mama?“]
    Ich war ihr Trainer. Hier, in dieser Kantine. Lange her. #sprecher:bigJoe
- Er zeigt auf das Pokalregal. Zwischen den Pokalen ist eine Lücke, als hätte dort einer gestanden. #sprecher:erzaehler
Ihre Mutter wohnt noch in der Elm Street. Sag Laurie, Big Joe lässt grüßen. #sprecher:bigJoe
Und dass es ihm leidtut. #sprecher:bigJoe
Und wenn du um die Nadel spielen willst: erst Hank, dann Priya, dann ich. #sprecher:bigJoe
Ein Trainer, der sich entschuldigen will. Das ist ein Mann, der lange getragen hat. #sprecher:ambrose
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
    Ihre Mutter, wenn ich so sagen darf, setzt sich wie jemand, der nie aufgehört hat. #sprecher:ambrose
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
Ihre Mutter, wenn ich so sagen darf, spielt besser, als sie lügt. #sprecher:ambrose #stimmung:lacht
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
    Die Lücke im Regal ist noch da. Ein Staubrand zeigt, wo der Pokal stand. #sprecher:erzaehler
    -> END
}
~ pokalregalGesehen = true
Im Pokalregal stehen dreißig Jahre Werksclub. Auf einem Schild unter einer Lücke steht: „Jugendmeisterschaft 2001“. #sprecher:erzaehler
-> END

=== stahlbrett ===
Ein Schachbrett aus Stahlplatten, selbst geschweißt, die Felder abwechselnd blank und geschwärzt. Die Figuren sind aus Holz. #sprecher:erzaehler
Stahl für das Brett, Holz für die Figuren. Ein Mann, der weiß, was hart sein muss und was nicht. #sprecher:ambrose
-> END
