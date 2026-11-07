/**
 * Das Clubtagebuch: laufende und erledigte Quests, Karten im Besitz, Clubnadeln
 * (Dokument 02, 3.2: das Menü hat mit der besten Freundin einen Erzähler; hier erst die Liste).
 *
 * Rolle im Gesamtbild: React-Overlay über der Welt (Entscheidung C4). Zeigt je Quest den
 * nächsten Schritt aus den Questdaten (regeln/quests.ts, naechsterSchritt). Die Zurück-Taste
 * schließt es.
 * Abhängigkeiten: regeln/quests.ts, texte/texte.ts, app/blattstapel.ts.
 */
import { useZurueckSchliesst } from "../../app/blattstapel";
import type { Spieldaten } from "../daten/laden";
import { naechsterSchritt } from "../regeln/quests";
import type { Abenteuerstand } from "../schnittstelle/spielstand";
import { tSpiel } from "../texte/texte";

export function Tagebuch({
  stand,
  daten,
  beiSchliessen,
}: {
  readonly stand: Abenteuerstand;
  readonly daten: Spieldaten;
  readonly beiSchliessen: () => void;
}) {
  useZurueckSchliesst(true, beiSchliessen);
  const laufend = stand.quests.filter((q) => !q.erledigt);
  const erledigt = stand.quests.filter((q) => q.erledigt);
  const questdaten = (kennung: string) => daten.quests.find((q) => q.kennung === kennung);
  return (
    <section
      className="abenteuer-menue abenteuer-tagebuch"
      role="dialog"
      aria-label={tSpiel("tagebuch.titel")}
      data-testid="abenteuer-tagebuch"
    >
      <h2>{tSpiel("tagebuch.titel")}</h2>
      <h3>{tSpiel("tagebuch.laufend")}</h3>
      {laufend.length === 0 && <p>{tSpiel("tagebuch.nichtsOffen")}</p>}
      <ul>
        {laufend.map((q) => {
          const quest = questdaten(q.kennung);
          const schritt = quest ? naechsterSchritt(quest, q) : null;
          return (
            <li key={q.kennung}>
              <strong>{tSpiel(quest?.titel ?? q.kennung)}</strong>
              {schritt && <span> – {tSpiel(schritt)}</span>}
            </li>
          );
        })}
      </ul>
      {erledigt.length > 0 && (
        <>
          <h3>{tSpiel("tagebuch.erledigt")}</h3>
          <ul>
            {erledigt.map((q) => (
              <li key={q.kennung}>{tSpiel(questdaten(q.kennung)?.titel ?? q.kennung)}</li>
            ))}
          </ul>
        </>
      )}
      <h3>{tSpiel("tagebuch.nadeln")}</h3>
      {stand.clubs.filter((c) => c.nadel).length === 0 ? (
        <p>{tSpiel("tagebuch.keineNadeln")}</p>
      ) : (
        <ul>
          {stand.clubs
            .filter((c) => c.nadel)
            .map((c) => {
              const ort = daten.orte.find((o) => o.kennung === c.kennung);
              return (
                <li key={c.kennung}>
                  {tSpiel(ort?.club?.name ?? c.kennung)}: {tSpiel(`nadel.${c.nadel ?? "bronze"}`)}
                </li>
              );
            })}
        </ul>
      )}
      <h3>{tSpiel("tagebuch.karten")}</h3>
      {stand.karten.length === 0 ? (
        <p>{tSpiel("tagebuch.keineKarten")}</p>
      ) : (
        <ul>
          {stand.karten.map((k) => {
            const sorte = daten.karten.find((s) => s.kennung === k.kennung);
            return (
              <li key={k.kennung}>
                {tSpiel(sorte?.name ?? k.kennung)}
                {k.anzahl > 1 && ` × ${k.anzahl}`}
              </li>
            );
          })}
        </ul>
      )}
      <button type="button" className="knopf-haupt" onClick={beiSchliessen}>
        {tSpiel("tagebuch.schliessen")}
      </button>
    </section>
  );
}
