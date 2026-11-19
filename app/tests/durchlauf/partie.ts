/**
 * Partien im Spieler-Durchlauf: Der Spieler liest die Stellung aus dem Speicher der App, lässt
 * Stockfish unter Node einen Zug wählen (tests/e2e/abenteuer-zugwahl.ts) und tippt ihn auf dem
 * Brett der Spielhülle an, bis die Partie zu Ende ist; dann „Weiter“ zurück in die Welt.
 *
 * Warum: Partien sollen wirklich gespielt werden (Wunsch des Autors, 18.11.2026), ohne die
 * Testknöpfe der Hülle. Gemessen werden Halbzüge, eigene Züge und Dauer.
 * Spielstärke: meist der beste Zug bei kleiner Tiefe, ab und zu ein Zug, der bis zu einen halben
 * Bauern schlechter ist (fester Zufall); das gewinnt fast immer, spielt aber nicht wie eine Engine
 * auf voller Stärke.
 * Abhängigkeiten: abenteuer-zugwahl.ts (Stockfish, Stellung), eingabe.ts, fenster.ts, lage.ts.
 * Beispiel: spielePartie(lauf, g) nach der Deckwahl → Partiemessung mit 62 Halbzügen, Sieg.
 */
import { Chess } from "chessops/chess";
import { parseFen } from "chessops/fen";
import { spielerDesProzesses, stellungNach } from "../e2e/abenteuer-zugwahl";
import { tippe, type Lauf } from "./eingabe";
import { bedieneDialog, bedieneUpdate, type Fenstergedaechtnis } from "./fenster";
import { liesLage, liesSpeicher, type Partielage } from "./lage";
import type { Partiemessung } from "./messung";
import { brichPartieAb, gibAuf, schwaechsterZug } from "./schwach";

/** So viel schlechter als der beste Zug darf ein gewählter Zug sein (Bauern). */
const SPIELRAUM = 0.5;
/** Mit dieser Wahrscheinlichkeit nimmt der Spieler nicht den besten Zug. */
const ANTEIL_ZWEITBESTER = 0.25;
/** So lange wartet der Spieler auf seinen eigenen Zug im Speicher (ms). */
const ZUG_FRIST_MS = 6000;
/** So lange ohne jede Änderung gilt die Partie als festgefahren (ms). */
const STILLSTAND_MS = 120_000;
/** Mehr Halbzüge spielt der Durchlauf nicht; danach gibt er auf (Schutz vor Endlospartien). */
const MAX_HALBZUEGE = 400;

/** Fester Zufall (mulberry32), damit ein Lauf sich wiederholen lässt. */
let saat = 20261118;
function zufall(): number {
  saat = (saat + 0x6d2b79f5) >>> 0;
  let z = saat;
  z = Math.imul(z ^ (z >>> 15), z | 1);
  z ^= z + Math.imul(z ^ (z >>> 7), z | 61);
  return ((z ^ (z >>> 14)) >>> 0) / 4294967296;
}

/** Alle Züge als Varianten (wie abenteuer-zugwahl.ts) und die zuletzt eingestellte Zahl. */
const ALLE_VARIANTEN = 120;
let eingestellt = ALLE_VARIANTEN;

/** Die Engine des Spielers, so weit hier gebraucht (Zahl der Varianten umstellen). */
interface Engine {
  processCommand(befehl: string): void;
}

/** So lange darf Stockfish an einer Stellung rechnen, bevor der Durchlauf abbricht (ms). */
const ENGINE_FRIST_MS = 15_000;

/**
 * Alle Züge einer Stellung mit Wert, der beste zuerst; leer, wenn die Stellung nicht regelgerecht
 * ist (dann antwortete Stockfish nie) oder die Engine nicht rechtzeitig antwortet.
 * Beispiel: Stellung ohne schwarzen König (mitten in einer Animation gelesen) → [].
 */
