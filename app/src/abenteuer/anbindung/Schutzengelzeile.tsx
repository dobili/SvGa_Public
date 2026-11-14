/**
 * Ambroses Zeile, wenn der Schutzengel (K4) einen Zug aufhält: eine Variante von „Das spielst du
 * besser nicht.“ und höchstens die Art des Fehlers („Da hängt etwas.“, „Dein König.“), nie der
 * bessere Zug (docs/spiel/29_Tischgespraech.md, Abschnitt 6).
 *
 * Rolle im Gesamtbild: Teil der Spielhülle (anbindung/PartieHuelle.tsx). Die Zeile geht in die
 * untere Sprechblase (anbindung/Tischblase.tsx), Ambrose halb durchsichtig; sie verschwindet nach
 * einer Lesedauer oder auf Tipp. Gezogen wird mit festem Zufall je Partie.
 * Abhängigkeiten: anbindung/Tischblase.tsx, anbindung/tischsprecher.ts, regeln/schutzengel.ts.
 */
import { useEffect } from "react";
import type { Schutzgrund } from "../regeln/schutzengel";
import { useTischblasen } from "./tischkontext";
import { ambrosezeile, schutzengeltext } from "./tischsprecher";

/**
 * Legt Ambroses Zeile in die Blase und meldet sich gleich wieder ab (beiEnde); zeichnet selbst
 * nichts. Eingaben: Grund, Kennung der Partie, Halbzug (macht die Zeile eindeutig), beiEnde.
 */
export function Schutzengelzeile({
  grund,
  partiekennung,
  halbzug,
  beiEnde,
}: {
  readonly grund: Schutzgrund;
  readonly partiekennung: string;
  readonly halbzug: number;
  readonly beiEnde: () => void;
}) {
  const blasen = useTischblasen();
  useEffect(() => {
    blasen?.zeige(
      ambrosezeile(schutzengeltext(grund, partiekennung), {
        schluessel: `${partiekennung}:engel:${halbzug}:${grund}`,
        vorrang: "geschrieben",
        testid: "abenteuer-schutzengel",
      }),
    );
    beiEnde();
    // Einmal je Aufhalten; Blasen und Rückruf sind bei jedem Zeichnen neu.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grund, halbzug]);
  return null;
}
