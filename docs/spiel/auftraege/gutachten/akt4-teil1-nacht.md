# Kartengutachten Akt 4, erster Teil (Nacht 14./15.11.2026, Helfer k4a)

Geprüft: alle Karten und Zustandsfassungen von Wüstenstraße (`wegDesertSummit`), Hochebene,
Summit City, Weg 8 (`wegSummitCrossroads`), Crossroads, Jahrmarkt, Weg 9
(`wegCrossroadsPinewood`) und Pinewood Camp, 20 Szenen. Gerendert mit
`python -m pipeline.abenteuer.kartenbild`, angesehen ganz und in Ausschnitten mit Raster; Maßstab
KARTENREGELN 10.x bis 10.77, KARTENPRUEFUNG, Ortsdokumente (`orte/summit-city.md`,
`orte/crossroads.md`, `orte/pinewood.md`, `orte/jahrmarkt.md`) und `20_Ortsblaetter.md`. Lage in
Kacheln (x, y) ab oben links.

## Ergebnis je Karte

| Karte | vorher | nachher |
| --- | --- | --- |
| `crossroads.aussen` (und `-gatter-offen`) | Sechs Türen ohne Weg (Hühnerstall, Schuppen, zwei Wohnwagen, Farmhaus, Scheune); Imbisswagen ohne Bucht; Schulbus von Coach Delgado fehlt; Schottergasse vor dem Motel endet im Gras (58–61, 33–34); Wartehäuschen auf Gras | Erdweg hinter der Tankstelle (33–61, 6–7) mit den Bauten eine bis zwei Reihen höher, Pflasterweg Vorplatz → Farmhaus (57–60, 19–20), Trampelpfad über die Weide zum Scheunentor (8–20, 8–9); Imbisswagen und Schulbus (`fz11SchulbusAb`, 23–25 / 28–34) in eigenen Buchten, Coach an ihrem Bus (24, 36), Rosie (19, 34); Gasse endet am Motel; Haltestelle auf Pflaster |
| `crossroads.raststaette` | Glastür innen 1 Feld, außen am Diner-Wagen 2 (10.77) | Glas-Doppeltür `rv8GlastuerSued` (12–13, 17), zwei Matten, Auslöser auf beiden Feldern |
| `summitCity.aussen` | West- und Ostrand offene Wiese, obwohl Pinienwald beschrieben ist; drei Wege laufen in den unsichtbaren Rand (Reihen 22–23, 33–34, 46–47); Hof, Schuppen, Hütte und Kiosk im Süden und die Holzfällerhütte am Markt ohne Weg; Stummel (61–62, 56) endet im Gras; grundlose Zaunlinie (45, 48–58); Pflaster ↔ Asphalt am Südrand (10.72) | Pinienwald an beiden Rändern (27 Bäume nur auf freien Feldern), Wege enden an Häusern; Gasse im Süden (Reihen 57–58) mit Stichen zu allen Türen; Zaunlinie weg; Ortseingang Asphalt mit Mittellinie (34–36, 54–59), Wechsel zum Pflaster im Ort |
| `summitCity.huette` | Vitrine mit Pokal und zwei Diagrammrahmen, obwohl die Wände leer sein sollen (Entscheidung 13.11.2026); Kit und Haraldsen stehen am Brett; Tür 1 Feld, außen Doppeltür | Vitrine, Pokal, Diagramme weg (Kommode und Holztruhe halten die Belegung über 20 %); Doppeltür aus Holz (8–9, 12). Kit und Haraldsen stehen weiter: Stühle unter Figuren meldet der Kartenbau als zugestellt |
| `summitCity.bergstation`, `.bergladen` | stimmig | unverändert (Victor auf der Plattform: offener Punkt) |
| `hochebene.felsentuerme` | Piste in rechtwinkligen Versprüngen statt der beschriebenen Bögen; dunkler Kasten mit Felswand und Kerbe am Südrand (34–60, 20–28) ohne Sinn; Belag wechselt an beiden Rändern (pisteRot ↔ Schotter, 10.72) | Piste in drei weichen Bögen mit Schrägkacheln, an beiden Rändern Schotter; Südkante gerade |
| `hochebene.schule` (und `-vor-diplom`) | stimmig; die Straße mit Mittellinie läuft an beiden Rändern ohne Ausgang hinaus | unverändert, siehe offene Punkte |
| `jahrmarkt.festplatz` | stimmig; Zäune nur oben und unten, enden an Endpfosten (regelgerecht) | unverändert |
| `wegCrossroadsPinewood.huetten` | reif | unverändert |
| `wegCrossroadsPinewood.riesenbaeume` | schwarze Fahne doppelt auf (17, 87); keine Abzweigung zum Lebendschach-Brett (10.52) | eine Fahne; Trampelpfad (18–21, 91–92), Betreuerin daneben |
| `pinewoodCamp.aussen` | quadratische Insel (28–31, 38–39); Kiosk-Theke, Waschhaus und Hütte im Nordosten ohne Weg; Köchin „am Kiosk“ steht 4 Felder daneben | Insel unregelmäßig (Reihen 37–40); Trampelpfade zu Kiosk (35–36, 21–23), Waschhaus (49–50, 23) und Hütte (53–54, 15–23); Köchin neben der Theke (37, 21), Hollis (56, 16). Tamsin bleibt am Steg (46, 30) |
| `wegSummitCrossroads.praerie` | Hofplatz durch einen Grasstreifen vom Erdweg getrennt | Einfahrt (16, 76–78) |
| `wegSummitCrossroads.geysirbecken` | stimmig bis auf Punkt unten | unverändert |
| `wegDesertSummit.diner` (und `-neon`), `.bergstrasse` | stimmig bis auf Punkte unten | unverändert |
| `wegDesertSummit.hinterzimmer` | Tür 1 Feld, außen die Glas-Doppeltür des Diners (10.77) | Glas-Doppeltür (7–8, 10) |

