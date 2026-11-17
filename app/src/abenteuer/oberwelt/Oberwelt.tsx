/**
 * Die Oberwelt: Phaser-Karte in einem React-Rahmen mit Steuerkreuz, Dialogfenster, Tagebuch und
 * dem Rückweg aus der Partie (docs/spiel/04_Architektur.md, Abschnitte 3 und 8).
 *
 * Rolle im Gesamtbild: Das ist der Bildschirm des Spiels. Er zeichnet Karte, Steuerkreuz und alle
 * Fenster; die Abläufe stehen in Hooks über einem gemeinsamen Kern (kern.ts: Spielstand, Welt,
 * Meldung, Quest-Ereignisse, Kartenwechsel, Tönung):
 * - useWeltladen.ts: Welt laden, Phaser starten, Spielzeit sichern;
 * - usePartiestart.ts: Deckwahl, Partiestart, Rückweg, Kipppunkt und Wiedereinstieg (R14, R15);
 * - useAufgabenrunde.ts: Aufgabenrunden (R30 bis R32), Gedächtnisstellung und Simultan;
 * - useDialogende.ts: Dialoge öffnen und ausführen, was sie angestoßen haben.
 * Hier bleiben Auslöser und Aktionsknopf: Ein Übergang wechselt die Karte (oder öffnet erst seinen
 * Dialog), Gegenstand und Figur öffnen ihren Ink-Dialog, ein Statist spricht in einer Blase.
 * Abhängigkeiten: Hooks oben, Steuerkreuz.tsx, Tagebuch.tsx, weltdaten.ts, dialog/Dialog.tsx.
 */
import { useEffect, useRef, useState } from "react";
import { Dialog } from "../dialog/Dialog";
import { deckgroesse, mentorzugGesperrt } from "../regeln/karten";
import { schutzengelGesperrt } from "../regeln/schutzengel";
import { ambroseNichtDa, ambroseSprichtJetzt } from "../regeln/abwesenheit";
import { kaufe } from "../regeln/muenzen";
import { variablenAusBesitz } from "../regeln/dialogvariablen";
import { spruecheErlaubt, ZEITKLASSEN } from "../regeln/zeitkarten";
import type { Kartensorte } from "../schnittstelle/karten";
import { tSpiel } from "../texte/texte";
import { Abspann } from "./Abspann";
import { Deckwahl } from "./Deckwahl";
import { Fensterbank } from "./Fensterbank";
import { Tagebuchseite } from "./Tagebuchseite";
import { Fortsetzungskarte, Partieergebniskarte, Rundenergebniskarte } from "./Ergebniskarten";
import { Gedaechtnisstellung } from "./Gedaechtnisstellung";
import { szeneAus, useOberweltkern } from "./kern";
import { Kopfleiste } from "./Kopfleiste";
import { Laden } from "./Laden";
import { Reisen } from "./Reisen";
import { reiseziele } from "./reiseziele";
import { Sprechblase, type SprechblasenInhalt } from "./Sprechblase";
import { deckwahlsteckbrief } from "./steckbrieftext";
import { Steuerkreuz } from "./Steuerkreuz";
import type { Ausloesertreffer, Richtung } from "./szene";
import { Tagebuch } from "./Tagebuch";
import { useAufgabenrunde } from "./useAufgabenrunde";
import { useBuehne } from "./useBuehne";
import { useDialogende } from "./useDialogende";
import { LUPE, usePartiestart } from "./usePartiestart";
import { useWeltladen } from "./useWeltladen";
import { Vorfuehrung } from "./Vorfuehrung";
import { Meldungsleiste } from "./Meldungsleiste";
import { Orientierung } from "./Orientierung";
import { Untertitelzeile } from "../ton/Untertitelzeile";
import { aktionFuer, ausloeserFuer, figurZu, sprechblaseFuer, type Weltdaten } from "./weltdaten";

/** Gegenstand „Reisebrett“ (docs/spiel/11, I3): Übungspartie gegen Ambrose, ohne ihn gegen Juno. */
const REISEBRETT = "reisebrett";
/** Gegenstand „Monatskarte“ (docs/spiel/11, I6): Schnellreise in besuchte Städte. */
const MONATSKARTE = "monatskarte";

/** Der Laden zu einer Kennung aus den Spieldaten; unbekannt → undefined (kein Fenster). */
function ladenDaten(w: Weltdaten, kennung: string) {
  return w.daten.laeden.find((l) => l.kennung === kennung);
}

