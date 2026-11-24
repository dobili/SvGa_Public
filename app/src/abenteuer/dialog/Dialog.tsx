/**
 * Das Dialogfenster: eine Ink-Geschichte Zeile für Zeile, mit Sprecher und Auswahl.
 *
 * Rolle im Gesamtbild: React statt Phaser (Entscheidung C4). Bekommt die übersetzte Geschichte
 * und den Startknoten, zeigt je Tipp eine Zeile, die Wahlen gleich unter der Zeile davor (R3); beim Ende der Geschichte
 * gibt es die Variablen zurück (Spielstand). Die Zurück-Taste schließt den Dialog
 * (app/blattstapel.ts). Sprecher „erzaehler“ hat keinen Namen. Eine Zeile mit `#pause` sperrt
 * „Weiter“ für ihre Dauer (dialog/dialogtakt.ts, T3); `#bild:kennung` zeigt ein Bild groß über der
 * Zeile (dialog/Grossansicht.tsx, T7). `#erscheint` blendet das Porträt ein, `#geist` zeigt es halb
 * durchsichtig (T9); Figuren mit geist: true (Ambrose) sind sonst leicht durchsichtig, außer in
 * Erinnerungen (regeln/geist.ts). Nur der Held hört den Geist (regeln/begleiter.ts): Seine Zeilen
 * in Gesprächen mit anderen sind geflüstert (kursiv, „nur du hörst ihn“), `#gedanke` an Zeile oder
 * Wahl zeigt einen Gedanken des Helden (kursiv mit Gedankenzeichen); `#erinnerung` bis `#erinnerung:aus` zeigt den Dialog und die Karte in Sepia (T10); Bühnenanweisungen für die Karte (`#licht`, `#figur`) gehen an `beiZeile`.
 * Bedienung mit dem Daumen (docs/spiel/30): Antippen des Textes geht weiter wie „Weiter“; die
 * Lage von Wahlen und „Weiter“ (hoch und quer) regelt bedienung.css.
 * Abhängigkeiten: dialog/geschichte.ts, dialog/dialogtakt.ts, texte/texte.ts, app/blattstapel.ts.
 */
import { useEffect, useRef, useState } from "react";
import { useZurueckSchliesst } from "../../app/blattstapel";
import { tSpiel } from "../texte/texte";
import { tonregie } from "../ton/tonregie";
import { pausendauer } from "./dialogtakt";
import { Grossansicht } from "./Grossansicht";
import { bildpfad } from "./grossbild";
import { Brettbeispiel } from "./Brettbeispiel";
import { brettmarke } from "./brettmarke";
import { Portraet } from "./Portraet";
import { erscheinungDesPortraets } from "../regeln/geist";
import { gefluestert, istGedanke, istGegenueber } from "../regeln/begleiter";
import { useDialogfokus } from "./useDialogfokus";
import { useGeistsprecher } from "./useGeistsprecher";
import { useWahlschutz } from "./wahlschutz";
import { Geschichte, type Dialogschritt, type Dialogvariablen, type Wirkungen } from "./geschichte";

const ERZAEHLER = "erzaehler";

/**
 * Erinnerung (T10): `#erinnerung` schaltet den Sepia-Rahmen ein, `#erinnerung:aus` aus; eine Zeile
 * ohne die Marke ändert nichts. Beispiel: Ambrose erzählt von 1858.
 */
function erinnerungNach(vorher: boolean, s: Dialogschritt): boolean {
  if (s.art !== "zeile" || s.zeile.tags.erinnerung === undefined) return vorher;
  return s.zeile.tags.erinnerung !== "aus";
}

/** Der Sprecher einer Zeile als Liste (leer ohne `#sprecher`), für die Merkliste des Dialogs. */
function sprecherVon(s: Dialogschritt): readonly string[] {
  return s.art === "zeile" && s.zeile.tags.sprecher ? [s.zeile.tags.sprecher] : [];
}

/**
 * Folgen auf eine Zeile gleich die Wahlen, zeigt der Dialog sie unter dieser Zeile (R3 aus dem
 * Spieltest „einstieg“): Der Schritt wird zur Wahl, die Zeile bleibt als Text darüber stehen.
 * Sonst bleibt der Schritt, wie er ist. Eine Pause der Zeile sperrt die Wahlen wie sonst „Weiter“.
 */
function mitWahlen(geschichte: Geschichte, s: Dialogschritt): Dialogschritt {
  if (s.art !== "zeile") return s;
  const wahlen = geschichte.wahlenNachZeile();
  return wahlen.length > 0 ? { art: "wahl", wahlen } : s;
}

