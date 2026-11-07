/**
 * Die Oberwelt: Phaser-Karte in einem React-Rahmen mit Steuerkreuz, Dialogfenster und dem
 * Rückweg aus der Partie (docs/spiel/04_Architektur.md, Abschnitte 3 und 8).
 *
 * Rolle im Gesamtbild: Das ist der Bildschirm des Spiels. Beim Aufbau lädt er Spieldaten und
 * die Karte des Spielstands aus dem Paket, startet Phaser, und prüft, ob eine Partie des
 * Abenteuers offen oder gerade beendet ist (Rückweg: Ergebnis in den Spielstand, Karte zeigen).
 * Auslöser der Karte (Objekte „ausloeser“) werden über orte.json gedeutet: Gegenstand oder Figur
 * → Aktionsknopf → Ink-Dialog; der Dialog kann über `beginnePartie` eine Begegnung starten,
 * dann baut diese Datei den Partieauftrag und übergibt ihn den Diensten der App.
 * Im Prototyp (Schritt 5) ohne Quest-Auswertung, Karten und Wiedereinstieg (Schritt 8).
 * Abhängigkeiten: oberwelt/szene.ts, oberwelt/Steuerkreuz.tsx, dialog/Dialog.tsx,
 * daten/laden.ts, paket/paketlader.ts, regeln/gegnerstaerke.ts, modul/abenteuer.tsx (Dienste).
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
import type { Gegnerprofil, Gegnerzustand } from "../schnittstelle/gegnerprofil";
import type { Partieauftrag, Partieergebnis } from "../schnittstelle/partie";
import type { Abenteuerstand } from "../schnittstelle/spielstand";
import { tSpiel } from "../texte/texte";
import { farbeAus } from "../anbindung/partiestart";
import { Steuerkreuz } from "./Steuerkreuz";
import { beendeOberwelt, starteOberwelt, szeneVon, type Richtung } from "./szene";

/** Bilder des Prototyps im Paket (bis die LimeZu-Kacheln da sind, Entscheidung A10). */
const KACHELBILD = "grafik/platzhalter.png";
const HELDBILD = "grafik/held.png";
const KACHELSATZ = "platzhalter";
const SPRACHE = "de";

/** Was zum Aufbau der Szene geladen wurde. */
interface Weltdaten {
  readonly daten: Spieldaten;
  readonly ort: Ortdaten;
  readonly karte: object;
  readonly kachelbild: string;
  readonly heldbild: string;
}

/** Ein offener Dialog: die übersetzte Geschichte und der Knoten. */
interface OffenerDialog {
  readonly json: string;
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
  const [karte, kachelbild, heldbild] = await Promise.all([
    liesPaketJson<object>(fund.karte.datei),
    paketdateiAlsAdresse(KACHELBILD),
    paketdateiAlsAdresse(HELDBILD),
  ]);
  return { daten, ort: fund.ort, karte, kachelbild, heldbild };
}

