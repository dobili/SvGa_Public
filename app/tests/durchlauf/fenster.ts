/**
 * Fenster der Oberwelt im Spieler-Durchlauf: Dialog lesen und beantworten, Meldungen,
 * Ergebniskarten, Deckwahl, Laden, Vorführung und alle übrigen Fenster wegtippen, bis die Welt
 * wieder frei ist. Gezählt werden dabei Zeilen und Wörter.
 *
 * Warum: Ein Mensch liest, tippt „Weiter“ oder eine Antwort und kommt so durch jedes Fenster. Der
 * Durchlauf tut dasselbe und meldet als Fund, wenn ein Fenster keinen Knopf hat, den der Finger
 * trifft (Dialog ohne Ausgang, Knopf verdeckt).
 * Abhängigkeiten: eingabe.ts, lage.ts, messung.ts.
 * Beispiel: bedieneFenster(lauf, lage) → true, wenn etwas getippt oder abgewartet wurde.
 */
import { tippe, tippeKnopf, type Lauf } from "./eingabe";
import type { Knopf, Lage } from "./lage";

/** Antworten, mit denen ein Spieler aufschiebt oder ablehnt (wie pipeline/abenteuer/lesefassung-spieler.cjs). */
const AUFSCHUB = [
  "nicht jetzt",
  "gleich",
  "noch nicht",
  "später",
  "ein andermal",
  "noch einen moment",
  "nach dem essen",
  "lieber nicht",
  "morgen",
  "bis morgen",
  "bis später",
  "ich bin zu müde",
  "vielleicht später",
  "weitergehen",
  "liegen lassen",
  "nichts fragen",
  "nicht hinsehen",
  "doch nicht",
];
const NUR_GANZ = ["nein", "gehen", "hinausgehen"];

