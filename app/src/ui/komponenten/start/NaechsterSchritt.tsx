/**
 * Karte „Dein nächster Schritt“ oben im Buch (Gamifizierung P1, Liste STARTKARTEN, Rang 10).
 *
 * Rolle im Gesamtbild: Stellt die Lage zusammen (Speicher, Datenverzeichnis, Übungen der fast
 * gelesenen Kapitel, Merker „zuletzt“ und „tagesserie“) und zeigt den ersten Vorschlag aus
 * training/naechsterSchritt.ts mit Knopf. „Lieber etwas anderes?“ klappt zwei Alternativen auf,
 * „Nicht jetzt“ blendet die Karte bis morgen aus.
 * Abhängigkeiten: training/naechsterSchritt.ts, daten/laden.ts, Speicher, Navigation, Merker.
 */
import { useState } from "react";
import { liesMerker } from "../../../app/merker";
import { useNavigation } from "../../../app/navigationsKontext";
import { ladeIndex, ladeKapitel } from "../../../daten/laden";
import { t } from "../../../i18n/sprache";
import { useSpeicher } from "../../../speicher/speicher";
import { serieAus } from "../../../training/kurzplaene";
import {
  kapitelFuerUebungen,
  tagesaufgabeHeuteErledigt,
  vorschlaege,
  type Kapitelangabe,
  type Lage,
  type Vorschlag,
} from "../../../training/naechsterSchritt";
import { useDaten } from "../bausteine/useDaten";
import { blendeNaechsterSchrittAus } from "./naechsterSchrittMerker";

const MERKER_ZULETZT = "zuletzt";
const MERKER_SERIE = "tagesserie";
const KEINE_KAPITEL: readonly Kapitelangabe[] = [];

/** Lädt die Übungskennungen der genannten Kapitel (aus dem Zwischenspeicher, wenn geladen). */
async function ladeUebungen(kapitel: readonly number[]): Promise<Record<number, string[]>> {
  const geladen = await Promise.all(kapitel.map((nummer) => ladeKapitel(nummer)));
  return Object.fromEntries(geladen.map((k) => [k.kapitel, k.uebungen.map((u) => u.id)]));
}

/** Der Satz eines Vorschlags; Namen (Thema, Trainer) werden erst hier übersetzt. */
function vorschlagstext(vorschlag: Vorschlag): string {
  const namen = Object.fromEntries(
    Object.entries(vorschlag.namen ?? {}).map(([platz, schluessel]) => [platz, t(schluessel)]),
  );
  return t(vorschlag.text, { ...vorschlag.werte, ...namen });
}

/** Die Lage aus Speicher, Verzeichnis und Merkern; die Übungen kommen nach dem Laden dazu. */
function useLage(): Lage | null {
  const daten = useSpeicher((z) => z.daten);
  const index = useDaten(ladeIndex, "index");
  const kapitel = index.art === "fertig" ? index.wert.kapitel : KEINE_KAPITEL;
  const kandidaten = kapitelFuerUebungen(daten, kapitel);
  const uebungen = useDaten(
    () => ladeUebungen(kandidaten),
    `naechster-uebungen-${kandidaten.join(",")}`,
  );
  if (index.art !== "fertig") return null;
  const jetzt = new Date();
  return {
    daten,
    kapitel,
    uebungen: uebungen.art === "fertig" ? uebungen.wert : {},
    zuletzt: liesMerker(MERKER_ZULETZT),
    tagesaufgabeErledigt: tagesaufgabeHeuteErledigt(
      daten,
      serieAus(liesMerker(MERKER_SERIE)),
      jetzt,
    ),
    jetzt,
  };
}

/** Die Alternativen hinter „Lieber etwas anderes?“. */
function Alternativen({ liste }: { liste: readonly Vorschlag[] }) {
  const { navigiere } = useNavigation();
  if (liste.length === 0) return null;
  return (
    <details className="naechster-andere" data-testid="naechster-andere">
      <summary>{t("naechster.andere")}</summary>
      <ul className="naechster-liste">
        {liste.map((v) => (
          <li key={v.art}>
            <p>{vorschlagstext(v)}</p>
            <button type="button" className="knopf-zweit" onClick={() => navigiere(v.ziel)}>
              {t(v.knopf)}
            </button>
          </li>
        ))}
      </ul>
    </details>
  );
}

/** Die Karte; ohne Vorschlag oder nach „Nicht jetzt“ nichts. */
export function NaechsterSchritt() {
  const { navigiere } = useNavigation();
  const lage = useLage();
  const [aus, setzeAus] = useState(false);
  const [erster, ...weitere] = lage ? vorschlaege(lage) : [];
  if (aus || !erster) return null;
  const nichtJetzt = () => {
    blendeNaechsterSchrittAus(new Date());
    setzeAus(true);
  };
  return (
    <section className="karte naechster-schritt" data-testid="naechster-schritt">
      <h2 className="karte-titel">{t("naechster.titel")}</h2>
      <p data-testid="naechster-text">{vorschlagstext(erster)}</p>
      <button type="button" className="knopf-haupt" onClick={() => navigiere(erster.ziel)}>
        {t(erster.knopf)}
      </button>
      <Alternativen liste={weitere} />
      <button type="button" className="knopf-link" onClick={nichtJetzt}>
        {t("naechster.nichtJetzt")}
      </button>
    </section>
  );
}
