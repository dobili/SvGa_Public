/**
 * Änderungen am Zugbaum einer Variante: Zug anhängen, zur Hauptvariante machen, ab hier löschen,
 * Zugzeichen und Kommentar setzen.
 *
 * Rolle im Gesamtbild: Die Bedienung des Bildschirms „Variante“ (Ziehen, Menü am Zug,
 * Kommentarzeile) ruft nur diese reinen Funktionen; sie geben einen neuen Baum zurück und lassen
 * den alten unverändert (für „Rückgängig“). Gelesen wird der Baum in schach/variationsbaum.ts.
 * Abhängigkeiten: chessops (Zug prüfen), schach/variationsbaum.ts, training/variationen.ts.
 * Buchbezug: Kapitel 0, „Wie liest man Schachzüge?“ (Haupt- und Nebenvariante, Zugzeichen).
 */
import { makeSan, parseSan } from "chessops/san";
import {
  HOECHSTENS_FORTSETZUNGEN,
  type Variationsknoten,
  type Zugzeichen,
} from "../training/variationen";
import {
  fenAm,
  fortsetzungenAm,
  pfadImBaum,
  stellungAus,
  type Pfad,
  type Zugbaum,
} from "./variationsbaum";

type Knotenliste = readonly Variationsknoten[];

/**
 * Ersetzt den Knoten am Ende des Pfades durch das Ergebnis von ``aenderung``; null entfernt ihn.
 * Ausgabe: neue Liste der ersten Züge, oder null, wenn der Pfad nicht im Baum steht.
 */
function ersetzeAm(
  zuege: Knotenliste,
  pfad: Pfad,
  aenderung: (knoten: Variationsknoten) => Variationsknoten | null,
): Knotenliste | null {
  const [kopf, ...rest] = pfad;
  const stelle = zuege.findIndex((k) => k.zug === kopf);
  const alt = zuege[stelle];
  if (!alt) return null;
  let neu: Variationsknoten | null;
  if (rest.length === 0) neu = aenderung(alt);
  else {
    const weiter = ersetzeAm(alt.weiter, rest, aenderung);
    if (!weiter) return null;
    neu = { ...alt, weiter };
  }
  if (neu === null) return zuege.filter((_, i) => i !== stelle);
  return zuege.map((k, i) => (i === stelle ? neu : k));
}

/** Ergebnis von mitFortsetzung. */
export type Zugergebnis =
  /** Der Zug war neu und hängt jetzt als letzte Fortsetzung an. */
  | { readonly art: "neu"; readonly zuege: Knotenliste; readonly pfad: Pfad }
  /** Den Zug gab es an dieser Stelle schon; die App springt hinein. */
  | { readonly art: "vorhanden"; readonly pfad: Pfad }
  /** HOECHSTENS_FORTSETZUNGEN erreicht (die App meldet es). */
  | { readonly art: "voll" }
  /** Pfad nicht im Baum oder Zug in der Stellung nicht möglich. */
  | { readonly art: "ungueltig" };

/**
 * Hängt einen Zug an der Stelle ``pfad`` an.
 *
 * Warum: „Gibt es den Zug an dieser Stelle schon, springt die App hinein. Sonst wird er als neue
 * Fortsetzung hinten angehängt (nie automatisch Hauptvariante)“ (Entwurf, Abschnitt 3).
 * Eingaben: Baum, Pfad, Zug (englische Kurznotation), Herkunft (fehlt: eigener Zug).
 * Beispiel aus dem Buch: Abb. 2.40 nach 3. Sxe5 mit der Buchfortsetzung 3... d6; „Sxe4“ → neu,
 * zweite Fortsetzung, Pfad endet auf „Nxe4“.
 * Sonderfall: Der Zug wird in die Schreibweise von chessops gebracht („Ng1f3“ → „Nf3“).
 */
export function mitFortsetzung(
  baum: Zugbaum,
  pfad: Pfad,
  zug: string,
  herkunft?: Variationsknoten["herkunft"],
): Zugergebnis {
  const fen = fenAm(baum, pfad);
  const pos = fen ? stellungAus(fen) : null;
  const gelesen = pos ? parseSan(pos, zug) : undefined;
  if (!pos || !gelesen) return { art: "ungueltig" };
  const san = makeSan(pos, gelesen);
  const vorhanden = fortsetzungenAm(baum, pfad);
  if (vorhanden.some((k) => k.zug === san)) return { art: "vorhanden", pfad: [...pfad, san] };
  if (vorhanden.length >= HOECHSTENS_FORTSETZUNGEN) return { art: "voll" };
  const knoten: Variationsknoten = { zug: san, weiter: [], ...(herkunft ? { herkunft } : {}) };
  const zuege =
    pfad.length === 0
      ? [...baum.zuege, knoten]
      : ersetzeAm(baum.zuege, pfad, (k) => ({ ...k, weiter: [...k.weiter, knoten] }));
  return zuege ? { art: "neu", zuege, pfad: [...pfad, san] } : { art: "ungueltig" };
}

/** Rückt den Zug ``pfad[0]`` in der Liste nach vorn, ebenso jeden weiteren Zug des Pfades. */
function nachVorn(zuege: Knotenliste, pfad: Pfad): Knotenliste {
  const [kopf, ...rest] = pfad;
  const knoten = zuege.find((k) => k.zug === kopf);
  if (!knoten) return zuege;
  const neu = rest.length > 0 ? { ...knoten, weiter: nachVorn(knoten.weiter, rest) } : knoten;
  return [neu, ...zuege.filter((k) => k.zug !== kopf)];
}

