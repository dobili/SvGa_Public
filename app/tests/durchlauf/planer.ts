/**
 * Planer des Spieler-Durchlaufs: Wohin geht der Spieler als Nächstes? Zuerst dorthin, wohin der
 * Zielhinweis des Spiels zeigt (laufende Quests, oberwelt/zielsuche.ts), dann zum Beginn der
 * nächsten Hauptquest, sonst sieht er sich um: alles ansprechen und ansehen, was in der Nähe
 * steht, und unbesuchte Karten betreten, im Gebiet der Geschichte zuerst.
 *
 * Warum: Ein Mensch folgt dem Zielhinweis und dem Tagebuch und probiert sonst aus. Der Planer
 * merkt sich, was er im selben Stand der Geschichte schon versucht hat, damit er nicht ewig
 * dieselbe Figur anspricht; hat nichts mehr Wirkung, meldet er „kein Ziel“ (dort hängt ein
 * Spieler mit diesen Eingaben fest).
 * Abhängigkeiten: welt.ts, lage.ts (Signatur), oberwelt/zielsuche.ts, gesamtsimulation-regeln.cjs
 * (Reihenfolge der Gebiete).
 * Beispiel: Quest „Mama ist in der Küche“, Held im Zimmer → { karte: "mapleFalls.wohnzimmer",
 * name: "mutter", grund: "Zielhinweis" }.
 */
import { createRequire } from "node:module";
import {
  kartenbildAus,
  zielangabe,
  zielangaben,
  zielkarte,
  type Kartenbild,
  type Zielangabe,
} from "../../src/abenteuer/oberwelt/zielsuche";
import type { Abenteuerstand } from "../../src/abenteuer/schnittstelle/spielstand";
import { einstiegeZu } from "./einstiege";
import { signatur } from "./lage";
import {
  ausgaengeVon,
  findeKarte,
  kartenweg,
  kartenwissen,
  lies,
  regelFuer,
  variablenVon,
  type Ding,
  type Spieldaten,
} from "./welt";

/** Gebiete in der Reihenfolge der Geschichte (wie die Gesamtsimulation). */
const FOLGE = (
  createRequire(import.meta.url)("../../../pipeline/abenteuer/gesamtsimulation-regeln.cjs") as {
    FOLGE: readonly string[];
  }
).FOLGE;

/** Ein Ziel: Karte und Ding darauf (ohne Ding: nur die Karte betreten). */
export interface Ziel {
  readonly karte: string;
  readonly name: string | null;
  readonly grund: string;
  /** Schlüssel, unter dem der Versuch gezählt wird. */
  readonly schluessel: string;
}

/**
 * Dinge, die der Spieler nicht anfasst („karte.name“, durch Komma getrennt), etwa
 * crossroads.aussen.viehgatter, damit der Lauf nicht die Abkürzung über die Alte Minenstraße nimmt,
 * sondern durch Pinewood Camp geht (Nachtauftrag 19.11.2026).
 */
