/**
 * Die Dienste der App für das Abenteuer (Vertrag Appdienste in schnittstelle/modul.ts).
 *
 * Rolle im Gesamtbild: Diese Datei ist die App-Seite der Modulgrenze (04_Architektur.md,
 * Abschnitt 1). Nur sie importiert Speicher, Navigation und Partielogik der App; das geladene
 * Modul bekommt das fertige Objekt über `verbinde` und kennt die App sonst nicht. Lebt in der
 * Hülle (AbenteuerAnsicht.tsx) als Hook, weil Navigation und Maia-Stand Hooks sind.
 * Abhängigkeiten: speicher/speicher.ts, speicher/partien.ts, spiel/partie.ts,
 * app/navigationsKontext.ts, einstellungen/maiastand.ts, paket/paketlader.ts,
 * anbindung/partiestart.ts, anbindung/partieergebnis.ts, regeln/gegnerstaerke.ts.
 */
import { useMemo } from "react";
import { useNavigation } from "../../app/navigationsKontext";
import { findePartie, mitLaufender } from "../../speicher/partien";
import { aendere, speicherzustand, useSpeicher } from "../../speicher/speicher";
import { neuePartie } from "../../spiel/partie";
import { aktuelleWertung } from "../../spiel/wertung";
import { useMaiaAktiv } from "../../ui/komponenten/einstellungen/maiastand";
import { neueKennung } from "../../ui/komponenten/spielstart/spielwahl";
import { auswertungsEngine } from "../../engine/engineDienst";
import { wertFuer } from "../../engine/fallenurteil";
import { ladePaket, paketzustand } from "../paket/paketlader";
import { ANSICHT_AUFGABEN, type Appdienste } from "../schnittstelle/modul";
import type { Paketzustand } from "../schnittstelle/paket";
import type { Partieauftrag } from "../schnittstelle/partie";
import type { Abenteuerstand } from "../schnittstelle/spielstand";
import { tSpiel } from "../texte/texte";
import { sucheKipppunkt, type Bewerter } from "./kipppunkt";
import { partieeinstellungAus } from "./partiestart";
import { partieergebnisAus } from "./partieergebnis";

/** Rechenzeit und Tiefe je Stellung bei der Kipppunktsuche (klein, damit das Angebot schnell kommt). */
const KIPPPUNKT_MS = 600;
const KIPPPUNKT_TIEFE = 10;

/** Bewertung einer Stellung aus Sicht des Lesers mit der Auswertungs-Engine der App. */
const bewerteFuerKipppunkt: Bewerter = async (fen, farbe) => {
  const bewertung = await auswertungsEngine.bewerte(fen, KIPPPUNKT_MS, 1, {
    art: "tiefe",
    tiefe: KIPPPUNKT_TIEFE,
  });
  const wert = bewertung.varianten[0]?.wert;
  return wert ? wertFuer(wert, farbe) : 0;
};

/** Der letzte bekannte Paketzustand, damit `paket()` sofort antworten kann (Vertrag ist synchron). */
let bekannterPaketzustand: Paketzustand = { art: "fehlt" };

/** Fragt den Paketzustand neu ab und merkt ihn. */
export async function aktualisierePaketzustand(): Promise<Paketzustand> {
  bekannterPaketzustand = await paketzustand();
  return bekannterPaketzustand;
}

/** Der Spielstand aus den Nutzerdaten (null ohne Abenteuer oder solange der Speicher lädt). */
function standJetzt(): Abenteuerstand | null {
  return speicherzustand().daten.abenteuer;
}

/** Der Spielstand reaktiv für die Oberfläche der Hülle. */
export function useAbenteuerstand(): Abenteuerstand | null {
  return useSpeicher((z) => z.daten.abenteuer);
}

/**
 * Legt die Partie zu einem Auftrag an: Einstellung bauen, Partie als laufende Partie ablegen,
 * Kennung im Spielstand merken (damit ein Neuladen mitten in der Partie zurückfindet).
 */
