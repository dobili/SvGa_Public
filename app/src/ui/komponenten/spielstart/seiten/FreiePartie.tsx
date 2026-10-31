/**
 * Unterseite „Freie Partie“ (Entwurf J3): Mensch gegen Mensch am selben Gerät, Stellung aufbauen
 * (Editor) und eigene Stellung (FEN).
 *
 * Rolle im Gesamtbild: Vorher der Schalter „Engine | Mensch“ über der Gegnerwahl und die Karte
 * der Startstellung am Ende des Bildschirms. Ohne den Schalter „Mensch“ spielt der zuletzt
 * gewählte Gegner (Bot oder eigene Stufe) aus der Stellung; eine aufgebaute Stellung zählt nicht
 * für die Wertung, aus ihr gibt es auch „Ohne Uhr“ (Blatt „Partie einstellen“).
 * Abhängigkeiten: Unterseite, Startstellung, spielwahl.ts, spiel/partie.ts, engine/gegner.ts,
 * engine/gruppe.ts, i18n, lucide-react.
 */
import { Users } from "lucide-react";
import { gegnerVon } from "../../../../engine/gegner";
import { istGruppe } from "../../../../engine/gruppe";
import { t } from "../../../../i18n/sprache";
import { spielbar } from "../../../../spiel/partie";
import { useSpeicher } from "../../../../speicher/speicher";
import { Startstellung } from "../Startstellung";
import { Unterseite } from "../Unterseite";
import { abgeleitet, useSpielwahl } from "../useSpielwahl";
import type { Startgegner } from "../startangaben";

/** Größe des Zeichens am Schalter (Bildpunkte). */
const ZEICHEN = 20;

/** Die Seite. Beispiel: Schalter „Mensch“ an, König und Dame aufgebaut → Leiste „Mensch · Spielen“. */
export function FreiePartie({ startFen, abbildung }: { startFen?: string; abbildung?: string }) {
  const sw = useSpielwahl(startFen, abbildung);
  const eigene = useSpeicher((z) => z.daten.spiel.eigeneGegner);
  const v = sw.wahl.vorlieben;
  const mensch = v.gegner === "mensch";
  const bekannt =
    gegnerVon(v.bot) !== null || istGruppe(v.bot) || eigene.some((g) => g.kennung === v.bot);
  const art: Startgegner = mensch ? "mensch" : bekannt ? "bot" : "stufe";
  const seite = abgeleitet(sw, bekannt || mensch ? v : { ...v, bot: null });
  return (
    <Unterseite
      titel={t("spielenneu.seite.frei.titel")}
      kennung="frei"
      sw={seite}
      art={art}
      moeglich={spielbar(sw.fen)}
      kinder={
        <>
          <section className="karte" data-tour="spielen-gegnerart">
            <label className="schalterzeile spielen-mensch">
              <Users size={ZEICHEN} aria-hidden="true" />
              <span>{t("spielen.gegner.mensch")}</span>
              <input
                type="checkbox"
                role="switch"
                checked={mensch}
                onChange={(e) => seite.mit({ gegner: e.target.checked ? "mensch" : "engine" })}
              />
            </label>
            <p className="hinweis">
              {t(mensch ? "spielenneu.seite.frei.mensch" : "spielenneu.seite.frei.engine")}
            </p>
          </section>
          <Startstellung fen={sw.fen} abbildung={sw.abbildung} setzeFen={sw.uebernimm} />
          {!spielbar(sw.fen) && <p className="fehlertext">{t("spielen.nichtSpielbar")}</p>}
        </>
      }
    />
  );
}
