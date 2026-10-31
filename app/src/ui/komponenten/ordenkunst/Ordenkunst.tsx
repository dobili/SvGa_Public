/**
 * Ein Orden oder Abzeichen mit seinem eigenen Bild (Wahl des Autors, 30.10.2026).
 *
 * Rolle im Gesamtbild: Zeigt das SVG aus entwuerfe.ts. Die Bilder entstehen als Text aus festen,
 * eigenen Zeichnungsdaten (keine Eingaben der Leser), deshalb ist das Einsetzen als HTML sicher.
 * Das Bild wird je Stück und Art nur einmal gebaut (useMemo), damit die Kennungen der Verläufe
 * zwischen zwei Zeichnungen gleich bleiben.
 * Abhängigkeiten: entwuerfe.ts, Stil in ui/stil/ordenkunst.css.
 */
import { useMemo } from "react";
import { stueckSvg, type Stueckart } from "./entwuerfe";

/**
 * Das Bild. `beschriftung` ist der Name für Bildschirmleser; `klasse` legt die Größe fest
 * (etwa „orden-gross“ in der Gratulation). Sonderfall: Ohne eigenes Bild bleibt die Fläche leer;
 * Aufrufer prüfen vorher mit `hatOrdenkunst`.
 */
export function Ordenkunst({
  art,
  kennung,
  beschriftung,
  silhouette = false,
  glanz = !silhouette,
  klasse = "",
}: {
  art: Stueckart;
  kennung: string;
  beschriftung: string;
  silhouette?: boolean;
  glanz?: boolean;
  klasse?: string;
}) {
  const svg = useMemo(
    () => stueckSvg(art, kennung, { silhouette, glanz }) ?? "",
    [art, kennung, silhouette, glanz],
  );
  const klassen = [
    "ordenkunst",
    `ordenkunst-${art}`,
    silhouette ? "ordenkunst-silhouette" : "",
    klasse,
  ];
  return (
    <span
      className={klassen.filter(Boolean).join(" ")}
      role="img"
      aria-label={beschriftung}
      data-ordenkunst={kennung}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
