/**
 * Bausteine der Startkarte eines Trainers: Einstellzeilen, Startknopf und weitere Modi als Daten.
 *
 * Rolle im Gesamtbild: Entwurf G1 „Startkarte“ (Wahl des Autors, 31.10.2026). Jeder Trainer
 * beschreibt seine Runde als Liste von Einstellzeilen (Stufe, Motiv, Übung …) und seine weiteren
 * Modi (Serie, Wiederholen …) als Liste; die Startkarte (Startkarte.tsx) zeichnet beides gleich.
 * Ein neuer Trainer oder ein neuer Modus trägt nur eine Zeile ein (Wunsch des Autors: eintragen
 * statt umbauen).
 * Abhängigkeiten: i18n.
 */
import type { Color } from "chessops/types";
import { t, tZahl } from "../../../i18n/sprache";
import { TRAINERSTUFEN, type Trainerstufe } from "../../../training/stufen";

/** Ein Wert einer Einstellzeile mit seiner Beschriftung. */
export interface Wahloption<T extends string> {
  readonly wert: T;
  readonly text: string;
}

/** Die Zeichen der Einstellzeilen (Startkarte.tsx ordnet ihnen ein Bild zu). */
export type Zeilensymbol =
  "quelle" | "thema" | "stufe" | "uebung" | "seite" | "eroeffnung" | "gruppe" | "partie";

/** Die Zeichen der weiteren Modi. */
export type Modussymbol = "serie" | "wiederholen" | "kurz" | "zeit" | "tag" | "plan";

/** Eine Zeile unter „Deine Runde“: Name, gewählter Wert, Auswahl beim Antippen. */
export interface Einstellung {
  readonly kennung: string;
  readonly titel: string;
  readonly symbol: Zeilensymbol;
  readonly optionen: readonly Wahloption<string>[];
  readonly wert: string;
  readonly setze: (wert: string) => void;
  /** Was die Werte bedeuten (etwa wie die Stufen gemessen sind); steht in der offenen Auswahl. */
  readonly erklaerung?: string;
  /** Prüfkennung der Zeile für die Oberflächentests. */
  readonly testkennung?: string;
}

/** Ein weiterer Modus unter dem Startknopf, etwa „Serie ohne Fehler“ oder „Wiederholen“. */
export interface Startmodus {
  readonly kennung: string;
  readonly titel: string;
  readonly text: string;
  readonly symbol: Modussymbol;
  readonly starte: () => void;
  /** Ziel eines Rundgangschritts (data-tour), etwa „trainer-wiederholen“. */
  readonly tour?: string;
  readonly testkennung?: string;
}

/** Der große Knopf „Runde starten“ mit dem, was er startet. */
export interface Startknopf {
  /** Der Zusatz hinter „Runde starten“, etwa „8 Aufgaben“; null ohne Zusatz. */
  readonly zusatz: string | null;
  readonly starte: () => void;
  readonly gesperrt?: boolean;
  readonly testkennung?: string;
  /** Andere Beschriftung als „Runde starten“ (etwa beim Kurzplan). */
  readonly text?: string;
}

/**
 * Baut eine Einstellzeile mit festem Wertetyp. Warum: Die Startkarte kennt nur Zeichenketten;
 * so bleibt der Wert im Trainer typsicher (kein Umwandeln von Hand).
 *
 * Beispiel: einstellung({ kennung: "seite", optionen: [{ wert: "white", text: "Weiß" }], … }).
 * Sonderfall: Ein Wert, der nicht unter den Optionen steht, wird nicht übernommen.
 */
export function einstellung<T extends string>(zeile: {
  kennung: string;
  titel: string;
  symbol: Zeilensymbol;
  optionen: readonly Wahloption<T>[];
  wert: T;
  setze: (wert: T) => void;
  erklaerung?: string;
  testkennung?: string;
}): Einstellung {
  return {
    ...zeile,
    setze: (wert) => {
      const option = zeile.optionen.find((o) => o.wert === wert);
      if (option) zeile.setze(option.wert);
    },
  };
}

/** Wert „alle Stufen“ in den Einstellzeilen. */
export const ALLE = "alle";

/**
 * Die Stufen 1 bis 5 (oder alle) als Optionen; die Trainer mit geeichten Aufgaben nutzen sie.
 *
 * Beispiel: Taktiktrainer → „alle“, „1“, …, „5“.
 */
export function zahlstufen(stufen: readonly number[]): Wahloption<string>[] {
  return [
    { wert: ALLE, text: t("trainerstart.alleStufen") },
    ...stufen.map((s) => ({ wert: String(s), text: t("trainerstart.stufe", { stufe: s }) })),
  ];
}

