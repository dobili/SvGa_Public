/**
 * Oberflächentest des Dashboards /admin/ (R57) mit nachgebildeten Schnittstellen: Im Test gibt es
 * weder Worker noch Cloudflare Access, deshalb beantwortet Playwright /api/admin/* selbst.
 */
import { expect, test, type Page } from "@playwright/test";

const UEBERSICHT = {
  wer: "autor@example.org",
  neuesterBericht: {
    zeit: "2026-10-24T06:17:00Z",
    stand: "abc1234",
    lauf: "https://github.com/dobili/SvGa_Public/actions/runs/1",
    punkte: [
      {
        id: "live",
        gruppe: "Live",
        titel: "Version",
        ampel: "gruen",
        text: "",
        seit: "2026-10-01T00:00:00Z",
        zuletztGruen: "2026-10-24T06:17:00Z",
      },
      {
        id: "links",
        gruppe: "Links",
        titel: "Glossar",
        ampel: "rot",
        text: "404: example.org",
        seit: "2026-10-17T06:17:00Z",
        zuletztGruen: "2026-10-10T06:17:00Z",
      },
    ],
  },
  laeufe: [{ zeit: "2026-10-24T06:17:00Z", stand: "abc1234", lauf: null, rot: 1, gelb: 0 }],
  zahlen: [{ status: "neu", art: "buch", anzahl: 1 }],
  eingerichtet: { mail: false, turnstile: true, bericht: true },
};

const MELDUNG = {
  id: 3,
  zeit: "2026-10-24T09:00:00Z",
  art: "buch",
  text: "Pfeil zeigt auf e5 statt e4",
  version: "0.2.124",
  geraet: "iPhone",
  bildschirm: "390×844",
  sprache: "de",
  stellung: "8/8/8/8/8/8/8/K6k w - - 0 1",
  abbildung: "3.12",
  seite: null,
  status: "neu",
  doppelt_von: null,
  notiz: null,
};

async function bildeNach(page: Page, aenderungen: unknown[]) {
  await page.route("**/api/admin/uebersicht", (route) => route.fulfill({ json: UEBERSICHT }));
  await page.route("**/api/admin/meldungen**", (route) =>
    route.fulfill({ json: { meldungen: [MELDUNG] } }),
  );
  await page.route("**/api/admin/meldungen/3", (route) => {
    aenderungen.push(route.request().postDataJSON());
    return route.fulfill({ json: { ok: true } });
  });
}

test("Dashboard: Ampel, Meldung bearbeiten, Aufgabe für Claude", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]).catch(() => undefined);
  const aenderungen: unknown[] = [];
  await bildeNach(page, aenderungen);
  await page.goto("/admin/");
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  await expect(page.getByText("Angemeldet als autor@example.org")).toBeVisible();
  await expect(page.getByTestId("punkt-links")).toContainText("404: example.org");
  await expect(page.getByTestId("punkt-live")).toBeHidden();
  const meldung = page.getByTestId("meldung-3");
  await expect(meldung).toContainText("Buchbefund");
  await expect(meldung).toContainText("3.12");
  await meldung.getByLabel("Status").selectOption("erledigt");
  await meldung.getByLabel("Notiz").fill("in 0.2.125");
  await meldung.getByRole("button", { name: "Speichern" }).click();
  await expect(meldung.getByRole("status")).toHaveText("Gespeichert.");
  expect(aenderungen).toEqual([{ status: "erledigt", notiz: "in 0.2.125" }]);
  await page.getByRole("button", { name: "Aufgabe für Claude" }).click();
  const auftrag = page.getByRole("textbox", { name: "Aufgabe für Claude" });
  await expect(auftrag).toHaveValue(/ROT – Links: Glossar/);
  await expect(auftrag).toHaveValue(/Nr\. 3, Buchbefund/);
  await page.screenshot({ path: "test-results/bilder/admin.png", fullPage: true });
});

test("Dashboard ohne Zugang: verständlicher Hinweis", async ({ page }) => {
  await page.route("**/api/admin/**", (route) =>
    route.fulfill({ status: 403, body: "Kein Zugang" }),
  );
  await page.goto("/admin/");
  await expect(page.getByText(/Kein Zugang\. Bitte über/)).toBeVisible();
});

test("Dashboard: Wiki mit Bereichen, Suche und Seite (Paket D)", async ({ page }) => {
  await bildeNach(page, []);
  const liste = [
    { pfad: "projekt/arbeitsregeln", bereich: "projekt", titel: "Arbeitsregeln (CLAUDE.md)" },
    { pfad: "code/module-spiel", bereich: "code", titel: "Module: spiel" },
  ].map((s) => ({
    ...s,
    quelle: "CLAUDE.md",
    laenge: 10,
    stand: null,
    zeit: "2026-10-30T12:00:00Z",
  }));
  await page.route("**/api/admin/wiki", (route) => route.fulfill({ json: { seiten: liste } }));
  await page.route("**/api/admin/wiki/suche**", (route) =>
    route.fulfill({
      json: {
        treffer: [{ ...liste[0], ausschnitt: "… Tests vor jedem Speichern …" }],
      },
    }),
  );
  await page.route("**/api/admin/wiki/seite**", (route) =>
    route.fulfill({
      json: {
        seite: {
          ...liste[0],
          inhalt: "## Feste Regeln\n\n- **Tests** vor jedem Speichern\n\n<script>alert(1)</script>",
        },
      },
    }),
  );
  await page.goto("/admin/");
  await page.getByRole("button", { name: "Wiki" }).click();
  const wiki = page.getByTestId("wiki");
  await expect(wiki.getByRole("button", { name: "Arbeitsregeln (CLAUDE.md)" })).toBeVisible();
  await wiki.getByRole("button", { name: "Code", exact: true }).click();
  await expect(wiki.getByRole("button", { name: "Module: spiel" })).toBeVisible();
  await wiki.getByLabel("Im Wiki suchen").fill("Speichern");
  await wiki.getByRole("button", { name: "Suchen" }).click();
  await wiki.getByRole("button", { name: /Arbeitsregeln.*Tests vor jedem/ }).click();
  const seite = page.getByTestId("wiki-seite");
  await expect(seite.getByRole("heading", { name: "Feste Regeln" })).toBeVisible();
  await expect(seite.locator("strong", { hasText: "Tests" })).toBeVisible();
  // HTML in Seiten bleibt Text (kein eingeschleuster Code)
  await expect(seite).toContainText("<script>alert(1)</script>");
  await expect(seite.locator("script")).toHaveCount(0);
});
