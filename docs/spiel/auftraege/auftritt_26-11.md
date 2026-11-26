# Auftritte: Wer kommt oder geht, während der Held da ist (26.11.2026)

## Befund des Autors

> „Ich habe meine erste Partie gegen den Coach beendet und gewonnen, habe den Clubteil bekommen, und
> plötzlich stehen Victoria und der Typ von Perfect Move im Raum. Das macht keinen Sinn. Bitte über das
> ganze Spiel prüfen: Wenn ich mich auf einer Karte befinde und neue Figuren hinzukommen, dann will ich
> sie hereinkommen sehen, in irgendeiner Form …“

Zweiter Befund (Hauptchat, gleicher Tag): Nach der Partie gegen {rivale} gingen Hale und {rivale} per
`#gehe` zur Tür (13,13 und 14,13), blieben davor stehen und versperrten den Ausgang. Der Hotfix des
Hauptchats (Commit beb4b09a: Neuaufbau, wenn die Bedingung einer Figur im Gespräch umschlägt) ist die
Grundlage; das sichtbare Kommen und Gehen baut darauf auf.

## Was die App jetzt macht

1. **Allgemeiner Auftritt** (`app/src/abenteuer/regeln/auftritt.ts`, `oberwelt/auftrittsschicht.ts`,
   `oberwelt/auftrittsgedaechtnis.ts`): Beim Abbau einer Karte merkt sich die Oberwelt, wer sichtbar wo
   stand (auch über eine Partie oder Aufgabenrunde hinweg, im Speicher der Seite). Baut sie dieselbe
   Karte wieder auf (nach Partie, Runde oder einem Gespräch, das eine Bedingung umschlagen lässt):
   - Neue Figuren erscheinen am nächsten Übergang (Tür, Treppe, Kartenrand; `auftritt.von` in
     orte.json wählt einen) und gehen zu ihrem Feld. Erst wenn keine Ergebniskarte mehr davor liegt
     und nach 0,4 Sekunden, damit man es sieht. Sitzende und Liegende blenden an ihrem Platz ein.
   - Figuren, deren Bedingung nicht mehr gilt, stehen noch dort, wo sie zuletzt waren, gehen zum
     nächsten Übergang und blenden dort aus.
   - Nicht beim ersten Betreten, nach dem Neuladen der Seite und nach dem Warten (Zeitraffer): Wer
     dann da ist, ist einfach da. Geister (Ambrose) blenden sich weiter selbst.
2. **Erzählte Auftritte** (`auftritt.wartet` in orte.json): Solange die Bedingung gilt, steht die
   Figur unsichtbar in der Tür (ohne Körper, nicht ansprechbar). Das `#gehe` ihrer Erzählzeile holt sie
   herein. Kommt die Zeile nie und schlägt `wartet` am Gesprächsende um, kommt sie danach von selbst.
3. **`#gehe` in einen Übergang** (`oberwelt/auftrittsbild.ts`, `fuehrungsschicht.ts`): Name des
   Übergangs (`#gehe:victorClub>schule`) oder sein Feld: Die Figur blendet dort aus, ohne Körper, und
   versperrt die Tür nicht mehr. Nach jedem `#gehe` rückt der Auslöser der Figur mit, man spricht sie
   dort an, wo sie steht.
4. **Gesprächsende** (`useDialogende.ts`, Hotfix erweitert): Neuaufbau auch, wenn `wartet` einer Figur
   umschlägt, die noch in der Tür wartet; wer schon hereinkam, bleibt ohne Neuaufbau stehen.

## Clubraum Maple Falls

- `coach_nach_sieg` geht nach der Nadel (und Pratts Heimweg) gleich in `victor_trifft`; man muss den
  Coach nicht noch einmal ansprechen.
- Hale und {rivale} warten unsichtbar in der Tür (`auftritt.wartet: „nicht victorGesehen“`). Mit
  „Dann steht er in der Tür und kommt herein …“ kommen sie herein: Hale zum Coach (18,5, vor dem Plakat neben dem Pult; 17,5 versperrte das Plakat „Erst zählen“), {rivale} ans
  mittlere Fenster der Nordwand (9,3; „Am Fenster steht {rivale}“). Die alten Ziele 19,5 und 23,5
  lagen auf dem Teppich bzw. unter den Spinden (23,3 ist vom Spindbild verdeckt). Die Felder der Karte
  sind dieselben, damit nach einem Neuaufbau niemand springt.