## Offene Punkte (Empfehlungen)

1. **Wards Hütte liegt im Ort** (Entscheidung 13.11.2026: eine Stunde über der Stadt, nur zu Fuß).
   Ein Übergang vom Pfadende direkt in die Hütte widerspricht 10.77 (Übergang in ein Gebäude
   braucht ein Gebäudebild mit Tür) und `uebergaenge` (Südtür innen führt nicht an einen
   Kartenrand). Empfehlung: kleine Außenkarte `summitCity.huettenpfad` (etwa 24 × 40) vom
   Westende der Gipfelfelsen hinauf zur Hütte mit Veranda; die Hütte im Ort wird Ferienhütte.
   Versucht und zurückgenommen, weil eine neue Karte über diese Nacht hinausgeht.
2. **Bergstation:** Victor soll auf der offenen Plattform mit dem Rücken am Geländer über dem
   Wolkenmeer sitzen (Szene 88). Dafür fehlen Bilder: Plattformgeländer, Wolkenmeer als Boden,
   großes Seilrad. Bildwunsch an Gemini.
3. **Thermometer** für Wards leere Wand (Wandbild, 1 × 1 Kachel); Auslöser `pokal` (14, 4) zeigt
   schon den Text zum Thermometer. Bildwunsch.
4. **Hinterzimmer des Diners** wird durch die Vordertür betreten. Empfehlung: Gastraum des Diners
   als eigene Innenkarte mit Tür nach hinten, oder Dinerbild mit Hintertür.
5. **Highway Desert Springs ↔ Wüstenstraße:** weiß gestrichelt (Desert Springs, `asphaltMitte`)
   gegen gelb (`markierung`) am Rand. Die andere Seite liegt nicht in dieser Gruppe.
6. **Schule:** Die Straße läuft an beiden Rändern ohne Ausgang hinaus; als Landstraße (10.72) wäre
   sie `landstrasse` ohne Mittellinie. Nicht geändert, weil die Zustandsfassung mitzieht und der
   Bus dort fahren soll; Entscheidung beim Hauptchat.
7. **Geysirbecken:** Der Fund `fundBisonhaar` hängt laut Ortsdokument „am Zaun“, ein Zaun steht dort
   nicht mehr (seit Runde 9 entfernt).
8. **Camp:** Die Zelte stehen im Nordwesten, das Ortsblatt nennt „Zelte im Halbkreis am See“; der
   Opa „sitzt vor dem Wohnwagen“, den es nicht mehr gibt.
9. **Insel im Camp:** Die kleine Insel (28–31, 37–40) zeigt an den Schrägen orange Sandzwickel; eine
   größere, runde Insel mit eigenem Bild wäre besser.
10. **Weltpuzzle:** Die Südgasse von Summit City (Reihen 57–58) liegt am Südrand und wird als
    Randbruch gegen Geysirbecken und Bergstraße gemeldet; dazu ältere Randbrüche (Crossroads ↔
    Hütten Reihe 16, Camp ↔ Canyonrand am See, Felstürme ↔ Schule und Bergstraße in den
    Randreihen). Keine Abkürzung, nur Bild an der Naht.

## Prüfungen

`kartenbau` für alle geänderten Szenen in Ordnung; `uebergaenge` ohne Befund in dieser Gruppe
(die 26 übrigen gehören anderen Orten); `pytest pipeline/tests` 1337 bestanden (der Chaos-Lauf
von Akt 1 brach unter Last nach 120 s ab, Ausgaben bis dahin „ok“); `gesamtsimulation --schnell`
ohne Meldungen, alle Sammelstränge voll; Lauftest `uebergangslauf.test.ts` bestanden (mit längerer
Zeitgrenze, unter Last).
