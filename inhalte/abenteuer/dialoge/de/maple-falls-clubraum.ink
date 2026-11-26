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
EXTERNAL schreibeTagebuch(name)
EXTERNAL gibKarte(kennung)

VAR rivalin = false
VAR rivale = "Victor"
VAR rv_er = "er"
VAR rv_Er = "Er"
VAR rv_ihn = "ihn"
VAR rv_Ihn = "Ihn"
VAR rv_ihm = "ihm"
VAR rv_Ihm = "Ihm"
VAR rv_sein = "sein"
VAR rv_Sein = "Sein"
VAR angesehenBrettOhneDame = false
VAR ausgangMapleFallsErsteLektion = ""
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
VAR pauseVorClubkampfGesehen = false
VAR ausgangMapleFallsClubkampf = ""
VAR nadelMapleFalls = 0
VAR clubkampfBesprochen = 0
VAR victorGesehen = false
VAR ausgangMapleFallsVictor = ""
VAR victorUeberrascht = 0
VAR kenntHale = false
// Neu nach dem Roman zu Akt 1 (Kapitel 8): heimwegNadelGesehen setzt diese Datei.
VAR heimwegNadelGesehen = false
// Lernkarte aus der Lektion (RO11, 15.11.2026): Sam gibt „Abzählen“, sobald der Held ihm das Zählen
// gezeigt hat (Runde mapleFalls.todsuenden). hatKarteAbzaehlen setzt die Hülle aus dem Besitz; wer
// die Karte schon hat, bekommt keine zweite.
VAR lernkarteAbzaehlen = false
VAR hatKarteAbzaehlen = false
// Dialogprüfung 17.11.2026: endeAkt1Gesehen setzt cedar-creek-aussen.ink; hier nur gelesen, damit
// Coach und Sam nach Akt 1 nicht mehr vom kommenden Samstag in Cedar Creek reden.
VAR endeAkt1Gesehen = false
VAR nadelRiverton = 0
VAR nadelIronwood = 0
VAR einladungGesehen = false
// Läuft eine Revanche um eine bessere Nadel? Dann reagiert coach_nach_revanche auf den Ausgang.
VAR revancheMapleFalls = false
// Aus capital-arena-aussen.ink: Nach dem Abschied spricht Ambrose nicht mehr. Hier nur gelesen.
VAR abschiedGesehen = false
// Partiebesprechung (Wunsch des Autors, 25.11.2026; docs/spiel/auftraege/partiebesprechung_25-11.md):
// Nach dem ersten Clubkampf kündigt Ambrose an, dass man jede Partie im Tagebuch mit ihm
// durchgehen kann. Die Hülle zeigt „Besprechen“ erst danach (regeln/besprechung.ts).
VAR besprechungAngekuendigt = false

// ---------------------------------------------------------------- Coach Delgado

=== coach ===
{
- not clubBeigetreten: -> coach_erstes_treffen
- not (reiheSamBestanden and reiheJunoBestanden): -> coach_reihe_offen
- nadelMapleFalls > clubkampfBesprochen: -> coach_nach_sieg
- revancheMapleFalls: -> coach_nach_revanche
- nadelMapleFalls > 0 and not kenntHale: -> victor
- nadelMapleFalls == 0 and ausgangMapleFallsClubkampf == "niederlage": -> coach_nach_niederlage
- nadelMapleFalls == 0: -> coach_clubkampf
- else: -> coach_alltag
}

=== coach_erstes_treffen ===
// Szene 5, zweiter Teil, nach dem Roman, Kapitel 5, und der Dialogprüfung (VM30 bis VM33).
~ clubBeigetreten = true
Raum 12, Erdgeschoss, Blick auf den Fahnenmast. Die Tische sind zu vier Inseln zusammengeschoben. #sprecher:erzaehler #klang:schulglocke #musik:mapleFalls.club
Pokale von 1994, ein Plakat: ERST ZÄHLEN. #sprecher:erzaehler #schwenk:plakatZaehlen
Aufstellung! Juno, wen bringst du mir da? #sprecher:coachDelgado #stimmung:laechelt #klang:klatschen
Ein viertes Brett, Coach. #sprecher:juno #stimmung:froh
Na, das wollen wir sehen. Delgado. #sprecher:coachDelgado #stimmung:laechelt
Mathe in der Sechsten und Achten, Schach immer. #sprecher:coachDelgado #stimmung:laechelt
Willkommen im Team, das noch keins ist. Wir arbeiten dran. #sprecher:coachDelgado #stimmung:froh
Kreisliga spielt man zu viert. Wer die Clubnadel holt, spielt mit. #sprecher:coachDelgado #stimmung:laechelt
Die Nadel holt man gegen mich. #sprecher:coachDelgado #stimmung:laechelt
* [„Gegen Sie?“]
    Gegen mich. Aber vorher zeigst du mir, dass du zählen kannst. #sprecher:coachDelgado #stimmung:laechelt
    Sam und Juno haben Aufgaben für dich. #sprecher:coachDelgado #stimmung:laechelt
* [„Was muss ich tun?“]
    Erst die Aufgaben von Sam und Juno. Dann eine Partie gegen mich. #sprecher:coachDelgado #stimmung:neutral
