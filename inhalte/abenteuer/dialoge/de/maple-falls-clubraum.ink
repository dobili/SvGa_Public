// Ort: Clubraum der Maple Falls High (Akt 1). Figuren: Coach Delgado, Sam, Juno, Victor Hale,
// Graham Hale.
//
// Szenen der Story-Bibel (docs/spiel/05_Story_Bibel.md, Abschnitt 4): 5 Erster Schultag, zweiter
// Teil (akt1.ersterSchultag), 6 Aufgabenreihe (Runden mapleFalls.reiheSam, mapleFalls.reiheJuno),
// 9 Sams Dame (mapleFalls.samsDame), 11 Clubkampf (akt1.clubnadelMapleFalls), 12 Victor
// (akt1.victorTrifft, akt1.victorNiederlage oder akt1.victorUeberrascht, Regelwerk R33).
// Einstiege: „coach“, „sam“, „juno“, „victor“. In orte.json gibt es für Juno im Clubraum und für
// Victor keine eigene Figur; der Coach führt deshalb zu beiden (Befund mittel-1, Gesamtsimulation). Nach einer Partie oder Aufgabenrunde spricht der
// Held die Figur wieder an; ihr Einstieg verzweigt dann über die Variablen, die die Hülle setzt
// (regeln/dialogvariablen.ts): ausgangMapleFalls… (sieg, remis, niederlage, abgebrochen),
// …Bestanden, nadelMapleFalls. „abgebrochen“ zählt wie nicht gespielt (Regelwerk R35).

EXTERNAL beginnePartie(begegnung)
EXTERNAL beginneAufgaben(runde)
EXTERNAL setzeSzene(kennung)

VAR held = "Du"
VAR ambroseVertrauen = 0
VAR clubBeigetreten = false
VAR samGetroffen = false
VAR samKlagt = false
VAR samVersoehnt = false
VAR reiheSamBestanden = false
VAR reiheJunoBestanden = false
VAR todsuendenBestanden = false
VAR ausgangMapleFallsSamRevanche = ""
VAR ausgangMapleFallsClubkampf = ""
VAR nadelMapleFalls = 0
VAR clubkampfBesprochen = 0
VAR victorGesehen = false
VAR ausgangMapleFallsVictor = ""
VAR victorUeberrascht = 0
VAR kenntHale = false
// Neu nach dem Roman zu Akt 1 (Kapitel 8): heimwegNadelGesehen setzt diese Datei.
VAR heimwegNadelGesehen = false

// ---------------------------------------------------------------- Coach Delgado

=== coach ===
{
- not clubBeigetreten: -> coach_erstes_treffen
- not (reiheSamBestanden and reiheJunoBestanden): -> coach_reihe_offen
- nadelMapleFalls > clubkampfBesprochen: -> coach_nach_sieg
- nadelMapleFalls > 0 and not kenntHale: -> victor
- nadelMapleFalls == 0 and ausgangMapleFallsClubkampf == "niederlage": -> coach_nach_niederlage
- nadelMapleFalls == 0: -> coach_clubkampf
- else: -> coach_alltag
}

=== coach_erstes_treffen ===
// Szene 5, zweiter Teil, nach dem Roman, Kapitel 5, und der Dialogprüfung (VM30 bis VM33).
~ clubBeigetreten = true
Raum 12, Erdgeschoss, Blick auf den Fahnenmast. Die Tische sind zu vier Inseln zusammengeschoben. Pokale von 1994, ein Plakat: ERST ZÄHLEN. #sprecher:erzaehler
Aufstellung! Juno, wen bringst du mir da? #sprecher:coachDelgado #klang:klatschen
Ein viertes Brett, Coach. #sprecher:juno #stimmung:froh
Na, das wollen wir sehen. Delgado. Mathe in der Sechsten und Achten, Schach immer. #sprecher:coachDelgado
Willkommen im Team, das noch keins ist. Wir arbeiten dran. #sprecher:coachDelgado #stimmung:froh
Kreisliga spielt man zu viert. Wer die Clubnadel holt, spielt mit. Die Nadel holt man gegen mich. #sprecher:coachDelgado
* [„Gegen Sie?“]
    Gegen mich. Aber vorher zeigst du mir, dass du zählen kannst. Sam und Juno haben Aufgaben für dich. #sprecher:coachDelgado
* [„Was muss ich tun?“]
    Erst die Aufgaben von Sam und Juno. Dann eine Partie gegen mich. #sprecher:coachDelgado
