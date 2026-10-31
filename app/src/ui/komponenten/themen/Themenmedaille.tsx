/**
 * Die Medaille eines Themas als Bild (Gamifizierung P3), mit Glanz bei erreichter Stufe.
 *
 * Rolle im Gesamtbild: Profilkarte „Deine Themen“ und Meldung am Rundenende zeigen dasselbe Bild
 * aus ordenkunst/themenbilder.ts. Die Bilder entstehen als Text aus festen, eigenen
 * Zeichnungsdaten (keine Eingaben der Leser), deshalb ist das Einsetzen als HTML sicher.
 * Abhängigkeiten: ordenkunst/themenbilder.ts, thementexte.ts, Stil in ui/stil/themen.css.
 */
import { useMemo } from "react";
import { t } from "../../../i18n/sprache";
import type { Medaillenstufe } from "../../../training/meisterschaft";
import { medailleSvg } from "../ordenkunst/themenbilder";
import { medaillenname, themenname } from "./thementexte";

/** Das Bild; `klasse` legt die Größe fest (etwa „themenmedaille-gross“ in der Meldung). */
export function Themenmedaille({
  thema,
  stufe,
  klasse = "",
}: {
  thema: string;
  stufe: Medaillenstufe | null;
  klasse?: string;
}) {
  const svg = useMemo(() => medailleSvg(thema, stufe), [thema, stufe]);
  const name = stufe
    ? medaillenname(thema, stufe)
    : t("themen.medailleOffen", { name: themenname(thema) });
  return (
    <span
      className={[
        "themenmedaille",
        stufe ? `themenmedaille-${stufe}` : "themenmedaille-offen",
        klasse,
      ]
        .filter(Boolean)
        .join(" ")}
      role="img"
      aria-label={name}
      data-stufe={stufe ?? "offen"}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
