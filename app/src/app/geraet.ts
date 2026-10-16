/**
 * Startmodus und Gerätetyp: Läuft die App installiert oder im Browser, und auf welchem Gerät?
 *
 * Rolle im Gesamtbild: Die Startseite des Buches zeigt die Installationsanleitung passend zum
 * Gerät (Konzept 11.1); die App blendet in den Einstellungen den Verweis auf die Installation aus, wenn sie
 * schon installiert läuft.
 * Abhängigkeiten: keine.
 */

/** Gerätegruppen mit eigener Installationsanleitung (Konzept 11.1). */
export type Geraet = "iphone" | "android" | "mac-safari" | "chromium" | "anderer";

/** Läuft die App als installierte App (vom Startbildschirm)? */
export function istInstalliert(): boolean {
  const iosStandalone = (navigator as Navigator & { standalone?: boolean }).standalone === true;
  return iosStandalone || window.matchMedia("(display-mode: standalone)").matches;
}

/**
 * Bestimmt den Gerätetyp aus der Browserkennung.
 *
 * Sonderfälle: iPads melden sich wie ein Mac, haben aber einen Touchscreen; sie gelten als iPhone,
 * weil die Anleitung dieselbe ist.
 */
export function geraet(
  kennung = navigator.userAgent,
  beruehrungspunkte = navigator.maxTouchPoints,
): Geraet {
  if (/iPhone|iPad|iPod/.test(kennung) || (/Macintosh/.test(kennung) && beruehrungspunkte > 1)) {
    return "iphone";
  }
  if (/Android/.test(kennung)) return "android";
  if (/Macintosh/.test(kennung) && /Safari/.test(kennung) && !/Chrome|Chromium|Edg/.test(kennung)) {
    return "mac-safari";
  }
  return /Chrome|Chromium|Edg/.test(kennung) ? "chromium" : "anderer";
}
