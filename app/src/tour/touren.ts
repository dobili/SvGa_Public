/**
 * Die Touren der App als Daten: je Bildschirm eine Liste von Schritten mit Ziel und Text.
 *
 * Rolle im Gesamtbild: Wunsch des Autors R52 (23.10.2026): eine kurze Haupttour über die Bereiche
 * und je Bildschirm eine ausführliche Tour, leicht anpassbar und ergänzbar. Ein Schritt nennt sein
 * Ziel über eine feste Kennung (Attribut `data-tour` am Element, nicht über CSS-Klassen oder
 * Beschriftungen) und seinen Text über einen Schlüssel in de.json und en.json. Eine Tour
 * ergänzen heißt hier eine Zeile hinzufügen, am Element die Kennung setzen und den Text in beide
 * Sprachdateien schreiben; touren.test.ts meldet Ziele, die es im Code nicht gibt.
 * Ablauf und Anzeige stehen in TourEbene.tsx, das Symbol in TourKnopf.tsx.
 * Abhängigkeiten: app/stapel.ts (Ansichten), training/trainer.ts (Kennungen), i18n (Schlüssel).
 */
import type { Ansicht } from "../app/stapel";
import type { Textschluessel } from "../i18n/sprache";
import type { TrainerKennung } from "../training/trainer";

/** Ein Schritt der Tour. */
export interface Tourschritt {
  /** Kennung des Ziels (`data-tour`); ohne Ziel steht der Text in der Mitte des Bildschirms. */
  readonly ziel: string | null;
  /** Fehlt das Ziel gerade, zeigt die Tour den Text in der Mitte, statt den Schritt zu überspringen. */
  readonly ersatzMitte: boolean;
  readonly text: Textschluessel;
}

/** Eine Tour: Titel der Karte und ihre Schritte in Reihenfolge. */
export interface Tour {
  readonly titel: Textschluessel;
  readonly schritte: readonly Tourschritt[];
}

/** Die Touren: Haupttour, je Bildschirm eine, je Trainer eine (seit Teil B auch Spielen und Partie). */
export type TourKennung =
  | "haupt"
  | "buch"
  | "kapitel"
  | "abbildung"
  | "uebung"
  | "training"
  | `trainer.${TrainerKennung}`
  | "lernsammlung"
  | "nachschlagen"
  | "glossar"
  | "begriff"
  | "denkroutine"
  | "checkliste"
  | "steckbriefe"
  | "werkzeuge"
  | "ich"
  | "spielen"
  | "partie";

/** Ein Schritt mit Ziel; mit `ersatzMitte` erscheint er auch ohne Ziel (in der Mitte). */
function ziel(kennung: string, text: Textschluessel, ersatzMitte = false): Tourschritt {
  return { ziel: kennung, ersatzMitte, text };
}

/** Ein Schritt ohne Ziel, immer in der Mitte: Begrüßung, Erklärung einer Runde. */
function mitte(text: Textschluessel): Tourschritt {
  return { ziel: null, ersatzMitte: true, text };
}

function tour(titel: Textschluessel, schritte: readonly Tourschritt[]): Tour {
  return { titel, schritte };
}

// Gemeinsame Schritte der Trainer: vorn der Ablauf, hinten die Runde (ohne 30-Minuten-Plan und
// Fehlerdatenbank, die keine Runden haben).
const ANFANG = ziel("trainer-ablauf", "tour.trainer.ablauf");
const STUFE = ziel("trainer-wahl", "tour.trainer.stufe");
const WIEDERHOLEN = ziel("trainer-wiederholen", "tour.trainer.wiederholen");
const RUNDE: readonly Tourschritt[] = [
  ziel("runde-stand", "tour.trainer.runde", true),
  mitte("tour.trainer.sammeln"),
  mitte("tour.trainer.ende"),
];