- Das ist hier Gesetz, und ich bin die Polizei. #sprecher:coachDelgado #stimmung:froh #klang:pfiff
Am Fenster sitzt ein Junge, die Füße auf dem Stuhl. Er hat die ganze Zeit zugehört, ohne herzusehen, das ist Sam. #sprecher:erzaehler #schwenk:sam
// Lektorat 19.11.2026: Wer das Brett schon angesehen hat (ansehen-maple-falls), liest es nicht zweimal.
{angesehenBrettOhneDame:Der Radiergummi steht noch auf d8. #sprecher:erzaehler}
{not angesehenBrettOhneDame:Auf einem der Bretter fehlt die schwarze Dame. An ihrer Stelle steht ein Radiergummi. #sprecher:erzaehler}
{not angesehenBrettOhneDame:
    Ein Radiergummi als Dame. Ich habe Schlimmeres gesehen, aber nicht oft. #sprecher:ambrose #stimmung:lacht
}
~ setzeSzene("akt1.ersterSchultag")
-> END

=== coach_reihe_offen ===
{
- not reiheSamBestanden: Fang mit Sam an, dann kommt Juno. #sprecher:coachDelgado #stimmung:neutral
- else: Sam hast du geschafft. Jetzt noch Juno. #sprecher:coachDelgado #stimmung:laechelt
Sie hat die Aufgaben selbst aufgeschrieben. #sprecher:coachDelgado #stimmung:laechelt
}
{reiheSamBestanden:
    Juno winkt dir vom Nebentisch zu, ein Heft in der Hand. #sprecher:erzaehler
    -> juno
}
-> END

=== coach_clubkampf ===
{gespieltSamRevanche() and ausgangMapleFallsClubkampf == "" and not pauseVorClubkampfGesehen: -> pause_vor_clubkampf}
// Szene 11 nach dem Roman, Kapitel 8, und der Dialogprüfung (VM57 bis VM60). Stimmung:
// Herzklopfen, das erste echte. Klang: Clubkampf-Thema mit Schlagwerk; die Pfeife liegt auf dem Pult.
Die Tische stehen anders. Eine Insel in der Mitte, die Stühle der anderen im Halbkreis. #sprecher:erzaehler #musik:mapleFalls.clubkampf
Die Pfeife liegt auf dem Pult. #sprecher:erzaehler
Die Aufgaben sind erledigt. Dann ist es so weit: du gegen mich, um die Clubnadel. #sprecher:coachDelgado #stimmung:nachdenklich
Eine Partie. Ich spiele, wie ich spiele, ich schenke dir nichts. #sprecher:coachDelgado #stimmung:nachdenklich
Wenn du verlierst, kommst du wieder, so oft du willst. #sprecher:coachDelgado #stimmung:nachdenklich
Sie legt eine Anstecknadel auf den Tisch. Ein kleines Ahornblatt aus Metall, mit einem Schachbrettmuster darin. #sprecher:erzaehler
* [„Ich bin bereit.“]
    Deine Hände sind kalt. #sprecher:erzaehler
    Du wirst die Karten nicht brauchen. #sprecher:ambrose #stimmung:laechelt
    * * [„Woher weißt du das?“]
        Ich weiß es nicht. Ich sage es, damit du aufhörst zu zittern. #sprecher:ambrose #stimmung:laechelt
        -> coach_partie
* [„Noch nicht.“]
    Kein Problem. Das Brett läuft nicht weg. #sprecher:coachDelgado #stimmung:laechelt
    -> END

// Kurze Pause nach Sams Revanche (Balance, 15.11.2026): Wer die Revanche direkt vor dem Clubkampf
// spielt, hätte sonst etwa 50 Minuten Schach am Stück (RO5).
=== pause_vor_clubkampf ===
~ pauseVorClubkampfGesehen = true
Coach Delgado sieht von Sams Brett zu dir und wieder zurück. #sprecher:erzaehler
Zwei Partien hintereinander? Nicht in meinem Club. #sprecher:coachDelgado #stimmung:laechelt #klang:pfiff
Fünf Minuten Pause, Fenster auf, Wasser trinken. #sprecher:coachDelgado #stimmung:laechelt
Meine erste Kreismeisterschaft. Drei Partien an einem Nachmittag. #sprecher:coachDelgado #stimmung:nachdenklich
Die dritte habe ich in Zug elf verloren. #sprecher:coachDelgado #stimmung:nachdenklich
Nicht, weil der Junge besser war. Weil ich Hunger hatte. #sprecher:coachDelgado #stimmung:lacht
Das steht auf keinem Pokal. #sprecher:coachDelgado #stimmung:lacht
Juno drückt dir einen halben Apfel in die Hand und beißt in die andere Hälfte. #sprecher:erzaehler
Die Hälfte ist für den Kopf. Die andere für die Nerven. #sprecher:juno #stimmung:lacht
Steht in keinem Buch. Nur in meinem. #sprecher:juno #stimmung:lacht
Draußen schlägt die Schnur gegen den Fahnenmast. Du zählst mit, bis du vergisst zu zählen. #sprecher:erzaehler
Innehalten, wenn man gleich weiterspielen will. Das habe ich nie gekonnt. #sprecher:ambrose #stimmung:lacht
Mach es besser als ich. #sprecher:ambrose #stimmung:lacht
-> coach_clubkampf

=== function gespieltSamRevanche() ===
~ return ausgangMapleFallsSamRevanche != "" and ausgangMapleFallsSamRevanche != "abgebrochen"

=== coach_partie ===
~ beginnePartie("mapleFalls.clubkampf")
-> END

=== coach_nach_sieg ===
~ revancheMapleFalls = false
~ clubkampfBesprochen = nadelMapleFalls
{ausgangMapleFallsClubkampf == "remis":
    Remis! Das war knapp. #sprecher:coachDelgado #stimmung:ueberrascht
    Die Bronzenadel hast du. Um eine bessere spielen wir, wann du willst. #sprecher:coachDelgado #stimmung:laechelt
- else:
    Sie legt ihren König um. Sanft, mit einem Finger. #sprecher:erzaehler #pause #musik:aus
    Abpfiff! Gute Partie! #sprecher:coachDelgado #stimmung:froh #klang:pfiff_finger
    Du hast gezählt, als ich nicht gezählt habe. #sprecher:coachDelgado #stimmung:froh
}
Sie steckt dir die Nadel an. Selbst, etwas schief. #sprecher:erzaehler #klang:fanfare
{heimwegNadelGesehen:Eine Stufe besser als die alte. So macht man das.|Viertes Brett. Samstag spielen wir in Cedar Creek.} #sprecher:coachDelgado #stimmung:laechelt #musik:karte
{not heimwegNadelGesehen:
    Juno umarmt dich so heftig, dass das Tagebuch auf den Boden fällt. #sprecher:erzaehler
    {samVersoehnt:Ich hab's dir gesagt.|Nicht schlecht. Für ein viertes Brett.} #sprecher:sam #stimmung:froh
}
// Den Mentor-Zug gibt es erst nach dem Clubkampf von Cedar Creek (Roman und Story-Bibel,
// Entscheidung des Hauptchats 13.11.2026; quests.json, cedarCreek.clubkampf).
{not heimwegNadelGesehen:
    -> pratt_und_heimweg ->
}
~ setzeSzene("akt1.clubnadelMapleFalls")
-> END

=== coach_nach_niederlage ===
Das war nichts für heute. Aber du hast in der Eröffnung gut gekämpft. #sprecher:coachDelgado #stimmung:laechelt
Noch einmal? Ich habe Zeit, und Kekse. #sprecher:coachDelgado #stimmung:laechelt
// Ambrose nach dem verlorenen Clubkampf (schwacher Spieler im Durchlauf, 19.11.2026: vorher
// sprach nur der Clubchef). Nach dem Abschied schweigt er.
{not abschiedGesehen:
    Der Coach hat recht mit der Eröffnung. Danach hast du aufgehört zu zählen. #sprecher:ambrose #stimmung:nachdenklich
    Erst zählen, dann noch einmal. #sprecher:ambrose #stimmung:nachdenklich
    -> besprechung_ankuendigen ->
}
* [„Noch einmal.“]
    -> coach_partie
* [„Nicht jetzt.“]
    Kein Problem. Das Brett wartet. #sprecher:coachDelgado #stimmung:laechelt
    -> END

// Lektorat Akt 2 (17.11.2026): der Satz zum Stand der Reise, damit der Coach mit vier Nadeln
// nicht mehr von Cedar Creek redet.
=== function coachStand() ===
{
- einladungGesehen:
    ~ return "Silicon Bay. Schick mir jede Partie, die du dort spielst. Die Partien, nicht die Zahlen."
- nadelIronwood > 0:
    ~ return "Vier Nadeln. Ich hab die Vitrine abgestaubt. Für alle Fälle."
- nadelRiverton > 0:
    ~ return "Riverton geschafft! Für Ironwood hab ich uns schon angemeldet. Vier Bretter."
- endeAkt1Gesehen:
    ~ return "Cedar Creek hast du hinter dir. In der Vitrine ist noch Platz für einen Pokal. Ich sag's nur."
- else:
    ~ return "Samstag Cedar Creek. Pünktlich sein, sonst pfeife ich."
}

=== coach_alltag ===
{nadelMapleFalls < 3:
    {~Noch einmal um die Nadel? Gold gibt es nur für eine Partie ganz ohne Hilfe, sag Bescheid.|{coachStand()}} #sprecher:coachDelgado #stimmung:laechelt
- else:
    {~Goldnadel, ganz ohne Hilfe! Ich erzähle es jedem, der zuhört.|{coachStand()}} #sprecher:coachDelgado #stimmung:froh
}
+ {nadelMapleFalls > 0 and nadelMapleFalls < 3} [„Noch eine Partie um die Nadel.“]
    ~ revancheMapleFalls = true
    -> coach_partie
+ [„Bis morgen, Coach.“]
    -> END

// ---------------------------------------------------------------- Nach der Nadel (Roman, Kapitel 8)

// Neu gegenüber der Story-Bibel: Mr. Pratt an der Tür (die Stadt nimmt den Sieg wahr) und das
// Heimweg-Gespräch, der erste Schritt in Ambroses Bogen (schön gegen richtig). Nur nach der
// ersten Nadel, etwa eine Minute. Klang: nach der Siegfanfare Stille, dann Abendgeräusche; die
// Laternen gehen an.
=== pratt_und_heimweg ===
~ heimwegNadelGesehen = true
// Anwesenheit (25.11.2026): Mr. Pratt stand nur im Text an der Tür, nicht im Bild. Jetzt geht er
// draußen im Flur vorbei, und {held} hört ihn durch die offene Tür.
Draußen im Flur quietscht der Wagen des Hausmeisters. Durch die offene Tür hörst du Mr. Pratt murmeln: „Die haben auch gezählt. Bevor sie geschlagen haben.“ #sprecher:erzaehler
Dann wird das Quietschen leiser. #sprecher:erzaehler
Ambrose sagt lange nichts. Draußen vor dem Fenster gehen die Laternen an, eine nach der anderen. #sprecher:erzaehler #pause #licht:abend #musik:aus #uhr:abend
Es war keine schöne Partie. #sprecher:ambrose #stimmung:nachdenklich
* [„Ich habe sie aber nicht verloren.“]
    Nein. Du hast gezählt, bis nichts mehr übrig war. #sprecher:ambrose #stimmung:nachdenklich
    Buchhaltung, Zug um Zug. #sprecher:ambrose #stimmung:nachdenklich
* [„Was ist eine schöne Partie?“]
    Eine, über die man noch in hundert Jahren spricht. Über diese spricht man morgen. #sprecher:ambrose #stimmung:nachdenklich
- Zu meiner Zeit hätte man so etwas nicht aufgeschrieben. #sprecher:ambrose #stimmung:streng
* [„Bist du enttäuscht?“]
- Das Laternenlicht fällt durch das Fenster auf das Brett. Man sieht fast durch ihn hindurch. #sprecher:erzaehler #pause
Nein. #sprecher:ambrose #stimmung:still #pause:3
Nein. Das ist das Merkwürdige. #sprecher:ambrose #stimmung:still #musik:karte
-> besprechung_ankuendigen ->
->->

// Partiebesprechung (25.11.2026): einmal nach dem ersten Clubkampf, nach Sieg (Heimweg, nach „Zu
// meiner Zeit hätte man so etwas nicht aufgeschrieben.“) oder Niederlage (beim Coach). Danach
// steht im Tagebuch bei jeder Partie „Besprechen“.
=== besprechung_ankuendigen ===
{besprechungAngekuendigt: ->->}
~ besprechungAngekuendigt = true
Eines noch. {heimwegNadelGesehen:Aufgeschrieben wird sie trotzdem, in deinem Tagebuch.|Auch diese Partie steht in deinem Tagebuch.} #sprecher:ambrose #stimmung:nachdenklich
Bei den Partien steht jetzt „Besprechen“. Dann gehen wir sie zusammen durch, Zug für Zug, du und ich. #sprecher:ambrose #stimmung:laechelt
Ich sage dir, wo es gut war und wo nicht. Mehr nicht, fürs Erste. #sprecher:ambrose #stimmung:nachdenklich
->->

// ---------------------------------------------------------------- Sam

=== sam ===
{
- not clubBeigetreten: -> sam_vor_dem_coach
- not samGetroffen: -> sam_erstes_treffen
- not reiheSamBestanden: -> sam_reihe
// Sams Klage startet die Nebenquest „Sams Dame“, die die erste Lektion mit Ambrose voraussetzt; wer
// vorher kommt, hört nur den Alltag, sonst wäre die Quest verpasst (Gesamtsimulation, 15.11.2026).
- not samKlagt and (ausgangMapleFallsErsteLektion == "" or ausgangMapleFallsErsteLektion == "abgebrochen"): -> sam_alltag
- not samKlagt: -> sam_klagt
- not todsuendenBestanden: -> sam_klagt_wieder
- todsuendenBestanden and (ausgangMapleFallsSamRevanche == "" or ausgangMapleFallsSamRevanche == "abgebrochen"): -> sam_revanche_angebot
- ausgangMapleFallsSamRevanche == "sieg" and not samVersoehnt: -> sam_nach_revanche
- ausgangMapleFallsSamRevanche != "" and ausgangMapleFallsSamRevanche != "sieg": -> sam_revanche_angebot
- else: -> sam_alltag
}

// Sams Aufgaben erst nach dem ersten Treffen mit dem Coach: Die Quest „Das vierte Brett“ beginnt dort
// und wartet zuerst auf Sams Reihe; vorher bestanden, hing sie für immer (Chaos-Prüfung, 14.11.2026).
=== sam_vor_dem_coach ===
Am Fenster sitzt ein Junge, die Füße auf dem Stuhl, und sieht nicht hoch. #sprecher:erzaehler #schwenk:sam
Erst zum Coach. Ohne Aufstellung keine Aufgaben. #sprecher:sam #stimmung:laechelt
-> END

=== sam_erstes_treffen ===
~ samGetroffen = true
Viertes Brett? Wir haben ein erstes Brett. #sprecher:sam #stimmung:laechelt
Mich. Reicht doch. #sprecher:sam #stimmung:laechelt
Ich spiel Dame raus in Zug zwei. Funktioniert immer. #sprecher:sam #stimmung:laechelt
Fast immer. #sprecher:coachDelgado #stimmung:laechelt
Fast immer. #sprecher:sam #stimmung:nachdenklich
Dann grinst er, weil er nicht anders kann. #sprecher:erzaehler
* [„Zeig mir deine Aufgaben.“]
    -> sam_reihe
* [„Gleich.“]
    Klar. Wenn du dich traust. #sprecher:sam #stimmung:laechelt
    -> END

=== sam_reihe ===
Hier. Die Figur steht da wie geschenkt. #sprecher:sam #stimmung:laechelt
Na los, nimm sie. #sprecher:sam #stimmung:laechelt
* [„Erst zählen.“]
    Langweilig. Aber gut. #sprecher:sam #stimmung:laechelt
    ~ beginneAufgaben("mapleFalls.reiheSam")
    -> END
* [„Gleich.“]
    -> END

=== sam_klagt ===
// Szene 9 nach dem Roman, Kapitel 6, und der Dialogprüfung (VM48 bis VM51).
~ samKlagt = true
Sam liegt mit dem Kopf auf dem Tisch. #sprecher:erzaehler
Die Chefin wurde gefangen. Schon wieder. #sprecher:sam #stimmung:bitter
Das zählt nicht, das war Pech! #sprecher:sam #stimmung:bitter
Wie oft war es Pech? Ich hab elfmal. #sprecher:juno #stimmung:laechelt
Du schreibst das auf? #sprecher:sam #stimmung:ueberrascht
Ich schreibe alles auf. #sprecher:juno #stimmung:froh
* [„Soll ich dir zeigen, warum?“]
    Du? Mir? … #sprecher:sam #stimmung:ueberrascht
    Okay. Okay. #sprecher:sam #stimmung:ueberrascht
    Zeig mir das noch mal mit dem Zählen. #sprecher:sam #stimmung:ueberrascht
    ~ beginneAufgaben("mapleFalls.todsuenden")
    -> END
* [„Pech gibt es nicht im Schach.“]
    Pff. Du klingst wie der Coach. #sprecher:sam #stimmung:bitter
    Na gut. Zeig mir, was du meinst. #sprecher:sam #stimmung:nachdenklich
    ~ beginneAufgaben("mapleFalls.todsuenden")
    -> END

=== sam_klagt_wieder ===
Und? Zeigst du mir jetzt, warum die Chefin immer gefangen wird? #sprecher:sam #stimmung:nachdenklich
* [„Ja, los.“]
    ~ beginneAufgaben("mapleFalls.todsuenden")
    -> END
* [„Gleich.“]
    -> END

=== sam_revanche_angebot ===
{not lernkarteAbzaehlen:
    ~ lernkarteAbzaehlen = true
    Sam schiebt dir eine Karte über den Tisch. Darauf zwei Hände, die Figuren abzählen. #sprecher:erzaehler
    {hatKarteAbzaehlen:
        Ach, die hast du schon. Dann zähl weiter – ich versuch's auch. #sprecher:sam #stimmung:laechelt
    - else:
        Hat mir der Coach mal gegeben. Ich hab sie nie benutzt. #sprecher:sam #stimmung:laechelt
        Du zählst ja sowieso. #sprecher:sam #stimmung:laechelt
        ~ gibKarte("abzaehlen")
    }
}
{ausgangMapleFallsSamRevanche == "" or ausgangMapleFallsSamRevanche == "abgebrochen":
    // Lektorat Akt 1, 17.11.2026: keine „Revanche“ beim ersten Mal; {held} hat vorher nie gegen Sam
    // gespielt (im Roman gewinnt Sam eine erste Partie, die es im Spiel nicht gibt).
    Okay. Die Dame bleibt erst mal zu Hause. #sprecher:sam #stimmung:laechelt
    Eine Partie? Jetzt? #sprecher:sam #stimmung:laechelt
- else:
    {ausgangMapleFallsSamRevanche == "niederlage":
        Noch mal? Klar! #sprecher:sam #stimmung:laechelt
        Aber diesmal passt du besser auf deine Figuren auf. #sprecher:sam #stimmung:laechelt
    - else:
        Noch mal! Diesmal mache ich alles richtig, fast alles. #sprecher:sam #stimmung:laechelt
    }
}
* {not gespieltSamRevanche()} [„Eine Partie.“]
    ~ beginnePartie("mapleFalls.samRevanche")
    -> END
* {gespieltSamRevanche()} [„Revanche.“]
    ~ beginnePartie("mapleFalls.samRevanche")
    -> END
* [„Gleich.“]
    -> END

=== sam_nach_revanche ===
// Der Tipp zur Trainerin ist Sams Lohn nach der Revanche (Roman, Kapitel 6; Dialogprüfung VM49).
~ samVersoehnt = true
Okay. Die Chefin war brav zu Hause. #sprecher:sam #stimmung:laechelt
Verloren hab ich trotzdem. #sprecher:sam #stimmung:laechelt
Du bist gut, {held}. Nicht so gut wie ich. #sprecher:sam #stimmung:froh
Noch nicht. #sprecher:sam #stimmung:froh
Er erzählt weiter, ohne dass du fragst. #sprecher:erzaehler
Der Coach guckt nur auf ihren eigenen Angriff. Immer. #sprecher:sam #stimmung:nachdenklich
// Lektorat der Lesefassung, 17.11.2026: Wer die Nadel schon hat, bekommt den Tipp nicht mehr als Aussicht.
Hab ich nie ausnutzen können. {nadelMapleFalls > 0:Du schon, wie es aussieht.|Aber du vielleicht.} #sprecher:sam #stimmung:laechelt
Juno schreibt es ins Tagebuch. Mit Glitzer. #sprecher:erzaehler
-> END

=== sam_alltag ===
// Dialogprüfung 17.11.2026: Der Satz über den Coach erst mit der Nadel, „Zug sechs“ erst nach Sams
// Dame, Cedar Creek nach Akt 1 als Rückblick.
{
- nadelMapleFalls == 0 and samVersoehnt:
    {~Dame raus, Zug sechs. Ich arbeite dran.|Der Coach sagt, ich ziehe zu schnell. Ich sag: Die anderen ziehen zu langsam!} #sprecher:sam #stimmung:laechelt
- nadelMapleFalls == 0:
    {~Der Coach sagt, ich ziehe zu schnell. Ich sag: Die anderen ziehen zu langsam!|Die Pokale da sind von 1994. Wird Zeit für einen neuen!} #sprecher:sam #stimmung:laechelt
- samVersoehnt:
    {~Dame raus, Zug sechs. Ich arbeite dran.|Den Coach geknackt, Respekt. Ich hab drei Jahre gebraucht.|{endeAkt1Gesehen:In Cedar Creek spielen sie in einer Bibliothek. Ich hab die ganze Zeit geflüstert. Ich!|Cedar Creek hat eine Bibliothek als Club. Was spielen die da, leise?}} #sprecher:sam #stimmung:laechelt
- else:
    {~Den Coach geknackt, Respekt. Ich hab drei Jahre gebraucht.|{endeAkt1Gesehen:In Cedar Creek spielen sie in einer Bibliothek. Ich hab die ganze Zeit geflüstert. Ich!|Cedar Creek hat eine Bibliothek als Club. Was spielen die da, leise?}} #sprecher:sam #stimmung:laechelt
}
-> END

// ---------------------------------------------------------------- Juno im Club

=== juno ===
{
- not reiheSamBestanden: -> juno_erst_sam
- not reiheJunoBestanden: -> juno_reihe
- else: -> juno_club_alltag
}

=== juno_erst_sam ===
Erst Sam, dann ich. Der Coach will das so. #sprecher:juno #stimmung:laechelt
Und Sam wird sonst grummelig. #sprecher:juno #stimmung:laechelt
-> END

=== juno_reihe ===
Ich hab Aufgaben für dich! Ich hab sie aufgeschrieben, aber ich kann meine Schrift nicht lesen. #sprecher:juno #stimmung:lacht
Kannst du? Es sind Züge in Notation. #sprecher:juno #stimmung:froh
Und ein Matt in eins, das hab ich selbst gefunden. #sprecher:juno #stimmung:laechelt
* [„Her damit.“]
    ~ beginneAufgaben("mapleFalls.reiheJuno")
    -> END
* [„Gleich.“]
    Ich laufe nicht weg. Ich hab Kekse. #sprecher:juno #stimmung:lacht
    -> END

=== juno_club_alltag ===
{~Das Clubtagebuch wächst! Bald brauche ich ein zweites.|Sam ist heute fast nett. Ich hab das Datum unterstrichen.|Ich hab gegen den Coach eine Figur gewonnen und dann sieben verloren. Aber eine gewonnen!|Für jeden guten Zug klebe ich einen Stern. Es gibt wenige Sterne.} #sprecher:juno #stimmung:laechelt
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
// Szene 12 nach dem Roman, Kapitel 9, und der Dialogprüfung (VM61, VM62). Stimmung: kalt, kurz,
// ein Stich. Graham Hale ist freundlich und müde, nicht böse; Victor kühl, genau ein Riss.
// Klang: Beim Wagen setzt die Musik aus; Victors Thema kalt; in der Partie ein Metronom; bei
// „Hale“ ein tiefer Ton, Ambroses Thema bricht ab.
~ victorGesehen = true
// Anwesenheit (Befund des Autors, 25.11.2026): Hale und {rivale} kamen nur im Text, im Bild stand
// niemand. Jetzt stehen sie nach der ersten Nadel im Clubraum (mapleFalls.haleClub, victorClub)
// und gehen am Ende sichtbar zur Tür (#gehe).
Draußen vor dem Fenster parkt ein schwarzer Wagen. Neben Coach Delgado steht ein Mann, ein Telefon am Ohr, ein zweites in der Hand. #sprecher:erzaehler #pause #musik:aus #klang:wagen
Coach Delgado hat die Trainingsjacke bis oben zugezogen. #sprecher:erzaehler
Der Mann gibt jedem die Hand, auch dir. Er hat ein freundliches, müdes Gesicht. #sprecher:erzaehler
Ein Programm, das nie krank wird und nie die Geduld verliert. Perfect Move. #sprecher:grahamHale #stimmung:laechelt
Schach für die Zukunft. #sprecher:grahamHale #stimmung:laechelt
Was kostet das? #sprecher:coachDelgado #stimmung:nachdenklich
Für Pilotschulen zunächst nichts. #sprecher:grahamHale #stimmung:laechelt
Am Fenster steht {rivalin:ein Mädchen|ein Junge}, ein Tablet unter dem Arm. {rv_Er} hat sich nicht gesetzt. #sprecher:erzaehler
{rv_Er} sieht auf deine Nadel. #sprecher:erzaehler
{rivale} Hale. Zeig mal, was eine Nadel hier wert ist. #sprecher:victor #stimmung:kalt #musik:victor
In deiner Tasche bricht Ambrose mitten im Satz ab. #sprecher:erzaehler #klang:hale #pause:3
-> victor_wartet

=== victor_wartet ===
Ich spiele nicht von vorn gegen Anfänger. Mein Trainer gibt mir Stellungen. #sprecher:victor #stimmung:bitter
Spanisch, Zug zwölf. Du hast Schwarz, einen Springer weniger und zwei Bauern mehr. #sprecher:victor #stimmung:kalt
Das sage ich dir vorher, damit du dich nachher nicht beschwerst. #sprecher:victor #stimmung:bitter
Ein Springer … gegen zwei Bauern. Spiel, Kind. #sprecher:ambrose #stimmung:still
Frag mich jetzt nichts. #sprecher:ambrose #stimmung:still
* [„Ich spiele.“]
    -> victor_partie
* [„Das ist nicht fair.“]
    Es ist genau. Fair ist etwas anderes. #sprecher:victor #stimmung:kalt
    -> victor_partie
* [„Nicht jetzt.“]
    Natürlich. #sprecher:victor #stimmung:bitter
    -> END

=== victor_partie ===
// Regelwerk R33: Weiß Victor, Schwarz der Leser in einer Trainingsstellung um Zug 12 mit einem
// Springer weniger, Karten gesperrt; die Begegnung steht in begegnungen.json.
~ beginnePartie("mapleFalls.victor")
{rivale} stellt die Figuren auf. Schnell, ohne hinzusehen. #sprecher:erzaehler
-> END

=== victor_nachher ===
// kenntHale erst in victor_ambrose: Wer hier abbricht, sieht das Nachgespräch noch einmal; sonst
// hing die Quest „Besser werden“ vor victor_ambrose (Chaos-Prüfung, 14.11.2026).
{ausgangMapleFallsVictor == "niederlage":
    -> victor_niederlage
- else:
    -> victor_ueberrascht
}

=== victor_niederlage ===
~ setzeSzene("akt1.victorNiederlage")
Irgendwann lehnt {rv_er} sich einen Fingerbreit zurück. #sprecher:erzaehler
Das genügt. #sprecher:victor #stimmung:bitter
Du hast in Zug zwölf verloren. Den Rest hast du nur nicht gemerkt. #sprecher:victor #stimmung:kalt
{rv_Er} räumt die Figuren ein, jede in ihr Fach. {rv_Er} gibt dir nicht die Hand. #sprecher:erzaehler
Gut gespielt, {rivale}. Nächstes Mal schneller, ja? #sprecher:grahamHale #stimmung:nachdenklich
Wir haben um vier den Termin. #sprecher:grahamHale #stimmung:nachdenklich
Etwas geht über {rivale}s Gesicht. Sehr kurz. #sprecher:erzaehler #pause
Ja. #sprecher:victor #stimmung:riss
Dann gehen beide zur Tür hinaus. #sprecher:erzaehler #gehe:victorClub>13,13;haleClub>14,13
{rivalin:Die|Der} war nicht nett. #sprecher:juno #stimmung:nachdenklich #pause
Niemand widerspricht. #sprecher:erzaehler
Aber {rv_er} war gut. #sprecher:juno #stimmung:nachdenklich
-> victor_ambrose

=== victor_ueberrascht ===
~ victorUeberrascht = 1
~ setzeSzene("akt1.victorUeberrascht")
{rivale} sieht auf das Brett. Drei Sekunden lang rührt {rv_er} sich nicht. #sprecher:erzaehler #pause:3
Glück. Das passiert einmal. #sprecher:victor #stimmung:kalt
{rivale}? Wir fahren. #sprecher:grahamHale #stimmung:nachdenklich
{rv_Er} geht, ohne sich umzudrehen. Juno hält dir die Hand zum Abklatschen hin. #sprecher:erzaehler #gehe:victorClub>13,13;haleClub>14,13
-> victor_ambrose

=== victor_ambrose ===
~ kenntHale = true
// Roman, Kapitel 9 (neu): Der Bildschirm bleibt im Clubraum stehen; Coach Delgado ist verlockt,
// nicht böse (docs/spiel/19, Abschnitt 3). Ihre Entscheidung fällt in Akt 2. Klang: Konzernmotiv
// (ein kalter Ton), dann Stille. Danach still wie auf dem Dachboden im Roman: nur Wind.
Auf dem Pult steht noch der Bildschirm. Darauf ziehen die Figuren von selbst. #sprecher:erzaehler #klang:konzern
Coach Delgado schaltet ihn aus. Sie steht eine Weile davor. #sprecher:erzaehler #pause
Kostet zunächst nichts. #sprecher:coachDelgado #stimmung:ernst
Sie sagt es zu niemandem. #sprecher:erzaehler
Als der Raum leer ist, holst du das Brett aus der Tasche und legst es auf einen Tisch. #sprecher:erzaehler
{ausgangMapleFallsVictor == "niederlage":
    Ambrose zeigt dir zwei Stellen. Genau und ohne ein Wort zu viel. #sprecher:erzaehler
- else:
    Du hast eine schwere Stellung gehalten, mit einem Springer weniger. Damit stand man früher in der Zeitung. #sprecher:ambrose #stimmung:stolz
}
* [„Du bist erschrocken. Vorhin.“]
    Bin ich das. #sprecher:ambrose #stimmung:bitter
    * * [„Hale.“]
        Er steht mit dem Rücken zu dir. Die alte Stellung liegt zwischen euch. #sprecher:erzaehler
        Schwarz ist am Zug, seit damals. #sprecher:erzaehler #pause
        Ein Name. Es gibt viele Hales. #sprecher:ambrose #stimmung:traurig
        Du weißt, dass er lügt. Er lügt nicht besser als Mama. #sprecher:erzaehler
* [Nichts fragen]
    Du fragst nicht. #sprecher:erzaehler
// Roman, Kapitel 9 (neu): {held} schreibt das Ziel selbst ins Tagebuch, als Handlung statt als
// Menüeintrag. schreibeTagebuch zeigt die Seite mit Schreibanimation (Text
// tagebuch.eintrag.besserWerden, „Ich will besser werden.“).
- Juno hat dir das Clubtagebuch übers Wochenende geliehen. Du schlägst eine neue Seite auf. #sprecher:erzaehler #musik:aus
In deiner eigenen Schrift, ohne Glitzer. #sprecher:erzaehler #klang:tagebuch
~ schreibeTagebuch("besserWerden")
-> END

=== victor_weg ===
{rivale} und {rv_sein} Vater sind gegangen. Der Bildschirm steht noch auf dem Pult – ausgeschaltet. #sprecher:erzaehler
-> END

// Rückmeldung nach der Runde (runden.json `danach`; Wunsch des Autors, 19.11.2026): bestanden ein Satz von Juno, sonst wie bisher.
=== juno_reihe_danach ===
{not reiheJunoBestanden: -> juno}
Alles richtig! Sogar mein Matt in eins. #sprecher:juno #stimmung:froh
Das bekommt einen Stern mit Glitzer. #sprecher:juno #stimmung:froh
Jetzt fehlt nur noch der Coach. Die Clubnadel gibt es nur gegen sie. #sprecher:juno #stimmung:laechelt
-> END

// Rückmeldung nach der Runde (runden.json `danach`; Wunsch des Autors, 19.11.2026): bestanden ein Satz von Sam, sonst wie bisher.
=== sam_reihe_danach ===
{not reiheSamBestanden: -> sam}
Du hast jedes Mal gezählt. Und nicht einmal genommen, was ich dir hingestellt hab. #sprecher:sam #stimmung:ueberrascht
Na gut. Juno hat auch noch Aufgaben, mit Glitzer, wahrscheinlich. #sprecher:sam #stimmung:laechelt
-> END

// Revanche um eine bessere Nadel, die keine bessere Nadel brachte (Spieler-Durchlauf mit schwachem
// Spieler, 19.11.2026): Vorher folgte nur ein Alltagssatz, jetzt geht coach auf den Ausgang ein.
// Abgebrochen: keine Reaktion, weiter wie sonst.
=== coach_nach_revanche ===
~ revancheMapleFalls = false
{
- ausgangMapleFallsClubkampf == "sieg":
    Gewonnen! Für eine bessere Nadel hat es diesmal nicht gereicht. #sprecher:coachDelgado #stimmung:laechelt
    Gesehen habe ich es trotzdem. #sprecher:coachDelgado #stimmung:laechelt
- ausgangMapleFallsClubkampf == "remis":
    Remis. Deine Nadel bleibt, wie sie ist. #sprecher:coachDelgado #stimmung:neutral
    Kekse gibt es trotzdem. #sprecher:coachDelgado #stimmung:neutral
- ausgangMapleFallsClubkampf == "niederlage":
    Diesmal nicht. Deine Nadel behältst du natürlich. #sprecher:coachDelgado #stimmung:laechelt
    Die nimmt dir keiner. #sprecher:coachDelgado #stimmung:laechelt
- else:
    -> coach
}
+ {nadelMapleFalls < 3} [„Noch einmal.“]
    ~ revancheMapleFalls = true
    ~ beginnePartie("mapleFalls.clubkampf")
    -> END
+ [„Nicht jetzt.“]
    -> END
