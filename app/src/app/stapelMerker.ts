/**
 * Weitermachen, wo man war (V2, Nutzungsprüfung 25.10.2026): den Navigationsstapel als Merker
 * sichern und beim Start prüfen und wiederherstellen.
 *
 * Rolle im Gesamtbild: Der Stapel (app/stapel.ts) lebt im Arbeitsspeicher; ohne diesen Merker
 * stünde man nach einem Neuladen oder wenn das Handy die App im Hintergrund beendet hat, wieder
 * auf „Buch“. navigation.tsx schreibt jeden Stand als Merker `svga.stapel` (mit Formatnummer
 * und Zeitpunkt), und App.tsx liest ihn beim Start. Wiederhergestellt wird nur ein Stand, der
 * jünger als 24 Stunden ist und in dem jede Ansicht gültig ist; sonst beginnt die App auf „Buch“.
 * Partien gegen die Engine werden nicht direkt wieder geöffnet: Der Stapel endet vor ihnen (meist
 * auf „Spielen“ mit „Weiterspielen“), damit die Uhr nicht ohne Zutun des Lesers weiterläuft.
 * Die Nutzerdaten in IndexedDB bleiben unberührt; der Merker ist eine Bequemlichkeit, die
 * verloren gehen darf (app/merker.ts).
 * Abhängigkeiten: app/merker.ts, app/stapel.ts, training/trainer.ts.
 */
import { TRAINER } from "../training/trainer";
import { liesMerker, schreibeMerker } from "./merker";
import type { Ansicht, Bereich, Stapel, Uebungsverweis } from "./stapel";

const MERKER = "stapel";
/** Formatnummer des Merkers; ein anderes Format wird verworfen, nie umgedeutet. */
export const STAPEL_FORMAT = 1;
const STUNDE_MS = 60 * 60 * 1000;
/** Ältere Stände gelten als erledigt: Wer nach einem Tag öffnet, beginnt vorn. */
export const HOECHSTALTER_MS = 24 * STUNDE_MS;
/** Mehr Ansichten übereinander entstehen beim Lesen nicht; mehr deutet auf einen Fehler. */
const HOECHSTTIEFE = 50;
const LETZTES_KAPITEL = 12;
/** Längster sinnvoller Text eines Parameters (Begriff, Kennung, FEN). */
const HOECHSTLAENGE = 200;

const BEREICHE: readonly Bereich[] = ["buch", "training", "spielen", "nachschlagen", "ich"];
/** Bildschirme ohne Parameter. */
const OHNE_PARAMETER = new Set<string>([
  "buch",
  "nachschlagen",
  "training",
  "glossar",
  "denkroutine",
  "checkliste",
  "steckbriefe",
  "werkzeuge",
  "lernsammlung",
  "ich",
  "einstellungen",
  "lizenzen",
  "autoraufgaben",
]);
/** Nummer einer Abbildung wie „6.20“ (wie der Sprung #abb-6.20 in App.tsx). */
const ABBILDUNGSNUMMER = /^\d{1,2}\.\d{1,3}$/;
/** Grobe Form einer FEN: acht Reihen, Seite am Zug; die genaue Prüfung macht der Bildschirm. */
const FEN_FORM = /^([1-8pnbrqkPNBRQK]{1,8}\/){7}[1-8pnbrqkPNBRQK]{1,8} [wb]( |$)/;

type Roh = Record<string, unknown>;

function istObjekt(wert: unknown): wert is Roh {
  return typeof wert === "object" && wert !== null && !Array.isArray(wert);
}

function istText(wert: unknown): wert is string {
  return typeof wert === "string" && wert.length > 0 && wert.length <= HOECHSTLAENGE;
}

function istKapitel(wert: unknown): wert is number {
  return Number.isInteger(wert) && (wert as number) >= 0 && (wert as number) <= LETZTES_KAPITEL;
}

function uebungAus(roh: unknown): Uebungsverweis | null {
  if (!istObjekt(roh) || !istKapitel(roh.kapitel) || !istText(roh.id)) return null;
  return { kapitel: roh.kapitel, id: roh.id };
}

/** Bildschirm „spielen“: ohne oder mit gültiger Stellung und Abbildung. */
function spielenAus(roh: Roh): Ansicht | null {
  const { startFen, abbildung } = roh;
  if (startFen !== undefined && !(istText(startFen) && FEN_FORM.test(startFen))) return null;
  if (abbildung !== undefined && !(istText(abbildung) && ABBILDUNGSNUMMER.test(abbildung))) {
    return null;
  }
  return {
    bildschirm: "spielen",
    ...(startFen === undefined ? {} : { startFen }),
    ...(abbildung === undefined ? {} : { abbildung }),
  };
}

/** Bildschirm „uebung“ mit Kapitel, Kennung und auf Wunsch der Reihe für „Nächste Übung“. */
function uebungsansichtAus(roh: Roh): Ansicht | null {
  const uebung = uebungAus(roh);
  if (!uebung) return null;
  if (roh.reihe === undefined) return { bildschirm: "uebung", ...uebung };
  if (!Array.isArray(roh.reihe)) return null;
  const reihe = roh.reihe.map(uebungAus);
  if (reihe.some((eintrag) => eintrag === null)) return null;
  return { bildschirm: "uebung", ...uebung, reihe: reihe as Uebungsverweis[] };
}

