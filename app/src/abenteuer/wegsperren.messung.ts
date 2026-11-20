/**
 * Messlauf für die Wegsperren S15 bis S17 (docs/spiel/32_Wegsperren.md): der echte Gegner der
 * Sperre gegen einen menschlichen Bot in Lesestärke E, im Format der Begegnung und mit der
 * Schlusswertung der App.
 *
 * Warum: Die Versätze E + 260, 380, 560 waren ungeprüft (offene Rückfrage 1 in 32_Wegsperren.md).
 * Ziel des Autors: Wer in Lesestärke spielt, öffnet meist im ersten oder zweiten Versuch, aber
 * nicht geschenkt. Der Lauf zählt Sieg, Remis und Niederlage des Lesers je Sperre und E.
 *
 * Rolle im Gesamtbild: Kein Test der Prüfkette (vitest.messung.config.ts). Der Gegner entsteht
 * wie in der App: Profil aus inhalte/abenteuer/gegner.json, Stärke über
 * regeln/gegnerstaerke.ts (A = E, nicht abgelenkt), Einstellung über
 * anbindung/partiestart.ts mit Maia, Profil der Zugwahl wie ui/komponenten/partie/botzug.ts
 * (profilDerPartie, Zweig „eigene Stufe mit Stil“), Stufe je Phase höchstens eine Stufe je Zug
 * weiter. Der Leser ist ein vorgefertigter Bot der App mit gemessener Stärke nahe E (Messspieler
 * „@bot*“, Maia unter Node, wie vorratspartien.messung.ts), ohne Karten. Gewertet wird wie in
 * anbindung/useKurzform.ts: nach den Zügen des Formats und der Antwort des Gegners, Tiefe 12.
 *
 * Seit 18.11.2026 misst derselbe Lauf jede kurze Begegnung: WEGSPERRE nimmt auch die Kennung
 * einer Begegnung aus begegnungen.json (etwa „summitCity.sol“); Farbe, fremde Eröffnung und
 * Vorratsstellung löst begegnungsmessung.testhilfe.ts wie die App auf.
 *
 * Aufruf (im Ordner app/, je Zelle ein Lauf, nie mehrere zugleich):
 *   WEGSPERRE=S17 WEGSPERRE_E=1200 WEGSPERRE_PARTIEN=30 npx vitest run \
 *     --config vitest.messung.config.ts src/abenteuer/wegsperren.messung.ts
 * Weitere Umgebung: WEGSPERRE_SAAT_AB (weitere Portion; gleiche Saat ersetzt die alte Partie),
 * WEGSPERRE_ZIEL (Ordner, sonst buch/arbeit/wegsperren, nur lokal), WEGSPERRE_NAME (Zusatz im
 * Dateinamen, etwa „nachher“), WEGSPERRE_VERSATZ, WEGSPERRE_ENDSPIEL und WEGSPERRE_ZUEGE
 * (Versatz, Phasenversatz des Endspiels und Zugzahl zur Probe, ohne die Daten zu ändern).
 * Abhängigkeiten: begegnungsmessung.testhilfe.ts (Ablauf), engine/nodeEngine.testhilfe.ts,
 * engine/messung/maia-node.testhilfe.ts.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { maiaNode } from "../engine/messung/maia-node.testhilfe";
import { nodeEngine } from "../engine/nodeEngine.testhilfe";
import {
  einstellungDer,
  LESER,
  spiele,
  WURZEL,
  zeile,
  type Messpartie,
  type Probe,
} from "./begegnungsmessung.testhilfe";

const STANDARD_PARTIEN = 30;

/** Kurzname der Sperre → Kennung von Begegnung und Gegner; sonst gilt die Kennung selbst. */
const SPERREN: Readonly<Record<string, string>> = {
  S15: "wegCedarRiverton.testteam",
  S16: "wegIronwoodSilicon.testteam",
  S17: "wegDesertSummit.testteam",
};

const sperre = process.env.WEGSPERRE ?? "S15";
const lesestaerke = Number(process.env.WEGSPERRE_E ?? 1200);
const partienZahl = Number(process.env.WEGSPERRE_PARTIEN ?? STANDARD_PARTIEN);
const saatAb = Number(process.env.WEGSPERRE_SAAT_AB ?? 0);
const ohneMaia = process.env.WEGSPERRE_OHNE_MAIA === "1";
const zusatz = process.env.WEGSPERRE_NAME ? `-${process.env.WEGSPERRE_NAME}` : "";
const ordner = process.env.WEGSPERRE_ZIEL ?? join(WURZEL, "buch", "arbeit", "wegsperren");
const probe: Probe = {
  ...(process.env.WEGSPERRE_VERSATZ ? { versatz: Number(process.env.WEGSPERRE_VERSATZ) } : {}),
  ...(process.env.WEGSPERRE_ENDSPIEL ? { endspiel: Number(process.env.WEGSPERRE_ENDSPIEL) } : {}),
  ...(process.env.WEGSPERRE_ZUEGE ? { zuege: Number(process.env.WEGSPERRE_ZUEGE) } : {}),
};

describe(`Begegnung ${sperre} gegen Lesestärke ${lesestaerke}`, () => {
  const kennung = SPERREN[sperre] ?? sperre;
  const bots = LESER[lesestaerke];
  if (!bots) throw new Error(`Unbekannte Lesestärke: E = ${lesestaerke}`);
  const engine = nodeEngine();
  afterAll(() => engine.beendeEngine());

  it(`${partienZahl} Partien`, async () => {
    // WEGSPERRE_OHNE_MAIA=1: Gegner ohne Maia, wie die erste Partie, solange Maia noch lädt.
    const maia = ohneMaia ? undefined : { laufzeit: maiaNode() };
    const datei = join(ordner, `${sperre}-E${lesestaerke}${zusatz}.json`);
    const alt = existsSync(datei)
      ? (JSON.parse(readFileSync(datei, "utf8")) as { partien: Messpartie[] }).partien
      : [];
    let partien = [...alt];
    for (let n = 0; n < partienZahl; n += 1) {
      const saat = saatAb + n + 1;
      const leser = bots[(saat - 1) % bots.length] ?? "";
      const vorgabe = einstellungDer(kennung, lesestaerke, saat, probe);
      // Ohne kurzes Format: ganze Partie (Clubkampf, Story, Turnier), siehe begegnungsmessung.
      const form = vorgabe.einstellung.abenteuer?.kurzform ?? null;
      const partie = await spiele(engine, vorgabe, form, leser, maia, saat);
      partien = [...partien.filter((p) => p.saat !== saat), partie];
      mkdirSync(ordner, { recursive: true });
      const kopf = {
        sperre,
        lesestaerke,
        probe,
        stufenJePhase: vorgabe.einstellung.stufenJePhase,
        haeufigkeit: vorgabe.einstellung.haeufigkeit,
      };
      writeFileSync(datei, JSON.stringify({ ...kopf, partien }, null, 1));
    }
    console.log(zeile(sperre, lesestaerke, partien));
    expect(partien.length).toBeGreaterThanOrEqual(partienZahl);
  });
});
