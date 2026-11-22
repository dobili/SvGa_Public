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
// Gesetzt auch in cedar-creek-archiv.ordnen; mit ihr bietet der Karton das Ordnen nach der Nadel an.
VAR ordnenAngeboten = false
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
// Alltag nach Akt 1 (Querschnitt 17.11.2026): tiefpunktGesehen setzt port-delacroix-turnhalle.ink.
VAR tiefpunktGesehen = false
VAR ambroseNenntNamen = false
VAR clubkampfBauerGesehen = false
VAR nachtImLesesaal = false
VAR clubkampfBauerAbgelehnt = false
VAR clubkampfZaehlGesagt = false
// Aus capital-arena-aussen.ink: Nach dem Abschied (Szene 109) spricht Ambrose nicht mehr
// (Story-Bibel Abschnitt 33, Frage 5; Entscheidung Q21-5). Hier nur gelesen.
VAR abschiedGesehen = false
// Läuft eine Revanche um eine bessere Nadel? Dann reagiert okafor_nach_revanche auf den Ausgang.
VAR revancheCedarCreek = false

// ---------------------------------------------------------------- Mrs. Okafor

=== okafor ===
{
- not okaforGetroffen: -> okafor_erstes_treffen
- not (reiheDexBestanden and reiheMaeBestanden): -> okafor_reihe_offen
- nadelCedarCreek > clubkampfCedarCreekBesprochen: -> okafor_nach_sieg
- revancheCedarCreek: -> okafor_nach_revanche
- nadelCedarCreek == 0 and ausgangCedarCreekClubkampf == "niederlage": -> okafor_nach_niederlage
- nadelCedarCreek == 0 and not nachtImLesesaal: -> okafor_bis_morgen
- nadelCedarCreek == 0: -> okafor_clubkampf
// Quests verfehlen (20.11.2026): Wer vor der Nadel nie im Archiv war, bekam das Ordnen nie
// angeboten (cedarCreek.archivOrdnen). Einmal nach der Nadel bittet Mrs. Okafor darum.
- not archivGeordnet and not ordnenAngeboten: -> okafor_archiv_bitte
- else: -> okafor_alltag
}

=== okafor_archiv_bitte ===
~ ordnenAngeboten = true
Eine Bitte noch. Unten im Archiv stehen die nassen Kartons, und allein schaffe ich die nicht. #sprecher:okafor #stimmung:nachdenklich
-> END

