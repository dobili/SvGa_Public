/**
 * Blatt „Neue Variante aus …“ mit den sieben Quellen als Kacheln.
 *
 * Rolle im Gesamtbild: Frage h (Empfehlung B, Bild h): Grundstellung, Abbildung, Partie, Stellung
 * aufbauen (vorhandener Stellungseditor), PGN/FEN einfügen, Fehlerdatenbank, Lernsammlung. Eine
 * Kachel öffnet ihre Unterseite (Neuquellen.tsx) im selben Blatt; „Grundstellung“ öffnet sofort.
 * Abhängigkeiten: spielstart/Blatt.tsx, spielstart/Stellungseditor.tsx, Neuquellen.tsx, lucide,
 * Navigation, i18n.
 */
import {
  BookOpen,
  BookmarkPlus,
  ClipboardPaste,
  Grid3x3,
  PencilRuler,
  Swords,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import { useNavigation } from "../../../app/navigationsKontext";
import { t } from "../../../i18n/sprache";
import { GRUNDSTELLUNG } from "../../../training/lernsammlung";
import { Blatt } from "../spielstart/Blatt";
import { Stellungseditor } from "../spielstart/Stellungseditor";
import { AbbildungWahl, EinfuegenWahl, EintragWahl, PartieWahl } from "./Neuquellen";
import { alsWert, varianteAnsicht } from "./variantenwert";
import { NEUQUELLEN, type Neuquelle } from "./variantentexte";

const SYMBOL = 26;

const SYMBOLE: Readonly<Record<Neuquelle, LucideIcon>> = {
  grund: Grid3x3,
  abbildung: BookOpen,
  partie: Swords,
  stellung: PencilRuler,
  einfuegen: ClipboardPaste,
  fehler: TriangleAlert,
  sammlung: BookmarkPlus,
};

/** Die Unterseite einer Quelle. */
function Unterseite({ quelle, zurueck }: { quelle: Neuquelle; zurueck: () => void }) {
  const { navigiere } = useNavigation();
  if (quelle === "abbildung") return <AbbildungWahl />;
  if (quelle === "partie") return <PartieWahl />;
  if (quelle === "einfuegen") return <EinfuegenWahl />;
  if (quelle === "fehler" || quelle === "sammlung") return <EintragWahl art={quelle} />;
  return (
    <Stellungseditor
      start={GRUNDSTELLUNG}
      beiUebernehmen={(fen) => navigiere(varianteAnsicht(alsWert({ art: "stellung", fen })))}
      beiAbbrechen={zurueck}
    />
  );
}

/** Die sieben Kacheln. */
function Kacheln({ beiWahl }: { beiWahl: (q: Neuquelle) => void }) {
  return (
    <ul className="neukacheln">
      {NEUQUELLEN.map((quelle) => {
        const Symbol = SYMBOLE[quelle];
        return (
          <li key={quelle}>
            <button type="button" className="neukachel" onClick={() => beiWahl(quelle)}>
              <Symbol size={SYMBOL} aria-hidden="true" />
              <span>{t(`varianten.neu.${quelle}`)}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Das Blatt. ``quelle`` null zeigt die Kacheln, sonst die Unterseite; ``setzeQuelle`` wechselt.
 * Beispiel: „Partie“ → Liste der Partien mit dem Schalter „Engine-Folgen übernehmen“.
 */
export function NeuBlatt({
  offen,
  quelle,
  setzeQuelle,
  schliessen,
}: {
  offen: boolean;
  quelle: Neuquelle | null;
  setzeQuelle: (q: Neuquelle | null) => void;
  schliessen: () => void;
}) {
  const { navigiere } = useNavigation();
  const waehle = (q: Neuquelle) => {
    if (q === "grund") navigiere(varianteAnsicht(alsWert({ art: "grund" })));
    else setzeQuelle(q);
  };
  const titel = quelle ? t(`varianten.neu.${quelle}`) : t("varianten.neu.titel");
  return (
    <Blatt
      titel={titel}
      offen={offen}
      schliessen={schliessen}
      testid="varianten-neu"
      kinder={
        quelle ? (
          <>
            <button type="button" className="knopf-link klein" onClick={() => setzeQuelle(null)}>
              {t("varianten.neu.andereQuelle")}
            </button>
            <Unterseite quelle={quelle} zurueck={() => setzeQuelle(null)} />
          </>
        ) : (
          <Kacheln beiWahl={waehle} />
        )
      }
    />
  );
}
