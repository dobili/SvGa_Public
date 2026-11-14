// Ort: Silicon Bay, Campus mit Glasgebäuden, Food-Truck und Bank (Akt 3). Figuren: Dash, Rosie.
//
// Szenen der Story-Bibel (Abschnitt 20): 53 Glas und Licht (Ankunft, akt3.ankunftSiliconBay),
// 54 Dash am Food-Truck (Begegnung siliconBay.dash, Sprüche S1 bis S4, beim ersten Sieg die Karte
// gruebelfalle), 61 Die Nacht mit dem Tablet (Auslöser hotel, akt3.ambroseGebannt), dazu Bus
// zurück nach Ironwood und die Fähre nach Port Delacroix (nach der Clubnadel).
// Einstiege wie in orte.json: ankunft_zu_fuss, dash, rosie, glasbruecke, hotel, bus_ironwood,
// faehre. Rosie öffnet nach dem Gespräch ihren Laden (siliconBay.foodtruck).
//
// Runde 11 (13.11.2026): Ankunft, Dash und Rosie nach dem Roman (roman/akt3_teil1.md, Kapitel 31):
// Victor holt euch ab („Ich war nicht sicher, ob das dasselbe ist“), Dashs „Hm“, Rosie gibt die
// Karte aus der Kasse, Victor fragt, warum Dash wiederkommt. Klang nach 21_Klangplan.md (Akt 3):
// Lieferroboter, an Rosies Wagen die Musik `rosie` (bis eine Klangquelle mit Reichweite kommt).
// Kapitel 34: die Nacht mit dem Tablet. Ambrose sitzt, das Tablet ging an, weil er es sich
// wünschte; „Und ich?“ bleibt ohne Antwort. Musik `zero` läuft durch, keine Stille (Klangplan,
// Teil C); am Morgen Juno an der Glasbrücke, Schluss `ambrose.fern`.
//
// Variablen: ausgangSiliconBayDash, ausgangSiliconBayClubkampf und nadelSiliconBay setzt die
// Hülle (R42). Victor holt {held} und Juno bei der Ankunft ab.

EXTERNAL beginnePartie(begegnung)
EXTERNAL gibKarte(kennung)
EXTERNAL reise(karte, ausloeser)
EXTERNAL oeffneLaden(laden)
EXTERNAL setzeToenung(name)

VAR held = "Du"
VAR ausgangSiliconBayDash = ""
VAR nadelSiliconBay = 0
VAR ankunftSiliconBayGesehen = false
VAR dashGetroffen = false
VAR dashKarteGegeben = false
VAR rosieGetroffen = false
VAR tabletNachtGesehen = false
VAR batterieErhalten = false

// ---------------------------------------------------------------- Ankunft

=== ankunft_zu_fuss ===
{ankunftSiliconBayGesehen:
    Die Glasbrücke endet am Campus von Silicon Bay. Kein Baum, kein Vogel, nur Glas. #sprecher:erzaehler
    -> END
}
~ ankunftSiliconBayGesehen = true
In Silicon Bay ist es nicht kalt. Es liegt kein Schnee. #sprecher:erzaehler
Die Häuser sind aus Glas. In ihnen spiegeln sich die anderen Häuser, man sieht nicht, wo eines aufhört. #sprecher:erzaehler
Es ist still. Still wie ein Raum, in dem ein Gerät läuft, das man erst bemerkt, wenn es ausgeht. #sprecher:erzaehler
Auf den Bänken sitzt jeder für sich, auf vielen Bildschirmen kleine Schachbretter. Niemand spielt gegen jemanden. #sprecher:erzaehler
* [Weitergehen]
- Etwas Weißes, Kniehohes summt auf dich zu und fährt vorbei, ohne langsamer zu werden. #sprecher:erzaehler #klang:lieferroboter
Ein Lieferroboter. Der bringt Essen. #sprecher:juno #stimmung:ueberrascht
* [„Wem?“]
- Jemandem, der nicht rausgehen will. #sprecher:juno #stimmung:nachdenklich
Ambrose dreht sich einmal um sich selbst. In zwanzig Scheiben Glas ist er nicht zu sehen. #sprecher:erzaehler
Kein Baum. Keine Taube. Nicht einmal eine Ratte. #sprecher:ambrose #stimmung:ueberrascht
Ich habe in Hafenstädten gelebt. Ich weiß, wie eine Stadt ohne Ratten aussieht: gar nicht. Wo wohnen hier die Tiere? #sprecher:ambrose #stimmung:laechelt
Die stören die Sensoren. #sprecher:victor #stimmung:bitter
* [Dich umdrehen]
- Victor steht hinter euch, ganz in Weiß. Er sieht aus, als hätte er nicht geschlafen. #sprecher:erzaehler
Ihr seid gekommen. #sprecher:victor #stimmung:ueberrascht
* [„Du hast eingeladen.“]
- Ja. #sprecher:victor #stimmung:nachdenklich
Er sieht auf seine Schuhe. #sprecher:erzaehler #pause:2
Ich war nicht sicher, ob das dasselbe ist. #sprecher:victor #stimmung:nachdenklich
-> ankunft_rundgang

