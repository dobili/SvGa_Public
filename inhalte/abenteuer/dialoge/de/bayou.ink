// Nebenschauplatz Bayou (Akt 4, Rückkehr in den Süden, Story-Bibel Abschnitt 28; Landschaft L5
// Nebelschach). Karte „Bootssteg im Bayou“, erreichbar von Port Delacroix nach der Eröffnung des
// Musikhauses.
//
// Luftbootführer Theron erklärt Nebelschach; die Variante braucht eine eigene Bot-Logik (Bibel,
// Abschnitt 34) und wird deshalb hier nur erzählt. Einstiege wie in orte.json: theron,
// zurueck_delacroix, nebel; seit Runde 6 auch pepe, ereignis_hausboot, luftboot,
// sperre_hochwasser, seite05 und finch_bauer_c (Dokument 15, 2.6: die Kiste im Hausboot).
// ausgangBayouHausboot setzt die Hülle (R42), alle anderen Variablen diese Datei.

EXTERNAL beginnePartie(begegnung)
EXTERNAL gibFund(kennung)

VAR theronGetroffen = false
VAR bayouNebelGesehen = false
VAR pepeGetroffen = false
VAR hausbootFormularGesehen = false
VAR ausgangBayouHausboot = ""
VAR hausbootErledigt = false
VAR angesehenLuftboot = false
VAR hochwasserGesehen = false
VAR seite05Gefunden = false
VAR finchBauerCGefunden = false
VAR buchseiten = 0
VAR finchFiguren = 0

=== theron ===
{theronGetroffen:
    {~Im Nebel siehst du nur, wohin deine Figuren ziehen können. Der Rest ist Geduld.|Der Alligator dort heißt Bernard. Er spielt nicht mit.|Nächsten Sommer bringe ich dir das richtig bei. Mit Brett und Nebel.} #sprecher:theron
    -> END
}
~ theronGetroffen = true
Am Bootssteg liegt ein flaches Luftboot mit einem riesigen Propeller. Ein Mann mit Sonnenbrille winkt. #sprecher:erzaehler
Theron. Ich fahre Leute durch den Bayou. Morgens, wenn der Nebel liegt, spielen wir Nebelschach. #sprecher:theron
Du siehst nur die Felder, die deine Figuren erreichen. Den Rest verschluckt der Nebel. #sprecher:theron
Wie im Leben: Man sieht nie das ganze Brett. Aber man zieht trotzdem. #sprecher:ambrose #stimmung:friedlich
-> END

=== nebel ===
{bayouNebelGesehen:
    Der Nebel hat sich gehoben. Zwischen den Zypressen glitzert das Wasser. #sprecher:erzaehler
    -> END
}
~ bayouNebelGesehen = true
Über dem Wasser liegt dichter Nebel. Irgendwo platscht etwas, irgendwo ruft ein Vogel. #sprecher:erzaehler
Du kannst kaum drei Bootslängen weit sehen. So ungefähr fühlt sich Nebelschach an. #sprecher:erzaehler
-> END

=== zurueck_delacroix ===
Das Luftboot bringt dich zurück zum Kai von Port Delacroix. #sprecher:erzaehler
-> END

// ---------------------------------------------------------------- Die Kiste im Hausboot (Runde 6)
// Dokument 15, 2.6. Pépé Thibodeaux will alte Partieformulare aus dem Café des Exilés verbrennen.
// Auf einem steht Ambroses Handschrift; {held} spielt die Stellung nach dem 20. Zug weiter, mit
// Ambroses Seite (Begegnung bayou.hausboot).

=== pepe ===
{
- hausbootErledigt: -> pepe_danach
- ausgangBayouHausboot != "" and ausgangBayouHausboot != "abgebrochen": -> pepe_nach_partie
- hausbootFormularGesehen: -> pepe_angebot
- not pepeGetroffen: -> pepe_erstes
- else: -> pepe_kiste
}

=== pepe_erstes ===
~ pepeGetroffen = true
Auf dem Deck des Hausboots sitzt ein alter Mann neben einer verbeulten Blechkiste. Er hält ein Streichholz in der Hand. #sprecher:erzaehler
Thibodeaux. Pépé sagen alle. Die Kiste kommt ins Feuer, heute Abend. Keiner liest das mehr. #sprecher:pepe
-> pepe_kiste

=== pepe_kiste ===
Partieformulare aus dem Café des Exilés, 1852. Mein Urgroßvater hat da Kaffee ausgeschenkt. Schau ruhig rein, bevor sie brennen. #sprecher:pepe
+ [In den Formularen blättern]
    -> pepe_formular
