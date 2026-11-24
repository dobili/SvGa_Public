# Stehplätze und Fußmatten: Sichtprüfung im Spiel (24.11.2026)

Auftrag des Hauptchats (Nacht 23./24.11.2026): Die Tagesablauf-Sitzenden ohne erzählten Grund
stehen seit mittel-4 (3a9b21cf) neben ihrem Möbel, Nachbarn schauen sich an; die Fußmatten liegen
spielweit hinter den Türen (Tür 75 % deckend). Beides mit echten Bildern im Spiel fotografieren,
Fehler beheben, zweimal vergleichen. Fotos und Vergleichsseite nur lokal in
`buch/arbeit/stehplatz/fotos/` (Paketbilder); dieser Bericht kommt ohne Bilder aus.

## Verfahren

- Werkzeug: `app/tests/durchlauf/verdeckungsfoto.spec.ts` (Befehl in CLAUDE.md), erweitert um
  `kacheln` (Ausschnitt für Gruppen) und `held` (feste Lage des Helden, für die Türen). Der Held
  meidet jetzt auch die Felder, auf denen zur Stunde Personen nach ihrem Tagesablauf stehen.
- Stehplätze: alle Blöcke mit `tut: steht` und `blick`, je Karte eine Abend- und eine Nachtstunde,
  Gruppen in einem Ausschnitt, weit verteilte Personen einzeln (67 Aufnahmen): Diner Maple Falls,
  Kantine Ironwood (Akt 3 und nach dem Kauf), Saloon Ghost Town, U-Bahnhof, Innenstadt Capital,
  Park Maple Falls, Cedar Creek außen, dazu Turnhalle und Hafen Port Delacroix, Diner am Weg
  Desert–Summit, Ironwood außen, Landstraße Maple–Cedar, Kanalweg, Wohnzimmer, Bahnhofshalle
  Riverton, Desert Springs.
- Fußmatten: elf Türen, je zwei Aufnahmen (Held zwei Kacheln vor der Matte mit Blick zur Tür; Held
  auf der Matte in der Tür): Ghost-Town-Laden, Bahnhofshalle Riverton, Arena-Halle, Kantine
  Ironwood, Diner, Clubraum, Saloon, Turnhalle Port Delacroix, Lobby Silicon Bay, Waschsalon Cedar
  Creek, Hütte Summit City.

## Ergebnis

89 Aufnahmen, zweimal verglichen. Die Stehplätze stimmen: Niemand steht in Möbeln, Wänden oder
unter Dächern; Paare und Gruppen schauen sich an (Earl und Ruth Keene am Diner Desert–Summit, Hank
und Priya vor der Kantine Ironwood, Batiste und Bläser in der Turnhalle, die Gruppe in der
Innenstadt, Ada und die Joggerin an der Landstraße). Die Mutter steht neben dem Stuhl, der nur am
Umzugstag dasteht (so gewollt). Die Fußmatten stimmen an allen elf Türen: Die Matte liegt
sichtbar hinter der Tür, Glastüren scheinen durch, Holztüren decken die Matte bis auf den
oberen Rand; der Held steht in der Tür sauber vor allem.

## Behoben

- **Joggerin auf der Landstraße als Platzhalterquadrat.** Der Tagesablauf stellt sie abends auf
  die Landstraße Maple–Cedar, in `orte.json` gehört sie aber zum Weg Ironwood–Silicon; eine Karte
  lud nur die Bögen der Figuren ihres eigenen Orts. Jetzt nimmt `spriteZu` (`oberwelt/weltdaten.ts`)
  sonst den Bogen der gleichnamigen Figur eines anderen Orts (Test `figurbogenwahl.test.ts`).

## Neue Bilder nötig

- **Dime** hat keinen Bogen im Paket (`figuren/dime.png` fehlt, auch kein PixelLab-Bogen) und
  steht auf dem Kanalweg als Platzhalterquadrat.

## Nachprüfung gegen die Geschichte (zweiter Auftrag, 24.11.2026)

**Juno, Graham Hale und Big Joe „zur Stunde nicht da“.** Kein Quest braucht sie dort zu dieser
Stunde. Sie fehlen, weil Regel 1 der Tagesabläufe (`festgehaltene`, regeln/tagesablauf.ts) jede
Person festhält, deren Figur ein `wenn` trägt, das gerade gilt; sie bleibt dann am Platz der Szene:

- Juno: `mapleFalls.juno` mit „nicht aufbruchGesehen oder endeAkt1Gesehen“ gilt ab Akt 2 immer.
  Sie steht nachts also nie im Diner, sondern vor ihrem Haus. Passend, aber ihre Nachtplätze im
  Diner werden ab Akt 2 nie benutzt (Hinweis für den, der die Abläufe pflegt).
- Graham Hale: `ironwood.grahamHale` mit „nadelIronwood > 0“ gilt ab der Nadel; er bleibt vor der
  Kantine (sein Questort). Passend.
- Big Joe: `ironwood.bigJoe` mit „nicht endeAkt3Gesehen oder …“ gilt in Akt 3; er bleibt an seinem
  Platz in der Kantine. Passend.

**Behoben dabei: Fortgeschickte kamen nach der Uhr zurück.** Gilt keines der `wenn` einer Person,
hat die Geschichte sie fortgeschickt; die Uhr stellte sie trotzdem hin. Big Joe stand im Endstand
nachts in der Kantine Ironwood, obwohl er nach Akt 3 an der Crossroads ist; Graham Hale stand vor
der Nadel nach der Uhr in Ironwood. Jetzt stellt die Uhr niemanden hin, dessen Figuren im Ort alle
ein `wenn` tragen und keines gilt (`fortgeschickte` in regeln/tagesablauf.ts, gleich in
pipeline/abenteuer/gesamtsimulation-uhr.cjs).

**Joggerin auf dem Weg Maple–Cedar.** Dort heißt sie Tessa (`wegMapleCedar.tessa`, `.tessaFluss`,
`.tessaZedern`, Bild `joggerin`, Dialog `weg-maple-cedar.tessa` mit den Stufen A bis D). Die
Geschichte führt sie über ihre Stufen selbst, in Stufe D heißt es „Von der Joggerin ist heute
nichts zu sehen“. Der Tagesablauf „joggerin“ stellte sie zusätzlich auf die Landstraße, ohne
Dialog und doppelt (in Akt 2 läuft sie laut Geschichte am Flussweg). Sie folgt jetzt der
Geschichte (`folgt_geschichte`, wie der Entwurf es für Personen in mehreren Orten vorsieht); Ada
steht abends wieder mit Blick zur Straße. Ansprechbar ist sie an ihren Plätzen der Geschichte, mit
ihrem Dialog. Neue Dauerprüfung Regel 7 in pipeline/abenteuer/tagesablauf.py: Jede Person mit
Blöcken heißt in ihrem Ort wie eine ihrer Figuren (sonst stellte die App sie doppelt hin).
