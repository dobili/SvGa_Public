/**
 * Datenprüfung der wartenden Auftritte (orte.json `auftritt.wartet`, regeln/auftritt.ts): Jede
 * Figur, die unsichtbar in der Tür wartet, hat ein `#gehe` in Ink, das sie hereinholt, und steht als
 * Objekt auf einer Fassung ihrer Karte. Für den Clubraum (Befund des Autors, 28.11.2026: Hale und
 * {rivale} kamen nach dem Clubkampf nicht herein) dazu der Fall selbst: Erst mit dem Stand nach der
 * Partie (Nadel) hat die Karte Hale, {rivale} und Pratt; mit dem Stand von vorher fehlen alle drei.
 * Deshalb lädt die Welt erst nach dem Rückweg (usePartiestart.ts, useWeltladen.ts `bereit`).
 */
import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { kartenfassung } from "../oberwelt/kartenfassung";
import { figurennamen } from "../oberwelt/weltdaten";
import { wartendeFiguren } from "./auftritt";
import { ohneFigurenNachBedingung } from "./figurbedingung";

const INHALTE = new URL("../../../../inhalte/abenteuer/", import.meta.url);

interface Figur {
  readonly kennung: string;
  readonly wenn?: string;
  readonly auftritt?: { readonly wartet?: string; readonly von?: string };
}
interface Karte {
  readonly kennung: string;
  readonly datei: string;
  readonly zustaende?: Readonly<Record<string, string>>;
}
interface Ort {
  readonly kennung: string;
  readonly karten: readonly Karte[];
  readonly figuren: readonly Figur[];
}

const orte = (
  JSON.parse(readFileSync(new URL("orte.json", INHALTE), "utf8")) as { orte: readonly Ort[] }
).orte;
const ink = readdirSync(new URL("dialoge/de/", INHALTE))
  .filter((d) => d.endsWith(".ink"))
  .map((d) => readFileSync(new URL(`dialoge/de/${d}`, INHALTE), "utf8"))
  .join("\n");
const ladeKarte = (datei: string): object =>
  JSON.parse(readFileSync(new URL(datei, INHALTE), "utf8")) as object;
const name = (f: Figur) => f.kennung.slice(f.kennung.indexOf(".") + 1);

const wartende = orte.flatMap((o) =>
  o.figuren.filter((f) => f.auftritt?.wartet).map((f) => ({ ort: o, figur: f })),
);

describe("wartende Auftritte in den Daten", () => {
  it("es gibt sie (Hale, {rivale}, Juno, Mama in Ironwood)", () => {
    expect(wartende.map((w) => name(w.figur))).toEqual(
      expect.arrayContaining(["haleClub", "victorClub", "junoClub", "mama"]),
    );
  });

  it.each(wartende.map((w) => [name(w.figur), w] as const))(
    "%s: ein #gehe holt sie herein, und eine Fassung ihrer Karte hat ihr Objekt",
    (n, { ort }) => {
      expect(ink).toMatch(new RegExp(`#gehe:[^\\n]*\\b${n}>`));
      const dateien = ort.karten.flatMap((k) => [k.datei, ...Object.values(k.zustaende ?? {})]);
      expect(dateien.some((d) => figurennamen(ladeKarte(d)).includes(n))).toBe(true);
    },
  );
});

describe("Clubraum nach dem Clubkampf", () => {
  const ort = orte.find((o) => o.kennung === "mapleFalls");
  const raum = ort?.karten.find((k) => k.kennung === "mapleFalls.clubraum");
  const wennZu = (n: string) => ort?.figuren.find((f) => name(f) === n)?.wenn;
  const angabe = (n: string) => ort?.figuren.find((f) => name(f) === n)?.auftritt;
  const aufgebaut = (variablen: Record<string, unknown>) => {
    if (!raum) throw new Error("Clubraum fehlt in orte.json");
    const karte = ladeKarte(kartenfassung(raum, variablen).datei);
    return figurennamen(ohneFigurenNachBedingung(karte, wennZu, variablen));
  };
  const vorDerPartie = { clubBeigetreten: true, nadelMapleFalls: 0, victorGesehen: false };

  it("mit dem Stand nach der Partie: Hale und {rivale} warten in der Tür, Pratt kommt", () => {
    const namen = aufgebaut({ ...vorDerPartie, nadelMapleFalls: 1 });
    expect(namen).toEqual(expect.arrayContaining(["haleClub", "victorClub", "prattClub"]));
    const nachher = { ...vorDerPartie, nadelMapleFalls: 1 };
    expect(wartendeFiguren(namen, angabe, nachher)).toEqual(["haleClub", "victorClub"]);
  });

  it("mit dem Stand von vor der Partie fehlen alle drei (so sah es der Autor)", () => {
    const namen = aufgebaut(vorDerPartie);
    expect(namen).not.toContain("haleClub");
    expect(namen).not.toContain("victorClub");
    expect(namen).not.toContain("prattClub");
  });
});
