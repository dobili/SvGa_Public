/**
 * Feld „Variante“ unter der Notiz eines Lernsammlungs- oder Fehlereintrags: eine vorhandene
 * Variante verknüpfen, eine neue aus der Stellung anlegen, verknüpfte lösen.
 *
 * Rolle im Gesamtbild: Variationsbrowser, Stufe 4 (Wunsch des Autors, 1.11.2026). Die Wahl gilt
 * erst beim Speichern des Eintrags wie die anderen Felder; angewandt wird sie in
 * training/variantenverknuepfung.ts (ohne neues Speicherformat). Beim Anlegen gibt es noch keine
 * verknüpften Varianten; beim Bearbeiten stehen sie mit „lösen“ darüber.
 * Abhängigkeiten: training/variantenverknuepfung.ts, Speicher, i18n.
 */
import { useId } from "react";
import { t } from "../../../i18n/sprache";
import { useSpeicher } from "../../../speicher/speicher";
import {
  verknuepfte,
  waehlbare,
  WAHL_KEINE,
  WAHL_NEU,
  type Variantenwahl as Wahl,
  type Verknuepfungsziel,
} from "../../../training/variantenverknuepfung";

/** Höchstens so viele Varianten stehen in der Auswahl (zuletzt geänderte zuerst). */
const AUSWAHL_HOECHSTENS = 50;

/** Die verknüpften Varianten mit „lösen“ (vorgemerkt bis zum Speichern). */
function Verknuepfte({
  ziel,
  wahl,
  beiWahl,
}: {
  ziel: Verknuepfungsziel;
  wahl: Wahl;
  beiWahl: (w: Wahl) => void;
}) {
  const alle = useSpeicher((z) => z.daten.variationen);
  const liste = verknuepfte(alle, ziel);
  if (liste.length === 0) return null;
  const schalte = (id: string) =>
    beiWahl({
      ...wahl,
      loesen: wahl.loesen.includes(id) ? wahl.loesen.filter((x) => x !== id) : [...wahl.loesen, id],
    });
  return (
    <ul className="variantenwahl-liste">
      {liste.map((v) => {
        const geloest = wahl.loesen.includes(v.id);
        return (
          <li key={v.id} className={geloest ? "geloest" : undefined}>
            <span>{v.titel || t("varianten.ohneTitel")}</span>
            <button type="button" className="knopf-link klein" onClick={() => schalte(v.id)}>
              {geloest ? t("varianten.wahl.behalten") : t("varianten.wahl.loesen")}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Das Feld. Eingaben: Eintrag (null beim Anlegen), Wahl und Änderung.
 * Beispiel: Eintrag aus Abb. 2.2 → Auswahl „Neue Variante aus dieser Stellung“ oder eine der
 * eigenen Varianten („Petroff-Falle“ …).
 */
export function Variantenwahl({
  ziel,
  wahl,
  beiWahl,
}: {
  ziel: Verknuepfungsziel | null;
  wahl: Wahl;
  beiWahl: (w: Wahl) => void;
}) {
  const id = useId();
  const alle = useSpeicher((z) => z.daten.variationen);
  const auswahl = waehlbare(alle, ziel).slice(0, AUSWAHL_HOECHSTENS);
  return (
    <div className="variantenwahl" data-testid="variantenwahl">
      <label className="einstellung-name" htmlFor={id}>
        {t("varianten.wahl.name")}
      </label>
      {ziel && <Verknuepfte ziel={ziel} wahl={wahl} beiWahl={beiWahl} />}
      <select
        id={id}
        className="textfeld"
        value={wahl.wahl}
        onChange={(e) => beiWahl({ ...wahl, wahl: e.target.value })}
      >
        <option value={WAHL_KEINE}>{t("varianten.wahl.keine")}</option>
        <option value={WAHL_NEU}>{t("varianten.wahl.neu")}</option>
        {auswahl.map((v) => (
          <option key={v.id} value={v.id}>
            {v.titel || t("varianten.ohneTitel")}
          </option>
        ))}
      </select>
    </div>
  );
}
