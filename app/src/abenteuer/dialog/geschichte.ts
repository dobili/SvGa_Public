/**
 * Eine Ink-Geschichte Schritt für Schritt abspielen: Zeilen mit Tags, Auswahl, externe Funktionen,
 * Variablen aus dem Spielstand (inhalte/abenteuer/README.md, Abschnitt Ink-Dialoge).
 *
 * Rolle im Gesamtbild: Die React-Hülle (dialog/Dialog.tsx) zeigt je Schritt eine Zeile; diese
 * Datei kapselt inkjs, damit die Oberfläche nichts von Ink weiß und die Logik ohne Oberfläche
 * prüfbar ist. Die externen Funktionen sind fest benannt (README); was sie tun, entscheidet der
 * Aufrufer über `Wirkungen`.
 * Abhängigkeiten: inkjs (MIT, docs/spiel/LIZENZEN.md).
 */
import { Story } from "inkjs";

/** Eine Zeile der Geschichte mit ihren Tags („sprecher:ambrose“ → { sprecher: "ambrose" }). */
export interface Dialogzeile {
  readonly text: string;
  readonly tags: Readonly<Record<string, string>>;
}

/** Was die Geschichte von außen auslösen darf (die externen Funktionen des Ink-Textes). */
export interface Wirkungen {
  readonly gibKarte: (kennung: string) => void;
  readonly setzeSzene: (kennung: string) => void;
  readonly beginnePartie: (begegnung: string) => void;
  readonly beginneAufgaben: (runde: string) => void;
  readonly setzeZustand: (gegner: string, faktor: number, grund: string) => void;
  readonly schalteSteckbrief: (gegner: string, zeile: number) => void;
  /** Öffnet einen Laden (laeden.json; docs/spiel/08, G5), sobald der Dialog zu ist. */
  readonly oeffneLaden: (kennung: string) => void;
  /** Ein Fund kommt in den Spielstand (funde.json; docs/spiel/08, E1). */
  readonly gibFund: (kennung: string) => void;
  /** Zeigt nach dem Dialog den Abspann (Ende von Akt 4). */
  readonly zeigeAbspann?: () => void;
  /** Zeigt nach dem Dialog die Fensterbank mit allen Funden (Atmosphäre T15, Kapitel 23). */
  readonly zeigeFensterbank?: () => void;
  /** Reise auf eine Karte eines anderen Ortes (Bus nach Cedar Creek); wirkt nach dem Dialog. */
  readonly reise: (karte: string, ausloeser: string) => void;
  /** Gedächtnisstellung aus partieformen.json (Runde 6), sobald der Dialog zu ist. */
  readonly beginneGedaechtnis: (kennung: string) => void;
  /** Vorführung aus vorfuehrungen.json (wie ein Statist mit `zeigt`), sobald der Dialog zu ist. */
  readonly zeigeVorfuehrung: (kennung: string) => void;
  /** Simultan aus partieformen.json (Runde 6): Duelle hintereinander, sobald der Dialog zu ist. */
  readonly beginneSimultan: (kennung: string) => void;
  /** Bezahlt einen festen Preis in Münzen (Fahrpreis); reicht es nicht, geschieht nichts. */
  readonly zahle: (muenzen: number) => void;
  /** Tönung der aktuellen Karte: nebel, nacht, abend, sepia, dunkel oder „keine“ (toenung.ts). */
  readonly setzeToenung: (name: string) => void;
}

/** Werte, die über Szenen hinweg gelten (Spielstand, Feld dialogvariablen). */
export type Dialogvariablen = Readonly<Record<string, number | string | boolean>>;

/** Der Stand nach einem Schritt: die nächste Zeile, oder die Auswahl, oder das Ende. */
export type Dialogschritt =
  | { readonly art: "zeile"; readonly zeile: Dialogzeile }
  | { readonly art: "wahl"; readonly wahlen: readonly string[] }
  | { readonly art: "ende" };

/** Tags „name:wert“ als Objekt; ein Tag ohne Doppelpunkt („pause“) bekommt den Wert „ja“. */
export function tagsAus(tags: readonly string[] | null): Readonly<Record<string, string>> {
  const ergebnis: Record<string, string> = {};
  for (const tag of tags ?? []) {
    const trenner = tag.indexOf(":");
    if (trenner < 0) ergebnis[tag.trim()] = "ja";
    else ergebnis[tag.slice(0, trenner).trim()] = tag.slice(trenner + 1).trim();
  }
  return ergebnis;
}

/**
 * Eine laufende Geschichte. Erzeugen mit dem übersetzten JSON (Paket, dialoge/<sprache>/*.json),
 * dann `starte(knoten)` und wiederholt `weiter()` bzw. `waehle(index)`.
 */
export class Geschichte {
  private readonly story: Story;
  /** Knoten der Datei (ohne die Deklarationen) und ihre zuletzt gesehene Besuchszahl. */
  private readonly knotennamen: readonly string[];
  private readonly besuche = new Map<string, number>();

