/**
 * Impressum, Datenschutz und Lizenzen aller Bausteine (Konzept 2 und 10.1).
 *
 * Rolle im Gesamtbild: Die GPL verlangt den Hinweis auf die Lizenz und den Quellcode; die
 * Figurenschrift SkakNew (LPPL) und die Schriften (OFL) verlangen Namensnennung.
 * Impressum und Datenschutz stehen als statische Seiten neben der Startseite des Buches
 * (/impressum/, /datenschutz/); hier nur die Verweise.
 * Seit 0.2.94 stehen alle Texte dieser Seite in der Sprachdatei (Technik für die englische
 * Fassung, AP 18); vorher standen sie als rechtliche Angaben in fester Form hier.
 * Abhängigkeiten: Kopfzeile, i18n.
 */
import { t } from "../../i18n/sprache";
import { Kopfzeile } from "../komponenten/Kopfzeile";

/** Bausteine mit Lizenz; Name, Lizenz und Herkunft stehen in der Sprachdatei (lizenzen.<kennung>.…). */
const BAUSTEINE = [
  { kennung: "app", text: "/lizenzen/gpl-3.0.txt" },
  { kennung: "buch" },
  { kennung: "stockfish", text: "/engine/LIZENZ-stockfish.txt" },
  { kennung: "chessops" },
  { kennung: "skaknew", text: "/lizenzen/lppl-1.3c.txt" },
  { kennung: "cburnett", text: "/lizenzen/gpl-3.0.txt" },
  { kennung: "mpchess", text: "/lizenzen/gpl-3.0.txt" },
  { kennung: "chessnut", text: "/lizenzen/apache-2.0-chessnut.txt" },
  { kennung: "celtic", text: "/lizenzen/mit-chess-art.txt" },
  { kennung: "eiche", text: "/lizenzen/mit-chess-art.txt" },
  { kennung: "kiefer" },
  { kennung: "schriften", text: "/lizenzen/ofl-source-sans-3.txt" },
  { kennung: "holzbilder" },
  { kennung: "materialbretter", text: "/lizenzen/agpl-3.0.txt" },
  { kennung: "portraets", text: "/lizenzen/cc-by-4.0.txt" },
  { kennung: "eroeffnungsnamen" },
  { kennung: "puzzles" },
  { kennung: "react" },
  { kennung: "workbox" },
  { kennung: "lucide" },
] as const satisfies readonly { kennung: string; text?: string }[];

export function Lizenzen({ beiZurueck }: { beiZurueck?: () => void }) {
  return (
    <div className="bildschirm">
      <Kopfzeile
        titel={t("lizenzen.titel")}
        zurueckText={t("lizenzen.zurueck")}
        beiZurueck={beiZurueck}
      />
      <section className="karte">
        <h2 className="karte-titel">{t("lizenzen.rechtliches")}</h2>
        <p>
          <a href="/impressum/">{t("lizenzen.impressum")}</a> ·{" "}
          <a href="/datenschutz/">{t("lizenzen.datenschutz")}</a>
        </p>
      </section>
      <section className="karte">
        <h2 className="karte-titel">{t("lizenzen.titel")}</h2>
        <ul className="lizenzliste">
          {BAUSTEINE.map((baustein) => (
            <li key={baustein.kennung}>
              <strong>{t(`lizenzen.${baustein.kennung}.name`)}</strong>
              <br />
              {t(`lizenzen.${baustein.kennung}.lizenz`)} ·{" "}
              {t(`lizenzen.${baustein.kennung}.herkunft`)}
              {"text" in baustein && (
                <>
                  {" · "}
                  <a href={baustein.text} target="_blank" rel="noreferrer">
                    {t("lizenzen.lizenztext")}
                  </a>
                </>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
