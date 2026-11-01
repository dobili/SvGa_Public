/**
 * Eine Übung des Buches als Entwurf einer Variante, erst nach dem Lösen (Bildschirm „Übung“).
 *
 * Rolle im Gesamtbild: Variationsbrowser, Stufe 4 („Übungen des Buches erst nach dem Lösen, damit
 * die Lösung verborgen bleibt“). Der Knopf steht nur unter einer gelösten oder aufgedeckten Übung
 * (Uebung.tsx). Hat die Abbildung der Übung eine Zugfolge im Buch, kommt deren ganzer Baum mit
 * (wie „Als Variante öffnen“ an der Abbildung), geöffnet an der Aufgabe; sonst die Lösung und die
 * akzeptierten Züge der freigegebenen Erklärung als Linien. Denkaufgaben ohne Zug öffnen die
 * Stellung. Quelle ist die Abbildung (Hinweis „1 eigene Variante“ dort).
 * Abhängigkeiten: daten (Typen), training/uebungsaufgabe.ts, training/variationsquellen.ts, i18n.
 */
import type { Kapitel } from "../../../daten/laden";
import { t } from "../../../i18n/sprache";
import { aufgabeZu, zusaetzlichAkzeptiert } from "../../../training/uebungsaufgabe";
import type { Variation } from "../../../training/variationen";
import { ausAbbildung, ausLinien } from "../../../training/variationsquellen";

/**
 * Der Entwurf zu einer Übung; null, wenn es sie oder ihre Abbildung nicht gibt.
 * Beispiel: Übung 8 (Abb. 2.148, 4. Sg5 in der Italienischen Partie) → Buchbaum der Übung,
 * geöffnet nach 4. Sg5, die Lösung 4... Dxg5 dahinter.
 */
export function ausUebung(kapitel: Kapitel, id: string, jetzt: Date): Variation | null {
  const uebung = kapitel.uebungen.find((u) => u.id === id);
  const erste = uebung?.abbildungen[0];
  const abbildung = erste ? kapitel.abbildungen.find((a) => a.id === erste) : undefined;
  if (!uebung || !abbildung) return null;
  const titel = t("uebung.titel", { nummer: uebung.nummer });
  const verweis = abbildung.beispiel;
  const beispiel = verweis ? kapitel.beispiele.find((b) => b.id === verweis.id) : undefined;
  if (verweis && beispiel) {
    const quelle = { nummer: abbildung.id, fen: abbildung.fen, beispiel, pfad: verweis.pfad };
    return ausAbbildung(quelle, titel, jetzt);
  }
  const aufgabe = aufgabeZu(abbildung.fen, uebung.erklaerung?.loesung ?? null, [
    ...(uebung.erklaerung?.akzeptiert ?? []),
    ...zusaetzlichAkzeptiert(uebung.id),
  ]);
  const linien = aufgabe.art === "zug" ? aufgabe.linien : [];
  const teile = {
    titel,
    quelle: { art: "abbildung", nummer: abbildung.id } as const,
    fen: abbildung.fen,
  };
  return ausLinien(teile, linien, "buch", jetzt);
}
