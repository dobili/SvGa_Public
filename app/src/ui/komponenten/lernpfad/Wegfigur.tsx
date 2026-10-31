/**
 * Die eigene Figur auf dem Lernpfad: das Porträt des Lesers, sonst ein goldener Springer.
 *
 * Rolle im Gesamtbild: Gamifizierung P2. Die Figur steht an der aktuellen Station. Beim Öffnen
 * geht sie in einer kleinen Bewegung von der beim letzten Mal gemerkten Station (Merker
 * „lernpfadStation“, nur auf dem Gerät) zur aktuellen; bei „Bewegung reduzieren“ steht sie gleich
 * dort. Danach merkt sie sich die aktuelle Station für das nächste Öffnen.
 * Abhängigkeiten: app/merker.ts, profil (Spielerbild, useSpielerprofil), brett/figurenpfade, i18n.
 */
import { useEffect, useState } from "react";
import { schreibeMerker } from "../../../app/merker";
import { t } from "../../../i18n/sprache";
import { EINHEITEN_JE_FELD, FIGURENPFADE } from "../../brett/figurenpfade.generiert";
import { Spielerbild } from "../../profil/Spielerbild";
import { useSpielerprofil } from "../../profil/spieler";
import { MERKER_STATION } from "./lernpfad";

type Lage = { readonly left: string; readonly top: string };

/** Ob das Gerät „Bewegung reduzieren“ wünscht. */
function bewegungReduziert(): boolean {
  return (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Der goldene Springer aus den Figuren des Buches. */
function GoldenerSpringer() {
  const pfade = FIGURENPFADE.N;
  if (!pfade) return null;
  return (
    <svg
      className="lernpfad-springer"
      viewBox={`0 0 ${EINHEITEN_JE_FELD} ${EINHEITEN_JE_FELD}`}
      aria-hidden="true"
    >
      <path d={pfade.schattenriss} className="springer-rand" />
      <path d={pfade.figur} className="springer-gold" />
    </svg>
  );
}

/**
 * Die Figur. `start` ist die Lage der gemerkten Station (null beim ersten Öffnen), `ziel` die der
 * aktuellen; `kapitel` wird nach dem Zeichnen gemerkt.
 */
export function Wegfigur({
  ziel,
  start,
  kapitel,
}: {
  ziel: Lage | null;
  start: Lage | null;
  kapitel: number;
}) {
  const profil = useSpielerprofil();
  const [lage, setzeLage] = useState<Lage | null>(() =>
    bewegungReduziert() ? ziel : (start ?? ziel),
  );
  useEffect(() => {
    // Erst nach dem ersten Zeichnen umsetzen, damit der Übergang in CSS sichtbar läuft.
    const bild = window.requestAnimationFrame(() => setzeLage(ziel));
    schreibeMerker(MERKER_STATION, String(kapitel));
    return () => window.cancelAnimationFrame(bild);
  }, [ziel?.left, ziel?.top, kapitel]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!lage) return null;
  return (
    <span
      className="lernpfad-figur"
      style={lage}
      role="img"
      aria-label={t("lernpfad.figur", { kapitel })}
      data-testid="lernpfad-figur"
      data-kapitel={kapitel}
    >
      {profil.bild ? <Spielerbild profil={profil} /> : <GoldenerSpringer />}
    </span>
  );
}