export async function bewerteStellung(
  fen: string,
  varianten = ALLE_VARIANTEN,
): Promise<{ uci: string; wert: number }[]> {
  const aufbau = parseFen(fen);
  if (aufbau.isErr || Chess.fromSetup(aufbau.value).isErr) return [];
  // Mit wenigen Varianten rechnet Stockfish in derselben Zeit tiefer (Aufgaben mit Matt in drei).
  if (varianten !== eingestellt) {
    const engine = (spielerDesProzesses() as unknown as { engine: Engine }).engine;
    engine.processCommand(`setoption name MultiPV value ${varianten}`);
    eingestellt = varianten;
  }
  let wecker: NodeJS.Timeout | undefined;
  const frist = new Promise<never[]>((fertig) => {
    wecker = setTimeout(() => fertig([]), ENGINE_FRIST_MS);
  });
  const ergebnis = await Promise.race([spielerDesProzesses().bewerteAlle(fen), frist]);
  clearTimeout(wecker);
  return ergebnis;
}

/** Tiefe und Rechenzeit für Aufgaben: tiefer als in Partien, damit Opfer mit Matt gefunden werden. */
const AUFGABEN_TIEFE = 16;
const AUFGABEN_MS = 7000;

/**
 * Die besten Züge einer Aufgabenstellung, gründlicher gerechnet als in Partien (wenige Varianten,
 * größere Tiefe, mehr Zeit). Warum eigens: Laufen zwei Browser zugleich, kommt Stockfish in den
 * zwei Sekunden der Partiezüge nicht tief genug; ein Damenopfer mit Matt in drei blieb ungesehen
 * (Garage in Desert Springs, 19.11.2026). Ausgabe wie bewerteStellung; leer bei regelwidriger
 * Stellung oder ohne Antwort.
 */
export async function bewerteAufgabe(
  fen: string,
  varianten: number,
): Promise<{ uci: string; wert: number }[]> {
  const aufbau = parseFen(fen);
  if (aufbau.isErr || Chess.fromSetup(aufbau.value).isErr) return [];
  const spieler = spielerDesProzesses() as unknown as {
    engine: Engine;
    beiZeile: (zeile: string) => void;
  };
  if (varianten !== eingestellt) {
    spieler.engine.processCommand(`setoption name MultiPV value ${varianten}`);
    eingestellt = varianten;
  }
  return new Promise((fertig) => {
    const funde = new Map<string, number>();
    const wecker = setTimeout(() => fertig([]), AUFGABEN_MS + ENGINE_FRIST_MS);
    spieler.beiZeile = (zeile) => {
      const zug = / pv (\S+)/.exec(zeile)?.[1];
      const wert = /score (cp|mate) (-?\d+)/.exec(zeile);
      if (zeile.startsWith("info") && zug && wert) {
        const zahl = Number(wert[2]);
        funde.set(zug, wert[1] === "cp" ? zahl / 100 : Math.sign(zahl) * 100);
      }
      if (!zeile.startsWith("bestmove")) return;
      clearTimeout(wecker);
      fertig([...funde].map(([uci, w]) => ({ uci, wert: w })).sort((x, y) => y.wert - x.wert));
    };
    spieler.engine.processCommand(`position fen ${fen}`);
    spieler.engine.processCommand(`go depth ${AUFGABEN_TIEFE} movetime ${AUFGABEN_MS}`);
  });
}

/** Wählt den Zug des Spielers für die Stellung (UCI). */
async function waehleZug(fen: string): Promise<string> {
  const alle = (await bewerteStellung(fen)).filter((k) => !/[rbn]$/.test(k.uci));
  const bester = alle[0];
  if (!bester) throw new Error(`Kein Zug in der Stellung ${fen}`);
  const nah = alle.filter((k) => k.wert >= bester.wert - SPIELRAUM);
  if (nah.length > 1 && zufall() < ANTEIL_ZWEITBESTER) {
    return (nah[1 + Math.floor(zufall() * (nah.length - 1))] ?? bester).uci;
  }
  return bester.uci;
}

