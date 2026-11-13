/**
 * Was ein Dialog in der Welt bewirkt (externe Funktionen in Ink, dialog/geschichte.ts): Fund,
 * Karte, Szene, Zustand, Steckbrief, Tönung und Bezahlen wirken sofort auf den Spielstand; Partie, Runde,
 * Gedächtnisstellung, Simultan, Vorführung, Laden, Reise und Abspann merkt sich die Oberwelt und
 * startet sie, wenn der Dialog zu ist.
 *
 * Rolle im Gesamtbild: Ausgelagert aus oberwelt/Oberwelt.tsx (Aufteilen, Schritt 2), damit der
 * Bildschirm unter die Größengrenze kommt. Keine eigenen Zustände: Spielstand, Welt und die Merker
 * kommen über den Kontext.
 * Abhängigkeiten: regeln/funde.ts, regeln/quests.ts, regeln/dialogvariablen.ts, oberwelt/auftraege.ts,
 * oberwelt/toenung.ts, texte/texte.ts.
 */
import type { Wirkungen } from "../dialog/geschichte";
import { variablenNachFund } from "../regeln/dialogvariablen";
import { mitFund } from "../regeln/funde";
import { bezahle } from "../regeln/muenzen";
import { wendeWirkungenAn } from "../regeln/quests";
import type { Partieauftrag } from "../schnittstelle/partie";
import type { Abenteuerstand } from "../schnittstelle/spielstand";
import { tSpiel } from "../texte/texte";
import { auftragFuer } from "./auftraege";
import { aktuelleToenung, toenungsvariable, type Toenung } from "./toenung";
import type { Weltdaten } from "./weltdaten";

/** Ein veränderbarer Merker (wie ein React-Ref). */
interface Merker<T> {
  current: T;
}

/** Was nach dem Dialog geschehen soll; die Oberwelt liest es in beiDialogende. */
export interface Nachdialogmerker {
  readonly abspann: Merker<boolean>;
  readonly laden: Merker<string | null>;
  readonly auftrag: Merker<Partieauftrag | null>;
  readonly runde: Merker<string | null>;
  readonly gedaechtnis: Merker<string | null>;
  readonly simultan: Merker<string | null>;
  readonly vorfuehrung: Merker<string | null>;
  readonly reise: Merker<{ karte: string; ausloeser: string } | null>;
}

/** Was die Wirkungen von der Oberwelt brauchen. */
export interface Wirkungskontext {
  /** Der aktuelle Spielstand (auch mitten in einem Dialog frisch). */
  readonly stand: () => Abenteuerstand;
  readonly welt: Weltdaten | null;
  readonly schreibe: (neu: Abenteuerstand) => void;
  readonly meldung: (text: string) => void;
  /** Neue Tönung zeigen (Zustand der Hülle und Szene). */
  readonly toenung: (toenung: Toenung | null) => void;
  /** Die Merker; als Funktion, damit die Oberwelt ihre Refs nicht beim Zeichnen weitergibt. */
  readonly merker: () => Nachdialogmerker;
}

/** Ein Fund: in den Spielstand, Variable gefunden<Fund> setzen, Meldung zeigen (E1, E4). */
function gibFund(k: Wirkungskontext, kennung: string): void {
  const aktuell = k.stand();
  const fund = k.welt?.daten.funde.find((f) => f.kennung === kennung);
  const mit = mitFund(aktuell, kennung, new Date(), fund?.muenzen ?? 0);
  if (mit === aktuell) return;
  k.schreibe({
    ...mit,
    dialogvariablen: { ...mit.dialogvariablen, ...variablenNachFund(kennung) },
  });
  k.meldung(
    tSpiel(fund?.extra ? "fund.gefundenExtra" : "fund.gefunden", {
      name: tSpiel(fund?.name ?? kennung),
    }),
  );
}

/** Tönung der aktuellen Karte setzen: Dialogvariable toenung.<karte>, dann anzeigen. */
function setzeToenung(k: Wirkungskontext, name: string): void {
  const welt = k.welt;
  if (!welt) return;
  const aktuell = k.stand();
  const neu = { ...aktuell.dialogvariablen, [toenungsvariable(welt.kennung)]: name };
  k.schreibe({ ...aktuell, dialogvariablen: neu });
  const eintrag = welt.ort.karten.find((x) => x.kennung === welt.kennung);
  k.toenung(aktuelleToenung(welt.karte, welt.kennung, neu, eintrag));
}

/**
 * Die Wirkungen eines Dialogs für die Geschichte (dialog/geschichte.ts).
 * Beispiel: gibFund("finchLaeuferA") schreibt den Fund und zeigt „Gefunden: Läufer aus Buchsbaum“.
 */
export function dialogwirkungen(k: Wirkungskontext): Wirkungen {
  const m = k.merker;
  const mitWirkung = (w: Parameters<typeof wendeWirkungenAn>[1][number]) =>
    k.schreibe(wendeWirkungenAn(k.stand(), [w], new Date()));
  return {
    zeigeAbspann: () => {
      m().abspann.current = true;
    },
    oeffneLaden: (kennung) => {
      m().laden.current = kennung;
    },
    gibFund: (kennung) => gibFund(k, kennung),
    gibKarte: (kennung) => mitWirkung({ art: "karte", karte: kennung }),
    setzeSzene: (szene) => {
      const aktuell = k.stand();
      k.schreibe({ ...aktuell, handlung: { ...aktuell.handlung, szene } });
    },
    beginnePartie: (begegnung) => {
      if (k.welt) m().auftrag.current = auftragFuer(begegnung, k.welt.daten, k.stand());
    },
    beginneAufgaben: (runde) => {
      m().runde.current = runde;
    },
    beginneGedaechtnis: (kennung) => {
      m().gedaechtnis.current = kennung;
    },
    beginneSimultan: (kennung) => {
      m().simultan.current = kennung;
    },
    zeigeVorfuehrung: (kennung) => {
      m().vorfuehrung.current = kennung;
    },
    reise: (karte, ausloeser) => {
      m().reise.current = { karte, ausloeser };
    },
    setzeToenung: (name) => setzeToenung(k, name),
    zahle: (muenzen) => {
      const aktuell = k.stand();
      const bezahlt = bezahle(aktuell, muenzen);
      if (bezahlt !== aktuell) k.schreibe(bezahlt);
    },
    setzeZustand: (gegner, faktor, grund) => mitWirkung({ art: "zustand", gegner, faktor, grund }),
    schalteSteckbrief: (gegner, zeile) => mitWirkung({ art: "steckbrief", gegner, zeile }),
  };
}
