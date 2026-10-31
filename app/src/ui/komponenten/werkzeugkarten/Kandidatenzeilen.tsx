/**
 * Die Kandidaten der Denkroutine als Zeilen: Zug, Art als Zeichen, Bewertungsbalken mit Wert,
 * Veränderung als ▲/▼ mit Zahl, Krone (stärkster laut Engine) und Waage (beste Bilanz gegen die
 * stärkste Antwort); darunter die stärkste Antwort mit Material.
 *
 * Rolle im Gesamtbild: Runde „Weniger Text“, P10 (Wahl des Autors, 31.10.2026). Darstellung für
 * KandidatenKarte.tsx, die rechnet. Regel aus den Notizen des Autors: Der Balken zeigt die
 * Bewertung selbst (je Kandidat), die Veränderung gegenüber der Stellung jetzt steht als Pfeil
 * mit Zahl daneben, nicht als zweiter Balken. Jedes Zeichen trägt für Bildschirmleser den Text,
 * der früher als Satz dastand („verbessert die Stellung um 0,67“, „Schach“).
 * Abhängigkeiten: analyse/k12-kandidaten.ts (Kandidat), analyse/k12-antwort.ts (Antwort),
 * kandidatenbewertung.ts, Kandidatenzeichen.tsx, i18n.
 * Buchbezug: Kapitel 12, Denkroutine Schritte 2 bis 4.
 */
import type { Color } from "chessops/types";
import { Crown, Scale } from "lucide-react";
import type { Antwort } from "../../../analyse/k12-antwort";
import type { Kandidat } from "../../../analyse/k12-kandidaten";
import { zugtext } from "../../../analyse/texte";
import type { Wert } from "../../../engine/uci";
import { t } from "../../../i18n/sprache";
import { Antwortzeile, Artzeichen, Kandidatenlegende } from "./Kandidatenzeichen";
import { Veraenderung } from "./Veraenderung";
import { balkenanteil, wertAusSicht, wertzahl } from "./kandidatenbewertung";

const SYMBOLGROESSE = 18;
const PROZENT = 100;

/** Ein Kandidat mit stärkster Antwort und (sobald gerechnet) dem Wert der Engine. */
export interface Kandidatenzeile {
  readonly kandidat: Kandidat;
  readonly antwort: Antwort;
  /** Wert nach dem Kandidaten aus Sicht von Weiß; null, solange die Engine rechnet. */
  readonly wert: Wert | null;
}

/** Der Balken mit dem Wert daneben; die Zahl liest der Bildschirmleser, der Balken ist Zierde. */
function Wertbalken({ wert, eigen }: { wert: Wert; eigen: Color }) {
  const anteil = balkenanteil(wertAusSicht(wert, eigen));
  return (
    <>
      <span className="kandidat-balken" aria-hidden="true">
        <span style={{ width: `${Math.round(anteil * PROZENT)}%` }} />
      </span>
      <span className="kandidat-wert">{wertzahl(wert, eigen)}</span>
    </>
  );
}

/**
 * Platz von Balken und Wert ohne Wert: leer, solange die Engine rechnet; danach „–“ mit dem
 * Satz „Die Engine nannte keinen Wert.“ für Bildschirmleser.
 */
function OhneWert({ nr, zug, gerechnet }: { nr: number; zug: string; gerechnet: boolean }) {
  if (!gerechnet)
    return (
      <>
        <span className="kandidat-leer" />
        <span className="kandidat-leer" />
      </>
    );
  return (
    <>
      <span className="kandidat-leer" />
      <span
        className="kandidat-wert"
        role="img"
        aria-label={t("kandidaten.engine.ohneWert", { nr, zug })}
      >
        –
      </span>
    </>
  );
}

/** Krone und Waage, wenn der Kandidat sie verdient. */
function Auszeichnung({ krone, waage }: { krone: boolean; waage: boolean }) {
  return (
    <span className="kandidat-auszeichnung">
      {krone && (
        <span className="kandidat-krone" role="img" aria-label={t("wenigertext.werkzeug.krone")}>
          <Crown size={SYMBOLGROESSE} aria-hidden="true" />
        </span>
      )}
      {waage && (
        <span className="kandidat-waage" role="img" aria-label={t("wenigertext.werkzeug.waage")}>
          <Scale size={SYMBOLGROESSE} aria-hidden="true" />
        </span>
      )}
    </span>
  );
}

/** Eine Zeile: Zug, Art, Balken, Wert, Veränderung, Auszeichnung; darunter die Antwort. */
function Zeile({
  nr,
  zeile,
  jetzt,
  eigen,
  krone,
  waage,
}: {
  /** Nummer des Kandidaten wie in der Liste der Denkroutine (ab 1). */
  nr: number;
  zeile: Kandidatenzeile;
  jetzt: Wert | null;
  eigen: Color;
  krone: boolean;
  waage: boolean;
}) {
  const { kandidat, antwort, wert } = zeile;
  return (
    <li className="kandidat-zeile" data-testid="kandidat-zeile">
      <strong className="kandidat-zug">{zugtext(kandidat.san)}</strong>
      <Artzeichen kandidat={kandidat} />
      {wert ? (
        <Wertbalken wert={wert} eigen={eigen} />
      ) : (
        <OhneWert nr={nr} zug={zugtext(kandidat.san)} gerechnet={jetzt !== null} />
      )}
      {wert && jetzt ? (
        <Veraenderung jetzt={jetzt} danach={wert} eigen={eigen} />
      ) : (
        <span className="kandidat-leer" />
      )}
      <Auszeichnung krone={krone} waage={waage} />
      <Antwortzeile kandidat={kandidat} antwort={antwort} />
    </li>
  );
}

/**
 * Alle Zeilen mit Legende der Zeichen.
 *
 * Eingaben: Zeilen, Wert der Stellung jetzt (oder null), eigene Seite, Index des stärksten
 * Kandidaten laut Engine und des besten nach Bilanz (je oder null).
 * Beispiel: Abb. 12.1 → „Lxh7+ ⊕ ▮▮▮▮ +5,37 ▲ 0,67 👑“, darunter „⚔ Kxh7 · Material −2“.
 */
export function Kandidatenzeilen({
  zeilen,
  jetzt,
  eigen,
  krone,
  waage,
}: {
  zeilen: readonly Kandidatenzeile[];
  jetzt: Wert | null;
  eigen: Color;
  krone: number | null;
  waage: number | null;
}) {
  return (
    <>
      <ol className="kandidatenzeilen">
        {zeilen.map((zeile, i) => (
          <Zeile
            key={zeile.kandidat.uci}
            nr={i + 1}
            zeile={zeile}
            jetzt={jetzt}
            eigen={eigen}
            krone={i === krone}
            waage={i === waage}
          />
        ))}
      </ol>
      <Kandidatenlegende kandidaten={zeilen.map((z) => z.kandidat)} />
    </>
  );
}
