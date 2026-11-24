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

## Gemeldet, nicht behoben

- Zur gewählten Stunde nicht da (Geschichte oder Bedingung, kein Fehler der Stehplätze): Juno im
  Diner um 2 Uhr, Graham Hale und Big Joe in der Kantine (Akt 3) um 3 Uhr.
- Die Joggerin bekommt auf der Landstraße nur ihr Bild; ansprechen kann man sie dort nicht (ihre
  Figur mit Dialog gehört zum Weg Ironwood–Silicon). Falls sie dort sprechen soll: Eintrag in
  `orte.json` für `wegMapleCedar`.