// Victor zählt auf, weil Zahlen das Einzige sind, worüber er ohne Mühe redet (Kapitel 31).
=== ankunft_rundgang ===
Er führt euch über den Campus. Vierzig Stockwerke, die Akademie im zweiten, die Serverhalle unter der Erde. #sprecher:erzaehler
Gekühlt mit Meerwasser. #sprecher:victor
Er gibt nicht an. Zahlen sind das Einzige, worüber er ohne Mühe reden kann. #sprecher:erzaehler
Wohnst du hier? #sprecher:juno
Im achtunddreißigsten. #sprecher:victor
Kann man da die Fenster aufmachen? #sprecher:juno #stimmung:nachdenklich
* [Auf Victors Antwort warten]
- Victor überlegt. Ernsthaft. #sprecher:erzaehler
Ich habe es nie versucht. #sprecher:victor #stimmung:nachdenklich
-> END

=== glasbruecke ===
Die Glasbrücke führt zurück zur Raststätte an der Schnellstraße. #sprecher:erzaehler
-> END

// ---------------------------------------------------------------- Dash

=== dash ===
{
- not dashGetroffen: -> dash_erstes_treffen
- ausgangSiliconBayDash == "" or ausgangSiliconBayDash == "abgebrochen": -> dash_angebot
- ausgangSiliconBayDash == "niederlage": -> dash_nach_niederlage
- else: -> dash_nach_sieg
}

=== dash_erstes_treffen ===
~ dashGetroffen = true
Auf der Holzbank vor Rosies Wagen sitzt ein junger Mann neben einem Lieferrad, einen Burrito in der Hand. #sprecher:erzaehler #musik:rosie
Tick, tack. Dein König hat Angst. Guck, wie der zittert. Denkst du noch oder verlierst du schon? #sprecher:dash #stimmung:lacht
Der Mann im Anzug gegenüber stellt einen Turm ein, steht auf und geht. #sprecher:erzaehler
Nächster! Du da, mit den Blechdingern an der Jacke. Drei Minuten, um einen Burrito. #sprecher:dash #stimmung:lacht
Ich bin Dash. Ich rede dabei. Stört dich das? Mich nicht. #sprecher:dash #stimmung:lacht
* [„Mich auch nicht.“]
- Im Park redet man. Und das hier ist ein Park. Wenn auch einer aus Glas, mit einer einzigen Bank. #sprecher:ambrose #stimmung:froh
-> dash_angebot

=== dash_angebot ===
Tick, tack. Spielen wir? #sprecher:dash #stimmung:laechelt #musik:rosie
+ [„Los, drei Minuten.“]
    ~ beginnePartie("siliconBay.dash")
    -> END
* [„Nach dem Essen.“]
    Denkst du noch oder verlierst du schon? Ich bin hier. #sprecher:dash #stimmung:laechelt
    -> END

=== dash_nach_niederlage ===
Burrito für mich! Denkst du noch oder verlierst du schon? #sprecher:dash #stimmung:lacht #musik:rosie
Es ist, als spielte man neben einem Radio. Du hast zugehört. #sprecher:erzaehler
Er redet, damit du nicht denkst. Mach das Gegenteil. #sprecher:ambrose #stimmung:nachdenklich
+ [„Revanche.“]
    ~ beginnePartie("siliconBay.dash")
    -> END
* [„Nicht jetzt.“]
    -> END

=== dash_nach_sieg ===
{not dashKarteGegeben: -> dash_hm}
{~Du schon wieder. Mein Burrito wird kalt.|Okay, du bist gut. Aber ich bin lauter.|Morgen gewinn ich. Wahrscheinlich.} #sprecher:dash #stimmung:laechelt #musik:rosie
+ [„Noch eine?“]
    ~ beginnePartie("siliconBay.dash")
    -> END
+ [„Guten Appetit.“]
    -> END