async function legePartieAn(auftrag: Partieauftrag, mitMaia: boolean): Promise<string | null> {
  // Der Name im Profil ist ein Textschlüssel; die Partie zeigt den Namen in der Sprache des Lesers.
  const einstellung = {
    ...partieeinstellungAus(auftrag, mitMaia),
    botName: tSpiel(auftrag.profil.name),
  };
  const partie = neuePartie(einstellung, neueKennung(), new Date().toISOString());
  if (!partie) return null;
  await aendere((d) => ({
    ...d,
    spiel: mitLaufender(d.spiel, partie),
    abenteuer: d.abenteuer ? { ...d.abenteuer, laufendePartie: auftrag.kennung } : d.abenteuer,
  }));
  return partie.id;
}

/** Die beendete Partie einer Begegnung, wo immer die App sie hält (laufend oder in der Liste). */
function findeAbenteuerpartie(kennung: string) {
  const spiel = speicherzustand().daten.spiel;
  const laufend = spiel.laufend;
  if (laufend?.einstellung.abenteuer?.kennung === kennung) return laufend;
  return (
    spiel.partien.find((e) => e.partie.einstellung.abenteuer?.kennung === kennung)?.partie ?? null
  );
}

/** Baut die Dienste; stabil, solange Navigation und Maia-Stand gleich bleiben. */
export function useAppdienste(): Appdienste {
  const { navigiere, zurueck } = useNavigation();
  const mitMaia = useMaiaAktiv();
  return useMemo<Appdienste>(
    () => ({
      wertung: () => aktuelleWertung(speicherzustand().daten.spiel.wertung),
      baueEinstellung: (auftrag) => partieeinstellungAus(auftrag, mitMaia),
      startePartie: async (auftrag) => {
        const id = await legePartieAn(auftrag, mitMaia);
        if (id) navigiere({ bildschirm: "partie", id });
      },
      liesErgebnis: async (kennung) => {
        const partie = findeAbenteuerpartie(kennung);
        const stand = standJetzt();
        const gespielt = stand?.partiekarten?.gespielt ?? [];
        return partie
          ? partieergebnisAus(partie, gespielt, stand?.held.name ?? "", new Date())
          : null;
      },
      zeigePartie: (kennung) => {
        const id = laufendePartieId(kennung);
        if (id) navigiere({ bildschirm: "partie", id });
      },
      sucheKipppunkt: async (kennung) => {
        const partie = findeAbenteuerpartie(kennung);
        return partie ? sucheKipppunkt(partie, bewerteFuerKipppunkt) : null;
      },
      // Aufgabenrunden mit Rückweg kommen mit den Spielsystemen (Schritt 8, Baustein F7).
      // Aufgabenrunde (R30 bis R32): Auftrag in den Spielstand, dann die Zusatzansicht der App;
      // das Ergebnis legt die Ansicht am Ende in den Spielstand, die Oberwelt liest es zurück.
      starteAufgaben: async (auftrag) => {
        await aendere((d) => ({
          ...d,
          abenteuer: d.abenteuer
            ? { ...d.abenteuer, laufendeAufgaben: auftrag, aufgabenergebnis: null }
            : d.abenteuer,
        }));
        navigiere({ bildschirm: "zusatz", kennung: ANSICHT_AUFGABEN, wert: auftrag.kennung });
      },
      liesAufgabenergebnis: async (kennung) => {
        const ergebnis = standJetzt()?.aufgabenergebnis ?? null;
        return ergebnis?.kennung === kennung ? ergebnis : null;
      },
      liesStand: standJetzt,
      schreibeStand: async (stand) => {
        await aendere((d) => ({ ...d, abenteuer: stand }));
      },
      loescheStand: async () => {
        await aendere((d) => ({ ...d, abenteuer: null }));
      },
      paket: () => bekannterPaketzustand,
      ladePaket: async (fortschritt) => {
        await ladePaket(fortschritt);
        await aktualisierePaketzustand();
      },
      zurueck,
    }),
    [navigiere, zurueck, mitMaia],
  );
}

/** Eine laufende Partie des Abenteuers in der App wiederfinden (für „Weiterspielen“). */
export function laufendePartieId(kennung: string): string | null {
  const partie = findeAbenteuerpartie(kennung);
  return partie && !partie.ende ? partie.id : null;
}

export { findePartie };