const OHNE = new Set(
  (process.env.DURCHLAUF_OHNE ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
);

/** So oft folgt der Spieler demselben Hinweis, solange kein Questschritt weitergeht. */
const VERSUCHE_HINWEIS = 5;
/** So oft fasst der Spieler beim Umsehen dasselbe Ding im selben Stand der Hauptgeschichte an. */
const VERSUCHE_UMSEHEN = 2;
/** Bis hierhin steigt die Zahl, wenn sonst nichts mehr geht. */
const VERSUCHE_HOECHSTENS = 4;

/** So oft durch denselben Ausgang im selben Stand gilt als im Kreis laufen. */
const KREIS_AB = 8;
/**
 * So oft durch denselben Ausgang, ohne dass ein Questschritt weitergeht, gilt auch dann als Kreis,
 * wenn sich der übrige Stand ändert. Höher als KREIS_AB, damit Umsehen im Ort (rein, raus) nicht
 * schon eine gewöhnliche Tür sperrt.
 */
const KREIS_GROB_AB = 20;

/** Der Stand der Hauptgeschichte: Schritte der Hauptquests, Akt und Szene. */
function hauptsignatur(daten: Spieldaten, stand: Abenteuerstand): string {
  const haupt = new Set(daten.quests.filter((q) => q.haupt).map((q) => q.kennung));
  return JSON.stringify([
    stand.quests.filter((q) => haupt.has(q.kennung)).map((q) => [q.kennung, q.schritt, q.erledigt]),
    stand.handlung.akt,
    stand.handlung.szene,
  ]);
}

/** Der Stand aller Quests (Schritte, erledigt): Hinweise zählen je solchem Stand. */
function questsignatur(stand: Abenteuerstand): string {
  return JSON.stringify(stand.quests.map((q) => [q.kennung, q.schritt, q.erledigt]));
}

/** Merkt Versuche und gesperrte Ausgänge und wählt das nächste Ziel. */
export class Planer {
  private readonly bilder: Kartenbild[];
  private readonly versuche = new Map<string, number>();
  private readonly gesperrt = new Map<string, Set<string>>();
  /** Im Kreis gelaufene Ausgänge je Queststand (merkeDurchgang, grob). */
  private readonly kreise = new Map<string, Set<string>>();
  private grenze = VERSUCHE_UMSEHEN;
  private letzteHaupt = "";
  private dingeSig = "";
  private readonly dingeMerker = new Map<string, Ding[]>();

  constructor(private readonly daten: Spieldaten) {
    this.bilder = daten.orte.flatMap((ort) =>
      ort.karten.map((k) =>
        kartenbildAus(
          k.kennung,
          [k.datei, ...Object.values(k.zustaende ?? {})].map((d) => lies<object>(d)),
          (name) => {
            const r = regelFuer(ort, k.kennung, name);
            return r?.art === "uebergang" && r.ziel ? r.ziel.karte : null;
          },
        ),
      ),
    );
  }

  /** Zählt einen Versuch für ein Ziel. */
  merke(ziel: Ziel): void {
    this.versuche.set(ziel.schluessel, (this.versuche.get(ziel.schluessel) ?? 0) + 1);
  }

  /** Ein Ausgang ging in diesem Stand nicht auf; nach zwei Malen gilt er als gesperrt. */
  merkeGesperrt(stand: Abenteuerstand, karte: string, name: string): void {
    const sig = signatur(stand);
    const schluessel = `zu|${sig}|${karte}.${name}`;
    const zahl = (this.versuche.get(schluessel) ?? 0) + 1;
    this.versuche.set(schluessel, zahl);
    if (zahl < 2) return;
    const menge = this.gesperrt.get(sig) ?? new Set<string>();
    menge.add(`${karte}.${name}`);
    this.gesperrt.set(sig, menge);
  }

  /**
   * Der Spieler ist durch einen Ausgang gegangen. Geht er im selben Stand zu oft durch denselben,
   * läuft er im Kreis; dann gilt der Ausgang als gesperrt, und der Planer sucht etwas anderes.
   */
  merkeDurchgang(stand: Abenteuerstand, karte: string, name: string): void {
    const sig = signatur(stand);
    const schluessel = `durch|${sig}|${karte}.${name}`;
    const zahl = (this.versuche.get(schluessel) ?? 0) + 1;
    this.versuche.set(schluessel, zahl);
    if (zahl >= KREIS_AB) {
      this.gesperrt.set(sig, (this.gesperrt.get(sig) ?? new Set<string>()).add(`${karte}.${name}`));
    }
    // Grob, je Queststand: Übergangsdialoge und Zielpfeile ändern den vollen Stand bei jedem
    // Durchgang; so pendelte der eilige Spieler 162-mal zwischen Felsbogen und Desert Springs.
    const grob = questsignatur(stand);
    const grobSchluessel = `kreis|${grob}|${karte}.${name}`;
    const grobZahl = (this.versuche.get(grobSchluessel) ?? 0) + 1;
    this.versuche.set(grobSchluessel, grobZahl);
    if (grobZahl < KREIS_GROB_AB) return;
    this.kreise.set(grob, (this.kreise.get(grob) ?? new Set<string>()).add(`${karte}.${name}`));
  }

  /** Die in diesem Stand gesperrten Ausgänge (auch die im Queststand als Kreis erkannten). */
  gesperrteAusgaenge(stand: Abenteuerstand): ReadonlySet<string> {
    const fein = this.gesperrt.get(signatur(stand)) ?? new Set<string>();
    const grob = this.kreise.get(questsignatur(stand));
    return grob ? new Set([...fein, ...grob]) : fein;
  }

  /** Der Weg über Karten zum Ziel (Liste der Ausgänge) oder null. */
  weg(stand: Abenteuerstand, ziel: string) {
    return kartenweg(
      this.daten,
      stand.position.karte,
      ziel,
      variablenVon(stand),
      this.gesperrteAusgaenge(stand),
    );
  }

  private frei(schluessel: string, hoechstens: number): boolean {
    return (this.versuche.get(schluessel) ?? 0) < hoechstens;
  }

  /** Ziele aus dem Zielhinweis des Spiels und dem Beginn der nächsten Hauptquest. */
  private hinweise(stand: Abenteuerstand, art: "haupt" | "rest"): Ziel[] {
    // Versuche zählen je Queststand und je Ort, an dem der Held steht: Ein Fehlversuch in
    // Riverton soll den Weg von Ironwood aus nicht verbrauchen.
    const hier = findeKarte(this.daten, stand.position.karte)?.ort.kennung ?? "";
    const sig = `${questsignatur(stand)}|${hier}`;
    const daten = this.daten as unknown as Parameters<typeof zielangaben>[1];
    type Schritt = Parameters<typeof zielangabe>[0];
    // Laufende Quests wie im Spiel: Hauptquests zuerst, die zuletzt angenommene vorn.
    const laufend = stand.quests
      .filter((q) => !q.erledigt)
      .map((q) => ({ q, d: this.daten.quests.find((x) => x.kennung === q.kennung) }))
      .sort((x, y) => y.q.angenommen.localeCompare(x.q.angenommen));
    // Beim Rest zuerst der Beginn der nächsten Hauptquest (die Geschichte geht weiter), dann die
    // Nebenquests: Sonst lief der Spieler nach jedem Aktende für Nebenquests weit zurück.
    // Anfänge, die in der Geschichte erst später dran sind (der Epilog in Maple Falls), kommen
    // nach den laufenden Nebenquests: Sonst lief der Spieler zum Epilog, während die Hauptquest
    // auf eine Nebenquest wartete (Mira auf den Brief von Mr. Okoro, 20.11.2026).
    const anfaenge = art === "rest" ? this.naechsteHauptquests(stand) : [];
    const angaben: { a: Zielangabe; grund: string }[] = anfaenge.filter((h) => !h.spaeter);
    for (const { q, d } of laufend) {
      const schritt = d?.schritte[q.schritt] as Schritt | undefined;
      const a =
        schritt && (d?.haupt === true) === (art === "haupt")
          ? zielangabe(schritt, daten, stand.dialogvariablen)
          : null;
      if (a) angaben.push({ a, grund: art === "haupt" ? "Zielhinweis" : "Zielhinweis Nebenquest" });
    }
    angaben.push(...anfaenge.filter((h) => h.spaeter));
    if (art === "haupt" && laufend.length === 0) {
      // Lücke zwischen zwei Quests: das Ziel aus „Was jetzt?“ (wie im Spiel).
      angaben.push(...zielangaben(stand, daten).map((a) => ({ a, grund: "Zielhinweis" })));
    }
    return angaben.flatMap(({ a, grund }) => {
      const karte = zielkarte(a, this.bilder);
      if (!karte) return [];
      const ziel = (name: string | null, k = karte): Ziel => ({
        karte: k,
        name,
        grund,
        schluessel: `hin|${sig}|${k}|${name ?? ""}`,
      });
      if (a.objekt) return [ziel(a.objekt)];
      // Nur die Karte bekannt: Wer führt dort zum Knoten des Questschritts (einstiege.ts)?
      return [...this.einstiegsziele(stand, karte).map((e) => ziel(e.name, e.karte)), ziel(null)];
    });
  }

  /** Figuren und Auslöser, die zu den Knoten der laufenden Questschritte auf dieser Karte führen. */
  private einstiegsziele(stand: Abenteuerstand, karte: string): { karte: string; name: string }[] {
    const ziele: { karte: string; name: string }[] = [];
    const offene = [
      ...stand.quests
        .filter((q) => !q.erledigt)
        .map((q) => this.daten.quests.find((x) => x.kennung === q.kennung)?.schritte[q.schritt]),
      ...this.daten.quests
        .filter((q) => q.haupt && !stand.quests.some((s) => s.kennung === q.kennung))
        .map((q) => ({ ereignis: q.start })),
    ];
    for (const schritt of offene) {
      const knoten = schritt?.ereignis.art === "dialog" ? schritt.ereignis.knoten : undefined;
      if (!knoten) continue;
      for (const e of einstiegeZu(this.daten, knoten)) {
        // Nur Einstiege auf dieser Karte: Der Knoten des Schritts gehört zu ihr.
        const wahl = this.bilder.find((b) => b.kennung === karte && b.objekte.has(e.name));
        if (wahl && !ziele.some((z) => z.karte === wahl.kennung && z.name === e.name)) {
          ziele.push({ karte: wahl.kennung, name: e.name });
        }
      }
    }
    return ziele;
  }

  /**
   * Der Beginn der nächsten Hauptquest: die noch nicht begonnene, deren Beginn in der Reihenfolge
   * der Gebiete am weitesten vorn liegt, aber nicht hinter dem Beginn der zuletzt begonnenen
   * (der Epilog beginnt wieder in Maple Falls und kommt deshalb zuletzt).
   */
  private naechsteHauptquests(
    stand: Abenteuerstand,
  ): { a: Zielangabe; grund: string; spaeter: boolean }[] {
    const daten = this.daten as unknown as Parameters<typeof zielangaben>[1];
    const rang = (q: Spieldaten["quests"][number]) => {
      const schritt = { text: "", ereignis: q.start } as Parameters<typeof zielangabe>[0];
      const a = zielangabe(schritt, daten);
      const karte = a ? zielkarte(a, this.bilder) : null;
      const ort = karte ? findeKarte(this.daten, karte)?.ort.kennung : undefined;
      // Beginnt die Quest auf einem Weg (Raststätte, Diner), zählt das Gebiet der Quest.
      const i = Math.max(FOLGE.indexOf(ort ?? q.ort), FOLGE.indexOf(q.ort));
      return { a, i: i < 0 ? FOLGE.length : i };
    };
    const begonnen = new Set(stand.quests.map((q) => q.kennung));
    const haupt = this.daten.quests.filter((q) => q.haupt).map((q, nr) => ({ q, nr, ...rang(q) }));
    const offen = haupt.filter((h) => !begonnen.has(h.q.kennung) && h.a);
    // Eine Quest, die hinter dem am weitesten gekommenen Beginn anfängt, kommt zuletzt (der
    // Epilog in Maple Falls nach der Meisterschaft); alle anderen in der Reihenfolge der Gebiete.
    const weit = Math.max(-1, ...haupt.filter((h) => begonnen.has(h.q.kennung)).map((h) => h.i));
    const wartet = (h: (typeof offen)[number]) => h.i < weit;
    // Alle offenen Anfänge, die wartenden zuletzt: Ist der erste gerade nicht erreichbar (Juno
    // schickt erst nach Hause, bevor es nach Ironwood geht), kommt der nächste an die Reihe.
    const ordnung = (x: (typeof offen)[number], y: (typeof offen)[number]) =>
      Number(wartet(x)) - Number(wartet(y)) || x.i - y.i || x.nr - y.nr;
    return [...offen]
      .sort(ordnung)
      .flatMap((h) =>
        h.a ? [{ a: h.a, grund: `Beginn von ${h.q.kennung}`, spaeter: wartet(h) }] : [],
      );
  }

  /** Dinge einer Karte, die der Spieler anfassen kann (keine Übergänge, kein Start). */
  private dinge(karte: string, stand: Abenteuerstand): Ding[] {
    // Gemerkt je Stand: Das Umsehen fragt viele Karten ab, und jede kostet eine Kollisionsrechnung.
    const sig = signatur(stand);
    if (sig !== this.dingeSig) {
      this.dingeSig = sig;
      this.dingeMerker.clear();
    }
    let liste = this.dingeMerker.get(karte);
    if (!liste) {
      liste = kartenwissen(this.daten, karte, stand).dinge.filter(
        (d) =>
          !OHNE.has(`${karte}.${d.name}`) &&
          (d.figur !== null ||
            (d.regel !== null && ["gegenstand", "dialog"].includes(d.regel.art))),
      );
      this.dingeMerker.set(karte, liste);
    }
    return liste;
  }

  /** Karten in der Reihenfolge der Entfernung (über offene Ausgänge) im erlaubten Gebiet. */
  private kartenInDerNaehe(stand: Abenteuerstand, weit: boolean): string[] {
    const besucht = stand.besuchteOrte.map((o) => FOLGE.indexOf(o)).filter((i) => i >= 0);
    const vorn = Math.max(0, ...besucht);
    const erlaubt = (karte: string) => {
      const i = FOLGE.indexOf(findeKarte(this.daten, karte)?.ort.kennung ?? "");
      return i < 0 || (i <= vorn + 1 && (weit || i >= vorn - 1));
    };
    const zu = this.gesperrteAusgaenge(stand);
    const reihe = [stand.position.karte];
    for (let i = 0; i < reihe.length; i++) {
      for (const a of ausgaengeVon(this.daten, reihe[i] as string)) {
        if (reihe.includes(a.nach) || zu.has(`${a.von}.${a.name}`) || !erlaubt(a.nach)) continue;
        reihe.push(a.nach);
      }
    }
    return reihe;
  }

  /** Das nächste Ziel beim Umsehen: ein Ding auf der nächsten Karte, auf der noch etwas offen ist. */
  private umsehen(stand: Abenteuerstand, weite: "ort" | "nah" | "weit"): Ziel | null {
    const haupt = hauptsignatur(this.daten, stand);
    const hier = findeKarte(this.daten, stand.position.karte)?.ort.kennung;
    const imOrt = (karte: string) => findeKarte(this.daten, karte)?.ort.kennung === hier;
    const karten = this.kartenInDerNaehe(stand, weite === "weit");
    for (const karte of weite === "ort" ? karten.filter(imOrt) : karten) {
      const betreten = `um|${haupt}|${karte}|`;
      if (karte !== stand.position.karte && this.frei(betreten, 1)) {
        return { karte, name: null, grund: "Umsehen: Karte betreten", schluessel: betreten };
      }
      for (const d of this.dinge(karte, stand)) {
        const schluessel = `um|${haupt}|${karte}|${d.name}`;
        if (this.frei(schluessel, this.grenze)) {
          return { karte, name: d.name, grund: "Umsehen", schluessel };
        }
      }
    }
    return null;
  }

  /**
   * Das nächste Ziel für diesen Spielstand, oder null, wenn nichts mehr Wirkung verspricht.
   * Reihenfolge: Zielhinweis, Beginn der nächsten Hauptquest, Umsehen in der Nähe, Umsehen im
   * ganzen bekannten Land, dann dasselbe mit mehr Versuchen je Ding.
   */
  naechstes(stand: Abenteuerstand): Ziel | null {
    const haupt = hauptsignatur(this.daten, stand);
    if (haupt !== this.letzteHaupt) {
      this.letzteHaupt = haupt;
      this.grenze = VERSUCHE_UMSEHEN;
    }
    // Die Karte, auf der der Held steht, gilt als betreten.
    this.versuche.set(`um|${haupt}|${stand.position.karte}|`, 1);
    const erreichbar = (z: Ziel) =>
      this.frei(z.schluessel, VERSUCHE_HINWEIS) &&
      (z.karte === stand.position.karte || this.weg(stand, z.karte) !== null);
    const hauptziel = this.hinweise(stand, "haupt").find(erreichbar);
    if (hauptziel) return hauptziel;
    // Der Hinweis der Hauptquest führt gerade nicht weiter (Tür zu, schon alles versucht): erst
    // im Ort umsehen, wie ein Mensch es täte, bevor es zu Nebenquests und fernen Anfängen geht.
    const imOrt = this.umsehen(stand, "ort");
    if (imOrt) return imOrt;
    const nebenziel = this.hinweise(stand, "rest").find(erreichbar);
    if (nebenziel) return nebenziel;
    for (; this.grenze <= VERSUCHE_HOECHSTENS; this.grenze++) {
      const ziel = this.umsehen(stand, "nah") ?? this.umsehen(stand, "weit");
      if (ziel) return ziel;
    }
    return null;
  }
}
