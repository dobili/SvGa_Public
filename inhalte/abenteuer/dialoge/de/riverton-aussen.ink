// Ort: Riverton außen (Akt 2): Bahnhof, Brücke, Park mit Pavillon und Bildschirmtischen,
// Handyladen, geschlossene Fahrradwerkstatt (Story-Bibel, Abschnitt 10.2; Weltbeschreibung 5.4).
//
// Szenen der Bibel: 28 Ankunft (akt2.ankunftRiverton, Quest riverton.parkclub), 29 Die
// Bildschirmtische (Nova, Victor, Ambrose `fern`), 33 Der verrostete Schlüssel (Quest
// riverton.schuppen, Mrs. Albescu), Fund „Läufer aus Holz“ unter der Brücke.
// Einstiege wie in orte.json: Figuren albescu, nova, victor; Gegenstände bildschirmtische,
// handyladen, fund_laeufer; Übergänge ankunft_zu_fuss (vom Bahndamm, vor dem Wechsel), bahndamm
// (zurück), kanalweg (wenn nadelRiverton), wohnwagen_zu (wenn clubkampfRivertonBesprochen),
// schuppen_zu (wenn schuppenOffen).
// Die Ankunft läuft auch beim ersten Gespräch draußen, falls der Übergang sie nicht gezeigt hat.
//
// Variablen: nadelRiverton setzt die Hülle (Zahl, R42). schuppenOffen setzt albescu_schluessel,
// clubkampfRivertonBesprochen setzt riverton-pavillon.ink. gefundenSchluessel setzt die Hülle,
// sobald der Schlüssel am Steg in Cedar Creek gefunden ist (cedar-creek-aussen.fund_schluessel).

EXTERNAL gibFund(kennung)

EXTERNAL reise(karte, ausloeser)
// Lastkahn (L3, 14_Akt2_Leben_teil1 4.3): lastkahnFrei setzt Lockport, wenn Ruben Big Joes Brief liest.
VAR lastkahnFrei = false
VAR held = "Du"
VAR ankunftRivertonGesehen = false
VAR novaGesehen = false
VAR victorRivertonGesehen = false
VAR bildschirmtischeGesehen = false
VAR albescuGetroffen = false
VAR gefundenSchluessel = false
VAR schuppenOffen = false
VAR holzlaeuferGefunden = false
VAR nadelRiverton = 0
VAR clubkampfRivertonBesprochen = false

// ---------------------------------------------------------------- Ankunft

=== ankunft_zu_fuss ===
{ankunftRivertonGesehen:
    Der Feldweg endet am Bahnhof von Riverton. #sprecher:erzaehler
    -> END
}
Der Feldweg neben den Gleisen endet an einem Bahnhof aus rotem Backstein. Es beginnt zu regnen. #sprecher:erzaehler
-> ankunft

=== ankunft ===
~ ankunftRivertonGesehen = true
Riverton. Überall Plakate: „Perfect Move Park – Schach für alle, ohne Wartezeit“. #sprecher:erzaehler
Ohne Wartezeit. Als wäre das Warten nicht das Schönste am Schach. #sprecher:ambrose #stimmung:streng
Juno zeigt auf ein Schild mit einem Pfeil: „Zum Park“. #sprecher:erzaehler
Da lang! Und schneller, sonst ist der Pavillon weg, bevor wir da sind. #sprecher:juno
-> END

// ---------------------------------------------------------------- Übergänge

=== bahndamm ===
Zurück auf den Feldweg am Bahndamm. Der Zug wäre schneller, aber der Weg ist schöner. #sprecher:erzaehler
-> END

=== kanalweg ===
{nadelRiverton > 0:
    Der Treidelpfad am Kanal führt nach Ironwood. Zu Fuß ist es weit, mit dem Rad geht es schneller. #sprecher:erzaehler
    Ironwood. Dort riecht die Luft nach Eisen, sagt man. Gehen wir. #sprecher:ambrose
- else:
    Ein Treidelpfad führt am Kanal entlang Richtung Ironwood. #sprecher:erzaehler
    Erst der Pavillon, {held}. Wer eine Stadt verlässt, bevor er dort gespielt hat, war nie richtig da. #sprecher:ambrose
}
-> END

