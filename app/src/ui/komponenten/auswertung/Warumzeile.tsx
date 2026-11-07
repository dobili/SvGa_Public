/**
 * Warum-Zeile einer Fehlerkarte der Zeitleiste mit Knopf „Üben“ (Konzept „Fehler mit Buchbezug“,
 * Abschnitt 4.1, vom Autor am 7.11.2026 freigegeben).
 *
 * Rolle im Gesamtbild: Momentkarte (Zeitleiste.tsx) zeigt sie bei Fehler und Patzer der Seite und
 * bei der ersten klaren Abweichung, nie bei „Verpasst“ (dort zählt die Findezeile, Konzept 4.1).
 * Sichtbar sind Kurzname und Fundstelle („Drohung stehen gelassen (Kapitel 1, Schach-Röntgen-
 * Regel)“); der Satz dazu klappt auf Tipp auf. So bleibt die Reihe niedrig (Wunsch des Autors vom
 * 1.11.2026: die Momente nehmen wenig Platz weg), und „Üben“ sitzt neben „Zur Stellung“.
 * Die Rechnung läuft erst nach dem ersten Bild der Karte (Konzept 4.2: die Auswertung soll nicht
 * stocken); ohne Kategorie bleibt die Karte, wie sie war. „Üben“ öffnet den Trainer der Kategorie,
 * wo möglich gleich mit Thema (ui/trainer/trainerthema.ts).
 * Abhängigkeiten: warumzeile.ts, app/navigationsKontext.ts, lucide.
 */
import { BookOpen } from "lucide-react";
import { useNavigation } from "../../../app/navigationsKontext";
import { t } from "../../../i18n/sprache";
import type { Warumzeile } from "./warumzeile";

const SYMBOLGROESSE = 14;

/**
 * Kurzname und Fundstelle, aufklappbar zum Satz.
 * Beispiel: 12. O-O-O?? → „Drohung stehen gelassen (Kapitel 1, Schach-Röntgen-Regel)“,
 * aufgeklappt „Die Drohung Sxe4 stand schon vor deinem Zug, und sie steht danach noch. …“.
 */
export function Warumtext({ zeile }: { zeile: Warumzeile }) {
  return (
    <details className="zeitleiste-warum" data-testid="warumzeile" data-kennung={zeile.kennung}>
      <summary className="zeitleiste-warum-kopf">
        <BookOpen size={SYMBOLGROESSE} aria-hidden="true" className="zeitleiste-warum-symbol" />
        <b>{zeile.anzeige}</b> {zeile.quelle}
      </summary>
      <p className="zeitleiste-warum-text">{zeile.text}</p>
    </details>
  );
}

/**
 * Knopf „Üben“, der den Trainer der Kategorie öffnet (mit Thema, wo es eines gibt). Vorgelesen wird
 * „Üben: Schach-Röntgen-Trainer“; sichtbar nur „Üben“, damit er neben „Zur Stellung“ passt.
 */
export function Uebenknopf({ zeile }: { zeile: Warumzeile }) {
  const { navigiere } = useNavigation();
  const ziel = zeile.thema
    ? { bildschirm: "trainer" as const, kennung: zeile.trainer, thema: zeile.thema }
    : { bildschirm: "trainer" as const, kennung: zeile.trainer };
  return (
    <button
      type="button"
      className="zeitleiste-sprung"
      aria-label={zeile.ueben}
      onClick={() => navigiere(ziel)}
    >
      {t("buchbezug.uebenKurz")}
    </button>
  );
}
