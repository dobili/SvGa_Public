/**
 * Der schwache Spieler des Spieler-Durchlaufs (DURCHLAUF_SPIELER=schwach): Er verliert jede Partie
 * und jede Aufgabenrunde beim ersten Versuch und spielt sie beim zweiten wie der gewöhnliche
 * Durchlauf. Die Wegsperre S17 verliert er so oft, bis der Notausgang aufgeht.
 *
 * Warum: Der gewöhnliche Durchlauf spielt stärker als ein Leser mit 1200 und verliert nie;
 * Niederlagen, Wiedereinstieg, Neuladen und Notausgänge kamen im Browser deshalb nie vor (Grenze
 * in docs/spiel/auftraege/spielerdurchlauf_18-11.md, Nachtauftrag 19.11.2026).
 * Wie er verliert, wechselt reihum, damit jede Art einmal im Browser vorkommt:
 * - Partien: schwache Züge bis zum Ende, Aufgeben in der Partie, Neuladen mitten in der Partie
 *   und dann weiterspielen, Zurück-Taste und auf der Fortsetzungskarte aufgeben.
 * - Runden: falsche Züge, Zurück-Taste und „Runde abbrechen“, Neuladen und weitermachen.
 * Die Versuche je Partie und Runde stehen in DURCHLAUF_ORDNER/<format>/schwach.json, damit
 * Etappen und Neuladen sie nicht vergessen.
 * Abhängigkeiten: lage.ts (Knopf), messung.ts.
 * Beispiel: erste Partie gegen Rosa → „schwach“ (Niederlage), zweite → null (normal, Sieg).
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tippe, type Lauf } from "./eingabe";
import type { Knopf } from "./lage";

/** Ist der schwache Spieler eingeschaltet? */
export const SCHWACH = process.env.DURCHLAUF_SPIELER === "schwach";

/** So verliert der Spieler eine Partie. */
export type Partieverlust = "schwach" | "aufgeben" | "neuladen" | "zurueckAufgeben";
/** So verliert der Spieler eine Runde. */
export type Rundenverlust = "falsch" | "zurueckAbbrechen" | "neuladenWeiter";

const PARTIEARTEN: readonly Partieverlust[] = [
  "schwach",
  "aufgeben",
  "neuladen",
  "zurueckAufgeben",
];
const RUNDENARTEN: readonly Rundenverlust[] = ["falsch", "zurueckAbbrechen", "neuladenWeiter"];

/**
 * So viele Versuche verliert er je Begegnung (sonst einen). Wegsperre S17: Der dritte Fehlversuch
 * öffnet die Sperre (Notausgang, dialog/wegsperre-s17.test.ts); ein vierter wäre nie nötig.
 */
const VERLUSTE: Readonly<Record<string, number>> = { "wegDesertSummit.testteam": 3 };
/** Nach so vielen neuen Dialogzeilen lädt er mitten im Gespräch neu. */
const DIALOG_NEULADEN_ALLE = 40;
/** Nach einem Neuladen im Gespräch so viele Zeilen mehr bis zum nächsten. */
const DIALOG_NEULADEN_PAUSE = 160;
/** Nach so vielen eigenen Zügen gibt er auf oder lädt neu. */
export const EIGENE_ZUEGE_VOR_ABBRUCH = 4;

/** Was der Spieler sich merkt (schwach.json). */
interface Buch {
  /** Begonnene Versuche je Kennung (Partie oder Runde). */
  versuche: Record<string, number>;
  /** Wie viele Verluste schon vergeben sind (reihum durch die Arten). */
  partien: number;
  runden: number;
  /** Entscheidung je Partie-ID; neugeladen, sobald das Neuladen geschehen ist. */
  partie: Record<string, { art: Partieverlust | null; neugeladen: boolean }>;
  /** Die laufende Runde und ihre Entscheidung (über ein Neuladen hinweg). */
  runde: { kennung: string; art: Rundenverlust | null; neugeladen: boolean } | null;
  /** Was nach dem Neuladen auf der Fortsetzungskarte zu tippen ist. */
  nachNeuladen: "weiter" | "abbrechen" | null;
}

const LEER: Buch = {
  versuche: {},
  partien: 0,
  runden: 0,
  partie: {},
  runde: null,
  nachNeuladen: null,
};

/** Das Gedächtnis des schwachen Spielers, in einer Datei des Laufordners. */
export class Schwaechling {
  private readonly datei: string;
  private buch: Buch;

  /** `an`: verliert er überhaupt (Vorgabe DURCHLAUF_SPIELER=schwach; Tests schalten es ein). */
  constructor(
    ordner: string,
    private readonly an = SCHWACH,
  ) {
    this.datei = join(ordner, "schwach.json");
    this.buch = existsSync(this.datei)
      ? { ...LEER, ...(JSON.parse(readFileSync(this.datei, "utf8")) as Partial<Buch>) }
      : structuredClone(LEER);
  }

  private sichere(): void {
    writeFileSync(this.datei, `${JSON.stringify(this.buch, null, 1)}\n`);
  }

