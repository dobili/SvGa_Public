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
~ okaforGetroffen = true
Hohe Regale, grüne Leselampen, vier Bretter an einem langen Tisch. Eine ältere Dame sieht von einem Buch auf. #sprecher:erzaehler
Das Team aus Maple Falls. Willkommen. Ich bin Grace Okafor. #sprecher:okafor #stimmung:froh
Ihr Blick bleibt an deinem Rucksack hängen. Am Rand des alten Bretts sieht man eingebrannte Buchstaben: A. W. 1857. #sprecher:erzaehler
Whitlock. #sprecher:okafor #pause
* [„Woher kennen Sie den Namen?“]
    Aus einer Fußnote in einem alten Schachkalender. Unten im Archiv. #sprecher:okafor
* [„Das Brett lag auf unserem Dachboden.“]
    Im Whitlock-Haus in Maple Falls? Dann passt es. #sprecher:okafor
- Was glaubst du denn, warum ein Brett so alt wird? Weil jemand es liebt. #sprecher:okafor
Sie kennt meinen Namen. Nach hundertsechzig Jahren. #sprecher:ambrose #stimmung:traurig
Ich weiß nicht, ob ich mich freuen soll. #sprecher:ambrose
Im Keller hatten wir einen Wasserschaden. Hilfst du mir beim Umräumen, suchen wir den Kalender gemeinsam. #sprecher:okafor
* [„Klar helfe ich.“]
    Danke. Die Treppe hinten führt hinunter. Ich komme gleich nach. #sprecher:okafor
* [„Erst will ich spielen.“]
    Gut so. Erst die Aufgaben von Dex und Mae, dann gegen mich. #sprecher:okafor
    Der Keller wartet. #sprecher:okafor
- -> END

=== okafor_reihe_offen ===
{
- not reiheDexBestanden: Fang bei Dex an, dann kommt Mae. Geduld. Ein Matt ist ein Bild, und Bilder lernt man eins nach dem anderen. #sprecher:okafor
- else: Dex hast du geschafft. Jetzt Mae. Sie kennt mehr Mattbilder als ich. #sprecher:okafor
}
{not archivGeordnet:
    Und unten im Keller warten die nassen Kartons, wenn du magst. #sprecher:okafor
}
-> END

=== okafor_clubkampf ===
Die Aufgaben sind gelöst. Dann setz dich, {held}. Um die Clubnadel. #sprecher:okafor
{sternennachtGesehen:
    Sie gähnt hinter vorgehaltener Hand. Die Sternennacht war lang. #sprecher:erzaehler
    Verzeih. Eine alte Frau sollte nicht bis Mitternacht Sternschnuppen zählen. #sprecher:okafor
}
* [„Ich bin bereit.“]
    Sie stellt Fallen an der Grundreihe. Zähle, wer deinen König schützt, bevor du angreifst. #sprecher:ambrose
    -> okafor_partie
* [„Noch nicht.“]
    Geduld ist auch ein Zug. #sprecher:okafor
    -> END

=== okafor_partie ===
~ beginnePartie("cedarCreek.clubkampf")
-> END

=== okafor_nach_sieg ===
~ clubkampfCedarCreekBesprochen = nadelCedarCreek
{ausgangCedarCreekClubkampf == "remis":
    Remis. Das war knapp. #sprecher:okafor
    Die Bronzenadel gehört dir. Noch einmal, wenn du magst? #sprecher:okafor
- else:
    Gut gespielt. Du hast meine Falle gesehen, bevor sie zuschnappte. #sprecher:okafor #stimmung:froh
}
{sternennachtGesehen:
    Revanche, wenn ich ausgeschlafen bin! #sprecher:okafor #stimmung:froh
}
Coach Delgado pfeift. Das Team aus Maple Falls hat das Auswärtsspiel gewonnen. #sprecher:erzaehler #klang:pfiff
Eine zweite Nadel. Und eine Karte, die ich nicht leichtfertig gebe. #sprecher:ambrose
Lass mich. Nur dieses eine Mal, wenn es sein muss. #sprecher:ambrose
{erzaehlung1858Gesehen:
    Am Abend fährt der Bus. Geh vorher noch einmal zum Steg, {held}. #sprecher:ambrose
- else:
    Am Abend fährt der Bus. Geh vorher noch einmal zum Steg, Lehrling. #sprecher:ambrose
}
Ich möchte dir etwas sagen. #sprecher:ambrose
-> END

=== okafor_nach_niederlage ===
Diesmal nicht. Aber du hast lange gehalten. #sprecher:okafor
Bei uns sagte man: Wer nur auf seinen Weg schaut, fällt in das Loch daneben. #sprecher:okafor
Das heißt: Schau auch auf meine Züge, nicht nur auf deine. Noch einmal? #sprecher:okafor
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
    {~Manche Dinge erzählt man, wenn man so weit ist. Dein Brett erzählt viel.|Ein Matt ist ein Bild. Wer viele Bilder kennt, sieht sie im eigenen Spiel.|Komm wieder, wenn du magst. Die Bibliothek hat keine Bildschirme, aber Geduld.} #sprecher:okafor
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
Dex. Mrs. Okafor ist meine Oma. Ich baue Dinge, die fast funktionieren. #sprecher:dex
Schach ist wie ein Schaltplan. Wenn der Turm hier steht, ist das wie ein Kurzschluss. #sprecher:dex
Alles ist tot. #sprecher:dex
Ein Bastler. Zu meiner Zeit bauten solche Leute Dampfkessel. #sprecher:ambrose
Manche explodierten. #sprecher:ambrose
-> dex_reihe

=== dex_reihe ===
Meine Aufgaben sind Matt in eins. Ein Zug, und der König kann nirgends mehr hin. #sprecher:dex
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
Matt in zwei und Mattbilder: Grundreihe, Erstickung, Anastasia, das Arabische. #sprecher:mae
Mattbilder sind wie Gesichter. Wer eines kennt, erkennt es in jeder Menge. #sprecher:ambrose
{erzaehlung1858Gesehen:
    Präg sie dir ein, {held}. Sie kommen wieder. #sprecher:ambrose
- else:
    Präg sie dir ein, Lehrling. Sie kommen wieder. #sprecher:ambrose
}
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
