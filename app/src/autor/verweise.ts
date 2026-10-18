/**
 * Findet in den Sätzen der Aufgabendatei die Stellen, die auf einen Bildschirm der App zeigen:
 * Abbildungen („Abb. 6.20“, auch „Abb. 6.20 und 11.34“), Trainer in Anführungszeichen
 * („„Planbilanz-Übung““) und Bereiche („Spielen“, „Einstellungen“, „Training ›“ …).
 *
 * Rolle im Gesamtbild: Teil der Aufgabenseite (Wunsch des Autors vom 18.10.2026): Ein Tipp auf
 * die Stelle öffnet den Bildschirm, damit die Nachtests schneller gehen. Dazu kommt die einfache
 * Auszeichnung der Datei: „**fett**“ bleibt fett, `Code` und <Adresse> werden schlichter Text.
 * Abhängigkeiten: app/stapel.ts (nur der Typ Ansicht), training/trainer.ts (nur Typen).
 */
import type { Ansicht } from "../app/stapel";
import type { TrainerKennung } from "../training/trainer";

/** Ein Stück Text, fett oder nicht, mit Ziel, wenn es ein Link ist. */
export interface Textteil {
  readonly text: string;
  readonly fett: boolean;
  readonly ziel: Ansicht | null;
}

/** Ein Trainer mit seinem Namen, wie ihn die Datei in Anführungszeichen nennt. */
export interface Trainername {
  readonly kennung: TrainerKennung;
  readonly name: string;
}

interface Fund {
  readonly von: number;
  readonly bis: number;
  readonly ziel: Ansicht;
}

const NUMMER = /\d{1,2}\.\d{1,3}/g;
/** „Abb. 6.20“, „Abb. 0.12 bis 0.19“, „Abbildung 3.14“, „Abb. 6.20, 6.21 und 11.34“. */
const ABBILDUNGEN =
  /Abb(?:\.|ildung(?:en)?)\s*\d{1,2}\.\d{1,3}(?:(?:,\s*|\s+(?:und|bis|oder|sowie)\s+|\/)\d{1,2}\.\d{1,3})*/g;

/** Feste Wörter für Bereiche der App. „Training“ nur als Weg („Training ›“). */
const BEREICHE: readonly { muster: RegExp; ziel: Ansicht }[] = [
  { muster: /\bSpielen\b/g, ziel: { bildschirm: "spielen" } },
  { muster: /\bPartienliste\b/g, ziel: { bildschirm: "spielen" } },
  { muster: /\bEinstellungen\b/g, ziel: { bildschirm: "ich" } },
  { muster: /\bNachschlagen\b/g, ziel: { bildschirm: "nachschlagen" } },
  { muster: /\bGlossar\b/g, ziel: { bildschirm: "glossar" } },
  { muster: /\bGesamt-Checkliste\b/g, ziel: { bildschirm: "checkliste" } },
  { muster: /\bLizenzen\b/g, ziel: { bildschirm: "lizenzen" } },
  { muster: /\bTraining(?= ›)/g, ziel: { bildschirm: "training" } },
];

/** Jede Abbildungsnummer einer Kette als eigener Link; die erste samt „Abb.“. */
function abbildungen(text: string): Fund[] {
  const funde: Fund[] = [];
  for (const kette of text.matchAll(ABBILDUNGEN)) {
    const anfang = kette.index;
    for (const [i, nummer] of [...kette[0].matchAll(NUMMER)].entries()) {
      const von = i === 0 ? anfang : anfang + nummer.index;
      const bis = anfang + nummer.index + nummer[0].length;
      funde.push({ von, bis, ziel: { bildschirm: "abbildung", nummer: nummer[0] } });
    }
  }
  return funde;
}

function trainer(text: string, namen: readonly Trainername[]): Fund[] {
  return namen.flatMap(({ kennung, name }) => {
    const gesucht = `„${name}“`;
    const funde: Fund[] = [];
    for (let von = text.indexOf(gesucht); von >= 0; von = text.indexOf(gesucht, von + 1)) {
      funde.push({ von, bis: von + gesucht.length, ziel: { bildschirm: "trainer", kennung } });
    }
    return funde;
  });
}

function bereiche(text: string): Fund[] {
  return BEREICHE.flatMap(({ muster, ziel }) =>
    [...text.matchAll(muster)].map((m) => ({ von: m.index, bis: m.index + m[0].length, ziel })),
  );
}

/** Alle Funde ohne Überschneidung, der frühere gewinnt (Trainernamen vor Bereichswörtern). */
function ohneUeberschneidung(funde: readonly Fund[]): Fund[] {
  const sortiert = [...funde].sort((a, b) => a.von - b.von || b.bis - a.bis);
  const ergebnis: Fund[] = [];
  for (const fund of sortiert) {
    if ((ergebnis.at(-1)?.bis ?? -1) <= fund.von) ergebnis.push(fund);
  }
  return ergebnis;
}

/** Ein Stück ohne Fettdruck-Zeichen in Teile mit und ohne Link. */
function mitLinks(text: string, fett: boolean, namen: readonly Trainername[]): Textteil[] {
  const funde = ohneUeberschneidung([
    ...trainer(text, namen),
    ...abbildungen(text),
    ...bereiche(text),
  ]);
  const teile: Textteil[] = [];
  let stelle = 0;
  for (const { von, bis, ziel } of funde) {
    if (von > stelle) teile.push({ text: text.slice(stelle, von), fett, ziel: null });
    teile.push({ text: text.slice(von, bis), fett, ziel });
    stelle = bis;
  }
  if (stelle < text.length) teile.push({ text: text.slice(stelle), fett, ziel: null });
  return teile;
}

/**
 * Zerlegt einen Satz der Aufgabendatei in Textteile mit Links.
 * Beispiel: „**Lizenzen:** Einstellungen › Lizenzen, dann Abb. 6.20 und 11.34“ → „Lizenzen:“
 * fett mit Link auf die Lizenzen, „Einstellungen“ mit Link, „Abb. 6.20“ und „11.34“ je mit Link.
 * Sonderfall: Eine Nummer, die es im Buch nicht gibt, öffnet die Abbildungsseite mit ihrem
 * eigenen Hinweis.
 */
export function textteile(satz: string, namen: readonly Trainername[]): Textteil[] {
  const schlicht = satz.replace(/`([^`]*)`/g, "$1").replace(/<(https?:[^>]*)>/g, "$1");
  return schlicht
    .split("**")
    .flatMap((stueck, i) => (stueck === "" ? [] : mitLinks(stueck, i % 2 === 1, namen)));
}