/** Die Zahl einer Stufenoption; „alle“ und Unbekanntes ergeben null. */
export function stufeAus(wert: string): number | null {
  const zahl = Number(wert);
  return wert !== ALLE && Number.isInteger(zahl) ? zahl : null;
}

/** Die Option zu einer Stufe (null: alle). */
export function stufenwert(stufe: number | null): string {
  return stufe === null ? ALLE : String(stufe);
}

/** Der Text der gewählten Option, oder der Wert selbst, falls keine passt. */
export function optionstext(zeile: Einstellung): string {
  return zeile.optionen.find((o) => o.wert === zeile.wert)?.text ?? zeile.wert;
}

/**
 * Der Modus „Wiederholen“ mit der Zahl der fälligen Aufgaben; ohne fällige Aufgaben keiner.
 * Warum: Sechs Trainer bieten ihn gleich an (früher Wiederholungsknopf.tsx, U9).
 *
 * Beispiel: wiederholung(3, starte) → [„Wiederholen · 3 Aufgaben sind fällig.“].
 */
export function wiederholung(anzahl: number, starte: () => void): Startmodus[] {
  if (anzahl === 0) return [];
  return [
    {
      kennung: "wiederholen",
      titel: t("trainerstart.modus.wiederholen"),
      text: tZahl("trainerstart.modus.faellig", anzahl, { anzahl }),
      symbol: "wiederholen",
      starte,
      tour: "trainer-wiederholen",
      testkennung: "trainer-wiederholung",
    },
  ];
}

/** Der Zusatz des Startknopfs „8 Aufgaben“ (Einzahl bei 1). */
export function aufgabenzahl(anzahl: number): string {
  return tZahl("trainerstart.aufgaben", anzahl, { anzahl });
}

/** Die geeichten Stufen der Trainer mit Lichess-Wertung (Taktik, Falle, Struktur, Endspiel). */
export const GEEICHTE_STUFEN: readonly number[] = [1, 2, 3, 4, 5];

/**
 * Die Zeile „Stufe“ mit „alle Stufen“ und 1 bis 5.
 *
 * Eingaben: gewählte Stufe (null: alle), Rückruf, was die Stufen messen.
 * Beispiel: „Falle oder Köder“ → „Stufe: alle Stufen“.
 */
export function stufenzeile(
  stufe: number | null,
  setze: (stufe: number | null) => void,
  erklaerung: string,
): Einstellung {
  return einstellung({
    kennung: "stufe",
    titel: t("trainerstart.zeile.stufe"),
    symbol: "stufe",
    optionen: zahlstufen(GEEICHTE_STUFEN),
    wert: stufenwert(stufe),
    setze: (wert) => setze(stufeAus(wert)),
    erklaerung,
    testkennung: "zeile-stufe",
  });
}

/** Wert „gemischt“ der Wortstufen (leicht, mittel, schwer). */
export const GEMISCHT = "gemischt";
export type Wortstufenwert = Trainerstufe | typeof GEMISCHT;
export const WORTSTUFENWERTE: readonly Wortstufenwert[] = [GEMISCHT, ...TRAINERSTUFEN];

/** Die Wortstufe eines Wertes; „gemischt“ ergibt null. */
export function wortstufeAus(wert: Wortstufenwert): Trainerstufe | null {
  return wert === GEMISCHT ? null : wert;
}

/**
 * Die Zeile „Stufe“ mit gemischt, leicht, mittel, schwer (Röntgen, Zählen, Koordinaten …).
 *
 * Beispiel: Röntgen-Trainer → „Stufe: gemischt“.
 */
export function wortstufenzeile(
  stufe: Trainerstufe | null,
  setze: (stufe: Trainerstufe | null) => void,
  erklaerung: string,
): Einstellung {
  return einstellung({
    kennung: "stufe",
    titel: t("trainerstart.zeile.stufe"),
    symbol: "stufe",
    optionen: WORTSTUFENWERTE.map((w) => ({ wert: w, text: t(`roentgentrainer.stufe.${w}`) })),
    wert: stufe ?? GEMISCHT,
    setze: (wert) => setze(wortstufeAus(wert)),
    erklaerung,
    testkennung: "zeile-stufe",
  });
}

/** Die beiden Seiten, Weiß zuerst. */
export const SEITEN: readonly Color[] = ["white", "black"];

/** Die Zeile „Du spielst: Weiß | Schwarz“. */
export function seitenzeile(seite: Color, setze: (seite: Color) => void): Einstellung {
  return einstellung({
    kennung: "seite",
    titel: t("trainerstart.zeile.seite"),
    symbol: "seite",
    optionen: SEITEN.map((s) => ({ wert: s, text: t(s === "white" ? "farbe.w" : "farbe.b") })),
    wert: seite,
    setze,
    testkennung: "zeile-seite",
  });
}
