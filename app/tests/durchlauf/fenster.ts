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
import type { Locator } from "@playwright/test";
import { hastigTippen, schliesseLaden } from "./eilig";
import { tippe, tippeKnopf, type Lauf } from "./eingabe";
import { schiebtAuf, wiederholtePartie } from "./antworten";
import { bedieneGedaechtnis } from "./gedaechtnis";
import type { Knopf, Lage } from "./lage";

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

/** So lange wartet der schwache Spieler nach dem Neuladen im Gespräch (ms). */
const NEULADEN_DIALOG_MS = 2000;
/** So lange darf ein Fenster ohne tippbaren Knopf stehen, bevor es ein Fund ist (ms). */
const OHNE_AUSGANG_MS = 25_000;
/** So oft wiederholt der Durchlauf eine nicht bestandene Runde gleich noch einmal. */
const RUNDE_WIEDERHOLEN = 2;
/** So viele gelesene Texte bleiben für Prüfungen im Gedächtnis. */
const GELESEN_MAX = 60;
/** So lange wartet der Spieler auf einen kurz gesperrten Knopf, bevor er wieder hinsieht (ms). */
const KURZ_WARTEN_MS = 200;
/**
 * So oft nimmt der Spieler dieselbe Antwort auf dieselbe Frage über alle Spielstände hinweg, bevor
 * sie nicht mehr als neu gilt. Warum: Revanchen („Noch eine?“ → „Spielen“) ändern nach jedem Sieg
 * den Stand; je Stand gezählt, galt „Spielen“ immer wieder als neu, und der Querformat-Durchlauf
 * ab Akt 2 spielte 45 Minuten lang gegen Rosa und Dime (19.11.2026). Ein Mensch hört nach ein, zwei
 * Revanchen auf.
 */
const GLEICHE_ANTWORT_MAX = 2;

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
  const wiederholt = (w: string) =>
    wiederholtePartie(w) && (g.gewaehlt.get(`wiederholt|${frage}|${w}`) ?? 0) > 0;
  const gesamt = (w: string) => g.gewaehlt.get(`immer|${frage}|${w}`) ?? 0;
  const vor = wahlen.map((w, i) => ({ i, w, n: zahl(w), auf: schiebtAuf(w) || wiederholt(w) }));
  const echte = vor.filter((v) => !v.auf);
  const neue = echte.filter((v) => v.n === 0 && gesamt(v.w) < GLEICHE_ANTWORT_MAX);
  // Ein echter Aufschub („Nicht jetzt.“) geht vor einer schon gewählten Wiederholung; sonst nahm
  // der Lauf bei Ruiz nach jedem Sieg wieder „Noch eine.“ (149 Partien, 20.11.2026).
  // Eine schon gewählte Wiederholung erst, wenn es nichts anderes gibt: Sonst nahm der Lauf bei
  // Nia nach einem einzigen „Ich muss weiter.“ wieder endlos „Noch eine.“ (20.11.2026).
  const selten = [...echte].sort((a, b) => a.n - b.n || gesamt(a.w) - gesamt(b.w))[0];
  const aufschub = vor.find((v) => schiebtAuf(v.w)) ?? selten;
  const wahl = neue[0] ?? aufschub ?? vor[0] ?? { i: 0, w: wahlen[0] ?? "" };
  merkeWahl(g, frage, wahl.w);
  return wahl.i;
}

/** Vermerkt eine gewählte Antwort (auch die des eiligen Spielers, sonst gälte sie ewig als neu). */
export function merkeWahl(g: Fenstergedaechtnis, frage: string, w: string): void {
  const plus = (schluessel: string) =>
    g.gewaehlt.set(schluessel, (g.gewaehlt.get(schluessel) ?? 0) + 1);
  plus(`${g.signatur}|${frage}|${w}`);
  plus(`immer|${frage}|${w}`);
  g.gewaehlt.set(`wiederholt|${frage}|${w}`, 1);
}

/**
 * Nach einem Kartenwechsel zählen gleiche Antworten wieder von vorn (GLEICHE_ANTWORT_MAX): Eine
 * Revanche-Schleife bleibt auf einer Karte; wer weiterzieht und wiederkommt (etwa zum Clubkampf
 * nach einer Niederlage), soll dieselbe Antwort wieder geben dürfen.
 */
