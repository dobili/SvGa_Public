/**
 * Legenden der Werkzeuge als Bildzeichen: je Werkzeug eine kurze Reihe aus farbigem Pfeil, Feld
 * oder Kennung mit ein bis zwei Wörtern („goldener Pfeil: Weiß“, „roter gestrichelter Pfeil:
 * Schwarz“, „grauer Pfeil: Abtausch“).
 *
 * Rolle im Gesamtbild: Runde „Weniger Text“, Punkt P7 (Wahl des Autors, 31.10.2026): Junge Leser
 * schreckt der Satz „Am Brett: Goldene Pfeile: … Rote Pfeile: … Graue Pfeile: …“ ab. Die Karte
 * (Werkzeugkarte.tsx) zeigt deshalb diese Reihe; der volle Satz (werkzeug.<id>.legende) steht
 * hinter dem Infoknopf. Neue Werkzeuge bekommen hier eine Zeile (eintragen statt umbauen); ohne
 * Zeile zeigt die Karte den Satz wie bisher.
 * Die Zeichen folgen den Markierungen am Brett: Gold durchgezogen, Rot gestrichelt, Grau
 * gepunktet (Brettmarken.tsx, Konzept 10.3), damit die Reihe auch ohne Farbsehen lesbar bleibt.
 * Die Wörter dürfen {eigen} und {gegner} enthalten; die Karte setzt die Farben der Sicht ein.
 * Abhängigkeiten: i18n (nur Typen).
 */
import type { Textschluessel } from "../../i18n/sprache";

/** Art des Zeichens: Pfeil, farbiges Feld oder Feld mit Kennung (Warnsignal, Bauernkürzel). */
export type Legendenzeichen = "pfeil" | "feld" | "kennung";

/** Die drei Farben der Markierungen am Brett. */
export type Legendenfarbe = "gold" | "rot" | "grau";

/** Ein Eintrag der Reihe: Zeichen, Farbe und das Stichwort. */
export interface Legendeneintrag {
  readonly zeichen: Legendenzeichen;
  readonly farbe: Legendenfarbe;
  readonly wort: Textschluessel;
}

/** Kurzschreibweise für die Liste unten. */
function e(zeichen: Legendenzeichen, farbe: Legendenfarbe, wort: Textschluessel): Legendeneintrag {
  return { zeichen, farbe, wort };
}

/**
 * Die Reihen je Werkzeug. Die Reihenfolge folgt dem Satz der Legende, damit der Leser im
 * Infoknopf dieselbe Ordnung wiederfindet.
 */
