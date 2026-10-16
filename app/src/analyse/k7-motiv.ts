/**
 * Werkzeug k7-motiv: Motiv benennen. Ordnet die Lösung (den nächsten Zug im Buch mit seiner
 * Fortsetzung, sonst den letzten Zug) einem der zwölf Grundmotive oder einem Mattbild zu.
 *
 * Rolle im Gesamtbild: Pflichtenheft 6.3 („Ordnet eine Lösung einem der zwölf Grundmotive oder
 * einem Mattbild zu. Gold: Schlüsselzug. Rot: Ziel. Buch- und Lichess-Aufgaben E
 * (verschlagwortet), freie Stellungen N.“). Bei Übungen des Buches steht das Motiv des Buches
 * (Art V) daneben.
 * Abhängigkeiten: schach/taktikmotive.ts, schach/mattbilder.ts, daten (Übung), i18n.
 * Buchbezug: Kapitel 7, „Die zwölf Grundmotive“ und „Typische Mattbilder“; kalibriert an den
 * Abbildungen 7.6 bis 7.37 und den Übungen 7.44 bis 7.61.
 */
import { Chess } from "chessops/chess";
import { parseFen } from "chessops/fen";
import { makeSanAndPlay, parseSan } from "chessops/san";
import type { Uebung } from "../daten/generiert/kapitel";
import { t } from "../i18n/sprache";
import type { Mattbild } from "../schach/mattbilder";
import { feldname, type Stellung } from "../schach/stellung";
import { erkenneMotive, type Motiv, type Motivbefund } from "../schach/taktikmotive";
import type { Verlauf } from "../schach/todsuenden";
import { felderText } from "./skelett";
import { aufzaehlung, zugtext } from "./texte";
import type { Befund, Markierung, Werkzeug, Werkzeugergebnis } from "./werkzeug";

/** Die Stellungen des Verlaufs: vor jedem Zug (Index i) und am Ende (Index Länge), oder null. */
function stellungenDes(verlauf: Verlauf): Chess[] | null {
  const setup = parseFen(verlauf.startFen);
  if (setup.isErr) return null;
  const pos = Chess.fromSetup(setup.value);
  if (pos.isErr) return null;
  const stellungen = [pos.value.clone()];
  for (const san of verlauf.zuege) {
    const z = parseSan(pos.value, san);
    if (!z) return null;
    makeSanAndPlay(pos.value, z);
    stellungen.push(pos.value.clone());
  }
  return stellungen;
}

/** Ein Ausschnitt des Verlaufs: die Stellung davor und die Züge bis zur Abbildung. */
interface Ausschnitt {
  readonly regeln: Chess;
  readonly zuege: readonly string[];
}

/** Die Stellung vor dem letzten Zug des Verlaufs und dieser Zug, für Abbildungen „nach 1. Dd5+“. */
function letzterZug(verlauf: Verlauf): Ausschnitt | null {
  const stellungen = stellungenDes(verlauf);
  const zug = verlauf.zuege.at(-1);
  const davor = stellungen?.at(-2);
  return zug !== undefined && davor ? { regeln: davor, zuege: [zug] } : null;
}

/**
 * Die Schachfolge, die zur Abbildung geführt hat: vom letzten Zug zurück, solange jeder Zug der
 * angreifenden Seite Schach gab (Abb. 7.28: 1... De1+ 2. Kg2 De2+).
 */
function schachfolge(verlauf: Verlauf, stellungen: readonly Chess[]): number {
  let beginn = verlauf.zuege.length - 1;
  while (beginn - 2 >= 0 && stellungen[beginn - 1]?.isCheck()) beginn -= 2;
  return beginn;
}

/**
 * Die Buchzüge, die zum Schach in der Abbildung geführt haben, für das Motiv dieses Schachs.
 *
 * Regel: Kapitel 7 (Entscheidung des Autors zu C1.18): Steht die Seite am Zug im Schach, zählt das
 * Motiv des Zuges, der dazu geführt hat, gewertet mit allen Schachs der Folge bis zur Abbildung.
 * Ging dem ersten Schach ein Schlag des Gegners voraus, kann das Schach ein Zwischenschach sein
 * (Kapitel 7, Motiv 9): Dann zählt auch der eigene Zug davor, wenn so ein Zwischenzug erkannt wird
 * (Abb. 7.22: 6... Sxe4 7. Lxd8 Lxf2+). Beispiele: Abb. 7.28 → Dauerschach; Abb. 7.10 → Abzug,
 * sobald die Zugfolge des Buches den Zug 1. Sf7+ enthält.
 * Sonderfall: Ohne Zug im Verlauf (die Zugfolge beginnt mit der Abbildung) null.
 */
