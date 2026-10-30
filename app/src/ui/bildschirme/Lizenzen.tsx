/**
 * Impressum, Datenschutz und Lizenzen aller Bausteine (Konzept 2 und 10.1).
 *
 * Rolle im Gesamtbild: Die GPL verlangt den Hinweis auf die Lizenz und den Quellcode; die
 * Figurenschrift SkakNew (LPPL) und die Schriften (OFL) verlangen Namensnennung.
 * Impressum und Datenschutz stehen als statische Seiten neben der Startseite des Buches
 * (/impressum/, /datenschutz/); hier nur die Verweise.
 * Alle Texte dieser Seite stehen in der Sprachdatei, damit es sie auch englisch gibt (AP 18).
 * Abhängigkeiten: Kopfzeile, i18n.
 */
import { t } from "../../i18n/sprache";
import { Kopfzeile } from "../komponenten/rahmen/Kopfzeile";

/** Öffentlicher Quellcode der App, wie ihn die GPL verlangt; als Link, nicht nur als Text. */
const QUELLCODE = "https://github.com/dobili/SvGa_Public";
/**
 * Lizenztexte der eingebauten npm-Pakete mit Copyright-Zeilen, erzeugt von Vite beim Build
 * (build.license in vite.config.ts); MIT und ISC verlangen, dass der Text mitkommt.
 */
const PAKETTEXTE = "/lizenzen/bausteine.txt";

/**
 * Bausteine mit Lizenz; Name, Lizenz und Herkunft stehen in der Sprachdatei
 * (lizenzen.<kennung>.…), dazu wahlweise der Lizenztext und eine Adresse der Quelle.
 */
const BAUSTEINE = [
  { kennung: "app", text: "/lizenzen/gpl-3.0.txt", quelle: QUELLCODE },
  { kennung: "buch" },
  { kennung: "stockfish", text: "/engine/LIZENZ-stockfish.txt" },
  { kennung: "maia", text: "/lizenzen/mit-maia2.txt" },
  { kennung: "onnxruntime", text: "/lizenzen/mit-onnxruntime.txt" },
  { kennung: "chessops", text: PAKETTEXTE },
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
  { kennung: "zusatzpartien", quelle: "https://database.lichess.org/#broadcasts" },
  { kennung: "react", text: PAKETTEXTE },
  { kennung: "workbox", text: PAKETTEXTE },
  { kennung: "lucide", text: PAKETTEXTE },
  { kennung: "idb", text: PAKETTEXTE },
  { kennung: "badrap", text: PAKETTEXTE },
] as const satisfies readonly { kennung: string; text?: string; quelle?: string }[];

/** Die Seite mit Impressum, Datenschutz und den Lizenzen aller Bausteine der App. */
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
              {"quelle" in baustein ? (
                <a href={baustein.quelle} target="_blank" rel="noreferrer">
                  {t(`lizenzen.${baustein.kennung}.herkunft`)}
                </a>
              ) : (
                t(`lizenzen.${baustein.kennung}.herkunft`)
              )}
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
