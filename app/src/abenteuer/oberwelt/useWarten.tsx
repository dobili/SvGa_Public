/**
 * Warten und Ausruhen (Spieluhr, Wunsch des Autors, 22.11.2026): Im Spielmenü „Warten …“ bis
 * Morgen, Mittag, Abend oder Nacht; in der Welt an einer Bank „Ausruhen“ (dieselbe Wahl) und am
 * eigenen Bett „Schlafen bis morgen“. Geht nur in freier Oberwelt.
 *
 * Ablauf: Die Uhr springt auf die nächste solche Zeit (nie zurück, regeln/spieluhr.ts), dazu
 * läuft der Zeitraffer (oberwelt/Zeitraffer.tsx, seit 25.11.2026 statt der stehenden Abblende
 * mit Uhrsymbol): Sonne oder Mond über dem Horizont, Uhrzeiger zur Zielzeit, Tippen überspringt.
 * Mitten darin wird die Karte neu aufgestellt (kern.stelleNeuAuf): Statisten und Tönung nach der
 * neuen Zeit, der Held bleibt, wo er steht.
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
import { Zeitraffer } from "./Zeitraffer";
import { meldeWartelage, type Warteziel } from "./wartewunsch";

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
  // Laufender Zeitraffer: Spielminuten vorher und nachher, Schlafen oder Warten.
  const [raffer, setzeRaffer] = useState<{
    von: number;
    nach: number;
    schlafen: boolean;
  } | null>(null);
  const abblende = raffer !== null;
  const [auswahl, setzeAuswahl] = useState(false);
  const [ruheart, setzeRuheart] = useState<Ruhe | null>(null);
  const kRef = useRef(k);
  useEffect(() => {
    kRef.current = k;
  });
  // Gespeichert wird sofort; der Zeitraffer stellt die Karte erst neu auf, wenn das Schreiben fertig ist.
  const geschrieben = useRef<Promise<void>>(Promise.resolve());
  const warteBis = (ziel: Warteziel, schlafen = false) => {
    const kern = kRef.current;
    const stand = kern.standRef.current;
    if (!stand) return;
    setzeAuswahl(false);
    const von = spielminuteJetzt(stand);
    const nach = naechsteStunde(von, ZIELE[ziel] ?? 0);
    const neu = { ...stand, position: kern.position(stand), spieluhr: nach };
    kern.merke(neu);
    geschrieben.current = kern.dienste.schreibeStand(neu);
    setzeRaffer({ von, nach, schlafen });
  };
  const stelleNeuAuf = () => {
    void geschrieben.current.then(() => kRef.current.stelleNeuAuf());
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
          tu: () => (ruheart === "schlafen" ? warteBis("morgen", true) : setzeAuswahl(true)),
        }
      : null;
  const element = (
    <>
      {auswahl && <Warteauswahl beiZiel={warteBis} beiAbbruch={() => setzeAuswahl(false)} />}
      {raffer && (
        <Zeitraffer
          von={raffer.von}
          nach={raffer.nach}
          schlafen={raffer.schlafen}
          beiNeuaufbau={stelleNeuAuf}
          beiEnde={() => setzeRaffer(null)}
        />
      )}
    </>
  );
  return { ruhe, element, offen: abblende || auswahl };
}
