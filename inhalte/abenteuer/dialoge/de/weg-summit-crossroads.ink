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
VAR wegSummitCrossroadsTafelBestanden = false
VAR bellGetroffen = false
VAR rayGetroffen = false
VAR varianteAtomschachGelernt = false
VAR varianteEntenschachGelernt = false
VAR bisonhaarGefunden = false
VAR bisonsGewartet = false

// ---------------------------------------------------------------- Rangerin Bell und das Atomschach

=== bell ===
{bellGetroffen: -> bell_alltag}
~ bellGetroffen = true
Zwischen den dampfenden Becken steht eine Rangerin mit breitem Hut und sieht auf die Uhr. #sprecher:erzaehler
Bell. Rangerin. In sechs Minuten bricht der große Geysir aus. Bis dahin: Willst du was Verrücktes sehen? #sprecher:bell #stimmung:froh
-> bell_regel

=== bell_regel ===
~ varianteAtomschachGelernt = true
Atomschach. Wer schlägt, löst eine Explosion aus. Alle Figuren rund um das Feld fliegen vom Brett, die eigenen auch. Nur Bauern bleiben stehen. #sprecher:bell
Also zählst du vorher. Wer greift an, wer verteidigt, was fliegt mit in die Luft. #sprecher:bell
Wer schlägt, ohne zu zählen, fliegt in die Luft. Eine Lektion, die ich gern früher gehabt hätte. #sprecher:ambrose #stimmung:lacht
Kapitel 1, {held}: Angreifer und Verteidiger zählen. Hier zählt man nur ein paar Felder weiter. #sprecher:ambrose
-> bell_angebot

=== bell_angebot ===
// VARIANTE-FEHLT: Atomschach (L4). Bis es gebaut ist, nur die Regel und eine Vertröstung.
Ich hab nur ein Brett, und das liegt noch in der Station. Wenn du wiederkommst, bring ich es mit. #sprecher:bell
-> END

=== bell_alltag ===
{~Der Geysir hält sich an die Uhr. Pünktlicher als jeder Bus.|Bleib auf den Stegen. Der Boden hier ist dünn wie ein Versprechen.|Die Bisons? Die gehören hierher. Wir sind nur zu Besuch.} #sprecher:bell
+ [„Erklär mir das Atomschach noch einmal.“]
    -> bell_regel
+ [„Bis bald, Bell.“]
    -> END

// ---------------------------------------------------------------- Ray Castillo und das Entenschach

=== ray ===
{rayGetroffen: -> ray_alltag}
~ rayGetroffen = true
Am Rand der Weizenfelder steht ein verbeulter Wagen voller Antennen. Ein Mann sieht durch ein Fernglas zum Horizont. #sprecher:erzaehler
Ray Castillo. Sturmjäger. Da hinten braut sich was zusammen. #sprecher:rayCastillo
Castillo? Wie Mira und Tomás in Desert Springs? #sprecher:ambrose
Du kennst meine Nichte und meinen Neffen? Dann bist du der Grund, warum Mira am Telefon nur noch von Opfern redet. #sprecher:rayCastillo #stimmung:lacht
Wenn der Sturm kommt, gehen wir in den Keller. Und im Keller spielen wir Entenschach. #sprecher:rayCastillo
-> ray_regel

=== ray_regel ===
~ varianteEntenschachGelernt = true
Nach jedem Zug setzt du eine Ente auf ein leeres Feld. Die Ente gehört keinem. Keiner darf durch sie hindurch, keiner darf sie schlagen. #sprecher:rayCastillo
Wir nennen sie den Twister. Sie steht immer genau da, wo du hinwolltest. #sprecher:rayCastillo
Eine Figur, die nur im Weg steht. Ich kannte Menschen dieser Art. #sprecher:ambrose
-> ray_angebot

=== ray_angebot ===
// VARIANTE-FEHLT: Entenschach (L6). Bis es gebaut ist, nur die Regel und eine Vertröstung.
Der Sturm dreht ab. Heute kein Keller, heute keine Ente. Nächstes Mal. #sprecher:rayCastillo
-> END

=== ray_alltag ===
{~Siehst du die Wolke da? Die ist harmlos. Die daneben nicht.|Grüß Mira von mir. Und sag Tomás, er soll mein Auto reparieren.|Ein Sturm ist wie ein Angriff. Man sieht ihn kommen, wenn man hinschaut.} #sprecher:rayCastillo
+ [„Erklär mir das Entenschach noch einmal.“]
    -> ray_regel
+ [„Bis bald, Ray.“]
    -> END

// ---------------------------------------------------------------- Rätseltafel

=== tafel ===
{wegSummitCrossroadsTafelBestanden:
    Auf der Tafel am Steg steht: „Gelöst. Erst zählen, dann schlagen.“ #sprecher:erzaehler
    -> END
}
Am Holzsteg hängt eine Tafel der Ranger: „Vorher zählen. Drei Stellungen, bevor der Geysir kommt.“ #sprecher:erzaehler
Was hängt, was ist gedeckt, wer schlägt zuletzt? Zählen, {held}. Nicht raten. #sprecher:ambrose
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
    Du wartest. Der große Geysir bricht aus, Dampf steigt in den Himmel. Als er sich legt, trotten die Bisons zur Seite. #sprecher:erzaehler
    Geduld. Die schwerste Figur auf jedem Brett. #sprecher:ambrose
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
Ein Tier, das niemandem ausweicht. Respekt. #sprecher:ambrose
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
