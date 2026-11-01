/**
 * Die Leiste des Stifts unter dem Brett: fünf Farbpunkte, Radierer, „Fertig“, darunter der
 * Hinweis zur Bedienung und Meldungen (angetipptes Feld, Grenze, Rückgängig nach dem Radieren).
 *
 * Rolle im Gesamtbild: Variationsbrowser, Stufe 2 (Frage e, Bild C): Im Stift-Modus steht diese
 * Leiste statt des Kommentars zum Zug unter dem Brett. Die Farben sind die fünf Buchfarben mit
 * ihren Linienarten (Gold durchgezogen, Rot gestrichelt, Grau gepunktet). Die Farbpunkte sind eine
 * Gruppe von Auswahlknöpfen, damit Bildschirmleser die gewählte Farbe nennen.
 * Abhängigkeiten: useMarkierstift.ts, training/variationsmarken.ts, i18n, lucide-react.
 */
import { Eraser } from "lucide-react";
import { t } from "../../../i18n/sprache";
import { STIFTFARBEN } from "../../../training/variationsmarken";
import type { Markierstift } from "./useMarkierstift";
import { farbname } from "./variantentexte";

const SYMBOL = 20;

/** Die fünf Farbpunkte. */
function Farbpunkte({ stift }: { stift: Markierstift }) {
  return (
    <div className="stiftfarben" role="radiogroup" aria-label={t("varianten.stift.farben")}>
      {STIFTFARBEN.map((farbe) => (
        <button
          key={farbe}
          type="button"
          role="radio"
          aria-checked={stift.farbe === farbe}
          aria-label={farbname(farbe)}
          className={`stiftpunkt stiftpunkt-${farbe}`}
          onClick={() => stift.waehleFarbe(farbe)}
        />
      ))}
    </div>
  );
}

/** Meldung unter der Leiste: angetipptes Feld, Grenze oder Rückgängig nach dem Radieren. */
function Stiftmeldung({ stift }: { stift: Markierstift }) {
  if (stift.geleert) {
    return (
      <p className="stiftmeldung" role="status">
        {t("varianten.stift.geleert")}{" "}
        <button type="button" className="knopf-flach" onClick={stift.holeZurueck}>
          {t("varianten.rueckgaengig")}
        </button>
      </p>
    );
  }
  const text = stift.voll
    ? t("varianten.stift.voll")
    : stift.start
      ? t("varianten.stift.gewaehlt", { feld: stift.start })
      : t("varianten.stift.hinweis");
  return (
    <p className="stiftmeldung hinweis" role="status" data-testid="stiftmeldung">
      {text}
    </p>
  );
}

/**
 * Die Leiste des Stifts. Eingabe: der Stift (useMarkierstift).
 * Beispiel: Rot gewählt, e5 angetippt → „Von e5: jetzt das Ziel antippen“.
 */
export function Markierstift({ stift }: { stift: Markierstift }) {
  return (
    <div className="karte stiftleiste" data-testid="stiftleiste">
      <div className="stiftzeile">
        <Farbpunkte stift={stift} />
        <button
          type="button"
          className="knopf-symbol"
          aria-label={t("varianten.stift.radierer")}
          title={t("varianten.stift.radierer")}
          onClick={stift.radiere}
        >
          <Eraser size={SYMBOL} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="knopf-zweit stiftfertig"
          onClick={() => stift.schalte(false)}
        >
          {t("varianten.stift.fertig")}
        </button>
      </div>
      <Stiftmeldung stift={stift} />
    </div>
  );
}