// Eine Zeile je Schritt; die Texte stehen in de.json und en.json unter „tour.…“.
export const TOUREN: Readonly<Record<TourKennung, Tour>> = {
  haupt: tour("tour.titel.haupt", [
    mitte("tour.haupt.willkommen"),
    ziel("leiste-buch", "tour.haupt.buch"),
    ziel("leiste-training", "tour.haupt.training"),
    ziel("leiste-spielen", "tour.haupt.spielen"),
    ziel("leiste-nachschlagen", "tour.haupt.nachschlagen"),
    ziel("leiste-einstellungen", "tour.haupt.einstellungen"),
    ziel("tour-symbol", "tour.haupt.symbol", true),
    mitte("tour.haupt.los"),
  ]),
  buch: tour("tour.titel.buch", [
    ziel("buch-nummer", "tour.buch.nummer"),
    ziel("buch-zuletzt", "tour.buch.zuletzt"),
    ziel("buch-kapitel", "tour.buch.kapitel"),
    mitte("tour.buch.rundgang"),
  ]),
  kapitel: tour("tour.titel.kapitel", [
    ziel("kapitel-fortschritt", "tour.kapitel.fortschritt"),
    ziel("kapitel-trainer", "tour.kapitel.trainer"),
    ziel("kapitel-uebungen", "tour.kapitel.uebungen"),
    ziel("kapitel-galerie", "tour.kapitel.galerie"),
    ziel("kapitel-abhaken", "tour.kapitel.abhaken"),
  ]),
  abbildung: tour("tour.titel.abbildung", [
    ziel("abbildung-nummer", "tour.abbildung.nummer"),
    ziel("abbildung-blaettern", "tour.abbildung.blaettern"),
    ziel("zugleiste", "tour.abbildung.zugleiste"),
    ziel("brett", "tour.abbildung.brett"),
    ziel("brett-werkzeuge", "tour.abbildung.werkzeugsymbole"),
    ziel("brett-drehen", "tour.abbildung.drehen"),
    ziel("brett-sammeln", "tour.abbildung.sammeln"),
    ziel("selbstdenken", "tour.abbildung.selbstdenken"),
    ziel("werkzeugleiste", "tour.abbildung.buendel"),
    ziel("reiterleiste", "tour.abbildung.reiter"),
    ziel("werkzeugkarte", "tour.abbildung.karte", true),
    ziel("warumfragen", "tour.abbildung.warum"),
    ziel("gegen-engine", "tour.abbildung.engine"),
    ziel("unterschrift", "tour.abbildung.unterschrift"),
  ]),
  uebung: tour("tour.titel.uebung", [
    ziel("uebung-auftrag", "tour.uebung.auftrag"),
    ziel("uebung-hilfe", "tour.uebung.hilfe", true),
    ziel("uebung-einschaetzen", "tour.uebung.einschaetzen", true),
    ziel("uebung-weiter", "tour.uebung.weiter", true),
  ]),
  training: tour("tour.titel.training", [
    ziel("training-faellig", "tour.training.faellig"),
    ziel("training-sammlung", "tour.training.sammlung"),
    ziel("training-website", "tour.training.website"),
    ziel("training-kapitel", "tour.training.kapitel"),
  ]),
  "trainer.koordinaten": tour("trainer.koordinaten.name", [
    ANFANG,
    ziel("trainer-wahl", "tour.trainer.koordinaten.wahl"),
    mitte("tour.trainer.koordinaten.notation"),
    ...RUNDE,
  ]),
  "trainer.roentgen": tour("trainer.roentgen.name", [
    ANFANG,
    mitte("tour.trainer.roentgen.schritte"),
    mitte("tour.trainer.roentgen.pfeile"),
    ...RUNDE,
  ]),
  "trainer.zaehlen": tour("trainer.zaehlen.name", [
    ANFANG,
    ziel("trainer-wahl", "tour.trainer.zaehlen.wahl"),
    mitte("tour.trainer.zaehlen.bilanz"),
    ...RUNDE,
  ]),
  "trainer.repertoire": tour("trainer.repertoire.name", [
    ANFANG,
    ziel("trainer-wahl", "tour.trainer.repertoire.wahl"),
    mitte("tour.trainer.repertoire.ziehen"),
    ...RUNDE,
  ]),
  "trainer.zielbilanz": tour("trainer.zielbilanz.name", [
    ANFANG,
    mitte("tour.trainer.zielbilanz.ausfuellen"),
    ...RUNDE,
  ]),
  "trainer.abweichung": tour("trainer.abweichung.name", [
    ANFANG,
    ziel("trainer-wahl", "tour.trainer.abweichung.wahl"),
    mitte("tour.trainer.abweichung.antworten"),
    ...RUNDE,
  ]),
  "trainer.faktorenbilanz": tour("trainer.faktorenbilanz.name", [
    ANFANG,
    mitte("tour.trainer.faktorenbilanz.waage"),
    ...RUNDE,
  ]),
  "trainer.falle": tour("trainer.falle.name", [
    ANFANG,
    STUFE,
    WIEDERHOLEN,
    mitte("tour.trainer.falle.entscheiden"),
    ...RUNDE,
  ]),
  "trainer.struktur": tour("trainer.struktur.name", [
    ANFANG,
    ziel("trainer-wahl", "tour.trainer.struktur.stufen"),
    WIEDERHOLEN,
    mitte("tour.trainer.struktur.schritte"),
    ...RUNDE,
  ]),
  "trainer.planbilanz": tour("trainer.planbilanz.name", [
    ANFANG,
    ziel("trainer-wahl", "tour.trainer.planbilanz.wahl"),
    mitte("tour.trainer.planbilanz.ablaufArten"),
    ...RUNDE,
  ]),
  "trainer.taktik": tour("trainer.taktik.name", [
    ANFANG,
    ziel("trainer-wahl", "tour.trainer.taktik.wahl"),
    WIEDERHOLEN,
    mitte("tour.trainer.taktik.hilfen"),
    mitte("tour.trainer.taktik.motiv"),
    ...RUNDE,
  ]),
  "trainer.endspiel": tour("trainer.endspiel.name", [
    ANFANG,
    ziel("trainer-wahl", "tour.trainer.endspiel.wahl"),
    WIEDERHOLEN,
    ziel("endspiel-kurz", "tour.trainer.endspiel.kurz"),
    mitte("tour.trainer.endspiel.spielen"),
    ...RUNDE,
  ]),
  "trainer.studien": tour("trainer.studien.name", [
    ANFANG,
    mitte("tour.trainer.studien.ziehen"),
    ...RUNDE,
  ]),
  "trainer.zugErraten": tour("trainer.zugErraten.name", [
    ANFANG,
    ziel("trainer-wahl", "tour.trainer.zugErraten.wahl"),
    mitte("tour.trainer.zugErraten.raten"),
    mitte("tour.trainer.zugErraten.werkzeuge"),
    ...RUNDE,
  ]),
  "trainer.dreissigMinuten": tour("trainer.dreissigMinuten.name", [
    ANFANG,
    ziel("trainer-wahl", "tour.trainer.dreissigMinuten.plan"),
    mitte("tour.trainer.dreissigMinuten.einheit"),
  ]),
  "trainer.fehlerdatenbank": tour("trainer.fehlerdatenbank.name", [
    ANFANG,
    ziel("fehler-auswertung", "tour.trainer.fehlerdatenbank.auswertung"),
    ziel("fehler-neu", "tour.trainer.fehlerdatenbank.neu"),
    ziel("fehler-eintraege", "tour.trainer.fehlerdatenbank.eintraege"),
  ]),
  "trainer.denkroutine": tour("trainer.denkroutine.name", [
    ANFANG,
    mitte("tour.trainer.denkroutine.minute"),
    ...RUNDE,
  ]),
  lernsammlung: tour("tour.titel.lernsammlung", [
    ziel("sammlung-einleitung", "tour.lernsammlung.einleitung"),
    ziel("sammlung-abfragen", "tour.lernsammlung.abfragen"),
    ziel("sammlung-gruppe", "tour.lernsammlung.gruppen"),
    ziel("sammlung-pgn", "tour.lernsammlung.pgn"),
    ziel("sammlung-neu", "tour.lernsammlung.neu"),
  ]),
  nachschlagen: tour("tour.titel.nachschlagen", [
    ziel("nachschlagen-glossar", "tour.nachschlagen.glossar"),
    ziel("nachschlagen-denkroutine", "tour.nachschlagen.denkroutine"),
    ziel("nachschlagen-checkliste", "tour.nachschlagen.checkliste"),
    ziel("nachschlagen-steckbriefe", "tour.nachschlagen.steckbriefe"),
    ziel("nachschlagen-werkzeuge", "tour.nachschlagen.werkzeuge"),
  ]),
  glossar: tour("tour.titel.glossar", [
    ziel("glossar-suche", "tour.glossar.suche"),
    ziel("glossar-buchstaben", "tour.glossar.buchstaben"),
    ziel("glossar-liste", "tour.glossar.liste"),
  ]),
  begriff: tour("tour.titel.begriff", [ziel("begriff-karte", "tour.begriff.karte")]),
  denkroutine: tour("tour.titel.denkroutine", [
    ziel("denkroutine-schritte", "tour.denkroutine.schritte"),
    ziel("denkroutine-phasen", "tour.denkroutine.phasen"),
  ]),
  checkliste: tour("tour.titel.checkliste", [
    ziel("checkliste-stand", "tour.checkliste.stand"),
    ziel("checkliste-karte", "tour.checkliste.karte"),
  ]),
  steckbriefe: tour("tour.titel.steckbriefe", [
    ziel("steckbrief-eroeffnungen", "tour.steckbriefe.eroeffnungen"),
    ziel("steckbrief-fallen", "tour.steckbriefe.fallen"),
  ]),
  werkzeuge: tour("tour.titel.werkzeuge", [ziel("werkzeuge-kapitel", "tour.werkzeuge.kapitel")]),
  // Teil B (P8-44, 24.10.2026): Spielen, Partie mit Auswertung und Rückblick. Schritte, deren Ziel
  // gerade fehlt (etwa das Gitter der eigenen Bots, die Auswertung vor dem Partieende), überspringt
  // die Tour.
  spielen: tour("tour.titel.spielen", [
    ziel("spielen-laufend", "tour.spielen.laufend"),
    // Reihenfolge wie auf dem Bildschirm seit DS51 (0.2.130): Gegner, Einstellungen, Stellung.
    ziel("spielen-gegner", "tour.spielen.gegner"),
    ziel("spielen-sprechblase", "tour.spielen.sprechblase"),
    ziel("spielen-gitter", "tour.spielen.gitter"),
    ziel("spielen-eigene", "tour.spielen.eigene"),
    ziel("spielen-einstellungen", "tour.spielen.einstellungen"),
    ziel("spielen-hilfen", "tour.spielen.hilfen"),
    ziel("spielen-eroeffnung", "tour.spielen.eroeffnung"),
    ziel("spielen-start", "tour.spielen.start"),
    ziel("spielen-beginnen", "tour.spielen.beginnen"),
    ziel("spielen-spielstaerke", "tour.spielen.spielstaerke"),
    ziel("spielen-partien", "tour.spielen.partien"),
    ziel("spielen-filter", "tour.spielen.filter"),
  ]),
  partie: tour("tour.titel.partie", [
    ziel("partie-zuege", "tour.partie.zuege"),
    ziel("partie-uhr", "tour.partie.uhr"),
    ziel("brett", "tour.partie.brett"),
    ziel("partie-ruhig", "tour.partie.ruhig"),
    ziel("partie-werkzeuge", "tour.partie.werkzeuge"),
    ziel("partie-status", "tour.partie.status"),
    ziel("partie-ende", "tour.partie.ende"),
    ziel("auswertung", "tour.partie.auswertung"),
    ziel("auswertung-kurve", "tour.partie.kurve"),
    ziel("auswertung-staerke", "tour.partie.staerke"),
    ziel("auswertung-abweichung", "tour.partie.abweichung"),
    ziel("auswertung-patzer", "tour.partie.patzer"),
    ziel("rueckblick-karte", "tour.partie.rueckblick"),
    ziel("auswertung-pgn", "tour.partie.pgn"),
  ]),
  ich: tour("tour.titel.ich", [
    ziel("einstellungen-wertung", "tour.ich.wertung"),
    ziel("einstellungen-fortschritt", "tour.ich.fortschritt"),
    ziel("einstellungen-reiter-brett", "tour.ich.reiterBrett"),
    ziel("einstellungen-reiter-figuren", "tour.ich.reiterFiguren"),
    ziel("einstellungen-reiter-anzeige", "tour.ich.reiterAnzeige"),
    ziel("einstellungen-reiter-ton", "tour.ich.reiterTon"),
    ziel("einstellungen-reiter-training", "tour.ich.reiterTraining"),
    ziel("einstellungen-daten", "tour.ich.daten"),
    ziel("einstellungen-ueber", "tour.ich.ueber"),
  ]),
};

/**
 * Die Tour zum gezeigten Bildschirm, oder null, wenn es für ihn keine gibt.
 *
 * Beispiele: Abbildung 1.26 → „abbildung“; Trainer „taktik“ → „trainer.taktik“; Spielen →
 * „spielen“ (seit Teil B); Lizenzen und Aufgabenseite → null (selbsterklärend).
 */
export function tourFuerAnsicht(ansicht: Ansicht): TourKennung | null {
  switch (ansicht.bildschirm) {
    case "trainer":
      return `trainer.${ansicht.kennung}`;
    case "buch":
    case "kapitel":
    case "abbildung":
    case "uebung":
    case "training":
    case "lernsammlung":
    case "nachschlagen":
    case "glossar":
    case "begriff":
    case "denkroutine":
    case "checkliste":
    case "steckbriefe":
    case "werkzeuge":
    case "ich":
    case "spielen":
    case "partie":
      return ansicht.bildschirm;
    case "lizenzen":
    case "autoraufgaben":
      return null;
  }
}
