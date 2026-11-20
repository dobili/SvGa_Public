/**
 * Gemeinsamer Ablauf der Messläufe für kurze Begegnungen (wegsperren.messung.ts): der echte
 * Gegner einer Begegnung gegen einen menschlichen Bot in Lesestärke E, im Format der Begegnung
 * und mit der Schlusswertung der App.
 *
 * Warum eigene Datei: Seit dem 18.11.2026 misst der Lauf nicht nur die Wegsperren S15 bis S17,
 * sondern jede kurze Begegnung (Wunsch des Autors über den Hauptchat: Dime, Schiffskoch, Kreide,
 * Sol, Vorratsstellungen). Dafür kamen Farbe Schwarz oder Zufall, fremde Eröffnungen mit
 * Alternativen und Stellungen aus dem Vorrat dazu; zusammen wäre die Datei über 400 Zeilen.
 *
 * Rolle im Gesamtbild: Kein Test der Prüfkette (Endung .testhilfe, nicht gesammelt). Der Gegner
 * entsteht wie in der App: Profil aus inhalte/abenteuer/gegner.json, Stärke über
 * regeln/gegnerstaerke.ts (A = E), Einstellung über anbindung/partiestart.ts mit Maia, Profil der
 * Zugwahl wie ui/komponenten/partie/botzug.ts, Stufe je Phase höchstens eine Stufe je Zug weiter.
 * Der Leser ist ein vorgefertigter Bot der App mit gemessener Stärke nahe E (Messspieler „@bot*“),
 * ohne Karten. Gewertet wird wie anbindung/useKurzform.ts: nach den Zügen des Formats und der
 * Antwort des Gegners, Tiefe 12, aus Sicht des Lesers.
 * Abhängigkeiten: engine/messung/messspieler.testhilfe.ts, spiel/enginezug.ts, spiel/partie.ts,
 * regeln/kurzform.ts, regeln/gegnerstaerke.ts, regeln/vorrat.ts.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { tagesform } from "../engine/menschlich";
import { spieler, type Spieler } from "../engine/messung/messspieler.testhilfe";
import type { EngineDienst } from "../engine/engineDienst";
import { wertFuer } from "../engine/fallenurteil";
import { naechsteStufe, stufe, type Stufennummer } from "../engine/stufen";
import { wahltempo } from "../engine/wahlmodell";
import { BUCHTREUE, type Gegnerprofil as Zugprofil } from "../engine/zugwahl";
import { engineZugMitLage } from "../spiel/enginezug";
import {
  leserAmZug,
  neuePartie,
  stellungen,
  ziehe,
  type Partie,
  type Partieeinstellung,
  type Partiezug,
} from "../spiel/partie";
import { phaseVon } from "../spiel/phasen";
import type { Color } from "chessops";
import { ausgangAus } from "./anbindung/partieergebnis";
import { partieeinstellungAus } from "./anbindung/partiestart";
import { gerechneteStaerke } from "./regeln/gegnerstaerke";
import { ausgangNachWert, wertungFaellig, type Kurzform } from "./regeln/kurzform";
import { bandZu, type Stellungsvorrat } from "./regeln/vorrat";
import type { Gegnerprofil } from "./schnittstelle/gegnerprofil";
import type { Partieauftrag, Partieformat, Startstellung } from "./schnittstelle/partie";

export const WURZEL = join(process.cwd(), "..");
/** Wertung wie anbindung/useKurzform.ts (Regelwerk R13: Tiefe 12). */
const WERTUNG_MS = 1500;
const WERTUNG_TIEFE = 12;
/** Eigene Saat für die Farbe bei „zufall“, unabhängig von Eröffnung und Leser. */
const FARBSAAT_FAKTOR = 7919;
const HALB = 0.5;
/**
 * Ganze Partien (Clubkampf, Story, Turnier) laufen bis zum Ende nach den Regeln, höchstens so viele
 * Halbzüge; danach entscheidet die Bewertung wie ein Schiedsrichter: ab ENTSCHIEDEN Bauern Sieg
 * oder Niederlage, sonst Remis (Schwierigkeitskurve, 20.11.2026; Bots finden ein gewonnenes
 * Endspiel nicht immer zum Matt, die App kennt kein Remisangebot).
 */
