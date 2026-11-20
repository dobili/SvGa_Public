/**
 * Bedienung für die Ausdauerprüfung (abenteuer-ausdauer.spec.ts): starten mit Ton, Fenster und
 * Dialoge wegklicken wie ein Spieler, reisen, ansprechen, eine Übungspartie spielen.
 *
 * Warum eine eigene Datei: Die Prüfung blieb so unter 400 Zeilen (Regel 4). Die Knöpfe werden
 * über Rollen und Kennungen gefunden wie in den übrigen Oberflächentests.
 */
import { expect, type Page } from "@playwright/test";
import { starteMitStand } from "./abenteuer-affe";

/** So lange darf der Gegner für einen Zug rechnen (ms). */
const ENGINE_FRIST = 30_000;
/** So viele Klicks darf das Aufräumen bis zur freien Welt brauchen (lange Runde: 25 × 3). */
const AUFRAEUMEN_HOECHSTENS = 200;

/** Schaltet den Ton der App in den Einstellungen an; läuft im Browser. */
function schalteTonAn(): Promise<boolean> {
  return new Promise<boolean>((fertig, fehler) => {
    const anfrage = indexedDB.open("schach-von-grund-auf");
    anfrage.onerror = () => fehler(anfrage.error);
    anfrage.onsuccess = () => {
      const db = anfrage.result;
      const bereich = db.transaction("nutzerdaten", "readwrite").objectStore("nutzerdaten");
      const lesen = bereich.get("aktuell");
      lesen.onsuccess = () => {
        const alt = lesen.result as Record<string, unknown> | undefined;
        if (!alt) {
          db.close();
          fertig(false);
          return;
        }
        const einstellungen = { ...(alt.einstellungen as object), ton: "an" };
        const schreiben = bereich.put({ ...alt, einstellungen }, "aktuell");
        schreiben.onsuccess = () => {
          db.close();
          fertig(true);
        };
        schreiben.onerror = () => fehler(schreiben.error);
      };
    };
  });
}

/** Startet mit dem Spielstand, Ton an wie beim Autor (sonst lädt keine Musik). */
export async function starteMitTon(seite: Page, stand: object): Promise<void> {
  await starteMitStand(seite, stand);
  await expect.poll(() => seite.evaluate(schalteTonAn)).toBe(true);
  await seite.reload();
  await seite.goto("/app/#abenteuer");
  await expect(seite.locator(".abenteuer-welt canvas")).toBeVisible({ timeout: 40000 });
  // Eine Berührung entsperrt den Ton wie am Handy.
  await seite
    .getByTestId("abenteuer-welt")
    .click({ position: { x: 5, y: 5 } })
    .catch(() => undefined);
}

/** Klickt sichtbare Knöpfe weg, bis die Welt frei ist; Ausgabe: 1, wenn dabei ein Dialog lief. */
export async function raeumeAuf(seite: Page): Promise<number> {
  let dialoge = 0;
  for (let i = 0; i < AUFRAEUMEN_HOECHSTENS; i++) {
    if (await weltFrei(seite)) return dialoge;
    // Ein Gespräch zählt einmal, auch wenn es zwischen den Zeilen kurz zugeht.
    if (
      await seite
        .getByTestId("abenteuer-dialog")
        .isVisible()
        .catch(() => false)
    )
      dialoge = 1;
    const kandidaten = [
      seite.getByRole("button", { name: "Bestehen" }),
      seite.locator(".abenteuer-dialog-wahlen button").first(),
      seite.locator(".abenteuer-dialog-weiter"),
      seite.getByRole("button", { name: /^(Weiter|Auswerten|Nächste Aufgabe|Zurück in die Welt)/ }),
      seite.getByTestId("abenteuer-meldung").getByRole("button"),
      // Laden, Reisen und andere Fenster: schließen wie ein Spieler.
      seite.getByRole("button", { name: /^(Schließen|Zurück|Weiterspielen|Fertig)$/ }),
    ];
    let gedrueckt = false;
    for (const k of kandidaten) {
      const letzter = k.last();
      if (!(await letzter.isVisible().catch(() => false))) continue;
      gedrueckt = await letzter.click({ timeout: 1500 }).then(
        () => true,
        () => false,
      );
      if (gedrueckt) break;
    }
    await seite.waitForTimeout(gedrueckt ? 120 : 150);
  }
  return dialoge;
}

