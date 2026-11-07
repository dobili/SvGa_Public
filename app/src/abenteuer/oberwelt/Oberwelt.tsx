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
 * Noch offen (Schritt 8c ff.): Karten in der Partie, Kipppunkt, Aufgabenrunden.
 * Abhängigkeiten: oberwelt/szene.ts, oberwelt/Steuerkreuz.tsx, oberwelt/Tagebuch.tsx,
 * dialog/Dialog.tsx, daten/laden.ts, paket/paketlader.ts, regeln/gegnerstaerke.ts,
 * regeln/quests.ts, modul/abenteuer.tsx (Dienste).
 */
import { useEffect, useRef, useState } from "react";
import type Phaser from "phaser";
import { liesPaketJson, paketdateiAlsAdresse } from "../paket/paketlader";
import {
  findeKarte,
  ladeSpieldaten,
  type Gegnerdaten,
  type Ortdaten,
  type Spieldaten,
} from "../daten/laden";
import { Dialog } from "../dialog/Dialog";
import type { Dialogvariablen, Wirkungen } from "../dialog/geschichte";
import { appdienste } from "../modul/abenteuer";
import { gerechneteStaerke } from "../regeln/gegnerstaerke";
import { wendeWirkungenAn, werteEreignisAus, type Questereignis } from "../regeln/quests";
import type { Gegnerprofil, Gegnerzustand } from "../schnittstelle/gegnerprofil";
import type { Partieauftrag, Partieergebnis } from "../schnittstelle/partie";
import type { Abenteuerstand, Weltposition } from "../schnittstelle/spielstand";
import { tSpiel } from "../texte/texte";
import { farbeAus } from "../anbindung/partiestart";
import { Steuerkreuz } from "./Steuerkreuz";
import { Tagebuch } from "./Tagebuch";
import {
  beendeOberwelt,
  starteOberwelt,
  szeneVon,
  type Ausloesertreffer,
  type Richtung,
} from "./szene";

/** Bilder des Prototyps im Paket (bis die LimeZu-Kacheln da sind, Entscheidung A10). */
const KACHELBILD = "grafik/platzhalter.png";
const HELDBILD = "grafik/held.png";
const FIGURBILD = "grafik/figur.png";
const KACHELSATZ = "platzhalter";
const SPRACHE = "de";

/** Was zum Aufbau der Szene geladen wurde. */
interface Weltdaten {
  /** Kennung der geladenen Karte; passt sie nicht mehr zum Spielstand, gilt die Welt als alt. */
  readonly kennung: string;
  readonly daten: Spieldaten;
  readonly ort: Ortdaten;
  readonly karte: object;
  readonly kachelbild: string;
  readonly heldbild: string;
  readonly figurbild: string;
}

/** Ein offener Dialog: die übersetzte Geschichte, der Knoten und der Name der Datei. */
interface OffenerDialog {
  readonly json: string;
  readonly datei: string;
  readonly knoten: string;
}

/** Ein Gegnerprofil aus den Spieldaten (die Formen stimmen, das Schema hat sie geprüft). */
function profilAus(daten: Gegnerdaten): Gegnerprofil {
  return daten as unknown as Gegnerprofil;
}

/** Zustand eines Gegners aus dem Spielstand; ohne Eintrag normal. */
function zustandAus(stand: Abenteuerstand, gegner: string): Gegnerzustand {
  const figur = stand.figuren.find((f) => f.kennung === gegner);
  return {
    haeufigkeitsfaktor: figur?.abgelenkt?.faktor ?? 1,
    grund: figur?.abgelenkt?.grund ?? null,
    analysiert: figur?.analysiert ?? false,
  };
}

/** Baut den Partieauftrag einer Begegnung; null, wenn die Spieldaten sie nicht kennen. */
function auftragFuer(
  begegnung: string,
  daten: Spieldaten,
  stand: Abenteuerstand,
  wertung: number | null,
): Partieauftrag | null {
  const b = daten.begegnungen.find((x) => x.kennung === begegnung);
  const gegner = b && daten.gegner.find((g) => g.kennung === b.gegner);
  if (!b || !gegner) return null;
  const profil = profilAus(gegner);
  const zustand = zustandAus(stand, gegner.kennung);
  const staerke = gerechneteStaerke(profil, zustand, {
    aktuell: wertung,
    eingang: stand.eingangswertung > 0 ? stand.eingangswertung : null,
  });
  return {
    kennung: `${begegnung}#${Date.now().toString(36)}`,
    begegnung,
    profil,
    zustand,
    staerke,
    farbe: farbeAus(b.farbe, Math.random),
    format: b.format,
    startstellung: b.startstellung,
    deck: { karten: [] },
    kartenErlaubt: b.kartenErlaubt,
    zaehltFuerApp: b.zaehltFuerApp ?? b.startstellung.art === "grundstellung",
    uhr: null,
  };
}

