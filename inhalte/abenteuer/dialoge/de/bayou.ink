// Nebenschauplatz Bayou (Akt 4, Rückkehr in den Süden, Story-Bibel Abschnitt 28; Landschaft L5
// Nebelschach). Karte „Bootssteg im Bayou“, erreichbar von Port Delacroix nach der Eröffnung des
// Musikhauses.
//
// Luftbootführer Theron erklärt Nebelschach; die Variante braucht eine eigene Bot-Logik (Bibel,
// Abschnitt 34) und wird deshalb hier nur erzählt. Einstiege wie in orte.json: theron,
// zurueck_delacroix, nebel. Variablen setzt diese Datei.

VAR theronGetroffen = false
VAR bayouNebelGesehen = false

=== theron ===
{theronGetroffen:
    {~Im Nebel siehst du nur, wohin deine Figuren ziehen können. Der Rest ist Geduld.|Der Alligator dort heißt Bernard. Er spielt nicht mit.|Nächsten Sommer bringe ich dir das richtig bei. Mit Brett und Nebel.} #sprecher:theron
    -> END
}
~ theronGetroffen = true
Am Bootssteg liegt ein flaches Luftboot mit einem riesigen Propeller. Ein Mann mit Sonnenbrille winkt. #sprecher:erzaehler
Theron. Ich fahre Leute durch den Bayou. Morgens, wenn der Nebel liegt, spielen wir Nebelschach. #sprecher:theron
Du siehst nur die Felder, die deine Figuren erreichen. Den Rest verschluckt der Nebel. #sprecher:theron
Wie im Leben: Man sieht nie das ganze Brett. Aber man zieht trotzdem. #sprecher:ambrose #stimmung:friedlich
-> END

=== nebel ===
{bayouNebelGesehen:
    Der Nebel hat sich gehoben. Zwischen den Zypressen glitzert das Wasser. #sprecher:erzaehler
    -> END
}
~ bayouNebelGesehen = true
Über dem Wasser liegt dichter Nebel. Irgendwo platscht etwas, irgendwo ruft ein Vogel. #sprecher:erzaehler
Du kannst kaum drei Bootslängen weit sehen. So ungefähr fühlt sich Nebelschach an. #sprecher:erzaehler
-> END

=== zurueck_delacroix ===
Das Luftboot bringt dich zurück zum Kai von Port Delacroix. #sprecher:erzaehler
-> END
