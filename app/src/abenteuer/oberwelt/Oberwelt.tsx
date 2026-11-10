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
import { Dialog } from "../dialog/Dialog";
import { deckgroesse, mentorzugGesperrt } from "../regeln/karten";
import { kaufe } from "../regeln/muenzen";
import { variablenAusBesitz, variablenNachBesuch } from "../regeln/dialogvariablen";
import { spruecheErlaubt, ZEITKLASSEN } from "../regeln/zeitkarten";
import type { Kartensorte } from "../schnittstelle/karten";
import { fehlertext, tSpiel } from "../texte/texte";
import { Abspann } from "./Abspann";
import { Deckwahl } from "./Deckwahl";
import { Fortsetzungskarte, Partieergebniskarte, Rundenergebniskarte } from "./Ergebniskarten";
import { Gedaechtnisstellung } from "./Gedaechtnisstellung";
import { useOberweltkern } from "./kern";
import { Kopfleiste } from "./Kopfleiste";
import { Laden } from "./Laden";
import { beendeOberwelt, starteOberwelt, szeneVon } from "./oberweltspiel";
import { Reisen } from "./Reisen";
import { reiseziele } from "./reiseziele";
import { Sprechblase, type SprechblasenInhalt } from "./Sprechblase";
import { lupenzeilen } from "./steckbrieftext";
import { Steuerkreuz } from "./Steuerkreuz";
import type { Ausloesertreffer, Richtung } from "./szene";
import { Tagebuch } from "./Tagebuch";
import { aktuelleToenung } from "./toenung";
import { useAufgabenrunde } from "./useAufgabenrunde";
import { useDialogende } from "./useDialogende";
import { LUPE, usePartiestart } from "./usePartiestart";
import { Vorfuehrung } from "./Vorfuehrung";
import {
  KACHELSATZ,
  aktionFuer,
  ausloeserFuer,
  figurZu,
  ladeWelt,
  sprechblaseFuer,
  type Weltdaten,
} from "./weltdaten";

/** Gegenstand „Reisebrett“ (docs/spiel/11, I3): Übungspartie gegen Ambrose. */
const REISEBRETT = "reisebrett";
/** Gegenstand „Monatskarte“ (docs/spiel/11, I6): Schnellreise in besuchte Städte. */
const MONATSKARTE = "monatskarte";
/** Gegenstand für den Lichtkreis auf dunklen Karten (Sperren S4, S9, S11, S14). */
const LATERNE = "laterne";
/** Gegenstand Fahrrad und sein Tempofaktor draußen (docs/spiel/08, W3). */
const FAHRRAD = "fahrrad";
const FAHRRAD_TEMPO = 2;

/** Was die Lupe über einen Gegner verrät; leer ohne Lupe oder ohne Gegnerdaten. */
function lupeFuer(
  gegenstaende: readonly string[],
  gegner: Weltdaten["daten"]["gegner"],
  kennung: string,
): readonly string[] {
  const daten = gegenstaende.includes(LUPE) ? gegner.find((g) => g.kennung === kennung) : undefined;
  return daten ? lupenzeilen(daten) : [];
}

/** Der Laden zu einer Kennung aus den Spieldaten; unbekannt → undefined (kein Fenster). */
function ladenDaten(w: Weltdaten, kennung: string) {
  return w.daten.laeden.find((l) => l.kennung === kennung);
}

