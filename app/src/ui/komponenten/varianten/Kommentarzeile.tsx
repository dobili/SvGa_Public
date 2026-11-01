/**
 * Kommentar zum gezeigten Zug direkt unter dem Brett; Antippen öffnet das Schreibfeld an Ort und
 * Stelle, der Knopf „…“ das Menü am Zug.
 *
 * Rolle im Gesamtbild: Frage d des Entwurfs (Empfehlung A). Ohne Kommentar steht ein leiser
 * Platzhalter „+ Notiz zu diesem Zug“. Gespeichert wird nach einer Tipp-Pause und beim Verlassen
 * des Feldes (useVariantenspeicher.ts). Ein leerer Text löscht den Kommentar. In der
 * Startstellung gehört der Kommentar zur Stellung selbst (Feld `start` der Variante).
 * Abhängigkeiten: training/variationen.ts, useVariante.ts, i18n, lucide.
 */
import { Ellipsis, MessageSquareText, Pencil } from "lucide-react";
import { t } from "../../../i18n/sprache";
import { knotenAm } from "../../../schach/variationsbaum";
import { ZUGKOMMENTAR_HOECHSTENS, type Knotendaten } from "../../../training/variationen";
import type { Variantenstand } from "./useVariante";

const SYMBOL = 18;

/** Kommentar des gezeigten Zuges oder der Startstellung. */
function kommentarVon(stand: Variantenstand): string {
  if (stand.pfad.length === 0) return stand.variation.start.kommentar ?? "";
  return knotenAm(stand.variation, stand.pfad)?.kommentar ?? "";
}

/** Setzt den Kommentar des gezeigten Zuges (nach der Tipp-Pause gespeichert). */
function setzeKommentar(stand: Variantenstand, text: string): void {
  if (stand.pfad.length > 0) {
    stand.aendereZug(stand.pfad, { kommentar: text }, "pause");
    return;
  }
  const start: { -readonly [K in keyof Knotendaten]: Knotendaten[K] } = {
    ...stand.variation.start,
    kommentar: text,
  };
  if (text === "") delete start.kommentar;
  stand.aendereVariation({ ...stand.variation, start }, "pause");
}

/** Text oder Platzhalter; ein Tipp öffnet das Schreibfeld. */
function Anzeige({ text, beiTipp }: { text: string; beiTipp: () => void }) {
  return (
    <button
      type="button"
      className={text ? "kommentartext" : "kommentartext leer"}
      onClick={beiTipp}
    >
      <span>{text || t("varianten.kommentar.platzhalter")}</span>
      {text && <Pencil size={SYMBOL} aria-label={t("varianten.kommentar.bearbeiten")} />}
    </button>
  );
}

/** Das Schreibfeld; speichert nach der Tipp-Pause und beim Verlassen. */
function Feld({
  stand,
  text,
  beiEnde,
}: {
  stand: Variantenstand;
  text: string;
  beiEnde: () => void;
}) {
  return (
    <textarea
      className="kommentarfeld"
      aria-label={t("varianten.kommentar.feld")}
      maxLength={ZUGKOMMENTAR_HOECHSTENS}
      autoFocus
      value={text}
      onChange={(e) => setzeKommentar(stand, e.target.value)}
      onBlur={beiEnde}
    />
  );
}

/**
 * Die Zeile. Eingaben: Zustand, ob das Schreibfeld offen ist, Öffnen und Schließen, Menü.
 * Beispiel: nach 4. De2 mit Kommentar → „Die Dame fesselt den Springer …“ mit Stift.
 */
export function Kommentarzeile({
  stand,
  offen,
  setzeOffen,
  beiMenue,
}: {
  stand: Variantenstand;
  offen: boolean;
  setzeOffen: (offen: boolean) => void;
  beiMenue: () => void;
}) {
  const text = kommentarVon(stand);
  const schliesse = () => {
    stand.schreibe();
    setzeOffen(false);
  };
  return (
    <div className="kommentarzeile" data-testid="kommentarzeile" data-tour="variante-kommentar">
      <MessageSquareText size={SYMBOL} aria-hidden="true" className="kommentarzeile-zeichen" />
      {offen ? (
        <Feld stand={stand} text={text} beiEnde={schliesse} />
      ) : (
        <Anzeige text={text} beiTipp={() => setzeOffen(true)} />
      )}
      {stand.pfad.length > 0 && (
        <button
          type="button"
          className="knopf-symbol"
          aria-label={t("varianten.menue.titel")}
          onClick={beiMenue}
        >
          <Ellipsis size={SYMBOL} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
