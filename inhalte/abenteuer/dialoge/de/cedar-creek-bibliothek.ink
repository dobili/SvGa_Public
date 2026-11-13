// Ort: Stadtbibliothek von Cedar Creek mit dem Schachclub (Akt 1). Figuren: Mrs. Okafor, Dex, Mae.
//
// Szenen der Story-Bibel (docs/spiel/05_Story_Bibel.md, Abschnitt 4): 15 Der Bibliotheksclub
// (akt1.bibliotheksclub), 16 Aufgabenreihe (Runden cedarCreek.reiheDex, cedarCreek.reiheMae),
// 22 Einladung zur Sternennacht (Quest cedarCreek.sternennacht), 24 Clubkampf
// (Begegnung cedarCreek.clubkampf). Einstiege wie in orte.json: „okafor“, „dex“, „mae“.
// Die Quest-Auswertung meldet den Knoten, in dem die erste Zeile steht; Quests warten deshalb auf
// die Knoten mit Text (okafor_erstes_treffen, mae_einladung), nicht auf die Verteiler.
//
// Variablen: reiheDexBestanden, reiheMaeBestanden, ausgangCedarCreekClubkampf und nadelCedarCreek
// setzt die Hülle (regeln/dialogvariablen.ts); die übrigen setzt Ink selbst.
// sternennachtGesehen setzt cedar-creek-aussen.ink.

EXTERNAL beginnePartie(begegnung)
EXTERNAL beginneAufgaben(runde)

VAR held = "Du"
VAR okaforGetroffen = false
VAR archivGeordnet = false
VAR erzaehlung1858Gesehen = false
VAR dexGetroffen = false
VAR maeGetroffen = false
VAR maeEingeladen = false
VAR sternennachtGesehen = false
VAR reiheDexBestanden = false
VAR reiheMaeBestanden = false
VAR ausgangCedarCreekClubkampf = ""
VAR nadelCedarCreek = 0
VAR clubkampfCedarCreekBesprochen = 0
VAR teamAngekommen = false
VAR nadelRiverton = 0
VAR nadelIronwood = 0
VAR clubkampfBauerAbgelehnt = false
VAR clubkampfZaehlGesagt = false
VAR ambroseNenntNamen = false

// ---------------------------------------------------------------- Mrs. Okafor

=== okafor ===
{
- not okaforGetroffen: -> okafor_erstes_treffen
- not (reiheDexBestanden and reiheMaeBestanden): -> okafor_reihe_offen
- nadelCedarCreek > clubkampfCedarCreekBesprochen: -> okafor_nach_sieg
- nadelCedarCreek == 0 and ausgangCedarCreekClubkampf == "niederlage": -> okafor_nach_niederlage
- nadelCedarCreek == 0: -> okafor_clubkampf
- else: -> okafor_alltag
}

