/**
 * Filter und Sortierung der Partienliste als Symbole (seit 0.2.117, Wunsch des Autors vom
 * 19.10.2026: „Filter und Sortierung über Symbole, mehrere Filter zugleich“).
 *
 * Rolle im Gesamtbild: Teil von Partienliste.tsx. Eine Reihe Symbolknöpfe zum An- und
 * Ausschalten: Ergebnis (Pokal, Handschlag, Kreuz wie die Ergebnismarke), Wertung (Stern),
 * eigene Farbe (heller und dunkler Kreis), Gegner (Bot, Engine-Stufe, Mensch). Darunter die
 * Sortierung nach Datum, eigener Spielstärke oder Stärke des Gegners mit Richtung. Jeder Knopf
 * trägt seinen Namen als Beschriftung für Bildschirmleser und als Hinweis beim Darüberfahren.
 * Abhängigkeiten: spiel/partienfilter.ts, lucide-react, i18n.
 */
import {
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  Bot,
  CalendarDays,
  Circle,
  CircleX,
  Cpu,
  Handshake,
  Star,
  StarOff,
  Swords,
  TrendingUp,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";
import { t } from "../../i18n/sprache";
import {
  aktiveFilter,
  ERGEBNISSE,
  FARBEN,
  GEGNERARTEN,
  OHNE_FILTER,
  SORTIERUNGEN,
  umschalten,
  WERTUNGEN,
  type Partienfilter,
  type Sortierung,
} from "../../spiel/partienfilter";

/** Größe der Filtersymbole (Bildpunkte). */
const SYMBOL = 20;

const SYMBOLE: Readonly<Record<string, LucideIcon>> = {
  gewonnen: Trophy,
  remis: Handshake,
  verloren: CircleX,
  gewertet: Star,
  ungewertet: StarOff,
  white: Circle,
  black: Circle,
  bot: Bot,
  stufe: Cpu,
  mensch: Users,
  datum: CalendarDays,
  staerke: TrendingUp,
  gegner: Swords,
};

/** Ein Symbolknopf, der an- und ausgeschaltet wird. */
function Symbolknopf({
  wert,
  name,
  an,
  beiKlick,
}: {
  wert: string;
  name: string;
  an: boolean;
  beiKlick: () => void;
}) {
  const Symbol = SYMBOLE[wert] ?? Circle;
  return (
    <button
      type="button"
      className={`chip filterknopf filterknopf-${wert}`}
      aria-pressed={an}
      aria-label={name}
      title={name}
      onClick={beiKlick}
    >
      <Symbol size={SYMBOL} aria-hidden="true" fill={wert === "black" ? "currentColor" : "none"} />
    </button>
  );
}

/** Eine Gruppe von Filtersymbolen (etwa „Ergebnis“). */
function Gruppe<T extends string>({
  titel,
  werte,
  gewaehlt,
  setze,
  name,
}: {
  titel: string;
  werte: readonly T[];
  gewaehlt: readonly T[];
  setze: (neu: readonly T[]) => void;
  name: (wert: T) => string;
}) {
  return (
    <div className="filtergruppe" role="group" aria-label={titel}>
      {werte.map((w) => (
        <Symbolknopf
          key={w}
          wert={w}
          name={name(w)}
          an={gewaehlt.includes(w)}
          beiKlick={() => setze(umschalten(gewaehlt, w))}
        />
      ))}
    </div>
  );
}

/** Sortierung als drei Symbole und ein Knopf für die Richtung. */
function Sortierleiste({
  sortierung,
  aufsteigend,
  setze,
}: {
  sortierung: Sortierung;
  aufsteigend: boolean;
  setze: (sortierung: Sortierung, aufsteigend: boolean) => void;
}) {
  const Richtung = aufsteigend ? ArrowUpNarrowWide : ArrowDownWideNarrow;
  const richtung = t(
    aufsteigend ? "spielen.sortierung.aufsteigend" : "spielen.sortierung.absteigend",
  );
  return (
    <div className="filtergruppe" role="group" aria-label={t("spielen.sortierung")}>
      {SORTIERUNGEN.map((s) => (
        <Symbolknopf
          key={s}
          wert={s}
          name={t(`spielen.sortierung.${s}`)}
          an={sortierung === s}
          beiKlick={() => setze(s, aufsteigend)}
        />
      ))}
      <button
        type="button"
        className="chip filterknopf"
        aria-label={richtung}
        title={richtung}
        onClick={() => setze(sortierung, !aufsteigend)}
      >
        <Richtung size={SYMBOL} aria-hidden="true" />
      </button>
    </div>
  );
}

/**
 * Die Leiste über der Liste: vier Filtergruppen, Sortierung und „Filter zurücksetzen“.
 * Beispiel: Pokal und Handschlag an, Stern an → gewonnene oder remis gespielte gewertete Partien.
 */
export function Partienfilterleiste({
  filter,
  setzeFilter,
  sortierung,
  aufsteigend,
  setzeSortierung,
}: {
  filter: Partienfilter;
  setzeFilter: (filter: Partienfilter) => void;
  sortierung: Sortierung;
  aufsteigend: boolean;
  setzeSortierung: (sortierung: Sortierung, aufsteigend: boolean) => void;
}) {
  return (
    <div className="partienfilter" data-testid="partienfilter">
      <div className="filterreihe" aria-label={t("spielen.filter")} role="group">
        <Gruppe
          titel={t("spielen.filter.ergebnis")}
          werte={ERGEBNISSE}
          gewaehlt={filter.ergebnis}
          setze={(ergebnis) => setzeFilter({ ...filter, ergebnis })}
          name={(w) => t(`spielen.filter.ergebnis.${w}`)}
        />
        <Gruppe
          titel={t("spielen.filter.wertung")}
          werte={WERTUNGEN}
          gewaehlt={filter.wertung}
          setze={(wertung) => setzeFilter({ ...filter, wertung })}
          name={(w) => t(`spielen.filter.wertung.${w}`)}
        />
        <Gruppe
          titel={t("spielen.filter.farbe")}
          werte={FARBEN}
          gewaehlt={filter.farbe}
          setze={(farbe) => setzeFilter({ ...filter, farbe })}
          name={(w) => t(`spielen.filter.farbe.${w}`)}
        />
        <Gruppe
          titel={t("spielen.filter.gegner")}
          werte={GEGNERARTEN}
          gewaehlt={filter.gegner}
          setze={(gegner) => setzeFilter({ ...filter, gegner })}
          name={(w) => t(`spielen.filter.gegner.${w}`)}
        />
      </div>
      <Sortierleiste sortierung={sortierung} aufsteigend={aufsteigend} setze={setzeSortierung} />
      {aktiveFilter(filter) > 0 && (
        <button type="button" className="knopf-zweit" onClick={() => setzeFilter(OHNE_FILTER)}>
          {t("spielen.filter.zuruecksetzen")}
        </button>
      )}
    </div>
  );
}