- Das ist hier Gesetz, und ich bin die Polizei. #sprecher:coachDelgado #stimmung:froh #klang:pfiff
Am Fenster sitzt ein Junge, die Füße auf dem Stuhl. Er hat die ganze Zeit zugehört, ohne herzusehen. Das ist Sam. #sprecher:erzaehler
Auf einem der Bretter fehlt die schwarze Dame. An ihrer Stelle steht ein Radiergummi. #sprecher:erzaehler
Ein Radiergummi als Dame. Ich habe Schlimmeres gesehen. Aber nicht oft. #sprecher:ambrose
~ setzeSzene("akt1.ersterSchultag")
-> END

=== coach_reihe_offen ===
{
- not reiheSamBestanden: Fang mit Sam an, dann kommt Juno. #sprecher:coachDelgado
- else: Sam hast du geschafft. Jetzt noch Juno. Sie hat die Aufgaben selbst aufgeschrieben. #sprecher:coachDelgado
}
{reiheSamBestanden:
    Juno winkt dir vom Nebentisch zu, ein Heft in der Hand. #sprecher:erzaehler
    -> juno
}
-> END

=== coach_clubkampf ===
Die Aufgaben sind erledigt. Dann ist es so weit: du gegen mich, um die Clubnadel. #sprecher:coachDelgado #klang:pfiff
Ich spiele ehrlich. Du auch. Und danach gibt es Kekse, egal wie es ausgeht. #sprecher:coachDelgado
* [„Ich bin bereit.“]
    Sie sieht nur ihren eigenen Angriff. Das ist dein Fenster. #sprecher:ambrose
    -> coach_partie
* [„Noch nicht.“]
    Kein Problem. Das Brett läuft nicht weg. #sprecher:coachDelgado
    -> END

=== coach_partie ===
~ beginnePartie("mapleFalls.clubkampf")
-> END

=== coach_nach_sieg ===
~ clubkampfBesprochen = nadelMapleFalls
{ausgangMapleFallsClubkampf == "remis":
    Remis! Das war knapp. #sprecher:coachDelgado
    Die Bronzenadel hast du. Noch einmal, wenn du willst? #sprecher:coachDelgado
- else:
    Gute Partie! Mein Angriff war schön, nur leider nicht für mich. #sprecher:coachDelgado #stimmung:froh #klang:pfiff
}
Viertes Brett, du bist dran. Samstag spielen wir in Cedar Creek. #sprecher:coachDelgado
Hier, deine Clubnadel. Juno klebt sie gleich ins Tagebuch. #sprecher:coachDelgado
Dein erster Sieg in einem Club, Lehrling. Merk dir dieses Gefühl. #sprecher:ambrose #stimmung:stolz
Es kommt seltener, als man glaubt. #sprecher:ambrose
Und noch ein Versprechen, nenn es Mentor-Zug: Einmal ziehe ich für dich. Ich hoffe, du brauchst es nie. #sprecher:ambrose
{not heimwegNadelGesehen:
    -> pratt_und_heimweg ->
}
~ setzeSzene("akt1.clubnadelMapleFalls")
-> END

=== coach_nach_niederlage ===
Das war nichts für heute. Aber du hast in der Eröffnung gut gekämpft. #sprecher:coachDelgado
Noch einmal? Ich habe Zeit. Und Kekse. #sprecher:coachDelgado
* [„Noch einmal.“]
    -> coach_partie
* [„Nicht jetzt.“]
    Kein Problem. Das Brett wartet. #sprecher:coachDelgado
    -> END

=== coach_alltag ===
{nadelMapleFalls < 3:
    {~Noch einmal um die Nadel? Gold gibt es nur für eine Partie ganz ohne Hilfe. Sag Bescheid.|Samstag Cedar Creek. Pünktlich am Bus, sonst pfeife ich.} #sprecher:coachDelgado
- else:
    {~Goldnadel! Ganz ohne Hilfe! Ich erzähle es jedem, der zuhört.|Samstag Cedar Creek. Pünktlich am Bus, sonst pfeife ich.} #sprecher:coachDelgado #stimmung:froh
}
+ {nadelMapleFalls > 0 and nadelMapleFalls < 3} [„Noch eine Partie um die Nadel.“]
    -> coach_partie
+ [„Bis morgen, Coach.“]
    -> END

// ---------------------------------------------------------------- Nach der Nadel (Roman, Kapitel 8)

