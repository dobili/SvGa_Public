/**
 * Legende zu den eigenen Pfeilen und Rahmen: eine Zeile je Farbe, aufklappbar je Nummer.
 *
 * Rolle im Gesamtbild: Variationsbrowser, Stufe 2 (Frage e, Entscheidung C, Bild e): „Wie A, und
 * ein Tipp auf eine Farbzeile klappt die Nummern dieser Farbe zum Beschriften auf. Unbeschriftete
 * Zeilen zeigen nur ‚beschriften …‘.“ Der Farbtext gilt für die ganze Variante (Feld `legende`),
 * die Nummerntexte nur für die gezeigte Stellung (Feld `nummerntexte` des Knotens). Im Stift-Modus
 * sind alle Zeilen Eingabefelder; sonst steht nur da, was beschriftet ist. Gespeichert wird nach
 * der Tipp-Pause und beim Verlassen des Feldes (useVariantenspeicher.ts). Seit Format 9 (Wunsch
 * des Autors, 1.11.2026) im Stift-Modus je Farbe der Haken „Nummern“ und je Marke „ohne Nummer“ /
 * „Nummer geben“ (Nummernschalter.tsx); Marken ohne Nummer stehen dann mit ihrem Feld in der Liste.
 * Abhängigkeiten: training/variationsmarken.ts, useMarkierstift.ts (Knotendaten), useVariante.ts,
 * bausteine/InfoKnopf.tsx, i18n, lucide-react.
 */
import { ChevronDown, ChevronUp, List } from "lucide-react";
import { useState } from "react";
import type { Markierungsfarbe } from "../../../analyse/werkzeug";
import { t } from "../../../i18n/sprache";
import { LEGENDE_HOECHSTENS } from "../../../training/variationen";
import {
  farbenIn,
  mitLegendentext,
  mitNummerntext,
  hatNummer,
  nummerierteMarken,
  type Nummerierte,
} from "../../../training/variationsmarken";
import { Farbnummern, Markennummer } from "./Nummernschalter";
import { FARBEN } from "../../brett/masse";
import { MitInfo } from "../bausteine/InfoKnopf";
import { knotendatenAm, variationMitDaten } from "./useMarkierstift";
import type { Variantenstand } from "./useVariante";
import { farbname, markenname } from "./variantentexte";

const SYMBOL = 16;
/** Linienmuster je Farbe wie am Brett: Rot gestrichelt, Grau gepunktet, sonst durchgezogen. */
const STRICH = { breite: 4, laenge: 28, rot: "6 3", grau: "0 6" } as const;

/** Kurzes Linienstück in der Farbe und Linienart der Marken. */
function Linienmuster({ farbe }: { farbe: Markierungsfarbe }) {
  const muster = farbe === "rot" ? STRICH.rot : farbe === "grau" ? STRICH.grau : undefined;
  return (
    <svg
      className="legendenlinie"
      viewBox={`0 0 ${STRICH.laenge} ${STRICH.breite * 2}`}
      aria-hidden="true"
    >
      <line
        x1={STRICH.breite / 2}
        y1={STRICH.breite}
        x2={STRICH.laenge - STRICH.breite / 2}
        y2={STRICH.breite}
        stroke={FARBEN[farbe]}
        strokeWidth={STRICH.breite}
        strokeLinecap={farbe === "grau" ? "round" : "butt"}
        strokeDasharray={muster}
      />
    </svg>
  );
}

/** Ein Text der Legende: im Stift-Modus ein Eingabefeld, sonst der Text (oder nichts). */
function Legendentext({
  text,
  name,
  bearbeiten,
  aendere,
  fertig,
}: {
  text: string;
  name: string;
  bearbeiten: boolean;
  aendere: (text: string) => void;
  fertig: () => void;
}) {
  if (!bearbeiten) return <span className="legendentext">{text}</span>;
  return (
    <input
      className="legendenfeld"
      value={text}
      maxLength={LEGENDE_HOECHSTENS}
      placeholder={t("varianten.legende.beschriften")}
      aria-label={name}
      onChange={(e) => aendere(e.target.value)}
      onBlur={fertig}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.currentTarget.blur();
      }}
    />
  );
}

/** Kreis mit Nummer in der Farbe (wie am Brett). */
function Nummernmarke({ marke }: { marke: Nummerierte }) {
  return (
    <span className={`nummernmarke nummernmarke-${marke.farbe}`} aria-hidden="true">
      {marke.nummer}
    </span>
  );
}

/** Die aufgeklappten Nummern einer Farbe; ohne Stift nur die beschrifteten. */
function Nummernliste({
  stand,
  marken,
  name,
  bearbeiten,
}: {
  stand: Variantenstand;
  marken: readonly Nummerierte[];
  name: string;
  bearbeiten: boolean;
}) {
  const v = stand.variation;
  const daten = knotendatenAm(v, stand.pfad);
  return (
    <ul className="legendennummernliste">
      {marken.map((m) => {
        if (!hatNummer(m))
          return bearbeiten ? <OhneNummer key={m.text} stand={stand} marke={m} /> : null;
        const text = daten.nummerntexte?.[m.schluessel] ?? "";
        if (!bearbeiten && !text) return null;
        const aendere = (neu: string) =>
          stand.aendereVariation(
            variationMitDaten(v, stand.pfad, mitNummerntext(daten, m.schluessel, neu)),
            "pause",
          );
        return (
          <li key={m.schluessel}>
            <Nummernmarke marke={m} />
            <Legendentext
              text={text}
              name={t("varianten.legende.nummertext", { farbe: name, nummer: m.nummer })}
              bearbeiten={bearbeiten}
              aendere={aendere}
              fertig={stand.schreibe}
            />
            {bearbeiten && <Markennummer stand={stand} marke={m} />}
          </li>
        );
      })}
    </ul>
  );
}