export const LEGENDEN: Readonly<Record<string, readonly Legendeneintrag[]>> = {
  "k1-zaehlen": [
    e("pfeil", "rot", "wenigertext.werkzeug.wort.angreifer"),
    e("pfeil", "gold", "wenigertext.werkzeug.wort.verteidiger"),
    e("feld", "rot", "wenigertext.werkzeug.wort.gezaehlt"),
  ],
  "k1-angriffsregel": [
    e("feld", "gold", "wenigertext.werkzeug.wort.eigen"),
    e("feld", "rot", "wenigertext.werkzeug.wort.gegner"),
    e("feld", "grau", "wenigertext.werkzeug.wort.sektor"),
  ],
  "k1-todsuenden": [e("feld", "rot", "wenigertext.werkzeug.wort.todsuende")],
  "k1-roentgen": [
    e("pfeil", "gold", "wenigertext.werkzeug.wort.eigen"),
    e("pfeil", "rot", "wenigertext.werkzeug.wort.gegner"),
    e("pfeil", "grau", "wenigertext.werkzeug.wort.abtausch"),
  ],
  "k2-zielbilanz": [
    e("feld", "gold", "wenigertext.werkzeug.wort.zielErreicht"),
    e("feld", "rot", "wenigertext.werkzeug.wort.startfeld"),
    e("feld", "grau", "wenigertext.werkzeug.wort.offen"),
  ],
  "k3-faktorenbilanz": [
    e("feld", "gold", "wenigertext.werkzeug.wort.imSpiel"),
    e("feld", "grau", "wenigertext.werkzeug.wort.zuHause"),
    e("feld", "rot", "wenigertext.werkzeug.wort.koenigsgefahr"),
  ],
  "k4-falle": [
    e("pfeil", "rot", "wenigertext.werkzeug.wort.falle"),
    e("pfeil", "gold", "wenigertext.werkzeug.wort.besser"),
  ],
  "k4-prueffragen": [
    e("pfeil", "grau", "wenigertext.werkzeug.wort.fesselung"),
    e("pfeil", "gold", "wenigertext.werkzeug.wort.geplanterZug"),
    e("pfeil", "rot", "wenigertext.werkzeug.wort.neueFesselung"),
  ],
  "k4-warnsignale": [
    e("kennung", "rot", "wenigertext.werkzeug.wort.beiEigen"),
    e("kennung", "gold", "wenigertext.werkzeug.wort.beiGegner"),
  ],
  "k5-vorher": [
    e("pfeil", "gold", "wenigertext.werkzeug.wort.bauernzug"),
    e("feld", "gold", "wenigertext.werkzeug.wort.neuKontrolliert"),
    e("feld", "rot", "wenigertext.werkzeug.wort.aufgegeben"),
  ],
  "k5-felder": [
    e("feld", "rot", "wenigertext.werkzeug.wort.loch"),
    e("feld", "gold", "wenigertext.werkzeug.wort.starkesFeld"),
  ],
  "k5-bauern": [
    e("kennung", "rot", "wenigertext.werkzeug.wort.schwaecheEigen"),
    e("kennung", "gold", "wenigertext.werkzeug.wort.ziel"),
    e("feld", "grau", "wenigertext.werkzeug.wort.offeneLinie"),
  ],
  "k5-richtung": [
    e("pfeil", "grau", "wenigertext.werkzeug.wort.kette"),
    e("pfeil", "gold", "wenigertext.werkzeug.wort.hebel"),
    e("feld", "rot", "wenigertext.werkzeug.wort.kettenbasis"),
  ],
  "k5-figuren": [
    e("feld", "rot", "wenigertext.werkzeug.wort.schlechterLaeufer"),
    e("feld", "gold", "wenigertext.werkzeug.wort.gutesFeld"),
  ],
  "k6-wo": [
    e("feld", "gold", "wenigertext.werkzeug.wort.eigen"),
    e("feld", "rot", "wenigertext.werkzeug.wort.gegner"),
    e("feld", "grau", "wenigertext.werkzeug.wort.ziel"),
  ],
  "k6-gegner": [
    e("pfeil", "rot", "wenigertext.werkzeug.wort.planGegner"),
    e("pfeil", "gold", "wenigertext.werkzeug.wort.gegenschlag"),
  ],
  "k6-lap": [
    e("feld", "rot", "wenigertext.werkzeug.wort.wenigAktiv"),
    e("pfeil", "gold", "wenigertext.werkzeug.wort.weg"),
    e("feld", "grau", "wenigertext.werkzeug.wort.machtPlatz"),
  ],
  "k6-planbilanz": [
    e("feld", "gold", "wenigertext.werkzeug.wort.eigen"),
    e("feld", "rot", "wenigertext.werkzeug.wort.gegner"),
    e("feld", "grau", "wenigertext.werkzeug.wort.ziel"),
  ],
  "k7-warnsignale": [
    e("kennung", "rot", "wenigertext.werkzeug.wort.beiEigen"),
    e("kennung", "gold", "wenigertext.werkzeug.wort.beiGegner"),
    e("kennung", "grau", "wenigertext.werkzeug.wort.gabelfeld"),
  ],
  "k7-erzwingend": [
    e("pfeil", "gold", "wenigertext.werkzeug.wort.kandidaten"),
    e("pfeil", "grau", "wenigertext.werkzeug.wort.ohneGewinn"),
  ],
  "k7-motiv": [
    e("pfeil", "gold", "wenigertext.werkzeug.wort.schluesselzug"),
    e("feld", "rot", "wenigertext.werkzeug.wort.ziel"),
  ],
  "k7-ruhe": [
    e("pfeil", "gold", "wenigertext.werkzeug.wort.hauptvariante"),
    e("pfeil", "rot", "wenigertext.werkzeug.wort.drohung"),
  ],
  "k8-regeln": [e("pfeil", "gold", "wenigertext.werkzeug.wort.koenigsweg")],
  "k8-opposition": [
    e("feld", "grau", "wenigertext.werkzeug.wort.dazwischen"),
    e("feld", "gold", "wenigertext.werkzeug.wort.opposition"),
    e("pfeil", "gold", "wenigertext.werkzeug.wort.entscheidet"),
    e("pfeil", "rot", "wenigertext.werkzeug.wort.patt"),
  ],
  "k8-quadrat": [
    e("pfeil", "gold", "wenigertext.werkzeug.wort.bauernweg"),
    e("feld", "grau", "wenigertext.werkzeug.wort.quadrat"),
    e("feld", "rot", "wenigertext.werkzeug.wort.zuSpaet"),
  ],
  "k8-schluesselfelder": [
    e("feld", "gold", "wenigertext.werkzeug.wort.eigen"),
    e("feld", "rot", "wenigertext.werkzeug.wort.gegner"),
  ],
  "k8-elementarmatt": [
    e("feld", "grau", "wenigertext.werkzeug.wort.kasten"),
    e("pfeil", "gold", "wenigertext.werkzeug.wort.matt"),
    e("pfeil", "rot", "wenigertext.werkzeug.wort.patt"),
  ],
  "k9-turmbegriffe": [
    e("pfeil", "grau", "wenigertext.werkzeug.wort.sperrlinie"),
    e("feld", "gold", "wenigertext.werkzeug.wort.richtig"),
    e("feld", "rot", "wenigertext.werkzeug.wort.falsch"),
  ],
  "k9-erkennungsbilder": [
    e("feld", "gold", "wenigertext.werkzeug.wort.dafuer"),
    e("feld", "rot", "wenigertext.werkzeug.wort.gefahr"),
    e("feld", "grau", "wenigertext.werkzeug.wort.orientierung"),
  ],
  "k11-phase": [e("pfeil", "gold", "wenigertext.werkzeug.wort.koenigsweg")],
  "k12-erfassen": [
    e("pfeil", "rot", "wenigertext.werkzeug.wort.drohung"),
    e("kennung", "rot", "wenigertext.werkzeug.wort.beiEigen"),
    e("kennung", "gold", "wenigertext.werkzeug.wort.beiGegner"),
  ],
  "k12-kandidaten": [
    e("pfeil", "gold", "wenigertext.werkzeug.wort.kandidaten"),
    e("pfeil", "rot", "wenigertext.werkzeug.wort.besteAntwort"),
  ],
  "k12-sicherheitsblick": [
    e("pfeil", "gold", "wenigertext.werkzeug.wort.zug"),
    e("pfeil", "rot", "wenigertext.werkzeug.wort.schlagSchach"),
    e("feld", "rot", "wenigertext.werkzeug.wort.bedroht"),
  ],
};

/**
 * Die Reihe eines Werkzeugs, oder null, wenn es keine hat (dann bleibt der Satz).
 * Beispiel: legendenreihe("k1-roentgen") → drei Pfeile; legendenreihe("k2-eroeffnung") → null.
 */
export function legendenreihe(werkzeug: string): readonly Legendeneintrag[] | null {
  return LEGENDEN[werkzeug] ?? null;
}
