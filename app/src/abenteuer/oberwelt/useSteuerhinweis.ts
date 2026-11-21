/**
 * Ablauf der einmaligen Hinweise zur Steuerung (Erstspieler-Durchgang, 20.11.2026): welcher Hinweis
 * gerade steht und wann er abgehakt wird. Regeln in steuerhinweise.ts, Anzeige in Steuerhinweis.tsx.
 *
 * Warum: Ein neuer Spieler bekam die Bedienung nirgends erklärt. Der Hinweis wird erst abgehakt,
 * wenn er zu Ende stand (Tippen, Gebrauch des Elements, nach einigen Sekunden), damit ein Fenster,
 * das ihn verdeckt, ihn nicht verschluckt.
 * Rolle im Gesamtbild: Teil von oberwelt/Oberwelt.tsx (ausgelagert, Größengrenze).
 * Abhängigkeiten: kern.ts, steuerhinweise.ts.
 */
import { useEffect } from "react";
import type { Oberweltkern } from "./kern";
import { faelligerHinweis, hakeAb, type Hinweislage, type Steuerhinweis } from "./steuerhinweise";

/** So lange bleibt eine Zeile stehen, wenn niemand sie wegtippt. */
const DAUER_MS = 9000;

/**
 * Messhilfe für tests/e2e/abenteuer-hinweislage.spec.ts: Setzt ein Test
 * `window.__steuerhinweisDauerMs`, steht die Zeile so lange. Unter Last (vier Testläufe zugleich)
 * war sie nach 9 s schon wieder weg, bevor der Test ihre Lage messen konnte (Gate, 21.11.2026).
 */
function dauerMs(): number {
  const wert = (globalThis as { __steuerhinweisDauerMs?: unknown }).__steuerhinweisDauerMs;
  return typeof wert === "number" ? wert : DAUER_MS;
}

/** Der gezeigte Hinweis und wie die Oberwelt ihn beendet. */
export interface Hinweissteuerung {
  readonly aktiv: Steuerhinweis | null;
  /** Das Bedienelement wurde benutzt: Steht sein Hinweis, verschwindet er. */
  readonly benutzt: (hinweis: Steuerhinweis) => void;
  readonly schliesse: () => void;
}

/**
 * Rechnet beim Zeichnen den fälligen Hinweis aus und hakt ihn im Spielstand ab, sobald er endet
 * (Tippen, Gebrauch des Elements, nach DAUER_MS).
 * Eingaben: Kern der Oberwelt, Lage (frei, Erinnerung, Aktionsknopf sichtbar).
 * Beispiel: Einleitung vorbei, Welt frei → „Mit dem Steuerkreuz gehst du …“; der erste Schritt
 * auf dem Kreuz blendet die Zeile aus und hakt sie ab.
 * Sonderfall: Geht ein Fenster auf oder der Aktionsknopf weg, bevor der Hinweis endet, kommt er
 * beim nächsten passenden Moment wieder; abgehakt ist er erst, wenn er wirklich zu Ende stand.
 */
export function useSteuerhinweis(k: Oberweltkern, lage: Hinweislage): Hinweissteuerung {
  const { stand } = k;
  const aktiv = stand ? faelligerHinweis(stand, lage) : null;
  const beende = (h: Steuerhinweis) => {
    const aktuell = k.standRef.current;
    if (aktuell && faelligerHinweis(aktuell, lage) === h) k.schreibe(hakeAb(aktuell, h));
  };
  useEffect(() => {
    if (aktiv === null) return;
    const uhr = window.setTimeout(() => beende(aktiv), dauerMs());
    return () => window.clearTimeout(uhr);
    // Die Uhr läuft je gezeigtem Hinweis neu; beende liest den Stand über die Ref.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aktiv]);
  return {
    aktiv,
    benutzt: (h) => {
      if (aktiv === h) beende(h);
    },
    schliesse: () => {
      if (aktiv !== null) beende(aktiv);
    },
  };
}
