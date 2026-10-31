/**
 * Bildschirm „Steckbriefe“: die Eröffnungen des Buches als Baum ihrer ersten Züge, dazu die
 * Seiten „Steckbrief“ (eine Eröffnung vollständig) und „Fallenchecks“.
 *
 * Rolle im Gesamtbild: Wunsch des Autors vom 19.10.2026, Nachschlagen zu prüfen; seit 0.3.9 mit
 * Diagrammen (Paket F). Seit 31.10.2026 nach Entwurf H2 „Eröffnungsbaum“ (Wahl des Autors): Die
 * Eröffnungen hängen an ihren ersten Zügen (1. e4 → 1... c5 Sizilianisch …), mit kleinem Brett
 * je Eröffnung. Der Baum entsteht aus den Buchdaten (eroeffnungsbaum.ts); ein neuer Steckbrief
 * hängt sich von selbst ein. Ein Tipp öffnet den vollständigen Steckbrief wie bisher (Zeilen,
 * Schlussstellung der Hauptvariante, Abschnitt im Buch); die Fallenchecks haben eine eigene Seite.
 * Beide Seiten sind über die Liste ZUSATZANSICHTEN eingetragen (Kennungen „steckbrief“,
 * „fallenchecks“), der Router bleibt unverändert.
 * Regel 1: Inhalte kommen unverändert aus den Buchdaten.
 * Abhängigkeiten: daten, Navigation, Kopfzeile, Eroeffnungsbaum, steckbriefteile, i18n.
 */
import { ChevronRight, TriangleAlert } from "lucide-react";
import { useNavigation } from "../../app/navigationsKontext";
import type { Kapitel } from "../../daten/laden";
import { sprache, t } from "../../i18n/sprache";
import { Kopfzeile } from "../komponenten/rahmen/Kopfzeile";
import { useDaten } from "../komponenten/bausteine/useDaten";
import { Eroeffnungsbaum } from "../komponenten/nachschlagen/Eroeffnungsbaum";
import {
  baueBaum,
  kennzugfolge,
  zugbeschriftung,
} from "../komponenten/nachschlagen/eroeffnungsbaum";
import { abbildungMitNummer, schlussstellung } from "../komponenten/nachschlagen/steckbriefbild";
import {
  Falle,
  SteckbriefInhalt,
  type Steckbrief,
} from "../komponenten/nachschlagen/steckbriefteile";
import { ersteAbbildung, ladeAlleKapitel } from "../komponenten/nachschlagen/steckbriefdaten";

/** Kennungen der Seiten in ZUSATZANSICHTEN (app/zusatzansichten.ts). */
export const ANSICHT_STECKBRIEF = "steckbrief";
export const ANSICHT_FALLENCHECKS = "fallenchecks";

/** Größe der Symbole in der Karte „Fallenchecks“. */
const SYMBOLGROESSE = 24;

/** Lädt alle Kapitel und zeigt Laden oder Fehler; sonst den Inhalt. */
function MitKapiteln({ inhalt }: { inhalt: (kapitel: readonly Kapitel[]) => React.ReactNode }) {
  const kapitel = useDaten(ladeAlleKapitel, "alle-kapitel");
  if (kapitel.art === "laedt") return <p className="lade">…</p>;
  if (kapitel.art === "fehler") {
    return <p className="fehlertext">{t("buch.ladefehler", { fehler: kapitel.meldung })}</p>;
  }
  return <>{inhalt(kapitel.wert)}</>;
}

/** Die Karte, die zur Seite der Fallenchecks führt, mit ihrer Anzahl und ihren Kapiteln. */
function Fallenkarte({ kapitel }: { kapitel: readonly Kapitel[] }) {
  const { navigiere } = useNavigation();
  const mitFallen = kapitel.filter((k) => k.fallenchecks.length > 0);
  const anzahl = mitFallen.reduce((summe, k) => summe + k.fallenchecks.length, 0);
  if (anzahl === 0) return null;
  return (
    <button
      type="button"
      className="karte baum-fallen"
      data-tour="steckbrief-fallen"
      onClick={() => navigiere({ bildschirm: "zusatz", kennung: ANSICHT_FALLENCHECKS })}
    >
      <TriangleAlert size={SYMBOLGROESSE} aria-hidden="true" className="baum-fallen-symbol" />
      <span>
        <strong>{t("steckbrief.fallen")}</strong>
        <small>
          {t("nachschlagenneu.steckbriefe.fallenZusatz", {
            anzahl,
            kapitel: mitFallen.map((k) => k.kapitel).join(", "),
          })}
        </small>
      </span>
      <ChevronRight size={SYMBOLGROESSE} aria-hidden="true" />
    </button>
  );
}

