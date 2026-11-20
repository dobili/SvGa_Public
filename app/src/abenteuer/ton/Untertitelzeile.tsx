/**
 * Die Zeile „Geräusche als Text“ unten im Spiel (ton/untertitel.ts): zeigt für ein paar Sekunden,
 * was zu hören ist, etwa „[Tür knarrt]“ oder „[Musik: ruhig]“. Vorleser hören sie als Statusmeldung.
 *
 * Rolle im Gesamtbild: steht in der Oberwelt (oberwelt/Oberwelt.tsx), also über Karte und Dialog.
 * Die Texte kommen aus den Spieltexten (`untertitel.musik.*`, `untertitel.klang.*`,
 * ton/untertiteltext.ts).
 * Abhängigkeiten: ton/untertitel.ts, ton/untertiteltext.ts.
 */
import { useSyncExternalStore } from "react";
import { aktuelleUntertitel, beiUntertitel } from "./untertitel";
import { untertiteltext } from "./untertiteltext";
import "./untertitel.css";

/** Zeile „Geräusche als Text“: zeigt kurz, was zu hören ist, für Leser ohne Ton und Vorleser. */
export function Untertitelzeile() {
  const zeilen = useSyncExternalStore(beiUntertitel, aktuelleUntertitel);
  const texte = zeilen.flatMap((z) => {
    const text = untertiteltext(z);
    return text ? [{ nummer: z.nummer, text }] : [];
  });
  if (texte.length === 0) return null;
  return (
    <div className="abenteuer-untertitel" role="status" data-testid="abenteuer-untertitel">
      {texte.map((z) => (
        <p key={z.nummer}>{z.text}</p>
      ))}
    </div>
  );
}
