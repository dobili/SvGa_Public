/**
 * Eine Karte des Spiels als Karte (docs/spiel/29_Tischgespraech.md, Abschnitt Kartenfächer):
 * hochkant 3:4, Motiv oben, Name darunter, Rand in der Farbe der Stufe (leicht grün, mittel blau,
 * stark gold). Dieselbe Darstellung im Fächer der Partie, in der herausgehobenen Karte und in der
 * Deckwahl.
 *
 * Rolle im Gesamtbild: reine Anzeige. Wer sie zeigt (anbindung/Kartenfaecher.tsx,
 * anbindung/Kartenblick.tsx, oberwelt/Deckwahl.tsx), bestimmt Ansicht, Beschriftung und Rückruf.
 * Das Motiv kommt aus dem Paket (`bild` in karten.json, `karten/<kennung>.webp`); fehlt es, wird
 * die Karte gezeichnet: Stufenfarbe, ein Schachsymbol je Wirkung und ein Rautenmuster. So sieht es
 * schon vor den gemalten Motiven nach Karten aus. Gespielte Verbrauchskarten zeigen die Rückseite
 * (`karten/rueckseite.webp`, sonst ein gezeichnetes Muster).
 * Abhängigkeiten: paket/paketlader.ts, schnittstelle/karten.ts, texte/texte.ts, Stil in
 * spielkarte.css.
 */
import { useEffect, useId, useState, type ReactNode } from "react";
import { paketdateiAlsAdresseOderNull } from "../paket/paketlader";
import type { Kartensorte, Kartenstufe } from "../schnittstelle/karten";
import { tSpiel } from "../texte/texte";
import "../spielkarte.css";

/** Wie die Karte aussieht: hell, gedämpft, mit Glanz (dauerhafte wirkt) oder umgedreht. */
export type Kartenansicht = "hell" | "gedaempft" | "glanz" | "rueckseite";

/** Bild der Rückseite im Paket. */
const RUECKSEITE = "karten/rueckseite.webp";

/** Textdarstellung erzwingen: Schachsymbole sollen auf dem Handy nicht als Emoji erscheinen. */
const ALS_TEXT = "︎";

/** Das gezeichnete Symbol je Wirkung, solange es kein Motiv gibt. */
const SYMBOL: Readonly<Record<Kartensorte["wirkung"]["art"], string>> = {
  fingerzeig: "♞",
  gefahrenradar: "♜",
  zweiteChance: "♟",
  fluestern: "♝",
  mentorzug: "♛",
  schutzengel: "♚",
  vorgabe: "♟",
  zeit: "♞",
  zeitnot: "♞",
  werkzeug: "♝",
  drohung: "♜",
  waage: "♝",
  remis: "♚",
  schmeichelei: "♞",
  farbwahl: "♛",
  sanduhr: "♟",
};

/**
 * Zeichen der Stufe in der Ecke des Motivs: ein, zwei oder drei Rauten. Warum: Die Stufe stand
 * nur in der Randfarbe (grün, blau, gold); bei Rot-Grün-Schwäche sind Grün und Gold kaum zu
 * unterscheiden (Prüfung „zugang“, 15.11.2026). Die Zahl der Rauten trägt sie ohne Farbe.
 */
const STUFENZEICHEN: Readonly<Record<Kartenstufe, string>> = {
  leicht: "◆",
  mittel: "◆◆",
  stark: "◆◆◆",
};

/** Die Stufe als Wort („Stufe: leicht“), für Vorleser und die herausgehobene Karte. */
function stufentext(stufe: Kartenstufe): string {
  return tSpiel(`karte.stufe.${stufe}`);
}

/** Einmal geladene Bilder (Adresse oder null) für die ganze Sitzung, je Pfad im Paket. */
const bilder = new Map<string, Promise<string | null>>();

/**
 * Ein Bild des Pakets als Adresse; null, solange es lädt oder wenn es fehlt.
 * Ein Fehler beim Laden ist kein Spielfehler: Er wird gemeldet, die Karte bleibt gezeichnet.
 */
