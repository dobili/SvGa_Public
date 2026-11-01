/**
 * Eine ganze Eröffnung als Entwurf einer Variante: Daten laden (Kapitel 2 und 3, Eröffnungen nach
 * Spielstärke, verlängerte Fortsetzungen) und aus der Wahl des Lesers den Baum bauen.
 *
 * Rolle im Gesamtbild: Variationsbrowser, Stufe 4 (Wunsch des Autors, 1.11.2026). Die Unterseite
 * „Eröffnung“ im Blatt „Neue Variante“ (Eroeffnungswahl.tsx) zeigt die Liste und die Größe vorab,
 * der Bildschirm „Variante“ baut denselben Entwurf aus dem Wert der Ansicht (variantenwert.ts),
 * damit er das Neuladen übersteht. Die Rechnung selbst ist rein (training/eroeffnungsvariante.ts,
 * training/praxisvariante.ts, schach/baumvereinigung.ts); hier kommen Texte und Titel dazu.
 * Abhängigkeiten: daten/laden.ts, training (Eröffnung, Praxis, Quellen), schach/baumvereinigung,
 * eroeffnungsdaten.ts, i18n.
 */
import {
  ladeEroeffnungsbaender,
  ladeKapitel,
  ladePraxisfortsetzungen,
  type Kapitel,
} from "../../../daten/laden";
import { sprache, t } from "../../../i18n/sprache";
import { begrenzt, type Begrenzung } from "../../../schach/baumvereinigung";
import type { Bandfamilie, Eroeffnungsbaender } from "../../../spiel/eroeffnungsbaender";
import { GRUNDSTELLUNG } from "../../../spiel/stellungsbau";
import {
  bucheroeffnungen,
  buchbaum,
  lichessfolgen,
  type Bucheroeffnung,
} from "../../../training/eroeffnungsvariante";
import type { Praxisfortsetzungen } from "../../../training/praxisfortsetzung";
import { buchUndPraxis, praxisbaum, praxisfolgen } from "../../../training/praxisvariante";
import type { Variation, Variationsknoten } from "../../../training/variationen";
import { entwurf } from "../../../training/variationsquellen";
import { kanonischeLinie } from "../../../training/uebungsaufgabe";
import { steckbriefkerne } from "./eroeffnungsdaten";

/** Vorsilbe des Schlüssels einer Eröffnung, die nur die Praxis kennt („lichess:Vienna Game“). */
export const LICHESS_VORSILBE = "lichess:";

/** Kapitel des Buches mit Eröffnungen und Gambits. */
const KAPITEL_EROEFFNUNGEN = 2;
const KAPITEL_GAMBITS = 3;

/** Alles, was die Eröffnungen brauchen; einmal geladen. */
export interface Eroeffnungsdaten {
  readonly kapitel: readonly Kapitel[];
  readonly buch: readonly Bucheroeffnung[];
  readonly baender: Eroeffnungsbaender;
  readonly fortsetzungen: Praxisfortsetzungen;
}

/** Die Wahl des Lesers: welche Eröffnung, aus Buch und/oder Praxis, Band der Praxis (Index). */
export interface Eroeffnungswahl {
  /** Kennung des Beispiels („k02-a1“) oder „lichess:<Familie>“. */
  readonly schluessel: string;
  readonly buch: boolean;
  readonly praxis: boolean;
  readonly band: number;
}

/** Lädt Kapitel 2 und 3 sowie die Praxisdaten und bestimmt die Eröffnungen des Buches. */
export async function ladeEroeffnungsdaten(): Promise<Eroeffnungsdaten> {
  const [k2, k3, baender, fortsetzungen] = await Promise.all([
    ladeKapitel(KAPITEL_EROEFFNUNGEN),
    ladeKapitel(KAPITEL_GAMBITS),
    ladeEroeffnungsbaender(),
    ladePraxisfortsetzungen(),
  ]);
  const kerne = steckbriefkerne([k2, k3]);
  const buch = bucheroeffnungen(k2, k3, (id) => kerne.get(id) ?? null, lichessfolgen(baender));
  return { kapitel: [k2, k3], buch, baender, fortsetzungen };
}

/** Die Eröffnungen, die nur die Praxis kennt (Lichess-Familien ohne Abschnitt im Buch). */
export function nurPraxis(daten: Eroeffnungsdaten): readonly Bandfamilie[] {
  const deutsch = sprache() === "de";
  return daten.baender.familien
    .filter((f) => f.buch === null)
    .sort((a, b) => (deutsch ? a.nameDe : a.name).localeCompare(deutsch ? b.nameDe : b.name));
}

/** Der Name einer Familie in der Sprache des Lesers. */
export function familienname(familie: Bandfamilie): string {
  return sprache() === "de" ? familie.nameDe : familie.name;
}

