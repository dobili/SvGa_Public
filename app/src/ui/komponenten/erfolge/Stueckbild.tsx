/**
 * Das Bild eines Stücks der Karte „Deine Erfolge“: ein Orden (bausteine/Orden.tsx) oder ein
 * Abzeichen (bausteine/Abzeichenbild.tsx), verdient farbig, offen als Silhouette.
 *
 * Rolle im Gesamtbild: Die Bilder kommen aus ordenkunst (nichts neu gezeichnet); diese Datei wählt
 * nur je Art den passenden Baustein. `klasse` legt die Größe fest (Stil in ui/stil/erfolge.css).
 * Abhängigkeiten: bausteine/Orden.tsx, bausteine/Abzeichenbild.tsx, erfolgsstuecke.ts (Typ), i18n.
 */
import { t } from "../../../i18n/sprache";
import { Abzeichenbild } from "../bausteine/Abzeichenbild";
import { Orden } from "../bausteine/Orden";
import type { Erfolgsstueck } from "./erfolgsstuecke";

/** Beispiel: <Stueckbild stueck={uebungen} klasse="erfolg-gross" /> → roter Orden mit Brett. */
export function Stueckbild({ stueck, klasse = "" }: { stueck: Erfolgsstueck; klasse?: string }) {
  const silhouette = !stueck.verdient;
  if (stueck.art === "orden") {
    return (
      <Orden
        symbol={stueck.symbol}
        beschriftung={t(silhouette ? "profil.erfolge.offen" : "orden.name", { name: stueck.name })}
        silhouette={silhouette}
        klasse={klasse}
        ring={stueck.ring ?? undefined}
      />
    );
  }
  return (
    <Abzeichenbild
      symbol={stueck.symbol}
      kennung={stueck.kennung}
      beschriftung={t(silhouette ? "abzeichen.offen" : "abzeichen.verdient", { name: stueck.name })}
      silhouette={silhouette}
      klasse={klasse}
    />
  );
}
