/**
 * Blatt „Variante“: Titel ändern, Kommentar zur ganzen Variante, als PGN teilen, löschen.
 *
 * Rolle im Gesamtbild: Ein Tipp auf den Titel in der Kopfzeile öffnet es (Entwurf, Abschnitt 3:
 * „Titel antippen = umbenennen“, der Kommentar zur Variante ist „über den Titel erreichbar“).
 * Wunsch des Autors zu Frage g: Varianten sind editierbar und löschbar; Löschen fragt einmal nach.
 * Texte speichern nach der Tipp-Pause (useVariantenspeicher.ts).
 * Die Zurück-Taste beantwortet die Nachfrage zum Löschen mit „Nein“ (app/blattstapel.ts).
 * Abhängigkeiten: app/blattstapel.ts, training/variationen.ts, spiel/variationspgn.ts, PgnTeilen.tsx, Blatt, i18n.
 */
import { useState } from "react";
import { useZurueckSchliesst } from "../../../app/blattstapel";
import { t } from "../../../i18n/sprache";
import { KOMMENTAR_HOECHSTENS, TITEL_HOECHSTENS } from "../../../training/variationen";
import { variationAlsPgn } from "../../../spiel/variationspgn";
import { Knopfsymbol } from "../bausteine/Knopfsymbol";
import { Blatt } from "../spielstart/Blatt";
import { PgnTeilen } from "./PgnTeilen";
import type { Variantenstand } from "./useVariante";

/** Löschen mit einer Nachfrage. */
function Loeschen({ beiLoeschen }: { beiLoeschen: () => void }) {
  const [frage, setzeFrage] = useState(false);
  useZurueckSchliesst(frage, () => setzeFrage(false));
  if (!frage) {
    return (
      <button type="button" className="knopf-gefahr" onClick={() => setzeFrage(true)}>
        <Knopfsymbol art="loeschen" />
        {t("varianten.loeschen")}
      </button>
    );
  }
  return (
    <div className="nachfrage" role="alertdialog" aria-label={t("varianten.loeschen")}>
      <p>{t("varianten.loeschenFrage")}</p>
      <div className="knopfreihe">
        <button type="button" className="knopf-gefahr" onClick={beiLoeschen}>
          {t("varianten.loeschenJa")}
        </button>
        <button type="button" className="knopf-zweit" onClick={() => setzeFrage(false)}>
          {t("loeschen.nein")}
        </button>
      </div>
    </div>
  );
}

/** Name und Kommentar zur Variante, gespeichert nach der Tipp-Pause. */
function Felder({ stand }: { stand: Variantenstand }) {
  const v = stand.variation;
  return (
    <>
      <label className="feld">
        <span>{t("varianten.blatt.name")}</span>
        <input
          type="text"
          maxLength={TITEL_HOECHSTENS}
          value={v.titel}
          onChange={(e) => stand.aendereVariation({ ...v, titel: e.target.value }, "pause")}
        />
      </label>
      <label className="feld">
        <span>{t("varianten.blatt.kommentar")}</span>
        <textarea
          maxLength={KOMMENTAR_HOECHSTENS}
          value={v.kommentar}
          onChange={(e) => stand.aendereVariation({ ...v, kommentar: e.target.value }, "pause")}
        />
      </label>
    </>
  );
}

/**
 * Das Blatt. Eingaben: Zustand, offen, Schließen, was nach dem Löschen geschieht (zurück zur Liste).
 * Sonderfall: Ein Entwurf bleibt auch beim Umbenennen ungespeichert, bis der Leser „Speichern“
 * tippt (Wunsch des Autors, 1.11.2026).
 */
export function Variantenblatt({
  stand,
  offen,
  schliessen,
  beiGeloescht,
}: {
  stand: Variantenstand;
  offen: boolean;
  schliessen: () => void;
  beiGeloescht: () => void;
}) {
  const zu = () => {
    stand.schreibe();
    schliessen();
  };
  const loesche = () => {
    stand.loesche();
    beiGeloescht();
  };
  const inhalt = (
    <div className="variantenblatt">
      <Felder stand={stand} />
      <PgnTeilen text={variationAlsPgn(stand.variation)} name={stand.variation.titel} />
      <Loeschen beiLoeschen={loesche} />
    </div>
  );
  return (
    <Blatt
      titel={t("varianten.blatt.titel")}
      offen={offen}
      schliessen={zu}
      testid="variantenblatt"
      kinder={inhalt}
    />
  );
}
