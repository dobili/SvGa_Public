/**
 * Das Bild eines Gegners: Porträt eines vorgefertigten Bots, das gewählte Porträt eines eigenen
 * Bots (seit 0.2.99) oder sein Anfangsbuchstabe; dazu Siegmarken, wenn der Leser ihn schon in
 * einer gewerteten Partie besiegt hat: seit 25.10.2026 je Zeitklasse ein eigenes Zeichen (Blitz,
 * Stoppuhr, Kaffeetasse wie in der Bedenkzeit-Auswahl), bis zu drei zugleich (Wunsch des Autors).
 *
 * Rolle im Gesamtbild: Gemeinsamer Baustein für Gegnerwahl (Kacheln und Sprechblase), Editor der
 * eigenen Gegner und Partienliste (Wunsch des Autors, 19.10.2026). Bis 25.10.2026 war es ein Stern
 * nur für die Zeitklasse der gewählten Uhr; jetzt sieht man alle Zeitklassen auf einen Blick.
 * Abhängigkeiten: engine/gegner.ts, gegnerportraet.ts, zeitartzeichen.ts, i18n.
 */
import { gegnerVon, type EigenerGegner } from "../../../engine/gegner";
import { gruppenstufe } from "../../../engine/gruppe";
import { Gruppenbild } from "./Gruppenmodus";
import { t } from "../../../i18n/sprache";
import type { Wertungstempo } from "../../../spiel/elomodell";
import { svgAdresse } from "../../../speicher/profil";
import { portraet } from "./gegnerportraet";
import { ZEITARTZEICHEN, zeitartenText } from "../bausteine/zeitartzeichen";

/** Größe eines Zeichens in der Siegmarke am Porträt (Bildpunkte). */
const ZEICHENGROESSE = 11;

/**
 * Die Siegmarken unten rechts am Porträt, eine je Zeitklasse; für Bildschirmleser ein Bild mit
 * dem Namen „Gewertet besiegt in Blitz und Klassisch“.
 */
function Siegmarken({ tempi }: { tempi: readonly Wertungstempo[] }) {
  if (tempi.length === 0) return null;
  const name = t("spielen.bot.besiegtIn", { zeitarten: zeitartenText(tempi) });
  return (
    <span className="gegner-besiegt" role="img" aria-label={name} title={name}>
      {tempi.map((tempo) => {
        const Zeichen = ZEITARTZEICHEN[tempo];
        return (
          <span key={tempo} className="gegner-siegmarke" data-tempo={tempo}>
            <Zeichen size={ZEICHENGROESSE} aria-hidden="true" />
          </span>
        );
      })}
    </span>
  );
}

/**
 * Bild eines Gegners. `bot`: Kennung (vorgefertigt oder eigen); `name`: für den
 * Anfangsbuchstaben, wenn es kein Bild gibt; `besiegtIn`: Zeitklassen der gewerteten Siege
 * (speicher/besiegt.ts, besiegtIn), je eine Marke unten rechts.
 * Beispiel: <GegnerBild bot="lotta" eigene={[]} name="Lotta" besiegtIn={["blitz"]} /> → Lottas
 * Porträt mit dem Blitz-Zeichen.
 */
export function GegnerBild({
  bot,
  eigene,
  name,
  besiegtIn = [],
}: {
  bot: string | null;
  eigene: readonly EigenerGegner[];
  name: string;
  besiegtIn?: readonly Wertungstempo[];
}) {
  const vorgefertigt = gegnerVon(bot);
  const eigener = eigene.find((g) => g.kennung === bot);
  // Seit 0.2.140 kann ein eigener Bot ein selbst gebautes Porträt tragen (Baukasten).
  const gebaut = vorgefertigt ? null : (eigener?.portraetBau ?? null);
  const bild = vorgefertigt ? vorgefertigt.kennung : (eigener?.portraet ?? null);
  // Gruppenmodus (Wunsch des Autors, 24.10.2026): die Gesichter der Stufe statt eines Porträts.
  const gruppe = gruppenstufe(bot);
  return (
    <span className="gegnerbild">
      {gruppe !== null ? (
        <Gruppenbild stufe={gruppe} />
      ) : gebaut ? (
        <img className="gegner-portraet" src={svgAdresse(gebaut.svg)} alt="" />
      ) : bild ? (
        <img className="gegner-portraet" src={portraet(bild)} alt="" />
      ) : (
        <span className="gegner-portraet gegner-zeichen" aria-hidden="true">
          {name.slice(0, 1)}
        </span>
      )}
      <Siegmarken tempi={besiegtIn} />
    </span>
  );
}
