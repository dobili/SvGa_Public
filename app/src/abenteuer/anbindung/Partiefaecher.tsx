/**
 * Der Kartenfächer der Partie (docs/spiel/29_Tischgespraech.md, Abschnitt Kartenfächer): die
 * Karten des Decks unter dem Brett; Antippen hebt eine Karte groß heraus, „Ausspielen“ spielt sie.
 *
 * Rolle im Gesamtbild: Teil der Kartenleiste (anbindung/KartenleisteAnzeige.tsx). Sie gibt Deck,
 * Lage und den Ablauf des Spielens herein; hier wird nur gezeigt und gewählt. Zustand und Grund je
 * Karte kommen aus regeln/kartenzustand.ts: Spielbare Karten sind hell, nicht spielbare gedämpft,
 * aber antippbar (damit man den Grund liest), gespielte Verbrauchskarten liegen umgedreht,
 * dauerhafte Karten glänzen, solange ihre Anzeige gilt.
 * Abhängigkeiten: anbindung/Kartenfaecher.tsx, anbindung/Kartenblick.tsx, anbindung/Spielkarte.tsx,
 * regeln/kartenzustand.ts, regeln/karten.ts, texte/texte.ts.
 */
import { useState } from "react";
import { nurAnwesenheit } from "../regeln/karten";
import {
  kartenzustand,
  zustandsschluessel,
  type Kartenbefund,
  type Kartenzustand,
  type Partielage,
  type Spiellage,
} from "../regeln/kartenzustand";
import type { Kartensorte } from "../schnittstelle/karten";
import type { Partiekarten } from "../schnittstelle/spielstand";
import { tSpiel } from "../texte/texte";
import { Kartenblick } from "./Kartenblick";
import { Kartenfaecher } from "./Kartenfaecher";
import { Spielkarte, type Kartenansicht } from "./Spielkarte";

/** So liegt eine Karte je Zustand im Fächer. */
const ANSICHT: Readonly<Record<Kartenzustand, Kartenansicht>> = {
  spielbar: "hell",
  gesperrt: "gedaempft",
  wirkt: "glanz",
  gespielt: "gedaempft",
  verbraucht: "rueckseite",
};

/** Die Ansicht einer Karte zu ihrem Zustand (für Fächer und Kartenblick). */
function ansichtVon(zustand: Kartenzustand): Kartenansicht {
  return ANSICHT[zustand];
}

/** Name und Zustand für den Vorleser, etwa „Fingerzeig, spielbar“. */
function kartenbeschriftung(sorte: Kartensorte, zustand: Kartenzustand): string {
  return `${tSpiel(sorte.name)}, ${tSpiel(zustandsschluessel(zustand))}`;
}

/**
 * Fächer und herausgehobene Karte.
 * Eingaben: Partiekarten, die Sorten des Decks (in Deckreihenfolge), Spiel- und Partielage, die
 * gerade wirkende Karte und `beiSpielen` (der Ablauf der Kartenleiste).
 */
export function Partiefaecher({
  karten,
  sorten,
  lage,
  partielage,
  laeuft,
  beiSpielen,
}: {
  readonly karten: Partiekarten;
  readonly sorten: readonly Kartensorte[];
  readonly lage: Spiellage;
  readonly partielage: Partielage;
  readonly laeuft: string | null;
  readonly beiSpielen: (sorte: Kartensorte) => void;
}) {
  const [offen, setzeOffen] = useState<string | null>(null);
  const befunde = new Map<string, Kartenbefund>(
    sorten.map((s) => [s.kennung, kartenzustand(karten, s, lage, partielage, laeuft)]),
  );
  const gewaehlt = sorten.find((s) => s.kennung === offen);
  const befund = gewaehlt ? befunde.get(gewaehlt.kennung) : undefined;
  const schliesse = () => setzeOffen(null);
  return (
    <>
      <Kartenfaecher
        beschriftung={tSpiel("faecher.titel")}
        testid="abenteuer-faecher"
        karten={sorten.map((sorte) => {
          const zustand = befunde.get(sorte.kennung)?.zustand ?? "gesperrt";
          return {
            kennung: sorte.kennung,
            karte: (
              <Spielkarte
                sorte={sorte}
                ansicht={ansichtVon(zustand)}
                beschriftung={kartenbeschriftung(sorte, zustand)}
                testid={`abenteuer-karte-${sorte.kennung}`}
                frei={nurAnwesenheit(karten, sorte.kennung)}
                beiTipp={() => setzeOffen(sorte.kennung)}
              />
            ),
          };
        })}
      />
      {gewaehlt && befund && (
        <Kartenblick
          sorte={gewaehlt}
          ansicht={ansichtVon(befund.zustand)}
          grund={befund.grund}
          spielbar={befund.zustand === "spielbar"}
          beiZurueck={schliesse}
          beiAusspielen={() => {
            schliesse();
            beiSpielen(gewaehlt);
          }}
        />
      )}
    </>
  );
}
