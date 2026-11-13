// Ort: Stadtpark von Maple Falls, Stadtrand mit Weg nach Cedar Creek (Akt 1).
// Figuren: Mr. Abernathy, Jo. Auslöser: parkbank (orte.json), bushaltestelle (neu, Bericht).
//
// Szenen der Story-Bibel (docs/spiel/05_Story_Bibel.md, Abschnitt 4): 7 Das vergessene Brett im
// Park (Rätsel-Quest mapleFalls.verlorenesBrett, Partiefragment 0), 10 Jo auf der Halfpipe
// (Straßengegnerin, Stellungsduell), 13 Aufbruch, zweiter Teil (Bus nach Cedar Creek).
// Einstiege: „bibliothekar“, „parkbank“, „skater_jo“, „bushaltestelle“.
// parkbankRaetselBestanden und ausgangMapleFallsSkaterJo setzt die Hülle
// (regeln/dialogvariablen.ts); „abgebrochen“ zählt wie nicht gespielt (Regelwerk R35).
// Die Bushaltestelle fährt mit reise() nach Cedar Creek und zurück kommt man über
// cedar-creek-aussen.bus_zurueck an diesem Auslöser an.

EXTERNAL beginneAufgaben(runde)
EXTERNAL beginnePartie(begegnung)
EXTERNAL reise(karte, ausloeser)
EXTERNAL oeffneLaden(laden)
EXTERNAL gibFund(kennung)

VAR held = "Du"
VAR abernathyGetroffen = false
VAR parkbankBrettGefunden = false
VAR parkbankRaetselBestanden = false
VAR abernathyBrief = false
VAR joGetroffen = false
VAR ausgangMapleFallsSkaterJo = ""
VAR aufbruchGesehen = false
VAR ankunftCedarCreekGesehen = false
VAR patelGetroffen = false
VAR hatLimo = false
VAR limoGefragt = false
VAR limoGebracht = false
VAR nadelMapleFalls = 0
VAR nadelCedarCreek = 0
VAR stegNeuGesehen = false
VAR initialenGefunden = false

// ---------------------------------------------------------------- Mr. Abernathy

=== bibliothekar ===
{
- not abernathyGetroffen: -> bibliothekar_sucht
- parkbankRaetselBestanden and not abernathyBrief: -> bibliothekar_brief
- abernathyBrief: -> bibliothekar_alltag
- else: -> bibliothekar_wartet
}

=== bibliothekar_sucht ===
// Szene 7 nach dem Roman, Kapitel 6, und der Dialogprüfung (VM37 bis VM42). Mr. Abernathy duzt
// {held} (Entscheidung mittel-1: ein Schulkind; das „Sie“ klang fremd). Park: Rollen auf Beton,
// Enten, der Wasserfall lauter als in der Stadt.
~ abernathyGetroffen = true
Von hier sieht man den Wasserfall zum ersten Mal richtig, ein weißes Band zwischen den Bäumen. #sprecher:erzaehler
Auf der Nachbarbank klopft ein sehr alter Mann seine Taschen ab. Neben ihm eine Thermoskanne. #sprecher:erzaehler
Ich hatte doch … nein, das ist meine Brille. Das Brett, das Brett! #sprecher:abernathy
Abernathy, sehr erfreut. Früher Bibliothekar, heute Sucher von Dingen. #sprecher:abernathy
Mein Reisebrett. Ich habe es auf einer Bank vergessen. Aber auf welcher? #sprecher:abernathy
* [„Ich suche es für Sie.“]
    Wie freundlich. Es steht eine Stellung darauf. Bitte nichts verschieben. #sprecher:abernathy
* [„Wie sieht es aus?“]
    Klein, grün, mit Magnetfiguren. Und mit einer Stellung, die ich nicht lösen kann. #sprecher:abernathy
- Ein Mann, der Stellungen aufhebt. Das gefällt mir. #sprecher:ambrose
-> END

=== bibliothekar_wartet ===
{parkbankBrettGefunden:
    Ah, du hast es gesehen? Und die Stellung? Weiß am Zug, so heißt es, gewinnt eine Figur. #sprecher:abernathy
- else:
    Eine Bank, ein grünes Brett. Weiter weiß ich leider auch nicht. #sprecher:abernathy
}
-> END

