/**
 * Randprüfung des Spieler-Durchlaufs: Jedes Fenster, das im Lauf zum ersten Mal erscheint, wird
 * fotografiert und darauf geprüft, ob ein Knopf außerhalb des Bildes liegt oder verdeckt ist.
 *
 * Warum: Im Querformat (863 × 360) ist wenig Höhe; der Durchlauf tippt nur die Knöpfe an, die er
 * braucht, und sähe sonst nicht, dass ein anderer Knopf unter dem Rand liegt (Auftrag des Autors,
 * 18.11.2026: jede Stelle melden, an der ein Spieler nicht weiterkommt; Etappe 6, 20.11.2026).
 * Gelesen wird nur die Anzeige; nichts wird angetippt.
 * Abhängigkeiten: eingabe.ts (Lauf), lage.ts (Lage), messung.ts.
 * Beispiel: Laden quer → Bild „fenster-03-abenteuer-laden.png“; liegt „Fertig“ unter dem Rand und
 * rollt das Fenster nicht, meldet die Prüfung den Fund „rand“.
 */
import { join } from "node:path";
import { tippe, type Lauf } from "./eingabe";
import type { Lage } from "./lage";

/** So viele Fensterbilder macht ein Lauf höchstens. */
const BILDER_HOECHSTENS = 120;
/** So lange wartet die Prüfung, bis ein neues Fenster fertig aufgebaut ist (ms). */
const AUFBAU_MS = 450;
/** So viele auffällige Knöpfe nennt eine Meldung höchstens. */
const KNOEPFE_JE_MELDUNG = 6;

/** Fenster, die der Spieler von sich aus öffnet (Knöpfe der Kopfleiste und das Menü). */
const EIGENE_FENSTER = [
  "abenteuer-tagebuchknopf",
  "abenteuer-reisenknopf",
  "abenteuer-reisebrettknopf",
  "abenteuer-menueknopf",
] as const;
/** So lange wartet die Besichtigung, bis ein Fenster offen oder wieder zu ist (ms). */
const FENSTER_MS = 500;

/** Ein Knopf, der nicht frei im Bild liegt. */
interface Auffaellig {
  readonly text: string;
  /** „aussen“: außerhalb des Bildes; „verdeckt“: etwas liegt darüber. */
  readonly art: "aussen" | "verdeckt";
  /** Liegt der Knopf in einem Fenster, das rollt? Dann erreicht ihn ein Finger durch Wischen. */
  readonly rollt: boolean;
  readonly von: string;
}

/** Was die Prüfung im Browser abliest. */
interface Befund {
  readonly fenster: string;
  readonly auffaellig: readonly Auffaellig[];
}

/** Liest die offenen Fenster und die Knöpfe, die nicht frei im Bild liegen; läuft im Browser. */
function pruefeImBrowser(): Befund {
  const ANIMATION = "startanimation";
  const sichtbar = (e: Element) => {
    const r = e.getBoundingClientRect();
    const stil = getComputedStyle(e);
    return r.width > 1 && r.height > 1 && stil.visibility !== "hidden" && stil.display !== "none";
  };
  const name = (e: Element) =>
    e.getAttribute("data-testid") ?? e.getAttribute("aria-label") ?? e.className.toString();
  const offen = [
    ...document.querySelectorAll("[role='dialog'], [role='status'], [role='alertdialog']"),
  ].filter(sichtbar);
  const fenster = offen.map(name).sort().join("+");
  // Liegt ein Fenster über der Welt, zählen nur seine Knöpfe: Was dahinter liegt, darf verdeckt sein.
  const zaehlt = (k: Element) => offen.length === 0 || offen.some((f) => f.contains(k));
  // Rollt die ganze Seite (Rätsel quer: Brett steht, die Spalte daneben rollt mit der Seite)?
  const seiteRollt = document.documentElement.scrollHeight > innerHeight + 1;
  const rollt = (e: Element): boolean => {
    if (seiteRollt) return true;
    for (let p = e.parentElement; p; p = p.parentElement) {
      const o = getComputedStyle(p).overflowY;
      if ((o === "auto" || o === "scroll") && p.scrollHeight > p.clientHeight + 1) return true;
    }
    return false;
  };
  const auffaellig: Auffaellig[] = [];
  for (const k of document.querySelectorAll("button, [role='button'], a[href]")) {
    if (!sichtbar(k) || (k as HTMLButtonElement).disabled || !zaehlt(k)) continue;
    const r = k.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const text = (k.textContent?.trim() || name(k)).slice(0, 40);
    if (x < 0 || y < 0 || x > innerWidth || y > innerHeight) {
      auffaellig.push({ text, art: "aussen", rollt: rollt(k), von: "" });
      continue;
    }
    const oben = document.elementFromPoint(x, y);
    // Die Startanimation liegt beim Laden kurz über allem; sie zählt nicht.
    if (oben && !k.contains(oben) && !oben.contains(k) && !name(oben).includes(ANIMATION)) {
      auffaellig.push({ text, art: "verdeckt", rollt: rollt(k), von: name(oben).slice(0, 40) });
    }
  }
  return { fenster, auffaellig };
}

