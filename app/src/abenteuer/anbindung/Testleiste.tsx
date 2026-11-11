/**
 * Drei Knöpfe unter der Partie des Abenteuers: sofort gewinnen, Remis, verlieren (nur Testfassung).
 *
 * Rolle im Gesamtbild: gehört zur Hülle der Partie (PartieHuelle.tsx) und erscheint nur, solange
 * nicht für die Leser gebaut wird. Die Texte stehen hier fest auf Deutsch, weil die Leiste nie
 * ausgeliefert und nie übersetzt wird.
 * Abhängigkeiten: testende.ts, ui/komponenten/partie/botzug.ts.
 */
import { aendereNeueste } from "../../ui/komponenten/partie/botzug";
import { mitTestende, TESTKNOEPFE_AN, type Testausgang } from "./testende";

const KNOEPFE: readonly { ausgang: Testausgang; text: string }[] = [
  { ausgang: "sieg", text: "Gewinnen" },
  { ausgang: "remis", text: "Remis" },
  { ausgang: "niederlage", text: "Verlieren" },
];

/** Die Testleiste einer laufenden Partie; `id` ist die Id der Partie in der App. */
export function Testleiste({ id }: { readonly id: string }) {
  if (!TESTKNOEPFE_AN) return null;
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
