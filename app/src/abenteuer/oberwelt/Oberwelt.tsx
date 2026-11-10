/**
 * Die Oberwelt: Phaser-Karte in einem React-Rahmen mit Steuerkreuz, Dialogfenster, Tagebuch und
 * dem Rückweg aus der Partie (docs/spiel/04_Architektur.md, Abschnitte 3 und 8).
 *
 * Rolle im Gesamtbild: Das ist der Bildschirm des Spiels. Beim Aufbau lädt er Spieldaten und
 * die Karte des Spielstands aus dem Paket, startet Phaser, und prüft, ob eine Partie des
 * Abenteuers offen oder gerade beendet ist (Rückweg: Ergebnis in den Spielstand, Karte zeigen).
 * Auslöser der Karte (Objekte „ausloeser“) werden über orte.json gedeutet: Gegenstand oder Figur
 * → Aktionsknopf → Ink-Dialog; Übergang → Kartenwechsel; der Dialog kann über `beginnePartie`
 * eine Begegnung starten, dann baut diese Datei den Partieauftrag und übergibt ihn den Diensten.
 * Alles, was passiert (Karte betreten, Knoten erreicht, Partie beendet), geht als Ereignis an die
 * Quest-Auswertung (regeln/quests.ts), deren Wirkungen hier in den Spielstand kommen.
 * Nach einer Niederlage sucht die App den Kipppunkt (Regelwerk R14); die Ergebniskarte bietet
 * dann den Wiedereinstieg an, der dieselbe Begegnung ab dieser Stellung neu startet (R15, R20).
 * Aufgabenrunden (R30 bis R32): `beginneAufgaben(runde)` aus dem Dialog baut aus runden.json, dem
 * Club des Ortes und der Wertung den Aufgabenauftrag (regeln/aufgaben.ts); die App spielt ihn, das
 * Ergebnis kommt beim Rückweg zurück, bestanden ab 70 Prozent, sonst eine leichtere Runde.
 * Noch offen (Schritt 8g ff.): Namenswahl, Abenteuerwertung.
 * Abhängigkeiten: oberwelt/szene.ts, oberwelt/Steuerkreuz.tsx, oberwelt/Tagebuch.tsx,
 * dialog/Dialog.tsx, daten/laden.ts, paket/paketlader.ts, regeln/gegnerstaerke.ts,
 * regeln/quests.ts, modul/abenteuer.tsx (Dienste).
 */
import { useEffect, useRef, useState } from "react";
import type Phaser from "phaser";
import { liesPaketJson } from "../paket/paketlader";
import { findeKarte, ladeSpieldaten } from "../daten/laden";
import { Dialog } from "../dialog/Dialog";
import type { Dialogvariablen } from "../dialog/geschichte";
import { appdienste } from "../modul/abenteuer";
import { deckgroesse, mentorzugGesperrt, mitLernkarten, vorgabeFen } from "../regeln/karten";
import { wendeWirkungenAn, werteEreignisAus, type Questereignis } from "../regeln/quests";
import { kaufe } from "../regeln/muenzen";
import { standNachPartie, standNachRunde, type Rundenrueckweg } from "../regeln/rueckweg";
import { mitAppWertung, zaehltFuerA } from "../regeln/wertung";
import {
  variablenAusBesitz,
  variablenNachDialog,
  variablenNachBesuch,
  variablenNachRunde,
} from "../regeln/dialogvariablen";
import { laufendesSimultan, nachSimultanpartie, starteSimultan } from "../regeln/simultan";
import type { BesonderePartieformenDesSchachAbenteuers } from "../../daten/generiert/abenteuer-partieformen";

/** Gegenstand „Reisebrett“ und seine Begegnung (docs/spiel/11, I3): Übungspartie gegen Ambrose. */
const REISEBRETT = "reisebrett";
const UEBUNGSPARTIE = "reisebrett.ambrose";

/** Gegenstand „Monatskarte“ (docs/spiel/11, I6): Schnellreise in besuchte Städte. */
const MONATSKARTE = "monatskarte";

/** Gegenstand „Lupe des Uhrmachers“ (docs/spiel/11, I1): Steckbrief vor jeder Partie. */
const LUPE = "lupe";
/** Gegenstand für den Lichtkreis auf dunklen Karten (Sperren S4, S9, S11, S14). */
const LATERNE = "laterne";

/** Was die Lupe über einen Gegner verrät; leer ohne Lupe oder ohne Gegnerdaten. */
function lupeFuer(
  gegenstaende: readonly string[],
  gegner: Weltdaten["daten"]["gegner"],
  kennung: string,
): readonly string[] {
  const daten = gegenstaende.includes(LUPE) ? gegner.find((g) => g.kennung === kennung) : undefined;
  return daten ? lupenzeilen(daten) : [];
}

/** Gegenstand Fahrrad und sein Tempofaktor draußen (docs/spiel/08, W3). */
const FAHRRAD = "fahrrad";
const FAHRRAD_TEMPO = 2;
import type { Aufgabenauftrag } from "../schnittstelle/aufgaben";
import type { Kartenspiel, Kartensorte } from "../schnittstelle/karten";
import type { Kipppunkt, Nadelstufe, Partieauftrag, Partieergebnis } from "../schnittstelle/partie";
import type { Abenteuerstand, Partiekarten, Weltposition } from "../schnittstelle/spielstand";
import { fehlertext, tSpiel } from "../texte/texte";
import { GRUNDSTELLUNG } from "../anbindung/partiestart";
import {
  amZugIn,
  auftragFuer,
  auftragFuerRunde,
  kartenFuerWiedereinstieg,
  mitSchmeichelei,
  sichtbarerZustand,
  wiedereinstiegMoeglich,
} from "./auftraege";
import { Deckwahl } from "./Deckwahl";
import { lupenzeilen } from "./steckbrieftext";
import { Reisen } from "./Reisen";
import { Abspann } from "./Abspann";
import { reiseziele } from "./reiseziele";
import { spruecheErlaubt, ZEITKLASSEN } from "../regeln/zeitkarten";
import { Laden } from "./Laden";
import { Steuerkreuz } from "./Steuerkreuz";
import { Tagebuch } from "./Tagebuch";
import { beendeOberwelt, starteOberwelt, szeneVon } from "./oberweltspiel";
import type { Ausloesertreffer, Richtung } from "./szene";
import {
  KACHELSATZ,
  ladeDialog,
  aktionFuer,
  ausloeserFuer,
  figurZu,
  ladeWelt,
  objektposition,
  sprechblaseFuer,
  type Weltdaten,
} from "./weltdaten";
import { Sprechblase, type SprechblasenInhalt } from "./Sprechblase";
import { Vorfuehrung } from "./Vorfuehrung";
import { Gedaechtnisstellung } from "./Gedaechtnisstellung";
import { Kopfleiste } from "./Kopfleiste";
import { dialogwirkungen } from "./dialogwirkungen";
import { Fortsetzungskarte, Partieergebniskarte, Rundenergebniskarte } from "./Ergebniskarten";
import { aktuelleToenung, type Toenung } from "./toenung";

