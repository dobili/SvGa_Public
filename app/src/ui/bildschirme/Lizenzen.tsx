/**
 * Impressum, Datenschutz und Lizenzen aller Bausteine (Konzept 2 und 10.1).
 *
 * Rolle im Gesamtbild: Die GPL verlangt den Hinweis auf die Lizenz und den Quellcode; die
 * Figurenschrift SkakNew (LPPL) und die Schriften (OFL) verlangen Namensnennung.
 * Impressum und Datenschutz stehen als statische Seiten neben der Startseite des Buches
 * (/impressum/, /datenschutz/); hier nur die Verweise.
 * Die Texte dieser Seite sind rechtliche Angaben in fester Form und stehen deshalb hier und
 * nicht in der Sprachdatei; die englische Fassung bekommt eine eigene Seite.
 * Abhängigkeiten: Kopfzeile.
 */
import { Kopfzeile } from "../komponenten/Kopfzeile";

/** Bausteine mit Lizenz; `text` verweist auf den mitgelieferten Lizenztext in public/lizenzen/. */
const BAUSTEINE: readonly { name: string; lizenz: string; herkunft: string; text?: string }[] = [
  {
    name: "Schach von Grund auf (App)",
    lizenz: "GNU GPL 3.0 oder neuer",
    herkunft: "github.com/dobili/schach_von_grund_auf",
    text: "/lizenzen/gpl-3.0.txt",
  },
  {
    name: "Buchinhalte (Stellungen, Texte, Cover)",
    lizenz: "Alle Rechte vorbehalten",
    herkunft: "Buch „Schach von Grund auf“",
  },
  {
    name: "Stockfish 19 (Stockfish.js, Chess.com)",
    lizenz: "GNU GPL 3.0",
    herkunft: "github.com/nmrugg/stockfish.js",
    text: "/engine/LIZENZ-stockfish.txt",
  },
  { name: "chessops", lizenz: "GNU GPL 3.0", herkunft: "github.com/niklasf/chessops" },
  {
    name: "Figurenschrift SkakNew (Ulrich Dirr)",
    lizenz: "LaTeX Project Public License 1.2 oder neuer",
    herkunft: "CTAN, Paket skaknew; in Vektorpfade umgewandelt, nicht die Originalschrift",
    text: "/lizenzen/lppl-1.3c.txt",
  },
  {
    name: "Figurensatz „kontrastreich“ (Colin M. L. Burnett)",
    lizenz: "GNU GPL 2.0 oder neuer (hier unter GPL 3.0)",
    herkunft: "Wikimedia Commons, über Lichess (github.com/lichess-org/lila, Satz cburnett)",
    text: "/lizenzen/gpl-3.0.txt",
  },
  {
    name: "Source Sans 3, Source Serif 4",
    lizenz: "SIL Open Font License 1.1",
    herkunft: "Adobe, über Fontsource",
    text: "/lizenzen/ofl-source-sans-3.txt",
  },
  {
    name: "Holzbilder der Brettfarbe „Holz“ (Wood095, Wood026)",
    lizenz: "CC0 1.0 (gemeinfrei)",
    herkunft: "ambientCG.com; gedreht, aufgehellt, als WebP gespeichert",
  },
  {
    name: "Eröffnungsnamen außerhalb des Buches (chess-openings)",
    lizenz: "CC0 1.0 (gemeinfrei)",
    herkunft: "Lichess, github.com/lichess-org/chess-openings; Familiennamen übersetzt",
  },
  { name: "React", lizenz: "MIT", herkunft: "react.dev" },
  { name: "Workbox, vite-plugin-pwa", lizenz: "MIT", herkunft: "Google, Vite PWA" },
  { name: "Lucide-Symbole", lizenz: "ISC", herkunft: "lucide.dev" },
];

export function Lizenzen({ beiZurueck }: { beiZurueck?: () => void }) {
  return (
    <div className="bildschirm">
      <Kopfzeile titel="Lizenzen" zurueckText="Zurück" beiZurueck={beiZurueck} />
      <section className="karte">
        <h2 className="karte-titel">Impressum und Datenschutz</h2>
        <p>
          <a href="/impressum/">Impressum</a> · <a href="/datenschutz/">Datenschutz</a>
        </p>
      </section>
      <section className="karte">
        <h2 className="karte-titel">Lizenzen</h2>
        <ul className="lizenzliste">
          {BAUSTEINE.map((baustein) => (
            <li key={baustein.name}>
              <strong>{baustein.name}</strong>
              <br />
              {baustein.lizenz} · {baustein.herkunft}
              {baustein.text && (
                <>
                  {" · "}
                  <a href={baustein.text} target="_blank" rel="noreferrer">
                    Lizenztext
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
