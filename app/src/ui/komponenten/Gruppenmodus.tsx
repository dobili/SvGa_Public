/**
 * Bausteine des Gruppenmodus (Wunsch des Autors, 24.10.2026): das Bild der Gruppe (die Gesichter
 * ihrer Bots übereinandergelegt wie in der zugeklappten Stufenzeile), die Zeile unter dem
 * Porträtgitter einer Stufe (Knopf „Gruppenmodus“ oder der Hinweis, was ihn freischaltet), die
 * Stärkeangabe („Stärke unbekannt“ bis zum ersten Sieg) und die Gratulation, wenn eine Gruppe
 * frei wird.
 *
 * Rolle im Gesamtbild: engine/gruppe.ts entscheidet, wann eine Gruppe frei ist; hier steht nur die
 * Anzeige. Die Gratulation erscheint einmal je Gruppe (Merker auf dem Gerät, app/merker.ts) nach
 * dem Ende der Partie, die den letzten Bot der Stufe besiegt hat.
 * Seit 0.2.144 feiert die Gratulation mit Feuerwerk (Feuerwerk.tsx) und Feierton (app/ton.ts).
 * Abhängigkeiten: engine/gruppe.ts, engine/gegner.ts, gegnerportraet.ts, app/merker.ts,
 * app/ton.ts, app/einstellungen.ts, Feuerwerk.tsx, speicher, i18n, lucide-react.
 */
import { Users } from "lucide-react";
import { useEffect, useState, type CSSProperties } from "react";
import { liesMerker, schreibeMerker } from "../../app/merker";
import {
  freieGruppen,
  gruppeFrei,
  gruppenkennung,
  gruppenstufe,
  mitgliederDerGruppe,
} from "../../engine/gruppe";
import type { Stufennummer } from "../../engine/stufen";
import { t } from "../../i18n/sprache";
import type { Besiegte } from "../../speicher/besiegt";
import { MitInfo } from "./InfoKnopf";
import { Feuerwerk } from "./Feuerwerk";
import { useEinstellungen } from "../../app/einstellungen";
import { spieleKlang } from "../../app/ton";
import { useSpeicher } from "../../speicher/speicher";
import { portraet } from "./gegnerportraet";
import { gruppenstaerketext } from "./gruppentexte";

/** Merker der Gruppen, deren Gratulation schon gezeigt wurde („2,3“). */
const MERKER_GEZEIGT = "gruppenGratuliert";
const SYMBOL_GROESSE = 22;
const SYMBOL_GROSS = 48;
const VOLLKREIS = 360;

/**
 * Das Bild der Gruppe: die Gesichter der Stufe klein auf einem Kreis, zusammen so groß wie ein
 * Porträt (seit 0.2.144, Wunsch des Autors 25.10.2026: Die Reihe aus acht Gesichtern ragte in der
 * Gegnerwahl, der Partienliste und der Uhr über das Porträt hinaus).
 * Beispiel: Stufe 1 mit acht Bots → acht Gesichter im Abstand von 45 Grad, das erste oben.
 */
export function Gruppenbild({ stufe }: { stufe: Stufennummer }) {
  const mitglieder = mitgliederDerGruppe(stufe);
  return (
    <span className="gruppenbild" aria-hidden="true">
      {mitglieder.map((g, i) => (
        <img
          key={g.kennung}
          src={portraet(g.kennung)}
          alt=""
          style={{ "--winkel": `${(VOLLKREIS * i) / mitglieder.length}deg` } as CSSProperties}
        />
      ))}
    </span>
  );
}

/**
 * Unter dem Porträtgitter einer Stufe: der Knopf „Gruppenmodus“ (frei, wählbar wie eine Kachel)
 * oder der Satz, dass alle Bots der Stufe besiegt sein müssen.
 */
