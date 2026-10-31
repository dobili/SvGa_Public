/**
 * Leerzustand: ein graues Bild, eine kurze Zeile und ein Knopf mit Ziel, statt eines
 * Erklärsatzes.
 *
 * Rolle im Gesamtbild: Runde „Weniger Text“, Punkt P1 (Wahl des Autors, 31.10.2026). Jeder leere
 * Abschnitt (Wertung, Themen, Partien, Stapel, eigene Bots) sagt mit einem Bild, was hier einmal
 * steht, in höchstens fünf Wörtern, dass es noch leer ist, und führt mit einem Knopf dorthin, wo
 * es sich füllt („Erste Partie“, „Taktik üben“, „Neuer Gegner“). Der frühere Erklärsatz steht
 * vollständig hinter dem ⓘ des Abschnitts (Infoblase.tsx). Die Bilder tragen für Bildschirmleser
 * einen Namen mit dem Inhalt, den sie zeigen.
 * Abhängigkeiten: lucide-react, zeitartzeichen.ts, i18n, Stil in ui/stil/wenigertext-seiten.css.
 */
import { CircleUserRound, Plus, ScrollText, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { t } from "../../../i18n/sprache";
import { WERTUNGSTEMPI } from "../../../spiel/elomodell";
import "../../stil/wenigertext-seiten.css";
import { ZEITARTZEICHEN, zeitartenText } from "./zeitartzeichen";

/** Größe der Zeichen im Bild (Bildpunkte). */
const BILDZEICHEN = 22;
const PORTRAETZEICHEN = 34;
const KNOPFZEICHEN = 18;

/** Die gezeichneten Bilder; je Abschnitt eines. */
export type Leerbildart = "zeitkacheln" | "medaillen" | "portraet" | "liste";

/** Drei gestrichelte Kacheln mit den Zeichen der Zeitklassen (Wertung). */
function Zeitkacheln() {
  return (
    <span
      className="leerbild leerbild-kacheln"
      role="img"
      aria-label={t("wenigertext.seiten.bild.zeitkacheln", {
        zeitklassen: zeitartenText(WERTUNGSTEMPI),
      })}
    >
      {WERTUNGSTEMPI.map((tempo) => {
        const Zeichen = ZEITARTZEICHEN[tempo];
        return (
          <span key={tempo} className="leerbild-kachel">
            <Zeichen size={BILDZEICHEN} aria-hidden="true" />
          </span>
        );
      })}
    </span>
  );
}

/** Umrisse der drei Medaillenformen (Kreis, Sechseck, Raute) in einem 40er-Raster. */
const MEDAILLENFORMEN = [
  "M20 4 A16 16 0 1 1 19.9 4 Z",
  "M20 3 L35 11.5 L35 28.5 L20 37 L5 28.5 L5 11.5 Z",
  "M20 2 L38 20 L20 38 L2 20 Z",
] as const;
const MEDAILLE_MASS = 40;

/** Drei graue Medaillen-Silhouetten (Themen, Meisterschaft). */
function Medaillen() {
  return (
    <span
      className="leerbild leerbild-medaillen"
      role="img"
      aria-label={t("wenigertext.seiten.bild.medaillen")}
    >
      {MEDAILLENFORMEN.map((form) => (
        <svg key={form} viewBox={`0 0 ${MEDAILLE_MASS} ${MEDAILLE_MASS}`} aria-hidden="true">
          <path d={form} />
        </svg>
      ))}
    </span>
  );
}

/** Ein leeres Porträt mit goldenem Plus (eigene Bots). */
function Portraet() {
  return (
    <span
      className="leerbild leerbild-portraet"
      role="img"
      aria-label={t("wenigertext.seiten.bild.portraet")}
    >
      <CircleUserRound size={PORTRAETZEICHEN} aria-hidden="true" />
      <span className="leerbild-plus" aria-hidden="true">
        <Plus size={KNOPFZEICHEN} strokeWidth={3} />
      </span>
    </span>
  );
}

/** Eine gestrichelte, leere Liste mit Partiezettel (Partien). */
function Liste() {
  return (
    <span
      className="leerbild leerbild-liste"
      role="img"
      aria-label={t("wenigertext.seiten.bild.liste")}
    >
      <ScrollText size={BILDZEICHEN} aria-hidden="true" />
      <span className="leerbild-zeilen" aria-hidden="true">
        <span />
        <span />
      </span>
    </span>
  );
}

const BILDER: Readonly<Record<Leerbildart, () => ReactNode>> = {
  zeitkacheln: Zeitkacheln,
  medaillen: Medaillen,
  portraet: Portraet,
  liste: Liste,
};

/** Der Knopf eines Leerzustands: Text, Zeichen, Ziel; `haupt` füllt ihn (wichtigster Knopf). */
export interface Leerknopf {
  readonly text: string;
  readonly symbol: LucideIcon;
  readonly beiTipp: () => void;
  readonly haupt?: boolean;
}

/**
 * Der Leerzustand. `bild`: eine der gezeichneten Arten oder ein eigenes Bild (Stapel).
 * Beispiel: <Leerzustand bild="zeitkacheln" zeile="Noch keine Wertung."
 * knopf={{ text: "Erste Partie", symbol: Play, beiTipp: zumSpielen, haupt: true }} />.
 * Sonderfall: ohne Knopf nur Bild und Zeile.
 */
export function Leerzustand({
  bild,
  zeile,
  knopf,
  testid,
}: {
  bild: Leerbildart | ReactNode;
  zeile: string;
  knopf?: Leerknopf;
  testid?: string;
}) {
  const Bild = typeof bild === "string" ? BILDER[bild as Leerbildart] : null;
  const Zeichen = knopf?.symbol;
  return (
    <div className="leerzustand" data-testid={testid}>
      {Bild ? <Bild /> : bild}
      <p className="leerzustand-zeile">{zeile}</p>
      {knopf && Zeichen && (
        <button
          type="button"
          className={
            knopf.haupt ? "knopf-haupt leerzustand-knopf" : "knopf-zweit leerzustand-knopf"
          }
          onClick={knopf.beiTipp}
        >
          <Zeichen size={KNOPFZEICHEN} aria-hidden="true" />
          {knopf.text}
        </button>
      )}
    </div>
  );
}
