/**
 * Karten über der Welt nach einer Partie oder Aufgabenrunde: Ergebnis der Partie (mit Nadel und
 * Wiedereinstieg am Kipppunkt, R14), Ergebnis der Runde, und die Nachfrage, wenn eine Partie oder
 * Runde noch offen ist.
 *
 * Rolle im Gesamtbild: Teil von oberwelt/Oberwelt.tsx, ausgelagert, damit der Bildschirm lesbar
 * bleibt (Wunsch des Haupt-Chats, 10.11.2026). Nur Anzeige; was die Knöpfe tun, entscheidet die
 * Oberwelt über die Rückrufe.
 * Abhängigkeiten: texte/texte.ts, schnittstelle/partie.ts, regeln/rueckweg.ts.
 */
import { noetigePunkte, punktetext } from "../regeln/aufgaben";
import type { Rundenrueckweg } from "../regeln/rueckweg";
import type { Aufgabenauftrag } from "../schnittstelle/aufgaben";
import type { Kipppunkt, Nadelstufe, Partieergebnis } from "../schnittstelle/partie";
import { tSpiel } from "../texte/texte";

/** Zug zum Kipppunkt (Halbzug ab 0) in der Zählweise des Lesers. */
function zugNummer(k: Kipppunkt): number {
  return Math.floor(k.halbzug / 2) + 1;
}

/**
 * Ergebnis der Partie, knapp (Spielhülle, docs/spiel/18, Abschnitt 4): Ausgang, die neue Nadel und
 * nach einer Niederlage Ambroses Satz zum Kipppunkt mit dem Wiedereinstieg, wo das Regelwerk ihn
 * erlaubt (R14, R15). Zahl der Züge, Karten und Momente stehen nicht mehr hier; sie lenken ab.
 * Ist Ambrose nicht da (`ohneAmbrose`, regeln/abwesenheit.ts: Tiefpunkt, nach dem Abschied),
 * bleibt der Wiedereinstieg, aber der Satz ist der des Helden, ohne Ambroses Namen.
 */
export function Partieergebniskarte(props: {
  readonly ergebnis: Partieergebnis;
  readonly gegner: string;
  /** Club des Ortes; null, wo der Ort keinen hat (Weg, Seeufer): dann ohne Clubnamen. */
  readonly club: string | null;
  readonly neueNadel: Nadelstufe | null;
  readonly kipppunkt: Kipppunkt | "suche" | null;
  /** Ambrose ist nicht da: Kipppunkt ohne seinen Namen (Vorgabe: er ist da). */
  readonly ohneAmbrose?: boolean;
  readonly beiWiedereinstieg: (k: Kipppunkt) => void;
  readonly beiWeiter: () => void;
}) {
  const { ergebnis, kipppunkt } = props;
  const mitKipppunkt = kipppunkt !== null && kipppunkt !== "suche";
  const allein = props.ohneAmbrose === true;
  const suche = allein ? "ergebnis.kipppunktSucheAllein" : "ergebnis.kipppunktSuche";
  const satz = allein ? "ergebnis.kipppunktAllein" : "ergebnis.kipppunkt";
  return (
    <section className="abenteuer-ergebnis" role="status" data-testid="abenteuer-ergebnis">
      <p>
        <strong>{tSpiel(`ergebnis.${ergebnis.ausgang}`, { gegner: props.gegner })}</strong>
      </p>
      {props.neueNadel && (
        <p>
          <strong>
            {props.club
              ? tSpiel(`ergebnis.nadel.${props.neueNadel}`, { club: props.club })
              : tSpiel(`ergebnis.nadelOhneClub.${props.neueNadel}`)}
          </strong>
        </p>
      )}
      {kipppunkt === "suche" && <p className="lade">{tSpiel(suche)}</p>}
      {mitKipppunkt && (
        <>
          <p>{tSpiel(satz, { zug: zugNummer(kipppunkt) })}</p>
          <button
            type="button"
            className="knopf-haupt"
            onClick={() => props.beiWiedereinstieg(kipppunkt)}
            data-testid="abenteuer-wiedereinstieg"
          >
            {tSpiel("ergebnis.nochEinmal", { zug: zugNummer(kipppunkt) })}
          </button>
        </>
      )}
      <button
        type="button"
        className={mitKipppunkt ? "knopf-zweit" : "knopf-haupt"}
        onClick={props.beiWeiter}
      >
        {tSpiel("ergebnis.weiter")}
      </button>
    </section>
  );
}

/** Ergebnis einer Aufgabenrunde, mit „Noch einmal“, wenn sie nicht bestanden ist. */
export function Rundenergebniskarte(props: {
  readonly ergebnis: Omit<Rundenrueckweg, "stand"> & { auftrag: Aufgabenauftrag };
  readonly club: string;
  readonly beiNochmal: (runde: string) => void;
  readonly beiWeiter: () => void;
}) {
  const e = props.ergebnis;
  return (
    <section className="abenteuer-ergebnis" role="status" data-testid="abenteuer-rundenergebnis">
      <p>
        <strong>
          {tSpiel(e.bestanden ? "aufgaben.bestanden" : "aufgaben.nichtBestanden", {
            punkte: punktetext(e.punkte),
            moeglich: e.moeglich,
            noetig: punktetext(noetigePunkte(e.moeglich)),
          })}
        </strong>
      </p>
      {e.reiheGeschafft && <p>{tSpiel("aufgaben.reiheBestanden", { club: props.club })}</p>}
      {!e.bestanden && (
        <button
          type="button"
          className="knopf-haupt"
          onClick={() => props.beiNochmal(e.auftrag.runde)}
          data-testid="abenteuer-runde-nochmal"
        >
          {tSpiel("aufgaben.nochEinmal")}
        </button>
      )}
      <button
        type="button"
        className={e.bestanden ? "knopf-haupt" : "knopf-zweit"}
        onClick={props.beiWeiter}
      >
        {tSpiel("ergebnis.weiter")}
      </button>
    </section>
  );
}

/** Nachfrage zu einer offenen Partie oder Runde: weitermachen oder abbrechen (Textschlüssel). */
export function Fortsetzungskarte(props: {
  readonly text: string;
  readonly weiter: string;
  readonly abbrechen: string;
  readonly beiWeiter: () => void;
  readonly beiAbbrechen: () => void;
}) {
  return (
    <section className="abenteuer-ergebnis" role="status">
      <p>{tSpiel(props.text)}</p>
      <button type="button" className="knopf-haupt" onClick={props.beiWeiter}>
        {tSpiel(props.weiter)}
      </button>
      <button type="button" className="knopf-zweit" onClick={props.beiAbbrechen}>
        {tSpiel(props.abbrechen)}
      </button>
    </section>
  );
}
