/**
 * Werkzeug k7-erzwingend: Taktik, Schritt 2. Alle erzwingenden Züge der eigenen Seite in
 * Rechenreihenfolge: Schachs, dann Schläge, dann Drohungen, nummeriert als Kandidaten.
 *
 * Rolle im Gesamtbild: Pflichtenheft 6.3 („Alle erzwingenden Züge, sortiert: Schachs, dann
 * Schläge, dann Drohungen. Gold: Kandidaten, nummeriert in Rechenreihenfolge. E.“).
 * Abhängigkeiten: stellungsprofil.ts (erzwingend), schach/drohungen.ts, i18n.
 * Buchbezug: Kapitel 7, „Schritt 2: Was rechnest du zuerst?“ (Abb. 7.11: zwei Kandidaten Sd6++
 * und Sf6++) und die fünf Abwehrfragen aus Schritt 3, wenn der Gegner droht.
 */
import type { Color } from "chessops/types";
import { t } from "../i18n/sprache";
import {
  erzwingendeZuege,
  nullzug,
  type Drohung,
  type ErzwingendeZuege,
  type Zugangabe,
} from "../schach/drohungen";
import { feldname, type Stellung } from "../schach/stellung";
import { profil } from "./stellungsprofil";
import { farbname, zugtext } from "./texte";
import type { Befund, Markierung, Werkzeug, Werkzeugergebnis } from "./werkzeug";

/** So viele Kandidaten bekommen eine Nummer am Brett (mehr wird unlesbar). */
const HOECHSTENS_NUMMERN = 12;

/** Ein nummerierter Kandidat. */
export interface Kandidat {
  readonly nummer: number;
  readonly zug: Zugangabe;
  readonly art: "schach" | "schlag" | "drohung";
  readonly zusatz: string;
}

function drohungstext(d: Drohung): string {
  return d.art === "matt"
    ? t("erzwingend.droht.matt", { zug: zugtext(d.zug.san) })
    : t("erzwingend.droht.material", { zug: zugtext(d.zug.san), bilanz: d.zug.bilanz });
}

/** Die Kandidaten in Rechenreihenfolge (Kapitel 7: Schachs, Schläge, Drohungen). */
function kandidaten(e: ErzwingendeZuege): Kandidat[] {
  const liste: Kandidat[] = [];
  const schachzuege = new Set(e.schachs.map((s) => s.uci));
  for (const s of e.schachs)
    liste.push({ nummer: liste.length + 1, zug: s, art: "schach", zusatz: "" });
  for (const s of e.schlaege) {
    if (schachzuege.has(s.uci)) continue;
    liste.push({
      nummer: liste.length + 1,
      zug: s,
      art: "schlag",
      zusatz: t("erzwingend.bilanz", { bilanz: s.bilanz }),
    });
  }
  for (const d of e.drohende) {
    if (schachzuege.has(d.uci)) continue;
    liste.push({
      nummer: liste.length + 1,
      zug: d,
      art: "drohung",
      zusatz: t("erzwingend.drohtDann", { drohungen: d.drohungen.map(drohungstext).join(", ") }),
    });
  }
  return liste;
}

function befundFuer(art: Kandidat["art"], liste: readonly Kandidat[]): Befund {
  const eigene = liste.filter((k) => k.art === art);
  return {
    kennung: art,
    art: "E",
    titel: t(`erzwingend.${art}`),
    zeilen:
      eigene.length > 0
        ? eigene.map((k) =>
            t("erzwingend.kandidat", {
              nummer: k.nummer,
              zug: zugtext(k.zug.san),
              zusatz: k.zusatz,
            }),
          )
        : [t("erzwingend.keine")],
    farbe: "gold",
  };
}

/**
 * Kürzel der Zugart hinter der Nummer am Zielfeld (seit 0.2.32, Wunsch des Autors): Die Pfeile
 * bleiben gold wie im Buch, die Art steht als Zeichen daneben. Regel: Kapitel 7, Schritt 2
 * („Rechne sie in dieser Reihenfolge: Schachs, Schläge, Drohungen“).
 */
const KUERZEL: Readonly<Record<Kandidat["art"], string>> = {
  schach: "+",
  schlag: "x",
  drohung: "D",
};

/**
 * Wie die Engine einen Kandidaten eingestuft hat (seit 0.2.33, Vorschlag B1): der beste
 * (gold mit „!“) oder verworfen, weil er bis zur Ruhe nichts gewinnt (grau wie bei Röntgen die
 * Schläge ohne Gewinn). Ohne Einstufung bleibt der Kandidat gold.
 */
export type Einstufung = "bester" | "verworfen";

/** Zeichen hinter dem besten Kandidaten, wie das Buch gute Züge auszeichnet. */
const BESTER_ZEICHEN = "!";

/**
 * Gold: Pfeile aller Kandidaten und auf den Zielfeldern Nummer und Kürzel der Zugart, mehrere als
 * „1+·3x“. Hat die Engine gerechnet, steht hinter dem besten „!“ und verworfene werden grau.
 * Beispiel: Abb. 7.14 → h8 „2+“ (2. Kandidat, ein Schach); nach der Engine „2+!“, e8 grau „1+“.
 */
