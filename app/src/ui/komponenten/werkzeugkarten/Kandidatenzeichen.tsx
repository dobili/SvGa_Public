/**
 * Zeichen der Kandidatenzeilen (P10): die Art eines Kandidaten als Bildzeichen, die Zeile der
 * stärksten Antwort mit Material und die kurze Legende der Zeichen.
 *
 * Rolle im Gesamtbild: Teil von Kandidatenzeilen.tsx, eigene Datei, damit beide kurz bleiben.
 * Die Zeichen tragen für Bildschirmleser die Texte, die früher als Satz in der Karte standen
 * („Schach“, „Abwehr: dazwischenstellen, der Buchzug“). Die Sätze selbst stehen weiter
 * vollständig hinter dem Infoknopf der Karte (Werkzeugkarte.tsx, darstellung.ts).
 * Abhängigkeiten: analyse/k12-kandidaten.ts, analyse/k12-antwort.ts, analyse/texte.ts,
 * lucide-react, i18n.
 * Buchbezug: Kapitel 12, Schritt 2 („Jeder erfüllt eine konkrete Aufgabe: Schach,
 * Materialgewinn, Verteidigung einer Drohung …“) und Schritt 3 (die stärkste Antwort).
 */
import {
  BookOpen,
  CirclePlus,
  CornerDownRight,
  Crown,
  Feather,
  Scale,
  Shield,
  ShieldCheck,
  Swords,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { Antwort } from "../../../analyse/k12-antwort";
import { istRuhig, type Kandidat, type Kandidatenart } from "../../../analyse/k12-kandidaten";
import { aufzaehlung, figurenname, mitVorzeichen, zugtext } from "../../../analyse/texte";
import { t, type Textschluessel } from "../../../i18n/sprache";

const SYMBOLGROESSE = 18;
const KLEIN = 14;

/** Die Gruppe einer Art für Zeichen und Legende: die drei Abwehrarten teilen ein Zeichen. */
type Artgruppe = "schach" | "schlag" | "drohung" | "ruhig" | "mattabwehr" | "abwehr";

function gruppe(art: Kandidatenart): Artgruppe {
  if (art === "wegziehen" || art === "schlagen" || art === "dazwischenstellen") return "abwehr";
  return art;
}

const ZEICHEN: Readonly<Record<Artgruppe, LucideIcon>> = {
  schach: CirclePlus,
  schlag: Swords,
  drohung: Zap,
  ruhig: Feather,
  mattabwehr: ShieldCheck,
  abwehr: Shield,
};

/** Reihenfolge der Arten in der Legende (wie die Rechenreihenfolge des Buches). */
const REIHENFOLGE: readonly Artgruppe[] = [
  "schach",
  "schlag",
  "drohung",
  "abwehr",
  "mattabwehr",
  "ruhig",
];

/** Der bisherige Text der Art, beim Buchzug mit „der Buchzug“. */
function artname(k: Kandidat): string {
  const aufgabe = t(`kandidaten.art.${k.art}`);
  return k.buchzug && k.art !== "ruhig" ? t("kandidaten.artBuchzug", { art: aufgabe }) : aufgabe;
}

/** Das Zeichen der Art eines Kandidaten, beim Buchzug mit Buch. */
export function Artzeichen({ kandidat }: { kandidat: Kandidat }) {
  const Bild = ZEICHEN[gruppe(kandidat.art)];
  return (
    <span className="kandidat-art" role="img" aria-label={artname(kandidat)}>
      <Bild size={SYMBOLGROESSE} aria-hidden="true" />
      {kandidat.buchzug && <BookOpen size={KLEIN} aria-hidden="true" />}
    </span>
  );
}

/** Gabel und König im Freien als Anhang der Antwort. */
function anhang(a: Antwort): string {
  const gabel =
    a.gabel.length > 0
      ? t("wenigertext.werkzeug.antwort.gabel", { ziele: aufzaehlung(a.gabel.map(figurenname)) })
      : "";
  return gabel + (a.imFreien ? t("wenigertext.werkzeug.antwort.imFreien") : "");
}

/** Text der Antwort: „Kxh7 · Material −2“; ruhige Kandidaten ohne Material (das sagt die Engine). */
function antworttext(k: Kandidat, a: Antwort): string {
  if (a.mattGesetzt) return t("wenigertext.werkzeug.antwort.setztMatt");
  if (a.art === "matt") return t("wenigertext.werkzeug.antwort.matt", { antwort: zugtext(a.san) });
  const bilanz = mitVorzeichen(a.bilanz);
  if (a.art === "keine")
    return istRuhig(k)
      ? t("wenigertext.werkzeug.antwort.keine")
      : t("wenigertext.werkzeug.antwort.keineMaterial", { bilanz });
  const antwort = zugtext(a.san);
  const text = istRuhig(k)
    ? t("wenigertext.werkzeug.antwort.ruhig", {
        antwort,
        art: t(`kandidaten.antwortArt.${a.art}`),
      })
    : t("wenigertext.werkzeug.antwort.material", { antwort, bilanz });
  return text + anhang(a);
}

/** Die Zeile unter dem Kandidaten: Zeichen „stärkste Antwort“ und Text. */
export function Antwortzeile({ kandidat, antwort }: { kandidat: Kandidat; antwort: Antwort }) {
  return (
    <span className="kandidat-antwort">
      <span
        className="kandidat-antwortzeichen"
        role="img"
        aria-label={t("wenigertext.werkzeug.antwort.name")}
      >
        <CornerDownRight size={KLEIN} aria-hidden="true" />
      </span>
      {antworttext(kandidat, antwort)}
    </span>
  );
}

/** Ein Eintrag der Legende: Zeichen und Stichwort. */
function Eintrag({ Bild, text, klasse }: { Bild: LucideIcon; text: string; klasse: string }) {
  return (
    <li>
      <Bild size={KLEIN} aria-hidden="true" className={klasse} />
      <span>{text}</span>
    </li>
  );
}

/**
 * Kurze Legende: Krone, Waage, Antwort und die Arten, die vorkommen.
 * Beispiel: Abb. 12.1 → „Krone stärkster laut Engine, Waage beste Bilanz, ↳ stärkste Antwort ·
 * Material, ⊕ Schach, ⚡ Drohung“.
 */
export function Kandidatenlegende({ kandidaten }: { kandidaten: readonly Kandidat[] }) {
  const arten = REIHENFOLGE.filter((g) => kandidaten.some((k) => gruppe(k.art) === g));
  const wort = (schluessel: Textschluessel) => t(schluessel);
  return (
    <ul
      className="pfeillegende kandidatenlegende"
      aria-label={t("wenigertext.werkzeug.kandidatenzeichen")}
    >
      <Eintrag Bild={Crown} text={wort("wenigertext.werkzeug.krone")} klasse="kandidat-krone" />
      <Eintrag Bild={Scale} text={wort("wenigertext.werkzeug.waage")} klasse="kandidat-waage" />
      <Eintrag
        Bild={CornerDownRight}
        text={wort("wenigertext.werkzeug.antwort.legende")}
        klasse="kandidat-antwortzeichen"
      />
      {kandidaten.some((k) => k.buchzug) && (
        <Eintrag Bild={BookOpen} text={wort("wenigertext.werkzeug.buchzug")} klasse="" />
      )}
      {arten.map((g) => (
        <Eintrag
          key={g}
          Bild={ZEICHEN[g]}
          text={t(`wenigertext.werkzeug.art.${g}`)}
          klasse="kandidat-art"
        />
      ))}
    </ul>
  );
}
