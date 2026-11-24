/**
 * Lesen für den Spieler-Durchlauf: was auf dem Bildschirm liegt (Fenster, Dialogtext, Knöpfe,
 * Kachel des Helden) und was im Speicher der App steht (Spielstand, laufende Partie).
 *
 * Warum: Der Durchlauf entscheidet wie ein Mensch nach dem, was er sieht, und nach dem Stand des
 * Spiels. Hier wird nur gelesen, nie geschrieben; alle Eingaben stehen in eingabe.ts.
 * Abhängigkeiten: Testkennungen der Oberwelt und der Spielhülle, IndexedDB der App.
 * Beispiel: liesLage(seite) → { bild: "welt", fenster: "dialog", dialog: { text: "Staub, Kisten …" } }.
 */
import type { Page } from "@playwright/test";
import { merkeAufbaustunde } from "./uhrwelt";
import type { Abenteuerstand } from "../../src/abenteuer/schnittstelle/spielstand";

/** Ein sichtbarer, freier Knopf, den der Finger wirklich träfe. */
export interface Knopf {
  readonly x: number;
  readonly y: number;
  readonly text: string;
  readonly kennung: string | null;
  readonly klasse: string;
  /** Kennung des Fensters, in dem der Knopf liegt (nächster Vorfahr mit Testkennung). */
  readonly fenster: string | null;
}

/** Der offene Dialog der Oberwelt oder der Partie. */
export interface Dialoglage {
  readonly sprecher: string;
  readonly text: string;
  readonly wahlen: readonly string[];
  /** „Weiter“ ist da und frei (keine Pause). */
  readonly weiter: boolean;
}

/** Was gerade auf dem Bildschirm liegt. */
export interface Lage {
  /** Grober Ort: Startkarte, Welt, Partie, Aufgabenrunde, übrige App, lädt. */
  readonly bild: "start" | "welt" | "partie" | "aufgaben" | "abenteuer" | "app" | "leer";
  /** Sichtbare Testkennungen (alle, auch verdeckte). */
  readonly kennungen: readonly string[];
  readonly dialog: Dialoglage | null;
  readonly knoepfe: readonly Knopf[];
  /** Kachel des Helden „x,y“ oder leer. */
  readonly kachel: string;
  /** Text des Aktionsknopfs, wenn er zu sehen ist. */
  readonly aktion: string | null;
  /** Das Steuerkreuz ist zu sehen. */
  readonly kreuz: boolean;
  readonly fassung: string | null;
  readonly breite: number;
  readonly hoehe: number;
}

