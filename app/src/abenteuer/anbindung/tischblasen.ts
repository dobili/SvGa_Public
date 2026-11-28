/**
 * Die gemeinsame Sprechblase am Brett (docs/spiel/29_Tischgespraech.md, Abschnitt 2): zwei Lagen,
 * oben spricht der Gegner oder wer die Aufgabe stellt, unten Ambrose oder der Held. Diese Datei
 * hält die Warteschlange je Lage als reine Rechnung (getestet in tischblasen.test.ts).
 *
 * Rolle im Gesamtbild: anbindung/Tischblase.tsx hält den Stand im Kontext und zeigt die erste
 * Zeile jeder Lage (Rätselrunde), der Sprechkopf der Partie (Sprechkopf.tsx) über `ersteZeile` die
 * älteste beider Lagen; Partiemomente (Momentzeile.tsx), der Schutzengel (Schutzengelzeile.tsx), die
 * Karten (KartenleisteAnzeige.tsx) und das Tischgespräch (Tischgespraech.tsx) legen Zeilen hinein.
 * Grundsatz: Geschriebenes geht vor. Eine geschriebene Zeile (Moment, Spruch, Karte, Schutzengel)
 * verdrängt das Tischgespräch in beiden Lagen; solange Geschriebenes steht oder wartet, schweigt
 * das Tischgespräch.
 * Abhängigkeiten: keine.
 */

/** Oben (über dem Brett) oder unten (unter dem Brett). */
export type Lage = "oben" | "unten";

/** Geschriebene Zeilen gehen vor dem Tischgespräch. */
export type Vorrang = "geschrieben" | "tisch";

/** Eine Zeile in der Blase, schon übersetzt. */
export interface Blasenzeile {
  /** Eindeutig je Zeile; dieselbe Zeile kommt nicht zweimal in die Schlange. */
  readonly schluessel: string;
  readonly lage: Lage;
  /** Sprecherkennung für das Porträt („skater-jo“, „ambrose“); null ohne Porträt. */
  readonly sprecher: string | null;
  /** Name über dem Text; null ohne Namen (Erzähler). */
  readonly name: string | null;
  readonly text: string;
  /** Stimmung des Porträts (portraetblatt.json); null für die Grundfassung. */
  readonly stimmung: string | null;
  /** Ambrose halb durchsichtig wie in der Welt. */
  readonly geist: boolean;
  readonly vorrang: Vorrang;
  /** Testkennung der Blase (etwa „abenteuer-moment“). */
  readonly testid: string;
}

/** Erste Zeile jeder Lage wird gezeigt, die übrigen warten. */
export interface Blasenstand {
  readonly oben: readonly Blasenzeile[];
  readonly unten: readonly Blasenzeile[];
  /** Schlüssel beider Lagen in der Reihenfolge, in der sie kamen (Sprechkopf der Partie). */
  readonly reihe: readonly string[];
}

export const LEERE_BLASEN: Blasenstand = { oben: [], unten: [], reihe: [] };

/** Mehr Zeilen wartet keine Lage; was darüber kommt, entfällt (die Partie läuft weiter). */
const HOECHSTENS_WARTEND = 3;

/** Steht oder wartet irgendwo eine geschriebene Zeile? */
function hatGeschriebenes(stand: Blasenstand): boolean {
  return [...stand.oben, ...stand.unten].some((z) => z.vorrang === "geschrieben");
}

/** Die Lage ohne Tischgespräch. */
function ohneTisch(zeilen: readonly Blasenzeile[]): readonly Blasenzeile[] {
  return zeilen.filter((z) => z.vorrang === "geschrieben");
}

/**
 * Legt eine Zeile in ihre Lage.
 * Beispiel: Oben spricht gerade das Tischgespräch, ein Partiemoment kommt → der Moment steht oben
 * sofort, das Tischgespräch ist weg. Umgekehrt: Ein Moment steht, das Tischgespräch kommt → es
 * entfällt. Sonderfälle: dieselbe Zeile (Schlüssel) zweimal → einmal; volle Schlange → entfällt.
 */
export function mitZeile(stand: Blasenstand, zeile: Blasenzeile): Blasenstand {
  const alle = [...stand.oben, ...stand.unten];
  if (alle.some((z) => z.schluessel === zeile.schluessel)) return stand;
  if (zeile.vorrang === "tisch" && hatGeschriebenes(stand)) return stand;
  const basis =
    zeile.vorrang === "geschrieben"
      ? mitReihe({ oben: ohneTisch(stand.oben), unten: ohneTisch(stand.unten) }, stand.reihe)
      : stand;
  const lage = basis[zeile.lage];
  if (lage.length >= HOECHSTENS_WARTEND) return basis;
  return { ...basis, [zeile.lage]: [...lage, zeile], reihe: [...basis.reihe, zeile.schluessel] };
}

/** Die Reihe nur mit den Schlüsseln, die in einer Lage noch stehen oder warten. */
function mitReihe(
  lagen: Pick<Blasenstand, "oben" | "unten">,
  reihe: readonly string[],
): Blasenstand {
  const da = new Set([...lagen.oben, ...lagen.unten].map((z) => z.schluessel));
  return { ...lagen, reihe: reihe.filter((s) => da.has(s)) };
}

/** Die gezeigte Zeile einer Lage ist gelesen (Lesedauer um oder Tipp); die nächste rückt nach. */
export function ohneErste(stand: Blasenstand, lage: Lage, schluessel: string): Blasenstand {
  const erste = stand[lage][0];
  if (!erste || erste.schluessel !== schluessel) return stand;
  return {
    ...stand,
    [lage]: stand[lage].slice(1),
    reihe: stand.reihe.filter((s) => s !== schluessel),
  };
}

/**
 * Die Zeile, die als nächste dran ist, über beide Lagen hinweg: die älteste noch wartende. Sie
 * steht immer vorn in ihrer Lage, denn jede Lage wartet in der Reihenfolge der Ankunft. Für den
 * Sprechkopf der Partie (anbindung/Sprechkopf.tsx), der nur eine Zeile zugleich zeigt.
 * Beispiel: Der Gegner spricht oben, danach Ambrose unten → erst der Gegner, nach ihm Ambrose.
 * Sonderfall: nichts wartet → null.
 */
export function ersteZeile(stand: Blasenstand): Blasenzeile | null {
  const schluessel = stand.reihe[0];
  if (schluessel === undefined) return null;
  return [...stand.oben, ...stand.unten].find((z) => z.schluessel === schluessel) ?? null;
}

/** Lesedauer: Grundzeit plus je Zeichen, höchstens so lange (ms), wie die Partiemomente. */
const LESEN_GRUND_MS = 3000;
const LESEN_JE_ZEICHEN_MS = 50;
const LESEN_HOECHSTENS_MS = 9000;

/** Wie lange eine Zeile stehen bleibt. Beispiel: 40 Zeichen → 5 Sekunden. */
export function lesedauer(text: string): number {
  return Math.min(LESEN_HOECHSTENS_MS, LESEN_GRUND_MS + text.length * LESEN_JE_ZEICHEN_MS);
}
