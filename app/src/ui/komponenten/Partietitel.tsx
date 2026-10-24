/**
 * Titel der Partie in der Kopfzeile: gegen einen Bot sein Porträt und sein Name (R28).
 *
 * Rolle im Gesamtbild: Wunsch des Autors (19.10.2026): Statt „Partie gegen die Engine“ steht oben
 * „gegen Leon“ mit dem Porträt des Bots, wie in der Partienliste. Eigene Stufen ohne Bot, Partien
 * zu zweit und eingelesene Partien behalten ihren bisherigen Titel.
 * Abhängigkeiten: engine/gegner.ts, GegnerBild.tsx, speicher, i18n.
 */
import { gegnername } from "../../engine/gegner";
import { t } from "../../i18n/sprache";
import type { Partie } from "../../spiel/partie";
import { useSpeicher } from "../../speicher/speicher";
import { GegnerBild } from "./GegnerBild";

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
  return (
    <span className="partietitel">
      <GegnerBild bot={e.bot} eigene={eigene} name={name} />
      <span>{t("partie.titelBot", { name })}</span>
    </span>
  );
}
