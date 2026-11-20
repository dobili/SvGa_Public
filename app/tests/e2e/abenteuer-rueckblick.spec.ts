/**
 * „Was bisher geschah“ im Tagebuch (regeln/rueckblick.ts, 20.11.2026): Nach Akt 1 und der ersten
 * Quest in Riverton steht eine Zusammenfassung von Akt 1 und ein Satz zu Akt 2 bis jetzt im
 * Tagebuch; aus späteren Akten nichts.
 */
import { expect, test } from "@playwright/test";
import { EINLEITUNG_GESEHEN, GRUNDSTAND, starteMitStand } from "./abenteuer-affe";

/** Erledigte Quest; die Minute legt die Reihenfolge der Erledigung fest. */
function fertig(kennung: string, minute: number) {
  const am = new Date(Date.UTC(2026, 10, 20, 10, minute)).toISOString();
  return { kennung, schritt: 1, erledigt: true, angenommen: am, erledigtAm: am };
}

const AKT1 = [
  "mapleFalls.einzug",
  "mapleFalls.dasBrett",
  "mapleFalls.ersterAbend",
  "mapleFalls.viertesBrett",
  "mapleFalls.besserWerden",
  "cedarCreek.archiv1858",
  "cedarCreek.clubkampf",
];

const STAND = {
  ...GRUNDSTAND,
  quests: [...AKT1.map((k, i) => fertig(k, i)), fertig("riverton.parkclub", 30)],
  dialogvariablen: { ...EINLEITUNG_GESEHEN },
};

test("Tagebuch: Was bisher geschah nach Akt 1 und Riverton", async ({ page }) => {
  test.slow();
  await starteMitStand(page, STAND);
  await page.getByTestId("abenteuer-tagebuchknopf").click();
  const rueckblick = page.getByTestId("abenteuer-rueckblick");
  await expect(rueckblick).toContainText("Was bisher geschah");
  await expect(page.getByTestId("abenteuer-rueckblick-akt1")).toContainText(
    "auf dem Dachboden habe ich Ambrose geweckt",
  );
  await expect(page.getByTestId("abenteuer-rueckblick-akt2")).toContainText("Akt 2, bis jetzt");
  await expect(page.getByTestId("abenteuer-rueckblick-akt2")).toContainText("Pavillon");
  await expect(page.getByTestId("abenteuer-rueckblick-akt3")).toHaveCount(0);
});
