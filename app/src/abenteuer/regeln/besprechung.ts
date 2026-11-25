/**
 * Partiebesprechung mit Ambrose (docs/spiel/auftraege/partiebesprechung_25-11.md): ob sie offen
 * ist, wie viel Ambrose sagt (Stufe), welche Begriffe er benutzen darf und wer spricht.
 *
 * Rolle im Gesamtbild: reine Regeln für das Tagebuch (Knopf „Besprechen“) und den Bildschirm der
 * Besprechung (anbindung/Besprechung.tsx). Wunsch des Autors (25.11.2026): anfangs sehr sparsam,
 * Begriffe erst, wenn der Spieler sie in der Geschichte kennengelernt hat. Zwei Achsen: Die Stufe
 * folgt dem Fortschritt der Geschichte (Ende von Akt 1 und Akt 3), die Begriffe folgen den
 * Lektionen (eine Aufgabenrunde mit passendem Thema versucht, Variable `<ort><Name>Versucht` aus
 * regeln/dialogvariablen.ts, Themen aus runden.json).
 * Abhängigkeiten: regeln/abwesenheit.ts, regeln/dialogvariablen.ts, schnittstelle/spielstand.ts.
 */
import type { Abenteuerstand } from "../schnittstelle/spielstand";
import { ambroseNichtDa, ambroseVerabschiedet } from "./abwesenheit";
import { variablenNachRunde } from "./dialogvariablen";

type Variablen = Abenteuerstand["dialogvariablen"];

/** Dialogvariable: Ambrose hat die Besprechung angekündigt (maple-falls-clubraum.ink). */
export const BESPRECHUNG_ANGEKUENDIGT = "besprechungAngekuendigt";

/** Wie viel Ambrose sagt: 0 noch nichts, 1 knapp, 2 mit Grund, 3 mit Folge. */
export type Besprechungsstufe = 0 | 1 | 2 | 3;

/** Die Begriffe, die Ambrose in der Besprechung benutzt, sobald der Held sie kennt. */
export type Begriff =
  | "haengend"
  | "matt"
  | "gabel"
  | "fesselung"
  | "spiess"
  | "eroeffnung"
  | "struktur"
  | "abzug"
  | "hinlenkung"
  | "umwandlung"
  | "endspiel"
  | "theorie";

/**
 * Themen der Aufgabenrunden (runden.json, Feld `themen`) und der Begriff, den die Runde lehrt.
 * Regel: Kapitel 7 (Motive) und 1 (hängende Figuren); Themen ohne Eintrag lehren keinen Begriff.
 */
const BEGRIFF_JE_THEMA: Readonly<Record<string, Begriff>> = {
  haengend: "haengend",
  matt1: "matt",
  matt2: "matt",
  mattbilder: "matt",
  grundreihenmatt: "matt",
  doppelangriff: "gabel",
  fesselung: "fesselung",
  spiess: "spiess",
  falle: "eroeffnung",
  struktur: "struktur",
  abzug: "abzug",
  doppelschach: "abzug",
  hinlenkung: "hinlenkung",
  umwandlung: "umwandlung",
  endspiel: "endspiel",
};

/** Ab dieser Nadel des Eröffnungsclubs (Silicon Bay, Lin) kennt der Held das Wort „Theorie“. */
const THEORIE_NADEL = "nadelSiliconBay";
/** Stufe 2 ab dem Ende von Akt 1, Stufe 3 ab dem Ende von Akt 3 (Dialogvariablen der Ink-Dateien). */
const STUFE_ZWEI = "endeAkt1Gesehen";
const STUFE_DREI = "endeAkt3Gesehen";

/** Was eine Runde für die Begriffe braucht: Kennung und Themen. */
export interface Rundenthemen {
  readonly kennung: string;
  readonly themen: readonly string[];
}

/** Ist die Besprechung offen? Erst nach Ambroses Ankündigung (erster Clubkampf in Maple Falls). */
export function besprechungOffen(variablen: Variablen): boolean {
  return variablen[BESPRECHUNG_ANGEKUENDIGT] === true;
}