/** Baum, Eröffnungen ohne Kennzugfolge (sollte es nicht geben) und Karte der Fallenchecks. */
function Uebersicht({ kapitel }: { kapitel: readonly Kapitel[] }) {
  const { navigiere } = useNavigation();
  const steckbriefe = kapitel.flatMap((k) => k.steckbriefe);
  const mitZuegen = steckbriefe.map((s) => ({
    zuege: kennzugfolge(s, schlussstellung(kapitel, s)) ?? [],
    wert: s,
  }));
  const ohne = mitZuegen.filter((e) => e.zuege.length === 0).map((e) => e.wert);
  const oeffne = (s: Steckbrief) =>
    navigiere({ bildschirm: "zusatz", kennung: ANSICHT_STECKBRIEF, wert: s.name });
  return (
    <>
      <p className="hinweis">
        {t("nachschlagenneu.steckbriefe.einleitung", { anzahl: steckbriefe.length })}
      </p>
      <h2 className="abschnitt-titel" data-tour="steckbrief-eroeffnungen">
        {t("steckbrief.eroeffnungen")}
      </h2>
      <Eroeffnungsbaum wurzeln={baueBaum(mitZuegen)} beiWahl={oeffne} />
      {ohne.length > 0 && (
        <>
          <h2 className="abschnitt-titel">{t("nachschlagenneu.steckbriefe.weitere")}</h2>
          <Eroeffnungsbaum
            wurzeln={[{ zuege: [], pfad: [], eintraege: ohne, kinder: [] }]}
            beiWahl={oeffne}
          />
        </>
      )}
      <Fallenkarte kapitel={kapitel} />
    </>
  );
}

/** Der Bildschirm „Steckbriefe“: die Eröffnungen als Baum, die Fallenchecks als Karte. */
export function Steckbriefe() {
  return (
    <div className="bildschirm">
      <Kopfzeile titel={t("steckbrief.titel")} zurueckText={t("nachschlagen.titel")} />
      <MitKapiteln inhalt={(kapitel) => <Uebersicht kapitel={kapitel} />} />
    </div>
  );
}

/** Kopf einer Steckbriefseite: Kennzugfolge in Gold. */
function Kennzuege({
  kapitel,
  steckbrief,
}: {
  kapitel: readonly Kapitel[];
  steckbrief: Steckbrief;
}) {
  const zuege = kennzugfolge(steckbrief, schlussstellung(kapitel, steckbrief));
  if (!zuege) return null;
  const text = zugbeschriftung({ zuege, pfad: zuege, eintraege: [], kinder: [] }, sprache());
  return <p className="steckbrief-kennzuege">{text}</p>;
}

/** Seite „Steckbrief“: eine Eröffnung vollständig. Wert: der Name wie in den Buchdaten. */
export function SteckbriefAnsicht({ wert }: { readonly wert: string | null }) {
  return (
    <div className="bildschirm">
      <Kopfzeile titel={wert ?? t("steckbrief.titel")} zurueckText={t("steckbrief.titel")} />
      <MitKapiteln
        inhalt={(kapitel) => {
          const steckbrief = kapitel.flatMap((k) => k.steckbriefe).find((s) => s.name === wert);
          if (!steckbrief) {
            return (
              <p className="fehlertext">
                {t("nachschlagenneu.steckbriefe.unbekannt", { name: wert ?? "" })}
              </p>
            );
          }
          return (
            <>
              <Kennzuege kapitel={kapitel} steckbrief={steckbrief} />
              <SteckbriefInhalt
                steckbrief={steckbrief}
                abbildung={ersteAbbildung(kapitel, steckbrief.abschnitt)}
                schluss={schlussstellung(kapitel, steckbrief)}
              />
            </>
          );
        }}
      />
    </div>
  );
}

/** Seite „Fallenchecks“: alle Fallenchecks des Buches zum Aufklappen. */
export function FallencheckAnsicht() {
  return (
    <div className="bildschirm">
      <Kopfzeile titel={t("steckbrief.fallen")} zurueckText={t("steckbrief.titel")} />
      <p className="hinweis">{t("nachschlagenneu.fallen.einleitung")}</p>
      <MitKapiteln
        inhalt={(kapitel) =>
          kapitel.flatMap((k) =>
            k.fallenchecks.map((f) => (
              <Falle key={f.name} falle={f} stoppbild={abbildungMitNummer(kapitel, f.stopp)} />
            )),
          )
        }
      />
    </div>
  );
}