function usePaketbild(pfad: string | null): string | null {
  const [adresse, setzeAdresse] = useState<string | null>(null);
  useEffect(() => {
    if (!pfad) return undefined;
    let aktiv = true;
    let laden = bilder.get(pfad);
    if (!laden) {
      laden = paketdateiAlsAdresseOderNull(pfad).catch((fehler: unknown) => {
        console.warn("Kartenbild nicht geladen:", pfad, fehler);
        return null;
      });
      bilder.set(pfad, laden);
    }
    void laden.then((a) => {
      if (aktiv) setzeAdresse(a);
    });
    return () => {
      aktiv = false;
    };
  }, [pfad]);
  return adresse;
}

/** Das Motiv: gemaltes Bild, sonst das gezeichnete Symbol; umgedreht die Rückseite. */
export function Kartenmotiv({
  sorte,
  rueckseite = false,
}: {
  readonly sorte: Kartensorte;
  readonly rueckseite?: boolean;
}) {
  const bild = usePaketbild(rueckseite ? RUECKSEITE : sorte.bild);
  return (
    <span className="abenteuer-spielkarte-motiv" data-rueckseite={rueckseite || undefined}>
      {bild ? (
        <img src={bild} alt="" draggable={false} />
      ) : rueckseite ? null : (
        <span className="abenteuer-spielkarte-symbol">{SYMBOL[sorte.wirkung.art] + ALS_TEXT}</span>
      )}
      {!rueckseite && (
        <span className="abenteuer-spielkarte-stufe" aria-hidden="true">
          {STUFENZEICHEN[sorte.stufe] + ALS_TEXT}
        </span>
      )}
    </span>
  );
}

/**
 * Eine Karte als Knopf. Der Vorleser hört den Namen und den Zustand (`beschriftung`, etwa
 * „Fingerzeig, spielbar“); `zusatz` steht unter dem Namen (etwa „× 2“ oder ein Grund).
 * Beispiel: <Spielkarte sorte={fingerzeig} ansicht="hell" beschriftung="Fingerzeig, spielbar" …/>.
 */
export function Spielkarte({
  sorte,
  ansicht,
  beschriftung,
  testid,
  beiTipp,
  gewaehlt,
  gesperrt = false,
  deaktiviert = gesperrt,
  frei = false,
  zusatz,
}: {
  readonly sorte: Kartensorte;
  readonly ansicht: Kartenansicht;
  readonly beschriftung: string;
  readonly testid: string;
  readonly beiTipp: () => void;
  /** Für die Deckwahl: im Deck (aria-pressed); in der Partie nicht gesetzt. */
  readonly gewaehlt?: boolean;
  /** Gesperrt (Deckwahl, Ambrose fehlt): grau, mit Grund im Zusatz. */
  readonly gesperrt?: boolean;
  /** Nicht antippbar (Deckwahl: gesperrt oder das Deck ist voll); Vorgabe: wie `gesperrt`. */
  readonly deaktiviert?: boolean;
  /** Freie Karte der Begegnung (R29): goldener Schein. */
  readonly frei?: boolean;
  readonly zusatz?: ReactNode;
}) {
  const stufeId = useId();
  return (
    <button
      type="button"
      className="abenteuer-spielkarte"
      data-stufe={sorte.stufe}
      data-ansicht={ansicht}
      data-frei={frei || undefined}
      data-gesperrt={gesperrt ? "ja" : undefined}
      aria-label={beschriftung}
      aria-describedby={stufeId}
      aria-pressed={gewaehlt}
      disabled={deaktiviert}
      data-testid={testid}
      onClick={beiTipp}
    >
      <Kartenmotiv sorte={sorte} rueckseite={ansicht === "rueckseite"} />
      <span className="abenteuer-spielkarte-name">{tSpiel(sorte.name)}</span>
      <span id={stufeId} hidden>
        {stufentext(sorte.stufe)}
      </span>
      {zusatz}
    </button>
  );
}