=== bibliothekar_brief ===
~ abernathyBrief = true
Mein Brett! Und du hast die Stellung gelöst? Wunderbar. #sprecher:abernathy #stimmung:froh
Er bedankt sich dreimal, jedes Mal für etwas anderes. #sprecher:erzaehler
Die Stellung stammt aus einem Brief. Er lag offen auf Margarets Küchentisch, als wir ausgeräumt haben. #sprecher:abernathy
Nichts als Schachzüge, Zeile um Zeile. Unterschrift: A. W. #sprecher:abernathy
So etwas wirft man doch nicht einfach weg. Ich habe es abgeschrieben. Behalt die Abschrift. #sprecher:abernathy
Auf dem Heimweg ist Ambrose lange still. #sprecher:erzaehler #pause
Er hat das abgeschrieben. Mit Bleistift. Auf einen Zettel. #sprecher:ambrose #stimmung:still #pause
* [„Kennst du die Stellung?“]
    Ob ich sie kenne. Es ist meine. Der Anfang. Vier Züge, und im vierten mein Gambit. #sprecher:ambrose #stimmung:still #pause
* [„Was für eine Partie?“]
    Eine alte. Frag mich ein andermal, Kind. #sprecher:ambrose #stimmung:still
- Ich bin gerührt. Und beleidigt. Es fehlt ein Bauer. #sprecher:ambrose
-> END

=== bibliothekar_alltag ===
{~Heute habe ich nur die Thermoskanne vergessen. Ein guter Tag.|Margaret spielte jeden Sonntag. Per Post. Ein Zug, eine Briefmarke.|Ein Bibliothekar hört nie auf zu sortieren. Jetzt sortiere ich Enten.} #sprecher:abernathy
-> END

// ---------------------------------------------------------------- Die Parkbank

=== parkbank ===
{
- not abernathyGetroffen:
    Auf der Bank liegt ein kleines grünes Brett. Es gehört sicher jemandem. #sprecher:erzaehler
    -> END
- not parkbankBrettGefunden: -> parkbank_fund
- not parkbankRaetselBestanden: -> parkbank_raetsel
- else:
    Die Bank ist leer. Mr. Abernathy hat sein Brett wieder. #sprecher:erzaehler
    -> END
}

=== parkbank_fund ===
~ parkbankBrettGefunden = true
Auf der Bank liegt ein kleines grünes Brett mit Magnetfiguren. Daneben ein Zettel. #sprecher:erzaehler
„Weiß am Zug gewinnt eine Figur.“ #sprecher:erzaehler
Zähl, Kind. Wer greift an, wer verteidigt? #sprecher:ambrose
-> parkbank_raetsel

=== parkbank_raetsel ===
* [Die Stellung lösen]
    ~ beginneAufgaben("mapleFalls.parkbankRaetsel")
    -> END
* [Nicht jetzt]
    -> END

// ---------------------------------------------------------------- Jo

=== skater_jo ===
{
- not joGetroffen: -> jo_erstes_treffen
- limoGefragt and hatLimo and not limoGebracht: -> jo_limo_gebracht
- ausgangMapleFallsSkaterJo == "" or ausgangMapleFallsSkaterJo == "abgebrochen": -> jo_angebot
- not limoGefragt: -> jo_limo
- ausgangMapleFallsSkaterJo == "niederlage": -> jo_nach_niederlage
- else: -> jo_nach_sieg
}

=== jo_erstes_treffen ===
// Szene 10 nach dem Roman, Kapitel 7, und der Dialogprüfung (VM52 bis VM56).
~ joGetroffen = true
Auf der Kante der Halfpipe liegt ein Brett, so zerkratzt, dass man die dunklen Felder nur noch erraten kann. Die Figuren stehen schon, mitten in einer Stellung. #sprecher:erzaehler
Jo. Ich spiele um Limo. #sprecher:skaterJo
-> jo_angebot

=== jo_angebot ===
Fünf Minuten. Eine Partie. Ich spiel nicht von vorn, dauert zu lang. #sprecher:skaterJo
Du stehst besser. Wer verliert, holt Limo. #sprecher:skaterJo
* [„Abgemacht.“]
    -> jo_duell
