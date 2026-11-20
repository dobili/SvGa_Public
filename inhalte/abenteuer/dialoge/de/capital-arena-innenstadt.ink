// Capital, Viertel Innenstadt (Runde 7 gebaut, Runde 6 spielbar): der Kreidespringer neben dem
// Rollgitter des stillgelegten U-Bahnhofs, Treffpunkt K5 der Kreidespringer (Dokument 15, 1.4 und
// 2.14).
//
// Einstiege wie in orte.json: kreide5 (Fund und Losungsrätsel), ubahn (Übergang hinunter; der
// Übergang prüft ubahnOffen). Das Losungswort ist ein Zug: die Lösung des Rätsels neben der
// Kreidezeichnung (Runde capitalArena.kreideraetsel). kreideraetselBestanden setzt die Hülle (R42),
// die übrigen Variablen setzt diese Datei.

EXTERNAL beginneAufgaben(runde)
EXTERNAL gibFund(kennung)

VAR kreide5Gefunden = false
VAR kreideraetselBestanden = false
VAR ubahnOffen = false
VAR kreideTreffpunkte = 0
// Aus capital-arena-aussen.ink: Nach dem Abschied (Szene 109) spricht Ambrose nicht mehr
// (Story-Bibel Abschnitt 33, Frage 5; Entscheidung Q21-5). Hier nur gelesen.
VAR abschiedGesehen = false
// Kreidenacht erst nach dem Finale (Lektorat Akt 4, Frage 5); setzt die Hülle.
VAR ausgangCapitalArenaFinale = ""

=== kreide5 ===
{
- kreideraetselBestanden:
    Der Springer aus Kreide zeigt auf das Gitter. Das Losungswort kennst du jetzt. #sprecher:erzaehler
    -> END
- kreide5Gefunden:
    -> kreide_raetsel
}
Neben dem Rollgitter hat jemand einen Springer auf das Pflaster gemalt, mit Kreide, ganz frisch. Darunter eine kleine Stellung. #sprecher:erzaehler
~ kreide5Gefunden = true
~ kreideTreffpunkte = kreideTreffpunkte + 1
~ gibFund("kreide5")
{not abschiedGesehen:
    Der Springer springt über die Mauer, nicht durch die Tür. Die Kreidespringer wohnen hier unten. #sprecher:ambrose #stimmung:laechelt
}
-> kreide_raetsel

=== kreide_raetsel ===
Unter der Stellung steht: „Zwei Fliegen, eine Klappe. Der Zug ist das Wort.“ #sprecher:erzaehler
Ein Kreidepfeil zeigt auf das Gitter vor der Treppe zum alten U-Bahnhof. #sprecher:erzaehler
+ [Die Stellung lösen]
    ~ beginneAufgaben("capitalArena.kreideraetsel")
    -> END
+ [Weitergehen]
    -> END

=== ubahn ===
~ ubahnOffen = kreideraetselBestanden and ausgangCapitalArenaFinale != "" and ausgangCapitalArenaFinale != "abgebrochen"
{kreideraetselBestanden and not ubahnOffen:
    Du sagst den Zug durch das Gitter. Von unten lacht jemand: „Richtig.“ #sprecher:erzaehler
    „Aber die Kreidenacht ist nach der Meisterschaft. Dann bist du dabei.“ #sprecher:erzaehler
    -> END
}
{ubahnOffen:
    Du sagst den Zug durch das Gitter. Eine Hand zieht die Kette ab, und das Gitter rollt nach oben. #sprecher:erzaehler
    „Willkommen bei den Kreidespringern.“ #sprecher:erzaehler
- else:
    Das Rollgitter ist zu, mit Kette und Schloss. Von unten hört man Uhren klicken. #sprecher:erzaehler
    Ohne Losungswort kommst du nicht hinein. #sprecher:erzaehler
}
-> END