/** Der fertige Baum mit Kern, Titel, Quelle und Kürzung. */
export interface Eroeffnungsbaum {
  readonly titel: string;
  readonly kern: readonly string[];
  readonly abbildung: string | null;
  readonly begrenzung: Begrenzung;
  /** Züge aus dem Buch und aus der Praxis vor dem Zusammenlegen (für die Vorschau). */
  readonly buchzuege: number;
  readonly praxiszuege: number;
}

/** Zählt Knoten mit einer bestimmten Herkunft. */
function zahlMit(zuege: readonly Variationsknoten[], herkunft: string): number {
  return zuege.reduce(
    (s, k) => s + (k.herkunft === herkunft ? 1 : 0) + zahlMit(k.weiter, herkunft),
    0,
  );
}

/**
 * Baut den Baum zur Wahl; null bei unbekanntem Schlüssel oder wenn weder Buch noch Praxis gewählt
 * ist. Beispiel: { schluessel: „k02-a1“, buch, praxis, band 4 } → Spanisch aus Buch und Lichess.
 */
export function eroeffnungsbaum(
  daten: Eroeffnungsdaten,
  wahl: Eroeffnungswahl,
): Eroeffnungsbaum | null {
  const band = { daten: daten.fortsetzungen, band: wahl.band };
  const marke = t("varianten.eroeffnung.praxismarke");
  if (wahl.schluessel.startsWith(LICHESS_VORSILBE)) {
    const name = wahl.schluessel.slice(LICHESS_VORSILBE.length);
    const familie = daten.baender.familien.find((f) => f.name === name);
    const kern = familie ? kanonischeLinie(GRUNDSTELLUNG, familie.folge.split(" ")) : null;
    if (!familie || !kern) return null;
    const praxis = praxisbaum(kern, praxisfolgen(daten.baender, familie), band);
    const begrenzung = begrenzt(praxis);
    return {
      titel: familienname(familie),
      kern,
      abbildung: null,
      begrenzung,
      buchzuege: 0,
      praxiszuege: zahlMit(praxis, "partie"),
    };
  }
  const eroeffnung = daten.buch.find((e) => e.id === wahl.schluessel);
  if (!eroeffnung || (!wahl.buch && !wahl.praxis)) return null;
  const buch = wahl.buch ? buchbaum(eroeffnung, daten.kapitel) : [];
  const praxis = wahl.praxis ? praxisbaum(eroeffnung.kern, praxisfolgen(daten.baender), band) : [];
  const zusammen = buchUndPraxis(buch, praxis, marke);
  const begrenzung = begrenzt(zusammen);
  return {
    titel: eroeffnung.titel,
    kern: eroeffnung.kern,
    abbildung: wahl.buch ? eroeffnung.abbildung : null,
    begrenzung,
    buchzuege: zahlMit(zusammen, "buch"),
    praxiszuege: zahlMit(zusammen, "partie"),
  };
}

/** Der Kommentar zur Variante: Herkunft, Band, Kürzung (kurz, in der Sprache des Lesers). */
function kommentarZu(
  daten: Eroeffnungsdaten,
  wahl: Eroeffnungswahl,
  baum: Eroeffnungsbaum,
): string {
  const praxis = wahl.praxis || wahl.schluessel.startsWith(LICHESS_VORSILBE);
  const band = daten.baender.baender[wahl.band] ?? 0;
  const zeilen = [
    baum.buchzuege > 0 ? t("varianten.eroeffnung.kommentarBuch") : "",
    praxis ? t("varianten.eroeffnung.kommentarPraxis", { band }) : "",
    baum.begrenzung.gekuerzt
      ? t("varianten.eroeffnung.gekuerzt", { vorher: baum.begrenzung.vorher })
      : "",
  ];
  return zeilen.filter((z) => z !== "").join("\n");
}

/**
 * Der Entwurf der Variante zur Wahl: Baum ab der Grundstellung, geöffnet am Kern.
 * Quelle ist die erste Abbildung der Eröffnung (Hinweis „1 eigene Variante“ dort), ohne Buch die
 * Grundstellung. Sonderfall: unbekannte Eröffnung → null.
 */
export function eroeffnungsentwurf(
  daten: Eroeffnungsdaten,
  wahl: Eroeffnungswahl,
  jetzt: Date,
): Variation | null {
  const baum = eroeffnungsbaum(daten, wahl);
  if (!baum) return null;
  const quelle = baum.abbildung
    ? ({ art: "abbildung", nummer: baum.abbildung } as const)
    : ({ art: "grund" } as const);
  return entwurf(
    {
      titel: baum.titel,
      quelle,
      startFen: GRUNDSTELLUNG,
      zuege: baum.begrenzung.zuege,
      startpfad: baum.kern,
      kommentar: kommentarZu(daten, wahl, baum),
    },
    jetzt,
  );
}
