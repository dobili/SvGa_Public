/**
 * „Merken“ im Rückblick einer Partie: ein Knopf am Brett und darunter ein Bereich mit zwei Zielen,
 * Lernsammlung („Lernen“) oder Fehlerdatenbank („Fehler“), mit Vorschlägen aus der Auswertung.
 *
 * Rolle im Gesamtbild: Beschluss des Autors (26.10.2026, Ideensammlung): ein Knopf statt zweier
 * Zeilen „In die Fehlerdatenbank“ und „In die Lernsammlung“, im Fenster die Wahl zwischen beiden.
 * Vorauswahl „Fehler“ bei Zügen mit ?, ?? oder „verpasst“, sonst „Lernen“. Die Felder tragen
 * Vorschläge (Wunsch vom 27.10.2026): Fehlerart als Kapitel der Gesamt-Checkliste
 * (spiel/fehlervorschlag.ts), ein Satz aus der Erklärung und dem besseren Zug, bei der
 * Lernsammlung die Eröffnung (wie bisher) und woher die Stellung stammt. Bei einem eigenen Patzer
 * oder verpassten Gewinn leuchtet der Knopf kurz golden auf (lieber zu selten als zu oft).
 * Abhängigkeiten: ui/trainer/FehlerFormular.tsx, lernsammlung/SammelFormular.tsx,
 * spiel/fehlervorschlag.ts, bausteine/Segmentwahl.tsx, i18n, lucide.
 */
import { BookmarkPlus } from "lucide-react";
import { useState } from "react";
import { t } from "../../../i18n/sprache";
import { fenNachZuegen } from "../../../schach/weiterspielen";
import type { Zugerklaerung } from "../../../spiel/erklaerung";
import { kapitelvorschlag } from "../../../spiel/fehlervorschlag";
import type { Partie } from "../../../spiel/partie";
import { FehlerFormular } from "../../trainer/FehlerFormular";
import { SammelFormular } from "../lernsammlung/SammelFormular";
import { Segmentwahl } from "../bausteine/Segmentwahl";
import { FEHLERKLASSEN } from "./merken";
import type { Rueckblick } from "./rueckblicktyp";

const SYMBOLGROESSE = 20;

/** Die beiden Ziele: Lernsammlung oder Fehlerdatenbank. */
type Merkziel = "lernen" | "fehler";
const MERKZIELE: readonly Merkziel[] = ["lernen", "fehler"];

/** Knopf „Merken“ am Brett; `leuchtet` lässt ihn bei einer guten Gelegenheit kurz aufleuchten. */
export function MerkenSchalter({
  an,
  leuchtet,
  beiKlick,
}: {
  an: boolean;
  leuchtet: boolean;
  beiKlick: () => void;
}) {
  return (
    <button
      type="button"
      className={leuchtet ? "knopf-symbol brettschalter leuchtet" : "knopf-symbol brettschalter"}
      data-testid="merken-schalter"
      aria-pressed={an}
      aria-label={t("merken.name")}
      title={t("merken.name")}
      onClick={beiKlick}
    >
      <BookmarkPlus size={SYMBOLGROESSE} aria-hidden="true" />
      <span className="brettschalter-text" aria-hidden="true">
        {t("merken.kurz")}
      </span>
    </button>
  );
}

/** Der vorgeschlagene Satz für die Fehlerdatenbank: Zug, Erklärung, besserer Zug. */
function satzvorschlag(zug: string, erklaerung: Zugerklaerung | null, bester: string): string {
  const teile = [
    erklaerung ? t("merken.satzErklaerung", { zug, text: erklaerung.text }) : zug,
    bester ? t("merken.satzBesser", { bester }) : "",
  ];
  return teile.filter(Boolean).join(" ");
}

/**
 * Der Bereich unter dem Brett, wenn „Merken“ offen ist.
 * Eingaben: Rückblick, Partie, Index des Zuges, Stellung vor dem Zug, Zug (Kurznotation), Zug und
 * besserer Zug als Text („12. Sxe4“), die Erklärung des Fehlers.
 * Beispiel: 12... Sxe4?? → Vorauswahl „Fehler“, Fehlerart „Kapitel 1: Schach oder Schlag
 * übersehen“, Satz „12... Sxe4: lässt Dxh7# zu. Besser war 12... h6.“
 */
export function Merkenbereich({
  rueckblick,
  partie,
  index,
  fen,
  san,
  zug,
  bester,
  erklaerung,
}: {
  rueckblick: Rueckblick;
  partie: Partie;
  index: number;
  fen: string;
  san: string;
  zug: string;
  bester: string;
  erklaerung: Zugerklaerung | null;
}) {
  const urteil = rueckblick.urteile[index];
  const [ziel, setzeZiel] = useState<Merkziel>(
    urteil && FEHLERKLASSEN.has(urteil.klasse) ? "fehler" : "lernen",
  );
  const startFen = partie.einstellung.startFen;
  const zuege = partie.zuege.slice(0, index + 1).map((z) => z.san);
  const danach = fenNachZuegen(startFen, zuege);
  const art = kapitelvorschlag(
    fen,
    san,
    rueckblick.beste[index + 1] ?? "",
    urteil?.verlust ?? 0,
    rueckblick.beste[index] || null,
  );
  return (
    <div className="merkenbereich" data-testid="merkenbereich">
      <Segmentwahl
        name={t("merken.ziel")}
        werte={MERKZIELE}
        gewaehlt={ziel}
        text={(z) => t(`merken.ziel.${z}`)}
        beiWahl={setzeZiel}
      />
      {ziel === "fehler" ? (
        <FehlerFormular
          fen={fen}
          zug={san}
          vorschlagArt={art}
          vorschlagSatz={satzvorschlag(zug, erklaerung, bester)}
        />
      ) : (
        <SammelFormular
          fen={danach}
          herkunft={{ herkunft: "partie", quelle: "", verlauf: { startFen, zuege } }}
          vorschlagNotiz={t("merken.notizPartie", { zug })}
        />
      )}
    </div>
  );
}