/** Lädt Spieldaten, Karte und Bilder für die Karte des Spielstands. */
async function ladeWelt(kartenkennung: string): Promise<Weltdaten> {
  const daten = await ladeSpieldaten();
  const fund = findeKarte(daten, kartenkennung);
  if (!fund) throw new Error(`Karte ${kartenkennung} fehlt in orte.json`);
  const [karte, kachelbild, heldbild, figurbild] = await Promise.all([
    liesPaketJson<object>(fund.karte.datei),
    paketdateiAlsAdresse(KACHELBILD),
    paketdateiAlsAdresse(HELDBILD),
    paketdateiAlsAdresse(FIGURBILD),
  ]);
  return { kennung: kartenkennung, daten, ort: fund.ort, karte, kachelbild, heldbild, figurbild };
}

/** Das Objekt `name` einer Tiled-Karte in Kachelkoordinaten, oder null. */
function objektposition(karte: object, name: string): { x: number; y: number } | null {
  const ebenen = (karte as { layers?: readonly { type?: string; objects?: readonly unknown[] }[] })
    .layers;
  for (const ebene of ebenen ?? []) {
    if (ebene.type !== "objectgroup") continue;
    for (const o of ebene.objects ?? []) {
      const objekt = o as { name?: string; x?: number; y?: number };
      if (objekt.name === name) {
        return { x: Math.round((objekt.x ?? 0) / 16), y: Math.round((objekt.y ?? 0) / 16) };
      }
    }
  }
  return null;
}

/** Figur einer Karte zu einem Objektnamen („coachDelgado“ → Figur `ort.coachDelgado`). */
function figurZu(ort: Ortdaten, name: string) {
  return ort.figuren.find((f) => f.kennung === `${ort.kennung}.${name}` || f.kennung === name);
}

/** Der Knopftext zu einem Treffer der Karte; null, wenn er nichts auslöst. */
function aktionFuer(ort: Ortdaten, treffer: Ausloesertreffer | null): string | null {
  if (!treffer) return null;
  if (treffer.typ === "figur") {
    return figurZu(ort, treffer.name) ? tSpiel("oberwelt.aktion.sprechen") : null;
  }
  const a = ort.ausloeser.find((x) => x.name === treffer.name);
  if (!a) return null;
  if (a.art === "gegenstand") return tSpiel("oberwelt.aktion.ansehen");
  if (a.art === "dialog") return tSpiel("oberwelt.aktion.sprechen");
  return null;
}

