/**
 * Zustand von Nachspielen und Weiterspielen auf dem Abbildung-Bildschirm.
 *
 * Rolle im Gesamtbild: Verbindet eine Abbildung mit ihrer Zugfolge (Pflichtenheft 4
 * „Nachspielen“) und mit den eigenen Zügen des Lesers („Weiterspielen“). Die gezeigte Stellung ist
 * die Buchstellung am Pfad, danach die eigenen Züge bis zur aktuellen Stelle. Ohne Zugfolge ist
 * die Buchstellung die Stellung der Abbildung.
 * Abhängigkeiten: schach/variantenbaum.ts, schach/weiterspielen.ts, daten/laden.ts.
 */
import { useMemo, useState } from "react";
import type { Abbildung, Kapitel } from "../../daten/laden";
import { fenNach, fortsetzungen, zeile, type Beispiel } from "../../schach/variantenbaum";
import {
  fenNachZuegen,
  KEINE_EIGENEN,
  spieleZug,
  zugFelder,
  type EigeneZuege,
  type Zugversuch,
} from "../../schach/weiterspielen";
import type { Rolle } from "../../schach/stellung";
import type { Verlauf } from "../../schach/todsuenden";
import { sprache } from "../../i18n/sprache";

export interface Nachspielstand {
  /** Die Zugfolge der Abbildung; null, wenn sie keine hat. */
  readonly beispiel: Beispiel | null;
  /** Pfad im Buch ab der Startstellung des Beispiels. */
  readonly pfad: readonly string[];
  readonly setzePfad: (pfad: readonly string[]) => void;
  /** Eigene Züge hinter der Buchstellung. */
  readonly eigene: EigeneZuege;
  readonly setzeEigeneStelle: (stelle: number) => void;
  /** Die Buchstellung am Pfad (Ausgangspunkt der eigenen Züge). */
  readonly buchFen: string;
  /** Die gezeigte Stellung. */
  readonly fen: string;
  /** Felder des zuletzt gespielten Zuges für den hellen Schimmer. */
  readonly letzterZug: { von: string; nach: string } | null;
  /** Abbildung desselben Kapitels mit genau dieser Stellung, sonst null. */
  readonly abbildungHier: Abbildung | null;
  /** Ein eigener Zug; trifft er einen Buchzug, geht es im Buch weiter. */
  readonly spiele: (von: string, nach: string, umwandlung?: Rolle) => Zugversuch["art"];
  readonly schritt: (richtung: "anfang" | "zurueck" | "vor" | "ende") => void;
  readonly kann: { readonly zurueck: boolean; readonly vor: boolean };
  /**
   * Der nächste Zug (SAN, englisch): der nächste eigene Zug, sonst der nächste Buchzug; null am
   * Ende. Er ist der „geplante Zug“ für die Prüffragen (k4-prueffragen).
   */
  readonly naechsterZug: string | null;
  /** Die Züge bis zur gezeigten Stellung ab der Ausgangsstellung (für k1-todsuenden). */
  readonly verlauf: Verlauf;
}

function gleich(a: readonly string[], b: readonly string[]): boolean {
  return a.length === b.length && a.every((zug, i) => zug === b[i]);
}

/** Buchstellung und gefundene Abbildung am Pfad. */
function useBuchstand(kapitel: Kapitel, abbildung: Abbildung, pfad: readonly string[]) {
  const verknuepfung = abbildung.beispiel ?? null;
  const beispiel = useMemo(
    () => (verknuepfung ? (kapitel.beispiele.find((b) => b.id === verknuepfung.id) ?? null) : null),
    [kapitel, verknuepfung],
  );
  const amAusgangspunkt = !beispiel || gleich(pfad, verknuepfung?.pfad ?? []);
  const buchFen =
    amAusgangspunkt || !beispiel ? abbildung.fen : (fenNach(beispiel, pfad) ?? abbildung.fen);
  const abbildungHier = useMemo(() => {
    if (amAusgangspunkt) return abbildung;
    return (
      kapitel.abbildungen.find(
        (a) => a.beispiel?.id === beispiel?.id && gleich(a.beispiel?.pfad ?? [], pfad),
      ) ?? null
    );
  }, [amAusgangspunkt, abbildung, kapitel, beispiel, pfad]);
  return { beispiel, buchFen, abbildungHier };
}