  /** Zählt einen neuen Versuch und sagt, ob er verloren werden soll. */
  private neuerVersuch(kennung: string): boolean {
    // Die App hängt an die Kennung der Begegnung die Partie an („mapleFalls.ersteLektion#mwo0…“).
    const begegnung = kennung.split("#")[0] ?? kennung;
    const n = (this.buch.versuche[begegnung] ?? 0) + 1;
    this.buch.versuche[begegnung] = n;
    return this.an && n <= (VERLUSTE[begegnung] ?? 1);
  }

  /**
   * Wie die Partie mit dieser ID verloren wird; null: normal spielen. Eine Partie, die nach dem
   * Neuladen weiterläuft, behält ihre Entscheidung. Beispiel: erste Partie → "schwach".
   */
  partie(id: string, kennung: string): { art: Partieverlust | null; neugeladen: boolean } {
    const bekannt = this.buch.partie[id];
    if (bekannt) return bekannt;
    const art = this.neuerVersuch(kennung)
      ? (PARTIEARTEN[this.buch.partien++ % PARTIEARTEN.length] ?? "schwach")
      : null;
    const eintrag = { art, neugeladen: false };
    this.buch.partie[id] = eintrag;
    this.sichere();
    return eintrag;
  }

  /** Die Runde `kennung` beginnt (oder läuft nach dem Neuladen weiter): wie verlieren? */
  runde(kennung: string): { art: Rundenverlust | null; neugeladen: boolean } {
    if (this.buch.runde?.kennung === kennung) return this.buch.runde;
    const art = this.neuerVersuch(kennung)
      ? (RUNDENARTEN[this.buch.runden++ % RUNDENARTEN.length] ?? "falsch")
      : null;
    this.buch.runde = { kennung, art, neugeladen: false };
    this.sichere();
    return this.buch.runde;
  }

  /** Die Runde ist zu Ende (Ergebnis gesehen oder abgebrochen). */
  rundeVorbei(): void {
    this.buch.runde = null;
    this.sichere();
  }

  /** Gezählte Dialogzeilen seit dem letzten Neuladen im Gespräch. */
  private dialogzeilen = 0;

  /**
   * Soll der Spieler jetzt mitten im Gespräch neu laden? Ja bei jeder DIALOG_NEULADEN_ALLE-ten
   * neuen Zeile, nur beim schwachen Spieler. Warum: Wer die App mitten im Gespräch schließt, darf
   * nichts doppelt bekommen und nichts verlieren; das prüft sonst niemand im Browser.
   */
  dialogNeuladen(): boolean {
    if (!this.an) return false;
    this.dialogzeilen += 1;
    if (this.dialogzeilen < DIALOG_NEULADEN_ALLE) return false;
    // Danach länger warten: Eine Szene mit mehr als 40 Zeilen (die Kerze in Ghost Town) wurde
    // sonst bei jedem Anlauf wieder unterbrochen und nie fertig (Durchlauf, 20.11.2026).
    this.dialogzeilen = -DIALOG_NEULADEN_PAUSE;
    return true;
  }

  /** Steht nach einem Neuladen noch eine Wahl auf der Fortsetzungskarte aus? */
  offenNachNeuladen(): boolean {
    return this.buch.nachNeuladen !== null;
  }

  /** Die ausstehende Wahl ohne Fortsetzungskarte erledigen (die App zeigte gleich die Partie). */
  erledigeNeuladen(): "weiter" | "abbrechen" | null {
    const wahl = this.buch.nachNeuladen;
    this.buch.nachNeuladen = null;
    this.sichere();
    return wahl;
  }

  /** Vor dem Neuladen: merken, dass es geschah und was danach zu tippen ist. */
  neuladen(partieId: string | null, danach: "weiter" | "abbrechen"): void {
    const p = partieId ? this.buch.partie[partieId] : undefined;
    if (p) p.neugeladen = true;
    if (!partieId && this.buch.runde) this.buch.runde.neugeladen = true;
    this.buch.nachNeuladen = danach;
    this.sichere();
  }

  /**
   * Der Knopf der Fortsetzungskarte nach dem Neuladen (Weitermachen oder Abbrechen); undefined,
   * wenn keine Karte offen ist oder nichts gemerkt ist. Beim Abbrechen gilt die Runde als vorbei.
   */
  fortsetzung(knoepfe: readonly Knopf[]): Knopf | undefined {
    const wahl = this.buch.nachNeuladen;
    const abbrechen = knoepfe.find((k) => /^(Runde abbrechen|Partie aufgeben)/.test(k.text));
    if (!wahl || !abbrechen) return undefined;
    this.buch.nachNeuladen = null;
    if (wahl === "abbrechen") this.buch.runde = null;
    this.sichere();
    if (wahl === "abbrechen") return abbrechen;
    return knoepfe.find((k) => /^(Weitermachen|Weiterspielen)$/.test(k.text));
  }
}

