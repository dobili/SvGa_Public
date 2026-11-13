/**
 * Das Dialogfenster: eine Ink-Geschichte Zeile für Zeile, mit Sprecher und Auswahl.
 *
 * Rolle im Gesamtbild: React statt Phaser (Entscheidung C4). Bekommt die übersetzte Geschichte
 * und den Startknoten, zeigt je Tipp eine Zeile, am Ende die Wahlen; beim Ende der Geschichte
 * gibt es die Variablen zurück (Spielstand). Die Zurück-Taste schließt den Dialog
 * (app/blattstapel.ts). Sprecher „erzaehler“ hat keinen Namen. Eine Zeile mit `#pause` sperrt
 * „Weiter“ für ihre Dauer (dialog/dialogtakt.ts, T3).
 * Abhängigkeiten: dialog/geschichte.ts, dialog/dialogtakt.ts, texte/texte.ts, app/blattstapel.ts.
 */
import { useEffect, useState } from "react";
import { useZurueckSchliesst } from "../../app/blattstapel";
import { tSpiel } from "../texte/texte";
import { tonregie } from "../ton/tonregie";
import { pausendauer } from "./dialogtakt";
import { Portraet } from "./Portraet";
import { Geschichte, type Dialogschritt, type Dialogvariablen, type Wirkungen } from "./geschichte";

const ERZAEHLER = "erzaehler";

export function Dialog({
  json,
  knoten,
  wirkungen,
  variablen,
  heldname,
  beiKnoten,
  beiEnde,
}: {
  readonly json: string;
  readonly knoten: string;
  readonly wirkungen: Wirkungen;
  readonly variablen: Dialogvariablen;
  readonly heldname: string;
  /** Ein Knoten der Geschichte wurde erreicht (für Quests), auch der Startknoten. */
  readonly beiKnoten: (knoten: string) => void;
  readonly beiEnde: (variablen: Dialogvariablen) => void;
}) {
  // Die Geschichte lebt, solange der Dialog offen ist; die Oberwelt baut den Dialog je Knoten neu
  // auf (key), deshalb genügt das einmalige Anlegen hier.
  const [geschichte] = useState(() => new Geschichte(json, wirkungen, variablen, heldname));
  const [schritt, setzeSchritt] = useState<Dialogschritt>(() => {
    geschichte.starte(knoten);
    return geschichte.weiter();
  });
  const [letzteZeile, setzeLetzteZeile] = useState<Dialogschritt | null>(() =>
    schritt.art === "zeile" ? schritt : null,
  );
  // Pause (#pause, #pause:3): „Weiter“ ist so lange gesperrt. Gesetzt wird sie mit der Zeile (in
  // weiter), aufgehoben von der Uhr; jede neue Zeile startet sie neu.
  const dauerVon = (s: Dialogschritt) => (s.art === "zeile" ? pausendauer(s.zeile.tags) : 0);
  const [wartet, setzeWartet] = useState(() => dauerVon(schritt) > 0);
  useEffect(() => {
    // Musik, Geräusche und Klänge der Zeile (#musik, #geraeusch, #klang; ton/tonregie.ts).
    if (letzteZeile?.art === "zeile") tonregie.dialogzeile(letzteZeile.zeile.tags);
    const dauer = letzteZeile ? dauerVon(letzteZeile) : 0;
    if (dauer === 0) return;
    const uhr = window.setTimeout(() => setzeWartet(false), dauer);
    return () => window.clearTimeout(uhr);
  }, [letzteZeile]);
  /** Meldet jeden Knoten, der neu besucht wurde (Besuchszahl, dialog/geschichte.ts). */
  const meldeKnoten = () => {
    for (const knoten of geschichte.neueKnoten()) beiKnoten(knoten);
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
    setzeSchritt(naechster);
    if (naechster.art === "zeile") {
      setzeWartet(dauerVon(naechster) > 0);
      setzeLetzteZeile(naechster);
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

  if (schritt.art === "ende") return null;
  const zeile = letzteZeile?.art === "zeile" ? letzteZeile.zeile : null;
  const sprecher = zeile?.tags.sprecher ?? ERZAEHLER;
  return (
    <section
      className="abenteuer-dialog"
      role="dialog"
      aria-live="polite"
      data-testid="abenteuer-dialog"
    >
      {sprecher !== ERZAEHLER && (
        <div className="abenteuer-dialog-kopf">
          <Portraet
            sprecher={sprecher}
            stimmung={zeile?.tags.stimmung ?? null}
            zeile={zeile?.text}
          />
          <p className="abenteuer-dialog-sprecher">{tSpiel(`figur.${sprecher}.name`)}</p>
        </div>
      )}
      <p className="abenteuer-dialog-text">{zeile?.text ?? ""}</p>
      {schritt.art === "wahl" ? (
        <div className="abenteuer-dialog-wahlen">
          {schritt.wahlen.map((wahl, i) => (
            <button key={wahl} type="button" disabled={wartet} onClick={() => waehle(i)}>
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
