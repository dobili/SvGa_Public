/**
 * Fenster mit Pflichtknopf zeigen ihren Knopf immer (Wunsch des Autors, 25.11.2026): Beim Fund
 * eines weißen Bauern war das Fenster ein Drittel hoch, das Bild unten abgeschnitten, „Weiter“
 * nur nach Rollen zu sehen, und unten standen Steuerkreuz und „Ansehen“. Gemessen wird je Fenster:
 * Der Knopf liegt ohne Rollen ganz im Bild und ist oben auf (nichts deckt ihn), Bilder sind ganz
 * zu sehen, Steuerkreuz und Aktionsknopf ruhen. Fenster: Fundbild, Großbild im Dialog,
 * Gedächtnisstellung, Vorführung, Belohnung und Ergebnis (Ergebniskarte), Tagebuchseite, Laden.
 * Die Fenster werden mit dem Aufbau ihrer Komponenten (oberwelt/*.tsx) über die echte Welt
 * gelegt, damit jede Lage in einem Lauf und mit langem Inhalt geprüft wird; Stil und Lage kommen
 * aus den echten Stildateien. 390 × 844 hoch, iPhone 15 und Pixel 7 quer.
 */
import { expect, test, type Page } from "@playwright/test";
import { EINLEITUNG_GESEHEN, GRUNDSTAND, starteMitStand } from "./abenteuer-affe";
import { foto, geraet } from "./abenteuer-quer";

/** Ein hohes und ein breites Bild (Pixelbild eines Bauern, als SVG). */
const HOCH =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="720"><rect width="240" height="720" fill="#eadcb8"/><circle cx="120" cy="200" r="70" fill="#fff" stroke="#000"/><rect x="50" y="600" width="140" height="100" fill="#fff" stroke="#000"/></svg>',
  );
const BREIT =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="900" height="300"><rect width="900" height="300" fill="#5b86c4"/></svg>',
  );
/** Ein langer Text, wie ihn eine Belohnung mit Nadel und Kipppunkt zeigt. */
const LANG = "Du hast gewonnen. ".repeat(40);

interface Fenster {
  readonly name: string;
  /** HTML des Fensters; es wird in die Welt gelegt (oder, mit `ueberBody`, an body). */
  readonly html: string;
  readonly knopf: string;
  readonly bild?: string;
  /** Im Dialog stellt die Oberwelt das Steuerkreuz gar nicht erst auf (Oberwelt.tsx). */
  readonly mitKreuz?: boolean;
}

const FENSTER: readonly Fenster[] = [
  {
    name: "fundbild",
    html: `<section class="abenteuer-ergebnis abenteuer-meldung" role="status"><img class="abenteuer-fundbild" src="${HOCH}" alt=""><p>Ein weißer Bauer aus Holz, abgegriffen. Du steckst ihn ein.</p><button type="button" class="knopf-zweit" id="pflicht">Weiter</button></section>`,
    knopf: "#pflicht",
    bild: ".abenteuer-fundbild",
  },
  {
    name: "fundbild-breit",
    html: `<section class="abenteuer-ergebnis abenteuer-meldung" role="status"><img class="abenteuer-fundbild" src="${BREIT}" alt=""><p>Eine alte Fahrkarte.</p><button type="button" class="knopf-zweit" id="pflicht">Weiter</button></section>`,
    knopf: "#pflicht",
    bild: ".abenteuer-fundbild",
  },
  {
    name: "ergebnis",
    html: `<section class="abenteuer-ergebnis" role="status"><p><strong>${LANG}</strong></p><p>${LANG}</p><button type="button" class="knopf-haupt" id="pflicht">Weiter</button></section>`,
    knopf: "#pflicht",
  },
  {
    name: "tagebuchseite",
    html: `<section class="abenteuer-ergebnis abenteuer-tagebuchseite"><p class="abenteuer-handschrift">${LANG}</p><button type="button" class="knopf-zweit" id="pflicht">Weiter</button></section>`,
    knopf: "#pflicht",
  },
  {
    name: "vorfuehrung",
    html: `<section class="abenteuer-ergebnis abenteuer-vorfuehrung" role="dialog"><p>${LANG.slice(0, 200)}</p><div style="width:min(90vw,90vh);aspect-ratio:1;background:#b89a5e"></div><p>Zug 3 von 9</p><button type="button" class="knopf-zweit" id="pflicht">Weiter</button></section>`,
    knopf: "#pflicht",
  },
  {
    name: "gedaechtnis",
    html: `<section class="abenteuer-ergebnis abenteuer-vorfuehrung" role="dialog"><p>Stell die Stellung wieder auf.</p><div style="width:min(90vw,90vh);aspect-ratio:1;background:#b89a5e"></div><p>Du hast 14 von 16 Figuren richtig.</p><button type="button" class="knopf-zweit" id="pflicht">Weiter</button></section>`,
    knopf: "#pflicht",
  },
  {
    name: "grossbild",
    html: `<section class="abenteuer-dialog" role="dialog"><figure class="abenteuer-grossansicht"><img src="${HOCH}" alt=""></figure><p class="abenteuer-dialog-text">„Erster Amerikanischer Schachkongress. New York, 1857.“ Ein Programmheft mit einem Adler auf dem Umschlag.</p><button type="button" class="abenteuer-dialog-weiter" id="pflicht">Weiter</button></section>`,
    knopf: "#pflicht",
    bild: ".abenteuer-grossansicht img",
    mitKreuz: true,
  },
  {
    name: "laden",
    html: `<section class="abenteuer-menue" role="dialog"><div class="abenteuer-menue-inhalt"><h2>Kiosk</h2><div class="abenteuer-deck">${'<button type="button" class="abenteuer-karte">Zitronenlimo · 5 Münzen</button>'.repeat(14)}</div></div><div class="abenteuer-menue-fuss"><button type="button" class="knopf-haupt" id="pflicht">Fertig</button></div></section>`,
    knopf: "#pflicht",
  },
];