=== wohnwagen_zu ===
{clubkampfRivertonBesprochen:
    Aus Slicks Wohnwagen ruft es: „Tür ist offen, Kopf einziehen!“ #sprecher:erzaehler
- else:
    Ein Wohnwagen am Fluss, ein Kurierrad lehnt daneben. Die Tür ist zu, drinnen ist niemand. #sprecher:erzaehler
}
-> END

=== schuppen_zu ===
{schuppenOffen:
    Die Schuppentür quietscht in den Angeln. Drinnen riecht es nach Staub und Öl. #sprecher:erzaehler
- else:
    Ein Holzschuppen hinter der geschlossenen Werkstatt. Ein rostiges Vorhängeschloss hält die Tür zu. #sprecher:erzaehler
}
-> END

// ---------------------------------------------------------------- Mrs. Albescu

=== albescu ===
{
- not ankunftRivertonGesehen: -> ankunft
- not albescuGetroffen: -> albescu_erstes_treffen
- gefundenSchluessel and not schuppenOffen: -> albescu_schluessel
- schuppenOffen: -> albescu_alltag
- else: -> albescu_wartet
}

=== albescu_erstes_treffen ===
~ albescuGetroffen = true
Vor der geschlossenen Fahrradwerkstatt fegt eine Frau Laub von der Treppe. Im Fenster hängt „Geschlossen“. #sprecher:erzaehler
Albescu. Das war meine Werkstatt, bis im Frühjahr keiner mehr Räder reparieren ließ. #sprecher:albescu
Hinten im Schuppen steht noch mein altes Rad. Aber der Schlüssel ist weg, seit zwei Jahren. #sprecher:albescu
Mein Mann hat ihn beim Angeln verloren. #sprecher:albescu
Beim Angeln. An einem Steg vielleicht? Halte die Augen offen, {held}. #sprecher:ambrose
-> END

=== albescu_wartet ===
{~Der Schlüssel ist groß und rostig, mit einem Ring aus Messing. Wenn du ihn siehst, du erkennst ihn.|Mein Mann angelte überall, am liebsten in Cedar Creek. Er sagte, dort beißen die Fische freundlicher.} #sprecher:albescu
-> END

=== albescu_schluessel ===
~ schuppenOffen = true
Du hältst ihr den rostigen Schlüssel mit dem Messingring hin. #sprecher:erzaehler
Den hat mein Mann beim Angeln verloren. Vor zwei Jahren! Wo hast du ihn her? #sprecher:albescu #stimmung:froh
Komm, wir schließen auf. Das Rad soll fahren, nicht stehen. #sprecher:albescu
-> END

=== albescu_alltag ===
{~Fährt es gut? Die Bremsen hab ich frisch eingestellt. Im Kopf.|Ich mache die Werkstatt vielleicht wieder auf. Für Räder, nicht für Bildschirme.} #sprecher:albescu
-> END

// ---------------------------------------------------------------- Nova und Victor

=== nova ===
{
- not ankunftRivertonGesehen: -> ankunft
- novaGesehen:
    Nova sitzt allein auf einer Bank unter dem Schirm. Die Kameras sind weg. #sprecher:erzaehler
    Sie sieht nicht auf. #sprecher:erzaehler
    -> END
}
~ novaGesehen = true
Unter einem großen Schirm steht ein Mädchen im glänzenden Trainingsanzug vor zwei Kameras. #sprecher:erzaehler
Mit Perfect Move trainiert jeder wie ein Champion! Ohne Wartezeit, ohne Fehler, ohne Grenzen! #sprecher:nova #stimmung:froh
Die Kameras gehen aus. Ihr Lächeln bleibt noch einen Moment stehen, dann fällt es herunter. #sprecher:erzaehler #pause
Kann ich jetzt kurz sitzen? #sprecher:nova
-> END

