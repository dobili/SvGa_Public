/**
 * Bühnenregie der Oberwelt (Atmosphäre T6 und T9): wendet die Bühnenanweisungen jeder
 * Dialogzeile auf die Karte an und stellt am Dialogende das Licht der Karte wieder her.
 *
 * Rolle im Gesamtbild: Oberwelt.tsx gibt `zeile` und `ende` an den Dialog weiter. Die Anweisungen
 * liest buehne.ts, das Blenden der Figuren macht figurblende.ts, das Licht die Tönungsschicht der
 * Szene (mit zwei Sekunden Umblenden). Geführte Wege (`#gehe`, `#stelle`, gefuehrterweg.ts) gehen
 * an die Szene; solange einer läuft, meldet `laeuft` dem Dialog, dass er warten soll. `#uhr:abend`
 * oder `#uhr:22` stellt die Spieluhr (Geschichte geht vor, regeln/spieluhr.ts); am Dialogende gilt
 * dann das Licht der neuen Zeit.
 * Abhängigkeiten: kern.ts, buehne.ts, figurblende.ts, gefuehrterweg.ts, fuehrungsschicht.ts.
 */
import { useRef, useState } from "react";
import { fuehre, stehAuf, stelle } from "./fuehrungsschicht";
import { wendeZu, wendeZurueck } from "./zuwendungsschicht";
import { stellauftrag, wegauftraege } from "./gefuehrterweg";
import { buehnenanweisung } from "./buehne";
import { blendeFigur } from "./figurblende";
import { szeneAus, type Oberweltkern } from "./kern";
import { zeigeKartenteilchen, zeigeTeilchen } from "./teilchen";
import { spielminuteJetzt, uhrNachAngabe } from "../regeln/spieluhr";
import { toenungJetzt } from "./uhrtoenung";

/** Rückrufe für den Dialog. */
export interface Buehne {
  /** Eine neue Zeile mit ihren Tags. */
  readonly zeile: (tags: Readonly<Record<string, string>>) => void;
  /** Der Dialog ist zu Ende: Licht der Karte zurück. */
  readonly ende: () => void;
  /** Läuft gerade ein geführter Weg? Dann wartet der Dialog („Weiter“ und Wahlen gesperrt). */
  readonly laeuft: boolean;
}

/** Die Bühnenregie für den Kern der Oberwelt. Eingabe: Kern. Ausgabe: Rückrufe für den Dialog. */
export function useBuehne(k: Oberweltkern): Buehne {
  // Hat der Dialog das Licht verändert? Nur dann wird es am Ende zurückgestellt.
  const lichtGeaendert = useRef(false);
  const teilchenGeaendert = useRef(false);
  const uhrGeaendert = useRef(false);
  /** `#uhr:abend` oder `#uhr:22`: Die Geschichte stellt die Spieluhr (regeln/spieluhr.ts). */
  const stelleUhr = (angabe: string | undefined) => {
    const aktuell = k.standRef.current;
    if (!angabe || !aktuell) return;
    const neu = uhrNachAngabe(spielminuteJetzt(aktuell), angabe);
    if (neu === null || neu === aktuell.spieluhr) return;
    k.schreibe({ ...aktuell, spieluhr: neu });
    uhrGeaendert.current = true;
  };
  const [laeuft, setzeLaeuft] = useState(false);
  /** Versetzen sofort, dann alle Wege der Zeile zugleich; der Dialog wartet auf den letzten. */
  const gehe = (tags: Readonly<Record<string, string>>) => {
    const zugang = szeneAus(k.spiel)?.fuehrungszugang();
    const versetzen = stellauftrag(tags.stelle);
    if (zugang && versetzen) stelle(zugang, versetzen);
    const wege = wegauftraege(tags.gehe);
    if (!zugang || wege.length === 0) return;
    setzeLaeuft(true);
    const fertig = Promise.all(wege.map((w) => fuehre(zugang, w)));
    // Gleich sichern: Die Szene nennt mitten im Weg schon das Ziel als Position. Wer jetzt neu
    // lädt, steht danach dort (ein Neuladen sichert die Sitzung nicht zuverlässig, useWeltladen.ts).
    const aktuell = k.standRef.current;
    if (aktuell) k.schreibe({ ...aktuell, position: k.position(aktuell) });
    void fertig.then(() => setzeLaeuft(false));
  };
  return {
    laeuft,
    zeile: (tags) => {
      const szene = szeneAus(k.spiel);
      if (!szene) return;
      const anweisung = buehnenanweisung(tags);
      if (anweisung.licht !== undefined) {
        szene.setzeToenung(anweisung.licht);
        lichtGeaendert.current = true;
      }
      if (anweisung.teilchen !== undefined) {
        zeigeTeilchen(szene, anweisung.teilchen);
        teilchenGeaendert.current = true;
      }
      if (anweisung.figur) blendeFigur(szene, anweisung.figur.name, anweisung.figur.deckkraft);
      // `#erscheint` mit Sprecher, der nicht auf der Karte steht: Er erscheint im Bild (R8,
      // Spieltest einstieg: Ambrose blieb auf dem Dachboden unsichtbar, als der Text ihn zeigte).
      if (tags.erscheint && tags.sprecher) szene.erscheine(tags.sprecher);
      // Wer spricht und auf der Karte steht, schaut den Helden an (zuwendungsschicht.ts).
      const zugang = szene.fuehrungszugang();
      if (zugang && tags.sprecher) wendeZu(zugang, tags.sprecher);
      gehe(tags);
      stelleUhr(tags.uhr);
    },
    ende: () => {
      const szene = szeneAus(k.spiel);
      const zugang = szene?.fuehrungszugang();
      if (zugang) stehAuf(zugang);
      if (zugang) wendeZurueck(zugang);
      if (teilchenGeaendert.current && szene) zeigeKartenteilchen(szene);
      teilchenGeaendert.current = false;
      // Hat die Geschichte die Uhr gestellt, gilt danach das Licht der neuen Zeit (uhrtoenung.ts).
      const welt = k.weltRef.current;
      const stand = k.standRef.current;
      if (uhrGeaendert.current && welt && stand) {
        uhrGeaendert.current = lichtGeaendert.current = false;
        k.zeigeToenung(toenungJetzt(welt, stand));
        return;
      }
      if (!lichtGeaendert.current) return;
      lichtGeaendert.current = false;
      szene?.setzeToenung(k.toenung);
    },
  };
}
