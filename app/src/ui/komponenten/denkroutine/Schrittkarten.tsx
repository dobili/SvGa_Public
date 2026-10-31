/**
 * Die Schritte der Denkroutine als fünf nummerierte Karten mit Zeichen und Kurzzeile; ein Tipp
 * klappt den Buchtext des Schritts auf.
 *
 * Rolle im Gesamtbild: Runde „Weniger Text“, Punkt P6 (Wahl des Autors, 31.10.2026). Vorher stand
 * die Kopiervorlage des Buches als langer Absatz je Schritt da. Jetzt erkennt man jeden Schritt an
 * seinem Zeichen (Auge: Stellung erfassen, Liste: Kandidaten, Schwerter: stärkste Antwort, Waage:
 * Bewerten, Schild: Sicherheitsblick) und einer Kurzzeile der App; der Buchtext (Titel und Text aus
 * nachschlagen.json) bleibt vollständig erhalten und klappt per Tipp auf. Darunter „✓ Ziehen“ mit
 * dem Rückweg zu Schritt 2 aus dem Buch.
 * Regel: Kapitel 12, Denkroutine (vier Schritte und Sicherheitsblick vor dem Ziehen).
 * Abhängigkeiten: daten/laden.ts (Typ), lucide-react, i18n, Stil in ui/stil/denkroutine.css.
 */
import {
  Check,
  ChevronDown,
  Eye,
  ListChecks,
  Scale,
  Shield,
  Swords,
  type LucideIcon,
} from "lucide-react";
import { useId, useState } from "react";
import type { Nachschlagen } from "../../../daten/laden";
import { t, type Textschluessel } from "../../../i18n/sprache";
import "../../stil/denkroutine.css";

export type Routine = NonNullable<Nachschlagen["denkroutine"]>;

/** Größe der Zeichen (Bildpunkte). */
const ZEICHENGROESSE = 26;
const PFEILGROESSE = 20;
/** Nummer der Karte „Sicherheitsblick“ (nach den vier Schritten des Buches). */
const SICHERHEITSNUMMER = 5;

/** Zeichen und Kurzzeile je Karte, in der Reihenfolge des Buches. */
const KARTENZEICHEN: readonly { zeichen: LucideIcon; kurz: Textschluessel }[] = [
  { zeichen: Eye, kurz: "wenigertext.seiten.denk.kurz.erfassen" },
  { zeichen: ListChecks, kurz: "wenigertext.seiten.denk.kurz.kandidaten" },
  { zeichen: Swords, kurz: "wenigertext.seiten.denk.kurz.antwort" },
  { zeichen: Scale, kurz: "wenigertext.seiten.denk.kurz.bewerten" },
  { zeichen: Shield, kurz: "wenigertext.seiten.denk.kurz.sicherheit" },
];

/** Eine Karte der Schritte: Titel und Text kommen aus dem Buch. */
interface Schrittkarte {
  readonly nummer: number;
  readonly titel: string;
  readonly text: string;
}

/** Eine Karte mit Nummer, Zeichen, Titel, Kurzzeile; ein Tipp klappt den Buchtext auf. */
function Karte({ karte, index }: { karte: Schrittkarte; index: number }) {
  const [offen, setzeOffen] = useState(false);
  const kennung = useId();
  const eintrag = KARTENZEICHEN[index];
  const Zeichen = eintrag?.zeichen ?? Check;
  const sicherheit = karte.nummer === SICHERHEITSNUMMER;
  return (
    <li className={`denkkarte${sicherheit ? " denkkarte-sicherheit" : ""}`}>
      <button
        type="button"
        className="denkkarte-kopf"
        aria-expanded={offen}
        aria-controls={kennung}
        onClick={() => setzeOffen(!offen)}
      >
        <span className="denkkarte-nummer" aria-hidden="true">
          {karte.nummer}
        </span>
        <Zeichen className="denkkarte-zeichen" size={ZEICHENGROESSE} aria-hidden="true" />
        <span className="denkkarte-text">
          <strong>{karte.titel}</strong>
          {eintrag && <span className="denkkarte-kurz">{t(eintrag.kurz)}</span>}
        </span>
        <ChevronDown className="denkkarte-pfeil" size={PFEILGROESSE} aria-hidden="true" />
      </button>
      {offen && (
        <p id={kennung} className="denkkarte-buchtext">
          {karte.text}
        </p>
      )}
    </li>
  );
}

/**
 * Karte 1 der Nachschlageseite: die fünf Karten, darunter „✓ Ziehen“ mit dem Rückweg.
 * Beispiel: Tipp auf Karte 1 → „Was hat der letzte Zug des Gegners verändert, …“.
 */
export function Schrittkarten({ routine }: { routine: Routine }) {
  const karten: Schrittkarte[] = [
    ...routine.schritte,
    { nummer: SICHERHEITSNUMMER, ...routine.sicherheitsblick },
  ];
  return (
    <section className="karte" data-tour="denkroutine-schritte">
      <h2 className="karte-titel">{routine.titel}</h2>
      <ol className="denkkarten">
        {karten.map((karte, index) => (
          <Karte key={karte.nummer} karte={karte} index={index} />
        ))}
      </ol>
      <p className="denk-ziehen">
        <Check size={PFEILGROESSE} aria-hidden="true" />
        <strong>{routine.abschluss}</strong>
        <span className="hinweis">· {t("denkroutine.zurueck", { frage: routine.zurueck })}</span>
      </p>
    </section>
  );
}
