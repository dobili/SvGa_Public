/**
 * Das Bild eines Stücks der Karte „Deine Erfolge“: ein Orden (bausteine/Orden.tsx) oder ein
 * Abzeichen (bausteine/Abzeichenbild.tsx), verdient farbig, offen als Silhouette.
 *
 * Rolle im Gesamtbild: Die Bilder kommen aus ordenkunst (nichts neu gezeichnet); diese Datei wählt
 * nur je Art den passenden Baustein; Kapitelaufgaben des Lernpfads (seit 31.10.2026) zeigen ihr
 * Bild aus ordenkunst/nachtaufgaben.ts. `klasse` legt die Größe fest (Stil in ui/stil/erfolge.css).
 * Abhängigkeiten: bausteine/Orden.tsx, bausteine/Abzeichenbild.tsx, erfolgsstuecke.ts (Typ), i18n.
 */
import { useMemo } from "react";
import { t } from "../../../i18n/sprache";
import { aufgabeSvg } from "../ordenkunst/entwuerfe";
import { Abzeichenbild } from "../bausteine/Abzeichenbild";
import { Orden } from "../bausteine/Orden";
import type { Erfolgsstueck } from "./erfolgsstuecke";

/**
 * Das Bild einer Kapitelaufgabe (Lernpfad): dieselbe Hülle wie Ordenkunst, Bild aus nachtaufgaben.ts.
 * Die Kennung einer Aufgabe ist „<art>-<kapitel>“ („uebungen-3“); das Bild hängt nur an der Art.
 */
function Aufgabenbild({ stueck, klasse }: { stueck: Erfolgsstueck; klasse: string }) {
  const silhouette = !stueck.verdient;
  const art = stueck.kennung.split("-")[0] ?? "";
  const svg = useMemo(
    () => aufgabeSvg(art, { silhouette, glanz: !silhouette }) ?? "",
    [art, silhouette],
  );
  const beschriftung = t(silhouette ? "profil.erfolge.offen" : "nebenaufgaben.geschafft", {
    name: stueck.name,
  });
  return (
    <span
      className={`ordenkunst ordenkunst-abzeichen abzeichenbild ${silhouette ? "ordenkunst-silhouette" : ""} ${klasse}`}
      role="img"
      aria-label={beschriftung}
      data-ordenkunst={stueck.kennung}
      // Feste, eigene Zeichnungsdaten ohne Eingaben der Leser (wie Ordenkunst.tsx).
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

/** Beispiel: <Stueckbild stueck={uebungen} klasse="erfolg-gross" /> → roter Orden mit Brett. */
export function Stueckbild({ stueck, klasse = "" }: { stueck: Erfolgsstueck; klasse?: string }) {
  const silhouette = !stueck.verdient;
  if (stueck.art === "aufgabe") return <Aufgabenbild stueck={stueck} klasse={klasse} />;
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
