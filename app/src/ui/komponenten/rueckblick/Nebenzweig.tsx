/**
 * „Besser war …, danach etwa …“ im Rückblick als antippbare Züge: Ein Tipp zeigt die Stellung
 * nach diesem Zug des Nebenzweigs am Brett, Pfeile davor und danach gehen Zug für Zug, „Zurück
 * zur Partie“ verlässt den Zweig (seit 0.2.85, Wunsch des Autors).
 *
 * Seit 0.2.85 auch der zweite Zweig „So wird der Fehler bestraft“: die Hauptvariante der Engine
 * nach dem Fehlzug, also wie der Gegner Material gewinnt (Rückmeldung des Autors zu 4. c4?, wo
 * das Motiv „Gabel: e5“ ohne Zugfolge nicht einleuchtete).
 * Rolle im Gesamtbild: Teil der Rückblickkarte (Rueckblickkarte.tsx); die Stellung am Brett wählt
 * der Partie-Bildschirm (Partie.tsx) aus dem Schritt. Die Züge rechnet spiel/nebenzweig.ts.
 * Abhängigkeiten: spiel/nebenzweig.ts, lucide, i18n.
 */
import { ChevronLeft, ChevronRight, Undo2 } from "lucide-react";
import { Fragment } from "react";
import { t } from "../../../i18n/sprache";
import type { Zweigzug } from "../../../spiel/nebenzweig";

const SYMBOL = 18;

/** Die beiden Zweige: der bessere Zug und die Strafe für den gespielten. */
export type Zweigart = "besser" | "strafe";

/** Der gewählte Zweig und Schritt (1 = nach dem ersten Zug) und ihr Setzer; null = Partie. */
export interface Zweigwahl {
  readonly art: Zweigart | null;
  readonly schritt: number | null;
  readonly setze: (art: Zweigart, schritt: number | null) => void;
}

/** Ein Zug des Zweigs als Knopf; der gezeigte ist hervorgehoben. */
function Zweigknopf({
  zug,
  nummer,
  art,
  wahl,
}: {
  zug: Zweigzug;
  nummer: number;
  art: Zweigart;
  wahl: Zweigwahl;
}) {
  return (
    <button
      type="button"
      className="zweigzug"
      aria-pressed={wahl.art === art && wahl.schritt === nummer}
      onClick={() => wahl.setze(art, nummer)}
    >
      {zug.text}
    </button>
  );
}

/** Pfeile und „Zurück zur Partie“, solange ein Zug des Zweigs gezeigt wird. */
function Zweigsteuerung({ anzahl, art, wahl }: { anzahl: number; art: Zweigart; wahl: Zweigwahl }) {
  const schritt = wahl.schritt;
  if (schritt === null || wahl.art !== art) return null;
  return (
    <div className="zweigsteuerung">
      <button
        type="button"
        className="knopf-symbol"
        disabled={schritt <= 1}
        aria-label={t("rueckblick.zweigZurueckZug")}
        onClick={() => wahl.setze(art, schritt - 1)}
      >
        <ChevronLeft size={SYMBOL} aria-hidden="true" />
      </button>
      <button
        type="button"
        className="knopf-symbol"
        disabled={schritt >= anzahl}
        aria-label={t("rueckblick.zweigVorZug")}
        onClick={() => wahl.setze(art, schritt + 1)}
      >
        <ChevronRight size={SYMBOL} aria-hidden="true" />
      </button>
      <button type="button" className="knopf-link" onClick={() => wahl.setze(art, null)}>
        <Undo2 size={SYMBOL} aria-hidden="true" /> {t("rueckblick.zweigZurPartie")}
      </button>
    </div>
  );
}

/** Einleitung je Zweig: „Besser war … danach etwa …“ oder „So wird der Fehler bestraft: …“. */
const EINLEITUNG = {
  besser: ["rueckblick.zweigBesser", "rueckblick.zweigDanach"],
  strafe: ["rueckblick.zweigStrafe", null],
} as const;

/**
 * „Besser war 10. exf4, danach etwa 10... Sf6 11. Se4.“ oder „So wird der Fehler bestraft:
 * 4... e5 5. dxe5 Sxe5“ mit antippbaren Zügen.
 * Ohne Züge (alte Auswertung ohne Variante, unlesbare Züge) nichts.
 */
export function Nebenzweig({
  zuege,
  art,
  wahl,
}: {
  zuege: readonly Zweigzug[];
  art: Zweigart;
  wahl: Zweigwahl;
}) {
  const [erster, ...danach] = zuege;
  if (!erster) return null;
  const [anfang, weiter] = EINLEITUNG[art];
  return (
    <div className="nebenzweig" data-testid={`nebenzweig-${art}`}>
      <p>
        {t(anfang)} <Zweigknopf zug={erster} nummer={1} art={art} wahl={wahl} />
        {danach.length > 0 && weiter && <> {t(weiter)} </>}
        {danach.map((zug, i) => (
          <Fragment key={zug.vorher}>
            {!weiter && " "}
            <Zweigknopf zug={zug} nummer={i + 2} art={art} wahl={wahl} />
          </Fragment>
        ))}
      </p>
      <Zweigsteuerung anzahl={zuege.length} art={art} wahl={wahl} />
    </div>
  );
}
