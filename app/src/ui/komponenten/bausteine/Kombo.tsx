/**
 * Kombo am Brettrand (Gamifizierung P10 a): ab drei richtigen Antworten in Folge ein kleines
 * Abzeichen „3 in Folge“, bei fünf und zehn ein kurzes Funkeln, dazu (wenn der Ton an ist) ein
 * kurzer Ton, je Antwort einen Halbton höher.
 *
 * Rolle im Gesamtbild: Der Rundenrahmen (ui/trainer/Rundenrahmen.tsx) zeigt die Kombo für jeden
 * Trainer; die Regeln (Stufen, Tonhöhe) stehen in training/kombo.ts. Das Funkeln fragt den Schalter
 * „Feiereffekte“ (app/feiereffekte.ts); „Bewegung reduzieren“ des Geräts nimmt es ebenfalls weg
 * (ui/stil/kombo.css). Ein Fehler beendet die Kombo leise: Das Abzeichen verschwindet ohne Meldung.
 * Abhängigkeiten: training/kombo.ts, app/ton.ts, app/feiereffekte.ts, app/einstellungen.ts, i18n.
 */
import { useEffect, type CSSProperties } from "react";
import { useEinstellungen } from "../../../app/einstellungen";
import { feiereffekteAn } from "../../../app/feiereffekte";
import { spieleKomboton } from "../../../app/ton";
import { t } from "../../../i18n/sprache";
import { komboFunkelt, komboHalbtoene, komboSichtbar } from "../../../training/kombo";

/** Funken des Funkelns rund um das Abzeichen. */
const FUNKEN = 8;

/**
 * Das Abzeichen der Kombo; unter drei in Folge nichts.
 * Eingabe: richtige Antworten in Folge. Beispiel: folge 5 → „5 in Folge“ mit Funkeln.
 */
export function Kombo({ folge }: { folge: number }) {
  const { ton } = useEinstellungen();
  useEffect(() => {
    const halbtoene = komboHalbtoene(folge);
    if (ton === "an" && halbtoene !== null) spieleKomboton(halbtoene);
  }, [folge, ton]);
  if (!komboSichtbar(folge)) return null;
  const funkeln = komboFunkelt(folge) && feiereffekteAn();
  return (
    // Der Schlüssel lässt das Abzeichen bei jeder weiteren Antwort kurz aufspringen.
    <span key={folge} className="kombo" data-testid="kombo">
      {t("kombo.inFolge", { anzahl: folge })}
      {funkeln && (
        <span className="kombo-funkeln" aria-hidden="true">
          {Array.from({ length: FUNKEN }, (_, i) => (
            <span key={i} className="kombo-funke" style={{ "--i": i } as CSSProperties} />
          ))}
        </span>
      )}
    </span>
  );
}
