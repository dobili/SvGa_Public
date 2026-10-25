/**
 * Der Zug des Bots in der laufenden Partie: Profil, Stufe, Bedenkzeit (seit 0.2.126 ohne sichtbares Warten),
 * Zug mit Uhr und Notmodus mit Vorzügen.
 *
 * Rolle im Gesamtbild: Aus ui/komponenten/usePartie.ts ausgelagert (0.2.117), als der Notmodus
 * (spiel/notmodus.ts, Idee des Autors vom 21.10.2026) dazukam. usePartie ruft je Zug entweder
 * normalerBotzug oder, im Notmodus, spieleVorzug; beide lesen und schreiben die Partie im
 * Speicher, damit sie ein Neuladen übersteht.
 * Abhängigkeiten: engine/, spiel/, speicher/, ui/komponenten/botNotmodus.ts.
 */
import { wertungDerPersoenlichkeit } from "../../engine/persoenlichkeitswertung";
import { engine } from "../../engine/engineDienst";
import { gegnerVon } from "../../engine/gegner";
import { gruppenstufe } from "../../engine/gruppe";
import { gruppenzug, mitgliederFuer, type Gruppenmitglied } from "../../engine/gruppenwahl";
import { faktorenAus } from "../../engine/gegnerbau";
import { tagesform, type Verlauf } from "../../engine/menschlich";
import { naechsteStufe, stufe, type Stufennummer } from "../../engine/stufen";
import { wahltempo } from "../../engine/wahlmodell";
import { MAIA_WEB } from "../../engine/maia-web";
import { BUCHTREUE, REINES_PROFIL, type Gegnerprofil } from "../../engine/zugwahl";
import { botBedenkzeit, eigeneRestzeit, zieheBotMitUhr } from "../../spiel/botzeit";
import { mitUhrverzug } from "../../spiel/ablauf";
import { engineZugMitLage } from "../../spiel/enginezug";
import {
  bleibtImNotmodus,
  brauchtNotmodus,
  notmodusZeitUm,
  VORZUG_MS,
  zieheImNotmodus,
} from "../../spiel/notmodus";
import { aktuelleFen, type Partie, type Partiezug } from "../../spiel/partie";
import { phaseVon } from "../../spiel/phasen";
import { sanZuUci, uciZuSan } from "../../spiel/zuege";
import { GRUNDSTELLUNG } from "../../spiel/stellungsbau";
import { BUCHTIEFE, linienzug, praxiszug, type Praxisbuch } from "../../engine/praxisbuch";
import { wertungInZeitklasse } from "../../engine/zeitklassenabstand";
import { findePartie, mitPartie } from "../../speicher/partien";
import { aendere, speicherzustand } from "../../speicher/speicher";
import { animationsverzugMs } from "../brett/useZuganimation";
import { beendeNotmodus, planeNotmodus } from "./botNotmodus";

/** Die Partie in ihrem neuesten Stand (nicht aus einem älteren Render). */
export function neueste(id: string): Partie | null {
  return findePartie(speicherzustand().daten.spiel, id);
}

/** Schreibt eine Partie in den Speicher (laufend oder, wenn beendet, abgelegt). */
export function schreibe(partie: Partie): void {
  void aendere((daten) => ({ ...daten, spiel: mitPartie(daten.spiel, partie) }));
}

/** Ändert die neueste Partie mit einer reinen Funktion; Gleiches schreibt nichts. Gibt sie zurück. */
export function aendereNeueste(
  id: string,
  aenderung: (partie: Partie) => Partie | null,
): Partie | null {
  const partie = neueste(id);
  const neu = partie ? aenderung(partie) : null;
  if (neu && neu !== partie) schreibe(neu);
  return neu;
}

/**
 * Die Stufe der Engine für diesen Zug (0.2.40): die Stufe der Phase der Stellung, erreicht Zug
 * für Zug um höchstens eine Stufe von der Stufe des vorigen Engine-Zuges aus.
 * Beispiel: Eröffnung 1, Mittelspiel 4: erster Zug im Mittelspiel 2, dann 3, dann 4.
 */
export function stufeFuer(
  partie: Pick<Partie, "zuege" | "einstellung">,
  fen: string,
): Stufennummer {
  const ziel = partie.einstellung.stufenJePhase[phaseVon(fen) ?? "mittelspiel"];
  const letzter = [...partie.zuege].reverse().find((z) => z.von === "engine" && z.stufe);
  return letzter?.stufe ? naechsteStufe(letzter.stufe, ziel) : ziel;
}