=== okafor_erstes_treffen ===
// Runde 11 (VC33 bis VC39, Roman Kapitel 11): Mrs. Okafor auf der Leiter, ihre Kennfrage an Juno,
// das lange Ansehen, „Whitlock.“ mit Stille (Klang: alles setzt aus bis auf die Uhr), die sechs
// Wörter, „Aha.“ und kein Weiterfragen. Später: #musik:stille bei „Whitlock“.
~ okaforGetroffen = true
Hohe Regale, grüne Leselampen, vier Bretter, an denen niemand sitzt. Eine kleine Frau steht auf einer Leiter. #sprecher:erzaehler
Sie stellt ein Buch zurück und steigt herunter, ohne sich festzuhalten. #sprecher:erzaehler
{teamAngekommen: Das Team aus Maple Falls. Grace Okafor. #sprecher:okafor|Ihr seid die Vorhut. Grace Okafor. Die Matten liegen im Lesesaal. #sprecher:okafor}
Juno Martínez. Du hast im Frühjahr gegen Mae deine Dame auf ein Feld gestellt, auf dem ein Springer stand. #sprecher:okafor
Ich dachte, der gehört mir. #sprecher:juno
Was glaubst du denn, warum er dort stand? #sprecher:okafor
* [Juno anstoßen]
* [Nichts sagen]
- Dann sieht sie dich an. Dann deinen Rucksack, aus dem eine Ecke des Bretts ragt. Sie sagt lange nichts. #sprecher:erzaehler #pause:2
Darf ich? #sprecher:okafor
* [Ihr das Brett geben]
* [Nicken]
- Sie hält es ins Licht der grünen Lampe und fährt mit dem Daumen über den Rand. #sprecher:erzaehler
A. W. Achtzehnhundertsiebenundfünfzig. #sprecher:okafor
Whitlock. #sprecher:okafor #pause:3
* [„Sie kennen den Namen?“]
* [Still bleiben]
- Er steht in einer Fußnote. In einem alten Schachkalender, unten im Archiv. #sprecher:okafor
Niemand schreibt über ihn. Eine Fußnote, sechs Wörter. #sprecher:okafor
Woher hast du das? #sprecher:okafor
* [„Vom Dachboden. Wir sind in das Haus gezogen.“]
* [„Es lag in einer Kiste.“]
- Aha. #sprecher:okafor
Sie gibt dir das Brett zurück, mit beiden Händen. Dann nimmt sie die Brille ab und putzt sie. Sie fragt nicht weiter. #sprecher:erzaehler
Manche Dinge erzählt man, wenn man so weit ist. #sprecher:okafor
Sechs Wörter. #sprecher:ambrose #pause
Eine Fußnote. #sprecher:ambrose #stimmung:bitter
{teamAngekommen: Nach dem Spiel gehen wir hinunter und sehen nach.|Nach dem Spiel morgen gehen wir hinunter und sehen nach.} Oder heute schon, wenn du mir tragen hilfst. #sprecher:okafor
* [„Ich helfe tragen.“]
    Wir hatten Wasser im Keller. Die Treppe hinten führt hinunter. Ich komme gleich nach. #sprecher:okafor
* [„Erst will ich spielen.“]
    Erst Dex, dann Mae. Eins nach dem anderen. Der Keller wartet. #sprecher:okafor
- -> END

=== okafor_reihe_offen ===
{
- not reiheDexBestanden: Fang bei Dex an. Dann Mae. Eins nach dem anderen. #sprecher:okafor
- else: Dex hast du geschafft. Jetzt Mae. Sie kennt mehr Mattbilder als ich. #sprecher:okafor
}
{not archivGeordnet:
    Und unten im Keller warten die nassen Kartons, wenn du magst. #sprecher:okafor
}
-> END

=== okafor_clubkampf ===
// Runde 11 (VC86 bis VC88, Roman Kapitel 15): still gespannt, die Uhr zählt mit. Keine Ansage der
// Falle vor der Partie. Mrs. Okafor nach der Sternennacht in der Fassung „müde“ (gibt es noch
// nicht). Später: #musik:clubkampfCedarCreek mit dem Ticken der Uhr darunter.
In der Bibliothek flüstert man auch beim Schach. Der lange Tisch ist geräumt bis auf ein Brett. #sprecher:erzaehler
Daneben liegt die Nadel: ein kleines Buch aus Metall, aufgeschlagen, mit einem Springer. #sprecher:erzaehler
{teamAngekommen: Außerhalb des Lichtkreises sitzen sie alle. Der Coach hält die Pfeife in der Faust, damit sie nicht pfeift. #sprecher:erzaehler}
{sternennachtGesehen: Ich bin gestern zu lange aufgeblieben. Das ist deine Schuld und die der Sterne. Ich beschwere mich nicht. #sprecher:okafor}
Setz dich. #sprecher:okafor
* [„Ich bin bereit.“]
    Sie wartet. Ich kenne das. Ich habe es nie ausgehalten. #sprecher:ambrose
    -> okafor_partie
* [„Noch nicht.“]
    Geduld ist auch ein Zug. #sprecher:okafor
    -> END

=== okafor_partie ===
~ beginnePartie("cedarCreek.clubkampf")
-> END

=== okafor_nach_sieg ===
// Runde 11 (VC91, VC92, Roman Kapitel 15): Ambrose schweigt nach der Partie („Er sagt nichts.
// Aber er ist da.“); die Karte Mentor-Zug vergibt die Quest ohne Kommentar; zum Steg schickt Juno.
// Später: #klang:turmuhr mit zwölf Schlägen vor der Fanfare.
~ clubkampfCedarCreekBesprochen = nadelCedarCreek
{ausgangCedarCreekClubkampf == "remis":
    Remis. Das war knapp. Die Bronzenadel gehört dir. #sprecher:okafor
    -> okafor_nadel
}
Sie legt die Hände in den Schoß und sieht dich über die Brille an. #sprecher:erzaehler
Das war keine Falle wert. Du hast sie alle gesehen. #sprecher:okafor
* [„Nicht alle.“]
* [Nicken]
- Genug. #sprecher:okafor
-> okafor_nadel

=== okafor_nadel ===
Sie reicht dir die Nadel über das Brett. {sternennachtGesehen:Revanche, wenn ich ausgeschlafen bin.|Noch einmal, wenn du magst.} #sprecher:okafor
{teamAngekommen: Coach Delgado pfeift. In der Bibliothek. Miss Ashby lässt einen Stempel fallen. #sprecher:erzaehler #klang:pfiff}
Das am Schluss hat keinen Namen. Darf ich ihm einen geben? #sprecher:mae #stimmung:froh
* [Nicken]
* [Die Nadel ansehen]
- Ambrose sagt nichts. Aber er ist da. #sprecher:erzaehler #pause:2
Der Bus fährt um sieben. Geh nur zum Steg. Du guckst schon den ganzen Tag so. #sprecher:juno
-> END

=== okafor_nach_niederlage ===
Diesmal nicht. Aber du hast lange gehalten. Noch einmal? #sprecher:okafor
* [„Noch einmal.“]
    -> okafor_partie
* [„Nicht jetzt.“]
    Das Brett wartet. Ich auch. #sprecher:okafor
    -> END

=== okafor_alltag ===
{
- not erzaehlung1858Gesehen:
    Der Karton mit den Jahren 1850 bis 1859 steht unten im Archiv. Schau ruhig hinein. #sprecher:okafor
- else:
    {~Manche Dinge erzählt man, wenn man so weit ist. Dein Brett erzählt viel.|Ein Matt ist ein Bild. Wer viele Bilder kennt, sieht sie im eigenen Spiel.|Komm wieder, wenn du magst. Wir haben Zeit.} #sprecher:okafor
}
+ {nadelCedarCreek > 0 and nadelCedarCreek < 3} [„Noch eine Partie um die Nadel.“]
    -> okafor_partie
+ [„Bis bald, Mrs. Okafor.“]
    -> END

// ---------------------------------------------------------------- Dex

=== dex ===
{
- not dexGetroffen: -> dex_erstes_treffen
- not reiheDexBestanden: -> dex_reihe
- else: -> dex_alltag
}

=== dex_erstes_treffen ===
~ dexGetroffen = true
Ein Junge sitzt zwischen Kabeln und einem halb gebauten Roboter. Daneben ein Brett. #sprecher:erzaehler
Dex. Halt mal. #sprecher:dex
Er drückt dir eine Zange in die Hand. #sprecher:erzaehler
Fast fertig. Es ist immer fast fertig. #sprecher:dex
Schach ist wie ein Schaltplan. Wenn der Turm hier steht, ist das wie ein Kurzschluss. Alles ist tot. #sprecher:dex
-> dex_reihe

=== dex_reihe ===
Siehst du? Kurzschluss. Matt in eins. Such. #sprecher:dex
* [„Her damit.“]
    ~ beginneAufgaben("cedarCreek.reiheDex")
    -> END
* [„Gleich.“]
    Ich löte so lange. #sprecher:dex
    -> END

=== dex_alltag ===
{~Der Roboter kann jetzt einen Bauern schieben. Einen. Dann fällt er um.|Matt in eins ist wie ein Schalter. An, aus, fertig.|Oma sagt, du hast Geduld. Das sagt sie fast nie.} #sprecher:dex
-> END

// ---------------------------------------------------------------- Mae

=== mae ===
{
- not maeGetroffen: -> mae_erstes_treffen
- not reiheDexBestanden: -> mae_erst_dex
- not reiheMaeBestanden: -> mae_reihe
- not maeEingeladen: -> mae_einladung
- else: -> mae_alltag
}

=== mae_erstes_treffen ===
~ maeGetroffen = true
Ein Mädchen mit Teleskop-Anstecker und einem Heft voller Zeichnungen winkt dir zu. #sprecher:erzaehler
Ich bin Mae! Ich kenne alle Mattbilder. Alle mit Namen. #sprecher:mae #stimmung:froh
Anastasia! Das ist ein Matt mit Namen. #sprecher:mae
Das klingt wie eine Prinzessin, ist aber gemein. #sprecher:mae
{reiheDexBestanden: -> mae_reihe}
-> mae_erst_dex

=== mae_erst_dex ===
Erst Dex, dann ich. Meine sind schwerer. Matt in zwei! #sprecher:mae
-> END

=== mae_reihe ===
Das hier ist das Arabische. Und das … #sprecher:mae
Sie senkt die Stimme. #sprecher:erzaehler
Das ist das Erstickte. Da hat der König so viele Freunde um sich, dass er keine Luft kriegt. #sprecher:mae
Mattbilder sind wie Gesichter. Wer eines kennt, erkennt es in jeder Menge. #sprecher:ambrose #stimmung:still
* [„Los geht's.“]
    ~ beginneAufgaben("cedarCreek.reiheMae")
    -> END
* [„Gleich.“]
    Ich warte. Ich zähle so lange Sterne. Im Kopf. #sprecher:mae
    -> END

=== mae_einladung ===
~ maeEingeladen = true
Heute Nacht kommen Sternschnuppen! Ganz viele. Wir schauen am Steg. #sprecher:mae #stimmung:froh
Dex kommt, Juno kommt, Mrs. Okafor passt auf. Kommst du auch? #sprecher:mae
* [„Klingt toll.“]
    Super! Wenn es dunkel wird, am Steg. #sprecher:mae
* [„Mal sehen.“]
    Okay. Der Himmel wartet nicht, aber er kommt jede Nacht wieder. #sprecher:mae
- -> END

=== mae_alltag ===
{sternennachtGesehen:
    {~Ich hab vierzehn Sternschnuppen gezählt! Dex sagt elf. Dex zählt falsch.|Mrs. Okafor ist heute müde. Das ist meine Schuld. Und die der Sterne.} #sprecher:mae
- else:
    {~Am Steg sieht man die Sterne am besten. Komm doch!|Ein Erstickungsmatt mit dem Springer. Das ist mein Lieblingsbild.} #sprecher:mae
}
-> END


// ================================================================ Runde 11: Roman, Kapitel 11
// Kleine Geschichte der Zwillinge Ivy und Jonah Pell (Dokument 20, Cedar Creek), drinnen ab
// Stufe C: C nach Akt 1 (nadelRiverton > 0), D nach Akt 2 (nadelIronwood > 0). Stufe A und B
// stehen in cedar-creek-aussen.ink (Treppe). Kennungen ivy und jonah.
// Auslöser für die Karte (fehlt noch): zwillinge (Figur in der Bibliothek ab Stufe C).

=== zwillinge ===
{
- nadelIronwood > 0: -> zwillinge_d
- nadelRiverton > 0: -> zwillinge_c
- else:
    Die Zwillinge sitzen draußen auf der Treppe. Hier drinnen ist es still. #sprecher:erzaehler
    -> END
}

=== zwillinge_c ===
Am Tresen hängt eine Strichliste in Miss Ashbys Schrift: Ivy 14, Jonah 14. #sprecher:erzaehler
Die Zwillinge spielen am langen Tisch. Leise. Keiner sagt, wer gewinnt. #sprecher:erzaehler
Vierzehn zu vierzehn. Die gerechteste Zahl, die es gibt. Und die langweiligste. #sprecher:ambrose #stimmung:lacht
-> END

=== zwillinge_d ===
Jonah sitzt im Club am Brett, gegen Dex. Ivy sitzt daneben und liest. #sprecher:erzaehler
Wir streiten nicht mehr. Es ist furchtbar. #sprecher:ivy
-> END

// ================================================================ Runde 11: Roman, Kapitel 15
// Zwei Dialoge mitten im Clubkampf (Begegnung cedarCreek.clubkampf). Die Technik, die einen Dialog
// während einer Partie auslöst, baut mittel-2; bis dahin stehen die Knoten hier bereit und laufen
// nicht von selbst. Stimmung: still gespannt, die Uhr zählt mit. Die Karte Mentor-Zug vergibt die
// Quest erst nach dem Clubkampf (quests.json, cedarCreek.clubkampf, Schritt 4): Ambrose hält sich
// in der Partie zurück. Später: #musik:clubkampfCedarCreek setzt beim Bauern aus; bei „Lass mich“
// drängt #musik:ambrose herein und reißt bei „Ich weiß es nicht“ ab; bei „Zähl“ #klang:aha.
//
// Auslöser clubkampf_bauer: Mrs. Okafor bietet einen Bauern vor ihrem König an, der ungedeckt
// aussieht; nimmt ihn ein Turm, verlässt er die Grundreihe, und das Grundreihenmatt droht (Roman:
// etwa der 20. Zug). Der Dialog läuft, bevor der Zug des Helden ausgeführt wird.
//
// Auslöser clubkampf_lass_mich: Ein Turmopfer gegen ihre Königsstellung ist möglich, aber nicht
// korrekt (ein stiller Läuferzug verteidigt), und {held} hat weniger als vier Minuten auf der Uhr.
// Einmal je Partie. Danach entscheidet {held} selbst; der Dialog führt keinen Zug aus.

=== clubkampf_bauer ===
Ein Bauer steht vor ihrem König. Niemand passt auf ihn auf. Du zählst zweimal: kein Verteidiger. #sprecher:erzaehler
Was glaubst du denn, warum er dort steht? #sprecher:okafor #pause
* [Die Hand zurückziehen]
    ~ clubkampfBauerAbgelehnt = true
    Du siehst noch einmal hin. Nicht auf den Bauern. Auf deinen König, hinter seinen drei Bauern. #sprecher:erzaehler
    Grundreihe. Der König, der keine Luft kriegt. Du machst ihm ein Fenster auf. #sprecher:erzaehler
    Geduld. Wo hast du die her? #sprecher:okafor #stimmung:froh
* [Den Bauern trotzdem nehmen]
    Nun denn. #sprecher:okafor
- -> END

=== clubkampf_lass_mich ===
~ clubkampfZaehlGesagt = true
Lass mich. #sprecher:ambrose #stimmung:stolz
// Den Namen sagt er nur, wenn er ihn im Archiv schon einmal gesagt hat (Dokument 19, 5.2).
Nur dieses eine Mal. Ich sehe es. Der Turm, {ambroseNenntNamen:{held}|Lehrling}, der Turm, mitten hinein. #sprecher:ambrose
Sie muss ihn nehmen, und dann … #sprecher:ambrose
Es wäre schön. Es wäre so schön. #sprecher:ambrose
* [„Stimmt es?“]
    Stille. Die Uhr tickt. Drei Minuten. #sprecher:erzaehler #pause
    Ich weiß es nicht. #sprecher:ambrose #stimmung:traurig #pause:2
* [Die Hand auf dem Turm lassen]
    {erzaehlung1858Gesehen: Ein Turm, einfach hingestellt. Du hast die Geschichte im Archiv gehört. #sprecher:erzaehler}
    Ich weiß nicht, ob es stimmt. #sprecher:ambrose #stimmung:traurig #pause:2
- Vergib mir. Zähl. #sprecher:ambrose
-> END