=== okafor_erstes_treffen ===
// Runde 11 (VC33 bis VC39, Roman Kapitel 11): Mrs. Okafor auf der Leiter, ihre Kennfrage an Juno,
// das lange Ansehen, „Whitlock.“ mit Stille (Klang: alles setzt aus bis auf die Uhr), die sechs
// Wörter, „Aha.“ und kein Weiterfragen. Klang: Stille S13 bei „Whitlock“.
~ okaforGetroffen = true
Hohe Regale, grüne Leselampen, zwei Bretter, an denen niemand sitzt. Eine kleine Frau steht auf einer Leiter. #sprecher:erzaehler
Sie stellt ein Buch zurück und steigt herunter, ohne sich festzuhalten. #sprecher:erzaehler
{teamAngekommen: Das Team aus Maple Falls. Grace Okafor. #sprecher:okafor #stimmung:laechelt|Ihr seid die Vorhut. Grace Okafor. Die Matten liegen im Lesesaal. #sprecher:okafor #stimmung:laechelt}
Juno Martínez. Du hast im Frühjahr gegen Mae deine Dame auf ein Feld gestellt, auf dem ein Springer stand. #sprecher:okafor #stimmung:nachdenklich
Ich dachte, der gehört mir. #sprecher:juno #stimmung:ueberrascht
Was glaubst du denn, warum er dort stand? #sprecher:okafor #stimmung:nachdenklich
* [Juno anstoßen]
* [Nichts sagen]
- Dann sieht sie dich an. Dann deinen Rucksack, aus dem eine Ecke des Bretts ragt. #sprecher:erzaehler
Sie sagt lange nichts. #sprecher:erzaehler #pause:2
Darf ich? #sprecher:okafor #stimmung:laechelt
* [Ihr das Brett geben]
* [Nicken]
- Sie hält es ins Licht der grünen Lampe und fährt mit dem Daumen über den Rand. #sprecher:erzaehler
A. W. #sprecher:okafor #stimmung:nachdenklich
Achtzehnhundertsiebenundfünfzig. #sprecher:okafor #stimmung:nachdenklich
Whitlock. #sprecher:okafor #stimmung:ueberrascht #musik:aus #pause:3
* [„Sie kennen den Namen?“]
* [Still bleiben]
- Er steht in einer Fußnote. In einem alten Schachkalender, unten im Archiv. #sprecher:okafor #stimmung:nachdenklich
Niemand schreibt über ihn. Eine Fußnote, sechs Wörter. #sprecher:okafor #stimmung:nachdenklich
Woher hast du das? #sprecher:okafor #stimmung:ueberrascht
* [„Vom Dachboden. Wir sind in das Haus gezogen.“]
* [„Es lag in einer Kiste.“]
- Aha. #sprecher:okafor #stimmung:nachdenklich #musik:karte
Sie gibt dir das Brett zurück, mit beiden Händen. Dann nimmt sie die Brille ab und putzt sie. #sprecher:erzaehler
Sie fragt nicht weiter. #sprecher:erzaehler
Manche Dinge erzählt man, wenn man so weit ist. #sprecher:okafor #stimmung:laechelt
Sechs Wörter. #sprecher:ambrose #stimmung:bitter #pause
Eine Fußnote. #sprecher:ambrose #stimmung:bitter
{teamAngekommen: Nach dem Spiel gehen wir hinunter und sehen nach. Oder gleich, wenn du mir tragen hilfst.|Nach dem Spiel morgen gehen wir hinunter und sehen nach. Oder heute schon, wenn du mir tragen hilfst.} #sprecher:okafor #stimmung:laechelt
* [„Ich helfe tragen.“]
    Wir hatten Wasser im Keller. Die Treppe hinten führt hinunter. #sprecher:okafor #stimmung:nachdenklich
    Ich komme gleich nach. #sprecher:okafor #stimmung:nachdenklich
* [„Erst will ich spielen.“]
    Erst Dex, dann Mae. Eins nach dem anderen, der Keller wartet. #sprecher:okafor #stimmung:laechelt
- -> END

=== okafor_reihe_offen ===
{
- not reiheDexBestanden: Fang bei Dex an. Dann Mae. #sprecher:okafor #stimmung:neutral
Eins nach dem anderen. #sprecher:okafor #stimmung:neutral
- else: Dex hast du geschafft. Jetzt Mae. #sprecher:okafor #stimmung:laechelt
Sie kennt mehr Mattbilder als ich. #sprecher:okafor #stimmung:laechelt
}
{not archivGeordnet:
    Und unten im Keller warten die nassen Kartons, wenn du magst. #sprecher:okafor #stimmung:laechelt
}
-> END

// Ablauf nach dem Roman (Kapitel 10 bis 15): Der Clubkampf ist am Samstag, nach der Nacht im
// Lesesaal. Geschlafen wird erst nach der Sternennacht (cedar-creek-aussen.sterne_ende): Sie ist
// nicht zu verpassen (19.11.2026); wer schlafen will, schickt Mrs. Okafor erst zum Steg.
=== okafor_bis_morgen ===
Die Aufgaben sind gelöst. Gespielt wird morgen, wenn dein Team da ist. #sprecher:okafor #stimmung:laechelt
{maeEingeladen and not sternennachtGesehen: Heute Abend schauen die Kinder am Steg nach den Sternen. Danach: die Matten im Lesesaal. #sprecher:okafor #stimmung:laechelt}
// Wer schlafen ginge, bevor Mae eingeladen hat, bekäme die Sternennacht nie angeboten (die Quest
// beginnt in mae_einladung, und nach der Nacht lädt Mae nicht mehr ein). Deshalb schickt
// Mrs. Okafor erst zu Mae; schlafen geht man danach.
{not maeEingeladen: Mae sucht dich übrigens. Es geht um Sterne, glaube ich. #sprecher:okafor #stimmung:laechelt}
* {not maeEingeladen} [„Ich frag sie.“]
    Tu das. Sie platzt sonst. #sprecher:okafor #stimmung:laechelt
    -> END
* {maeEingeladen} [„Ich geh noch zum Steg.“]
    Geh nur. Am Wasser wird es abends kalt. #sprecher:okafor #stimmung:laechelt
    -> END
* {maeEingeladen} [„Ich geh schlafen.“]
    Erst die Sterne. Mae redet seit Tagen von nichts anderem, und ich habe Tee gekocht. #sprecher:okafor #stimmung:laechelt
    Die Matten laufen nicht weg. #sprecher:okafor #stimmung:laechelt
    -> END

=== okafor_clubkampf ===
// Runde 11 (VC86 bis VC88, Roman Kapitel 15): still gespannt, die Uhr zählt mit. Keine Ansage der
// Falle vor der Partie. Mrs. Okafor nach der Sternennacht in der Fassung „müde“ (gibt es noch
// nicht). Die Partie spielt cedarCreek.clubkampf; die Momente darin stehen in begegnungen.json.
In der Bibliothek flüstert man auch beim Schach. Der lange Tisch ist geräumt bis auf ein Brett. #sprecher:erzaehler
Daneben liegt die Nadel: ein kleines Buch aus Metall, aufgeschlagen, mit einem Springer. #sprecher:erzaehler
{teamAngekommen: Außerhalb des Lichtkreises sitzen sie alle. Der Coach hält die Pfeife in der Faust, damit sie nicht pfeift. #sprecher:erzaehler}
{sternennachtGesehen:
    Ich bin gestern zu lange aufgeblieben. Das ist deine Schuld und die der Sterne. #sprecher:okafor #stimmung:laechelt
    Ich beschwere mich nicht. #sprecher:okafor #stimmung:laechelt
}
Setz dich. #sprecher:okafor #stimmung:laechelt
* [„Ich bin bereit.“]
    Die Uhr im Türmchen tickt. Man hört sie durch die Decke. #sprecher:erzaehler
    -> okafor_partie
* [„Noch nicht.“]
    Geduld ist auch ein Zug. #sprecher:okafor #stimmung:laechelt
    -> END

=== okafor_partie ===
~ beginnePartie("cedarCreek.clubkampf")
-> END

=== okafor_nach_sieg ===
~ revancheCedarCreek = false
// Runde 11 (VC91, VC92, Roman Kapitel 15): Ambrose schweigt nach der Partie („Er sagt nichts.
// Aber er ist da.“); die Karte Mentor-Zug vergibt die Quest ohne Kommentar; zum Steg schickt Juno.
// Klang: Stille S24 (zwölf Uhrschläge), dann die Fanfare.
// Lektorat 19.11.2026: Eine Revanche, die eine bessere Nadel bringt, spielt nicht die ganze Szene
// des ersten Siegs noch einmal (Glocken, Kantine, „Noch mal. Jetzt.“).
{clubkampfCedarCreekBesprochen > 0:
    ~ clubkampfCedarCreekBesprochen = nadelCedarCreek
    Sie reicht dir die bessere Nadel über das Brett. #sprecher:erzaehler #klang:fanfare
    Du bist wiedergekommen. Das gefällt mir mehr als der Sieg. #sprecher:okafor #stimmung:laechelt
    -> END
}
~ clubkampfCedarCreekBesprochen = nadelCedarCreek
{ausgangCedarCreekClubkampf == "remis":
    Remis. Das war knapp. #sprecher:okafor #stimmung:laechelt
    Die Bronzenadel gehört dir. #sprecher:okafor #stimmung:laechelt
    -> okafor_nadel
}
Sie legt die Hände in den Schoß und sieht dich über die Brille an. #sprecher:erzaehler
{clubkampfBauerGesehen and not clubkampfBauerAbgelehnt:Den Bauern wolltest du. Danach hast du hingesehen, und das zählt.|Das war keine Falle wert. Du hast sie alle gesehen.} #sprecher:okafor #stimmung:laechelt
* [„Nicht alle.“]
* [Nicken]
- Genug. #sprecher:okafor #stimmung:laechelt
-> okafor_nadel

=== okafor_nadel ===
Über euch schlägt die Uhr. Zwölf Schläge, einer nach dem anderen. #sprecher:erzaehler #klang:turmuhr12 #musik:aus #pause:3
// Lektorat der Lesefassung, 17.11.2026: Der Erzählsatz stand in Mrs. Okafors Sprechzeile.
Sie reicht dir die Nadel über das Brett. #sprecher:erzaehler #klang:fanfare
{sternennachtGesehen:Revanche, wenn ich ausgeschlafen bin.|Noch einmal, wenn du magst.} #sprecher:okafor #stimmung:laechelt
{teamAngekommen:
    Coach Delgado pfeift. In der Bibliothek. #sprecher:erzaehler #klang:pfiff
    Miss Ashby lässt einen Stempel fallen. #sprecher:erzaehler
}
Das am Schluss hat keinen Namen. Darf ich ihm einen geben? #sprecher:mae #stimmung:froh
* [Nicken]
* [Die Nadel ansehen]
- Ambrose sagt nichts. Aber er ist da. #sprecher:erzaehler #pause:2
// Lektorat 19.11.2026: Bronze ist 1; bei Silber und Gold fehlte Junos Hinweis auf den Steg.
Der Bus fährt um sieben. Geh nur zum Steg. #sprecher:juno #stimmung:laechelt
Du guckst schon den ganzen Tag so. #sprecher:juno #stimmung:laechelt
-> END

=== okafor_nach_niederlage ===
Diesmal nicht. Aber du hast lange gehalten, noch einmal? #sprecher:okafor #stimmung:laechelt
// Ambrose nach dem verlorenen Clubkampf (schwacher Spieler im Durchlauf, 19.11.2026: vorher
// sprach nur der Clubchef). Nach dem Abschied schweigt er.
{not abschiedGesehen:
    Sie wartet, bis du ungeduldig wirst. Werde es nicht, dann wartet sie umsonst. #sprecher:ambrose #stimmung:nachdenklich
}
* [„Noch einmal.“]
    -> okafor_partie
* [„Nicht jetzt.“]
    Das Brett wartet. Ich auch. #sprecher:okafor #stimmung:laechelt
    -> END

=== okafor_alltag ===
{
- not erzaehlung1858Gesehen:
    Der Karton mit den Jahren 1850 bis 1859 steht unten im Archiv. Schau ruhig hinein. #sprecher:okafor #stimmung:neutral
- tiefpunktGesehen:
    {~Ich habe gehört, was man in Port Delacroix über dich sagt. Deine Partien habe ich hier im Ordner, jede einzelne.|Wer ehrlich spielt, kann jeden Zug erklären. Erklär mir einen, ich habe Zeit.|Hier steht immer noch kein Bildschirm. Und dein Stuhl steht noch da, wo er stand.} #sprecher:okafor #stimmung:nachdenklich
- nadelIronwood > 0:
    {~Ein Herr mit zwei Telefonen war im Rathaus. Hier steht noch kein Bildschirm, denn ich habe Geduld und den Schlüssel.|Juno schickt mir Bilder aus ihrem Tagebuch. Vier Nadeln, ich habe es mir aufgeschrieben.|Riverton, Ironwood: Ich lese die Zeitungen. Ich lese auch, was nicht drinsteht.} #sprecher:okafor #stimmung:nachdenklich
- else:
    {~Manche Dinge erzählt man, wenn man so weit ist. Dein Brett erzählt viel.|Ein Matt ist ein Bild. Wer viele Bilder kennt, sieht sie im eigenen Spiel.|Komm wieder, wenn du magst. Wir haben Zeit.} #sprecher:okafor #stimmung:laechelt
}
+ {nadelCedarCreek > 0 and nadelCedarCreek < 3} [„Noch eine Partie um die Nadel.“]
    ~ revancheCedarCreek = true
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
Dex. Halt mal. #sprecher:dex #stimmung:neutral
Er drückt dir eine Zange in die Hand. #sprecher:erzaehler
Fast fertig. Es ist immer fast fertig. #sprecher:dex #stimmung:nachdenklich
Schach ist wie ein Schaltplan. Wenn der Turm hier steht, ist das wie ein Kurzschluss – alles ist tot. #sprecher:dex #stimmung:nachdenklich
-> dex_reihe

=== dex_reihe ===
Siehst du? Kurzschluss. #sprecher:dex #stimmung:laechelt
Matt in eins. Such. #sprecher:dex #stimmung:laechelt
* [„Her damit.“]
    ~ beginneAufgaben("cedarCreek.reiheDex")
    -> END
* [„Gleich.“]
    Ich löte so lange. #sprecher:dex #stimmung:neutral
    -> END

=== dex_alltag ===
{~Der Roboter kann jetzt einen Bauern schieben, genau einen. Dann fällt er um.|Matt in eins ist wie ein Schalter. An, aus, fertig.|Oma sagt, du hast Geduld. Das sagt sie fast nie.} #sprecher:dex #stimmung:laechelt
-> END

// ---------------------------------------------------------------- Mae

=== mae ===
{
- not maeGetroffen: -> mae_erstes_treffen
- not reiheDexBestanden: -> mae_erst_dex
- not reiheMaeBestanden: -> mae_reihe
- not maeEingeladen and not nachtImLesesaal: -> mae_einladung
- else: -> mae_alltag
}

=== mae_erstes_treffen ===
~ maeGetroffen = true
Ein Mädchen mit Teleskop-Anstecker und einem Heft voller Zeichnungen winkt dir zu. #sprecher:erzaehler
Ich bin Mae! Ich kenne alle Mattbilder – alle mit Namen. #sprecher:mae #stimmung:froh
Anastasia! Das ist ein Matt mit Namen. #sprecher:mae #stimmung:laechelt #brett:anastasia.1
Das klingt wie eine Prinzessin, ist aber gemein. #sprecher:mae #stimmung:lacht
{reiheDexBestanden: -> mae_reihe}
-> mae_erst_dex

=== mae_erst_dex ===
Erst Dex, dann ich. Meine sind schwerer – Matt in zwei! #sprecher:mae #stimmung:laechelt
-> END

=== mae_reihe ===
Das hier ist das Arabische. Und das … #sprecher:mae #stimmung:laechelt
Sie senkt die Stimme. #sprecher:erzaehler
Das ist das Erstickte. Da hat der König so viele Freunde um sich, dass er keine Luft kriegt. #sprecher:mae #stimmung:lacht
{not abschiedGesehen:
    Mattbilder sind wie Gesichter. Wer eines kennt, erkennt es in jeder Menge. #sprecher:ambrose #stimmung:still
}
* [„Los geht's.“]
    ~ beginneAufgaben("cedarCreek.reiheMae")
    -> END
* [„Gleich.“]
    Ich warte. Ich zähle so lange Sterne, im Kopf. #sprecher:mae #stimmung:laechelt
    -> END

=== mae_einladung ===
~ maeEingeladen = true
Heute Nacht kommen Sternschnuppen! Ganz viele. #sprecher:mae #stimmung:froh
Wir schauen am Steg. #sprecher:mae #stimmung:froh
Dex kommt, Juno kommt, Mrs. Okafor passt auf. Kommst du auch? #sprecher:mae #stimmung:laechelt
* [„Klingt toll.“]
    Super! Wenn es dunkel wird, am Steg. #sprecher:mae #stimmung:laechelt
* [„Mal sehen.“]
    Okay. Der Himmel wartet nicht, aber er kommt jede Nacht wieder. #sprecher:mae #stimmung:laechelt
- -> END

=== mae_alltag ===
// Dialogprüfung, 17.11.2026: Wer die Sternennacht verschlafen hat, wird am Morgen nicht mehr
// zum Steg eingeladen; Mae erzählt stattdessen, wie sie es versprochen hat.
{
- sternennachtGesehen:
    {~Ich hab vierzehn Sternschnuppen gezählt! Dex sagt elf, aber Dex zählt falsch.|Mrs. Okafor hat heute dreimal gegähnt. Ich hab mitgezählt.} #sprecher:mae #stimmung:lacht
- nachtImLesesaal:
    {~Du hast vierzehn Sternschnuppen verpasst! Dex sagt elf, aber Dex zählt falsch.|Ein Erstickungsmatt mit dem Springer. Das ist mein Lieblingsbild.} #sprecher:mae #stimmung:laechelt
- else:
    {~Am Steg sieht man die Sterne am besten. Komm doch!|Ein Erstickungsmatt mit dem Springer. Das ist mein Lieblingsbild.} #sprecher:mae #stimmung:laechelt
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
Die Zwillinge spielen am langen Tisch. Leise. #sprecher:erzaehler
Keiner sagt, wer gewinnt. #sprecher:erzaehler
{not abschiedGesehen:
    Vierzehn zu vierzehn. Die gerechteste Zahl, die es gibt, und die langweiligste. #sprecher:ambrose #stimmung:lacht
}
-> END

=== zwillinge_d ===
Jonah sitzt im Club am Brett, gegen Dex. Ivy sitzt daneben und liest. #sprecher:erzaehler
Wir streiten nicht mehr. Es ist furchtbar. #sprecher:ivy #stimmung:bitter
-> END

// ================================================================ Runde 11: Roman, Kapitel 15
// Zwei geführte Momente mitten im Clubkampf (Technik T11 von mittel-2; begegnungen.json,
// cedarCreek.clubkampf): clubkampf_bauer beim Köder (Merkmal koeder, ab Zug 12; Rückfall ab Zug
// 18) und clubkampf_lass_mich beim möglichen Turmopfer mit weniger als vier Minuten (turmopfer,
// uhrUnter 240; Rückfall ab Zug 26). Jede Szene läuft nur einmal (Variablen unten), auch wenn
// Merkmal und Rückfall beide auslösen. Die Uhr steht, solange der Dialog offen ist; er führt keinen
// Zug aus. Die Karte Mentor-Zug vergibt die Quest erst nach dem Clubkampf.
// Klang (21_Klangplan.md S22, S23): beim Bauern setzt die Musik aus; „Lass mich“ mit
// ambrose.lassMich, Abriss bei „Ich weiß es nicht“, bei „Zähl“ das Aha.

=== clubkampf_bauer ===
{clubkampfBauerGesehen: -> END}
~ clubkampfBauerGesehen = true
Ein Bauer steht vor ihrem König. Niemand passt auf ihn auf. #sprecher:erzaehler #musik:aus
Du zählst zweimal: kein Verteidiger. #sprecher:erzaehler
Was glaubst du denn, warum er dort steht? #sprecher:okafor #stimmung:nachdenklich #pause:2
* [Die Hand zurückziehen]
    ~ clubkampfBauerAbgelehnt = true
    Du siehst noch einmal hin. Nicht auf den Bauern. #sprecher:erzaehler
    Auf deinen König, hinter seinen drei Bauern. #sprecher:erzaehler
    Grundreihe. Der König, der keine Luft kriegt. #sprecher:erzaehler
    Geduld. Wo hast du die her? #sprecher:okafor #stimmung:froh #musik:karte
* [Den Bauern trotzdem nehmen wollen]
    Nun denn. #sprecher:okafor #stimmung:nachdenklich #musik:karte
- -> END

=== clubkampf_lass_mich ===
{clubkampfZaehlGesagt: -> END}
~ clubkampfZaehlGesagt = true
Lass mich. #sprecher:ambrose #stimmung:nachdenklich #musik:ambrose.lassMich
Nur dieses eine Mal. Ich sehe es. #sprecher:ambrose #stimmung:ueberrascht
Der Turm, {ambroseNenntNamen:{held}|Lehrling}, der Turm, mitten hinein. #sprecher:ambrose #stimmung:ueberrascht
Sie muss ihn nehmen, und dann … #sprecher:ambrose #stimmung:ueberrascht
Es wäre schön. Es wäre so schön. #sprecher:ambrose #stimmung:ueberrascht
{erzaehlung1858Gesehen: Ein Turm, einfach hingestellt. Du hast die Geschichte im Archiv gehört. #sprecher:erzaehler}
// Gutachten K1.4: Die Frage des Helden ist der Wendepunkt; sie fällt immer.
* [„Stimmt es?“]
- Stille. Die Uhr tickt. #sprecher:erzaehler #pause:2
Ich weiß es nicht. #sprecher:ambrose #stimmung:traurig #musik:aus #pause:3
Vergib mir. Zähl. #sprecher:ambrose #stimmung:bitter #klang:aha
-> END

// Rückmeldung nach der Runde (runden.json `danach`; Wunsch des Autors, 19.11.2026): bestanden ein Satz von Dex, sonst wie bisher.
=== dex_reihe_danach ===
{not reiheDexBestanden: -> dex}
Alle Kurzschlüsse gefunden. Der Roboter schafft das noch nicht. #sprecher:dex #stimmung:laechelt
Mae wartet mit ihren Mattbildern. Die mit den Namen. #sprecher:dex #stimmung:neutral
-> END

// Rückmeldung nach der Runde (runden.json `danach`; Wunsch des Autors, 19.11.2026): bestanden ein Satz von Mae, dann weiter wie bisher (Einladung zum Steg).
=== mae_reihe_danach ===
{not reiheMaeBestanden: -> mae}
Du hast jedes Bild erkannt! Auch das Erstickte! #sprecher:mae #stimmung:froh
-> mae

// Revanche um eine bessere Nadel, die keine bessere Nadel brachte (Spieler-Durchlauf mit schwachem
// Spieler, 19.11.2026): Vorher folgte nur ein Alltagssatz, jetzt geht okafor auf den Ausgang ein.
// Abgebrochen: keine Reaktion, weiter wie sonst.
=== okafor_nach_revanche ===
~ revancheCedarCreek = false
{
- ausgangCedarCreekClubkampf == "sieg":
    Gewonnen. Die Nadel bleibt dieselbe; die Partie kommt trotzdem in den Ordner. #sprecher:okafor #stimmung:laechelt
- ausgangCedarCreekClubkampf == "remis":
    Remis. Geduld ist auch ein Ergebnis – deine Nadel bleibt. #sprecher:okafor #stimmung:neutral
- ausgangCedarCreekClubkampf == "niederlage":
    Diesmal nicht. Deine Nadel bleibt dir. #sprecher:okafor #stimmung:laechelt
    Wir haben Zeit. #sprecher:okafor #stimmung:laechelt
- else:
    -> okafor
}
+ {nadelCedarCreek < 3} [„Noch einmal.“]
    ~ revancheCedarCreek = true
    ~ beginnePartie("cedarCreek.clubkampf")
    -> END
+ [„Nicht jetzt.“]
    -> END
