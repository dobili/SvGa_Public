/**
 * Ein Punkt der Aufgabenseite: Haken, Kennung, Text mit Links und eine Notiz.
 *
 * Rolle im Gesamtbild: Teil von ui/bildschirme/AutorAufgaben.tsx (Wunsch des Autors vom
 * 18.10.2026). Links im Text (Abbildung, Trainer, Spielen …) öffnen den Bildschirm; „Zurück“
 * führt wieder auf die Aufgabenseite, die dann zu diesem Punkt scrollt.
 * Abhängigkeiten: autor/verweise.ts, Navigation, i18n.
 */
import { useState } from "react";
import { useNavigation } from "../../../app/navigationsKontext";
import type { Aufgabenpunkt as Punkt } from "../../../autor/aufgabendatei";
import { textteile, type Trainername } from "../../../autor/verweise";
import { t } from "../../../i18n/sprache";

/** Ein Satz der Aufgabendatei mit Fettdruck und Links. */
export function Aufgabentext({
  text,
  namen,
  beiLink,
}: {
  text: string;
  namen: readonly Trainername[];
  beiLink?: () => void;
}) {
  const { navigiere } = useNavigation();
  return (
    <>
      {textteile(text, namen).map((teil, i) => {
        const inhalt = teil.fett ? <strong>{teil.text}</strong> : teil.text;
        const ziel = teil.ziel;
        if (!ziel) return <span key={i}>{inhalt}</span>;
        // Ein echter Link im Fließtext: Knöpfe brechen nicht mit dem Satz um.
        return (
          <a
            key={i}
            href="#aufgaben"
            className="aufgabenlink"
            onClick={(e) => {
              e.preventDefault();
              beiLink?.();
              navigiere(ziel);
            }}
          >
            {inhalt}
          </a>
        );
      })}
    </>
  );
}

/**
 * Ein Punkt der Aufgabenseite des Autors: Haken, Kennung, Text mit antippbaren Links und eine
 * eigene Notiz.
 */
export function Aufgabenpunkt({
  punkt,
  namen,
  erledigt,
  notiz,
  setzeHaken,
  setzeNotiz,
  merke,
}: {
  punkt: Punkt;
  namen: readonly Trainername[];
  erledigt: boolean;
  notiz: string;
  setzeHaken: (an: boolean) => void;
  setzeNotiz: (notiz: string) => void;
  /** Merkt den Punkt als zuletzt angetippt (vor einem Link). */
  merke: () => void;
}) {
  const [notizOffen, setzeNotizOffen] = useState(notiz !== "");
  return (
    <li
      className={erledigt ? "aufgabenpunkt aufgabenpunkt-erledigt" : "aufgabenpunkt"}
      id={`aufgabe-${punkt.id}`}
      data-testid={`aufgabe-${punkt.id}`}
    >
      <label className="aufgabenhaken">
        <input
          type="checkbox"
          checked={erledigt}
          onChange={(e) => setzeHaken(e.target.checked)}
          aria-label={t("autor.erledigt", { id: punkt.id })}
        />
        <strong>{punkt.id}</strong>
      </label>
      <div className="aufgabentext">
        <Aufgabentext text={punkt.text} namen={namen} beiLink={merke} />
        {notizOffen ? (
          <textarea
            className="textfeld"
            rows={2}
            aria-label={t("autor.notiz", { id: punkt.id })}
            placeholder={t("autor.notizPlatzhalter")}
            value={notiz}
            onChange={(e) => setzeNotiz(e.target.value)}
          />
        ) : (
          <button type="button" className="knopf-link klein" onClick={() => setzeNotizOffen(true)}>
            {t("autor.notizSchreiben")}
          </button>
        )}
      </div>
    </li>
  );
}
