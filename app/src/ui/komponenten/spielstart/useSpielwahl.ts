/**
 * Hook für jede Seite von „Spielen“: hält Stellung und Wahl, merkt die Vorlieben sofort und
 * beginnt die Partie.
 *
 * Rolle im Gesamtbild: Die Startseite und alle Unterseiten (Entwurf J3) teilen dieselbe Wahl aus
 * den gespeicherten Vorlieben. Die Wahl von Gegner, Stufen, Uhr und Hilfen gilt sofort als
 * Vorliebe, nicht erst beim Beginnen; sonst stand die eigene Stufe nach einem Wechsel wieder auf
 * 1 · 1 · 1 (Befund zu N801, 26.10.2026). Farbe und Eröffnung gelten nur auf dieser Seite.
 * Abhängigkeiten: spiel/partie.ts, spiel/boteroeffnung.ts, speicher/, Navigation, spielwahl.ts,
 * uhrwahl.ts, bildschirme/gegnerprofil.ts, Maia-Stand.
 */
import { useState } from "react";
import { useNavigation } from "../../../app/navigationsKontext";
import { eroeffnungFuerPartie } from "../../../spiel/boteroeffnung";
import { EROEFFNUNG_PRAXIS, neuePartie } from "../../../spiel/partie";
import {
  mitLaufender,
  mitProbe,
  mitVorlieben,
  type Spielvorlieben,
} from "../../../speicher/partien";
import type { Probeherkunft } from "../../../spiel/probepartie";
import { aendere, useSpeicher } from "../../../speicher/speicher";
import { gegnerprofil } from "../../bildschirme/gegnerprofil";
import { useMaiaAktiv } from "../einstellungen/maiastand";
import {
  GRUNDSTELLUNG,
  OHNE_HILFEN,
  neueKennung,
  seiteAmZug,
  wirdGewertet,
  type Wahl,
} from "./spielwahl";
import { wirksameUhr } from "./uhrwahl";

/** Was eine Seite von „Spielen“ in der Hand hat. */
export interface Spielwahl {
  readonly fen: string;
  /** Die Abbildung, solange ihre Stellung unverändert ist; sonst undefined. */
  readonly abbildung: string | undefined;
  readonly wahl: Wahl;
  /** Neue Wahl; geänderte Vorlieben kommen gleich in den Speicher. */
  readonly setze: (wahl: Wahl) => void;
  /** Ändert einen Teil der Vorlieben. */
  readonly mit: (teil: Partial<Spielvorlieben>) => void;
  /** Eine eigene Stellung übernehmen; der Leser spielt zunächst die Seite am Zug. */
  readonly uebernimm: (fen: string) => void;
  /** Beginnt die Partie mit dieser Wahl (oder einer abgewandelten, etwa dem Vorschlag). */
  readonly beginne: (wahl: Wahl) => void;
}

/** Die Wahl beim Öffnen: Vorlieben, Seite am Zug, Eröffnung wie Menschen (seit 0.2.128). */
function anfangswahl(fen: string, vorlieben: Spielvorlieben): Wahl {
  return {
    farbe: seiteAmZug(fen),
    vorlieben,
    eroeffnung: EROEFFNUNG_PRAXIS,
    ueberschreiben: false,
  };
}

