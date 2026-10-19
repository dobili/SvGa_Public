/**
 * Das Bild eines Gegners: Porträt eines vorgefertigten Bots, das gewählte Porträt eines eigenen
 * Bots (seit 0.2.99) oder sein Anfangsbuchstabe; dazu ein Stern, wenn der Leser ihn schon in
 * einer gewerteten Partie besiegt hat.
 *
 * Rolle im Gesamtbild: Gemeinsamer Baustein für Gegnerwahl (Kacheln und Sprechblase), Editor der
 * eigenen Gegner und Partienliste (Wunsch des Autors, 19.10.2026). Der Stern ist derselbe wie für
 * gewertete Partien in der Partienliste.
 * Abhängigkeiten: engine/gegner.ts, gegnerportraet.ts, i18n, lucide-react.
 */
import { Star } from "lucide-react";
import { gegnerVon, type EigenerGegner } from "../../engine/gegner";
import { t } from "../../i18n/sprache";
import { portraet } from "./gegnerportraet";

/** Größe des Sterns am Porträt (Bildpunkte). */
const STERNGROESSE = 12;

/**
 * Bild eines Gegners. `bot`: Kennung (vorgefertigt oder eigen); `name`: für den
 * Anfangsbuchstaben, wenn es kein Bild gibt; `besiegt`: Stern unten rechts.
 * Beispiel: <GegnerBild bot="lotta" eigene={[]} name="Lotta" besiegt /> → Lottas Porträt mit Stern.
 */
export function GegnerBild({
  bot,
  eigene,
  name,
  besiegt = false,
}: {
  bot: string | null;
  eigene: readonly EigenerGegner[];
  name: string;
  besiegt?: boolean;
}) {
  const vorgefertigt = gegnerVon(bot);
  const eigenerBild = eigene.find((g) => g.kennung === bot)?.portraet;
  const bild = vorgefertigt ? vorgefertigt.kennung : (eigenerBild ?? null);
  return (
    <span className="gegnerbild">
      {bild ? (
        <img className="gegner-portraet" src={portraet(bild)} alt="" />
      ) : (
        <span className="gegner-portraet gegner-zeichen" aria-hidden="true">
          {name.slice(0, 1)}
        </span>
      )}
      {besiegt && (
        <span
          className="gegner-besiegt"
          role="img"
          aria-label={t("spielen.bot.besiegt")}
          title={t("spielen.bot.besiegt")}
        >
          <Star size={STERNGROESSE} aria-hidden="true" />
        </span>
      )}
    </span>
  );
}
