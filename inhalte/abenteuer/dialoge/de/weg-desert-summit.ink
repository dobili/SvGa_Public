// Weg 7 von Desert Springs nach Summit City: Karten „Diner“ und „Bergstraße“ (Akt 4, Szene 81 der
// Story-Bibel, Abschnitt 29; Landschaft L8 Wüstenstraße, Weltbeschreibung 5.9).
//
// Stationen (W4): Fernfahrer Earl Dubois am Diner mit der Variante Königsrennen (Buchbezug
// Kapitel 8, der König muss im Endspiel laufen), Rätseltafel (Runde wegDesertSummit.tafel, Quest
// wegDesertSummit.tafelDiner), Fund Neonbuchstabe „K“, Abzweig zur Hochebene (L9).
// Einstiege wie in orte.json: earl, zurueck_desert, tafel, fund_neon, abzweig_hochebene. Die
// Ankunft in Summit City erzählt summit-city-aussen.ankunft_zu_fuss.
//
// Varianten: Königsrennen ist noch nicht gebaut (nur Blindschach). Earl erklärt die Regel und
// vertröstet; die Stelle ist mit „VARIANTE-FEHLT“ markiert und kommt in den Bericht.
// Variablen: wegDesertSummitTafelBestanden setzt die Hülle (R42); die übrigen setzt diese Datei.
// Der Fund „neonK“ kommt über gibFund; Ink merkt ihn sich selbst (neonGefunden), weil die Hülle
// beim Dialogende alle Ink-Variablen zurückschreibt.

EXTERNAL beginneAufgaben(runde)
EXTERNAL gibFund(kennung)

VAR held = "Du"
VAR wegDesertSummitTafelBestanden = false
VAR earlGetroffen = false
VAR varianteKoenigsrennenGelernt = false
VAR neonGefunden = false

// ---------------------------------------------------------------- Earl und das Königsrennen

=== earl ===
{earlGetroffen: -> earl_alltag}
~ earlGetroffen = true
Vor dem Diner stehen drei Lastwagen in der Hitze. Über der Tür summt ein Neonschild: „ING'S DINER“. #sprecher:erzaehler
Drinnen sitzt ein Mann mit grauem Bart vor einem Brett. Auf dem Brett stehen nur zwei Könige und ein paar Figuren. #sprecher:erzaehler
Earl. Ich fahr seit dreißig Jahren diese Straße. Und seit dreißig Jahren zahlt hier der, der das Rennen verliert. #sprecher:earl #stimmung:froh
-> earl_regel

=== earl_regel ===
~ varianteKoenigsrennenGelernt = true
Königsrennen. Keiner darf Schach geben, keiner darf im Schach stehen. #sprecher:earl
Wer mit seinem König zuerst die letzte Reihe erreicht, gewinnt. Wer verliert, zahlt den Kaffee. #sprecher:earl
Ein Rennen ohne Angriff. Wie seltsam. #sprecher:ambrose
Und doch: Auch hier gewinnt, wer den Weg kennt. Im Endspiel muss der König laufen, {held}. Das steht in Kapitel 8. #sprecher:ambrose
-> earl_angebot

=== earl_angebot ===
// VARIANTE-FEHLT: Königsrennen (L8). Bis es gebaut ist, nur die Regel und eine Vertröstung.
Heute sind alle Bretter belegt. Die Jungs spielen um die nächste Tankfüllung. #sprecher:earl
Komm wieder, wenn du hier durchfährst. Dann rennen wir. #sprecher:earl
-> END

=== earl_alltag ===
{~Der Kaffee hier ist schwarz wie ein Läufer auf c8.|Ich hab mal ein Rennen in elf Zügen gewonnen. Seitdem zahl ich nie.|Bis Summit City geht's nur noch bergauf. Für Lastwagen und für Schachspieler.} #sprecher:earl
+ [„Erklär mir das Königsrennen noch einmal.“]
    -> earl_regel
+ [„Bis bald, Earl.“]
    Gute Fahrt. Und lass den König nicht im Schach stehen. #sprecher:earl
    -> END

// ---------------------------------------------------------------- Rätseltafel

=== tafel ===
{wegDesertSummitTafelBestanden:
    Auf der Tafel neben der Kasse steht mit Kreide: „Gelöst. Kaffee geht aufs Haus.“ #sprecher:erzaehler
    -> END
}
Neben der Kasse hängt eine Tafel: „Drei Endspiele. Wer alle löst, kriegt den Kaffee umsonst.“ #sprecher:erzaehler
Im Endspiel zählt jedes Tempo. Und der König ist eine Figur wie jede andere. Eine starke. #sprecher:ambrose
+ [Die Aufgaben lösen]
    ~ beginneAufgaben("wegDesertSummit.tafel")
    -> END
+ [Weitergehen]
    -> END

// ---------------------------------------------------------------- Fund

=== fund_neon ===
{neonGefunden:
    Hinter dem Diner liegen leere Kisten und ein alter Reifen. #sprecher:erzaehler
    -> END
}
~ neonGefunden = true
Hinter dem Diner, zwischen leeren Kisten, liegt ein gebogenes Glasrohr in Form eines „K“. #sprecher:erzaehler
Das K von King's Diner. Ist seit neunundachtzig kaputt. Nimm's mit, wir haben uns dran gewöhnt. #sprecher:earl
~ gibFund("neonK")
-> END

// ---------------------------------------------------------------- Wege

=== zurueck_desert ===
Die Straße führt zurück nach Desert Springs, durch flimmernde Hitze. #sprecher:erzaehler
-> END

=== abzweig_hochebene ===
An einer Kurve zweigt eine Schotterstraße ab. Ein Schild: „Hochebene. Schule und Werkstatt, 3 Meilen.“ #sprecher:erzaehler
Rote Felstürme, und darüber kreisen Falken. #sprecher:erzaehler
-> END
