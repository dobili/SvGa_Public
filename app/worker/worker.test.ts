/**
 * Tests des Workers (R57): Meldungen, Prüfberichte, Zugang zum Dashboard, Verlauf, Wochentext.
 */
import { describe, expect, it } from "vitest";
import worker from "./index";
import { pruefeMeldung, MELDUNGEN_JE_STUNDE } from "./meldungen";
import { verlaufJePunkt, type Bericht, type Pruefpunkt } from "./bericht";
import { testausfuehrung, testumgebung } from "./testhilfe";
import { pruefeZeichen, setzeSchluessel } from "./zugang";
import { wochentext } from "./woche";
import type { Umgebung } from "./umgebung";

const SEITE = "https://schach-von-grund-auf.com";
const TEAM = "beispiel.cloudflareaccess.com";
const AUD = "aud-des-dashboards";
const STUNDE_S = 3600;
const SCHLUESSEL = "geheimer-testschluessel";

function anfrage(pfad: string, init: RequestInit = {}): Request {
  return new Request(`${SEITE}${pfad}`, init);
}

async function rufe(env: Umgebung, a: Request): Promise<Response> {
  return worker.fetch(a, env, testausfuehrung());
}

const melde = (env: Umgebung, daten: unknown, ip = "1.2.3.4") =>
  rufe(
    env,
    anfrage("/api/melden", {
      method: "POST",
      body: JSON.stringify(daten),
      headers: { "CF-Connecting-IP": ip },
    }),
  );

describe("Meldungen", () => {
  it("prüft Art, Text und Längen", () => {
    expect(pruefeMeldung({ art: "buch", text: " Pfeil falsch ", abbildung: "3.12" })).toMatchObject(
      {
        art: "buch",
        text: "Pfeil falsch",
        abbildung: "3.12",
        version: null,
      },
    );
    expect(pruefeMeldung({ art: "spam", text: "x" })).toBeNull();
    expect(pruefeMeldung({ art: "fehler", text: "   " })).toBeNull();
    expect(pruefeMeldung({ art: "fehler", text: "x", version: 3 })).toBeNull();
    expect(pruefeMeldung({ art: "fehler", text: "x".repeat(5000) })).toBeNull();
  });

  it("speichert eine Meldung und drosselt nach wenigen je Stunde", async () => {
    const env = testumgebung();
    const erste = await melde(env, {
      art: "fehler",
      text: "Brett bleibt leer",
      version: "0.2.124",
    });
    expect(erste.status).toBe(200);
    expect(await erste.json()).toEqual({ ok: true, nummer: 1 });
    for (let i = 1; i < MELDUNGEN_JE_STUNDE; i++) {
      expect((await melde(env, { art: "wunsch", text: `Wunsch ${i}` })).status).toBe(200);
    }
    expect((await melde(env, { art: "wunsch", text: "noch einer" })).status).toBe(429);
    expect((await melde(env, { art: "wunsch", text: "anderer Absender" }, "5.6.7.8")).status).toBe(
      200,
    );
  });

  it("lehnt ungültige Meldungen, falsche Methoden und fehlenden Turnstile-Nachweis ab", async () => {
    const env = testumgebung({ TURNSTILE_SECRET: "geheim" });
    expect((await melde(env, { art: "fehler" })).status).toBe(400);
    expect((await rufe(env, anfrage("/api/melden"))).status).toBe(405);
    expect((await melde(env, { art: "fehler", text: "ohne Nachweis" })).status).toBe(403);
  });
});

const punkt = (id: string, ampel: Pruefpunkt["ampel"]): Pruefpunkt => ({
  id,
  gruppe: "Links",
  titel: id,
  ampel,
  text: "",
});

describe("Prüfberichte", () => {
  const bericht = { zeit: "2026-10-24T06:00:00Z", stand: "abc", punkte: [punkt("links", "rot")] };
  const sende = (env: Umgebung, schluessel: string, daten: unknown = bericht) =>
    rufe(
      env,
      anfrage("/api/bericht", {
        method: "POST",
        body: JSON.stringify(daten),
        headers: { Authorization: `Bearer ${schluessel}` },
      }),
    );

  it("nimmt nur mit dem richtigen Schlüssel an", async () => {
    expect((await sende(testumgebung(), SCHLUESSEL)).status).toBe(503);
    const env = testumgebung({ BERICHT_SCHLUESSEL: SCHLUESSEL });
    expect((await sende(env, "falsch")).status).toBe(401);
    expect((await sende(env, SCHLUESSEL, { punkte: [] })).status).toBe(400);
    expect((await sende(env, SCHLUESSEL)).status).toBe(200);
    const zeile = await env.ADMIN_DB.prepare("SELECT rot, gelb FROM berichte").first();
    expect(zeile).toEqual({ rot: 1, gelb: 0 });
  });

  it("Verlauf: seit wann gleiche Ampel, wann zuletzt grün", () => {
    const b = (zeit: string, ampel: Pruefpunkt["ampel"]): Bericht => ({
      zeit,
      stand: null,
      lauf: null,
      punkte: [punkt("links", ampel)],
    });
    const verlauf = verlaufJePunkt([
      b("24.", "rot"),
      b("17.", "rot"),
      b("10.", "rot"),
      b("3.", "gruen"),
    ]);
    expect(verlauf[0]).toMatchObject({ seit: "10.", zuletztGruen: "3." });
    expect(verlaufJePunkt([b("24.", "gruen"), b("17.", "rot")])[0]).toMatchObject({
      seit: "24.",
      zuletztGruen: "24.",
    });
    expect(verlaufJePunkt([])).toEqual([]);
  });
});

