/**
 * Regelvarianten spielbar (Auftrag des Hauptchats, 26.11.2026): je Variante eine Partie bis zum
 * Ende im echten Spiel. Die Figur ansprechen, „Spielen“ wählen, in der Spielhülle den letzten Zug
 * tippen, Ende nach den Regeln der Variante, „Weiter“ und der Satz danach in der Welt.
 * Damit der Test nicht vom Zufall des vorläufigen Gegners abhängt, beginnt die Begegnung in einer
 * Stellung kurz vor dem Ende (Route auf daten/begegnungen.json; die Datei kommt dann übers Netz,
 * weil ihre Prüfsumme im Verzeichnis des Pakets fehlt, wie im Test der Musikspuren).
 * Drei-Schach (drittes Schach), Atomschach (Explosion am König), König der Hügel (König auf e4),
 * Königsrennen (König auf h8), Räuberschach (der letzte weiße Stein muss geschlagen werden).
 */
import { expect, test } from "@playwright/test";
import { EINLEITUNG_GESEHEN, GRUNDSTAND, starteMitStand } from "./abenteuer-affe";
import { klickeDurch } from "./abenteuer-wegsperren";
import { liesPartieImBrowser, tippeZug } from "./abenteuer-zugwahl";

const FRIST_MS = 30000;
const NACHSEHEN_MS = 250;

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
    variante: "dreischach",
    begegnung: "wegPinewoodGhost.dreischach",
    position: { karte: "wegPinewoodGhost.canyonrand", x: 72, y: 16, richtung: "rechts" },
    variablen: { juniperGetroffen: true },
    wahl: "„Spielen wir.“",
    fen: "4k3/8/8/8/8/8/8/R3K3 w - - 1+3 0 1",
    zug: "a1a8",
    danach: "Drei Echos für dich",
  },
  {
    variante: "atomschach",
    begegnung: "wegSummitCrossroads.atomschach",
    position: { karte: "wegSummitCrossroads.geysirbecken", x: 17, y: 15, richtung: "oben" },
    variablen: { bellGetroffen: true, bellVorgestellt: true },
    wahl: "„Eine Partie Atomschach?“",
    fen: "rnb1kbnr/pppp1ppp/4p3/4N3/7q/8/PPPPPPPP/RNBQKB1R w KQkq - 2 3",
    zug: "e5f7",
    danach: "Bumm!",
  },
  {
    variante: "koenigDerHuegel",
    begegnung: "wegGhostCapital.koenigDerHuegel",
    position: { karte: "wegGhostCapital.leuchtturm", x: 68, y: 16, richtung: "oben" },
    variablen: { abeGetroffen: true, abeVorgestellt: true },
    wahl: "Eine Partie spielen",
    fen: "8/8/8/8/8/3K4/8/k7 w - - 0 1",
    zug: "d3e4",
    danach: "Im Hafen.",
  },
  {
    variante: "koenigsrennen",
    begegnung: "wegDesertSummit.koenigsrennen",
    position: { karte: "wegDesertSummit.diner", x: 90, y: 24, richtung: "oben" },
    variablen: { earlGetroffen: true },
    wahl: "„Ein Königsrennen?“",
    fen: "8/7K/8/8/8/8/k7/8 w - - 0 1",
    zug: "h7h8",
    danach: "Erster an der Ziellinie",
  },
  {
    variante: "raeuberschach",
    begegnung: "pinewoodCamp.raeuberschach",
    position: { karte: "pinewoodCamp.aussen", x: 24, y: 17, richtung: "oben" },
    variablen: { ezraGetroffen: true },
    wahl: "„Eine Runde Räuberschach?“",
    fen: "8/8/8/8/1k6/8/P7/8 w - - 0 1",
    zug: "a2a3",
    danach: "Alles weg und gewonnen",
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
    // Vor der Partie das Kartenfenster (Varianten ohne Karten): „Ohne Karten spielen“.
    const los = page.getByTestId("abenteuer-deck-los");
    await klickeDurch(page, fall.wahl, los);
    await los.click();
    await expect(page.getByTestId("partiestatus")).toHaveText("Du bist am Zug.", {
      timeout: FRIST_MS,
    });
    await tippeZug(page, fall.zug);
    // Ende nach den Regeln der Variante, Sieg für den Leser (Weiß).
    await expect
      .poll(async () => (await page.evaluate(liesPartieImBrowser))?.ende ?? null, {
        timeout: FRIST_MS,
        intervals: [NACHSEHEN_MS],
      })
      .toBe("variante");
    expect((await page.evaluate(liesPartieImBrowser))?.sieger).toBe("white");
    await page.getByTestId("partie-zurueck-zur-stadt").click({ timeout: FRIST_MS });
    // Erst die Ergebniskarte („Gewonnen gegen …“), dann der Dialog danach mit dem Satz der Figur.
    await expect(page.getByTestId("abenteuer-ergebnis")).toBeVisible({ timeout: FRIST_MS });
    expect(await klickeDurch(page)).toContain(fall.danach);
  });
}
