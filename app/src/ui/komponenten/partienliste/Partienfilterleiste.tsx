/**
 * Filter und Sortierung der Partienliste: zwei Knöpfe mit aufklappender Liste in Worten (R54).
 *
 * Rolle im Gesamtbild: Teil von Partienliste.tsx. Wunsch des Autors (R54, Variante A,
 * 23.10.2026): Unbeschriftete Symbolknöpfe musste man kennen, und Filter und Sortierung waren
 * nicht getrennt. Deshalb oben „Filter“ (mit der Zahl aktiver Filter) und „Sortieren“ (mit der
 * gewählten Ordnung); ein Tipp klappt direkt darunter die Liste auf. Filter sind Häkchen in
 * Gruppen (Ergebnis, Wertung, Farbe, Gegner, Zeitklasse), die Sortierung eine Wahl aus sechs
 * Ordnungen. Aktive Filter stehen als Chips mit × unter den Knöpfen.
 * Abhängigkeiten: spiel/partienfilter.ts, lucide-react, i18n.
 */
import { ArrowUpDown, Check, Filter, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { t } from "../../../i18n/sprache";
import {
  aktiveFilter,
  ERGEBNISSE,
  FARBEN,
  GEGNERARTEN,
  OHNE_FILTER,
  SORTIERUNGEN,
  umschalten,
  WERTUNGEN,
  ZEITFILTER,
  type Ergebnis,
  type Farbfilter,
  type Gegnerfilter,
  type Partienfilter,
  type Sortierung,
  type Wertungsart,
  type Zeitfilter,
} from "../../../spiel/partienfilter";

/** Größe der Symbole in den Knöpfen (Bildpunkte). */
const SYMBOL = 18;

type Gruppenname = keyof Partienfilter;
const GRUPPEN: readonly { name: Gruppenname; werte: readonly string[] }[] = [
  { name: "ergebnis", werte: ERGEBNISSE },
  { name: "wertung", werte: WERTUNGEN },
  { name: "farbe", werte: FARBEN },
  { name: "gegner", werte: GEGNERARTEN },
  { name: "zeit", werte: ZEITFILTER },
];

/** Eine Ordnung der Liste: Sortierung und Richtung. */
interface Ordnung {
  readonly sortierung: Sortierung;
  readonly aufsteigend: boolean;
}
const ORDNUNGEN: readonly Ordnung[] = SORTIERUNGEN.flatMap((sortierung) => [
  { sortierung, aufsteigend: false },
  { sortierung, aufsteigend: true },
]);
const ordnungstext = (o: Ordnung) =>
  t(`spielen.ordnung.${o.sortierung}.${o.aufsteigend ? "auf" : "ab"}`);

/** Name eines Filterwerts, etwa „gewonnen“ oder „mit Schwarz“. */
function wertname(gruppe: Gruppenname, wert: string): string {
  switch (gruppe) {
    case "ergebnis":
      return t(`spielen.filter.ergebnis.${wert as Ergebnis}`);
    case "wertung":
      return t(`spielen.filter.wertung.${wert as Wertungsart}`);
    case "farbe":
      return t(`spielen.filter.farbe.${wert as Farbfilter}`);
    case "gegner":
      return t(`spielen.filter.gegner.${wert as Gegnerfilter}`);
    case "zeit":
      return t(`spielen.filter.zeit.${wert as Zeitfilter}`);
  }
}

/** Die aufgeklappte Filterliste: je Gruppe eine Überschrift und Häkchen. */
function Filterliste({
  filter,
  setzeFilter,
}: {
  filter: Partienfilter;
  setzeFilter: (filter: Partienfilter) => void;
}) {
  return (
    <div className="filterliste" data-testid="filterliste">
      {GRUPPEN.map(({ name, werte }) => (
        <fieldset key={name} className="filtergruppe">
          <legend>{t(`spielen.filter.${name}`)}</legend>
          {werte.map((wert) => {
            const gewaehlt = (filter[name] as readonly string[]).includes(wert);
            return (
              <button
                key={wert}
                type="button"
                role="checkbox"
                aria-checked={gewaehlt}
                className="filterwahl"
                onClick={() =>
                  setzeFilter({
                    ...filter,
                    [name]: umschalten(filter[name] as readonly string[], wert),
                  })
                }
              >
                <span className="filterhaken" aria-hidden="true">
                  {gewaehlt && <Check size={14} />}
                </span>
                {wertname(name, wert)}
              </button>
            );
          })}
        </fieldset>
      ))}
      {aktiveFilter(filter) > 0 && (
        <button type="button" className="knopf-zweit" onClick={() => setzeFilter(OHNE_FILTER)}>
          {t("spielen.filter.zuruecksetzen")}
        </button>
      )}
    </div>
  );
}

/** Die aufgeklappte Sortierliste: eine Wahl aus sechs Ordnungen. */
function Sortierliste({ gewaehlt, beiWahl }: { gewaehlt: Ordnung; beiWahl: (o: Ordnung) => void }) {
  return (
    <div className="filterliste" role="radiogroup" aria-label={t("spielen.sortierung")}>
      {ORDNUNGEN.map((o) => {
        const an = o.sortierung === gewaehlt.sortierung && o.aufsteigend === gewaehlt.aufsteigend;
        return (
          <button
            key={`${o.sortierung}-${String(o.aufsteigend)}`}
            type="button"
            role="radio"
            aria-checked={an}
            className="filterwahl"
            onClick={() => beiWahl(o)}
          >
            <span className="filterpunkt" aria-hidden="true" />
            {ordnungstext(o)}
          </button>
        );
      })}
    </div>
  );
}

/** Chips der aktiven Filter; × nimmt einen weg. */
function Filterchips({
  filter,
  setzeFilter,
}: {
  filter: Partienfilter;
  setzeFilter: (filter: Partienfilter) => void;
}) {
  const aktive = GRUPPEN.flatMap(({ name }) =>
    (filter[name] as readonly string[]).map((wert) => ({ name, wert })),
  );
  if (aktive.length === 0) return null;
  return (
    <div className="filterchips">
      {aktive.map(({ name, wert }) => (
        <button
          key={`${name}-${wert}`}
          type="button"
          className="filterchip"
          aria-label={t("spielen.filter.entfernen", { filter: wertname(name, wert) })}
          onClick={() =>
            setzeFilter({ ...filter, [name]: umschalten(filter[name] as readonly string[], wert) })
          }
        >
          {wertname(name, wert)}
          <X size={14} aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}

/**
 * Die Leiste über der Liste.
 * Beispiel: „Filter (2)“ zu, „Sortieren: Neueste zuerst“; darunter die Chips „mit Schwarz ×“ und
 * „verloren ×“.
 */
export function Partienfilterleiste({
  filter,
  setzeFilter,
  sortierung,
  aufsteigend,
  setzeSortierung,
  zusatz,
}: {
  filter: Partienfilter;
  setzeFilter: (filter: Partienfilter) => void;
  sortierung: Sortierung;
  aufsteigend: boolean;
  setzeSortierung: (sortierung: Sortierung, aufsteigend: boolean) => void;
  /** Weitere Knöpfe rechts in der Reihe (seit 0.2.142 der Papierkorb des Löschmodus). */
  zusatz?: ReactNode;
}) {
  const [offen, setzeOffen] = useState<"filter" | "sortieren" | null>(null);
  // Die Zahl am Knopf zählt die gesetzten Häkchen, wie die Chips darunter.
  const anzahl = GRUPPEN.reduce((summe, { name }) => summe + filter[name].length, 0);
  const umschalte = (welche: "filter" | "sortieren") =>
    setzeOffen(offen === welche ? null : welche);
  return (
    <div className="partienfilter" data-testid="partienfilter" data-tour="spielen-filter">
      <div className="filterknoepfe">
        <button
          type="button"
          className="filteroeffner"
          aria-expanded={offen === "filter"}
          onClick={() => umschalte("filter")}
        >
          <Filter size={SYMBOL} aria-hidden="true" />
          {anzahl > 0 ? t("spielen.filter.mitAnzahl", { anzahl }) : t("spielen.filter")}
        </button>
        <button
          type="button"
          className="filteroeffner"
          aria-expanded={offen === "sortieren"}
          onClick={() => umschalte("sortieren")}
        >
          <ArrowUpDown size={SYMBOL} aria-hidden="true" />
          {ordnungstext({ sortierung, aufsteigend })}
        </button>
        {zusatz}
      </div>
      {offen === "filter" && <Filterliste filter={filter} setzeFilter={setzeFilter} />}
      {offen === "sortieren" && (
        <Sortierliste
          gewaehlt={{ sortierung, aufsteigend }}
          beiWahl={(o) => {
            setzeSortierung(o.sortierung, o.aufsteigend);
            setzeOffen(null);
          }}
        />
      )}
      <Filterchips filter={filter} setzeFilter={setzeFilter} />
    </div>
  );
}