=== victor ===
{
- not ankunftRivertonGesehen: -> ankunft
- victorRivertonGesehen: -> victor_alltag
}
~ victorRivertonGesehen = true
Neben den Kameras steht Victor im Trainingsanzug des Konzerns. Er sagt Sätze, die nach seinem Vater klingen. #sprecher:erzaehler
{held}. Du bist weit gekommen. Für jemanden, der Italienisch spielt. #sprecher:victor #stimmung:kalt
Die Tische machen keine Fehler. Das ist der Punkt. #sprecher:victor
* [„Und das ist gut?“]
    Mein Vater sagt ja. #sprecher:victor
    Er sieht dabei auf die Pfützen, nicht auf dich. #sprecher:erzaehler
* [„Der Pavillon muss deshalb weg.“]
    Der Pavillon ist alt. Alt ist nicht dasselbe wie gut. #sprecher:victor
    Er sagt es, als hätte er es auswendig gelernt. #sprecher:erzaehler
- -> END

=== victor_alltag ===
Victor steht unter dem Banner und tippt auf ein Tablet. Einmal sieht er zum Pavillon hinüber, dann schnell wieder weg. #sprecher:erzaehler
-> END

// ---------------------------------------------------------------- Gegenstände

=== bildschirmtische ===
{
- not ankunftRivertonGesehen: -> ankunft
- bildschirmtischeGesehen:
    Auf allen Bildschirmen laufen Partien, Zug um Zug, ohne Pause. Niemand sitzt davor. #sprecher:erzaehler
    Ambrose sieht trotzdem hin. Lange. #sprecher:erzaehler
    -> END
}
~ bildschirmtischeGesehen = true
Auf der Wiese stehen zwanzig Tische mit Bildschirmen statt Brettern. #sprecher:erzaehler
Auf einem gewinnt die Maschine eine Partie in elf Sekunden. #sprecher:erzaehler
Eine Rechenmaschine, die nie zweifelt, ist kein Spieler. #sprecher:ambrose #stimmung:streng
Und doch. Dieser Zug eben. Den hätte ich nicht gesehen. #sprecher:ambrose #stimmung:fern
* [„Ambrose? Alles in Ordnung?“]
    Gewiss. Ich habe nur nachgedacht. Das darf man doch noch. #sprecher:ambrose
* [Weitergehen]
    Ambrose schweigt, bis du den Park verlässt. #sprecher:erzaehler
- -> END

=== handyladen ===
Ein Laden voller Tablets mit dem Logo von Perfect Move. Im Schaufenster: „Dein persönlicher Trainer, schon ab heute.“ #sprecher:erzaehler
Ein Trainer in einem Glaskasten. Hoffentlich bekommt er genug Luft. #sprecher:ambrose
-> END

=== fund_laeufer ===
{holzlaeuferGefunden:
    Unter der Brücke spielt der Straßenmusiker dasselbe Lied wie vorhin. #sprecher:erzaehler
    -> END
}
~ holzlaeuferGefunden = true
Unter der Brücke spielt ein Straßenmusiker Gitarre. Neben seinem Hut liegt ein Läufer aus hellem Holz. #sprecher:erzaehler
„Den hab ich hier gefunden“, sagt er. „Behalt ihn, ich spiele nur Gitarre.“ #sprecher:erzaehler
~ gibFund("holzlaeufer")
Noch ein Holzstück. Jemand hat einen ganzen Satz verloren. #sprecher:ambrose
-> END

// ---------------------------------------------------------------- Anleger am Kanalbecken (Runde 6)

=== anleger_schild ===
Am Anleger hängt ein Blechschild: „Lastkahn Ashford Belle: Riverton – Lockport – Ironwood. Fahrten nach Ansage.“ #sprecher:erzaehler
{lastkahnFrei:
    Die Belle liegt am Anleger, Kapitän Ruben winkt vom Deck. #sprecher:erzaehler
    * [Mit der Ashford Belle nach Lockport]
        ~ reise("lockport.aussen", "kai")
        -> END
    * [Hierbleiben]
        -> END
- else:
    Der Anleger ist leer. Niemand hat eine Ansage gemacht. #sprecher:erzaehler
}
-> END
