/**
 * Teilen-Knöpfe für Orden und Abzeichen (Gamifizierung P9): suchen Bild, Name und Datum des
 * Stücks heraus und setzen den allgemeinen Teilenknopf ein.
 *
 * Rolle im Gesamtbild: Eingesetzt im Profil (Orden unter den Ringen, Abzeichen im Raster) und in
 * den Feiern (Ringfeier, Abzeichenmeldung). Das Datum kommt aus „verdient“ (Gamifizierung G3,
 * Schlüssel „orden:<k>“ und „abzeichen:<k>“). In einer Feier ist es noch nicht geschrieben (das
 * geschieht mit „Weiter“); dort gilt `heute`.
 * Abhängigkeiten: Teilenknopf.tsx, ordenkunst/entwuerfe.ts, fortschritt/abzeichen.ts, speicher,
 * i18n.
 */
import { useMemo } from "react";
import { useSpeicher } from "../../../speicher/speicher";
import { abzeichenname, type Abzeichenkennung } from "../fortschritt/abzeichen";
import { ordenkennungAusRing, stueckSvg, type Stueckart } from "../ordenkunst/entwuerfe";
import { Teilenknopf } from "./Teilenknopf";

/** Datum aus „verdient“; mit `heute` ersatzweise jetzt (in der Feier, vor dem Merken). */
function useVerdient(art: Stueckart, kennung: string, heute: boolean): string | null {
  const gespeichert = useSpeicher((z) => z.daten.verdient[`${art}:${kennung}`] ?? null);
  return useMemo(
    () => gespeichert ?? (heute ? new Date().toISOString() : null),
    [gespeichert, heute],
  );
}

/** Teilen für den Orden eines vollen Rings. Beispiel: ring „ich-uebungen“, Name „Übungen gelöst“. */
export function OrdenTeilen({
  ring,
  name,
  heute = false,
  klein = true,
}: {
  ring: string;
  name: string;
  heute?: boolean;
  klein?: boolean;
}) {
  const kennung = ordenkennungAusRing(ring);
  const verdient = useVerdient("orden", kennung, heute);
  const bild = useMemo(() => stueckSvg("orden", kennung), [kennung]);
  return (
    <Teilenknopf
      art="orden"
      kennung={kennung}
      name={name}
      bild={bild}
      verdient={verdient}
      klein={klein}
    />
  );
}

/** Teilen für ein verdientes Abzeichen. Beispiel: kennung „ersterSieg“. */
export function AbzeichenTeilen({
  kennung,
  heute = false,
  klein = true,
}: {
  kennung: Abzeichenkennung;
  heute?: boolean;
  klein?: boolean;
}) {
  const verdient = useVerdient("abzeichen", kennung, heute);
  const bild = useMemo(() => stueckSvg("abzeichen", kennung), [kennung]);
  return (
    <Teilenknopf
      art="abzeichen"
      kennung={kennung}
      name={abzeichenname(kennung)}
      bild={bild}
      verdient={verdient}
      klein={klein}
    />
  );
}
