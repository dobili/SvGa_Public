/**
 * Hülle der App: zeigt die oberste Ansicht des Stapels, die Leiste, den Update-Hinweis, den
 * Hinweis auf die Datensicherung und den Hinweis bei Speicherfehlern. Ist der Ton an, weckt jede
 * Berührung den Tonerzeuger (Vorgabe von Safari, app/ton.ts).
 *
 * Rolle im Gesamtbild: Oberste Komponente (Konzept 6.6). Kennt alle Bildschirme, aber keine
 * Schachlogik. Die App liegt unter /app/ und startet immer direkt; Installation und Buch stellt
 * die statische Startseite unter / vor (Entscheidung 15.10.2026). Die Adresse /app/#lizenzen
 * (Fußzeile der Startseite) öffnet gleich die Lizenzen, /app/#abb-6.20 (Trainingsseiten der
 * Website) gleich die Abbildung, /app/#aufgaben die Aufgabenseite des Autors. Ohne solches
 * Sprungziel macht die App dort weiter, wo der Leser war (V2, app/stapelMerker.ts).
 * Hier liegen auch die Tour-Ebene und der Hinweis beim ersten Start (tour/, P8, R52), unter der
 * Startanimation, damit die Frage nach dem Rundgang erst nach ihr zu sehen ist.
 * Jeder Bildschirm steht in einer eigenen Fehlergrenze (app/Bildschirmgrenze.tsx, V7,
 * Nutzungsprüfung 25.10.2026): Stürzt er ab, bleiben Leiste und Navigation.
 * Abhängigkeiten: Navigation, Bildschirme, Komponenten, Tour.
 */
import { useEffect, useState } from "react";
import { useAnzeigesatz } from "../ui/komponenten/einstellungen/maiastand";
import { Ringfeier } from "../ui/komponenten/fortschritt/Ringfeier";
import { Abbildung } from "../ui/bildschirme/Abbildung";
import { Buch } from "../ui/bildschirme/Buch";
import { Ich } from "../ui/bildschirme/Ich";
import { Einstellungen } from "../ui/bildschirme/Einstellungen";
import { Kapitel } from "../ui/bildschirme/Kapitel";
import { Lernsammlung } from "../ui/bildschirme/Lernsammlung";
import { Checkliste } from "../ui/bildschirme/Checkliste";
import { Steckbriefe } from "../ui/bildschirme/Steckbriefe";
import { Werkzeuguebersicht } from "../ui/bildschirme/Werkzeuguebersicht";
import { Denkroutine } from "../ui/bildschirme/Denkroutine";
import { Begriff, Glossar } from "../ui/bildschirme/Glossar";
import { Nachschlagen } from "../ui/bildschirme/Nachschlagen";
import { Training } from "../ui/bildschirme/Training";
import { Trainer } from "../ui/bildschirme/Trainer";
import { Uebung } from "../ui/bildschirme/Uebung";
import { Partie } from "../ui/bildschirme/Partie";
import { Spielen } from "../ui/bildschirme/Spielen";
import { Lizenzen } from "../ui/bildschirme/Lizenzen";
import { AutorAufgaben } from "../ui/bildschirme/AutorAufgaben";
import { AufgabenRueckweg } from "../ui/komponenten/rahmen/AufgabenRueckweg";
import { Leiste } from "../ui/komponenten/rahmen/Leiste";
import { Speicherhinweis } from "../ui/komponenten/hinweise/Speicherhinweis";
import { SafariHinweis } from "../ui/komponenten/hinweise/SafariHinweis";
import { Startanimation } from "../ui/komponenten/rahmen/Startanimation";
import { SicherungsHinweis } from "../ui/komponenten/hinweise/SicherungsHinweis";
import { UpdateHinweis } from "../ui/komponenten/hinweise/UpdateHinweis";
import { Bildschirmgrenze } from "./Bildschirmgrenze";
import { useEinstellungen } from "./einstellungen";
import { NavigationsRahmen } from "./navigation";
import { useNavigation } from "./navigationsKontext";
import { neuerStapel, type Ansicht, type Stapel } from "./stapel";
import { gesicherterStapel } from "./stapelMerker";
import { entsperreTon } from "./ton";
import { useSprache } from "./sprachwahl";
import { TourAngebot } from "../tour/TourAngebot";
import { TourEbene } from "../tour/TourEbene";

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
    case "steckbriefe":
      return <Steckbriefe />;
    case "werkzeuge":
      return <Werkzeuguebersicht />;
    case "lernsammlung":
      return <Lernsammlung />;
    case "spielen":
      return <Spielen startFen={ansicht.startFen} abbildung={ansicht.abbildung} />;
    case "partie":
      return <Partie key={ansicht.id} id={ansicht.id} />;
    case "ich":
      return <Ich />;
    case "einstellungen":
      return <Einstellungen />;
    case "lizenzen":
      return <Lizenzen />;
    case "autoraufgaben":
      return __VEROEFFENTLICHUNG__ ? <Ich /> : <AutorAufgaben />;
    case "uebung":
      return (
        <Uebung key={ansicht.id} kapitel={ansicht.kapitel} id={ansicht.id} reihe={ansicht.reihe} />
      );
    case "trainer":
      return <Trainer key={ansicht.kennung} kennung={ansicht.kennung} />;
  }
}

