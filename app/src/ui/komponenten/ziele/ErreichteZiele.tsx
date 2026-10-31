/**
 * Karte „Erreichte Ziele“ im Profil (Gamifizierung P13, PROFILKARTEN Rang 25): die erreichten
 * eigenen Ziele, neueste zuerst, mit Datum.
 *
 * Rolle im Gesamtbild: Sichtbar ab dem ersten erreichten Ziel. Nur Erreichtes steht hier; gelöste
 * oder offene Ziele zählt die App nirgends (Entscheidung E11, kein Druck).
 * Abhängigkeiten: training/zielarten.ts, training/ziele.ts, start/zielhilfen.ts, Speicher, i18n.
 */
import { datumText, t, tZahl } from "../../../i18n/sprache";
import { useSpeicher } from "../../../speicher/speicher";
import { zielartVon } from "../../../training/zielarten";
import { zielschluessel } from "../../../training/ziele";
import { zieltext } from "../start/zielhilfen";

/** So viele erreichte Ziele zeigt die Karte; die Zahl oben zählt alle. */
const HOECHSTENS_ERREICHTE_ZEILEN = 10;

/** Die Karte im Profil. */
export function ErreichteZiele() {
  const daten = useSpeicher((z) => z.daten);
  const erreicht = [...daten.ziele.erreicht].reverse().slice(0, HOECHSTENS_ERREICHTE_ZEILEN);
  return (
    <section className="karte" data-testid="profilkarte-ziele">
      <h2 className="karte-titel">{t("ziel.profil.titel")}</h2>
      <p>
        {tZahl("ziel.profil.anzahl", daten.ziele.erreicht.length, {
          n: daten.ziele.erreicht.length,
        })}
      </p>
      <ul className="zielliste">
        {erreicht.map(({ ziel, datum }) => {
          const kurz = zielartVon(ziel)?.kurz(ziel, daten);
          if (!kurz) return null;
          const tag = Number.isNaN(Date.parse(datum)) ? "" : datumText(new Date(datum));
          return (
            <li key={`${zielschluessel(ziel)}-${datum}`} className="zielzeile">
              {t("ziel.profil.zeile", { ziel: zieltext(kurz), datum: tag })}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
