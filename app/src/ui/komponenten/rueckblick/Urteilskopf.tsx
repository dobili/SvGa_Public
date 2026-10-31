/**
 * Kopf der Rückblickkarte: Zeichen der Zugklasse, der Zug, eine farbige Marke („Bester Zug“) und
 * die Veränderung der Bewertung als Pfeil mit Zahl („▲ 0,1“), dazu ⓘ.
 *
 * Rolle im Gesamtbild: Runde „Weniger Text“, Punkt P13 (Wahl des Autors, 31.10.2026). Vorher stand
 * „7… De7 war der beste Zug. Bewertung +1,5 → +1,6.“ als Satz da. Notiz des Autors (gilt überall):
 * Eine Veränderung der Bewertung zeigt man als Pfeil mit Zahl (▲ grün, ▼ rot), nicht als Balken
 * mit Zahlen links und rechts. Die Veränderung gilt aus Sicht der Seite, die gezogen hat: ▲ heißt,
 * ihr Zug hat ihre Stellung verbessert, ▼, er hat sie verschlechtert (wie „▼ 11,6“ bei der
 * Falle). Der Satz zum Urteil, „Bewertung +1,5 → +1,6.“ und die Erklärung des Bewertungsbalkens
 * stehen vollständig im ⓘ; Sätze mit mehr Inhalt (besserer Zug, Gewinnchance) bleiben sichtbar
 * (Rueckblickkarte.tsx).
 * Abhängigkeiten: spiel/auswertung.ts, spiel/rueckblick.ts, Auswertungssymbole, Infoblase, i18n,
 * Stil in ui/stil/wenigertext-seiten.css.
 */
import { useId, useState, type ReactNode } from "react";
import { t } from "../../../i18n/sprache";
import type { Zugklasse } from "../../../spiel/auswertung";
import { balkentext } from "../../../spiel/rueckblick";
import { Klassenmarke } from "../auswertung/Auswertungssymbole";
import { Blase, Infoknopf } from "../bausteine/Infoblase";
import { aenderungstext } from "./urteilsanzeige";

/** Pfeil mit Zahl; der Name für Bildschirmleser nennt beide Bewertungen. */
function Aenderung({
  vorher,
  nachher,
  weissZog,
}: {
  vorher: number;
  nachher: number;
  weissZog: boolean;
}) {
  const { pfeil, text } = aenderungstext(vorher, nachher, weissZog);
  return (
    <span
      className={`bewertungsaenderung bewertungsaenderung-${pfeil}`}
      role="img"
      aria-label={t("rueckblick.bewertung", {
        vorher: balkentext(vorher),
        nachher: balkentext(nachher),
      })}
      data-testid="bewertungsaenderung"
    >
      {text}
    </span>
  );
}

/**
 * Der Kopf. `satz`: der Satz zum Urteil (oder die Theorieangabe), `satzSichtbar`: ob er auch
 * unter dem Kopf steht. Beispiel: 7… De7, bester Zug, +1,5 → +1,6 nach Zug von Schwarz →
 * Stern, „7… De7“, Marke „Bester Zug“, „▼ 0,1“; im ⓘ „7… De7 war der beste Zug. Bewertung …“.
 */
export function Urteilskopf({
  zug,
  klasse,
  vorher,
  nachher,
  weissZog,
  satz,
  satzSichtbar,
}: {
  zug: string;
  klasse: Zugklasse;
  vorher: number;
  nachher: number;
  weissZog: boolean;
  satz: ReactNode;
  satzSichtbar: boolean;
}) {
  const [offen, setzeOffen] = useState(false);
  const kennung = useId();
  return (
    <div className="urteilskopf-huelle">
      <div className="urteilskopf">
        <Klassenmarke klasse={klasse} />
        <strong className="urteilskopf-zug">{zug}</strong>
        <span className={`urteilsmarke urteilsmarke-${klasse}`}>
          {t(`zugklasse.kurz.${klasse}`)}
        </span>
        <Aenderung vorher={vorher} nachher={nachher} weissZog={weissZog} />
        <Infoknopf
          thema={t("rueckblick.balkenThema")}
          offen={offen}
          steuert={kennung}
          beiTipp={() => setzeOffen(!offen)}
        />
      </div>
      {offen && (
        <Blase id={kennung}>
          {!satzSichtbar && <p>{satz}</p>}
          <p>
            {t("rueckblick.bewertung", {
              vorher: balkentext(vorher),
              nachher: balkentext(nachher),
            })}
          </p>
          <p className="leise">{t("rueckblick.balkenInfo")}</p>
        </Blase>
      )}
      {satzSichtbar && <p className="rueckblick-urteil">{satz}</p>}
    </div>
  );
}
