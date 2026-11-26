/**
 * Dialoge der Oberwelt: öffnen, Wirkungen an Ink geben (dialogwirkungen.ts) und nach dem Ende
 * ausführen, was der Dialog angestoßen hat: Variablen sichern, Reise, Abspann, Laden, Übergang mit
 * Bedingung, Vorführung, Simultan, Gedächtnisstellung, Aufgabenrunde oder Partie (in dieser
 * Reihenfolge; die ersten vier schließen einander nicht aus, ab der Vorführung gilt nur eins).
 *
 * Rolle im Gesamtbild: Ausgelagert aus oberwelt/Oberwelt.tsx (Aufteilen, Schritt 5). Arbeitet auf
 * dem gemeinsamen Kern (kern.ts) und startet Partien und Runden über usePartiestart.ts und
 * useAufgabenrunde.ts.
 * Abhängigkeiten: regeln/dialogvariablen.ts, oberwelt/dialogwirkungen.ts, oberwelt/weltdaten.ts,
 * dialog/stillesende.ts (Übergang ohne Text: kein Fenster).
 */
import { useRef, useState } from "react";
import type { Dialogvariablen, Wirkungen } from "../dialog/geschichte";
import { stillesEnde } from "../dialog/stillesende";
import { erfuellt } from "../regeln/bedingung";
import { bedingteFigurUmgeschlagen } from "../regeln/figurbedingung";
import { begleiterFuer, begleiterGeaendert } from "../regeln/gefolge";
import { variablenAusBesitz, variablenNachDialog } from "../regeln/dialogvariablen";
import type { Abenteuerstand } from "../schnittstelle/spielstand";
import { tSpiel } from "../texte/texte";
import { dialogwirkungen, type Nachdialogmerker } from "./dialogwirkungen";
import { szeneAus, type Oberweltkern } from "./kern";
import { AUFTRITT } from "./auftrittsbild";
import { mitGemerktemDialog } from "./nachergebnis";
import type { Runden } from "./useAufgabenrunde";
import type { Partien } from "./usePartiestart";
import { ladeDialog, type Weltdaten } from "./weltdaten";

/** Dialogvariablen, wie die Bedingungen sie lesen. */
type Variablen = Readonly<Record<string, unknown>>;

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
  /**
   * Ein neuer Knoten des offenen Dialogs: erst die Variablen aus Ink sichern (Zwischenstand), dann
   * das Quest-Ereignis melden, damit beide zusammen im Stand stehen.
   */
  readonly beiKnoten: (knoten: string, variablen: Dialogvariablen) => void;
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
/**
 * Stehen nach einem Gespräch andere Begleiter auf der Karte als beim Aufbau (Dialogvariable oder
 * Bedingung des Orts, regeln/gefolge.ts)? In Erinnerungen nie.
 */
function begleiterNeu(w: Weltdaten | null, variablen: Readonly<Record<string, unknown>>): boolean {
  if (!w || w.ort.art === "erinnerung") return false;
  return begleiterGeaendert(w.begleiter, begleiterFuer(w.ort.begleiter, variablen));
}

/**
 * Kommt oder geht durch das Gespräch eine Figur dieses Orts mit Bedingung (regeln/figurbedingung.ts)?
 * Beispiel: Hale und {rivale} verlassen den Clubraum, sobald kenntHale gilt. Dazu `auftritt.wartet`
 * (regeln/auftritt.ts): Wartet eine Figur noch am Übergang (`wartetNoch`, kein `#gehe` hat sie
 * geholt), kommt sie nach dem Neuaufbau herein; wer schon hereinkam, bleibt ohne Neuaufbau stehen.
 */
function figurenNeu(
  w: Weltdaten | null,
  staende: { readonly vorher: Variablen; readonly nachher: Variablen },
  wartetNoch: (name: string) => boolean,
): boolean {
  if (!w) return false;
  const wartende = w.ort.figuren.filter((f) =>
    wartetNoch(f.kennung.slice(f.kennung.indexOf(".") + 1)),
  );
  return bedingteFigurUmgeschlagen(
    [...w.ort.figuren.map((f) => f.wenn), ...wartende.map((f) => f.auftritt?.wartet)],
    staende.vorher,
    staende.nachher,
  );
}