const HALBZUEGE_GANZ = 200;
const ENTSCHIEDEN = 3;

/**
 * Leser je Lesestärke: drei vorgefertigte Bots mit gemessener Stärke nahe E (mit Maia,
 * engine/botstaerke-maia-daten.ts), im Wechsel, damit nicht ein Stil das Ergebnis bestimmt.
 * 800: mara 783, leyla 797, holger 871 (Mittel 817; Tante Hilde 796 ist ein Spaß-Bot). 1200:
 * frau-demir 1151, frau-romero 1187, katrin 1232. 1600: herr-vogel 1538, guenter 1600,
 * herr-kuehn 1723 (Mittel 1620).
 */
export const LESER: Readonly<Record<number, readonly string[]>> = {
  800: ["mara", "leyla", "holger"],
  1200: ["frau-demir", "frau-romero", "katrin"],
  1600: ["herr-vogel", "guenter", "herr-kuehn"],
};

/** Eine gemessene Partie. */
export interface Messpartie {
  readonly saat: number;
  readonly leser: string;
  readonly farbe: Color;
  /** Woher die Startstellung kam (Vorratskennung oder erster Zug der Eröffnung), sonst leer. */
  readonly start: string;
  readonly ausgang: "sieg" | "remis" | "niederlage";
  /** Bewertung der Schlussstellung aus Sicht des Lesers; null bei Ende nach den Regeln. */
  readonly wert: number | null;
  readonly ende: string;
  readonly zuege: readonly string[];
  /** Fehler des Gegners ab einem Bauern: Halbzug, Zug, Art, Verlust. */
  readonly patzer: readonly string[];
}

interface Begegnung {
  readonly kennung: string;
  readonly gegner: string;
  readonly format: Partieformat;
  readonly startstellung: Startstellung;
  readonly farbe: Color | "zufall";
}

/** Probewerte für das Profil (ohne gegner.json zu ändern), aus der Umgebung des Laufs. */
export interface Probe {
  readonly versatz?: number;
  readonly endspiel?: number;
  /** Zahl der eigenen Züge des Formats statt der aus begegnungen.json. */
  readonly zuege?: number;
}

/** Liest eine JSON-Datei aus inhalte/abenteuer (Messläufe laufen in Node, ohne Paket). */
export function lies<T>(pfad: string): T {
  return JSON.parse(readFileSync(join(WURZEL, pfad), "utf8")) as T;
}

/** Fester Zufall (LCG wie vorratspartien.messung.ts). */
export function zufallsquelle(saat: number): () => number {
  let stand = saat;
  return () => {
    stand = (stand * 48_271) % 2_147_483_647;
    return stand / 2_147_483_647;
  };
}

function amZug(fen: string): Color {
  return fen.split(" ")[1] === "b" ? "black" : "white";
}

/** Löst eine Abbildung in ihre FEN auf (wie anbindung/dienste.ts, aus den Buchdaten der App). */
function abbildungsFen(nummer: string): string {
  const kapitel = nummer.split(".")[0]?.padStart(2, "0");
  const daten = lies<{ abbildungen: { id: string; fen: string }[] }>(
    `app/public/daten/de/a1/kap${kapitel}.json`,
  );
  const fen = daten.abbildungen.find((a) => a.id === nummer)?.fen;
  if (!fen) throw new Error(`Abbildung ${nummer} fehlt in den Buchdaten`);
  return fen;
}

