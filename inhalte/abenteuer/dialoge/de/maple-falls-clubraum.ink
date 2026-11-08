// Ort: Clubraum der Maple Falls High (Akt 1). Figuren: Coach Delgado, Sam, Juno, Victor Hale,
// Graham Hale.
//
// Szenen der Story-Bibel (docs/spiel/05_Story_Bibel.md, Abschnitt 4): 5 Erster Schultag, zweiter
// Teil (akt1.ersterSchultag), 6 Aufgabenreihe (Runden mapleFalls.reiheSam, mapleFalls.reiheJuno),
// 9 Sams Dame (mapleFalls.samsDame), 11 Clubkampf (akt1.clubnadelMapleFalls), 12 Victor
// (akt1.victorTrifft, akt1.victorNiederlage oder akt1.victorUeberrascht, Regelwerk R33).
// Einstiege: „coach“, „sam“, „juno“, „victor“. Nach einer Partie oder Aufgabenrunde öffnet die
// Hülle wieder den Einstieg der Figur (Vorschlag im Bericht mittel-1); er verzweigt dann über die
// Variablen, die die Hülle setzt: ausgang… (sieg, remis, niederlage), …Bestanden, nadelMapleFalls.
//
// Victors Partie braucht die Begegnung mapleFalls.victor in begegnungen.json (für diesen Auftrag
// gesperrt); bis dahin endet der Knoten victor_partie ohne Partie (siehe Bericht).

EXTERNAL beginnePartie(begegnung)
EXTERNAL beginneAufgaben(runde)
EXTERNAL setzeSzene(kennung)

VAR held = "Du"
VAR ambroseVertrauen = 0
VAR junoGetroffen = false
VAR clubBeigetreten = false
VAR samGetroffen = false
VAR samKlagt = false
VAR samVersoehnt = false
VAR reiheSamBestanden = false
VAR reiheJunoBestanden = false
VAR todsuendenBestanden = false
VAR ausgangSamRevanche = ""
VAR ausgangClubkampf = ""
VAR nadelMapleFalls = 0
VAR clubkampfBesprochen = 0
VAR victorGesehen = false
VAR ausgangVictor = ""
VAR victorUeberrascht = 0
VAR kenntHale = false

// ---------------------------------------------------------------- Coach Delgado

=== coach ===
{
- not clubBeigetreten: -> coach_erstes_treffen
- not (reiheSamBestanden and reiheJunoBestanden): -> coach_reihe_offen
- nadelMapleFalls > clubkampfBesprochen: -> coach_nach_sieg
- nadelMapleFalls == 0 and ausgangClubkampf != "": -> coach_nach_niederlage
- nadelMapleFalls == 0: -> coach_clubkampf
- else: -> coach_alltag
}

=== coach_erstes_treffen ===
~ clubBeigetreten = true
Ein Klassenzimmer mit Pokalen von 1994. Sechs Kinder, vier Bretter, eine Frau mit Trillerpfeife. #sprecher:erzaehler
Juno hat jemanden mitgebracht! Willkommen im Team, das noch keins ist. #sprecher:coachDelgado #stimmung:froh #klang:pfiff
Wir arbeiten dran. #sprecher:coachDelgado
Ich bin Coach Delgado. Mathe am Vormittag, Schach am Nachmittag. #sprecher:coachDelgado
Uns fehlt ein viertes Brett für die Kreisliga. Wer die Clubnadel holt, spielt mit. #sprecher:coachDelgado
* [„Was muss ich tun?“]
    Zwei Dinge. Erst die Aufgaben von Sam und Juno, dann eine Partie gegen mich. #sprecher:coachDelgado
* [„Gegen wen muss ich spielen?“]
    Gegen mich. Aber erst die Aufgaben von Sam und Juno. Erst zählen, dann schlagen. #sprecher:coachDelgado
- Erst zählen, dann schlagen. Das ist hier Gesetz, und ich bin die Polizei. #sprecher:coachDelgado #stimmung:ernst
Ein Junge am ersten Brett verschränkt die Arme. Das ist Sam. #sprecher:erzaehler
Eine Frau, die Gesetze macht und pfeift. Ich mag sie jetzt schon. #sprecher:ambrose
~ setzeSzene("akt1.ersterSchultag")
-> END