export function Oberwelt() {
  const dienste = appdienste();
  const rahmen = useRef<HTMLDivElement>(null);
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
  const auftragInArbeit = useRef<Partieauftrag | null>(null);
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
      if (e) {
        setzeErgebnis(e);
        offenesErgebnis.current = e;
        schreibe({
          ...aktuell,
          laufendePartie: null,
          protokoll: [
            ...aktuell.protokoll,
            {
              ergebnis: e,
              ort: aktuell.position.karte.split(".")[0] ?? "",
              gegner: kennung.split("#")[0] ?? "",
            },
          ],
        });
      } else {
        setzeOffenePartie(kennung);
      }
    });
    // Nur beim Aufbau; der Spielstand ändert sich danach nur noch durch diese Komponente.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Ein gelesenes Partieergebnis als Quest-Ereignis, sobald die Welt da ist. */
  const meldeErgebnis = (w: Weltdaten) => {
    const e = offenesErgebnis.current;
    if (!e) return;
    offenesErgebnis.current = null;
    const begegnung = e.kennung.split("#")[0] ?? "";
    const ausgang = e.ausgang === "abgebrochen" ? "niederlage" : e.ausgang;
    melde({ art: "partie", begegnung, ausgang: [ausgang] }, w);
  };

  /** Ein Auslöser der Karte (aus Phaser): Übergänge sofort, alles andere als Quest-Ereignis. */
  const beiTreffer = (t: Ausloesertreffer | null) => {
    setzeTreffer(t);
    const w = weltRef.current;
    const aktuell = standRef.current;
    if (!t || !w || !aktuell) return;
    const a = w.ort.ausloeser.find((x) => x.name === t.name);
    if (t.typ === "ausloeser" && a?.art === "uebergang" && a.ziel && t.darauf) {
      wechsleKarte(a.ziel.karte, a.ziel.ausloeser);
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
        // Karte betreten (Quests), dann ein Partieergebnis, das auf die Welt gewartet hat.
        melde({ art: "ort", karte: w.kennung }, w);
        meldeErgebnis(w);
        spiel.current = starteOberwelt(rahmen.current, {
          karte: w.karte,
          kachelbild: w.kachelbild,
          heldbild: w.heldbild,
          figurbild: w.figurbild,
          kachelsatz: KACHELSATZ,
          start: stand.position,
          melder: { beiAusloeser: beiTreffer },
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
        void dienste.schreibeStand({
          ...aktuell,
          position,
          spielzeitSekunden: aktuell.spielzeitSekunden + sekunden,
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
      dialog === null && ergebnis === null && offenePartie === null && !tagebuch,
    );
  }, [dialog, ergebnis, offenePartie, tagebuch, welt]);

  const beiRichtung = (richtung: Richtung, gedrueckt: boolean) => {
    const szene = spiel.current ? szeneVon(spiel.current) : null;
    szene?.setzeRichtung(richtung, gedrueckt);
  };

  /** Öffnet den Dialog „datei.knoten“ aus dem Paket. */
  const oeffneDialog = (verweis: string) => {
    const [datei, knoten] = verweis.split(".", 2);
    if (!datei || !knoten) return;
    liesPaketJson<object>(`dialoge/${SPRACHE}/${datei}.json`)
      .then((json) => setzeDialog({ json: JSON.stringify(json), datei, knoten }))
      .catch(() => setzeMeldung(tSpiel("oberwelt.dialogFehlt", { datei })));
  };

  /** Der Aktionsknopf: Dialog des Auslösers oder der Figur öffnen. */
  const beiAktion = () => {
    if (!welt || !treffer) return;
    if (treffer.typ === "figur") {
      const figur = figurZu(welt.ort, treffer.name);
      if (figur) oeffneDialog(figur.dialog);
      return;
    }
    const a = welt.ort.ausloeser.find((x) => x.name === treffer.name);
    if (a?.dialog) oeffneDialog(a.dialog);
  };

  if (!stand) return <p className="fehlertext">{tSpiel("oberwelt.keinSpielstand")}</p>;

  const wirkungen: Wirkungen = {
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
      if (welt)
        auftragInArbeit.current = auftragFuer(begegnung, welt.daten, aktuell, dienste.wertung());
    },
    beginneAufgaben: () => setzeMeldung(tSpiel("oberwelt.nochNichtGebaut")),
    setzeZustand: (gegner, faktor, grund) => {
      const aktuell = standRef.current ?? stand;
      schreibe(wendeWirkungenAn(aktuell, [{ art: "zustand", gegner, faktor, grund }], new Date()));
    },
    schalteSteckbrief: (gegner, zeile) => {
      const aktuell = standRef.current ?? stand;
      schreibe(wendeWirkungenAn(aktuell, [{ art: "steckbrief", gegner, zeile }], new Date()));
    },
  };

  /** Dialog zu Ende: Variablen sichern, dann eine angestoßene Partie starten. */
  const beiDialogende = (variablen: Dialogvariablen) => {
    setzeDialog(null);
    const aktuell = standRef.current ?? stand;
    const auftrag = auftragInArbeit.current;
    auftragInArbeit.current = null;
    const neu = { ...aktuell, dialogvariablen: { ...aktuell.dialogvariablen, ...variablen } };
    if (auftrag) {
      const szene = spiel.current ? szeneVon(spiel.current) : null;
      const position = szene
        ? { ...szene.position(), karte: aktuell.position.karte }
        : aktuell.position;
      const mitPartie = { ...neu, position, laufendePartie: auftrag.kennung };
      standRef.current = mitPartie;
      setzeStand(mitPartie);
      void dienste.schreibeStand(mitPartie).then(() => dienste.startePartie(auftrag));
    } else {
      schreibe(neu);
    }
  };

  const gegnername = (e: Partieergebnis) => {
    const kennung = e.kennung.split("#")[0] ?? "";
    const begegnung = welt?.daten.begegnungen.find((b) => b.kennung === kennung);
    const gegner = begegnung && welt?.daten.gegner.find((g) => g.kennung === begegnung.gegner);
    return gegner ? tSpiel(gegner.name) : "";
  };

  return (
    <div className="abenteuer-welt" data-testid="abenteuer-welt">
      <div ref={rahmen} style={{ width: "100%", height: "100%" }} />
      <button
        type="button"
        className="abenteuer-tagebuchknopf"
        onClick={() => setzeTagebuch(true)}
        data-testid="abenteuer-tagebuchknopf"
      >
        {tSpiel("tagebuch.knopf")}
      </button>
      {fehler && (
        <p className="fehlertext abenteuer-ergebnis">{tSpiel("oberwelt.fehler", { fehler })}</p>
      )}
      {!welt && !fehler && <p className="lade abenteuer-ergebnis">{tSpiel("oberwelt.laedt")}</p>}
      {welt && !dialog && (
        <Steuerkreuz
          beiRichtung={beiRichtung}
          aktion={aktionFuer(welt.ort, treffer)}
          beiAktion={beiAktion}
        />
      )}
      {dialog && (
        <Dialog
          key={`${dialog.datei}.${dialog.knoten}`}
          json={dialog.json}
          knoten={dialog.knoten}
          wirkungen={wirkungen}
          variablen={stand.dialogvariablen}
          heldname={stand.held.name}
          beiKnoten={(knoten) => melde({ art: "dialog", knoten: `${dialog.datei}.${knoten}` })}
          beiEnde={beiDialogende}
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
          {ergebnis.momente.length > 0 && (
            <p>{tSpiel("ergebnis.momente", { anzahl: ergebnis.momente.length })}</p>
          )}
          <button type="button" className="knopf-haupt" onClick={() => setzeErgebnis(null)}>
            {tSpiel("ergebnis.weiter")}
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
