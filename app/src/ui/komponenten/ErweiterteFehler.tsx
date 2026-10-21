/**
 * Erweiterter Modus der eigenen Bots: Fehlerhäufigkeit insgesamt, Gewicht je Fehlerart und
 * blindem Fleck, Höchstverlust je Fehlerart (Wunsch des Autors vom 20.10.2026, seit 0.2.117).
 *
 * Rolle im Gesamtbild: Teil des Formulars in GegnerEditor.tsx, zugeklappt unter „Erweitert“. Die
 * Stufen bestimmen die Grundstärke (engine/stufen.ts); die Zusatzfehler kommen wie bei Menschen
 * dieser Stärke dazu (engine/menschenwahl.ts). Hier verschiebt der Leser die Zahlen: Gewicht 1
 * heißt so oft wie Menschen, 0 nie, 3 dreimal so oft. Nicht angehakte Fehlerarten bleiben aus (die
 * Regler sind dann gesperrt); blinde Flecken stehen angehakt auf 1, sonst auf 0 (seit 0.2.117). Der Höchstverlust begrenzt,
 * wie teuer ein Fehler der Art höchstens sein darf; ganz rechts steht „unbegrenzt“ (Vorgabe, wie
 * Menschen: billige Fehler öfter als teure), dann fehlt der Wert im Speicher.
 * Abhängigkeiten: engine/gegner.ts, engine/menschenprofil.ts, engine/blindeFlecken.ts,
 * speicher/menschenwerte.ts, i18n.
 */
import { BLINDE_FLECKEN, type BlinderFleck } from "../../engine/blindeFlecken";
import type { Fehlerart } from "../../engine/fehlerart";
import type { EigenerGegner } from "../../engine/gegner";
import { GELEGENHEITSARTEN } from "../../engine/menschenprofil";
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
/** Reglerstellung rechts vom größten Höchstverlust: unbegrenzt. */
const UNBEGRENZT = HOECHSTVERLUST_HOECHSTENS + SCHRITT_VERLUST;

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
    g.gewichte?.[art] ?? (g.blindeFlecken.includes(art as BlinderFleck) ? 1 : 0);
  const mitGewicht = (art: Fehlerart | BlinderFleck, wert: number) =>
    setze({ ...g, gewichte: { ...g.gewichte, [art]: wert } });
  const verlust = (art: (typeof GELEGENHEITSARTEN)[number]) =>
    g.hoechstverlust?.[art] ?? UNBEGRENZT;
  const mitVerlust = (art: (typeof GELEGENHEITSARTEN)[number], wert: number) => {
    const uebrige = Object.entries(g.hoechstverlust ?? {}).filter(([a]) => a !== art);
    const neu = wert >= UNBEGRENZT ? uebrige : [...uebrige, [art, wert] as const];
    setze({ ...g, hoechstverlust: Object.fromEntries(neu) });
  };
  const verlustText = (wert: number) =>
    wert >= UNBEGRENZT
      ? t("spielen.eigene.unbegrenzt")
      : t("spielen.eigene.bauern", { wert: wert.toFixed(1).replace(".", ",") });
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
              bis={UNBEGRENZT}
              schritt={SCHRITT_VERLUST}
              text={verlustText(verlust(art))}
              gesperrt={aus}
              beiWahl={(wert) => mitVerlust(art, wert)}
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
