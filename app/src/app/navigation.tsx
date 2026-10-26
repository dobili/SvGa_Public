/**
 * Navigation der App: Stapel von Ansichten und Verbindung zur Zurück-Taste.
 *
 * Rolle im Gesamtbild: Alle Bildschirme rufen `navigiere` und `zurueck` aus diesem Kontext auf
 * (Konzept 6.6). Die Adresse im Browser bleibt dabei gleich.
 * Warum der „Wächter“-Eintrag im Browserverlauf: Die Zurück-Taste von Android und die
 * Wischgeste am iPhone gehen im Verlauf zurück. Damit sie die vorige Ansicht der App zeigen und
 * die App nicht verlassen, liegt immer genau ein zusätzlicher Verlaufseintrag bereit, solange
 * es in der App noch etwas zum Zurückgehen gibt.
 * Der Rahmen sichert jeden Stand als Merker (app/stapelMerker.ts, V2, Nutzungsprüfung
 * 25.10.2026), und der Anfangsstapel kann ein wiederhergestellter sein. Steht die Seite nach
 * einem Neuladen schon auf dem Wächter-Eintrag, übernimmt der Rahmen ihn, statt einen weiteren
 * anzulegen; so führt die Zurück-Taste auch nach dem Neuladen eine Ansicht zurück.
 * Abhängigkeiten: stapel.ts, stapelMerker.ts, navigationsKontext.ts, React.
 */
import { useCallback, useEffect, useMemo, useReducer, useRef, type ReactNode } from "react";
import { NavigationsKontext, type Navigation } from "./navigationsKontext";
import { oben, schritt, type Stapel } from "./stapel";
import { sichereStapel } from "./stapelMerker";

/** Markierung des Wächter-Eintrags im Browserverlauf. */
const WAECHTER = { app: "schach-von-grund-auf", waechter: true };

/** Ob ein Eintrag im Browserverlauf der Wächter ist (etwa nach einem Neuladen). */
function istWaechter(zustand: unknown): boolean {
  return (
    typeof zustand === "object" &&
    zustand !== null &&
    "waechter" in zustand &&
    "app" in zustand &&
    zustand.waechter === true &&
    zustand.app === WAECHTER.app
  );
}

/**
 * Stellt die Navigation für alle Bildschirme bereit.
 * Eingaben: `anfang` liefert den ersten Stapel (einmal beim Aufbau, App.tsx), die Kinder.
 */
export function NavigationsRahmen({
  anfang,
  children,
}: {
  anfang: () => Stapel;
  children: ReactNode;
}) {
  const [stapel, ausfuehren] = useReducer(schritt, undefined, anfang);
  const tiefe = useRef(stapel.ansichten.length);
  const waechterAktiv = useRef(istWaechter(window.history.state));

  // Wächter setzen, sobald es etwas zum Zurückgehen gibt; jeden Stand sichern (V2).
  useEffect(() => {
    sichereStapel(stapel);
    tiefe.current = stapel.ansichten.length;
    if (stapel.ansichten.length > 1 && !waechterAktiv.current) {
      window.history.pushState(WAECHTER, "");
      waechterAktiv.current = true;
    }
  }, [stapel]);

  // Zurück-Taste: Der Browser hat den Wächter verlassen; die App geht eine Ansicht zurück.
  useEffect(() => {
    const beiZurueck = () => {
      waechterAktiv.current = false;
      if (tiefe.current > 1) {
        ausfuehren({ art: "zurueck" });
      }
    };
    window.addEventListener("popstate", beiZurueck);
    return () => window.removeEventListener("popstate", beiZurueck);
  }, []);

  const zurueck = useCallback(() => {
    // Der Knopf in der App geht denselben Weg wie die Zurück-Taste, damit der Verlauf stimmt.
    if (waechterAktiv.current) {
      window.history.back();
    } else {
      ausfuehren({ art: "zurueck" });
    }
  }, []);

  const wert = useMemo<Navigation>(
    () => ({
      stapel,
      ansicht: oben(stapel),
      navigiere: (ansicht) => ausfuehren({ art: "navigiere", ansicht }),
      ersetze: (ansicht) => ausfuehren({ art: "ersetze", ansicht }),
      zurueck,
      wechsleBereich: (bereich) => ausfuehren({ art: "bereich", bereich }),
    }),
    [stapel, zurueck],
  );
  return <NavigationsKontext.Provider value={wert}>{children}</NavigationsKontext.Provider>;
}
