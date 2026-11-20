/**
 * Testhilfe des Autors (nur Testfassung): drei Knöpfe unter der Partie des Abenteuers (sofort
 * gewinnen, Remis, verlieren) und zwei unter jedem Rätsel („Bestehen“, „Verfehlen“).
 *
 * Rolle im Gesamtbild: gehört zur Hülle der Partie (PartieHuelle.tsx), zur Aufgabenrunde, zur
 * Erinnerung und zur Gedächtnisstellung und erscheint nur, solange
 * nicht für die Leser gebaut wird, und nur auf dem Gerät des Autors (testknoepfeAn). Die Texte stehen hier fest auf Deutsch, weil die Leiste nie
 * ausgeliefert und nie übersetzt wird.
 * Abhängigkeiten: testende.ts, ui/komponenten/partie/botzug.ts.
 */
import { aendereNeueste } from "../../ui/komponenten/partie/botzug";
import { mitTestende, testknoepfeAn, type Testausgang } from "./testende";

const KNOEPFE: readonly { ausgang: Testausgang; text: string }[] = [
  { ausgang: "sieg", text: "Gewinnen" },
  { ausgang: "remis", text: "Remis" },
  { ausgang: "niederlage", text: "Verlieren" },
];

/** Die Testleiste einer laufenden Partie; `id` ist die Id der Partie in der App. */
export function Testleiste({ id }: { readonly id: string }) {
  // Die feste Bauzeit-Zahl zuerst: Nur so lässt der Bundler die Leiste in der Leserfassung weg.
  if (__VEROEFFENTLICHUNG__ || !testknoepfeAn()) return null;
  return (
    <section className="abenteuer-huelle-test" aria-label="Testhilfe des Autors">
      <span>Test:</span>
      {KNOEPFE.map((k) => (
        <button
          key={k.ausgang}
          type="button"
          className="knopf-zweit"
          data-testid={`abenteuer-test-${k.ausgang}`}
          onClick={() => aendereNeueste(id, (p) => mitTestende(p, k.ausgang, Date.now()))}
        >
          {k.text}
        </button>
      ))}
    </section>
  );
}

/**
 * Die Testzeile eines Rätsels: „Bestehen“ und „Verfehlen“.
 *
 * Eingabe: der Rückruf, über den auch das echte Ergebnis läuft (true = bestanden).
 * Beispiel: In der Gedächtnisstellung ruft „Bestehen“ `beiEnde(true)` wie ein richtiger Aufbau.
 * Sonderfall: In der Veröffentlichung zeichnet die Zeile nichts.
 */
export function Raetseltest({ beiWahl }: { readonly beiWahl: (bestanden: boolean) => void }) {
  // Die feste Bauzeit-Zahl zuerst: Nur so lässt der Bundler die Leiste in der Leserfassung weg.
  if (__VEROEFFENTLICHUNG__ || !testknoepfeAn()) return null;
  return (
    <section className="abenteuer-huelle-test" aria-label="Testhilfe des Autors">
      <span>Test:</span>
      <button
        type="button"
        className="knopf-zweit"
        data-testid="abenteuer-test-bestehen"
        onClick={() => beiWahl(true)}
      >
        Bestehen
      </button>
      <button
        type="button"
        className="knopf-zweit"
        data-testid="abenteuer-test-verfehlen"
        onClick={() => beiWahl(false)}
      >
        Verfehlen
      </button>
    </section>
  );
}
