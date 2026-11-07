/**
 * Der Satz einer Finde-Kategorie (F1 bis F10) für die Karte: aus Kennung und Details der
 * Erkennung (analyse/findekategorien.ts) werden Textschlüssel, Werte und das Thema für „Üben“.
 *
 * Rolle im Gesamtbild: Die Erkennungsschicht liefert nur Kennung und Details („Nc7+“, Motiv
 * „gabel“, Feld „c7“); die Findezeile der Zeitleiste und des Rückblicks
 * (ui/komponenten/auswertung/buchzeilen.ts) braucht dazu einen Satz in der Du-Form und das Thema
 * des Trainers. Die Sätze sagen „hätte“ und „Dazu passt“, nie „Die Engine spielt das wegen …“
 * (Konzept docs/KONZEPT_FEHLER_BUCHBEZUG.md, Abschnitt 5, Grenze 1).
 * Rein: keine Engine, kein Speicher.
 * Abhängigkeiten: analyse/findekategorien.ts (Typen), analyse/texte.ts, schach/stellung.ts,
 * training/taktikmotivwahl.ts, spiel/buchbezug.ts, i18n.
 * Buchbezug: Kapitel 1, 2, 6, 7 und 8 (je Kategorie unten).
 */
import type { Findedetails, Findetreffer } from "../analyse/findekategorien";
import { zugtext } from "../analyse/texte";
import { t, tZahl, type Textschluessel, type Textwerte } from "../i18n/sprache";
import { ROLLENBUCHSTABE } from "../schach/stellung";
import { GRUNDMOTIV_JE_MOTIV } from "../training/taktikmotivwahl";
import { BUCHBEZUG, type Findekennung } from "./buchbezug";

/** Satz, Werte und Thema einer Findezeile. */
export interface Findesatz {
  readonly text: Textschluessel;
  readonly werte: Textwerte;
  /** Thema für „Üben“ (ui/trainer/trainerthema.ts); sonst das der Tabelle oder null. */
  readonly thema: string | null;
}

type Satzbau = (d: Findedetails) => Findesatz;

/** Satz mit dem Thema der Tabelle (spiel/buchbezug.ts). */
function satz(kennung: Findekennung, text: Textschluessel, werte: Textwerte): Findesatz {
  return { text, werte, thema: BUCHBEZUG[kennung].thema };
}

/** Der beste Zug in der Sprache des Buches („Sc7+“). */
function zug(d: Findedetails): string {
  return zugtext(d.zug);
}

/** F1 Matt war möglich (Kapitel 7, Mattbilder): Matt in n, mit Mattbild, wenn eines passt. */
const f1: Satzbau = (d) => {
  const werte = { zug: zug(d), mattIn: d.mattIn ?? 1 };
  // „matt“ ist kein eigenes Bild, nur das allgemeine Matt (schach/mattbilder.ts).
  if (d.mattbild && d.mattbild !== "matt") {
    const bild = t(`mattbild.${d.mattbild}`);
    return satz("F1", "buchbezug.F1.textBild", { ...werte, mattbild: bild });
  }
  return satz("F1", d.mattIn === 1 ? "buchbezug.F1.textEins" : "buchbezug.F1.text", werte);
};

/** F2 Rettung (Kapitel 7, Motiv 12): Dauerschach oder Patt. */
const f2: Satzbau = (d) =>
  satz("F2", d.motiv === "patt" ? "buchbezug.F2.textPatt" : "buchbezug.F2.text", { zug: zug(d) });

/** F3 Motiv im besseren Zug (Kapitel 7): Grundmotiv mit Namen und Thema, sonst „Kombination“. */
const f3: Satzbau = (d) => {
  const motiv = d.motiv;
  if (!motiv || motiv === "kombination")
    return satz("F3", "buchbezug.F3.textKombi", { zug: zug(d) });
  return {
    text: "buchbezug.F3.text",
    werte: { zug: zug(d), motiv: t(`motiv.name.${motiv}`) },
    thema: `taktik:${GRUNDMOTIV_JE_MOTIV[motiv]}`,
  };
};

/** F4 Guter Schlag ausgelassen (Kapitel 1, Zählen); Sonderfall „nicht zurückgeschlagen“. */
const f4: Satzbau = (d) =>
  satz("F4", d.zurueckschlagen ? "buchbezug.F4.textZurueck" : "buchbezug.F4.text", {
    zug: zug(d),
    feld: d.feld ?? "",
  });

