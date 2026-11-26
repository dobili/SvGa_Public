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
EXTERNAL gibKarte(kennung)

VAR clubkampfIronwoodAngesagt = false
VAR mamaMomentGesehen = false
VAR schraubstockGesehen = false
VAR stimmtEsGesehen = false
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
// kaufGesehen setzt ironwood-aussen.ink (Szene 49, der Kauf). Danach zeigt die Karte das Logo über
// der Ausgabe und den Karton mit den Pokalen an der Tür; die Texte folgen dem.
VAR kaufGesehen = false
VAR morgenNachFeier = false
// Gutachten L1.3: Wer die Feier ablehnt, bekommt sie nicht noch einmal angeboten.
VAR feierAbgelehnt = false
VAR turnierheftBekommen = false
// Lernkarte Faktorenwaage (mama_karte); hatKarteFaktorenwaage setzt die Hülle aus dem Besitz.
VAR lernkarteFaktorenwaage = false
VAR hatKarteFaktorenwaage = false
// Aus capital-arena-aussen.ink: Nach dem Abschied (Szene 109) spricht Ambrose nicht mehr
// (Story-Bibel Abschnitt 33, Frage 5; Entscheidung Q21-5). Hier nur gelesen.
VAR abschiedGesehen = false
// Läuft eine Revanche um eine bessere Nadel? Dann reagiert big_joe_nach_revanche auf den Ausgang.
VAR revancheIronwood = false
// Die Figur hat den Helden angesprochen, nicht umgekehrt (App: regeln/ansprechen.ts, 25.11.2026).
VAR angesprochen = false

// ---------------------------------------------------------------- Big Joe

