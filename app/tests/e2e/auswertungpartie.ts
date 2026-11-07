/**
 * Eine fertig ausgewertete Partie für die Oberflächentests der Auswertung: gegen Derya mit den
 * Zügen der Opernpartie (1858); Werte und beste Züge sind für das Bild erfunden, damit ein
 * Fehler (8. Sc3?), ein Patzer (12. O-O-O??) und drei absichtliche Fehler der Engine vorkommen:
 * ein echter Patzer (12... Td8) und zwei Kleinigkeiten (7... De7, 9... b5 als bester Zug), die die
 * Zeitleiste seit dem 6.11.2026 nicht mehr zeigt (nur wirkliche Fehler, Wunsch des Autors).
 * Ohne Engine: Die App liest die Werte aus dem Speicher (IndexedDB).
 * Ausgelagert aus auswertungbilder.spec.ts (1.11.2026), weil auch auswertung-zeitleiste.spec.ts
 * sie braucht.
 */
import { expect, type Page } from "@playwright/test";
import { oeffneProfil } from "./hilfen";

const SANS =
  "e4 e5 Nf3 d6 d4 Bg4 dxe5 Bxf3 Qxf3 dxe5 Bc4 Nf6 Qb3 Qe7 Nc3 c6 Bg5 b5 Nxb5 cxb5 Bxb5+ Nbd7 O-O-O Rd8 Rxd7 Rxd7 Rd1 Qe6 Bxd7+ Nxd7 Qb8+ Nxb8 Rd8#".split(
    " ",
  );
const UCIS =
  "e2e4 e7e5 g1f3 d7d6 d2d4 c8g4 d4e5 g4f3 d1f3 d6e5 f1c4 g8f6 f3b3 d8e7 b1c3 c7c6 c1g5 b7b5 c3b5 c6b5 c4b5 b8d7 e1c1 a8d8 d1d7 d8d7 h1d1 e7e6 b5d7 f6d7 b3b8 d7b8 d1d8".split(
    " ",
  );
/** Wert je Stellung aus Sicht von Weiß (erfunden); Matt am Ende. */
const WERTE = [
  0.3, 0.3, 0.3, 0.3, 0.5, 0.5, 0.8, 0.8, 1.2, 1.2, 1.2, 1.2, 1.5, 1.5, 1.6, 0.2, 0.4, 0.4, 3.5,
  3.5, 3.5, 3.5, 3.6, -1.5, 4.0, 4.0, 4.0, 4.0, 6, 6, 8, 8, 10, 10,
];
/** Absichtliche Fehler der Engine: Index des Halbzuges → Fehlerart. */
const ENGINEFEHLER: Readonly<Record<number, string>> = {
  13: "drohungIgnoriert",
  17: "taktikUebersehen",
  23: "figurHaengen",
};
/**
 * Beste Züge: meist der gespielte; beim Fehler 8. Sc3? war 8. Dxb7 besser, beim Patzer 12. Lxd7+,
 * beim Patzer der Engine 12... De6.
 */
const ANDERS: Readonly<Record<number, string>> = {
  14: "b3b7",
  22: "b5d7",
  23: "e7e6",
};

export function eintrag() {
  const zuege = SANS.map((san, i) => {
    const fehler = ENGINEFEHLER[i] ?? null;
    const von = i % 2 === 0 ? "leser" : "engine";
    return { san, von, quelle: fehler ? "fehler" : von, fehler, verlust: fehler ? 1 : 0, stufe: 2 };
  });
  const beste = [...UCIS.map((u, i) => ANDERS[i] ?? u), ""];
  return {
    partie: {
      id: "p-bild",
      begonnen: "2026-10-31T10:00:00.000Z",
      einstellung: {
        startFen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        eigeneFarbe: "white",
        stufe: 2,
        stufenJePhase: { eroeffnung: 1, mittelspiel: 1, endspiel: 1 },
        uhr: null,
        ruecknahmeErlaubt: false,
        abbildung: null,
        gegner: "engine",
        bot: "derya",
        botName: "Derya",
        hilfen: { symbole: false, werkzeuge: false },
        gewertet: false,
        eroeffnung: null,
      },
      zuege,
      ruecknahmen: 0,
      uhr: null,
      ende: { art: "matt", sieger: "white" },
    },
    werte: WERTE,
    beste,
    abstaende: WERTE.map(() => 0),
    varianten: beste.map((b) => (b ? [b] : [])),
  };
}

/** Schreibt die Partien in IndexedDB; false, solange die App noch nichts gespeichert hat. */
function schreibePartien(neu: readonly unknown[]): Promise<boolean> {
  return new Promise<boolean>((fertig, fehler) => {
    const anfrage = indexedDB.open("schach-von-grund-auf");
    anfrage.onerror = () => fehler(anfrage.error);
    anfrage.onsuccess = () => {
      const db = anfrage.result;
      const bereich = db.transaction("nutzerdaten", "readwrite").objectStore("nutzerdaten");
      const lesen = bereich.get("aktuell");
      lesen.onsuccess = () => {
        const alt = lesen.result as { spiel?: Record<string, unknown> } | undefined;
        if (!alt?.spiel) {
          db.close();
          fertig(false);
          return;
        }
        const schreiben = bereich.put({ ...alt, spiel: { ...alt.spiel, partien: neu } }, "aktuell");
        schreiben.onsuccess = () => {
          db.close();
          fertig(true);
        };
        schreiben.onerror = () => fehler(schreiben.error);
      };
    };
  });
}

/** Öffnet die eingespielte Partie über das Profil. */
export async function oeffnePartie(page: Page, schema: "hell" | "dunkel"): Promise<void> {
  await page.addInitScript((farbschema) => {
    window.localStorage.setItem("svga.farbschema", farbschema);
  }, schema);
  await page.goto("/app/");
  await expect.poll(() => page.evaluate(schreibePartien, [eintrag()])).toBe(true);
  await page.reload();
  await oeffneProfil(page);
  await page
    .locator(".partienliste li.partieeintrag")
    .first()
    .locator(".partiezeile-oeffnen")
    .click();
}

/**
 * Spielt mehrere ausgewertete Partien ein (neueste zuerst) und lädt die App neu, etwa für die
 * Startseite („Muster aus deinen Partien“, seit 7.11.2026).
 */
export async function spielePartienEin(page: Page, partien: readonly unknown[]): Promise<void> {
  await page.goto("/app/");
  await expect.poll(() => page.evaluate(schreibePartien, partien)).toBe(true);
  await page.reload();
}