/** Legt die Partie an, merkt die Vorlieben und öffnet die Partie. */
function useBeginne(
  fen: string,
  abbildung: string | undefined,
  probe?: Probeherkunft,
): (wahl: Wahl) => void {
  const { navigiere } = useNavigation();
  const eigene = useSpeicher((z) => z.daten.spiel.eigeneGegner);
  // Seit 0.2.143: mit Maia, wenn das Paket geladen und eingeschaltet ist (gilt für die Partie).
  const mitMaia = useMaiaAktiv();
  return (wahl) => {
    const v = wahl.vorlieben;
    const engine = v.gegner === "engine";
    const bot = engine ? v.bot : null;
    // Eine Probepartie (Format 8) zählt nie, also auch nicht für die Wertung.
    const gewertet = !probe && wirdGewertet(fen, v);
    const einstellung = {
      ...gegnerprofil(bot, eigene, v),
      startFen: fen,
      eigeneFarbe: wahl.farbe,
      stufe: v.stufenJePhase.mittelspiel,
      stufenJePhase: v.stufenJePhase,
      uhr: wirksameUhr(fen, v.uhr),
      // Gewertete Partien: keine Rücknahme und keine Spielhilfen (Wunsch des Autors zu S9).
      ruecknahmeErlaubt: v.ruecknahmeErlaubt && !gewertet,
      abbildung: abbildung ?? null,
      // Paket 9: Ein eigener Bot mit festen Eröffnungen wählt je Partie eine, außer mit Haken.
      eroeffnung:
        fen === GRUNDSTELLUNG && engine
          ? eroeffnungFuerPartie(
              {
                botEroeffnungen: eigene.find((g) => g.kennung === bot)?.eroeffnungen ?? [],
                ueberschreiben: wahl.ueberschreiben,
                global: wahl.eroeffnung,
              },
              Math.random,
            )
          : null,
      gegner: v.gegner,
      bot,
      ...(mitMaia && engine ? { maia: true } : {}),
      hilfen: gewertet ? OHNE_HILFEN : v.hilfen,
      // Nur Partien gegen die Engine aus der Grundstellung zählen (Wunsch des Autors).
      gewertet,
      ...(probe ? { probe } : {}),
    };
    const partie = neuePartie(einstellung, neueKennung(), new Date().toISOString());
    if (!partie) return;
    const ablage = probe ? mitProbe : mitLaufender;
    void aendere((d) => ({ ...d, spiel: ablage(mitVorlieben(d.spiel, v), partie) }));
    navigiere({ bildschirm: "partie", id: partie.id });
  };
}

/**
 * Der Hook. Eingaben: Stellung und Abbildung aus der Ansicht (ohne: Grundstellung).
 * Beispiel: aus Abb. 1.26 → fen der Abbildung, Farbe am Zug, Abbildung „1.26“.
 */
export function useSpielwahl(
  startFen: string | undefined,
  abbildung: string | undefined,
  probe?: Probeherkunft,
): Spielwahl {
  const vorlieben = useSpeicher((z) => z.daten.spiel.vorlieben);
  const [fen, setzeFen] = useState(startFen ?? GRUNDSTELLUNG);
  // Probepartie aus einer Auswertung: die Farbe, die der Leser in der Partie hatte (umstellbar).
  const [wahl, setzeWahl] = useState<Wahl>(() => {
    const anfang = anfangswahl(fen, vorlieben);
    return probe?.art === "partie" ? { ...anfang, farbe: probe.farbe } : anfang;
  });
  // Die Vorlieben können sich auch woanders ändern (Vorbelegung, Eigene Stufe schreibt selbst):
  // Dann gilt der Speicher (Zustand beim Zeichnen angleichen, wie in der React-Doku).
  const [gesehen, setzeGesehen] = useState(vorlieben);
  if (gesehen !== vorlieben) {
    setzeGesehen(vorlieben);
    setzeWahl({ ...wahl, vorlieben });
  }
  const aktuell = wahl;
  const setze = (neu: Wahl) => {
    // Ein anderer Bot bringt seine eigenen Eröffnungen mit: das Überschreiben gilt nur dem alten.
    const andererBot = neu.vorlieben.bot !== aktuell.vorlieben.bot;
    setzeWahl(andererBot ? { ...neu, ueberschreiben: false } : neu);
    if (neu.vorlieben !== aktuell.vorlieben)
      void aendere((d) => ({ ...d, spiel: mitVorlieben(d.spiel, neu.vorlieben) }));
  };
  const abbildungGilt = fen === startFen ? abbildung : undefined;
  return {
    fen,
    abbildung: abbildungGilt,
    wahl: aktuell,
    setze,
    mit: (teil) => setze({ ...aktuell, vorlieben: { ...aktuell.vorlieben, ...teil } }),
    uebernimm: (neu) => {
      setzeFen(neu);
      setzeWahl({ ...aktuell, farbe: seiteAmZug(neu) });
    },
    beginne: useBeginne(fen, abbildungGilt, probe),
  };
}

/**
 * Eine Spielwahl mit anderen Vorlieben (die der Seite); Änderungen im Blatt gehen von diesen aus.
 * Beispiel: Seite „Eigene Stufe“ → dieselbe Wahl mit bot null.
 */
export function abgeleitet(sw: Spielwahl, vorlieben: Spielvorlieben): Spielwahl {
  const wahl = { ...sw.wahl, vorlieben };
  return {
    ...sw,
    wahl,
    mit: (teil) => sw.setze({ ...wahl, vorlieben: { ...vorlieben, ...teil } }),
  };
}
