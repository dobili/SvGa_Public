/**
 * Rückblick beim Nachspielen einer ausgewerteten Partie: Markierungen am Brett, Bewertungsbalken
 * und die Karte zum gezeigten Zug (Rueckblickkarte.tsx).
 *
 * Rolle im Gesamtbild: Vorschlag H und die Rückmeldung des Autors zum Nachtest („Nachspielen wie
 * bei chess.com: Bewertung des aktuellen Zuges, beste Alternative mit Markierungen, einfache
 * Kommentare, warum ein Zug schlecht war“). Die Erklärung rechnet nur für die gezeigte Stellung
 * (spiel/erklaerung.ts, ohne Engine); während der Partie bleibt alles aus. Beginnt mit der
 * Stellung nach dem gezeigten Zug eine neue Phase, erklärt die Karte, warum (Wunsch des Autors;
 * analyse/phasentext.ts).
 * Dazu die Knöpfe unter dem Brett, die die beiden Varianten der Karte langsam abspielen
 * (Variantenknoepfe.tsx, Wunsch des Autors, 26.10.2026).
 * Abhängigkeiten: spiel/rueckblick.ts, spiel/erklaerung.ts, spiel/phasen.ts, Bewertungsbalken,
 * Rueckblickkarte, Variantenknoepfe, rueckblicktyp.ts.
 */
import { useMemo, type ReactNode } from "react";
import { phasensatz, zusatzsatz } from "../../../analyse/phasentext";
import type { Markierung } from "../../../analyse/werkzeug";
import { phasenbefundVon, type Phase } from "../../../spiel/phasen";
import { erklaereZug, type Zugerklaerung } from "../../../spiel/erklaerung";
import { MIT_BESSEREM, MIT_STRAFE, zweigzuege, type Zweigzug } from "../../../spiel/nebenzweig";
import type { Partie } from "../../../spiel/partie";
import { rueckblickMarken } from "../../../spiel/rueckblick";
import { sanZuUci } from "../../../spiel/zuege";
import { Bewertungsbalken } from "./Bewertungsbalken";
import type { Zweigwahl } from "./Nebenzweig";
import { Rueckblickkarte } from "./Rueckblickkarte";
import { Variantenknoepfe } from "./Variantenknoepfe";
import type { Rueckblick } from "./rueckblicktyp";

/** Typ aus rueckblicktyp.ts, weitergegeben für Dateien, die ihn von hier importieren. */
export type { Rueckblick } from "./rueckblicktyp";

/** Erklärung des gezeigten Zuges, nur wenn er ein Fehlerzeichen trägt. */
function erklaerungFuer(
  rb: Rueckblick,
  alle: readonly string[],
  sans: readonly string[],
  index: number,
): Zugerklaerung | null {
  const urteil = rb.urteile[index];
  const vorher = alle[index];
  const danach = alle[index + 1];
  const san = sans[index];
  if (!urteil?.zeichen || urteil.zeichen === "!" || !vorher || !danach || !san) return null;
  const uci = sanZuUci(vorher, san);
  if (!uci) return null;
  return erklaereZug(
    vorher,
    danach,
    uci,
    rb.beste[index + 1] ?? "",
    urteil.verlust,
    rb.beste[index] ?? null,
    sans[index - 1] ?? null,
  );
}

/** Die Erklärung des Phasenwechsels, wenn mit der Stellung nach dem Zug eine neue Phase beginnt. */
function phasenwechselText(
  phasen: readonly Phase[],
  alle: readonly string[],
  index: number,
): string | null {
  const vorher = phasen[index];
  const nachher = phasen[index + 1];
  if (!vorher || !nachher || vorher === nachher) return null;
  const befund = phasenbefundVon(alle[index + 1] ?? "");
  if (!befund) return null;
  const zusatz = zusatzsatz(befund);
  return zusatz ? `${phasensatz(befund)} ${zusatz}` : phasensatz(befund);
}

