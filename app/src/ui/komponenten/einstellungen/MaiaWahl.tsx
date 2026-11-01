/**
 * Reiter „Bots“ der Einstellungen: das Maia-Zusatzpaket laden, ein- und ausschalten, löschen
 * (Entscheidung des Autors 25.10.2026: Komplettpaket, in den Einstellungen ausschaltbar).
 *
 * Rolle im Gesamtbild: Maia-2 lässt die Bots Züge wählen, die Menschen ihrer Stärke wirklich
 * spielen (engine/maia.ts). Das Paket (etwa 96 MB) gehört nicht zur Installation; hier lädt der
 * Leser es auf Wunsch (app/maiapaket.ts), mit Fortschritt und Fehlermeldung. Danach schaltet ein
 * Schalter Maia an und aus; er gilt ab der nächsten Partie (Partieeinstellung „maia“).
 * Weniger Text P15 (31.10.2026): Erklärung und Lizenz im ⓘ, der Ladeknopf kompakt im Kopf.
 * Abhängigkeiten: Infoblase, app/maiapaket.ts, app/einstellungen.ts, engine/maia-web.ts, maiastand.ts,
 * maialadezustand.ts, i18n.
 */
import { Download, UserRound } from "lucide-react";
import { useState, type ReactNode } from "react";
import { aendereEinstellungen, useEinstellungen } from "../../../app/einstellungen";
import { ladeMaia, loescheMaia, pruefeMaia } from "../../../app/maiapaket";
import { maiaFreigeben } from "../../../engine/maia-web";
import { t } from "../../../i18n/sprache";
import { Auswahl } from "../bausteine/Auswahl";
import "../../stil/einleitungen.css";
import { MitInfoblase } from "../bausteine/Infoblase";
import { useMaiaBereit } from "./maiastand";
import { zustandNachFehler, type Ladezustand } from "./maialadezustand";

const PROZENT = 100;
// Dezimale Megabyte wie die Angabe im Knopf (vorher MiB: „96 MB“ im Knopf, „91 MB“ beim Laden).
const MB = 1000 * 1000;
/** Größe des Pakets für den Text vor dem Laden (zwei Netze zu 42 MB und die Laufzeit). */
const PAKET_MB = 96;
/** Größe der Zeichen im Kopf (Bildpunkte). */
const LADEZEICHEN = 18;

/** Lädt das Paket und meldet den Stand über `setze`. */
async function ladePaket(setze: (z: Ladezustand) => void) {
  setze({ art: "laedt", geladen: 0, gesamt: PAKET_MB * MB });
  try {
    await ladeMaia((geladen, gesamt) => setze({ art: "laedt", geladen, gesamt }));
    await pruefeMaia();
    setze({ art: "ruhe" });
  } catch (fehler) {
    console.warn("Maia nicht geladen:", fehler);
    setze(zustandNachFehler(fehler, typeof navigator === "undefined" || navigator.onLine));
  }
}

/**
 * Der Knopf zum Laden; `kompakt` (Weniger Text P15): nur „⬇ 96 MB“ in der Kopfzeile, der volle
 * Name „Maia laden (etwa 96 MB)“ bleibt für Bildschirmleser.
 */
function Ladeknopf({ kompakt, setze }: { kompakt: boolean; setze: (z: Ladezustand) => void }) {
  const name = t("maia.laden", { mb: String(PAKET_MB) });
  return (
    <button
      type="button"
      className={kompakt ? "knopf-haupt maia-ladeknopf" : "knopf-haupt"}
      aria-label={kompakt ? name : undefined}
      onClick={() => void ladePaket(setze)}
    >
      {kompakt && <Download size={LADEZEICHEN} aria-hidden="true" />}
      {kompakt ? t("wenigertext.seiten.maia.groesse", { mb: String(PAKET_MB) }) : name}
    </button>
  );
}

/** Fortschritt beim Laden oder die Fehlermeldung; in Ruhe nichts. */
function Ladestand({ zustand }: { zustand: Ladezustand }) {
  if (zustand.art === "fehler" || zustand.art === "ohneNetz")
    return (
      <p className="fehlertext" role="alert">
        {zustand.art === "ohneNetz"
          ? t("maia.ohneNetz")
          : t("maia.fehler", { meldung: zustand.meldung })}
      </p>
    );
  if (zustand.art !== "laedt") return null;
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

/**
 * Kopf des Reiters (Weniger Text P15, 31.10.2026): Zeichen, Titel, Ladeknopf „⬇ 96 MB“ und ⓘ;
 * Erklärung und Lizenzzeile stehen vollständig in der Blase.
 */
function Kopf({ knopf }: { knopf: ReactNode }) {
  return (
    <MitInfoblase
      zeile={
        <div className="maia-kopf">
          <UserRound className="titel-symbol" size={LADEZEICHEN} aria-hidden="true" />
          <h3 className="einstellung-name">{t("maia.titel")}</h3>
          {knopf}
        </div>
      }
      thema={t("maia.titel")}
      erklaerung={
        <>
          <p>{t("maia.erklaerung")}</p>
          <p className="leise">{t("maia.lizenz")}</p>
        </>
      }
    />
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
  const knopf = !bereit && zustand.art !== "laedt" && <Ladeknopf kompakt={!kurz} setze={setze} />;
  return (
    <div className="maia-wahl" data-testid="maia-wahl">
      {!kurz && <Kopf knopf={knopf} />}
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
        <>
          {kurz && knopf}
          <Ladestand zustand={zustand} />
        </>
      )}
    </div>
  );
}
