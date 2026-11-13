/**
 * Dialoge der Oberwelt: öffnen, Wirkungen an Ink geben (dialogwirkungen.ts) und nach dem Ende
 * ausführen, was der Dialog angestoßen hat: Variablen sichern, Reise, Abspann, Laden, Übergang mit
 * Bedingung, Vorführung, Simultan, Gedächtnisstellung, Aufgabenrunde oder Partie (in dieser
 * Reihenfolge; die ersten vier schließen einander nicht aus, ab der Vorführung gilt nur eins).
 *
 * Rolle im Gesamtbild: Ausgelagert aus oberwelt/Oberwelt.tsx (Aufteilen, Schritt 5). Arbeitet auf
 * dem gemeinsamen Kern (kern.ts) und startet Partien und Runden über usePartiestart.ts und
 * useAufgabenrunde.ts.
 * Abhängigkeiten: regeln/dialogvariablen.ts, oberwelt/dialogwirkungen.ts, oberwelt/weltdaten.ts.
 */
import { useRef, useState } from "react";
import type { Dialogvariablen, Wirkungen } from "../dialog/geschichte";
import { erfuellt } from "../regeln/bedingung";
import { variablenAusBesitz, variablenNachDialog } from "../regeln/dialogvariablen";
import type { Abenteuerstand } from "../schnittstelle/spielstand";
import { tSpiel } from "../texte/texte";
import { dialogwirkungen, type Nachdialogmerker } from "./dialogwirkungen";
import type { Oberweltkern } from "./kern";
import type { Runden } from "./useAufgabenrunde";
import type { Partien } from "./usePartiestart";
import { ladeDialog } from "./weltdaten";

/** Ein offener Dialog: die übersetzte Geschichte, der Knoten und der Name der Datei. */
export interface OffenerDialog {
  readonly json: string;
  readonly datei: string;
  readonly knoten: string;
}

/** Ein Ziel auf einer Karte (Karte und Auslöser, auf dem der Held erscheint). */
interface Ziel {
  readonly karte: string;
  readonly ausloeser: string;
}

/** Was die Oberwelt von den Dialogen sieht und auslöst. */
export interface Dialoge {
  readonly dialog: OffenerDialog | null;
  /** Öffnet den Dialog „datei.knoten“ aus dem Paket. */
  readonly oeffneDialog: (verweis: string) => void;
  /** Erst der Dialog (Abschied, Ankunft, Sperre), dann der Wechsel, wenn `wenn` erfüllt ist. */
  readonly oeffneUebergang: (verweis: string, ziel: Ziel, wenn: string | null) => void;
  readonly wirkungen: Wirkungen;
  readonly beiDialogende: (variablen: Dialogvariablen) => void;
  readonly abspann: boolean;
  readonly schliesseAbspann: () => void;
  /** Fensterbank mit den Funden (T15), nach `zeigeFensterbank()` im Dialog. */
  readonly fensterbank: boolean;
  readonly schliesseFensterbank: () => void;
  /** Tagebuchseite mit Schreibanimation (Name des Eintrags), nach `schreibeTagebuch` im Dialog. */
  readonly tagebuchseite: string | null;
  readonly schliesseTagebuchseite: () => void;
  readonly offenerLaden: string | null;
  readonly schliesseLaden: () => void;
  /** Vorführung (Statist mit `zeigt` oder Dialog), solange das kleine Brett offen ist. */
  readonly vorfuehrung: string | null;
  readonly zeigeVorfuehrung: (kennung: string | null) => void;
}

/** Die Merker der Wirkungen: was nach dem Dialog geschehen soll. */
function useMerker(): Nachdialogmerker {
  return {
    abspann: useRef(false),
    fensterbank: useRef(false),
    tagebuchseite: useRef<string | null>(null),
    laden: useRef<string | null>(null),
    auftrag: useRef(null),
    runde: useRef<string | null>(null),
    gedaechtnis: useRef<string | null>(null),
    simultan: useRef<string | null>(null),
    vorfuehrung: useRef<string | null>(null),
    reise: useRef<Ziel | null>(null),
  };
}

/** Liest einen Merker und leert ihn. */
function nimm<T>(merker: { current: T }, leer: T): T {
  const wert = merker.current;
  merker.current = leer;
  return wert;
}

/** Nach dem Dialog: höchstens eins von Vorführung, Simultan, Gedächtnis, Runde, Partie. */
function starteFolge(
  m: Nachdialogmerker,
  folgen: {
    readonly vorfuehrung: (k: string) => void;
    readonly runden: Runden;
    readonly partie: Partien;
  },
): void {
  const zeigen = nimm(m.vorfuehrung, null);
  const simultan = nimm(m.simultan, null);
  const merken = nimm(m.gedaechtnis, null);
  const runde = nimm(m.runde, null);
  const auftrag = nimm(m.auftrag, null);
  if (zeigen) folgen.vorfuehrung(zeigen);
  else if (simultan) folgen.runden.starteSimultan(simultan);
  else if (merken) folgen.runden.starteGedaechtnis(merken);
  else if (runde) folgen.runden.starteRunde(runde);
  else if (auftrag) folgen.partie.waehleOderStarte(auftrag);
}

