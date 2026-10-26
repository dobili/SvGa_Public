/**
 * Porträt selbst gestalten (Wunsch des Autors vom 25.10.2026): Frisur, Haarfarbe, Hautfarbe,
 * Augen, Nase, Mund, Bart, Oberkörper und Kleidungsfarbe, dazu „Zufällig“.
 *
 * Rolle im Gesamtbild: Teil der Porträtwahl (Portraetwahl.tsx) für Profil und eigene Bots. Farben
 * stehen als Farbfelder zum Antippen da. Jedes andere Merkmal zeigt eine waagerecht wischbare
 * Reihe kleiner Bilder: das eigene Gesicht mit genau dieser Variante (Wunsch des Autors:
 * Vorschaubilder statt Ausklappmenüs, platzsparend). Die Formen kommen aus dem Stil „Personas“,
 * dazu ebenso viele eigene Zeichnungen (eigeneTeile.ts). Alle Felder sind Optionsfelder mit Namen
 * für Bildschirmleser.
 * Abhängigkeiten: merkmale.ts, speicher/profil.ts (svgAdresse), i18n, lucide-react, React.
 */
import { Dices } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { t, type Textschluessel } from "../../i18n/sprache";
import { svgAdresse } from "../../speicher/profil";
import {
  FARBFELDER,
  ladeBauer,
  MERKMALE,
  MERKMALFELDER,
  zufaelligeMerkmale,
  type Bauer,
  type Merkmalfeld,
} from "./merkmale";

/** Merkmale im Gesicht: Ihre Vorschau zeigt nur das Gesicht, vergrößert (profil.css, .nah). */
const GESICHT: readonly Merkmalfeld[] = ["augen", "nase", "mund", "bart"];

/** Größe des Würfels am Knopf „Zufällig“ (Bildpunkte). */
const WUERFELGROESSE = 18;

type Werte = Readonly<Record<Merkmalfeld, string>>;

/** Name eines Wertes für Bildschirmleser und die Zeile über der Reihe („Lange Haare“, „Kupfer“). */
function wertname(feld: Merkmalfeld, wert: string): string {
  return t(`profil.wert.${feld}.${wert}` as Textschluessel);
}

/** Kopf eines Merkmals: Name und gewählter Wert („Frisur: Lockiger Dutt“). */
function Kopf({ feld, wert }: { feld: Merkmalfeld; wert: string }) {
  return (
    <span className="einstellung-name baukasten-kopf">
      {t(`profil.merkmal.${feld}` as Textschluessel)}:{" "}
      <span className="baukasten-wert">{wertname(feld, wert)}</span>
    </span>
  );
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
 * Eine wischbare Reihe kleiner Porträts: das aktuelle Gesicht mit jeder Variante des Merkmals.
 * Solange DiceBear lädt, stehen leere Kacheln mit dem Namen da.
 */
function Bildreihe({
  feld,
  werte,
  bauer,
  beiWahl,
}: {
  feld: Merkmalfeld;
  werte: Werte;
  bauer: Bauer | null;
  beiWahl: (wert: string) => void;
}) {
  const bilder = useMemo(
    () =>
      bauer ? MERKMALE[feld].map((wert) => svgAdresse(bauer({ ...werte, [feld]: wert }))) : null,
    [bauer, feld, werte],
  );
  return (
    <div
      className={GESICHT.includes(feld) ? "bildreihe nah" : "bildreihe"}
      role="radiogroup"
      aria-label={t(`profil.merkmal.${feld}` as Textschluessel)}
    >
      {MERKMALE[feld].map((wert, i) => (
        <button
          key={wert}
          type="button"
          role="radio"
          aria-checked={wert === werte[feld]}
          aria-label={wertname(feld, wert)}
          title={wertname(feld, wert)}
          className="bildreihe-kachel"
          onClick={() => beiWahl(wert)}
        >
          {bilder?.[i] ? <img className="gegner-portraet" src={bilder[i]} alt="" /> : null}
        </button>
      ))}
    </div>
  );
}

/** Lädt den Bildbauer für die Vorschaureihen einmal. */
function useBauer(): Bauer | null {
  const [bauer, setzeBauer] = useState<Bauer | null>(null);
  useEffect(() => {
    let aktuell = true;
    void ladeBauer().then((b) => aktuell && setzeBauer(() => b));
    return () => {
      aktuell = false;
    };
  }, []);
  return bauer;
}

/**
 * Alle Merkmale mit Wahl. Beispiel: Tipp auf „Zufällig“ → neue Merkmale, Vorschau und Reihen folgen.
 */
export function Baukasten({ werte, beiWahl }: { werte: Werte; beiWahl: (werte: Werte) => void }) {
  const bauer = useBauer();
  return (
    <div className="baukasten" data-testid="baukasten">
      <button type="button" className="knopf-zweit" onClick={() => beiWahl(zufaelligeMerkmale())}>
        <Dices size={WUERFELGROESSE} aria-hidden="true" />
        {t("profil.zufall")}
      </button>
      {MERKMALFELDER.map((feld) => {
        const setze = (wert: string) => beiWahl({ ...werte, [feld]: wert });
        return (
          <div key={feld} className="baukasten-zeile">
            <Kopf feld={feld} wert={werte[feld]} />
            {FARBFELDER.includes(feld) ? (
              <Farbwahl feld={feld} wert={werte[feld]} beiWahl={setze} />
            ) : (
              <Bildreihe feld={feld} werte={werte} bauer={bauer} beiWahl={setze} />
            )}
          </div>
        );
      })}
    </div>
  );
}