/** Der schwächste Zug einer bewerteten Liste (der beste zuerst); undefined bei leerer Liste. */
export function schwaechsterZug(
  alle: readonly { uci: string; wert: number }[],
): string | undefined {
  return alle[alle.length - 1]?.uci;
}

/** Was eine Partie für die Entscheidung über das Abbrechen braucht. */
interface Partieblick {
  readonly id: string;
  readonly kennung: string;
  readonly startFen: string;
  readonly eigeneFarbe: "white" | "black";
  readonly zuege: readonly string[];
}

/** Zahl der eigenen Züge in der Partie (wer anfängt, steht in der Startstellung). */
export function eigeneZuege(p: Partieblick): number {
  const weissBeginnt = p.startFen.split(" ")[1] !== "b";
  const ichBeginne = weissBeginnt === (p.eigeneFarbe === "white");
  return ichBeginne ? Math.ceil(p.zuege.length / 2) : Math.floor(p.zuege.length / 2);
}

/** Tippt „Aufgeben“ in der Partie und bestätigt. */
export async function gibAuf(lauf: Lauf): Promise<void> {
  await tippe(lauf, lauf.seite.getByTestId("abenteuer-partie-aufgeben"), "Aufgeben");
  await tippe(lauf, lauf.seite.getByRole("button", { name: "Ja, aufgeben" }), "Ja, aufgeben");
}

/**
 * Bricht die Partie ab, wenn der schwache Spieler das vorhat: aufgeben oder die Seite neu laden.
 * Ausgabe: true, wenn etwas geschah (der Aufrufer liest die Lage neu). Sonderfall: Zeigt die App
 * nach dem Neuladen gleich wieder die Partie statt der Fortsetzungskarte, gibt er in der Partie
 * auf, wenn er auf der Karte hätte aufgeben wollen.
 */
export async function brichPartieAb(lauf: Lauf, p: Partieblick): Promise<boolean> {
  const v = lauf.schwach.partie(p.id, p.kennung);
  if (!v.art || eigeneZuege(p) < EIGENE_ZUEGE_VOR_ABBRUCH) return false;
  if (v.neugeladen && lauf.schwach.offenNachNeuladen()) {
    const wahl = lauf.schwach.erledigeNeuladen();
    lauf.messung.log(`  Nach dem Neuladen gleich wieder in der Partie (statt Fortsetzungskarte)`);
    if (wahl === "abbrechen") await gibAuf(lauf);
    return wahl === "abbrechen";
  }
  if (v.art === "aufgeben") {
    lauf.messung.log(`  SCHWACH: gebe ${p.kennung} nach ${eigeneZuege(p)} eigenen Zügen auf`);
    await gibAuf(lauf);
    return true;
  }
  if ((v.art === "neuladen" || v.art === "zurueckAufgeben") && !v.neugeladen) {
    lauf.messung.log(`  SCHWACH: verlasse ${p.kennung} mitten in der Partie (${v.art})`);
    lauf.schwach.neuladen(p.id, v.art === "neuladen" ? "weiter" : "abbrechen");
    await verlasse(lauf, v.art === "neuladen");
    return true;
  }
  return false;
}

/** So lange wartet der Spieler nach dem Neuladen, bevor er wieder hinsieht (ms). */
const NEULADEN_RUHE_MS = 2000;

/**
 * Verlässt Partie oder Runde: Neuladen (die App öffnet sie gleich wieder, Weitermachen) oder die
 * Zurück-Taste des Handys (zurück in die Welt; dort steht die Fortsetzungskarte mit Abbrechen).
 * Warum beides: Nach dem Neuladen zeigt die App die Partie oder Runde sofort wieder (Browser,
 * 19.11.2026); die Fortsetzungskarte erscheint nur, wer zurück in die Welt geht.
 */
async function verlasse(lauf: Lauf, neuladen: boolean): Promise<void> {
  if (neuladen) await lauf.seite.reload().catch(() => undefined);
  else await lauf.seite.goBack().catch(() => undefined);
  await lauf.seite.waitForTimeout(NEULADEN_RUHE_MS);
}

/**
 * Schwacher Spieler: Ab der zweiten Aufgabe verlässt er die Runde einmal, wenn er das vorhat:
 * Neuladen und weitermachen, oder Zurück und auf der Fortsetzungskarte abbrechen. Ausgabe: true,
 * wenn er sie verlassen hat (die Runde endet hier für den Aufrufer).
 */
export async function ladeRundeNeu(
  lauf: Lauf,
  verlust: { art: string | null; neugeladen: boolean },
  nummer: string | undefined,
): Promise<boolean> {
  const verlassen = verlust.art === "zurueckAbbrechen" || verlust.art === "neuladenWeiter";
  if (!verlassen || verlust.neugeladen || Number(nummer ?? "0") < 2) return false;
  lauf.messung.log(`  SCHWACH: verlasse die Runde mitten drin (${verlust.art ?? ""})`);
  lauf.schwach.neuladen(null, verlust.art === "neuladenWeiter" ? "weiter" : "abbrechen");
  await verlasse(lauf, verlust.art === "neuladenWeiter");
  return true;
}
