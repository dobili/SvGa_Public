/**
 * Messlauf für die Wegsperren S15 bis S17 (docs/spiel/32_Wegsperren.md): der echte Gegner der
 * Sperre gegen einen menschlichen Bot in Lesestärke E, im Format der Begegnung und mit der
 * Schlusswertung der App.
 *
 * Warum: Die Versätze E + 260, 380, 560 waren ungeprüft (offene Rückfrage 1 in 32_Wegsperren.md).
 * Ziel des Autors: Wer in Lesestärke spielt, öffnet meist im ersten oder zweiten Versuch, aber
 * nicht geschenkt. Der Lauf zählt Sieg, Remis und Niederlage des Lesers je Sperre und E.
 *
 * Rolle im Gesamtbild: Kein Test der Prüfkette (vitest.messung.config.ts). Der Gegner entsteht
 * wie in der App: Profil aus inhalte/abenteuer/gegner.json, Stärke über
 * regeln/gegnerstaerke.ts (A = E, nicht abgelenkt), Einstellung über
 * anbindung/partiestart.ts mit Maia, Profil der Zugwahl wie ui/komponenten/partie/botzug.ts
 * (profilDerPartie, Zweig „eigene Stufe mit Stil“), Stufe je Phase höchstens eine Stufe je Zug
 * weiter. Der Leser ist ein vorgefertigter Bot der App mit gemessener Stärke nahe E (Messspieler
 * „@bot*“, Maia unter Node, wie vorratspartien.messung.ts), ohne Karten. Gewertet wird wie in
 * anbindung/useKurzform.ts: nach den Zügen des Formats und der Antwort des Gegners, Tiefe 12.
 *
 * Aufruf (im Ordner app/, je Zelle ein Lauf, nie mehrere zugleich):
 *   WEGSPERRE=S17 WEGSPERRE_E=1200 WEGSPERRE_PARTIEN=30 npx vitest run \
 *     --config vitest.messung.config.ts src/abenteuer/wegsperren.messung.ts
 * Weitere Umgebung: WEGSPERRE_SAAT_AB (weitere Portion; gleiche Saat ersetzt die alte Partie),
 * WEGSPERRE_ZIEL (Ordner, sonst buch/arbeit/wegsperren, nur lokal), WEGSPERRE_NAME (Zusatz im
 * Dateinamen, etwa „nachher“), WEGSPERRE_VERSATZ und WEGSPERRE_ENDSPIEL (Versatz und
 * Phasenversatz des Endspiels zur Probe, ohne gegner.json zu ändern).
 * Abhängigkeiten: engine/messung/messspieler.testhilfe.ts, engine/nodeEngine.testhilfe.ts,
 * spiel/enginezug.ts, spiel/partie.ts, regeln/kurzform.ts, regeln/gegnerstaerke.ts.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { tagesform } from "../engine/menschlich";
import { maiaNode } from "../engine/messung/maia-node.testhilfe";
import { spieler, type Spieler } from "../engine/messung/messspieler.testhilfe";
import { nodeEngine } from "../engine/nodeEngine.testhilfe";
import type { EngineDienst } from "../engine/engineDienst";
import { wertFuer } from "../engine/fallenurteil";
import { naechsteStufe, stufe, type Stufennummer } from "../engine/stufen";
import { wahltempo } from "../engine/wahlmodell";
import { BUCHTREUE, type Gegnerprofil as Zugprofil } from "../engine/zugwahl";
import { engineZugMitLage } from "../spiel/enginezug";
import {
  neuePartie,
  stellungen,
  ziehe,
  type Partie,
  type Partieeinstellung,
  type Partiezug,
} from "../spiel/partie";
import { phaseVon } from "../spiel/phasen";
import { ausgangAus } from "./anbindung/partieergebnis";
import { partieeinstellungAus } from "./anbindung/partiestart";
import { gerechneteStaerke } from "./regeln/gegnerstaerke";
import { ausgangNachWert, wertungFaellig, type Kurzform } from "./regeln/kurzform";
import type { Gegnerprofil } from "./schnittstelle/gegnerprofil";
import type { Partieauftrag, Partieformat, Startstellung } from "./schnittstelle/partie";

const WURZEL = join(process.cwd(), "..");
/** Wertung wie anbindung/useKurzform.ts (Regelwerk R13: Tiefe 12). */
const WERTUNG_MS = 1500;
const WERTUNG_TIEFE = 12;
const STANDARD_PARTIEN = 30;

