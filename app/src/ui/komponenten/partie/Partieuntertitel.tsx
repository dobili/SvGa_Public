/**
 * Untertitel des Partie-Bildschirms: Gegner, Stufen, eigene Farbe und Eröffnung; gegen einen Bot
 * sein Porträt links und seine Beschreibung daneben.
 *
 * Rolle im Gesamtbild: Eigene Datei, damit bildschirme/Partie.tsx unter 400 Zeilen bleibt;
 * eingelesene Partien (PGN-Import) haben einen eigenen Untertitel. Wunsch des Autors
 * (24.10.2026): Das Porträt gehört nicht in die Titelzeile (Umbruch des Namens), sondern
 * linksbündig darunter, daneben der Satz des Bots aus der Gegnerwahl statt nur der Stufenangabe;
 * Stufen, Farbe und Eröffnung stehen klein darunter. Seit „Weniger Text“ P3 (31.10.2026) zeigt
 * gegen einen Bot der kompakte Kopf (Partiekopf.tsx) Porträt mit Stufenmarke und zwei Chips; die
 * Zeile steht im ⓘ, der Satz des Bots in der Sprechblase am Porträt.
 * Abhängigkeiten: engine/gegner.ts, engine/stufen.ts, spiel/partie.ts, speicher, Partiekopf.tsx, i18n.
 */
import {
  gegnername,
  gegnerVon as botVon,
  klasseVon,
  type EigenerGegner,
} from "../../../engine/gegner";
import { gruppenstufe } from "../../../engine/gruppe";
import { stufe } from "../../../engine/stufen";
import { t } from "../../../i18n/sprache";
import {
  EROEFFNUNG_BUCH,
  EROEFFNUNG_PRAXIS,
  PRAXIS_VORSILBE,
  type Partie as PartieDaten,
} from "../../../spiel/partie";
import { useSpeicher } from "../../../speicher/speicher";
import { Partiekopf } from "./Partiekopf";

/** Die Eröffnung als Text für die volle Zeile: „Eröffnung wie Menschen dieser Stärke“. */
function eroeffnungstext(gewaehlt: string | null): string | null {
  if (gewaehlt === EROEFFNUNG_BUCH) return t("partie.eroeffnungBuch");
  if (gewaehlt === EROEFFNUNG_PRAXIS) return t("partie.eroeffnungPraxis");
  return gewaehlt?.startsWith(PRAXIS_VORSILBE) ? gewaehlt.slice(PRAXIS_VORSILBE.length) : gewaehlt;
}

/**
 * Ein Wort für den Eröffnungsmodus im Chip (Weniger Text P3): „Buch“, „Praxis“ (auch mit einer
 * benannten Eröffnung der Praxis) oder „Gewählt“ für eine feste Eröffnung; null ohne Vorgabe.
 */
function eroeffnungswort(gewaehlt: string | null): string | null {
  if (!gewaehlt) return null;
  if (gewaehlt === EROEFFNUNG_BUCH) return t("wenigertext.seiten.partie.wort.buch");
  if (gewaehlt === EROEFFNUNG_PRAXIS || gewaehlt.startsWith(PRAXIS_VORSILBE))
    return t("wenigertext.seiten.partie.wort.praxis");
  return t("wenigertext.seiten.partie.wort.gewaehlt");
}

/**
 * Stufen als Text und als Nummer für die Marke am Porträt. Vorgefertigte Gegner verraten ihre
 * Stufen je Phase nicht (0.2.46): nur ihre Gruppe, wie in der Gegnerwahl (seit 0.2.144, N779).
 * Verschiedene Stufen je Phase: keine Nummer (die Zeile im ⓘ nennt alle drei).
 */
function stufenangabe(partie: PartieDaten): { text: string; nummer: number | null } {
  const je = partie.einstellung.stufenJePhase;
  const verschieden = je.eroeffnung !== je.mittelspiel || je.endspiel !== je.mittelspiel;
  const vorgefertigt = botVon(partie.einstellung.bot);
  const klasse = vorgefertigt ? klasseVon(vorgefertigt) : null;
  if (klasse)
    return {
      text: t("partie.stufe", { nummer: klasse.nummer, name: t(klasse.name) }),
      nummer: klasse.nummer,
    };
  if (verschieden)
    return {
      text: t("partie.stufenJePhase", { e: je.eroeffnung, m: je.mittelspiel, s: je.endspiel }),
      nummer: null,
    };
  const s = stufe(partie.einstellung.stufe);
  return { text: t("partie.stufe", { nummer: s.nummer, name: t(s.name) }), nummer: s.nummer };
}

/** Der Satz des Bots: Gruppe, vorgefertigter Bot oder eigener Gegner; sonst null. */
function botbeschreibung(partie: PartieDaten, eigene: readonly EigenerGegner[]): string | null {
  const gruppe = gruppenstufe(partie.einstellung.bot);
  if (gruppe !== null) return t("gruppe.text", { nummer: String(gruppe) });
  const vorgefertigt = botVon(partie.einstellung.bot);
  if (vorgefertigt) return t(vorgefertigt.beschreibung);
  return eigene.some((g) => g.kennung === partie.einstellung.bot)
    ? t("spielen.bot.eigenerText")
    : null;
}

/**
 * „Stufe 1 · Einsteiger · du spielst Schwarz“, bei Mensch gegen Mensch „Beide Seiten selbst“, bei
 * einer eingelesenen Partie die Namen und die eigene Farbe (seit 0.2.117).
 */
export function Untertitel({ partie }: { partie: PartieDaten }) {
  const eigene = useSpeicher((z) => z.daten.spiel.eigeneGegner);
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
  const eroeffnung = eroeffnungstext(gewaehlt);
  const stufen = stufenangabe(partie);
  const stufentext = bot ? t("partie.gegnerBot", { name: bot, stufen: stufen.text }) : stufen.text;
  const zeilentext = eroeffnung
    ? t("partie.untertitelEroeffnung", { stufe: stufentext, farbe, eroeffnung })
    : t("partie.untertitel", { stufe: stufentext, farbe });
  if (!bot) return <p className="partie-untertitel">{zeilentext}</p>;
  return (
    <Partiekopf
      angaben={{
        bot: partie.einstellung.bot,
        name: bot,
        eigene,
        stufennummer: stufen.nummer,
        eigeneFarbe: partie.einstellung.eigeneFarbe,
        eroeffnungswort: eroeffnungswort(gewaehlt),
        zeile: zeilentext,
        beschreibung: botbeschreibung(partie, eigene),
      }}
    />
  );
}
