/**
 * Porträt eines eigenen Bots wählen: ein Aufklappmenü mit Vorschaubildern, nach Altersgruppen
 * (seit 0.2.100, Wunsch des Autors vom 19.10.2026).
 *
 * Rolle im Gesamtbild: Ersetzt das Auswahlmenü aus 0.2.99 im Editor der eigenen Gegner
 * (GegnerEditor.tsx). Ein Auswahlmenü des Systems kann keine Bilder zeigen; der Autor musste jedes
 * Porträt einzeln wählen, um es zu sehen. Jetzt zeigt ein Knopf das gewählte Bild mit Pfeil; er
 * klappt ein Gitter aller 30 Porträts auf, gruppiert wie zuvor (Kinder bis Ältere). Die Kacheln
 * sind echte Optionsfelder: Pfeiltasten wandern durch die Bilder, der Bildschirmleser liest die
 * Beschreibung („Mädchen mit Zöpfen, braunes Haar“). Nach der Wahl klappt das Menü zu.
 * Abhängigkeiten: engine/portraetwahl.ts, GegnerBild, gegnerportraet.ts, i18n, lucide-react.
 */
import { ChevronDown } from "lucide-react";
import { useRef, useState, type ReactNode } from "react";
import type { EigenerGegner } from "../../engine/gegner";
import { ALTERSGRUPPEN, PORTRAETWAHL, type Portraetkennung } from "../../engine/portraetwahl";
import { t } from "../../i18n/sprache";
import { GegnerBild } from "./GegnerBild";
import { portraet } from "./gegnerportraet";

/** Größe des Pfeils am Knopf (Bildpunkte). */
const PFEILGROESSE = 20;
/** Gemeinsamer Name der Optionsfelder (eine Gruppe für alle Altersgruppen). */
const FELDNAME = "gegner-portraet";

/** Eine Kachel im Gitter: Optionsfeld, Bild und unsichtbare Beschreibung. */
function Kachel({
  wert,
  gewaehlt,
  beiWahl,
  beiFertig,
  children,
  text,
}: {
  wert: string;
  gewaehlt: boolean;
  beiWahl: (wert: string) => void;
  beiFertig: () => void;
  children: ReactNode;
  text: string;
}) {
  return (
    <label
      className="portraetkachel"
      title={text}
      onClick={(e) => {
        // Tippen auf das Bild wählt und schließt; Pfeiltasten und Leertaste erreichen nur das
        // Optionsfeld und wählen, ohne zu schließen.
        if (e.target instanceof HTMLInputElement) return;
        e.preventDefault();
        beiWahl(wert);
        beiFertig();
      }}
    >
      <input
        type="radio"
        className="nur-vorlesen"
        name={FELDNAME}
        value={wert}
        checked={gewaehlt}
        onChange={() => beiWahl(wert)}
        onKeyDown={(e) => {
          if (e.key !== "Enter") return;
          // Sonst löst dieselbe Taste am wieder fokussierten Knopf einen Klick aus und öffnet neu.
          e.preventDefault();
          beiFertig();
        }}
      />
      {children}
      <span className="nur-vorlesen">{text}</span>
    </label>
  );
}

/**
 * Knopf mit dem gewählten Porträt; darunter aufklappbar alle Porträts zur Wahl.
 * Eingaben: der Gegner im Formular (für Name und Bild) und `beiWahl` mit der Kennung oder null
 * für „kein Bild“. Beispiel: Klick auf „Ältere Frau mit Dutt und Brille“ → beiWahl("wahl-25").
 */
export function PortraetAuswahl({
  gegner,
  beiWahl,
}: {
  gegner: EigenerGegner;
  beiWahl: (kennung: Portraetkennung | null) => void;
}) {
  const [offen, setzeOffen] = useState(false);
  const knopf = useRef<HTMLButtonElement>(null);
  const name = gegner.name || "?";
  const waehle = (wert: string) =>
    beiWahl(PORTRAETWAHL.find((p) => p.kennung === wert)?.kennung ?? null);
  const schliesse = () => {
    setzeOffen(false);
    knopf.current?.focus();
  };
  const beschreibung = gegner.portraet
    ? t(`portraet.${gegner.portraet}`)
    : t("spielen.eigene.portraetKeins");
  return (
    <div className="portraetwahl">
      <span className="einstellung-name" id="gegner-portraet-titel">
        {t("spielen.eigene.portraet")}
      </span>
      <button
        ref={knopf}
        type="button"
        className="portraetknopf"
        aria-expanded={offen}
        aria-controls="gegner-portraet-liste"
        aria-labelledby="gegner-portraet-titel gegner-portraet-wahl"
        onClick={() => setzeOffen(!offen)}
      >
        <GegnerBild bot={gegner.kennung} eigene={[gegner]} name={name} />
        <span className="portraetknopf-text" id="gegner-portraet-wahl">
          {beschreibung}
        </span>
        <ChevronDown className="aufklapper" size={PFEILGROESSE} aria-hidden="true" />
      </button>
      {offen && (
        <div
          id="gegner-portraet-liste"
          className="portraetliste"
          role="radiogroup"
          aria-labelledby="gegner-portraet-titel"
          onKeyDown={(e) => e.key === "Escape" && schliesse()}
        >
          <div className="portraetgitter">
            <Kachel
              wert=""
              gewaehlt={!gegner.portraet}
              beiWahl={waehle}
              beiFertig={schliesse}
              text={t("spielen.eigene.portraetKeins")}
            >
              <span className="gegner-portraet gegner-zeichen" aria-hidden="true">
                {name.slice(0, 1)}
              </span>
            </Kachel>
          </div>
          {ALTERSGRUPPEN.map((gruppe) => (
            <div key={gruppe} className="portraetgruppe">
              <span className="portraetgruppe-titel">{t(`portraet.gruppe.${gruppe}`)}</span>
              <div className="portraetgitter">
                {PORTRAETWAHL.filter((p) => p.gruppe === gruppe).map((p) => (
                  <Kachel
                    key={p.kennung}
                    wert={p.kennung}
                    gewaehlt={gegner.portraet === p.kennung}
                    beiWahl={waehle}
                    beiFertig={schliesse}
                    text={t(`portraet.${p.kennung}`)}
                  >
                    <img className="gegner-portraet" src={portraet(p.kennung)} alt="" />
                  </Kachel>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
