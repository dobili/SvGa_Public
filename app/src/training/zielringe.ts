/**
 * Die Ringe der Orden als Ziele (Gamifizierung P13): je Ring der Stand, was genau fehlt und wohin
 * der Knopf führt. Reine Funktionen ohne Oberfläche.
 *
 * Rolle im Gesamtbild: Der Ziel-Gradient wirkt am stärksten kurz vor dem Ziel; die App zeigt,
 * welcher Orden in Reichweite ist und was fehlt (Entscheidung E11: nur echte Lücken). Die Ringe
 * tragen dieselben Kennungen wie in Profil › Dein Fortschritt (fortschrittsringe.ts, `testid`),
 * damit ein Ringziel genau dann erreicht ist, wenn dort der Ring voll ist. Gerechnet wird mit den
 * Funktionen aus ringrechnung.ts, nicht mit useFortschrittsringe, weil dieser Hook die Ordenprobe
 * der Aufgabenseite einrechnet: Eine Probe soll kein echtes Ziel erfüllen.
 * Neue Ringe (etwa eines späteren Trainers) kommen mit einer Zeile in ZIELRINGE dazu.
 * Abhängigkeiten: ui/komponenten/fortschritt/ringrechnung.ts, engine/gegner.ts,
 * speicher/besiegt.ts, daten/uebungsliste-daten.ts, zieltypen.ts.
 */
import { UEBUNGEN_JE_KAPITEL } from "../daten/uebungsliste-daten";
import { gegnerSortiert, gegnername } from "../engine/gegner";
import { WERTUNGSTEMPI, type Wertungstempo } from "../spiel/elomodell";
import type { Textschluessel } from "../i18n/sprache";
import type { Anteil } from "../speicher/fortschritt";
import {
  BOTBUENDEL,
  BUCHTEILE,
  botsDesBuendels,
  buendelanteil,
  ENGINEBUENDEL,
  teilanteil,
  uebungsanteil,
  type Botbuendel,
} from "../ui/komponenten/fortschritt/ringrechnung";
import type { Zielanzeige, Zielkontext, Zieltext } from "./zieltypen";

/** Stand eines Ringes als Ziel. */
export interface Ringstand {
  /** Kennung wie in fortschrittsringe.ts. Beispiel: „ich-bots-4-5-einmal“. */
  readonly ring: string;
  readonly anteil: Anteil;
  /** Schritte bis zum vollen Ring (für die Nähe der Vorschläge). */
  readonly fehlend: number;
  /** Name des Ordens. Beispiel: „Stufe 4–5: jeder Bot einmal“. */
  readonly orden: Zieltext;
  /** Text (mit dem Orden als „{orden}“) und Knopf; der erste fehlende Schritt ist sein Ziel. */
  readonly anzeige: Zielanzeige;
}

/** Eine Gruppe von Ringen; jede liefert ihre Stände aus dem Kontext. */
export interface Zielringart {
  readonly kennung: string;
  readonly staende: (kontext: Zielkontext) => readonly Ringstand[];
}

/** So viele Namen fehlender Bots nennt ein Text höchstens. */
export const HOECHSTENS_NAMEN = 3;

/** Reihenfolge der Bots in der Gegnerwahl (vom schwächsten zum stärksten). */
const REIHENFOLGE: ReadonlyMap<string, number> = new Map(
  gegnerSortiert().map((g, i) => [g.kennung, i]),
);

/** Bots vom schwächsten zum stärksten. */
function geordnet(bots: readonly string[]): string[] {
  const rang = (b: string) => REIHENFOLGE.get(b) ?? Number.MAX_SAFE_INTEGER;
  return [...bots].sort((a, b) => rang(a) - rang(b));
}

/** „Kiki, Ben, Mira“ (höchstens drei, dann „…“). */
export function namensliste(bots: readonly string[]): string {
  const namen = bots.slice(0, HOECHSTENS_NAMEN).map((b) => gegnername(b, null) ?? b);
  return bots.length > HOECHSTENS_NAMEN ? `${namen.join(", ")} …` : namen.join(", ");
}