/** Ein offener Dialog: die übersetzte Geschichte, der Knoten und der Name der Datei. */
interface OffenerDialog {
  readonly json: string;
  readonly datei: string;
  readonly knoten: string;
}

/** Der Laden zu einer Kennung aus den Spieldaten; unbekannt → undefined (kein Fenster). */
function ladenDaten(w: Weltdaten, kennung: string) {
  return w.daten.laeden.find((l) => l.kennung === kennung);
}

export function Oberwelt() {
  const dienste = appdienste();
  const rahmen = useRef<HTMLDivElement>(null);
  const kachelanzeige = useRef<HTMLSpanElement>(null);
  const spiel = useRef<Phaser.Game | null>(null);
  const [stand, setzeStand] = useState<Abenteuerstand | null>(() => dienste.liesStand());
  const [geladeneWelt, setzeWelt] = useState<Weltdaten | null>(null);
  const [fehler, setzeFehler] = useState<string | null>(null);
  const [treffer, setzeTreffer] = useState<Ausloesertreffer | null>(null);
  const [dialog, setzeDialog] = useState<OffenerDialog | null>(null);
  const [meldung, setzeMeldung] = useState<string | null>(null);
  // Sprechblase eines Statisten und wie oft jeder schon angesprochen wurde (nur in dieser Sitzung).
  const [sprechblase, setzeSprechblase] = useState<SprechblasenInhalt | null>(null);
  const angesprochen = useRef(new Map<string, number>());
  // Vorführung eines Statisten (Kennung aus `zeigt`), solange das kleine Brett offen ist.
  const [vorfuehrung, setzeVorfuehrung] = useState<string | null>(null);
  // Tönung der Karte, die gerade gilt (toenung.ts); Sepia wirkt als CSS-Filter wie Erinnerungen.
  const [toenung, setzeToenungZustand] = useState<Toenung | null>(null);
  const [ergebnis, setzeErgebnis] = useState<Partieergebnis | null>(null);
  const [offenePartie, setzeOffenePartie] = useState<string | null>(null);
  const [tagebuch, setzeTagebuch] = useState(false);
  const [reisen, setzeReisen] = useState(false);
  // Dialogvariablen beim Öffnen des Dialogs: Was die Hülle danach setzt, überschreibt Ink nicht.
  const variablenBeimOeffnen = useRef<Abenteuerstand["dialogvariablen"]>({});
  // Eine Begegnung, für die der Leser gerade sein Deck wählt (Regelwerk R24).
  const [deckwahl, setzeDeckwahl] = useState<Partieauftrag | null>(null);
  // Die Clubnadel, die die zuletzt gelesene Partie gebracht hat (für die Ergebniskarte).
  const [neueNadel, setzeNeueNadel] = useState<Nadelstufe | null>(null);
  // Kipppunkt der zuletzt verlorenen Partie: „suche“ während Ambrose nachsieht (Regelwerk R14).
  const [kipppunkt, setzeKipppunkt] = useState<Kipppunkt | "suche" | null>(null);
  // Deck und gespielte Karten der gerade beendeten Partie, für den Wiedereinstieg (R15).
  const vorherigeKarten = useRef<Partiekarten | null>(null);
  const auftragInArbeit = useRef<Partieauftrag | null>(null);
  // Eine Reise, die ein Dialog angestoßen hat (Bus); sie geschieht, wenn der Dialog zu ist.
  const reiseInArbeit = useRef<{ karte: string; ausloeser: string } | null>(null);
  // Ein Übergang mit Dialog (orte.json `dialog`, `wenn`): der Wechsel folgt nach dem Dialog.
  const uebergangNachDialog = useRef<{
    ziel: { karte: string; ausloeser: string };
    wenn: string | null;
  } | null>(null);
  // Ein Laden, den ein Dialog geöffnet hat (G5); er erscheint, wenn der Dialog zu ist.
  const ladenInArbeit = useRef<string | null>(null);
  const abspannInArbeit = useRef(false);
  const [abspann, setzeAbspann] = useState(false);
  const [offenerLaden, setzeOffenerLaden] = useState<string | null>(null);
  // Eine Aufgabenrunde, die ein Dialog angestoßen hat; sie beginnt, wenn der Dialog zu ist.
  const rundeInArbeit = useRef<string | null>(null);
  // Eine Gedächtnisstellung, die ein Dialog angestoßen hat (Runde 6); sie beginnt nach dem Dialog.
  const gedaechtnisInArbeit = useRef<string | null>(null);
  // Ein Simultan, das ein Dialog angestoßen hat (Runde 6); das erste Brett beginnt nach dem Dialog.
  const simultanInArbeit = useRef<string | null>(null);
  // Eine Vorführung, die ein Dialog angestoßen hat (Odette am Leuchtturm); sie folgt dem Dialog.
  const vorfuehrungInArbeit = useRef<string | null>(null);
  const [gedaechtnis, setzeGedaechtnis] = useState<string | null>(null);

  // Ergebnis der zuletzt gespielten Aufgabenrunde für die Ergebniskarte (R31).
  const [rundenergebnis, setzeRundenergebnis] = useState<
    (Rundenrueckweg & { auftrag: Aufgabenauftrag }) | null
  >(null);
  // Eine Aufgabenrunde, die in der App noch offen ist (ohne Ergebnis zurückgekommen).
  const [offeneRunde, setzeOffeneRunde] = useState<Aufgabenauftrag | null>(null);
  // Eine bestandene Runde, die als Quest-Ereignis noch auf die Welt wartet.
  const offeneRundenmeldung = useRef<string | null>(null);
  // Der aktuelle Stand für Rückrufe aus Phaser und Dialogen, die nicht neu gerendert werden.
  const standRef = useRef(stand);
  useEffect(() => {
    standRef.current = stand;
  }, [stand]);
  // Die Welt gilt nur, solange sie zur Karte des Spielstands gehört (Kartenwechsel lädt neu).
  const welt = geladeneWelt && geladeneWelt.kennung === stand?.position.karte ? geladeneWelt : null;
  // Die geladene Welt für Rückrufe aus Phaser (Auslöser), die außerhalb des Renderns kommen.
  const weltRef = useRef<Weltdaten | null>(null);
  useEffect(() => {
    weltRef.current = welt;
  }, [welt]);
  // Ein gelesenes Partieergebnis, das noch auf die Welt wartet (Quest-Ereignis „partie“).
  const offenesErgebnis = useRef<Partieergebnis | null>(null);

  /** Schreibt den Spielstand in die App und merkt ihn hier. */
  const schreibe = (neu: Abenteuerstand) => {
    standRef.current = neu;
    setzeStand(neu);
    void dienste.schreibeStand(neu);
  };

  // Abenteuerwertung A folgt der Wertung der App (R2), geprüft beim Aufbau.
  useEffect(() => {
    const aktuell = standRef.current;
    if (!aktuell) return;
    const neu = mitAppWertung(aktuell, dienste.wertung());
    if (neu !== aktuell) schreibe(neu);
    // Nur beim Aufbau; danach ändert nur diese Komponente den Stand.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Lernkarten (docs/spiel/11, Abschnitt 5): abgeschlossene Buchkapitel der App schenken Karten.
  const lernkartenGeprueft = useRef(false);
  useEffect(() => {
    const aktuell = standRef.current;
    if (!welt || !aktuell || lernkartenGeprueft.current) return;
    lernkartenGeprueft.current = true;
    const sorten = welt.daten.karten as unknown as readonly Kartensorte[];
    const ergebnis = mitLernkarten(aktuell, dienste.fertigeKapitel(), sorten, new Date());
    const erste = ergebnis.neu[0];
    if (!erste) return;
    schreibe(ergebnis.stand);
    setzeMeldung(
      tSpiel("karte.lernkarte", {
        kapitel: erste.kapitel ?? 0,
        karte: tSpiel(erste.name),
        satz: tSpiel(`karte.${erste.kennung}.geschenkt`),
      }),
    );
    // Einmal je Aufbau, sobald die Welt da ist.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [welt]);

  /** Ein Ereignis der Welt: Quests fortschreiben, Wirkungen anwenden, Meldungen zeigen. */
  const melde = (ereignis: Questereignis, w: Weltdaten | null = weltRef.current) => {
    const aktuell = standRef.current;
    if (!aktuell || !w) return;
    const welt = w;
    const jetzt = new Date();
    const q = werteEreignisAus(aktuell, welt.daten.quests, ereignis, jetzt);
    if (q.begonnen.length === 0 && q.erledigt.length === 0 && q.fortgeschritten.length === 0) {
      return;
    }
    schreibe(wendeWirkungenAn(q.stand, q.wirkungen, jetzt));
    const titel = (kennung: string) =>
      tSpiel(welt.daten.quests.find((x) => x.kennung === kennung)?.titel ?? kennung);
    if (q.erledigt.length > 0) {
      setzeMeldung(tSpiel("quest.erledigt", { titel: titel(q.erledigt[0] ?? "") }));
    } else if (q.begonnen.length > 0) {
      setzeMeldung(tSpiel("quest.begonnen", { titel: titel(q.begonnen[0] ?? "") }));
    }
  };

  /** Wechselt auf eine andere Karte: Der Held erscheint auf dem Zielauslöser. */
  function wechsleKarte(karte: string, ausloeser: string): void {
    const aktuell = standRef.current;
    const welt = weltRef.current;
    if (!aktuell || !welt) return;
    const ziel = findeKarte(welt.daten, karte);
    if (!ziel) {
      setzeMeldung(tSpiel("oberwelt.karteFehlt", { karte }));
      return;
    }
    const szene = spiel.current ? szeneVon(spiel.current) : null;
    const richtung = szene?.position().richtung ?? aktuell.position.richtung;
    liesPaketJson<object>(ziel.karte.datei)
      .then((json) => {
        const pos = objektposition(json, ausloeser) ?? objektposition(json, "start");
        if (!pos) throw new Error(`Auslöser ${ausloeser} fehlt auf ${karte}`);
        const position: Weltposition = { karte, x: pos.x, y: pos.y, richtung };
        // Dieselbe Karte (Steg über die Schleuse): nur versetzen, die Szene bleibt geladen.
        if (karte === aktuell.position.karte) szene?.versetze(pos.x, pos.y);
        schreibe({ ...aktuell, position });
      })
      .catch(() => setzeMeldung(tSpiel("oberwelt.karteFehlt", { karte })));
  }

  // Rückweg: eine Partie des Abenteuers war offen; ist sie beendet, kommt das Ergebnis hierher.
  useEffect(() => {
    if (!stand?.laufendePartie) return;
    const kennung = stand.laufendePartie;
    void dienste.liesErgebnis(kennung).then((e) => {
      const aktuell = standRef.current;
      if (!aktuell) return;
      if (!e) {
        setzeOffenePartie(kennung);
        return;
      }
      setzeErgebnis(e);
      offenesErgebnis.current = e;
      void ladeSpieldaten().then((daten) => {
        const r = standNachPartie(standRef.current ?? aktuell, e, daten);
        setzeNeueNadel(r.nadel);
        vorherigeKarten.current = aktuell.partiekarten;
        if (wiedereinstiegMoeglich(e, r.begegnung, daten, aktuell)) {
          setzeKipppunkt("suche");
          void dienste
            .sucheKipppunkt(kennung)
            .then((k) => setzeKipppunkt(k))
            .catch(() => setzeKipppunkt(null));
        }
        schreibe(r.stand);
      });
    });
    // Nur beim Aufbau; der Spielstand ändert sich danach nur noch durch diese Komponente.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Eine bestandene Aufgabenrunde als Quest-Ereignis, sobald die Welt da ist. */
  const meldeRunde = (w: Weltdaten) => {
    const runde = offeneRundenmeldung.current;
    if (!runde) return;
    offeneRundenmeldung.current = null;
    melde({ art: "aufgaben", runde }, w);
  };

  // Rückweg der Aufgabenrunde (R31): Ergebnis auswerten, Rundenstand und Aufgabenreihe fortschreiben.
  useEffect(() => {
    const auftrag = stand?.laufendeAufgaben;
    if (!auftrag) return;
    void Promise.all([dienste.liesAufgabenergebnis(auftrag.kennung), ladeSpieldaten()]).then(
      ([ergebnis, daten]) => {
        const aktuell = standRef.current;
        if (!aktuell) return;
        if (!ergebnis) {
          setzeOffeneRunde(auftrag);
          return;
        }
        const r = standNachRunde(aktuell, auftrag, ergebnis, daten);
        setzeRundenergebnis({ auftrag, ...r });
        if (r.bestanden) offeneRundenmeldung.current = auftrag.runde;
        schreibe(r.stand);
        if (r.bestanden && weltRef.current) meldeRunde(weltRef.current);
      },
    );
    // Nur beim Aufbau, wie der Rückweg der Partie.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Startet eine Aufgabenrunde: Position sichern, Auftrag an die App (sie merkt ihn im Stand). */
  const starteRunde = (runde: string) => {
    const aktuell = standRef.current ?? stand;
    if (!welt || !aktuell) return;
    const auftrag = auftragFuerRunde(runde, welt.daten, aktuell);
    if (!auftrag) {
      setzeMeldung(tSpiel("aufgaben.fehlt", { runde }));
      return;
    }
    const szene = spiel.current ? szeneVon(spiel.current) : null;
    const position = szene
      ? { ...szene.position(), karte: aktuell.position.karte }
      : aktuell.position;
    const mitPosition = { ...aktuell, position };
    standRef.current = mitPosition;
    setzeStand(mitPosition);
    setzeRundenergebnis(null);
    void dienste.schreibeStand(mitPosition).then(() => dienste.starteAufgaben(auftrag));
  };

  /** Ein gelesenes Partieergebnis als Quest-Ereignis, sobald die Welt da ist. */
  const meldeErgebnis = (w: Weltdaten) => {
    const e = offenesErgebnis.current;
    if (!e) return;
    offenesErgebnis.current = null;
    const begegnung = e.kennung.split("#")[0] ?? "";
    const ausgang = e.ausgang === "abgebrochen" ? "niederlage" : e.ausgang;
    melde({ art: "partie", begegnung, ausgang: [ausgang] }, w);
  };

  /** Öffnet den Dialog „datei.knoten“ aus dem Paket. */
  const oeffneDialog = (verweis: string) => {
    const [datei, knoten] = verweis.split(".", 2);
    if (!datei || !knoten) return;
    variablenBeimOeffnen.current = (standRef.current ?? stand)?.dialogvariablen ?? {};
    ladeDialog(datei)
      .then((json) => setzeDialog({ json: JSON.stringify(json), datei, knoten }))
      .catch(() => setzeMeldung(tSpiel("oberwelt.dialogFehlt", { datei })));
  };

  /** Ein Auslöser der Karte (aus Phaser): Übergänge sofort, alles andere als Quest-Ereignis. */
  const beiTreffer = (t: Ausloesertreffer | null) => {
    setzeTreffer(t);
    if (!t) setzeSprechblase(null);
    const w = weltRef.current;
    const aktuell = standRef.current;
    if (!t || !w || !aktuell) return;
    const a = ausloeserFuer(w.ort, w.kennung, t.name);
    if (t.typ === "ausloeser" && a?.art === "uebergang" && t.darauf && a.dialog && a.ziel) {
      // Erst der Dialog (Abschied, Ankunft, Sperre), dann der Wechsel, wenn `wenn` erfüllt ist.
      uebergangNachDialog.current = { ziel: a.ziel, wenn: a.wenn ?? null };
      oeffneDialog(a.dialog);
      return;
    }
    if (t.typ === "ausloeser" && a?.art === "uebergang" && t.darauf) {
      // Ein Übergang ohne Ziel (etwa die Landstraße nach Cedar Creek) ist noch nicht gebaut.
      if (a.ziel) wechsleKarte(a.ziel.karte, a.ziel.ausloeser);
      else setzeMeldung(tSpiel("oberwelt.karteFehlt", { karte: a.name }));
      return;
    }
    melde({ art: "ort", karte: aktuell.position.karte, ausloeser: t.name }, w);
  };

  // Welt laden und Phaser starten; beim Verlassen Position und Spielzeit sichern, Phaser beenden.
  useEffect(() => {
    if (!stand) return;
    let aktiv = true;
    // Beginn dieser Sitzung in der Welt, für die Spielzeit im Spielstand.
    const begonnen = Date.now();
    ladeWelt(stand.position.karte, stand.held.variante, stand.dialogvariablen)
      .then((w) => {
        if (!aktiv || !rahmen.current) return;
        setzeTreffer(null);
        setzeWelt(w);
        weltRef.current = w;
        // Erster Besuch eines Ortes (W2): merken, Dialogvariable `besucht<Ort>` für den Bus.
        const aktuell = standRef.current;
        if (aktuell && !aktuell.besuchteOrte.includes(w.ort.kennung)) {
          schreibe({
            ...aktuell,
            besuchteOrte: [...aktuell.besuchteOrte, w.ort.kennung],
            dialogvariablen: {
              ...aktuell.dialogvariablen,
              ...variablenNachBesuch(w.ort.kennung),
            },
          });
        }
        // Karte betreten (Quests), dann ein Partieergebnis, das auf die Welt gewartet hat.
        melde({ art: "ort", karte: w.kennung }, w);
        meldeErgebnis(w);
        meldeRunde(w);
        const startToenung = aktuelleToenung(w.karte, w.kennung, stand.dialogvariablen);
        setzeToenungZustand(startToenung);
        spiel.current = starteOberwelt(rahmen.current, {
          karte: w.karte,
          kachelbild: w.kachelbild,
          heldbild: w.heldbild,
          figurbild: w.figurbild,
          heldfigur: w.heldfigur,
          figurenbilder: w.figurenbilder,
          moebel: w.moebel,
          hintergrund: w.hintergrund,
          belebungsbilder: w.belebungsbilder,
          toenung: startToenung,
          laterne: stand.gegenstaende.includes(LATERNE),
          kachelsatz: KACHELSATZ,
          start: stand.position,
          // Fahrrad (docs/spiel/08, W3): doppeltes Tempo draußen.
          tempofaktor: !w.innen && stand.gegenstaende.includes(FAHRRAD) ? FAHRRAD_TEMPO : 1,
          melder: {
            beiAusloeser: beiTreffer,
            // Kachel des Helden ohne Neuzeichnen in ein verstecktes Feld (Oberflächentests).
            beiKachel: (x, y) => {
              if (kachelanzeige.current) kachelanzeige.current.textContent = `${x},${y}`;
            },
          },
        });
      })
      .catch((f: unknown) => setzeFehler(fehlertext(f)));
    return () => {
      aktiv = false;
      const szene = spiel.current ? szeneVon(spiel.current) : null;
      const aktuell = dienste.liesStand();
      if (szene && aktuell && aktuell.position.karte === stand.position.karte) {
        const position = { ...szene.position(), karte: aktuell.position.karte };
        const sekunden = Math.round((Date.now() - begonnen) / 1000);
        const ort = aktuell.position.karte.split(".")[0] ?? "";
        void dienste.schreibeStand({
          ...aktuell,
          position,
          spielzeitSekunden: aktuell.spielzeitSekunden + sekunden,
          spielzeitJeOrt: {
            ...aktuell.spielzeitJeOrt,
            [ort]: (aktuell.spielzeitJeOrt[ort] ?? 0) + sekunden,
          },
        });
      }
      if (spiel.current) beendeOberwelt(spiel.current);
      spiel.current = null;
    };
    // Nur die Karte zählt: Ein Kartenwechsel baut die Welt neu auf, alles andere nicht.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stand?.position.karte]);

  // Solange ein Dialog, ein Ergebnis oder eine Meldung offen ist, steht der Held.
  useEffect(() => {
    const szene = spiel.current ? szeneVon(spiel.current) : null;
    szene?.laufenErlaubt(
      dialog === null &&
        ergebnis === null &&
        offenePartie === null &&
        rundenergebnis === null &&
        offeneRunde === null &&
        !tagebuch &&
        !deckwahl &&
        vorfuehrung === null &&
        gedaechtnis === null &&
        offenerLaden === null,
    );
  }, [
    dialog,
    ergebnis,
    offenePartie,
    rundenergebnis,
    offeneRunde,
    tagebuch,
    deckwahl,
    vorfuehrung,
    gedaechtnis,
    offenerLaden,
    welt,
  ]);

  const beiRichtung = (richtung: Richtung, gedrueckt: boolean) => {
    const szene = spiel.current ? szeneVon(spiel.current) : null;
    szene?.setzeRichtung(richtung, gedrueckt);
  };

  /** Das Simultan aus partieformen.json, oder null. */
  const simultanEintrag = (kennung: string) =>
    liesPaketJson<BesonderePartieformenDesSchachAbenteuers>("daten/partieformen.json").then(
      (alle) => alle.simultan.find((s) => s.kennung === kennung) ?? null,
    );

  /** Beginnt ein Simultan: Fortschritt in den Dialogvariablen, dann das erste Brett. */
  const starteSimultanAus = (kennung: string) => {
    void simultanEintrag(kennung).then((eintrag) => {
      const aktuell = standRef.current;
      const erste = eintrag?.begegnungen[0];
      if (!eintrag || !erste || !aktuell || !welt) return;
      const neu = { ...aktuell, dialogvariablen: starteSimultan(aktuell.dialogvariablen, eintrag) };
      schreibe(neu);
      const auftrag = auftragFuer(erste, welt.daten, neu);
      if (auftrag) startePartie(auftrag, []);
    });
  };

  /** Nach der Ergebniskarte im Simultan: das nächste Brett oder die Gesamtwertung. */
  const weiterImSimultan = (e: Partieergebnis) => {
    const laeuft = laufendesSimultan(standRef.current?.dialogvariablen ?? {});
    if (!laeuft) return;
    void simultanEintrag(laeuft).then((eintrag) => {
      const aktuell = standRef.current;
      if (!eintrag || !aktuell || !welt) return;
      const begegnung = e.kennung.split("#")[0] ?? "";
      const r = nachSimultanpartie(aktuell.dialogvariablen, eintrag, begegnung, e.ausgang);
      const neu = { ...aktuell, dialogvariablen: { ...r.variablen } };
      schreibe(neu);
      const auftrag = r.naechste ? auftragFuer(r.naechste, welt.daten, neu) : null;
      if (auftrag) startePartie(auftrag, []);
      if (r.ende) {
        setzeMeldung(
          tSpiel("oberwelt.simultan.ende", {
            punkte: r.ende.punkte,
            bretter: eintrag.begegnungen.length,
          }),
        );
      }
    });
  };

  /** Ende einer Gedächtnisstellung: `<name>Bestanden` wie bei Aufgabenrunden (Runde 6). */
  const beendeGedaechtnis = (kennung: string, bestanden: boolean) => {
    setzeGedaechtnis(null);
    const aktuell = standRef.current;
    if (!aktuell) return;
    schreibe({
      ...aktuell,
      dialogvariablen: { ...aktuell.dialogvariablen, ...variablenNachRunde(kennung, bestanden) },
    });
  };

  /** Der Aktionsknopf: Dialog des Auslösers oder der Figur öffnen. */
  const beiAktion = () => {
    if (!welt || !treffer) return;
    if (treffer.typ === "statist") {
      const schluessel = `${welt.kennung}.${treffer.name}`;
      const besuch = angesprochen.current.get(schluessel) ?? 0;
      angesprochen.current.set(schluessel, besuch + 1);
      setzeSprechblase(sprechblaseFuer(welt, treffer.name, besuch, stand?.held.name ?? ""));
      return;
    }
    if (treffer.typ === "figur") {
      const figur = figurZu(welt.ort, treffer.name);
      if (figur) oeffneDialog(figur.dialog);
      return;
    }
    const a = ausloeserFuer(welt.ort, welt.kennung, treffer.name);
    if (a?.dialog) oeffneDialog(a.dialog);
  };

  if (!stand) return <p className="fehlertext">{tSpiel("oberwelt.keinSpielstand")}</p>;

  // Die Refs (Spielstand, Merker) liest dialogwirkungen erst, wenn Ink eine Funktion aufruft,
  // also nach dem Zeichnen; die Regel react-hooks/refs kann das nicht erkennen.
  // eslint-disable-next-line react-hooks/refs
  const wirkungen = dialogwirkungen({
    stand: () => standRef.current ?? stand,
    welt,
    schreibe,
    meldung: setzeMeldung,
    toenung: (t) => {
      setzeToenungZustand(t);
      const szene = spiel.current ? szeneVon(spiel.current) : null;
      szene?.setzeToenung(t);
    },
    merker: () => ({
      abspann: abspannInArbeit,
      laden: ladenInArbeit,
      auftrag: auftragInArbeit,
      runde: rundeInArbeit,
      gedaechtnis: gedaechtnisInArbeit,
      simultan: simultanInArbeit,
      vorfuehrung: vorfuehrungInArbeit,
      reise: reiseInArbeit,
    }),
  });

  /**
   * Startet die Partie zu einem Auftrag mit dem gewählten Deck: Vorgaben ändern die Startstellung
   * und zählen als gespielt (Halbzug 0, Regelwerk R24, R26); Position und laufende Partie werden
   * gesichert, dann übernimmt die App.
   */
  const startePartie = (
    auftragDerBegegnung: Partieauftrag,
    deck: readonly string[],
    schonGespielt: readonly Kartenspiel[] = [],
  ) => {
    let auftrag = auftragDerBegegnung;
    const aktuell = standRef.current ?? stand;
    const sorten = (welt?.daten.karten ?? []) as unknown as readonly Kartensorte[];
    const gegnerfarbe = auftrag.farbe === "white" ? "black" : "white";
    let startstellung = auftrag.startstellung;
    const vorher: Kartenspiel[] = [...schonGespielt];
    let karten = aktuell.karten;
    for (const kennung of deck) {
      const sorte = sorten.find((s) => s.kennung === kennung);
      if (!sorte || sorte.zeitpunkt !== "vorher") continue;
      // Sprüche nur gegen Straßengegner (docs/spiel/10, S2); sonst bleibt die Karte unberührt.
      if (sorte.spruch_art && !spruecheErlaubt(auftrag.profil.rolle)) continue;
      if (sorte.wirkung.art === "schmeichelei") auftrag = mitSchmeichelei(auftrag, aktuell);
      if (sorte.wirkung.art === "vorgabe") {
        const fen = startstellung.art === "fen" ? startstellung.fen : GRUNDSTELLUNG;
        const neu = vorgabeFen(fen, sorte.wirkung.feld, gegnerfarbe);
        if (neu) startstellung = { art: "fen", fen: neu };
      }
      vorher.push({ kennung, stufe: sorte.stufe, halbzug: 0 });
      if (sorte.art === "verbrauch") {
        karten = karten
          .map((k) => (k.kennung === kennung ? { ...k, anzahl: k.anzahl - 1 } : k))
          .filter((k) => k.anzahl > 0);
      }
    }
    const szene = spiel.current ? szeneVon(spiel.current) : null;
    const position = szene
      ? { ...szene.position(), karte: aktuell.position.karte }
      : aktuell.position;
    const mitPartie: Abenteuerstand = {
      ...aktuell,
      karten,
      position,
      laufendePartie: auftrag.kennung,
      // Für die Abenteuerwertung (R2, R38): Zielstärke vor dem Zustandsfaktor und ob sie zählt.
      laufendeWertung: {
        zielElo: auftrag.staerke.zielElo,
        zaehlt: zaehltFuerA(auftrag),
        zustand: sichtbarerZustand(auftrag),
      },
      partiekarten: {
        deck: [
          ...deck.filter((k) => !vorher.some((v) => v.kennung === k)),
          ...(auftrag.freieKarten ?? []).filter((k) => !deck.includes(k)),
        ],
        ...(auftrag.freieKarten ? { frei: auftrag.freieKarten } : {}),
        gespielt: vorher,
        wiedereinstieg: auftrag.format.art === "wiedereinstieg",
        letzterHalbzug: null,
        gegner: auftrag.profil.kennung,
        uhr: auftrag.uhr,
      },
    };
    standRef.current = mitPartie;
    setzeStand(mitPartie);
    setzeDeckwahl(null);
    void dienste
      .schreibeStand(mitPartie)
      .then(() => dienste.startePartie({ ...auftrag, startstellung, deck: { karten: deck } }));
  };

  /**
   * Reisebrett (docs/spiel/11, I3): überall eine freie Übungspartie gegen Ambrose, mit Wahl der
   * Bedenkzeit und Karten wie jede Begegnung; sie zählt für Partienliste und Abenteuerwertung.
   */
  const starteUebungspartie = () => {
    const aktuell = standRef.current ?? stand;
    if (!welt) return;
    const auftrag = auftragFuer(UEBUNGSPARTIE, welt.daten, aktuell);
    if (auftrag) setzeDeckwahl(auftrag);
  };

  /**
   * Wiedereinstieg (Regelwerk R14): dieselbe Begegnung ab dem Kipppunkt, gleiches Profil und
   * gleicher Zustand, Farbe aus dem Zugrecht der Stellung, Karten nach R15.
   */
  const starteWiedereinstieg = (e: Partieergebnis, k: Kipppunkt) => {
    const aktuell = standRef.current ?? stand;
    if (!welt) return;
    const begegnung = e.kennung.split("#")[0] ?? "";
    const auftrag = auftragFuer(begegnung, welt.daten, aktuell);
    if (!auftrag) return;
    const sorten = welt.daten.karten as unknown as readonly Kartensorte[];
    const karten = kartenFuerWiedereinstieg(vorherigeKarten.current, e.gespielteKarten, k, sorten);
    setzeErgebnis(null);
    setzeNeueNadel(null);
    setzeKipppunkt(null);
    startePartie(
      {
        ...auftrag,
        // Dieselbe Bedenkzeit wie in der verlorenen Partie (gewählt oder fest).
        uhr: vorherigeKarten.current?.uhr ?? auftrag.uhr,
        farbe: amZugIn(k.fen),
        format: { art: "wiedereinstieg", vorherigeKennung: e.kennung },
        startstellung: { art: "fen", fen: k.fen },
      },
      karten.deck,
      karten.gespielt,
    );
  };

  /** Dialog zu Ende: Variablen sichern, dann eine angestoßene Partie starten (ggf. Deck wählen). */
  const beiDialogende = (variablen: Dialogvariablen) => {
    setzeDialog(null);
    const aktuell = standRef.current ?? stand;
    const auftrag = auftragInArbeit.current;
    auftragInArbeit.current = null;
    const dialogvariablen = variablenNachDialog(
      variablenBeimOeffnen.current,
      aktuell.dialogvariablen,
      variablen,
    );
    const neu = { ...aktuell, dialogvariablen };
    schreibe(neu);
    const reise = reiseInArbeit.current;
    reiseInArbeit.current = null;
    if (reise) wechsleKarte(reise.karte, reise.ausloeser);
    if (abspannInArbeit.current) {
      abspannInArbeit.current = false;
      setzeAbspann(true);
    }
    const laden = ladenInArbeit.current;
    ladenInArbeit.current = null;
    if (laden) setzeOffenerLaden(laden);
    const uebergang = uebergangNachDialog.current;
    uebergangNachDialog.current = null;
    // `wenn` gilt als erfüllt bei true, einer Zahl über 0 (Nadel) oder einem nicht leeren Text.
    // Besitz zählt mit (hatLaterne, hatGummistiefel: Sperren S4, S8, S9, S11, S14).
    const bedingungen = { ...neu.dialogvariablen, ...variablenAusBesitz(neu) };
    if (uebergang && (!uebergang.wenn || Boolean(bedingungen[uebergang.wenn]))) {
      wechsleKarte(uebergang.ziel.karte, uebergang.ziel.ausloeser);
    }
    const zeigen = vorfuehrungInArbeit.current;
    vorfuehrungInArbeit.current = null;
    if (zeigen) {
      setzeVorfuehrung(zeigen);
      return;
    }
    const simultan = simultanInArbeit.current;
    simultanInArbeit.current = null;
    if (simultan) {
      starteSimultanAus(simultan);
      return;
    }
    const merken = gedaechtnisInArbeit.current;
    gedaechtnisInArbeit.current = null;
    if (merken) {
      setzeGedaechtnis(merken);
      return;
    }
    const runde = rundeInArbeit.current;
    rundeInArbeit.current = null;
    if (runde) {
      starteRunde(runde);
      return;
    }
    if (!auftrag) return;
    const mitLupe = neu.gegenstaende.includes(LUPE);
    const mitFreien = (auftrag.freieKarten?.length ?? 0) > 0;
    if (
      (auftrag.kartenErlaubt && neu.karten.length > 0) ||
      auftrag.zeitwahl ||
      mitLupe ||
      mitFreien
    )
      setzeDeckwahl(auftrag);
    else startePartie(auftrag, []);
  };

  const gegnername = (e: Partieergebnis) => {
    const kennung = e.kennung.split("#")[0] ?? "";
    const begegnung = welt?.daten.begegnungen.find((b) => b.kennung === kennung);
    const gegner = begegnung && welt?.daten.gegner.find((g) => g.kennung === begegnung.gegner);
    return gegner ? tSpiel(gegner.name) : "";
  };

  const aktuellerLaden = welt && offenerLaden ? ladenDaten(welt, offenerLaden) : undefined;

  return (
    <div
      className={
        welt?.erinnerung || toenung === "sepia"
          ? "abenteuer-welt abenteuer-welt-erinnerung"
          : "abenteuer-welt"
      }
      data-testid="abenteuer-welt"
      data-toenung={toenung ?? "keine"}
      data-fassung={welt?.zustand ?? "grund"}
    >
      <div ref={rahmen} style={{ width: "100%", height: "100%" }} />
      <span ref={kachelanzeige} hidden data-testid="abenteuer-kachel" />
      {/* In Erinnerungen (Ambroses Zeit) gibt es weder Tagebuch noch Münzen des Helden (F3). */}
      {!welt?.erinnerung && (
        <Kopfleiste
          muenzen={stand.muenzen}
          beiTagebuch={() => setzeTagebuch(true)}
          beiReisebrett={
            welt && stand.gegenstaende.includes(REISEBRETT) && !dialog && !deckwahl
              ? starteUebungspartie
              : null
          }
          beiReisen={
            welt && !welt.innen && stand.gegenstaende.includes(MONATSKARTE) && !dialog
              ? () => setzeReisen(true)
              : null
          }
        />
      )}
      {fehler && (
        <p className="fehlertext abenteuer-ergebnis">{tSpiel("oberwelt.fehler", { fehler })}</p>
      )}
      {!welt && !fehler && <p className="lade abenteuer-ergebnis">{tSpiel("oberwelt.laedt")}</p>}
      {welt && !dialog && (
        <Steuerkreuz
          beiRichtung={beiRichtung}
          aktion={aktionFuer(welt, treffer)}
          beiAktion={beiAktion}
        />
      )}
      {dialog && (
        <Dialog
          key={`${dialog.datei}.${dialog.knoten}`}
          json={dialog.json}
          knoten={dialog.knoten}
          wirkungen={wirkungen}
          variablen={{ ...stand.dialogvariablen, ...variablenAusBesitz(stand) }}
          heldname={stand.held.name}
          beiKnoten={(knoten) => melde({ art: "dialog", knoten: `${dialog.datei}.${knoten}` })}
          beiEnde={beiDialogende}
        />
      )}
      {deckwahl && welt && (
        <Deckwahl
          besitz={stand.karten}
          sorten={welt.daten.karten}
          mitKarten={deckwahl.kartenErlaubt}
          groesse={deckgroesse(stand.gegenstaende)}
          sprueche={spruecheErlaubt(deckwahl.profil.rolle)}
          zeitwahl={deckwahl.zeitwahl === true}
          steckbrief={lupeFuer(stand.gegenstaende, welt.daten.gegner, deckwahl.profil.kennung)}
          farbeFrei={deckwahl.farbeFrei === true}
          mentorGesperrt={mentorzugGesperrt(stand.dialogvariablen)}
          freieKarten={deckwahl.freieKarten ?? []}
          beiWahl={(deck, zeit, farbe) =>
            startePartie(
              {
                ...deckwahl,
                ...(deckwahl.zeitwahl ? { uhr: ZEITKLASSEN[zeit] } : {}),
                ...(farbe ? { farbe } : {}),
              },
              deck,
            )
          }
          beiAbbruch={() => setzeDeckwahl(null)}
        />
      )}
      {welt && aktuellerLaden && (
        <Laden
          laden={aktuellerLaden}
          stand={stand}
          sorten={welt.daten.karten}
          beiKauf={(ware) => {
            const sorten = welt.daten.karten as unknown as readonly Kartensorte[];
            schreibe(kaufe(standRef.current ?? stand, ware, sorten, new Date()));
          }}
          beiSchliessen={() => setzeOffenerLaden(null)}
        />
      )}
      {abspann && welt && (
        <Abspann stand={stand} daten={welt.daten} beiSchliessen={() => setzeAbspann(false)} />
      )}
      {reisen && welt && (
        <Reisen
          ziele={reiseziele(welt.daten.orte, stand.besuchteOrte, welt.ort.kennung)}
          beiWahl={(karte) => {
            setzeReisen(false);
            wechsleKarte(karte, "start");
          }}
          beiSchliessen={() => setzeReisen(false)}
        />
      )}
      {tagebuch && welt && (
        <Tagebuch stand={stand} daten={welt.daten} beiSchliessen={() => setzeTagebuch(false)} />
      )}
      {sprechblase && !dialog && !vorfuehrung && (
        <Sprechblase
          inhalt={sprechblase}
          texte={{
            weiter: tSpiel("ergebnis.weiter"),
            frage: tSpiel("oberwelt.vorfuehrung.frage"),
            zeigen: tSpiel("oberwelt.vorfuehrung.zeigen"),
          }}
          beiSchliessen={() => setzeSprechblase(null)}
          beiZeigen={(kennung) => {
            setzeSprechblase(null);
            setzeVorfuehrung(kennung);
          }}
        />
      )}
      {gedaechtnis && (
        <Gedaechtnisstellung
          kennung={gedaechtnis}
          beiEnde={(bestanden) => beendeGedaechtnis(gedaechtnis, bestanden)}
        />
      )}
      {vorfuehrung && (
        <Vorfuehrung kennung={vorfuehrung} beiSchliessen={() => setzeVorfuehrung(null)} />
      )}
      {meldung && (
        <section className="abenteuer-ergebnis" role="status" data-testid="abenteuer-meldung">
          <p>{meldung}</p>
          <button type="button" className="knopf-zweit" onClick={() => setzeMeldung(null)}>
            {tSpiel("ergebnis.weiter")}
          </button>
        </section>
      )}
      {ergebnis && (
        <Partieergebniskarte
          ergebnis={ergebnis}
          gegner={gegnername(ergebnis)}
          club={tSpiel(welt?.ort.club?.name ?? "club.mapleFalls.name")}
          neueNadel={neueNadel}
          kipppunkt={kipppunkt}
          beiWiedereinstieg={(k) => starteWiedereinstieg(ergebnis, k)}
          beiWeiter={() => {
            setzeErgebnis(null);
            setzeNeueNadel(null);
            setzeKipppunkt(null);
            weiterImSimultan(ergebnis);
          }}
        />
      )}
      {rundenergebnis && (
        <Rundenergebniskarte
          ergebnis={rundenergebnis}
          club={tSpiel(welt?.ort.club?.name ?? "club.mapleFalls.name")}
          beiNochmal={starteRunde}
          beiWeiter={() => setzeRundenergebnis(null)}
        />
      )}
      {offeneRunde && (
        <Fortsetzungskarte
          text="aufgaben.laeuft"
          weiter="aufgaben.weiter"
          abbrechen="aufgaben.abbrechen"
          beiWeiter={() => void dienste.starteAufgaben(offeneRunde)}
          beiAbbrechen={() => {
            setzeOffeneRunde(null);
            schreibe({ ...(standRef.current ?? stand), laufendeAufgaben: null });
          }}
        />
      )}
      {offenePartie && (
        <Fortsetzungskarte
          text="ergebnis.partieLaeuft"
          weiter="ergebnis.weiterspielen"
          abbrechen="ergebnis.aufgeben"
          beiWeiter={() => dienste.zeigePartie(offenePartie)}
          beiAbbrechen={() => {
            setzeOffenePartie(null);
            schreibe({ ...(standRef.current ?? stand), laufendePartie: null });
          }}
        />
      )}
    </div>
  );
}
