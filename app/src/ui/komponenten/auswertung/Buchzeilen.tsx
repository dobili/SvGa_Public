/**
 * Warum-Zeile und Findezeile einer Karte mit Knopf „Üben“ (Konzept „Fehler mit Buchbezug“,
 * Abschnitt 4.1, vom Autor am 7.11.2026 freigegeben).
 *
 * Rolle im Gesamtbild: Momentkarte (Zeitleiste.tsx) zeigt die Warum-Zeile bei Fehler und Patzer
 * der Seite und bei der ersten klaren Abweichung, die Findezeile dazu und bei „Verpasst“ allein;
 * die Rückblickkarte zeigt die Findezeile bei jedem Zug mit „Besser war …“ ab „ungenau“.
 * Sichtbar sind Kurzname und Kapitel („Drohung stehen gelassen (Kapitel 1)“); der Satz mit der
 * ganzen Fundstelle („… (Kapitel 1, Schach-Röntgen-Regel)“) klappt auf Tipp auf. So bleibt die
 * Reihe niedrig, auch bei 320 px (Wunsch des Autors vom 1.11.2026: die Momente nehmen wenig Platz
 * weg). Ein „Üben“ sitzt neben „Zur Stellung“ (das der
 * ersten Zeile); hat die zweite Zeile einen anderen Trainer, steht ihr „Üben“ im aufgeklappten Satz.
 * „Üben“ öffnet den Trainer der Kategorie, wo möglich gleich mit Thema (ui/trainer/trainerthema.ts).
 * Abhängigkeiten: buchzeilen.ts, app/navigationsKontext.ts, lucide.
 */
import { BookOpen, Lightbulb } from "lucide-react";
import { useNavigation } from "../../../app/navigationsKontext";
import { t } from "../../../i18n/sprache";
import type { Buchzeile } from "./buchzeilen";

const SYMBOLGROESSE = 14;

/**
 * Kurzname und Fundstelle, aufklappbar zum Satz; `art` unterscheidet Warum (Buch) und Finden
 * (Glühbirne) für das Auge und die Tests, `ueben` zeigt den Knopf im aufgeklappten Satz.
 * Beispiel: 12. O-O-O?? → „Drohung stehen gelassen (Kapitel 1)“, aufgeklappt „Die Drohung Sxe4
 * stand schon vor deinem Zug, und sie steht danach noch. … (Kapitel 1, Schach-Röntgen-Regel)“.
 */
export function Buchzeiletext({
  zeile,
  art,
  ueben = false,
}: {
  zeile: Buchzeile;
  art: "warum" | "finde";
  ueben?: boolean;
}) {
  const Symbol = art === "warum" ? BookOpen : Lightbulb;
  return (
    <details
      className="zeitleiste-warum"
      data-testid={art === "warum" ? "warumzeile" : "findezeile"}
      data-kennung={zeile.kennung}
    >
      <summary className="zeitleiste-warum-kopf">
        <Symbol size={SYMBOLGROESSE} aria-hidden="true" className="zeitleiste-warum-symbol" />
        <b>{zeile.anzeige}</b> {zeile.kapitel}
      </summary>
      <p className="zeitleiste-warum-text">
        {zeile.text} {zeile.quelle}
      </p>
      {ueben && <Uebenknopf zeile={zeile} />}
    </details>
  );
}

/**
 * Knopf „Üben“, der den Trainer der Kategorie öffnet (mit Thema, wo es eines gibt). Vorgelesen wird
 * „Üben: Schach-Röntgen-Trainer“; sichtbar nur „Üben“, damit er neben „Zur Stellung“ passt.
 */
export function Uebenknopf({ zeile }: { zeile: Buchzeile }) {
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