* [„Ein andermal.“]
    Ich bin hier. Immer. #sprecher:skaterJo
    -> END

=== jo_duell ===
// Stellungsduell aus Abbildung 1.21 (Regelwerk C1, R13), Begegnung in begegnungen.json.
~ beginnePartie("mapleFalls.skaterJo")
Jo dreht das Brett zu dir. Ihre Hände sind schneller als ihre Augen. #sprecher:erzaehler
-> END

=== jo_nach_sieg ===
Okay, okay. Limo geht auf mich. Noch eine? #sprecher:skaterJo
+ [„Noch eine.“]
    -> jo_duell
+ [„Gleich.“]
    -> END

=== jo_nach_niederlage ===
{limoGebracht:
    Gewonnen! Die Limo war gut, aber die Revanche ist besser. #sprecher:skaterJo
- else:
    Limo, bitte. Mit Eis. #sprecher:skaterJo
}
Du hast vergessen zu fragen, was hängt. #sprecher:ambrose
+ [„Revanche.“]
    -> jo_duell
+ [„Gleich.“]
    -> END

// ---------------------------------------------------------------- Limo für Jo (Bibel, Szene 10a)
// Quest mapleFalls.limo: beginnt mit jo_limo (nach dem ersten Duell, gleich wie es ausging),
// erledigt mit jo_limo_gebracht (nur mit hatLimo; die Hülle leitet den Besitz ab, die Quest nimmt
// die Limo wieder weg). Die Limo kauft man im Kiosk von Mr. Patel (laeden.json, 5 Münzen).

=== jo_limo ===
~ limoGefragt = true
{ausgangMapleFallsSkaterJo == "niederlage":
    Wer verliert, holt Limo. So ist das hier. #sprecher:skaterJo
- else:
    Limo geht eigentlich auf mich. Aber ich bin pleite. Holst du eine? Dann erzähl ich dir was. #sprecher:skaterJo
}
Zitrone. Mr. Patel weiß Bescheid, der Kiosk ist gleich da drüben. #sprecher:skaterJo
+ [„Ich hol eine.“]
    Ich warte. #sprecher:skaterJo
    -> END
+ [„Erst noch eine Partie.“]
    -> jo_duell

=== jo_limo_gebracht ===
~ limoGebracht = true
Du reichst Jo die kalte Zitronenlimo. Sie trinkt die halbe Flasche in einem Zug, setzt sich auf die Kante und lässt die Beine baumeln. #sprecher:erzaehler
{ausgangMapleFallsSkaterJo == "niederlage":
    Ich greif immer an. Rückwärts zieh ich nicht gern. Ist so. #sprecher:skaterJo #pause
    Auf dem Board auch nicht. #sprecher:skaterJo
- else:
    Danke. Du hast mich ja schon geschlagen, also verrat ich nicht mehr viel. #sprecher:skaterJo
    Nur so viel: Rückwärts zieh ich nicht gern. Revanche, wenn ich satt bin. #sprecher:skaterJo
}
Eine Limonade für eine Schwäche. Ein guter Handel. #sprecher:ambrose #stimmung:lacht
Sie lacht, kurz und rau, und wirft dir die leere Flasche zu. #sprecher:erzaehler
-> END

// ---------------------------------------------------------------- Bushaltestelle

=== bushaltestelle ===
// Beim ersten Mal geht es nur zu Fuß mit Juno (Roman, Kapitel 10; Entscheidung des Hauptchats
// 13.11.2026). Der Bus nach Cedar Creek ist erst nach der ersten Ankunft dort frei.
{
- not aufbruchGesehen:
    Hier hält der Bus nach Cedar Creek. Heute fährt er ohne dich. #sprecher:erzaehler
    -> END
- not ankunftCedarCreekGesehen:
    Am Fahrplan ein Zettel: „Mr. Kettering fährt nach Cedar Creek nur samstags.“ #sprecher:erzaehler
    Juno wartet an der Landstraße. Zu Fuß, am Fluss entlang. #sprecher:erzaehler
    -> END
- else:
    Der Linienbus nach Cedar Creek fährt jede Stunde. Der Fahrer nickt dir zu. #sprecher:erzaehler #klang:bus
}
* [Einsteigen]
    Der Bus fährt los, die Landstraße entlang nach Cedar Creek. #sprecher:erzaehler
    ~ reise("cedarCreek.aussen", "bushaltestelle")
    -> END