/** Der Verlauf der Partie für die Fehlerneigung (engine/menschlich.ts): die Tagesform. */
/**
 * Maia für die Züge des Bots (0.2.143), wenn die Partie mit Maia begann (Paket geladen und
 * eingeschaltet, Spielen.tsx). Die Laufzeit lädt die Netze beim ersten Zug aus dem Speicher.
 */
function maiaDerPartie(partie: Partie): Pick<Gegnerprofil, "maia"> {
  return partie.einstellung.maia ? { maia: { laufzeit: MAIA_WEB } } : {};
}

function verlaufVon(partie: Partie): Verlauf {
  return { tagesform: tagesform(partie.id) };
}

/**
 * Das Profil des Gegners für den nächsten Zug: ohne Bot die reine Stufe (seit 0.2.117), bei eigenen
 * Gegnern die Einstellung der Partie, bei vorgefertigten Bots Gewichte und Zufallszüge aus der
 * Liste, dazu Verlauf und Restzeit der eigenen Uhr (Zeitnot, seit 0.2.117).
 */
function profilDerPartie(partie: Partie, jetztMs: number): Gegnerprofil {
  const e = partie.einstellung;
  if (e.bot === null && e.stilname !== undefined) {
    // Seit 0.2.126 spielt die eigene Stufe wie ein eigener Bot (Wunsch des Autors): angehakte
    // Fehlerarten wie Menschen, angehakte Flecken an, übrige aus; Stil und Regler wie dort.
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
      verlauf: verlaufVon(partie),
      restMs: eigeneRestzeit(partie, jetztMs),
      tempo: wahltempo(e.uhr),
      ...maiaDerPartie(partie),
    };
  }
  if (e.bot === null) {
    // Partien von vor 0.2.126 (ohne Stil): Die Stufe spielt rein wie damals; nur abgehakte
    // blinde Flecken kommen dazu
    return {
      ...REINES_PROFIL,
      blindeFlecken: e.blindeFlecken ?? [],
      fleckGewicht: 1,
      verlauf: verlaufVon(partie),
      restMs: eigeneRestzeit(partie, jetztMs),
      tempo: wahltempo(e.uhr),
      ...maiaDerPartie(partie),
    };
  }
  const bot = gegnerVon(e.bot);
  // Eigene Gegner: Abgehakte Flecken sind an (wie Menschen), die übrigen aus
  const eigen = bot ? {} : { fleckenStandard: 0, fleckGewicht: 1 };
  return {
    ...eigen,
    fehlerarten: e.fehlerarten ?? null,
    stil: e.stil ?? 0,
    blindeFlecken: e.blindeFlecken ?? [],
    verlauf: verlaufVon(partie),
    // Spaß-Bots (0.2.88) und Gewichte der Bots stehen in der Liste, nicht in der Partie.
    zufallszuege: bot?.zufallszuege,
    // Vorgefertigte Bots (0.2.125): Faktoren aus den Stufen ihrer Persönlichkeit und ihrer Wertung
    // (seit 0.2.143 die feste Wertung der Messung, engine/persoenlichkeitswertung.ts)
    gewichte:
      e.gewichte ??
      (bot ? faktorenAus(bot.persoenlichkeit, wertungDerPersoenlichkeit(bot)) : undefined),
    // Eigene Gegner mit gewähltem Stil (0.2.126) wie vorgefertigte Bots
    stilname: e.stilname ?? bot?.stilname,
    stilmix: e.stilmix,
    haeufigkeit: e.haeufigkeit ?? bot?.haeufigkeit,
    hoechstverlust: e.hoechstverlust,
    restMs: eigeneRestzeit(partie, jetztMs),
    tempo: wahltempo(e.uhr),
    ...maiaDerPartie(partie),
  };
}

/** Die Mitglieder der Gruppe für diesen Zug mit Tagesform, Restzeit und Zeitklasse der Partie. */
function gruppenmitglieder(partie: Partie, fen: string, jetztMs: number): Gruppenmitglied[] {
  const e = partie.einstellung;
  const nummer = gruppenstufe(e.bot);
  if (nummer === null) return [];
  return mitgliederFuer(nummer, phaseVon(fen) ?? "mittelspiel", {
    verlauf: verlaufVon(partie),
    restMs: eigeneRestzeit(partie, jetztMs),
    tempo: wahltempo(e.uhr),
    ...maiaDerPartie(partie),
  });
}

