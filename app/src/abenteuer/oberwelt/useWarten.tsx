/**
 * Warten und Ausruhen (Spieluhr, Wunsch des Autors, 22.11.2026): Im Spielmenü „Warten …“ bis
 * Morgen, Mittag, Abend oder Nacht; in der Welt an einer Bank „Ausruhen“ (dieselbe Wahl) und am
 * eigenen Bett „Schlafen bis morgen“. Geht nur in freier Oberwelt.
 *
 * Ablauf: kurze Abblende mit Uhrsymbol, die Uhr springt auf die nächste solche Zeit (nie zurück,
 * regeln/spieluhr.ts), dann wird die Karte neu aufgestellt (kern.stelleNeuAuf): Statisten und
 * Tönung nach der neuen Zeit, der Held bleibt, wo er steht.
 * Rolle im Gesamtbild: Teil von oberwelt/Oberwelt.tsx; das Menü erreicht es über wartewunsch.ts.
 * Abhängigkeiten: kern.ts, ruheplatz.ts, wartewunsch.ts, regeln/spieluhr.ts, texte/texte.ts.
 */
import { useEffect, useRef, useState, type ReactNode } from "react";
import { naechsteStunde, spielminuteJetzt, spieltag, stundeJetzt, ZIELE } from "../regeln/spieluhr";
import { tSpiel } from "../texte/texte";
import { szeneAus, type Oberweltkern } from "./kern";
import { ruheplatz, type Ruhe } from "./ruheplatz";
import { KACHEL } from "./szene";
import { Warteauswahl } from "./Warteauswahl";
import { meldeWartelage, type Warteziel } from "./wartewunsch";

/** Dauer der Abblende in Millisekunden (Uhrsymbol, dann Neuaufbau). */
const ABBLENDE_MS = 1200;
/** So oft fragt der Ruheplatz nach der Lage des Helden. */
const RUHE_TAKT_MS = 400;

/** Was die Oberwelt vom Warten braucht. */
export interface Warten {
  /** Aktion an einem Ruheplatz (Text und Tun), sonst null. */
  readonly ruhe: { readonly text: string; readonly tu: () => void } | null;
  /** Abblende und Auswahl, über der Welt zu zeichnen. */
  readonly element: ReactNode;
  /** Läuft gerade eine Abblende oder steht die Auswahl? Dann ist die Welt nicht frei. */
  readonly offen: boolean;
}

/**
 * Hängt das Warten an die Oberwelt. Eingaben: Kern, ob die Welt frei ist.
 * Beispiel: Menü „bis Nacht“ um 14 Uhr → Abblende, Uhr 22 Uhr, Karte mit Nachtstatisten.
 */
export function useWarten(k: Oberweltkern, frei: boolean): Warten {
  const [abblende, setzeAbblende] = useState(false);
  const [auswahl, setzeAuswahl] = useState(false);
  const [ruheart, setzeRuheart] = useState<Ruhe | null>(null);
  const kRef = useRef(k);
  useEffect(() => {
    kRef.current = k;
  });
  const warteBis = (ziel: Warteziel) => {
    const kern = kRef.current;
    const stand = kern.standRef.current;
    if (!stand) return;
    setzeAuswahl(false);
    setzeAbblende(true);
    const neu = {
      ...stand,
      position: kern.position(stand),
      spieluhr: naechsteStunde(spielminuteJetzt(stand), ZIELE[ziel] ?? 0),
    };
    kern.merke(neu);
    window.setTimeout(() => {
      void kern.dienste.schreibeStand(neu).then(() => {
        kern.stelleNeuAuf();
        setzeAbblende(false);
      });
    }, ABBLENDE_MS / 2);
  };
  const stand = k.stand;
  const moeglich = frei && !abblende && !auswahl;
  useEffect(() => {
    const lage = stand ? { moeglich, stunde: stundeJetzt(stand), tag: spieltag(stand) } : null;
    // warteBis liest den Kern über die Ref.
    meldeWartelage(lage, warteBis);
  }, [moeglich, stand]);
  useEffect(() => {
    // Beim Verlassen der Oberwelt kann das Menü nicht mehr warten.
    return () => meldeWartelage(null, null);
  }, []);
  useEffect(() => {
    const takt = window.setInterval(() => {
      const kern = kRef.current;
      const szene = szeneAus(kern.spiel);
      const welt = kern.weltRef.current;
      setzeRuheart(
        szene && welt ? ruheplatz(welt.moebel, welt.kennung, szene.position(), KACHEL) : null,
      );
    }, RUHE_TAKT_MS);
    return () => window.clearInterval(takt);
  }, []);
  const ruhe =
    ruheart && moeglich
      ? {
          text: tSpiel(`oberwelt.aktion.${ruheart}`),
          tu: () => (ruheart === "schlafen" ? warteBis("morgen") : setzeAuswahl(true)),
        }
      : null;
  const element = (
    <>
      {auswahl && <Warteauswahl beiZiel={warteBis} beiAbbruch={() => setzeAuswahl(false)} />}
      {abblende && (
        <div
          className="abenteuer-warteblende"
          data-testid="abenteuer-warteblende"
          aria-live="polite"
        >
          <span aria-hidden="true">🕰️</span>
          <p>{tSpiel("warten.laeuft")}</p>
        </div>
      )}
    </>
  );
  return { ruhe, element, offen: abblende || auswahl };
}
