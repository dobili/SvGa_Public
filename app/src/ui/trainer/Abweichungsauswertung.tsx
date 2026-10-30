/**
 * Auswertung im Abweichungsmodus: Hinweis vor dem Zug, Einordnung des Planzuges, Vergleich von
 * bestem Zug, Zielzug und eigenem Zug mit Denkpause, Begründung und Fortsetzungen mit Balken.
 *
 * Rolle im Gesamtbild: Punkte O und D7 des Nebenchats (Wunsch des Autors, 30.10.2026). Teil von
 * ui/trainer/Abweichungsaufgabe.tsx; die Engine rechnet in useAbweichung.ts, die Sätze kommen aus
 * training/zielvergleich.ts.
 * Abhängigkeiten: training/zielvergleich.ts, Folgespieler (Folgenwahl), i18n.
 */
import { useMemo, useState } from "react";
import { zugtext } from "../../analyse/texte";
import { t, zahlText } from "../../i18n/sprache";
import { abweichungshinweis, istPlanzug, zielbegruendung } from "../../training/zielvergleich";
import type { Color } from "chessops/types";
import { Folgenwahl } from "./Folgespieler";
import type { Antwortbewertung, Bewerteter } from "./useAbweichung";

const NACHKOMMA = 1;

/** Ein Wert mit Vorzeichen aus Sicht des Lesers, etwa „+0,4“. */
function werttext(wert: number): string {
  const zahl = zahlText(Math.abs(wert), NACHKOMMA);
  return `${wert >= 0 ? "+" : "−"}${zahl}`;
}

/** Vor dem eigenen Zug: aufklappbar, was der Abweichzug angreift oder droht. */
export function Abweichungshinweis({
  fenVorAbw,
  abw,
  fenNachAbw,
  gegnerFarbe,
}: {
  fenVorAbw: string;
  abw: string;
  fenNachAbw: string;
  gegnerFarbe: string;
}) {
  const [offen, setzeOffen] = useState(false);
  const saetze = useMemo(
    () => (offen ? abweichungshinweis(fenVorAbw, abw, fenNachAbw) : []),
    [offen, fenVorAbw, abw, fenNachAbw],
  );
  return (
    <>
      <button
        type="button"
        className="knopf-link"
        aria-pressed={offen}
        onClick={() => setzeOffen(!offen)}
      >
        {t("abweichung.hinweis.knopf", { farbe: gegnerFarbe, zug: zugtext(abw) })}
      </button>
      {saetze.map((satz) => (
        <p key={satz} className="hinweis" data-testid="abweichung-hinweis">
          {satz}
        </p>
      ))}
    </>
  );
}

/** Nach dem Zug: Hat der Leser stur den Buchplan gespielt, oder auf die Abweichung reagiert? */
export function Planeinordnung({
  eigen,
  planzug,
  abw,
  verlust,
}: {
  eigen: string;
  planzug: string | null;
  abw: string;
  verlust: number;
}) {
  if (!planzug) return null;
  const plan = istPlanzug(eigen, planzug);
  const text = !plan
    ? t("abweichung.plan.reagiert", { abw: zugtext(abw), plan: zugtext(planzug) })
    : verlust <= 0.5
      ? t("abweichung.plan.gut", { zug: zugtext(eigen), abw: zugtext(abw) })
      : t("abweichung.plan.schlecht", {
          zug: zugtext(eigen),
          abw: zugtext(abw),
          bauern: zahlText(verlust, NACHKOMMA),
        });
  return (
    <p className="meldung" data-testid="abweichung-plan">
      {text}
    </p>
  );
}

/** Die drei Züge mit ihren Werten. */
function Vergleichsliste({ zeilen }: { zeilen: readonly { name: string; z: Bewerteter }[] }) {
  return (
    <ul>
      {zeilen.map(({ name, z }) => (
        <li key={name}>
          {t("abweichung.vergleich.zeile", { name, zug: zugtext(z.zug), wert: werttext(z.wert) })}
        </li>
      ))}
    </ul>
  );
}

/**
 * Bester Zug, Zielzug und eigener Zug im Vergleich. Weichen bester Zug und Zielzug ab, erst eine
 * Denkpause mit der Frage, dann die Begründung; darunter die Fortsetzungen mit Balken.
 */
export function Zielvergleich({
  fen,
  seite,
  bewertung,
}: {
  fen: string;
  seite: Color;
  bewertung: Antwortbewertung;
}) {
  const [aufgeloest, setzeAufgeloest] = useState(false);
  const { bester, ziel, eigener } = bewertung;
  const begruendung = useMemo(
    () => (bester && ziel && aufgeloest ? zielbegruendung(fen, seite, bester, ziel) : []),
    [fen, seite, bester, ziel, aufgeloest],
  );
  if (!bester) return null;
  const verschieden = ziel !== null && ziel.zug !== bester.zug;
  const zeilen = [
    { name: t("abweichung.vergleich.bester"), z: bester },
    ...(ziel ? [{ name: t("abweichung.vergleich.ziel"), z: ziel }] : []),
    ...(eigener ? [{ name: t("abweichung.vergleich.eigen"), z: eigener }] : []),
  ];
  const linien = zeilen.map(({ name, z }) => ({
    name: `${name}: ${zugtext(z.zug)}`,
    zuege: z.folge,
  }));
  return (
    <section className="karte" data-testid="abweichung-vergleich">
      <h3 className="karte-titel">{t("abweichung.vergleich.titel")}</h3>
      <Vergleichsliste zeilen={zeilen} />
      {!verschieden && <p>{t("abweichung.vergleich.gleich", { zug: zugtext(bester.zug) })}</p>}
      {verschieden && !aufgeloest && (
        <>
          <p className="meldung" data-testid="abweichung-denkpause">
            {t("abweichung.denkpause", { bester: zugtext(bester.zug), ziel: zugtext(ziel.zug) })}
          </p>
          <button type="button" className="knopf-zweit" onClick={() => setzeAufgeloest(true)}>
            {t("abweichung.aufloesen")}
          </button>
        </>
      )}
      {begruendung.map((satz) => (
        <p key={satz} data-testid="abweichung-begruendung">
          {satz}
        </p>
      ))}
      {(!verschieden || aufgeloest) && (
        <Folgenwahl
          startFen={fen}
          linien={linien}
          titel={t("abweichung.folgenTitel")}
          gedreht={seite === "black"}
          testid="abweichung-folgen"
        />
      )}
    </section>
  );
}
