/**
 * Karte „Zuletzt gespielt“ auf der Startseite von „Spielen“ (Entwurf J3): die letzten Partien gegen
 * Bots mit Porträt, Name, Tag und Bedenkzeit, Ergebnis und „Revanche“.
 *
 * Rolle im Gesamtbild: „Revanche“ nutzt den Einstieg „Partie gegen diesen Bot“
 * (vorbelegung.ts) mit Bot und Zeitart der Partie; danach zeigt die Karte „Schnell eine Partie“
 * genau diesen Bot. Ein Tipp auf den Namen öffnet die Partie mit Ergebnis und Auswertung. Das
 * Ergebnis zeigt die vorhandene Ergebnismarke (Pokal, Händedruck, Kreuz; Symbolsprache DS25).
 * Abhängigkeiten: zuletzt.ts, vorbelegung.ts, GegnerBild, partie/Ergebnismarke (nur lesen),
 * engine/gegner.ts, Navigation, Speicher, i18n.
 */
import { useNavigation } from "../../../app/navigationsKontext";
import { gegnername } from "../../../engine/gegner";
import { t } from "../../../i18n/sprache";
import { useSpeicher } from "../../../speicher/speicher";
import { GegnerBild } from "../gegner/GegnerBild";
import { Ergebnismarke } from "../partie/Ergebnismarke";
import { useSpielvorbelegung } from "./vorbelegung";
import { tageZurueck, zuletztGespielt, type Zuletztzeile } from "./zuletzt";

const MINUTE_MS = 60_000;
const SEKUNDE_MS = 1000;
/** Ab so vielen Tagen steht „vor N Tagen“ nicht mehr, sondern das Datum. */
const TAGE_HOECHSTENS = 6;

/** „heute“, „gestern“, „vor 3 Tagen“ oder „24.10.“ */
function tagtext(begonnen: string, jetzt: Date): string {
  const tage = tageZurueck(begonnen, jetzt);
  if (tage === 0) return t("spielenneu.zuletzt.heute");
  if (tage === 1) return t("spielenneu.zuletzt.gestern");
  if (tage <= TAGE_HOECHSTENS) return t("spielenneu.zuletzt.vorTagen", { tage });
  const d = new Date(begonnen);
  return t("spielenneu.zuletzt.datum", { tag: d.getDate(), monat: d.getMonth() + 1 });
}

/** Eine Zeile mit Revanche. */
function Zeile({ z, jetzt }: { z: Zuletztzeile; jetzt: Date }) {
  const { navigiere } = useNavigation();
  const spiele = useSpielvorbelegung();
  const eigene = useSpeicher((s) => s.daten.spiel.eigeneGegner);
  const e = z.partie.einstellung;
  const name = gegnername(z.bot, e.botName, eigene) ?? "";
  const uhr = e.uhr
    ? t("spielen.uhr.kurz", {
        minuten: e.uhr.grundzeitMs / MINUTE_MS,
        sekunden: e.uhr.zuschlagMs / SEKUNDE_MS,
      })
    : t("spielen.uhr.ohne");
  return (
    <li className="zuletzt-zeile">
      <button
        type="button"
        className="zuletzt-wer"
        onClick={() => navigiere({ bildschirm: "partie", id: z.partie.id })}
      >
        <GegnerBild bot={z.bot} eigene={eigene} name={name} />
        <span className="zuletzt-text">
          <strong>{name}</strong>
          <span>{`${tagtext(z.partie.begonnen, jetzt)} · ${uhr}`}</span>
        </span>
      </button>
      <Ergebnismarke partie={z.partie} />
      <button
        type="button"
        className="knopf-zweit zuletzt-revanche"
        aria-label={t("spielenneu.zuletzt.revancheGegen", { name })}
        onClick={() => spiele({ bot: z.bot, tempo: z.tempo })}
      >
        {t("spielenneu.zuletzt.revanche")}
      </button>
    </li>
  );
}

/** Die Karte; ohne passende Partie nichts. `jetzt` für Tests. */
export function ZuletztGespielt({ jetzt = new Date() }: { jetzt?: Date }) {
  const partien = useSpeicher((s) => s.daten.spiel.partien);
  const eigene = useSpeicher((s) => s.daten.spiel.eigeneGegner);
  const zeilen = zuletztGespielt(partien, eigene);
  if (zeilen.length === 0) return null;
  return (
    <section className="karte zuletzt" data-testid="zuletzt-gespielt" data-tour="spielen-zuletzt">
      <h2 className="karte-titel">{t("spielenneu.zuletzt.titel")}</h2>
      <ul className="zuletzt-liste">
        {zeilen.map((z) => (
          <Zeile key={z.partie.id} z={z} jetzt={jetzt} />
        ))}
      </ul>
    </section>
  );
}
