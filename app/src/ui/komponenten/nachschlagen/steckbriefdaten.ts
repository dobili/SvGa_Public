/**
 * Daten und Sprünge für die Steckbriefe und das Glossar: alle Kapitel laden, die erste Abbildung
 * eines Abschnitts finden, Sprünge aus dem Buchtext zu Abbildungen und Begriffen.
 *
 * Rolle im Gesamtbild: gemeinsam genutzt von Steckbriefe.tsx, steckbriefteile.tsx und Glossar.tsx
 * (seit der Gestaltung nach den Entwürfen H2 und I3, 31.10.2026). Eigene Datei ohne Bausteine der
 * Oberfläche, damit das schnelle Neuladen beim Entwickeln funktioniert.
 * Abhängigkeiten: daten/laden.ts, Navigation, Buchtext (Typ).
 */
import { useNavigation } from "../../../app/navigationsKontext";
import { ladeIndex, ladeKapitel, type Kapitel } from "../../../daten/laden";
import type { Textaktionen } from "../abbildung/Unterschrift";

/** Alle Kapitel, die das Verzeichnis kennt (Steckbriefe, Fallen, Abbildungen aus allen Kapiteln). */
export async function ladeAlleKapitel(): Promise<readonly Kapitel[]> {
  const index = await ladeIndex();
  return Promise.all(index.kapitel.map((k) => ladeKapitel(k.kapitel)));
}

/** Sprünge aus dem Buchtext: Abbildungen und Begriffe. */
export function useBuchaktionen(): Textaktionen {
  const { navigiere } = useNavigation();
  return {
    beiVerweis: (nummer) => navigiere({ bildschirm: "abbildung", nummer }),
    beiBegriff: (begriff) => navigiere({ bildschirm: "begriff", begriff }),
  };
}

/** Erste Abbildung eines Abschnitts („2.2“), damit der Knopf an die Stelle im Buch führt. */
export function ersteAbbildung(
  kapitel: readonly Kapitel[],
  abschnitt: string | null,
): string | null {
  if (!abschnitt) return null;
  for (const k of kapitel) {
    const treffer = k.abbildungen.find((a) => a.abschnitt?.nummer === abschnitt);
    if (treffer) return treffer.id;
  }
  return null;
}
