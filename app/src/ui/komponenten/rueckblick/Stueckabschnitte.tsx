/**
 * Abschnitte „Neu verdient“ (Rang 40: Orden und Abzeichen) und „Neue Rekorde“ (Rang 50) des
 * Monatsrückblicks (Gamifizierung P12).
 *
 * Rolle im Gesamtbild: Wann ein Stück verdient wurde, steht in „verdient“ (G3, Datum der ersten
 * Feier); Rekorde tragen das Datum ihrer letzten Verbesserung (P5). Namen und Bilder kommen von
 * dort, wo das Profil sie zeigt: Orden aus den Fortschrittsringen, Abzeichen aus ABZEICHEN, Bilder
 * aus der Ordenkunst, Rekordtexte aus der Rekordtafel. Ein neues Abzeichen oder ein neuer Orden
 * erscheint hier von selbst.
 * Abhängigkeiten: training/rueckblickinhalt.ts, fortschritt/, ordenkunst/, rekorde/, i18n.
 */
import { datumText, t } from "../../../i18n/sprache";
import { REKORDARTEN } from "../../../training/rekordarten";
import { rekordeImMonat, verdientImMonat } from "../../../training/rueckblickinhalt";
import { ABZEICHEN, abzeichenname } from "../fortschritt/abzeichen";
import { useFortschrittsringe } from "../fortschritt/fortschrittsringe";
import { hatOrdenkunst, ordenkennungAusRing, type Stueckart } from "../ordenkunst/entwuerfe";
import { Ordenkunst } from "../ordenkunst/Ordenkunst";
import { rekordname, rekordtext } from "../rekorde/rekordtexte";
import type { Rueckblickangabe } from "./rueckblickabschnitte";
import { STUECKARTEN } from "./rueckblickwerte";

/** Namen der Orden aus den Ringen des Profils (Kennung → Name); leer, solange sie laden. */
function useOrdennamen(): ReadonlyMap<string, string> {
  const ringe = useFortschrittsringe();
  if (!ringe) return new Map();
  const alle = [...ringe.buchringe, ...ringe.teilringe, ...ringe.botringe];
  return new Map(alle.map((r) => [ordenkennungAusRing(r.testid), r.name]));
}

/** Der Name eines Stücks; null, wenn es ihn (noch) nicht gibt. */
function stueckname(
  art: Stueckart,
  kennung: string,
  ordennamen: ReadonlyMap<string, string>,
): string | null {
  if (art === "orden") return ordennamen.get(kennung) ?? null;
  return ABZEICHEN.some((a) => a.kennung === kennung) ? abzeichenname(kennung) : null;
}

/** Die im Monat verdienten Orden und Abzeichen mit Bild, Name und Datum. */
export function Stueckabschnitt({ angabe }: { readonly angabe: Rueckblickangabe }) {
  const ordennamen = useOrdennamen();
  const stuecke = STUECKARTEN.flatMap((art) =>
    verdientImMonat(angabe.daten.verdient, art, angabe.monat).map((v) => ({ ...v, art })),
  );
  return (
    <section className="rueckblick-abschnitt" data-testid="rueckblick-stuecke">
      <h2 className="karte-titel">{t("rueckblick.stuecke.titel")}</h2>
      <ul className="rueckblick-stuecke">
        {stuecke.map(({ art, kennung, datum }) => {
          const name = stueckname(art, kennung, ordennamen) ?? t(`rueckblick.stuecke.${art}`);
          return (
            <li key={`${art}:${kennung}`} className="rueckblick-stueck">
              {hatOrdenkunst(art, kennung) && (
                <Ordenkunst art={art} kennung={kennung} beschriftung={name} glanz={false} />
              )}
              <span className="rueckblick-stueckname">{name}</span>
              <span className="hinweis">{datumText(new Date(datum))}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** Die Rekorde, die im Monat aufgestellt oder verbessert wurden. */
export function Rekordabschnitt({ angabe }: { readonly angabe: Rueckblickangabe }) {
  const kennungen = REKORDARTEN.map((a) => a.kennung);
  const rekorde = rekordeImMonat(angabe.daten.rekorde, kennungen, angabe.monat);
  return (
    <section className="rueckblick-abschnitt" data-testid="rueckblick-rekorde">
      <h2 className="karte-titel">{t("rueckblick.rekorde.titel")}</h2>
      <ul className="rueckblick-zahlen">
        {rekorde.map(({ kennung, wert }) => (
          <li key={kennung}>
            {t("rueckblick.rekorde.zeile", {
              name: rekordname(kennung),
              wert: rekordtext(kennung, wert),
            })}
          </li>
        ))}
      </ul>
    </section>
  );
}