// Neu gegenüber der Story-Bibel: Mr. Pratt an der Tür (die Stadt nimmt den Sieg wahr) und das
// Heimweg-Gespräch, der erste Schritt in Ambroses Bogen (schön gegen richtig). Nur nach der
// ersten Nadel, etwa eine Minute. Klang: nach der Siegfanfare Stille, dann Abendgeräusche; die
// Laternen gehen an. Vorgemerkt für mittel-2: #pause:3 vor „Nein. Das ist das Merkwürdige.“
=== pratt_und_heimweg ===
~ heimwegNadelGesehen = true
An der Tür steht der Hausmeister, einen Lappen in der Hand, und sieht auf die Pokale von 1994. #sprecher:erzaehler
Die haben auch gezählt. Bevor sie geschlagen haben. #sprecher:pratt
Dann geht er wieder. #sprecher:erzaehler
Auf dem Heimweg sagt Ambrose lange nichts. Ahornblätter auf dem Gehweg. Die Laternen gehen an, eine nach der anderen. #sprecher:erzaehler #pause
Es war keine schöne Partie. #sprecher:ambrose
* [„Ich habe sie aber nicht verloren.“]
    Nein. Du hast gezählt, bis nichts mehr übrig war. Buchhaltung, Zug um Zug. #sprecher:ambrose
* [„Was ist eine schöne Partie?“]
    Eine, über die man noch in hundert Jahren spricht. Über diese spricht man morgen. #sprecher:ambrose
- Zu meiner Zeit hätte man so etwas nicht aufgeschrieben. #sprecher:ambrose #stimmung:streng
* [„Bist du enttäuscht?“]
- Er bleibt unter einer Laterne stehen. Man sieht fast durch ihn hindurch. #sprecher:erzaehler #pause
Nein. #sprecher:ambrose #stimmung:still
Nein. Das ist das Merkwürdige. #sprecher:ambrose #stimmung:still
->->

// ---------------------------------------------------------------- Sam

=== sam ===
{
- not samGetroffen: -> sam_erstes_treffen
- not reiheSamBestanden: -> sam_reihe
- not samKlagt: -> sam_klagt
- not todsuendenBestanden: -> sam_klagt_wieder
- todsuendenBestanden and (ausgangMapleFallsSamRevanche == "" or ausgangMapleFallsSamRevanche == "abgebrochen"): -> sam_revanche_angebot
- ausgangMapleFallsSamRevanche == "sieg" and not samVersoehnt: -> sam_nach_revanche
- ausgangMapleFallsSamRevanche != "" and ausgangMapleFallsSamRevanche != "sieg": -> sam_revanche_angebot
- else: -> sam_alltag
}

=== sam_erstes_treffen ===
~ samGetroffen = true
Viertes Brett? Wir haben ein erstes Brett. Mich. Reicht doch. #sprecher:sam
Ich spiel Dame raus in Zug zwei. Funktioniert immer. #sprecher:sam
Fast immer. #sprecher:coachDelgado
Fast immer. #sprecher:sam
Dann grinst er, weil er nicht anders kann. #sprecher:erzaehler
* [„Zeig mir deine Aufgaben.“]
    -> sam_reihe
* [„Gleich.“]
    Klar. Wenn du dich traust. #sprecher:sam
    -> END

=== sam_reihe ===
Hier. Die Figur steht da wie geschenkt. Na los, nimm sie. #sprecher:sam
* [„Erst zählen.“]
    Langweilig. Aber gut. #sprecher:sam
    ~ beginneAufgaben("mapleFalls.reiheSam")
    -> END
* [„Gleich.“]
    -> END

=== sam_klagt ===
// Szene 9 nach dem Roman, Kapitel 6, und der Dialogprüfung (VM48 bis VM51).
~ samKlagt = true
Sam liegt mit dem Kopf auf dem Tisch. #sprecher:erzaehler
Die Chefin wurde gefangen. Schon wieder. Das zählt nicht, das war Pech! #sprecher:sam
Wie oft war es Pech? Ich hab elfmal. #sprecher:juno
Du schreibst das auf? #sprecher:sam
Ich schreibe alles auf. #sprecher:juno #stimmung:froh
* [„Soll ich dir zeigen, warum?“]
    Du? Mir? … Okay. Okay. Zeig mir das noch mal mit dem Zählen. #sprecher:sam
    ~ beginneAufgaben("mapleFalls.todsuenden")
    -> END
* [„Pech gibt es nicht im Schach.“]
    Pff. Du klingst wie der Coach. #sprecher:sam
    Na gut. Zeig mir, was du meinst. #sprecher:sam
    ~ beginneAufgaben("mapleFalls.todsuenden")
    -> END

=== sam_klagt_wieder ===
Und? Zeigst du mir jetzt, warum die Chefin immer gefangen wird? #sprecher:sam
* [„Ja, los.“]
    ~ beginneAufgaben("mapleFalls.todsuenden")
    -> END
* [„Gleich.“]
    -> END