function zumSchach(verlauf: Verlauf): Motivbefund | null {
  const stellungen = stellungenDes(verlauf);
  if (!stellungen || verlauf.zuege.length === 0) return null;
  const beginn = schachfolge(verlauf, stellungen);
  const davor = stellungen[beginn - 2];
  const geschlagen =
    stellungen[beginn - 1]?.board.occupied.size() !== stellungen[beginn]?.board.occupied.size();
  if (davor && geschlagen) {
    const zwischen = erkenneMotive(davor, verlauf.zuege.slice(beginn - 2));
    if (zwischen?.motive.includes("zwischenzug")) return zwischen;
  }
  const start = stellungen[beginn];
  return start ? erkenneMotive(start, verlauf.zuege.slice(beginn)) : null;
}

/** Trägt der Befund ein Motiv oder ein Mattbild? */
function traegtMotiv(b: Motivbefund | null): b is Motivbefund {
  return b !== null && (b.motive.length > 0 || b.mattbild !== null);
}

/**
 * Der Befund zur Lösung: im Schach die Folge, die dazu geführt hat; sonst zuerst der nächste Zug
 * mit Fortsetzung, dann der letzte Zug.
 */
function befundVon(
  stellung: Stellung,
  zug: string | undefined,
  fortsetzung: readonly string[],
  verlauf: Verlauf | undefined,
): { befund: Motivbefund; herkunft: "buch" | "letzter" | "schach" } | null {
  const schach = stellung.regeln?.isCheck() && verlauf ? zumSchach(verlauf) : null;
  if (traegtMotiv(schach)) return { befund: schach, herkunft: "schach" };
  const geplant =
    zug && stellung.regeln ? erkenneMotive(stellung.regeln, [zug, ...fortsetzung]) : null;
  // Der nächste Zug zählt, wenn er selbst ein Motiv trägt; sonst der letzte Zug (Abb. 7.1: „nach
  // 1. Dd5+“, der nächste Buchzug ist die Antwort des Gegners).
  const eigenesMotiv =
    geplant !== null &&
    (geplant.motive.length > 0 ||
      geplant.gedroht !== null ||
      (geplant.mattbild !== null && geplant.halbzuege.length === 1));
  if (geplant && eigenesMotiv) return { befund: geplant, herkunft: "buch" };
  const letzter = verlauf ? letzterZug(verlauf) : null;
  const danach = letzter ? erkenneMotive(letzter.regeln, letzter.zuege) : null;
  if (traegtMotiv(danach)) return { befund: danach, herkunft: "letzter" };
  return geplant ? { befund: geplant, herkunft: "buch" } : null;
}

function motivzeilen(b: Motivbefund): string[] {
  const [erstes, ...weitere] = b.motive;
  const zeilen: string[] = [];
  if (erstes) {
    zeilen.push(
      t("motiv.erstes", { motiv: t(`motiv.name.${erstes}`), text: t(`motiv.text.${erstes}`) }),
    );
    if (weitere.length > 0)
      zeilen.push(
        t("motiv.weitere", { motive: aufzaehlung(weitere.map((m) => t(`motiv.name.${m}`))) }),
      );
  }
  // Regel: Kapitel 7, Motiv 2, „Nicht überschätzen“ (Entscheidung des Autors zu C1.17).
  if (b.fesselungDurchbrochen) zeilen.push(t("motiv.fesselungDurchbrochen"));
  if (b.mattbild) zeilen.push(t("motiv.mattbild", { bild: t(`mattbild.${b.mattbild}`) }));
  else if (b.gedroht) zeilen.push(t("motiv.gedroht", { bild: t(`mattbild.${b.gedroht}`) }));
  if (zeilen.length === 0) zeilen.push(t("motiv.keins"));
  return zeilen;
}

/** Gold der Schlüsselzug, Rot seine Ziele. */
function markierungen(b: Motivbefund): Markierung[] {
  const s = b.schluessel;
  return [
    { typ: "pfeil", farbe: "gold", von: feldname(s.zug.from), nach: feldname(s.zug.to) },
    ...b.ziele.map((z): Markierung => ({ typ: "feld", farbe: "rot", feld: feldname(z) })),
  ];
}