/** Ring „jeder Bot des Bündels einmal“ (auch die Engine, Stufe 10). */
function einmalring(buendel: Botbuendel, kontext: Zielkontext): Ringstand {
  const besiegt = kontext.daten.spiel.besiegt;
  const bots = botsDesBuendels(buendel);
  const fehlen = geordnet(bots.filter((b) => !WERTUNGSTEMPI.some((z) => besiegt[z].includes(b))));
  const engine = buendel === ENGINEBUENDEL;
  const orden: Zieltext = {
    schluessel: engine ? "ziel.orden.engine" : "ziel.orden.einmal",
    werte: { stufen: buendel.replace("-", "–") },
  };
  return {
    ring: engine ? "ich-bots-10" : `ich-bots-${buendel}-einmal`,
    anteil: buendelanteil(besiegt, bots, "einmal"),
    fehlend: fehlen.length,
    orden,
    anzeige: {
      text: {
        schluessel: "ziel.ring.einmal",
        werte: { n: fehlen.length, namen: namensliste(fehlen) },
        unter: { orden },
      },
      knopf: "ziel.knopf.spielen",
      hin: fehlen[0] ? { art: "spielen", bot: fehlen[0], tempo: null } : null,
    },
  };
}

/** Die Zeitart mit den wenigsten fehlenden Siegen (aber mindestens einem) und diese Bots. */
function naechsteZeitart(
  kontext: Zielkontext,
  bots: readonly string[],
): { tempo: Wertungstempo; fehlen: string[] } | null {
  const je = WERTUNGSTEMPI.map((tempo) => ({
    tempo,
    fehlen: geordnet(bots.filter((b) => !kontext.daten.spiel.besiegt[tempo].includes(b))),
  })).filter((z) => z.fehlen.length > 0);
  return je.sort((a, b) => a.fehlen.length - b.fehlen.length)[0] ?? null;
}

/** Ring „jeder Bot des Bündels in allen Zeitarten“; fehlend zählt alle fehlenden Siege. */
function alleZeitartenring(buendel: Botbuendel, kontext: Zielkontext): Ringstand {
  const bots = botsDesBuendels(buendel);
  const besiegt = kontext.daten.spiel.besiegt;
  const fehlend = WERTUNGSTEMPI.reduce(
    (summe, z) => summe + bots.filter((b) => !besiegt[z].includes(b)).length,
    0,
  );
  const naechste = naechsteZeitart(kontext, bots);
  const orden: Zieltext = {
    schluessel: "ziel.orden.alle",
    werte: { stufen: buendel.replace("-", "–") },
  };
  return {
    ring: `ich-bots-${buendel}-alle`,
    anteil: buendelanteil(besiegt, bots, "alleZeitarten"),
    fehlend,
    orden,
    anzeige: {
      text: {
        schluessel: "ziel.ring.alle",
        werte: { n: naechste?.fehlen.length ?? 0, namen: namensliste(naechste?.fehlen ?? []) },
        namen: { zeitart: `ziel.zeitart.${naechste?.tempo ?? "rapid"}` },
        unter: { orden },
      },
      knopf: "ziel.knopf.spielen",
      hin: naechste
        ? { art: "spielen", bot: naechste.fehlen[0] ?? "", tempo: naechste.tempo }
        : null,
    },
  };
}

/** Alle Ringe der Bots, in der Reihenfolge des Profils. */
function botringe(kontext: Zielkontext): Ringstand[] {
  return BOTBUENDEL.flatMap(({ kennung }) =>
    kennung === ENGINEBUENDEL
      ? [einmalring(kennung, kontext)]
      : [einmalring(kennung, kontext), alleZeitartenring(kennung, kontext)],
  );
}

/** Erstes Kapitel einer Liste mit noch Fehlendem (Abbildung ungesehen oder Übung ungelöst). */
function ersteLuecke(kontext: Zielkontext, kapitel: readonly number[]): number | null {
  const f = kontext.daten.fortschritt;
  const offen = (n: number) =>
    (UEBUNGEN_JE_KAPITEL[n] ?? []).some((id) => f.uebungen[id]?.geloest !== true) ||
    (kontext.kapitel?.find((k) => k.kapitel === n)?.abbildungen ?? []).some(
      (id) => f.gesehen[id] === undefined,
    );
  return kapitel.find(offen) ?? null;
}