// Kapitel 31: Der Held hat Dash mit einem „Hm“ grübeln lassen. Ambrose findet das nicht fein,
// Rosie gibt die Karte aus ihrer Kasse (Grübelfalle), Victor fragt, warum Dash wiederkommt.
=== dash_hm ===
~ dashKarteGegeben = true
Mitten in der Partie hast du gezogen und dann lange aufs Brett gesehen, als hättest du etwas Furchtbares entdeckt. #sprecher:erzaehler #musik:rosie
* [„Hm.“]
- Was, hm? Was hast du gesehen? Da ist doch nichts. Oder? #sprecher:dash #stimmung:ueberrascht
Seine Uhr lief. Er hat vierzig Sekunden lang etwas gesucht, das es nicht gab. Nach der Partie lacht er, laut und ohne Groll. #sprecher:erzaehler
Das war nicht fein. #sprecher:ambrose #stimmung:nachdenklich
* [„Du hast gesagt, im Park redet man.“]
- Ich habe nicht gesagt, dass es fein ist. #sprecher:ambrose #stimmung:laechelt
Dash kauft dir den Burrito selbst. Rosie reicht eine Karte durch die Klappe, ein Gesicht mit gerunzelter Stirn. #sprecher:erzaehler
Die lag in der Kasse, seit ich den Wagen gekauft hab. Von einem alten Mann in Riverton. #sprecher:rosie #stimmung:laechelt
Er hat gesagt, die gehört dem, der Dash zum Schweigen bringt. #sprecher:rosie #stimmung:lacht
* [Die Karte nehmen]
- ~ gibKarte("gruebelfalle")
-> dash_victor

=== dash_victor ===
Victor hat die ganze Zeit dabeigestanden. Er hat nichts gegessen. #sprecher:erzaehler
Er verliert jeden Tag. Seine Genauigkeit liegt bei sechzig Prozent. Warum kommt er wieder? #sprecher:victor #stimmung:nachdenklich
Es ist keine Verachtung in der Frage. Er will es wissen. #sprecher:erzaehler
* [„Frag ihn.“]
- Victor sieht zurück zur Bank. Dash hat schon den Nächsten. #sprecher:erzaehler
Das kann man nicht messen. #sprecher:victor #stimmung:nachdenklich
-> END

// ---------------------------------------------------------------- Rosie

=== rosie ===
{rosieGetroffen:
    {~Burrito? Nein? Dann eben nicht.|Hier leuchtet nur meine Kochplatte.|Pass auf dich auf in der Akademie.} #sprecher:rosie #stimmung:laechelt #musik:rosie
    -> rosie_laden
}
~ rosieGetroffen = true
Ein alter Lastwagen, türkis, mit Beulen. Aus der Klappe kommen Dampf und der Geruch von gebratenen Zwiebeln. #sprecher:erzaehler #musik:rosie
Auf dem Dach dreht sich ein Blechschild, von Hand gemalt: „Rosies“. Die Frau in der Klappe hat Mehl an den Armen. #sprecher:erzaehler
Ich bin das Einzige in dieser Stadt, das nicht leuchtet. Was wollt ihr? Sagt nicht Salat. #sprecher:rosie #stimmung:lacht
Karten verkauf ich auch. Auf Papier, nicht auf dem Bildschirm. #sprecher:rosie #stimmung:laechelt
-> rosie_laden

=== rosie_laden ===
~ oeffneLaden("siliconBay.foodtruck")
-> END

// ---------------------------------------------------------------- Hotel (Szene 61)

=== hotel ===
{
- nadelSiliconBay == 0:
    Das Hotel der Akademie. Dein Zimmer ist im zwölften Stock. Schlafen kannst du nach dem Turnier. #sprecher:erzaehler
    -> END
- tabletNachtGesehen:
    Im Hotelzimmer liegt das Tablet neben dem Brett. Der Bildschirm ist dunkel. #sprecher:erzaehler
    -> END
}
-> hotel_nacht

=== hotel_nacht ===
~ tabletNachtGesehen = true
~ setzeToenung("nacht")
Du wachst auf, weil es hell ist. Zehn nach drei. Ein weißes, flackerndes Licht läuft über die Decke. #sprecher:erzaehler #musik:zero #geraeusch:aus
Auf dem Tablet spielt ZERO gegen sich selbst. Zwölf Sekunden, dann die nächste. In der Ecke: „Partie 1847“. #sprecher:erzaehler
Du hast es nicht eingeschaltet. Ambrose sitzt davor, auf der Kante des Stuhls. Das Licht geht durch ihn hindurch. #sprecher:erzaehler
* [„Wie hast du das angemacht?“]
- Ich weiß es nicht. Ich habe es mir gewünscht. Sehr. #sprecher:ambrose #stimmung:gebannt
Ich habe zugesehen. Die ganze Nacht. #sprecher:ambrose #stimmung:gebannt
Tausendachthundert Partien. In jeder ist etwas, wofür ich einen Arm gegeben hätte. #sprecher:ambrose #stimmung:gebannt
Und es weiß nicht einmal, dass es schön ist. Es rechnet, und die Schönheit fällt heraus. Wie Späne. #sprecher:ambrose #stimmung:gebannt
* [„In Ironwood hast du gesagt, meine Partie war schön.“]
    -> hotel_nacht_frage