=== coach_reihe_offen ===
{
- not reiheSamBestanden: Fang mit Sam an, dann kommt Juno. Sam tut streng, ist aber fair. #sprecher:coachDelgado
- else: Sam hast du geschafft. Jetzt noch Juno. Sie hat die Aufgaben selbst aufgeschrieben. #sprecher:coachDelgado
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
{ausgangClubkampf == "remis":
    Remis! Das war knapp. #sprecher:coachDelgado
    Die Bronzenadel hast du. Noch einmal, wenn du willst? #sprecher:coachDelgado
- else:
    Gute Partie! Mein Angriff war schön, nur leider nicht für mich. #sprecher:coachDelgado #stimmung:froh #klang:pfiff
}
Viertes Brett, du bist dran. Samstag spielen wir in Cedar Creek. #sprecher:coachDelgado
Hier, deine Clubnadel. Juno klebt sie gleich ins Tagebuch. #sprecher:coachDelgado
Ihr erster Sieg in einem Club, {held}. Merk dir dieses Gefühl. #sprecher:ambrose #stimmung:stolz
Es kommt seltener, als man glaubt. #sprecher:ambrose
Und nimm diese Karte. Mentor-Zug. Ich hoffe, du brauchst sie nie. #sprecher:ambrose
~ setzeSzene("akt1.clubnadelMapleFalls")
-> END

=== coach_nach_niederlage ===
Das war nichts für heute. Aber du hast in der Eröffnung gut gekämpft. #sprecher:coachDelgado
Noch einmal? Ich habe Zeit. Und Kekse. #sprecher:coachDelgado
* [„Noch einmal.“]
    -> coach_partie
* [„Später.“]
    Später ist gut. Das Brett wartet. #sprecher:coachDelgado
    -> END

=== coach_alltag ===
{nadelMapleFalls < 3:
    {~Noch einmal um die Nadel? Gold geht nur ohne Karten. Sag Bescheid.|Samstag Cedar Creek. Pünktlich am Bus, sonst pfeife ich.} #sprecher:coachDelgado
- else:
    {~Goldnadel! Ohne Karten! Ich erzähle es jedem, der zuhört.|Samstag Cedar Creek. Pünktlich am Bus, sonst pfeife ich.} #sprecher:coachDelgado #stimmung:froh
}
+ {nadelMapleFalls > 0 and nadelMapleFalls < 3} [„Noch eine Partie um die Nadel.“]
    -> coach_partie
+ [„Bis später, Coach.“]
    -> END

// ---------------------------------------------------------------- Sam

=== sam ===
{
- not samGetroffen: -> sam_erstes_treffen
- not reiheSamBestanden: -> sam_reihe
- not samKlagt: -> sam_klagt
- not todsuendenBestanden: -> sam_klagt_wieder
- todsuendenBestanden and ausgangSamRevanche == "": -> sam_revanche_angebot
- ausgangSamRevanche == "sieg" and not samVersoehnt: -> sam_nach_revanche
- ausgangSamRevanche != "" and ausgangSamRevanche != "sieg": -> sam_revanche_angebot
- else: -> sam_alltag
}

=== sam_erstes_treffen ===
~ samGetroffen = true
Du bist also das neue vierte Brett? Mal sehen. Ich bin Sam, erstes Brett. #sprecher:sam
Dame raus, Zug zwei. Funktioniert immer. Fast immer. #sprecher:sam
* [„Zeig mir deine Aufgaben.“]
    -> sam_reihe
* [„Später.“]
    Klar. Wenn du dich traust. #sprecher:sam
    -> END

=== sam_reihe ===
Okay, meine Aufgaben. Zählen und hängende Figuren. #sprecher:sam
Wer zählt, gewinnt. Sagt der Coach. #sprecher:sam
* [„Los.“]
    ~ beginneAufgaben("mapleFalls.reiheSam")
    -> END
* [„Gleich.“]
    -> END

=== sam_klagt ===
~ samKlagt = true
Sam starrt auf sein Brett. Die schwarze Dame fehlt im Kasten. #sprecher:erzaehler
Die Chefin wurde gefangen. Schon wieder. Das zählt nicht, das war Pech! #sprecher:sam
Sam ist mutig. Nur ist seine Dame mutiger als klug. #sprecher:ambrose
* [„Soll ich dir zeigen, warum?“]
    Du? Mir? … Okay, okay. Zeig mir das. #sprecher:sam
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
{ausgangSamRevanche == "":
    Okay. Die Dame bleibt erst mal zu Hause. Revanche? Jetzt? #sprecher:sam
- else:
    Noch mal! Diesmal mache ich alles richtig. Fast alles. #sprecher:sam
}
Übrigens: Der Coach guckt nur auf ihren eigenen Angriff. Immer. #sprecher:sam
Das hast du nicht von mir. #sprecher:sam
* [„Revanche.“]
    ~ beginnePartie("mapleFalls.samRevanche")
    -> END
* [„Später.“]
    -> END

=== sam_nach_revanche ===
~ samVersoehnt = true
Okay, okay. Die Dame gewinnt nicht allein. Hab's kapiert. #sprecher:sam
Du bist gut, {held}. Nicht so gut wie ich. Noch nicht. #sprecher:sam #stimmung:froh
Ein Rivale wird zum Freund. Das ist die schönste Eröffnung, die es gibt. #sprecher:ambrose
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
{~Das Clubtagebuch wächst! Bald brauche ich ein zweites.|Sam ist heute fast nett. Das kommt ins Tagebuch.|Ich hab gegen den Coach eine Figur gewonnen. Dann sieben verloren. Aber eine gewonnen!} #sprecher:juno
-> END

// ---------------------------------------------------------------- Victor

=== victor ===
{
- not victorGesehen: -> victor_trifft
- ausgangVictor == "": -> victor_wartet
- not kenntHale: -> victor_nachher
- else: -> victor_weg
}

=== victor_trifft ===
~ victorGesehen = true
Im Clubraum steht ein Mann im Anzug vor dem Schulamt. Auf seinem Tablet leuchtet „Perfect Move“. #sprecher:erzaehler
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
* [„Später.“]
    Später. Natürlich. #sprecher:victor
    -> END

=== victor_partie ===
// Regelwerk R33: Weiß Victor, Schwarz der Leser in einer Trainingsstellung um Zug 12 ohne
// Springer, Karten gesperrt; die Begegnung steht in begegnungen.json.
~ beginnePartie("mapleFalls.victor")
Victor stellt die Figuren auf. Seine Hände sind ruhig, sein Blick nicht. #sprecher:erzaehler
-> END

=== victor_nachher ===
~ kenntHale = true
{ausgangVictor == "niederlage":
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
Als der Raum leer ist, meldet sich das Brett in deiner Tasche. #sprecher:erzaehler
{ausgangVictor == "niederlage":
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
- Ich will besser werden. Ohne Glück. #sprecher:erzaehler
Dann gehen wir nach Cedar Creek. Sag deiner Mutter Bescheid. #sprecher:ambrose
-> END

=== victor_weg ===
Victor und sein Vater sind gegangen. Auf dem Tisch liegt ein Prospekt von Perfect Move. #sprecher:erzaehler
-> END