/**
 * Markierungen, Balken und Karte für die gezeigte Stelle.
 *
 * Beispiel: Stelle 3 nach 1. e4 e5 2. Dh5?!: „?!“ auf h5, goldener Pfeil zum Zug der Engine,
 * Karte „2. Dh5?!: Die Gewinnchance von Weiß fällt von 54 % auf 48 %. Besser war 2. Sf3.“
 */
export function useRueckblick(
  rueckblick: Rueckblick | null,
  partie: Partie,
  alle: readonly string[],
  sans: readonly string[],
  stelle: number,
  phasen: readonly Phase[],
  zweig: Zweigwahl,
): {
  marken: readonly Markierung[];
  leiste: ((gedreht: boolean) => ReactNode) | null;
  karte: ReactNode;
  /** Die Knöpfe „abspielen“ unter dem Brett (seit 0.3.0), sonst null. */
  abspielen: ReactNode;
  /** Der gezeigte Zug des Nebenzweigs (seit 0.2.85), sonst null. */
  zweigzug: Zweigzug | null;
} {
  const index = stelle - 1;
  const erklaerung = useMemo(
    () => (rueckblick && index >= 0 ? erklaerungFuer(rueckblick, alle, sans, index) : null),
    [rueckblick, alle, sans, index],
  );
  const phasenwechsel = useMemo(
    () => (rueckblick && index >= 0 ? phasenwechselText(phasen, alle, index) : null),
    [rueckblick, phasen, alle, index],
  );
  const zweigZuege = useMemo(() => {
    if (!rueckblick || index < 0) return [];
    // Der bessere Zug und die Hauptvariante danach (R5, 0.2.56); alte Auswertungen ohne Variante
    // haben nur den besseren Zug.
    const variante = rueckblick.varianten?.[index] ?? [];
    const bester = rueckblick.beste[index] ?? "";
    return zweigzuege(alle[index] ?? "", variante.length > 0 ? variante : bester ? [bester] : []);
  }, [rueckblick, alle, index]);
  // Die Strafe (0.2.85): die Hauptvariante der Engine in der Stellung nach dem Zug.
  const strafZuege = useMemo(
    () =>
      rueckblick && index >= 0
        ? zweigzuege(alle[index + 1] ?? "", rueckblick.varianten?.[index + 1] ?? [])
        : [],
    [rueckblick, alle, index],
  );
  if (!rueckblick)
    return { marken: [], leiste: null, karte: null, abspielen: null, zweigzug: null };
  const marken =
    index >= 0
      ? [
          ...rueckblickMarken(
            alle[index] ?? "",
            sans[index] ?? "",
            rueckblick.urteile[index],
            rueckblick.beste[index] ?? "",
          ),
          ...(erklaerung?.marken ?? []),
        ]
      : [];
  const wert = rueckblick.werte[stelle] ?? 0;
  const leiste = (gedreht: boolean) => <Bewertungsbalken wert={wert} gedreht={gedreht} />;
  const karte =
    index >= 0 ? (
      <Rueckblickkarte
        rueckblick={rueckblick}
        partie={partie}
        fen={alle[index] ?? ""}
        index={index}
        erklaerung={erklaerung}
        phasenwechsel={phasenwechsel}
        zweig={zweig}
        zweigZuege={zweigZuege}
        strafZuege={strafZuege}
      />
    ) : null;
  const gewaehlt = zweig.art === "strafe" ? strafZuege : zweigZuege;
  const zweigzug = zweig.schritt !== null ? (gewaehlt[zweig.schritt - 1] ?? null) : null;
  // Dieselben Bedingungen wie in der Karte, damit nur abspielbar ist, was dort auch steht.
  const klasse = index >= 0 ? rueckblick.urteile[index]?.klasse : undefined;
  const mitBesser = klasse !== undefined && MIT_BESSEREM.has(klasse) && !!rueckblick.beste[index];
  const mitStrafe = klasse !== undefined && MIT_STRAFE.has(klasse);
  const abspielen = (
    <Variantenknoepfe
      besser={mitBesser ? zweigZuege : []}
      strafe={mitStrafe ? strafZuege : []}
      wahl={zweig}
    />
  );
  return { marken, leiste, karte, abspielen, zweigzug };
}