+ [„Bitte nicht verbrennen.“]
    Dann sag mir, wofür sie gut sind. Blätter erst mal. #sprecher:pepe
    -> END

=== pepe_formular ===
~ hausbootFormularGesehen = true
Vergilbte Blätter, sauber in Spalten geschrieben. Auf einem bleibt dein Blick hängen: dieselbe schräge Schrift wie in den Notizen im Brett. #sprecher:erzaehler
Warte. Zeig mir das Blatt. #sprecher:ambrose #stimmung:fern
Das ist meine Schrift. Ich habe gegen einen Hafenarbeiter verloren, damals. Ich habe es niemandem erzählt. #sprecher:ambrose #stimmung:fern
Die Partie bricht nach dem 20. Zug ab. Weiß ist am Zug. #sprecher:erzaehler
-> pepe_angebot

=== pepe_angebot ===
+ [Die Stellung mit Ambroses Seite weiterspielen]
    Na los. Ich will sehen, ob der alte Kram noch was taugt. #sprecher:pepe
    ~ beginnePartie("bayou.hausboot")
    -> END
+ [„Später.“]
    Die Kiste wartet. Das Streichholz auch. #sprecher:pepe
    -> END

=== pepe_nach_partie ===
~ hausbootErledigt = true
{ausgangBayouHausboot:
- "sieg": Diesmal nicht. Diesmal nicht! #sprecher:ambrose #stimmung:froh
- "remis": Remis. Das hätte ich damals unterschrieben. #sprecher:ambrose
- else: Wieder verloren. Und weißt du was? Es ist trotzdem schön, sie noch einmal gespielt zu haben. #sprecher:ambrose
}
Pépé steckt das Streichholz zurück in die Schachtel. #sprecher:erzaehler
Gut. Dann brennt heute nichts. Die Kiste bringe ich ins Musikhaus, da gehört sie hin. Das eine Blatt behältst du. #sprecher:pepe
~ gibFund("formularCafeDesExiles")
-> END

=== pepe_danach ===
{~Die Kiste steht jetzt im Musikhaus. Henri hat sie neben das Klavier gestellt.|Mein Urgroßvater hätte dir einen Kaffee ausgegeben. Ich hab nur Wasser. Viel Wasser.|Hörst du die Frösche? Die spielen auch, nur ohne Brett.} #sprecher:pepe
-> END

=== ereignis_hausboot ===
{hausbootErledigt:
    Das Hausboot schaukelt leise. Die Blechkiste ist fort. #sprecher:erzaehler
    -> END
}
Am Ende des Stegs liegt ein Hausboot. Eine Laterne brennt, obwohl es Tag ist. #sprecher:erzaehler
-> pepe

// ---------------------------------------------------------------- Ansehen und Sperre S8

=== luftboot ===
{angesehenLuftboot:
    Therons Luftboot schaukelt am Steg. Der Propeller steht still. #sprecher:erzaehler
    -> END
}
~ angesehenLuftboot = true
Ein flaches Boot mit einem Propeller so groß wie ein Scheunentor. Auf der Bank liegt ein Schachbrett mit einem Stein darauf, gegen den Wind. #sprecher:erzaehler
-> END

=== sperre_hochwasser ===
// Nur beim ersten Mal ein Satz; danach geht der Held ohne Unterbrechung durch.
{hochwasserGesehen: -> END}
~ hochwasserGesehen = true
Das Wasser steht knöcheltief über den Planken. Mit Gummistiefeln geht es, langsam. #sprecher:erzaehler
-> END

// ---------------------------------------------------------------- Sammelstränge (Dokument 15, Abschnitt 1)

=== seite05 ===
{seite05Gefunden:
    Am Ufer liegt nur noch Moos. #sprecher:erzaehler
    -> END
}
~ seite05Gefunden = true
~ buchseiten = buchseiten + 1
Am Ufer klebt ein Blatt an einer Wurzel. Eine Seite aus einem Handbuch, Kapitel 5. #sprecher:erzaehler
~ gibFund("seite05")
-> END

=== finch_bauer_c ===
{finchBauerCGefunden:
    Die Reuse ist leer bis auf Schlamm. #sprecher:erzaehler
    -> END
}
~ finchBauerCGefunden = true
~ finchFiguren = finchFiguren + 1
An der Reuse am Steg hängt ein kleiner Fink aus Blech. Zwischen den Maschen steckt ein weißer Bauer aus hellem Holz. #sprecher:erzaehler
~ gibFund("finchBauerC")
Unter dem Bauern ist ein Feld eingebrannt. Wer versteckt Schachfiguren in Fischreusen? #sprecher:ambrose
-> END
