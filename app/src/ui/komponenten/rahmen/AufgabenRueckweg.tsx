/**
 * Knopf „Zurück zu den Aufgaben“ über der Leiste, solange der Autor von der Aufgabenseite einem
 * Link gefolgt ist.
 *
 * Rolle im Gesamtbild: Teil der Aufgabenseite (seit 0.2.75). Eine installierte App auf dem iPhone
 * hat keine Zurück-Taste, und Bildschirme wie die Einstellungen haben keinen eigenen
 * „Zurück“-Knopf; ohne diesen Knopf käme der Autor nur über den langen Druck zurück.
 * Abhängigkeiten: Navigation, i18n.
 */
import { useNavigation } from "../../../app/navigationsKontext";
import { t } from "../../../i18n/sprache";

/**
 * Der Knopf „Zurück zu den Aufgaben“: erscheint nur, wenn der Autor von seiner Aufgabenseite einem
 * Link gefolgt ist.
 */
export function AufgabenRueckweg() {
  const { stapel, zurueck } = useNavigation();
  const darunter = stapel.ansichten[stapel.ansichten.length - 2];
  if (darunter?.bildschirm !== "autoraufgaben") return null;
  return (
    <button type="button" className="aufgaben-rueckweg" onClick={zurueck}>
      {t("autor.rueckweg")}
    </button>
  );
}