/** Kurzname der Sperre → Kennung von Begegnung und Gegner. */
const SPERREN: Readonly<Record<string, string>> = {
  S15: "wegCedarRiverton.testteam",
  S16: "wegIronwoodSilicon.testteam",
  S17: "wegDesertSummit.testteam",
};

/**
 * Leser je Lesestärke: drei vorgefertigte Bots mit gemessener Stärke nahe E (mit Maia,
 * engine/botstaerke-maia-daten.ts), im Wechsel, damit nicht ein Stil das Ergebnis bestimmt.
 * 800: mara 783, leyla 797, holger 871 (Mittel 817; Tante Hilde 796 ist ein Spaß-Bot). 1200: frau-demir 1151, frau-romero 1187, katrin
 * 1232. 1600: herr-vogel 1538, guenter 1600, herr-kuehn 1723 (Mittel 1620).
 */
const LESER: Readonly<Record<number, readonly string[]>> = {
  800: ["mara", "leyla", "holger"],
  1200: ["frau-demir", "frau-romero", "katrin"],
  1600: ["herr-vogel", "guenter", "herr-kuehn"],
};

/** Eine gemessene Partie. */
interface Sperrpartie {
  readonly saat: number;
  readonly leser: string;
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
}

function lies<T>(pfad: string): T {
  return JSON.parse(readFileSync(join(WURZEL, pfad), "utf8")) as T;
}

/** Fester Zufall (LCG wie vorratspartien.messung.ts). */
function zufallsquelle(saat: number): () => number {
  let stand = saat;
  return () => {
    stand = (stand * 48_271) % 2_147_483_647;
    return stand / 2_147_483_647;
  };
}

/** Löst eine Abbildung in ihre FEN auf (wie anbindung/dienste.ts, aus den Buchdaten der App). */
function aufgeloest(stellung: Startstellung): Startstellung {
  if (stellung.art !== "abbildung") return stellung;
  const kapitel = stellung.nummer.split(".")[0]?.padStart(2, "0");
  const daten = lies<{ abbildungen: { id: string; fen: string }[] }>(
    `app/public/daten/de/a1/kap${kapitel}.json`,
  );
  const fen = daten.abbildungen.find((a) => a.id === stellung.nummer)?.fen;
  if (!fen) throw new Error(`Abbildung ${stellung.nummer} fehlt in den Buchdaten`);
  return { art: "fen", fen };
}

/** Das Profil der Sperre aus gegner.json, auf Wunsch mit Probewerten für die Versätze. */
function profilDer(kennung: string): Gegnerprofil {
  const liste = lies<{ gegner: Gegnerprofil[] }>("inhalte/abenteuer/gegner.json").gegner;
  const profil = liste.find((g) => g.kennung === kennung);
  if (!profil) throw new Error(`Gegner ${kennung} fehlt`);
  const versatz = process.env.WEGSPERRE_VERSATZ;
  const endspiel = process.env.WEGSPERRE_ENDSPIEL;
  return {
    ...profil,
    ...(versatz ? { staerke: { art: "eingang", versatz: Number(versatz) } } : {}),
    ...(endspiel ? { phasenversatz: { endspiel: Number(endspiel) } } : {}),
  };
}