=== sam_revanche_angebot ===
{ausgangMapleFallsSamRevanche == "":
    Okay. Die Dame bleibt erst mal zu Hause. Revanche? Jetzt? #sprecher:sam
- else:
    Noch mal! Diesmal mache ich alles richtig. Fast alles. #sprecher:sam
}
* [„Revanche.“]
    ~ beginnePartie("mapleFalls.samRevanche")
    -> END
* [„Gleich.“]
    -> END

=== sam_nach_revanche ===
// Der Tipp zur Trainerin ist Sams Lohn nach der Revanche (Roman, Kapitel 6; Dialogprüfung VM49).
~ samVersoehnt = true
Okay. Die Dame bleibt zu Hause. Fürs Erste. #sprecher:sam
Du bist gut, {held}. Nicht so gut wie ich. Noch nicht. #sprecher:sam #stimmung:froh
Er erzählt weiter, ohne dass du fragst. #sprecher:erzaehler
Der Coach guckt nur auf ihren eigenen Angriff. Immer. #sprecher:sam
Hab ich nie ausnutzen können. Aber du vielleicht. #sprecher:sam
Juno schreibt es ins Tagebuch. Mit Glitzer. #sprecher:erzaehler
-> END

=== sam_alltag ===
{~Dame raus, Zug sechs. Ich arbeite dran.|Du hast den Coach geknackt? Respekt. Ich hab drei Jahre gebraucht.|Cedar Creek hat eine Bibliothek als Club. Was spielen die da, leise?} #sprecher:sam
-> END

// ---------------------------------------------------------------- Juno im Club

=== juno ===
{
- not reiheSamBestanden: -> juno_erst_sam
- not reiheJunoBestanden: -> juno_reihe
- else: -> juno_club_alltag
}

=== juno_erst_sam ===
Erst Sam, dann ich. Der Coach will das so. Und Sam wird sonst grummelig. #sprecher:juno
-> END

=== juno_reihe ===
Ich hab Aufgaben für dich! Ich hab sie aufgeschrieben, aber ich kann meine Schrift nicht lesen. #sprecher:juno
Kannst du? Es sind Züge in Notation. #sprecher:juno #stimmung:froh
Und ein Matt in eins, das hab ich selbst gefunden. #sprecher:juno
* [„Her damit.“]
    ~ beginneAufgaben("mapleFalls.reiheJuno")
    -> END
* [„Gleich.“]
    Ich laufe nicht weg. Ich hab Kekse. #sprecher:juno
    -> END

=== juno_club_alltag ===
{~Das Clubtagebuch wächst! Bald brauche ich ein zweites.|Sam ist heute fast nett. Das kommt ins Tagebuch.|Ich hab gegen den Coach eine Figur gewonnen. Dann sieben verloren. Aber eine gewonnen!|Für jeden guten Zug klebe ich einen Stern. Es gibt wenige Sterne.} #sprecher:juno
-> END

// ---------------------------------------------------------------- Victor

=== victor ===
{
- not victorGesehen: -> victor_trifft
- ausgangMapleFallsVictor == "" or ausgangMapleFallsVictor == "abgebrochen": -> victor_wartet
- not kenntHale: -> victor_nachher
- else: -> victor_weg
}

=== victor_trifft ===
~ victorGesehen = true
Im Clubraum redet ein Mann im Anzug auf zwei Leute vom Schulamt ein. Auf seinem Tablet leuchtet „Perfect Move“. #sprecher:erzaehler
Unsere App ersetzt keinen Trainer. Sie ist nur der bessere. #sprecher:grahamHale
Ein Pilotprojekt, kostenlos. #sprecher:grahamHale
Coach Delgado verschränkt die Arme. Neben dem Mann lehnt ein Junge in deinem Alter. #sprecher:erzaehler
Gelangweilt. #sprecher:erzaehler
Victor Hale. Du hast eine Clubnadel? Zeig mal, was eine Nadel hier wert ist. #sprecher:victor #stimmung:kalt
Hale. #sprecher:ambrose #pause
Ambrose verstummt mitten im Wort. #sprecher:erzaehler
-> victor_wartet

=== victor_wartet ===
Ich spiele nicht von vorn gegen Anfänger. Mein Trainer gibt mir Stellungen. #sprecher:victor
Hier: Wir sind in Zug zwölf, du hast Schwarz und eine Figur weniger. Halt sie, wenn du kannst. #sprecher:victor #stimmung:kalt
Diese Stellung ist verloren, ehrlich gesagt. Aber verlieren kann man auf viele Arten. #sprecher:ambrose
Wähle eine gute. #sprecher:ambrose
* [„Ich spiele.“]
    -> victor_partie