/** Liest die Lage; läuft im Browser. */
function liesLageImBrowser(): Lage {
  const sichtbar = (e: Element) => {
    const r = (e as HTMLElement).getBoundingClientRect();
    return r.width > 1 && r.height > 1;
  };
  const da = (s: string) => {
    const e = document.querySelector(`[data-testid='${s}']`);
    return e !== null && sichtbar(e);
  };
  const kennungen = [...document.querySelectorAll("[data-testid]")]
    .filter(sichtbar)
    .map((e) => e.getAttribute("data-testid") ?? "");
  const knoepfe: Knopf[] = [];
  for (const el of document.querySelectorAll<HTMLElement>("button, [role=button], select")) {
    if ((el as HTMLButtonElement).disabled || el.hidden) continue;
    if (el.closest("[aria-label='Testhilfe des Autors']")) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    if (x < 0 || y < 0 || x > innerWidth || y > innerHeight) continue;
    const oben = document.elementFromPoint(x, y);
    if (!oben || (oben !== el && !el.contains(oben))) continue;
    knoepfe.push({
      x,
      y,
      text: (el.getAttribute("aria-label") ?? el.textContent ?? "").trim().slice(0, 80),
      kennung: el.getAttribute("data-testid"),
      klasse: el.className,
      fenster: el.parentElement?.closest("[data-testid]")?.getAttribute("data-testid") ?? null,
    });
  }
  const fenster = [...document.querySelectorAll<HTMLElement>("[data-testid='abenteuer-dialog']")]
    .filter(sichtbar)
    .pop();
  const dialog: Dialoglage | null = fenster
    ? {
        sprecher: fenster.querySelector(".abenteuer-dialog-sprecher")?.textContent ?? "",
        text: fenster.querySelector(".abenteuer-dialog-text")?.textContent ?? "",
        wahlen: [
          ...fenster.querySelectorAll<HTMLButtonElement>(".abenteuer-dialog-wahlen button"),
        ].map((b) => b.textContent ?? ""),
        weiter:
          fenster.querySelector<HTMLButtonElement>(".abenteuer-dialog-weiter")?.disabled === false,
      }
    : null;
  const aktion = document.querySelector<HTMLElement>("[data-testid='abenteuer-aktion']");
  const kreuz = document.querySelector(".abenteuer-steuerkreuz");
  const welt = document.querySelector<HTMLElement>("[data-testid='abenteuer-welt']");
  const bild = da("partie")
    ? "partie"
    : da("abenteuer-aufgaben")
      ? "aufgaben"
      : da("abenteuer-welt")
        ? "welt"
        : da("abenteuer-start")
          ? "start"
          : da("abenteuer")
            ? "abenteuer"
            : document.body.innerText.trim().length > 0
              ? "app"
              : "leer";
  return {
    bild,
    kennungen,
    dialog,
    knoepfe,
    kachel: document.querySelector("[data-testid='abenteuer-kachel']")?.textContent ?? "",
    aktion: aktion && !aktion.hidden && sichtbar(aktion) ? (aktion.textContent ?? "") : null,
    kreuz: kreuz !== null && sichtbar(kreuz),
    fassung: welt?.dataset.fassung ?? null,
    breite: innerWidth,
    hoehe: innerHeight,
  };
}

/** So lange darf die Seite für eine Antwort brauchen; danach gilt die Frage als unbeantwortet (ms). */
const ANTWORT_MS = 8000;

/** Der Wert der Frage, oder `ersatz`, wenn die Seite nicht rechtzeitig antwortet. */
async function mitErsatz<T>(frage: Promise<T>, ersatz: T): Promise<T> {
  let wecker: NodeJS.Timeout | undefined;
  const frist = new Promise<T>((fertig) => {
    wecker = setTimeout(() => fertig(ersatz), ANTWORT_MS);
  });
  const wert = await Promise.race([frage, frist]);
  clearTimeout(wecker);
  return wert;
}

const LEERE_LAGE: Lage = {
  bild: "leer",
  kennungen: [],
  dialog: null,
  knoepfe: [],
  kachel: "",
  aktion: null,
  kreuz: false,
  fassung: null,
  breite: 0,
  hoehe: 0,
};

/** Die Lage des Bildschirms; während eines Seitenwechsels oder ohne Antwort der Seite „leer“. */
export async function liesLage(seite: Page): Promise<Lage> {
  return mitErsatz(
    seite.evaluate(liesLageImBrowser).catch((): Lage => LEERE_LAGE),
    LEERE_LAGE,
  );
}

/** Die laufende oder zuletzt beendete Partie des Abenteuers aus dem Speicher der App. */
export interface Partielage {
  readonly id: string;
  readonly kennung: string;
  readonly startFen: string;
  readonly eigeneFarbe: "white" | "black";
  readonly zuege: readonly string[];
  readonly ende: string | null;
  readonly sieger: string | null;
  readonly laeuft: boolean;
}

/** Spielstand und Partie aus dem Speicher. */
export interface Speicher {
  readonly stand: Abenteuerstand | null;
  readonly partie: Partielage | null;
}