/** Der schwächste Zug der Stellung (schwacher Spieler, schwach.ts); ohne Bewertung der beste. */
async function schwacherZug(fen: string): Promise<string> {
  const alle = (await bewerteStellung(fen)).filter((k) => !/[rbn]$/.test(k.uci));
  return schwaechsterZug(alle) ?? (await waehleZug(fen));
}

/** Tippt einen Zug (UCI) mit dem Finger auf dem Brett der Hülle; false, wenn ein Feld fehlt. */
async function tippeZug(lauf: Lauf, uci: string): Promise<boolean> {
  const brett = lauf.seite.locator(".abenteuer-partie-brett");
  const feld = (name: string) => brett.getByRole("button", { name: new RegExp(`^${name}(,|$)`) });
  if (!(await tippe(lauf, feld(uci.slice(0, 2)), `Brettfeld ${uci.slice(0, 2)}`))) return false;
  await lauf.seite.waitForTimeout(80);
  if (!(await tippe(lauf, feld(uci.slice(2, 4)), `Brettfeld ${uci.slice(2, 4)}`))) return false;
  if (uci.length > 4) {
    const dame = lauf.seite.getByRole("dialog").getByRole("button", { name: /Dame/ });
    await dame.waitFor({ state: "visible", timeout: 3000 }).catch(() => undefined);
    await tippe(lauf, dame, "Umwandlung in die Dame");
  }
  return true;
}

/** Ausgang aus Sicht des Lesers. */
function ausgangVon(p: Partielage): Partiemessung["ausgang"] {
  if (!p.ende) return "offen";
  if (!p.sieger) return "remis";
  return p.sieger === p.eigeneFarbe ? "sieg" : "niederlage";
}

/** Wer in dieser Stellung am Zug ist. */
function amZug(fen: string): "white" | "black" {
  return fen.split(" ")[1] === "b" ? "black" : "white";
}

/** Wartet, bis der eigene Zug im Speicher steht; false nach der Frist. */
async function warteAufZug(lauf: Lauf, id: string, halbzuege: number): Promise<boolean> {
  const ende = Date.now() + ZUG_FRIST_MS;
  while (Date.now() < ende) {
    const p = (await liesSpeicher(lauf.seite)).partie;
    if (!p || p.id !== id || p.ende || p.zuege.length > halbzuege) return true;
    await lauf.seite.waitForTimeout(80);
  }
  return false;
}

/**
 * Spielt die offene Partie zu Ende und tippt „Weiter“. Ausgabe: die Messung der Partie, oder null,
 * wenn keine Partie zu sehen war. Sonderfälle: erzählter Einstieg und Gespräche in der Partie
 * werden gelesen und weggetippt; kommt ein Zug nicht an, ist das ein Fund.
 */
