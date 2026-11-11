/**
 * Eine Erinnerung Ambroses in der Aufgabenansicht: die Klassikerpartie Zug für Zug erraten
 * (docs/spiel/08, F1; Entscheidung C3), im Rundenrahmen des Trainers „Zug erraten“.
 *
 * Rolle im Gesamtbild: Teil der Zusatzansicht „abenteuer-aufgaben“; die Aufgabenansicht wählt
 * diese Runde, wenn der Auftrag eine Erinnerung trägt. Das Ergebnis ist eine einzige Aufgabe:
 * „richtig“, wenn mindestens die Hälfte der Züge getroffen ist (wie im Trainer der App).
 * Abhängigkeiten: ui/trainer (Rundenrahmen, useRunde, Zugerratenaufgabe), daten/laden.ts,
 * anbindung/erinnerung.ts.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { ladeZusatzpartien } from "../../daten/laden";
import { sprache, t } from "../../i18n/sprache";
import type { Antwortergebnis } from "../../training/wiederholung";
import { useDaten } from "../../ui/komponenten/bausteine/useDaten";
import { Rundenrahmen } from "../../ui/trainer/Rundenrahmen";
import { useRunde } from "../../ui/trainer/useRunde";
import { Zugerratenaufgabe } from "../../ui/trainer/Zugerratenaufgabe";
import type { Aufgabenauftrag } from "../schnittstelle/aufgaben";
import { erinnerungsaufgabe } from "./erinnerung";
import { Raetseltest } from "./Testleiste";

export function ErinnerungsRunde({
  erinnerung,
  beiEnde,
  zurueck,
}: {
  erinnerung: NonNullable<Aufgabenauftrag["erinnerung"]>;
  beiEnde: (ergebnisse: readonly Antwortergebnis[], sekunden: number) => void;
  zurueck: React.ReactNode;
}) {
  const partien = useDaten(ladeZusatzpartien, "zusatzpartien");
  const aufgabe = useMemo(
    () =>
      partien.art === "fertig" ? erinnerungsaufgabe(partien.wert, erinnerung, sprache()) : null,
    [partien, erinnerung],
  );
  const runde = useRunde("zugErraten", 1);
  const gemeldet = useRef(false);
  // Testhilfe des Autors: die Erinnerung sofort bestehen (true) oder verfehlen (false).
  const [test, setzeTest] = useState<boolean | null>(null);
  const ergebnis = test ?? runde.ergebnis;
  useEffect(() => {
    if (ergebnis === null || gemeldet.current) return;
    gemeldet.current = true;
    beiEnde([ergebnis ? "richtig" : "falsch"], runde.sekunden ?? 0);
  }, [ergebnis, runde.sekunden, beiEnde]);
  if (partien.art === "laedt") return <p className="lade">{t("abenteuer.aufgaben.laedt")}</p>;
  if (!aufgabe) {
    return (
      <section className="karte">
        <p className="hinweis">{t("trainer.keineAufgaben")}</p>
        {zurueck}
      </section>
    );
  }
  // Nach „Runde auswerten“ eine eigene Endkarte mit dem einen Weg zurück; das Ende des
  // Rundenrahmens („Noch eine Runde“) gehört in die App, nicht in die Geschichte (docs/spiel/18).
  if (runde.fertig || test !== null) {
    return (
      <section className="karte" data-testid="abenteuer-aufgaben-ende">
        <p>{t("zugerraten.ende")}</p>
        {zurueck}
      </section>
    );
  }
  return (
    <>
      <Rundenrahmen kennung="zugErraten" runde={runde} nochmal={() => {}} zurAuswahl={null} imSpiel>
        <div className="trainer-aufgabe">
          <Zugerratenaufgabe aufgabe={aufgabe} runde={runde} />
        </div>
      </Rundenrahmen>
      <Raetseltest beiWahl={setzeTest} />
    </>
  );
}
