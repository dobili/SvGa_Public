/**
 * Menü am Zug: zur Hauptvariante machen, ab hier löschen, Zugzeichen, Kommentar.
 *
 * Rolle im Gesamtbild: Langes Drücken auf einen Zug der Leiste oder der Knopf „…“ in der
 * Kommentarzeile öffnet es (Entwurf, Abschnitt 3; dieselben Befehle an zwei Orten, damit niemand
 * sie suchen muss). Es ist ein Blatt von unten wie „Partie einstellen“ (spielstart/Blatt.tsx).
 * Löschen geschieht ohne Rückfrage, dafür bietet der Bildschirm danach „Rückgängig“ an.
 * Abhängigkeiten: schach/variationsbaum.ts, training/variationen.ts (Zugzeichen), Blatt, i18n.
 */
import { MessageSquareText, Star, Trash2 } from "lucide-react";
import { sprache, t } from "../../../i18n/sprache";
import {
  hauptvariantenAnteil,
  knotenAm,
  zeileDurch,
  type Pfad,
} from "../../../schach/variationsbaum";
import { ZUGZEICHEN, type Zugzeichen } from "../../../training/variationen";
import { Blatt } from "../spielstart/Blatt";
import type { Variantenstand } from "./useVariante";
import { nummerVor } from "./variantentexte";

const SYMBOL = 18;

/** Die Zugzeichen zur Wahl; der gesetzte Knopf ist gedrückt, ein zweiter Tipp nimmt es weg. */
function Zeichenwahl({
  gesetzt,
  beiWahl,
}: {
  gesetzt: Zugzeichen | undefined;
  beiWahl: (z: Zugzeichen | null) => void;
}) {
  return (
    <div className="zeichenwahl" role="group" aria-label={t("varianten.menue.zeichen")}>
      {ZUGZEICHEN.map((z) => (
        <button
          key={z}
          type="button"
          className="chip"
          aria-pressed={gesetzt === z}
          onClick={() => beiWahl(gesetzt === z ? null : z)}
        >
          {z}
        </button>
      ))}
    </div>
  );
}

/** Die drei Befehle unter den Zugzeichen. */
function Befehle({
  fertig,
  stand,
  pfad,
  beiKommentar,
}: {
  fertig: (handlung: () => void) => () => void;
  stand: Variantenstand;
  pfad: Pfad;
  beiKommentar: (pfad: Pfad) => void;
}) {
  const haupt = hauptvariantenAnteil(stand.variation, pfad).length === pfad.length;
  return (
    <>
      <button
        type="button"
        className="knopf-zweit"
        disabled={haupt}
        onClick={fertig(() => stand.zurHauptvariante(pfad))}
      >
        <Star size={SYMBOL} aria-hidden="true" /> {t("varianten.menue.hauptvariante")}
      </button>
      <button type="button" className="knopf-zweit" onClick={fertig(() => beiKommentar(pfad))}>
        <MessageSquareText size={SYMBOL} aria-hidden="true" /> {t("varianten.menue.kommentar")}
      </button>
      <button
        type="button"
        className="knopf-gefahr"
        onClick={fertig(() => stand.abHierLoeschen(pfad))}
      >
        <Trash2 size={SYMBOL} aria-hidden="true" /> {t("varianten.menue.loeschen")}
      </button>
    </>
  );
}

/** „3... Sxe4?!“: der Zug am Ende des Pfades mit Nummer. */
function menuetitel(stand: Variantenstand, pfad: Pfad): string {
  const zug = zeileDurch(stand.variation, pfad, sprache())[pfad.length - 1];
  return zug ? nummerVor(zug, true) + zug.text : "";
}

/**
 * Das Menü für den Zug am Ende von ``pfad``; ``pfad`` null schließt es.
 * Beispiel: langer Druck auf 3... Sxe4?! → „Zur Hauptvariante machen“, „Ab hier löschen“,
 * Zugzeichen mit „?!“ gedrückt, „Kommentar“.
 */
export function Zugmenue({
  stand,
  pfad,
  schliessen,
  beiKommentar,
}: {
  stand: Variantenstand;
  pfad: Pfad | null;
  schliessen: () => void;
  beiKommentar: (pfad: Pfad) => void;
}) {
  const knoten = pfad ? knotenAm(stand.variation, pfad) : null;
  const fertig = (handlung: () => void) => () => {
    handlung();
    schliessen();
  };
  const inhalt = pfad && (
    <div className="zugmenue">
      <Zeichenwahl
        gesetzt={knoten?.zeichen}
        beiWahl={(z) => fertig(() => stand.aendereZug(pfad, { zeichen: z }, "sofort"))()}
      />
      <Befehle fertig={fertig} stand={stand} pfad={pfad} beiKommentar={beiKommentar} />
    </div>
  );
  return (
    <Blatt
      titel={pfad ? menuetitel(stand, pfad) : ""}
      offen={pfad !== null && knoten !== null}
      schliessen={schliessen}
      testid="zugmenue"
      kinder={inhalt}
    />
  );
}
