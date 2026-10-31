/**
 * Entscheidet beim App-Start einmal, ob die Startanimation ein Orden oder Abzeichen zeigt, und
 * liefert dafür die Gesamtdauer und die Ebene mit dem Bild (Wunsch des Autors, 30.10.2026).
 *
 * Rolle im Gesamtbild: Wird von rahmen/Startanimation.tsx aufgerufen. Gesammelt werden alle vollen
 * Ringe (Orden) und alle verdienten Abzeichen mit eigenem Bild; was davon seit dem letzten Start
 * neu ist, steht in startorden.ts. Die Entscheidung fällt, sobald Fortschritt und Abzeichen geladen
 * sind; sind sie es nicht, bevor das Logo steht, bleibt es beim Springer allein.
 * Abhängigkeiten: startorden.ts, Startstueck.tsx, entwuerfe.ts, fortschritt/fortschrittsringe.ts,
 * fortschritt/ringrechnung.ts, fortschritt/abzeichenstand.ts, i18n.
 */
import { useEffect, useState, type ReactNode } from "react";
import { t } from "../../../i18n/sprache";
import { useAbzeichenstand } from "../fortschritt/abzeichenstand";
import { useFortschrittsringe } from "../fortschritt/fortschrittsringe";
import { istVoll } from "../fortschritt/ringrechnung";
import type { Symbolringangabe } from "../fortschritt/Symbolringe";
import { hatOrdenkunst, ordenkennungAusRing } from "./entwuerfe";
import {
  liesBekannt,
  LOGO_STEHT_MS,
  merkeBekannt,
  planeStart,
  type Startplan,
  type Stueck,
  zufallDesTages,
} from "./startorden";
import { Startstueck } from "./Startstueck";

/** Kurzer Name eines Rings für die Zeile unter dem Orden. Beispiel: „Teil Endspiel“. */
function ringname(ring: Symbolringangabe): string {
  if (ring.testid.startsWith("ich-teil-") && ring.legende)
    return t("startorden.teil", { teil: ring.legende });
  return ring.name.replace(/\s*\(.*\)$/, "");
}

/** Alle verdienten Stücke mit eigenem Bild: volle Ringe, dann Abzeichen; null, solange es lädt. */
function useVerdient(): Stueck[] | null {
  const ringe = useFortschrittsringe();
  const stand = useAbzeichenstand();
  if (!ringe || !stand) return null;
  const orden = [...ringe.buchringe, ...ringe.teilringe, ...ringe.botringe]
    .filter((r) => istVoll(r.anteil))
    .map((r): Stueck => ({
      art: "orden",
      kennung: ordenkennungAusRing(r.testid),
      name: ringname(r),
    }));
  const abzeichen = [...stand.verdient].map((k): Stueck => ({
    art: "abzeichen",
    kennung: k,
    name: t(`abzeichen.name.${k}`),
  }));
  return [...orden, ...abzeichen].filter((s) => hatOrdenkunst(s.art, s.kennung));
}

/**
 * `aktiv`: Die Startanimation läuft beim App-Start (nicht bei der kurzen Rückkehr aus dem
 * Hintergrund). Ausgabe: Gesamtdauer in ms (null: wie bisher, 2,5 s) und die Ebene.
 * Beispiel: seit dem letzten Start „Erster Sieg“ verdient → dauerMs 4600, Ebene mit dem Pokal.
 */
export function useStartorden(aktiv: boolean): { dauerMs: number | null; inhalt: ReactNode } {
  const verdient = useVerdient();
  const [plan, setzePlan] = useState<Startplan | null>(null);
  const [beginn] = useState(() => Date.now());
  const bereit = verdient !== null;
  useEffect(() => {
    if (!aktiv || plan) return;
    // Entscheidung im nächsten Schritt der Ereignisschleife: setState nur aus einem Rückruf.
    const warte = setTimeout(
      () => {
        if (!verdient) return setzePlan({ art: "nichts" });
        const { plan: neu, bekanntNeu } = planeStart(
          liesBekannt(),
          verdient,
          zufallDesTages(new Date()),
        );
        merkeBekannt(bekanntNeu);
        setzePlan(neu);
      },
      bereit ? 0 : LOGO_STEHT_MS,
    );
    return () => clearTimeout(warte);
  }, [aktiv, plan, verdient, bereit]);
  if (!aktiv || !plan || plan.art === "nichts") return { dauerMs: null, inhalt: null };
  return { dauerMs: plan.dauerMs, inhalt: <Startstueck plan={plan} beginn={beginn} /> };
}
