/**
 * Eingabe des Denkroutine-Trainers am Brett: zwei Kandidaten und je die stärkste Antwort ziehen.
 *
 * Rolle im Gesamtbild: Teil von Denkroutineaufgabe.tsx. Wunsch des Autors (F2, 19.10.2026): Die
 * Züge werden mit den Figuren eingegeben statt als Text, wie überall sonst in der App. Ablauf:
 * Kandidat 1 ziehen, dann die Antwort des Gegners in der Stellung danach; das Brett springt
 * zurück, Kandidat 2 und seine Antwort folgen. Danach prüft die Aufgabe wie bisher.
 * Abhängigkeiten: schach/weiterspielen.ts, schach/stellung.ts, Brettbereich, useBrettbedienung,
 * training/denkroutinetrainer.ts (KANDIDATEN), i18n.
 * Buchbezug: Kapitel 12, Denkroutine Schritt 2 und 3 (Kandidaten und stärkste Antwort).
 */
import { useState } from "react";
import { sprache, t } from "../../i18n/sprache";
import { sanInSprache } from "../../schach/notation";
import { stellungAusFen, type Rolle } from "../../schach/stellung";
import { spieleZug, zugFelder } from "../../schach/weiterspielen";
import { fenNach, regelstellung } from "../../spiel/zuege";
import { KANDIDATEN } from "../../training/denkroutinetrainer";
import { Brettbereich } from "../komponenten/brettbedienung/Brettbereich";
import { useBrettbedienung } from "../komponenten/brettbedienung/useBrettbedienung";

const KEINE_WAHL = () => undefined;
/** Je Kandidat zwei Züge: der Kandidat selbst und die Antwort des Gegners. */
const ZUEGE_JE_KANDIDAT = 2;
const de = (san: string) => sanInSprache(san, sprache());

/** Ein Paar aus Kandidat und Antwort; die Antwort ist leer, wenn der Kandidat die Partie beendet. */
interface Paar {
  readonly kandidat: string;
  readonly antwort: string | null;
}

/** Hat die Stellung keinen regelgerechten Zug mehr (Matt oder Patt)? */
function istZuEnde(fen: string): boolean {
  return regelstellung(fen)?.isEnd() ?? false;
}

/** Die Paare aus der Liste der eingegebenen Züge (Antwort null, solange sie fehlt). */
function paareAus(zuege: readonly string[]): Paar[] {
  const paare: Paar[] = [];
  for (let i = 0; i < zuege.length; i += ZUEGE_JE_KANDIDAT) {
    paare.push({ kandidat: zuege[i] ?? "", antwort: zuege[i + 1] ?? null });
  }
  return paare;
}

/** Text für den nächsten Schritt: welcher Kandidat oder welche Antwort jetzt dran ist. */
function auftrag(zuege: readonly string[], gegner: string): string {
  const nummer = Math.floor(zuege.length / ZUEGE_JE_KANDIDAT) + 1;
  if (zuege.length % ZUEGE_JE_KANDIDAT === 0) return t("denk.zieheKandidat", { nummer });
  return t("denk.zieheAntwort", { farbe: gegner, zug: de(zuege.at(-1) ?? "") });
}

/**
 * Das Brett zur Eingabe und die Liste der Paare.
 *
 * Eingaben: Stellung der Aufgabe, ob das Brett gedreht steht, Name der Gegenfarbe und die
 * Prüfung (Kandidaten und Antworten als Kurznotation).
 * Sonderfälle: Derselbe Kandidat zweimal wird abgelehnt; setzt ein Kandidat matt oder patt,
 * gibt es keine Antwort, die Eingabe springt gleich zum nächsten Kandidaten.
 */
export function Denkeingabe({
  fen,
  gedreht,
  gegner,
  pruefe,
}: {
  fen: string;
  gedreht: boolean;
  gegner: string;
  pruefe: (kandidaten: readonly string[], antworten: readonly string[]) => void;
}) {
  const [zuege, setzeZuege] = useState<readonly string[]>([]);
  const [doppelt, setzeDoppelt] = useState(false);
  const antwortDran = zuege.length % ZUEGE_JE_KANDIDAT === 1;
  const kandidat = antwortDran ? (zuege.at(-1) ?? "") : null;
  const brettFen = kandidat ? (fenNach(fen, kandidat) ?? fen) : fen;
  const fertig = zuege.length >= KANDIDATEN * ZUEGE_JE_KANDIDAT;
  const uebernimm = (neu: readonly string[]) => {
    setzeZuege(neu);
    if (neu.length < KANDIDATEN * ZUEGE_JE_KANDIDAT) return;
    const paare = paareAus(neu);
    pruefe(
      paare.map((p) => p.kandidat),
      paare.map((p) => p.antwort ?? ""),
    );
  };
  const spiele = (von: string, nach: string, umwandlung?: Rolle) => {
    if (fertig) return "ungueltig" as const;
    const versuch = spieleZug(brettFen, von, nach, umwandlung);
    if (versuch.art !== "gespielt") return versuch.art;
    const schonDa = !antwortDran && paareAus(zuege).some((p) => p.kandidat === versuch.san);
    setzeDoppelt(schonDa);
    if (schonDa) return "ungueltig" as const;
    // Beendet der Kandidat die Partie, gibt es keine Antwort: leer eintragen und weiter.
    uebernimm(
      !antwortDran && istZuEnde(versuch.fen)
        ? [...zuege, versuch.san, ""]
        : [...zuege, versuch.san],
    );
    return "gespielt" as const;
  };
  const bedienung = useBrettbedienung(
    { fen: brettFen, spiele },
    fertig ? null : "ziehen",
    KEINE_WAHL,
  );
  const stellung = stellungAusFen(brettFen);
  return (
    <section data-testid="denk-eingabe">
      {!fertig && <p className="trainer-auftrag">{auftrag(zuege, gegner)}</p>}
      {stellung.ok && (
        <Brettbereich
          stellung={stellung.wert}
          markierungen={[]}
          letzterZug={kandidat ? zugFelder(fen, kandidat) : null}
          bedienung={bedienung}
          beschriftung={t("denk.brett")}
          anfangsGedreht={gedreht}
        />
      )}
      {doppelt && <p className="meldung schlecht">{t("denk.doppelt")}</p>}
      <ol className="denkpaare" data-testid="denk-paare">
        {paareAus(zuege).map((p, i) => (
          <li key={i}>
            {de(p.kandidat)}
            {p.antwort === null ? " …" : p.antwort === "" ? "" : ` – ${de(p.antwort)}`}
          </li>
        ))}
      </ol>
      {zuege.length > 0 && !fertig && (
        <button
          type="button"
          className="knopf-zweit"
          onClick={() => setzeZuege(zuege.at(-1) === "" ? zuege.slice(0, -2) : zuege.slice(0, -1))}
        >
          {t("denk.zuruecknehmen")}
        </button>
      )}
    </section>
  );
}
