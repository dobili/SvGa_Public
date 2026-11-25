/**
 * Musik in Spuren im echten Browser (Klangplan A0.1, Auftrag des Hauptchats, 22.11.2026): Das
 * Ortsthema des Parks kommt als drei Spuren (erzeugte Testtöne statt der privaten Aufnahmen). Der
 * Tonmesser der App (`__tonmesser`, ton/tonregie.ts) meldet je Spur den Pegel, den die Mischung
 * gesetzt hat; der Test schreibt sie als Pegelprotokoll an den Bericht.
 * Geprüft: gemeinsamer Start mit Grund und Melodie am Tag, Ausdünnen nach drei vollen Schleifen
 * (Form 4 s, also nach 12 s nur der Grund, angehoben) und danach wieder voll.
 * Wackler unter Last (23.11.2026): Mit einer Form von 2 s und dem gröber werdenden Abfragetakt von
 * expect.poll kam die erste Messung manchmal erst nach drei Schleifen; der Test hielt dann die
 * ausgedünnte Mischung für den Anfang. Jetzt wird der Anfang alle 100 ms abgefragt und der erste
 * gemessene Stand geprüft, und die Form ist doppelt so lang. Die Absenkung unter
 * Dialogzeilen prüft tonspieler.spuren.test.ts.
 * Der Ton läuft stumm: Chromium ohne Lautsprecher, die App braucht nur den AudioContext.
 * Unabhängig vom privaten Paket (23.11.2026): Das ausgelieferte Paketverzeichnis lässt
 * musik/spuren.json weg, damit die Testfassung nicht an der Prüfsumme der echten Datei scheitert.
 */
import { expect, test, type Page } from "@playwright/test";
import { GRUNDSTAND, starteMitStand } from "./abenteuer-affe";

const RATE = 44100;
const FORM_S = 4;
/** Abfragetakt für den Anfang (ms): fein genug, um den Stand vor dem ersten Ausdünnen zu sehen. */
const ANFANG_TAKT = 100;
/** Testtöne je Spur (Hz), damit man sie im Protokoll unterscheiden könnte. */
const TOENE = { grund: 110, melodie: 440, zusatz: 660 } as const;
const BYTES_JE_WERT = 2;
const KANAELE = 2;
const LAUTSTAERKE = 0.2;
const HOECHSTWERT = 32767;
const WAV_KOPF = 44;

/** Eine WAV-Datei (16 Bit, Stereo) mit einem Sinuston über die ganze Form. */
function wav(hz: number): Buffer {
  const werte = RATE * FORM_S;
  const daten = werte * KANAELE * BYTES_JE_WERT;
  const b = Buffer.alloc(WAV_KOPF + daten);
  b.write("RIFF", 0);
  b.writeUInt32LE(36 + daten, 4);
  b.write("WAVEfmt ", 8);
  b.writeUInt32LE(16, 16);
  b.writeUInt16LE(1, 20);
  b.writeUInt16LE(KANAELE, 22);
  b.writeUInt32LE(RATE, 24);
  b.writeUInt32LE(RATE * KANAELE * BYTES_JE_WERT, 28);
  b.writeUInt16LE(KANAELE * BYTES_JE_WERT, 32);
  b.writeUInt16LE(16, 34);
  b.write("data", 36);
  b.writeUInt32LE(daten, 40);
  for (let i = 0; i < werte; i++) {
    const wert = Math.round(Math.sin((2 * Math.PI * hz * i) / RATE) * LAUTSTAERKE * HOECHSTWERT);
    for (let k = 0; k < KANAELE; k++) b.writeInt16LE(wert, WAV_KOPF + (i * KANAELE + k) * 2);
  }
  return b;
}

interface Messung {
  readonly musik: string | null;
  readonly spuren: { angabe: string; spuren: Record<string, number> } | null;
  readonly dialog: boolean;
}

function miss(seite: Page): Promise<Messung | null> {
  return seite.evaluate(() => {
    const messer = (globalThis as { __tonmesser?: () => unknown }).__tonmesser;
    return messer ? (messer() as Messung) : null;
  });
}

test("Ortsthema in Spuren: gemeinsamer Start, Ausdünnen nach drei Schleifen, wieder voll", async ({
  page,
}, info) => {
  test.slow();
  await page.addInitScript(() => {
    const alt = JSON.parse(localStorage.getItem("svga.einstellungen") ?? "{}") as object;
    localStorage.setItem("svga.einstellungen", JSON.stringify({ ...alt, ton: "an" }));
  });
  // Das Verzeichnis des Pakets ohne musik/spuren.json: Mit dem privaten Paket gehört die echte Datei
  // zum Grundpaket; die Testfassung unten hätte dann die falsche Prüfsumme, und das Laden schlüge
  // fehl (Befund 23.11.2026). So liest die App die Datei zur Laufzeit übers Netz, also die Route.
  await page.route("**/abenteuer/paket.json", async (r) => {
    const antwort = await r.fetch();
    const verzeichnis = (await antwort.json()) as { dateien: { pfad: string }[] };
    verzeichnis.dateien = verzeichnis.dateien.filter((d) => d.pfad !== "musik/spuren.json");
    return r.fulfill({ response: antwort, json: verzeichnis });
  });
  await page.route("**/musik/spuren.json", (r) =>
    r.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        "maple-falls": { form: RATE * FORM_S, rate: RATE, spuren: ["grund", "melodie", "zusatz"] },
      }),
    }),
  );
  // Mit privatem Paket liest Chromium die Opus-Fassung (.webm, paket/tonfassung.ts), sonst m4a.
  await page.route(/musik\/maple-falls\.(grund|melodie|zusatz)\.(m4a|webm)$/, (r) => {
    const spur = /\.(grund|melodie|zusatz)\.(m4a|webm)$/.exec(
      r.request().url(),
    )?.[1] as keyof typeof TOENE;
    return r.fulfill({ contentType: "audio/wav", body: wav(TOENE[spur]) });
  });
  await starteMitStand(page, GRUNDSTAND);
  // Eine Berührung entsperrt den Ton (wie auf dem iPhone).
  await page.locator(".abenteuer-welt canvas").click({ position: { x: 20, y: 20 } });
  const protokoll: string[] = [];
  const zeile = async () => {
    const m = await miss(page);
    protokoll.push(JSON.stringify(m?.spuren?.spuren ?? null));
    return m;
  };
  // Der erste Stand, an dem die Spuren laufen, ist der Anfang (nicht ein späterer Abruf).
  const erste: { messung: Messung | null } = { messung: null };
  await expect
    .poll(
      async () => {
        const m = await zeile();
        if (m?.spuren?.angabe) erste.messung ??= m;
        return erste.messung !== null;
      },
      { timeout: 20000, intervals: [ANFANG_TAKT] },
    )
    .toBe(true);
  expect(erste.messung?.spuren?.spuren).toEqual({ grund: 1, melodie: 1, zusatz: 0 });
  // Drei volle Schleifen zu 4 s, dann eine nur mit dem Grund (angehoben, A0.6).
  await expect
    .poll(async () => (await zeile())?.spuren?.spuren.melodie, { timeout: 30000, intervals: [250] })
    .toBe(0);
  const duenn = await zeile();
  expect(duenn?.spuren?.spuren.grund ?? 0).toBeGreaterThan(1);
  await expect
    .poll(async () => (await zeile())?.spuren?.spuren.melodie, { timeout: 15000, intervals: [250] })
    .toBe(1);
  await info.attach("pegelprotokoll", { body: protokoll.join("\n"), contentType: "text/plain" });
});
