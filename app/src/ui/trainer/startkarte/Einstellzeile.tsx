/**
 * Eine Zeile unter „Deine Runde“: Zeichen, Name, gewählter Wert; Antippen öffnet die Auswahl.
 *
 * Rolle im Gesamtbild: Teil der Startkarte (Entwurf G1). Kurze Wahlen (Stufe, Seite, Quelle)
 * klappen unter der Zeile als Chips auf, mit der Erklärung der Werte darunter. Lange Wahlen
 * (Motive, Eröffnungen, Partien) öffnen die gewohnte Auswahl des Systems: Wunsch des Autors vom
 * 19.10.2026, statt langer Chipreihen eine Liste (früher Auswahlliste.tsx). Dafür liegt eine
 * unsichtbare Auswahlliste über der ganzen Zeile.
 * Abhängigkeiten: lucide-react, einstellung.ts.
 */
import {
  BookOpen,
  ChevronRight,
  Contrast,
  Crosshair,
  Layers,
  Library,
  ListChecks,
  ScrollText,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useId, useState } from "react";
import { optionstext, type Einstellung, type Zeilensymbol } from "./einstellung";

/** Ab so vielen Werten öffnet die Zeile die Auswahl des Systems statt Chips. */
const HOECHSTENS_CHIPS = 6;
/** Größe der Zeichen in den Zeilen (Bildpunkte). */
const ZEICHENGROESSE = 20;

/** Das Bild je Zeichen; ein neues Zeichen trägt hier eine Zeile ein. */
const ZEILENBILDER: Readonly<Record<Zeilensymbol, LucideIcon>> = {
  quelle: BookOpen,
  thema: Zap,
  stufe: Crosshair,
  uebung: ListChecks,
  seite: Contrast,
  eroeffnung: Library,
  gruppe: Layers,
  partie: ScrollText,
};

/** Zeichen, Name und Wert einer Zeile (gemeinsam für beide Arten). */
function Zeileninhalt({ zeile, offen }: { zeile: Einstellung; offen: boolean }) {
  const Bild = ZEILENBILDER[zeile.symbol];
  return (
    <>
      <Bild className="startzeile-zeichen" size={ZEICHENGROESSE} aria-hidden="true" />
      <span className="startzeile-name">{zeile.titel}</span>
      <span className="startzeile-wert">{optionstext(zeile)}</span>
      <ChevronRight
        className={offen ? "startzeile-pfeil offen" : "startzeile-pfeil"}
        size={ZEICHENGROESSE}
        aria-hidden="true"
      />
    </>
  );
}

/** Lange Wahl: Die ganze Zeile öffnet die Auswahl des Systems. */
function Listenzeile({ zeile }: { zeile: Einstellung }) {
  return (
    <label className="startzeile startzeile-liste" data-testid={zeile.testkennung}>
      <Zeileninhalt zeile={zeile} offen={false} />
      <select
        className="startzeile-auswahl"
        aria-label={zeile.titel}
        value={zeile.wert}
        onChange={(e) => zeile.setze(e.target.value)}
      >
        {zeile.optionen.map((o) => (
          <option key={o.wert} value={o.wert}>
            {o.text}
          </option>
        ))}
      </select>
    </label>
  );
}

/** Kurze Wahl: Die Zeile klappt Chips auf; eine Wahl klappt sie wieder zu. */
function Chipzeile({ zeile }: { zeile: Einstellung }) {
  const [offen, setzeOffen] = useState(false);
  const kennung = useId();
  return (
    <div className="startzeile-block" data-testid={zeile.testkennung}>
      <button
        type="button"
        className="startzeile"
        aria-expanded={offen}
        aria-controls={kennung}
        onClick={() => setzeOffen(!offen)}
      >
        <Zeileninhalt zeile={zeile} offen={offen} />
      </button>
      {offen && (
        <div id={kennung} className="startzeile-wahl" role="group" aria-label={zeile.titel}>
          <div className="startzeile-chips">
            {zeile.optionen.map((o) => (
              <button
                key={o.wert}
                type="button"
                className="chip"
                aria-pressed={o.wert === zeile.wert}
                onClick={() => {
                  zeile.setze(o.wert);
                  setzeOffen(false);
                }}
              >
                {o.text}
              </button>
            ))}
          </div>
          {zeile.erklaerung && <p className="hinweis">{zeile.erklaerung}</p>}
        </div>
      )}
    </div>
  );
}

/**
 * Eine Einstellzeile der Startkarte; wählt je nach Zahl der Werte Chips oder die Systemliste.
 *
 * Beispiel: Taktiktrainer, „Stufe: alle Stufen“ → Chips „alle, 1, 2, 3, 4, 5“; „Motiv:
 * Gemischt (674)“ → Systemliste mit allen Motiven.
 */
export function Einstellzeile({ zeile }: { zeile: Einstellung }) {
  return zeile.optionen.length > HOECHSTENS_CHIPS ? (
    <Listenzeile zeile={zeile} />
  ) : (
    <Chipzeile zeile={zeile} />
  );
}