/**
 * Dialoge der Oberwelt. Beispiel: Der Dialog mit Jo ruft `beginnePartie("mapleFalls.jo")`; beim
 * Ende sichert `beiDialogende` die Variablen und startet über die Deckwahl die Partie.
 */
export function useDialogende(k: Oberweltkern, partie: Partien, runden: Runden): Dialoge {
  const [dialog, setzeDialog] = useState<OffenerDialog | null>(null);
  const [abspann, setzeAbspann] = useState(false);
  const [fensterbank, setzeFensterbank] = useState(false);
  const [tagebuchseite, setzeTagebuchseite] = useState<string | null>(null);
  const [offenerLaden, setzeOffenerLaden] = useState<string | null>(null);
  const [vorfuehrung, setzeVorfuehrung] = useState<string | null>(null);
  // Dialogvariablen beim Öffnen des Dialogs: Was die Hülle danach setzt, überschreibt Ink nicht.
  const variablenBeimOeffnen = useRef<Abenteuerstand["dialogvariablen"]>({});
  // Ein Übergang mit Dialog (orte.json `dialog`, `wenn`): der Wechsel folgt nach dem Dialog.
  const uebergang = useRef<{ ziel: Ziel; wenn: string | null } | null>(null);
  const m = useMerker();
  const oeffneDialog = (verweis: string) => {
    const [datei, knoten] = verweis.split(".", 2);
    if (!datei || !knoten) return;
    variablenBeimOeffnen.current = k.standRef.current?.dialogvariablen ?? {};
    ladeDialog(datei)
      .then((json) => setzeDialog({ json: JSON.stringify(json), datei, knoten }))
      .catch(() => k.setzeMeldung(tSpiel("oberwelt.dialogFehlt", { datei })));
  };
  const beiDialogende = (variablen: Dialogvariablen) => {
    setzeDialog(null);
    const aktuell = k.standRef.current;
    if (!aktuell) return;
    const vorher = variablenBeimOeffnen.current;
    const dialogvariablen = variablenNachDialog(vorher, aktuell.dialogvariablen, variablen);
    const neu = { ...aktuell, dialogvariablen };
    k.schreibe(neu);
    const reise = nimm(m.reise, null);
    if (reise) k.wechsleKarte(reise.karte, reise.ausloeser);
    if (nimm(m.abspann, false)) setzeAbspann(true);
    if (nimm(m.fensterbank, false)) setzeFensterbank(true);
    const seite = nimm(m.tagebuchseite, null);
    if (seite) setzeTagebuchseite(seite);
    const laden = nimm(m.laden, null);
    if (laden) setzeOffenerLaden(laden);
    const u = nimm(uebergang, null);
    // `wenn` ist eine Bedingung (regeln/bedingung.ts); Besitz zählt mit (hatLaterne,
    // hatGummistiefel: Sperren S4, S8, S9, S11, S14).
    const bedingungen = { ...neu.dialogvariablen, ...variablenAusBesitz(neu) };
    if (u && (!u.wenn || erfuellt(u.wenn, bedingungen)))
      k.wechsleKarte(u.ziel.karte, u.ziel.ausloeser);
    starteFolge(m, { vorfuehrung: setzeVorfuehrung, runden, partie });
  };
  return {
    dialog,
    oeffneDialog,
    oeffneUebergang: (verweis, ziel, wenn) => {
      uebergang.current = { ziel, wenn };
      oeffneDialog(verweis);
    },
    // Die Refs (Spielstand, Merker) liest dialogwirkungen erst, wenn Ink eine Funktion aufruft.
    wirkungen: dialogwirkungen({
      stand: () => k.standRef.current ?? k.stand ?? fehlenderStand(),
      welt: k.welt,
      schreibe: k.schreibe,
      meldung: k.setzeMeldung,
      toenung: k.zeigeToenung,
      merker: () => m,
    }),
    beiDialogende,
    abspann,
    schliesseAbspann: () => setzeAbspann(false),
    fensterbank,
    schliesseFensterbank: () => setzeFensterbank(false),
    tagebuchseite,
    schliesseTagebuchseite: () => setzeTagebuchseite(null),
    offenerLaden,
    schliesseLaden: () => setzeOffenerLaden(null),
    vorfuehrung,
    zeigeVorfuehrung: setzeVorfuehrung,
  };
}

/** Ein Dialog ohne Spielstand kann es nicht geben: Die Oberwelt zeigt dann keinen Dialog. */
function fehlenderStand(): never {
  throw new Error("Dialog ohne Spielstand");
}
