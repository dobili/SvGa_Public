/**
 * Teilen einer Medaille der Meisterschaft (Gamifizierung P3) über den Teilenknopf aus P9.
 *
 * Rolle im Gesamtbild: Das Datum kommt aus „verdient“ (Schlüssel „meisterschaft:<stufe>:<thema>“);
 * in der Meldung am Rundenende ist es gerade erst geschrieben, bei einer Probe fehlt es (dann
 * steht kein Datum auf dem Bild).
 * Abhängigkeiten: teilen/Teilenknopf.tsx, ordenkunst/themenbilder.ts, thementexte.ts, Speicher.
 */
import { useMemo } from "react";
import { useSpeicher } from "../../../speicher/speicher";
import { verdientSchluessel, type Medaillenstufe } from "../../../training/meisterschaft";
import { medailleSvg } from "../ordenkunst/themenbilder";
import { Teilenknopf } from "../teilen/Teilenknopf";
import { medaillenname } from "./thementexte";

/** Der Knopf. Beispiel: <MedailleTeilen thema="taktik:fesselung" stufe="silber" />. */
export function MedailleTeilen({ thema, stufe }: { thema: string; stufe: Medaillenstufe }) {
  const verdient = useSpeicher((z) => z.daten.verdient[verdientSchluessel(stufe, thema)] ?? null);
  const bild = useMemo(() => medailleSvg(thema, stufe), [thema, stufe]);
  return (
    <Teilenknopf
      art="meisterschaft"
      kennung={`${thema.replace(/:/g, "-")}-${stufe}`}
      name={medaillenname(thema, stufe)}
      bild={bild}
      verdient={verdient}
      klein
    />
  );
}