export async function spielePartie(
  lauf: Lauf,
  g: Fenstergedaechtnis,
): Promise<Partiemessung | null> {
  const seite = lauf.seite;
  const beginn = Date.now();
  let letzteAenderung = Date.now();
  let letzterStand = "";
  let fehlzuege = 0;
  let partie: Partielage | null = null;
  while (Date.now() < lauf.frist) {
    const lage = await liesLage(seite);
    if (lage.bild !== "partie") break;
    if (await bedieneUpdate(lauf, lage)) continue;
    const p = (await liesSpeicher(seite)).partie;
    if (p) partie = p;
    const abdruck = `${p?.id ?? ""}|${p?.zuege.length ?? 0}|${p?.ende ?? ""}|${lage.dialog?.text ?? ""}|${lage.kennungen.length}`;
    if (abdruck !== letzterStand) {
      letzterStand = abdruck;
      letzteAenderung = Date.now();
    } else if (Date.now() - letzteAenderung > STILLSTAND_MS) {
      lauf.messung.fund(
        "partie",
        `Partie ${p?.kennung ?? "?"} steht seit ${STILLSTAND_MS / 1000} s`,
      );
      letzteAenderung = Date.now();
    }
    if (lage.dialog) {
      await bedieneDialog(lauf, lage, g);
      continue;
    }
    if (lage.kennungen.includes("abenteuer-erzaehlung")) {
      const erzaehlung = seite.getByTestId("abenteuer-erzaehlung");
      const text = (await erzaehlung.innerText({ timeout: 2000 }).catch(() => "")).trim();
      lauf.messung.meldung(text);
      lauf.messung.log(`  Einstieg: ${text.replace(/\s+/g, " ").slice(0, 200)}`);
      await tippe(lauf, seite.getByTestId("abenteuer-erzaehlung-weiter"), "Erzählung „Weiter“");
      await seite.waitForTimeout(200);
      continue;
    }
    const zurueck = seite.getByTestId("partie-zurueck-zur-stadt");
    if (await zurueck.isVisible().catch(() => false)) {
      const nachwort = await seite
        .getByTestId("abenteuer-nachwort")
        .innerText({ timeout: 1000 })
        .catch(() => "");
      if (nachwort) lauf.messung.meldung(nachwort);
      if (nachwort) lauf.messung.log(`  Nachwort: ${nachwort.replace(/\s+/g, " ")}`);
      await tippe(lauf, zurueck, "Partie „Weiter“");
      await seite.waitForTimeout(400);
      continue;
    }
    const status = await seite
      .getByTestId("partiestatus")
      .innerText({ timeout: 2000 })
      .catch(() => "");
    if (!p?.laeuft || !/Du bist am Zug/.test(status)) {
      if (process.env.DURCHLAUF_SPUR)
        lauf.messung.log(
          `    Partie wartet: Status „${status}“, läuft ${String(p?.laeuft)}, Züge ${p?.zuege.length ?? -1}`,
        );
      await seite.waitForTimeout(150);
      continue;
    }
    const fen = stellungNach(p);
    if (amZug(fen) !== p.eigeneFarbe) {
      await seite.waitForTimeout(150);
      continue;
    }
    if (p.zuege.length >= MAX_HALBZUEGE) {
      lauf.messung.fund(
        "partie",
        `Partie ${p.kennung}: ${MAX_HALBZUEGE} Halbzüge ohne Ende, gebe auf`,
      );
      await gibAuf(lauf);
      continue;
    }
    // Schwacher Spieler (schwach.ts): aufgeben oder neu laden, sonst der schwächste Zug.
    if (await brichPartieAb(lauf, p)) continue;
    const schwach = lauf.schwach.partie(p.id, p.kennung).art !== null;
    const uci = schwach ? await schwacherZug(fen) : await waehleZug(fen);
    const getippt = await tippeZug(lauf, uci);
    if (getippt && (await warteAufZug(lauf, p.id, p.zuege.length))) {
      fehlzuege = 0;
      continue;
    }
    fehlzuege += 1;
    if (fehlzuege === 3) {
      lauf.messung.fund(
        "brett",
        `Partie ${p.kennung}: Zug ${uci} kommt nicht an (Stellung ${fen})`,
      );
    }
    await seite.waitForTimeout(500);
  }
  if (!partie) return null;
  // Das Ende steht manchmal erst nach dem Bildwechsel im Speicher (Partien mit fester Zugzahl).
  const zuletzt = (await liesSpeicher(seite)).partie;
  if (zuletzt?.id === partie.id) partie = zuletzt;
  const eigene = partie.zuege.filter(
    (_, i) => (i % 2 === 0) === (amZug(partie.startFen) === partie.eigeneFarbe),
  );
  const messung: Partiemessung = {
    kennung: partie.kennung,
    halbzuege: partie.zuege.length,
    eigeneZuege: eigene.length,
    ende: partie.ende,
    ausgang: ausgangVon(partie),
    ms: Date.now() - beginn,
    karte: lauf.messung.karte,
  };
  lauf.messung.jetzt.partien.push(messung);
  lauf.messung.log(
    `PARTIE ${partie.kennung}: ${messung.ausgang} (${partie.ende ?? "offen"}), ${messung.halbzuege} Halbzüge, ` +
      `Start ${partie.startFen} Züge: ${partie.zuege.join(" ")}`,
  );
  lauf.messung.sichere();
  return messung;
}
