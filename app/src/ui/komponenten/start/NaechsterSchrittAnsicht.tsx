/**
 * Eigener Bildschirm für die Ziele von „Dein nächster Schritt“ (Gamifizierung P1), die sonst nur
 * im Trainingsbereich liegen: fällige Wiederholungen und die Tagesaufgabe.
 *
 * Rolle im Gesamtbild: Eingetragen in app/zusatzansichten.ts unter der Kennung „naechster“; der
 * Wert wählt den Inhalt aus der Liste NAECHSTER_ZIELE. So führt „Wiederholen“ oder „Lösen“ direkt
 * zur Sache, ohne den Bereich zu wechseln. Ein späterer Vorschlag mit eigenem Ziel trägt hier
 * eine Zeile ein.
 * Abhängigkeiten: FaelligeWiederholungen, ZeitrundeBereich (Tagesaufgabe), Navigation.
 */
import type { ComponentType } from "react";
import { useNavigation } from "../../../app/navigationsKontext";
import { t, type Textschluessel } from "../../../i18n/sprache";
import { Tagesaufgabe } from "../../trainer/ZeitrundeBereich";
import { Kopfzeile } from "../rahmen/Kopfzeile";
import { FaelligeWiederholungen } from "../training/FaelligeWiederholungen";

/** Ein Ziel: Titel und Inhalt, der „Zurück“ bekommt. */
interface NaechsterZiel {
  readonly titel: Textschluessel;
  readonly Inhalt: ComponentType<{ readonly zurueck: () => void }>;
}

/** Die Wiederholungen in einer Karte wie im Trainingsbereich. */
function Wiederholungen() {
  return (
    <section className="karte">
      <FaelligeWiederholungen />
    </section>
  );
}

/** Die Tagesaufgabe; ihr Knopf unten führt zurück ins Buch. */
function TagesaufgabeAusDemBuch({ zurueck }: { readonly zurueck: () => void }) {
  return <Tagesaufgabe zurueck={zurueck} zurueckText={t("naechster.zurueckBuch")} />;
}

/** Alle Ziele nach dem Wert der Ansicht; ein neuer Vorschlag ergänzt eine Zeile. */
const NAECHSTER_ZIELE: Readonly<Record<string, NaechsterZiel>> = {
  wiederholung: { titel: "naechster.ansicht.wiederholung", Inhalt: Wiederholungen },
  tagesaufgabe: { titel: "naechster.ansicht.tagesaufgabe", Inhalt: TagesaufgabeAusDemBuch },
};

/** Der Bildschirm; ein unbekannter Wert zeigt die Wiederholungen. */
export function NaechsterSchrittAnsicht({ wert }: { readonly wert: string | null }) {
  const { zurueck } = useNavigation();
  const ziel = NAECHSTER_ZIELE[wert ?? ""] ?? NAECHSTER_ZIELE.wiederholung;
  if (!ziel) return null;
  return (
    <div className="bildschirm" data-testid="naechster-ansicht">
      <Kopfzeile titel={t(ziel.titel)} zurueckText={t("naechster.zurueck")} />
      <ziel.Inhalt zurueck={zurueck} />
    </div>
  );
}
