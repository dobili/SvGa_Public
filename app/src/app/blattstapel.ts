/**
 * Stapel der offenen Blätter und Fenster, damit die Zurück-Taste nur das oberste schließt.
 *
 * Rolle im Gesamtbild: Blätter (Teilen, Merken, Infofenster der Orden und Nebenaufgaben, Partie
 * einstellen), Gratulationen, Startwahl, Sprachfrage, Tour und Rückfragen melden sich hier an,
 * solange sie offen sind (`useZurueckSchliesst`). Der NavigationsRahmen (navigation.tsx) hält den
 * Wächter-Eintrag im Browserverlauf auch dann bereit, wenn nur ein Blatt offen ist, und schließt
 * bei der Zurück-Taste zuerst das oberste Blatt, statt eine Ansicht zurückzugehen.
 * Warum: Im Fehlertest f3 (01.11.2026) schloss die Zurück-Taste bei offenem Infofenster den ganzen
 * Lernpfad, auf der Profil-Startseite verließ sie die App. Ein natives `<dialog>` hilft nur unter
 * Android-Chrome (CloseWatcher), nicht bei Browser-Zurück und nicht am iPhone; deshalb ein
 * gemeinsamer Weg über den Verlauf für alle Fenster.
 * Abhängigkeiten: React (nur der Hook).
 */
import { useEffect, useRef } from "react";

/** Ein offenes Blatt: wie es sich schließt. */
interface OffenesBlatt {
  readonly schliesse: () => void;
}

/** Die offenen Blätter, das zuletzt geöffnete am Ende. */
const offene: OffenesBlatt[] = [];
/** Wer über Änderungen Bescheid wissen will (der NavigationsRahmen). */
const horcher = new Set<() => void>();

function melde(): void {
  for (const horch of horcher) horch();
}

/**
 * Meldet ein offenes Blatt an.
 * Eingaben: was beim Schließen über die Zurück-Taste geschehen soll.
 * Ausgabe: Abmelden (mehrfach aufrufbar, etwa nachdem die Zurück-Taste es schon entfernt hat).
 */
export function meldeBlattAn(schliesse: () => void): () => void {
  const eintrag: OffenesBlatt = { schliesse };
  offene.push(eintrag);
  melde();
  return () => {
    const stelle = offene.indexOf(eintrag);
    if (stelle < 0) return;
    offene.splice(stelle, 1);
    melde();
  };
}

/**
 * Schließt das zuletzt geöffnete Blatt (Zurück-Taste).
 * Ausgabe: true, wenn eines offen war; false, wenn die Navigation selbst zurückgehen soll.
 */
export function schliesseOberstesBlatt(): boolean {
  const oberstes = offene.pop();
  if (!oberstes) return false;
  melde();
  oberstes.schliesse();
  return true;
}

/** Wie viele Blätter offen sind (für useSyncExternalStore). */
export function anzahlOffenerBlaetter(): number {
  return offene.length;
}

/** Horcht auf Änderungen; Ausgabe: Abmelden. */
export function abonniereBlaetter(horch: () => void): () => void {
  horcher.add(horch);
  return () => horcher.delete(horch);
}

/**
 * Lässt die Zurück-Taste ein Blatt oder Fenster schließen, solange es offen ist.
 * Eingaben: `offen` (ob es gerade zu sehen ist) und `schliessen` (dasselbe wie „Schließen“,
 * „Später“ oder „Weiter“; der jeweils neueste Rückruf gilt).
 * Beispiel: useZurueckSchliesst(true, beiSchliessen) im Blatt „Teilen“: Zurück schließt das
 * Blatt, die Auswertung bleibt stehen.
 * Sonderfall: Schließt das Blatt auf anderem Weg (Knopf, Escape), räumt der NavigationsRahmen den
 * Verlaufseintrag wieder ab, wenn ihn sonst nichts braucht.
 */
export function useZurueckSchliesst(offen: boolean, schliessen: () => void): void {
  const aktuell = useRef(schliessen);
  useEffect(() => {
    aktuell.current = schliessen;
  }, [schliessen]);
  useEffect(() => {
    if (!offen) return;
    return meldeBlattAn(() => aktuell.current());
  }, [offen]);
}