/** Eine Ansicht mit Parametern, oder null, wenn ein Parameter nicht passt. */
function ansichtMitParameternAus(roh: Roh): Ansicht | null {
  switch (roh.bildschirm) {
    case "abbildung":
      return istText(roh.nummer) && ABBILDUNGSNUMMER.test(roh.nummer)
        ? { bildschirm: "abbildung", nummer: roh.nummer }
        : null;
    case "kapitel":
      return istKapitel(roh.nummer) ? { bildschirm: "kapitel", nummer: roh.nummer } : null;
    case "begriff":
      return istText(roh.begriff) ? { bildschirm: "begriff", begriff: roh.begriff } : null;
    case "spielen":
      return spielenAus(roh);
    case "uebung":
      return uebungsansichtAus(roh);
    case "trainer": {
      const trainer = TRAINER.find((eintrag) => eintrag.kennung === roh.kennung);
      if (!trainer) return null;
      return istText(roh.thema)
        ? { bildschirm: "trainer", kennung: trainer.kennung, thema: roh.thema }
        : { bildschirm: "trainer", kennung: trainer.kennung };
    }
    case "zusatz":
      // Ob es den Bildschirm gibt, prüft App.tsx (sonst Buch); hier nur die Form.
      if (!istText(roh.kennung) || (roh.wert !== undefined && !istText(roh.wert))) return null;
      return roh.wert === undefined
        ? { bildschirm: "zusatz", kennung: roh.kennung }
        : { bildschirm: "zusatz", kennung: roh.kennung, wert: roh.wert };
    default:
      return null;
  }
}

/**
 * Prüft eine gespeicherte Ansicht und gibt eine saubere Kopie zurück (nur bekannte Felder).
 *
 * Warum: Der Merker kann aus einer älteren Version stammen oder beschädigt sein; ein unbekannter
 * Bildschirm oder eine unpassende Nummer darf die App nie zum Absturz bringen.
 * Beispiel: { bildschirm: "abbildung", nummer: "1.26" } → dieselbe Ansicht;
 * { bildschirm: "abbildung", nummer: "eins" } → null.
 * Sonderfälle: Partien (bildschirm „partie“) gelten hier als ungültig; stapelAusMerker schneidet
 * den Stapel vor ihnen ab. Eine Abbildung, die es im Buch nicht gibt, aber richtig geschrieben
 * ist, bleibt: Der Bildschirm meldet sie selbst freundlich („Abbildung 1.99 gibt es nicht“).
 */
export function ansichtAus(roh: unknown): Ansicht | null {
  if (!istObjekt(roh) || typeof roh.bildschirm !== "string") return null;
  if (OHNE_PARAMETER.has(roh.bildschirm)) return { bildschirm: roh.bildschirm } as Ansicht;
  return ansichtMitParameternAus(roh);
}

/** Die Ansichten bis vor die erste Partie, oder null, wenn eine Ansicht ungültig ist. */
function ansichtenAus(roh: readonly unknown[]): Ansicht[] | null {
  const bisPartie = roh.findIndex(
    (eintrag) => istObjekt(eintrag) && eintrag.bildschirm === "partie",
  );
  const vorPartie = bisPartie < 0 ? roh : roh.slice(0, bisPartie);
  const ansichten = vorPartie.map(ansichtAus);
  return ansichten.every((ansicht) => ansicht !== null) ? (ansichten as Ansicht[]) : null;
}

/**
 * Liest den gesicherten Stapel aus dem Text des Merkers.
 *
 * Zweck: Beim Start dort weitermachen, wo der Leser war.
 * Eingaben: Text des Merkers (oder null), jetzt.
 * Ausgabe: der Stapel, oder null, wenn die App wie bisher auf der Startansicht beginnen soll.
 * Beispiel: vor zwei Stunden Buch → Abb. 1.26 → derselbe Stapel, die Zurück-Taste führt zum Buch.
 * Sonderfälle: älter als 24 Stunden, anderes Format, unbekannter Bereich, eine ungültige Ansicht
 * oder kein JSON → null (im Zweifel Start wie bisher). Partien: Der Stapel endet vor der ersten
 * Partie; bleibt nichts übrig → null.
 */
export function stapelAusMerker(text: string | null, jetzt: Date): Stapel | null {
  if (!text) return null;
  let roh: unknown;
  try {
    roh = JSON.parse(text);
  } catch (fehler) {
    console.warn("Gesicherte Navigation unlesbar, Start wie bisher:", fehler);
    return null;
  }
  if (!istObjekt(roh) || roh.format !== STAPEL_FORMAT || typeof roh.zeit !== "number") return null;
  if (Math.abs(jetzt.getTime() - roh.zeit) > HOECHSTALTER_MS) return null;
  const stapel = roh.stapel;
  if (!istObjekt(stapel) || !BEREICHE.includes(stapel.bereich as Bereich)) return null;
  if (!Array.isArray(stapel.ansichten) || stapel.ansichten.length > HOECHSTTIEFE) return null;
  const ansichten = ansichtenAus(stapel.ansichten);
  const [unten, ...darueber] = ansichten ?? [];
  return unten ? { bereich: stapel.bereich as Bereich, ansichten: [unten, ...darueber] } : null;
}

/** Der Text des Merkers für einen Stapel (Formatnummer, Zeitpunkt in Millisekunden, Stapel). */
export function stapelAlsMerker(stapel: Stapel, jetzt: Date): string {
  return JSON.stringify({ format: STAPEL_FORMAT, zeit: jetzt.getTime(), stapel });
}

/** Sichert den Stapel auf dem Gerät (nach jedem Schritt der Navigation). */
export function sichereStapel(stapel: Stapel, jetzt: Date = new Date()): void {
  schreibeMerker(MERKER, stapelAlsMerker(stapel, jetzt));
}

/** Der gesicherte Stapel, wenn er sich wiederherstellen lässt, sonst null. */
export function gesicherterStapel(jetzt: Date = new Date()): Stapel | null {
  return stapelAusMerker(liesMerker(MERKER), jetzt);
}