* [Nicht jetzt]
    -> END

// ---------------------------------------------------------------- Kiosk (G2) und Ortsausgang (W5)
// Laden mapleFalls.kiosk mit Mr. Patel; oeffneLaden kommt mit Schritt 12 (laeden.json).
// Der Ortsausgang „landstrasse“ führt auf die Route nach Cedar Creek (weg-maple-cedar.ink).

=== kiosk ===
{patelGetroffen:
    {~Na, {held}? Frische Karten sind da. Und Limo, falls Jo wieder gewonnen hat.|Willkommen zurück. Für Münzen gibt es hier fast alles. Nur keine Siege.} #sprecher:patel
- else:
    ~ patelGetroffen = true
    Ein kleiner Kiosk mit bunter Markise. Hinter der Theke sortiert ein Mann Zeitschriften. #sprecher:erzaehler
    Willkommen bei Patel! Zeitungen, Limo und Schachkarten für unterwegs. #sprecher:patel #stimmung:froh
    Münzen gibt es hier fürs Gewinnen. Bei mir wirst du sie wieder los. #sprecher:patel
}
{limoGefragt and not limoGebracht and not hatLimo:
    Für Jo? Die mit dem zerkratzten Brett? Die trinkt nur Zitrone. #sprecher:patel
    Er zählt das Wechselgeld zweimal. Du bist nicht der Erste. Aber die meisten kommen nicht wieder. #sprecher:patel
}
~ oeffneLaden("mapleFalls.kiosk")
-> END

=== landstrasse ===
{
- not aufbruchGesehen:
    Hier beginnt die Landstraße nach Cedar Creek. Für heute bleibst du lieber in der Stadt. #sprecher:erzaehler
- ankunftCedarCreekGesehen:
    Die Landstraße nach Cedar Creek. Du kennst den Weg schon. #sprecher:erzaehler
- else:
    Juno wartet am Ortsschild. Zwei Stunden, am Fluss entlang. #sprecher:erzaehler
}
-> END

// ---------------------------------------------------------------- Runde 6: Steg S5

// Morscher Steg zum Wasserfall (13_Wegenetz.md, S5). Nach der ersten Clubnadel hat Mr. Pratt ihn
// selbst erneuert; dann Aussicht auf den Wasserfall und die Initialen im Geländer (Album).
=== steg ===
{nadelMapleFalls < 1:
    Rot-weißes Absperrband vor dem Steg. Ein Schild der Stadt: „Steg morsch, wird erneuert.“ #sprecher:erzaehler
    Darunter hat jemand mit Kuli geschrieben: „Die Stadt hat kein Geld.“ #sprecher:erzaehler
    -> END
}
{stegNeuGesehen:
    -> steg_aussicht
}
~ stegNeuGesehen = true
Das Absperrband ist weg. Die Bretter sind neu und riechen nach Harz. #sprecher:erzaehler
Am Pfosten ein Zettel: „Für Pokale baue ich alles. Pratt.“ #sprecher:erzaehler
-> steg_aussicht

=== steg_aussicht ===
Vom Ende des Stegs sieht man den kleinen Wasserfall hinter den Ahornbäumen. #sprecher:erzaehler
{initialenGefunden:
    -> END
}
~ initialenGefunden = true
Ins Geländer hat jemand Buchstaben geritzt: „M. W. + E. C. 1952“. #sprecher:erzaehler
~ gibFund("initialen1952")
-> END

// ---------------------------------------------------------------- Runde 6: Stamm auf dem Zedernpfad (S2)

// Vor dem Übergang „zedernpfad“ (wenn: nadelCedarCreek).
=== stamm_s2 ===
{nadelCedarCreek >= 1:
    -> END
- else:
    Hinter der Brücke liegt eine umgestürzte Zeder quer über dem Pfad. Von hier kommst du nicht weiter. #sprecher:erzaehler
    Den Stamm muss jemand mit Seil und Flaschenzug wegziehen. Vielleicht braucht in Cedar Creek jemand Holz. #sprecher:erzaehler
    -> END
}
