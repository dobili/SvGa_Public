// Ort: Klavierwerkstatt Whitlock-Duval in der Rue des Facteurs, Port Delacroix (Akt 3). Figuren:
// Henri und Céleste Whitlock-Duval; Gegenstand: die Werkbank (Story-Bibel 19.4).
//
// Szenen der Bibel (Abschnitt 20): 66 Flashback „Die Werkstatt“ (Runde
// portDelacroix.flashbackWerkstatt, Quest gleichen Namens, Partiefragment 5) und 68 Die Familie
// (Quest portDelacroix.nachfahren, O2): Henri zeigt das alte Foto, Ambrose bricht sein Schweigen,
// Céleste spielt eine Partie aus Neugier (Begegnung portDelacroix.celeste).
// Einstiege wie in orte.json: henri, celeste, werkbank.
//
// Runde 11 (13.11.2026): Kapitel 38 nach dem Roman (roman/akt3_teil2.md): das Schild
// Whitlock-Duval, „Hier war es“ aus dem Geigenkasten, die goldene Erinnerung 1840 (Klötzchen aus
// Tastenholz) und 1852 (Claire, „Dann eben, wenn du tot bist“), danach Ambroses einer Satz:
// „Deshalb bist du hier.“ Klang: ambrose.verstimmt, stimmton, ambrose.vierhaendig.
//
// Kapitel 40 nach dem Roman: der Leim umsonst, das ovale Foto („Das bin ich“), Céleste mit dem
// Skateboard spielt auf dem alten Brett, „Mit dir.“ Klang: ambrose.verstimmt, celeste, ambrose.held.
//
// Der Flashback läuft vorerst ohne eigene Sepia-Karte als Zugraten an der Werkbank (Bericht
// mittel-1, fünfzehnter Auftrag). Variablen: ausgangPortDelacroixCeleste und
// flashbackWerkstattBestanden setzt die Hülle (R42); ambroseSprichtWieder setzt diese Datei.

EXTERNAL beginnePartie(begegnung)
EXTERNAL beginneAufgaben(runde)

VAR leimAuftrag = false
VAR odileHandGegeben = false
VAR tiefpunktGesehen = false
VAR ambroseSprichtWieder = false
VAR henriGetroffen = false
VAR fotoAmbroseGesehen = false
VAR ausgangPortDelacroixCeleste = ""
VAR flashbackWerkstattBestanden = false
VAR claireErzaehlt = false
VAR angesehenFotoWand = false
VAR angesehenLaptop = false

// ---------------------------------------------------------------- Henri

=== henri ===
{
- not tiefpunktGesehen: -> henri_vorher
- not odileHandGegeben: -> henri_vorher
- not fotoAmbroseGesehen: -> henri_foto
- else: -> henri_alltag
}

=== henri_vorher ===
{henriGetroffen:
    Henri stimmt ein Klavier. Er hebt kurz die Hand, ohne aufzusehen. #sprecher:erzaehler
    -> END
}
~ henriGetroffen = true
Ein Mann mit Sägemehl in den Augenbrauen kommt dir entgegen. Er lacht viel und arbeitet dabei weiter. #sprecher:erzaehler
Henri Whitlock-Duval. {leimAuftrag:Leim für den Club? Natürlich für den Club. Umsonst.|Klavierbauer, seit sechs Generationen.} #sprecher:henri
Meine Großmutter hat dort Klavier gespielt, wenn die Herren ihre Partien hatten. Das einzige Publikum, das nie klatscht und nie geht. #sprecher:henri
Ein Klavier hat zweihundertdreißig Saiten. Ihr Spiel hat nur vierundsechzig Felder? Klingt erholsam. #sprecher:henri
-> END