/** Legt ein Fenster in die Welt und misst Knopf, Bild und Steuerkreuz. */
interface Messung {
  readonly knopfImBild: boolean;
  readonly knopfOben: boolean;
  readonly bildGanz: boolean;
  readonly kreuzSichtbar: boolean;
  readonly seiteRollt: boolean;
  /** Liegen Tagebuch- oder Menüknopf auf dem Fenster? */
  readonly knopfleisteDrauf: boolean;
}

async function miss(s: Page, f: Fenster): Promise<Messung> {
  return s.evaluate(
    ({ html, knopf, bild }) => {
      document.getElementById("knopffenster-probe")?.remove();
      const huelle = document.createElement("div");
      huelle.id = "knopffenster-probe";
      huelle.style.display = "contents";
      huelle.innerHTML = html;
      document.querySelector(".abenteuer-welt")?.append(huelle);
      return new Promise<{
        knopfImBild: boolean;
        knopfOben: boolean;
        bildGanz: boolean;
        kreuzSichtbar: boolean;
        seiteRollt: boolean;
        knopfleisteDrauf: boolean;
      }>((fertig) =>
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            const imBild = (r: DOMRect) =>
              r.top >= -0.5 &&
              r.left >= -0.5 &&
              r.bottom <= innerHeight + 0.5 &&
              r.right <= innerWidth + 0.5 &&
              r.height > 0;
            const k = document.querySelector(knopf);
            const r = k?.getBoundingClientRect();
            const oben = r
              ? document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)
              : null;
            const b = bild ? document.querySelector(bild)?.getBoundingClientRect() : null;
            const kreuz = document.querySelector(".abenteuer-steuerkreuz");
            const kreuzSichtbar = kreuz ? getComputedStyle(kreuz).visibility !== "hidden" : false;
            const fenster = huelle.firstElementChild?.getBoundingClientRect();
            const drauf = [
              ...document.querySelectorAll(".abenteuer-menueknopf, .abenteuer-tagebuchknopf"),
            ].some((e) => {
              const q = e.getBoundingClientRect();
              if (!fenster || getComputedStyle(e).visibility === "hidden" || q.width === 0)
                return false;
              return (
                q.left < fenster.right - 1 &&
                q.right > fenster.left + 1 &&
                q.top < fenster.bottom - 1 &&
                q.bottom > fenster.top + 1
              );
            });
            fertig({
              knopfImBild: !!r && imBild(r),
              knopfOben: !!oben && !!k && (oben === k || k.contains(oben)),
              bildGanz: b === undefined || b === null ? true : imBild(b) && b.height > 60,
              kreuzSichtbar,
              seiteRollt: document.scrollingElement
                ? document.scrollingElement.scrollHeight > innerHeight + 1
                : false,
              knopfleisteDrauf: drauf,
            });
          }),
        ),
      );
    },
    { html: f.html, knopf: f.knopf, bild: f.bild ?? null },
  );
}

async function pruefeAlle(s: Page): Promise<void> {
  test.slow();
  await starteMitStand(s, { ...GRUNDSTAND, dialogvariablen: EINLEITUNG_GESEHEN });
  await expect(s.getByTestId("abenteuer-steuerkreuz").or(s.locator(".abenteuer-steuerkreuz")))
    .toBeVisible({ timeout: 20000 })
    .catch(() => undefined);
  const befunde: string[] = [];
  for (const f of FENSTER) {
    const m = await miss(s, f);
    // Mit QUER_FOTOS=ORDNER ein Foto je Fenster (abenteuer-quer.ts).
    await foto(s, `knopffenster-${f.name}`, `${s.viewportSize()?.width ?? 0}`);
    const erwartet = {
      knopfImBild: true,
      knopfOben: true,
      bildGanz: true,
      kreuzSichtbar: f.mitKreuz === true ? m.kreuzSichtbar : false,
      seiteRollt: false,
      // Der Laden und das Großbild im Dialog decken den Bildschirm; die Leiste liegt dort darüber
      // oder fehlt (eigene Regeln, nicht Teil dieses Befunds).
      knopfleisteDrauf: f.name === "laden" || f.mitKreuz === true ? m.knopfleisteDrauf : false,
    };
    if (JSON.stringify(m) !== JSON.stringify(erwartet)) {
      befunde.push(`${f.name}: ${JSON.stringify(m)}`);
    }
  }
  expect(befunde).toEqual([]);
}

test("hoch 390 × 844: Pflichtknöpfe ohne Rollen sichtbar", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await pruefeAlle(page);
});

for (const [name, g] of [
  ["iPhone 15 quer", geraet("iPhone 15 landscape")],
  ["Pixel 7 quer", geraet("Pixel 7 landscape")],
] as const) {
  test.describe(name, () => {
    test.use(g);
    test("quer: Pflichtknöpfe ohne Rollen sichtbar", async ({ page }) => {
      await pruefeAlle(page);
    });
  });
}