/**
 * Die Startstellung einer Partie, wie die App sie auflöst. Fremde Eröffnung: je Saat reihum eine
 * der Eröffnungen (die App nimmt die seltenste des Lesers, regeln/fremdeEroeffnung.ts; ein
 * Messleser hat keine Partien). Vorrat: das Band zur Zielstärke, je Saat reihum ein Eintrag (die
 * App wählt zufällig ohne Wiederholung, anbindung/vorratsstellung.ts); Farbe = Seite am Zug.
 */
function startDer(
  stellung: Startstellung,
  zielElo: number,
  saat: number,
): { stellung: Startstellung; farbe: Color | null; start: string } {
  if (stellung.art === "abbildung")
    return {
      stellung: { art: "fen", fen: abbildungsFen(stellung.nummer) },
      farbe: null,
      start: "",
    };
  if (stellung.art === "eroeffnung" && stellung.alternativen?.length) {
    const alle = [stellung.zuege, ...stellung.alternativen];
    const zuege = alle[(saat - 1) % alle.length] ?? stellung.zuege;
    return {
      stellung: { art: "eroeffnung", zuege },
      farbe: null,
      start: zuege.slice(0, 2).join(" "),
    };
  }
  if (stellung.art !== "vorrat") return { stellung, farbe: null, start: "" };
  const vorrat = lies<Stellungsvorrat>("inhalte/abenteuer/stellungsvorrat.json");
  const liste = bandZu(vorrat, zielElo)?.formate[stellung.format] ?? [];
  const eintrag = liste[(saat - 1) % Math.max(1, liste.length)];
  if (!eintrag) throw new Error(`Vorrat ${stellung.format} bei ${zielElo} leer`);
  return {
    stellung: { art: "fen", fen: eintrag.fen },
    farbe: amZug(eintrag.fen),
    start: eintrag.kennung,
  };
}

/** Das Profil aus gegner.json, auf Wunsch mit Probewerten für Versatz und Endspiel. */
function profilDer(kennung: string, probe: Probe): Gegnerprofil {
  const liste = lies<{ gegner: Gegnerprofil[] }>("inhalte/abenteuer/gegner.json").gegner;
  const profil = liste.find((g) => g.kennung === kennung);
  if (!profil) throw new Error(`Gegner ${kennung} fehlt`);
  // Probe des Versatzes in derselben Art wie im Profil (aktuell oder eingang); bei E = A gleich.
  const art = profil.staerke.art === "fest" ? "aktuell" : profil.staerke.art;
  return {
    ...profil,
    ...(probe.versatz !== undefined ? { staerke: { art, versatz: probe.versatz } } : {}),
    ...(probe.endspiel !== undefined ? { phasenversatz: { endspiel: probe.endspiel } } : {}),
  };
}

/** Das Format, auf Wunsch mit anderer Zugzahl (nur kurze Formate haben eine). */
function mitZuegen(format: Partieformat, zuege: number | undefined): Partieformat {
  if (zuege === undefined || !("zuege" in format)) return format;
  return { ...format, zuege };
}

/** Die Begegnung aus begegnungen.json. */
export function begegnungDer(kennung: string): Begegnung {
  const begegnung = lies<{ begegnungen: Begegnung[] }>(
    "inhalte/abenteuer/begegnungen.json",
  ).begegnungen.find((b) => b.kennung === kennung);
  if (!begegnung) throw new Error(`Begegnung ${kennung} fehlt`);
  return begegnung;
}

/**
 * Die Partieeinstellung, wie die App sie baut (Leser mit A = E, Maia an), für eine Saat: Farbe
 * „zufall“ wechselt je Saat, Eröffnung und Vorratsstellung gehen reihum.
 */
