/**
 * Texte des Gruppenmodus (engine/gruppe.ts): Name der Gruppe und ihre Stärkeangabe. Eigene Datei
 * ohne Komponenten, damit Gruppenmodus.tsx nur Komponenten ausführt (Fast Refresh).
 * Abhängigkeiten: engine/gruppe.ts, speicher/besiegt.ts (Typ), staerkeangabe.ts, i18n.
 */
import { gemesseneGruppenstaerke, gruppenstaerkeSichtbar } from "../../engine/gruppe";
import type { Stufennummer } from "../../engine/stufen";
import { t } from "../../i18n/sprache";
import type { Besiegte } from "../../speicher/besiegt";
import { staerketext } from "./staerkeangabe";

/** Der Name einer Gruppe. Beispiel: 3 → „Gruppe der Stufe 3“. */
export function gruppenname(stufe: Stufennummer): string {
  return t("gruppe.name", { nummer: String(stufe) });
}

/**
 * Die Stärkeangabe der Gruppe: „Stärke unbekannt“, bis der Leser sie einmal besiegt hat (und sie
 * gemessen ist), danach die gemessene Zahl.
 */
export function gruppenstaerketext(besiegt: Besiegte, stufe: Stufennummer): string {
  const zahl = gemesseneGruppenstaerke(stufe);
  if (zahl === null || !gruppenstaerkeSichtbar(besiegt, stufe)) return t("gruppe.unbekannt");
  return staerketext(zahl);
}
