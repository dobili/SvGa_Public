/**
 * Titel der Partie in der Kopfzeile: gegen einen Bot sein Name (R28).
 *
 * Rolle im Gesamtbild: Wunsch des Autors (19.10.2026): Statt „Partie gegen die Engine“ steht oben
 * „gegen Leon“. Das Porträt steht nicht daneben, sondern im Untertitel darunter
 * (Partieuntertitel.tsx, Wunsch des Autors, 24.10.2026), damit der Name nicht umbricht.
 * Eigene Stufen ohne Bot, Partien zu zweit und eingelesene Partien behalten ihren eigenen Titel.
 * Abhängigkeiten: engine/gegner.ts, speicher, i18n.
 */
import { gegnername } from "../../../engine/gegner";
import { t } from "../../../i18n/sprache";
import type { Partie } from "../../../spiel/partie";
import { useSpeicher } from "../../../speicher/speicher";

/**
 * Der Titel; ohne geladene Partie der allgemeine.
 * Beispiel: Bot „leon“ → Porträt von Leon und „gegen Leon“.
 */
export function Partietitel({ partie }: { partie: Partie | null }) {
  const eigene = useSpeicher((z) => z.daten.spiel.eigeneGegner);
  const e = partie?.einstellung;
  if (e?.importiert) return <>{t("partie.titelImport")}</>;
  if (e?.gegner === "mensch") return <>{t("partie.titelMensch")}</>;
  const name = e ? gegnername(e.bot, e.botName, eigene) : null;
  if (!e || !name) return <>{t("partie.titel")}</>;
  return <>{t("partie.titelBot", { name })}</>;
}