* [„Das ist unfair.“]
    Unfair ist, dass du glaubst, eine Nadel sei etwas wert. Spielst du oder nicht? #sprecher:victor
    -> victor_partie
* [„Nicht jetzt.“]
    Nicht jetzt. Natürlich. #sprecher:victor
    -> END

=== victor_partie ===
// Regelwerk R33: Weiß Victor, Schwarz der Leser in einer Trainingsstellung um Zug 12 ohne
// Springer, Karten gesperrt; die Begegnung steht in begegnungen.json.
~ beginnePartie("mapleFalls.victor")
Victor stellt die Figuren auf. Seine Hände sind ruhig, sein Blick nicht. #sprecher:erzaehler
-> END

=== victor_nachher ===
~ kenntHale = true
{ausgangMapleFallsVictor == "niederlage":
    -> victor_niederlage
- else:
    -> victor_ueberrascht
}

=== victor_niederlage ===
~ setzeSzene("akt1.victorNiederlage")
Du hast in Zug zwölf verloren. Den Rest hast du nur nicht gemerkt. #sprecher:victor #stimmung:kalt
Er gibt dir nicht die Hand. #sprecher:erzaehler
Gut gespielt, Victor. Nächstes Mal schneller, ja? Wir haben um vier den Termin. #sprecher:grahamHale
Der war nicht nett. Aber er war gut. #sprecher:juno
Das kommt ins Tagebuch. Ohne Glitzer. #sprecher:juno
-> victor_ambrose

=== victor_ueberrascht ===
~ victorUeberrascht = 1
~ setzeSzene("akt1.victorUeberrascht")
Victor wird blass. Er rechnet leise nach, Zug für Zug. #sprecher:erzaehler
Glück. Das passiert einmal. #sprecher:victor #stimmung:muede
Victor? Wir fahren. #sprecher:grahamHale
Er geht, ohne sich umzudrehen. Juno hält dir die Hand zum Abklatschen hin. #sprecher:erzaehler
-> victor_ambrose

=== victor_ambrose ===
// Roman, Kapitel 9 (neu): Der Bildschirm bleibt im Clubraum stehen; Coach Delgado ist verlockt,
// nicht böse (docs/spiel/19, Abschnitt 3). Ihre Entscheidung fällt in Akt 2. Klang: Konzernmotiv
// (ein kalter Ton), dann Stille.
Auf dem Pult steht noch der Bildschirm. Darauf ziehen die Figuren von selbst. #sprecher:erzaehler
Coach Delgado schaltet ihn aus. Sie steht eine Weile davor. #sprecher:erzaehler #pause
Kostet zunächst nichts. #sprecher:coachDelgado #stimmung:ernst
Sie sagt es zu niemandem. #sprecher:erzaehler
Als der Raum leer ist, meldet sich das Brett in deiner Tasche. #sprecher:erzaehler
{ausgangMapleFallsVictor == "niederlage":
    Er hat nicht dich besiegt, sondern diese Stellung. Und in der Stellung hast du dich gewehrt. #sprecher:ambrose
- else:
    Du hast eine verlorene Stellung gehalten. Das hätte zu meiner Zeit für eine Zeitungsmeldung gereicht. #sprecher:ambrose #stimmung:stolz
}
* [„Warum warst du vorhin so still?“]
    Ein Name. Es gibt viele Hales. #sprecher:ambrose #stimmung:traurig
    Mehr sagt er nicht. #sprecher:erzaehler
* [„Ich will besser werden.“]
    ~ ambroseVertrauen = ambroseVertrauen + 1
    Das ist der erste kluge Satz, den du heute sagst. #sprecher:ambrose
- Du nimmst es dir fest vor: besser werden. Ohne Glück. #sprecher:erzaehler
// Roman, Kapitel 9 (neu): {held} schreibt das Ziel selbst ins Tagebuch, als Handlung statt als
// Menüeintrag. Die kleine Schreibanimation im Tagebuch der Oberfläche ist ein eigener Auftrag.
Juno hat dir das Clubtagebuch übers Wochenende geliehen. Du schlägst eine neue Seite auf. #sprecher:erzaehler
In deiner eigenen Schrift, ohne Glitzer, schreibst du: „Ich will besser werden.“ #sprecher:erzaehler #pause
Dann gehen wir nach Cedar Creek. Sag deiner Mutter Bescheid. #sprecher:ambrose
-> END

=== victor_weg ===
Victor und sein Vater sind gegangen. Auf dem Tisch liegt ein Prospekt von Perfect Move. #sprecher:erzaehler
-> END