/** Die Partieeinstellung, wie die App sie für die Sperre baut (Leser mit A = E, Maia an). */
function einstellungDer(kennung: string, lesestaerke: number): Partieeinstellung {
  const begegnung = lies<{ begegnungen: Begegnung[] }>(
    "inhalte/abenteuer/begegnungen.json",
  ).begegnungen.find((b) => b.kennung === kennung);
  if (!begegnung) throw new Error(`Begegnung ${kennung} fehlt`);
  const profil = profilDer(begegnung.gegner);
  const zustand = { haeufigkeitsfaktor: 1, grund: null, analysiert: false, ueberheblich: 1 };
  const wertung = { aktuell: lesestaerke, eingang: lesestaerke };
  const auftrag: Partieauftrag = {
    kennung: `${kennung}#messung`,
    begegnung: kennung,
    profil,
    zustand,
    staerke: gerechneteStaerke(profil, zustand, wertung),
    farbe: "white",
    format: begegnung.format,
    startstellung: aufgeloest(begegnung.startstellung),
    deck: { karten: [] },
    kartenErlaubt: true,
    zaehltFuerApp: false,
    uhr: null,
  };
  return partieeinstellungAus(auftrag, true, Math.random);
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
    ...(e.maia ? { maia } : {}),
  };
}

/** Bewertung der Stellung aus Sicht von Weiß (Leser) wie bewerteMitEngine der App. */
async function bewerte(engine: EngineDienst, fen: string): Promise<number> {
  const b = await engine.bewerte(fen, WERTUNG_MS, 1, { art: "tiefe", tiefe: WERTUNG_TIEFE });
  const wert = b.varianten[0]?.wert;
  return wert ? wertFuer(wert, "white") : 0;
}

/** Zieht einen Halbzug: Leser (Weiß) über seinen Bot, Gegner über Stufe und Profil der Partie. */
async function halbzug(
  engine: EngineDienst,
  lauf: Partie,
  leser: Spieler,
  gegner: Zugprofil,
  letzte: (Stufennummer | null)[],
  zufall: () => number,
  saat: number,
): Promise<Partie | null> {
  const seite = lauf.zuege.length % 2;
  const fen = stellungen(lauf).at(-1) ?? "";
  const phase = phaseVon(fen) ?? "mittelspiel";
  const ziel = seite === 0 ? leser.stufen[phase] : lauf.einstellung.stufenJePhase[phase];
  const vorher = letzte[seite] ?? null;
  const nummer = vorher ? naechsteStufe(vorher, ziel) : ziel;
  letzte[seite] = nummer;
  const profil =
    seite === 0 ? { ...leser.profil, verlauf: { tagesform: tagesform(`leser-${saat}`) } } : gegner;
  const e = await engineZugMitLage(engine, fen, stufe(nummer), [], zufall, BUCHTREUE, profil);
  if (!e) return null;
  // Der Zug des Lesers steht in der Partie wie ein getippter Zug (ohne Fehlerart und Verlust).
  const zug: Partiezug =
    seite === 0
      ? { san: e.zug.san, von: "leser", quelle: "leser", fehler: null, verlust: 0 }
      : { ...e.zug, stufe: nummer };
  return ziehe(lauf, zug);
}

