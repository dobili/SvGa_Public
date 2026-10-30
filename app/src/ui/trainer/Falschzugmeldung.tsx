/**
 * Der Satz zum letzten falschen Zug in Trainern mit fester Lösung: solange die Aufgabe läuft nur, wie
 * viel der Zug laut Engine verliert; danach der volle Vergleich mit dem Zug der Lösung.
 *
 * Rolle im Gesamtbild: Teil des Vergleichs nach einem falschen Zug (useFalschzug.ts; Wunsch des
 * Autors, 27.10.2026). Den vollen Vergleich schreibt Zugvergleich.tsx wie bei „Zug erraten“.
 * Abhängigkeiten: useFalschzug, Zugvergleich, training/rateurteil.ts, i18n.
 */
import { sprache, t, zahlText } from "../../i18n/sprache";
import { sanInSprache } from "../../schach/notation";
import { mitMatt } from "../../training/rateurteil";
import type { Falschzug } from "./useFalschzug";
import type { Fehlversuch, Vergleichsstand } from "./useRatevergleich";
import { Zugvergleich } from "./Zugvergleich";

/** Der Satz, solange die Lösung verdeckt ist: nur, wie viel der eigene Zug verliert. */
function verdeckterText(versuch: Fehlversuch, stand: Vergleichsstand): string {
  if (stand.art === "rechnet") return t("zugvergleich.rechnet");
  const urteil = stand.urteil;
  const eigen = sanInSprache(versuch.eigen, sprache());
  if (!urteil) return "";
  if (urteil.art !== "schwaecher") return t("zugvergleich.verdecktGleich", { eigen });
  if (mitMatt(urteil)) return t("zugvergleich.verdecktMatt", { eigen });
  return t("zugvergleich.verdeckt", { eigen, unterschied: zahlText(urteil.unterschied, 1) });
}

/**
 * Die Zeile unter dem Brett zum letzten falschen Zug.
 * Eingaben: der Falschzug der Aufgabe, ob die Lösung aufgedeckt ist, Kennung für Tests.
 * Sonderfall: ohne Versuch nichts.
 */
export function Falschzugmeldung({
  falschzug,
  aufgedeckt,
  testid,
}: {
  falschzug: Falschzug;
  aufgedeckt: boolean;
  testid: string;
}) {
  const { versuch, stand } = falschzug;
  if (!versuch || !stand) return null;
  if (aufgedeckt) {
    return <Zugvergleich versuch={versuch} stand={stand} bezug="loesung" testid={testid} />;
  }
  const text = verdeckterText(versuch, stand);
  return text ? (
    <p className="hinweis" data-testid={testid}>
      {text}
    </p>
  ) : null;
}
