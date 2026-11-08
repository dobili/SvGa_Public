/**
 * Tests von „App weitergeben“: Adresse der Installationsseite, WhatsApp- und Mail-Links mit
 * richtig kodiertem Text, Teilen-Menü mit Titel, Text und Adresse, Kopieren nur der Adresse,
 * Pfad des QR-Bildes mit Ruhezone.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  kannTeilen,
  kopiereAdresse,
  mailLink,
  nachricht,
  teileApp,
  WEITERGABE_ADRESSE,
  whatsappLink,
  type Weitergabe,
} from "./appweitergeben";
import { erzeugeQrCode, qrPfad } from "./qr/qrcode";

const ANGABE: Weitergabe = {
  betreff: "Schach von Grund auf – die App",
  text: "Lern Schach mit mir! Die App zum Buch „Schach von Grund auf“:",
  adresse: WEITERGABE_ADRESSE,
};

afterEach(() => vi.unstubAllGlobals());

describe("Links zum Weitergeben", () => {
  it("führt Neulinge auf die Installationsseite", () => {
    expect(WEITERGABE_ADRESSE).toBe("https://schach-von-grund-auf.com/installieren/");
  });

  it("WhatsApp: wa.me mit Satz und Adresse in einem kodierten Text", () => {
    const link = whatsappLink(ANGABE);
    expect(link.startsWith("https://wa.me/?text=")).toBe(true);
    const text = new URL(link).searchParams.get("text");
    expect(text).toBe(nachricht(ANGABE));
    expect(text?.endsWith(" https://schach-von-grund-auf.com/installieren/")).toBe(true);
    expect(link).not.toContain(" ");
    expect(link).toContain("%E2%80%9E"); // „ als UTF-8
  });

  it("E-Mail: mailto ohne Empfänger, mit Betreff und Text", () => {
    const link = mailLink(ANGABE);
    expect(link.startsWith("mailto:?subject=")).toBe(true);
    const werte = new URLSearchParams(link.slice("mailto:?".length));
    expect(werte.get("subject")).toBe(ANGABE.betreff);
    expect(werte.get("body")).toBe(nachricht(ANGABE));
  });
});

describe("Teilen und Kopieren", () => {
  it("gibt dem Teilen-Menü Titel, Text und Adresse", async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { share });
    expect(kannTeilen()).toBe(true);
    await expect(teileApp(ANGABE)).resolves.toBe("geteilt");
    expect(share).toHaveBeenCalledWith({
      title: ANGABE.betreff,
      text: ANGABE.text,
      url: WEITERGABE_ADRESSE,
    });
  });

  it("Schließen des Menüs ist kein Fehler, andere Fehler gehen weiter", async () => {
    const abbruch = new DOMException("abgebrochen", "AbortError");
    vi.stubGlobal("navigator", { share: vi.fn().mockRejectedValue(abbruch) });
    await expect(teileApp(ANGABE)).resolves.toBe("abgebrochen");
    vi.stubGlobal("navigator", { share: vi.fn().mockRejectedValue(new Error("verboten")) });
    await expect(teileApp(ANGABE)).rejects.toThrow("verboten");
  });

  it("ohne Teilen-Menü: kannTeilen ist falsch", () => {
    vi.stubGlobal("navigator", {});
    expect(kannTeilen()).toBe(false);
  });

  it("kopiert nur die Adresse; ohne Zwischenablage ein Fehler", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    await kopiereAdresse(WEITERGABE_ADRESSE);
    expect(writeText).toHaveBeenCalledWith(WEITERGABE_ADRESSE);
    vi.stubGlobal("navigator", {});
    await expect(kopiereAdresse(WEITERGABE_ADRESSE)).rejects.toThrow("Zwischenablage");
  });
});

describe("Bild des QR-Codes", () => {
  it("ein Quadrat je dunklem Modul, um die Ruhezone von 4 verschoben", () => {
    const code = erzeugeQrCode(WEITERGABE_ADRESSE);
    const pfad = qrPfad(code);
    const dunkle = code.module.flat().filter(Boolean).length;
    expect(pfad.match(/M/g)).toHaveLength(dunkle);
    expect(pfad.startsWith("M4 4h1v1h-1z")).toBe(true); // Ecke des Suchmusters oben links
  });
});
