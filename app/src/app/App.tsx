/**
 * Hülle der App: zeigt die oberste Ansicht des Stapels, die Leiste, den Update-Hinweis, den
 * Hinweis auf die Datensicherung (seit 0.2.32) und den Hinweis bei Speicherfehlern. Ist der Ton
 * an (seit 0.2.33), weckt jede Berührung den Tonerzeuger (Vorgabe von Safari, app/ton.ts).
 *
 * Rolle im Gesamtbild: Oberste Komponente (Konzept 6.6). Kennt alle Bildschirme, aber keine
 * Schachlogik. Die App liegt unter /app/ und startet immer direkt; Installation und Buch stellt
 * die statische Startseite unter / vor (Entscheidung 15.10.2026). Die Adresse /app/#lizenzen
 * (Fußzeile der Startseite) öffnet gleich die Lizenzen, /app/#abb-6.20 (Trainingsseiten der
 * Website, seit 16.10.2026) gleich die Abbildung.
 * Abhängigkeiten: Navigation, Bildschirme, Komponenten.
 */
import { useEffect } from "react";
import { Abbildung } from "../ui/bildschirme/Abbildung";
import { Buch } from "../ui/bildschirme/Buch";
import { Ich } from "../ui/bildschirme/Ich";
import { Kapitel } from "../ui/bildschirme/Kapitel";
import { Checkliste } from "../ui/bildschirme/Checkliste";
import { Denkroutine } from "../ui/bildschirme/Denkroutine";
import { Begriff, Glossar } from "../ui/bildschirme/Glossar";
import { Nachschlagen } from "../ui/bildschirme/Nachschlagen";
import { Training } from "../ui/bildschirme/Training";
import { Trainer } from "../ui/bildschirme/Trainer";
import { Uebung } from "../ui/bildschirme/Uebung";
import { Partie } from "../ui/bildschirme/Partie";
import { Spielen } from "../ui/bildschirme/Spielen";
import { Lizenzen } from "../ui/bildschirme/Lizenzen";
import { Leiste } from "../ui/komponenten/Leiste";
import { Speicherhinweis } from "../ui/komponenten/Speicherhinweis";
import { SicherungsHinweis } from "../ui/komponenten/SicherungsHinweis";
import { UpdateHinweis } from "../ui/komponenten/UpdateHinweis";
import { useEinstellungen } from "./einstellungen";
import { NavigationsRahmen } from "./navigation";
import { useNavigation } from "./navigationsKontext";
import type { Ansicht } from "./stapel";
import { entsperreTon } from "./ton";

/** Zeichnet die Ansicht oben auf dem Stapel. */
function Bildschirm({ ansicht }: { ansicht: Ansicht }) {
  switch (ansicht.bildschirm) {
    case "buch":
      return <Buch />;
    case "abbildung":
      return <Abbildung nummer={ansicht.nummer} />;
    case "kapitel":
      return <Kapitel nummer={ansicht.nummer} />;
    case "nachschlagen":
      return <Nachschlagen />;
    case "training":
      return <Training />;
    case "glossar":
      return <Glossar />;
    case "begriff":
      return <Begriff begriff={ansicht.begriff} />;
    case "denkroutine":
      return <Denkroutine />;
    case "checkliste":
      return <Checkliste />;
    case "spielen":
      return <Spielen startFen={ansicht.startFen} abbildung={ansicht.abbildung} />;
    case "partie":
      return <Partie key={ansicht.id} id={ansicht.id} />;
    case "ich":
      return <Ich />;
    case "lizenzen":
      return <Lizenzen />;
    case "uebung":
      return (
        <Uebung key={ansicht.id} kapitel={ansicht.kapitel} id={ansicht.id} reihe={ansicht.reihe} />
      );
    case "trainer":
      return <Trainer key={ansicht.kennung} kennung={ansicht.kennung} />;
  }
}

/** Sprungziel in der Adresse, das gleich eine Ansicht öffnet (Fußzeile der Startseite). */
const SPRUNG_LIZENZEN = "#lizenzen";
/** Sprung zu einer Abbildung von den Trainingsseiten der Website, etwa „#abb-6.20“ (16.10.2026). */
const SPRUNG_ABBILDUNG = /^#abb-(\d{1,2}\.\d{1,3})$/;

/** Die Ansicht zu einem Sprungziel der Adresse, oder null. Beispiel: „#abb-6.20“ → Abb. 6.20. */
function ansichtZumSprung(hash: string): Ansicht | null {
  if (hash === SPRUNG_LIZENZEN) return { bildschirm: "lizenzen" };
  const abbildung = SPRUNG_ABBILDUNG.exec(hash)?.[1];
  return abbildung ? { bildschirm: "abbildung", nummer: abbildung } : null;
}

/** Bei eingeschaltetem Ton weckt jede Berührung den Tonerzeuger (iPhone spielt sonst nichts). */
function useTonEntsperren() {
  const an = useEinstellungen().ton === "an";
  useEffect(() => {
    if (!an) return;
    document.addEventListener("pointerdown", entsperreTon);
    return () => document.removeEventListener("pointerdown", entsperreTon);
  }, [an]);
}

function Hauptrahmen() {
  const { ansicht, navigiere } = useNavigation();
  useTonEntsperren();
  useEffect(() => {
    const ziel = ansichtZumSprung(window.location.hash);
    if (!ziel) return;
    window.history.replaceState(window.history.state, "", window.location.pathname);
    navigiere(ziel);
    // Nur beim Start: Die Navigation ändert sich danach, der Sprung soll nicht wiederkommen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="rahmen">
      <UpdateHinweis />
      <SicherungsHinweis />
      <Speicherhinweis />
      <main className="inhalt">
        <Bildschirm ansicht={ansicht} />
      </main>
      <Leiste />
    </div>
  );
}

export function App() {
  return (
    <NavigationsRahmen start="buch">
      <Hauptrahmen />
    </NavigationsRahmen>
  );
}