export function Oberwelt() {
  const k = useOberweltkern();
  const buehne = useBuehne(k);
  const { dienste, stand, standRef, welt, weltRef, spiel, meldung, meldungsbild, setzeMeldung } = k;
  const { schreibe, melde, wechsleKarte } = k;
  const partie = usePartiestart(k);
  const { deckwahl, ergebnis, offenePartie } = partie;
  const runden = useAufgabenrunde(k, partie);
  const { rundenergebnis, offeneRunde, gedaechtnis } = runden;
  const dialoge = useDialogende(k, partie, runden);
  const { dialog, oeffneDialog, vorfuehrung, offenerLaden, abspann } = dialoge;
  const toenung = k.toenung;
  const ortDesHelden = welt?.ort.kennung ?? null;
  const rahmen = useRef<HTMLDivElement>(null);
  const kachelanzeige = useRef<HTMLSpanElement>(null);
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
    // Ein Übergang wechselt erst, wenn der Held in den Durchgang geht (R060), nicht beim Betreten.
    if (t.typ === "ausloeser" && a?.art === "uebergang" && !t.durch) return;
    if (t.typ === "ausloeser" && a?.art === "uebergang" && a.dialog && a.ziel) {
      dialoge.oeffneUebergang(a.dialog, a.ziel, a.wenn ?? null);
      return;
    }
    if (t.typ === "ausloeser" && a?.art === "uebergang") {
      // Ein Übergang ohne Ziel (etwa die Landstraße nach Cedar Creek) ist noch nicht gebaut.
      if (a.ziel) wechsleKarte(a.ziel.karte, a.ziel.ausloeser);
      else setzeMeldung(tSpiel("oberwelt.karteFehlt", { karte: a.name }));
      return;
    }
    melde({ art: "ort", karte: aktuell.position.karte, ausloeser: t.name }, w);
  };

  const fehler = useWeltladen(k, {
    rahmen,
    kachelanzeige,
    beiTreffer,
    beiWelt: (w) => {
      setzeTreffer(null);
      partie.meldeErgebnis(w);
      runden.meldeRunde(w);
    },
  });

  // Solange ein Fenster offen ist, steht der Held, und die Kopfleiste öffnet kein zweites
  // (Affentest 14.11.2026: „Übungspartie“ und „Reisen“ lagen über „Weitermachen“ und öffneten
  // die Deckwahl neben der Fortsetzungskarte; mit offenem Reisefenster lief der Held weiter).
  const fensterOffen =
    dialog !== null ||
    partie.ergebnis !== null ||
    partie.offenePartie !== null ||
    rundenergebnis !== null ||
    offeneRunde !== null ||
    tagebuch ||
    reisen ||
    partie.deckwahl !== null ||
    vorfuehrung !== null ||
    gedaechtnis !== null ||
    offenerLaden !== null;
  useEffect(() => {
    szeneAus(spiel)?.laufenErlaubt(!fensterOffen);
  }, [spiel, fensterOffen, welt]);

  const beiRichtung = (richtung: Richtung, gedrueckt: boolean) => {
    szeneAus(spiel)?.setzeRichtung(richtung, gedrueckt);
  };

  /** Der Aktionsknopf: Dialog des Auslösers oder der Figur öffnen. */
  const beiAktion = () => {
    if (!welt || !treffer) return;
    if (treffer.typ === "statist") {
      const schluessel = `${welt.kennung}.${treffer.name}`;
      const besuch = angesprochen.current.get(schluessel) ?? 0;
      angesprochen.current.set(schluessel, besuch + 1);
      const spricht = stand ? ambroseSprichtJetzt(stand.dialogvariablen) : false;
      setzeSprechblase(
        sprechblaseFuer(welt, treffer.name, besuch, stand?.held.name ?? "", spricht),
      );
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
      <Orientierung k={k} frei={!fensterOffen && meldung === null} />
      <Untertitelzeile />
      {/* In Erinnerungen (Ambroses Zeit) gibt es weder Tagebuch noch Münzen des Helden (F3). */}
      {!welt?.erinnerung && (
        <Kopfleiste
          muenzen={stand.muenzen}
          beiTagebuch={() => setzeTagebuch(true)}
          beiReisebrett={
            welt && stand.gegenstaende.includes(REISEBRETT) && !fensterOffen
              ? partie.starteUebungspartie
              : null
          }
          beiReisen={
            welt && !welt.innen && stand.gegenstaende.includes(MONATSKARTE) && !fensterOffen
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
          beiKnoten={dialoge.beiKnoten}
          beiEnde={(variablen) => {
            buehne.ende();
            dialoge.beiDialogende(variablen);
          }}
          beiZeile={buehne.zeile}
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
          steckbrief={deckwahlsteckbrief(
            stand,
            welt.daten.gegner,
            deckwahl.profil.kennung,
            stand.gegenstaende.includes(LUPE),
          )}
          farbeFrei={deckwahl.farbeFrei === true}
          mentorGesperrt={mentorzugGesperrt(stand.dialogvariablen)}
          ambroseNichtDa={ambroseNichtDa(stand.dialogvariablen)}
          schutzengelGesperrt={schutzengelGesperrt(stand.dialogvariablen, deckwahl.kennung)}
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
      {dialoge.tagebuchseite && (
        <Tagebuchseite
          name={dialoge.tagebuchseite}
          beiSchliessen={dialoge.schliesseTagebuchseite}
        />
      )}
      {dialoge.fensterbank && welt && (
        <Fensterbank
          gefunden={stand.funde}
          funde={welt.daten.funde}
          beiSchliessen={dialoge.schliesseFensterbank}
        />
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
        <Tagebuch
          stand={stand}
          daten={welt.daten}
          beiSchliessen={() => setzeTagebuch(false)}
          // Position sichern wie vor einer Partie, dann die alte Partie in der Hülle zeigen.
          beiPartie={(id) => {
            const mitPosition = { ...stand, position: k.position(stand) };
            k.merke(mitPosition);
            void dienste.schreibeStand(mitPosition).then(() => dienste.zeigeBeendetePartie(id));
          }}
        />
      )}
      {sprechblase && !dialog && !vorfuehrung && (
        <Sprechblase
          inhalt={sprechblase}
          texte={{
            weiter: tSpiel("ergebnis.weiter"),
            frage: tSpiel("oberwelt.vorfuehrung.frage"),
            zeigen: tSpiel("oberwelt.vorfuehrung.zeigen"),
            ambrose: tSpiel("figur.ambrose.name"),
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
          ort={ortDesHelden}
          beiEnde={(bestanden) => runden.beendeGedaechtnis(gedaechtnis, bestanden)}
        />
      )}
      {vorfuehrung && (
        <Vorfuehrung
          kennung={vorfuehrung}
          ort={ortDesHelden}
          beiSchliessen={() => dialoge.zeigeVorfuehrung(null)}
        />
      )}
      {/* Erst nach der Ergebniskarte („Erledigt: …“ lag unter „Gewonnen!“, Spieltest einstieg). */}
      {meldung && !ergebnis && !rundenergebnis && (
        <Meldungsleiste
          text={meldung}
          bild={meldungsbild}
          beiSchliessen={() => setzeMeldung(null)}
        />
      )}
      {/* Erst mit geladener Welt: Der Name des Gegners kommt aus ihren Daten; vorher stand kurz
          „Gewonnen gegen !“ da (Funktionstest N2608, 15.11.2026). */}
      {ergebnis && welt && (
        <Partieergebniskarte
          ergebnis={ergebnis}
          gegner={partie.gegnername(ergebnis)}
          club={welt?.ort.club ? tSpiel(welt.ort.club.name) : null}
          neueNadel={partie.neueNadel}
          kipppunkt={partie.kipppunkt}
          ohneAmbrose={ambroseNichtDa(stand.dialogvariablen)}
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
          beiWeiter={() => {
            runden.schliesseRundenergebnis();
            // Ein Dialog nach der Runde (runden.json `danach`) startet von selbst.
            const danach = welt?.daten.runden.find(
              (r) => r.kennung === rundenergebnis.auftrag.runde,
            );
            if (danach?.danach) oeffneDialog(danach.danach);
          }}
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
          beiWeiter={() => {
            // Kennt die App die Partie nicht mehr (Affentest, 14.11.2026), räumt die Karte auf,
            // statt einen toten Knopf zu zeigen; die Begegnung lässt sich neu beginnen.
            if (!dienste.zeigePartie(offenePartie)) partie.gibOffenePartieAuf();
          }}
          beiAbbrechen={partie.gibOffenePartieAuf}
        />
      )}
    </div>
  );
}