/** Spielt eine Partie der Sperre bis zur Wertung oder zum Ende nach den Regeln. */
async function spiele(
  engine: EngineDienst,
  einstellung: Partieeinstellung,
  form: Kurzform,
  leserBot: string,
  maia: Zugprofil["maia"],
  saat: number,
): Promise<Sperrpartie> {
  const zufall = zufallsquelle(saat);
  const letzte: (Stufennummer | null)[] = [null, null];
  const gegner = zugprofil(einstellung, maia, saat);
  const leser = spieler(`@${leserBot}*`);
  let lauf = neuePartie(einstellung, `wegsperre-${saat}`, new Date().toISOString());
  if (!lauf) throw new Error("Startstellung nicht spielbar");
  let wert: number | null = null;
  while (lauf.ende === null && !wertungFaellig(lauf, form)) {
    const weiter = await halbzug(engine, lauf, leser, gegner, letzte, zufall, saat);
    if (!weiter) throw new Error(`Kein Zug in ${stellungen(lauf).at(-1)}`);
    lauf = weiter;
  }
  if (lauf.ende === null) wert = await bewerte(engine, stellungen(lauf).at(-1) ?? "");
  const nachRegeln = ausgangAus(lauf);
  const ausgang = wert !== null ? ausgangNachWert(form, wert) : nachRegeln;
  if (ausgang === "abgebrochen") throw new Error("Partie ohne Ende");
  return {
    saat,
    leser: leserBot,
    ausgang,
    wert,
    ende: lauf.ende?.art ?? "wertung",
    zuege: lauf.zuege.map((z) => z.san),
    patzer: lauf.zuege.flatMap((z, i) =>
      z.von === "engine" && (z.verlust ?? 0) >= 1
        ? [`${i + 1} ${z.san} ${z.fehler ?? "ohne Art"} ${(z.verlust ?? 0).toFixed(1)}`]
        : [],
    ),
  };
}

/** Zusammenfassung einer Zelle. Beispiel: „S17 E=1200: 30 Partien, Sieg 12, Remis 9, Niederlage 9“. */
function zeile(name: string, lesestaerke: number, partien: readonly Sperrpartie[]): string {
  const zahl = (a: Sperrpartie["ausgang"]) => partien.filter((p) => p.ausgang === a).length;
  return `${name} E=${lesestaerke}: ${partien.length} Partien, Sieg ${zahl("sieg")}, Remis ${zahl("remis")}, Niederlage ${zahl("niederlage")}`;
}

const sperre = process.env.WEGSPERRE ?? "S15";
const lesestaerke = Number(process.env.WEGSPERRE_E ?? 1200);
const partienZahl = Number(process.env.WEGSPERRE_PARTIEN ?? STANDARD_PARTIEN);
const saatAb = Number(process.env.WEGSPERRE_SAAT_AB ?? 0);
const zusatz = process.env.WEGSPERRE_NAME ? `-${process.env.WEGSPERRE_NAME}` : "";
const ordner = process.env.WEGSPERRE_ZIEL ?? join(WURZEL, "buch", "arbeit", "wegsperren");

describe(`Wegsperre ${sperre} gegen Lesestärke ${lesestaerke}`, () => {
  const kennung = SPERREN[sperre];
  const bots = LESER[lesestaerke];
  if (!kennung || !bots) throw new Error(`Unbekannt: ${sperre} oder E = ${lesestaerke}`);
  const engine = nodeEngine();
  afterAll(() => engine.beendeEngine());

  it(`${partienZahl} Partien`, async () => {
    const einstellung = einstellungDer(kennung, lesestaerke);
    const form = einstellung.abenteuer?.kurzform;
    if (!form) throw new Error("Die Begegnung hat kein kurzes Format");
    const maia = { laufzeit: maiaNode() };
    const datei = join(ordner, `${sperre}-E${lesestaerke}${zusatz}.json`);
    const alt = existsSync(datei)
      ? (JSON.parse(readFileSync(datei, "utf8")) as { partien: Sperrpartie[] }).partien
      : [];
    let partien = [...alt];
    for (let n = 0; n < partienZahl; n += 1) {
      const saat = saatAb + n + 1;
      const leser = bots[(saat - 1) % bots.length] ?? "";
      const partie = await spiele(engine, einstellung, form, leser, maia, saat);
      partien = [...partien.filter((p) => p.saat !== saat), partie];
      mkdirSync(ordner, { recursive: true });
      const kopf = {
        sperre,
        lesestaerke,
        stufenJePhase: einstellung.stufenJePhase,
        haeufigkeit: einstellung.haeufigkeit,
      };
      writeFileSync(datei, JSON.stringify({ ...kopf, partien }, null, 1));
    }
    console.log(zeile(sperre, lesestaerke, partien));
    expect(partien.length).toBeGreaterThanOrEqual(partienZahl);
  });
});
