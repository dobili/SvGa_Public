# Eiliger Spieler-Durchlauf Akt 4 bis zum Abspann (24.11.2026)

Auftrag des Hauptchats (24.11.2026, morgens): Akt 4 mit dem eiligen Spieler bis zum Abspann, Hoch-
und Querformat; Befunde beheben, mit Test. Dazu: Junos ungenutzte Diner-Nachtplätze streichen, wenn
sie nie greifen. (Akt 3 macht mittel-2.)

## Aufruf

```bash
node pipeline/abenteuer/aktstand.cjs --akt 4 --ziel akt4.json
(cd app && DURCHLAUF_ORDNER=… DURCHLAUF_STAND=akt4.json DURCHLAUF_SPIELER=eilig \
  DURCHLAUF_FORMAT=hoch|quer DURCHLAUF_MINUTEN=150 CHROMIUM_PFAD=… \
  npx playwright test --config playwright.durchlauf.config.ts durchlauf.spec)
```

Der Stand beginnt in Desert Springs (Ende Akt 3); die ersten 25 Minuten zählt die Messung noch zu
Akt 3.

## Strecken

| Format | Laufzeit bis Abspann | Akt-4-Partien | Aufgabenrunden (Aufgaben) | Funde |
| ------ | -------------------- | ------------- | ------------------------- | ----- |
| hoch   | 53,7 min             | 15            | 4 (14)                    | 3     |
| quer   | 53,7 min             | 14            | 5 (19)                    | 1     |

Keine doppelten Dialoge, keine verlorenen Rückmeldungen, keine hängenden Pausen, keine Meldungen
über offenen Fenstern (Wache und rueckmeldung.ts). Beide Läufe erreichen den Abspann und die
Meldung „Erledigt: Die Landesmeisterschaft“.

## Funde

| Fund | Ursache | Korrektur | Test |
| ---- | ------- | --------- | ---- |
| Hoch: Kit, Sol und Ward in Summit City außen „steht davor, kein Aktionsknopf“ | Durchlauf: Das Spiel stellt die Figuren nur beim Kartenaufbau nach der Uhr auf, nie vor den Augen des Spielers (regeln/tagesablauf.ts). Der Durchlauf rechnete mit der laufenden Uhr; sie ging auf der Karte über 17 Uhr, und er suchte die drei an ihren Abendplätzen. | Für die Karte unter dem Helden nimmt der Durchlauf die Stunde ihres Aufbaus (`data-stunde` der Welt; `merkeAufbaustunde` in tests/durchlauf/uhrwelt.ts, gelesen in lage.ts). Im Querformat danach kein Fund für Kit und Sol. | tests/durchlauf/uhrwelt.test.ts |
| Quer: Ward abends auf der Parkbank „kein Aktionsknopf“ | Fehlalarm des Durchlaufs, kein Spielfehler: Ward sitzt auf (41, 38); links steht der Statist Rentner, rechts der Marktstand, unten die Bank. Das Bild einer Sitzenden rückt auf die Bank, ihre Sperre wächst mit (sitzsperre); der Durchlauf kennt nur die Fußkachel und versucht es von unten. Im Spiel zeigt der Held vom Feld darüber (41, 37) „Sprechen“ (Foto mit verdeckungsfoto.spec.ts). | Nicht geändert. | – |

## Tagesabläufe

- **Juno:** Ihr ganzer Ablauf greift nie, nicht nur die Diner-Nachtplätze. Solange eine ihrer
  Figuren sichtbar ist, gilt deren `wenn` und Regel 1 hält sie fest; dazwischen (nach dem Aufbruch,
  vor dem Ende von Akt 1) ist sie fortgeschickt. Sie folgt jetzt der Geschichte
  (`folgt_geschichte`, Questort Clubraum bleibt eingetragen). skaterJo schaut im Diner nachts nicht
  mehr zu Junos leerem Platz.

## Werkzeug

- Ansprechprobe: `PROBE_STUNDE` setzt die Spieluhr (tests/durchlauf/probe.ts), für Figuren nach
  dem Tagesablauf.