=== henri_foto ===
~ fotoAmbroseGesehen = true
~ henriGetroffen = true
Durch ein Loch im Dach, über das eine Plane gespannt ist, fällt blaues Licht. Die Werkbank steht an derselben Stelle. #sprecher:erzaehler
Das hier wird Sie interessieren, wenn Sie Schach mögen. #sprecher:henri
Ein ovales Foto, sehr alt, braun. Ein junger Mann im Rock mit hohem Kragen, vor ihm ein Schachbrett. #sprecher:erzaehler
Ein Vorfahr. Keiner weiß mehr, wer. Ein Bruder von irgendwem. #sprecher:henri
Er soll weggegangen sein, nach New Orleans, und nie wiedergekommen. #sprecher:henri
Die Familie hat nicht gern von ihm gesprochen. Ein Spieler, hieß es. Ich fand, er sieht nett aus. #sprecher:henri
* [Das Foto ansehen]
- Der Deckel des Geigenkastens ist zu. Du hast ihn nicht angerührt. #sprecher:erzaehler #musik:aus #pause:2
Das bin ich. #sprecher:ambrose #stimmung:still #musik:ambrose.verstimmt
* [Hinsehen]
- Du siehst ihn, zum ersten Mal seit sechs Tagen: schmal, hochgeschlossen, blasser als früher. #sprecher:erzaehler
Ich erinnere mich an den Tag. Man musste eine Minute lang nicht atmen. Ich habe an einen Zug gedacht. #sprecher:ambrose
Henri hört ihn nicht. Er leimt. #sprecher:erzaehler
Keiner weiß mehr, wer. Ein Spieler. Sie haben nicht gern von mir gesprochen. #sprecher:ambrose #stimmung:traurig
* [„Ambrose …“]
- Nein. Lass. Sechs Generationen. Sie haben weitergemacht. Jede Saite muss stimmen. #sprecher:ambrose
Mein Vater hätte ihn sehr gemocht. #sprecher:ambrose #stimmung:still
* [Nichts sagen]
- Eine Tür schlägt. Ein Mädchen, fünfzehn vielleicht, ein Skateboard unter dem Arm, Kopfhörer um den Hals. #sprecher:erzaehler #musik:celeste
Papa, hast du mein Ladekabel … Oh. Besuch. Schach? Das ist doch was für alte Leute. #sprecher:celeste
Für sehr alte. #sprecher:ambrose #stimmung:lacht
Du musst lachen. Es ist das erste Mal seit der Turnhalle. #sprecher:erzaehler
-> END

=== henri_alltag ===
{~Das Dach ist fast dicht. Die Klaviere danken es uns.|Für das Musikhaus stifte ich ein Klavier. Das alte da hinten, es klingt wie ein Gewitter.|Céleste macht Musik mit dem Laptop. Ich verstehe es nicht, aber es hat Takt.} #sprecher:henri
-> END

// ---------------------------------------------------------------- Céleste

=== celeste ===
{
- not fotoAmbroseGesehen:
    Ein Mädchen mit Kopfhörern tippt auf einem Laptop. Sie nickt dir zu und tippt weiter. #sprecher:erzaehler
    -> END
- ausgangPortDelacroixCeleste == "" or ausgangPortDelacroixCeleste == "abgebrochen": -> celeste_angebot
- not ambroseSprichtWieder: -> celeste_nach_partie
- else: -> celeste_alltag
}

=== celeste_angebot ===
Céleste sieht auf den Hocker. Du hast den Geigenkasten aufgemacht, ohne es zu merken. #sprecher:erzaehler
Das sieht cool aus. Das ist ja richtig alt. Darf ich? #sprecher:celeste
Sie fährt mit dem Finger über die Buchstaben am Rand: A. W. 1857. Sie hat sein Kinn. Und die Hände. #sprecher:erzaehler
* [„Kannst du es?“]
- Ich weiß, wie die Dinger ziehen. Ungefähr. Also, ich schieb die Pferde einfach rum, okay? #sprecher:celeste
Die Stellung, die niemand anrührt, hast du auf Junos Reisebrett übertragen. Er hat genickt. #sprecher:erzaehler
+ [„Okay. Eine Partie.“]
    ~ beginnePartie("portDelacroix.celeste")
    -> END
+ [„Ein andermal.“]
    Kein Stress. Ich bin eh am Mixen. #sprecher:celeste
    -> END

