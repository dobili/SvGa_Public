/**
 * Reiter „Bots“ der Einstellungen: das Maia-Zusatzpaket laden, ein- und ausschalten, löschen
 * (0.2.143, Entscheidung des Autors 25.10.2026: Komplettpaket, in den Einstellungen ausschaltbar).
 *
 * Rolle im Gesamtbild: Maia-2 lässt die Bots Züge wählen, die Menschen ihrer Stärke wirklich
 * spielen (engine/maia.ts). Das Paket (etwa 96 MB) gehört nicht zur Installation; hier lädt der
 * Leser es auf Wunsch (app/maiapaket.ts), mit Fortschritt und Fehlermeldung. Danach schaltet ein
 * Schalter Maia an und aus; er gilt ab der nächsten Partie (Partieeinstellung „maia“).
 * Abhängigkeiten: app/maiapaket.ts, app/einstellungen.ts, engine/maia-web.ts, maiastand.ts, i18n.
 */
import { useState } from "react";
import { aendereEinstellungen, useEinstellungen } from "../../app/einstellungen";
import { ladeMaia, loescheMaia, pruefeMaia } from "../../app/maiapaket";
import { maiaFreigeben } from "../../engine/maia-web";
import { t } from "../../i18n/sprache";
import { Auswahl } from "./Auswahl";
import { useMaiaBereit } from "./maiastand";

const PROZENT = 100;
const MB = 1024 * 1024;
/** Größe des Pakets für den Text vor dem Laden (zwei Netze zu 42 MB und die Laufzeit). */
const PAKET_MB = 96;

type Ladezustand =
  | { readonly art: "ruhe" }
  | { readonly art: "laedt"; readonly geladen: number; readonly gesamt: number }
  | { readonly art: "fehler"; readonly meldung: string };

/** Laden mit Fortschritt; danach steht der Schalter da. */
function Laden({ zustand, setze }: { zustand: Ladezustand; setze: (z: Ladezustand) => void }) {
  const lade = async () => {
    setze({ art: "laedt", geladen: 0, gesamt: PAKET_MB * MB });
    try {
      await ladeMaia((geladen, gesamt) => setze({ art: "laedt", geladen, gesamt }));
      await pruefeMaia();
      setze({ art: "ruhe" });
    } catch (fehler) {
      setze({ art: "fehler", meldung: fehler instanceof Error ? fehler.message : String(fehler) });
    }
  };
  if (zustand.art === "laedt") {
    const anteil = Math.round((zustand.geladen / zustand.gesamt) * PROZENT);
    return (
      <div className="maia-laden" role="status">
        <progress max={PROZENT} value={anteil} aria-label={t("maia.laedt")} />
        <p className="hinweis">
          {t("maia.laedtStand", {
            geladen: String(Math.round(zustand.geladen / MB)),
            gesamt: String(Math.round(zustand.gesamt / MB)),
          })}
        </p>
      </div>
    );
  }
  return (
    <>
      <button type="button" className="knopf" onClick={() => void lade()}>
        {t("maia.laden", { mb: String(PAKET_MB) })}
      </button>
      {zustand.art === "fehler" && (
        <p className="fehlertext" role="alert">
          {t("maia.fehler", { meldung: zustand.meldung })}
        </p>
      )}
    </>
  );
}

/**
 * Der Reiter „Bots“. `kurz`: ohne Überschrift, Erklärung und Lizenz, für den einmaligen Hinweis
 * beim ersten Bot (MaiaHinweis.tsx), der eigene Sätze hat.
 */
export function MaiaWahl({ kurz = false }: { kurz?: boolean } = {}) {
  const bereit = useMaiaBereit();
  const einstellungen = useEinstellungen();
  const [zustand, setze] = useState<Ladezustand>({ art: "ruhe" });
  const loesche = async () => {
    await loescheMaia();
    maiaFreigeben();
    await pruefeMaia();
  };
  return (
    <div className="maia-wahl" data-testid="maia-wahl">
      {!kurz && <h3 className="einstellung-name">{t("maia.titel")}</h3>}
      {!kurz && <p className="hinweis">{t("maia.erklaerung")}</p>}
      {bereit ? (
        <>
          <Auswahl
            name={t("maia.schalter")}
            werte={["an", "aus"] as const}
            gewaehlt={einstellungen.maia}
            text={(wert) => t(`maia.schalter.${wert}`)}
            beiWahl={(maia) => aendereEinstellungen({ maia })}
          />
          <p className="hinweis">{t("maia.abNaechsterPartie")}</p>
          <button type="button" className="knopf-zweit" onClick={() => void loesche()}>
            {t("maia.loeschen")}
          </button>
        </>
      ) : (
        <Laden zustand={zustand} setze={setze} />
      )}
      {!kurz && <p className="hinweis klein">{t("maia.lizenz")}</p>}
    </div>
  );
}
