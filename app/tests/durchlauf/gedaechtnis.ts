/**
 * Gedächtnisstellung im Spieler-Durchlauf: die gezeigte Stellung einprägen (vom Brett lesen) und
 * danach im Editor Stein für Stein wieder aufbauen, dann „Fertig“.
 *
 * Warum: Am Canyon (Weg von Port Delacroix nach Desert Springs) verlangt eine Szene eine
 * Gedächtnisstellung; bisher brach der Durchlauf sie ab. Jetzt spielt er sie wie ein Mensch mit
 * gutem Gedächtnis: Er liest die Beschriftung der Felder, solange die Stellung zu sehen ist.
 * Sonderfall: Lässt sich das Brett beim Einprägen nicht lesen, nimmt er die Stellung aus
 * inhalte/abenteuer/partieformen.json (es gibt dort genau eine).
 * Abhängigkeiten: eingabe.ts, welt.ts (Daten), Testkennungen der Gedächtnisstellung.
 * Beispiel: Kg8, Bauern f7 g7, Kg1, Bauern f2 g2, Turm d1 → sieben Steine setzen, „Fertig“.
 */
import { tippe, type Lauf } from "./eingabe";
import { lies } from "./welt";

/** Die eingeprägte Stellung: Feld → Name des Steins („Turm (Weiß)“). */
let gemerkt = new Map<string, string>();
/** Schon gesetzte Felder dieser Runde. */
let gesetzt = new Set<string>();

/** Namen der Steine je FEN-Buchstabe (wie die Beschriftung der Felder und der Steinwahl). */
const STEIN: Readonly<Record<string, string>> = {
  k: "König",
  q: "Dame",
  r: "Turm",
  b: "Läufer",
  n: "Springer",
  p: "Bauer",
};
const KANTE = 8;

/** Die Stellung aus partieformen.json als Feld → Steinname (Ersatz, wenn das Brett nicht lesbar ist). */
function ausDaten(): Map<string, string> {
  const fen =
    lies<{ gedaechtnis: { fen: string }[] }>("partieformen.json").gedaechtnis[0]?.fen ?? "";
  const stellung = new Map<string, string>();
  (fen.split(" ")[0] ?? "").split("/").forEach((zeile, i) => {
    let spalte = 0;
    for (const zeichen of zeile) {
      if (/\d/.test(zeichen)) {
        spalte += Number(zeichen);
        continue;
      }
      const farbe = zeichen === zeichen.toUpperCase() ? "Weiß" : "Schwarz";
      const feld = `${"abcdefgh"[spalte] ?? "a"}${KANTE - i}`;
      stellung.set(feld, `${STEIN[zeichen.toLowerCase()] ?? ""} (${farbe})`);
      spalte++;
    }
  });
  return stellung;
}

/**
 * Bedient das Fenster der Gedächtnisstellung einen Schritt weit. Ausgabe: true, solange das
 * Fenster offen ist (getippt oder gewartet).
 */
export async function bedieneGedaechtnis(lauf: Lauf): Promise<boolean> {
  const fenster = lauf.seite.getByTestId("abenteuer-gedaechtnis");
  if (!(await fenster.isVisible().catch(() => false))) return false;
  const seite = lauf.seite;
  if (
    await seite
      .getByTestId("abenteuer-gedaechtnis-rest")
      .isVisible()
      .catch(() => false)
  ) {
    // Einprägen: die Felder mit Steinen lesen.
    const namen = await fenster
      .locator("button[aria-label]")
      .evaluateAll((alle) => alle.map((b) => b.getAttribute("aria-label") ?? ""))
      .catch(() => [] as string[]);
    const gelesen = new Map<string, string>();
    for (const name of namen) {
      const treffer = /^([a-h][1-8]), (.+)$/.exec(name);
      if (treffer) gelesen.set(treffer[1] ?? "", treffer[2] ?? "");
    }
    if (gelesen.size > 0) gemerkt = gelesen;
    gesetzt = new Set();
    await seite.waitForTimeout(300);
    return true;
  }
  const ergebnis = seite.getByTestId("abenteuer-gedaechtnis-ergebnis");
  if (await ergebnis.isVisible().catch(() => false)) {
    const text = await ergebnis.innerText().catch(() => "");
    lauf.messung.meldung(text);
    lauf.messung.log(`  Gedächtnisstellung: ${text}`);
    await tippe(
      lauf,
      fenster.getByRole("button", { name: "Weiter", exact: true }),
      "Gedächtnis „Weiter“",
    );
    await seite.waitForTimeout(300);
    return true;
  }
  if (
    !(await seite
      .getByTestId("stellungseditor")
      .isVisible()
      .catch(() => false))
  ) {
    await seite.waitForTimeout(200);
    return true;
  }
  if (gemerkt.size === 0) {
    gemerkt = ausDaten();
    lauf.messung.log(
      "  Gedächtnisstellung: Brett beim Einprägen nicht lesbar, Stellung aus den Daten",
    );
  }
  const offen = [...gemerkt].find(([feld]) => !gesetzt.has(feld));
  if (offen) {
    const [feld, stein] = offen;
    gesetzt.add(feld);
    const wahl = fenster.locator(`.figurenwahl-stein[aria-label='${stein}']`);
    await tippe(lauf, wahl, `Stein ${stein}`);
    await seite.waitForTimeout(100);
    await tippe(
      lauf,
      fenster.locator(`.brett-tasten button[aria-label^='${feld}']`),
      `Feld ${feld}`,
    );
    await seite.waitForTimeout(120);
    return true;
  }
  lauf.messung.log(`  Gedächtnisstellung: ${gemerkt.size} Steine gesetzt, „Fertig“`);
  await tippe(lauf, fenster.locator(".stellungseditor .knopf-haupt"), "Gedächtnis „Fertig“");
  await seite.waitForTimeout(400);
  return true;
}
