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
 * - useDialogende.ts: Dialoge öffnen und ausführen, was sie angestoßen haben;
 * - useAusloeser.ts: Auslöser und Aktionsknopf (Übergang, Figur, Gegenstand, Statist in der Blase).
 * Abhängigkeiten: Hooks oben, Steuerkreuz.tsx, Tagebuch.tsx, weltdaten.ts, dialog/Dialog.tsx.
 */
import { useEffect, useRef, useState } from "react";
import { Dialog } from "../dialog/Dialog";
import { deckgroesse, mentorzugGesperrt } from "../regeln/karten";
import { schutzengelGesperrt } from "../regeln/schutzengel";
import { ambroseNichtDa } from "../regeln/abwesenheit";
import { kaufe } from "../regeln/muenzen";
import { variablenAusBesitz } from "../regeln/dialogvariablen";
import { spruecheErlaubt, ZEITKLASSEN } from "../regeln/zeitkarten";
import type { Kartensorte } from "../schnittstelle/karten";
import { tSpiel } from "../texte/texte";
import { Abspann } from "./Abspann";
import { Deckwahl } from "./Deckwahl";
import { Fensterbank } from "./Fensterbank";
import { Tagebuchseite } from "./Tagebuchseite";
import { Partieergebniskarte, Rundenergebniskarte } from "./Ergebniskarten";
import { Fortsetzungen } from "./Fortsetzungen";
import { Gedaechtnisstellung } from "./Gedaechtnisstellung";
import { szeneAus, useOberweltkern } from "./kern";
import { Kopfleiste } from "./Kopfleiste";
import { Laden } from "./Laden";
import { Reisen } from "./Reisen";
import { reiseziele } from "./reiseziele";
import { Sprechblase } from "./Sprechblase";
import { deckwahlsteckbrief } from "./steckbrieftext";
import { Steuerkreuz } from "./Steuerkreuz";
import type { Richtung } from "./szene";
import { Tagebuch } from "./Tagebuch";
import { useAufgabenrunde } from "./useAufgabenrunde";
import { useAusloeser } from "./useAusloeser";
import { useBuehne } from "./useBuehne";
import { useDialogende } from "./useDialogende";
import { begegnungVon, LUPE, usePartiestart } from "./usePartiestart";
import { nachErgebnis, useOffeneRueckmeldung } from "./nachergebnis";
import { useWeltladen } from "./useWeltladen";
import { Vorfuehrung } from "./Vorfuehrung";
import { Meldungsleiste } from "./Meldungsleiste";
import { Orientierung } from "./Orientierung";
import { eingangsdialog } from "./eingang";
import { schalteVerfolgung } from "../regeln/verfolgung";
import { Untertitelzeile } from "../ton/Untertitelzeile";
import { aktionFuer, type Weltdaten } from "./weltdaten";

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
  const { dienste, stand, standRef, welt, spiel, meldung, meldungsbild, setzeMeldung } = k;
  const { schreibe, wechsleKarte } = k;
  const partie = usePartiestart(k);
  const { deckwahl, ergebnis } = partie;
  const runden = useAufgabenrunde(k, partie);
  const { rundenergebnis, offeneRunde, gedaechtnis } = runden;
  const dialoge = useDialogende(k, partie, runden);
  const { dialog, oeffneDialog, vorfuehrung, offenerLaden, abspann } = dialoge;
  // Rückmeldung nach dem Ergebnis: der Dialog, der die Folge gestartet hat (nachergebnis.ts).
  const rueck = nachErgebnis(k, oeffneDialog);
  const toenung = k.toenung;
  const ortDesHelden = welt?.ort.kennung ?? null;
  const rahmen = useRef<HTMLDivElement>(null);
  const kachelanzeige = useRef<HTMLSpanElement>(null);
  const [tagebuch, setzeTagebuch] = useState(false);
  const [reisen, setzeReisen] = useState(false);
  // Auslöser, Aktionsknopf und Sprechblase der Statisten (useAusloeser.ts).
  const ausl = useAusloeser(k, dialoge);
  const { treffer, sprechblase } = ausl;

  const fehler = useWeltladen(k, {
    rahmen,
    kachelanzeige,
    beiTreffer: ausl.beiTreffer,
    beiWelt: (w) => {
      ausl.setzeTreffer(null);
      partie.meldeErgebnis(w);
      runden.meldeRunde(w);
      // Eingangsdialog der Karte (Einleitung, 19.11.2026): läuft von selbst, solange er gilt.
      const eingang = eingangsdialog(w.ort, w.kennung, standRef.current?.dialogvariablen ?? {});
      if (eingang) oeffneDialog(eingang);
    },
  });

  // Solange ein Fenster offen ist, steht der Held, und die Kopfleiste öffnet kein zweites
  // (Affentest 14.11.2026: Deckwahl neben der Fortsetzungskarte, Held lief bei offenen Reisen).
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
  useOffeneRueckmeldung(k, oeffneDialog, welt !== null && !fensterOffen);

  const beiRichtung = (richtung: Richtung, gedrueckt: boolean) => {
    szeneAus(spiel)?.setzeRichtung(richtung, gedrueckt);
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
          beiAktion={ausl.beiAktion}
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
          beiAbbruch={() => {
            partie.brichDeckwahlAb();
            rueck.vergiss();
          }}
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
          beiZielpfeil={(kennung) => schreibe(schalteVerfolgung(stand, kennung))}
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
          beiSchliessen={ausl.schliesseSprechblase}
          beiZeigen={(kennung) => {
            ausl.schliesseSprechblase();
            dialoge.zeigeVorfuehrung(kennung);
          }}
        />
      )}
      {gedaechtnis && (
        <Gedaechtnisstellung
          kennung={gedaechtnis}
          ort={ortDesHelden}
          beiEnde={(bestanden) => {
            runden.beendeGedaechtnis(gedaechtnis, bestanden);
            rueck.reagiere();
          }}
        />
      )}
      {vorfuehrung && (
        <Vorfuehrung
          kennung={vorfuehrung}
          ort={ortDesHelden}
          beiSchliessen={() => dialoge.zeigeVorfuehrung(null)}
        />
      )}
      {/* Erst nach der Ergebniskarte („Erledigt: …“ lag unter „Gewonnen!“, Spieltest einstieg) und
          nie über einem Dialog (meldungsstau.ts: Meldungen aus dem Dialog warten bis zum Ende) oder
          einem anderen Fenster („Neu im Tagebuch“ lag über der Kartenwahl vor Jos Partie, eiliger
          Spieler im Durchlauf, 20.11.2026): Sie wartet, bis die Welt wieder frei ist. */}
      {meldung && !fensterOffen && (
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
            const b = welt.daten.begegnungen.find((x) => x.kennung === begegnungVon(ergebnis));
            // Rückmeldung sofort, im Simultan erst nach dem letzten Brett (useAufgabenrunde.ts).
            runden.weiterImSimultan(ergebnis, () => rueck.reagiere(b?.danach));
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
            // Rückmeldung: runden.json `danach`, sonst der Dialog, der die Runde gestartet hat.
            const r = welt?.daten.runden.find((x) => x.kennung === rundenergebnis.auftrag.runde);
            rueck.reagiere(r?.danach);
          }}
        />
      )}
      <Fortsetzungen
        dienste={dienste}
        runden={runden}
        partie={partie}
        beiAufgeben={rueck.vergiss}
      />
    </div>
  );
}
