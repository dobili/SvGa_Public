/**
 * Der Zug des Bots in der laufenden Partie: Profil, Stufe, Bedenkzeit, sichtbares Nachdenken,
 * Zug mit Uhr und Notmodus mit Vorzügen.
 *
 * Rolle im Gesamtbild: Aus ui/komponenten/usePartie.ts ausgelagert (0.2.117), als der Notmodus
 * (spiel/notmodus.ts, Idee des Autors vom 21.10.2026) dazukam. usePartie ruft je Zug entweder
 * normalerBotzug oder, im Notmodus, spieleVorzug; beide lesen und schreiben die Partie im
 * Speicher, damit sie ein Neuladen übersteht.
 * Abhängigkeiten: engine/, spiel/, speicher/, ui/komponenten/botNotmodus.ts.
 */
import { engine } from "../../engine/engineDienst";
import { gegnerVon } from "../../engine/gegner";
import { tagesform, type Verlauf } from "../../engine/menschlich";
import { naechsteStufe, stufe, type Stufennummer } from "../../engine/stufen";
import { wahltempo } from "../../engine/wahlmodell";
import { BUCHTREUE, REINES_PROFIL, type Gegnerprofil } from "../../engine/zugwahl";
import {
  botBedenkzeit,
  eigeneRestzeit,
  sichtbareWartezeit,
  zieheBotMitUhr,
} from "../../spiel/botzeit";
import { mitUhrverzug } from "../../spiel/ablauf";
import { engineZugMitLage } from "../../spiel/enginezug";
import {
  bleibtImNotmodus,
  brauchtNotmodus,
  notmodusZeitUm,
  VORZUG_MS,
  zieheImNotmodus,
} from "../../spiel/notmodus";
import { aktuelleFen, type Partie } from "../../spiel/partie";
import { phaseVon } from "../../spiel/phasen";
import { uciZuSan } from "../../spiel/zuege";
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
export function stufeFuer(partie: Partie, fen: string): Stufennummer {
  const ziel = partie.einstellung.stufenJePhase[phaseVon(fen) ?? "mittelspiel"];
  const letzter = [...partie.zuege].reverse().find((z) => z.von === "engine" && z.stufe);
  return letzter?.stufe ? naechsteStufe(letzter.stufe, ziel) : ziel;
}

/** Der Verlauf der Partie für die Fehlerneigung (engine/menschlich.ts): die Tagesform. */
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
  if (e.bot === null) {
    // Ohne Bot spielt die Stufe rein (seit 0.2.117); nur abgehakte blinde Flecken kommen dazu
    return {
      ...REINES_PROFIL,
      blindeFlecken: e.blindeFlecken ?? [],
      fleckGewicht: 1,
      verlauf: verlaufVon(partie),
      restMs: eigeneRestzeit(partie, jetztMs),
      tempo: wahltempo(e.uhr),
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
    gewichte: e.gewichte ?? bot?.gewichte,
    haeufigkeit: e.haeufigkeit ?? bot?.haeufigkeit,
    hoechstverlust: e.hoechstverlust,
    restMs: eigeneRestzeit(partie, jetztMs),
    tempo: wahltempo(e.uhr),
  };
}

/** Wartet, bis der Bot sichtbar nachgedacht hat (nur mit Uhr; die Rechenzeit zählt mit). */
function sichtbarNachdenken(bedenk: number | null, rest: number | null, start: number) {
  if (bedenk === null || rest === null) return Promise.resolve();
  const warten = sichtbareWartezeit(bedenk, rest) - (Date.now() - start);
  return new Promise<void>((fertig) => setTimeout(fertig, Math.max(0, warten)));
}

/** Ist die App sichtbar? Im Hintergrund bleibt die Uhr nach dem Zug stehen (sonst liefe die Zeit des Lesers). */
function appSichtbar(): boolean {
  return document.visibilityState !== "hidden";
}

/** Die Zugwahl des Bots für eine Stellung, mit seiner Restzeit (für die Vorzüge im Notmodus). */
function zugwahlDesBots(partie: Partie, stufennummer: Stufennummer, restMs: number) {
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
export async function normalerBotzug(
  id: string,
  fen: string,
  stufennummer: Stufennummer,
  buchzuege: { zuege: string[]; treue: number },
  laeuft: () => boolean,
): Promise<void> {
  const start = Date.now();
  const jetzige = neueste(id);
  const profil = jetzige ? profilDerPartie(jetzige, start) : undefined;
  const st = stufe(stufennummer);
  const ergebnis = await engineZugMitLage(
    engine,
    fen,
    st,
    buchzuege.zuege,
    Math.random,
    buchzuege.treue,
    profil,
  );
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
  await sichtbarNachdenken(bedenk, rest, start);
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