/** Die Welt ist frei: Steuerkreuz da, kein Fenster, keine Meldung darüber. */
async function weltFrei(seite: Page): Promise<boolean> {
  return seite.evaluate(
    () =>
      document.querySelector(".abenteuer-steuerkreuz button") !== null &&
      document.querySelector(
        "[data-testid='abenteuer-dialog'], .abenteuer-menue, [data-testid='abenteuer-meldung'], .abenteuer-ergebnis, [data-testid='abenteuer-aufgaben'], [data-testid='partie']",
      ) === null,
  );
}

/** Reist in die nächste Stadt der Liste; Ausgabe: ob die Karte wechselte. */
export async function reise(seite: Page, nummer: number): Promise<boolean> {
  const knopf = seite.getByTestId("abenteuer-reisenknopf");
  if (!(await knopf.isVisible().catch(() => false))) return false;
  await knopf.click();
  const ziele = seite.getByTestId("abenteuer-reisen").locator(".abenteuer-karte");
  await expect(ziele.first()).toBeVisible();
  const anzahl = await ziele.count();
  await ziele.nth(nummer % anzahl).click();
  await expect(seite.getByTestId("abenteuer-reisen")).toHaveCount(0);
  await expect(seite.locator(".abenteuer-welt canvas")).toHaveCount(1, { timeout: 20000 });
  await seite.waitForTimeout(400);
  return true;
}

/** Spricht an, was vor dem Helden steht, falls etwas da ist; Ausgabe: Zahl der Dialoge. */
export async function sprichAn(seite: Page): Promise<number> {
  const aktion = seite.getByTestId("abenteuer-aktion");
  if (!(await aktion.isVisible().catch(() => false))) return 0;
  await aktion.click().catch(() => undefined);
  await seite.waitForTimeout(300);
  return raeumeAuf(seite);
}

/** Übungspartie: drei Bauernzüge, je auf die Antwort warten, aufgeben, zurück in die Welt. */
export async function spielePartie(seite: Page): Promise<boolean> {
  const brett = seite.getByTestId("abenteuer-reisebrettknopf");
  if (!(await brett.isVisible().catch(() => false))) return false;
  await brett.click();
  await seite.getByTestId("abenteuer-deck-los").click();
  await expect(seite.getByTestId("partie")).toBeVisible({ timeout: 30000 });
  await expect(seite.getByTestId("partiestatus")).toHaveText("Du bist am Zug.", {
    timeout: ENGINE_FRIST,
  });
  // Randbauern statt 1.e4: Die ersten Antworten kämen sonst aus dem Eröffnungsbuch, und die
  // Engine (Worker) liefe nie (Ausdauer, 20.11.2026).
  const weiss = await seite.getByRole("button", { name: /^e2, Bauer \(Weiß\)/ }).isVisible();
  const zuege = weiss
    ? [
        ["a2", "a3"],
        ["h2", "h3"],
        ["a3", "a4"],
      ]
    : [
        ["a7", "a6"],
        ["h7", "h6"],
        ["a6", "a5"],
      ];
  for (const [von, nach] of zuege) {
    await seite.getByRole("button", { name: new RegExp(`^${von ?? ""}, Bauer`) }).click();
    await seite.getByRole("button", { name: nach ?? "", exact: true }).click();
    await expect(seite.getByTestId("partiestatus")).toHaveText("Du bist am Zug.", {
      timeout: ENGINE_FRIST,
    });
  }
  await seite.getByTestId("abenteuer-partie-aufgeben").click();
  await seite.getByRole("button", { name: "Ja, aufgeben" }).click();
  await seite.getByTestId("partie-zurueck-zur-stadt").click();
  await raeumeAuf(seite);
  return true;
}
