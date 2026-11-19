/**
 * Strukturaufgaben im Spieler-Durchlauf: starke Felder und schwache Bauern antippen, die Feldart
 * des goldenen Feldes wählen, den Plan wählen.
 *
 * Warum: Die Reihen in Port Delacroix (Remy, Lou) bestehen aus Strukturaufgaben; ohne sie endete
 * jede Strecke dort. Der Löser erkennt die Aufgabe an der Stellung auf dem Brett, sucht sie in
 * den Trainerdaten der App (public/daten/de/trainer/struktur.json) und rechnet die Antworten mit
 * denselben Funktionen wie die App (training/strukturtrainer.ts); getippt wird alles mit dem
 * Finger. Das goldene Feld der Feldartfrage liest er aus der Lage der Marke im Brettbild.
 * Abhängigkeiten: training/strukturtrainer.ts (über Vite geladen), i18n/de.json, eingabe.ts.
 * Beispiel: Abb. 5.3 (Bauernkette), Schwarz: starke Felder antippen, „Prüfen“, schwache Bauern,
 * „Prüfen“, Feldart, Plan „Kettenbasis angreifen“.
 */
import { readFileSync } from "node:fs";
import type { Strukturaufgabe } from "../../src/daten/trainerdaten";
import { createServer } from "vite";
import { tippe, type Lauf } from "./eingabe";

const DATEI = new URL("../../public/daten/de/trainer/struktur.json", import.meta.url);
const TEXTE = new URL("../../src/i18n/de.json", import.meta.url);
/** Felder je Brettkante. */
const KANTE = 8;
const LINIEN = "abcdefgh";

/** Die Rechenfunktionen der App für Strukturaufgaben. */
type Strukturregeln = typeof import("../../src/training/strukturtrainer");
let regeln: Strukturregeln | null = null;

/**
 * Lädt training/strukturtrainer.ts über Vite. Warum nicht als gewöhnlicher Import: Die Regeln
 * hängen an den Texten der App (JSON-Import), und den lädt Playwright unter Node nicht; Vite
 * übersetzt ihn wie beim Bau der App.
 */
async function ladeRegeln(): Promise<Strukturregeln> {
  if (regeln) return regeln;
  const server = await createServer({
    root: new URL("../../", import.meta.url).pathname,
    configFile: false,
    appType: "custom",
    logLevel: "silent",
    server: { middlewareMode: true, hmr: false, watch: null },
  });
  try {
    regeln = (await server.ssrLoadModule("/src/training/strukturtrainer.ts")) as Strukturregeln;
  } finally {
    await server.close();
  }
  return regeln;
}

let aufgaben: readonly Strukturaufgabe[] | null = null;
let texte: Readonly<Record<string, string>> | null = null;

/** Was der Löser von der offenen Strukturaufgabe sieht. */
interface Sicht {
  /** Beschriftungen der Felder des Bretts, das sich antippen lässt (leer: keins). */
  readonly felder: readonly string[];
  /** „Prüfen“ ist zu sehen. */
  readonly pruefen: boolean;
  /** Freie Antwortknöpfe der letzten Knopfreihe. */
  readonly optionen: readonly string[];
  /** Mitte der Marke im letzten Brettbild, 0 bis 1 von links oben; null ohne Marke. */
  readonly marke: { readonly x: number; readonly y: number } | null;
  /** Der Auftrag mit den schwachen Bauern steht schon da. */
  readonly bauernschritt: boolean;
}

/** Liest die Sicht; läuft im Browser. */
function liesSichtImBrowser(a: { pruefen: string; bauern: string }): Sicht {
  const wurzel = document.querySelector("[data-testid='abenteuer-aufgaben']") ?? document.body;
  const bretter = [...wurzel.querySelectorAll(".brett-tasten")];
  const tasten = bretter[bretter.length - 1];
  const felder = tasten
    ? [...tasten.querySelectorAll("button")].map((b) => b.getAttribute("aria-label") ?? "")
    : [];
  const knoepfe = [...wurzel.querySelectorAll<HTMLButtonElement>("button")];
  const reihen = [...wurzel.querySelectorAll(".knopfreihe[role='group']")];
  const reihe = reihen[reihen.length - 1];
  const optionen = reihe
    ? [...reihe.querySelectorAll<HTMLButtonElement>("button")]
        .filter((b) => !b.disabled)
        .map((b) => (b.textContent ?? "").trim())
    : [];
  const bilder = [...wurzel.querySelectorAll("svg[role='img']")];
  const bild = bilder[bilder.length - 1];
  const umriss = bild?.querySelector("g[fill='none'][stroke-linejoin='miter']");
  let marke: { x: number; y: number } | null = null;
  if (bild && umriss) {
    const r = bild.getBoundingClientRect();
    const m = umriss.getBoundingClientRect();
    marke = {
      x: (m.left + m.width / 2 - r.left) / r.width,
      y: (m.top + m.height / 2 - r.top) / r.height,
    };
  }
  return {
    felder,
    pruefen: knoepfe.some((b) => (b.textContent ?? "").trim() === a.pruefen && !b.disabled),
    optionen,
    marke,
    bauernschritt: (wurzel.textContent ?? "").includes(a.bauern),
  };
}