/** Die ungelösten Übungen der Kapitel. Beispiel: Kapitel 0 und 1, eine von 7 gelöst → 6. */
export function offeneUebungen(kontext: Zielkontext, kapitel: readonly number[]): string[] {
  const f = kontext.daten.fortschritt;
  return kapitel.flatMap((n) =>
    (UEBUNGEN_JE_KAPITEL[n] ?? []).filter((id) => f.uebungen[id]?.geloest !== true),
  );
}

/** Text je nachdem, ob Übungen, Abbildungen oder beides fehlen. */
function teiltext(uebungen: number, abbildungen: number): Textschluessel {
  if (abbildungen <= 0) return "ziel.ring.teilUebungen";
  return uebungen > 0 ? "ziel.ring.teil" : "ziel.ring.teilAbbildungen";
}

/** Name des Ordens eines Teils. Beispiel: „Teil Grundlagen“. */
export function teilorden(teil: string): Zieltext {
  return {
    schluessel: "ziel.orden.teil",
    werte: {},
    namen: { teil: `fortschritt.teil.${teil}` as Textschluessel },
  };
}

/** Ringe der fünf Teile des Buches; ohne geladenes Verzeichnis keine (unbekannt). */
function teilringe(kontext: Zielkontext): Ringstand[] {
  const verzeichnis = kontext.kapitel;
  if (!verzeichnis) return [];
  return BUCHTEILE.map(({ kennung, kapitel }) => {
    const anteil = teilanteil(kennung, verzeichnis, kontext.daten.fortschritt);
    const luecke = ersteLuecke(kontext, kapitel);
    const uebungen = offeneUebungen(kontext, kapitel).length;
    const abbildungen = anteil.gesamt - anteil.erreicht - uebungen;
    const orden = teilorden(kennung);
    return {
      ring: `ich-teil-${kennung}`,
      anteil,
      fehlend: anteil.gesamt - anteil.erreicht,
      orden,
      anzeige: {
        text: {
          schluessel: teiltext(uebungen, abbildungen),
          werte: { uebungen, abbildungen },
          unter: { orden },
        },
        knopf: "ziel.knopf.lesen",
        hin:
          luecke === null
            ? null
            : { art: "ansicht", ansicht: { bildschirm: "kapitel", nummer: luecke } },
      },
    };
  });
}

/** Ring aller Übungen des Buches. */
function uebungsring(kontext: Zielkontext): Ringstand[] {
  const anteil = uebungsanteil(kontext.daten.fortschritt);
  const offen = Object.keys(UEBUNGEN_JE_KAPITEL)
    .map(Number)
    .find((n) => offeneUebungen(kontext, [n]).length > 0);
  const orden: Zieltext = { schluessel: "ziel.orden.uebungen", werte: {} };
  return [
    {
      ring: "ich-uebungen",
      anteil,
      fehlend: anteil.gesamt - anteil.erreicht,
      orden,
      anzeige: {
        text: {
          schluessel: "ziel.ring.uebungen",
          werte: { n: anteil.gesamt - anteil.erreicht },
          unter: { orden },
        },
        knopf: "ziel.knopf.ueben",
        hin:
          offen === undefined
            ? null
            : { art: "ansicht", ansicht: { bildschirm: "kapitel", nummer: offen } },
      },
    },
  ];
}

/** Alle Gruppen von Ringen; ein späterer Trainer mit eigenem Orden trägt hier eine Zeile ein. */
export const ZIELRINGE: readonly Zielringart[] = [
  { kennung: "bots", staende: botringe },
  { kennung: "teile", staende: teilringe },
  { kennung: "uebungen", staende: uebungsring },
];

/**
 * Alle Ringstände. Beispiel: nichts besiegt → „ich-bots-1-3-einmal“ mit 0 von 24, fehlend 24.
 * Sonderfall: ohne Verzeichnis der Kapitel (nach einer Partie) fehlen die Teile des Buches.
 */
export function ringstaende(
  kontext: Zielkontext,
  arten: readonly Zielringart[] = ZIELRINGE,
): Ringstand[] {
  return arten.flatMap((a) => a.staende(kontext));
}