export function vergissWiederholungen(g: Fenstergedaechtnis): void {
  for (const schluessel of [...g.gewaehlt.keys()]) {
    if (schluessel.startsWith("immer|")) g.gewaehlt.delete(schluessel);
  }
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
    if (lauf.schwach.dialogNeuladen()) {
      // Schwacher Spieler: mitten im Gespräch neu laden (schwach.ts), danach weiter wie ein Mensch.
      lauf.messung.log(
        `  SCHWACH: lade mitten im Gespräch neu (${d.sprecher}: ${d.text.slice(0, 60)})`,
      );
      await lauf.seite.reload().catch(() => undefined);
      await lauf.seite.waitForTimeout(NEULADEN_DIALOG_MS);
      return;
    }
    lauf.messung.zeile(d.text);
    merke(lauf, g, `${d.sprecher}: ${d.text}`);
  }
  const seite = lauf.seite;
  if (d.wahlen.length > 0) {
    const eilig = lauf.eilig.antwort(d.text, d.wahlen);
    if (eilig !== null) merkeWahl(g, d.text, d.wahlen[eilig] ?? "");
    const i = eilig ?? waehleAntwort(g, d.text, d.wahlen);
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
    // Eiliger Spieler (eilig.ts): sofort weiter, jedes zweite Mal doppelt, ohne zu warten.
    if (lauf.eilig.an && (await hastigTippen(lauf, knopf, lauf.eilig.doppelt()))) return;
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
  if (lauf.eilig.brichLadenAb(lauf.messung.karte))
    return void (await schliesseLaden(lauf, knoepfe));
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

/** So lange lädt die App nach „Jetzt aktualisieren“ höchstens neu (ms). */
const UPDATE_WARTEN_MS = 4000;

/**
 * Hinweis „Neue Version“ (ui/komponenten/hinweise/UpdateHinweis.tsx): Ein Mensch tippt „Jetzt
 * aktualisieren“, die App lädt neu. Im Durchlauf erscheint er nach jedem Neubau der App. Ausgabe:
 * ob getippt wurde.
 */
export async function bedieneUpdate(lauf: Lauf, lage: Lage): Promise<boolean> {
  const knopf = lage.knoepfe.find((k) => k.text === "Jetzt aktualisieren");
  if (!knopf) return false;
  lauf.messung.log("  Hinweis „Neue Version“: tippe „Jetzt aktualisieren“");
  await tippeKnopf(lauf, knopf);
  await lauf.seite.waitForTimeout(UPDATE_WARTEN_MS);
  return true;
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
  if (da("abenteuer-gedaechtnis") && (await bedieneGedaechtnis(lauf))) return true;
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
    // Kurz nach dem Öffnen ist „Los“ gesperrt (useKurzsperre.ts) und fehlt deshalb in der Lage:
    // abwarten, kein Fund.
    if (await los.isDisabled().catch(() => false)) {
      await lauf.seite.waitForTimeout(KURZ_WARTEN_MS);
      return true;
    }
    // Inzwischen frei und im Bild (die Sperre lief zwischen Lesen und Prüfen ab): neu lesen.
    if (await imBild(lauf, los)) return true;
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
  // Nach dem Neuladen des schwachen Spielers (schwach.ts): Weitermachen oder Abbrechen.
  const fortsetzung = lauf.schwach.fortsetzung(knoepfe);
  if (fortsetzung) lauf.messung.log(`  SCHWACH: Fortsetzungskarte „${fortsetzung.text}“`);
  // Nach dem Abbruch bietet die Figur die Runde oder Partie wieder an; die Antwort zum Start gilt
  // wieder als neu (sonst wählte der Durchlauf nur noch „Nicht jetzt“, Kit in Summit City).
  if (fortsetzung && /abbrechen|aufgeben/i.test(fortsetzung.text)) g.gewaehlt.clear();
  const knopf = fortsetzung ?? ausgangsknopf(knoepfe, g);
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

/** Liegt die Mitte des Elements im sichtbaren Bild? */
async function imBild(lauf: Lauf, ziel: Locator): Promise<boolean> {
  const box = await ziel.boundingBox({ timeout: 500 }).catch(() => null);
  const bild = lauf.seite.viewportSize();
  if (!box || !bild) return false;
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  return x >= 0 && y >= 0 && x <= bild.width && y <= bild.height;
}