/** Merkt, welche Fenster der Lauf schon geprüft hat. */
export class Randpruefung {
  private readonly gesehen = new Set<string>();
  private bilder = 0;
  private besichtigt = false;

  constructor(private readonly ordner: string) {}

  /**
   * Prüft das Bild, wenn darauf ein Fenster offen ist, das der Lauf so noch nicht gesehen hat.
   * Eingabe: der Lauf und die gelesene Lage. Ausgabe: nichts; Funde und Bilder gehen in die
   * Messung und in den Ordner „bilder“. Sonderfall: Die freie Welt ohne Fenster wird nur einmal
   * je Format geprüft (Steuerkreuz, Aktionsknopf, Menü).
   */
  async pruefe(lauf: Lauf, lage: Lage): Promise<void> {
    if (this.bilder >= BILDER_HOECHSTENS || lage.bild === "app" || lage.bild === "leer") return;
    const erst = await lauf.seite.evaluate(pruefeImBrowser).catch(() => null);
    if (!erst) return;
    const wahl = lage.dialog && lage.dialog.wahlen.length > 0 ? "+antworten" : "";
    const schluessel = `${lage.bild}|${erst.fenster}${wahl}`;
    if (this.gesehen.has(schluessel)) return;
    this.gesehen.add(schluessel);
    // Das Fenster baut sich noch auf (Einblenden): kurz warten und dann erst urteilen.
    await lauf.seite.waitForTimeout(AUFBAU_MS);
    const befund = (await lauf.seite.evaluate(pruefeImBrowser).catch(() => null)) ?? erst;
    this.bilder += 1;
    const nummer = String(this.bilder).padStart(2, "0");
    const kurz = (befund.fenster || lage.bild).replace(/[^a-zA-Z0-9+-]/g, "").slice(0, 60);
    const datei = `fenster-${nummer}-${lage.bild}-${kurz}${wahl}.png`;
    await lauf.seite
      .screenshot({ path: join(this.ordner, "bilder", datei) })
      .catch(() => undefined);
    const fest = befund.auffaellig.filter((a) => !a.rollt);
    const rollend = befund.auffaellig.filter((a) => a.rollt);
    const nenne = (liste: readonly Auffaellig[]) =>
      liste
        .slice(0, KNOEPFE_JE_MELDUNG)
        .map((a) => `„${a.text}“ ${a.art}${a.von ? ` (${a.von})` : ""}`)
        .join(", ");
    lauf.messung.log(`RAND ${datei}: ${befund.auffaellig.length} auffällig`);
    if (fest.length > 0) lauf.messung.fund("rand", `${schluessel}: ${nenne(fest)} [${datei}]`);
    if (rollend.length > 0) lauf.messung.log(`  nur durch Rollen: ${nenne(rollend)}`);
  }

  /**
   * Öffnet einmal je Lauf die Fenster, die der Spieler selbst aufmacht (Tagebuch, Reisen,
   * Reisebrett, Spielmenü), prüft jedes und schließt es mit der Zurück-Taste wie am Handy.
   * Eingabe: der Lauf und die Lage der freien Welt. Ausgabe: nichts. Sonderfall: Knöpfe, die es
   * noch nicht gibt (Reisen vor der Monatskarte), werden übergangen.
   */
  async besichtige(lauf: Lauf, lage: Lage): Promise<void> {
    if (this.besichtigt || lage.dialog || lage.bild !== "welt") return;
    this.besichtigt = true;
    for (const kennung of EIGENE_FENSTER) {
      const knopf = lauf.seite.getByTestId(kennung);
      if (!(await knopf.isVisible().catch(() => false))) continue;
      if (!(await tippe(lauf, knopf, kennung))) continue;
      await lauf.seite.waitForTimeout(FENSTER_MS);
      await this.pruefe(lauf, lage);
      await lauf.seite.goBack().catch(() => undefined);
      await lauf.seite.waitForTimeout(FENSTER_MS);
    }
  }
}
