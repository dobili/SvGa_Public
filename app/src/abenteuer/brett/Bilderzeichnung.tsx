/**
 * Zeichnung der Brettstile mit gezeichneten Bildern: Brettbild als Unterlage, Figuren als Bilder.
 *
 * Rolle im Gesamtbild: Gibt es zu einem Stil Bilder im Paket (brettbilder.ts), wird aus der
 * gerechneten Vorgabe (Zeichnung.tsx) eine mit Bildern: Das Brettbild liegt über den 64 Feldern
 * und verdeckt ihre Farben (Brett.tsx zeichnet die Unterlage direkt nach den Feldern), die
 * Figurenbilder ersetzen die Pixelfiguren. Markierungen, Pfeile, Zugmarke und Rahmen behalten die
 * Farben des Stils; die Kontur der Marken wechselt nur, wenn sie auf den Feldfarben des Bildes
 * nicht mehr lesbar wäre (lesbareMarken). Die Bilder sind fein gezeichnet, nicht grob gepixelt:
 * Deshalb glatte Skalierung (image-rendering „auto“), obwohl die Spielhülle „pixelated“ vererbt.
 * Abhängigkeiten: brettbilder.ts, brettstile.ts, kontrast.ts, Zeichnung.tsx, ui/brett.
 */
import type { CSSProperties } from "react";
import type { Brettstilvorgabe, Figurzeichnung, Markenfarben } from "../../ui/brett/brettstil";
import { BRETT, FELD } from "../../ui/brett/masse";
import type { Brettbildfarben, Brettbilder } from "./brettbilder";
import type { Brettstilkennung } from "./brettstile";
import { markeSichtbar } from "./kontrast";
import { brettstilvorgabe } from "./Zeichnung";

/** Glatte Skalierung für die fein gezeichneten Bilder (die Hülle vererbt „pixelated“). */
const GLATT: CSSProperties = { imageRendering: "auto" };

/** Konturen, zwischen denen gewählt wird, wenn die des Stils auf dem Bild nicht trägt. */
const KONTUREN = ["#101010", "#F5F5F5"] as const;

/** Das Brettbild über allen Feldern; a8 und h1 sind hell, deshalb passt es auch gedreht. */
function bildunterlage(adresse: string) {
  return function Bildunterlage() {
    return (
      <image
        href={adresse}
        width={BRETT}
        height={BRETT}
        preserveAspectRatio="none"
        pointerEvents="none"
        style={GLATT}
      />
    );
  };
}

/** Eine Figur als Bild; die Bilder stehen schon auf gemeinsamer Grundlinie (128 × 128). */
function bildfigur(figuren: Readonly<Record<string, string>>) {
  return function Bildfigur({ zeichen, x, y }: Figurzeichnung) {
    const adresse = figuren[zeichen];
    if (!adresse) return null;
    return (
      <image
        className="brett-figur"
        href={adresse}
        x={x}
        y={y}
        width={FELD}
        height={FELD}
        preserveAspectRatio="xMidYMax meet"
        style={GLATT}
      />
    );
  };
}

/** Sind alle Marken mit dieser Kontur auf beiden Feldfarben zu sehen? */
function alleSichtbar(marken: Markenfarben, kontur: string, felder: Brettbildfarben): boolean {
  return Object.values(marken.farben).every(
    (flaeche) =>
      markeSichtbar(flaeche, kontur, felder.hell) && markeSichtbar(flaeche, kontur, felder.dunkel),
  );
}

/**
 * Die Markenfarben des Stils, auf den Feldfarben des Bildes lesbar.
 *
 * Regel: docs/spiel/30_Bedienung_und_Brettstile.md, Abschnitt 5 „Lesbarkeit“ – jede Markierung
 * hebt sich mit Fläche oder Kontur von beiden Feldern ab (kontrast.ts, 3:1).
 * Beispiel: Schiefer mit dunkler Kontur, das gezeichnete Brett ist aber fast schwarz → helle
 * Kontur. Sonderfall: Trägt keine Kontur, bleibt die des Stils (die Flächen ändern sich nie).
 */
export function lesbareMarken(marken: Markenfarben, felder: Brettbildfarben | null): Markenfarben {
  if (!felder || alleSichtbar(marken, marken.kontur, felder)) return marken;
  const kontur = KONTUREN.find((k) => alleSichtbar(marken, k, felder));
  return kontur ? { ...marken, kontur } : marken;
}

/** Je Bildersatz eine Vorgabe, damit React die Figuren beim Ziehen nicht neu aufbaut. */
const VORGABEN = new WeakMap<Brettbilder, Brettstilvorgabe>();

/**
 * Die Vorgabe eines Stils mit seinen gezeichneten Bildern.
 *
 * Beispiel: „schiefer“ mit Brett und zwölf Figuren → Brettbild als Unterlage (statt der feinen
 * Pixelstruktur), Figurenbilder, Feldfarben für die Koordinaten aus brett.json. Sonderfall: ohne
 * vollständigen Figurensatz bleiben die Pixelfiguren auf dem gezeichneten Brett.
 */
export function bildvorgabe(kennung: Brettstilkennung, bilder: Brettbilder): Brettstilvorgabe {
  const fertig = VORGABEN.get(bilder);
  if (fertig) return fertig;
  const grund = brettstilvorgabe(kennung);
  const markenfarben = grund.markenfarben && lesbareMarken(grund.markenfarben, bilder.farben);
  const vorgabe: Brettstilvorgabe = {
    ...grund,
    palette: { ...grund.palette, ...(bilder.farben ?? {}) },
    Unterlage: bildunterlage(bilder.brett),
    Figur: bilder.figuren ? bildfigur(bilder.figuren) : grund.Figur,
    ...(markenfarben ? { markenfarben } : {}),
  };
  VORGABEN.set(bilder, vorgabe);
  return vorgabe;
}
