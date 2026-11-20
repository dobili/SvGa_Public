// Weg 8 von Summit City nach Crossroads: Karten „Geysirbecken“ und „Prärie“ (Akt 4, Szene 92 der
// Story-Bibel, Abschnitt 29; Landschaften L4 Atomschach und L6 Entenschach, Weltbeschreibung 5.11).
//
// Stationen (W4): Rangerin Bell am Geysir (Atomschach; Buchbezug Kapitel 1, Zählen von
// Angreifern und Verteidigern), Sturmjäger Ray Castillo, Tomás' Onkel, im Sturmkeller
// (Entenschach), Rätseltafel „vorher zählen“ (Runde wegSummitCrossroads.tafel, Quest
// wegSummitCrossroads.tafelGeysir), Fund Bisonhaar, Bisons auf dem Steg.
// Einstiege wie in orte.json: bell, ray, zurueck_summit, tafel, fund_bisonhaar, bisons,
// sturmkeller. Die Ankunft in Crossroads erzählt crossroads-aussen.ankunft_zu_fuss.
//
// Varianten: Atomschach und Entenschach sind noch nicht gebaut (VARIANTE-FEHLT, Bericht).
// Variablen: wegSummitCrossroadsTafelBestanden setzt die Hülle (R42); die übrigen setzt diese
// Datei. Das Bisonhaar kommt über gibFund; Ink merkt es sich selbst (bisonhaarGefunden).

EXTERNAL beginneAufgaben(runde)
EXTERNAL gibFund(kennung)

VAR held = "Du"
VAR buchseiten = 0
VAR finchFiguren = 0
VAR spurenPM = 0
VAR wegSummitCrossroadsTafelBestanden = false
VAR bellGetroffen = false
VAR rayCastilloGetroffen = false
VAR varianteAtomschachGelernt = false
VAR varianteEntenschachGelernt = false
VAR bisonhaarGefunden = false
VAR bisonsGewartet = false
VAR wegSummitCrossroadsGeysirblitzBestanden = false
VAR geysirblitzGesehen = false
VAR geysirblitzBelohnt = false
VAR spurPM5Gefunden = false
VAR finchBauerDGefunden = false
VAR seite09Gefunden = false
// Aus capital-arena-aussen.ink: Nach dem Abschied (Szene 109) spricht Ambrose nicht mehr
// (Story-Bibel Abschnitt 33, Frage 5; Entscheidung Q21-5). Hier nur gelesen.
VAR abschiedGesehen = false
// Bell stellt sich beim ersten Auftritt vor, wo immer der ist (Lektorat Akt 4, Frage 4).
VAR bellVorgestellt = false

// ---------------------------------------------------------------- Rangerin Bell und das Atomschach

=== bell ===
{bellGetroffen: -> bell_alltag}
~ bellGetroffen = true
Zwischen den dampfenden Becken steht {bellVorgestellt:Bell|eine Rangerin} mit breitem Hut und sieht auf die Uhr. #sprecher:erzaehler
{not bellVorgestellt:Bell. Rangerin. }In sechs Minuten bricht der große Geysir aus. Bis dahin: Willst du was Verrücktes sehen? #sprecher:bell #stimmung:froh
~ bellVorgestellt = true
-> bell_regel_erstmals

// Die Regel allein (als Tunnel): Beim Nachfragen kommt nur sie, ohne Ambrose und Vorführung
// (Lesefassung 18.11.2026: Sonst lief bei jeder Nachfrage der ganze Auftakt noch einmal).
=== bell_regel ===
~ varianteAtomschachGelernt = true
Atomschach. Wer schlägt, löst eine Explosion aus: Die schlagende Figur und alle Figuren rund um das Feld fliegen vom Brett, eigene auch, nur Bauern nicht. #sprecher:bell #stimmung:laechelt
Also zählst du vorher. Wer greift an, wer verteidigt, was fliegt mit in die Luft. #sprecher:bell #stimmung:nachdenklich
->->

=== bell_regel_erstmals ===
-> bell_regel ->
{not abschiedGesehen:
    Wer schlägt, ohne zu zählen, fliegt in die Luft. Eine Lehre, die ich gern früher gehabt hätte. Etwa achtzehnhundertachtundfünfzig. #sprecher:ambrose #stimmung:lachtOhneSpott
    Angreifer und Verteidiger zählen, {held}. Hier zählt man nur ein paar Felder weiter. #sprecher:ambrose #stimmung:laechelt
}
-> bell_angebot

