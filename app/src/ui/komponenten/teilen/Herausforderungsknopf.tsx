/**
 * Knopf „Freunde herausfordern“ (Gamifizierung P9): teilt einen Link auf eine Aufgabe mit einem
 * kurzen Satz, über das Teilen-Menü des Geräts oder in die Zwischenablage.
 *
 * Rolle im Gesamtbild: Allgemein für jeden Trainer in HERAUSFORDERUNGEN; der Trainer nennt seine
 * Kennung, die Kennung der Aufgabe in der Adresse und den Satz. Der Taktiktrainer setzt ihn nach
 * einer gelösten Aufgabe ein (TaktikHerausforderung.tsx), ebenso die geöffnete Herausforderung.
 * Abhängigkeiten: herausforderungslink.ts, teileBild.ts (teileLink), Knopfsymbol, i18n.
 */
import { useState } from "react";
import { t } from "../../../i18n/sprache";
import { Knopfsymbol } from "../bausteine/Knopfsymbol";
import { herausforderungslink } from "./herausforderungslink";
import { teileLink, type Teilergebnis } from "./teileBild";

/**
 * Der Knopf. Beispiel: trainer „taktik“, aufgabe „l-1Vybh“, text „Schaffst du das? Weiß zieht
 * und gewinnt.“ → Teilen-Menü mit Satz und Link; ohne Menü „Link kopiert“.
 */
export function Herausforderungsknopf({
  trainer,
  aufgabe,
  text,
}: {
  trainer: string;
  aufgabe: string;
  text: string;
}) {
  const [ergebnis, setzeErgebnis] = useState<Teilergebnis | "fehler" | null>(null);
  const teile = async () => {
    try {
      setzeErgebnis(await teileLink(text, herausforderungslink(trainer, aufgabe)));
    } catch (fehler) {
      console.warn("Herausforderung nicht geteilt:", fehler);
      setzeErgebnis("fehler");
    }
  };
  return (
    <p className="teilen" data-testid="herausforderung-teilen">
      <button type="button" className="knopf-zweit teilen-knopf" onClick={() => void teile()}>
        <Knopfsymbol art="teilen" />
        {t("teilen.herausfordern")}
      </button>
      {(ergebnis === "gespeichert" || ergebnis === "fehler") && (
        <span className="teilen-meldung" role="status">
          {t(ergebnis === "gespeichert" ? "teilen.kopiert" : "teilen.fehler")}
        </span>
      )}
    </p>
  );
}
