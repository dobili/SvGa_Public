// Ort: Klavierwerkstatt Whitlock-Duval in der Rue des Facteurs, Port Delacroix (Akt 3). Figuren:
// Henri und Céleste Whitlock-Duval; Gegenstand: die Werkbank (Story-Bibel 19.4).
//
// Szenen der Bibel (Abschnitt 20): 66 Flashback „Die Werkstatt“ (Runde
// portDelacroix.flashbackWerkstatt, Quest gleichen Namens, Partiefragment 5) und 68 Die Nachfahren
// (Quest portDelacroix.nachfahren, O2): Henri zeigt das alte Foto, Ambrose bricht sein Schweigen,
// Céleste spielt eine Partie aus Neugier (Begegnung portDelacroix.celeste).
// Einstiege wie in orte.json: henri, celeste, werkbank.
//
// Runde 11 (13.11.2026): Kapitel 38 nach dem Roman (roman/akt3_teil2.md): das Schild
// Whitlock-Duval, „Hier war es“ aus dem Geigenkasten, die goldene Erinnerung 1840 (Klötzchen aus
// Tastenholz) und 1852 (Claire, „Dann eben, wenn du tot bist“), danach Ambroses einer Satz:
// „Deshalb bist du hier.“ Klang: ambrose.verstimmt, stimmton, ambrose.vierhaendig.
//
// Der Flashback läuft vorerst ohne eigene Sepia-Karte als Zugraten an der Werkbank (Bericht
// mittel-1, fünfzehnter Auftrag). Variablen: ausgangPortDelacroixCeleste und
// flashbackWerkstattBestanden setzt die Hülle (R42); ambroseSprichtWieder setzt diese Datei.

EXTERNAL beginnePartie(begegnung)
EXTERNAL beginneAufgaben(runde)

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
- not fotoAmbroseGesehen: -> henri_foto
- else: -> henri_alltag
}

=== henri_vorher ===
{henriGetroffen:
    Henri stimmt ein Klavier. Er hebt kurz die Hand, ohne aufzusehen. #sprecher:erzaehler
    -> END
}
~ henriGetroffen = true
Es riecht nach Leim und frisch gehobeltem Holz. Ein Mann mit Bleistift hinter dem Ohr kommt dir entgegen. #sprecher:erzaehler
Henri Whitlock-Duval. Klavierbauer, wie mein Vater und sein Vater. Der Sturm hat das Dach erwischt, nicht die Klaviere. #sprecher:henri
Ein Klavier hat zweihundertdreißig Saiten. Ihr Schach hat nur vierundsechzig Felder? Klingt erholsam. #sprecher:henri
-> END

=== henri_foto ===
~ fotoAmbroseGesehen = true
~ henriGetroffen = true
Henri führt dich durch die Werkstatt, vorbei an Klavieren ohne Deckel und Kisten voller Tasten. #sprecher:erzaehler
An der Wand hängt ein altes Foto: ein junger Mann mit einem Schachbrett unter dem Arm. #sprecher:erzaehler
Ein Vorfahr. Keiner weiß mehr, wer. Das Brett hat er wohl selbst gebaut, in dieser Werkstatt. #sprecher:henri
Das bin ich. #sprecher:ambrose #pause
Henri hat nichts gehört. Er erzählt weiter von Saiten und Hämmern. Du siehst lange auf das Foto. #sprecher:erzaehler
Hinten in der Werkstatt sitzt ein Mädchen mit Kopfhörern auf einer Werkbank und schaut neugierig herüber. #sprecher:erzaehler
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
Céleste nimmt die Kopfhörer ab und zeigt auf deinen Rucksack. #sprecher:erzaehler
Schach ist was für alte Leute. Aber das Brett da sieht cool aus. #sprecher:celeste
Also, ich schieb die Pferde einfach rum, okay? #sprecher:celeste
+ [„Okay. Eine Partie.“]
    ~ beginnePartie("portDelacroix.celeste")
    -> END
+ [„Ein andermal.“]
    Kein Stress. Ich bin eh am Mixen. #sprecher:celeste
    -> END

=== celeste_nach_partie ===
~ ambroseSprichtWieder = true
Okay, das war nicht so schlecht. Aber ich geh jetzt skaten. #sprecher:celeste
Sie klemmt sich das Brett unter den Arm, merkt es, lacht und gibt es dir zurück. Dann ist sie weg. #sprecher:erzaehler
Sie muss es nicht lieben. Es reicht, dass sie einmal gespielt hat. #sprecher:ambrose #stimmung:froh
Ich wollte, dass alles, was ich war, Schach ist. #sprecher:ambrose
Hier sehe ich: Es reicht, dass es Menschen gibt, die weitermachen. Mit Klavieren. Mit dir. #sprecher:ambrose
* [„Du redest wieder.“]
    Ich habe zugehört. Das war nötig. #sprecher:ambrose
* [Nichts sagen und das Brett festhalten]
    Du hältst das Brett ein bisschen fester als sonst. #sprecher:erzaehler
- -> END

=== celeste_alltag ===
{~Céleste ist skaten. Auf ihrem Laptop klebt ein Zettel: „Bin weg. Pferde rumschieben war okay.“|Céleste hört Musik und wippt mit dem Fuß. Sie hebt kurz den Daumen.} #sprecher:erzaehler
-> END

// ---------------------------------------------------------------- Werkbank und Flashback

=== werkbank ===
{
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
~ claireErzaehlt = true
„Er lässt ihn stehen? Den ganzen Läufer? Das ist doch Verschwendung.“ – „Das ist Musik, Papa.“ #sprecher:erzaehler #musik:ambrose.vierhaendig
Bei jedem Opfer klatscht Claire. Sie versteht nichts davon. Sie klatscht, weil du so strahlst. #sprecher:erzaehler
„Wenn ich groß bin, will ich das Brett haben.“ – „Es ist meines.“ – „Dann eben, wenn du tot bist.“ #sprecher:erzaehler
* [„Abgemacht. Aber du musst darauf aufpassen.“]
- „Ich pass immer auf“, sagt Claire. #sprecher:erzaehler
Das Gold verblasst. Du stehst in der Werkstatt, dein Gesicht ist nass, und du weißt nicht, ob es deine Tränen sind. #sprecher:erzaehler #musik:aus
Claire. Sie hat nach Norden geheiratet. In eine Stadt mit einem Wasserfall. Sie hat das Brett geerbt. #sprecher:ambrose #stimmung:still
Sie hat aufgepasst. Und ihre Tochter. Und deren Tochter. Bis zu einer alten Frau, die es sechzig Jahre abgestaubt hat. #sprecher:ambrose #stimmung:still
* [Warten]
- Deshalb bist du hier. #sprecher:ambrose #stimmung:still #pause:2
Dann schweigt er wieder. Es war sein einer Satz für diesen Tag. #sprecher:erzaehler
-> END

// ---------------------------------------------------------------- Ansehen (Runde 6)

=== foto_wand ===
{
- fotoAmbroseGesehen:
    Das alte Foto: ein junger Mann an einem Brett, um ihn herum Musiker. Ambrose sagt nichts mehr dazu. #sprecher:erzaehler
- angesehenFotoWand:
    Das Foto hängt schief. Henri weiß sicher, wer darauf ist. #sprecher:erzaehler
- else:
    ~ angesehenFotoWand = true
    An der Wand hängt ein altes Foto in einem Holzrahmen: ein Brett, ein Tisch, Menschen mit Instrumenten. Das Glas ist gesprungen. #sprecher:erzaehler
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