- „Dann sind sie weg.“ und „{rv_Er} geht, ohne sich umzudrehen.“: `#gehe:…>schule`, beide blenden in
  der Tür aus. Pratt („Dann geht er wieder.“) ebenso.
- Pratt kommt nach dem Clubkampf durch die Tür herein (allgemeiner Auftritt).
- Juno kommt beim ersten Besuch mit {held} herein: `auftritt.wartet: „nicht clubBeigetreten“`, Bedingung
  jetzt „(clubBeigetreten oder junoGetroffen) und …“, `#gehe:junoClub>held` bei „Aufstellung! Juno, wen
  bringst du mir da?“. Vorher sprach sie, ohne da zu sein, und erschien erst nach dem Gespräch.
- Offen (Textfrage, keine Zeile gestrichen): Pratts Heimweg stellt die Uhr auf Abend („die Laternen
  gehen an“), danach kommt Hale und sagt in `victor_niederlage` „Wir haben um vier den Termin.“

## Das Werkzeug

`python -m pipeline.abenteuer.auftritt [--alle] [--bericht DATEI]`, Dauertest
`pipeline/tests/test_abenteuer_auftritt.py` („0 Befunde“), Ausnahmen in `auftritt_geprueft.py`.

Vor der Behebung: 11 Befunde (dazu 3 Stellen, die jetzt mit Grund geprüft sind), nachher 0.

| Prüfung | Stelle | Behebung |
| --- | --- | --- |
| erzaehlt | Clubraum, `victor_trifft`: „Dann steht er in der Tür und kommt herein“ (Hale, {rivale}) | `auftritt.wartet`, `#gehe` mit neuen Zielen |
| vor_der_tuer | Clubraum, `victor_niederlage`, `victor_ueberrascht` (beide), `pratt_und_heimweg` | Ziel `schule` (in die Tür) |
| vor_der_tuer | Cedar Creek außen, `team_kommt`: Coach und Sam „gehen voraus zur Bibliothek“ → 22,17 / 23,17 | Ziel `bibliothekTuer` |
| spricht_vor_auftritt | Clubraum, `coach_erstes_treffen`: Juno spricht, steht aber erst nach dem Gespräch da | Juno kommt mit `#gehe` herein |
| spricht_vor_auftritt | Ironwood Kantine, `mama_ankunft`: „Als Mama in der Tür steht …“, Mama erst nach der Partie im Bild | `auftritt.wartet: „nicht mamaInKantine“`, `von: kantineAusgang`, `#gehe:mama>bigJoe` |
| geprüft | Capital Arena Halle, `finale_lauf`: {rivale} rennt hinaus, Bedingung bleibt | blendet am Ausgang aus; wer zurückkommt, trifft ihn wieder („Revanche? Jederzeit …“) |
| geprüft | Ironwood Kantine, `mama_nach_partie` | Mama steht da (Fehlalarm der Richtungsprobe) |
| geprüft | Schultür-Dialog im Clubraum | Einstieg nur auf der Außenkarte (gleichnamiger Übergang) |

Dazu ohne Befund behoben: Nach der Sternennacht in Cedar Creek (`sterne_ende`, „Dann geht ihr hinüber
in den Lesesaal“) blieb {held} am Steg, und Coach und Sam (Bedingung `nachtImLesesaal`) wären um
Mitternacht dort hereingekommen, Stunden vor ihrem Bus. Jetzt `~ reise("cedarCreek.bibliothek",
"bibliothekAusgang")` (Empfehlung umgesetzt, Widerspruch genügt).

53 Umschläge laufen über den allgemeinen Auftritt (Liste mit `--alle` oder im Bericht des Werkzeugs).
Nicht abgedeckt, aber zur Zeit ohne Fall: Simultan und Gedächtnisstellung laufen in der Oberwelt ohne
Neuaufbau (Prüfung `ohne_neuaufbau`); Karten ohne Übergang (`ohne_eingang`).
