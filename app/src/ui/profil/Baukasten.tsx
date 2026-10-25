/**
 * Porträt selbst gestalten (seit 0.2.140, Wunsch des Autors vom 25.10.2026): Frisur, Haarfarbe,
 * Hautfarbe, Augen, Nase, Mund, Bart, Oberkörper und Kleidungsfarbe, dazu „Zufällig“.
 *
 * Rolle im Gesamtbild: Teil des Profil-Editors (ProfilEditor.tsx). Farben stehen als Farbfelder
 * zum Antippen da (Optionsfelder mit Namen für Bildschirmleser), alles andere als Auswahllisten
 * wie beim Stil. Die Vorschau zeigt der Editor oben; hier entstehen nur die Merkmale.
 * Abhängigkeiten: merkmale.ts, i18n, lucide-react.
 */
import { Dices } from "lucide-react";
import { t, type Textschluessel } from "../../i18n/sprache";
import {
  FARBFELDER,
  MERKMALE,
  MERKMALFELDER,
  zufaelligeMerkmale,
  type Merkmalfeld,
} from "./merkmale";

/** Größe des Würfels am Knopf „Zufällig“ (Bildpunkte). */
const WUERFELGROESSE = 18;

type Werte = Readonly<Record<Merkmalfeld, string>>;

/** Name eines Wertes für Liste und Bildschirmleser („Lange Haare“, „Kupfer“). */
function wertname(feld: Merkmalfeld, wert: string): string {
  return t(`profil.wert.${feld}.${wert}` as Textschluessel);
}

/** Farbfelder eines Merkmals als Optionsfelder. */
function Farbwahl({
  feld,
  wert,
  beiWahl,
}: {
  feld: Merkmalfeld;
  wert: string;
  beiWahl: (wert: string) => void;
}) {
  return (
    <div
      className="farbwahl"
      role="radiogroup"
      aria-label={t(`profil.merkmal.${feld}` as Textschluessel)}
    >
      {MERKMALE[feld].map((farbe) => (
        <button
          key={farbe}
          type="button"
          role="radio"
          aria-checked={farbe === wert}
          aria-label={wertname(feld, farbe)}
          title={wertname(feld, farbe)}
          className="farbfeld"
          style={{ background: `#${farbe}` }}
          onClick={() => beiWahl(farbe)}
        />
      ))}
    </div>
  );
}

/**
 * Alle Merkmale mit Wahl. Beispiel: Tipp auf „Zufällig“ → neue Merkmale, die Vorschau folgt.
 */
export function Baukasten({ werte, beiWahl }: { werte: Werte; beiWahl: (werte: Werte) => void }) {
  return (
    <div className="baukasten" data-testid="baukasten">
      <button type="button" className="knopf-zweit" onClick={() => beiWahl(zufaelligeMerkmale())}>
        <Dices size={WUERFELGROESSE} aria-hidden="true" />
        {t("profil.zufall")}
      </button>
      {MERKMALFELDER.map((feld) => {
        const name = t(`profil.merkmal.${feld}` as Textschluessel);
        const setze = (wert: string) => beiWahl({ ...werte, [feld]: wert });
        return (
          <div key={feld} className="baukasten-zeile">
            {FARBFELDER.includes(feld) ? (
              <>
                <span className="einstellung-name">{name}</span>
                <Farbwahl feld={feld} wert={werte[feld]} beiWahl={setze} />
              </>
            ) : (
              <label className="stilnetz-liste">
                <span className="einstellung-name">{name}</span>
                <select
                  className="auswahlfeld"
                  value={werte[feld]}
                  onChange={(e) => setze(e.target.value)}
                >
                  {MERKMALE[feld].map((wert) => (
                    <option key={wert} value={wert}>
                      {wertname(feld, wert)}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>
        );
      })}
    </div>
  );
}
