/**
 * Bedingungen über Dialogvariablen und Besitz, wie sie `wenn` an Übergängen und die Schlüssel von
 * `zustaende` in orte.json schreiben (Runde 8, Technik der Zustände).
 *
 * Sprache: eine Variable (`musikhausOffen`, `hatLaterne`), ein Vergleich mit einer Zahl, einem
 * Text in Anführungszeichen oder wahr/falsch (`nadelMapleFalls >= 1`, `ausgangIronwoodGus ==
 * "sieg"`), verknüpft mit `nicht`, `und`, `oder` und Klammern; `und` bindet stärker als `oder`.
 * Eine Variable allein gilt, wenn sie wahr, eine Zahl ungleich 0 oder ein nicht leerer Text ist.
 * Fehlt eine Variable, zählt sie in Vergleichen als 0, leerer Text oder falsch (je nach Wert).
 *
 * Rolle im Gesamtbild: Reine Logik für kartenfassung.ts und useDialogende.ts (getestet in
 * bedingung.test.ts). Dieselbe Sprache prüfen pipeline/abenteuer/bedingung.py (Daten, Liste der
 * Zustände) und gesamtsimulation-regeln.cjs; Änderungen gehören in alle drei.
 * Abhängigkeiten: keine.
 */

type Wert = number | string | boolean;
type Vergleich = "==" | "!=" | ">=" | "<=" | ">" | "<";

const ZEICHEN = /\s*(\(|\)|==|!=|>=|<=|>|<|"[^"]*"|-?\d+(?:\.\d+)?|[A-Za-z_][A-Za-z0-9_]*)/y;
const VERGLEICHE: readonly string[] = ["==", "!=", ">=", "<=", ">", "<"];
const WORTWERTE: Readonly<Record<string, boolean>> = {
  wahr: true,
  true: true,
  falsch: false,
  false: false,
};

/** Zerlegt eine Bedingung in Zeichen; wirft bei einem unbekannten Zeichen. */
function zerlege(text: string): string[] {
  const zeichen: string[] = [];
  ZEICHEN.lastIndex = 0;
  while (ZEICHEN.lastIndex < text.length) {
    if (text.slice(ZEICHEN.lastIndex).trim() === "") break;
    const start = ZEICHEN.lastIndex;
    const treffer = ZEICHEN.exec(text);
    if (!treffer?.[1]) throw new Error(`Bedingung „${text}“: unlesbar ab Stelle ${start}`);
    zeichen.push(treffer[1]);
  }
  return zeichen;
}

/** Ein Wert rechts vom Vergleich: Zahl, Text oder wahr/falsch. */
function wertAus(zeichen: string, text: string): Wert {
  if (zeichen.startsWith('"')) return zeichen.slice(1, -1);
  if (/^-?\d/.test(zeichen)) return Number(zeichen);
  const wort = WORTWERTE[zeichen];
  if (wort === undefined) throw new Error(`Bedingung „${text}“: „${zeichen}“ ist kein Wert`);
  return wort;
}

/** Vergleicht eine Variable (fehlend: leerer Wert der Art des Vergleichswerts) mit einem Wert. */
function vergleiche(links: unknown, op: Vergleich, rechts: Wert): boolean {
  const leer = typeof rechts === "number" ? 0 : typeof rechts === "string" ? "" : false;
  const l = links === undefined || links === null ? leer : links;
  if (op === "==") return l === rechts;
  if (op === "!=") return l !== rechts;
  if (typeof l !== "number" || typeof rechts !== "number") return false;
  if (op === ">=") return l >= rechts;
  if (op === "<=") return l <= rechts;
  return op === ">" ? l > rechts : l < rechts;
}

/** Ein rekursiver Leser über den Zeichen; jede Ebene eine Methode (oder, und, nicht, einfach). */
class Leser {
  private i = 0;
  constructor(
    private readonly zeichen: readonly string[],
    private readonly text: string,
    private readonly variablen: Readonly<Record<string, unknown>>,
  ) {}

  ganz(): boolean {
    const wert = this.oder();
    if (this.i < this.zeichen.length) this.fehler(`unerwartet „${this.zeichen[this.i]}“`);
    return wert;
  }

  private oder(): boolean {
    let wert = this.und();
    while (this.zeichen[this.i] === "oder") {
      this.i++;
      // Beide Seiten lesen (kein Abkürzen), damit Fehler rechts immer auffallen.
      const rechts = this.und();
      wert = wert || rechts;
    }
    return wert;
  }

  private und(): boolean {
    let wert = this.nicht();
    while (this.zeichen[this.i] === "und") {
      this.i++;
      const rechts = this.nicht();
      wert = wert && rechts;
    }
    return wert;
  }

  private nicht(): boolean {
    if (this.zeichen[this.i] !== "nicht") return this.einfach();
    this.i++;
    return !this.nicht();
  }

  private einfach(): boolean {
    const z = this.zeichen[this.i++];
    if (z === "(") {
      const wert = this.oder();
      if (this.zeichen[this.i++] !== ")") this.fehler("„)“ fehlt");
      return wert;
    }
    if (!z || !/^[A-Za-z_]/.test(z) || z in WORTWERTE) this.fehler("Variable erwartet");
    const name = z ?? "";
    const op = this.zeichen[this.i];
    if (!op || !VERGLEICHE.includes(op)) return Boolean(this.variablen[name]);
    this.i++;
    const rechts = this.zeichen[this.i++];
    if (rechts === undefined) this.fehler("Wert fehlt");
    return vergleiche(this.variablen[name], op as Vergleich, wertAus(rechts ?? "", this.text));
  }

  private fehler(was: string): never {
    throw new Error(`Bedingung „${this.text}“: ${was}`);
  }
}

/**
 * Ob eine Bedingung für diese Variablen gilt; wirft bei einer fehlerhaften Bedingung (Fehler in
 * den Spieldaten, pytest prüft alle). Beispiel: „nadelMapleFalls >= 1 und nicht hatLaterne“ mit
 * { nadelMapleFalls: 2 } → true; „musikhausOffen“ mit {} → false.
 */
export function erfuellt(bedingung: string, variablen: Readonly<Record<string, unknown>>): boolean {
  return new Leser(zerlege(bedingung), bedingung, variablen).ganz();
}