=== bell_angebot ===
// VARIANTE-FEHLT: Atomschach (L4). Bis es gebaut ist, nur die Regel und eine Vertröstung.
Bell zieht mit der Stiefelspitze ein Brett in den Sinter. Ein Läufer schlägt auf e5, und sie wischt mit dem Fuß die halbe Mitte weg. #sprecher:erzaehler
So sieht das aus. Das echte Brett liegt in der Station, beim nächsten Mal bring ich es mit. #sprecher:bell #stimmung:laechelt
-> END

=== bell_alltag ===
{~Der Geysir hält sich an die Uhr. Ich stelle meine danach.|Bleib auf den Stegen. Der Boden hier ist dünn wie ein Versprechen.|Die Bisons? Die gehören hierher. Wir sind nur zu Besuch.} #sprecher:bell #stimmung:laechelt
+ [„Erklär mir das Atomschach noch einmal.“]
    -> bell_regel ->
    -> END
+ [„Bis bald, Bell.“]
    -> END

// ---------------------------------------------------------------- Ray Castillo und das Entenschach

=== ray ===
{rayCastilloGetroffen: -> ray_alltag}
~ rayCastilloGetroffen = true
Am Rand der Weizenfelder steht ein verbeulter Wagen voller Antennen. Ein Mann sieht durch ein Fernglas zum Horizont. #sprecher:erzaehler
Ray Castillo. Sturmjäger. Da hinten braut sich was zusammen. #sprecher:rayCastillo #stimmung:laechelt
Castillo? So heißen auch Mira und Tomás in Desert Springs. Du fragst ihn danach. #sprecher:erzaehler
Du kennst meine Nichte und meinen Neffen? Dann bist du der Grund, warum Mira am Telefon nur noch von Opfern redet. #sprecher:rayCastillo #stimmung:lacht
Wenn der Sturm kommt, gehen wir in den Keller. Und im Keller spielen wir Entenschach. #sprecher:rayCastillo #stimmung:lacht
-> ray_regel_erstmals

// Die Regel allein (als Tunnel): Beim Nachfragen kommt nur sie, ohne Ambrose und Vorführung
// (Lesefassung 18.11.2026: Sonst lief bei jeder Nachfrage der ganze Auftakt noch einmal).
=== ray_regel ===
~ varianteEntenschachGelernt = true
Nach jedem Zug setzt du eine Ente auf ein leeres Feld. Die Ente gehört keinem. Keiner darf durch sie hindurch, keiner darf sie schlagen. #sprecher:rayCastillo #stimmung:laechelt
Wir nennen sie den Twister. Sie steht immer genau da, wo du hinwolltest. #sprecher:rayCastillo #stimmung:lacht
->->

=== ray_regel_erstmals ===
-> ray_regel ->
{not abschiedGesehen:
    Eine Figur, die nur im Weg steht. Ich kannte Menschen dieser Art. #sprecher:ambrose #stimmung:laechelt
}
-> ray_angebot

=== ray_angebot ===
// VARIANTE-FEHLT: Entenschach (L6). Bis es gebaut ist, nur die Regel und eine Vertröstung.
Der Sturm dreht ab. Heute kein Keller, heute keine Ente. Nächstes Mal. #sprecher:rayCastillo #stimmung:nachdenklich
-> END

=== ray_alltag ===
{~Siehst du die Wolke da? Die ist harmlos. Die daneben nicht.|Grüß Mira von mir. Und sag Tomás, er soll mein Auto reparieren.|Ein Sturm ist wie ein Angriff. Man sieht ihn kommen, wenn man hinschaut.} #sprecher:rayCastillo #stimmung:laechelt
+ [„Erklär mir das Entenschach noch einmal.“]
    -> ray_regel ->
    -> END
+ [„Bis bald, Ray.“]
    -> END

// ---------------------------------------------------------------- Rätseltafel

=== tafel ===
{wegSummitCrossroadsTafelBestanden:
    Auf der Tafel am Steg steht: „Gelöst. Erst zählen, dann schlagen.“ #sprecher:erzaehler
    -> END
}
Am Holzsteg hängt eine Tafel der Ranger: „Vorher zählen. Drei Stellungen, bevor der Geysir kommt.“ #sprecher:erzaehler
{not abschiedGesehen:
    Was hängt, was ist gedeckt, wer schlägt zuletzt? Zählen, {held}. Nicht raten. #sprecher:ambrose #stimmung:nachdenklich
}
+ [Die Aufgaben lösen]
    ~ beginneAufgaben("wegSummitCrossroads.tafel")
    -> END