export function einstellungDer(
  kennung: string,
  lesestaerke: number,
  saat: number,
  probe: Probe,
): { einstellung: Partieeinstellung; start: string } {
  const begegnung = begegnungDer(kennung);
  const profil = profilDer(begegnung.gegner, probe);
  const zustand = { haeufigkeitsfaktor: 1, grund: null, analysiert: false, ueberheblich: 1 };
  const staerke = gerechneteStaerke(profil, zustand, {
    aktuell: lesestaerke,
    eingang: lesestaerke,
  });
  const start = startDer(begegnung.startstellung, staerke.zielElo, saat);
  // Gewürfelt, nicht im Wechsel: Sonst spielte jede Eröffnung Dimes (vier, reihum) immer dieselbe Farbe.
  const gewuerfelt: Color = zufallsquelle(saat * FARBSAAT_FAKTOR)() < HALB ? "white" : "black";
  const farbe = start.farbe ?? (begegnung.farbe === "zufall" ? gewuerfelt : begegnung.farbe);
  const auftrag: Partieauftrag = {
    kennung: `${kennung}#messung`,
    begegnung: kennung,
    profil,
    zustand,
    staerke,
    farbe,
    format: mitZuegen(begegnung.format, probe.zuege),
    startstellung: start.stellung,
    deck: { karten: [] },
    kartenErlaubt: true,
    zaehltFuerApp: false,
    uhr: null,
  };
  return { einstellung: partieeinstellungAus(auftrag, true, Math.random), start: start.start };
}

/**
 * Das Profil der Zugwahl wie ui/komponenten/partie/botzug.ts (profilDerPartie, Story-Gegner:
 * bot null, stilname gesetzt), ohne Uhr; Maia über die Laufzeit unter Node.
 */
function zugprofil(e: Partieeinstellung, maia: Zugprofil["maia"], saat: number): Zugprofil {
  return {
    fleckenStandard: 0,
    fleckGewicht: 1,
    fehlerarten: e.fehlerarten ?? null,
    stil: e.stil ?? 0,
    stilname: e.stilname,
    stilmix: e.stilmix,
    blindeFlecken: e.blindeFlecken ?? [],
    gewichte: e.gewichte,
    haeufigkeit: e.haeufigkeit,
    hoechstverlust: e.hoechstverlust,
    verlauf: { tagesform: tagesform(`wegsperre-${saat}`) },
    restMs: null,
    tempo: wahltempo(e.uhr),
    ...(e.maia && maia ? { maia } : {}),
  };
}

/** Bewertung der Stellung aus Sicht des Lesers wie bewerteMitEngine der App. */
async function bewerte(engine: EngineDienst, fen: string, farbe: Color): Promise<number> {
  const b = await engine.bewerte(fen, WERTUNG_MS, 1, { art: "tiefe", tiefe: WERTUNG_TIEFE });
  const wert = b.varianten[0]?.wert;
  return wert ? wertFuer(wert, farbe) : 0;
}

/** Zieht einen Halbzug: Leser über seinen Bot, Gegner über Stufe und Profil der Partie. */
async function halbzug(
  engine: EngineDienst,
  lauf: Partie,
  leser: Spieler,
  gegner: Zugprofil,
  letzte: { leser: Stufennummer | null; gegner: Stufennummer | null },
  zufall: () => number,
  saat: number,
): Promise<Partie | null> {
  const istLeser = leserAmZug(lauf);
  const seite = istLeser ? "leser" : "gegner";
  const fen = stellungen(lauf).at(-1) ?? "";
  const phase = phaseVon(fen) ?? "mittelspiel";
  const ziel = istLeser ? leser.stufen[phase] : lauf.einstellung.stufenJePhase[phase];
  const vorher = letzte[seite];
  const nummer = vorher ? naechsteStufe(vorher, ziel) : ziel;
  letzte[seite] = nummer;
  const profil = istLeser
    ? { ...leser.profil, verlauf: { tagesform: tagesform(`leser-${saat}`) } }
    : gegner;
  const e = await engineZugMitLage(engine, fen, stufe(nummer), [], zufall, BUCHTREUE, profil);
  if (!e) return null;
  // Der Zug des Lesers steht in der Partie wie ein getippter Zug (ohne Fehlerart und Verlust).
  const zug: Partiezug = istLeser
    ? { san: e.zug.san, von: "leser", quelle: "leser", fehler: null, verlust: 0 }
    : { ...e.zug, stufe: nummer };
  return ziehe(lauf, zug);
}