export function kandidatenMarkierungen(
  liste: readonly Kandidat[],
  einstufung: ReadonlyMap<number, Einstufung> = new Map(),
): Markierung[] {
  const gezeigt = liste.slice(0, HOECHSTENS_NUMMERN);
  const farbe = (k: Kandidat) => (einstufung.get(k.nummer) === "verworfen" ? "grau" : "gold");
  const pfeile: Markierung[] = gezeigt.map((k) => ({
    typ: "pfeil",
    farbe: farbe(k),
    von: feldname(k.zug.von),
    nach: feldname(k.zug.nach),
  }));
  const felder = new Map<string, { texte: string[]; gold: boolean }>();
  for (const k of gezeigt) {
    const feld = feldname(k.zug.nach);
    const alt = felder.get(feld) ?? { texte: [], gold: false };
    const zeichen = einstufung.get(k.nummer) === "bester" ? BESTER_ZEICHEN : "";
    felder.set(feld, {
      texte: [...alt.texte, `${k.nummer}${KUERZEL[k.art]}${zeichen}`],
      gold: alt.gold || farbe(k) === "gold",
    });
  }
  const beschriftungen: Markierung[] = [...felder].map(([feld, f]) => ({
    typ: "feld",
    farbe: f.gold ? "gold" : "grau",
    feld,
    text: f.texte.join("·"),
  }));
  return [...pfeile, ...beschriftungen];
}

/** Die Abwehrfragen, wenn die eigene Seite im Schach steht (Kapitel 7, Schritt 3). */
function imSchach(eigen: Color): Werkzeugergebnis {
  return {
    werkzeug: "k7-erzwingend",
    art: "E",
    ueberschrift: t("erzwingend.titel"),
    befunde: [
      {
        kennung: "abwehr",
        art: "E",
        titel: t("erzwingend.schachTitel", { farbe: farbname(eigen) }),
        zeilen: [
          t("erzwingend.abwehr.schlagen"),
          t("erzwingend.abwehr.wegziehen"),
          t("erzwingend.abwehr.dazwischen"),
          // Regel: Kapitel 7, die fünf Abwehrfragen; im Schach bleiben nur 1, 2 und 4.
          t("erzwingend.abwehr.entfallen"),
        ],
        farbe: "rot",
      },
    ],
    fazit: t("erzwingend.fazitSchach"),
    markierungen: [],
    stufen: [["abwehr"], ["abwehr"], ["abwehr"]],
    regel: t("werkzeug.k7-erzwingend.regel"),
  };
}

/** Die erzwingenden Züge für die eigene Seite (am Zug oder nach einem Nullzug des Gegners). */
function zuegeFuer(stellung: Stellung, eigen: Color): ErzwingendeZuege | null {
  const { regeln } = stellung;
  if (!regeln || (regeln.isCheck() && regeln.turn === eigen)) return null;
  const fuer = regeln.turn === eigen ? regeln : nullzug(regeln, eigen);
  const e = profil(stellung).erzwingend();
  return e && e.farbe === eigen ? e : erzwingendeZuege(fuer);
}

/**
 * Die nummerierten Kandidaten der eigenen Seite in Rechenreihenfolge, für die Engine-Karte.
 *
 * Eingaben: Stellung, eigene Seite. Ausgabe: Kandidaten (Schachs, Schläge, Drohungen), leer im
 * Schach und ohne Regeln. Beispiel: Abb. 7.14 → 1. Te8+, 2. Th8+, 3. Sxf7, dann fünf Drohungen.
 */
export function erzwingendeKandidaten(stellung: Stellung, eigen: Color): readonly Kandidat[] {
  const zuege = zuegeFuer(stellung, eigen);
  return zuege ? kandidaten(zuege) : [];
}

/**
 * Sammelt die erzwingenden Züge der eigenen Seite als nummerierte Kandidaten.
 *
 * Eingaben: Stellung, eigene Seite (ist sie nicht am Zug, rechnet die App mit einem Nullzug des
 * Gegners, nicht im Schach). Ausgabe: drei Befunde (Schachs, Schläge, Drohungen) und das Fazit
 * mit der Zahl der Kandidaten. Beispiel: Abb. 7.11 (Weiß am Zug): Schachs 1. Sd6++, 2. Sf6++.
 * Sonderfälle: Ohne Regeln (Lehrbild) keine Kandidaten; im Schach die Abwehrfragen.
 */
export function erzwingend(stellung: Stellung, eigen: Color): Werkzeugergebnis {
  const zuege = zuegeFuer(stellung, eigen);
  if (!zuege) return imSchach(eigen);
  const liste = kandidaten(zuege);
  const anzahl = { schach: 0, schlag: 0, drohung: 0 };
  for (const k of liste) anzahl[k.art] += 1;
  return {
    werkzeug: "k7-erzwingend",
    art: "E",
    ueberschrift: t("erzwingend.titel"),
    befunde: [
      befundFuer("schach", liste),
      befundFuer("schlag", liste),
      befundFuer("drohung", liste),
    ],
    fazit:
      liste.length > 0
        ? t("erzwingend.fazit", {
            farbe: farbname(eigen),
            anzahl: liste.length,
            schachs: anzahl.schach,
            schlaege: anzahl.schlag,
            drohungen: anzahl.drohung,
          })
        : t("erzwingend.fazitKeine", { farbe: farbname(eigen) }),
    markierungen: kandidatenMarkierungen(liste),
    stufen: [["schach"], ["schach", "schlag"], ["schach", "schlag", "drohung"]],
    regel: t("werkzeug.k7-erzwingend.regel"),
  };
}

/** Das Werkzeug k7-erzwingend in der gemeinsamen Form aller Werkzeuge (Konzept 7.1). */
export const k7Erzwingend: Werkzeug = {
  id: "k7-erzwingend",
  kapitel: 7,
  name: "werkzeug.k7-erzwingend.name",
  regel: "werkzeug.k7-erzwingend.regel",
  erklaerung: "werkzeug.k7-erzwingend.erklaerung",
  art: "E",
  braucht: ["stellung"],
  berechne: ({ stellung, perspektive }) => erzwingend(stellung, perspektive),
};
