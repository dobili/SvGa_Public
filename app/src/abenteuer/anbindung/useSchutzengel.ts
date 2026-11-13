/**
 * Der Schutzengel in der Partie (K4, regeln/schutzengel.ts): Solange die Karte wacht, prüft die
 * Spielhülle jeden Zug des Helden mit der Engine, bevor er ausgeführt wird. Ein grober Fehler wird
 * nicht gespielt; Ambrose hält ihn mit einer Zeile auf, und der Held zieht neu.
 *
 * Rolle im Gesamtbild: anbindung/PartieHuelle.tsx gibt die Steuerung mit dem geprüften Zug an das
 * Brett (useLeserzug). Damit gute Züge nicht spürbar warten, rechnet die Engine den besten Wert
 * der Stellung schon, wenn der Held am Zug ist; nach dem Zug nur eine kurze Bewertung. Fällt die
 * Engine aus, wird der Zug gespielt (der Engel hilft, er blockiert nie).
 * Abhängigkeiten: engine/engineDienst.ts, spiel/zuege.ts, speicher/speicher.ts, regeln/schutzengel.ts.
 */
import { useEffect, useState } from "react";
import { engine } from "../../engine/engineDienst";
import type { Wert } from "../../engine/uci";
import { aendere } from "../../speicher/speicher";
import { leserAmZug, type Partie } from "../../spiel/partie";
import { fenNach } from "../../spiel/zuege";
import type { Partiesteuerung } from "../../ui/komponenten/partie/usePartie";
import {
  mitAusgeloestemSchutzengel,
  schutzengelWacht,
  schutzgrund,
  type Schutzgrund,
} from "../regeln/schutzengel";
import { useAbenteuerstand } from "./dienste";

/** Rechenzeit je Bewertung (ms): kurz, damit ein guter Zug kaum wartet. */
const PRUEF_MS = 250;
/** Gemerkte beste Werte je Stellung (vorab gerechnet, solange der Held überlegt). */
const besteWerte = new Map<string, Promise<Wert | null>>();
const MERKER_GROESSE = 50;

/** Wert der Stellung (Sicht von Weiß) aus einer kurzen Bewertung; null ohne Variante. */
function bewerte(fen: string): Promise<Wert | null> {
  return engine.bewerte(fen, PRUEF_MS, 1).then((b) => b.varianten[0]?.wert ?? null);
}

/** Bester Wert vor dem Zug, einmal je Stellung gerechnet. */
function besterWert(fen: string): Promise<Wert | null> {
  let wert = besteWerte.get(fen);
  if (!wert) {
    if (besteWerte.size >= MERKER_GROESSE) besteWerte.clear();
    wert = bewerte(fen);
    besteWerte.set(fen, wert);
  }
  return wert;
}

/** Ist der Zug ein grober Fehler? null, wenn nicht oder wenn die Engine nichts sagt. */
async function pruefe(fen: string, san: string, heldWeiss: boolean): Promise<Schutzgrund | null> {
  const danach = fenNach(fen, san);
  if (!danach) return null;
  const [vorher, nachher] = await Promise.all([besterWert(fen), bewerte(danach)]);
  return vorher && nachher ? schutzgrund(vorher, nachher, heldWeiss) : null;
}

/**
 * Steuerung mit Schutzengel. Eingaben: Steuerung und Partie. Ausgabe: Steuerung für das Brett,
 * der Grund des Aufhaltens (oder null) und Schließen der Zeile.
 */
export function useSchutzengel(s: Partiesteuerung, partie: Partie) {
  const stand = useAbenteuerstand();
  const wacht = schutzengelWacht(
    stand?.partiekarten ?? null,
    partie.zuege.map((z) => z.von === "leser"),
  );
  const amZug = leserAmZug(partie) && !partie.ende;
  const [halt, setzeHalt] = useState<Schutzgrund | null>(null);
  const [prueft, setzePrueft] = useState(false);
  useEffect(() => {
    if (wacht && amZug) void besterWert(s.fen).catch(() => null);
  }, [wacht, amZug, s.fen]);
  const spieleLeser = (san: string) => {
    if (prueft) return;
    if (!wacht) {
      s.spieleLeser(san);
      return;
    }
    setzePrueft(true);
    setzeHalt(null);
    pruefe(s.fen, san, partie.einstellung.eigeneFarbe === "white")
      .catch((fehler: unknown) => {
        console.warn("Schutzengel: Engine ohne Antwort, der Zug wird gespielt", fehler);
        return null;
      })
      .then((grund) => {
        if (!grund) {
          s.spieleLeser(san);
          return;
        }
        setzeHalt(grund);
        void aendere((d) => ({
          ...d,
          abenteuer: d.abenteuer ? mitAusgeloestemSchutzengel(d.abenteuer) : d.abenteuer,
        }));
      })
      .finally(() => setzePrueft(false));
  };
  return {
    steuerung: { ...s, spieleLeser },
    halt,
    schliesse: () => setzeHalt(null),
  };
}