+ [Weitergehen]
    -> END

// ---------------------------------------------------------------- Bisons und Fund

=== bisons ===
{bisonsGewartet:
    Die Bisons grasen jetzt neben dem Steg. Einer hebt den Kopf und kaut weiter. #sprecher:erzaehler
    -> END
}
Mitten auf dem Steg stehen drei Bisons. Sie sehen dich an. Sie gehen nicht weg. #sprecher:erzaehler
+ [Warten]
    ~ bisonsGewartet = true
    Du wartest. Niemand hupt. Juno malt einen Bison ins Tagebuch, mit Glitzer. #sprecher:erzaehler #geraeusch:praerie
    Nach vierzig Minuten trotten die Bisons zur Seite. #sprecher:erzaehler
    {not abschiedGesehen:
        Geduld. Die schwerste Figur auf jedem Brett. #sprecher:ambrose #stimmung:nachdenklich
    }
    -> END
+ [Vorsichtig vorbeigehen]
    Der größte Bison schnaubt. Du überlegst es dir anders. #sprecher:erzaehler
    -> END

=== fund_bisonhaar ===
{bisonhaarGefunden:
    Am Zaun hängt nur noch Dampf. #sprecher:erzaehler
    -> END
}
~ bisonhaarGefunden = true
Am Zaun hängt ein dickes Büschel braunes Fell. #sprecher:erzaehler
{not abschiedGesehen:
    Ein Tier, das niemandem ausweicht. Respekt. #sprecher:ambrose #stimmung:laechelt
}
~ gibFund("bisonhaar")
-> END

// ---------------------------------------------------------------- Sturmkeller und Wege

=== sturmkeller ===
{varianteEntenschachGelernt:
    Die Klappe zum Sturmkeller steht offen. Unten ein Tisch, ein Brett und eine Holzente. #sprecher:erzaehler
- else:
    Eine Kellerklappe mitten in der Prärie. Darauf mit Farbe: „Bei Sturm hier rein. Ray.“ #sprecher:erzaehler
}
-> END

=== zurueck_summit ===
Der Steg führt zurück, bergauf nach Summit City. #sprecher:erzaehler
-> END

// ---------------------------------------------------------------- Ereignis: Der Geysirblitz
// Runde 6 (Dokument 15, 2.10): Bell und die Schulklasse aus Summit City lösen Aufgaben, bis Old
// Patience ausbricht. Bis die Uhr als Geysir gebaut ist, eine Aufgabenrunde mit sechs Endspielen
// (Kapitel 9). Quest wegSummitCrossroads.geysirblitz; Lohn Fund rangerabzeichen.

=== ereignis_geysirblitz ===
{geysirblitzBelohnt: -> geysirblitz_danach}
{wegSummitCrossroadsGeysirblitzBestanden: -> geysirblitz_ende}
{geysirblitzGesehen: -> geysirblitz_angebot}
~ geysirblitzGesehen = true
Auf der Plattform am großen Geysir sitzt eine Schulklasse auf den Bänken, Bretter auf den Knien. Eine Rangerin steht mit der Uhr davor. #sprecher:erzaehler
{not bellVorgestellt:
    ~ bellVorgestellt = true
    Ich bin Bell, die Rangerin hier. Du kommst genau richtig. #sprecher:bell #stimmung:froh
}
Der Geysirblitz! Old Patience bricht alle neun Minuten aus. Bis dahin löst ihr so viele Aufgaben, wie ihr schafft. #sprecher:bell #stimmung:froh
-> geysirblitz_angebot

=== geysirblitz_angebot ===
Sechs Endspiele. Wer fertig ist, bevor das Wasser kommt, bekommt mein Abzeichen. Machst du mit? #sprecher:bell #stimmung:laechelt
{not abschiedGesehen:
    Im Endspiel zählt jedes Tempo, {held}, und hier zählt die Natur mit. #sprecher:ambrose #stimmung:nachdenklich
}
+ [„Ich bin dabei.“]
    ~ beginneAufgaben("wegSummitCrossroads.geysirblitz")
    -> END
+ [„Nicht jetzt.“]
    Old Patience wartet auf niemanden. Aber sie kommt wieder. #sprecher:bell #stimmung:laechelt
    -> END

