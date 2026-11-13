// Ort: Werkskantine von Ironwood, Stahlwerker-Club von Big Joe (Akt 2). Figuren: Big Joe, Hank,
// Priya, Mama. Gegenstände: Pokalregal, Stahlbrett.
//
// Szenen der Story-Bibel (Abschnitt 11): 39 erster Teil (Big Joe erkennt Lauries Kind, nennt die
// Elm Street: Start der Quest ironwood.mamasFinale), 43 Mamas Partie (Begegnung ironwood.mama;
// Mama sieht das Foto zu Hause, maple-falls-wohnzimmer.mama_foto, und kommt zur Partie), 44 Die Feier (Quest ironwood.feier,
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
// Kapitel 27 (Roman): Mama kommt in die Kantine, Big Joe hält sie fest.
VAR mamaInKantine = false
VAR morgenNachFeier = false
// Gutachten L1.3: Wer die Feier ablehnt, bekommt sie nicht noch einmal angeboten.
VAR feierAbgelehnt = false
VAR turnierheftBekommen = false

// ---------------------------------------------------------------- Big Joe

=== big_joe ===
{~Der Ofen in der Ecke knackt, an den langen Tischen klappern Figuren.|Big Joe stellt Figuren auf sein Stahlbrett, so behutsam, als wären sie aus Glas.|Es riecht nach Kaffee, Eisen und nassen Jacken.} #sprecher:erzaehler
{
- not bigJoeGetroffen: -> big_joe_erkennt
- not briefFuerRuben and not lastkahnFrei: -> big_joe_brief
- nadelIronwood > clubkampfIronwoodNadel: -> big_joe_nach_sieg
- ausgangIronwoodMama != "" and ausgangIronwoodMama != "abgebrochen" and not mamaSpielt: -> mama_nach_partie
- not (reiheHankBestanden and reihePriyaBestanden): -> big_joe_reihe_offen
- nadelIronwood == 0 and not mamaSpielt: -> big_joe_wartet
- mamaSpielt and not feierGesehen and not feierAbgelehnt and nadelIronwood == 0: -> feier_einladung
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
Im Pokalregal hinter ihm stehen die Pokale dicht an dicht. Nur an einer Stelle nicht. Eine Lücke, so breit wie eine Hand. Darunter ein Schildchen aus Messing: 2001. #sprecher:erzaehler
Elm Street. Nummer zehn, das Eckhaus mit dem grünen Geländer. #sprecher:bigJoe
Geh hin. Sie wartet seit fünfundzwanzig Jahren, dass jemand klingelt. #sprecher:bigJoe
Und wenn du deine Mutter siehst: Big Joe lässt grüßen. #sprecher:bigJoe
Und dass es ihm leidtut. #sprecher:bigJoe #stimmung:ernst #pause:2
Was tut ihm leid? #sprecher:juno
Du weißt es nicht. #sprecher:erzaehler
-> END

=== big_joe_reihe_offen ===
{not reiheHankBestanden:
    Um die Nadel? Erst Hank, dann Priya, dann ich. Hank redet wenig, aber seine Fesselungen reden für ihn. #sprecher:bigJoe
- else:
    Hank hast du geschafft. Jetzt Priya. Sie rechnet Spieße wie Brücken. #sprecher:bigJoe
}
-> END

// Gutachten L1.3: Der Clubkampf kommt erst nach Mamas Partie (Roman, Kapitel 27 vor 28).
=== big_joe_wartet ===
{~Hank und Priya hast du geschafft. Mich noch nicht. Aber nicht heute, Kumpel.|Das Stahlbrett wartet. Ich weiß nur noch nicht, worauf.|Am Tisch am Fenster ist ein Platz frei. Den stell ich keinem hin.} #sprecher:bigJoe
-> END

=== big_joe_clubkampf ===
// Kapitel 28 (Roman): der Morgen nach der Feier, dann der Schraubstock. Nadel: Zahnrad mit Turm.
{feierGesehen and not morgenNachFeier: -> morgen}
-> brett

= morgen
~ morgenNachFeier = true
Big Joe hat Ringe unter den Augen wie Kohlestriche. Er hält sich an seinem Kaffee fest. #sprecher:erzaehler #musik:aus
Kumpel, ich hab drei Stunden geschlafen. Wenn ich heute verliere, liegt es an deiner Mutter und am Schinken. #sprecher:bigJoe #stimmung:muede
* [„Sie können es verschieben.“]
    Verschieben! Hier wird nicht verschoben. Hier wird geschichtet. #sprecher:bigJoe
* [Nicken]
- -> brett

= brett
Die Nadel liegt auf dem Stahlbrett. Ein kleines Zahnrad aus dunklem Metall, mit einem Turm in der Mitte. #sprecher:erzaehler
Mama sitzt in der ersten Reihe. Zum ersten Mal sieht sie dir zu. Sie beugt sich vor und sagt zwei Wörter, so leise, dass nur du sie hörst. #sprecher:erzaehler
Grundreihe. Immer. #sprecher:mutter
Um die Nadel, Kumpel? Auf meinem Stahlbrett. #sprecher:bigJoe
* [„Ich bin bereit.“]
    ~ beginnePartie("ironwood.clubkampf")
    -> END
* [„Noch nicht.“]
    Das Stahlbrett wartet. Es rostet nicht. #sprecher:bigJoe
    -> END

=== big_joe_nach_niederlage ===
Was dranhängt, kann nicht weg, Kumpel. Noch eine? #sprecher:bigJoe
* [„Noch eine.“]
    ~ beginnePartie("ironwood.clubkampf")
    -> END
* [„Nicht jetzt.“]
    -> END

=== big_joe_nach_sieg ===
// Kapitel 28, Schluss: „Ach, Kumpel“ ohne Musik; Fanfare beim Anstecken der Nadel, dann brüllt die
// Kantine; „Es war schön … Beides.“ mit ambrose.mama (Gutachten L1.7). Der Mentor-Zug kommt still
// über die Quest. Der Kauf folgt erst neun Tage später (ironwood-aussen.kauf).
~ clubkampfIronwoodNadel = nadelIronwood
{ausgangIronwoodClubkampf == "remis":
    Remis. Ehrlich verdient, Kumpel. #sprecher:bigJoe
    Er steckt dir das Zahnrad an die Jacke, neben die anderen Nadeln. #sprecher:erzaehler #klang:fanfare
    {feierGesehen: Revanche, wenn ich ausgeschlafen bin! #sprecher:bigJoe #stimmung:froh}
    Es hat gestimmt. Das Schöne holen wir nach. #sprecher:ambrose #stimmung:lachtOhneSpott
    -> END
}
Ach, Kumpel. Ach, Kumpel. #sprecher:bigJoe #stimmung:muede #musik:aus
Er legt seinen König um, mit einem Finger. Auf dem Stahl klingt es leise. #sprecher:erzaehler #pause
In der ersten Reihe hat Mama beide Hände vor dem Mund. #sprecher:erzaehler
Grundreihe. Du hast es dem Kumpel gesagt, Laurie. Dreißig Jahre, und du kennst mich immer noch. #sprecher:bigJoe #stimmung:froh
Er steckt dir das Zahnrad an die Jacke, neben die anderen Nadeln. #sprecher:erzaehler #klang:fanfare
{feierGesehen:
    Revanche, wenn ich ausgeschlafen bin! #sprecher:bigJoe #stimmung:froh
}
Die Kantine brüllt. #sprecher:erzaehler
Auf dem Weg hinaus, im Lärm, sagt Ambrose etwas. Du verstehst es fast nicht. #sprecher:erzaehler #pause
Es war schön. Und es hat gestimmt. Beides. #sprecher:ambrose #stimmung:still #musik:ambrose.mama
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
    ~ feierAbgelehnt = true
    Kluger Mensch. Morgen ist auch noch ein Tag. #sprecher:bigJoe
    -> END

=== feier ===
// Kapitel 28 (Roman): das Fest; bei Big Joes Pokal wird es kurz leise.
~ feierGesehen = true
Jemand holt einen Schinken aus dem Kühlraum. Priya steigt auf einen Stuhl und hält eine Rede über Tragwerke. Alle klatschen. #sprecher:erzaehler #musik:ironwood.feier
Hank, der sonst drei Wörter am Tag sagt, erzählt Mama, was aus jedem geworden ist. Der Reihe nach, mit Jahreszahlen. #sprecher:erzaehler
Laurie kam mit neun zum ersten Mal her, an der Hand ihres Vaters. Hat das Stahlbrett angefasst und gesagt: Das ist kalt. #sprecher:bigJoe #stimmung:froh
Den Pokal von 2001 hatte ich schon gekauft. Vorher. So sicher war ich. #sprecher:bigJoe
Wo ist er? #sprecher:mutter #musik:aus
Im Schrank. Bei mir zu Hause. Ich hab ihn nicht zurückgeben können. Und hinstellen auch nicht. #sprecher:bigJoe #stimmung:traurig
Mama legt ihm die Hand auf den Arm. Mehr nicht. #sprecher:erzaehler #pause:2
Du hast Mama noch nie so gesehen: rote Wangen, die Ärmel hochgeschoben, mitten unter Leuten, die sie Laurie nennen. #sprecher:erzaehler #musik:ironwood.feier
Um eins singt jemand. Um halb zwei schläft Juno auf zwei Stühlen. #sprecher:erzaehler
~ setzeZustand("ironwood.bigJoe", 1.4, "zustand.schlechtGeschlafen")
-> END

// ---------------------------------------------------------------- Mama

=== mama ===
{
- not mamaFotoGesehen:
    Am Tisch am Fenster ist ein Platz frei. Big Joe stellt dort nie jemanden hin. #sprecher:erzaehler
    -> END
- not mamaInKantine: -> mama_ankunft
- ausgangIronwoodMama == "" or ausgangIronwoodMama == "abgebrochen": -> mama_partie_angebot
- not mamaSpielt: -> mama_nach_partie
- else: -> mama_alltag
}

// Kapitel 27, zweiter Teil (Roman): Stille beim Eintreten, dann das Ironwood-Thema warm.
=== mama_ankunft ===
~ mamaInKantine = true
Ihr fahrt am Samstag, mit dem Wagen, Juno auf der Rückbank. Mama redet die ganze Fahrt über das Wetter. An der Eisenbrücke wird sie still. #sprecher:erzaehler
Vor dem Haus mit dem grünen Geländer bleibt sie eine Minute sitzen, die Hände am Lenkrad. #sprecher:erzaehler #pause:2
Was sie und Oma Ruth an der Tür sagen, weißt du nicht. Du bleibst im Wagen. Manche Dinge gehören einem nicht. #sprecher:erzaehler
In der Kantine bullert der Ofen. Sie sind alle da, Hank und Priya und ein Dutzend andere in Arbeitsjacken. Als Mama in der Tür steht, wird es still wie in einer Kirche. #sprecher:erzaehler #musik:aus
Big Joe steht auf. Er sagt nichts. Sie sagt nichts. #sprecher:erzaehler
Sie geht durch den ganzen langen Raum. Er kommt ihr drei Schritte entgegen und hält sie fest, als könnte sie zerbrechen. #sprecher:erzaehler #pause:2
Laurie. #sprecher:bigJoe
Du hättest noch mal klingeln können. #sprecher:mutter
Ich weiß. #sprecher:bigJoe
Ich hätte aufgemacht. #sprecher:mutter
Ich weiß. Jetzt. #sprecher:bigJoe #musik:karte
-> mama_partie_angebot

=== mama_partie_angebot ===
Am Stahlbrett. Mama hat Weiß. Sie sieht die Figuren an, eine nach der anderen, als müsste sie sich an ihre Namen erinnern. #sprecher:erzaehler
* [„Ich bin bereit.“]
    Ihre Hand zittert, als sie den ersten Bauern anfasst. Damenbauer, zwei Felder. Dann der daneben. #sprecher:erzaehler
    Damengambit. Hat sie von mir. #sprecher:bigJoe #stimmung:froh
    ~ beginnePartie("ironwood.mama")
    -> END
* [„Gleich, Mama.“]
    Ich laufe nicht weg. Nicht mehr. #sprecher:mutter
    -> END

=== mama_nach_partie ===
// Nach der Partie nur Ergebnis, Heft und „Ab jetzt fahre ich mit“ (Gutachten L1.1); der Moment
// selbst liegt in der Partie (mama_moment_angriff).
~ mamaSpielt = true
{ausgangIronwoodMama:
- "sieg":
    Ihr habt zu Ende gespielt. Du hast gewonnen. Es ist das Einzige an diesem Tag, das nicht wichtig ist. #sprecher:erzaehler
- "remis":
    Ihr habt zu Ende gespielt. Remis. Es ist das Einzige an diesem Tag, das nicht wichtig ist. #sprecher:erzaehler
- else:
    Ihr habt zu Ende gespielt. Mama hat gewonnen. Es ist das Einzige an diesem Tag, das nicht wichtig ist. #sprecher:erzaehler
}
{turnierheftBekommen: -> heft_satz ->}
Und ab jetzt fahre ich mit. Zu den Turnieren. Jemand muss ja auf die Zeit achten. #sprecher:mutter #stimmung:froh
Du spielst zu langsam. #sprecher:mutter
Deine Mutter, wenn ich das sagen darf, spielt besser, als sie lügt. #sprecher:ambrose #stimmung:lachtOhneSpott
Juno klebt das Foto ins Tagebuch. Mit Glitzer. Diesmal ja. #sprecher:juno #stimmung:froh
-> END

// ---------------------------------------------------------------- Partiemomente (Roman, Kap. 27/28)
// Feste Momente in den Partien (begegnungen.json, momente). Sie sagen nichts über die Stellung,
// was nicht in jeder Partie stimmt: Die Engine wartet nicht auf das Bild aus dem Roman.

=== mama_moment_rost ===
Mama wird langsamer. Sie rechnet, zieht die Hand zurück und sagt ein Wort, das du von ihr nicht kennst. #sprecher:erzaehler
Eingerostet. Wie ein altes Tor. #sprecher:mutter #stimmung:lachtOhneSpott
Schmieröl ist im Schrank. #sprecher:bigJoe
-> END

=== mama_moment_angriff ===
// Gutachten L1.1: Das Bild von 2001 und „Ich hab ihn gesehen“ fallen in der Partie, unabhängig vom
// Ausgang; als Einblendung, nicht als Aussage über die Stellung der Engine.
Ihre Figuren rücken vor, eine nach der anderen, schön und entschlossen, auf deinen König zu. #sprecher:erzaehler
Im dreißigsten Zug siehst du es. Ihre Dame, weit vorn. Dahinter, auf derselben Schräge, das Feld, auf das ihr Turm will. Und dein Läufer, in der Ecke. #sprecher:erzaehler #musik:aus #bild:schraege
Dir wird kalt. Nicht genau dieselbe Stellung. Aber dasselbe Bild. #sprecher:erzaehler #pause:2
* [„Ambrose.“]
- Ich sehe es. #sprecher:ambrose
* [„Was mache ich?“]
- Er schweigt. Der Ofen bullert. #sprecher:erzaehler #pause:2
Du spielst Schach. Mit deiner Mutter. Sie ist nicht hergekommen, um geschont zu werden. #sprecher:ambrose #bild:aus
Mama hat den Turm schon berührt. Dann hält sie inne. #sprecher:erzaehler
Sie sieht nicht auf ihren Angriff. Ihr Blick geht die Schräge entlang, Feld für Feld, bis in deine Ecke. #sprecher:erzaehler #pause:3
Big Joe hat die Augen zugemacht. Mama nimmt die Hand vom Turm. #sprecher:erzaehler
Ich hab ihn gesehen. Den Läufer. Diesmal hab ich ihn gesehen. #sprecher:mutter #musik:mama.vollstaendig #stimmung:hatIhnGesehen
Sie hält sich mit beiden Händen an der Tischkante fest. Big Joes Augen sind nass, und es ist ihm vollkommen gleichgültig. #sprecher:erzaehler
-> END

=== clubkampf_schraubstock ===
Er stellt eine Figur hin, und sie bleibt dort. Dann die nächste daneben. Jede hält eine von deinen fest. #sprecher:erzaehler
Was dranhängt, kann nicht weg. #sprecher:bigJoe
Das ist auch Schach. Kein Funken. Kein einziger. Und doch steht alles genau, wo es stehen muss. #sprecher:ambrose #pause
Der Brückenbauer hätte ihn gemocht. #sprecher:ambrose #stimmung:still #pause
-> END

=== clubkampf_stimmt_es ===
// Gutachten L1.5: die Wahlen hintereinander, damit „Dann spiel es.“ immer fällt.
Big Joe reibt sich das Gesicht mit beiden Händen. Als er sie wegnimmt, braucht er einen Moment, bis er das Brett wiederfindet. #sprecher:erzaehler
Grundreihe. Immer. #sprecher:erzaehler
Stimmt es? #sprecher:ambrose #musik:aus #pause:2
Diesmal fragt er. Nicht du. #sprecher:erzaehler
* [Zählen. Dreimal.]
- * [„Es stimmt.“]
- Dann spiel es. #sprecher:ambrose #stimmung:froh
Und sieh ihm dabei ins Gesicht. Das ist die Hälfte. #sprecher:ambrose
-> END

// Kapitel 27: Mamas Satz unter dem Finale (Tunnel, nur mit dem blauen Heft).
=== heft_satz ===
Mama schlägt das blaue Heft auf und nimmt Hank einen Kugelschreiber aus der Brusttasche, ohne zu fragen. #sprecher:erzaehler
Unter „Finale. 12. Mai 2001“ schreibt sie einen einzigen Satz: „Es passiert jedem. Auch mir.“ #sprecher:erzaehler #bild:heft_neuer_satz
Sie blättert um. Auf der nächsten Seite stehen drei Sätze in deiner Schrift. #sprecher:erzaehler #bild:aus
Du schreibst ja in mein Heft. #sprecher:mutter
* [„Oma hat gesagt …“]
- Ich weiß, was Oma gesagt hat. Schreib weiter. #sprecher:mutter
->->

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