/** Texte je Art des erzwingenden Zuges (F5). */
const F5_TEXT: Readonly<Record<NonNullable<Findedetails["art"]>, Textschluessel>> = {
  schach: "buchbezug.F5.textSchach",
  schlag: "buchbezug.F5.textSchlag",
  drohung: "buchbezug.F5.textDrohung",
};

/** F5 Schach, Schlag oder Drohung zuerst (Kapitel 1, Schach-Röntgen-Regel). */
const f5: Satzbau = (d) => satz("F5", F5_TEXT[d.art ?? "schach"], { zug: zug(d) });

/** F6 Opposition oder Schlüsselfeld (Kapitel 8, Regel 2), mit dem Thema des Endspieltrainers. */
const f6: Satzbau = (d) => {
  if (d.idee === "schluesselfeld") {
    const werte = { zug: zug(d), feld: d.feld ?? "" };
    return { text: "buchbezug.F6.textFeld", werte, thema: "endspiel:schluesselfelder" };
  }
  return satz("F6", "buchbezug.F6.text", { zug: zug(d) });
};

/** F7 Freibauer, Umwandlung oder Quadrat (Kapitel 8, Regel des Quadrats). */
const f7: Satzbau = (d) => {
  const werte = { zug: zug(d), feld: d.feld ?? "" };
  if (d.idee === "quadrat") return satz("F7", "buchbezug.F7.textQuadrat", werte);
  const text = d.idee === "umwandlung" ? "buchbezug.F7.textUmwandlung" : "buchbezug.F7.text";
  return { text, werte, thema: "endspiel:freibauer" };
};

/** F8 Buchzug deiner Eröffnung (Kapitel 2 und 3), mit dem Namen der Eröffnung, wenn bekannt. */
const f8: Satzbau = (d) => {
  const werte = { buchzug: zugtext(d.buchzug ?? d.zug) };
  if (!d.eroeffnung) return satz("F8", "buchbezug.F8.text", werte);
  return satz("F8", "buchbezug.F8.textName", { ...werte, eroeffnung: d.eroeffnung });
};

/** Texte je Eröffnungsziel (F9, Kapitel 1, drei Eröffnungsziele). */
const F9_TEXT: Readonly<Record<NonNullable<Findedetails["ziel"]>, Textschluessel>> = {
  rochade: "buchbezug.F9.textRochade",
  entwicklung: "buchbezug.F9.textEntwicklung",
  zentrum: "buchbezug.F9.textZentrum",
};

/** F9 Eröffnungsziel: Rochade, Entwicklung oder Zentrum. */
const f9: Satzbau = (d) => satz("F9", F9_TEXT[d.ziel ?? "entwicklung"], { zug: zug(d) });

/** F10 Am wenigsten aktive Figur (Kapitel 6, Frage 3), mit Zahl der freien Felder. */
const f10: Satzbau = (d) => {
  const figur = d.figur ? t(`figur.${ROLLENBUCHSTABE[d.figur]}`) : "";
  const freie = d.freieFelder ?? 0;
  const felder = tZahl("buchbezug.F10.felder", freie, { anzahl: freie });
  return satz("F10", "buchbezug.F10.text", { zug: zug(d), figur, feld: d.feld ?? "", felder });
};

const SATZBAU: Readonly<Record<Findekennung, Satzbau>> = {
  F1: f1,
  F2: f2,
  F3: f3,
  F4: f4,
  F5: f5,
  F6: f6,
  F7: f7,
  F8: f8,
  F9: f9,
  F10: f10,
};

/**
 * Der Satz zu einem Treffer der Finde-Kategorien.
 *
 * Warum: Die Karte soll in der Sprache des Buches sagen, mit welcher Idee der bessere Zug zu
 * finden war, und „Üben“ soll gleich das passende Thema öffnen (Konzept 4.1).
 * Eingabe: Treffer mit Kennung und Details. Ausgabe: Textschlüssel, Werte, Thema.
 * Beispiel: Abb. 7.47, F3 mit Motiv „gabel“ und Zug „Nc7+“ → „Mit Sc7+ ging ein Motiv aus
 * Kapitel 7: Gabel. …“, Thema „taktik:doppelangriff“.
 * Sonderfälle: fehlende Details → Satz ohne sie (leeres Feld), nie ein Fehler.
 */
export function findesatz(treffer: Findetreffer): Findesatz {
  return SATZBAU[treffer.kennung](treffer.details);
}
