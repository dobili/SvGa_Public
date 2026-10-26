/**
 * Anzeige einer Schachuhr über oder unter dem Brett (Bildschirmentwurf „Partie“).
 *
 * Rolle im Gesamtbild: Zeigt, wer auf dieser Seite spielt, und die Restzeit; die laufende Uhr hat
 * einen goldenen Streifen, unter zehn Sekunden erscheint die Zeit rot. Seit 0.2.129 (Vorschlag
 * DS42, vom Autor am 25.10.2026 freigegeben) steht beim Gegner sein Porträt, sein Name und seine
 * Stufenmarke statt „Engine“, auf beiden Seiten ein Kreis in der Farbe der Steine. Die Zeit
 * rechnet spiel/uhr.ts.
 * Abhängigkeiten: spiel/uhr.ts, engine/gegner.ts, GegnerBild, Stufenmarke, speicher, i18n.
 */
import { gegnername } from "../../engine/gegner";
import { t } from "../../i18n/sprache";
import type { Farbe } from "../../schach/stellung";
import type { Partie } from "../../spiel/partie";
import { restzeit, zeitAlsText, type Uhrstand } from "../../spiel/uhr";
import { useSpeicher } from "../../speicher/speicher";
import { GegnerBild } from "./GegnerBild";
import { Spielerbild } from "../profil/Spielerbild";
import { spielername, useSpielerprofil } from "../profil/spieler";
import { Stufenmarke } from "./Stufenmarke";

/** Ab dieser Restzeit wird die Uhr rot. */
const KNAPP_MS = 10_000;

/**
 * Wer auf dieser Seite spielt: Porträt, Name und Stufe beim Bot; der Leser mit Porträt und Namen
 * aus dem Profil (seit 0.2.140), sonst „Du“; bei zwei Menschen die Farbe.
 * Beispiel: Partie gegen Leon mit Weiß → oben „Leon“ mit Porträt und Marke, unten „Du“.
 */
function Seite({ partie, farbe }: { partie: Partie; farbe: Farbe }) {
  const eigene = useSpeicher((z) => z.daten.spiel.eigeneGegner);
  const profil = useSpielerprofil();
  const e = partie.einstellung;
  const farbname = t(farbe === "white" ? "farbe.w" : "farbe.b");
  const kreis = <span className={`partieuhr-farbe farbe-${farbe}`} title={farbname} />;
  if (e.gegner === "mensch") {
    return (
      <span className="partieuhr-name">
        {kreis}
        {farbname}
      </span>
    );
  }
  if (farbe === e.eigeneFarbe) {
    // Seit 0.2.140 mit eigenem Porträt und Namen (Profil), sonst „Du“.
    return (
      <span className="partieuhr-name">
        {kreis}
        {profil.bild && <Spielerbild profil={profil} />}
        <span className="partieuhr-gegner" data-testid="partie-spielername">
          {spielername(profil)}
        </span>
      </span>
    );
  }
  const name = gegnername(e.bot, e.botName, eigene);
  return (
    <span className="partieuhr-name">
      {kreis}
      {name && <GegnerBild bot={e.bot} eigene={eigene} name={name} />}
      <span className="partieuhr-gegner">{name ?? t("partie.engine")}</span>
      <Stufenmarke stufe={e.stufe} klein />
    </span>
  );
}

/**
 * Die Uhr einer Seite über oder unter dem Brett: Name (beim Gegner mit Porträt und Stufe) und
 * Restzeit, unter zehn Sekunden rot.
 */
export function Partieuhr({
  partie,
  farbe,
  uhr,
  jetztMs,
}: {
  partie: Partie;
  farbe: Farbe;
  uhr: Uhrstand;
  jetztMs: number;
}) {
  const rest = restzeit(uhr, farbe, jetztMs);
  return (
    <div
      className="partieuhr"
      data-tour="partie-uhr"
      data-laeuft={uhr.laeuft === farbe}
      data-knapp={rest < KNAPP_MS}
      data-testid={`uhr-${farbe}`}
    >
      <Seite partie={partie} farbe={farbe} />
      <span className="partieuhr-zeit" role="timer">
        {zeitAlsText(rest)}
      </span>
    </div>
  );
}