/** Die Figurenstellung (erster Teil der FEN) aus den Beschriftungen der Felder. */
function brettAus(felder: readonly string[]): string {
  const figur: Readonly<Record<string, string>> = {
    König: "k",
    Dame: "q",
    Turm: "r",
    Läufer: "b",
    Springer: "n",
    Bauer: "p",
  };
  const belegung = new Map<string, string>();
  for (const name of felder) {
    const treffer = /^([a-h][1-8]), (\S+) \((Weiß|Schwarz)\)/.exec(name);
    const buchstabe = treffer ? figur[treffer[2] ?? ""] : undefined;
    if (!treffer || !buchstabe) continue;
    belegung.set(treffer[1] ?? "", treffer[3] === "Weiß" ? buchstabe.toUpperCase() : buchstabe);
  }
  const reihen: string[] = [];
  for (let reihe = KANTE; reihe >= 1; reihe--) {
    let zeile = "";
    let leer = 0;
    for (const linie of LINIEN) {
      const stein = belegung.get(`${linie}${reihe}`);
      if (stein) {
        zeile += (leer > 0 ? String(leer) : "") + stein;
        leer = 0;
      } else leer++;
    }
    reihen.push(zeile + (leer > 0 ? String(leer) : ""));
  }
  return reihen.join("/");
}

/** Das Feld unter der Marke im Brettbild (bei Schwarz ist das Brett gedreht). */
function feldUnter(marke: { x: number; y: number }, gedreht: boolean): string {
  const spalte = Math.min(KANTE - 1, Math.max(0, Math.floor(marke.x * KANTE)));
  const zeile = Math.min(KANTE - 1, Math.max(0, Math.floor(marke.y * KANTE)));
  const linie = gedreht ? KANTE - 1 - spalte : spalte;
  const reihe = gedreht ? zeile + 1 : KANTE - zeile;
  return `${LINIEN[linie] ?? "a"}${reihe}`;
}

/** Die Aufgabe, an der der Löser gerade sitzt (bleibt über die Schritte ohne Tippbrett bekannt). */
let aktuelle: Strukturaufgabe | null = null;

/**
 * Bedient einen Schritt der offenen Strukturaufgabe. Ausgabe: true, wenn etwas getippt wurde;
 * false, wenn keine Strukturaufgabe zu erkennen ist oder nichts zu tun war (dann macht die Runde
 * mit „Weiter“ weiter). Sonderfall: Passt die Stellung zu keiner Aufgabe der Trainerdaten, tippt
 * der Löser nur „Prüfen“ (die Antwort ist dann meist falsch).
 */
export async function bedieneStruktur(lauf: Lauf): Promise<boolean> {
  aufgaben ??= (JSON.parse(readFileSync(DATEI, "utf8")) as { aufgaben: Strukturaufgabe[] })
    .aufgaben;
  texte ??= JSON.parse(readFileSync(TEXTE, "utf8")) as Record<string, string>;
  const t = (schluessel: string) => texte?.[schluessel] ?? schluessel;
  const { feldarten, schwacheBauern, starkeFelder } = await ladeRegeln();
  const sicht = await lauf.seite
    .evaluate(liesSichtImBrowser, {
      pruefen: t("trainer.pruefen"),
      bauern: t("strukturtrainer.auftrag.bauern").slice(0, 40),
    })
    .catch(() => null);
  if (!sicht) return false;
  const wurzel = lauf.seite.getByTestId("abenteuer-aufgaben");
  if (sicht.felder.length > 0) {
    const brett = brettAus(sicht.felder);
    aktuelle = aufgaben.find((a) => a.fen.split(" ")[0] === brett) ?? aktuelle;
  }
  if (sicht.felder.length > 0 && sicht.pruefen) {
    const erwartet = !aktuelle
      ? []
      : sicht.bauernschritt
        ? schwacheBauern(aktuelle)
        : (starkeFelder(aktuelle) ?? []);
    lauf.messung.log(
      `  Struktur ${aktuelle?.id ?? "unbekannt"}: ${sicht.bauernschritt ? "schwache Bauern" : "starke Felder"} ${erwartet.join(", ") || "keine"}`,
    );
    const tasten = wurzel.locator(".brett-tasten").last();
    for (const feld of erwartet) {
      await tippe(lauf, tasten.locator(`button[aria-label^='${feld}']`), `Brettfeld ${feld}`);
      await lauf.seite.waitForTimeout(120);
    }
    const pruefen = wurzel.getByRole("button", { name: t("trainer.pruefen"), exact: true });
    await tippe(lauf, pruefen, "Struktur „Prüfen“");
    await lauf.seite.waitForTimeout(400);
    return true;
  }
  if (sicht.optionen.length === 0 || !aktuelle) return false;
  const arten = feldarten(aktuelle);
  const feld = sicht.marke ? feldUnter(sicht.marke, aktuelle.seite === "b") : null;
  const art = arten.find((f) => f.feld === feld)?.art;
  const kandidaten = [
    ...(art ? [t(`strukturtrainer.feldart.${art}`)] : []),
    t(`struktur.plan.${aktuelle.plan}`),
  ];
  const antwort = kandidaten.find((k) => sicht.optionen.includes(k)) ?? sicht.optionen[0] ?? "";
  lauf.messung.log(
    `  Struktur ${aktuelle.id}: Antwort „${antwort}“ (goldenes Feld ${feld ?? "?"})`,
  );
  const knopf = wurzel
    .locator(".knopfreihe[role='group']")
    .last()
    .getByRole("button", { name: antwort, exact: true });
  await tippe(lauf, knopf, `Struktur „${antwort}“`);
  await lauf.seite.waitForTimeout(400);
  return true;
}
