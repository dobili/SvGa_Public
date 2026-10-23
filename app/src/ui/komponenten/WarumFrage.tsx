/**
 * Warum-Fragen zur Stellung oder zum nächsten Buchzug, mit Antwortauswahl (Art V, AP 14).
 *
 * Rolle im Gesamtbild: Pflichtenheft 3 „Warum-Fragen mit Antwortauswahl“ für Buchstellungen.
 * Wunsch des Autors nach dem Test von 0.2.26: Die Fragen erscheinen erst, wenn die Abbildung als
 * angesehen gilt (30 Sekunden oder Haken in der Kapitelübersicht), und zugeklappt; sie stehen
 * unter den Kacheln des gewählten Werkzeugs. Nach der Wahl zeigt die Karte, ob die Antwort
 * stimmt, die richtige Antwort und eine kurze Erklärung.
 * Abhängigkeiten: analyse/warumfragen.ts, speicher (angesehen), i18n.
 */
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { istRichtig, warumFragen, type Frage, type Vorbereitet } from "../../analyse/warumfragen";
import type { Abbildung } from "../../daten/laden";
import { t } from "../../i18n/sprache";
import { notiereWarumfrage } from "../../speicher/fortschritt";
import { aendere, useSpeicher } from "../../speicher/speicher";

/** Größe des Pfeils, der zeigt, dass sich die Frage aufklappen lässt. */
const PFEILGROESSE = 20;

/**
 * Kennzeichen eines Entwurfs, der noch nicht vom Autor freigegeben ist (nur in Datenständen mit
 * Entwürfen). Freigegebene Fragen tragen seit 0.2.33 kein Kennzeichen mehr (Wunsch des Autors,
 * 16.10.2026: „vorbereitet“ sagte dem Leser nichts).
 */
function Entwurfsplakette() {
  return <span className="plakette-entwurf">{t("vorbereitet.entwurf")}</span>;
}

/** Beispiel: Abb. 1.26, „Warum ist 6. Ld3 ungenau?“ mit drei Antworten, zugeklappt. */
function WarumFrage({
  frage,
  entwurf,
  schonBeantwortet = false,
  beiAntwort,
}: {
  frage: Frage;
  entwurf: boolean;
  /** Früher schon beantwortet (0.2.99): Der Kopf trägt dann „beantwortet“. */
  schonBeantwortet?: boolean;
  /** Meldet die Antwort an den Fortschritt (nur an Abbildungen, 0.2.99). */
  beiAntwort?: () => void;
}) {
  const [gewaehlt, setzeGewaehlt] = useState<number | null>(null);
  const beantwortet = gewaehlt !== null;
  const klasse = (stelle: number) => {
    if (!beantwortet) return "antwort";
    if (stelle === frage.richtig) return "antwort antwort-richtig";
    return stelle === gewaehlt ? "antwort antwort-falsch" : "antwort";
  };
  return (
    <details className="karte warum-frage" data-testid="warum-frage" data-tour="warumfragen">
      <summary className="karte-kopf">
        <h2>
          {frage.zug
            ? t("vorbereitet.frageTitel", { zug: frage.zug })
            : t("vorbereitet.frageStellung")}
        </h2>
        {entwurf && <Entwurfsplakette />}
        {schonBeantwortet && gewaehlt === null && (
          <span className="plakette-beantwortet">{t("vorbereitet.beantwortet")}</span>
        )}
        <ChevronDown className="aufklapper" size={PFEILGROESSE} aria-hidden="true" />
      </summary>
      <p>{frage.frage}</p>
      <div className="antworten" role="group" aria-label={frage.frage}>
        {frage.antworten.map((antwort, stelle) => (
          <button
            key={antwort}
            type="button"
            className={klasse(stelle)}
            disabled={beantwortet}
            aria-pressed={gewaehlt === stelle}
            onClick={() => {
              setzeGewaehlt(stelle);
              beiAntwort?.();
            }}
          >
            {antwort}
          </button>
        ))}
      </div>
      {beantwortet && (
        <p className="fazit" role="status">
          {t(istRichtig(frage, gewaehlt) ? "vorbereitet.richtig" : "vorbereitet.falsch")}{" "}
          {frage.erklaerung}
        </p>
      )}
    </details>
  );
}

/**
 * Die Warum-Fragen vorbereiteter Texte ohne Bedingung, etwa in einem Trainer nach der Antwort
 * (W9, W10). Beispiel: Faktorenbilanz-Trainer an Abb. 3.2 → „Warum spielt Weiß 3. Sf3?“.
 */
export function WarumFragenListe({
  vorbereitet,
  nur,
}: {
  vorbereitet: Vorbereitet | undefined;
  /** Nur die Frage zu diesem Zug (deutsche Kurznotation wie in den Daten), sonst alle. */
  nur?: string;
}) {
  if (!vorbereitet) return null;
  const entwurf = vorbereitet.status === "entwurf";
  const fragen = warumFragen(vorbereitet).filter((f) => nur === undefined || f.zug === nur);
  return (
    <>
      {fragen.map((frage) => (
        <WarumFrage key={frage.frage} frage={frage} entwurf={entwurf} />
      ))}
    </>
  );
}

/**
 * Die Warum-Fragen der Abbildung, deren Stellung gerade auf dem Brett steht, sobald sie als
 * angesehen gilt; sonst nichts.
 *
 * Eingabe: die Abbildung auf dem Brett (null, wenn der Leser eigene Züge gemacht hat).
 * Beispiel: Abb. 1.26 nach 30 Sekunden → „Warum-Frage zu 6. Ld3“, zugeklappt.
 */
export function WarumFragen({ hier }: { hier: Abbildung | null }) {
  const id = hier?.id;
  const gesehen = useSpeicher((zustand) =>
    id ? zustand.daten.fortschritt.gesehen[id] !== undefined : false,
  );
  const beantwortet = useSpeicher((zustand) =>
    id ? zustand.daten.fortschritt.warum[id] : undefined,
  );
  const vorbereitet = hier?.vorbereitet;
  if (!hier || !vorbereitet || !gesehen) return null;
  const entwurf = vorbereitet.status === "entwurf";
  return (
    <>
      {warumFragen(vorbereitet).map((frage, stelle) => (
        <WarumFrage
          key={`${hier.id} ${frage.frage}`}
          frage={frage}
          entwurf={entwurf}
          schonBeantwortet={beantwortet?.includes(stelle) ?? false}
          beiAntwort={() => void aendere((d) => notiereWarumfrage(d, hier.id, stelle))}
        />
      ))}
    </>
  );
}