=== big_joe ===
// Lektorat Akt 2 (17.11.2026): Vor „Ach, Kumpel“ baut Big Joe nicht noch einmal auf, und nach dem
// Kauf klappern keine Figuren mehr an den langen Tischen. Das Bild vom Glas bleibt dem ersten Treffen.
{
- kaufGesehen:
    Über der Essensausgabe hängt das weiße Logo. An der Tür stehen noch drei Kartons, zugeklebt. #sprecher:erzaehler
// Lektorat 19.11.2026: Vor dem ersten Treffen fällt sein Name nicht, und am Morgen nach der Feier
// baut er nicht behutsam auf, er hält sich am Kaffee fest.
- not bigJoeGetroffen or (feierGesehen and not morgenNachFeier):
    Der Ofen in der Ecke knackt, an den langen Tischen klappern Figuren. #sprecher:erzaehler
- nadelIronwood > clubkampfIronwoodNadel:
    Es riecht nach Kaffee, Eisen und nassen Jacken. #sprecher:erzaehler
- else:
    {~Der Ofen in der Ecke knackt, an den langen Tischen klappern Figuren.|Big Joe stellt Figuren auf sein Stahlbrett, eine nach der anderen. Es klirrt kein einziges Mal.|Es riecht nach Kaffee, Eisen und nassen Jacken.} #sprecher:erzaehler
}
{
- not bigJoeGetroffen: -> big_joe_erkennt
- not briefFuerRuben and not lastkahnFrei: -> big_joe_brief
- nadelIronwood > clubkampfIronwoodNadel: -> big_joe_nach_sieg
- revancheIronwood: -> big_joe_nach_revanche
- kaufGesehen: -> big_joe_nach_kauf
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
{angesprochen:Vom Pokalregal kommt ein Mann herüber wie aus demselben Stück wie der Ofen. Er stellt ein Schachbrett aus Stahl vor dir ab.|Am Ende des Raums, unter dem Pokalregal, sitzt ein Mann wie aus demselben Stück wie der Ofen. Vor ihm ein Schachbrett aus Stahl.} #sprecher:erzaehler
Er setzt eine Figur hin, als wäre sie aus Glas. #sprecher:erzaehler
Eine Fesselung ist wie ein Kranhaken, Priya. Was dranhängt, kann nicht weg. #sprecher:bigJoe #stimmung:laechelt #brett:fesselung
Ein Spieß ist eine Fesselung von hinten. Statik. #sprecher:priya #stimmung:nachdenklich #brett:turmspiess.1
Statik! #sprecher:bigJoe #stimmung:lacht
Er lacht, dass die Tassen klirren. Dann sieht er dich und hört auf. #sprecher:erzaehler
Er steht auf. Es dauert, bis er oben ist. #sprecher:erzaehler
Kumpel. Du hast ein Gesicht, das ich kenne. #sprecher:bigJoe #stimmung:ueberrascht
Die Augen. Wie du auf das Brett guckst, bevor du auf mich guckst. #sprecher:bigJoe #stimmung:nachdenklich
Bist du Lauries Kind? #sprecher:bigJoe #stimmung:ueberrascht #musik:aus #pause:3
* [„Laura. Sie heißt Laura.“]
- Laura. #sprecher:bigJoe #stimmung:nachdenklich
Sein großes Gesicht wird froh und traurig zugleich. #sprecher:erzaehler
Ja. Hier hieß sie Laurie. #sprecher:bigJoe #stimmung:laechelt #musik:karte
Er heißt Big Joe. Er sagt es wie einen Dienstgrad. #sprecher:erzaehler
Kranführer, dreißig Jahre, und ebenso lange der Club. #sprecher:erzaehler
Steckt sie noch die Hände in die Ärmel? Wenn sie nachdenkt? #sprecher:bigJoe #stimmung:laechelt
* [„Ja.“]
- Du hast nie darüber nachgedacht. #sprecher:erzaehler
{pokalregalGesehen:
    Hinter ihm die Lücke im Regal, das Schildchen darunter: 2001. #sprecher:erzaehler
- else:
    Im Pokalregal hinter ihm stehen die Pokale dicht an dicht. Nur an einer Stelle nicht. #sprecher:erzaehler
    Eine Lücke, so breit wie eine Hand. Darunter ein Schildchen aus Messing: 2001. #sprecher:erzaehler
}
~ pokalregalGesehen = true
Deine Oma wohnt noch in der Elm Street. Nummer zehn, das Eckhaus mit dem grünen Geländer. #sprecher:bigJoe #stimmung:nachdenklich
Geh hin. Ruth hat dich nicht mehr gesehen, seit du so klein warst. #sprecher:bigJoe #stimmung:nachdenklich
Und wenn du deine Mutter siehst: Big Joe lässt grüßen. #sprecher:bigJoe #stimmung:laechelt
Und dass es ihm leidtut. #sprecher:bigJoe #stimmung:ernst #pause:2
Was tut ihm leid? #sprecher:juno #stimmung:ueberrascht
Du weißt es nicht. #sprecher:erzaehler
-> END

=== big_joe_reihe_offen ===
{not reiheHankBestanden:
    Um die Nadel? Erst Hank, dann Priya, dann ich. #sprecher:bigJoe #stimmung:laechelt
    Hank redet wenig, aber seine Fesselungen reden für ihn. #sprecher:bigJoe #stimmung:laechelt
- else:
    Hank hast du geschafft. Jetzt Priya. #sprecher:bigJoe #stimmung:laechelt
    Sie rechnet Spieße wie Brücken. #sprecher:bigJoe #stimmung:laechelt
}
-> END

// Gutachten L1.3: Der Clubkampf kommt erst nach Mamas Partie (Roman, Kapitel 27 vor 28).
=== big_joe_wartet ===
{~Hank und Priya hast du geschafft, mich noch nicht. Aber nicht heute, Kumpel.|Das Stahlbrett wartet. Ich weiß nur noch nicht, worauf.|Am Tisch am Fenster ist ein Platz frei. Den stell ich keinem hin.} #sprecher:bigJoe #stimmung:laechelt
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
    Verschieben! Hier wird nicht verschoben, hier wird geschichtet. #sprecher:bigJoe #stimmung:lacht
* [Nicken]
- -> brett

= brett
// Lektorat 20.11.2026: Nach „Noch nicht.“ sieht Mama nicht noch einmal „zum ersten Mal“ zu.
{
- clubkampfIronwoodAngesagt:
    Mama sitzt noch in der ersten Reihe. Die Nadel liegt auf dem Stahlbrett. #sprecher:erzaehler
- else:
    ~ clubkampfIronwoodAngesagt = true
    Die Nadel liegt auf dem Stahlbrett. Ein kleines Zahnrad aus dunklem Metall, mit einem Turm in der Mitte. #sprecher:erzaehler
    Mama sitzt in der ersten Reihe. Zum ersten Mal sieht sie dir zu. #sprecher:erzaehler
    Sie beugt sich vor und sagt zwei Wörter, so leise, dass nur du sie hörst. #sprecher:erzaehler
    Grundreihe. Immer. #sprecher:mutter #stimmung:nachdenklich
}
Um die Nadel, Kumpel? Auf meinem Stahlbrett. #sprecher:bigJoe #stimmung:laechelt
+ [„Ich bin bereit.“]
    ~ beginnePartie("ironwood.clubkampf")
    -> END
+ [„Noch nicht.“]
    Das Stahlbrett wartet. Es rostet nicht. #sprecher:bigJoe #stimmung:lacht
    -> END

=== big_joe_nach_niederlage ===
Festgehalten, Kumpel. Noch eine? #sprecher:bigJoe #stimmung:laechelt
// Ambrose nach dem verlorenen Clubkampf (schwacher Spieler im Durchlauf, 19.11.2026: vorher
// sprach nur der Clubchef). Nach dem Abschied schweigt er.
{not abschiedGesehen:
    Er hält fest, was er hat. Gib ihm etwas, das er nicht halten kann. #sprecher:ambrose #stimmung:nachdenklich
}
+ [„Noch eine.“]
    ~ beginnePartie("ironwood.clubkampf")
    -> END
+ [„Nicht jetzt.“]
    -> END

=== big_joe_nach_sieg ===
~ revancheIronwood = false
// Kapitel 28, Schluss: „Ach, Kumpel“ ohne Musik; Fanfare beim Anstecken der Nadel, dann brüllt die
// Kantine; „Es war schön … Beides.“ mit ambrose.mama (Gutachten L1.7). Der Mentor-Zug kommt still
// über die Quest. Der Kauf folgt erst neun Tage später (ironwood-aussen.kauf).
// Lektorat 19.11.2026: Eine Revanche, die eine bessere Nadel bringt, spielt nicht die ganze Szene
// des ersten Siegs noch einmal (Glocken, Kantine, „Noch mal. Jetzt.“).
{clubkampfIronwoodNadel > 0:
    ~ clubkampfIronwoodNadel = nadelIronwood
    Big Joe steckt dir die bessere Nadel an. #sprecher:erzaehler #klang:fanfare
    Eine bessere Nadel, Kumpel. {kaufGesehen:In der Garage zählt sie genauso.|Auf meinem Stahlbrett zählt jede.} #sprecher:bigJoe #stimmung:froh
    -> END
}
~ clubkampfIronwoodNadel = nadelIronwood
{ausgangIronwoodClubkampf == "remis":
    Remis. Ehrlich verdient, Kumpel. #sprecher:bigJoe #stimmung:laechelt
    Er steckt dir das Zahnrad an die Jacke, neben die anderen Nadeln. #sprecher:erzaehler #klang:fanfare
    {feierGesehen: Revanche, wenn ich ausgeschlafen bin! #sprecher:bigJoe #stimmung:froh}
    {not abschiedGesehen:
        Es hat gestimmt. Das Schöne holen wir nach. #sprecher:ambrose #stimmung:lachtOhneSpott
    }
    -> END
}
Ach, Kumpel. Ach, Kumpel. #sprecher:bigJoe #stimmung:muede #musik:aus
Er legt seinen König um, mit einem Finger. Auf dem Stahl klingt es leise. #sprecher:erzaehler #pause
In der ersten Reihe hat Mama beide Hände vor dem Mund. #sprecher:erzaehler
Grundreihe. Du hast es dem Kumpel gesagt, Laurie. #sprecher:bigJoe #stimmung:froh
Dreißig Jahre, und du kennst mich immer noch. #sprecher:bigJoe #stimmung:froh
Er steckt dir das Zahnrad an die Jacke, neben die anderen Nadeln. #sprecher:erzaehler #klang:fanfare
{feierGesehen:
    Revanche, wenn ich ausgeschlafen bin! #sprecher:bigJoe #stimmung:froh
}
Die Kantine brüllt. #sprecher:erzaehler
{not abschiedGesehen:
    Auf dem Weg hinaus, im Lärm, sagt Ambrose etwas. Du verstehst es fast nicht. #sprecher:erzaehler #pause
    Es war schön, und es hat gestimmt. Beides. #sprecher:ambrose #stimmung:still #musik:ambrose.mama
}
-> END

// Lektorat Akt 2 (17.11.2026): Nach dem Kauf räumt der Club die Kantine. Hank, Priya und Mama sind
// fort (orte.json, wenn); Big Joe holt die letzten Kisten, bis er in Akt 4 nach Crossroads fährt.
// Das Stahlbrett steht seit dem Kauf in seiner Garage (ironwood-aussen.kauf).
=== big_joe_nach_kauf ===
Big Joe sitzt auf einem Stuhl zwischen den Kartons und reißt Klebeband ab. Das Geräusch hallt durch den leeren Raum. #sprecher:erzaehler
{~Die Garage ist eng, Kumpel, aber sie gehört uns. Hier hole ich nur noch, was uns gehört.|Dreißig Jahre, Kumpel. Und die Kisten sind in zwei Stunden gepackt.|Laurie hat gesagt, sie hilft beim Streichen. Die Garage kriegt Grün, wie das Geländer bei Ruth.} #sprecher:bigJoe #stimmung:nachdenklich
+ {mamaSpielt and not feierGesehen} [„Wird noch gefeiert?“]
    // Wer die Feier abgelehnt hat, kann sie nachholen (Nebenquest ironwood.feier), jetzt in der Garage.
    In der Garage, Kumpel. Schinken haben wir noch. #sprecher:bigJoe #stimmung:lacht
    -> feier
+ {nadelIronwood < 3} [„Revanche um eine bessere Nadel?“]
    ~ revancheIronwood = true
    Immer, Kumpel. Komm mit in die Garage, das Stahlbrett steht schon dort. #sprecher:bigJoe #stimmung:laechelt
    ~ beginnePartie("ironwood.clubkampf")
    -> END
+ [„Bis nachher, Big Joe.“]
    -> END

=== big_joe_brief ===
Big Joe zieht einen zerknitterten Umschlag aus der Brusttasche. #sprecher:erzaehler
Kumpel, fährst du am Kanal entlang? Bring das Ruben in Lockport. #sprecher:bigJoe #stimmung:nachdenklich
Der Mann hat seit dem Sommer keine Fracht. #sprecher:bigJoe #stimmung:nachdenklich
~ briefFuerRuben = true
-> END

=== big_joe_alltag ===
{~Kumpel, die Kantine war dreißig Jahre unser Wohnzimmer.|Laurie spielt wieder. Ich hätte nicht gedacht, dass ich das noch erlebe.|Eine Fesselung ist wie ein Kranhaken: Was dranhängt, kann nicht weg.} #sprecher:bigJoe #stimmung:laechelt
+ {mamaSpielt and not feierGesehen} [„Wird heute noch gefeiert?“]
    // Wer die Feier einmal abgelehnt hat, kann sie nachholen; sonst bliebe die Nebenquest
    // ironwood.feier für immer offen.
    -> feier
+ {nadelIronwood > 0 and nadelIronwood < 3} [„Revanche um eine bessere Nadel?“]
    ~ revancheIronwood = true
    Immer, Kumpel. #sprecher:bigJoe #stimmung:lacht
    ~ beginnePartie("ironwood.clubkampf")
    -> END
+ [„Bis nachher, Big Joe.“]
    -> END

// ---------------------------------------------------------------- Die Feier

=== feier_einladung ===
Heute wird gefeiert, Kumpel! Laurie ist zurück. #sprecher:bigJoe #stimmung:froh
Bleibst du? Wird spät. #sprecher:bigJoe #stimmung:laechelt
* [„Ich bleibe.“]
    -> feier
* [„Ich gehe lieber früh.“]
    ~ feierAbgelehnt = true
    Morgen ist auch noch ein Tag, Kumpel. Der Schinken hält. #sprecher:bigJoe #stimmung:laechelt
    -> END

=== feier ===
// Kapitel 28 (Roman): das Fest; bei Big Joes Pokal wird es kurz leise.
~ feierGesehen = true
{kaufGesehen:Big Joe holt einen Schinken aus der Kühltruhe in seiner Garage.|Jemand holt einen Schinken aus dem Kühlraum.} Priya steigt auf einen Stuhl und hält eine Rede über Tragwerke. Alle klatschen. #sprecher:erzaehler #musik:ironwood.feier
Hank, der sonst drei Wörter am Tag sagt, erzählt Mama, was aus jedem geworden ist. Der Reihe nach, mit Jahreszahlen. #sprecher:erzaehler
Laurie kam mit neun zum ersten Mal her, an der Hand ihres Vaters. Hat das Stahlbrett angefasst und gesagt: Das ist kalt. #sprecher:bigJoe #stimmung:froh
Den Pokal von 2001 hatte ich schon gekauft. Vorher. #sprecher:bigJoe #stimmung:nachdenklich
So sicher war ich. #sprecher:bigJoe #stimmung:nachdenklich
Wo ist er? #sprecher:mutter #stimmung:ueberrascht #musik:aus
Im Schrank. Bei mir zu Hause. #sprecher:bigJoe #stimmung:traurig
Ich hab ihn nicht zurückgeben können. Und hinstellen auch nicht. #sprecher:bigJoe #stimmung:traurig
Mama legt ihm die Hand auf den Arm. Mehr nicht. #sprecher:erzaehler #pause:2
Du hast Mama noch nie so gesehen: rote Wangen, die Ärmel hochgeschoben, mitten unter Leuten, die sie Laurie nennen. #sprecher:erzaehler #musik:ironwood.feier
Um eins singt jemand. Um halb zwei schläft Juno auf zwei Stühlen. #sprecher:erzaehler
~ setzeZustand("ironwood.bigJoe", 1.4, "zustand.schlechtGeschlafen")
-> END

// ---------------------------------------------------------------- Mama

=== mama ===
{
// Hinweis, falls das Gespräch über das Foto zu Hause verloren ging (etwa durch Neuladen mitten im
// Dialog): Oma Ruth bietet die Heimfahrt dann noch einmal an (Chaos-Prüfung, 14.11.2026).
- fotoGefunden and not mamaFotoGesehen:
    Am Tisch am Fenster ist ein Platz frei. Das Foto in deiner Tasche hat Mama noch nicht gesehen. #sprecher:erzaehler
    Oma Ruth in der Elm Street weiß, wann der nächste Bus nach Hause fährt. #sprecher:erzaehler
    -> END
- not mamaFotoGesehen:
    Am Tisch am Fenster ist ein Platz frei. Big Joe stellt dort nie jemanden hin. #sprecher:erzaehler
    -> END
- not mamaInKantine: -> mama_ankunft
- ausgangIronwoodMama == "" or ausgangIronwoodMama == "abgebrochen": -> mama_partie_angebot
- not mamaSpielt: -> mama_nach_partie
- not lernkarteFaktorenwaage: -> mama_karte
- else: -> mama_alltag
}

// Kapitel 27, zweiter Teil (Roman): Stille beim Eintreten, dann das Ironwood-Thema warm.
=== mama_ankunft ===
// Nach der Partie öffnet die App den Dialog wieder, mit dem sie begann: hier den Eingangsdialog.
// Dann gleich zur Reaktion auf das Ergebnis, nicht noch einmal die Ankunft (schwacher
// Spieler-Durchlauf, 24.11.2026).
{mamaInKantine: -> mama}
~ mamaInKantine = true
Ihr fahrt am Samstag, mit dem Wagen, Juno auf der Rückbank. Mama redet die ganze Fahrt über das Wetter. #sprecher:erzaehler
An der Eisenbrücke wird sie still. #sprecher:erzaehler
Vor dem Haus mit dem grünen Geländer bleibt sie eine Minute sitzen, die Hände am Lenkrad. #sprecher:erzaehler #pause:2
Was sie und Oma Ruth an der Tür sagen, weißt du nicht. Du bleibst im Wagen. #sprecher:erzaehler
Manche Dinge gehören einem nicht. #sprecher:erzaehler
In der Kantine bullert der Ofen. Sie sind alle da, Hank und Priya und ein Dutzend andere in Arbeitsjacken. #sprecher:erzaehler #musik:aus #schwenk:hank
// Auftritt (Befund des Autors, 26.11.2026): Mama wartet unsichtbar in der Tür (orte.json,
// auftritt.wartet „nicht mamaInKantine“) und kommt mit dieser Zeile herein, zu Big Joe.
Als Mama in der Tür steht, wird es still wie in einer Kirche. #sprecher:erzaehler #schwenk:held #gehe:mama>bigJoe
Big Joe steht auf. Er sagt nichts, sie sagt nichts. #sprecher:erzaehler #schwenk:bigJoe
Sie geht durch den ganzen langen Raum. Er kommt ihr drei Schritte entgegen und hält sie fest, als könnte sie zerbrechen. #sprecher:erzaehler #pause:2
Laurie. #sprecher:bigJoe #stimmung:ueberrascht
Du hättest noch mal klingeln können. #sprecher:mutter #stimmung:bitter
Ich weiß. #sprecher:bigJoe #stimmung:bitter
Ich hätte aufgemacht. #sprecher:mutter #stimmung:nachdenklich
Ich weiß. Jetzt. #sprecher:bigJoe #stimmung:nachdenklich #musik:karte
-> mama_partie_angebot

=== mama_partie_angebot ===
Am Stahlbrett. Mama hat Weiß. #sprecher:erzaehler
Sie sieht die Figuren an, eine nach der anderen, als müsste sie sich an ihre Namen erinnern. #sprecher:erzaehler
+ [„Ich bin bereit.“]
    Ihre Hand zittert, als sie den ersten Bauern anfasst. Damenbauer, zwei Felder, dann der daneben. #sprecher:erzaehler
    Damengambit. Hat sie von mir. #sprecher:bigJoe #stimmung:froh
    ~ beginnePartie("ironwood.mama")
    -> END
+ [„Gleich, Mama.“]
    Ich laufe nicht weg. Nicht mehr. #sprecher:mutter #stimmung:laechelt
    -> END

=== mama_nach_partie ===
// Nach der Partie nur Ergebnis, Heft und „Ab jetzt fahre ich mit“ (Gutachten L1.1); der Moment
// selbst liegt in der Partie (mama_moment_angriff).
~ mamaSpielt = true
{ausgangIronwoodMama:
- "sieg":
    Ihr habt zu Ende gespielt. Du hast gewonnen. #sprecher:erzaehler
    Es ist das Einzige an diesem Tag, das nicht wichtig ist. #sprecher:erzaehler
- "remis":
    Ihr habt zu Ende gespielt. Remis. #sprecher:erzaehler
    Es ist das Einzige an diesem Tag, das nicht wichtig ist. #sprecher:erzaehler
- else:
    Ihr habt zu Ende gespielt. Mama hat gewonnen. #sprecher:erzaehler
    Es ist das Einzige an diesem Tag, das nicht wichtig ist. #sprecher:erzaehler
}
{turnierheftBekommen: -> heft_satz ->}
Und ab jetzt fahre ich mit. Zu den Turnieren. #sprecher:mutter #stimmung:froh
Jemand muss ja auf die Zeit achten. #sprecher:mutter #stimmung:froh
Du spielst zu langsam. #sprecher:mutter #stimmung:laechelt
Deine Mutter, wenn ich das sagen darf, spielt besser, als sie lügt. #sprecher:ambrose #stimmung:lachtOhneSpott
Juno klebt das Foto ins Tagebuch. #sprecher:erzaehler
Mit Glitzer. Diesmal ja. #sprecher:juno #stimmung:froh
-> END

// ---------------------------------------------------------------- Partiemomente (Roman, Kap. 27/28)
// Feste Momente in den Partien (begegnungen.json, momente). Sie sagen nichts über die Stellung,
// was nicht in jeder Partie stimmt: Die Engine wartet nicht auf das Bild aus dem Roman.

=== mama_moment_rost ===
Mama wird langsamer. Sie rechnet, zieht die Hand zurück und sagt ein Wort, das du von ihr nicht kennst. #sprecher:erzaehler
Eingerostet. Wie ein altes Tor. #sprecher:mutter #stimmung:lachtOhneSpott
Schmieröl ist im Schrank. #sprecher:bigJoe #stimmung:lacht
-> END

=== mama_moment_angriff ===
// Lektorat 19.11.2026: Der Moment kommt einmal, nicht in jeder Revanche wieder.
{mamaMomentGesehen: -> END}
~ mamaMomentGesehen = true
// Gutachten L1.1: Das Bild von 2001 und „Ich hab ihn gesehen“ fallen in der Partie, unabhängig vom
// Ausgang; als Einblendung, nicht als Aussage über die Stellung der Engine.
Ihre Figuren rücken vor, eine nach der anderen, schön und entschlossen, auf deinen König zu. #sprecher:erzaehler
Ein paar Züge später siehst du es. Ihre Dame, weit vorn. #sprecher:erzaehler #musik:aus #bild:schraege
Dahinter, auf derselben Schräge, das Feld, auf das ihr Turm will. Und dein Läufer, in der Ecke. #sprecher:erzaehler
Dir wird kalt. Nicht genau dieselbe Stellung, aber dasselbe Bild. #sprecher:erzaehler #pause:2
* [„Ambrose.“]
- Ich sehe es. #sprecher:ambrose #stimmung:ueberrascht
* [„Was mache ich?“]
- Er schweigt. Der Ofen bullert. #sprecher:erzaehler #pause:2
Du spielst Schach. Mit deiner Mutter. #sprecher:ambrose #stimmung:nachdenklich #bild:aus
Sie ist nicht hergekommen, um geschont zu werden. #sprecher:ambrose #stimmung:nachdenklich
Mamas Hand schwebt schon über dem Turm. Dann hält sie inne. #sprecher:erzaehler
Sie sieht nicht auf ihren Angriff. Ihr Blick geht die Schräge entlang, Feld für Feld, bis in deine Ecke. #sprecher:erzaehler #pause:3
Big Joe hat die Augen zugemacht. Mama zieht die Hand zurück. #sprecher:erzaehler
Ich hab ihn gesehen. Den Läufer. #sprecher:mutter #stimmung:hatIhnGesehen #musik:mama.vollstaendig
Diesmal hab ich ihn gesehen. #sprecher:mutter #stimmung:hatIhnGesehen
Sie hält sich mit beiden Händen an der Tischkante fest. Big Joes Augen sind nass, und es ist ihm vollkommen gleichgültig. #sprecher:erzaehler
-> END

=== clubkampf_schraubstock ===
// Lektorat 19.11.2026: Der Moment kommt einmal, nicht in jeder Revanche wieder.
{schraubstockGesehen: -> END}
~ schraubstockGesehen = true
Er stellt eine Figur hin, und sie bleibt dort. Dann die nächste daneben. #sprecher:erzaehler
Jede hält eine von deinen fest. #sprecher:erzaehler
Was dranhängt, kann nicht weg. #sprecher:bigJoe #stimmung:nachdenklich
Das ist auch Schach. Kein Funken, kein einziger. #sprecher:ambrose #stimmung:laechelt
Und doch steht alles genau, wo es stehen muss. #sprecher:ambrose #stimmung:laechelt #pause
Der Brückenbauer hätte ihn gemocht. #sprecher:ambrose #stimmung:still #pause
-> END

=== clubkampf_stimmt_es ===
// Lektorat 19.11.2026: Der Moment kommt einmal, nicht in jeder Revanche wieder.
{stimmtEsGesehen: -> END}
~ stimmtEsGesehen = true
// Gutachten L1.5: die Wahlen hintereinander, damit „Dann spiel es.“ immer fällt.
{feierGesehen:Big Joe reibt sich das Gesicht mit beiden Händen. Als er sie wegnimmt, braucht er einen Moment, bis er das Brett wiederfindet.|Big Joe reibt sich das Gesicht mit beiden Händen. Dann sieht er lange aufs Brett.} #sprecher:erzaehler
Grundreihe. Immer. #sprecher:erzaehler
Stimmt es? #sprecher:ambrose #stimmung:nachdenklich #musik:aus #pause:2
Diesmal fragt er. Nicht du. #sprecher:erzaehler
* [Zählen. Dreimal.]
- * [„Es stimmt.“]
- Dann spiel es. #sprecher:ambrose #stimmung:froh
Und sieh ihm dabei ins Gesicht. Das ist die Hälfte. #sprecher:ambrose #stimmung:laechelt
-> END

// Kapitel 27: Mamas Satz unter dem Finale (Tunnel, nur mit dem blauen Heft).
=== heft_satz ===
Mama schlägt das blaue Heft auf und nimmt Hank einen Kugelschreiber aus der Brusttasche, ohne zu fragen. #sprecher:erzaehler
Unter „Finale. 12. Mai 2001“ schreibt sie einen einzigen Satz: „Es passiert jedem. Auch mir.“ #sprecher:erzaehler #bild:heft_neuer_satz
Sie blättert um. Auf der nächsten Seite stehen drei Sätze in deiner Schrift. #sprecher:erzaehler #bild:aus
Du schreibst ja in mein Heft. #sprecher:mutter #stimmung:ueberrascht
* [„Oma hat gesagt …“]
- Ich weiß, was Oma gesagt hat. Schreib weiter. #sprecher:mutter #stimmung:laechelt
->->

// Lernkarte aus der Lektion (RO11, 15.11.2026): Nach dem Damengambit erklärt Mama, was der Bauer
// kauft, und gibt die Faktorenwaage.
=== mama_karte ===
~ lernkarteFaktorenwaage = true
Damengambit. Ein Bauer weg, dafür Zeit und das Zentrum. #sprecher:mutter #stimmung:nachdenklich #brett:damengambit
Wer nur die Figuren zählt, versteht das nie. #sprecher:mutter #stimmung:nachdenklich
{hatKarteFaktorenwaage:
    Aber das weißt du ja längst. Du hast sogar die Karte dafür. #sprecher:mutter #stimmung:laechelt
- else:
    Sie legt dir eine Karte hin, an den Ecken abgegriffen: eine Waage mit vier Schalen. #sprecher:erzaehler
    Die lag in meinem alten Schachkasten bei Oma Ruth. Leg alles auf die Waage, nicht nur das Holz. #sprecher:mutter #stimmung:laechelt
    ~ gibKarte("faktorenwaage")
}
-> END

=== mama_alltag ===
{~Grundreihe, immer die Grundreihe. Sag das Joe nicht.|Ich hab mir ein Taschenschach gekauft. Für die Nachtschicht.|Fünfundzwanzig Jahre. Und die Figuren fühlen sich an wie gestern.} #sprecher:mutter #stimmung:laechelt
-> END

// ---------------------------------------------------------------- Hank und Priya

=== hank ===
{
// Hanks Reihe erst nach Big Joe: Die Quest „Clubkampf in Ironwood“ wartet zuerst auf Big Joe und
// dann auf Hanks Reihe; vorher bestanden, hing sie für immer (Chaos-Prüfung, 14.11.2026).
- not bigJoeGetroffen:
    Ein Mann im Blaumann steht allein am Ende des Tischs und sieht kaum hoch. #sprecher:erzaehler
    Erst zu Big Joe. Der entscheidet, wer hier mitspielt. #sprecher:hank #stimmung:neutral
    -> END
- not hankGetroffen:
    ~ hankGetroffen = true
    Ein Mann im Blaumann steht allein am Ende des Tischs und schiebt eine Figur hin und her. #sprecher:erzaehler
    Hank. Gefesselt. #sprecher:hank #stimmung:neutral
    Nicht bewegen. Wie ich nach der Nachtschicht. #sprecher:hank #stimmung:laechelt
    -> hank_reihe
- not reiheHankBestanden: -> hank_reihe
- else:
    {~Gut gemacht. Mehr sag ich nicht.|Nachtschicht, danach Schach, danach schlafen. Meistens.} #sprecher:hank #stimmung:laechelt
    -> END
}

=== hank_reihe ===
Fesselungen. Willst du? #sprecher:hank #stimmung:laechelt
+ [„Ja.“]
    ~ beginneAufgaben("ironwood.reiheHank")
    -> END
+ [„Gleich.“]
    -> END

=== priya ===
{
- not priyaGetroffen:
    ~ priyaGetroffen = true
    Eine junge Frau mit Bauhelm und Notizbuch winkt dir zu. Im Notizbuch: Brücken und Schachdiagramme. #sprecher:erzaehler
    Priya. Werkstudentin. #sprecher:priya #stimmung:froh
    Ich will mal Brücken bauen. Und Spieße sind wie eine Statik-Rechnung! #sprecher:priya #stimmung:laechelt
    {reiheHankBestanden: -> priya_reihe}
    Aber erst Hank. Big Joe will das so. #sprecher:priya #stimmung:laechelt
    Ingenieurwesen: erst das Fundament. #sprecher:priya #stimmung:laechelt
    -> END
- not reiheHankBestanden:
    Erst Hank, dann ich. Fundament zuerst! #sprecher:priya #stimmung:laechelt
    -> END
- not reihePriyaBestanden: -> priya_reihe
- else:
    {~Ein Spieß ist eine Fesselung von hinten. Statik!|Erst das Wertvolle angreifen, dann das dahinter nehmen. Ingenieurwesen.|Die Brücke über den Kanal ist alt, aber gut gerechnet. Wer die wohl gebaut hat?} #sprecher:priya #stimmung:laechelt
    -> END
}

=== priya_reihe ===
Spieße und scheinbarer Schutz. Bereit für ein bisschen Statik? #sprecher:priya #stimmung:laechelt
+ [„Bereit.“]
    ~ beginneAufgaben("ironwood.reihePriya")
    -> END
+ [„Gleich.“]
    -> END

// ---------------------------------------------------------------- Gegenstände

=== pokalregal ===
{kaufGesehen:
    Das Regal ist leer. Die Pokale sind in Big Joes Lieferwagen. #sprecher:erzaehler
    Nur das Messingschild hängt noch: 2001. #sprecher:erzaehler
    -> END
}
{pokalregalGesehen:
    Die Lücke im Regal ist noch da, so breit wie eine Hand. Darunter das Messingschild: 2001. #sprecher:erzaehler
    -> END
}
~ pokalregalGesehen = true
Im Pokalregal stehen dreißig Jahre Werksclub, dicht an dicht. #sprecher:erzaehler
Nur an einer Stelle nicht. Eine Lücke, so breit wie eine Hand. #sprecher:erzaehler #bild:pokalluecke_2001
Darunter ein Schildchen aus Messing: 2001. #sprecher:erzaehler
-> END

=== stahlbrett ===
{kaufGesehen:
    Wo das Stahlbrett stand, ist ein heller Fleck auf dem Tisch. Hank und Priya haben es hinausgetragen. #sprecher:erzaehler
    -> END
}
Ein Schachbrett aus Stahl. Die Felder hell geschliffen und dunkel angelassen, die Schweißnähte am Rand dick wie Finger. #sprecher:erzaehler #bild:stahlbrett
{not abschiedGesehen:
    Stahl für das Brett, Holz für die Figuren. Ein Mann, der weiß, was hart sein muss und was nicht. #sprecher:ambrose #stimmung:laechelt
}
-> END

// Rückmeldung nach der Runde (runden.json `danach`; Wunsch des Autors, 19.11.2026): bestanden ein Satz von Hank, sonst wie bisher.
=== hank_reihe_danach ===
{not reiheHankBestanden: -> hank}
Alle gefesselt. Keiner ist weggelaufen. #sprecher:hank #stimmung:laechelt
Jetzt Priya. Die rechnet dir Spieße vor, bis dir der Kopf brummt. #sprecher:hank #stimmung:neutral
-> END

// Rückmeldung nach der Runde (runden.json `danach`; Wunsch des Autors, 19.11.2026): bestanden ein Satz von Priya, sonst wie bisher.
=== priya_reihe_danach ===
{not reihePriyaBestanden: -> priya}
Statik hält! Jeder Spieß saß. #sprecher:priya #stimmung:froh
Jetzt fehlt nur noch Big Joe. Um die Nadel spielt er selbst. #sprecher:priya #stimmung:laechelt
-> END

// Revanche um eine bessere Nadel, die keine bessere Nadel brachte (Spieler-Durchlauf mit schwachem
// Spieler, 19.11.2026): Vorher folgte nur ein Alltagssatz, jetzt geht big_joe auf den Ausgang ein.
// Abgebrochen: keine Reaktion, weiter wie sonst.
=== big_joe_nach_revanche ===
~ revancheIronwood = false
{
- ausgangIronwoodClubkampf == "sieg":
    Gewonnen, Kumpel. Für eine bessere Nadel hat's nicht gereicht. #sprecher:bigJoe #stimmung:laechelt
    Sauber gespielt war es trotzdem. #sprecher:bigJoe #stimmung:laechelt
- ausgangIronwoodClubkampf == "remis":
    Remis, Kumpel. Wie eine Schicht ohne Unfall, die Nadel bleibt. #sprecher:bigJoe #stimmung:neutral
- ausgangIronwoodClubkampf == "niederlage":
    Diesmal hab ich gewonnen, Kumpel. Deine Nadel behältst du. #sprecher:bigJoe #stimmung:laechelt
    Die hast du dir verdient. #sprecher:bigJoe #stimmung:laechelt
- else:
    -> big_joe
}
+ {nadelIronwood < 3} [„Noch einmal.“]
    ~ revancheIronwood = true
    ~ beginnePartie("ironwood.clubkampf")
    -> END
+ [„Nicht jetzt.“]
    -> END