/**
 * Macht die Linie bis ``pfad`` zur Hauptvariante: An jeder Stelle des Weges rückt dieser Zug an
 * die erste Stelle; die bisherigen Hauptzüge werden Nebenvarianten.
 * Beispiel: Petroff 3... d6 (Haupt) und 3... Sxe4?! → Pfad bis „Nxe4“ → 3... Sxe4?! zuerst.
 */
export function alsHauptvariante(baum: Zugbaum, pfad: Pfad): Knotenliste {
  return pfadImBaum(baum, pfad) ? nachVorn(baum.zuege, pfad) : baum.zuege;
}

/**
 * Löscht den Zug am Ende des Pfades und alles danach („Ab hier löschen“).
 * Ausgabe: neuer Baum und der Pfad davor (dorthin springt die Anzeige); bei fremdem Pfad bleibt
 * alles, wie es ist.
 */
export function ohneAbHier(baum: Zugbaum, pfad: Pfad): { zuege: Knotenliste; pfad: Pfad } {
  const zuege = pfad.length > 0 ? ersetzeAm(baum.zuege, pfad, () => null) : null;
  return zuege ? { zuege, pfad: pfad.slice(0, -1) } : { zuege: baum.zuege, pfad };
}

/** Was sich an einem Zug ändern lässt; ein leerer Text oder null entfernt den Eintrag. */
export interface Zugaenderung {
  readonly kommentar?: string;
  readonly zeichen?: Zugzeichen | null;
}

/** Ein Knoten mit geändertem Kommentar oder Zugzeichen; leere Einträge fallen ganz weg. */
function geaenderterKnoten(k: Variationsknoten, teil: Zugaenderung): Variationsknoten {
  const { kommentar, zeichen, ...rest } = k;
  const neuerKommentar = teil.kommentar ?? kommentar ?? "";
  const neuesZeichen = teil.zeichen === undefined ? zeichen : teil.zeichen;
  return {
    ...rest,
    ...(neuerKommentar !== "" ? { kommentar: neuerKommentar } : {}),
    ...(neuesZeichen ? { zeichen: neuesZeichen } : {}),
  };
}

/**
 * Setzt Kommentar oder Zugzeichen des Zuges am Ende des Pfades.
 * Beispiel: Pfad bis „Qe2“, { zeichen: "!" } → 4. De2!; { zeichen: null } nimmt es wieder weg.
 * Sonderfall: Der leere Pfad (Startstellung) hat keinen Zug; dafür gibt es `start` der Variante.
 */
export function mitZugdaten(baum: Zugbaum, pfad: Pfad, teil: Zugaenderung): Knotenliste {
  if (pfad.length === 0) return baum.zuege;
  return ersetzeAm(baum.zuege, pfad, (k) => geaenderterKnoten(k, teil)) ?? baum.zuege;
}

/**
 * Ersetzt die Daten der Stellung nach ``pfad`` (Marken, Nummerntexte) durch ``aenderung``.
 * Stufe 2 (Stift): Die Marken gehören zur Stellung, also zum Knoten des Zuges davor.
 * Sonderfall: Der leere Pfad (Startstellung) hat keinen Knoten; dafür gibt es `start`.
 */
export function mitKnotendaten(
  baum: Zugbaum,
  pfad: Pfad,
  aenderung: (knoten: Variationsknoten) => Variationsknoten,
): Knotenliste {
  if (pfad.length === 0) return baum.zuege;
  return ersetzeAm(baum.zuege, pfad, aenderung) ?? baum.zuege;
}

/** Ergebnis von mitLinie: der neue Baum, der Pfad am Ende und der Pfad des ersten neuen Zuges. */
export interface Linienergebnis {
  readonly zuege: Knotenliste;
  readonly pfad: Pfad;
  /** Pfad bis zum ersten Zug, den es vorher nicht gab; null, wenn alle schon da waren. */
  readonly ersterNeuer: Pfad | null;
  /** Abgebrochen, weil eine Stellung schon voll war oder ein Zug nicht ging. */
  readonly abgebrochen: boolean;
}

/**
 * Hängt eine ganze Zugfolge ab ``pfad`` an; vorhandene Züge werden nur durchlaufen.
 * Beispiel: eigene Züge an der Abbildung („Als Variante speichern“) oder die Folge „Besser war …“
 * der Engine. Eingaben wie mitFortsetzung, dazu die Züge in Reihenfolge.
 */
export function mitLinie(
  baum: Zugbaum,
  pfad: Pfad,
  sans: readonly string[],
  herkunft?: Variationsknoten["herkunft"],
): Linienergebnis {
  let stand: Linienergebnis = { zuege: baum.zuege, pfad, ersterNeuer: null, abgebrochen: false };
  for (const san of sans) {
    const jetzt = { startFen: baum.startFen, zuege: stand.zuege };
    const ergebnis = mitFortsetzung(jetzt, stand.pfad, san, herkunft);
    if (ergebnis.art === "voll" || ergebnis.art === "ungueltig") {
      return { ...stand, abgebrochen: true };
    }
    const neu = ergebnis.art === "neu";
    stand = {
      zuege: neu ? ergebnis.zuege : stand.zuege,
      pfad: ergebnis.pfad,
      ersterNeuer: stand.ersterNeuer ?? (neu ? ergebnis.pfad : null),
      abgebrochen: false,
    };
  }
  return stand;
}