/** Die Zugwahl der Gruppe als Ergebnis wie engineZugMitLage; null ohne legalen Zug. */
async function gruppenZugMitLage(
  partie: Partie,
  fen: string,
  jetztMs: number,
): Promise<{ zug: Partiezug; uci: string; breite?: number } | null> {
  const mitglieder = gruppenmitglieder(partie, fen, jetztMs);
  const wahl = await gruppenzug(engine, fen, mitglieder, Math.random, verlaufVon(partie));
  const san = wahl ? uciZuSan(fen, wahl.uci) : null;
  if (!wahl || !san) return null;
  const zug: Partiezug = {
    san,
    von: "engine",
    quelle: wahl.quelle,
    fehler: wahl.fehler,
    verlust: wahl.verlust,
  };
  return { zug, uci: wahl.uci, breite: wahl.breite };
}

/** Ist die App sichtbar? Im Hintergrund bleibt die Uhr nach dem Zug stehen (sonst liefe die Zeit des Lesers). */
function appSichtbar(): boolean {
  return document.visibilityState !== "hidden";
}

/** Die Zugwahl des Bots für eine Stellung, mit seiner Restzeit (für die Vorzüge im Notmodus). */
function zugwahlDesBots(partie: Partie, stufennummer: Stufennummer, restMs: number) {
  if (gruppenstufe(partie.einstellung.bot) !== null) {
    return async (f: string) => (await gruppenZugMitLage(partie, f, Date.now()))?.uci ?? null;
  }
  const profil = { ...profilDerPartie(partie, Date.now()), restMs };
  return async (f: string) =>
    (await engineZugMitLage(engine, f, stufe(stufennummer), [], Math.random, BUCHTREUE, profil))
      ?.uci ?? null;
}

/** Nach einem Zug im Notmodus: weiter vorausplanen oder den Modus verlassen (spiel/notmodus.ts). */
function nachNotzug(id: string, partie: Partie | null, stufennummer: Stufennummer): void {
  if (!partie?.uhr || partie.ende) return beendeNotmodus(id);
  const bot = partie.einstellung.eigeneFarbe === "white" ? "black" : "white";
  const rest = partie.uhr.restMs[bot];
  if (!bleibtImNotmodus(rest)) return beendeNotmodus(id);
  planeNotmodus(id, aktuelleFen(partie), zugwahlDesBots(partie, stufennummer, rest));
}

/** Spielt einen Vorzug des Notmodus nach kurzer sichtbarer Pause, oder die Zeit ist um. */
export async function spieleVorzug(
  id: string,
  fen: string,
  vorzug: string,
  stufennummer: Stufennummer,
  laeuft: () => boolean,
): Promise<void> {
  await new Promise((fertig) => setTimeout(fertig, VORZUG_MS));
  const jetzt = neueste(id);
  if (!laeuft() || !jetzt || aktuelleFen(jetzt) !== fen) return;
  if (vorzug === "zeitUm") {
    beendeNotmodus(id);
    aendereNeueste(id, (p) => notmodusZeitUm(p, Date.now()));
    return;
  }
  const san = uciZuSan(fen, vorzug);
  if (!san) throw new Error(`Vorzug geht nicht: ${vorzug} in ${fen}`);
  const zug = {
    san,
    von: "engine",
    quelle: "engine",
    fehler: null,
    verlust: 0,
    stufe: stufennummer,
  } as const;
  const danach = aendereNeueste(id, (p) =>
    mitUhrverzug(zieheImNotmodus(p, zug, Date.now(), false, appSichtbar()), animationsverzugMs()),
  );
  nachNotzug(id, danach, stufennummer);
}

/**
 * Der normale Zug des Bots: Zugwahl, simulierte Bedenkzeit, sichtbares Nachdenken, Zug mit Uhr.
 * Würde die Bedenkzeit nicht reichen, kommt er in den Notmodus statt auf Zeit zu verlieren.
 */
/**
 * Was die Partie an Buch vorgibt (ui/komponenten/usePartie.ts): Buchzüge in UCI mit Buchtreue, und
 * seit 0.2.128 das Praxisbuch mit einer festgelegten Linie (leer: nur nach Häufigkeit). Das
 * Praxisbuch gilt erst, wenn es keine Buchzüge gibt.
 */
