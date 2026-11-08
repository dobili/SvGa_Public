/**
 * Ein QR-Code als SVG-Bild (für „App weitergeben“), auf dem Gerät erzeugt.
 *
 * Rolle im Gesamtbild: Ein Freund scannt die Adresse vom Bildschirm ab. Immer dunkel auf Weiß
 * mit der Ruhezone von vier Modulen, die die Norm verlangt, auch im dunklen Farbschema: Viele
 * Scanner lesen helle Module auf dunklem Grund nicht. Ein einziger Pfad statt einzelner
 * Rechtecke hält das Bild klein; `crispEdges` verhindert Kantenglättung zwischen den Modulen.
 * Abhängigkeiten: qr/qrcode.ts.
 */
import { useMemo } from "react";
import { erzeugeQrCode, qrPfad, RUHEZONE } from "./qr/qrcode";

/** Das Bild. Beispiel: <QrBild inhalt="https://…/installieren/" beschriftung="QR-Code …" />. */
export function QrBild({ inhalt, beschriftung }: { inhalt: string; beschriftung: string }) {
  const code = useMemo(() => erzeugeQrCode(inhalt), [inhalt]);
  const seite = code.groesse + 2 * RUHEZONE;
  return (
    <svg
      className="qr-bild"
      viewBox={`0 0 ${seite} ${seite}`}
      role="img"
      aria-label={beschriftung}
      shapeRendering="crispEdges"
      data-testid="qr-bild"
      data-qr-version={code.version}
    >
      <rect width={seite} height={seite} fill="#ffffff" />
      <path d={qrPfad(code)} fill="#000000" />
    </svg>
  );
}