/** Schiebt die Antwort auf oder lehnt sie ab? Beispiel: „Nicht jetzt.“ → true. */
export function schiebtAuf(antwort: string): boolean {
  const kern = antwort
    .toLowerCase()
    .replace(/[„“”"]/g, "")
    .replace(/[.!?…]+$/, "")
    .trim();
  return NUR_GANZ.includes(kern) || AUFSCHUB.some((a) => kern.startsWith(a));
}

/** Was der Durchlauf sich über Fenster merkt. */
export interface Fenstergedaechtnis {
  /** Wie oft eine Antwort auf eine Frage schon gewählt wurde (Schlüssel: Signatur, Frage, Antwort). */
  readonly gewaehlt: Map<string, number>;
  /** Zuletzt gezählter Text (Dialogzeile, Meldung), damit nichts doppelt zählt. */
  gezaehlt: string;
  /** Seit wann dasselbe Fenster ohne Knopf steht (ms seit 1970) und sein Text. */
  wartetSeit: number;
  wartetAuf: string;
  /** Kurzfassung des Spielstands; neue Fassung, neue Antworten. */
  signatur: string;
  /** Nicht bestandene Runden hintereinander (für „Noch einmal“). */
  fehlrunden: number;
  /** Zuletzt gelesene Texte (für Protokoll und Prüfungen). */
  readonly gelesen: string[];
}

export function neuesFenstergedaechtnis(): Fenstergedaechtnis {
  return {
    gewaehlt: new Map(),
    gezaehlt: "",
    wartetSeit: 0,
    wartetAuf: "",
    signatur: "",
    fehlrunden: 0,
    gelesen: [],
  };
}

/** So lange darf ein Fenster ohne tippbaren Knopf stehen, bevor es ein Fund ist (ms). */
const OHNE_AUSGANG_MS = 25_000;
/** So oft wiederholt der Durchlauf eine nicht bestandene Runde gleich noch einmal. */
const RUNDE_WIEDERHOLEN = 2;
/** So viele gelesene Texte bleiben für Prüfungen im Gedächtnis. */
const GELESEN_MAX = 60;

/**
 * Welche Antwort ein neugieriger Spieler nimmt: die am seltensten gewählte, die nicht aufschiebt;
 * sind alle solchen schon einmal gewählt, die aufschiebende (so endet jede Fragerunde).
 */
export function waehleAntwort(
  g: Fenstergedaechtnis,
  frage: string,
  wahlen: readonly string[],
): number {
  const zahl = (w: string) => g.gewaehlt.get(`${g.signatur}|${frage}|${w}`) ?? 0;
  const vor = wahlen.map((w, i) => ({ i, w, n: zahl(w), auf: schiebtAuf(w) }));
  const echte = vor.filter((v) => !v.auf);
  const neue = echte.filter((v) => v.n === 0);
  const aufschub = vor.find((v) => v.auf);
  const wahl = neue[0] ??
    aufschub ??
    [...vor].sort((a, b) => a.n - b.n)[0] ?? { i: 0, w: wahlen[0] ?? "" };
  g.gewaehlt.set(`${g.signatur}|${frage}|${wahl.w}`, zahl(wahl.w) + 1);
  return wahl.i;
}

/** Merkt einen gelesenen Text für Protokoll und Prüfungen. */
function merke(lauf: Lauf, g: Fenstergedaechtnis, text: string): void {
  g.gelesen.push(text);
  if (g.gelesen.length > GELESEN_MAX) g.gelesen.shift();
  lauf.messung.log(`  „${text.slice(0, 160)}“`);
}

/** Bedient den offenen Dialog: Zeile zählen, Antwort wählen oder „Weiter“ tippen. */
export async function bedieneDialog(lauf: Lauf, lage: Lage, g: Fenstergedaechtnis): Promise<void> {
  const d = lage.dialog;
  if (!d) return;
  const schluessel = `${d.sprecher}|${d.text}`;
  if (schluessel !== g.gezaehlt && d.text) {
    g.gezaehlt = schluessel;
    lauf.messung.zeile(d.text);
    merke(lauf, g, `${d.sprecher}: ${d.text}`);
  }
  const seite = lauf.seite;
  if (d.wahlen.length > 0) {
    const i = waehleAntwort(g, d.text, d.wahlen);
    lauf.messung.jetzt.wahlen += 1;
    for (const w of d.wahlen) lauf.messung.jetzt.dialogwoerter += w.trim().split(/\s+/).length;
    lauf.messung.log(`  Antwort: ${d.wahlen[i] ?? ""} (von ${d.wahlen.length})`);
    const knopf = seite.locator(".abenteuer-dialog-wahlen button").nth(i);
    if (await tippe(lauf, knopf, `Antwort „${d.wahlen[i] ?? ""}“`)) g.gezaehlt = "";
    await seite.waitForTimeout(120);
    return;
  }
  if (d.weiter) {
    const knopf = seite.locator(".abenteuer-dialog-weiter").last();
    const getippt =
      (await tippe(lauf, knopf, "Dialog „Weiter“")) ||
      (await tippe(lauf, seite.locator(".abenteuer-dialog-text[data-weiter='ja']"), "Dialogtext"));
    if (getippt) {
      await seite.waitForTimeout(60);
      return;
    }
  }
  await warteOderMelde(lauf, g, `Dialog „${d.text.slice(0, 60)}“`);
}

/** Wartet kurz; steht dasselbe Fenster zu lange ohne Knopf, ist das ein Fund. */
async function warteOderMelde(lauf: Lauf, g: Fenstergedaechtnis, was: string): Promise<void> {
  const jetzt = Date.now();
  if (g.wartetAuf !== was) {
    g.wartetAuf = was;
    g.wartetSeit = jetzt;
  } else if (jetzt - g.wartetSeit > OHNE_AUSGANG_MS) {
    lauf.messung.fund(
      "ohneAusgang",
      `${was}: seit ${OHNE_AUSGANG_MS / 1000} s kein tippbarer Knopf`,
    );
    g.wartetSeit = jetzt;
  }
  await lauf.seite.waitForTimeout(150);
}

/** Knöpfe, die zur freien Welt gehören (Steuerkreuz, Aktion, Leiste, Menü). */
function gehoertZurWelt(k: Knopf): boolean {
  return (
    /^Nach (oben|unten|links|rechts)$/.test(k.text) ||
    k.kennung === "abenteuer-aktion" ||
    k.kennung === "abenteuer-menueknopf" ||
    k.klasse.includes("abenteuer-tagebuchknopf") ||
    k.klasse.includes("abenteuer-tischblase")
  );
}

/** Die Knöpfe eines offenen Fensters über der Welt (leer: die Welt ist frei). */
export function fensterknoepfe(lage: Lage): Knopf[] {
  return lage.knoepfe.filter((k) => !gehoertZurWelt(k));
}

/** Kauft im Laden jede Ware, die gerade zu haben ist, einmal (billigste zuerst), und schließt ihn. */
async function bedieneLaden(
  lauf: Lauf,
  knoepfe: readonly Knopf[],
  g: Fenstergedaechtnis,
): Promise<void> {
  // Jede Ware höchstens einmal je Lauf: Karten ließen sich sonst kaufen, bis die Münzen weg sind.
  const waren = knoepfe.filter(
    (k) => k.klasse.includes("abenteuer-karte") && !g.gewaehlt.has(`laden|${k.text}`),
  );
  const preis = (k: Knopf) => Number(/(\d+)\D*$/.exec(k.text)?.[1] ?? 0);
  const ware = [...waren].sort((a, b) => preis(a) - preis(b))[0];
  if (ware) {
    g.gewaehlt.set(`laden|${ware.text}`, 1);
    lauf.messung.log(`  Laden: kaufe ${ware.text}`);
    await tippeKnopf(lauf, ware);
    await lauf.seite.waitForTimeout(300);
    return;
  }
  const zu = knoepfe.find((k) => k.klasse.includes("knopf-haupt"));
  if (zu) {
    await tippeKnopf(lauf, zu);
    return;
  }
  // „Schließen“ liegt außerhalb des Bildes (Querformat): hinrollen wie ein Mensch und festhalten.
  const unten = lauf.seite.locator("[data-testid='abenteuer-laden'] > .knopf-haupt");
  await lauf.seite
    .screenshot({ path: `${lauf.messung.ordner}/bilder/laden-ohne-schliessen.png` })
    .catch(() => undefined);
  if (await tippe(lauf, unten, "Laden „Schließen“ (gerollt)")) {
    lauf.messung.fund(
      "rollen",
      "Laden: der Knopf zum Schließen liegt außerhalb des Bildes, erst nach Rollen tippbar",
    );
  }
}

/** Der Knopf, mit dem ein Mensch dieses Fenster verlässt. */
function ausgangsknopf(knoepfe: readonly Knopf[], g: Fenstergedaechtnis): Knopf | undefined {
  const mit = (kennung: string) => knoepfe.find((k) => k.kennung === kennung);
  const nochmal = mit("abenteuer-runde-nochmal");
  if (nochmal && g.fehlrunden < RUNDE_WIEDERHOLEN) {
    g.fehlrunden += 1;
    return nochmal;
  }
  if (!nochmal && knoepfe.some((k) => k.fenster === "abenteuer-rundenergebnis")) g.fehlrunden = 0;
  return (
    mit("abenteuer-deck-los") ??
    mit("abenteuer-vorfuehrung-vor") ??
    knoepfe.find((k) => /^(Weiter|Schließen|Fertig)$/.test(k.text)) ??
    knoepfe.find((k) => k.klasse.includes("knopf-haupt") && !k.kennung) ??
    knoepfe.find(
      (k) => k.klasse.includes("knopf-zweit") && k.kennung !== "abenteuer-wiedereinstieg",
    ) ??
    knoepfe.find((k) => k.kennung !== "abenteuer-wiedereinstieg")
  );
}

/** Der Text des obersten Fensters (für die Zählung), ohne die Knöpfe. */
async function fenstertext(lauf: Lauf, kennung: string | null): Promise<string> {
  if (!kennung) return "";
  return lauf.seite
    .evaluate((k) => {
      const e = [...document.querySelectorAll<HTMLElement>(`[data-testid='${k}']`)].pop();
      if (!e) return "";
      const kopie = e.cloneNode(true) as HTMLElement;
      for (const b of kopie.querySelectorAll("button")) b.remove();
      return (kopie.textContent ?? "").replace(/\s+/g, " ").trim();
    }, kennung)
    .catch(() => "");
}

/**
 * Bedient das oberste Fenster über der Welt. Ausgabe: true, wenn ein Fenster da war (getippt oder
 * gewartet), false, wenn die Welt frei ist.
 */
export async function bedieneFenster(
  lauf: Lauf,
  lage: Lage,
  g: Fenstergedaechtnis,
): Promise<boolean> {
  if (lage.dialog) {
    await bedieneDialog(lauf, lage, g);
    return true;
  }
  const knoepfe = fensterknoepfe(lage);
  const da = (kennung: string) => lage.kennungen.includes(kennung);
  if (da("abenteuer-abspann")) lauf.messung.meldeAbspann();
  if (knoepfe.length === 0 && lage.bild === "welt" && da("abenteuer-laden")) {
    // Laden offen, aber kein Knopf im Bild (alle Waren gesperrt, „Schließen“ unter dem Rand).
    await bedieneLaden(lauf, knoepfe, g);
    return true;
  }
  if (knoepfe.length === 0) {
    // Fenster ohne Knopf: Gedächtnisstellung beim Einprägen, ladende Welt.
    const offen = ["abenteuer-gedaechtnis", "abenteuer-vorfuehrung", "abenteuer-deckwahl"].find(da);
    if (!offen && lage.kreuz) {
      g.wartetAuf = "";
      return false;
    }
    await warteOderMelde(lauf, g, offen ?? "Welt ohne Steuerkreuz");
    return true;
  }
  const oben = knoepfe[knoepfe.length - 1] as Knopf;
  const text = await fenstertext(lauf, oben.fenster);
  if (text && text !== g.gezaehlt && oben.fenster !== "abenteuer-welt") {
    g.gezaehlt = text;
    lauf.messung.meldung(text);
    merke(lauf, g, `[${oben.fenster ?? "Fenster"}] ${text}`);
  }
  if (da("abenteuer-laden") && knoepfe.some((k) => k.fenster === "abenteuer-laden")) {
    await bedieneLaden(lauf, knoepfe, g);
    return true;
  }
  if (da("abenteuer-deckwahl") && !knoepfe.some((k) => k.kennung === "abenteuer-deck-los")) {
    // „Los“ liegt außerhalb des Bildes (Querformat): hinrollen wie ein Mensch und festhalten.
    const los = lauf.seite.getByTestId("abenteuer-deck-los");
    await lauf.seite
      .screenshot({ path: `${lauf.messung.ordner}/bilder/deckwahl-ohne-los.png` })
      .catch(() => undefined);
    if (await tippe(lauf, los, "Deckwahl „Los“ (gerollt)")) {
      lauf.messung.fund(
        "rollen",
        `Deckwahl: „Los“ liegt bei ${lage.breite}×${lage.hoehe} außerhalb des Bildes, erst nach Rollen tippbar`,
      );
      await lauf.seite.waitForTimeout(300);
      return true;
    }
  }
  const knopf = ausgangsknopf(knoepfe, g);
  if (!knopf) {
    await warteOderMelde(lauf, g, `Fenster ${oben.fenster ?? "?"}`);
    return true;
  }
  g.wartetAuf = "";
  lauf.messung.log(`  tippe „${knopf.text}“ (${knopf.kennung ?? knopf.fenster ?? ""})`);
  await tippeKnopf(lauf, knopf);
  await lauf.seite.waitForTimeout(200);
  return true;
}
