/**
 * Brett mit Zugseite und den Brettknöpfen (Werkzeuge, drehen). Den Hinweis „Markierungen des
 * Buches“ gibt es seit 0.2.32 nicht mehr (Wunsch des Autors: Platz sparen; die
 * Bildunterschrift erklärt die Markierungen ohnehin).
 *
 * Rolle im Gesamtbild: Oberer Teil des Abbildung-Bildschirms (Pflichtenheft 4
 * „Brettdarstellung“: Brett drehen, Koordinaten ein und aus; „Skelett-Ansicht“). Seit dem
 * Werkzeug-Umbau 0.2.30 stehen unten rechts die Werkzeug-Symbole (Brettsymbole.tsx) und „Brett
 * drehen“; die Koordinaten stellt man in den Einstellungen ein (das Gerät merkt sie sich), die
 * Skelett-Ansicht schaltet das Bündel „Skelett-Röntgen“ (früher das Knochensymbol hier).
 * Beim Weiterspielen fragt hier eine kleine Auswahl nach der Figur für die Umwandlung.
 * Abhängigkeiten: ui/brett, schach/weiterspielen.ts, app/merker.ts, i18n, lucide-react.
 */
import { RotateCw } from "lucide-react";
import { useState } from "react";
import type { Markierung } from "../../analyse/werkzeug";
import { liesMerker } from "../../app/merker";
import { t } from "../../i18n/sprache";
import { farbkuerzel, type Stellung } from "../../schach/stellung";
import { skelettFen } from "../../schach/weiterspielen";
import { Umwandlung } from "./Umwandlung";
import { Brett } from "../brett/Brett";
import type { Brettbedienung } from "./useBrettbedienung";

const SYMBOLGROESSE = 20;

/** Ein Schalter mit Symbol (aria-pressed), etwa „Brett drehen“. */
function Schalter({
  an,
  name,
  beiKlick,
  children,
}: {
  an: boolean;
  name: string;
  beiKlick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className="knopf-symbol brettschalter"
      aria-pressed={an}
      aria-label={name}
      title={name}
      onClick={beiKlick}
    >
      {children}
    </button>
  );
}

/**
 * Das Brett der Abbildung.
 *
 * Eingaben: Stellung, Markierungen, ob sie aus dem Buch stammen, letzter Zug, Bedienung,
 * Beschriftung für Bildschirmleser, ob das Brett anfangs gedreht ist (Partie mit Schwarz),
 * Werkzeug-Symbole vor „Brett drehen“, weitere Schalter danach (Partie: ruhige Ansicht), ob die
 * Skelett-Ansicht an ist, eine schmale Leiste links neben dem Brett (Partie: Bewertungsbalken
 * im Rückblick; sie erfährt, ob das Brett gedreht ist).
 */
export function Brettbereich({
  stellung,
  markierungen,
  letzterZug,
  bedienung,
  beschriftung,
  anfangsGedreht = false,
  werkzeugSymbole = null,
  zusatzSchalter = null,
  skelett = false,
  seitenleiste = null,
}: {
  stellung: Stellung;
  markierungen: readonly Markierung[];
  letzterZug: { von: string; nach: string } | null;
  bedienung: Brettbedienung;
  beschriftung: string;
  anfangsGedreht?: boolean;
  werkzeugSymbole?: React.ReactNode;
  zusatzSchalter?: React.ReactNode;
  skelett?: boolean;
  seitenleiste?: ((gedreht: boolean) => React.ReactNode) | null;
}) {
  const [gedreht, setzeGedreht] = useState(anfangsGedreht);
  // Die Koordinaten stellt man in den Einstellungen ein; der Bildschirm liest sie beim Öffnen.
  const [koordinaten] = useState(liesMerker("koordinaten") !== "aus");
  const amZug = farbkuerzel(stellung.amZug);
  return (
    <div className="brettbereich">
      <div className={seitenleiste ? "brett-mit-leiste" : undefined}>
        {seitenleiste?.(gedreht)}
        <Brett
          fen={skelett ? skelettFen(stellung.fen) : stellung.fen}
          markierungen={skelett ? [] : markierungen}
          gedreht={gedreht}
          koordinaten={koordinaten}
          letzterZug={letzterZug}
          ausgewaehlt={bedienung.ausgewaehlt}
          ziele={bedienung.ziele}
          beiFeld={bedienung.beiFeld}
          beschriftung={`${beschriftung}, ${t(`abbildung.amZug.${amZug}`)}`}
        />
      </div>
      {bedienung.umwandlungOffen && <Umwandlung beiWahl={bedienung.waehleUmwandlung} />}
      <div className="brettzeile">
        <p className="am-zug">
          <span className={`am-zug-marke am-zug-${amZug}`} aria-hidden="true" />
          {t(`abbildung.amZug.${amZug}`)}
        </p>
        <div
          className="brettschalter-gruppe"
          role="group"
          aria-label={t("abbildung.brettwerkzeuge")}
        >
          {werkzeugSymbole}
          <Schalter an={gedreht} name={t("brett.drehen")} beiKlick={() => setzeGedreht(!gedreht)}>
            <RotateCw size={SYMBOLGROESSE} aria-hidden="true" />
          </Schalter>
          {zusatzSchalter}
        </div>
      </div>
      {skelett && <p className="hinweis">{t("brett.skelettHinweis")}</p>}
    </div>
  );
}
