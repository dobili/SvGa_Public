/**
 * Das Dialogfenster: eine Ink-Geschichte Zeile für Zeile, mit Sprecher und Auswahl.
 *
 * Rolle im Gesamtbild: React statt Phaser (Entscheidung C4). Bekommt die übersetzte Geschichte
 * und den Startknoten, zeigt je Tipp eine Zeile, am Ende die Wahlen; beim Ende der Geschichte
 * gibt es die Variablen zurück (Spielstand). Die Zurück-Taste schließt den Dialog
 * (app/blattstapel.ts). Sprecher „erzaehler“ hat keinen Namen.
 * Abhängigkeiten: dialog/geschichte.ts, texte/texte.ts, app/blattstapel.ts.
 */
import { useState } from "react";
import { useZurueckSchliesst } from "../../app/blattstapel";
import { tSpiel } from "../texte/texte";
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
  const [gemeldeterKnoten, setzeGemeldetenKnoten] = useState<string | null>(null);

  /** Meldet den aktuellen Knoten einmal, sobald er sich ändert. */
  const meldeKnoten = () => {
    const knoten = geschichte.knoten();
    if (knoten && knoten !== gemeldeterKnoten) {
      setzeGemeldetenKnoten(knoten);
      beiKnoten(knoten);
    }
  };

  const weiter = () => {
    meldeKnoten();
    const naechster = geschichte.weiter();
    meldeKnoten();
    if (naechster.art === "ende") {
      beiEnde(geschichte.variablen());
      return;
    }
    setzeSchritt(naechster);
    if (naechster.art === "zeile") setzeLetzteZeile(naechster);
  };

  const waehle = (index: number) => {
    geschichte.waehle(index);
    weiter();
  };

  useZurueckSchliesst(true, () => beiEnde(geschichte.variablen()));

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
        <p className="abenteuer-dialog-sprecher">{tSpiel(`figur.${sprecher}.name`)}</p>
      )}
      <p className="abenteuer-dialog-text">{zeile?.text ?? ""}</p>
      {schritt.art === "wahl" ? (
        <div className="abenteuer-dialog-wahlen">
          {schritt.wahlen.map((wahl, i) => (
            <button key={wahl} type="button" onClick={() => waehle(i)}>
              {wahl}
            </button>
          ))}
        </div>
      ) : (
        <button type="button" className="abenteuer-dialog-weiter" onClick={weiter}>
          {tSpiel("dialog.weiter")}
        </button>
      )}
    </section>
  );
}