/** Das Dialogfenster einer Ink-Geschichte; gibt am Ende die Variablen für den Spielstand zurück (Ablauf im Dateikopf). */
export function Dialog({
  json,
  knoten,
  wirkungen,
  variablen,
  heldname,
  beiKnoten,
  beiEnde,
  beiZeile,
  buehneWartet = false,
}: {
  readonly json: string;
  readonly knoten: string;
  readonly wirkungen: Wirkungen;
  readonly variablen: Dialogvariablen;
  readonly heldname: string;
  /**
   * Ein Knoten der Geschichte wurde erreicht (für Quests), auch der Startknoten; dazu die Variablen
   * aus Ink in diesem Augenblick, damit die Oberwelt sie mit dem Quest-Schritt sichert.
   */
  readonly beiKnoten: (knoten: string, variablen: Dialogvariablen) => void;
  readonly beiEnde: (variablen: Dialogvariablen) => void;
  /** Jede neue Zeile mit ihren Tags (Bühnenanweisungen der Oberwelt, T6 und T9). */
  readonly beiZeile?: (tags: Readonly<Record<string, string>>) => void;
  /** Ein geführter Weg läuft (`#gehe`, oberwelt/useBuehne.ts): „Weiter“ und Wahlen warten. */
  readonly buehneWartet?: boolean;
}) {
  // Die Geschichte lebt, solange der Dialog offen ist; die Oberwelt baut den Dialog je Knoten neu
  // auf (key), deshalb genügt das einmalige Anlegen hier.
  const [geschichte] = useState(() => new Geschichte(json, wirkungen, variablen, heldname));
  const [letzteZeile, setzeLetzteZeile] = useState<Dialogschritt | null>(() => {
    geschichte.starte(knoten);
    const erster = geschichte.weiter();
    return erster.art === "zeile" ? erster : null;
  });
  const [schritt, setzeSchritt] = useState<Dialogschritt>(() =>
    letzteZeile ? mitWahlen(geschichte, letzteZeile) : geschichte.weiter(),
  );
  // Pause (#pause, #pause:3): „Weiter“ ist so lange gesperrt. Gesetzt wird sie mit der Zeile (in
  // weiter), aufgehoben von der Uhr; jede neue Zeile startet sie neu.
  const dauerVon = (s: Dialogschritt) => (s.art === "zeile" ? pausendauer(s.zeile.tags) : 0);
  const [pausiert, setzeWartet] = useState(() => (letzteZeile ? dauerVon(letzteZeile) > 0 : false));
  const wartet = pausiert || buehneWartet;
  const [erinnerung, setzeErinnerung] = useState(() =>
    letzteZeile ? erinnerungNach(false, letzteZeile) : false,
  );
  const fenster = useRef<HTMLElement>(null);
  const geister = useGeistsprecher();
  // Wer in diesem Gespräch schon gesprochen hat: Nach einer anderen Figur flüstert der Geist.
  const [gesprochen, setzeGesprochen] = useState<readonly string[]>(() =>
    letzteZeile?.art === "zeile" ? sprecherVon(letzteZeile) : [],
  );
  useEffect(() => {
    // Musik, Geräusche und Klänge der Zeile (#musik, #geraeusch, #klang; ton/tonregie.ts).
    if (letzteZeile?.art === "zeile") {
      tonregie.dialogzeile(letzteZeile.zeile.tags);
      beiZeile?.(letzteZeile.zeile.tags);
    }
    const dauer = letzteZeile ? dauerVon(letzteZeile) : 0;
    if (dauer === 0) return;
    const uhr = window.setTimeout(() => setzeWartet(false), dauer);
    return () => window.clearTimeout(uhr);
    // Nur bei einer neuen Zeile, nicht wenn die Oberwelt neue Rückrufe reicht.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [letzteZeile]);
  // Ein Knoten ohne Zeile (nur Wirkungen, dann END) endet sofort; ohne diese Meldung bliebe der
  // Aufrufer offen (Befund beim Partiemoment, T11).
  useEffect(() => {
    if (schritt.art === "ende") beiEnde(geschichte.variablen());
    // Nur beim Öffnen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /** Meldet jeden Knoten, der neu besucht wurde (Besuchszahl, dialog/geschichte.ts). */
  const meldeKnoten = () => {
    const neu = geschichte.neueKnoten();
    if (neu.length === 0) return;
    const variablen = geschichte.variablen();
    for (const knoten of neu) beiKnoten(knoten, variablen);
  };

  const weiter = () => {
    meldeKnoten();
    const naechster = geschichte.weiter();
    meldeKnoten();
    if (naechster.art === "ende") {
      tonregie.dialogBeendet();
      beiEnde(geschichte.variablen());
      return;
    }
    setzeSchritt(mitWahlen(geschichte, naechster));
    if (naechster.art === "zeile") {
      setzeWartet(dauerVon(naechster) > 0);
      setzeErinnerung((vorher) => erinnerungNach(vorher, naechster));
      setzeLetzteZeile(naechster);
      setzeGesprochen((bisher) => [...new Set([...bisher, ...sprecherVon(naechster)])]);
    }
  };

  const waehle = (index: number) => {
    geschichte.waehle(index);
    weiter();
  };

  useZurueckSchliesst(true, () => {
    tonregie.dialogBeendet();
    beiEnde(geschichte.variablen());
  });

  // Jede neue Zeile beginnt oben: Quer rollt die Seitenspalte (querformat.css), und nach dem
  // Rollen zu den Antworten stand die nächste Zeile sonst halb außerhalb.
  useEffect(() => {
    fenster.current?.scrollTo?.({ top: 0 });
  }, [schritt]);
  // Neue Wahlen kurz gesperrt: Ein Doppeltipp auf „Weiter“ wählt sonst ungelesen (wahlschutz.ts).
  const geschuetzt = useWahlschutz(schritt, schritt.art === "wahl", wartet);
  // Fokus auf „Weiter“ oder die erste Wahl, je Schritt und nach einer Pause (Tastatur, Vorleser).
  useDialogfokus(fenster, schritt, letzteZeile, wartet || geschuetzt);

  if (schritt.art === "ende") return null;
  const zeile = letzteZeile?.art === "zeile" ? letzteZeile.zeile : null;
  const sprecher = zeile?.tags.sprecher ?? ERZAEHLER;
  const andereSprachen = gesprochen.some((name) => istGegenueber(name, geister));
  const fluestert = gefluestert(zeile?.tags, geister, andereSprachen, erinnerung);
  const gedanke = istGedanke(zeile?.tags);
  const gedanken = schritt.art === "wahl" ? geschichte.gedankenwahlen() : null;
  const bild = zeile ? bildpfad(zeile.tags) : null;
  // Ein Brettbeispiel zur Zeile (#brett:kennung), wenn die Figur ein Konzept zeigt.
  const brett = zeile ? brettmarke(zeile.tags) : null;
  const textWeiter = schritt.art !== "wahl" && !wartet;
  return (
    <section
      className={erinnerung ? "abenteuer-dialog abenteuer-dialog-erinnerung" : "abenteuer-dialog"}
      ref={fenster}
      role="dialog"
      aria-label={
        sprecher !== ERZAEHLER ? tSpiel(`figur.${sprecher}.name`) : tSpiel("dialog.titel")
      }
      aria-live="polite"
      data-testid="abenteuer-dialog"
    >
      {bild && <Grossansicht pfad={bild} />}
      {brett && !bild && <Brettbeispiel marke={brett} />}
      {sprecher !== ERZAEHLER && (
        <div
          className="abenteuer-dialog-kopf"
          data-erscheinung={erscheinungDesPortraets(zeile?.tags, sprecher, geister, erinnerung)}
        >
          <Portraet
            sprecher={sprecher}
            stimmung={zeile?.tags.stimmung ?? null}
            zeile={zeile?.text}
          />
          <p className="abenteuer-dialog-sprecher">
            {tSpiel(`figur.${sprecher}.name`)}
            {fluestert && (
              <span className="abenteuer-dialog-fluestern" data-testid="abenteuer-fluestern">
                {tSpiel("dialog.nurDu")}
              </span>
            )}
          </p>
        </div>
      )}
      {gedanke && sprecher === ERZAEHLER && (
        <p className="abenteuer-dialog-sprecher abenteuer-dialog-denkt">
          {tSpiel("dialog.gedanke", { held: heldname })}
        </p>
      )}
      {/* Antippen des Textes geht auch weiter (docs/spiel/30, Abschnitt 2); der Knopf bleibt für
          Tastatur und Vorleser, deshalb hier nur die Maus- und Fingergeste. */}
      <p
        className="abenteuer-dialog-text"
        data-weiter={textWeiter ? "ja" : undefined}
        data-ton={fluestert ? "fluestern" : gedanke ? "gedanke" : undefined}
        onClick={textWeiter ? weiter : undefined}
      >
        {zeile?.text ?? ""}
      </p>
      {schritt.art === "wahl" ? (
        <div className="abenteuer-dialog-wahlen">
          {schritt.wahlen.map((wahl, i) => (
            <button
              key={wahl}
              type="button"
              disabled={wartet || geschuetzt}
              data-gedanke={gedanken?.has(i) ? "ja" : undefined}
              aria-label={
                gedanken?.has(i) ? tSpiel("dialog.gedankenwahl", { text: wahl }) : undefined
              }
              onClick={() => waehle(i)}
            >
              {wahl}
            </button>
          ))}
        </div>
      ) : (
        <button
          type="button"
          className="abenteuer-dialog-weiter"
          disabled={wartet}
          data-pause={wartet ? "ja" : undefined}
          onClick={weiter}
        >
          {tSpiel("dialog.weiter")}
        </button>
      )}
    </section>
  );
}
