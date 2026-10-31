/**
 * Kopf der Partie gegen einen Bot: Porträt mit Stufenmarke, Chip mit König für die eigene Farbe,
 * Chip mit Buch für den Eröffnungsmodus und ⓘ; die Beschreibung des Bots als Sprechblase nach
 * einem Tipp aufs Porträt.
 *
 * Rolle im Gesamtbild: Runde „Weniger Text“, Punkt P3 (Wahl des Autors, 31.10.2026). Vorher stand
 * neben dem Porträt der Satz des Bots (22 bis 26 Wörter) und darunter klein „Frau Schulz (Stufe 1 ·
 * Neuling) · du spielst Weiß · Eröffnung wie Menschen dieser Stärke“. Jetzt sagen Bildzeichen
 * dasselbe; die ganze Zeile steht im ⓘ, der Satz des Bots in der Sprechblase. Partie und
 * Auswertung zeigen denselben Kopf (Partieuntertitel.tsx). Die Chips tragen für Bildschirmleser
 * die vollen Angaben („du spielst Weiß“).
 * Abhängigkeiten: GegnerBild.tsx, Infoblase.tsx, lucide-react, i18n, Stil in ui/stil/partiekopf.css.
 */
import type { Color } from "chessops/types";
import { BookOpen, ChessKing } from "lucide-react";
import { useId, useState } from "react";
import { t } from "../../../i18n/sprache";
import type { EigenerGegner } from "../../../engine/gegner";
import "../../stil/partiekopf.css";
import { Blase, Infoknopf } from "../bausteine/Infoblase";
import { GegnerBild } from "../gegner/GegnerBild";

/** Größe der Zeichen in den Chips (Bildpunkte). */
const CHIPZEICHEN = 16;

/** Was der Kopf zeigt; die Texte rechnet Partieuntertitel.tsx aus. */
export interface Kopfangaben {
  readonly bot: string | null;
  readonly name: string;
  readonly eigene: readonly EigenerGegner[];
  /** Nummer der Stufe für die Marke am Porträt; null bei verschiedenen Stufen je Phase. */
  readonly stufennummer: number | null;
  readonly eigeneFarbe: Color;
  /** Ein Wort für den Eröffnungsmodus („Praxis“, „Buch“, „Gewählt“); null ohne Vorgabe. */
  readonly eroeffnungswort: string | null;
  /** Die volle Zeile von früher, für das ⓘ. */
  readonly zeile: string;
  /** Der Satz des Bots für die Sprechblase. */
  readonly beschreibung: string | null;
}

/** Das Porträt als Knopf mit Stufenmarke; ein Tipp öffnet die Sprechblase. */
function Portraetknopf({
  k,
  offen,
  blase,
  beiTipp,
}: {
  k: Kopfangaben;
  offen: boolean;
  blase: string;
  beiTipp: () => void;
}) {
  const marke = k.stufennummer !== null && (
    <span className="partiekopf-stufe" aria-hidden="true">
      {k.stufennummer}
    </span>
  );
  const bild = <GegnerBild bot={k.bot} eigene={k.eigene} name={k.name} />;
  if (!k.beschreibung)
    return (
      <span className="partiekopf-portraet">
        {bild}
        {marke}
      </span>
    );
  return (
    <button
      type="button"
      className="partiekopf-portraet"
      aria-expanded={offen}
      aria-controls={blase}
      aria-label={t("wenigertext.seiten.partie.portraet", { name: k.name })}
      data-testid="partiekopf-portraet"
      onClick={beiTipp}
    >
      {bild}
      {marke}
    </button>
  );
}

/** Die beiden Chips: eigene Farbe mit König, Eröffnungsmodus mit Buch. */
function Chips({ k }: { k: Kopfangaben }) {
  const farbe = t(k.eigeneFarbe === "white" ? "farbe.w" : "farbe.b");
  return (
    <span className="partiekopf-chips">
      <span
        className={`partiekopf-chip partiekopf-farbe-${k.eigeneFarbe}`}
        role="img"
        aria-label={t("wenigertext.seiten.partie.farbe", { farbe })}
      >
        <ChessKing size={CHIPZEICHEN} aria-hidden="true" />
        <span aria-hidden="true">{farbe}</span>
      </span>
      {k.eroeffnungswort && (
        <span
          className="partiekopf-chip"
          role="img"
          aria-label={t("wenigertext.seiten.partie.eroeffnung", { wort: k.eroeffnungswort })}
        >
          <BookOpen size={CHIPZEICHEN} aria-hidden="true" />
          <span aria-hidden="true">{k.eroeffnungswort}</span>
        </span>
      )}
    </span>
  );
}

/**
 * Der Kopf. Höchstens eine Blase ist offen: Sprechblase des Bots oder ⓘ.
 * Beispiel: Frau Schulz, Stufe 1, du spielst Weiß, Praxis → Porträt mit „1“, Chips „Weiß“ und
 * „Praxis“; Tipp aufs Porträt → „Frau Schulz spielt in der Mittagspause …“.
 */
export function Partiekopf({ angaben }: { angaben: Kopfangaben }) {
  const [offen, setzeOffen] = useState<"bot" | "info" | null>(null);
  const kennung = useId();
  const schalte = (art: "bot" | "info") => setzeOffen(offen === art ? null : art);
  return (
    <div className="partiekopf" data-testid="partie-gegnerzeile">
      <div className="partiekopf-zeile">
        <Portraetknopf
          k={angaben}
          offen={offen === "bot"}
          blase={kennung}
          beiTipp={() => schalte("bot")}
        />
        <Chips k={angaben} />
        <Infoknopf
          thema={t("wenigertext.seiten.partie.thema")}
          offen={offen === "info"}
          steuert={kennung}
          beiTipp={() => schalte("info")}
        />
      </div>
      {offen === "bot" && angaben.beschreibung && (
        <Blase id={kennung} links>
          <p className="partie-gegnerbeschreibung" data-testid="partiekopf-sprechblase">
            {t("wenigertext.seiten.partie.zitat", { text: angaben.beschreibung })}
          </p>
        </Blase>
      )}
      {offen === "info" && (
        <Blase id={kennung}>
          <p className="partie-untertitel">{angaben.zeile}</p>
        </Blase>
      )}
    </div>
  );
}