/** Liest Spielstand und neueste Abenteuerpartie aus den Nutzerdaten; läuft im Browser. */
function liesSpeicherImBrowser(): Promise<Speicher> {
  return new Promise((fertig, fehler) => {
    const anfrage = indexedDB.open("schach-von-grund-auf");
    anfrage.onerror = () => fehler(anfrage.error ?? new Error("Speicher nicht lesbar"));
    anfrage.onsuccess = () => {
      const db = anfrage.result;
      if (!db.objectStoreNames.contains("nutzerdaten")) {
        db.close();
        fertig({ stand: null, partie: null });
        return;
      }
      const lesen = db.transaction("nutzerdaten", "readonly").objectStore("nutzerdaten");
      const r = lesen.get("aktuell");
      r.onerror = () => fehler(r.error ?? new Error("Speicher nicht lesbar"));
      r.onsuccess = () => {
        interface P {
          id: string;
          ende: { art: string; sieger?: string } | null;
          zuege: { san: string }[];
          einstellung: {
            startFen: string;
            eigeneFarbe: "white" | "black";
            abenteuer?: { kennung: string };
          };
        }
        const d = r.result as
          | { abenteuer?: Abenteuerstand; spiel?: { laufend?: P; partien?: { partie: P }[] } }
          | undefined;
        const laufend = d?.spiel?.laufend?.einstellung.abenteuer ? d.spiel.laufend : undefined;
        const p =
          laufend ??
          (d?.spiel?.partien ?? []).map((e) => e.partie).find((e) => e.einstellung.abenteuer);
        db.close();
        fertig({
          stand: d?.abenteuer ?? null,
          partie: p
            ? {
                id: p.id,
                kennung: p.einstellung.abenteuer?.kennung ?? "",
                startFen: p.einstellung.startFen,
                eigeneFarbe: p.einstellung.eigeneFarbe,
                zuege: p.zuege.map((z) => z.san),
                ende: p.ende?.art ?? null,
                sieger: p.ende?.sieger ?? null,
                laeuft: p === laufend && !p.ende,
              }
            : null,
        });
      };
    };
  });
}

/** Spielstand und Partie aus dem Speicher der App (nur lesen). */
export async function liesSpeicher(seite: Page): Promise<Speicher> {
  const leer: Speicher = { stand: null, partie: null };
  const speicher = await mitErsatz(
    seite.evaluate(liesSpeicherImBrowser).catch((): Speicher => leer),
    leer,
  );
  // Stunde des Kartenaufbaus (useWeltladen.ts, data-stunde): Danach richtet sich die Aufstellung.
  const stunde = await seite
    .evaluate(() => document.querySelector("[data-stunde]")?.getAttribute("data-stunde") ?? null)
    .catch(() => null);
  merkeAufbaustunde(speicher.stand?.position?.karte, stunde === null ? null : Number(stunde));
  return speicher;
}

/** Der Spielstand; wirft, wenn es keinen gibt. */
export async function liesStand(seite: Page): Promise<Abenteuerstand> {
  const { stand } = await liesSpeicher(seite);
  if (!stand) throw new Error("Kein Spielstand im Speicher");
  return stand;
}

/** Die Kachel des Helden als Feld, oder null (Welt lädt noch). */
export function feldAus(kachel: string): { x: number; y: number } | null {
  const [x, y] = kachel.split(",").map(Number);
  return x !== undefined && y !== undefined && Number.isFinite(x) && Number.isFinite(y)
    ? { x, y }
    : null;
}

/**
 * Kurzfassung des Spielstands zum Vergleichen: Ändert sich nach einer Handlung nichts daran, hat
 * sie die Geschichte nicht weitergebracht. Position, Spielzeit und Münzen zählen nicht mit.
 */
export function signatur(stand: Abenteuerstand): string {
  return JSON.stringify([
    stand.quests.map((q) => [q.kennung, q.schritt, q.erledigt]),
    stand.dialogvariablen,
    stand.figuren.map((f) => [f.kennung, f.dialogvariablen]),
    stand.gegenstaende,
    stand.funde.map((f) => f.kennung),
    stand.karten,
    stand.protokoll.length,
    stand.runden,
    stand.handlung,
    stand.clubs,
  ]);
}
