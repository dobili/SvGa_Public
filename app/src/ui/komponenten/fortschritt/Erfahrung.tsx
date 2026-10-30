/**
 * Erfahrungspunkte, Stufe und Abzeichen in der Karte „Dein Fortschritt“ im Profil.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (Ideensammlung, freigegeben 30.10.2026): Belohnungen wie
 * bei Chessly, nur auf dem Gerät, ohne Bestenliste. Oben die Stufe mit Namen aus dem Buch und den
 * EP, darunter ein Balken zur nächsten Stufe; aufklappbar das Gitter aller Abzeichen, verdiente
 * golden, offene als graue Silhouette mit ihrer Bedingung (wie die Orden in der Startanimation).
 * Abhängigkeiten: abzeichenstand.ts, abzeichen.ts, bausteine/Abzeichenbild.tsx,
 * bausteine/Fortschrittsbalken.tsx, i18n.
 */
import { t } from "../../../i18n/sprache";
import { Abzeichenbild } from "../bausteine/Abzeichenbild";
import { Fortschrittsbalken } from "../bausteine/Fortschrittsbalken";
import { ABZEICHEN } from "./abzeichen";
import { STUFENZAHL, useAbzeichenstand, type Abzeichenstand } from "./abzeichenstand";
import { STUFEN } from "./erfahrung";

/** Stufe, EP und Balken. Beispiel: „Stufe 3 von 10: Zentrum · 320 EP“, „Noch 180 EP bis Rochade“. */
function Stufenzeile({ stand }: { stand: Abzeichenstand }) {
  const { stufe } = stand;
  const naechste = STUFEN[stufe.nummer];
  const name = t(`erfahrung.stufe.${stufe.kennung}`);
  return (
    <div className="erfahrung" data-testid="erfahrung">
      <div className="erfahrung-stufe">
        <span data-testid="erfahrung-stufe">
          {t("erfahrung.stufe", { nummer: stufe.nummer, gesamt: STUFENZAHL, name })}
        </span>
        <span className="erfahrung-ep">{t("erfahrung.ep", { ep: stufe.ep })}</span>
      </div>
      <Fortschrittsbalken anteil={stufe.anteil} beschriftung={t("erfahrung.balken", { name })} />
      <p className="erfahrung-rest">
        {naechste && stufe.naechsteAb !== null
          ? t("erfahrung.rest", {
              rest: stufe.naechsteAb - stufe.ep,
              name: t(`erfahrung.stufe.${naechste.kennung}`),
            })
          : t("erfahrung.hoechste")}
      </p>
    </div>
  );
}

/** Das aufklappbare Gitter aller Abzeichen. */
function Abzeichengitter({ stand }: { stand: Abzeichenstand }) {
  return (
    <details className="anleitung" data-testid="abzeichen">
      <summary>
        {t("abzeichen.gruppe", { verdient: stand.verdient.size, gesamt: ABZEICHEN.length })}
      </summary>
      <p className="hinweis">{t("abzeichen.erklaerung")}</p>
      <p className="hinweis">{t("erfahrung.erklaerung")}</p>
      <ul className="abzeichengitter">
        {ABZEICHEN.map((a) => {
          const verdient = stand.verdient.has(a.kennung);
          const name = t(`abzeichen.name.${a.kennung}`);
          return (
            <li
              key={a.kennung}
              className={verdient ? "verdient" : "offen"}
              data-testid={`abzeichen-${a.kennung}`}
            >
              <Abzeichenbild
                symbol={a.symbol}
                beschriftung={t(verdient ? "abzeichen.verdient" : "abzeichen.offen", { name })}
                silhouette={!verdient}
              />
              <span>
                <span className="abzeichengitter-name">{name}</span>
                <span className="abzeichengitter-bedingung">
                  {t(`abzeichen.bedingung.${a.kennung}`)}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </details>
  );
}

/** Stufe und Abzeichen; nichts, solange der Speicher lädt. */
export function Erfahrung() {
  const stand = useAbzeichenstand();
  if (!stand) return null;
  return (
    <>
      <Stufenzeile stand={stand} />
      <Abzeichengitter stand={stand} />
    </>
  );
}