=== celeste_nach_partie ===
~ ambroseSprichtWieder = true
Einmal, ganz zufällig, stellt Céleste einen Springer auf ein Feld, auf das er gehört. #sprecher:erzaehler
Hast du das gesehen? Das hat sie von … #sprecher:ambrose #stimmung:froh
Er bricht ab. Er lächelt über sich selbst. #sprecher:erzaehler
Okay. Das war nicht so schlecht. Aber ich geh jetzt skaten. #sprecher:celeste
Draußen rattert das Skateboard über das Pflaster, kleiner werdend. Ambrose sieht ihr nach. #sprecher:erzaehler
* [Warten]
- Sie muss es nicht lieben. Es reicht, dass sie einmal gespielt hat. Auf diesem Brett. #sprecher:ambrose #stimmung:froh
Ich wollte, dass alles, was ich war, Schach ist. Eine Fußnote, sechs Wörter, und ich war beleidigt. #sprecher:ambrose
Und hier hängt mein Gesicht an der Wand, keiner weiß, wem es gehört, und sie bauen Klaviere und sind glücklich. #sprecher:ambrose
* [„Macht dir das nichts aus?“]
- Doch. Ein wenig. Aber weniger, als ich dachte. #sprecher:ambrose #stimmung:lacht
Er sieht dich an, richtig, zum ersten Mal seit einer weißen, flackernden Nacht. #sprecher:erzaehler
Es reicht, dass es Menschen gibt, die weitermachen. Mit Klavieren. #sprecher:ambrose #pause
Mit dir. #sprecher:ambrose #stimmung:froh #musik:ambrose.held
* [Nichts sagen können]
- Ich schulde dir eine Antwort. Auf eine Frage. Ich habe sie noch nicht. #sprecher:ambrose
Aber ich weiß jetzt, dass ich sie am falschen Ort gesucht habe. #sprecher:ambrose
-> END

=== celeste_alltag ===
{~Céleste ist skaten. Auf ihrem Laptop klebt ein Zettel: „Bin weg. Pferde rumschieben war okay.“|Céleste hört Musik und wippt mit dem Fuß. Sie hebt kurz den Daumen.} #sprecher:erzaehler
-> END

// ---------------------------------------------------------------- Werkbank und Flashback

=== werkbank ===
{
- not leimAuftrag:
    Eine alte Werkbank voller Späne. Henri arbeitet hier. Du hast keinen Grund, sie anzufassen. #sprecher:erzaehler
    -> END
- flashbackWerkstattBestanden and not claireErzaehlt: -> werkbank_nach_flashback
- flashbackWerkstattBestanden:
    Auf der Werkbank liegen Späne. Sie riechen wie vor hundertachtzig Jahren. #sprecher:erzaehler
    -> END
- else: -> werkbank_flashback
}

=== werkbank_flashback ===
Über der Tür hängt ein Schild, neuer als die anderen, die Buchstaben alt: „Whitlock-Duval. Facteurs de pianos depuis 1826.“ #sprecher:erzaehler
Frisch gehobeltes Holz. Leim, warm. Etwas Harziges. Ein Geruch, den du kennst, ohne ihn zu kennen. #sprecher:erzaehler
Im Geigenkasten unter deinem Arm bewegt sich nichts. Aber du hörst ihn. Zum ersten Mal seit fünf Tagen. #sprecher:erzaehler
Hier. Hier war es. #sprecher:ambrose #stimmung:fern #musik:ambrose.verstimmt
Mehr nicht. Aber die Werkstatt wird golden. #sprecher:erzaehler
+ [Mitgehen]
    -> werkstatt_1840
+ [Zurück in die Gegenwart]
    Das Gold verblasst. Henri hobelt, Céleste tippt. #sprecher:erzaehler
    -> END

// Erinnerung 1840: das Brett aus Abfallholz, die Figuren aus Tastenholz.
=== werkstatt_1840 ===
Du bist klein. Der Boden ist nah. Um dich liegen Späne, helle Locken, knöcheltief. #sprecher:erzaehler #musik:stimmton
„Fegen, Ambrose. Nicht spielen.“ Ein Mann schlägt eine Saite an, lauscht, dreht an etwas, schlägt wieder an. #sprecher:erzaehler
* [„Papa. Was machst du da?“]
- „Ich suche den Ton. Er ist da drin. Man muss ihm nur helfen.“ #sprecher:erzaehler
Du stellst Klötzchen aus Tastenholz auf die Werkbank. Er legt das Werkzeug hin und ritzt acht mal acht Linien in ein Abfallbrett. #sprecher:erzaehler
Das größte ist der König. Das gerade der Turm. Das schiefe, beim Sägen verrutscht, ist das Pferd. #sprecher:erzaehler
„Ein Klavier und ein Schachbrett haben eines gemeinsam, Ambrose. Jede Taste, jede Figur muss ihren Platz kennen. Dann klingt es.“ #sprecher:erzaehler
* [Die Späne fliegen auf]
    -> werkstatt_1852