/**
 * Die Stufe der Besprechung.
 * Beispiel: angekündigt → 1; dazu endeAkt1Gesehen → 2; dazu endeAkt3Gesehen → 3; ohne Ankündigung 0.
 */
export function besprechungsstufe(variablen: Variablen): Besprechungsstufe {
  if (!besprechungOffen(variablen)) return 0;
  if (variablen[STUFE_DREI] === true) return 3;
  return variablen[STUFE_ZWEI] === true ? 2 : 1;
}

/** Die Variable, die eine versuchte Runde in der Langform setzt („riverton.reiheTamsin“ → …). */
function versuchtVariable(runde: string): string {
  const [ort] = runde.split(".");
  const name = Object.keys(variablenNachRunde(runde, false)).find(
    (n) => ort !== undefined && n.startsWith(ort),
  );
  return name ?? "";
}

/**
 * Die Begriffe, die der Held kennt: je versuchter Runde die Begriffe ihrer Themen, dazu „theorie“
 * ab der Nadel von Silicon Bay.
 * Beispiel: rivertonReiheTamsinVersucht → { gabel }; mit nadelSiliconBay 1 dazu { theorie }.
 * Sonderfall: Kurzformen wie `tafelVersucht` zählen nicht (gleich an mehreren Orten).
 */
export function bekannteBegriffe(
  variablen: Variablen,
  runden: readonly Rundenthemen[],
): ReadonlySet<Begriff> {
  const bekannt = new Set<Begriff>();
  for (const runde of runden) {
    if (variablen[versuchtVariable(runde.kennung)] !== true) continue;
    for (const thema of runde.themen) {
      const begriff = BEGRIFF_JE_THEMA[thema];
      if (begriff) bekannt.add(begriff);
    }
  }
  const nadel = variablen[THEORIE_NADEL];
  if (typeof nadel === "number" && nadel > 0) bekannt.add("theorie");
  return bekannt;
}

/** Varianten mit den normalen Regeln: nur die Darstellung ist anders (Blindschach, nach Gehör). */
const BESPRECHBARE_VARIANTEN: ReadonlySet<string> = new Set(["blind", "gehoer"]);

/** Was die Regel von der Einstellung einer Partie braucht. */
export interface Varianteneinstellung {
  readonly abenteuer?: { readonly variante?: string };
}

/**
 * Lässt sich die Partie besprechen (und im Hintergrund auswerten)? Wunsch des Autors
 * (26.11.2026): nur Partien nach den normalen Regeln. Ohne Variante oder mit „blind“ und „gehoer“
 * ja; „schach960“ nein (Theorie und Fehlerarten passen nicht, und Ambrose lernt 960 selbst erst).
 * Jede andere, auch künftige Variante bleibt draußen, bis sie hier ausdrücklich steht.
 * Beispiel: { abenteuer: { kennung: "…", variante: "schach960" } } → false; ohne variante → true.
 */
export function besprechbarePartie(einstellung: Varianteneinstellung): boolean {
  const variante = einstellung.abenteuer?.variante;
  return variante === undefined || BESPRECHBARE_VARIANTEN.has(variante);
}

/** Wer bespricht: Ambrose, oder der Held allein (Tiefpunkt) oder allein nach dem Abschied. */
export type Besprechungsstimme = "ambrose" | "allein" | "abschied";

/**
 * Wer spricht. Entscheidung (Entwurf, Abschnitt 8): Fehlt Ambrose (Tiefpunkt R29, Abschied
 * Q21-5), bleibt die Besprechung offen, aber ohne ihn, als Notizen des Helden.
 * Beispiel: tiefpunktGesehen ohne versoehnungGesehen → „allein“; abschiedGesehen → „abschied“.
 */
export function besprechungsstimme(variablen: Variablen): Besprechungsstimme {
  if (ambroseVerabschiedet(variablen)) return "abschied";
  return ambroseNichtDa(variablen) ? "allein" : "ambrose";
}