=== geysirblitz_ende ===
~ geysirblitzBelohnt = true
Hinter dir zischt es, dann steigt eine weiße Säule in den Himmel. Die Klasse jubelt. #sprecher:erzaehler
Fertig vor dem Wasser. Das schaffen nicht viele. #sprecher:bell #stimmung:froh
Bell steckt dir ein Abzeichen aus Messing an die Jacke. #sprecher:erzaehler
~ gibFund("rangerabzeichen")
-> END

=== geysirblitz_danach ===
{~Die Klasse fragt, ob du nächstes Jahr wiederkommst.|Old Patience ist pünktlich. Pünktlicher als jeder Bus.|Am Infobrett hängt ein Antrag. Lies ihn, wenn du dich ärgern willst.} #sprecher:bell #stimmung:laechelt
-> END

=== geysir_ausbruch ===
{~Der Boden zittert, dann schießt Old Patience eine weiße Säule in den Himmel. Tropfen regnen auf die Stege.|Old Patience ist still. Nur ein dünner Faden Dampf steigt auf.|Das Becken um den Geysir brodelt. Gleich ist es so weit.} #sprecher:erzaehler
-> END

// ---------------------------------------------------------------- Sammelstellen im Geysirbecken

=== spur_pm5 ===
{spurPM5Gefunden:
    Am Infobrett hängt der Antrag noch. Jemand hat einen Bison daneben gemalt. #sprecher:erzaehler
    -> END
}
Am Infobrett des Rangerhäuschens hängt ein Antrag mit dem Logo von Perfect Move: „Kühlung für Rechenzentrum Summit. Entnahme von Geysirwasser.“ Quer darüber steht in roter Schrift: „Abgelehnt.“ #sprecher:erzaehler
{not bellVorgestellt:
    ~ bellVorgestellt = true
    Neben dir bleibt eine Rangerin mit breitem Hut stehen. Auf ihrem Namensschild steht „Bell“. #sprecher:erzaehler
}
Über meine Leiche. Und über die der Bisons. #sprecher:bell #stimmung:bitter
{not abschiedGesehen:
    Wer Rechner mit Geysiren kühlen will, braucht sehr viele Rechner. #sprecher:ambrose #stimmung:laechelt
}
~ spurPM5Gefunden = true
~ spurenPM = spurenPM + 1
~ gibFund("spurPM5")
-> END

=== finch_bauer_d ===
{finchBauerDGefunden:
    Unter dem Steg ist nur noch warmer Sinter. #sprecher:erzaehler
    -> END
}
Am Pfosten des Stegs ist ein Fink aus Kreide gemalt. Darunter, im Schatten der Bohlen, liegt ein weißer Bauer aus Buchsbaum. Unter seinem Fuß ist ein Feld eingebrannt. #sprecher:erzaehler
~ finchBauerDGefunden = true
~ finchFiguren = finchFiguren + 1
~ gibFund("finchBauerD")
-> END

// ---------------------------------------------------------------- Prärie: Sturmkeller und Windrad

=== seite09 ===
{seite09Gefunden:
    Hier lag die Seite. Der Wind hat nichts mehr dagelassen. #sprecher:erzaehler
    -> END
}
An der Klappe des Sturmkellers hat sich ein loses Blatt verfangen. Darauf eine gezeichnete Stellung. #sprecher:erzaehler
{not abschiedGesehen:
    Der Sturm trägt alles irgendwohin. Sogar Stellungen. #sprecher:ambrose #stimmung:nachdenklich
}
~ seite09Gefunden = true
~ buchseiten = buchseiten + 1
~ gibFund("seite09")
-> END

=== windrad ===
{~Das Windrad quietscht bei jeder Drehung, wie eine alte Tür.|Das Windrad steht still. Ray sagt, dann kommt der Sturm.|Unter dem Windrad liegt ein Eimer voll Wasser, frisch gepumpt.} #sprecher:erzaehler
-> END

// Rückmeldung nach der Runde (runden.json `danach`; Wunsch des Autors, 19.11.2026).
=== geysirblitz_rueckmeldung ===
{wegSummitCrossroadsGeysirblitzBestanden: -> ereignis_geysirblitz}
Das Wasser war schneller. Kein Abzeichen diesmal. #sprecher:bell #stimmung:laechelt
Der nächste Ausbruch kommt bestimmt. Dann versuchen wir es noch einmal. #sprecher:bell #stimmung:laechelt
-> END