/** Fehler des Gegners ab einem Bauern, als Zeilen „Halbzug Zug Art Verlust“. */
function patzerDer(lauf: Partie): string[] {
  return lauf.zuege.flatMap((z, i) =>
    z.von === "engine" && (z.verlust ?? 0) >= 1
      ? [`${i + 1} ${z.san} ${z.fehler ?? "ohne Art"} ${(z.verlust ?? 0).toFixed(1)}`]
      : [],
  );
}

/** Ist die Partie fertig zum Werten: kurze Form nach ihren Zügen, ganze Partie an der Grenze. */
function fertig(lauf: Partie, form: Kurzform | null): boolean {
  if (lauf.ende !== null) return true;
  return form ? wertungFaellig(lauf, form) : lauf.zuege.length >= HALBZUEGE_GANZ;
}

/** Ausgang aus der Schlussbewertung: kurze Form nach ihrer Regel, ganze Partie nach ENTSCHIEDEN. */
function ausgangAusWert(form: Kurzform | null, wert: number): Messpartie["ausgang"] {
  if (form) return ausgangNachWert(form, wert);
  if (wert >= ENTSCHIEDEN) return "sieg";
  return wert <= -ENTSCHIEDEN ? "niederlage" : "remis";
}

/**
 * Spielt eine Partie der Begegnung bis zur Wertung oder zum Ende nach den Regeln. `form` null:
 * ganze Partie (höchstens HALBZUEGE_GANZ Halbzüge). `maia` undefined: Gegner ohne Maia (wie die
 * erste Partie, solange Maia im Hintergrund noch lädt).
 */
export async function spiele(
  engine: EngineDienst,
  vorgabe: { einstellung: Partieeinstellung; start: string },
  form: Kurzform | null,
  leserBot: string,
  maia: Zugprofil["maia"],
  saat: number,
): Promise<Messpartie> {
  const { einstellung } = vorgabe;
  const zufall = zufallsquelle(saat);
  const letzte = { leser: null, gegner: null };
  const gegner = zugprofil(einstellung, maia, saat);
  const leser = spieler(`@${leserBot}*`);
  let lauf = neuePartie(einstellung, `messung-${saat}`, new Date().toISOString());
  if (!lauf) throw new Error("Startstellung nicht spielbar");
  while (!fertig(lauf, form)) {
    const weiter = await halbzug(engine, lauf, leser, gegner, letzte, zufall, saat);
    if (!weiter) throw new Error(`Kein Zug in ${stellungen(lauf).at(-1)}`);
    lauf = weiter;
  }
  const farbe = einstellung.eigeneFarbe;
  const wert =
    lauf.ende === null ? await bewerte(engine, stellungen(lauf).at(-1) ?? "", farbe) : null;
  const ausgang = wert !== null ? ausgangAusWert(form, wert) : ausgangAus(lauf);
  if (ausgang === "abgebrochen") throw new Error("Partie ohne Ende");
  const ende = lauf.ende?.art ?? "wertung";
  const zuege = lauf.zuege.map((z) => z.san);
  return {
    saat,
    leser: leserBot,
    farbe,
    start: vorgabe.start,
    ausgang,
    wert,
    ende,
    zuege,
    patzer: patzerDer(lauf),
  };
}

/** Zusammenfassung einer Zelle. Beispiel: „S17 E=1200: 30 Partien, Sieg 12, Remis 9, Niederlage 9“. */
export function zeile(name: string, lesestaerke: number, partien: readonly Messpartie[]): string {
  const zahl = (a: Messpartie["ausgang"]) => partien.filter((p) => p.ausgang === a).length;
  return `${name} E=${lesestaerke}: ${partien.length} Partien, Sieg ${zahl("sieg")}, Remis ${zahl("remis")}, Niederlage ${zahl("niederlage")}`;
}