export function useDialogende(k: Oberweltkern, partie: Partien, runden: Runden): Dialoge {
  const [dialog, setzeDialog] = useState<OffenerDialog | null>(null);
  const [abspann, setzeAbspann] = useState(false);
  const [fensterbank, setzeFensterbank] = useState(false);
  const [tagebuchseite, setzeTagebuchseite] = useState<string | null>(null);
  const [offenerLaden, setzeOffenerLaden] = useState<string | null>(null);
  const [vorfuehrung, setzeVorfuehrung] = useState<string | null>(null);
  // Dialogvariablen beim Öffnen des Dialogs: Was die Hülle danach setzt, überschreibt Ink nicht.
  const variablenBeimOeffnen = useRef<Abenteuerstand["dialogvariablen"]>({});
  // Zuletzt gesicherte Variablen aus Ink (Zwischenstand): keine Änderung der Hülle.
  const zuletztAusInk = useRef<Abenteuerstand["dialogvariablen"]>({});
  // Ein Übergang mit Dialog (orte.json `dialog`, `wenn`): der Wechsel folgt nach dem Dialog.
  const uebergang = useRef<{ ziel: Ziel; wenn: string | null } | null>(null);
  // Der zuletzt geöffnete Dialog („datei.knoten“), für die Rückmeldung nach dem Ergebnis.
  const geoeffnet = useRef<string | null>(null);
  const m = useMerker();
  /**
   * Öffnet den Dialog. Mit `amUebergang` fragt es Ink zuerst zur Probe (dialog/stillesende.ts):
   * Sagt der Knoten nichts (offene Wegsperre), folgt gleich das Dialogende mit dem Kartenwechsel,
   * ohne Fenster.
   */
  const oeffneDialog = (verweis: string, amUebergang = false) => {
    const [datei, knoten] = verweis.split(".", 2);
    if (!datei || !knoten) return;
    geoeffnet.current = verweis;
    variablenBeimOeffnen.current = k.standRef.current?.dialogvariablen ?? {};
    zuletztAusInk.current = {};
    ladeDialog(datei)
      .then((geladen) => {
        const json = JSON.stringify(geladen);
        const stand = k.standRef.current;
        const still =
          amUebergang && stand
            ? stillesEnde(
                json,
                knoten,
                { ...stand.dialogvariablen, ...variablenAusBesitz(stand) },
                stand.held.name,
              )
            : null;
        if (still) return beiDialogende(still);
        // Meldungen aus dem Dialog (Quest, Fund) warten bis zu seinem Ende (meldungsstau.ts).
        k.dialogOffen(true);
        setzeDialog({ json, datei, knoten });
      })
      .catch(() => k.setzeMeldung(tSpiel("oberwelt.dialogFehlt", { datei })));
  };
  /** Stand mit den Variablen aus Ink (Hülle gewinnt, regeln/dialogvariablen.ts); null ohne Stand. */
  const mitVariablen = (variablen: Dialogvariablen): Abenteuerstand | null => {
    const aktuell = k.standRef.current;
    if (!aktuell) return null;
    const dialogvariablen = variablenNachDialog(
      variablenBeimOeffnen.current,
      aktuell.dialogvariablen,
      variablen,
      zuletztAusInk.current,
    );
    zuletztAusInk.current = variablen;
    return { ...aktuell, dialogvariablen };
  };
  // Zwischenstand bei jedem neuen Knoten (Befund der Chaos-Simulation, 14.11.2026): Quest-Schritte
  // schreibt melde sofort, die Variablen kamen erst am Ende. Wer mitten im Dialog neu lud, trennte
  // beide (ironwood.mamasFinale: Schritt da, mamaFotoGesehen weg, Mama erschien nie). Nur die
  // Variablen: Die Folgen nach dem Dialog (Reise, Laden, Partie) bleiben beim Ende.
  const sichereVariablen = (variablen: Dialogvariablen) => {
    const neu = mitVariablen(variablen);
    if (neu) k.schreibe(neu);
  };
  const beiDialogende = (variablen: Dialogvariablen) => {
    setzeDialog(null);
    k.dialogOffen(false);
    const ohneDialog = mitVariablen(variablen);
    if (!ohneDialog) return;
    // Startet der Dialog eine Folge, öffnet er sich nach dem Ergebnis wieder (nachergebnis.ts).
    const folgeStartet = Boolean(
      m.auftrag.current || m.runde.current || m.simultan.current || m.gedaechtnis.current,
    );
    // Das Gespräch ist zu Ende: Eine offene Rückmeldung gilt als gelesen (nachergebnis.ts).
    const gelesen = { ...ohneDialog, rueckmeldungOffen: null };
    const neu = mitGemerktemDialog(gelesen, geoeffnet.current, folgeStartet);
    k.schreibe(neu);
    const reise = nimm(m.reise, null);
    if (reise) k.wechsleKarte(reise.karte, reise.ausloeser);
    // Neuer Begleiter (regeln/gefolge.ts) oder eine Figur, deren Bedingung umschlug: Die Karte
    // stellt sich neu auf (wer zur Tür ging, ist dann fort und versperrt sie nicht mehr).
    else if (
      begleiterNeu(k.weltRef.current, neu.dialogvariablen) ||
      figurenNeu(
        k.weltRef.current,
        { vorher: variablenBeimOeffnen.current, nachher: neu.dialogvariablen },
        (name) => szeneAus(k.spiel)?.children.getByName(name)?.getData(AUFTRITT) === "wartet",
      )
    )
      k.stelleNeuAuf();
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
    oeffneDialog: (verweis) => oeffneDialog(verweis),
    oeffneUebergang: (verweis, ziel, wenn) => {
      uebergang.current = { ziel, wenn };
      oeffneDialog(verweis, true);
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
    beiKnoten: (knoten, variablen) => {
      sichereVariablen(variablen);
      if (dialog) k.melde({ art: "dialog", knoten: `${dialog.datei}.${knoten}` });
    },
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
