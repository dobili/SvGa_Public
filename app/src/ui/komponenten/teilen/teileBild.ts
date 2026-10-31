/**
 * Bild und Link teilen (Gamifizierung P9): das SVG aus teilbild.ts auf einer Leinwand rastern,
 * als PNG an das Teilen-Menü des Geräts geben oder, wo es keins gibt, herunterladen; einen Link
 * mit Text teilen oder in die Zwischenablage legen.
 *
 * Rolle im Gesamtbild: Ohne Server: Nur was der Leser selbst antippt, verlässt das Gerät, und
 * zwar über die App seiner Wahl (Datenschutzerklärung, Abschnitt „Speicher auf deinem Gerät“).
 * Technik: SVG als blob:-Adresse in ein Bild laden (die CSP erlaubt img-src blob:), auf ein Canvas
 * zeichnen, toBlob("image/png"); dann teileDatei() oder bieteDateiAn() aus
 * bausteine/dateiAnbieten.ts. Die Werkzeuge des Browsers lassen sich für Tests ersetzen.
 * Abhängigkeiten: teilbild.ts, bausteine/dateiAnbieten.ts.
 */
import { bieteDateiAn, kannDateiTeilen, teileDatei } from "../bausteine/dateiAnbieten";
import { TEILBILD } from "./teilbild";

const PNG = "image/png";
const SVG = "image/svg+xml";

/** Was das Rastern vom Browser braucht; in Tests eine Attrappe. */
export interface Rasterwerkzeuge {
  /** Lädt ein Bild aus einer Adresse; erfüllt, sobald es gezeichnet werden kann. */
  readonly ladeBild: (adresse: string) => Promise<CanvasImageSource>;
  /** Eine Leinwand mit Zeichenfläche und PNG-Ausgabe. */
  readonly leinwand: () => HTMLCanvasElement;
  readonly adresseVon: (blob: Blob) => string;
  readonly gibFrei: (adresse: string) => void;
}

/** Die Werkzeuge des Browsers. */
const BROWSER: Rasterwerkzeuge = {
  ladeBild: (adresse) =>
    new Promise((erfuellt, abgelehnt) => {
      const bild = new Image(TEILBILD.breite, TEILBILD.hoehe);
      bild.onload = () => erfuellt(bild);
      bild.onerror = () => abgelehnt(new Error("Bild zum Teilen nicht ladbar"));
      bild.src = adresse;
    }),
  leinwand: () => document.createElement("canvas"),
  adresseVon: (blob) => URL.createObjectURL(blob),
  gibFrei: (adresse) => URL.revokeObjectURL(adresse),
};

/**
 * Rastert den SVG-Text auf 1080 × 1350 Bildpunkte und gibt ein PNG zurück.
 * Sonderfall: Ohne Zeichenfläche oder ohne PNG wirft die Funktion; der Knopf meldet es.
 */
export async function svgZuPng(svg: string, werkzeuge: Rasterwerkzeuge = BROWSER): Promise<Blob> {
  const adresse = werkzeuge.adresseVon(new Blob([svg], { type: SVG }));
  try {
    const bild = await werkzeuge.ladeBild(adresse);
    const leinwand = werkzeuge.leinwand();
    leinwand.width = TEILBILD.breite;
    leinwand.height = TEILBILD.hoehe;
    const flaeche = leinwand.getContext("2d");
    if (!flaeche) throw new Error("Keine Zeichenfläche zum Teilen");
    flaeche.drawImage(bild, 0, 0, TEILBILD.breite, TEILBILD.hoehe);
    return await new Promise<Blob>((erfuellt, abgelehnt) =>
      leinwand.toBlob(
        (png) => (png ? erfuellt(png) : abgelehnt(new Error("Kein PNG zum Teilen"))),
        PNG,
      ),
    );
  } finally {
    werkzeuge.gibFrei(adresse);
  }
}

/** Wie das Teilen ausging: geteilt, gespeichert (heruntergeladen) oder abgebrochen. */
export type Teilergebnis = "geteilt" | "gespeichert" | "abgebrochen";

/**
 * Rastert und teilt das Bild: Teilen-Menü, wenn das Gerät Bilder teilen kann, sonst Herunterladen.
 * Beispiel: am Handy → Menü mit Nachrichten, Mail …; am Rechner → Datei im Download-Ordner.
 */
export async function teileBild(svg: string, dateiname: string): Promise<Teilergebnis> {
  const png = await svgZuPng(svg);
  if (kannDateiTeilen(PNG, dateiname)) {
    return (await teileDatei(png, dateiname, PNG)) ? "geteilt" : "abgebrochen";
  }
  bieteDateiAn(png, dateiname, PNG);
  return "gespeichert";
}

/**
 * Teilt einen Link mit Text über das Teilen-Menü; ohne Menü kommen Text und Link in die
 * Zwischenablage. Ausgabe wie teileBild, „gespeichert“ heißt hier: kopiert.
 */
export async function teileLink(text: string, adresse: string): Promise<Teilergebnis> {
  if (typeof navigator.share === "function") {
    try {
      await navigator.share({ text, url: adresse });
      return "geteilt";
    } catch (fehler) {
      if (fehler instanceof DOMException && fehler.name === "AbortError") return "abgebrochen";
      throw fehler;
    }
  }
  await navigator.clipboard.writeText(`${text} ${adresse}`);
  return "gespeichert";
}
