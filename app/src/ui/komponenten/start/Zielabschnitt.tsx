/**
 * Abschnitt „Deine Ziele“ der Wochenkarte (Gamifizierung P13): bis zu drei angeheftete Ziele mit
 * Fortschritt und Knopf, der direkt hinführt; ohne Ziele und nach „Ziel wählen“ die Zielwahl.
 *
 * Rolle im Gesamtbild: Eintrag in WOCHENABSCHNITTE (Rang 40), keine eigene Startkarte (es stehen
 * höchstens zwei). Erreichte Ziele prüft der Abschnitt beim Anzeigen (mit Verzeichnis der Kapitel,
 * für die Ringe der Buchteile) und feiert sie einmal kurz mit einem kleinen Feuerwerk (Schalter
 * „Feiereffekte“); Bot-Ziele erfüllen sich schon nach der Partie (NACH_PARTIEENDE). Kein
 * Ablaufdatum, kein Zähler für nicht erreichte Ziele; „Lösen“ entfernt ein Ziel mit einem Tipp.
 * Abhängigkeiten: training/ziele.ts, training/zielarten.ts, zielhilfen.ts, Zielauswahl.tsx,
 * bausteine/Feuerwerk.tsx, Speicher, i18n.
 */
import { useState } from "react";
import { t } from "../../../i18n/sprache";
import type { Ziel } from "../../../speicher/gamifizierung";
import { aendere, useSpeicher } from "../../../speicher/speicher";
import { zielartVon } from "../../../training/zielarten";
import {
  HOECHSTENS_ZIELE,
  ohneZiel,
  zielfortschritt,
  zielschluessel,
} from "../../../training/ziele";
import type { Zielkontext } from "../../../training/zieltypen";
import { Feuerwerk } from "../bausteine/Feuerwerk";
import { Reiterwort } from "./Reiterstand";
import { Zielauswahl } from "./Zielauswahl";
import {
  useHinfuehrung,
  useZielfeier,
  useZielkontext,
  useZielpruefung,
  zieltext,
} from "./zielhilfen";

const PROZENT = 100;

/** Ein angeheftetes Ziel: was fehlt, Balken „2 von 8“, Knopf und „Lösen“. */
function Zielzeile({ ziel, kontext }: { ziel: Ziel; kontext: Zielkontext }) {
  const fuehreHin = useHinfuehrung();
  const anzeige = zielartVon(ziel)?.anzeige(ziel, kontext);
  const stand = zielfortschritt(ziel, kontext);
  if (!anzeige) return null;
  const hin = anzeige.hin;
  return (
    <li className="zielzeile" data-testid="ziel-angeheftet">
      <p>{zieltext(anzeige.text)}</p>
      {stand && stand.gesamt > 1 && (
        <div className="zielstand">
          <span className="zielbalken" aria-hidden="true">
            <span style={{ width: `${(PROZENT * stand.erreicht) / stand.gesamt}%` }} />
          </span>
          <span className="hinweis">
            {t("ziel.stand", { erreicht: stand.erreicht, gesamt: stand.gesamt })}
          </span>
        </div>
      )}
      <div className="knopfzeile">
        {hin && (
          <button type="button" className="knopf-haupt" onClick={() => fuehreHin(hin)}>
            {t(anzeige.knopf)}
          </button>
        )}
        <button
          type="button"
          className="knopf-link"
          onClick={() => void aendere((d) => ohneZiel(d, ziel))}
        >
          {t("ziel.loesen")}
        </button>
      </div>
    </li>
  );
}

/** Kurze Feier für eben erreichte Ziele. */
function Zielfeier({ ziele, kontext }: { ziele: readonly Ziel[]; kontext: Zielkontext }) {
  if (ziele.length === 0) return null;
  return (
    <>
      <Feuerwerk umfang="klein" />
      {ziele.map((ziel) => {
        const kurz = zielartVon(ziel)?.kurz(ziel, kontext.daten);
        return kurz ? (
          <p
            key={zielschluessel(ziel)}
            className="wochenkarte-erreicht"
            role="status"
            data-testid="ziel-feier"
          >
            {t("ziel.feier", { ziel: zieltext(kurz) })}
          </p>
        ) : null;
      })}
    </>
  );
}

/** Der Abschnitt. */
export function Zielabschnitt() {
  const kontext = useZielkontext();
  useZielpruefung(kontext);
  const feier = useZielfeier(kontext.daten.ziele.erreicht);
  const [waehlen, setzeWaehlen] = useState(false);
  const angeheftet = kontext.daten.ziele.angeheftet.filter((z) => zielartVon(z) !== null);
  const wahlOffen = angeheftet.length === 0 || waehlen;
  return (
    <section className="wochenkarte-abschnitt zielabschnitt" data-testid="ziele">
      <Zielfeier ziele={feier} kontext={kontext} />
      {angeheftet.length > 0 && (
        <ul className="zielliste">
          {angeheftet.map((ziel) => (
            <Zielzeile key={zielschluessel(ziel)} ziel={ziel} kontext={kontext} />
          ))}
        </ul>
      )}
      {wahlOffen && angeheftet.length < HOECHSTENS_ZIELE ? (
        <Zielauswahl fertig={() => setzeWaehlen(false)} abbrechbar={angeheftet.length > 0} />
      ) : (
        angeheftet.length < HOECHSTENS_ZIELE && (
          <button type="button" className="knopf-zweit" onClick={() => setzeWaehlen(true)}>
            {t("ziel.waehlen")}
          </button>
        )
      )}
    </section>
  );
}

/** Stand im Reiter der Karte „Heute“: Zahl der angehefteten Ziele; ohne Ziel nichts. */
export function ZieleStand() {
  const angeheftet = useSpeicher((z) => z.daten.ziele.angeheftet);
  const anzahl = angeheftet.filter((ziel) => zielartVon(ziel) !== null).length;
  return anzahl > 0 ? <Reiterwort text={String(anzahl)} /> : null;
}