// Erinnerung 1852: das neue Brett, noch ohne die Buchstaben am Rand; Claire auf dem Schemel.
=== werkstatt_1852 ===
Du bist groß. Die Stiefel aus London drücken. Der Mann an der Werkbank hat graues Haar. #sprecher:erzaehler #musik:ambrose.vierhaendig
Auf einem Schemel sitzt ein Mädchen von vielleicht acht Jahren, in einem Kleid mit Leimflecken. „Zeig es noch mal. Das mit dem Turm.“ #sprecher:erzaehler
Auf der Werkbank steht ein Brett, helles Holz und dunkles, die Ecken noch scharf. Der Rand ist glatt und leer. #sprecher:erzaehler
+ [Die Partie vorspielen]
    ~ beginneAufgaben("portDelacroix.flashbackWerkstatt")
    -> END
+ [Zurück in die Gegenwart]
    Das Gold verblasst. Henri hobelt, Céleste tippt. #sprecher:erzaehler
    -> END

=== werkbank_nach_flashback ===
// Gutachten L3.6: startet nach der Runde von selbst (runden.json „danach“).
{not flashbackWerkstattBestanden: Das Gold verblasst. Henri hobelt, Céleste tippt. #sprecher:erzaehler}
{not flashbackWerkstattBestanden: -> END}
{claireErzaehlt: -> END}
~ claireErzaehlt = true
„Er lässt ihn stehen? Den ganzen Läufer? Das ist doch Verschwendung.“ – „Das ist Musik, Papa.“ #sprecher:erzaehler #musik:ambrose.vierhaendig
Bei jedem Opfer klatscht Claire. Sie versteht nichts davon. Sie klatscht, weil du so strahlst. #sprecher:erzaehler
* [Claire zusehen]
- „Wenn ich groß bin, will ich das Brett haben.“ #sprecher:erzaehler
„Es ist meines. Ich habe es gerade erst gebaut.“ #sprecher:erzaehler
„Dann eben, wenn du tot bist.“ #sprecher:erzaehler #pause
„Claire!“, sagt dein Vater. Du lachst. Du bist einundzwanzig, und du hast alle Zeit der Welt. #sprecher:erzaehler
* [„Abgemacht. Aber du musst darauf aufpassen.“]
- „Ich pass immer auf“, sagt Claire. #sprecher:erzaehler
Das Gold verblasst. Du stehst in der Werkstatt, dein Gesicht ist nass, und du weißt nicht, ob es deine Tränen sind. #sprecher:erzaehler #musik:aus
Claire. Sie hat nach Norden geheiratet. In eine Stadt mit einem Wasserfall. Sie hat das Brett geerbt. #sprecher:ambrose #stimmung:still
Sie hat aufgepasst. Und ihre Tochter. Und deren Tochter. Bis zu einer alten Frau, die es sechzig Jahre abgestaubt hat. #sprecher:ambrose #stimmung:still
* [Warten]
- Deshalb bist du hier. #sprecher:ambrose #stimmung:still #pause:2
Dann schweigt er wieder. Es war sein einer Satz für diesen Tag, und er hat ihn längst verbraucht. #sprecher:erzaehler
-> END

// ---------------------------------------------------------------- Ansehen (Runde 6)

=== foto_wand ===
{
- fotoAmbroseGesehen:
    Das ovale Foto: ein junger Mann im Rock mit hohem Kragen, vor ihm ein Schachbrett. Er kann es kaum erwarten, dass das Stillsitzen vorbei ist. #sprecher:erzaehler
- angesehenFotoWand:
    Das Foto hängt schief. Henri weiß sicher, wer darauf ist. #sprecher:erzaehler
- else:
    ~ angesehenFotoWand = true
    An der Wand hängt ein altes Foto in einem ovalen Rahmen, braun und blass. Henri weiß sicher, wer darauf ist. #sprecher:erzaehler
}
-> END

=== laptop ===
{angesehenLaptop:
    Auf dem Bildschirm läuft eine Partie. Célestes Figuren stehen sehr weit vorn. #sprecher:erzaehler
    -> END
}
~ angesehenLaptop = true
Célestes Laptop, zwischen Hobelspänen. Auf dem Bildschirm eine Tabelle mit Eröffnungen, daneben ein Zettel: „Nicht anfassen. Ich weiß, wo alles ist.“ #sprecher:erzaehler
-> END
