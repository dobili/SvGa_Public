/**
 * Untertitel des Partie-Bildschirms: Gegner, Stufen, eigene Farbe und Eröffnung; gegen einen Bot
 * sein Porträt links und seine Beschreibung daneben (seit 0.2.125).
 *
 * Rolle im Gesamtbild: aus bildschirme/Partie.tsx ausgelagert (0.2.117, Dateien unter 400 Zeilen),
 * als die eingelesenen Partien (PGN-Import) einen eigenen Untertitel bekamen. Wunsch des Autors
 * (24.10.2026): Das Porträt gehört nicht in die Titelzeile (Umbruch des Namens), sondern
 * linksbündig darunter, daneben der Satz des Bots aus der Gegnerwahl statt nur der Stufenangabe;
 * Stufen, Farbe und Eröffnung stehen klein darunter.
 * Abhängigkeiten: engine/gegner.ts, engine/stufen.ts, spiel/partie.ts, speicher, GegnerBild.tsx, i18n.
 */
import { durchschnitt, gegnername, gegnerVon as botVon, klasseVon } from "../../engine/gegner";
import { gruppenstufe } from "../../engine/gruppe";
import { stufe } from "../../engine/stufen";
import { t, zahlText } from "../../i18n/sprache";
import {
  EROEFFNUNG_BUCH,
  EROEFFNUNG_PRAXIS,
  PRAXIS_VORSILBE,
  type Partie as PartieDaten,
} from "../../spiel/partie";
import { useSpeicher } from "../../speicher/speicher";
import { GegnerBild } from "./GegnerBild";

/**
 * „Stufe 1 · Einsteiger · du spielst Schwarz“, bei Mensch gegen Mensch „Beide Seiten selbst“, bei
 * einer eingelesenen Partie die Namen und die eigene Farbe (seit 0.2.117).
 */
export function Untertitel({ partie }: { partie: PartieDaten }) {
  const eigene = useSpeicher((z) => z.daten.spiel.eigeneGegner);
  const s = stufe(partie.einstellung.stufe);
  const farbe = t(partie.einstellung.eigeneFarbe === "white" ? "farbe.w" : "farbe.b");
  const importiert = partie.einstellung.importiert;
  if (importiert) {
    return (
      <p className="partie-untertitel">{t("partie.untertitelImport", { ...importiert, farbe })}</p>
    );
  }
  if (partie.einstellung.gegner === "mensch") {
    return <p className="partie-untertitel">{t("partie.untertitelMensch")}</p>;
  }
  const bot = gegnername(partie.einstellung.bot, partie.einstellung.botName);
  const gewaehlt = partie.einstellung.eroeffnung;
  const eroeffnung =
    gewaehlt === EROEFFNUNG_BUCH
      ? t("partie.eroeffnungBuch")
      : gewaehlt === EROEFFNUNG_PRAXIS
        ? t("partie.eroeffnungPraxis")
        : gewaehlt?.startsWith(PRAXIS_VORSILBE)
          ? gewaehlt.slice(PRAXIS_VORSILBE.length)
          : gewaehlt;
  const je = partie.einstellung.stufenJePhase;
  const verschieden = je.eroeffnung !== je.mittelspiel || je.endspiel !== je.mittelspiel;
  const stufenText = verschieden
    ? t("partie.stufenJePhase", { e: je.eroeffnung, m: je.mittelspiel, s: je.endspiel })
    : t("partie.stufe", { nummer: s.nummer, name: t(s.name) });
  // Vorgefertigte Gegner verraten ihre Stufen je Phase nicht (0.2.46): nur Durchschnitt und Klasse.
  const vorgefertigt = botVon(partie.einstellung.bot);
  const botText = vorgefertigt
    ? t("partie.gegnerSchnitt", {
        schnitt: zahlText(durchschnitt(vorgefertigt), 1, false),
        klasse: t(klasseVon(vorgefertigt).name),
      })
    : stufenText;
  const stufentext = bot ? t("partie.gegnerBot", { name: bot, stufen: botText }) : stufenText;
  const zeile = (
    <p className="partie-untertitel">
      {eroeffnung
        ? t("partie.untertitelEroeffnung", { stufe: stufentext, farbe, eroeffnung })
        : t("partie.untertitel", { stufe: stufentext, farbe })}
    </p>
  );
  const eigener = eigene.find((g) => g.kennung === partie.einstellung.bot);
  const gruppe = gruppenstufe(partie.einstellung.bot);
  const beschreibung =
    gruppe !== null
      ? t("gruppe.text", { nummer: String(gruppe) })
      : vorgefertigt
        ? t(vorgefertigt.beschreibung)
        : eigener
          ? t("spielen.bot.eigenerText")
          : null;
  if (!bot || !beschreibung) return zeile;
  return (
    <div className="partie-gegnerzeile" data-testid="partie-gegnerzeile">
      <GegnerBild bot={partie.einstellung.bot} eigene={eigene} name={bot} />
      <div className="partie-gegnertext">
        <p className="partie-gegnerbeschreibung">{beschreibung}</p>
        {zeile}
      </div>
    </div>
  );
}