/** Der Knopftext zu einem Auslöser der Karte; null, wenn er nichts auslöst. */
function aktionFuer(ort: Ortdaten, name: string | null): string | null {
  const a = name ? ort.ausloeser.find((x) => x.name === name) : undefined;
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
  const [welt, setzeWelt] = useState<Weltdaten | null>(null);
  const [fehler, setzeFehler] = useState<string | null>(null);
  const [ausloeser, setzeAusloeser] = useState<string | null>(null);
  const [dialog, setzeDialog] = useState<OffenerDialog | null>(null);
  const [meldung, setzeMeldung] = useState<string | null>(null);
  const [ergebnis, setzeErgebnis] = useState<Partieergebnis | null>(null);
  const [offenePartie, setzeOffenePartie] = useState<string | null>(null);
  const auftragInArbeit = useRef<Partieauftrag | null>(null);

  /** Schreibt den Spielstand in die App und merkt ihn hier. */
  const schreibe = (neu: Abenteuerstand) => {
    setzeStand(neu);
    void dienste.schreibeStand(neu);
  };

  // Rückweg: eine Partie des Abenteuers war offen; ist sie beendet, kommt das Ergebnis hierher.
  useEffect(() => {
    if (!stand?.laufendePartie) return;
    const kennung = stand.laufendePartie;
    void dienste.liesErgebnis(kennung).then((e) => {
      if (e) {
        setzeErgebnis(e);
        schreibe({
          ...stand,
          laufendePartie: null,
          protokoll: [
            ...stand.protokoll,
            {
              ergebnis: e,
              ort: stand.position.karte.split(".")[0] ?? "",
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

  // Welt laden und Phaser starten; beim Verlassen Position und Spielzeit sichern, Phaser beenden.
  useEffect(() => {
    if (!stand) return;
    let aktiv = true;
    // Beginn dieser Sitzung in der Welt, für die Spielzeit im Spielstand.
    const begonnen = Date.now();
    ladeWelt(stand.position.karte)
      .then((w) => {
        if (!aktiv || !rahmen.current) return;
        setzeWelt(w);
        spiel.current = starteOberwelt(rahmen.current, {
          karte: w.karte,
          kachelbild: w.kachelbild,
          heldbild: w.heldbild,
          kachelsatz: KACHELSATZ,
          start: stand.position,
          melder: { beiAusloeser: (name) => setzeAusloeser(name) },
        });
      })
      .catch((f: unknown) => setzeFehler(f instanceof Error ? f.message : String(f)));
    return () => {
      aktiv = false;
      const szene = spiel.current ? szeneVon(spiel.current) : null;
      const aktuell = dienste.liesStand();
      if (szene && aktuell) {
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
    // Die Karte wechselt im Prototyp nicht; ein Wechsel kommt mit den Übergängen (Schritt 8).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stand?.position.karte]);

  // Solange ein Dialog, ein Ergebnis oder eine Meldung offen ist, steht der Held.
  useEffect(() => {
    const szene = spiel.current ? szeneVon(spiel.current) : null;
    szene?.laufenErlaubt(dialog === null && ergebnis === null && offenePartie === null);
  }, [dialog, ergebnis, offenePartie, welt]);

  const beiRichtung = (richtung: Richtung, gedrueckt: boolean) => {
    const szene = spiel.current ? szeneVon(spiel.current) : null;
    szene?.setzeRichtung(richtung, gedrueckt);
  };

  /** Der Aktionsknopf: Dialog des Auslösers öffnen. */
  const beiAktion = () => {
    if (!welt || !ausloeser) return;
    const a = welt.ort.ausloeser.find((x) => x.name === ausloeser);
    if (!a?.dialog) return;
    const [datei, knoten] = a.dialog.split(".", 2);
    if (!datei || !knoten) return;
    liesPaketJson<object>(`dialoge/${SPRACHE}/${datei}.json`)
      .then((json) => setzeDialog({ json: JSON.stringify(json), knoten }))
      .catch((f: unknown) => setzeFehler(f instanceof Error ? f.message : String(f)));
  };

  if (!stand) return <p className="fehlertext">{tSpiel("oberwelt.keinSpielstand")}</p>;

  const wirkungen: Wirkungen = {
    gibKarte: (kennung) => {
      const vorhanden = stand.karten.find((k) => k.kennung === kennung);
      const karten = vorhanden
        ? stand.karten.map((k) => (k.kennung === kennung ? { ...k, anzahl: k.anzahl + 1 } : k))
        : [...stand.karten, { kennung, anzahl: 1, erhalten: new Date().toISOString() }];
      schreibe({ ...stand, karten });
    },
    setzeSzene: (szene) => schreibe({ ...stand, handlung: { ...stand.handlung, szene } }),
    beginnePartie: (begegnung) => {
      if (welt)
        auftragInArbeit.current = auftragFuer(begegnung, welt.daten, stand, dienste.wertung());
    },
    beginneAufgaben: () => setzeMeldung(tSpiel("oberwelt.nochNichtGebaut")),
    setzeZustand: (gegner, faktor, grund) => {
      const figuren = [
        ...stand.figuren.filter((f) => f.kennung !== gegner),
        { kennung: gegner, abgelenkt: { faktor, grund }, analysiert: false, dialogvariablen: {} },
      ];
      schreibe({ ...stand, figuren });
    },
    schalteSteckbrief: () => undefined,
  };

  /** Dialog zu Ende: Variablen sichern, dann eine angestoßene Partie starten. */
  const beiDialogende = (variablen: Dialogvariablen) => {
    setzeDialog(null);
    const auftrag = auftragInArbeit.current;
    auftragInArbeit.current = null;
    const neu = { ...stand, dialogvariablen: { ...stand.dialogvariablen, ...variablen } };
    if (auftrag) {
      const szene = spiel.current ? szeneVon(spiel.current) : null;
      const position = szene
        ? { ...szene.position(), karte: stand.position.karte }
        : stand.position;
      setzeStand({ ...neu, position, laufendePartie: auftrag.kennung });
      void dienste.schreibeStand({ ...neu, position }).then(() => dienste.startePartie(auftrag));
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
      {fehler && (
        <p className="fehlertext abenteuer-ergebnis">{tSpiel("oberwelt.fehler", { fehler })}</p>
      )}
      {!welt && !fehler && <p className="lade abenteuer-ergebnis">{tSpiel("oberwelt.laedt")}</p>}
      {welt && !dialog && (
        <Steuerkreuz
          beiRichtung={beiRichtung}
          aktion={aktionFuer(welt.ort, ausloeser)}
          beiAktion={beiAktion}
        />
      )}
      {dialog && (
        <Dialog
          key={dialog.knoten}
          json={dialog.json}
          knoten={dialog.knoten}
          wirkungen={wirkungen}
          variablen={stand.dialogvariablen}
          heldname={stand.held.name}
          beiEnde={beiDialogende}
        />
      )}
      {meldung && (
        <section className="abenteuer-ergebnis" role="status">
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
              schreibe({ ...stand, laufendePartie: null });
            }}
          >
            {tSpiel("ergebnis.aufgeben")}
          </button>
        </section>
      )}
    </div>
  );
}
