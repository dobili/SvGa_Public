/**
 * „Besser war …, danach etwa …“ im Rückblick als antippbare Züge: Ein Tipp zeigt die Stellung
 * nach diesem Zug des Nebenzweigs am Brett, Pfeile davor und danach gehen Zug für Zug, „Zurück
 * zur Partie“ verlässt den Zweig (seit 0.2.85, Wunsch des Autors).
 *
 * Rolle im Gesamtbild: Teil der Rückblickkarte (Rueckblickkarte.tsx); die Stellung am Brett wählt
 * der Partie-Bildschirm (Partie.tsx) aus dem Schritt. Die Züge rechnet spiel/nebenzweig.ts.
 * Abhängigkeiten: spiel/nebenzweig.ts, lucide, i18n.
 */
import { ChevronLeft, ChevronRight, Undo2 } from "lucide-react";
import { t } from "../../i18n/sprache";
import type { Zweigzug } from "../../spiel/nebenzweig";

const SYMBOL = 18;

/** Der gewählte Schritt im Nebenzweig (1 = nach dem ersten Zug) und sein Setzer; null = Partie. */
export interface Zweigwahl {
  readonly schritt: number | null;
  readonly setze: (schritt: number | null) => void;
}

/** Ein Zug des Zweigs als Knopf; der gezeigte ist hervorgehoben. */
function Zweigknopf({ zug, nummer, wahl }: { zug: Zweigzug; nummer: number; wahl: Zweigwahl }) {
  return (
    <button
      type="button"
      className="zweigzug"
      aria-pressed={wahl.schritt === nummer}
      onClick={() => wahl.setze(nummer)}
    >
      {zug.text}
    </button>
  );
}

/** Pfeile und „Zurück zur Partie“, solange ein Zug des Zweigs gezeigt wird. */
function Zweigsteuerung({ anzahl, wahl }: { anzahl: number; wahl: Zweigwahl }) {
  const schritt = wahl.schritt;
  if (schritt === null) return null;
  return (
    <div className="zweigsteuerung">
      <button
        type="button"
        className="knopf-symbol"
        disabled={schritt <= 1}
        aria-label={t("rueckblick.zweigZurueckZug")}
        onClick={() => wahl.setze(schritt - 1)}
      >
        <ChevronLeft size={SYMBOL} aria-hidden="true" />
      </button>
      <button
        type="button"
        className="knopf-symbol"
        disabled={schritt >= anzahl}
        aria-label={t("rueckblick.zweigVorZug")}
        onClick={() => wahl.setze(schritt + 1)}
      >
        <ChevronRight size={SYMBOL} aria-hidden="true" />
      </button>
      <button type="button" className="knopf-link" onClick={() => wahl.setze(null)}>
        <Undo2 size={SYMBOL} aria-hidden="true" /> {t("rueckblick.zweigZurPartie")}
      </button>
    </div>
  );
}

/**
 * „Besser war 10. exf4, danach etwa 10... Sf6 11. Se4.“ mit antippbaren Zügen.
 * Ohne Züge (alte Auswertung ohne Variante, unlesbare Züge) nichts.
 */
export function Nebenzweig({ zuege, wahl }: { zuege: readonly Zweigzug[]; wahl: Zweigwahl }) {
  const [erster, ...danach] = zuege;
  if (!erster) return null;
  return (
    <div className="nebenzweig" data-testid="nebenzweig">
      <p>
        {t("rueckblick.zweigBesser")} <Zweigknopf zug={erster} nummer={1} wahl={wahl} />
        {danach.length > 0 && <> {t("rueckblick.zweigDanach")} </>}
        {danach.map((zug, i) => (
          <Zweigknopf key={zug.vorher} zug={zug} nummer={i + 2} wahl={wahl} />
        ))}
      </p>
      <Zweigsteuerung anzahl={zuege.length} wahl={wahl} />
    </div>
  );
}
