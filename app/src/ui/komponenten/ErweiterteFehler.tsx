/**
 * Erweiterter Modus der eigenen Bots: Fehlerhäufigkeit insgesamt, Gewicht je Fehlerart und
 * blindem Fleck, Höchstverlust je Fehlerart (Wunsch des Autors vom 20.10.2026, seit 0.2.116).
 *
 * Rolle im Gesamtbild: Teil des Formulars in GegnerEditor.tsx, zugeklappt unter „Erweitert“. Ein
 * Bot spielt wie Menschen seiner Stufen (engine/menschenwahl.ts); hier verschiebt der Leser die
 * Zahlen: Gewicht 1 heißt so oft wie Menschen dieser Stärke, 0 nie, 3 dreimal so oft. Nicht
 * angehakte Fehlerarten bleiben aus (die Regler sind dann gesperrt). Der Höchstverlust begrenzt,
 * wie teuer ein Fehler der Art höchstens sein darf (Vorgabe: der 90-%-Wert der Menschen).
 * Abhängigkeiten: engine/gegner.ts, engine/menschenprofil.ts, engine/blindeFlecken.ts, engine/zugwahl.ts,
 * speicher/menschenwerte.ts, i18n.
 */
import { BLINDE_FLECKEN, type BlinderFleck } from "../../engine/blindeFlecken";
import type { Fehlerart } from "../../engine/fehlerart";
import type { EigenerGegner } from "../../engine/gegner";
import { GELEGENHEITSARTEN, typischerVerlust } from "../../engine/menschenprofil";
import { BESONDERS_BLIND } from "../../engine/zugwahl";
import { t } from "../../i18n/sprache";
import {
  GEWICHT_HOECHSTENS,
  HAEUFIGKEIT_HOECHSTENS,
  HOECHSTVERLUST_HOECHSTENS,
  HOECHSTVERLUST_MINDESTENS,
} from "../../speicher/menschenwerte";

const SCHRITT = 0.1;
const SCHRITT_VERLUST = 0.5;
const PROZENT = 100;

function prozent(wert: number): string {
  return `${Math.round(wert * PROZENT)} %`;
}

/** Ein Regler mit Beschriftung und Wert. */
function Regler({
  id,
  name,
  wert,
  von,
  bis,
  schritt,
  text,
  gesperrt = false,
  beiWahl,
}: {
  id: string;
  name: string;
  wert: number;
  von: number;
  bis: number;
  schritt: number;
  text: string;
  gesperrt?: boolean;
  beiWahl: (wert: number) => void;
}) {
  return (
    <div className="stufenregler">
      <label htmlFor={id}>
        {name}: <strong>{text}</strong>
      </label>
      <input
        id={id}
        type="range"
        min={von}
        max={bis}
        step={schritt}
        value={wert}
        disabled={gesperrt}
        onChange={(e) => beiWahl(Number(e.target.value))}
      />
    </div>
  );
}

/** Die Regler des erweiterten Modus für einen eigenen Gegner. */
export function ErweiterteFehler({
  g,
  setze,
}: {
  g: EigenerGegner;
  setze: (neu: EigenerGegner) => void;
}) {
  const gewicht = (art: Fehlerart | BlinderFleck) =>
    g.gewichte?.[art] ?? (g.blindeFlecken.includes(art as BlinderFleck) ? BESONDERS_BLIND : 1);
  const mitGewicht = (art: Fehlerart | BlinderFleck, wert: number) =>
    setze({ ...g, gewichte: { ...g.gewichte, [art]: wert } });
  const verlust = (art: (typeof GELEGENHEITSARTEN)[number]) =>
    g.hoechstverlust?.[art] ?? typischerVerlust(art).hoechst;
  return (
    <details className="erweitert" data-testid="erweiterte-fehler">
      <summary className="einstellung-name">{t("spielen.eigene.erweitert")}</summary>
      <p className="hinweis">{t("spielen.eigene.erweitertHinweis")}</p>
      <Regler
        id="gegner-haeufigkeit"
        name={t("spielen.eigene.haeufigkeit")}
        wert={g.haeufigkeit ?? 1}
        von={0}
        bis={HAEUFIGKEIT_HOECHSTENS}
        schritt={SCHRITT}
        text={prozent(g.haeufigkeit ?? 1)}
        beiWahl={(haeufigkeit) => setze({ ...g, haeufigkeit })}
      />
      {GELEGENHEITSARTEN.map((art) => {
        const aus = !g.fehlerarten.includes(art);
        return (
          <fieldset key={art} className="erweitert-art">
            <legend>{t(`fehlerart.${art}`)}</legend>
            <Regler
              id={`gewicht-${art}`}
              name={t("spielen.eigene.gewicht")}
              wert={aus ? 0 : gewicht(art)}
              von={0}
              bis={GEWICHT_HOECHSTENS}
              schritt={SCHRITT}
              text={aus ? t("spielen.eigene.aus") : prozent(gewicht(art))}
              gesperrt={aus}
              beiWahl={(wert) => mitGewicht(art, wert)}
            />
            <Regler
              id={`verlust-${art}`}
              name={t("spielen.eigene.hoechstverlust")}
              wert={verlust(art)}
              von={HOECHSTVERLUST_MINDESTENS}
              bis={HOECHSTVERLUST_HOECHSTENS}
              schritt={SCHRITT_VERLUST}
              text={t("spielen.eigene.bauern", { wert: verlust(art).toFixed(1).replace(".", ",") })}
              gesperrt={aus}
              beiWahl={(wert) =>
                setze({ ...g, hoechstverlust: { ...g.hoechstverlust, [art]: wert } })
              }
            />
          </fieldset>
        );
      })}
      {BLINDE_FLECKEN.map((fleck) => (
        <Regler
          key={fleck}
          id={`gewicht-${fleck}`}
          name={t(`blind.${fleck}`)}
          wert={gewicht(fleck)}
          von={0}
          bis={GEWICHT_HOECHSTENS}
          schritt={SCHRITT}
          text={prozent(gewicht(fleck))}
          beiWahl={(wert) => mitGewicht(fleck, wert)}
        />
      ))}
    </details>
  );
}
