// Nebenort N1 Kürbishof (Akt 1, Spätsommer vor dem Herbstfest): Walt Miller, Clover, Oma Miller.
// Nebenquest kuerbishof.irrgarten (klein, Aufgabenrunde statt begehbarem Irrgarten), Kürbiswaage als
// Dialogwahl, Vogelscheuche „Morphy“. Das Tor S1 auf der Landstraße gehört zu Weg 1 (niedrig-1).

// >>> Runde 6 (mittel-4)
EXTERNAL beginneAufgaben(runde)
EXTERNAL gibFund(kennung)
VAR waltGetroffen = false
VAR cloverGetroffen = false
VAR omaGetroffen = false
VAR irrgartenBestanden = false
VAR waageGeraten = false
VAR held = "Du"

=== walt ===
{waltGetroffen:
    Das Herbstfest ist in zwei Wochen. Bis dahin muss jeder Kürbis rund sein. #sprecher:walt #stimmung:nachdenklich
    -> END
}
~ waltGetroffen = true
Ein Mann mit Strohhut wischt sich die Hände an der Latzhose ab. #sprecher:erzaehler
Walt Miller. Das Tor ist meistens zu, wegen der Kühe. Wer es aufbekommt, ist hier willkommen. #sprecher:walt #stimmung:laechelt
-> END

=== clover ===
{irrgartenBestanden:
    Du bist rausgekommen! Nächstes Jahr schneide ich ihn schwerer. #sprecher:clover #stimmung:ueberrascht
    -> END
}
{cloverGetroffen: -> clover_irrgarten}
~ cloverGetroffen = true
Ich bin Clover. Den Irrgarten im Mais hab ich selbst geschnitten, wie jedes Jahr. #sprecher:clover #stimmung:laechelt
-> clover_irrgarten

=== clover_irrgarten ===
{irrgartenBestanden: -> END}
An jeder Kreuzung hängt eine Stellung. Wer das Matt findet, weiß den Weg. Traust du dich? #sprecher:clover #stimmung:laechelt
+ [Ja, rein in den Mais.]
    ~ beginneAufgaben("kuerbishof.irrgarten")
    -> END
+ [Später.]
    Der Mais läuft nicht weg. #sprecher:clover #stimmung:laechelt
    -> END

=== oma_miller ===
{omaGetroffen:
    Früher kamen zum Herbstfest die Leute mit Pferdewagen. Heute mit dem Auto. Der Kuchen ist derselbe. #sprecher:omaMiller #stimmung:laechelt
    -> END
}
~ omaGetroffen = true
Kuchen, Kürbisse, Apfelsaft. Und wer stehen bleibt, bekommt eine Geschichte gratis. #sprecher:omaMiller #stimmung:laechelt
-> END

=== irrgarten ===
Ein Schild am Maisfeld: „Clovers Irrgarten – Eingang. Ausgang auf eigene Gefahr.“ #sprecher:erzaehler
-> END

=== vogelscheuche ===
Die Vogelscheuche trägt ein Schild um den Hals: „Morphy“. Die Krähen sitzen trotzdem auf ihrem Hut. #sprecher:erzaehler
-> END

=== kuerbiswaage ===
{waageGeraten:
    Die Waage am Hofladen ist frei. Die blaue Schleife hängt jetzt bei dir. #sprecher:erzaehler
    -> END
}
Drei Kürbisse liegen neben der Waage. Welcher ist am schwersten? Wer richtig rät, bekommt eine Schleife. #sprecher:omaMiller #stimmung:laechelt
+ [Der große, helle.]
    Groß ist nicht schwer. Der ist innen fast hohl. Versuch es nächstes Mal wieder. #sprecher:omaMiller #stimmung:laechelt
    -> END
+ [Der kleine, dunkle.]
    ~ waageGeraten = true
    Richtig! Klein, aber dicht. Wie ein Bauer kurz vor der Umwandlung. #sprecher:omaMiller #stimmung:laechelt
    ~ gibFund("kuerbisschleife")
    -> END
+ [Der längliche.]
    Der sieht nur schwer aus. Versuch es nächstes Mal wieder. #sprecher:omaMiller #stimmung:laechelt
    -> END
// <<< Runde 6 (mittel-4)
