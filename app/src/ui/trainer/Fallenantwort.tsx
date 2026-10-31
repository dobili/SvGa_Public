/**
 * Frage und Antwort von „Falle oder Köder“ in knapper Form: die Frage groß, darunter die
 * Pfeil-Legende als Zeichen (sein Zug rot, Angebot grau) und eine kleine ⓘ-Zeile mit Seite am
 * Zug, Herkunft und Stufe; nach der Entscheidung ein Banner („Richtig: Falle“), der Verlust als
 * „▼ 11,6 nach Dxd6“, die Fortsetzung und „Besser:“ als goldener Chip.
 *
 * Rolle im Gesamtbild: Runde „Weniger Text“, P12 (Wahl des Autors, 31.10.2026). Teil der
 * Fallenaufgabe (Fallenaufgabe.tsx). Regel aus den Notizen des Autors: Der Verlust beim Nehmen ist
 * eine Veränderung der Bewertung (vorher minus nachher), also Pfeil mit Zahl, kein Balken. Die
 * bisherigen Sätze (Auftrag, Auflösung, Nutzen der Warnsignale) stehen vollständig hinter ⓘ.
 * Abhängigkeiten: ui/werkzeuge/Pfeillegende.tsx (Legendensymbol), ui/werkzeuge/Wertpfeil.tsx,
 * bausteine/InfoKnopf.tsx, lucide-react, i18n.
 * Buchbezug: Kapitel 4, Fallencheck („Falle oder Geschenk?“).
 */
import { ArrowRight, Check, Info, X } from "lucide-react";
import type { ReactNode } from "react";
import { t } from "../../i18n/sprache";
import { MitInfo } from "../komponenten/bausteine/InfoKnopf";
import { Legendensymbol } from "../werkzeuge/Pfeillegende";
import { Wertpfeil } from "../werkzeuge/Wertpfeil";

const SYMBOLGROESSE = 20;
const KLEIN = 16;

/**
 * Die Frage mit Pfeil-Legende und ⓘ-Zeile (der ganze Auftrag als Satz dahinter).
 * Beispiel: „Falle oder Geschenk?“, „[rot] sein Zug Dxh3  [grau] Angebot Dxd6“, „ⓘ Weiß am Zug ·
 * Lichess 942 · Stufe 1“.
 */
export function Fallenfrage({
  vorzug,
  angebot,
  kurzzeile,
  auftrag,
}: {
  vorzug: string;
  angebot: string;
  /** „Weiß am Zug · Herkunft · Stufe 1“. */
  kurzzeile: string;
  /** Der bisherige Auftrag als ganzer Satz. */
  auftrag: string;
}) {
  return (
    <div className="fallenfrage">
      <h2 className="trainerfrage">{t("wenigertext.werkzeug.falle.frage")}</h2>
      <ul className="pfeillegende" data-testid="pfeillegende">
        <li>
          <Legendensymbol zeichen="pfeil" farbe="rot" />
          <span>{t("wenigertext.werkzeug.falle.seinZug", { zug: vorzug })}</span>
        </li>
        <li>
          <Legendensymbol zeichen="pfeil" farbe="grau" />
          <span>{t("wenigertext.werkzeug.falle.angebot", { zug: angebot })}</span>
        </li>
      </ul>
      <MitInfo
        thema={t("wenigertext.werkzeug.falle.auftragThema")}
        zeile={
          <p className="hinweis kurzzeile">
            <Info size={KLEIN} aria-hidden="true" />
            {kurzzeile}
          </p>
        }
        erklaerung={<p>{auftrag}</p>}
      />
    </div>
  );
}

/** Was nach der Entscheidung feststeht. */
export interface Fallenausgang {
  readonly richtig: boolean;
  readonly falle: boolean;
  /** Der angebotene Schlag in der Sprache der App, etwa „Dxd6“. */
  readonly angebot: string;
  /** Verlust beim Nehmen als Zahl („11,6“) oder „Matt“; null beim Geschenk. */
  readonly verlust: string | null;
  /** Der bessere Zug, wenn er ein anderer als das Angebot ist; sonst null. */
  readonly bester: string | null;
  /** Fortsetzung laut Engine. */
  readonly folge: string;
  /** Die bisherigen Sätze für ⓘ: Auflösung, Fortsetzung und Nutzen der Warnsignale. */
  readonly saetze: ReactNode;
}

/** Verlust als Pfeil nach unten mit kurzer Beschriftung: „nach Dxd6 ▼ 11,6“. */
function Verlust({ angebot, verlust, satz }: { angebot: string; verlust: string; satz: string }) {
  return (
    <p className="fallenverlust">
      <span>{t("wenigertext.werkzeug.falle.nach", { zug: angebot })}</span>
      <Wertpfeil richtung="ab" zahl={verlust} name={satz} />
    </p>
  );
}

/** Kopf des Banners: ✓/✗ mit „Richtig: Falle“ oder „Nicht ganz: Geschenk“. */
function Bannerkopf({ richtig, falle }: { richtig: boolean; falle: boolean }) {
  const Bild = richtig ? Check : X;
  const art = t(falle ? "wenigertext.werkzeug.falle.falle" : "wenigertext.werkzeug.falle.geschenk");
  return (
    <p className={`meldung antwortbanner ${richtig ? "gut" : "schlecht"}`} role="status">
      <Bild size={SYMBOLGROESSE} aria-hidden="true" />
      <span>
        {t(richtig ? "wenigertext.werkzeug.falle.richtig" : "wenigertext.werkzeug.falle.falsch", {
          art,
        })}
      </span>
    </p>
  );
}

/**
 * Das Banner nach der Entscheidung mit Verlust, Fortsetzung, Besser-Chip und ⓘ.
 * Beispiel: Falle → „✓ Richtig: Falle“, „nach Dxd6 ▼ 11,6“, „Dxd6 Th5 Th4 …“, „Besser: → Th4+“.
 */
export function Fallenbanner({ ausgang }: { ausgang: Fallenausgang }) {
  return (
    <section
      className={`karte fallenbanner ${ausgang.richtig ? "gut" : "schlecht"}`}
      data-testid="falle-antwort"
    >
      <Bannerkopf richtig={ausgang.richtig} falle={ausgang.falle} />
      {ausgang.verlust && (
        <Verlust
          angebot={ausgang.angebot}
          verlust={ausgang.verlust}
          satz={t("wenigertext.werkzeug.falle.verlustName", { verlust: ausgang.verlust })}
        />
      )}
      <p className="zaehlfolge">{ausgang.folge}</p>
      <MitInfo
        thema={t("wenigertext.werkzeug.falle.erklaerungThema")}
        zeile={
          ausgang.bester ? (
            <p className="besserzeile">
              <span>{t("wenigertext.werkzeug.falle.besser")}</span>
              <span className="besserchip">
                <ArrowRight size={KLEIN} aria-hidden="true" />
                {ausgang.bester}
              </span>
            </p>
          ) : (
            <p className="hinweis">{t("wenigertext.werkzeug.falle.mehr")}</p>
          )
        }
        erklaerung={ausgang.saetze}
      />
    </section>
  );
}
