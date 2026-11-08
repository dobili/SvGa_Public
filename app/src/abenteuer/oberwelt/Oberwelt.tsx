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
import type { Dialogvariablen, Wirkungen } from "../dialog/geschichte";
import { appdienste } from "../modul/abenteuer";
import { vorgabeFen } from "../regeln/karten";
import { wendeWirkungenAn, werteEreignisAus, type Questereignis } from "../regeln/quests";
import { mitFund } from "../regeln/funde";
import { kaufe } from "../regeln/muenzen";
import { standNachPartie, standNachRunde, type Rundenrueckweg } from "../regeln/rueckweg";
import { mitAppWertung, zaehltFuerA } from "../regeln/wertung";
import {
  variablenAusBesitz,
  variablenNachBesuch,
  variablenNachFund,
} from "../regeln/dialogvariablen";

/** Gegenstand Fahrrad und sein Tempofaktor draußen (docs/spiel/08, W3). */
const FAHRRAD = "fahrrad";
const FAHRRAD_TEMPO = 2;
import type { Aufgabenauftrag } from "../schnittstelle/aufgaben";
import type { Kartenspiel, Kartensorte } from "../schnittstelle/karten";
import type { Kipppunkt, Nadelstufe, Partieauftrag, Partieergebnis } from "../schnittstelle/partie";
import type { Abenteuerstand, Partiekarten, Weltposition } from "../schnittstelle/spielstand";
import { tSpiel } from "../texte/texte";
import { GRUNDSTELLUNG } from "../anbindung/partiestart";
import {
  amZugIn,
  auftragFuer,
  auftragFuerRunde,
  kartenFuerWiedereinstieg,
  sichtbarerZustand,
  wiedereinstiegMoeglich,
} from "./auftraege";
import { Deckwahl } from "./Deckwahl";
import { ZEITKLASSEN } from "../regeln/zeitkarten";
import { Laden } from "./Laden";
import { Steuerkreuz } from "./Steuerkreuz";
import { Tagebuch } from "./Tagebuch";
import {
  beendeOberwelt,
  starteOberwelt,
  szeneVon,
  type Ausloesertreffer,
  type Richtung,
} from "./szene";
import {
  KACHELSATZ,
  SPRACHE,
  aktionFuer,
  ausloeserFuer,
  figurZu,
  ladeWelt,
  objektposition,
  type Weltdaten,
} from "./weltdaten";

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
  const [ergebnis, setzeErgebnis] = useState<Partieergebnis | null>(null);
  const [offenePartie, setzeOffenePartie] = useState<string | null>(null);
  const [tagebuch, setzeTagebuch] = useState(false);
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
  const [offenerLaden, setzeOffenerLaden] = useState<string | null>(null);
  // Eine Aufgabenrunde, die ein Dialog angestoßen hat; sie beginnt, wenn der Dialog zu ist.
  const rundeInArbeit = useRef<string | null>(null);
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
    liesPaketJson<object>(`dialoge/${SPRACHE}/${datei}.json`)
      .then((json) => setzeDialog({ json: JSON.stringify(json), datei, knoten }))
      .catch(() => setzeMeldung(tSpiel("oberwelt.dialogFehlt", { datei })));
  };

  /** Ein Auslöser der Karte (aus Phaser): Übergänge sofort, alles andere als Quest-Ereignis. */
  const beiTreffer = (t: Ausloesertreffer | null) => {
    setzeTreffer(t);
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
    ladeWelt(stand.position.karte)
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
        spiel.current = starteOberwelt(rahmen.current, {
          karte: w.karte,
          kachelbild: w.kachelbild,
          heldbild: w.heldbild,
          figurbild: w.figurbild,
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
      .catch((f: unknown) => setzeFehler(f instanceof Error ? f.message : String(f)));
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
    offenerLaden,
    welt,
  ]);

  const beiRichtung = (richtung: Richtung, gedrueckt: boolean) => {
    const szene = spiel.current ? szeneVon(spiel.current) : null;
    szene?.setzeRichtung(richtung, gedrueckt);
  };

  /** Der Aktionsknopf: Dialog des Auslösers oder der Figur öffnen. */
  const beiAktion = () => {
    if (!welt || !treffer) return;
    if (treffer.typ === "figur") {
      const figur = figurZu(welt.ort, treffer.name);
      if (figur) oeffneDialog(figur.dialog);
      return;
    }
    const a = ausloeserFuer(welt.ort, welt.kennung, treffer.name);
    if (a?.dialog) oeffneDialog(a.dialog);
  };

  if (!stand) return <p className="fehlertext">{tSpiel("oberwelt.keinSpielstand")}</p>;

  const wirkungen: Wirkungen = {
    oeffneLaden: (kennung) => {
      ladenInArbeit.current = kennung;
    },
    gibFund: (kennung) => {
      const aktuell = standRef.current ?? stand;
      const fund = welt?.daten.funde.find((f) => f.kennung === kennung);
      const mit = mitFund(aktuell, kennung, new Date(), fund?.muenzen ?? 0);
      if (mit === aktuell) return;
      // Dialogvariable `gefunden<Fund>` für spätere Bedingungen (übergreifende Quests, E4).
      const neu = {
        ...mit,
        dialogvariablen: { ...mit.dialogvariablen, ...variablenNachFund(kennung) },
      };
      schreibe(neu);
      setzeMeldung(
        tSpiel(fund?.extra ? "fund.gefundenExtra" : "fund.gefunden", {
          name: tSpiel(fund?.name ?? kennung),
        }),
      );
    },
    gibKarte: (kennung) => {
      const aktuell = standRef.current ?? stand;
      schreibe(wendeWirkungenAn(aktuell, [{ art: "karte", karte: kennung }], new Date()));
    },
    setzeSzene: (szene) => {
      const aktuell = standRef.current ?? stand;
      schreibe({ ...aktuell, handlung: { ...aktuell.handlung, szene } });
    },
    beginnePartie: (begegnung) => {
      const aktuell = standRef.current ?? stand;
      if (welt) auftragInArbeit.current = auftragFuer(begegnung, welt.daten, aktuell);
    },
    beginneAufgaben: (runde) => {
      rundeInArbeit.current = runde;
    },
    reise: (karte, ausloeser) => {
      reiseInArbeit.current = { karte, ausloeser };
    },
    setzeZustand: (gegner, faktor, grund) => {
      const aktuell = standRef.current ?? stand;
      schreibe(wendeWirkungenAn(aktuell, [{ art: "zustand", gegner, faktor, grund }], new Date()));
    },
    schalteSteckbrief: (gegner, zeile) => {
      const aktuell = standRef.current ?? stand;
      schreibe(wendeWirkungenAn(aktuell, [{ art: "steckbrief", gegner, zeile }], new Date()));
    },
  };

  /**
   * Startet die Partie zu einem Auftrag mit dem gewählten Deck: Vorgaben ändern die Startstellung
   * und zählen als gespielt (Halbzug 0, Regelwerk R24, R26); Position und laufende Partie werden
   * gesichert, dann übernimmt die App.
   */
  const startePartie = (
    auftrag: Partieauftrag,
    deck: readonly string[],
    schonGespielt: readonly Kartenspiel[] = [],
  ) => {
    const aktuell = standRef.current ?? stand;
    const sorten = (welt?.daten.karten ?? []) as unknown as readonly Kartensorte[];
    const gegnerfarbe = auftrag.farbe === "white" ? "black" : "white";
    let startstellung = auftrag.startstellung;
    const vorher: Kartenspiel[] = [...schonGespielt];
    let karten = aktuell.karten;
    for (const kennung of deck) {
      const sorte = sorten.find((s) => s.kennung === kennung);
      if (!sorte || sorte.zeitpunkt !== "vorher") continue;
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
        deck: deck.filter((k) => !vorher.some((v) => v.kennung === k)),
        gespielt: vorher,
        wiedereinstieg: auftrag.format.art === "wiedereinstieg",
        letzterHalbzug: null,
        gegner: auftrag.profil.kennung,
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
    const neu = { ...aktuell, dialogvariablen: { ...aktuell.dialogvariablen, ...variablen } };
    schreibe(neu);
    const reise = reiseInArbeit.current;
    reiseInArbeit.current = null;
    if (reise) wechsleKarte(reise.karte, reise.ausloeser);
    const laden = ladenInArbeit.current;
    ladenInArbeit.current = null;
    if (laden) setzeOffenerLaden(laden);
    const uebergang = uebergangNachDialog.current;
    uebergangNachDialog.current = null;
    // `wenn` gilt als erfüllt bei true, einer Zahl über 0 (Nadel) oder einem nicht leeren Text.
    if (uebergang && (!uebergang.wenn || Boolean(neu.dialogvariablen[uebergang.wenn]))) {
      wechsleKarte(uebergang.ziel.karte, uebergang.ziel.ausloeser);
    }
    const runde = rundeInArbeit.current;
    rundeInArbeit.current = null;
    if (runde) {
      starteRunde(runde);
      return;
    }
    if (!auftrag) return;
    if ((auftrag.kartenErlaubt && neu.karten.length > 0) || auftrag.zeitwahl)
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
    <div className="abenteuer-welt" data-testid="abenteuer-welt">
      <div ref={rahmen} style={{ width: "100%", height: "100%" }} />
      <span ref={kachelanzeige} hidden data-testid="abenteuer-kachel" />
      <button
        type="button"
        className="abenteuer-tagebuchknopf"
        onClick={() => setzeTagebuch(true)}
        data-testid="abenteuer-tagebuchknopf"
      >
        {tSpiel("tagebuch.knopf")}
      </button>
      <span className="abenteuer-muenzen" data-testid="abenteuer-muenzen" aria-live="polite">
        {tSpiel("laden.muenzenKurz", { anzahl: stand.muenzen })}
      </span>
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
          zeitwahl={deckwahl.zeitwahl === true}
          beiWahl={(deck, zeit) =>
            startePartie(
              deckwahl.zeitwahl ? { ...deckwahl, uhr: ZEITKLASSEN[zeit] } : deckwahl,
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
      {tagebuch && welt && (
        <Tagebuch stand={stand} daten={welt.daten} beiSchliessen={() => setzeTagebuch(false)} />
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
        <section className="abenteuer-ergebnis" role="status" data-testid="abenteuer-ergebnis">
          <p>
            <strong>
              {tSpiel(`ergebnis.${ergebnis.ausgang}`, { gegner: gegnername(ergebnis) })}
            </strong>
          </p>
          <p>{tSpiel("ergebnis.zuege", { anzahl: Math.ceil(ergebnis.halbzuege / 2) })}</p>
          {ergebnis.gespielteKarten.length > 0 && (
            <p>{tSpiel("ergebnis.karten", { anzahl: ergebnis.gespielteKarten.length })}</p>
          )}
          {neueNadel && (
            <p>
              <strong>
                {tSpiel(`ergebnis.nadel.${neueNadel}`, {
                  club: tSpiel(welt?.ort.club?.name ?? "club.mapleFalls.name"),
                })}
              </strong>
            </p>
          )}
          {ergebnis.momente.length > 0 && (
            <p>{tSpiel("ergebnis.momente", { anzahl: ergebnis.momente.length })}</p>
          )}
          {kipppunkt === "suche" && <p className="lade">{tSpiel("ergebnis.kipppunktSuche")}</p>}
          {kipppunkt && kipppunkt !== "suche" && (
            <>
              <p>{tSpiel("ergebnis.kipppunkt", { zug: Math.floor(kipppunkt.halbzug / 2) + 1 })}</p>
              <button
                type="button"
                className="knopf-haupt"
                onClick={() => starteWiedereinstieg(ergebnis, kipppunkt)}
                data-testid="abenteuer-wiedereinstieg"
              >
                {tSpiel("ergebnis.nochEinmal", { zug: Math.floor(kipppunkt.halbzug / 2) + 1 })}
              </button>
            </>
          )}
          <button
            type="button"
            className={kipppunkt && kipppunkt !== "suche" ? "knopf-zweit" : "knopf-haupt"}
            onClick={() => {
              setzeErgebnis(null);
              setzeNeueNadel(null);
              setzeKipppunkt(null);
            }}
          >
            {tSpiel("ergebnis.weiter")}
          </button>
        </section>
      )}
      {rundenergebnis && (
        <section
          className="abenteuer-ergebnis"
          role="status"
          data-testid="abenteuer-rundenergebnis"
        >
          <p>
            <strong>
              {tSpiel(rundenergebnis.bestanden ? "aufgaben.bestanden" : "aufgaben.nichtBestanden", {
                punkte: rundenergebnis.punkte,
                moeglich: rundenergebnis.moeglich,
              })}
            </strong>
          </p>
          {rundenergebnis.reiheGeschafft && (
            <p>
              {tSpiel("aufgaben.reiheBestanden", {
                club: tSpiel(welt?.ort.club?.name ?? "club.mapleFalls.name"),
              })}
            </p>
          )}
          {!rundenergebnis.bestanden && (
            <button
              type="button"
              className="knopf-haupt"
              onClick={() => starteRunde(rundenergebnis.auftrag.runde)}
              data-testid="abenteuer-runde-nochmal"
            >
              {tSpiel("aufgaben.nochEinmal")}
            </button>
          )}
          <button
            type="button"
            className={rundenergebnis.bestanden ? "knopf-haupt" : "knopf-zweit"}
            onClick={() => setzeRundenergebnis(null)}
          >
            {tSpiel("ergebnis.weiter")}
          </button>
        </section>
      )}
      {offeneRunde && (
        <section className="abenteuer-ergebnis" role="status">
          <p>{tSpiel("aufgaben.laeuft")}</p>
          <button
            type="button"
            className="knopf-haupt"
            onClick={() => void dienste.starteAufgaben(offeneRunde)}
          >
            {tSpiel("aufgaben.weiter")}
          </button>
          <button
            type="button"
            className="knopf-zweit"
            onClick={() => {
              setzeOffeneRunde(null);
              schreibe({ ...(standRef.current ?? stand), laufendeAufgaben: null });
            }}
          >
            {tSpiel("aufgaben.abbrechen")}
          </button>
        </section>
      )}
      {offenePartie && (
        <section className="abenteuer-ergebnis" role="status">
          <p>{tSpiel("ergebnis.partieLaeuft")}</p>
          <button
            type="button"
            className="knopf-haupt"
            onClick={() => dienste.zeigePartie(offenePartie)}
          >
            {tSpiel("ergebnis.weiterspielen")}
          </button>
          <button
            type="button"
            className="knopf-zweit"
            onClick={() => {
              setzeOffenePartie(null);
              schreibe({ ...(standRef.current ?? stand), laufendePartie: null });
            }}
          >
            {tSpiel("ergebnis.aufgeben")}
          </button>
        </section>
      )}
    </div>
  );
}