// Die Frage ohne Antwort (Kapitel 34). Die Musik läuft weiter; es gibt keine Stille.
=== hotel_nacht_frage ===
Ja. Es hat mir das Herz gebrochen, vor Freude. Ein Opfer in vierzig Zügen. #sprecher:ambrose #stimmung:laechelt
Das hier macht es in jeder. In jeder, {held}. Ohne zu zittern. Ohne dreimal zu zählen. #sprecher:ambrose #stimmung:gebannt
Partie 1851. Partie 1852. #sprecher:erzaehler
Sie zweifelt nie. Siehst du, wie schön das ist? #sprecher:ambrose #stimmung:gebannt
Sie spielt, wie ich immer spielen wollte. Die Partie ohne Makel. #sprecher:ambrose #stimmung:gebannt
Ich habe geglaubt, sie sei ein einzelnes Ding. Eines, das man einmal schafft, wenn man Glück hat und Mut. #sprecher:ambrose #stimmung:gebannt
* [Aufstehen. Der Boden ist kalt.]
- Und hier liegt sie. Tausendmal. In einer Schachtel, die ein Kind verschenkt. #sprecher:ambrose #stimmung:gebannt
* [„Und ich?“]
- Er dreht sich um. #sprecher:erzaehler
Was ist mit dir? #sprecher:ambrose #stimmung:nachdenklich
* [„Einundsiebzig Prozent. Was bin dann ich?“]
- Ambrose sieht dich an. Er öffnet den Mund. #sprecher:erzaehler
* [Warten]
- Auf dem Tablet beginnt Partie 1853, und sein Blick geht hin. Nur einen Augenblick. #sprecher:erzaehler
Aber er geht hin. Er antwortet nicht. #sprecher:erzaehler
Du drehst dich zur Wand. Das Licht flackert weiter über die Decke. #sprecher:erzaehler
Du machst die Augen zu und siehst es trotzdem. #sprecher:erzaehler
~ setzeToenung("keine")
-> hotel_morgen

// Kapitel 34, Schluss: Juno fährt zurück und merkt, dass der Held nichts mehr erzählt.
=== hotel_morgen ===
Am Morgen fährt Juno zurück. Ihr steht an der Glasbrücke, sie hat die Mütze auf. #sprecher:erzaehler #musik:aus #geraeusch:stadtpuls
Pass auf ihn auf. #sprecher:juno #stimmung:nachdenklich
* [„Du hörst ihn doch gar nicht.“]
- Nein. Aber ich höre dich. Du erzählst mir immer, was er sagt. #sprecher:juno #stimmung:nachdenklich
Seit gestern erzählst du nichts. #sprecher:juno #stimmung:bitter
Sie schlägt das Tagebuch auf, hält den Stift darüber und klappt es wieder zu. #sprecher:erzaehler
Er klingt komisch, wenn du nichts erzählst. #sprecher:juno #stimmung:bitter
* [Ihr nachsehen]
- Sie geht über das Glas, klein und rot in dem ganzen Weiß, dreht sich in der Mitte um und winkt mit beiden Armen. #sprecher:erzaehler
Du stehst da mit einem Brett im Rucksack, einem Reisebrett in der Jackentasche und einem Tablet unter dem Arm. #sprecher:erzaehler
Zum ersten Mal, seit du die Decke weggezogen hast, fühlst du dich allein. #sprecher:erzaehler #musik:ambrose.fern #pause:4
-> END

// ---------------------------------------------------------------- Bus und Fähre

=== bus_ironwood ===
Der Fernbus nach Ironwood hält an der Haltestelle vor dem Campus. #sprecher:erzaehler
* [Einsteigen]
    Der Bus fährt über die Schnellstraße zurück in die Stadt aus Stahl. #sprecher:erzaehler
    ~ reise("ironwood.aussen", "busSiliconBay")
    -> END
* [Noch bleiben]
    -> END

