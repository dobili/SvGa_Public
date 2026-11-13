/**
 * Ambroses Zeile, wenn der Schutzengel (K4) einen Zug aufhält: „Das spielst du besser nicht.“ und
 * höchstens die Art des Fehlers („Da hängt etwas.“, „Dein König.“), nie der bessere Zug.
 *
 * Rolle im Gesamtbild: Teil der Spielhülle (anbindung/PartieHuelle.tsx); sieht aus wie ein
 * Partiemoment (Momentzeile.tsx) und verschwindet nach einer Lesedauer oder auf Tipp.
 * Abhängigkeiten: dialog/Portraet.tsx, texte/texte.ts, regeln/schutzengel.ts.
 */
import { useEffect } from "react";
import { Portraet } from "../dialog/Portraet";
import type { Schutzgrund } from "../regeln/schutzengel";
import { tSpiel } from "../texte/texte";

/** So lange bleibt die Zeile stehen (ms). */
const LESEDAUER_MS = 4500;
const AMBROSE = "ambrose";

export function Schutzengelzeile({
  grund,
  beiEnde,
}: {
  readonly grund: Schutzgrund;
  readonly beiEnde: () => void;
}) {
  useEffect(() => {
    const uhr = window.setTimeout(beiEnde, LESEDAUER_MS);
    return () => window.clearTimeout(uhr);
    // Einmal je Aufhalten; die Hülle reicht bei jedem Takt einen neuen Rückruf.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grund]);
  const text = `${tSpiel("schutzengel.halt")} ${tSpiel(`schutzengel.${grund}`)}`;
  return (
    <button
      type="button"
      className="abenteuer-moment"
      data-testid="abenteuer-schutzengel"
      aria-label={tSpiel("huelle.momentSchliessen")}
      onClick={beiEnde}
    >
      <Portraet sprecher={AMBROSE} stimmung={null} zeile={text} />
      <span role="status" aria-live="assertive">
        <strong>{tSpiel(`figur.${AMBROSE}.name`)}</strong> {text}
      </span>
    </button>
  );
}