  constructor(json: string, wirkungen: Wirkungen, variablen: Dialogvariablen, heldname: string) {
    this.story = new Story(json);
    this.knotennamen = [...this.story.mainContentContainer.namedContent.keys()].filter(
      (n) => !n.includes(" "),
    );
    this.story.BindExternalFunction("gibKarte", (k: string) => wirkungen.gibKarte(k), false);
    this.story.BindExternalFunction("gibFund", (k: string) => wirkungen.gibFund(k), false);
    this.story.BindExternalFunction("oeffneLaden", (k: string) => wirkungen.oeffneLaden(k), false);
    this.story.BindExternalFunction("zeigeAbspann", () => wirkungen.zeigeAbspann?.(), false);
    this.story.BindExternalFunction(
      "zeigeFensterbank",
      () => wirkungen.zeigeFensterbank?.(),
      false,
    );
    this.story.BindExternalFunction("setzeSzene", (k: string) => wirkungen.setzeSzene(k), false);
    this.story.BindExternalFunction(
      "beginnePartie",
      (k: string) => wirkungen.beginnePartie(k),
      false,
    );
    this.story.BindExternalFunction(
      "beginneAufgaben",
      (k: string) => wirkungen.beginneAufgaben(k),
      false,
    );
    this.story.BindExternalFunction(
      "setzeZustand",
      (g: string, f: number, grund: string) => wirkungen.setzeZustand(g, f, grund),
      false,
    );
    this.story.BindExternalFunction(
      "setzeToenung",
      (t: string) => wirkungen.setzeToenung(t),
      false,
    );
    this.story.BindExternalFunction(
      "beginneGedaechtnis",
      (k: string) => wirkungen.beginneGedaechtnis(k),
      false,
    );
    this.story.BindExternalFunction(
      "beginneSimultan",
      (k: string) => wirkungen.beginneSimultan(k),
      false,
    );
    this.story.BindExternalFunction(
      "zeigeVorfuehrung",
      (k: string) => wirkungen.zeigeVorfuehrung(k),
      false,
    );
    this.story.BindExternalFunction(
      "reise",
      (karte: string, ausloeser: string) => wirkungen.reise(karte, ausloeser),
      false,
    );
    this.story.BindExternalFunction("zahle", (n: number) => wirkungen.zahle(n), false);
    this.story.BindExternalFunction(
      "schalteSteckbrief",
      (g: string, z: number) => wirkungen.schalteSteckbrief(g, z),
      false,
    );
    for (const [name, wert] of Object.entries(variablen)) this.setzeVariable(name, wert);
    this.setzeVariable("held", heldname);
  }

  /** Setzt eine globale Variable, wenn die Geschichte sie kennt (sonst wirft inkjs). */
  private setzeVariable(name: string, wert: number | string | boolean): void {
    try {
      this.story.variablesState.$(name, wert);
    } catch {
      // Unbekannte Variable: Diese Szene braucht sie nicht.
    }
  }

  /** Springt zu einem Knoten; wirft, wenn es ihn nicht gibt (Fehler in den Spieldaten). */
  starte(knoten: string): void {
    this.story.ChoosePathString(knoten);
  }

  /** Die nächste Zeile, die Auswahl oder das Ende. Leere Zeilen werden übersprungen. */
  weiter(): Dialogschritt {
    while (this.story.canContinue) {
      const text = (this.story.Continue() ?? "").trim();
      const tags = tagsAus(this.story.currentTags);
      if (text.length > 0) return { art: "zeile", zeile: { text, tags } };
    }
    const wahlen = this.story.currentChoices.map((w) => w.text);
    return wahlen.length > 0 ? { art: "wahl", wahlen } : { art: "ende" };
  }

  /**
   * Die Knoten, die seit dem letzten Aufruf (neu) besucht wurden, in der Reihenfolge der Datei.
   * Warum: Der Zeiger der Geschichte steht nach der letzten Zeile vor END auf nichts; ein Knoten mit
   * nur einer Zeile (Leuchtfeuer einsetzen) ginge so verloren. Die Besuchszahl bleibt. Quests
   * warten auf Knoten. Braucht Dialoge, die mit „alle Besuche zählen“ übersetzt sind (Paketbau).
   */
  neueKnoten(): string[] {
    const neu: string[] = [];
    for (const name of this.knotennamen) {
      const anzahl = this.story.state.VisitCountAtPathString(name) ?? 0;
      if (anzahl > (this.besuche.get(name) ?? 0)) neu.push(name);
      this.besuche.set(name, anzahl);
    }
    return neu;
  }

  /** Wählt eine der angebotenen Antworten (Index wie in `weiter()`). */
  waehle(index: number): void {
    this.story.ChooseChoiceIndex(index);
  }

  /** Alle globalen Variablen zum Zurückschreiben in den Spielstand. */
  variablen(): Dialogvariablen {
    const ergebnis: Record<string, number | string | boolean> = {};
    const globale = (
      this.story.variablesState as unknown as { _globalVariables: Map<string, unknown> }
    )._globalVariables;
    for (const name of globale.keys()) {
      const wert: unknown = this.story.variablesState.$(name);
      if (typeof wert === "number" || typeof wert === "string" || typeof wert === "boolean") {
        ergebnis[name] = wert;
      }
    }
    return ergebnis;
  }
}
