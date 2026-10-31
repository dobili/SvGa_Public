/**
 * Darstellung der Momente: Titel, Text, Marke und Sprung je Momentart (Entwurf F2).
 *
 * Rolle im Gesamtbild: momente.ts rechnet, welche Züge Momente sind; diese Datei sagt, wie eine
 * Karte der Zeitleiste dazu aussieht (Momentkarte in Zeitleiste.tsx). Eine neue Momentart braucht
 * hier einen Eintrag in MOMENTDARSTELLUNG; TypeScript meldet ihn, wenn er fehlt.
 * Texte kurz und ohne Fachsprache (Wunsch des Autors, 31.10.2026: die alte Auswertung war zu
 * textlastig): Gewinnchance statt Bauerneinheiten (seit 0.2.85), Pfeil „72 % → 31 %“.
 * Abhängigkeiten: momente.ts, sprung.ts, gewinnchance.ts, schach/theorienamen.ts, i18n.
 */
import { sprache, t, tZahl } from "../../../i18n/sprache";
import { sanInSprache } from "../../../schach/notation";
import type { Theoriequellen } from "../../../schach/theorie";
import { theorienamen } from "../../../schach/theorienamen";
import { zugnummer, type Zugklasse, type Zugurteil } from "../../../spiel/auswertung";
import { stellungen } from "../../../spiel/partie";
import { uciZuSan } from "../../../spiel/zuege";
import type { Partieeintrag } from "../../../speicher/partien";
import { kurzergebnis } from "../partie/partietexte";
import { gewinnchanceVorNach } from "./gewinnchance";
import type { Moment, Momentart } from "./momente";
import { sprungNach, sprungZu, zugtext, type Sprung } from "./sprung";

/** Marke links an der Zeitleiste: eine Zugklasse oder ein eigenes Zeichen. */
export type Momentmarke = Zugklasse | "engine" | "ende";

/** Was eine Karte zeigt. */
export interface Momentbild {
  readonly marke: Momentmarke;
  readonly titel: string;
  readonly text: string;
  /** Leiser Zusatz unter dem Text (Hast du es gesehen?), sonst leer. */
  readonly zusatz: string;
  /** Besserer Zug als Text („18. Sxd4“), sonst leer. */
  readonly besser: string;
  /** Sprung aufs Brett oben; null: Karte ohne „Zur Stellung“. */
  readonly sprung: Sprung | null;
  /** Kleines Brett mit der Stellung des Sprungs? */
  readonly brett: boolean;
}

/** Was die Darstellung braucht. */
export interface Darstellungsgrund {
  readonly eintrag: Partieeintrag;
  readonly urteile: readonly Zugurteil[];
  readonly theorie: Theoriequellen | null;
}

/** Klassen einer Antwort, die einen Fehler der Engine sicher genutzt haben. */
const GENUTZT: ReadonlySet<Zugklasse> = new Set<Zugklasse>(["brillant", "stark", "bester"]);
/** Ohne Moment: alles leer. */
const LEER = { zusatz: "", besser: "", sprung: null, brett: false } as const;

/** Der Zug mit seinem Zeichen („2. g4??“). */
function titelVon(g: Darstellungsgrund, index: number): string {
  const zeichen = g.urteile.find((u) => u.index === index)?.zeichen ?? "";
  return zugtext(g.eintrag.partie, index, zeichen);
}

/** Der bessere Zug als Text, leer ohne. Beispiel: „18. Sxd4“. */
function besserVon(g: Darstellungsgrund, index: number): string {
  const p = g.eintrag.partie;
  const san = uciZuSan(stellungen(p)[index] ?? "", g.eintrag.beste[index] ?? "");
  return san ? `${zugnummer(p, index)} ${sanInSprache(san, sprache())}` : "";
}

/** Gewinnchance der ziehenden Seite vor und nach dem Zug. */
function chance(g: Darstellungsgrund, index: number) {
  const weiss = (stellungen(g.eintrag.partie)[index] ?? "").split(" ")[1] !== "b";
  return gewinnchanceVorNach(g.eintrag.werte, index, weiss);
}

/** Name der Eröffnung am Ende der Theorie, wenn die Quellen geladen sind. */
function eroeffnungsname(g: Darstellungsgrund, index: number): string | null {
  if (!g.theorie) return null;
  const p = g.eintrag.partie;
  const fens = stellungen(p).slice(0, index + 2);
  const sans = p.zuege.slice(0, index + 1).map((z) => z.san);
  return theorienamen(g.theorie, fens, sans).namen[0]?.name ?? null;
}

/** Hat der Leser den Fehler der Engine genutzt? Nach der Klasse seiner Antwort. */
function reaktion(g: Darstellungsgrund, index: number): string {
  const antwort = g.urteile.find((u) => u.index === index + 1);
  if (!antwort || g.eintrag.partie.zuege[index + 1]?.von !== "leser") return "";
  if (GENUTZT.has(antwort.klasse)) return t("auswertungneu.engine.genutzt");
  if (antwort.klasse === "verpasst") return t("auswertungneu.engine.verpasst");
  return t("auswertungneu.engine.frage");
}

type Darstellung = (g: Darstellungsgrund, m: Moment) => Momentbild;

/** Je Momentart die Karte. Neue Art: Eintrag hier und in MOMENTQUELLEN (momente.ts). */
export const MOMENTDARSTELLUNG: Readonly<Record<Momentart, Darstellung>> = {
  theorie: (g, m) => ({
    ...LEER,
    marke: "buch",
    titel: eroeffnungsname(g, m.index) ?? t("auswertungneu.theorie.titel"),
    text: tZahl("auswertungneu.theorie.text", m.zahl, {
      anzahl: m.zahl,
      zug: zugtext(g.eintrag.partie, m.index),
    }),
  }),
  abweichung: (g, m) => ({
    marke: m.klasse ?? "fehler",
    titel: titelVon(g, m.index),
    text: t("auswertungneu.abweichung", { ...chance(g, m.index) }),
    zusatz: "",
    besser: besserVon(g, m.index),
    sprung: sprungZu(g.eintrag, m.index),
    brett: true,
  }),
  fehler: (g, m) => ({
    marke: m.klasse ?? "fehler",
    titel: titelVon(g, m.index),
    text: t("auswertungneu.fehler", {
      klasse: t(`zugklasse.kurz.${m.klasse ?? "fehler"}`),
      ...chance(g, m.index),
    }),
    zusatz: "",
    besser: besserVon(g, m.index),
    sprung: sprungZu(g.eintrag, m.index),
    brett: true,
  }),
  engine: (g, m) => {
    const p = g.eintrag.partie;
    const fehler = p.zuege[m.index]?.fehler;
    return {
      marke: "engine",
      titel: zugtext(p, m.index),
      text: t("auswertungneu.engine.text", {
        name: p.einstellung.botName ?? t("spielstaerke.gegnerName"),
        fehler: fehler ? t(`fehlerart.${fehler}`) : "",
      }),
      zusatz: reaktion(g, m.index),
      besser: "",
      sprung: sprungNach(g.eintrag, m.index),
      brett: true,
    };
  },
  ende: (g, m) => ({
    ...LEER,
    marke: "ende",
    titel: titelVon(g, m.index),
    text: kurzergebnis(g.eintrag.partie),
    sprung: { stelle: m.index + 1, marken: [] },
  }),
};

/** Das Bild eines Moments. */
export function momentbild(g: Darstellungsgrund, m: Moment): Momentbild {
  return MOMENTDARSTELLUNG[m.art](g, m);
}