/** Schlüssel der Fehlergrenze: Jeder andere Bildschirm (oder Neuversuch) beginnt ohne Fehler. */
function grenzschluessel(stapel: Stapel, versuch: number): string {
  return [stapel.bereich, stapel.ansichten.length, JSON.stringify(stapel.ansichten.at(-1)), versuch]
    .map(String)
    .join("|");
}

/**
 * Der sichtbare Bildschirm in seiner Fehlergrenze (V7).
 * „Zurück“ auf der Absturzseite geht eine Ansicht zurück; auf der ersten Ansicht des Bereichs
 * beginnt der Bereich neu (ein Neuversuch, der die Grenze über den Schlüssel zurücksetzt). Der
 * Schlüssel ist kein React-`key`: Der Bildschirm soll bei jedem Schritt erhalten bleiben.
 */
function GeschuetzterBildschirm() {
  const { stapel, ansicht, zurueck, wechsleBereich } = useNavigation();
  const [versuch, setzeVersuch] = useState(0);
  const beiZurueck = () => {
    if (stapel.ansichten.length > 1) {
      zurueck();
      return;
    }
    wechsleBereich(stapel.bereich);
    setzeVersuch((alt) => alt + 1);
  };
  return (
    <Bildschirmgrenze schluessel={grenzschluessel(stapel, versuch)} beiZurueck={beiZurueck}>
      <Bildschirm ansicht={ansicht} />
    </Bildschirmgrenze>
  );
}

/** Sprungziel in der Adresse, das gleich eine Ansicht öffnet (Fußzeile der Startseite). */
const SPRUNG_LIZENZEN = "#lizenzen";
/** Aufgabenseite des Autors am Rechner, wo es keinen langen Druck gibt (seit 0.2.75). */
const SPRUNG_AUFGABEN = "#aufgaben";
/** Sprung zu einer Abbildung von den Trainingsseiten der Website, etwa „#abb-6.20“ (16.10.2026). */
const SPRUNG_ABBILDUNG = /^#abb-(\d{1,2}\.\d{1,3})$/;

/** Die Ansicht zu einem Sprungziel der Adresse, oder null. Beispiel: „#abb-6.20“ → Abb. 6.20. */
function ansichtZumSprung(hash: string): Ansicht | null {
  if (hash === SPRUNG_LIZENZEN) return { bildschirm: "lizenzen" };
  if (hash === SPRUNG_AUFGABEN && !__VEROEFFENTLICHUNG__) return { bildschirm: "autoraufgaben" };
  const abbildung = SPRUNG_ABBILDUNG.exec(hash)?.[1];
  return abbildung ? { bildschirm: "abbildung", nummer: abbildung } : null;
}

/**
 * Der Stapel beim Start: Ein Sprungziel in der Adresse beginnt beim Buch (der Sprung folgt in
 * Hauptrahmen); sonst der gesicherte Stapel, wenn er sich wiederherstellen lässt (V2), und im
 * Zweifel das Buch wie bisher. Auch ein Sprachwechsel baut den Rahmen neu auf und bleibt so auf
 * dem Bildschirm, auf dem der Leser die Sprache gewählt hat.
 */
function anfangsstapel(): Stapel {
  if (ansichtZumSprung(window.location.hash)) return neuerStapel("buch");
  return gesicherterStapel() ?? neuerStapel("buch");
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
  const { navigiere } = useNavigation();
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
      <SafariHinweis />
      <Speicherhinweis />
      <main className="inhalt">
        <GeschuetzterBildschirm />
      </main>
      <AufgabenRueckweg />
      <Leiste />
      {/* Gratulation bei einem vollen Ring des Fortschritts (seit 0.2.144). */}
      <Ringfeier />
      <TourAngebot />
      <TourEbene />
      <Startanimation />
    </div>
  );
}

/**
 * Die App. Ein Sprachwechsel (seit 0.2.94) baut die ganze Oberfläche neu auf: Jeder Text und
 * jede geladene Datei gehört zur Sprache, und so bleibt nichts von der alten stehen.
 */
export function App() {
  const sprachcode = useSprache();
  // Zahlensatz der Bot-Stärke (ohne oder mit Maia) vor allen Bildschirmen einstellen (0.2.143).
  useAnzeigesatz();
  return (
    <NavigationsRahmen key={sprachcode} anfang={anfangsstapel}>
      <Hauptrahmen />
    </NavigationsRahmen>
  );
}