export function Oberwelt() {
  const k = useOberweltkern();
  const { dienste, stand, standRef, welt, weltRef, spiel, meldung, setzeMeldung } = k;
  const { schreibe, melde, wechsleKarte } = k;
  const partie = usePartiestart(k);
  const { deckwahl, ergebnis, offenePartie } = partie;
  const runden = useAufgabenrunde(k, partie);
  const { rundenergebnis, offeneRunde, gedaechtnis } = runden;
  const dialoge = useDialogende(k, partie, runden);
  const { dialog, oeffneDialog, vorfuehrung, offenerLaden, abspann } = dialoge;
  const toenung = k.toenung;
  const rahmen = useRef<HTMLDivElement>(null);
  const kachelanzeige = useRef<HTMLSpanElement>(null);
  const [fehler, setzeFehler] = useState<string | null>(null);
  const [treffer, setzeTreffer] = useState<Ausloesertreffer | null>(null);
  // Sprechblase eines Statisten und wie oft jeder schon angesprochen wurde (nur in dieser Sitzung).
  const [sprechblase, setzeSprechblase] = useState<SprechblasenInhalt | null>(null);
  const angesprochen = useRef(new Map<string, number>());
  const [tagebuch, setzeTagebuch] = useState(false);
  const [reisen, setzeReisen] = useState(false);
  /** Ein Auslöser der Karte (aus Phaser): Übergänge sofort, alles andere als Quest-Ereignis. */
  const beiTreffer = (t: Ausloesertreffer | null) => {
    setzeTreffer(t);
    if (!t) setzeSprechblase(null);
    const w = weltRef.current;
    const aktuell = standRef.current;
    if (!t || !w || !aktuell) return;
    const a = ausloeserFuer(w.ort, w.kennung, t.name);
    if (t.typ === "ausloeser" && a?.art === "uebergang" && t.darauf && a.dialog && a.ziel) {
      dialoge.oeffneUebergang(a.dialog, a.ziel, a.wenn ?? null);
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
        k.setzeWelt(w);
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
        partie.meldeErgebnis(w);
        runden.meldeRunde(w);
        const startToenung = aktuelleToenung(w.karte, w.kennung, stand.dialogvariablen);
        k.zeigeToenung(startToenung);
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
        partie.ergebnis === null &&
        partie.offenePartie === null &&
        rundenergebnis === null &&
        offeneRunde === null &&
        !tagebuch &&
        !partie.deckwahl &&
        vorfuehrung === null &&
        gedaechtnis === null &&
        offenerLaden === null,
    );
  }, [
    spiel,
    dialog,
    partie.ergebnis,
    partie.offenePartie,
    rundenergebnis,
    offeneRunde,
    tagebuch,
    partie.deckwahl,
    vorfuehrung,
    gedaechtnis,
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
              ? partie.starteUebungspartie
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
          wirkungen={dialoge.wirkungen}
          variablen={{ ...stand.dialogvariablen, ...variablenAusBesitz(stand) }}
          heldname={stand.held.name}
          beiKnoten={(knoten) => melde({ art: "dialog", knoten: `${dialog.datei}.${knoten}` })}
          beiEnde={dialoge.beiDialogende}
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
            partie.startePartie(
              {
                ...deckwahl,
                ...(deckwahl.zeitwahl ? { uhr: ZEITKLASSEN[zeit] } : {}),
                ...(farbe ? { farbe } : {}),
              },
              deck,
            )
          }
          beiAbbruch={partie.brichDeckwahlAb}
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
          beiSchliessen={dialoge.schliesseLaden}
        />
      )}
      {abspann && welt && (
        <Abspann stand={stand} daten={welt.daten} beiSchliessen={dialoge.schliesseAbspann} />
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
            dialoge.zeigeVorfuehrung(kennung);
          }}
        />
      )}
      {gedaechtnis && (
        <Gedaechtnisstellung
          kennung={gedaechtnis}
          beiEnde={(bestanden) => runden.beendeGedaechtnis(gedaechtnis, bestanden)}
        />
      )}
      {vorfuehrung && (
        <Vorfuehrung kennung={vorfuehrung} beiSchliessen={() => dialoge.zeigeVorfuehrung(null)} />
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
          gegner={partie.gegnername(ergebnis)}
          club={tSpiel(welt?.ort.club?.name ?? "club.mapleFalls.name")}
          neueNadel={partie.neueNadel}
          kipppunkt={partie.kipppunkt}
          beiWiedereinstieg={(p) => partie.starteWiedereinstieg(ergebnis, p)}
          beiWeiter={() => {
            partie.schliesseErgebnis();
            runden.weiterImSimultan(ergebnis);
          }}
        />
      )}
      {rundenergebnis && (
        <Rundenergebniskarte
          ergebnis={rundenergebnis}
          club={tSpiel(welt?.ort.club?.name ?? "club.mapleFalls.name")}
          beiNochmal={runden.starteRunde}
          beiWeiter={runden.schliesseRundenergebnis}
        />
      )}
      {offeneRunde && (
        <Fortsetzungskarte
          text="aufgaben.laeuft"
          weiter="aufgaben.weiter"
          abbrechen="aufgaben.abbrechen"
          beiWeiter={() => void dienste.starteAufgaben(offeneRunde)}
          beiAbbrechen={runden.brichRundeAb}
        />
      )}
      {offenePartie && (
        <Fortsetzungskarte
          text="ergebnis.partieLaeuft"
          weiter="ergebnis.weiterspielen"
          abbrechen="ergebnis.aufgeben"
          beiWeiter={() => dienste.zeigePartie(offenePartie)}
          beiAbbrechen={partie.gibOffenePartieAuf}
        />
      )}
    </div>
  );
}