function fazit(b: Motivbefund, zug: string): string {
  const erstes: Motiv | undefined = b.motive[0];
  const bild: Mattbild | null = b.mattbild ?? b.gedroht;
  if (erstes && bild)
    return t("motiv.fazitBeides", {
      zug,
      motiv: t(`motiv.name.${erstes}`),
      bild: t(`mattbild.${bild}`),
    });
  if (erstes) return t("motiv.fazit", { zug, motiv: t(`motiv.name.${erstes}`) });
  if (bild)
    return t(b.mattbild ? "motiv.fazitMatt" : "motiv.fazitDroht", {
      zug,
      bild: t(`mattbild.${bild}`),
    });
  return t("motiv.fazitKeins", { zug });
}

function ohneLoesung(): Werkzeugergebnis {
  return {
    werkzeug: "k7-motiv",
    art: "N",
    ueberschrift: t("motiv.titel"),
    befunde: [
      {
        kennung: "keins",
        art: "N",
        titel: t("motiv.keineLoesungTitel"),
        zeilen: [t("motiv.keineLoesung")],
        farbe: null,
      },
    ],
    fazit: t("motiv.keineLoesungFazit"),
    markierungen: [],
    stufen: [["keins"], ["keins"], ["keins"]],
    regel: t("werkzeug.k7-motiv.regel"),
  };
}

/**
 * Benennt das Motiv einer Lösung.
 *
 * Eingaben: Stellung, nächster Zug (SAN englisch, freiwillig), Fortsetzung des Buches, Verlauf
 * (für den letzten Zug), Übung des Buches zur Abbildung (freiwillig). Ausgabe: Schlüsselzug,
 * Motive, Mattbild, dazu das Motiv laut Buch (V). Beispiel: Abb. 7.14 mit 1. Th8+ Kxh8 2. Sxf7+:
 * „Hinlenkung“, dazu Gabel; Übung 7.46 (Db8+ Sxb8 Td8#): „Ablenkung“, Grundreihenmatt.
 * Sonderfälle: Ohne Zugfolge und ohne letzten Zug nur ein Hinweis.
 */
export function motiv(
  stellung: Stellung,
  zug?: string,
  fortsetzung: readonly string[] = [],
  verlauf?: Verlauf,
  uebung?: Uebung,
): Werkzeugergebnis {
  const fund = befundVon(stellung, zug, fortsetzung, verlauf);
  if (!fund) return ohneLoesung();
  const { befund, herkunft } = fund;
  const name = zugtext(befund.schluessel.san);
  const befunde: Befund[] = [
    {
      kennung: "zug",
      art: "E",
      titel: t("motiv.schluesselzug", { herkunft: t(`motiv.herkunft.${herkunft}`) }),
      zeilen: [
        t("motiv.zug", { zug: name, folge: befund.halbzuege.map((h) => zugtext(h.san)).join(" ") }),
        ...(befund.ziele.length > 0
          ? [t("motiv.ziele", { felder: felderText(befund.ziele) })]
          : []),
      ],
      farbe: "gold",
    },
    {
      kennung: "motiv",
      art: uebung ? "E" : "N",
      titel: t("motiv.motivTitel"),
      zeilen: motivzeilen(befund),
      farbe: "rot",
    },
  ];
  if (uebung?.erklaerung) {
    befunde.push({
      kennung: "buch",
      art: "V",
      titel: t("motiv.buchTitel", { nummer: uebung.nummer }),
      zeilen: [t("motiv.buchMotiv", { motiv: uebung.erklaerung.motiv }), uebung.erklaerung.text],
      farbe: null,
    });
  }
  const kennungen = befunde.map((b) => b.kennung);
  return {
    werkzeug: "k7-motiv",
    art: uebung ? "E" : "N",
    ueberschrift: t("motiv.titel"),
    befunde,
    fazit: fazit(befund, name),
    markierungen: markierungen(befund),
    stufen: [["zug"], ["zug", "motiv"], kennungen],
    regel: t("werkzeug.k7-motiv.regel"),
  };
}

/** Das Werkzeug k7-motiv in der gemeinsamen Form aller Werkzeuge (Konzept 7.1). */
export const k7Motiv: Werkzeug = {
  id: "k7-motiv",
  kapitel: 7,
  name: "werkzeug.k7-motiv.name",
  regel: "werkzeug.k7-motiv.regel",
  erklaerung: "werkzeug.k7-motiv.erklaerung",
  art: "N",
  braucht: ["stellung", "zug", "fortsetzung", "verlauf", "uebung"],
  berechne: ({ stellung, zug, fortsetzung, verlauf, uebung }) =>
    motiv(stellung, zug, fortsetzung, verlauf, uebung),
};