export function Gruppenzeile({
  stufe,
  bot,
  beiBot,
}: {
  stufe: Stufennummer;
  bot: string | null;
  beiBot: (bot: string | null) => void;
}) {
  const besiegt = useSpeicher((z) => z.daten.spiel.besiegt);
  const kennung = gruppenkennung(stufe);
  if (!gruppeFrei(besiegt, stufe)) {
    // Seit 0.2.137 nur eine kurze Zeile, die Erklärung hinter dem Fragezeichen.
    return (
      <div className="gruppenhinweis">
        <MitInfo
          thema={t("gruppe.knopf")}
          zeile={<span className="hinweis">{t("gruppe.gesperrtKurz")}</span>}
          erklaerung={<p>{t("gruppe.gesperrt")}</p>}
        />
      </div>
    );
  }
  return (
    <button
      type="button"
      role="radio"
      aria-checked={bot === kennung}
      className="gruppenknopf"
      data-testid={`gruppenknopf-${stufe}`}
      onClick={() => beiBot(kennung)}
    >
      <Users size={SYMBOL_GROESSE} aria-hidden="true" />
      <span className="gruppenknopf-text">
        <strong>{t("gruppe.knopf")}</strong>
        <span className="hinweis">{gruppenstaerketext(besiegt, stufe)}</span>
      </span>
      <Gruppenbild stufe={stufe} />
    </button>
  );
}

/** Gruppen, deren Gratulation noch aussteht: frei, aber nicht im Merker. */
function nochNichtGratuliert(besiegt: Besiegte): Stufennummer[] {
  const gezeigt = new Set((liesMerker(MERKER_GEZEIGT) ?? "").split(",").filter(Boolean));
  return freieGruppen(besiegt).filter((n) => !gezeigt.has(String(n)));
}

function merkeGratuliert(stufen: readonly Stufennummer[]): void {
  const bisher = (liesMerker(MERKER_GEZEIGT) ?? "").split(",").filter(Boolean);
  schreibeMerker(MERKER_GEZEIGT, [...new Set([...bisher, ...stufen.map(String)])].join(","));
}

/**
 * Die Gratulation nach der Partie, die eine Gruppe frei gemacht hat: einmal je Gruppe, mit
 * Symbol und den Gesichtern der Stufe; „Weiter“ schließt sie. Beispiel: letzter Bot der Stufe 2
 * besiegt → „Glückwunsch! … Gruppenmodus der Stufe 2 freigeschaltet“.
 * Sonderfall: Ist die Partie selbst eine Gruppenpartie, gratuliert nichts (keine neue Gruppe).
 */
export function Gruppenfreischaltung({ gegnerBot }: { gegnerBot: string | null }) {
  const besiegt = useSpeicher((z) => z.daten.spiel.besiegt);
  // Geschlossene Gruppen dieser Anzeige; der Merker hält sie dauerhaft fest.
  const [geschlossen, setzeGeschlossen] = useState<readonly Stufennummer[]>([]);
  if (gruppenstufe(gegnerBot) !== null) return null;
  const offen = nochNichtGratuliert(besiegt).filter((n) => !geschlossen.includes(n));
  const erste = offen[0];
  if (erste === undefined) return null;
  const weiter = () => {
    merkeGratuliert([erste]);
    setzeGeschlossen([...geschlossen, erste]);
  };
  return (
    <div
      className="gruppen-gratulation"
      role="dialog"
      aria-modal="true"
      data-testid="gruppen-gratulation"
    >
      <Feuerwerk />
      <Feierton />
      <div className="gruppen-gratulation-karte">
        <Users size={SYMBOL_GROSS} aria-hidden="true" className="gruppen-gratulation-symbol" />
        <h2>{t("gruppe.gratulation.titel")}</h2>
        <p>{t("gruppe.gratulation.text", { nummer: String(erste) })}</p>
        <span className="gruppen-gratulation-bild">
          <Gruppenbild stufe={erste} />
        </span>
        <button type="button" className="knopf-haupt" onClick={weiter}>
          {t("gruppe.gratulation.weiter")}
        </button>
      </div>
    </div>
  );
}

/**
 * Spielt einmal den Feierton, wenn der Ton eingeschaltet ist (Einstellungen › Ton); auch für die
 * Gratulation bei einem vollen Ring (Ringfeier.tsx).
 */
export function Feierton() {
  const { ton } = useEinstellungen();
  useEffect(() => {
    if (ton === "an") spieleKlang("feier");
  }, [ton]);
  return null;
}