/** Letzter Zug: der letzte eigene, sonst der letzte Buchzug. */
function letzterZugVon(
  beispiel: Beispiel | null,
  pfad: readonly string[],
  buchFen: string,
  eigene: EigeneZuege,
) {
  if (eigene.stelle > 0) {
    const vorher = fenNachZuegen(buchFen, eigene.zuege, eigene.stelle - 1);
    const san = eigene.zuege[eigene.stelle - 1];
    return vorher && san ? zugFelder(vorher, san) : null;
  }
  const san = pfad.at(-1);
  const vorher = beispiel && san ? fenNach(beispiel, pfad.slice(0, -1)) : null;
  return vorher && san ? zugFelder(vorher, san) : null;
}

/**
 * Hält Pfad und eigene Züge und bietet die Schritte der Zugleiste an.
 *
 * Schritte: Gibt es eigene Züge, bewegen sich „zurück“ und „vor“ zuerst in ihnen; erst an ihrem
 * Anfang geht „zurück“ im Buch weiter (die eigenen Züge verfallen dann). Ein neuer eigener Zug
 * mitten in der eigenen Zeile ersetzt den Rest.
 */
export function useNachspielen(kapitel: Kapitel, abbildung: Abbildung): Nachspielstand {
  const [pfad, setzePfadRoh] = useState<readonly string[]>(abbildung.beispiel?.pfad ?? []);
  const [eigene, setzeEigene] = useState<EigeneZuege>(KEINE_EIGENEN);
  const { beispiel, buchFen, abbildungHier } = useBuchstand(kapitel, abbildung, pfad);
  const fen = fenNachZuegen(buchFen, eigene.zuege, eigene.stelle) ?? buchFen;
  const setzePfad = (neu: readonly string[]) => {
    setzeEigene(KEINE_EIGENEN);
    setzePfadRoh(neu);
  };
  const buchzeile = beispiel ? zeile(beispiel, pfad, sprache()) : [];
  const spiele = (von: string, nach: string, umwandlung?: Rolle): Zugversuch["art"] => {
    const versuch = spieleZug(fen, von, nach, umwandlung);
    if (versuch.art !== "gespielt") return versuch.art;
    const imBuch =
      eigene.stelle === 0 &&
      beispiel &&
      fortsetzungen(beispiel, pfad).some((k) => k.zug === versuch.san);
    if (imBuch) setzePfad([...pfad, versuch.san]);
    else
      setzeEigene({
        zuege: [...eigene.zuege.slice(0, eigene.stelle), versuch.san],
        stelle: eigene.stelle + 1,
      });
    return "gespielt";
  };
  const kann = {
    zurueck: eigene.stelle > 0 || pfad.length > 0,
    vor:
      eigene.stelle < eigene.zuege.length ||
      (eigene.zuege.length === 0 && buchzeile.length > pfad.length),
  };
  const schritt = (richtung: "anfang" | "zurueck" | "vor" | "ende") => {
    const eigenAktiv = eigene.zuege.length > 0;
    if (richtung === "anfang") setzePfad([]);
    else if (richtung === "zurueck" && eigene.stelle > 0)
      setzeEigene({ ...eigene, stelle: eigene.stelle - 1 });
    else if (richtung === "zurueck") setzePfad(pfad.slice(0, -1));
    else if (eigenAktiv)
      setzeEigene({
        ...eigene,
        stelle:
          richtung === "vor"
            ? Math.min(eigene.stelle + 1, eigene.zuege.length)
            : eigene.zuege.length,
      });
    else if (richtung === "vor") setzePfad(buchzeile[pfad.length]?.pfad ?? pfad);
    else setzePfad(buchzeile.at(-1)?.pfad ?? pfad);
  };
  return {
    beispiel,
    pfad,
    setzePfad,
    eigene,
    setzeEigeneStelle: (stelle) => setzeEigene({ ...eigene, stelle }),
    buchFen,
    fen,
    letzterZug: letzterZugVon(beispiel, pfad, buchFen, eigene),
    abbildungHier: eigene.stelle === 0 ? abbildungHier : null,
    spiele,
    schritt,
    kann,
    verlauf: {
      startFen: beispiel?.startFen ?? abbildung.fen,
      zuege: [...pfad, ...eigene.zuege.slice(0, eigene.stelle)],
    },
    naechsterZug:
      eigene.zuege.length > 0
        ? (eigene.zuege[eigene.stelle] ?? null)
        : (buchzeile[pfad.length]?.san ?? null),
  };
}