/** Erzeugt ein Schlüsselpaar wie Access und ein Zeichen mit den gewünschten Angaben. */
async function zeichenMit(angaben: Record<string, unknown>): Promise<string> {
  const verfahren = {
    name: "RSASSA-PKCS1-v1_5",
    hash: "SHA-256",
    modulusLength: 2048,
    publicExponent: new Uint8Array([1, 0, 1]),
  };
  const paar = (await crypto.subtle.generateKey(verfahren, true, [
    "sign",
    "verify",
  ])) as CryptoKeyPair;
  const jwk = await crypto.subtle.exportKey("jwk", paar.publicKey);
  setzeSchluessel(TEAM, [{ ...jwk, kid: "k1" }], Date.now() + STUNDE_S * 1000);
  const b64 = (bytes: Uint8Array) =>
    Buffer.from(bytes)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  const teil = (o: unknown) => b64(new TextEncoder().encode(JSON.stringify(o)));
  const inhalt = `${teil({ alg: "RS256", kid: "k1" })}.${teil(angaben)}`;
  const unterschrift = await crypto.subtle.sign(
    verfahren,
    paar.privateKey,
    new TextEncoder().encode(inhalt),
  );
  return `${inhalt}.${b64(new Uint8Array(unterschrift))}`;
}

const jetztS = () => Math.floor(Date.now() / 1000);
const gueltig = () => ({
  aud: [AUD],
  iss: `https://${TEAM}`,
  exp: jetztS() + STUNDE_S,
  email: "autor@example.org",
});

describe("Zugang zum Dashboard", () => {
  it("prüft Unterschrift, Zielgruppe und Ablauf", async () => {
    expect(await pruefeZeichen(await zeichenMit(gueltig()), TEAM, AUD, Date.now())).toMatchObject({
      email: "autor@example.org",
    });
    expect(
      await pruefeZeichen(
        await zeichenMit({ ...gueltig(), aud: ["fremd"] }),
        TEAM,
        AUD,
        Date.now(),
      ),
    ).toBeNull();
    const abgelaufen = { ...gueltig(), exp: jetztS() - STUNDE_S };
    expect(await pruefeZeichen(await zeichenMit(abgelaufen), TEAM, AUD, Date.now())).toBeNull();
    const echt = await zeichenMit(gueltig());
    const verfaelscht = echt.slice(0, -4) + (echt.endsWith("AAAA") ? "BBBB" : "AAAA");
    expect(await pruefeZeichen(verfaelscht, TEAM, AUD, Date.now())).toBeNull();
  });

  it("ohne Zeichen oder ohne Einrichtung kein Zugang, mit Zeichen Übersicht und Status", async () => {
    const ohne = testumgebung();
    expect((await rufe(ohne, anfrage("/admin/"))).status).toBe(403);
    const env = testumgebung({ ACCESS_TEAM: TEAM, ACCESS_AUD: AUD });
    expect((await rufe(env, anfrage("/api/admin/uebersicht"))).status).toBe(403);
    const kopf = { "Cf-Access-Jwt-Assertion": await zeichenMit(gueltig()) };
    expect((await rufe(env, anfrage("/admin/", { headers: kopf }))).status).toBe(200);
    await melde(env, { art: "buch", text: "Pfeil", abbildung: "1.2" });
    const uebersicht = (await (
      await rufe(env, anfrage("/api/admin/uebersicht", { headers: kopf }))
    ).json()) as {
      wer: string;
      zahlen: unknown[];
    };
    expect(uebersicht.wer).toBe("autor@example.org");
    expect(uebersicht.zahlen).toEqual([{ status: "neu", art: "buch", anzahl: 1 }]);
    const aendern = (daten: unknown) =>
      rufe(
        env,
        anfrage("/api/admin/meldungen/1", {
          method: "POST",
          headers: kopf,
          body: JSON.stringify(daten),
        }),
      );
    expect((await aendern({ status: "quatsch" })).status).toBe(400);
    expect((await aendern({ status: "doppelt" })).status).toBe(400);
    expect((await aendern({ status: "erledigt", notiz: "in 0.2.125" })).status).toBe(200);
    const liste = (await (
      await rufe(env, anfrage("/api/admin/meldungen?status=erledigt", { headers: kopf }))
    ).json()) as {
      meldungen: { notiz: string }[];
    };
    expect(liste.meldungen[0]?.notiz).toBe("in 0.2.125");
  });

  it("andere Pfade gehen unverändert an die Dateien", async () => {
    const antwort = await rufe(testumgebung(), anfrage("/app/"));
    expect(await antwort.text()).toBe("Datei");
    expect((await rufe(testumgebung(), anfrage("/api/gibtsnicht"))).status).toBe(404);
  });
});

describe("Wochenübersicht", () => {
  it("nennt Zahlen und auffällige Punkte", () => {
    const text = wochentext(2, 5, {
      zeit: "2026-10-26T06:17:00Z",
      stand: null,
      lauf: null,
      punkte: [punkt("links", "rot"), punkt("audit", "gelb"), punkt("live", "gruen")],
    });
    expect(text).toContain("Neue Meldungen in dieser Woche: 2");
    expect(text).toContain("1 rot, 1 gelb");
    expect(text).toContain("ROT: links");
    expect(text).not.toContain("live");
  });
});