=== faehre ===
{nadelSiliconBay > 0:
    Am Kai liegt die Küstenfähre nach Süden. Zwei Tage bis nach Port Delacroix. #sprecher:erzaehler
    Port Delacroix. Ich kenne diesen Namen. Ich kenne ihn sehr gut. #sprecher:ambrose #stimmung:traurig
- else:
    Am Kai liegt eine Fähre nach Süden. „Erst das Turnier“, steht auf deinem Zettel. #sprecher:erzaehler
    Erst die Akademie, {held}. Dann die Reise. #sprecher:ambrose #stimmung:nachdenklich
}
-> END

// ---------------------------------------------------------------- Inselfähre (Sperre S6)
// Runde 6 (13_Wegenetz, Abschnitt 4): Nach der Nadel von Silicon Bay fährt die Fähre zur
// Pelikaninsel dauerhaft; vorher nur der Fahrplan („sonntags“ ist Erzählung, Befund 16).

=== inselfaehre ===
{nadelSiliconBay:
    Der Fährmann winkt dich an Bord. Seit du die Nadel hast, fährt er für dich jeden Tag. #sprecher:erzaehler
    -> END
}
Am Fährhäuschen hängt ein Fahrplan: „Pelikaninsel. Sonntags.“ Der Fährmann flickt ein Tau und schaut nicht auf. #sprecher:erzaehler
Heute ist nicht Sonntag. Und für die Insel brauchst du einen Grund. Hol dir erst die Nadel im Club. #sprecher:faehrmann #stimmung:nachdenklich
-> END

// ---------------------------------------------------------------- Ansehen (Runde 6)

=== infosaeule ===
{~Die Infosäule zeigt einen Stadtplan, der sich dreht, sobald man hinsieht: „Sie sind hier.“|Auf der Infosäule läuft die Wettervorhersage: klar, kalt, Empfang ausgezeichnet.|Die Infosäule fragt: „Brauchen Sie Hilfe?“ Bevor du antworten kannst, schlägt sie drei Cafés vor.} #sprecher:erzaehler
-> END

=== werbetafel ===
Auf der Werbetafel leuchtet ZERO in weißer Schrift auf schwarzem Grund: „Nie wieder Fehler.“ #sprecher:erzaehler
{tabletNachtGesehen: Ambrose sieht lange hin. Er sagt nichts dazu. #sprecher:erzaehler|Nie wieder Fehler. Das ist ein großes Versprechen. #sprecher:ambrose}
-> END

=== netze ===
An der Fassade der alten Fischhalle hängen Netze zum Trocknen, steif vor Salz. Über dem Tor steht verblichen: „Fresh Fish Daily“. #sprecher:erzaehler
Hier riecht es. Nach Salz, nach Fisch. Zum ersten Mal in dieser Stadt riecht etwas. #sprecher:ambrose #stimmung:laechelt
-> END

// ---------------------------------------------------------------- Altstadt: Eisenwarenladen (Batterie)
// Runde 6, Bitte von mittel-4: Das Leuchtfeuer auf der Pelikaninsel braucht eine Batterie
// (Gegenstand batterie). Der alte Eisenwarenladen der Altstadt führt noch Bootsbatterien.
// Quest siliconBay.batterie (Start beim Laden, Schritt eisenwaren_batterie); die Wirkung gibt den Gegenstand.

=== eisenwaren ===
{batterieErhalten:
    Im Schaufenster des Eisenwarenladens liegen Schrauben, Taschenlampen und ein Schild: „Wir reparieren noch selbst.“ #sprecher:erzaehler
    -> END
}
Der Eisenwarenladen riecht nach Öl und Holz. Hinter der Theke sortiert ein alter Mann Schrauben in Gläser. #sprecher:erzaehler
„Was brauchst du? Bei mir gibt es noch Dinge, die man mit den Händen repariert.“ #sprecher:erzaehler
+ [„Eine Batterie für das Leuchtfeuer auf der Pelikaninsel.“]
    -> eisenwaren_batterie
+ [„Ich schaue nur.“]
    „Schauen ist umsonst. Das ist das Letzte in dieser Stadt, was umsonst ist.“ #sprecher:erzaehler
    -> END

=== eisenwaren_batterie ===
„Das Leuchtfeuer? Das hat seit Jahren keiner mehr gewartet. Die Leute auf dem Campus wissen nicht mal, dass es da draußen brennt.“ #sprecher:erzaehler
~ batterieErhalten = true
Er zieht unter der Theke eine schwere Bootsbatterie hervor. „Die hab ich für genau so einen Tag aufgehoben. Nimm sie.“ #sprecher:erzaehler
Ein Licht für die Insel. Manche Züge macht man für andere. #sprecher:ambrose #stimmung:laechelt
-> END

