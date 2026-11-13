/**
 * Zugerraten in der Partie (Halbfinale, Story-Bibel 34.3; regeln/zugerraten.ts): Nach dem
 * geführten Moment sucht der Held den Zug selbst. Solange er sucht, steht seine Uhr; ein Zug, der
 * nicht der gesuchte ist, wird nicht gespielt, und eine Zeile sagt es. Nach drei Fehlversuchen
 * kommt ein Hinweis, der keinen Zug nennt.
 *
 * Rolle im Gesamtbild: anbindung/PartieHuelle.tsx legt diese Steuerung um die des Schutzengels
 * und gibt sie dem Brett (useLeserzug). Gesucht ist der beste Zug der Engine in der Stellung;
 * er wird einmal je Stellung gerechnet, sobald das Zugerraten beginnt. Fällt die Engine aus,
 * gilt jeder Zug (das Zugerraten hilft, es blockiert nie).
 * Abhängigkeiten: engine/engineDienst.ts, regeln/zugerraten.ts, anbindung/useBegegnung.ts.
 */
import { useEffect, useMemo, useState } from "react";
import { engine } from "../../engine/engineDienst";
import { leserAmZug, stellungen, type Partie } from "../../spiel/partie";
import type { Partiesteuerung } from "../../ui/komponenten/partie/usePartie";
import {
  FEHLVERSUCHE_BIS_HINWEIS,
  hinweisschluessel,
  versuchTrifft,
  zugerratenLaeuft,
} from "../regeln/zugerraten";
import { useBegegnung } from "./useBegegnung";

/** Rechenzeit für den gesuchten Zug (ms): gründlich, die Uhr steht ja. */
const RECHENZEIT_MS = 2000;
/** Gesuchter Zug je Stellung (UCI oder null, wenn die Engine nichts sagt). */
const gesucht = new Map<string, Promise<string | null>>();

/** Der gesuchte Zug (UCI) einer Stellung, einmal gerechnet; null ohne Antwort der Engine. */
export function gesuchterZug(fen: string): Promise<string | null> {
  let zug = gesucht.get(fen);
  if (!zug) {
    zug = engine
      .bewerte(fen, RECHENZEIT_MS, 1)
      .then((b) => b.besterZug ?? null)
      .catch((fehler: unknown) => {
        console.warn("Zugerraten: Engine ohne Antwort, jeder Zug gilt", fehler);
        return null;
      });
    gesucht.set(fen, zug);
  }
  return zug;
}

/** Läuft das Zugerraten in dieser Partie gerade (Held am Zug, Moment gesprochen)? */
function useLaeuft(partie: Partie): boolean {
  const begegnung = useBegegnung(partie.einstellung.abenteuer?.kennung ?? "");
  const momente = begegnung?.momente;
  return useMemo(() => {
    if (!momente?.some((m) => m.zugerraten) || partie.ende || !leserAmZug(partie)) return false;
    const verlauf = {
      fens: stellungen(partie),
      vomHelden: partie.zuege.map((z) => z.von === "leser"),
      held: partie.einstellung.eigeneFarbe,
    };
    return zugerratenLaeuft(momente, verlauf);
  }, [momente, partie]);
}

/**
 * Steuerung mit Zugerraten. Eingaben: Steuerung (schon mit Schutzengel) und Partie. Ausgabe:
 * Steuerung für das Brett und der Textschlüssel der Zeile über dem Brett (oder null).
 */
export function useZugerraten(s: Partiesteuerung, partie: Partie) {
  const laeuft = useLaeuft(partie);
  const [fehlversuche, setzeFehlversuche] = useState(0);
  const [prueft, setzePrueft] = useState(false);
  const uhrLaeuft = partie.uhr?.laeuft ?? null;
  // Die Uhr steht, solange gesucht wird, auch nachdem der Momentdialog sie freigegeben hat.
  useEffect(() => {
    if (laeuft && uhrLaeuft) s.halteUhr(true);
  }, [laeuft, uhrLaeuft, s]);
  useEffect(() => {
    if (laeuft) void gesuchterZug(s.fen);
  }, [laeuft, s.fen]);
  const spieleLeser = (san: string) => {
    if (!laeuft) {
      s.spieleLeser(san);
      return;
    }
    if (prueft) return;
    setzePrueft(true);
    const fen = s.fen;
    void gesuchterZug(fen)
      .then((ziel) => {
        if (ziel === null || versuchTrifft(fen, ziel, san)) {
          s.spieleLeser(san);
          return;
        }
        setzeFehlversuche((n) => n + 1);
      })
      .finally(() => setzePrueft(false));
  };
  return { steuerung: { ...s, spieleLeser }, zeile: useZeile(laeuft, fehlversuche, s.fen) };
}

/** Text der Zeile: Aufgabe, nach einem Fehlversuch „daneben“, ab drei der Hinweis. */
function useZeile(laeuft: boolean, fehlversuche: number, fen: string): string | null {
  const [hinweis, setzeHinweis] = useState<string | null>(null);
  useEffect(() => {
    if (!laeuft || fehlversuche < FEHLVERSUCHE_BIS_HINWEIS) return;
    let aktiv = true;
    void gesuchterZug(fen).then((ziel) => {
      if (aktiv && ziel) setzeHinweis(hinweisschluessel(fen, ziel));
    });
    return () => {
      aktiv = false;
    };
  }, [laeuft, fehlversuche, fen]);
  if (!laeuft) return null;
  if (fehlversuche >= FEHLVERSUCHE_BIS_HINWEIS && hinweis) return hinweis;
  return fehlversuche > 0 ? "zugerraten.daneben" : "zugerraten.aufgabe";
}
