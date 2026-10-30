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
  | "einstellungen"
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
// Trainer ohne Auswahl beginnen gleich mit der Runde; dort ist die Beschreibung ausgeblendet
// (uebung.css, DS6). Der Schritt steht dann in der Mitte und nennt, wo sie jederzeit steht
// (Befund der Tourprüfung, 25.10.2026).
const ANFANG_OHNE_WAHL = ziel("trainer-ablauf", "tour.trainer.ablaufMitte", true);
const STUFE = ziel("trainer-wahl", "tour.trainer.stufe");
const WIEDERHOLEN = ziel("trainer-wiederholen", "tour.trainer.wiederholen");
const RUNDE: readonly Tourschritt[] = [
  ziel("runde-stand", "tour.trainer.runde", true),
  mitte("tour.trainer.sammeln"),
  mitte("tour.trainer.ende"),
];

// Eine Zeile je Schritt; die Texte stehen in de.json und en.json unter „tour.…“.
/** Alle Rundgänge der App mit Titel und Schritten, nach Kennung. */
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
    ziel("trainer-wahl", "tour.trainer.roentgen.wahl"),
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
    ANFANG_OHNE_WAHL,
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
    ANFANG_OHNE_WAHL,
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
    ANFANG_OHNE_WAHL,
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
  "trainer.kurzplaene": tour("trainer.kurzplaene.name", [
    ANFANG,
    ziel("trainer-wahl", "tour.trainer.kurzplaene.plan"),
  ]),
  "trainer.fehlerdatenbank": tour("trainer.fehlerdatenbank.name", [
    ANFANG,
    ziel("fehler-auswertung", "tour.trainer.fehlerdatenbank.auswertung"),
    ziel("fehler-neu", "tour.trainer.fehlerdatenbank.neu"),
    ziel("fehler-eintraege", "tour.trainer.fehlerdatenbank.eintraege"),
  ]),
  "trainer.denkroutine": tour("trainer.denkroutine.name", [
    ANFANG_OHNE_WAHL,
    mitte("tour.trainer.denkroutine.minute"),
    ...RUNDE,
  ]),
  lernsammlung: tour("tour.titel.lernsammlung", [
    ziel("sammlung-einleitung", "tour.lernsammlung.einleitung"),
    ziel("sammlung-abfragen", "tour.lernsammlung.abfragen"),
    // Reihenfolge wie auf dem Bildschirm: PGN steht über den Gruppen.
    ziel("sammlung-pgn", "tour.lernsammlung.pgn"),
    ziel("sammlung-gruppe", "tour.lernsammlung.gruppen"),
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
    // Seit 0.2.139 steht „Deine Spielstärke“ wieder ganz oben über dem Gegner.
    ziel("spielen-spielstaerke", "tour.spielen.spielstaerke"),
    // Reihenfolge wie auf dem Bildschirm seit DS51 (0.2.131): Gegner, Einstellungen, Stellung.
    // Zuerst der Schalter Engine/Mensch; im Modus Mensch fehlen die folgenden Schritte zum Bot.
    ziel("spielen-gegnerart", "tour.spielen.gegnerart"),
    ziel("spielen-gegner", "tour.spielen.gegner"),
    ziel("spielen-sprechblase", "tour.spielen.sprechblase"),
    ziel("spielen-gitter", "tour.spielen.gitter"),
    ziel("spielen-eigene", "tour.spielen.eigene"),
    ziel("spielen-einstellungen", "tour.spielen.einstellungen"),
    ziel("spielen-hilfen", "tour.spielen.hilfen"),
    ziel("spielen-eroeffnung", "tour.spielen.eroeffnung"),
    ziel("spielen-start", "tour.spielen.start"),
    ziel("spielen-beginnen", "tour.spielen.beginnen"),
  ]),
  // Reihenfolge wie auf dem Bildschirm (Befund der Tourprüfung, 25.10.2026). Der Status gilt nur
  // während der Partie, Rückblick und Auswertung erst danach; beide zugleich gibt es nie.
  partie: tour("tour.titel.partie", [
    ziel("partie-zuege", "tour.partie.zuege"),
    ziel("partie-uhr", "tour.partie.uhr"),
    ziel("brett", "tour.partie.brett"),
    ziel("brett-werkzeuge", "tour.partie.brettwerkzeuge"),
    ziel("partie-ruhig", "tour.partie.ruhig"),
    ziel("partie-werkzeuge", "tour.partie.werkzeuge"),
    ziel("partie-status", "tour.partie.status"),
    ziel("rueckblick-karte", "tour.partie.rueckblick"),
    ziel("partie-ende", "tour.partie.ende"),
    ziel("auswertung", "tour.partie.auswertung"),
    ziel("auswertung-pgn", "tour.partie.pgn"),
    ziel("auswertung-kurve", "tour.partie.kurve"),
    ziel("auswertung-abweichung", "tour.partie.abweichung"),
    ziel("auswertung-patzer", "tour.partie.patzer"),
    ziel("auswertung-staerke", "tour.partie.staerke"),
  ]),
  // Profil (seit 0.2.134): Name und Porträt (seit 0.2.140), Knopf zu den Einstellungen, Wertung,
  // Fortschritt, Partien.
  ich: tour("tour.titel.ich", [
    ziel("profil-karte", "tour.ich.profilkarte"),
    ziel("profil-einstellungen", "tour.ich.einstellungen"),
    ziel("einstellungen-wertung", "tour.ich.wertung"),
    ziel("einstellungen-fortschritt", "tour.ich.fortschritt"),
    ziel("spielen-partien", "tour.spielen.partien"),
    ziel("spielen-filter", "tour.spielen.filter"),
  ]),
  einstellungen: tour("tour.titel.einstellungen", [
    ziel("einstellungen-reiter-brett", "tour.ich.reiterBrett"),
    ziel("einstellungen-reiter-bedienung", "tour.ich.reiterBedienung"),
    ziel("einstellungen-reiter-anzeige", "tour.ich.reiterAnzeige"),
    ziel("einstellungen-reiter-bots", "tour.ich.reiterBots"),
    ziel("einstellungen-reiter-hilfe", "tour.ich.reiterHilfe"),
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
    case "einstellungen":
    case "spielen":
    case "partie":
      return ansicht.bildschirm;
    case "lizenzen":
    case "autoraufgaben":
      return null;
  }
}
