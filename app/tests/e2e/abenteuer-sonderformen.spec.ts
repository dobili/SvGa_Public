/**
 * Sonderformen spielbar (Auftrag des Hauptchats, 26.11.2026; mittel-4): Nebelschach bei Theron im
 * Bayou, Entenschach bei Ray Castillo in der Prärie, Tandem am Lagerfeuer im Pinewood Camp. Je eine
 * Partie bis zum Ende im echten Spiel: Figur ansprechen, „Spielen“ wählen, in der eigenen Partie der
 * Variante (Hülle von mittel-3, Komponente aus abenteuer/varianten) den letzten Zug tippen, Ende,
 * „Weiter“ und der Satz danach in der Welt.
 * Damit der Test nicht vom Zufall der Bots abhängt, beginnt die Begegnung kurz vor dem Ende (Route
 * auf daten/begegnungen.json wie in abenteuer-varianten.spec.ts): Im Nebel und mit Ente schlägt die
 * Dame den König, im Tandem setzt sie auf Brett A matt.
 */
import { expect, test } from "@playwright/test";
import { EINLEITUNG_GESEHEN, GRUNDSTAND, starteMitStand } from "./abenteuer-affe";
import { klickeDurch } from "./abenteuer-wegsperren";
import { liesPartieImBrowser, tippeZug } from "./abenteuer-zugwahl";

const FRIST_MS = 30000;
const NACHSEHEN_MS = 250;
/** Dame schlägt den König (Nebel, Ente: kein Schach, Königsfang). */
const KOENIGSFANG = "4k3/8/8/8/8/8/4Q3/4K3 w - - 0 1";

interface Fall {
  readonly variante: string;
  readonly begegnung: string;
  readonly position: { karte: string; x: number; y: number; richtung: string };
  readonly variablen: Record<string, unknown>;
  readonly wahl: string;
  readonly fen: string;
  readonly zug: string;
  readonly danach: string;
}

const FAELLE: readonly Fall[] = [
  {
    variante: "nebel",
    begegnung: "bayou.nebelschach",
    position: { karte: "bayou.steg", x: 17, y: 21, richtung: "oben" },
    variablen: {},
    wahl: "„Spielen wir im Nebel.“",
    fen: KOENIGSFANG,
    zug: "e2e8",
    danach: "Gut gespielt",
  },
  {
    variante: "ente",
    begegnung: "wegSummitCrossroads.entenschach",
    position: { karte: "wegSummitCrossroads.praerie", x: 23, y: 96, richtung: "oben" },
    variablen: {},
    wahl: "„Spielen wir mit dem Twister.“",
    fen: KOENIGSFANG,
    zug: "e2e8",
    danach: "Twister besser gesetzt",
  },
  {
    variante: "tandem",
    begegnung: "pinewoodCamp.tandem",
    position: { karte: "pinewoodCamp.aussen", x: 28, y: 17, richtung: "oben" },
    variablen: { ankunftCampGesehen: true, lagerfeuerGesehen: true, ezraGetroffen: true },
    wahl: "„Los, zwei gegen zwei!“",
    fen: "k7/8/1K6/8/8/8/8/6Q1 w - - 0 1",
    zug: "g1g8",
    danach: "Sam springt auf",
  },
];

for (const fall of FAELLE) {
  test(`${fall.variante}: eine Partie bis zum Ende und der Satz danach`, async ({ page }) => {
    test.slow();
    await page.route("**/abenteuer/paket.json", async (r) => {
      const antwort = await r.fetch();
      const verzeichnis = (await antwort.json()) as { dateien: { pfad: string }[] };
      verzeichnis.dateien = verzeichnis.dateien.filter((d) => d.pfad !== "daten/begegnungen.json");
      return r.fulfill({ response: antwort, json: verzeichnis });
    });
    await page.route("**/abenteuer/daten/begegnungen.json", async (r) => {
      const antwort = await r.fetch();
      const daten = (await antwort.json()) as { begegnungen: Record<string, unknown>[] };
      for (const b of daten.begegnungen) {
        if (b.kennung !== fall.begegnung) continue;
        b.startstellung = { art: "fen", fen: fall.fen };
        b.farbe = "white";
      }
      return r.fulfill({ response: antwort, json: daten });
    });
    await starteMitStand(page, {
      ...GRUNDSTAND,
      position: fall.position,
      dialogvariablen: { ...EINLEITUNG_GESEHEN, ...fall.variablen },
    });
    await page.getByTestId("abenteuer-aktion").click({ timeout: 15000 });
    const los = page.getByTestId("abenteuer-deck-los");
    await klickeDurch(page, fall.wahl, los);
    await los.click();
    await expect(page.getByTestId("abenteuer-eigene-partie")).toBeVisible({ timeout: FRIST_MS });
    await expect(page.getByTestId("variante-zeile")).toContainText("Du bist am Zug", {
      timeout: FRIST_MS,
    });
    await tippeZug(page, fall.zug);
    await expect
      .poll(async () => (await page.evaluate(liesPartieImBrowser))?.ende ?? null, {
        timeout: FRIST_MS,
        intervals: [NACHSEHEN_MS],
      })
      .toBe("variante");
    expect((await page.evaluate(liesPartieImBrowser))?.sieger).toBe("white");
    await page.getByTestId("partie-zurueck-zur-stadt").click({ timeout: FRIST_MS });
    await expect(page.getByTestId("abenteuer-ergebnis")).toBeVisible({ timeout: FRIST_MS });
    expect(await klickeDurch(page)).toContain(fall.danach);
  });
}
