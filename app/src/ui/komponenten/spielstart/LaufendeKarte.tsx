/**
 * Karte „Partie läuft“ oben auf der Startseite von „Spielen“ (Entwurf J3): kleines Brett der
 * aktuellen Stellung, Gegner und Bedenkzeit, Knopf „Weiterspielen“. Nur, wenn eine Partie läuft.
 *
 * Rolle im Gesamtbild: Ersetzt die Karte „Laufende Partie“ aus partienliste/Partienliste.tsx auf
 * diesem Bildschirm. Das Brett ist ein selbst gezeichnetes SVG (Felder und Figurenzeichen), nur
 * Schmuck; die Rückfrage beim Ersetzen bleibt am Knopf „Spielen“ (BeginnenKnopf).
 * Abhängigkeiten: spiel/partie.ts (aktuelleFen), engine/gegner.ts, Navigation, Speicher, i18n.
 */
import { useNavigation } from "../../../app/navigationsKontext";
import { gegnername } from "../../../engine/gegner";
import { t } from "../../../i18n/sprache";
import { aktuelleFen, type Partie } from "../../../spiel/partie";
import { useSpeicher } from "../../../speicher/speicher";

/** Kantenlänge eines Feldes im SVG (Einheiten) und Zahl der Felder je Reihe. */
const FELD = 10;
const REIHE = 8;
const MINUTE_MS = 60_000;
const SEKUNDE_MS = 1000;
/** Figurenzeichen nach FEN-Buchstabe (Unicode-Schachfiguren). */
const FIGUREN: Readonly<Record<string, string>> = {
  K: "♔",
  Q: "♕",
  R: "♖",
  B: "♗",
  N: "♘",
  P: "♙",
  k: "♚",
  q: "♛",
  r: "♜",
  b: "♝",
  n: "♞",
  p: "♟",
};

/** Die 64 Felder einer FEN als Liste von Zeichen oder „“ (a8 zuerst). */
function felderAusFen(fen: string): string[] {
  const reihen = (fen.split(" ")[0] ?? "").split("/");
  return reihen.flatMap((reihe) =>
    [...reihe].flatMap((z) => (/\d/.test(z) ? Array<string>(Number(z)).fill("") : [z])),
  );
}

/** Ein kleines Brett als SVG; für Bildschirmleser verborgen. */
export function Minibrett({ fen }: { fen: string }) {
  const felder = felderAusFen(fen);
  return (
    <svg className="minibrett" viewBox={`0 0 ${FELD * REIHE} ${FELD * REIHE}`} aria-hidden="true">
      {felder.map((figur, i) => {
        const x = (i % REIHE) * FELD;
        const y = Math.floor(i / REIHE) * FELD;
        const dunkel = (Math.floor(i / REIHE) + (i % REIHE)) % 2 === 1;
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={FELD}
              height={FELD}
              className={dunkel ? "mb-dunkel" : "mb-hell"}
            />
            {figur && (
              <text x={x + FELD / 2} y={y + FELD * 0.82} textAnchor="middle" className="mb-figur">
                {FIGUREN[figur] ?? ""}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/** „gegen Derya · 10 + 0“ */
function gegenzeile(partie: Partie, eigene: Parameters<typeof gegnername>[2]): string {
  const e = partie.einstellung;
  const gegner =
    e.gegner === "mensch"
      ? t("spielen.gegner.mensch")
      : (gegnername(e.bot, e.botName, eigene) ?? t("spielen.kategorie.stufe"));
  const uhr = e.uhr
    ? t("spielen.uhr.kurz", {
        minuten: e.uhr.grundzeitMs / MINUTE_MS,
        sekunden: e.uhr.zuschlagMs / SEKUNDE_MS,
      })
    : t("spielen.uhr.ohne");
  return t("spielenneu.laufend.zeile", { gegner, uhr });
}

/** Die Karte. Beispiel: Partie gegen Derya mit 10 + 0 → Brett, „Partie läuft“, „gegen Derya · 10 + 0“. */
export function LaufendeKarte({ partie }: { partie: Partie }) {
  const { navigiere } = useNavigation();
  const eigene = useSpeicher((z) => z.daten.spiel.eigeneGegner);
  return (
    <section
      className="karte laufende-karte"
      data-testid="laufende-partie"
      data-tour="spielen-laufend"
    >
      <Minibrett fen={aktuelleFen(partie)} />
      <div className="laufende-text">
        <h2 className="karte-titel">{t("spielenneu.laufend.titel")}</h2>
        <p>{gegenzeile(partie, eigene)}</p>
      </div>
      <button
        type="button"
        className="knopf-haupt"
        onClick={() => navigiere({ bildschirm: "partie", id: partie.id })}
      >
        {t("spielen.fortsetzen")}
      </button>
    </section>
  );
}