export interface Buchvorgabe {
  readonly zuege: string[];
  readonly treue: number;
  readonly praxis?: { readonly buch: Praxisbuch; readonly linie: readonly string[] } | null;
}

/**
 * Ein Zug aus dem Praxisbuch wie ein Mensch der Stärke der Stufe (0.2.128, engine/praxisbuch.ts),
 * oder null: ohne Praxisbuch, nach einer eigenen Startstellung, für Spaß-Bots, am Buchende.
 * Eine festgelegte Linie hat Vorrang, solange die Partie ihr folgt.
 * Beispiel: Bot der Stufe 7 (etwa 2100) in Schnellschach nach 1. e4 → oft 1… c5, dann Sizilianisch.
 */
function praxisErgebnis(
  partie: Partie,
  fen: string,
  wertung: number,
  vorgabe: Buchvorgabe,
): { zug: Partiezug; uci: string; breite?: number } | null {
  const e = partie.einstellung;
  const bot = gegnerVon(e.bot);
  if (!vorgabe.praxis || vorgabe.zuege.length > 0 || e.startFen !== GRUNDSTELLUNG) return null;
  if (bot?.zufallszuege) return null;
  const verlauf = partie.zuege.map((z) => z.san);
  // Seit 0.2.131 die Wertung desselben Menschen in dieser Zeitklasse (engine/zeitklassenabstand.ts).
  const tempo = wahltempo(e.uhr);
  const lage = {
    tempo,
    wertung: wertungInZeitklasse(wertung, tempo),
    tiefe: bot?.buchtiefe ?? BUCHTIEFE.standard,
  };
  const san =
    linienzug(vorgabe.praxis.linie, verlauf) ??
    praxiszug(vorgabe.praxis.buch, verlauf, lage, Math.random);
  const uci = san ? sanZuUci(fen, san) : null;
  if (!san || !uci) return null;
  return { zug: { san, von: "engine", quelle: "buch", fehler: null, verlust: 0 }, uci };
}

export async function normalerBotzug(
  id: string,
  fen: string,
  stufennummer: Stufennummer,
  buchzuege: Buchvorgabe,
  laeuft: () => boolean,
): Promise<void> {
  const start = Date.now();
  const jetzige = neueste(id);
  const profil = jetzige ? profilDerPartie(jetzige, start) : undefined;
  const st = stufe(stufennummer);
  // Gruppenmodus: alle Bots der Stufe beraten sich (engine/gruppenwahl.ts), ohne Eröffnungsbuch.
  const ausBuch = jetzige ? praxisErgebnis(jetzige, fen, st.wertung, buchzuege) : null;
  const ergebnis =
    ausBuch ??
    (jetzige && gruppenstufe(jetzige.einstellung.bot) !== null
      ? await gruppenZugMitLage(jetzige, fen, start)
      : await engineZugMitLage(
          engine,
          fen,
          st,
          buchzuege.zuege,
          Math.random,
          buchzuege.treue,
          profil,
        ));
  const vorher = neueste(id);
  if (!laeuft() || !vorher || aktuelleFen(vorher) !== fen) return;
  if (!ergebnis) throw new Error(`Kein Zug der Engine in ${fen}`);
  const bedenk = botBedenkzeit(
    vorher,
    { uci: ergebnis.uci, quelle: ergebnis.zug.quelle, breite: ergebnis.breite },
    st.wertung,
    Date.now(),
    Math.random,
  );
  const rest = eigeneRestzeit(vorher, start);
  const jetzt = neueste(id);
  if (!laeuft() || !jetzt || aktuelleFen(jetzt) !== fen) return;
  const mitStufe = { ...ergebnis.zug, stufe: stufennummer };
  if (brauchtNotmodus(bedenk, rest)) {
    const danach = aendereNeueste(id, (p) =>
      mitUhrverzug(
        zieheImNotmodus(p, mitStufe, Date.now(), true, appSichtbar()),
        animationsverzugMs(),
      ),
    );
    nachNotzug(id, danach, stufennummer);
    return;
  }
  // R37: Die Uhr des Lesers läuft erst, wenn der Zug des Bots über das Brett geglitten ist.
  aendereNeueste(id, (p) =>
    mitUhrverzug(
      zieheBotMitUhr(p, mitStufe, bedenk, Date.now(), appSichtbar()),
      animationsverzugMs(),
    ),
  );
}