/** Eine Marke ohne Nummer in der aufgeklappten Liste: Strich, Feld oder Pfeil, „Nummer geben“. */
function OhneNummer({ stand, marke }: { stand: Variantenstand; marke: Nummerierte }) {
  const farbeAus = stand.variation.nummernAus?.includes(marke.farbe) === true;
  return (
    <li data-testid="marke-ohne-nummer">
      <span className={`nummernmarke nummernmarke-${marke.farbe}`} aria-hidden="true">
        –
      </span>
      <span className="legendentext">{markenname(marke)}</span>
      {!farbeAus && <Markennummer stand={stand} marke={marke} />}
    </li>
  );
}

/** Die Klappe einer Farbzeile: zeigt oder verbirgt die Nummern dieser Farbe. */
function Klappe(props: { offen: boolean; setzeOffen: (offen: boolean) => void; name: string }) {
  const Zeichen = props.offen ? ChevronUp : ChevronDown;
  return (
    <button
      type="button"
      className="knopf-symbol legendenklappe"
      aria-expanded={props.offen}
      aria-label={t("varianten.legende.aufklappen", { farbe: props.name })}
      onClick={() => props.setzeOffen(!props.offen)}
    >
      <Zeichen size={SYMBOL} aria-hidden="true" />
    </button>
  );
}

/** Eine Farbzeile mit Linienmuster, Nummern, Text und Klappe für die Nummern. */
function Farbzeile({
  stand,
  farbe,
  marken,
  bearbeiten,
}: {
  stand: Variantenstand;
  farbe: Markierungsfarbe;
  marken: readonly Nummerierte[];
  bearbeiten: boolean;
}) {
  const v = stand.variation;
  const texte = knotendatenAm(v, stand.pfad).nummerntexte ?? {};
  const mitTexten = marken.some((m) => texte[m.schluessel]);
  const [offen, setzeOffen] = useState(mitTexten && !bearbeiten);
  const name = farbname(farbe);
  const aendere = (text: string) =>
    stand.aendereVariation({ ...v, legende: mitLegendentext(v.legende, farbe, text) }, "pause");
  return (
    <li className="legendenzeile" data-testid={`legende-${farbe}`}>
      <div className="legendenkopf">
        <Linienmuster farbe={farbe} />
        <span className="legendennummern">
          {marken
            .filter(hatNummer)
            .map((m) => m.nummer)
            .join(" ")}
        </span>
        <Legendentext
          text={v.legende[farbe] ?? ""}
          name={t("varianten.legende.farbtext", { farbe: name })}
          bearbeiten={bearbeiten}
          aendere={aendere}
          fertig={stand.schreibe}
        />
        {(bearbeiten || mitTexten) && <Klappe offen={offen} setzeOffen={setzeOffen} name={name} />}
      </div>
      {offen && bearbeiten && <Farbnummern stand={stand} farbe={farbe} name={name} />}
      {offen && <Nummernliste stand={stand} marken={marken} name={name} bearbeiten={bearbeiten} />}
    </li>
  );
}

/**
 * Die Legende der gezeigten Stellung; ohne Marken nichts.
 * Eingaben: Stand der Variante, ob der Stift an ist (dann sind alle Texte bearbeitbar).
 * Beispiel: Gold 1, 2 und Rot 1, 2 → zwei Zeilen; „Rot“ aufklappen zeigt „1“ und „2“.
 */
export function Legende({ stand, bearbeiten }: { stand: Variantenstand; bearbeiten: boolean }) {
  const daten = knotendatenAm(stand.variation, stand.pfad);
  const wahl = { ohneNummer: daten.ohneNummer, farbenAus: stand.variation.nummernAus };
  const marken = nummerierteMarken(daten.marken, wahl);
  if (marken.length === 0) return null;
  return (
    <section className="karte legende" data-testid="legende">
      <MitInfo
        zeile={
          <h2 className="legendentitel">
            <List size={SYMBOL} aria-hidden="true" /> {t("varianten.legende.titel")}
          </h2>
        }
        erklaerung={t("varianten.legende.info")}
        thema={t("varianten.legende.titel")}
      />
      <ul className="legendenliste">
        {farbenIn(daten.marken).map((farbe) => (
          <Farbzeile
            key={`${farbe}-${stand.pfad.join(" ")}`}
            stand={stand}
            farbe={farbe}
            marken={marken.filter((m) => m.farbe === farbe)}
            bearbeiten={bearbeiten}
          />
        ))}
      </ul>
    </section>
  );
}
